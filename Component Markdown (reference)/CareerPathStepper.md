<!-- GENERATED from Machine Readable/artifacts/components/career-path-stepper.meta.json by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->

# Career Path Stepper

An ordered vertical progression that pairs numbered achievement markers with career position and level details.

---

## Structure

```
CareerPathStepper — ordered list, vertical layout
└─ CareerPathStep — list item; gap: career-stepper/step-gap
   ├─ marker column
   │  ├─ shield marker — gradient surface, 2px inset border and visible number
   │  └─ connector — career-stepper/connector; omitted when isLast=true
   └─ row — surface, border, radius, padding and gap
      ├─ main — leading + content; gap: spacing/component/xs
      │  ├─ leading — optional drag handle
      │  └─ content
      │     ├─ title + warning — gap: spacing/component/sm
      │     └─ description
      └─ actions
```

---

## Token Bindings

| Frame | Property | Token |
|---|---|---|
| Step | Child gap | `career-stepper/step-gap` |
| Marker | Gradient fill | `career-stepper/surface` |
| Marker | Border | `career-stepper/border` |
| Marker | Border inset | `spacing/component/xxs` |
| Marker | Number | `career-stepper/foreground` |
| Connector | Fill | `career-stepper/connector` |
| Row | Fill | `career-stepper/row-surface` |
| Row | Border | `career-stepper/row-border` |
| Row | Radius | `career-stepper/radius` |
| Row | Padding | `career-stepper/row-padding` |
| Row | Content / actions gap | `career-stepper/row-gap` |
| Row | Bottom spacing | `career-stepper/item-gap` |
| Leading + content | Internal gap | `spacing/component/xs` |
| Title | Fill | `career-stepper/row-foreground` |
| Title row | Title / warning gap | `spacing/component/sm` |
| Description | Fill | `career-stepper/description` |

### All tokens used in code

Generated from `src/components/ui/career-path-stepper.tsx` — always current. The tables above explain each token's role.

`career-stepper/border` · `career-stepper/connector` · `career-stepper/description` · `career-stepper/foreground` · `career-stepper/item-gap` · `career-stepper/radius` · `career-stepper/row-border` · `career-stepper/row-foreground` · `career-stepper/row-gap` · `career-stepper/row-padding` · `career-stepper/row-surface` · `career-stepper/step-gap` · `career-stepper/surface` · `color/drop-indicator` · `height/target/touch` · `spacing/component/sm` · `spacing/component/xs` · `spacing/component/xxs`

---

## Behavior

The component is stateless. Consumers own reordering, removal, warnings and read-only behavior through slots. For editable paths, place a drag handle in `leading` and retain keyboard-accessible move actions. The connector renders for every step except one marked `isLast`.

---

## Accessibility

| Property | Value |
|---|---|
| List semantics | CareerPathStepper renders an ordered list and each CareerPathStep renders a list item. |
| Marker | The shield is decorative framing; its visible number communicates the ordered sequence. |
| Warnings | Warning slots must expose their meaning through visible text or an accessible tooltip. |
| Actions | Every icon-only action requires a specific accessible label including the affected step. |
| Keyboard | The stepper itself is static; controls supplied through the leading and actions slots retain their native keyboard behavior. Drag reordering must have keyboard-accessible alternatives. |
| Touch target | Interactive content is supplied by design-system controls that own their touch sizing. |

---

## Usage Rules

- Use the component only for an ordered career progression where sequence is meaningful.
- Pass isLast=true to the final step so the connector stops at the last marker.
- Keep the marker number neutral; the blue gradient surface and border communicate the component identity.
- Use the leading slot for a drag handle only when the consumer implements reordering and keyboard-accessible move actions.
- Place warnings next to the title through the warning slot, never inside the trailing action group.
- Use the actions slot for secondary step controls such as move and remove; published or archived paths should omit it.
- Do not substitute a generic brand border or primitive color tokens for the career-stepper component tokens.

---

## Best Practice

### Use cases

- A draft career path whose Position–Level steps can be reordered
- A published career path shown as a read-only progression
- A path audit where incomplete competency expectations need an inline warning

### Composition patterns

| Pattern | When to use |
|---|---|
| Default | Read-only progression without warnings or actions |
| With warnings | One or more steps have incomplete setup data |
| With actions | Draft paths where administrators can reorder or remove steps |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Ordered career progression with connected numbered achievements | `career-path-stepper` | `item` |
| Independent repeatable rows without sequence meaning | `item` | `career-path-stepper` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Place a warning icon beside move and delete controls | Use the warning slot beside the step title |
| Use a circular or icon-led marker | Use the token-bound shield marker with its visible sequence number |
| Make drag-and-drop the only way to reorder steps | Pair the leading drag handle with keyboard-accessible move actions |
| Bind marker colors directly to blue primitives | Use the career-stepper component token collection |

