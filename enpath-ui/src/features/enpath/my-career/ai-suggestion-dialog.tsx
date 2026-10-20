'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StepRail, StepRailItem } from '@/components/ui/step-rail';
import { careerPathMove, countGaps, gapsForLevel, type Plan, type Branch } from './mock-data';
import { levelName } from './plan-dialogs';

export const demoSuggestion = { id: 'ai-engineering-product', pathId: 'engineering-to-product', from: 'BE-L2', name: 'Engineering to product' };

export function AiSuggestionDialog({ open, onOpenChange, plan, onAdd, onDismiss }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  onAdd: (branches: Branch[], message: string, select: string) => void;
  onDismiss: () => void;
}) {
  // Recompute against the latest graph, including at confirmation time.
  const move = careerPathMove(plan, demoSuggestion.from, demoSuggestion.pathId);
  const nextRole = move?.levels[0];
  const counts = nextRole ? countGaps(gapsForLevel(nextRole)) : null;
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] max-w-[560px] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Explore {demoSuggestion.name}</DialogTitle>
        <DialogDescription>A direction worth exploring, not a decision about your career.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-wrap gap-[var(--spacing-component-xs)]"><Badge variant="secondary">Company path</Badge><Badge variant="dashed">Demo AI suggestion</Badge></div>
      <section className="flex flex-col gap-[var(--spacing-component-sm)]">
        <h3 className="text-heading-xs">Why this may fit</h3>
        <p className="text-body-sm">Your delivery and code quality experience give you a foundation for the engineering steps on this path. It opens a possible direction toward product work.</p>
        <p className="text-body-xs text-[var(--color-text-secondary)]">This is a scripted prototype recommendation using mock assessment and company-path data. No AI agent has analyzed your records or actions.</p>
      </section>
      {move ? <>
        <section className="flex flex-col gap-[var(--spacing-component-sm)]">
          <h3 className="text-heading-xs">Path preview</h3>
          <StepRail tone="other" aria-label="Suggested path preview">
            <StepRailItem title={levelName(demoSuggestion.from)} status="Current position" marker="current" />
            {move.levels.map((id) => <StepRailItem key={id} title={levelName(id)} />)}
          </StepRail>
          <p className="text-body-xs text-[var(--color-text-secondary)]">Earlier steps are skipped. Existing cards are reused.</p>
        </section>
        {counts && <section className="flex flex-col gap-[var(--spacing-component-sm)]">
          <h3 className="text-heading-xs">What to develop</h3>
          <p className="text-body-sm">For {levelName(nextRole!)}: {counts.ready} requirements met, {counts.growth} growth areas, {counts.evidence} not assessed, {counts.unset} not set.</p>
          <p className="text-body-xs text-[var(--color-text-secondary)]">This compares the next step only, not your readiness for the full path. Product competencies need a separate assessment.</p>
        </section>}
        <details className="text-body-xs text-[var(--color-text-secondary)]"><summary className="cursor-pointer">View sources and limitations</summary>
          <ul className="mt-[var(--spacing-component-sm)] list-disc pl-[var(--spacing-component-lg)]">
            <li>Mock approved competency scores: {gapsForLevel(nextRole!).filter((gap) => gap.source).map((gap) => `${gap.name}: ${gap.current} (${gap.source})`).join('; ')}.</li>
            <li>Published mock company path: {demoSuggestion.name}.</li>
            <li>Interests have not been provided. Actions and records are not proof of competency and do not change scores.</li>
          </ul>
        </details>
      </> : <p role="status" className="text-body-sm">This suggestion no longer has new steps to add. Explore another company path instead.</p>}
      <p className="text-body-sm text-[var(--color-text-secondary)]">Adding this path saves a direction to explore. Your current position and active target stay the same.</p>
      <DialogFooter className="flex-wrap">
        <Button variant="ghost" onClick={onDismiss}>Dismiss suggestion</Button>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Not now</Button>
        <Button disabled={!move} onClick={() => {
          const latest = careerPathMove(plan, demoSuggestion.from, demoSuggestion.pathId);
          if (!latest) return;
          onAdd(latest.branches, `${latest.path.name} added to your map`, latest.levels.at(-1)!);
          onOpenChange(false);
        }}>Add to my map</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
