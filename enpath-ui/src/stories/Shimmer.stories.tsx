import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Shimmer } from '@/components/ai-elements/shimmer';

// Source: shimmer.meta.json — AI Elements Shimmer. Animated text for 'thinking' before the first token arrives.
const meta = { title: 'AI/Shimmer', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Shimmer>Thinking…</Shimmer>
  ),
};
