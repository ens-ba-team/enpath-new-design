import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckCircleIcon, FileMagnifyingGlassIcon, TrendUpIcon } from '@phosphor-icons/react/ssr';

import { Stat } from '@/components/ui/stat';

const meta = {
  title: 'Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Ready', value: 2, description: 'You meet the expectation' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div className="w-[min(240px,calc(100vw-2rem))]"><Stat {...args} /></div>,
};

export const Tones: Story = {
  render: () => (
    <div className="grid w-[min(720px,calc(100vw-2rem))] grid-cols-1 gap-[var(--spacing-component-md)] sm:grid-cols-3">
      <Stat icon={<CheckCircleIcon />} tone="success" label="Ready" value={2} description="You meet the expectation" />
      <Stat icon={<TrendUpIcon />} tone="warning" label="Growth area" value={2} description="Records show a gap" />
      <Stat icon={<FileMagnifyingGlassIcon />} label="Needs records" value={2} description="No records yet" />
    </div>
  ),
};

export const WithoutDescription: Story = {
  render: () => <div className="w-[min(240px,calc(100vw-2rem))]"><Stat label="Records" value={5} /></div>,
};

export const LongContent: Story = {
  render: () => (
    <div className="w-[min(240px,calc(100vw-2rem))]">
      <Stat icon={<FileMagnifyingGlassIcon />} label="Competencies that still need acknowledged records" value={12} description="Add records from your recent projects so these can be assessed" />
    </div>
  ),
};
