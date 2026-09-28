---
title: Design patterns
created: 2026-09-28
updated: 2026-09-28
status: Started. Rules + the "Needs a Storybook update" list are filled; layouts, templates and patterns await the first pass.
related: glossary.md, my-career-build.md, set-up-build.md, ../Skills/catalog-build/enpath-catalog-plan.md, ../Prototype-build/composition/application-pattern-contracts.md, ../Tracking/Storybook Status.md
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
| **Component** | One design-system component, global. Inherited from Agentic (incl. AI Elements) or made for Enpath (`career-map`, `stat`) | `enpath-ui/src/components/ui/`, `components/ai-elements/` | Given when the catalog is built (`agt-cmp-…` / `enp-cmp-…`) |
| **Pattern** | Several components put together for a job that recurs, with rules | `enpath-ui/src/features/…` | After approval (`enp-pat-…`) |
| **Template** | A page type that repeats across routes | a route + its screen | After approval (`enp-tpl-…`) |
| **Layout** | The shell every page sits in | `features/enpath/app-shell.tsx` | After approval (`enp-lay-…`) |

## Lifecycle

```
candidate  ──review──▶  approved (gets its ID, goes into the catalog)  ──…──▶  deprecated (replacedBy)
```

- **Candidate** when it appears in **2+ places**, or a design decision was made about it.
- **Approved** only by the user. Then it gets a permanent ID and an entry in
  `Machine Readable/catalog-entries.json`; the catalog renders it. IDs never change or get reused.
- Each entry follows the contract format in
  `Prototype-build/composition/application-pattern-contracts.md`, kept short: identity and scope ·
  purpose · anatomy · responsive · states · components used · rules and decisions (date + why) ·
  evidence · open questions.

---

## Layouts

_First pass pending._

## Templates

_First pass pending._

## Patterns

_First pass pending._

---

## Needs a Storybook update

Places where a screen changes how a design-system component looks. Each should become a variant or
size of the component (in the `.tsx`, its story and `meta.json`), then the screen uses that instead.
Found by scanning `src/features` and `src/app` for visual classes on design-system components
(2026-09-28). **Not fixed yet.**

| # | Component | Where | What the screen overrides | Proposed change in the component |
|---|---|---|---|---|
| 1 | **Accordion** | `my-career/gap-row.tsx:114–119` | trigger padding 16 → 8px, trigger weight normal, content bottom padding, last item without border | `size="compact"` (the code already says "local override until the Accordion gets a compact size") |
| 2 | **Alert** | `setup/setup-screen.tsx:562`, `my-career/my-career-panels.tsx:136` | padding lg → `px md / py sm` (one-line Alert in a page header) | `size="sm"` (compact, one line) |
| 3 | **Button** (link) | `my-career/my-career-panels.tsx:145` | `h-auto px-0` so a link button sits inline | the `link` variant has no control height / side padding by default |
| 4 | **Button** (pressed) | `my-career/my-career-screen.tsx:206` (Map / List switch) | pressed look by hand: `bg-[--button-ghost-bg-active]` + `font-semibold` when `aria-pressed` | Button styles `aria-pressed` itself (or a Toggle Group component) |
| 5 | **Button** (outline, count) | `my-career/my-career-panels.tsx:239` (progress-strip counts) | `font-normal` | decide: a normal-weight option, or accept the default weight |
| 6 | **Button** (icon, muted) | `my-career/my-career-panels.tsx:269` (ⓘ) | icon colour `--color-icon-muted` | a muted icon-button option, or accept the default colour |
| 7 | **Button / SelectTrigger** on the map | `my-career/my-career-screen.tsx:215, 219` | background `--color-surface-default` (controls over the canvas) | check the outline defaults; if they're transparent, an opaque "on canvas" option |
| 8 | **Input** with a search icon | `setup/setup-screen.tsx:148`, `setup/matrices-screen.tsx:59` | `pl-[xl]!` to make room for the icon | use **InputGroup** (exists) with a leading icon |
| 9 | **Input** as an inline title | `setup/matrices-screen.tsx:275` | `text-base font-semibold` | a title size, or a separate inline-edit component |
| 10 | **Textarea** for pasted data | `setup/import-positions-dialog.tsx:96` | `font-mono text-xs` | a monospace option (machine text, allowed by the mono rule) |
| 11 | **Item** in master lists | `setup/setup-screen.tsx:162`, `setup/matrices-screen.tsx:65`, `setup/career-path-screen.tsx:94` | side padding → md | a list-row padding option (same in all three Setup lists) |
| 12 | **Item** description | `setup/history-drawer.tsx:33` | description `text-xs` | check Item `size="sm"` description size |
| 13 | **CardTitle** | `my-career/gap-row.tsx:99` | `text-sm` | Card compact size (goes with #1) |
| 14 | **Separator** | `app-shell.tsx:89, 158` (sidebar), `setup/matrices-screen.tsx:150` | colour `--color-sidebar-border` / `--color-border-subtle` | `tone` option (default / subtle / sidebar) |
| 15 | **Progress** | `setup/setup-screen.tsx:571` | track `--color-background-default`, fill green (`[&>div]:bg-success`) | `tone="success"` |
| 16 | **PromptInputSelectTrigger** (AI Elements) | `chat/assistant-panel.tsx:203, 210` | `h-7`, no border, no shadow, `text-xs` | a compact / borderless trigger option |
| 17 | **CollapsibleTrigger** | `setup/setup-screen.tsx:154` (department group header) | radius, padding on a bare trigger | check: a styled group-header component, or a pattern built from Button |

**Not debt (composition, belongs to a pattern):** `min-h-0` on Tabs / Conversation (scroll
containment), `border-t` on TabsContent and CareerMapLegend (separating panes), TabsList side
padding aligned with the page, chat panel paddings (`ConversationContent`, empty state). These go
into the pattern entries when written.

**Excluded:** `app-shell.tsx:86–87` (`SidebarMenuItem`) — false hit, the class belongs to the icon
inside it.
