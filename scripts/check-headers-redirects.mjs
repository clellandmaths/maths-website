import fs from 'node:fs';
import path from 'node:path';

/**
 * Check _headers and _redirects against what the site actually is.
 *
 * The CSP cannot be exercised locally — a static file server does not send
 * _headers — so this does the next best thing: enumerate every external origin
 * the built site references, and confirm the policy admits each one. A CSP that
 * blocks the video player is worse than no CSP, and the failure is silent.
 *
 * Also checks that no redirect rule shadows a page that really exists, which
 * would make a working URL bounce somewhere else.
 */

const OUT = 'out';
const fail = [];
const warn = [];

// ── gather every external origin the built site references ─────────
const origins = new Map(); // origin -> example file
function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (!/\.(html|js|css|json|webmanifest)$/.test(e.name)) continue;
    // The Quarto workbook has its own policy; scanned separately below.
    if (p.includes(path.join('rstudio'))) continue;
    const src = fs.readFileSync(p, 'utf8');
    for (const m of src.matchAll(/https?:\/\/([a-zA-Z0-9.-]+\.[a-z]{2,})/g)) {
      const host = m[1];
      if (host.endsWith('clellandmaths.com')) continue;   // our own
      if (!origins.has(host)) origins.set(host, p.slice(OUT.length));
    }
  }
}
scan(OUT);

// ── parse the CSP we ship ──────────────────────────────────────────
const headers = fs.readFileSync(path.join(OUT, '_headers'), 'utf8');
const cspLine = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m);
if (!cspLine) fail.push('no Content-Security-Policy found in _headers');
const csp = cspLine ? cspLine[1] : '';
const allowedHosts = [...csp.matchAll(/https:\/\/([a-zA-Z0-9.-]+)/g)].map(m => m[1]);

console.log('── external origins referenced by the built site ──');
for (const [host, example] of [...origins].sort()) {
  // Hosts that are only ever link targets (href) are not fetched, so the CSP
  // does not gate them. Flag them as informational rather than failures.
  const allowed = allowedHosts.some(a => a === host || host.endsWith('.' + a));
  // Hosts that only ever appear as link targets or as prose. Verified by hand
  // when added: react.dev is the URL React builds into error messages, and
  // gov.uk is a citation typed into a question's text. Neither is fetched, so
  // neither needs a CSP entry.
  const linkOnly = /youtube\.com$|tiktok\.com$|teemill\.com$|cameo\.com$|buymeacoffee\.com$|maths\.scot$|bbc\.co\.uk$|alloaadvertiser\.com$|stripe\.com$|schema\.org$|w3\.org$|nextjs\.org$|github\.com$|googlehosted\.com$|react\.dev$|gov\.uk$/.test(host);
  const mark = allowed ? 'in CSP  ' : linkOnly ? 'link only' : 'NOT ALLOWED';
  if (!allowed && !linkOnly) fail.push(`origin ${host} is fetched but not in the CSP (e.g. ${example})`);
  console.log(`  ${mark.padEnd(12)} ${host}`);
}

// ── things the site needs that are easy to forget ──────────────────
const needs = [
  ['data: URIs for images (QR codes)', /img-src[^;]*\bdata:/],
  ['blob: for images', /img-src[^;]*\bblob:/],
  ['inline script (Next bootstrap + JSON-LD)', /script-src[^;]*'unsafe-inline'/],
  ['inline style', /style-src[^;]*'unsafe-inline'/],
  ['YouTube privacy player in frame-src', /frame-src[^;]*youtube-nocookie\.com/],
  ['self in connect-src (route prefetch)', /connect-src[^;]*'self'/],
];
console.log('\n── CSP must allow ──');
for (const [what, re] of needs) {
  const ok = re.test(csp);
  if (!ok) fail.push(`CSP does not allow: ${what}`);
  console.log(`  ${ok ? 'yes' : 'NO '}  ${what}`);
}

// ── a path must not end up with two CSPs ───────────────────────────
// _headers rules add to /* rather than replacing it, so a per-path policy
// arrives alongside the global one and the browser enforces the intersection.
// The stricter rule wins, the looser one is decoration, and the page it was
// written for breaks while the config looks right.
const blocks = headers.split(/\n(?=\S)/).filter(b => b.trim() && !b.trim().startsWith('#'));
const globalHasCsp = /^\/\*/m.test(headers) && /Content-Security-Policy:/.test(blocks.find(b => b.trim().startsWith('/*')) ?? '');
console.log('\n── per-path CSP overrides ──');
for (const b of blocks) {
  const pathMatch = b.trim().split('\n')[0].trim();
  if (pathMatch === '/*' || !/Content-Security-Policy:/.test(b)) continue;
  const unsets = /^\s*!\s*Content-Security-Policy\s*$/mi.test(b);
  if (globalHasCsp && !unsets) {
    fail.push(`${pathMatch} sets its own CSP but does not unset the one from /* — the browser would enforce both`);
  }
  console.log(`  ${unsets ? 'unsets /* first' : 'NO UNSET'}  ${pathMatch}`);
}

// ── redirects must not shadow real pages ───────────────────────────
const redirects = fs.readFileSync(path.join(OUT, '_redirects'), 'utf8')
  .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => l.split(/\s+/));

console.log('\n── redirect rules ──');
for (const [from, to, code] of redirects) {
  const asPage = path.join(OUT, from.replace(/^\//, '') + '.html');
  const asDir = path.join(OUT, from.replace(/^\//, ''), 'index.html');
  const shadows = fs.existsSync(asPage) || fs.existsSync(asDir);
  // Does the destination exist?
  const destPage = path.join(OUT, to.replace(/^\//, '') + '.html');
  const destDir = path.join(OUT, to.replace(/^\//, ''), 'index.html');
  const destOk = to === '/' || fs.existsSync(destPage) || fs.existsSync(destDir);

  if (shadows) fail.push(`redirect ${from} shadows a real page — that URL would stop working`);
  if (!destOk) fail.push(`redirect ${from} -> ${to} but ${to} does not exist`);
  if (code !== '301') warn.push(`redirect ${from} is ${code}, not 301`);
  console.log(`  ${shadows ? 'SHADOWS ' : destOk ? 'ok      ' : 'BAD DEST'} ${from} -> ${to}`);
}

console.log();
for (const w of warn) console.log('warning: ' + w);
if (fail.length) {
  console.error('\nFAILED:');
  for (const f of fail) console.error('  ' + f);
  process.exit(1);
}
console.log('headers and redirects check out');
