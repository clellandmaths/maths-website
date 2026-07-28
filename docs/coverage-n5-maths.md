# National 5 Maths — reference coverage map

Systematic check that our course notes (`src/notes/data/national5MathsData.tsx`)
cover everything taught in the SCHOLAR study guides in `reference/n5/`
(`n5_mth1`–`n5_mth5`), cross-checked against the guided-practice question sets
(`numeracy.js`, `algebra.js`, `geometry.js`, `trigonometry.js`, `statistics.js`).

**Method.** Every numbered sub-section was listed from the reference files
themselves, then checked against our notes by reading the matching topic.
Keyword counts were treated as a hint only — several "hits" turned out to be
false positives (e.g. "stem" matching "systematic").

**Legend** — ✅ covered · ⚠️ partial · ❌ missing · ➖ N4 recap, not separately assessed

_Last run: N5 Maths notes at 35 topics._

---

## File 1 — Numerical Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1 | Simplifying surds | Surds ex1 | ✅ |
| 1.2 | Collecting like surds | Surds ex3, ex5 | ✅ |
| 1.3 | Rationalising denominators | Surds ex2, ex-rationalise2 | ✅ |
| 1.4 | Multiplication/division, positive indices | Indices ex1–ex2 | ✅ |
| 1.5 | Raising a power to a power | Indices ex3 | ✅ |
| 1.6 | Negative and zero indices | Indices ex4 | ✅ |
| 1.7 | Fractional indices | Indices ex5, ex-form | ✅ |
| 2.1 | Rounding and scientific notation | Rounding; Scientific notation | ✅ |
| 2.2 | Rounding to significant figures | Rounding ex1, ex3, ex-count | ✅ |
| 3.1 | Fractions and percentages | Fractions; Percentages | ✅ |
| 3.2 | Calculating compound interest | Percentages ex2 | ✅ |
| 3.3 | Appreciation and depreciation | Percentages ex1, ex3 | ✅ |
| 3.4 | Undoing percentages (reverse) | Percentages ex4 | ✅ |
| 3.5 | Improper fractions and mixed numbers | Fractions ex1–ex3 | ✅ |
| 3.6 | Adding and subtracting fractions | Fractions ex1–ex2 | ✅ |
| 3.7 | Multiplying and dividing fractions | Fractions ex3–ex4 | ✅ |

## File 2 — Algebraic Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.2 | Expand single brackets | Expanding ex1 | ✅ |
| 1.3 | Expand double brackets | Expanding ex2–ex4 | ✅ |
| 2.2 | Factorising a common factor | Factorising ex1 | ✅ |
| 2.3 | Difference of two squares | Factorising ex2 | ✅ |
| 2.4 | Factorising a trinomial | Factorising ex3–ex4, ex-negative | ✅ |
| 3.1 | Simplifying algebraic fractions | Algebraic fractions ex1–ex2, ex7 | ✅ |
| 3.2 | Four operations on algebraic fractions | Algebraic fractions ex3–ex6 | ✅ |
| 4.1 | Determining the gradient | Straight line ex1; Gradient | ✅ |
| 4.1.1 | Horizontal and vertical gradients | Straight line §Special Lines | ✅ |
| 4.1.2 | Parallel lines | Gradient ex2–ex3 | ✅ |
| 4.2 | Determining the equation of a line | Straight line ex2–ex3 | ✅ |
| 4.3 | Gradient/intercept from general form | Straight line §General Form, ex4–ex5 | ✅ |
| 4.4 | Finding equations of parallel lines | Gradient ex2 | ✅ |
| 5.2 | Solving linear equations | Equations ex1–ex5 | ✅ |
| 5.3 | Solving linear inequations | Inequalities ex1–ex4 | ✅ |
| 6.2 | Drawing straight lines from equations | Simultaneous ex-graph (via intercepts) | ⚠️ used for graphing, not taught as its own skill |
| 6.3 | Simultaneous equations graphically | Simultaneous ex-graph | ✅ |
| 6.4.1 | Simultaneous by elimination | Simultaneous ex-elim, ex-scale | ✅ |
| **6.4.2** | **Simultaneous by substitution** | — | **❌ missing** |
| 6.5 | Simultaneous from a context | Simultaneous ex1 | ✅ |
| 7.1 | Completing the square | Completing the square ex1–ex3 | ✅ |
| 8.2 | Changing the subject of a formula | Change of subject ex1–ex5 | ✅ |
| 9.1 | Features of a quadratic function | Quadratic Graphs ex1–ex2 | ✅ |
| 9.2 | Equations of quadratics from graphs | Quadratic Graphs ex3–ex5 | ✅ |
| **9.3** | **Sketching quadratic functions** | features covered, no sketch method | **⚠️ partial** |
| 9.4 | Using function notation | Functions ex1–ex3 + | ✅ |
| 10.2 | Solving quadratics by factorising | Solving Quadratics ex1–ex3 | ✅ |
| 10.3 | The quadratic formula | Solving Quadratics ex4 | ✅ |
| 10.4 | Nature of roots / discriminant | Solving Quadratics ex5 | ✅ |
| 10.4.2 | Rational and irrational roots | discriminant covered; the rational/irrational split not named | ⚠️ partial |

## File 3 — Geometric Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1 | Circle: radius, diameter, circumference, area | Arcs & sectors (uses both) | ✅ |
| 1.2 | Calculating the length of an arc | Arcs & sectors ex-arclength | ✅ |
| 1.3 | Radius/diameter/angle from arc length | Arcs & sectors ex2 | ✅ |
| 1.4 | Calculating the area of a sector | Arcs & sectors ex1 | ✅ |
| 1.5 | Radius/diameter/angle from sector area | Arcs & sectors ex2 (same method) | ⚠️ shown for arc length, not for area |
| 2.1.1 | Areas of composite shapes | — (Volume covers composite solids) | ⚠️ composite **area** not covered |
| 2.2 | Volume of standard solids | Volume ex1 | ✅ |
| 2.3 | Unknown dimension given the volume | Volume ex3 | ✅ |
| 2.4 | Volumes of composite solids | Volume ex2 | ✅ |
| 3.1 | Pythagoras | Pythagoras ex1–ex2 | ✅ |
| 3.3 | Pythagoras in 3D shapes | Pythagoras ex1 (space diagonal) | ✅ |
| **3.4** | **Distance between two coordinates** | — | **❌ missing** |
| 4.1 | Determining an angle in a polygon | Angles in shapes ex1 | ✅ |
| 4.2 | Angle properties in circles | Angles in shapes ex2–ex3 | ✅ |
| 5.1 | Length scale factors / similar triangles | Similarity ex-length | ✅ |
| 5.2 | Area scale factors | Similarity ex1 | ✅ |
| 5.3 | Volume scale factors | Similarity ex2 | ✅ |
| 6.2 | Introduction to vectors in 2D | Vectors §Component Form | ✅ |
| 6.3 | Vector journeys | Vectors ex-pathway | ✅ |
| 6.4 | Coordinates in 3D | 3D coordinates ex1–ex2 | ✅ |
| 6.5 | Using vector components | Vectors ex1 | ✅ |
| 6.6 | Magnitude of vectors | Vectors ex2, ex-magsurd | ✅ |

## File 4 — Trigonometric Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1 | SOH-CAH-TOA | — (assumed from N4) | ➖ |
| 1.2 | Sketching trigonometric graphs | Trig Graphs ex1–ex2 | ✅ |
| 1.3 | Identifying trig functions from graphs | Trig Graphs ex2–ex4 | ✅ |
| 1.4 | Solving trigonometric equations | Trig Equations ex1–ex3 | ✅ |
| **1.5** | **Exact trigonometric values** | used once in passing; no table, no method | **❌ missing** |
| 1.6 | Using trigonometric identities | Trig Identities ex1–ex5 | ✅ |
| 2.1 | Area of a triangle | Area of a Triangle ex1–ex4 | ✅ |
| 2.2 | Using the Sine rule | Sine Rule ex1–ex4 | ✅ |
| 2.3 | Using the Cosine rule | Cosine Rule ex1–ex3 | ✅ |
| **2.4** | **Selecting the rule** (which of the three to use) | — | **❌ missing** |
| 2.5 | Using bearings | Bearings ex1–ex4 | ✅ |

## File 5 — Statistical Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| **1.1.1** | **Stem and leaf diagrams** | — | **❌ missing** |
| 1.1.2 | Scattergraphs | Line of Best Fit | ✅ |
| 1.2 | Scattergraphs and line of best fit | Line of Best Fit ex1–ex4 | ✅ |
| **1.3** | **Five-figure summaries and boxplots** | quartiles/IQR covered; no five-figure summary, no boxplot | **❌ missing** |
| 1.4 | Mean and standard deviation | Comparing Data Sets ex1 | ✅ |
| 1.5 | Comparing data sets | Comparing Data Sets ex2, ex4 | ✅ |
| — | Mode | not covered (mean, median, range are) | ⚠️ minor |

---

## Summary — gaps found

**❌ Missing (6):**

1. **Five-figure summaries and boxplots** (File 5 §1.3) — quartiles and IQR are
   taught, but not the five-figure summary or how to draw/read a boxplot.
2. **Stem-and-leaf diagrams** (File 5 §1.1.1) — absent. (Earlier keyword checks
   showed "stem" hits, but those were "systematic" / "solve the system".)
3. **Exact trigonometric values** (File 4 §1.5) — the exact-value table for
   0°/30°/45°/60°/90° is never given; it is used once in passing in a solution.
4. **Selecting the rule** (File 4 §2.4) — no guidance on choosing between the
   area formula, sine rule and cosine rule from the information given.
5. **Distance between two coordinates** (File 3 §3.4) — the distance formula
   derived from Pythagoras.
6. **Simultaneous equations by substitution** (File 2 §6.4.2) — only the
   elimination method is taught.

**⚠️ Partial (5):** sketching a quadratic (features taught, no sketch method);
rational vs irrational roots not named; finding radius/angle from *sector area*
(shown only for arc length); composite **areas**; mode.

These are outstanding — this table records the state as found, before fixes.
