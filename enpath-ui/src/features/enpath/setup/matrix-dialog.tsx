'use client';
import * as React from 'react';
import { PlusIcon, WarningIcon, XIcon } from '@phosphor-icons/react/ssr';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Competency } from '../mock-data';

// Add / Edit matrix — name, description, scale size (2–5) and owners. Competencies and their behavior
// text are edited on the Matrix page itself (dev-logic.md §2: name + description required to save;
// activation needs ≥1 owner, ≥1 competency, every competency's behaviors filled — checked on Publish).

export interface MatrixDraft { name: string; description: string; scaleSize: number; owners: string[] }

export function MatrixDialog({
  open, onOpenChange, initial, mode, onSave, competencies = [],
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: MatrixDraft;
  mode: 'add' | 'edit';
  onSave: (d: MatrixDraft) => void;
  /** current competencies, to warn if lowering the scale would drop behavior text */
  competencies?: Competency[];
}) {
  const [draft, setDraft] = React.useState(initial);
  const [tried, setTried] = React.useState(false);
  React.useEffect(() => { if (open) { setDraft(initial); setTried(false); } }, [open, initial]);

  const nameMissing = !draft.name.trim();
  const descMissing = !draft.description.trim();
  const valid = !nameMissing && !descMissing;

  const shrinking = mode === 'edit' && draft.scaleSize < initial.scaleSize;
  // Per competency, exactly which points above the new size have a title/description — the detail, not just the names.
  const droppedDetail = shrinking
    ? competencies
        .map((c) => ({
          name: c.name || 'an untitled competency',
          points: c.behaviors
            .map((b, i) => ({ point: i + 1, b }))
            .filter(({ point, b }) => point > draft.scaleSize && b),
        }))
        .filter((c) => c.points.length > 0)
    : [];

  const setOwner = (i: number, name: string) => setDraft((d) => ({ ...d, owners: d.owners.map((o, j) => (j === i ? name : o)) }));

  const save = () => {
    setTried(true);
    if (!valid) return;
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim(), owners: draft.owners.map((o) => o.trim()).filter(Boolean) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Create matrix' : 'Edit matrix'}</DialogTitle>
          <DialogDescription>A matrix is a reusable skill framework — one or more positions can use it.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-[var(--spacing-component-xl)]" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="mx-name">Matrix name</Label>
            <Input id="mx-name" value={draft.name} placeholder="e.g. Northstar Engineering" aria-invalid={(tried && nameMissing) || undefined}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} autoFocus />
            {tried && nameMissing && <p className="text-xs text-[var(--color-text-invalid)]">Enter a name.</p>}
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="mx-desc">Description</Label>
            <Textarea id="mx-desc" rows={3} value={draft.description} placeholder="What this framework covers"
              aria-invalid={(tried && descMissing) || undefined}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
            {tried && descMissing && <p className="text-xs text-[var(--color-text-invalid)]">Enter a description.</p>}
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="mx-scale">Rating scale</Label>
            <Select value={String(draft.scaleSize)} onValueChange={(v) => setDraft((d) => ({ ...d, scaleSize: Number(v) }))}>
              <SelectTrigger id="mx-scale"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} points</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="flex flex-col gap-[var(--spacing-component-sm)]">
            <legend className="text-sm font-semibold">Owners <span className="font-normal text-[var(--color-text-secondary)]">(needed before publishing)</span></legend>
            <ol className="flex flex-col gap-[var(--spacing-component-xs)]">
              {draft.owners.map((o, i) => (
                <li key={i} className="flex items-center gap-[var(--spacing-component-sm)]">
                  <Input value={o} placeholder="Person's name" aria-label={`Owner ${i + 1}`} className="flex-1"
                    onChange={(e) => setOwner(i, e.target.value)} />
                  <Button type="button" variant="ghost" size="sm" aria-label={`Remove owner ${i + 1}`}
                    onClick={() => setDraft((d) => ({ ...d, owners: d.owners.filter((_, j) => j !== i) }))}>
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ol>
            <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setDraft((d) => ({ ...d, owners: [...d.owners, ''] }))}>
              <PlusIcon className="h-4 w-4" aria-hidden="true" />Add owner
            </Button>
          </fieldset>

          {droppedDetail.length > 0 && (
            <Alert variant="warning" role="status" className="flex-row items-start gap-[var(--spacing-component-sm)]">
              <WarningIcon className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                <AlertTitle>Lowering the scale to {draft.scaleSize} points removes this behavior text</AlertTitle>
                <ul className="flex max-h-[160px] flex-col gap-[var(--spacing-component-sm)] overflow-auto text-sm">
                  {droppedDetail.map((c) => (
                    <li key={c.name}>
                      <p className="font-semibold text-[var(--color-status-warning-subtle-foreground)]">{c.name}</p>
                      <ul className="flex flex-col gap-[var(--spacing-component-xxs)] pl-[var(--spacing-component-md)]">
                        {c.points.map(({ point, b }) => (
                          <li key={point}>Point {point}{b?.title ? ` · ${b.title}` : ''}{b?.description ? ` — “${b.description}”` : ''}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{mode === 'add' ? 'Create matrix' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
