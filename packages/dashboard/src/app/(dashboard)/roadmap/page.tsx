"use client";

import { getCustomer } from "@/lib/customer";
import Strategy from "@/components/Strategy";
import { useLanguage } from "@/lib/i18n";

export default function StrategyPage() {
  const { language } = useLanguage();
  const c = getCustomer(undefined, language);

  if (!c.strategy) return null;

  const s = c.strategy;

  return (
    <Strategy
      northStar={s.northStar}
      timeframe={s.timeframe}
      executiveSummary={s.executiveSummary}
      keyInsight={s.keyInsight}
      marketContext={s.marketContext as { trends: { trend: string; detail: string; impact: "positive" | "negative" | "neutral"; relevance: string }[] }}
      projection={s.projection as { month: string; mau: number; mrr: number; projected: boolean }[]}
      phases={
        s.phases as {
          quarter: string;
          theme: string;
          goals: string[];
          status: "active" | "upcoming" | "completed";
          horizon?: string;
          rationale?: string;
          kpis?: { metric: string; current: string; target: string }[];
          risks?: { risk: string; mitigation: string; severity: "high" | "medium" | "low" }[];
          successCriteria?: string;
        }[]
      }
    />
  );
}
