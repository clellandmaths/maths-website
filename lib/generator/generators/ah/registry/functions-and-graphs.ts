/**
 * Advanced Higher, Functions & Graphs: what each card is.
 * The routines are in `../routines/functions-and-graphs.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const FUNCTIONS: readonly CardMeta[] = [
  {
    card: '2017 Q12',
    skill: 'An odd function from half its graph, a point and an asymptote: the graph completed, the sketch of its modulus with the asymptotes meeting, and the range of its gradient.',
    marks: [2, 2, 1],
    route: '2 + 2 + 1 - (a) half-turn symmetry, with the point\'s image marked; the curve approaching the image asymptote y = mx + c; (b) the parts below the x-axis reflected, through (±p, h) with a cusp at O; the asymptotes y = mx + c and y = -mx + c meeting on the y-axis; (c) m < f\'(x) ≤ g, the gradient falling from f\'(0) = g to the asymptotes\'. The sketches are in the marking instructions only, as 2021 P1 Q7\'s, never under Show answer; the question shows the paper\'s half graph.',
    ranges: 'The paper: the point (-1, -2), the asymptote y = (1/2)x - 3, f\'(0) = 2; (a) (1, 2) and y = (1/2)x + 3; (b) asymptotes meeting at 3; (c) 1/2 < f\'(x) ≤ 2. The asymptote\'s gradient m shallow, as the paper\'s, 1/3 or 1/2 (at 1 the two asymptotes run steep and close and a point\'s label has nowhere clear); its crossing -c from -2 to -6 (the paper\'s -3); the point (-p, -h) with p 1 (the paper) or 2 and h whole, a third to two thirds of the way from the line through O parallel to the asymptote to the asymptote itself, as the paper\'s half way, so the curve bends as the paper\'s does. The curve drawn is mx + c tanh(kx) through the point, and f\'(0) is its gradient at O, rounded: at the paper\'s numbers, 2.15, so 2, the paper\'s. Kept: f\'(0) at least the chord\'s gradient h/p (the paper\'s is exactly 2). The paper\'s half graph is drawn on the question, x and y and 0, the point and -c marked, at one scale on both axes. 33 questions.',
  },
  {
    card: '2021 P1 Q7',
    skill: 'The asymptotes of ax^2/(x - p) with a justification, sketches of the curve and of its modulus from the given turning points, then the k for which |f(x)| = k has exactly two solutions.',
    marks: [1, 2, 1, 1, 1],
    route: '1 + 2 + 1 + 1 + 1 - (a)(i) x = p; (a)(ii) the algebraic division, f(x) = ax + ap + ap^2/(x - p), then y = ax + ap with the remainder tending to 0 as x tends to ±infinity as the justification; (b) the sketch: both branches through the turning points, approaching the asymptotes; (c)(i) the modulus sketch, the negative part reflected, with the reflected asymptote y = -ax - ap drawn; (c)(ii) 0 < k < 4a|p|.',
    ranges: 'The paper: x^2/(x - 2) = x + 2 + 4/(x - 2), asymptotes x = 2 and y = x + 2, turning points (0, 0) and (4, 8), 0 < k < 8. p from 1 to 5 either sign (the paper\'s 2): a negative p turns the graph through a half turn, the maximum on the left at (2p, 4ap) and the minimum at the origin, and the same steps; a from 1 (the paper) to 3 in front of x^2, a bigger number, not a step (the division is the same three terms), since the paper\'s p alone makes 10 questions, below the floor. The remainder ap^2 at most 25 (a = 2 for p up to 3, a = 3 for p up to 2), so every number in the working stays within 25. Always ax^2 alone on top, so the turning points are (0, 0) and (2p, 4ap), whole, as the paper states them. 20 questions. The sketches are described in words, as the site\'s own card describes them. All exact: Paper 1.',
  },
  {
    card: '2025 P1 Q6',
    skill: 'Divide a quadratic by a linear factor into Ax + B + C/(x - p), then state the two asymptotes.',
    marks: [2, 2],
    route: '2 + 2 - (a) the algebraic division begun (the first term x and x times the divisor), then finished and f(x) rewritten with its remainder over x - p; (b) the vertical asymptote x = p, then the non-vertical asymptote y = x + B, each written as an equation.',
    ranges: 'The paper: (x^2 + x + 5)/(x - 2) = x + 3 + 11/(x - 2), asymptotes x = 2 and y = x + 3. Built from the answer: x + B + C/(x - p), with p from ±1 to ±5, B from ±1 to ±6 and C from 1 to 15, positive in three draws of four as the paper\'s 11 is, so the top is (x + B)(x - p) + C. A stays 1, as the paper\'s: the x^2 has no coefficient. Kept: the top has all three terms, as the paper\'s, its constant within 25, and C never 0, so x - p is never a factor and there is always a vertical asymptote. All exact: Paper 1.',
  },
  {
    card: '2024 P1 Q5',
    skill: 'Decide whether a cubic is even, odd or neither, then show its graph has a point of inflection.',
    marks: [2, 2],
    route: '2 + 2 - (a) f(-x) written out, then simplified to -f(x) and "odd" stated; (b) f\'\'(x) = 0 solved, then the sign of f\'\'(x) either side of 0 and the conclusion. A zero second derivative on its own earns only the first mark of (b).',
    ranges: 'The paper: f(x) = x^3 - x, odd, f\'\'(x) = 6x. f(x) = ax^3 + bx with a from ±1 to ±5 and b from ±1 to ±9, never 0 and sharing no factor, as 1 and -1, so f is always odd, as the paper\'s: an even or a neither function is another answer, so another card. The inflection is always at x = 0; a negative a turns the signs of f\'\'(x) round, which (b) must say.',
  },
  {
    card: '2019 Q3',
    skill: 'From a graph given in terms of a, decide whether the function is odd, even or neither with a reason, then sketch its modulus.',
    marks: [1, 1],
    route: '1 + 1 - (a) which it is, with the reason: the symmetry named (the y-axis for even, the origin for odd) or f(-x) worked out; "it is symmetrical" alone is not enough; (b) the sketch of |f|: the parts below the x-axis reflected, sharp points at the roots, the roots labelled.',
    ranges: 'The paper: f(x) = x^2 - a^2, even, its graph with -a and a marked; |f| with a maximum at (0, a^2). The card asks the pupil to decide, so it must not always give the same answer (the owner\'s rule from 2023 P1 Q3, "Make half redundant", after 2024 P1 Q5 was built always odd): two even (x^2 - a^2, the paper, and a^2 - x^2), two odd (x^3 - a^2x and a^2x - x^3) and two neither (x^2 - ax and ax - x^2); then, on the owner\'s "Keep as a? Could we have 6 more of similar difficulty to initial question?", six more quadratics: x^2 - 4a^2 and 4a^2 - x^2 (even), x^2 - 2ax, 2ax - x^2, x^2 + ax - 2a^2 and x^2 - ax - 2a^2 (neither). Each has its roots at whole multiples of a, labelled in a as the paper\'s, drawn at a = 1. 12 questions.',
    exempt: {
      why: 'Twelve functions in a, the letter kept as the paper keeps it: 12 questions, exactly the floor, which the gate\'s 40-draw sample sees as 11.',
      owner: 'On the 2019 sheet, 2026-10-03, "Keep as a? Could we have 6 more of similar difficulty to initial question?"; then, asked to confirm the six and record Q3 at 12: "Yes, record at 12".',
    },
  },
  {
    card: '2016 Q12',
    skill: 'From a straight line given in terms of c, sketch the modulus of the line moved up or down, then the modulus of a multiple of it.',
    marks: [2, 2],
    route: '2 + 2 - (a) the V of |f(x) + d|, its point on the x-axis and where it meets the y-axis, both marked in c, which the scheme marks together; (b) the V of |kf(x)|, symmetrical, its point at f\'s root and meeting the y-axis at kc, both marked. The sketches are in the marking instructions only, as 2019 Q3\'s, never under Show answer; the question shows the paper\'s line.',
    ranges: 'The paper: the line through c on the x-axis and -c on the y-axis (f(x) = x - c), (a) |f(x) - c|, a V at 2c meeting the y-axis at 2c; (b) |2f(x)|, a V at c meeting it at 2c. c stays a letter, as the paper\'s, drawn at c = 1. The line any of the four through ±c on both axes (the paper\'s, x + c, c - x and -x - c), so it rises or falls at 45°, as the paper\'s; (a) moved by ±c or ±2c (the paper\'s -c), but never so the V\'s point is at O, where it would meet the y-axis at 0 and have nothing to mark; (b) times 2 (the paper) or 3. 24 questions.',
  },
];
