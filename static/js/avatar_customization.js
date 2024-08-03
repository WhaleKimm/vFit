let bones = []; // bones 변수를 전역으로 선언

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Avatar customization script loaded');

    // HTML 요소들을 가져옴
    const avatarPreview = document.getElementById('avatar-preview');
    const slidersContainer = document.getElementById('sliders-container');

    // 모델 경로, 체형, 키, 몸무게 속성을 가져옴
    const modelPath = avatarPreview.getAttribute('data-model-path');
    const bodyShape = avatarPreview.getAttribute('data-body-shape');
    const height = parseFloat(avatarPreview.getAttribute('data-height'));
    const weight = parseFloat(avatarPreview.getAttribute('data-weight'));

    // 필수 속성들이 유효한지 확인
    if (!modelPath || !bodyShape || isNaN(height) || isNaN(weight)) {
        console.error('Model path, body shape, height, or weight not found or invalid');
        return;
    }

    const initialHeight = 175;
    const initialWeight = 55;

    // 아바타 정보를 HTML에 표시
    const avatarInfo = document.getElementById('avatar-info');
    avatarInfo.innerHTML = `
        <p><strong>선택된 체형:</strong> ${bodyShape}</p>
        <p><strong>키:</strong> ${height} cm</p>
        <p><strong>몸무게:</strong> ${weight} kg</p>
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

    // 배경 색상 설정
    renderer.setClearColor(0xdddddd);

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLights = [
        new THREE.DirectionalLight(0xffffff, 1.0),
        new THREE.DirectionalLight(0xffffff, 1.0),
        new THREE.DirectionalLight(0xffffff, 1.0),
        new THREE.DirectionalLight(0xffffff, 1.0)
    ];
    // 조명 위치 설정
    directionalLights[0].position.set(1, 1, 1).normalize();
    directionalLights[1].position.set(-1, 1, -1).normalize();
    directionalLights[2].position.set(-1, -1, 1).normalize();
    directionalLights[3].position.set(1, -1, -1).normalize();

    // 조명을 씬에 추가
    directionalLights.forEach(light => scene.add(light));

    const loader = new THREE.GLTFLoader();
    let model;

    // 모델 로드
    loader.load(modelPath, function(gltf) {
        model = gltf.scene;
        scene.add(model);

        const skeleton = new THREE.SkeletonHelper(model);
        skeleton.visible = false;
        scene.add(skeleton);

        // 모델 회전 및 크기 조정
        model.rotation.y = Math.PI;

        model.scale.set(1, 1, 1);
        camera.position.z = 5;

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        camera.position.set(0, center.y, 2);
        camera.lookAt(new THREE.Vector3(0, center.y, 0));

        const heightScale = height / initialHeight;
        const weightScale = weight / initialWeight;
        model.scale.set(weightScale, heightScale, weightScale);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();

        // 모델의 뼈 탐색
        model.traverse((node) => {
            if (node.isBone) {
                bones.push(node);
                console.log('Bone found:', node.name);
            }
        });

        // 텍스처 및 재질 설정
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

        // 특정 메쉬 이름으로 옷을 제거
        const removeObjects = ["Object_148", "Object_141", "Object_139", "Object_137"]; // 제거할 오브젝트 이름 리스트
        removeObjects.forEach(name => {
            const objectToRemove = model.getObjectByName(name);
            if (objectToRemove) {
                objectToRemove.parent.remove(objectToRemove); // 부모로부터 노드를 제거
                console.log(`Removed object: ${objectToRemove.name}`);
            }
        });
        // 애니메이션 함수
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }, undefined, function(error) {
        console.error('An error occurred while loading the model:', error);
    });

    // 슬라이더와 입력 필드를 동기화하는 함수
    function syncSliderAndInput(slider, input) {
        slider.addEventListener('input', () => {
            input.value = slider.value;
            customizeAvatar();
        });

        input.addEventListener('input', () => {
            slider.value = input.value;
            customizeAvatar();
        });
    }

    const sliders = [
        { slider: document.getElementById('shoulderWidthSlider'), input: document.getElementById('shoulderWidth') },
        { slider: document.getElementById('chestCircumferenceSlider'), input: document.getElementById('chestCircumference') },
        { slider: document.getElementById('armLengthSlider'), input: document.getElementById('armLength') },
        { slider: document.getElementById('waistCircumferenceSlider'), input: document.getElementById('waistCircumference') },
        { slider: document.getElementById('hipCircumferenceSlider'), input: document.getElementById('hipCircumference') },
        { slider: document.getElementById('thighCircumferenceSlider'), input: document.getElementById('thighCircumference') },
        { slider: document.getElementById('inseamSlider'), input: document.getElementById('inseam') },
        { slider: document.getElementById('ankleCircumferenceSlider'), input: document.getElementById('ankleCircumference') }
    ];

    sliders.forEach(pair => syncSliderAndInput(pair.slider, pair.input));

    // '수정' 버튼 클릭 이벤트
    const editButton = document.getElementById('edit-button');
    editButton.addEventListener('click', () => {
        const editUrl = editButton.getAttribute('data-edit-url');
        window.location.href = editUrl;
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
        sliders.forEach(pair => {
            params.set(pair.input.id, pair.input.value);
        });

        fittingUrl.search = params.toString();
        window.location.href = fittingUrl.toString();
    });

    document.getElementById('customizationForm').addEventListener('submit', (event) => {
        event.preventDefault();
        customizeAvatar();
    });
});

function customizeAvatar() {
    const shoulderWidth = parseFloat(document.getElementById('shoulderWidth').value);
    const chestCircumference = parseFloat(document.getElementById('chestCircumference').value);
    const armLength = parseFloat(document.getElementById('armLength').value);
    const waistCircumference = parseFloat(document.getElementById('waistCircumference').value);
    const hipCircumference = parseFloat(document.getElementById('hipCircumference').value);
    const thighCircumference = parseFloat(document.getElementById('thighCircumference').value);
    const inseam = parseFloat(document.getElementById('inseam').value);
    const ankleCircumference = parseFloat(document.getElementById('ankleCircumference').value);

    // 신체 부위별 스케일 조정 비율 계산
    const shoulderScaleFactor = shoulderWidth / 42;
    const chestScaleFactor = chestCircumference / 92;
    const armScaleFactor = armLength / 62;
    const waistScaleFactor = waistCircumference / 72;
    const hipScaleFactor = hipCircumference / 98;
    const thighScaleFactor = thighCircumference / 58;
    const inseamScaleFactor = inseam / 87;
    const ankleScaleFactor = ankleCircumference / 25;

    // 뼈 스케일 조정
    bones.forEach(bone => {
        if (bone.name.includes('Clavicle')) {
            bone.scale.x = shoulderScaleFactor;
        } else if (bone.name.includes('Spine')) {
            bone.scale.x = chestScaleFactor;
        } else if (bone.name.includes('Upperarm') || bone.name.includes('Forearm')) {
            bone.scale.y = armScaleFactor;
        } else if (bone.name.includes('Pelvis')) {
            bone.scale.x = waistScaleFactor;
        } else if (bone.name.includes('Thigh')) {
            bone.scale.x = hipScaleFactor;
        } else if (bone.name.includes('Calf')) {
            bone.scale.y = thighScaleFactor;
        } else if (bone.name.includes('Foot')) {
            bone.scale.y = inseamScaleFactor;
        } else if (bone.name.includes('ToeBase')) {
            bone.scale.x = ankleScaleFactor;
        }
    });

    console.log('Avatar customized with updated measurements.');
}
