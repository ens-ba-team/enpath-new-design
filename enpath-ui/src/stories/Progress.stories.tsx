import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress } from '@/components/ui/progress';

// Spec: progress.meta.json

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { value: 40, size: 'md' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── State=Loading (controls-driven) ──────────────────────────────────────────

export const Default: Story = {};

// ─── State=Loading — 60% ──────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <div className="flex justify-between">
        <span className="text-body-sm text-[var(--color-background-default-foreground)]">Uploading file…</span>
        <span className="text-body-sm text-[var(--color-text-secondary)]">60%</span>
      </div>
      <Progress value={60} />
    </div>
  ),
};

// ─── State=Complete (value=100) ────────────────────────────────────────────────
// Indicator: color/status/success (spec corrected from brand/primary).

export const Complete: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <div className="flex justify-between">
        <span className="text-body-sm text-[var(--color-background-default-foreground)]">Upload complete</span>
        <span className="text-body-sm text-[var(--color-text-secondary)]">100%</span>
      </div>
      <Progress value={100} />
    </div>
  ),
};

// ─── State=Indeterminate (value=null) ─────────────────────────────────────────
// Radix sets data-state="indeterminate". CSS animation needed for the sweep.
// See progress.meta.json for the keyframe pattern.

export const Indeterminate: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <span className="text-body-sm text-[var(--color-background-default-foreground)]">Processing files…</span>
      <Progress value={null} />
    </div>
  ),
};

// ─── All three sizes ───────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-80">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-xs text-[var(--color-text-secondary)]">SM — 4px</span>
        <Progress value={60} size="sm" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-xs text-[var(--color-text-secondary)]">MD — 8px (default)</span>
        <Progress value={60} size="md" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-xs text-[var(--color-text-secondary)]">LG — 12px</span>
        <Progress value={60} size="lg" />
      </div>
    </div>
  ),
};

// ─── Step tracker (custom max) ────────────────────────────────────────────────

export const StepTracker: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <div className="flex justify-between">
        <span className="text-body-sm text-[var(--color-background-default-foreground)]">Step 2 of 5</span>
        <span className="text-body-sm text-[var(--color-text-secondary)]">40%</span>
      </div>
      <Progress value={2} max={5} size="lg" />
    </div>
  ),
};

// ─── Animated — value advances to completion ──────────────────────────────────

export const Animated: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const timer = setInterval(() => {
        setValue(prev => {
          if (prev >= 100) { clearInterval(timer); return 100; }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
        <div className="flex justify-between">
          <span className="text-body-sm text-[var(--color-background-default-foreground)]">
            {value === 100 ? 'Upload complete' : 'Uploading…'}
          </span>
          <span className="text-body-sm text-[var(--color-text-secondary)]">{value}%</span>
        </div>
        <Progress value={value} />
      </div>
    );
  },
};

/** tone="success": green fill at every value on a white track, for progress on a success surface. */
export const SuccessTone: Story = {
  render: () => <div className="w-[240px]"><Progress value={60} tone="success" aria-label="Setup progress" /></div>,
};

/** shape="ring": 36px, a short label inside. Neutral fill; green when complete. Say the numbers in the aria-label. */
export const Ring: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-component-lg)]">
      <Progress shape="ring" value={0} aria-label="0 of 0 done">0/0</Progress>
      <Progress shape="ring" value={50} aria-label="1 of 2 done">1/2</Progress>
      <Progress shape="ring" value={100} aria-label="2 of 2 done">2/2</Progress>
    </div>
  ),
};
