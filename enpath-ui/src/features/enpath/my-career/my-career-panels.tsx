'use client';
// My Career panels — the progress board (fixed to the Active target), the side panel for a selected
// role card, and the side panel for a selected route (a company path or a Career vision).

import * as React from 'react';
import { CheckCircleIcon, CompassIcon, FileMagnifyingGlassIcon, FlagIcon, PlusIcon, TrashIcon, TrendUpIcon } from '@phosphor-icons/react/ssr';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { routeColor, type CareerMapPath } from '@/components/ui/career-map';
import { Stat } from '@/components/ui/stat';
import { GapRow } from './gap-row';
import {
  companyPaths, countGaps, describeStep, employee, gapsFor, matchingPaths, recordCount, visionNumbers, visionRoute,
  type Plan, type PlanLink, type PlanStep, type VisionRequest, type VisionStatus,
} from './mock-data';
import { levelName } from './plan-dialogs';

export const requestBadge: Record<VisionStatus, { text: string; variant: 'blue' | 'success' | 'secondary' }> = {
  waiting: { text: `Waiting for ${employee.manager}`, variant: 'blue' },
  approved: { text: `Approved by ${employee.manager}`, variant: 'success' },
  declined: { text: `Declined by ${employee.manager}`, variant: 'secondary' },
};

const visionStatusText: Record<VisionStatus | 'draft', string> = {
  draft: 'draft, only you can see it',
  waiting: `waiting for ${employee.manager}`,
  approved: `approved by ${employee.manager}`,
  declined: `declined by ${employee.manager}`,
};

export const stateName = (s: PlanStep) =>
  ({ completed: 'Completed', current: 'You are here', target: 'Active target', planned: 'Planned', vision: `Career vision ${s.vision}` })[s.state];

const panelLabel = (s: PlanStep) => ({
  completed: 'Completed — a level you’ve already passed',
  current: 'You are here',
  target: 'Your Active target · progress is on top',
  planned: 'Exploring — what would this need?',
  vision: `Career vision ${s.vision} — what would this need?`,
})[s.state];

const gapsHeading: Record<PlanStep['state'], string> = {
  completed: 'What this level expected',
  current: 'Your role’s expectations',
  target: 'What your target needs',
  planned: 'What this role would need',
  vision: 'What this role would need',
};

const note = (text: string) => <p className="text-sm text-[var(--color-text-secondary)]">{text}</p>;

/** Panel layout: content scrolls, actions sit in a footer pinned to the bottom — explanation first,
 *  then buttons stacked full width (primary, secondary, then Remove). */
function Panel({ labelledBy, children, notes, buttons }: {
  labelledBy: string; children: React.ReactNode; notes: (string | false | undefined)[]; buttons: React.ReactNode[];
}) {
  const shown = notes.filter((n): n is string => !!n);
  return (
    <section aria-labelledby={labelledBy} className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-layout-sm)]">{children}</div>
      {(shown.length > 0 || buttons.length > 0) && (
        <div className="sticky bottom-0 flex flex-col gap-[var(--spacing-component-sm)] border-t border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-layout-sm)]">
          {shown.map((n) => <React.Fragment key={n}>{note(n)}</React.Fragment>)}
          {buttons.length > 0 && <div className="flex flex-col gap-[var(--spacing-component-sm)] [&>button]:w-full">{buttons}</div>}
        </div>
      )}
    </section>
  );
}

// ─── Progress board ──────────────────────────────────────────────────────────

export function ProgressBoard({ target, plan, request }: { target: PlanStep; plan: Plan; request: VisionRequest | null }) {
  const d = describeStep(target);
  const n = countGaps(gapsFor(target));
  const visions = visionNumbers(plan);
  return (
    <section aria-labelledby="progress-title" className="flex flex-col gap-[var(--spacing-component-md)] border-b border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] pb-[var(--spacing-layout-sm)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-[var(--spacing-layout-xs)] gap-y-[var(--spacing-component-xs)]">
        <h2 id="progress-title" className="flex items-center gap-[var(--spacing-component-sm)] text-base font-semibold text-[var(--color-background-default-foreground)]">
          <FlagIcon className="h-4 w-4 shrink-0 text-[var(--color-icon-success)]" aria-hidden="true" />
          Your progress toward {d.title} {d.level}
        </h2>
        {note(`Based on ${recordCount} acknowledged records${n.unset > 0 ? ` · ${n.unset} expectation${n.unset === 1 ? '' : 's'} not set` : ''}`)}
      </div>
      <div className="grid grid-cols-3 gap-[var(--spacing-component-sm)] sm:gap-[var(--spacing-component-md)]">
        <Stat icon={<CheckCircleIcon />} tone="success" label="Ready" value={n.ready} description="You meet the expectation" />
        <Stat icon={<TrendUpIcon />} tone="warning" label="Growth area" value={n.growth} description="Your records show a gap" />
        <Stat icon={<FileMagnifyingGlassIcon />} label="Needs evidence" value={n.evidence} description="Not enough records yet" />
      </div>
      {(request || visions.length > 0) && (
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <div className="flex flex-wrap items-center gap-x-[var(--spacing-component-sm)] gap-y-[var(--spacing-component-xs)] text-sm text-[var(--color-background-default-foreground)]">
            <CompassIcon className="h-4 w-4 shrink-0 text-[var(--color-icon-muted)]" aria-hidden="true" />
            {request ? (
              <>
                <span>Career vision {request.vision}: {levelName(visionRoute(plan, request.vision).at(-1)!)}</span>
                <Badge variant={requestBadge[request.status].variant} shape="pill" size="md">{requestBadge[request.status].text}</Badge>
              </>
            ) : (
              <span>{visions.length} career {visions.length === 1 ? 'vision' : 'visions'} on your map · none sent to {employee.manager} yet</span>
            )}
          </div>
          {request?.status === 'declined' && request.managerNote && note(`${employee.manager}: “${request.managerNote}”`)}
        </div>
      )}
    </section>
  );
}

// ─── Role card panel ─────────────────────────────────────────────────────────

export interface StepActions {
  onSetTarget: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onShowRoute: (routeId: string) => void;
}

export function StepPanel({ step, plan, links, request, removable, removeBlocked, actions }: {
  step: PlanStep; plan: Plan; links: PlanLink[]; request: VisionRequest | null;
  removable: boolean; removeBlocked?: string; actions: StepActions;
}) {
  const d = describeStep(step);
  const gaps = gapsFor(step);
  const n = countGaps(gaps);
  const incoming = links.find((l) => l.to === step.id);
  const path = companyPaths.find((p) => p.id === incoming?.route) ?? (step.state === 'completed' ? companyPaths.find((p) => p.id === plan.followedPathId) : undefined);
  const mine = step.vision !== undefined && request?.vision === step.vision ? request : null;
  const source = step.state === 'current'
    ? 'Your official role, set by your admin'
    : step.state === 'vision'
      ? `Part of Career vision ${step.vision} · ${visionStatusText[mine?.status ?? 'draft']}`
      : path ? `Company path · ${path.name}${path.id === plan.followedPathId ? ' (the path you follow)' : ''}` : '';
  const summary = [n.ready && `${n.ready} ready`, n.growth && `${n.growth} growth ${n.growth === 1 ? 'area' : 'areas'}`, n.evidence && `${n.evidence} need${n.evidence === 1 ? 's' : ''} evidence`, n.unset && `${n.unset} not set`].filter(Boolean).join(' · ');

  const buttons: React.ReactNode[] = [];
  let hint: string | undefined;
  const setTarget = <Button key="target" onClick={actions.onSetTarget}><FlagIcon aria-hidden="true" />Set as target</Button>;
  if (step.state === 'planned') buttons.push(setTarget);
  if (step.state === 'vision') {
    if (mine?.status === 'approved') buttons.push(setTarget);
    buttons.push(<Button key="route" variant="outline" onClick={() => actions.onShowRoute(`vision-${step.vision}`)}><CompassIcon aria-hidden="true" />Show Career vision {step.vision}</Button>);
    if (mine?.status !== 'approved') hint = `Send Career vision ${step.vision} to ${employee.manager} from its panel — ${employee.manager} approves it before it can become your target.`;
  }
  if (step.state !== 'completed') buttons.push(<Button key="add" variant="outline" onClick={actions.onAdd}><PlusIcon aria-hidden="true" />Explore a role from here</Button>);
  if (removable && !removeBlocked) buttons.push(<Button key="remove" variant="ghost" onClick={actions.onRemove}><TrashIcon aria-hidden="true" />Remove from my map</Button>);

  return (
    <Panel labelledBy="step-title" notes={[hint, removable && removeBlocked]} buttons={buttons}>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <p className="text-xs font-semibold text-[var(--color-text-secondary)]">{panelLabel(step)}</p>
        <h2 id="step-title" className="text-lg font-semibold text-[var(--color-background-default-foreground)]">
          {d.title} <span className="font-normal text-[var(--color-text-secondary)]">{d.level}</span>
        </h2>
        {source && note(source)}
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)] border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)]">
        <h3 className="text-sm font-semibold text-[var(--color-background-default-foreground)]">{gapsHeading[step.state]}</h3>
        {note(summary)}
        {n.unset === gaps.length ? note('No gap comparison yet — this level has no expectations set in Setup.') : (
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">{gaps.map((g) => <GapRow key={g.id} gap={g} />)}</div>
        )}
      </div>
    </Panel>
  );
}

// ─── Route panel ─────────────────────────────────────────────────────────────

export interface RouteActions {
  onFollow: (pathId: string) => void;
  onRequest: () => void;
  onWithdraw: () => void;
  onRemoveVision: () => void;
  onSelectCard: (id: string) => void;
}

/** Roles on a route in order. For a Career vision the first entry is the card it branches from
 *  (hollow dot) — not part of the vision itself. */
function RouteSteps({ ids, steps, color, anchorFirst = false, onSelectCard }: { ids: string[]; steps: PlanStep[]; color: string; anchorFirst?: boolean; onSelectCard: (id: string) => void }) {
  return (
    <ol className="flex flex-col gap-[var(--spacing-component-xs)]" aria-label="Roles on this route">
      {ids.map((id, i) => {
        const s = steps.find((x) => x.id === id);
        return (
          <li key={id} className="flex items-center gap-[var(--spacing-component-sm)]">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-[var(--radius-pill)] border-2" style={anchorFirst && i === 0 ? { borderColor: color } : { borderColor: color, backgroundColor: color }} />
            <button type="button" onClick={() => onSelectCard(id)} className="min-w-0 flex-1 rounded-[var(--radius-control)] text-left text-sm text-[var(--color-background-default-foreground)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)]">
              {levelName(id)}
            </button>
            {s && <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">{stateName(s)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function RoutePanel({ route, plan, steps, request, removeBlocked, actions }: {
  route: CareerMapPath; plan: Plan; steps: PlanStep[]; request: VisionRequest | null; removeBlocked?: string; actions: RouteActions;
}) {
  const color = routeColor(route);
  const header = (label: string, title: string, sub?: string) => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <p className="flex items-center gap-[var(--spacing-component-sm)] text-xs font-semibold text-[var(--color-text-secondary)]">
        <span aria-hidden="true" className={route.kind === 'vision' ? 'w-5 border-t-2 border-dashed' : 'h-0.5 w-5 rounded-[var(--radius-pill)]'} style={route.kind === 'vision' ? { borderColor: color } : { backgroundColor: color }} />
        {label}
      </p>
      <h2 id="route-title" className="text-lg font-semibold text-[var(--color-background-default-foreground)]">{title}</h2>
      {sub && note(sub)}
    </div>
  );

  if (route.kind === 'vision') {
    const n = Number(route.id.replace('vision-', ''));
    const ids = visionRoute(plan, n);
    const mine = request?.vision === n ? request : null;
    const buttons: React.ReactNode[] = [];
    let hint: string;
    if (mine?.status === 'waiting') {
      buttons.push(<Button key="withdraw" variant="outline" onClick={actions.onWithdraw}>Withdraw request</Button>);
      hint = `${employee.manager} is reviewing it. Your current role stays the same.`;
    } else if (mine?.status === 'approved') {
      hint = `${employee.manager} agreed on this direction. Select a role in it to make it your target.`;
    } else if (request?.status === 'waiting') {
      hint = `Career vision ${request.vision} is waiting for ${employee.manager}. You can send one at a time — withdraw it to send this one.`;
    } else {
      buttons.push(<Button key="request" onClick={actions.onRequest}>{mine?.status === 'declined' ? 'Edit and resend' : 'Request manager approval'}</Button>);
      hint = `It leaves your company path, so ${employee.manager} approves it before any role in it can become your target.`;
    }
    if (!removeBlocked) buttons.push(<Button key="remove" variant="ghost" onClick={actions.onRemoveVision}><TrashIcon aria-hidden="true" />Remove Career vision {n}</Button>);
    return (
      <Panel labelledBy="route-title" notes={[mine?.status === 'declined' && mine.managerNote ? `${employee.manager}: “${mine.managerNote}”` : undefined, hint, removeBlocked]} buttons={buttons}>
        {header('Your career vision', route.name, mine ? requestBadge[mine.status].text : 'Draft · only you can see it')}
        <RouteSteps ids={ids} steps={steps} color={color} anchorFirst onSelectCard={actions.onSelectCard} />
      </Panel>
    );
  }

  const path = companyPaths.find((p) => p.id === route.id)!;
  const ids = path.levels.filter((id) => steps.some((s) => s.id === id));
  const followed = route.id === plan.followedPathId;
  const canFollow = !followed && matchingPaths.some((p) => p.id === route.id);
  return (
    <Panel labelledBy="route-title" notes={[canFollow && 'It becomes your main route, shown in the top row.']}
      buttons={canFollow ? [<Button key="follow" onClick={() => actions.onFollow(route.id)}>Follow this path</Button>] : []}>
      {header(followed ? 'The company path you follow' : 'Company path', path.name, followed ? 'Your main route — planned for your role by your company.' : 'Planned for your role by your company. No approval needed.')}
      <RouteSteps ids={ids} steps={steps} color={color} onSelectCard={actions.onSelectCard} />
    </Panel>
  );
}
