'use client';
// One growth area of the Action plan (List view — my-actions-build.md → What's built).
// Card (default size: a full-width page, not a side panel): heading = the competency, "You 3 → Needed 4",
// the progress ring and "Add action" (no records link: records carry no competency, 2026-09-30). Rows (layout A, 2026-09-30):
// status Badge · title, the outcome in full, a small "Due · added by" line · Start / Mark done · "…".
// Nothing expands: everything an action has is on its row. AI proposals for this growth area are
// default Alerts with a brand-blue Sparkle (icon laid out as in the Alert WithIcon stories; Alert has no
// icon option yet, Open flag) with Add to plan / Dismiss. An empty growth area invites an action or Ask AI.
// Row pieces (badge, meta, buttons, proposal) live in action-parts.tsx, shared with the Board.
// The header is CardHeader tone="tinted"; progress is Progress shape="ring" (design-system options).

import * as React from 'react';
import { PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Gap } from '../my-career/mock-data';
import { ActionMenu, ActionMeta, NextStepButton, ProposalAlert, StatusBadge, type ActionHandlers } from './action-parts';
import { pointsLine, statusOrder, type Action, type Proposal } from './mock-data';

export type GroupHandlers = ActionHandlers;

function ActionRow({ action, h }: { action: Action; h: GroupHandlers }) {
  const done = action.status === 'done';
  return (
    // Fixed columns so every row lines up: status slot | title · outcome · meta | next-step button | "…".
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)_7rem_auto] items-start gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-md)] last:border-b-0">
      <span className="flex pt-[var(--spacing-component-xxs)]"><StatusBadge status={action.status} /></span>
      <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
        <p className={done ? 'text-heading-xs text-[var(--color-text-secondary)]' : 'text-heading-xs text-[var(--color-background-default-foreground)]'}>{action.title}</p>
        {action.outcome && <p className="text-body-sm text-[var(--color-background-default-foreground)]">{action.outcome}</p>}
        <ActionMeta action={action} />
      </div>
      <div className="flex justify-end"><NextStepButton action={action} h={h} /></div>
      <ActionMenu action={action} h={h} />
    </li>
  );
}

export function GrowthAreaGroup({ area, actions, proposals, h }: {
  area: Gap; actions: Action[]; proposals: Proposal[]; h: GroupHandlers;
}) {
  const rows = [...actions].sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.due.localeCompare(b.due));
  const done = actions.filter((a) => a.status === 'done').length;
  const progress = actions.length ? `${done} of ${actions.length} done` : 'No actions yet';
  return (
    <Card role="region" aria-label={area.name}>
      <CardHeader tone="tinted" className="flex-row flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)]">
        <Progress shape="ring" value={actions.length ? Math.round((done / actions.length) * 100) : 0} aria-label={`${area.name}: ${progress}`}>
          {done}/{actions.length}
        </Progress>
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <CardTitle role="heading" aria-level={2} >{area.name}</CardTitle>
          <p className="text-body-xs text-[var(--color-text-secondary)]">Growth area · {pointsLine(area)}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => h.onAddAction(area.id)}><PlusIcon aria-hidden="true" />Add action</Button>
      </CardHeader>

      {rows.length > 0 && (
        <ul aria-label={`${area.name} actions`} className="flex flex-col">
          {rows.map((a) => <ActionRow key={a.id} action={a} h={h} />)}
        </ul>
      )}

      {proposals.map((p) => <ProposalAlert key={p.id} proposal={p} h={h} />)}

      {rows.length === 0 && proposals.length === 0 && (
        <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
          <p className="min-w-0 flex-1 text-body-sm text-[var(--color-text-secondary)]">Plan something to grow here, or ask AI for ideas.</p>
          <Button variant="outline" size="sm" onClick={h.onAskAI}><SparkleIcon aria-hidden="true" />Ask AI</Button>
        </div>
      )}
    </Card>
  );
}
