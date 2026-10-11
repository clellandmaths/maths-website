/**
 * Advanced Higher sheets take distinct questions first, through the website's own path (the owner, 2026-10-11:
 * "We want sheets that feel distinct from each other"; then "Yes" to it as a preference).
 *
 *   npx tsx scripts/check-ah-distinct.mts
 *
 * By hand, as verify-share-fixtures (it needs the engine, a .ts file). A sheet is made as "Another like this one"
 * makes it: `similarTo(card, 1, worksheetKeys(sheet), 'ah')`, one question a click. With each question's parts key
 * passed back by `worksheetKeys` (lib/generated-question.ts), no two questions share parts worth half their marks
 * until the card has run out of fresh ones; the same sheet with the parts keys left out repeats sooner. That second
 * sheet is the proof that worksheetKeys carrying the key is what makes the preference work across clicks.
 */
import { similarTo, worksheetKeys } from '../lib/generated-question';
import { partsFromKey, sharesHalf } from '../lib/generator/generators/ah/same-keys';

// Cards with no core, each with more fresh questions than this many (tools/never-the-paper ahfull.mts): 2018 Q9 and
// 2023 P1 Q8 give 7 before any repeat, 2024 P1 Q1 10, 2016 Q8 7.
const CARDS: [string, number][] = [['2018 Q9', 7], ['2023 P1 Q8', 7], ['2024 P1 Q1', 10], ['2016 Q8', 7]];
let bad = 0;
async function sheet(card: string, n: number, passParts: boolean) {
  const qs: any[] = [];
  for (let i = 0; i < n; i++) {
    const held = passParts ? qs : qs.map(({ partsKey, ...q }) => q);
    const [q] = await similarTo(card, 1, worksheetKeys(held), 'ah');
    if (!q) break;
    qs.push(q);
  }
  const ps = qs.map(q => (q.partsKey ? partsFromKey(q.partsKey).parts : []));
  for (let j = 0; j < ps.length; j++) for (let i = 0; i < j; i++) if (ps[i].length && sharesHalf(ps[i], ps[j])) return { len: qs.length, first: j, keyed: qs.every(q => q.partsKey) };
  return { len: qs.length, first: qs.length, keyed: qs.every(q => q.partsKey) };
}
for (const [card, fresh] of CARDS) {
  const on = await sheet(card, fresh, true), off = await sheet(card, fresh, false);
  const ok = on.keyed && on.len === fresh && on.first === fresh;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${card}: ${on.len} questions one click at a time, ${on.first === on.len ? 'none' : `a repeat at question ${on.first + 1}`} sharing half the marks (without the parts keys passed back: ${off.first === off.len ? 'none' : `a repeat at question ${off.first + 1}`})`);
}
console.log(bad ? `\n${bad} card(s) FAILED` : '\nevery card: distinct first, one click at a time, as the website makes a sheet');
if (bad) process.exitCode = 1;
