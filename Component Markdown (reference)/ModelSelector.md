<!-- GENERATED from Machine Readable/artifacts/components/model-selector.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# ModelSelector

Searchable model picker in a dialog, grouped by provider. For long model lists.

---

## What it is

AI Elements ModelSelector = Dialog + Command. The chat panel currently uses a compact PromptInputSelect because there is one model; switch to this when there are many.

**Exports:** `ModelSelector` · `ModelSelectorTrigger` · `ModelSelectorContent` · `ModelSelectorDialog` · `ModelSelectorInput` · `ModelSelectorList` · `ModelSelectorEmpty` · `ModelSelectorGroup` · `ModelSelectorItem` · `ModelSelectorShortcut` · `ModelSelectorSeparator` · `ModelSelectorLogo` · `ModelSelectorLogoGroup` · `ModelSelectorName`

---

## Token Bindings

| Part | Token |
|---|---|
| Dialog | `color/surface/overlay`, `radius/overlay`, `shadow/overlay` |
| List | Command tokens |
| Selected | `color/surface/accent` |

### All tokens used in code

Generated from `src/components/ai-elements/model-selector.tsx` — always current. The tables above explain each token's role.

`color/background/default` · `color/border/default`

---

## Accessibility

| Property | Value |
|---|---|
| Dialog | Focus trapped; Esc closes; title required |
| List | Command keyboard model |

---

## Usage Rules

- Use when there are more than ~6 models; otherwise a Select in the tools row.
- Don't load provider logos from remote URLs in the prototype (ModelSelectorLogo fetches from models.dev).

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| ModelSelectorLogo in offline / prototype builds | Text names only |
| ModelSelector for one or two models | PromptInputSelect |
## More details

- **Source:** https://elements.ai-sdk.dev/components/model-selector
- **Story:** `AI/Model Selector`

---

