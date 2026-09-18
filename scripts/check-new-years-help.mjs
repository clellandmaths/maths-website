/**
 * The hint ladder and the markscheme, on the two newest papers.
 *
 *   npm run build && node scripts/check-new-years-help.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * 2025 and 2026 are the years whose clones have just been rewritten question by
 * question, and the years whose marking instructions were transcribed last. Two
 * things could be true and invisible: a question could lose its Hint button
 * because the variation behind it was split or its citation moved, and the
 * printed markscheme could come up empty for a year whose scheme is newest.
 *
 * `check-no-markscheme.mjs` proves the *mechanism* — a question with no scheme
 * offers no button, using 2021 as its fixture. This proves the *coverage* for
 * the two years that have just changed.
 *
 * The markscheme is not a page. It is a button on the generated practice paper,
 * which imports `PAPER_MARKSCHEME` on demand and fills a hidden sheet, so it is
 * driven where it lives rather than at a URL of its own.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/**
 * Which years to drive. Defaults to the two newest; pass others as arguments
 * when a year is reviewed — `node scripts/check-new-years-help.mjs 2024 2023`.
 *
 * The question counts are read from the paper page itself rather than listed
 * here, so a year can be added without looking anything up.
 */
const YEARS = process.argv.slice(2).filter(a => /^\d{4}$/.test(a));
const PAPERS = (YEARS.length ? YEARS : ['2026', '2025'])
  .flatMap(y => [[y, 'paper-1'], [y, 'paper-2']]);
const name = ([year, paper]) => `${year} ${paper === 'paper-1' ? 'P1' : 'P2'}`;

await withPage({ port: 8177, cdp: 9277, width: 1400, height: 1100 }, async ({
  evaluate, click, go, sleep,
}) => {
  // ── the hint ladder, on the archive page ──────────────────────────────
  /** How many questions the real paper has, counted on its own page. */
  const counted = new Map();

  for (const spec of PAPERS) {
    const [year, paper] = spec;
    const label = name(spec);
    await go(`/course/n5/papers/${year}/${paper}`, 4000);

    const count = await evaluate(`
      document.querySelectorAll('[data-question], article, section.question').length
      || [...document.querySelectorAll('span')]
           .filter(s => /^\d{4} P[12] Q\d+$/.test((s.textContent||'').trim())).length`);
    counted.set(label, count);
    t.check(count > 0, `${label}: the paper page lists ${count} questions`);

    const buttons = await evaluate(`
      [...document.querySelectorAll('button')]
        .filter(b => /hint/i.test(b.textContent || '')).length`);
    t.check(buttons >= count, `${label}: ${buttons} Hint buttons for ${count} questions`);

    const noneNote = await evaluate(`/No hints on this one/i.test(document.body.innerText)`);
    t.check(!noneNote, `${label}: no question says it has no hints`);

    await click(`[...document.querySelectorAll('button')].find(b => /hint/i.test(b.textContent || ''))`);
    await sleep(1200);
    const rung = await evaluate(`(() => {
      const d = document.querySelector('[role="dialog"], .fixed');
      return d ? (d.innerText || '').trim() : '';
    })()`);
    t.check(rung.length > 40, `${label}: the ladder opens and says something`);
    await evaluate(`document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
    await sleep(400);
  }

  // ── the markscheme, on the generated paper ────────────────────────────
  for (const spec of PAPERS) {
    const [year, paper] = spec;
    const label = name(spec);
    const count = counted.get(label) ?? 0;
    await go(`/course/n5/generate/paper/${year}/${paper}`, 6000);

    const has = await evaluate(`
      !![...document.querySelectorAll('button')].find(b => /markscheme/i.test(b.textContent || ''))`);
    t.check(has, `${label}: the generated paper offers a Markscheme button`);
    if (!has) continue;

    await click(`[...document.querySelectorAll('button')].find(b => /markscheme/i.test(b.textContent || ''))`);
    await sleep(2500);

    // The sheet is portaled to the body and hidden until printing, so it is
    // read from the DOM by its own class. Searching for the words "marking
    // instructions" instead matched the whole page - the paper's own intro
    // says them - and reported four thousand characters of the paper as if it
    // were the scheme.
    const sheet = await evaluate(`(() => {
      const el = document.querySelector('.markscheme-doc');
      return el ? (el.textContent || '').trim() : '';
    })()`);
    t.check(sheet.length > 400, `${label}: the markscheme sheet fills (${sheet.length} chars)`);
    const rows = await evaluate(`
      document.querySelectorAll('.markscheme-doc .markscheme-question').length`);
    t.check(rows === count, `${label}: ${rows} question sections for ${count} questions`);
  }
});

t.done('hints and markschemes hold on 2025 and 2026');
