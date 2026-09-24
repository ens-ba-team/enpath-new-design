---
name: prototype-build-for-codex
description: Build and modify the Enpath Setup prototype, verify connected data behavior, and reliably reload the visible local prototype after every UI change. Use for work in Enpath-design-system/enpath-ui, especially Setup, tokens, cross-tab state, and interaction fixes.
---

# Enpath prototype build

Use this workflow for the Enpath prototype. A code change is not complete until the user's visible
prototype has loaded the new code and the exact interaction works end to end.

## Canonical locations

- Repository: `/Users/mac/Downloads/Obsidian/Working process - L&D/Enpath/Enpath-design-system`
- Prototype: `enpath-ui`
- Setup route: `http://localhost:3000/setup`
- Product build record: `../document/set-up-build.md`
- Token rules: `Skills/token-binding-skill.md`

Do not work from or recreate `Enpath-new-design`; it was a temporary duplicate and is no longer the
repository.

## Before changing anything

1. Check the current Git branch and working tree. Preserve unrelated changes.
2. Read the relevant product logic in `document/set-up-build.md` and `document/dev-logic.md`.
3. Trace the full state path before editing: source data → shared state owner → child props → rendered
   page → related pages. Do not patch only the visible component when another tab consumes the data.
4. If tokens, spacing, color, typography, or a design-system component are involved, read
   `Skills/token-binding-skill.md` completely and follow it.
5. When the user asks for a plan, present the logic and edge cases and wait for approval before editing.

## Building connected prototype behavior

- Keep shared entities in the nearest common state owner. Setup currently owns Positions, Matrices,
  and Career Paths in `setup-screen.tsx`.
- Store references by stable id; do not duplicate labels or structures between pages.
- Test every path that can reach the state, not only the intended happy path. For Matrix changes,
  include direct Drafts, versioned Drafts, Archived/Restore paths, linked Draft Positions, linked
  Published Positions, and unselected migration candidates.
- For destructive transformations, show the exact impact before confirmation and verify the result
  after confirmation. Never silently clamp, delete, or remap user data.
- Remember that prototype state is in memory. Reloading resets mock edits; use this deliberately when
  returning the prototype to a clean demonstration state.
- Update `document/set-up-build.md` when a product rule or interaction model changes.

## UI and token rules

- Reuse existing components before creating new ones. Modal flows should use the existing `Dialog` or
  `AlertDialog`; warnings inside them should use the existing `Alert`.
- Let components own their component tokens. Do not recreate modal surfaces, borders, shadows,
  controls, or warning colors in screen code.
- Bind spacing and layout with existing semantic tokens. Read token descriptions before choosing by
  meaning, not visual value.
- Do not add a token when an existing component or semantic already represents the job.

## Verification

Verification must cover all three layers:

1. **Static:** run `npx tsc --noEmit -p .` in `enpath-ui`.
2. **System:** when components or tokens change, run drift check, artifact validation, contrast, and
   regenerate token/component output when required by the token skill.
3. **Behavior:** run the exact user flow in a browser. Assert the meaningful result, not just that a
   modal opened. For linked data, inspect both the source page and the consuming page after saving.

Do not say “fixed” based only on TypeScript, HMR output, or an isolated helper calculation.

## Mandatory prototype reload

After every completed TSX, CSS, or token change:

1. Stop the exact existing Next.js dev-server process/session.
2. Remove only `enpath-ui/.next` (generated cache).
3. Restart from the canonical `Enpath-design-system/enpath-ui` directory with `npm run dev`.
4. Wait for `Ready` and confirm the server is on `http://localhost:3000`.
5. Open or reload the exact route the user is reviewing, preserving its query tab, for example
   `/setup?tab=matrices` or `/setup?tab=paths`.
6. Verify the updated control or flow in that newly loaded page.
7. Leave the useful prototype tab visible for the user.

Do this proactively. Do not wait for the user to report that the update is missing.

If the visible browser cannot be controlled, say so plainly and give the exact URL plus the required
hard-refresh action. Never claim the visible prototype is updated when only a separate headless test
was updated.

## Diagnosing “not showing” or “not working”

Check these in order:

1. The user is viewing `localhost`, not an older Vercel deployment.
2. The server is running from the canonical repository and current branch.
3. No stale or second Next.js server owns port 3000.
4. `.next` was cleared after the source change.
5. The browser route and selected Setup tab are correct.
6. The exact user interaction path was tested, including alternate lifecycle paths.
7. The visible result was inspected after confirmation, not inferred from source code.

When isolated automation passes but the user's flow fails, treat that as evidence of a missing path or
stale visible instance. Investigate the difference; do not keep repeating reload instructions.

## Completion report

State briefly:

- what behavior changed;
- which linked pages or edge cases were verified;
- which checks passed;
- that the clean local prototype was restarted and which URL is open.
