---
title: Setup build
created: 2026-09-18
updated: 2026-09-25
status: All 3 tabs built in the prototype (localhost:3000/setup) — Career structure, Matrices config, Career path; responsive pass in progress; Employee mapping not started
related: ../../what should be done.md, glossary.md, market-research.md, ../../document/original brief/prd-018-setup-module.md, ../enpath-tone-and-voice.md
---

#enpath #setup #build

# Setup build

What the Setup rebuild is and how it's built — kept current as the prototype changes, so this
describes the **current** prototype, not the history of how it got there. Replaces the old
prototype's 6 tabs (Overview · Positions & Levels · Employee Mapping · Competency Matrix ·
Expectations · Career Paths). Screenshots of the old prototype: `../../image/set-up-current-ui/`.

Run it: `enpath-ui` → `npm run dev` → `localhost:3000/setup`.
Code: `Enpath-design-system/enpath-ui/src/features/enpath/`. Mock data only.

## Key decisions still in force

- **3 tabs**: Career structure · Matrices config · Career path. Employee mapping moved to **Team**
  (later); no Overview tab — see "Out of scope" below.
- **Career structure = Draft → Publish**, not view/edit mode: a Position is Draft (editable, hidden
  from employees) or Published (live, read-only) — Lattice's pattern. Unpublish is the only way
  back to Draft; it's never a side effect of editing.
- **Matrices config has its own 3-state lifecycle** (a rule from the old dev code), not the 2 above: Draft
  (editable) → Active (read-only, live) → Archived (read-only, restorable). No direct
  Active → Draft — Archive, then Restore. Publish is a **hard gate** (≥1 owner, ≥1 competency,
  every rating-scale point has a title + description) — unlike a Position's Publish, which only
  warns.
- **Rating scale size lives on the Matrix**, editable 2–5 points while Draft — not a fixed
  company-wide 5. A Position's expectations grid reads its cell count from its Matrix. Lowering the
  scale shows exactly what behavior text (competency, point, title, description) would be lost.
- **Terminology: a Matrix's scale steps are "points," never "levels."** "Level" is a Position's own
  step (L1, L2…) — the two must not be confused in copy, code, or comments.
- **Preview → Confirm everywhere a save happens** (PRD-018 RQ-07, BR-14) — Publish, Unpublish,
  Archive and Restore each show what changes before confirming.
- **A Position references a Matrix; it never copies Matrix content.** Renames and content stay
  consistent across tabs. **Matrices have no versions** (2026-09-28): to change an Active Matrix,
  Archive → Restore (Draft) → edit → Publish, or **Duplicate** it into a new, independent Matrix and
  move Positions to it.

---

## What's built

**Shell** — transparent sidebar (collapsible) · white page panel · AI chat panel on the right
(closed by default). Visual spec (`background/app` brand/50 background, `radius/panel` 12px, `spacing/shell` 8px):
`Enpath-design-system/enpath-design-system.md` §App shell.

**Setup page**
- Header: "Setup" + a small green progress card "Your setup is N% done" (share of expectation cells
  set; hover shows cells not set · positions not published) + **Ask AI**.
- Tabs: **Career structure** · **Matrices config** · **Career path** — the open tab is kept in the
  URL (`?tab=structure|matrices|paths`), so reload returns to it.

**Career structure tab**
- **Left: Positions** — search, **grouped by department** under collapsible uppercase captions
  (same visual language as the app sidebar's own "WORKSPACE"/"OPERATIONS" group labels), each row
  name, code · N levels, status badge. Footer: **+ Add position** (outline, fills the row) next to
  an icon-only **Import CSV** (outline) — one row, not stacked.
  Selected row uses `Item` `selected`.
- **Right: the selected Position**
  - Title + status badge · **Matrix** chip (opens Matrices config, selecting that Matrix) ·
    Last edited who · when.
  - Buttons, in this order: **Edit position** (disabled while Published) · **"…" menu** (History ·
    Duplicate) · **Publish** / **Unpublish**. Order is deliberate — secondary → overflow → primary,
    so the overflow icon never leads the row and Publish/Unpublish stays the last, most emphasized
    thing (2026-09-23; History and Duplicate used to be separate, and a menu holding just Duplicate
    was awkward on its own).
  - Grid: competencies × levels; each cell a segmented bar sized to the Position's Matrix scale
    (2–5 segments, darker per step) + "3 · Intermediate" / "Not set". Click a segment, press a
    number, arrows, 0 clears — only while Draft.

**Duplicate position** (built 2026-09-23) — "…" menu → Duplicate opens the Create Position dialog
prefilled: name `"{name} (copy)"`, same matrix, department and levels (headcount reset to 0 — people
don't carry over), code left blank (must be unique, can't be auto-generated safely). On save, the
new Draft's expectations are copied from the source, matched by level **order**, not id.

**Import positions via CSV** (built 2026-09-23) — the icon-only "Import CSV" button opens a
paste-CSV dialog: `name, code, department, matrix, levels` (levels `;`-separated), no
quoted-field/escaped-comma support (a controlled format, not a general CSV parser). Every row is
previewed before import — ✓ ready or the specific error (missing field, code already used, matrix
not found/not Active) — invalid rows are skipped, valid ones aren't blocked by them. Imported
positions land as Draft with empty expectations, same as manual creation.

**Department config** — no admin UI yet; `departments` is a hardcoded list in `mock-data.ts`. User
is deciding later whether this needs its own config page or an inline "+ Add department" in the
Select.

**Department field** (built 2026-09-23) — `Position.department`, a fixed list (`departments` in
`mock-data.ts`: Engineering, Product, Design, Operations, Other), admin-chosen in the Create/Edit
dialog — not pulled from ID Service. Drives the explorer grouping above.

| Status | Badge | Header action |
|---|---|---|
| Draft | Draft (amber) | Grid, levels and matrix editable. **Publish** — confirm lists changes; warns on cells not set, never blocks |
| Published | Published (green) | Read-only — grid, Edit position and chat proposals all blocked. **Unpublish** — back to Draft, employees stop seeing it, nothing deleted |

**Create / Edit position dialog** — Position name · code · **Competency matrix** (Select lists only
**Active** matrices, plus the Position's current one if archived — BR-04) · Description (optional) ·
**Levels** (drag or ↑/↓ to reorder; L-numbers follow order; + Add level). Edit only: people per
level shown; a level with people can't be removed; removing a level warns its expectations are
deleted; switching matrix warns all expectations clear.

**Matrices config tab**
- **Left: Matrices** — search, list (name · N competencies · status badge), **+ Add matrix**.
- **Right: the selected Matrix**
  - Title + status badge · Scale · Owners · Last edited · **Used by** (chips → the Position,
    switches tab and selects it).
  - Buttons (same pattern as a Position, 2026-09-28): **Edit matrix** (disabled unless Draft,
    tooltip "Archive to edit" / "Restore to edit") · **"…" menu** (History, the shared drawer ·
    **Duplicate matrix**, every status) · **Publish** (Draft) / **Archive** (Active) / **Restore**
    (Archived).
  - **Competency editor is master-detail**: left, competencies as a **vertical numbered stepper**
    (circles + solid grey connector line, not dashed — it's a list, not sequential progress; filled
    circle = every point already has a title + description; active competency's label semibold).
    Right, name + description for the selected competency, then its **rating scale** as pill Tabs —
    one point open at a time, each with a **title** (defaults from the shared scale name, editable
    per competency) and **description**, matching the old dev code's `ObservableBehavior`.
    **+ Add competency** while Draft (auto-selects the new one); **Remove competency** while Draft.

**Create / Edit matrix dialog** — name · description (both required) · **Rating scale**, a Select,
2–5 points, editable while Draft · owners (repeatable name list, none required to save — only to
publish). Lowering the scale shows a detail breakdown of exactly which points would lose their
title and description, grouped by competency.

**Duplicate matrix and Position consistency** (2026-09-28: replaced "Create draft" and versions)
- Matrix name, competency names, behavior text and scale are read from the Position's `matrixId`;
  the Position stores only its expectations, keyed by stable competency and Level ids.
- **Duplicate matrix** ("…" menu, any status) opens Create matrix filled from the current one. The
  name gets a number: "A" → **"A1"** (then A2…), multi-word names get a space ("Northstar
  Engineering 1"); everything is editable. Create → a **new, independent Draft**: its own copy of the
  competencies and behaviors (resized to the chosen scale), same description, scale and owners; no
  positions; no link to the original; History starts with "Duplicated from {name}".
- Moving Positions to the copy is a normal Position edit (Competency matrix select; switching warns
  that expectations clear). Nothing migrates automatically.
- **Publishing** a Draft Matrix that Positions already use (e.g. restored and edited) applies its
  content to them. The preview lists each Position: ratings above a smaller scale become `Not set`
  (never capped), and a Published Position returns to Draft for review. Positions are untouched if
  nothing changed.

**AI chat panel** — VS Code-style (AI Elements). Ask / Edit mode · model picker (Claude Sonnet 5,
mock) · context chip = current Position · suggestions. Edit drafts a **Proposed change** card →
**Review in editor** opens Edit position prefilled; saving is the human's. The assistant never saves
directly — every chat action still goes through the same Preview → Confirm as a manual edit.

**Career path tab** (built 2026-09-24) — code: `setup/career-path-screen.tsx`; the step list is a
new design-system component, `components/ui/career-path-stepper.tsx` (`CareerPathStepper` /
`CareerPathStep`, own `--career-stepper-*` tokens and story).

Its own tab because:
- **No single Position owns a path** — it connects Levels, often across Positions.
- **Different kind of thing** — ordered moves, not structure; edited as a step chain, not a grid.
- **Depends on Career structure** — needs Levels; warns when a step's expectations aren't set.
- **Employees see it** (My Career) — so it has its own lifecycle.

- **Left: Career paths** — search, list (name · N steps · owner · status badge), **New path**
  (outline). New path dialog: name + description, both required; steps are added after creation.
- **Right: the selected path**
  - Title + status badge · description · Owner · Last edited who · when.
  - Buttons: **History** (shared drawer) · **Publish** (Draft; disabled under 2 steps) /
    **Archive** (Active) / **Restore** (Archived → back to Draft). Each opens a confirm that says
    what happens (becomes read-only and visible to employees / hidden, nothing deleted / editable
    again).
  - **Progression steps** (max 760px wide): numbered steps, each "Position · L2 · Mid" +
    "x/y expectations set", with a warning icon + tooltip when some are missing — warns, never
    blocks (PRD-003 AC-03). A warning Alert shows while the path has fewer than 2 steps.
  - While Draft: reorder by **drag handle** or **↑ / ↓ buttons**, **remove** a step, and **Add step**
    from a Position Select + Level Select. Steps can cross Positions. Active and Archived are
    read-only.

| Status | Badge | Header action |
|---|---|---|
| Draft | Draft (amber) | Editable. **Publish** — needs ≥2 steps |
| Active | Active (green) | Read-only, visible to employees. **Archive** — no direct way back to Draft |
| Archived | Archived (grey) | Read-only, hidden. **Restore** — returns to Draft |

**Career path — planned, not built yet**
- **Editing a published path moves people** (decided 2026-09-28, from My Career §8): employees'
  plans follow the latest version. When a step is **replaced** (C → C′), everyone who **follows**
  this path and is mapped to C moves to C′ (their Employee Mapping changes; HR data doesn't). The
  Publish preview must say it: "3 people at Backend Engineer L3 move to Frontend Engineer L3" +
  targets that leave the path + Career visions that re-attach. A step **removed** with no
  replacement moves nobody. Each change is written to the path's history (employees see it as Path
  history in My Career).
- **Rules not enforced:** 20-step maximum (old dev code); within one Position, steps must go up in
  Level (BR-12 — the dev code didn't enforce it either). A repeated Level (BR-11) is refused, but
  silently — Add step stays enabled and nothing happens.
- **Compare two positions** side by side (from Progression) for designing cross-Position moves.
- **Links** — each Position page lists "Paths through this position" as chips that open the path.
- **Preview of changes** — Publish/Archive/Restore confirms describe the effect, but don't list
  what changed, unlike Position and Matrix Publish.
- The Add step Position list includes Draft Positions; whether a path may use an unpublished
  Position is undecided.

Competitors treat level order inside a track as the path implicitly; EnPath's explicit paths,
including cross-Position moves, have no direct model to copy — see Design research below.

**Responsive layout** (in progress) — plan and acceptance widths in `../../what should be done.md`.
So far: below 1024px the app sidebar becomes a slide-in menu, the AI chat panel is hidden, the
Setup tabs scroll sideways, and Career structure shows the Position list *or* the Position (with a
Back button) instead of both. Matrices config and Career path still use the desktop side-by-side
layout at every width.

**Not built yet:** chat history · Employee mapping (→ Team) · a live audit log for History
(currently seeded mock entries only, not updated by Publish/Archive/edit actions).

---

## Implementation notes (for whoever edits the code)

Moved here from session memory 2026-09-26 — code facts that aren't obvious from the files.

- State lives in `SetupScreen`: `positions`, `matrices`, `careerPaths` (+ selected id each), seeded
  from the `initial*` exports in `mock-data.ts`. One `<TooltipProvider>` at its root.
- Tooltips: always `Tip({ label, children })` from `tip.tsx`, never native `title=`. A disabled
  button or a non-forwardRef component (Badge) goes inside `<span className="inline-flex">` as the
  trigger. In Playwright read `data-state` — `getByRole('tooltip')` also finds Radix's hidden a11y twin.
- Duplicate position: `remapExpectations()` copies scores by level **order**, not by id.
- Matrices have no versions: a Position points at one Matrix by id. `scaleSize` 2–5 per Matrix.
  Duplicate = `MatricesScreen` dialog mode `duplicate` + `copyName()`.
- Ask AI: AI Elements (`components/ai-elements/`), mock streaming; opening it collapses the sidebar
  (`SidebarFollowsChat`).
- Known bug (not fixed): `career-path-screen.tsx` dims a dragged step with
  `opacity-[var(--opacity-disabled)]` — the token is 60 (not 0.6), so nothing dims. Use
  `calc(var(--opacity-disabled)/100)`.

## Out of scope for Setup

**Employee mapping** moved to **Team** (Operations) — people work (search, filter, assign a Level)
doesn't belong in an admin structure tool. Earlier spec (person page, read-only HR fields, "Change
level" flow) still holds for when Team gets built.

**Company view** (the old Overview's company-wide grid) is parked until its home is decided (Team
or an analytics area). One decision already made: **ragged rows**, not a shared level axis — a
Level belongs to one Position, and only compensation tools (Pave, Ravio) use a company-wide axis.
Use **compare two positions** instead for "who's senior to whom."

**No Overview tab.** No product researched has a Setup progress page. Replaced by: the progress
card in the Setup header, attention dots in the explorer, and a banner on pages with gaps.
"Recent admin activity" → the right rail. Manager insight (gaps, readiness) → **Team**, not Setup.

---

## Design research — how other products handle this

**Editing model** (public help pages; admin UIs not seen)

| Product | Editing | Safety |
|---|---|---|
| **Lattice** (tracks) | Draft → publish for the whole track: unpublish to edit, edits autosave, re-publish | Employees see only published tracks |
| **Leapsome** (competencies) | Per-item form + Save; bulk edits via Excel import with a preview of all changes | Explicit save; import preview; only descriptions editable once feedback exists |
| **Culture Amp** (career paths) | Job groups "Admin only" until ready, then visible to everyone | New structures hidden until published |

EnPath's Draft → Publish model borrows from Lattice, without its weakness (unpublishing a track
used to take it away from everyone while it was being edited — the Draft/Active/Archived split for
Matrices avoids that, since only Draft is ever editable).

**Where a Level gets added**

| Product | Where |
|---|---|
| **Lattice** | Same grid — "+ Create track level" adds a column; track must be a draft to change levels |
| **Culture Amp** | Inside the track — roles (one per level) added within job group › track |
| **Leapsome** | Separately — levels defined company-wide in Settings › Employees › Levels |

→ "+ Level" in the grid matches Lattice.

**Expectations grid — cell design** (rejected options, kept for when this gets revisited)

| # | Option | Verdict |
|---|---|---|
| A | Dropdown per cell (old prototype) | ❌ heavy, noisy, meaning hidden |
| B | Value + picker below the grid | ❌ must scroll to pick |
| C | Dots in the cell | ❌ too busy across the grid |
| D | Popover next to the cell | Alternative — meaning visible, no scroll, one extra click |
| E | Side panel | Later if needed — most context, takes grid width, competes with chat |
| F–H | Stepped fill slider, 3 variants (always visible → quiet-until-hover → light tint at rest) | **H built** — keeps the growth pattern legible without extra weight |

Lattice and Leapsome use a written description per cell, click-and-type, autosave. Progression uses
dots and can apply a level across many positions at once. EnPath differs because it needs a score
(for gap analysis) whose meaning comes from the Matrix, plus Preview → Confirm instead of autosave.

**Career path precedent**: no product researched models an explicit, cross-Position path the way
EnPath does — competitors imply the path from level order inside one track.

**Company view precedent**: only compensation tools (Pave, Ravio) show a company-wide level axis;
career tools keep levels per track — hence the "ragged rows" decision above.

Sources: [Lattice — Edit Track Expectations](https://help.lattice.com/hc/en-us/articles/4407701786647-Edit-Track-Expectations) ·
[Lattice — Add Levels to a Track](https://help.lattice.com/hc/en-us/articles/13321397372823-Add-Levels-to-a-Track) ·
[Leapsome — Set up a Competency Framework](https://help.leapsome.com/hc/en-us/articles/360017615697-How-to-set-up-a-Competency-Framework) ·
[Leapsome — Export / import competencies](https://help.leapsome.com/hc/en-us/articles/4414947772433-Export-import-competencies-and-Competency-Frameworks) ·
[Culture Amp — Guide to Creating Career Paths](https://support.cultureamp.com/en/articles/7338156-guide-to-creating-career-paths) ·
[Progression — Templates and Locked Skills](https://help.progression.co/how-to-templates-and-locked-skills) ·
more in `market-research.md`.

---

## Open questions

**Career structure**
- [x] Cell option: H confirmed as final (2026-09-23) — no popover needed.
- [x] Create a Position: **duplicate an existing Position** — built 2026-09-23, not templates.
- [x] Positions: **never delete** (2026-09-23) — confirmed, no delete action anywhere in the UI.
      Position archiving (a distinct status, like Matrix's) stays deferred, not decided either way.
- [x] Bulk creation / CSV import — **in scope, built 2026-09-23** (paste-CSV, not file upload).
- [x] Explorer grouping: **by department, built 2026-09-23** — collapsible caption per group; a
      `department` field on Position (admin-chosen, not from ID Service).
- [ ] **Guarded delete** — explicitly deferred (2026-09-23): delete a Position only when it's
      untouched enough that nothing real is lost (still Draft, no people mapped to any Level, no
      Career Path step references it) — same guard pattern as removing a Level. Not built; handle
      later.

**Matrices config**
- [x] ~~Matrix versioning: when does v3 become v4? (PRD-018 OQ-05)~~ No versions (2026-09-28):
      Duplicate makes an independent copy.
- [ ] Matrix owners: approvers or contacts? Built as a plain name list with no functional role
      (no approval gate, no notifications) — the semantic question is still open.
- [ ] Starter templates / skill library for Matrices — no PRD.

**Career path tab**
- [ ] Status: Draft / Active only (PRD-003, dev code) or also Archived + versions (PRD-018)?
      The prototype uses **Draft / Active / Archived, no versions** — confirm or change.
- [ ] Keyboard reordering of steps (PRD-003 open question). The prototype's ↑ / ↓ buttons work by
      keyboard; no shortcut keys — confirm that's enough.
- [ ] Can a path step use a Draft (unpublished) Position?

**Employee mapping** (when Team gets built)
- [ ] Who counts toward "all mapped" — inactive staff, contractors? (PRD-018 OQ-02)
- [ ] Can an archived Level still be assigned? (OQ-03)
- [ ] Bulk mapping (several people → one Level) — in scope?

**Structure**
- [ ] Kept drafts: visible to other admins ("Lan is editing Backend Engineer · 3 unsaved changes")
      or private until Confirm? The dev code already refuses a Confirm if someone saved in between.
- [ ] How long does a kept draft live — until confirmed/discarded, or does it expire?
- [ ] Where does the company view live — Team or analytics? Does ID Service expose a company-wide
      HR grade (would enable an optional "compare by HR grade" view)?
