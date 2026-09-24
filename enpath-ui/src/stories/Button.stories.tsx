import { DotsThreeIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Source: button.meta.json (category, variants, argTypes, defaults)
// Patterns: button.examples.tsx (leadingIcon, iconOnly, destructiveConfirmation)

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'link', 'destructive'],
      description: 'Visual style — maps to Figma Type property',
    },
    size: {
      control: 'select',
      // meta.json > variants.Size.reactValues
      options: ['xs', 'sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg'],
      description: 'Size — sm / default / lg for text buttons; icon-sm / icon / icon-lg for icon-only',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean', description: 'In-progress action — spinner before label, disabled, aria-busy (from En UI)' },
  },
  args: {
    variant: 'default',
    size: 'default',
    children: 'Save changes',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Variant stories ---

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Back' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Dismiss' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'Go to dashboard' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete project' },
};

// --- Size stories ---

export const XSmall: Story = {
  args: { size: 'xs', children: 'XSmall' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
};

// --- State stories ---

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const PressMotion: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-[var(--spacing-component-sm)]">
      <Button>Press and hold</Button>
      <p className="text-sm text-[var(--color-text-secondary)]">
        The button moves down by 1px while pressed, with no pressed-state shadow.
      </p>
    </div>
  ),
};

// --- Pattern stories (from button.examples.tsx) ---

// Leading icon — PlusIcon before label
export const WithLeadingIcon: Story = {
  render: () => (
    <Button>
      <PlusIcon aria-hidden="true" />
      Add member
    </Button>
  ),
};

// Icon-only — always needs a tooltip (accessibility rule)
export const IconOnly: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" aria-label="More actions">
            <DotsThreeIcon aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>More actions</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

// Destructive + confirmation — irreversible actions require AlertDialog
export const DestructiveWithConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon aria-hidden="true" />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the project and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Delete project</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
