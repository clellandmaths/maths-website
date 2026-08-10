import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Reconcile Andrew's own list of new questions against what we hold.
 *
 * He sent the anchors directly, which is a better source than crawling: the
 * earlier scan derived each topic's page from an existing solutionUrl in that
 * topic, so any topic with no link yet — indices, vectors, number theory and a
 * dozen more — was skipped without appearing to be.
 *
 * For each anchor this reports what it actually is (his own example, or a past
 * paper question and which), whether we already carry it, and whether the ref
 * would resolve against the archive. Only past paper questions are candidates:
 * his worked examples are his writing.
 *
 * Resolution is checked the way lib/practice-loader.ts does it, against the
 * label in each question's own badge — because a ref that misses resolves to
 * nothing and drops out of the sheet with no error.
 *
 * Read-only.
 *   node scripts/reconcile-mathsscot.mjs <list.txt>
 */

const LIST = process.argv[2];
if (!LIST || !fs.existsSync(LIST)) { console.error('usage: node scripts/reconcile-mathsscot.mjs <list.txt>'); process.exit(1); }

const CACHE = 'node_modules/.cache/mathsscot';
fs.mkdirSync(CACHE, { recursive: true });

async function page(url) {
  const key = path.join(CACHE, url.replace(/[^a-z0-9]+/gi, '_') + '.html');
  if (fs.existsSync(key)) return fs.readFileSync(key, 'utf8');
  const res = await fetch(url, { headers: { 'user-agent': 'clellandmaths-link-builder' } });
  if (!res.ok) throw new Error(`${res.status}`);
  const html = await res.text();
  fs.writeFileSync(key, html);
  await new Promise(r => setTimeout(r, 400));
  return html;
}

/**
 * The block of HTML belonging to one anchor.
 *
 * The match lands on the id attribute, which is part-way through an opening
 * tag, so the slice has to be walked back to the '<' — otherwise stripping
 * tags leaves the rest of that tag's attributes behind as if they were text
 * ('class="example" style="..."') and the credit is read out of markup.
 */
function blockFor(html, hash) {
  const anchors = [...html.matchAll(/id="(\d+)"/g)];
  for (let i = 0; i < anchors.length; i++) {
    if (Number(anchors[i][1]) !== hash) continue;
    let from = anchors[i].index;
    const lt = html.lastIndexOf('<', from);
    if (lt >= 0) from = lt;
    const to = i + 1 < anchors.length ? anchors[i + 1].index : html.length;
    return html.slice(from, to);
  }
  return null;
}

/**
 * The visible credit line under a question, e.g. "SQA Higher Maths 2015 Paper 1 Q1".
 *
 * Matching "SQA" against raw HTML does not work: the first hit in a block is
 * almost always inside an attribute — a PDF href like
 * "SQA/questions/by-topic/National-5-Maths-Fractions-past-paper-questions" or
 * "SQA-Paper-Question-8.pdf" — or a section heading, "SQA Exam Practice".
 * That mis-read 31 of his 82 links, and turned an href fragment into a
 * phantom "2013 P2 Q4".
 *
 * So strip the markup first and read the text a person sees.
 */
function credit(block) {
  const text = block
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  // A real credit names the awarding body, the qualification and a question.
  //
  // Two shapes matter and both were missed at first. He writes "Adv Higher",
  // not "Advanced Higher". And on the 2026 papers he credits "QS" rather than
  // "SQA" — the Qualifications Scotland rename, the same one this site made —
  // so anything looking only for "SQA" silently drops his newest questions,
  // which are the ones most worth having.
  // He names the qualification four ways — "National 5", "Nat5" and "N5" all
  // appear, as do "Higher" and "Adv Higher" — so the alternation has to cover
  // the lot or whole topics vanish from the report looking like his own work.
  const m = text.match(
    /\b(?:SQA|QS)\s+(?:National\s*5|Nat\s*5|N\s*5|Adv(?:anced)?\s*Higher|Higher)\s+Maths\s+[^[]{0,30}?\bQ\s*\d+\s*[a-d]?/i
  );
  return m ? m[0].trim() : null;
}

/** Credit -> the ref the archive would use, as practice-loader spells it. */
function refFrom(label) {
  const s = String(label).replace(/specimen/gi, 'Spec').replace(/\s+/g, ' ').trim();
  const year = (s.match(/((?:19|20)\d{2})/) || [])[1];
  const paper = (s.match(/\bPaper\s*([12])\b/i) || [])[1] ?? (s.match(/\bP\s*([12])\b/i) || [])[1] ?? null;
  const qm = s.match(/\bQ\s*(\d+)\s*([a-d])?\b/i);
  if (!year || !qm) return null;
  return { year, paper, num: qm[1], part: (qm[2] ?? '').toLowerCase() };
}

// ------------------------------------------------- the archive's own labels
const BADGE = /^\s*<small>\s*<strong>[\s\S]*?>([^<]+)</i;
const LABEL = /\b(?:((?:19|20)\d{2})\s*)?(Spec\w*|Exemplar)?\s*(?:P([12])\s*)?Q(\d+)\s*(.*)$/i;
function labelOf(html) {
  const badge = String(html).match(BADGE);
  if (!badge) return null;
  const m = badge[1].trim().match(LABEL);
  if (!m) return null;
  const [, year, special, paper, num, rest] = m;
  if (!year && !special) return null;
  return `${[year, special].filter(Boolean).join(' ')}${paper ? ` P${paper}` : ''} Q${num}${(rest ?? '').replace(/\s+/g, '')}`;
}

const COURSE_OF = { nat5: 'national5Maths', higher: 'higherMaths', 'advanced-higher': 'advancedHigherMaths' };
const DIRS = { national5Maths: 'src/n5/pastpapers', higherMaths: 'src/higher/pastpapers', advancedHigherMaths: 'src/ah/pastpapers' };

const archive = {};
for (const [course, dir] of Object.entries(DIRS)) {
  const keys = new Set();
  const full = path.resolve(dir);
  if (fs.existsSync(full)) {
    for (const f of fs.readdirSync(full).filter(f => f.endsWith('.js'))) {
      let mod; try { mod = await import(pathToFileURL(path.join(full, f)).href); } catch { continue; }
      for (const v of Object.values(mod)) {
        if (!v?.papers) continue;
        for (const p of v.papers) for (const q of p.questions) {
          const l = labelOf(q.question); if (l) keys.add(l);
        }
      }
    }
  }
  archive[course] = keys;
}

// what our practice already carries
const carried = {};
for (const [course] of Object.entries(DIRS)) {
  const src = fs.readFileSync(`src/practice/data/${course}.ts`, 'utf8');
  carried[course] = {
    refs: new Set([...src.matchAll(/(?:ref|paper):\s*['"]([^'"]+)['"]/g)].map(m => m[1])),
    urls: new Set([...src.matchAll(/solutionUrl:\s*"([^"]+)"/g)].map(m => m[1])),
  };
}

/** Find the archive key for a parsed ref, allowing for part spelling. */
function resolve(course, r) {
  const keys = archive[course];
  const head = `${r.year}${r.paper ? ` P${r.paper}` : ''} Q${r.num}`;
  if (r.part) {
    const exact = [...keys].filter(k => k.startsWith(head) && new RegExp(`\\(${r.part}\\)`).test(k));
    if (exact.length === 1) return exact[0];
    if (exact.length > 1) return { ambiguous: exact };
  }
  if (keys.has(head)) return head;
  const starts = [...keys].filter(k => k.startsWith(head + '('));
  if (starts.length === 1) return starts[0];
  if (starts.length > 1) return { ambiguous: starts };
  return null;
}

const rows = [];
for (const url of fs.readFileSync(LIST, 'utf8').split('\n').map(s => s.trim()).filter(Boolean)) {
  const m = url.match(/maths\.scot\/([a-z0-9-]+)\/([a-z0-9-]+)#(\d+)/);
  if (!m) { rows.push({ url, status: 'UNPARSEABLE URL' }); continue; }
  const [, section, topic, hash] = m;
  const course = COURSE_OF[section];
  const base = `https://www.maths.scot/${section}/${topic}`;
  let html; try { html = await page(base); } catch (e) { rows.push({ url, status: `FETCH ${e.message}` }); continue; }
  const block = blockFor(html, Number(hash));
  if (!block) { rows.push({ url, course, topic, status: 'ANCHOR NOT FOUND on his page' }); continue; }

  const c = credit(block);
  if (!c) { rows.push({ url, course, topic, status: 'HIS OWN EXAMPLE (not a past paper)' }); continue; }
  const r = refFrom(c);
  if (!r) { rows.push({ url, course, topic, credit: c, status: 'CREDIT NOT PARSEABLE' }); continue; }

  const already = carried[course]?.urls.has(url);
  const key = resolve(course, r);
  const asWritten = `${r.year}${r.paper ? ` P${r.paper}` : ''} Q${r.num}${r.part}`;

  if (already) rows.push({ url, course, topic, credit: c, ref: asWritten, status: 'ALREADY LINKED' });
  else if (key && key.ambiguous) rows.push({ url, course, topic, credit: c, ref: asWritten, status: 'AMBIGUOUS', cands: key.ambiguous });
  else if (key) rows.push({ url, course, topic, credit: c, ref: asWritten, key, status: carried[course].refs.has(key) ? 'HAVE QUESTION, NEEDS LINK' : 'ADD' });
  else rows.push({ url, course, topic, credit: c, ref: asWritten, status: 'PAPER NOT IN ARCHIVE' });
}

fs.writeFileSync('mathsscot-reconciled.json', JSON.stringify(rows, null, 1));

const group = {};
for (const r of rows) (group[r.status] ??= []).push(r);
for (const [status, list] of Object.entries(group).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${status}  (${list.length})`);
  for (const r of list) {
    console.log(`   ${(r.course ?? '').replace('Maths', '').padEnd(15)} ${(r.topic ?? '').padEnd(24)} ${(r.ref ?? '').padEnd(14)} ${r.key && r.key !== r.ref ? '-> "' + r.key + '"' : ''} ${r.cands ? r.cands.join(' | ') : ''}`);
  }
}
console.log(`\ntotal in his list: ${rows.length}`);
console.log('written to mathsscot-reconciled.json — nothing changed');
