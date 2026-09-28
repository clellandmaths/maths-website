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
// The site's own functions, not a copy: see the note at the top of that file.
import { splitByPart, cardParts } from '../lib/hint-parts.mjs';

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
// The site gives a label a button (`ladderLabel` in lib/similar-questions.ts),
// after writing its "&" one way, when its year is in the course's
// `HINTED_YEARS`. It then answers it from the table, or, for a card that sets
// parts together ("2022 P2 Q5(a) & (b)"), from each part's row (`cardParts` in
// lib/hint-parts.mjs, 2026-09-28: "a card with 3 parts needs to be able to show
// hints for all parts"). This asserts that
//   a. every label the site gives a button has a plan behind it: its own, or
//      one for every part it sets
//   b. every hinted year has plans, and every year with plans is hinted, so the
//      sets cannot drift from the tables either way
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
  const spell = label => label.replace(/\s*&(?:amp;)?\s*/g, ' & ');
  let combined = 0;
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

    const buttoned = [...rendered.keys()].filter(l => c.shape.test(l) && years.has(yearOf(l)));
    const answered = l => plans.has(l) || (cardParts(l)?.every(p => plans.has(p)) ?? false);
    const empty = buttoned.filter(l => !answered(l));
    combined += buttoned.filter(l => !plans.has(l) && answered(l)).length;
    if (empty.length) {
      fail(`${id}: ${empty.length} Hint button(s) with no plan behind them — they open on nothing: `
         + empty.slice(0, 8).map(l => `${l} (${rendered.get(l)})`).join(', '));
    } else {
      const held = [...rendered.keys()].filter(l => c.shape.test(l)).length - buttoned.length;
      console.log(`  ok    ${id.padEnd(12)} ${buttoned.length} buttons, all with hints; ${held} withheld (no marking instructions)`);
    }

    const planYears = new Set([...plans].map(yearOf));
    const unplanned = [...years].filter(y => !planYears.has(y));
    const unlisted = [...planYears].filter(y => !years.has(y));
    if (unplanned.length) fail(`${id}: HINTED_YEARS lists ${unplanned.join(', ')}, which has no plan in ${c.plan}`);
    if (unlisted.length) fail(`${id}: ${c.plan} has plans for ${unlisted.join(', ')}, which HINTED_YEARS does not list — those hints are withheld`);
  }
  console.log(`  ok    ${combined} card(s) that set parts together, answered from every part's ladder`);
}

// ------------------------------- 6. a short hint reaches every part of a card
// Added 2026-09-28. The owner: "I think that a card with 3 parts needs to be
// able to show hints for all parts?" The short hint is cut from the ladder part
// by part (`splitByPart` in lib/hint-parts.mjs), and this runs that same
// function over every multi-part card on the five courses, with the ladder
// built from the tables as `Hints` builds it. A card whose ladder cannot be
// split gets one step from the top, which helps with (a) alone.
//
// Declared, because its ladder genuinely has no boundary: 2019 P1 Q8's plan
// takes (a) and (b) in one move worth 2 ("each sentence gives you one
// equation"), so that one move already covers both. A declared card that
// starts splitting is named, so the entry cannot outlive its reason.
console.log('\nevery multi-part card gives a step for every part:');
{
  // Keyed by course: a Higher and an N5 Apps 2019 P1 Q8 exist too, and split.
  const ONE_STEP_FOR_TWO_PARTS = new Set(['n5 2019 P1 Q8']);
  const rowsOf = file => {
    const out = {};
    for (const line of fs.readFileSync(path.join(root, 'lib', 'generator', 'generators', file), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^ {2}"([^"]+)": (\{.*\}),?$/);
      if (!m) continue;
      try { out[m[1]] = JSON.parse(m[2]); } catch { /* not a row */ }
    }
    return out;
  };
  const byLabel = t => l => t[l] ? t[l].moves.map((move, i) => ({ move, marks: t[l].marks[i] })) : null;
  const n5 = rowsOf('paper-plan.ts');   // PLANS and PLAN_OF rows together; their keys differ in shape
  const LADDERS = {
    n5: ['src/n5/pastpapers', l => {
      const of = n5[l]; const plan = of?.v ? n5[of.v] : null;
      return plan ? [...(of.nudge ? [{ move: of.nudge, marks: 0 }] : []),
        ...plan.moves.map((move, i) => ({ move, marks: of.marks[i] }))] : null;
    }],
    higher: ['src/higher/pastpapers', byLabel(rowsOf('paper-plan-higher.ts'))],
    ah: ['src/ah/pastpapers', byLabel(rowsOf('paper-plan-ah.ts'))],
    'n5-apps': ['src/n5apps', byLabel(rowsOf('paper-plan-n5apps.ts'))],
    'higher-apps': ['src/higherapps', byLabel(rowsOf('paper-plan-higherapps.ts'))],
  };
  const walk = d => fs.readdirSync(d, { withFileTypes: true })
    .flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  let total = 0;
  for (const [id, [dir, ladderOf]] of Object.entries(LADDERS)) {
    let multi = 0;
    const unsplit = [];
    for (const f of walk(path.join(root, dir)).filter(f => f.endsWith('.js') && !/databooklet|formula|specials/i.test(f))) {
      for (const chunk of fs.readFileSync(f, 'utf8').split(/\bquestion:\s*`/).slice(1)) {
        const label = chunk.match(/^\s*<small>\s*<strong>\s*<span[^>]*>\s*([^<]+?)\s*<\/span>/)?.[1]?.trim();
        const marks = chunk.match(/\bmarks:\s*\[([^\]]*)\]/)?.[1]?.split(',').map(Number).filter(n => !Number.isNaN(n));
        if (!label || !marks || marks.length < 2) continue;
        const ladder = ladderOf(label);
        if (!ladder) continue;
        multi++;
        const split = splitByPart(ladder, marks);
        const declared = ONE_STEP_FOR_TWO_PARTS.has(`${id} ${label}`);
        if (!split && !declared) unsplit.push(`${label} (${marks.join(', ')})`);
        if (split && declared) fail(`${id} ${label} now splits into parts — delete it from ONE_STEP_FOR_TWO_PARTS`);
      }
    }
    total += multi;
    if (unsplit.length) {
      fail(`${id}: ${unsplit.length} multi-part card(s) whose short hint helps with the first part only: ${unsplit.slice(0, 8).join(', ')}`);
    } else {
      console.log(`  ok    ${id.padEnd(12)} ${multi} multi-part cards, a step for every part`);
    }
  }
  if (total < 400) fail(`only ${total} multi-part cards read, down from 407 — the reader has stopped finding them`);
}

console.log(failures ? `\nhint gap: ${failures} FAILED` : '\nhint gap: ok');
process.exit(failures ? 1 : 0);
