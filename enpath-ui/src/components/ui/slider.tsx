"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

// ─── Slider ───────────────────────────────────────────────────────────────────
// Tokens (from Slider.md — verified against Figma 67:9199):
//   Track:  color/surface/muted  · h-2 (8px) · radius/full
//   Range:  color/brand/primary  · h-2 (8px) · radius/full
//   Thumb:  color/background/default fill
//           color/brand/primary border 2px INSIDE (Default / Disabled)
//           color/ring border 2px OUTSIDE (Focus)
//   Disabled: opacity/disabled (0.6) on entire component

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
    >
      <SliderPrimitive.Range
        className="absolute h-full rounded-full bg-[var(--color-brand-primary)]"
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        // Shape — 20×20px circle (Figma confirmed)
        "relative block h-5 w-5 rounded-full",
        // Touch hit area — invisible, ≥ 44×44 on coarse pointers (height/target/touch). Visual size unchanged.
        "after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
        "pointer-coarse:after:min-h-[var(--height-target-touch)] pointer-coarse:after:min-w-[max(100%,var(--height-target-touch))]",
        // Fill + default border: color/brand/primary 2px INSIDE
        "bg-[var(--color-background-default)]",
        "border-2 border-[var(--color-brand-primary)]",
        // Focus ring: color/ring 2px OUTSIDE (no offset)
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
        // Disabled: opacity/disabled on component (set on root via disabled:)
        "disabled:pointer-events-none",
        "disabled:opacity-[calc(var(--opacity-disabled)/100)]",
        "transition-colors",
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
