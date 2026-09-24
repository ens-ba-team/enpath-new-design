import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleNotchIcon } from "@phosphor-icons/react/ssr"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // focus/destructive = brand/destructive glow @40%, 3px spread — replaces color/ring
// All other variants use color/ring (blue, 2px) via focus-visible:ring-*
"inline-flex items-center justify-center gap-[var(--button-size-button-spacing)] whitespace-nowrap rounded-[var(--button-size-button-radius-2)] text-sm leading-none font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-[calc(var(--opacity-disabled)/100)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-primary-bg-bg)] text-[var(--button-primary-fg-fg)] hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--button-primary-bg-active)]",
        destructive:
          // focus/destructive: red @ 40% opacity, 3px spread (Figma effect style)
          // ring-0 cancels the base ring-2; explicit box-shadow gives correct 3px spread
          "bg-[var(--button-destructive-bg-bg)] text-[var(--button-destructive-fg-fg)] hover:bg-[var(--button-destructive-bg-hover)] active:bg-[var(--button-destructive-bg-active)] focus-visible:ring-0 focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-brand-destructive)_40%,transparent)]",
        outline:
          "border border-[var(--button-outline-border-default)] bg-[var(--button-outline-bg-bg)] text-[var(--button-outline-fg-fg)] hover:bg-[var(--button-outline-bg-hover)] hover:border-[var(--button-outline-border-hover)] active:bg-[var(--button-outline-bg-active)] active:border-[var(--button-outline-border-active)] focus-visible:border-[var(--button-outline-border-focus)] disabled:border-[var(--button-outline-border-disabled)]",
        secondary:
          "bg-[var(--button-secondary-bg-bg)] text-[var(--button-secondary-fg-fg)] hover:bg-[var(--button-secondary-bg-hover)] active:bg-[var(--button-secondary-bg-active)]",
        ghost:
          "bg-transparent text-[var(--button-ghost-fg-fg)] hover:bg-[var(--button-ghost-bg-hover)] active:bg-[var(--button-ghost-bg-active)]",
        link:
          "text-[var(--button-link-fg-default)] underline-offset-4 hover:underline hover:text-[var(--button-link-fg-hover)] active:text-[var(--button-link-fg-active)] disabled:text-[var(--button-link-fg-disabled)]",
      },
      size: {
        // Heights: height/control-touch/* below 640px, height/control/* from sm up (En UI touch/pointer ladders).
        // xs: 28px touch / 24px pointer. Dense rows and toolbars only.
        xs:
          "h-[var(--height-control-touch-xs)] sm:h-[var(--height-control-xs)] px-[var(--button-size-button-padding-xsmall)] text-xs",
        default:
          "h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)] px-[var(--button-size-button-padding-default)]",
        sm:
          "h-[var(--height-control-touch-sm)] sm:h-[var(--height-control-sm)] px-[var(--button-size-button-padding-small)] text-xs",
        lg:
          "h-[var(--height-control-touch-lg)] sm:h-[var(--height-control-lg)] rounded-[var(--button-size-button-radius-1)] px-[var(--button-size-button-padding-default)]",
        icon:
          "h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)] w-[var(--height-control-touch-md)] sm:w-[var(--height-control-md)]",
        "icon-sm":
          "h-[var(--height-control-touch-sm)] sm:h-[var(--height-control-sm)] w-[var(--height-control-touch-sm)] sm:w-[var(--height-control-sm)]",
        "icon-lg":
          "h-[var(--height-control-touch-lg)] sm:h-[var(--height-control-lg)] w-[var(--height-control-touch-lg)] sm:w-[var(--height-control-lg)] rounded-[var(--button-size-button-radius-1)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /**
   * In-progress action (from En UI). Shows a spinner before the label, keeps the
   * label visible, disables the button and sets aria-busy. Ignored with asChild.
   */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Slot>
      )
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <CircleNotchIcon className="animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
