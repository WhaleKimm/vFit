from flask import render_template, request, jsonify, url_for
import subprocess
import os
from . import main_bp

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/customization', methods=['POST'])
def modify_avatar():
    try:
        data = request.get_json()
        print('Received data:', data)
        body_shape = data.get('body_shape')
        height = data.get('height')
        weight = data.get('weight')

        # Blender 실행 파일 경로 지정 (절대 경로 사용)
        blender_executable = r'C:\Program Files\Blender Foundation\Blender 4.2\blender.exe'
        blender_script = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts', 'modify_model.py'))
        model_input_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'models', 'realistic-female', 'source', 'Female Animation.fbx'))
        model_output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'models', 'realistic-female', 'source', f'modified_model.fbx'))

        # 블렌더를 사용하여 모델 수정
        result = subprocess.run([
            blender_executable, '--background', '--python', blender_script, '--', 
            model_input_path, model_output_path, body_shape, str(height), str(weight)
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        print('Blender output:', result.stdout.decode('utf-8'))
        print('Blender errors:', result.stderr.decode('utf-8'))

        model_output_path_glb = model_output_path.replace('.fbx', '.glb')

        return jsonify({
            'body_shape': body_shape,
            'height': height,
            'weight': weight,
            'model_path': url_for('static', filename=f'models/realistic-female/source/modified_model.glb')
        })

    except subprocess.CalledProcessError as e:
        print('Blender failed:', e.stderr.decode('utf-8'))
        return jsonify({'error': 'Blender processing failed', 'details': e.stderr.decode('utf-8')}), 500
    except Exception as e:
        print('Unexpected error:', str(e))
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
