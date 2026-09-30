"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Progress ─────────────────────────────────────────────────────────────────
// Tokens (from progress.meta.json):
//
// Track:  color/background/muted · radius/full
// Fill (Loading/Indeterminate): color/brand/primary · radius/full
// Fill (Complete, value=100):   color/status/success · radius/full
//
// Sizes:
//   SM → h-1 (4px)   MD → h-2 (8px, default)   LG → h-3 (12px)
//
// tone="success": fill color/status/success at every value, track color/background/default —
// for progress shown on a success surface (e.g. the Setup progress Alert).
//
// shape="ring" (2026-09-30, from the Action plan): a 36px circle with a short label inside (children,
// e.g. "1/2", text-label-sm). Track color/border/default; fill color/icon/default (neutral); complete
// (value 100) or tone="success" → color/icon/success. role="progressbar"; pass an aria-label that says
// the numbers in words ("Delivery: 1 of 2 done").
//
// State in code is driven by value prop only:
//   value 0–99 → Loading    value=100 → Complete    value=null → Indeterminate
// No separate state prop in code.

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-[var(--color-background-muted)]",
  {
    variants: {
      size: {
        sm: "h-1",   // 4px
        md: "h-2",   // 8px — default
        lg: "h-3",   // 12px
      },
      tone: {
        default: "",
        success: "bg-[var(--color-background-default)]",
      },
    },
    defaultVariants: { size: "md", tone: "default" },
  }
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  /** bar (default) or ring: a small circle with `children` as its label */
  shape?: "bar" | "ring"
}

/** 36px ring: radius 15, stroke 3. */
function ProgressRing({ value, tone, className, children, ...props }: Omit<ProgressProps, "shape" | "size">) {
  const r = 15
  const c = 2 * Math.PI * r
  const share = Math.max(0, Math.min(100, value ?? 0)) / 100
  const complete = value === 100 || tone === "success"
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value ?? undefined}
      data-shape="ring" className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" className="stroke-[var(--color-border-default)]" />
        {share > 0 && (
          <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${c * share} ${c}`}
            className={complete ? "stroke-[var(--color-icon-success)]" : "stroke-[var(--color-icon-default)]"} />
        )}
      </svg>
      {children != null && <span className="absolute text-label-sm text-[var(--color-background-default-foreground)]">{children}</span>}
    </div>
  )
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, tone, shape = "bar", children, ...props }, ref) => {
  if (shape === "ring") return <ProgressRing value={value} tone={tone} className={className} {...props}>{children}</ProgressRing>;
  const isComplete = value === 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-tone={tone ?? "default"}
      className={cn(progressVariants({ size, tone }), className)}
      {...props}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all",
          // tone success or Complete → color/status/success · otherwise color/brand/primary
          isComplete || tone === "success"
            ? "bg-[var(--color-status-success)]"
            : "bg-[var(--color-brand-primary)]"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
