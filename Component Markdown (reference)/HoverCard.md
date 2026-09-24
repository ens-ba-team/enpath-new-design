<!-- GENERATED from Machine Readable/artifacts/components/hover-card.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# HoverCard

A preview card shown when hovering or focusing a link. For supplementary detail only.

---

## What it is

Radix HoverCard. Opens on hover or keyboard focus of its trigger; the content must also be reachable another way.

**Exports:** `HoverCard` · `HoverCardTrigger` · `HoverCardContent`

---

## Token Bindings

| Part | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Text | `color/surface/overlay/foreground` |
| Border | `color/border/default` |
| Shadow | `shadow/overlay` |

### All tokens used in code

Generated from `src/components/ui/hover-card.tsx` — always current. The tables above explain each token's role.

`color/surface/overlay` · `color/surface/overlay/foreground` · `shadow/overlay`

---

## Accessibility

| Property | Value |
|---|---|
| Opens on | Hover and keyboard focus of the trigger |
| Touch | No hover on touch — never put essential info only here |
| Content | Not announced as a dialog; keep it short |

---

## Usage Rules

- Only for previews of information available elsewhere.
- The trigger must be focusable (a link or button).
- Keep content short — no forms or actions.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Actions or forms in a HoverCard | Popover or Dialog |
| Essential info only on hover | Show it inline or on the page it links to |
## More details

- **Source:** https://ui.shadcn.com/docs/components/hover-card
- **Story:** `Overlay/Hover Card`

---

