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
import { GraphIcon } from "@primer/octicons-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";
import type { ReactNode } from "react";

interface BenchmarkRow {
  label: string;
  yours: string;
  avg: string;
  top25: string;
  verdict: "하위" | "평균" | "상위";
}

interface BenchmarkGroup {
  section: TranslationKey;
  rows: BenchmarkRow[];
}

interface BenchmarkComparisonProps {
  category: string;
  region: string;
  platform: string;
  groups: BenchmarkGroup[];
  insight: string;
  potentialRevenue: string;
  potentialMultiple: string;
  sources?: { label: string; name: string }[];
}

export default function BenchmarkComparison({
  category,
  region,
  platform,
  groups,
  insight,
  potentialRevenue,
  potentialMultiple,
  sources,
}: BenchmarkComparisonProps) {
  const { t } = useTranslation();

  const verdictLabel: Record<string, string> = {
    하위: t("benchmark.verdict.low"),
    평균: t("benchmark.verdict.avg"),
    상위: t("benchmark.verdict.high"),
  };

  const verdictVariant: Record<string, "destructive" | "secondary" | "default"> = {
    하위: "destructive",
    평균: "secondary",
    상위: "default",
  };

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
            <GraphIcon size={14} />
          </span>
          <h2 className="text-sm font-semibold">{t("benchmark.title")}</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 ml-7">
          {t("benchmark.cohort")}: {category} ({region}, {platform})
        </p>
      </div>

      {/* Grouped Tables */}
      {groups.map((group, gi) => (
        <div key={gi} className="rounded-lg border overflow-hidden">
          <div className="px-3 py-2 border-b bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">{t(group.section)}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t("benchmark.metric")}</TableHead>
                <TableHead className="text-xs text-right">{t("benchmark.yours")}</TableHead>
                <TableHead className="text-xs text-right">{t("benchmark.p50")}</TableHead>
                <TableHead className="text-xs text-right">{t("benchmark.p75")}</TableHead>
                <TableHead className="text-xs text-center">{t("benchmark.percentile")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-sm">{row.label}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-sm">{row.yours}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums text-sm">{row.avg}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums text-sm">{row.top25}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={verdictVariant[row.verdict]} className="text-xs">
                      {verdictLabel[row.verdict] ?? row.verdict}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {/* Insight panel */}
      <div className="rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
        <p className="text-xs font-semibold text-primary mb-1.5">{t("benchmark.keyInsight")}</p>
        <p className="text-sm text-foreground/80">{insight}</p>
        <p className="text-sm text-foreground/80 mt-2">
          {t("benchmark.sameMAU")}{" "}
          <span className="font-semibold text-foreground">{potentialRevenue}</span> — {t("benchmark.currentVs")}{" "}
          <span className="font-semibold text-foreground">{potentialMultiple}</span> {t("benchmark.revenuePotential")}
        </p>
      </div>

      {/* Data Sources */}
      {sources && sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{t("benchmark.source")}:</span>
          {sources.map((s, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {s.name}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}
