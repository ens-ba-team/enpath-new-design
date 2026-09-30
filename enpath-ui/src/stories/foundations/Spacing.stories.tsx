import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Page, Section, TokenRow, primitiveTokens, semanticTokens, tokensUnder, useCssVar, type Token } from './token-kit';

// Spacing — the primitive scale and the semantic spacing roles. Names and descriptions
// from Tokens/*.tokens.json, values measured from the rendered CSS variables.

function Bar({ token }: { token: Token }) {
  return (
    <div className="flex h-6 w-full items-center">
      <div className="h-4 rounded-[var(--radius-sm)] bg-[var(--color-brand-primary)]" style={{ width: `var(${token.cssVar})` }} />
    </div>
  );
}

function Row({ token }: { token: Token }) {
  const value = useCssVar(token.cssVar);
  return <TokenRow token={token} value={value} sample={<Bar token={token} />} />;
}

function Group({ list }: { list: Token[] }) {
  return <div>{list.map((t) => <Row key={t.name} token={t} />)}</div>;
}

const meta = { title: 'Foundations/Spacing', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Semantic: Story = {
  render: () => (
    <Page
      title="Spacing"
      intro="Bind the semantic roles: component spacing inside a component, layout spacing between page groups, shell spacing for the app frame."
    >
      <Section title="spacing/component" note="Padding and gaps inside components: cards, forms, rows, icon-to-label.">
        <Group list={tokensUnder(semanticTokens, 'spacing', 'component')} />
      </Section>
      <Section title="spacing/layout" note="Space between page groups, panes and sections.">
        <Group list={tokensUnder(semanticTokens, 'spacing', 'layout')} />
      </Section>
      <Section title="spacing/shell" note="The app frame: outer inset and the gap between sidebar, page panel and chat panel.">
        <Group list={tokensUnder(semanticTokens, 'spacing', 'shell')} />
      </Section>
    </Page>
  ),
};

export const Primitives: Story = {
  render: () => (
    <Page title="Spacing · Primitives" intro="The raw scale the semantic roles point to. Screens bind the roles, not these.">
      <Group list={tokensUnder(primitiveTokens, 'spacing')} />
    </Page>
  ),
};
