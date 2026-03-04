"use client";

import { Badge } from "@/components/ui/badge";
import { ToolsIcon } from "@primer/octicons-react";
import { useTranslation } from "@/lib/i18n";

interface SetupItem {
  item: string;
  guide: string;
  time: string;
}

interface MeasurementSetupProps {
  grade: "A" | "B" | "C";
  gaps: SetupItem[];
}

export default function MeasurementSetup({ grade, gaps }: MeasurementSetupProps) {
  const { t } = useTranslation();

  if (grade === "A") return null;

  const gradeInfo = {
    A: { label: t("measurement.fullSetup"), variant: "default" as const, message: "" },
    B: {
      label: t("measurement.partialSetup"),
      variant: "secondary" as const,
      message: t("measurement.partialMsg"),
    },
    C: {
      label: t("measurement.notSetup"),
      variant: "destructive" as const,
      message: t("measurement.notSetupMsg"),
    },
  };

  const info = gradeInfo[grade];

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
          <ToolsIcon size={14} />
        </span>
        <h2 className="text-base font-semibold">{t("measurement.title")}</h2>
        <Badge variant={info.variant} className="ml-1 text-xs">
          Grade {grade} · {info.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">{info.message}</p>

      {/* Gap items */}
      <div className="space-y-2">
        {gaps.map((g, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
          >
            <span className="size-4 rounded-full ring-2 ring-destructive/30 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{g.item}</p>
              <p className="text-sm text-muted-foreground truncate">{g.guide}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">~{g.time}</span>
          </div>
        ))}
      </div>

      {grade === "C" && (
        <>
          <div className="border-b" />
          <div className="rounded-lg bg-amber-500/5 p-4 ring-1 ring-amber-500/10">
            <p className="text-sm font-semibold text-amber-700 mb-2">{t("measurement.timeline")}</p>
            <div className="space-y-1.5 text-sm text-amber-800/80">
              <p><strong>Day 1~3</strong> — {t("measurement.day1_3")}</p>
              <p><strong>Day 4~10</strong> — {t("measurement.day4_10")}</p>
              <p><strong>Day 11~14</strong> — {t("measurement.day11_14")}</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
