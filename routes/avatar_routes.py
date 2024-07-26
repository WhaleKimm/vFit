from flask import Blueprint, render_template, request, jsonify

# 아바타 관련 블루프린트 생성
avatar_bp = Blueprint('avatar', __name__)

# 아바타 커스터마이즈 페이지 렌더링
@avatar_bp.route('/customization')
def avatar_customization():
    return render_template('avatar_customization.html')

# 아바타 선택 처리
@avatar_bp.route('/select', methods=['POST'])
def select_avatar():
    data = request.get_json()
    # 데이터 처리 로직
    return jsonify(success=True)
