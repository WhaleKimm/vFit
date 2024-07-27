// 아바타 선택 로직 추가
console.log('Avatar selection script loaded');

document.addEventListener('DOMContentLoaded', (event) => {
    const radioButtons = document.querySelectorAll('input[name="body_shape"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            radioButtons.forEach(r => {
                if (r !== radio) {
                    r.checked = false;
                }
            });
        });
    });
});
