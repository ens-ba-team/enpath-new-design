import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Item } from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { BellRingingIcon, CaretRightIcon, ChartBarIcon, FileTextIcon, FolderIcon, GearIcon, HouseIcon, UserIcon } from "@phosphor-icons/react/ssr";

// Source: item.meta.json — Figma verified 65:815
// Custom component — no shadcn base.
//
// Tokens:
//   Default:  transparent · radius/lg
//   Outline:  color/surface/default · color/border/default 1px · radius/lg
//   Muted:    color/surface/muted · radius/lg
//   Padding + gap: md(12px) · sm(8px) · xs(6px)
//   title: color/surface/default/foreground · text-sm font-medium
//   description: color/surface/muted/foreground · text-sm
//   content gap: spacing/component/xxs (2px)
//   Alignment: Icon+Link → items-start · Default/Avatar/Image → items-center
//
// Cross-check (meta.json):
//   Type: Default ✓  Icon ✓  Avatar ✓  Image ✓  Header ✓  Link ✓
//   Variant: Default ✓  Outline ✓  Muted ✓
//   Size: Default ✓  Sm ✓  Xs ✓

const meta = {
  title: 'Layout/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['default', 'icon', 'avatar', 'image', 'header', 'link'] },
    variant: { control: 'select', options: ['default', 'outline', 'muted'] },
    size: { control: 'select', options: ['default', 'sm', 'xs'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    type: 'default',
    variant: 'default',
    size: 'default',
    title: 'Item title',
    description: 'Supporting description text',
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Type=Default ──────────────────────────────────────────────────────────────
// No leading element. items-center. action-slot optional.

export const TypeDefault: Story = {
  render: () => (
    <div className="w-80">
      <Item
        title="Project proposal"
        description="Updated 2 hours ago"
        action={<Button size="sm" variant="outline">Edit</Button>}
      />
    </div>
  ),
};

// ─── Type=Icon ─────────────────────────────────────────────────────────────────
// 16×16 icon precedes content. items-start (Figma: align=MIN).

export const TypeIcon: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-1">
      <Item
        type="icon"
        icon={<FolderIcon className="h-4 w-4" />}
        title="Design assets"
        description="48 files · 2.4 GB"
        action={<Button size="sm" variant="outline">Open</Button>}
      />
      <Item
        type="icon"
        icon={<FileTextIcon className="h-4 w-4" />}
        title="Q1 Report"
        description="1.2 MB · PDF"
        action={<Button size="sm" variant="outline">Download</Button>}
      />
      <Item
        type="icon"
        icon={<ChartBarIcon className="h-4 w-4" />}
        title="Analytics"
        description="Last 30 days"
      />
    </div>
  ),
};

// ─── Type=Avatar ───────────────────────────────────────────────────────────────
// 40×40 avatar. items-center.

export const TypeAvatar: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-1">
      <Item
        type="avatar"
        avatarFallback="PL"
        title="Phuong Lam"
        description="Lead Designer"
        action={<Button size="sm" variant="outline">Message</Button>}
      />
      <Item
        type="avatar"
        avatarFallback="AJ"
        title="Alex Johnson"
        description="Engineering"
        action={<Button size="sm" variant="outline">Message</Button>}
      />
    </div>
  ),
};

// ─── Type=Image ────────────────────────────────────────────────────────────────
// 32×32 thumbnail. Muted placeholder when no imageSrc.

export const TypeImage: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-1">
      <Item
        type="image"
        imageAlt="Q1 Report"
        title="Q1-2026-report.pdf"
        description="1.2 MB · PDF"
        action={<Button size="sm" variant="outline">Download</Button>}
      />
      <Item
        type="image"
        imageAlt="Design file"
        title="design-system-v2.fig"
        description="48 MB · Figma"
        action={<Button size="sm" variant="outline">Open</Button>}
      />
    </div>
  ),
};

// ─── Type=Header ───────────────────────────────────────────────────────────────
// Full-width cover image above content. No action-slot. Vertical layout.

export const TypeHeader: Story = {
  render: () => (
    <div className="w-80">
      <Item
        type="header"
        variant="outline"
        title="Getting started with the design system"
        description="A guide to tokens, components, and patterns"
      />
    </div>
  ),
};

// ─── Type=Link ─────────────────────────────────────────────────────────────────
// Full row is the interactive target. Trailing chevron. items-start.

export const TypeLink: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-0">
      {[
        { title: 'Account settings', description: 'Manage your preferences and security' },
        { title: 'Notifications', description: 'Email, push, and in-app alerts' },
        { title: 'Billing', description: 'Manage your plan and payment methods' },
      ].map(({ title, description }) => (
        <Item
          key={title}
          type="link"
          href="#"
          title={title}
          description={description}
        />
      ))}
    </div>
  ),
};

// ─── Variant=Outline ──────────────────────────────────────────────────────────

export const VariantOutline: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-2">
      <Item
        variant="outline"
        type="icon"
        icon={<GearIcon className="h-4 w-4" />}
        title="Two-factor authentication"
        description="Add an extra layer of security"
        action={<Button size="sm" variant="outline">Enable</Button>}
      />
      <Item
        variant="outline"
        type="icon"
        icon={<BellRingingIcon className="h-4 w-4" />}
        title="Push notifications"
        description="Get alerted for important events"
        action={<Button size="sm" variant="outline">Configure</Button>}
      />
    </div>
  ),
};

// ─── Variant=Muted ─────────────────────────────────────────────────────────────

export const VariantMuted: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-1">
      <Item
        variant="muted"
        type="icon"
        icon={<HouseIcon className="h-4 w-4" />}
        title="Dashboard"
        description="Overview of all activity"
      />
      <Item
        type="icon"
        icon={<ChartBarIcon className="h-4 w-4" />}
        title="Analytics"
        description="Traffic and conversion metrics"
      />
    </div>
  ),
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-4">
      {(['default', 'sm', 'xs'] as const).map(size => (
        <div key={size}>
          <p className="text-xs text-[var(--color-text-secondary)] mb-1 capitalize">{size}</p>
          <Item
            size={size}
            type="icon"
            icon={<FolderIcon className="h-4 w-4" />}
            title="Design assets"
            description="48 files · 2.4 GB"
            action={<Button size="sm" variant="outline">Open</Button>}
          />
        </div>
      ))}
    </div>
  ),
};

// ─── Inside card (real use case) ──────────────────────────────────────────────

export const InsideCard: Story = {
  render: () => (
    <div className="w-80 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)]">
      <div className="px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)]">
        <p className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">Notifications</p>
      </div>
      <div className="p-[var(--spacing-component-xs)]">
        {[
          { icon: <BellRingingIcon className="h-4 w-4" />, title: 'Email digest', description: 'Weekly summary every Monday' },
          { icon: <GearIcon className="h-4 w-4" />, title: 'Push notifications', description: 'Real-time alerts on your device' },
          { icon: <UserIcon className="h-4 w-4" />, title: 'Team mentions', description: 'When someone @mentions you' },
        ].map(({ icon, title, description }) => (
          <Item
            key={title}
            size="sm"
            type="icon"
            icon={icon}
            title={title}
            description={description}
            action={<Button size="sm" variant="outline">Configure</Button>}
          />
        ))}
      </div>
    </div>
  ),
};

// Selectable — single-select list (master–detail). Hover is lighter than selected.
function SelectableDemo() {
  const rows = [
    { id: 'be', title: 'Backend Engineer', description: 'BE · 4 levels' },
    { id: 'fe', title: 'Frontend Engineer', description: 'FE · 4 levels' },
    { id: 'pd', title: 'Product Designer', description: 'PD · 3 levels' },
  ];
  const [selected, setSelected] = React.useState('be');
  return (
    <ul className="flex w-72 flex-col gap-[var(--spacing-component-xs)]" aria-label="Positions">
      {rows.map((r) => (
        <li key={r.id}>
          <Item size="sm" title={r.title} description={r.description} selected={r.id === selected} onSelect={() => setSelected(r.id)} />
        </li>
      ))}
    </ul>
  );
}

export const Selectable: Story = {
  args: { title: 'Selectable' },
  render: () => <SelectableDemo />,
};
