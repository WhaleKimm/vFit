document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Avatar customization script loaded');

    const avatarPreview = document.getElementById('avatar-preview');
    const slidersContainer = document.getElementById('sliders-container');
    const modelPath = avatarPreview.getAttribute('data-model-path');

    if (!modelPath) {
        console.error('Model path not found');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, avatarPreview.clientWidth / avatarPreview.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(avatarPreview.clientWidth, avatarPreview.clientHeight);
    avatarPreview.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

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
});
