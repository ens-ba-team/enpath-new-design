---
title: Design patterns
created: 2026-09-28
updated: 2026-09-30
status: First pass reviewed in part (2026-09-28): 1 layout, 1 template, 9 patterns. P7 approved 2026-09-30; the rest are candidates. Checked against the code 2026-09-29.
related: glossary.md, my-career-build.md, set-up-build.md, ../Skills/catalog-build/enpath-catalog-plan.md, ../Tracking/Storybook Status.md
---

#enpath #design-system #patterns

# Design patterns

The written form of the Enpath catalog: every design decision about **how components are put
together**, and everything that repeats. One place for designers, the dev team and agents to read,
instead of decisions scattered through the build docs. Build docs link here ("uses the detail-panel
footer pattern") instead of repeating a pattern.

## Rules

1. **A component looks the same everywhere.** Changing how a component looks or behaves (padding,
   colour, size, radius, a new variant or size) happens **in the component** (`components/ui/*.tsx`
   + its story in Storybook + `meta.json`), never at one place of use. There's no such thing as a
   "custom component" on a screen.
2. **Patterns, templates and layouts are composition only**: which components, in what order, where
   they sit, how wide, what spacing between them, and the behaviour rules. They don't restyle
   components.
3. **What doesn't fit is flagged, not improvised.** Anything below goes into **Open flags** and
   waits for a decision; a flag is removed once it's decided and done.
   - a component restyled at a place of use (becomes a variant or size of the component, or is removed);
   - a component or variant a screen needs that doesn't exist;
   - a token that doesn't exist;
   - a component that breaks its token's description, or does something its `meta.json` doesn't say
     (the token description and `meta.json` are the rule; see the rulebook → Order of authority).
4. **Composition is not debt:** classes that only place a component (scroll containment such as
   `min-h-0`, a `border-t` separating panes, side padding aligning a TabsList with the page, chat panel
   paddings) belong to the pattern, not the component.

## Open flags

Decisions waiting. One row per flag; remove it when decided and done.

| Flag | Kind | Where | Since | Decision needed |
|---|---|---|---|---|
| Step rail reuses the Career map's role tokens (`career-map/*`, 10 tokens: node, band, label, edge colours) | breaks token | `components/ui/step-rail.tsx` | 2026-09-30 | Allow it (add `step-rail` to the owners of `career-map/*`, the rail is the map's line language turned on its side), or give the rail its own tokens |
| The map legend rebuilds outline buttons from Button's tokens (`button/outline/*`) instead of using `Button` | restyle | `components/ui/career-map.tsx` (legend, route title) | 2026-09-30 | Use `Button variant="outline"` (pressed via `aria-pressed`), or keep it and add `career-map` to the owners of `button/*` |
| AlertDialog: spec has `Type` Default / Destructive with an icon container (`color/background/muted`, `color/status/danger-subtle`); the code has no `type` prop and no icon | breaks spec | `components/ui/alert-dialog.tsx` | 2026-09-30 | Build the Type prop + icon container, or drop them from the spec |
| Breadcrumb: `State=Disabled` (`color/text/disabled`) is in the spec but only styled in the story with a className | restyle | `stories/Breadcrumb.stories.tsx` (WithDisabled) | 2026-09-30 | Add a disabled state to `BreadcrumbLink`, or drop it from the spec |
| Card: the Border example (`color/border/strong`) and prose density (`spacing/component/xl` padding) are className overrides on the story's Card | restyle | `stories/Card.stories.tsx`; card spec `container` notes | 2026-09-30 | Add them as Card options (e.g. `tone="strong"`, `size="spacious"`), or drop them from the spec |
| CodeBlock: spec fill is `chat/code/bg` (grey, surface/raised); the code fills `color/background/default` (white) | breaks spec | `components/ai-elements/code-block.tsx` | 2026-09-30 | Which fill is right: grey (spec) or white (code) |
| DatePicker: spec open-state fill is `color/background/default`, code uses `color/input/bg`; spec's invalid state (`color/border/error` border + ring) isn't in the code | breaks spec | `components/ui/date-picker.tsx` | 2026-09-30 | Match the spec in code, or update the spec to the code |
| Dialog: Sticky footer / Scrollable types are built in the story by overriding `DialogContent` / `DialogHeader` padding; footer fill `color/background/subtle` + `color/border/subtle` are story classes | restyle | `stories/Dialog.stories.tsx` | 2026-09-30 | Add `DialogBody` / a sticky `DialogFooter` option to the component, or drop the types from the spec |
| DropdownMenu: label colour (spec `color/text/secondary`, code inherits the overlay text); shortcut dimmed with `opacity-60` (rulebook: never dim text with opacity); separator `color/surface/muted` vs spec `color/border/default`; spec's destructive item (`color/text/invalid`) isn't in the code | breaks spec | `components/ui/dropdown-menu.tsx` | 2026-09-30 | Match the spec in code (shortcut → `color/text/secondary`), or update the spec |
| InputOTP: slot fill is `color/background/default` in code, `color/input/bg` in the spec; Disabled dims the whole group with opacity instead of the spec's disabled fill / stroke / text (`color/surface/muted`, `color/border/disabled`, `color/text/disabled`) | breaks spec | `components/ui/input-otp.tsx` | 2026-09-30 | Match the spec in code, or update the spec to the code |
| Chat composer look (`chat/composer/bg`, `/border`, `/radius`) is applied by the Ask AI screen with className overrides on `PromptInput`; `PromptInput` itself renders the plain InputGroup | restyle | `features/enpath/chat/assistant-panel.tsx` (PromptInput); prompt-input + input-group specs | 2026-09-30 | Move the composer look into `PromptInput` (default or a variant), or drop it from the specs |
| Pagination: the Simple story overrides `PaginationContent` gap with a className | restyle | `stories/Pagination.stories.tsx` | 2026-09-30 | Add a gap option to `PaginationContent`, or keep the default |
| Toast: paddings and gaps come from sonner's default CSS; the spec binds `spacing/component/md`, `lg`, `sm`, `xxs` | breaks spec | `components/ui/toast.tsx` | 2026-09-30 | Bind the spec's spacing tokens through `toastOptions.classNames`, or update the spec to sonner's defaults |
| Progress ring ("1/2" in a circle, after Culture Amp) **before the title** of each growth area (user, 2026-09-30). **Built on the screen** (`ProgressRing` in the file): SVG, track `color/border/default`, fill `color/brand/primary`, all done `color/icon/success`, `role="progressbar"`. `Progress` is a straight bar only | restyle | `features/enpath/my-actions/growth-area-group.tsx` | 2026-09-30 | Move it into the design system (`Progress` option `shape="ring"` + story + meta.json), then delete the screen copy |
| Stat icon in a coloured tile (like common dashboard tiles). **Built on the screen** (`IconTile` passed into Stat's `icon` slot): growth areas `status/warning-subtle` + `icon/warning`, in progress `status/info-subtle` + `status/info`, to do `surface/muted` + `icon/muted`, done `status/success-subtle` + `icon/success`. `Stat` only colours a bare icon | restyle | `features/enpath/my-actions/my-actions-screen.tsx` | 2026-09-30 | Move it into Stat (an icon-tile option with tones warning / info / neutral / success, + story + meta.json), then delete the screen copy |
| Badge `blue` has an almost invisible border (`color/border/subtle`) while `success`, `warning` and `error` have coloured borders. **Overridden on the screen**: the In progress badge gets `color/status/info` as its border (there's no `border/info` token) | restyle | `features/enpath/my-actions/growth-area-group.tsx` (`statusBadgeClass`); `components/ui/badge.tsx` | 2026-09-30 | Fix it in Badge (every `blue` badge changes; maybe add a `color/border/info` token), then delete the override |
| Tinted header band on a Card: the title row full-bleed on `color/surface/header` (brand/50, new token 2026-09-30) with a `color/border/default` line under it. **Built on the screen** (negative margins cancel the compact Card's padding) | restyle | `features/enpath/my-actions/growth-area-group.tsx` | 2026-09-30 | Make it a Card option (`<CardHeader tone="tinted">` for both sizes + story + meta.json) when a second screen needs it, then delete the screen copy |

Kinds: **restyle** (component changed at a place of use) · **missing component** · **missing token** ·
**breaks token** (component vs token description) · **breaks spec** (code vs `meta.json`).

---

## Four kinds

| Kind | What it is | Where the code lives | ID |
|---|---|---|---|
| **Component** | One design-system component, global. Inherited from Agentic (incl. AI Elements) or made for Enpath (e.g. `career-map`, `career-path-stepper`, `stat`, `step-rail`) | `enpath-ui/src/components/ui/`, `components/ai-elements/` | Given when the catalog is built (`agt-cmp-…` / `enp-cmp-…`) |
| **Pattern** | Several components put together for a job that recurs, with rules | `enpath-ui/src/features/…` | After approval (`enp-pat-…`) |
| **Template** | A page type that repeats across routes | a route + its screen | After approval (`enp-tpl-…`) |
| **Layout** | The shell every page sits in | `features/enpath/app-shell.tsx` | After approval (`enp-lay-…`) |

## Lifecycle

```
candidate  ──review──▶  approved (gets its ID, goes into the catalog)  ──…──▶  deprecated (replacedBy)
```

- **Candidate** only when it **repeats**: it appears in **2+ places** (decided 2026-09-28). A one-off
  screen's decisions stay in its build doc until something repeats them.
- **Approved** only by the user. Then it gets a permanent ID and an entry in
  `Machine Readable/catalog-entries.json`; the catalog renders it. IDs never change or get reused.
- Each entry is kept short and uses the same headings: identity and scope ·
  purpose · anatomy · responsive · states · components used · rules and decisions (date + why) ·
  evidence · open questions.

---

## Review status (first pass, 2026-09-28)

All entries below are **candidates**: no IDs yet. For each one: approve, change or drop. Approved
entries get an ID and go into the catalog. Names are working names.

| # | Kind | Candidate | Appears in |
|---|---|---|---|
| L1 | Layout | App shell | every page |
| T1 | Template | Master-detail | Setup: Career structure · Matrices config · Career path |
| P1 | Pattern | Page header | Setup · My Career |
| P2 | Pattern | Detail header actions | Position · Matrix · Career path |
| P3 | Pattern | History drawer | Position · Matrix · Career path · Path history (My Career) |
| P4 | Pattern | Preview → Confirm dialog | 12 dialogs in Setup and My Career |
| P5 | Pattern | Detail panel | My Career role panel · route panel |
| P6 | Pattern | Step rail | Explore preview · List view · route panel (built on `StepRail`, 2026-09-28) |
| P7 | Pattern | Competency status groups | My Career role panel. **Approved 2026-09-30** → `enp-pat-competency-status-groups` |
| P8 | Pattern | Locked action with a reason | Position · Matrix · the rating grid |
| P9 | Pattern | Ask AI chat panel | Setup · My Career |

---

## Layouts

### L1 · App shell — candidate

- **Scope:** every page of the prototype. Code: `features/enpath/app-shell.tsx`,
  `chat/sidebar-follows-chat.tsx`.
- **Purpose:** keep navigation, the page and the AI chat side by side without competing.
- **Anatomy:** app background (`color/background/app`, brand/50, plus two soft glows on the right,
  never behind sidebar text) → **floating sidebar** (collapsible to icons) → **page panel** (white,
  `radius/panel` 12px, border, `shadow/surface`) → optional **right panel** (the chat). Outer inset and
  gaps `spacing/shell/*` (8px).
  Sidebar: brand mark + "Enpath · Career intelligence" + collapse toggle; **Workspace** (My Career ·
  My Actions · Records); **Operations** (Directory · Team · Reviews · Setup); footer (MCP access ·
  Notifications with a count badge · user).
- **Responsive:** ≥1024px sidebar + panel side by side; below 1024px a top bar with the brand and a
  menu button opening the navigation in a left Sheet (max 320px); the right panel is hidden.
- **Rules / decisions:**
  - Sidebar collapses with its toggle or **⌘B**.
  - Opening the chat **collapses the sidebar**; closing it restores what the user had
    (`SidebarFollowsChat`). **⌘I** toggles the chat.
  - Workspace order My Career · My Actions · Records, siblings (2026-09-28).
  - Separation ladder: the page panel is the card step (white + border + `shadow/surface`).
- **Components:** Sidebar family, Sheet, Separator, Avatar, Button.
- **Open:** Notifications is a static link (no panel yet); "Admin" under the user while viewing as an
  employee.

## Templates

### T1 · Master-detail — candidate

- **Scope:** Setup's three tabs (`/setup?tab=structure|matrices|paths`). Code:
  `setup/setup-screen.tsx` (PositionList / PositionDetail), `setup/matrices-screen.tsx`
  (MatrixList / MatrixDetail), `setup/career-path-screen.tsx` (PathList / detail).
- **Purpose:** pick one object from a list, work on it in full on the right.
- **Anatomy:**
  - **List (left, 280px, right border):** search Input with an icon · list of Items (name, one line of
    meta, status Badge) with the selected one highlighted · add action pinned at the bottom
    ("Add position" / "Add matrix", plus Import on positions).
  - **Department group header (Career structure):** a bare `CollapsibleTrigger` styled on the screen,
    full width, `radius/sm`, padding `spacing/component/xs` horizontal and `spacing/component/sm`
    vertical, the department name · count in `text-label-sm` uppercase `text/secondary`, and a caret
    that turns when the group closes. Kept on the screen by decision (2026-09-29); if a second place
    needs it, it becomes a component.
  - **Detail (right, fills):** header = title + status Badge, a row of meta (label · value), related
    chips ("Used by", "Matrix"), actions on the right (P2) → scrolling content (matrix table,
    competency editor, step list).
- **Responsive:** desktop side by side. Career structure (only) switches to **list or detail** below
  1024px, with a Back button in the detail. The other two tabs aren't responsive yet (Setup
  responsive work is paused; plan in `../../what should be done.md`).
- **States:** Draft / Published (positions) or Draft / Active / Archived (matrices, paths): read-only
  when not Draft, with the reason on the locked action (P8). Empty list (not designed).
- **Components:** Input, Item, Badge, Button, Tabs, DropdownMenu, Sheet (history), AlertDialog.
- **Rules / decisions:** the open tab and selection are kept in the URL (`?tab=`). Preview → Confirm
  for every save (P4).
- **Components (2026-09-29):** list rows are `Item size="sm" inset="md"`; search is an `InputGroup` with
  a leading icon.
- **Open:** mobile for Matrices and Career path.

_Career workspace (My Career) was proposed and **dropped** (2026-09-28): it doesn't repeat, so it's
neither a template nor a pattern. Its decisions stay in `my-career-build.md`._

## Patterns

### P1 · Page header — candidate

- **Scope:** Setup and My Career.
- **Anatomy:** left: H1 (`text-heading-xl`) + one secondary line (My Career: "Lan Nguyen ·
  Backend Engineer L2 · Mid"). Right, on one row: an **Alert** as wide as its content (Setup:
  success "Your setup is N% done" + progress bar; My Career: info "{path} changed {date}" + "See
  what's different") → view switch (My Career: Map / List) → **Ask AI** (outline, hidden while the chat
  is open, tooltip "Ask AI (⌘I)").
- **Responsive:** wraps; below 640px the Alert takes its own full-width row under the title. Ask AI
  shows from 1024px.
- **Rules / decisions:** the status Alert belongs on the header row, not in the page body
  (2026-09-28); never full width on desktop; `role="status"` (not urgent).
- **Components:** Alert, Progress, ButtonGroup, Button, Tooltip.
- **Components (2026-09-29):** the status Alert is `size="sm"`; Map / List are ghost buttons in a
  ButtonGroup with the current view `aria-pressed` (Button's pressed state).

### P2 · Detail header actions — candidate

- **Scope:** Position detail, Matrix detail, Career path detail.
- **Anatomy (left → right):** **Edit** (outline; locked with a reason when not editable, P8) → **"…"**
  menu (History · separator · Duplicate position / Duplicate matrix) → the **lifecycle action**:
  Publish (primary, Draft) · Unpublish (outline, Published position) · Archive (outline, Active matrix)
  · Restore (primary, Archived matrix).
- **Rules / decisions:** secondary → overflow → primary, so the main action sits last (2026-09-23).
  **Use a "…" menu only when there are many secondary actions** (2026-09-28): Position and Matrix
  have History + Duplicate + Edit, so History and Duplicate go in the menu; **Career path has few, so
  History stays its own outline button**. The "…" menu is `modal={false}` because its items open a
  Sheet / Dialog (a modal menu left the page unclickable). Duplicate opens the Create dialog prefilled
  (matrix name "A" → "A1").
- **Components:** Button, DropdownMenu, Tooltip, AlertDialog.

### P3 · History drawer — candidate

- **Scope:** Position, Matrix, Career path (text list, `setup/history-drawer.tsx`); Path history in
  My Career (grouped rows, `my-career/path-history-drawer.tsx`).
- **Anatomy:** right Sheet → title ("History" / "Path history") + the object's name → entries, newest
  first. Text form: one Item per entry ("what" + "who · when"). Grouped form (2026-09-28, option A):
  "{date} · by {who}", then one Item per changed role with a + / − icon, a one-line note and a Badge
  when it matters ("New on your path", "Was your target").
- **States:** empty ("No history yet").
- **Components:** Sheet, Item, Badge, Empty.
- **Decided (2026-09-28): keep both forms**: text for Setup objects, grouped rows for Path history.

### P4 · Preview → Confirm dialog — candidate

- **Scope:** every change that saves: Publish / Unpublish position; Publish / Archive / Restore
  matrix; Publish / Archive / Restore career path; Set as target; Remove target; Switch company path; Remove a
  Career vision or added steps (12 actions, served by 10 AlertDialogs; some dialogs handle two or three actions).
- **Anatomy:** AlertDialog → title as a question ("Publish Backend Engineer?") → one line on the
  effect → optional **From → To** rows (My Career) or an impact list (positions a matrix change
  touches, cards that leave the map) → optional warning Alert → Cancel + the action named by its verb
  ("Publish", "Set as target", not "OK").
- **Rules / decisions:** nothing saves without it (PRD-018 RQ-07, PRD-020 RQ-10); a toast confirms
  after. A change that can't go ahead says why: the matrix Publish dialog lists what's not ready and disables Publish; Remove hides its button and shows the reason in the panel footer.
- **Components:** AlertDialog, Alert, Toast.

### P5 · Detail panel — candidate

- **Scope:** My Career: role panel (a card) and route panel (a company path or Career vision). Code:
  `Panel` in `my-career/my-career-panels.tsx` (**private helper: needs extracting before it can get an
  ID**).
- **Anatomy:** header: title (+ level in secondary) and × → **badge on its own line, the context line
  under it** (same in every panel, 2026-09-28) → scrolling content → **footer pinned to the bottom**:
  notes first, then full-width buttons (primary, outline, then red ghost).
- **Responsive:** right column 400px from 1024px; below that, under the work area.
- **Components:** Badge, Button, plus the content (P7, P6).

### P6 · Step rail — candidate (**built 2026-09-28**)

- **Scope:** one design-system component, **`StepRail`** + `StepRailItem`
  (`components/ui/step-rail.tsx`), used in three places:
  - Explore a position preview: `RoutePreview` in `my-career/plan-dialogs.tsx` (thin wrapper);
  - List view rows: `CareerMapList` in `components/ui/career-map.tsx`;
  - route panel steps: `RouteSteps` in `my-career/my-career-panels.tsx` (thin wrapper; was a list of
    status icons before 2026-09-28).
- **Anatomy (rails):** a vertical rail in the route's colour (solid green = path you follow, solid grey
  = other company path, dashed violet = Career vision) with a ring per role; the start row is grey
  context ("Starts from …"); a role already on the map reads "· already on your map".
- **Rules / decisions:** the map's line language turned on its side (2026-09-26); dots are solid rings
  over the rail (a dashed ring breaks up). **One implementation for all of them** (2026-09-28):
  the design-system component **`StepRail`** (`components/ui/step-rail.tsx`, `Navigation/Step Rail`,
  spec `step-rail.meta.json`), **used by all three** (2026-09-28): List view rows (CareerMapList),
  the route panel (was a list of status icons) and the Explore preview.

### P7 · Competency status groups — approved (`enp-pat-competency-status-groups`)

- **Approved** by the user 2026-09-30, although it appears in one place only (an exception to the
  "2+ places" rule for candidates). Goes into `catalog-entries.json` when the catalog is built.

- **Scope:** every My Career role panel (`my-career/gap-row.tsx`); since 2026-09-30 also the growth area
  groups of the Action plan (`my-actions/growth-area-group.tsx`): one Card per growth area, action
  rows as an Accordion compact, row buttons beside the trigger (never inside it).
- **Anatomy:** one Card per group, in this order: **Growth areas** (You → Needed) · **Not assessed
  yet** (Needed) · **Ready** (collapsed, Show) · **Not set in Setup** (collapsed). Rows are Accordion
  items: name + short value; expanded: what the needed point looks like (+ Plan an action) / "No
  approved score yet" / the source of a Ready score.
- **Rules / decisions:** employee UI says "growth area", never "gap"; points never "levels"; "Not
  assessed yet" has no button (2026-09-28); no readiness %.
- **Components:** Card, Accordion, Collapsible, Button.
- **Components (2026-09-29):** each group is `Card size="compact"`, rows an `Accordion size="compact"`.

### P8 · Locked action with a reason — candidate

- **Scope:** Edit position ("Unpublish to edit"), Edit matrix ("Archive to edit" / "Restore to
  edit"), fill ratings in the matrix table ("Unpublish to edit").
- **Anatomy:** the action stays **visible but disabled**, with a Tooltip saying how to unlock it. The
  disabled button sits inside `<span className="inline-flex">` so the tooltip still triggers.
- **Rules / decisions:** disabled controls say why; a disabled destructive action uses a grey ghost,
  not faded red (2026-09-26).
- **Components:** Tooltip (`Tip`), Button.

### P9 · Ask AI chat panel — candidate

- **Scope:** Setup and My Career. Code: `chat/assistant-panel.tsx`, `my-career/career-chat.tsx`.
- **Anatomy:** right panel 380px (page-panel look: `radius/panel`, border) → header (sparkle, title,
  New chat · Chat history · Close) → conversation (empty state with suggestions) → prompt input with a
  mode / model select.
- **Rules / decisions:** closed by default; opening collapses the sidebar; **AI never saves**: a change
  comes as a proposal card the person accepts ("Add to my map"); the answer shows what it read first
  ("Read your assessment…").
- **Components:** AI Elements (Conversation, Message, PromptInput, Suggestion, Tool), Button.
- **Open:** fixed 380px, no mobile form (hidden below 1024px). Mode / model selects use
  `PromptInputSelectTrigger size="sm"` (2026-09-29).
