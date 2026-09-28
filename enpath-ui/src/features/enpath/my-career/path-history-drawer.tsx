'use client';
// Path history (My Career, option A 2026-09-28): the changes to the company path Lan follows, newest
// first. Each change = its date, then one Item per role with a + / − icon, a one-line note in plain
// words and, when it matters to Lan, a Badge ("New on your path", "Was your target"). Same Sheet
// frame as Setup's History drawer (setup/history-drawer.tsx), which stays text-only.

import { MinusCircleIcon, PlusCircleIcon } from '@phosphor-icons/react/ssr';
import { Badge } from '@/components/ui/badge';
import { Item } from '@/components/ui/item';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export interface PathHistoryRow {
  kind: 'added' | 'removed';
  /** "Frontend Engineer L1 · Junior" */
  role: string;
  /** "Added before your level. Not completed yet." */
  note: string;
  badge?: { text: string; variant: 'secondary' | 'warning' };
}

export interface PathHistoryChange {
  date: string;
  who: string;
  rows: PathHistoryRow[];
}

export function PathHistoryDrawer({ open, onOpenChange, path, changes }: {
  open: boolean; onOpenChange: (o: boolean) => void; path: string; changes: PathHistoryChange[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Path history</SheetTitle>
          <SheetDescription>{path}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-[var(--spacing-layout-xs)] overflow-auto px-[var(--spacing-component-lg)] pb-[var(--spacing-component-lg)]">
          {changes.map((c) => (
            <section key={c.date} aria-label={`Changes on ${c.date}`} className="flex flex-col gap-[var(--spacing-component-xs)]">
              <h3 className="text-xs font-semibold text-[var(--color-text-secondary)]">{c.date} · by {c.who}</h3>
              <ul className="flex flex-col divide-y divide-[var(--color-border-default)]">
                {c.rows.map((r) => (
                  <li key={`${r.kind}-${r.role}`}>
                    <Item
                      type="icon"
                      size="sm"
                      icon={r.kind === 'added'
                        ? <PlusCircleIcon className="h-4 w-4 text-[var(--color-icon-success)]" aria-label="Added" />
                        : <MinusCircleIcon className="h-4 w-4 text-[var(--color-icon-danger)]" aria-label="Removed" />}
                      title={
                        <span className="flex flex-wrap items-center gap-x-[var(--spacing-component-sm)] gap-y-[var(--spacing-component-xxs)]">
                          {r.role}
                          {r.badge && <Badge variant={r.badge.variant} shape="pill" size="sm">{r.badge.text}</Badge>}
                        </span>
                      }
                      description={r.note}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
