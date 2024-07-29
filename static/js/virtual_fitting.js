document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Virtual fitting script loaded');
    const avatarPreview = document.getElementById('avatar-preview');

    // data-model-path 속성 확인
    const modelPath = avatarPreview.getAttribute('data-model-path');
    const bodyShape = avatarPreview.getAttribute('data-body-shape');
    const height = parseFloat(avatarPreview.getAttribute('data-height'));
    const weight = parseFloat(avatarPreview.getAttribute('data-weight'));

    if (!modelPath || !bodyShape || isNaN(height) || isNaN(weight)) {
        console.error('Model path, body shape, height, or weight not found or invalid');
        return;
    }

    const initialHeight = 170; // 초기 키 값
    const initialWeight = 70; // 초기 몸무게 값

    // Three.js를 사용하여 3D 모델을 로드하고 렌더링
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, avatarPreview.clientWidth / avatarPreview.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(avatarPreview.clientWidth, avatarPreview.clientHeight);
    avatarPreview.appendChild(renderer.domElement);

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const loader = new THREE.GLTFLoader();
    let model;

    loader.load(modelPath, function(gltf) {
        model = gltf.scene;
        scene.add(model);

        // 로딩 중 텍스트 제거
        const loadingText = avatarPreview.querySelector('p');
        if (loadingText) {
            avatarPreview.removeChild(loadingText);
        }

        model.scale.set(1, 1, 1);  // 초기 스케일 설정
        camera.position.z=3; // 카메라 위치 조정

        // 키와 몸무게에 따른 스케일 조정
        const heightScale = height / initialHeight;
        const weightScale = weight / initialWeight;
        model.scale.set(weightScale, heightScale, weightScale);

        // OrbitControls 추가
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }, undefined, function(error) {
        console.error('An error occurred while loading the model:', error);
    });
});
