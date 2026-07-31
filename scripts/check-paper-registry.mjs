// Every paper the site loads must appear in lib/past-paper-videos.ts, and vice
// versa.
//
// The course page's Past Paper Archive is built from `paperVideos`, NOT from
// the question data. Everything else — Explorer, Exam Hall warm-up, the
// /papers/[year]/[paper] routes, the sitemap — reads lib/data-loader and picks
// a new paper up on its own. So adding a paper file makes it appear everywhere
// EXCEPT the archive, silently. That is exactly what happened to N5 Apps 2026
// Paper 2: present in the Explorer, absent from the archive.
//
// Same shape as the homepage tile that sat two years stale, and it deserves the
// same treatment — a build gate rather than a memory.
//
// Reads both files as text rather than importing them: data-loader.ts uses "@/"
// path aliases that plain node cannot resolve.
//
// Run: node scripts/check-paper-registry.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const loaderSrc = fs.readFileSync(path.join(root, 'lib/data-loader.ts'), 'utf8');
const videosSrc = fs.readFileSync(path.join(root, 'lib/past-paper-videos.ts'), 'utf8');

// No build script may import a .ts file.
//
// Node only strips types unflagged from 22.18; Cloudflare builds on 22.16 and
// dies with ERR_UNKNOWN_FILE_EXTENSION. Two checks imported lib/*.ts, passed
// locally on 22.19, and took the whole deployment down — the site sat on "no
// deployment available" until the modules were moved to .mjs. Nothing else
// would have caught it, because locally it works.
{
  const scripts = path.join(root, 'scripts');
  const offenders = [];
  for (const f of fs.readdirSync(scripts).filter(f => f.endsWith('.mjs'))) {
    const src = fs.readFileSync(path.join(scripts, f), 'utf8');
    for (const m of src.matchAll(/^\s*import\s[^;]*?from\s+['"]([^'"]+\.ts)['"]/gm)) {
      offenders.push(`scripts/${f} imports ${m[1]}`);
    }
  }
  if (offenders.length) {
    console.log('build scripts must not import TypeScript — Cloudflare runs Node 22.16:');
    for (const o of offenders) console.log(`   ${o}`);
    console.log('   move the shared module to .mjs (see lib/timestamp.mjs)');
    process.exit(1);
  }
}

/** The import paths inside one getAll…Questions function — what the site loads. */
function importedPapers(fnName) {
  const start = loaderSrc.indexOf(`export async function ${fnName}`);
  if (start < 0) throw new Error(`${fnName} not found in data-loader.ts`);
  const end = loaderSrc.indexOf('\n}', start);
  const body = loaderSrc.slice(start, end);
  return [...body.matchAll(/import\('@\/([^']+)'\)/g)].map(m => m[1]);
}

/** The entries of one exported PaperVideo[] array. */
function registryEntries(exportName) {
  const start = videosSrc.indexOf(`export const ${exportName}`);
  if (start < 0) throw new Error(`${exportName} not found in past-paper-videos.ts`);
  const end = videosSrc.indexOf('\n];', start);
  const body = videosSrc.slice(start, end);
  return [...body.matchAll(/\{\s*year:\s*('[^']*'|\d+)\s*,\s*paperNumber:\s*(\d+)\s*,[^}]*?questionCount:\s*(\d+)/g)]
    .map(m => ({
      year: m[1].startsWith("'") ? m[1].slice(1, -1) : Number(m[1]),
      paperNumber: Number(m[2]),
      questionCount: Number(m[3]),
    }));
}

const COURSES = [
  { name: 'National 5',          fn: 'getAllN5Questions',         reg: 'n5PaperVideos' },
  { name: 'Higher',              fn: 'getAllHigherQuestions',     reg: 'higherPaperVideos' },
  { name: 'Advanced Higher',     fn: 'getAllAHQuestions',         reg: 'ahPaperVideos' },
  { name: 'N5 Applications',     fn: 'getAllN5AppsQuestions',     reg: 'n5AppsPaperVideos' },
  { name: 'Higher Applications', fn: 'getAllHigherAppsQuestions', reg: 'higherAppsPaperVideos' },
];

const key = (year, paperNumber) => `${year} P${paperNumber}`;
let problems = 0;

for (const course of COURSES) {
  // what the site actually loads
  const inData = new Map();
  for (const rel of importedPapers(course.fn)) {
    const file = path.join(root, rel.endsWith('.js') ? rel : `${rel}.js`);
    if (!fs.existsSync(file)) { console.log(`   ${course.name}: data-loader imports ${rel}, which does not exist`); problems++; continue; }
    const mod = await import(pathToFileURL(file).href);
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) inData.set(key(v.year, p.paperNumber), p.questions.length);
    }
  }

  const registry = registryEntries(course.reg);
  const inRegistry = new Map(registry.map(p => [key(p.year, p.paperNumber), p]));

  const missing = [...inData.keys()].filter(k => !inRegistry.has(k));
  const orphaned = [...inRegistry.keys()].filter(k => !inData.has(k));
  const miscounted = [...inData.entries()]
    .filter(([k, n]) => inRegistry.has(k) && inRegistry.get(k).questionCount !== n)
    .map(([k, n]) => `${k}: data has ${n}, registry says ${inRegistry.get(k).questionCount}`);

  const bad = missing.length + orphaned.length + miscounted.length;
  problems += bad;
  console.log(`${course.name}: ${inData.size} papers loaded, ${inRegistry.size} in the archive registry${bad ? '' : ' — ok'}`);

  for (const k of missing) {
    console.log(`   MISSING FROM THE ARCHIVE  ${k} (${inData.get(k)} questions)`);
    console.log(`      it is in the Explorer and Exam Hall but not on the course page.`);
    console.log(`      add it to ${course.reg} in lib/past-paper-videos.ts`);
  }
  for (const k of orphaned) console.log(`   IN THE ARCHIVE BUT NOT LOADED  ${k} — the archive offers a paper with no questions`);
  for (const line of miscounted) console.log(`   QUESTION COUNT WRONG  ${line}`);
}

if (problems) {
  console.log(`\npaper registry check FAILED (${problems})`);
  process.exit(1);
}
console.log('\nevery paper the site loads is in the archive, with the right question count');
