'use client';
// My Career — employee view (Lan Nguyen). Spec: Enpath/document/my-career-build.md.
// Built so far: the career map (build-my-path job) and a panel for the selected card.
// Not yet: progress board, gap rows, Set as target, Career vision request.

import * as React from 'react';
import { CareerMap, CareerMapLegend, type CareerMapItem } from '@/components/ui/career-map';
import { EnpathAppShell } from '../app-shell';
import { companyPaths, describeStep, employee, planLinks, planSteps, type PlanStep } from './mock-data';

const stateText: Record<PlanStep['state'], string> = {
  current: 'You are here',
  target: 'Your Active target',
  planned: 'Exploring — what would this need?',
  vision: 'In your Career vision',
};

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="p-[var(--spacing-layout-sm)] text-sm text-[var(--color-text-secondary)]">{children}</p>;
}

function StepPanel({ step }: { step: PlanStep }) {
  const d = describeStep(step);
  const incoming = planLinks.find((l) => l.to === step.id);
  const source = step.state === 'current'
    ? 'Your official role, set by your admin'
    : incoming?.pathId
      ? `Company path · ${companyPaths.find((p) => p.id === incoming.pathId)?.name}`
      : 'Your career vision · draft, only you can see it';
  return (
    <section aria-labelledby="step-title" className="flex flex-col gap-[var(--spacing-component-sm)] p-[var(--spacing-layout-sm)]">
      <p className="text-xs font-semibold text-[var(--color-text-secondary)]">{stateText[step.state]}</p>
      <h2 id="step-title" className="text-lg font-semibold text-[var(--color-background-default-foreground)]">
        {d.title} <span className="font-normal text-[var(--color-text-secondary)]">{d.level}</span>
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)]">{source}</p>
      <p className="text-sm text-[var(--color-background-default-foreground)]">
        {d.expectationsSet} of {d.expectationsTotal} expectations set for this level
      </p>
      <p className="mt-[var(--spacing-component-sm)] border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)] text-sm text-[var(--color-text-secondary)]">
        What this role needs from you — competency by competency — comes next.
      </p>
    </section>
  );
}

export function MyCareerScreen() {
  const [page, setPage] = React.useState('My Career');
  const [selected, setSelected] = React.useState('be-3');
  const current = describeStep(planSteps.find((s) => s.state === 'current')!);
  const items: CareerMapItem[] = planSteps.map((s) => {
    const d = describeStep(s);
    return { id: s.id, title: d.title, level: d.level, state: s.state };
  });
  const step = planSteps.find((s) => s.id === selected) ?? planSteps[0];

  return (
    <EnpathAppShell active={page} onNavigate={setPage}>
      {page !== 'My Career' ? (
        <Placeholder>{page} — not built yet. Go to My Career or Setup.</Placeholder>
      ) : (
        <div className="flex h-full flex-col">
          <header className="flex flex-col gap-[var(--spacing-component-xs)] border-b border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] py-[var(--spacing-layout-sm)]">
            <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">My Career</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {employee.name} · {current.title} {current.level}
            </p>
          </header>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
            <div className="flex min-h-[60dvh] flex-1 flex-col lg:min-h-0">
              <CareerMap
                aria-label={`${employee.name}'s career map`}
                items={items}
                links={planLinks}
                paths={companyPaths}
                selectedId={selected}
                onSelect={setSelected}
                className="flex-1"
              />
              <CareerMapLegend
                paths={companyPaths}
                className="border-t border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] py-[var(--spacing-component-md)]"
              />
            </div>
            <aside className="shrink-0 border-t border-[var(--color-border-default)] lg:w-[320px] lg:overflow-y-auto lg:border-l lg:border-t-0">
              <StepPanel step={step} />
            </aside>
          </div>
        </div>
      )}
    </EnpathAppShell>
  );
}
