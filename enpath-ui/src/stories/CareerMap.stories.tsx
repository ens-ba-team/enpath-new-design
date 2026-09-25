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

// Routes: the followed company path (green), another company path, and a Career vision (dashed violet).
const routes: CareerMapPath[] = [
  { id: 'engineering-growth', name: 'Engineering growth · you follow', followed: true },
  { id: 'engineering-to-product', name: 'Engineering to product', color: 2 },
  { id: 'vision-1', name: 'Career vision 1', kind: 'vision' },
];

const items: CareerMapItem[] = [
  { id: 'be-1', title: 'Backend Engineer', level: 'L1 · Junior', state: 'completed', lane: 0 },
  { id: 'be-2', title: 'Backend Engineer', level: 'L2 · Mid', state: 'current', lane: 0 },
  { id: 'be-3', title: 'Backend Engineer', level: 'L3 · Senior', state: 'target', lane: 0 },
  { id: 'be-4', title: 'Backend Engineer', level: 'L4 · Staff', state: 'planned', lane: 0 },
  { id: 'pd-1', title: 'Product Designer', level: 'L1 · Designer', state: 'vision', label: 'Career vision 1', lane: 1 },
  { id: 'pd-2', title: 'Product Designer', level: 'L2 · Senior', state: 'vision', label: 'Career vision 1', lane: 1 },
  { id: 'pm-2', title: 'Product Manager', level: 'L2 · PM', state: 'planned', lane: 2 },
];

const links: CareerMapLink[] = [
  { from: 'be-1', to: 'be-2', route: 'engineering-growth' },
  { from: 'be-2', to: 'be-3', route: 'engineering-growth' },
  { from: 'be-3', to: 'be-4', route: 'engineering-growth' },
  { from: 'be-2', to: 'pd-1', route: 'vision-1' },
  { from: 'pd-1', to: 'pd-2', route: 'vision-1' },
  { from: 'be-3', to: 'pm-2', route: 'engineering-to-product' },
];

/** Card and route selection wired the way a screen would: selecting one clears the other. */
function Interactive(props: Omit<React.ComponentProps<typeof CareerMap>, 'onSelect' | 'onSelectRoute'>) {
  const [selected, setSelected] = React.useState(props.selectedId);
  const [route, setRoute] = React.useState(props.selectedRoute);
  const pickRoute = (id: string) => { setRoute((r) => (r === id ? undefined : id)); setSelected(undefined); };
  return (
    <div className="flex h-[min(640px,100dvh)] flex-col bg-[var(--color-background-default)]">
      <div className="min-h-0 flex-1">
        <CareerMap {...props} selectedId={selected} onSelect={(id) => { setSelected(id); setRoute(undefined); }} selectedRoute={route} onSelectRoute={pickRoute} />
      </div>
      <CareerMapLegend paths={props.paths} selectedRoute={route} onSelectRoute={pickRoute} className="border-t border-[var(--color-border-default)] px-[var(--spacing-layout-sm)] py-[var(--spacing-component-sm)]" />
    </div>
  );
}

export const Default: Story = {
  args: { items, links, paths: routes, 'aria-label': "Lan Nguyen's career map" },
  render: (args) => <Interactive {...args} />,
};

export const Selected: Story = {
  args: { items, links, paths: routes, selectedId: 'be-4', 'aria-label': "Lan Nguyen's career map" },
  render: (args) => <Interactive {...args} />,
};

export const RouteSelected: Story = {
  args: { items, links, paths: routes, selectedRoute: 'vision-1', 'aria-label': 'Career map with Career vision 1 highlighted' },
  render: (args) => <Interactive {...args} />,
};

export const CompanyPathsOnly: Story = {
  args: {
    items: items.filter((i) => i.state !== 'vision'),
    links: links.filter((l) => l.route !== 'vision-1'),
    paths: routes.filter((r) => r.kind !== 'vision'),
    'aria-label': 'Career map without a career vision',
  },
  render: (args) => <Interactive {...args} />,
};

export const CurrentRoleOnly: Story = {
  args: {
    items: [{ id: 'qa-2', title: 'QA Engineer', level: 'L2 · Mid', state: 'current', lane: 0 }],
    links: [],
    paths: [],
    'aria-label': 'Career map with no matching company path',
  },
  render: (args) => <Interactive {...args} />,
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
      { from: 'a', to: 'b', route: 'growth' },
      { from: 'a', to: 'c', route: 'leadership' },
      { from: 'a', to: 'd', route: 'design' },
    ],
    paths: [
      { id: 'growth', name: 'Engineering growth · you follow', followed: true },
      { id: 'leadership', name: 'Engineering leadership', color: 2 },
      { id: 'design', name: 'Design craft', color: 3 },
    ],
    'aria-label': 'Career map with three company paths',
  },
  render: (args) => <Interactive {...args} />,
};
