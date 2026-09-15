import { withPage } from './browser-drive.mjs';
await withPage({ port: 8165, cdp: 9265, width: 1600, height: 1000 }, async ({ evaluate, click, go, sleep }) => {
  const tick = async y => { await click(`[...document.querySelectorAll('label,button')].find(e => e.textContent.trim() === '${y}')`); await sleep(1800); };
  const snap = () => evaluate(`(() => {
    const g = document.querySelector('.browse-grid');
    const r = g ? g.getBoundingClientRect() : null;
    return {
      cards: document.querySelectorAll('.question-card').length,
      scrollY: Math.round(scrollY),
      docH: Math.round(document.documentElement.scrollHeight),
      maxScroll: Math.round(document.documentElement.scrollHeight - innerHeight),
      gridTopFromViewport: r ? Math.round(r.top) : null,
      gridBottomFromViewport: r ? Math.round(r.bottom) : null,
    };
  })()`);

  await go('/explorer?c=n5', 7000);
  for (const y of ['2024','2023','2022','2019']) await tick(y);
  console.log('after ticking 4 years      ', JSON.stringify(await snap()));

  await evaluate(`scrollTo(0, document.documentElement.scrollHeight)`);
  await sleep(900);
  console.log('scrolled to the bottom     ', JSON.stringify(await snap()));

  await tick('2024');   // untick the first one
  console.log('after UNTICKING one year   ', JSON.stringify(await snap()));
});
