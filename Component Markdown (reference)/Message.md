<!-- GENERATED from Machine Readable/artifacts/components/message.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Message

One chat turn. User turns sit in a light blue block; assistant turns are plain text with markdown, plus actions (copy, retry).

---

## What it is

AI Elements Message. `from="user" | "assistant"`. MessageResponse renders streaming markdown (streamdown). Replaces the deleted ChatBubble.

**Exports:** `Message` · `MessageContent` · `MessageActions` · `MessageAction` · `MessageBranch` · `MessageBranchContent` · `MessageBranchSelector` · `MessageBranchPrevious` · `MessageBranchNext` · `MessageBranchPage` · `MessageResponse` · `MessageToolbar`

---

## Token Bindings

| Part | Token |
|---|---|
| User fill | `chat/user/bg` |
| User border | `chat/user/border` |
| User text | `chat/user/fg` |
| User radius | `radius/lg` |
| Assistant text | `chat/assistant/fg` — no bubble |
| Actions | Button ghost; tooltips |

### All tokens used in code

Generated from `src/components/ai-elements/message.tsx` — always current. The tables above explain each token's role.

`chat/assistant/fg` · `chat/user/bg` · `chat/user/border` · `chat/user/fg` · `color/text/secondary` · `radius/lg` · `spacing/component/md` · `spacing/component/sm`

---

## Accessibility

| Property | Value |
|---|---|
| Structure | Each turn is a group; the author is conveyed by position and by the Conversation log |
| Actions | MessageAction takes `label` for icon-only buttons |
| Markdown | Headings and lists render as real HTML |

---

## Usage Rules

- Assistant replies are plain text — no bubble (VS Code style).
- Icon-only MessageAction must have a `label`.
- Proposals from the AI are a card below the reply; the AI never saves.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Solid brand-blue user bubbles | `chat/user/*` light block |
| Rendering assistant markdown as raw text | MessageResponse |
## More details

- **Source:** https://elements.ai-sdk.dev/components/message
- **Story:** `AI/Message`

---

