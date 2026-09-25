Enpath is a token-bound design system built on Tailwind CSS v4 and shadcn/ui. Tokens map directly to CSS custom properties — no translation layer.

Semantic tokens always reference primitives. Always read the "Do not use" line before picking a token.

---

## Source of Truth

Enpath has **no Figma file**. Every change is made in documents and code.

| Layer | Authoritative source | On change |
|---|---|---|
| Token values (hex/px) | `Tokens/primitives.tokens.json` | Edit JSON → `node sd.build.mjs`. The build writes `enpath-ui/src/app/tokens.css` — never edit that file |
| Token names + semantic rules | This file + `Tokens/semantics.tokens.json` | Update both together |
| Theme decisions (the *why*) | §Theme Decisions below | Update with every theme change |
| Component behaviour + variants | `enpath-ui/src/components/ui/*.tsx` | Code wins; update meta.json + markdown to match |
| Component spec (machine-readable) | `Machine Readable/artifacts/components/*.meta.json` | Regenerate when the component changes |
| Component usage guidance | `meta.json` → `docs` (rendered to `Component Markdown (reference)/`) | Edit the JSON, run `generate-component-docs.mjs` — never edit the markdown |

**Gates — run before calling any change done:**
```bash
node "Machine Readable/sync-doc-values.mjs" --write
node "Machine Readable/drift-check.mjs"
node "Machine Readable/validate-artifacts.mjs"
cd Tokens && node validate-contrast.mjs
```

**Light mode only.** There are no dark-mode tokens and no `dark:` styles.

---

## Theme Decisions

Why the values are what they are. Values themselves live only in `Tokens/*.tokens.json` — never restate a hex in a doc.

Enpath's system started as a copy of Agentic, re-themed from En UI (2026-09-21). **Token names are Tailwind's; values are Enpath's** — `color/brand/*` holds the brand (its own OKLCH ramp), `color/blue/*` is a separate true blue for info, links and the rating scale, `color/yellow/*` holds amber. **Brand and blue are different colours — never swap one for the other.**

| Decision | Choice | Why |
|---|---|---|
| Colour source | En UI `/500` of each colour → full 50–950 ramp generated around it (OKLCH) | Keep En UI's colours, Agentic's ramp structure |
| Brand | Own ramp `color/brand/*`, OKLCH hue 264.5 (slightly violet), anchor `/500` — separate from `color/blue` | `/500` ≈ 6.5:1 on white — valid as fill **and** small text. Defined in OKLCH: on wide-gamut (P3) screens it renders more saturated and violet; on sRGB screens `/500` clips to the same colour as `blue/500`, and the light steps (`/100`–`/400`) stay visibly softer than blue's |
| Neutral | Tailwind **slate** (blue-grey) under the name `zinc` | Harmonises with the brand and app background (2026-09-22; was En UI's pure grey) |
| Success | Tailwind green | — |
| Warning | Tailwind amber (stored in `color/yellow/*`) | Closer to En UI's orange-leaning warning |
| Info · links · rating scale | `color/blue/*` — not brand. A `color/info/*` ramp with the same values exists but no token references it yet | Keeps informational and data colours from reading as brand actions |
| Destructive · danger fill · invalid text | `red/600` (hover `700`, pressed `800`) | `red/500` is 3.76:1 — fill-only. `/600` is 4.81:1, passes small text |
| Success / warning fills | Dark text (`zinc/900`); text and icons on `/700` | Their `/500` is under 3:1 with white |
| Radius, spacing | Agentic values (already equal to En UI's) + En UI role aliases | — |
| Control height | En UI touch + pointer ladders, 32px default from 640px up | Denser than Agentic's 40px |
| Type | Nunito + Roboto Mono · Agentic's 18 styles · labels SemiBold | Option A — smallest change; unadopted En UI styles parked in `Enpath/retheme/parked-en-ui-text-styles.md` |
| Cards | White + border + `shadow/surface` | En UI; `surface/raised` stays a grey tint |
| App shell | Transparent sidebar and white page panel (`radius/panel` 12px) on a light brand-tinted app background with soft brand glows (`color/background/app`, `/app-glow`), 8px apart (`spacing/shell`) | Modern, calm, with depth — as in modern productivity apps |
| Sidebar selected item | White + `sidebar/border` hairline, label SemiBold; hover `sidebar/accent` (60% white) | Border = non-colour signal; hover lighter than selected so it never looks selected |
| Icons | Phosphor, Regular | — |
| Figma | Not used | Documents and code are the source |
| Dark mode | Not supported | Light only; `.dark` block is inherited and unmaintained |

---

## Token Layers

```
Primitives  →  raw values. Never referenced by components.
Semantics   →  intent. The only layer components reference.
Components  →  optional per-component aliases of semantics (button, badge, table, tooltip).
```

Naming: primitives `[category]/[scale]/[step]` · semantics `[category]/[role]/[variant?]/[state?]`.

❌ `Blue` · `#3B82F6` as a name · `padding-16px` · `MyButton/BG` · skipping primitives · hex in a semantic token.

---

## Primitives

### Colour

Names are Tailwind's; **values are Enpath's** (see §Theme Decisions). The name does not describe the colour. Hex values live only in `Tokens/primitives.tokens.json`.

```
color/white · color/black
color/zinc/50–950    neutral — Tailwind slate values (blue-grey); name kept
color/brand/25–950   brand — Enpath brand, OKLCH hue 264.5, anchor /500. Primary actions, focus ring, app background
color/blue/10–950    blue — info, links, rating scale, identity tints. Not brand (10 and 25 are extra-light tints)
color/info/25–950    same values as blue; not referenced by any token yet
color/red/50–950     error
color/green/50–950   success (Tailwind green)
color/yellow/50–950  warning (Tailwind amber)
color/chart/1–5      data series only
color/white-alpha/60  sidebar hover only
color/scale/1–5      proficiency steps on the 5-level rating scale (blue/200 → blue/700), darker per step; always labelled
```

- Brand anchors at **`color/brand/500`**. Hover = `/600`, pressed = `/700`. Never hardcode hover hex.
- Choose brand vs blue by meaning: brand = "this is Enpath / the primary action / selected / focus"; blue = "information, a link, a rating-scale step".
- Regenerate a whole ramp when a colour changes — never one step. Exception: blue has two extra-light steps, `blue/10` and `blue/25`, generated between white and `blue/50` (same hue).

### Spacing

Tailwind scale, 4px base, with half-steps.
```
0 · px 1 · 0-5 2 · 1 4 · 1-5 6 · 2 8 · 2-5 10 · 3 12 · 3-5 14 · 4 16 · 5 20 · 6 24
7 28 · 8 32 · 9 36 · 10 40 · 11 44 · 12 48 · 14 56 · 16 64 · 20 80 · 24 96 · 28 112 · 32 128
```

### Radius

```
radius/none 0 · sm 4 · md 6 · base = lg 8 · xl 12 · 2xl 14 · 3xl 18 · 4xl 21 · full 9999
```

### Type

```
font-family/sans   Nunito
font-family/mono   Roboto Mono
font-size          xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 · 4xl 36 · 5xl 48 · 6xl 60 · 7xl 72 · 8xl 96 · 9xl 128
font-weight        thin 100 → black 900 (normal 400 · medium 500 · semibold 600 · bold 700 in use)
line-height        none 1 · tight 1.25 · snug 1.375 · normal 1.5 · relaxed 1.625 · loose 2  (CSS reference only)
letter-spacing     tighter −2.5 · tight −1.5 · normal 0 · wide 2.5 · wider 5 · widest 10  (px)
```
Font-family values are clean names (`Nunito`), not CSS stacks.

### Shadow

```
shadow/xs     0 1px (4%)                                   ← hairline
shadow/sm     0 1px 2px 0 (5%)
shadow/default 0 1px 3px 0 (10%), 0 1px 2px -1px (10%)
shadow/md     0 4px 6px -1px (10%), 0 2px 4px -2px (10%)
shadow/lg     0 10px 15px -3px (10%), 0 4px 6px -4px (10%)
shadow/xl     0 20px 25px -5px (10%), 0 8px 10px -6px (10%)
shadow/2xl    0 25px 50px -12px (25%)
shadow/inner  inset 0 2px 4px 0 (5%)
```

### Opacity · Motion · Z-index · Breakpoints

```
opacity      0 10 20 30 40 50 60 70 75 80 90 100
motion       duration instant 0 · fast 100 · normal 200 · slow 300 · slower 500 (ms)
             easing standard (0.2,0,0,1) · enter (0,0,0.2,1) · exit (0.4,0,1,1) · linear
z-index      base 0 · raised 10 · dropdown 20 · sticky 30 · overlay 40 · modal 50 · toast 60
breakpoint   sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536 (mobile-first; lg = main layout switch)
```
Never hardcode z-index (`z-[999]`) or breakpoint px — use the tokens / Tailwind prefixes.

### Layout

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| Mobile | 4 | 16px | 16px |
| Tablet (md) | 8 | 24px | 32px |
| Desktop (lg+) | 12 | 24px | 80px |

Container: `max-w-[1400px] mx-auto px-4 md:px-8`. Grid for page layout, flex for component internals — never mix.

---

## Semantics

### Colour — token list

shadcn pattern: `[token]` = fill, `[token]/foreground` = text/icon on that fill. Always define both (exception: `color/background/subtle`, a tint).

```
color/background/default · subtle · muted · inverted · accent · app  (+ /foreground except subtle)
color/surface/default · raised · muted · accent · overlay · tint     (+ /foreground)
color/text/secondary · disabled · inverse · invalid · success · link · link-hover · link-active
color/border/subtle · default · hover · strong · focus · disabled · error · success · warning
color/input/bg · bg-readonly · border · border-readonly · placeholder
color/ring
color/brand/primary · secondary · destructive                      (+ /foreground · -hover · -active)
color/status/success · warning · danger · info                     (+ /foreground · -subtle · -subtle/foreground)
color/status/offline                                               (+ /foreground)
color/icon/default · muted · disabled · inverse · brand · danger · success · warning
color/sidebar/background · foreground · primary · accent · border · ring · active (+ /foreground · /border)
color/chart/1–5
color/scale/1–5
```

### Colour — rules

**Before binding any token, read its description** (Intent · Use when · Do not use) in `Tokens/semantics.tokens.json` — see `Skills/token-binding-skill.md`.


- **`brand/destructive` ≠ `status/danger`.** Destructive = delete-button fill. Danger = error status. Never swap. Both resolve to `red/600`.
- **Paired-surface rule:** `[token]/foreground` is valid only on its own `[token]`.
- `brand/destructive` is a fill, never text. Error text = `text/invalid`.
- `surface/*` = component surfaces · `background/*` = page structure. Dropdowns/popovers/menus = `surface/overlay`; dialogs/drawers/cards = `surface/default`.
- `surface/raised` is a **grey tint** (tab tracks, table headers) — not a card fill. Cards are white + `shadow/surface`.
- `background/accent` = hover tint for ghost/outline/menu rows — not a CTA fill.
- Warning and success fills use **dark text** (`zinc/900`); their text and icons use `/700`.
- Input border is one step darker than `border/default`.
- Icons: standalone → `icon/*`; inside a filled container → the container's `/foreground`; next to a label in an interactive element → **track the label colour** (`currentColor`), never a fixed `icon/*`.
- Chart, sidebar and opacity tokens are scoped to their context.

### Spacing

```
spacing/component/xxs 2 · xs 4 · xs-plus 6 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32
spacing/layout/xs 16 · sm 24 · md 32 · lg 48 · xl 64
spacing/shell/gap 8 · inset 8
```
`component/*` = padding and gap inside a component. `layout/*` = between components and sections. Never hardcode px.

| Spacing job | Canonical token |
|---|---|
| Page or detail header/body inset | `spacing/layout/sm` |
| Tight separation between adjacent page groups | `spacing/layout/xs` |
| Separation between distinct information groups | `spacing/layout/md` |
| Standard card or component padding | `spacing/component/lg` |
| Large dialog or component-owned surface padding | `spacing/component/xl` |

Page panels are layout structure, not components: do not use `spacing/component/xl` for page padding even though it currently resolves to the same value as `spacing/layout/sm`.

### Radius — roles

```
radius/control → md 6     buttons, inputs, selects, comboboxes, date pickers
radius/surface → lg 8     cards, panels, tables
radius/overlay → xl 12    popovers, menus, dialogs, sheets
radius/pill    → full     badges, avatars, pills
radius/panel   → xl 12    floating app-shell panels (sidebar, page, chat)
```

### Shadow — roles

```
shadow/hairline → xs     inner edge of layered surfaces
shadow/surface  → sm     cards, panels, tables (with border/default)
shadow/raised   → md     sticky regions; a card only while dragged or pinned (never on hover)
shadow/overlay  → lg     popovers, menus
shadow/modal    → 2xl    dialogs, sheets
```

### App shell

The frame every page sits in: **a transparent sidebar and a white page panel on a light brand-tinted app background.**

```
color/background/app (brand/50) + two soft color/background/app-glow (brand/300) glows on the right, behind the page panel — never behind sidebar text
  └ spacing/shell/inset 8px from the window edge
    [ sidebar ]  8px  [ page panel ]  8px  [ chat panel ]     ← spacing/shell/gap
     sidebar: no fill · page: white, border, shadow/surface · radius/panel 12px
```

- Sidebar (Floating): no fill, no border, no shadow — nav sits directly on `color/background/app`. Hover `color/sidebar/accent` (60% white); selected item white + hairline, label SemiBold (no shadow). Group labels and captions use `color/text/secondary` — never opacity on text.
- Page and chat panels: `color/background/default`, `radius/panel`, 1px border, `shadow/surface`.
- Chat panel (right, 380px): closed by default; opening it (button or ⌘I) collapses the sidebar, closing restores it. User turns `chat/user/*` (blue/50 block); assistant turns plain text; composer `chat/composer/*`. The AI never saves — Edit mode drafts a proposal card that opens in the normal editor.
- The app background is never used inside a panel.

### Height

Every control height is a token, set as a **touch + pointer pair**: the touch rung below 640px (fingertip), the pointer rung from `sm` up (mouse). `drift-check` fails on a literal height or a pointer height without its touch rung.

| Size | Touch (< 640px) | Pointer (≥ 640px) | Use |
|---|---|---|---|
| xs | `height/control-touch/xs` 28 | `height/control/xs` 24 | dense rows, toolbars |
| sm | `height/control-touch/sm` 32 | `height/control/sm` 28 | compact |
| md | `height/control-touch/md` 36 | `height/control/md` 32 | default — button, input, select, combobox, date picker, menu rows |
| lg | `height/control-touch/lg` 40 | `height/control/lg` 36 | prominent actions |

```
h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)]
```

Hit areas (not control sizes): `height/target/min` 24 (WCAG 2.2 AA floor) · `height/target/touch` 44 — applied as an invisible `::after` on coarse pointers (checkbox, radio, switch, slider thumb, breadcrumb link, dialog/sheet close):
```
after:absolute after:content-[''] … pointer-coarse:after:min-h-[var(--height-target-touch)] pointer-coarse:after:min-w-[max(100%,var(--height-target-touch))]
```

### Opacity

```
opacity/disabled 60 · loading 50 · overlay 50 (backdrop only) · ghost 80 · active 80
```

### Typography

18 text styles. Line-heights are fixed px. Labels are **SemiBold 600** (from En UI). Unadopted En UI styles are parked in `Enpath/retheme/parked-en-ui-text-styles.md`.

```
display/lg  48 Bold  −1.5  48lh     body/lg  18 Regular 29lh
display/md  36 SBold −1.5  45lh     body/md  16 Regular 24lh
display/sm  30 Med          38lh     body/sm  14 Regular 21lh
                                     body/xs  12 Regular 18lh
heading/xl  24 SBold 33lh
heading/lg  20 SBold 28lh           label/lg 16 SBold 16lh
heading/md  18 SBold 25lh           label/md 14 SBold 14lh
heading/sm  16 SBold 22lh           label/sm 12 SBold 12lh
heading/xs  14 SBold 19lh
                                     code/md  14 Roboto Mono 23lh
                                     code/sm  12 Roboto Mono 20lh
```

---

## Component Tokens

### Button

| Token | Resolves to |
|---|---|
| `button/primary/bg/bg · hover · active` · `fg/fg` | `brand/primary` · `-hover` · `-active` · `/foreground` |
| `button/secondary/bg/bg · hover · active` · `fg/fg` | `brand/secondary` · `-hover` · `-active` · `/foreground` |
| `button/destructive/bg/bg · hover · active` · `fg/fg` | `brand/destructive` (red/600 · 700 · 800) · `/foreground` |
| `button/outline/bg/bg · hover · active` · `fg/fg` | `background/default` · `background/accent` ×2 · `background/default/foreground` |
| `button/outline/border/default · hover · focus · active · disabled` | `border/default` · `border/hover` · `ring` · `border/strong` · `border/disabled` |
| `button/ghost/bg/bg · hover · active` · `fg/fg` | transparent · `background/accent` ×2 · `background/default/foreground` |
| `button/link/fg/default · hover · active · disabled` | `text/link` · `-hover` · `-active` · `text/disabled` |

| Size token | Value | Use |
|---|---|---|
| `Button-padding-xsmall` | 8px | `xs` |
| `Button-padding-small` · `-default` | 12px | all other sizes |
| `Button spacing` | 4px | icon-to-label gap |
| `Button radius 2` · `radius 1` | 8px · 12px | default sizes · large |

Button heights come straight from `height/control-touch/*` + `sm:height/control/*` (xs 28→24 · sm 32→28 · default 36→32 · lg 40→36). Icon-only buttons are square. Input, select, combobox, date picker and menu option rows use the `md` pair.

### Badge · Table · Tooltip

```
badge/Badge-height-small 16 · medium 20 · large 24
table/table-cell-compact 40 · default 48
tooltip/bg → background/inverted · tooltip/fg → background/inverted/foreground
```

---

## Component Rules

**Use existing components.** If a component exists, use it — never rebuild it from raw elements (icon button → `Button size="icon"`, divider → `Separator`, avatar circle → `Avatar`).

**Leaf vs container.** Leaf components (Button, Input, Badge, Avatar, Checkbox) have fixed structure and meaningful variants. Container components (Card, Dialog, Sheet, Popover, Field, ButtonGroup) are shells — variants describe layout only; children vary by composition.

**Branding slots** (logos, wordmarks) are exempt from token rules. Only size is constrained: sidebar logo 28 × 28px.

### Separation ladder (from En UI)

Use the **least** structural device that makes a relationship clear:

1. **Spacing** — group related content, separate different thoughts.
2. **Hierarchy** — a stronger title or supporting text, when spacing already shows the boundary.
3. **Separator** — only for a meaningful boundary (group change, sticky edge, resizable split, dense rows hard to track).
4. **Card / surface** — only when the region is an independent object: actionable, selectable, movable or stacked.
5. **Table** — only when users compare records across stable columns. Don't wrap rows in cards.

**Never stack devices for one boundary.** A heading plus spacing doesn't also need a separator and a card; a card doesn't need separators between short text groups.

A resting card stays at `shadow/surface`. It moves to `shadow/raised` only while dragged or pinned above scrolling content — never on hover.

### Card layout

Anatomy: `Card > CardHeader (title + optional right-aligned action) + CardContent + CardFooter`. One title, one purpose per card.

| Card type | Padding |
|---|---|
| Data · dashboard · form · list (default) | 16px `spacing/component/lg` |
| Dense widgets | 12px `spacing/component/md` |
| Prose · feature | 24px `spacing/component/xl` |

Section gap inside a card 16px; micro-gaps 4px. A grid of cards uses the same gap as the card padding. Tables and images run edge-to-edge or carry their own border. Primary action in header **or** footer, not both. Tokens: fill `surface/overlay` · border `border/default` · radius `radius/lg` · shadow `shadow/surface`.

### Layout

- `overflow-hidden` clips (never on containers holding dropdowns/tooltips) · `overflow-auto` needs a fixed height.
- `absolute` for decorative overlays and indicators only — never layout. `sticky` for table headers and in-page nav.
- Scrollbars are themed globally in `globals.css` (thumb `border/strong`, 8px, `radius/full`).

---

## Icons

**Library: Phosphor Icons, Regular weight.** Import from `@phosphor-icons/react/ssr` using the `…Icon` names (`XIcon`, `CaretDownIcon`, `MagnifyingGlassIcon`). The `/ssr` entry works in both server and client components.

- Size with Tailwind (`size-4`, `h-4 w-4`); colour follows `currentColor` — see the icon colour rules above.
- Never mix icon libraries. lucide-react was removed on 2026-09-21.
- When an icon name is ambiguous, describe it: **Visual** (literal shapes) · **Represents** (concept) · **Use when** · **Do not use**.

---

## Accessibility

### Focus

Required on every focusable element (WCAG 2.4.7). 2px ring, outside, `color/ring`. Inputs add a soft glow (`ring` at 20%). Destructive buttons use a red glow instead of the ring. Sidebar uses `sidebar/ring`.

### Target size

Target **WCAG 2.2 AA: 24 × 24px minimum.** All controls (24–36px) meet it. **44 × 44px is advisory** for primary actions and touch-heavy screens.

When a control stays visually smaller, **widen its hit area, don't grow the control**: an invisible `::after` sized to `height/target/touch` on coarse pointers. Every control below 24px carries one built in: **checkbox, radio, switch, slider thumb, breadcrumb link**, plus the dialog and sheet close buttons.

Hover, selected and checked states are not contrast exceptions — check them separately from the default state.

### Contrast (light mode — from `validate-contrast.mjs`)

| Pair | Ratio |
|---|---|
| Page / surface text | 18.1 |
| `background/muted` + foreground | 4.99 |
| `brand/primary` + white | 6.52 |
| `brand/destructive` · `status/danger` + white | 4.81 |
| `status/success` · `status/warning` + dark text | 7.94 · 8.48 |
| `status/*-subtle` + subtle foreground | 4.79 – 9.24 |

All 24 paired surfaces pass AA. `text/disabled` is intentionally below 4.5 (disabled elements are exempt).

---

## Component Behaviour & Accessibility Rules (from En UI)

Carried over from En UI (`contracts/rules.catalog.json`, 65 rules) on 2026-09-21. Only rules for components this system has are kept; each keeps its En UI id for tracing.

### 1. All components

**R-ENP-01 · Keep the semantics a component renders.** Don't swap the rendered tag, strip roles or ARIA attributes, or rebuild the behaviour from generic elements. `className` may restyle; it may not change meaning.
*From: `component.*.preserve-semantics`*

### 2. Typography

**R-ENP-02 · One sans family for all interface text** — prose, labels, identifiers, timestamps, counts, versions.
*From: `component.typography.use-nunito-by-default`*

**R-ENP-03 · Mono is for machine-oriented text only** — code, commands, paths, hashes, serialized values. A date, a count, a level or an ID is **not** machine text; it uses sans.
*From: `component.typography.reserve-mono-for-technical-content`*

**R-ENP-04 · Use the defined type styles; don't build new ones** from size and weight utilities.
*From: `component.typography.use-compact-roles`*

### 3. Button

**R-ENP-05 · A button label stays on one line and never wraps.** An icon-only button needs an `aria-label`.
*From: `component.button.single-line-label`*

### 4. Table

**R-ENP-06 · Selected rows never rely on colour alone** to show they're selected.
*From: `component.table.preserve-selected-row-emphasis`*

### 5. Sidebar navigation

**R-ENP-07 · The current page is marked with `aria-current`**, not styling alone.
*From: `component.sidebar-navigation.current-page`*

**R-ENP-08 · A collapsed item keeps its accessible name** when its visible label is hidden.
*From: `component.sidebar-navigation.collapsed-accessible-name`*

**R-ENP-09 · A disabled destination doesn't navigate** and isn't reachable as a link.
*From: `component.sidebar-navigation.disabled-navigation`*

**R-ENP-10 · An unavailable destination says why.** Never silently disabled (`disabledReason`).
*From: `component.sidebar-navigation.unavailable-reason`*

**R-ENP-11 · Navigation uses real nested lists**, one nested level at most.
*From: `component.sidebar-navigation.nested-list-semantics`*

### 6. Headings

**R-ENP-12 · Heading levels follow the page outline and never skip a level.**
*From: `component.page-section.heading-level`*

### Not carried over

| En UI rules | Why |
|---|---|
| Application shell, header, page container, page header, page section (except R-ENP-12), split layout — 12 rules | Components not in this system yet |
| AI chat page, AI workspace, login page — 11 rules | Patterns not in this system |
| `component.colocation` | This system has its own file structure |

---

## Deprecated Tokens

Mark every deprecated token so AI doesn't use it:
```
[token] ← DEPRECATED · Deprecated: [date] · Reason: [why] · Replaced by: [new token]
```
None currently.

---

## For AI Handoff

Give: this file · `Tokens/*.tokens.json` · `llms.txt`. Summary line:
_"Tailwind v4 + shadcn. Semantic tokens reference primitives — never hex. Token names are Tailwind's, values are Enpath's (brand = its own OKLCH ramp; blue = info/links/scale, not brand). Light mode only. Controls 32px. Labels SemiBold. Nunito + Roboto Mono. Phosphor Regular icons. destructive ≠ danger. Every surface has a /foreground pair. Flex inside components, grid for pages. Named z-index only."_
