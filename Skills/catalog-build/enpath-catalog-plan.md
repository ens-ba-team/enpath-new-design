---
title: Enpath catalog — plan
created: 2026-09-28
status: Planned, not started. Waiting on the open decisions below.
related: catalog-build.md (the skill), ../../enpath-design-system.md, ../../llms.txt, ../../Tracking/Storybook Status.md
---

# Enpath catalog — plan

A `/catalog` page for Enpath, built with the **catalog-build** skill (`catalog-build.md` in this
folder, copied unchanged from Accura on 2026-09-28 together with its `templates/`). Every component
(later: pattern, layout, template) rendered live from its Storybook stories, with a status badge and
a permanent **ID** to copy and give to a person or an agent ("use `enp-cmp-career-map`"). Deployed
as **its own Vercel site**, separate from the prototype.

Nothing is built yet. Read the skill first; this file only records what's specific to Enpath.

## Workflow (decided 2026-09-28)

- **Text first:** `document/design-patterns.md` is the written catalog. Layouts, templates and
  patterns are written there as **candidates**; the user approves them; **only approved items get an
  ID** and go into `catalog-entries.json`. The catalog shows only items with an ID.
- **Components are global.** A component's look changes only in the component (Storybook +
  `meta.json`), never at a place of use; there's no "custom component" kind. Every component gets an
  ID when the catalog is built (`ai-elements` = `agt`) and its card renders its **stories live** (not
  screenshots, which go stale).
- **Overrides found on screens are debt**, listed in design-patterns.md → "Needs a Storybook
  update" (17 items on 2026-09-28), to become component variants / sizes.
- Four kinds: Components · Patterns · Templates · Layouts.

---

## Should we do it

Worth it because the catalog is meant to be **shared** (its own deploy): the dev team
(`ens-ba-team`) and agents (Codex, see `prototype-build-for-codex.md`) can name exact items by ID,
and people without Storybook get one link. Bonus: `next build` with the catalog type-checks every
story for the first time (Accura found 25 errors in story files).

Costs: rerun `build-catalog.mjs` after every component / story / pattern change (one more gate);
nothing is verified yet, so every card will honestly show `draft` / `in-review`.

**Phases:**
1. **Components** (54 IDs + the page + the deploy). They're stable.
2. **Patterns, layouts, templates** as they get approved in `document/design-patterns.md`. IDs are
   permanent; giving them to things still changing produces many `deprecated` entries.

## Fit check (done 2026-09-28)

| Needs | Enpath | Note |
|---|---|---|
| Next.js App Router | ✅ `enpath-ui/src/app/` | Routes: `/me/career`, `/setup`; `/` redirects to `/me/career` |
| Stories import only *types* from Storybook | ✅ 55 story files, 0 runtime imports | Render outside Storybook |
| shadcn `@/components/ui` | ✅ `enpath-ui/components.json` | 47 `ui` components + 9 AI Elements |
| Agentic-family token names | ✅ in principle | Still map every `var(--…)` in `catalog-view.tsx` against `src/app/tokens.css`: an unknown var fails silently |
| Status table | `Tracking/Storybook Status.md` | No component has "Story verified" yet → nothing is `stable` |

**Adding `catalogId` to `meta.json` is safe** (checked 2026-09-28):

| Reads meta.json | Effect |
|---|---|
| `artifacts/schema/component-meta.schema.json` | `additionalProperties: true` → extra key allowed |
| `validate-artifacts.mjs` | Checks required fields + `artifactStatus` only |
| `drift-check.mjs` | Reads `description` and tokens only |
| `sync-doc-values.mjs` | Rewrites a file when values change; keeps extra keys |
| App / Storybook | Nothing in `enpath-ui` reads meta.json |

Exception: `career-path-stepper.meta.json` isn't in standard 2-space JSON format (compact objects).
Insert its `catalogId` as a text edit, not parse-and-rewrite, or the whole file reformats.

## Differences from Accura (the reference build)

| Accura | Enpath |
|---|---|
| `docs/machine-readable/` | `Machine Readable/` (with a space — quote paths) |
| Modules in `app/prototype/accura/` | Modules in `enpath-ui/src/features/enpath/{my-career, setup, chat}` |
| `CLAUDE.md` gets the *Catalog IDs* rule | No `CLAUDE.md`: put the rule in `enpath-design-system.md` (rulebook) + `llms.txt` |
| Root page redirects to the app | `enpath-ui/src/app/page.tsx` redirects to `/me/career`; add the `CATALOG_SITE` switch |
| Storybook port | Enpath Storybook: `npm run storybook` → :6006 |

## Steps

Follow the skill's sections; Enpath specifics in brackets.

1. **IDs** (skill §3) — add `catalogId` after `name` in the 54 `Machine Readable/artifacts/components/*.meta.json`
   (round-trip check first; text edit for `career-path-stepper`). Add `catalogId` to
   `Machine Readable/meta-artifact-template.md` so new components get one.
2. **Entries** (§3) — `Machine Readable/catalog-entries.json`. *Phase 2 only* for patterns / layouts /
   templates. Candidates:
   - layout: app shell (sidebar · page panel · chat panel);
   - templates: **master-detail** (Setup's three tabs), **career workspace** (My Career: map / list +
     detail panel + progress strip);
   - patterns: History drawer (Setup), Path history drawer, gap rows, progress strip, path-change
     Alert, chat panel. Private helpers (`RoutePreview` in `plan-dialogs.tsx`, `Panel` in
     `my-career-panels.tsx`) can't get an ID until extracted: **flag, don't extract unasked**.
3. **Build script** (§4) — `Machine Readable/build-catalog.mjs` from `templates/build-catalog.mjs`;
   edit only CONFIG (app `enpath-ui`, metaDir, entries, status table `Tracking/Storybook Status.md`
   and its columns, modules folder `src/features/enpath`, prefixes, output
   `enpath-ui/src/app/catalog`, `@/` root). Read the `usedIn` column and report findings.
4. **Page** (§5) — copy `templates/app-catalog/*` to `enpath-ui/src/app/catalog/`; resolve every
   `ADAPT:` (product name, module labels, route prefix, Badge variants / shape, token names,
   Storybook port 6006).
5. **Pattern previews** (§6, phase 2) — sample data from Enpath's own mock (Lan Nguyen, Engineering
   growth, Northstar matrices).
6. **Docs** (§7) — rulebook section *Catalog IDs*; `llms.txt` *Catalog* section pointing at
   `catalog.json` first; add `build-catalog.mjs --check` to the "what else has to change" rules and
   to the gates; CHANGELOG entry (new field in every meta.json).
7. **Verify** (§8) — `build-catalog.mjs --check` (plant a failure first) · `npx tsc --noEmit -p .` ·
   `npx eslint src/app/catalog` · `verify-catalog.mjs` with screenshots, **look at them** ·
   stop dev, `npx next build`. Story type errors → fix the stories, never turn type-checking off.
   Browser checks at 390 and 1280px.
8. **Icon** (§9) — `enpath-ui/src/app/icon.png` (512², the mark alone) + replace
   `src/app/favicon.ico` (currently Next's default).
9. **Deploy** (§9) — `src/app/page.tsx`: `redirect(process.env.CATALOG_SITE === "1" ? "/catalog" : "/me/career")`.
   Vercel: new project → same repo → Root Directory `enpath-ui` → env `CATALOG_SITE=1`. The
   prototype routes stay reachable there (template previews load them). Storybook links only in dev
   or via `NEXT_PUBLIC_STORYBOOK_URL`; never ship localhost links.

External steps (Vercel project, env, branch, protection) are confirmed with the user before doing
them.

## Open decisions (answer before step 1)

- [ ] **"A different Vercel"** means (a) a new Vercel **project** from the same repo
      `ens-ba-team/enpath-new-design` (the skill's recommendation: the catalog renders the real
      components, a copied repo drifts), or (b) another Vercel **account / team** (it then needs
      GitHub access to the `ens-ba-team` org)? Is the prototype itself deployed anywhere yet
      (`enpath-ui` has no `.vercel`)?
- [x] `ai-elements` components use `agt-` (2026-09-28).
- [ ] **ID prefixes:** `agt-` for components inherited from Agentic, `enp-` for components made in
      Enpath (career-map, stat, …)? The list of Enpath-made ones to be proposed from the meta.json
      changelogs and approved, not guessed.
- [ ] `label.tsx` has no `meta.json`: create one so it gets an ID? (`button.figma.tsx` is a leftover
      code-connect file from before Enpath went no Figma, not a component: excluded.) Types `cmp` · `pat` · `lay` · `tpl`; a story after `#`
      (`agt-cmp-badge#success`).
- [ ] **Statuses:** default `draft` / `in-review` / `stable` / `deprecated`, from
      `Tracking/Storybook Status.md` (so nothing is `stable` today)?
- [ ] **Templates:** just master-detail (Setup) and career workspace (My Career)?
- [ ] **Logo for the tab icon:** a PNG of the Enpath mark (white or transparent)? If none, reuse the
      sidebar mark — ask, don't draw one.
- [ ] **Public or protected:** production is public to anyone with the link unless Vercel
      Authentication / Password Protection is on.
- [ ] **Production branch:** `main` (Enpath commits straight to `main`, so every push updates the
      catalog)?
- [ ] **Phasing:** components first, patterns / templates later — agreed?
