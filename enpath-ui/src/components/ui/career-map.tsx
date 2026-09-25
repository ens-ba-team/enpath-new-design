"use client";

// Career Map — a read-only canvas of an employee's career plan: role cards joined by routes —
// company Career Paths (the followed one green, others coloured per path) and dashed violet Career
// visions (the employee's own drafts). Clicking a line (or its legend entry) selects the whole route:
// its lines thicken and its cards get a ring in the route's colour. Built on React Flow (@xyflow/react); every colour, radius and spacing is a career-map/*
// component token. Cards are laid out left → right automatically from the links — consumers pass
// items and links, never coordinates.
//
// Tokens: career-map/canvas · grid · grid-strong · node-surface · node-border · node-foreground ·
// node-description · node-selected · current-label · target-label · target-border ·
// vision-border · vision-edge · followed-edge · path-1..3 · node-radius · node-padding · node-gap

import * as React from "react";
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import {
  CheckCircleIcon,
  ClockIcon,
  CompassIcon,
  CornersOutIcon,
  FlagIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CareerMapNodeState = "completed" | "current" | "target" | "planned" | "vision";

export interface CareerMapItem {
  id: string;
  /** Position name, e.g. "Backend Engineer" */
  title: string;
  /** Level label, e.g. "L3 · Mid" */
  level: string;
  state: CareerMapNodeState;
  /** Replaces the state's label text, e.g. "Career vision 2". The state still sets icon and colour. */
  label?: string;
  /** Row on the map: 0 is the top row (the company path), higher numbers go down. Cards without a
   *  lane are stacked per column. A taken spot pushes a card to the next free row below. */
  lane?: number;
}

export interface CareerMapLink {
  from: string;
  to: string;
  /** Id of the route (a CareerMapPath) this move belongs to */
  route: string;
}

/** A route on the map: a company Career Path or one of the employee's Career visions. */
export interface CareerMapPath {
  id: string;
  name: string;
  /** "vision" routes are dashed violet; "company" (default) routes are solid */
  kind?: "company" | "vision";
  /** The company path the employee follows — drawn green */
  followed?: boolean;
  /** Colour of any other company path: career-map/path-N */
  color?: 1 | 2 | 3;
}

/** CSS colour of a route's lines, arrowheads and highlight ring. */
export function routeColor(p?: CareerMapPath) {
  if (!p || p.kind === "vision") return "var(--career-map-vision-edge)";
  if (p.followed) return "var(--career-map-followed-edge)";
  return `var(--career-map-path-${p.color ?? 1})`;
}

// Layout constants are canvas coordinates (React Flow positions), not CSS spacing.
const NODE_WIDTH = 176;
const NODE_HEIGHT = 104; // fits a two-line title
const COLUMN_GAP = 48;
// Opening view never shrinks cards below this zoom — text must stay readable. If the whole map
// doesn't fit at this zoom (phones), the map opens on the current role and its next steps.
const MIN_READABLE_ZOOM = 0.7; // a 4-level path fits one row on a laptop; card text stays ≥ ~10px
const FIT_PADDING = 0.05;
const MIN_ZOOM = 0.4;
// Screen space kept clear at the top for the toolbar and zoom controls when fitting the view.
const TOP_INSET = 56;
const ROW_GAP = 32;

const stateLabel: Record<
  CareerMapNodeState,
  { text: string; icon: React.ElementType; className: string }
> = {
  completed: { text: "Completed", icon: CheckCircleIcon, className: "text-[var(--career-map-node-description)]" },
  current: { text: "You are here", icon: MapPinIcon, className: "text-[var(--career-map-current-label)]" },
  target: { text: "Active target", icon: FlagIcon, className: "text-[var(--career-map-target-label)]" },
  planned: { text: "Planned", icon: ClockIcon, className: "text-[var(--career-map-node-description)]" },
  vision: { text: "Career vision", icon: CompassIcon, className: "text-[var(--career-map-node-description)]" },
};

type CareerMapNodeData = {
  title: string; level: string; state: CareerMapNodeState; label?: string;
  /** Colour of the selected route's ring, when this card is on it */
  ring?: string;
};
type CareerMapFlowNode = Node<CareerMapNodeData, "careerMapNode">;

function CareerMapNode({ data, selected }: NodeProps<CareerMapFlowNode>) {
  const label = stateLabel[data.state];
  const Icon = label.icon;
  return (
    <div
      data-slot="career-map-node"
      data-state={data.state}
      className={cn(
        "flex h-full flex-col justify-center gap-[var(--career-map-node-gap)] rounded-[var(--career-map-node-radius)] border bg-[var(--career-map-node-surface)] p-[var(--career-map-node-padding)] text-left",
        data.state === "vision"
          ? "border-dashed border-[var(--career-map-vision-border)]"
          : data.state === "target"
            ? "border-[var(--career-map-target-border)]"
            : "border-[var(--career-map-node-border)]",
        selected &&
          "outline-2 outline-offset-2 outline-[var(--career-map-node-selected)] outline-solid",
        !selected && data.ring && "outline-2 outline-offset-2 outline-solid"
      )}
      style={!selected && data.ring ? { outlineColor: data.ring } : undefined}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} className="!pointer-events-none !opacity-0" />
      <span className={cn("inline-flex items-center gap-[var(--spacing-component-xs)] text-xs font-semibold", label.className)}>
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {data.label ?? label.text}
      </span>
      <span className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--career-map-node-foreground)]">{data.title}</span>
      <span className="truncate text-sm text-[var(--career-map-node-description)]">{data.level}</span>
      <Handle type="source" position={Position.Right} isConnectable={false} className="!pointer-events-none !opacity-0" />
    </div>
  );
}

const nodeTypes = { careerMapNode: CareerMapNode };

/**
 * Columns from the longest chain of links reaching each card. Rows: a card's lane when given (0 = top),
 * pushed down to the next free row if taken; cards without a lane are centred per column.
 */
function layout(items: CareerMapItem[], links: CareerMapLink[]) {
  const ids = new Set(items.map((i) => i.id));
  const valid = links.filter((l) => ids.has(l.from) && ids.has(l.to));
  const depth = new Map(items.map((i) => [i.id, 0]));
  // Longest-path depth; bounded passes guard against accidental cycles.
  for (let pass = 0; pass < items.length; pass++) {
    let changed = false;
    for (const l of valid) {
      const next = (depth.get(l.from) ?? 0) + 1;
      if (next > (depth.get(l.to) ?? 0)) { depth.set(l.to, next); changed = true; }
    }
    if (!changed) break;
  }
  const position = new Map<string, { x: number; y: number }>();
  const x = (id: string) => (depth.get(id) ?? 0) * (NODE_WIDTH + COLUMN_GAP);
  const laned = items.filter((i) => i.lane !== undefined);
  if (laned.length > 0) {
    const taken = new Set<string>();
    for (const i of [...laned].sort((a, b) => a.lane! - b.lane!)) {
      const col = depth.get(i.id) ?? 0;
      let row = i.lane!;
      while (taken.has(`${col}:${row}`)) row++;
      taken.add(`${col}:${row}`);
      position.set(i.id, { x: x(i.id), y: row * (NODE_HEIGHT + ROW_GAP) });
    }
  }
  const columns = new Map<number, string[]>();
  for (const i of items.filter((i) => i.lane === undefined)) {
    const d = depth.get(i.id) ?? 0;
    columns.set(d, [...(columns.get(d) ?? []), i.id]);
  }
  for (const col of columns.values()) {
    col.forEach((id, row) => position.set(id, { x: x(id), y: (row - (col.length - 1) / 2) * (NODE_HEIGHT + ROW_GAP) }));
  }
  return { position, links: valid };
}

function CareerMapControls({ ids, position }: { ids: string[]; position: Positions }) {
  const { zoomIn, zoomOut, setViewport } = useReactFlow();
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  const showAll = () => setViewport(viewportFor(ids, position, width, height, MIN_ZOOM).viewport, { duration: 200 });
  return (
    <div className="absolute right-[var(--spacing-component-md)] top-[var(--spacing-component-md)] z-10 flex gap-[var(--spacing-component-xs)]">
      <Button variant="outline" size="icon-sm" aria-label="Zoom out" onClick={() => zoomOut()}><MinusIcon /></Button>
      <Button variant="outline" size="icon-sm" aria-label="Zoom in" onClick={() => zoomIn()}><PlusIcon /></Button>
      <Button variant="outline" size="icon-sm" aria-label="Show whole map" onClick={showAll}><CornersOutIcon /></Button>
    </div>
  );
}

type Positions = Map<string, { x: number; y: number }>;

/** Viewport that centres the given cards at the largest zoom that fits, clamped to [minZoom, 1]. */
function viewportFor(ids: string[], position: Positions, width: number, height: number, minZoom: number) {
  const pts = ids.map((id) => position.get(id)).filter((p): p is { x: number; y: number } => !!p);
  const left = Math.min(...pts.map((p) => p.x));
  const top = Math.min(...pts.map((p) => p.y));
  const w = Math.max(...pts.map((p) => p.x)) - left + NODE_WIDTH;
  const h = Math.max(...pts.map((p) => p.y)) - top + NODE_HEIGHT;
  const usableH = height - TOP_INSET;
  const fit = Math.min((width * (1 - 2 * FIT_PADDING)) / w, (usableH * (1 - 2 * FIT_PADDING)) / h);
  const zoom = Math.min(1, Math.max(minZoom, fit));
  return { fit, viewport: { zoom, x: width / 2 - (left + w / 2) * zoom, y: TOP_INSET + usableH / 2 - (top + h / 2) * zoom } };
}

/**
 * Opening view, set once the canvas has a size and again whenever cards are added or removed or
 * the canvas width changes noticeably, e.g. a side panel opens (not on selection): the whole map when it stays readable (zoom ≥ MIN_READABLE_ZOOM), otherwise
 * the current role and its next steps. Computed from the layout (card sizes are fixed), so it
 * doesn't wait for React Flow to measure the cards.
 */
function OpeningView({ items, links, position }: { items: CareerMapItem[]; links: CareerMapLink[]; position: Positions }) {
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  const { setViewport } = useReactFlow();
  const fittedFor = React.useRef("");
  const ids = items.map((i) => i.id).sort().join("|");
  // Width in 48px steps, so a panel opening or closing re-fits but a 1px resize doesn't.
  const cardsKey = `${ids}#${Math.round(width / 48)}`;
  React.useEffect(() => {
    if (fittedFor.current === cardsKey || !width || !height || items.length === 0) return;
    const first = fittedFor.current === "";
    const before = new Set(fittedFor.current.split("#")[0].split("|"));
    fittedFor.current = cardsKey;
    const duration = first ? 0 : 300;
    const all = viewportFor(items.map((i) => i.id), position, width, height, MIN_READABLE_ZOOM);
    const current = items.find((i) => i.state === "current")?.id;
    if (all.fit >= MIN_READABLE_ZOOM || !current) { setViewport(all.viewport, { duration }); return; }
    // Cards were added and the whole map isn't readable: show the new cards and where they start.
    const added = first ? [] : items.map((i) => i.id).filter((id) => !before.has(id));
    if (added.length) {
      const from = links.filter((l) => added.includes(l.to) && !added.includes(l.from)).map((l) => l.from);
      setViewport(viewportFor([...from, ...added], position, width, height, MIN_READABLE_ZOOM).viewport, { duration });
      return;
    }
    const next = links.filter((l) => l.from === current).map((l) => l.to);
    setViewport(viewportFor([current, ...next], position, width, height, MIN_READABLE_ZOOM).viewport, { duration });
  }, [cardsKey, width, height, position, items, links, setViewport]);
  return null;
}

export interface CareerMapProps {
  items: CareerMapItem[];
  links: CareerMapLink[];
  paths: CareerMapPath[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** The highlighted route (a CareerMapPath id) */
  selectedRoute?: string;
  /** Clicking a line selects its whole route */
  onSelectRoute?: (id: string) => void;
  /** Accessible name of the map, e.g. "Lan Nguyen's career map" */
  "aria-label": string;
  /** Controls shown top-left on the canvas, e.g. an "Explore a role" button */
  toolbar?: React.ReactNode;
  className?: string;
}

function CareerMapCanvas({ items, links, paths, selectedId, onSelect, selectedRoute, onSelectRoute, "aria-label": ariaLabel, toolbar, className }: CareerMapProps) {
  const { position, links: valid } = React.useMemo(() => layout(items, links), [items, links]);
  const routeOf = React.useMemo(() => new Map(paths.map((p) => [p.id, p])), [paths]);
  // Cards on the selected route: both ends of a company path's links; for a Career vision, only the
  // roles in it (not the card it branches from).
  const selected = selectedRoute ? routeOf.get(selectedRoute) : undefined;
  const onRoute = new Set(
    valid.filter((l) => l.route === selectedRoute).flatMap((l) => (selected?.kind === "vision" ? [l.to] : [l.from, l.to]))
  );

  const nodes: CareerMapFlowNode[] = items.map((i) => ({
    id: i.id,
    type: "careerMapNode",
    position: position.get(i.id) ?? { x: 0, y: 0 },
    data: { title: i.title, level: i.level, state: i.state, label: i.label, ring: onRoute.has(i.id) ? routeColor(selected) : undefined },
    selected: i.id === selectedId,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
    ariaLabel: `${i.label ?? stateLabel[i.state].text}: ${i.title}, ${i.level}`,
  }));

  const edges: Edge[] = valid.map((l) => {
    const route = routeOf.get(l.route);
    const stroke = routeColor(route);
    const on = l.route === selectedRoute;
    return {
      id: `${l.from}->${l.to}`,
      source: l.from,
      target: l.to,
      data: { route: l.route },
      focusable: false,
      selectable: false,
      interactionWidth: 20,
      className: onSelectRoute ? "cursor-pointer" : undefined,
      zIndex: on ? 1 : 0,
      style: { stroke, strokeWidth: on ? 3.5 : 2, strokeDasharray: route?.kind === "vision" ? "6 4" : undefined },
      markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 16, height: 16 },
    };
  });

  // Enter / Space / click select a card — React Flow reports both as a select change.
  const onNodesChange = React.useCallback(
    (changes: NodeChange<CareerMapFlowNode>[]) => {
      for (const c of changes) if (c.type === "select" && c.selected) onSelect?.(c.id);
    },
    [onSelect]
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden bg-[var(--career-map-canvas)]",
        "[&_.react-flow__node:focus-visible]:outline-none [&_.react-flow__node:focus-visible>[data-slot=career-map-node]]:outline-2 [&_.react-flow__node:focus-visible>[data-slot=career-map-node]]:outline-offset-2 [&_.react-flow__node:focus-visible>[data-slot=career-map-node]]:outline-[var(--career-map-node-selected)] [&_.react-flow__node:focus-visible>[data-slot=career-map-node]]:outline-solid",
        className
      )}
    >
      <ReactFlow<CareerMapFlowNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgeClick={(_, edge) => onSelectRoute?.(String(edge.data?.route))}
        minZoom={MIN_ZOOM}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elementsSelectable
        deleteKeyCode={null}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        ariaLabelConfig={{
          "node.a11yDescription.default": "Press Enter or Space to see what this role needs.",
          "node.a11yDescription.keyboardDisabled": "Press Enter or Space to see what this role needs.",
        }}
      >
        <Background id="career-map-minor" variant={BackgroundVariant.Lines} gap={24} color="var(--career-map-grid)" />
        <Background id="career-map-major" variant={BackgroundVariant.Lines} gap={120} color="var(--career-map-grid-strong)" />
        {toolbar && (
          <div className="absolute left-[var(--spacing-component-md)] top-[var(--spacing-component-md)] z-10 flex flex-wrap items-center gap-[var(--spacing-component-xs)]">{toolbar}</div>
        )}
        <CareerMapControls ids={items.map((i) => i.id)} position={position} />
        <OpeningView items={items} links={valid} position={position} />
      </ReactFlow>
    </div>
  );
}

export function CareerMap(props: CareerMapProps) {
  return (
    <ReactFlowProvider>
      <CareerMapCanvas {...props} />
    </ReactFlowProvider>
  );
}

export interface CareerMapLegendProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Routes to name — company paths and Career visions, same list as the map */
  paths: CareerMapPath[];
  /** Highlighted route */
  selectedRoute?: string;
  /** When set, entries are buttons that select their route — the keyboard way to do it */
  onSelectRoute?: (id: string) => void;
}

export function CareerMapLegend({ paths, selectedRoute, onSelectRoute, className, ...props }: CareerMapLegendProps) {
  return (
    <ul
      aria-label="Map legend"
      className={cn("flex flex-wrap items-center gap-x-[var(--spacing-component-md)] gap-y-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]", className)}
      {...props}
    >
      {paths.map((p) => {
        const swatch = p.kind === "vision"
          ? <span aria-hidden="true" className="w-5 border-t-2 border-dashed" style={{ borderColor: routeColor(p) }} />
          : <span aria-hidden="true" className="h-0.5 w-5 rounded-[var(--radius-pill)]" style={{ backgroundColor: routeColor(p) }} />;
        return (
          <li key={p.id}>
            {onSelectRoute ? (
              <button
                type="button"
                aria-pressed={p.id === selectedRoute}
                onClick={() => onSelectRoute(p.id)}
                className={cn(
                  "inline-flex min-h-[var(--height-control-touch-sm)] items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-control)] px-[var(--spacing-component-xs)] hover:bg-[var(--color-background-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] sm:min-h-[var(--height-control-sm)]",
                  p.id === selectedRoute && "font-semibold text-[var(--color-background-default-foreground)]"
                )}
              >
                {swatch}
                {p.name}
              </button>
            ) : (
              <span className="inline-flex items-center gap-[var(--spacing-component-sm)]">{swatch}{p.name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
