/**
 * drift-check.mjs — detect docs/token drift across the design system.
 *
 * Run:  node "Machine Readable/drift-check.mjs"
 *
 * Checks (drift = a doc restates a fact owned authoritatively elsewhere):
 *   1. llms.txt — every referenced file path resolves
 *   2. Component count — doc claims ("N components") match actual meta.json count
 *   3. No hex values in docs or meta.json — colour values live only in Tokens/*.tokens.json
 *   4. Control heights — controls use height tokens (no literal h-*), each pointer height paired with its touch rung
 *   5. Storybook stories — every story file has a matching meta.json (catches undocumented components)
 *
 *   6. Docs — every restated px value matches the token it names
 *   7. No retired tooling — Figma, dark mode, non-Phosphor icons, Inter, R1–R8 audits, deleted files
 *   8. Component specs — every meta.json `docs` section is well-formed (meta.json is the only component spec)
 *   9. Component specs — every token named in a meta.json exists (component-token families included;
 *      meta.changelog is history and skipped)
 *  10. Component directory + quick reference — each entry starts with its meta.json description
 *
 * Exit code 1 if any drift is found (so CI can gate on it).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');               // repo root (parent of "Machine Readable")
let problems = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { console.log('  ✗ ' + m); problems++; };
const section = (t) => console.log('\n' + t);

// ── 1. llms.txt referenced paths resolve ─────────────────────────────────────
section('1. llms.txt — referenced paths exist');
const llms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
const ticks = [...llms.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
// Only check directory paths (contain "/") with a file extension or trailing slash —
// these are the drift-prone references (folder renames/deletions). Bare filenames and
// story titles are skipped.
const looksLikePath = (s) => s.includes('/') && (/\.(md|json|tsx?|css|mjs|txt|html)$/.test(s) || /\/$/.test(s));
const skipIt = (s) =>
  /[\[\]*<>]/.test(s) || s.includes('...') || /^https?:/.test(s) ||
  /^(Screens|UI Template)\//.test(s);   // story titles + the external (out-of-repo) UI Template catalog
const paths = [...new Set(ticks.filter((s) => looksLikePath(s) && !skipIt(s)))];
let miss = 0;
for (const p of paths) if (!fs.existsSync(path.join(root, p))) { bad(`dead path: ${p}`); miss++; }
if (miss === 0) ok(`${paths.length} referenced paths all resolve`);

// ── 2. Component count: doc claims vs meta.json files ────────────────────────
section('2. Component count — docs vs meta.json files');
const metaDir = path.join(root, 'Machine Readable/artifacts/components');
const metaCount = fs.readdirSync(metaDir).filter((f) => f.endsWith('.meta.json')).length;
// Require plural "components" so "44 component tokens" doesn't match as a component count.
const claims = [...new Set([...llms.matchAll(/(\d+)\s+(?:documented\s+)?components\b/gi)].map((m) => +m[1]))];
const wrong = claims.filter((c) => c !== metaCount);
if (wrong.length === 0) ok(`meta.json count ${metaCount} matches doc claim(s): ${claims.join(', ') || 'none'}`);
else bad(`meta.json count is ${metaCount} but docs claim: ${wrong.join(', ')}`);

// ── 3. No hex values in documents ────────────────────────────────────────────
// Colour values live ONLY in Tokens/*.tokens.json. A hex restated in a doc or
// meta.json is a snapshot that goes stale on the next re-theme. Name the token.
section('3. No hex values in docs or meta.json (values live in Tokens/ only)');
{
  // Deliberate anti-examples ("never do this") are allowed.
  const allow = [/❌[^\n]*#3B82F6/, /"fill": "#F4F4F5"/];
  const skipDirs = new Set(['node_modules', 'Tokens', 'enpath-ui', 'composition']);
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!skipDirs.has(e.name)) walk(path.join(d, e.name)); continue; }
      if (/\.(md|json|txt)$/.test(e.name)) files.push(path.join(d, e.name));
    }
  };
  walk(root);
  let hits = 0;
  for (const f of files) {
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (!/#[0-9a-fA-F]{6}\b/.test(line) || allow.some((re) => re.test(line))) return;
      bad(`${path.relative(root, f)}:${i + 1} restates a hex — name the token instead`); hits++;
    });
  }
  if (hits === 0) ok(`${files.length} docs checked — no hex values outside Tokens/`);
}

// ── 4. Control heights come from tokens, never hardcoded ─────────────────────
// En UI rule: every control height is a token (height/control/*). A literal
// h-8 / h-[32px] / min-h-9 on a control silently drifts when the scale changes.
section('4. Control heights — no hardcoded heights on controls');
{
  const controls = ['button', 'input', 'textarea', 'select', 'combobox', 'date-picker'];
  // Control range only: h-6…h-11 (24–44px) or h-[24px]…h-[44px], incl. min-h-. Icon sizes
  // (h-3…h-5), max-h- panel limits and content heights (textarea min-h-[120px]) are out of scope.
  const heightRe = /(?<![\w-])(?:min-)?h-(?:(?:6|7|8|9|10|11)|\[(?:2[4-9]|3\d|4[0-4])px\])(?![\w.-])/g;
  let hits = 0;
  for (const c of controls) {
    const f = path.join(root, 'enpath-ui/src/components/ui', c + '.tsx');
    if (!fs.existsSync(f)) continue;
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (/^\s*\/\//.test(line)) return; // comments
      for (const m of line.matchAll(heightRe)) { bad(`${c}.tsx:${i + 1} hardcoded "${m[0]}" — use h-[var(--height-control-*)]`); hits++; }
      // Touch/pointer pair: a pointer height must be sm:-prefixed and sit next to its touch rung.
      for (const m of line.matchAll(/(\S*?)((?:min-)?[hw])-\[var\(--height-control-(xs|sm|md|lg)\)\]/g)) {
        const [, prefix, prop, size] = m;
        const touch = `${prop}-[var(--height-control-touch-${size})]`;
        if (!prefix.endsWith('sm:')) { bad(`${c}.tsx:${i + 1} "${m[0]}" must be sm:-prefixed with ${touch} before it`); hits++; }
        else if (!line.includes(touch)) { bad(`${c}.tsx:${i + 1} "${m[0]}" has no touch rung ${touch}`); hits++; }
      }
    });
  }
  if (hits === 0) ok(`${controls.length} control components use height tokens, each with its touch rung`);
}

// ── 5. Storybook stories ↔ meta.json (catch undocumented components) ──────────
section('5. Storybook stories — every story is owned by a meta.json');
const storiesDir = path.join(root, 'enpath-ui/src/stories');
// Authoritative link: each meta.json declares the story file it owns via storybook.file.
// Match on that (by basename) rather than guessing from filenames — a meta named
// a meta named e.g. radio-group.meta.json legitimately owns RadioGroup.stories.tsx.
const ownedStories = new Set();
for (const f of fs.readdirSync(metaDir).filter((f) => f.endsWith('.meta.json'))) {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(metaDir, f), 'utf8'));
    const file = meta?.storybook?.file;
    if (file) ownedStories.add(path.basename(file));
  } catch { bad(`meta.json unreadable: ${f}`); }
}
// Top-level only — screens/ live in a subfolder and are prototypes, not components.
const storyFiles = fs.existsSync(storiesDir)
  ? fs.readdirSync(storiesDir).filter((f) => f.endsWith('.stories.tsx'))
  : [];
let undoc = 0;
for (const f of storyFiles) {
  if (!ownedStories.has(f)) { bad(`story "${f}" is not owned by any meta.json — undocumented component`); undoc++; }
}
if (undoc === 0) ok(`all ${storyFiles.length} story files are owned by a meta.json`);

// ── 6. Restated px values match the token they name ──────────────────────────
// Docs name a token and restate its value as a convenience:
//   padding: spacing/component/lg (16px)   ·   | `radius/lg` | 8px |
// The name stays correct forever; the number is a hand-typed snapshot that goes
// stale the instant a primitive changes — which is exactly what a re-theme does.
// `sync-doc-values.mjs --write` rewrites them from Tokens/*.json; this check is the
// gate that proves it was run.
section('6. Docs — restated px values match the token they name');
{
  const flatT = {};
  for (const f of ['primitives.tokens.json', 'semantics.tokens.json']) {
    const p = path.join(root, 'Tokens', f);
    if (!fs.existsSync(p)) continue;
    (function walk(n, trail = []) {
      for (const [k, v] of Object.entries(n)) {
        if (v && v.$value !== undefined) flatT[trail.concat(k).join('/')] = String(v.$value);
        else if (v && typeof v === 'object') walk(v, trail.concat(k));
      }
    })(JSON.parse(fs.readFileSync(p, 'utf8')));
  }
  const resolveT = (name) => {
    let v = flatT[name], g = 0;
    while (v && /^\{.*\}$/.test(v) && g++ < 10) v = flatT[v.replace(/[{}]/g, '').replace(/\./g, '/')];
    const m = v === undefined ? null : String(v).match(/^(\d+(?:\.\d+)?)(px)?$/);
    return m ? m[1] : null;
  };
  const dirs = ['Skills', 'Machine Readable', 'Tracking'];
  const loose = ['enpath-design-system.md', 'content-guidelines.md', 'Hypertokens - System Bundles.md'];
  const docs = [];
  for (const d of dirs) {
    const dp = path.join(root, d);
    if (fs.existsSync(dp)) for (const f of fs.readdirSync(dp)) if (f.endsWith('.md')) docs.push(path.join(d, f));
  }
  for (const f of loose) if (fs.existsSync(path.join(root, f))) docs.push(f);

  const re = /((?:radius|spacing|font-size)\/[a-z0-9/-]+)`?\s*[(|]\s*(\d+)px/gi;
  let seen = 0, stale = 0;
  for (const rel of docs) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    for (const m of text.matchAll(re)) {
      const actual = resolveT(m[1]);
      if (actual === null) continue;
      seen++;
      if (actual !== m[2]) { bad(`${rel}: "${m[1]}" written as ${m[2]}px but the token is ${actual}px`); stale++; }
    }
  }
  // Component specs live in meta.json — scan their text fields.
  for (const d of ['Machine Readable/artifacts/components', 'Machine Readable/artifacts/shared']) {
    const dp = path.join(root, d);
    if (!fs.existsSync(dp)) continue;
    for (const f of fs.readdirSync(dp).filter((x) => x.endsWith('.json'))) {
      const strings = [];
      const collect = (o) => { if (typeof o === 'string') strings.push(o); else if (o && typeof o === 'object') Object.values(o).forEach(collect); };
      const j = JSON.parse(fs.readFileSync(path.join(dp, f), 'utf8'));
      // Same fields sync-doc-values.mjs maintains — not meta.changelog, which records past values.
      for (const k of ['docs', 'doNot', 'constraints', 'accessibility']) collect(j[k]);
      for (const text of strings) for (const m of text.matchAll(re)) {
        const actual = resolveT(m[1]);
        if (actual === null) continue;
        seen++;
        if (actual !== m[2]) { bad(`${d}/${f}: "${m[1]}" written as ${m[2]}px but the token is ${actual}px`); stale++; }
      }
    }
  }
  if (stale === 0) ok(`${seen} restated px values all match their token`);
  else console.log('     → fix with: node "Machine Readable/sync-doc-values.mjs" --write');
}


// ── 7. Retired tooling and old-system leftovers ─────────────────────────────
// Enpath has no Figma, no dark mode and one icon library (Phosphor). Any doc,
// meta.json or token description that brings these back is drift. Deliberate
// statements of the decision ("No Figma", "Light mode only") are allowed.
section('7. No retired tooling — Figma, dark mode, other icon libraries, Inter, old audits');
{
  const banned = [
    [/figma/i, 'Figma (not used)'],
    [/dark[ -]mode|\.dark\b|darkMode|dark:/i, 'dark mode (light only)'],
    [/lucide|untitled ?ui|@untitledui|heroicons|react-icons|@tabler|tabler icons/i, 'icon library other than Phosphor'],
    [/\bInter\b(?! alia)/, 'Inter font (Nunito)'],
    [/R1[–-]R8/, 'Figma audit rules R1–R8 (retired)'],
    [/enpath-theme\.md|figma-ids|Audit Status\.md|AI[- ]Readiness/i, 'deleted file'],
  ];
  const allow = /No Figma|no Figma|\| Figma \| Not used|Figma workflow, dark mode|lucide-react (?:was )?removed|lucide-react removed|\| Dark mode \| Not supported|no dark-mode|Light mode only|light mode only|no `dark:`/;
  const skipDirs = new Set(['node_modules', 'output', 'enpath-ui', 'composition']);
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!skipDirs.has(e.name)) walk(path.join(d, e.name)); continue; }
      if (/\.(md|json|txt)$/.test(e.name) && !/^package(-lock)?\.json$/.test(e.name) && e.name !== 'CHANGELOG.md' /* records removals */) files.push(path.join(d, e.name));
    }
  };
  walk(root);
  // Code: only Phosphor may be imported as an icon library.
  const codeDir = path.join(root, 'enpath-ui/src');
  const code = [];
  const walkCode = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walkCode(f); else if (/\.(tsx?|css)$/.test(e.name)) code.push(f); } };
  walkCode(codeDir);
  let hits = 0;
  for (const f of files) {
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (allow.test(line)) return;
      for (const [re, what] of banned) if (re.test(line)) { bad(`${path.relative(root, f)}:${i + 1} mentions ${what}`); hits++; break; }
    });
  }
  for (const f of code) {
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (/from ['"](lucide-react|@untitledui\/icons|react-icons|@heroicons|@tabler)/.test(line)) { bad(`${path.relative(root, f)}:${i + 1} imports a non-Phosphor icon library`); hits++; }
      if (/(^|["'\s])dark:/.test(line)) { bad(`${path.relative(root, f)}:${i + 1} uses a dark: variant (light mode only)`); hits++; }
    });
  }
  if (hits === 0) ok(`${files.length} docs + ${code.length} code files — no retired tooling`);
}


// ── 8. Component specs are well-formed ──────────────────────────────────────
// meta.json is the only component spec (no generated Markdown). A docs section is prose
// { title, body } or { title, parts: [{ md } | { from }] }, where `from` names a structured field.
section('8. Component specs — every meta.json docs section is well-formed');
{
  const FROM = new Set(['doNot', 'variants', 'constraints', 'accessibility.properties', 'accessibility.keys']);
  let bads = 0, n = 0;
  for (const d of ['Machine Readable/artifacts/components', 'Machine Readable/artifacts/shared']) {
    const dp = path.join(root, d);
    if (!fs.existsSync(dp)) continue;
    for (const f of fs.readdirSync(dp).filter((x) => x.endsWith('.json'))) {
      const j = JSON.parse(fs.readFileSync(path.join(dp, f), 'utf8'));
      if (!j.docs) { if (d.endsWith('components')) { bad(`${f}: no docs — every component needs its spec in meta.json`); bads++; } continue; }
      n++;
      if (typeof j.docs.intro !== 'string') { bad(`${f}: docs.intro missing`); bads++; }
      for (const sec of j.docs.sections ?? []) {
        if (!sec.title) { bad(`${f}: a docs section has no title`); bads++; }
        if (sec.body === undefined && !Array.isArray(sec.parts)) { bad(`${f}: section "${sec.title}" has neither body nor parts`); bads++; }
        for (const p of sec.parts ?? []) if (p.md === undefined && !FROM.has(p.from)) { bad(`${f}: section "${sec.title}" part names unknown field "${p.from}"`); bads++; }
      }
    }
  }
  if (bads === 0) ok(`${n} component specs well-formed`);
}


// ── 9. Every token named in a component doc exists ──────────────────────────
// Renamed or deleted tokens left behind in meta.json (tokens, docs, doNot, constraints).
section('9. Component specs — every token named in a meta.json exists');
{
  const known = new Set();
  for (const tf of ['primitives', 'semantics', 'components']) {
    (function walk(o, p) { for (const k in o) { if (k.startsWith('$')) continue; const v = o[k]; const q = p ? `${p}/${k}` : k;
      if (v && v.$value !== undefined) known.add(q); if (v && typeof v === 'object') walk(v, q); } })(JSON.parse(fs.readFileSync(path.join(root, `Tokens/${tf}.tokens.json`), 'utf8')), '');
  }
  const knownLower = new Set([...known].map((k) => k.toLowerCase()));
  // Families: the semantic ones plus every component-token collection (career-map/, chat/, …), so a
  // removed component token left in a spec is caught too.
  const componentFamilies = Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'Tokens/components.tokens.json'), 'utf8'))).filter((k) => !k.startsWith('$'));
  const families = ['color', 'spacing', 'radius', 'shadow', 'height', 'opacity', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'z-index', 'motion', 'button', 'badge', 'table', 'tooltip', ...componentFamilies];
  const RE = new RegExp(`\\b(?:${[...new Set(families)].map((f) => f.replace(/[-/]/g, '\\$&')).join('|')})\\/[a-z0-9][a-z0-9\\/-]*[a-z0-9]`, 'g');
  const prefixOk = (t) => [...knownLower].some((k) => k.startsWith(t.toLowerCase() + '/'));
  const dir = path.join(root, 'Machine Readable/artifacts/components');
  let bads = 0, seen = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    // Structured fields: every match counts. Prose in `docs`: only names written as code (`token/name`).
    // meta.changelog is history — it may name tokens that were removed since.
    const { docs, ...structured } = j;
    if (structured.meta) structured.meta = { ...structured.meta, changelog: undefined };
    const strings = [];
    const collect = (o) => { if (typeof o === 'string') strings.push(o); else if (o && typeof o === 'object') Object.values(o).forEach(collect); };
    collect(docs ?? {});
    const names = [...(JSON.stringify(structured).match(RE) || []),
      ...strings.flatMap((str) => [...str.matchAll(/`([^`\n]+)`/g)].flatMap((m) => m[1].match(RE) || []))];
    for (const t of new Set(names)) {
      seen++;
      if (knownLower.has(t.toLowerCase()) || prefixOk(t)) continue;
      bad(`${f}: names "${t}" — no such token`); bads++;
    }
  }
  if (bads === 0) ok(`${seen} token names in component docs all exist`);
}

// ── 10. Directory + quick reference agree with meta.json ───────────────────
// Both files are maintained by hand from each meta.json. A row or "What it's for" line must be the
// start of that component's meta.json description, so a changed description can't leave them stale.
section('10. Component directory + quick reference match meta.json descriptions');
{
  const mr = path.join(root, 'Machine Readable');
  const directory = fs.readFileSync(path.join(mr, 'component-directory.md'), 'utf8');
  const quickRef = fs.readFileSync(path.join(mr, 'component-quick-reference.md'), 'utf8');
  const norm = (t) => t.trim().replace(/\s+/g, ' ');
  // Quick-reference entries: "### `name`" … "**What it's for:** …" … "→ Artifact: `…/x.meta.json`".
  const qr = new Map();
  for (const entry of quickRef.split(/^### /m).slice(1)) {
    const art = entry.match(/artifacts\/components\/([a-z0-9-]+)\.meta\.json/);
    const what = entry.match(/\*\*What it.s for:\*\* (.*)/);
    if (art && what) qr.set(art[1], what[1]);
  }
  let bads = 0, n = 0;
  const dir = path.join(mr, 'artifacts/components');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.meta.json'))) {
    const name = f.replace('.meta.json', '');
    const desc = norm(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).description ?? '');
    n++;
    const row = directory.split('\n').find((l) => l.startsWith(`| ${name} |`));
    if (!row) { bad(`component-directory.md: no row for ${name}`); bads++; }
    else if (!desc.startsWith(norm(row.split('|')[2]))) { bad(`component-directory.md: ${name} description differs from its meta.json`); bads++; }
    const what = qr.get(name);
    if (what === undefined) { bad(`component-quick-reference.md: no entry linking ${f}`); bads++; }
    else if (!desc.startsWith(norm(what))) { bad(`component-quick-reference.md: ${name} "What it's for" differs from its meta.json`); bads++; }
  }
  if (bads === 0) ok(`${n} components — directory rows and quick-reference entries match meta.json`);
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + (problems === 0 ? '✅ No drift detected.' : `❌ ${problems} drift issue(s) found.`));
process.exit(problems === 0 ? 0 : 1);
