import fs from 'node:fs';
import path from 'node:path';

/**
 * Give every guided-practice question a link to its written solution on
 * maths.scot — including the past-paper ones, which he also works through.
 *
 * The obvious approach is wrong. His examples occupy #1..#n and the past
 * papers follow, so it looks as though our past-paper entries simply continue
 * the count. They do not: he carries past papers we do not. On Higher Straight
 * Line he has six and we have three, so counting on would send our 2025 P1 Q2
 * to #14 — which is his 2023 P2 Q1. A pupil would get the wrong worked
 * solution, and nothing would look broken.
 *
 * So the match is on the past-paper label, read off his own page, never on
 * position. Anything that does not match is reported and left alone: no link
 * is much better than a confidently wrong one.
 *
 *   node scripts/add-mathsscot-links.mjs          # dry run
 *   node scripts/add-mathsscot-links.mjs --write  # apply
 */

const WRITE = process.argv.includes('--write');
const CACHE = 'node_modules/.cache/mathsscot';
const FILES = ['national5Maths', 'higherMaths', 'advancedHigherMaths'];

fs.mkdirSync(CACHE, { recursive: true });

/** Fetch a topic page, cached — his server should not be hit twice for the same page. */
async function page(url) {
  const key = path.join(CACHE, url.replace(/[^a-z0-9]+/gi, '_') + '.html');
  if (fs.existsSync(key)) return fs.readFileSync(key, 'utf8');
  const res = await fetch(url, { headers: { 'user-agent': 'clellandmaths-link-builder' } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const html = await res.text();
  fs.writeFileSync(key, html);
  await new Promise(r => setTimeout(r, 400));
  return html;
}

/**
 * Reduce a credit to year / variant / paper / question.
 *
 * The same question is written several ways: "SQA Higher Maths 2015 Paper 1 Q1"
 * on his Higher pages, "2015 P1 Q1" in ours, and "SQA Advanced Higher Maths
 * 2014 Q5" with no paper number at all, because those years had a single paper.
 */
function normalise(label) {
  const s = String(label)
    .replace(/specimen/gi, 'spec')
    .replace(/[^0-9a-z]+/gi, ' ')
    .trim()
    .toLowerCase();

  const year = (s.match(/(?:^|\s)((?:19|20)\d{2})(?:\s|$)/) || [])[1];
  const paper = (s.match(/(?:^|\s)paper\s*([12])(?:\s|$)/) || [])[1]
             ?? (s.match(/(?:^|\s)p\s*([12])(?:\s|$)/) || [])[1]
             ?? null;
  const qm = s.match(/(?:^|\s)q\s*(\d+)\s*([a-d])?(?:\s|$)/);
  if (!year || !qm) return null;

  const variant = /(?:^|\s)spec(?:\s|$)/.test(s) ? 'spec'
                : /(?:^|\s)exemplar(?:\s|$)/.test(s) ? 'exemplar'
                : '';
  const part = qm[2] ?? '';
  return {
    key: [year, variant, paper ?? '', qm[1], part].join('|'),
    loose: [year, variant, qm[1], part].join('|'),
  };
}

/** Build label -> anchor number for one topic page. */
function labelMap(html) {
  const exact = new Map();
  const loose = new Map();
  const anchors = [...html.matchAll(/id="(\d+)"/g)];
  for (let i = 0; i < anchors.length; i++) {
    const from = anchors[i].index;
    const to = i + 1 < anchors.length ? anchors[i + 1].index : html.length;
    const block = html.slice(from, to);
    const hash = Number(anchors[i][1]);
    for (const m of block.matchAll(/SQA[^<]{0,70}/g)) {
      const n = normalise(m[0]);
      if (!n) continue;
      if (!exact.has(n.key)) exact.set(n.key, hash);
      if (!loose.has(n.loose)) loose.set(n.loose, new Set());
      loose.get(n.loose).add(hash);
    }
  }
  return { exact, loose };
}

/**
 * Exact first. Failing that — his Advanced Higher credits carry no paper
 * number — fall back to year and question, but only when that identifies
 * exactly one question on the page. Two candidates is a guess, and a guess
 * here sends a pupil to the wrong solution.
 */
function findHash({ exact, loose }, label) {
  const n = normalise(label);
  if (!n) return null;
  if (exact.has(n.key)) return exact.get(n.key);
  const set = loose.get(n.loose);
  return set && set.size === 1 ? [...set][0] : null;
}

let matched = 0;
const unmatched = [];

for (const name of FILES) {
  const file = `src/practice/data/${name}.ts`;
  let src = fs.readFileSync(file, 'utf8');

  const topics = [];
  for (const m of src.matchAll(/name:\s*"([^"]+)",\s*\n\s*questions:\s*\[/g)) {
    topics.push({ name: m[1], start: m.index + m[0].length });
  }
  topics.forEach((t, i) => { t.end = i + 1 < topics.length ? topics[i + 1].start : src.length; });

  // Back to front, so earlier offsets stay valid as text is spliced in.
  for (const t of [...topics].reverse()) {
    const chunk = src.slice(t.start, t.end);
    const base = (chunk.match(/solutionUrl:\s*"(https:\/\/www\.maths\.scot\/[a-z0-9-]+\/[a-z0-9-]+)#/) || [])[1];
    if (!base) continue;   // authored-only topic, nothing of his to link to

    const map = labelMap(await page(base));
    const edits = [];
    const entryRe = /\{(?:(?!\}).)*?(?:ref|paper):\s*['"]([^'"]+)['"](?:(?!\}).)*?\}/gs;
    for (const m of chunk.matchAll(entryRe)) {
      if (/solutionUrl/.test(m[0])) continue;
      const n = findHash(map, m[1]);
      if (!n) { unmatched.push(`${name} / ${t.name} / ${m[1]}`); continue; }
      edits.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0].replace(/\s*\}$/, `, solutionUrl: "${base}#${n}" }`),
      });
      matched++;
    }
    let out = chunk;
    for (const e of [...edits].reverse()) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    src = src.slice(0, t.start) + out + src.slice(t.end);
  }

  if (WRITE) fs.writeFileSync(file, src);
}

console.log(`\nmatched and ${WRITE ? 'written' : 'ready to write'}: ${matched}`);
console.log(`could not match (left without a link): ${unmatched.length}`);
for (const u of unmatched.slice(0, 20)) console.log('   ' + u);
if (unmatched.length > 20) console.log(`   …and ${unmatched.length - 20} more`);
if (!WRITE) console.log('\ndry run — pass --write to apply');
