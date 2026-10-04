/**
 * Every link recorded in scripts/fixtures/share-links-2026-10-01.json still
 * opens the same questions: `decodeRefs` reads the same references, and every
 * generated question the engine makes from them has the recorded fingerprint.
 *
 *   npx tsx scripts/verify-share-fixtures.mts
 *
 * By hand rather than in the build, because it needs the engine (a .ts file,
 * which a Cloudflare build script cannot import). `check-share-refs.mjs` holds
 * the references in every build; this holds the questions behind them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { decodeRefs } from '../lib/worksheet-refs.mjs';
import { questionFromCode } from '../lib/generated-question';

// The links made before the short format, and the short ones pinned the day it was made.
type Sheet = { format: string; q: string; refs: string[]; questions: Record<string, string | null> };
const sheets: Sheet[] = ['share-links-2026-10-01.json', 'share-links-short-2026-10-01.json']
  .flatMap(f => (JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', f), 'utf8')) as { sheets: Sheet[] }).sheets);

/**
 * Questions the owner has since changed on purpose, accepted by name
 * (`fixtures/share-links-accepted.json`): the N5 full read's confirmed changes,
 * checked one by one on 2026-10-04. The 1 October files stay as recorded, the
 * evidence of what old links opened; a link passes on its recording or on its
 * accepted entry, and on nothing else.
 */
const accepted: Record<string, { question: string }> =
  JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', 'share-links-accepted.json'), 'utf8')).links;

/** The same fingerprint the recorder took. */
async function fingerprint(ref: string): Promise<string | null> {
  const [, code, seed, parent] = ref.split(':');
  const q = await questionFromCode(code, seed, 0, parseInt(parent, 36));
  if (!q) return null;
  const body = JSON.stringify([q.question, (q as any).answer, (q as any).solution, (q as any).videoId, (q as any).basedOn, (q as any).paperLabel]);
  return createHash('sha256').update(body).digest('hex').slice(0, 16);
}

let bad = 0, refs = 0, generated = 0;
for (const s of sheets) {
  const got = decodeRefs(s.q);
  refs += got.length;
  if (JSON.stringify(got) !== JSON.stringify(s.refs)) {
    bad++;
    if (bad <= 5) console.log(`FAIL ${s.format} ${s.q.slice(0, 40)}…: reads ${JSON.stringify(got).slice(0, 120)}`);
    continue;
  }
  for (const [ref, want] of Object.entries(s.questions)) {
    generated++;
    const have = await fingerprint(ref);
    if (have !== want && have !== accepted[ref]?.question) { bad++; if (bad <= 5) console.log(`FAIL ${ref}: question ${have}, recorded ${want}`); }
  }
}
console.log(`${sheets.length} recorded links, ${refs} questions, ${generated} generated questions re-made: ${bad ? `${bad} FAILED` : 'every one the same'}`);
if (bad) process.exit(1);
