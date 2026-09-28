"use client";
// My Career panels — the progress board (fixed to the Active target), the side panel for a selected
// role card, and the side panel for a selected route (a company path or a Career vision).

import * as React from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  ClockIcon,
  CompassIcon,
  FlagIcon,
  InfoIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/components/ui/item";
import { routeColor, type CareerMapPath } from "@/components/ui/career-map";
import { GapList, statusFill } from "./gap-row";
import { Tip } from "../tip";
import { cn } from "@/lib/utils";
import {
  companyPaths,
  countGaps,
  describeStep,
  gapsFor,
  matchingPaths,
  visionRoute,
  type GapStatus,
  type Plan,
  type PlanLink,
  type PlanStep,
  type VisionRequest,
  type VisionStatus,
} from "./mock-data";
import { levelName } from "./plan-dialogs";

export const requestBadge: Record<
  VisionStatus,
  { text: string; variant: "blue" | "success" | "secondary" }
> = {
  waiting: { text: "Waiting for approval", variant: "blue" },
  approved: { text: "Approved", variant: "success" },
  declined: { text: "Declined", variant: "secondary" },
};

const visionStatusText: Record<VisionStatus | "draft", string> = {
  draft: "draft, only you can see it",
  waiting: "waiting for approval",
  approved: "approved",
  declined: "declined",
};

export const stateName = (s: PlanStep) =>
  ({
    completed: "Completed",
    new: "New on your path",
    current: "You are here",
    target: "Active target",
    planned: "Planned",
    vision: visionLabel(s),
  }[s.state]);

/** "Career vision 2", or "Career visions 1, 2" for a card two visions share. */
export const visionLabel = (s: PlanStep) =>
  (s.visions?.length ?? 0) > 1 ? `Career visions ${s.visions!.join(", ")}` : `Career vision ${s.vision}`;

const note = (text: string) => (
  <p className="text-sm text-[var(--color-text-secondary)]">{text}</p>
);

/** Panel layout: content scrolls, actions sit in a footer pinned to the bottom — explanation first,
 *  then buttons stacked full width (primary, secondary, then Remove). */
function Panel({
  labelledBy,
  children,
  notes,
  buttons,
  onClose,
}: {
  labelledBy: string;
  children: React.ReactNode;
  notes: (string | false | undefined)[];
  buttons: React.ReactNode[];
  /** Shows a close button top-right (same place as the Sheet's) — closing clears the selection. */
  onClose?: () => void;
}) {
  const shown = notes.filter((n): n is string => !!n);
  return (
    <section aria-labelledby={labelledBy} className="relative flex flex-1 flex-col">
      {onClose && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close details"
          onClick={onClose}
          className="absolute right-[var(--spacing-layout-xs)] top-[var(--spacing-layout-xs)] z-10"
        >
          <XIcon aria-hidden="true" />
        </Button>
      )}
      {/* The header (first child) leaves room for the close button. */}
      <div className={`flex flex-1 flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]${onClose ? " [&>*:first-child]:pr-[var(--height-control-md)]" : ""}`}>
        {children}
      </div>
      {(shown.length > 0 || buttons.length > 0) && (
        <div className="sticky bottom-0 flex flex-col gap-[var(--spacing-component-md)] border-t border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-layout-xs)]">
          {shown.map((n) => (
            <React.Fragment key={n}>{note(n)}</React.Fragment>
          ))}
          {buttons.length > 0 && (
            <div className="flex flex-col gap-[var(--spacing-component-sm)] [&>button]:w-full">
              {buttons}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Progress board ──────────────────────────────────────────────────────────

/** A company path Lan follows changed (2026-09-28): an info Alert in the page header, on the row of
 *  Map / List and Ask AI (same place as Setup's progress Alert). Opens Path history; it goes once
 *  opened (no required acknowledgement). */
export function PathChangeNotice({ path, date, onOpen, className }: { path: string; date: string; onOpen: () => void; className?: string }) {
  return (
    // Design-system Alert (info), as wide as its content, not full width (2026-09-28). Not urgent, so
    // role=status instead of the Alert's default role=alert.
    <Alert
      variant="info"
      role="status"
      className={cn("w-fit max-w-full flex-row flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]", className)}
    >
      <span className="flex items-center gap-[var(--spacing-component-sm)]">
        <InfoIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <AlertTitle>{path} changed {date}</AlertTitle>
      </span>
      <Button variant="link" size="sm" className="h-auto px-0" onClick={onOpen}>
        See what’s different
      </Button>
    </Alert>
  );
}

/** Shown instead of the progress strip when there's no Active target. `lostTarget`: the target a
 *  company path change took off the map (the plan still names it). */
export function NoTargetStrip({ lostTarget }: { lostTarget?: string }) {
  return (
    <section
      aria-label="Your progress"
      className="flex flex-col gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] pb-[var(--spacing-layout-sm)] text-sm text-[var(--color-text-secondary)]"
    >
      <div className="flex items-start gap-[var(--spacing-component-sm)]">
        <FlagIcon
          className="mt-[var(--spacing-component-xxs)] h-4 w-4 shrink-0 text-[var(--color-icon-muted)]"
          aria-hidden="true"
        />
        <span>
          <span className="font-semibold text-[var(--color-background-default-foreground)]">
            {lostTarget ? "Pick a new target." : "No target yet."}
          </span>{" "}
          {lostTarget
            ? `${lostTarget} is no longer on your path. Pick a role on your map and choose Set as target.`
            : "Pick a role on your map and choose Set as target to track your progress."}
        </span>
      </div>
    </section>
  );
}

/** One-line progress toward the Active target: target, a short bar, the counts next to it, the
 *  total and an info tooltip. Each count opens the target with that group's card expanded. */
export function ProgressBoard({
  target,
  onOpenGroup,
}: {
  target: PlanStep;
  onOpenGroup: (group: GapStatus) => void;
}) {
  const d = describeStep(target);
  const n = countGaps(gapsFor(target));
  const groups = (
    [
      { key: "ready", count: n.ready, label: "ready" },
      {
        key: "growth",
        count: n.growth,
        label: n.growth === 1 ? "growth area" : "growth areas",
      },
      { key: "evidence", count: n.evidence, label: "not assessed yet" },
    ] as const
  ).filter((g) => g.count > 0);
  const total = n.ready + n.growth + n.evidence;
  return (
    <section
      aria-labelledby="progress-title"
      className="flex flex-col gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] pb-[var(--spacing-layout-xs)]"
    >
      {/* The goal reads as a heading (font-size/lg — small heading, two steps under the page’s 2xl). */}
      <h2
        id="progress-title"
        className="flex items-center gap-[var(--spacing-component-sm)] text-lg text-[var(--color-background-default-foreground)]"
      >
        <FlagIcon
          weight="fill"
          className="h-5 w-5 shrink-0 text-[var(--color-icon-success)]"
          aria-hidden="true"
        />
        <span>
          Toward{" "}
          <span className="font-semibold">
            {d.title} {d.level}
          </span>
        </span>
      </h2>
      <div className="flex flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)]">
        {/* Short on purpose — a breakdown of a few competencies, not a page-wide progress bar. Width = 3 × layout/xl. */}
        <div
          className="flex h-1.5 w-[calc(var(--spacing-layout-xl)*3)] max-w-full gap-[var(--spacing-component-xxs)] overflow-hidden rounded-[var(--radius-pill)]"
          aria-hidden="true"
        >
          {groups.map((g) => (
            <span
              key={g.key}
              className={statusFill[g.key]}
              style={{ flexGrow: g.count }}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-[var(--spacing-component-xs)] gap-y-[var(--spacing-component-xs)]">
          {groups.map((g) => (
            <Button
              key={g.key}
              variant="outline"
              size="sm"
              className="font-normal"
              onClick={() => onOpenGroup(g.key)}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-[var(--radius-pill)] ${
                  statusFill[g.key]
                }`}
              />
              <span>
                <span className="font-semibold">{g.count}</span> {g.label}
              </span>
            </Button>
          ))}
          <span className="px-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]">
            of {total}
          </span>
          <Tip
            label={`Scores come from your latest approved assessment. “Not assessed yet” means a competency has no approved score yet, so it doesn’t count as a growth area. Your manager assesses it in a future assessment.${
              n.unset > 0
                ? ` ${n.unset} expectation${
                    n.unset === 1 ? " is" : "s are"
                  } not set in Setup.`
                : ""
            }`}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="About these numbers"
              className="text-[var(--color-icon-muted)]"
            >
              <InfoIcon aria-hidden="true" />
            </Button>
          </Tip>
        </div>
      </div>
    </section>
  );
}

// ─── Role card panel ─────────────────────────────────────────────────────────

export interface StepActions {
  onSetTarget: () => void;
  onRemoveTarget: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onShowRoute: (routeId: string) => void;
  onClose?: () => void;
}

export function StepPanel({
  step,
  plan,
  links,
  request,
  removable,
  removeBlocked,
  focusGroup,
  actions,
}: {
  step: PlanStep;
  plan: Plan;
  links: PlanLink[];
  request: VisionRequest | null;
  removable: boolean;
  removeBlocked?: string;
  /** Opened from the progress strip: which group to expand; `n` changes on every click */
  focusGroup?: { group: GapStatus; n: number };
  actions: StepActions;
}) {
  const d = describeStep(step);
  const gaps = gapsFor(step);
  const n = countGaps(gaps);
  const incoming = links.find((l) => l.to === step.id);
  const path =
    companyPaths.find((p) => p.id === incoming?.route) ??
    (step.state === "completed"
      ? companyPaths.find((p) => p.id === plan.followedPathId)
      : undefined);
  const mine =
    request && (step.visions ?? []).includes(request.vision)
      ? request
      : null;
  // One badge for what the card is, one line for where it comes from.
  const badge: {
    text: string;
    variant: "success" | "blue" | "secondary" | "dashed";
  } = {
    completed: { text: "Completed", variant: "secondary" as const },
    new: { text: "New on your path", variant: "secondary" as const },
    current: { text: "You are here", variant: "blue" as const },
    target: { text: "Active target", variant: "success" as const },
    planned: { text: "Planned", variant: "secondary" as const },
    vision: {
      text: `${visionLabel(step)} · ${mine ? mine.status : "draft"}`,
      variant: "dashed" as const,
    },
  }[step.state];
  const added = step.state === "new" && path ? path.changes?.find((c) => !c.before.includes(step.id)) : undefined;
  const context =
    step.state === "new" && path
      ? `Added to ${path.name}${added ? ` on ${added.date}` : ""}`
      : step.state === "current"
      ? "Your official role · set by your admin"
      : step.state === "vision"
      ? `Your own direction · ${visionStatusText[mine?.status ?? "draft"]}`
      : path
      ? `${path.name}${
          path.id === plan.followedPathId ? " · the path you follow" : ""
        }`
      : "";

  const buttons: React.ReactNode[] = [];
  let hint: string | undefined;
  const setTarget = (
    <Button key="target" onClick={actions.onSetTarget}>
      <FlagIcon aria-hidden="true" />
      Set as target
    </Button>
  );
  if (step.state === "planned") buttons.push(setTarget);
  if (step.state === "vision") {
    if (mine?.status === "approved") buttons.push(setTarget);
    // One button per vision the card is on (visions can share a stretch of road).
    for (const n of step.visions ?? [step.vision!])
      buttons.push(
        <Button
          key={`route-${n}`}
          variant="outline"
          onClick={() => actions.onShowRoute(`vision-${n}`)}
        >
          <CompassIcon aria-hidden="true" />
          Show Career vision {n}
        </Button>
      );
    if (mine?.status !== "approved")
      hint = "Your manager approves career visions before they can become your target.";
  }
  // A level the path added behind Lan: nothing to do but know it. It isn't counted as held.
  if (step.state === "new")
    hint = "You haven't held this level, so it isn't completed yet. It becomes completed when an approved assessment meets it, or when your manager marks it.";
  if (step.state !== "completed" && step.state !== "new")
    buttons.push(
      <Button key="add" variant="outline" onClick={actions.onAdd}>
        <PlusIcon aria-hidden="true" />
        Explore a position from here
      </Button>
    );
  if (step.state === "target")
    buttons.push(
      <Button
        key="untarget"
        variant="ghost-destructive"
        onClick={actions.onRemoveTarget}
      >
        Remove as target
      </Button>
    );
  if (removable && !removeBlocked)
    buttons.push(
      <Button
        key="remove"
        variant="ghost-destructive"
        onClick={actions.onRemove}
      >
        <TrashIcon aria-hidden="true" />
        Remove from my map
      </Button>
    );

  return (
    <Panel
      onClose={actions.onClose}
      labelledBy="step-title"
      notes={[hint, removable && removeBlocked]}
      buttons={buttons}
    >
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <h2
          id="step-title"
          className="text-lg font-semibold text-[var(--color-background-default-foreground)]"
        >
          {d.title}{" "}
          <span className="font-normal text-[var(--color-text-secondary)]">
            {d.level}
          </span>
        </h2>
        {/* Badge on its own line, the context line always under it — same in every detail panel. */}
        <div className="flex flex-col items-start gap-[var(--spacing-component-xs)]">
          <Badge variant={badge.variant} shape="pill" size="md">
            {badge.text}
          </Badge>
          {context && (
            <span className="text-sm text-[var(--color-text-secondary)]">
              {context}
            </span>
          )}
        </div>
        {n.unset < gaps.length && (
          <div
            className="mt-[var(--spacing-component-sm)] flex h-1.5 gap-[var(--spacing-component-xxs)] overflow-hidden rounded-[var(--radius-pill)]"
            aria-hidden="true"
          >
            {(["ready", "growth", "evidence"] as const).map((k) =>
              n[k] > 0 ? (
                <span
                  key={k}
                  className={statusFill[k]}
                  style={{ flexGrow: n[k] }}
                />
              ) : null
            )}
          </div>
        )}
      </div>
      {n.unset === gaps.length ? (
        note(
          "Nothing to compare yet. This level has no expectations set in Setup."
        )
      ) : (
        <GapList
          key={`${step.id}-${focusGroup?.n ?? 0}`}
          gaps={gaps}
          focus={focusGroup?.group}
        />
      )}
    </Panel>
  );
}

// ─── Route panel ─────────────────────────────────────────────────────────────

export interface RouteActions {
  onFollow: (pathId: string) => void;
  /** Path history drawer (the followed path, when it has changes) */
  onPathHistory: () => void;
  onRequest: () => void;
  onWithdraw: () => void;
  onRemoveVision: () => void;
  onSelectCard: (id: string) => void;
  onClose?: () => void;
}

/** Roles on a route in order, as selectable Items. For a Career vision the first entry is the card it
 *  branches from (hollow dot) — not part of the vision itself. */
function RouteSteps({
  ids,
  steps,
  onSelectCard,
}: {
  ids: string[];
  steps: PlanStep[];
  onSelectCard: (id: string) => void;
}) {
  return (
    <div
      role="list"
      aria-label="Roles on this route"
      className="-mx-[var(--spacing-component-sm)] flex flex-col"
    >
      {ids.map((id) => {
        const s = steps.find((x) => x.id === id);
        const state = s?.state;
        const StatusIcon = state === "completed"
          ? CheckCircleIcon
          : state === "current"
            ? MapPinIcon
            : state === "target"
              ? FlagIcon
              : state === "planned"
                ? ClockIcon
                : CompassIcon;
        const statusClass = state === "current"
          ? "text-[var(--career-map-current-label)]"
          : state === "target"
            ? "text-[var(--career-map-target-label)]"
            : "text-[var(--color-text-secondary)]";
        return (
          <div role="listitem" key={id}>
            <Item
              type="icon"
              size="sm"
              icon={
                <StatusIcon aria-hidden="true" className={`h-4 w-4 ${statusClass}`} />
              }
              title={
                <>
                  <span className={state === "current" ? "font-semibold" : undefined}>{levelName(id)}</span>
                  {s && <span className="font-normal text-[var(--color-text-secondary)]"> · {stateName(s)}</span>}
                </>
              }
              action={<ArrowRightIcon aria-hidden="true" className="h-4 w-4 text-[var(--color-text-secondary)]" />}
              onSelect={() => onSelectCard(id)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function RoutePanel({
  route,
  plan,
  steps,
  request,
  removeBlocked,
  actions,
}: {
  route: CareerMapPath;
  plan: Plan;
  steps: PlanStep[];
  request: VisionRequest | null;
  removeBlocked?: string;
  actions: RouteActions;
}) {
  const color = routeColor(route);
  // Same pattern as the role-card header: title, then a badge (carrying the route's swatch) and one
  // context line.
  type BadgeVariant = "success" | "blue" | "secondary" | "dashed";
  const header = (badge: { text: string; variant: BadgeVariant }, title: string, context: string) => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <h2
        id="route-title"
        className="text-lg font-semibold text-[var(--color-background-default-foreground)]"
      >
        {title}
      </h2>
      {/* Badge on its own line, the context line always under it — same as the role panel. */}
      <div className="flex flex-col items-start gap-[var(--spacing-component-xs)]">
        <Badge variant={badge.variant} shape="pill" size="md">
          <span
            aria-hidden="true"
            className={
              route.kind === "vision"
                ? "w-3 border-t-[3px] border-dashed"
                : "h-[3px] w-3 rounded-[var(--radius-pill)]"
            }
            style={route.kind === "vision" ? { borderColor: color } : { backgroundColor: color }}
          />
          {badge.text}
        </Badge>
        <span className="text-sm text-[var(--color-text-secondary)]">{context}</span>
      </div>
    </div>
  );

  if (route.kind === "vision") {
    const n = Number(route.id.replace("vision-", ""));
    const ids = visionRoute(plan, n);
    const mine = request?.vision === n ? request : null;
    const buttons: React.ReactNode[] = [];
    let hint: string;
    if (mine?.status === "waiting") {
      buttons.push(
        <Button key="withdraw" variant="outline" onClick={actions.onWithdraw}>
          Withdraw request
        </Button>
      );
      hint = "Your manager is reviewing it. Your current role stays the same.";
    } else if (mine?.status === "approved") {
      hint = `Your manager agreed on this direction. Select a role in it to make it your target.`;
    } else if (request?.status === "waiting") {
      hint = `Career vision ${request.vision} is waiting for approval. You can send one at a time. Withdraw it to send this one.`;
    } else {
      buttons.push(
        <Button key="request" onClick={actions.onRequest}>
          {mine?.status === "declined"
            ? "Edit and resend"
            : "Request manager approval"}
        </Button>
      );
      hint = `It leaves your company path, so your manager approves it before any role in it can become your target.`;
    }
    if (!removeBlocked)
      buttons.push(
        <Button
          key="remove"
          variant="ghost-destructive"
          onClick={actions.onRemoveVision}
        >
          <TrashIcon aria-hidden="true" />
          Remove Career vision {n}
        </Button>
      );
    return (
      <Panel
      onClose={actions.onClose}
        labelledBy="route-title"
        notes={[
          mine?.status === "declined" && mine.managerNote
            ? `Your manager: “${mine.managerNote}”`
            : undefined,
          hint,
          removeBlocked,
        ]}
        buttons={buttons}
      >
        {header(
          mine ? requestBadge[mine.status] : { text: "Draft", variant: "dashed" },
          route.name,
          mine ? "Your own direction" : "Your own direction · private"
        )}
        <RouteSteps
          ids={ids}
          steps={steps}
          onSelectCard={actions.onSelectCard}
        />
      </Panel>
    );
  }

  const path = companyPaths.find((p) => p.id === route.id)!;
  const ids = path.levels.filter((id) => steps.some((s) => s.id === id));
  const followed = route.id === plan.followedPathId;
  const canFollow = !followed && matchingPaths.some((p) => p.id === route.id);
  const target = steps.find((s) => s.state === "target");
  const companyButtons: React.ReactNode[] = [];
  if (canFollow) {
    companyButtons.push(
      <Button key="follow" onClick={() => actions.onFollow(route.id)}>
        Follow this path
      </Button>,
    );
  } else if (followed) {
    if (target) {
      companyButtons.push(
        <Button key="target" variant="outline" onClick={() => actions.onSelectCard(target.id)}>
          Open Active target
        </Button>,
      );
    }
    if (path.changes?.length)
      companyButtons.push(
        <Button key="history" variant="outline" onClick={actions.onPathHistory}>
          <ClockCounterClockwiseIcon aria-hidden="true" />
          Path history
        </Button>,
      );
  }
  return (
    <Panel
      onClose={actions.onClose}
      labelledBy="route-title"
      notes={[
        canFollow && "It becomes your main route, shown in the top row.",
      ]}
      buttons={companyButtons}
    >
      {header(
        followed ? { text: "You follow", variant: "success" } : { text: "Company path", variant: "secondary" },
        path.name,
        followed
          ? `Planned by your company · ${ids.length} levels`
          : "For your role · no approval needed"
      )}
      <RouteSteps
        ids={ids}
        steps={steps}
        onSelectCard={actions.onSelectCard}
      />
    </Panel>
  );
}
