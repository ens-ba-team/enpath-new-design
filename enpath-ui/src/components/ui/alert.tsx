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
// Layout: flex-col (flat, no icon). For icon layout use explicit composition in
// the story: flex-row wrapper > icon + flex-col content (gap spacing/component/xxs).
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
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    data-size={size ?? "default"}
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  />
))
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
