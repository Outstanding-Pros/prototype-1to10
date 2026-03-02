"use client";

import { getCustomer } from "@/lib/customer";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import MeasurementSetup from "@/components/MeasurementSetup";

export default function ProfilePage() {
  const c = getCustomer();

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
