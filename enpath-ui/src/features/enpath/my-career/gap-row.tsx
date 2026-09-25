'use client';
// A role's competencies compared with Lan's evidence, grouped by what to do next:
// Growth areas → Need evidence → Ready (collapsed) → Not set (collapsed). Each row shows a short value
// ("3 → 4", "needs 3", "3") and expands to say what the level looks like (or which record a Ready
// point comes from) with a link to the next step: Plan an action (My Actions) / Add a record (Records).
// Wording follows enpath-tone-and-voice.md: "Need evidence" means no records yet, never a gap.
// Each group is a compact Card (spacing/component/md inside); the gap between cards is structure
// (spacing/layout/xs — the panel is narrow). Rows are compact: trigger padding component/sm (8px)
// instead of the Accordion's 16px — local override until the Accordion gets a compact size. Built only from design-system components: Card,
// Accordion (rows), Collapsible + Button (Show/Hide).

import * as React from 'react';
import { toast } from 'sonner';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { pointLabel, type Gap, type GapStatus } from './mock-data';

/** `values` names the numbers on the right once per card, e.g. "You → Needed". */
const groups: { status: GapStatus; title: string; collapsed: boolean; values?: string }[] = [
  { status: 'growth', title: 'Growth areas', collapsed: false, values: 'You → Needed' },
  { status: 'evidence', title: 'Need evidence', collapsed: false, values: 'Needed' },
  { status: 'ready', title: 'Ready', collapsed: true, values: 'You' },
  { status: 'unset', title: 'Not set in Setup', collapsed: true },
];

/** Status colour for dots and readiness bars — the same as the progress strip. */
export const statusFill: Record<GapStatus, string> = {
  ready: 'bg-[var(--color-icon-success)]',
  growth: 'bg-[var(--color-icon-warning)]',
  evidence: 'bg-[var(--color-border-strong)]',
  unset: 'bg-[var(--color-border-default)]',
};

function value(gap: Gap) {
  if (gap.required == null) return '—';
  if (gap.current == null) return String(gap.required); // the card's caption says "Needed"
  if (gap.status === 'ready') return String(gap.current);
  return `${gap.current} → ${gap.required}`;
}

function Detail({ gap }: { gap: Gap }) {
  const comingNext = (where: string) => toast(`${where} is coming next — this will open it.`);
  const label = (text: string) => <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">{text}</p>;
  const body = (text: string) => <p className="text-sm text-[var(--color-text-secondary)]">{text}</p>;
  const link = (text: string, where: string) => (
    <Button variant="outline" size="sm" className="mt-[var(--spacing-component-xs)] self-start" onClick={() => comingNext(where)}>{text}<ArrowRightIcon aria-hidden="true" /></Button>
  );
  if (gap.status === 'growth') return (
    <>
      {label(`What ${pointLabel(gap.required!)} looks like`)}
      {body(gap.meaning ?? 'Your records show a gap toward this level.')}
      {link('Plan an action', 'My Actions')}
    </>
  );
  if (gap.status === 'evidence') return (
    <>
      {label(`No records yet · needs ${pointLabel(gap.required!)}`)}
      {body('This can’t be assessed until there’s evidence. It isn’t a gap.')}
      {link('Add a record', 'Records')}
    </>
  );
  if (gap.status === 'ready') return (
    <>
      {label(`You’re at ${pointLabel(gap.current!)}`)}
      {body(gap.source ? `Based on: ${gap.source}.` : 'Your records meet this level.')}
    </>
  );
  return body('Setup hasn’t set an expectation for this level yet, so there’s nothing to compare.');
}

/** One card per group. Rows are the design-system Accordion (single, collapsible); collapsed groups
 *  use Collapsible with a ghost xs Button — no hand-built controls. */
/** `focus` opens that group's card and scrolls it into view (from the progress strip's counts). */
export function GapList({ gaps, focus }: { gaps: Gap[]; focus?: GapStatus }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      {groups.map((g) => {
        const rows = gaps.filter((x) => x.status === g.status);
        if (rows.length === 0) return null;
        return <GapGroup key={g.status} group={g} rows={rows} focused={focus === g.status} />;
      })}
    </div>
  );
}

function GapGroup({ group, rows, focused }: { group: (typeof groups)[number]; rows: Gap[]; focused: boolean }) {
  const [open, setOpen] = React.useState(!group.collapsed || focused);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { if (focused) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [focused]);
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <Card ref={ref} role="region" aria-label={group.title} className={cn('gap-[var(--spacing-component-sm)] p-[var(--spacing-component-md)]', !open && 'gap-0')}>
        <CardHeader className="flex-row items-center gap-[var(--spacing-component-sm)]">
          <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-[var(--radius-pill)]', statusFill[group.status])} />
          <CardTitle className="flex-1 text-sm" role="heading" aria-level={3}>{group.title} <span className="font-normal text-[var(--color-text-secondary)]">· {rows.length}</span></CardTitle>
          {group.collapsed && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="xs">{open ? 'Hide' : 'Show'}</Button>
            </CollapsibleTrigger>
          )}
        </CardHeader>
        <CollapsibleContent className="flex flex-col">
          {group.values && (
            <p className="flex justify-between pr-[var(--spacing-component-xl)] text-xs text-[var(--color-text-secondary)]">
              <span>Competency</span><span>{group.values}</span>
            </p>
          )}
          <Accordion type="single" collapsible>
            {rows.map((gap) => (
              <AccordionItem key={gap.id} value={gap.id} className="last:border-b-0">
                <AccordionTrigger className="py-[var(--spacing-component-sm)] font-normal [&[data-state=open]>span:first-child]:font-semibold">
                  <span className="min-w-0 flex-1 text-left">{gap.name}</span>
                  <span className="shrink-0 tabular-nums font-normal text-[var(--color-text-secondary)]">{value(gap)}</span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-[var(--spacing-component-xs)] pb-[var(--spacing-component-md)]">
                  <Detail gap={gap} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
