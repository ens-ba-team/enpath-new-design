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


# Product-led composition exploration

Use this reference when layout or visual direction is not already settled. It provides decision prompts, not page patterns, templates, or an En UI house layout.

## Start from intent

Establish what the interface must accomplish before choosing geometry:

- The user's requested outcome and any explicit visual direction.
- The audience, usage context, frequency, device posture, and accessibility needs.
- The content that deserves attention first and the relationships users must understand.
- The intended character: for example calm, playful, editorial, immersive, technical, luxurious, urgent, or utilitarian.
- The role of imagery, data, motion, sound, or direct manipulation when relevant.
- Existing brand evidence, accepted references, nearby product surfaces, and deliberate departures from them.

Do not classify the feature as a dashboard, settings page, admin screen, or another stock archetype and then inherit its usual anatomy. Derive the composition from the actual content and behavior.

## Define a visual thesis

Write one or two sentences that connect visual choices to product intent. A useful thesis names the hierarchy, spatial character, density, and expressive device without prescribing an exact JSX tree.

Examples of the level of reasoning, not styles to copy:

- "The creation canvas is immersive and quiet; tools remain close to the active object while supporting metadata recedes."
- "The story begins with a strong editorial image and generous type, then becomes denser as readers move into evidence and detail."
- "Frequent comparison work stays compact and aligned, with status carried by text, icons, and semantic color rather than decorative containers."

The thesis may support large typography, asymmetry, illustration, photography, restrained density, expressive motion, or highly compact controls when those choices fit the brief and remain within En UI tokens and accessibility requirements.

Name one signature move that makes the experience recognizably this product: for example an editorial reading rhythm, spatial navigation, a dominant working canvas, staged disclosure, direct manipulation, an unusual but useful comparison layout, or meaningful motion. It must improve orientation, comprehension, emotion, or task completion; decoration alone does not qualify.

## Explore only when useful

When the user supplied an accepted mockup, established layout, or clear direction, follow it faithfully and do not generate alternatives merely to satisfy process.

When consequential direction remains unresolved, sketch at least two materially different compositions in working notes. One may preserve the strongest established convention; the other should test a bolder hierarchy, proportion, content order, navigation posture, interaction model, or responsive transformation. Color-only variations are not structural alternatives.

Compare candidates using:

1. Fidelity to the user's intent and product evidence.
2. Clarity of the primary purpose, story, or task.
3. Suitability of En UI atoms for the required behavior.
4. Quality at the actual target viewport and container sizes.
5. Accessibility, content resilience, and implementation risk.

Select the stronger direction and discard the sketches. Do not publish them as En UI patterns or package components.

Reject a candidate that is merely safe: a centered heading followed by interchangeable cards, equal-weight sections, or decoration added after the hierarchy is already generic. Restraint is valid when it is deliberate and distinctive through typography, rhythm, proportion, content, or interaction.

## Preserve creative range

Avoid both automatic decoration and automatic restraint. Gradients, strong contrast, unusual proportions, large display type, illustration, layered surfaces, and motion can be valid when supported by the brief. Plain surfaces, dense grids, and minimal motion can also be valid. Require a product reason and rendered evidence, not conformity to a generic taste checklist.

Do not let an anti-pattern catalog overrule explicit human direction. Treat stylistic warnings as questions: is the choice intentional, coherent, token-aligned, accessible, and stronger than a simpler alternative for this specific interface?

## Consumer ownership

All page geometry and reusable composition remain in the consumer repository. If a composition recurs and needs stable behavior, document its local contract using [application-pattern-contracts.md](application-pattern-contracts.md). En UI supplies atoms and their contracts; it does not supply or standardize the resulting layout.
