document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Avatar customization script loaded');
    const avatarPreview = document.getElementById('avatar-preview');
    const slidersContainer = document.getElementById('sliders-container');
    
    // data-model-path, data-body-shape, data-height, data-weight 속성 확인
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

    // 선택된 체형과 키, 몸무게를 표시
    const avatarInfo = document.getElementById('avatar-info');
    avatarInfo.innerHTML = `
        <p><strong>Selected Body Shape:</strong> ${bodyShape}</p>
        <p><strong>Height:</strong> ${height} cm</p>
        <p><strong>Weight:</strong> ${weight} kg</p>
    `;

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
    renderer.setClearColor(0xdddddd);

  
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
        skeleton.visible = false;
        scene.add(skeleton);
        // 모델이 앞을 보도록 회전
        model.rotation.y = Math.PI; // 180도 회전

        model.scale.set(1, 1, 1);
        camera.position.z = 5;
        // 모델의 바운딩 박스를 계산하여 모델의 중심을 구함
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center); // 모델의 중심을 원점으로 이동

        camera.position.set(0, center.y, 2); // 카메라 위치 조정 (허리 높이에 맞춤)
        camera.lookAt(new THREE.Vector3(0, center.y, 0)); // 카메라가 허리 높이를 바라보도록 설정

        // 키와 몸무게에 따른 스케일 조정
        const heightScale = height / initialHeight;
        const weightScale = weight / initialWeight;
        model.scale.set(weightScale, heightScale, weightScale);

        // OrbitControls 추가
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();

        model.traverse((node) => {
            if (node.isBone) {
                bones.push(node);
                console.log('Bone found:', node.name);
                createSliderForBone(node);
            }
        });

        // 텍스처 및 재질 확인
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    skinning: true,
                    color: child.material.color,
                    map: child.material.map,
                    normalMap: child.material.normalMap,
                    roughness: child.material.roughness,
                    metalness: child.material.metalness
                });
               
            }
        });

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);

            bones.forEach(bone => {
                const slider = document.getElementById(`${bone.name}Slider`);
                if (slider) {
                    const scale = parseFloat(slider.value) / 100;
                    bone.scale.set(scale, scale, scale);
                    console.log(`Updated ${bone.name} scale to ${scale}`);
                }
            });
        }
        animate();
    }, undefined, function(error) {
        console.error('An error occurred while loading the model:', error);
    });

    function createSliderForBone(bone) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.htmlFor = bone.name + 'Slider';
        label.textContent = `${bone.name} Size:`;
        sliderContainer.appendChild(label);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'form-range';
        slider.id = bone.name + 'Slider';
        slider.min = 50;
        slider.max = 200;
        slider.step = 1;
        slider.value = 100;
        slider.addEventListener('input', function() {
            document.getElementById(`${bone.name}SizeDisplay`).textContent = this.value;
            const scale = parseFloat(this.value) / 100;
            bone.scale.set(scale, scale, scale);
            console.log(`Immediate update: ${bone.name} scale to ${scale}`);
        });
        sliderContainer.appendChild(slider);

        const sizeDisplay = document.createElement('p');
        sizeDisplay.className = 'mt-3';
        sizeDisplay.innerHTML = `${bone.name} Size: <span id="${bone.name}SizeDisplay">100</span>%`;
        sliderContainer.appendChild(sizeDisplay);

        slidersContainer.appendChild(sliderContainer);
    }

    // '수정' 버튼 클릭 이벤트
    const editButton = document.getElementById('edit-button');
    editButton.addEventListener('click', () => {
        const editUrl = editButton.getAttribute('data-edit-url');
        window.location.href = editUrl; // 홈페이지로 돌아가기
    });

    // '피팅하기' 버튼 클릭 이벤트
    const fittingButton = document.getElementById('fitting-button');
    fittingButton.addEventListener('click', () => {
        const fittingUrl = new URL(fittingButton.getAttribute('data-fitting-url'), window.location.origin);
        const params = new URLSearchParams();

        // 키와 몸무게 정보 추가
        params.set('height', height);
        params.set('weight', weight);
        params.set('body_shape', bodyShape);

        // 각 슬라이더 값을 URL 매개변수로 추가
        bones.forEach(bone => {
            const slider = document.getElementById(`${bone.name}Slider`);
            if (slider) {
                params.set(`${bone.name}Size`, slider.value);
            }
        });

        fittingUrl.search = params.toString();
        window.location.href = fittingUrl.toString(); // 피팅 페이지로 이동
    });
});
