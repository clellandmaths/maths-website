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

## Still to build (answered yes on the sheet)

2 the KaTeX fonts asked for early; 3 diagram sizes (its own job); 4 the practice paper holds its height; 5 Start
Paper and Focus Mode open their frame at once; 7 Another like this one keeps its button until the question is in;
8 the markscheme print never gives up silently; 9 three buttons that say nothing; 10 screen readers and reduce motion
for those. Then 13: the speed of a shared sheet's question maker, measured read-only first.
