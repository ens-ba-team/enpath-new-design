<!-- GENERATED from Machine Readable/artifacts/components/scroll-area.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# ScrollArea

A fixed-size region with consistent, styled scrollbars.

---

## What it is

Radix ScrollArea. Use when a region inside a panel must scroll on its own (a long list inside a popover or sheet).

**Exports:** `ScrollArea` · `ScrollBar`

---

## Token Bindings

| Part | Token |
|---|---|
| Thumb | `color/border/default` |
| Region | inherits its container |

### All tokens used in code

Generated from `src/components/ui/scroll-area.tsx` — always current. The tables above explain each token's role.

`color/border/default`

---

## Accessibility

| Property | Value |
|---|---|
| Keyboard | The viewport is scrollable with arrow keys once focused |
| Content | Keep interactive items focusable inside it |

---

## Usage Rules

- Give it an explicit height.
- Don't wrap the whole page — only inner regions.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| ScrollArea around the whole page | Native page scroll |
| No height set | A fixed or max height |
## More details

- **Source:** https://ui.shadcn.com/docs/components/scroll-area
- **Story:** `Layout/Scroll Area`

---

