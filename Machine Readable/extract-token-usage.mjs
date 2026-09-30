/**
 * extract-token-usage.mjs — which tokens each component's code really uses.
 *
 * Run:  node "Machine Readable/extract-token-usage.mjs"          (dry run: report only)
 *       node "Machine Readable/extract-token-usage.mjs" --write  (write the generated files)
 *
 * The token section of a component spec follows the code (rulebook → Source of Truth), so it
 * is generated, never typed. For each meta.json this reads `implementation.tsxFile` and collects
 * every token the classes reach (and the tokens those point to, e.g. a component token's semantic token):
 *   - var(--token) written directly, component tokens included;
 *   - Tailwind utilities that resolve to a token (bg-primary, text-muted-foreground, border-border,
 *     rounded-full, shadow-sm, bg-zinc-100 …), through the aliases in src/app/globals.css.
 * Names built at runtime (var(--career-map-${role})) count the tokens whose rest is a string in the
 * file. Comments are skipped. Utilities that only reach a token through calc() (rounded-md = 0.8 ×
 * radius/base) are not a token binding and are not counted.
 *
 * --write updates:
 *   - each meta.json → `tokensUsed` (sorted list, generated; placed after `tokens`);
 *   - Machine Readable/token-usage.json → { token: [components] } for the Foundations pages.
 * The hand-written `tokens` block (which element, which state) stays; drift-check #14 fails
 * when it names a token that isn't in `tokensUsed`, or when `tokensUsed` is stale.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const ui = path.join(root, 'enpath-ui');
const metaDir = path.join(here, 'artifacts/components');
export const usagePath = path.join(here, 'token-usage.json');

// ── Token names by CSS variable ──────────────────────────────────────────────
function tokenVars() {
  const byVar = new Map();
  const refs = new Map(); // token → the token its $value points to
  const walk = (node, p) => {
    if (node && typeof node === 'object' && '$value' in node) {
      byVar.set(`--${p.join('-')}`, p.join('/'));
      const v = node.$value;
      if (typeof v === 'string' && /^\{[^}]+\}$/.test(v)) refs.set(p.join('/'), v.slice(1, -1).split('.').join('/'));
      return;
    }
    for (const [k, v] of Object.entries(node ?? {})) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...p, k]);
  };
  for (const f of ['primitives', 'semantics', 'components']) {
    walk(JSON.parse(fs.readFileSync(path.join(root, `Tokens/${f}.tokens.json`), 'utf8')), []);
  }
  return { byVar, refs };
}

// ── Aliases in globals.css: --x: var(--token) (pure aliases only, calc() skipped) ──
function aliases(byVar) {
  const css = fs.readFileSync(path.join(ui, 'src/app/globals.css'), 'utf8');
  const map = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*var\((--[a-z0-9-]+)\)\s*;/g)) {
    if (m[1] !== m[2] && byVar.has(m[2])) map.set(m[1], m[2]);
  }
  // Tailwind theme names overridden by a calc() in @theme are not tokens any more.
  const overridden = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:\s*calc\(/g)].map((m) => m[1]));
  return { map, overridden };
}

// Line comments first: a "/*" inside a // comment would otherwise swallow real code.
const stripComments = (s) => s.replace(/(^|[^:"'`])\/\/.*$/gm, '$1').replace(/\/\*[\s\S]*?\*\//g, '');

const COLOR_UTIL = /(?<![\w-])(?:[a-z0-9-]+:|\[[^\]]+\]:)*!?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|fill|stroke|divide|from|via|to|decoration|caret|placeholder|accent|shadow)-([a-z][a-z0-9-]*?)(?:\/\d+)?(?![\w-])/g;
const RADIUS_UTIL = /(?<![\w-])(?:[a-z0-9-]+:)*!?rounded(?:-[trblse]{1,2})?-([a-z0-9]+)(?![\w-])/g;
const SHADOW_UTIL = /(?<![\w-])(?:[a-z0-9-]+:)*!?shadow-([a-z0-9]+)(?![\w-])/g;

export function scanUsage() {
  const { byVar, refs } = tokenVars();
  const { map, overridden } = aliases(byVar);
  // A token variable written in code is that token. Other names (shadcn --primary, Tailwind
  // theme names) follow the globals.css aliases until they reach a token.
  const resolve = (v) => {
    const seen = new Set();
    while (!byVar.has(v) && map.has(v) && !seen.has(v)) { seen.add(v); v = map.get(v); }
    return byVar.get(v);
  };
  const utility = (v) => {
    const seen = new Set();
    while (map.has(v) && !seen.has(v)) { seen.add(v); v = map.get(v); }
    return overridden.has(v) ? undefined : byVar.get(v);
  };
  // Using a token also uses the tokens it points to (button/size/… → height/control/…).
  const withRefs = (set) => {
    for (const t of [...set]) { let r = refs.get(t); while (r && !set.has(r)) { set.add(r); r = refs.get(r); } }
    return set;
  };
  const components = {};
  for (const f of fs.readdirSync(metaDir).filter((x) => x.endsWith('.meta.json')).sort()) {
    const meta = JSON.parse(fs.readFileSync(path.join(metaDir, f), 'utf8'));
    const tsx = meta.implementation?.tsxFile;
    const file = tsx && path.join(ui, tsx);
    if (!file || !fs.existsSync(file)) { components[meta.name] = { file: f, missing: tsx ?? '(no tsxFile)' }; continue; }
    const code = stripComments(fs.readFileSync(file, 'utf8'));
    const used = new Set();
    for (const m of code.matchAll(/var\((--[a-z0-9-]+)/g)) { const t = resolve(m[1]); if (t) used.add(t); }
    // Names built at runtime, var(--career-map-${role}): count the tokens under that prefix whose
    // rest is written as a string in the file ("vision-edge" also covers vision-edge-inactive).
    const quoted = new Set([...code.matchAll(/["'`]([a-z][a-z0-9-]*)["'`]/g)].map((m) => m[1]));
    for (const m of code.matchAll(/var\((--[a-z0-9-]+-)\$\{/g)) {
      for (const [v, t] of byVar) {
        if (!v.startsWith(m[1])) continue;
        const rest = v.slice(m[1].length);
        if ([...quoted].some((q) => rest === q || rest.startsWith(`${q}-`))) used.add(t);
      }
    }
    for (const m of code.matchAll(COLOR_UTIL)) { const t = utility(`--color-${m[1]}`); if (t) used.add(t); }
    for (const m of code.matchAll(RADIUS_UTIL)) { const t = utility(`--radius-${m[1]}`); if (t) used.add(t); }
    for (const m of code.matchAll(SHADOW_UTIL)) { const t = utility(`--shadow-${m[1]}`); if (t) used.add(t); }
    const direct = [...used].filter((t) => !t.startsWith('typography/')).sort();
    components[meta.name] = { file: f, direct, tokensUsed: [...withRefs(used)].filter((t) => !t.startsWith('typography/')).sort() };
  }
  const usage = {};
  for (const [name, c] of Object.entries(components)) {
    for (const t of c.tokensUsed ?? []) (usage[t] ??= []).push(name);
  }
  const sortedUsage = Object.fromEntries(Object.keys(usage).sort().map((t) => [t, usage[t].sort()]));
  return { components, usage: sortedUsage, tokenNames: new Set(byVar.values()) };
}

/** Every token name written in a meta.json `tokens` block. */
export function tokensNamedInSpec(meta, tokenNames) {
  const out = new Set();
  const visit = (n) => {
    if (typeof n === 'string') {
      for (const m of n.matchAll(/[a-z][a-z0-9-]*(?:\/[a-z0-9.-]+)+/g)) if (tokenNames.has(m[0])) out.add(m[0]);
    } else if (Array.isArray(n)) n.forEach(visit);
    else if (n && typeof n === 'object') Object.values(n).forEach(visit);
  };
  visit(meta.tokens ?? {});
  return out;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const write = process.argv.includes('--write');
  const { components, usage, tokenNames } = scanUsage();
  let stale = 0, specOnly = 0;
  for (const [name, c] of Object.entries(components)) {
    if (c.missing) { console.log(`  ! ${name}: tsx not found (${c.missing})`); continue; }
    const p = path.join(metaDir, c.file);
    const meta = JSON.parse(fs.readFileSync(p, 'utf8'));
    const same = JSON.stringify(meta.tokensUsed ?? null) === JSON.stringify(c.tokensUsed);
    const extra = [...tokensNamedInSpec(meta, tokenNames)].filter((t) => !c.tokensUsed.includes(t));
    if (extra.length) { specOnly++; console.log(`  ✗ ${name}: spec names ${extra.length} token(s) the code doesn't use: ${extra.join(', ')}`); }
    if (!same) {
      stale++;
      if (write) {
        const next = {};
        for (const [k, v] of Object.entries(meta)) {
          if (k === 'tokensUsed') continue;
          next[k] = v;
          if (k === 'tokens') next.tokensUsed = c.tokensUsed;
        }
        if (!('tokensUsed' in next)) next.tokensUsed = c.tokensUsed;
        fs.writeFileSync(p, JSON.stringify(next, null, 2) + '\n');
      }
    }
  }
  const usageText = JSON.stringify(usage, null, 2) + '\n';
  const usageStale = !fs.existsSync(usagePath) || fs.readFileSync(usagePath, 'utf8') !== usageText;
  if (write && usageStale) fs.writeFileSync(usagePath, usageText);
  console.log(`\n${Object.keys(components).length} components · ${stale} tokensUsed ${write ? 'written' : 'stale'} · token-usage.json ${usageStale ? (write ? 'written' : 'stale') : 'current'} · ${specOnly} spec(s) name tokens the code doesn't use`);
}
