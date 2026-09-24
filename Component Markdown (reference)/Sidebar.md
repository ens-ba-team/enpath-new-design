<!-- GENERATED from Machine Readable/artifacts/components/sidebar.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Sidebar

A composable, themeable application sidebar for primary navigation. Built on shadcn's Sidebar primitive, which manages collapsible state, mobile overlay, and keyboard shortcut via the `SidebarProvider` context.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `sidebar` | `95:18202` | 6 | Main panel container — Type × State |
| `sidebar-menu-1` | `95:15354` | 6 | Primary nav item with icon — State × Type |
| `_sidebar-menu-2` | `95:15549` | 3 | Sub-item (indented, text-only) — State |
| `_sidebar-group-label` | `95:14510` | 1 | Group section label |
| `_sidebar-badge` | `95:14511` | 1 | Notification badge for nav items |

---

## Variant Matrix

### `sidebar` — `Type × State`

| Property | Options | Default |
|---|---|---|
| `Type` | `Default`, `Floating`, `Inset` | `Default` |
| `State` | `Expanded`, `Collapsed` | `Expanded` |
| `menuState` | `Default`, `Hover`, `Active`, `Disabled`, `Disabled with reason` | `Default` |
| `menuType` | `Expand`, `Collapse` | `Expand` |

`Type(3) × State(2) = 6 variants`

### `sidebar-menu-1` — `State × Type`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Hover`, `Active` | `Default` |
| `Type` | `Expand`, `Collapse` | `Expand` |

`State(3) × Type(2) = 6 variants`

> `Type=Expand` — full row: icon + label + badge + trailing chevron.
> `Type=Collapse` — icon-only: for use when the sidebar is in collapsed/icon mode.

### `_sidebar-menu-2` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Hover`, `Active` | `Default` |

`State(3) = 3 variants`

### `_sidebar-group-label` and `_sidebar-badge`

Single-variant sub-components. No variant props.

---

## Structure

### `sidebar`

```
sidebar                         — VERTICAL AUTO LAYOUT
                                  fill: color/sidebar/background
                                  stroke: color/sidebar/border INSIDE (mixed weight — edge only)
                                  Type=Floating: radius/lg, no stroke
  ├─ header                     — FRAME, HORIZONTAL
  │    │                          fill: color/sidebar/background
  │    │                          padT/padB: spacing/component/sm
  │    │                          padL/padR: spacing/component/md
  │    │                          gap: spacing/component/lg
  │    ├─ Logo                  — INSTANCE, 28×28px FIXED
  │    │                          ⚠️ Branding slot — fill is NOT token-bound
  │    └─ text-block            — FRAME, VERTICAL, gap: spacing/component/xxs
  │         ├─ title            — TEXT
  │         └─ caption          — TEXT
  └─ content                    — FRAME, VERTICAL
                                  padding: 0 on all sides
                                  gap: spacing/component/md
       └─ group-*               — FRAME, VERTICAL
                                  pad all sides: spacing/component/md
                                  gap: spacing/component/sm
            ├─ group-label-slot — INSTANCE (_sidebar-group-label)
            ├─ nav-item-*       — INSTANCE (sidebar-menu-1)
            └─ sub-items        — INSTANCE (_sidebar-menu-2)
```

### `sidebar-menu-1`

```
sidebar-menu-1                  — HORIZONTAL AUTO LAYOUT
                                  radius: radius/md
                                  padL/padR: spacing/component/sm
                                  gap: spacing/component/sm
                                  fill: none (Default) / color/sidebar/accent (Hover) / color/sidebar/active + color/sidebar/active/border (Active)
  ├─ leading / icon             — INSTANCE (Icon Placeholder, stroke-based)
  │    └─ Icon                  — VECTOR, stroke (see token table)
  ├─ label                      — TEXT (fill: see token table)
  ├─ badge                      — INSTANCE (_sidebar-badge) — Type=Expand only
  └─ trailing                   — INSTANCE (Icon Placeholder) — Type=Expand only
       └─ Icon                  — VECTOR, stroke (matches leading)
```

> `Type=Collapse` shows only the `leading`/`icon` slot — label, badge, and trailing are hidden.

### `_sidebar-menu-2`

```
_sidebar-menu-2                 — HORIZONTAL AUTO LAYOUT
                                  radius: radius/md
                                  padL: spacing/component/2xl
                                  padR: spacing/component/sm
                                  gap: spacing/component/sm
                                  fill: none (Default) / color/sidebar/accent (Hover) / color/sidebar/active + color/sidebar/active/border (Active)
  └─ label                      — TEXT (fill: see token table)
```

### `_sidebar-group-label`

```
_sidebar-group-label            — HORIZONTAL AUTO LAYOUT
                                  fill: none
                                  padL/padR: spacing/component/sm
  └─ label                      — TEXT, fill: color/sidebar/foreground
```

### `_sidebar-badge`

```
_sidebar-badge                  — HORIZONTAL AUTO LAYOUT
                                  fill: color/brand/primary
                                  radius: radius/full
                                  padL/padR: spacing/component/xxs
  └─ count                      — TEXT, fill: color/brand/primary/foreground
```

---

## Token Bindings

### `sidebar` — container per Type

| Type | Fill | Stroke | Radius | Notes |
|---|---|---|---|---|
| `Default` | `color/sidebar/background` | `color/sidebar/border` INSIDE | none | Border on right edge only (mixed weight) |
| `Floating` | none — transparent on `color/background/app` | none | `radius/panel` | No fill, border or shadow; nav sits on the app background |
| `Inset` | `color/sidebar/background` | `color/sidebar/border` INSIDE | none | Same as Default |

### `sidebar` — header

| Layer | Property | Token |
|---|---|---|
| `header` | Fill | `color/sidebar/background` |
| `header` | Padding top/bottom | `spacing/component/sm` |
| `header` | Padding left/right | `spacing/component/md` |
| `header` | Gap | `spacing/component/lg` |
| `Logo` | Fill | **Not token-bound** — branding asset |
| `Logo` | Size | 28 × 28px FIXED |
| `text-block` | Gap | `spacing/component/xxs` |
| `title` | Fill | `color/sidebar/foreground` |
| `caption` | Fill | `color/text/secondary` |

### `sidebar` — content and groups

| Layer | Property | Token |
|---|---|---|
| `content` | Padding all sides | `spacing/0` (explicit zero) |
| `content` | Gap (between groups) | `spacing/component/md` |
| `group-*` | Padding all sides | `spacing/component/md` |
| `group-*` | Gap (between items) | `spacing/component/sm` |

### `sidebar-menu-1` — per State

| State | Container fill | Icon stroke | Label fill |
|---|---|---|---|
| `Default` | none | `color/sidebar/foreground` | `color/sidebar/foreground` |
| `Hover` | `color/sidebar/accent` | `color/sidebar/accent/foreground` | `color/sidebar/accent/foreground` |
| `Active` | `color/sidebar/active` (+ 1px `color/sidebar/active/border`) | `color/sidebar/active/foreground` | `color/sidebar/active/foreground` |

> Hover and Active share the same fill and text tokens. Active is distinguished by persistent fill — it does not reset on mouse-out.

### `sidebar-menu-1` — layout (all states)

| Property | Token |
|---|---|
| Radius | `radius/md` |
| Padding left/right | `spacing/component/sm` |
| Gap | `spacing/component/sm` |

### `_sidebar-menu-2` — per State

| State | Container fill | Label fill |
|---|---|---|
| `Default` | none | `color/sidebar/foreground` |
| `Hover` | `color/sidebar/accent` | `color/sidebar/accent/foreground` |
| `Active` | `color/sidebar/active` (+ 1px `color/sidebar/active/border`) | `color/sidebar/active/foreground` |

Left padding `spacing/component/2xl` creates the visual indent that communicates hierarchy under the parent item.

### `_sidebar-badge`

| Layer | Property | Token |
|---|---|---|
| container | Fill | `color/brand/primary` |
| container | Radius | `radius/full` |
| container | Padding left/right | `spacing/component/xxs` |
| `count` | Fill | `color/brand/primary/foreground` |

### Icon strokes (Icon Placeholder)

All icons in the sidebar are Icon Placeholder instances (stroke-based). Bind color on the `VECTOR` node's strokes — never on the instance fill.

---


### Contrast on the app background (audit 2026-09-22, slate neutrals)

| Text | Token | On `background/app` |
|---|---|---|
| Nav labels, title, name | `color/sidebar/foreground` | 13.98:1 |
| Group label (SemiBold), caption, role | `color/text/secondary` | 7.24:1 |

The app-background glows sit behind the page panel, never behind sidebar text, so these values hold across the whole sidebar.

Group label and caption used `sidebar/foreground` at 60–70% opacity — 3.2–4.1:1, below 4.5:1 for small text. The selected item is marked by **weight** (SemiBold) as well as the white chip, because the chip alone is 1.05:1 against the app background.

### All tokens used in code

Generated from `src/components/ui/sidebar.tsx` — always current. The tables above explain each token's role.

`color/brand/primary` · `color/brand/primary/foreground` · `color/sidebar/accent` · `color/sidebar/accent/foreground` · `color/sidebar/active` · `color/sidebar/active/border` · `color/sidebar/active/foreground` · `color/sidebar/background` · `color/sidebar/border` · `color/sidebar/foreground` · `color/sidebar/ring` · `color/text/secondary` · `opacity/disabled` · `radius/full` · `radius/md` · `radius/panel` · `spacing/component/2xl` · `spacing/component/lg` · `spacing/component/md` · `spacing/component/sm` · `spacing/component/xxs`

---

## Branding Slot — Logo

The `Logo` instance in the sidebar header is a **branding slot**. It is not token-bound and is exempt from token binding rules.

- **Fill:** not token-bound — set by the product's brand guidelines
- **Size:** 28 × 28px FIXED — the only system constraint
- **Usage:** replace the placeholder with your logomark or brand icon at any visual style. The 28px size ensures it fits within the header layout without disruption.

See `enpath-design-system.md → Branding Slots` for the system-level rule.

---

## Behavior

### Collapse modes (`collapsible` prop — shadcn)

| Value | Behavior |
|---|---|
| `offcanvas` | Sidebar slides off-screen; full width when open |
| `icon` | Collapses to icon-only strip; label/badge/trailing hidden — use `sidebar-menu-1 Type=Collapse` |
| `none` | Always visible, not collapsible |

### State management (`useSidebar` hook)

| Value | Type | Description |
|---|---|---|
| `state` | `"expanded"` / `"collapsed"` | Current sidebar state |
| `open` | boolean | Whether sidebar is open |
| `toggleSidebar()` | function | Toggle open/collapsed |
| `isMobile` | boolean | Whether viewport is mobile |
| `openMobile` | boolean | Mobile overlay open state |

### Keyboard

| Key | Action |
|---|---|
| `Cmd+B` / `Ctrl+B` | Toggle sidebar open/collapsed |
| `Tab` / `Shift+Tab` | Navigate between sidebar focusable elements |

### Types

| Type | Visual | When to use |
|---|---|---|
| `Default` | Flush with page edge, bordered right | Standard app layout |
| `Floating` | Rounded panel (`radius/panel`, 14px) with a border (`color/sidebar/border`) and `shadow/surface`, floating on `color/background/app` with `spacing/shell/inset` | Enpath app shell; cards-based layouts |
| `Inset` | Inset within page layout | Nested or sectioned app shells |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `navigation` on the sidebar panel |
| Keyboard | `Cmd+B` / `Ctrl+B` to toggle; `Tab` to navigate items |
| Focus | Focus ring on active item — `color/sidebar/ring` |
| ARIA | `aria-expanded` on the sidebar trigger |
| Mobile | Renders as an overlay sheet on mobile — full focus trap |
| Focus Indicator | color/sidebar/ring — scoped alias of color/ring |
| Toggle button | `SidebarToggle` shows CaretLineLeft when open ("Collapse sidebar") and CaretLineRight when collapsed ("Expand sidebar"); `aria-expanded` reflects the state |
| Collapsed badge | The count is hidden; a dot on the icon keeps the signal and the accessible name includes the count ("Notifications, 1") |

---

## Usage Rules

- Always wrap the sidebar in `SidebarProvider` — it owns collapse state and the keyboard shortcut.
- Use `Type=Expand` nav items when the sidebar is expanded. Switch to `Type=Collapse` when `collapsible=icon` and sidebar is collapsed.
- Use `_sidebar-menu-2` for sub-items under a collapsible parent — never nest two levels of `sidebar-menu-1`.
- Group related nav items under a `group-*` frame with a `_sidebar-group-label` at the top.
- `_sidebar-badge` is for notification counts only — single digit or short number. Do not use for status labels or text.
- Do not use `color/sidebar/*` tokens outside the sidebar component — they are scoped to this context only.
- Do not put the Logo in a filled container using a sidebar token — the Logo fill is branding, not token-controlled.
- Logo fill is NOT token-bound — branding asset exempt from token rules. Size: 28×28px FIXED only.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Full application shells where primary navigation needs to be always accessible (dashboards, admin panels, SaaS apps)
- Multi-section apps where users switch between major areas (Analytics, Settings, Users, Billing)
- Workspaces with hierarchical navigation — top-level sections with nested sub-items below each
- Apps that need icon-only collapsed mode on smaller screens to recover horizontal space
- Mobile apps that render the sidebar as a slide-in overlay sheet
- Applications requiring a persistent branding slot (logo + product name) anchored to the top of the nav

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Default` | Standard app layout — sidebar is flush with the page edge, right border separates it from content | CRM · Project management tool · Admin dashboard |
| `Type=Floating` | Cards-based or elevated layout where the sidebar should feel like a panel rather than an edge element | Analytics tool · Design tool · Dashboard with card-heavy content area |
| `Type=Inset` | Sidebar is inset within the page layout — content wraps around it, creating a nested shell | Settings page with sectioned layout · Documentation browser · Multi-panel workspace |
| `State=Expanded` | Default — full label and icon visible, all nav items readable | Any app in its standard working state |
| `State=Collapsed` | Space is at a premium — show icons only (`sidebar-menu-1 Type=Collapse`) | Collapsed mode via `collapsible=icon` · Narrow viewport · User preference to minimise nav |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Persistent full-app navigation with grouped sections, always visible or collapsible | `sidebar` | `navigation-menu` |
| Site-level top navigation with horizontal links and dropdown panels | `navigation-menu` | `sidebar` |
| A secondary page-level nav for sections within a single page | `tabs` | `sidebar` |
| Collapsible content groups within a page (not navigation) | `accordion` | `sidebar` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Bind a token to the Logo fill | Leave Logo fill unbound — branding decision |
| Use `color/sidebar/primary` on badge fill | Use `color/brand/primary` — primary is logo-block only |
| Use `color/sidebar/accent/foreground` on header title/caption | Use `color/sidebar/foreground` — title sits on `color/sidebar/background`, not accent |
| Use `color/background/default/foreground` on sidebar icon strokes | Use `color/sidebar/foreground` — wrong semantic group |
| Use the hover token (`color/sidebar/accent`) for the selected item | Use `color/sidebar/active` for the selected item and `color/sidebar/accent` for hover — they are different tokens |
| Place `_sidebar-menu-2` without a parent `sidebar-menu-1` | Sub-items always follow a parent item — the indent implies hierarchy |
| Use sidebar token group outside the sidebar | Sidebar tokens are scoped — `color/sidebar/*` only inside the sidebar panel |
## More details

- **Best practice · References · Shadcn:** https://ui.shadcn.com/docs/components/sidebar
- **Behavior · Collapsible · Icon:** Collapses to icon-only strip — switch nav items to Type=Collapse
- **Behavior · Keyboard:** Cmd+B (Mac) / Ctrl+B (Windows) — toggles sidebar open/collapsed
- **Behavior · Mobile:** Renders as a full-screen overlay sheet on mobile with focus trap
- **Composition · Wrapper:** SidebarProvider — required, owns state and keyboard shortcut
- **Composition · Slots:** header (Logo + text-block)
- **Composition · Slots:** content (groups → group-label + nav items + sub-items)
- **Composition · Logo Slot:** 28×28px branding slot — replace with brand logomark. No token constraint on fill.
- **Composition · Nav Item Hierarchy:** sidebar-menu-1 for primary items, _sidebar-menu-2 for sub-items. Never nest menu-1 inside menu-1.
- **Composition · Badge Usage:** _sidebar-badge for notification counts only — short numbers, not status labels

---

