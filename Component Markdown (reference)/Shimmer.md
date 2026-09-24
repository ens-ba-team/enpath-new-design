<!-- GENERATED from Machine Readable/artifacts/components/shimmer.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Shimmer

Animated gradient text for 'thinking' before the first token arrives.

---

## What it is

AI Elements Shimmer (motion). Wraps a short string.

**Exports:** `Shimmer`

---

## Token Bindings

| Part | Token |
|---|---|
| Text | `color/text/secondary` with a moving highlight |

---

## Accessibility

| Property | Value |
|---|---|
| Screen readers | Reads the text once ("Thinking…") |
| Reduced motion | Text stays readable without the animation |

---

## Usage Rules

- Keep the text short ("Thinking…").
- Replace it with the reply as soon as tokens stream.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Shimmer for page loading | Skeleton |
| Long sentences in a Shimmer | One or two words |
## More details

- **Source:** https://elements.ai-sdk.dev/components/shimmer
- **Story:** `AI/Shimmer`

---

