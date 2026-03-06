"use client";

import { getCustomer } from "@/lib/customer";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import MeasurementSetup from "@/components/MeasurementSetup";
import { useLanguage } from "@/lib/i18n";

export default function ProfilePage() {
  const { language } = useLanguage();
  const c = getCustomer(undefined, language);

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

      <AnalyticsDashboard customer={c} />
    </div>
  );
}
