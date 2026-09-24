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


# Composition quality

Use this guidance for prototypes, implementations, and reviews of any consumer interface. En UI supplies atoms, tokens, typography roles, and protected interactions. The consumer's brief supplies the experience, layout, density, imagery, and visual character.

## Intent before taste

- Treat the user's explicit direction and accepted references as design input, not suggestions to normalize into a familiar application template.
- Identify whether success means acting, understanding, browsing, comparing, creating, purchasing, learning, communicating, or experiencing a story. Many interfaces serve more than one of these.
- Derive density from audience, content, frequency, environment, and device posture. En UI does not require every product to be compact or every page to be spacious.
- Follow established consumer composition when continuity matters. Depart deliberately when the request or product evidence calls for a new direction.
- Keep hard constraints separate from taste: installed exports, component contracts, semantic tokens, accessibility, protected behavior, and repository requirements are mandatory; stylistic heuristics require context.

## Composition decision record

Before implementing a substantial page, shell, or feature surface, make the direction explicit:

| Decision             | Evidence to record                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Purpose              | The task, communication goal, or experience and its success condition.                     |
| Audience and context | Who uses it, how often, on which devices, and under what conditions.                       |
| Visual thesis        | The intended character and how hierarchy, space, type, media, color, or motion express it. |
| Content priority     | What deserves immediate attention and what can be supporting or deferred.                  |
| Major regions        | Their responsibilities and relationships, without prescribing package anatomy.             |
| Responsive change    | What stays, wraps, reorders, condenses, discloses, scrolls, or changes representation.     |

Keep this in working notes or an existing product artifact. When a composition becomes reusable, promote only the stable consumer-owned outcomes and invariants into a local pattern contract.

## Hierarchy and expression

The rendered result should communicate its purpose and content relationships before decoration is explained.

- Give the most important content, action, or story appropriate visual priority. A single dominant region is useful when the experience has one dominant focus, but equal comparison may require deliberately equal regions.
- Use placement, scale, typography, space, contrast, imagery, layering, and motion as an intentional system rather than isolated effects.
- Keep supporting content subordinate without making it illegible or inaccessible.
- Use headings to reveal structure, while allowing expressive display typography when the accepted direction calls for it.
- Make primary, secondary, destructive, navigational, and contextual actions distinguishable by behavior and En UI variant choice.

Expression does not need an operational justification. It needs a product reason, coherence with the visual thesis, token alignment, and acceptable rendered behavior. A gradient, illustration, dramatic headline, dark region, or animated transition may be correct for one feature and distracting for another.

## Spacing and geometry

Use En UI spacing tokens to express relationships rather than repeating one gap everywhere:

- Tight spacing within one label, value, caption, or compact control group.
- Related spacing within one thought or component cluster.
- Section spacing between distinct content regions.
- Larger space when pacing, focus, or brand expression genuinely benefits from it.

Check that:

- A heading is visually associated with the content it introduces.
- Insets suit the content and density rather than using one padding value universally.
- Alignment is deliberate; asymmetry is allowed when it supports the thesis.
- Text measure, media proportions, and interactive regions remain comfortable at real content lengths.
- Borders, surfaces, and elevation communicate boundaries or layering instead of compensating for unclear structure.
- Multiple separation devices are not stacked by habit.

## Responsive composition

Use the consumer's supported devices and containers. If none are documented, derive checks from the layout's actual breakpoints and content-driven transitions rather than importing a generic viewport trio.

At each relevant size, decide whether every major region stays, wraps, reorders, condenses, discloses, scrolls, or changes representation. Preserve the intended experience rather than mechanically stacking desktop blocks. A narrow layout may change navigation, crop or reposition media, simplify supporting content, or alter interaction while keeping essential meaning and actions available.

Viewport width and region width are different constraints. Test nested panes, dialogs, rails, resizable areas, and embedded surfaces at their own size extremes when they exist.

## Visual pitfall review

Use [anti-slop-catalog.md](anti-slop-catalog.md) as a set of diagnostic questions, not a universal ban list. Common generated motifs become problems when they are unrequested, incoherent, repetitive, inaccessible, or used to hide weak hierarchy.

For each suspicious choice, ask:

1. Is it supported by explicit human intent, product evidence, or the visual thesis?
2. Does it improve meaning, orientation, emotion, affordance, or comprehension?
3. Does it work with realistic content and relevant states?
4. Does it remain within En UI tokens and component contracts?
5. Does it remain accessible and responsive?

Keep the choice when the evidence is strong. Revise or remove it when it is only a familiar generated-UI reflex. Never erase an accepted creative direction solely because a catalog calls the underlying technique common.

## State review

Review the states relevant to the feature. These may include default, narrow, loading, empty, error, long-content, disabled, focus, selected, interrupted, offline, permission-sensitive, or reduced-motion behavior. Do not fabricate states that the product does not own, but do not validate only ideal content.

When reporting a problem, state the affected goal, viewport or state, visible evidence, and the smallest change that restores the intended result.

For substantial interface work, continue with [rendered-validation.md](rendered-validation.md), inspect actual screenshots, and revise material hierarchy, craft, or responsive problems before handoff.
