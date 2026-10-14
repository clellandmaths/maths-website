# Loading states

The owner, 2026-10-12, after a shared sheet felt slow: "Should we have loading states in general? What is pro
way?" A read-only audit timed every wait on the live site (49 of them, plus a 50-question sheet), and the owner
answered each card on its sheet (https://claude.ai/artifact/WzoVNDTVtdk6Bu7xtvdJ4M, v2, 2026-10-14). The timing tools
are outside the repo, in `tools/loading/` at the workspace root.

## The rules (on the sheet, agreed)

- Under 0.1 s: nothing. 0.1 to 1 s: at most a busy button. 1 to 10 s: say what is happening, in words, where the
  result will appear, and show what is already known at once. Over 10 s: a count.
- A loading sign waits half a second before it shows, so a quick wait shows nothing at all. The space is held from
  the start, so nothing moves either way.
- A screen reader hears "loading" and "ready"; under "reduce motion" nothing sweeps.
- **Quote first visits and return visits together.** The slow lab phone (CPU 4x, 150 ms, 1.6 Mbit/s, empty cache)
  is a first visit on an older phone with poor signal: a 50-question AH sheet took 12.9 s there and 2.5 s on a
  return visit (the owner's own phone on 5G: "about 2 or 3 seconds").

## The piece

`components/LoadingStatus.tsx`, with `.loading-reveal` and `.loading-sweep` in `app/globals.css`. It takes a label
("Setting out 20 questions"), an optional count (`done` of `total`) and the course's `theme.progress` for the bar.
Use it only where a card on the sheet said yes; it is not a replacement for a busy button.

## Where it is used

- **The shared sheet** (`app/worksheet/page.tsx`, card 1): the header (course, title, how many questions, the way
  back) and the buttons, greyed out, show as soon as the link is read; the panel counts the questions as
  `resolveWorksheet` settles them (its `onProgress`). The same header serves both states, so nothing in it moves
  when the questions arrive. The page fetches KaTeX with the questions (`warmMathRenderer`) and its maths boxes are
  `immediate` (`components/MathRenderer.tsx`): drawn before the browser paints them, because a box drawn empty and
  then filled pushed every card below it down (0.34 of layout shift on a slowed phone, 1 run in 3 even with KaTeX
  fetched early). `immediate` is opt-in; every other caller draws exactly as before.

Held by `npm run check:sheetloading` (header before the questions, buttons disabled, the half-second wait, the count,
"ready" for a screen reader, no layout shift, no panel on a fast device, still under reduce motion). It fails 8 of 14
on the code before this change, run against live with `SITE=https://clellandmaths.com`.

**Measuring layout shift:** never while polling the page. Reading layout every frame to time a wait forces
half-finished frames and reports shifts a real visit never has (the AH sheet read 0.34 with polling, 0 without).
The check measures shift in a run of its own that only waits.

## The second batch (cards 2, 4, 5, 7, 8, 9, 10; the owner, "Go", 2026-10-14)

- **Card 2, the maths fonts** (`components/MathRenderer.tsx`): the three faces nearly every formula uses (KaTeX_Main,
  KaTeX_Math italic, KaTeX_Main bold) are asked for by name (`document.fonts.load`) whenever KaTeX is fetched, rather
  than after the first formula is laid out. `warmMathRenderer` waits for them (at most 3 s), so the shared sheet shows
  its maths with every letter. The shared sheet now fetches KaTeX after its questions are made, not alongside: at the
  same time it took bandwidth from the question maker (a 5-question sheet finished 0.3 s later).
- **Card 4, the practice paper** (`PracticePaperClient.tsx`): a screen's height held while it builds; the buttons
  there from the start, disabled, where the "Building your paper" line used to be swapped for them; KaTeX before the
  first card and the cards `immediate`; "Another practice paper" holds the old paper's height until the new one is in.
- **Card 5, Start Paper and Focus Mode** (`CoursePageClient.tsx`): a frame opens on the press (the paper's name, a
  Cancel button, then `LoadingStatus`), full screen draws over it; the page is never emptied. Browse Questions shows
  "Loading…" on its own button; the "Loading questions..." line at the top of the list is gone.
- **Card 7, Another like this one** (`AnotherLikeThis.tsx`, `MoreLikeThis.tsx`, `PracticeGenerate.tsx`): busy until
  the question is placed (`onDrawn` may return a promise); the drawn card is `React.lazy` with the button as its
  Suspense fallback (next/dynamic left 20 frames with neither); "Making a new question…" after a second
  (`lib/use-slow.ts`); "Add 10 to a worksheet" spins itself.
- **Card 8, the markscheme print**: `printMarkscheme` keeps its 1.5 s limit, **because an iPhone only opens the print
  dialog soon after the tap** (the sheet's "up to 8 s" would have made iPhones ignore the print). When it gives up,
  the button says "Ready: press again to print" (`aria-live`), and the second press prints at once.
- **Card 9**: Formulae is `React.lazy` with a frame (`FormulaeFrame`) as its fallback, drawn on the press; the list is
  top-anchored, so it grows downward instead of re-centring (it moved 292 px); "Open as a worksheet" says "Opening…"
  (reset if the page comes back from the browser's back cache); the dice say when new numbers could not be made.
- **Card 10**: every result and error line named on the sheet sits in a status region that is always there
  (`role="status"`, `contents` where the parent is a flex row), so a screen reader hears it when it appears.

Held by `npm run check:loadingmore` (16 points; fails 15 of 16 on the code before this batch, run against live).

**Found, not built, asked first:** the practice paper's 20 px jump as it starts is the site's typewriter font
(JetBrains Mono) swapping in: its stand-in is wider, so the trail of links wraps to two lines, then one. It comes
from how the whole site loads that font (`app/layout.tsx`), so any page whose small mono text wraps differently can
jump the same way. A fix would change every page's first visit.

## Still to do

3 diagram sizes (its own job, its own sheet); 13 the speed of a shared sheet's question maker, read-only first.
