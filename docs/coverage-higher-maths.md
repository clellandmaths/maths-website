# Higher Maths — reference coverage map

Systematic check that our course notes (`src/notes/data/higherMathsData.tsx`,
**101 topics**) cover everything taught in the SCHOLAR study guides in
`reference/Higher/` (`hg_cmth1`–`hg_cmth5`).

**Method.** Every numbered sub-section was listed from the reference files
themselves — including the per-topic contents tables, because file 1's headings
are OCR-damaged and `grep` on headings alone misses roughly a third of them.
Each was then checked against our notes **by reading the matching topic**.
Keyword counts were treated as a hint only.

> **⚠️ Read this before acting on the table.** The SCHOLAR guides are teaching
> material, not the course specification. They contain "Looking back at National
> 5" recap sections and some extension work. When the N5 table was reviewed, four
> of six reported "gaps" turned out not to be course requirements. So anything
> marked **candidate** below is *a question for you*, not a confirmed gap.
>
> To reduce that noise this time, every candidate is cross-checked against
> **file 5's "Learning points"** — the guides' own "by the end of this topic you
> should be able to…" lists, which are much closer to the assessed standard than
> a chapter merely existing.

**Legend** — ✅ covered · ⚠️ partial · ❓ candidate (needs your ruling) · ➖ N5 recap

---

## File 1 — Algebraic & Trigonometric Skills

### Topic 1: Polynomials and quadratics

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1.1–1.1.2 | Factorising: difference of two squares, trinomials | — | ➖ N5 recap |
| 1.1.3 | Completing the square | Completing the Square | ✅ |
| 1.1.4 | Features of quadratics | Completing the Square (turning point, axis of symmetry) | ✅ |
| 1.1.5 | Determining equations of quadratics | Determining the Equation of a Graph | ✅ |
| 1.1.6 | Sketching quadratic functions | Completing the Square; Determining the Equation of a Graph | ✅ |
| 1.1.7 | Quadratic equations: solving graphically | — | ➖ N5 recap |
| 1.1.8–1.1.9 | Solving by factorising / quadratic formula | — | ➖ N5 recap |
| 1.1.10 | Nature of the roots using the discriminant | Discriminant | ✅ |
| 1.2.1 | Synthetic division | Evaluation | ✅ |
| 1.2.2 | Division by (x − a) | Evaluation | ✅ |
| 1.2.3 | Factor theorem | Factorising | ✅ |
| 1.2.4 | Factorising polynomials | Factorising | ✅ |
| 1.3.1 | Finding coefficients of polynomials | Finding Unknown Coefficients | ✅ |
| 1.3.2 | Solving polynomials | Finding Roots | ✅ |
| 1.4 | Determining functions from graphs | Determining the Equation of a Graph | ✅ |
| 1.5 | Completing the square | Completing the Square | ✅ |
| 1.6.1 | Solving quadratic equations | Finding Roots | ✅ |
| 1.6.2 | Solving quadratic inequations | Solving Quadratic Inequalities | ✅ |
| 1.7.1 | Nature of roots | Discriminant | ✅ |
| 1.7.2 | Points of intersection of lines and parabolas | Intersection of Lines and Parabolas | ✅ |
| 1.8 | Intersection of a line and a curve, or two curves | Intersection of Two Graphs | ✅ |
| — | Degree of a polynomial | Introduction to Polynomials | ✅ |

### Topic 2: Functions and graphs

| Ref | Skill | Our topic | |
|---|---|---|---|
| 2.1.1 | Identifying a quadratic from its graph (y = kx², y = ±(x−a)²+b) | Determining the Equation of a Graph | ✅ |
| 2.1.2 | Sketching a quadratic function | Completing the Square | ✅ |
| 2.1.3 | Using function notation | Introduction, Domain & Range | ✅ |
| 2.1.4–2.1.6 | Sketching y = a sin(bx°), + c, and (x + b°) + c | — | **❓ see candidate 2** |
| 2.2.1 | Sketching f(x) + a and f(x) − a | Graph Transformations | ✅ |
| 2.2.2 | Sketching f(x + a) and f(x − a) | Graph Transformations | ✅ |
| 2.2.3 | Sketching −f(x) and f(−x) | Graph Transformations | ✅ |
| 2.2.4 | Sketching k f(x) and f(kx) | Graph Transformations | ✅ |
| 2.2.5 | Identifying and sketching related functions | Graph Transformations (incl. y = 3f(2x) + 1) | ✅ |
| 2.3.1 | Exponential functions | Exponential Functions | ✅ |
| 2.3.2 | Logarithmic functions | Logarithmic Functions; Logarithmic Graphs | ✅ |
| 2.4 | Functions, domains and ranges | Introduction, Domain & Range | ✅ |
| 2.5 | Determining composite functions | Composite Functions | ✅ |
| 2.6 | Determining inverse functions | Inverse Functions; Graphs of Inverse Functions | ✅ |
| — | An inverse exists only for a one-to-one function (or restricted domain) | not stated | ⚠️ minor |

### Topic 3: Logs and exponentials

| Ref | Skill | Our topic | |
|---|---|---|---|
| 3.1.1 | Growth and decay functions | Exponential Growth & Decay | ✅ |
| 3.1.2 | The exponential function (e) | Exponentials & Logarithms to the Base e | ✅ |
| 3.1.3 | Logarithmic functions | Properties of Logarithmic Functions | ✅ |
| 3.2 | Laws of logarithms | Working with Logarithmic Functions | ✅ |
| 3.3 | Problem solving | Further Logarithmic Equations; Solving Equations with Unknown Exponents | ✅ |
| 3.4 | Formulae from experimental data | Experimental Data & Linear Models | ✅ |

### Topic 4: Trigonometry

| Ref | Skill | Our topic | |
|---|---|---|---|
| 4.1.1 | Solving trigonometric equations | Solving Basic Trigonometric Equations | ✅ |
| 4.1.2 | Exact trigonometric values | Exact Values; Exact Values of Related Angles | ✅ |
| 4.1.3 | Using trigonometric identities | Trigonometric Identities | ✅ |
| 4.2.1 | Angles in degrees and radians | Radian Measure | ✅ |
| **4.2.2** | **Graphs of trigonometric functions** (period, amplitude) | — | **❓ candidate 2** |
| **4.2.3** | **More complex trigonometric graphs** a cos(bx + c) − d | — | **❓ candidate 2** |
| 4.3 | Solving trigonometric equations | Multiple Angles; Square Terms; Quadratic Trig Equations | ✅ |
| 4.4 | The addition formula | Compound Angles; Using Trigonometric Ratios | ✅ |
| 4.5 | The double angle formula | Double Angle Formulae | ✅ |
| 4.6 | Trigonometric identities | Trigonometric Identities | ✅ |
| 4.7 | The wave function | Wave Function; Multiple Angles; Sketching Graphs | ✅ |
| 4.8 | Max and min values of the wave function | Minimum and Maximum Values | ✅ |

## File 2 — Geometric Skills (Vectors)

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1.1 | Vector journeys | Revision of N5 Vectors | ✅ |
| 1.1.2 | Add, subtract & multiply vectors in 2D and 3D | Revision of N5 Vectors | ✅ |
| 1.1.3 | Magnitude of a vector | Revision of N5 Vectors | ✅ |
| 1.2.1 | Position vectors | Revision of Position Vectors | ✅ |
| 1.2.2 | Unit vectors | Unit Vectors; Unit Vector Form | ✅ |
| 1.2.3 | Zero vectors | not named | ⚠️ minor |
| 1.3.1 | Parallel vectors | Collinearity (via scalar multiples) | ✅ |
| 1.3.2 | Collinearity | Collinearity | ✅ |
| 1.4 | Division of vectors in a given ratio | Dividing Lines in a Given Ratio | ✅ |
| 1.5.1 | Scalar product: component form | Scalar/Dot Product (1) | ✅ |
| 1.5.2 | Scalar product: geometric form | Scalar/Dot Product (2); Angle Between Vectors | ✅ |
| 1.5.3 | Perpendicular vectors | Perpendicular Vectors | ✅ |
| — | Properties of the scalar product | Properties of the Scalar Product | ✅ |

## File 3 — Calculus Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1.1–1.1.4 | Indices recap | — | ➖ N5 recap |
| 1.2.1 | The derived function | Introduction & First Principles | ✅ |
| 1.2.2 | Rules for differentiation | Differentiating Terms | ✅ |
| 1.2.3 | Differentiating products and quotients (simplify first) | Preparing to Differentiate 1–3 | ✅ |
| 1.3 | Calculating the value of the derivative | Differentiating Terms | ✅ |
| 1.4 | Equation of a tangent to a curve | Equations of Tangents | ✅ |
| 1.5 | Determining stationary points (nature table) | Stationary Points & Curve Sketching | ✅ |
| 1.6.1 | Curve sketching | Stationary Points & Curve Sketching | ✅ |
| 1.6.2 | Increasing and decreasing functions | Increasing and Decreasing Curves | ✅ |
| 1.6.3 | The graph of the derivative | Graphs of Derived Functions | ✅ |
| 1.7 | Closed intervals | Maximum and Minimum Values | ✅ |
| 1.8.1 | Rate of change (velocity, acceleration) | Rates of Change | ✅ |
| 1.8.2 | Optimisation | Optimisation | ✅ |
| 1.9.1 | Differentiating sin x and cos x | Differentiating sin x and cos x | ✅ |
| 1.9.2–1.9.3 | Differentiating (x + a)ⁿ and (ax + b)ⁿ | Further Differentiation of Brackets | ✅ |
| 1.9.4 | The chain rule | Further Differentiation of Brackets; …of Trig Functions | ✅ |
| 2.1 | Integrating algebraic expressions | Indefinite Integrals | ✅ |
| 2.2 | Integrating expressions with multiple terms | Indefinite Integrals | ✅ |
| 2.3 | Integrating products and quotients | Indefinite Integrals ex10 (expand), ex11 (split fraction) | ✅ |
| 2.4.1 | Integration of sin and cos | Further Integration of Trigonometric Functions | ✅ |
| 2.4.2 | Integrating composite functions | Further Integration of Brackets | ✅ |
| 2.5 | Solving differential equations | Differential Equations | ✅ |
| 2.6 | Calculating definite integrals | Definite Integrals | ✅ |
| 2.7 | Finding the area under a curve | Area Under a Curve; Area Under the x-axis | ✅ |
| 2.8 | Finding the area between two curves | Area Between Curves | ✅ |

## File 4 — Algebraic & Geometric Skills

| Ref | Skill | Our topic | |
|---|---|---|---|
| 1.1.1 | The gradient | Gradient | ✅ |
| **1.1.2** | **The equation of a straight line + General Form** | — | **❓ candidate 1** |
| **1.1.3** | **Identifying gradient and y-intercept from a linear equation** | — | **❓ candidate 1** |
| 1.1.4 | Distance between two points | Distance Between Points | ✅ |
| 1.1.5 | Coordinates of the midpoint | Midpoints | ✅ |
| 1.2 | Parallel lines | Parallel & Perpendicular Gradients | ✅ |
| 1.3 | Collinearity | Collinearity | ✅ |
| 1.4 | The gradient and tan θ | Gradient (3 examples, incl. angle with the y-axis) | ✅ |
| 1.5 | Perpendicular lines | Parallel & Perpendicular Gradients | ✅ |
| 1.6 | Properties of medians (centroid) | Medians | ✅ |
| 1.7 | Properties of altitudes (orthocentre) | Altitudes | ✅ |
| 1.8 | Properties of perpendicular bisectors (circumcentre) | Perpendicular Bisectors | ✅ |
| 2.1.1 | Angles and angle properties in circles | Introduction | ✅ |
| 2.2.1 | Circle with centre the origin | Equation of a Circle | ✅ |
| 2.2.2 | Circle with centre (a, b) | Equation of a Circle | ✅ |
| 2.3 | The general equation of a circle | General Equation of a Circle | ✅ |
| 2.4 | Relationships between a line and a circle | Intersections of Lines and Circles; Tangents | ✅ |
| 2.5 | Relationships between circles | Intersection of Circles | ✅ |
| — | Concentric / congruent circles (terminology) | not named | ⚠️ minor |
| 3.1.1–3.1.3 | Simultaneous equations recap | Points of Intersection | ➖ N5 recap |
| 3.2 | Simple recurrence relations | Linear Recurrence Relations | ✅ |
| 3.3 | Finding a limit | Limit of a Sequence | ✅ |
| 3.4 | Solving recurrence relations | Solving Recurrence Relations; Problems in Context | ✅ |

## File 5 — Assessment Practice

No new content — "Learning points" summaries and practice questions. Used above
as the cross-check on whether a candidate is genuinely an assessed skill.

---

## Candidates — your ruling needed

### ❓ Candidate 1 — The equation of a straight line

**What's missing.** `y = mx + c` does not appear anywhere in the Higher notes
file, and no topic teaches:

- writing the equation of a line from a gradient and a point;
- the general form `Ax + By + C = 0`;
- extracting the gradient or y-intercept *from* a given equation
  (e.g. "find the gradient of the line 3x + 2y = 12");
- the equations of horizontal and vertical lines (`y = c`, `x = k`).

We *use* `y − b = m(x − a)` in four places — perpendicular bisectors, altitudes,
medians and equations of tangents — but never teach it, so a pupil meets the
formula first as a step inside a harder problem.

**Why I think it's worth asking about.** File 4 places §1.1.2–1.1.3 under
"Looking back at National 5", which by the N5 lesson would make it recap. But
file 5's learning points for Algebraic & Geometric Skills list all five bullets
above explicitly as things a Higher candidate should be able to do, and
extracting a gradient from a general-form equation is the first step of a great
many Higher straight-line and circle questions.

**Note.** This is the same gap you caught me on for N5 Maths ("with straight line
we also have general equation of straight line to consider"). It was fixed there;
Higher was never re-checked.

**Your call:** teach it at Higher as its own topic, assume it from N5, or add a
short recap block inside the existing Gradient topic?

### ❓ Candidate 2 — Sketching trigonometric graphs

**What's missing.** No topic teaches sketching `y = a sin(bx + c) + d`. Across
all 101 topics, "amplitude" appears once and "period" once, both as passing
remarks. Specifically absent:

- period of a graph, and that the period of `y = tan x` is 180°;
- amplitude, and reading `a` and `b` from an equation;
- "b waves in 360°" for `y = sin bx`;
- factorising the bracket — `2 cos(5x − 60)° − 7` → `2 cos 5(x − 12)°` — to read
  off a period of 72° and a shift right of 12°;
- the vertical shift `− d` moving the max/min.

**What we do have:** *Wave Function → Sketching Graphs*, but only for the
wave-function form `k cos(x − α)` reached after converting `a sin x + b cos x`.
That is a different (and narrower) skill.

**Why I think it's worth asking about.** Reference §4.2.2 and §4.2.3 are Higher
content — they sit *outside* the "Looking back at National 5" section (§4.1) and
alongside radians. And file 5's trigonometry learning points state it directly:
*"To sketch trigonometric graphs of the form y = a sin(bx + c) + d or
y = a cos(bx + c) + d"*.

**Your call:** is this Higher, or N5 revision that Higher candidates are simply
assumed to carry forward?

### ⚠️ Minor partials (3)

| | Detail |
|---|---|
| Zero vector | Reference §1.2.3 names it; we never do. Terminology only. |
| Concentric / congruent circles | Relationships between circles are covered thoroughly; these two words are not used. |
| One-to-one functions | We teach finding inverses, but not the condition for an inverse to *exist* (one-to-one, or a restricted domain). |

---

## Grep failures recorded this pass

Continuing the log, because these keep costing accuracy:

| Search | Why it failed |
|---|---|
| `tan\theta` | Our notes write `\tan(\theta)` with brackets — the skill **is** covered, with three examples. I nearly filed it as a gap. |
| heading regex on file 1 | OCR damage means ~a third of file 1's headings aren't headings at all. The per-topic **contents tables** had to be read instead. |
| `y = mx + c` | Genuinely absent — but only confirmed by also searching for `mx+c` unspaced and reading the whole straight-line section. |

## Summary

- **~110 reference sub-sections checked** across five files and 101 topics.
- **No confirmed missing content** — but **2 candidates** raised for your ruling,
  both cross-checked against the guides' own learning-point lists.
- **3 minor partials**, all terminology rather than method.
- Several things I initially suspected were gaps turned out to be covered once I
  read the topic instead of grepping it: m = tan θ, integrating products and
  quotients, all eight graph transformations, turning points by completing the
  square, nature tables, and velocity/acceleration as rates of change.
