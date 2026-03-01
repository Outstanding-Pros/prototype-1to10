"use client";

import { Badge } from "@/components/ui/badge";
import { MilestoneIcon } from "@primer/octicons-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";

interface Phase {
  quarter: string;
  theme: string;
  goals: string[];
  status: "active" | "upcoming" | "completed";
}

interface StrategyProps {
  northStar: string;
  timeframe: string;
  phases: Phase[];
}

const statusStyles: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/20",
  upcoming: "bg-muted text-muted-foreground border-border",
  completed: "bg-green-500/15 text-green-600 border-green-500/20",
};

const lineStyles: Record<string, string> = {
  active: "border-primary",
  upcoming: "border-muted-foreground/20",
  completed: "border-green-500",
};

const dotStyles: Record<string, string> = {
  active: "bg-primary ring-4 ring-primary/15",
  upcoming: "bg-muted-foreground/30",
  completed: "bg-green-500",
};

export default function Strategy({ northStar, timeframe, phases }: StrategyProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
          <MilestoneIcon size={14} />
        </span>
        <h2 className="text-sm font-semibold">{t("strategy.title")}</h2>
      </div>

      {/* North Star & Timeframe */}
      <div className="rounded-lg bg-primary/5 ring-1 ring-primary/10 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{t("strategy.northStar")}</p>
          <p className="text-lg font-bold">{northStar}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">{t("strategy.timeframe")}</p>
          <p className="text-sm font-semibold">{timeframe}</p>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="space-y-0">
        {phases.map((phase, i) => {
          const isLast = i === phases.length - 1;

          return (
            <div key={i} className="flex gap-4">
              {/* Timeline rail */}
              <div className="flex flex-col items-center w-3 flex-shrink-0">
                <span className={`size-3 rounded-full ${dotStyles[phase.status]}`} />
                {!isLast && (
                  <div className={`flex-1 w-px border-l-2 ${lineStyles[phase.status]} my-1`} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold tabular-nums text-muted-foreground">
                    {phase.quarter}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs py-0 ${statusStyles[phase.status]}`}
                  >
                    {t(`strategy.status.${phase.status}` as TranslationKey)}
                  </Badge>
                </div>
                <p className="text-sm font-semibold mb-2">{phase.theme}</p>
                <ul className="space-y-1">
                  {phase.goals.map((goal, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs text-foreground/70">
                      <span className="mt-1.5 size-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
