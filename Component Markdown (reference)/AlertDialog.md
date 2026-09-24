<!-- GENERATED from Machine Readable/artifacts/components/alert-dialog.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# AlertDialog

A modal overlay that requires an explicit user decision before the page can continue. Built on Radix UI AlertDialog. Use when both the confirm and cancel actions are real choices — not when cancel is simply "close the modal."

> **Related:** `alert` (inline banner) · `dialog` (form modal with neutral close)

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `alert-dialog` | `152:3240` | 8 | Overlay modal requiring explicit user decision |

---

## Variant Matrix

### `alert-dialog`

| Property | Options | Default |
|---|---|---|
| `Align` | `Left`, `Center` | `Left` |
| `Footer` | `Inline`, `Full-width` | `Inline` |
| `Type` | `Default`, `Destructive` | `Default` |

`Align(2) × Footer(2) × Type(2) = 8 variants`

---

## Structure

```
alert-dialog                    — VERTICAL, radius/overlay, padding: spacing/component/xl
                                  gap: spacing/component/lg
                                  fill: color/surface/overlay
  ├─ icon-container             — FRAME (present in Default and Destructive)
  │    └─ icon                  — INSTANCE (Icon Placeholder)
  └─ content                    — VERTICAL, gap: spacing/component/sm
       ├─ title                 — TEXT
       ├─ description           — TEXT
       └─ footer                — FRAME (Inline or Full-width layout)
            ├─ btn-cancel       — INSTANCE (Button, Outline)
            └─ btn-confirm      — INSTANCE (Button, Primary or Destructive)
```

**Footer layouts:**
- `Footer=Inline` — buttons side by side, right-aligned (`flex-row justify-end`)
- `Footer=Full-width` — buttons stacked vertically, each full width (`flex-col`)

---

## Token Bindings

### Container

| Property | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Stroke | `color/border/default` · 1px · INSIDE |
| Radius | `radius/overlay` |
| Shadow | `shadow/overlay` |
| Padding | `spacing/component/xl` (24px all sides) |
| Gap | `spacing/component/lg` (16px) |

### icon-container per Type

| Type | Fill |
|---|---|
| `Default` | `color/background/muted` |
| `Destructive` | `color/status/danger-subtle` |

The icon inside `Destructive` icon-container sits on `color/status/danger-subtle` — its icon may use `color/status/danger-subtle/foreground`. This is a valid paired-surface usage.

### Text

| Layer | Token |
|---|---|
| `title` | `color/surface/overlay/foreground` |
| `description` | `color/text/secondary` |

### Footer buttons

Footer buttons are chosen by the **parent alert-dialog** through the Button `variant` prop — never by overriding the button's own styles.

| Type | btn-confirm | btn-cancel |
|---|---|---|
| `Default` | Primary (`button/primary/bg/bg`) | Outline (`button/outline/bg/bg`) |
| `Destructive` | Destructive (`button/destructive/bg/bg`) | Outline (`button/outline/bg/bg`) |


### Footer spacing

| Property | Token |
|---|---|
| Gap between buttons | `spacing/component/sm` (8px) |
| Padding | inherited from container |

### All tokens used in code

Generated from `src/components/ui/alert-dialog.tsx` — always current. The tables above explain each token's role.

`color/background/inverted` · `color/border/default` · `color/surface/overlay` · `color/surface/overlay/foreground` · `color/text/secondary` · `motion/duration/normal` · `motion/easing/enter` · `motion/easing/exit` · `radius/overlay` · `shadow/overlay` · `spacing/component/lg` · `spacing/component/sm` · `spacing/component/xl` · `spacing/component/xs`

---

## Motion Token Bindings

| Property | Token |
|---|---|
| Enter and exit duration | `motion/duration/normal` |
| Enter easing | `motion/easing/enter` |
| Exit easing | `motion/easing/exit` |

The panel fades and scales from its centered position without a horizontal or vertical slide. Reduced-motion preferences disable the animation.

---

## Behavior

### Open / Close

- Triggered programmatically — the trigger element (usually a Button) wraps in `<AlertDialogTrigger>`
- Closes only via the explicit action buttons — no backdrop click, no `×` button for destructive actions
- Pressing `Escape` closes the dialog and returns focus to the trigger

### Focus management

- Focus is trapped inside the dialog on open (Radix UI default)
- Initial focus moves to the first focusable element (usually the cancel button)
- On close, focus returns to the trigger element

### The × button rule

`AlertDialog` should **not** have a × close button on destructive actions — closing ≠ cancelling. If the user clicks ×, they have not chosen to cancel; they have deferred the decision. If you find yourself adding a × to an AlertDialog, you likely need a `Dialog` instead.

> **Exception:** Non-destructive AlertDialog (informational acknowledgement, terms acceptance) may include × if closing and cancelling are equivalent.

### Animation

Radix UI AlertDialog uses `data-state=open/closed` for enter/exit. The overlay fades in; the panel zooms in from center.

### Keyboard

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus between footer buttons |
| `Enter` / `Space` | Activate focused button |
| `Escape` | Close dialog, return focus to trigger |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `alertdialog` (WAI-ARIA) |
| `aria-labelledby` | Points to the `title` element |
| `aria-describedby` | Points to the `description` element |
| Focus trap | ✅ — Tab cycles only within the dialog |
| Focus on open | First focusable element (cancel button) |
| Announce | Screen reader announces `role="alertdialog"` as requiring a response |
| Backdrop click | Does NOT close (by design — forces explicit decision) |
| Aria Attributes | aria-labelledby: auto — points to AlertDialogTitle; aria-describedby: auto — points to AlertDialogDescription; aria-modal: true |
| Live Region | used: true; politeness: assertive; announces: dialog title and content on open — role=alertdialog triggers assertion |
| Keyboard | Tab / Shift+Tab: Cycle focus between footer buttons; Enter / Space: Activate focused button; Escape: Close dialog, return focus to trigger |
| Focus Indicator | color/ring 2px outside on focused buttons |
| Touch Target | Buttons meet WCAG 2.2 AA via the Button component (36px touch / 32px pointer). |

---

## AlertDialog vs Alert vs Dialog — Decision Guide

| Signal | `alert` (inline) | `alert-dialog` | `dialog` |
|---|---|---|---|
| Blocks the page? | ❌ No | ✅ Yes | ✅ Yes |
| Requires a user decision? | ❌ No | ✅ Always | Sometimes |
| Neutral close (× or backdrop)? | N/A | ❌ No | ✅ Yes |
| ARIA role | `role="alert"` | `role="alertdialog"` | `role="dialog"` |
| Both buttons are real choices? | N/A | ✅ Yes | ❌ Cancel = close |
| Form fields or rich content? | ❌ No | ❌ No | ✅ Usually |

**Use `alert-dialog` when:** both confirm AND cancel represent real decisions. The action is irreversible or high-stakes. Cancel means "I choose not to do this" — not "close this window."

**Use `dialog` instead when:** the user can legitimately close without deciding. The × button is a valid neutral exit.

---

## Usage Rules

- Use `alert-dialog` only when the user must acknowledge or decide before continuing
- `Type=Destructive` — always include a cancel path. Label confirm clearly ("Delete", "Revoke", "Overwrite")
- Do not add a × close button to destructive alert-dialogs — it signals an escape that shouldn't exist
- `Footer=Full-width` — use on mobile or when the button labels are long
- `Align=Center` — use for brief confirmations with short title + description
- The description must explain the consequence: "This cannot be undone" not just "Are you sure?"

---

## Best Practice

### Use cases

- Confirming workspace or project deletion — irreversible, user must explicitly choose
- Revoking admin access for a team member — high-stakes, requires an affirmative choice
- Discarding unsaved changes — "Save" or "Discard" are both real decisions
- Accepting terms of service before proceeding to a restricted area
- Confirming a payment or subscription charge before it processes
- Overwriting an existing file or config — both "Overwrite" and "Cancel" are meaningful

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Default` | Decision required but not destructive — acknowledgement, terms, confirmation | "Accept invitation?" · "Mark all as read?" · "Publish this draft?" |
| `Type=Destructive` | Irreversible or high-stakes action | "Delete workspace?" · "Revoke API key?" · "Discard unsaved changes?" |
| `Footer=Inline` | Short button labels, desktop layout | "Cancel / Delete" side by side |
| `Footer=Full-width` | Long labels or mobile layout | "Yes, delete my account / No, keep my account" stacked |
| `Align=Center` | Brief, unambiguous message | Short confirmation with icon |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Feedback that doesn't block the user | `alert` (inline) | `alert-dialog` |
| User can close without deciding (× is valid) | `dialog` | `alert-dialog` |
| Complex form or multi-step flow | `dialog` | `alert-dialog` |
| Auto-dismissing status update | `toast` | `alert-dialog` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Add × close button to destructive alert-dialog | Remove it — both buttons are decisions, there is no neutral exit |
| Use alert-dialog for non-blocking feedback | Use inline `alert` — modal blocking is only for mandatory decisions |
| Override button fills inside footer button instances | Set the button's Variant prop (Primary/Destructive) — never repaint child layers |
| Use generic "Are you sure?" description | Describe the specific consequence: "This will permanently delete all data in this workspace" |
| Use alert-dialog for forms | Use `dialog` — alert-dialog is for binary decisions, not data entry |
## More details

- **Best practice · Variant Examples · Align=Center · When To Use:** Brief, unambiguous confirmation with short title and description
- **Best practice · Variant Examples · Align=Center · Examples:** Centered 'Archive project?' with icon
- **Best practice · Compared To · Situation:** Auto-dismissing status after an action
- **Best practice · References · Shadcn:** https://ui.shadcn.com/docs/components/alert-dialog
- **Best practice · References · Radix:** https://www.radix-ui.com/primitives/docs/components/alert-dialog
- **Behavior · Open State · Trigger:** AlertDialogTrigger click
- **Behavior · Open State · Close Triggers:** AlertDialogAction click
- **Behavior · Open State · Close Triggers:** AlertDialogCancel click
- **Behavior · Animation · Data Attributes:** data-state=open
- **Behavior · Animation · Data Attributes:** data-state=closed
- **Behavior · Animation · Description:** Overlay fades in. Panel zooms in from center (zoom-in-95). Reverses on close.
- **Behavior · Scroll Behavior:** body scroll locked while open
- **Composition · Structure:** root > [icon-container?] + content > [title, description, footer > [btn-cancel, btn-confirm]]
- **Composition · Alignment:** LEFT or CENTER per Align variant
- **Composition · Rules:** Footer buttons are Button instances — set via Variant prop, never repaint internally
- **Composition · Rules:** Backdrop click does not close — Radix default for AlertDialog
- **Composition · Rules:** No × button on destructive type — both buttons must be real decisions

---

