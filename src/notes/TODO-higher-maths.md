# TODO — Higher Maths Course Notes

Audit findings for `src/notes/data/higherMathsData.tsx`. This is the most
developed of the five courses — 101 topics, ~206 worked examples, clean LaTeX,
and the best diagram coverage by far. Remaining gaps are specific and
well-contained rather than course-wide. Items grouped by priority.

## 🔴 Isolated but significant gap — Exponentials & Logarithms section

- [ ] **All 7 topics in this section have empty `videoUrl` fields** (Properties of Logarithmic Functions, Working with Logarithmic Functions, Further Logarithmic Equations, Exponentials & Logarithms to the Base e, Solving Equations with Unknown Exponents, Exponential Growth & Decay, Experimental Data & Linear Models). This is the only section in the entire course with zero video coverage — every other section is populated. Add video links matching the pattern used elsewhere in this file.
- [ ] **Same section also has zero diagrams** — no shared illustration components and no inline SVGs anywhere in Exponentials & Logarithms, despite exponential growth/decay curves and logarithmic graphs being inherently visual content (and "Logarithmic Graphs" and "Exponential Functions" are literally topic titles elsewhere in the file). Add diagrams for at minimum:
  - [ ] Exponential growth vs. decay curve shapes
  - [ ] Logarithmic graph shape and its relationship to the exponential graph (reflection in y=x)
  - [ ] Experimental Data & Linear Models — a scatter plot with a linearised log-scale fit

## 🟠 Diagram gaps in two other sections

- [ ] **Vectors (11 topics) — zero diagrams.** No shared components, no inline SVGs. Given this section covers 3D vectors, position vectors, unit vectors, and angle between vectors, a diagram would help significantly for:
  - [ ] Revision of N5 Vectors / Revision of Position Vectors — a labelled 3D coordinate diagram
  - [ ] Angle Between Vectors — a diagram showing two vectors and the angle between them
  - [ ] Dividing Lines in a Given Ratio — a diagram showing the division point on a line segment
- [ ] **Recurrence Relations (5 topics) — zero diagrams.** A simple graph showing a sequence converging to a limit (for the "Limit of a Sequence" topic) would help make the convergence condition (−1 < a < 1) concrete.

(Note: two stray topics in Integration — "Further Integration of Brackets" and "Further Integration of Trigonometric Functions" — also have empty `videoUrl` fields; worth fixing alongside the Exponentials & Logarithms batch since they're a quick add.)

## 🟡 Topics with zero worked examples

Six topics currently have `examples: []`. Most are reasonable as short intro/revision recaps, but flagging all six for a decision on whether each needs an example added:

- [ ] **Trigonometry → "Exact Values"** — this is substantive new content (deriving exact trig ratios from the 30-60-90 and 45-45-90 triangles), not just a revision recap, and should have at least one worked example showing the derivation from a triangle.
- [ ] Recurrence Relations → "Introduction" — likely fine as a conceptual intro, but consider adding one simple example if it's the first thing students see in the topic.
- [ ] Functions and Graphs → "Introduction, Domain & Range" — currently just a reference table of domains/ranges; consider adding one worked example finding the domain/range of a given function.
- [ ] Polynomials → "Introduction to Polynomials" — likely fine as a definitional intro.
- [ ] Integration → "Introduction" — likely fine as a conceptual intro.
- [ ] Vectors → "Revision of N5 Vectors" — fine as a revision recap, provided the substantive new Higher content (later topics) has full examples (confirmed it does).

## What's working well (no action needed)

- ✅ Zero LaTeX syntax errors found across all 2,426 math expressions scanned — the cleanest of the five course files.
- ✅ Vector notation (`\begin{pmatrix}...\end{pmatrix}`) uses the correct `\\` row-separator syntax throughout — this is the reference-correct version that National 5 Maths should be matched to.
- ✅ Strong diagram usage overall: Straight Line, Functions and Graphs, Polynomials, Differentiation, Integration, and Trigonometry all have solid diagram coverage, and Circles has 15 well-built inline SVGs (circle geometry, tangency, intersections) even though it doesn't use the shared illustration library.
- ✅ Spot-checked worked examples (Wave Function derivations, both Optimisation examples) are all mathematically correct.

---
*Generated from audit of Higher Maths. All five courses have now been audited.*
