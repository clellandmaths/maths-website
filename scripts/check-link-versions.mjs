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
// Recorded version 2 links (scripts/fixtures/share-links-v2-2026-10-09.json), each holding an Advanced
// Higher question version 3 changes (a widened card, or the paper's own question now kept out), 2026-10-10.
const V2 = [
  '.y_2bhr2ps6_2qbtvhx2_22jgl9k2_2hxtxt62_2fxvxvs6_22ztmc62_2rwtpnr2_2mhxz276_22rbdxb2_2fzdpvt6_2g9kzfp2_2qtl7fv2_2g2qvsq2_2shf2r92',
  '.y_2v6zmdp2_2tjmt2t2_2rlpngs2_2g2tpvs2_2j.z.2mnn2_27q2rlb2_2stdl6r2_2r7vkbf2_27zlrl22_2ntcqqx2_2fmrjnj2_2nk92bh2_2lc7jpq6_2svvgjh6',
  '.y_2flj87m6_2glrhcd2_28bk2bg2_28fzpfd2_2tszbbd2_2v97hb82_2kcvgtq2_27cdz926_26x8p9g2_2jw8v6n2_2jrlrh72_2fzbnjk2_2gpllz22_2w9wkb92_2q9zjtz2',
  '.y_2qszwws6_2t8mnrd2_272wqxt6_2h7rwlj2_2plvs2s2_2k9b6vl2',
];
// Each must be in the recorded fixtures, so a typo here can't pass for a link.
const recordedQs = new Set(['share-links-2026-10-01.json', 'share-links-short-2026-10-01.json'].flatMap(f =>
  JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', f), 'utf8')).sheets.map(s => s.q)));
for (const q of OLD) t.check(recordedQs.has(q), `${q.slice(0, 14)}… is a recorded old link`);
const recordedV2 = new Set(JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', 'share-links-v2-2026-10-09.json'), 'utf8')).sheets.map(s => s.q));
for (const q of V2) t.check(recordedV2.has(q), `${q.slice(0, 14)}… is a recorded version 2 link`);

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
  const open = async (q, course = 'n5') => {
    await go(`/worksheet?c=${course}&q=${encodeURIComponent(q)}`, 1500);
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

  // Version 2 handouts (Advanced Higher questions version 3 changes), the same way, by version 2's frozen maker.
  const v2Scripts = new Set();
  for (const full of V2) {
    const refs = decodeRefs(full);
    const fresh = encodeShortRefs(refs);
    t.check(linkVersion(full) === 2 && linkVersion(fresh) === LINK_VERSION, `${full.slice(0, 14)}… reads as version 2, and written now as version ${LINK_VERSION}`);
    const a = await open(full, 'ah');
    const b = await open(full, 'ah');
    const n = await open(fresh, 'ah');
    a.scripts.forEach(s => v2Scripts.add(s));
    n.scripts.forEach(s => newScripts.add(s));
    t.check(a.count === refs.length && !a.missing, `the version 2 link opens all ${refs.length} questions (${a.count}, missing: ${a.missing})`);
    t.check(a.text && a.text === b.text, '  and the same questions each time it is opened');
    t.check(n.count === refs.length && n.text !== a.text, '  the same sheet as a new link opens with the current maker instead (different questions)');
  }
  const v2Only = [...v2Scripts].filter(s => !newScripts.has(s) && !oldScripts.has(s));
  t.check(v2Only.length > 0, `version 2 handouts fetch ${v2Only.length} script file${v2Only.length === 1 ? '' : 's'} that no new handout and no version 1 handout fetches (version 2's frozen maker)`);
  t.note(`version 2's frozen maker: ${v2Only.map(f => `${f} ${chunkKb(f)} KB`).join(', ')}`);

  // A page that makes new questions fetches none of either frozen maker: National 5's and Advanced Higher's papers.
  const frozen = [...frozenOnly, ...v2Only];
  for (const route of ['/course/n5/generate/paper/2024/paper-1', '/course/ah/generate/paper/2025/paper-2']) {
    await go(route, 2500);
    for (let i = 0; i < 40; i++) { if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break; await sleep(1000); }
    await sleep(1500);
    const paper = await evaluate(SCRIPTS);
    const leaked = paper.filter(s => frozen.includes(s));
    t.check(frozenOnly.length > 0 && v2Only.length > 0 && leaked.length === 0, `a generated practice paper (${route}) loads none of the frozen makers (${leaked.length} of their files)`);
  }
});

t.done('every handout opens with the maker it was made with');
