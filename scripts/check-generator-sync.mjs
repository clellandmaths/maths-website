/**
 * `lib/generator/` is a copy. This proves it is an honest one.
 *
 *   node scripts/check-generator-sync.mjs
 *
 * Two questions, and they are not the same question:
 *
 *   1. **Has the copy been edited here?** Every file is checked against the
 *      hash the sync recorded. This runs everywhere, including on Cloudflare,
 *      and it is the one that matters most — a fix made in `lib/generator/`
 *      instead of in the generator repo would work, ship, and then vanish at
 *      the next sync with nobody the wiser.
 *
 *   2. **Has the generator moved on?** Only answerable where the generator is
 *      actually checked out. `worksheet_generator/` is gitignored here, so on
 *      a build machine there is nothing to compare against.
 *
 * **A check that cannot run must say so, loudly.** This repo has been caught
 * by that before: `reference/` is gitignored too, and nine generator checks
 * quietly reported "nothing to check" rather than failing. So question 2
 * prints what it did and why, every time, rather than passing in silence.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { collect, sha, key } from './sync-generator.mjs';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'worksheet_generator', 'src', 'lib');
const DEST = join(ROOT, 'lib', 'generator');
const MANIFEST = join(DEST, 'sync-manifest.json');

const problems = [];

// ── 1. the copy is what the sync wrote ────────────────────────────────────
if (!existsSync(MANIFEST)) {
  console.error('\n  no lib/generator/sync-manifest.json — run: node scripts/sync-generator.mjs\n');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const recorded = Object.keys(manifest.files ?? {});
if (!recorded.length) {
  console.error('\n  the manifest lists no files — run: node scripts/sync-generator.mjs\n');
  process.exit(1);
}

for (const rel of recorded) {
  const path = join(DEST, ...rel.split('/'));
  if (!existsSync(path)) {
    problems.push(`MISSING   lib/generator/${rel}`);
    continue;
  }
  if (sha(readFileSync(path)) !== manifest.files[rel]) {
    problems.push(`EDITED    lib/generator/${rel} — change it in the generator repo, then re-sync`);
  }
}

// and nothing extra, which a partial hand-copy would leave behind
const present = collect(DEST).map(key).filter(r => r !== 'sync-manifest.json');
for (const rel of present) {
  if (!(rel in (manifest.files ?? {}))) problems.push(`UNLISTED  lib/generator/${rel} — not from a sync`);
}

console.log(`\n  ${recorded.length} files checked against the manifest`
  + ` (generator commit ${String(manifest.sourceCommit ?? '?').slice(0, 7)})`);

// ── 2. the copy is current, where that can be answered ────────────────────
if (!existsSync(SRC)) {
  console.log('  the generator is not checked out here, so drift against it was NOT checked');
  console.log('  — that question is answerable only where worksheet_generator/ exists');
} else {
  const source = collect(SRC).map(key);
  const inSource = new Set(source);
  let drifted = 0;
  for (const rel of source) {
    const here = join(DEST, ...rel.split('/'));
    if (!existsSync(here)) { problems.push(`NOT COPIED  ${rel} — re-sync`); drifted++; continue; }
    if (sha(readFileSync(join(SRC, ...rel.split('/')))) !== sha(readFileSync(here))) {
      problems.push(`STALE     ${rel} — the generator has moved on. Re-sync`);
      drifted++;
    }
  }
  for (const rel of present) {
    if (!inSource.has(rel)) problems.push(`DELETED   ${rel} — gone from the generator. Re-sync`);
  }
  console.log(`  ${source.length} files compared against the generator itself, ${drifted} stale`);
}

if (problems.length) {
  console.log('');
  for (const p of problems.slice(0, 25)) console.log(`  ${p}`);
  if (problems.length > 25) console.log(`  ... and ${problems.length - 25} more`);
  console.log('\n  lib/generator/ is a copy — edit the generator repo and run'
    + ' node scripts/sync-generator.mjs\n');
  process.exit(1);
}

console.log('\n  the checked-in engine is an unedited, current copy of the generator\n');
