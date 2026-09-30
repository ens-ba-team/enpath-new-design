---
title: Records build
created: 2026-09-30
updated: 2026-09-30
status: Not built. Decisions, assumed defaults and open questions only; PRD-021 is empty
related: glossary.md, my-actions-build.md, my-assessment-build.md, my-career-build.md
---

#enpath #records #build

# Records build

What the Records page is and how it will be built. Kept current as decisions land.
**No PRD yet:** `../../document/original brief/prd-021-records.md` has only its header. The logic
below comes from the old prototype's Records tab (`enpath-prototype.html`) and our own decisions.

Where it sits (`glossary.md` → "How the pieces fit"):

```
Target → Assessment (scores) → Growth areas → Action plan (what I plan to do)
Records (what happened, from anyone) ─────────────────────────▶ next Assessment
```

## Decisions (kept)

- **A record is what happened** in someone's work: feedback, project notes, outcomes, links, files.
  Never a score by itself; it's what the next Assessment reads (`my-assessment-build.md`).
- **No "evidence" in the UI** (PO, 2026-09-30). Say "record" or "what happened".
- **Anyone writes, about anyone:** the employee, their manager, a colleague (old prototype: "any
  employee in the company"). Later, records are **generated from retros** (PO: the reason Records is
  its own tab, so it can grow on its own).
- **Separate from Actions** (2026-09-30): a Done Action doesn't create or ask for a record. The only
  link is the competency: each growth area in the Action plan shows "{N} records →", which opens
  Records filtered to that competency.
- **AI drafts, a person sends** (old prototype, PRD-004): AI can turn pasted notes or a file into a
  draft (suggested person, competency, title); it never picks the person on its own when unsure and
  never sends.

## From the old prototype (`enpath-prototype.html` → Records)

- **Views:** "Related to me" (about me, or written by me) · "Sent by me" · "Create record".
  Counters: related to me · sent by me · awaiting my review.
- **List + detail:** list cards show "About me / About {name}", status, title, "From {name} · date".
  Detail: title, summary, about, submitted by, occurred on, competency, contribution, outcome,
  impact, visibility, attachment, review status; **Acknowledge record** when it's about me and
  awaiting.
- **Fields:** about (employee)*, title*, summary*, contribution, outcome, impact, occurred on,
  competency, visibility (default Team), attachment; AI mode adds source text / file.
- **Statuses:** Draft · Awaiting acknowledgement · Acknowledged · Approved.
- A completed Action could create a record ("origin: My Actions"): **dropped** (see Decisions).

## Assumed defaults for the first build (to confirm; each maps to an open question)

| # | Default | Question |
|---|---|---|
| 1 | The person a record is about **acknowledges** it; "Approved" isn't used yet | Q1 |
| 2 | No reject or "ask for changes" | Q2 |
| 3 | Visibility is **Team** only (the person, their manager, the author) | Q3 |
| 4 | A sent record can't be edited or deleted; drafts can | Q4 |
| 5 | **One competency** per record, from the person's Matrix; optional | Q5 |
| 6 | Only acknowledged records count for an Assessment | Q6 |
| 7 | No retro UI yet | Q7 |
| 8 | Page name **Records** (as the sidebar); "My Records" in docs means the same page | Q8 |

## Layout — to choose (sketches 2026-09-30)

- **A** List + detail panel (old prototype, like My Career's side panel): filters About me · Sent by
  me · Waiting for you, competency dropdown; the selected record's detail and Acknowledge on the right.
- **B** Timeline by month (a work log): competency chips (with counts) as filters, About me dropdown;
  each record shows title, status, summary, "From · date · competency", Acknowledge on the row.

## Open questions

- [ ] **Q1 Who approves, and what's the difference** between Acknowledged (the person) and Approved
      (manager? at Assessment?)
- [ ] **Q2** Can the person a record is about reject it or ask for changes? What happens then?
- [ ] **Q3 Visibility:** what does "Team" cover; other options (Private, Manager only)? Can a
      colleague write about someone outside their team, and who sees it?
- [ ] **Q4** Can a record be edited or deleted after it's sent / acknowledged? History?
- [ ] **Q5 Competency:** one, several or none? From the person's Matrix or the whole library?
- [ ] **Q6** Which records does an Assessment read: acknowledged only? Only within its period?
- [ ] **Q7 Retro generation:** placeholder in the UI now ("Suggested from retro" drafts to review), or
      later?
- [ ] **Q8 Name:** "Records" or "My Records"?
- [ ] **Layout:** A or B (above)?
