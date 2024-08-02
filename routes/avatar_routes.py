from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from flask_socketio import emit
from . import avatar_bp

# 아바타 커스터마이즈 페이지 렌더링
@avatar_bp.route('/customization', methods=['GET', 'POST'])
def avatar_customization():
    if request.method == 'POST':
        body_shape = request.form.get('body_shape')
        height = request.form.get('height')
        weight = request.form.get('weight')

        # 슬라이더 값 가져오기
        shoulder_width = request.form.get('shoulderWidth')
        chest_circumference = request.form.get('chestCircumference')
        arm_length = request.form.get('armLength')
        waist_circumference = request.form.get('waistCircumference')
        hip_circumference = request.form.get('hipCircumference')
        thigh_circumference = request.form.get('thighCircumference')
        inseam = request.form.get('inseam')
        ankle_circumference = request.form.get('ankleCircumference')

        # 데이터 처리 로직 (예: 데이터베이스에 저장하거나 다음 페이지에 전달)
        return render_template('avatar_customization.html', body_shape=body_shape, height=height, weight=weight,
                               shoulder_width=shoulder_width, chest_circumference=chest_circumference, arm_length=arm_length,
                               waist_circumference=waist_circumference, hip_circumference=hip_circumference,
                               thigh_circumference=thigh_circumference, inseam=inseam, ankle_circumference=ankle_circumference)

    return render_template('avatar_customization.html')

# 아바타 선택 처리
@avatar_bp.route('/select', methods=['POST'])
def select_avatar():
    data = request.get_json()
    # 데이터 처리 로직
    return jsonify(success=True)

# 피팅 페이지로 이동
@avatar_bp.route('/fitting', methods=['GET'])
def virtual_fitting():
    # 커스터마이즈 페이지에서 전달된 데이터를 가져오기
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

    return render_template('virtual_fitting.html', body_shape=body_shape, height=height, weight=weight,
                           shoulder_width=shoulder_width, chest_circumference=chest_circumference, arm_length=arm_length,
                           waist_circumference=waist_circumference, hip_circumference=hip_circumference,
                           thigh_circumference=thigh_circumference, inseam=inseam, ankle_circumference=ankle_circumference)
