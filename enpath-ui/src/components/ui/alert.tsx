import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Alert shell ──────────────────────────────────────────────────────────────
// Tokens:
//   fill     = color/background/default (all variants)
//   stroke   = color/border/default (Default) | color/border/error (Destructive) | color/yellow/200 (Warning) | color/green/200 (Success) | color/blue/200 (Info)
//   radius   = radius/lg
//   padding  = spacing/component/lg (16px); size sm: md horizontal / sm vertical, one row
//   gap      = spacing/component/sm (8px) — flat layout: title ↔ description
//
// Layout: flex-col (flat). Optional `icon` (2026-09-30): the icon sits beside the content — a row of
// icon + a flex-col of the children (gap spacing/component/md, content gap spacing/component/xxs).
// Not every Alert has an icon; without `icon` nothing changes. Size sm is already one row: the icon
// goes first. Don't build the icon row by hand on a screen.
// Variant ai (2026-09-30): an AI proposal — white fill, color/border/ai stroke, the icon in
// color/icon/brand (use the Sparkle icon).
//
// Text colors cascade via CSS descendant selectors on data-alert-title / data-alert-desc.
// Icon color cascades via [&_svg] selector.
//
// Warning uses primitive yellow tokens — intentional design decision (no semantic warning tokens).
// Success and Info (from En UI) follow the same pattern: subtle status fill, 200 border,
// subtle-foreground title + icon, 800 description.

const alertVariants = cva(
  "flex w-full rounded-[var(--radius-lg)] border",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--color-background-default)]",
          "border-[var(--color-border-default)]",
          "[&_[data-alert-title]]:text-[var(--color-background-default-foreground)]",
          "[&_[data-alert-desc]]:text-[var(--color-background-muted-foreground)]",
          "[&_svg]:text-[var(--color-background-default-foreground)]",
        ].join(" "),
        destructive: [
          "bg-[var(--color-background-default)]",
          "border-[var(--color-border-error)]",
          "[&_[data-alert-title]]:text-[var(--color-text-invalid)]",
          "[&_[data-alert-desc]]:text-[var(--color-text-secondary)]",
          "[&_svg]:text-[var(--color-icon-danger)]",
        ].join(" "),
        warning: [
          "bg-[var(--color-yellow-50)]",
          "border-[var(--color-yellow-200)]",
          "[&_[data-alert-title]]:text-[var(--color-yellow-900)]",
          "[&_[data-alert-desc]]:text-[var(--color-yellow-800)]",
          "[&_svg]:text-[var(--color-icon-warning)]",
        ].join(" "),
        success: [
          "bg-[var(--color-status-success-subtle)]",
          "border-[var(--color-green-200)]",
          "[&_[data-alert-title]]:text-[var(--color-status-success-subtle-foreground)]",
          "[&_[data-alert-desc]]:text-[var(--color-green-800)]",
          "[&_svg]:text-[var(--color-icon-success)]",
        ].join(" "),
        info: [
          "bg-[var(--color-status-info-subtle)]",
          "border-[var(--color-blue-200)]",
          "[&_[data-alert-title]]:text-[var(--color-status-info-subtle-foreground)]",
          "[&_[data-alert-desc]]:text-[var(--color-blue-800)]",
          "[&_svg]:text-[var(--color-status-info-subtle-foreground)]",
        ].join(" "),
        ai: [
          "bg-[var(--color-surface-default)]",
          "border-[var(--color-border-ai)]",
          "[&_[data-alert-title]]:text-[var(--color-surface-default-foreground)]",
          "[&_[data-alert-desc]]:text-[var(--color-text-secondary)]",
          "[&_svg]:text-[var(--color-surface-default-foreground)]",
          "[&_[data-slot=alert-icon]_svg]:text-[var(--color-icon-brand)]",
        ].join(" "),
      },
      // size: default = stacked title + description; sm = one compact line (icon · title · action)
      // for page headers and toolbars.
      size: {
        default: "flex-col p-[var(--spacing-component-lg)] gap-[var(--spacing-component-sm)]",
        sm: "flex-row items-center px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] gap-[var(--spacing-component-md)]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    /** Optional icon (Phosphor, sized h-4 w-4 here), placed beside the content and coloured by variant */
    icon?: React.ReactNode
  }
>(({ className, variant, size, icon, children, ...props }, ref) => {
  const iconSlot = icon ? (
    <span data-slot="alert-icon" aria-hidden="true"
      className={cn("inline-flex shrink-0 [&_svg]:h-4 [&_svg]:w-4", size !== "sm" && "mt-[var(--spacing-component-xxs)]")}>
      {icon}
    </span>
  ) : null
  return (
    <div
      ref={ref}
      role="alert"
      data-size={size ?? "default"}
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {icon && size !== "sm" ? (
        <div className="flex w-full items-start gap-[var(--spacing-component-md)]">
          {iconSlot}
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">{children}</div>
        </div>
      ) : (
        <>{iconSlot}{children}</>
      )}
    </div>
  )
})
Alert.displayName = "Alert"

// ─── AlertTitle ───────────────────────────────────────────────────────────────
// Text: text-label-md
// Color: driven by parent Alert variant via [data-alert-title] selector

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-alert-title=""
    className={cn("text-label-md", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

// ─── AlertDescription ─────────────────────────────────────────────────────────
// Text: text-body-sm
// Color: driven by parent Alert variant via [data-alert-desc] selector

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-alert-desc=""
    className={cn("text-body-sm", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
