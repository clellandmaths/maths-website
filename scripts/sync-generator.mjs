/**
 * Copy the worksheet generator's engine into `lib/generator/`.
 *
 * `worksheet_generator/` is gitignored here — it is its own repository — so
 * Cloudflare Pages never sees it. The engine has to be checked in to build,
 * and Tailwind v4 skips gitignored files when it scans for classes, so a
 * figure's classes would be purged if the engine stayed where it is.
 *
 * The generator repo stays the single source. This makes a copy, and
 * `check-generator-sync.mjs` proves the copy is current.
 *
 *   node scripts/sync-generator.mjs
 *
 * What is copied: `src/lib/**\/*.ts`, minus `__checks__/`. Verified before
 * writing this: that subtree has no node built-ins, no React, and no import
 * that leaves it — 88 files that run in a browser as they are.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'worksheet_generator', 'src', 'lib');
const DEST = join(ROOT, 'lib', 'generator');
const MANIFEST = join(DEST, 'sync-manifest.json');

/** The checks stay behind: they read `reference/`, use node, and never ship. */
const skip = (rel) => rel.split(sep).includes('__checks__');

/** `.mts` is a script, not a module the site imports. */
const wanted = (name) => name.endsWith('.ts') && !name.endsWith('.mts');

export function collect(dir, base = dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    const rel = relative(base, full);
    if (skip(rel)) continue;
    if (statSync(full).isDirectory()) collect(full, base, out);
    else if (wanted(name)) out.push(rel);
  }
  return out;
}

export const sha = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 16);

/** Posix separators, so the manifest is the same on every machine. */
export const key = (rel) => rel.split(sep).join('/');

function main() {
  let files;
  try {
    files = collect(SRC);
  } catch {
    console.error(`\n  cannot read ${relative(ROOT, SRC)}\n`);
    console.error('  The generator is its own repository and is gitignored here.');
    console.error('  Clone it into worksheet_generator/ before syncing.\n');
    process.exit(1);
  }

  // Start clean, so a file deleted in the generator is deleted here too. A
  // stale module that nothing imports is harmless; one that something still
  // imports is a build that works locally and fails nowhere obvious.
  rmSync(DEST, { recursive: true, force: true });

  const manifest = {};
  for (const rel of files) {
    const body = readFileSync(join(SRC, rel));
    const to = join(DEST, rel);
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, body);
    manifest[key(rel)] = sha(body);
  }

  // Where the copy came from - and whether that is the whole truth.
  //
  // HEAD alone is not: syncing with uncommitted changes records a commit that
  // does not contain the files just copied. That happened the first time this
  // ran during phase 3, on a `worksheet-question.ts` that existed only in the
  // working tree. The drift half of the check would still have caught a stale
  // copy, but the provenance line is what anyone reads first, and it was
  // stating something untrue with no way to tell.
  let commit = 'unknown';
  let dirty = false;
  try {
    const gen = { cwd: join(ROOT, 'worksheet_generator'), encoding: 'utf8' };
    commit = execFileSync('git', ['rev-parse', 'HEAD'], gen).trim();
    dirty = execFileSync('git', ['status', '--porcelain', '--', 'src/lib'], gen).trim() !== '';
  } catch { /* a generator checkout without git history is not a reason to stop */ }

  writeFileSync(MANIFEST, `${JSON.stringify({
    note: 'Written by scripts/sync-generator.mjs. Do not edit lib/generator by hand.',
    sourceCommit: commit,
    // True when src/lib had uncommitted changes at sync time, so `sourceCommit`
    // names a commit that does not contain what was copied. Not an error -
    // syncing mid-work is normal - but it must not be silent.
    sourceDirty: dirty,
    count: files.length,
    files: manifest,
  }, null, 2)}\n`);

  console.log(`\n  copied ${files.length} files to ${relative(ROOT, DEST)}`);
  console.log(`  from generator commit ${commit.slice(0, 7)}${dirty ? ' plus uncommitted changes' : ''}`);
  if (dirty) {
    console.log('  - src/lib has uncommitted changes, so that commit does not');
    console.log('    contain this copy. Commit the generator and sync again.');
  }
  console.log('');
}

if (process.argv[1] && process.argv[1].endsWith('sync-generator.mjs')) main();
