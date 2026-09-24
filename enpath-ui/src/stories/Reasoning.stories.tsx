import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning';

// Source: reasoning.meta.json — AI Elements Reasoning. Collapsible 'thinking' text; opens while streaming, closes when done.
const meta = { title: 'AI/Reasoning', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Done: Story = {
  render: () => (
    <Reasoning className="w-[420px]" defaultOpen={false}>
      <ReasoningTrigger />
      <ReasoningContent>{'Checked the 6 competencies against 4 levels. Two cells have no expectation.'}</ReasoningContent>
    </Reasoning>
  ),
};
