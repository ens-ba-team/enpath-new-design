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


# Rendered validation after implementation

Rendered validation is required for a substantial page, application shell, feature surface, or material layout change. Small local changes may use proportionate evidence when they do not affect visual direction, hierarchy, navigation, or responsive geometry. Follow the consumer's existing application, routing, browser-test, and screenshot setup.

Read and apply [wcag-policy.md](wcag-policy.md) before evaluating accessibility evidence. WCAG 2.2 AA failures are blocking; AAA opportunities remain advisory unless the product requires them.

## Completion gate

Before handing off substantial page work:

1. Render and inspect the affected route at the consumer's declared device sizes and around every layout transition touched by the change.
2. Capture WCAG A/AA evidence with the consumer's existing axe integration when available. Low-emphasis token names do not guarantee that small rendered text passes contrast.
3. Clear unexplained console errors and page errors. React key warnings, hydration errors, and failed interactions are blocking even when typecheck and build pass.
4. Verify one page-level heading, valid landmarks, no uncontrolled page overflow, and no clipped required content.
5. Compare navigation across the consumer's relevant layout modes so every destination remains reachable.
6. Confirm that the initial viewport communicates the intended purpose and content priority from the composition decision.
7. Fix material findings and recapture the affected viewports. Do not claim the page is ready when it has not been visually inspected.

If browser execution is unavailable, report the page as visually unvalidated and list the exact checks that remain. Source guardrails and successful builds do not replace this gate.

## Choose the available browser path

1. Prefer the consumer's existing Playwright suite. Add or run focused browser coverage that owns application startup, authentication or fixtures, viewport projects, interactions, screenshots, and assertions.
2. Use an available interactive browser for screenshot-first exploration and computed-layout inspection while iterating; convert stable regression evidence into the consumer's browser suite when appropriate.
3. For a reachable route without suitable browser coverage, run `pnpm exec en-ui-audit <url> --viewports <consumer-sizes>`. The command deliberately has no generic viewport defaults.
4. If the repository uses Cypress, Storybook interaction tests, component tests, or another established browser harness, use that rather than adding Playwright solely for this skill.
5. Use [the rendered-page audit helper](../scripts/rendered-page-audit.mjs) directly when a custom Playwright test already owns the open `page`.

The helper is heuristic and may surface adapter internals or target-size cases that qualify for WCAG exceptions. Pair it with axe and visual inspection; do not treat a large advisory count as more important than a smaller number of confirmed accessibility or task-completion failures.

## Select routes and states

Validate the smallest representative matrix that covers the change:

- The changed route and any shared shell it affects.
- Relevant audiences, roles, modes, or access levels when they change the experience.
- Default, loading, empty, error, long-content, disabled, and destructive states that affect layout or meaning.
- Realistic long names, localized copy, identifiers, URLs, large numbers, and dense results.

Do not fabricate a large test matrix when the change is local. Do not validate only the ideal state when the feature explicitly owns other states.

## Select viewports

Read viewport and breakpoint configuration from the consumer first: browser-test projects, device profiles, CSS or Tailwind breakpoints, layout constants, product analytics, accepted screenshots, and documented supported devices. Use those exact sizes when they exist.

When the consumer has no declared viewport matrix, derive one from the changed interface instead of importing generic widths. Inspect the smallest and largest supported layouts plus both sides of each breakpoint or content-driven transition that changes the composition. A feature with one fluid layout may need fewer widths; a dense shell or resizable workspace may need more.

At each selected width, verify that each region deliberately stays, wraps, reorders, condenses, becomes a disclosure, scrolls, or changes representation. Stacking every desktop block is not sufficient evidence.

For split, resizable, sidebar, drawer, and dialog layouts, also exercise the nested region at its minimum, default, and maximum supported width. Browser viewport breakpoints can remain unchanged while the child pane becomes narrow enough to overflow. For AI chat, scroll a long conversation and confirm the message region is the scroll owner, the composer stays inside the visible panel bottom, the final message remains reachable, and mobile keyboard or safe-area behavior does not obscure the input.

Inspect the initial viewport as well as the full-page capture. Full-page screenshots can hide that secondary material displaces the content or action the experience is meant to foreground.

## Deterministic browser evidence

Collect what the project supports:

- Page and console errors after navigation and interaction.
- WCAG 2.2 AA results through the consumer's existing axe or accessibility integration.
- Page-level horizontal overflow and elements escaping the viewport without an owning scroll region.
- One page-level `h1`, valid heading progression, unique IDs, and valid landmarks.
- Visible interactive targets, focus order, focus visibility, dialog focus containment, and keyboard completion of relevant interactions.
- Broken images, clipped controls, clipped text, and overlays cut off by overflow containers.
- Fixed-height controls whose labels wrap or escape their bounds, bordered summary cells with less than 8px inline inset, and nested split or resizable regions whose content is wider than the pane.
- AI chat composers that leave the visible chat panel, attach to the global viewport, cover the final message, or disappear behind the mobile keyboard or safe area.
- Loading, empty, error, long-content, and permission states remaining reachable and understandable.
- The En UI stylesheet and intended fonts are actually applied; default browser typography, transparent or unstyled controls, missing token values, and zero-sized layout regions are blocking setup failures.

Treat clear WCAG failures, broken interaction, inaccessible content, and uncontrolled page overflow according to the consumer's blocking policy. Treat heuristic findings from the helper as review evidence unless the project explicitly promotes a rule to CI.

## Typography and content width

Generated interfaces commonly fail when real content is longer than sample content. Check typography with representative data rather than only placeholder strings.

- Inspect computed widths, not only class names. Named or numeric classes such as `max-w-xl` and `max-w-96` derive from spacing vocabularies rather than consumer content measures; `max-w-xl` can bind to the 12px spacing token. Use consumer semantic width variables backed by explicit `rem`, `ch`, percentage, or viewport values.

- Long headings must wrap intentionally without colliding with actions or being forced into a needlessly narrow column.
- Prose and descriptions need enough inline width for readable lines. If a long paragraph is squeezed into a narrow side column, reconsider the layout before shrinking type.
- Flex and grid children that own text often need `min-width: 0`; without it, long content can overflow or force adjacent blocks off screen.
- Names, identifiers, email addresses, URLs, permission labels, and translated strings need wrapping, protected truncation, or a deliberate scroll owner appropriate to their meaning.
- Single-line truncation must preserve the complete accessible value and a discoverable full-value affordance.
- Multi-line clamping must not hide required instructions, validation, permission consequences, or the primary identity of a record.
- Fixed widths must be tested with long content. Prefer bounded flexible columns and documented minimums over widths tuned to one sample.
- A data table may own horizontal scrolling; the page itself should not scroll horizontally because one cell or control cannot shrink.

The audit helper flags horizontal and vertical text clipping, long prose in unusually narrow blocks, multi-line clamp without a full-value affordance, long unbreakable tokens, and likely flex/grid `min-width` problems. Review these findings in context rather than blindly changing every flagged element.

## Visual judgment

Capture or inspect screenshots at the selected routes, states, and widths. Review:

- Whether the intended purpose, story, or task is clear at the appropriate pace for the experience.
- Page title, primary action, supporting controls, main content, and secondary actions having distinct weight.
- Semantic spacing and block padding expressing relationships rather than repeating one gap everywhere.
- Deliberate alignment, container proportions, readable text measure, and density appropriate to the brief.
- Computed interface and product values use Nunito; alternate font rendering is limited to code and machine-oriented text.
- Tables retain the installed En UI row boundaries, hover treatment, and selected emphasis without consumer-authored row cards.
- Sections do not repeat spacing, separators, and card edges to express one boundary.
- En UI-specific anti-slop patterns from [composition-quality.md](composition-quality.md).
- Whether hierarchy reflects the intended task, story, comparison, or experience.
- Whether structural contrast and expressive effects support the visual thesis rather than appearing as disconnected decoration.
- Whether every independent surface has a clear content, interaction, or expressive role.
- Whether the page feels intentionally designed rather than merely valid: an unstyled document, generic equal-weight card grid, placeholder composition, or first-pass safe layout does not pass the visual gate.
- Whether the primary workflow was exercised in the browser, including the states opened by hover, focus, selection, disclosure, overlays, validation, or navigation rather than judging only the initial screenshot.

Pixel comparison is useful when an approved baseline exists. Never create or update a baseline merely to make a failure disappear; human approval remains required.

## Iteration loop

For each material finding, make the smallest En UI-aligned correction, rerun the relevant deterministic check, and recapture the affected viewport. Recheck shared shells on every route they influence. Use [visual-quality-loop.md](visual-quality-loop.md) for the structural review, finish review, scoring, and stopping conditions.

## Playwright-compatible helper example

```ts
import path from "node:path"
import { pathToFileURL } from "node:url"

const helperUrl = pathToFileURL(
  path.resolve(process.cwd(), ".agents/skills/en-ui-consumer/scripts/rendered-page-audit.mjs"),
).href
const { auditRenderedPage, observePageIssues } = await import(helperUrl)

const observed = observePageIssues(page)
await page.goto(targetRoute)

const report = await auditRenderedPage(page, {
  rootSelector: "main",
  ignoreSelectors: ["[data-allow-overflow]"],
})
const runtimeIssues = observed.stop()

test.info().attach("en-ui-rendered-audit", {
  body: JSON.stringify({ report, runtimeIssues }, null, 2),
  contentType: "application/json",
})
```

Adapt this to the consumer's fixtures and reporting. Do not copy it into a project that uses another browser setup when the same checks can be performed through that setup.

## Report

For each material finding, record the route, role, state, viewport, evidence, user impact, and smallest En UI-aligned remediation. Separate deterministic failures from contextual visual judgment and list any state that could not be exercised.
