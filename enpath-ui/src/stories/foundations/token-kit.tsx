import * as React from 'react';

// Shared by the Foundations pages. Names, aliases and descriptions come straight from
// Tokens/*.tokens.json; values are read from the rendered CSS variables at runtime.
// No value is written in this folder, so the pages can't drift from the tokens.

import primitives from '../../../../Tokens/primitives.tokens.json';
import semantics from '../../../../Tokens/semantics.tokens.json';

type Json = { [k: string]: unknown };

export type Token = {
  /** Slash name, e.g. color/surface/default */
  name: string;
  path: string[];
  /** CSS variable, e.g. --color-surface-default */
  cssVar: string;
  /** Referenced token as a slash name, when the value is an alias */
  alias?: string;
  description?: string;
};

function walk(node: Json, path: string[], out: Token[]) {
  if ('$value' in node) {
    const v = node.$value;
    const alias = typeof v === 'string' && /^\{.+\}$/.test(v) ? v.slice(1, -1).split('.').join('/') : undefined;
    out.push({
      name: path.join('/'),
      path,
      cssVar: `--${path.join('-')}`,
      alias,
      description: typeof node.$description === 'string' ? node.$description : undefined,
    });
    return;
  }
  for (const [k, child] of Object.entries(node)) {
    if (k.startsWith('$') || typeof child !== 'object' || child === null) continue;
    walk(child as Json, [...path, k], out);
  }
}

function flatten(root: Json): Token[] {
  const out: Token[] = [];
  walk(root, [], out);
  return out;
}

export const primitiveTokens = flatten(primitives as Json);
export const semanticTokens = flatten(semantics as Json);

/** Tokens whose path starts with the given segments. */
export function tokensUnder(list: Token[], ...prefix: string[]) {
  return list.filter((t) => prefix.every((p, i) => t.path[i] === p));
}

/** Direct child groups of a path, in file order (e.g. the colour families). */
export function groupsUnder(list: Token[], ...prefix: string[]) {
  const seen: string[] = [];
  for (const t of tokensUnder(list, ...prefix)) {
    const g = t.path[prefix.length];
    if (g && !seen.includes(g)) seen.push(g);
  }
  return seen;
}

/** The value a CSS variable resolves to on the page. */
const noSubscribe = () => () => {};

export function useCssVar(cssVar: string) {
  return React.useSyncExternalStore(
    noSubscribe,
    () => getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim(),
    () => '',
  );
}

/** Any CSS colour (oklch included) as #rrggbb, read from a 1px canvas. */
export function useHex(cssVar: string) {
  const raw = useCssVar(cssVar);
  return React.useMemo(() => {
    if (!raw || typeof document === 'undefined') return '';
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return raw;
    ctx.fillStyle = raw;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
    return a < 255 ? `${hex} · ${Math.round((a / 255) * 100)}%` : hex;
  }, [raw]);
}

// ─── Page parts ───────────────────────────────────────────────────────────────

export function Page({ title, intro, children }: { title: string; intro: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex max-w-[960px] flex-col gap-[var(--spacing-layout-md)] text-[var(--color-background-default-foreground)]">
      <header className="flex flex-col gap-[var(--spacing-component-xs)]">
        <h1 className="text-heading-xl">{title}</h1>
        <p className="text-body-sm text-[var(--color-text-secondary)]">{intro}</p>
      </header>
      {children}
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-[var(--spacing-component-md)]">
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <h2 className="text-heading-md">{title}</h2>
        {note && <p className="text-body-sm text-[var(--color-text-secondary)]">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** Token name, alias and resolved value. */
export function TokenName({ token, value }: { token: Token; value?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-[var(--spacing-component-xxs)]">
      <code className="text-code-sm break-all">{token.name}</code>
      <span className="text-body-xs text-[var(--color-text-secondary)] break-all">
        {[token.alias && `→ ${token.alias}`, value].filter(Boolean).join(' · ')}
      </span>
    </div>
  );
}

/**
 * A token description. The multi-line form ("Intent: … / Use when: …") becomes a
 * label + text list; continuation lines join the line above. Anything else is a paragraph.
 */
export function Description({ text }: { text?: string }) {
  if (!text) return null;
  const rows: { label: string; body: string }[] = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z][A-Za-z ]{1,20}):\s+(.*)$/);
    if (m) rows.push({ label: m[1], body: m[2] });
    else if (rows.length) rows[rows.length - 1].body += ` ${line.trim()}`;
    else rows.push({ label: '', body: line });
  }
  if (rows.length === 1 && !rows[0].label) {
    return <p className="text-body-xs text-[var(--color-text-secondary)]">{rows[0].body}</p>;
  }
  return (
    <dl className="grid grid-cols-[88px_1fr] gap-x-[var(--spacing-component-sm)] gap-y-[var(--spacing-component-xxs)]">
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <dt className="text-label-sm text-[var(--color-text-secondary)]">{r.label}</dt>
          <dd className="text-body-xs">{r.body}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/** One row: a visual sample, the token name, and its description. */
export function TokenRow({ token, value, sample }: { token: Token; value?: string; sample: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-md)] sm:grid-cols-[120px_220px_1fr]">
      <div className="flex items-start">{sample}</div>
      <TokenName token={token} value={value} />
      <Description text={token.description} />
    </div>
  );
}
