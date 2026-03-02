"use client";

import { useState, useMemo } from "react";
import { GlobeIcon } from "@primer/octicons-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import type { Customer } from "@/lib/customer";
import { generateTimeSeries } from "@/lib/mock-timeseries";
import KpiSummaryBar from "./KpiSummaryBar";
import TimeSeriesSection from "./TimeSeriesSection";

interface AnalyticsDashboardProps {
  customer: Customer;
}

type Period = "7" | "14" | "30";

export default function AnalyticsDashboard({ customer }: AnalyticsDashboardProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("30");

  const fullData = useMemo(
    () => generateTimeSeries(customer, 30),
    [customer],
  );

  const data = useMemo(() => {
    const days = Number(period);
    return fullData.slice(-days);
  }, [fullData, period]);

  const m = customer.metrics;

  const modelLabels: Record<string, string> = {
    admob_banner: t("appProfile.model.banner"),
    admob_interstitial: t("appProfile.model.interstitial"),
    iap_theme: t("appProfile.model.iapTheme"),
    adsense_display: t("appProfile.model.adsenseDisplay"),
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded bg-primary/10 flex items-center justify-center">
              <GlobeIcon size={14} />
            </span>
            <h2 className="text-base font-semibold">{t("appProfile.title")}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">{t("appProfile.summary")}</p>
        <div className="flex items-center justify-end mt-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger size="sm" className="w-auto text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("analytics.period.7d")}</SelectItem>
              <SelectItem value="14">{t("analytics.period.14d")}</SelectItem>
              <SelectItem value="30">{t("analytics.period.30d")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.product")}</p>
          <p className="font-medium">{customer.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.vertical")}</p>
          <p className="font-medium">
            {customer.category} &gt; {customer.categorySub}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.monetizationModel")}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {m.currentModels.length > 0 ? (
              m.currentModels.map((model) => (
                <Badge key={model} variant="secondary" className="text-xs font-normal">
                  {modelLabels[model] || model}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{t("appProfile.none")}</span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <KpiSummaryBar data={data} />

      {/* Time Series Charts */}
      <TimeSeriesSection data={data} />
    </section>
  );
}
