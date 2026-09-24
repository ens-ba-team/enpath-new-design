import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner } from '@/components/ui/spinner';

// Source: spinner.meta.json — shadcn Spinner. Indeterminate loading for a small area or a submit button.
const meta = { title: 'Feedback/Spinner', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-component-md)] text-[var(--color-text-secondary)]">
      <Spinner /> <span className="text-sm">Loading positions…</span>
    </div>
  ),
};
