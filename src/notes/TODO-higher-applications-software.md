# TODO — Higher Applications of Mathematics: RStudio & Excel Coverage

The SQA course spec requires candidates to use **both** spreadsheet software (for
the question paper) and statistical software — RStudio or Minitab — (for the
project). Audit of `src/notes/data/higherAppsData.tsx` shows these are unevenly
covered: RStudio syntax is reasonably strong, Excel/spreadsheet syntax is thin.
Below is what exists today and what to add.

## ✅ Already covered — don't duplicate

- **RStudio commands taught with real syntax** across several topics:
  - `summary(X)` — Descriptive Statistics
  - `cor.test(X, Y)` — Correlation / Correlation Tests
  - `lm(Y~X)` and `predict(lm(Y~X), newdata=data.frame(X=C), interval="pred")` — Linear Regression
  - `prop.test(x = c(a, b), n = c(n1, n2))` — Z Tests
  - t-test / paired t-test selection logic — Mixed Hypothesis Tests
- **Spreadsheet formulas appear in Finance**, using real Excel syntax with absolute references:
  - `=ROUND(Opening_Balance * $Interest_Rate$, 2)` — Investment Schedules
  - `=ROUND(C7*$B$2, 2)`, `=SUM(C7:D7)+$B$3` — Loans & Loan Schedules
  - Goal Seek is explained conceptually (5 mentions) for finding level loan repayments

## 🔴 Gaps to fix

- [ ] **Most SQA-required Excel functions are never shown as actual formula syntax.** The spec explicitly lists: `SUM`, `PRODUCT`, `IF`, `AND`/`OR`, `ROUND`, `ABS`, `INT`, `GOAL SEEK`, `AVERAGE`, `MIN`, `MAX`, `MEDIAN`, `COUNTIF`, `STDEV`, `PEARSON`. A precise scan of the file found real formula syntax (`=FUNCTION(...)`) for only `ROUND` and `SUM`. The rest are either absent entirely or only referred to conceptually (e.g. "the mean," "the standard deviation") without ever showing the actual Excel formula. Specifically missing as real syntax:
  - [ ] `PRODUCT` — for compound multiplier chains
  - [ ] `IF` / `AND` / `OR` — for conditional logic (e.g. tolerance/compatibility checks, tax band thresholds)
  - [ ] `ABS` / `INT` — for absolute error work and truncating to whole numbers
  - [ ] `AVERAGE`, `MEDIAN`, `MIN`, `MAX` — should appear alongside the existing Descriptive Statistics theory
  - [ ] `STDEV` — should appear alongside the existing standard deviation content
  - [ ] `COUNTIF` — not covered anywhere; useful for classifying/counting categorical data
  - [ ] `PEARSON` — the Correlation topic teaches `cor.test()` in R but never shows the Excel equivalent (`=PEARSON(range1, range2)`), despite the question paper requiring spreadsheet fluency too

- [ ] **No dedicated "spreadsheet fundamentals" topic.** Spreadsheet syntax currently only appears embedded inside Finance schedule topics (Investment Schedules, Loan Schedules). The SQA spec expects candidates to be able to "create a spreadsheet from scratch," including basic navigation, cell referencing (relative vs. absolute), and formatting — none of which is taught as a standalone skill before students are dropped into building a full amortisation schedule. Consider adding a short intro topic (could sit at the start of Finance, or as a new short topic in Modelling) covering:
  - [ ] Cell references (relative vs. absolute, the `$` lock)
  - [ ] Basic function syntax and how to enter formulas
  - [ ] Fill-down / autofill behaviour (directly relevant to building schedules)

- [ ] **No equivalent "RStudio fundamentals" topic.** Similarly, R commands are introduced piecemeal inside Statistics topics as they become relevant, with no topic covering the basics (reading in/labelling a dataset, running a function on a column, reading a console output block). Given the project explicitly requires independent RStudio use, a short foundational topic (e.g. "Introduction to RStudio Output") explaining how to read a typical R console block — which lines are the test statistic, which is the p-value, which is the confidence interval — would help before diving into t-tests, z-tests, and correlation tests.

- [ ] **Cross-reference Excel and R side-by-side where they do the same job.** Wherever a statistic is taught with `summary(X)` or `cor.test(X,Y)` in R, add the matching Excel formula (e.g. `=AVERAGE()`/`=MEDIAN()`/`=PEARSON()`) directly alongside it, so students preparing for the calculator-based question paper aren't missing the spreadsheet-native version of the same skill covered for the project.

---
*Follow-up to the Higher Applications of Mathematics audit (course 3 of 5), addressing a specific gap in software-tool coverage requested separately from the main audit findings.*
