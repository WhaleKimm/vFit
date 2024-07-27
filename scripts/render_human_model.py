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

# glTF 파일로 내보내기
bpy.ops.export_scene.gltf(filepath=glb_file_path, export_format='GLB')
