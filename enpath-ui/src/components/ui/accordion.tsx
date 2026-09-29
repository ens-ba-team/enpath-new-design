"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { CaretDownIcon } from "@phosphor-icons/react/ssr"

import { cn } from "@/lib/utils"

// size: "default" | "compact". Compact is for accordions inside a card or panel: tighter
// trigger padding (spacing/component/sm), body text style, no border under the last item.
type AccordionSize = "default" | "compact"
const AccordionSizeContext = React.createContext<AccordionSize>("default")

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & { size?: AccordionSize }
>(({ size = "default", ...props }, ref) => (
  <AccordionSizeContext.Provider value={size}>
    <AccordionPrimitive.Root ref={ref} data-size={size} {...props} />
  </AccordionSizeContext.Provider>
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const size = React.useContext(AccordionSizeContext)
  return (
    <AccordionPrimitive.Item
      ref={ref}
      // Stroke: color/border/default 1px — bottom border acts as separator between items;
      // compact drops it under the last item (the card or panel edge closes the list)
      className={cn("border-b border-[var(--color-border-default)]", size === "compact" && "last:border-b-0", className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const size = React.useContext(AccordionSizeContext)
  return (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Layout — no horizontal padding, full-width, label left / chevron right
        "flex flex-1 items-center justify-between",
        // Spacing — padding T/B: spacing/component/lg (compact: sm); gap: spacing/component/sm
        size === "compact" ? "py-[var(--spacing-component-sm)]" : "py-[var(--spacing-component-lg)]",
        "gap-[var(--spacing-component-sm)]",
        // Typography — text-heading-xs (compact: text-body-sm), default foreground
        size === "compact" ? "text-body-sm" : "text-heading-xs",
        "text-[var(--color-surface-default-foreground)]",
        // Transition
        "transition-all",
        // Focus ring — color/ring 2px outside
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2",
        // Disabled — color/text/disabled on label + chevron
        "disabled:text-[var(--color-text-disabled)] disabled:cursor-not-allowed",
        // Chevron rotation when open
        "[&[data-state=open]_svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <CaretDownIcon
        aria-hidden="true"
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const size = React.useContext(AccordionSizeContext)
  return (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-body-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* padding bottom: spacing/component/lg (compact: md) · no top padding per spec */}
    {/* text color: color/text/secondary */}
    <div className={cn(
      size === "compact" ? "pb-[var(--spacing-component-md)]" : "pb-[var(--spacing-component-lg)]",
      "pt-0",
      "text-[var(--color-text-secondary)]",
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
