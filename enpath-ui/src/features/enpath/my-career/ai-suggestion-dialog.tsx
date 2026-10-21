'use client';

import { SparkleIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StepRail, StepRailItem } from '@/components/ui/step-rail';
import { careerPathMove, type Plan, type Branch } from './mock-data';
import { levelName } from './plan-dialogs';

export const demoSuggestion = { id: 'ai-engineering-product', pathId: 'engineering-to-product', from: 'BE-L2', name: 'Engineering to product' };

export function AiSuggestionDialog({ open, onOpenChange, plan, onAdd, onDismiss }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  onAdd: (branches: Branch[], message: string, select: string) => void;
  onDismiss: () => void;
}) {
  const move = careerPathMove(plan, demoSuggestion.from, demoSuggestion.pathId);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex max-h-[90dvh] max-w-[560px] flex-col gap-0 overflow-hidden p-0">
      <DialogHeader className="shrink-0 border-b border-[var(--color-border-default)] p-[var(--spacing-component-xl)]">
        <DialogTitle>{demoSuggestion.name}</DialogTitle>
        <DialogDescription>Explore a company-defined direction toward product work.</DialogDescription>
        <div className="flex flex-wrap gap-[var(--spacing-component-xs)] pt-[var(--spacing-component-xs)]">
          <Badge variant="secondary">Company path</Badge>
          <Badge variant="dashed"><SparkleIcon aria-hidden="true" />AI suggestion · Demo</Badge>
        </div>
      </DialogHeader>
      <div className="flex min-h-0 flex-col gap-[var(--spacing-component-xl)] overflow-y-auto p-[var(--spacing-component-xl)]">
        <section className="flex flex-col gap-[var(--spacing-component-sm)]">
          <h3 className="text-heading-xs">Why this may fit</h3>
          <p className="text-body-sm text-[var(--color-text-secondary)]">Your delivery and code quality experience provide a foundation for the engineering steps on this path, with a possible transition into product work.</p>
        </section>
        {move ? <section className="flex flex-col gap-[var(--spacing-component-md)]">
          <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
            <h3 className="text-heading-xs">Your path preview</h3>
            <span className="text-body-xs text-[var(--color-text-secondary)]">{move.levels.length} next {move.levels.length === 1 ? 'step' : 'steps'}</span>
          </div>
          <StepRail tone="other" aria-label="Suggested path preview">
            <StepRailItem title={levelName(demoSuggestion.from)} status="Starting from · your current position" marker="current" />
            {move.levels.map((id) => <StepRailItem key={id} title={levelName(id)} />)}
          </StepRail>
          <p className="text-body-xs text-[var(--color-text-secondary)]">Steps you’ve passed are skipped. Positions already on your map are reused.</p>
        </section> : <p role="status" className="text-body-sm">There are no new steps to add from this suggestion. You can explore another company path instead.</p>}
        <p className="border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)] text-body-xs text-[var(--color-text-secondary)]">Demo based on mock assessment and company-path data. Records and actions have not been analyzed by an AI agent.</p>
      </div>
      <div className="flex shrink-0 flex-col gap-[var(--spacing-component-md)] border-t border-[var(--color-border-default)] p-[var(--spacing-component-xl)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Save this direction to explore. Your current position and active target won’t change.</p>
        <DialogFooter className="flex-col gap-[var(--spacing-component-sm)] sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={onDismiss}>Dismiss suggestion</Button>
          <div className="flex flex-col-reverse gap-[var(--spacing-component-sm)] sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Not now</Button>
            <Button disabled={!move} onClick={() => {
              const latest = careerPathMove(plan, demoSuggestion.from, demoSuggestion.pathId);
              if (!latest) return;
              onAdd(latest.branches, `${latest.path.name} added to your map`, latest.levels.at(-1)!);
              onOpenChange(false);
            }}>Add to my map</Button>
          </div>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>;
}
