# Master TODO — Course Notes: House Style & Best Practice Guide

This is a cross-course synthesis, not a course-specific fix list. It sets the
standard every course (current and future) should be checked against. Written
after auditing all five courses (National 5 Maths, National 5 Applications,
Higher Maths, Higher Applications, Advanced Higher) — every rule below is
backed by something observed working well or badly in at least one of them.

## 1. Structure & Layout

- [ ] **Section groupings should mirror the official SQA spec where sensible.** Higher Applications currently splits probability into "Planning & Decision Making" rather than "Statistics," diverging from the SQA's own "Statistics and probability" grouping. Not wrong, but worth a deliberate decision per course rather than an accidental one — pick a rule and apply it consistently across all five courses.
- [ ] **No topic should duplicate another topic's content.** National 5 Applications' "Interpreting Graphical Data" topic is a near-verbatim repeat of "Statistical Diagrams" (same pie-chart example structure, same scatter-graph example, word-for-word in places). Every topic should map to a distinct assessed skill from the spec — if two topics end up teaching the same thing, that's a sign one of them is missing its actual intended content.
- [ ] **Topic granularity should match content weight.** Advanced Higher compresses entire spec areas (all of differentiation; all of integration; scalar product + vector product + lines + planes) into single topics with a handful of lines each. Compare this to Higher Maths, which gives "Wave Function," "Multiple Angles," and "Minimum and Maximum Values" their own separate topics within trigonometry alone. As a rule of thumb: if a topic's theory can't be summarised in one sentence, it should probably be split.
- [ ] **Every topic should have a title that's specific enough to disambiguate it in a sidebar list at a glance** — this is already done well across all five courses; keep it up as new topics are added.

## 2. Content Depth

- [ ] **Every topic must have worked examples — no exceptions for "new," non-revision content.** Advanced Higher has zero examples across all 18 topics. Even where a topic is a short intro/revision recap (e.g. "Introduction to Polynomials," "Revision of N5 Vectors"), a light example is preferable to none; for substantive new content, 2–3 fully worked examples is the house minimum (matching what National 5 Maths, National 5 Applications, Higher Maths, and Higher Applications already do).
- [ ] **Examples should progress from routine to exam-realistic.** The best material found across the audits (Higher Applications' Finance and Statistics topics, Higher Maths' Optimisation examples) moves from a clean single-skill example to a multi-step, exam-style question by the second or third example. Don't stop at the first, easiest case.
- [ ] **Higher-tier courses should include at least one multi-skill, combined example per topic where realistic.** National 5 Maths' Simultaneous Equations theory promises a graphical method it never demonstrates; Higher and Advanced Higher content should actively combine skills (e.g. completing the square feeding into a curve-sketch, or a differential equation feeding into an initial-condition problem) since that's what the actual exam papers do at that level.
- [ ] **Don't state a claim in the theory that the examples don't back up.** If the theory box says a skill "can be done algebraically or graphically," at least one example needs to show the second method, or the claim should be cut.
- [ ] **Numbers in a question and numbers used in its own worked solution must match.** Found a genuine case (Higher Applications' Deductions example) where the question stated one NI figure and the working silently used a different one. This should be part of a pre-publish check, not just an audit-time catch.
- [ ] **Avoid decorative or unverified flourishes in theory text.** National 5 Maths described function notation as "Leibniz's notation," which is imprecise and adds nothing. Theory should stick to what's true and relevant to the specific exam skill — don't reach for historical or notational colour that isn't accurate.

## 3. Technical / Rendering

- [ ] **LaTeX must be validated before publishing, not just visually inspected.** Every LaTeX bug found in this audit (a broken `\frac{}{}`, a corrupted `\text{}`, a stray semicolon, unescaped `%` signs, and — most seriously — vectors using `\ ` instead of `\\` as the matrix row separator) was invisible unless someone actually rendered the page or ran a script checking brace-balance across every `math="..."` string. **Recommend a lint/build step that programmatically checks every math expression for balanced braces and known-bad patterns (`\texts`, unescaped `%`, single backslash inside `pmatrix`) before merge.**
- [ ] **Reference-correct vector/matrix syntax:** `\begin{pmatrix} x \\ y \\ z \end{pmatrix}` (double backslash between rows). Higher Maths and Advanced Higher both do this correctly — use them as the template; National 5 Maths currently does not.
- [ ] **Every topic must have a real video link before a course is considered "done."** Currently: National 5 Maths (0/34), National 5 Applications (0/26), and Higher Maths' Exponentials & Logarithms section (0/7) have empty `videoUrl` fields, while Higher Applications (42/51) and Advanced Higher (18/18) are otherwise well populated. Treat "video coverage complete" as a required item in each course's release checklist, not an optional nice-to-have.

## 4. Diagrams — the single biggest cross-course gap

- [ ] **Diagram coverage is wildly inconsistent and, in three of five courses, absent entirely.** National 5 Maths, National 5 Applications, and Advanced Higher have **zero** diagrams across their combined 78 topics. Higher Applications has diagrams only in its Planning & Decision Making section (40 other topics have none). Higher Maths is the exception and should be the model — it has diagrams or hand-built SVGs in 6 of its 10 sections.
- [ ] **Set a rule: any topic covering an inherently visual skill must ship with a diagram.** This includes (non-exhaustive): bearings, circle geometry (tangents, chords, angle properties), vectors (2D/3D), scale drawings, precedence networks/PERT/Gantt charts, box plots/histograms/scatter plots, trig graphs, exponential/logarithmic graphs, and any composite-shape geometry problem. If a topic name itself describes something you'd draw (e.g. "Trig Graphs," "Statistical Diagrams," "Scale Drawing & Navigation"), it needs at least one rendered diagram, not just prose describing what the picture would show.
- [ ] **Reuse the shared illustration library (`illustrations.tsx`) as the default; hand-built inline SVGs (as seen in Higher Maths' Circles topic) are an acceptable fallback** where a bespoke diagram is needed and doesn't fit the shared component set — but check the shared library first, since duplicating similar diagram code inline across topics will get harder to maintain.

## 5. House Style — worth formalising and applying to every course

- [ ] **Adopt the "Golden Rule" + "Common SQA Examiner Traps" callout format everywhere.** This pattern — first seen in National 5 Applications and Higher Applications — is the strongest pedagogical device found across all five courses: a one-line framing of the key principle, followed by a boxed list of specific, named exam pitfalls (several citing actual SQA Course Report language). National 5 Maths and Advanced Higher currently don't use this format at all; retrofitting it would likely be the single highest-value content change available for those two courses.
- [ ] **Where possible, cite real SQA Course Report findings** (as Higher Applications and National 5 Applications already do in several places — e.g. the bearings return-journey trap, the "on average" spread-vs-average trap). This kind of detail is what separates exam-specific notes from generic textbook content, and it's a differentiator worth extending to every course.
- [ ] **Use real, current data wherever the exam requires it** (as Higher Applications does with the actual 2025/26 National Insurance bands). Where a course references tax bands, formula-sheet conventions, or other year-specific figures, keep these current and flag them for annual review.

## Suggested pre-publish checklist per topic (going forward)

- [ ] Theory is accurate and every claim is backed by an example
- [ ] At least 2 worked examples (3+ for higher-tier or multi-step skills), progressing in difficulty
- [ ] All math expressions render correctly (brace-balanced, no unescaped `%`, correct `\\` in matrices)
- [ ] Real video link, not a placeholder
- [ ] Diagram included if the topic is inherently visual
- [ ] "Golden Rule" + "Common SQA Examiner Traps" box included
- [ ] No content duplicated from another topic in the same or a related course

---
*Synthesised from the individual audits of all five courses: National 5 Maths, National 5 Applications of Mathematics, Higher Maths, Higher Applications of Mathematics, and Advanced Higher Mathematics.*
