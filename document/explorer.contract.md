---
title: "Pattern: Career structure explorer"
created: 2026-09-21
status: draft
owner: Setup / Career structure
format: application-owned pattern contract (per Enpath-design-system/Prototype-build/composition/application-pattern-contracts.md)
related: ../../what should be done.md, glossary.md, set-up-build.md, ../enpath-design-system.md
---

#enpath #setup #pattern-contract

# Pattern: Career structure explorer

- **Owner:** Setup / Career structure
- **Used by:** the career structure workspace (left pane); any route that needs to navigate Positions → Levels → Career Paths
- **Status:** draft
- **Primary purpose:** let an admin find a Position, Level or Career Path, and see **what still needs attention** without opening Overview
- **Non-goals:**
  - Not a general app navigation — that is the shell's activity bar
  - Does not edit. Selection only. All editing happens in the middle pane
  - Does not replace Overview's company-wide readiness view
  - Does not own Competency Matrix browsing (shared library, separate surface)
  - Does not standardise any other tree in the product

---

## Anatomy

| Region | Required | Responsibility | Landmark / heading owner |
|---|---|---|---|
| Container | Yes | Named navigation region for the pane | `<nav aria-label="Career structure">` |
| Filter | No | Text filter across Position name, code and Level label | none — labelled control |
| Positions group | Yes | Group label for the Position list | `<h2>` visually restrained |
| Position item | Yes | One job family: name, code, attention indicator, expand control | `treeitem`, owns its own name |
| Level list | No | Levels of one Position, **in sequence order** | `group` inside the Position `treeitem` |
| Level item | No | One Position-Level: label, attention indicator, headcount | `treeitem` |
| Career Paths group | No | Paths, listed after Positions | `<h2>` |
| Path item | No | One path: name, status, attention indicator | `treeitem` |
| Empty state | Yes | No Positions yet, or filter matched nothing | — |

**Structure:** a single tree, not two lists. Positions and Career Paths are two `group`s inside one `tree`, so one arrow-key model covers the whole pane.

**Attention indicator** is a dot plus an accessible name — never colour alone. It means *"something inside here is not ready"*, and it propagates upward: a Level missing expectations marks its Position too.

---

## Responsive behavior

| Region | Narrow (390) | Medium (768) | Wide (1280) | Container constraint |
|---|---|---|---|---|
| Explorer pane | Hidden; opened as an overlay from the page header | Collapsible, overlays content when open | Persistent, resizable | width is a consumer semantic token, not a `max-w-*` alias |
| Filter | Always visible when the pane is open | Always visible | Always visible | full pane width |
| Position item | Name wraps to 2 lines max, then truncates with full text available | same | single line, truncate | never truncate the attention indicator |
| Level list | Collapsed by default | Collapsed except the active Position | Active Position expanded | — |
| Career Paths | Collapsed group | Collapsed group | Expanded if ≤ 10 paths | — |

The pane scrolls independently of the middle pane (`overflow-y-auto`; scrollbars are themed globally).

**Content width rule:** the pane width is `max-w-[var(--explorer-width)]` with a real `rem` value. Never `max-w-xs` / `max-w-72`.

---

## States and permissions

- **Loading:** skeleton rows at the same height as real rows, so the pane does not reflow when data lands. Never a centred spinner — the pane has structure to preserve.
- **Empty (no Positions):** explain the first action and link to it. This is the true start of Setup.
- **Empty (filter):** state what was searched and offer to clear. Do not show a zero-height pane.
- **Error:** the pane keeps its frame and reports inline. Never blank the pane.
- **Long content:** ≥ 30 Positions groups by department, with the groups collapsible. **Unresolved — see Open questions.**
- **Archived Position:** visible only when explicitly filtered in; de-emphasised, never the default view.
- **Read-only / restricted admin:** the tree renders identically. Selection still works. Only the middle pane's actions change — **the explorer never hides structure a user is allowed to see.**
- **Selected:** exactly one item. Must not rely on colour alone (same principle as R-ENP-06) — pair with a boundary or weight change.
- **Attention:** any item whose subtree is not ready. Removed the moment the underlying condition clears; it is derived, never stored.

---

## Design-system dependencies (Enpath)

**Components:** `Badge`, `Separator`, `Input` (filter), `Tooltip`, `Skeleton`, `Button`. Icons: Phosphor Regular.

**Tokens:**
- Row height: `height/control-touch/sm` → `sm:height/control/sm` (32 → 28px) — compact tier, above the 24px AA target
- Spacing: `spacing/component/xs` … `spacing/component/lg`
- `color/background/default` + foreground (pane), `color/surface/default` + foreground, `color/surface/raised` + heavier weight for the selected row (sidebar tokens are scoped to the Sidebar component)
- `radius/control`
- Text styles: `body/sm` for Position names, `body/xs` for codes and counts

**Enpath-owned:** the tree itself. The design system has no tree component yet, so it is built from semantic HTML plus the components above — and should be added to the design system once it settles.

⚠️ **Codes, headcounts and level numbers are Nunito, not mono.** They look technical but are not machine-oriented text.

---

## Protected rules

1. **Selection never writes.** The explorer cannot trigger a governed write. Every change routes through Preview → Confirm in the middle pane.
2. **Attention is derived, never authored.** It reflects current readiness. No stored flag.
3. **Attention is never colour-only** — dot plus accessible name, always.
4. **Levels render in sequence order.** Never alphabetical, never by creation date.
5. **Full keyboard operation:** roving tabindex, ↑/↓ move, →/← expand/collapse, Home/End jump, type-ahead. One tab stop for the whole tree.
6. **Selection is announced** — the active item is `aria-current`, and the middle pane's heading changes with it.
7. **No engineering vocabulary.** "Position", "Level", "Career Path" — never "node", "cell", "entity". (`glossary.md` → *Words to keep out of the UI*.)
8. **Truncation never hides state.** Names truncate; attention indicators and status never do.
9. **Archived is a filter, not a style-only difference.**

---

## Verification

**Fixtures:** 0 Positions · 1 Position / 1 Level · 5 Positions (prototype parity) · **80 Positions across 6 departments** · a Position with a 40-character name · a Career Path crossing two Positions · an archived Position.

**Tests:**
- Keyboard: full traversal with no mouse; one tab stop; type-ahead reaches a deep Level
- Screen reader: tree/group/treeitem announced; expanded state correct; attention read as text
- Attention propagation: clearing the last missing expectation clears the Level *and* the Position dot
- Selection does not mutate
- Filter with no match renders the empty state, not a collapsed pane

**Accessibility:** WCAG 2.2 AA. Per `Prototype-build/composition/wcag-policy.md`, audit **hover, selected and focused states separately** — selected-row contrast is not covered by the default-state check.

**Focus:** 2px `color/ring` (brand indigo, 6.52:1 on white — passes 3:1). The explorer is keyboard-primary, so also pair focus with a background change for legibility.

**Rendered checks:** 390 / 768 / 1280, plus a narrow and a wide pane at 1280. If rendered validation cannot run, report the UI as visually unvalidated.

---

## Open questions — do not resolve silently

| # | Question | Blocks |
|---|---|---|
| E1 | **OQ-01: does readiness count by Level or by cell?** Overview says 4/8 levels, Competency Matrix says 24/48 cells. The attention dot must mean one thing | attention semantics |
| E2 | At 80 Positions, is department grouping correct — and where does department come from? `ID Service` owns org units and is read-only | long-content state |
| E3 | Do Career Paths belong in this tree at all, or in their own surface? They are the only non-hierarchical thing in a hierarchy | anatomy |
| E4 | Keyboard reorder of Levels is open in PRD-003. If it lands, does it live here or in the middle pane? | protected rule 1 |
| E5 | Does a pending chat change show in the explorer, or only in the middle pane? (`what should be done.md` open item) | states |

---

*Format per `Enpath-design-system/Prototype-build/composition/application-pattern-contracts.md`. Domain terms per `glossary.md`. Tokens and components per `Enpath-design-system/enpath-design-system.md`.*
