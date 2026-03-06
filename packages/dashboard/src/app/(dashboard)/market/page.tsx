"use client";

import { getCustomer } from "@/lib/customer";
import LevelDiagnosis from "@/components/LevelDiagnosis";
import { useLanguage } from "@/lib/i18n";

export default function LevelPage() {
  const { language } = useLanguage();
  const c = getCustomer(undefined, language);

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
