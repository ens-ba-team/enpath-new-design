'use client';
// Pieces an Action shows the same way in the List (growth-area-group.tsx) and the Board
// (board-view.tsx): the status Badge, the "Due · added by" line, the next-step button, the "…" menu
// and an AI proposal. One place, so the two views can't drift. Built from design-system options only
// (Alert variant ai + icon, Badge, DropdownMenu destructive item): no screen overrides.

import * as React from 'react';
import { DotsThreeIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { isOverdue, shortDate, sourceLabel, statusLabel, type Action, type ActionStatus, type Proposal } from './mock-data';

export interface ActionHandlers {
  onAdvance: (a: Action) => void;
  onEdit: (a: Action) => void;
  /** Move to any status: the "…" menu's Move to (List and Board), and a drop on the Board */
  onMove: (a: Action, to: ActionStatus) => void;
  onRemove: (a: Action) => void;
  onAddAction: (competencyId: string) => void;
  onAcceptProposal: (p: Proposal) => void;
  onDismissProposal: (p: Proposal) => void;
  onAskAI: () => void;
}

const statusBadge: Record<ActionStatus, 'secondary' | 'blue' | 'success'> = { todo: 'secondary', doing: 'blue', done: 'success' };

export function StatusBadge({ status }: { status: ActionStatus }) {
  return <Badge variant={statusBadge[status]} shape="pill" size="sm">{statusLabel[status]}</Badge>;
}

/** "Due 26 Sep · overdue · added by you" — only "overdue" is red. */
export function ActionMeta({ action }: { action: Action }) {
  const when = action.status === 'done' ? `Done ${shortDate(action.doneOn ?? action.due)}` : `Due ${shortDate(action.due)}`;
  return (
    <span className="text-body-xs text-[var(--color-text-secondary)]">
      {when}
      {isOverdue(action) && <> · <span className="text-[var(--color-text-danger)]">overdue</span></>}
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

/** The "…" menu. Non-modal: its items open dialogs (a modal menu left the page unclickable, P2).
 *  Move to lists the other two statuses, so the List can do every move the Board's drag can
 *  (and keyboard / touch users get one on the Board too). */
export function ActionMenu({ action, h }: { action: Action; h: ActionHandlers }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`More for ${action.title}`}><DotsThreeIcon aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => h.onEdit(action)}>Edit</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(['todo', 'doing', 'done'] as const).filter((s) => s !== action.status).map((s) => (
              <DropdownMenuItem key={s} onClick={() => h.onMove(action, s)}>{statusLabel[s]}</DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => h.onRemove(action)}>Remove from plan</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const proposalButtons = (proposal: Proposal, h: ActionHandlers) => (
  <div className="flex items-center gap-[var(--spacing-component-xs)]">
    <Button variant="outline" size="sm" onClick={() => h.onAcceptProposal(proposal)}>Add to plan</Button>
    <Button variant="ghost" size="sm" onClick={() => h.onDismissProposal(proposal)}>Dismiss</Button>
  </div>
);

/** An AI proposal in the List: Alert variant="ai" (color/border/ai, brand Sparkle) with the icon option.
 *  Text on the left, Add to plan / Dismiss on the right. Not urgent → role=group. */
export function ProposalAlert({ proposal, h, context }: { proposal: Proposal; h: ActionHandlers; context?: string }) {
  return (
    <Alert variant="ai" icon={<SparkleIcon />} role="group" aria-label="AI proposal">
      <div className="flex flex-wrap items-start gap-[var(--spacing-component-md)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <AlertTitle>{proposal.title}</AlertTitle>
          <AlertDescription>{context ?? 'AI proposal'} · outcome: {proposal.outcome}</AlertDescription>
        </div>
        {proposalButtons(proposal, h)}
      </div>
    </Alert>
  );
}

/** An AI proposal on the Board: a compact Card like the other Board cards (the "Proposed by AI" column
 *  carries the AI border), with the brand Sparkle, and the buttons under the text. */
export function ProposalCard({ proposal, h, context }: { proposal: Proposal; h: ActionHandlers; context?: string }) {
  return (
    <Card size="compact" role="group" aria-label="AI proposal">
      <div className="flex items-start gap-[var(--spacing-component-sm)]">
        <SparkleIcon className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0 text-[var(--color-icon-brand)]" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <p className="text-heading-xs text-[var(--color-surface-default-foreground)]">{proposal.title}</p>
          <p className="text-body-sm text-[var(--color-text-secondary)]">{context ?? 'AI proposal'} · outcome: {proposal.outcome}</p>
        </div>
      </div>
      {proposalButtons(proposal, h)}
    </Card>
  );
}
