import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Card shell ───────────────────────────────────────────────────────────────
// Tokens:
//   fill       = color/surface/default    → var(--color-surface-default)    #ffffff  (flat container, not floating)
//   stroke     = color/border/default     → var(--color-border-default)     #e3e3e3  (default)
//              = color/border/strong      → use className override for Border variant
//   radius     = radius/lg               → var(--radius-lg)                 8px
//   padding    = spacing/component/lg    → var(--spacing-component-lg)      16px (all sides)
//   gap        = spacing/component/lg    → var(--spacing-component-lg)      16px (between sections)
//   (16px is the data/default density; pass p-[var(--spacing-component-xl)] for prose/feature cards)
//
//   shadow     = shadow/surface          → var(--shadow-surface)            (Enpath D4: white + shadow, from En UI)
// Padding lives HERE — not repeated on CardHeader / CardContent / CardFooter.

// size: "default" | "compact". Compact is the dense-widget card: padding spacing/component/md,
// gap spacing/component/sm, CardTitle text-heading-xs.
type CardSize = "default" | "compact"
const CardSizeContext = React.createContext<CardSize>("default")

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: CardSize }
>(({ className, size = "default", ...props }, ref) => (
  <CardSizeContext.Provider value={size}>
    <div
      ref={ref}
      data-size={size}
      className={cn(
        "flex flex-col",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-default)]",
        "shadow-[var(--shadow-surface)]",
        size === "compact" ? "p-[var(--spacing-component-md)]" : "p-[var(--spacing-component-lg)]",
        size === "compact" ? "gap-[var(--spacing-component-sm)]" : "gap-[var(--spacing-component-lg)]",
        className
      )}
      {...props}
    />
  </CardSizeContext.Provider>
))
Card.displayName = "Card"

// ─── CardHeader ───────────────────────────────────────────────────────────────
// Tokens:
//   gap = spacing/component/xs → var(--spacing-component-xs) 4px
// No padding — Card shell owns all padding.
// tone="tinted" (2026-09-30): the header becomes a full-width band on color/surface/header with a
// color/border/default line under it; it cancels the Card's padding (lg, compact md) so it reaches the
// card's edges, and puts the same side padding back inside. For a Card that groups a list.

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tone?: "default" | "tinted" }
>(({ className, tone = "default", ...props }, ref) => {
  const size = React.useContext(CardSizeContext)
  return (
  <div
    ref={ref}
    data-tone={tone}
    className={cn(
      "flex flex-col gap-[var(--spacing-component-xs)]",
      tone === "tinted" && "rounded-t-[var(--radius-lg)] border-b border-[var(--color-border-default)] bg-[var(--color-surface-header)]",
      tone === "tinted" && (size === "compact"
        ? "-mx-[var(--spacing-component-md)] -mt-[var(--spacing-component-md)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]"
        : "-mx-[var(--spacing-component-lg)] -mt-[var(--spacing-component-lg)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-md)]"),
      className
    )}
    {...props}
  />
  )
})
CardHeader.displayName = "CardHeader"

// ─── CardTitle ────────────────────────────────────────────────────────────────
// Text: text-heading-sm (compact card: text-heading-xs)
// Token: color/surface/default/foreground → var(--color-surface-default-foreground) #18181b

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const size = React.useContext(CardSizeContext)
  return (
  <div
    ref={ref}
    className={cn(
      size === "compact" ? "text-heading-xs" : "text-heading-sm",
      "text-[var(--color-surface-default-foreground)]",
      className
    )}
    {...props}
  />
)
})
CardTitle.displayName = "CardTitle"

// ─── CardDescription ─────────────────────────────────────────────────────────
// Text: text-body-sm
// Token: color/text/secondary → var(--color-text-secondary) #52525b

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-body-sm text-[var(--color-text-secondary)]",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ─── CardContent ─────────────────────────────────────────────────────────────
// Default: V AUTO-LAYOUT, gap = spacing/component/lg (16px)
// No padding — Card shell owns all padding.

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-[var(--spacing-component-lg)]",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

// ─── CardFooter ───────────────────────────────────────────────────────────────
// H AUTO-LAYOUT, gap = spacing/component/sm (8px)
// No padding — Card shell owns all padding.

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-[var(--spacing-component-sm)]",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
