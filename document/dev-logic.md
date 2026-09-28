---
title: What the dev code decided — logic captured from en-path-dev
created: 2026-09-21
source: en-path-dev (API domain modules, web Setup Overview model, generated GraphQL schema types) — folder deleted after this capture
related: glossary.md, set-up-build.md, ../../document/original brief/prd-018-setup-module.md, ../../document/original brief/prd-001/002/003
---

#enpath #setup #domain #dev-logic

# What the dev code decided

`en-path-dev` was the real app (NestJS + GraphQL API, Vite web). Before deleting it, this note
records the logic that existed **only in the code** — decisions the PRDs leave open, rules no PRD
mentions, and PRD rules the code never enforced. Use it with the PRDs when building the new
prototype and its mock data.

> The code is **evidence of what the dev team chose**, not an approved decision. Where it settles a
> PRD conflict, the conflict is still the user's to confirm (see `set-up/what should be done.md`).

---

## 1. PRD conflicts the code settled

| Question | PRD-018 | PRD-001/002/003 | **Code** |
|---|---|---|---|
| Rating scale | 3, 4 or 5 named levels | any integer 1–10, locked | **1–10 levels; every level must have a name** (sequence 1…N, no gaps) |
| Expectation value | a number | a Matrix Level | **a Matrix Level ID** (`expectedLevelId`, or empty = "Not set") |
| Career Path status | Draft / Active / Archived + version | Draft / Active | **Draft → Active only. Active can never change. No archive, no versions** |
| OQ-01 — readiness by Level or by cell | open | — | **By Level:** a Level on a path is "ready" when every competency has an expectation (`mappedCount ≥ competencyTotal`) |
| Matrix status | Draft / Active | — | **Draft / Active / Archived** — archived is read-only and can be restored |

## 2. Rules in the code that no PRD mentions

**Competency Matrix**
- Name unique per company; name and description required.
- **Activation requires:** at least one **owner** (a user), the level count equals the scale size,
  at least one competency, and **every competency has a behavior for every scale level**.
- Active can't go back to Draft. Archived can't change status; it must be restored first.
- Competencies: name + description required, **name unique within the Matrix** (case-insensitive),
  one behavior per scale level at most. Competencies are **archived, not deleted**, and can be restored.
- Behaviors: title + description required.
- Every change to a Matrix is **audited** (who, when, what changed).

**Position & Level**
- Name and code required, with length limits; name/code conflicts rejected.
- Levels are ordered by a **free sort key**, so Levels can be reordered or inserted between
  others without renumbering.
- Levels can be deleted.

**Expectations**
- The Position's Matrix must be **Active**.
- A cell must use a Level of that Position, a Competency of that Matrix, and a scale level of that Matrix.
- One cell per Level × Competency.
- Scores must not go down as Levels go up — **only set cells count**, equal is allowed.
- **Changing the Position's Matrix** replaces its expectations (Preview warns first) — matches BR-10.

**Career Path**
- Name required. **2 to 20 stops.** A Level can't appear twice. Every stop must be an existing Level.
- Each stop carries, for display: Position name, Level name, number of competencies, number set.

**Employee Mapping**
- A person has **one** Level or none (assign / unassign). People come from the company directory
  (ID Service, called "En-ID"); EnPath stores only the employee ID and the Level.

**Preview → Confirm (how it works)**
- Preview returns a summary, a list of changes, warnings, a **confirmation token** and an **expiry time**.
- Confirm is rejected if the token expired or if **someone else changed the data in between**
  ("changed before confirm") — protects against two admins editing at once.

**Access** (roles and permission sets, managed in-app)
- Permissions: `competency:read / create / update / archive`, `position:read / create / update / delete`,
  `assessment:update`, `users.manage`, `iam.manage`, `iam.permission-set.manage`.
- Built-in permission sets: Competency Viewer · Competency Contributor · Competency Manager ·
  Position Manager · Assessment Editor · User Directory Manager · IAM Administrator · Super Administrator.
- PRD-018's single `framework.write` is split into these finer permissions.

**AI / MCP**
- Every Setup area (Positions, Matrices, Expectations, Career Paths, Employee Mapping, users) is
  exposed as an **MCP tool**, so an AI assistant can read and act — through the same Preview → Confirm.
  Backs the chat-panel direction in `set-up/what should be done.md`.

## 3. PRD rules the code does not enforce

| PRD rule | Status in code |
|---|---|
| **BR-03** Only Active Positions can be used for mapping | ❌ Positions have **no status** at all |
| **BR-12** Same-position progression must move to a higher Level | ❌ not checked — only duplicates are rejected |
| **BR-14** Important writes Preview → Confirm | ⚠ only **Matrices and Expectations**. Positions, Levels, Employee Mapping and Career Paths save directly |
| **BR-15** Confirmed writes create an Audit Log | ⚠ only **Matrix** changes are audited |
| **RQ-01** Overview "Employees mapped" step | ❌ hard-coded as never complete; progress max 4 of 5 |
| **BR-05/06** Levels / Competencies required before Expectations | ⚠ implicit — an empty grid just has nothing to save |

## 4. Data model (from the generated GraphQL types)

Use this shape for the prototype's mock data. `?` = optional.

```
Position          id · name · code · description? · levels[]
PositionLevel     id · positionId · name · description? · sequence (sort key)
EmployeeMapping   employeeId · positionLevelId? · createdAt · updatedAt
                  (name, title, department, manager come from ID Service)

CompetencyMatrix  id · name · description · status (Draft|Active|Archived)
                  proficiencyScaleSize (1–10) · levels[] · competencies[] · archivedCompetencies[]
                  owners[] (userId) · createdAt · updatedAt
MatrixLevel       id · sequence · name · description?
Competency        id · name · description · sequence · behaviors[] · archivedAt?
ObservableBehavior id · competencyMatrixLevelId · title · description · sequence

PositionExpectations  positionId · matrixId · cells[]
ExpectationCell       positionLevelId · competencyId · expectedLevelId?   (empty = Not set)

CareerPath        id · name · description? · status (Draft|Active) · ownerUserId · nodes[]
CareerPathNode    id · sequence · positionLevelId · positionName · levelName · description?
                  competencyTotal · mappedCount

ChangePreview     summary · changes[] · warnings[] · confirmationToken · expiresAt
AuditLog (Matrix) who · when · action · target · field changes
```

**Mock data:** there was none — the API's seed script was empty. Build it from this model plus the
prototype's Northstar example (5 Positions, Backend Engineer L1–L4, Northstar Engineering Matrix,
1 Awareness … 5 Expert) in `glossary.md`.
