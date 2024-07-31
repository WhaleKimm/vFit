document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Virtual fitting script loaded');
    const avatarPreview = document.getElementById('avatar-preview');

    // data-model-path 속성 확인
    const modelPath = avatarPreview.getAttribute('data-model-path');
    const urlParams = new URLSearchParams(avatarPreview.getAttribute('data-url-params'));

    const height = parseFloat(urlParams.get('height'));
    const weight = parseFloat(urlParams.get('weight'));
    const bodyShape = urlParams.get('body_shape');

    if (!modelPath || isNaN(height) || isNaN(weight) || !bodyShape) {
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

    // 로딩 중 텍스트 제거
    const loadingText = avatarPreview.querySelector('p');
    if (loadingText) {
        avatarPreview.removeChild(loadingText);
    }

    // 배경 색상 설정 (덜 짙은 색)
    renderer.setClearColor(0x999999);

  
    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 밝은 환경광
    scene.add(ambientLight);

    // 추가 조명
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(1, 1, 1).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-1, 1, -1).normalize();
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight3.position.set(-1, -1, 1).normalize();
    scene.add(directionalLight3);

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight4.position.set(1, -1, -1).normalize();
    scene.add(directionalLight4);

    const loader = new THREE.GLTFLoader();
    let model;
    const bones = [];

    loader.load(modelPath, function(gltf) {
        model = gltf.scene;
        scene.add(model);

        const skeleton = new THREE.SkeletonHelper(model);
        skeleton.visible = true;
        scene.add(skeleton);

        model.scale.set(1, 1, 1);
        camera.position.z = 5;

        // 키와 몸무게에 따른 스케일 조정
        const heightScale = height / initialHeight;
        const weightScale = weight / initialWeight;
        model.scale.set(weightScale, heightScale, weightScale);

        // 각 뼈에 대해 URL 매개변수에서 스케일 설정
        model.traverse((node) => {
            if (node.isBone) {
                bones.push(node);
                const scale = parseFloat(urlParams.get(`${node.name}Size`)) / 100 || 1;
                node.scale.set(scale, scale, scale);
                console.log(`Loaded ${node.name} scale to ${scale}`);
            }
        });

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
