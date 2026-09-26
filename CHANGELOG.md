# Changelog

Breaking changes, additions and removals to the Enpath Design System. Newest first. Each entry says what changed, how to migrate, and why.

> **Rule:** record every breaking change here before it ships — any rename, removal or token alias change that would break code or a spec silently.

---

## 2026-09-26 — Career Map card redesign (status band) and audit fixes

### Added
- **`career-map/band-completed · band-current · band-target · band-planned · band-vision`** → background/muted · brand/200 · green/100 · background/subtle · violet/100. The state label now sits in a tinted band across the top of each card (label text 4.6–7.2:1 on its band; `band-current` is brand/200 so it doesn't match the brand/100 canvas).
- `CareerMap` prop **`onPaneClick`** — click on empty canvas (not a drag); My Career uses it to clear the selection.

### Changed
- Career Map card: the **level is the title** (text-base SemiBold) and the Position sits under it in small secondary text — the level is what changes along a path. Completed cards grey their level and never get the route ring. Card size unchanged.
- `career-map/edge-inactive-opacity` opacity/40 → **opacity/60** (vision lines were unreadable). `career-map/grid` brand/200 → brand/300 (dots were invisible).
- Arrowheads are a fixed ~10px in screen units instead of scaling with stroke width. Zoom controls use Button `icon` to match the toolbar height. React Flow's attribution badge is hidden.

---

## 2026-09-26 — Career Map contrast pass: dot grid, darker lines, fading inactive routes

### Removed — breaking
- **`career-map/grid-strong`** — the canvas now draws one dot grid (`career-map/grid`) instead of two line layers. Migrate: drop any use of `--career-map-grid-strong`.

### Added
- **`career-map/edge-inactive-opacity`** → opacity/40 — fades the lines and legend swatches of routes that aren't active (the selected route, or the followed path when nothing is selected). Lines and swatches only — never text or cards. Consume as `calc(var(--career-map-edge-inactive-opacity) / 100)`.

### Changed
- `career-map/canvas` brand/25 → brand/100; `career-map/grid` brand/50 → brand/200 (dots).
- `career-map/vision-border` violet/500 → violet/600 (2.8:1 → 4.2:1 on white); `career-map/followed-edge` green/600 → green/700 (4.2:1 on the canvas).
- Career Map cards get `shadow/surface`; the selected target's ring sits flush on its green border (no double outline). Legend labels no longer fade with opacity.
- **Known gap:** on the brand/100 canvas `career-map/path-2` (2.8:1) and `path-3` (2.6:1) fall under the 3:1 non-text minimum.

---

## 2026-09-25 — Career Map routes: green main path, violet visions, route selection

### Added
- Primitive **`color/violet/50–950`** (Tailwind violet) — for Career visions. 5.5:1 (600) / 4.1:1 (500) on the canvas.
- **`career-map/followed-edge`** → green/600 — the company path the employee follows (3.2:1 on the canvas).
- Career Map **route selection**: click a line (or its legend entry — now a button) → the route's lines thicken and its cards get a ring in the route's colour. `selectedRoute` / `onSelectRoute`, `routeColor()`.
- My Career: a **route panel** — company path summary (levels in order, where you are, Follow this path) and Career vision summary (route, status, Request / Withdraw / Remove Career vision N). Vision actions moved here from the cards; a vision card offers "Show Career vision N".

### Changed — breaking (Career Map API)
- `CareerMapLink.route` (required) replaces optional `pathId`; Career visions are routes with `kind: "vision"`; `CareerMapPath.followed` marks the green path; `color` is optional. `CareerMapLegend` loses `showVision` (visions are listed as routes). Migrate: give every link its route id and add vision routes to `paths`.
- `career-map/vision-edge` → violet/600, `career-map/vision-border` → violet/500 (were zinc/500). Red was considered and rejected — it means error in Enpath.

---

## 2026-09-25 — Stat + My Career progress and gaps

### Added
- **Stat** (`stat.tsx`, `Display/Stat`, `stat.meta.json`) — one labelled number with an optional one-line explanation in a flat bordered tile; `tone` (neutral · success · warning) colours the icon only. Existing tokens only (no warning-coloured text token exists for white surfaces).
- My Career: **progress board** fixed to the Active target (Ready · Growth area · Needs evidence counts, "Based on N acknowledged records") and **gap rows** in the side panel for any selected role ("You 3 · Intermediate → needs 4 · Advanced", or "Needs 3 · Intermediate · not enough records yet", or "Not set"). Mock evidence for Lan stands in for Records. Gap row is feature-level (`my-career/gap-row.tsx`: Item + Badge), not a design-system component yet.

- Career Map: **completed** state and `item.lane` (rows) — My Career puts the followed company path on one row and each Career vision on its own row below. Cards 176px wide, column gap 48, readable minimum 70% (a 4-level path fits one row on a laptop).
- Career Map: `item.label` (e.g. "Career vision 2"), a `toolbar` slot (top-left), and the view re-fits when cards are added or removed — moving to new cards when the whole map isn't readable.
- My Career: **company-path picker** (when several published paths include the employee's level; no approval), **Explore a role** (one dialog: starting card + role; it's a Planned step when the move is on a company path planned for the employee's role, otherwise a numbered Career vision — replaced a two-tab "Add from selected" that let other positions' paths skip approval), **Remove from my map** (with preview; blocked for the Active target or a waiting request). Any number of Career visions, one sent to the manager at a time.
- My Career: **Set as target** (Preview → Confirm, old target back to Planned) and the employee side of the **Career vision request** (send with optional note, Waiting status on the board, withdraw). Manager review not built. First screen to mount the `Toaster`.

### Changed
- Career Map cards are 104px tall and the title wraps to two lines (was cut off at one).

---

## 2026-09-25 — Career Map + My Career (employee view)

### Added
- **Career Map** (`career-map.tsx`, `Navigation/Career Map`, `career-map.meta.json`) — read-only canvas of an employee's career plan on React Flow (`@xyflow/react` 12.12, MIT — new dependency). Cards are laid out left → right from the links; company-path lines take a path colour, Career vision lines are dashed. Opening view never goes below 80% zoom — on narrow canvases it opens on the current role and its next steps; "Show whole map" zooms out. Plus **CareerMapLegend**.
- **`career-map/*` component tokens** (19): `canvas` → brand/25, `grid` → brand/50, `grid-strong` → brand/100 (brand, not blue — the canvas is a brand surface); node surface / border / foreground / description / selected / radius / padding / gap; `current-label` → brand/primary, `target-label` → text/success, `target-border` → border/success; `vision-border` and `vision-edge` → zinc/500 (zinc/400 was 2.5:1 on the canvas — under 3:1); `path-1..3` → chart/3 · chart/2 · chart/1 (categorical, 9.7 / 3.2 / 3.0:1 on the canvas; hex values may change).
- **My Career route** `/me/career` — Lan Nguyen's plan: Career Map + legend + a panel for the selected card. Progress board, gap rows, Set as target and the Career vision request are not built yet.
- App shell: sidebar links to `/setup` and `/me/career`; other items still show a placeholder.

---

## 2026-09-25 — Component Markdown removed; meta.json is the only component spec

### Removed
- `Component Markdown (reference)/` (53 generated pages) and `Machine Readable/generate-component-docs.mjs`. The readable spec stays in each `meta.json` → `docs`; nothing was lost — the pages were generated from it.
- `meta.sourceMarkdown` and `docs.file` from every meta.json and from the schema. `validate-artifacts.mjs` now rejects either field if it comes back.
- The generated "All tokens used in code" list — the component's `.tsx` is the source for that.

### Changed
- `drift-check.mjs` #8 now checks every meta.json `docs` section is well-formed (was: generated Markdown up to date). #6 scans the meta.json spec fields (`docs`, `doNot`, `constraints`, `accessibility`) for restated px values — not `meta.changelog`, which records past values. #9 reads token names straight from `Tokens/`.
- `sync-doc-values.mjs` no longer regenerates Markdown after fixing meta.json.
- Dropped four hand-typed colour primitives restated after token names (Avatar, Radio Group ×2, Drawer) — token names only. The px notes stay (synced from `Tokens/` and verified by drift-check #6).
- Docs updated: `llms.txt`, `enpath-ui/CLAUDE.md`, `enpath-design-system.md`, `Skills/token-binding-skill.md`, `generation-rules.md`, `component-doc-template.md`, `meta-artifact-template.md`, `component-quick-reference.md`.

---

## 2026-09-25 — Brand ramp separated from blue (docs)

The token migration was done in `Tokens/semantics.tokens.json` before this entry; this records it and brings the docs in line.

### Changed
- **`color/brand/*` is the brand; `color/blue/*` is not.** `brand/primary*` → `brand/500–700`, `brand/secondary*` → `brand/100–300`, `ring` → `brand/500`, `drop-indicator` → `brand/400`, `background/app` → `brand/50`, `background/app-glow` → `brand/300`. Not breaking for code — token names unchanged.
- `color/blue/*` stays for info, links, the rating scale (`scale/1–5`) and identity tints. `color/info/*` has the same values and no references yet.
- Docs: `enpath-design-system.md` (Theme Decisions, Primitives, App shell, AI handoff line) no longer says "blue = indigo brand"; Sidebar selected-item row corrected to the white + hairline state already in the tokens. Input, Textarea and Item docs no longer call the focus border "blue".

### Open
- Still on blue although their descriptions or role suggest brand: `color/surface/tint` ("light brand-blue"), `color/sidebar/ring` (global `ring` is brand), `item/hover|selected/*`, `career-stepper/border` and its gradient, `chat/user/*`. Decide per token.
- `Tokens/validate-contrast.mjs` doesn't check `brand/primary` (OKLCH values). Measured separately: `brand/500` ≈ 6.5:1 on white (sRGB).

---

## 2026-09-23 — Career Path Stepper

### Added
- Primitive `color/brand/25–950` ramp from the En UI color foundation, anchored at `color/brand/500`. Existing semantic and component aliases are unchanged pending migration.
- Primitive `color/info/25–950` ramp using the existing `color/blue` hex values. `color/blue` remains unchanged; no semantic aliases are migrated yet.

- `gradient/career-stepper` primitive and `career-stepper/surface` alias for the blue/100-to-blue/50 shield surface.
- `career-stepper/*` component-token collection — gradient numbered shield, blue border, neutral number, connector, row surfaces, radius and component-specific layout bindings.
- Reusable `CareerPathStepper` / `CareerPathStep` component with Storybook and machine-readable documentation.

### Changed
- Career Path markers now use a number-only shield shape with a 2px inset edge and the gradient-bound `career-stepper/surface`.
- Editable steps support a leading drag handle while consumers retain ownership of drag, keyboard move and persistence behavior.
- Career Path rows use `spacing/component/xs` between the leading drag handle and title content; `career-stepper/row-gap` remains scoped to content-to-actions separation.
- `career-stepper/connector` now aliases `color/border/default` instead of `color/border/subtle` for a clearer progression line.

### Removed
- `career-stepper/gap`, `career-stepper/padding-x` and `career-stepper/padding-y`; use the existing spacing semantics documented by the component instead.
- `career-stepper/surface-soft` and `career-stepper/stroke`; the gradient is a single surface token and the marker no longer contains an icon.

---

## 2026-09-22 — Modern app shell

> Final state of the day: transparent floating sidebar on a blue/25 background, white page panel with `radius/panel` 12px, slate neutrals.

### Added
- **AI chat panel (prototype).** [AI Elements](https://elements.ai-sdk.dev/) installed as source into `src/components/ai-elements/` (conversation, message, prompt-input, model-selector, suggestion, tool, reasoning, shimmer, code-block). Icons converted to Phosphor, `dark:` classes and the dark code theme removed. New shadcn primitives it needs: collapsible, command, dropdown-menu, hover-card, input-group, scroll-area, spinner. **No existing component was overwritten.** All 16 documented (meta.json → generated page, stories: `AI/*`, Layout/Collapsible · Scroll Area, Navigation/Command, Overlay/Dropdown Menu · Hover Card, Forms/Input Group, Feedback/Spinner); their shadcn colour names rewritten to Enpath tokens and popover shadows to `shadow/overlay`. 51 components total.
- `chat/user/bg` → blue/50, `chat/user/fg`, `chat/user/border` → blue/100, `chat/assistant/fg`, `chat/code/bg` → surface/raised, `chat/composer/bg`, `/border`, `/radius` (→ radius/overlay) — component tokens aliasing existing semantics.
- `color/blue/10`, `color/blue/25` — extra-light blue tints between white and blue/50 (blue only).
- `color/background/app` (+ foreground) → blue/25 — the app background behind panels.
- `color/sidebar/active/border` → blue/200.
- `color/surface/tint` → blue/100, `color/surface/tint/foreground` → blue/800 (9.51:1) — light brand-blue identity fill; used by the avatar fallback (was grey `surface/muted`).
- `color/scale/1`–`5` → blue/200, 300, 400, 500, 700 — proficiency-step fills for the 5-level scale, darker per step (Setup expectations grid). Graphic only; always labelled.
- `item/hover/bg` → blue/25, `item/selected/bg` → blue/50, `item/selected/border` → blue/200, `item/selected/fg` → background/default/foreground — Item's new selectable state (`onSelect` + `selected`), same look as the sidebar's selected item. Not breaking: existing Items unchanged.
- `color/white-alpha/60` — sidebar hover only. `color/background/app-glow` → blue/200 — soft glows on the app background, behind the page panel.
- `radius/panel` → 12px (xl) · `spacing/shell/gap`, `spacing/shell/inset` → 8px.

### Changed
- **Badge Success:** 1px `color/border/success` border, green/600 (was none) — consistent with Warning and Error.
- **Dialog & AlertDialog:** radius → `radius/overlay` (12px, was 8px), shadow → `shadow/overlay` (was none). Sheet unchanged.
- **Sidebar readability:** `sidebar/foreground` → zinc/800 (13.98:1 on the app background); group labels SemiBold; `background/app-glow` → blue/200 and the glows moved behind the page panel.
- **Neutral ramp → Tailwind slate.** `color/zinc/*` keeps its name; values are now slate (blue-grey), so every border, divider and grey text tints toward the brand. `background/muted/foreground` and `surface/muted/foreground` → zinc/600 (zinc/500 fell to 4.34:1 on the muted fill). All 26 contrast pairs pass. Not breaking for code — names unchanged.
- **Transparent floating sidebar:** no fill, border or shadow — it sits on `background/app` (a glass version with 80% white + blur was tried and dropped). `sidebar/background` stays white for Default/Inset; `sidebar/active` → white (was blue/50) with `sidebar/active/border` → zinc/200, label SemiBold (no shadow); `sidebar/border` → zinc/300 (dividers were invisible on the blue); group label and caption → `color/text/secondary` (opacity-dimmed text failed 4.5:1); `sidebar/accent` → white 60%.
- Sidebar: panel white; hover `sidebar/accent` → blue/25; selected `sidebar/active` → blue/50 + border, dark text. The selected item no longer shares the hover token.
- Floating sidebar radius → `radius/panel`.

## 2026-09-21 — Enpath design system created

Started from a copy of the Agentic design system and re-themed from En UI. Previous history belongs to Agentic and is not carried over.

### Changed
- **Colours** — brand, neutral and error ramps regenerated from En UI's `/500`; warning = Tailwind amber; success = Tailwind green. Token names unchanged.
- **Destructive, danger fill, invalid text** → `red/600` (was `/500`) for small-text contrast.
- **Font** → Nunito (sans). Labels → SemiBold 600.
- **Control heights** → En UI touch + pointer ladders (`height/control-touch/*` below 640px, `height/control/*` from `sm` up); default 36 → 32px. Button side padding 12px.
- **Icons** → Phosphor Regular (`@phosphor-icons/react/ssr`). lucide-react and @untitledui/icons removed.
- **Cards** → white + border + `shadow/surface`.

### Added
- `radius/control · surface · overlay · pill`, `shadow/hairline · surface · raised · overlay · modal`, primitive `shadow/xs`.
- `height/control/*`, `height/control-touch/*`, `height/target/min · touch`.
- `color/input/bg-readonly`, `color/input/border-readonly`.
- Button `xs` size and `loading`; alert `success` and `info`; input/textarea read-only; sidebar `disabledReason`.
- Built-in 44px touch hit areas on checkbox, radio, switch, slider thumb, breadcrumb link, dialog/sheet close.
- 12 behaviour rules from En UI (R-ENP-01–12); separation ladder; WCAG 2.2 AA target policy.

### Changed (2026-09-22)
- **Component docs:** `meta.json` is now the only source. Each spec moved verbatim into `meta.json` → `docs` (37 files, 9,628 lines, 0 lost); `Component Markdown (reference)/*.md` is generated by `Machine Readable/generate-component-docs.mjs`. `_template.md` → `Machine Readable/component-doc-template.md`.
- **One fact, one place:** Variant Matrix, Do Not, Usage Rules and Accessibility now render from `variants`, `doNot` (new), `constraints` and `accessibility`. Condensed duplicates merged (129 items reported, nothing dropped). `bestPractice`, `behavior`, `composition` removed — details not already in the prose kept under each doc's "More details". Token Bindings gains an "All tokens used in code" list generated from the `.tsx` (72 tokens were previously undocumented). drift-check #9: every token a meta.json names must exist.

### Removed
- **ChatBubble** — replaced by AI Elements Message.
- Hand-patching of `enpath-ui/src/app/tokens.css` — the build now generates it.
- `meta.darkMode`, `figmaNodeId`, `lastAuditDate`, `auditRules` from every meta.json.
- `button/size/Button-height-*` — use `height/control-touch/*` + `sm:height/control/*`.
- Figma workflow, dark mode, Agentic history, AI-readiness tracking.
