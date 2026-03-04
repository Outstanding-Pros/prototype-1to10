"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GlobeIcon,
  PulseIcon,
  GraphIcon,
  ZapIcon,
  ProjectRoadmapIcon,
  MilestoneIcon,
  StarFillIcon,
  CheckCircleFillIcon,
  ChevronRightIcon,
} from "@primer/octicons-react";
import { Fan } from "lucide-react";
import { getCustomer } from "@/lib/customer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SettingsMenu from "@/components/SettingsMenu";
import { useTranslation, useLanguage } from "@/lib/i18n";

const navItems = [
  { href: "/analytics", icon: PulseIcon, key: "nav.appProfile" as const },
  { href: "/market", icon: GlobeIcon, key: "nav.level" as const },
  { href: "/benchmark", icon: GraphIcon, key: "nav.benchmark" as const },
  { href: "/business-model", icon: ZapIcon, key: "nav.simulation" as const },
  { href: "/sprint", icon: ProjectRoadmapIcon, key: "nav.roadmap" as const },
  { href: "/roadmap", icon: MilestoneIcon, key: "nav.strategy" as const },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const c = getCustomer();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [offerOpen, setOfferOpen] = useState(false);
  const [serviceInfoOpen, setServiceInfoOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2">
          <span className="size-6 bg-sidebar-accent rounded flex items-center justify-center text-sidebar-accent-foreground">
            <Fan size={14} />
          </span>
          <span className="text-[13px] font-semibold text-sidebar-accent-foreground">
            Propel
          </span>
        </div>

        <div className="px-4"><Separator className="bg-sidebar-border" /></div>

        {/* App info — clickable to open service info modal */}
        <button
          type="button"
          onClick={() => setServiceInfoOpen(true)}
          className="mx-2 px-2 py-2.5 rounded-md text-left transition-colors hover:bg-sidebar-accent/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-sidebar-accent-foreground">
              {c.name}
            </p>
            <ChevronRightIcon size={12} className="text-sidebar-foreground/30 group-hover:text-sidebar-foreground/50 transition-colors" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge
              variant="outline"
              className="text-xs py-0 border-sidebar-border text-sidebar-foreground/50"
            >
              {c.platform}
            </Badge>
            <span className="text-xs text-sidebar-foreground/30">
              {c.category}
            </span>
          </div>
        </button>

        <div className="px-4"><Separator className="bg-sidebar-border" /></div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          <p className="px-2 py-1.5 text-xs text-sidebar-foreground/30 uppercase tracking-wider">
            {t("sidebar.diagnosisResults")}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/50 hover:text-sidebar-foreground/70"
                }`}
              >
                <Icon size={14} />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Offer banner */}
        <button
          type="button"
          onClick={() => setOfferOpen(true)}
          className="mx-3 mb-2 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-2.5 text-left transition-colors hover:from-primary/20 hover:to-primary/10 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <StarFillIcon size={12} className="text-primary" />
            <span className="text-xs font-semibold text-sidebar-accent-foreground">
              {t("offer.headline")}
            </span>
          </div>
          <span className="text-xs text-primary font-medium">
            {t("offer.cta")} &rarr;
          </span>
        </button>

        {/* Settings */}
        <div className="px-4"><Separator className="bg-sidebar-border" /></div>
        <SettingsMenu />

      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-background p-2 pl-0">
        <main className="h-full bg-card border border-border rounded-lg overflow-y-auto">
          <div className="px-6 py-8">{children}</div>
        </main>
      </div>

      {/* Offer modal */}
      <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StarFillIcon size={16} className="text-primary" />
              {t("offer.modal.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight">{t("offer.modal.price")}</span>
              <span className="text-sm text-muted-foreground">{t("offer.modal.perMonth")}</span>
            </div>

            <p className="text-sm text-muted-foreground">{t("offer.modal.desc")}</p>

            {/* Features */}
            <ul className="space-y-2.5">
              {(["offer.modal.feature1", "offer.modal.feature2", "offer.modal.feature3", "offer.modal.feature4"] as const).map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm">
                  <CheckCircleFillIcon size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" size="lg">
              {t("offer.modal.subscribe")}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {t("offer.modal.trial")}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service info modal */}
      <Dialog open={serviceInfoOpen} onOpenChange={setServiceInfoOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("serviceInfo.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Subscription */}
            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">{t("serviceInfo.subscription")}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">{t("serviceInfo.freeTrial")}</Badge>
                  <span className="text-sm font-medium">{t("serviceInfo.plan.free")}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t("serviceInfo.expiresAt")}</p>
                  <p className="text-sm font-semibold tabular-nums">2026.03.29</p>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">{t("serviceInfo.basicInfo")}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <InfoField label={t("serviceInfo.name")} value={c.name} />
                <InfoField label={t("serviceInfo.platform")} value={c.platform} />
                <InfoField label={t("serviceInfo.category")} value={`${c.category} > ${c.categorySub}`} />
                <InfoField label={t("serviceInfo.region")} value={c.region} />
                <InfoField label={t("serviceInfo.website")} value="toronchul.com" link />
              </div>
            </div>

            {/* Analytics Tools */}
            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">{t("serviceInfo.analytics")}</p>
              <div className="space-y-2">
                {["Google Analytics", "Microsoft Clarity"].map((tool) => (
                  <div key={tool} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-green-500" />
                      <span className="text-sm">{tool}</span>
                      <Badge variant="outline" className="text-xs font-normal text-green-600 border-green-600/20 bg-green-600/5">
                        {t("serviceInfo.connected")}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2">
                      {t("serviceInfo.disconnect")}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Status */}
            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">{t("serviceInfo.revenue")}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{t("serviceInfo.revenueModel")}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.metrics.currentModels.map((m) => (
                      <Badge key={m} variant="secondary" className="text-xs font-normal">
                        {language === "ko"
                          ? { adsense_display: "디스플레이 광고", admob_banner: "배너", admob_interstitial: "전면", iap_theme: "인앱(테마)" }[m] ?? m
                          : { adsense_display: "Display Ads", admob_banner: "Banner", admob_interstitial: "Interstitial", iap_theme: "IAP (Theme)" }[m] ?? m}
                      </Badge>
                    ))}
                  </div>
                </div>
                <InfoField
                  label={t("serviceInfo.monthlyRevenue")}
                  value={`₩${c.metrics.monthlyRevenue.toLocaleString("ko-KR")}`}
                />
                <InfoField
                  label={t("serviceInfo.targetRevenue")}
                  value={`₩${c.goals.targetRevenue.toLocaleString("ko-KR")}`}
                />
                <InfoField
                  label={t("serviceInfo.measurementGrade")}
                  value={`Grade ${c.measurementGrade}`}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoField({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      {link ? (
        <p className="text-sm font-medium text-primary">{value}</p>
      ) : (
        <p className="text-sm font-medium">{value}</p>
      )}
    </div>
  );
}
