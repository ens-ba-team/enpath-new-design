// My Career mock data — Lan Nguyen's career plan (employee view).
// Positions and Levels come from Setup's mock (initialPositions), so names, level labels and
// expectation counts stay in one place. The plan itself (current role, target, company paths,
// Career vision) stands in for Employee Mapping + Setup's published Career Paths + the
// employee's saved plan, none of which exist in the prototype yet.

import type { CareerMapNodeState, CareerMapPath } from '@/components/ui/career-map';
import { initialPositions, levelLabel } from '../mock-data';

export interface PlanStep {
  id: string;
  positionId: string;
  levelId: string;
  state: CareerMapNodeState;
}

export interface PlanLink {
  from: string;
  to: string;
  /** Company Career Path id; omitted for a Career vision link. */
  pathId?: string;
}

export const employee = { name: 'Lan Nguyen', manager: 'Minh Tran' };

export const companyPaths: CareerMapPath[] = [
  { id: 'engineering-growth', name: 'Engineering growth', color: 1 },
  { id: 'engineering-to-product', name: 'Engineering to product', color: 2 },
];

export const planSteps: PlanStep[] = [
  { id: 'be-2', positionId: 'be', levelId: 'BE-L2', state: 'current' },
  { id: 'be-3', positionId: 'be', levelId: 'BE-L3', state: 'target' },
  { id: 'be-4', positionId: 'be', levelId: 'BE-L4', state: 'planned' },
  { id: 'pm-2', positionId: 'pm', levelId: 'PM-L2', state: 'planned' },
  { id: 'pd-1', positionId: 'pd', levelId: 'PD-L1', state: 'vision' },
  { id: 'pd-2', positionId: 'pd', levelId: 'PD-L2', state: 'vision' },
];

export const planLinks: PlanLink[] = [
  { from: 'be-2', to: 'be-3', pathId: 'engineering-growth' },
  { from: 'be-3', to: 'be-4', pathId: 'engineering-growth' },
  { from: 'be-3', to: 'pm-2', pathId: 'engineering-to-product' },
  { from: 'be-2', to: 'pd-1' },
  { from: 'pd-1', to: 'pd-2' },
];

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
