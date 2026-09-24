import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group';
import { MagnifyingGlassIcon, PaperPlaneRightIcon } from '@phosphor-icons/react/ssr';

// Source: input-group.meta.json — shadcn InputGroup. One bordered field with addons; the chat composer is built on it.
const meta = { title: 'Forms/Input Group', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon><MagnifyingGlassIcon className="h-4 w-4" /></InputGroupAddon>
      <InputGroupInput placeholder="Search positions" aria-label="Search positions" />
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupInput placeholder="Level name" aria-label="Level name" />
      <InputGroupAddon align="inline-end"><InputGroupButton size="sm">Add</InputGroupButton></InputGroupAddon>
    </InputGroup>
  ),
};

export const Textarea: Story = {
  render: () => (
    <InputGroup className="w-96">
      <InputGroupTextarea placeholder="Ask Enpath…" aria-label="Message" />
      <InputGroupAddon align="block-end" className="justify-end">
        <InputGroupButton size="sm" aria-label="Send"><PaperPlaneRightIcon className="h-4 w-4" /></InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
