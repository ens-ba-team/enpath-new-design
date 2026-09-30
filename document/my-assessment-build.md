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
Target → ASSESSMENT (scores) → Growth areas → Action plan → Records → next ASSESSMENT
```

## Decisions (2026-09-28)

- **Assessment is the only source of competency scores.** "You" in every comparison in My Career =
  the latest **Completed** score per competency. Growth areas are computed from it, never entered.
- **One Assessment = one employee × one target role × one period** (H1 / H2, or an extra "growth
  check-in"), covering a **chosen set of competencies** (2–4 in the dev team's data), not the whole
  matrix.
- **Flow:** the employee **self-assesses** → the **line manager reviews** → **Completed** (approved,
  "ready for comparison").
- **Records are the input** (My Records is **kept**, 2026-09-28). Records (written by the employee,
  the manager or colleagues; later from retros) are gathered per competency for the self-assessment
  and shown to the manager at review. A record is never a score by itself. Actions are not an input:
  a Done Action doesn't become a record (2026-09-30, `my-actions-build.md` → Actions and Records).
- **AI proposes, the manager decides (B1, 2026-09-28).** AI may summarise records, and may
  **suggest** a score where there's no approved one (see "When You are here changes" below). A
  suggested score is labelled "Suggested", shows what it's based on, and **counts only after the
  manager confirms it** (one by one or in bulk). AI never sets a score on its own.
- **Scores belong to the employee × competency, not to a path step.** Old scores, including for
  competencies a role no longer uses, stay in the Assessment history and are never deleted.
- **Completing a Level without holding it** (company-path changes, `my-career-build.md` → "When a
  company path changes"): a Level tagged "New on your path" becomes Completed when a Completed
  Assessment meets its expectations, or when the manager sets it.

## When You are here changes (C → C′, decided 2026-09-28)

A company path can **replace** Lan's level C with C′; Lan's You are here then becomes C′
(`my-career-build.md` §8). Nothing is re-assessed from scratch; the comparison is redone against C′:

| Competency at C′ | Its score at C′ |
|---|---|
| Same competency as before (same Matrix) | The latest approved score carries over → Ready or Growth area against C′'s expectation |
| New competency, and a **similar** competency was scored in another Matrix | AI **suggests** a score from that competency + Lan's records and actions ("Design systems: suggested 1 · Awareness, based on 'Learn design system basics', done 12 Sep"). Counts after the manager confirms |
| New competency, nothing similar | **Not assessed yet**, until the next Assessment |
| A competency C had but C′ doesn't | Not shown for C′; its scores, actions and records stay in history and can count toward a later role with a similar competency |

Why AI matching: each Matrix has its own competencies (Duplicate matrix makes new ones), so the same
skill in two Matrices has two identities. A shared **competency library** would fix that; it's the
future direction, **not built**.

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
  the row has **no button**: assessing is the manager's job, not the employee's ("Add evidence" was
  tried and removed the same day, since evidence doesn't produce a score).
- Ready rows name their source: "Based on H2 2026 assessment, approved {date}".
- Mock data: today's mock "current points" become mock Assessments (period, approved date,
  competencies covered). Plan: `what should be done.md` → "Next steps — My Career".

## Screens — planned (not designed yet)

- **Employee:** "My assessment(s)" — the open self-assessment for the Active target (per competency:
  pick a point, see the level's behaviour text and the records for that competency, add a note), past Completed
  assessments. Where it lives is open (own page vs inside My Career).
- **Manager:** the list above on the Enpath design system + a review screen (self-score, records, AI
  summary, manager score, approve / send back).

## Open questions

- [ ] Who creates an Assessment — only the manager ("Create assessment"), or can the employee request
      one (e.g. after setting a new target)?
- [ ] Which score wins when two periods disagree? Assumed: the latest Completed.
- [ ] Can the manager change the employee's self-score, or only approve / send back?
- [ ] Does an Assessment always follow the Active target, or can it cover any role (a Career vision's)?
- [ ] Where does the employee self-assess: its own page, or inside My Career?
- [ ] Needs a PRD: statuses, periods, who sees what, notifications.
- [ ] Suggested scores: how "similar" is decided (AI confidence threshold? always shown?), and where
      the manager confirms them (in the Assessment review, or a separate queue).
- [ ] Competency library (shared competencies across Matrices): future; scope and timing open.
