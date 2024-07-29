import bpy
import os

# 스크립트의 디렉토리 경로 얻기
script_dir = os.path.dirname(os.path.abspath(__file__))

# Blender 파일의 경로 설정
blend_file_path = os.path.join(script_dir, '../models/avatars/human_model.blend')
glb_file_path = os.path.join(script_dir, '../static/models/model.glb')

# 경로 출력하여 확인
print("Blender File Path:", blend_file_path)
print("GLB File Path:", glb_file_path)

# 현재 작업 디렉토리 변경
os.chdir(os.path.dirname(blend_file_path))

# Blender 파일이 존재하는지 확인
if os.path.exists(blend_file_path):
    print("Blender file found.")
else:
    print("Blender file not found.")

# Blender에서 파일을 로드
bpy.ops.wm.open_mainfile(filepath=blend_file_path)

# 아마추어와 메쉬 객체 이름 지정 (블렌더 파일에서 이 이름으로 설정되어야 합니다)
armature_name = "Armature"  # 아마추어 객체 이름
mesh_name = "Mesh"  # 메쉬 객체 이름

# 아마추어 모디파이어 추가
mesh_obj = bpy.data.objects[mesh_name]
armature_obj = bpy.data.objects[armature_name]

modifier = mesh_obj.modifiers.new(name='Armature', type='ARMATURE')
modifier.object = armature_obj

# 메쉬와 아마추어를 선택하고 자동으로 스킨 바인딩 설정
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='DESELECT')
mesh_obj.select_set(True)
armature_obj.select_set(True)
bpy.context.view_layer.objects.active = armature_obj
bpy.ops.object.parent_set(type='ARMATURE_AUTO')

# glTF 파일로 내보내기
bpy.ops.export_scene.gltf(
    filepath=glb_file_path,
    export_format='GLB',
    export_yup=True,
    export_apply=True,  # Apply transformations
    export_tangents=False,
    export_normals=True,
    export_skins=True,  # Export skinning information
    export_morph=False,
    export_animations=True,
    export_frame_range=True,
    export_frame_step=1,
    export_force_sampling=True,
    export_current_frame=False,
    export_nla_strips=True,
    export_def_bones=True,
    export_materials='EXPORT',  # Export materials
    export_embed_images=True,  # Embed images in the GLTF file
    export_cameras=False,
    export_lights=False,
)

print("GLTF file exported successfully.")
