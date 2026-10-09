/**
 * The frozen question-makers have not changed, by a single byte.
 *
 *   node scripts/check-frozen-engines.mjs
 *
 * A shared handout opens with the maker it was made with (lib/link-engines.ts,
 * docs/link-versions.md). Version 1's is `lib/generator-v1/`, the generator
 * exactly as it was live at website 767a87c, so a link made before 2026-10-09
 * opens exactly what the teacher shared. That holds only while the copy is
 * untouched, and an edit to it would break nothing visible: the link would
 * still open, with a different question. So it is checked here, in every build.
 *
 * `scripts/frozen-engines.json` lists every file of each copy with its git blob
 * id, taken from `git ls-tree <commit> lib/generator` and never from the copy
 * itself, so anyone can re-derive it from history. Each file is hashed the way
 * git hashes a blob, after reading CRLF as LF (a Windows checkout with
 * core.autocrlf writes CRLF; the deployed build reads LF). A file missing, a
 * file added and a file changed are all failures.
 *
 * Finding no files is a failure too, not a pass: a check that looks at nothing
 * and reports green is the failure this repo keeps being bitten by.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const manifestPath = path.join(root, 'scripts', 'frozen-engines.json');
if (!fs.existsSync(manifestPath)) {
  console.error('\n  no scripts/frozen-engines.json. Nothing was checked.\n');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const blobId = buf => {
  const text = Buffer.from(buf.toString('binary').replace(/\r\n/g, '\n'), 'binary');
  return createHash('sha1').update(`blob ${text.length}\0`).update(text).digest('hex');
};
const walk = (dir, base = dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
};

let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

console.log('\nfrozen question-makers:');
for (const [version, copy] of Object.entries(manifest.versions ?? {})) {
  const dir = path.join(root, copy.dir);
  const want = copy.files ?? {};
  const wanted = Object.keys(want);
  if (!wanted.length) { fail(`version ${version}: the manifest lists no files`); continue; }
  if (!fs.existsSync(dir)) { fail(`version ${version}: ${copy.dir} is missing`); continue; }
  const have = new Set(walk(dir));
  const before = failures;
  for (const f of wanted) {
    if (!have.has(f)) { fail(`version ${version}: ${copy.dir}/${f} is missing`); continue; }
    if (blobId(fs.readFileSync(path.join(dir, f))) !== want[f]) fail(`version ${version}: ${copy.dir}/${f} has changed`);
  }
  for (const f of have) if (!(f in want)) fail(`version ${version}: ${copy.dir}/${f} was added`);
  if (failures === before) console.log(`  ok  version ${version}: all ${wanted.length} files of ${copy.dir} exactly as at ${copy.from}`);
}
if (!Object.keys(manifest.versions ?? {}).length) fail('the manifest lists no versions');

if (failures) {
  console.log(`\nfrozen question-maker check FAILED (${failures}).`
    + '\nA frozen copy is never edited: old links would open different questions.'
    + '\nPut the file back (git checkout -- <file>); adapt in lib/generated-question-v<n>.ts instead.\n');
  process.exit(1);
}
console.log('');
