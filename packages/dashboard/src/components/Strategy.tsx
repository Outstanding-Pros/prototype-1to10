"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MilestoneIcon } from "@primer/octicons-react";
import { useTranslation, useLanguage, type TranslationKey } from "@/lib/i18n";
import { formatCurrency } from "@/lib/currency";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Kpi {
  metric: string;
  current: string;
  target: string;
}

interface Risk {
  risk: string;
  mitigation: string;
  severity: "high" | "medium" | "low";
}

interface Phase {
  quarter: string;
  theme: string;
  goals: string[];
  status: "active" | "upcoming" | "completed";
  horizon?: string;
  rationale?: string;
  kpis?: Kpi[];
  risks?: Risk[];
  successCriteria?: string;
}

interface Trend {
  trend: string;
  detail: string;
  impact: "positive" | "negative" | "neutral";
  relevance: string;
}

interface ProjectionPoint {
  month: string;
  mau: number;
  mrr: number;
  projected: boolean;
}

interface StrategyProps {
  northStar: string;
  timeframe: string;
  executiveSummary?: string;
  keyInsight?: string;
  marketContext?: { trends: Trend[] };
  projection?: ProjectionPoint[];
  phases: Phase[];
}

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const statusDot: Record<string, string> = {
  active: "bg-primary",
  upcoming: "bg-muted-foreground/30",
  completed: "bg-green-500",
};

const horizonBadge: Record<string, string> = {
  H1: "bg-primary/15 text-primary border-primary/20",
  H2: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  H3: "bg-chart-4/15 text-chart-4 border-chart-4/20",
};

const impactBadge: Record<string, string> = {
  positive: "bg-green-500/15 text-green-600 border-green-500/20",
  negative: "bg-red-500/15 text-red-600 border-red-500/20",
  neutral: "bg-amber-500/15 text-amber-600 border-amber-500/20",
};

const severityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-muted-foreground/40",
};

/* ------------------------------------------------------------------ */
/*  Projection Tooltip                                                 */
/* ------------------------------------------------------------------ */

function ProjectionTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  const { language } = useLanguage();
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="ml-auto font-medium tabular-nums">
            {entry.name === "MRR"
              ? formatCurrency(entry.value, language)
              : entry.value >= 1000
              ? `${(entry.value / 1000).toFixed(1)}K`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Strategy({
  northStar,
  timeframe,
  executiveSummary,
  keyInsight,
  marketContext,
  projection,
  phases,
}: StrategyProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState(
    () => phases.findIndex((p) => p.status === "active") ?? 0,
  );
  const selected = phases[selectedIdx];

  /* split projection into actual vs projected for dashed styling */
  const projectionData = projection?.map((p) => ({
    month: p.month,
    mau: p.projected ? undefined : p.mau,
    mrr: p.projected ? undefined : p.mrr,
    mauProj: p.mau,
    mrrProj: p.mrr,
  }));

  return (
    <section className="space-y-6">
      {/* ── Section 1: Header + Executive Summary ── */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
            <MilestoneIcon size={14} />
          </span>
          <h2 className="text-xl font-bold">{t("strategy.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">{t("strategy.summary")}</p>
      </div>

      {/* North Star banner */}
      <div className="rounded-lg bg-primary/5 ring-1 ring-primary/10 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{t("strategy.northStar")}</p>
          <p className="text-lg font-bold">{northStar}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">{t("strategy.timeframe")}</p>
          <p className="text-base font-semibold">{timeframe}</p>
        </div>
      </div>

      {/* Executive summary */}
      {(executiveSummary || keyInsight) && (
        <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {t("strategy.executiveSummary")}
          </p>
          {executiveSummary && <p className="text-sm text-foreground/80">{executiveSummary}</p>}
          {keyInsight && <p className="text-sm text-foreground/70">{keyInsight}</p>}
        </div>
      )}

      {/* ── Section 2: Growth Projection Chart ── */}
      {projectionData && projectionData.length > 0 && (
        <div className="rounded-lg border">
          <div className="px-3 py-2 border-b bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">
              {t("strategy.growthProjection")}
            </span>
          </div>
          <div className="px-2 pt-3 pb-1">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={projectionData}
                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                {/* Left Y axis — MAU */}
                <YAxis
                  yAxisId="mau"
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                  }
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                {/* Right Y axis — MRR */}
                <YAxis
                  yAxisId="mrr"
                  orientation="right"
                  tickFormatter={(v: number) => formatCurrency(v, language)}
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ProjectionTooltip />} />

                {/* MAU projected (dashed, full range) */}
                <Area
                  yAxisId="mau"
                  type="monotone"
                  dataKey="mauProj"
                  name="MAU"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.06}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
                {/* MAU actual (solid, only non-projected) */}
                <Area
                  yAxisId="mau"
                  type="monotone"
                  dataKey="mau"
                  name="MAU"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  legendType="none"
                  connectNulls={false}
                />

                {/* MRR projected (dashed, full range) */}
                <Area
                  yAxisId="mrr"
                  type="monotone"
                  dataKey="mrrProj"
                  name="MRR"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.06}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
                {/* MRR actual (solid, only non-projected) */}
                <Area
                  yAxisId="mrr"
                  type="monotone"
                  dataKey="mrr"
                  name="MRR"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  legendType="none"
                  connectNulls={false}
                />

                {/* North Star goal line — MAU 50K */}
                <ReferenceLine
                  yAxisId="mau"
                  y={50000}
                  stroke="var(--chart-4)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "MAU 50K",
                    position: "insideTopLeft",
                    fontSize: 10,
                    fill: "var(--chart-4)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pb-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-t-2 border-solid" style={{ borderColor: "var(--chart-1)" }} />
                {t("strategy.actual")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: "var(--chart-1)" }} />
                {t("strategy.projected")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: "var(--chart-4)" }} />
                {t("strategy.goalLine")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 3: Market Trends ── */}
      {marketContext?.trends && marketContext.trends.length > 0 && (
        <div className="rounded-lg border">
          <div className="px-3 py-2 border-b bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">
              {t("strategy.marketTrends")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3">
            {marketContext.trends.map((tr, i) => (
              <div
                key={i}
                className="rounded-md border p-3 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs py-0 ${impactBadge[tr.impact]}`}
                  >
                    {t(`strategy.impact.${tr.impact}` as TranslationKey)}
                  </Badge>
                  <span className="text-sm font-semibold truncate">{tr.trend}</span>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{tr.detail}</p>
                <p className="text-sm">
                  <span className="font-medium text-muted-foreground">
                    {t("strategy.relevance")}:
                  </span>{" "}
                  <span className="text-foreground/80">{tr.relevance}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 4: Phase Navigator + Detail ── */}
      {/* Navigator */}
      <div className="grid grid-cols-4 gap-2">
        {phases.map((phase, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedIdx(i)}
            className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
              i === selectedIdx
                ? "ring-1 ring-primary/30 bg-primary/5 border-primary/20"
                : "hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`size-2 rounded-full ${statusDot[phase.status]}`} />
              <span className="text-xs font-bold tabular-nums text-muted-foreground">
                {phase.quarter}
              </span>
            </div>
            <p className="text-sm font-medium truncate">{phase.theme}</p>
            {phase.horizon && (
              <Badge
                variant="outline"
                className={`text-xs py-0 mt-1.5 ${horizonBadge[phase.horizon] ?? ""}`}
              >
                {phase.horizon}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Phase Detail Card */}
      {selected && (
        <div
          className={`rounded-lg border p-4 space-y-4 transition-colors ${
            selected.status === "active"
              ? "ring-1 ring-primary/20 bg-primary/5"
              : "bg-muted/20"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${statusDot[selected.status]}`} />
            <span className="text-base font-semibold">{selected.quarter}</span>
            <span className="text-sm text-muted-foreground">{selected.theme}</span>
            {selected.horizon && (
              <Badge
                variant="outline"
                className={`text-xs py-0 ml-auto ${horizonBadge[selected.horizon] ?? ""}`}
              >
                {selected.horizon}
              </Badge>
            )}
          </div>

          {/* Rationale (WHY) */}
          {selected.rationale && (
            <div className="rounded-md bg-muted/40 px-3 py-2">
              <p className="text-sm font-medium text-muted-foreground mb-0.5">
                {t("strategy.rationale")}
              </p>
              <p className="text-sm text-foreground/80">{selected.rationale}</p>
            </div>
          )}

          {/* 2-col: Goals + KPIs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Goals */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("strategy.goals")}
              </p>
              <ul className="space-y-1">
                {selected.goals.map((goal, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-1.5 text-sm text-foreground/70"
                  >
                    <span className="mt-1.5 size-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* KPI Table */}
            {selected.kpis && selected.kpis.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("strategy.kpis")}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs h-7">{t("strategy.kpi.metric")}</TableHead>
                      <TableHead className="text-xs h-7 text-right">{t("strategy.kpi.current")}</TableHead>
                      <TableHead className="text-xs h-7 text-right">{t("strategy.kpi.target")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.kpis.map((kpi, k) => (
                      <TableRow key={k}>
                        <TableCell className="text-sm py-1.5">{kpi.metric}</TableCell>
                        <TableCell className="text-sm py-1.5 text-right tabular-nums text-muted-foreground">
                          {kpi.current}
                        </TableCell>
                        <TableCell className="text-sm py-1.5 text-right tabular-nums font-medium">
                          {kpi.target}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Risks & Mitigation */}
          {selected.risks && selected.risks.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("strategy.risks")}
              </p>
              <div className="space-y-1.5">
                {selected.risks.map((r, ri) => (
                  <div key={ri} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1.5 size-2 rounded-full flex-shrink-0 ${severityDot[r.severity]}`}
                    />
                    <div>
                      <span className="text-foreground/80">{r.risk}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="text-foreground/60">{r.mitigation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Criteria */}
          {selected.successCriteria && (
            <div className="rounded-md bg-green-500/5 border border-green-500/15 px-3 py-2">
              <p className="text-sm">
                <span className="font-medium text-green-600">
                  {t("strategy.successCriteria")}:
                </span>{" "}
                <span className="text-foreground/80">{selected.successCriteria}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
