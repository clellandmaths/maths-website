/**
 * Pin the short link format the day it was made (2026-10-01).
 *
 *   npx tsx scripts/record-short-fixtures.mts > scripts/fixtures/share-links-short-2026-10-01.json
 *
 * 200 short links, from the site's paper questions and the generator's codes
 * with new four-character seeds (and, in some, old six-character seeds kept
 * from a re-shared sheet), each with what it reads and a fingerprint of every
 * generated question. `check-share-refs.mjs` holds every build to the
 * references, `verify-share-fixtures.mts` to the questions: the alphabet, the
 * paper slots and the link ids can then never move a link that has been shared.
 * Never re-record.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { decodeRefs, encodeShortRefs, generatedRef, LINK_ALPHABET, SHORT_SEED_LENGTH, spellsInLink } from '../lib/worksheet-refs.mjs';
import { LINK_ID_CODES } from '../lib/link-ids.mjs';
import { questionFromCode } from '../lib/generated-question';

const root = path.resolve(import.meta.dirname, '..');
let state = 20261002;
const rand = () => { state = (state * 1103515245 + 12345) % 2147483648; return state / 2147483648; };
const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];
const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';

const papers: string[] = [];
for (const d of ['src/n5/pastpapers', 'src/higher/pastpapers', 'src/ah/pastpapers', 'src/n5apps', 'src/higherapps']) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
    let mod: Record<string, any>;
    try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) p.questions.forEach((_: unknown, i: number) => papers.push(`${v.year}-${p.paperNumber}-${i}`));
    }
  }
}
const codes: string[] = [];
for (const code of (LINK_ID_CODES as string[]).filter(Boolean)) {
  try { if (await questionFromCode(code, '2222', 0, 0)) codes.push(code); } catch { /* not a sheet question */ }
}
const shortSeed = () => { for (;;) { const s = Array.from({ length: SHORT_SEED_LENGTH }, () => pick([...LINK_ALPHABET])).join(''); if (!spellsInLink(s)) return s; } };
const oldSeed = () => Array.from({ length: 6 }, () => B36[Math.floor(rand() * 36)]).join('');

async function fingerprint(ref: string): Promise<string | null> {
  const [, code, seed, parent] = ref.split(':');
  const q = await questionFromCode(code, seed, 0, parseInt(parent, 36));
  if (!q) return null;
  const body = JSON.stringify([q.question, (q as any).answer, (q as any).solution, (q as any).videoId, (q as any).basedOn, (q as any).paperLabel]);
  return createHash('sha256').update(body).digest('hex').slice(0, 16);
}

const sheets = [];
for (let n = 0; n < 200; n++) {
  const share = n < 50 ? 0 : n < 100 ? 1 : 0.6;
  const refs = Array.from({ length: 1 + Math.floor(rand() * 20) }, () =>
    rand() < share ? generatedRef(pick(codes), n >= 170 && rand() < 0.3 ? oldSeed() : shortSeed(), rand() < 0.8 ? 0 : 1) : pick(papers));
  const q = encodeShortRefs(refs);
  if (!q) throw new Error(`did not pack: ${refs}`);
  if (JSON.stringify(decodeRefs(q)) !== JSON.stringify(refs)) throw new Error(`did not come back: ${q}`);
  const questions: Record<string, string | null> = {};
  for (const r of refs) if (r.startsWith('g:') && !(r in questions)) questions[r] = await fingerprint(r);
  sheets.push({ format: 'short', q, refs, questions });
}
console.log(JSON.stringify({ recorded: '2026-10-01', from: 'website short-links, the short format as first made', sheets }, null, 1));
