// Stat — one labelled number with an optional one-line explanation, e.g. "Ready · 2 · You meet the
// expectation". Flat bordered tile; tone is carried by the icon colour only, so text stays neutral
// and readable (no warning-coloured text token exists for white surfaces).
//
// Tokens: color/surface/default · color/border/default · radius/surface · spacing/component/md ·
// spacing/component/xs · color/text/secondary · color/surface/default/foreground ·
// color/icon/muted · color/icon/success · color/icon/warning

import * as React from "react";

import { cn } from "@/lib/utils";

export type StatTone = "neutral" | "success" | "warning";

const toneIcon: Record<StatTone, string> = {
  neutral: "text-[var(--color-icon-muted)]",
  success: "text-[var(--color-icon-success)]",
  warning: "text-[var(--color-icon-warning)]",
};

export interface StatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** One short line explaining the number */
  description?: React.ReactNode;
  /** Decorative icon before the label (Phosphor, h-4 w-4) */
  icon?: React.ReactNode;
  /** Colours the icon only */
  tone?: StatTone;
}

export function Stat({ label, value, description, icon, tone = "neutral", className, ...props }: StatProps) {
  return (
    <div
      data-slot="stat"
      className={cn(
        "flex min-w-0 flex-col gap-[var(--spacing-component-xs)] rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-[var(--spacing-component-md)]",
        className
      )}
      {...props}
    >
      <p className="flex items-center gap-[var(--spacing-component-xs)] text-sm font-semibold text-[var(--color-text-secondary)]">
        {icon && <span aria-hidden="true" className={cn("inline-flex shrink-0 [&_svg]:h-4 [&_svg]:w-4", toneIcon[tone])}>{icon}</span>}
        {label}
      </p>
      <p className="text-2xl font-semibold text-[var(--color-surface-default-foreground)]">{value}</p>
      {description && <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>}
    </div>
  );
}
