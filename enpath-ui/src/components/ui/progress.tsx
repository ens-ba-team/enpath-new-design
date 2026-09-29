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
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, tone, ...props }, ref) => {
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
