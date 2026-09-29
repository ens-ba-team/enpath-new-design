---
title: Design patterns
created: 2026-09-28
updated: 2026-09-29
status: First pass reviewed in part (2026-09-28): 1 layout, 1 template, 9 patterns as candidates. No IDs yet. Checked against the code 2026-09-29.
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
3. **A change of look found at a place of use is debt.** It goes into
   [Needs a Storybook update](#needs-a-storybook-update) until it becomes a variant / size of the
   component (or is removed).

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
| P7 | Pattern | Competency status groups | My Career role panel only (**doesn't repeat yet**: keep or drop?) |
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
- **Open:** Items use a local side padding (debt #11); the search Input pads itself instead of using
  InputGroup (debt #8); mobile for Matrices and Career path.

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
- **Open:** Alert padding is overridden in both places (debt #2); Map / List pressed look by hand
  (debt #4).

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

### P7 · Competency status groups — candidate

- **Scope:** every My Career role panel. Code: `my-career/gap-row.tsx`.
- **Anatomy:** one Card per group, in this order: **Growth areas** (You → Needed) · **Not assessed
  yet** (Needed) · **Ready** (collapsed, Show) · **Not set in Setup** (collapsed). Rows are Accordion
  items: name + short value; expanded: what the needed point looks like (+ Plan an action) / "No
  approved score yet" / the source of a Ready score.
- **Rules / decisions:** employee UI says "growth area", never "gap"; points never "levels"; "Not
  assessed yet" has no button (2026-09-28); no readiness %.
- **Components:** Card, Accordion, Collapsible, Button.
- **Open:** Accordion and CardTitle are shrunk locally (debt #1, #13).

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
- **Open:** fixed 380px, no mobile form (hidden below 1024px); select triggers restyled (debt #16).

---

## Needs a Storybook update

Places where a screen changes how a design-system component looks. Each should become a variant or
size of the component (in the `.tsx`, its story and `meta.json`), then the screen uses that instead.
Found by scanning `src/features` and `src/app` for visual classes on design-system components
(2026-09-28); still present and line numbers checked 2026-09-29. **Not fixed yet.**

| #   | Component                                  | Where                                                                                           | What the screen overrides                                                                                                                                                  | Proposed change in the component                                                                  |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | **Accordion**                              | `my-career/gap-row.tsx:114–119`                                                                 | trigger padding `spacing/component/lg` → `spacing/component/sm`, trigger `text-body-sm` instead of the component's style, content bottom padding, last item without border | `size="compact"` (the code already says "local override until the Accordion gets a compact size") |
| 2   | **Alert**                                  | `setup/setup-screen.tsx:566`, `my-career/my-career-panels.tsx:135`                              | padding lg → `px md / py sm` (one-line Alert in a page header)                                                                                                             | `size="sm"` (compact, one line)                                                                   |
| 3   | **Button** (link)                          | `my-career/my-career-panels.tsx:141`                                                            | `h-auto px-0` so a link button sits inline                                                                                                                                 | the `link` variant has no control height / side padding by default                                |
| 4   | **Button** (pressed)                       | `my-career/my-career-screen.tsx:209` (Map / List switch)                                        | pressed fill by hand: `bg-[--button-ghost-bg-active]` when pressed (the `font-semibold` is an allowed state exception)                                                                                | Button styles `aria-pressed` itself (or a Toggle Group component)                                 |
| 5   | **Button** (outline, count)                | `my-career/my-career-panels.tsx:239` (progress-strip counts)                                    | `text-body-sm` instead of the button's label style                                                                                                                         | decide: a quieter button option, or accept the default style                                      |
| 6   | **Button** (icon, muted)                   | `my-career/my-career-panels.tsx:269` (ⓘ)                                                        | icon colour `--color-icon-muted`                                                                                                                                           | a muted icon-button option, or accept the default colour                                          |
| 7   | **Button / SelectTrigger** on the map      | `my-career/my-career-screen.tsx:218, 222`                                                       | background `--color-surface-default` (controls over the canvas)                                                                                                            | check the outline defaults; if they're transparent, an opaque "on canvas" option                  |
| 8   | **Input** with a search icon               | `setup/setup-screen.tsx:148`, `setup/matrices-screen.tsx:59`                                    | `pl-[xl]!` to make room for the icon                                                                                                                                       | use **InputGroup** (exists) with a leading icon                                                   |
| 9   | **Input** as an inline title               | `setup/matrices-screen.tsx:276`                                                                 | `text-heading-sm` instead of the input's style                                                                                                                             | a title size, or a separate inline-edit component                                                 |
| 10  | **Textarea** for pasted data               | `setup/import-positions-dialog.tsx:96`                                                          | `text-code-sm`                                                                                                                                                             | a monospace option (machine text, allowed by the mono rule)                                       |
| 11  | **Item** in master lists                   | `setup/setup-screen.tsx:164`, `setup/matrices-screen.tsx:67`, `setup/career-path-screen.tsx:97` | side padding → md                                                                                                                                                          | a list-row padding option (same in all three Setup lists)                                         |
| 12  | **Item** description                       | `setup/history-drawer.tsx:33`                                                                   | description `text-body-xs`                                                                                                                                                 | check Item `size="sm"` description size                                                           |
| 13  | **CardTitle**                              | `my-career/gap-row.tsx:99`                                                                      | `text-heading-xs` instead of the card title's style                                                                                                                        | Card compact size (goes with #1)                                                                  |
| 14  | **Separator**                              | `app-shell.tsx:89, 158` (sidebar), `setup/matrices-screen.tsx:150`                              | colour `--color-sidebar-border` / `--color-border-subtle`                                                                                                                  | `tone` option (default / subtle / sidebar)                                                        |
| 15  | **Progress**                               | `setup/setup-screen.tsx:571`                                                                    | track `--color-background-default`, fill green (`[&>div]:bg-success`)                                                                                                      | `tone="success"`                                                                                  |
| 16  | **PromptInputSelectTrigger** (AI Elements) | `chat/assistant-panel.tsx:203, 210`                                                             | `h-7`, no border, no shadow, `text-body-xs`                                                                                                                                | a compact / borderless trigger option                                                             |
| 17  | **CollapsibleTrigger**                     | `setup/setup-screen.tsx:154` (department group header)                                          | radius, padding on a bare trigger                                                                                                                                          | check: a styled group-header component, or a pattern built from Button                            |

**Label weight (resolved 2026-09-29):** no `font-medium` is left in the code; labels and small headings take their weight from the text-style tokens. A lone `font-semibold` for a selected state (Sidebar, Item, Map / List) is an allowed exception (rulebook → Token rules → Text styles), not debt.

**Not debt (composition, belongs to a pattern):** `min-h-0` on Tabs / Conversation (scroll
containment), `border-t` on TabsContent and CareerMapLegend (separating panes), TabsList side
padding aligned with the page, chat panel paddings (`ConversationContent`, empty state). These go
into the pattern entries when written.

**Excluded:** `app-shell.tsx:86–87` (`SidebarMenuItem`) — false hit, the class belongs to the icon
inside it.
