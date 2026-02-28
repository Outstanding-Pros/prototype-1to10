"use client";

import { useState } from "react";
import customers from "@/data/dummy-customers.json";
import AppProfile from "@/components/AppProfile";
import LevelDiagnosis from "@/components/LevelDiagnosis";
import BenchmarkComparison from "@/components/BenchmarkComparison";
import RevenueSimulation from "@/components/RevenueSimulation";
import Roadmap from "@/components/Roadmap";
import MeasurementSetup from "@/components/MeasurementSetup";
import NextSteps from "@/components/NextSteps";
import SettingsMenu from "@/components/SettingsMenu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation, useLanguage } from "@/lib/i18n";

const navKeys = [
  { id: "profile", icon: "📱", key: "nav.appProfile" as const },
  { id: "level", icon: "💊", key: "nav.level" as const },
  { id: "benchmark", icon: "📊", key: "nav.benchmark" as const },
  { id: "simulation", icon: "💰", key: "nav.simulation" as const },
  { id: "roadmap", icon: "📋", key: "nav.roadmap" as const },
  { id: "next", icon: "🔄", key: "nav.nextSteps" as const },
];

export default function DashboardPage() {
  const c = customers[0];
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeNav, setActiveNav] = useState("profile");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2">
          <span className="size-6 bg-sidebar-accent rounded flex items-center justify-center text-sm">💊</span>
          <span className="text-[13px] font-semibold text-sidebar-accent-foreground">App Rx</span>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* App info */}
        <div className="px-4 py-3">
          <p className="text-xs text-sidebar-foreground/40 uppercase tracking-wider mb-1.5">
            {t("sidebar.currentApp")}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-sidebar-accent-foreground">{c.name}</span>
            <Badge variant="outline" className="text-xs py-0 border-sidebar-border text-sidebar-foreground/50">
              {c.platform}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge
              className={`text-xs py-0 ${
                c.measurementGrade === "A"
                  ? "bg-green-500/20 text-green-400 border-green-500/20"
                  : c.measurementGrade === "B"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                  : "bg-red-500/20 text-red-400 border-red-500/20"
              }`}
              variant="outline"
            >
              Grade {c.measurementGrade}
            </Badge>
            <Badge variant="outline" className="text-xs py-0 border-sidebar-border text-sidebar-foreground/50">
              Level {c.level}
            </Badge>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          <p className="px-2 py-1.5 text-xs text-sidebar-foreground/30 uppercase tracking-wider">
            {t("sidebar.diagnosisResults")}
          </p>
          {navKeys.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav(item.id);
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors
                ${activeNav === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50 text-sidebar-foreground/50 hover:text-sidebar-foreground/70"}
              `}
            >
              <span className="text-xs">{item.icon}</span>
              <span>{t(item.key)}</span>
            </a>
          ))}
        </nav>

        {/* Settings */}
        <Separator className="bg-sidebar-border" />
        <SettingsMenu />

        {/* Footer */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/25">
            {t("sidebar.expiry")}: 2026.03.29
          </p>
          <p className="text-xs text-sidebar-foreground/25 mt-0.5 font-mono">
            apprx v0.1
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">{c.name}</h1>
            <span className="text-xs text-muted-foreground">
              {c.category} &gt; {c.categorySub}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
              npx @apprx/cli init
            </code>
          </div>
        </header>

        {/* Sections */}
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">
          {/* Section 0: Measurement Setup */}
          {c.measurementGrade !== "A" && c.measurementGaps && (
            <div id="setup" className="scroll-mt-14">
              <MeasurementSetup
                grade={c.measurementGrade as "B" | "C"}
                gaps={c.measurementGaps}
              />
            </div>
          )}

          {/* Section 1: App Profile */}
          <div id="profile" className="scroll-mt-14">
            <AppProfile
              name={c.name}
              category={c.category}
              categorySub={c.categorySub}
              platform={c.platform}
              dau={c.metrics.dau}
              mau={c.metrics.mau}
              stickiness={c.metrics.stickiness}
              currentModels={c.metrics.currentModels}
              monthlyRevenue={c.metrics.monthlyRevenue}
              ecpm={c.metrics.ecpm}
              arpu={c.metrics.arpu}
              targetRevenue={c.goals.targetRevenue}
              revenueGap={c.goals.revenueGap}
              stickinessVerdict={
                c.benchmarks?.verdict
                  ? c.benchmarks.verdict.stickiness + ` ${t("benchmark.stickinessLevel")}`
                  : undefined
              }
            />
          </div>

          {/* Section 2: Level Diagnosis */}
          {c.diagnosis && (
            <div id="level" className="scroll-mt-14">
              <LevelDiagnosis
                level={c.level}
                levelName={c.levelName}
                reason={c.diagnosis.levelReason}
                potential={c.diagnosis.potential}
              />
            </div>
          )}

          {/* Section 3: Benchmark Comparison */}
          {c.benchmarks?.verdict && c.diagnosis && (
            <div id="benchmark" className="scroll-mt-14">
              <BenchmarkComparison
                category={c.category}
                region={c.region}
                platform={c.platform}
                rows={[
                  { label: t("benchmark.row.ecpm"), yours: "₩5,500", avg: "₩5,500", top25: "₩8,000", verdict: c.benchmarks.verdict.ecpm as "하위" | "평균" | "상위" },
                  { label: t("benchmark.row.dauMau"), yours: `${((c.metrics.stickiness ?? 0) * 100).toFixed(1)}%`, avg: "22%", top25: "30%", verdict: c.benchmarks.verdict.stickiness as "하위" | "평균" | "상위" },
                  { label: t("benchmark.row.arpu"), yours: `₩${c.metrics.arpu}`, avg: "₩120", top25: "₩280", verdict: c.benchmarks.verdict.arpu as "하위" | "평균" | "상위" },
                  { label: t("benchmark.row.arpuAdOnly"), yours: `₩${c.metrics.arpu}`, avg: "₩45", top25: "₩80", verdict: (c.benchmarks.verdict.arpuAdOnly ?? c.benchmarks.verdict.arpu) as "하위" | "평균" | "상위" },
                ]}
                insight={c.diagnosis!.keyInsight}
                potentialRevenue="₩3,360,000"
                potentialMultiple={language === "ko" ? "약 8.4배" : "~8.4x"}
              />
            </div>
          )}

          {/* Section 4: Revenue Simulation */}
          {c.simulation && c.recommendation && (
            <div id="simulation" className="scroll-mt-14">
              <RevenueSimulation
                recommendedModel={c.recommendation.primaryModel}
                recommendedReason={c.recommendation.reason}
                price={c.simulation.price}
                bundleItems={c.recommendation.bundleItems ?? []}
                scenarios={c.simulation.scenarios}
                targetRevenue={c.goals.targetRevenue}
                mau={c.metrics.mau ?? 0}
              />
            </div>
          )}

          {/* Section 5: Roadmap */}
          {c.roadmap && (
            <div id="roadmap" className="scroll-mt-14">
              <Roadmap
                currentWeek={c.roadmap.currentWeek}
                weeks={c.roadmap.weeks}
              />
            </div>
          )}

          {/* Section 6: Next Steps */}
          <div id="next" className="scroll-mt-14">
            <NextSteps expiryDate="2026.03.29" dashboardUrl={`https://apprx.dev/d/${c.id}`} />
          </div>
        </div>
      </main>
    </div>
  );
}
