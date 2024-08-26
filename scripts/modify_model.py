import bpy
import sys
import time
import mathutils

# 오브젝트 제거 함수
def remove_objects_by_name(names):
    start_time = time.time()
    for obj_name in names:
        obj = bpy.data.objects.get(obj_name)
        if obj:
            bpy.data.objects.remove(obj, do_unlink=True)
    end_time = time.time()
    print(f"Time to remove objects: {end_time - start_time:.2f} seconds")

# 특정 버텍스 그룹을 X, Y 및 Z 축으로 스케일링하는 함수
def scale_vertex_group(obj, group_name, scale_factor_x, scale_factor_y, scale_factor_z, proportional_size=1.0):
    start_time = time.time()
    group = obj.vertex_groups.get(group_name)
    if not group:
        print(f"Vertex group '{group_name}' not found.")
        return
    
    # 객체를 편집 모드로 전환
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    
    # 모든 버텍스 선택 해제
    bpy.ops.mesh.select_all(action='DESELECT')
    
    # 버텍스 그룹 선택
    bpy.ops.object.vertex_group_set_active(group=group.name)
    bpy.ops.object.vertex_group_select()
    
    # 선택된 버텍스를 X, Y 및 Z 축으로 스케일링
    bpy.ops.transform.resize(
        value=(scale_factor_x, scale_factor_y, scale_factor_z),
        proportional_edit_falloff='SMOOTH',
        proportional_size=proportional_size,
        use_proportional_edit=True
    )
    
    # 객체 모드로 전환
    bpy.ops.object.mode_set(mode='OBJECT')
    end_time = time.time()
    print(f"Time to scale vertex group '{group_name}': {end_time - start_time:.2f} seconds")

# 버텍스 그룹 이름을 출력하는 함수
def print_vertex_groups(obj):
    if obj and obj.type == 'MESH' and obj.vertex_groups:
        print("Vertex groups in the object:")
        for group in obj.vertex_groups:
            print(group.name)
    else:
        print("No vertex groups found in the object or the object is not a mesh.")

#키 조정 함수
def adjust_height(armature, target_height, original_height=170.0):
    scale_factor = target_height / original_height
    
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='EDIT')
    
    edit_bones = armature.data.edit_bones
    
    # 다리 뼈대 (더 많이 조정)
    leg_bones = ["CC_Base_L_Thigh", "CC_Base_L_Calf", "CC_Base_R_Thigh", "CC_Base_R_Calf"]
    leg_scale_factor = scale_factor ** 1.2  # 다리를 더 극적으로 조정
    
    for bone_name in leg_bones:
        bone = edit_bones.get(bone_name)
        if bone:
            bone.length *= leg_scale_factor
            if "Thigh" in bone_name:
                bone.head.z *= scale_factor
            bone.tail.z *= scale_factor

    # 상체 뼈대 (덜 조정)
    upper_body_bones = ["CC_Base_Waist", "CC_Base_Spine01", "CC_Base_Spine02"]
    upper_scale_factor = scale_factor ** 0.8  # 상체는 덜 조정
    
    for bone_name in upper_body_bones:
        bone = edit_bones.get(bone_name)
        if bone:
            bone.length *= upper_scale_factor
            bone.head.z *= scale_factor
            bone.tail.z *= scale_factor

    # 팔 뼈대
    arm_bones = ["CC_Base_L_Upperarm", "CC_Base_L_Forearm", "CC_Base_R_Upperarm", "CC_Base_R_Forearm"]
    for bone_name in arm_bones:
        bone = edit_bones.get(bone_name)
        if bone:
            bone.length *= scale_factor
    
    # 목과 머리 위치 조정
    neck_head_bones = ["CC_Base_NeckTwist01", "CC_Base_NeckTwist02", "CC_Base_Head"]
    for bone_name in neck_head_bones:
        bone = edit_bones.get(bone_name)
        if bone:
            bone.head.z *= scale_factor
            bone.tail.z *= scale_factor

    bpy.ops.object.mode_set(mode='OBJECT')

# 명령줄 인수 처리
argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--"

input_path = argv[0]
output_path = argv[1]
body_shape = argv[2]
height = float(argv[3])
weight = float(argv[4])

# 모델을 불러옵니다
start_time = time.time()
bpy.ops.import_scene.fbx(filepath=input_path)
end_time = time.time()
print(f"Time to import model: {end_time - start_time:.2f} seconds")

# 기본 큐브 제거
if 'Cube' in bpy.data.objects:
    bpy.data.objects.remove(bpy.data.objects['Cube'], do_unlink=True)

# 제거할 오브젝트 이름 리스트
remove_objects = [
    "Crop_T_Shirt",
    "High_Heels",
    "Denim_shorts",
    "Hair_Base",
    "Real_Hair",
    "Underwear_Bottoms",
    "Bang",
    "Bun"
]

# 오브젝트 제거
remove_objects_by_name(remove_objects)

# 'body.001' 오브젝트를 찾습니다
obj_name = "body.001"
obj = bpy.data.objects.get(obj_name)

# 버텍스 그룹 출력
print_vertex_groups(obj)

if obj:
    bpy.context.view_layer.objects.active = obj

    # 현재 모델이 170cm, 60kg으로 가정
    initial_height = 170
    initial_weight = 60

    # 체중 증가량 계산 (단위: kg)
    weight_increase = weight - initial_weight

    # 아머처 찾기
    armature = obj.find_armature()
    if armature:
        # 키 조정
        adjust_height(armature, height, initial_height)

    # 부위별 체중 증가 비율 설정 (각 부위에 적절한 비율로 증가)
    pelvis_scale_factor = 1 + (0.005 * weight_increase)  # 엉덩이
    thigh_scale_factor = 1 + (0.005 * weight_increase)  # 허벅지
    spine_scale_factor = 1 + (0.0025 * weight_increase)  # 척추
    upper_body_scale_factor = 1 + (0.005 * weight_increase)  # 상체
    head_scale_factor = 1 - (0.0025 * weight_increase)  # 머리 (감소)

    # 엉덩이 부분 스케일링
    scale_vertex_group(obj, "Pelvis", pelvis_scale_factor, pelvis_scale_factor, pelvis_scale_factor, proportional_size=0.8)

    # 허벅지 부분 스케일링
    scale_vertex_group(obj, "Right_thigh", thigh_scale_factor, thigh_scale_factor, thigh_scale_factor, proportional_size=0.8)
    scale_vertex_group(obj, "Left_thigh", thigh_scale_factor, thigh_scale_factor, thigh_scale_factor, proportional_size=0.8)

    # 척추 부분 스케일링
    scale_vertex_group(obj, "Spine", spine_scale_factor, spine_scale_factor, spine_scale_factor, proportional_size=0.8)
    scale_vertex_group(obj, "Spine1", spine_scale_factor, spine_scale_factor, spine_scale_factor, proportional_size=0.8)
    scale_vertex_group(obj, "Spine2", spine_scale_factor, spine_scale_factor, spine_scale_factor, proportional_size=0.8)
    scale_vertex_group(obj, "Spine3", spine_scale_factor, spine_scale_factor, spine_scale_factor, proportional_size=0.8)

    # 상체 부분 스케일링
    scale_vertex_group(obj, "Left_Pectoral", upper_body_scale_factor, upper_body_scale_factor, upper_body_scale_factor, proportional_size=0.8)
    scale_vertex_group(obj, "Right_Pectoral", upper_body_scale_factor, upper_body_scale_factor, upper_body_scale_factor, proportional_size=0.8)

    # 머리 부분 스케일링
    scale_vertex_group(obj, "Head", head_scale_factor, head_scale_factor, head_scale_factor, proportional_size=0.8)

# 모델을 저장합니다
start_time = time.time()
output_path_glb = output_path.replace('.fbx', '.glb')
bpy.ops.export_scene.gltf(filepath=output_path_glb, export_format='GLB', use_selection=False, export_apply=True, export_materials='NONE', export_animations=False)
end_time = time.time()
print(f"Time to export model: {end_time - start_time:.2f} seconds")

print("Model saved to", output_path_glb)
