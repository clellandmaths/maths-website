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

console.log(failures ? `\nhint gap: ${failures} FAILED` : '\nhint gap: ok');
process.exit(failures ? 1 : 0);
