# Generated questions on the website

Where a freshly generated National 5 question can come from, the rules every
one of those places follows, and what proves they still do. Written 2026-09-14.

The generator itself — what it makes and why — is
`worksheet_generator/docs/PLAN.md`. This is the website's half.

---

## Start here

```
npm run build                  # the source checks run first, then two on out/
node scripts/check-card-variation.mjs      # and nine more that need Chrome
```

**The engine is on 0 of 542 pages, and that is the number to watch.** It is
about 33,000 lines in 645 KB of lazy chunks, reached only through
`await import()`. `check-engine-isolation.mjs` fails the build if any page ever
references one of those chunks.

---

## Where a generated question comes from

Seven surfaces, all National 5 only.

| where | what it offers |
|---|---|
| **Explorer card** | *Variation* — swaps the card to a new question modelled on that one. Shown before it is added |
| **Explorer toolbar** | *Add a variation of each*, and *Generate new on N topics* with a count per topic |
| **`/course/n5/generate`** | the by-skill builder — 30 groups, 174 skills, a count each |
| **`/course/n5/generate/paper/…`** | a whole paper, one question modelled on each of a real one's |
| **Practice topic page** | *Keep practising* at the foot, and *Another like this one* on each question |
| **Exam Hall Warm Up** | five more, on the completion screen only |
| **`/worksheet`** | rebuilds a shared sheet from its codes and seeds |

**Two things deliberately do not generate.** Notes pages send a pupil to
practice instead — that link is the best signpost on the site and a generated
question there would compete with it. The home page's *Try a question* tile
keeps cycling real past paper questions: a second button doing the same visible
job would be absent half the time, since three of its six sources are Higher.

---

## The rules, and what enforces them

Every one of these was paid for once.

### One door

The engine is reached through `lib/generated-question.ts` and nowhere else —
that module filters to exam tier and refuses a warm-up; a caller reaching past
it into `lib/generator/` gets neither. **`check-engine-callsites.mjs` holds a
list of the files allowed through**, so a new call site fails the build until
somebody has looked at it.

It matches the boundary by path ending, not by the `@/` alias: the first version
looked for the alias and could not see `worksheet-share.ts`, which reaches it as
`./generated-question`.

### No engine on a client component

A *server* component may import it freely — `generate/page.tsx` calls
`offeredTopicGroups()` at build time and ships about 170 strings, which costs
the browser nothing. The rule is about `'use client'`, not about the path.

### Draws are sequential

The generator's random stream is module-level, so overlapping draws take each
other's numbers: a measured ten-question `Promise.all` changed all ten, and two
concurrent runs did not agree. The check pulls out the argument of every
`Promise.all`, `.map(async` and so on, and fails only if a draw appears *inside*
it — `Promise.all([import(…), import(…)])` is the legitimate way to load two
modules and is used at two call sites.

### An exclude set is always passed

Without one the engine has no memory between calls. Measured: ten clicks on a
six-deep pool gave six byte-identical repeats, and the basket's own guard does
not catch them because it keys on the uid, which carries the seed.

### The video comes with the question

A generated question has no filmed solution; the paper question behind it does,
and watching that worked is the tutorial. **`useGeneratedDraw` attaches it**,
rather than each caller remembering — three call sites forgot, and it took the
QR code and both full-screen modes' video links with it.

### The headings tell the truth

*Another like this one* draws from variations modelled on that exact question.
`check-variation-reach.mjs` proves the invariant it rests on: **328 of 328 past
paper questions are cited by an exam-tier variation**, and prints the pool
depth, which is 1 for 321 of them.

---

## The checks

In `build`, reading source:

| | |
|---|---|
| `check:gensync` | `lib/generator/` is an unedited copy — 94 files, 0 stale |
| `check:reach` | 328/328 questions cited, 57/57 subtopics covered |
| `check:topicmaps` | every practice topic mapped; **33 of 34 can generate** (not Rounding) |
| `check:callsites` | one door, no engine on a client component, no concurrent draws |

In `postbuild`, reading `out/`:

| | |
|---|---|
| `check:engine` | 5 engine chunks, 645 KB, on **0 of 542** pages |
| `check:budget` | per-template JS against a baseline, 10 KB headroom |

**Not in `build`** — these need headless Chrome, and the Cloudflare image has
none. Run them after a build when the work touches what they cover.

| | |
|---|---|
| `check:card` | the Explorer card shows a variation before it adds one |
| `check:practicegen` | a practice topic keeps going, hints and another-like-this per question |
| `check:practicepaper` | a paper clones whole — `--all` drives all 22 |
| `check:sharedsheet` | a shared sheet's card spends its space on the maths |
| `check:notespractice` | notes go straight to practice, and practice knows the way back |
| `check:warmup` | the warm up offers more, and only when it is over |
| `check:genvideo` | a generated question keeps the video of the paper behind it |
| `check:explorergen` | the Explorer asks before it guesses, and nothing is a dead end |
| `check:toggles` | the worksheet offers its toggles at any width |
| `check:wslayout` | the worksheet header holds its shape at every width |
| `check:nozoom` | nothing on the Explorer makes a phone shrink the page |

They share `scripts/browser-drive.mjs`, which serves `out/` and drives it.
**Clicks go through CDP, not `element.click()`**, which does not register on
this site's React controls.

---

## Traps in the checks themselves

Eleven times this session a check was wrong before the code was. Zero
implementations were wrong on the first look. Each of these is now a comment at
the site of the fix, and they are the ones likely to recur.

**Selectors must pick the laid-out element.** The Explorer renders its
`FilterSidebar` twice, desktop and mobile, and the hidden copy comes first in
the DOM — so a plain `querySelectorAll(…).find(…)` clicks a zero-sized twin at
phone width and every later assertion fails against a page that never changed.
`buttonNamed`, `buttonMatching` and `labelNamed` all filter by layout.

**`getComputedStyle(el).display` is the element's own display.** A button inside
a `display: none` header still reports `inline-flex`. A zero-sized box is the
fact.

**`\d` and `\b` inside a template literal lose their backslash**, and a backtick
inside one ends it. The evaluated expressions use character classes and no
backticks. The tell, when it happens: the assertions with backslashes fail and
the ones without pass.

**`innerText` is rendered text.** An `uppercase` class means a heading reads
`KEEP PRACTISING`, and matching the source spelling reports a section missing on
a page whose own button then works.

**Scope to the thing being tested.** A practice page has thirteen *Show answer*
buttons; a full-screen overlay sits on top of a page whose questions each have
their own *Hint*. An unscoped lookup tests the wrong one.

**Measure the delta, not the total.** `sessionStorage` survives navigation, so a
sheet still holds what an earlier step put there.

**And point every check at something known to be broken before believing it.**
Every check here has been run against the bug it exists to catch.

---

## What is still open

- **`dev` is a long way ahead of `master` and none of it is live.**
  `git rev-list --count master..dev` says how far.
- The findings in [navigation.md](navigation.md), recorded and not acted on.
- The responsive baseline has still never been read back — see
  [responsive.md](responsive.md). That is the ~90 minutes to spend immediately
  before a merge.
- Print is verified as *what the page hands the printer*. Nobody has driven iOS.
