// My Actions — mock data (Lan Nguyen). Spec: document/my-actions-build.md (repo root).
// Growth areas come from the same comparison My Career uses (gapsForLevel): Lan's assessed points
// vs the Active target's expectations. Each Action serves one growth area and has a due date.
// Actions and Records are separate pages (2026-09-30): a Done Action is just done, and records carry
// no competency, so this page doesn't count or link them. AI reads both at Assessment.
//
// PROTOTYPE ASSUMPTION: the Active target is Frontend Engineer L3 (it replaced Backend Engineer L3
// on Lan's company path on 27 Sep). My Career's own mock starts with no target; the two pages keep
// separate state until a shared store exists.

import { gapsForLevel, pointLabel, type Gap } from '../my-career/mock-data';
import { levelName } from '../my-career/plan-dialogs';

export const TODAY = '2026-09-30';
export const targetLevelId = 'FE-L3';
export const targetName = levelName(targetLevelId);

export type ActionStatus = 'todo' | 'doing' | 'done';
/** Who put the action in the plan: the employee, a manager's proposal, or an accepted AI proposal. */
export type ActionSource = 'you' | 'manager' | 'ai';

export interface Action {
  id: string;
  title: string;
  /** The growth area (competency) it serves */
  competencyId: string;
  status: ActionStatus;
  /** ISO date */
  due: string;
  /** What finishing it should show */
  outcome: string;
  source: ActionSource;
  /** ISO date it joined the plan */
  added: string;
  /** ISO date it was marked done */
  doneOn?: string;
}

/** An AI suggestion that is not in the plan until someone presses Add to plan. */
export interface Proposal {
  id: string;
  title: string;
  competencyId: string;
  outcome: string;
}

/** Growth areas for the Active target: competencies where Lan's approved point is below what's needed. */
export const growthAreas: Gap[] = gapsForLevel(targetLevelId).filter((g) => g.status === 'growth');

export const initialActions: Action[] = [
  { id: 'a1', title: 'Lead code reviews for the checkout service', competencyId: 'code', status: 'todo', due: '2026-10-24',
    outcome: 'Review every checkout pull request for two sprints and write down the patterns you ask for most', source: 'you', added: '2026-09-18' },
  { id: 'a2', title: 'Pair on the lint rules for the design system repo', competencyId: 'code', status: 'todo', due: '2026-10-31',
    outcome: 'Agree the rules with the team and turn them on in CI', source: 'manager', added: '2026-09-22' },
  { id: 'a3', title: 'Split the search migration into weekly releases', competencyId: 'deliv', status: 'doing', due: '2026-09-26',
    outcome: 'Ship the migration in small steps with no rollback', source: 'you', added: '2026-09-02' },
  { id: 'a4', title: 'Run the delivery retro for the Q3 release', competencyId: 'deliv', status: 'done', due: '2026-09-15',
    outcome: 'Agree two changes the team will try next quarter', source: 'manager', added: '2026-08-28', doneOn: '2026-09-12' },
];

export const initialProposals: Proposal[] = [
  { id: 'p1', title: 'Write a short guide to readable pull requests', competencyId: 'code',
    outcome: 'A one-page guide the team links in reviews' },
  { id: 'p2', title: 'Pair with a new joiner on their first three tickets', competencyId: 'ment',
    outcome: 'The new joiner ships their first change without help on the third ticket' },
];


export const statusLabel: Record<ActionStatus, string> = { todo: 'To do', doing: 'In progress', done: 'Done' };
/** Rows sort by status: the work in hand first. */
export const statusOrder: Record<ActionStatus, number> = { doing: 0, todo: 1, done: 2 };
export const sourceLabel: Record<ActionSource, string> = { you: 'added by you', manager: 'proposed by your manager', ai: 'from an AI proposal' };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "11 Oct" — fixed format so the server and browser render the same text. */
export function shortDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}
export function isoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
export const isOverdue = (a: Action) => a.status !== 'done' && a.due < TODAY;

/** "You 3 → Needed 4" for a growth area heading. */
export const pointsLine = (g: Gap) => `You ${g.current} → Needed ${g.required}`;
export const neededLabel = (g: Gap) => pointLabel(g.required!);
