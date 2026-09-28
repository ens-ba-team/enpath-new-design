import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { StepRail, StepRailItem } from '@/components/ui/step-rail';

// Source: step-rail.meta.json — one Career Map route as a vertical rail. Sample data is Lan Nguyen's
// plan from the My Career prototype.
const meta = {
  title: 'Navigation/Step Rail',
  component: StepRail,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { tone: 'followed', 'aria-label': 'Roles on Engineering growth' },
} satisfies Meta<typeof StepRail>;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = 'w-[min(420px,calc(100vw-2rem))]';

/** The path you follow: completed, You are here, Active target, planned. */
export const FollowedPath: Story = {
  render: (args) => (
    <div className={frame}>
      <StepRail {...args}>
        <StepRailItem title="Backend Engineer L1 · Junior" status="Completed" marker="muted" muted />
        <StepRailItem title="Backend Engineer L2 · Mid" status="You are here" statusTone="current" marker="current" />
        <StepRailItem title="Backend Engineer L3 · Senior" status="Active target · 2 growth areas · 2 not assessed yet" statusTone="target" marker="target" />
        <StepRailItem title="Backend Engineer L4 · Staff" status="Planned" />
      </StepRail>
    </div>
  ),
};

/** A Career vision: dashed violet; the first row is the card it starts from, shown as grey context. */
export const CareerVision: Story = {
  args: { tone: 'vision', 'aria-label': 'Roles on Career vision 1' },
  render: (args) => (
    <div className={frame}>
      <StepRail {...args}>
        <StepRailItem title="Starts from Backend Engineer L2 · Mid" marker="muted" muted />
        <StepRailItem title="Product Designer L1 · Designer" />
        <StepRailItem title="Product Designer L2 · Senior" />
      </StepRail>
    </div>
  ),
};

/** Another company path for the role: solid grey. */
export const OtherCompanyPath: Story = {
  args: { tone: 'other', 'aria-label': 'Roles on Engineering to product' },
  render: (args) => (
    <div className={frame}>
      <StepRail {...args}>
        <StepRailItem title="Starts from Backend Engineer L3 · Senior" marker="muted" muted />
        <StepRailItem title="Product Manager L2 · PM" status="Planned" />
        <StepRailItem title="Product Manager L3 · Senior" status="Planned" />
      </StepRail>
    </div>
  ),
};

/** Rows become selectable Items when onSelect is set; the start row stays context only. */
export const Selectable: Story = {
  render: function Render(args) {
    const [selected, setSelected] = React.useState('be-l3');
    const rows = [
      { id: 'be-l1', title: 'Backend Engineer L1 · Junior', status: 'Completed', marker: 'muted' as const, muted: true },
      { id: 'be-l2', title: 'Backend Engineer L2 · Mid', status: 'You are here', statusTone: 'current' as const, marker: 'current' as const },
      { id: 'be-l3', title: 'Backend Engineer L3 · Senior', status: 'Active target', statusTone: 'target' as const, marker: 'target' as const },
      { id: 'be-l4', title: 'Backend Engineer L4 · Staff', status: 'Planned' },
    ];
    return (
      <div className={frame}>
        <StepRail {...args}>
          {rows.map(({ id, ...r }) => (
            <StepRailItem key={id} {...r} selected={selected === id} onSelect={() => setSelected(id)} />
          ))}
        </StepRail>
      </div>
    );
  },
};

/** Explore a position preview: new roles in the route's colour, roles already on the map in grey. */
export const PreviewWithExistingRoles: Story = {
  args: { tone: 'vision', 'aria-label': 'Route' },
  render: (args) => (
    <div className={frame}>
      <StepRail {...args}>
        <StepRailItem title="Backend Engineer L2 · Mid" status="You are here" statusTone="current" marker="muted" muted />
        <StepRailItem title="Product Designer L1 · Designer" status="already on your map" marker="muted" muted />
        <StepRailItem title="QA Engineer L1 · Junior" />
        <StepRailItem title="QA Engineer L2 · Mid" />
      </StepRail>
    </div>
  ),
};

/** Long titles wrap; the rail stays joined from ring to ring. */
export const LongContent: Story = {
  render: (args) => (
    <div className="w-[min(240px,calc(100vw-2rem))]">
      <StepRail {...args}>
        <StepRailItem title="Backend Engineer L2 · Mid" status="You are here" statusTone="current" marker="current" />
        <StepRailItem title="Senior Platform Reliability Engineer L3 · Senior" status="Active target · 3 growth areas · 1 not assessed yet" statusTone="target" marker="target" />
        <StepRailItem title="Backend Engineer L4 · Staff" status="Planned" />
      </StepRail>
    </div>
  ),
};
