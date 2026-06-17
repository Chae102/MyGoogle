const NAVER_NEWS_URL = "https://news.naver.com";

const MOCK_NEWS = {
  default: [
    {
      title: "국내 IT 업계, AI 서비스 경쟁 본격화",
      summary: "테크뉴스 · 6월 17일 등록",
      source: "테크뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "반도체 수출 회복세, 하반기 투자 확대 기대",
      summary: "디지털경제 · 6월 17일 등록",
      source: "디지털경제",
      url: NAVER_NEWS_URL,
    },
    {
      title: "소프트웨어 기업들, 클라우드 전환 수요에 실적 개선",
      summary: "IT비즈 · 6월 16일 등록",
      source: "IT비즈",
      url: NAVER_NEWS_URL,
    },
    {
      title: "정부, 차세대 기술 인재 양성 프로그램 확대",
      summary: "전자신문 · 6월 16일 등록",
      source: "전자신문",
      url: NAVER_NEWS_URL,
    },
    {
      title: "국내 플랫폼 기업, 업무 자동화 솔루션 출시",
      summary: "테크투데이 · 6월 15일 등록",
      source: "테크투데이",
      url: NAVER_NEWS_URL,
    },
  ],
  ai: [
    {
      title: "생성형 AI 도입 기업 증가, 업무 생산성 개선 사례 확산",
      summary: "AI타임스 · 6월 17일 등록",
      source: "AI타임스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "오픈AI 신기능 공개에 국내 AI 업계도 서비스 고도화",
      summary: "인공지능뉴스 · 6월 17일 등록",
      source: "인공지능뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "금융권, 상담 업무에 AI 에이전트 적용 확대",
      summary: "핀테크저널 · 6월 16일 등록",
      source: "핀테크저널",
      url: NAVER_NEWS_URL,
    },
    {
      title: "AI 반도체 스타트업, 대규모 투자 유치 추진",
      summary: "테크파이낸스 · 6월 16일 등록",
      source: "테크파이낸스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "교육업계, 개인 맞춤형 인공지능 학습 서비스 경쟁",
      summary: "에듀테크뉴스 · 6월 15일 등록",
      source: "에듀테크뉴스",
      url: NAVER_NEWS_URL,
    },
  ],
  security: [
    {
      title: "랜섬웨어 공격 증가, 기업 보안 점검 필요성 커져",
      summary: "보안뉴스 · 6월 17일 등록",
      source: "보안뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "공공기관 대상 해킹 시도 탐지, 침해 대응 체계 강화",
      summary: "시큐리티데일리 · 6월 17일 등록",
      source: "시큐리티데일리",
      url: NAVER_NEWS_URL,
    },
    {
      title: "제로트러스트 보안 도입, 대기업에서 중견기업으로 확대",
      summary: "정보보호저널 · 6월 16일 등록",
      source: "정보보호저널",
      url: NAVER_NEWS_URL,
    },
    {
      title: "모바일 피싱 피해 증가에 금융 앱 보안 기능 강화",
      summary: "디지털안전 · 6월 16일 등록",
      source: "디지털안전",
      url: NAVER_NEWS_URL,
    },
    {
      title: "클라우드 보안 시장 성장, 관리형 보안 서비스 주목",
      summary: "클라우드뉴스 · 6월 15일 등록",
      source: "클라우드뉴스",
      url: NAVER_NEWS_URL,
    },
  ],
  mobile: [
    {
      title: "신형 스마트폰 공개 앞두고 부품 공급망 분주",
      summary: "모바일투데이 · 6월 17일 등록",
      source: "모바일투데이",
      url: NAVER_NEWS_URL,
    },
    {
      title: "안드로이드 앱 개발사, 온디바이스 AI 기능 적용 확대",
      summary: "앱마켓뉴스 · 6월 17일 등록",
      source: "앱마켓뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "아이폰 사용자 겨냥한 구독형 모바일 서비스 증가",
      summary: "디지털라이프 · 6월 16일 등록",
      source: "디지털라이프",
      url: NAVER_NEWS_URL,
    },
    {
      title: "모바일 결제 시장, 간편 인증 경쟁 본격화",
      summary: "핀테크뉴스 · 6월 16일 등록",
      source: "핀테크뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "통신사, 5G 특화 요금제와 모바일 혜택 개편",
      summary: "통신경제 · 6월 15일 등록",
      source: "통신경제",
      url: NAVER_NEWS_URL,
    },
  ],
  startup: [
    {
      title: "기술 창업 투자 회복세, 초기 스타트업 데모데이 활기",
      summary: "스타트업투데이 · 6월 17일 등록",
      source: "스타트업투데이",
      url: NAVER_NEWS_URL,
    },
    {
      title: "벤처투자사, AI와 헬스케어 분야 집중 발굴",
      summary: "벤처스퀘어 · 6월 17일 등록",
      source: "벤처스퀘어",
      url: NAVER_NEWS_URL,
    },
    {
      title: "B2B SaaS 스타트업, 해외 시장 진출 속도",
      summary: "창업경제 · 6월 16일 등록",
      source: "창업경제",
      url: NAVER_NEWS_URL,
    },
    {
      title: "대기업 오픈이노베이션 프로그램에 스타트업 참여 확대",
      summary: "이노베이션뉴스 · 6월 16일 등록",
      source: "이노베이션뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "로컬 기반 창업팀, 커머스 플랫폼과 협업 강화",
      summary: "비즈테크 · 6월 15일 등록",
      source: "비즈테크",
      url: NAVER_NEWS_URL,
    },
  ],
  ev: [
    {
      title: "전기차 충전 인프라 확대, 도심 급속 충전소 늘어난다",
      summary: "모빌리티뉴스 · 6월 17일 등록",
      source: "모빌리티뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "로봇 배송 실증 지역 확대, 자율주행 기술 고도화",
      summary: "로봇신문 · 6월 17일 등록",
      source: "로봇신문",
      url: NAVER_NEWS_URL,
    },
    {
      title: "완성차 업계, 차세대 전기차 배터리 협력 강화",
      summary: "자동차경제 · 6월 16일 등록",
      source: "자동차경제",
      url: NAVER_NEWS_URL,
    },
    {
      title: "자율주행 셔틀 서비스, 산업단지에서 시범 운행",
      summary: "스마트시티뉴스 · 6월 16일 등록",
      source: "스마트시티뉴스",
      url: NAVER_NEWS_URL,
    },
    {
      title: "서비스 로봇 시장 성장, 호텔과 물류 현장 도입 증가",
      summary: "테크모빌리티 · 6월 15일 등록",
      source: "테크모빌리티",
      url: NAVER_NEWS_URL,
    },
  ],
};

const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

const getCategory = (query = "") => {
  if (/인공지능|AI|오픈AI/i.test(query)) return "ai";
  if (/보안|해킹|랜섬웨어/.test(query)) return "security";
  if (/스마트폰|모바일|아이폰|안드로이드/.test(query)) return "mobile";
  if (/스타트업|벤처|창업/.test(query)) return "startup";
  if (/전기차|로봇|자율주행/.test(query)) return "ev";
  return "default";
};

export async function fetchLatestNews(query, options = {}) {
  await delay(400, options.signal);

  if (options.signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  // TODO: 네이버 뉴스 API 연결 시 이 부분을 실제 fetch 요청으로 교체
  // const params = new URLSearchParams({ query });
  // const response = await fetch(`/api/news?${params}`, { signal: options.signal });
  // return (await response.json()).articles;
  const category = getCategory(query);
  return MOCK_NEWS[category].map((item) => ({ ...item }));
}
