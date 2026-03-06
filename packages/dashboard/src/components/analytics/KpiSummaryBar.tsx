"use client";

import KpiCard from "./KpiCard";
import { useTranslation, useLanguage } from "@/lib/i18n";
import { formatCurrencyCompact } from "@/lib/currency";
import type { DailyDataPoint } from "@/lib/mock-timeseries";

interface KpiSummaryBarProps {
  data: DailyDataPoint[];
}

function formatNumber(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
}

function formatPercent(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function calcChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// CSS variable-based colors for chart-1 through chart-5
const CHART_COLORS = {
  chart1: "var(--chart-1)",
  chart2: "var(--chart-2)",
  chart3: "var(--chart-3)",
  chart4: "var(--chart-4)",
  chart5: "var(--chart-5)",
  primary: "var(--primary)",
};

export default function KpiSummaryBar({ data }: KpiSummaryBarProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const fmtCurrency = (v: number) => formatCurrencyCompact(v, language);

  if (data.length < 8) return null;

  const latest = data[data.length - 1];
  const sevenDaysAgo = data[data.length - 8];

  const kpis = [
    {
      label: t("analytics.kpi.dau"),
      description: t("analytics.kpi.dau.desc"),
      value: formatNumber(latest.dau),
      change: calcChange(latest.dau, sevenDaysAgo.dau),
      sparkline: data.map((d) => d.dau),
      color: CHART_COLORS.chart1, // primary — main engagement
    },
    {
      label: t("analytics.kpi.mau"),
      description: t("analytics.kpi.mau.desc"),
      value: formatNumber(latest.mau),
      change: calcChange(latest.mau, sevenDaysAgo.mau),
      sparkline: data.map((d) => d.mau),
      color: CHART_COLORS.chart2, // secondary teal — paired with DAU
    },
    {
      label: t("analytics.kpi.mrr"),
      description: t("analytics.kpi.mrr.desc"),
      value: fmtCurrency(latest.mrr),
      change: calcChange(latest.mrr, sevenDaysAgo.mrr),
      sparkline: data.map((d) => d.mrr),
      color: CHART_COLORS.chart3, // green — revenue/growth
    },
    {
      label: t("analytics.kpi.arpu"),
      description: t("analytics.kpi.arpu.desc"),
      value: fmtCurrency(latest.arpu),
      change: calcChange(latest.arpu, sevenDaysAgo.arpu),
      sparkline: data.map((d) => d.arpu),
      color: CHART_COLORS.chart4, // amber — unit economics watchpoint
    },
    {
      label: t("analytics.kpi.stickiness"),
      description: t("analytics.kpi.stickiness.desc"),
      value: formatPercent(latest.stickiness),
      change: calcChange(latest.stickiness, sevenDaysAgo.stickiness),
      sparkline: data.map((d) => d.stickiness),
      color: CHART_COLORS.chart1, // primary — engagement quality
    },
    {
      label: t("analytics.kpi.retentionD1"),
      description: t("analytics.kpi.retentionD1.desc"),
      value: formatPercent(latest.retentionD1),
      change: calcChange(latest.retentionD1, sevenDaysAgo.retentionD1),
      sparkline: data.map((d) => d.retentionD1),
      color: CHART_COLORS.chart2, // secondary teal — paired with Stickiness
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.label}
          label={kpi.label}
          description={kpi.description}
          value={kpi.value}
          changePercent={kpi.change}
          sparklineData={kpi.sparkline}
          color={kpi.color}
        />
      ))}
    </div>
  );
}
