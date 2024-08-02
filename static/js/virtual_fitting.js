document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Virtual fitting script loaded');
    const avatarPreview = document.getElementById('avatar-preview');

    // data-model-path 속성 확인
    const modelPath = avatarPreview.getAttribute('data-model-path');
    const urlParams = new URLSearchParams(avatarPreview.getAttribute('data-url-params'));

    const height = parseFloat(urlParams.get('height'));
    const weight = parseFloat(urlParams.get('weight'));
    const bodyShape = urlParams.get('body_shape');
    const shoulderWidth = parseFloat(urlParams.get('shoulderWidth'));
    const chestCircumference = parseFloat(urlParams.get('chestCircumference'));
    const armLength = parseFloat(urlParams.get('armLength'));
    const waistCircumference = parseFloat(urlParams.get('waistCircumference'));
    const hipCircumference = parseFloat(urlParams.get('hipCircumference'));
    const thighCircumference = parseFloat(urlParams.get('thighCircumference'));
    const inseam = parseFloat(urlParams.get('inseam'));
    const ankleCircumference = parseFloat(urlParams.get('ankleCircumference'));

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
    const hiddenObjects = []; // 숨겨진 객체를 저장하는 배열
    const clothes = {}; // 옷 객체를 저장할 변수

    loader.load(modelPath, function(gltf) {
        model = gltf.scene;
        scene.add(model);

        // 모델이 앞을 보도록 회전
        model.rotation.y = Math.PI; // 180도 회전

        model.scale.set(1, 1, 1);

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

        const shoulderScaleFactor = shoulderWidth / 46;
        const chestScaleFactor = chestCircumference / 100;
        const armScaleFactor = armLength / 60;
        const waistScaleFactor = waistCircumference / 70;
        const hipScaleFactor = hipCircumference / 95;
        const thighScaleFactor = thighCircumference / 55;
        const inseamScaleFactor = inseam / 80;
        const ankleScaleFactor = ankleCircumference / 25;

        // 각 뼈에 대해 URL 매개변수에서 스케일 설정
        model.traverse((node) => {
            if (node.isBone) {
                if (node.name.includes('Clavicle')) {
                    node.scale.x = shoulderScaleFactor;
                } else if (node.name.includes('Spine')) {
                    node.scale.x = chestScaleFactor;
                } else if (node.name.includes('Upperarm') || node.name.includes('Forearm')) {
                    node.scale.y = armScaleFactor;
                } else if (node.name.includes('Pelvis')) {
                    node.scale.x = waistScaleFactor;
                } else if (node.name.includes('Thigh')) {
                    node.scale.x = hipScaleFactor;
                } else if (node.name.includes('Calf')) {
                    node.scale.y = thighScaleFactor;
                } else if (node.name.includes('Foot')) {
                    node.scale.y = inseamScaleFactor;
                } else if (node.name.includes('ToeBase')) {
                    node.scale.x = ankleScaleFactor;
                }
                console.log(`Loaded ${node.name} scale to ${node.scale.x}, ${node.scale.y}, ${node.scale.z}`);
            } else if (node.isMesh) {
                node.material = new THREE.MeshStandardMaterial({
                    skinning: true,
                    color: node.material.color,
                    map: node.material.map,
                    normalMap: node.material.normalMap,
                    roughness: node.material.roughness,
                    metalness: node.material.metalness
                });
            }
        });

        // 특정 메쉬 이름으로 옷을 숨기기
        const removeObjects = ["Object_148", "Object_141", "Object_139", "Object_137"]; // 제거할 오브젝트 이름 리스트
        removeObjects.forEach(name => {
            const objectToHide = model.getObjectByName(name);
            if (objectToHide) {
                hiddenObjects.push(objectToHide); // 숨겨진 객체 배열에 추가
                objectToHide.visible = false; // 객체 숨기기
                console.log(`Hid object: ${objectToHide.name}`);
            }
        });

        // 옷 객체 저장
        clothes.shirt = model.getObjectByName("Object_148");
        clothes.pants = model.getObjectByName("Object_141");
        clothes.underwear = model.getObjectByName("Object_139");
        clothes.other = model.getObjectByName("Object_137");

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

    // 버튼 클릭 이벤트 핸들러 추가
    document.getElementById('show-shirt').addEventListener('click', () => toggleClothingVisibility('Object_148'));
    document.getElementById('show-pants').addEventListener('click', () => toggleClothingVisibility('Object_141'));
    document.getElementById('show-underwear').addEventListener('click', () => toggleClothingVisibility('Object_139'));
    document.getElementById('show-other').addEventListener('click', () => toggleClothingVisibility('Object_137'));

    // 색상 변경 이벤트 핸들러 추가
    document.getElementById('shirt-color').addEventListener('input', (event) => {
        if (clothes.shirt) {
            clothes.shirt.material.color.set(event.target.value);
            console.log(`Changed shirt color to: ${event.target.value}`);
        }
    });
    document.getElementById('pants-color').addEventListener('input', (event) => {
        if (clothes.pants) {
            clothes.pants.material.color.set(event.target.value);
            console.log(`Changed pants color to: ${event.target.value}`);
        }
    });
    document.getElementById('underwear-color').addEventListener('input', (event) => {
        if (clothes.underwear) {
            clothes.underwear.material.color.set(event.target.value);
            console.log(`Changed underwear color to: ${event.target.value}`);
        }
    });
    document.getElementById('other-color').addEventListener('input', (event) => {
        if (clothes.other) {
            clothes.other.material.color.set(event.target.value);
            console.log(`Changed other color to: ${event.target.value}`);
        }
    });

    // 옷의 가시성을 토글하는 함수
    function toggleClothingVisibility(objectName) {
        const object = hiddenObjects.find(obj => obj.name === objectName);
        if (object) {
            object.visible = !object.visible;
            console.log(`Toggled visibility for: ${objectName}, now ${object.visible ? 'visible' : 'hidden'}`);
        }
    }
});
