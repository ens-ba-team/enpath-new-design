'use client';
// Preview → Confirm before records are sent (PRD-023 RQ-05): each record, who it's for and the
// manager who will also be asked. Cancel sends nothing and notifies nobody. One record (row Submit)
// or several (bulk bar); all or nothing.

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item } from '@/components/ui/item';
import { ME, managerOf, people, type RecordItem } from './mock-data';

function routeLine(r: RecordItem) {
  const manager = people[managerOf[r.recipientId]];
  if (r.recipientId === ME) return `For yourself · ${manager.name}, your manager, will be asked to acknowledge`;
  return `To ${people[r.recipientId].name} · ${manager.name}, their manager, will also be asked`;
}

export function SubmitDialog({ records, onOpenChange, onConfirm }: {
  records: RecordItem[];
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
}) {
  const n = records.length;
  return (
    <Dialog open={n > 0} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{n === 1 ? 'Submit this record?' : `Submit ${n} records?`}</DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col divide-y divide-[var(--color-border-default)]" aria-label="Records to submit">
          {records.map((r) => (
            <li key={r.id} className="py-[var(--spacing-component-sm)] first:pt-0 last:pb-0">
              <Item size="sm" title={r.content} description={routeLine(r)} />
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>{n === 1 ? 'Submit' : `Submit ${n}`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
