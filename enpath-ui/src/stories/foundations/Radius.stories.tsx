import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Page, Section, TokenRow, primitiveTokens, semanticTokens, tokensUnder, useCssVar, type Token } from './token-kit';

// Radius — semantic roles and the primitive scale. Names and descriptions from
// Tokens/*.tokens.json, values measured from the rendered CSS variables.

function Row({ token }: { token: Token }) {
  const value = useCssVar(token.cssVar);
  return (
    <TokenRow
      token={token}
      value={value}
      sample={
        <div
          className="h-12 w-24 border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)]"
          style={{ borderRadius: `var(${token.cssVar})` }}
        />
      }
    />
  );
}

const meta = { title: 'Foundations/Radius', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Radius: Story = {
  render: () => (
    <Page title="Radius" intro="Bind the role for what you are shaping: a control, a surface, an overlay, a pill, the app panel.">
      <Section title="Roles">
        <div>{tokensUnder(semanticTokens, 'radius').map((t) => <Row key={t.name} token={t} />)}</div>
      </Section>
      <Section title="Primitives" note="The raw scale the roles point to.">
        <div>{tokensUnder(primitiveTokens, 'radius').map((t) => <Row key={t.name} token={t} />)}</div>
      </Section>
    </Page>
  ),
};
