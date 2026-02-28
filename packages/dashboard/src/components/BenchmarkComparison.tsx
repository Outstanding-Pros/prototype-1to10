"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/lib/i18n";

interface BenchmarkRow {
  label: string;
  yours: string;
  avg: string;
  top25: string;
  verdict: "하위" | "평균" | "상위";
}

interface BenchmarkComparisonProps {
  category: string;
  region: string;
  platform: string;
  rows: BenchmarkRow[];
  insight: string;
  potentialRevenue: string;
  potentialMultiple: string;
}

export default function BenchmarkComparison({
  category,
  region,
  platform,
  rows,
  insight,
  potentialRevenue,
  potentialMultiple,
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center text-xs">📊</span>
          {t("benchmark.title")}
        </CardTitle>
        <CardDescription>
          {category} {t("benchmark.appSuffix")} ({region}, {platform})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">{t("benchmark.metric")}</TableHead>
              <TableHead className="text-xs text-right">{t("benchmark.yours")}</TableHead>
              <TableHead className="text-xs text-right">{t("benchmark.avg")}</TableHead>
              <TableHead className="text-xs text-right">{t("benchmark.top25")}</TableHead>
              <TableHead className="text-xs text-center">{t("benchmark.verdict")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
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

        <div className="rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
          <p className="text-xs font-semibold text-primary mb-1.5">{t("benchmark.keyInsight")}</p>
          <p className="text-sm text-foreground/80">{insight}</p>
          <p className="text-sm text-foreground/80 mt-2">
            {t("benchmark.sameMAU")}{" "}
            <span className="font-semibold text-foreground">{potentialRevenue}</span> — {t("benchmark.currentVs")}{" "}
            <span className="font-semibold text-foreground">{potentialMultiple}</span> {t("benchmark.revenuePotential")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
