import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, SparkleIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react/ssr";
import { Button } from '@/components/ui/button';

// Spec: alert.meta.json

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning'],
      description: 'Visual severity — default (neutral), destructive (error), warning (caution)',
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default variant ───────────────────────────────────────────────────────────
// Fill: color/background/default · Border: color/border/default
// Title: color/background/default/foreground · Description: color/background/muted/foreground

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <AlertTitle>System updated</AlertTitle>
      <AlertDescription>Your changes were saved successfully.</AlertDescription>
    </Alert>
  ),
};

// ─── Destructive variant ──────────────────────────────────────────────────────
// Fill: color/background/default · Border: color/border/error
// Title: color/text/invalid · Description: color/text/secondary · Icon: color/icon/danger

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Unable to save</AlertTitle>
      <AlertDescription>Check the required fields and try again.</AlertDescription>
    </Alert>
  ),
};

// ─── Warning variant ──────────────────────────────────────────────────────────
// Fill: color/yellow/50 · Border: color/yellow/200
// Title: color/yellow/900 · Description: color/yellow/800 · Icon: color/icon/warning
// NOTE: Warning uses primitive yellow tokens — intentional design decision.

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]">
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>Free up space before uploading more files.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[400px]">
      <AlertTitle>Position saved</AlertTitle>
      <AlertDescription>Your changes are live for all employees.</AlertDescription>
    </Alert>
  ),
};

export const InfoVariant: Story = {
  name: 'Info',
  render: () => (
    <Alert variant="info" className="w-[400px]">
      <AlertTitle>New levels available</AlertTitle>
      <AlertDescription>Two new career levels were added to this track.</AlertDescription>
    </Alert>
  ),
};

// ─── With icon (nested layout) ────────────────────────────────────────────────
// Nested layout: flex-row wrapper (gap spacing/component/md) > icon + content div
// icon prop: the Alert places the icon beside the content (gap md; content gap xxs) and colours it by variant.

export const DefaultWithIcon: Story = {
  render: () => (
    <Alert className="w-[400px]" icon={<InfoIcon />}>
      <AlertTitle>New integration available</AlertTitle>
      <AlertDescription>Connect your account to unlock additional features.</AlertDescription>
    </Alert>
  ),
};

export const DestructiveWithIcon: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]" icon={<WarningCircleIcon />}>
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>Check your card details and try again.</AlertDescription>
    </Alert>
  ),
};

export const WarningWithIcon: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]" icon={<WarningIcon />}>
      <AlertTitle>API key expires in 7 days</AlertTitle>
      <AlertDescription>Rotate your key before it expires to avoid service interruption.</AlertDescription>
    </Alert>
  ),
};

// ─── With action ──────────────────────────────────────────────────────────────
// Action button sits below the text in the content column.
// Button is self-contained — alert must not override any button fills.

export const WithAction: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]" icon={<WarningIcon />}>
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>You have used 90% of your storage quota.</AlertDescription>
      <Button size="sm" className="mt-[var(--spacing-component-xs)] self-start">Manage storage</Button>
    </Alert>
  ),
};

// ─── AI proposal ──────────────────────────────────────────────────────────────
// variant="ai": white fill, color/border/ai stroke, the icon in color/icon/brand. Use the Sparkle.

export const AIProposal: Story = {
  name: 'AI proposal',
  render: () => (
    <Alert variant="ai" className="w-[480px]" icon={<SparkleIcon />} role="group" aria-label="AI proposal">
      <AlertTitle>Write a short guide to readable pull requests</AlertTitle>
      <AlertDescription>AI proposal · outcome: a one-page guide the team links in reviews</AlertDescription>
      <div className="mt-[var(--spacing-component-xs)] flex gap-[var(--spacing-component-xs)]">
        <Button variant="outline" size="sm">Add to plan</Button>
        <Button variant="ghost" size="sm">Dismiss</Button>
      </div>
    </Alert>
  ),
};

// ─── All variants side by side ────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <Alert icon={<InfoIcon />}>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Your changes were saved successfully.</AlertDescription>
      </Alert>
      <Alert variant="destructive" icon={<WarningCircleIcon />}>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Payment failed. Check your card details.</AlertDescription>
      </Alert>
      <Alert variant="warning" icon={<WarningIcon />}>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Your API key expires in 7 days.</AlertDescription>
      </Alert>
      <Alert variant="ai" icon={<SparkleIcon />}>
        <AlertTitle>AI proposal</AlertTitle>
        <AlertDescription>Lead a cross-functional planning session.</AlertDescription>
      </Alert>
    </div>
  ),
};

/** size="sm": one compact line (icon · title · action) for page headers and toolbars. */
export const Small: Story = {
  render: () => (
    <Alert variant="info" size="sm" role="status" className="w-fit">
      <InfoIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <AlertTitle>Engineering growth changed 27 Sep</AlertTitle>
      <Button variant="link" size="sm">See what’s different</Button>
    </Alert>
  ),
};
