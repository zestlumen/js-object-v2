## 영상 속 상품을 연결해주는 OTT서비스 웹 페이지, OBJECT
Firebase V9를 사용해 전체 코드를 개선하여 새로 작업한 개인 프로젝트

### OBJECT v1 -> v2 개선점, 수정한 부분
- 모듈 형식의 파이어베이스 9버전 사용하기
- html과 js 파일을 분리, 이해하기 쉽도록 파일명, 변수명 수정
- 전체적인 코드 개선, 중복 코드 줄이기, 불필요한 코드 삭제
(videoPlay관련 코드 약 480줄 -> 약 197줄)
- 메인화면 카테고리 토글, 프로필 멤버 메뉴 토글 전체 수정  
- 회원가입 및 로그인: 구글 소셜 로그인 기능 추가, 회원가입 시 아이디, 비밀번호 유효성 검사 및 안내 메시지 표시
- 영상 재생화면: 영상 재생화면에서 시간 이동 시 해당 시간의 상품 표시
- 상품 표시 화면에서 장소 상품 표시 화면 이동 시 오류 해결 및 장소 관련 상품 표시
- 유저의 멤버별 프로필 이름 변경 기능
- 계정 설정:  이메일 변경 및 비밀번호 재설정 기능(재설정 이메일 보내기)
- 하트 버튼을 통한 유저 멤버별 영상 찜기능, 내가 찜한 콘텐츠 화면 구현
- 메인 및 카테고리 화면에서 스크롤 시 상단으로 바로 이동하는 화살표 모양 버튼 추가
- 검색: OR 검색이 아닌 AND 검색으로 수정, 한 글자씩 입력마다 제목이나 배우명으로 찾을 수 있도록 수정


### 실행화면

- 로그인 전 메인화면
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/82b6db8d-8575-41d7-8556-13d90d475564"/>

- 회원가입
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/3c364144-4439-4df2-8f1b-f5ea63682e8d"/>

- 회선 선택 및 유저 선택, 메인에서 유저 변경
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/04a441d9-49d3-487c-a120-a44ca5f47dd7"/>

- 로그인 후 메인화면
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/86040b3b-361b-4ef9-8c12-3d247f1b5169"/>

- 카테고리별 영상 목록 보여주기
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/065eb75d-10b4-415f-8aca-0c5b33d3d312"/>

- 찜 기능 / 내가 찜한 콘텐츠 보여주기 (유저별로 사용 가능)
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/f687ae3e-df3b-46c6-9bc9-bddfd903e04e"/>

- 영상 상세정보 화면
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/1c3551ec-3c82-4309-a790-d050ebe4d140"/>

- 장르 버튼 클릭으로 필터링을 통한 검색
- <img src="https://github.com/zestlumen/js-object-v2/assets/122693004/1e7ac302-d85d-4a74-a8d0-ad9170d4c624"/>

- 제목, 배우명으로 검색 가능, 글자 입력마다 검색 
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/a5e6bbb0-f750-4ed9-ac33-c5d4e7b4e47d"/>

- 영상 재생 화면: 영상 상단 네비게이션, 우측 상품 정보 화면 
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/d9cfc11a-2f25-46df-ba54-eab9a821d1ad"/>

- 영상 재생 화면(옷 아이콘 클릭): 시간대별 패션 상품,스마트 기기 상품 표시 및 클릭 시 구매 사이트 연결
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/864a05b5-0094-4426-adee-01a7047b0519"/>

- 영상 재생 화면(장소 아이콘 클릭): 체험 상품 예약, 여행 상품 예약, 음식 주문 사이트 연결
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/ccabd286-4314-4597-8d83-15d4c4b37eac"/>

- 유저별 프로필 이름 변경 
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/5e1708dc-ac5c-4617-8e7d-ed711c638869"/>

- 계정설정: 회선 변경 
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/1573c563-a7d8-45b5-abd0-fd5dcbc60947"/>

- 계정설정: 이메일 변경 
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/9c4b6cf7-9dbb-4ef9-a360-95d940e85b23"/>

- 계정설정: 비밀번호 재설정 이메일로 보내기 / 비밀번호 재설정 -> 재로그인 화면 이동
<img src="https://github.com/zestlumen/js-object-v2/assets/122693004/4897e96f-5a89-45b4-98f1-e0edca2274f7"/>

