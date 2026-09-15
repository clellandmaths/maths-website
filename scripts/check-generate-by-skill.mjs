/**
 * Building a sheet by skill, without meeting 174 of them. In a real browser.
 *
 *   npm run build && node scripts/check-generate-by-skill.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * `offeredTopicGroups()` returns 30 topics holding 174 skills, and the skills
 * are the *generator's* taxonomy rather than a teacher's: Quadratics has
 * sixteen, of which nine are ways of sketching a parabola. Asking somebody who
 * wants "five quadratics" to invent a split across nine near-identical things
 * is asking the wrong question.
 *
 * So a topic carries its own count, spread across the skills inside it, and the
 * skills stay one click away for anyone who wants to target one. What has to be
 * true:
 *
 *   1. every topic can be counted without being opened
 *   2. the count lands on the skills — a topic's number IS the sum of its
 *      skills', so there is only ever one source of truth and opening a topic
 *      explains what the stepper did
 *   3. it spreads rather than piling onto the first skill
 *   4. the per-skill steppers still work, because targeting one was the point
 *      of having them
 *   5. there is a way back to the Explorer that reads as one
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8169, cdp: 9269, width: 1400, height: 1000 }, async ({ evaluate, click, go, sleep }) => {
  await go('/course/n5/generate', 4000);

  // ── 5. the way out ──────────────────────────────────────────────────────
  const back = await evaluate(`(() => {
    const a = [...document.querySelectorAll('a')]
      .find(x => /back to the explorer/i.test(x.textContent || ''));
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return { href: a.getAttribute('href'), px: parseFloat(getComputedStyle(a).fontSize),
             w: Math.round(r.width), h: Math.round(r.height) };
  })()`);
  t.check(!!back, 'the page offers a way back to the Explorer');
  t.check(back?.href?.startsWith('/explorer'), `which goes to the Explorer (${back?.href})`);
  /* The breadcrumb was always there and was reported as missing, because at
     12px muted grey it does not read as an action. This one has to be bigger
     than that or the fix is cosmetic. */
  t.check(back?.px >= 14 && back?.w > 100 && back?.h > 24,
    `and is a control, not a whisper (${back?.px}px, ${back?.w}x${back?.h})`);

  /** The topic rows, each with its own stepper. */
  const rows = () => evaluate(`(() => {
    const out = [];
    for (const row of document.querySelectorAll('div.flex.w-full.items-center.gap-1')) {
      const label = row.querySelector('button span');
      const n = row.querySelector('span.font-mono');
      if (label && n) out.push({ name: label.textContent.trim(), n: Number(n.textContent.trim()) });
    }
    return out;
  })()`);

  const before = await rows();
  t.check(before.length >= 25, `${before.length} topics, each with a count of its own`);
  t.check(before.every(r => r.n === 0), 'all starting at zero');

  // ── 1-3. count a topic without opening it ───────────────────────────────
  const quadIndex = before.findIndex(r => /Quadratics/i.test(r.name));
  t.check(quadIndex >= 0, 'Quadratics is one of them');

  const plus = `document.querySelectorAll('div.flex.w-full.items-center.gap-1')[${quadIndex}]
    .querySelector('[aria-label^="One more"]')`;
  for (let i = 0; i < 5; i++) { await click(plus); await sleep(180); }

  const after = await rows();
  t.check(after[quadIndex]?.n === 5, `five presses put five on it (${after[quadIndex]?.n})`);
  t.check(await evaluate(`/5 questions/.test(document.body.innerText)`),
    'and the sheet total says five questions');

  // ── 2 + 3. open it and see where they went ──────────────────────────────
  await click(`document.querySelectorAll('div.flex.w-full.items-center.gap-1')[${quadIndex}]
    .querySelector('button[aria-expanded]')`);
  await sleep(700);

  /* Scoped to the open topic's own list. An unscoped `li` sweep reported 18
     skills where the registry says Quadratics has 16 — it was catching list
     items from elsewhere on the page. They counted zero so no assertion broke,
     which is exactly why a number in a message has to be the number it says. */
  const skills = await evaluate(`(() => {
    const row = document.querySelectorAll('div.flex.w-full.items-center.gap-1')[${quadIndex}];
    const list = row?.parentElement?.querySelector('ul');
    const li = [...(list?.querySelectorAll('li') ?? [])];
    return li.map(l => ({
      name: (l.querySelector('span')?.textContent || '').trim(),
      n: Number((l.querySelector('span.font-mono')?.textContent || '0').trim()),
    })).filter(s => s.name);
  })()`);
  const held = skills.filter(s => s.n > 0);
  const sum = skills.reduce((n, s) => n + s.n, 0);

  t.check(skills.length >= 10, `it opens to ${skills.length} skills`);
  t.check(sum === 5, `whose counts sum to the topic's five (${sum})`);
  t.check(held.length >= 3,
    `spread across ${held.length} different skills, not piled on the first`);

  // ── 4. the per-skill stepper still works ────────────────────────────────
  await click(`(() => {
    const row = document.querySelectorAll('div.flex.w-full.items-center.gap-1')[${quadIndex}];
    return row?.parentElement?.querySelector('ul [aria-label^="One more"]');
  })()`);
  await sleep(500);
  const afterSkill = await rows();
  t.check(afterSkill[quadIndex]?.n === 6,
    `and targeting one skill still works, counting up to the topic (${afterSkill[quadIndex]?.n})`);
});

t.done('a sheet can be built by topic, with the skills still there underneath');
