# Higher Maths — full notes audit

Audit of `src/notes/data/higherMathsData.tsx` (**101 topics** across 10 sections)
against every dimension we have established while doing the other four courses.
This is the *findings* document; content coverage against reference material is
separate, in [`coverage-higher-maths.md`](./coverage-higher-maths.md).

## Headline numbers

| Dimension | Higher Maths | Other courses for comparison |
|---|---|---|
| Topics | 101 | AH 59 · N5 35 · N5 Apps 28 |
| Worked examples ≥2 | **69 (68%)** | AH 100% · N5 100% · N5 Apps 100% |
| Common Examiner Traps box | **0 (0%)** | AH 100% · N5 100% · N5 Apps 100% |
| Golden Rule | **2 (2%)** — both added during this audit | present throughout the other three |
| Diagrams | 26 (26%) | AH 1 · N5 0 · N5 Apps 0 |
| Real video links | 63 | AH 0 · N5 0 · N5 Apps 0 |

Higher Maths is the mirror image of the other courses: it is the **only** one with
videos and diagrams, and the **only** one without traps boxes and Golden Rules.

## What the maths itself looks like

Good. Higher Maths was written from your own full course notes and it shows —
I recomputed a sample independently and found no errors:

- **General Equation of a Circle** — both directions of the completing-the-square
  derivation, centre (−2, 4), r = √13, and the g²+f²−c = −9 < 0 non-circle case.
- **Area Between Curves** — limits x = −1, 3 from solving the intersection;
  ∫(−2x²+4x+6) = 18 − (−10/3) = 64/3; and the symmetric case giving 36.
- **Wave Function** — k = √(25+144) = 13, tan α = 12/5, α ≈ 67.4°, first quadrant
  from both components positive.

No answer errors found in the sample. The gaps below are about *presentation and
completeness*, not correctness.

---

## Fixed during this audit

| Finding | Detail |
|---|---|
| **Notation drift** | Higher Maths had drifted from the house style National 5 and Advanced Higher both follow — mixing `\sin(x)` with `\sin x`, and `\sin(x^\circ)` with `\sin x^\circ`, **within ten topics at once**. 130 expressions normalised to the bare form, degree on the variable or outside a compound bracket, as QS writes it. Compound arguments and inverse functions keep brackets. |
| **Quadratic formula absent** | The Discriminant topic defined `b²−4ac` but never showed the quadratic formula it comes from, and gave the three nature-of-roots cases only inside example solutions — never as a stated rule. Added, plus the perfect-square → rational roots split. |
| **Wave Function theory** | One sentence and zero maths, for one of the hardest topics in the course. Added the four target forms, equate-coefficients method, k by squaring and adding, α by dividing, and the quadrant rule. |
| **Plain-text maths** | The four quadratic inequality forms were HTML entities in a mono box — the same defect class as the N5 surds box. Now KaTeX. |
| **`reference/` not gitignored** | 3.2 MB of Heriot-Watt SCHOLAR guides and third-party textbooks were one `git add -A` from a public repo. Also ignored an unrelated AI Studio scaffold and a stray `nul` artefact. |

---

## Outstanding — your ruling needed

### 1. Traps boxes: 0 of 101 topics

The other three courses are at 100%. **Scope: this is the single largest job on
the list** — 2–4 specific, exam-accurate traps per topic, and generic filler
would be worse than nothing. Recommend working section by section in traffic
order, committing per section, so it can stop cleanly at any point.

### 2. Thirty-two topics below the house minimum of two examples

Twelve have **none at all**. Excluding the deliberate section intros, the ones
that look like genuine shortfalls:

| Examples | Topic |
|---|---|
| 0 | Introduction, Domain & Range · Introduction to Polynomials · Exact Values · Revision of N5 Vectors |
| 1 | Distance Between Points · Perpendicular Bisectors · Altitudes · Medians · Points of Intersection · Solving Recurrence Relations · Problems in Context · Graphs of Inverse Functions · Evaluation · Finding Roots · Intersection of Two Graphs · Equation of a Circle · Testing a Point · Equations of Tangents to Circles · Introduction & First Principles · Maximum and Minimum Values · Area Under the x-axis · Trigonometric Identities · Solving Simultaneous Equations · Multiple Angles · Minimum and Maximum Values · Sketching Graphs · Revision of Position Vectors · Dividing Lines in a Given Ratio · Unit Vectors · Scalar/Dot Product (2) |

**Exact Values with zero examples** stands out — it is a guaranteed exam skill.

### 3. Four topics whose theory does not teach the skill

Theory under 200 characters with no maths at all:

- **Working with Logarithmic Functions** — "combine the terms in one step" and
  nothing else. The three laws are stated in the sibling topic immediately
  before it, so this is not a correctness gap, but the topic's actual skill —
  clear coefficients with the power law *before* combining — is never stated.
- **Preparing to Differentiate 3 – Indices and Fractions** — method described in
  words, never demonstrated.
- **Multiple Angles** (trigonometry) — 177 characters, no maths.
- **Maximum and Minimum Values** — 148 characters, no maths, and only one example
  for a closed-interval skill that appears most years.

I stopped before editing these so you can rule on them together.

### 4. Twenty-nine broken placeholder video URLs

`https://www.youtube.com/embed/placeholder` in 29 topics. **Not user-visible** —
`TopicView` guards with `!videoUrl.includes('placeholder')`, so they correctly
show "Video coming soon". Worth clearing to `""` when the real video mapping
happens, so the guard stops being load-bearing.

### 5. Two coverage candidates still awaiting your list

From [`coverage-higher-maths.md`](./coverage-higher-maths.md): the equation of a
straight line (`y = mx + c`, general form, extracting a gradient from an
equation) and sketching `y = a sin(bx + c) + d`. Plus three minor terminology
partials: zero vector, concentric/congruent circles, one-to-one condition.

---

## Recommended order

1. **Exact Values examples** — zero examples on a guaranteed exam skill is the
   sharpest single defect here.
2. **The two coverage candidates**, once you rule.
3. **The four thin-theory topics** — small, bounded, high value per edit.
4. **Examples up to two** for the 26 one-example topics.
5. **Traps boxes** — the big grind, section by section.

## Method note

Every finding was checked by reading the topic, not by keyword counts. Two of my
own greps produced false results during this audit and were caught before they
became findings: `\tan(\theta)` (so `m = tan θ` looked missing when it is taught
with three examples), and a normalisation pattern that would have left
`\sin^2(x^\circ)` mixed with `\sin x^\circ` inside the same expression.
