---
title: My Career build
created: 2026-09-25
updated: 2026-09-28
status: Employee view built (localhost:3000/me/career) — map, progress strip, detail panel, gap rows, Set as target, company-path picker, Explore a position, Career visions + request, Remove; manager review and list view not built
related: ../../document/original brief/prd-020-my-career.md, ../../document/original brief/prd-022-my-action.md, my-actions-build.md, my-assessment-build.md, glossary.md, set-up-build.md, ../enpath-tone-and-voice.md
---

#enpath #my-career #build

# My Career build

What the My Career rebuild is and how it's built — kept current as the prototype changes. "What's
built" and "How the map works" describe the current prototype (the source of truth); what's not
built yet is listed at the end of "What's built". Source
brief: PRD-020. Screenshots of the old prototype: `../../image/my-career-current-ui/`.

Run it: `enpath-ui` → `npm run dev` → `localhost:3000/me/career` (sidebar links to Setup and back).
Code: `Enpath-design-system/enpath-ui/src/features/enpath/my-career/` (screen + mock data) and the
design-system component `src/components/ui/career-map.tsx`. Mock data only.

## Source of truth (2026-09-25)

`../../document/original brief/my career.md` (User Expectations) — **not** PRD-020. Decisions on top of it:
- Choosing a Position explores its **whole ladder** from the level you join at (#5).
- Career visions still need **manager approval** (not in the doc — team decision).
- Company paths are created by **admins only** for now (line managers later). A path is offered to
  an employee when it contains their Position-Level; position lists are grouped by department.
- Still to build from the doc: notification when a core path changes (#11), generated actions (#8).

## What My Career is

The employee's own space. It answers three questions, each with its own place on the screen:

| Question | Job | Where it lives |
|---|---|---|
| Where am I? | See my position | "You are here" card on the map + the progress board's starting point |
| Where could I go? | Build my path | The career map (canvas) |
| How am I doing? | Track my progress | The progress board, fixed to the Active target |

The old prototype put all three into one canvas + one detail panel, with equal weight — the
panel showed the *clicked card's* numbers, so "my progress" and "what would this role need" looked
the same. That is the main source of confusion this rebuild fixes.

## Key decisions still in force

- **Keep the canvas — for building the path only.** A career plan branches (company paths + the
  employee's own ideas, across Positions); a list can't show a fork. The canvas is not where
  progress is read. (Team preference + PRD-020 RQ-09.)
- **Progress board on top, fixed to the Active target.** Clicking cards on the map never changes
  it. Only changing the target does.
- **Selecting a card = exploring.** The side panel is labelled "What would this need?" for any
  card that isn't the Active target, so it's never mistaken for the employee's own progress.
- **Two different commitments, never shown alike:**

  | | Active target | Career vision |
  |---|---|---|
  | What it is | A Position-Level the employee works toward | The employee's own drafted path to a role outside their company path (e.g. Developer → Designer) |
  | Who decides | The employee alone (PRD-020 BR-10) | The employee's **manager** approves |
  | Changes the official role? | No | No — see "What approval does" below |
  | How many | One (PRD-020 BR-11) | **One open request at a time** |

- **Company paths are always there.** An employee always sees the published Career Path(s) for their
  current role (PRD-020 RQ-03). A Career vision is drafted *on top of* that, not instead of it.
- **Competency statuses: Ready · Growth area · Not assessed yet** (was "Needs evidence", then "Needs records"; renamed 2026-09-28 when Assessment became the only source of scores). "Not assessed yet" = no approved
  Assessment score yet — never shown as a gap or a score (PRD-020 BR-13). **No readiness 0%.**
  Wording follows `enpath-tone-and-voice.md` (a gap is development information, not a verdict).
- **Competency steps are "points," never "levels"** — "3 · Intermediate", not "L3". Same rule as
  Setup.
- **Preview → Confirm** for every plan change: add a branch, apply a path, change the target,
  submit / withdraw a Career vision (PRD-020 RQ-10).
- **AI calculates, people decide.** AI prepares the gap and evidence summary for both employee and
  manager; it never approves, never invents a score where there's no evidence, and always shows
  what it based the summary on.

---

## What's built (2026-09-26)

**Page** — `/me/career`, app shell with My Career active. Viewed as Lan Nguyen, the employee; the
shell's footer still says "Admin" (not addressed — one user in the prototype).
- **Header:** "My Career" + "Lan Nguyen · Backend Engineer L2 · Mid" — the name appears once.
- **Career map** (fills the page) + **legend** underneath naming the routes drawn on it — see
  **How the map works**.
- **Progress strip** (under the header, one line — replaced the three big tiles 2026-09-25): "Toward
  Backend Engineer L3 · Senior", a segmented bar, and clickable counts "2 ready · 2 growth areas · 2
  not assessed yet". Clicking the bar or a count opens the target in the side panel. The ⓘ tooltip holds
  the explanation: "Scores come from your latest approved assessment. 'Not assessed
  yet' means a competency has no approved score yet, so it doesn't count as a growth area. Your
  manager assesses it in a future assessment." (The employee UI never says "gap": the label is Growth areas.) The career-vision
  line was removed (the map and legend already show visions). Fixed to the Active target.
- **Side panel — role card** (redesigned 2026-09-25): role + level; **one badge** (Completed / You
  are here / Active target / Planned / Career vision N · status) and one context line; a readiness
  bar with "2 ready · 2 growth · 2 not assessed yet". Competencies are **grouped by what to do**:
  Growth areas → Not assessed yet → Ready (collapsed) → Not set (collapsed). Each row shows a short
  summary ("3 → 4 · Advanced", "needs 3 · Intermediate") and **expands**: a growth area shows what the
  level means (the Matrix's behavior text) + **Plan an action** (My Actions); not assessed yet says "No
  approved score yet · needs {point}" and has **no button** (assessing is the manager's job, 2026-09-28), and nothing more (the "doesn't count as a growth area"
  explanation lives in the ⓘ tooltip, 2026-09-28); ready shows the record it's based on.
  Plan an action shows a "coming next" toast until those modules exist (#8).

**Lan's plan** (mock) — follows Engineering growth: Completed Backend Engineer L1 → **You are here** L2
· Mid → **Active target** L3 · Senior → Planned L4 · Staff. Career vision 1: Backend Engineer L2 →
Product Designer L1 → L2 (dashed).

**Map layout** (decided 2026-09-25) — the company path Lan follows is **one row**, every level of it
left → right: earlier levels **Completed**, then You are here, the Active target and Planned. Each
Career vision gets its **own row below**, starting under the card it branches from; added company
paths get rows below the visions. Nothing else branches off the target unless Lan adds it.

**Checked in the browser** at 390 · 768 · 1024 · 1280 · 1440px — no page-level horizontal scroll,
click and keyboard selection, sidebar navigation to Setup and back, no console errors. The
Storybook stories were not checked yet (Storybook needs a restart to pick them up).

**Set as target** — on any Planned (company-path) card, and on Career vision cards once approved.
Preview: "Make this your target?" From → To, "{old target} stays on your map as Planned. Your official
role doesn't change. A target is your own goal, not a promotion or transfer." Confirm → the old
target becomes Planned, the board re-counts for the new target, toast "{role} is your new target".
No approval needed (assumption, confirmed in chat 2026-09-25).

**Side panel layout** — every panel (role card, company path, Career vision) puts its actions in a
footer pinned to the bottom: the explanation first, then full-width buttons (primary, secondary,
then Remove). The content above scrolls; the footer stays put.

**Company path you follow** — when more than one published path includes Lan's current level, a
"Following: {path}" picker sits top-left on the map (Engineering growth / Engineering to product).
Switching previews From → To; if the Active target isn't on the new path, the preview says which
role becomes the target. **No approval** — company paths were already approved when the admin
published them (decided 2026-09-25). With one matching path there's no picker.

**Explore a position** (2026-09-25 — replaced "Explore a role", per `my career.md` #4–#5) — button on the
map toolbar, and "Explore a position from here" in the panel. One dialog:
- **Starting from** — defaults to the selected card (any card except Completed).
- **Position** — grouped by department. **Join at** — defaults to the next level up in your own
  position, otherwise the position's first level; you can change it.
- The **whole ladder** from Join at to the top of the position is added on its own row (levels
  already on the map are skipped). The dialog previews the route as a **vertical step rail**
  (2026-09-26, option A — replaced the blue info Alert): a small heading, the start role in grey
  ("Backend Engineer L2 · Mid · You are here"), then one row per new role with a ring on a rail in the
  map's line language:
  - On a company path planned for Lan's role → heading "Part of {path} · no approval needed", solid
    rail in the route's role colour (green if it's the followed path, grey otherwise) (e.g. join Product Manager at L2 from
    the Active target L3: on Engineering to product).
  - Otherwise → heading "Becomes Career vision N" (or "Joins Career vision N" from a vision card),
    dashed violet rail, and one line: "Private until you send it for approval."
  Description: "See the path from where you are to another position. It doesn't change your current
  role." (dropped "what each level would need" — the dialog doesn't show it).
- Already on the map → inline error.

**Published only** (2026-09-25, `my career.md` #16) — My Career shows only positions Published in
Setup (Explore a position list), and a company path only when every position on it is published.
To make the mock consistent, Setup's shared mock now has Backend Engineer and Product Manager
Published and the Product matrix Active (with an owner and behavior text). Side effect: Setup has no
Draft position or matrix to demo Publish with on load — creating one shows it.

**Stop following this path** (2026-09-25, `my career.md` #12) — in the followed path's route panel
(footer). Preview lists every card that leaves the map (earlier Completed levels, Planned levels,
anything added from them). Blocked if the Active target or a waiting Career vision is on it: the
button stays visible but **disabled** (grey ghost, not faded red, so it doesn't look clickable), the reason shows above it, and **Open Active target** (outline)
jumps to the target so it can be removed (2026-09-26). After: the top row is just "You are here", and the toolbar picker says "Choose a
company path" — picking one previews "Follow {path}?" (From: No company path).

**Remove as target** (2026-09-25, `my career.md` #13) — on the Active target card (footer, last).
Preview: "{role} stays on your map. You just stop tracking progress toward it." After confirming, the
card becomes Planned and the strip says "No target yet. Pick a role on your map and choose Set as
target to track your progress." Set as target then shows "From: No target yet".

**Remove from my map** — on anything Lan added (not the current role or the followed path). Preview
lists every card that goes, including ones added from it. Blocked, with the reason shown, when the
Active target or a Career vision waiting for approval would go.

**Career vision request** (employee side) — any number of Career visions; **only one can be sent to
the manager at a time** (decided 2026-09-25). **No manager name in the employee UI** (user,
2026-09-26): copy says "your manager" or "for approval" — never "Minh Tran". The others stay on Lan's map to explore. The board shows "Career vision N: {destination}" +
status badge (Waiting for approval / Approved / Declined + "Your manager: “note”"). On a Career
vision card the panel offers:
- While another vision is Waiting: no send button — "Career vision 1 is waiting for approval. You
  can send one at a time — withdraw it to send this one."
- Draft → **Request manager approval** ("It leaves your company path, so your manager approves it
  before any role in it can become your target.") → dialog (option C, 2026-09-27): title "Send
  Career vision N for approval", the route collapsed to one line "{start} → {destination} · N new
  roles", optional "Note for your manager", info line "Your current role stays the same. You can
  withdraw it while it's waiting." → Send request → toast "Career vision N sent for approval".
- Waiting → **Withdraw request** → back to Draft (the note is kept for next time).
- Approved → **Set as target**. Declined → **Edit and resend**.
Approve / decline can't happen yet — the manager review screen isn't built, so a sent request stays
Waiting.

**New components:** **Stat** (design system, `Display/Stat`) — the board's tiles; tone colours the
icon only. **Gap row** — feature-level (`my-career/gap-row.tsx`, Item + Badge), not in the design
system yet.

**Not built yet:** manager review · list view fallback · empty states (no target, no role assigned) ·
Actions and Records counts on the board.

## How the map works (source of truth, 2026-09-26)

Design-system component `Navigation/Career Map` (`career-map.tsx`, spec `career-map.meta.json`), on
React Flow. Read-only: no dragging, connecting or deleting. My Career passes cards and links; the
component lays them out left → right.

### Cards — one per role on Lan's map

Every card: a tinted **status band** on top (icon + label), the **level as the title** ("L3 ·
Senior" — it's what changes along a path) and the Position under it in small grey text. White card,
`shadow/surface`, 176×104.

| State | Band + label | Border | When a card is in it | Selecting it opens |
|---|---|---|---|---|
| **Completed** | grey · check · "Completed" | grey | Earlier levels of the followed path | Role panel, no actions. Level text grey; never ringed |
| **You are here** | brand/200 · pin · "You are here" (brand) | grey | Lan's official role (from Employee Mapping) | Role panel — "Your official role · set by your admin" |
| **Active target** | green/100 · flag · "Active target" (green) | green | The one role Lan works toward | Role panel with the gap groups; **Remove as target** |
| **Planned** | light grey · clock · "Planned" | grey | Later levels of the followed path, and roles added from another company path | Role panel; **Set as target** |
| **Career vision** | violet/100 · compass · "Career vision" (numbered only when there are 2+) | dashed violet | Roles in one of Lan's own drafted paths | Role panel; Show Career vision N; Set as target only once approved |

Selected card = 2px focus-blue outline. All role panels: badge + one context line, readiness bar,
competencies grouped Growth areas → Not assessed yet → Ready → Not set, **Explore a position from here**.

### Routes — lines between cards, coloured by role

A route is a company path or a Career vision. **Colour says the route's role, never which path it
is** — the legend names it. (Per-path colours were dropped 2026-09-26: they changed when Lan followed
another path, ran out after three, and two failed contrast.)

| Role | Line | Active | Inactive | How it gets on the map |
|---|---|---|---|---|
| **Path you follow** | solid | green/700 (4.2:1) | green/400 | Always: row 0, every level of it |
| **Other company path** | solid | zinc/600 grey (6.4:1) | zinc/400 | Only when Lan adds its steps via **Explore a position** (planned, no approval) |
| **Career vision** | dashed | violet/600 (3.5:1) | violet/400 | Lan drafts it via Explore a position; private until sent |

- **Active route** = the selected route, or the **followed path when nothing is selected**. Active:
  3.5px line, the strong token, ~10px arrowheads, and a ring in its colour on its cards (not on
  Completed cards, not on the card a vision branches from). Inactive: 2px in the light `-inactive`
  token. **No opacity anywhere**; cards and text are never dimmed.
- Selecting another company path makes it dark grey and thick while the followed path drops to light
  green — green always means "your path", even when it isn't the one you're looking at.
- **Route panel header** (2026-09-27, option A — same pattern as the role card): title, then a badge
  carrying the route's swatch, then one context line **under** the badge (2026-09-28: every detail panel —
  role, target, route — stacks badge and context the same way). Followed: "You follow" (success) · "Planned by your
  company · N levels". Other company path: "Company path" (secondary) · "For your role · no approval
  needed". Career vision: request status badge ("Draft" dashed / "Waiting for approval" / …) · "Your
  own direction · private". Replaced the eyebrow + swatch + title + repeated description.
- Selecting a route opens the **route panel**: company path → its levels as one-line rows (status icon,
  "Backend Engineer L2 · Mid · You are here", arrow; click opens that card), **Follow this path** if
  it's another path for Lan's role, or **Stop following** / **Open Active target** on the followed one.
  Career vision → its route, status and Request / Withdraw / Remove.

### Legend — below the map

One **outline button** per route **drawn on the map** — never every company path in the company
(decided 2026-09-26; the "Other paths" menu was dropped — other paths come in through Explore a
position). Each: a 20×3px swatch in the role colour (dashed for visions) + the route name; the followed
path reads "{name} · you follow". The **active** route's button takes the outline pressed fill and
SemiBold text, its swatch the strong colour; the others show secondary text and the light swatch.
Clicking selects that route; clicking the selected one again clears the selection. Legend buttons
are the keyboard way to select a route (lines aren't focusable).

### List view (2026-09-28, option A)

A **Map / List** switch (design-system `ButtonGroup` of two ghost buttons; the current view is pressed) sits in the page header, next to Ask AI (not in the map toolbar: with the
detail panel open the canvas is ~600px and the zoom buttons would cover it). The page opens in
**List below 1024px** and **Map above**; the employee's choice wins for the session.

List = design-system `CareerMapList`, fed the same data as the map. **One card per route** (option B,
2026-09-28: design-system Card, the separation ladder's card step), in legend order: header = route
button (route name at text-base) (selects the route, opens the route panel) · badge ("You follow" /
"Company path" / "Draft", "Waiting for approval"…) · then one line under it ("Planned by your company · 4 levels";
Career vision: "Your own direction · private"). Every route but the followed one begins with a grey
"Starts from Backend Engineer L2 · Mid" row (context only: never shown selected, so "You are here"
appears once), like the Explore dialog's rail. The toolbar above the list is on plain white. Rows are selectable Items on a rail in
the route's colour (solid green / grey, dashed violet): "Backend Engineer L2 · Mid · You are here";
the Active target row adds its counts ("2 growth areas · 2 not assessed yet"); vision rows drop the
repeated "Career vision" label. Selecting a row opens the same detail panel as a card. The toolbar
("Following…", Explore a position) sits in a bar above the list.

### Selection and the detail panel

One selection at a time: a **card**, a **route**, or **nothing**. The panel is open while something is
selected and closed otherwise (map takes the full width). Opens on **You are here**. Clicking empty
canvas (not a drag), **Esc** (unless a dialog is open) or the panel's **×** clears it; clicking a card,
line, legend button or progress count sets it.

### Canvas and controls

brand/100 canvas with a brand/300 dot grid. Toolbar top-left: "Following: {path}" picker (only when
2+ paths fit Lan's role) + **Explore a position**. Zoom out / in / Show whole map top-right (Button
icon, same height as the toolbar). Opening view never shrinks text below 70% zoom; scroll-wheel zoom
off. Tab reaches every card; Enter / Space selects. Tried and rejected: glass toolbar. React Flow's
attribution badge is hidden (MIT licence).

---

## Assessment, Action plan and evidence (decided 2026-09-28)

These now have their own build docs: **`my-assessment-build.md`** and **`my-actions-build.md`**. The
loop and terms: `glossary.md` → My Career terms. What they mean for My Career:

- Scores come from **Assessment** (latest Completed per competency). The employee UI says **Growth
  area**, never "gap".
- A growth row's **Plan an action** opens My Actions (the Action plan) for that growth area.
- **Evidence** replaces Records (the Records module is dropped). Copy done 2026-09-28: "Not assessed
  yet", no button on the row (not the employee's job; "Add evidence" was tried and removed). Still planned: Ready rows say "Based on H2 2026 assessment, approved {date}"
  (with mock Assessments) — `what should be done.md` → "Next steps".

## When a company path changes (proposed 2026-09-28, from the dev team)

The employee's plan **follows the latest version** of the path (answers PRD-020 OQ-09), but nothing
about the person changes silently and every change is explained. Example: old A → B → C → D, Lan held
A and B, is at C; the path becomes A → X → C → E.

| Case | What happens |
|---|---|
| A (held before, still on the path) | Stays **Completed** — completion comes from Lan's history (Levels held in Employee Mapping), not from the path's order |
| B (held, removed from the path) | Leaves the map; stays in Lan's history |
| X (new, before You are here, never held) | Tagged **New on your path**. Becomes Completed when a Completed **Assessment** meets X's expectations, **or when the manager sets it** ("Completed · set by your manager, {date}" in Path history). A manager-set Completed doesn't change the scores shown |
| C (You are here) | Never moves by itself. If the path drops C, C stays as its own card and Lan is asked to pick a path again |
| E (new, ahead) | Planned |
| D (removed, ahead) | Leaves the map. If D was the Active target → no target, the strip asks to pick one |
| A branch (Career vision or added path) starting from a removed card | Re-attaches to the nearest earlier Level still on the path, or to You are here. **Its status is kept** (Draft / Waiting / Approved) — where it leads didn't change |

**Who changes core paths:** Admin, in Setup (the prototype's model; managers can suggest later).
**How the employee is told:** one banner on My Career ("{path} changed. See what's different") + one
item in Notifications, both opening **Path history**. The banner goes once opened; no required
acknowledgement.
**Path history:** a drawer from the followed path's route panel (reuses Setup's History drawer),
listing each change in plain words with its effect on Lan's plan ("27 Sep · Engineering growth
changed: added X, removed D. D was your target — pick a new one.").

## Career vision — flow

```
Company path (always shown, read-only)
   ↓
Draft a Career vision — add roles outside the company path, as a dashed branch
   ↓
Review "What would this need?" for the destination (AI summary + gaps + evidence)
   ↓
Request manager approval — preview: from → to, manager name, optional note,
"your current role stays the same"
   ↓
Waiting for manager ──► Withdraw (back to Draft)
   ↓
Approved  or  Declined (with note → edit and resubmit)
```

| State | Employee can | Manager can |
|---|---|---|
| Draft | Edit, delete, request approval | — (not visible) |
| Waiting for manager | Withdraw | Approve, decline (note required), ask AI |
| Approved | See it as their plan; change target within it | See it on the team view |
| Declined | Read the note, edit, resubmit | — |

Only one Career vision can be waiting at a time.

### Manager review (AI-assisted)
The manager sees everything the employee sees, plus an **AI summary**:
- per competency: current evidence vs the destination's expectation — Ready / Growth area /
  Not assessed yet, counted, not scored;
- which evidence each line is based on (Records), and where there isn't enough;
- a suggested focus ("2 growth areas; 3 not assessed yet").

AI never recommends approve / decline outright — the manager decides. Declining needs a short note.

### What approval does — recommendation (not decided)
How others handle it:
- **Lattice** — "Career vision" is an aspiration shared with the manager, who reads and replies,
  then supports it through development plans. It is not tied to track, level or competencies and
  never changes the role. [Respond to Career Vision Exercises](https://help.lattice.com/hc/en-us/articles/4421334435479-Respond-to-Career-Vision-Exercises) ·
  [IDP overview](https://help.lattice.com/hc/en-us/articles/4421285496343-Individual-Development-Plans-Overview)
- **SAP SuccessFactors Career Worksheet** — employee picks target roles, sees a per-competency gap
  analysis, gets AI development suggestions; managers see their team's aspirations. Development
  goals flow into the Development Plan. No role change.
  [Career Worksheet](https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM/70097a1a469d47a0ae08809e4a240f98/c8cd6def553d48649f12da834694e108.html) ·
  [Exploring future roles](https://learning.sap.com/courses/sap-successfactors-career-development-planning-and-mentoring-project-team-orientation/exploring-roles-and-evaluating-competencies-in-the-career-worksheet)
- **Workday** — an actual job change is a separate HR "Change Job" process: initiated, approved by
  the receiving manager, then HR partner and compensation / payroll, with an effective date.
  [Change Job process options](https://workdaytraining.geisinger.org/PDFContent/J105_ChangeJobProcessOptions.pdf) ·
  [Job Change job aid](https://info.montgomerycollege.edu/_documents/offices/information-technology/workday/hrstm-and-payroll/job-change-administrators.pdf)

Pattern: **agreeing to a direction** (Lattice, SAP) and **officially moving someone** (Workday)
are always two separate steps with different approvers.

**Recommendation for EnPath:**
1. **Manager approval = "we agree on this direction."** The Career vision becomes the employee's
   approved plan; its destination can become the Active target; Actions and Records now count
   toward it. **The official Position-Level does not change.**
2. **The official move stays with the admin** in Setup → Employee Mapping (PRD-018 owns it; PRD-020
   BR-03). Later, when the evidence shows Ready, the manager can **recommend the move** — this
   creates a task for the admin, who makes the change with an effective date. Not in the first
   build.
3. This keeps PRD-020's rule that a target is never a promotion or transfer (BR-17), while giving
   the team the approval step they want.

---

## Old prototype review (2026-09-25)

**First version** (`../../image/my-career-current-ui/`):
- Readiness **0%** while every competency was "Need Records" — read as failing.
- AI tip claimed "Communication two levels below" with no evidence behind it.
- "Current L— → Required L4" — "L" for competency points, clashing with Position Levels.
- Gaps tab count 0 with 6 items listed.
- Four entry points for adding; "Apply career path" led to "No available destination".
- Actions and Records shown before any target (against PRD-020 BR-15).
- Canvas with pan, zoom, minimap for 3 cards; name shown three times.

**Team's current fix** (screenshot shared 2026-09-25) — better: one "Add from selected", company
paths colored by name, left → right timeline with real branching. Open at the time (our build
answers them — see "How the map works"):
- Card text mixes Position and Level names ("Engineering Manager / Lead Engineer").
- Grey lines have no legend entry.
- Legend: "Completed" unused; "You are here" and "Active target" share a blue dot; "Planned" dot
  orange but cards beige.
- "Company path · read only" while cards say "Planned" and adding is allowed — whose plan is it?
- Personal branches (Career vision) not distinguished from company paths (PRD-020 RQ-09).
- 50% zoom by default makes card text unreadable.
- Progress panel not visible in the screenshot — unknown whether it's separated from the canvas.

---

## Mock data

`my-career/mock-data.ts` — Positions, Levels and expectations come from Setup's `initialPositions`, so
names and counts stay in one place. Built:
- **Employee** — name and manager (stands in for Employee Mapping).
- **Company paths** — Engineering growth (BE L1–L4), Engineering to product (BE L2 → L3 → PM L2 →
  L3), Design craft (PD L1–L3), defined in the My Career mock (Setup's own paths are Draft or
  unsuited to an employee view). The first two include Lan's level, so Lan picks between them.
- **Plan** — the path Lan follows, the Active target, and the branches Lan added (a company path
  joined at a level, or one role in Career vision N). The map is derived from it (`buildMap`) — a
  Position-Level appears once.

- **Evidence** — Lan's assessed point per competency with its source (5 records: System design 3,
  Code quality 3, Delivery 3, Mentoring 2, Research 2); stands in for Records (PRD-021). No entry =
  Not assessed yet (code status `evidence`). `gapsFor(step)` compares it with the step's expectations from Setup.

- **Career vision request** — which vision was sent, its status (Waiting · Approved · Declined), the employee's note and the manager's note. No request = every vision is a draft. A vision's route is read from its branches.

## Implementation notes (for whoever edits the code)

Moved here from session memory 2026-09-26.

- The map is derived from the plan: `my-career/mock-data.ts` → `buildMap(plan)`. `classifyMove`
  decides Planned (on a company path planned for the employee's role) vs Career vision.
- React Flow gotcha: it copies its `fitViewOptions` prop into its store every render and waits to
  measure nodes before a queued fitView — so the opening view is computed from the layout and applied
  with `setViewport`.
- Gap row is feature-level (`my-career/gap-row.tsx`); **Stat** is a design-system component
  (`Display/Stat`, tone colours the icon only).
- Selection lives in `MyCareerScreen` (`card` / `route` / `none`); the detail panel renders only when
  something is selected.

## Out of scope for the first build

- Official role change and its approval (admin, Employee Mapping) — see recommendation.
- Manager's "recommend the move" task.
- Full My Actions and Records modules (only the counts on the progress board).
- Multiple open Career visions.

## Open questions

- [x] **Setting a target on the company path — no approval?** Assumed yes (PRD-020); only a Career - no approve
      vision goes to the manager. Confirm.
- [ ] **What approval does** — accept the recommendation above (direction only, no role change)?
- [ ] Declined Career vision: stays as Draft for resubmitting, or removed? 
- [ ] Changing target: does the old target stay on the map as Planned? (PRD-020 OQ-06 — assumed yes.)
- [ ] Is the user-facing word "target" or "goal"? The team's UI says "Active target"; plainer copy
      might be "goal". `enpath-tone-and-voice.md` wants My Career warmer than Setup.
- [x] ~~How AI derives "current point" from Records (PRD-020 OQ-07)~~ — scores come from
      Assessment (decided 2026-09-28); evidence is input, AI only summarises it.
- [x] ~~Admin changes a company path an employee's plan uses: follow the latest or keep a snapshot?
      (PRD-020 OQ-09)~~ — follow the latest, with the rules in "When a company path changes".
- [ ] Assessment: who creates one (manager only, or can the employee request it)? Which wins when
      two periods disagree (assumed: the latest Completed)? No PRD yet.
- [ ] Action plan: what does the manager's "approve" mean — approve the plan, or each Action?
- [ ] Company-path change rules above: confirm with the team (the "earlier decision" on re-attaching
      branches wasn't in our docs; re-attach to the nearest earlier Level is our proposal).
- [ ] PRD-020 lists "job transfer approval" as out of scope — does a PRD update exist for Career
      vision?

## Design research — employee side

| Product | Employee sees | Commitment | Approval |
|---|---|---|---|
| Lattice (Grow) | Own track: current level + next level expectations | Growth areas, IDP, Career vision | Manager reads and replies; no approval, no role change |
| Culture Amp | Explore roles, compare two side by side | Desired next role → development plan | Not a formal approval |
| SAP SuccessFactors | Career Worksheet: target roles, per-competency gap, AI suggestions | Target role → Development Plan | Manager oversight; no role change |
| Workday Career Hub | AI-suggested roles, gigs, learning; compare job profiles | Career interests shared with manager | Actual moves via separate Change Job process |
| Progression | Skills that unlock the next position; check-ins, wins | Evidence from check-ins | — |

Where EnPath differs: explicit company paths **plus** the employee's own drafted Career vision
across Positions, a manager approval step for it, and a "Not assessed yet" state instead of treating
missing evidence as a gap.

Sources: [Lattice — Employee Development Plans](https://lattice.com/platform/grow/individual-development-plans) ·
[Culture Amp — Career Paths](https://www.cultureamp.com/blog/introducing-develop-career-paths) ·
[Workday — internal mobility](https://www.workday.com/en-us/topics/hr/internal-mobility.html) ·
[Progression](https://progression.co/) · more in `market-research.md`.
