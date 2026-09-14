/**
 * A generated question keeps the video of the paper question behind it.
 *
 *   npm run build && node scripts/check-generated-video.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * A generated question has no filmed solution of its own. The past paper
 * question it was modelled on does, and watching that worked is the tutorial:
 * same method, different numbers. Every producer has to attach it, and three of
 * them had forgotten.
 *
 * The symptoms were all one cause, and none of them looked like a video bug:
 *
 *   - the **QR code vanished** from a re-rolled question on the printed sheet
 *   - **full screen** said "Video solution coming soon" on a question whose
 *     tutorial exists
 *   - **focus mode** said the same
 *   - and a **shared sheet was right**, which made it look like sharing was the
 *     thing that worked rather than re-rolling being the thing that broke —
 *     `resolveWorksheet` attaches the video, and `handleReroll` did not
 *
 * So this drives the surface a teacher actually uses, after the action that
 * broke it, and reads the things they would have seen.
 *
 * A second, quieter bug lived in the same call: the re-roll dropped
 * `gen.parentIndex`, so a question modelled on several papers could come back
 * pointing at a different year's video than it had a moment before. That is
 * checked here by reading the caption before and after.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8136, cdp: 9236 }, async ({ evaluate, click, buttonNamed, buttonMatching, go, sleep }) => {
  await go('/explorer?c=n5', 4000);

  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === 'Fractions')`);
  await sleep(2500);

  // One generated question onto the sheet.
  t.check(await click(buttonNamed('Variation')), 'drew a variation');
  await sleep(3500);
  t.check(await click(buttonNamed('Add')), 'added it');
  await sleep(800);

  // Not buttonNamed: the tab reads "My Worksheet 1" once something is on it.
  await click(buttonMatching(/My Worksheet/));
  await sleep(1500);

  // QR codes are a toggle, and off by default.
  await click(`[...document.querySelectorAll('label')].find(e => /QR codes/i.test(e.textContent || ''))`);
  await sleep(1200);

  const read = () => evaluate(`(() => {
    const t = document.body.innerText;
    return {
      qr: document.querySelectorAll('img[alt="Scan for video solution"]').length,
      workedExample: /Watch a worked example/i.test(t),
      comingSoon: /Video solution coming soon/i.test(t),
      caption: (t.match(/worked example\\s*\\n?\\s*(\\d{4} P\\d Q\\d+)/i) || [])[1] ?? null,
    };
  })()`);

  const before = await read();
  t.check(before?.qr === 1, `the sheet shows a QR code (${before?.qr})`);
  t.check(before?.workedExample, 'and offers the worked example');
  t.check(!!before?.caption, `captioned with the paper behind it: ${JSON.stringify(before?.caption)}`);

  // ── the action that broke all of it ─────────────────────────────────────
  t.check(await click(
    `document.querySelector('[title="New numbers for this question"]')`), 'pressed re-roll');
  await sleep(4000);

  const after = await read();
  t.check(after?.qr === 1, `the QR code survives the re-roll (${after?.qr})`);
  t.check(after?.workedExample, 'and so does the worked example link');
  t.check(!after?.comingSoon, 'nothing says "Video solution coming soon"');
  t.check(after?.caption === before?.caption,
    `and it still points at the same paper: ${JSON.stringify(after?.caption)}`);

  // ── full screen, where two of the three symptoms showed ─────────────────
  await click(buttonNamed('Present'));
  await sleep(2500);
  const presented = await evaluate(`(() => {
    const t = document.body.innerText;
    return {
      open: !!document.querySelector('.fixed.inset-0'),
      workedExample: /Watch a worked example/i.test(t),
      comingSoon: /Video solution coming soon/i.test(t),
    };
  })()`);
  t.check(presented?.open, 'full screen opened on the re-rolled question');
  t.check(presented?.workedExample, 'it offers the worked example');
  t.check(!presented?.comingSoon, 'and does not say the video is coming soon');

  // ── focus mode, the other half of the same report ───────────────────────
  // It gates on `q.videoId` and falls through to "coming soon", so it broke
  // for exactly the same reason full screen did.
  await click(buttonMatching(/^Close$/));
  await sleep(1000);
  await click(buttonNamed('Focus'));
  await sleep(2500);
  const focused = await evaluate(`(() => {
    const t = document.body.innerText;
    return {
      open: !!document.querySelector('.fixed.inset-0'),
      workedExample: /Watch a worked example/i.test(t),
      comingSoon: /Video solution coming soon/i.test(t),
    };
  })()`);
  t.check(focused?.open, 'focus mode opened');
  t.check(focused?.workedExample, 'it offers the worked example too');
  t.check(!focused?.comingSoon, 'and does not say the video is coming soon');

  // ── the same question generated on a practice page ──────────────────────
  await go('/course/n5/practice/surds', 3000);
  await click(buttonNamed('Give me a question'));
  await sleep(4500);
  const practice = await evaluate(
    `/the video for \\d{4} P\\d Q\\d+ shows this method/i.test(document.body.innerText)`);
  t.check(practice, 'a practice question names the video that shows its method');
});

t.done('a generated question keeps the video of the paper behind it');
