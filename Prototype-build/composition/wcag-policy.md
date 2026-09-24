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


# WCAG policy

- Target WCAG 2.2 AA for every stable component and accepted consumer composition.
- Normal text requires 4.5:1; large text requires 3:1; essential UI boundaries and focus indicators require 3:1 against adjacent colors.
- Hover, checked, selected, and toggled states are not contrast exceptions. Audit their rendered foreground, background, boundary, and focus colors separately from the default state.
- WCAG 2.2 AA target size is 24px by 24px with defined exceptions. En UI uses 28px compact, 32px comfortable, and 36px spacious targets; the 44px AAA target is advisory for touch-primary controls.
- AAA normal-text contrast of 7:1 is reported as an opportunity, not a universal release blocker.
- Do not count decorative signal rails or redundant status marks as text. The accompanying text and essential boundary must independently pass.
- Test every supported mode. A light-mode pass does not imply dark-mode conformance.
- Automated axe results are necessary but incomplete; keyboard order, visible focus, content clarity, zoom, reflow, and cognitive load still require review.
