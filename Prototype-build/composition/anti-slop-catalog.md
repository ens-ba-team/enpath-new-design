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


# Visual quality pitfalls for generated En UI interfaces

Use this reference during material visual review after reading the user's direction and product evidence. It identifies common generated-UI habits, not forbidden visual styles. A deliberate choice supported by the brief may remain when it uses En UI tokens and atoms, works responsively, and meets accessibility requirements.

The purpose is to catch unexamined defaults such as interchangeable cards, decorative effects without a coherent direction, weak hierarchy, and fragile content geometry. Do not use the catalog to flatten an expressive, editorial, immersive, playful, or unconventional design requested by a human.

## How to enforce the catalog

- `Source` rules are suitable for deterministic checking only when they prove a contract, token, accessibility, or production defect. Stylistic source matches require product context and rendered review.
- `Rendered` rules require the consumer's actual viewport modes and layout transitions. Source inspection cannot prove overflow, clipping, first-viewport balance, or readable measure.
- `Review` rules require product judgment. Compare the choice with explicit human intent, the visual thesis, and rendered evidence before accepting or rejecting it.
- `Personalized` rules mean En UI contracts and tokens are authoritative. Do not add a font, literal color, radius, or type size merely to imitate a reference.

## Design-system drift

<!-- prettier-ignore -->
| Pattern | Detection | En UI prevention |
| --- | --- | --- |
| Font outside DESIGN.md | Source | Use the installed En UI font roles; propose a system change before adding another face. |
| Color outside DESIGN.md | Source | Use semantic color tokens; do not introduce raw color literals. |
| Radius outside DESIGN.md | Source | Use documented control, surface, and overlay radii. |
| Font size outside DESIGN.md | Source | Use the compact type scale; do not create arbitrary intermediate sizes. |

## Visual details

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Decorative grid-line background | AI slop | Review | Keep it when it supports the accepted visual direction; remove it when it is unrelated wallpaper. |
| Border accent on rounded element | AI slop | Review | Confirm that the accent communicates hierarchy, identity, or state rather than imitating a stock card. |
| Glassmorphism everywhere | AI slop | Review | Use blur when layering or the accepted art direction benefits from it; verify contrast and performance. |
| Side-tab accent border | AI slop | Review | Keep a one-sided accent only when its meaning and repetition are deliberate. |
| Hairline border with wide shadow | AI slop | Source | Choose a border for structure or elevation for stacking, not both by reflex. |
| Repeating-gradient stripes | AI slop | Review | Use texture only when it contributes to meaning or the accepted visual character. |
| Extreme border-radius on cards | AI slop | Review | Keep cards within the documented surface radius; pills are for compact tags or controls. |
| Amateurish hand-drawn SVG | AI slop | Review | Use a real approved asset or no illustration. |

## Typography

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Kicker / eyebrow label above heading | AI slop | Source | Use only for meaningful scope, state, date, or breadcrumb context; delete routine editorial labels. |
| Undersized functional text | Quality | Source | Keep functional text at 11px or larger; En UI body content normally starts at 14px. |
| Flat type hierarchy | AI slop | Source | Use the Typography compound hierarchy; do not improvise size or weight combinations. |
| Icon tile stacked above heading | AI slop | Source | Put a meaningful icon beside the label or leave it unboxed. |
| Italic serif display headline | AI slop | Source | Do not imitate the generic AI-startup hero; follow the product's documented type voice. |
| Hero eyebrow / pill chip | AI slop | Review | Keep it when it carries meaningful context or brand rhythm; remove empty decoration. |
| Oversized hero headline | AI slop | Review | Judge scale against the intended experience; expressive or editorial surfaces may legitimately lead with display type. |
| Crushed letter spacing | AI slop | Source | Tighten display type optically without damaging character shapes. |
| Overused font | AI slop | Source | Nunito is the interface family; do not substitute a trend font. |
| Decorative alternate font | AI slop | Source | Keep product values in Nunito. Reserve Typography.Mono and Typography.Code for code or machine-oriented text; do not use mono as decorative branding or an eyebrow style. |
| All-caps body text | Quality | Source | Reserve uppercase for short labels; use sentence case for prose and controls. |

## Color and contrast

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Radial-gradient background halo | AI slop | Review | Keep it when the accepted visual direction uses atmospheric depth and contrast remains sound. |
| Decorative radial spotlight glow | AI slop | Review | Verify that the spotlight reinforces focus or atmosphere instead of masking weak hierarchy. |
| AI color palette | AI slop | Source | Use the active En UI brand and semantic palette, not purple/cyan defaults. |
| Dark mode with glowing accents | AI slop | Source | Dark mode must come from supported tokens; colored glows need real state meaning. |
| Gradient text | AI slop | Review | Use only for deliberate display treatment with a readable accessible rendering and token-aligned colors. |
| Gray text on colored background | Quality | Source | Use an on-color semantic token that meets WCAG 2.2 AA. |
| Cream / beige palette | AI slop | Source | Use En UI paper/mineral surfaces because they are documented, not a generic warm-beige fashion choice. |

## Layout and space

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Tiny numbered section labels | AI slop | Source | Use numbers only for a real ordered process or durable reference. |
| Cards flush against the scroller edge | Quality | Rendered | Keep equal leading and trailing scroller gutters. |
| Text occluded by an overlapping element | Quality | Rendered | Reserve space for overlays or move them outside readable content. |
| One column stretches the first viewport | Quality | Rendered | Balance adjacent columns or continue long content below the row. |
| Heading crowded against the previous block | Quality | Rendered | A heading must be closer to its own content than the previous region. |
| Hero metric layout | AI slop | Review | Keep prominent metrics when comparison or impact is central; otherwise lead with the content or action that matters more. |
| Identical card grids | AI slop | Review | Vary structure by task and flatten repeated containers unless comparison is the task. |
| Monotonous spacing | AI slop | Source | Use tight, related, section, and page spacing roles intentionally. |
| Separator stack | AI slop | Review | Do not use spacing, a divider, and a card edge for the same boundary; choose the least structural device that is sufficient. |
| Nested cards | AI slop | Source | Flatten with headings, dividers, alignment, and surface changes. |
| Line length too long | Quality | Rendered | Keep prose near 65ch to 75ch and below about 80 characters per line. |
| Content overflowing its container | Quality | Rendered | Wrap, constrain, or give the content an explicit scroll owner. |
| Viewport-responsive content overflowing a narrow child pane | Quality | Rendered | Reflow against the actual container width and test pane size extremes. |
| AI chat composer leaves or covers its chat panel | Quality | Rendered | Let the message log scroll and keep the composer visible at the panel bottom with keyboard and safe-area handling. |
| Positioned child clipped by overflow container | Quality | Rendered | Portals and popovers must escape clipping ancestors. |

## Motion

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Pulsing status dot | AI slop | Source | Animate only while data is actively changing. |
| Decorative blinking cursor | AI slop | Rendered | Let real editable fields own cursors. |
| Auto-scrolling marquee | AI slop | Source | Keep content stationary and user-controlled. |
| Bounce or elastic easing | AI slop | Source | Use restrained interface easing; reserve springs for physical manipulation. |
| Layout property animation | Quality | Source | Prefer transform and opacity; avoid animating width, height, padding, or margin. |
| Image hover transform | AI slop | Source | Do not scale or rotate passive imagery on hover. |

## Copy

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Same text repeated inside one container | Quality | Source | Keep a label once in the slot where it supports action or scanning. |
| Em-dash overuse | AI slop | Source | Prefer direct sentences, commas, colons, or parentheses. |
| Marketing buzzword | AI slop | Source | Use specific product language instead of generic category claims. |
| Aphoristic-cadence copy | AI slop | Source | Avoid repeated manufactured contrasts such as "Not X. Y." |
| Theater framing copy | AI slop | Source | State what the product does instead of dismissing alternatives as "theater." |

## Imagery

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Shape-assembled illustration | AI slop | Source | Use a purposeful graphic, real asset, or no hero art. |
| Broken or placeholder image | Quality | Source | Ship a valid asset with useful alternative text or remove the image. |

## General quality

<!-- prettier-ignore -->
| Pattern | Type | Detection | En UI prevention |
| --- | --- | --- | --- |
| Uncaught script error on load | Quality | Rendered | Clear page and console errors before visual approval. |
| Content invisible at rest | Quality | Rendered | Render content visible first, then enhance entrance motion. |
| Cramped padding | Quality | Rendered | Keep at least 8px inside bounded controls and normally 12px to 16px inside compact surfaces. |
| Body text touching viewport edge | Quality | Rendered | Preserve at least 16px horizontal page gutters on narrow viewports. |
| Justified text | Quality | Source | Use left-aligned body text on screen. |
| Low contrast text | Quality | Source | Meet WCAG 2.2 AA: 4.5:1 for body text and 3:1 for large text. |
| Skipped heading level | Quality | Source | Preserve a valid heading outline. |
| Tight line height | Quality | Source | Keep multi-line body copy at 1.5 to 1.7 when possible and never below 1.3. |
| Tiny body text | Quality | Source | Keep body text at 14px or larger. |
| Wide letter spacing on body text | Quality | Source | Keep body tracking natural; reserve wide tracking for short uppercase labels. |

## Density guardrails

Density is a product decision, not a universal En UI posture. Use named spacing tokens to create the intended rhythm, preserve readable line height and target sizes, and test real content. Reduce clutter before shrinking controls or functional text.

Before accepting or rejecting a stylistic match, record how it relates to explicit human intent and the visual thesis. Prefer the choice that produces the stronger rendered result, not the one that merely appears safer in source.

## Automated source coverage

The `en-ui-check` guardrail blocks objective source defects such as unavailable imports, contract and token drift, unsafe controls or truncation, layout-property transitions, unreadably small functional text, and missing image sources. Resolve it through the standalone package or affected pnpm workspace member as described in the parent skill. Gradients, blur, glow, accents, display treatments, and expressive motion remain contextual visual-review questions because source matching cannot determine human intent or quality.
