document.addEventListener('DOMContentLoaded', function (event) {
    console.log('Document loaded');

    const radioButtons = document.querySelectorAll('input[name="body_shape"]');
    console.log(`Found ${radioButtons.length} radio buttons`);

    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            console.log(`Radio button ${radio.id} changed`);
            radioButtons.forEach(r => {
                if (r !== radio) {
                    r.checked = false;
                }
            });
        });
    });

    const form = document.getElementById('bodyShapeForm');
    if (form) {
        console.log('Form found');
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // 폼의 기본 제출 동작 방지

            const selectedShape = document.querySelector('input[name="body_shape"]:checked');
            if (!selectedShape) {
                alert('체형을 선택하세요.');
                return;
            }

            const height = document.getElementById('height').value;
            const weight = document.getElementById('weight').value;

            if (!height || !weight) {
                alert('키와 몸무게를 입력하세요.');
                return;
            }

            const data = {
                body_shape: selectedShape.value,
                height: height,
                weight: weight
            };

            console.log('Sending data to server:', data);

            fetch('/customization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err });
                }
                return response.json();
            })
            .then(data => {
                console.log('Response from server:', data);
                const modelPath = data.model_path;

                // avatar_customization 페이지로 이동
                const customizationUrl = new URL('/avatar/customization', window.location.origin);
                customizationUrl.searchParams.set('model_path', modelPath);
                customizationUrl.searchParams.set('body_shape', selectedShape.value);
                customizationUrl.searchParams.set('height', height);
                customizationUrl.searchParams.set('weight', weight);
                window.location.href = customizationUrl.toString();
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`서버와 통신 중 오류가 발생했습니다. 나중에 다시 시도해 주세요. 오류 메시지: ${error.message || error}`);
            });
        });
    } else {
        console.error('Form not found');
    }
});
