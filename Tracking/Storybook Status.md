# Storybook Status

Per-component pipeline status for **Enpath**. Update after completing each phase — never mark ✅ without a measurement taken in this system.

> **Reset 2026-09-21.** Earlier ticks were earned by Agentic, not Enpath, and were cleared when the system was re-themed. Verification has to be re-earned here.

**Pipeline — no skipping:**
```
.tsx tokens checked → Story written → Story verified
```

| Symbol | Meaning |
|---|---|
| ✅ | Done and measured in Enpath |
| ⚠️ | Exists, not yet checked in Enpath |
| ❌ | Not done |

- **.tsx tokens checked** — every class uses a token (no raw hex/px), control heights use the touch + pointer pair (`drift-check` #4 covers controls only).
- **Story verified** — the 8-item check passed in the browser: renders without errors, correct font, correct colours, all controls work, all named stories correct, overlays open/close, a11y has no critical violations, touch (390px) and pointer (1280px) widths both checked.

**Measured so far (2026-09-21):** all 299 stories render without page errors after the Phosphor switch. That is item 1 of 8 only — no component is fully verified yet.

## Status

| Component | .tsx tokens checked | Story written | Story verified | Notes |
|---|---|---|---|---|
| accordion | ⚠️ | ✅ 4 stories | ❌ | |
| alert-dialog | ⚠️ | ✅ 5 stories | ❌ | |
| alert | ⚠️ | ✅ 10 stories | ❌ | |
| avatar | ⚠️ | ✅ 8 stories | ❌ | |
| badge | ⚠️ | ✅ 17 stories | ❌ | |
| breadcrumb | ⚠️ | ✅ 8 stories | ❌ | |
| button-group | ⚠️ | ✅ 7 stories | ❌ | |
| button | ⚠️ | ✅ 14 stories | ❌ | |
| calendar | ⚠️ | ✅ 7 stories | ❌ | |
| card | ⚠️ | ✅ 11 stories | ❌ | |
| career-map | ✅ | ✅ 5 stories | ❌ | added 2026-09-25; page checked in browser at 390–1440px (My Career), stories not yet |
| career-path-stepper | ✅ | ✅ 5 stories | ❌ | added 2026-09-23; browser verification pending |
| checkbox | ⚠️ | ✅ 12 stories | ❌ | |
| combobox | ⚠️ | ✅ 11 stories | ❌ | |
| date-picker | ⚠️ | ✅ 5 stories | ❌ | |
| dialog | ⚠️ | ✅ 5 stories | ❌ | |
| drawer | ⚠️ | ✅ 4 stories | ❌ | |
| empty | ⚠️ | ✅ 8 stories | ❌ | |
| input-otp | ⚠️ | ✅ 6 stories | ❌ | |
| input | ⚠️ | ✅ 15 stories | ❌ | |
| item | ⚠️ | ✅ 10 stories | ❌ | |
| navigation-menu | ⚠️ | ✅ 6 stories | ❌ | |
| pagination | ⚠️ | ✅ 10 stories | ❌ | |
| progress | ⚠️ | ✅ 7 stories | ❌ | |
| radio-group | ⚠️ | ✅ 8 stories | ❌ | |
| select | ⚠️ | ✅ 10 stories | ❌ | |
| separator | ⚠️ | ✅ 5 stories | ❌ | |
| sheet | ⚠️ | ✅ 5 stories | ❌ | |
| sidebar | ⚠️ | ✅ 4 stories | ❌ | |
| skeleton | ⚠️ | ✅ 7 stories | ❌ | |
| slider | ⚠️ | ✅ 6 stories | ❌ | |
| stat | ✅ | ✅ 4 stories | ❌ | added 2026-09-25; used on My Career, page checked in browser |
| switch | ⚠️ | ✅ 13 stories | ❌ | |
| table | ⚠️ | ✅ 5 stories | ❌ | |
| tabs | ⚠️ | ✅ 8 stories | ❌ | |
| textarea | ⚠️ | ✅ 15 stories | ❌ | |
| toast | ⚠️ | ✅ 8 stories | ❌ | |
| tooltip | ⚠️ | ✅ 8 stories | ❌ | |
| code-block | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| collapsible | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| command | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| conversation | ⚠️ | ✅ 2 stories | ❌ | added 2026-09-22 (AI Elements) |
| dropdown-menu | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| hover-card | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| input-group | ⚠️ | ✅ 3 stories | ❌ | added 2026-09-22 (AI Elements) |
| message | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| model-selector | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| prompt-input | ⚠️ | ✅ 2 stories | ❌ | added 2026-09-22 (AI Elements) |
| reasoning | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| scroll-area | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| shimmer | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| spinner | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| suggestion | ⚠️ | ✅ 1 story | ❌ | added 2026-09-22 (AI Elements) |
| tool | ⚠️ | ✅ 2 stories | ❌ | added 2026-09-22 (AI Elements) |
