import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Page, Section, TokenRow, primitiveTokens, semanticTokens, tokensUnder, useCssVar, type Token } from './token-kit';

// Opacity, z-index, motion, breakpoints, layout grid and gradient. Names and descriptions
// from Tokens/*.tokens.json, values from the rendered CSS variables.

function OpacityRow({ token }: { token: Token }) {
  const value = useCssVar(token.cssVar);
  return (
    <TokenRow
      token={token}
      value={value}
      sample={
        <div className="h-12 w-24 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[repeating-conic-gradient(var(--color-background-muted)_0_25%,var(--color-background-default)_0_50%)] bg-[length:12px_12px]">
          <div
            className="h-full w-full rounded-[var(--radius-md)] bg-[var(--color-background-inverted)]"
            style={{ opacity: `calc(var(${token.cssVar}) / 100)` }}
          />
        </div>
      }
    />
  );
}

/** Hover the track: the dot travels with this duration or easing. */
function MotionSample({ token }: { token: Token }) {
  const isEasing = token.path[1] === 'easing';
  const normal = semanticTokens.concat(primitiveTokens).find((t) => t.name === 'motion/duration/normal');
  const duration = isEasing ? `calc(var(${normal?.cssVar ?? '--none'}) * 2ms)` : `calc(var(${token.cssVar}) * 1ms)`;
  const easing = isEasing ? `var(${token.cssVar})` : 'linear';
  return (
    <div className="group relative h-6 w-24 rounded-[var(--radius-pill)] bg-[var(--color-background-muted)]" title="Hover to play">
      <div
        className="absolute left-0.5 top-0.5 h-5 w-5 rounded-[var(--radius-pill)] bg-[var(--color-brand-primary)] group-hover:translate-x-[72px]"
        style={{ transitionProperty: 'transform', transitionDuration: duration, transitionTimingFunction: easing }}
      />
    </div>
  );
}

function ValueRow({ token, sample }: { token: Token; sample?: React.ReactNode }) {
  const value = useCssVar(token.cssVar);
  return <TokenRow token={token} value={value} sample={sample ?? <span />} />;
}

function List({ list, sample }: { list: Token[]; sample?: (t: Token) => React.ReactNode }) {
  return <div>{list.map((t) => <ValueRow key={t.name} token={t} sample={sample?.(t)} />)}</div>;
}

const meta = { title: 'Foundations/Other', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Opacity: Story = {
  render: () => (
    <Page title="Opacity" intro="Values are 0–100: use calc(var(--opacity-x) / 100). Never dim text with opacity: use a text token.">
      <Section title="Roles">
        <div>{tokensUnder(semanticTokens, 'opacity').map((t) => <OpacityRow key={t.name} token={t} />)}</div>
      </Section>
      <Section title="Primitives">
        <div>{tokensUnder(primitiveTokens, 'opacity').map((t) => <OpacityRow key={t.name} token={t} />)}</div>
      </Section>
    </Page>
  ),
};

export const ZIndex: Story = {
  name: 'Z-index',
  render: () => (
    <Page title="Z-index" intro="Stacking layers, lowest first.">
      <List list={tokensUnder(primitiveTokens, 'z-index')} />
    </Page>
  ),
};

export const Motion: Story = {
  render: () => (
    <Page title="Motion" intro="Durations are in milliseconds. Hover a track to play it: durations run linear, easings run at twice the normal duration so the curve is visible.">
      <Section title="Duration">
        <List list={tokensUnder(primitiveTokens, 'motion', 'duration')} sample={(t) => <MotionSample token={t} />} />
      </Section>
      <Section title="Easing">
        <List list={tokensUnder(primitiveTokens, 'motion', 'easing')} sample={(t) => <MotionSample token={t} />} />
      </Section>
    </Page>
  ),
};

export const Breakpoints: Story = {
  render: () => (
    <Page title="Breakpoints" intro="Widths in pixels. lg is the main layout switch (sidebar, master and detail side by side).">
      <Section title="Breakpoints">
        <List list={tokensUnder(primitiveTokens, 'breakpoint').filter((t) => t.path[1] !== 'frame')} />
      </Section>
      <Section title="Frames" note="Reference widths for checking screens.">
        <List list={tokensUnder(primitiveTokens, 'breakpoint', 'frame')} />
      </Section>
    </Page>
  ),
};

export const LayoutGrid: Story = {
  name: 'Layout grid',
  render: () => (
    <Page title="Layout grid" intro="Page container and grid columns, gutters and margins per breakpoint.">
      <List list={tokensUnder(primitiveTokens, 'layout')} />
    </Page>
  ),
};

export const Gradient: Story = {
  render: () => (
    <Page title="Gradient" intro="Gradients with a single, named use.">
      <List
        list={tokensUnder(primitiveTokens, 'gradient')}
        sample={(t) => (
          <div className="h-12 w-24 rounded-[var(--radius-md)] border border-[var(--color-border-default)]" style={{ background: `var(${t.cssVar})` }} />
        )}
      />
    </Page>
  ),
};
