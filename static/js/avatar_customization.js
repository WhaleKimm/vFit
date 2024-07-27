document.addEventListener('DOMContentLoaded', (event) => {
    // 아바타 커스터마이즈 로직 추가
    console.log('Avatar customization script loaded');
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeDisplay = document.getElementById('sizeDisplay');
    
    sizeSlider.addEventListener('input', function() {
        sizeDisplay.textContent = this.value;
        console.log('Current Size:', this.value);
        // 여기에 blend와 연동하는 코드를 추가할 수 있습니다.
        // 예: updateAvatarSize(this.value);
    });
});
