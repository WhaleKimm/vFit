from flask import Blueprint, render_template, request, jsonify

# 가상 피팅 관련 블루프린트 생성
fitting_bp = Blueprint('fitting', __name__)

# 가상 피팅 페이지 렌더링
@fitting_bp.route('/')
def virtual_fitting():
    return render_template('virtual_fitting.html')

# 옷 피팅 처리
@fitting_bp.route('/fit', methods=['POST'])
def fit_clothes():
    data = request.get_json()
    # 데이터 처리 로직
    return jsonify(success=True)
