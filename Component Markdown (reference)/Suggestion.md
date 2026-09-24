<!-- GENERATED from Machine Readable/artifacts/components/suggestion.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Suggestion

Starter prompts shown before the first message. Clicking one sends it.

---

## What it is

AI Elements Suggestion — a pill-shaped outline Button; Suggestions is a horizontal scroll row. The chat panel stacks them vertically instead (narrow panel).

**Exports:** `Suggestions` · `Suggestion`

---

## Token Bindings

| Part | Token |
|---|---|
| Chip | Button outline — `color/border/default`, `color/surface/default` |
| Radius | `radius/full` |

---

## Accessibility

| Property | Value |
|---|---|
| Role | Buttons; the text is the label |
| Keyboard | Tab to each, Enter sends |

---

## Usage Rules

- Show 2–4 suggestions, only before the first message.
- Phrase them as the user would type them.
- In narrow panels stack them instead of a scrolling row.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Suggestions after the conversation has started | Hide them |
| Vague suggestions ("Help me") | Specific, context-aware prompts |
## More details

- **Source:** https://elements.ai-sdk.dev/components/suggestion
- **Story:** `AI/Suggestion`

---

