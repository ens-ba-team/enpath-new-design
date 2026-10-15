'use client';
// Records — tables of records, detail in a right drawer. Spec: document/records-build.md → "Layout —
// chosen". Two tabs (user, 2026-10-15): My records (what Lan wrote or what is about her; views Needs
// you · All · Sent · About me) and My team (records about her reports; Needs you · All + a person
// Select, so it scales to many reports). Each tab shows its own Needs you count. Most visits are
// "what needs me?", so Needs you is the default when it has rows. Counts (tabs, Needs you) use the
// grey secondary Badge, not the brand Notification counter: the page already has enough brand
// (user, 2026-10-15; Open flag: Badge has no subtle counter). No permission rules yet: My team
// always shows. Lan acknowledges (as the person or the manager), requests a correction (in the
// drawer), submits drafts (Preview → Confirm) and, on a correction, edits and resubmits in one step.
// The selection bar sits on color/surface/raised (a grouping area of the table, like its header row).
// Create record = a Dialog (create-record-dialog.tsx), which also edits a record's drafts. Every view
// groups its rows by record (records-table.tsx), showing only the rows that view may show. Not built yet: AI from files (step 4).

import * as React from 'react';
import { toast } from 'sonner';
import { CheckCircleIcon, MagnifyingGlassIcon, PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Empty } from '@/components/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { ComboboxField } from '@/components/ui/combobox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnpathAppShell } from '../app-shell';
import { SidebarFollowsChat, useChatShortcut } from '../chat/sidebar-follows-chat';
import { Tip } from '../tip';
import { CreateRecordDialog, type RecordDraft } from './create-record-dialog';
import { RecordDrawer } from './record-drawer';
import { RecordsChat } from './records-chat';
import { RecordsTable } from './records-table';
import { SubmitDialog } from './submit-dialog';
import {
  initialRecords, inTab, inView, ME, managerOf, nameOf, needsMe, people, reports, rowAction, shortDate, statusOf, TODAY, waitingFor, joinNames,
  type RecordItem, type RowAction, type Tab, type View,
} from './mock-data';

const views: Record<Tab, { id: View; label: string }[]> = {
  mine: [
    { id: 'needs', label: 'Needs you' },
    { id: 'all', label: 'All' },
    { id: 'sent', label: 'Sent' },
    { id: 'about', label: 'About me' },
  ],
  team: [
    { id: 'needs', label: 'Needs you' },
    { id: 'all', label: 'All' },
  ],
};

const countNeeds = (list: RecordItem[], t: Tab) => list.filter((r) => inTab(r, t) && needsMe(r, t)).length;

/** "15 Oct, 10:42": today at the current time (history entries). */
function nowStamp() {
  const d = new Date();
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return { iso: `${TODAY}T${hm}`, label: `${shortDate(TODAY)}, ${hm}` };
}

/** A draft sent now: the recipient's manager is recorded; Lan's own role is acknowledged for her
 *  (a record for herself, or one about her report). PRD-023 BR-21. */
function sendNow(r: RecordItem, now: { iso: string; label: string }): RecordItem {
  const managerId = managerOf[r.recipientId];
  return {
    ...r,
    submitted: now.iso,
    managerId,
    aiDraft: false, // "AI draft" shows until it is sent; the source stays for provenance
    ...(r.recipientId === ME ? { ackRecipient: { at: now.iso, auto: true } } : {}),
    ...(managerId === ME ? { ackManager: { at: now.iso, auto: true } } : {}),
    history: [...r.history, { who: people[ME].name, what: 'Submitted', when: now.label }],
  };
}

export function RecordsScreen() {
  const [page, setPage] = React.useState('Records');
  const [records, setRecords] = React.useState<RecordItem[]>(initialRecords);
  const [tab, setTab] = React.useState<Tab>('mine');
  const [view, setView] = React.useState<View>(() => (countNeeds(initialRecords, 'mine') > 0 ? 'needs' : 'all'));
  const [person, setPerson] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [openId, setOpenId] = React.useState<string>();
  const [openEditing, setOpenEditing] = React.useState(false);
  const openRecord = (id: string, editing = false) => { setOpenEditing(editing); setOpenId(id); };
  const [submitting, setSubmitting] = React.useState<string[]>([]);
  // Create record / edit a record's drafts. The key gives every open a fresh form.
  const [editor, setEditor] = React.useState<{ key: number; recordId?: string } | null>(null);
  const openEditor = (recordId?: string) => setEditor({ key: Date.now(), recordId });
  const [chatOpen, setChatOpen] = React.useState(false);
  useChatShortcut(React.useCallback(() => setChatOpen((o) => !o), []));

  const q = query.trim().toLowerCase();
  const matches = (r: RecordItem) => !q || [r.content, r.title, nameOf(r.creatorId), nameOf(r.recipientId)]
    .some((t) => t.toLowerCase().includes(q));
  const rows = records.filter((r) => inView(r, tab, view) && (tab === 'mine' || person === 'all' || r.recipientId === person) && matches(r));
  const needs = { mine: countNeeds(records, 'mine'), team: countNeeds(records, 'team') };
  /** Records about one report still waiting for Lan (the person Select). */
  const waitingAbout = (id: string) => records.filter((r) => r.recipientId === id && inTab(r, 'team') && needsMe(r, 'team')).length;

  // Selection only holds rows that can still be acknowledged or submitted.
  const can = (r: RecordItem, a: RowAction) => rowAction(r, tab) === a;
  const picked = records.filter((r) => selected.has(r.id) && (can(r, 'acknowledge') || can(r, 'submit')));
  const toAck = picked.filter((r) => can(r, 'acknowledge'));
  const toSubmit = picked.filter((r) => can(r, 'submit'));

  const changeView = (v: View) => { setView(v); setSelected(new Set()); };
  const changeTab = (t: Tab) => { setTab(t); setView(needs[t] > 0 ? 'needs' : 'all'); setPerson('all'); setSelected(new Set()); };
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = (on: boolean) => setSelected(on ? new Set(rows.filter((r) => can(r, 'acknowledge') || can(r, 'submit')).map((r) => r.id)) : new Set());
  const unselect = (ids: string[]) => setSelected((s) => { const n = new Set(s); ids.forEach((id) => n.delete(id)); return n; });

  const acknowledge = (ids: string[]) => {
    const now = nowStamp();
    const after = records.map((r) => {
      if (!ids.includes(r.id) || !can(r, 'acknowledge')) return r;
      const asRecipient = r.recipientId === ME && !r.ackRecipient;
      return {
        ...r,
        ...(asRecipient ? { ackRecipient: { at: now.iso } } : { ackManager: { at: now.iso } }),
        history: [...r.history, { who: people[ME].name, what: 'Acknowledged', when: now.label }],
      };
    });
    setRecords(after);
    unselect(ids);
    if (ids.length === 1) {
      const r = after.find((x) => x.id === ids[0]);
      const left = r ? waitingFor(r) : [];
      toast.success(left.length ? `Acknowledged. Waiting for ${joinNames(left)}` : 'Acknowledged. It now counts');
    } else toast.success(`Acknowledged ${ids.length} records`);
  };

  const requestCorrection = (target: RecordItem, note: string) => {
    const now = nowStamp();
    setRecords((list) => list.map((r) => (r.id !== target.id ? r : {
      ...r,
      corrections: [...r.corrections, { by: ME, at: now.iso, note, open: true }],
      history: [...r.history, { who: people[ME].name, what: 'Requested a correction', when: now.label }],
    })));
    unselect([target.id]);
    toast(`Correction requested. ${people[target.creatorId].name} will see your note.`);
  };

  const submit = (ids: string[]) => {
    const now = nowStamp();
    setRecords((list) => list.map((r) => (ids.includes(r.id) && can(r, 'submit') ? sendNow(r, now) : r)));
    unselect(ids);
    setSubmitting([]);
    toast.success(ids.length === 1 ? 'Submitted. They are asked to acknowledge it' : `Submitted ${ids.length} records`);
  };

  const onAction = (r: RecordItem, a: RowAction) => {
    if (a === 'acknowledge') acknowledge([r.id]);
    else if (a === 'submit') setSubmitting([r.id]);
    else if (statusOf(r) === 'draft') openEditor(r.recordId);
    else openRecord(r.id, true);
  };

  // Create record, or save a record's edited drafts. One block = one record item. Save and submit
  // sends them at once (no preview step: the form shows each recipient's manager).
  const saveRecord = (d: RecordDraft) => {
    const now = nowStamp();
    const recordId = d.recordId ?? `rec-${Date.now()}`;
    const existing = records.filter((r) => r.recordId === recordId && statusOf(r) === 'draft');
    const items: RecordItem[] = d.blocks.map((b, i) => {
      const old = existing.find((r) => r.id === b.id);
      const base: RecordItem = old
        ? { ...old, title: d.title, recipientId: b.recipientId, content: b.content, aiDraft: b.aiDraft, source: b.source }
        : {
            id: `${recordId}-${Date.now()}-${i}`, recordId, title: d.title, content: b.content, creatorId: ME,
            recipientId: b.recipientId, aiDraft: b.aiDraft, source: b.source, created: now.iso, corrections: [],
            history: [{ who: people[ME].name, what: 'Saved as draft', when: now.label }],
          };
      return d.submit ? sendNow(base, now) : base;
    });
    setRecords((list) => [...items, ...list.filter((r) => !existing.some((x) => x.id === r.id))]);
    setEditor(null);
    setOpenId(undefined);
    toast.success(d.submit ? `Submitted ${items.length} ${items.length === 1 ? 'record' : 'records'}` : 'Saved as draft');
  };

  // Edit and resubmit is one step (user, 2026-10-15): a new version of the content, the correction
  // closes, both acknowledge again (PRD-023 BR-10); Lan's own role is acknowledged for her again.
  const resubmit = (target: RecordItem, content: string) => {
    const now = nowStamp();
    const managerId = managerOf[target.recipientId];
    setRecords((list) => list.map((r) => (r.id !== target.id ? r : {
      ...r,
      content,
      submitted: now.iso,
      managerId,
      ackRecipient: r.recipientId === ME ? { at: now.iso, auto: true } : undefined,
      ackManager: managerId === ME ? { at: now.iso, auto: true } : undefined,
      corrections: r.corrections.map((c) => ({ ...c, open: false })),
      history: [...r.history, { who: people[ME].name, what: 'Resubmitted a new version', when: now.label }],
    })));
    toast.success(`Resubmitted. ${people[target.recipientId].name} and ${people[managerId].name} are asked to acknowledge again`);
  };

  const open = records.find((r) => r.id === openId);

  return (
    <TooltipProvider>
      <EnpathAppShell active={page} onNavigate={setPage}
        rightPanel={chatOpen && <RecordsChat records={records} onClose={() => setChatOpen(false)} />}>
        <SidebarFollowsChat chatOpen={chatOpen} />
        {page !== 'Records' ? (
          <p className="p-[var(--spacing-layout-sm)] text-body-sm text-[var(--color-text-secondary)]">{page} isn’t built yet. Go to My Career, My Actions, Records or Setup.</p>
        ) : (
          <div className="flex h-full flex-col overflow-y-auto">
            <header className="flex flex-wrap items-center gap-[var(--spacing-layout-xs)] px-[var(--spacing-layout-sm)] py-[var(--spacing-layout-sm)]">
              <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
                <h1 className="text-heading-xl text-[var(--color-background-default-foreground)]">Records</h1>
              </div>
              {!chatOpen && (
                <Tip label="Ask AI (⌘I)">
                  <Button variant="outline" className="hidden lg:inline-flex" onClick={() => setChatOpen(true)}>
                    <SparkleIcon className="h-4 w-4" aria-hidden="true" />Ask AI
                  </Button>
                </Tip>
              )}
              <Button onClick={() => openEditor()}><PlusIcon aria-hidden="true" />Create record</Button>
            </header>

            <Tabs value={tab} onValueChange={(v) => { if (v === 'mine' || v === 'team') changeTab(v); }} className="flex flex-col">
              <TabsList variant="line" className="w-full px-[var(--spacing-layout-sm)]">
                <TabsTrigger variant="line" value="mine">My records{needs.mine > 0 && <Badge variant="secondary" shape="pill">{needs.mine}</Badge>}</TabsTrigger>
                <TabsTrigger variant="line" value="team">My team{needs.team > 0 && <Badge variant="secondary" shape="pill">{needs.team}</Badge>}</TabsTrigger>
              </TabsList>
              {/* One panel: both tabs share the toolbar and table; only the columns and views differ */}
              <TabsContent value={tab} className="mt-0 border-t border-[var(--color-border-default)] pt-[var(--spacing-component-lg)]">
                <div className="flex flex-col gap-[var(--spacing-component-lg)] px-[var(--spacing-layout-sm)] pb-[var(--spacing-layout-sm)]">
                  {/* Selecting swaps the filter row for the selection bar (same height), so the table doesn't move */}
                  {picked.length > 0 ? (
                    <div role="region" aria-label="Selected records"
                      className="flex min-h-[var(--height-control-touch-md)] flex-wrap items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] px-[var(--spacing-component-md)]">
                      <span className="text-label-md text-[var(--color-surface-raised-foreground)]">{picked.length} selected</span>
                      <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear selection</Button>
                      <span className="flex-1" />
                      {toSubmit.length > 0 && <Button size="sm" variant="outline" onClick={() => setSubmitting(toSubmit.map((r) => r.id))}>Submit {toSubmit.length}</Button>}
                      {toAck.length > 0 && <Button size="sm" onClick={() => acknowledge(toAck.map((r) => r.id))}>Acknowledge {toAck.length}</Button>}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-[var(--spacing-component-md)]">
                      <ButtonGroup role="group" aria-label="Show records">
                        {views[tab].map((v) => (
                          <Button key={v.id} variant="ghost" aria-pressed={view === v.id} onClick={() => changeView(v.id)}>
                            {v.label}
                            {v.id === 'needs' && needs[tab] > 0 && <Badge variant="secondary" shape="pill">{needs[tab]}</Badge>}
                          </Button>
                        ))}
                      </ButtonGroup>
                      {tab === 'team' && (
                        // Combobox, not Select: searchable, so it scales to 100+ reports (user, 2026-10-15)
                        <ComboboxField id="person-filter" label="Filter by person" hideLabel type="search" className="w-full sm:w-[260px]"
                          options={[
                            { value: 'all', label: `Everyone (${reports.length})` },
                            ...reports.map((p) => { const n = waitingAbout(p.id); return { value: p.id, avatar: p.initials, label: n > 0 ? `${p.name} · ${n} waiting for you` : p.name }; }),
                          ]}
                          value={person}
                          onValueChange={(v) => { setPerson(typeof v === 'string' ? v : 'all'); setSelected(new Set()); }} />
                      )}
                      <div className="ml-auto w-full sm:w-[260px]">
                        <InputGroup>
                          <InputGroupAddon><MagnifyingGlassIcon aria-hidden="true" /></InputGroupAddon>
                          <InputGroupInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records or people" aria-label="Search records or people" />
                        </InputGroup>
                      </div>
                    </div>
                  )}

                  {rows.length > 0 ? (
                    <RecordsTable tab={tab} grouped rows={rows} selected={selected} onToggle={toggle} onToggleAll={toggleAll}
                      onOpen={(r) => openRecord(r.id)} onAction={onAction} />
                  ) : q ? (
                    <Empty variant="outline" icon={<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />}
                      title="No records match" />
                  ) : view === 'needs' ? (
                    <Empty variant="outline" icon={<CheckCircleIcon className="h-5 w-5" aria-hidden="true" />}
                      title="Nothing needs you" />
                  ) : (
                    <Empty variant="outline" icon={<CheckCircleIcon className="h-5 w-5" aria-hidden="true" />}
                      title="No records here yet" />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <RecordDrawer record={open} startEditing={openEditing} onResubmit={resubmit} onEditDraft={(r) => openEditor(r.recordId)} onOpenChange={(o) => !o && setOpenId(undefined)}
          onAcknowledge={(r) => acknowledge([r.id])}
          onRequestCorrection={requestCorrection}
          onSubmit={(r) => setSubmitting([r.id])} />
        <SubmitDialog records={records.filter((r) => submitting.includes(r.id))}
          onOpenChange={(o) => !o && setSubmitting([])} onConfirm={() => submit(submitting)} />
        {editor && (() => {
          const drafts = editor.recordId ? records.filter((r) => r.recordId === editor.recordId && statusOf(r) === 'draft') : [];
          return (
            <CreateRecordDialog key={editor.key} open
              editing={editor.recordId ? { recordId: editor.recordId, title: drafts[0]?.title ?? '', drafts } : undefined}
              onOpenChange={(o) => !o && setEditor(null)} onSave={saveRecord} />
          );
        })()}
        <Toaster />
      </EnpathAppShell>
    </TooltipProvider>
  );
}
