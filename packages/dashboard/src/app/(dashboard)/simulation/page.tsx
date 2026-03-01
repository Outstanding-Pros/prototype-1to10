"use client";

import { getCustomer } from "@/lib/customer";
import RevenueSimulation from "@/components/RevenueSimulation";

export default function SimulationPage() {
  const c = getCustomer();

  if (!c.simulation || !c.recommendation) return null;

  return (
    <RevenueSimulation
      recommendedModel={c.recommendation.primaryModel}
      recommendedReason={c.recommendation.reason}
      price={c.simulation.price}
      bundleItems={c.recommendation.bundleItems ?? []}
      scenarios={c.simulation.scenarios}
      targetRevenue={c.goals.targetRevenue}
      mau={c.metrics.mau ?? 0}
    />
  );
}
