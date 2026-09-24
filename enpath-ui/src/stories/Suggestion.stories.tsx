import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';

// Source: suggestion.meta.json — AI Elements Suggestion. Starter prompts shown before the first message.
const meta = { title: 'AI/Suggestion', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Suggestions>
        <Suggestion suggestion="Which cells are not set?" />
        <Suggestion suggestion="Add a Principal level" />
      </Suggestions>
    </div>
  ),
};
