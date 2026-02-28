"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n";

interface LevelDiagnosisProps {
  level: number;
  levelName: string;
  reason: string;
  potential: string;
}

export default function LevelDiagnosis({
  level,
  levelName,
  reason,
  potential,
}: LevelDiagnosisProps) {
  const { t } = useTranslation();

  const levels = [
    { level: 1, name: t("level.1.name"), task: t("level.1.task") },
    { level: 2, name: t("level.2.name"), task: t("level.2.task") },
    { level: 3, name: t("level.3.name"), task: t("level.3.task") },
    { level: 4, name: t("level.4.name"), task: t("level.4.task") },
    { level: 5, name: t("level.5.name"), task: t("level.5.task") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center text-xs">💊</span>
          {t("level.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Level display */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight">Level {level}</span>
          <span className="text-muted-foreground">/5</span>
          <Badge variant="secondary" className="ml-1">{levelName}</Badge>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <Progress value={(level / 5) * 100} className="h-1.5" />
          <div className="grid grid-cols-5 gap-1">
            {levels.map((l) => (
              <div key={l.level} className="text-center">
                <span
                  className={`inline-block size-2 rounded-full mb-1 ${
                    l.level <= level ? "bg-primary" : "bg-muted"
                  }`}
                />
                <p className={`text-xs leading-tight ${
                  l.level === level
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}>
                  {l.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm">
          <DetailRow label={t("level.basis")} value={reason} />
          <DetailRow
            label={t("level.keyTask")}
            value={levels.find((l) => l.level === level)?.task ?? ""}
            bold
          />
          <DetailRow label={t("level.potential")} value={potential} accent />
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-muted-foreground text-xs min-w-[60px] pt-0.5">{label}</span>
      <span className={`text-sm ${bold ? "font-semibold" : ""} ${accent ? "text-green-600 font-medium" : ""}`}>
        {value}
      </span>
    </div>
  );
}
