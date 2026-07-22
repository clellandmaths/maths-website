# TODO — National 5 Applications of Mathematics Course Notes

Audit findings for `src/notes/data/national5AppsData.tsx`. Items grouped by priority.

## 🔴 Technical fixes (breaks rendering / missing content)

- [ ] **Video links missing** — all 26 `videoUrl` fields in `national5AppsData.tsx` are empty strings. Populate from the existing YouTube back-catalogue, matching the population rate already achieved in `higherMathsData.tsx` (92/101) and `advancedHigherMathsData.tsx` (18/18).

- [ ] **Diagrams missing entirely** — zero illustration/SVG components used anywhere in this file. This subject is built almost entirely around visual real-world contexts, so this matters more here than elsewhere. Add components to `illustrations.tsx` and import into `national5AppsData.tsx` for at minimum:
  - [ ] Scale drawing & navigation — bearings diagram showing North lines and multi-leg journeys
  - [ ] Precedence Tables & Critical Path — activity network diagram
  - [ ] 3D Container Packing — labelled container/box diagram
  - [ ] Statistical Diagrams — box plot, pie chart, back-to-back stem-and-leaf
  - [ ] Reading Scales & Tolerance — dial/gauge diagram

- [ ] **Broken LaTeX — found by scanning all 371 math expressions in the file:**
  - [ ] `4500\texts grams}` (Basic Operations, Example 2) → should be `4500\text{ grams}`
  - [ ] `\frac{144};320}` (Percentages, Example 2) → should be `\frac{144}{320}`
  - [ ] `93.5\t%.` (Compound Percentages theory) → should be `93.5\%.`
  - [ ] Unescaped `%` signs throughout Compound Percentages topic (e.g. `100%. + 4%. = 104%.`) — LaTeX/KaTeX treats an unescaped `%` as a comment character, which can silently drop everything after it on that line. Test in the actual renderer and escape to `\%` throughout this topic if needed.

## 🟠 Content errors (verified against the question text/arithmetic)

- [ ] **Deductions, Example 2** — question states Chloe's NI payment is **£2,267.60**, but the working uses **£2,667.60** in the deductions sum. Fix the inconsistency (pick the correct figure and make both question and working match).

- [ ] **Foreign Exchange, Example 1** — "JPY" is typed as "**JTY**" twice (in the spending line and the "remaining" line). Find-and-replace.

- [ ] **Saving & Borrowing theory** — "looking for **dhethe** lowest APRs" → should read "the lowest APRs".

- [ ] **Foreign Exchange, Example 3** (Norwegian Krone) — `42,500 + 39,800 + 45,200 - 127,500 \text{ NOK}` uses a **minus sign where it should be an equals sign** (the three months correctly sum to 127,500). Change to `= 127,500`.

## 🟡 Structural/content gaps

- [ ] **"Interpreting Graphical Data" topic duplicates "Statistical Diagrams"** — this is the biggest content gap in the course. Per the SQA spec, "Interpreting Graphical Data" should cover: tables with 5+ categories, charts with missing/unclear scales (e.g. compound bar charts), graphs with missing axes (e.g. conversion line graphs), pictograms, and maps. Instead:
  - [ ] Both topics teach the identical pie-chart-angle method with a near-identical worked example (chocolate preferences vs. pie fillings)
  - [ ] Both topics include the same Harris-commute-time scatter graph example, near-verbatim
  - [ ] Rewrite "Interpreting Graphical Data" theory + examples to actually cover its own assessed skill: compound/comparative bar charts, pictograms, conversion graphs with unclear scales, and maps — rather than repeating pie charts and line of best fit.

- [ ] **Bias and sample size missing** — explicitly named in the SQA spec under both Statistical skills and Graphical data skills ("understanding the effects of bias and sample size"). Zero mentions anywhere in the file. Add theory + at least one worked example (e.g. discussing why an online survey sample might be biased, or why a small sample size affects reliability).

- [ ] **Box plots — theory only, no worked example** — mentioned as a bullet point in Averages & Spread theory ("A box plot is a visual drawing of the five-figure summary") but no example actually constructs or reads one. Add a worked example plotting a box plot from a five-figure summary, or interpreting/comparing two box plots.

---
*Generated from audit of National 5 Applications of Mathematics, course 2 of 5. Higher Maths, Higher Applications, and Advanced Higher audits still to follow.*
