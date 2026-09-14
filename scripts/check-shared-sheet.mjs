/**
 * What a shared worksheet card looks like to the person doing it.
 *
 *   npm run build && node scripts/check-shared-sheet.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * `/worksheet` is the sheet a pupil is handed. On a phone its cards had two
 * faults, and both spent space that the maths needed:
 *
 *   - **a 64px QR code and its caption sat above the question**, often above a
 *     question only two lines long. A QR code exists so somebody can scan a
 *     *printed* sheet; you cannot scan the screen you are holding, and a
 *     "Watch a worked example" button is right there on the card
 *   - **the controls came out in three ragged rows** — a lone Hint, then
 *     Formulae and Show answer, then Watch a worked example on its own —
 *     because hints rendered in their own block above the others rather than
 *     in the row with them
 *
 * So: no QR below 640px, QR from a tablet up where a second device makes sense,
 * QR always on paper, and every control in one wrapping row.
 *
 * It drives a real shared sheet rather than a hand-made URL: the practice paper
 * page builds one and hands over answers, hints, video and QR codes, which is
 * the state these faults were reported in.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

const AT = [['phone', 390, 844, false], ['tablet', 768, 1024, true], ['desk', 1280, 900, true]];

for (const [where, width, height, wantQr] of AT) {
  await withPage({ port: 8148, cdp: 9248, width, height }, async ({ evaluate, click, send, go, sleep }) => {
    await go('/course/n5/generate/paper/2024/paper-1', 2500);
    for (let i = 0; i < 40; i++) {
      if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break;
      await sleep(1000);
    }
    await click(`[...document.querySelectorAll('button')]
      .find(x => /open as a worksheet/i.test(x.textContent || ''))`);
    await sleep(7000);

    const on = await evaluate(`location.pathname === '/worksheet'`);
    t.check(on, `${where} ${width}px · opened a shared sheet`);
    if (!on) return;

    const card = await evaluate(`(() => {
      const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const qrs = [...document.querySelectorAll('img[alt="Scan for video solution"]')];
      // The first card's controls, and how many lines they occupy.
      const rows = [...document.querySelectorAll('div')]
        .filter(d => d.className && String(d.className).includes('flex-wrap')
          && [...d.querySelectorAll('button')].some(b => /show answer/i.test(b.textContent || '')));
      const row = rows[rows.length - 1];
      const btns = [...(row?.querySelectorAll('button') ?? [])].filter(laid);
      return {
        qrTotal: qrs.length,
        qrLaidOut: qrs.filter(laid).length,
        buttons: btns.map(b => b.textContent.trim()),
        lines: new Set(btns.map(b => Math.round(b.getBoundingClientRect().top))).size,
        hintInRow: btns.some(b => b.textContent.trim() === 'Hint'),
      };
    })()`);

    t.check((card?.qrTotal ?? 0) > 0, `${where} · the sheet carries QR codes (${card?.qrTotal})`);
    t.check(wantQr ? card?.qrLaidOut > 0 : card?.qrLaidOut === 0,
      `${where} · QR codes are ${wantQr ? 'shown' : 'hidden'} on screen (${card?.qrLaidOut} laid out)`);

    t.check(card?.hintInRow, `${where} · the Hint sits in the row with the other controls`);
    t.check((card?.lines ?? 9) <= 2,
      `${where} · ${card?.buttons?.length} controls on ${card?.lines} line(s): ${JSON.stringify(card?.buttons)}`);

    // Whatever the screen does, paper keeps its QR — that is what it is for.
    await send('Emulation.setEmulatedMedia', { media: 'print' });
    await sleep(500);
    const onPaper = await evaluate(`[...document.querySelectorAll('img[alt="Scan for video solution"]')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length`);
    await send('Emulation.setEmulatedMedia', { media: '' });
    t.check(onPaper > 0, `${where} · and they are still there in print (${onPaper})`);
  });
}

t.done('a shared sheet spends its space on the maths');
