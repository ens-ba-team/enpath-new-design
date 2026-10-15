// Records mock data — what Lan Nguyen sees on the Records page. Spec: document/records-build.md.
// One entry = one record = PRD-023's "feedback item": exactly one recipient, a source title (the
// Record it was created under) and its own acknowledgement flow. Status is derived (statusOf),
// never stored. Lan's manager (Hà Phạm) and Lan's direct reports (An Trần, Bình Hồ, Chi Phan, so the
// My team tab has rows) stand in for Directory reporting lines, which don't exist yet.

export const TODAY = '2026-10-15';

export interface Person { id: string; name: string; initials: string; email?: string }

export const people: Record<string, Person> = {
  lan: { id: 'lan', name: 'Lan Nguyen', initials: 'LN', email: 'lan.nguyen@enpath.io' },
  ha: { id: 'ha', name: 'Hà Phạm', initials: 'HP', email: 'ha.pham@enpath.io' },
  tuyen: { id: 'tuyen', name: 'Tuyền Trần', initials: 'TT', email: 'tuyen.tran@enpath.io' },
  minh: { id: 'minh', name: 'Minh Lê', initials: 'ML', email: 'minh.le@enpath.io' },
  diep: { id: 'diep', name: 'Diệp Vũ', initials: 'DV', email: 'diep.vu@enpath.io' },
  an: { id: 'an', name: 'An Trần', initials: 'AT', email: 'an.tran@enpath.io' },
  quan: { id: 'quan', name: 'Quân Đỗ', initials: 'QĐ', email: 'quan.do@enpath.io' },
  thao: { id: 'thao', name: 'Thảo Ngô', initials: 'TN', email: 'thao.ngo@enpath.io' },
  binh: { id: 'binh', name: 'Bình Hồ', initials: 'BH', email: 'binh.ho@enpath.io' },
  chi: { id: 'chi', name: 'Chi Phan', initials: 'CP', email: 'chi.phan@enpath.io' },
  minhho: { id: 'minhho', name: 'Minh Hồ', initials: 'MH', email: 'minh.ho@enpath.io' },
};

/** The signed-in employee. */
export const ME = 'lan';

/** A person's name, or "No recipient yet" for a draft without one. */
export const nameOf = (id: string) => people[id]?.name ?? 'No recipient yet';

/** A draft can be submitted once it has a recipient and some content. */
export const isComplete = (r: RecordItem) => r.recipientId !== '' && r.content.trim() !== '';

/** Each person's line manager (Directory). Recorded on the record when it is submitted. */
export const managerOf: Record<string, string> = {
  lan: 'ha', an: 'lan', binh: 'lan', chi: 'lan', minhho: 'tuyen', minh: 'ha', diep: 'tuyen', tuyen: 'ha', quan: 'tuyen', thao: 'ha',
};

export interface Ack { at: string; auto?: boolean }
export interface SourceRef { file: string; page?: number; quote?: string }
export interface Correction { by: string; at: string; note: string; open: boolean }
export interface HistoryEntry { who: string; what: string; when: string }

export interface RecordItem {
  id: string;
  /** The Record (container) it belongs to: one Create record = one recordId, one item per person */
  recordId: string;
  /** Title of the Record it was created under */
  title: string;
  content: string;
  creatorId: string;
  /** '' = no recipient yet (a draft may have none, PRD-023 BR-20) */
  recipientId: string;
  /** Drafted by AI from files; shown as "AI draft" until it is sent (PRD-023 RQ-03) */
  aiDraft?: boolean;
  /** Where an AI draft came from */
  source?: SourceRef;
  /** Recipient's manager, recorded at submission */
  managerId?: string;
  created: string;
  submitted?: string;
  ackRecipient?: Ack;
  ackManager?: Ack;
  corrections: Correction[];
  history: HistoryEntry[];
}

export type Status = 'draft' | 'awaiting' | 'partial' | 'correction' | 'acknowledged';

export function statusOf(r: RecordItem): Status {
  if (!r.submitted) return 'draft';
  if (r.corrections.some((c) => c.open)) return 'correction';
  if (r.ackRecipient && r.ackManager) return 'acknowledged';
  if (r.ackRecipient || r.ackManager) return 'partial';
  return 'awaiting';
}

/** "14 Oct" (this year) or "14 Oct 2025". */
export function shortDate(iso: string) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  const sameYear = iso.slice(0, 4) === TODAY.slice(0, 4);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) });
}

/** "14 Oct, 15:32" when the entry has a time. */
export function dateTime(iso: string) {
  const time = iso.length > 10 ? iso.slice(11, 16) : '';
  return time ? `${shortDate(iso)}, ${time}` : shortDate(iso);
}

export const initialRecords: RecordItem[] = [
  {
    id: 'r1', recordId: 'rec-enpath', title: 'En-path design review', content: 'The new career map screens were easy to follow, and you explained every trade-off in the review.',
    creatorId: 'tuyen', recipientId: 'lan', managerId: 'ha', created: '2026-10-14T15:21', submitted: '2026-10-14T15:33',
    corrections: [],
    history: [{ who: 'Tuyền Trần', what: 'Submitted', when: '14 Oct, 15:33' }],
  },
  {
    id: 'r2', recordId: 'rec-retro-quan', title: 'Sprint 14 retro', content: 'Ran the sprint demo clearly and answered every question from the business team.',
    creatorId: 'quan', recipientId: 'an', managerId: 'lan', created: '2026-10-13T10:02', submitted: '2026-10-13T10:05',
    ackRecipient: { at: '2026-10-13T16:40' }, corrections: [],
    history: [
      { who: 'Quân Đỗ', what: 'Submitted', when: '13 Oct, 10:05' },
      { who: 'An Trần', what: 'Acknowledged', when: '13 Oct, 16:40' },
    ],
  },
  {
    id: 'r3', recordId: 'rec-retro-thao', title: 'Sprint 14 retro', content: 'Paired with the new joiner every morning and wrote the onboarding notes for the payments module.',
    creatorId: 'thao', recipientId: 'an', managerId: 'lan', created: '2026-10-12T09:15', submitted: '2026-10-12T09:20',
    corrections: [],
    history: [{ who: 'Thảo Ngô', what: 'Submitted', when: '12 Oct, 09:20' }],
  },
  {
    id: 'r4', recordId: 'rec-collab', title: 'Collaboration feedback', content: 'Không tập thể dục, often joins stand-up late.',
    creatorId: 'lan', recipientId: 'tuyen', managerId: 'ha', created: '2026-10-14T13:53', submitted: '2026-10-14T13:58',
    corrections: [{ by: 'tuyen', at: '2026-10-14T15:32', note: 'Please give a specific example: which stand-ups, and what was the impact on the team?', open: true }],
    history: [
      { who: 'Lan Nguyen', what: 'Submitted', when: '14 Oct, 13:58' },
      { who: 'Tuyền Trần', what: 'Requested a correction', when: '14 Oct, 15:32' },
    ],
  },
  {
    id: 'r5', recordId: 'rec-q3', title: 'Q3 design review', content: 'Clear technical leadership: Minh split the migration into steps the whole team could follow.',
    creatorId: 'lan', recipientId: 'minh', created: '2026-10-15T09:10', corrections: [],
    history: [{ who: 'Lan Nguyen', what: 'Saved as draft', when: '15 Oct, 09:10' }],
  },
  {
    id: 'r6', recordId: 'rec-q3', title: 'Q3 design review', content: 'Strong stakeholder communication: kept the product team updated before every release.',
    creatorId: 'lan', recipientId: 'thao', managerId: 'ha', created: '2026-10-12T11:00', submitted: '2026-10-12T11:04',
    ackRecipient: { at: '2026-10-12T14:20' }, corrections: [],
    history: [
      { who: 'Lan Nguyen', what: 'Submitted', when: '12 Oct, 11:04' },
      { who: 'Thảo Ngô', what: 'Acknowledged', when: '12 Oct, 14:20' },
    ],
  },
  {
    id: 'r7', recordId: 'rec-incident', title: 'Checkout incident', content: 'Led the checkout incident call calmly and wrote the post-mortem the same day.',
    creatorId: 'minh', recipientId: 'lan', managerId: 'ha', created: '2026-10-02T17:30', submitted: '2026-10-02T17:31',
    ackRecipient: { at: '2026-10-03T09:12' }, ackManager: { at: '2026-10-03T11:45' }, corrections: [],
    history: [
      { who: 'Minh Lê', what: 'Submitted', when: '2 Oct, 17:31' },
      { who: 'Lan Nguyen', what: 'Acknowledged', when: '3 Oct, 09:12' },
      { who: 'Hà Phạm', what: 'Acknowledged', when: '3 Oct, 11:45' },
    ],
  },
  {
    id: 'r8', recordId: 'rec-notes', title: 'My Q3 notes', content: 'Shipped the export API ahead of schedule and documented it for the mobile team.',
    creatorId: 'lan', recipientId: 'lan', managerId: 'ha', created: '2026-10-08T18:00', submitted: '2026-10-08T18:02',
    ackRecipient: { at: '2026-10-08T18:02', auto: true }, corrections: [],
    history: [
      { who: 'Lan Nguyen', what: 'Submitted (acknowledged for you: you wrote it for yourself)', when: '8 Oct, 18:02' },
    ],
  },
  {
    id: 'r9', recordId: 'rec-api-diep', title: 'API review', content: 'Code reviews are thorough but arrive late in the sprint.',
    creatorId: 'diep', recipientId: 'lan', managerId: 'ha', created: '2026-10-09T10:00', submitted: '2026-10-09T10:01',
    corrections: [{ by: 'lan', at: '2026-10-09T15:10', note: 'Which sprint? I reviewed within a day in sprint 13.', open: true }],
    history: [
      { who: 'Diệp Vũ', what: 'Submitted', when: '9 Oct, 10:01' },
      { who: 'Lan Nguyen', what: 'Requested a correction', when: '9 Oct, 15:10' },
    ],
  },
  {
    id: 'r10', recordId: 'rec-oncall', title: 'October on-call', content: 'Took over the on-call rota without being asked when two people were out sick.',
    creatorId: 'minh', recipientId: 'binh', managerId: 'lan', created: '2026-10-11T08:40', submitted: '2026-10-11T08:42',
    ackRecipient: { at: '2026-10-11T12:05' }, corrections: [],
    history: [
      { who: 'Minh Lê', what: 'Submitted', when: '11 Oct, 08:42' },
      { who: 'Bình Hồ', what: 'Acknowledged', when: '11 Oct, 12:05' },
    ],
  },
  {
    id: 'r11', recordId: 'rec-api-lan', title: 'API review', content: 'Clear test plans for the export API: every edge case was listed before coding started.',
    creatorId: 'lan', recipientId: 'chi', managerId: 'lan', created: '2026-10-10T16:00', submitted: '2026-10-10T16:03',
    ackManager: { at: '2026-10-10T16:03', auto: true }, corrections: [],
    history: [{ who: 'Lan Nguyen', what: 'Submitted (acknowledged for you as Chi Phan’s manager)', when: '10 Oct, 16:03' }],
  },
  {
    id: 'r12', recordId: 'rec-q3-diep', title: 'Q3 design review', content: 'Design handoff notes were complete, so the build needed no follow-up questions.',
    creatorId: 'diep', recipientId: 'binh', managerId: 'lan', created: '2026-10-02T10:00', submitted: '2026-10-02T10:02',
    ackRecipient: { at: '2026-10-02T15:30' }, ackManager: { at: '2026-10-03T09:00' }, corrections: [],
    history: [
      { who: 'Diệp Vũ', what: 'Submitted', when: '2 Oct, 10:02' },
      { who: 'Bình Hồ', what: 'Acknowledged', when: '2 Oct, 15:30' },
      { who: 'Lan Nguyen', what: 'Acknowledged', when: '3 Oct, 09:00' },
    ],
  },
];

// ─── What Lan sees: her part in each record ──────────────────────────────────

export type Tab = 'mine' | 'team';
export type View = 'needs' | 'all' | 'sent' | 'about';
export type RowAction = 'acknowledge' | 'submit' | 'edit';

/** Lan's part in a submitted record that still waits for her: as the person, or as the manager. */
export function pendingRole(r: RecordItem): 'recipient' | 'manager' | undefined {
  const s = statusOf(r);
  if (s !== 'awaiting' && s !== 'partial') return undefined;
  if (r.recipientId === ME && !r.ackRecipient) return 'recipient';
  if (r.managerId === ME && !r.ackManager) return 'manager';
  return undefined;
}

/** The one thing Lan has to do on this record, if any. */
export function myAction(r: RecordItem): RowAction | undefined {
  if (pendingRole(r)) return 'acknowledge';
  const s = statusOf(r);
  if (s === 'correction' && r.creatorId === ME) return 'edit';
  if (s === 'draft' && r.creatorId === ME) return isComplete(r) ? 'submit' : 'edit';
  return undefined;
}

/** My records: what Lan wrote or what is about her. My team: submitted records about her reports
 *  (no permission rules yet: every record about a report shows, user 2026-10-15). */
export function inTab(r: RecordItem, t: Tab) {
  if (t === 'team') return !!r.submitted && r.recipientId !== ME && managerOf[r.recipientId] === ME;
  return r.creatorId === ME || r.recipientId === ME;
}

/** Needs you, per tab: My team only asks for the manager's acknowledgement. */
export function needsMe(r: RecordItem, t: Tab) {
  if (t === 'team') return pendingRole(r) === 'manager';
  return myAction(r) !== undefined && pendingRole(r) !== 'manager';
}

/** The action a row offers in this tab (My team: only the manager's Acknowledge). */
export function rowAction(r: RecordItem, t: Tab): RowAction | undefined {
  const role = pendingRole(r);
  if (t === 'team') return role === 'manager' ? 'acknowledge' : undefined;
  return role === 'manager' ? undefined : myAction(r);
}

export function inView(r: RecordItem, t: Tab, v: View) {
  if (!inTab(r, t)) return false;
  switch (v) {
    case 'needs': return needsMe(r, t);
    case 'sent': return r.creatorId === ME;
    case 'about': return r.recipientId === ME;
    default: return true;
  }
}

/** Lan's direct reports (My team's person filter). */
export const reports = Object.keys(managerOf).filter((id) => managerOf[id] === ME).map((id) => people[id]);

const nameOrYou = (id: string) => (id === ME ? 'you' : people[id].name);

/** The other person on the row, and how Lan relates to the record. */
export function counterpart(r: RecordItem): { person: Person; relation: string } {
  if (!r.recipientId) return { person: { id: '', name: nameOf(''), initials: '?' }, relation: 'draft' };
  if (r.creatorId === ME && r.recipientId === ME) return { person: people[ME], relation: 'for yourself' };
  if (r.creatorId === ME) return { person: people[r.recipientId], relation: 'from you' };
  if (r.recipientId === ME) return { person: people[r.creatorId], relation: 'to you' };
  return { person: people[r.creatorId], relation: `about ${people[r.recipientId].name}` };
}

/** People still to acknowledge, Lan named as "you". */
export function waitingFor(r: RecordItem): string[] {
  const ids: string[] = [];
  if (!r.ackRecipient) ids.push(r.recipientId);
  if (r.managerId && !r.ackManager) ids.push(r.managerId);
  return ids.map(nameOrYou);
}

export const joinNames = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0] ?? '');

export const openCorrection = (r: RecordItem) => r.corrections.find((c) => c.open);

// ─── AI from files (mock) ────────────────────────────────────────────────────
// The prototype can't read files: any upload returns this draft set (user, 2026-10-15). A file whose
// name contains "damaged" fails instead, to show the error state.

export const FILE_TYPES = ['pdf', 'docx', 'txt'];
export const FILE_LIMITS = { count: 10, eachMB: 10, totalMB: 50 };

export interface AiDraft { recipientId: string; content: string; source: SourceRef; unsure?: { said: string; candidates: string[] } }

export function mockAiDrafts(fileNames: string[]): AiDraft[] {
  const [a, b] = [fileNames[0], fileNames[1] ?? fileNames[0]];
  return [
    { recipientId: 'an', content: 'Ran the sprint demo and answered every question from the business team.', source: { file: a, page: 1, quote: 'An ran the demo' } },
    { recipientId: '', content: 'Took notes for the whole retro and shared them the same day.', source: { file: b, page: 2, quote: 'Minh took notes' }, unsure: { said: 'Minh', candidates: ['minh', 'minhho'] } },
  ];
}
