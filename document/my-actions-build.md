---
title: My Actions build
created: 2026-09-28
updated: 2026-09-28
status: Not built. Decisions and design direction only; My Career's "Plan an action" button shows a "coming next" toast
related: ../../document/original brief/prd-022-my-action.md, glossary.md, my-career-build.md, my-assessment-build.md
---

#enpath #my-actions #build

# My Actions build

What My Actions (the **Action plan**) is and how it will be built. Kept current as decisions land.
Source brief: **PRD-022** (complete). Note: `../../document/original brief/my action.md` is a copy of the My Career
brief, not a My Actions brief — ignore it for this module.

Where it sits in the development loop (`glossary.md` → "How the pieces fit"):

```
Target → Assessment (scores) → Growth areas → ACTION PLAN → Records → next Assessment
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
- **Records are kept** (2026-09-28, reverses dropping them). When an Action moves to Done, the
  employee can **add a record** (notes, links, files, feedback); it lands in **My Records**, linked to
  the Action and its competency. Records feed the next Assessment (`my-assessment-build.md`).
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
| Records | Completed action → create / link a **Record** → acknowledged | — | Same as PRD-022: record added on Done, kept in My Records; acknowledged when the manager reviews the Assessment |
| Card content | Action · related goal · competency · notes · completion date | Title · "Gap: {competency}" · due date · "Move to next status" | Title · "Growth area: {competency}" · due date · status control |

## Screen — planned (not designed yet)

- Header: "Action plan" + one line on ownership; **Add action**.
- AI **Proposal** cards above the board (growth area + outcome) with **Add to plan** / dismiss.
- Board: To do · In progress · Done. Card: title, growth area, due date, source, status control.
- Done: optional **Add a record** (note / link / file) → My Records.
- Manager view: the same plan, read-only, with approve (scope of "approve" is open).
- Built on the Enpath design system (the dev team's screen isn't: black primary button, own shell).

## Open questions

- [ ] Manager "approves" what — the whole plan, or each Action? Is there a **Validated** step after
      Done (PRD-022), or does validation happen only in the next Assessment?
- [ ] Can the manager create Actions directly, and must the employee accept them? (PRD-022)
- [ ] Can the employee dismiss AI proposals, and do dismissed ones come back?
- [ ] Templates: predefined Actions per competency? (PRD-022)
- [ ] Do Actions follow the **Active target** only, or can they serve a Career vision's role too?
