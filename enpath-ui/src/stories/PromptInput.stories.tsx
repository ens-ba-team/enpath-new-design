import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSelect, PromptInputSelectContent, PromptInputSelectItem, PromptInputSelectTrigger, PromptInputSelectValue, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@/components/ai-elements/prompt-input';

// Source: prompt-input.meta.json — AI Elements PromptInput. The chat composer: text box, tools (mode, model) and submit/stop.
const meta = { title: 'AI/Prompt Input', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <PromptInput onSubmit={() => {}} className="[&_[data-slot=input-group]]:rounded-[var(--chat-composer-radius)]">
        <PromptInputBody><PromptInputTextarea placeholder="Ask Enpath…" /></PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputSelect defaultValue="claude-sonnet-5">
              <PromptInputSelectTrigger aria-label="Model" className="h-7 w-auto border-none text-xs shadow-none"><PromptInputSelectValue /></PromptInputSelectTrigger>
              <PromptInputSelectContent><PromptInputSelectItem value="claude-sonnet-5">Claude Sonnet 5</PromptInputSelectItem></PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </div>
  ),
};

export const Streaming: Story = {
  render: () => (
    <div className="w-[420px]">
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody><PromptInputTextarea placeholder="Ask Enpath…" /></PromptInputBody>
        <PromptInputFooter><PromptInputTools /><PromptInputSubmit status="streaming" /></PromptInputFooter>
      </PromptInput>
    </div>
  ),
};
