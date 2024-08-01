let bones = []; // bones 변수를 전역으로 선언

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Avatar customization script loaded');

    const avatarPreview = document.getElementById('avatar-preview');
    const slidersContainer = document.getElementById('sliders-container');

    const modelPath = avatarPreview.getAttribute('data-model-path');
    const bodyShape = avatarPreview.getAttribute('data-body-shape');
    const height = parseFloat(avatarPreview.getAttribute('data-height'));
    const weight = parseFloat(avatarPreview.getAttribute('data-weight'));

    if (!modelPath || !bodyShape || isNaN(height) || isNaN(weight)) {
        console.error('Model path, body shape, height, or weight not found or invalid');
        return;
    }

    const initialHeight = 170;
    const initialWeight = 70;

    const avatarInfo = document.getElementById('avatar-info');
    avatarInfo.innerHTML = `
        <p><strong>선택된 체형:</strong> ${bodyShape}</p>
        <p><strong>키:</strong> ${height} cm</p>
        <p><strong>몸무게:</strong> ${weight} kg</p>
    `;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, avatarPreview.clientWidth / avatarPreview.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(avatarPreview.clientWidth, avatarPreview.clientHeight);
    avatarPreview.appendChild(renderer.domElement);

    const loadingText = avatarPreview.querySelector('p');
    if (loadingText) {
        avatarPreview.removeChild(loadingText);
    }

    renderer.setClearColor(0xdddddd);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLights = [
        new THREE.DirectionalLight(0xffffff, 1.0),
        new THREE.DirectionalLight(0xffffff, 1.0),
        new THREE.DirectionalLight(0xffffff, 1.0),
        new THREE.DirectionalLight(0xffffff, 1.0)
    ];

    directionalLights[0].position.set(1, 1, 1).normalize();
    directionalLights[1].position.set(-1, 1, -1).normalize();
    directionalLights[2].position.set(-1, -1, 1).normalize();
    directionalLights[3].position.set(1, -1, -1).normalize();

    directionalLights.forEach(light => scene.add(light));

    const loader = new THREE.GLTFLoader();
    let model;

    loader.load(modelPath, function(gltf) {
        model = gltf.scene;
        scene.add(model);

        const skeleton = new THREE.SkeletonHelper(model);
        skeleton.visible = false;
        scene.add(skeleton);

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

        model.traverse((node) => {
            if (node.isBone) {
                bones.push(node);
                console.log('Bone found:', node.name);
            }
        });

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
        }
        animate();
    }, undefined, function(error) {
        console.error('An error occurred while loading the model:', error);
    });

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
        bones.forEach(bone => {
            const slider = document.getElementById(`${bone.name}Slider`);
            if (slider) {
                params.set(`${bone.name}Size`, slider.value);
            }
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

    const shoulderScaleFactor = shoulderWidth / 46;
    const chestScaleFactor = chestCircumference / 100;
    const armScaleFactor = armLength / 60;

    const waistScaleFactor = waistCircumference / 70;
    const hipScaleFactor = hipCircumference / 95;
    const thighScaleFactor = thighCircumference / 55;
    const inseamScaleFactor = inseam / 80;
    const ankleScaleFactor = ankleCircumference / 25;

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
