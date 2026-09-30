import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckCircleIcon, FileMagnifyingGlassIcon, ListChecksIcon, PlayCircleIcon, TargetIcon, TrendUpIcon } from '@phosphor-icons/react/ssr';

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

/** iconTile + divided + aside (the Action plan summary): the icon on a solid tile (color/tile/*), a line
 *  under the label, a note on the right of the description row. */
export const IconTileDivided: Story = {
  name: 'Icon tile, divided, aside',
  render: () => (
    <div className="grid w-[min(960px,calc(100vw-2rem))] grid-cols-2 gap-[var(--spacing-component-md)] md:grid-cols-4">
      <Stat divided iconTile="warning" icon={<TargetIcon />} label="Growth areas" value={3} description="toward Frontend Engineer L3" />
      <Stat divided iconTile="neutral" icon={<ListChecksIcon />} label="To do" value={2} description="next due 24 Oct" />
      <Stat divided iconTile="info" icon={<PlayCircleIcon />} label="In progress" value={1} description="due 26 Sep"
        aside={<span className="text-[var(--color-text-danger)]">1 overdue</span>} />
      <Stat divided iconTile="success" icon={<CheckCircleIcon />} label="Done" value={1} description="last on 12 Sep" />
    </div>
  ),
};
