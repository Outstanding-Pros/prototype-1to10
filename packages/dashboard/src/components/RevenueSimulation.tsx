"use client";

import { Badge } from "@/components/ui/badge";
import { ZapIcon } from "@primer/octicons-react";
import { useTranslation } from "@/lib/i18n";

interface Scenario {
  label: string;
  conversionRate: number;
  subscribers: number;
  subscriptionRevenue: number;
  adRevenue: number;
  total: number;
}

interface RevenueSimulationProps {
  recommendedModel: string;
  recommendedReason: string;
  price: number;
  bundleItems: string[];
  scenarios: Scenario[];
  targetRevenue: number;
  mau: number;
}

function won(n: number) {
  return `₩${n.toLocaleString("ko-KR")}`;
}

export default function RevenueSimulation({
  recommendedModel,
  recommendedReason,
  price,
  bundleItems,
  scenarios,
  targetRevenue,
  mau,
}: RevenueSimulationProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
          <ZapIcon size={14} />
        </span>
        <h2 className="text-sm font-semibold">{t("simulation.title")}</h2>
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
          const meetsTarget = s.total >= targetRevenue;
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
                {meetsTarget ? (
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

      {/* Formula */}
      <div className="rounded-lg bg-muted/50 p-3.5 space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">{t("simulation.formula")}</p>
        <p className="font-mono text-xs text-foreground/70">
          MAU {mau.toLocaleString()} {t("simulation.formulaDesc")} {won(price)} {t("simulation.formulaResult")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t("simulation.convBasis")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("simulation.disclaimer")}
        </p>
      </div>
    </section>
  );
}
