---
name: Enpath
description: A precise, calm career-development interface grounded in an explicit token system.
colors:
  brand-primary: "oklch(50.4% 0.2782 264.53)"
  brand-primary-hover: "oklch(44% 0.25 264.53)"
  brand-primary-active: "oklch(38% 0.22 264.53)"
  neutral-white: "#ffffff"
  neutral-canvas: "#f8fafc"
  neutral-muted: "#f1f5f9"
  neutral-ink: "#0f172a"
  neutral-secondary-ink: "#475569"
  neutral-border: "#e2e8f0"
  info-blue: "#0e41ff"
  destructive-red: "#da2c24"
typography:
  display:
    fontFamily: "Nunito, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.2
  heading:
    fontFamily: "Nunito, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
---

# Design System: Enpath

## Overview

**Creative North Star: “Career Instrument”**

Enpath's interface is a precise, calm instrument for making career development legible. Information should feel trustworthy and actionable without turning a score into a verdict. Density and hierarchy serve real administrative and employee tasks rather than decoration.

The incumbent system pairs crisp white working surfaces with a lightly tinted app canvas, restrained blue brand actions, and carefully differentiated semantic status and information colors. Depth is functional: borders, tonal shifts and deliberate shadows distinguish the page frame, cards and overlays. This description records the current system; it does not authorize replacing token or component decisions.

**Key Characteristics:**
- Precise, calm and task-oriented.
- White panels on a softly tinted app canvas.
- Blue is brand/action; information blue has a distinct meaning.
- Reusable semantic tokens govern surfaces, type, spacing and states.
- Light mode only.

## Colors

A cool neutral foundation carries a vivid blue brand anchor; semantic colors communicate state and information independently.

### Primary
- **Enpath Blue** (`oklch(50.4% 0.2782 264.53)`): Primary actions, selected states and brand emphasis. Use the semantic brand tokens and their defined hover/active pair, not an arbitrary ramp step.

### Secondary
- **Informational Blue** (`#0e41ff` at the 500 primitive): Links, information and rating-scale steps. Blue is not a substitute for the Enpath brand role; use the semantic role token appropriate to the context.
- **Destructive Red** (`#da2c24`): Destructive action fills. Error status and validation use their own status/text tokens; destructive action color is not a general error color.

### Neutral
- **Clean White** (`#ffffff`): Default page and component surfaces.
- **Cool Canvas** (`#f8fafc`): Subtle low-emphasis canvas tint.
- **Soft Slate** (`#f1f5f9`): Muted backgrounds, disabled fills and quiet interaction tints where specified.
- **Deep Slate Ink** (`#0f172a`): Main foreground on default surfaces.
- **Supporting Slate** (`#475569`): Secondary information and supporting text.
- **Fine Slate Border** (`#e2e8f0`): Default boundaries and dividers.

**The Semantic Role Rule.** Choose colors by the intent of the semantic token, not by visual similarity between swatches. Never exchange brand, information, destructive and status roles.

## Typography

**Display Font:** Nunito (with sans-serif fallback)  
**Body Font:** Inter (with sans-serif fallback)  
**Label/Mono Font:** Inter for labels; Roboto Mono only for machine text.

**Character:** Nunito gives display and larger headings a rounded, approachable voice; Inter keeps interface and body text crisp. Roboto Mono is reserved for code, commands, paths, hashes and serialized values, never dates, counts or ordinary IDs.

### Hierarchy
- **Display** (token-defined weight and size; large display styles): Major display moments only, where a surface uses them.
- **Headline** (Nunito for larger heading styles; exact size and weight come from `typography/*` tokens): Page and section headings.
- **Title** (token-defined heading styles): Component and content-group titles.
- **Body** (Inter; body styles are token-defined, commonly 16px/24px for body-md): Explanations and primary reading content.
- **Label** (Inter or Nunito according to the named label style; label-md is 14px, weight 500): Controls and compact interface labels. Labels stay on one line.

Text styles are atomic: apply a named `text-*` style rather than assembling font size, weight and line height utilities. Consult Storybook Foundations/Text Styles and `Tokens/semantics.tokens.json` for the exact mapping. Do not hand-assign font families or repeat generated values as a second source of truth.

## Layout

The app shell places a transparent sidebar and white page panel over a lightly tinted app canvas; an optional chat panel sits alongside. Shell spacing separates those regions. A subtle brand glow belongs behind the page panel, never behind sidebar text. Panels remain white; the app tint is not an interior panel fill.

Use the tokenized layout spacing scale between page regions and component spacing within components. Page composition uses grid; component internals use flex. The responsive system is mobile-first and uses named Tailwind breakpoints, with `lg` as the main layout switch. Control heights pair touch and pointer sizes across the `sm` breakpoint; preserve those pairs and their target areas. Light mode only.

## Elevation & Depth

This is a restrained hybrid of tonal layering, borders and role-specific shadows. A resting card uses the surface shadow with a border; flat cards are appropriate inside an already elevated overlay. Raised elevation is reserved for sticky or dragged content, not hover decoration. Floating menus and popovers use overlay elevation; blocking dialogs and sheets use modal elevation. The app-shell glow is a contextual background effect, not a component shadow.

### Shadow Vocabulary
- **Surface** (`shadow/surface`): Default card and panel surfaces.
- **Raised** (`shadow/raised`): A card only while dragged or pinned above scrolling content.
- **Overlay** (`shadow/overlay`): Floating menus, lists and popovers that leave the page usable.
- **Modal** (`shadow/modal`): Dialogs, alert dialogs, sheets and drawers that block the page behind a scrim.

**The No-Hover-Lift Rule.** Resting cards do not gain raised elevation on hover; elevation communicates a real stacking or interaction condition.

## Shapes

Controls have compact, gently rounded corners; cards and panels use a slightly broader radius, while overlays are more rounded. Borders carry structural clarity. Pills are reserved for components whose shape variant calls for them, such as status badges. Use semantic radius tokens (`radius/control`, `radius/surface`, `radius/overlay`, `radius/pill`) rather than choosing a nearby primitive ad hoc.

## Components

Components are token-bound building blocks. Their metadata and stories define behavior and valid variants; use existing components rather than recreating or restyling them on screens.

### Buttons
- **Shape:** Compact rounded control corners (`radius/control`, currently 6px).
- **Primary:** Enpath brand fill and its foreground; use the component's primary variant.
- **Hover / Focus:** Use the defined brand hover/active tokens and visible focus treatment. Focus is a 2px ring outside the control; destructive controls use their specified red glow.
- **Secondary / Ghost / Tertiary:** Choose the component variant that matches the action. Ghost hover uses the subtle accent surface; destructive ghost is distinct from destructive fill.
- **Sizing:** Preserve touch/pointer height pairs. Labels stay on one line; icon-only buttons require an accessible name.

### Chips
- **Style:** Badge variants express semantic status, information, outline or neutral emphasis; do not assign status meaning by appearance alone.
- **Shape:** Compact badges use the default radius; status and presence variants may use the documented pill shape.

### Cards / Containers
- **Corner Style:** Surface radius (`radius/surface`, currently 8px).
- **Background:** White default surface with the defined border.
- **Shadow Strategy:** Surface shadow at rest; flat variant inside an overlay; raised only while dragged or pinned above scrolling content.
- **Internal Padding:** Component spacing; default card uses the documented large component spacing, compact cards use medium spacing.

### Inputs / Fields
- **Style:** White input fill, semantic input border, compact control radius and component spacing.
- **Focus:** Focus border plus a soft ring glow; invalid state uses the error border and its distinct error glow.
- **Error / Disabled:** Invalid and disabled states use their semantic tokens. Read-only values remain visually distinct from editable fields.
- **Sizing:** Preserve touch/pointer height pairs.

### Navigation
- **Style:** The sidebar is transparent, without a fill, border or shadow at rest.
- **Hover / Active:** Hover uses the sidebar accent; the selected destination is a white chip with a hairline and stronger text weight. Mark the current page semantically with `aria-current`; selected state must not rely on color alone.

## Do's and Don'ts

### Do:
- **Do** use semantic tokens and follow the authority order: token → component → screen.
- **Do** use existing components as documented by their metadata and Storybook stories.
- **Do** use brand blue for brand actions and the information-blue role for information, links and rating-scale steps.
- **Do** make keyboard focus visible and retain accessible names and semantics.
- **Do** preserve touch/pointer control-height pairs and the required target areas.
- **Do** use named text styles; keep Roboto Mono for machine text only.
- **Do** keep the light-mode palette consistent; there is no dark-mode token system.

### Don't:
- **Don't** hardcode token values in components or screens, edit generated `tokens.css` by hand, or bypass the token-binding guidance.
- **Don't** rebuild an existing component from raw elements or change its semantic role, ARIA, or documented behavior.
- **Don't** use a status color as a generic decoration or treat an AI suggestion as an approved score.
- **Don't** build text styles from ad hoc font, size, weight or line-height utility combinations.
- **Don't** add hover elevation to a resting card or stack multiple visual devices on one boundary without a real structural reason.
- **Don't** invent dark mode or substitute a brand color for the distinct information-blue role.
