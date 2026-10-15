---
title: Records build
created: 2026-09-30
updated: 2026-10-15
status: Step 1 built 2026-10-15 (table + drawer at /me/records); steps 2–4 next
related: glossary.md, my-actions-build.md, my-assessment-build.md, my-career-build.md
---

#enpath #records #build

# Records build

What the Records page is and how it will be built. Kept current as decisions land.

**Sources:** `../../document/original brief/prd-023-records.md` (PRD-023, main doc, updated 9 Oct;
PRD-021 is empty and replaced by it) · `../../EnPath_Records_UI_Feedback.html` (PO change request on
the dev team's current UI, screenshots 14 Oct) · our own decisions below. The old prototype
(`enpath-prototype.html`) is no longer a source: PRD-023 supersedes it.

Where it sits (`glossary.md` → "How the pieces fit"):

```
Target → Assessment (scores) → Growth areas → Action plan (what I plan to do)
Records (what happened, from anyone) ─────────────────────────▶ next Assessment
```

## The model (PRD-023)

- **Record = a container, no status.** It has a title, a creator and zero or more **feedback items**.
  The list never shows a Record status or counts; the detail shows counts per item status (BR-19).
- **Feedback item = one piece of feedback about exactly one recipient** (BR-04). One Record can hold
  items for several people; each moves on its own, and a recipient never sees another person's item.
- **Anyone writes, about anyone in the company** (BR-01), including themselves (explicit
  "Feedback for myself", never a default).
- **Two acknowledgements:** the recipient **and** the recipient's line manager (recorded when the item
  is submitted) both acknowledge the same revision (BR-08). Acknowledge = "I've seen it", not
  agreement and not a score (BR-09).
- **Auto acknowledgement:** feedback for myself auto-acknowledges the recipient role; a manager writing
  about a direct report auto-acknowledges the manager role. The other person still responds (BR-21).
- **Request correction:** either acknowledger can ask for a correction, with a required note, before
  the item is Acknowledged. The item goes back to the creator, who edits and resubmits a new revision;
  both acknowledge again (BR-10). Earlier revisions and notes stay in history.
- **Acknowledged = final.** No edit, no correction, no delete. New information = a new item (BR-22).
- **Drafts:** a draft can have no recipient and no content; Title is required to save. Draft items can
  be deleted; a whole Record only when every item is Draft.
- **Submit = the selected items, all or nothing** (BR-23): if one selected item is invalid, none is sent
  and the errors show inline. Unselected items stay Draft.
- **AI from files:** upload PDF, DOCX or TXT (up to 10 files, 10 MB each, 50 MB total). AI drafts items,
  one per recipient, grouped by topic, marked AI-suggested. It never picks a person when unsure: the
  item shows the source text and asks the creator to choose. While AI runs the Record is locked;
  failure offers Retry or writing manually.
- **Current delivery ends at Acknowledged.** Insights, competency links and suggested Actions
  (RQ-08/09) are future. Nothing in Records changes a score, a growth area or an Action (BR-15).

### Feedback item statuses

PRD-023 has five item statuses; the UI shows **four badges, one colour each** (user, 2026-10-15), plus
a line under the badge saying **who** (icon + name, never colour alone). No step bar: the two
acknowledgements happen in any order and a correction loops back, so a linear bar would mislead.

| PRD status | Badge | Line under it | Who acts |
|---|---|---|---|
| Draft | `secondary` "Draft" | Not sent yet | Creator: edit, delete, submit |
| Awaiting acknowledgement | `blue` "Awaiting acknowledgement" | ✓ / 🕑 per person ("✓ Thảo Ngô  🕑 Hà Phạm") | Recipient + manager |
| Partially acknowledged | same badge as above | same line: one ✓, one 🕑 | The one left |
| Needs correction | `warning` "Needs correction" | Asked by {name} | Creator: edit and resubmit |
| Acknowledged | `success` "Acknowledged" | On {date} | Nobody. Final |
| (waiting for **me**) | no badge: "Waiting for you" | none (the other acknowledger is in the drawer) | Me |

## Decisions (kept)

- **No "evidence" in the UI** (PO, 2026-09-30), even though PRD-023 uses the word. Say "record",
  "feedback" or "what happened".
- **No competency on a record** (user, 2026-09-30). PRD-023 lists related Competencies and Actions as
  optional form fields; we leave them out: the PO's form doesn't ask for them and AI mapping is future.
- **Separate from Actions** (2026-09-30): pages don't link; they meet at Assessment.
- **Names are shown in Records** (user, 2026-10-15): recipient, author and the **manager who will be
  asked to acknowledge** are named. This is an exception to the "your manager" rule of My Career,
  because the creator is sending to other people and must see who receives it (PRD-023 RQ-02, RQ-05).
- **AI upload stays in the same popup** (user, 2026-10-15) as a secondary option; the manual form is
  what opens.
- **Save and submit sends every block** in the popup (user, 2026-10-15). If one is incomplete, show
  inline errors and send nothing (matches BR-23).
- **Bulk select** (user, 2026-10-15): Select all applies to the **current filter**, with the selected
  count, Clear selection and one Preview & submit. Older correction notes live in the History drawer.

## PO UI feedback (14 Oct) — what changes from the dev team's current UI

1. **One creation entry point: Create Record.** Remove "Add feedback" in the detail and the
   "Manual / Upload with AI" buttons above the list. Adding items to an existing Record happens from
   its detail through the same editor, not a second CTA.
2. **The popup shows every field on open:** Title*, then block "Feedback 1": Recipient (search name or
   email), ☐ Feedback for myself (sets me, disables the search; untick to enable), Feedback content.
   **+ Add new feedback** appends Feedback 2, 3…; extra blocks have Remove (the only block can't be
   removed). Footer: **Cancel · Save draft · Save and submit**. The popup scrolls inside.
3. **Needs correction shows the note on the card:** "Correction requested by {name}", the note, the
   date and time, and an **Edit feedback** button. No need to open the detail.
4. **Bulk selection:** Select all (current filter), selected count, Clear selection, Preview & submit.
   Checkboxes only on items that can be sent (Draft with content + recipient, or a corrected Needs
   correction item); others show a disabled checkbox with the reason on hover.
5. **Remove "Written manually"** from cards. AI-drafted items keep an "AI draft" marker until edited
   or sent (PRD: AI-suggested must be visible).

Our own fixes to the current UI (consistency with My Career / My Actions):

- One page header (title, description, Ask AI); tabs under it; no second heading + description per
  tab; no Refresh button.
- Filters match the statuses on the cards.
- Recipient's view (About me) has **Acknowledge** and **Request correction** on the card.
- Show acknowledgement progress per item (who has, who hasn't).
- No machine words ("Method: Form", "Creation method"); no coloured left stripes; Preview & submit is
  disabled at 0 selected.

## Why people open Records (2026-10-15)

| Who | Job | How often |
|---|---|---|
| Everyone (recipient) | Someone wrote about me: read it, acknowledge or request a correction | Often, after a notification |
| Manager | Acknowledge records about my reports, often several at once | Often, in batches |
| Creator | Write a record · fix one that came back for correction · send my drafts | Medium |
| Creator | Has it been acknowledged yet? | Rare, a glance |
| Everyone | Look back at what was said about me / my reports (before an Assessment or 1:1) | Rare |

Most visits are **"what needs me?"**, across roles. So: one table, not one tab per role.

## Layout — chosen (user, 2026-10-15): one table + detail drawer

Replaces the dev team's tabs (Created by me · Received · Manager review) and the two-column detail.

- **One thing in the UI: a record.** A record about someone else is what people call feedback; it is
  the same object (user, 2026-10-15). PRD-023's "feedback item" = one row = one record in the UI.
- **Header:** Records + description · Ask AI · **Create record** (the only creation entry point).
- **Two tabs** (user, 2026-10-15): **My records** (what I wrote or what is about me) and **My team**
  (records about my reports). Each tab shows its own Needs you count. My team always shows for now:
  **no permission rules in the prototype** (user, 2026-10-15); later only managers see it.
- **Views:** My records = **Needs you** (default when it has items) · All · Sent · About me · search.
  My team = Needs you · All · a **person Select** ("Everyone", each report with "N waiting for you";
  a Select, not chips, so it scales to many reports) · search.
- **Table, one row per record, same columns in both tabs** (user, 2026-10-15): checkbox · **From** ·
  **About** · Record · Status · action. (Replaced one Person column with "to you / from you", which
  read ambiguously.) Earlier draft: checkbox · Person (the other person + direction: "to you", "from you",
  "about An Trần, your report") · content + source title and date · Status (Badge + who is still
  waiting) · **the one action this row needs** (Acknowledge · Edit · Submit · none while waiting).
- **Bulk bar** when rows are selected: count · Clear · one action (Acknowledge N / Submit N). Select
  all = current view. Rows that can't take the action have a disabled checkbox.
- **Detail = right drawer** (Sheet, pattern P3), the table stays behind: content, who acknowledges
  (each person: done / waiting), the line "Acknowledging means you've seen it, not that you agree",
  History, actions.
- **Request correction opens inline in the drawer** (user, 2026-10-15): a required note field and
  Send, no extra dialog.
- **Mobile:** rows become stacked cards with the same fields.

## What's built (step 1, 2026-10-15)

`/me/records` (`src/features/enpath/records/`), mock data for Lan Nguyen (`mock-data.ts`: 9 records,
every status; Lan's manager Hà Phạm and a direct report An Trần, so My team has rows).

- **Header:** Records + description · Ask AI (shared chat: "What needs my response?", "Summarise
  what people said about me"; never acknowledges or sends) · Create record (no action yet, step 3).
- **Tabs** (Tabs line): My records · My team, each with its Needs you count. Switching tab picks Needs
  you when it has rows and clears the selection and filters.
- **Views:** ButtonGroup Needs you (count) · All · Sent · About me (My team: Needs you · All + person
  Select) · search (content, title, people). Changing view clears the selection.
- **Mock team:** Lan manages An Trần, Bình Hồ, Chi Phan (12 records in all).
- **Table** (`records-table.tsx`): From · About (avatar + name, "(you)" for Lan) · Record (content, title · date; for my record with a correction, the
  note) · Status (Badge + "Waiting for …" / "Asked by …" / date) · action (Acknowledge · Submit · Edit).
  Row click or the content opens the drawer.
- **Bulk:** checkboxes only on rows to acknowledge or submit; header checkbox = this view; bar with
  count, Clear selection, Submit N, Acknowledge N.
- **Drawer** (`record-drawer.tsx`): status, content, written by / about, open correction (Alert
  warning), Who acknowledges (each: done with date, "acknowledged for you", waiting), History;
  footer Acknowledge + Request correction (note opens inline, required) or Submit.
- **Submit** (`submit-dialog.tsx`): Preview → Confirm listing each record, recipient and their
  manager. Submitting records the manager and auto-acknowledges Lan's own role (for herself, or about
  her report).
- **Audit fixes (2026-10-15):** cells at most two lines (content + source; status + progress), full
  text in the drawer · columns rebalanced (Record gets the room) · selecting swaps the filter row for
  the selection bar (same height, table doesn't move) · row buttons outline, the bulk bar has the one
  primary · a record waiting for Lan shows "Waiting for you" + the other person named, no badge ·
  counts on the tabs and on Needs you use the grey `secondary` Badge, not the brand counter (user: less brand) · no checkbox on rows that can't be selected. Component
  issues found (InputGroup height, ghost pressed fill, TableRow selected border, account avatar) →
  `design-patterns.md` → Open flags.
- **Drawer audit (2026-10-15, D1–D9):** title = the record's title, meta "From · About · date" (no
  Written by / About block) · an open correction is the first block and replaces the status badge ·
  acknowledgers are "The person" / "Their manager", shown as "Paused until {creator} sends a new
  version" while a correction is open · the "not that you agree" line only for someone who has to
  acknowledge · History as a plain two-line list, flush with the other blocks · 24px between every
  block, header included. D7 (the creator has no action on a correction) = step 2.
- **Drawer v2 (2026-10-15):** header = the record's title, meta "From · About · date" · an open
  correction first (Alert) · **Your feedback** (creator) + the content (`body-sm`) ·
  **Acknowledgements** ("· N of 2" while waiting): each person with **Your turn · Waiting ·
  Acknowledged {date} · On hold** (correction open); none for a draft · **Activity (N)** collapsed ·
  footer one row (`SheetFooter orientation="horizontal"`, new). Three text levels: `heading-md` title ·
  `heading-xs` section titles · `body-sm` content · `body-xs` meta. All drawer text on
  `surface/overlay/foreground`.
- **Copy (user rule, 2026-10-15): no copy nobody asked for.** Removed: the page description, Empty
  descriptions, the correction-note placeholder, the "not that you agree" footnote, the resubmit
  helper, the Submit dialog description. The only helper line is the approved "Both will be asked to
  acknowledge again." under Edit and resubmit.
- **Edit and resubmit = one step (step 2 basics, user 2026-10-15):** row Edit or the drawer's button
  turns the content into a textarea; **Resubmit** sends at once (no second Submit / preview), closes
  the correction, both acknowledge again (BR-10).
- **Tokens fixed:** selection bar `surface/tint` (identity fills only) → `surface/raised` + border;
  waiting clock `icon/muted` → `icon/default`; Lan shows as "You" in From / About.
- **Every view groups rows by Record (2026-10-15; first Sent only):** a group row (title · from
  {creator} · N feedback · date; "from" left out for your own records; collapsible, all open, no status
  or actions) with its feedback rows under it; no From column. A group holds **only the rows that view
  may show** (BR-18), so My team groups a record about several reports (Quân Đỗ's Sprint 14 retro →
  An Trần + Bình Hồ) without revealing anything else in it.
- **My team person filter = Combobox** (searchable; Select didn't scale to 100+ reports).
- **Combobox rebuilt (2026-10-15)** on Popover + Command: the Base UI list couldn't be clicked or typed
  in inside the Dialog; adds a Clear (×) button. New component: Popover (CHANGELOG).
- **Create record (step 3, 2026-10-15)** (`create-record-dialog.tsx`): Dialog · Title · blocks
  "Feedback N" (Recipient Combobox with **You** first · "Manager: {name}" once chosen, PRD RQ-02 ·
  Feedback textarea) separated by Separator · Remove on extra blocks · Add feedback · Cancel · Save draft
  (title only) · Save and submit (every block complete, else inline errors, nothing sent; sends at once,
  no preview). Each block = one record item sharing the Record's title. Empty blocks aren't saved. A
  draft may lack a recipient (BR-20): its row shows "No recipient yet" and **Edit** reopens this form
  with the record's drafts. "From files" switch hidden until step 4.
- **Component fixes found on the way:** Combobox showed the option's value ("grace") not its label,
  and opened under Dialogs; fixed + `hideLabel` (CHANGELOG).
- **Create record v2 (2026-10-15, matches the widget):** each block is a flat `Card`; Recipient shows
  avatars and searches name or email. New component options: `Card elevation="flat"`, `Avatar size="xs"`,
  Combobox option `avatar` + `hint` (CHANGELOG).
- **AI from files (step 4, 2026-10-15):** segmented tabs (Tabs default, with icons) **Write feedback manually ·
  Analyze files with AI** (labels as the current product; hidden when editing drafts). From files: Title · drop zone (`Empty outline`) + Browse files · file list (name, size,
  remove) · type / size / count checks (PDF, DOCX, TXT · 10 files · 10 MB each · 50 MB total) · **Draft
  feedback** → form locked, Spinner "Reading N files" (Cancel stops) → AI drafts join the blocks with an
  **AI draft** badge (until sent) and a source line (file · page · quote); a person AI isn't sure of is
  left empty with "Not sure who "Minh" is: Minh Lê or Minh Hồ. Choose one." · a file that can't be read
  → Alert + Retry (without that file) · Write instead. **Mock:** any upload returns the same two drafts;
  a file named "damaged" fails. Saved AI drafts show "AI draft" in the table and drawer until sent.
- **Not yet:**
  mobile layout (the table scrolls sideways under 760px).

## Next, one at a time (user, 2026-10-15)

1. [x] Build the table + drawer (recipient and manager actions) on mock data (2026-10-15).
2. [x] **Creator's view of a correction request**: correction first in the drawer, Edit and resubmit in one step (2026-10-15).
3. [x] Create record popup (2026-10-15): one Title, several blocks; each block is one row, grouped under
       its Record in Sent.
4. [x] AI from files (2026-10-15): upload, locked reading, AI drafts with source, unclear person, failure.

## Open questions

- [x] ~~Q1 Who approves~~: recipient + their line manager acknowledge; no "Approved" (PRD-023).
- [x] ~~Q2 Reject or ask for changes~~: Request correction with a note; no reject (PRD-023 OQ-02).
- [x] ~~Q3 Visibility~~: creator sees the Record; recipient and recorded manager see only that item;
      the original file is creator-only (PRD-023 RQ-10, OQ-07).
- [x] ~~Q4 Edit after sending~~: only via correction before Acknowledged; Acknowledged is final.
- [x] ~~Q5 Competency~~: none on a record (2026-09-30).
- [ ] **Q6** Which records does AI read at Assessment: Acknowledged only? Within the period? (PRD-023:
      only Acknowledged; analysis is future.)
- [ ] **AI reasoning log** (idea, not confirmed).
- [ ] **Q7 Retro generation:** later (not in PRD-023).
- [x] ~~Q8 Name~~: "Records".
- [ ] **Older correction notes:** History drawer only, or also a "Show earlier" on the card? (PO §7.4;
      proposed: History drawer.)
- [x] ~~Tab name~~: no tabs; views in one table ("About me" is a view).
- [ ] **Feedback for myself:** which manager acknowledges it, and does it count as feedback or as a
      self note? (PRD: my manager acknowledges.)
