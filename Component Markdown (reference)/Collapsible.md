<!-- GENERATED from Machine Readable/artifacts/components/collapsible.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Collapsible

Show and hide a region with a trigger. Unstyled Radix primitive — the look comes from what you put in it.

---

## What it is

A trigger and a content region that expands and collapses. It carries no colours of its own; Reasoning and Tool are built on it.

**Exports:** `Collapsible` · `CollapsibleTrigger` · `CollapsibleContent`

---

## Token Bindings

| Part | Token |
|---|---|
| Content | none — inherits its container |
| Trigger | use a Button (ghost / outline) |

---

## Accessibility

| Property | Value |
|---|---|
| Trigger | Button with `aria-expanded` and `aria-controls` (Radix) |
| Keyboard | Enter / Space toggle |

---

## Usage Rules

- Use a Button as the trigger (`asChild`) so it gets focus styles and a hit area.
- Label the trigger with what it reveals ("Show details"), not "Click here".
- Don't hide required actions inside a collapsed region.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Collapsible for mutually exclusive sections | Accordion |
| A bare div as the trigger | A Button via `asChild` |
## More details

- **Source:** https://ui.shadcn.com/docs/components/collapsible
- **Story:** `Layout/Collapsible`

---

