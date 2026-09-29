import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

// Text styles — one class per style, generated from Tokens/semantics.tokens.json
// typography/* into app/text-styles.css. The numbers shown are measured from the
// rendered sample, so they always match what the class really does. Class names
// are written out in full (cls) so Tailwind's scanner finds them.

const STYLES = [
  { name: 'heading-xl', cls: 'text-heading-xl', use: 'Page title (h1), one per page' },
  { name: 'heading-lg', cls: 'text-heading-lg', use: 'Large section title on a page' },
  { name: 'heading-md', cls: 'text-heading-md', use: 'Dialog, drawer and sheet titles' },
  { name: 'heading-sm', cls: 'text-heading-sm', use: 'Card and panel titles, empty-state titles' },
  { name: 'heading-xs', cls: 'text-heading-xs', use: 'Titles of list rows, items and small cards' },
  { name: 'body-sm', cls: 'text-body-sm', use: 'Default UI text: body, list rows, descriptions, table cells' },
  { name: 'body-xs', cls: 'text-body-xs', use: 'Secondary text: captions, meta lines, helper text' },
  { name: 'label-md', cls: 'text-label-md', use: 'One-line labels: buttons, form labels, alert titles' },
  { name: 'label-sm', cls: 'text-label-sm', use: 'Small one-line labels: badges, tabs, tooltips, table headers' },
] as const;

function Row({ name, cls, use }: { name: string; cls: string; use: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [spec, setSpec] = React.useState('');
  React.useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(ref.current);
    setSpec(`${parseFloat(cs.fontSize)} / ${Math.round(parseFloat(cs.lineHeight) * 100) / 100} · ${cs.fontWeight}`);
  }, []);
  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-component-xs)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-md)] sm:grid-cols-[180px_1fr]">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <code className="font-mono text-body-xs text-[var(--color-background-default-foreground)]">text-{name}</code>
        <span className="text-body-xs text-[var(--color-text-secondary)]">{spec}</span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <p ref={ref} className={`${cls} text-[var(--color-background-default-foreground)]`}>
          Backend Engineer L3 · Senior
        </p>
        <span className="text-body-xs text-[var(--color-text-secondary)]">{use}</span>
      </div>
    </div>
  );
}

function TextStyles() {
  return (
    <div className="max-w-[720px]">
      {STYLES.map((s) => <Row key={s.name} {...s} />)}
    </div>
  );
}

const meta = {
  title: 'Foundations/Text Styles',
  component: TextStyles,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TextStyles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};
