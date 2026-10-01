/**
 * Shared links on the real site, old and new (the owner, 2026-10-01: shorter
 * links that cannot spell words, with every existing link still working).
 *
 *   npm run build && node scripts/check-short-links.mjs
 *
 * **Not in `build`**: it needs headless Chrome. check-share-refs (in build)
 * proves the references; verify-share-fixtures.mts proves the questions behind
 * them; this proves the pages:
 *
 *   - links recorded before the change, and short links pinned when it was
 *     made, open with every question and none reported missing;
 *   - a sheet the site makes now ("Open as a worksheet" on a generated paper)
 *     gets a short link with no vowel and no listed word, and opening that
 *     link again shows exactly the same questions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { withPage, tally } from './browser-drive.mjs';
import { spellsInLink, SHORT_MARK } from '../lib/worksheet-refs.mjs';

const t = tally();
const root = path.resolve(import.meta.dirname, '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures', f), 'utf8')).sheets;
// Generated questions are National 5's, so these open as N5 sheets; paper
// questions in the fixtures come from every course, so only the generated-only
// sheets are opened here (the references of the rest are proved in build).
const old = read('share-links-2026-10-01.json').filter(s => s.format === 'packed-generated-only').slice(0, 8);
const short = read('share-links-short-2026-10-01.json').filter(s => s.refs.every(r => r.startsWith('g:'))).slice(0, 8);

const SHEET = `(() => {
  const m = /(\\d+) questions?/.exec(document.body.innerText);
  return { count: m ? Number(m[1]) : null, missing: /could not be found/.test(document.body.innerText),
    text: [...document.querySelectorAll('main')].map(e => e.innerText).join('').slice(0, 4000) };
})()`;

await withPage({ port: 8149, cdp: 9249, width: 1280, height: 900 }, async ({ evaluate, click, go, sleep }) => {
  const settle = async () => {
    for (let i = 0; i < 30; i++) { if (await evaluate(`/\\d+ questions?/.test(document.body.innerText)`)) break; await sleep(500); }
    await sleep(800);
  };
  for (const [label, sheets] of [['an old link', old], ['a pinned short link', short]]) {
    for (const s of sheets) {
      await go(`/worksheet?c=n5&q=${s.q}`, 1500);
      await settle();
      const got = await evaluate(SHEET);
      t.check(got?.count === s.refs.length && !got?.missing,
        `${label} with ${s.refs.length} questions opens all of them (${got?.count}, missing: ${got?.missing})`);
    }
  }

  // A sheet made now: its link is short, clean, and opens the same questions again.
  await go('/course/n5/generate/paper/2024/paper-1', 2500);
  for (let i = 0; i < 40; i++) { if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break; await sleep(1000); }
  await click(`[...document.querySelectorAll('button')].find(x => /open as a worksheet/i.test(x.textContent || ''))`);
  await sleep(7000);
  const first = await evaluate(`({ href: location.href, ...${SHEET} })`);
  const q = new URL(first?.href ?? 'http://x').searchParams.get('q') ?? '';
  t.check(q.startsWith(SHORT_MARK), `a sheet made now gets a short link (q starts "${q.slice(0, 12)}")`);
  t.check(!spellsInLink(q), 'and it spells nothing on the list');
  const outsideKept = q.slice(1).replace(/_\.?_(?:[0-9a-z]\.?){12}/g, '');
  t.check(!/[aeiou01345]/.test(outsideKept), 'and has no vowel or vowel-like digit');
  t.check(first?.count > 0 && !first?.missing, `and opens all ${first?.count} questions`);

  await go(`/worksheet?${new URL(first.href).searchParams.toString()}`, 1500);
  await settle();
  const again = await evaluate(SHEET);
  t.check(again?.text === first?.text && again?.count === first?.count,
    `opening that link again shows exactly the same ${again?.count} questions`);
});

t.done('short links');
