/**
 * Design System Reference — Linear / shadcn inspired
 *
 * Actual values live in globals.css as CSS custom properties.
 * This file documents the conventions used across the dashboard.
 *
 * Typography
 * ──────────
 * - Font family: Geist Sans (--font-geist-sans), Geist Mono for code
 * - Page title:  text-sm font-semibold (14px)
 * - Section heading: text-sm font-semibold with icon
 * - Body:        text-sm (14px)
 * - Caption:     text-xs text-muted-foreground (12px)
 * - Label:       text-xs uppercase tracking-wider
 *
 * Spacing
 * ──────────
 * - Section gap:  space-y-5 (20px)
 * - Card padding: p-4 / p-5
 * - Inner gap:    gap-2 / gap-3
 * - Sidebar width: w-56 (224px)
 *
 * Radius
 * ──────────
 * - Base:  0.375rem (6px) — tighter than default shadcn
 * - Cards: rounded-lg (var(--radius))
 * - Badges/buttons: rounded-md
 *
 * Icon sizes
 * ──────────
 * - Nav icon:     size={14} (3.5 in Tailwind)
 * - Section icon: size={14} inside size-5 container with bg-primary/10
 * - Settings:     size={12} (3 in Tailwind)
 *
 * Colors
 * ──────────
 * - Primary accent: purple (oklch 260 hue)
 * - Semantic: green for positive, red/destructive for negative, amber for warning
 * - Sidebar: slightly darker bg than main (light), deeper bg (dark)
 * - Borders: very subtle in both themes
 * - Cards (dark): slight lift from background
 */

export const ICON_SIZE = {
  nav: 14,
  section: 14,
  settings: 12,
} as const;
