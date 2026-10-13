# Long maths on a phone

**The problem** (the owner's screenshot of AH 2026 P2 Q13, parked 2026-10-04, chosen 2026-10-13: "Let's go E").
KaTeX breaks a long inline formula after "=" or "+" when it reaches the edge of a narrow screen. When the next line
starts with a tall fraction, the fraction's numerator is drawn above its own box and reaches into the line above
(2026 P2 Q13: the "1" 10 px into "x + 3"). A few formulas have a piece that cannot break at all (2025 P2 Q18's bracket)
and ran off the edge. On the AH paper pages at 320 px: 158 overlapping, 14 off the edge; at 390 px, 97 and 1.

**What the site does now, phones only (below 768 px), screen only:**
1. A formula that fits on a line of its own stays **whole**: it moves to the next line as one piece.
2. One a little too wide stays whole and is **set smaller**, never below 85%.
3. One longer than that **breaks**, with its lines set as rows with a gap, at full size, so nothing can touch
   (the independent audit's CSS).
4. Only a piece that cannot fit even broken is set smaller, down to 70%.
5. **Not in tables**: a formula in a cell always breaks (spaced). Kept whole, it widened the marking-instructions tables
   past the phone (71 -> 95 boxes scrolling sideways at 320 px).

Nothing scrolls sideways. Result, every paper page of every course with every answer open: 0 overlapping and 0 off the
edge at 320 and 390 px; nothing newly wider than the screen; layout shift unchanged; print identical.

**Where it lives:**
- `app/globals.css`, the block "Long inline maths on a phone": the rules, all under
  `@media screen and (max-width: 767px)`. **Print never reads them**, so the printed page is exactly as before (proven
  box for box).
- `lib/maths-fit.ts`: decides which formulas stay whole and which are set smaller, by marking them (`data-whole`,
  `data-fit-scale`, `--fit`), in batches. It waits for KaTeX's fonts (measured in the fallback font a formula is
  narrower than it will be), fits maths that arrives later (hints, answers, generated questions, through a
  MutationObserver) and refits when the width changes. The size is a fraction of the site's own 1.1em.
- `components/MathsFit.tsx`, mounted once in `app/layout.tsx`: renders nothing and fetches `lib/maths-fit.ts` only on a
  phone-width screen, after the page has loaded, so no page carries it.

**What holds it:** `check:mathsfit` (scripts/check-maths-fit.mjs): three AH papers at 320 and 390 px, every answer open;
fails on any formula whose lines overlap (measured by its characters, not its pieces' boxes, which is the only way the
numerator's reach shows), any formula past its column, any box newly wider than the screen, or any change to the printed
page, each against the fit switched off.

**What it does not fix:** a long equation that must still break can break somewhere awkward, after a "+" or inside a
bracket (AH 2021 P2 Q9: "P(5 −" then "P)"). The paper sets those equations on a line of their own. The real fix is to
write them as display maths (`\[ … \]`) in the question, a separate job (proposed 2026-10-13: the long main equations,
AH first, contact sheets for generated cards because their lines are fingerprinted).

**The measuring tools** (read-only, tools/never-the-paper/scripts): `wrap-measure.mjs` (every inline formula's lines,
overlap by characters, edge, size; `ALL=1` every course, `NOFIT=1` the fit switched off), `wrap-scrollboxes.mjs`,
`wrap-cls.mjs`, `wrap-print-proof.mjs` (with a SELFTEST that must fail), the candidates A to E (`wrap-*.js`, `.css`) and
the owner's contact sheet https://claude.ai/artifact/TW8b6stFtwqeLnEDZqvFT9.
