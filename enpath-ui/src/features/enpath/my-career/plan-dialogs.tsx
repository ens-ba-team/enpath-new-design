'use client';
// My Career plan changes — every one is Preview → Confirm (PRD-020 RQ-10).
// SetTargetDialog: the employee changes their Active target (no approval — it's personal).
// VisionRequestDialog: the employee sends one Career vision to their manager.
// ExploreRoleDialog: add a role; the dialog says whether it's a company-path step or a Career vision.
// SwitchPathDialog: follow a different company path planned for the employee's role.

import * as React from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircleIcon, CompassIcon } from '@phosphor-icons/react/ssr';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { initialPositions, levelLabel } from '../mock-data';
import { classifyMove, positionOfLevel, type Branch } from './mock-data';

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
  /** Current target, e.g. "Backend Engineer L3 · Senior" */
  from: string;
  /** New target */
  to: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Make this your target?</AlertDialogTitle>
          <AlertDialogDescription>Your progress board will track the new role instead.</AlertDialogDescription>
        </AlertDialogHeader>
        <dl>
          <Row label="From">{from}</Row>
          <Row label="To">{to}</Row>
        </dl>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {from} stays on your map as Planned. Your official role doesn’t change — a target is your own goal, not a promotion or transfer.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Set as target</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function VisionRequestDialog({ open, onOpenChange, visionName, route, manager, initialNote, onSend }: {
  open: boolean;
  /** "Career vision 2" */
  visionName: string;
  onOpenChange: (open: boolean) => void;
  /** "Backend Engineer L2 · Mid → Product Designer L1 · Designer → …" */
  route: string;
  manager: string;
  initialNote: string;
  onSend: (note: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        {/* DialogContent unmounts when closed, so the form starts from initialNote every time it opens. */}
        <VisionRequestForm visionName={visionName} route={route} manager={manager} initialNote={initialNote} onSend={onSend} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function VisionRequestForm({ visionName, route, manager, initialNote, onSend, onCancel }: {
  visionName: string; route: string; manager: string; initialNote: string; onSend: (note: string) => void; onCancel: () => void;
}) {
  const [note, setNote] = React.useState(initialNote);
  return (
      <>
        <DialogHeader>
          <DialogTitle>Request manager approval</DialogTitle>
          <DialogDescription>{visionName} leaves your company path, so {manager} reviews it first. You can send one career vision at a time.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-[var(--spacing-component-lg)]" onSubmit={(e) => { e.preventDefault(); onSend(note.trim()); }} noValidate>
          <dl>
            <Row label={visionName}>{route}</Row>
            <Row label="Reviewer">{manager}</Row>
          </dl>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="vision-note">Note for {manager} (optional)</Label>
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

// ─── Explore a role ──────────────────────────────────────────────────────────
// One question — where to? — and the dialog says what the move becomes. A move on a company path
// planned for the employee's role is a Planned step (no approval); anything else is a Career
// vision (private until sent; the manager approves it before it can be the target).

export interface StartOption {
  id: string;
  /** "You are here", "Active target", "Planned", "Career vision 1" */
  label: string;
  /** Career vision number, when the card is in one — a move from it extends that vision */
  vision?: number;
}

export function ExploreRoleDialog({ open, onOpenChange, starts, defaultFrom, nextVision, onMap, manager, onAdd }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cards a move can start from, in map order */
  starts: StartOption[];
  defaultFrom: string;
  /** Number a new Career vision would get */
  nextVision: number;
  /** Level ids already on the map — a role can appear only once */
  onMap: Set<string>;
  manager: string;
  onAdd: (branch: Branch, message: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <ExploreRoleForm starts={starts} defaultFrom={defaultFrom} nextVision={nextVision} onMap={onMap} manager={manager} onAdd={onAdd} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ExploreRoleForm({ starts, defaultFrom, nextVision, onMap, manager, onAdd, onCancel }: {
  starts: StartOption[]; defaultFrom: string; nextVision: number; onMap: Set<string>; manager: string;
  onAdd: (branch: Branch, message: string) => void; onCancel: () => void;
}) {
  const [from, setFrom] = React.useState(defaultFrom);
  const [positionId, setPositionId] = React.useState('');
  const [levelId, setLevelId] = React.useState('');
  const [tried, setTried] = React.useState(false);

  const position = initialPositions.find((p) => p.id === positionId);
  const start = starts.find((s) => s.id === from);
  const error = !levelId ? 'Choose a position and level.' : onMap.has(levelId) ? `${levelName(levelId)} is already on your map.` : '';
  const move = levelId ? classifyMove(from, levelId) : null;
  const vision = start?.vision ?? nextVision;

  const submit = () => {
    setTried(true);
    if (error || !move) return;
    if (move.kind === 'path') onAdd({ kind: 'path', pathId: move.path.id, from, to: levelId }, `${levelName(levelId)} added as a planned step`);
    else onAdd({ kind: 'vision', vision, from, to: levelId }, `${levelName(levelId)} added to Career vision ${vision}`);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Explore a role</DialogTitle>
        <DialogDescription>Add a role to your map to see what it would need. It doesn’t change your current role.</DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-[var(--spacing-component-lg)]" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <Label htmlFor="explore-from">Starting from</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger id="explore-from"><SelectValue /></SelectTrigger>
            <SelectContent>{starts.map((s) => <SelectItem key={s.id} value={s.id}>{s.label} · {levelName(s.id)}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <fieldset className="flex flex-col gap-[var(--spacing-component-xs)]">
          <legend className="mb-[var(--spacing-component-xs)] text-sm font-semibold text-[var(--color-background-default-foreground)]">Where to?</legend>
          <div className="grid grid-cols-1 gap-[var(--spacing-component-md)] sm:grid-cols-2">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor="explore-position">Position</Label>
              <Select value={positionId} onValueChange={(v) => { setPositionId(v); setLevelId(''); }}>
                <SelectTrigger id="explore-position" aria-invalid={(tried && !positionId) || undefined}><SelectValue placeholder="Choose a position" /></SelectTrigger>
                <SelectContent>{initialPositions.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor="explore-level">Level</Label>
              <Select value={levelId} onValueChange={setLevelId} disabled={!position}>
                <SelectTrigger id="explore-level" aria-invalid={(tried && !!error) || undefined}><SelectValue placeholder="Choose a level" /></SelectTrigger>
                <SelectContent>{position?.levels.map((l) => <SelectItem key={l.id} value={l.id}>{levelLabel(position.levels, l)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </fieldset>

        {tried && error && <p role="alert" className="text-sm text-[var(--color-text-invalid)]">{error}</p>}

        {move && !error && (
          <Alert variant={move.kind === 'path' ? 'success' : 'info'} role="status">
            {move.kind === 'path' ? <CheckCircleIcon aria-hidden="true" /> : <CompassIcon aria-hidden="true" />}
            {move.kind === 'path' ? (
              <>
                <AlertTitle>{levelName(levelId)} is on your company path, {move.path.name}</AlertTitle>
                <AlertDescription>It’s added as a planned step. No approval needed — you can make it your target any time.</AlertDescription>
              </>
            ) : (
              <>
                <AlertTitle>{levelName(levelId)} isn’t on a company path for your role</AlertTitle>
                <AlertDescription>
                  It {start?.vision ? `joins Career vision ${vision}` : `becomes Career vision ${vision}`}. Only you see it until you send it to {manager}, who approves it before it can be your target.
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add to my map</Button>
        </DialogFooter>
      </form>
    </>
  );
}

// ─── Switch company path ─────────────────────────────────────────────────────

export function SwitchPathDialog({ open, onOpenChange, from, to, targetNote, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  from: string;
  to: string;
  /** Set when the Active target isn't on the new path and will move */
  targetNote?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Follow a different company path?</AlertDialogTitle>
          <AlertDialogDescription>Your map shows the path you follow from your current role.</AlertDialogDescription>
        </AlertDialogHeader>
        <dl>
          <Row label="From">{from}</Row>
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
