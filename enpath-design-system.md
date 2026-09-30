Enpath is a token-bound design system built on Tailwind CSS v4 and shadcn/ui. Tokens map directly to CSS custom properties — no translation layer.

Semantic tokens always reference primitives. Always read the "Do not use" line before picking a token.

---

## Source of Truth

Enpath has **no Figma file**. Every change is made in documents and code.

**Order of authority: Token → Component → Screen.** Token descriptions are the rule components follow. A component's code and its `meta.json` match each other and follow their tokens. A screen uses components exactly as their Storybook stories show. On a conflict the higher layer wins. When following it needs a decision (a visible change, something missing), don't improvise: add it to `document/design-patterns.md` → **Open flags**.

| Layer | Authoritative source | On change |
|---|---|---|
| Token values | `Tokens/primitives.tokens.json`; text styles in `Tokens/semantics.tokens.json` → `typography/*` | Edit JSON → `node sd.build.mjs`. The build writes `enpath-ui/src/app/tokens.css` — never edit that file |
| Token names + semantic rules | This file + `Tokens/semantics.tokens.json` | Update both together |
| Component meaning, behaviour, variants, `doNot` | `meta.json` | **meta.json is the rule; the code follows.** Code that does something else is flagged (Open flags) |
| Component tokens (what the code binds) | `enpath-ui/src/components/ui/*.tsx` | The token section of `meta.json` follows the code. Change the code, then the spec |
| Component spec (machine-readable) | `Machine Readable/artifacts/components/*.meta.json` | Regenerate when the component changes |
| Component usage guidance | `meta.json` → `docs` | Edit the JSON — there is no separate Markdown page |

**Gates — run before calling any change done:**
```bash
node "Machine Readable/sync-doc-values.mjs" --write
node "Machine Readable/extract-token-usage.mjs" --write   # token usage generated from the code
node "Machine Readable/drift-check.mjs"
node "Machine Readable/validate-artifacts.mjs"
cd Tokens && node validate-contrast.mjs
cd enpath-ui && npx tsc --noEmit -p .    # 0 type errors
cd enpath-ui && npm run lint:screens     # 0 lint errors or warnings in the product screens (src/features, src/app)
```

`lint:screens` covers the screens, not the design-system components yet — `components/ui`, `components/ai-elements` and the stories still have known lint errors to clear before the gate widens to `npm run lint`.

**Light mode only.** There are no dark-mode tokens and no `dark:` styles.

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

Values live in `Tokens/primitives.tokens.json`, each with its intent. They are not restated here.

---

## Semantics

Values and intent live in `Tokens/semantics.tokens.json`. Before binding a token, read its **Intent · Use when · Do not use** (`Skills/token-binding-skill.md`). Text styles are `typography/*`, shown in Storybook `Foundations/Text Styles`. Every other token group (colour, spacing, radius, elevation, sizing, opacity, z-index, motion, breakpoints) is shown in Storybook `Foundations/*`, read live from the token files. Nothing is restated here.

---

## Token rules

Rules that span several tokens. A single token's use is in its own description.

### General
- Change a value in `Tokens/`, then `node sd.build.mjs`; never in CSS. Tailwind's classes (`text-*`, `leading-*`, `font-*`, colours, radius) read the tokens through `globals.css`.
- Font-family values are clean names (`Nunito`), not CSS stacks.

### Colour
- **Brand vs blue by meaning.** Brand = Enpath, the primary action, selected, focus. Blue = information, links, rating-scale steps. Never swap them. Hover and pressed use the `-hover` / `-active` tokens, never a hand-picked step.
- Changing a colour regenerates its whole ramp, never one step.
- **Paired surfaces:** `[token]/foreground` is valid only on its own `[token]` (`background/subtle` is a tint with no foreground).
- `brand/destructive` (delete-button fill) ≠ `status/danger` (error status). Destructive is a fill, never text; error text is `text/invalid`.
- Warning and success fills take dark text; their text and icons use the `/700` step.
- Icons: standalone → `icon/*`; inside a filled container → the container's `/foreground`; next to a label in an interactive element → `currentColor`, never a fixed `icon/*`.
- Never dim text with opacity; use a text token (`text/secondary`, `text/disabled`).
- Chart, sidebar and opacity tokens stay in their own context.

### Spacing · z-index · breakpoints · layout
- `spacing/component/*` inside a component, `spacing/layout/*` between components and sections. Page panels are layout, not components. Never hardcode px.
- Never hardcode z-index (`z-[999]`) or breakpoint px: use the tokens and Tailwind prefixes (mobile-first; `lg` is the main layout switch).
- Grid for page layout, flex inside components. Never mix them.

### Height and hit areas
- Every control height is a **touch + pointer pair**. drift-check fails on a literal height or a pointer height without its touch rung.
```
h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)]
```
- A control that stays visually smaller than the target keeps its size and gets an invisible hit area on coarse pointers. Built into checkbox, radio, switch, slider thumb, breadcrumb link, dialog and sheet close.
```
after:absolute after:content-[''] … pointer-coarse:after:min-h-[var(--height-target-touch)] pointer-coarse:after:min-w-[max(100%,var(--height-target-touch))]
```

### App shell
- The frame every page sits in: a transparent sidebar and a white page panel (and the chat panel) on the tinted app background, separated by `spacing/shell/*`. The glows sit behind the page panel, never behind sidebar text. The app background is never used inside a panel.
- Sidebar: no fill, border or shadow; hover `sidebar/accent`; the selected item is a white chip with a hairline and `font-semibold`. Group labels and captions use `text/secondary`.
- Page and chat panels: `background/default`, `radius/panel`, border, `shadow/surface`.
- Chat panel: closed by default. Opening it (button or ⌘I) collapses the sidebar; closing restores it. The AI never saves: Edit mode drafts a proposal card that opens in the normal editor.

### Text styles
- Text uses **text styles**: one class carries font, size, line height and weight. The list, each style's use and its values: tokens `typography/*` and Storybook `Foundations/Text Styles`. Docs, `meta.json` and code comments name the style, never its values.
- Enpath uses three fonts: Inter, Nunito and Roboto Mono (machine text only, R-ENP-03). Which text style uses which font: see Storybook `Foundations/Text Styles`.
- **One class, no mixing** (R-ENP-13): don't build text from size, weight, line-height or font classes. Only the exceptions below may be added.
- **Exceptions** (on top of a text style):
  - `font-semibold` / `font-normal` alone: a selected state (selected nav item, row title, day, step, pressed toggle) or emphasis inside a styled line (a bold name in a sentence, a quiet "(optional)" in a label).
  - `tracking-wide`: small uppercase labels. `tracking-widest`: keyboard shortcut hints in menus.
  - Anything else fails drift-check 13.
- **Labels never wrap:** `label-*` has line height = size, so two lines collide. Text that can wrap uses `body-*` or `heading-*`.
- **Mono:** `text-code-md` / `text-code-sm`, machine text only (R-ENP-03). They are generated as `@utility` classes because Tailwind's text theme can't carry a font family.
- **New style:** add it to `typography/*` in the tokens and rebuild. `cn()` (`lib/utils.ts`) already recognises `display|heading|body|label|code-(xs…xl)` names; without that, tailwind-merge drops the style when a colour class follows.

---

## Component Rules

**Use existing components.** If a component exists, use it — never rebuild it from raw elements (icon button → `Button size="icon"`, divider → `Separator`, avatar circle → `Avatar`).

**Leaf vs container.** Leaf components (Button, Input, Badge, Avatar, Checkbox) have fixed structure and meaningful variants. Container components (Card, Dialog, Sheet, Popover, Field, ButtonGroup) are shells — variants describe layout only; children vary by composition.

**Branding slots** (logos, wordmarks) are exempt from token rules. Only size is constrained: sidebar logo 28 × 28px.

### Building a screen

Plan before writing any screen code:

1. **Components:** which ones, with which variant and size. Scan `Machine Readable/component-quick-reference.md`, then read each `meta.json`. Use them as their Storybook stories show; never restyle one on the screen (`document/design-patterns.md` rule 1).
2. **Patterns:** reuse an approved pattern, template or layout from `document/design-patterns.md` when one fits.
3. **Tokens:** only for the composition between components (placement, `spacing/layout/*`), picked by description (`Skills/token-binding-skill.md`).
4. **Anything missing** (a component, variant, token or pattern): don't invent it. Add it to `document/design-patterns.md` → Open flags and ask.

### Separation ladder

Use the **least** structural device that makes a relationship clear:

1. **Spacing** — group related content, separate different thoughts.
2. **Hierarchy** — a stronger title or supporting text, when spacing already shows the boundary.
3. **Separator** — only for a meaningful boundary (group change, sticky edge, resizable split, dense rows hard to track).
4. **Card / surface** — only when the region is an independent object: actionable, selectable, movable or stacked.
5. **Table** — only when users compare records across stable columns. Don't wrap rows in cards.

**Never stack devices for one boundary.** A heading plus spacing doesn't also need a separator and a card; a card doesn't need separators between short text groups.

A resting card stays at `shadow/surface`. It moves to `shadow/raised` only while dragged or pinned above scrolling content — never on hover.

---

## Icons

**Library: Phosphor Icons, Regular weight.** Import from `@phosphor-icons/react/ssr` using the `…Icon` names (`XIcon`, `CaretDownIcon`, `MagnifyingGlassIcon`). The `/ssr` entry works in both server and client components.

- Size with Tailwind (`size-4`, `h-4 w-4`); colour follows `currentColor` — see Token rules → Colour.
- Never mix icon libraries. lucide-react was removed on 2026-09-21.
- When an icon name is ambiguous, describe it: **Visual** (literal shapes) · **Represents** (concept) · **Use when** · **Do not use**.

---

## Accessibility

### Focus

Required on every focusable element (WCAG 2.4.7). 2px ring, outside, `color/ring`. Inputs add a soft glow (`ring` at 20%). Destructive buttons use a red glow instead of the ring. Sidebar uses `sidebar/ring`.

### Target size

Target **WCAG 2.2 AA** with `height/target/min` as the minimum; every control height meets it. `height/target/touch` is advisory for primary actions and touch-heavy screens.

When a control stays visually smaller, **widen its hit area, don't grow the control**: an invisible `::after` sized to `height/target/touch` on coarse pointers. Every control smaller than `height/target/min` carries one built in: **checkbox, radio, switch, slider thumb, breadcrumb link**, plus the dialog and sheet close buttons.

Hover, selected and checked states are not contrast exceptions — check them separately from the default state.

---

## Rules

Numbered rules. Code comments refer to these numbers, so they never change; R-ENP-04 is retired and not reused.

### Semantics and accessibility
- **R-ENP-01** Keep the semantics a component renders: don't swap its tag, strip roles or ARIA, or rebuild it from plain elements. `className` may restyle, not change meaning.
- **R-ENP-06** A selected row never relies on colour alone (add weight, a border or an icon).
- **R-ENP-07** The current page is marked with `aria-current`, not by style alone.
- **R-ENP-08** A collapsed sidebar item keeps its accessible name when its label is hidden.
- **R-ENP-09** A disabled destination doesn't navigate and isn't reachable as a link.
- **R-ENP-10** An unavailable destination says why (`disabledReason`); it is never silently disabled.
- **R-ENP-11** Navigation uses real nested lists, one nested level at most.
- **R-ENP-12** Heading levels follow the page outline and never skip a level.

### Button
- **R-ENP-05** A button label stays on one line. An icon-only button needs an `aria-label`.

### Text
- **R-ENP-02** Font comes from text styles; never set `font-family` by hand.
- **R-ENP-03** Mono is for machine text only: code, commands, paths, hashes, serialized values. Dates, counts, levels and IDs are not machine text.
- **R-ENP-13** One text-style class per piece of text; don't build text from size and weight classes. Exceptions: Token rules → Text styles. Checked by drift-check 13.

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
_"Tailwind v4 + shadcn. Semantic tokens reference primitives — never hex. Token names are Tailwind's, values are Enpath's (brand = its own OKLCH ramp; blue = info/links/scale, not brand). Light mode only. Control heights are touch + pointer pairs. Text styles only; fonts Inter, Nunito, Roboto Mono (machine text only), which style uses which: Foundations/Text Styles. Phosphor Regular icons. destructive ≠ danger. Every surface has a /foreground pair. Flex inside components, grid for pages. Named z-index only."_
