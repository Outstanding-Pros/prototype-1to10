"use client";

import { getCustomer } from "@/lib/customer";
import Strategy from "@/components/Strategy";

export default function StrategyPage() {
  const c = getCustomer();

  if (!c.strategy) return null;

  return (
    <Strategy
      northStar={c.strategy.northStar}
      timeframe={c.strategy.timeframe}
      phases={c.strategy.phases as { quarter: string; theme: string; goals: string[]; status: "active" | "upcoming" | "completed" }[]}
    />
  );
}
