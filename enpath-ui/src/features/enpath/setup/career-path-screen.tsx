"use client";
import * as React from "react";
import {
  ArchiveIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockCounterClockwiseIcon,
  DotsSixVerticalIcon,
  PlusIcon,
  RocketLaunchIcon,
  TrashIcon,
  ArrowCounterClockwiseIcon,
  WarningIcon,
} from "@phosphor-icons/react/ssr";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CareerPathStep,
  CareerPathStepper,
} from "@/components/ui/career-path-stepper";
import { HistoryDrawer } from "./history-drawer";
import { Tip } from "../tip";
import type { CareerPath, CareerPathNode, Position } from "../mock-data";

function PathStatus({ status }: { status: CareerPath["status"] }) {
  return (
    <Badge
      variant={
        status === "Active"
          ? "success"
          : status === "Archived"
          ? "secondary"
          : "warning"
      }
    >
      {status}
    </Badge>
  );
}

function PathList({
  paths,
  selected,
  onSelect,
  onAdd,
}: {
  paths: CareerPath[];
  selected: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const shown = paths.filter((p) =>
    `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--color-border-default)]">
      <div className="flex flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-lg)]">
        <h2 className="text-base font-semibold text-[var(--color-background-default-foreground)]">
          Career paths
        </h2>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search paths"
          aria-label="Search career paths"
        />
      </div>
      <div
        className="flex flex-1 flex-col gap-[var(--spacing-component-xs)] overflow-auto px-[var(--spacing-component-md)]"
        aria-label="Career paths"
      >
        {shown.map((p) => (
          <Item
            key={p.id}
            size="sm"
            className="px-[var(--spacing-component-md)]"
            title={p.name}
            description={`${p.nodes.length} steps · ${p.owner}`}
            action={<PathStatus status={p.status} />}
            selected={p.id === selected}
            onSelect={() => onSelect(p.id)}
          />
        ))}
        {shown.length === 0 && (
          <p className="p-[var(--spacing-component-sm)] text-sm text-[var(--color-text-secondary)]">
            No paths match “{query}”.
          </p>
        )}
      </div>
      <div className="border-t border-[var(--color-border-default)] p-[var(--spacing-component-lg)]">
        <Button variant="outline" className="w-full" onClick={onAdd}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          New path
        </Button>
      </div>
    </aside>
  );
}

function NodeRow({
  node,
  index,
  total,
  positions,
  readOnly,
  isDragging,
  dropIndicator,
  onDragStart,
  onDragPosition,
  onDrop,
  onDragEnd,
  onMove,
  onRemove,
}: {
  node: CareerPathNode;
  index: number;
  total: number;
  positions: Position[];
  readOnly: boolean;
  isDragging: boolean;
  dropIndicator?: "before" | "after";
  onDragStart: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragPosition: (placement: "before" | "after") => void;
  onDrop: (placement: "before" | "after") => void;
  onDragEnd: () => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const p = positions.find((x) => x.id === node.positionId)!;
  const l = p.levels.find((x) => x.id === node.levelId)!;
  const set = p.expectations
    ? Object.values(p.expectations).filter((cells) => cells[l.id] != null)
        .length
    : 0;
  const totalCompetencies = Object.keys(p.expectations).length;
  return (
    <CareerPathStep
      number={index + 1}
      title={`${p.name} · L${p.levels.indexOf(l) + 1} · ${l.name}`}
      description={`${set}/${totalCompetencies} expectations set`}
      className={isDragging ? "opacity-[var(--opacity-disabled)]" : undefined}
      dropIndicator={dropIndicator}
      onDragOver={(event) => {
        if (!readOnly) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          const row = event.currentTarget.querySelector<HTMLElement>(
            '[data-slot="career-path-step-row"]'
          );
          if (row) {
            const bounds = row.getBoundingClientRect();
            onDragPosition(
              event.clientY < bounds.top + bounds.height / 2
                ? "before"
                : "after"
            );
          }
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        const row = event.currentTarget.querySelector<HTMLElement>(
          '[data-slot="career-path-step-row"]'
        );
        if (!row) return;
        const bounds = row.getBoundingClientRect();
        onDrop(
          event.clientY < bounds.top + bounds.height / 2 ? "before" : "after"
        );
      }}
      isLast={index === total - 1}
      leading={
        !readOnly ? (
          <button
            type="button"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            aria-label={`Drag step ${index + 1} to reorder`}
            className="inline-flex size-[var(--height-control-touch-sm)] cursor-grab items-center justify-center rounded-[var(--radius-control)] text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)] hover:text-[var(--color-icon-default)] active:cursor-grabbing sm:size-[var(--height-control-sm)]"
          >
            <DotsSixVerticalIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : undefined
      }
      warning={
        set < totalCompetencies ? (
          <Tip
            label={`${totalCompetencies - set} ${
              totalCompetencies - set === 1
                ? "expectation is"
                : "expectations are"
            } missing`}
          >
            <span className="inline-flex shrink-0">
              <WarningIcon
                className="h-4 w-4 text-[var(--color-icon-warning)]"
                aria-hidden="true"
              />
            </span>
          </Tip>
        ) : undefined
      }
      actions={
        !readOnly ? (
          <div className="flex gap-[var(--spacing-component-xs)]">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Move step up"
              disabled={index === 0}
              onClick={() => onMove(-1)}
            >
              <ArrowUpIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Move step down"
              disabled={index === total - 1}
              onClick={() => onMove(1)}
            >
              <ArrowDownIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove step"
              onClick={onRemove}
            >
              <TrashIcon />
            </Button>
          </div>
        ) : undefined
      }
    />
  );
}

export function CareerPathScreen({
  paths,
  positions,
  selected,
  onSelect,
  onChange,
  onAdd,
}: {
  paths: CareerPath[];
  positions: Position[];
  selected: string;
  onSelect: (id: string) => void;
  onChange: (p: CareerPath) => void;
  onAdd: (p: CareerPath) => void;
}) {
  const current = paths.find((p) => p.id === selected) ?? paths[0];
  const [confirm, setConfirm] = React.useState<
    "active" | "archive" | "restore" | null
  >(null);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [newOpen, setNewOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [positionId, setPositionId] = React.useState("");
  const [levelId, setLevelId] = React.useState("");
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{
    index: number;
    placement: "before" | "after";
  } | null>(null);
  const readOnly = current.status !== "Draft";
  const edit = (patch: Partial<CareerPath>) =>
    onChange({
      ...current,
      ...patch,
      changes: current.changes + 1,
      editedBy: "Lan Nguyen",
      editedAt: "just now",
    });
  const addNode = () => {
    if (
      !positionId ||
      !levelId ||
      current.nodes.some((n) => n.levelId === levelId)
    )
      return;
    edit({
      nodes: [
        ...current.nodes,
        { id: `node-${Date.now()}`, positionId, levelId },
      ],
    });
    setPositionId("");
    setLevelId("");
  };
  const create = () => {
    if (!name.trim() || !description.trim()) return;
    const p: CareerPath = {
      id: `path-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      status: "Draft",
      owner: "Lan Nguyen",
      nodes: [],
      changes: 1,
      editedBy: "Lan Nguyen",
      editedAt: "just now",
      history: [],
    };
    onAdd(p);
    onSelect(p.id);
    setName("");
    setDescription("");
    setNewOpen(false);
  };
  const selectedPosition = positions.find((p) => p.id === positionId);
  return (
    <>
      <PathList
        paths={paths}
        selected={current.id}
        onSelect={onSelect}
        onAdd={() => setNewOpen(true)}
      />
      <section
        className="flex min-w-0 flex-1 flex-col"
        aria-label={current.name}
      >
        <header className="flex items-center gap-[var(--spacing-component-lg)] border-b border-[var(--color-border-default)] p-[var(--spacing-component-xl)]">
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
            <div className="flex items-center gap-[var(--spacing-component-sm)]">
              <h2 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">
                {current.name}
              </h2>
              <PathStatus status={current.status} />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {current.description}
            </p>
            <dl className="flex flex-wrap items-center gap-x-[var(--spacing-component-xl)] gap-y-[var(--spacing-component-xs)] text-sm">
              <div>
                <dt className="inline text-[var(--color-text-secondary)]">
                  Owner{" "}
                </dt>
                <dd className="inline text-[var(--color-background-default-foreground)]">
                  {current.owner}
                </dd>
              </div>
              <div>
                <dt className="inline text-[var(--color-text-secondary)]">
                  Last edited{" "}
                </dt>
                <dd className="inline text-[var(--color-background-default-foreground)]">
                  {current.editedBy} · {current.editedAt}
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)]">
            <Button variant="outline" onClick={() => setHistoryOpen(true)}>
              <ClockCounterClockwiseIcon />
              History
            </Button>
            {current.status === "Draft" && (
              <Button
                variant="default"
                disabled={current.nodes.length < 2}
                onClick={() => setConfirm("active")}
              >
                <RocketLaunchIcon />
                Publish
              </Button>
            )}
            {current.status === "Active" && (
              <Button variant="outline" onClick={() => setConfirm("archive")}>
                <ArchiveIcon />
                Archive
              </Button>
            )}
            {current.status === "Archived" && (
              <Button variant="default" onClick={() => setConfirm("restore")}>
                <ArrowCounterClockwiseIcon />
                Restore
              </Button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-[var(--spacing-component-xl)]">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-[var(--spacing-component-lg)]">
              <h3 className="font-semibold">Progression steps</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Arrange Position–Level steps into a direction employees can
                follow.
              </p>
            </div>
            {current.nodes.length < 2 && (
              <Alert
                variant="warning"
                className="mb-[var(--spacing-component-lg)]"
              >
                <WarningIcon />
                <AlertTitle>Add at least 2 steps</AlertTitle>
                <AlertDescription>
                  A path needs two or more Position–Level steps before it can be
                  published.
                </AlertDescription>
              </Alert>
            )}
            <CareerPathStepper aria-label="Career path steps">
              {current.nodes.map((n, i) => (
                <NodeRow
                  key={n.id}
                  node={n}
                  index={i}
                  total={current.nodes.length}
                  positions={positions}
                  readOnly={readOnly}
                  isDragging={dragIndex === i}
                  dropIndicator={
                    dragIndex !== null &&
                    dragIndex !== i &&
                    dropTarget?.index === i
                      ? dropTarget.placement
                      : undefined
                  }
                  onDragStart={(event) => {
                    setDragIndex(i);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", n.id);

                    const row = event.currentTarget
                      .closest("li")
                      ?.querySelector<HTMLElement>(
                        '[data-slot="career-path-step-row"]'
                      );
                    if (row) {
                      const preview = row.cloneNode(true) as HTMLElement;
                      const bounds = row.getBoundingClientRect();
                      preview.style.position = "fixed";
                      preview.style.inset = "auto auto -10000px -10000px";
                      preview.style.width = `${bounds.width}px`;
                      preview.style.pointerEvents = "none";
                      document.body.appendChild(preview);
                      event.dataTransfer.setDragImage(
                        preview,
                        event.clientX - bounds.left,
                        event.clientY - bounds.top
                      );
                      requestAnimationFrame(() => preview.remove());
                    }
                  }}
                  onDragPosition={(placement) => {
                    if (dragIndex !== null && dragIndex !== i) {
                      setDropTarget({ index: i, placement });
                    }
                  }}
                  onDrop={(placement) => {
                    if (dragIndex === null || dragIndex === i) return;
                    const nodes = [...current.nodes];
                    const [moved] = nodes.splice(dragIndex, 1);
                    let insertIndex = i + (placement === "after" ? 1 : 0);
                    if (dragIndex < insertIndex) insertIndex -= 1;
                    nodes.splice(insertIndex, 0, moved);
                    edit({ nodes });
                    setDragIndex(null);
                    setDropTarget(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDropTarget(null);
                  }}
                  onMove={(d) => {
                    const nodes = [...current.nodes];
                    const j = i + d;
                    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
                    edit({ nodes });
                  }}
                  onRemove={() =>
                    edit({ nodes: current.nodes.filter((x) => x.id !== n.id) })
                  }
                />
              ))}
            </CareerPathStepper>
            {!readOnly && (
              <div className="mt-[var(--spacing-component-md)] flex flex-wrap items-end gap-[var(--spacing-layout-xs)] rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-[var(--spacing-component-md)]">
                <div className="min-w-[220px] flex-1">
                  <label className="mb-[var(--spacing-component-xs)] block text-sm font-semibold">
                    Position
                  </label>
                  <Select
                    value={positionId}
                    onValueChange={(v) => {
                      setPositionId(v);
                      setLevelId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[180px] flex-1">
                  <label className="mb-[var(--spacing-component-xs)] block text-sm font-semibold">
                    Level
                  </label>
                  <Select
                    value={levelId}
                    onValueChange={setLevelId}
                    disabled={!selectedPosition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose level" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPosition?.levels.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          L{selectedPosition.levels.indexOf(l) + 1} · {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addNode} disabled={!positionId || !levelId}>
                  <PlusIcon />
                  Add step
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      <AlertDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "active"
                ? `Publish ${current.name}?`
                : confirm === "archive"
                ? `Archive ${current.name}?`
                : `Restore ${current.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "active"
                ? "It becomes available to employees and read-only."
                : confirm === "archive"
                ? "It becomes read-only and is hidden from normal career planning. Nothing is deleted."
                : "It goes back to Draft. You can edit it and publish it again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirm === "active")
                  edit({ status: "Active", changes: 0 });
                if (confirm === "archive") edit({ status: "Archived" });
                if (confirm === "restore") edit({ status: "Draft" });
                setConfirm(null);
              }}
            >
              {confirm === "active"
                ? "Publish"
                : confirm === "archive"
                ? "Archive"
                : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={newOpen} onOpenChange={setNewOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New career path</AlertDialogTitle>
            <AlertDialogDescription>
              Add the path name and direction first. Steps can be added after
              creation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-[var(--spacing-component-md)]">
            <div>
              <label className="mb-1 block text-sm font-semibold">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!name.trim() || !description.trim()}
              onClick={create}
            >
              Create path
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <HistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        name={current.name}
        entries={current.history}
      />
    </>
  );
}
