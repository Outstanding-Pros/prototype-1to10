"use client";

import { getCustomer } from "@/lib/customer";
import BenchmarkComparison from "@/components/BenchmarkComparison";
import { useTranslation, useLanguage } from "@/lib/i18n";

function fmtDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function BenchmarkPage() {
  const c = getCustomer();
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (!c.benchmarks?.verdict || !c.diagnosis) return null;

  const m = c.metrics;
  const b = c.benchmarks;
  const v = b.verdict;

  return (
    <BenchmarkComparison
      category={c.category}
      region={c.region}
      platform={c.platform}
      groups={[
        {
          section: "benchmark.section.engagement",
          rows: [
            {
              label: t("benchmark.row.dauMau"),
              yours: `${((m.stickiness ?? 0) * 100).toFixed(1)}%`,
              avg: "18%",
              top25: "25%",
              verdict: v.stickiness as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.bounceRate"),
              yours: `${((m.bounceRate ?? 0) * 100).toFixed(0)}%`,
              avg: "45%",
              top25: "30%",
              verdict: (v.bounceRate ?? "평균") as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.sessionDuration"),
              yours: fmtDuration(m.avgSessionDuration ?? 0),
              avg: fmtDuration(120),
              top25: fmtDuration(300),
              verdict: (v.sessionDuration ?? "평균") as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.pagesPerSession"),
              yours: `${m.pagesPerSession ?? 0}`,
              avg: "2.5",
              top25: "5.0",
              verdict: (v.pagesPerSession ?? "평균") as "하위" | "평균" | "상위",
            },
          ],
        },
        {
          section: "benchmark.section.revenue",
          rows: [
            {
              label: t("benchmark.row.ecpm"),
              yours: "₩2,200",
              avg: "₩2,600",
              top25: "₩4,500",
              verdict: v.ecpm as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.arpu"),
              yours: `₩${m.arpu}`,
              avg: "₩150",
              top25: "₩350",
              verdict: v.arpu as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.arpuAdOnly"),
              yours: `₩${m.arpu}`,
              avg: "₩55",
              top25: "₩90",
              verdict: (v.arpuAdOnly ?? v.arpu) as "하위" | "평균" | "상위",
            },
          ],
        },
        {
          section: "benchmark.section.retention",
          rows: [
            {
              label: t("benchmark.row.retentionD1"),
              yours: `${((m.retentionD1 ?? 0) * 100).toFixed(0)}%`,
              avg: "25%",
              top25: "35%",
              verdict: (v.retentionD1 ?? "평균") as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.retentionD7"),
              yours: `${((m.retentionD7 ?? 0) * 100).toFixed(0)}%`,
              avg: "10%",
              top25: "18%",
              verdict: (v.retentionD7 ?? "평균") as "하위" | "평균" | "상위",
            },
            {
              label: t("benchmark.row.churn"),
              yours: `${((m.monthlyChurn ?? 0) * 100).toFixed(0)}%`,
              avg: "10%",
              top25: "6%",
              verdict: (v.churn ?? "평균") as "하위" | "평균" | "상위",
            },
          ],
        },
      ]}
      insight={c.diagnosis.keyInsight}
      potentialRevenue="₩2,975,000"
      potentialMultiple={language === "ko" ? "약 9.3배" : "~9.3x"}
      sources={[
        { label: "traffic", name: t("benchmark.source.traffic") },
        { label: "ux", name: t("benchmark.source.ux") },
        { label: "retention", name: t("benchmark.source.retention") },
      ]}
    />
  );
}
