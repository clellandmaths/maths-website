# Generated questions on the website

Where a freshly generated National 5 question can come from, the rules every
one of those places follows, and what proves they still do. Written 2026-09-14.

The generator itself — what it makes and why — is
`worksheet_generator/docs/PLAN.md`. This is the website's half.

---

## Start here

```
npm run build                  # the source checks run first, then two on out/
node scripts/check-card-variation.mjs      # and sixteen more that need Chrome
```

**The engine is on 0 of 542 pages, and that is the number to watch.** It is
about 33,000 lines in 891 KB of lazy chunks, reached only through
`await import()`. `check-engine-isolation.mjs` fails the build if any page ever
references one of those chunks.

---

## Where a generated question comes from

Seven surfaces, all National 5 only.

| where | what it offers |
|---|---|
| **Explorer card** | *Variation* — swaps the card to a new question modelled on that one. Shown before it is added |
| **Explorer toolbar** | *Add a variation of each*, and *Generate new on N topics* with a count per topic |
| **`/course/n5/generate`** | the by-skill builder — a count per topic, spread across that topic's skills; 30 topics, 174 skills one click down |
| **`/course/n5/generate/paper/…`** | a whole paper, one question modelled on each of a real one's |
| **Practice topic page** | *Keep practising* at the foot, and *Another like this one* on each question |
| **Exam Hall Warm Up** | five more, on the completion screen only |
| **`/worksheet`** | rebuilds a shared sheet from its codes and seeds |
| **Static paper pages** | *Hints* and *Another like this one* on all 22 National 5 papers — the addresses a search lands on |
| **Full screen and Focus** | *Another like this one* on the question a pupil is stuck on — the past paper archive, a practice topic, the revision marathon, and a shared sheet whose maker granted hints |

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
| `check:gensync` | `lib/generator/` is an unedited copy — 95 files, 0 stale |
| `check:reach` | 328/328 questions cited, 57/57 subtopics covered |
| `check:topicmaps` | every practice topic mapped; **33 of 34 can generate** (not Rounding) |
| `check:callsites` | one door, no engine on a client component, no concurrent draws |

In `postbuild`, reading `out/`:

| | |
|---|---|
| `check:engine` | 6 engine chunks, 891 KB, on **0 of 542** pages |
| `check:budget` | per-template JS against a baseline, 10 KB headroom |

**The budget ratchet only ever moves down**, and that is worth knowing before
you plan a feature. `--baseline` refuses to record anything more than the
headroom above the current file, so growth inside 10 KB is tolerated but never
banked. By 2026-09-15 the Explorer had spent all but **12 bytes** of its
headroom on work already shipped, which meant the next control added to any
shared component would fail — and one did. What paid for it was the check's
other use: it found the 53 KB `qrcode` library sitting **eagerly** on the
Explorer and on `/worksheet`, two pages where the codes only ever appear on the
printed sheet. Fetching it inside the effect that already generated the image
asynchronously — the library, not the component, so no render path changed —
left both pages *smaller* than their 2026-09-14 baseline. `check:genvideo`
drives the printed QR codes and is what says it still works.

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
| `check-hint-ladder` | the ladder says something on every press, on both kinds of question |
| `check:another` | *another like this one* is on every surface a pupil gets stuck on, and absent on the three that decided against it |
| `check:explorerdesk` | browsing on a desktop screen: a wider window is never a worse one, and a diagram is readable |
| `check:explorerfilters` | changing a filter puts you back at the top of the list, not at the end of a shorter one |
| `check:byskill` | a sheet can be built by topic without meeting 174 skills, and the skills still work underneath |
| `check:roundtrip` | a course and the Topic Explorer link both ways, under one name, without overflowing a phone |

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
a page whose own button then works. It caught the hint ladder check twice —
`THE SAME METHOD, DIFFERENT NUMBERS` read as a worked example that never
arrived, when it had arrived in under two seconds.

**`innerText` on a detached clone is `textContent`.** KaTeX renders its maths
twice, a hidden-but-rendered MathML copy beside the visible HTML, so live
`innerText` returns every symbol doubled. The obvious fix is to clone and strip
the MathML — and a clone has no layout, so `innerText` silently degrades to
`textContent` and **every line break disappears**. The panel then comes back as
one run-on string, and a detector reading it line by line sees nothing: a
deliberately broken rung passed while the panel visibly shrank by 98 characters.
Strip the MathML from the live node instead.

**Pin what you are pressing before you press it.** A practice page has five hint
ladders. "The first Hint button" works until that ladder is exhausted — its
button then disappears and the next question's becomes the first, so a walk
marches across questions and reports ten presses for a four-press ladder. Tag
the container once and select inside it.

**`includes('')` is true for every string.** A selector that finds nothing
returns `''`, and a check asking "is the twin's question different from the one
on screen" then answers no, every time. Guard the length of what you compare
against — guided practice renders `.prose-practice`, not the `.question-content`
the worksheet and paper pages use, and one selector does not fit every surface.

**Scope to the thing being tested.** A practice page has thirteen *Show answer*
buttons; a full-screen overlay sits on top of a page whose questions each have
their own *Hint*. An unscoped lookup tests the wrong one.

**Measure the delta, not the total.** `sessionStorage` survives navigation, so a
sheet still holds what an earlier step put there.

**And point every check at something known to be broken before believing it.**
Every check here has been run against the bug it exists to catch.

---

## The hint ladder

Rebuilt 2026-09-15. It used to be the marking instructions replayed one row per
mark, and it **ran downhill**: press 2 is our own prose, presses 3+ were the
examiner's, and they carried less. `2015 P2 Q4` went *"start process"*, then
*"solution"*.

```
Hint             What it asks      the variation's `skill`
Another hint     How the marks go  its `method`
More help (n)    2–4 authored moves, each with THIS question's own working
                 beside it and what it is worth
                 → past paper: one worked right through, answer included
                 → generated:  nothing; its video is already on the card
```

| | |
|---|---|
| `paper-plan.ts` | 190 plans serving 328 questions, 966 moves, **571 carrying working** |
| authored | **197 of 197** exam variations, ratcheted in `__checks__/plans.ts` |
| never shown | the last row of a question, and **52 mid-rows that are answers too** |

**The ladder is an overlay, from 2026-09-16.** It was a panel that grew on the
card, and every press made it taller — two prose lines, up to four moves with
their working, then a whole worked question with every step and its answer. In
full screen there was nowhere to put that: the row of controls alone is 250px
of an 844px phone. It now opens over the page, the same idiom as the formulae
sheet, **with the question pinned at the top** — a hint about a question you
cannot see is one you have to memorise the question for, and that condition is
what makes it better than the panel rather than merely different. Closing is
not undoing: press Hint again and everything already revealed comes back.
`HintPanel` is fetched at the press, not shipped to every page carrying a
button.

**Three things that are not obvious.**

*Moves, not marks.* Ladder length was the mark count, so a 7-mark question took
eight presses and a 2-mark one spent a press on "consistent answer in simplest
form". A move carries what it is worth instead — and **a move worth 0 shows no
chip at all**, which two 1-mark variations need, because moves are pedagogy and
marks are accounting.

*The instruction is authored per variation, the working is per question.* One
plan serves up to nine papers, so it never names a value only one of them has;
the concrete half comes from the scheme's illustrative column at emit time.

*`paper-steps.ts` is still here and no pupil reads it.* Its 1030 rows are the
control set every detector in `__checks__/plans.ts` is proved against. Deleting
it would make all of them unproven.

---

## Another like this one

Added 2026-09-15. It was on one surface — the guided practice page — so opening
the same topic in Focus or full screen lost it, and so did the past paper
archive, the revision marathon and a shared worksheet. The generator was
*already* on all of those: `Hints` renders there, and the bottom of that ladder
draws a generated twin and shows it worked right through. What was missing was
the version a pupil can **attempt**.

```
below           a practice page, Focus mode — they have a below, and the pupil
                is usually stuck on the question in front of them
in place        full screen — one card, no below, so it owes them
                [ Back to the question ]. Next and Previous clear it too
```

**The button moved to the foot of what it drew.** It used to stay above, so
asking for a second one meant scrolling back past the question and its answer to
a control you had already used. Moving it unmounts `AnotherLikeThis`, and a
button in a new place is a new component with an empty memory — so the list of
what has been drawn lives on the surface and goes back in as `alsoExclude`.

**Three deliberate absences.** Each is checked as hard as the presences, because
an absence with no check is indistinguishable from a bug.

*The Explorer's own worksheet.* It already offers *Variation* on every card,
*Add a variation of each* and *Generate on N topics* — all of which put the
question **on** the sheet. A twin drawn in a full-screen mode would be the only
one of the four that vanishes, on the one page built for assembling a sheet.

*A shared worksheet with hints off.* `worksheet-share.ts` sets the test: does it
change what the pupil is **given**, or only how they read it? Full screen is
always allowed because it is the latter; another question is the former, so it
belongs to the maker. It rides on the existing `hints` flag rather than a fifth
option letter, because granting hints already grants a generated twin worked end
to end — this hands over nothing new.

*The Exam Hall Warm Up*, which does not use the presenter at all and already
offers five more on the completion screen. During an exam simulation, no; after
it, yes.

**What the checks do not cover, said out loud.** That the exclude set survives
the button's move is held by construction, not by a check. Pointed at a build
with `alsoExclude` dropped, the browser check still passed: a surds variation
can make far more than two questions and the engine picked a different one by
chance. Repeats only become likely on a shallow variation — the measurement
behind the exclude set was six identical draws from a six-deep pool — and no
question reachable from that check is reliably that shallow.

---

## The doors into a paper, and what each gave

Fixed 2026-09-16. One paper row on `/course/n5` offers five ways into the same
questions, and the hint ladder was in **two** of them:

| door | hints |
|---|---|
| the heading — `/course/n5/papers/2026/paper-1`, 18px, the largest text in the row | was ❌, now ✅ |
| *Start Paper* — full-screen overlay | ✅ |
| *Focus Mode* — focus overlay | ✅ |
| *Browse Questions* — expands in place | ❌ |
| *New Paper Like This* — a printable clone | ❌ by design, help is via *open as a worksheet* |

The pattern was not random: **the ladder existed only in the two full-screen
overlays, and an overlay has no URL.** Every address a pupil could bookmark, be
sent by a teacher, or land on from a search had the version with no help — and
those 22 pages are in `sitemap.xml` precisely so people land on them, which
matters most in exam season.

**Reversing a recorded decision, deliberately.** The paper page carried a
comment saying a control there *"would make every one of them a client
surface"*. That was right when written. The reversal keeps its caution:
`Papers/QuestionHelp` loads both controls through `next/dynamic`, so the
measured cost is **+4 KB** rather than the **+14 KB** of importing them
directly — on the one template that still had its whole 10 KB of headroom. The
other half of the concern, the archive drifting towards the engine, is held by
`check-engine-isolation.mjs` at **0 of 542**.

---

## Where a hint cannot exist, the page says so

Added 2026-09-16. A National 5 practice topic mixes past paper questions with
questions written for the site, and **205 of the 458 are the second kind**.
Only the first can carry a ladder: presses 1 and 2 come from the variation
modelled on that exam question, and press 3 carries the working out of its
marking instructions. A written question has no marking instructions, so there
is nothing to build a ladder from — and the full written solution stays on
maths.scot by agreement, so it cannot be lifted either.

Unexplained, that reads as a broken button rather than a property of the
question. Those questions now carry one line saying where their help is
instead. All 205 were checked to carry a written solution, so the sentence is
true of every question it appears under.

**Rounding is the extreme case**: 22 questions, none with a ladder, because the
exam never sets rounding on its own and its three variations are warm-up tier.
It is also the one topic `check:topicmaps` records as unable to generate.

`check:practicegen` holds the invariant — **hints + notes = questions** on a
National 5 practice page, and neither on the other four courses, where no
question has a ladder and the absence is the norm.

**This is a signpost, not a fix.** The 205 still have no hints. What would close
that is mapping each one to the variation it matches — which buys presses 1 and
2 from `skill` and `method` strings that are already written, with no new prose
— and it is 205 judgements nobody has made yet.

---

## What is still open

- **`dev` is 71 commits ahead of `master` and none of it is live.**
  `git rev-list --count master..dev` says how far.
- **The responsive baseline read-back is the gate**, and it has never been done.
  Every layout change here was verified in headless Chrome at fixed widths,
  which is not a device. See [responsive.md](responsive.md) — about 90 minutes,
  immediately before any merge.
- **CLS is 0.84 on a practice page**, where 0.1 is good. Cause: 443 question
  images declare no dimensions, so nothing reserves their space. Not scheduled.
- **Lessons for the next course** are written up in
  `worksheet_generator/docs/new-course.md`.
- The findings in [navigation.md](navigation.md), recorded and not acted on.
- The responsive baseline has still never been read back — see
  [responsive.md](responsive.md). That is the ~90 minutes to spend immediately
  before a merge.
- Print is verified as *what the page hands the printer*. Nobody has driven iOS.
- ~~The hint ladder runs downhill on a past paper question.~~ **Fixed
  2026-09-15** — see *The hint ladder* below.
- ~~Verbatim marking-instruction text is committed and served.~~ **Not an open
  item — the marking instructions are used with permission.** Recorded here
  because it was written up as a problem on 2026-09-15 and is not one:
  `paper-markscheme.ts` (~189 KB, every illustrative and note) and
  `paper-steps.ts` (~42 KB) ship deliberately, and the scheme's working reaching
  a pupil through the hint ladder is a design decision rather than a risk.
  `reference/` stays gitignored for its size — 25 MB of transcriptions and
  PDFs — not for its licence.
