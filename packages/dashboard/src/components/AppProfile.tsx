"use client";

import { Badge } from "@/components/ui/badge";
import { PulseIcon } from "@primer/octicons-react";
import { useTranslation, useLanguage } from "@/lib/i18n";
import { formatCurrency } from "@/lib/currency";

interface BenchmarkRange {
  low: number;
  high: number;
}

interface AppProfileProps {
  name: string;
  category: string;
  categorySub: string;
  platform: string;
  dau: number | null;
  mau: number | null;
  stickiness: number | null;
  currentModels: string[];
  monthlyRevenue: number;
  ecpm: number | null;
  arpu: number | null;
  targetRevenue: number;
  revenueGap: number;
  stickinessVerdict?: string;
  stickinessRange?: BenchmarkRange;
  arpuRange?: BenchmarkRange;
}

function fmt(n: number | null) {
  return n === null ? "—" : n.toLocaleString();
}

function pct(value: number, low: number, high: number) {
  if (high === low) return 50;
  return Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100));
}

export default function AppProfile(p: AppProfileProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const fc = (n: number) => formatCurrency(n, language);

  const modelLabels: Record<string, string> = {
    admob_banner: t("appProfile.model.banner"),
    admob_interstitial: t("appProfile.model.interstitial"),
    iap_theme: t("appProfile.model.iapTheme"),
    adsense_display: t("appProfile.model.adsenseDisplay"),
  };

  const attainment = p.targetRevenue > 0
    ? Math.round((p.monthlyRevenue / p.targetRevenue) * 100)
    : 0;

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
            <PulseIcon size={14} />
          </span>
          <h2 className="text-base font-semibold">{t("appProfile.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">{t("appProfile.summary")}</p>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.product")}</p>
          <p className="font-medium">{p.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.vertical")}</p>
          <p className="font-medium">{p.category} &gt; {p.categorySub}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.monetizationModel")}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {p.currentModels.length > 0
              ? p.currentModels.map((m) => (
                  <Badge key={m} variant="secondary" className="text-xs font-normal">
                    {modelLabels[m] || m}
                  </Badge>
                ))
              : <span className="text-muted-foreground">{t("appProfile.none")}</span>}
          </div>
        </div>
      </div>

      {/* Engagement Section */}
      <div className="rounded-lg border overflow-hidden">
        <div className="px-3 py-2 border-b bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">{t("appProfile.engagement")}</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-6">
            {/* DAU */}
            <MetricCard label="DAU" value={fmt(p.dau)} />
            {/* MAU */}
            <MetricCard label="MAU" value={fmt(p.mau)} />
            {/* Stickiness (DAU/MAU) */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">DAU/MAU Ratio</p>
              <p className="text-xl font-bold tabular-nums">
                {p.stickiness !== null ? `${(p.stickiness * 100).toFixed(1)}%` : "—"}
              </p>
              {p.stickiness !== null && p.stickinessRange && (
                <BenchmarkBar
                  value={p.stickiness}
                  low={p.stickinessRange.low}
                  high={p.stickinessRange.high}
                  format={(v) => `${(v * 100).toFixed(0)}%`}
                  verdict={p.stickinessVerdict}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Performance Section */}
      <div className="rounded-lg border overflow-hidden">
        <div className="px-3 py-2 border-b bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">{t("appProfile.revenuePerformance")}</span>
        </div>
        <div className="p-4 space-y-5">
          {/* MRR with attainment bar */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("appProfile.mrr")}</p>
                <p className="text-2xl font-bold tabular-nums">{fc(p.monthlyRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">{t("appProfile.revenueTarget")}</p>
                <p className="text-sm font-semibold tabular-nums text-muted-foreground">{fc(p.targetRevenue)}</p>
              </div>
            </div>
            {/* Attainment progress bar */}
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    attainment >= 100
                      ? "bg-green-500"
                      : attainment >= 50
                      ? "bg-amber-500"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${Math.min(attainment, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("appProfile.attainment")} {attainment}%
                </span>
                <span className="text-destructive font-medium tabular-nums">
                  {t("appProfile.revenueGap")} {fc(p.revenueGap)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b" />

          {/* ARPU & eCPM */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">ARPU</p>
              <p className="text-xl font-bold tabular-nums">
                {p.arpu !== null ? fc(p.arpu) : "—"}
                <span className="text-xs font-normal text-muted-foreground ml-1">{t("appProfile.perMonth")}</span>
              </p>
              {p.arpu !== null && p.arpuRange && (
                <BenchmarkBar
                  value={p.arpu}
                  low={p.arpuRange.low}
                  high={p.arpuRange.high}
                  format={(v) => formatCurrency(v, language)}
                />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">eCPM</p>
              <p className="text-xl font-bold tabular-nums">
                {p.ecpm !== null ? fc(p.ecpm) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function BenchmarkBar({
  value,
  low,
  high,
  format,
  verdict,
}: {
  value: number;
  low: number;
  high: number;
  format: (v: number) => string;
  verdict?: string;
}) {
  const position = pct(value, low, high);

  return (
    <div className="mt-2 space-y-1">
      {/* Bar */}
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-destructive/30 via-amber-400/40 to-green-500/40">
        <div
          className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-primary ring-2 ring-background"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      {/* Range labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(low)}</span>
        {verdict && (
          <Badge variant="outline" className="text-xs py-0 px-1.5 font-normal">
            {verdict}
          </Badge>
        )}
        <span>{format(high)}</span>
      </div>
    </div>
  );
}
