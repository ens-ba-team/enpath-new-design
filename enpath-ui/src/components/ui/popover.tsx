"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// ─── Popover ──────────────────────────────────────────────────────────────────
// shadcn Popover on Radix (2026-10-15). Same primitive family as Dialog / Sheet / Select, so a popover
// opened inside a modal stays clickable and keeps focus (Radix layers dismiss and focus together).
// First use: the Combobox list.
// Tokens:
//   fill    = color/surface/overlay  · text = color/surface/overlay/foreground
//   stroke  = color/border/default   · radius = radius/lg
//   shadow  = shadow/overlay         · z     = z-index/modal (above a Dialog or Sheet)
//   padding = spacing/component/md   (a list inside sets p-0 on the content)

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[var(--z-index-modal)] outline-none",
        "rounded-[var(--radius-lg)] border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-overlay)] text-[var(--color-surface-overlay-foreground)]",
        "shadow-[var(--shadow-overlay)]",
        "p-[var(--spacing-component-md)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent }
