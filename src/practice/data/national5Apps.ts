// National 5 Applications of Maths guided practice.
//
// Unlike the other three courses, these questions are ours — there is no
// maths.scot equivalent for Applications — so they carry no `solutionUrl` and
// need no attribution. Entries with `ref` are past paper questions the site
// already holds: referenced, not restated, so each exam question exists once
// and carries its own marks, diagram and video.
//
// Authored questions carry no marks. We do not invent Qualifications Scotland
// mark allocations; referenced questions keep the real ones.
//
// Each topic climbs: single-step warm-ups, then multi-step questions in exam
// contexts, then the real past paper questions at full exam standard.
//
// Loaded with import() from the practice route only — never import this from a
// notes or paper page, or it lands in the shared bundle.
import type { PracticeCourse } from '../types';

export const national5AppsPractice: PracticeCourse = {
  courseId: 'n5-apps',
  sections: [
    {
      id: "numeracy",
      title: "Numeracy",
      topics: [
        {
          name: "Compound Percentages",
          questions: [
            // --- warm-ups: the multiplier itself, then one step ---
            { question: `Write down the decimal multiplier you would use for:<br>(a) an increase of \\(6\\%\\)<br>(b) a decrease of \\(12\\%\\)`, answer: `(a) \\(1.06\\)<br>(b) \\(0.88\\)` },
            { question: `A caravan is worth \\(\\pounds 8400\\).<br>It depreciates by \\(9\\%\\) in one year.<br>Calculate its value after 1 year.`, answer: `\\(\\pounds 7644.00\\)` },
            { question: `\\(\\pounds 2500\\) is invested in a savings bond paying \\(3\\%\\) compound interest per year.<br>Calculate the value of the bond after 2 years.`, answer: `\\(\\pounds 2652.25\\)` },

            // --- multi-step, with the rounding instruction the exam always gives ---
            { question: `The population of a village is \\(8600\\).<br>It is expected to increase by \\(2.5\\%\\) each year for the next 5 years.<br>Calculate the expected population after 5 years.<br>Give your answer rounded to 3 significant figures.`, answer: `\\(9730\\) people` },
            { question: `A company buys machinery costing \\(\\pounds 24\\,000\\).<br>The machinery depreciates by \\(18\\%\\) each year.<br>Calculate its value after 3 years.<br>Give your answer to the nearest pound.`, answer: `\\(\\pounds 13\\,233\\)` },
            { question: `A forest covers an area of \\(320\\) hectares.<br>The area is decreasing by \\(6.5\\%\\) each year.<br>Calculate the area of the forest after 4 years.<br>Give your answer rounded to 3 significant figures.`, answer: `\\(245\\) hectares` },
            { question: `\\(\\pounds 5000\\) is invested in a fund.<br>The value increases by \\(4.5\\%\\) in the first year, then decreases by \\(2.1\\%\\) in each of the next 2 years.<br>Calculate the value of the fund after 3 years.<br>Give your answer rounded to 3 significant figures.`, answer: `\\(\\pounds 5010\\)` },

            // --- past paper questions, oldest first ---
            { ref: "2018 P2 Q1" },
            { ref: "2019 P2 Q1" },
            { ref: "2022 P2 Q1" },
            { ref: "2023 P2 Q1" },
            { ref: "2024 P2 Q1" },
            { ref: "2025 P2 Q2" },
          ],
        },
      ],
    },
  ],
};
