'use client';
// Static competency comparisons with a shared score/requirement scale and modal quick creation.
import * as React from 'react';
import { toast } from 'sonner';
import { CheckIcon, PlusIcon, CaretDownIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionDialog } from '../my-actions/action-dialogs';
import { CompetencyOverview } from './competency-overview';
import { cn } from '@/lib/utils';
import { Tip } from '../tip';
import { shortDate, statusLabel, type ActionStatus } from '../my-actions/mock-data';
import type { Gap, GapStatus } from './mock-data';

export interface QuickCareerAction { id: string; title: string; due: string; competencyId: string; roleId: string; status?: ActionStatus; outcome?: string }

export const statusFill: Record<GapStatus, string> = {
  ready: 'bg-[var(--color-icon-success)]',
  growth: 'bg-[var(--color-icon-warning)]',
  evidence: 'bg-[var(--color-border-strong)]',
  unset: 'bg-[var(--color-border-default)]',
};

function ScoreScale({ gap }: { gap: Gap }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <div className="flex justify-between gap-[var(--spacing-component-sm)] text-body-xs tabular-nums text-[var(--color-text-secondary)]">
        <span>Your score: <span className="text-[var(--color-background-default-foreground)]">{gap.current ?? 'Not assessed'}</span></span>
        <span>Role requires: <span className="text-[var(--color-background-default-foreground)]">{gap.required ?? 'Not set'}</span></span>
      </div>
      <div className="flex gap-[var(--spacing-component-xs)]" role="img" aria-label={`Your score: ${gap.current ?? 'not assessed'}. Role requires: ${gap.required ?? 'not set'}. Maximum: ${gap.scaleSize}. ${gap.status === 'ready' ? 'Requirement met.' : gap.status === 'growth' ? 'Orange shows your score; light orange shows remaining required points.' : 'Outlined segments show required points.'}`}>
        {Array.from({ length: Math.max(gap.current ?? 0, gap.required ?? 0) }, (_, i) => (
          <span key={i} aria-hidden="true" className={cn('h-2 flex-1 rounded-[var(--radius-sm)]',
            gap.status === 'ready' ? (i < gap.current! ? 'bg-[var(--color-icon-success)]' : 'border border-[var(--color-border-default)]')
              : gap.status === 'growth' && i < gap.current! ? 'bg-[var(--color-icon-warning)]'
              : gap.status === 'growth' && i < gap.required! ? 'bg-[color-mix(in_srgb,var(--color-icon-warning)_25%,var(--color-background-default))]'
              : gap.current != null && i < gap.current ? 'bg-[var(--color-text-secondary)]'
              : gap.required != null && i < gap.required ? 'border border-[var(--color-text-secondary)]' : 'bg-[var(--color-border-default)]')} />
        ))}
      </div>
    </div>
  );
}

function ComparisonRow({ gap, onEdit, actions, rowRef }: { gap: Gap; onEdit: () => void; actions: QuickCareerAction[]; rowRef: (node: HTMLLIElement | null) => void }) {
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const actionsId = React.useId();
  const label = gap.status === 'growth' ? null
    : gap.status === 'ready' ? 'Ready' : gap.status === 'evidence' ? 'Not assessed' : 'Not set';
  return (
    <li ref={rowRef} tabIndex={-1} aria-label={`${gap.name} competency details`} className="flex flex-col gap-[var(--spacing-component-sm)] py-[var(--spacing-component-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
      <div className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
        <h4 className="min-w-0 flex-1 text-heading-xs">{gap.name}</h4>
        {label && <span className="inline-flex shrink-0 items-center gap-[var(--spacing-component-xs)] text-body-xs text-[var(--color-text-secondary)]">
          {gap.status === 'ready' ? <CheckIcon className="h-3 w-3 text-[var(--color-icon-success)]" aria-hidden="true" /> : <span className={cn('h-2 w-2 rounded-[var(--radius-pill)]', statusFill[gap.status])} aria-hidden="true" />}
          {label}
        </span>}
      </div>
      <ScoreScale gap={gap} />
      {gap.meaning && <p className="text-body-xs text-[var(--color-text-secondary)]">{gap.meaning}</p>}
      <div aria-label={`Action summary for ${gap.name}`} className="flex flex-wrap items-center gap-[var(--spacing-component-xs)] text-body-xs text-[var(--color-text-secondary)]">
        {actions.length > 0 ? <Button type="button" variant="ghost" size="sm" aria-expanded={actionsOpen} aria-controls={actionsId} aria-label={`${actionsOpen ? 'Hide' : 'Show'} actions for ${gap.name}`} onClick={() => setActionsOpen((open) => !open)}>
          {actions.length} {actions.length === 1 ? 'action' : 'actions'}
          <CaretDownIcon aria-hidden="true" className={cn('transition-transform motion-reduce:transition-none', actionsOpen && 'rotate-180')} />
        </Button> : <span>0 actions</span>}
        {(['todo', 'doing', 'done'] as const).map((status) => {
          const count = actions.filter((action) => (action.status ?? 'todo') === status).length;
          return count > 0 ? <Badge key={status} variant={status === 'done' ? 'success' : status === 'doing' ? 'blue' : 'secondary'}>{count} {statusLabel[status]}</Badge> : null;
        })}
        <div className="ml-auto">
          <Tip label={`Create action for ${gap.name}`}>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`Create action for ${gap.name}`} aria-haspopup="dialog" onClick={onEdit}>
              <PlusIcon aria-hidden="true" />
            </Button>
          </Tip>
        </div>
      </div>
      {actions.length > 0 && <ul id={actionsId} hidden={!actionsOpen} aria-label={`Actions for ${gap.name}`} className={cn('flex-col gap-[var(--spacing-component-xs)]', actionsOpen ? 'flex' : 'hidden')}>
        {actions.map((action) => <li key={action.id} className="text-body-xs"><span className="text-[var(--color-background-default-foreground)]">{action.title}</span><span className="block text-[var(--color-text-secondary)]">{statusLabel[action.status ?? 'todo']} · Due {shortDate(action.due)}</span></li>)}
      </ul>}
    </li>
  );
}

export function GapList({ gaps, focus, roleId, roleName, actions, onCreateAction }: { gaps: Gap[]; focus?: GapStatus; roleId: string; roleName: string; actions: QuickCareerAction[]; onCreateAction: (action: QuickCareerAction) => void }) {
  const [editing, setEditing] = React.useState<Gap | null>(null);
  const [overviewOpen, setOverviewOpen] = React.useState(false);
  const overviewButton = React.useRef<HTMLButtonElement>(null);
  const selectedCompetency = React.useRef<string | null>(null);
  const rows = React.useRef(new Map<string, HTMLLIElement>());
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const priority: Record<GapStatus, number> = { growth: 0, evidence: 1, unset: 2, ready: 3 };
  const sorted = [...gaps].sort((a, b) => priority[a.status] - priority[b.status]);
  const focusRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (focus) focusRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [focus]);
  return (
    <section aria-label="Competency comparison" className="flex flex-col gap-[var(--spacing-component-md)]">
      <div className="flex items-center justify-between gap-[var(--spacing-component-sm)]">
        <h3 className="text-heading-xs">Competencies · {gaps.length}</h3>
        <Button ref={overviewButton} variant="outline" size="sm" aria-haspopup="dialog" onClick={() => { selectedCompetency.current = null; setOverviewOpen(true); }}>View overview</Button>
      </div>
      <ul className="flex flex-col">
        {sorted.map((gap) => <React.Fragment key={gap.id}>
          {sorted.find((g) => g.status === focus)?.id === gap.id && <li aria-hidden="true"><div ref={focusRef} /></li>}
          <ComparisonRow gap={gap} rowRef={(node) => { if (node) rows.current.set(gap.id, node); else rows.current.delete(gap.id); }} actions={actions.filter((a) => a.roleId === roleId && a.competencyId === gap.id)} onEdit={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setEditing(gap); }} />
        </React.Fragment>)}
      </ul>
      <CompetencyOverview open={overviewOpen} onOpenChange={setOverviewOpen} gaps={gaps} roleName={roleName}
        onSelect={(id) => { selectedCompetency.current = id; }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const row = selectedCompetency.current ? rows.current.get(selectedCompetency.current) : null;
          if (row) { row.focus({ preventScroll: true }); row.scrollIntoView({ block: 'nearest', behavior: 'instant' }); }
          else overviewButton.current?.focus();
          selectedCompetency.current = null;
        }}
      />
      {editing && <ActionDialog
        key={editing.id}
        open
        roleId={roleId}
        roleName={roleName}
        prefill={{ competencyId: editing.id }}
        onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus(); }}
        onOpenChange={(open) => { if (!open) setEditing(null); }}
        onSave={(draft) => {
          onCreateAction({ id: crypto.randomUUID(), ...draft, roleId });
          setEditing(null);
          toast.success('Action added to My Actions');
        }}
      />}
    </section>
  );
}
