from flask import Flask
from flask_socketio import SocketIO
from routes import main_bp, avatar_bp, fitting_bp

app = Flask(__name__)
app.config.from_object('config.Config')
socketio = SocketIO(app)

# 블루프린트 등록
app.register_blueprint(main_bp)
app.register_blueprint(avatar_bp, url_prefix='/avatar')
app.register_blueprint(fitting_bp, url_prefix='/fitting')

# URL 맵 출력 (디버그용)
print(app.url_map)

if __name__ == '__main__':
    socketio.run(app)
