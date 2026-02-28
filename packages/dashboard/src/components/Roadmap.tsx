"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";

interface Week {
  week: number;
  theme: string;
  tasks: string[];
  hours: string;
  deliverable: string;
  goNoGo?: {
    go: string;
    adjust: string;
    redesign: string;
  };
}

interface RoadmapProps {
  currentWeek: number;
  weeks: Week[];
}

export default function Roadmap({ currentWeek, weeks }: RoadmapProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center text-xs">📋</span>
          {t("roadmap.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {weeks.map((w, i) => {
          const isCurrent = w.week === currentWeek;
          const isPast = w.week < currentWeek;
          return (
            <div key={w.week}>
              <div
                className={`rounded-lg p-4 transition-colors ${
                  isCurrent
                    ? "ring-1 ring-primary/20 bg-primary/5"
                    : isPast
                    ? "opacity-50"
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <Badge className="text-xs py-0">{t("roadmap.current")}</Badge>
                    )}
                    <span className="text-sm font-semibold">Week {w.week}</span>
                    <span className="text-xs text-muted-foreground">{w.theme}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{w.hours}</span>
                </div>

                <ul className="space-y-1.5 mb-3">
                  {w.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 size-3.5 rounded border border-border flex-shrink-0" />
                      <span className="text-foreground/80">{task}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{t("roadmap.deliverable")}</span>
                  <Badge variant="outline" className="text-xs font-normal">
                    {w.deliverable}
                  </Badge>
                </div>

                {w.goNoGo && (
                  <>
                    <Separator className="my-3" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">{t("roadmap.criteria")}</p>
                      <p className="text-xs text-green-600">✓ {w.goNoGo.go}</p>
                      <p className="text-xs text-yellow-600">↻ {w.goNoGo.adjust}</p>
                      <p className="text-xs text-destructive">✕ {w.goNoGo.redesign}</p>
                    </div>
                  </>
                )}
              </div>
              {i < weeks.length - 1 && <Separator className="my-1" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
