from flask import Blueprint, render_template

# 블루프린트 정의
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')
