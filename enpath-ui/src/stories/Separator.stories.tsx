import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Separator } from '@/components/ui/separator';

// Spec: separator.meta.json

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    decorative: { control: 'boolean' },
  },
  args: { orientation: 'horizontal', decorative: true },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Horizontal ────────────────────────────────────────────────────────────────
// Divides stacked content. w-full, h-[1px]. color/border/default.

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-body-sm text-[var(--color-background-default-foreground)]">Above the separator</p>
      <Separator className="my-[var(--spacing-component-lg)]" />
      <p className="text-body-sm text-[var(--color-background-default-foreground)]">Below the separator</p>
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────
// Divides side-by-side elements. w-[1px], h-full. color/border/default.

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-[var(--spacing-component-md)]">
      <span className="text-body-sm text-[var(--color-background-default-foreground)]">Overview</span>
      <Separator orientation="vertical" />
      <span className="text-body-sm text-[var(--color-background-default-foreground)]">Activity</span>
      <Separator orientation="vertical" />
      <span className="text-body-sm text-[var(--color-background-default-foreground)]">Settings</span>
    </div>
  ),
};

// ─── In form sections ──────────────────────────────────────────────────────────
// Between groups of form fields belonging to different logical sections.

export const InFormSections: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-[var(--spacing-component-lg)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">Personal info</p>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <div className="h-9 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-background-default)]" />
          <div className="h-9 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-background-default)]" />
        </div>
      </div>
      <Separator />
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">Contact details</p>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <div className="h-9 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-background-default)]" />
        </div>
      </div>
    </div>
  ),
};

// ─── In metadata row ───────────────────────────────────────────────────────────
// Vertical separators between inline key-value pairs.

export const InMetadataRow: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-component-sm)]">
      <span className="text-body-sm text-[var(--color-text-secondary)]">Phuong Lam</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-body-sm text-[var(--color-text-secondary)]">Jun 2 2026</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-body-sm text-[var(--color-text-secondary)]">5 min read</span>
    </div>
  ),
};

// ─── In card (header / body boundary) ─────────────────────────────────────────

export const InCard: Story = {
  render: () => (
    <div className="w-72 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)]">
      <div className="p-[var(--spacing-component-lg)]">
        <p className="text-heading-xs text-[var(--color-surface-overlay-foreground)]">Card header</p>
      </div>
      <Separator />
      <div className="p-[var(--spacing-component-lg)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Card body content sits below the separator.</p>
      </div>
    </div>
  ),
};

/** tone: default · subtle (between closely related rows) · sidebar (on the app background). */
export const Tones: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-[var(--spacing-component-lg)]">
      <Separator />
      <Separator tone="subtle" />
      <div className="bg-[var(--color-background-app)] p-[var(--spacing-component-md)]"><Separator tone="sidebar" /></div>
    </div>
  ),
};
