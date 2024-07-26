from flask import Flask
from flask_socketio import SocketIO
from routes.main import main_bp
from routes.avatar_routes import avatar_bp
from routes.fitting_routes import fitting_bp

app = Flask(__name__)
app.config.from_object('config.Config')
socketio = SocketIO(app)

# 블루프린트 등록
app.register_blueprint(main_bp)
app.register_blueprint(avatar_bp, url_prefix='/avatar')
app.register_blueprint(fitting_bp, url_prefix='/fitting')

if __name__ == '__main__':
    socketio.run(app)
