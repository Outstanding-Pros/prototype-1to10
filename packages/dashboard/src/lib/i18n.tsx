"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Language = "ko" | "en";

const translations = {
  // Sidebar nav
  "nav.appProfile": { ko: "애널리틱스", en: "Analytics" },
  "nav.level": { ko: "마켓", en: "Market" },
  "nav.benchmark": { ko: "벤치마크", en: "Benchmark" },
  "nav.simulation": { ko: "비즈니스 모델", en: "Business Model" },
  "nav.roadmap": { ko: "스프린트", en: "Sprint" },
  "nav.strategy": { ko: "로드맵", en: "Roadmap" },

  // Sidebar UI
  "sidebar.currentApp": { ko: "현재 서비스", en: "Current Service" },
  "sidebar.diagnosisResults": { ko: "성장 현황", en: "Growth Status" },
  "sidebar.expiry": { ko: "만료", en: "Expires" },
  "sidebar.settings": { ko: "설정", en: "Settings" },
  "sidebar.accessibility": { ko: "접근성", en: "Accessibility" },
  "sidebar.language": { ko: "언어", en: "Language" },
  "sidebar.lightMode": { ko: "라이트", en: "Light" },
  "sidebar.darkMode": { ko: "다크", en: "Dark" },

  // AppProfile
  "appProfile.title": { ko: "프로덕트 애널리틱스", en: "Product Analytics" },
  "appProfile.product": { ko: "프로덕트", en: "Product" },
  "appProfile.vertical": { ko: "버티컬", en: "Vertical" },
  "appProfile.monetizationModel": { ko: "수익화 모델", en: "Monetization Model" },
  "appProfile.none": { ko: "없음", en: "None" },
  "appProfile.engagement": { ko: "인게이지먼트", en: "Engagement" },
  "appProfile.revenuePerformance": { ko: "수익 퍼포먼스", en: "Revenue Performance" },
  "appProfile.mrr": { ko: "MRR", en: "MRR" },
  "appProfile.revenueTarget": { ko: "매출 목표", en: "Revenue Target" },
  "appProfile.revenueGap": { ko: "매출 갭", en: "Revenue Gap" },
  "appProfile.attainment": { ko: "달성률", en: "Attainment" },
  "appProfile.perMonth": { ko: "/월", en: "/mo" },
  "appProfile.model.banner": { ko: "배너", en: "Banner" },
  "appProfile.model.interstitial": { ko: "전면", en: "Interstitial" },
  "appProfile.model.iapTheme": { ko: "인앱(테마)", en: "IAP (Theme)" },
  "appProfile.model.adsenseDisplay": { ko: "디스플레이 광고", en: "Display Ads" },
  "appProfile.benchmarkRange": { ko: "벤치마크 범위", en: "Benchmark Range" },

  // LevelDiagnosis
  "level.title": { ko: "수익화 성숙도", en: "Monetization Maturity" },
  "level.1.name": { ko: "수익 모델 없음", en: "No Revenue Model" },
  "level.1.task": { ko: "첫 수익 모델 선택", en: "Choose First Revenue Model" },
  "level.2.name": { ko: "광고 단일 의존", en: "Ad-only Dependency" },
  "level.2.task": { ko: "수익 모델 다변화", en: "Diversify Revenue Models" },
  "level.3.name": { ko: "복합 수익 초기", en: "Early Hybrid Revenue" },
  "level.3.task": { ko: "CVR 최적화", en: "Optimize CVR" },
  "level.4.name": { ko: "수익 구조 안정", en: "Stable Revenue Structure" },
  "level.4.task": { ko: "ARPU / 리텐션 최적화", en: "Optimize ARPU / Retention" },
  "level.5.name": { ko: "스케일 준비", en: "Ready to Scale" },
  "level.5.task": { ko: "그로스 채널 확장", en: "Expand Growth Channels" },
  "level.assessment": { ko: "진단 기준", en: "Assessment" },
  "level.keyObjective": { ko: "핵심 OKR", en: "Key Objective" },
  "level.growthPotential": { ko: "성장 잠재력", en: "Growth Potential" },

  // Market Positioning
  "level.positioning": { ko: "마켓 포지셔닝", en: "Market Positioning" },
  "level.positioning.tam": { ko: "TAM", en: "TAM" },
  "level.positioning.sam": { ko: "SAM", en: "SAM" },
  "level.positioning.segment": { ko: "타겟 세그먼트", en: "Target Segment" },
  "level.positioning.stage": { ko: "마켓 스테이지", en: "Market Stage" },
  "level.positioning.statement": { ko: "포지셔닝 요약", en: "Positioning" },
  "level.positioning.stage.emerging": { ko: "초기", en: "Emerging" },
  "level.positioning.stage.growing": { ko: "성장기", en: "Growing" },
  "level.positioning.stage.mature": { ko: "성숙기", en: "Mature" },
  "level.positioning.stage.declining": { ko: "쇠퇴기", en: "Declining" },

  // Positioning Map
  "level.positioning.map": { ko: "포지셔닝 맵", en: "Positioning Map" },
  "level.positioning.map.target": { ko: "목표 포지션", en: "Target Position" },

  // Competitive Landscape
  "level.competitive": { ko: "경쟁 환경 분석", en: "Competitive Landscape" },
  "level.competitive.service": { ko: "서비스", en: "Service" },
  "level.competitive.model": { ko: "수익 모델", en: "Revenue Model" },
  "level.competitive.scale": { ko: "규모", en: "Scale" },
  "level.competitive.diff": { ko: "차별점", en: "Differentiator" },
  "level.moats": { ko: "경쟁 우위 (Moats)", en: "Competitive Moats" },
  "level.vulnerabilities": { ko: "리스크 요인", en: "Risk Factors" },

  // BenchmarkComparison
  "benchmark.title": { ko: "코호트 벤치마크", en: "Cohort Benchmark" },
  "benchmark.cohort": { ko: "코호트", en: "Cohort" },
  "benchmark.metric": { ko: "메트릭", en: "Metric" },
  "benchmark.yours": { ko: "Your", en: "Yours" },
  "benchmark.p50": { ko: "P50", en: "P50" },
  "benchmark.p75": { ko: "P75", en: "P75" },
  "benchmark.percentile": { ko: "퍼센타일", en: "Percentile" },
  "benchmark.verdict.low": { ko: "Below Avg", en: "Below Avg" },
  "benchmark.verdict.avg": { ko: "On Par", en: "On Par" },
  "benchmark.verdict.high": { ko: "Above Avg", en: "Above Avg" },
  "benchmark.keyInsight": { ko: "Key Insight", en: "Key Insight" },
  "benchmark.sameMAU": {
    ko: "동일 MAU 코호트 P75 MRR:",
    en: "Same MAU cohort P75 MRR:",
  },
  "benchmark.currentVs": { ko: "현재 대비", en: "vs. current —" },
  "benchmark.revenuePotential": { ko: "수익 업사이드", en: "revenue upside" },
  "benchmark.stickinessLevel": { ko: "수준", en: "level" },

  // BenchmarkComparison section headers
  "benchmark.section.engagement": { ko: "트래픽 & 인게이지먼트", en: "Traffic & Engagement" },
  "benchmark.section.revenue": { ko: "수익 퍼포먼스", en: "Revenue Performance" },
  "benchmark.section.retention": { ko: "리텐션 & 이탈", en: "Retention & Churn" },

  // BenchmarkComparison row labels
  "benchmark.row.ecpm": { ko: "eCPM (Display)", en: "eCPM (Display)" },
  "benchmark.row.dauMau": { ko: "DAU/MAU Ratio", en: "DAU/MAU Ratio" },
  "benchmark.row.arpu": { ko: "ARPU (Blended)", en: "ARPU (Blended)" },
  "benchmark.row.arpuAdOnly": { ko: "ARPU (Ad-only)", en: "ARPU (Ad-only)" },
  "benchmark.row.bounceRate": { ko: "Bounce Rate", en: "Bounce Rate" },
  "benchmark.row.sessionDuration": { ko: "Avg. Session Duration", en: "Avg. Session Duration" },
  "benchmark.row.pagesPerSession": { ko: "Pages / Session", en: "Pages / Session" },
  "benchmark.row.retentionD1": { ko: "D1 Retention", en: "D1 Retention" },
  "benchmark.row.retentionD7": { ko: "D7 Retention", en: "D7 Retention" },
  "benchmark.row.churn": { ko: "Monthly Churn Rate", en: "Monthly Churn Rate" },

  // Benchmark data sources
  "benchmark.source": { ko: "데이터 소스", en: "Data Sources" },
  "benchmark.source.traffic": { ko: "SimilarWeb 코호트 벤치마크", en: "SimilarWeb Cohort Benchmark" },
  "benchmark.source.ux": { ko: "Beusable CX 분석", en: "Beusable CX Analytics" },
  "benchmark.source.retention": { ko: "ThinkingData 코호트 리텐션", en: "ThinkingData Cohort Retention" },

  // RevenueSimulation
  "simulation.title": { ko: "매출 포캐스팅", en: "Revenue Forecast" },
  "simulation.recommendedModel": { ko: "추천 수익화 모델", en: "Recommended Model" },
  "simulation.pricePoint": { ko: "가격 포인트", en: "Price Point" },
  "simulation.perMonth": { ko: "/월", en: "/mo" },
  "simulation.cvr": { ko: "CVR", en: "CVR" },
  "simulation.subscribers": { ko: "명", en: "subs" },
  "simulation.subscription": { ko: "구독 매출", en: "Subscription Rev." },
  "simulation.adRevenue": { ko: "+ 광고 매출", en: "+ Ad Rev." },
  "simulation.total": { ko: "Total MRR", en: "Total MRR" },
  "simulation.default": { ko: "Base", en: "Base" },
  "simulation.goalMet": { ko: "Target 달성", en: "Target Met" },
  "simulation.goalNotMet": { ko: "Target 미달", en: "Below Target" },
  "simulation.formula": { ko: "산출 로직", en: "Calculation Logic" },
  "simulation.formulaDesc": {
    ko: "× CVR ×",
    en: "× CVR ×",
  },
  "simulation.formulaResult": { ko: "= 구독 매출", en: "= Subscription Revenue" },
  "simulation.convBasis": {
    ko: "CVR 근거: 카테고리 벤치마크 1.5~6% (웹 SaaS/커뮤니티)",
    en: "CVR basis: Category benchmark 1.5–6% (Web SaaS/Community)",
  },
  "simulation.disclaimer": {
    ko: "※ 코호트 벤치마크 기반 추정치이며, 실제 퍼포먼스와 상이할 수 있습니다",
    en: "※ Estimates based on cohort benchmarks; actual performance may vary",
  },

  // Roadmap
  "roadmap.title": { ko: "스프린트 실행 로드맵", en: "Sprint Execution Roadmap" },
  "roadmap.current": { ko: "현재", en: "Current" },
  "roadmap.deliverable": { ko: "산출물:", en: "Deliverable:" },
  "roadmap.criteria": { ko: "판단 기준", en: "Decision Criteria" },
  "roadmap.sprint": { ko: "스프린트", en: "Sprint" },
  "roadmap.timeline": { ko: "타임라인", en: "Timeline" },
  "roadmap.priority.high": { ko: "높음", en: "High" },
  "roadmap.priority.medium": { ko: "보통", en: "Medium" },
  "roadmap.priority.low": { ko: "낮음", en: "Low" },
  "roadmap.day": { ko: "일", en: "D" },
  "roadmap.hypothesis": { ko: "가설", en: "Hypothesis" },
  "roadmap.metric": { ko: "검증 지표", en: "Validation" },

  // Strategy (Macro Roadmap)
  "strategy.title": { ko: "로드맵", en: "Roadmap" },
  "strategy.northStar": { ko: "North Star", en: "North Star" },
  "strategy.timeframe": { ko: "타임프레임", en: "Timeframe" },
  "strategy.phase": { ko: "Phase", en: "Phase" },
  "strategy.theme": { ko: "전략 테마", en: "Strategy Theme" },
  "strategy.goals": { ko: "핵심 목표", en: "Key Goals" },
  "strategy.status.active": { ko: "진행 중", en: "Active" },
  "strategy.status.upcoming": { ko: "예정", en: "Upcoming" },
  "strategy.status.completed": { ko: "완료", en: "Done" },

  // MeasurementSetup
  "measurement.title": { ko: "측정 준비도", en: "Measurement Readiness" },
  "measurement.fullSetup": { ko: "완전 설정", en: "Fully Set Up" },
  "measurement.partialSetup": { ko: "부분 설정", en: "Partially Set Up" },
  "measurement.notSetup": { ko: "미설정", en: "Not Set Up" },
  "measurement.partialMsg": {
    ko: "일부 측정 항목이 누락되어 있습니다. 보완하면 정밀한 성장 전략이 가능합니다.",
    en: "Some measurement items are missing. Complete them for precise growth guidance.",
  },
  "measurement.notSetupMsg": {
    ko: "지표 없이는 실행도 검증도 불가능합니다. 측정 체계를 갖추는 것이 첫 번째 스프린트입니다.",
    en: "Without metrics, execution and validation are impossible. Setting up measurement is the first sprint.",
  },
  "measurement.timeline": { ko: "2주 세팅 타임라인", en: "2-Week Setup Timeline" },
  "measurement.day1_3": {
    ko: "위 항목 설치 (총 1~2시간)",
    en: "Install above items (1–2 hours total)",
  },
  "measurement.day4_10": {
    ko: "데이터 축적 (매일 3분 체크)",
    en: "Accumulate data (3 min daily check)",
  },
  "measurement.day11_14": {
    ko: "첫 데이터 리뷰 → 성장 전략 활성화",
    en: "First data review → Growth strategy activation",
  },

  // Offer banner (sidebar)
  "offer.headline": { ko: "Pro 플랜", en: "Pro Plan" },
  "offer.cta": { ko: "자세히 보기", en: "Learn More" },

  // Offer modal
  "offer.modal.title": { ko: "월간 구독", en: "Monthly Plan" },
  "offer.modal.price": { ko: "₩49,000", en: "₩49,000" },
  "offer.modal.perMonth": { ko: "/월", en: "/mo" },
  "offer.modal.desc": {
    ko: "스프린트 사이클을 반복할수록 정밀해지는 성장 전략을 경험하세요.",
    en: "Experience growth strategy that sharpens with each sprint cycle.",
  },
  "offer.modal.feature1": {
    ko: "대시보드 지속 접근 및 스프린트 이력 유지",
    en: "Continued dashboard access & sprint history",
  },
  "offer.modal.feature2": {
    ko: "매 스프린트 결과 기반 다음 가설 자동 설계",
    en: "Next hypothesis auto-designed from sprint results",
  },
  "offer.modal.feature3": {
    ko: "코호트 벤치마크 실시간 업데이트",
    en: "Real-time cohort benchmark updates",
  },
  "offer.modal.feature4": {
    ko: "개발 환경 CLI 통합 (npx @copo/cli init)",
    en: "Dev CLI integration (npx @copo/cli init)",
  },
  "offer.modal.subscribe": { ko: "구독 시작하기", en: "Start Subscription" },
  "offer.modal.trial": {
    ko: "현재 무료 체험 중 · 만료 2026.03.29",
    en: "Free trial active · Expires 2026.03.29",
  },

  // Login
  "login.title": { ko: "Copo", en: "Copo" },
  "login.subtitle": { ko: "Co-Product Owner", en: "Co-Product Owner" },
  "login.email": { ko: "이메일", en: "Email" },
  "login.emailPlaceholder": { ko: "name@example.com", en: "name@example.com" },
  "login.password": { ko: "비밀번호", en: "Password" },
  "login.submit": { ko: "로그인", en: "Log in" },
  "login.signup": { ko: "회원가입", en: "Sign up" },
  "login.noAccount": { ko: "계정이 없으신가요?", en: "Don't have an account?" },

  // Onboarding
  "onboarding.step": { ko: "단계", en: "Step" },
  "onboarding.prev": { ko: "이전", en: "Previous" },
  "onboarding.next": { ko: "다음", en: "Next" },
  "onboarding.skip": { ko: "건너뛰기", en: "Skip" },
  "onboarding.startDiagnosis": { ko: "성장 시작", en: "Start Growing" },

  // Onboarding Step 1
  "onboarding.step1.title": { ko: "기본 정보", en: "Basic Info" },
  "onboarding.step1.serviceName": { ko: "서비스명", en: "Service Name" },
  "onboarding.step1.serviceNamePlaceholder": { ko: "예: My SaaS", en: "e.g. My SaaS" },
  "onboarding.step1.websiteUrl": { ko: "웹사이트 URL", en: "Website URL" },
  "onboarding.step1.websiteUrlPlaceholder": { ko: "https://example.com", en: "https://example.com" },
  "onboarding.step1.category": { ko: "카테고리", en: "Category" },
  "onboarding.step1.categoryPlaceholder": { ko: "선택하세요", en: "Select" },
  "onboarding.step1.cat.saas": { ko: "SaaS", en: "SaaS" },
  "onboarding.step1.cat.commerce": { ko: "커머스", en: "Commerce" },
  "onboarding.step1.cat.content": { ko: "콘텐츠/미디어", en: "Content / Media" },
  "onboarding.step1.cat.utility": { ko: "유틸리티", en: "Utility" },
  "onboarding.step1.cat.education": { ko: "교육", en: "Education" },
  "onboarding.step1.cat.community": { ko: "커뮤니티", en: "Community" },
  "onboarding.step1.cat.other": { ko: "기타", en: "Other" },

  // Onboarding Step 2
  "onboarding.step2.title": { ko: "코드 저장소", en: "Code Repository" },
  "onboarding.step2.githubUrl": { ko: "GitHub 저장소 URL", en: "GitHub Repository URL" },
  "onboarding.step2.githubPlaceholder": { ko: "https://github.com/user/repo", en: "https://github.com/user/repo" },
  "onboarding.step2.notice": {
    ko: "코드 분석을 위해 Public 저장소가 필요합니다. Private인 경우 전환 후 URL을 입력해주세요.",
    en: "A public repository is required for code analysis. If private, please switch to public before entering the URL.",
  },

  // Onboarding Step 3
  "onboarding.step3.title": { ko: "분석 도구", en: "Analytics Tools" },
  "onboarding.step3.description": { ko: "사용 중인 분석/측정 도구를 선택하세요", en: "Select the analytics tools you use" },
  "onboarding.step3.ga": { ko: "Google Analytics", en: "Google Analytics" },
  "onboarding.step3.clarity": { ko: "Microsoft Clarity", en: "Microsoft Clarity" },
  "onboarding.step3.beusable": { ko: "뷰저블 (Beusable)", en: "Beusable" },
  "onboarding.step3.amplitude": { ko: "Amplitude", en: "Amplitude" },
  "onboarding.step3.mixpanel": { ko: "Mixpanel", en: "Mixpanel" },
  "onboarding.step3.hotjar": { ko: "Hotjar", en: "Hotjar" },
  "onboarding.step3.other": { ko: "기타 (직접 입력)", en: "Other (enter manually)" },
  "onboarding.step3.integrationId": { ko: "연동 정보 (Property ID 등)", en: "Integration info (Property ID, etc.)" },

  // Onboarding Step 4
  "onboarding.step4.title": { ko: "수익 현황", en: "Revenue Status" },
  "onboarding.step4.revenueModel": { ko: "현재 수익 모델", en: "Current Revenue Model" },
  "onboarding.step4.adsense": { ko: "AdSense", en: "AdSense" },
  "onboarding.step4.admob": { ko: "AdMob", en: "AdMob" },
  "onboarding.step4.subscription": { ko: "구독", en: "Subscription" },
  "onboarding.step4.iap": { ko: "인앱결제", en: "In-App Purchase" },
  "onboarding.step4.commerceModel": { ko: "커머스", en: "Commerce" },
  "onboarding.step4.noRevenue": { ko: "없음", en: "None" },
  "onboarding.step4.monthlyRevenue": { ko: "월 수익 범위", en: "Monthly Revenue Range" },
  "onboarding.step4.revenuePlaceholder": { ko: "선택하세요", en: "Select" },
  "onboarding.step4.rev.none": { ko: "없음", en: "None" },
  "onboarding.step4.rev.under50": { ko: "~50만원", en: "< ₩500K" },
  "onboarding.step4.rev.50to200": { ko: "50~200만원", en: "₩500K–₩2M" },
  "onboarding.step4.rev.200to500": { ko: "200~500만원", en: "₩2M–₩5M" },
  "onboarding.step4.rev.500to1000": { ko: "500만~1000만원", en: "₩5M–₩10M" },
  "onboarding.step4.rev.over1000": { ko: "1000만원+", en: "₩10M+" },
  "onboarding.step4.targetRevenue": { ko: "목표 월 수익 (원)", en: "Target Monthly Revenue (₩)" },
  "onboarding.step4.targetPlaceholder": { ko: "예: 5000000", en: "e.g. 5000000" },
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("copo-language") as Language | null;
    if (stored === "ko" || stored === "en") {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("copo-language", lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[key]?.[language] ?? key;
    },
    [language],
  );

  // Prevent flash of wrong language
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "ko", setLanguage, t: (key) => translations[key]?.ko ?? key }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
