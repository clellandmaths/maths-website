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

await withPage({ port: 8133, cdp: 9233 }, async ({ evaluate, click, send, go, sleep }) => {
  // ── 5. the two ways in ──────────────────────────────────────────────────
  await go('/course/n5/papers/2024/paper-1', 2500);
  t.check(await evaluate(`/generate a practice paper/i.test(document.body.innerText)`),
    'the National 5 paper page offers one');
  await go('/course/higher/papers/2024/paper-1', 2000);
  t.check(!(await evaluate(`/generate a practice paper/i.test(document.body.innerText)`)),
    'the Higher paper page does not — no audited variations there');

  /* The archive is where people actually are, and "Practice Paper" beside
     "Start Paper" and "Focus Mode" read as a third way to sit the same one. */
  await go('/course/n5', 3500);
  const onArchive = await evaluate(`(() => {
    const a = [...document.querySelectorAll('a')]
      .find(x => /new paper like this/i.test(x.textContent || ''));
    return a ? { href: a.getAttribute('href'), title: a.getAttribute('title') || '' } : null;
  })()`);
  t.check(!!onArchive, 'the archive says "New Paper Like This", not just "Practice Paper"');
  t.check(/generate\/paper\//.test(onArchive?.href ?? ''),
    `pointing at the builder: ${JSON.stringify(onArchive?.href)}`);
  t.check(/modelled question by question/i.test(onArchive?.title ?? ''),
    'and explains itself on hover');

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
          exits: ['Print / Save PDF', 'Open as a worksheet', 'Another practice paper']
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
    t.check(state.exits, `${where}: print, share and another-paper all offered`);
  }

  /* ── what would actually print ─────────────────────────────────────────
     `window.print()` fires; the question is what the page hands the printer.
     This one had no `no-print` on its header, so the title and all four
     buttons printed, and its question blocks were not `.worksheet-question`,
     so they missed the white-card-and-black-text rules entirely and came out
     in the page's own dark styling. */
  await go('/course/n5/generate/paper/2024/paper-1', 2000);
  for (let i = 0; i < 40; i++) {
    if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break;
    await sleep(1000);
  }
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  await sleep(600);
  const printed = await evaluate(`(() => {
    /* Rendered, not merely styled. getComputedStyle(el).display returns the
       element's OWN display, so a button inside a hidden header still reports
       inline-flex and looks visible. A zero-sized box is the fact: an element
       inside a display-none ancestor has no layout at all.
       (No backticks in here - this whole expression is a template literal.) */
    const vis = el => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const shown = t => [...document.querySelectorAll('button, a')]
      .filter(el => new RegExp(t, 'i').test(el.textContent || '') && vis(el)).length;
    return {
      questions: document.querySelectorAll('.worksheet-question').length,
      printButton: shown('Print'),
      shareButton: shown('Open as a worksheet'),
      anotherButton: shown('Another practice paper'),
      nav: vis(document.querySelector('nav')),
    };
  })()`);
  await send('Emulation.setEmulatedMedia', { media: '' });

  t.check(printed?.questions > 0, `print: ${printed?.questions} question blocks carry the print class`);
  t.check(printed?.printButton === 0, 'print: the Print button is not on the paper');
  t.check(printed?.shareButton === 0, 'print: nor the share button');
  t.check(printed?.anotherButton === 0, 'print: nor the another-paper button');
  t.check(!printed?.nav, 'print: nor the site navigation');

  /* ── the shared link hands over everything ─────────────────────────────
     A locked handout withholds answers, hints and video, which is right when a
     teacher chose that. Nobody chose it here. */
  const link = await evaluate(`(() => {
    const b = [...document.querySelectorAll('button')]
      .find(x => /open as a worksheet/i.test(x.textContent || ''));
    return !!b;
  })()`);
  t.check(link, 'the page offers "Open as a worksheet"');
  await click(`[...document.querySelectorAll('button')]
    .find(x => /open as a worksheet/i.test(x.textContent || ''))`);
  await sleep(6000);
  const opened = await evaluate(`({
    path: location.pathname,
    flags: new URLSearchParams(location.search).get('o') || '',
  })`);
  t.check(opened?.path === '/worksheet', `it opens a worksheet (${opened?.path})`);
  for (const [flag, name] of [['a', 'answers'], ['h', 'hints'], ['v', 'video'], ['q', 'QR codes']]) {
    t.check((opened?.flags ?? '').includes(flag),
      `and hands over ${name} (o=${opened?.flags})`);
  }
});

t.done(ALL ? 'all 22 National 5 papers clone whole' : 'a paper clones whole');
