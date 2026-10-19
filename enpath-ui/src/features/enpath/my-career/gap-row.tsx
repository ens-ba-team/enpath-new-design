'use client';
// Static competency comparisons with a shared score/requirement scale and modal quick creation.
import * as React from 'react';
import { toast } from 'sonner';
import { CheckIcon, PlusIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { Tip } from '../tip';
import { isoDate, shortDate } from '../my-actions/mock-data';
import type { Gap, GapStatus } from './mock-data';

export interface QuickCareerAction { id: string; title: string; due: string; competencyId: string; roleId: string }

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
        {Array.from({ length: gap.scaleSize }, (_, i) => (
          <span key={i} aria-hidden="true" className={cn('h-2 flex-1 rounded-[var(--radius-sm)]',
            gap.status === 'ready' ? 'bg-[var(--color-icon-success)]'
              : gap.status === 'growth' && i < gap.current! ? 'bg-[var(--color-icon-warning)]'
              : gap.status === 'growth' && i < gap.required! ? 'bg-[color-mix(in_srgb,var(--color-icon-warning)_25%,var(--color-background-default))]'
              : gap.current != null && i < gap.current ? 'bg-[var(--color-text-secondary)]'
              : gap.required != null && i < gap.required ? 'border border-[var(--color-text-secondary)]' : 'bg-[var(--color-border-default)]')} />
        ))}
      </div>
    </div>
  );
}

function QuickActionForm({ onSave, onCancel }: { onSave: (title: string, due: string) => void; onCancel: () => void }) {
  const id = React.useId();
  const [title, setTitle] = React.useState('');
  const [due, setDue] = React.useState<Date>();
  const [tried, setTried] = React.useState(false);
  return (
    <form className="flex flex-col gap-[var(--spacing-component-xl)]" noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (title.trim() && due) onSave(title.trim(), isoDate(due)); }}>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Label htmlFor={`${id}-title`}>Action</Label>
        <Input id={`${id}-title`} autoFocus value={title} maxLength={200} placeholder="What will you do?" onChange={(e) => setTitle(e.target.value)} aria-invalid={tried && !title.trim() || undefined} aria-describedby={tried && !title.trim() ? `${id}-error` : undefined} />
        {tried && !title.trim() && <p id={`${id}-error`} role="alert" className="text-body-xs text-[var(--color-text-invalid)]">Enter what you’ll do.</p>}
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <DatePicker id={`${id}-due`} label="Due date" value={due} onChange={(value) => setDue(value instanceof Date ? value : undefined)} />
        {tried && !due && <p role="alert" className="text-body-xs text-[var(--color-text-invalid)]">Pick a due date.</p>}
      </div>
      <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">Add to plan</Button></DialogFooter>
    </form>
  );
}

function ComparisonRow({ gap, onEdit, actions }: { gap: Gap; onEdit: () => void; actions: QuickCareerAction[] }) {
  const label = gap.status === 'growth' ? null
    : gap.status === 'ready' ? 'Ready' : gap.status === 'evidence' ? 'Not assessed' : 'Not set';
  return (
    <li className="group/competency flex flex-col gap-[var(--spacing-component-sm)] py-[var(--spacing-component-md)]">
      <div className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
        <h4 className="min-w-0 flex-1 text-heading-xs">{gap.name}</h4>
        {label && <span className="inline-flex shrink-0 items-center gap-[var(--spacing-component-xs)] text-body-xs text-[var(--color-text-secondary)]">
          {gap.status === 'ready' ? <CheckIcon className="h-3 w-3 text-[var(--color-icon-success)]" aria-hidden="true" /> : <span className={cn('h-2 w-2 rounded-[var(--radius-pill)]', statusFill[gap.status])} aria-hidden="true" />}
          {label}
        </span>}
        {gap.status === 'growth' && <Tip label={`Create action for ${gap.name}`}>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={`Create action for ${gap.name}`} aria-haspopup="dialog" onClick={onEdit}
            className="opacity-100 [@media(min-width:640px)_and_(hover:hover)_and_(pointer:fine)]:opacity-0 group-hover/competency:opacity-100 group-focus-within/competency:opacity-100 focus-visible:opacity-100"><PlusIcon aria-hidden="true" /></Button>
        </Tip>}
      </div>
      <ScoreScale gap={gap} />
      {gap.meaning && <p className="text-body-xs text-[var(--color-text-secondary)]">{gap.meaning}</p>}
      {actions.length > 0 && <ul aria-label={`Actions for ${gap.name}`} className="flex flex-col gap-[var(--spacing-component-xs)]">
        {actions.map((action) => <li key={action.id} className="text-body-xs"><span className="text-[var(--color-background-default-foreground)]">{action.title}</span><span className="block text-[var(--color-text-secondary)]">To do · Due {shortDate(action.due)}</span></li>)}
      </ul>}
    </li>
  );
}

export function GapList({ gaps, focus, roleId, roleName, actions, onCreateAction }: { gaps: Gap[]; focus?: GapStatus; roleId: string; roleName: string; actions: QuickCareerAction[]; onCreateAction: (action: QuickCareerAction) => void }) {
  const [editing, setEditing] = React.useState<Gap | null>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const priority: Record<GapStatus, number> = { growth: 0, evidence: 1, unset: 2, ready: 3 };
  const sorted = [...gaps].sort((a, b) => priority[a.status] - priority[b.status]);
  const focusRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (focus) focusRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [focus]);
  return (
    <section aria-label="Competency comparison" className="flex flex-col gap-[var(--spacing-component-md)]">
      <h3 className="text-heading-xs">Competencies · {gaps.length}</h3>
      <ul className="flex flex-col">
        {sorted.map((gap) => <React.Fragment key={gap.id}>
          {sorted.find((g) => g.status === focus)?.id === gap.id && <li aria-hidden="true"><div ref={focusRef} /></li>}
          <ComparisonRow gap={gap} actions={actions.filter((a) => a.roleId === roleId && a.competencyId === gap.id)} onEdit={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setEditing(gap); }} />
        </React.Fragment>)}
      </ul>
      <Dialog open={editing != null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus(); }}>
          <DialogHeader><DialogTitle>Create action</DialogTitle><DialogDescription>{editing?.name} · {roleName}</DialogDescription></DialogHeader>
          {editing && <QuickActionForm key={editing.id} onCancel={() => setEditing(null)} onSave={(title, due) => { onCreateAction({ id: crypto.randomUUID(), title, due, competencyId: editing.id, roleId }); setEditing(null); toast.success('Action added to your career plan'); }} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
