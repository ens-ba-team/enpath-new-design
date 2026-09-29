import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Spec: hover-card.meta.json
const meta = { title: 'Overlay/Hover Card', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="text-body-sm text-[var(--color-text-link)] underline">Northstar Engineering</a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 text-body-sm">
        <p className="text-heading-xs">Northstar Engineering</p>
        <p className="text-[var(--color-text-secondary)]">6 competencies · used by 3 positions</p>
      </HoverCardContent>
    </HoverCard>
  ),
};
