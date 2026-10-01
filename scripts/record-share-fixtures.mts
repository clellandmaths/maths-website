/**
 * Record what today's shared-worksheet links open, before the link format
 * changes (the owner, 2026-10-01: shorter links that cannot spell words, with
 * every existing link still working).
 *
 *   npx tsx scripts/record-share-fixtures.mts > scripts/fixtures/share-links-2026-10-01.json
 *
 * Run ONCE, on the code that made the links already in circulation (website
 * navigation 1327ce2 plus the generator sync f0bb981). It builds links exactly
 * as that code does, in both of its formats: the spelled-out "2026-1-4,…" and
 * the packed "c14_xqt6z3f9a1b0…", from the site's own paper questions and the
 * generator's own variation codes with random six-character seeds. For each it
 * records what `decodeRefs` reads and, for every generated question, a
 * fingerprint of the question the engine makes from it.
 *
 * `check-share-refs.mjs` (every build) holds `decodeRefs` to the recorded
 * references; `verify-share-fixtures.mts` (by hand, it needs the engine)
 * holds the questions to their fingerprints. Never re-record: the file is the
 * evidence of what old links opened.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { packRef, packGenerated, decodeRefs } from '../lib/worksheet-refs.mjs';
import { VARIATION_CODES } from '../lib/generator/generators/variation-codes';
import { questionFromCode } from '../lib/generated-question';

const root = path.resolve(import.meta.dirname, '..');

// A fixed stream, so the file is reproducible from this script and this commit.
let state = 20261001;
const rand = () => { state = (state * 1103515245 + 12345) % 2147483648; return state / 2147483648; };
const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];
const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
const seed6 = () => Array.from({ length: 6 }, () => B36[Math.floor(rand() * 36)]).join('');

// Every paper question on the site, as check-share-refs reads them.
const papers: { year: string | number; paperNumber: number; questionIndex: number }[] = [];
for (const d of ['src/n5/pastpapers', 'src/higher/pastpapers', 'src/ah/pastpapers', 'src/n5apps', 'src/higherapps']) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
    let mod: Record<string, any>;
    try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) p.questions.forEach((_: unknown, i: number) => papers.push({ year: v.year, paperNumber: p.paperNumber, questionIndex: i }));
    }
  }
}
// Only the codes a sheet can carry: warm-up variations refuse to go on one.
const codes: string[] = [];
for (const code of Object.values(VARIATION_CODES)) {
  try { if (await questionFromCode(code, '000000', 0, 0)) codes.push(code); } catch { /* not a sheet question */ }
}

/** A fingerprint of what a generated reference opens: its question, answer and steps. */
async function fingerprint(ref: string): Promise<string | null> {
  const [, code, seed, parent] = ref.split(':');
  const q = await questionFromCode(code, seed, 0, parseInt(parent, 36));
  if (!q) return null;
  const body = JSON.stringify([q.question, (q as any).answer, (q as any).solution, (q as any).videoId, (q as any).basedOn, (q as any).paperLabel]);
  return createHash('sha256').update(body).digest('hex').slice(0, 16);
}

type Item = { kind: 'paper'; ref: string; token: string } | { kind: 'gen'; ref: string; token: string };
function item(generated: boolean): Item {
  if (generated) {
    const code = pick(codes), seed = seed6(), parent = rand() < 0.8 ? 0 : 1;
    return { kind: 'gen', ref: `g:${code}:${seed}:${parent}`, token: packGenerated(code, seed, parent)! };
  }
  const p = pick(papers);
  return { kind: 'paper', ref: `${p.year}-${p.paperNumber}-${p.questionIndex}`, token: packRef(p)! };
}

const sheets: { format: string; q: string; refs: string[]; questions: Record<string, string | null> }[] = [];
const shapes: [string, number, number][] = [
  // format, how many sheets, share of generated questions
  ['packed', 150, 0.6], ['packed-paper-only', 50, 0], ['packed-generated-only', 50, 1], ['spelled-out', 50, 0],
];
for (const [format, count, share] of shapes) {
  for (let s = 0; s < count; s++) {
    const items = Array.from({ length: 1 + Math.floor(rand() * 20) }, () => item(rand() < share));
    const q = format === 'spelled-out' ? items.map(i => i.ref).join(',') : items.map(i => i.token).join('');
    const refs = decodeRefs(q);
    const questions: Record<string, string | null> = {};
    for (const r of refs) if (r.startsWith('g:') && !(r in questions)) questions[r] = await fingerprint(r);
    sheets.push({ format, q, refs, questions });
  }
}
console.log(JSON.stringify({ recorded: '2026-10-01', from: 'website navigation 1327ce2 + f0bb981', sheets }, null, 1));
