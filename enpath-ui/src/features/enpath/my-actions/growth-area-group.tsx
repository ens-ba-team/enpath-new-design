'use client';
// One growth area of the Action plan (List view — my-actions-build.md → What's built).
// Card (default size: a full-width page, not a side panel): heading = the competency, "You 3 → Needed 4",
// the progress ring, a link to that competency's Records and "Add action". Rows (layout A, 2026-09-30):
// status Badge · title, the outcome in full, a small "Due · added by" line · Start / Mark done · "…".
// Nothing expands: everything an action has is on its row. AI proposals for this growth area are
// default Alerts with a brand-blue Sparkle (icon laid out as in the Alert WithIcon stories; Alert has no
// icon option yet, Open flag) with Add to plan / Dismiss. An empty growth area invites an action or Ask AI.
// SCREEN-LEVEL DEBT (design-patterns.md → Open flags, kind restyle, 2026-09-30): the progress ring
// before the title and the In progress Badge's border are built here until the components get them
// (Progress shape="ring"; Badge blue border), and so is the tinted header band (color/surface/header,
// full-bleed to the card's edges with a border/default line under it; not a Card option yet).
// Move them into the components, then delete them here.

import * as React from 'react';
import { DotsThreeIcon, PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Gap } from '../my-career/mock-data';
import {
  isOverdue, pointsLine, shortDate, sourceLabel, statusLabel, statusOrder,
  type Action, type ActionStatus, type Proposal,
} from './mock-data';

const statusBadge: Record<ActionStatus, 'secondary' | 'blue' | 'success'> = { todo: 'secondary', doing: 'blue', done: 'success' };
/** Debt: Badge blue's border (border/subtle) is near-invisible next to success's; match it here. */
const statusBadgeClass: Partial<Record<ActionStatus, string>> = { doing: 'border-[var(--color-status-info)]' };

/** Debt: progress ring (Open flag) — done out of total, before the growth area's title.
 *  Track border/default, fill icon/default (neutral: the page has enough blue), all done icon/success.
 *  36px, label inside. */
function ProgressRing({ done, total, label }: { done: number; total: number; label: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const share = total ? done / total : 0;
  const complete = total > 0 && done === total;
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label={label}
      className="relative inline-flex shrink-0 items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" className="stroke-[var(--color-border-default)]" />
        {share > 0 && (
          <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${c * share} ${c}`}
            className={complete ? 'stroke-[var(--color-icon-success)]' : 'stroke-[var(--color-icon-default)]'} />
        )}
      </svg>
      <span className="absolute text-label-sm text-[var(--color-background-default-foreground)]">{done}/{total}</span>
    </div>
  );
}

export interface GroupHandlers {
  onAdvance: (a: Action) => void;
  onEdit: (a: Action) => void;
  onReopen: (a: Action) => void;
  onRemove: (a: Action) => void;
  onAddAction: (competencyId: string) => void;
  onAcceptProposal: (p: Proposal) => void;
  onDismissProposal: (p: Proposal) => void;
  onOpenRecords: (area: Gap) => void;
  onAskAI: () => void;
}

function Meta({ action }: { action: Action }) {
  const when = action.status === 'done' ? `Done ${shortDate(action.doneOn ?? action.due)}` : `Due ${shortDate(action.due)}`;
  // Only the word "overdue" is red; the date stays secondary.
  return (
    <span className="text-body-xs text-[var(--color-text-secondary)]">
      {when}
      {isOverdue(action) && <> · <span className="text-[var(--color-text-invalid)]">overdue</span></>}
      {' · '}{sourceLabel[action.source]}
    </span>
  );
}

function ActionRow({ action, h }: { action: Action; h: GroupHandlers }) {
  const done = action.status === 'done';
  return (
    // Fixed columns so every row lines up: status slot | title · outcome · meta | next-step button | "…".
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)_7rem_auto] items-start gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-md)] last:border-b-0">
      <span className="flex pt-[var(--spacing-component-xxs)]">
        <Badge variant={statusBadge[action.status]} shape="pill" size="sm" className={statusBadgeClass[action.status]}>{statusLabel[action.status]}</Badge>
      </span>
      <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
        <p className={done ? 'text-heading-xs text-[var(--color-text-secondary)]' : 'text-heading-xs text-[var(--color-background-default-foreground)]'}>{action.title}</p>
        {action.outcome && <p className="text-body-sm text-[var(--color-background-default-foreground)]">{action.outcome}</p>}
        <Meta action={action} />
      </div>
      <div className="flex justify-end">
        {action.status === 'todo' && <Button variant="outline" size="sm" onClick={() => h.onAdvance(action)}>Start</Button>}
        {action.status === 'doing' && <Button variant="outline" size="sm" onClick={() => h.onAdvance(action)}>Mark done</Button>}
      </div>
      {/* Non-modal: its items open dialogs (a modal menu left the page unclickable, P2). */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`More for ${action.title}`}><DotsThreeIcon aria-hidden="true" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => h.onEdit(action)}>Edit</DropdownMenuItem>
          {done && <DropdownMenuItem onClick={() => h.onReopen(action)}>Move back to In progress</DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => h.onRemove(action)}>Remove from plan</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

export function GrowthAreaGroup({ area, actions, proposals, records, h }: {
  area: Gap; actions: Action[]; proposals: Proposal[]; records: number; h: GroupHandlers;
}) {
  const rows = [...actions].sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.due.localeCompare(b.due));
  const done = actions.filter((a) => a.status === 'done').length;
  const progress = actions.length ? `${done} of ${actions.length} done` : 'No actions yet';
  return (
    <Card role="region" aria-label={area.name}>
      {/* Debt: tinted header band. Negative margins cancel the Card's padding (spacing/component/lg) so the
          band reaches the card's edges; the same side padding goes back inside it. */}
      <CardHeader className="-mx-[var(--spacing-component-lg)] -mt-[var(--spacing-component-lg)] flex-row flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)] rounded-t-[var(--radius-lg)] border-b border-[var(--color-border-default)] bg-[var(--color-surface-header)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-md)]">
        <ProgressRing done={done} total={actions.length} label={`${area.name}: ${progress}`} />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <CardTitle role="heading" aria-level={2} className="text-[var(--color-surface-header-foreground)]">{area.name}</CardTitle>
          <p className="text-body-xs text-[var(--color-text-secondary)]">Growth area · {pointsLine(area)}</p>
        </div>
        {records > 0 ? (
          <Button variant="link" size="sm" onClick={() => h.onOpenRecords(area)}>{records === 1 ? '1 record' : `${records} records`}</Button>
        ) : (
          <span className="text-body-sm text-[var(--color-text-secondary)]">0 records</span>
        )}
        <Button variant="outline" size="sm" onClick={() => h.onAddAction(area.id)}><PlusIcon aria-hidden="true" />Add action</Button>
      </CardHeader>

      {rows.length > 0 && (
        <ul aria-label={`${area.name} actions`} className="flex flex-col">
          {rows.map((a) => <ActionRow key={a.id} action={a} h={h} />)}
        </ul>
      )}

      {proposals.map((p) => (
        // Default Alert with a brand-blue Sparkle (user, 2026-09-30), the same AI mark as the chat panel.
        // Debt: Alert colours every svg with the variant's colour ([&_svg]), so the icon needs ! to keep
        // color/icon/brand (Open flag: Alert icon option).
        // Not urgent → role=group (the Alert defaults to role=alert).
        // Icon + text + buttons sit in an inner row, as in the Alert WithIcon story (Alert has no icon option).
        <Alert key={p.id} variant="default" role="group" aria-label="AI proposal">
          <div className="flex flex-wrap items-start gap-[var(--spacing-component-md)]">
            <SparkleIcon className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0 text-[var(--color-icon-brand)]!" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
              <AlertTitle>{p.title}</AlertTitle>
              <AlertDescription>AI proposal · outcome: {p.outcome}</AlertDescription>
            </div>
            <div className="flex items-center gap-[var(--spacing-component-xs)]">
              <Button variant="outline" size="sm" onClick={() => h.onAcceptProposal(p)}>Add to plan</Button>
              <Button variant="ghost" size="sm" onClick={() => h.onDismissProposal(p)}>Dismiss</Button>
            </div>
          </div>
        </Alert>
      ))}

      {rows.length === 0 && proposals.length === 0 && (
        <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
          <p className="min-w-0 flex-1 text-body-sm text-[var(--color-text-secondary)]">Plan something to grow here, or ask AI for ideas.</p>
          <Button variant="outline" size="sm" onClick={h.onAskAI}><SparkleIcon aria-hidden="true" />Ask AI</Button>
        </div>
      )}
    </Card>
  );
}
