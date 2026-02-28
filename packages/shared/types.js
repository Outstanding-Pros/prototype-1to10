/**
 * @typedef {'A' | 'B' | 'C'} MeasurementGrade
 * A: 완전 설정 (GA + 수익 추적 완비)
 * B: 부분 설정 (일부만 있음)
 * C: 미설정 (측정 인프라 없음)
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5} MonetizationLevel
 * 1: 수익 모델 없음
 * 2: 광고 단일 의존
 * 3: 복합 수익 초기
 * 4: 수익 구조 안정
 * 5: 스케일 준비
 */

/**
 * @typedef {Object} AppProfile
 * @property {string} name
 * @property {string} platform
 * @property {string} category
 * @property {string} categorySub
 * @property {number} dau
 * @property {number} mau
 * @property {number} stickiness
 * @property {string[]} currentModels
 * @property {number} monthlyRevenue
 * @property {number} ecpm
 * @property {number} arpu
 * @property {number} targetRevenue
 * @property {number} revenueGap
 * @property {string} primaryConcern
 * @property {MeasurementGrade} measurementGrade
 * @property {MonetizationLevel} level
 */

export {};
