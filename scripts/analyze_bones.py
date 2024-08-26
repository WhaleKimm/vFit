import bpy
import sys

# Get file path from command line arguments
argv = sys.argv
argv = argv[argv.index("--") + 1:]
clothes_path = argv[0] if len(argv) > 0 else 'C:/vFit/static/models/clothes/black_tshirt.fbx'

# Blender initialization: Clear existing data
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import the clothes model
bpy.ops.import_scene.fbx(filepath=clothes_path)
shirts = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']

if not shirts:
    print("Shirt not imported correctly.")
else:
    shirt = shirts[0]
    print(f"Shirt loaded: {shirt.name}")

    # Analyze vertex groups of the shirt
    vertex_groups = shirt.vertex_groups

    if not vertex_groups:
        print("No vertex groups found.")
    else:
        for vg in vertex_groups:
            vertices_in_group = [v for v in shirt.data.vertices if vg.index in [vg_elem.group for vg_elem in v.groups]]
            print(f"Vertex Group: {vg.name}, Number of Vertices: {len(vertices_in_group)}")

    # Look for an armature object to analyze bones
    armatures = [obj for obj in bpy.context.selected_objects if obj.type == 'ARMATURE']
    
    if not armatures:
        print("No armature found in the imported file.")
    else:
        armature = armatures[0]
        print(f"Armature found: {armature.name}")
        
        # Enter pose mode to access bones
        bpy.context.view_layer.objects.active = armature
        bpy.ops.object.mode_set(mode='POSE')
        
        # Analyze the bones
        bones = armature.data.bones
        if not bones:
            print("No bones found in the armature.")
        else:
            for bone in bones:
                print(f"Bone: {bone.name}")
                print(f"  Head: {bone.head_local}")
                print(f"  Tail: {bone.tail_local}")
                print(f"  Connected to parent: {'Yes' if bone.use_connect else 'No'}")
                print(f"  Parent: {bone.parent.name if bone.parent else 'None'}")

print("Vertex group and bone analysis complete.")
