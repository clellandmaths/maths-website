// Two checks on video timestamps, because getting one wrong is invisible:
// the button still works, the video still opens, it just starts in the wrong
// place — and only someone who watches it finds out.
//
//   1. lib/timestamp.mjs against a table of cases, including every case the old
//      copied-into-seven-files parser got wrong.
//   2. every timestamp in every past paper, asserting it is a shape the parser
//      understands and lands somewhere plausible.
//
// The bug this exists for: `if (ts.endsWith('s')) parseInt(ts.replace('s',''))`
// turned "3m35s" into 3 seconds. 105 of 988 timestamps were affected — every
// Advanced Higher paper from 2022 on, and Higher 2015.
//
// Run: node scripts/check-timestamps.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { timestampToSeconds } from '../lib/timestamp.mjs';

const root = path.resolve(import.meta.dirname, '..');
let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

// ---------------------------------------------------------------- unit tests
const CASES = [
  ['48s', 48], ['0s', 0], ['1253s', 1253],
  ['3m35s', 215],          // the bug: old parser gave 3
  ['1m8s', 68],            // Higher 2015
  ['12m42s', 762],         // AH 2025 P2
  ['5m', 300],             // old parser gave 5
  ['1h2m3s', 3723],
  ['3:35', 215], ['1:02:03', 3723],
  ['215', 215], [215, 215],
  ['', 0], [null, 0], [undefined, 0], ['nonsense', 0],
];

console.log('parser:');
for (const [input, expected] of CASES) {
  const got = timestampToSeconds(input);
  if (got !== expected) fail(`timestampToSeconds(${JSON.stringify(input)}) = ${got}, expected ${expected}`);
}
if (!failures) console.log(`  ${CASES.length} cases pass`);

// The old parser, kept so the regression stays proven rather than remembered.
const oldParser = ts => {
  if (typeof ts !== 'string') return 0;
  if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
  if (ts.includes(':')) { const [m, s] = ts.split(':').map(Number); return m * 60 + s; }
  return parseInt(ts, 10) || 0;
};
if (oldParser('3m35s') === timestampToSeconds('3m35s')) {
  fail('the old parser and the new one agree on "3m35s" — the regression test proves nothing');
}

// -------------------------------------------------------------- the real data
const dirs = ['src/n5/pastpapers', 'src/higher/pastpapers', 'src/ah/pastpapers', 'src/n5apps', 'src/higherapps'];
const SHAPE = /^(?:\d+h)?(?:\d+m)?(?:\d+s)?$|^\d+(?::\d+){1,2}$|^\d+$/;

let total = 0;
const shapes = new Map();
console.log('\npast-paper timestamps:');

for (const d of dirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    let mod;
    try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) {
        p.questions?.forEach((q, i) => {
          if (!q.timestamp) return;
          total++;
          const ts = String(q.timestamp).trim();
          const where = `${f} ${v.year} P${p.paperNumber} Q${i + 1}`;
          shapes.set(ts.replace(/\d+/g, 'N'), (shapes.get(ts.replace(/\d+/g, 'N')) ?? 0) + 1);

          if (!SHAPE.test(ts)) { fail(`${where}: "${ts}" is not a shape the parser understands`); return; }
          const secs = timestampToSeconds(ts);
          // 0 is genuine for the first question — the walkthrough opens on it —
          // and suspicious for any later one, where it means the parser gave up.
          if (secs <= 0 && i > 0) fail(`${where}: "${ts}" parses to ${secs}s`);
          if (secs > 4 * 3600) fail(`${where}: "${ts}" parses to ${secs}s — over four hours`);
        });
      }
    }
  }
}

console.log(`  ${total} checked`);
for (const [s, n] of [...shapes].sort((a, b) => b[1] - a[1])) console.log(`     ${String(n).padStart(4)}  ${s}`);

if (failures) {
  console.log(`\ntimestamp check FAILED (${failures})`);
  process.exit(1);
}
console.log('\nevery timestamp parses to a sensible position');
