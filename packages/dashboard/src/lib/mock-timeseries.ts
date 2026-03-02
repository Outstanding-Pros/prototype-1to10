import type { Customer } from "./customer";

export interface DailyDataPoint {
  date: string; // YYYY-MM-DD
  dau: number;
  mau: number;
  mrr: number;
  arpu: number;
  ecpm: number;
  stickiness: number;
  retentionD1: number;
  retentionD7: number;
  churn: number;
}

// Seeded PRNG (mulberry32)
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Generate deterministic daily timeseries data for the last `days` days,
 * anchored to the customer's current snapshot metrics.
 */
export function generateTimeSeries(
  customer: Customer,
  days: number = 30,
): DailyDataPoint[] {
  const m = customer.metrics;
  const rng = createRng(hashString(customer.id));

  const result: DailyDataPoint[] = [];
  const today = new Date();

  // Target (final day) values — these are the current snapshot
  const targets = {
    dau: m.dau,
    mau: m.mau,
    mrr: m.monthlyRevenue,
    arpu: m.arpu ?? 0,
    ecpm: m.ecpm ?? 0,
    stickiness: m.stickiness,
    retentionD1: m.retentionD1,
    retentionD7: m.retentionD7,
    churn: m.monthlyChurn,
  };

  // Starting points: slightly lower for growth metrics, slight variation for stable ones
  const start = {
    dau: targets.dau * (0.82 + rng() * 0.06),
    mau: targets.mau * (0.85 + rng() * 0.05),
    mrr: targets.mrr * (0.78 + rng() * 0.08),
    arpu: targets.arpu * (0.88 + rng() * 0.06),
    ecpm: targets.ecpm * (0.85 + rng() * 0.08),
    stickiness: targets.stickiness * (0.92 + rng() * 0.04),
    retentionD1: targets.retentionD1 * (0.94 + rng() * 0.03),
    retentionD7: targets.retentionD7 * (0.93 + rng() * 0.04),
    churn: targets.churn * (1.05 + rng() * 0.08), // churn starts higher
  };

  for (let i = 0; i < days; i++) {
    const t = i / (days - 1); // 0 → 1 interpolation
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().slice(0, 10);

    // Linear interpolation + random noise
    const noise = () => (rng() - 0.5) * 2; // -1 to 1

    const dau = Math.round(
      clamp(lerp(start.dau, targets.dau, t) + noise() * targets.dau * 0.08, 0, Infinity),
    );
    const mau = Math.round(
      clamp(lerp(start.mau, targets.mau, t) + noise() * targets.mau * 0.03, dau, Infinity),
    );
    const mrr = Math.round(
      clamp(lerp(start.mrr, targets.mrr, t) + noise() * targets.mrr * 0.06, 0, Infinity),
    );
    const arpu = Math.round(
      clamp(lerp(start.arpu, targets.arpu, t) + noise() * targets.arpu * 0.1, 0, Infinity),
    );
    const ecpm = Math.round(
      clamp(lerp(start.ecpm, targets.ecpm, t) + noise() * targets.ecpm * 0.12, 0, Infinity),
    );
    const stickiness = Number(
      clamp(lerp(start.stickiness, targets.stickiness, t) + noise() * 0.015, 0.01, 1).toFixed(3),
    );
    const retentionD1 = Number(
      clamp(lerp(start.retentionD1, targets.retentionD1, t) + noise() * 0.02, 0.01, 1).toFixed(3),
    );
    const retentionD7 = Number(
      clamp(lerp(start.retentionD7, targets.retentionD7, t) + noise() * 0.015, 0.01, 1).toFixed(3),
    );
    const churn = Number(
      clamp(lerp(start.churn, targets.churn, t) + noise() * 0.008, 0.01, 1).toFixed(3),
    );

    result.push({
      date: dateStr,
      dau,
      mau,
      mrr,
      arpu,
      ecpm,
      stickiness,
      retentionD1,
      retentionD7,
      churn,
    });
  }

  return result;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}
