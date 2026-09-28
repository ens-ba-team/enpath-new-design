---
title: My Assessment build
created: 2026-09-28
updated: 2026-09-28
status: Not built. No PRD. Decisions from chat + the dev team's "Managed assessments" screen (manager view)
related: glossary.md, my-career-build.md, my-actions-build.md, ../../document/original brief/prd-022-my-action.md
---

#enpath #assessment #build

# My Assessment build

What an Assessment is and how it will be built. **No PRD exists yet** (PRD-021 "Records" is empty;
PRD-022 only mentions "Competency Assessment Updated"). Source so far: decisions made in chat
(2026-09-28) and the dev team's **Managed assessments** screen.

Where it sits in the development loop (`glossary.md` → "How the pieces fit"):

```
Target → ASSESSMENT (scores) → Growth areas → Action plan → Evidence → next ASSESSMENT
```

## Decisions (2026-09-28)

- **Assessment is the only source of competency scores.** "You" in every comparison in My Career =
  the latest **Completed** score per competency. Growth areas are computed from it, never entered.
- **One Assessment = one employee × one target role × one period** (H1 / H2, or an extra "growth
  check-in"), covering a **chosen set of competencies** (2–4 in the dev team's data), not the whole
  matrix.
- **Flow:** the employee **self-assesses** → the **line manager reviews** → **Completed** (approved,
  "ready for comparison").
- **Evidence is the input.** Evidence added in the Action plan (or with "Add evidence" on a competency)
  is gathered per competency for the self-assessment and shown to the manager at review. AI may
  summarise it; it never scores. There is no separate Records module.
- **Completing a Level without holding it** (company-path changes, `my-career-build.md` → "When a
  company path changes"): a Level tagged "New on your path" becomes Completed when a Completed
  Assessment meets its expectations, or when the manager sets it.

## The dev team's "Managed assessments" screen (manager view)

- Title "Managed assessments" · "Review self-assessments and manager feedback for selected career
  targets." · **Create assessment**.
- Summary tiles: Managed assessments (8, "submitted by your direct reports") · **Awaiting approval**
  (3, "employee submissions requiring a manager decision") · **Completed** (3, "approved assessments
  ready for comparison").
- Filters: search, employee, line manager, target role, period, status.
- Table: Ticket ID · Employee · Line manager · Target role · Period · Competencies (count) · Status ·
  Created · Submitted · Completed.
- Statuses: **Action required** (employee hasn't submitted) → **Awaiting review** (manager) →
  **Completed**.
- Not on the Enpath design system (dev tools bar, own shell, black primary button).

## What it changes in My Career

- Done 2026-09-28: "Needs records" → **"Not assessed yet"** for competencies with no Completed score;
  the row's action is **Add evidence**. Open: also offer **Request an assessment**?
- Ready rows name their source: "Based on H2 2026 assessment, approved {date}".
- Mock data: today's mock "current points" become mock Assessments (period, approved date,
  competencies covered). Plan: `what should be done.md` → "Next steps — My Career".

## Screens — planned (not designed yet)

- **Employee:** "My assessment(s)" — the open self-assessment for the Active target (per competency:
  pick a point, see the level's behaviour text and the gathered evidence, add a note), past Completed
  assessments. Where it lives is open (own page vs inside My Career).
- **Manager:** the list above on the Enpath design system + a review screen (self-score, evidence, AI
  summary, manager score, approve / send back).

## Open questions

- [ ] Who creates an Assessment — only the manager ("Create assessment"), or can the employee request
      one (e.g. after setting a new target)?
- [ ] Which score wins when two periods disagree? Assumed: the latest Completed.
- [ ] Can the manager change the employee's self-score, or only approve / send back?
- [ ] Does an Assessment always follow the Active target, or can it cover any role (a Career vision's)?
- [ ] Where does the employee self-assess: its own page, or inside My Career?
- [ ] Needs a PRD: statuses, periods, who sees what, notifications.
