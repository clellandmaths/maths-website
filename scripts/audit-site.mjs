import fs from 'node:fs';
import path from 'node:path';

/**
 * Pre-launch audit of the built site.
 *
 * Reads out/ rather than source, because what ships is what matters — a
 * component with a canonical tag means nothing if the route never rendered it.
 * Reports counts and examples rather than pass/fail: most of these are
 * judgement calls, not defects.
 */

const OUT = 'out';
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(OUT);

const rel = p => p.slice(OUT.length).replace(/\\/g, '/');
const read = p => fs.readFileSync(p, 'utf8');

const issues = {};
const note = (key, page, detail) => {
  (issues[key] ??= []).push(detail ? `${rel(page)} — ${detail}` : rel(page));
};

for (const page of pages) {
  const html = read(page);
  // Quarto page is not ours to restyle; skip the Next-specific checks.
  const isQuarto = /quarto-\d/.test(html);

  if (!/<title>[^<]{5,}<\/title>/.test(html)) note('missing or empty <title>', page);
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (!desc) note('no meta description', page);
  else if (desc[1].length < 70) note('meta description under 70 chars', page, `${desc[1].length} chars`);
  else if (desc[1].length > 165) note('meta description over 165 chars', page, `${desc[1].length} chars`);

  if (!/rel="canonical"/.test(html)) note('no canonical link', page);
  if (!/property="og:title"/.test(html)) note('no Open Graph title', page);
  if (!/property="og:image"/.test(html)) note('no Open Graph image', page);
  if (!/name="twitter:card"/.test(html)) note('no Twitter card', page);
  if (!/application\/ld\+json/.test(html)) note('no structured data (JSON-LD)', page);

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length === 0 && !isQuarto) note('no <h1>', page);
  if (h1s.length > 1) note('more than one <h1>', page, `${h1s.length}`);

  if (!isQuarto) {
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      if (!/\balt=/.test(tag)) note('image with no alt attribute', page, tag.slice(0, 90));
      if (!/loading="lazy"/.test(tag) && !/priority/.test(tag)) {
        note('image not lazy-loaded', page, (tag.match(/src="([^"]*)"/) ?? [])[1] ?? tag.slice(0, 60));
      }
      if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
        note('image without width/height (layout shift)', page, (tag.match(/src="([^"]*)"/) ?? [])[1] ?? '');
      }
    }
    for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      if (!/rel="[^"]*noopener/.test(m[0])) note('target=_blank without rel=noopener', page, m[0].slice(0, 80));
    }
  }
}

// ── site-wide files ────────────────────────────────────────────────
const siteFiles = {
  'robots.txt': fs.existsSync(path.join(OUT, 'robots.txt')),
  'sitemap.xml': fs.existsSync(path.join(OUT, 'sitemap.xml')),
  '_headers (security headers)': fs.existsSync(path.join(OUT, '_headers')),
  '_redirects': fs.existsSync(path.join(OUT, '_redirects')),
  'favicon.ico': fs.existsSync(path.join(OUT, 'favicon.ico')),
  'manifest': fs.existsSync(path.join(OUT, 'manifest.json')) || fs.existsSync(path.join(OUT, 'site.webmanifest')),
};

// ── asset weight ───────────────────────────────────────────────────
const byExt = {};
(function walkAll(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkAll(p);
    else {
      const ext = path.extname(e.name).toLowerCase() || '(none)';
      const s = fs.statSync(p).size;
      byExt[ext] ??= { count: 0, bytes: 0, biggest: { name: '', size: 0 } };
      byExt[ext].count++;
      byExt[ext].bytes += s;
      if (s > byExt[ext].biggest.size) byExt[ext].biggest = { name: rel(p), size: s };
    }
  }
})(OUT);

const mb = b => (b / 1048576).toFixed(2) + ' MB';
const kb = b => (b / 1024).toFixed(0) + ' KB';

console.log(`\n═══ ${pages.length} HTML pages audited ═══\n`);

console.log('── site-wide files ──');
for (const [name, ok] of Object.entries(siteFiles)) console.log(`  ${ok ? 'yes' : 'NO '}  ${name}`);

console.log('\n── heaviest asset types ──');
Object.entries(byExt).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 8)
  .forEach(([ext, v]) => console.log(`  ${ext.padEnd(7)} ${String(v.count).padStart(5)} files  ${mb(v.bytes).padStart(9)}   biggest: ${v.biggest.name} (${kb(v.biggest.size)})`));

console.log('\n── findings ──');
const sorted = Object.entries(issues).sort((a, b) => b[1].length - a[1].length);
if (!sorted.length) console.log('  nothing flagged');
for (const [key, list] of sorted) {
  console.log(`\n  ${list.length}x  ${key}`);
  const uniq = [...new Set(list)];
  uniq.slice(0, 3).forEach(l => console.log(`        ${l}`));
  if (uniq.length > 3) console.log(`        …and ${uniq.length - 3} more`);
}
console.log();
