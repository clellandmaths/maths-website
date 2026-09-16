// The two themes are wired up consistently, and the duplicated dark block has
// not drifted from its twin.
//
// ## Why a check for a stylesheet
//
// A reader is in one of three states, not two — chose light, chose dark, or said
// nothing — so the dark palette has to be written twice: once behind
// `prefers-color-scheme` for the unstamped majority, once behind
// `[data-theme="dark"]` so an explicit choice beats the OS. CSS cannot share a
// declaration block between two selectors without a preprocessor.
//
// Two copies of the same thing is a promise nobody keeps by hand. If they drift,
// the site a reader gets from their OS and the site they get from the toggle are
// different, and nothing else on this repo would notice: `check:contrast` drives
// one theme per run, and every other browser check measures geometry.
//
// ## What is asserted
//
//   1. the two dark blocks are identical, declaration for declaration
//   2. every token the light `:root` defines is defined by dark, and vice versa
//      — a token present in one theme only is a colour that vanishes
//   3. `dark:` is bound to the attribute, not to prefers-color-scheme, or a
//      `dark:` utility and the token under it would disagree about the theme
//   4. the pre-paint script exists, is the first child of <body>, and writes the
//      same attribute the stylesheet reads
//   5. nothing still ships `className="dark"`, which nothing reads any more
//
// Run: node scripts/check-theme.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

const css = fs.readFileSync(path.join(root, 'app', 'globals.css'), 'utf8');

/**
 * Source with the commentary taken out.
 *
 * **A check that reads a file as text must know prose from code.** The first
 * run of this one failed on its own explanation: the comment above `<html>`
 * says *`data-theme`, not `className="dark"`* — describing the change — and a
 * plain search found that and reported the change had not been made. This repo
 * has the same lesson written down about the hints parity check.
 *
 * Line comments are matched only where `//` opens the line, so a `https://` in
 * a string survives.
 */
const codeOnly = src => src
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

const layout = codeOnly(fs.readFileSync(path.join(root, 'app', 'layout.tsx'), 'utf8'));

/**
 * The custom-property declarations inside the block a selector opens.
 *
 * Brace-counted rather than matched with a regex: the blocks carry comments
 * containing braces-free prose today, but a nested rule or an `@media` inside
 * one would silently truncate a regex match and compare half a block against a
 * whole one — which passes.
 */
function tokensAfter(src, marker) {
  const at = src.indexOf(marker);
  if (at < 0) return null;
  const open = src.indexOf('{', at);
  if (open < 0) return null;
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) return null;
  const body = src.slice(open + 1, end);
  // Strip comments so prose cannot be mistaken for a declaration.
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = new Map();
  for (const line of clean.split(';')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const name = line.slice(0, i).trim();
    if (!name.startsWith('--') && name !== 'color-scheme') continue;
    out.set(name, line.slice(i + 1).trim());
  }
  return out;
}

const light = tokensAfter(css, '\n:root {');
const darkMedia = tokensAfter(css, ':root:not([data-theme="light"])');
const darkAttr = tokensAfter(css, ':root[data-theme="dark"]');

console.log('the palette:');
if (!light || !darkMedia || !darkAttr) {
  fail('could not find all three palette blocks in app/globals.css — '
     + `light=${!!light} media-dark=${!!darkMedia} attr-dark=${!!darkAttr}. `
     + 'If they were renamed this check is no longer policing anything');
} else {
  console.log(`  ok    light defines ${light.size}, dark defines ${darkAttr.size}`);

  // ── 1. the two dark blocks are the same block ────────────────────────────
  const names = new Set([...darkMedia.keys(), ...darkAttr.keys()]);
  const drift = [];
  for (const n of names) {
    const a = darkMedia.get(n), b = darkAttr.get(n);
    if (a !== b) drift.push(`${n}: media=${a ?? '(absent)'} attr=${b ?? '(absent)'}`);
  }
  if (drift.length) {
    fail(`the two dark blocks have drifted in ${drift.length} declaration(s) — `
       + 'the OS and the toggle would produce different sites:');
    for (const d of drift) console.log(`          ${d}`);
  } else {
    console.log(`  ok    both dark blocks agree on all ${names.size} declarations`);
  }

  // ── 2. no token exists in one theme only ─────────────────────────────────
  const onlyLight = [...light.keys()].filter(n => n !== 'color-scheme' && !darkAttr.has(n));
  const onlyDark = [...darkAttr.keys()].filter(n => n !== 'color-scheme' && !light.has(n));
  /* A token the light block defines and dark does not still RESOLVES in dark —
     it inherits the light value, because these cascade onto the same :root.
     That is the quiet failure: not a missing colour but a light colour showing
     in the dark theme. `--signal-magenta` and `--signal-mint` are deliberate:
     they are the exact logo hexes and are the same in both. */
  const RESERVED = new Set(['--signal-magenta', '--signal-mint']);
  const stray = onlyLight.filter(n => !RESERVED.has(n));
  if (stray.length) {
    fail(`${stray.length} token(s) defined for light only, so the light value `
       + `leaks into dark: ${stray.join(', ')}`);
  } else {
    console.log(`  ok    every non-reserved token is defined in both themes `
              + `(${RESERVED.size} reserved, shared on purpose)`);
  }
  if (onlyDark.length) {
    fail(`${onlyDark.length} token(s) defined for dark only, undefined in light: `
       + onlyDark.join(', '));
  }

  // ── colour-scheme, so form controls and scrollbars follow ────────────────
  if (light.get('color-scheme') !== 'light' || darkAttr.get('color-scheme') !== 'dark') {
    fail('color-scheme is not set per theme — native controls, scrollbars and '
       + 'the canvas behind the page would stay on one theme');
  } else {
    console.log('  ok    color-scheme follows the theme');
  }
}

// ── 3. the dark variant is bound to the attribute ──────────────────────────
console.log('\nthe dark: variant:');
{
  const cv = /@custom-variant\s+dark\s*\(([^)]*)\)/.exec(css);
  if (!cv) {
    fail('no `@custom-variant dark` — Tailwind 4 would fall back to '
       + 'prefers-color-scheme, so a `dark:` utility and the token beside it '
       + 'would disagree for anyone who chose a theme against their OS');
  } else if (cv[1].indexOf('data-theme') < 0) {
    fail(`the dark variant does not mention data-theme: ${cv[1].trim()}`);
  } else {
    console.log('  ok    bound to [data-theme="dark"], the same thing the palette reads');
  }
}

// ── 4 & 5. the plumbing in the layout ──────────────────────────────────────
console.log('\nthe layout:');
{
  if (/className\s*=\s*["'`]dark["'`]/.test(layout)) {
    fail('app/layout.tsx still sets className="dark" — nothing reads it now, '
       + 'and leaving it implies a switch that does nothing');
  } else {
    console.log('  ok    no leftover className="dark"');
  }

  /**
   * **React must not render `data-theme`, and this is the expensive one.**
   *
   * It was `<html data-theme="dark">` for exactly one commit. `check:contrast`
   * found what that costs: on `/explorer?c=n5` a reader who had chosen light
   * got dark — deterministically, while plain `/explorer` was fine. The
   * Explorer reads its own `?c=` in a lazy `useState` initialiser, so that URL
   * makes the client's first render disagree with the built HTML; React
   * discards the server DOM, re-renders from scratch, and re-asserts every
   * attribute in the layout's JSX — putting the built theme back over the one
   * the script had set from the reader's choice.
   *
   * Any hydration mismatch, anywhere, does the same. The only durable fix is to
   * give React nothing to restore: the script owns the attribute outright.
   */
  const html = /<html[^>]*>/.exec(layout);
  if (!html) {
    fail('no <html> element found in app/layout.tsx');
  } else if (/data-theme/.test(html[0])) {
    fail('<html> renders data-theme from JSX. A hydration mismatch — '
       + '/explorer?c=n5 is one — makes React re-render the tree and put this '
       + `value back over the reader's choice. Let the script own it: ${html[0].trim()}`);
  } else if (!/suppressHydrationWarning/.test(html[0])) {
    fail('<html> needs suppressHydrationWarning — the script adds an attribute '
       + 'React did not render, and React will warn about it on every page');
  } else {
    console.log('  ok    <html> leaves data-theme to the script, and suppresses '
              + 'the warning for it');
  }

  const body = layout.indexOf('<body');
  const script = layout.indexOf('localStorage.getItem(\'theme\')');
  if (script < 0) {
    fail('no pre-paint script reading the stored theme');
  } else {
    /* First child of <body>: anything between the body tag and this script is
       markup that would paint in the built theme before the reader's own is
       applied. A <link> or a <script> is not markup and does not count. */
    const markup = layout.slice(layout.indexOf('>', body) + 1, script).trim();
    if (markup && markup.indexOf('<') === 0 && !/^<script/.test(markup)) {
      fail('the theme script is not the first thing in <body> — what precedes '
         + `it would paint in the built theme first: ${markup.slice(0, 60)}`);
    } else {
      console.log('  ok    the theme script runs before any markup in <body>');
    }
    if (layout.indexOf('setAttribute(\'data-theme\'') < 0
        && layout.indexOf('setAttribute("data-theme"') < 0) {
      fail('the pre-paint script does not set data-theme — it would read the '
         + 'stored choice and then do nothing with it');
    } else {
      console.log('  ok    and it writes the attribute the stylesheet reads');
    }
    /* Setting it once is not enough. React wipes attributes it did not author
       when a page hydrates with a mismatch — `/explorer?c=n5` does, from a
       lazy `useState` reading the query — and the reader's theme goes with
       them. The script has to watch and restore. */
    if (!/MutationObserver/.test(layout) || !/attributeFilter/.test(layout)) {
      fail('the script sets data-theme but does not defend it. A hydration '
         + 'mismatch (/explorer?c=n5 is one) makes React remove attributes it '
         + "did not render, taking the reader's theme with them");
    } else {
      console.log('  ok    and defends it against a hydration re-render');
    }
  }
}

// ── the toggle and the default are two halves of one switch ────────────────
/**
 * **A reader can reach light exactly when light is finished, and not before.**
 *
 * Two things say whether the light mode has shipped: whether the pre-paint
 * script still substitutes `'dark'` for a reader who has chosen nothing, and
 * whether the navbar actually offers a toggle. They have to move together.
 * Forced-dark with a toggle mounted means a reader can press their way into a
 * theme the site is not finished for; no forced default and no toggle means the
 * OS can put someone in light with no way back to dark.
 *
 * Asserting the pairing rather than either half is what makes this survive the
 * middle of the job: correct before, correct after, and failing in the gap.
 */
console.log('\nthe toggle and the default:');
{
  const navbar = codeOnly(fs.readFileSync(path.join(root, 'components', 'Navbar.tsx'), 'utf8'));

  /**
   * **The toggle is markup in the navbar, not a component.**
   *
   * It was `components/ThemeToggle.tsx` — a client component with `useState`,
   * an effect and two lucide icons — and it cost about a kilobyte, which put
   * five `course/*` templates 518 bytes past `check:budget`. None of that was
   * needed: `<html data-theme>` already holds the theme, so CSS draws the glyph
   * and decides which way round it points, and the button is a plain handler.
   * Inline, it landed 268 bytes inside the headroom.
   */
  const mounted = /localStorage\.setItem\('theme'/.test(navbar)
               && /setAttribute\('data-theme'/.test(navbar);
  if (mounted) {
    console.log('  ok    the navbar toggle records the choice and sets the attribute');
  }

  /* An unstamped reader is on whatever their OS says, so the handler has to
     read that rather than the absent attribute — or the first press on a
     dark-OS machine "sets" dark and appears to do nothing. */
  if (mounted && !/prefers-color-scheme/.test(navbar)) {
    fail('the toggle reads only the attribute. A reader who has chosen nothing '
       + 'has none, so the first press would set the theme they are already in '
       + 'and look broken — read prefers-color-scheme as the fallback');
  } else if (mounted) {
    console.log('  ok    and it knows what an unstamped reader is currently seeing');
  }

  /* Whether the script still forces dark, read from the fallback in `pick()` —
     that, not any markup, is what decides the default now. */
  const script = layout.replace(/\s+/g, '');
  const forcedDark = /\?c:'dark'/.test(script);

  if (forcedDark && mounted) {
    fail('the toggle is mounted while the script still forces dark on anyone '
       + 'who has not chosen — a reader could press it and land in a theme the '
       + "site is not finished for. Mount it in the change that drops the "
       + "script's 'dark' fallback");
  } else if (!forcedDark && !mounted) {
    fail('the script no longer forces dark but no toggle is mounted — the OS '
       + 'can now put a reader in light with no way back to dark');
  } else if (forcedDark) {
    console.log('  ok    dark is still forced for the unchosen, and no toggle is mounted yet');
  } else {
    console.log("  ok    the theme is the reader's, and the toggle is mounted");
  }
}

console.log(failures ? `\ntheme wiring: ${failures} FAILED` : '\ntheme wiring: ok');
process.exit(failures ? 1 : 0);
