/**
 * A whole practice paper, drawn in a real browser.
 *
 *   npm run build && node scripts/check-practice-paper.mjs
 *   node scripts/check-practice-paper.mjs --all     every National 5 paper
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * `/course/n5/generate/paper/<year>/paper-<n>` draws one new question for each
 * question of a real paper. It can only work because every one of the 328
 * National 5 past paper questions has an exam-tier variation modelled on it,
 * which `check-variation-reach.mjs` proves from the registry. This proves the
 * other half: that the page actually produces them.
 *
 * What has to be true:
 *
 *   1. every slot fills — as many questions as the real paper has
 *   2. every question is **different**. A paper cloned from a single variation
 *      twice over would pass a count and fail a reader, so the rendered bodies
 *      are compared, not the uids
 *   3. both mark totals are shown. They are not promised to be equal: the
 *      marks that ship come from step marks rather than a declared total, and
 *      a candidate matches its model for 319 of 328 questions
 *   4. the three exits appear once it has finished
 *   5. the paper page links to it, and only for National 5
 *
 * By default this drives two papers — one of each kind. `--all` drives all 22,
 * which is the run to do after touching the registry.
 */
import { withPage, tally } from './browser-drive.mjs';

const ALL = process.argv.includes('--all');
const t = tally();

/** Year/paper pairs to drive. One P1 and one P2 unless --all. */
const PAPERS = ALL
  ? [2026, 2025, 2024, 2023, 2022, 2019, 2018, 2017, 2016, 2015, 2014].flatMap(y => [[y, 1], [y, 2]])
  : [[2024, 1], [2019, 2]];

await withPage({ port: 8133, cdp: 9233 }, async ({ evaluate, go, sleep }) => {
  // ── 5. the way in ───────────────────────────────────────────────────────
  await go('/course/n5/papers/2024/paper-1', 2500);
  t.check(await evaluate(`/generate a practice paper/i.test(document.body.innerText)`),
    'the National 5 paper page offers one');
  await go('/course/higher/papers/2024/paper-1', 2000);
  t.check(!(await evaluate(`/generate a practice paper/i.test(document.body.innerText)`)),
    'the Higher paper page does not — no audited variations there');

  for (const [year, paper] of PAPERS) {
    await go(`/course/n5/generate/paper/${year}/paper-${paper}`, 2000);

    // Drawing is sequential and yields between questions, so give it room.
    // 19 questions is the longest paper in the archive.
    let state = null;
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      state = await evaluate(`(() => {
        const t = document.body.innerText;
        const busy = /Drawing question/.test(t);
        const arts = [...document.querySelectorAll('article')];
        const bodies = arts.map(a => (a.querySelector('.question-content')?.innerText ?? '')
          .replace(/\\s+/g, ' ').trim().slice(0, 60)).filter(Boolean);
        const m = t.match(/(\\d+) questions? · (\\d+) marks \\(the original is (\\d+)\\)/);
        return {
          busy,
          slots: arts.length,
          filled: bodies.length,
          distinct: new Set(bodies).size,
          missing: /could not be generated/.test(t),
          counted: m ? { n: +m[1], marks: +m[2], original: +m[3] } : null,
          exits: ['Print / Save PDF', 'Open as a worksheet', 'Add all to my sheet']
            .every(s => t.includes(s)),
        };
      })()`);
      if (state && !state.busy && state.counted) break;
    }

    const where = `${year} P${paper}`;
    if (!state || state.busy || !state.counted) {
      t.check(false, `${where}: never finished drawing`);
      continue;
    }

    t.check(state.filled === state.slots,
      `${where}: ${state.filled} of ${state.slots} slots filled`);
    t.check(!state.missing, `${where}: no question was left unclonable`);
    t.check(state.distinct === state.filled,
      `${where}: all ${state.distinct} questions are different`);
    t.check(state.counted.original > 0 && state.counted.marks > 0,
      `${where}: ${state.counted.marks} marks against the original's ${state.counted.original}`);
    t.check(state.exits, `${where}: print, share and add-to-sheet all offered`);
  }
});

t.done(ALL ? 'all 22 National 5 papers clone whole' : 'a paper clones whole');
