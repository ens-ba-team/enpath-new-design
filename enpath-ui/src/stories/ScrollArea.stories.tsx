import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollArea } from '@/components/ui/scroll-area';

// Source: scroll-area.meta.json — shadcn ScrollArea (Radix). Styled scrollbars inside a fixed-height region.
const meta = { title: 'Layout/Scroll Area', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-[var(--radius-surface)] border border-[var(--color-border-default)]">
      <ul className="p-[var(--spacing-component-md)] text-sm">
        {Array.from({ length: 20 }, (_, i) => <li key={i} className="py-[var(--spacing-component-xs)]">Position {i + 1}</li>)}
      </ul>
    </ScrollArea>
  ),
};
