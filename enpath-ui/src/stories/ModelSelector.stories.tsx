import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ModelSelector, ModelSelectorContent, ModelSelectorEmpty, ModelSelectorGroup, ModelSelectorInput, ModelSelectorItem, ModelSelectorList, ModelSelectorName, ModelSelectorTrigger } from '@/components/ai-elements/model-selector';
import { Button } from '@/components/ui/button';

// Source: model-selector.meta.json — AI Elements ModelSelector. Searchable model picker in a dialog; for long model lists (the chat uses a compact Select while there is one model).
const meta = { title: 'AI/Model Selector', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ModelSelector>
      <ModelSelectorTrigger asChild><Button variant="outline" size="sm">Claude Sonnet 5</Button></ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models…" />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="Anthropic">
            <ModelSelectorItem value="claude-sonnet-5"><ModelSelectorName>Claude Sonnet 5</ModelSelectorName></ModelSelectorItem>
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  ),
};
