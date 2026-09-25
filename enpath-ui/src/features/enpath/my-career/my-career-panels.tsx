"use client";
// My Career panels — the progress board (fixed to the Active target), the side panel for a selected
// role card, and the side panel for a selected route (a company path or a Career vision).

import * as React from "react";
import {
  CompassIcon,
  FlagIcon,
  InfoIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/components/ui/item";
import { routeColor, type CareerMapPath } from "@/components/ui/career-map";
import { GapList, statusFill } from "./gap-row";
import { Tip } from "../tip";
import {
  companyPaths,
  countGaps,
  describeStep,
  employee,
  gapsFor,
  matchingPaths,
  recordCount,
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
  waiting: { text: `Waiting for ${employee.manager}`, variant: "blue" },
  approved: { text: `Approved by ${employee.manager}`, variant: "success" },
  declined: { text: `Declined by ${employee.manager}`, variant: "secondary" },
};

const visionStatusText: Record<VisionStatus | "draft", string> = {
  draft: "draft, only you can see it",
  waiting: `waiting for ${employee.manager}`,
  approved: `approved by ${employee.manager}`,
  declined: `declined by ${employee.manager}`,
};

export const stateName = (s: PlanStep) =>
  ({
    completed: "Completed",
    current: "You are here",
    target: "Active target",
    planned: "Planned",
    vision: `Career vision ${s.vision}`,
  }[s.state]);

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
}: {
  labelledBy: string;
  children: React.ReactNode;
  notes: (string | false | undefined)[];
  buttons: React.ReactNode[];
}) {
  const shown = notes.filter((n): n is string => !!n);
  return (
    <section aria-labelledby={labelledBy} className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]">
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

/** Shown instead of the progress strip when there's no Active target. */
export function NoTargetStrip() {
  return (
    <section
      aria-label="Your progress"
      className="flex items-center gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] pb-[var(--spacing-layout-sm)] text-sm text-[var(--color-text-secondary)]"
    >
      <FlagIcon
        className="h-4 w-4 shrink-0 text-[var(--color-icon-muted)]"
        aria-hidden="true"
      />
      <span>
        <span className="font-semibold text-[var(--color-background-default-foreground)]">
          No target yet.
        </span>{" "}
        Pick a role on your map and choose Set as target to track your progress.
      </span>
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
      { key: "evidence", count: n.evidence, label: "need evidence" },
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
        <div className="flex flex-wrap items-center">
          {groups.map((g) => (
            <Button
              key={g.key}
              variant="ghost"
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
            label={`Based on ${recordCount} acknowledged records. “Need evidence” means there are no records yet — it isn’t a gap.${
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
    step.vision !== undefined && request?.vision === step.vision
      ? request
      : null;
  // One badge for what the card is, one line for where it comes from.
  const badge: {
    text: string;
    variant: "success" | "blue" | "secondary" | "dashed";
  } = {
    completed: { text: "Completed", variant: "secondary" as const },
    current: { text: "You are here", variant: "blue" as const },
    target: { text: "Active target", variant: "success" as const },
    planned: { text: "Planned", variant: "secondary" as const },
    vision: {
      text: `Career vision ${step.vision} · ${mine ? mine.status : "draft"}`,
      variant: "dashed" as const,
    },
  }[step.state];
  const context =
    step.state === "current"
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
    buttons.push(
      <Button
        key="route"
        variant="outline"
        onClick={() => actions.onShowRoute(`vision-${step.vision}`)}
      >
        <CompassIcon aria-hidden="true" />
        Show Career vision {step.vision}
      </Button>
    );
    if (mine?.status !== "approved")
      hint = `${employee.manager} approves career visions before they can become your target.`;
  }
  if (step.state !== "completed")
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
        <div className="flex flex-wrap items-center gap-x-[var(--spacing-component-sm)] gap-y-[var(--spacing-component-xs)]">
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
          "No gap comparison yet — this level has no expectations set in Setup."
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
  onUnfollow: () => void;
  onRequest: () => void;
  onWithdraw: () => void;
  onRemoveVision: () => void;
  onSelectCard: (id: string) => void;
}

/** Roles on a route in order, as selectable Items. For a Career vision the first entry is the card it
 *  branches from (hollow dot) — not part of the vision itself. */
function RouteSteps({
  ids,
  steps,
  color,
  anchorFirst = false,
  onSelectCard,
}: {
  ids: string[];
  steps: PlanStep[];
  color: string;
  anchorFirst?: boolean;
  onSelectCard: (id: string) => void;
}) {
  return (
    <div
      role="list"
      aria-label="Roles on this route"
      className="-mx-[var(--spacing-component-sm)] flex flex-col"
    >
      {ids.map((id, i) => {
        const s = steps.find((x) => x.id === id);
        return (
          <div role="listitem" key={id}>
            <Item
              type="icon"
              size="sm"
              icon={
                <span
                  aria-hidden="true"
                  className="block h-2 w-2 rounded-[var(--radius-pill)] border-2"
                  style={
                    anchorFirst && i === 0
                      ? { borderColor: color }
                      : { borderColor: color, backgroundColor: color }
                  }
                />
              }
              title={levelName(id)}
              description={s ? stateName(s) : undefined}
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
  unfollowBlocked,
  actions,
}: {
  route: CareerMapPath;
  plan: Plan;
  steps: PlanStep[];
  request: VisionRequest | null;
  removeBlocked?: string;
  /** Why the followed path can't be unfollowed right now, if it can't */
  unfollowBlocked?: string;
  actions: RouteActions;
}) {
  const color = routeColor(route);
  const header = (label: string, title: string, sub?: string) => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <p className="flex items-center gap-[var(--spacing-component-sm)] text-xs font-semibold text-[var(--color-text-secondary)]">
        <span
          aria-hidden="true"
          className={
            route.kind === "vision"
              ? "w-5 border-t-2 border-dashed"
              : "h-0.5 w-5 rounded-[var(--radius-pill)]"
          }
          style={
            route.kind === "vision"
              ? { borderColor: color }
              : { backgroundColor: color }
          }
        />
        {label}
      </p>
      <h2
        id="route-title"
        className="text-lg font-semibold text-[var(--color-background-default-foreground)]"
      >
        {title}
      </h2>
      {sub && note(sub)}
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
      hint = `${employee.manager} is reviewing it. Your current role stays the same.`;
    } else if (mine?.status === "approved") {
      hint = `${employee.manager} agreed on this direction. Select a role in it to make it your target.`;
    } else if (request?.status === "waiting") {
      hint = `Career vision ${request.vision} is waiting for ${employee.manager}. You can send one at a time — withdraw it to send this one.`;
    } else {
      buttons.push(
        <Button key="request" onClick={actions.onRequest}>
          {mine?.status === "declined"
            ? "Edit and resend"
            : "Request manager approval"}
        </Button>
      );
      hint = `It leaves your company path, so ${employee.manager} approves it before any role in it can become your target.`;
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
        labelledBy="route-title"
        notes={[
          mine?.status === "declined" && mine.managerNote
            ? `${employee.manager}: “${mine.managerNote}”`
            : undefined,
          hint,
          removeBlocked,
        ]}
        buttons={buttons}
      >
        {header(
          "Your career vision",
          route.name,
          mine ? requestBadge[mine.status].text : "Draft · only you can see it"
        )}
        <RouteSteps
          ids={ids}
          steps={steps}
          color={color}
          anchorFirst
          onSelectCard={actions.onSelectCard}
        />
      </Panel>
    );
  }

  const path = companyPaths.find((p) => p.id === route.id)!;
  const ids = path.levels.filter((id) => steps.some((s) => s.id === id));
  const followed = route.id === plan.followedPathId;
  const canFollow = !followed && matchingPaths.some((p) => p.id === route.id);
  return (
    <Panel
      labelledBy="route-title"
      notes={[
        canFollow && "It becomes your main route, shown in the top row.",
        followed && unfollowBlocked,
      ]}
      buttons={
        canFollow
          ? [
              <Button key="follow" onClick={() => actions.onFollow(route.id)}>
                Follow this path
              </Button>,
            ]
          : followed && !unfollowBlocked
          ? [
              <Button
                key="unfollow"
                variant="ghost-destructive"
                onClick={actions.onUnfollow}
              >
                Stop following this path
              </Button>,
            ]
          : []
      }
    >
      {header(
        followed ? "The company path you follow" : "Company path",
        path.name,
        followed
          ? "Your main route — planned for your role by your company."
          : "Planned for your role by your company. No approval needed."
      )}
      <RouteSteps
        ids={ids}
        steps={steps}
        color={color}
        onSelectCard={actions.onSelectCard}
      />
    </Panel>
  );
}
