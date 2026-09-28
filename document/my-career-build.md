---
title: My Career build
created: 2026-09-25
updated: 2026-09-28
status: Employee view built (localhost:3000/me/career): map + list, progress strip, detail panels, Set / Remove target, company-path picker, Explore a position, Career visions + approval request, Remove, Ask AI, company-path changes + Path history. Not built: manager review, Notifications panel, Assessment / Action plan screens
related: ../../document/original brief/prd-020-my-career.md, ../../document/original brief/my career.md, my-actions-build.md, my-assessment-build.md, glossary.md, set-up-build.md, market-research.md, ../enpath-tone-and-voice.md
---

#enpath #my-career #build

# My Career build

What My Career is and exactly how the prototype behaves today. **This doc describes the current
code** (rewritten 2026-09-28): if the prototype and this doc disagree, one of them is a bug. Words
follow `glossary.md`.

- Run: `enpath-ui` → `npm run dev` → `localhost:3000/me/career` (`/` redirects here).
- Code: `enpath-ui/src/features/enpath/my-career/` (screen, panels, dialogs, gap rows, AI chat,
  mock data) and the design-system component `src/components/ui/career-map.tsx`
  (spec `Machine Readable/artifacts/components/career-map.meta.json`). Mock data only.
- Source brief: `../../document/original brief/my career.md` (user expectations), then PRD-020.
  Old prototype screenshots: `../../image/my-career-current-ui/`.

---

## 1. What My Career is

The employee's own space. Three questions, each with its own place on the screen:

| Question | Where it lives |
|---|---|
| Where am I? | The **You are here** card (map) / row (list) |
| Where could I go? | The career **map** or **list**: company paths and the employee's own Career visions |
| How am I doing? | The **progress strip** under the header, fixed to the Active target |

The old prototype showed all three in one canvas + one panel with equal weight, so "my progress"
and "what this role would need" looked the same. Keeping them apart is the main idea of the rebuild.

## 2. Key decisions (in force)

- **Progress strip is fixed to the Active target.** Selecting cards never changes it; only changing
  the target does.
- **Selecting a card = exploring.** The panel shows what that role would need; it never replaces
  the strip.
- **Two commitments, never shown alike:**

  | | Active target | Career vision |
  |---|---|---|
  | What | One Position-Level the employee works toward | The employee's own road to roles outside their company paths |
  | Who decides | The employee alone (PRD-020 BR-10) | The manager approves |
  | Changes the official role? | No | No |
  | How many | One (BR-11) | Any number; **one request open at a time** |

- **A Career vision is one road, never a fork** (2026-09-28). Branching off the middle of a vision
  makes a new vision that runs the whole way (see §6.2).
- **Company paths are always there** for the employee's current role (RQ-03). The employee follows
  one; they can switch but not "stop following" (removed 2026-09-28: there's always a path for
  their role, so leaving it had no meaning).
- **Scores come from Assessment only.** Competency statuses: **Ready · Growth area · Not assessed
  yet · Not set**. "Not assessed yet" is never a gap and has no button: assessing is the manager's
  job. **No readiness %.** Employee UI says **growth area**, never "gap".
- **Competency steps are "points", never "levels"**: "3 · Intermediate", not "L3".
- **Preview → Confirm** for every plan change (RQ-10); a toast confirms it.
- **AI proposes, people decide.** Ask AI can add a Career vision only after the employee accepts it;
  AI can suggest a score across Matrices, but it counts only after the manager confirms (B1).
- **History is never lost.** Scores, Actions and Records belong to the employee and the competency,
  not to a path step. **My Records is kept** (2026-09-28). When a role changes, old work stays in
  My Actions / My Records / Assessment history and can count toward a later role.
- **Copy:** no em dash in UI; no manager name ("your manager", "for approval"); colour carries a
  route's role, never its identity; inactive = `-inactive` tokens, never opacity.

---

## 3. The screen

```
Header ─ "My Career" · "Lan Nguyen · Backend Engineer L2 · Mid"   [path-change Alert] [Map | List] [Ask AI]
Progress strip ─ Toward {target} · bar · 2 ready · 2 growth areas · 2 not assessed yet · of 6 · ⓘ
┌ Map or List ───────────────────────────────────────────┐┌ Detail panel (when selected) ┐
│ toolbar: [Following: {path} ▾]  [+ Explore a position]  ││ role panel or route panel    │
│ ...                                                      ││ ...                          │
│ legend (map only)                                        ││ footer: notes + buttons      │
└──────────────────────────────────────────────────────────┘└──────────────────────────────┘
```

- **Map / List switch** (ButtonGroup of two ghost buttons, current one pressed) in the header.
  Opens in **List below 1024px**, **Map above**; the employee's choice wins for the session.
- **Detail panel**: right side (400px) on desktop, below the map/list under 1024px.
- **Ask AI**: chat panel on the right, closed by default; ⌘I toggles it. Opening it collapses the
  sidebar.

## 4. Statuses

### 4.1 Card status: one per role on the map

| Status | Band (icon · label) | Border | Which roles | Panel badge · context line |
|---|---|---|---|---|
| **Completed** | grey · check · "Completed" | grey | Earlier levels of the followed path **that Lan held** (Employee Mapping history) | "Completed" · "{path} · the path you follow". Level text grey, never ringed |
| **New on your path** | light grey (Planned band) · sparkle · "New on your path" | grey | A level the path added **behind** You are here that Lan never held | "New on your path" · "Added to {path} on {date}". Note: "You haven't held this level, so it isn't completed yet. It becomes completed when an approved assessment meets it, or when your manager marks it." No buttons |
| **You are here** | brand/200 · pin · "You are here" | grey | The employee's official role (Employee Mapping) | "You are here" (blue) · "Your official role · set by your admin" |
| **Active target** | green/100 · flag · "Active target" | green | The one role the employee works toward | "Active target" (green) · "{path}" (+ " · the path you follow" on the followed path) |
| **Planned** | light grey · clock · "Planned" | grey | Later levels of the followed path; steps added from another company path | "Planned" · "{path}" (+ " · the path you follow") |
| **Career vision** | violet/100 · compass · "Career vision" | dashed violet | Roles in the employee's own visions | "Career vision N · draft/waiting/approved/declined" (dashed) · "Your own direction · …" |

- Vision cards are numbered only when there are 2+ visions ("Career vision 2"). A card shared by
  two visions says so: **"Career visions 1, 2"**.
- The map shows each role **once**. A role can be on several routes (e.g. two visions share a
  stretch).
- Selected card: 2px focus-blue outline. On the active route: a ring in the route's colour (not on
  Completed cards, not on the card a vision starts from).

### 4.2 Competency status: role vs. the employee's approved scores

| Status | Meaning | Dot / bar colour | Row value | Row expands to | Action |
|---|---|---|---|---|---|
| **Growth area** | Approved score below what the role needs | warning (orange) | "3 → 4" (You → Needed) | "What 4 · Advanced looks like" + the Matrix's behavior text | **Plan an action** (toast "My Actions is coming next") |
| **Not assessed yet** | Role sets an expectation, employee has no approved score | border-strong (grey) | "3" (Needed) | "No approved score yet · needs 3 · Intermediate" | none (manager's job) |
| **Ready** | Approved score meets the expectation | success (green) | "3" (You) | "You're at 3 · Intermediate" + "Based on: {source}" | none |
| **Not set** | Setup has no expectation for this level | border-default | "Not set" | "Setup hasn't set an expectation for this level yet…" | none |

Groups in this order: Growth areas → Not assessed yet → Ready (collapsed) → Not set in Setup
(collapsed). Each group is a Card; rows are Accordion items (one open at a time). If **every**
expectation is Not set, the panel says "Nothing to compare yet. This level has no expectations set
in Setup." and shows no bar.

### 4.3 Career vision request status

| Status | Route badge | Employee can | Panel note |
|---|---|---|---|
| **Draft** (no request) | "Draft" (dashed) | Request manager approval · Remove | "It leaves your company path, so your manager approves it before any role in it can become your target." |
| Draft while **another** vision is waiting | "Draft" | Remove | "Career vision N is waiting for approval. You can send one at a time. Withdraw it to send this one." |
| **Waiting for approval** | blue | Withdraw request (→ Draft, note kept) | "Your manager is reviewing it. Your current role stays the same." |
| **Approved** | green | Set a role in it as target · Remove | "Your manager agreed on this direction. Select a role in it to make it your target." |
| **Declined** | secondary | Edit and resend · Remove | "Your manager: "{note}"" + the Draft note |

Approve / decline can't happen yet (no manager screen), so a sent request stays Waiting.

## 5. Components and their behaviour

### 5.1 Progress strip (feature: `ProgressBoard`)

- Heading "Toward **{target}**" (flag icon). A short segmented bar (ready / growth / not assessed)
  and one outline **count button** per non-zero group, then "of {total}" and an ⓘ tooltip.
- A count button opens the target in the panel **with that group expanded and scrolled to**.
- Tooltip: "Scores come from your latest approved assessment. "Not assessed yet" means a
  competency has no approved score yet, so it doesn't count as a growth area. Your manager assesses
  it in a future assessment." + "{n} expectations are not set in Setup." when any.
- **No target** → `NoTargetStrip`: "**No target yet.** Pick a role on your map and choose Set as
  target to track your progress." When a path change took the target off the map (the plan still
  names it): "**Pick a new target.** {role} is no longer on your path. Pick a role on your map and
  choose Set as target."
- **Path change notice** (2026-09-28; moved from the strip into the header the same day): while the
  followed path has a change Lan hasn't opened, a design-system **Alert (info)** sits in the page
  header **on the row of Map / List and Ask AI** (same place as Setup's progress Alert), as wide as
  its content: info icon · "{path} changed {date}" · link **See what's different** → Path history.
  Below 640px it takes its own full-width row under the title. It goes once Path history is opened;
  no required acknowledgement.

### 5.2 Career map (design system: `CareerMap`)

- Read-only canvas (React Flow): no drag, connect or delete. Cards 176×104, level as title
  ("L3 · Senior"), Position under it, status band on top (§4.1).
- **Layout:** the followed company path is row 0, every level left → right. Each Career vision gets
  its own row below; added company paths below the visions. Columns come from the longest chain of
  links, so a card sits right of everything leading to it.
- **Routes** (lines), coloured by role, not identity:

  | Role | Line | Active | Inactive |
  |---|---|---|---|
  | Path you follow | solid | green/700 | green/400 |
  | Other company path | solid | zinc/600 | zinc/400 |
  | Career vision | dashed | violet/600 | violet/400 |

  Active route = the selected one, or the followed path when nothing is selected: 3.5px, strong
  colour, ~10px arrows, ring on its cards. Others: 2px, `-inactive` token. **Each route keeps its own
  line** even where two routes share a stretch.
- **Click** a card → selects it. Click a line → selects its route. Click empty canvas (not a drag) →
  clears. Tab reaches every card; Enter / Space selects.
- **Opening view:** the whole map if it fits at ≥70% zoom, else the role before You are here, You
  are here and its next steps (so a level a path change added just behind is visible on load). When cards are added and the whole map isn't readable, it moves to the new cards. Zoom out /
  in / Show whole map (down to 40%) top-right; drag to pan, pinch to zoom; mouse wheel scrolls the
  page. brand/100 canvas, brand/300 dot grid.

### 5.3 Legend (design system: `CareerMapLegend`)

One outline button per route **drawn on the map** (never every company path). Swatch (dashed for
visions) + name; the followed path reads "{name} · you follow". Active route: pressed fill,
SemiBold, strong swatch. Click selects the route; clicking the selected one clears it. The keyboard
way to select a route (lines aren't focusable).

### 5.4 List view (design system: `CareerMapList`)

- Same data as the map. **One Card per route**, in legend order: header = route button (selects the
  route) + badge ("You follow" / "Company path" / "Draft", "Waiting for approval"…), one context line
  under it.
- Rows = selectable Items on a rail in the route's colour (solid green / grey, dashed violet):
  "Backend Engineer L2 · Mid · You are here". The Active target row adds its counts ("2 growth areas ·
  2 not assessed yet"). Vision rows don't repeat "Career vision".
- Every route but the followed one starts with a grey **"Starts from {role}"** row: context only,
  never selected. A Career vision lists its **whole road**, so roles it shares with another vision
  appear in both cards.
- **Keeps the selection in view:** when the selection changes (e.g. a new vision lands at the end)
  or the list opens, it scrolls itself (never the page) to that route's Card, or to the selected row
  if the Card is taller than the list. Nothing moves when it's already visible.
- Safety net: if a route's data ever forks, every role is still listed in its Card; no untitled
  rows at the top.

### 5.5 Detail panel: one selection at a time

Selection is a **card**, a **route**, or **nothing**. The panel is open while something is selected;
opens on **You are here**. Cleared by empty-canvas click, **Esc** (unless a dialog is open) or ×.
Every panel: title, badge, context line under it; content scrolls; **footer pinned** with notes
first, then full-width buttons (primary, outline, then red ghost).

**Role panel** (a card): readiness bar + competency groups (§4.2) + footer:

| Card status | Buttons (in order) | Note |
|---|---|---|
| Completed | none | none |
| You are here | Explore a position from here | none |
| Active target | Explore a position from here · **Remove as target** | none |
| Planned (followed path) | **Set as target** · Explore a position from here | none |
| Planned (added company path) | Set as target · Explore… · **Remove from my map** | the block reason, if any |
| Career vision | (Set as target if its vision is Approved) · **Show Career vision N** (one per vision the card is on) · Explore… | "Your manager approves career visions before they can become your target." unless approved |

**Route panel** (a route): its roles as one-line rows (status icon, "{role} · {status}", arrow;
click opens that card) + footer:

| Route | Badge · context | Buttons |
|---|---|---|
| Path you follow | "You follow" · "Planned by your company · N levels" | Open Active target (if there is one) · **Path history** (if the path changed) |
| Other company path for the role | "Company path" · "For your role · no approval needed" | **Follow this path** (note: "It becomes your main route, shown in the top row.") |
| Career vision | request status (§4.3) · "Your own direction · private" | per §4.3 + **Remove Career vision N** |

### 5.6 Toolbar

- **"Following: {path}" picker** only when 2+ company paths include the employee's level
  (Engineering growth / Engineering to product). Picking another opens the switch dialog (§6.4).
- **Explore a position** (§6.2). Same toolbar above the list in List view.

### 5.7 Ask AI (feature: `career-chat.tsx`)

Chat panel with canned replies (mock). It can: suggest a Career vision (shows a proposal card →
**Add to my map** creates the next vision; "Those roles are already on your map" if nothing is new),
explain what the target needs (growth areas, then not assessed yet: "Your manager assesses the ones
not assessed yet in a future assessment"), compare two roles. It never changes the map on its own.

## 6. Actions and rules

### 6.1 Set / remove the target

- **Set as target**: on Planned cards and on cards of an Approved vision. Dialog "Make this your
  target?" · "Your progress strip will track the new role instead." · From (or "No target yet") → To ·
  "{old} stays on your map as Planned. Your official role doesn't change. A target is your own goal,
  not a promotion or transfer." Old target becomes Planned. No approval.
- **Remove as target**: on the Active target. Dialog "Remove your target?" · "{role} stays on your
  map. You just stop tracking progress toward it." The card becomes Planned; the strip becomes the
  No-target strip.

### 6.2 Explore a position (dialog)

Opened from the toolbar or "Explore a position from here" (defaults to the selected card).
Fields: **Starting from** (any card but Completed) · **Position** (Published only, grouped by
department) · **Join at** (default: the next level up in your own position, else the first level).
The **whole ladder** from Join at to the top is explored. Preview = a vertical rail: grey start
row, then one row per role; a role already on the map reads "{role} · already on your map" in grey.

What the move becomes:

1. **Company-path steps** if the move is on a company path planned for the employee's role (both
   roles on it, in order). Heading "Part of {path} · no approval needed", solid rail. Only roles not
   on the map yet are added, as far as the path goes.
2. Otherwise a **Career vision**, dashed violet rail, "Private until you send it for approval.":
   - From the **last card** of a vision → **"Joins Career vision N"**: the vision continues.
   - From a card **in the middle** of a vision → **"Becomes Career vision N"**, a new vision that runs
     the whole way: it shares the old vision's roles up to the start card, then goes on. Example:
     vision 1 = BE L2 → Design L1 → L2 → L3. From Design L2, explore QA → vision 2 = BE L2 →
     Design L1 → Design L2 → QA L1…
   - From any other card (You are here, target, Planned) → **"Becomes Career vision N"** from there.
   - Roles already on the map are **reused** (one card per role), so a vision can run through them.
   - A vision never loops back: roles behind it (its own roles, You are here, Completed) are
     skipped.
3. **Error** "{Position} from {level} is already on your map." when nothing is new (every step is
   already a line on the map).

Confirm → toast "{Position} added to Career vision N" / "…added as planned steps"; the last new role
is selected.

### 6.3 Remove

- **Remove from my map**: on a card from an added company path. **Remove Career vision N**: on a
  vision's route panel. The preview lists every card that goes, including cards added from them;
  roles still used by another route stay.
- **Blocked** (button hidden, reason shown in the footer) when the Active target would go ("Your
  Active target is on it. Set another target before removing it.") or a Waiting vision would go
  ("Career vision N is waiting for approval. Withdraw the request before removing it.").
- You are here and the followed path can't be removed.

### 6.4 Switch the company path you follow

Picker or **Follow this path** → dialog "Follow a different company path?" From → To. If the
Active target isn't on the new path, the next level after You are here becomes the target and the
dialog says so. No approval (admins published the path). Toast "You now follow {path}".

### 6.5 Request manager approval (Career vision)

Dialog "Send Career vision N for approval": the route in one line "{start} → {destination} · N new
roles", optional "Note for your manager", "Your current role stays the same. You can withdraw it
while it's waiting." → **Send request** → toast "Career vision N sent for approval". One request
open at a time. Withdraw → "Request withdrawn. Career vision N is a draft again."

---

## 7. Development loop (decided 2026-09-28)

Target → **Assessment** → Growth areas → **Action plan** (My Actions) → **Evidence** → next
Assessment. Build docs: `my-assessment-build.md`, `my-actions-build.md`. For My Career:

- Scores = the latest Completed Assessment per competency.
- A growth row's Plan an action will open My Actions for that growth area.
- Still planned: Ready rows say "Based on H2 2026 assessment, approved {date}" (with mock
  Assessments).
- **My Records is kept** (decided 2026-09-28, reversing the earlier drop): the employee's proof of
  work, the input to the next Assessment, and what AI reads to propose actions and suggest scores.
  Sidebar keeps Records; its place (siblings My Career · My Actions · My Records, never Actions
  inside Records) is still to confirm. Screen not designed yet.

## 8. When a company path changes (built 2026-09-28)

The plan **follows the latest version** of the path (PRD-020 OQ-09); nothing changes silently and
every change is explained. Rules (example: old A → B → C → D, Lan held A and B, is at C; the path
becomes A → X → C → E):

| Case | What happens | Built |
|---|---|---|
| A (held, still on the path) | Stays **Completed**: completion comes from history (`employee.heldLevels`), not path order | yes |
| B (held, removed) | Leaves the map; stays in history | yes (by the same rule) |
| X (new, before You are here, never held) | Card status **New on your path**. Becomes Completed when a Completed Assessment meets it, or when the manager marks it | status yes; completing it no (needs Assessment / manager screen) |
| C (You are here) **replaced** by C′ | Lan's **You are here becomes C′** automatically (decided 2026-09-28). The admin sees it first in Setup's preview ("N people at C move to C′") and confirms; only the path an employee **follows** moves them. C goes into Lan's held-levels history. The comparison is redone for C′ (below) | not built |
| C (You are here) **removed**, nothing replaces it | Lan stays at C (C stays as its own card) and is asked to pick a path again | not built |
| E (new, ahead) | Planned | yes (mock: FE L3) |
| D (removed, ahead) | Leaves the map. If it was the Active target → no target; the strip says "Pick a new target" | yes (mock: BE L3, the target) |
| A branch starting from a removed card | Re-attaches to the nearest earlier level still on the map (by the path's previous order), or You are here; its status is kept | map rule yes; no mock case on load |

**When You are here moves to C′** (decided 2026-09-28; detail in `my-assessment-build.md` → "When
You are here changes"): no new assessment is forced; the You are here panel shows at once what Lan
already meets at C′ and what not:
- same competency → the approved score carries over (Ready / Growth area);
- new competency with a similar one scored in another Matrix → **Suggested** score from AI
  (based on that competency + Lan's records and actions), counted after the **manager confirms**
  (B1);
- new competency with nothing similar → Not assessed yet;
- competencies C had and C′ doesn't → gone from the comparison, but their scores, Actions and
  Records stay in history and can count toward a later role with a similar competency.

**How Lan is told** (2A + an Alert, 2026-09-28): the path-change Alert in the page header (§5.1),
the "Pick a new target" strip when the target went, and the card status band (§4.1). **Path history** = the shared History drawer (title "Path history", the
path's name), opened from the notice or the followed path's route panel: one entry per change,
newest first, "Your company · {date}", in plain words: "Engineering growth changed. Added Frontend
Engineer L1 · Junior before your level. You haven't held it, so it isn't completed yet." plus what it
did to the plan ("Backend Engineer L3 · Senior was your target. Pick a new one." · "Career vision 2
now starts from Backend Engineer L2 · Mid. Its status is kept.").

**Mock on load:** Engineering growth changed on 27 Sep: BE L1 → BE L2 → BE L3 → BE L4 became
BE L1 → **FE L1** → BE L2 → **FE L3** → BE L4. So on load: FE L1 is **New on your path**, BE L3 (Lan's
Active target) is gone and the strip asks to **pick a new target**, FE L3 is Planned, and the header
shows the Alert. Path history: "Engineering growth changed. Added Frontend Engineer L1 · Junior
before your level. You haven't held it, so it isn't completed yet. Added Frontend Engineer L3 ·
Senior ahead. It's planned on your path. Removed Backend Engineer L3 · Senior. It was your target, so
pick a new one." There is **no demo control** in the UI (a "Simulate another change" button was
added without approval and removed 2026-09-28). Re-attaching branches is a `buildMap` rule without a
mock case.

**Not built:** C → C′ (You are here moves, Suggested scores) · C removed with no replacement · the
Notifications item (the sidebar's Notifications is a static link with a badge; there's no
notifications panel yet) · the admin side (changing a path in Setup, with the "N people move"
preview) · completing a New-on-your-path level.

## 9. Career vision: approval

```
Draft (private) → Request approval → Waiting ─► Withdraw → Draft
                                      ↓
                          Approved  or  Declined (note → edit and resend)
```

| State | Employee | Manager (not built) |
|---|---|---|
| Draft | Edit (Explore), remove, request | Doesn't see it |
| Waiting | Withdraw | Approve / decline (note required), ask AI |
| Approved | Set a role in it as target | Sees it on the team view |
| Declined | Read note, edit, resend | — |

**Manager review (planned, AI-assisted):** everything the employee sees + an AI summary per
competency (Ready / Growth area / Not assessed yet, counted, not scored), what it's based on, and a
suggested focus. AI never recommends approve / decline.

**What approval does (recommendation, not decided):** approval = "we agree on this direction". The
vision's roles can become the target; **the official Position-Level doesn't change**; the official
move stays with the admin in Employee Mapping (later: manager "recommends the move"). Same split as
Lattice / SAP (direction) vs Workday (job change). Sources in `market-research.md`.

---

## 10. Mock data and code

`my-career/mock-data.ts` (Positions, Levels, expectations and Matrices come from Setup's
`initialPositions`):

- **Employee** Lan Nguyen, `BE-L2`, `heldLevels: ['BE-L1']` (Completed comes from this). **Company paths**
  carry `changes` (newest first, each with the levels `before` and optional `effects`): Engineering growth (BE L1–L4), Engineering to
  product (BE L2 → L3 → PM L2 → L3), Design craft (PD L1–L3); shown only when every position is
  Published. **Plan**: followed path, target (`BE-L3`), branches (company-path steps or Career-vision
  steps). Initial Career vision 1: BE L2 → PD L1 → PD L2.
- **Scores** (`evidence`): Lan's point + source per competency (stands in for Assessment until the
  mock Assessments step). No entry = Not assessed yet (code status `evidence`).
- **Request**: which vision was sent, status, notes. None = every vision is Draft.

Code notes:
- `buildMap(plan)` derives cards and links; one card per level; **links are per route**. A card
  records every vision it's on (`visions`).
- `classifyMove` → company-path step vs Career vision; `ladderMove` builds company-path steps;
  `visionMove` builds a Career vision move (joins / becomes, shared road, no loops).
- `describeChange` (added / removed). `buildMap` marks unheld levels behind You are here `new` and re-attaches orphaned branches.
- `visionRoute(plan, n)` = a vision's roles in order. `removeBranch` / `removeVision` drop dependants.
- Selection lives in `MyCareerScreen` (`card` / `route` / `none`).
- React Flow copies `fitViewOptions` each render, so the opening view is computed and applied with
  `setViewport`. Edge ids include the route.
- A Radix DropdownMenu whose items open a Dialog must be `modal={false}`.

## 11. Not built yet

Manager review screen · C → C′ and Suggested scores (§8) · My Records screen · Notifications
panel (for §8) · mock Assessments + "Based on …" Ready
rows · My Actions / Assessment screens · empty state for "no role assigned" · Records decision (§7).
Mobile polish comes last.

## 12. Open questions

- [ ] **What approval does**: accept §9's recommendation (direction only, no role change)?
- [ ] Declined Career vision: stays for resubmitting (current), or removed?
- [ ] User-facing word "target" or "goal"?
- [ ] Assessment: who creates one; which period wins (assumed: latest Completed)? No PRD.
- [ ] Action plan: does the manager approve the plan or each Action?
- [ ] Company-path change rules (§8): confirm with the team (re-attach rule is our proposal; built
      as proposed).
- [ ] Core path "for my department" (brief) vs "the path that contains my current Level" (built).
- [ ] Keep manager approval for Career visions? (Brief doesn't mention it; PRD-020 puts "job
      transfer approval" out of scope.)
- [ ] Terms: brief "Core Career Path" / "Target Position" vs UI "company path" / "Active target".
- [ ] Sidebar: My Career · My Actions · My Records as siblings? (Records is kept; Actions must not
      sit inside Records: an Action produces a Record, not the other way round.)
- [ ] C → C′ when C is on several paths: only the followed path moves You are here (proposed).
- [ ] Suggested scores: how "similar" is decided, and where the manager confirms them.
- [ ] Competency library (shared competencies across Matrices): future, not built.
- [x] Keep My Records: **yes** (2026-09-28).
- [x] Cross-Matrix scores: AI suggests, manager confirms (B1, 2026-09-28).
- [x] Setting a target on a company path needs no approval.
- [x] Scores come from Assessment (2026-09-28); evidence is input, AI only summarises it.
- [x] Company path changes: follow the latest version, with §8's rules.

## 13. Old prototype: what the rebuild fixed

- Readiness **0%** while nothing was assessed (read as failing) → no %, "Not assessed yet".
- "Current L— → Required L4": "L" for competency points → points ("3 · Intermediate").
- AI tip with no evidence behind it → AI shows what it read.
- Four entry points for adding; "Apply career path" led nowhere → one Explore a position dialog.
- Actions and Records before any target (BR-15) → progress only toward the Active target.
- Personal branches not distinguished from company paths (RQ-09) → dashed violet Career visions.
- 50% default zoom, name shown three times, colours by path name → ≥70% zoom, one name, colour by role.
