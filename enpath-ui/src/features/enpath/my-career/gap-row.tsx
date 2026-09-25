// One competency compared with a level's expectation — used in My Career's side panel.
// Feature-level (not a design-system component yet): composes Item + Badge.
// Wording follows enpath-tone-and-voice.md: a gap is development information, not a verdict;
// "Needs evidence" means no acknowledged Records yet, never "below expectation".

import { Badge } from '@/components/ui/badge';
import { Item } from '@/components/ui/item';
import { pointLabel, type Gap, type GapStatus } from './mock-data';

const statusBadge: Record<GapStatus, { text: string; variant: 'success' | 'warning' | 'outline' | 'dashed' }> = {
  ready: { text: 'Ready', variant: 'success' },
  growth: { text: 'Growth area', variant: 'warning' },
  evidence: { text: 'Needs evidence', variant: 'outline' },
  unset: { text: 'Not set', variant: 'dashed' },
};

function detail(gap: Gap) {
  if (gap.required == null) return 'No expectation set for this level yet';
  if (gap.current == null) return `Needs ${pointLabel(gap.required)} · not enough records yet`;
  return `You ${pointLabel(gap.current)} → needs ${pointLabel(gap.required)}`;
}

export function GapRow({ gap }: { gap: Gap }) {
  const badge = statusBadge[gap.status];
  return (
    <Item
      size="sm"
      title={gap.name}
      description={detail(gap)}
      action={<Badge variant={badge.variant} shape="pill" size="md">{badge.text}</Badge>}
    />
  );
}
