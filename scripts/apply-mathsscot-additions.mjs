import fs from 'node:fs';

/**
 * Append the past paper questions Andrew has added to maths.scot.
 *
 * Reads mathsscot-reconciled.json (from reconcile-mathsscot.mjs) and adds one
 * line per question to the end of the matching topic, which is where he
 * confirmed they should sit.
 *
 * Each entry is a reference, not a copy:
 *
 *   { ref: "2026 P1 Q11", solutionUrl: "https://www.maths.scot/higher/polynomials#26" },
 *
 * No videoId on purpose. practice-loader gives a bare ref the paper's own
 * video, which is what these should carry — the guided-practice videos do not
 * cover them. The ref is spelled the archive's way rather than his, because
 * the loader keys on the label in each question's own badge and a ref that
 * misses resolves to nothing and drops out of the sheet with no error.
 *
 *   node scripts/apply-mathsscot-additions.mjs          # dry run
 *   node scripts/apply-mathsscot-additions.mjs --write
 */

const WRITE = process.argv.includes('--write');
const rows = JSON.parse(fs.readFileSync('mathsscot-reconciled.json', 'utf8')).filter(r => r.status === 'ADD');

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

let added = 0;
const homeless = [];

for (const course of ['national5Maths', 'higherMaths', 'advancedHigherMaths']) {
  const file = `src/practice/data/${course}.ts`;
  let src = fs.readFileSync(file, 'utf8');
  const mine = rows.filter(r => r.course === course);
  if (!mine.length) continue;

  // locate every topic and its questions array
  const topics = [];
  for (const m of src.matchAll(/name:\s*"([^"]+)",\s*\n\s*questions:\s*\[/g)) {
    topics.push({ name: m[1], start: m.index + m[0].length });
  }
  topics.forEach((t, i) => { t.end = i + 1 < topics.length ? topics[i + 1].start : src.length; });

  // his slug -> our topic. Prefer an existing link in the topic, since that is
  // evidence rather than inference; fall back to the name, which covers the
  // topics that have no maths.scot link yet (Indices, 3D Coordinates and so on).
  const bySlug = {};
  for (const t of topics) {
    const chunk = src.slice(t.start, t.end);
    const m = chunk.match(/solutionUrl:\s*"https:\/\/www\.maths\.scot\/[a-z0-9-]+\/([a-z0-9-]+)#/);
    if (m) bySlug[m[1]] = t;
  }
  const byName = Object.fromEntries(topics.map(t => [norm(t.name), t]));

  // group additions per topic, then splice back to front so offsets hold
  const perTopic = new Map();
  for (const r of mine) {
    const t = bySlug[r.topic] ?? byName[norm(r.topic)];
    if (!t) { homeless.push(`${course} / ${r.topic} / ${r.key}`); continue; }
    if (!perTopic.has(t)) perTopic.set(t, []);
    perTopic.get(t).push(r);
  }

  const edits = [];
  for (const [t, list] of perTopic) {
    const chunk = src.slice(t.start, t.end);
    // the questions array closes at the first line that is only "]" or "],"
    const close = chunk.match(/^[ \t]*\],?[ \t]*$/m);
    if (!close) { homeless.push(`${course} / ${t.name} / could not find the end of the questions array`); continue; }
    // copy the indentation of the last entry so the file stays tidy
    const before = chunk.slice(0, close.index);
    const indent = (before.match(/\n([ \t]+)\{[^\n]*\},?\s*$/) || [, '            '])[1];
    const lines = list.map(r => `${indent}{ ref: "${r.key}", solutionUrl: "${r.url}" },`).join('\n');
    edits.push({ at: t.start + close.index, text: lines + '\n' });
    added += list.length;
    console.log(`  ${course.replace('Maths', '').padEnd(16)} ${t.name.padEnd(24)} +${list.length}  ${list.map(r => r.key).join(', ')}`);
  }

  for (const e of [...edits].sort((a, b) => b.at - a.at)) {
    src = src.slice(0, e.at) + e.text + src.slice(e.at);
  }
  if (WRITE) fs.writeFileSync(file, src);
}

console.log(`\n${WRITE ? 'written' : 'would add'}: ${added}`);
if (homeless.length) {
  console.log(`\nno home found (${homeless.length}):`);
  for (const h of homeless) console.log('   ' + h);
}
if (!WRITE) console.log('\ndry run — pass --write to apply');
