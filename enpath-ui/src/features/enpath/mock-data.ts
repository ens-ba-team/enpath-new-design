// Enpath prototype mock data — shape from document/dev-logic.md §4, content from the Northstar example.
// In memory only: a refresh resets everything.

/** Draft = editable, not visible to employees · Published = live and read-only — Unpublish is the only way back to Draft (Lattice's model) */
export type Status = 'Draft' | 'Published';

/**
 * A Matrix has a 3rd state Positions don't (dev-logic.md §2): Draft (editable) → Active (read-only,
 * live) → Archived (read-only, restorable). There's no direct Active → Draft — Archive, then Restore.
 */
export type MatrixStatus = 'Draft' | 'Active' | 'Archived';

/** title + description, per dev-logic.md's ObservableBehavior — title defaults to the scale name but is editable per competency, not shared */
export interface Behavior { title: string; description: string }
/** behaviors[i] = what scale level i+1 looks like for this competency; null = not written yet */
export interface Competency { id: string; name: string; description: string; behaviors: (Behavior | null)[] }
export interface Matrix {
  id: string; name: string; description: string; status: MatrixStatus;
  /** Stable identity across revisions; Positions point to one concrete version by id. */
  familyId: string; version: number; previousVersionId?: string;
  /** number of scale points this Matrix uses, 2–5 — editable while Draft */
  scaleSize: number;
  owners: string[]; competencies: Competency[];
  changes: number; editedBy: string; editedAt: string; history: HistoryEntry[];
}
/** headcount = people mapped to this Level (from Employee Mapping) */
/** name has no "L1 ·" prefix — the number comes from the order (see levelLabel). */
export interface Level { id: string; name: string; headcount: number }
/** expectations[competencyId][levelId] = scale level 1–5, or null = Not set */
export type Expectations = Record<string, Record<string, number | null>>;
export interface HistoryEntry { who: string; what: string; when: string }
export interface Position {
  id: string; name: string; code: string; description?: string; status: Status; matrixId: string;
  /** admin-chosen, not pulled from ID Service — groups the explorer */
  department: string;
  levels: Level[]; expectations: Expectations;
  /** edits since the last publish (or since creation, for a Draft) */
  changes: number; editedBy: string; editedAt: string; history: HistoryEntry[];
}
export type CareerPathStatus = 'Draft' | 'Active' | 'Archived';
export interface CareerPathNode { id: string; positionId: string; levelId: string }
export interface CareerPath {
  id: string; name: string; description: string; status: CareerPathStatus;
  owner: string; nodes: CareerPathNode[]; changes: number; editedBy: string; editedAt: string; history: HistoryEntry[];
}

/** Fixed list for the mock — a real build would likely source this from ID Service. */
export const departments = ['Engineering', 'Product', 'Design', 'Operations', 'Other'];

export const scale = ['Awareness', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

/** Full behaviors for every scale point, 1..scale.length — used for Matrices that are Active. Title defaults to the scale name. */
const behaviorsFor = (name: string): (Behavior | null)[] => [
  { title: scale[0], description: `Aware of ${name} concepts; needs close guidance to apply them.` },
  { title: scale[1], description: `Applies ${name} on familiar tasks with occasional support.` },
  { title: scale[2], description: `Applies ${name} independently in typical situations.` },
  { title: scale[3], description: `Leads ${name} decisions across a team or system.` },
  { title: scale[4], description: `Sets direction for ${name}; recognized as the expert others turn to.` },
];

export const initialMatrices: Matrix[] = [
  { id: 'eng', name: 'Northstar Engineering', description: 'Core engineering craft, shared by every engineering position.',
    familyId: 'eng', version: 1, status: 'Active', scaleSize: 5, owners: ['Minh Tran'], changes: 0, editedBy: 'Minh Tran', editedAt: '2 weeks ago',
    history: [{ who: 'Minh Tran', what: 'Published', when: '9 Sep 2026, 10:00' }],
    competencies: [
      { id: 'sys', name: 'System design', description: 'Designs systems that meet scale, reliability and cost needs.', behaviors: behaviorsFor('system design') },
      { id: 'code', name: 'Code quality', description: 'Writes and reviews code that is correct, readable and maintainable.', behaviors: behaviorsFor('code quality') },
      { id: 'test', name: 'Testing', description: 'Builds confidence in changes through the right tests at the right level.', behaviors: behaviorsFor('testing') },
      { id: 'deliv', name: 'Delivery', description: 'Ships reliably and predictably, in small safe steps.', behaviors: behaviorsFor('delivery') },
      { id: 'comm', name: 'Communication', description: 'Explains technical decisions clearly to technical and non-technical audiences.', behaviors: behaviorsFor('communication') },
      { id: 'ment', name: 'Mentoring', description: 'Grows the skills of the engineers around them.', behaviors: behaviorsFor('mentoring') },
    ] },
  { id: 'prod', name: 'Northstar Product', description: 'Product craft for PMs driving discovery through execution.',
    familyId: 'prod', version: 1, status: 'Draft', scaleSize: 5, owners: [], changes: 2, editedBy: 'Lan Nguyen', editedAt: '3 days ago',
    history: [{ who: 'Lan Nguyen', what: 'Created matrix', when: '18 Sep 2026, 09:00' }],
    competencies: [
      { id: 'disc', name: 'Discovery', description: 'Finds and validates the right problem to solve.', behaviors: [null, null, null, null, null] },
      { id: 'strat', name: 'Product strategy', description: 'Connects product bets to company strategy.', behaviors: [null, null, null, null, null] },
      { id: 'exec', name: 'Execution', description: 'Drives a product from idea to shipped outcome.', behaviors: [null, null, null, null, null] },
      { id: 'data', name: 'Data literacy', description: 'Uses data to make and defend product decisions.', behaviors: [null, null, null, null, null] },
      { id: 'stake', name: 'Stakeholder management', description: 'Aligns stakeholders around a shared product direction.', behaviors: [null, null, null, null, null] },
    ] },
  { id: 'des', name: 'Northstar Design', description: 'Design craft, from visual craft to systems thinking.',
    familyId: 'des', version: 1, status: 'Active', scaleSize: 5, owners: ['Lan Nguyen'], changes: 0, editedBy: 'Lan Nguyen', editedAt: '1 month ago',
    history: [{ who: 'Lan Nguyen', what: 'Published', when: '20 Aug 2026, 14:00' }],
    competencies: [
      { id: 'craft', name: 'Visual craft', description: 'Produces polished, on-brand visual design.', behaviors: behaviorsFor('visual craft') },
      { id: 'ix', name: 'Interaction design', description: 'Designs flows and interactions that are easy to use.', behaviors: behaviorsFor('interaction design') },
      { id: 'res', name: 'Research', description: 'Runs research that changes what gets built.', behaviors: behaviorsFor('research') },
      { id: 'sys-d', name: 'Design systems', description: 'Builds and maintains reusable design system components.', behaviors: behaviorsFor('design systems') },
      { id: 'collab', name: 'Collaboration', description: 'Works effectively with engineering and product partners.', behaviors: behaviorsFor('collaboration') },
    ] },
];

const levelSet = (code: string, names: string[], heads: number[]): Level[] => names.map((n, i) => ({ id: `${code}-L${i + 1}`, name: n, headcount: heads[i] ?? 0 }));

/** Build expectations from rows of values (one row per competency, one value per level). */
function grid(matrixId: string, levels: Level[], rows: (number | null)[][]): Expectations {
  const m = initialMatrices.find((x) => x.id === matrixId)!;
  return Object.fromEntries(m.competencies.map((c, r) => [c.id, Object.fromEntries(levels.map((l, i) => [l.id, rows[r]?.[i] ?? null]))]));
}

const be = levelSet('BE', ['Junior', 'Mid', 'Senior', 'Staff'], [6, 9, 4, 0]);
const fe = levelSet('FE', ['Junior', 'Mid', 'Senior', 'Staff'], [5, 7, 3, 1]);
const pd = levelSet('PD', ['Designer', 'Senior', 'Lead'], [4, 2, 1]);
const pm = levelSet('PM', ['Associate', 'PM', 'Senior'], [0, 0, 0]);
const qa = levelSet('QA', ['Junior', 'Mid', 'Senior'], [2, 3, 1]);

export const initialPositions: Position[] = [
  { id: 'be', changes: 3, name: 'Backend Engineer', code: 'BE', status: 'Draft', matrixId: 'eng', department: 'Engineering', levels: be,
    expectations: grid('eng', be, [[1, 2, 3, 4], [2, 3, 4, 4], [1, 2, 3, null], [2, 3, 3, 4], [1, 2, 3, 5], [null, 1, 3, 4]]),
    editedBy: 'Lan Nguyen', editedAt: '10 min ago',
    history: [{ who: 'Lan Nguyen', what: 'Edited 3 expectations', when: 'Today, 09:42' }, { who: 'Minh Tran', what: 'Created position', when: '18 Sep 2026, 14:05' }] },
  { id: 'fe', changes: 0, name: 'Frontend Engineer', code: 'FE', status: 'Published', matrixId: 'eng', department: 'Engineering', levels: fe,
    expectations: grid('eng', fe, [[1, 2, 3, 4], [2, 3, 4, 5], [1, 2, 3, 4], [2, 3, 4, 4], [2, 2, 3, 4], [1, 1, 3, 4]]),
    editedBy: 'Minh Tran', editedAt: '2 days ago',
    history: [{ who: 'Minh Tran', what: 'Published', when: '20 Sep 2026, 16:20' }, { who: 'Minh Tran', what: 'Created position', when: '15 Sep 2026, 10:11' }] },
  { id: 'pd', changes: 0, name: 'Product Designer', code: 'PD', status: 'Published', matrixId: 'des', department: 'Design', levels: pd,
    expectations: grid('des', pd, [[2, 3, 4], [2, 3, 4], [1, 3, 4], [1, 2, 4], [2, 3, 5]]),
    editedBy: 'Lan Nguyen', editedAt: '1 week ago',
    history: [{ who: 'Lan Nguyen', what: 'Published', when: '14 Sep 2026, 11:02' }] },
  { id: 'pm', changes: 5, name: 'Product Manager', code: 'PM', status: 'Draft', matrixId: 'prod', department: 'Product', levels: pm,
    expectations: grid('prod', pm, [[2, 3, null], [1, 2, null], [2, 3, 4], [null, null, null], [1, 3, 4]]),
    editedBy: 'Lan Nguyen', editedAt: 'yesterday',
    history: [{ who: 'Lan Nguyen', what: 'Created position', when: '21 Sep 2026, 15:30' }] },
  { id: 'qa', changes: 0, name: 'QA Engineer', code: 'QA', status: 'Published', matrixId: 'eng', department: 'Engineering', levels: qa,
    expectations: grid('eng', qa, [[1, 2, 3], [2, 3, 4], [2, 3, 4], [2, 3, 3], [1, 2, 3], [null, 1, 2]]),
    editedBy: 'Minh Tran', editedAt: '3 weeks ago',
    history: [{ who: 'Minh Tran', what: 'Published', when: '1 Sep 2026, 09:15' }] },
];

export const initialCareerPaths: CareerPath[] = [
  { id: 'engineering-growth', name: 'Engineering growth', description: 'A progression from backend engineering into technical leadership.', status: 'Draft', owner: 'Lan Nguyen', changes: 2, editedBy: 'Lan Nguyen', editedAt: 'yesterday',
    nodes: [{ id: 'cpn-1', positionId: 'be', levelId: 'BE-L1' }, { id: 'cpn-2', positionId: 'be', levelId: 'BE-L2' }, { id: 'cpn-3', positionId: 'be', levelId: 'BE-L3' }, { id: 'cpn-4', positionId: 'pm', levelId: 'PM-L2' }],
    history: [{ who: 'Lan Nguyen', what: 'Created path', when: '21 Sep 2026, 15:40' }] },
  { id: 'design-leadership', name: 'Design leadership', description: 'The individual-contributor path into design leadership.', status: 'Active', owner: 'Minh Tran', changes: 0, editedBy: 'Minh Tran', editedAt: '2 weeks ago',
    nodes: [{ id: 'cpn-5', positionId: 'pd', levelId: 'PD-L1' }, { id: 'cpn-6', positionId: 'pd', levelId: 'PD-L2' }, { id: 'cpn-7', positionId: 'pd', levelId: 'PD-L3' }],
    history: [{ who: 'Minh Tran', what: 'Activated path', when: '9 Sep 2026, 10:20' }] },
  { id: 'legacy-path', name: 'Legacy operations path', description: 'Previous Operations progression kept for reference.', status: 'Archived', owner: 'Lan Nguyen', changes: 0, editedBy: 'Lan Nguyen', editedAt: '1 month ago',
    nodes: [{ id: 'cpn-8', positionId: 'qa', levelId: 'QA-L1' }, { id: 'cpn-9', positionId: 'qa', levelId: 'QA-L2' }],
    history: [{ who: 'Lan Nguyen', what: 'Archived path', when: '20 Aug 2026, 14:00' }] },
];

/** "L2 · Mid" — the number is the Level's position in the order, so reordering renumbers. */
export const levelLabel = (levels: Level[], l: Level) => `L${levels.indexOf(l) + 1} · ${l.name}`;
