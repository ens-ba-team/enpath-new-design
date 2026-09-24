import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';

// Source: command.meta.json — shadcn Command (cmdk). Searchable list; used by the Model selector and prompt @-mentions.
const meta = { title: 'Navigation/Command', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-96 rounded-[var(--radius-overlay)] border border-[var(--color-border-default)] shadow-[var(--shadow-overlay)]">
      <CommandInput placeholder="Search positions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Positions">
          <CommandItem>Backend Engineer</CommandItem>
          <CommandItem>Frontend Engineer</CommandItem>
          <CommandItem>Product Designer</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>Add position<CommandShortcut>⌘N</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
