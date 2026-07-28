# Higher Applications of Maths — reference coverage map

Check of our course notes (`src/notes/data/higherAppsData.tsx`, **51 topics**
across 4 sections) against the reference material in `reference/Higher Apps/`
and the published course specification.

**Method.** The reference files are *scraped teaching material*, not a
specification — they carry `Debug View` / `Result View` artefacts, worksheet
links and video timings. So topics were identified by reading rather than by
extracting headings, then checked against our notes by reading the matching
topic. Several suspected gaps turned out to be hyphenation failures in my own
searches and were verified against multiple spellings before being reported.

**Sources**
- `reference/Higher Apps/` — Finance, Statistics, Modelling, decision, RStudio, excel
- Higher Applications of Mathematics course specification (extracted from the
  published PDF, not from a summariser — see the warning below)

> **⚠️ Do not trust PDF summarisers on these documents.** Asked to read the
> course specification, a summariser reported it contained **no mention** of
> spreadsheets, Excel, or RStudio. The specification in fact names both
> throughout, including an explicit list of required spreadsheet functions.
> Extract the text directly.

**Legend** — ✅ covered · ⚠️ partial · ❓ candidate (needs your ruling)

---

## Coverage by section

### Finance (19 topics) — ✅ no gaps found

Every topic in the reference appears in our notes: basic pay, overtime,
commission, bonuses, PAYE, National Insurance, VAT, council tax, vehicle tax,
property sales taxes (LBTT), student loans, inflation with CPI and RPI,
multipliers, investment and accumulation, present value, loan schedules,
pensions and insurance.

Thin but present, if you want them strengthened later: **vehicle tax**, **PAYE**
and **property sales taxes** each appear only once or twice.

### Statistics (12 topics) — one candidate

Covered: classifying data (nominal, ordinal, discrete, continuous), samples and
populations, outliers, bar charts, pie charts, histograms, box plots,
distributions and skew, normal distribution, descriptive statistics, correlation,
linear regression, hypothesis testing, null and alternative hypotheses, errors,
confidence intervals, p-values, correlation tests, z-tests, confounding
variables, and choosing the right test.

| | |
|---|---|
| **❓ t-tests have no topic of their own** | Correlation Tests and Z Tests each get a dedicated topic with worked examples. t-tests do not — they appear only inside the decision tree in *Mixed Hypothesis Tests*, and in passing elsewhere (14 mentions across 5 topics). The reference devotes substantial space to **paired vs independent** t-tests, your RStudio workbook has a full t-test section, and a past paper question turns on one (2024, Golf). **Is a dedicated t-test topic wanted, to match the other two tests?** |

### Modelling (9 topics) — ✅ no gaps found

Fermi estimations, modelling with graphs, units of measure including consistency
in a formula and in a comparison, errors and tolerance, recurrence relations,
and linear, quadratic and exponential relationships (with and without `e`).

*Verified rather than assumed:* "consistency of units" first appeared missing,
but it is section 2 of **Units Of Measure**.

### Planning & Decision Making (11 topics) — ✅ no gaps found

Precedence tables, constructing and interpreting PERT charts, critical path,
float, Gantt charts, basic and expected probability, tree diagrams, Venn
diagrams, risk and control measures, cost-benefit analysis.

*Verified rather than assumed:* "risk matrix" appeared missing, but the topic
teaches risk through **cost-benefit analysis**, which is what the reference does.

---

## Software — the substantive findings

### RStudio

The reference file is not usable: 100 lines of download instructions, TeeJay
video links and task references. The one genuinely useful part is the **Data
Booklet R code** table.

Our notes teach 11 R commands (`lm`, `prop.test`, `predict`, `cor.test`,
`table`, `summary`, `sd`, `prop.table`, `median`, `mean`, `IQR`) but omit
**`read.csv`, `attach`, `head`, `hist`, `boxplot`, `plot`, `t.test`** and
**`cor`** — that is, everything to do with loading data and drawing graphs.

**Recommendation:** do not rebuild the workbook as notes. It is a Quarto static
site with executable blocks, answer reveals and past-paper walkthroughs, none of
which survive flattening. Port it as-is (see below) and add the missing Data
Booklet commands to the statistics topics so the syntax sits beside the theory.

### Spreadsheets

The reference file is video scaffolding ("watch up to 23 minutes 30 seconds,
then copy the instructor") and is not portable.

But the **course specification names the required functions explicitly**:

> use the following spreadsheet functions: SUM, PRODUCT, IF, AND/OR, ROUND, ABS,
> INT, GOALSEEK, AVERAGE, MIN, MAX, MEDIAN, COUNTIF, STDEV, PEARSON

**Ten of those fifteen never appear as a formula in our notes.** Only `SUM`,
`ROUND`, `INT` and `MEDIAN` do, once or twice each. Missing entirely as syntax:
`PRODUCT`, `IF`, `AND/OR`, `ABS`, `AVERAGE`, `MIN`, `MAX`, `COUNTIF`, `STDEV`,
`PEARSON`.

The specification also requires: fill down, absolute cell references, copying and
renaming sheets, commenting formulae so another user can follow them, combining
data from more than one source, and **Goal Seek** for present-value work in
Finance. It states plainly that *"the question paper requires candidates to use
spreadsheet and statistical software."*

So this is a spec-backed gap, and it can be written from the specification's own
list without needing the video-based reference at all.

---

## House-style inconsistencies

Higher Apps has drifted from the other four courses, all of which were
standardised earlier.

| | Higher Apps | AH / N5 / N5 Apps / Higher |
|---|---|---|
| "SQA" mentions in content | **25** | 0, 0, 0, 1 |
| Emoji callout headings | `🚨 Important SQA Note 🚨`, `🚨 SQA Exam Rule 🚨` | none |
| Trap-style callouts | ~12, in ad-hoc inline styles | standard `⚠️ Common Examiner Traps` box |

Phrases in use include "Massive SQA Trap:", "The Classic SQA Trap:", "The
Ultimate SQA Trick" and "The Ultimate SQA Trap". These conflict with two
decisions already applied everywhere else: **use "Qualifications Scotland"/"QS",
not "SQA"**, and **keep content evergreen and org-neutral**.

**Worth knowing given the decision not to add traps boxes to this course:** the
course already contains roughly a dozen trap-style callouts. They are simply in
an inconsistent format rather than the standard box. So the choice is not
"traps or no traps" — it is whether to normalise what is already there.

---

## Summary

- **4 sections, 51 topics checked** against six reference files and the spec.
- **No content gaps in Finance, Modelling, or Planning & Decision Making.**
- **1 candidate:** t-tests have no dedicated topic, while the other two
  statistical tests do.
- **2 software gaps, both spec-backed:** 8 missing Data Booklet R commands, and
  10 of 15 named spreadsheet functions never shown as formulas.
- **House-style drift:** 25 "SQA" references and ad-hoc emoji callouts, against
  zero in the four standardised courses.
- Still outstanding for this course regardless: **41 placeholder video URLs**,
  and **1 topic with no worked examples** (Introduction to Planning & Decision
  Making).
