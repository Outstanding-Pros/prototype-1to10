"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Language = "ko" | "en";

const translations = {
  // Sidebar nav
  "nav.appProfile": { ko: "앱 프로필", en: "App Profile" },
  "nav.level": { ko: "수익화 단계", en: "Monetization Level" },
  "nav.benchmark": { ko: "벤치마크", en: "Benchmark" },
  "nav.simulation": { ko: "시뮬레이션", en: "Simulation" },
  "nav.roadmap": { ko: "로드맵", en: "Roadmap" },
  "nav.nextSteps": { ko: "다음 스텝", en: "Next Steps" },

  // Sidebar UI
  "sidebar.currentApp": { ko: "현재 앱", en: "Current App" },
  "sidebar.diagnosisResults": { ko: "진단 결과", en: "Diagnosis Results" },
  "sidebar.expiry": { ko: "만료", en: "Expires" },
  "sidebar.settings": { ko: "설정", en: "Settings" },
  "sidebar.accessibility": { ko: "접근성", en: "Accessibility" },
  "sidebar.language": { ko: "언어", en: "Language" },
  "sidebar.lightMode": { ko: "라이트", en: "Light" },
  "sidebar.darkMode": { ko: "다크", en: "Dark" },

  // AppProfile
  "appProfile.title": { ko: "앱 프로필", en: "App Profile" },
  "appProfile.appName": { ko: "앱 이름", en: "App Name" },
  "appProfile.category": { ko: "카테고리", en: "Category" },
  "appProfile.revenueModel": { ko: "수익 모델", en: "Revenue Model" },
  "appProfile.none": { ko: "없음", en: "None" },
  "appProfile.monthlyRevenue": { ko: "월 수익", en: "Monthly Revenue" },
  "appProfile.target": { ko: "목표", en: "Target" },
  "appProfile.revenueGap": { ko: "수익 갭", en: "Revenue Gap" },
  "appProfile.perMonth": { ko: "/월", en: "/mo" },
  "appProfile.model.banner": { ko: "배너", en: "Banner" },
  "appProfile.model.interstitial": { ko: "전면", en: "Interstitial" },
  "appProfile.model.iapTheme": { ko: "인앱(테마)", en: "IAP (Theme)" },

  // LevelDiagnosis
  "level.title": { ko: "수익화 단계 진단", en: "Monetization Level Diagnosis" },
  "level.1.name": { ko: "수익 모델 없음", en: "No Revenue Model" },
  "level.1.task": { ko: "첫 수익 모델 선택", en: "Choose First Revenue Model" },
  "level.2.name": { ko: "광고 단일 의존", en: "Ad-only Dependency" },
  "level.2.task": { ko: "수익 모델 다변화", en: "Diversify Revenue Models" },
  "level.3.name": { ko: "복합 수익 초기", en: "Early Hybrid Revenue" },
  "level.3.task": { ko: "전환율 최적화", en: "Optimize Conversion Rate" },
  "level.4.name": { ko: "수익 구조 안정", en: "Stable Revenue Structure" },
  "level.4.task": { ko: "객단가/리텐션 최적화", en: "Optimize ARPU / Retention" },
  "level.5.name": { ko: "스케일 준비", en: "Ready to Scale" },
  "level.5.task": { ko: "성장 채널 확장", en: "Expand Growth Channels" },
  "level.basis": { ko: "판정 근거", en: "Basis" },
  "level.keyTask": { ko: "핵심 과제", en: "Key Task" },
  "level.potential": { ko: "잠재력", en: "Potential" },

  // BenchmarkComparison
  "benchmark.title": { ko: "벤치마크 비교", en: "Benchmark Comparison" },
  "benchmark.appSuffix": { ko: "앱", en: "Apps" },
  "benchmark.metric": { ko: "지표", en: "Metric" },
  "benchmark.yours": { ko: "당신", en: "Yours" },
  "benchmark.avg": { ko: "평균", en: "Average" },
  "benchmark.top25": { ko: "상위 25%", en: "Top 25%" },
  "benchmark.verdict": { ko: "판정", en: "Verdict" },
  "benchmark.verdict.low": { ko: "하위", en: "Low" },
  "benchmark.verdict.avg": { ko: "평균", en: "Avg" },
  "benchmark.verdict.high": { ko: "상위", en: "High" },
  "benchmark.keyInsight": { ko: "핵심 인사이트", en: "Key Insight" },
  "benchmark.sameMAU": {
    ko: "같은 MAU에서 상위 25% 앱의 월 수익:",
    en: "Monthly revenue of top 25% apps at same MAU:",
  },
  "benchmark.currentVs": { ko: "현재 대비", en: "vs. current —" },
  "benchmark.revenuePotential": { ko: "의 수익 잠재력", en: "revenue potential" },
  "benchmark.stickinessLevel": { ko: "수준", en: "level" },

  // BenchmarkComparison row labels
  "benchmark.row.ecpm": { ko: "eCPM (전면)", en: "eCPM (Interstitial)" },
  "benchmark.row.dauMau": { ko: "DAU/MAU", en: "DAU/MAU" },
  "benchmark.row.arpu": { ko: "ARPU (전체)", en: "ARPU (Total)" },
  "benchmark.row.arpuAdOnly": { ko: "광고 only ARPU", en: "Ad-only ARPU" },

  // RevenueSimulation
  "simulation.title": { ko: "수익 시뮬레이션", en: "Revenue Simulation" },
  "simulation.recommendedModel": { ko: "추천 수익 모델", en: "Recommended Model" },
  "simulation.subscriptionPrice": { ko: "구독 가격", en: "Subscription Price" },
  "simulation.perMonth": { ko: "/월", en: "/mo" },
  "simulation.conversionRate": { ko: "전환율", en: "Conv. Rate" },
  "simulation.subscribers": { ko: "명", en: "subs" },
  "simulation.subscription": { ko: "구독", en: "Subscription" },
  "simulation.adRevenue": { ko: "+ 광고", en: "+ Ads" },
  "simulation.total": { ko: "합산", en: "Total" },
  "simulation.default": { ko: "기본", en: "Base" },
  "simulation.goalMet": { ko: "목표 달성", en: "Goal Met" },
  "simulation.goalNotMet": { ko: "목표 미달", en: "Below Target" },
  "simulation.formula": { ko: "계산식", en: "Formula" },
  "simulation.formulaDesc": {
    ko: "× 전환율 ×",
    en: "× Conv. Rate ×",
  },
  "simulation.formulaResult": { ko: "= 구독 수익", en: "= Subscription Revenue" },
  "simulation.convBasis": {
    ko: "전환율 근거: 카테고리 평균 1.5~5% (RevenueCat 2024 리포트)",
    en: "Conv. rate basis: Category avg. 1.5–5% (RevenueCat 2024 Report)",
  },
  "simulation.disclaimer": {
    ko: "※ 카테고리 벤치마크 기반 추정이며 보장 수치가 아닙니다",
    en: "※ Estimates based on category benchmarks; not guaranteed",
  },

  // Roadmap
  "roadmap.title": { ko: "30일 실행 로드맵", en: "30-Day Execution Roadmap" },
  "roadmap.current": { ko: "현재", en: "Current" },
  "roadmap.deliverable": { ko: "산출물:", en: "Deliverable:" },
  "roadmap.criteria": { ko: "판단 기준", en: "Decision Criteria" },

  // MeasurementSetup
  "measurement.title": { ko: "측정 준비도", en: "Measurement Readiness" },
  "measurement.fullSetup": { ko: "완전 설정", en: "Fully Set Up" },
  "measurement.partialSetup": { ko: "부분 설정", en: "Partially Set Up" },
  "measurement.notSetup": { ko: "미설정", en: "Not Set Up" },
  "measurement.partialMsg": {
    ko: "일부 측정 항목이 누락되어 있습니다. 보완하면 정밀 진단이 가능합니다.",
    en: "Some measurement items are missing. Complete them for a precise diagnosis.",
  },
  "measurement.notSetupMsg": {
    ko: "지표 없이는 진단도 처방도 추측입니다. 측정 체계를 갖추는 것이 첫 번째 처방입니다.",
    en: "Without metrics, diagnosis and prescription are guesswork. Setting up measurement is the first prescription.",
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
    ko: "첫 데이터 리뷰 → 본 진단 활성화",
    en: "First data review → Full diagnosis activation",
  },

  // NextSteps
  "nextSteps.title": { ko: "다음 스텝", en: "Next Steps" },
  "nextSteps.dashboardAccess": {
    ko: "이 대시보드는",
    en: "This dashboard is accessible until",
  },
  "nextSteps.until": { ko: "까지 접근 가능합니다.", en: "." },
  "nextSteps.monthlyPlan": { ko: "월간 구독 (₩49,000/월)", en: "Monthly Plan (₩49,000/mo)" },
  "nextSteps.feature1": {
    ko: "대시보드 지속 접근 (데이터 누적 유지)",
    en: "Continued dashboard access (data retention)",
  },
  "nextSteps.feature2": {
    ko: "매주 실행 결과 기반 전략 업데이트",
    en: "Weekly strategy updates based on results",
  },
  "nextSteps.feature3": {
    ko: "실험 이력이 쌓일수록 정밀해지는 처방",
    en: "Prescriptions that improve with experiment history",
  },
  "nextSteps.subscribe": { ko: "월간 구독 시작하기", en: "Start Monthly Plan" },
  "nextSteps.devIntegration": { ko: "개발 환경 통합:", en: "Dev integration:" },

  // Login
  "login.title": { ko: "App Rx", en: "App Rx" },
  "login.subtitle": { ko: "앱 수익 처방전", en: "App Revenue Prescription" },
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
  "onboarding.startDiagnosis": { ko: "진단 시작", en: "Start Diagnosis" },

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
    const stored = localStorage.getItem("apprx-language") as Language | null;
    if (stored === "ko" || stored === "en") {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("apprx-language", lang);
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
