import bpy
import sys

# 오브젝트 제거 함수
def remove_objects_by_name(names):
    for obj_name in names:
        obj = bpy.data.objects.get(obj_name)
        if obj:
            bpy.data.objects.remove(obj, do_unlink=True)

# 특정 버텍스 그룹을 X 및 Y 축으로 스케일링하는 함수
def scale_vertex_group_xy_axis(obj, group_name, scale_factor, proportional_size=1.0):
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
    
    # 선택된 버텍스를 X 및 Y 축으로만 스케일링
    bpy.ops.transform.resize(
        value=(scale_factor, scale_factor, 1),
        proportional_edit_falloff='SMOOTH',
        proportional_size=proportional_size,
        use_proportional_edit=True
    )
    
    # 객체 모드로 전환
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
bpy.ops.import_scene.fbx(filepath=input_path)

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

# 'CC_Base_Body' 오브젝트를 찾습니다
obj_name = "CC_Base_Body"
obj = bpy.data.objects.get(obj_name)

if obj:
    bpy.context.view_layer.objects.active = obj

    # 복부와 허리 부분에 해당하는 버텍스 그룹을 스케일링
    scale_vertex_group_xy_axis(obj, "CC_Base_Waist", 1.2, proportional_size=0.8)  # 허리 부분
    scale_vertex_group_xy_axis(obj, "CC_Base_Spine01", 1.2, proportional_size=0.8)  # 복부 상단
    scale_vertex_group_xy_axis(obj, "CC_Base_Spine02", 1.2, proportional_size=0.8)  # 복부 하단
    
    # 엉덩이와 허벅지 부분에 해당하는 버텍스 그룹을 스케일링
    scale_vertex_group_xy_axis(obj, "CC_Base_Pelvis", 1.2, proportional_size=0.8)  # 엉덩이 부분
    scale_vertex_group_xy_axis(obj, "CC_Base_L_ThighTwist01", 1.2, proportional_size=0.8)  # 왼쪽 허벅지
    scale_vertex_group_xy_axis(obj, "CC_Base_L_ThighTwist02", 1.2, proportional_size=0.8)  # 왼쪽 허벅지
    scale_vertex_group_xy_axis(obj, "CC_Base_R_ThighTwist01", 1.2, proportional_size=0.8)  # 오른쪽 허벅지
    scale_vertex_group_xy_axis(obj, "CC_Base_R_ThighTwist02", 1.2, proportional_size=0.8)  # 오른쪽 허벅지

    # 팔과 어깨 부분에 해당하는 버텍스 그룹을 스케일링
    scale_vertex_group_xy_axis(obj, "CC_Base_L_UpperarmTwist01", 1.1, proportional_size=0.8)  # 왼쪽 상완
    scale_vertex_group_xy_axis(obj, "CC_Base_L_UpperarmTwist02", 1.1, proportional_size=0.8)  # 왼쪽 상완
    scale_vertex_group_xy_axis(obj, "CC_Base_R_UpperarmTwist01", 1.1, proportional_size=0.8)  # 오른쪽 상완
    scale_vertex_group_xy_axis(obj, "CC_Base_R_UpperarmTwist02", 1.1, proportional_size=0.8)  # 오른쪽 상완

# 모델을 저장합니다
output_path_glb = output_path.replace('.fbx', '.glb')
bpy.ops.export_scene.gltf(filepath=output_path_glb, export_format='GLB')

print("Model saved to", output_path_glb)
