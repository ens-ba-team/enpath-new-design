import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool';

// Source: tool.meta.json — AI Elements Tool. Collapsible record of a tool call the assistant made.
const meta = { title: 'AI/Tool', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {
  render: () => (
    <Tool className="w-[420px]" defaultOpen>
      <ToolHeader type="tool-read_position" state="output-available" />
      <ToolContent>
        <ToolInput input={{ position: 'Backend Engineer' }} />
        <ToolOutput output={{ levels: 4, unsetCells: 2 }} errorText={undefined} />
      </ToolContent>
    </Tool>
  ),
};

export const Error: Story = {
  render: () => (
    <Tool className="w-[420px]" defaultOpen>
      <ToolHeader type="tool-read_position" state="output-error" />
      <ToolContent>
        <ToolOutput output={undefined} errorText="Position not found" />
      </ToolContent>
    </Tool>
  ),
};
