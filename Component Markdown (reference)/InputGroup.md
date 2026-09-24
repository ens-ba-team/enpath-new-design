<!-- GENERATED from Machine Readable/artifacts/components/input-group.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# InputGroup

One bordered field that combines an input or textarea with addons — icons, text or buttons. Base of the chat composer.

---

## What it is

The group draws the border, background and focus ring; the inner Input / Textarea draws none. Addons align inline (start / end) or as block rows (start / end).

**Exports:** `InputGroup` · `InputGroupAddon` · `InputGroupButton` · `InputGroupText` · `InputGroupInput` · `InputGroupTextarea`

---

## Token Bindings

| Part | Token |
|---|---|
| Fill | `color/input/bg` |
| Border | `color/input/border` |
| Border · focus | `color/border/focus` + `color/ring` glow |
| Border · invalid | `color/border/error` |
| Radius | `radius/control` (composer overrides with `chat/composer/radius`) |
| Addon text / icon | `color/text/secondary` |

### All tokens used in code

Generated from `src/components/ui/input-group.tsx` — always current. The tables above explain each token's role.

`color/border/error` · `color/border/focus` · `color/input/bg` · `color/input/border` · `color/ring` · `color/text/secondary` · `radius/control`

---

## Accessibility

| Property | Value |
|---|---|
| Label | The inner control needs a label or `aria-label` |
| Focus | Ring on the whole group when the inner control has focus |
| Buttons | InputGroupButton is a real Button — icon-only needs `aria-label` |

---

## Usage Rules

- Put the label on the inner InputGroupInput / InputGroupTextarea, not the group.
- Don't nest a plain Input inside — use InputGroupInput so borders don't double.
- Icon-only InputGroupButton needs an aria-label.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Plain Input / Textarea inside the group | InputGroupInput / InputGroupTextarea (they cancel their own border and focus glow) |
| Absolutely positioned icon over an Input | InputGroupAddon |
## More details

- **Source:** https://ui.shadcn.com/docs/components/input-group
- **Story:** `Forms/Input Group`

---

