/**
 * The hint panel and the keyboard (the independent audit, card 14; the owner: "Yes", 2026-10-12), proved with real key
 * presses in Chrome on the built site, in full screen, where it mattered most:
 *   - opening a hint moves focus into the panel;
 *   - Tab stays inside it;
 *   - an arrow key does not change the question behind it;
 *   - Escape closes the hint and ONLY the hint (it used to close the whole presenter underneath);
 *   - focus goes back to the Hint button.
 *
 *   node scripts/check-hint-keys.mjs   (after npm run build)
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();
const OVERLAY = `document.querySelector('.fixed.inset-0')`;
const PANEL = `document.querySelector('[role="dialog"][aria-label="Hint"]')`;
const QUESTION = `(${OVERLAY}?.querySelector('.question-content')?.innerText ?? '')`;
const hintButton = `[...(${OVERLAY}?.querySelectorAll('button') ?? [])].find(b => /^hint$/i.test((b.textContent || '').trim()))`;

await withPage({ port: 8193, cdp: 9293 }, async ({ send, evaluate, click, buttonNamed, go, sleep }) => {
  const key = async (k, code, vk, shift = false) => {
    for (const type of ['keyDown', 'keyUp']) {
      await send('Input.dispatchKeyEvent', { type, key: k, code, windowsVirtualKeyCode: vk, modifiers: shift ? 8 : 0 });
    }
    await sleep(300);
  };
  await go('/course/n5/papers', 3000);
  await click(buttonNamed('Start Paper'));
  await sleep(4000);
  t.check(await evaluate(`!!${OVERLAY}`), 'a National 5 paper opens full screen');
  const question = await evaluate(QUESTION);
  t.check(question.length > 10, 'and shows its first question');

  // A real mouse press at the button, as a tap is: a script's click() moves no focus, so it would leave nothing for
  // the panel to hand focus back to.
  const at = JSON.parse(await evaluate(`(() => { const r = ${hintButton}.getBoundingClientRect(); return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 }); })()`));
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', { type, x: at.x, y: at.y, button: 'left', clickCount: 1 });
  }
  await sleep(2500);
  t.check(await evaluate(`!!${PANEL}`), 'Hint opens the hint panel');
  t.check(await evaluate(`${PANEL}?.contains(document.activeElement) ?? false`), 'focus moves into the panel');

  for (let i = 0; i < 6; i++) await key('Tab', 'Tab', 9);
  t.check(await evaluate(`${PANEL}?.contains(document.activeElement) ?? false`), 'six Tabs later, focus is still inside it');
  await key('Tab', 'Tab', 9, true);
  t.check(await evaluate(`${PANEL}?.contains(document.activeElement) ?? false`), 'and Shift+Tab too');

  await key('ArrowRight', 'ArrowRight', 39);
  t.check(await evaluate(QUESTION) === question && await evaluate(`!!${PANEL}`),
    'an arrow key does not change the question behind the open hint');

  await key('Escape', 'Escape', 27);
  t.check(!(await evaluate(`!!${PANEL}`)), 'Escape closes the hint');
  t.check(await evaluate(`!!${OVERLAY}`), 'and only the hint: full screen is still open');
  t.check(await evaluate(`/^hint$/i.test((document.activeElement?.textContent || '').trim())`), 'focus is back on the Hint button');

  await key('Escape', 'Escape', 27);
  await sleep(500);
  t.check(!(await evaluate(`!!${OVERLAY}`)), 'a second Escape closes full screen, as before');
});

t.done('the hint panel and the keyboard');
