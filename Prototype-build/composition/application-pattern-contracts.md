> **Vendored from En UI** (`.agents/skills/en-ui-consumer/references/`, 2026-09-21) before the En UI folder is deleted. Rule text is unedited; where it names En UI, read it through this table.
>
> | This file says | In Enpath | Where |
> |---|---|---|
> | En UI tokens / DESIGN.md | Enpath tokens — `enpath-design-system.md` (rules + theme decisions), values in `Tokens/*.tokens.json` | root |
> | `Typography.*` presets (H1, Label, Eyebrow…) | Enpath has no Typography component — use the 18 text styles; unadopted presets are parked | `enpath-design-system.md` §Typography |
> | Geist Mono | Roboto Mono | `enpath-design-system.md` §Theme Decisions |
> | `space.md`, `gap-md` (En UI spacing names) | `spacing/component/*` · `spacing/layout/*` — same pixel values, different names | `enpath-design-system.md` §Spacing |
> | `pnpm exec en-ui-audit`, `../scripts/rendered-page-audit.mjs` | Not available. Use Playwright/Storybook screenshots + axe | — |
> | Separation ladder, WCAG 2.2 AA, 24px target | Adopted as-is | `enpath-design-system.md` |


# Application-owned pattern contracts

Use an application-owned contract when a page composition or layout recurs across routes, carries protected product behavior, or needs a stable agreement between design, frontend, tests, and AI-assisted implementation.

The contract and implementation belong to the consumer repository. Do not add shells, headers, sidebars, pages, workspaces, or layout patterns to `@enosta/en-ui`; the package boundary remains atomic even when several applications use similar geometry.

## Placement and format

Follow the consumer's existing feature, architecture, specification, or design convention. A contract may be Markdown, JSON, TypeScript, or another locally validated format. Do not introduce a repository-wide folder or schema when one already exists.

When no convention exists, place a concise contract beside the shared pattern implementation. Use a name such as `<pattern>.contract.md` or `<pattern>.contract.json`, whichever the repository can review and validate reliably.

## Required decisions

A reusable pattern contract must define:

1. **Identity and scope**: a stable name, owning product area, intended routes, maturity, and explicit non-goals.
2. **Purpose and priority**: the recurring task, communication goal, or experience the pattern supports and which content deserves emphasis.
3. **Anatomy**: named regions, their responsibilities, required or optional status, semantic landmarks, and heading ownership.
4. **Responsive transformations**: what stays, wraps, reorders, condenses, discloses, scrolls, or changes representation at supported container or viewport widths.
5. **States and permissions**: loading, empty, error, long-content, disabled, read-only, selected, restricted, and destructive behavior that affects geometry or meaning.
6. **Dependencies**: public En UI components and tokens used by the pattern. Do not reference package internals or copy protected component behavior.
7. **Rules**: accessibility, navigation, overflow, focus, content-priority, and interaction invariants that implementations must preserve.
8. **Evidence**: required examples, tests, accessibility checks, and rendered viewport or container checks.

## Lightweight template

Adapt this structure rather than copying it mechanically:

```markdown
# Pattern: <name>

- Owner: <product area>
- Used by: <routes or workflows>
- Status: draft | accepted | deprecated
- Primary purpose: <task, communication goal, or experience>
- Non-goals: <what this pattern does not standardize>

## Anatomy

| Region             | Required | Responsibility | Landmark or heading owner |
| ------------------ | -------- | -------------- | ------------------------- |
| Primary work       | Yes      | ...            | ...                       |
| Supporting context | No       | ...            | ...                       |

## Responsive behavior

| Region       | Narrow | Medium | Wide | Container constraint |
| ------------ | ------ | ------ | ---- | -------------------- |
| Primary work | ...    | ...    | ...  | ...                  |

## States and permissions

- Loading: ...
- Empty: ...
- Error: ...
- Restricted: ...
- Long content: ...

## En UI dependencies

- Components: ...
- Tokens: ...

## Protected rules

- ...

## Verification

- Stories or fixtures: ...
- Tests: ...
- Rendered widths and pane sizes: ...
```

## Implementation boundary

The contract defines outcomes and invariants, not one universal JSX tree. Different product areas may implement different compositions when their contracts explain the difference. Prefer local semantic wrappers, consumer-owned layout components, and En UI atoms.

When a page is unique, keep its composition in the route or feature and record only the lightweight hierarchy decision. Do not extract a reusable pattern or create a contract solely to satisfy process.
