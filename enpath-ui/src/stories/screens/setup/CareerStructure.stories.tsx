import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SetupScreen } from '@/features/enpath/setup/setup-screen';

// Same screen as the prototype at /setup — the code lives in src/features/enpath/setup.
const meta = {
  title: 'Screens/Setup/Career structure',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const CareerStructure: Story = {
  name: 'Career structure — draft position',
  render: () => <SetupScreen />,
};
