// Every National 5 past paper question either has a hint ladder or is a
// declared absence — and no absence is declared that is no longer true.
//
// ## The bug this exists because of
//
// `Hints` decided whether to render its button with `paperLabelOf`, which
// answers "is this a National 5 past paper question". That was read as "does
// this have a ladder", and for one year the two came apart. We hold 22 questions
// from 2021; `reference/N5_Markschemes/` has `mi_N5_Mathematics_all_2021.pdf`
// and no transcription of it, so `readSchemes` has never seen a row and
// `PLAN_OF` has no entry for any of them.
//
// The button rendered anyway. Pressing it looked up `PLAN_OF["2021 P1 Q2"]`, got
// undefined, and left `staged` null — so the overlay opened with the question at
// the top, nothing under it, and a footer reading `More help (2 left)` that
// could be pressed for ever and never produce a word. It was on the card, in
// full screen and in Focus.
//
// ## What is asserted, and why it is four things rather than one
//
//   1. every paper label we render has a plan, or sits on a declared paper
//   2. nothing is declared that DOES have a plan  — a stale suppression hides a
//      working ladder, and would do it silently
//   3. a declared paper has NO plans at all      — a half-transcribed year would
//      pass (1) and (2) while suppressing real help
//   4. every question on a declared paper carries a solutionUrl — the note that
//      replaces the button promises a written solution, and a promise this
//      check does not keep is worse than the button was
//
// (2) is the one that makes this worth having. The day somebody transcribes the
// 2021 marking instructions and re-emits `paper-plan.ts`, this check goes red
// and names the two strings to delete. Without it the suppression would outlive
// its reason and quietly withhold 21 ladders.
//
// Run: node scripts/check-hint-gap.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

// ------------------------------------------------- what the site declares
// Read as text rather than imported: similar-questions.ts is TypeScript with
// path aliases, and this one value is not worth a build step. Reading the
// literal also means a declaration added in a comment or behind a condition
// does not count — only the set itself.
const libSrc = fs.readFileSync(
  path.join(root, 'lib', 'similar-questions.ts'), 'utf8');
const declBlock = libSrc.match(
  /const NO_MARKSCHEME:\s*ReadonlySet<string>\s*=\s*new Set\(\[([^\]]*)\]\)/);
if (!declBlock) {
  fail('cannot find the NO_MARKSCHEME set in lib/similar-questions.ts — '
     + 'if it was renamed, this check is no longer policing anything');
  console.log('\nhint gap: CANNOT RUN');
  process.exit(1);
}
const declared = new Set(
  [...declBlock[1].matchAll(/'([^']+)'/g)].map(m => m[1]));

// ------------------------------------------------------ what has a ladder
const planSrc = fs.readFileSync(
  path.join(root, 'lib', 'generator', 'generators', 'paper-plan.ts'), 'utf8');
const planOf = planSrc.slice(planSrc.indexOf('export const PLAN_OF'));
const planned = new Set([...planOf.matchAll(/^ {2}"([^"]+)":/gm)].map(m => m[1]));

// -------------------------------------------- every label the site renders
// Two sources, because `Hints` renders on both and the failure was only ever
// visible on one of them. The archive carries its badge inside the question
// HTML; guided practice strips it out and keeps it on `paper`.
const LABEL = /\b(\d{4}) P([12]) Q(\d+)\b/g;
const seen = new Map();          // label -> [{ where, solutionUrl }]
const note = (label, where, solutionUrl) => {
  if (!seen.has(label)) seen.set(label, []);
  seen.get(label).push({ where, solutionUrl });
};

// Guided practice: one entry per line, `paper:` carries the label.
const practicePath = path.join(root, 'src', 'practice', 'data', 'national5Maths.ts');
for (const line of fs.readFileSync(practicePath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/paper:\s*["'](\d{4} P[12] Q\d+)["']/);
  if (m) note(m[1], 'practice', /solutionUrl:/.test(line));
}

// The archive. The badge is printed in the question HTML.
const papersDir = path.join(root, 'src', 'n5', 'pastpapers');
for (const file of fs.readdirSync(papersDir)) {
  if (!file.endsWith('.js')) continue;
  const src = fs.readFileSync(path.join(papersDir, file), 'utf8');
  for (const m of src.matchAll(LABEL)) note(m[0], `archive/${file}`, false);
}

const labels = [...seen.keys()].sort();
const paperOf = label => label.slice(0, 7);

console.log(`${labels.length} National 5 paper labels rendered; `
          + `${planned.size} have a plan; ${declared.size} paper(s) declared`);

// ------------------------------------- 1. nothing falls between the two
console.log('\nevery label has a ladder or a declared reason:');
{
  const orphans = labels.filter(
    l => !planned.has(l) && !declared.has(paperOf(l)));
  if (orphans.length) {
    fail(`${orphans.length} label(s) with no plan and no declared absence — `
       + 'these render a Hint button that opens an empty overlay');
    for (const l of orphans.slice(0, 12)) {
      console.log(`          ${l}  (${[...new Set(seen.get(l).map(s => s.where))].join(', ')})`);
    }
    if (orphans.length > 12) console.log(`          … and ${orphans.length - 12} more`);
  } else {
    console.log(`  ok    all ${labels.length} resolve`);
  }
}

// ---------------------------------- 2 & 3. no declaration outlives its cause
console.log('\nno declared paper has a plan behind it:');
{
  let clean = true;
  for (const paper of [...declared].sort()) {
    const withPlans = [...planned].filter(l => paperOf(l) === paper);
    if (withPlans.length) {
      clean = false;
      fail(`${paper} is declared as having no marking instructions, but `
         + `paper-plan.ts has ${withPlans.length} plan(s) for it `
         + `(${withPlans.slice(0, 3).join(', ')}…) — the marking instructions `
         + `have been transcribed, so delete '${paper}' from NO_MARKSCHEME in `
         + 'lib/similar-questions.ts and give those questions their ladder back');
    }
  }
  // A declaration that suppresses nothing is dead weight pointing at a year
  // we do not carry. Not a failure, but it should not be left lying about.
  for (const paper of [...declared].sort()) {
    const rendered = labels.filter(l => paperOf(l) === paper);
    if (!rendered.length) {
      clean = false;
      fail(`${paper} is declared but no question from it is rendered anywhere `
         + '— the declaration is suppressing nothing and should be removed');
    }
  }
  if (clean) console.log(`  ok    ${declared.size} declaration(s), all still true`);
}

// --------------------------- 4. the note's promise is kept on every question
console.log('\nevery suppressed question carries the written solution the note promises:');
{
  const bare = [];
  for (const label of labels) {
    if (!declared.has(paperOf(label))) continue;
    for (const s of seen.get(label)) {
      // The archive shows no maths.scot link by arrangement, and renders no
      // note either — `NoHintNote` needs a solutionUrl to say anything. Only
      // guided practice, which does show one, has a promise to keep.
      if (s.where === 'practice' && !s.solutionUrl) bare.push(label);
    }
  }
  if (bare.length) {
    fail(`${bare.length} suppressed practice question(s) have no solutionUrl, `
       + 'so the note would promise a written solution that is not there: '
       + bare.join(', '));
  } else {
    const n = labels.filter(l => declared.has(paperOf(l))).length;
    console.log(`  ok    all ${n} carry one`);
  }
}

// ------------------------------------------ 5. the other four courses
// Added 2026-09-28, when every course had hints and nothing held the other four
// to them. The owner found an Advanced Higher practice question, "vectors 2014
// Q5", whose button opened on nothing: its label had the course's shape, and
// shape was the whole test. 14 such buttons were live across the four courses.
//
// The site now asks two things of a label (`ladderLabel` in
// lib/similar-questions.ts), after writing its "&" one way: that its year is in
// the course's `HINTED_YEARS`, and that it is not one of the `NO_LADDER_CARDS`
// (two parts set together, ladders written per part). This reproduces both
// from the source's own literals and asserts that
//   a. every label the site would give a button to has a plan behind it
//   b. every hinted year has plans, and every year with plans is hinted, so the
//      sets cannot drift from the tables either way
//   c. every declared card is still rendered, and still has no plan
console.log('\nthe other four courses: every Hint button has hints behind it:');
{
  const literal = name => {
    const m = libSrc.match(new RegExp(`const ${name} = (\/.+\/[a-z]*);`));
    if (!m) { fail(`cannot find ${name} in lib/similar-questions.ts`); return /$^/; }
    const body = m[1].slice(1, m[1].lastIndexOf('/'));
    return new RegExp(body, m[1].slice(m[1].lastIndexOf('/') + 1));
  };
  const yearsBlock = libSrc.match(/export const HINTED_YEARS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!yearsBlock) fail('cannot find HINTED_YEARS in lib/similar-questions.ts');
  const hintedYears = {};
  for (const m of (yearsBlock?.[1] ?? '').matchAll(/'?([a-z0-9-]+)'?:\s*new Set\(\[([^\]]*)\]\)/g)) {
    hintedYears[m[1]] = new Set([...m[2].matchAll(/'([^']+)'/g)].map(x => x[1]));
  }

  const COURSES = {
    higher: { plan: 'paper-plan-higher.ts', shape: literal('N5_PAPER_LABEL'), archive: 'src/higher/pastpapers', practice: 'higherMaths.ts' },
    ah: { plan: 'paper-plan-ah.ts', shape: literal('AH_LABEL'), archive: 'src/ah/pastpapers', practice: 'advancedHigherMaths.ts' },
    'n5-apps': { plan: 'paper-plan-n5apps.ts', shape: literal('N5APPS_LABEL'), archive: 'src/n5apps', practice: 'national5Apps.ts' },
    'higher-apps': { plan: 'paper-plan-higherapps.ts', shape: literal('ONE_PAPER_LABEL'), archive: 'src/higherapps', practice: 'higherApps.ts' },
  };
  const cardsBlock = libSrc.match(/export const NO_LADDER_CARDS[^=]*=\s*new Set\(\[([^\]]*)\]\)/);
  if (!cardsBlock) fail('cannot find NO_LADDER_CARDS in lib/similar-questions.ts');
  const cards = new Set([...(cardsBlock?.[1] ?? '').matchAll(/'([^']+)'/g)].map(m => m[1]));
  const spell = label => label.replace(/\s*&(?:amp;)?\s*/g, ' & ');
  const walk = d => fs.readdirSync(d, { withFileTypes: true })
    .flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const yearOf = label => label.split(' ')[0];

  for (const [id, c] of Object.entries(COURSES)) {
    const planText = fs.readFileSync(path.join(root, 'lib', 'generator', 'generators', c.plan), 'utf8');
    const plans = new Set([...planText.matchAll(/^ {2}"([^"]+)":/gm)].map(m => m[1]));
    const years = hintedYears[id] ?? new Set();

    const rendered = new Map();   // label -> where
    for (const f of walk(path.join(root, c.archive)).filter(f => f.endsWith('.js') && !/databooklet|formula/i.test(f))) {
      for (const m of fs.readFileSync(f, 'utf8').matchAll(/<small>\s*<strong>\s*<span[^>]*>\s*([^<]+?)\s*<\/span>/g)) {
        rendered.set(spell(m[1]), 'archive');
      }
    }
    const practice = path.join(root, 'src', 'practice', 'data', c.practice);
    if (fs.existsSync(practice)) {
      for (const m of fs.readFileSync(practice, 'utf8').matchAll(/paper:\s*["'`]([^"'`]+)["'`]/g)) {
        rendered.set(spell(m[1].trim()), 'practice');
      }
    }

    const buttoned = [...rendered.keys()].filter(l => c.shape.test(l) && !cards.has(l) && years.has(yearOf(l)));
    const empty = buttoned.filter(l => !plans.has(l));
    if (empty.length) {
      fail(`${id}: ${empty.length} Hint button(s) with no plan behind them — they open on nothing: `
         + empty.slice(0, 8).map(l => `${l} (${rendered.get(l)})`).join(', '));
    } else {
      const held = [...rendered.keys()].filter(l => c.shape.test(l)).length - buttoned.length;
      console.log(`  ok    ${id.padEnd(12)} ${buttoned.length} buttons, all with hints; ${held} withheld (no marking instructions, or a declared card)`);
    }

    const planYears = new Set([...plans].map(yearOf));
    const unplanned = [...years].filter(y => !planYears.has(y));
    const unlisted = [...planYears].filter(y => !years.has(y));
    if (unplanned.length) fail(`${id}: HINTED_YEARS lists ${unplanned.join(', ')}, which has no plan in ${c.plan}`);
    for (const card of cards) {
      if (!card.startsWith(yearOf(card)) || !years.has(yearOf(card))) continue;
      if (plans.has(card)) fail(`${id}: ${card} now has a ladder of its own — delete it from NO_LADDER_CARDS`);
      if (id === 'n5-apps' && !rendered.has(card)) fail(`${id}: ${card} is declared but no question renders it — delete it from NO_LADDER_CARDS`);
    }
    if (unlisted.length) fail(`${id}: ${c.plan} has plans for ${unlisted.join(', ')}, which HINTED_YEARS does not list — those hints are withheld`);
  }
}

console.log(failures ? `\nhint gap: ${failures} FAILED` : '\nhint gap: ok');
process.exit(failures ? 1 : 0);
