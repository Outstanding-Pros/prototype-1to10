"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";

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
}

function fmt(n: number | null) {
  return n === null ? "—" : n.toLocaleString("ko-KR");
}

export default function AppProfile(p: AppProfileProps) {
  const { t } = useTranslation();

  const modelLabels: Record<string, string> = {
    admob_banner: t("appProfile.model.banner"),
    admob_interstitial: t("appProfile.model.interstitial"),
    iap_theme: t("appProfile.model.iapTheme"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center text-xs">📱</span>
          {t("appProfile.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Meta grid */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.appName")}</p>
            <p className="font-medium">{p.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.category")}</p>
            <p className="font-medium">{p.category} &gt; {p.categorySub}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">{t("appProfile.revenueModel")}</p>
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

        <Separator />

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <Metric label="DAU" value={fmt(p.dau)} />
          <Metric label="MAU" value={fmt(p.mau)} />
          <Metric
            label="Stickiness"
            value={p.stickiness !== null ? `${(p.stickiness * 100).toFixed(1)}%` : "—"}
            sub={p.stickinessVerdict}
          />
          <Metric label="ARPU" value={p.arpu !== null ? `₩${p.arpu}` : "—"} sub={t("appProfile.perMonth")} />
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-3 gap-3">
          <Metric label={t("appProfile.monthlyRevenue")} value={`₩${fmt(p.monthlyRevenue)}`} accent="blue" />
          <Metric label={t("appProfile.target")} value={`₩${fmt(p.targetRevenue)}`} />
          <Metric label={t("appProfile.revenueGap")} value={`₩${fmt(p.revenueGap)}`} accent="red" />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "blue" | "red";
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        accent === "blue"
          ? "bg-primary/5 ring-1 ring-primary/10"
          : accent === "red"
          ? "bg-destructive/5 ring-1 ring-destructive/10"
          : "bg-muted/50"
      }`}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-base font-semibold tabular-nums ${accent === "red" ? "text-destructive" : ""}`}>
        {value}
        {sub && <span className="text-xs font-normal text-muted-foreground ml-0.5">{sub}</span>}
      </p>
    </div>
  );
}
