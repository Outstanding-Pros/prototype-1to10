"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation, type TranslationKey } from "@/lib/i18n";

const TOTAL_STEPS = 4;

const STEP_TITLES: Record<number, TranslationKey> = {
  1: "onboarding.step1.title",
  2: "onboarding.step2.title",
  3: "onboarding.step3.title",
  4: "onboarding.step4.title",
};

const ANALYTICS_TOOLS: { key: string; label: TranslationKey }[] = [
  { key: "ga", label: "onboarding.step3.ga" },
  { key: "clarity", label: "onboarding.step3.clarity" },
  { key: "beusable", label: "onboarding.step3.beusable" },
  { key: "amplitude", label: "onboarding.step3.amplitude" },
  { key: "mixpanel", label: "onboarding.step3.mixpanel" },
  { key: "hotjar", label: "onboarding.step3.hotjar" },
  { key: "other", label: "onboarding.step3.other" },
];

const REVENUE_MODELS: { key: string; label: TranslationKey }[] = [
  { key: "adsense", label: "onboarding.step4.adsense" },
  { key: "admob", label: "onboarding.step4.admob" },
  { key: "subscription", label: "onboarding.step4.subscription" },
  { key: "iap", label: "onboarding.step4.iap" },
  { key: "commerce", label: "onboarding.step4.commerceModel" },
  { key: "none", label: "onboarding.step4.noRevenue" },
];

const CATEGORIES: { value: string; label: TranslationKey }[] = [
  { value: "saas", label: "onboarding.step1.cat.saas" },
  { value: "commerce", label: "onboarding.step1.cat.commerce" },
  { value: "content", label: "onboarding.step1.cat.content" },
  { value: "utility", label: "onboarding.step1.cat.utility" },
  { value: "education", label: "onboarding.step1.cat.education" },
  { value: "community", label: "onboarding.step1.cat.community" },
  { value: "other", label: "onboarding.step1.cat.other" },
];

const REVENUE_RANGES: { value: string; label: TranslationKey }[] = [
  { value: "none", label: "onboarding.step4.rev.none" },
  { value: "under50", label: "onboarding.step4.rev.under50" },
  { value: "50to200", label: "onboarding.step4.rev.50to200" },
  { value: "200to500", label: "onboarding.step4.rev.200to500" },
  { value: "500to1000", label: "onboarding.step4.rev.500to1000" },
  { value: "over1000", label: "onboarding.step4.rev.over1000" },
];

interface FormData {
  serviceName: string;
  websiteUrl: string;
  category: string;
  githubUrl: string;
  analyticsTools: string[];
  analyticsIds: Record<string, string>;
  otherToolName: string;
  revenueModels: string[];
  monthlyRevenue: string;
  targetRevenue: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    serviceName: "",
    websiteUrl: "",
    category: "",
    githubUrl: "",
    analyticsTools: [],
    analyticsIds: {},
    otherToolName: "",
    revenueModels: [],
    monthlyRevenue: "",
    targetRevenue: "",
  });

  const canNext = true;

  function toggleArrayItem(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 px-6 pt-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < TOTAL_STEPS && (
                  <div
                    className={`h-px w-8 ${s < step ? "bg-primary/40" : "bg-muted"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <CardContent className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-center">
            {t(STEP_TITLES[step])}
          </h2>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="serviceName">
                  {t("onboarding.step1.serviceName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="serviceName"
                  value={form.serviceName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, serviceName: e.target.value }))
                  }
                  placeholder={t("onboarding.step1.serviceNamePlaceholder")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="websiteUrl">
                  {t("onboarding.step1.websiteUrl")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, websiteUrl: e.target.value }))
                  }
                  placeholder={t("onboarding.step1.websiteUrlPlaceholder")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>{t("onboarding.step1.category")}</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("onboarding.step1.categoryPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {t(cat.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Code Repository */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="githubUrl">
                  {t("onboarding.step2.githubUrl")}
                </Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, githubUrl: e.target.value }))
                  }
                  placeholder={t("onboarding.step2.githubPlaceholder")}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("onboarding.step2.notice")}
              </p>
            </div>
          )}

          {/* Step 3: Analytics Tools */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {t("onboarding.step3.description")}
              </p>
              {ANALYTICS_TOOLS.map((tool) => {
                const checked = form.analyticsTools.includes(tool.key);
                return (
                  <div key={tool.key} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`tool-${tool.key}`}
                        checked={checked}
                        onCheckedChange={() =>
                          setForm((f) => ({
                            ...f,
                            analyticsTools: toggleArrayItem(
                              f.analyticsTools,
                              tool.key,
                            ),
                          }))
                        }
                      />
                      <Label htmlFor={`tool-${tool.key}`} className="cursor-pointer">
                        {t(tool.label)}
                      </Label>
                    </div>
                    {checked && tool.key === "other" && (
                      <Input
                        value={form.otherToolName}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            otherToolName: e.target.value,
                          }))
                        }
                        placeholder={t("onboarding.step3.other")}
                        className="ml-6"
                      />
                    )}
                    {checked && tool.key !== "other" && (
                      <Input
                        value={form.analyticsIds[tool.key] ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            analyticsIds: {
                              ...f.analyticsIds,
                              [tool.key]: e.target.value,
                            },
                          }))
                        }
                        placeholder={t("onboarding.step3.integrationId")}
                        className="ml-6"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4: Revenue Status */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>{t("onboarding.step4.revenueModel")}</Label>
                <div className="flex flex-col gap-2">
                  {REVENUE_MODELS.map((model) => (
                    <div key={model.key} className="flex items-center gap-2">
                      <Checkbox
                        id={`rev-${model.key}`}
                        checked={form.revenueModels.includes(model.key)}
                        onCheckedChange={() =>
                          setForm((f) => ({
                            ...f,
                            revenueModels: toggleArrayItem(
                              f.revenueModels,
                              model.key,
                            ),
                          }))
                        }
                      />
                      <Label htmlFor={`rev-${model.key}`} className="cursor-pointer">
                        {t(model.label)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>{t("onboarding.step4.monthlyRevenue")}</Label>
                <Select
                  value={form.monthlyRevenue}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, monthlyRevenue: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("onboarding.step4.revenuePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {t(range.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="targetRevenue">
                  {t("onboarding.step4.targetRevenue")}
                </Label>
                <Input
                  id="targetRevenue"
                  type="number"
                  value={form.targetRevenue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, targetRevenue: e.target.value }))
                  }
                  placeholder={t("onboarding.step4.targetPlaceholder")}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between gap-2">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
              >
                {t("onboarding.prev")}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {step === 2 && (
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => s + 1)}
                >
                  {t("onboarding.skip")}
                </Button>
              )}

              {step < TOTAL_STEPS ? (
                <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                  {t("onboarding.next")}
                </Button>
              ) : (
                <Button onClick={() => router.push("/")}>
                  {t("onboarding.startDiagnosis")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
