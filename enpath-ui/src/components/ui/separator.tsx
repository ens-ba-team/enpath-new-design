"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

// tone: default = color/border/default · subtle = color/border/subtle (between closely related
// rows inside one block) · sidebar = color/sidebar/border (on the app background, in the sidebar).
const toneFill = {
  default: "bg-[var(--color-border-default)]",
  subtle: "bg-[var(--color-border-subtle)]",
  sidebar: "bg-[var(--color-sidebar-border)]",
} as const

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & { tone?: keyof typeof toneFill }
>(
  (
    { className, orientation = "horizontal", decorative = true, tone = "default", ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      data-tone={tone}
      className={cn(
        // fill: by tone (both orientations)
        "shrink-0",
        toneFill[tone],
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
