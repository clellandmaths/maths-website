/**
 * Every recorded link still opens the same questions: `decodeRefs` reads the
 * same references, and every generated question made from them, by the
 * question-maker the link was made with, has the recorded fingerprint.
 *
 *   npx tsx scripts/verify-share-fixtures.mts
 *
 * By hand rather than in the build, because it needs the engine (a .ts file,
 * which a Cloudflare build script cannot import). `check-share-refs.mjs` holds
 * the references in every build; this holds the questions behind them.
 *
 * **Each link through its own version's maker** (2026-10-09,
 * `lib/link-engines.ts`), exactly as the handout page opens it:
 *   - `share-links-2026-10-01.json` and `share-links-short-2026-10-01.json`:
 *     links made before versions (version 1), opened by the frozen copy of the
 *     maker live until 2026-10-09;
 *   - `share-links-v2-2026-10-09.json`: version 2 links, opened by the current
 *     maker. **If these fail after a generator change, the change moves what
 *     shared links open: raise LINK_VERSION and freeze the maker it replaces**
 *     (docs/link-versions.md). Never re-record them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { decodeRefs, linkVersion } from '../lib/worksheet-refs.mjs';
import { engineForVersion } from '../lib/link-engines';

type Sheet = { format: string; q: string; refs: string[]; questions: Record<string, string | null> };
const FILES = ['share-links-2026-10-01.json', 'share-links-short-2026-10-01.json', 'share-links-v2-2026-10-09.json'];
const sheets: Sheet[] = FILES.flatMap(f => {
  const file = path.join(import.meta.dirname, 'fixtures', f);
  if (!fs.existsSync(file)) { console.log(`FAIL ${f} is missing`); process.exitCode = 1; return []; }
  return (JSON.parse(fs.readFileSync(file, 'utf8')) as { sheets: Sheet[] }).sheets;
});

/**
 * Questions the owner has since changed on purpose, accepted by name
 * (`fixtures/share-links-accepted.json`): the N5 full read's confirmed changes,
 * checked one by one on 2026-10-04. The 1 October files stay as recorded, the
 * evidence of what old links opened; a link passes on its recording or on its
 * accepted entry, and on nothing else.
 */
const accepted: Record<string, { question: string }> =
  JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', 'share-links-accepted.json'), 'utf8')).links;

/** The same fingerprint the recorders took. */
async function fingerprint(ref: string, version: number): Promise<string | null> {
  const [, code, seed, parent] = ref.split(':');
  const q = await (await engineForVersion(version)).questionFromCode(code, seed, 0, parseInt(parent, 36));
  if (!q) return null;
  const body = JSON.stringify([q.question, (q as any).answer, (q as any).solution, (q as any).videoId, (q as any).basedOn, (q as any).paperLabel]);
  return createHash('sha256').update(body).digest('hex').slice(0, 16);
}

let bad = 0, refs = 0, generated = 0;
const byVersion = new Map<number, { links: number; generated: number }>();
for (const s of sheets) {
  const version = linkVersion(s.q);
  const tally = byVersion.get(version) ?? { links: 0, generated: 0 };
  byVersion.set(version, tally);
  tally.links++;
  const got = decodeRefs(s.q);
  refs += got.length;
  if (JSON.stringify(got) !== JSON.stringify(s.refs)) {
    bad++;
    if (bad <= 5) console.log(`FAIL ${s.format} ${s.q.slice(0, 40)}…: reads ${JSON.stringify(got).slice(0, 120)}`);
    continue;
  }
  for (const [ref, want] of Object.entries(s.questions)) {
    generated++;
    tally.generated++;
    const have = await fingerprint(ref, version);
    if (have !== want && have !== accepted[ref]?.question) { bad++; if (bad <= 5) console.log(`FAIL v${version} ${ref}: question ${have}, recorded ${want}`); }
  }
}
for (const [v, t] of [...byVersion].sort((a, b) => a[0] - b[0])) {
  console.log(`  version ${v}: ${t.links} links, ${t.generated} generated questions`);
}
console.log(`${sheets.length} recorded links, ${refs} questions, ${generated} generated questions re-made: ${bad ? `${bad} FAILED` : 'every one the same'}`);
if (bad) process.exit(1);
