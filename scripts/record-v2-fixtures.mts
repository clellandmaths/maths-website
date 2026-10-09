/**
 * Pin version 2 links the day version 2 was made (2026-10-09).
 *
 *   npx tsx scripts/record-v2-fixtures.mts > scripts/fixtures/share-links-v2-2026-10-09.json
 *
 * 200 version 2 links (marked "y" after the "."; lib/worksheet-refs.mjs),
 * from the site's paper questions and every variation code, National 5 and
 * Advanced Higher, with new four-character seeds, each with what it reads and a
 * fingerprint of every generated question as the current maker makes it.
 * `verify-share-fixtures.mts` then holds the current maker to them: a later
 * generator change that moves what a version 2 link opens fails there, and the
 * remedy is a new version with this maker frozen (docs/link-versions.md).
 * Never re-record.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  decodeRefs, encodeShortRefs, generatedRef, linkVersion, LINK_ALPHABET, LINK_VERSION, SHORT_SEED_LENGTH, spellsInLink,
} from '../lib/worksheet-refs.mjs';
import { LINK_ID_CODES } from '../lib/link-ids.mjs';
import { engineForVersion } from '../lib/link-engines';

if (LINK_VERSION !== 2) throw new Error(`this records version 2; LINK_VERSION is ${LINK_VERSION}`);
const engine = await engineForVersion(2);
const root = path.resolve(import.meta.dirname, '..');
let state = 20261009;
const rand = () => { state = (state * 1103515245 + 12345) % 2147483648; return state / 2147483648; };
const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];

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
  try { if (await engine.questionFromCode(code, '2222', 0, 0)) codes.push(code); } catch { /* not a sheet question */ }
}
const shortSeed = () => { for (;;) { const s = Array.from({ length: SHORT_SEED_LENGTH }, () => pick([...LINK_ALPHABET])).join(''); if (!spellsInLink(s)) return s; } };

async function fingerprint(ref: string): Promise<string | null> {
  const [, code, seed, parent] = ref.split(':');
  const q = await engine.questionFromCode(code, seed, 0, parseInt(parent, 36));
  if (!q) return null;
  const body = JSON.stringify([q.question, (q as any).answer, (q as any).solution, (q as any).videoId, (q as any).basedOn, (q as any).paperLabel]);
  return createHash('sha256').update(body).digest('hex').slice(0, 16);
}

const sheets = [];
for (let n = 0; n < 200; n++) {
  const share = n < 50 ? 0 : n < 100 ? 1 : 0.6;
  const refs = Array.from({ length: 1 + Math.floor(rand() * 20) }, () =>
    rand() < share ? generatedRef(pick(codes), shortSeed(), rand() < 0.8 ? 0 : 1) : pick(papers));
  const q = encodeShortRefs(refs);
  if (!q) throw new Error(`did not pack: ${refs}`);
  if (linkVersion(q) !== 2) throw new Error(`not a version 2 link: ${q}`);
  if (JSON.stringify(decodeRefs(q)) !== JSON.stringify(refs)) throw new Error(`did not come back: ${q}`);
  const questions: Record<string, string | null> = {};
  for (const r of refs) if (r.startsWith('g:') && !(r in questions)) questions[r] = await fingerprint(r);
  sheets.push({ format: 'short-v2', q, refs, questions });
}
console.log(JSON.stringify({
  recorded: '2026-10-09',
  from: 'website never-the-paper, version 2 links (generator hint-quality aeb97f0) as first made',
  codes: codes.length,
  sheets,
}, null, 1));
