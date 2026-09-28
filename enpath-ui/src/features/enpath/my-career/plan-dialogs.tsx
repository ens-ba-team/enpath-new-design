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
import { InfoIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { StepRail, StepRailItem, type StepRailTone } from '@/components/ui/step-rail';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { levelLabel } from '../mock-data';
import { ladderMove, positionOfLevel, publishedPositions, visionMove, type Branch, type Plan } from './mock-data';

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
          {from ? `${from} stays on your map as Planned. ` : ''}Your official role doesn’t change. A target is your own goal, not a promotion or transfer.
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
  /** The vision's roles in order as names, starting from the card it branches from */
  route: string[];
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
  visionName: string; route: string[]; initialNote: string; onSend: (note: string) => void; onCancel: () => void;
}) {
  const [note, setNote] = React.useState(initialNote);
  // Minimal layout (option C, 2026-09-27): the route collapses to start → destination + a role count,
  // so a long vision never turns back into a sentence.
  const added = route.length - 1;
  const summary = `${route[0]} → ${route[route.length - 1]} · ${added} new ${added === 1 ? 'role' : 'roles'}`;
  return (
      <>
        <DialogHeader>
          <DialogTitle>Send {visionName} for approval</DialogTitle>
          <DialogDescription>{summary}</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-[var(--spacing-component-lg)]" onSubmit={(e) => { e.preventDefault(); onSend(note.trim()); }} noValidate>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="vision-note">Note for your manager (optional)</Label>
            <Textarea id="vision-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="I’ve enjoyed the onboarding research with the design team and want to grow into design." />
          </div>
          <p className="flex items-start gap-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]">
            <InfoIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            Your current role stays the same. You can withdraw it while it’s waiting.
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
          <AlertDialogDescription>{target} stays on your map. You just stop tracking progress toward it.</AlertDialogDescription>
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

export function ExplorePositionDialog({ open, onOpenChange, starts, defaultFrom, nextVision, plan, onMap, followedPathId, onAdd }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cards a move can start from, in map order */
  starts: StartOption[];
  defaultFrom: string;
  /** Number a new Career vision would get */
  nextVision: number;
  /** The saved plan: decides whether a Career vision move extends a vision or starts a new one */
  plan: Plan;
  /** Level ids already on the map — a role can appear only once */
  onMap: Set<string>;
  /** The company path the employee follows — its steps preview green, like on the map */
  followedPathId: string | null;
  onAdd: (branches: Branch[], message: string, select: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <ExplorePositionForm starts={starts} defaultFrom={defaultFrom} nextVision={nextVision} plan={plan} onMap={onMap} followedPathId={followedPathId} onAdd={onAdd} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ExplorePositionForm({ starts, defaultFrom, nextVision, plan, onMap, followedPathId, onAdd, onCancel }: {
  starts: StartOption[]; defaultFrom: string; nextVision: number; plan: Plan; onMap: Set<string>; followedPathId: string | null;
  onAdd: (branches: Branch[], message: string, select: string) => void; onCancel: () => void;
}) {
  const [from, setFrom] = React.useState(defaultFrom);
  const [positionId, setPositionId] = React.useState('');
  // The level the person picked; until they pick one, "Join at" shows the default for the position.
  const [pickedEntry, setPickedEntry] = React.useState('');
  const [tried, setTried] = React.useState(false);

  const position = publishedPositions.find((p) => p.id === positionId);
  // Default "Join at": the next level up in your own position, otherwise the position's first level.
  const defaultEntry = (p: typeof position, fromId: string) => {
    if (!p) return '';
    const here = p.levels.findIndex((l) => l.id === fromId);
    return (here >= 0 ? p.levels[here + 1] : p.levels[0])?.id ?? p.levels[0].id;
  };
  const entry = pickedEntry || defaultEntry(position, from);
  const ladder = position && entry ? position.levels.slice(position.levels.findIndex((l) => l.id === entry)).map((l) => l.id) : [];
  // Company-path steps add only roles not on the map yet (as before). Anything else is a Career
  // vision: one road, reusing cards already on the map (visionMove).
  const fresh = ladder.filter((id) => !onMap.has(id));
  const pathMove = fresh.length ? ladderMove(from, fresh, nextVision) : null;
  const move = pathMove?.path ? { ...pathMove, route: pathMove.levels, start: from, vision: undefined, joins: false } : visionMove(plan, from, ladder, nextVision);
  const error = !position ? 'Choose a position.' : !entry ? 'Choose where to join.' : !move ? `${position.name} from ${levelName(entry)} is already on your map.` : '';
  const departments = [...new Set(publishedPositions.map((p) => p.department))];

  const submit = () => {
    setTried(true);
    if (error || !move) return;
    const last = move.levels[move.levels.length - 1];
    onAdd(move.branches, move.path ? `${position!.name} added as planned steps` : `${position!.name} added to Career vision ${move.vision}`, last);
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
            from={move.start}
            fromLabel={starts.find((s) => s.id === move.start)?.label}
            levels={move.route}
            onMap={onMap}
            heading={move.path
              ? `Part of ${move.path.name} · no approval needed`
              : move.joins ? `Joins Career vision ${move.vision}` : `Becomes Career vision ${move.vision}`}
            note={move.path ? undefined : 'Private until you send it for approval.'}
            tone={move.path ? (move.path.id === followedPathId ? 'followed' : 'other') : 'vision'}
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

// The route as a StepRail — the map's line language turned on its side, in the route's role colour
// (dashed violet for a Career vision). The start card is grey context; a role already on the map is
// reused and reads "already on your map".
function RoutePreview({ from, fromLabel, levels, onMap, heading, note, tone }: {
  from: string; fromLabel?: string; levels: string[]; onMap: Set<string>; heading: string; note?: string; tone: StepRailTone;
}) {
  return (
    <div role="status" className="flex flex-col gap-[var(--spacing-component-xs)]">
      <p className="text-xs font-semibold text-[var(--color-text-secondary)]">{heading}</p>
      <StepRail tone={tone} aria-label="Route" className="-mx-[var(--spacing-component-sm)]">
        <StepRailItem title={levelName(from)} status={fromLabel} statusTone={fromLabel === 'You are here' ? 'current' : 'neutral'} marker="muted" muted />
        {levels.map((id) => onMap.has(id)
          ? <StepRailItem key={id} title={levelName(id)} status="already on your map" marker="muted" muted />
          : <StepRailItem key={id} title={levelName(id)} />)}
      </StepRail>
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
