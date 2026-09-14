/**
 * How the generator may be called, everywhere it is called.
 *
 *   node scripts/check-engine-callsites.mjs
 *
 * Three rules, each of which has been paid for once.
 *
 * **1. One door.** The engine is reached through `lib/generated-question.ts`
 * and nowhere else. That module filters to exam tier and refuses a warm-up; a
 * caller reaching past it into `lib/generator/` gets neither. The list of files
 * allowed through that door is written down here, so a new call site fails the
 * build until someone has looked at it — which is the review these rules exist
 * to force.
 *
 * **2. A client component may not import the engine statically.** It is ~33,000
 * lines in 645 KB of lazy chunks, on 0 of 542 pages, and one top-level import in
 * a shared component undoes that silently. A *server* component may import it
 * freely: `app/course/[courseId]/generate/page.tsx` calls
 * `offeredTopicGroups()` at build time and ships the result as about 170
 * strings, which is exactly the right thing to do and costs the browser
 * nothing. So the rule is about `'use client'`, not about the path.
 *
 * **3. No concurrent draws.** The generator's random stream is module-level, so
 * overlapping calls draw from each other. Measured, not assumed: resolving a
 * ten-question sheet with `Promise.all` changed all ten questions, and two
 * concurrent runs did not match each other — every pupil would get a different
 * sheet, and a different one each time they opened the link.
 *
 * Rule 3 is checked by pulling out the argument of every `Promise.all(`,
 * `Promise.allSettled(`, `Promise.race(` and `.map(async` and failing if a
 * generator call appears **inside** it. That is deliberately narrower than
 * banning those combinators outright: `Promise.all([import(…), import(…)])` is
 * the legitimate way to load two modules at once and appears in two call sites
 * today, and `app/explorer/page.tsx` uses `Promise.race` for a print timeout
 * that has nothing to do with drawing. A file-level ban would fail both.
 *
 * `scripts/check-share-refs.mjs` still owns the same rule for
 * `resolveWorksheet` specifically, where it was first written.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

/**
 * The public door, and the file that is the door.
 *
 * **Matched by path ending, not by the `@/` alias.** `lib/worksheet-share.ts`
 * reaches it as `./generated-question`, and a first version of this check
 * looking only for the alias did not see it at all — which is a whole class of
 * call site the registry would never have been shown.
 */
const BOUNDARY = /['"][^'"]*\/generated-question['"]/;
const BOUNDARY_FILE = 'lib/generated-question.ts';

/** Anything under here is engine internals. */
const INTERNALS = '@/lib/generator/';

/** What a draw looks like, wherever it is spelled. */
const DRAWS = ['similarTo', 'generateForSubtopics', 'questionFromCode', 'toWorksheetQuestion'];

/**
 * Files allowed to reach the boundary.
 *
 * Adding one here is the point at which somebody reads the rules above. Keep
 * the reason beside it.
 */
const ALLOWED = new Map([
  ['lib/worksheet-share.ts', 'rebuilds a shared sheet from its codes and seeds'],
  ['lib/use-generated-draw.ts', 'the shared hook every on-page control draws through'],
  ['components/Explorer/QuestionCard.tsx', 'a variation of the question on the card'],
  ['components/ExamHall/WarmUp.tsx', 'five more once the daily five are done'],
  ['app/explorer/page.tsx', 'bulk generate, and re-roll on the worksheet'],
  ['app/course/[courseId]/generate/GenerateClient.tsx', 'the by-skill builder'],
  ['app/course/[courseId]/generate/paper/[year]/[paper]/PracticePaperClient.tsx',
    'a whole practice paper'],
]);

let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

// ── collect the source ─────────────────────────────────────────────────────
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // The vendored engine is a copy of another repo and plays by its rules.
      if (full.includes(path.join('lib', 'generator'))) continue;
      walk(full, out);
    } else if (/\.(ts|tsx|mjs)$/.test(e.name)) out.push(full);
  }
  return out;
}

const files = [...walk(path.join(root, 'app')), ...walk(path.join(root, 'components')),
               ...walk(path.join(root, 'lib'))];
if (files.length < 50) {
  console.error(`\n  found only ${files.length} source files, expected far more.` +
                `\n  Nothing was checked.\n`);
  process.exit(1);
}

const rel = f => path.relative(root, f).split(path.sep).join('/');
const strip = src => src
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

/** The balanced argument of `open` starting at the index of its "(". */
function argumentAt(text, from) {
  let depth = 0;
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (!depth) return text.slice(from + 1, i); }
  }
  return text.slice(from);          // unbalanced; scan what there is
}

console.log(`\n  ${files.length} source files outside the vendored engine\n`);

const reached = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const name = rel(file);
  const src = strip(raw);
  const isClient = /^\s*(['"])use client\1/m.test(raw.split('\n').slice(0, 5).join('\n'));

  // ── 1. one door ─────────────────────────────────────────────────────────
  // The boundary is not a caller of itself.
  const usesBoundary = name !== BOUNDARY_FILE && BOUNDARY.test(src);
  if (usesBoundary) {
    reached.push(name);
    if (!ALLOWED.has(name)) {
      fail(`${name} reaches the generator. Add it to ALLOWED in this file, with why, ` +
           `after checking it draws sequentially and passes an exclude set.`);
    }
  }

  // ── 2. a client component may not carry the engine ──────────────────────
  for (const m of src.matchAll(/^\s*import\s+([\s\S]*?)from\s+'([^']+)'/gm)) {
    const [, what, from] = m;
    if (!from.startsWith(INTERNALS)) continue;
    if (/^\s*type\s/.test(what)) continue;                 // `import type { … }`
    if (isClient) {
      fail(`${name} is a client component and imports ${from} at the top level. ` +
           `The engine is 645 KB and must be reached with await import() inside a handler.`);
    }
  }

  // ── 3. no concurrent draws ──────────────────────────────────────────────
  for (const opener of ['Promise.all(', 'Promise.allSettled(', 'Promise.race(', '.map(async']) {
    let at = src.indexOf(opener);
    while (at !== -1) {
      const open = src.indexOf('(', at + opener.length - 1);
      const arg = argumentAt(src, open);
      const drawn = DRAWS.filter(d => new RegExp(`\\b${d}\\s*\\(`).test(arg));
      if (drawn.length) {
        fail(`${name} calls ${drawn.join(', ')} inside ${opener.replace('(', '')}. ` +
             `The generator's random stream is module-level — overlapping draws take ` +
             `each other's numbers. Use a sequential for ... await.`);
      }
      at = src.indexOf(opener, at + 1);
    }
  }
}

// ── stale entries ──────────────────────────────────────────────────────────
for (const [name] of ALLOWED) {
  if (!reached.includes(name)) {
    fail(`ALLOWED lists ${name}, which no longer reaches the generator — remove it`);
  }
}

console.log(`  ${reached.length} files reach the generator, all of them listed:`);
for (const name of reached.sort()) {
  console.log(`      ${name}`);
  console.log(`          ${ALLOWED.get(name) ?? '— not listed —'}`);
}

if (failures) {
  console.log(`\n  ${failures} problem${failures === 1 ? '' : 's'} with how the generator is called.\n`);
  process.exit(1);
}
console.log('\n  one door, no engine on a client component, and no concurrent draws\n');
