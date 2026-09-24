<!-- GENERATED from Machine Readable/artifacts/components/tool.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Tool

Collapsible record of a tool call the assistant made — name, status, input and output.

---

## What it is

AI Elements Tool (Collapsible). Header shows the tool name and a status badge (pending, running, completed, error). The chat panel currently shows a lighter one-line row; use Tool when input / output matter.

**Exports:** `Tool` · `ToolHeader` · `ToolContent` · `ToolInput` · `ToolOutput`

---

## Token Bindings

| Part | Token |
|---|---|
| Border | `color/border/default` |
| Status badge | Badge secondary |
| Input / output code | `chat/code/bg` |
| Error text | `color/text/invalid` |

### All tokens used in code

Generated from `src/components/ai-elements/tool.tsx` — always current. The tables above explain each token's role.

`color/background/default/foreground` · `color/brand/destructive` · `color/surface/muted` · `color/surface/overlay/foreground` · `color/text/invalid` · `color/text/secondary`

---

## Accessibility

| Property | Value |
|---|---|
| Header | Collapsible trigger — `aria-expanded` |
| Status | Text label next to the icon, not colour alone |

---

## Usage Rules

- Collapsed by default when completed; open on error.
- Show input and output as formatted JSON.
- Use plain names for tools ("Read position"), not function ids.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw function ids in the header | A readable title |
| Colour-only status | Badge with text |
## More details

- **Source:** https://elements.ai-sdk.dev/components/tool
- **Story:** `AI/Tool`

---

