"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { GearIcon, SunIcon, MoonIcon, GlobeIcon } from "@primer/octicons-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="px-2 py-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[13px] transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
      >
        <GearIcon size={14} />
        <span>{t("sidebar.settings")}</span>
      </button>

      {open && (
        <div className="mt-1 mx-1 rounded-lg border border-sidebar-border bg-sidebar p-3 space-y-3">
          {/* Theme */}
          <div>
            <p className="text-xs text-sidebar-foreground/60 mb-2 flex items-center gap-1.5">
              {theme === "dark" ? <MoonIcon size={12} /> : <SunIcon size={12} />}
              {t("sidebar.accessibility")}
            </p>
            <div className="flex gap-1">
              <ThemeOption
                label={t("sidebar.lightMode")}
                icon={<SunIcon size={12} />}
                active={theme === "light"}
                onClick={() => setTheme("light")}
              />
              <ThemeOption
                label={t("sidebar.darkMode")}
                icon={<MoonIcon size={12} />}
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
              />
            </div>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Language */}
          <div>
            <p className="text-xs text-sidebar-foreground/60 mb-2 flex items-center gap-1.5">
              <GlobeIcon size={12} />
              {t("sidebar.language")}
            </p>
            <div className="flex gap-1">
              <LangOption label="한국어" active={language === "ko"} onClick={() => setLanguage("ko" as Language)} />
              <LangOption label="English" active={language === "en"} onClick={() => setLanguage("en" as Language)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeOption({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/50 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function LangOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/50 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
      }`}
    >
      {label}
    </button>
  );
}
