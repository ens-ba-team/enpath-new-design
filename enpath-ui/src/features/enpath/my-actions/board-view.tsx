'use client';
// Action plan — Board view (my-actions-build.md → Board). Four columns: Proposed by AI · To do ·
// In progress · Done (user, 2026-09-30: proposals as the first column, as in sketch B). Each column is
// a grouping area with a count; status columns use the same fills as the Stat icon tiles (user,
// 2026-09-30), one step darker: To do zinc/200 · In progress blue/100 · Done green/100 (primitives);
// Proposed by AI surface/raised (zinc/50) with a brand/400 stroke. An Action card (Card compact) shows the
// same content as a List row: growth area, title, outcome, "Due · added by", next step and "…"; the
// column says the status, so there's no badge. Proposals are the shared ProposalAlert, stacked.
// Moving: the Start / Mark done buttons (touch and keyboard), or drag a card to another column on
// desktop (native drag, like Setup's career path editor); the target column shows
// color/drop-indicator while a card is over it. Proposals don't drag: Add to plan opens the dialog.
// Growth areas with no action aren't shown here (the List shows every growth area).

import * as React from 'react';
import { SparkleIcon } from '@phosphor-icons/react/ssr';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Gap } from '../my-career/mock-data';
import { ActionMenu, ActionMeta, NextStepButton, ProposalAlert, type ActionHandlers } from './action-parts';
import { statusLabel, type Action, type ActionStatus, type Proposal } from './mock-data';

const columns: ActionStatus[] = ['todo', 'doing', 'done'];
/** TRIAL (2026-09-30): on the brand/100 content area, columns are white and the status colour is a
 *  dot before the column title, in the Stat icon tiles' colours (zinc/500 · blue/400 · green/600).
 *  Primitives (Open flag: Board column fills). */
const columnDot: Record<ActionStatus, string> = {
  todo: 'bg-[var(--color-zinc-500)]',
  doing: 'bg-[var(--color-blue-400)]',
  done: 'bg-[var(--color-green-600)]',
};

function Column({ title, count, icon, fill = 'bg-[var(--color-surface-default)]', stroke, children, dropTarget, over, onDragOver, onDragLeave, onDrop }: {
  title: string; count: number; icon?: React.ReactNode; fill?: string; stroke?: string; children: React.ReactNode;
  dropTarget?: boolean; over?: boolean;
  onDragOver?: (e: React.DragEvent) => void; onDragLeave?: () => void; onDrop?: (e: React.DragEvent) => void;
}) {
  return (
    <section
      aria-label={title}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'flex min-w-0 flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] p-[var(--spacing-component-sm)]',
        fill,
        stroke,
        dropTarget && over && 'ring-2 ring-[var(--color-drop-indicator)]',
      )}
    >
      <h2 className="flex items-center gap-[var(--spacing-component-xs)] px-[var(--spacing-component-xs)] pt-[var(--spacing-component-xxs)] text-heading-xs text-[var(--color-surface-raised-foreground)]">
        {icon}
        <span className="flex-1">{title}</span>
        <span className="text-body-sm text-[var(--color-text-secondary)]">{count}</span>
      </h2>
      <ul className="flex flex-col gap-[var(--spacing-component-sm)]">{children}</ul>
    </section>
  );
}

function ActionCard({ action, area, h, onDragStart, onDragEnd }: {
  action: Action; area?: Gap; h: ActionHandlers; onDragStart: () => void; onDragEnd: () => void;
}) {
  const done = action.status === 'done';
  return (
    <li draggable onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', action.id); onDragStart(); }} onDragEnd={onDragEnd}
      className="cursor-grab active:cursor-grabbing">
      <Card size="compact">
        <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
          {area && <span className="text-body-xs text-[var(--color-text-secondary)]">{area.name}</span>}
          <p className={done ? 'text-heading-xs text-[var(--color-text-secondary)]' : 'text-heading-xs text-[var(--color-background-default-foreground)]'}>{action.title}</p>
          {action.outcome && <p className={done ? 'text-body-sm text-[var(--color-text-secondary)]' : 'text-body-sm text-[var(--color-background-default-foreground)]'}>{action.outcome}</p>}
          <ActionMeta action={action} />
        </div>
        <div className="flex items-center justify-between gap-[var(--spacing-component-sm)]">
          <span><NextStepButton action={action} h={h} /></span>
          <ActionMenu action={action} h={h} />
        </div>
      </Card>
    </li>
  );
}

export function BoardView({ actions, proposals, areas, h, onMove }: {
  actions: Action[]; proposals: Proposal[]; areas: Gap[]; h: ActionHandlers;
  /** Drop a card on another column */
  onMove: (action: Action, to: ActionStatus) => void;
}) {
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overCol, setOverCol] = React.useState<ActionStatus | null>(null);
  const areaOf = (id: string) => areas.find((a) => a.id === id);
  const byDue = (a: Action, b: Action) => a.due.localeCompare(b.due);

  return (
    // Four columns from 1024px; narrower screens scroll the columns sideways, one readable width each.
    <div className="grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-[var(--spacing-component-md)] overflow-x-auto pb-[var(--spacing-component-xs)] lg:grid-flow-row lg:grid-cols-4">
      {/* Debt: brand stroke on the whole AI column, primitive color/brand/400 (Open flag: AI proposal border). */}
      <Column title="Proposed by AI" count={proposals.length} stroke="border border-[var(--color-brand-400)]"
        icon={<SparkleIcon className="h-4 w-4 text-[var(--color-icon-brand)]" aria-hidden="true" />}>
        {proposals.length === 0
          ? <li className="px-[var(--spacing-component-xs)] text-body-sm text-[var(--color-text-secondary)]">No proposals right now. Ask AI for ideas.</li>
          : proposals.map((p) => <li key={p.id}><ProposalAlert proposal={p} h={h} context={areaOf(p.competencyId)?.name} stacked /></li>)}
      </Column>

      {columns.map((status) => {
        const cards = actions.filter((a) => a.status === status).sort(byDue);
        return (
          <Column key={status} title={statusLabel[status]} count={cards.length}
            icon={<span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-[var(--radius-pill)]', columnDot[status])} />}
            dropTarget={dragId !== null} over={overCol === status}
            onDragOver={(e) => { if (!dragId) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOverCol(status); }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              const moved = actions.find((a) => a.id === e.dataTransfer.getData('text/plain'));
              if (moved && moved.status !== status) onMove(moved, status);
              setDragId(null); setOverCol(null);
            }}>
            {cards.map((a) => (
              <ActionCard key={a.id} action={a} area={areaOf(a.competencyId)} h={h}
                onDragStart={() => setDragId(a.id)} onDragEnd={() => { setDragId(null); setOverCol(null); }} />
            ))}
          </Column>
        );
      })}
    </div>
  );
}
