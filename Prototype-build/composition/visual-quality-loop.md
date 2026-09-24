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


# Visual quality loop

Use this completion workflow for a substantial page, shell, feature surface, or material layout change. The goal is a rendered interface whose intent, hierarchy, component choices, craft, responsive behavior, states, and accessibility withstand deliberate critique.

## Before implementation

Record:

- The user's explicit direction and accepted references.
- The purpose, audience, success condition, and content priorities.
- A concise visual thesis covering character, hierarchy, density, and expressive devices.
- Major regions and consequential component choices.
- Transformations across supported viewport and container sizes.
- Representative states that materially affect geometry, meaning, or interaction.

When an accepted design or established consumer pattern exists, follow it and spend the iteration budget on faithful execution. When consequential direction is unresolved, use [composition-exploration.md](composition-exploration.md) to compare at least two materially different structural candidates in working notes. Do not create alternatives merely to satisfy process.

## Render matrix

Use the consumer's established devices, browser-test projects, screenshots, breakpoints, and layout constants. When no viewport matrix exists, derive test sizes from the changed layout: inspect the supported extremes and both sides of each transition that materially changes composition. Add minimum, default, and maximum widths for nested or resizable regions when relevant.

Capture the initial viewport as well as the full surface. Use representative content, including realistic length, media aspect ratios, localization, and non-ideal states that affect layout.

Use Playwright or the consumer's established browser harness to exercise the primary interaction path and capture stable evidence. Use an interactive browser during iteration to inspect computed geometry, loaded fonts and tokens, overflow owners, focus, overlays, and responsive changes. Capturing files without reviewing the rendered result is not validation.

## Review foundations

- Typography uses the declared role rather than an arbitrary size. Judge display scale against the accepted direction, and flag unreadable body roles, weak line height, or supporting content styled like primary content.
- Spacing communicates relationships. Tight, related, section, page, inset, and stack roles must not collapse into one repeated gap.
- Elevation follows the visual thesis and En UI tokens. Flag shadows or layered effects that create ambiguous hierarchy, obscure contrast, or conflict with interaction depth.
- Interaction states remain deliberate across default, hover, active, focus, checked, mixed, selected, and disabled-adjacent states. Foreground, background, boundary, and focus colors must remain intentional token pairs.
- Layout preserves alignment lines, container balance, predictable action placement, readable measure, responsive reflow, and deliberate overflow ownership.
- Foundations are visibly loaded. Default browser typography, unstyled controls, unresolved CSS variables, collapsed regions, or a page that is only semantic HTML are blocking failures.

## Screenshot-first structural review

Review screenshots before reading or defending the implementation. Judge:

1. Does the result feel faithful to the brief, product evidence, and visual thesis?
2. Can the intended purpose, story, or task be understood quickly enough for its context?
3. Does hierarchy match the content priorities, including deliberate equality where comparison is the goal?
4. Does every consequential En UI atom match the required behavior and installed contract?
5. Does each major region transform intentionally at every supported size?
6. Are surfaces, imagery, contrast, and motion purposeful rather than compensating for weak structure?
7. Do proportions and alignment create a coherent rhythm rather than a generic template?
8. Is there a deliberate product-specific idea in the composition or interaction, rather than only technically correct En UI atoms?

Record material findings with screenshot, viewport, visible evidence, user impact, and the smallest aligned remediation. Correct structural findings before polishing details.

If intent fidelity, hierarchy, component appropriateness, or responsive composition would score below 4, do not merely polish the current arrangement. Revisit the visual thesis or render a structurally different candidate, then continue with the stronger result.

## Finish review

After structural corrections, recapture affected viewports and review:

- Spacing distinguishes tight, related, section, page, and intentionally expansive relationships.
- Typography, imagery, color, surface, and motion form one coherent direction.
- Alignment, gutters, text measure, wrapping, truncation, and media cropping remain intentional with real content.
- Primary, secondary, destructive, navigational, and contextual actions have appropriate weight and placement.
- Relevant default, hover, active, focus, selected, disabled, loading, empty, error, and reduced-motion states remain understandable.
- No uncontrolled overflow, clipped required content, broken interaction, unexplained console error, or WCAG A/AA violation remains.
- Common generated motifs have been questioned without flattening accepted creative intent.

Automated findings supplement screenshot judgment; they do not replace it.

## Quality score

Score only after the structural and finish reviews:

| Dimension                     | Weight | Passing evidence                                                               |
| ----------------------------- | -----: | ------------------------------------------------------------------------------ |
| Intent fidelity and hierarchy |     25 | The result expresses the accepted direction and content priorities clearly.    |
| Component appropriateness     |     20 | Consequential choices match installed contracts and required behavior.         |
| Composition and craft         |     20 | Proportion, spacing, alignment, type, media, color, and motion are deliberate. |
| Responsive composition        |     15 | Each major region transforms intentionally at every required size.             |
| Accessibility and states      |     15 | WCAG A/AA, keyboard behavior, overflow, and relevant states are sound.         |
| Content fidelity              |      5 | Copy, data, assets, and examples fit the actual product context.               |

Rate each dimension from 1 to 5 and convert it to its weighted contribution. A substantial interface is visually validated only when:

- No blocking accessibility, runtime, navigation, interaction, or overflow finding remains.
- Every dimension scores at least 4 out of 5.
- The weighted total is at least 85 out of 100.
- Unavailable imports and component misuse are corrected.
- Material fixes have been recaptured and reviewed.

## Iteration and stopping conditions

Perform both review passes even when the first render appears acceptable. Iterate on material findings, rerun relevant deterministic checks, and recapture affected viewports. Use up to six focused correction loops for one material composition change.

Stop earlier when the quality gate passes. Do not make arbitrary changes merely to increase iteration count. If the gate still does not pass after six focused loops, report the remaining evidence and the product or technical decision required; do not call the interface visually validated.

If browser execution is unavailable, report the route or surface, states, sizes, and checks that remain. Successful source checks alone do not qualify for a visual score.

## Handoff evidence

Report:

- Viewports, container widths, roles, and states inspected.
- Structural and finish findings corrected.
- Deterministic checks and accessibility evidence.
- Final score by dimension and total.
- Remaining advisory findings or unvalidated states.
