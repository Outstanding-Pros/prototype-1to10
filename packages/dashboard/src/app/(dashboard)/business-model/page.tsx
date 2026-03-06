"use client";

import { getCustomer } from "@/lib/customer";
import RevenueSimulation, { type RevenueSimulationProps } from "@/components/RevenueSimulation";
import { useLanguage } from "@/lib/i18n";

export default function SimulationPage() {
  const { language } = useLanguage();
  const c = getCustomer(undefined, language);

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
      costStructure={c.simulation.costStructure as RevenueSimulationProps["costStructure"]}
      conversionRationale={c.simulation.conversionRationale as RevenueSimulationProps["conversionRationale"]}
      requiredFeatures={c.simulation.requiredFeatures as RevenueSimulationProps["requiredFeatures"]}
    />
  );
}
