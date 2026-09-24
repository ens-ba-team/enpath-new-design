/**
 * sync-doc-values.mjs — make restated px values in the docs derived, not authored.
 *
 * Component specs name a token and then restate its value as a convenience:
 *
 *     padding (all sides): spacing/component/lg (16px)
 *     | Radius | `radius/lg` | 8px |
 *
 * The token name is correct forever. The number in brackets is a hand-typed snapshot
 * that goes stale the moment a primitive changes — and a re-theme changes primitives
 * by definition, so one edit can invalidate every restatement in the system at once.
 * That is the single largest source of doc drift during a re-skin.
 *
 * This script rewrites those numbers from Tokens/*.json so they stop being something
 * anyone maintains. It edits the existing specs in place; it creates no documents and
 * deletes nothing.
 *
 * Run:
 *   node "Machine Readable/sync-doc-values.mjs"           # dry run — shows what would change
 *   node "Machine Readable/sync-doc-values.mjs" --write   # apply
 *
 * Run it after ANY token value change, before committing. `drift-check.mjs` then
 * verifies the result, so the two together make this class of drift structurally
 * impossible rather than merely detectable.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const WRITE = process.argv.includes('--write');

// ── Build the token lookup ───────────────────────────────────────────────────
// Primitives hold raw values; semantics alias them ({spacing.4}). Resolve through.

const flat = {};
for (const file of ['primitives.tokens.json', 'semantics.tokens.json']) {
  const p = path.join(root, 'Tokens', file);
  if (!fs.existsSync(p)) continue;
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  (function walk(node, trail = []) {
    for (const [k, v] of Object.entries(node)) {
      if (v && v.$value !== undefined) flat[trail.concat(k).join('/')] = String(v.$value);
      else if (v && typeof v === 'object') walk(v, trail.concat(k));
    }
  })(json);
}

/** Resolve a token name to its numeric px value, following {alias.chains}. */
function resolve(name) {
  let v = flat[name];
  let guard = 0;
  while (v && /^\{.*\}$/.test(v) && guard++ < 10) {
    v = flat[v.replace(/[{}]/g, '').replace(/\./g, '/')];
  }
  if (v === undefined) return null;
  const m = String(v).match(/^(\d+(?:\.\d+)?)(px)?$/);
  return m ? m[1] : null;
}

// ── The two restatement shapes ───────────────────────────────────────────────
// Only dimensional tokens. Colours are already named-only in these specs.

const GROUPS = '(?:radius|spacing|font-size)';
const PATTERNS = [
  // spacing/component/lg (16px)   ·   `radius/lg` (8px)
  { name: 'parenthetical', re: new RegExp(`(${GROUPS}\\/[a-z0-9\\/-]+\`?\\s*\\()(\\d+)(px\\))`, 'gi') },
  // | `radius/lg` | 8px |
  { name: 'table cell',    re: new RegExp(`(\\|\\s*\`${GROUPS}\\/[a-z0-9\\/-]+\`\\s*\\|\\s*)(\\d+)(px\\s*\\|)`, 'gi') },
];

/** Pull the token name back out of a matched fragment. */
const tokenIn = (s) => (s.match(new RegExp(`${GROUPS}\\/[a-z0-9\\/-]+`, 'i')) || [])[0];

// ── Sweep the specs ──────────────────────────────────────────────────────────

// Every doc that restates a dimensional token, not just the component specs — the
// ruleset, the skills and the tracking files carry the same liability. Tokens/ is not
// scanned: it is where the values live.
// Component docs are generated from meta.json, so they are corrected at the source (the JSON
// `docs` strings below) and regenerated — never in the generated markdown.
const SCAN_DIRS = ['Skills', 'Machine Readable', 'Tracking'];
const SCAN_FILES = ['enpath-design-system.md', 'content-guidelines.md', 'Hypertokens - System Bundles.md'];

const files = [];
for (const d of SCAN_DIRS) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.md')) files.push(path.join(d, f));
}
for (const f of SCAN_FILES) if (fs.existsSync(path.join(root, f))) files.push(f);

let checked = 0, corrected = 0, unknown = 0, filesTouched = 0;
const changes = [];

for (const file of files) {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, 'utf8');
  let after = before;

  for (const { re } of PATTERNS) {
    after = after.replace(re, (match, head, written, tail) => {
      const token = tokenIn(head);
      const actual = resolve(token);
      if (actual === null) { unknown++; return match; }   // not a token we own — leave alone
      checked++;
      if (actual === written) return match;
      corrected++;
      changes.push(`  ${file}: ${token}  ${written}px → ${actual}px`);
      return head + actual + tail;
    });
  }

  if (after !== before) {
    filesTouched++;
    if (WRITE) fs.writeFileSync(full, after);
  }
}

// ── Component docs: correct the source strings in meta.json, then regenerate ──
const fixText = (file, text) => {
  let out = text;
  for (const { re } of PATTERNS) {
    out = out.replace(re, (match, head, written, tail) => {
      const token = tokenIn(head);
      const actual = resolve(token);
      if (actual === null) { unknown++; return match; }
      checked++;
      if (actual === written) return match;
      corrected++;
      changes.push(`  ${file}: ${token}  ${written}px → ${actual}px`);
      return head + actual + tail;
    });
  }
  return out;
};
let docsChanged = false;
for (const d of ['Machine Readable/artifacts/components', 'Machine Readable/artifacts/shared']) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const full = path.join(dir, f);
    const j = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (!j.docs) continue;
    const label = `${d}/${f}`;
    const before = JSON.stringify([j.docs, j.doNot, j.constraints, j.accessibility]);
    j.docs.intro = fixText(label, j.docs.intro);
    for (const sec of j.docs.sections) {
      if (sec.body !== undefined) sec.body = fixText(label, sec.body);
      for (const part of sec.parts ?? []) if (part.md !== undefined) part.md = fixText(label, part.md);
    }
    // Structured fields that render into the docs carry text too.
    const fixDeep = (o) => { if (Array.isArray(o)) return o.map(fixDeep); if (o && typeof o === 'object') { for (const k of Object.keys(o)) o[k] = fixDeep(o[k]); return o; } return typeof o === 'string' ? fixText(label, o) : o; };
    for (const k of ['doNot', 'constraints', 'accessibility']) if (j[k]) j[k] = fixDeep(j[k]);
    if (JSON.stringify([j.docs, j.doNot, j.constraints, j.accessibility]) !== before) {
      filesTouched++; docsChanged = true;
      if (WRITE) fs.writeFileSync(full, JSON.stringify(j, null, 2) + '\n');
    }
  }
}
if (WRITE && docsChanged) {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, [path.join(root, 'Machine Readable/generate-component-docs.mjs')], { stdio: 'inherit' });
}

// ── Report ───────────────────────────────────────────────────────────────────

console.log(`${WRITE ? 'APPLIED' : 'DRY RUN — nothing written'}\n`);
console.log(`  restatements found and verified : ${checked}`);
console.log(`  already correct                 : ${checked - corrected}`);
console.log(`  ${WRITE ? 'corrected' : 'would correct'}                      : ${corrected}`);
if (unknown) console.log(`  skipped (no such token)         : ${unknown}`);
console.log(`  files ${WRITE ? 'written' : 'affected'}                  : ${filesTouched}`);
if (changes.length) console.log('\n' + changes.join('\n'));
if (!WRITE && corrected) console.log('\nRe-run with --write to apply.');

process.exit(0);
