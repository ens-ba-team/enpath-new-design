import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Description, Page, Section, TokenRow, UsedBy, semanticTokens, tokensUnder, useCssVar, type Token } from './token-kit';

// Sizing — control heights (touch + pointer pair) and target sizes. Names and
// descriptions from Tokens/semantics.tokens.json, values from the rendered CSS variables.

function Block({ cssVar, tone }: { cssVar: string; tone: 'touch' | 'pointer' }) {
  return (
    <div
      className={
        tone === 'touch'
          ? 'w-12 rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)]'
          : 'w-12 rounded-[var(--radius-control)] bg-[var(--color-brand-primary)]'
      }
      style={{ height: `var(${cssVar})` }}
    />
  );
}

/** One control size: touch rung (below sm) beside the pointer rung (sm and up). */
function Pair({ size }: { size: string }) {
  const touch = semanticTokens.find((t) => t.name === `height/control-touch/${size}`);
  const pointer = semanticTokens.find((t) => t.name === `height/control/${size}`);
  const touchValue = useCssVar(touch?.cssVar ?? '--none');
  const pointerValue = useCssVar(pointer?.cssVar ?? '--none');
  if (!touch || !pointer) return null;
  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-md)] sm:grid-cols-[120px_220px_1fr]">
      <div className="flex items-end gap-[var(--spacing-component-sm)]">
        <Block cssVar={touch.cssVar} tone="touch" />
        <Block cssVar={pointer.cssVar} tone="pointer" />
      </div>
      <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xs)]">
        <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
          <code className="text-code-sm break-all">{touch.name}</code>
          <span className="text-body-xs text-[var(--color-text-secondary)]">below sm · {touchValue}</span>
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
          <code className="text-code-sm break-all">{pointer.name}</code>
          <span className="text-body-xs text-[var(--color-text-secondary)]">sm and up · {pointerValue}</span>
        </div>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Description text={pointer.description} />
        <UsedBy token={pointer} />
      </div>
    </div>
  );
}

function TargetRow({ token }: { token: Token }) {
  const value = useCssVar(token.cssVar);
  return (
    <TokenRow
      token={token}
      value={value}
      sample={
        <div
          className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border-strong)]"
          style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }}
        />
      }
    />
  );
}

const meta = { title: 'Foundations/Sizing', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizing: Story = {
  render: () => {
    const sizes = tokensUnder(semanticTokens, 'height', 'control').map((t) => t.path[2]);
    return (
      <Page
        title="Sizing"
        intro="Controls always use the pair: the touch height below sm, the pointer height from sm up. Grey outline = touch, filled = pointer."
      >
        <Section title="Control heights">
          <div>{sizes.map((s) => <Pair key={s} size={s} />)}</div>
        </Section>
        <Section title="Targets" note="Minimum hit areas. Smaller controls reach them with an invisible hit area, not a bigger visible box.">
          <div>{tokensUnder(semanticTokens, 'height', 'target').map((t) => <TargetRow key={t.name} token={t} />)}</div>
        </Section>
      </Page>
    );
  },
};
