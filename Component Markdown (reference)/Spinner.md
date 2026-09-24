<!-- GENERATED from Machine Readable/artifacts/components/spinner.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Spinner

Indeterminate loading indicator for a small area or a pending submit.

---

## What it is

A spinning Phosphor icon (SpinnerGap) with `role="status"`. Colour follows the text around it.

**Exports:** `Spinner`

---

## Token Bindings

| Part | Token |
|---|---|
| Colour | `currentColor` — the surrounding text colour |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `status` with an accessible label ("Loading") |
| Reduced motion | Pair with visible text so meaning doesn't depend on the animation |

---

## Usage Rules

- Pair with a short text ("Loading positions…") where space allows.
- For buttons use Button `loading`, not a Spinner inside.
- For page / card loading use Skeleton.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Spinner for a whole page load | Skeleton |
| Spinner inside a Button | Button `loading` prop |
## More details

- **Source:** https://ui.shadcn.com/docs/components/spinner
- **Story:** `Feedback/Spinner`

---

