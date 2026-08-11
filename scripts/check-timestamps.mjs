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

// ------------------------------------------- guided practice, specials, notes
//
// The section above only ever looked at past papers, and it skipped falsy
// timestamps outright (`if (!q.timestamp) return`). Both blind spots mattered:
// two guided practice questions sat at timestamp 0 for months, opening their
// video from the beginning, and neither was a past paper entry nor a truthy
// value, so nothing looked at them.
//
// The rule that catches this: a video's FIRST appearance may legitimately start
// at 0 — a dedicated single-question video opens on the question. A later
// appearance of the SAME video at 0 cannot be right, because the earlier
// entries are already further in.

/**
 * videoId/timestamp pairs in source order. Objects may span lines.
 *
 * The search must not cross an object boundary. An earlier version scanned a
 * fixed 600 characters either side, which let a videoId with no timestamp of
 * its own borrow the neighbouring entry's and report as healthy — exactly the
 * fault the check exists to catch. So scan outward only as far as the first
 * `}` or the next `videoId:`, whichever comes first.
 *
 * Brace counting is deliberately avoided: question and answer strings are full
 * of LaTeX braces, so `{` and `}` are not reliable structure in this data. The
 * one thing that does hold is that a `timestamp` belonging to this entry is
 * never separated from its `videoId` by an object terminator.
 */
function pairs(text) {
  const STOP = /timestamp:\s*(?:(["'`])(.*?)\1|(\d+))|(\}\s*[,;\]])|videoId:/g;
  const vids = [...text.matchAll(/videoId:\s*(["'`])(.*?)\1/g)];
  const found = [];

  for (const m of vids) {
    const from = m.index + m[0].length;
    STOP.lastIndex = from;
    const ahead = STOP.exec(text);
    let raw;
    // A timestamp reached before any terminator belongs to this entry.
    if (ahead && ahead[4] === undefined && !ahead[0].startsWith('videoId')) {
      raw = ahead[2] !== undefined ? ahead[2] : Number(ahead[3]);
    } else {
      // Fields can also be written the other way round. Look back, but only to
      // this entry's opening — the previous terminator or videoId.
      const before = text.slice(0, m.index);
      const bound = Math.max(before.lastIndexOf('},'), before.lastIndexOf('videoId:'));
      const behind = before.slice(bound + 1);
      const hit = /timestamp:\s*(?:(["'`])(.*?)\1|(\d+))/.exec(behind);
      if (hit) raw = hit[2] !== undefined ? hit[2] : Number(hit[3]);
    }
    found.push({ videoId: m[2], raw, line: text.slice(0, m.index).split('\n').length });
  }
  return found;
}

const dataFiles = [
  ...fs.readdirSync(path.join(root, 'src/practice/data'))
      .filter(f => f.endsWith('.ts')).map(f => `src/practice/data/${f}`),
  ...['n5', 'higher', 'ah', 'n5apps', 'higherapps']
      .map(c => `src/${c}/specials`)
      .filter(d => fs.existsSync(path.join(root, d)))
      .flatMap(d => fs.readdirSync(path.join(root, d))
        .filter(f => f.endsWith('.js')).map(f => `${d}/${f}`)),
];

let checked = 0;
console.log('\nguided practice and specials:');
for (const rel of dataFiles) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const seen = new Map();                       // videoId -> times seen so far
  for (const p of pairs(text)) {
    checked++;
    const n = (seen.get(p.videoId) ?? 0) + 1;
    seen.set(p.videoId, n);
    const where = `${rel}:${p.line} ${p.videoId}`;

    if (p.raw === undefined) { fail(`${where}: videoId with no timestamp — the embed opens at 0`); continue; }
    const ts = String(p.raw).trim();
    if (ts && !SHAPE.test(ts)) { fail(`${where}: "${ts}" is not a shape the parser understands`); continue; }

    const secs = timestampToSeconds(p.raw);
    if (secs <= 0 && n > 1) {
      fail(`${where}: ${JSON.stringify(p.raw)} is use ${n} of this video and parses to ${secs}s — ` +
           `earlier uses are further in, so this cannot be the start`);
    }
    if (secs > 6 * 3600) fail(`${where}: "${ts}" parses to ${secs}s — over six hours`);
  }
}
console.log(`  ${checked} videoId/timestamp pairs checked across ${dataFiles.length} files`);

// Notes carry the whole URL rather than a timestamp field, so `start=` must
// already be seconds — YouTube ignores start=3m35s and opens at the beginning.
const notesDir = path.join(root, 'src/notes/data');
let starts = 0;
if (fs.existsSync(notesDir)) {
  for (const f of fs.readdirSync(notesDir).filter(f => /\.(tsx?|jsx?)$/.test(f))) {
    const text = fs.readFileSync(path.join(notesDir, f), 'utf8');
    for (const m of text.matchAll(/youtube\.com\/embed\/[^"'`?\s]+\?start=([^"'`&\s]+)/g)) {
      starts++;
      if (!/^\d+$/.test(m[1])) {
        fail(`src/notes/data/${f}: start=${m[1]} — YouTube only accepts whole seconds here`);
      }
    }
  }
}
console.log(`  ${starts} hardcoded notes start= values checked`);

if (failures) {
  console.log(`\ntimestamp check FAILED (${failures})`);
  process.exit(1);
}
console.log('\nevery timestamp parses to a sensible position');
