from flask import Blueprint, render_template, request, jsonify
from . import fitting_bp

@fitting_bp.route('/')
def virtual_fitting():
    # URL 매개변수에서 데이터를 가져옵니다.
    body_shape = request.args.get('body_shape')
    height = request.args.get('height')
    weight = request.args.get('weight')
    shoulder_width = request.args.get('shoulderWidth')
    chest_circumference = request.args.get('chestCircumference')
    arm_length = request.args.get('armLength')
    waist_circumference = request.args.get('waistCircumference')
    hip_circumference = request.args.get('hipCircumference')
    thigh_circumference = request.args.get('thighCircumference')
    inseam = request.args.get('inseam')
    ankle_circumference = request.args.get('ankleCircumference')

    # 데이터를 템플릿으로 전달합니다.
    return render_template('virtual_fitting.html', 
                           body_shape=body_shape, 
                           height=height, 
                           weight=weight,
                           shoulder_width=shoulder_width, 
                           chest_circumference=chest_circumference, 
                           arm_length=arm_length,
                           waist_circumference=waist_circumference, 
                           hip_circumference=hip_circumference,
                           thigh_circumference=thigh_circumference, 
                           inseam=inseam, 
                           ankle_circumference=ankle_circumference)

@fitting_bp.route('/fit', methods=['POST'])
def fit_clothes():
    data = request.get_json()
    # 데이터 처리 로직
    return jsonify(success=True)
