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
  "appProfile.title": { ko: "애널리틱스", en: "Analytics" },
  "appProfile.summary": {
    ko: "현재 서비스의 핵심 지표를 한눈에 보여줍니다. 유저가 얼마나 자주 오는지, 수익은 어떤 구조인지 파악하는 출발점이에요.",
    en: "A snapshot of your service's key metrics. This is the starting point to understand how often users visit and how your revenue is structured.",
  },
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
  "level.title": { ko: "마켓", en: "Market" },
  "level.summary": {
    ko: "같은 카테고리 서비스들과 비교해 우리 서비스의 수익화 성숙도가 어디쯤인지 보여줍니다. 현재 레벨에서 다음 단계로 가려면 무엇을 해야 하는지 확인하세요.",
    en: "Shows where your monetization maturity stands compared to similar services. See what you need to do to move from your current level to the next.",
  },
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
  "level.positioning.som": { ko: "SOM", en: "SOM" },
  "level.positioning.revenueShare": { ko: "시장 점유율", en: "Market Share" },
  "level.positioning.userShare": { ko: "사용자 점유율", en: "User Share" },
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
  "benchmark.title": { ko: "벤치마크", en: "Benchmark" },
  "benchmark.summary": {
    ko: "같은 규모·카테고리 서비스들의 중앙값(P50)과 상위 25%(P75)를 기준으로, 우리 지표가 어느 위치에 있는지 비교합니다. '하위'로 나온 지표가 가장 먼저 개선해야 할 포인트예요.",
    en: "Compares your metrics against the median (P50) and top 25% (P75) of services in the same size and category. Metrics marked 'Below Avg' are your top priorities for improvement.",
  },
  "benchmark.cohort": { ko: "코호트", en: "Cohort" },
  "benchmark.metric": { ko: "메트릭", en: "Metric" },
  "benchmark.yours": { ko: "Your", en: "Yours" },
  "benchmark.p50": { ko: "P50", en: "P50" },
  "benchmark.p75": { ko: "P75", en: "P75" },
  "benchmark.percentile": { ko: "퍼센타일", en: "Percentile" },

  // Benchmark header tooltip descriptions
  "benchmark.metric.desc": { ko: "비교 대상 지표명", en: "The metric being compared" },
  "benchmark.yours.desc": { ko: "현재 서비스의 실측 값", en: "Your service's actual value" },
  "benchmark.p50.desc": { ko: "동일 코호트 중앙값 (상위 50%)", en: "Cohort median — top 50%" },
  "benchmark.p75.desc": { ko: "동일 코호트 상위 25% 기준값", en: "Cohort top 25% threshold" },
  "benchmark.percentile.desc": { ko: "코호트 내 상대적 위치 판정", en: "Your relative position within the cohort" },
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

  // Benchmark row tooltip descriptions
  "benchmark.row.dauMau.desc": { ko: "DAU/MAU — 유저의 서비스 재방문 빈도를 나타내는 핵심 인게이지먼트 지표", en: "DAU/MAU — key engagement metric showing how often users revisit" },
  "benchmark.row.bounceRate.desc": { ko: "첫 페이지만 보고 이탈한 세션 비율. 낮을수록 좋음", en: "Percentage of single-page sessions. Lower is better" },
  "benchmark.row.sessionDuration.desc": { ko: "유저가 한 번 방문 시 평균 체류 시간", en: "Average time a user spends per visit" },
  "benchmark.row.pagesPerSession.desc": { ko: "한 세션 동안 조회한 평균 페이지 수", en: "Average pages viewed per session" },
  "benchmark.row.ecpm.desc": { ko: "1,000회 노출당 수익 (Effective Cost Per Mille)", en: "Revenue per 1,000 ad impressions" },
  "benchmark.row.arpu.desc": { ko: "전체 수익 모델 합산 유저당 평균 매출", en: "Average revenue per user across all revenue models" },
  "benchmark.row.arpuAdOnly.desc": { ko: "광고 수익만 기준으로 한 유저당 평균 매출", en: "Average revenue per user from ads only" },
  "benchmark.row.retentionD1.desc": { ko: "첫 방문 다음 날 재방문한 유저 비율", en: "Users who return 1 day after first visit" },
  "benchmark.row.retentionD7.desc": { ko: "첫 방문 7일 후 재방문한 유저 비율", en: "Users who return 7 days after first visit" },
  "benchmark.row.churn.desc": { ko: "한 달 동안 서비스를 떠난 유저 비율. 낮을수록 좋음", en: "Users lost per month. Lower is better" },

  // Benchmark data sources
  "benchmark.source": { ko: "데이터 소스", en: "Data Sources" },
  "benchmark.source.traffic": { ko: "SimilarWeb 코호트 벤치마크", en: "SimilarWeb Cohort Benchmark" },
  "benchmark.source.ux": { ko: "Beusable CX 분석", en: "Beusable CX Analytics" },
  "benchmark.source.retention": { ko: "ThinkingData 코호트 리텐션", en: "ThinkingData Cohort Retention" },

  // RevenueSimulation
  "simulation.title": { ko: "비즈니스 모델", en: "Business Model" },
  "simulation.summary": {
    ko: "데이터를 기반으로 추천하는 수익 모델과, 보수적·기본·낙관적 세 가지 시나리오별 예상 매출입니다. 비용 구조와 필요 기능까지 함께 확인해서 실행 가능성을 판단하세요.",
    en: "A data-driven revenue model recommendation with projected MRR across three scenarios. Review the cost structure and required features to assess feasibility.",
  },
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

  // RevenueSimulation — Conversion Rationale
  "simulation.conversionRationale": { ko: "전환율 근거", en: "Conversion Rationale" },
  "simulation.benchmarkSource": { ko: "벤치마크 출처", en: "Benchmark Source" },
  "simulation.factor": { ko: "영향 요인", en: "Factors" },

  // RevenueSimulation — Cost Structure & Cashflow
  "simulation.costStructure": { ko: "비용 구조 & 현금흐름", en: "Cost Structure & Cashflow" },
  "simulation.fixedCost": { ko: "고정 비용", en: "Fixed Costs" },
  "simulation.variableCost": { ko: "유저당 변동 비용", en: "Variable Cost / User" },
  "simulation.cashflow": { ko: "12개월 현금흐름 전망", en: "12-Month Cashflow Forecast" },
  "simulation.revenue": { ko: "매출", en: "Revenue" },
  "simulation.cost": { ko: "비용", en: "Cost" },
  "simulation.net": { ko: "순이익", en: "Net" },
  "simulation.breakeven": { ko: "손익분기", en: "Break-even" },
  "simulation.targetLine": { ko: "목표 매출", en: "Target" },

  // RevenueSimulation — Required Features
  "simulation.requiredFeatures": { ko: "필요 기능", en: "Required Features" },
  "simulation.feature": { ko: "기능", en: "Feature" },
  "simulation.effort": { ko: "공수", en: "Effort" },
  "simulation.status.ready": { ko: "준비됨", en: "Ready" },
  "simulation.status.needed": { ko: "필요", en: "Needed" },
  "simulation.status.planned": { ko: "계획됨", en: "Planned" },

  // Roadmap — Summary
  "roadmap.summary": {
    ko: "4주 단위 스프린트로 가설을 세우고, 실행하고, 데이터로 검증합니다. 각 스프린트가 매출에 어떤 영향을 주는지도 함께 보여줘요.",
    en: "Build, ship, and validate hypotheses in 4-week sprints. Each sprint shows its expected revenue impact so you can prioritize what matters.",
  },

  // Roadmap — Revenue Impact
  "roadmap.revenueImpact": { ko: "매출 기대효과", en: "Revenue Impact" },
  "roadmap.expectedMrr": { ko: "기대 MRR", en: "Expected MRR" },
  "roadmap.linkedScenario": { ko: "연동 시나리오", en: "Linked Scenario" },

  // Roadmap
  "roadmap.title": { ko: "스프린트", en: "Sprint" },
  "roadmap.current": { ko: "현재", en: "Current" },
  "roadmap.deliverable": { ko: "산출물:", en: "Deliverable:" },
  "roadmap.criteria": { ko: "판단 기준", en: "Decision Criteria" },
  "roadmap.sprint": { ko: "스프린트", en: "Sprint" },
  "roadmap.weekUnit": { ko: "주차", en: "Week" },
  "roadmap.timeline": { ko: "타임라인", en: "Timeline" },
  "roadmap.priority.high": { ko: "높음", en: "High" },
  "roadmap.priority.medium": { ko: "보통", en: "Medium" },
  "roadmap.priority.low": { ko: "낮음", en: "Low" },
  "roadmap.day": { ko: "일", en: "D" },
  "roadmap.hypothesis": { ko: "가설", en: "Hypothesis" },
  "roadmap.metric": { ko: "검증 지표", en: "Validation" },

  // Strategy (Macro Roadmap)
  "strategy.title": { ko: "로드맵", en: "Roadmap" },
  "strategy.summary": {
    ko: "12개월 성장 전략의 큰 그림입니다. 분기별로 무엇에 집중하고, 어떤 KPI를 달성해야 다음 단계로 넘어갈 수 있는지 확인하세요.",
    en: "The big picture of your 12-month growth strategy. See what to focus on each quarter and which KPIs unlock the next phase.",
  },
  "strategy.northStar": { ko: "North Star", en: "North Star" },
  "strategy.timeframe": { ko: "타임프레임", en: "Timeframe" },
  "strategy.phase": { ko: "Phase", en: "Phase" },
  "strategy.theme": { ko: "전략 테마", en: "Strategy Theme" },
  "strategy.goals": { ko: "핵심 목표", en: "Key Goals" },
  "strategy.status.active": { ko: "진행 중", en: "Active" },
  "strategy.status.upcoming": { ko: "예정", en: "Upcoming" },
  "strategy.status.completed": { ko: "완료", en: "Done" },
  "strategy.executiveSummary": { ko: "전략 요약", en: "Executive Summary" },
  "strategy.growthProjection": { ko: "성장 전망", en: "Growth Projection" },
  "strategy.mau": { ko: "MAU", en: "MAU" },
  "strategy.mrr": { ko: "MRR", en: "MRR" },
  "strategy.actual": { ko: "실적", en: "Actual" },
  "strategy.projected": { ko: "전망", en: "Projected" },
  "strategy.goalLine": { ko: "목표", en: "Goal" },
  "strategy.marketTrends": { ko: "시장 트렌드", en: "Market Trends" },
  "strategy.impact.positive": { ko: "호재", en: "Positive" },
  "strategy.impact.negative": { ko: "악재", en: "Negative" },
  "strategy.impact.neutral": { ko: "중립", en: "Neutral" },
  "strategy.relevance": { ko: "시사점", en: "Relevance" },
  "strategy.horizon": { ko: "호라이즌", en: "Horizon" },
  "strategy.rationale": { ko: "전략적 근거 (WHY)", en: "Strategic Rationale (WHY)" },
  "strategy.kpis": { ko: "KPI", en: "KPIs" },
  "strategy.kpi.metric": { ko: "지표", en: "Metric" },
  "strategy.kpi.current": { ko: "현재", en: "Current" },
  "strategy.kpi.target": { ko: "목표", en: "Target" },
  "strategy.risks": { ko: "리스크 & 대응", en: "Risks & Mitigation" },
  "strategy.risk.mitigation": { ko: "대응", en: "Mitigation" },
  "strategy.successCriteria": { ko: "성공 기준", en: "Success Criteria" },

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
    ko: "개발 환경 CLI 통합 (npx @propel/cli init)",
    en: "Dev CLI integration (npx @propel/cli init)",
  },
  "offer.modal.subscribe": { ko: "구독 시작하기", en: "Start Subscription" },
  "offer.modal.trial": {
    ko: "현재 무료 체험 중 · 만료 2026.03.29",
    en: "Free trial active · Expires 2026.03.29",
  },

  // Service Info modal
  "serviceInfo.title": { ko: "서비스 정보", en: "Service Info" },
  "serviceInfo.subscription": { ko: "구독 정보", en: "Subscription" },
  "serviceInfo.freeTrial": { ko: "무료 체험", en: "Free Trial" },
  "serviceInfo.plan.free": { ko: "Free Plan", en: "Free Plan" },
  "serviceInfo.expiresAt": { ko: "만료일", en: "Expires" },
  "serviceInfo.basicInfo": { ko: "기본 정보", en: "Basic Info" },
  "serviceInfo.name": { ko: "서비스명", en: "Service Name" },
  "serviceInfo.platform": { ko: "플랫폼", en: "Platform" },
  "serviceInfo.category": { ko: "카테고리", en: "Category" },
  "serviceInfo.region": { ko: "지역", en: "Region" },
  "serviceInfo.website": { ko: "웹사이트", en: "Website" },
  "serviceInfo.analytics": { ko: "연동된 분석 도구", en: "Connected Analytics" },
  "serviceInfo.disconnect": { ko: "연결 해제", en: "Disconnect" },
  "serviceInfo.connected": { ko: "연결됨", en: "Connected" },
  "serviceInfo.revenue": { ko: "수익 현황", en: "Revenue Status" },
  "serviceInfo.revenueModel": { ko: "수익 모델", en: "Revenue Model" },
  "serviceInfo.monthlyRevenue": { ko: "월 매출", en: "Monthly Revenue" },
  "serviceInfo.targetRevenue": { ko: "목표 매출", en: "Target Revenue" },
  "serviceInfo.measurementGrade": { ko: "측정 준비도", en: "Measurement Grade" },

  // Login
  "login.title": { ko: "Propel", en: "Propel" },
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

  // Analytics Dashboard
  "analytics.period.7d": { ko: "최근 7일", en: "Last 7 days" },
  "analytics.period.14d": { ko: "최근 14일", en: "Last 14 days" },
  "analytics.period.30d": { ko: "최근 30일", en: "Last 30 days" },

  // KPI Cards
  "analytics.kpi.dau": { ko: "DAU", en: "DAU" },
  "analytics.kpi.mau": { ko: "MAU", en: "MAU" },
  "analytics.kpi.mrr": { ko: "MRR", en: "MRR" },
  "analytics.kpi.arpu": { ko: "ARPU", en: "ARPU" },
  "analytics.kpi.stickiness": { ko: "Stickiness", en: "Stickiness" },
  "analytics.kpi.retentionD1": { ko: "D1 리텐션", en: "D1 Retention" },

  // KPI Tooltip Descriptions
  "analytics.kpi.dau.desc": { ko: "일간 활성 사용자 수 (Daily Active Users)", en: "Daily Active Users — unique users per day" },
  "analytics.kpi.mau.desc": { ko: "월간 활성 사용자 수 (Monthly Active Users)", en: "Monthly Active Users — unique users per month" },
  "analytics.kpi.mrr.desc": { ko: "월간 반복 매출 (Monthly Recurring Revenue)", en: "Monthly Recurring Revenue — total recurring revenue per month" },
  "analytics.kpi.arpu.desc": { ko: "유저당 평균 매출 (Average Revenue Per User)", en: "Average Revenue Per User — revenue divided by active users" },
  "analytics.kpi.stickiness.desc": { ko: "DAU/MAU 비율 — 유저가 얼마나 자주 재방문하는지 측정", en: "DAU/MAU ratio — measures how often users return" },
  "analytics.kpi.retentionD1.desc": { ko: "첫 방문 다음 날 재방문한 유저 비율", en: "Percentage of users who return the day after first visit" },

  // Chart Sections
  "analytics.chart.engagement": { ko: "인게이지먼트", en: "Engagement" },
  "analytics.chart.revenue": { ko: "매출", en: "Revenue" },
  "analytics.chart.unitEconomics": { ko: "유닛 이코노믹스", en: "Unit Economics" },
  "analytics.chart.retention": { ko: "리텐션", en: "Retention" },
  "analytics.chart.userHealth": { ko: "유저 헬스", en: "User Health" },
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
    const stored = localStorage.getItem("propel-language") as Language | null;
    if (stored === "ko" || stored === "en") {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("propel-language", lang);
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
