'use client';
// My Career plan changes — every one is Preview → Confirm (PRD-020 RQ-10).
// SetTargetDialog: the employee changes their Active target (no approval — it's personal).
// VisionRequestDialog: the employee sends one Career vision to their manager.
// ExplorePositionDialog: add a position's ladder; the dialog says whether it's company-path steps or a Career vision.
// SwitchPathDialog: follow a different company path planned for the employee's role.

import * as React from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { routeColor } from '@/components/ui/career-map';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { levelLabel } from '../mock-data';
import { ladderMove, positionOfLevel, publishedPositions, type Branch } from './mock-data';

/** "Backend Engineer L3 · Senior" for a level id */
export function levelName(levelId: string) {
  const position = positionOfLevel(levelId);
  const level = position.levels.find((l) => l.id === levelId)!;
  return `${position.name} ${levelLabel(position.levels, level)}`;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-xxs)] border-t border-[var(--color-border-default)] py-[var(--spacing-component-sm)] sm:flex-row sm:justify-between sm:gap-[var(--spacing-component-lg)]">
      <dt className="text-sm text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="text-sm text-[var(--color-background-default-foreground)] sm:text-right">{children}</dd>
    </div>
  );
}

export function SetTargetDialog({ open, onOpenChange, from, to, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current target, e.g. "Backend Engineer L3 · Senior" — omitted when there is none */
  from?: string;
  /** New target */
  to: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Make this your target?</AlertDialogTitle>
          <AlertDialogDescription>Your progress strip will track the new role instead.</AlertDialogDescription>
        </AlertDialogHeader>
        <dl>
          <Row label="From">{from ?? 'No target yet'}</Row>
          <Row label="To">{to}</Row>
        </dl>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {from ? `${from} stays on your map as Planned. ` : ''}Your official role doesn’t change — a target is your own goal, not a promotion or transfer.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Set as target</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function VisionRequestDialog({ open, onOpenChange, visionName, route, initialNote, onSend }: {
  open: boolean;
  /** "Career vision 2" */
  visionName: string;
  onOpenChange: (open: boolean) => void;
  /** "Backend Engineer L2 · Mid → Product Designer L1 · Designer → …" */
  route: string;
  initialNote: string;
  onSend: (note: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        {/* DialogContent unmounts when closed, so the form starts from initialNote every time it opens. */}
        <VisionRequestForm visionName={visionName} route={route} initialNote={initialNote} onSend={onSend} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function VisionRequestForm({ visionName, route, initialNote, onSend, onCancel }: {
  visionName: string; route: string; initialNote: string; onSend: (note: string) => void; onCancel: () => void;
}) {
  const [note, setNote] = React.useState(initialNote);
  return (
      <>
        <DialogHeader>
          <DialogTitle>Request manager approval</DialogTitle>
          <DialogDescription>{visionName} leaves your company path, so your manager reviews it first. You can send one career vision at a time.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-[var(--spacing-component-lg)]" onSubmit={(e) => { e.preventDefault(); onSend(note.trim()); }} noValidate>
          <dl>
            <Row label={visionName}>{route}</Row>
          </dl>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="vision-note">Note for your manager (optional)</Label>
            <Textarea id="vision-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="I’ve enjoyed the onboarding research with the design team and want to grow into design." />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your current role stays the same. You can withdraw the request while it’s waiting.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Send request</Button>
          </DialogFooter>
        </form>
      </>
  );
}

export function RemoveTargetDialog({ open, onOpenChange, target, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "Backend Engineer L3 · Senior" */
  target: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove your target?</AlertDialogTitle>
          <AlertDialogDescription>{target} stays on your map — you just stop tracking progress toward it.</AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Your progress strip stays empty until you choose another target. You can set it again any time.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Remove target</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Explore a position ──────────────────────────────────────────────────────
// Pick where to start and a Position; its whole ladder from the "Join at" level is laid out on its
// own row. The dialog says what it becomes: Planned steps when it's on a company path planned for the
// employee's role (no approval), otherwise a Career vision (private until sent; the manager approves
// it before any role in it can be the target).

export interface StartOption {
  id: string;
  /** "You are here", "Active target", "Planned", "Career vision 1" */
  label: string;
  /** Career vision number, when the card is in one — a move from it extends that vision */
  vision?: number;
}

export function ExplorePositionDialog({ open, onOpenChange, starts, defaultFrom, nextVision, onMap, followedPathId, onAdd }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cards a move can start from, in map order */
  starts: StartOption[];
  defaultFrom: string;
  /** Number a new Career vision would get */
  nextVision: number;
  /** Level ids already on the map — a role can appear only once */
  onMap: Set<string>;
  /** The company path the employee follows — its steps preview green, like on the map */
  followedPathId: string | null;
  onAdd: (branches: Branch[], message: string, select: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <ExplorePositionForm starts={starts} defaultFrom={defaultFrom} nextVision={nextVision} onMap={onMap} followedPathId={followedPathId} onAdd={onAdd} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ExplorePositionForm({ starts, defaultFrom, nextVision, onMap, followedPathId, onAdd, onCancel }: {
  starts: StartOption[]; defaultFrom: string; nextVision: number; onMap: Set<string>; followedPathId: string | null;
  onAdd: (branches: Branch[], message: string, select: string) => void; onCancel: () => void;
}) {
  const [from, setFrom] = React.useState(defaultFrom);
  const [positionId, setPositionId] = React.useState('');
  // The level the person picked; until they pick one, "Join at" shows the default for the position.
  const [pickedEntry, setPickedEntry] = React.useState('');
  const [tried, setTried] = React.useState(false);

  const position = publishedPositions.find((p) => p.id === positionId);
  const start = starts.find((s) => s.id === from);
  const vision = start?.vision ?? nextVision;
  // Default "Join at": the next level up in your own position, otherwise the position's first level.
  const defaultEntry = (p: typeof position, fromId: string) => {
    if (!p) return '';
    const here = p.levels.findIndex((l) => l.id === fromId);
    return (here >= 0 ? p.levels[here + 1] : p.levels[0])?.id ?? p.levels[0].id;
  };
  const entry = pickedEntry || defaultEntry(position, from);
  const ladder = position && entry ? position.levels.slice(position.levels.findIndex((l) => l.id === entry)).map((l) => l.id).filter((id) => !onMap.has(id)) : [];
  const move = ladderMove(from, ladder, vision);
  const error = !position ? 'Choose a position.' : !entry ? 'Choose where to join.' : !move ? `${position.name} from ${levelName(entry)} is already on your map.` : '';
  const departments = [...new Set(publishedPositions.map((p) => p.department))];

  const submit = () => {
    setTried(true);
    if (error || !move) return;
    const last = move.levels[move.levels.length - 1];
    onAdd(move.branches, move.path ? `${position!.name} added as planned steps` : `${position!.name} added to Career vision ${vision}`, last);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Explore a position</DialogTitle>
        <DialogDescription>See the path from where you are to another position. It doesn’t change your current role.</DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-[var(--spacing-component-lg)]" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <Label htmlFor="explore-from">Starting from</Label>
          <Select value={from} onValueChange={(v) => { setFrom(v); setPickedEntry(''); }}>
            <SelectTrigger id="explore-from"><SelectValue /></SelectTrigger>
            <SelectContent>{starts.map((s) => <SelectItem key={s.id} value={s.id}>{s.label} · {levelName(s.id)}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-[var(--spacing-component-md)] sm:grid-cols-2">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="explore-position">Position</Label>
            <Select value={positionId} onValueChange={(v) => { setPositionId(v); setPickedEntry(''); }}>
              <SelectTrigger id="explore-position" aria-invalid={(tried && !positionId) || undefined}><SelectValue placeholder="Choose a position" /></SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectGroup key={dept}>
                    <SelectLabel>{dept}</SelectLabel>
                    {publishedPositions.filter((p) => p.department === dept).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="explore-entry">Join at</Label>
            <Select value={entry} onValueChange={(v) => v && setPickedEntry(v)} disabled={!position}>
              <SelectTrigger id="explore-entry" aria-invalid={(tried && !!error && !!position) || undefined}><SelectValue placeholder="Choose a level" /></SelectTrigger>
              <SelectContent>{position?.levels.map((l) => <SelectItem key={l.id} value={l.id}>{levelLabel(position.levels, l)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {tried && error && <p role="alert" className="text-sm text-[var(--color-text-invalid)]">{error}</p>}

        {move && (
          <RoutePreview
            from={from}
            fromLabel={start?.label}
            levels={move.levels}
            heading={move.path
              ? `Part of ${move.path.name} · no approval needed`
              : start?.vision ? `Joins Career vision ${vision}` : `Becomes Career vision ${vision}`}
            note={move.path ? undefined : 'Private until you send it for approval.'}
            color={move.path ? routeColor({ id: move.path.id, name: move.path.name, color: move.path.color, followed: move.path.id === followedPathId }) : routeColor({ id: 'vision', name: '', kind: 'vision' })}
            dashed={!move.path}
          />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add to my map</Button>
        </DialogFooter>
      </form>
    </>
  );
}

// The route as a vertical step rail — the map's line language turned on its side: dashed violet for a
// Career vision, solid in the path's colour for company-path steps. The start card is grey context.
function RoutePreview({ from, fromLabel, levels, heading, note, color, dashed }: {
  from: string; fromLabel?: string; levels: string[]; heading: string; note?: string; color: string; dashed: boolean;
}) {
  // Dots are solid rings painted over the rail (a 12px dashed ring breaks into fragments); the rail's
  // dash carries the Career-vision signal.
  const dot = 'relative h-3 w-3 shrink-0 rounded-[var(--radius-pill)] border-2 bg-[var(--color-background-default)]';
  const row = 'relative flex min-h-[var(--height-control-md)] items-center gap-[var(--spacing-component-sm)] text-sm';
  return (
    <div role="status" className="flex flex-col gap-[var(--spacing-component-xs)]">
      <p className="text-xs font-semibold text-[var(--color-text-secondary)]">{heading}</p>
      <div className="relative">
        {/* The rail: from the first dot's centre to the last's. */}
        <span
          aria-hidden="true"
          className={`absolute bottom-[calc(var(--height-control-md)/2)] left-[5px] top-[calc(var(--height-control-md)/2)] border-l-2 ${dashed ? 'border-dashed' : 'border-solid'}`}
          style={{ borderColor: color }}
        />
        <ol aria-label="Route" className="flex flex-col">
          <li className={row}>
            <span aria-hidden="true" className={`${dot} border-[var(--color-border-strong)]`} />
            <span className="text-[var(--color-text-secondary)]">
              {levelName(from)}
              {fromLabel && <> · <span className={fromLabel === 'You are here' ? 'text-[var(--career-map-current-label)]' : undefined}>{fromLabel}</span></>}
            </span>
          </li>
          {levels.map((id) => (
            <li key={id} className={row}>
              <span aria-hidden="true" className={dot} style={{ borderColor: color }} />
              <span className="font-semibold text-[var(--color-background-default-foreground)]">{levelName(id)}</span>
            </li>
          ))}
        </ol>
      </div>
      {note && <p className="text-sm text-[var(--color-text-secondary)]">{note}</p>}
    </div>
  );
}

// ─── Switch company path ─────────────────────────────────────────────────────

export function SwitchPathDialog({ open, onOpenChange, from, to, targetNote, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The path followed now — omitted when none */
  from?: string;
  to: string;
  /** Set when the Active target isn't on the new path and will move */
  targetNote?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{from ? 'Follow a different company path?' : `Follow ${to}?`}</AlertDialogTitle>
          <AlertDialogDescription>Your map shows the path you follow from your current role.</AlertDialogDescription>
        </AlertDialogHeader>
        <dl>
          <Row label="From">{from ?? 'No company path'}</Row>
          <Row label="To">{to}</Row>
        </dl>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {targetNote ?? 'Your Active target stays the same.'} Paths and career visions you added stay on your map.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Follow {to}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
