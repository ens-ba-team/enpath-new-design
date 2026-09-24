<!-- GENERATED from Machine Readable/artifacts/components/dropdown-menu.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# DropdownMenu

A menu of actions opened from a button (⋯). Supports labels, separators, shortcuts, checkbox / radio items and submenus.

---

## What it is

Radix DropdownMenu. For actions, not for choosing a form value (use Select for that).

**Exports:** `DropdownMenu` · `DropdownMenuTrigger` · `DropdownMenuContent` · `DropdownMenuItem` · `DropdownMenuCheckboxItem` · `DropdownMenuRadioItem` · `DropdownMenuLabel` · `DropdownMenuSeparator` · `DropdownMenuShortcut` · `DropdownMenuGroup` · `DropdownMenuPortal` · `DropdownMenuSub` · `DropdownMenuSubContent` · `DropdownMenuSubTrigger` · `DropdownMenuRadioGroup`

---

## Token Bindings

| Part | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Text | `color/surface/overlay/foreground` |
| Highlighted item | `color/surface/accent` + `/foreground` |
| Label · shortcut | `color/text/secondary` |
| Destructive item | `color/text/invalid` |
| Separator | `color/border/default` |

### All tokens used in code

Generated from `src/components/ui/dropdown-menu.tsx` — always current. The tables above explain each token's role.

`color/surface/accent` · `color/surface/accent/foreground` · `color/surface/muted` · `color/surface/overlay` · `color/surface/overlay/foreground` · `shadow/overlay`

---

## Accessibility

| Property | Value |
|---|---|
| Role | `menu` / `menuitem` (Radix) |
| Keyboard | Enter / Space / ↓ open, arrows move, typeahead, Esc closes and returns focus |
| Trigger | Icon-only triggers need an `aria-label` |

---

## Usage Rules

- Use for actions; use Select for picking a value.
- Put destructive items last, after a separator.
- Icon-only triggers need an aria-label ("More actions").

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| DropdownMenu to pick a form value | Select |
| Hiding the only way to do a primary action in a menu | A visible Button |
## More details

- **Source:** https://ui.shadcn.com/docs/components/dropdown-menu
- **Story:** `Overlay/Dropdown Menu`

---

