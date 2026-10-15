import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Spec: popover.meta.json
const meta = { title: 'Overlay/Popover', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-body-sm">
        <p className="text-heading-xs">Filters</p>
        <p className="text-[var(--color-text-secondary)]">Small interactive content tied to a trigger.</p>
      </PopoverContent>
    </Popover>
  ),
};
