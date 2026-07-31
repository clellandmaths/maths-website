// The homepage "try a question" tile names its paper files directly, so that
// only one file is downloaded per question shown. Everything else on the site
// reads lib/data-loader and picks up a new year on its own.
//
// That makes this the one place a new past paper can be forgotten, and it was:
// the list sat on 2023/2024 through the whole 2025 diet, so the homepage never
// offered a 2025 question and nothing failed.
//
// This fails the build when the newest year a course advertises is missing
// from the tile. Run: node scripts/check-homepage-years.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const tile = fs.readFileSync(path.join(root, 'components/Home/TryQuestion.tsx'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'lib/data-loader.ts'), 'utf8');

/** The years a course offers, from getAvailable<Course>Years(). */
function advertisedYears(fnName) {
  const body = loader.slice(loader.indexOf(`export function ${fnName}`));
  // Match the array after `return`, not the first [ in the file — the return
  // type `: number[]` comes first and would otherwise match as an empty list.
  const list = body.match(/return\s*\[([^\]]*)\]/)?.[1] ?? '';
  return [...list.matchAll(/\d{4}/g)].map(m => Number(m[0])).sort((a, b) => b - a);
}

/** The years the homepage tile actually imports, per course. */
function tileYears(pathFragment) {
  return [...tile.matchAll(new RegExp(pathFragment + '(\\d{4})', 'g'))]
    .map(m => Number(m[1])).sort((a, b) => b - a);
}

const COURSES = [
  { name: 'National 5', fn: 'getAvailableN5Years',     frag: 'pastpapers/pastpaper-' },
  { name: 'Higher',     fn: 'getAvailableHigherYears', frag: 'pastpapers/higherpastpaper' },
];

let problems = 0;
for (const c of COURSES) {
  const advertised = advertisedYears(c.fn);
  const onTile = tileYears(c.frag);
  const newest = advertised[0];

  if (!onTile.length) {
    console.log(`${c.name}: the homepage tile imports no papers at all`);
    problems++;
    continue;
  }
  if (!onTile.includes(newest)) {
    console.log(`${c.name}: newest paper is ${newest}, but the homepage tile only has ${onTile.join(', ')}`);
    console.log(`   add it to the sources list in components/Home/TryQuestion.tsx`);
    problems++;
    continue;
  }
  console.log(`${c.name}: newest is ${newest}, tile has ${onTile.join(', ')} — ok`);
}

if (problems) {
  console.log(`\nhomepage year check FAILED (${problems})`);
  process.exit(1);
}
console.log('\nhomepage question tile is up to date');
