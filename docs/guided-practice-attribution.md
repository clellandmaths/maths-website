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
2. Otherwise, if the topic has a **unanimous offset** derived from its matched
   questions → deep link by position + offset
3. Otherwise → link to the topic page (`…/nat5/surds`)
4. Never a guessed example number

The guided practice was built following his example order — our question 1 is
his example 1, and so on — so position is good evidence. But it is not trusted
blindly: the offset is *derived* from the questions we can match by text, and
applied only where every one of them agrees. Every topic with a consensus came
out at **+0**, except Trig Identities at **+7**, which corroborates the ordering.

## Result

**145 deep links (71%), 60 topic-level (29%).** Of the deep links, 116 were
matched directly by text and 29 placed by a verified offset.

The remaining topic-level links are legitimate, not failures:

- **22 are Rounding**, where his page is a notes page carrying **no worked
  examples at all** — there is nothing to deep-link to.
- Most of the rest are questions **reworded when they went into the app**,
  because it could not display his diagrams, so dimensions were written into
  the text instead:

> his — *"Find the volume of **this cylinder**"* (with a diagram)
> ours — *"Find the volume of a cylinder **with base radius 6 mm and height 1 cm**"*

Mathematically identical, textually unmatchable — and correctly not guessed at.

## Matcher bugs found and fixed

Three, all of which suppressed real matches and one of which produced *wrong*
ones. Worth recording, because the same traps apply to Higher and AH:

1. A minimum-length guard skipped short questions, so identical strings such as
   `solve3x25` never matched.
2. LaTeX presentation commands differ between the two sites (`\large` versus
   `\displaystyle\small`) and carry no mathematical meaning, so they must be
   stripped.
3. **The two sides were normalised differently** — his text kept a trailing
   `small` from `\small`. Exact matching then failed and a 24-character prefix
   match took over, which matched *the wrong example* on questions sharing a
   stem like "Multiply out the brackets and collect like terms". This produced
   a convincing but false "off by one" pattern. Both sides must use the same
   normaliser; there is now a comment in `build-links.mjs` saying so.

The teacher caught this one by checking Expanding Brackets by hand and finding
the first five examples matched exactly. They now do.

## Rebuilding the map

`scratchpad/fetch-mathsscot.ps1` caches his topic pages, `build-links.mjs`
extracts example links, `match-all.mjs` produces the map. The fetch is polite —
sequential, delayed, and cached so it runs once.

If his site is reorganised the deep links may rot. The topic-level URLs are far
more stable, so a periodic check of the deep links is worthwhile; a broken
attribution link is worse than a general one.
