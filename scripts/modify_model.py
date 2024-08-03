import bpy

def apply_shape_key(obj, key_name, value):
    if obj.data.shape_keys:
        for key in obj.data.shape_keys.key_blocks:
            if key.name == key_name:
                key.value = value
                print(f"Applied shape key '{key_name}' with value {value}")

def main(input_path, output_path, shape_key_name, shape_key_value):
    # 모델을 불러옵니다
    bpy.ops.import_scene.gltf(filepath=input_path)
    
    # 메쉬 객체를 찾습니다
    mesh_obj = None
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            mesh_obj = obj
            break
    
    if mesh_obj is None:
        print("No mesh object found in the scene.")
        return
    
    # Shape key를 적용합니다
    apply_shape_key(mesh_obj, shape_key_name, shape_key_value)
    
    # 모델을 저장합니다
    bpy.ops.export_scene.gltf(filepath=output_path)
    print(f"Model saved to {output_path}")

# 입력 파라미터 설정
input_path = "C:/vFit/static/models/realistic_female.glb"
output_path = "C:/vFit/static/models/modified_model.glb"
shape_key_name = "target_1"  # 조정할 shape key의 이름
shape_key_value = 1.0  # 적용할 shape key의 값 (0.0에서 1.0 사이)

main(input_path, output_path, shape_key_name, shape_key_value)
