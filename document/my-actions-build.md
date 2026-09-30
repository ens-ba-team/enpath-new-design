---
title: My Actions build
created: 2026-09-28
updated: 2026-09-30
status: List and Board views built (2026-09-30, `/me/actions`). Manager view and links from My Career not built
related: ../../document/original brief/prd-022-my-action.md, glossary.md, my-career-build.md, my-assessment-build.md
---

#enpath #my-actions #build

# My Actions build

What My Actions (the **Action plan**) is and how it will be built. Kept current as decisions land.
Source brief: **PRD-022** (complete). Note: `../../document/original brief/my action.md` is a copy of the My Career
brief, not a My Actions brief — ignore it for this module.

Where it sits in the development loop (`glossary.md` → "How the pieces fit"):

```
Target → Assessment (scores) → Growth areas → ACTION PLAN
Records (what happened, from anyone) ──────────────────────▶ next Assessment
```

My Actions turns growth areas into work. It is **not** a performance or task-management tool
(PRD-022: no performance scoring, KPIs, promotion or salary decisions).

## Decisions (2026-09-28)

- **Ownership:** the **employee creates, edits and works in** the Action plan; the **manager sees it
  and approves**. (Answers PRD-022's "Action Ownership" open questions in the employee's favour.)
- **Every Action is tied to one growth area** (a competency below what the target needs) and has a due
  date. PRD-022 RQ-01: "each generated action should relate to at least one competency".
- **AI proposes, a person adds.** AI suggestions appear as a "Proposal" card (the growth area it
  serves + the outcome to show); nothing joins the plan until someone presses **Add to plan**.
- **Actions and Records are separate** (2026-09-30, see "Actions and Records" below). A Done
  Action does **not** become a record, and Done has no "Add a record" step for now. At the next
  Assessment AI reads **both** Records and Actions and suggests scores; the manager confirms
  (`my-assessment-build.md`, 2026-09-30).
- **Nothing is lost when a role changes.** Actions stay in My Actions with their history even if
  their growth area no longer exists at the new role (e.g. You are here moves from C to C′); their
  records can count toward a later role with a similar competency.
- **Employee-facing words:** "Growth area", never "gap" (the dev team's screen says "Gap:" on cards —
  to change).
- **Entry points:** from My Career, a growth area's **Plan an action** button opens My Actions with
  that growth area pre-selected.

## Sources and how they differ

| Topic | PRD-022 | Dev team's "Action plan" screen | Our decision |
|---|---|---|---|
| Statuses | Suggested → Planned → In progress → Completed → **Validated** | Proposal card, then To do → In progress → Done (kanban) | Kanban columns To do / In progress / Done; Proposal is the Suggested state. **Validated** = to decide (see open questions) |
| Where an action comes from | System generated · Employee added · Manager suggested | Proposal (AI) · "Add action" (employee) | All three, labelled on the card |
| Manager's role | Suggestions + acknowledgement | "Managed by {manager}, visible to Direct Manager" | Employee owns; manager sees + approves |
| Records | Completed action → create / link a **Record** → acknowledged | — | **Not linked for now** (2026-09-30): Done ends the Action; Records live on their own page and are written separately |
| Card content | Action · related goal · competency · notes · completion date | Title · "Gap: {competency}" · due date · "Move to next status" | Title · "Growth area: {competency}" · due date · status control |

## Actions and Records (decided 2026-09-30)

Two pages, two directions in time, one shared key (the competency):

| | Action plan (My Actions) | Records |
|---|---|---|
| Answers | What will I do next? | What happened in my work? |
| Time | Forward: planned work with a due date | Backward: things that happened, with a date |
| Written by | The employee (manager and AI can propose) | Anyone: the employee, the manager, colleagues; later generated from retros |
| About | Only the employee | Any employee (Records has "about me" and "sent by me") |
| Organised by | Growth area | Date, filterable by competency and by who wrote it |
| Feeds Assessment | Yes: AI reads it (a Done Action alone never raises a score) | Yes: AI reads it |

- **Names stay:** "Action plan" and "Records". The confusion came from the layout (the two met at
  Done), not the names.
- **No "evidence" in the UI** (PO, 2026-09-30). Say "record" or "what happened". Code keeps its
  internal `evidence` status key (never shown).
- **Done Action ≠ record** (2026-09-30). Finishing an Action doesn't create or ask for a record. A
  Done Action says the plan step is finished; it proves nothing by itself and doesn't change a
  score.
- **No link between the pages** (2026-09-30): records carry no competency, so the Action plan can't
  count "records per growth area". Records are never shown inside Action cards. The prototype's
  "{N} records" link on each growth area was removed (2026-09-30).
- **Records is its own tab** so it can grow on its own (records about colleagues, records generated
  from retros) without touching the Action plan.
- Page purpose lines (proposed copy): Action plan "What you plan to do to grow toward {target}."
  · Records "What happened in your work, from you, your manager and colleagues."

## Layout — under review (sketches 2026-09-30)

- **A** kanban (To do · In progress · Done) with proposals above and a detail panel (the dev team's
  screen, on Enpath components).
- **B** kanban with proposals as the first column and a side Sheet.
- **C** list grouped by growth area (after Culture Amp Develop): one Card per growth area with
  You → Needed, a progress ring, action rows (status label + Start / Mark done), AI proposals inside
  their growth area, empty growth areas shown with "Add action / Ask AI".
- Discussed: a kanban inside each growth area is too much (1–3 actions per area leaves columns
  empty; cramped at 1280px; collapses to a list below 1024px). Alternative: rows sorted by status +
  a status count on each group heading.
- Not chosen yet. Market check: career / development tools (Lattice, Leapsome, Culture Amp) use
  lists, not kanban (`market-research.md` to be updated).

## What's built (List view, 2026-09-30)

Route `/me/actions` (sidebar "My Actions"). Code: `enpath-ui/src/features/enpath/my-actions/`
(`my-actions-screen.tsx`, `growth-area-group.tsx` (List), `board-view.tsx` (Board), `action-parts.tsx`
(badge, meta line, next step, "…" menu, proposal: shared by both views), `action-dialogs.tsx`,
`actions-chat.tsx`, `mock-data.ts`).

- **Header (P1):** "Action plan" + "What you plan to do to grow toward {target}. Your manager can see
  this plan." · Ask AI (outline, from 1024px, ⌘I) · **Add action** (primary).
- **Summary:** four Stat cards (Growth areas · To do · In progress · Done), each with a solid icon
  tile + white icon (set B: amber/600 · zinc/500 · blue/400 · green/600), a line under the label, the
  number, and a note from the data: "toward {target}" · "next due {date}" · "due {date}" (nearest) ·
  "last on {date}", with "N overdue" in red on the right of To do / In progress when there is any.
- **One Card per growth area** of the Active target (pattern P7; default size, groups `spacing/layout/sm` apart): name, "Growth area · You 3 → Needed 4" with the progress ring before the title, Add action (no records link: removed 2026-09-30, records carry no competency)
  (outline; opens the dialog with that growth area chosen). 
- **Action rows** (layout A, 2026-09-30; nothing expands), sorted In progress → To do → Done, then by
  due date, in fixed columns so they line up: status Badge (To do secondary · In progress blue · Done
  success) | title, the **outcome in full**, and a small line "Due 26 Sep · overdue · added by you"
  (only "overdue" in `color/text/invalid`; Done rows say "Done 12 Sep" and their title is secondary) |
  **Start** (To do) / **Mark done** (In progress) | "…" menu: Edit · **Move to** (a submenu with the other two statuses, 2026-09-30:
  the List can make every move the Board's drag can) · Remove from plan (destructive confirm: red Remove button, AlertDialog Destructive type).
  "What {point} looks like" isn't shown per action (it describes the growth area, not the action).
- **Done** has no record step (Actions and Records are separate).
- **AI proposals** sit in their growth area as **default Alerts** (white, bordered) with a brand-blue Sparkle icon, the same AI mark as the
  chat panel (2026-09-30); border primitive `color/brand/400` (Open flag: no semantic AI token) (title = Alert title,
  "AI proposal · outcome: …" = description):
  **Add to plan** opens Add action prefilled (the person picks a due date and confirms) · **Dismiss**
  (confirm; it doesn't come back).
- **Empty growth area:** "Plan something to grow here, or ask AI for ideas." + Ask AI.
- **Add / Edit action dialog:** Action*, Growth area* (Select), Outcome, Due date* (DatePicker); inline
  errors on submit.
- **Ask AI:** the shared chat panel with an Action plan script: suggests one action per growth area
  (proposal card → "Add to plan" opens the prefilled dialog) and where to start.
- Every change shows a toast.

**Prototype assumptions:** the Active target is **Frontend Engineer L3** (it replaced Backend
Engineer L3 on Lan's path on 27 Sep), giving three growth areas: Code quality, Delivery, Mentoring.
My Career's mock starts with no target; the pages keep separate state. Today = 30 Sep 2026.

**Rows** sit in fixed columns (status slot · title · caret | next-step button | "…") so they line up.

**Built on the screen, to move into components** (Open flags, kind restyle): the progress ring before
each growth area's title ("1/2"), the Stat tiles' coloured icon tiles (solid fill + white icon: growth areas
yellow/600 · in progress blue/600 · to do zinc/500 · done green/600), the In progress badge's border, the tinted header band (`color/surface/header`).

**Not built:** manager
view / approval · "Plan an action" from My Career opening this page · Records page.

### Board view (built 2026-09-30)

- **Switch:** Board / List in the header (ButtonGroup of ghost buttons, the current one `aria-pressed`),
  like My Career's Map / List. **Board is the default** (user, 2026-09-30).
- **Columns:** Proposed by AI · To do · In progress · Done, each with a count. Status columns use
  the Stat icon tiles' hues one step darker (To do `zinc/200` · In progress `blue/100` · Done
  `green/100`, primitives, Open flag); Proposed by AI `surface/raised` (zinc/50) with a brand stroke (primitive `brand/400`, Open flag; its
  proposal cards keep the normal border)
  (user, 2026-09-30: proposals as the first column, as sketch B). Four columns from 1024px; narrower
  screens scroll the columns sideways (16rem each).
- **Action card** (Card compact): growth area, title, outcome, "Due · added by", next step, "…". No
  status badge (the column says it); nothing expands; Done cards greyed. Cards sort by due date.
- **Proposals** in the first column: the same default Alert with the blue Sparkle, buttons under the
  text, the growth area in the description. Empty: "No proposals right now. Ask AI for ideas."
- **Moving:** Start / Mark done (touch, keyboard), or **drag a card** to another column on desktop
  (native drag, like Setup's career path editor; user 2026-09-30). The column under the card shows a
  `color/drop-indicator` ring. Dropping on Done sets today's date; moving out of Done clears it.
  Proposals don't drag.
- **Not on the Board:** growth areas with no action (no line for them, user 2026-09-30), You →
  Needed, records links, the progress ring. The List shows those.

### Visual audit (2026-09-30)

- **Blue budget.** Blue means brand (primary action, header band) or information (link, In progress,
  In progress). The AI proposal is a default (white) Alert; only its Sparkle is brand blue. Decorative things don't get blue: the progress ring fills neutral (`color/icon/default`),
  green when complete. The AI proposal is the only tinted block inside a card.
- **Text hierarchy:** page title `heading-xl` → group title `heading-sm` → action title `heading-xs`
  → Alert title `label-md` → meta `body-xs`. A compact Card made the group title `heading-xs`, the same
  as the rows, so full-width pages use the default Card.
- **Spacing:** default Card padding (`spacing/component/lg`); groups `spacing/layout/sm` apart.

## Screen — planned (not designed yet)

- Header: "Action plan" + one line on ownership; **Add action**.
- AI **Proposal** cards above the board (growth area + outcome) with **Add to plan** / dismiss.
- Board: To do · In progress · Done. Card: title, growth area, due date, source, status control.
- Done: the Action is finished; no record step. Done Actions shrink to one line at the bottom of
  their growth area.
- ~~Each growth area group links to Records~~: dropped (2026-09-30), records have no competency.
- Manager view: the same plan, read-only, with approve (scope of "approve" is open).
- Built on the Enpath design system (the dev team's screen isn't: black primary button, own shell).

## Open questions

- [ ] Manager "approves" what — the whole plan, or each Action? Is there a **Validated** step after
      Done (PRD-022), or does validation happen only in the next Assessment?
- [ ] Can the manager create Actions directly, and must the employee accept them? (PRD-022)
- [ ] Can the employee dismiss AI proposals, and do dismissed ones come back?
- [ ] Templates: predefined Actions per competency? (PRD-022)
- [ ] Do Actions follow the **Active target** only, or can they serve a Career vision's role too?
- [x] Layout: Board is the default (2026-09-30); List (grouped by growth area) is the second view.
- [ ] **Who confirms an Action is done?** PRD-022 §9 "Completion Validation" offers: employee
      self-confirmation · manager acknowledgement · AI evaluation from Records · a combination. The
      prototype: one click on Mark done, no condition, date = today, can be moved back.
- [ ] **Does Mark done ask anything** (completion date, a short progress note, as PRD-022 RQ-04
      lists), or stay one click?
- [ ] **Is there a Validated step** after Done (PRD-022 RQ-04: "Completion is acknowledged with
      evidence"), or does confirmation happen only in the next Assessment?
- [ ] **Differs from PRD-022 RQ-05 / §8, tell the PO:** the PRD links Completed → create / link a
      Record → evidence reviewed → Assessment. We separated Actions and Records (2026-09-30): Done
      doesn't create or ask for a record. PRD-022 also lists progress notes and an employee-set
      completion date, which the prototype doesn't have.
- [ ] Later: should a Done Action offer to add a record (and a record show "From action: …")? Not
      for now (2026-09-30).
