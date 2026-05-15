# 📊 맞춤형 구글 대시보드 (Personal Google Dashboard)

> **"라이브러리 없이, 순수 CSS와 Native API만으로 구현한 대시보드"**

이 프로젝트는 외부 프레임워크나 라이브러리에 의존하지 않고, 웹의 본질인 **Pure CSS(Flex/Grid)**와 **브라우저 내장 API**만을 활용하여 구현한 개인 대시보드입니다. 픽셀 단위의 UI 컨트롤과 브라우저 통신 원리를 깊이 있게 학습하기 위해 진행되었습니다.

---

## 🚀 Key Highlights (기술적 강점)

- **Zero-Dependency UI:** UI 프레임워크(MUI, Tailwind 등) 도움 없이 **Pure CSS(Flex/Grid)**만으로 Google 스타일의 카드 레이아웃과 반응형 디자인을 재현했습니다.
- **Native Web API 활용:**
    - **Geolocation API:** 실시간 사용자 위치를 파악하여 지역별 맞춤 정보를 제공합니다.
    - **Fetch API:** `Axios` 없이 순수 네트워크 요청을 통해 기상 및 뉴스 데이터를 비동기적으로 로드합니다.
- **Real-time State Management:** React의 `useState`, `useEffect`, `useCallback` 등을 활용하여 실시간 시계 동기화 및 데이터 캐싱 로직을 직접 설계했습니다.
- **AI-Driven News Curation:** LLM(Claude) API의 **Web Search Tool**을 연동하여 실시간 기술 뉴스를 JSON으로 파싱하고 렌더링하는 고도화된 연동 로직을 포함합니다.

---

## 🛠 Tech Stack (사용 기술)

- **Frontend:** `React`
- **Styling:** `Pure CSS (In-line Style)`, `Flexbox`, `CSS Grid`
- **API:** `Open-Meteo API (Weather)`, `Claude API (News Search)`, `Browser Geolocation API`

---

## 📂 Key Features (주요 기능)

### 1. 실시간 시계 (Clock Card)
- `setInterval`과 `useEffect` 클린업 함수를 활용한 메모리 누수 없는 초 단위 시계.
- 한국어 날짜 및 요일 표시 로직 구현.

### 2. 위치 기반 날씨 예보 (Weather Card)
- 사용자의 위도/경도를 감지하여 현재 기온, 체감 온도, 습도, 풍속 출력.
- 시간대별 예보 데이터를 가공하여 가로형 스크롤 리스트로 시각화.

### 3. 오늘의 할 일 (Todo Card)
- 상태 관리를 통한 할 일 추가/완료/삭제 기능.
- 진행률(Progress Bar) 연동으로 실시간 성취도 시각화.

### 4. 실시간 기술 뉴스 (News Card)
- 카테고리별(AI, 보안, 모바일 등) 최신 IT 뉴스 자동 큐레이션.
- API 응답 데이터의 정규표현식 전처리를 통한 안정적인 JSON 파싱.

---


