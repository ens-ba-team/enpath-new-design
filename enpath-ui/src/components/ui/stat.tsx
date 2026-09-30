// Stat — one labelled number with an optional one-line explanation, e.g. "Ready · 2 · You meet the
// expectation". Flat bordered tile; tone is carried by the icon colour only, so text stays neutral
// and readable (no warning-coloured text token exists for white surfaces).
// Options (2026-09-30, from the Action plan summary):
//   iconTile — the icon on a solid tile (color/tile/*) with a white icon (color/tile/*/foreground)
//   divided  — a full-width line under the label row (color/border/default)
//   aside    — a short note on the right of the description row, e.g. "1 overdue" (the caller colours it)
//
// Tokens: color/surface/default · color/border/default · shadow/surface · radius/surface · spacing/component/md ·
// spacing/component/xs · spacing/component/sm · color/text/secondary · color/surface/default/foreground ·
// color/icon/muted · color/icon/success · color/icon/warning · color/tile/* · color/tile/*/foreground

import * as React from "react";

import { cn } from "@/lib/utils";

export type StatTone = "neutral" | "success" | "warning";
export type StatIconTile = "warning" | "neutral" | "info" | "success";

const toneIcon: Record<StatTone, string> = {
  neutral: "text-[var(--color-icon-muted)]",
  success: "text-[var(--color-icon-success)]",
  warning: "text-[var(--color-icon-warning)]",
};

const tileFill: Record<StatIconTile, string> = {
  warning: "bg-[var(--color-tile-warning)] text-[var(--color-tile-warning-foreground)]",
  neutral: "bg-[var(--color-tile-neutral)] text-[var(--color-tile-neutral-foreground)]",
  info: "bg-[var(--color-tile-info)] text-[var(--color-tile-info-foreground)]",
  success: "bg-[var(--color-tile-success)] text-[var(--color-tile-success-foreground)]",
};

export interface StatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** One short line explaining the number */
  description?: React.ReactNode;
  /** A short note on the right of the description row (e.g. "1 overdue") */
  aside?: React.ReactNode;
  /** Decorative icon before the label (Phosphor, h-4 w-4) */
  icon?: React.ReactNode;
  /** Colours the bare icon only (ignored when iconTile is set) */
  tone?: StatTone;
  /** Puts the icon on a solid tile with a white icon */
  iconTile?: StatIconTile;
  /** A full-width line under the label row */
  divided?: boolean;
}

export function Stat({ label, value, description, aside, icon, tone = "neutral", iconTile, divided = false, className, ...props }: StatProps) {
  return (
    <div
      data-slot="stat"
      className={cn(
        "flex min-w-0 flex-col gap-[var(--spacing-component-xs)] rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] shadow-[var(--shadow-surface)] p-[var(--spacing-component-md)]",
        className
      )}
      {...props}
    >
      <p className={cn(
        "flex items-center gap-[var(--spacing-component-xs)] text-heading-xs text-[var(--color-text-secondary)]",
        divided && "-mx-[var(--spacing-component-md)] border-b border-[var(--color-border-default)] px-[var(--spacing-component-md)] pb-[var(--spacing-component-sm)]"
      )}>
        {icon && (
          <span aria-hidden="true" className={cn(
            "inline-flex shrink-0 [&_svg]:h-4 [&_svg]:w-4",
            iconTile ? cn("rounded-[var(--radius-md)] p-[var(--spacing-component-xs-plus)]", tileFill[iconTile]) : toneIcon[tone]
          )}>{icon}</span>
        )}
        {label}
      </p>
      <p className="text-heading-xl text-[var(--color-surface-default-foreground)]">{value}</p>
      {(description || aside) && (
        <p className="flex items-baseline justify-between gap-[var(--spacing-component-sm)] text-body-sm text-[var(--color-text-secondary)]">
          <span className="min-w-0">{description}</span>
          {aside && <span className="shrink-0">{aside}</span>}
        </p>
      )}
    </div>
  );
}
