import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { CaretDownIcon } from '@phosphor-icons/react/ssr';

// Source: collapsible.meta.json — shadcn Collapsible (Radix). Unstyled show/hide; used by Reasoning and Tool.
const meta = { title: 'Layout/Collapsible', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80 rounded-[var(--radius-surface)] border border-[var(--color-border-default)] p-[var(--spacing-component-md)]">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">Show details <CaretDownIcon className="h-4 w-4" /></Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-[var(--spacing-component-sm)] text-sm text-[var(--color-text-secondary)]">
        Levels are ordered lowest first. Removing a level deletes its expectations.
      </CollapsibleContent>
    </Collapsible>
  ),
};
