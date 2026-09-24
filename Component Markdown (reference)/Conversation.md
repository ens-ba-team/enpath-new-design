<!-- GENERATED from Machine Readable/artifacts/components/conversation.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Conversation

Scroll container for a chat thread. Sticks to the newest message while streaming and shows a jump-to-latest button.

---

## What it is

AI Elements Conversation (use-stick-to-bottom). Holds Message rows; ConversationEmptyState shows before the first message.

**Exports:** `Conversation` · `ConversationContent` · `ConversationEmptyState` · `ConversationScrollButton` · `ConversationDownload`

---

## Token Bindings

| Part | Token |
|---|---|
| Region | inherits the chat panel (`color/background/default`) |
| Empty-state text | `color/text/secondary` |
| Scroll button | Button outline, `color/surface/overlay` |

### All tokens used in code

Generated from `src/components/ai-elements/conversation.tsx` — always current. The tables above explain each token's role.

`color/text/secondary`

---

## Accessibility

| Property | Value |
|---|---|
| Role | `log` region with `aria-live` so new messages are announced |
| Scroll button | Has an accessible label |
| Empty state | Plain text, reachable by screen readers |

---

## Usage Rules

- One Conversation per chat panel.
- Always provide an empty state with what the assistant can do.
- Don't auto-scroll when the user has scrolled up — the component handles this; don't override it.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| A plain overflow div for chat | Conversation (keeps position while streaming) |
| Blank panel before the first message | ConversationEmptyState + Suggestions |
## More details

- **Source:** https://elements.ai-sdk.dev/components/conversation
- **Story:** `AI/Conversation`

---

