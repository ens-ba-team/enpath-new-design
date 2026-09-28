"use client";

// Step Rail — one Career Map route shown as a vertical list: the roles in order, each a ring on a rail
// drawn in the route's role colour (the path you follow green, another company path grey, a Career
// vision dashed violet). The Career Map's line language turned on its side, so it belongs to the
// Career Map family and uses career-map/* tokens. Read-only rows, or selectable rows (Item) when
// onSelect is set. Not for editing a path: that's CareerPathStepper (Setup).
//
// Tokens: career-map/followed-edge · career-map/other-path-edge · career-map/vision-edge (rail and
// route rings) · career-map/node-surface (ring fill) · career-map/node-border (muted ring) ·
// career-map/current-label + career-map/band-current (current ring) · career-map/target-border +
// career-map/band-target (target ring) · career-map/node-description (muted text, neutral status) ·
// career-map/target-label (target status) · radius/pill (ring) · spacing/component/sm (row padding,
// via Item size sm). Rows, hover, selected and focus: Item tokens.
//
// Geometry: a row is Item size="sm" type="icon" — padding spacing/component/sm, a 1rem icon slot at
// the top. The ring (0.75rem, 2px border) sits in that slot; the rail segment runs from this ring's
// centre to the next ring's centre (top = padding + half the slot; bottom = the same, negative), so
// it stays joined when a title wraps. The last row draws no segment.

import * as React from "react";

import { Item } from "@/components/ui/item";
import { cn } from "@/lib/utils";

export type StepRailTone = "followed" | "other" | "vision";
/** route: ring in the route's colour · muted: grey ring (a role behind you, or context) ·
 *  current: "You are here" · target: the Active target */
export type StepRailMarker = "route" | "muted" | "current" | "target";
export type StepRailStatusTone = "neutral" | "current" | "target";

const toneBorder: Record<StepRailTone, string> = {
  followed: "border-[var(--career-map-followed-edge)]",
  other: "border-[var(--career-map-other-path-edge)]",
  vision: "border-[var(--career-map-vision-edge)]",
};

const markerRing: Record<Exclude<StepRailMarker, "route">, string> = {
  muted: "border-[var(--career-map-node-border)] bg-[var(--career-map-node-surface)]",
  current: "border-[var(--career-map-current-label)] bg-[var(--career-map-band-current)]",
  target: "border-[var(--career-map-target-border)] bg-[var(--career-map-band-target)]",
};

const statusText: Record<StepRailStatusTone, string> = {
  neutral: "text-[var(--career-map-node-description)]",
  current: "text-[var(--career-map-current-label)]",
  target: "text-[var(--career-map-target-label)]",
};

const StepRailContext = React.createContext<StepRailTone>("followed");

export interface StepRailProps extends React.HTMLAttributes<HTMLOListElement> {
  /** The route's role: sets the rail colour, its line style (vision = dashed) and route rings */
  tone?: StepRailTone;
  /** Accessible name, e.g. "Roles on Engineering growth" */
  "aria-label": string;
}

export function StepRail({ tone = "followed", className, children, ...props }: StepRailProps) {
  return (
    <StepRailContext.Provider value={tone}>
      <ol data-slot="step-rail" data-tone={tone} className={cn("flex flex-col", className)} {...props}>
        {children}
      </ol>
    </StepRailContext.Provider>
  );
}

export interface StepRailItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title" | "onSelect"> {
  /** The role, e.g. "Backend Engineer L2 · Mid" */
  title: React.ReactNode;
  /** Short status after the title, e.g. "You are here", "Planned", "2 growth areas" */
  status?: React.ReactNode;
  statusTone?: StepRailStatusTone;
  marker?: StepRailMarker;
  /** Grey title: a role behind you, a start row shown for context, or one already on the map */
  muted?: boolean;
  /** Makes the row a selectable Item (button) */
  onSelect?: () => void;
  selected?: boolean;
}

export function StepRailItem({
  title,
  status,
  statusTone = "neutral",
  marker = "route",
  muted = false,
  onSelect,
  selected = false,
  className,
  ...props
}: StepRailItemProps) {
  const tone = React.useContext(StepRailContext);
  const ring = marker === "route" ? cn("bg-[var(--career-map-node-surface)]", toneBorder[tone]) : markerRing[marker];
  return (
    <li
      data-slot="step-rail-item"
      className={cn("relative [&:last-child>[data-slot=step-rail-line]]:hidden", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="step-rail-line"
        className={cn(
          "absolute left-[calc(var(--spacing-component-sm)+0.5rem-1px)] top-[calc(var(--spacing-component-sm)+0.5rem)] bottom-[calc(-1*(var(--spacing-component-sm)+0.5rem))] border-l-2",
          toneBorder[tone],
          tone === "vision" ? "border-dashed" : "border-solid"
        )}
      />
      <Item
        type="icon"
        size="sm"
        icon={
          <span aria-hidden="true" className="relative flex h-4 w-4 items-center justify-center">
            <span data-slot="step-rail-marker" data-marker={marker} className={cn("h-3 w-3 rounded-[var(--radius-pill)] border-2", ring)} />
          </span>
        }
        title={
          <>
            <span className={muted ? "font-normal text-[var(--career-map-node-description)]" : undefined}>{title}</span>
            {status && <span className={cn("font-normal", statusText[statusTone])}> · {status}</span>}
          </>
        }
        selected={selected}
        onSelect={onSelect}
      />
    </li>
  );
}
