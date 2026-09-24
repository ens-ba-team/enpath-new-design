import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';

// Source: conversation.meta.json — AI Elements Conversation. Scroll container that sticks to the latest message.
const meta = { title: 'AI/Conversation', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Conversation className="h-72 w-96 rounded-[var(--radius-panel)] border border-[var(--color-border-default)]">
      <ConversationContent>
        {Array.from({ length: 4 }, (_, i) => (
          <Message key={i} from={i % 2 ? 'assistant' : 'user'}>
            <MessageContent>{i % 2 ? 'Backend Engineer has 4 levels: Junior, Mid, Senior, Staff.' : 'What levels does Backend Engineer have?'}</MessageContent>
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  ),
};

export const Empty: Story = {
  render: () => (
    <Conversation className="h-72 w-96 rounded-[var(--radius-panel)] border border-[var(--color-border-default)]">
      <ConversationContent>
        <ConversationEmptyState title="Ask about your career structure" description="I can explain positions, find gaps and draft changes." />
      </ConversationContent>
    </Conversation>
  ),
};
