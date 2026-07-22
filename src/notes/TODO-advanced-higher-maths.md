# TODO — Advanced Higher Mathematics Course Notes

Audit findings for `src/notes/data/advancedHigherMathsData.tsx`. This course is
substantially less developed than the other four — treat as a content build-out,
not a polish pass. Items grouped by priority.

## 🔴 Critical — zero worked examples across the entire course

- [ ] **Every one of the 18 topics has `examples: []`.** Confirmed by direct count — no exceptions. This is the single biggest gap in the whole site. Add worked examples (aim for 2–3 per topic, matching the pattern used in the other four courses) for at minimum:
  - [ ] Binomial Theorem — expanding an expression, finding a specific term/coefficient
  - [ ] Partial Fractions — one worked decomposition for each case (distinct linear, repeated linear, irreducible quadratic), including a "reduce improper fraction first" example
  - [ ] Gaussian Elimination — a full 3×3 system solved by row reduction, plus one example each of an inconsistent and a redundant system
  - [ ] Matrix Algebra — matrix multiplication, a 2×2 and 3×3 determinant, a 2×2 inverse, worked with real numbers
  - [ ] Transformations of the Plane — applying a rotation/reflection/scaling matrix to a point, and combining two transformations
  - [ ] Arithmetic & Geometric Sequences/Series — nth term, sum to n terms, sum to infinity where applicable
  - [ ] Maclaurin Series — deriving a series for a given function by repeated differentiation
  - [ ] Recurrence Relations — testing convergence, finding a limit
  - [ ] Complex Numbers (algebra) — addition/subtraction/multiplication/division, finding a square root
  - [ ] Polar Form & Geometric Interpretations — converting Cartesian↔polar, sketching a locus (circle, perpendicular bisector)
  - [ ] De Moivre's Theorem — an integer-power example and a fractional-power (root-finding) example
  - [ ] Methods of Proof — one full worked example each of contradiction, contrapositive, and induction
  - [ ] Critical Points & Curve Sketching — a full worked sketch following the stated 5-step method
  - [ ] Vectors — scalar product/angle between vectors, vector product, equation of a line, equation of a plane, worked with real numbers
  - [ ] Differentiation — chain/product/quotient rule examples, an implicit differentiation example, a parametric differentiation example
  - [ ] Integration — a substitution example, an integration by parts example, a volume of revolution example
  - [ ] Differential Equations — one worked example each of separable, first-order linear (integrating factor), and second-order (for each of the three auxiliary-equation root cases)

## 🟠 Structural — topics are too compressed

- [ ] **Split "Differentiation" into multiple topics.** Currently one topic covers product rule, quotient rule, chain rule, five standard derivatives, implicit differentiation, and parametric differentiation. Consider splitting into at least: Rules & Standard Derivatives / Implicit Differentiation / Parametric Differentiation, each with its own worked examples.
- [ ] **Split "Integration" into multiple topics.** Currently one topic covers standard integrals, substitution, volumes of revolution, and integration by parts. Consider splitting similarly.
- [ ] **Split "Vectors" into multiple topics.** Currently one topic covers scalar product, vector product, equations of lines (3 forms), and equations of planes (2 forms). This is a lot of distinct content compressed into one card.

## 🟡 Missing content — assessed skills with no coverage at all

Checked systematically against the official SQA Advanced Higher spec. These are named, assessed skills with zero mentions anywhere in the file:

- [ ] **Euclid's algorithm** — finding the GCD of two positive integers, expressing the GCD as a linear combination of the two, and expressing integers in bases other than 10. No topic covers this at all.
- [ ] **Logarithmic differentiation** — not mentioned; needed for extended products/quotients and functions where the variable is in the index.
- [ ] **Related rates of change** — not mentioned (e.g. classic "falling ladder," inflating balloon/rate problems).
- [ ] **Optimisation and greatest/least values on a closed interval** — Functions topic covers critical points and curve sketching but not this applied skill.
- [ ] **Area under a curve / area between curves** — Integration topic only covers volumes of revolution; area applications (both against the x-axis and between two curves/a line and a curve) are absent.
- [ ] **Finding a specific term or coefficient in a binomial expansion** (the general-term technique) — only the basic theorem is stated, not this commonly-assessed extension.
- [ ] **Summation formulae** (standard results for Σr, Σr², Σr³ and combinations of these) — no topic covers this, despite being a named spec area under Sequences and Series.

## Technical checks (no action needed)

- ✅ No LaTeX syntax errors found (scanned all 137 math expressions in the file)
- ✅ All 18 videoUrl fields are populated
- ⚠️ Zero diagrams used — consistent with the other four courses, but lower priority here than the missing examples above

---
*Generated from audit of Advanced Higher Mathematics, course 5 of 5 (final course audited). Given the scale of the gap here relative to the other courses, recommend prioritising this course's content build-out ahead of cosmetic fixes (diagrams, video links) elsewhere.*
