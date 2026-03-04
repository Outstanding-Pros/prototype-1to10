"use client";

import MetricChart from "./MetricChart";
import { useTranslation } from "@/lib/i18n";
import type { DailyDataPoint } from "@/lib/mock-timeseries";

interface TimeSeriesSectionProps {
  data: DailyDataPoint[];
}

function formatCurrency(v: number) {
  if (v >= 1_000_000) return `₩${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₩${(v / 1_000).toFixed(0)}K`;
  return `₩${v}`;
}

function formatPercent(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function formatNumber(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
}

export default function TimeSeriesSection({ data }: TimeSeriesSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Engagement — Full width area chart */}
      <ChartPanel title={t("analytics.chart.engagement")}>
        <MetricChart
          data={data}
          type="area"
          lines={[
            { key: "dau", label: "DAU", color: "var(--chart-1)" }, // primary
            { key: "mau", label: "MAU", color: "var(--chart-2)" }, // secondary teal
          ]}
          formatValue={formatNumber}
          height={260}
        />
      </ChartPanel>

      {/* Revenue + Unit Economics — 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        <ChartPanel title={t("analytics.chart.revenue")}>
          <MetricChart
            data={data}
            lines={[
              { key: "mrr", label: "MRR", color: "var(--chart-3)" }, // green — revenue/growth
            ]}
            formatValue={formatCurrency}
          />
        </ChartPanel>

        <ChartPanel title={t("analytics.chart.unitEconomics")}>
          <MetricChart
            data={data}
            lines={[
              { key: "arpu", label: "ARPU", color: "var(--chart-1)" }, // primary
              { key: "ecpm", label: "eCPM", color: "var(--chart-2)" }, // secondary teal
            ]}
            formatValue={formatCurrency}
          />
        </ChartPanel>
      </div>

      {/* Retention + User Health — 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        <ChartPanel title={t("analytics.chart.retention")}>
          <MetricChart
            data={data}
            lines={[
              { key: "retentionD1", label: "D1", color: "var(--chart-1)" }, // primary
              { key: "retentionD7", label: "D7", color: "var(--chart-2)" }, // secondary teal
            ]}
            formatValue={formatPercent}
          />
        </ChartPanel>

        <ChartPanel title={t("analytics.chart.userHealth")}>
          <MetricChart
            data={data}
            lines={[
              { key: "stickiness", label: "Stickiness", color: "var(--chart-3)" }, // green — positive health
              { key: "churn", label: "Churn", color: "var(--chart-5)" }, // red — negative/decline
            ]}
            formatValue={formatPercent}
          />
        </ChartPanel>
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
