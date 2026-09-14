# Sizing, responsiveness and printing

How the site is supposed to size things, what is enforced, and what is still
wrong. Written 2026-09-13, after a day of measuring.

---

## The baseline exists and has never been read back

```
npm run build
node scripts/check-responsive.mjs --all        # ~90 min, expect 0 new
```

**It was recorded on 2026-09-14** — `49,112` violations across 513 pages, in
`scripts/responsive-baseline.json`, `mode: all`. Before that it was started
three times and abandoned three times, because `out/` was rebuilt underneath it
each time and the check reads the built site.

**That can no longer happen silently.** The check fingerprints `out/` before and
after, and refuses to record a baseline if the build moved under it. Proved by
touching a file mid-run: file count and byte count were identical and only the
mtime differed, and it still refused — a size-only check would have missed it.

It is also a third quicker: one page load measured at all four viewports rather
than four full passes. Verified identical to the old order on a sample (795
violations both ways, no differences); `--reload-each` restores it.

**And the site has grown since.** It was 513 pages when the baseline was taken
and is **542** now — the 22 generated practice papers and the rest of the
National 5 work. A read-back will report those as new, which is correct and
expected; what matters is that nothing *else* is.

**But it is still a file rather than a ratchet, because nothing has read it
back.** A baseline proves nothing until a full run compares against it on a
build known not to have moved, and both earlier attempts at this reported
phantom "new" violations on an unchanged build — which is the whole reason the
read-back matters rather than a formality.

**Spend the 90 minutes immediately before a merge to `master`**, not on a quiet
day. There it is the safety net that proves the pages did not move; run idly it
is 90 minutes that tells you what you already assumed. **Nothing on `dev` is
live** — `git rev-list --count master..dev` says how far ahead it is, and that is
the number to trust, because writing it down here increments it. That merge is
where this earns its keep.

Until it is read back, `npm run check:responsive` reports violations against a
number nobody has confirmed reproduces.

## The sizes

| role | value | on a phone | source |
|---|---|---|---|
| question and answer text | `text-xl md:text-2xl` | **20px** | matches the app, measured |
| notes and prose body | `text-base` | 16px | the browser default, the floor for body text |
| UI and button labels | `1rem` | 16px | |
| meta, badges, captions | `text-xs` | 12px | the floor |
| **never below** | | **12px** | |
| tap targets | | **44 × 44** | Apple HIG; Material asks 48 |
| form controls | | **≥ 16px** | below it, iOS Safari zooms the page and does not zoom back |
| reading measure | | 45–75 characters | |

**`sm:` is 640px, so no phone in portrait ever reaches it.** `text-lg
sm:text-xl` is 18px on every phone and the step never fires. This caught the
presenter, focus mode and the Warm Up, all of which read 18px while the page
behind them read 20px. If a size should change on a phone, `md:` (768px) is the
first breakpoint that means anything, and a fluid `clamp()` is usually better.

## What is enforced

### `scripts/check-responsive.mjs`

Drives the built site at 320 / 390 / 768 / 1440 and reports six rules: tap
targets under 44px, text under 12px, controls under 16px, lines over 75
characters, the page scrolling sideways, and content clipped with nothing to
scroll it.

```
npm run check:responsive                        a sample per template, ~5 min
npm run audit:responsive                        every page, ~90 min
node scripts/check-responsive.mjs --only <page> one page — use it to prove a rule fires
node scripts/check-responsive.mjs --viewport phone-sm   one width
```

**Not in `build`.** It needs headless Chrome and the Cloudflare image has none.

It groups by *what you would change* rather than by occurrence — a 40px navbar
button is 2,072 violations and one fix. The sample run reported **379 distinct
things** where the raw count was 2,264.

### `scripts/check-maths-punctuation.mjs`

A full stop belongs **inside** the closing maths delimiter. See
[maths-punctuation.md](maths-punctuation.md) — this one is in `build`, because
it reads source and needs no browser. Ratcheted at **666** violations.

## What was fixed

| | |
|---|---|
| question and answer text | 16px → **20px** on the paper page, worksheet, full screen, focus mode and the Warm Up |
| notes body | **15px** → 16px, on 277 pages |
| 12 labels | 10–11px → 12px, across eight components |
| Explorer search | 14px → 16px on mobile — it was zooming iOS |
| `inverse-functions` | `min-w-[600px]` was cutting the answers off a phone |
| that diagram's content | every arrow ended in `=` with no value; now 5→f→14→g→5 |
| formula boxes | all 15 clamped so wide equations scroll inside them |
| velodrome question | six readings can wrap instead of being clipped |
| units | `6 cm³/second` could break after the ³ |
| formulae headings | kept welded to their table in print |

Measured across all 518 pages, before and after: blocks losing content **0 → 0**,
pages scrolling sideways **5 → 4**.

## What is still wrong

Findings, not tasks. Nothing here is broken enough to have been fixed without
being asked.

- **course landing buttons** 36–38px — `Watch Video`, `Start Paper`, `Focus
  Mode`, `Browse Questions`, repeated per paper row (88 on one page)
- **Explorer browse cards** 14px question text — it is a list to scan, so this
  is a judgement call, not a fault
- **reading measure** 84–102 characters on tablet and laptop, against 45–75
- **666 full stops** outside their delimiter, 409 of them in four practice-data
  files
- **the footer** — untouched by request; its two 11px labels are now the only
  sub-12px text on the site

## Traps, each of which cost an hour

**`min-w-0` does not fix a column flex.** It is *the* flexbox remedy and it did
nothing here. In a column flex container with `align-items: center`, an item is
sized to its content on the cross axis and `min-width` does not clamp it —
`max-width` does. Measured: page 352px → 352px with `min-width: 0`, and 352px →
320px with `max-width: 100%`.

**`break-after: avoid` is not reliable.** It is the least well implemented of
the break properties. A heading stayed stranded at the foot of a page until the
heading and its table were wrapped together and given `break-inside: avoid`.

**`break-inside: avoid` only works on a block that fits.** The spec makes it a
request. A block taller than the page is broken anyway, or pushed, leaving a
blank page. Every formula section fits today — tallest 415px against a 1009px
portrait page, 39–84% headroom — but **that invariant is what holds the fix up,
and nothing checks it**. The Higher Applications data booklet is deliberately
excluded for exactly this reason: its "Some helpful R commands" section is
**1273px**, taller than a page, so forcing it whole would create the blank page
it was meant to prevent.

**overflow-x: hidden is not a fix, it clips.** Treating it as "handled" made
the first version of the responsive check blind: 3,360 renders, 0 faults, and
still 0 with 44px text at 320px.

**KaTeX's own machinery looks like overflow.** A `\sqrt` overline is a very
wide `<svg><path>` that KaTeX clips deliberately, and every expression carries
a hidden MathML copy. Measuring every descendant reported them as 6,800px
faults. Measure `.katex-html`, real figures and tables — nothing else.

## The discipline that made today work

Every change was measured across all 518 pages before and after, and the diff
named the affected page and question rather than leaving them to be found.

**And check the checker.** Four separate times a check was wrong rather than
the code: the blind responsive scan; the `scroll-defeated` rule that came back
green on a page known to be broken; a unit test that paired `/second` with the
wrong expression and reported three units in a two-unit question; and a PDF A/B
that reported "different" when the only differing bytes were the timestamp.
A check that has never failed has proved nothing — point it at something known
to be broken before believing a green.

## Two documents from one page

The worksheet and its markscheme print separately — two buttons, two dialogs,
two files — so a paper can be handed to a class without the answers stapled
behind it. A browser makes one PDF per dialog, so one button producing both
would have meant either two dialogs or one file to split.

**The mechanism is `data-print="markscheme"` on the body**, and one CSS rule:

```css
body[data-print="markscheme"] > *:not(.markscheme-doc) { display: none !important; }
```

That works because `MarkschemeSheet` portals itself to `document.body`. The
alternative was a rule naming every part of the worksheet to hide, which
rearranging the sheet would quietly break. Measured across the three states:
`<main>` goes **block → none → block**.

**The flag is cleared in a `finally`.** Leaving it set would mean the next
*Print / Save PDF* silently produced the markscheme — the one failure here that
hands a class the answers.

## Formula sheets

Printed at the front of every worksheet, gated on `courseId` alone — so a sheet
of **generated** questions gets them exactly like a past paper sheet. Verified:
N5 generated-only and N5 mixed both print the four N5 sections.

| course | sections | tallest | portrait headroom | landscape |
|---|---|---|---|---|
| National 5 | 4 | 161px | 84% | 76% |
| Higher | 5 | 214px | 79% | 69% |
| Advanced Higher | 8 | 415px | 59% | 39% |
| N5 Applications | 5 | 197px | 80% | 71% |
| Higher Applications | *data booklet instead — out of scope* | | | |
