from flask import Blueprint, render_template, request, jsonify
from flask_socketio import emit

avatar_bp = Blueprint('avatar', __name__)

# 아바타 커스터마이즈 페이지 렌더링
@avatar_bp.route('/customization', methods=['GET', 'POST'])
def avatar_customization():
    if request.method == 'POST':
        body_shape = request.form.get('body_shape')
        height = request.form.get('height')
        weight = request.form.get('weight')

        # 데이터 처리 로직 (예: 데이터베이스에 저장하거나 다음 페이지에 전달)
        return render_template('avatar_customization.html', body_shape=body_shape, height=height, weight=weight)
    
    return render_template('avatar_customization.html')

# 아바타 선택 처리
@avatar_bp.route('/select', methods=['POST'])
def select_avatar():
    data = request.get_json()
    # 데이터 처리 로직
    return jsonify(success=True)
