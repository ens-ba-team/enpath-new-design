'use client';
import * as React from 'react';
import { CaretDownIcon, ClockCounterClockwiseIcon, CopyIcon, DotsThreeIcon, EyeSlashIcon, SparkleIcon, WarningIcon, SquaresFourIcon, FlagCheckeredIcon, MagnifyingGlassIcon, PaintBucketIcon, PencilSimpleIcon, PlusIcon, RocketLaunchIcon, UploadSimpleIcon } from '@phosphor-icons/react/ssr';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnpathAppShell } from '../app-shell';
import { ChatPanel, type LevelProposal } from '../chat/chat-panel';
import { useSidebar } from '@/components/ui/sidebar';
import { departments, initialCareerPaths, initialMatrices, initialPositions, levelLabel, scale, type CareerPath, type Expectations, type Level, type Matrix, type Position } from '../mock-data';
import { PositionDialog, type PositionDraft } from './position-dialog';
import { MatricesScreen } from './matrices-screen';
import { HistoryDrawer } from './history-drawer';
import { ImportPositionsDialog } from './import-positions-dialog';
import { CareerPathScreen } from './career-path-screen';
import { Tip } from '../tip';

// Setup → Career structure (sketch, 2026-09-22).
// Left: position list (search · list · + Add position). Right: the selected position —
// name, status, matrix, then the Competency × Level grid with every cell visible.
// The grid cell is a DRAFT of the stepped fill slider (option F) — a real component comes later.
// Header holds status + actions: Edit, Publish (confirm lists what goes live). The meta line links the matrix
// (→ Matrices config). History is a header button. Matrix is set in the Create / Edit position dialog; status only via Publish / Unpublish.

const emptyGrid = (matrices: Matrix[], matrixId: string, levels: Level[]): Expectations => {
  const m = matrices.find((x) => x.id === matrixId)!;
  return Object.fromEntries(m.competencies.map((c) => [c.id, Object.fromEntries(levels.map((l) => [l.id, null]))]));
};
const unsetCount = (matrices: Matrix[], p: Position) =>
  matrices.find((m) => m.id === p.matrixId)!.competencies.reduce((n, c) => n + p.levels.filter((l) => p.expectations[c.id]?.[l.id] == null).length, 0);

// Duplicate a position: its new Levels get new ids, so expectations are remapped by level order,
// not id. If the admin adds/removes levels in the dialog before saving, alignment past the shorter
// list just falls back to "Not set" — a known simplification for a prototype.
const remapExpectations = (source: Position, newLevels: Level[]): Expectations => {
  const out: Expectations = {};
  for (const cId of Object.keys(source.expectations)) {
    out[cId] = {};
    newLevels.forEach((l, i) => {
      const srcLevel = source.levels[i];
      out[cId][l.id] = srcLevel ? source.expectations[cId]?.[srcLevel.id] ?? null : null;
    });
  }
  return out;
};

// One status badge for the list and the detail header.
function StatusBadge({ status }: { status: Position['status'] }) {
  if (status === 'Published') return <Badge variant="success">Published</Badge>;
  return <Badge variant="warning">Draft</Badge>;
}

// Segment n uses color/scale/n — darker per step.
const stepFill = ['bg-[var(--color-scale-1)]', 'bg-[var(--color-scale-2)]', 'bg-[var(--color-scale-3)]', 'bg-[var(--color-scale-4)]', 'bg-[var(--color-scale-5)]'];

// Draft cell: segments filled up to the value, one per scale point of the Position's Matrix (2–5 — Matrices tab sets this). Click a segment or press a number; 0/Backspace clears; arrows step.
// Published positions are read-only (Lattice model) — Unpublish first to edit — so the cell drops its slider role and handlers.
function LevelCell({ id, value, onChange, label, readOnly, max }: { id?: string; value: number | null; onChange: (v: number | null) => void; label: string; readOnly?: boolean; max: number }) {
  const steps = Array.from({ length: max }, (_, i) => i + 1);
  const segments = (interactive: boolean) => (
    <div className="flex gap-[var(--spacing-component-xs)]">
      {steps.map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onChange(value === n ? null : n)}
            className={`h-2 flex-1 first:rounded-l-[var(--radius-full)] last:rounded-r-[var(--radius-full)] ${value && n <= value ? stepFill[n - 1] : 'bg-[var(--color-surface-raised)] hover:bg-[var(--color-border-default)]'}`}
          />
        ) : (
          <span key={n} aria-hidden="true" className={`h-2 flex-1 first:rounded-l-[var(--radius-full)] last:rounded-r-[var(--radius-full)] ${value && n <= value ? stepFill[n - 1] : 'bg-[var(--color-surface-raised)]'}`} />
        ),
      )}
    </div>
  );
  const valueLabel = (
    <span className={`text-xs ${value ? 'text-[var(--color-background-default-foreground)]' : 'text-[var(--color-text-secondary)]'}`}>
      {value ? `${value} · ${scale[value - 1]}` : 'Not set'}
    </span>
  );

  if (readOnly) {
    return (
      <div id={id} aria-label={label} className="flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] p-[var(--spacing-component-sm)]">
        {segments(false)}
        {valueLabel}
      </div>
    );
  }

  return (
    <div
      id={id}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      aria-valuetext={value ? `${value} ${scale[value - 1]}` : 'Not set'}
      onKeyDown={(e) => {
        if (new RegExp(`^[1-${max}]$`).test(e.key)) onChange(Number(e.key));
        if (e.key === '0' || e.key === 'Backspace') onChange(null);
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(max, (value ?? 0) + 1)); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(value && value > 1 ? value - 1 : null); }
      }}
      className="flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] p-[var(--spacing-component-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
    >
      {segments(true)}
      {valueLabel}
    </div>
  );
}

// Grouped by department — a collapsible uppercase caption per group, same visual language as the
// app sidebar's own group labels ("WORKSPACE" / "OPERATIONS"), not a new pattern.
function PositionList({ positions, selected, onSelect, onAdd, onImport }: {
  positions: Position[]; selected: string; onSelect: (id: string) => void; onAdd: () => void; onImport: () => void;
}) {
  const [query, setQuery] = React.useState('');
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());
  const shown = positions.filter((p) => `${p.name} ${p.code}`.toLowerCase().includes(query.trim().toLowerCase()));
  const groups = departments
    .map((d) => ({ department: d, items: shown.filter((p) => p.department === d) }))
    .filter((g) => g.items.length > 0);
  const toggleGroup = (d: string) => setCollapsedGroups((prev) => {
    const next = new Set(prev);
    if (next.has(d)) next.delete(d); else next.add(d);
    return next;
  });

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--color-border-default)]">
      <div className="flex flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-lg)]">
        <h2 className="text-base font-semibold text-[var(--color-background-default-foreground)]">Positions</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-[var(--spacing-component-sm)] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search positions" aria-label="Search positions" className="pl-[var(--spacing-component-xl)]!" />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto px-[var(--spacing-component-md)]" aria-label="Positions">
        {groups.map((g) => (
          <Collapsible key={g.department} open={!collapsedGroups.has(g.department)} onOpenChange={() => toggleGroup(g.department)}>
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-[var(--spacing-component-xs)] rounded-[var(--radius-sm)] px-[var(--spacing-component-xs)] py-[var(--spacing-component-sm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">{g.department} · {g.items.length}</span>
              <CaretDownIcon className={`h-3 w-3 shrink-0 text-[var(--color-text-secondary)] transition-transform ${collapsedGroups.has(g.department) ? '-rotate-90' : ''}`} aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="flex flex-col gap-[var(--spacing-component-xs)] pb-[var(--spacing-component-sm)]">
                {g.items.map((p) => (
                  <li key={p.id}>
                    <Item
                      size="sm"
                      className="px-[var(--spacing-component-md)]"
                      title={p.name}
                      description={<span className="text-xs">{p.code} · {p.levels.length} {p.levels.length === 1 ? 'level' : 'levels'}</span>}
                      action={<StatusBadge status={p.status} />}
                      selected={p.id === selected}
                      onSelect={() => onSelect(p.id)}
                    />
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
        {groups.length === 0 && <p className="p-[var(--spacing-component-sm)] text-sm text-[var(--color-text-secondary)]">No positions match “{query}”.</p>}
      </div>
      <div className="flex gap-[var(--spacing-component-sm)] border-t border-[var(--color-border-default)] p-[var(--spacing-component-lg)]">
        <Button variant="outline" className="flex-1" onClick={onAdd}><PlusIcon className="h-4 w-4" aria-hidden="true" />Add position</Button>
        <Tip label="Import CSV">
          <Button variant="outline" size="icon" aria-label="Import CSV" onClick={onImport}><UploadSimpleIcon className="h-4 w-4" aria-hidden="true" /></Button>
        </Tip>
      </div>
    </aside>
  );
}

// One label/value pair in the properties row under the title.
function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[var(--spacing-component-sm)]">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="text-[var(--color-background-default-foreground)]">{children}</dd>
    </div>
  );
}

// Editing only happens on a Draft (Published is read-only — Unpublish first), so this always stays Draft.
const edited = (p: Position, patch: Partial<Position>): Position =>
  ({ ...p, ...patch, status: 'Draft', changes: p.changes + 1, editedBy: 'Lan Nguyen', editedAt: 'just now' });

function PositionDetail({ position, matrix, onChange, onPublish, onUnpublish, onEdit, onDuplicate, onOpenMatrix }: {
  position: Position; matrix: Matrix; onChange: (p: Position) => void; onPublish: () => void; onUnpublish: () => void; onEdit: () => void; onDuplicate: () => void; onOpenMatrix: () => void;
}) {
  const [confirm, setConfirm] = React.useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const setCell = (cId: string, lId: string, v: number | null) =>
    onChange(edited(position, { expectations: { ...position.expectations, [cId]: { ...position.expectations[cId], [lId]: v } } }));
  const fillLevel = (levelId: string, value: number | null, replaceAll: boolean) => {
    const expectations = Object.fromEntries(matrix.competencies.map((competency) => {
      const row = position.expectations[competency.id] ?? {};
      return [competency.id, {
        ...row,
        [levelId]: replaceAll || row[levelId] == null ? value : row[levelId],
      }];
    }));
    onChange(edited(position, { expectations }));
  };
  const unsetCells = matrix.competencies.flatMap((c) => position.levels.filter((l) => position.expectations[c.id]?.[l.id] == null).map((l) => ({ c, l })));
  const jumpTo = (cId: string, lId: string) => { setConfirm(false); setTimeout(() => document.getElementById(`cell-${cId}-${lId}`)?.focus(), 50); };

  return (
    <section className="flex min-w-0 flex-1 flex-col" aria-label={position.name}>
      <header className="flex items-center gap-[var(--spacing-component-lg)] border-b border-[var(--color-border-default)] p-[var(--spacing-component-xl)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
          <div className="flex items-center gap-[var(--spacing-component-sm)]">
            <h2 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">{position.name}</h2>
            <StatusBadge status={position.status} />
          </div>
          <dl className="flex flex-wrap items-center gap-x-[var(--spacing-component-xl)] gap-y-[var(--spacing-component-xs)] text-sm">
            <Meta label="Matrix">
              {/* Neutral chip, not a link: information first, a shortcut to Matrices config second */}
              <Tip label="Open in Matrices config">
                <button
                  type="button"
                  onClick={onOpenMatrix}
                  className="inline-flex items-center gap-[var(--spacing-component-xs)] rounded-[var(--radius-full)] border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-xxs)] text-xs font-semibold text-[var(--color-surface-raised-foreground)] hover:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                >
                  <SquaresFourIcon className="h-4 w-4" aria-hidden="true" />{matrix.name}
                </button>
              </Tip>
            </Meta>
            <Meta label="Last edited">{position.editedBy} · {position.editedAt}</Meta>
          </dl>
        </div>
        <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)]">
          <Tip label={position.status === 'Published' ? 'Unpublish to edit' : undefined}>
            <span className="inline-flex">
              <Button variant="outline" onClick={onEdit} disabled={position.status === 'Published'}>
                <PencilSimpleIcon className="h-4 w-4" aria-hidden="true" />Edit position
              </Button>
            </span>
          </Tip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More actions"><DotsThreeIcon className="h-4 w-4" aria-hidden="true" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setHistoryOpen(true)}><ClockCounterClockwiseIcon className="h-4 w-4" aria-hidden="true" />History</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDuplicate}><CopyIcon className="h-4 w-4" aria-hidden="true" />Duplicate position</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {position.status === 'Published' && (
            <Button variant="outline" onClick={() => setConfirmUnpublish(true)}><EyeSlashIcon className="h-4 w-4" aria-hidden="true" />Unpublish</Button>
          )}
          {position.status === 'Draft' && (
            <Button onClick={() => setConfirm(true)}><RocketLaunchIcon className="h-4 w-4" aria-hidden="true" />Publish</Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-[var(--spacing-component-xl)]">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 w-[160px] border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] text-left font-semibold">Competency</th>
              {position.levels.map((l) => {
                const label = levelLabel(position.levels, l);
                const unsetInLevel = matrix.competencies.filter((c) => position.expectations[c.id]?.[l.id] == null).length;
                const readOnly = position.status === 'Published';
                return (
                  <th key={l.id} scope="col" className="min-w-[144px] border-b border-[var(--color-border-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] text-left font-semibold">
                    <div className="flex items-center justify-between gap-[var(--spacing-component-sm)]">
                      <span>{label}</span>
                      <DropdownMenu>
                        <Tip label={readOnly ? 'Unpublish to edit' : `Fill ratings for ${label}`}>
                          <span className="inline-flex">
                            <DropdownMenuTrigger asChild disabled={readOnly}>
                              <Button variant="ghost" size="icon-sm" aria-label={`Fill ratings for ${label}`} disabled={readOnly}>
                                <PaintBucketIcon className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </DropdownMenuTrigger>
                          </span>
                        </Tip>
                        <DropdownMenuContent align="end" className="min-w-[220px]">
                          <DropdownMenuLabel>Fill {label}</DropdownMenuLabel>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger disabled={unsetInLevel === 0}>
                              Fill unset cells only
                              <span className="ml-auto text-xs font-normal text-[var(--color-text-secondary)]">{unsetInLevel}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {scale.slice(0, matrix.scaleSize).map((rating, index) => (
                                <DropdownMenuItem key={rating} onClick={() => fillLevel(l.id, index + 1, false)}>
                                  {index + 1} · {rating}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Replace all ratings</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {scale.slice(0, matrix.scaleSize).map((rating, index) => (
                                <DropdownMenuItem key={rating} onClick={() => fillLevel(l.id, index + 1, true)}>
                                  {index + 1} · {rating}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => fillLevel(l.id, null, true)}>Clear level</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {matrix.competencies.map((c) => (
              <tr key={c.id}>
                <th scope="row" className="sticky left-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-background-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] text-left font-normal">{c.name}</th>
                {position.levels.map((l) => (
                  <td key={l.id} className="border-b border-[var(--color-border-subtle)] p-[var(--spacing-component-xs)]">
                    <LevelCell id={`cell-${c.id}-${l.id}`} label={`${c.name}, ${levelLabel(position.levels, l)}`} value={position.expectations[c.id]?.[l.id] ?? null} onChange={(v) => setCell(c.id, l.id, v)} readOnly={position.status === 'Published'} max={matrix.scaleSize} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish {position.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {position.changes} {position.changes === 1 ? 'change' : 'changes'} to review. Employees and managers will see the new expectations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {unsetCells.length > 0 && (
            <Alert variant="warning" role="status" className="flex-row items-start gap-[var(--spacing-component-sm)]">
              <WarningIcon className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                <AlertTitle>{unsetCells.length} {unsetCells.length === 1 ? 'cell' : 'cells'} not set</AlertTitle>
                <AlertDescription>You can still publish. Unset cells show as “Not set” to employees.</AlertDescription>
                <ul className="flex flex-wrap gap-[var(--spacing-component-xs)]" aria-label="Go to an unset cell">
                  {unsetCells.slice(0, 6).map(({ c, l }) => (
                    <li key={`${c.id}-${l.id}`}>
                      <Button type="button" variant="outline" size="xs" onClick={() => jumpTo(c.id, l.id)}>
                        {c.name} · L{position.levels.indexOf(l) + 1}
                      </Button>
                    </li>
                  ))}
                  {unsetCells.length > 6 && <li className="self-center text-xs">+{unsetCells.length - 6} more</li>}
                </ul>
              </div>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onPublish}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmUnpublish} onOpenChange={setConfirmUnpublish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish {position.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              It goes back to Draft. Employees and managers stop seeing its expectations until you publish it again. Nothing is deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onUnpublish}>Unpublish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} name={position.name} entries={position.history} />
    </section>
  );
}

// Opening the chat collapses the sidebar; closing it restores what the user had.
function SidebarFollowsChat({ chatOpen }: { chatOpen: boolean }) {
  const { collapsed, setCollapsed } = useSidebar();
  const before = React.useRef(collapsed);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (chatOpen) { before.current = collapsed; setCollapsed(true); } else setCollapsed(before.current);
  }, [chatOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="p-[var(--spacing-component-xl)] text-sm text-[var(--color-text-secondary)]">{children}</p>;
}

export function SetupScreen({ sidebarClassName, initialTab = 'structure' }: { sidebarClassName?: string; initialTab?: 'structure' | 'matrices' | 'paths' } = {}) {
  const [page, setPage] = React.useState('Setup');
  const [positions, setPositions] = React.useState(initialPositions);
  const [selected, setSelected] = React.useState(initialPositions[0].id);
  const current = positions.find((p) => p.id === selected)!;
  const update = (p: Position) => setPositions((all) => all.map((x) => (x.id === p.id ? p : x)));

  const [matrices, setMatrices] = React.useState(initialMatrices);
  const [careerPaths, setCareerPaths] = React.useState(initialCareerPaths);
  const [selectedPath, setSelectedPath] = React.useState(initialCareerPaths[0].id);
  const [selectedMatrix, setSelectedMatrix] = React.useState(initialMatrices[0].id);
  const updateMatrix = (m: Matrix) => setMatrices((all) => all.map((x) => (x.id === m.id ? m : x)));
  const addMatrix = (m: Matrix) => setMatrices((all) => [...all, m]);
  const updatePath = (p: CareerPath) => setCareerPaths((all) => all.map((x) => (x.id === p.id ? p : x)));
  const addPath = (p: CareerPath) => setCareerPaths((all) => [...all, p]);
  const currentMatrix = matrices.find((m) => m.id === current.matrixId)!;

  // Progress = share of expectation cells set across all positions.
  const total = positions.reduce((n, p) => n + p.levels.length * matrices.find((m) => m.id === p.matrixId)!.competencies.length, 0);
  const unsetTotal = positions.reduce((n, p) => n + unsetCount(matrices, p), 0);
  const drafts = positions.filter((p) => p.status !== 'Published').length;
  const [tab, setTab] = React.useState(initialTab);
  const tabUrlReady = React.useRef(false);
  const done = total === 0 ? 0 : Math.round(((total - positions.reduce((n, p) => n + unsetCount(matrices, p), 0)) / total) * 100);

  const [dialog, setDialog] = React.useState<'add' | 'edit' | null>(null);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [proposal, setProposal] = React.useState<LevelProposal | null>(null);
  const [duplicateSourceId, setDuplicateSourceId] = React.useState<string | null>(null);
  const duplicateSource = duplicateSourceId ? positions.find((p) => p.id === duplicateSourceId) ?? null : null;
  const [importOpen, setImportOpen] = React.useState(false);
  React.useEffect(() => {
    const syncFromUrl = () => {
      const requested = new URLSearchParams(window.location.search).get('tab');
      if (requested === 'structure' || requested === 'matrices' || requested === 'paths') setTab(requested);
    };

    if (!tabUrlReady.current) {
      tabUrlReady.current = true;
      const requested = new URLSearchParams(window.location.search).get('tab');
      if ((requested === 'structure' || requested === 'matrices' || requested === 'paths') && requested !== tab) {
        setTab(requested);
        return;
      }
    }

    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState(window.history.state, '', url);

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [tab]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); setChatOpen((o) => !o); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const emptyDraft = React.useMemo<PositionDraft>(() => {
    if (duplicateSource) {
      return {
        name: `${duplicateSource.name} (copy)`, code: '', description: duplicateSource.description ?? '',
        matrixId: duplicateSource.matrixId, department: duplicateSource.department,
        levels: duplicateSource.levels.map((l, i) => ({ id: `lvl-dup-${Date.now()}-${i}`, name: l.name, headcount: 0 })),
      };
    }
    return { name: '', code: '', description: '', matrixId: 'eng', department: departments[0], levels: [{ id: `lvl-new-${Date.now()}`, name: '', headcount: 0 }] };
  }, [dialog, duplicateSource]); // eslint-disable-line react-hooks/exhaustive-deps
  const editDraft = React.useMemo<PositionDraft>(() => ({ name: current.name, code: current.code, description: current.description ?? '', matrixId: current.matrixId, department: current.department, levels: proposal ? [...current.levels, { id: `lvl-ai-${Date.now()}`, name: proposal.levelName, headcount: 0 }] : current.levels }), [current, proposal]);
  const saveDialog = (d: PositionDraft) => {
    if (dialog === 'add') {
      const p: Position = { id: `pos-${Date.now()}`, ...d, status: 'Draft', changes: 1,
        expectations: duplicateSource ? remapExpectations(duplicateSource, d.levels) : emptyGrid(matrices, d.matrixId, d.levels),
        editedBy: 'Lan Nguyen', editedAt: 'just now', history: [] };
      setPositions((all) => [...all, p]);
      setSelected(p.id);
      setDuplicateSourceId(null);
    } else {
      // Keep expectations of kept levels; new levels start Not set; removed levels drop out.
      // Same matrix: keep expectations of kept levels, new levels start Not set. New matrix: everything clears.
      const m = matrices.find((x) => x.id === d.matrixId)!;
      const keep = d.matrixId === current.matrixId;
      const expectations = Object.fromEntries(m.competencies.map((c) => [c.id, Object.fromEntries(d.levels.map((l) => [l.id, keep ? current.expectations[c.id]?.[l.id] ?? null : null]))]));
      update(edited(current, { ...d, expectations }));
    }
    setDialog(null);
    setProposal(null);
  };

  return (
    <TooltipProvider>
    <EnpathAppShell
      active={page}
      onNavigate={setPage}
      sidebarClassName={sidebarClassName}
      rightPanel={chatOpen && (
        <ChatPanel
          context={{
            positionName: current.name,
            levelNames: current.levels.map((l) => l.name),
            unsetCells: currentMatrix.competencies.flatMap((c) => current.levels.filter((l) => current.expectations[c.id]?.[l.id] == null).map((l) => `${c.name} · L${current.levels.indexOf(l) + 1}`)),
          }}
          onClose={() => setChatOpen(false)}
          onReviewProposal={(p) => { if (current.status === 'Draft') { setProposal(p); setDialog('edit'); } }}
        />
      )}
    >
      <SidebarFollowsChat chatOpen={chatOpen} />
      {page !== 'Setup' ? (
        <Placeholder>{page} — not built yet. Go to Setup.</Placeholder>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-[var(--spacing-component-lg)] px-[var(--spacing-component-xl)] pt-[var(--spacing-component-xl)]">
            <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">Setup</h1>
            <Alert
              variant="success"
              role="status"
              title={`${unsetTotal} ${unsetTotal === 1 ? 'cell' : 'cells'} not set · ${drafts} ${drafts === 1 ? 'position' : 'positions'} not published`}
              className="ml-auto w-auto flex-row items-center gap-[var(--spacing-component-md)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]"
            >
              <FlagCheckeredIcon className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>Your setup is {done}% done</AlertTitle>
              {/* Green fill before 100% — overrides Progress's brand fill; see note in reply */}
              <Progress value={done} aria-label="Setup progress" className="w-[160px] bg-[var(--color-background-default)] [&>div]:bg-[var(--color-status-success)]" />
            </Alert>
            {!chatOpen && (
              <Tip label="Ask AI (⌘I)">
                <Button variant="outline" onClick={() => setChatOpen(true)}>
                  <SparkleIcon className="h-4 w-4" aria-hidden="true" />Ask AI
                </Button>
              </Tip>
            )}
          </div>
          <Tabs value={tab} onValueChange={(value) => { if (value === 'structure' || value === 'matrices' || value === 'paths') setTab(value); }} className="mt-[var(--spacing-component-lg)] flex min-h-0 flex-1 flex-col">
            <TabsList variant="line" className="px-[var(--spacing-component-xl)]">
              <TabsTrigger variant="line" value="structure">Career structure</TabsTrigger>
              <TabsTrigger variant="line" value="matrices">Matrices config</TabsTrigger>
              <TabsTrigger variant="line" value="paths">Career path</TabsTrigger>
            </TabsList>
            <TabsContent value="structure" className="mt-0 flex min-h-0 flex-1 border-t border-[var(--color-border-default)]">
              <PositionList positions={positions} selected={selected} onSelect={setSelected} onAdd={() => setDialog('add')} onImport={() => setImportOpen(true)} />
              <PositionDetail key={current.id} position={current} matrix={currentMatrix} onChange={update} onEdit={() => setDialog('edit')}
                onDuplicate={() => { setDuplicateSourceId(current.id); setDialog('add'); }}
                onOpenMatrix={() => { setSelectedMatrix(current.matrixId); setTab('matrices'); }}
                onPublish={() => update({ ...current, status: 'Published', changes: 0, editedAt: 'just now' })}
                onUnpublish={() => update({ ...current, status: 'Draft', editedBy: 'Lan Nguyen', editedAt: 'just now' })} />
            </TabsContent>
            <TabsContent value="matrices" className="mt-0 flex min-h-0 flex-1 border-t border-[var(--color-border-default)]">
              <MatricesScreen matrices={matrices} positions={positions} selected={selectedMatrix} onSelect={setSelectedMatrix} onChange={updateMatrix} onAdd={addMatrix}
                onOpenPosition={(id) => { setSelected(id); setTab('structure'); }} />
            </TabsContent>
            <TabsContent value="paths" className="mt-0 flex min-h-0 flex-1 border-t border-[var(--color-border-default)]">
              <CareerPathScreen paths={careerPaths} positions={positions} selected={selectedPath} onSelect={setSelectedPath} onChange={updatePath} onAdd={addPath} />
            </TabsContent>
          </Tabs>
        </div>
      )}
      <PositionDialog open={dialog !== null} onOpenChange={(o) => { if (!o) { setDialog(null); setProposal(null); setDuplicateSourceId(null); } }} mode={dialog ?? 'add'} initial={dialog === 'edit' ? editDraft : emptyDraft} onSave={saveDialog}
        matrices={matrices} setCount={currentMatrix.competencies.length * current.levels.length - unsetCount(matrices, current)} />
      <ImportPositionsDialog open={importOpen} onOpenChange={setImportOpen} matrices={matrices}
        existingCodes={new Set(positions.map((p) => p.code))}
        onImport={(imported) => { setPositions((all) => [...all, ...imported]); setImportOpen(false); }} />
    </EnpathAppShell>
    </TooltipProvider>
  );
}
