'use client';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react/ssr';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Empty } from '@/components/ui/empty';
import { Item } from '@/components/ui/item';
import type { HistoryEntry } from '../mock-data';

// Shared by Career structure (Position) and Matrices config (Matrix) — both carry the same
// { who, what, when } shape. Entries are seeded mock data, not a live audit log: they don't grow
// as you Publish/Archive/edit in this prototype.

export function HistoryDrawer({ open, onOpenChange, name, entries }: {
  open: boolean; onOpenChange: (o: boolean) => void; name: string; entries: HistoryEntry[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
          <SheetDescription>{name}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-[var(--spacing-component-lg)] pt-[var(--spacing-component-lg)] pb-[var(--spacing-component-lg)]">
          {entries.length === 0 ? (
            <Empty
              icon={<ClockCounterClockwiseIcon className="h-5 w-5" aria-hidden="true" />}
              title="No history yet"
              description="Changes will show up here once something is edited."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-[var(--color-border-default)]" aria-label="History">
              {entries.map((h, i) => (
                <li key={i} className="py-[var(--spacing-component-sm)] first:pt-0 last:pb-0">
                  <Item size="sm" title={h.what} description={<span className="text-xs">{h.who} · {h.when}</span>} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
