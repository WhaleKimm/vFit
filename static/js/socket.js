document.addEventListener('DOMContentLoaded', (event) => {
    // WebSocket 초기화 및 연결
    var socket = io.connect('http://' + window.location.hostname + ':' + location.port);

    socket.on('connect', function() {
        console.log('Connected to server');
    });
});
