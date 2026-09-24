'use client';
import * as React from 'react';
import { DotsSixVerticalIcon, PlusIcon, UsersIcon, XIcon } from '@phosphor-icons/react/ssr';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments, type Level, type Matrix } from '../mock-data';
import { Tip } from '../tip';

// Add / Edit position — one form for both. Holds the Position's structure: name, code and its Levels
// (add, rename, reorder, remove), its Competency matrix and an optional description.
// No status field: new positions start as Draft; Publish / Unpublish live in the page header. Expectations are edited in the grid, not here.
// Reorder: drag the handle, or focus it and press ↑ / ↓. Numbers (L1, L2…) follow the order.
// A Level with people mapped to it can't be removed — they must be moved first (Employee Mapping).

export interface PositionDraft { name: string; code: string; description: string; matrixId: string; department: string; levels: Level[] }

let seq = 0;
const newLevel = (): Level => ({ id: `lvl-${Date.now()}-${seq++}`, name: '', headcount: 0 });

export function PositionDialog({
  open, onOpenChange, initial, mode, onSave, matrices, setCount = 0,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: PositionDraft;
  mode: 'add' | 'edit';
  onSave: (d: PositionDraft) => void;
  matrices: Matrix[];
  /** expectations currently set — cleared if the matrix changes */
  setCount?: number;
}) {
  const [draft, setDraft] = React.useState(initial);
  // Only an Active Matrix can be assigned (BR-04) — but keep showing the position's current one even if it's since been archived.
  const selectableMatrices = matrices.filter((m) => m.status === 'Active' || m.id === initial.matrixId);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [tried, setTried] = React.useState(false);
  React.useEffect(() => { if (open) { setDraft(initial); setTried(false); } }, [open, initial]);

  const setLevels = (levels: Level[]) => setDraft((d) => ({ ...d, levels }));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= draft.levels.length) return;
    const next = [...draft.levels];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setLevels(next);
  };

  const nameMissing = !draft.name.trim();
  const codeMissing = !draft.code.trim();
  const emptyLevel = draft.levels.some((l) => !l.name.trim());
  const valid = !nameMissing && !codeMissing && !emptyLevel && draft.levels.length > 0;
  const removed = mode === 'edit' ? initial.levels.filter((l) => !draft.levels.some((x) => x.id === l.id)) : [];

  const matrixChanged = mode === 'edit' && draft.matrixId !== initial.matrixId;

  const save = () => {
    setTried(true);
    if (!valid) return;
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim(), code: draft.code.trim().toUpperCase(), levels: draft.levels.map((l) => ({ ...l, name: l.name.trim() })) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Create position' : 'Edit position'}</DialogTitle>
          <DialogDescription>Positions describe the career structure maintained in the application.</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-[var(--spacing-component-xl)]"
          onSubmit={(e) => { e.preventDefault(); save(); }}
          noValidate
        >
          <div className="flex gap-[var(--spacing-component-md)]">
            <div className="flex flex-1 flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor="pos-name">Position name</Label>
              <Input id="pos-name" value={draft.name} placeholder="e.g. Backend Engineer" aria-invalid={(tried && nameMissing) || undefined}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} autoFocus />
              {tried && nameMissing && <p className="text-xs text-[var(--color-text-invalid)]">Enter a name.</p>}
            </div>
            <div className="flex w-[112px] flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor="pos-code">Position code</Label>
              <Input id="pos-code" value={draft.code} placeholder="BE" maxLength={6} aria-invalid={(tried && codeMissing) || undefined}
                onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value.toUpperCase() }))} />
              {tried && codeMissing && <p className="text-xs text-[var(--color-text-invalid)]">Enter a code.</p>}
            </div>
          </div>

          <div className="flex gap-[var(--spacing-component-md)]">
            <div className="flex flex-1 flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor="pos-matrix">Competency matrix</Label>
              <Select value={draft.matrixId} onValueChange={(matrixId) => setDraft((d) => ({ ...d, matrixId }))}>
                <SelectTrigger id="pos-matrix"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {selectableMatrices.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor="pos-dept">Department</Label>
              <Select value={draft.department} onValueChange={(department) => setDraft((d) => ({ ...d, department }))}>
                <SelectTrigger id="pos-dept"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="pos-desc">Description <span className="font-normal text-[var(--color-text-secondary)]">(optional)</span></Label>
            <Textarea id="pos-desc" rows={3} value={draft.description} placeholder="What this job family does"
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>

          <fieldset className="flex flex-col gap-[var(--spacing-component-sm)]">
            <legend className="text-sm font-semibold">Levels</legend>
            <p className="-mt-[var(--spacing-component-xs)] mb-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">Lowest first. Drag to reorder.</p>
            <ol className="flex flex-col gap-[var(--spacing-component-xs)]">
              {draft.levels.map((l, i) => {
                const blocked = l.headcount > 0;
                return (
                  <li
                    key={l.id}
                    onDragOver={(e) => { e.preventDefault(); const from = draft.levels.findIndex((x) => x.id === dragId); if (dragId && from !== i) move(from, i); }}
                    className={`flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] ${dragId === l.id ? 'bg-[var(--color-background-muted)]' : ''}`}
                  >
                    <button
                      type="button"
                      draggable
                      onDragStart={() => setDragId(l.id)}
                      onDragEnd={() => setDragId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp') { e.preventDefault(); move(i, i - 1); }
                        if (e.key === 'ArrowDown') { e.preventDefault(); move(i, i + 1); }
                      }}
                      aria-label={`Reorder L${i + 1}${l.name ? ` ${l.name}` : ''} — use arrow keys`}
                      className="flex h-8 w-6 cursor-grab items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-icon-muted)] hover:text-[var(--color-icon-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                    >
                      <DotsSixVerticalIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="w-7 text-sm font-semibold text-[var(--color-text-secondary)]">L{i + 1}</span>
                    <Input
                      value={l.name}
                      placeholder="Level name, e.g. Senior"
                      aria-label={`L${i + 1} name`}
                      aria-invalid={(tried && !l.name.trim()) || undefined}
                      onChange={(e) => setLevels(draft.levels.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)))}
                      className="flex-1"
                    />
                    {mode === 'edit' && (
                      <Tip label={`${l.headcount} people mapped`}>
                        <span className="flex w-12 items-center gap-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                          <UsersIcon className="h-4 w-4" aria-hidden="true" />{l.headcount}
                          <span className="sr-only">people mapped</span>
                        </span>
                      </Tip>
                    )}
                    <Tip label={blocked ? `${l.headcount} people are on this level — move them in Employee mapping first` : undefined}>
                      <span className="inline-flex">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={blocked}
                          aria-label={blocked ? `Can't remove L${i + 1}: ${l.headcount} people mapped` : `Remove L${i + 1}`}
                          onClick={() => setLevels(draft.levels.filter((x) => x.id !== l.id))}
                        >
                          <XIcon className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </span>
                    </Tip>
                  </li>
                );
              })}
            </ol>
            {tried && emptyLevel && <p className="text-xs text-[var(--color-text-invalid)]">Every level needs a name.</p>}
            {tried && draft.levels.length === 0 && <p className="text-xs text-[var(--color-text-invalid)]">Add at least one level.</p>}
            <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setLevels([...draft.levels, newLevel()])}>
              <PlusIcon className="h-4 w-4" aria-hidden="true" />Add level
            </Button>
            {mode === 'edit' && <p className="text-xs text-[var(--color-text-secondary)]">Levels with people on them can't be removed — move the people first.</p>}
          </fieldset>

          {matrixChanged && (
            <p role="status" className="rounded-[var(--radius-md)] bg-[var(--color-status-warning-subtle)] p-[var(--spacing-component-md)] text-sm text-[var(--color-status-warning-subtle-foreground)]">
              Switching matrix clears all {setCount} expectations of this position.
            </p>
          )}
          {removed.length > 0 && !matrixChanged && (
            <p role="status" className="rounded-[var(--radius-md)] bg-[var(--color-status-warning-subtle)] p-[var(--spacing-component-md)] text-sm text-[var(--color-status-warning-subtle-foreground)]">
              Removing {removed.map((l) => l.name || 'an unnamed level').join(', ')} also deletes {removed.length === 1 ? 'its' : 'their'} expectations.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{mode === 'add' ? 'Create position' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
