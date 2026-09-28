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
      <Stat icon={<TrendUpIcon />} tone="warning" label="Growth area" value={2} description="Below what the role needs" />
      <Stat icon={<FileMagnifyingGlassIcon />} label="Not assessed yet" value={2} description="No approved score yet" />
    </div>
  ),
};

export const WithoutDescription: Story = {
  render: () => <div className="w-[min(240px,calc(100vw-2rem))]"><Stat label="Assessed" value={5} /></div>,
};

export const LongContent: Story = {
  render: () => (
    <div className="w-[min(240px,calc(100vw-2rem))]">
      <Stat icon={<FileMagnifyingGlassIcon />} label="Competencies not assessed yet in your latest assessment" value={12} description="Your manager assesses these in a future assessment" />
    </div>
  ),
};
