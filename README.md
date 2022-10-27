# 궁금해 약!💊

`궁금해 약` 개발을 위한 팀 레포지토리입니다.

> 배포 도메인:

## 1. 프로젝트 소개

### 1-1) 프로젝트 주제

사진으로 약을 검색하고 자신의 복용약을 관리하는 PWA 서비스

### 1-2) 서비스 소개 및 배경

약 상자를 잃어버려 어떤 약인지 알 수 없거나, 어떤 약을 처방 받았는지 궁금할때 검색해보신적 있으신가요? 색깔, 제형, 글씨 등등 모든 검색어를 선택하고 알고 있는 정보를 대조해 겨우 알아내지 않으셨나요?

`궁금해약`은 이러한 검색 과정에서 발생하는 어려움을 해결하기 위해 약 사진을 찍으면 AI 머신러닝을 활용하여 검색어를 추출하고 공공 데이터 포털에서 제공하는 공신력있는 알약 정보를 제공하는 PWA 서비스를 기획하였습니다.
또한 복용하고 있는 약을 관리하기 위해 푸쉬 알림 예약 서비스를 제공하고 있습니다.

부가적인 기능으로, 지도에서 약국을 검색하여 정보를 얻을 수 있고 알약과 약국의 북마크 기능을 사용하여 마이페이지에서 자신의 복용약과 약국을 관리할 수 있습니다. 마이페이지에서는 자신의 정보를 변경하거나 삭제하고 고객센터를 활용할 수도 있습니다.
인증 과정에서 손쉬운 구글 로그인을 제공하며 자체 인증 토큰과 recaptcha를 활용한 안전한 회원가입과 로그인 기능도 제공하고 있습니다.
SMS 전송과 이메일 전송 기능으로 자신의 이메일과 비밀번호를 찾을 수 있고 회원가입시 회원을 복원할 수 있습니다.

데스크탑에서 접근한다면 팀 소개와 서비스 소개, PWA 설치 안내 페이지로 이동할 수 있습니다.

### 1-3) 서비스 목표

- 실제 서비스할 수 있는 PWA 서비스를 만들자!
- 자신의 복용약을 관리할 수 있는 서비스를 만들자!
- 사진으로 알약을 검색하는 기능은 우리가 처음! 😃

## 2. 서비스 기능 소개

### 2-1) 메인 기능

- 사진 업로드를 통한 약 검색
- 복약 알림

### 2-2) 서브 기능

- 약국 검색 및 북마크
- 약 북마크
- 복약 여부 체크
- 인증

### 2-3) 관련 문서

- 와이어프레임
- ERD

## 3. 사용된 데이터셋과 기술스택

### 3-1) 어떤 데이터셋을 어떻게 전처리하고 사용할것인지

- **데이터셋** : 의약품 낱알식별 데이터 ([의약품통합정보시스템 공공데이터](https://nedrug.mfds.go.kr/pbp/CCBGA01/getItem?totalPages=4&limit=10&page=2&&openDataInfoSeq=11))
  - **Columns**
    - 품목일련번호 : 의약품 ID
    - 품목명
    - 표시앞/표시뒤 : 의약품 문구
    - 의약품제형
    - 색상앞/색상뒤
    - 큰제품이미지 : 의약품 이미지 다운로드 링크
- 알약의 정보를 제공해주는 것이 목적이므로 [식약품안전처의 의약품개요정보 API](https://www.data.go.kr/data/15075057/openapi.do)에서 정보를 불러올 수 있는 알약 1559종을 데이터베이스에 저장
- 1559종의 알약을 각각 분류해내는 것은 데이터셋의 질과 양의 부족으로 성능 측면에서 어려움이 존재→ 알약의 특징인 제형/색상/문구를 이용하여 분류하고자 함

- **데이터 전처리**
  1. 의약품 낱알식별 csv의 큰제품 이미지 url로부터 이미지 다운로드
  2. 원본 이미지는 알약 앞/뒤 2가지 모습이 담겨져 있으나 inference 시에는 알약 한 면의 사진이 입력되므로 글자가 존재하는 면을 우선순위로 전경 처리
     ![Untitled](https://user-images.githubusercontent.com/71163016/198281542-72e5ae72-9d7e-40a0-9515-79faff7b7997.png)

  3. 한 개의 의약품 당 한 장의 이미지가 존재한다는 문제점 → Augmentation
     1. 제형 분류
        `장방형: rectangle / 타원형: oval /원형: circle / 오각형: pentagon / 사각형: square / 삼각형: triangle / 마름모형: rhombus / 육각형: hexagon / 기타: etc` - 데이터 불균형 문제
        장방형/타원형/원형에 비해 나머지 제형의 비율이 적음 (육각형의 경우 1559종 중 단 1종만이 존재함)
        → 제형을 분류하는 task이므로 굳이 정보를 제공해줄 수 있는 의약품 1559종만을 이용할 필요가 없음 → 제형 별 추가 의약품 이미지를 가져오고 각 라벨 별 3000장이 되도록 Augmentation - 모델 학습을 위한 224X224 resize 과정에서 이미지의 비율이 변형되는 문제
        → 원본 이미지의 비율을 고려하여 정방형으로 잘라주는 함수를 구현
     2. 색상 분류
        원본 데이터셋의 색상 라벨 수는 72가지 - 일관되지 않은 라벨링 문제
        → 27가지 종류의 라벨로 기준 재설정
        `'brown', 'brown/yellow', 'black', 'yellow', 'yellow/white',' purple', 'purple/pink','purple/white', 'pink', 'pink/white', 'red', 'red/yellow', 'red/orange', 'red/white', 'orange', 'orange/yellow', 'orange/white', 'green', 'green/yellow','green/white','transparent','blue','blue/yellow','blue/white','white', 'white/gray','gray’` - 장방형 캡슐의 경우 색상이 ‘왼쪽/오른쪽’(파랑/하양)으로 되어 있음, ‘노랑/노랑’의 경우도 있고 ‘하양/파랑’같은 경우도 존재
        → inference 시 어느쪽이 왼쪽/오른쪽인지 명확한 기준이 없기 때문에 ‘하양/파랑’과 ‘파랑/하양’은 같은 라벨로 설정 - 파랑, 파랑|옅은, 파랑|진한 과 같이 한 색깔에 대해서도 세부적으로 분류가 되어있으나 그 차이가 분명하지 않음
        → 같은 라벨로 설정 - 색상이 잘못 라벨링 되어있는 경우도 존재 → 재라벨링 - 데이터 불균형 문제
        → 각 라벨 별 1500장이 되도록 Augmentation
     3. 글자 인식
        Cloud Vision OCR을 이용하였기 때문에 따로 학습용 데이터를 구축하지 않음

### 3-2) 어떤 방법, 라이브러리나 알고리즘을 사용할것인지

| 파트     | 기술                                                         |
| -------- | ------------------------------------------------------------ |
| **Team** | Github, Figma, Notion, Discord                               |
| **FE**   | Next.js, TypeScript, React-Query, Jotai, Styletron           |
| **BE**   | Nest.js, Postgres, MongoDB, Prisma, GCP, Redis, JWT, swagger |
| **AI**   | Tensorflow, Flask                                            |

## 4. 문서화

### 4-1) 시스템 아키텍처

![시스템 아키텍처](https://user-images.githubusercontent.com/71163016/198281907-a363bd6c-a2e3-4d67-91d6-41a67bdc2b1f.png)

### 4-2) API Docs

[Swagger Docs](https://app.swaggerhub.com/apis-docs/ParkSuJeong74/wonderingpill/1.0.0)

### 4-3) ERD

## 5. 프로젝트 팀원 소개

| 이름   | 포지션                        | 담당 업무                                                                                                                                                                                       |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 백지유 | 프론트엔드 / 회의록 작성      | 1. 페이지 개발 : 로그인 / 계정 찾기, 약국 찾기, 알림 설정 / 알림 기록, 설치 안내 / 팀 & 서비스 소개 <br/> 2. botd, reCAPTCHA 세팅 <br/> 3. Firebase Cloud Messaging 세팅                        |
| 박정훈 | 프론트엔드 / 회고 및 KPT 관리 | 1. 페이지 개발 : 회원가입 / 비밀번호 찾기, 메인, 알약 캡쳐 -> 약 검색 -> 약 리스트 ->결과 / 마이 페이지 <br/> 2. Next-seo 적용으로 seo 고려 <br/> 3. UX를 고려해서 react-tooltip, toastify 적용 |
| 김별희 | 인공지능                      | 1. 알약 데이터셋 구축 : 데이터 수집 및 라벨링, 데이터 Augmentation <br/> 2. 알약 분류 모델링 : 제형/색상/문구 <br/> 3. 모델 서빙                                                                |
| 박수정 | 백엔드 / 팀장                 | 1. 인증 <br/> 2. 알림 <br/> 3. 알약 <br/> 4. 사용자                                                                                                                                             |
| 신광천 | 백엔드                        | 1. 약국 검색 필터 기능, 약국 조회 기능, 약국 북마크 기능                                                                                                                                        |
| 전원   | -                             | 1. 오후 8시 스크럼 참여, 코어 타임 (2시간), 매주 혹은 격주 KPT, 컨밴션을 지키는 개발과 PR 작성                                                                                                  |

## 5. 개발 일지

## 6. 서비스 실행 방법

레포지토리를 clone 받아야합니다!

```shell
$ git clone https://github.com/devRangers/wonderingPill.git
$ cd wonderingPill
```

각 파트별 실행이 필요합니다.

- **Front**
  @rnrn99 또는 @Malza0408 에게 `.env.local` 을 요청해 주세요!

```shell
$ cd front
$ yarn install
$ yarn dev
```

- **Back**

@ParkSuJeong 에게 `*.env`를 요청해주세요!

```shell
$ cd back
$ npm install
$ npm run start:dev
```

- **AI**

@kimbyeolhee 에게 `.env` 를 요청해주세요!

```shell
$ cd ai
$ py -3.9 -m venv myvenv
$ myvenv/Scripts/activate

$ pip install -r requirements.txt
$ export FLASK_DEBUG=development && python app.py
```

## 버전

- version 1.0.0

## FAQ

- 자주 받는 질문 정리
