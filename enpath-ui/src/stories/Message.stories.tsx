import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { CopyIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react/ssr';

// Source: message.meta.json — AI Elements Message. User = chat/user/* block; assistant = plain text with markdown.
const meta = { title: 'AI/Message', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const UserAndAssistant: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-[var(--spacing-component-lg)]">
      <Message from="user"><MessageContent>Which cells are not set?</MessageContent></Message>
      <Message from="assistant">
        <MessageContent><MessageResponse>{'**2 cells are not set**:\n\n- Testing · L4\n- Mentoring · L1'}</MessageResponse></MessageContent>
        <MessageActions>
          <MessageAction tooltip="Copy" label="Copy"><CopyIcon className="h-4 w-4" /></MessageAction>
          <MessageAction tooltip="Retry" label="Retry"><ArrowsClockwiseIcon className="h-4 w-4" /></MessageAction>
        </MessageActions>
      </Message>
    </div>
  ),
};
