from flask import Blueprint

# 블루프린트 생성
main_bp = Blueprint('main', __name__)
avatar_bp = Blueprint('avatar', __name__)
fitting_bp = Blueprint('fitting', __name__)

# 블루프린트 모듈 임포트
from . import main, avatar_routes, fitting_routes

# 각 블루프린트에 URL 경로 등록
# (임포트 위치는 블루프린트 생성 후에 해야 합니다.)
