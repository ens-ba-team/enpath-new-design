# Enpath — Tone & Voice

Enpath-specific voice, layered on top of `content-guidelines.md` (the design system's voice-neutral
writing mechanics — capitalization, button labels, errors, empty states, punctuation). Read that
first; this file is what changes because Enpath is specifically a career/HR platform, not a rule
for anything else built on the shared design system.

---

## Why this needs its own layer

Enpath handles competency scores, career levels, and promotion-adjacent data — real information
about real people's careers. Copy here can land as a judgment even when it's meant as a fact
("System design: 2, target is 3" reads very differently to the person it's about than it does to
an admin configuring a framework). The rules below exist to keep that from happening by accident.

## Never let a score read as a verdict

- A gap is **development information**, not a failing grade. Never use *failing, behind, deficient,
  weak, poor*. Use *not yet set, growth area, gap to target* — matches `glossary.md`'s own "Gap"
  definition, which is already framed this way.
- State the fact, not the interpretation. "System design: 2 of 4 — target is 3" not "System design
  needs work" or "Below expectations."
- "Not set" (already the pattern in the grid) beats a blank cell or a 0 — a missing score is a setup
  gap, not the person's fault.

## Two audiences, two voices — don't blend them

- **Setup (admin-facing, built so far)** — terse, operational, verb-first: "Publish", "Archive",
  "3 changes to review." The admin is configuring a system, not being spoken to personally. This is
  already the voice in the built Setup screens; keep matching it.
- **My Career / employee-facing (not built yet)** — warmer, second person, encouraging without being
  saccharine. The employee is reading about *themselves*. When that gets built, "Your setup is 92%
  done" energy is wrong for it — that's an admin-progress framing, not a person's career.
- Don't let Setup's clipped tone leak into anything an employee reads, and don't let My Career's
  warmth leak into Setup — an admin doesn't need to be reassured about a database field.

## Vocabulary — avoid HR-speak and engineering jargon alike

- No dehumanizing HR language: *talent, human capital, resources*. No corporate filler: *leverage,
  synergy, bandwidth, align*. ("Headcount" is fine as an internal admin metric, but "3 people" reads
  better in front of an actual person's row.)
- No engineering jargon in front of an admin either — `glossary.md`'s existing list stands:
  *governed writes, expected cells, nodes, cross-position, tenant*. This file extends that list, it
  doesn't replace it.
- Say "Level" only for a Position's own step (L1, L2…) and "point" only for a Matrix's rating scale
  — this distinction is load-bearing (see `set-up-build.md`'s "Key decisions") and a tone guide is
  exactly where it'd be easy to blur it back together by accident.

## Reversible actions must say so, every time

Publish, Unpublish, Archive, Restore, Draft — all of these move real data in and out of view for
real employees. Every confirm dialog for one of these already states plainly what happens and that
nothing is deleted ("It goes back to Draft... Nothing is deleted"). Keep that pattern for anything
new: state the visibility change in plain terms, and say explicitly when nothing is destroyed.

## Don't compare people to each other in copy

Never construct a sentence that surfaces one person's data to explain another's ("less experienced
than the team average"). Company-wide comparisons belong in aggregate views (the parked Company
view), never as prose next to an individual.

## Data provenance must be explicit, not implied

Anything sourced from ID Service (name, title, department, manager) must say so in the UI, not just
render as a plain field — BR-02 already requires this. The tone rule: don't let read-only HR data
*look* editable, and don't let it go unlabeled. Trust in an HR tool depends on always knowing where
a fact came from.

---

*Mechanics (capitalization, button verbs, error format, empty states) live in
`content-guidelines.md` — this file doesn't repeat them.*
