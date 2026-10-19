# Enpath

<!-- impeccable:product-schema 1 -->

## Platform

web

## Scope

This record describes the Enpath product. The design system and prototype in this repository support its implementation; they are not separate products in this record.

Product scope, audiences, development loop and constraints below were confirmed by the user during init.

## Users

- Employees: understand their current career position, choose a target and work on their development.
- Direct managers: review assessments, approve applicable career requests and support employee development.
- Admins/HR: configure career structures, competency frameworks, expectations and company paths.

No single audience has been designated as the priority across all surfaces.

## Product Purpose

Help people connect career goals to concrete development work through the loop:

Target → Assessment → Growth areas → Action plan → Records → subsequent Assessment.

Success means employees can understand where they want to go, what the target requires and what to do next, while managers and admins maintain trustworthy development information.

## Positioning

Enpath connects company-defined career structures and competency expectations with employee-directed career targets and development actions. AI proposes; people decide. Do not invent comparative superiority, outcome metrics or market claims.

## Operating Context

- Admins configure Positions and Levels, employee mappings, competency Matrices, Expectations and company Career Paths.
- Employees explore paths and targets in My Career. A target does not change their official role.
- Assessments provide competency scores; growth areas compare approved scores with a target's expectations.
- Actions describe planned development work. Records describe what happened. They remain separate and inform subsequent assessment.
- Company HR identity data belongs to the ID Service and is read-only in Enpath.
- Use `document/glossary.md` for domain vocabulary and detailed relationships. Conflicts explicitly left unresolved there remain unresolved here.

## Capabilities and Constraints

- Existing implementation: Next.js 16, React 19, TypeScript, Tailwind CSS v4 and shadcn/ui in `enpath-ui/`; Storybook documents components.
- This repository contains a mock-data prototype, not evidence of a production backend or live HR integration. Prototype data resets on refresh.
- `/setup` and `/me/career` are the documented built routes. Other workflows may be specified without being implemented; consult current code and build documents before claiming availability.
- Assessments are the only source of competency scores. A missing assessment is not a zero or a growth area.
- AI suggestions are not approved scores and must not be treated as confirmed decisions.
- Actions and Records are separate. Completing an Action does not turn it into a Record.
- Employee career targets do not alter official employee assignments.
- Keep customer-company data within its tenant boundary. Production security and compliance requirements beyond documented domain constraints remain undecided.
- Code, tokens, component metadata and repository documentation are the implementation sources of truth, not Figma. Follow `enpath-design-system.md` for their order of authority and `llms.txt` for their locations.

## Brand Commitments

- Name: Enpath.
- Scores are development information, never verdicts about a person.
- Employee-facing copy is warmer, second-person and encouraging without exaggeration; admin copy is concise, operational and verb-first.
- Use “Growth area” in employee-facing comparisons, not “gap.” Use “record” for what happened, not “evidence” in the UI.
- Avoid dehumanizing HR language, corporate filler and internal engineering terminology in UI copy.
- State data provenance and the consequences of consequential actions plainly. Say when nothing is deleted.
- Follow `enpath-tone-and-voice.md`, layered over `content-guidelines.md`. Where a document's implementation-status note conflicts with current code and newer build docs, verify the current implementation rather than repeating the old status.

## Evidence on Hand

- `llms.txt`: repository index, tooling, source-of-truth pointers and documented implementation status.
- `document/glossary.md`: domain definitions, data relationships and the development loop.
- `document/set-up-build.md`, `document/my-career-build.md`, `document/my-actions-build.md`, `document/my-assessment-build.md` and `document/records-build.md`: feature decisions and open questions.
- `document/market-research.md`: market research, not proof of Enpath outcomes.
- `enpath-ui/`: component implementation, Storybook stories and mock-data prototype.
- `Tokens/` and `Machine Readable/`: existing design-system tokens and component specifications.
- Original PRDs are referenced as residing outside this repository in the Obsidian vault. They were not inspected during init.
- Mock people, companies and scores are demonstration content, not customer evidence. Do not turn them into testimonials, adoption figures or validated outcomes.

## Product Principles

1. Preserve employee agency: distinguish a personal target from an official role or an approval-dependent change.
2. Make development actionable: connect targets, approved assessments, growth areas and planned work.
3. Keep information trustworthy: distinguish approved scores, AI suggestions, missing data, actions and records.
4. Let people retain authority over AI proposals and consequential decisions.
5. Respect the person behind the information: explain facts without ranking people or framing a score as a personal judgment.

## Open Decisions

- Any product-wide priority among employee, manager and admin audiences.
- Required UI languages and localization scope.
- Priority devices and supported viewport/browser requirements.
- A product-specific accessibility standard or additional inclusion requirements.
- Production deployment, persistence, integrations, security and compliance requirements beyond the documented prototype and domain constraints.
