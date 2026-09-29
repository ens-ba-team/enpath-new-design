import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CaretRightIcon } from "@phosphor-icons/react/ssr"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"

// ─── Item ─────────────────────────────────────────────────────────────────────
// Custom component — no shadcn base.
// Tokens (from item.meta.json):
//
// Container — per Variant:
//   Default:  transparent · no stroke · radius/lg
//   Outline:  color/surface/default · color/border/default 1px · radius/lg
//   Muted:    color/surface/muted · no stroke · radius/lg
//
// Container — padding + gap per Size:
//   Default: spacing/component/md (12px) all sides + gap
//   Sm:      spacing/component/sm  (8px)  all sides + gap
//   Xs:      spacing/component/xs-plus (6px) all sides + gap
//
// Alignment:
//   items-start: Type=Icon (16px icon vs 37px content) · Type=Link (chevron anchors to title)
//   items-center: Default · Avatar · Image · Header
//
// Text:
//   title:       color/surface/default/foreground · text-heading-xs
//   description: color/surface/muted/foreground · text-body-sm (size sm / xs: text-body-xs, a meta line)
//   content gap: spacing/component/xxs (2px)
//
// Selectable (onSelect set) — renders a <button>, for single-select lists (master–detail):
//   hover:    item/hover/bg
//   selected: item/selected/bg + 1px inset item/selected/border · title item/selected/fg + font-semibold
//   a11y:     aria-current="true" on the selected row · focus ring color/border/focus

// ─── Variants ─────────────────────────────────────────────────────────────────

const itemVariants = cva(
  "flex w-full rounded-[var(--radius-lg)]",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-[var(--color-surface-default)] border border-[var(--color-border-default)]",
        muted: "bg-[var(--color-surface-muted)]",
      },
      size: {
        default: "p-[var(--spacing-component-md)] gap-[var(--spacing-component-md)]",
        sm: "p-[var(--spacing-component-sm)] gap-[var(--spacing-component-sm)]",
        xs: "p-[var(--spacing-component-xs-plus)] gap-[var(--spacing-component-xs-plus)]",
      },
      // Side padding. default = the size's own padding; md = spacing/component/md on the left and
      // right, so a list's rows line up with the search field and headings above them.
      inset: {
        default: "",
        md: "px-[var(--spacing-component-md)]",
      },
    },
    defaultVariants: { variant: "default", size: "default", inset: "default" },
  }
)

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof itemVariants> {
  /** Leading type — controls which leading element appears */
  type?: "default" | "icon" | "avatar" | "image" | "header" | "link"
  /** Primary label */
  title: React.ReactNode
  /** Supporting text — role, date, status, count */
  description?: React.ReactNode
  /** Type=Icon: icon element (h-4 w-4 recommended) */
  icon?: React.ReactNode
  /** Type=Avatar: avatar src for AvatarImage */
  avatarSrc?: string
  /** Type=Avatar: fallback initials */
  avatarFallback?: string
  /** Type=Image: image src for 32×32 thumbnail */
  imageSrc?: string
  imageAlt?: string
  /** Type=Header: cover image src */
  headerSrc?: string
  headerAlt?: string
  /** Action button — conditionally rendered. Hide for Type=Link and Type=Header. */
  action?: React.ReactNode
  /** Type=Link: wraps the row in an <a> — the whole row becomes the target */
  href?: string
  /** Makes the row a selectable <button> (single-select list). Not with Type=Link/Header. */
  onSelect?: () => void
  /** The selected row of a selectable list */
  selected?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant,
      size,
      inset,
      type = "default",
      title,
      description,
      icon,
      avatarSrc,
      avatarFallback,
      imageSrc,
      imageAlt,
      headerSrc,
      headerAlt,
      action,
      href,
      onSelect,
      selected = false,
      ...props
    },
    ref
  ) => {
    // Alignment: Icon and Link use top-align (16px element vs taller content)
    const isTopAligned = type === "icon" || type === "link"
    // Header uses vertical layout
    const isVertical = type === "header"

    // ── Content block (title + description) ──
    const contentBlock = (
      <div className="flex flex-col gap-[var(--spacing-component-xxs)] flex-1 min-w-0">
        <span className={cn(
          "text-heading-xs",
          selected ? "font-semibold text-[var(--item-selected-fg)]" : "text-[var(--color-surface-default-foreground)]"
        )}>
          {title}
        </span>
        {description && (
          <span className={cn(size === "sm" || size === "xs" ? "text-body-xs" : "text-body-sm", "text-[var(--color-surface-muted-foreground)]")}>
            {description}
          </span>
        )}
      </div>
    )

    // ── Leading element ──
    const leadingElement = (() => {
      if (type === "icon" && icon) {
        return (
          <span className="shrink-0 text-[var(--color-surface-default-foreground)]">
            {icon}
          </span>
        )
      }
      if (type === "avatar") {
        return (
          <Avatar size="default" className="shrink-0" src={avatarSrc} name={avatarFallback} fallback={avatarFallback ?? "?"} />
        )
      }
      if (type === "image") {
        return (
          <div className="h-8 w-8 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-muted)]">
            {imageSrc
              ? <img src={imageSrc} alt={imageAlt ?? ""} className="h-full w-full object-cover" />
              : null}
          </div>
        )
      }
      return null
    })()

    // ── Trailing element (action or chevron) ──
    const trailingElement = (() => {
      if (type === "link") {
        return (
          <CaretRightIcon
            className="h-4 w-4 shrink-0 text-[var(--color-surface-default-foreground)]"
            aria-hidden="true"
          />
        )
      }
      if (type !== "header" && action) {
        return <span className="shrink-0">{action}</span>
      }
      return null
    })()

    // ── Header type — vertical layout ──
    if (type === "header") {
      return (
        <div
          ref={ref}
          className={cn(
            itemVariants({ variant, size, inset }),
            "flex-col p-0",
            className
          )}
          {...props}
        >
          {/* Cover image — bleeds to container edge */}
          <div className="w-full bg-[var(--color-surface-muted)] overflow-hidden rounded-t-[var(--radius-lg)]"
            style={{ height: size === "xs" ? "72px" : size === "sm" ? "96px" : "120px" }}
          >
            {headerSrc && (
              <img src={headerSrc} alt={headerAlt ?? ""} className="w-full h-full object-cover" />
            )}
          </div>
          {/* Content row — padding applied here, not on container */}
          <div className={cn(
            "flex flex-1",
            size === "sm" ? "p-[var(--spacing-component-sm)]" : size === "xs" ? "p-[var(--spacing-component-xs-plus)]" : "p-[var(--spacing-component-md)]"
          )}>
            {contentBlock}
          </div>
        </div>
      )
    }

    // ── Link type — wrap in <a> ──
    const rowContent = (
      <>
        {leadingElement}
        {contentBlock}
        {trailingElement}
      </>
    )

    if (type === "link" && href !== undefined) {
      return (
        <a
          href={href}
          className={cn(
            itemVariants({ variant, size, inset }),
            isTopAligned ? "items-start" : "items-center",
            "hover:bg-[var(--color-surface-accent)] transition-colors no-underline",
            className
          )}
        >
          {rowContent}
        </a>
      )
    }

    // ── Selectable — the whole row is one button ──
    if (onSelect) {
      return (
        <button
          type="button"
          onClick={onSelect}
          aria-current={selected ? "true" : undefined}
          className={cn(
            itemVariants({ variant, size, inset }),
            isTopAligned ? "items-start" : "items-center",
            "text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
            selected
              ? "bg-[var(--item-selected-bg)] shadow-[inset_0_0_0_1px_var(--item-selected-border)]"
              : "hover:bg-[var(--item-hover-bg)]",
            className
          )}
        >
          {rowContent}
        </button>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          itemVariants({ variant, size, inset }),
          isTopAligned ? "items-start" : "items-center",
          className
        )}
        {...props}
      >
        {rowContent}
      </div>
    )
  }
)
Item.displayName = "Item"

export { Item }
