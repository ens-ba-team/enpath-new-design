'use client';
// My Career — employee view (Lan Nguyen). Spec: Enpath/document/my-career-build.md.
// Three jobs, three places: progress board (fixed to the Active target) · career map (build the
// path) · side panel (the selected role card, or the selected route — a company path or a Career
// vision). The map is derived from Lan's plan (mock-data.ts → buildMap). Every plan change is
// Preview → Confirm, then a toast. Career visions are numbered; one can be sent to the manager at
// a time. Not yet: manager review, list view.

import * as React from 'react';
import { toast } from 'sonner';
import { PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CareerMap, CareerMapLegend, type CareerMapItem, type CareerMapPath } from '@/components/ui/career-map';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnpathAppShell } from '../app-shell';
import { SidebarFollowsChat, useChatShortcut } from '../chat/sidebar-follows-chat';
import { Tip } from '../tip';
import { CareerChat } from './career-chat';
import {
  buildMap, companyPaths, describeStep, employee, initialPlan, matchingPaths, removeBranch, removeVision,
  visionNumbers, visionRoute, visionRouteId, type Branch, type GapStatus, type Plan, type VisionRequest,
} from './mock-data';
import { NoTargetStrip, ProgressBoard, RoutePanel, stateName, StepPanel } from './my-career-panels';
import { ExplorePositionDialog, levelName, RemoveTargetDialog, SetTargetDialog, SwitchPathDialog, VisionRequestDialog, type StartOption } from './plan-dialogs';

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="p-[var(--spacing-layout-sm)] text-sm text-[var(--color-text-secondary)]">{children}</p>;
}

type Selection = { kind: 'card'; id: string } | { kind: 'route'; id: string };
type DialogName = 'target' | 'untarget' | 'request' | 'add' | 'remove' | 'switch' | 'unfollow' | null;

export function MyCareerScreen() {
  const [page, setPage] = React.useState('My Career');
  const [plan, setPlan] = React.useState<Plan>(initialPlan);
  const [request, setRequest] = React.useState<VisionRequest | null>(null);
  const [notes, setNotes] = React.useState<Record<number, string>>({});
  const [sel, setSel] = React.useState<Selection>({ kind: 'card', id: initialPlan.targetId ?? employee.levelId });
  const [dialog, setDialog] = React.useState<DialogName>(null);
  const [switchTo, setSwitchTo] = React.useState('');
  const [chatOpen, setChatOpen] = React.useState(false);
  const [focusGroup, setFocusGroup] = React.useState<{ group: GapStatus; n: number } | undefined>();
  useChatShortcut(React.useCallback(() => setChatOpen((o) => !o), []));

  const { steps, links } = React.useMemo(() => buildMap(plan), [plan]);
  const current = steps.find((s) => s.state === 'current')!;
  const target = steps.find((s) => s.state === 'target');
  const visions = visionNumbers(plan);

  // Routes on the map: company paths (the followed one first, drawn green) and Career visions.
  const routes: CareerMapPath[] = [
    ...companyPaths
      .filter((p) => links.some((l) => l.route === p.id))
      .sort((a, b) => Number(b.id === plan.followedPathId) - Number(a.id === plan.followedPathId))
      .map((p) => ({ id: p.id, name: p.id === plan.followedPathId ? `${p.name} · you follow` : p.name, color: p.color, followed: p.id === plan.followedPathId })),
    ...visions.map((n): CareerMapPath => ({ id: visionRouteId(n), name: `Career vision ${n}`, kind: 'vision' })),
  ];
  const route = sel.kind === 'route' ? routes.find((r) => r.id === sel.id) : undefined;
  const step = (sel.kind === 'card' ? steps.find((s) => s.id === sel.id) : undefined) ?? (route ? undefined : current);
  const visionOfRoute = route?.kind === 'vision' ? Number(route.id.replace('vision-', '')) : undefined;
  // Actions on the "selected thing" need a card even while a route is shown (e.g. the request dialog).
  const actionStep = step ?? current;

  const items: CareerMapItem[] = steps.map((s) => {
    const d = describeStep(s);
    return { id: s.id, title: d.title, level: d.level, state: s.state, lane: s.lane, label: s.state === 'vision' ? 'Career vision' : undefined };
  });
  const starts: StartOption[] = steps.filter((s) => s.state !== 'completed').map((s) => ({ id: s.id, label: stateName(s), vision: s.vision }));

  // What "Remove" takes away: a whole Career vision (route panel) or one company-path card you added.
  const removal = React.useMemo(() => {
    let next: Plan | null = null;
    if (visionOfRoute !== undefined) next = removeVision(plan, visionOfRoute);
    else if (step?.branch !== undefined && step.state !== 'vision') next = removeBranch(plan, step.branch);
    if (!next) return null;
    const left = new Set(buildMap(next).steps.map((s) => s.id));
    const gone = steps.filter((s) => !left.has(s.id));
    const blocked = gone.some((s) => s.id === plan.targetId)
      ? 'Your Active target is on it — set another target before removing it.'
      : request?.status === 'waiting' && !visionNumbers(next).includes(request.vision)
        ? `Career vision ${request.vision} is waiting for ${employee.manager} — withdraw the request before removing it.`
        : undefined;
    return { next, gone, blocked };
  }, [plan, step, steps, request, visionOfRoute]);

  // Stop following the core path: its cards leave the map (and anything added from them).
  const unfollow = React.useMemo(() => {
    if (!plan.followedPathId) return null;
    const next = { ...plan, followedPathId: null };
    const left = new Set(buildMap(next).steps.map((s) => s.id));
    const gone = steps.filter((s) => !left.has(s.id));
    const blocked = gone.some((s) => s.id === plan.targetId)
      ? 'Your Active target is on this path — remove it or pick another target first.'
      : request?.status === 'waiting' && !visionNumbers(next).includes(request.vision)
        ? `Career vision ${request.vision} starts on this path and is waiting for ${employee.manager} — withdraw it first.`
        : undefined;
    return { next, gone, blocked };
  }, [plan, steps, request]);

  const commit = (next: Plan, message: string) => {
    setPlan(next);
    if (request && !visionNumbers(next).includes(request.vision)) setRequest(null);
    setDialog(null);
    toast.success(message);
  };

  const switchPreview = React.useMemo(() => {
    if (!switchTo) return null;
    const next = { ...plan, followedPathId: switchTo };
    if (!plan.targetId) return { next, note: 'You have no target yet — pick one on the path when you’re ready.' };
    if (buildMap(next).steps.some((s) => s.id === plan.targetId)) return { next, note: undefined };
    const path = companyPaths.find((p) => p.id === switchTo)!;
    const newTarget = path.levels[path.levels.indexOf(employee.levelId) + 1] ?? employee.levelId;
    return { next: { ...next, targetId: newTarget }, note: `${levelName(plan.targetId)} isn't on ${path.name}, so ${levelName(newTarget)} becomes your target.` };
  }, [switchTo, plan]);

  const follow = (pathId: string) => { if (pathId !== plan.followedPathId) { setSwitchTo(pathId); setDialog('switch'); } };
  const selectCard = (id: string) => setSel({ kind: 'card', id });
  const selectRoute = (id: string) => setSel((s) => (s.kind === 'route' && s.id === id ? { kind: 'card', id: current.id } : { kind: 'route', id }));
  const addBranches = (added: Branch[], message: string, select: string) => { commit({ ...plan, branches: [...plan.branches, ...added] }, message); selectCard(select); };
  // From the AI chat: the suggested roles become a new Career vision, then it's highlighted.
  const addVisionFromChat = (from: string, ids: string[]) => {
    const onMap = new Set(steps.map((s) => s.id));
    const fresh = ids.filter((id) => !onMap.has(id));
    if (fresh.length === 0) { toast('Those roles are already on your map'); return; }
    const n = (visions.at(-1) ?? 0) + 1;
    const start = onMap.has(from) ? from : current.id;
    const added: Branch[] = fresh.map((to, i) => ({ kind: 'vision', vision: n, from: i === 0 ? start : fresh[i - 1], to }));
    commit({ ...plan, branches: [...plan.branches, ...added] }, `Added to your map as Career vision ${n}`);
    setSel({ kind: 'route', id: visionRouteId(n) });
  };

  return (
    <TooltipProvider>
    <EnpathAppShell
      active={page}
      onNavigate={setPage}
      rightPanel={chatOpen && (
        <CareerChat
          target={target}
          context={route ? route.name : levelName((step ?? current).id)}
          onMap={new Set(steps.map((s) => s.id))}
          onAddVision={addVisionFromChat}
          onClose={() => setChatOpen(false)}
        />
      )}
    >
      <SidebarFollowsChat chatOpen={chatOpen} />
      {page !== 'My Career' ? (
        <Placeholder>{page} — not built yet. Go to My Career or Setup.</Placeholder>
      ) : (
        <div className="flex h-full flex-col overflow-y-auto lg:overflow-hidden">
          <header className="flex items-start gap-[var(--spacing-layout-xs)] px-[var(--spacing-layout-sm)] py-[var(--spacing-layout-sm)]">
            <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
              <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">My Career</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">{employee.name} · {levelName(current.id)}</p>
            </div>
            {!chatOpen && (
              <Tip label="Ask AI (⌘I)">
                <Button variant="outline" className="hidden lg:inline-flex" onClick={() => setChatOpen(true)}>
                  <SparkleIcon className="h-4 w-4" aria-hidden="true" />Ask AI
                </Button>
              </Tip>
            )}
          </header>
          {target ? <ProgressBoard target={target} onOpenGroup={(group) => { selectCard(target.id); setFocusGroup((f) => ({ group, n: (f?.n ?? 0) + 1 })); }} /> : <NoTargetStrip />}
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-[60dvh] flex-1 flex-col lg:min-h-0">
              <CareerMap
                aria-label={`${employee.name}'s career map`}
                items={items}
                links={links}
                paths={routes}
                selectedId={step?.id}
                onSelect={selectCard}
                selectedRoute={route?.id}
                onSelectRoute={selectRoute}
                className="flex-1"
                toolbar={
                  <>
                    {(matchingPaths.length > 1 || !plan.followedPathId) && (
                      <Select value={plan.followedPathId ?? ''} onValueChange={follow}>
                        <SelectTrigger aria-label="Company path you follow" className="w-auto gap-[var(--spacing-component-xs)] bg-[var(--color-surface-default)]"><SelectValue placeholder="Choose a company path" /></SelectTrigger>
                        <SelectContent>{matchingPaths.map((p) => <SelectItem key={p.id} value={p.id}>Following: {p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                    <Button variant="outline" className="bg-[var(--color-surface-default)]" onClick={() => setDialog('add')}>
                      <PlusIcon aria-hidden="true" />Explore a position
                    </Button>
                  </>
                }
              />
              <CareerMapLegend paths={routes} selectedRoute={route?.id} onSelectRoute={selectRoute} className="border-t border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] py-[var(--spacing-component-sm)]" />
            </div>
            <aside aria-label={route ? 'Selected route' : 'Selected role'} className="flex shrink-0 flex-col border-t border-[var(--color-border-default)] lg:w-[400px] lg:overflow-y-auto lg:border-l lg:border-t-0">
              {route ? (
                <RoutePanel route={route} plan={plan} steps={steps} request={request} removeBlocked={removal?.blocked} unfollowBlocked={unfollow?.blocked}
                  actions={{
                    onFollow: follow,
                    onUnfollow: () => setDialog('unfollow'),
                    onRequest: () => setDialog('request'),
                    onWithdraw: () => { setRequest(null); toast(`Request withdrawn — Career vision ${visionOfRoute} is a draft again`); },
                    onRemoveVision: () => setDialog('remove'),
                    onSelectCard: selectCard,
                  }} />
              ) : (
                <StepPanel step={actionStep} plan={plan} links={links} request={request} removable={!!removal} removeBlocked={removal?.blocked}
                  focusGroup={actionStep.state === 'target' ? focusGroup : undefined}
                  actions={{ onSetTarget: () => setDialog('target'), onRemoveTarget: () => setDialog('untarget'), onAdd: () => setDialog('add'), onRemove: () => setDialog('remove'), onShowRoute: selectRoute }} />
              )}
            </aside>
          </div>
        </div>
      )}

      <SetTargetDialog open={dialog === 'target'} onOpenChange={(o) => !o && setDialog(null)} from={target ? levelName(target.id) : undefined} to={levelName(actionStep.id)}
        onConfirm={() => commit({ ...plan, targetId: actionStep.id }, `${levelName(actionStep.id)} is your new target`)} />
      {target && (
        <RemoveTargetDialog open={dialog === 'untarget'} onOpenChange={(o) => !o && setDialog(null)} target={levelName(target.id)}
          onConfirm={() => commit({ ...plan, targetId: null }, 'Target removed — pick another any time')} />
      )}
      {visionOfRoute !== undefined && (
        <VisionRequestDialog
          open={dialog === 'request'}
          onOpenChange={(o) => !o && setDialog(null)}
          visionName={`Career vision ${visionOfRoute}`}
          route={visionRoute(plan, visionOfRoute).map(levelName).join(' → ')}
          manager={employee.manager}
          initialNote={notes[visionOfRoute] ?? ''}
          onSend={(note) => {
            setNotes((n) => ({ ...n, [visionOfRoute]: note }));
            setRequest({ vision: visionOfRoute, status: 'waiting', note, managerNote: '' });
            setDialog(null);
            toast.success(`Career vision ${visionOfRoute} sent to ${employee.manager}`);
          }}
        />
      )}
      <ExplorePositionDialog
        open={dialog === 'add'}
        onOpenChange={(o) => !o && setDialog(null)}
        starts={starts}
        defaultFrom={actionStep.state === 'completed' ? current.id : actionStep.id}
        nextVision={(visions.at(-1) ?? 0) + 1}
        onMap={new Set(steps.map((s) => s.id))}
        manager={employee.manager}
        onAdd={addBranches}
      />
      {removal && (
        <AlertDialog open={dialog === 'remove'} onOpenChange={(o) => !o && setDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{visionOfRoute !== undefined ? `Remove Career vision ${visionOfRoute}?` : 'Remove from your map?'}</AlertDialogTitle>
              <AlertDialogDescription>
                {removal.gone.length === 1 ? 'This card goes:' : `These ${removal.gone.length} cards go, including anything added from them:`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ul className="list-disc pl-[var(--spacing-component-lg)] text-sm text-[var(--color-background-default-foreground)]">
              {removal.gone.map((s) => <li key={s.id}>{levelName(s.id)}{s.vision !== undefined ? ` · Career vision ${s.vision}` : ''}</li>)}
            </ul>
            <p className="text-sm text-[var(--color-text-secondary)]">You can add {removal.gone.length === 1 ? 'it' : 'them'} back any time. Your current role and Active target stay.</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                selectCard(current.id);
                commit(removal.next, visionOfRoute !== undefined ? `Career vision ${visionOfRoute} removed` : removal.gone.length === 1 ? `${levelName(removal.gone[0].id)} removed from your map` : `${removal.gone.length} cards removed from your map`);
              }}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {unfollow && (
        <AlertDialog open={dialog === 'unfollow'} onOpenChange={(o) => !o && setDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Stop following {companyPaths.find((p) => p.id === plan.followedPathId)?.name}?</AlertDialogTitle>
              <AlertDialogDescription>Your top row will show only your current role. These cards leave your map:</AlertDialogDescription>
            </AlertDialogHeader>
            <ul className="list-disc pl-[var(--spacing-component-lg)] text-sm text-[var(--color-background-default-foreground)]">
              {unfollow.gone.map((s) => <li key={s.id}>{levelName(s.id)} · {stateName(s)}</li>)}
            </ul>
            <p className="text-sm text-[var(--color-text-secondary)]">You can follow a company path again any time from the map.</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { selectCard(current.id); commit(unfollow.next, 'You no longer follow a company path'); }}>Stop following</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {switchPreview && (
        <SwitchPathDialog
          open={dialog === 'switch'}
          onOpenChange={(o) => { if (!o) { setDialog(null); setSwitchTo(''); } }}
          from={companyPaths.find((p) => p.id === plan.followedPathId)?.name}
          to={companyPaths.find((p) => p.id === switchTo)!.name}
          targetNote={switchPreview.note}
          onConfirm={() => {
            const nextPath = switchTo;
            commit(switchPreview.next, `You now follow ${companyPaths.find((p) => p.id === nextPath)!.name}`);
            setSel({ kind: 'route', id: nextPath });
            setSwitchTo('');
          }}
        />
      )}
      <Toaster />
    </EnpathAppShell>
    </TooltipProvider>
  );
}
