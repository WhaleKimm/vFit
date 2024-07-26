# 환경 변수 설정 방법

Windows (CMD)<br>
`set SECRET_KEY=your-very-secret-key`

# 파이썬 가상 환경 사용법

**1. 가상 환경 생성**
Windows에서 가상 환경 생성
먼저 vFit 폴더로 이동한 다음, venv라는 이름의 가상 환경을 생성합니다. 

Windows (CMD)<br>
`cd vFit`<br>
`python -m venv venv`

**2. 가상 환경 활성화**
가상 환경을 활성화합니다.

Windows (CMD)<br>
`venv\Scripts\activate`

**3. requirements.txt 파일 설치**
가상 환경이 활성화된 상태에서 requirements.txt 파일에 정의된 패키지를 설치합니다.

Windows (CMD)<br>
`pip install -r requirements.txt`