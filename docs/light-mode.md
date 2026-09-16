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
| **The switch** | one place, `app/layout.tsx` — it was `className="dark"`, now `data-theme` |
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

- `:root` in `globals.css` **was** the dark palette — no light one, no
  `@media (prefers-color-scheme)`, no `[data-theme]` block. Done in step 2.
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

## The palette and the plumbing (step 2, done)

The three-block palette is in `globals.css`: `:root` is light, dark is applied
twice — once behind `prefers-color-scheme` for the reader who has chosen
nothing, once behind `[data-theme="dark"]` so an explicit choice beats the OS
either way. `@custom-variant dark` binds Tailwind's `dark:` to the same
attribute, because Tailwind 4 would otherwise key it off the OS and a `dark:`
utility would disagree with the token beside it.

**Every light value was chosen against a number, not by eye**, because the
existing `--muted-dim` comment sets that standard:

| token | light | on page | on card | the dark value, for comparison |
|---|---|---|---|---|
| `--foreground` | `#16161a` | 16.86 | 18.04 | 18.17 / 16.57 |
| `--muted-foreground` | `#5a5a66` | 6.35 | 6.80 | 7.08 / 6.46 |
| `--muted-dim` | `#5b6b80` | 5.09 | 5.44 | 5.77 / 5.26 |
| `--accent` | `#b800ab` | 5.28 | 5.79 | 6.10 / 5.56 |

Page `#f4f4f7` and card `#ffffff` sit **1.098:1** apart, which is the separation
`#0a0a0c` and `#16161a` already have. Matched on purpose: a card should lift off
the page by the same amount in both themes.

**The brand magenta could not be `--accent` on a light ground** — `#ff00ed` is
3.03:1 on the page, large-text only, and `text-accent` is body text in nine
places. `#b800ab` clears AA in both roles the token plays: as text on the page
and card, and as the surface carrying `text-background`. The exact brand hexes
stay untouched in `--signal-magenta` / `--signal-mint` for the logo.

### Two things are deliberately not done yet

**`<html>` is still hard-stamped `data-theme="dark"`** and **`ThemeToggle` is
not mounted in the navbar.** Both land in the same change at the end. A toggle
offered today would drop a reader into a site 665 literals short of converted,
which is worse than no toggle.

`check:theme` holds them together. It asserts the pairing rather than either
half, so it is correct now, correct at the end, and **fails in the gap** — the
toggle cannot appear early and the stamp cannot come off without it.

### `check:theme`

Also asserts the thing duplication always breaks: the two dark blocks are
compared **declaration by declaration**, because if they drift, the site someone
gets from their OS and the site they get from the toggle are different and
nothing else here would notice. And that no token is defined for light only —
those do not go missing, they *leak*, showing a light value in the dark theme.

It failed on its own first run by finding the phrase `className="dark"` inside
the comment explaining that `className="dark"` had been removed. Source read as
text has to know prose from code; the same lesson is already written down here
about the hints parity check.

### What light looks like today, measured

```
[light] 4894 of 6270 text nodes measured
819 node(s) below AA, from 53 distinct pairings
```

Not a surprise and not a problem — it is the remaining work, with a number on
it. The shape confirms the estimate above:

```
1.40-1.71:1  #00d3f2 on various      x343   cyan-400 = theme.text, National 5
1.35:1       #cad5e2 on #f4f4f7        x7   text-slate-300
1.24:1       #90a1b9 on #898f9a        x1   text-slate-400
1.00-1.08:1  #d4fdf0 / #d6fff1         x2   signal-mint as text
```

**`theme.text` alone is 343 of the 819** — 42%, from 35 strings in one file.
That is step 3, and it is the cheapest 42% in the job.

**No light baseline is recorded, deliberately.** `--theme=light` fails until the
work is done, which is the direction the ratchet should point. Record one only
at the end, for whatever is genuinely accepted.

### One thing found on the way, and it is not light mode's fault

`check:budget` failed on all five `course/*` templates the moment the toggle was
mounted. The toggle costs **1.0 KB**. The templates had already drifted to
**9.4 KB of their 10 KB headroom** — so any kilobyte, anywhere, would have done
it. That is precisely the trap `worksheet_generator/docs/new-course.md`
describes: growth inside the headroom is tolerated, never banked, and **never
reported**, so a template reaches the edge in silence and the next person to add
a button pays for everyone. The Explorer once reached 12 bytes this way.

Unmounting the toggle put it back to 882 KB. **The drift is still there**, it is
pre-existing, and the ratchet refuses to re-record upward by design — so mounting
the toggle at the end will fail unless ~1 KB is reclaimed from those templates
first, or the baseline is deliberately moved. That is a decision, not a bug, and
it is listed below.

---

## The accents, and the 48 dark failures (step 3, done)

One file, `lib/course-theme.ts`: 35 strings, 265 call sites. It fixed the dark
site outright and took light from 505 nodes below AA to **263**.

### The dark site now passes

**48 -> 0.** `check:contrast` reports *every measured node clears AA* on all
fourteen surfaces, and the baseline is re-recorded at **zero pairings** — so the
accents can never drift back without failing the check.

700 is the first level where white clears AA in every hue used:

```
cyan-600   3.62 -> cyan-700   5.28      amber-500   2.13 -> amber-700   5.03
orange-600 3.58 -> orange-700 5.22      emerald-600 3.65 -> emerald-700 5.36
```

Higher Applications was left alone: white on violet-600 is 5.89 and on
purple-600 is 5.54, both already AA. Matching it to the others would have been
consistency for its own sake.

Two things outside the theme file were in the same family:

- **`app/page.tsx` carried its own copy of all five gradients.** Every other
  surface moved to 700 and the home page alone kept failing at 3.22:1. The field
  is gone from `CourseCover`; `ExamCover` reads `getCourseTheme(course.id)`.
  One course identity, one place.
- **`text-white/80` and `text-white/90` fail on *every* colour in the site**, not
  only the ones whose surface was wrong — 3.31 on red-700, 3.92 on purple-600.
  Both are now full white. Three Connect buttons were darkened too (amber-500
  2.13, yellow-600 2.94, green-600 3.22).

### `theme.text` had to go to 800, not 700

700 clears AA on a card (5.28) and on the page (4.81) and was the first answer.
But `theme.text` is also read **on `theme.tint`** — the accent at 15% over the
page — and **246 nodes landed there between 4.05 and 4.43**. Just under,
everywhere.

Lightening the tint does not rescue it: at 8% the page-tint still gives only
4.39. The page ground costs it, not the wash. 800 clears every context the token
appears in; the worst case across all five courses is **5.51**.

The light accent is therefore deeper than the dark theme's glow. That is the
honest trade — a 400 that reads on black cannot also read on white.

### Two real bugs found on the way, neither of them about colour

**React was destroying the reader's theme.** `data-theme` was rendered from JSX
in `app/layout.tsx`. On `/explorer?c=n5` a reader who had chosen light got dark,
deterministically, while plain `/explorer` was fine: the Explorer reads its own
`?c=` in a **lazy `useState` initialiser**, so that URL makes the client's first
render disagree with the built HTML, React discards the server DOM and
re-renders the tree — re-asserting every attribute the layout's JSX declares.
Removing it from JSX was not enough; React then *deleted* it instead. The script
now owns the attribute and **defends it with a `MutationObserver`**, which is
the only form that survives a mismatch anywhere, not just this one.

`PracticeModes` already documents this exact trap and names `app/explorer/page.tsx`
as doing it. **The Explorer's lazy initialiser is still there** — it is a
pre-existing bug that throws away the server render on every shared link, and
fixing it is a visible behaviour change to the landing experience, so it is
listed below rather than done here.

**`check:contrast` was measuring a half-recalculated page.** Stamping
`data-theme` after load does not restyle elements that already exist: a freshly
created element reading `var(--muted-foreground)` computed the light value while
an `<a class="text-muted-foreground">` present since load still computed the
dark one — same variable, same document, same frame. The light sweep was
inventing failures; the real count was 819 reported against 505 actual. It now
seeds `localStorage` and navigates, so every page is styled from the first byte
by the site's own script — which also means a broken theme script fails the
check instead of being stepped around.

**And `check-headers-redirects` had a latent false positive.** Next splits the
inlined RSC payload on byte count with no regard for what it cuts through. One
class string growing from `text-cyan-400` to `text-cyan-700 dark:text-cyan-400`
moved a seam into the middle of lucide's SVG namespace, and the build failed
with `origin www.w3.or is fetched but not in the CSP`. The scan now closes the
seams first, which is what the browser does with them.

### What is left, all of it step 4 or 5

```
 x77  #005f78 on #082339   accent on bg-slate-950/900   <- step 4
 x31  #e0fff4 on #fefeff   signal-mint as TEXT          <- step 5
 x85  #5a5a66 / #5b6b80 on dark slate surfaces          <- step 4
 x25  #90a1b9 / #cad5e2 as text on the light page       <- step 4
 x14  #ff00ed on #333644   signal-magenta as TEXT       <- step 5
```

---

## The literals (step 4, done) — and both themes reach zero

**Light: 263 nodes below AA -> 0. Dark: still 0.** Both baselines are now
recorded at zero pairings, so neither theme can regress without failing.

### The mapping

499 slate literals in `components/` and `app/`, onto tokens that already
existed. The semantic ladder was unambiguous once counted — 64 plain
`bg-slate-800` against 40 `hover:bg-slate-700` is a control and its hover:

```
bg-slate-950 -> bg-background     text-slate-50/100/200/300 -> text-foreground
bg-slate-900 -> bg-card           text-slate-400            -> text-muted-foreground
bg-slate-800 -> bg-muted          text-slate-500            -> text-muted-dim
bg-slate-700 -> bg-muted-hover    border-slate-800          -> border-border
```

`--card` and slate-900 turned out to sit at almost the same lightness (0.0082
against 0.0089), so the surface structure survived intact; what went was the
blue tint, which is what `globals.css` always said the brand was.

### `white` -> `foreground` is the whole alpha tail

The 166 white-alpha utilities looked like the tedious part of this job. They are
not, because **`--foreground` is near-white in dark and dark ink in light** — so
`border-white/10` becomes `border-foreground/10` and means *the same thing* in
both themes: a 10% hairline in the ink of whatever theme is showing. Dark is
unchanged by construction. 482 of them across the site, entirely mechanical.

Plain `text-white` is the exception and stays: it sits on brand gradient
buttons, which are the same colour in both themes.

### The notes content was 1,900 more, and nobody had counted it

`src/notes/data/*.tsx` carry the course notes as JSX — and 711 `text-white`,
376 white-alpha, 288 `bg-slate-800`, 271 `text-slate-300` with them. The same
mapping applied, plus `text-white -> text-foreground`, because every coloured
box in notes is a 5-10% wash rather than a solid, so its white text was really
text on the page ground all along.

**A latent bug fell out of this.** Some notes SVGs already carried
`text-slate-800 dark:text-foreground` — a light/dark pair written before there
was a light mode. `dark:` used to mean `prefers-color-scheme`, so a reader on a
**light OS** got dark ink on the dark page: an invisible diagram. Binding
`dark:` to `[data-theme]` in step 2 fixed it before anyone noticed it.

### Four things the mapping could not answer

- **`.glass`** hard-coded `rgba(2, 6, 23, 0.8)`, so in light the navigation bar
  stayed dark while its text turned to light ink — 84 nodes, every page, the
  single largest failure. Now `var(--glass)`, with the dark value exactly what
  was inlined before.
- **`text-signal-magenta` used as text** is 3.03:1 on white. It is now
  `text-accent`, which is **free in dark** — `--accent` and `--signal-magenta`
  are both `#ff00ed` there — and correct in light.
- **`text-signal-mint` used as text** at 1.05:1. No colour in that hue clears AA
  at the 60-80% alpha those call sites used, so the alpha went, and `--mint-ink`
  carries the text role while `--signal-mint` goes back to being what its own
  comment says it is: the logo motif, now its only remaining use.
- **`text-white` on `bg-muted`** — fine in dark, invisible in light. Those
  became `text-foreground`.

### The accent moved again, and a check caught me being wrong

`--accent` went `#b800ab` -> `#a3009a`. The Academy pill is `bg-accent/10
text-accent` — the accent on **its own tint** — and at `#b800ab` that sat at
4.41:1. A token has to clear AA in the worst place it is used, not the
commonest.

And I put the ExamCover list marker `—` into `--muted-faint`, the decorative
tier. It is a text node, so it is held to 4.5 and it came back at 2.64 — a
**dark-theme regression I introduced**, caught by the zero baseline recorded an
hour earlier. That is the ratchet doing exactly what it is for.

### Verified by eye as well as by number

Dark and light screenshots of the home, course and notes pages, side by side:
structurally identical, no layout movement, accents intact. The one visible gap
is the **logo**, which is invisible on a light navigation bar — the asset item
below, and now the most obvious thing left.

---

## Turning it on (steps 7 and 8, done)

**Light mode is live.** A reader who has expressed no preference gets their OS's
choice; a toggle in the navigation bar overrides it and the choice persists.

### The toggle cost 518 bytes too many, so it stopped being a component

`components/ThemeToggle.tsx` was a tidy client component — `'use client'`,
`useState`, an effect, two lucide icons — and it cost about **1.0 KB**. Five
`course/*` templates had already drifted to 9.4 KB of their 10 KB `check:budget`
headroom, so it failed all five at once, **518 bytes** over the line.

Raising the baseline was the obvious move and the wrong one: `--baseline`
refuses above `baseline + headroom`, so it would have meant hand-editing the
guard's own data file to get past it — over half a kilobyte, on a session where
the checks caught three real faults including two of mine.

None of that kilobyte was necessary. `<html data-theme>` already holds the
theme, so:

- **the glyph is drawn in CSS** — a half-filled disc, the conventional contrast
  icon, two declarations, and it rotates 180° in dark for free state feedback
- **no state and no effect**, because nothing needed mirroring
- **no separate module**: the button is markup in `Navbar.tsx`

`1.0 KB -> 268 bytes inside the headroom.` No baseline was moved.

### The handler has to know what an unstamped reader is seeing

Once the default is "no attribute", `getAttribute('data-theme')` returns null
for most readers — so a handler reading only the attribute would compute
`'dark'` on a dark-OS machine and the first press would set the theme they were
already in. It reads `prefers-color-scheme` as the fallback, and `check:theme`
fails if it stops doing so.

### The logo

`public/img/logo/clelland-maths-logo-light.png`: the mint motif recoloured to
`#0b5d57`, **every other ink untouched**. Chosen to hold the relationships the
original has in dark — 7.04:1 against the page where the mint is 17.99, and
2.38:1 against the magenta wordmark where the mint is 2.95. A lighter teal that
looked better in isolation measured **1.02:1 against the wordmark**, which is
the classic magenta/teal confusion pair, and was rejected on that number.

The letters' apparent white outline turned out to be **transparency**, not white
ink, so it needed nothing.

Swapped with a `content` rule on the `<img>`, in the same three blocks as the
palette. That covers the navigation bar, the footer and any future use of the
mark **without editing `Footer.tsx`**, which is not this branch's to touch, and
costs no JavaScript. Verified: `content: normal` in dark, the light asset in
light, an identical 69x44 box in both, no layout shift.

`themeColor` in the viewport was a single `#0a0e17` and is now one value per
theme — the same class of bug as `.glass`, a colour hard-coded when there was
only one theme to hard-code for.

### Verified end to end

```
fresh reader        data-theme = null   body #f4f4f7   (the OS decides)
after 1st press     data-theme = dark   body #0a0a0c
after 2nd press     data-theme = light  body #f4f4f7
after navigation    the choice survives
/explorer?c=n5      the choice survives  <- the page React used to clobber
```

Both themes: **every measured node clears AA**. `check:budget`: no template grew
by more than 10 KB.

---

## Second pass — dark chrome, and dark back to blue-grey

The first pass shipped and **did not look good**. Two separate problems, and only
one of them was about light mode.

### Dark mode had changed, and that was a side effect rather than a decision

Replacing 499 slate literals with tokens moved every surface from blue-grey to
neutral grey, because the tokens were neutral and slate is blue. Nothing about
light mode required it. The dark palette is now slate again, at the same
lightness ladder:

```
--card   #16161a -> #0f172b      --muted-foreground #9a9aa2 -> #90a1b9
--muted  #333338 -> #1d293d      --muted-faint      #616169 -> #566b85
--border #232328 -> #1d293d      --foreground       #f5f5f7 -> #f1f5f9
--muted-hover #43434a -> #314158
```

`--background` and `--muted-dim` are unchanged: neither was ever a slate
literal. `--muted-faint` went to `#566b85` rather than slate-600 `#45556c`
because slate-600 is 2.35:1 on a card and this tier's own comment promises the
3:1 non-text guide.

**One thing could not be restored.** `text-slate-300` (`#cad5e2`) was the
secondary body tier and was merged into `--foreground` with slate-100/200.
Splitting it again means re-deciding 84 call sites by hand. Body text is
therefore brighter than it was; if that ever reads wrong, the fix is a
`--foreground-2` token and a pass over those sites.

### The chrome is dark in both themes

The navigation bar, the footer and the home hero use **only tokens** — so
re-declaring the palette on those elements turns each subtree dark with no
component changes. `.on-dark` and `body > footer` join the existing
`:root[data-theme="dark"]` selector rather than getting a third copy of the
palette, which would be a third thing to keep in step.

`components/Footer.tsx` was never edited. It is not this branch's to touch, and
a selector reaches it perfectly well.

**Two things the scope alone did not fix**, both found by `check:contrast`:

- **Scoping tokens is not scoping colour.** The home `<h1>` has no colour class,
  so it inherited the *computed* colour from `body` — resolved against the light
  palette long before it reached the dark hero. "Pass your" came back at 1.1:1,
  dark ink on black. `.on-dark` sets `color` as well as the tokens.
- **The glass was dark-coloured but not dark enough.** `rgba(2, 6, 23, 0.8)` over
  a light page composites to `#333644`, and the magenta *Academy* link sat at
  3.7:1 on it. At `0.92` it is `#151929` and the link is 5.38:1.

### The home hero is a black band

`LogoAnimation`'s geometry was pixel-measured against the logo asset and its own
comments describe the motif as *mint-on-black*; on a white page it is 1.05:1 and
simply is not there. The hero is `on-dark`, so the bar and the hero read as one
black block and the page turns light at *Choose your course*.

### The light logo variant is gone

With both chrome regions dark, the original mark is correct everywhere it
appears. The `content` swap and `clelland-maths-logo-light.png` are deleted. The
measurements behind `#0b5d57` are kept above, in case a light-background use of
the mark ever appears.

### Flatness was an edge problem, not a fill problem

`--border` in light went `#e2e2e8` -> `#d7d7e0`. A light interface separates with
**edges** where a dark one separates with **lightness**: `bg-card/40` over the
page is `#f8f8fa`, and although the alpha maths is symmetric with dark, small
luminance differences near white are far less visible than the same differences
near black. The page and card tones are unchanged.

### The expensive lesson: a mass rename breaks checks that select on class names

`check:nomarkscheme`, `check:another` and `check:card` select overlays and cards
by utility class — `div.fixed.inset-0.z-50.bg-slate-950`, `div.bg-slate-900`.
Step 4 renamed those classes across 51 files and **the browser suite was not
re-run**, so all three had been red on `dev` since `4c6ab02` while the source
checks, the build and both contrast sweeps stayed green.

They failed loudly when finally run — `undefined rows in Focus` — so nothing was
hidden. Nobody had looked.

**After a mass rename, run the browser checks.** The source checks and the build
cannot see a selector that has stopped matching, because it is a string.

---

## The order

1. ~~`check:contrast`~~ — done, baseline recorded.
2. ~~Light palette and theme plumbing~~ — done, `check:theme` guards it.
3. ~~`lib/course-theme.ts` and the 48 dark failures~~ — done. Dark is at zero;
   light went 505 -> 263.
4. ~~The slate literals, the alpha tail and the notes content~~ — done.
   **Both themes now measure zero nodes below AA.**
5. ~~The alpha washes~~ — done as part of step 4; `white` -> `foreground` was
   mechanical rather than the judgement call it looked like.
6. ~~Full sweep at both themes~~ — done. `contrast-baseline.json` and
   `contrast-baseline-light.json` both record **zero pairings**.
7. ~~Turn it on~~ — done. The toggle is in the navbar and the forced-dark
   fallback is gone, in one change, as `check:theme` requires.
8. ~~The logo~~ — done, without touching `Footer.tsx`.

## Open questions for the owner

- ~~The 48 AA failures on the dark site~~ — **fix them in this branch**, decided
  2026-09-16, alongside the accent work in step 3 since both edit the same file.
- ~~Follow the OS, toggle, or both?~~ — **both**, decided 2026-09-16. Built.
- ~~How far does light go?~~ — **true light, near-white surfaces**, decided
  2026-09-16. Built: page `#f4f4f7`, cards `#ffffff`.
- **The `course/*` budget drift.** 9.4 KB of 10 KB headroom is already spent,
  before light mode adds anything. Mounting the toggle at the end needs ~1 KB
  reclaimed from those templates, or a deliberate re-baseline. Needs a decision
  before step 6.
- **The logo variants** need the source artwork. Also `text-signal-magenta` and
  `text-signal-mint` are used as *text*; on white they are 3.03:1 and about
  1.05:1. Those call sites want `text-accent`. Step 5.
- **The Explorer's lazy `useState` initialiser** (`app/explorer/page.tsx:1694`)
  reads `?c=` and `localStorage` during render, so every shared link hydrates
  with a mismatch and React re-renders the whole page client-side. It is the
  pattern `PracticeModes` documents as wrong, and it names this file. Fixing it
  means the course chooser shows for a frame before the saved course appears —
  a visible change to the landing experience, so it needs a decision rather
  than a quiet fix. The theme no longer depends on it.
