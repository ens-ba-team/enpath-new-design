<!-- GENERATED from Machine Readable/artifacts/components/command.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Command

Searchable, keyboard-first list of items and actions (cmdk). Powers the Model selector and prompt mentions.

---

## What it is

An input that filters a grouped list as you type. Arrow keys move, Enter selects. Can sit inline or in a dialog (CommandDialog).

**Exports:** `Command` · `CommandDialog` · `CommandInput` · `CommandList` · `CommandEmpty` · `CommandGroup` · `CommandItem` · `CommandShortcut` · `CommandSeparator`

---

## Token Bindings

| Part | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Text | `color/surface/overlay/foreground` |
| Group heading · empty · shortcut | `color/text/secondary` |
| Selected item | `color/surface/accent` + `/foreground` |
| Border | `color/border/default` |

### All tokens used in code

Generated from `src/components/ui/command.tsx` — always current. The tables above explain each token's role.

`color/background/default/foreground` · `color/border/default` · `color/surface/accent` · `color/surface/accent/foreground` · `color/surface/overlay` · `color/surface/overlay/foreground` · `color/text/secondary` · `shadow/overlay`

---

## Accessibility

| Property | Value |
|---|---|
| Role | `combobox` input + `listbox` (cmdk) |
| Keyboard | ↑ ↓ move, Enter selects, Esc closes the dialog |
| Empty state | Always render CommandEmpty so a no-match is announced |

---

## Usage Rules

- Always include a CommandEmpty message.
- Group items under headings when there are more than ~7.
- Show shortcuts with CommandShortcut, never in the label.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Command for a short fixed choice (≤ 5 options) | Select or Radio group |
| Items without text (icon only) | Always a text label |
## More details

- **Source:** https://ui.shadcn.com/docs/components/command
- **Story:** `Navigation/Command`

---

