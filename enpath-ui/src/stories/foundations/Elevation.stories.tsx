import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Page, Section, TokenRow, primitiveTokens, semanticTokens, tokensUnder, type Token } from './token-kit';

// Elevation — shadow roles on a real surface, then the primitive shadows. Names and
// descriptions from Tokens/*.tokens.json.

function Row({ token }: { token: Token }) {
  return (
    <TokenRow
      token={token}
      sample={
        <div className="flex h-16 w-28 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-background-subtle)]">
          <div
            className="h-10 w-20 rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]"
            style={{ boxShadow: `var(${token.cssVar})` }}
          />
        </div>
      }
    />
  );
}

const meta = { title: 'Foundations/Elevation', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Elevation: Story = {
  render: () => (
    <Page
      title="Elevation"
      intro="Shadow roles from flat to blocking: surface for flat containers, raised for sticky or dragged, overlay for floating UI that leaves the page usable, modal for anything behind a scrim."
    >
      <Section title="Roles">
        <div>{tokensUnder(semanticTokens, 'shadow').map((t) => <Row key={t.name} token={t} />)}</div>
      </Section>
      <Section title="Primitives" note="The raw shadows the roles point to. Components bind the roles.">
        <div>{tokensUnder(primitiveTokens, 'shadow').map((t) => <Row key={t.name} token={t} />)}</div>
      </Section>
    </Page>
  ),
};
