import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { CareerMap, CareerMapLegend, type CareerMapItem, type CareerMapLink, type CareerMapPath } from '@/components/ui/career-map';

const meta = {
  title: 'Navigation/Career Map',
  component: CareerMap,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CareerMap>;

export default meta;
type Story = StoryObj<typeof meta>;

const paths: CareerMapPath[] = [
  { id: 'engineering-growth', name: 'Engineering growth', color: 1 },
  { id: 'engineering-to-product', name: 'Engineering to product', color: 2 },
  { id: 'design-craft', name: 'Design craft', color: 3 },
];

const items: CareerMapItem[] = [
  { id: 'be-2', title: 'Backend Engineer', level: 'L2 · Mid', state: 'current' },
  { id: 'be-3', title: 'Backend Engineer', level: 'L3 · Senior', state: 'target' },
  { id: 'be-4', title: 'Backend Engineer', level: 'L4 · Staff', state: 'planned' },
  { id: 'pm-2', title: 'Product Manager', level: 'L2 · PM', state: 'planned' },
  { id: 'pd-1', title: 'Product Designer', level: 'L1 · Designer', state: 'vision' },
  { id: 'pd-2', title: 'Product Designer', level: 'L2 · Senior', state: 'vision' },
];

const links: CareerMapLink[] = [
  { from: 'be-2', to: 'be-3', pathId: 'engineering-growth' },
  { from: 'be-3', to: 'be-4', pathId: 'engineering-growth' },
  { from: 'be-3', to: 'pm-2', pathId: 'engineering-to-product' },
  { from: 'be-2', to: 'pd-1' },
  { from: 'pd-1', to: 'pd-2' },
];

function Frame({ children, legend = paths.slice(0, 2), vision = true }: { children: React.ReactNode; legend?: CareerMapPath[]; vision?: boolean }) {
  return (
    <div className="flex h-[min(640px,100dvh)] flex-col bg-[var(--color-background-default)]">
      <div className="min-h-0 flex-1">{children}</div>
      <CareerMapLegend paths={legend} showVision={vision} className="border-t border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] py-[var(--spacing-component-md)]" />
    </div>
  );
}

function Interactive(props: Omit<React.ComponentProps<typeof CareerMap>, 'onSelect'>) {
  const [selected, setSelected] = React.useState(props.selectedId);
  return <CareerMap {...props} selectedId={selected} onSelect={setSelected} />;
}

export const Default: Story = {
  args: { items, links, paths, 'aria-label': "Lan Nguyen's career map" },
  render: (args) => <Frame><Interactive {...args} /></Frame>,
};

export const Selected: Story = {
  args: { items, links, paths, selectedId: 'pm-2', 'aria-label': "Lan Nguyen's career map" },
  render: (args) => <Frame><Interactive {...args} /></Frame>,
};

export const CompanyPathsOnly: Story = {
  args: {
    items: items.filter((i) => i.state !== 'vision'),
    links: links.filter((l) => l.pathId),
    paths,
    'aria-label': 'Career map without a career vision',
  },
  render: (args) => <Frame vision={false}><Interactive {...args} /></Frame>,
};

export const CurrentRoleOnly: Story = {
  args: {
    items: [{ id: 'qa-2', title: 'QA Engineer', level: 'L2 · Mid', state: 'current' }],
    links: [],
    paths: [],
    'aria-label': 'Career map with no matching company path',
  },
  render: (args) => <Frame legend={[]} vision={false}><Interactive {...args} /></Frame>,
};

export const ThreePathsLongTitles: Story = {
  args: {
    items: [
      { id: 'a', title: 'Senior Backend Engineer', level: 'L3 · Senior', state: 'current' },
      { id: 'b', title: 'Principal Platform Engineer for Payments Infrastructure', level: 'L5 · Principal', state: 'target' },
      { id: 'c', title: 'Engineering Manager', level: 'L1 · Lead', state: 'planned' },
      { id: 'd', title: 'Product Designer', level: 'L2 · Senior', state: 'planned' },
    ],
    links: [
      { from: 'a', to: 'b', pathId: 'engineering-growth' },
      { from: 'a', to: 'c', pathId: 'engineering-to-product' },
      { from: 'a', to: 'd', pathId: 'design-craft' },
    ],
    paths,
    'aria-label': 'Career map with three company paths',
  },
  render: (args) => <Frame legend={paths} vision={false}><Interactive {...args} /></Frame>,
};
