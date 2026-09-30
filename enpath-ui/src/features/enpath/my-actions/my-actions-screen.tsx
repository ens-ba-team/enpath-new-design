'use client';
// My Actions — the employee's Action plan, List view (sketch C v2). Spec: document/my-actions-build.md.
// Header (P1): "Action plan" + purpose line, Ask AI, Add action. Four Stat tiles (growth areas, in
// progress, to do, done). One GrowthAreaGroup per growth area of the Active target. The employee
// owns the plan: adds, edits, starts, finishes and removes Actions; AI proposals join only through
// Add to plan (the Add action dialog opens prefilled). Actions and Records are separate: the only
// link is each growth area's record count (the Records page isn't built yet, so it says so).
// Not yet: Board view, manager view, a progress ring (Open flag), links from My Career.

import * as React from 'react';
import { toast } from 'sonner';
import { CheckCircleIcon, ListChecksIcon, PlayCircleIcon, PlusIcon, SparkleIcon, TargetIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { Stat } from '@/components/ui/stat';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnpathAppShell } from '../app-shell';
import { SidebarFollowsChat, useChatShortcut } from '../chat/sidebar-follows-chat';
import { Tip } from '../tip';
import { ActionDialog, DismissProposalDialog, RemoveActionDialog, type ActionDraft } from './action-dialogs';
import { ActionsChat } from './actions-chat';
import { GrowthAreaGroup, type GroupHandlers } from './growth-area-group';
import {
  growthAreas, initialActions, initialProposals, recordCounts, targetName, TODAY,
  type Action, type Proposal,
} from './mock-data';

// SCREEN-LEVEL DEBT (design-patterns.md → Open flags, kind restyle, 2026-09-30): Stat has no icon-tile
// option, so the tile is built in its icon slot. Colours follow meaning: growth areas amber (as in My
// Career), in progress info blue, to do neutral, done success. Move into Stat, then delete this.
function IconTile({ icon, tone }: { icon: React.ReactNode; tone: 'warning' | 'info' | 'neutral' | 'success' }) {
  const fill = {
    warning: 'bg-[var(--color-status-warning-subtle)] text-[var(--color-icon-warning)]',
    info: 'bg-[var(--color-status-info-subtle)] text-[var(--color-status-info)]',
    neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-icon-muted)]',
    success: 'bg-[var(--color-status-success-subtle)] text-[var(--color-icon-success)]',
  }[tone];
  return <span className={`inline-flex rounded-[var(--radius-md)] p-[var(--spacing-component-xs-plus)] ${fill}`}>{icon}</span>;
}

type Editor = { mode: 'add'; prefill?: Partial<ActionDraft>; fromProposal?: string } | { mode: 'edit'; action: Action } | null;

export function MyActionsScreen() {
  const [page, setPage] = React.useState('My Actions');
  const [actions, setActions] = React.useState<Action[]>(initialActions);
  const [proposals, setProposals] = React.useState<Proposal[]>(initialProposals);
  const [editor, setEditor] = React.useState<Editor>(null);
  const [editorKey, setEditorKey] = React.useState(0);
  // Each open starts a fresh form (the dialog reads its props once).
  const openEditor = (e: NonNullable<Editor>) => { setEditorKey((k) => k + 1); setEditor(e); };
  const [removing, setRemoving] = React.useState<Action | undefined>();
  const [dismissing, setDismissing] = React.useState<Proposal | undefined>();
  const [chatOpen, setChatOpen] = React.useState(false);
  useChatShortcut(React.useCallback(() => setChatOpen((o) => !o), []));

  const count = (s: Action['status']) => actions.filter((a) => a.status === s).length;
  const update = (id: string, patch: Partial<Action>) => setActions((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const h: GroupHandlers = {
    onAdvance: (a) => {
      if (a.status === 'todo') { update(a.id, { status: 'doing' }); toast(`Started: ${a.title}`); }
      else if (a.status === 'doing') { update(a.id, { status: 'done', doneOn: TODAY }); toast.success(`Done: ${a.title}`); }
    },
    onEdit: (a) => openEditor({ mode: 'edit', action: a }),
    onReopen: (a) => { update(a.id, { status: 'doing', doneOn: undefined }); toast(`Back in progress: ${a.title}`); },
    onRemove: (a) => setRemoving(a),
    onAddAction: (competencyId) => openEditor({ mode: 'add', prefill: { competencyId } }),
    onAcceptProposal: (p) => openEditor({ mode: 'add', prefill: { title: p.title, competencyId: p.competencyId, outcome: p.outcome }, fromProposal: p.id }),
    onDismissProposal: (p) => setDismissing(p),
    onOpenRecords: (area) => toast(`Records is coming next. This link will open ${area.name} records.`),
    onAskAI: () => setChatOpen(true),
  };

  const proposeFromChat = React.useCallback((p: Omit<Proposal, 'id'>) => {
    setEditorKey((k) => k + 1);
    setEditor({ mode: 'add', prefill: { title: p.title, competencyId: p.competencyId, outcome: p.outcome } });
  }, []);

  const save = (d: { title: string; competencyId: string; outcome: string; due: string }) => {
    if (editor?.mode === 'edit') {
      update(editor.action.id, d);
      toast.success('Action saved');
    } else if (editor?.mode === 'add') {
      const fromAI = editor.fromProposal !== undefined || editor.prefill?.title !== undefined;
      setActions((list) => [...list, { id: `a${Date.now()}`, ...d, status: 'todo', source: fromAI ? 'ai' : 'you', added: TODAY }]);
      if (editor.fromProposal) setProposals((list) => list.filter((p) => p.id !== editor.fromProposal));
      toast.success(`Added to your plan: ${d.title}`);
    }
    setEditor(null);
  };

  return (
    <TooltipProvider>
      <EnpathAppShell
        active={page}
        onNavigate={setPage}
        rightPanel={chatOpen && <ActionsChat onPropose={proposeFromChat} onClose={() => setChatOpen(false)} />}
      >
        <SidebarFollowsChat chatOpen={chatOpen} />
        {page !== 'My Actions' ? (
          <p className="p-[var(--spacing-layout-sm)] text-body-sm text-[var(--color-text-secondary)]">{page} isn’t built yet. Go to My Career, My Actions or Setup.</p>
        ) : (
          <div className="flex h-full flex-col overflow-y-auto">
            <header className="flex flex-wrap items-center gap-[var(--spacing-layout-xs)] px-[var(--spacing-layout-sm)] py-[var(--spacing-layout-sm)]">
              <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
                <h1 className="text-heading-xl text-[var(--color-background-default-foreground)]">Action plan</h1>
                <p className="text-body-sm text-[var(--color-text-secondary)]">What you plan to do to grow toward {targetName}. Your manager can see this plan.</p>
              </div>
              {!chatOpen && (
                <Tip label="Ask AI (⌘I)">
                  <Button variant="outline" className="hidden lg:inline-flex" onClick={() => setChatOpen(true)}>
                    <SparkleIcon className="h-4 w-4" aria-hidden="true" />Ask AI
                  </Button>
                </Tip>
              )}
              <Button onClick={() => openEditor({ mode: 'add' })}><PlusIcon aria-hidden="true" />Add action</Button>
            </header>

            <div className="flex flex-col gap-[var(--spacing-layout-sm)] px-[var(--spacing-layout-sm)] pb-[var(--spacing-layout-sm)]">
              <section aria-label="Plan summary" className="grid grid-cols-2 gap-[var(--spacing-component-md)] md:grid-cols-4">
                <Stat label="Growth areas" value={growthAreas.length} icon={<IconTile tone="warning" icon={<TargetIcon />} />} />
                <Stat label="In progress" value={count('doing')} icon={<IconTile tone="info" icon={<PlayCircleIcon />} />} />
                <Stat label="To do" value={count('todo')} icon={<IconTile tone="neutral" icon={<ListChecksIcon />} />} />
                <Stat label="Done" value={count('done')} icon={<IconTile tone="success" icon={<CheckCircleIcon />} />} />
              </section>

              {growthAreas.map((area) => (
                <GrowthAreaGroup
                  key={area.id}
                  area={area}
                  actions={actions.filter((a) => a.competencyId === area.id)}
                  proposals={proposals.filter((p) => p.competencyId === area.id)}
                  records={recordCounts[area.id] ?? 0}
                  h={h}
                />
              ))}
            </div>
          </div>
        )}

        <ActionDialog
          key={editorKey}
          open={editor !== null}
          onOpenChange={(o) => !o && setEditor(null)}
          editing={editor?.mode === 'edit' ? editor.action : undefined}
          prefill={editor?.mode === 'add' ? editor.prefill : undefined}
          onSave={save}
        />
        <RemoveActionDialog action={removing} onOpenChange={(o) => !o && setRemoving(undefined)}
          onConfirm={() => { if (removing) { setActions((l) => l.filter((a) => a.id !== removing.id)); toast(`Removed: ${removing.title}`); } setRemoving(undefined); }} />
        <DismissProposalDialog title={dismissing?.title} onOpenChange={(o) => !o && setDismissing(undefined)}
          onConfirm={() => { if (dismissing) { setProposals((l) => l.filter((p) => p.id !== dismissing.id)); toast('Proposal dismissed'); } setDismissing(undefined); }} />
        <Toaster />
      </EnpathAppShell>
    </TooltipProvider>
  );
}
