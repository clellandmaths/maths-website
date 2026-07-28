# Guided practice — question attribution

The guided practice questions come from two sources, and only one of them
carries an attribution obligation.

| Source | Count (National 5) | Attribution |
|---|---|---|
| Past paper questions | 201 | None — these are exam questions, tagged in the text as e.g. `2014 P1 Q1` |
| **maths.scot** | **205** | **Link to the written solution on maths.scot, in the answer** |

The owner of maths.scot has given permission for his questions to be used here
on the condition that **each answer links to the full written solution on his
site**. We show the final answer and our own video; the written working stays
with him.

This is already a reciprocal arrangement — his topic pages link out to the
Clelland Maths YouTube videos at matching timestamps.

## How the links are derived

His topic pages carry a copy-link icon per worked example with a canonical
deep link, e.g. `https://www.maths.scot/nat5/surds#3`. Those were extracted
along with each example's question text, and our questions matched against them.

The guided practice data has no reference to his example numbers, so text
comparison is the only way to establish the mapping. His question text is used
**as a matching key only** and is not stored or published.

**The rule, which cannot produce a wrong link:**

1. Question text matches an example → deep link to that example (`…#3`)
2. No confident match → link to the topic page (`…/nat5/surds`)
3. Never a guessed example number

Both satisfy the condition. A guessed deep link would point at the worked
solution to a *different* question, which fails it more badly than a general
link does.

## Match rate

**109 exact (53%), 96 topic-level (47%)** across the 205 National 5 questions.

The shortfall is not a matching failure. Many questions were **reworded when
they went into the app**, because it could not display his diagrams, so the
dimensions were written into the text instead:

> his — *"Find the volume of **this cylinder**"* (with a diagram)
> ours — *"Find the volume of a cylinder **with base radius 6 mm and height 1 cm**"*

Mathematically the same question; textually unmatchable. Those correctly fall
back to the topic page.

Two matcher bugs were found and fixed while establishing this, both of which
had been suppressing real matches:

- a minimum-length guard skipped short questions, so identical strings such as
  `solve3x25` never matched;
- LaTeX presentation commands differ between the two sites (`\large` versus
  `\displaystyle\small`) and had to be stripped, since they carry no
  mathematical meaning.

## Rebuilding the map

`scratchpad/fetch-mathsscot.ps1` caches his topic pages, `build-links.mjs`
extracts example links, `match-all.mjs` produces the map. The fetch is polite —
sequential, delayed, and cached so it runs once.

If his site is reorganised the deep links may rot. The topic-level URLs are far
more stable, so a periodic check of the deep links is worthwhile; a broken
attribution link is worse than a general one.
