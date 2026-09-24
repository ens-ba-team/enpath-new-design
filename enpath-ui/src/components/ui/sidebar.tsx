"use client"

import * as React from "react"
import { CaretLineLeftIcon, CaretLineRightIcon } from "@phosphor-icons/react/ssr"
import { cn } from "@/lib/utils"

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// Tokens (from Sidebar.md — Figma 95:18202):
//
// Container:
//   Default/Inset fill:  color/sidebar/background · border: color/sidebar/border (right only)
//   Floating fill:       none — transparent on color/background/app · no border · no shadow · radius/panel
//
// Header:
//   fill: none (inherits the panel's color/sidebar/background) · pad: sm T/B · md L/R · gap: lg
//   Logo: 28×28px FIXED — NOT token-bound (branding slot)
//   title: color/sidebar/foreground · caption: color/text/secondary (was sidebar/foreground at 70% — failed 4.5:1 on the glow)
//
// nav item (sidebar-menu-1):
//   Default: transparent · foreground text/icon
//   Hover:   sidebar/accent fill · accent/foreground
//   Active:  sidebar/active fill (white) · active/border (1px inset) · active/foreground SemiBold (weight is the
//            non-colour cue — the white chip is only 1.05:1 against the app background)
//   radius/md · pad L/R: sm · gap: sm
//
// sub-item (_sidebar-menu-2):
//   same fill states · left-pad: 2xl for indent
//
// badge: brand/primary fill · brand/primary/foreground · radius/full

// ─── Context ──────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
  /** Set collapse from outside, e.g. collapse when a right-hand panel opens */
  setCollapsed: (c: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
  setCollapsed: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  // Cmd+B / Ctrl+B keyboard shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c), setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─── Sidebar container ────────────────────────────────────────────────────────

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  type?: "default" | "floating" | "inset"
  collapsible?: "none" | "icon"
}

export function Sidebar({
  type = "default",
  collapsible = "icon",
  className,
  children,
  ...props
}: SidebarProps) {
  const { collapsed } = useSidebar()
  const isCollapsed = collapsible !== "none" && collapsed

  return (
    <aside
      aria-label="Sidebar navigation"
      data-collapsed={isCollapsed}
      className={cn(
        "flex flex-col h-full transition-all duration-200",
        // Width
        isCollapsed ? "w-14" : "w-60",
        // Type tokens
        type === "floating"
          ? [
              // No fill, no border, no shadow — sits directly on color/background/app.
              // radius/panel still shapes the selected-item and focus areas at the panel edge.
              "rounded-[var(--radius-panel)]",
            ]
          : [
              "bg-[var(--color-sidebar-background)]",
              "border-r border-[var(--color-sidebar-border)]",
            ],
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        "gap-[var(--spacing-component-lg)]",
        // No fill of its own — the panel provides color/sidebar/background. A square fill here
        // painted over the floating panel's rounded top corners and hid its border.
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Logo slot (branding — NOT token-bound) ───────────────────────────────────

export function SidebarLogo({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0",
        "h-7 w-7", // 28×28px FIXED per spec
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Header text block ────────────────────────────────────────────────────────

export function SidebarBrand({
  title,
  caption,
  className,
}: {
  title: string
  caption?: string
  className?: string
}) {
  const { collapsed } = useSidebar()
  if (collapsed) return null

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xxs)] min-w-0", className)}>
      <span className="text-base font-semibold truncate text-[var(--color-sidebar-foreground)]">
        {title}
      </span>
      {caption && (
        <span className="text-xs truncate text-[var(--color-text-secondary)]">
          {caption}
        </span>
      )}
    </div>
  )
}

// ─── Content area ─────────────────────────────────────────────────────────────

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-y-auto",
        "gap-[var(--spacing-component-md)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Group ────────────────────────────────────────────────────────────────────

export function SidebarGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col",
        "p-[var(--spacing-component-md)]",
        "gap-[var(--spacing-component-sm)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Group label (_sidebar-group-label) ──────────────────────────────────────

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar()
  if (collapsed) return null

  return (
    <div
      className={cn(
        "text-xs font-semibold uppercase tracking-wide",
        "text-[var(--color-text-secondary)]",
        "px-[var(--spacing-component-sm)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Nav item (sidebar-menu-1) ────────────────────────────────────────────────

interface SidebarMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode
  label: string
  active?: boolean
  badge?: string | number
  disabled?: boolean
  /**
   * Why the destination is unavailable (from En UI, rule R-ENP-10). Shown on hover
   * and announced to screen readers. Use with `disabled`.
   */
  disabledReason?: string
}

export function SidebarMenuItem({
  icon,
  label,
  active,
  badge,
  disabled,
  disabledReason,
  className,
  onClick,
  title,
  ...props
}: SidebarMenuItemProps) {
  const { collapsed } = useSidebar()
  const reasonId = React.useId()

  return (
    <>
    <a
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      // R-ENP-08: collapsed item keeps its name
      aria-label={collapsed ? (badge ? `${label}, ${badge}` : label) : undefined}
      aria-describedby={disabledReason ? reasonId : undefined}
      // R-ENP-09: disabled destination doesn't navigate and isn't in the tab order
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={(e) => { if (disabled) { e.preventDefault(); return } onClick?.(e) }}
      title={title ?? ([collapsed ? label : undefined, disabledReason].filter(Boolean).join(": ") || undefined)}
      className={cn(
        "flex items-center gap-[var(--spacing-component-sm)]",
        "rounded-[var(--radius-md)]",
        "px-[var(--spacing-component-sm)] h-9",
        "text-sm font-medium outline-none transition-colors",
        "text-[var(--color-sidebar-foreground)]",
        !active && !disabled && "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]",
        active && "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-active-foreground)] font-semibold shadow-[inset_0_0_0_1px_var(--color-sidebar-active-border)]",
        // Keep pointer events when there is a reason, so the hover title can show
        disabled && "cursor-not-allowed opacity-[calc(var(--opacity-disabled)/100)]",
        disabled && !disabledReason && "pointer-events-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)]",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="relative h-4 w-4 shrink-0 flex items-center justify-center">
          {icon}
          {/* Collapsed: the count is hidden, so a dot on the icon keeps the signal (label carries the count) */}
          {collapsed && badge && (
            <span aria-hidden="true" className="absolute -right-1 -top-1 h-2 w-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)]" />
          )}
        </span>
      )}
      {!collapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!collapsed && badge && (
        <SidebarBadge>{badge}</SidebarBadge>
      )}
    </a>
    {disabledReason && <span className="sr-only" id={reasonId}>{disabledReason}</span>}
    </>
  )
}

// ─── Sub-item (_sidebar-menu-2) ───────────────────────────────────────────────

interface SidebarSubItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
  active?: boolean
  disabled?: boolean
  /** Why the destination is unavailable (from En UI, rule R-ENP-10). Use with `disabled`. */
  disabledReason?: string
}

export function SidebarSubItem({
  label,
  active,
  disabled,
  disabledReason,
  className,
  onClick,
  title,
  ...props
}: SidebarSubItemProps) {
  const { collapsed } = useSidebar()
  const reasonId = React.useId()
  if (collapsed) return null

  return (
    <>
    <a
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      aria-describedby={disabledReason ? reasonId : undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={(e) => { if (disabled) { e.preventDefault(); return } onClick?.(e) }}
      title={title ?? disabledReason}
      className={cn(
        "flex items-center h-8",
        "rounded-[var(--radius-md)]",
        // Left indent: spacing/component/2xl (32px)
        "pl-[var(--spacing-component-2xl)] pr-[var(--spacing-component-sm)]",
        "text-sm outline-none transition-colors",
        "text-[var(--color-sidebar-foreground)]",
        !active && !disabled && "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]",
        active && "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-active-foreground)] font-semibold shadow-[inset_0_0_0_1px_var(--color-sidebar-active-border)]",
        disabled && "cursor-not-allowed opacity-[calc(var(--opacity-disabled)/100)]",
        disabled && !disabledReason && "pointer-events-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)]",
        className
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
    </a>
    {disabledReason && <span className="sr-only" id={reasonId}>{disabledReason}</span>}
    </>
  )
}

// ─── Badge (_sidebar-badge) ───────────────────────────────────────────────────

export function SidebarBadge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[18px] h-[18px]",
        "rounded-[var(--radius-full)]",
        "px-[var(--spacing-component-xxs)]",
        "text-xs font-medium leading-none",
        "bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        "border-t border-[var(--color-sidebar-border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Toggle button ────────────────────────────────────────────────────────────

// Default icon switches with state: CaretLineLeft (open → "collapse") · CaretLineRight (collapsed → "expand").
// Pass children only to override the icon.
export function SidebarToggle({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, collapsed } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      title={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
      className={cn(
        "inline-flex items-center justify-center h-8 w-8",
        "rounded-[var(--radius-md)]",
        "text-[var(--color-sidebar-foreground)]",
        "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]",
        "transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)]",
        className
      )}
      {...props}
    >
      {children ?? (collapsed
        ? <CaretLineRightIcon className="h-4 w-4" aria-hidden="true" />
        : <CaretLineLeftIcon className="h-4 w-4" aria-hidden="true" />)}
    </button>
  )
}
