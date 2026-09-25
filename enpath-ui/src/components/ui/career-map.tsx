"use client";

// Career Map — a read-only canvas of an employee's career plan: role cards joined by company
// Career Path lines (coloured per named path) and dashed Career vision lines (the employee's own
// draft). Built on React Flow (@xyflow/react); every colour, radius and spacing is a career-map/*
// component token. Cards are laid out left → right automatically from the links — consumers pass
// items and links, never coordinates.
//
// Tokens: career-map/canvas · grid · grid-strong · node-surface · node-border · node-foreground ·
// node-description · node-selected · current-label · target-label · target-border ·
// vision-border · vision-edge · path-1..3 · node-radius · node-padding · node-gap

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

export type CareerMapNodeState = "current" | "target" | "planned" | "vision";

export interface CareerMapItem {
  id: string;
  /** Position name, e.g. "Backend Engineer" */
  title: string;
  /** Level label, e.g. "L3 · Mid" */
  level: string;
  state: CareerMapNodeState;
}

export interface CareerMapLink {
  from: string;
  to: string;
  /** The company Career Path this move belongs to. Omit for a Career vision link (dashed). */
  pathId?: string;
}

export interface CareerMapPath {
  id: string;
  name: string;
  /** Which career-map/path-N colour the path uses. */
  color: 1 | 2 | 3;
}

// Layout constants are canvas coordinates (React Flow positions), not CSS spacing.
const NODE_WIDTH = 192;
const NODE_HEIGHT = 88;
const COLUMN_GAP = 64;
// Opening view never shrinks cards below this zoom — text must stay readable. If the whole map
// doesn't fit at this zoom (phones), the map opens on the current role and its next steps.
const MIN_READABLE_ZOOM = 0.8;
const FIT_PADDING = 0.05;
const MIN_ZOOM = 0.4;
const ROW_GAP = 32;

const stateLabel: Record<
  CareerMapNodeState,
  { text: string; icon: React.ElementType; className: string }
> = {
  current: { text: "You are here", icon: MapPinIcon, className: "text-[var(--career-map-current-label)]" },
  target: { text: "Active target", icon: FlagIcon, className: "text-[var(--career-map-target-label)]" },
  planned: { text: "Planned", icon: ClockIcon, className: "text-[var(--career-map-node-description)]" },
  vision: { text: "Career vision", icon: CompassIcon, className: "text-[var(--career-map-node-description)]" },
};

type CareerMapNodeData = { title: string; level: string; state: CareerMapNodeState };
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
          "outline-2 outline-offset-2 outline-[var(--career-map-node-selected)] outline-solid"
      )}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} className="!pointer-events-none !opacity-0" />
      <span className={cn("inline-flex items-center gap-[var(--spacing-component-xs)] text-xs font-semibold", label.className)}>
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label.text}
      </span>
      <span className="truncate text-sm font-semibold text-[var(--career-map-node-foreground)]">{data.title}</span>
      <span className="truncate text-sm text-[var(--career-map-node-description)]">{data.level}</span>
      <Handle type="source" position={Position.Right} isConnectable={false} className="!pointer-events-none !opacity-0" />
    </div>
  );
}

const nodeTypes = { careerMapNode: CareerMapNode };

/** Columns from the longest chain of links reaching each card; rows centred per column. */
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
  const columns = new Map<number, string[]>();
  for (const i of items) {
    const d = depth.get(i.id) ?? 0;
    columns.set(d, [...(columns.get(d) ?? []), i.id]);
  }
  const position = new Map<string, { x: number; y: number }>();
  for (const [d, col] of columns) {
    col.forEach((id, row) => {
      position.set(id, {
        x: d * (NODE_WIDTH + COLUMN_GAP),
        y: (row - (col.length - 1) / 2) * (NODE_HEIGHT + ROW_GAP),
      });
    });
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
  const fit = Math.min((width * (1 - 2 * FIT_PADDING)) / w, (height * (1 - 2 * FIT_PADDING)) / h);
  const zoom = Math.min(1, Math.max(minZoom, fit));
  return { fit, viewport: { zoom, x: width / 2 - (left + w / 2) * zoom, y: height / 2 - (top + h / 2) * zoom } };
}

/**
 * Opening view, set once the canvas has a size: the whole map when it stays readable
 * (zoom ≥ MIN_READABLE_ZOOM), otherwise the current role and its next steps. Computed from the
 * layout (card sizes are fixed), so it doesn't wait for React Flow to measure the cards.
 */
function OpeningView({ items, links, position }: { items: CareerMapItem[]; links: CareerMapLink[]; position: Positions }) {
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  const { setViewport } = useReactFlow();
  const done = React.useRef(false);
  React.useEffect(() => {
    if (done.current || !width || !height || items.length === 0) return;
    done.current = true;
    const all = viewportFor(items.map((i) => i.id), position, width, height, MIN_READABLE_ZOOM);
    const current = items.find((i) => i.state === "current")?.id;
    if (all.fit >= MIN_READABLE_ZOOM || !current) { setViewport(all.viewport); return; }
    const next = links.filter((l) => l.from === current).map((l) => l.to);
    setViewport(viewportFor([current, ...next], position, width, height, MIN_READABLE_ZOOM).viewport);
  }, [width, height, position, items, links, setViewport]);
  return null;
}

export interface CareerMapProps {
  items: CareerMapItem[];
  links: CareerMapLink[];
  paths: CareerMapPath[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Accessible name of the map, e.g. "Lan Nguyen's career map" */
  "aria-label": string;
  className?: string;
}

function CareerMapCanvas({ items, links, paths, selectedId, onSelect, "aria-label": ariaLabel, className }: CareerMapProps) {
  const { position, links: valid } = React.useMemo(() => layout(items, links), [items, links]);
  const colorOf = React.useMemo(() => new Map(paths.map((p) => [p.id, p.color])), [paths]);

  const nodes: CareerMapFlowNode[] = items.map((i) => ({
    id: i.id,
    type: "careerMapNode",
    position: position.get(i.id) ?? { x: 0, y: 0 },
    data: { title: i.title, level: i.level, state: i.state },
    selected: i.id === selectedId,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
    ariaLabel: `${stateLabel[i.state].text}: ${i.title}, ${i.level}`,
  }));

  const edges: Edge[] = valid.map((l) => {
    const pathColor = l.pathId ? colorOf.get(l.pathId) : undefined;
    const stroke = pathColor ? `var(--career-map-path-${pathColor})` : "var(--career-map-vision-edge)";
    return {
      id: `${l.from}->${l.to}`,
      source: l.from,
      target: l.to,
      focusable: false,
      selectable: false,
      style: { stroke, strokeWidth: 2, strokeDasharray: l.pathId ? undefined : "6 4" },
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
  paths: CareerMapPath[];
  /** Show the dashed "Your career vision" entry. */
  showVision?: boolean;
}

export function CareerMapLegend({ paths, showVision = true, className, ...props }: CareerMapLegendProps) {
  return (
    <ul
      aria-label="Map legend"
      className={cn("flex flex-wrap items-center gap-x-[var(--spacing-component-lg)] gap-y-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]", className)}
      {...props}
    >
      {paths.map((p) => (
        <li key={p.id} className="inline-flex items-center gap-[var(--spacing-component-sm)]">
          <span aria-hidden="true" className="h-0.5 w-5 rounded-[var(--radius-pill)]" style={{ backgroundColor: `var(--career-map-path-${p.color})` }} />
          {p.name}
        </li>
      ))}
      {showVision && (
        <li className="inline-flex items-center gap-[var(--spacing-component-sm)]">
          <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-[var(--career-map-vision-edge)]" />
          Your career vision
        </li>
      )}
    </ul>
  );
}
