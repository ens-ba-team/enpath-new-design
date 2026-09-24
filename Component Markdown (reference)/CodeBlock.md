<!-- GENERATED from Machine Readable/artifacts/components/code-block.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# CodeBlock

Syntax-highlighted code with copy..

---

## What it is

AI Elements CodeBlock (shiki). Used for JSON / code in assistant replies and tool input/output.

**Exports:** `CodeBlockContainer` · `CodeBlockHeader` · `CodeBlockTitle` · `CodeBlockFilename` · `CodeBlockActions` · `CodeBlockContent` · `CodeBlock` · `CodeBlockCopyButton` · `CodeBlockLanguageSelector` · `CodeBlockLanguageSelectorTrigger` · `CodeBlockLanguageSelectorValue` · `CodeBlockLanguageSelectorContent` · `CodeBlockLanguageSelectorItem`

---

## Token Bindings

| Part | Token |
|---|---|
| Fill | `chat/code/bg` (→ `color/surface/raised`) |
| Border | `color/border/default` |
| Font | Roboto Mono (`font/mono`) |
| Highlighting | shiki github-light |

### All tokens used in code

Generated from `src/components/ai-elements/code-block.tsx` — always current. The tables above explain each token's role.

`color/background/default` · `color/background/default/foreground` · `color/surface/muted` · `color/text/secondary`

---

## Accessibility

| Property | Value |
|---|---|
| Copy | CodeBlockCopyButton has a label and confirms with an icon change |
| Content | Real text, selectable |

---

## Usage Rules

- Only for machine text (code, JSON) — Roboto Mono is for machine text only.
- Always offer copy.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Another highlighting theme | github-light |
| CodeBlock for prose | MessageResponse |
## More details

- **Source:** https://elements.ai-sdk.dev/components/code-block
- **Story:** `AI/Code Block`

---

