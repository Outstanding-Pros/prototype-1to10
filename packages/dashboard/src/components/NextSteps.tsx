"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

interface NextStepsProps {
  expiryDate: string;
  dashboardUrl: string;
}

export default function NextSteps({ expiryDate }: NextStepsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="size-5 rounded bg-primary/10 flex items-center justify-center text-xs">🔄</span>
          {t("nextSteps.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("nextSteps.dashboardAccess")}{" "}
          <span className="font-medium text-foreground">{expiryDate}</span>
          {t("nextSteps.until")}
        </p>

        <div className="rounded-lg bg-primary/5 p-5 ring-1 ring-primary/10 space-y-3">
          <p className="font-semibold text-sm">{t("nextSteps.monthlyPlan")}</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">·</span>
              {t("nextSteps.feature1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">·</span>
              {t("nextSteps.feature2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">·</span>
              {t("nextSteps.feature3")}
            </li>
          </ul>
          <Button className="w-full mt-2">{t("nextSteps.subscribe")}</Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t("nextSteps.devIntegration")}{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
            npx @apprx/cli init
          </code>
        </p>
      </CardContent>
    </Card>
  );
}
