"use client";

import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GraphIcon } from "@primer/octicons-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";

interface BenchmarkRow {
  label: string;
  yours: string;
  avg: string;
  top25: string;
  verdict: "하위" | "평균" | "상위";
  description?: string;
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

function HeaderTooltip({
  label,
  description,
  className,
}: {
  label: string;
  description: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className}>{label}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4} className="max-w-56">
        {description}
      </TooltipContent>
    </Tooltip>
  );
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

  const verdictClass: Record<string, string> = {
    하위: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    평균: "bg-secondary text-secondary-foreground border-border",
    상위: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  };

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
            <GraphIcon size={14} />
          </span>
          <h2 className="text-base font-semibold">{t("benchmark.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">{t("benchmark.summary")}</p>
      </div>

      {/* Key insight callout */}
      <div className="rounded-lg bg-muted/40 px-3.5 py-2.5 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{t("benchmark.keyInsight")}</p>
        <p className="text-sm text-foreground/80">{insight}</p>
        <p className="text-sm text-muted-foreground">
          {t("benchmark.sameMAU")}{" "}
          <span className="font-semibold text-foreground">{potentialRevenue}</span> — {t("benchmark.currentVs")}{" "}
          <span className="font-semibold text-foreground">{potentialMultiple}</span> {t("benchmark.revenuePotential")}
        </p>
      </div>

      {/* Single unified table */}
      <div className="rounded-lg border overflow-hidden">
        <Table className="table-fixed">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">
                <HeaderTooltip label={t("benchmark.metric")} description={t("benchmark.metric.desc")} />
              </TableHead>
              <TableHead className="text-xs text-right">
                <HeaderTooltip label={t("benchmark.yours")} description={t("benchmark.yours.desc")} className="text-right" />
              </TableHead>
              <TableHead className="text-xs text-right">
                <HeaderTooltip label={t("benchmark.p50")} description={t("benchmark.p50.desc")} className="text-right" />
              </TableHead>
              <TableHead className="text-xs text-right">
                <HeaderTooltip label={t("benchmark.p75")} description={t("benchmark.p75.desc")} className="text-right" />
              </TableHead>
              <TableHead className="text-xs text-center">
                <HeaderTooltip label={t("benchmark.percentile")} description={t("benchmark.percentile.desc")} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group, gi) => (
              <Fragment key={gi}>
                {/* Section divider row */}
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={5} className="py-1.5 px-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t(group.section)}
                    </span>
                  </TableCell>
                </TableRow>
                {/* Data rows */}
                {group.rows.map((row, i) => {
                  const tr = (
                    <TableRow key={`${gi}-${i}`}>
                      <TableCell className="font-medium text-sm">{row.label}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-sm">{row.yours}</TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums text-sm">{row.avg}</TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums text-sm">{row.top25}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-xs ${verdictClass[row.verdict] ?? ""}`}>
                          {verdictLabel[row.verdict] ?? row.verdict}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );

                  if (!row.description) return tr;

                  return (
                    <Tooltip key={`${gi}-${i}`}>
                      <TooltipTrigger asChild>{tr}</TooltipTrigger>
                      <TooltipContent side="bottom" align="start" sideOffset={4} className="max-w-72">
                        <p className="font-medium mb-0.5">{row.label}</p>
                        <p className="text-muted-foreground">{row.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Cohort info + Data Sources */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{t("benchmark.cohort")}: {category} ({region}, {platform})</span>
        {sources && sources.length > 0 && (
          <>
            <span className="text-border">|</span>
            <span className="font-medium">{t("benchmark.source")}:</span>
            {sources.map((s, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {s.name}
              </Badge>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
