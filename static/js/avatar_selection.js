document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Document loaded');

    // 아바타 선택 로직 추가
    console.log('Avatar selection script loaded');

    const radioButtons = document.querySelectorAll('input[name="body_shape"]');
    console.log(`Found ${radioButtons.length} radio buttons`);

    // 각 라디오 버튼에 변경 이벤트 리스너 추가
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

            // 폼 제출
            console.log('Form submitted');
            form.submit();
        });
    } else {
        console.error('Form not found');
    }
});
