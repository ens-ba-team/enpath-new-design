'use client';
// One growth area of the Action plan (List view — my-actions-build.md → What's built).
// Card (default size: a full-width page, not a side panel): heading = the competency, "You 3 → Needed 4",
// the progress ring and "Add action" (no records link: records carry no competency, 2026-09-30). Rows (layout A, 2026-09-30):
// status Badge · title, the outcome in full, a small "Due · added by" line · Start / Mark done · "…".
// Nothing expands: everything an action has is on its row. AI proposals for this growth area are
// default Alerts with a brand-blue Sparkle (icon laid out as in the Alert WithIcon stories; Alert has no
// icon option yet, Open flag) with Add to plan / Dismiss. An empty growth area invites an action or Ask AI.
// Row pieces (badge, meta, buttons, proposal) live in action-parts.tsx, shared with the Board.
// SCREEN-LEVEL DEBT (design-patterns.md → Open flags, kind restyle, 2026-09-30): the progress ring
// before the title is built here until Progress gets shape="ring", and so is the tinted header band (color/surface/header,
// full-bleed to the card's edges with a border/default line under it; not a Card option yet).
// Move them into the components, then delete them here.

import * as React from 'react';
import { PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { Gap } from '../my-career/mock-data';
import { ActionMenu, ActionMeta, NextStepButton, ProposalAlert, StatusBadge, type ActionHandlers } from './action-parts';
import { pointsLine, statusOrder, type Action, type Proposal } from './mock-data';

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

/** Kept for the screen's imports: the handlers are shared with the Board. */
export type GroupHandlers = ActionHandlers;

function ActionRow({ action, h }: { action: Action; h: GroupHandlers }) {
  const done = action.status === 'done';
  return (
    // Fixed columns so every row lines up: status slot | title · outcome · meta | next-step button | "…".
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)_7rem_auto] items-start gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-md)] last:border-b-0">
      <span className="flex pt-[var(--spacing-component-xxs)]"><StatusBadge status={action.status} /></span>
      <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
        <p className={done ? 'text-heading-sm text-[var(--color-text-secondary)]' : 'text-heading-sm text-[var(--color-background-default-foreground)]'}>{action.title}</p>
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
    // TRIAL (2026-09-30, washed-out look, steps B + C): on the grey content area the card needs no
    // border (shadow only), titles are one step bigger, and the title row is white (divider kept):
    // on the brand/100 area the blue band blurred into the background.
    <Card role="region" aria-label={area.name} className="border-transparent">
      {/* Debt: tinted header band. Negative margins cancel the Card's padding (spacing/component/lg) so the
          band reaches the card's edges; the same side padding goes back inside it. */}
      <CardHeader className="-mx-[var(--spacing-component-lg)] -mt-[var(--spacing-component-lg)] flex-row flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)] rounded-t-[var(--radius-lg)] border-b border-[var(--color-border-default)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-md)]">
        <ProgressRing done={done} total={actions.length} label={`${area.name}: ${progress}`} />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xxs)]">
          <CardTitle role="heading" aria-level={2} className="text-heading-md text-[var(--color-background-default-foreground)]">{area.name}</CardTitle>
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
