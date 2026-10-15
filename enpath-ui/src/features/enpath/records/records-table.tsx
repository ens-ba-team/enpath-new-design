'use client';
// Records table — one row per record (spec: document/records-build.md → Layout). Both tabs: select ·
// From (who wrote it) · About (who it's about) · record · status · action (user, 2026-10-15: two named
// columns instead of one Person column with "to you / from you"). Record = content, source title,
// date; status = Badge + who is still waiting; one action per row at most. Clicking a row opens
// the detail drawer; the checkbox and the action button don't. Only rows Lan can act on in bulk
// (Acknowledge or Submit) have a checkbox (audit 2026-10-15: a disabled one read as broken). Rows are
// two lines per cell at most (content + source; status + progress); the full text is in the drawer.
// Row buttons are outline: the bulk bar holds the one primary action.

import * as React from 'react';
import { CaretRightIcon, CheckCircleIcon, ClockIcon, WarningIcon } from '@phosphor-icons/react/ssr';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  dateTime, ME, myAction, nameOf, openCorrection, people, rowAction, shortDate, statusOf,
  type RecordItem, type RowAction, type Tab,
} from './mock-data';

const actionLabel: Record<RowAction, string> = { acknowledge: 'Acknowledge', submit: 'Submit', edit: 'Edit' };

/** One acknowledger on the progress line: icon + name, done or waiting (not colour alone). */
function AckChip({ id, done }: { id: string; done: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-[var(--spacing-component-xxs)]">
      {done
        ? <CheckCircleIcon className="h-3 w-3 shrink-0 text-[var(--color-icon-success)]" aria-hidden="true" />
        : <ClockIcon className="h-3 w-3 shrink-0 text-[var(--color-icon-muted)]" aria-hidden="true" />}
      <span className="truncate">{id === ME ? 'You' : people[id].name}</span>
      <span className="sr-only">{done ? 'acknowledged' : 'waiting'}</span>
    </span>
  );
}

/** Status: one badge per meaning (user, 2026-10-15), each its own colour: Draft `secondary` ·
 *  Awaiting acknowledgement `blue` (PRD's Awaiting and Partially acknowledged together; the line shows
 *  who) · Needs correction `warning` · Acknowledged `success`. A record waiting for Lan has no badge,
 *  only "Waiting for you". */
export function RecordStatus({ r }: { r: RecordItem }) {
  const s = statusOf(r);
  const c = openCorrection(r);
  const ackers = [
    { id: r.recipientId, done: !!r.ackRecipient },
    ...(r.managerId ? [{ id: r.managerId, done: !!r.ackManager }] : []),
  ];
  const line = 'flex min-w-0 max-w-full flex-wrap items-center gap-x-[var(--spacing-component-sm)] gap-y-[var(--spacing-component-xxs)] text-body-xs text-[var(--color-text-secondary)]';

  // Waiting for Lan: just that. The other acknowledger is in the drawer (user, 2026-10-15: a name
  // under it read as "this person is waiting for you").
  if (myAction(r) === 'acknowledge') {
    return <span className="truncate text-label-md text-[var(--color-surface-default-foreground)]">Waiting for you</span>;
  }
  let badge: React.ReactNode;
  let detail: React.ReactNode = null;
  if (s === 'draft') {
    badge = <Badge variant="secondary" shape="pill">Draft</Badge>;
    detail = r.aiDraft ? 'AI draft' : 'Not sent yet';
  } else if (s === 'correction' && c) {
    badge = <Badge variant="warning" shape="pill">Needs correction</Badge>;
    detail = c.by === ME ? 'You asked for it' : `Asked by ${people[c.by].name}`;
  } else if (s === 'acknowledged') {
    badge = <Badge variant="success" shape="pill">Acknowledged</Badge>;
    const last = [r.ackRecipient?.at, r.ackManager?.at].filter(Boolean).sort().at(-1);
    detail = last ? `On ${shortDate(last)}` : null;
  } else {
    badge = <Badge variant="blue" shape="pill">Awaiting acknowledgement</Badge>;
    detail = ackers.map((a) => <AckChip key={a.id} {...a} />);
  }
  return (
    <div className="flex min-w-0 flex-col items-start gap-[var(--spacing-component-xxs)]">
      {badge}
      {detail && <span className={line}>{detail}</span>}
    </div>
  );
}

function PersonCell({ id }: { id: string }) {
  const p = people[id];
  if (!p) return <span className="text-body-sm text-[var(--color-text-secondary)]">{nameOf(id)}</span>;
  return (
    <div className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
      <Avatar size="sm" name={p.name} fallback={p.initials} />
      <span className="truncate text-label-md text-[var(--color-surface-default-foreground)]">{id === ME ? 'You' : p.name}</span>
    </div>
  );
}

/** Rows of one Record, in order of first appearance (Sent view). */
function groupByRecord(rows: RecordItem[]) {
  const groups: { recordId: string; title: string; created: string; items: RecordItem[] }[] = [];
  for (const r of rows) {
    const g = groups.find((x) => x.recordId === r.recordId);
    if (g) { g.items.push(r); if (r.created < g.created) g.created = r.created; }
    else groups.push({ recordId: r.recordId, title: r.title, created: r.created, items: [r] });
  }
  return groups;
}

export function RecordsTable({ tab, grouped = false, rows, selected, onToggle, onToggleAll, onOpen, onAction }: {
  tab: Tab;
  /** Sent: rows grouped under their Record (title · N feedback · date); no From column (always you) */
  grouped?: boolean;
  rows: RecordItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (on: boolean) => void;
  onOpen: (r: RecordItem) => void;
  onAction: (r: RecordItem, a: RowAction) => void;
}) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const selectable = rows.filter((r) => { const a = rowAction(r, tab); return a === 'acknowledge' || a === 'submit'; });
  const picked = selectable.filter((r) => selected.has(r.id)).length;
  const allState = picked === 0 ? false : picked === selectable.length ? true : 'indeterminate';
  const cols = grouped ? 5 : 6;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const row = (r: RecordItem) => {
    const label = `from ${nameOf(r.creatorId)} about ${nameOf(r.recipientId)}`;
    const action = rowAction(r, tab);
    const canSelect = action === 'acknowledge' || action === 'submit';
    const c = openCorrection(r);
    return (
      <TableRow key={r.id} data-state={selected.has(r.id) ? 'selected' : undefined}
        className="cursor-pointer" onClick={() => onOpen(r)}>
        <TableCell onClick={stop}>
          {canSelect && (
            <Checkbox checked={selected.has(r.id)} onCheckedChange={() => onToggle(r.id)}
              aria-label={`Select record ${label}`} />
          )}
        </TableCell>
        {!grouped && <TableCell><PersonCell id={r.creatorId} /></TableCell>}
        <TableCell><PersonCell id={r.recipientId} /></TableCell>
        <TableCell>
          <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
            {/* The row opens the drawer; this button is its keyboard entry */}
            <button type="button" onClick={(e) => { stop(e); onOpen(r); }}
              className={`truncate rounded-[var(--radius-sm)] text-left text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${r.content ? 'text-[var(--color-surface-default-foreground)]' : 'text-[var(--color-text-secondary)]'}`}>
              {r.content || 'No feedback yet'}
            </button>
            {c && r.creatorId === ME && tab === 'mine' ? (
              <span className="flex min-w-0 items-start gap-[var(--spacing-component-xxs)] text-body-xs text-[var(--color-text-secondary)]">
                <WarningIcon className="mt-px h-3 w-3 shrink-0 text-[var(--color-icon-warning)]" aria-hidden="true" />
                <span className="truncate">{people[c.by].name}: “{c.note}”</span>
              </span>
            ) : !grouped && (
              <span className="truncate text-body-xs text-[var(--color-text-secondary)]">{r.title} · {dateTime(r.submitted ?? r.created)}</span>
            )}
          </div>
        </TableCell>
        <TableCell><RecordStatus r={r} /></TableCell>
        <TableCell onClick={stop} className="text-right">
          {action && (
            <Button size="sm" variant="outline" onClick={() => onAction(r, action)}>
              {actionLabel[action]}
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-base)] border border-[var(--color-border-default)]">
      <Table className={`${grouped ? 'min-w-[760px]' : 'min-w-[920px]'} table-fixed`}>
        <colgroup>
          <col className="w-12" />
          {!grouped && <col className="w-[180px]" />}
          <col className="w-[180px]" />
          <col />
          <col className="w-[220px]" />
          <col className="w-[132px]" />
        </colgroup>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <Checkbox checked={allState} disabled={selectable.length === 0} onCheckedChange={(v) => onToggleAll(v === true)}
                aria-label="Select all records you can acknowledge or submit" />
            </TableHead>
            {!grouped && <TableHead>From</TableHead>}
            <TableHead>About</TableHead>
            <TableHead>{grouped ? 'Feedback' : 'Record'}</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Action</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grouped
            ? groupByRecord(rows).map((g) => {
                const open = !collapsed.has(g.recordId);
                const toggle = () => setCollapsed((s) => { const n = new Set(s); if (n.has(g.recordId)) n.delete(g.recordId); else n.add(g.recordId); return n; });
                return (
                  <React.Fragment key={g.recordId}>
                    {/* Group row: the Record. Title only, no status or actions; all groups open by default */}
                    <TableRow className="bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-raised)]">
                      <TableCell colSpan={cols} className="py-[var(--spacing-component-sm)]">
                        <button type="button" onClick={toggle} aria-expanded={open}
                          className="flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-sm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]">
                          <CaretRightIcon className={`h-4 w-4 shrink-0 text-[var(--color-icon-default)] transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true" />
                          <span className="text-heading-xs text-[var(--color-surface-raised-foreground)]">{g.title}</span>
                          <span className="text-body-xs text-[var(--color-text-secondary)]">
                            · {g.items.length} feedback · {shortDate(g.created)}
                          </span>
                        </button>
                      </TableCell>
                    </TableRow>
                    {open && g.items.map(row)}
                  </React.Fragment>
                );
              })
            : rows.map(row)}
        </TableBody>
      </Table>
    </div>
  );
}
