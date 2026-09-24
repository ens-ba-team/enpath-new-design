import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type React from 'react';
import { WarningIcon, ArrowUpIcon, ArrowDownIcon, DotsSixVerticalIcon, TrashIcon } from '@phosphor-icons/react/ssr';

import { Button } from '@/components/ui/button';
import { CareerPathStep, CareerPathStepper } from '@/components/ui/career-path-stepper';
import { Tip } from '@/features/enpath/tip';

const meta = {
  title: 'Navigation/Career Path Stepper',
  component: CareerPathStepper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CareerPathStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { title: 'Junior Product Designer · L1 · Foundation', description: '8/8 expectations set' },
  { title: 'Product Designer · L2 · Proficient', description: '11/12 expectations set' },
  { title: 'Senior Product Designer · L3 · Advanced', description: '14/14 expectations set' },
];

function StepperFrame({ children }: { children: React.ReactNode }) {
  return <div className="w-[min(720px,calc(100vw-2rem))]">{children}</div>;
}

export const Default: Story = {
  render: () => (
    <StepperFrame>
      <CareerPathStepper aria-label="Career path steps">
        {steps.map((step, index) => (
          <CareerPathStep key={step.title} number={index + 1} isLast={index === steps.length - 1} {...step} />
        ))}
      </CareerPathStepper>
    </StepperFrame>
  ),
};

export const WithWarnings: Story = {
  render: () => (
    <StepperFrame>
      <CareerPathStepper aria-label="Career path steps with incomplete expectations">
        {steps.map((step, index) => (
          <CareerPathStep
            key={step.title}
            number={index + 1}
            isLast={index === steps.length - 1}
            {...step}
            warning={index === 1 ? <Tip label="1 expectation is missing"><span className="inline-flex"><WarningIcon className="h-4 w-4 text-[var(--color-icon-warning)]" aria-hidden="true" /></span></Tip> : undefined}
          />
        ))}
      </CareerPathStepper>
    </StepperFrame>
  ),
};

export const WithActions: Story = {
  render: () => (
    <StepperFrame>
      <CareerPathStepper aria-label="Editable career path steps">
        {steps.map((step, index) => (
          <CareerPathStep
            key={step.title}
            number={index + 1}
            isLast={index === steps.length - 1}
            {...step}
            leading={<button type="button" draggable aria-label={`Drag ${step.title} to reorder`} className="inline-flex size-[var(--height-control-touch-sm)] cursor-grab items-center justify-center rounded-[var(--radius-control)] text-[var(--color-icon-muted)] sm:size-[var(--height-control-sm)]"><DotsSixVerticalIcon className="h-4 w-4" aria-hidden="true" /></button>}
            actions={<div className="flex gap-[var(--spacing-component-xs)]"><Button variant="ghost" size="icon-sm" aria-label={`Move ${step.title} up`} disabled={index === 0}><ArrowUpIcon /></Button><Button variant="ghost" size="icon-sm" aria-label={`Move ${step.title} down`} disabled={index === steps.length - 1}><ArrowDownIcon /></Button><Button variant="ghost" size="icon-sm" aria-label={`Remove ${step.title}`}><TrashIcon /></Button></div>}
          />
        ))}
      </CareerPathStepper>
    </StepperFrame>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <StepperFrame>
      <CareerPathStepper aria-label="Published career path steps">
        {steps.map((step, index) => <CareerPathStep key={step.title} number={index + 1} isLast={index === steps.length - 1} {...step} />)}
      </CareerPathStepper>
    </StepperFrame>
  ),
};

export const LongContent: Story = {
  render: () => (
    <StepperFrame>
      <CareerPathStepper aria-label="Career path steps with long content">
        <CareerPathStep number={1} title="Principal Product Designer for Enterprise Learning and Workforce Development" description="18/24 expectations set across craft, leadership, stakeholder management, and organisational influence" />
        <CareerPathStep number={2} isLast title="Design Director for Global Talent Products and Employee Experience" description="All expectations set" />
      </CareerPathStepper>
    </StepperFrame>
  ),
};
