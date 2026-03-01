"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PulseIcon } from "@primer/octicons-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";

interface Competitor {
  name: string;
  model: string;
  scale: string;
  differentiator: string;
}

interface MapPoint {
  name: string;
  x: number;
  y: number;
  isSelf?: boolean;
}

interface PositioningMapData {
  xAxis: string;
  yAxis: string;
  points: MapPoint[];
  target?: { x: number; y: number };
}

interface Positioning {
  tam: string;
  tamLabel: string;
  sam: string;
  samLabel: string;
  targetSegment: string;
  marketStage: string;
  positionStatement: string;
  map?: PositioningMapData;
  competitors: Competitor[];
  moats: string[];
  vulnerabilities: string[];
}

interface LevelDiagnosisProps {
  level: number;
  levelName: string;
  reason: string;
  potential: string;
  positioning?: Positioning;
}

const stageColors: Record<string, string> = {
  emerging: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  growing: "bg-green-500/15 text-green-600 border-green-500/20",
  mature: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  declining: "bg-red-500/15 text-red-600 border-red-500/20",
};

export default function LevelDiagnosis({
  level,
  levelName,
  reason,
  potential,
  positioning,
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
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
          <PulseIcon size={14} />
        </span>
        <h2 className="text-sm font-semibold">{t("level.title")}</h2>
      </div>

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

      <div className="border-b" />

      {/* Details */}
      <div className="space-y-2.5 text-sm">
        <DetailRow label={t("level.assessment")} value={reason} />
        <DetailRow
          label={t("level.keyObjective")}
          value={levels.find((l) => l.level === level)?.task ?? ""}
          bold
        />
        <DetailRow label={t("level.growthPotential")} value={potential} accent />
      </div>

      {/* Market Positioning */}
      {positioning && (
        <>
          <div className="border-b" />

          <div className="rounded-lg border overflow-hidden">
            <div className="px-3 py-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">{t("level.positioning")}</span>
            </div>
            <div className="p-4 space-y-4">
              {/* Position statement */}
              <p className="text-sm font-medium text-foreground/90">
                {positioning.positionStatement}
              </p>

              {/* TAM / SAM / Segment / Stage */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{t("level.positioning.tam")}</p>
                  <p className="text-lg font-bold tabular-nums">{positioning.tam}</p>
                  <p className="text-xs text-muted-foreground">{positioning.tamLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{t("level.positioning.sam")}</p>
                  <p className="text-lg font-bold tabular-nums">{positioning.sam}</p>
                  <p className="text-xs text-muted-foreground">{positioning.samLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{t("level.positioning.segment")}</p>
                  <p className="text-sm font-medium">{positioning.targetSegment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{t("level.positioning.stage")}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${stageColors[positioning.marketStage] ?? ""}`}
                  >
                    {t(`level.positioning.stage.${positioning.marketStage}` as TranslationKey)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Positioning Map */}
          {positioning.map && (
            <PositioningMap data={positioning.map} selfName={positioning.map.points.find(p => p.isSelf)?.name ?? ""} />
          )}

          {/* Competitive Landscape */}
          <div className="rounded-lg border overflow-hidden">
            <div className="px-3 py-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">{t("level.competitive")}</span>
            </div>

            {/* Competitor table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{t("level.competitive.service")}</TableHead>
                  <TableHead className="text-xs">{t("level.competitive.model")}</TableHead>
                  <TableHead className="text-xs">{t("level.competitive.scale")}</TableHead>
                  <TableHead className="text-xs">{t("level.competitive.diff")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positioning.competitors.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{c.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.model}</TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">{c.scale}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.differentiator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Moats & Vulnerabilities */}
            <div className="p-4 border-t grid grid-cols-2 gap-4">
              {/* Moats */}
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">{t("level.moats")}</p>
                <ul className="space-y-1.5">
                  {positioning.moats.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                      <span className="mt-1 size-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Vulnerabilities */}
              <div>
                <p className="text-xs font-medium text-destructive mb-2">{t("level.vulnerabilities")}</p>
                <ul className="space-y-1.5">
                  {positioning.vulnerabilities.map((v, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                      <span className="mt-1 size-1.5 rounded-full bg-destructive flex-shrink-0" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function PositioningMap({ data, selfName }: { data: PositioningMapData; selfName: string }) {
  const { t } = useTranslation();

  const selfPoint = data.points.find((p) => p.isSelf);

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="px-3 py-2 border-b bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground">{t("level.positioning.map")}</span>
      </div>
      <div className="p-4">
        {/* Chart area */}
        <div className="relative ml-8 mb-6">
          {/* Y-axis label */}
          <div className="absolute -left-8 top-0 bottom-0 flex items-center">
            <span
              className="text-xs text-muted-foreground whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {data.yAxis}
            </span>
          </div>

          {/* Grid container */}
          <div className="relative border-l border-b border-muted-foreground/20" style={{ height: 240 }}>
            {/* Quadrant lines */}
            <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-muted-foreground/15" />
            <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-muted-foreground/15" />

            {/* Arrow from self to target */}
            {selfPoint && data.target && (
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ width: "100%", height: "100%" }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 8 3, 0 6"
                      className="fill-primary/50"
                    />
                  </marker>
                </defs>
                <line
                  x1={`${selfPoint.x}%`}
                  y1={`${100 - selfPoint.y}%`}
                  x2={`${data.target.x}%`}
                  y2={`${100 - data.target.y}%`}
                  className="stroke-primary/40"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            )}

            {/* Target dot */}
            {data.target && (
              <div
                className="absolute size-5 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center"
                style={{
                  left: `calc(${data.target.x}% - 10px)`,
                  bottom: `calc(${data.target.y}% - 10px)`,
                }}
              >
                <span className="size-1.5 rounded-full bg-primary/40" />
              </div>
            )}

            {/* Points */}
            {data.points.map((point, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `calc(${point.x}% - 4px)`,
                  bottom: `calc(${point.y}% - 4px)`,
                }}
              >
                <span
                  className={`size-2.5 rounded-full ${
                    point.isSelf
                      ? "bg-primary ring-[3px] ring-primary/20"
                      : "bg-muted-foreground/50"
                  }`}
                />
                <span
                  className={`text-xs mt-1 whitespace-nowrap ${
                    point.isSelf ? "font-semibold text-primary" : "text-muted-foreground"
                  }`}
                >
                  {point.name}
                </span>
              </div>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center mt-2">
            <span className="text-xs text-muted-foreground">{data.xAxis}</span>
          </div>
        </div>

        {/* Legend */}
        {data.target && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary ring-2 ring-primary/20" />
              {selfName}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <span className="size-1 rounded-full bg-primary/40" />
              </span>
              {t("level.positioning.map.target")}
            </span>
          </div>
        )}
      </div>
    </div>
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
