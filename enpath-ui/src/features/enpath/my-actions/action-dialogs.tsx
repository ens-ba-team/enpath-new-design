'use client';
// My Actions dialogs: add / edit an Action (a form), and the two confirmations (remove an Action,
// dismiss an AI proposal). Built from Dialog, AlertDialog, Label, Input, Textarea, Select, DatePicker.
// Nothing saves without the person pressing the verb; the screen shows a toast after.

import * as React from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { growthAreas, isoDate, type Action } from './mock-data';

export interface ActionDraft { title: string; competencyId: string; outcome: string; due?: Date }

const blankDraft = (): ActionDraft => ({ title: '', competencyId: '', outcome: '' });
const draftOf = (a: Action): ActionDraft => ({ title: a.title, competencyId: a.competencyId, outcome: a.outcome, due: new Date(`${a.due}T00:00:00`) });

/** Add or edit an Action. Adding can start prefilled: from a growth area's heading (the area) or
 *  from an AI proposal (title, area, outcome) — the person still picks the due date and confirms. */
export function ActionDialog({ open, onOpenChange, editing, prefill, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The Action being edited; omit to add a new one */
  editing?: Action;
  /** Fields filled in when adding */
  prefill?: Partial<ActionDraft>;
  onSave: (draft: Required<Pick<ActionDraft, 'title' | 'competencyId' | 'outcome'>> & { due: string }) => void;
}) {
  // The screen remounts the dialog (key) each time it opens, so the form starts from these props.
  const [draft, setDraft] = React.useState<ActionDraft>(() => (editing ? draftOf(editing) : { ...blankDraft(), ...prefill }));
  const [tried, setTried] = React.useState(false);

  const titleMissing = !draft.title.trim();
  const areaMissing = !draft.competencyId;
  const dueMissing = !draft.due;
  const save = () => {
    setTried(true);
    if (titleMissing || areaMissing || dueMissing) return;
    onSave({ title: draft.title.trim(), competencyId: draft.competencyId, outcome: draft.outcome.trim(), due: isoDate(draft.due!) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit action' : 'Add action'}</DialogTitle>
          <DialogDescription>One piece of work toward a growth area, with a due date.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-[var(--spacing-component-xl)]" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="act-title">Action</Label>
            <Input id="act-title" value={draft.title} placeholder="Lead a design review" autoFocus
              aria-invalid={(tried && titleMissing) || undefined}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            {tried && titleMissing && <p className="text-body-xs text-[var(--color-text-invalid)]">Enter what you’ll do.</p>}
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="act-area">Growth area</Label>
            <Select value={draft.competencyId} onValueChange={(v) => setDraft((d) => ({ ...d, competencyId: v }))}>
              <SelectTrigger id="act-area" aria-invalid={(tried && areaMissing) || undefined}><SelectValue placeholder="Choose a growth area" /></SelectTrigger>
              <SelectContent>
                {growthAreas.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {tried && areaMissing && <p className="text-body-xs text-[var(--color-text-invalid)]">Choose the growth area this action serves.</p>}
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="act-outcome">Outcome</Label>
            <Textarea id="act-outcome" rows={3} value={draft.outcome} placeholder="What finishing it will show"
              onChange={(e) => setDraft((d) => ({ ...d, outcome: e.target.value }))} />
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <DatePicker id="act-due" label="Due date" value={draft.due} placeholder="Pick a date"
              onChange={(v) => setDraft((d) => ({ ...d, due: v instanceof Date ? v : undefined }))} />
            {tried && dueMissing && <p className="text-body-xs text-[var(--color-text-invalid)]">Pick a due date.</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Save changes' : 'Add to plan'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Preview → Confirm for removing an Action from the plan. */
export function RemoveActionDialog({ action, onOpenChange, onConfirm }: { action?: Action; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return (
    <AlertDialog open={!!action} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this action?</AlertDialogTitle>
          <AlertDialogDescription>“{action?.title}” leaves your plan. Your other actions stay as they are.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Preview → Confirm for dismissing an AI proposal. Dismissed proposals don't come back. */
export function DismissProposalDialog({ title, onOpenChange, onConfirm }: { title?: string; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return (
    <AlertDialog open={!!title} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dismiss this proposal?</AlertDialogTitle>
          <AlertDialogDescription>“{title}” won’t be suggested again. Ask AI any time for other ideas.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
