/**
 * Handouts open with the question-maker they were made with, on the built site
 * (docs/link-versions.md; the owner, 2026-10-09: "I don't really want to annoy
 * any teachers who have homework out right now").
 *
 *   npm run build && node scripts/check-link-versions.mjs
 *
 * **Not in `build`**: it needs headless Chrome. verify-share-fixtures.mts proves
 * each version's questions in Node; this proves the pages:
 *
 *   - an old handout (no version mark) opens every question, the same each
 *     time it is opened;
 *   - the same sheet written as a new link opens different questions, so the
 *     old one really came from the frozen maker (these links were chosen,
 *     2026-10-09, because the current maker changes at least one of their
 *     questions);
 *   - the frozen maker's code is fetched only by old handouts: a new handout and
 *     a generated practice paper load none of it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { withPage, tally } from './browser-drive.mjs';
import { decodeRefs, encodeShortRefs, linkVersion, LINK_VERSION } from '../lib/worksheet-refs.mjs';

const t = tally();

// Recorded old links (scripts/fixtures/share-links-2026-10-01.json), all National 5
// generated, each with a question the current maker would change.
const OLD = [
  '_rv336xklv020_kd7cvqziccu0_zoo8x2k70tw0',
  '_bqsepgyskp80_k88uui4l5hs1_5w9q6anvsoq0_kyaffzjwgmg0_dt7nn79dc2m0',
  '_v0evlzg65ot1_8bvtbafrmo10_62c2lx89l4q0_bi8yrl83oo80_s5i700gys8q0',
  '_qjfc1cp72er0_9dj1rst04wu0_wxamlh2ysem0_lupwvx9qy3t0_wwt54bbkjul0_mo4fsl8gw4l1_gd0t3k6x3e80',
  '_qan8ka59fge0_cgc3dgnlk4o0_w3sbax5n8eh0_dqm1m8ypvo10_rv336zk7efp1_okfunvgounf0_buaq5fcc9ht0_g106f645cf00',
  '_j6f1ww8yt2c0_k2p9o3s3x250_qjfc1tucwzu1_51w4p3nvfjt0',
];
// Each must be in the recorded fixtures, so a typo here can't pass for a link.
const recordedQs = new Set(['share-links-2026-10-01.json', 'share-links-short-2026-10-01.json'].flatMap(f =>
  JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', f), 'utf8')).sheets.map(s => s.q)));
for (const q of OLD) t.check(recordedQs.has(q), `${q.slice(0, 14)}… is a recorded old link`);

const SHEET = `(() => {
  const m = /(\\d+) questions?/.exec(document.body.innerText);
  return { count: m ? Number(m[1]) : null, missing: /could not be found/.test(document.body.innerText),
    text: [...document.querySelectorAll('main')].map(e => e.innerText).join('') };
})()`;
const SCRIPTS = `performance.getEntriesByType('resource').map(r => r.name).filter(n => /\\.js(\\?|$)/.test(n)).map(n => n.split('/').pop())`;

await withPage({ port: 8151, cdp: 9251, width: 1280, height: 900 }, async ({ evaluate, go, sleep }) => {
  const settle = async () => {
    for (let i = 0; i < 40; i++) { if (await evaluate(`/\\d+ questions?/.test(document.body.innerText)`)) break; await sleep(500); }
    await sleep(1200);
  };
  const open = async q => {
    await go(`/worksheet?c=n5&q=${encodeURIComponent(q)}`, 1500);
    await settle();
    return { ...(await evaluate(SHEET)), scripts: await evaluate(SCRIPTS) };
  };

  const oldScripts = new Set(), newScripts = new Set();
  for (const full of OLD) {
    const refs = decodeRefs(full);
    const fresh = encodeShortRefs(refs);
    t.check(linkVersion(full) === 1 && linkVersion(fresh) === LINK_VERSION, `${full.slice(0, 14)}… reads as version 1, and written now as version ${LINK_VERSION}`);
    const a = await open(full);
    const b = await open(full);
    const n = await open(fresh);
    a.scripts.forEach(s => oldScripts.add(s));
    n.scripts.forEach(s => newScripts.add(s));
    t.check(a.count === refs.length && !a.missing, `the old link opens all ${refs.length} questions (${a.count}, missing: ${a.missing})`);
    t.check(a.text && a.text === b.text, '  and the same questions each time it is opened');
    t.check(n.count === refs.length && n.text !== a.text, '  the same sheet as a new link opens with the current maker instead (different questions)');
  }

  const frozenOnly = [...oldScripts].filter(s => !newScripts.has(s));
  t.check(frozenOnly.length > 0, `old handouts fetch ${frozenOnly.length} script file${frozenOnly.length === 1 ? '' : 's'} that new handouts never fetch (the frozen maker)`);
  const chunkKb = f => { try { return Math.round(fs.statSync(path.join(import.meta.dirname, '..', 'out', '_next', 'static', 'chunks', f)).size / 1024); } catch { return '?'; } };
  t.note(`frozen maker: ${frozenOnly.map(f => `${f} ${chunkKb(f)} KB`).join(', ')}`);
  t.note(`new handouts: ${[...newScripts].filter(s => !oldScripts.has(s)).map(f => `${f} ${chunkKb(f)} KB`).join(', ') || 'nothing old handouts do not also fetch'}`);

  // A page that makes new questions fetches none of the frozen maker.
  await go('/course/n5/generate/paper/2024/paper-1', 2500);
  for (let i = 0; i < 40; i++) { if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break; await sleep(1000); }
  await sleep(1500);
  const paper = await evaluate(SCRIPTS);
  const leaked = paper.filter(s => frozenOnly.includes(s));
  t.check(frozenOnly.length > 0 && leaked.length === 0, `a generated practice paper loads none of the frozen maker (${leaked.length} of its files)`);
});

t.done('every handout opens with the maker it was made with');
