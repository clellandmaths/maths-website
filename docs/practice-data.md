# Practice data

How the guided practice question sets work, and what to watch for when adding to
them.

These files are the **source of record** for guided practice. The live app
(`Current Deployment`) is built from them — see `GUIDED_PRACTICE.md` there. Author
here first, then bring across.

---

## What is here

`src/practice/data/`, one file per course:

| file | questions | authored | `ref:` | topics | `videoId` | `solutionUrl` |
|---|---|---|---|---|---|---|
| `national5Maths.ts` | 458 | 232 | 226 | 34 | 229 | 458 |
| `higherMaths.ts` | 216 | 117 | 99 | 10 | 52 | 216 |
| `advancedHigherMaths.ts` | 211 | 127 | 84 | 14 | 43 | 205 |
| `national5Apps.ts` | 281 | 159 | 122 | 28 | 0 | 0 |
| `higherApps.ts` | 357 | 306 | 51 | 51 | 0 | 0 |
| | **1,523** | | | **137** | | |

The three maths courses mirror the corresponding maths.scot topic pages
example-for-example. The two Applications courses are written in-house, so they
carry no maths.scot links and are not yet filmed.

---

## Two question shapes

**Authored** — the question is written out:

```ts
{
  question: `Evaluate \\(5 \\frac{1}{4}-2\\frac{1}{3}.\\)`,
  answer: `\\(2 \\frac{11}{12}\\)`,
  videoId: "abc123",
  timestamp: "3m35s",
  solutionUrl: "https://www.maths.scot/nat5/fractions#2",
}
```

**Referenced** — the question is a past paper question, so it is pointed at
rather than copied:

```ts
{ ref: "2014 P1 Q1", solutionUrl: "https://www.maths.scot/nat5/fractions#8" }
```

`lib/practice-loader.ts` resolves the ref against the past-paper index at load
and the referenced copy brings its own text, marks, diagram and video. A ref may
override `videoId`/`timestamp` where the guided-practice video is the more useful
one.

**Prefer `ref:` for anything that is a past paper question.** It cannot drift out
of sync with the paper, and it inherits corrections automatically.

---

## Watch for these

### 1. An unresolved `ref:` disappears silently

`practice-loader.ts` drops a reference it cannot resolve rather than rendering an
empty question, with a `console.warn`. In a production build nobody sees that
warning — the question is simply **not there**, and the topic quietly gets
shorter. Check the count after adding refs.

Label format has to match the paper registry exactly: `2023 P2 Q14`, `2017 Q1`
where the course has no paper split, `2016 Specimen Q11`. A bare `Specimen Q11`
will not resolve.

### 2. A bare timestamp is seconds, not minutes

`lib/timestamp.mjs` is the one parser. It accepts:

```
"48s" 48    "3m35s" 215    "5m" 300    "1h2m3s" 3723
"3:35" 215  "1:02:03" 3723 "215" 215   12 12
```

Twenty-five Higher timestamps were minutes written as bare numbers — `17` meaning
17m47s — which opened the video 17 seconds in. **They parse cleanly**, so nothing
flagged them for months. If you mean minutes, write `17m47s`.

`npm run check:timestamps` now fails when a video's *second or later* use starts
at 0, which is the signature of this fault. A video's first use legitimately may
start at 0.

YouTube's `start=`/`t=` take **integer seconds only** — never a `3m35s` string.

### 3. Every maths.scot question needs its `solutionUrl`

This is a permission condition, not a nicety. See
[guided-practice-attribution.md](guided-practice-attribution.md): the owner of
maths.scot allows his questions here **on the condition that each answer links to
the written solution on his site**. We show the final answer and our video; the
working stays with him.

Link to the **specific worked example** — `#8`, not the page top. Six links
pointed at the wrong example and seven at a single wrong anchor before the
mirroring pass. `scripts/scot-page-examples.mjs` lists a page's examples with
their canonical deep links.

### 4. This is KaTeX; the app is MathJax

The same string does not always render in both. When authoring here, remember it
has to survive the trip:

- **`\pounds` works here and not in the app** — KaTeX implements it, MathJax does
  not. Write `£` directly. 418 occurrences had to be fixed after the port.
- `$` is a math delimiter in the app but not here.
- In `.ts` source, delimiters are `\\(` … `\\)`.

### 5. Never edit these files through a shell heredoc

Heredocs halve backslashes, turning `\\(` into `\(`. In the app that renders as
literal bracket characters — it has already shipped once. Use an editor or a
script file.

---

## Mirroring a maths.scot topic

The method that works, and the only one to use:

1. Read his page.
2. Read our topic in the data file.
3. Make them match, example for example, by hand.

Do not try to automate the matching. His question text is a matching key only and
is not stored or published. Every one of the 34 N5, 10 Higher and 14 AH topics
has been through this. Rounding is the single N5 topic not yet checked.

The August 2026 pass added 30 questions, fixed 101 solution links, corrected 6
pointing at the wrong worked example and added 1 missing diagram.

---

## Build checks

```bash
npm run check    # all of them, without building
npm run build    # runs the checks, then next build
```

`build` runs `check:math`, `check:homepage`, `check:papers`, `check:timestamps`,
`check:qnumbers`, `check:sharerefs`, `check:latexdelims`, `check:qbreaks`, then
`postbuild` adds `check-headers-redirects` and `check-rendered-math` — the last
of which renders every page and asserts every expression came out (494 pages at
the time of writing).

These catch a great deal, but **not** whether a `solutionUrl` points at the right
worked example, and not whether a timestamp means what its author intended. Those
need a person.

---

## Adding a question

1. Past paper question → `ref:`. Otherwise write it out.
2. Add the `solutionUrl` if it came from maths.scot.
3. Timestamps: `3m35s`, not `3`.
4. `npm run check`.
5. Open the page and look at it — check the maths, and click the video through to
   the right moment.
6. Bring it across to the app if the topic there is already filmed.
