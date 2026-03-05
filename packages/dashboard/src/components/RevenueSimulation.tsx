"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ZapIcon } from "@primer/octicons-react";
import { useTranslation, useLanguage } from "@/lib/i18n";
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

interface Scenario {
  label: string;
  conversionRate: number;
  subscribers: number;
  subscriptionRevenue: number;
  adRevenue: number;
  total: number;
}

interface FixedCost {
  item: string;
  monthlyCost: number;
}

interface CashflowEntry {
  month: string;
  revenue: number;
  cost: number;
  net: number;
}

interface CostStructure {
  fixedCosts: FixedCost[];
  variableCostPerUser: number;
  cashflow: CashflowEntry[];
}

interface ConversionFactor {
  factor: string;
  effect: "positive" | "negative";
  detail: string;
}

interface ConversionRationale {
  benchmarkSource: string;
  factors: ConversionFactor[];
}

interface RequiredFeature {
  feature: string;
  priority: "high" | "medium" | "low";
  effort: string;
  status: "ready" | "needed" | "planned";
}

export interface RevenueSimulationProps {
  recommendedModel: string;
  recommendedReason: string;
  price: number;
  bundleItems: string[];
  scenarios: Scenario[];
  targetRevenue: number;
  mau: number;
  costStructure?: CostStructure;
  conversionRationale?: ConversionRationale;
  requiredFeatures?: RequiredFeature[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function won(n: number) {
  return `₩${n.toLocaleString("ko-KR")}`;
}

const priorityBadgeVariant: Record<RequiredFeature["priority"], string> = {
  high: "bg-primary/15 text-primary border-primary/20",
  medium: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusDot: Record<RequiredFeature["status"], string> = {
  ready: "bg-green-500",
  needed: "bg-red-500",
  planned: "bg-amber-500",
};

/* ------------------------------------------------------------------ */
/*  Cashflow chart tooltip                                             */
/* ------------------------------------------------------------------ */

function CashflowTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey?: string; name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm text-xs space-y-0.5">
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="tabular-nums font-medium">{won(p.value as number)}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RevenueSimulation({
  recommendedModel,
  recommendedReason,
  price,
  bundleItems,
  scenarios,
  targetRevenue,
  mau,
  costStructure,
  conversionRationale,
  requiredFeatures,
}: RevenueSimulationProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const priorityLabel: Record<RequiredFeature["priority"], string> = {
    high: t("roadmap.priority.high"),
    medium: t("roadmap.priority.medium"),
    low: t("roadmap.priority.low"),
  };

  const statusLabel: Record<RequiredFeature["status"], string> = {
    ready: t("simulation.status.ready"),
    needed: t("simulation.status.needed"),
    planned: t("simulation.status.planned"),
  };

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
            <ZapIcon size={14} />
          </span>
          <h2 className="text-xl font-bold">{t("simulation.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">{t("simulation.summary")}</p>
      </div>

      {/* Recommendation */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{t("simulation.recommendedModel")}</p>
          <p className="font-semibold text-sm">{recommendedModel}</p>
          <p className="text-xs text-muted-foreground">{recommendedReason}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">{t("simulation.pricePoint")}</p>
          <p className="text-2xl font-black tracking-tight">
            {won(price)}
            <span className="text-xs font-normal text-muted-foreground">{t("simulation.perMonth")}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {bundleItems.map((item, i) => (
          <Badge key={i} variant="outline" className="text-xs font-normal">
            {item}
          </Badge>
        ))}
      </div>

      <div className="border-b" />

      {/* Scenarios */}
      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((s, i) => {
          const meets = s.total >= targetRevenue;
          const isMiddle = i === 1;
          return (
            <div
              key={i}
              className={`rounded-lg p-3.5 ${
                isMiddle
                  ? "ring-1 ring-primary/20 bg-primary/5"
                  : "bg-muted/50"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-2">
                {s.label}
                {isMiddle && (
                  <Badge variant="secondary" className="ml-1 text-xs py-0">{t("simulation.default")}</Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("simulation.cvr")} {(s.conversionRate * 100).toFixed(1)}% · {s.subscribers}{t("simulation.subscribers")}
              </p>

              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("simulation.subscription")}</span>
                  <span className="tabular-nums font-medium">{won(s.subscriptionRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("simulation.adRevenue")}</span>
                  <span className="tabular-nums text-muted-foreground">{won(s.adRevenue)}</span>
                </div>
                <div className="border-b" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{t("simulation.total")}</span>
                  <span className="text-base font-bold tabular-nums">{won(s.total)}</span>
                </div>
              </div>

              <div className="mt-2">
                {meets ? (
                  <Badge className="text-xs bg-green-600/10 text-green-600 border-green-600/20" variant="outline">
                    {t("simulation.goalMet")}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">{t("simulation.goalNotMet")}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Conversion Rationale (replaces old Formula section) ── */}
      {conversionRationale && (
        <div className="rounded-lg bg-muted/50 p-3.5 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {t("simulation.conversionRationale")}
          </p>

          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{t("simulation.benchmarkSource")}</p>
            <p className="text-sm text-foreground/80">{conversionRationale.benchmarkSource}</p>
          </div>

          <div className="space-y-2">
            {conversionRationale.factors.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className={`mt-1 size-2 shrink-0 rounded-full ${
                    f.effect === "positive" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground/90">{f.factor}</p>
                  <p className="text-xs text-muted-foreground">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {t("simulation.disclaimer")}
          </p>
        </div>
      )}

      {/* ── Cost Structure & Cashflow ── */}
      {costStructure && (
        <div className="rounded-lg border">
          <div className="px-3 py-2 border-b bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">
              {t("simulation.costStructure")}
            </span>
          </div>

          <div className="p-3.5 space-y-4">
            {/* Fixed costs table */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("simulation.fixedCost")}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs h-8">
                      {language === "ko" ? "항목" : "Item"}
                    </TableHead>
                    <TableHead className="text-xs text-right h-8">
                      {language === "ko" ? "월 비용" : "Monthly"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costStructure.fixedCosts.map((fc, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm py-1.5">{fc.item}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums py-1.5">
                        {won(fc.monthlyCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="text-sm font-medium py-1.5">
                      {language === "ko" ? "합계" : "Total"}
                    </TableCell>
                    <TableCell className="text-sm text-right tabular-nums font-medium py-1.5">
                      {won(costStructure.fixedCosts.reduce((s, c) => s + c.monthlyCost, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Variable cost per user */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("simulation.variableCost")}</span>
              <span className="tabular-nums font-medium">{won(costStructure.variableCostPerUser)}</span>
            </div>

            <div className="border-b" />

            {/* Cashflow chart */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("simulation.cashflow")}
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={costStructure.cashflow}
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
                  <YAxis
                    tickFormatter={(v: number) =>
                      v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`
                    }
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CashflowTooltip />} />

                  {/* Break-even line (net = 0) */}
                  <ReferenceLine
                    y={0}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={{
                      value: t("simulation.breakeven"),
                      position: "insideTopLeft",
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                  />

                  {/* Target revenue line */}
                  <ReferenceLine
                    y={targetRevenue}
                    stroke="var(--chart-2)"
                    strokeDasharray="6 3"
                    strokeWidth={1.5}
                    label={{
                      value: `${t("simulation.targetLine")} ${won(targetRevenue)}`,
                      position: "insideTopLeft",
                      fontSize: 10,
                      fill: "var(--chart-2)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name={t("simulation.revenue")}
                    stroke="var(--chart-3)"
                    fill="var(--chart-3)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    name={t("simulation.cost")}
                    stroke="var(--destructive)"
                    fill="var(--destructive)"
                    fillOpacity={0.08}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    name={t("simulation.net")}
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 rounded" style={{ background: "var(--chart-3)" }} />
                  {t("simulation.revenue")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 rounded" style={{ background: "var(--destructive)" }} />
                  {t("simulation.cost")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 rounded" style={{ background: "var(--chart-1)" }} />
                  {t("simulation.net")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 rounded border-t border-dashed" style={{ borderColor: "var(--muted-foreground)" }} />
                  {t("simulation.breakeven")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 rounded border-t border-dashed" style={{ borderColor: "var(--chart-2)" }} />
                  {t("simulation.targetLine")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Required Features ── */}
      {requiredFeatures && requiredFeatures.length > 0 && (
        <div className="rounded-lg border">
          <div className="px-3 py-2 border-b bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">
              {t("simulation.requiredFeatures")}
            </span>
          </div>

          <div className="p-3.5 space-y-2">
            {requiredFeatures.map((rf, i) => (
              <div key={i} className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ${priorityBadgeVariant[rf.priority]}`}
                >
                  {priorityLabel[rf.priority]}
                </Badge>
                <span className={`size-2 shrink-0 rounded-full ${statusDot[rf.status]}`} />
                <span className="text-sm text-foreground/90 flex-1">{rf.feature}</span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {rf.effort}
                </span>
              </div>
            ))}

            {/* Status legend */}
            <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
              {(["ready", "needed", "planned"] as const).map((s) => (
                <span key={s} className="flex items-center gap-1">
                  <span className={`size-2 rounded-full ${statusDot[s]}`} />
                  {statusLabel[s]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
