import bpy
import sys

# 명령줄 인수에서 파일 경로 가져오기
argv = sys.argv
argv = argv[argv.index("--") + 1:]
clothes_path = argv[0] if len(argv) > 0 else 'C:/vFit/static/models/clothes/black_tshirt.fbx'

# 블렌더 초기화: 기존 데이터 삭제
bpy.ops.wm.read_factory_settings(use_empty=True)

# 옷 모델 불러오기
bpy.ops.import_scene.fbx(filepath=clothes_path)
shirts = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']

if not shirts:
    print("Shirt not imported correctly.")
else:
    shirt = shirts[0]
    print(f"Shirt loaded: {shirt.name}")

    # 옷의 버텍스 그룹을 분석하기
    vertex_groups = shirt.vertex_groups

    if not vertex_groups:
        print("No vertex groups found.")
    else:
        for vg in vertex_groups:
            vertices_in_group = [v for v in shirt.data.vertices if vg.index in [vg_elem.group for vg_elem in v.groups]]
            print(f"Vertex Group: {vg.name}, Number of Vertices: {len(vertices_in_group)}")

print("Vertex group analysis complete.")
