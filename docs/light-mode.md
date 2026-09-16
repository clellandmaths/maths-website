# A light mode for the site

Branch `light-mode`, off `dev` at `2ee5bde`. Started 2026-09-16.

The site has been dark-only since it was built. This is the working note for
adding a second theme: what it costs, what is already done, and what has to be
true before any of it is safe.

---

## What is already done for you

Measured, not assumed.

| | |
|---|---|
| **443 past paper diagrams** | 39 of 40 sampled are **pure-white opaque PNGs**. They sit as white rectangles on today's dark page. Light mode needs **none** of them touched, and they will look better |
| **National 5 generated diagrams** | emit **no colour at all** — every stroke inherits. Every hard-coded `stroke="black"`, `#333`, `#111827` in the engine is in one file, `apps.ts`, and that content is already light-styled |
| **The switch** | `className="dark"` on `<html>`, **one place**, `app/layout.tsx:64` |
| **The accent system** | **265 call sites** of `theme.text`/`theme.tint`/`theme.border` collapse to **35 strings** in `lib/course-theme.ts` |
| **Print** | a separate narrow path that already forces white. It will not fight a light mode |

The diagrams were the risk that could have made this expensive. They don't.

## What the work is

**665 literals across 45 of 70 files** in `components/` and `app/`. It is
front-loaded:

```
text-slate-400   93     bg-slate-800   89     text-slate-300   84
border-slate-800 61     bg-slate-700   46     bg-slate-900     32
                                    -- 405 of 499 slate = 81%
```

Six class names cover four fifths of the slate, and each already has a token
behind it (`--muted-foreground`, `--card`, `--border`).

Two things make it more than a find-and-replace:

- `:root` in `globals.css` **is** the dark palette. There is no light one, no
  `@media (prefers-color-scheme)` and no `[data-theme]` block.
- There are **zero** `dark:` variants in the codebase. No colour decision on
  this site has ever been made twice.

## The three hard parts

**1. Accent contrast.** Every course accent is a 400-level colour picked to glow
on near-black. On white: `text-cyan-400` is **1.81:1**, `text-amber-400` is
**1.67:1**, against AA's 4.5. `theme.text` alone is 146 call sites. Cheap to
apply once designed — 35 strings — but the second palette has to be chosen by
eye. Note that the brand-magenta rule already written into `globals.css`
(*pair with dark text; white on this magenta fails at 3.2:1*) **inverts** in
light mode.

**2. The alpha washes.** 166 of them, and this is the tedious tail.
`bg-white/10` (44) and `bg-white/5` (29) are the hover and raised-surface
washes, and they are **invisible on white**. Scattered, no token covers them,
each needs a judged pair.

**3. The logo.** All four assets are transparent RGBA, but the artwork carries
brand mint `#ccffed`, which disappears on white, and the wordmark carries
`#464646` and `#000000` inks. Light variants are a design job on the source
artwork, not a code job.

---

## `check:contrast`, and what it found before any light mode existed

`scripts/check-contrast.mjs`. Written **first**, deliberately: nothing on this
site measured colour, so a second theme would have doubled 542 pages with no
instrument but eyes.

It found **48 nodes below AA on the dark site as it stands**, from 17 distinct
colour pairings — and they are all one family: **white text on the brand
gradient buttons.**

```
 3.62:1  #ffffff on #0092b8   x29   16px/600   the primary button, six surfaces
 2.13:1  #ffffff on #fe9a00   x2    16px/600   Enter Exam Hall, amber
 1.83:1  #ffebcc on #fe9a00   x1    12px/400   text-white/80 on amber-500
```

The 29 is `bg-gradient-to-r from-cyan-600 to-blue-600` with `text-white` — the
site's main call to action, on the exam hall, the academy, every course page,
the generate page, full screen and the hint overlay. It has been shipping at
3.62:1 against a 4.5 requirement.

The same mistake is documented *in `globals.css`* for the brand magenta and was
never generalised to the course gradients, because nothing measured them.

**These are recorded in `scripts/contrast-baseline.json` as known, not fixed.**
They print on every run; the baseline only suppresses them from *failing* the
check, so a light mode cannot hide behind them. Fixing them is a brand decision
and is not this branch's to take unasked.

### What the check does not cover

Stated because a check that looks like it covers something it does not is worse
than no check:

- text over a **bitmap** — no single colour exists, so it is counted, never guessed
- **`opacity` on an ancestor** — lowers real contrast below what is computed
- anything **not painted when measured**; the three overlays are driven open for
  exactly this reason, but coverage is what is driven
- **non-text contrast** — borders, icons, focus rings, at 3:1. An icon-only
  button that fails is invisible to this

Every text node lands in exactly one bucket and the buckets are asserted to sum
to the total, so nothing can go missing silently.

### The two bugs it had first, both of which reported a clean sweep

Worth recording, because both are the failure mode this repo keeps meeting.

**`lab()` and `oklab()`.** Tailwind 4 computes colours in those spaces, not
`rgb()` — 137 of 439 computed text colours on the homepage alone. The first
probe's `rgba(...)` parser returned null for every one and **dropped them
without counting it**, then reported zero failures.

**Gradients.** 95 of 190 homepage nodes sit on one, and the first probe skipped
any element with a `background-image` — a 50% blind spot on that page, again
reporting clean.

Both are fixed by not parsing colour at all: a 1x1 canvas is painted with the
CSS string and read back, which is the browser's own conversion, and the layer
stack is **composited on the canvas** rather than by implementing source-over
here. Gradient stops are extracted and the text tested against every one, worst
reported — `text-white` over `from-cyan-600 to-blue-600` must clear AA at both
ends, not on average.

The self-test plants four unreadable strings, one per colour space plus a
gradient, and fails if any goes uncaught. A single `rgb()` plant would have
passed the whole time the `lab()` bug was live.

Coverage went from **33 of 190** nodes on the homepage to **169 of 190**.

---

## The order

1. ~~`check:contrast`~~ — done, baseline recorded.
2. **Light palette + theme plumbing.** A light `:root`, the dark set moved
   behind `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`,
   the toggle, and persistence. **The trap**: this is a static export, so the
   theme must be applied by an inline script before paint or there is a flash of
   the wrong theme — and reading storage in a render path gives a hydration
   mismatch, the same fault already documented in `PracticeModes`.
3. **`lib/course-theme.ts`** — 35 strings, 265 call sites fixed at once.
4. **The six mechanical slate mappings** across 45 files.
5. **The ~160 alpha washes** and the judgement tail.
6. **Full sweep at both themes** with `check:contrast`, plus a second baseline
   for light.

## Open questions for the owner

- **The 48 AA failures on the dark site.** Fix now, fix as part of this, or
  accept? They are the primary button on six surfaces.
- **Does light mode follow the OS, or is it a toggle, or both?** Both is the
  usual answer and costs little extra once the plumbing exists.
- **The logo variants** need the source artwork.
