'use client';
// One growth area of the Action plan (List view, sketch C v2 — my-actions-build.md → Layout).
// Card size="compact": heading = the competency, "You 3 → Needed 4", "1 of 2 done", a link to that
// competency's Records and "Add action". Rows are an Accordion size="compact" (same as the competency
// groups in My Career, pattern P7): status Badge + title + due date / source; expanding shows the
// outcome and what the needed point looks like. Start / Mark done and the "…" menu sit beside the
// trigger (never inside it). AI proposals for this growth area are muted Items with Add to plan /
// Dismiss. An empty growth area invites an action or Ask AI.
// SCREEN-LEVEL DEBT (design-patterns.md → Open flags, kind restyle, 2026-09-30): the progress ring
// before the title and the In progress Badge's border are built here until the components get them
// (Progress shape="ring"; Badge blue border). Move them into the components, then delete them here.

import * as React from 'react';
import { DotsThreeIcon, PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item } from '@/components/ui/item';
import type { Gap } from '../my-career/mock-data';
import {
  isOverdue, neededLabel, pointsLine, shortDate, sourceLabel, statusLabel, statusOrder,
  type Action, type ActionStatus, type Proposal,
} from './mock-data';

const statusBadge: Record<ActionStatus, 'secondary' | 'blue' | 'success'> = { todo: 'secondary', doing: 'blue', done: 'success' };
/** Debt: Badge blue's border (border/subtle) is near-invisible next to success's; match it here. */
const statusBadgeClass: Partial<Record<ActionStatus, string>> = { doing: 'border-[var(--color-status-info)]' };

/** Debt: progress ring (Open flag) — done out of total, before the growth area's title.
 *  Track border/default, fill brand/primary, all done icon/success. 36px, label inside. */
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
            className={complete ? 'stroke-[var(--color-icon-success)]' : 'stroke-[var(--color-brand-primary)]'} />
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

function ActionRow({ action, area, h }: { action: Action; area: Gap; h: GroupHandlers }) {
  const done = action.status === 'done';
  return (
    <AccordionItem value={action.id}>
      {/* Fixed columns so every row lines up: trigger (status · title · caret) | next-step button | "…".
          The trigger's header fills its column; the status sits in a fixed-width slot. */}
      <div className="grid grid-cols-[minmax(0,1fr)_7rem_auto] items-center gap-[var(--spacing-component-sm)]">
        <div className="flex min-w-0 [&>h3]:min-w-0 [&>h3]:flex-1">
          <AccordionTrigger className="min-w-0 justify-start text-left">
          <span className="flex w-[5.5rem] shrink-0">
            <Badge variant={statusBadge[action.status]} shape="pill" size="sm" className={statusBadgeClass[action.status]}>{statusLabel[action.status]}</Badge>
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
            <span className={done ? 'text-[var(--color-text-secondary)]' : 'text-heading-xs'}>{action.title}</span>
            <Meta action={action} />
          </span>
          </AccordionTrigger>
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
      </div>
      <AccordionContent>
        <dl className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)]">
          <dt>Outcome</dt>
          <dd className="text-[var(--color-background-default-foreground)]">{action.outcome || 'Not written yet'}</dd>
          <dt>{neededLabel(area)} means</dt>
          <dd className="text-[var(--color-background-default-foreground)]">{area.meaning ?? 'See the matrix for this level.'}</dd>
          <dt>Added</dt>
          <dd className="text-[var(--color-background-default-foreground)]">{shortDate(action.added)}, {sourceLabel[action.source]}</dd>
        </dl>
      </AccordionContent>
    </AccordionItem>
  );
}

export function GrowthAreaGroup({ area, actions, proposals, records, h }: {
  area: Gap; actions: Action[]; proposals: Proposal[]; records: number; h: GroupHandlers;
}) {
  const rows = [...actions].sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.due.localeCompare(b.due));
  const done = actions.filter((a) => a.status === 'done').length;
  const progress = actions.length ? `${done} of ${actions.length} done` : 'No actions yet';
  return (
    <Card size="compact" role="region" aria-label={area.name}>
      <CardHeader className="flex-row flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)]">
        <ProgressRing done={done} total={actions.length} label={`${area.name}: ${progress}`} />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <CardTitle role="heading" aria-level={2}>{area.name}</CardTitle>
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
        <Accordion type="single" collapsible size="compact">
          {rows.map((a) => <ActionRow key={a.id} action={a} area={area} h={h} />)}
        </Accordion>
      )}

      {proposals.map((p) => (
        <Item key={p.id} variant="muted" size="sm" type="icon"
          icon={<SparkleIcon className="h-4 w-4 text-[var(--color-icon-brand)]" aria-hidden="true" />}
          title={p.title}
          description={`AI proposal · outcome: ${p.outcome}`}
          action={
            <div className="flex flex-wrap items-center gap-[var(--spacing-component-xs)]">
              <Button variant="outline" size="sm" onClick={() => h.onAcceptProposal(p)}>Add to plan</Button>
              <Button variant="ghost" size="sm" onClick={() => h.onDismissProposal(p)}>Dismiss</Button>
            </div>
          }
        />
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
