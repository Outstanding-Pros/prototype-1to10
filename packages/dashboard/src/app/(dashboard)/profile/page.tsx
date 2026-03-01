"use client";

import { getCustomer } from "@/lib/customer";
import AppProfile from "@/components/AppProfile";
import MeasurementSetup from "@/components/MeasurementSetup";
import { useTranslation } from "@/lib/i18n";

export default function ProfilePage() {
  const c = getCustomer();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {c.measurementGrade !== "A" && c.measurementGaps && (
        <>
          <MeasurementSetup
            grade={c.measurementGrade as "B" | "C"}
            gaps={c.measurementGaps}
          />
          <div className="border-b" />
        </>
      )}

      <AppProfile
        name={c.name}
        category={c.category}
        categorySub={c.categorySub}
        platform={c.platform}
        dau={c.metrics.dau}
        mau={c.metrics.mau}
        stickiness={c.metrics.stickiness}
        currentModels={c.metrics.currentModels}
        monthlyRevenue={c.metrics.monthlyRevenue}
        ecpm={c.metrics.ecpm}
        arpu={c.metrics.arpu}
        targetRevenue={c.goals.targetRevenue}
        revenueGap={c.goals.revenueGap}
        stickinessVerdict={
          c.benchmarks?.verdict
            ? c.benchmarks.verdict.stickiness +
              ` ${t("benchmark.stickinessLevel")}`
            : undefined
        }
        stickinessRange={c.benchmarks?.stickiness}
        arpuRange={c.benchmarks?.arpuAdOnly}
      />
    </div>
  );
}
