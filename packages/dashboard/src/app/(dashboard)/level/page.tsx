"use client";

import { getCustomer } from "@/lib/customer";
import LevelDiagnosis from "@/components/LevelDiagnosis";

export default function LevelPage() {
  const c = getCustomer();

  if (!c.diagnosis) return null;

  return (
    <LevelDiagnosis
      level={c.level}
      levelName={c.levelName}
      reason={c.diagnosis.levelReason}
      potential={c.diagnosis.potential}
      positioning={c.positioning}
    />
  );
}
