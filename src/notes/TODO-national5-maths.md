# TODO — National 5 Maths Course Notes

Audit findings for `src/notes/data/national5MathsData.tsx`. Items grouped by priority.

## 🔴 Technical fixes (breaks rendering / missing content)

- [ ] **Vector matrix syntax bug** — every `\begin{pmatrix}...\end{pmatrix}` in the Vectors topic uses `\ ` (backslash-space) instead of `\\` (double backslash) as the row separator, so vectors render as a horizontal row instead of a column. Affects 6 instances:
  - [ ] Theory: `\begin{pmatrix} x \ y \ z \end{pmatrix}` → `\begin{pmatrix} x \\ y \\ z \end{pmatrix}`
  - [ ] Example 1 (`vectors-ex1`): vector `u`, vector `v`, the scaled `2u` step, and the final answer — 4 instances
  - [ ] Example 2 (`vectors-ex2`): vector `p` — 1 instance
  - Reference: correct pattern already used in `higherMathsData.tsx` (~line 5928) — copy from there.

- [ ] **Video links missing** — all 34 `videoUrl` fields in `national5MathsData.tsx` are empty strings. Populate from the existing YouTube back-catalogue, matching the population rate already achieved in `higherMathsData.tsx` (92/101) and `advancedHigherMathsData.tsx` (18/18).

- [ ] **Diagrams missing entirely** — zero illustration/SVG components used anywhere in this file. Add new components to `illustrations.tsx` and import into `national5MathsData.tsx` for:
  - [ ] Bearings — two-path diagram showing the angle at the vertex
  - [ ] Trig graphs — sine/cosine curve shapes with amplitude/shift labelled
  - [ ] Vectors / 3D coordinates — labelled 3D cuboid
  - [ ] Line of Best Fit — scattergraph
  - [ ] Circle geometry — tangent–radius right angle, chord bisector

## 🟠 Content/copy fixes

- [ ] **Algebraic Fractions, Example 2** — solution says "find a common denominator (**ab**)" but the working uses 12 (correct, for denominators 3 and 4). Change "(ab)" to "(12)" or drop the parenthetical.

- [ ] **Functions theory** — remove the line calling function notation "an important alternative mathematical language to **Leibniz's notation (using y)**." Imprecise (Leibniz notation = dy/dx calculus notation, not "y = ...") and adds no value at N5.

- [ ] **Bearings, Example 2** — solution asserts "the interior angle between the two paths is 90°" with no derivation shown. Add the working (from bearings 060° and 150°) rather than asserting it — pair with the new bearings diagram above.

## 🟡 Structural/content gaps (lower priority)

- [ ] **Quadratics** — no worked example on stating the axis of symmetry or sketching a parabola, despite the theory text promising this skill.

- [ ] **Simultaneous Equations theory** — says solving can be done "algebraically or graphically" but only algebraic elimination is demonstrated. Either add a graphical example or trim the claim from the theory.

- [ ] **Gradient duplication** — "Gradient" (Geometry) repeats "Straight Line" (Algebra) almost verbatim. Replace the second instance with a distinct application (e.g. roof pitch, ramp gradient) instead of restating the same formula.

---
*Generated from audit of National 5 Maths, course 1 of 5. Applications, Higher Maths, Higher Applications, and Advanced Higher audits still to follow.*
