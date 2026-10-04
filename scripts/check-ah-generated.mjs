/**
 * Advanced Higher's generated questions on the built site (2026-10-04, the
 * port: worksheet_generator_ah/docs/verdicts/ah/port.md). Driven in Chrome.
 *
 *   npm run build && node scripts/check-ah-generated.mjs
 *
 * **Not in `build`**: it needs headless Chrome. What it holds the site to,
 * surface by surface, each one a place National 5's generated questions
 * already reach:
 *
 *   a shared sheet   made from chosen cards' codes and seeds: every question
 *                    opens, the same twice, maths typeset (no `$`, no KaTeX
 *                    error), a hint opens the card's own ladder, its video is
 *                    its paper question's, no sideways scroll on a phone,
 *                    figures follow the dark theme, Test mode withholds help
 *   the Builder      announces generating, generates on a subtopic, and its
 *                    printed markscheme names each card's paper and draws a
 *                    sketch question's finished sketches (never Show answer)
 *   the Exam Hall    "5 new questions like today's", as a short shared link
 *   practice         "Keep practising" gives an Advanced Higher question
 *
 * The cards are chosen for what Advanced Higher has and National 5 does not:
 * a sketch answered in drawings (2021 P1 Q7), a ten-mark differential
 * equation (2016 Q15), an augmented matrix (2016 Q4), vector lines (2016
 * Q14), a figure in the question (2016 Q12), and a card from a paper with
 * videos (2024 P1 Q3).
 */
import fs from 'node:fs';
import path from 'node:path';
import { withPage, tally } from './browser-drive.mjs';
import { encodeShortRefs, generatedRef, spellsInLink, SHORT_MARK } from '../lib/worksheet-refs.mjs';

const t = tally();
const root = path.resolve(import.meta.dirname, '..');

const codesSrc = fs.readFileSync(path.join(root, 'lib/generator/generators/ah/codes.ts'), 'utf8');
const codeOf = id => new RegExp(`'${id.replace('.', '\\.')}':\\s*'([0-9a-z]{5})'`).exec(codesSrc)?.[1];
const CARDS = ['ah.2021-p1-q7', 'ah.2016-q15', 'ah.2016-q4', 'ah.2016-q14', 'ah.2016-q12', 'ah.2024-p1-q3'];
const SEEDS = ['bcdf', 'ghjk', 'lmnp', 'qrst', 'vwxz', 'b2c6'];
const refs = CARDS.map((id, i) => {
  const code = codeOf(id);
  if (!code) { console.error(`\n  no code for ${id} in the synced ah/codes.ts. Nothing was checked.\n`); process.exit(1); }
  return generatedRef(code, SEEDS[i], 0);
});
const q = encodeShortRefs(refs);
const SHEET = `/worksheet?c=ah&q=${q}`;

/** What a sheet shows, read once it has drawn. */
const READ = `(() => {
  const main = document.querySelector('main');
  const text = main?.innerText ?? '';
  const m = /(\\d+) questions?/.exec(document.body.innerText);
  return {
    count: m ? Number(m[1]) : null,
    missing: /could not be found/.test(document.body.innerText),
    questions: document.querySelectorAll('.question-content').length,
    dollar: /[$]/.test([...document.querySelectorAll('.question-content, .answer-content')].map(e => e.innerText).join(' ')),
    katex: document.querySelectorAll('.question-content .katex').length,
    errors: document.querySelectorAll('.katex-error').length,
    text: text.slice(0, 6000),
  };
})()`;

await withPage({ port: 8161, cdp: 9261, width: 1280, height: 900 }, async ({ evaluate, click, buttonNamed, go, sleep, send }) => {
  const settle = async () => {
    for (let i = 0; i < 40; i++) { if (await evaluate(`/\\d+ questions?/.test(document.body.innerText)`)) break; await sleep(500); }
    await sleep(1500);
  };

  // ── a shared sheet of chosen cards ──────────────────────────────────────
  t.check(q.startsWith(SHORT_MARK) && !spellsInLink(q), `the sheet's link is short and spells nothing (${q.slice(0, 14)}…)`);
  await go(`${SHEET}&o=ahv`, 1500);
  await settle();
  const first = await evaluate(READ);
  t.check(first?.count === CARDS.length && !first?.missing,
    `a shared Advanced Higher sheet opens all ${CARDS.length} questions (${first?.count}, missing: ${first?.missing})`);
  t.check(first?.questions >= CARDS.length, `and draws each (${first?.questions})`);
  t.check(!first?.dollar, 'no dollar sign reaches the page');
  t.check(first?.katex > 0 && first?.errors === 0, `the maths is typeset (${first?.katex} KaTeX, ${first?.errors} errors)`);
  t.check(/\(\s*d\s*\)|lambda|λ/i.test(first?.text ?? '') || (first?.text ?? '').length > 500, 'and reads as Advanced Higher questions');

  await go(`${SHEET}&o=ahv`, 1500);
  await settle();
  const again = await evaluate(READ);
  t.check(again?.text === first?.text, 'opening the link again shows exactly the same questions');

  // The video: 2024 P1 Q3's paper question has one, so its card borrows it.
  t.check(await evaluate(`[...document.querySelectorAll('button')].some(b => /worked example/i.test(b.textContent || ''))`),
    "a card from a paper with videos offers its paper question's video as a worked example");

  // A hint opens the card's own ladder.
  await click(`[...document.querySelectorAll('button')].find(b => (b.textContent || '').trim() === 'Hint')`);
  await sleep(2500);
  const hint = await evaluate(`(() => {
    const o = [...document.querySelectorAll('.fixed.inset-0')].pop();
    return { asks: /what it asks/i.test(o?.innerText ?? ''), dollar: /[$]/.test(o?.innerText ?? '$') };
  })()`);
  t.check(hint?.asks, "a Hint opens the generated card's own ladder");
  t.check(!hint?.dollar, 'and the ladder carries no dollar sign');
  await click(`[...document.querySelectorAll('button')].find(b => /close/i.test(b.getAttribute('aria-label') || b.textContent || ''))`);
  await sleep(800);

  // Show answer gives the answer, never the marking instructions' drawings.
  await click(`[...document.querySelectorAll('button')].find(b => /show answer/i.test(b.textContent || ''))`);
  await sleep(1500);
  t.check(!(await evaluate(`!!document.querySelector('.markscheme-figures')`)),
    "Show answer gives the answer and not the sketch question's finished sketches");

  // Figures follow the theme: drawn in currentColor, light on a dark page.
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await go(`${SHEET}&o=ahv`, 1500);
  await settle();
  const ink = await evaluate(`(() => {
    const svg = document.querySelector('.question-content svg');
    if (!svg) return null;
    // Through a canvas pixel, so any colour syntax the browser reports
    // (rgb, oklch, color()) comes back as plain 0 to 255.
    const c = document.createElement('canvas').getContext('2d');
    c.fillStyle = getComputedStyle(svg).color;
    c.fillRect(0, 0, 1, 1);
    const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  })()`);
  t.check(ink !== null && ink > 0.5, `a question's figure is drawn light on the dark theme (luminance ${ink?.toFixed?.(2)})`);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });

  // Test mode: the sheet is the sheet.
  await go(`${SHEET}&o=t`, 1500);
  await settle();
  const test = await evaluate(`(() => {
    const b = [...document.querySelectorAll('button')].map(x => (x.textContent || '').trim());
    return { answer: b.some(x => /show answer/i.test(x)), hint: b.includes('Hint') };
  })()`);
  t.check(test && !test.answer && !test.hint, `Test mode withholds answers and hints on Advanced Higher cards (${JSON.stringify(test)})`);

  // ── the Builder ─────────────────────────────────────────────────────────
  await go('/explorer?c=ah', 4000);
  t.check(await evaluate(`/generate brand-new/i.test(document.body.innerText)`),
    'the Worksheet Builder says Advanced Higher questions can be generated');

  // The sheet in the Builder, and its printed markscheme.
  await go(`/explorer?c=ah&q=${q}`, 8000);
  await evaluate(`window.print = () => {}`);
  t.check(await click(`[...document.querySelectorAll('button')].find(b => /markscheme|marking instructions/i.test(b.textContent || ''))`),
    'pressed the printed markscheme');
  await sleep(4000);
  const ms = await evaluate(`(() => {
    const doc = document.querySelector('.markscheme-doc');
    const text = doc?.innerText ?? '';
    return {
      based: (text.match(/Generated — based on \\d{4}/g) || []).length,
      sketch: /based on 2021 P1 Q7/.test(text),
      figures: doc?.querySelectorAll('.markscheme-figures svg').length ?? 0,
      dollar: /[$]/.test(text),
    };
  })()`);
  t.check(ms?.based === CARDS.length, `the markscheme names the paper behind each of the ${CARDS.length} (${ms?.based})`);
  t.check(ms?.sketch && ms?.figures >= 1, `and draws the sketch question's finished sketches (${ms?.figures})`);
  t.check(!ms?.dollar, 'with no dollar sign in it');
  await evaluate(`document.body.removeAttribute('data-print')`);

  // Generate on a subtopic.
  await go('/explorer?c=ah', 4000);
  await evaluate(`sessionStorage.removeItem('worksheet_ah')`);
  await go('/explorer?c=ah', 4000);
  // Advanced Higher's filter is by topic, then subtopic: Number Theory brings
  // both its subtopics as chips, and pressing a chip takes it away again.
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === 'Number Theory')`);
  await sleep(2000);
  await click(`[...document.querySelectorAll('button')].find(e => e.textContent.trim() === 'Number bases')`);
  await sleep(2000);
  t.check(await evaluate(`[...document.querySelectorAll('button')].some(e => e.textContent.trim() === 'Euclidean algorithm')
      && ![...document.querySelectorAll('button')].some(e => e.textContent.trim() === 'Number bases')`),
    'filtered to the Euclidean algorithm alone');
  t.check(await click(`[...document.querySelectorAll('button')].find(b => /^Generate/i.test((b.textContent || '').trim()))`),
    'pressed Generate');
  await sleep(12000);
  const made = await evaluate(`(() => {
    let items = [];
    try { items = JSON.parse(sessionStorage.getItem('worksheet_ah') || '[]'); } catch {}
    return { n: items.length, generated: items.filter(x => (x.uid || '').startsWith('g:')).length,
      based: items.map(x => (x.basedOn || [])[0]) };
  })()`);
  t.check(made?.n > 0 && made?.generated === made?.n, `generated ${made?.n} on the subtopic: ${JSON.stringify(made?.based)}`);

  // ── the Exam Hall ───────────────────────────────────────────────────────
  await go('/exam-hall', 1500);
  await evaluate(`localStorage.setItem('preferredCourse', 'ah')`);
  await go('/exam-hall', 3500);
  await click(`[...document.querySelectorAll('*')].find(el => el.tagName !== 'BODY' && el.tagName !== 'HTML' &&
    /Daily revision session/.test(el.textContent || '') && el.querySelector('h2')?.textContent?.trim() === 'Warm Up')`);
  await sleep(3500);
  for (let i = 0; i < 6; i++) { if (!(await click(buttonNamed('Next')))) break; await sleep(700); }
  await click(buttonNamed('Finish'));
  await sleep(1500);
  t.check(await evaluate(`/new questions like today/i.test(document.body.innerText)`),
    "the Advanced Higher warm up's completion screen offers five new questions like today's");
  await click(`[...document.querySelectorAll('button')].find(b => /new questions like today/i.test(b.textContent || ''))`);
  await sleep(10000);
  const landed = await evaluate(`({ path: location.pathname, c: new URLSearchParams(location.search).get('c'),
    q: new URLSearchParams(location.search).get('q') ?? '', n: document.querySelectorAll('.question-content').length })`);
  t.check(landed?.path === '/worksheet' && landed?.c === 'ah', `it lands on an Advanced Higher shared sheet (${landed?.path}, c=${landed?.c})`);
  t.check(landed?.q.startsWith(SHORT_MARK) && !spellsInLink(landed.q), 'with a short link that spells nothing');
  t.check(landed?.n === 5, `five questions on it (${landed?.n})`);

  // ── the generated practice paper (the owner: "Should get generated practice paper") ──
  for (const [path, name] of [['/course/ah/generate/paper/2024/paper-1', '2024 Paper 1'], ['/course/ah/generate/paper/2019/paper-1', '2019 Paper']]) {
    await go(path, 2500);
    for (let i = 0; i < 60; i++) { if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break; await sleep(1000); }
    await sleep(1500);
    const paper = await evaluate(`({
      n: document.querySelectorAll('.question-content').length,
      none: /no new question could be made/i.test(document.body.innerText),
      named: document.body.innerText.includes(${JSON.stringify(name)}),
      paperOne: ${JSON.stringify(name)} === '2019 Paper' && /2019 Paper 1/.test(document.body.innerText),
      dollar: /[$]/.test([...document.querySelectorAll('.question-content')].map(e => e.innerText).join(' ')),
    })`);
    t.check(paper?.n > 3 && !paper?.none && !paper?.dollar,
      `a practice paper like ${name}: ${paper?.n} new questions, none missing, none with a dollar sign`);
    t.check(paper?.named && !paper?.paperOne, `and it is called "${name}"`);
  }
  await click(`[...document.querySelectorAll('button')].find(x => /open as a worksheet/i.test(x.textContent || ''))`);
  await sleep(8000);
  t.check(await evaluate(`location.pathname === '/worksheet' && new URLSearchParams(location.search).get('c') === 'ah'`),
    'and it opens as an Advanced Higher shared sheet');

  // ── practice ────────────────────────────────────────────────────────────
  await go('/course/ah/practice/differentiation', 3000);
  t.check(await evaluate(`/keep practising/i.test(document.body.innerText)`), 'an Advanced Higher practice topic offers more questions');
  await click(`[...document.querySelectorAll('button')].find(b => /give me a question/i.test(b.textContent || ''))`);
  await sleep(6000);
  t.check(await evaluate(`/new question/i.test(document.body.innerText) && !!document.querySelector('.card-face .question-content .katex')`),
    'and gives one, typeset');
});

// ── the phone ─────────────────────────────────────────────────────────────
for (const width of [390, 320]) {
  await withPage({ port: 8162, cdp: 9262, width, height: 844 }, async ({ evaluate, go, sleep }) => {
    await go(`${SHEET}&o=ahv`, 1500);
    for (let i = 0; i < 40; i++) { if (await evaluate(`/\\d+ questions?/.test(document.body.innerText)`)) break; await sleep(500); }
    await sleep(2000);
    const wide = await evaluate(`({ page: document.documentElement.scrollWidth, screen: innerWidth })`);
    t.check(wide?.page <= wide?.screen, `${width}px · the sheet does not scroll sideways (${wide?.page} in ${wide?.screen})`);
  });
}

t.done('Advanced Higher generated questions, on every surface National 5 has them');
