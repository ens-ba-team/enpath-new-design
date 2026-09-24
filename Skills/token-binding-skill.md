#skill #tokens #binding

# Token Binding Skill

How to choose the right token and bind it in code — for a new component, a fix, or a screen.
Code only: Enpath has no Figma. Binding = writing `var(--token-name)` in a component's classes.

**The rule in one line:** pick a token by its **meaning**, never by its value. Two tokens can resolve
to the same colour today and diverge tomorrow — the name you bind is the promise you make.

---

## Where meaning lives

| Source | What it tells you |
|---|---|
| `Tokens/semantics.tokens.json` → `$description` | **Intent · Use when · Do not use · Use instead · Foreground** for every semantic token. The authority |
| `enpath-design-system.md` | System rules that cut across tokens (paired surfaces, destructive ≠ danger, heights, separation ladder) |
| `Tokens/components.tokens.json` | Component-scoped aliases (button, badge, table, tooltip) — use these inside that component |
| Existing `enpath-ui/src/components/ui/*.tsx` | How a token is already used — follow precedent unless it contradicts the description |

Never bind from `tokens.css` or a hex value alone. `tokens.css` is generated; its comments mirror the JSON.

**Read a token's meaning:**
```bash
cd Tokens
node -e 'const j=require("./semantics.tokens.json");const p=process.argv[1].split("/");let o=j;for(const k of p)o=o?.[k];console.log(o?.$description??"NO DESCRIPTION — do not bind; add one first")' color/surface/raised
```

**List candidates in a group:**
```bash
node -e 'const j=require("./semantics.tokens.json");const w=(o,p)=>{for(const k in o){if(k.startsWith("$"))continue;const v=o[k];if(v&&v.$value!==undefined)console.log(p+k.padEnd(28),(v.$description||"").split("\n")[0]);if(v&&typeof v==="object")w(v,p+k+"/")}};w(j.color.surface,"color/surface/")'
```

---

## Procedure

### 1. Name the job, not the look
Write down what the element **is** and **where it sits**: "fill of a floating menu", "text on the
danger badge", "border of an input when invalid". Not "light grey" or "red".

### 2. Pick the layer
| Situation | Layer |
|---|---|
| Inside a component that has component tokens (button, badge, table, tooltip) | **Component token** |
| Everything else | **Semantic token** |
| Never | Primitive (`color/zinc/200`) in a component — primitives only feed semantics |

Exception: the alert and a few status tints use primitive `/200` borders and `/800` text by documented
decision (`alert.tsx` comment). Don't extend the exception without recording it.

### 3. Find candidates and read every description
List the group (`color/surface/*`, `color/border/*`…), then read **Use when** and **Do not use** of each.
A token whose *Do not use* matches your job is wrong even if the colour looks right.

### 4. Check the pairing
- Fills and text come in pairs: `[token]` + `[token]/foreground`. Text on a fill **must** be that fill's
  `/foreground` (paired-surface rule).
- Icons: standalone → `color/icon/*`; inside a filled container → the container's `/foreground`;
  next to a label in an interactive element → track the label (`currentColor`).
- `color/brand/destructive` is a fill only. Error **text** = `color/text/invalid`.

### 5. Bind in code
```tsx
"bg-[var(--color-surface-overlay)] text-[var(--color-surface-overlay-foreground)]"
"border-[var(--color-input-border)] read-only:bg-[var(--color-input-bg-readonly)]"
"rounded-[var(--radius-control)] shadow-[var(--shadow-surface)]"
"px-[var(--spacing-component-md)] gap-[var(--spacing-component-sm)]"
```

Page structure and component internals use different spacing families:
```tsx
// Page/detail structure
<section className="p-[var(--spacing-layout-sm)]">
  <div className="flex gap-[var(--spacing-layout-xs)]" />
</section>

// Component-owned surface
<Card className="p-[var(--spacing-component-lg)]">
  <div className="flex gap-[var(--spacing-component-sm)]" />
</Card>
```
CSS variable name = token path with `/` → `-` and a `--` prefix (`color/surface/overlay` → `--color-surface-overlay`).

**Control heights are always a pair** (drift-check #4 fails otherwise):
```tsx
"h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)]"
```

### 6. Document the binding
Add or update the component's header comment and its `meta.json` — the `tokens` fields **and** the
**Token Bindings** section in `docs` — token **names only**, never hex (drift-check #3). Then run
`node "Machine Readable/generate-component-docs.mjs"` to refresh the markdown page.

### 7. Verify
```bash
node "Machine Readable/drift-check.mjs"
node "Machine Readable/validate-artifacts.mjs"
cd Tokens && node validate-contrast.mjs
cd enpath-ui && npx tsc --noEmit -p .
```
Then check the component in Storybook at 390px and 1280px, including hover, focus, selected, invalid,
disabled and read-only states — contrast is checked per state, not only the default.

---

## When no token fits

Do **not** reuse a near-miss or hardcode a value. Add a token:

1. Add it to `Tokens/semantics.tokens.json` (or `components.tokens.json`), aliasing a primitive or semantic.
2. Give it the **full description** — no description, no token:
   ```
   Intent:      what it is for
   Use when:    the contexts it applies to
   Do not use:  look-alike contexts where it is wrong
   Use instead: the right token for those
   Foreground:  its paired /foreground (surfaces only)
   Status:      active
   ```
3. Never give a semantic the **same path as a primitive** (`shadow/hairline` → `{shadow.hairline}`
   self-references and breaks the build — name the primitive differently, e.g. `shadow/xs`).
4. `cd Tokens && node sd.build.mjs` — regenerates `tokens.css`. Never edit `tokens.css` by hand.
5. Add it to the token list in `enpath-design-system.md` §Semantics and log it in `CHANGELOG.md`.

---

## Common mistakes

| Mistake | Why it's wrong | Do this |
|---|---|---|
| Choosing by colour (`surface/muted` because it's the right grey) | Meaning differs; values diverge later | Choose by *Use when* |
| `color/sidebar/*` outside the Sidebar | Sidebar tokens are scoped | `color/background/accent` / `color/surface/*` |
| `color/surface/raised` as a card fill | It's a grey tint for tab tracks and table headers | Card = `surface/overlay` + `border/default` + `shadow/surface` |
| `status/danger-subtle/foreground` on a white page | Only valid on its own subtle fill | `color/text/invalid` |
| `h-8`, `h-[32px]` on a control | Drifts when the scale changes; no touch rung | Height token pair |
| `spacing/component/xl` for page padding because it equals `spacing/layout/sm` | Component and layout values may diverge; the semantic role is wrong | Page/header/body inset = `spacing/layout/sm` |
| Hex or px in a doc next to a token name | Stale on the next re-theme | Name only |
| `shadow/raised` on hover | Raised = dragged or pinned only | Stay on `shadow/surface` |

---

## Related

- `enpath-design-system.md` — the rules and the full token list
- `Tokens/semantics.tokens.json` — meanings (the authority)
- `Machine Readable/generation-rules.md` — writing Token Bindings into docs and meta.json
