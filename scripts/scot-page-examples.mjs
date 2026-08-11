// Read one maths.scot topic page and list its worked examples.
//
// Parse on the visible text "Example N", not on markup. Two earlier attempts
// counted the wrong thing:
//
//   - every numbered anchor: id="1" on several pages is a tutor promo, not an
//     example, which inflated the count
//   - anchors carrying class="example": Example 1's anchor does NOT carry it,
//     because the tutor block sits between the anchor and the example, so the
//     count came out one short and a real question looked missing
//
// The heading text is what a reader sees and is the thing to trust.
//
//   node scripts/scot-page-examples.mjs nat5/fractions
import path from 'node:path';

// Always fetched, never cached. An earlier version kept pages under
// node_modules/.cache and it quietly served a copy of
// advanced-higher/differentiation from before eight questions were added,
// reporting 17 examples where the page has 25 — with nothing to say the
// answer was stale. One second of network is worth more than that.
export async function pageHtml(slug) {
  const url = `https://www.maths.scot/${slug}`;
  const res = await fetch(url, { headers: { 'user-agent': 'clellandmaths-link-builder' } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  await new Promise(r => setTimeout(r, 400));   // be gentle when looping pages
  return res.text();
}

const strip = s => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&times;/g, '×')
  .replace(/\s+/g, ' ')
  .trim();

/** Every worked example on the page, in order. */
export function examples(html) {
  const text = strip(html);
  // "Example 7 (calculator) SQA National 5 Maths 2014 P2 Q9 [3 marks] Express..."
  const re = /Example\s+(\d+)\s*\(([^)]*)\)/g;
  const hits = [...text.matchAll(re)];
  return hits.map((m, i) => {
    const start = m.index;
    const end = i + 1 < hits.length ? hits[i + 1].index : text.length;
    const body = text.slice(start, end);
    // paper credit, if this example is a past paper question
    const credit = (body.match(/(?:SQA|QS)\s+(?:N5|National\s*5|Higher|Advanced\s*Higher)[^[]*?((?:19|20)\d\d[^[]*?)(?:\[|Show)/i) || [])[1];
    return {
      n: Number(m[1]),
      calc: m[2].trim(),
      credit: credit ? credit.replace(/\s+/g, ' ').trim() : null,
      text: body.replace(/^Example\s+\d+\s*\([^)]*\)\s*/, '')
                .replace(/^(?:SQA|QS)[^[]*\[[^\]]*\]\s*/, '')
                .replace(/\s*Show solution[\s\S]*$/, '')
                .trim(),
    };
  });
}

// Only act as a CLI when THIS file is the entry point. Comparing
// import.meta.url to argv[1] is unreliable on Windows (spaces, backslashes), so
// compare basenames instead — and it must be guarded, or importing this module
// makes it treat the importer's first argument as a page slug.
const isEntry = path.basename(process.argv[1] ?? '') === 'scot-page-examples.mjs';
const slug = isEntry && process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
if (slug) {
  const list = examples(await pageHtml(slug));
  console.log(`${slug} — ${list.length} worked examples\n`);
  for (const e of list)
    console.log(`  #${String(e.n).padStart(2)}  ${(e.credit ?? 'his own example').padEnd(28)} ${e.text.slice(0, 66)}`);
}
