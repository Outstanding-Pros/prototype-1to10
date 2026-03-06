import type { Language } from "./i18n";

const KRW_PER_USD = 1300;

export function formatCurrency(krwAmount: number, language: Language): string {
  if (language === "en") {
    const usd = krwAmount / KRW_PER_USD;
    if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
    if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
    if (usd >= 1) return `$${Math.round(usd).toLocaleString("en-US")}`;
    return `$${usd.toFixed(2)}`;
  }
  return `₩${krwAmount.toLocaleString("ko-KR")}`;
}

export function formatCurrencyCompact(krwAmount: number, language: Language): string {
  if (language === "en") {
    const usd = krwAmount / KRW_PER_USD;
    if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
    if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
    return `$${Math.round(usd)}`;
  }
  if (krwAmount >= 1_000_000) return `₩${(krwAmount / 1_000_000).toFixed(1)}M`;
  if (krwAmount >= 1_000) return `₩${(krwAmount / 1_000).toFixed(0)}K`;
  return `₩${krwAmount}`;
}

export function formatCurrencyAxis(krwAmount: number, language: Language): string {
  if (language === "en") {
    const usd = krwAmount / KRW_PER_USD;
    if (Math.abs(usd) >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
    if (Math.abs(usd) >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
    return `$${Math.round(usd)}`;
  }
  if (Math.abs(krwAmount) >= 1_000_000) return `${(krwAmount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(krwAmount) >= 1_000) return `${(krwAmount / 1_000).toFixed(0)}K`;
  return `${krwAmount}`;
}
