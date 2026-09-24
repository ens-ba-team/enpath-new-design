/**
 * patch-style-dictionary.mjs — runs on `npm install` (postinstall).
 *
 * Our tokens use DTCG "mixed nodes": a token that is also a group, e.g.
 * color/brand/primary ($value) + color/brand/primary/foreground (child token).
 * Style Dictionary 5 ignores the children, so every /foreground reference breaks.
 * This re-applies a small patch to flattenTokens.js so children are flattened too.
 * Idempotent — safe to run repeatedly. Inherited from Agentic, where the same
 * patch had been hand-edited into node_modules and was lost on reinstall.
 */
import fs from 'node:fs';

const file = new URL('./node_modules/style-dictionary/lib/utils/flattenTokens.js', import.meta.url);
const MARK = '// PATCH: recurse into non-$-prefixed children';
let src = fs.readFileSync(file, 'utf8');

if (src.includes(MARK)) {
  console.log('style-dictionary already patched');
  process.exit(0);
}

const lines = src.split('\n');
// Insert right after the multi-line `result.push({ ... });` in the "is token" branch.
const pushAt = lines.findIndex((l) => /result\.push\(\{/.test(l));
const pushIndent = pushAt === -1 ? '' : lines[pushAt].match(/^\s*/)[0];
const idx = pushAt === -1 ? -1 : lines.findIndex((l, i) => i > pushAt && l === `${pushIndent}});`);
if (idx === -1) {
  console.error('patch-style-dictionary: anchor not found — Style Dictionary changed, update this patch');
  process.exit(1);
}
const indent = lines[idx].match(/^\s*/)[0];
lines.splice(idx + 1, 0,
  `${indent}${MARK} to support DTCG mixed nodes`,
  `${indent}const mixedChildren = {};`,
  `${indent}for (const [ck, cv] of Object.entries(slice[key])) {`,
  `${indent}  if (!ck.startsWith('$') && isPlainObject(cv)) mixedChildren[ck] = cv;`,
  `${indent}}`,
  `${indent}if (Object.keys(mixedChildren).length > 0) {`,
  `${indent}  _flattenTokens(mixedChildren, usesDtcg, result, keyMemo.concat(key));`,
  `${indent}}`,
);
fs.writeFileSync(file, lines.join('\n'));
console.log('style-dictionary patched');
