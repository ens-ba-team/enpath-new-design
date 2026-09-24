import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CodeBlock, CodeBlockCopyButton } from '@/components/ai-elements/code-block';

// Source: code-block.meta.json — AI Elements CodeBlock. Highlighted code with copy.
const meta = { title: 'AI/Code Block', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <CodeBlock code={'{\n  "position": "Backend Engineer",\n  "levels": 4\n}'} language="json">
        <CodeBlockCopyButton />
      </CodeBlock>
    </div>
  ),
};
