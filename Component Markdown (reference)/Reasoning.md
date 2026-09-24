<!-- GENERATED from Machine Readable/artifacts/components/reasoning.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Reasoning

Collapsible 'thinking' text. Opens while the model streams its reasoning and closes when it finishes.

---

## What it is

AI Elements Reasoning (Collapsible). ReasoningTrigger shows "Thinking…" / "Thought for N seconds"; ReasoningContent renders markdown.

**Exports:** `Reasoning` · `ReasoningTrigger` · `ReasoningContent`

---

## Token Bindings

| Part | Token |
|---|---|
| Trigger text | `color/text/secondary` |
| Content | `color/text/secondary` |

### All tokens used in code

Generated from `src/components/ai-elements/reasoning.tsx` — always current. The tables above explain each token's role.

`color/background/default/foreground` · `color/text/secondary`

---

## Accessibility

| Property | Value |
|---|---|
| Trigger | `aria-expanded` |
| Streaming | Shimmer text; content stays readable when expanded |

---

## Usage Rules

- Only show when the model provides reasoning.
- Collapse automatically when the answer starts.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Reasoning open after the answer | Let it auto-collapse |
| Reasoning text styled like the answer | Secondary text |
## More details

- **Source:** https://elements.ai-sdk.dev/components/reasoning
- **Story:** `AI/Reasoning`

---

