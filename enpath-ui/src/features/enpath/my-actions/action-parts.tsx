'use client';
// Pieces an Action shows the same way in the List (growth-area-group.tsx) and the Board
// (board-view.tsx): the status Badge, the "Due · added by" line, the next-step button, the "…" menu
// and an AI proposal. One place, so the two views can't drift.
// SCREEN-LEVEL DEBT (design-patterns.md → Open flags, kind restyle, 2026-09-30): the In progress
// Badge's border and the proposal's brand-blue Sparkle (Alert colours every svg) are overridden here.

import * as React from 'react';
import { DotsThreeIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Gap } from '../my-career/mock-data';
import { isOverdue, shortDate, sourceLabel, statusLabel, type Action, type ActionStatus, type Proposal } from './mock-data';

export interface ActionHandlers {
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

const statusBadge: Record<ActionStatus, 'secondary' | 'blue' | 'success'> = { todo: 'secondary', doing: 'blue', done: 'success' };
/** Debt: Badge blue's border (border/subtle) is near-invisible next to success's; match it here. */
const statusBadgeClass: Partial<Record<ActionStatus, string>> = { doing: 'border-[var(--color-status-info)]' };

export function StatusBadge({ status }: { status: ActionStatus }) {
  return <Badge variant={statusBadge[status]} shape="pill" size="sm" className={statusBadgeClass[status]}>{statusLabel[status]}</Badge>;
}

/** "Due 26 Sep · overdue · added by you" — only "overdue" is red. */
export function ActionMeta({ action }: { action: Action }) {
  const when = action.status === 'done' ? `Done ${shortDate(action.doneOn ?? action.due)}` : `Due ${shortDate(action.due)}`;
  return (
    <span className="text-body-xs text-[var(--color-text-secondary)]">
      {when}
      {isOverdue(action) && <> · <span className="text-[var(--color-text-invalid)]">overdue</span></>}
      {' · '}{sourceLabel[action.source]}
    </span>
  );
}

/** Start (To do) or Mark done (In progress); nothing for Done. */
export function NextStepButton({ action, h }: { action: Action; h: ActionHandlers }) {
  if (action.status === 'todo') return <Button variant="outline" size="sm" onClick={() => h.onAdvance(action)}>Start</Button>;
  if (action.status === 'doing') return <Button variant="outline" size="sm" onClick={() => h.onAdvance(action)}>Mark done</Button>;
  return null;
}

/** The "…" menu. Non-modal: its items open dialogs (a modal menu left the page unclickable, P2). */
export function ActionMenu({ action, h }: { action: Action; h: ActionHandlers }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`More for ${action.title}`}><DotsThreeIcon aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => h.onEdit(action)}>Edit</DropdownMenuItem>
        {action.status === 'done' && <DropdownMenuItem onClick={() => h.onReopen(action)}>Move back to In progress</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => h.onRemove(action)}>Remove from plan</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** An AI proposal: default Alert with a brand-blue Sparkle (the chat panel's AI mark). Icon + text +
 *  buttons sit in an inner row, as in the Alert WithIcon story (Alert has no icon option, Open flag).
 *  `stacked` puts the buttons under the text (narrow Board column). Not urgent → role=group. */
export function ProposalAlert({ proposal, h, context, stacked = false }: { proposal: Proposal; h: ActionHandlers; context?: string; stacked?: boolean }) {
  return (
    <Alert variant="default" role="group" aria-label="AI proposal">
      <div className="flex flex-wrap items-start gap-[var(--spacing-component-md)]">
        <SparkleIcon className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0 text-[var(--color-icon-brand)]!" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <AlertTitle>{proposal.title}</AlertTitle>
          <AlertDescription>{context ?? 'AI proposal'} · outcome: {proposal.outcome}</AlertDescription>
        </div>
        <div className={stacked ? 'flex w-full items-center gap-[var(--spacing-component-xs)]' : 'flex items-center gap-[var(--spacing-component-xs)]'}>
          <Button variant="outline" size="sm" onClick={() => h.onAcceptProposal(proposal)}>Add to plan</Button>
          <Button variant="ghost" size="sm" onClick={() => h.onDismissProposal(proposal)}>Dismiss</Button>
        </div>
      </div>
    </Alert>
  );
}
