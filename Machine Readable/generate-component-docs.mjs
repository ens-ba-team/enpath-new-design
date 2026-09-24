/**
 * generate-component-docs.mjs — writes Component Markdown (reference)/*.md from meta.json.
 *
 * meta.json is the ONLY source for component docs. Each artifact carries
 * `docs: { file, intro, sections }` — a section is prose `{ title, body }` or `{ title, parts }`
 * where parts mix verbatim `{ md }` with `{ from }` = rendered from a structured field
 * (doNot · variants · constraints · accessibility.properties · accessibility.keys).
 * Never edit the generated markdown — edit the meta.json and re-run.
 *
 * Run:   node "Machine Readable/generate-component-docs.mjs"           (write)
 *        node "Machine Readable/generate-component-docs.mjs" --check   (exit 1 if any file is stale)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'Component Markdown (reference)');
const sources = [
  path.join(root, 'Machine Readable/artifacts/components'),
  path.join(root, 'Machine Readable/artifacts/shared'),
];
const BANNER = (src) => `<!-- GENERATED from ${src} by Machine Readable/generate-component-docs.mjs — edit the JSON, not this file. -->\n\n`;

// Sections that duplicate structured data are rendered FROM that data, so the two can't disagree.
// A section is either { title, body } (prose) or { title, parts: [{ md } | { from }] }.
const code = (v) => '`' + v + '`';
const cell = (v) => String(v).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');
// Token path for every CSS variable, from the token files (the source of names).
const tokenPaths = (() => {
  const map = new Map();
  const walk = (o, p) => { for (const k in o) { if (k.startsWith('$')) continue; const v = o[k]; const q = p ? `${p}/${k}` : k;
    if (v && v.$value !== undefined) map.set('--' + q.toLowerCase().replace(/[\/ .]/g, '-'), q);
    if (v && typeof v === 'object') walk(v, q); } };
  for (const f of ['primitives', 'semantics', 'components']) walk(JSON.parse(fs.readFileSync(path.join(root, `Tokens/${f}.tokens.json`), 'utf8')), '');
  return map;
})();
export function tokensInCode(artifact) {
  const file = artifact.implementation?.tsxFile;
  if (!file) return [];
  const src = fs.readFileSync(path.join(root, 'enpath-ui', file), 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  return [...new Set([...src.matchAll(/var\((--[\w-]+)\)/g)].map((m) => tokenPaths.get(m[1])).filter(Boolean))].sort();
}
export { tokenPaths };

const FROM = {
  doNot: (a) => table(['❌ Wrong', '✅ Correct'], (a.doNot ?? []).map((d) => [d.wrong, d.correct])),
  variants: (a) => table(['Property', 'Options', 'Default'], Object.entries(a.variants ?? {}).map(([k, v]) => [code(k), (v.values ?? []).map(code).join(', '), v.default === undefined || v.default === '' ? '—' : code(v.default)])),
  constraints: (a) => (a.constraints ?? []).map((c) => '- ' + c).join('\n'),
  'accessibility.properties': (a) => table(['Property', 'Value'], (a.accessibility?.properties ?? []).map((r) => [r.property, r.value])),
  'accessibility.keys': (a) => table(['Key', 'Action'], (a.accessibility?.keys ?? []).map((r) => [r.key, r.action])),
};

export function render(artifact, src) {
  const { docs } = artifact;
  const out = [BANNER(src) + docs.intro];
  for (const s of docs.sections) {
    const body = s.parts
      ? s.parts.map((p) => {
          if (p.md !== undefined) return p.md;
          if (!FROM[p.from]) throw new Error(`${src}: unknown generated part "${p.from}"`);
          return FROM[p.from](artifact);
        }).join('\n')
      : s.body;
    const prev = out[out.length - 1];
    if (!prev.endsWith('\n')) out[out.length - 1] = prev + '\n\n---\n\n';
    let full = body;
    if (s.title === 'Token Bindings') {
      const used = tokensInCode(artifact);
      if (used.length) {
        const list = `### All tokens used in code\n\nGenerated from \`${artifact.implementation.tsxFile}\` — always current. The tables above explain each token's role.\n\n${used.map(code).join(' · ')}\n`;
        full = /\n---\s*$/.test(body) ? body.replace(/\n---\s*$/, `\n${list}\n---\n\n`) : `${body.replace(/\s*$/, '')}\n\n${list}\n`;
      }
    }
    out.push(`## ${s.title}\n${full}`);
  }
  return out.join('');
}

export function renderAll() {
  const out = new Map();
  for (const dir of sources) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
      const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!j.docs) continue;
      out.set(j.docs.file, render(j, path.relative(root, path.join(dir, f))));
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-component-docs.mjs')) {
  const check = process.argv.includes('--check');
  const files = renderAll();
  let stale = 0;
  for (const [file, text] of files) {
    const p = path.join(outDir, file);
    const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    if (cur === text) continue;
    stale++;
    if (check) console.log(`  stale: ${file}`);
    else fs.writeFileSync(p, text);
  }
  const extra = fs.readdirSync(outDir).filter((f) => f.endsWith('.md') && !files.has(f));
  for (const f of extra) { stale++; if (check) console.log(`  not generated (no JSON source): ${f}`); }
  console.log(check ? (stale ? `❌ ${stale} component doc(s) out of date` : `✓ ${files.size} component docs match meta.json`) : `✓ wrote ${files.size} component docs (${stale} changed)`);
  if (check && stale) process.exit(1);
}
