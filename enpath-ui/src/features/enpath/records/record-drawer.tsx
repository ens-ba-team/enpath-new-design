'use client';
// Record drawer — the detail of one record, from the right (Sheet, pattern P3); the table stays
// behind. Built around what each person opens it for (records-build.md → Drawer, 2026-10-15):
//   header   the record's title; meta line From · About · date (user, 2026-10-15: kept over a
//            "X wrote about you" sentence)
//   first    an open correction request (Alert), when there is one
//   content  the record itself, the main text (body-lg, no fill)
//   acks     "Acknowledgements (· N of 2 while waiting)": each acknowledger with Your turn · Waiting ·
//            Acknowledged {date} · On hold (correction open); none for a draft
//   activity collapsed, "Activity (N)"
//   footer   one row (SheetFooter horizontal): Request correction · Acknowledge, or Edit and resubmit,
//            or Submit. Edit and resubmit is one step: change the text, Resubmit sends it (no
//            second Submit, user 2026-10-15); one approved line under it. Request correction opens a
//            required note in place. No other helper copy (user rule: no copy nobody asked for).
// Text sits on the Sheet, so it uses color/surface/overlay/foreground (not background/default).

import * as React from 'react';
import { CaretRightIcon, CheckCircleIcon, ClockIcon, PauseCircleIcon, SparkleIcon, WarningIcon } from '@phosphor-icons/react/ssr';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { dateTime, ME, managerOf, myAction, nameOf, openCorrection, people, shortDate, statusOf, type Ack, type RecordItem } from './mock-data';

const fg = 'text-[var(--color-surface-overlay-foreground)]';
const muted = 'text-[var(--color-text-secondary)]';

const nameOrYou = (id: string) => (id === ME ? 'You' : nameOf(id));
/** "you" mid-sentence (meta line: From Tuyền Trần · About you). */
const lowerYou = (id: string) => (id === ME ? 'you' : nameOf(id));

/** Section title ("Your feedback", "Acknowledgements"). Three levels in the drawer (user,
 *  2026-10-15, common side-panel scale): title heading-md 18 · section heading-xs 14 · body body-sm 14
 *  · meta body-xs 12. A section title is the body size, set apart by weight, never smaller than it. */
function BlockLabel({ children }: { children: React.ReactNode }) {
  return <h3 className={`text-heading-xs ${fg}`}>{children}</h3>;
}

/** One acknowledger: avatar, name · role, and their state: Your turn · Waiting · Acknowledged {date}
 *  · On hold (while a correction is open). */
function AckRow({ id, role, ack, myTurn, onHold }: { id: string; role: string; ack?: Ack; myTurn: boolean; onHold: boolean }) {
  const p = people[id];
  return (
    <li className="flex items-center gap-[var(--spacing-component-sm)]">
      <Avatar size="sm" name={p.name} fallback={p.initials} />
      <span className={`min-w-0 flex-1 truncate text-body-sm ${fg}`}>
        {nameOrYou(id)} <span className={muted}>· {role}</span>
      </span>
      {ack ? (
        <span className={`flex shrink-0 items-center gap-[var(--spacing-component-xxs)] text-body-sm ${muted}`}>
          <CheckCircleIcon className="h-4 w-4 text-[var(--color-icon-success)]" aria-hidden="true" />
          Acknowledged {shortDate(ack.at)}
        </span>
      ) : onHold ? (
        <span className={`flex shrink-0 items-center gap-[var(--spacing-component-xxs)] text-body-sm ${muted}`}>
          <PauseCircleIcon className="h-4 w-4 text-[var(--color-icon-default)]" aria-hidden="true" />On hold
        </span>
      ) : myTurn ? (
        <span className={`shrink-0 text-label-md ${fg}`}>Your turn</span>
      ) : (
        <span className={`flex shrink-0 items-center gap-[var(--spacing-component-xxs)] text-body-sm ${muted}`}>
          <ClockIcon className="h-4 w-4 text-[var(--color-icon-default)]" aria-hidden="true" />Waiting
        </span>
      )}
    </li>
  );
}

/** Acknowledgements: both acknowledgers, "· N of 2" while waiting. None for a draft (nobody is asked
 *  yet). */
function Acknowledgements({ r }: { r: RecordItem }) {
  const s = statusOf(r);
  if (s === 'draft') return null;
  const c = openCorrection(r);
  const managerId = r.managerId ?? managerOf[r.recipientId];
  const rows = [
    { id: r.recipientId, role: 'the person', ack: r.ackRecipient },
    { id: managerId, role: r.recipientId === ME ? 'your manager' : 'their manager', ack: r.ackManager },
  ];
  const done = rows.filter((x) => x.ack).length;
  const waiting = s === 'awaiting' || s === 'partial';
  return (
    <section className="flex flex-col gap-[var(--spacing-component-sm)]">
      <BlockLabel>Acknowledgements{waiting ? ` · ${done} of 2` : ''}</BlockLabel>
      <ul className="flex flex-col gap-[var(--spacing-component-sm)]">
        {rows.map((x) => (
          <AckRow key={x.role} id={x.id} role={x.role} ack={x.ack} onHold={!!c}
            myTurn={x.id === ME && myAction(r) === 'acknowledge'} />
        ))}
      </ul>
    </section>
  );
}

function History({ r }: { r: RecordItem }) {
  const [open, setOpen] = React.useState(false);
  const n = r.history.length;
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)]">
      <CollapsibleTrigger className={`flex items-center gap-[var(--spacing-component-xs)] rounded-[var(--radius-sm)] text-heading-xs ${fg} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]`}>
        <CaretRightIcon className={`h-4 w-4 text-[var(--color-icon-default)] transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true" />
        Activity ({n})
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="flex flex-col gap-[var(--spacing-component-sm)] pt-[var(--spacing-component-sm)]" aria-label="Activity">
          {[...r.history].reverse().map((h, i) => (
            <li key={i} className="flex flex-col">
              <span className={`text-body-sm ${fg}`}>{h.what}</span>
              <span className={`text-body-xs ${muted}`}>{h.who} · {h.when}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

type Mode = 'view' | 'correcting' | 'editing';

/** Body + footer for one record. Keyed by record (and how it was opened), so another record starts
 *  fresh: note closed, edits dropped. */
function RecordDetail({ r, startEditing, onAcknowledge, onRequestCorrection, onSubmit, onResubmit, onEditDraft }: {
  r: RecordItem;
  startEditing: boolean;
  onEditDraft: (r: RecordItem) => void;
  onAcknowledge: (r: RecordItem) => void;
  onRequestCorrection: (r: RecordItem, note: string) => void;
  onSubmit: (r: RecordItem) => void;
  onResubmit: (r: RecordItem, content: string) => void;
}) {
  const action = myAction(r);
  const c = openCorrection(r);
  const [mode, setMode] = React.useState<Mode>(startEditing && action === 'edit' ? 'editing' : 'view');
  const [note, setNote] = React.useState('');
  const [text, setText] = React.useState(r.content);
  const [tried, setTried] = React.useState(false);
  const missing = (v: string) => v.trim() === '';

  const sendNote = () => { setTried(true); if (!missing(note)) { onRequestCorrection(r, note.trim()); setMode('view'); setTried(false); } };
  const resubmit = () => { setTried(true); if (!missing(text)) { onResubmit(r, text.trim()); setMode('view'); setTried(false); } };
  const cancel = () => { setMode('view'); setTried(false); setText(r.content); };

  return (
    <>
      <SheetHeader>
        <SheetTitle>{r.title}</SheetTitle>
        <SheetDescription>
          From {lowerYou(r.creatorId)} · About {lowerYou(r.recipientId)} · {dateTime(r.submitted ?? r.created)}
        </SheetDescription>
      </SheetHeader>

      {/* Header pads 16px below; 8px more makes the first gap 24px, the same as between blocks */}
      <div className="flex flex-1 flex-col gap-[var(--spacing-component-xl)] overflow-y-auto px-[var(--spacing-component-lg)] pt-[var(--spacing-component-sm)] pb-[var(--spacing-component-lg)]">
        {c && (
          <Alert variant="warning" icon={<WarningIcon aria-hidden="true" />}>
            <AlertTitle>{c.by === ME ? 'You asked for a correction' : `${people[c.by].name} asked for a correction`}</AlertTitle>
            <AlertDescription>“{c.note}” · {dateTime(c.at)}</AlertDescription>
          </Alert>
        )}

        {mode === 'editing' ? (
          <section className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="record-text">Your new version</Label>
            <Textarea id="record-text" rows={5} autoFocus value={text} aria-invalid={(tried && missing(text)) || undefined}
              onChange={(e) => setText(e.target.value)} />
            {tried && missing(text) && <p className="text-body-xs text-[var(--color-text-invalid)]">Write what happened before you resubmit.</p>}
          </section>
        ) : (
          <section className="flex flex-col gap-[var(--spacing-component-sm)]">
            {r.creatorId === ME && (
              <div className="flex items-center gap-[var(--spacing-component-sm)]">
                <BlockLabel>Your feedback</BlockLabel>
                {r.aiDraft && <Badge variant="outline" shape="pill"><SparkleIcon aria-hidden="true" />AI draft</Badge>}
              </div>
            )}
            <p className={`whitespace-pre-line text-body-sm ${fg}`}>{r.content}</p>
          </section>
        )}

        <Acknowledgements r={r} />
        <History r={r} />
      </div>

      {mode === 'correcting' ? (
        <SheetFooter>
          <form className="flex flex-col gap-[var(--spacing-component-sm)]" noValidate onSubmit={(e) => { e.preventDefault(); sendNote(); }}>
            <Label htmlFor="correction-note">What should change?</Label>
            <Textarea id="correction-note" rows={3} autoFocus value={note}
              aria-invalid={(tried && missing(note)) || undefined} onChange={(e) => setNote(e.target.value)} />
            {tried && missing(note) && <p className="text-body-xs text-[var(--color-text-invalid)]">Say what should change, so {people[r.creatorId].name} can fix it.</p>}
            <div className="flex justify-end gap-[var(--spacing-component-sm)]">
              <Button type="button" variant="outline" onClick={() => { setMode('view'); setTried(false); }}>Cancel</Button>
              <Button type="submit">Send request</Button>
            </div>
          </form>
        </SheetFooter>
      ) : mode === 'editing' ? (
        <SheetFooter orientation="horizontal">
          <Button variant="outline" onClick={cancel}>Cancel</Button>
          <Button onClick={resubmit}>Resubmit</Button>
        </SheetFooter>
      ) : action === 'acknowledge' ? (
        <SheetFooter orientation="horizontal">
          <Button variant="outline" onClick={() => setMode('correcting')}>Request correction</Button>
          <Button onClick={() => onAcknowledge(r)}>Acknowledge</Button>
        </SheetFooter>
      ) : action === 'edit' && statusOf(r) === 'draft' ? (
        <SheetFooter orientation="horizontal">
          <Button onClick={() => onEditDraft(r)}>Edit</Button>
        </SheetFooter>
      ) : action === 'edit' ? (
        <SheetFooter>
          <Button onClick={() => setMode('editing')}>Edit and resubmit</Button>
          <p className={`text-body-xs ${muted}`}>Both will be asked to acknowledge again.</p>
        </SheetFooter>
      ) : action === 'submit' ? (
        <SheetFooter orientation="horizontal">
          <Button onClick={() => onSubmit(r)}>Submit</Button>
        </SheetFooter>
      ) : null}
    </>
  );
}

export function RecordDrawer({ record, startEditing = false, onOpenChange, onAcknowledge, onRequestCorrection, onSubmit, onResubmit, onEditDraft }: {
  record?: RecordItem;
  /** Opened from the row's Edit: go straight to the editor */
  startEditing?: boolean;
  onOpenChange: (o: boolean) => void;
  onAcknowledge: (r: RecordItem) => void;
  onRequestCorrection: (r: RecordItem, note: string) => void;
  onSubmit: (r: RecordItem) => void;
  onResubmit: (r: RecordItem, content: string) => void;
  /** A draft is edited in the Create record form */
  onEditDraft: (r: RecordItem) => void;
}) {
  return (
    <Sheet open={record !== undefined} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-[440px]">
        {record && (
          <RecordDetail key={`${record.id}-${startEditing}`} r={record} startEditing={startEditing}
            onAcknowledge={onAcknowledge} onRequestCorrection={onRequestCorrection} onSubmit={onSubmit} onResubmit={onResubmit} onEditDraft={onEditDraft} />
        )}
      </SheetContent>
    </Sheet>
  );
}
