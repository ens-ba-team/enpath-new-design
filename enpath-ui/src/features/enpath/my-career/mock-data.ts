// My Career mock data — Lan Nguyen's career plan (employee view).
// Positions and Levels come from Setup's mock (initialPositions), so names, level labels and
// expectation counts stay in one place. Company paths, the current role and Lan's saved plan stand
// in for Setup's published Career Paths, Employee Mapping and a saved plan — none exist yet.
//
// The map is derived from the plan (buildMap), never stored: current role → the company path Lan
// follows → added company paths and Career visions → the Active target. A step's id is its levelId,
// so a Position-Level can appear on the map only once.

import type { CareerMapNodeState, CareerMapPath } from '@/components/ui/career-map';
import { initialMatrices, initialPositions, levelLabel, scale } from '../mock-data';

export const employee = { name: 'Lan Nguyen', manager: 'Minh Tran', levelId: 'BE-L2' };

export interface CompanyPath extends CareerMapPath {
  /** Level ids in order */
  levels: string[];
}

/** Positions employees can see — Published in Setup (my career.md #16). */
export const publishedPositions = initialPositions.filter((p) => p.status === 'Published');
const isPublishedLevel = (levelId: string) => publishedPositions.some((p) => p.levels.some((l) => l.id === levelId));

/** Company Career Paths (colour = career-map/path-N). Employees only see a path when every
 *  position on it is published. */
const allCompanyPaths: CompanyPath[] = [
  { id: 'engineering-growth', name: 'Engineering growth', color: 1, levels: ['BE-L1', 'BE-L2', 'BE-L3', 'BE-L4'] },
  { id: 'engineering-to-product', name: 'Engineering to product', color: 2, levels: ['BE-L2', 'BE-L3', 'PM-L2', 'PM-L3'] },
  { id: 'design-craft', name: 'Design craft', color: 3, levels: ['PD-L1', 'PD-L2', 'PD-L3'] },
];

export const companyPaths = allCompanyPaths.filter((p) => p.levels.every(isPublishedLevel));

/** Company paths planned for the employee's current role — the ones they can follow. */
export const matchingPaths = companyPaths.filter((p) => p.levels.includes(employee.levelId));

/** A role Lan added from a card: a move on a company path planned for Lan's role (Planned, no
 *  approval), or a role in a Career vision (needs the manager's approval to become the target). */
export type Branch =
  | { kind: 'path'; pathId: string; from: string; to: string }
  | { kind: 'vision'; vision: number; from: string; to: string };

/** Decide what a move becomes: on a company path planned for Lan's role (both roles on it, in order)
 *  it's a company-path step; anything else is a Career vision. Only matching paths count — so a
 *  role outside Lan's paths can never skip the manager's approval. */
export function classifyMove(from: string, to: string): { kind: 'path'; path: CompanyPath } | { kind: 'vision' } {
  const path = matchingPaths.find((p) => p.levels.includes(from) && p.levels.indexOf(to) > p.levels.indexOf(from));
  return path ? { kind: 'path', path } : { kind: 'vision' };
}

/** Explore a Position: its ladder from the entry level, as chained branches from a card. On a
 *  company path planned for Lan's role it's Planned steps (as far as the path goes); anything else
 *  is Career vision `vision`. `ladder` is the levels to add, in order, already minus ones on the map. */
export function ladderMove(from: string, ladder: string[], vision: number) {
  if (ladder.length === 0) return null;
  const move = classifyMove(from, ladder[0]);
  const levels = move.kind === 'path'
    ? ladder.slice(0, ladder.findIndex((id) => !move.path.levels.includes(id)) === -1 ? ladder.length : ladder.findIndex((id) => !move.path.levels.includes(id)))
    : ladder;
  const branches: Branch[] = levels.map((to, i) => {
    const prev = i === 0 ? from : levels[i - 1];
    return move.kind === 'path' ? { kind: 'path', pathId: move.path.id, from: prev, to } : { kind: 'vision', vision, from: prev, to };
  });
  return { branches, levels, path: move.kind === 'path' ? move.path : undefined };
}

export interface Plan {
  /** The company path the employee follows (the top row) — null when they stop following (my career.md #12) */
  followedPathId: string | null;
  /** The Active target — null when the employee has removed it (my career.md #13) */
  targetId: string | null;
  branches: Branch[];
}

export const initialPlan: Plan = {
  followedPathId: 'engineering-growth',
  targetId: 'BE-L3',
  branches: [
    { kind: 'vision', vision: 1, from: 'BE-L2', to: 'PD-L1' },
    { kind: 'vision', vision: 1, from: 'PD-L1', to: 'PD-L2' },
  ],
};

export interface PlanStep {
  id: string;
  positionId: string;
  levelId: string;
  state: CareerMapNodeState;
  /** Career vision number, for vision steps */
  vision?: number;
  /** The branch that added this step (undefined for the current role and the followed path) */
  branch?: number;
  /** Map row: 0 = the company path Lan follows; each Career vision, then each added path, below */
  lane: number;
}

export interface PlanLink {
  from: string;
  to: string;
  /** Route id: a company path id, or visionRouteId(n) for Career vision n */
  route: string;
}

export const visionRouteId = (n: number) => `vision-${n}`;

export const positionOfLevel = (levelId: string) => initialPositions.find((p) => p.levels.some((l) => l.id === levelId))!;

/** Derive the map from the plan. Steps already on the map are linked to, never duplicated.
 *  Row 0 is the followed company path in full: earlier levels Completed, then You are here, then
 *  Planned. Each Career vision gets its own row below, then each added company path. */
export function buildMap(plan: Plan) {
  const steps = new Map<string, PlanStep>();
  const links: PlanLink[] = [];
  const link = (l: PlanLink) => { if (!links.some((x) => x.from === l.from && x.to === l.to)) links.push(l); };
  const add = (levelId: string, state: CareerMapNodeState, lane: number, extra: Partial<PlanStep> = {}) => {
    if (!steps.has(levelId)) steps.set(levelId, { id: levelId, positionId: positionOfLevel(levelId).id, levelId, state, lane, ...extra });
  };
  const walk = (path: CompanyPath, from: string, startIndex: number, lane: number, branch?: number) => {
    let prev = from;
    for (const levelId of path.levels.slice(startIndex)) {
      add(levelId, 'planned', lane, { branch });
      link({ from: prev, to: levelId, route: path.id });
      prev = levelId;
    }
  };
  const followed = companyPaths.find((p) => p.id === plan.followedPathId);
  const here = followed ? followed.levels.indexOf(employee.levelId) : -1;
  if (followed && here > 0) {
    followed.levels.slice(0, here).forEach((levelId, i, done) => {
      add(levelId, 'completed', 0);
      if (i > 0) link({ from: done[i - 1], to: levelId, route: followed.id });
    });
    link({ from: followed.levels[here - 1], to: employee.levelId, route: followed.id });
  }
  add(employee.levelId, 'current', 0);
  if (followed) walk(followed, employee.levelId, here + 1, 0);
  const visions = visionNumbers(plan);
  let pathLane = visions.length + 1;
  plan.branches.forEach((b, i) => {
    if (!steps.has(b.from)) return; // its starting card was removed
    if (b.kind === 'path') {
      add(b.to, 'planned', pathLane++, { branch: i });
      link({ from: b.from, to: b.to, route: b.pathId });
    } else {
      add(b.to, 'vision', visions.indexOf(b.vision) + 1, { vision: b.vision, branch: i });
      link({ from: b.from, to: b.to, route: visionRouteId(b.vision) });
    }
  });
  const target = plan.targetId ? steps.get(plan.targetId) : undefined;
  if (target && target.state !== 'current' && target.state !== 'completed') target.state = 'target';
  return { steps: [...steps.values()], links };
}

/** A Career vision's roles in order, starting from the card it branches off. */
export function visionRoute(plan: Plan, vision: number): string[] {
  const own = plan.branches.filter((b): b is Extract<Branch, { kind: 'vision' }> => b.kind === 'vision' && b.vision === vision);
  if (own.length === 0) return [];
  const anchor = own.find((b) => !own.some((o) => o.to === b.from))!.from;
  const route = [anchor];
  let next = own.find((b) => b.from === anchor);
  while (next) { route.push(next.to); const at = next.to; next = own.find((b) => b.from === at); }
  return route;
}

export const visionNumbers = (plan: Plan) =>
  [...new Set(plan.branches.flatMap((b) => (b.kind === 'vision' ? [b.vision] : [])))].sort((a, b) => a - b);

/** Remove a branch and every branch that started from a card it added. */
export function removeBranch(plan: Plan, index: number): Plan {
  const before = new Set(buildMap(plan).steps.map((s) => s.id));
  const next = { ...plan, branches: plan.branches.filter((_, i) => i !== index) };
  const after = new Set(buildMap(next).steps.map((s) => s.id));
  const gone = [...before].filter((id) => !after.has(id));
  return { ...next, branches: next.branches.filter((b) => !gone.includes(b.from)) };
}

/** Position name, level label and expectation coverage for one plan step. */
export function describeStep(step: PlanStep) {
  const position = initialPositions.find((p) => p.id === step.positionId)!;
  const level = position.levels.find((l) => l.id === step.levelId)!;
  const cells = Object.values(position.expectations).map((row) => row[level.id]);
  return {
    title: position.name,
    level: levelLabel(position.levels, level),
    expectationsSet: cells.filter((v) => v != null).length,
    expectationsTotal: cells.length,
  };
}

// ─── Evidence and gaps ───────────────────────────────────────────────────────
// Lan's assessed point per competency, from acknowledged Records (stands in for Records, PRD-021).
// A competency with no entry has no evidence yet — shown as "Needs evidence", never as a gap.

export interface Evidence { point: number; source: string }

export const evidence: Record<string, Evidence> = {
  sys: { point: 3, source: 'Payments service design review' },
  code: { point: 3, source: 'Code review feedback, Q3' },
  deliv: { point: 3, source: 'Checkout migration, shipped on time' },
  ment: { point: 2, source: 'Onboarded one new engineer' },
  res: { point: 2, source: 'Onboarding interviews with the design team' },
};

export const recordCount = Object.keys(evidence).length;

export type GapStatus = 'ready' | 'growth' | 'evidence' | 'unset';

export interface Gap {
  id: string;
  name: string;
  /** Lan's assessed point, or null when there is no evidence yet */
  current: number | null;
  /** The level's expectation, or null when Setup hasn't set one */
  required: number | null;
  status: GapStatus;
  /** What the required point looks like in practice (the Matrix's behavior text) */
  meaning?: string;
  /** The record Lan's assessed point comes from */
  source?: string;
}

/** "3 · Intermediate" — a rating-scale point, never "L3" (that's a Position level). */
export const pointLabel = (n: number) => `${n} · ${scale[n - 1]}`;

/** Every competency of the step's Matrix, compared with Lan's evidence. */
export function gapsFor(step: PlanStep): Gap[] {
  const position = initialPositions.find((p) => p.id === step.positionId)!;
  const matrix = initialMatrices.find((m) => m.id === position.matrixId)!;
  return matrix.competencies.map((c) => {
    const required = position.expectations[c.id]?.[step.levelId] ?? null;
    const current = evidence[c.id]?.point ?? null;
    const status: GapStatus = required == null ? 'unset' : current == null ? 'evidence' : current >= required ? 'ready' : 'growth';
    const meaning = required != null ? c.behaviors[required - 1]?.description : undefined;
    return { id: c.id, name: c.name, current, required, status, meaning, source: evidence[c.id]?.source };
  });
}

export function countGaps(gaps: Gap[]) {
  return {
    ready: gaps.filter((g) => g.status === 'ready').length,
    growth: gaps.filter((g) => g.status === 'growth').length,
    evidence: gaps.filter((g) => g.status === 'evidence').length,
    unset: gaps.filter((g) => g.status === 'unset').length,
  };
}

// ─── Career vision request ───────────────────────────────────────────────────
// Lan can draft any number of Career visions; only one can be sent to the manager at a time.
// Approval agrees on a direction only — the official role stays with the admin.

export type VisionStatus = 'waiting' | 'approved' | 'declined';

export interface VisionRequest {
  vision: number;
  status: VisionStatus;
  /** Employee's optional note to the manager */
  note: string;
  /** Manager's note — required when declining */
  managerNote: string;
}

/** Remove Career vision n and everything added from its cards (other visions' branches included). */
export function removeVision(plan: Plan, n: number): Plan {
  const next = { ...plan, branches: plan.branches.filter((b) => !(b.kind === 'vision' && b.vision === n)) };
  const kept = new Set(buildMap(next).steps.map((s) => s.id));
  return { ...next, branches: next.branches.filter((b) => kept.has(b.from)) };
}
