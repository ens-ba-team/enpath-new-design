<!-- GENERATED from Machine Readable/artifacts/components/prompt-input.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# PromptInput

The chat composer: auto-growing text box, a tools row (mode, model, attachments) and a submit / stop button.

---

## What it is

AI Elements PromptInput, a form built on InputGroup. Enter submits, Shift+Enter adds a line. PromptInputSubmit shows send, spinner (submitted), stop (streaming) or error.

**Exports:** `PromptInputProvider` · `LocalReferencedSourcesContext` · `PromptInputActionAddAttachments` · `PromptInputActionAddScreenshot` · `PromptInput` · `PromptInputBody` · `PromptInputTextarea` · `PromptInputHeader` · `PromptInputFooter` · `PromptInputTools` · `PromptInputButton` · `PromptInputActionMenu` · `PromptInputActionMenuTrigger` · `PromptInputActionMenuContent` · `PromptInputActionMenuItem` · `PromptInputSubmit` · `PromptInputSelect` · `PromptInputSelectTrigger` · `PromptInputSelectContent` · `PromptInputSelectItem` · `PromptInputSelectValue` · `PromptInputHoverCard` · `PromptInputHoverCardTrigger` · `PromptInputHoverCardContent` · `PromptInputTabsList` · `PromptInputTab` · `PromptInputTabLabel` · `PromptInputTabBody` · `PromptInputTabItem` · `PromptInputCommand` · `PromptInputCommandInput` · `PromptInputCommandList` · `PromptInputCommandEmpty` · `PromptInputCommandGroup` · `PromptInputCommandItem` · `PromptInputCommandSeparator`

---

## Token Bindings

| Part | Token |
|---|---|
| Fill | `chat/composer/bg` |
| Border | `chat/composer/border`; focus `color/border/focus` |
| Radius | `chat/composer/radius` (→ `radius/overlay`) |
| Tool selects | compact Select, no border |
| Submit | Button default — `color/brand/primary` |

### All tokens used in code

Generated from `src/components/ai-elements/prompt-input.tsx` — always current. The tables above explain each token's role.

`color/background/default/foreground` · `color/surface/accent` · `color/text/secondary`

---

## Accessibility

| Property | Value |
|---|---|
| Label | Textarea needs a placeholder and an accessible name |
| Keyboard | Enter sends, Shift+Enter new line, Esc stops a stream (panel) |
| Submit | Label changes with status (Submit / Stop) |

---

## Usage Rules

- Always show the current model in the tools row.
- While streaming the submit button becomes Stop — keep it enabled.
- Disable send when the box is empty.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| A plain Textarea + Button for chat | PromptInput |
| Hiding the model choice in settings | A picker in the tools row |
## More details

- **Source:** https://elements.ai-sdk.dev/components/prompt-input
- **Story:** `AI/Prompt Input`

---

