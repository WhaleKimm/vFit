from flask import render_template, request, jsonify
from . import fitting_bp

@fitting_bp.route('/')
def virtual_fitting():
    return render_template('virtual_fitting.html')

@fitting_bp.route('/fit', methods=['POST'])
def fit_clothes():
    data = request.get_json()
    # 데이터 처리 로직
    return jsonify(success=True)
