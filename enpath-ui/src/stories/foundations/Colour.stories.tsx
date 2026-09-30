import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import {
  Page, Section, TokenRow, groupsUnder, primitiveTokens, semanticTokens, tokensUnder, useHex, type Token,
} from './token-kit';

// Colour — primitive ramps and semantic colours. Names and descriptions from
// Tokens/*.tokens.json, values measured from the rendered CSS variables.

const chip = 'h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)]';

function RampStep({ token }: { token: Token }) {
  const hex = useHex(token.cssVar);
  return (
    <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
      <div className={chip} style={{ background: `var(${token.cssVar})` }} />
      <span className="text-label-sm">{token.path.slice(2).join('/') || token.path[1]}</span>
      <span className="text-code-sm text-[var(--color-text-secondary)]">{hex}</span>
    </div>
  );
}

function Primitives() {
  const families = groupsUnder(primitiveTokens, 'color');
  return (
    <Page
      title="Colour · Primitives"
      intro="The raw palette. Components and screens never use these directly: bind a semantic colour instead. Neutrals are named zinc but hold Tailwind slate values; yellow is amber; brand is its own slightly purple ramp, blue is true blue."
    >
      {families.map((f) => {
        const steps = tokensUnder(primitiveTokens, 'color', f);
        return (
          <Section key={f} title={`color/${f}`}>
            <div className="grid grid-cols-3 gap-[var(--spacing-component-sm)] sm:grid-cols-6 lg:grid-cols-12">
              {steps.map((t) => <RampStep key={t.name} token={t} />)}
            </div>
          </Section>
        );
      })}
    </Page>
  );
}

function ColourSample({ token, foreground }: { token: Token; foreground?: Token }) {
  return (
    <div
      className="flex h-12 w-24 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-default)] text-label-md"
      style={{ background: `var(${token.cssVar})`, color: foreground ? `var(${foreground.cssVar})` : undefined }}
    >
      {foreground ? 'Aa' : null}
    </div>
  );
}

function ColourRow({ token, foreground }: { token: Token; foreground?: Token }) {
  const hex = useHex(token.cssVar);
  const fgHex = useHex(foreground?.cssVar ?? '--none');
  return (
    <>
      <TokenRow token={token} value={hex} sample={<ColourSample token={token} foreground={foreground} />} />
      {foreground && (
        <div className="grid grid-cols-1 gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-sm)] pl-[var(--spacing-component-lg)] sm:grid-cols-[104px_220px_1fr]">
          <span className="text-body-xs text-[var(--color-text-secondary)]">Text on it</span>
          <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
            <code className="text-code-sm break-all">{foreground.name}</code>
            <span className="text-body-xs text-[var(--color-text-secondary)] break-all">
              {[foreground.alias && `→ ${foreground.alias}`, fgHex].filter(Boolean).join(' · ')}
            </span>
          </div>
          <span />
        </div>
      )}
    </>
  );
}

/** A semantic colour group; a token's /foreground child is shown with it, not as its own row. */
function SemanticGroup({ group }: { group: string }) {
  const all = tokensUnder(semanticTokens, 'color', group);
  const names = new Set(all.map((t) => t.name));
  const isForeground = (t: Token) => t.path.at(-1) === 'foreground' && names.has(t.path.slice(0, -1).join('/'));
  const rows = all.filter((t) => !isForeground(t));
  return (
    <div>
      {rows.map((t) => (
        <ColourRow key={t.name} token={t} foreground={all.find((f) => f.name === `${t.name}/foreground`)} />
      ))}
    </div>
  );
}

const INTRO: Record<string, string> = {
  background: 'Page-level fills: the canvas, tinted sections, the app shell behind the panels.',
  surface: 'Containers on the page. Flat containers use surface/default; anything that floats above or blocks the page uses surface/overlay.',
  text: 'Text colours. Never dim text with opacity: pick a text token.',
  border: 'Strokes and dividers.',
  brand: 'The brand ramp in use: primary actions, focus ring, app background. Not blue: links, info and selection use blue.',
  status: 'Success, warning, danger, info and offline, each with a subtle fill and the text that sits on it.',
  input: 'Form field fills and strokes.',
  icon: 'Icon colours.',
  chart: 'Categorical chart colours.',
  sidebar: 'The app sidebar.',
  scale: 'The five rating points on a competency scale.',
};

function Semantic({ group }: { group: string }) {
  return (
    <Page title={`Colour · ${group}`} intro={INTRO[group] ?? 'Semantic colours.'}>
      <SemanticGroup group={group} />
    </Page>
  );
}

function OtherSemantic() {
  const known = new Set(Object.keys(INTRO));
  const singles = groupsUnder(semanticTokens, 'color').filter((g) => !known.has(g));
  return (
    <Page title="Colour · Other" intro="Single semantic colours that don't belong to a group.">
      {singles.map((g) => <SemanticGroup key={g} group={g} />)}
    </Page>
  );
}

const meta = {
  title: 'Foundations/Colour',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimitiveRamps: Story = { name: 'Primitives', render: () => <Primitives /> };
export const Background: Story = { render: () => <Semantic group="background" /> };
export const Surface: Story = { render: () => <Semantic group="surface" /> };
export const Text: Story = { render: () => <Semantic group="text" /> };
export const Border: Story = { render: () => <Semantic group="border" /> };
export const Brand: Story = { render: () => <Semantic group="brand" /> };
export const Status: Story = { render: () => <Semantic group="status" /> };
export const Input: Story = { render: () => <Semantic group="input" /> };
export const Icon: Story = { render: () => <Semantic group="icon" /> };
export const Chart: Story = { render: () => <Semantic group="chart" /> };
export const Sidebar: Story = { render: () => <Semantic group="sidebar" /> };
export const Scale: Story = { render: () => <Semantic group="scale" /> };
export const Other: Story = { render: () => <OtherSemantic /> };
