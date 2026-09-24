'use client';
import * as React from 'react';
import { ArchiveIcon, ArrowCounterClockwiseIcon, BriefcaseIcon, ClockCounterClockwiseIcon, MagnifyingGlassIcon, PencilSimpleIcon, PlusIcon, RocketLaunchIcon, WarningIcon, XIcon } from '@phosphor-icons/react/ssr';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { scale, type Behavior, type Competency, type Matrix, type Position } from '../mock-data';
import { MatrixDialog, type MatrixDraft } from './matrix-dialog';
import { HistoryDrawer } from './history-drawer';
import { Tip } from '../tip';

// Matrices config tab (sketch, 2026-09-23; competency editor redesigned 2026-09-23 to master-detail
// after the accordion version "spread the page" — every competency's every rating-scale point
// stacked vertically at once). Same shell as Career structure — explorer left, one Matrix per page
// on the right. Unlike Position's Draft/Published, a Matrix has a 3rd state (dev-logic.md §2): Draft
// (editable) → Active (read-only, live) → Archived (read-only, restorable). There's no direct
// Active → Draft — Archive, then Restore. Publishing is gated: ≥1 owner, ≥1 competency, every
// competency's behaviors filled for every scale point — this is a hard block, unlike a Position's
// Publish, which only warns on unset cells.
// Terminology: a Matrix's scale steps are always "points" in this file, never "levels" — "Level"
// is reserved for a Position's own steps (L1, L2…) and the two must not be confused.

function MatrixStatusBadge({ status }: { status: Matrix['status'] }) {
  if (status === 'Active') return <Badge variant="success">Active</Badge>;
  if (status === 'Archived') return <Badge variant="secondary">Archived</Badge>;
  return <Badge variant="warning">Draft</Badge>;
}

const behaviorMissing = (b: Behavior | null) => !b || !b.title.trim() || !b.description.trim();

function activationIssues(m: Matrix): string[] {
  const issues: string[] = [];
  if (m.owners.length === 0) issues.push('Needs at least one owner');
  if (m.competencies.length === 0) issues.push('Needs at least one competency');
  const incomplete = m.competencies.filter((c) => c.behaviors.slice(0, m.scaleSize).some(behaviorMissing));
  if (incomplete.length > 0) {
    issues.push(`Every point needs a title and description: ${incomplete.map((c) => c.name || 'an untitled competency').join(', ')}`);
  }
  return issues;
}

function MatrixList({ matrices, selected, onSelect, onAdd }: { matrices: Matrix[]; selected: string; onSelect: (id: string) => void; onAdd: () => void }) {
  const [query, setQuery] = React.useState('');
  const shown = matrices.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--color-border-default)]">
      <div className="flex flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-lg)]">
        <h2 className="text-base font-semibold text-[var(--color-background-default-foreground)]">Matrices</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-[var(--spacing-component-sm)] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search matrices" aria-label="Search matrices" className="pl-[var(--spacing-component-xl)]!" />
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-[var(--spacing-component-xs)] overflow-auto px-[var(--spacing-component-md)]" aria-label="Matrices">
        {shown.map((m) => (
          <li key={m.id}>
            <Item
              size="sm"
              className="px-[var(--spacing-component-md)]"
              title={m.name}
              description={<span className="text-xs">{m.competencies.length} {m.competencies.length === 1 ? 'competency' : 'competencies'}</span>}
              action={<MatrixStatusBadge status={m.status} />}
              selected={m.id === selected}
              onSelect={() => onSelect(m.id)}
            />
          </li>
        ))}
        {shown.length === 0 && <li className="p-[var(--spacing-component-sm)] text-sm text-[var(--color-text-secondary)]">No matrices match “{query}”.</li>}
      </ul>
      <div className="border-t border-[var(--color-border-default)] p-[var(--spacing-component-lg)]">
        <Button variant="outline" className="w-full" onClick={onAdd}><PlusIcon className="h-4 w-4" aria-hidden="true" />Add matrix</Button>
      </div>
    </aside>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[var(--spacing-component-sm)]">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="text-[var(--color-background-default-foreground)]">{children}</dd>
    </div>
  );
}

// Competency picker: a vertical numbered stepper (custom — no existing component fits a
// numbered-circle stepper with a connector line). Solid grey connector, not dashed — this isn't
// sequential progress, just a list. Filled circle = every rating-scale point has a title +
// description already; active competency's label goes semibold.
function CompetencyStepper({ competencies, scaleSize, active, onSelect }: {
  competencies: Competency[]; scaleSize: number; active: string; onSelect: (id: string) => void;
}) {
  return (
    <div className="flex w-[220px] shrink-0 flex-col" aria-label="Competencies">
      {competencies.map((c, i) => {
        const filledCount = c.behaviors.slice(0, scaleSize).filter((b) => !behaviorMissing(b)).length;
        const filled = filledCount === scaleSize;
        const isActive = c.id === active;
        const isLast = i === competencies.length - 1;
        return (
          <button
            key={c.id}
            type="button"
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(c.id)}
            className="flex items-stretch gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          >
            <span className="flex flex-col items-center">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-full)] border text-xs ${
                filled
                  ? 'border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] text-[var(--color-background-default-foreground)]'
                  : 'border-[var(--color-border-default)] bg-[var(--color-background-default)] text-[var(--color-text-secondary)]'
              }`}>
                {i + 1}
              </span>
              {!isLast && <span className="w-px flex-1 bg-[var(--color-border-default)]" aria-hidden="true" />}
            </span>
            <span className="flex flex-col gap-0.5 pb-[var(--spacing-component-lg)] pt-[var(--spacing-component-xxs)]">
              <span className={`text-sm ${isActive ? 'font-semibold text-[var(--color-background-default-foreground)]' : 'text-[var(--color-text-secondary)]'}`}>
                {c.name || 'Untitled competency'}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">{filledCount} of {scaleSize} filled</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// The selected competency's rating scale — pill Tabs, one point's title/description shown at a
// time. Called "point" throughout, never "level" — that word means a Position's step (L1, L2…)
// elsewhere in this app; reusing it here for a Matrix's scale would collide with it.
// `key={competency.id}` on the mount below resets to point 0 whenever the selected competency changes.
function LevelPanel({ competency, scaleSize, editable, onChangeBehavior }: {
  competency: Competency; scaleSize: number; editable: boolean;
  onChangeBehavior: (i: number, patch: Partial<Behavior>) => void;
}) {
  return (
    <Tabs defaultValue="0">
      <Label className="mb-[var(--spacing-component-xs)] block">Rating scale</Label>
      <TabsList variant="default">
        {Array.from({ length: scaleSize }, (_, i) => (
          <TabsTrigger key={i} value={String(i)} variant="default">{i + 1}</TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: scaleSize }, (_, i) => {
        const b = competency.behaviors[i];
        return (
          <TabsContent key={i} value={String(i)} className="flex flex-col gap-[var(--spacing-component-md)]">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor={`c-title-${competency.id}-${i}`}>Title</Label>
              {editable ? (
                <Input id={`c-title-${competency.id}-${i}`} value={b?.title ?? ''} placeholder={`e.g. ${scale[i] ?? 'Point ' + (i + 1)}`}
                  onChange={(e) => onChangeBehavior(i, { title: e.target.value })} />
              ) : (
                <p className={`text-sm ${b?.title ? 'text-[var(--color-background-default-foreground)]' : 'text-[var(--color-text-secondary)]'}`}>{b?.title || 'Not set'}</p>
              )}
            </div>
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor={`c-desc-${competency.id}-${i}`}>Description</Label>
              {editable ? (
                <Textarea id={`c-desc-${competency.id}-${i}`} rows={3} value={b?.description ?? ''} placeholder="What this looks like in practice"
                  onChange={(e) => onChangeBehavior(i, { description: e.target.value })} />
              ) : (
                <p className={`text-sm ${b?.description ? 'text-[var(--color-background-default-foreground)]' : 'text-[var(--color-text-secondary)]'}`}>{b?.description || 'Not set'}</p>
              )}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

// Master-detail: pick a competency on the left (a vertical numbered stepper), edit one rating-scale
// point at a time on the right (Tabs variant="default" — the pill/segmented look). Page height stays
// constant no matter how many competencies or scale points exist — the accordion version stacked
// every point of every competency at once.
function CompetencyEditor({ competencies, scaleSize, editable, onChangeCompetency, onRemoveCompetency, onAddCompetency }: {
  competencies: Competency[]; scaleSize: number; editable: boolean;
  onChangeCompetency: (id: string, patch: Partial<Competency>) => void;
  onRemoveCompetency: (id: string) => void; onAddCompetency: () => void;
}) {
  const [selected, setSelected] = React.useState(competencies[0]?.id ?? null);
  const prevLength = React.useRef(competencies.length);
  React.useEffect(() => {
    if (competencies.length > prevLength.current) setSelected(competencies[competencies.length - 1].id);
    else if (!competencies.some((c) => c.id === selected)) setSelected(competencies[0]?.id ?? null);
    prevLength.current = competencies.length;
  }, [competencies, selected]);

  const current = competencies.find((c) => c.id === selected);
  const setBehavior = (i: number, patch: Partial<Behavior>) => {
    if (!current) return;
    const behaviors = [...current.behaviors];
    const next = { title: '', description: '', ...behaviors[i], ...patch };
    behaviors[i] = next.title.trim() || next.description.trim() ? next : null;
    onChangeCompetency(current.id, { behaviors });
  };

  if (competencies.length === 0) {
    return (
      <div className="flex flex-col gap-[var(--spacing-component-md)]">
        <p className="text-sm text-[var(--color-text-secondary)]">No competencies yet.</p>
        {editable && (
          <Button type="button" variant="ghost" size="sm" className="self-start" onClick={onAddCompetency}>
            <PlusIcon className="h-4 w-4" aria-hidden="true" />Add competency
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-[var(--spacing-component-lg)]">
      <aside className="flex w-[220px] shrink-0 flex-col gap-[var(--spacing-component-xs)]">
        <CompetencyStepper competencies={competencies} scaleSize={scaleSize} active={selected ?? ''} onSelect={setSelected} />
        {editable && (
          <Button type="button" variant="ghost" size="sm" className="self-start" onClick={onAddCompetency}>
            <PlusIcon className="h-4 w-4" aria-hidden="true" />Add competency
          </Button>
        )}
      </aside>

      {current && (
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-lg)] border-l border-[var(--color-border-default)] pl-[var(--spacing-component-xl)]">
          {editable ? (
            <div className="flex flex-col gap-[var(--spacing-component-sm)]">
              <Input value={current.name} placeholder="Competency name, e.g. System design"
                className="text-base font-semibold" onChange={(e) => onChangeCompetency(current.id, { name: e.target.value })} />
              <Textarea rows={2} value={current.description} placeholder="What this competency covers"
                onChange={(e) => onChangeCompetency(current.id, { description: e.target.value })} />
            </div>
          ) : (
            <div>
              <h3 className="text-base font-semibold text-[var(--color-background-default-foreground)]">{current.name || 'Untitled competency'}</h3>
              {current.description && <p className="mt-[var(--spacing-component-xxs)] text-sm text-[var(--color-text-secondary)]">{current.description}</p>}
            </div>
          )}

          <LevelPanel key={current.id} competency={current} scaleSize={scaleSize} editable={editable} onChangeBehavior={setBehavior} />

          {editable && (
            <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => onRemoveCompetency(current.id)}>
              <XIcon className="h-4 w-4" aria-hidden="true" />Remove competency
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function MatrixDetail({ matrix, positions, onChange, onPublish, onArchive, onRestore, onEdit, onOpenPosition }: {
  matrix: Matrix; positions: Position[]; onChange: (m: Matrix) => void;
  onPublish: () => void; onArchive: () => void; onRestore: () => void; onEdit: () => void; onOpenPosition: (id: string) => void;
}) {
  const editable = matrix.status === 'Draft';
  const linked = positions.filter((p) => p.matrixId === matrix.id);
  const [confirmPublish, setConfirmPublish] = React.useState(false);
  const [confirmArchive, setConfirmArchive] = React.useState(false);
  const [confirmRestore, setConfirmRestore] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const issues = activationIssues(matrix);

  const touch = (patch: Partial<Matrix>) => onChange({ ...matrix, ...patch, changes: matrix.changes + 1, editedBy: 'Lan Nguyen', editedAt: 'just now' });
  const setCompetency = (id: string, patch: Partial<Competency>) =>
    touch({ competencies: matrix.competencies.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const removeCompetency = (id: string) => touch({ competencies: matrix.competencies.filter((c) => c.id !== id) });
  const addCompetency = () => touch({ competencies: [...matrix.competencies, { id: `comp-${Date.now()}`, name: '', description: '', behaviors: Array(matrix.scaleSize).fill(null) }] });

  return (
    <section className="flex min-w-0 flex-1 flex-col" aria-label={matrix.name}>
      <header className="flex items-center gap-[var(--spacing-component-lg)] border-b border-[var(--color-border-default)] p-[var(--spacing-component-xl)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
          <div className="flex items-center gap-[var(--spacing-component-sm)]">
            <h2 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">{matrix.name}</h2>
            <MatrixStatusBadge status={matrix.status} />
          </div>
          <dl className="flex flex-wrap items-center gap-x-[var(--spacing-component-xl)] gap-y-[var(--spacing-component-xs)] text-sm">
            <Meta label="Scale">{matrix.scaleSize} points</Meta>
            <Meta label="Owners">{matrix.owners.length ? matrix.owners.join(', ') : 'None yet'}</Meta>
            <Meta label="Last edited">{matrix.editedBy} · {matrix.editedAt}</Meta>
          </dl>
          <div className="flex flex-wrap items-center gap-[var(--spacing-component-xs)] pt-[var(--spacing-component-xs)]">
            <span className="text-xs text-[var(--color-text-secondary)]">{linked.length > 0 ? 'Used by' : 'Not used by any position yet'}</span>
            {linked.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenPosition(p.id)}
                className="inline-flex items-center gap-[var(--spacing-component-xs)] rounded-[var(--radius-full)] border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-xxs)] text-xs font-semibold text-[var(--color-surface-raised-foreground)] hover:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <BriefcaseIcon className="h-4 w-4" aria-hidden="true" />{p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)]">
          <Button variant="outline" onClick={() => setHistoryOpen(true)}><ClockCounterClockwiseIcon className="h-4 w-4" aria-hidden="true" />History</Button>
          <Tip label={!editable ? (matrix.status === 'Active' ? 'Archive to edit' : 'Restore to edit') : undefined}>
            <span className="inline-flex">
              <Button variant="outline" onClick={onEdit} disabled={!editable}>
                <PencilSimpleIcon className="h-4 w-4" aria-hidden="true" />Edit matrix
              </Button>
            </span>
          </Tip>
          {matrix.status === 'Draft' && (
            <Button onClick={() => setConfirmPublish(true)}><RocketLaunchIcon className="h-4 w-4" aria-hidden="true" />Publish</Button>
          )}
          {matrix.status === 'Active' && (
            <Button variant="outline" onClick={() => setConfirmArchive(true)}><ArchiveIcon className="h-4 w-4" aria-hidden="true" />Archive</Button>
          )}
          {matrix.status === 'Archived' && (
            <Button onClick={() => setConfirmRestore(true)}><ArrowCounterClockwiseIcon className="h-4 w-4" aria-hidden="true" />Restore</Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-[var(--spacing-component-xl)]">
        <CompetencyEditor
          competencies={matrix.competencies}
          scaleSize={matrix.scaleSize}
          editable={editable}
          onChangeCompetency={(id, patch) => setCompetency(id, patch)}
          onRemoveCompetency={removeCompetency}
          onAddCompetency={addCompetency}
        />
      </div>

      <AlertDialog open={confirmPublish} onOpenChange={setConfirmPublish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish {matrix.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {issues.length === 0
                ? `Positions can start using this matrix.${linked.length > 0 ? ` ${linked.length} already ${linked.length === 1 ? 'does' : 'do'}.` : ''}`
                : "This matrix isn't ready to publish yet."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {issues.length > 0 && (
            <Alert variant="warning" role="status" className="flex-row items-start gap-[var(--spacing-component-sm)]">
              <WarningIcon className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                <AlertTitle>Not ready</AlertTitle>
                <ul className="flex list-disc flex-col gap-[var(--spacing-component-xxs)] pl-[var(--spacing-component-lg)] text-sm">
                  {issues.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={issues.length > 0} onClick={onPublish}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmArchive} onOpenChange={setConfirmArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {matrix.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {linked.length > 0
                ? `${linked.length} ${linked.length === 1 ? 'position keeps' : 'positions keep'} its current expectations, but this matrix can't be assigned to new positions until you restore it.`
                : 'It becomes read-only until you restore it. Nothing is deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onArchive}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmRestore} onOpenChange={setConfirmRestore}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore {matrix.name}?</AlertDialogTitle>
            <AlertDialogDescription>It goes back to Draft. You can edit it and publish it again.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onRestore}>Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} name={matrix.name} entries={matrix.history} />
    </section>
  );
}

export function MatricesScreen({ matrices, positions, selected, onSelect, onChange, onAdd, onOpenPosition }: {
  matrices: Matrix[]; positions: Position[]; selected: string; onSelect: (id: string) => void;
  onChange: (m: Matrix) => void; onAdd: (m: Matrix) => void; onOpenPosition: (id: string) => void;
}) {
  const current = matrices.find((m) => m.id === selected) ?? matrices[0];
  const [dialog, setDialog] = React.useState<'add' | 'edit' | null>(null);

  const emptyDraft: MatrixDraft = { name: '', description: '', scaleSize: 5, owners: [] };
  const editDraft: MatrixDraft = { name: current.name, description: current.description, scaleSize: current.scaleSize, owners: current.owners };

  const saveDialog = (d: MatrixDraft) => {
    if (dialog === 'add') {
      const m: Matrix = { id: `mx-${Date.now()}`, ...d, status: 'Draft', changes: 1,
        competencies: [], editedBy: 'Lan Nguyen', editedAt: 'just now', history: [] };
      onAdd(m);
      onSelect(m.id);
    } else {
      // Resize every competency's behaviors to the new scale — pad with "not set", or drop what no longer fits.
      const competencies = current.competencies.map((c) => ({
        ...c,
        behaviors: Array.from({ length: d.scaleSize }, (_, i) => c.behaviors[i] ?? null),
      }));
      onChange({ ...current, ...d, competencies, changes: current.changes + 1, editedBy: 'Lan Nguyen', editedAt: 'just now' });
    }
    setDialog(null);
  };

  return (
    <>
      <MatrixList matrices={matrices} selected={current.id} onSelect={onSelect} onAdd={() => setDialog('add')} />
      <MatrixDetail
        key={current.id}
        matrix={current}
        positions={positions}
        onChange={onChange}
        onEdit={() => setDialog('edit')}
        onOpenPosition={onOpenPosition}
        onPublish={() => onChange({ ...current, status: 'Active', changes: 0, editedAt: 'just now' })}
        onArchive={() => onChange({ ...current, status: 'Archived', editedBy: 'Lan Nguyen', editedAt: 'just now' })}
        onRestore={() => onChange({ ...current, status: 'Draft', editedBy: 'Lan Nguyen', editedAt: 'just now' })}
      />
      <MatrixDialog
        open={dialog !== null}
        onOpenChange={(o) => { if (!o) setDialog(null); }}
        mode={dialog ?? 'add'}
        initial={dialog === 'edit' ? editDraft : emptyDraft}
        competencies={current.competencies}
        onSave={saveDialog}
      />
    </>
  );
}
