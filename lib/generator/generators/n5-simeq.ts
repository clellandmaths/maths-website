import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, nonZeroInt } from './utils';
import { TWO_ITEM_CONTEXTS, type TwoItemContext } from './n5-contexts';
import { sketchAxes } from '../diagrams/shapes/sketch-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * National 5 Simultaneous Equations — 10 paper questions.
 *
 * Half of them are the applied "construct and solve" family, which carries a
 * **separate final mark for communicating the answer with its units**, and
 * 2022 P2 Q4 note 2 requires the conclusion to name both quantities. A
 * generated question of that type is not finished without it, so the worked
 * answer always ends with a sentence naming both.
 *
 * 2023 P1 Q3 notes are strict about method: "answers obtained by repeated
 * substitution award 0/3", and correct answers without working award 0/3. The
 * marks are for the elimination, so every worked solution shows the scaling
 * step explicitly rather than jumping to the values.
 *
 * 2017 P1 Q13 is tagged with a graph, but both line equations are stated in the
 * text and the diagram is not needed to answer it — so the intersection type is
 * built now rather than waiting for the shape library.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** "3x", "-y", "x" — a coefficient attached to a letter. */
function term(coef: number, v: string): string {
  if (coef === 1) return v;
  if (coef === -1) return `-${v}`;
  return `${coef}${v}`;
}

/** "3x + 2y = 17", with the sign of the second term folded in. */
function equation(a: number, v1: string, b: number, v2: string, c: number): string {
  return `${term(a, v1)} ${b < 0 ? '-' : '+'} ${term(Math.abs(b), v2)} = ${c}`;
}

/** A number as it should read: 2.5 not 2.50, 7 not 7.0. */
const num = (x: number): string => `${Math.round(x * 1000) / 1000}`;

/**
 * A pair of equations whose solution is (x0, y0) and which genuinely needs
 * scaling to eliminate — the markscheme's first mark is "correct scaling", so a
 * pair where the coefficients already match would not test the same thing.
 */
function buildPair(x0: number, y0: number) {
  for (let tries = 0; tries < 400; tries++) {
    const a1 = nonZeroInt(-7, 7), b1 = nonZeroInt(-7, 7);
    const a2 = nonZeroInt(-7, 7), b2 = nonZeroInt(-7, 7);
    if (a1 * b2 - a2 * b1 === 0) continue;                 // no unique solution
    if (Math.abs(a1) === Math.abs(a2) || Math.abs(b1) === Math.abs(b2)) continue;
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
    if (!Number.isInteger(c1) || !Number.isInteger(c2)) continue;
    if (Math.abs(c1) > 60 || Math.abs(c2) > 60) continue;
    return { a1, b1, c1, a2, b2, c2 };
  }
  return null;
}

/** The elimination worked through, as the markscheme sets it out. */
function eliminationSteps(
  p: { a1: number; b1: number; c1: number; a2: number; b2: number; c2: number },
  v1: string, v2: string, x0: number, y0: number,
): string[] {
  const { a1, b1, c1, a2, b2, c2 } = p;
  const L = Math.abs(a1 * a2) / gcd(Math.abs(a1), Math.abs(a2));   // match the v1 terms
  const m1 = L / Math.abs(a1), m2 = L / Math.abs(a2);
  const sameSign = (a1 > 0) === (a2 > 0);
  const [A1, B1, C1] = [a1 * m1, b1 * m1, c1 * m1];
  const [A2, B2, C2] = [a2 * m2, b2 * m2, c2 * m2];
  const op = sameSign ? 'Subtract' : 'Add';
  const bAfter = sameSign ? B1 - B2 : B1 + B2;
  const cAfter = sameSign ? C1 - C2 : C1 + C2;

  return [
    `<strong>1.</strong> Scale each equation so the $${v1}$ terms match. Multiply the first by $${m1}$ and the second by $${m2}$:<br><br>$${equation(A1, v1, B1, v2, C1)}$<br>$${equation(A2, v1, B2, v2, C2)}$`,
    `<strong>2.</strong> ${op} to eliminate $${v1}$:<br><br>$${term(bAfter, v2)} = ${cAfter}$, so $${v2} = ${num(y0)}$`,
    `<strong>3.</strong> Substitute $${v2} = ${num(y0)}$ back into $${equation(a1, v1, b1, v2, c1)}$:<br><br>$${v1} = ${num(x0)}$`,
  ];
}

// ── solve a stated pair — 2015 P1 Q11, 2018 P1 Q3, 2023 P1 Q3, 2024 P1 Q7 ──
//
// Answer-first: choose the solution, then the coefficients, then compute the
// constants — which is the only way to guarantee the answer is presentable.
// 2018 P1 Q3's answer is x = 1/2, so a half is allowed occasionally.

function solveGiven(): Q {
  for (let tries = 0; tries < 200; tries++) {
    // The four bare "solve the system" papers are x/y three times and p/r once
    // - 2024 P1 Q7 is the p/r one. `a`/`b` and `m`/`n` are ours and appear in
    // none of them. The worded questions in this file are a different matter
    // entirely: see the note on the contexts' own letters.
    const [v1, v2] = pick([['x', 'y'], ['x', 'y'], ['x', 'y'], ['p', 'r']]);
    const half = getRandomInt(1, 6) === 1;                 // the 2018 P1 Q3 shape
    const x0 = half ? nonZeroInt(-9, 13) / 2 : nonZeroInt(-8, 9);
    const y0 = nonZeroInt(-8, 9);
    const p = buildPair(x0, y0);
    if (!p) continue;

    return {
      subTopic: 'Solving Simultaneous Equations',
      difficulty: 'skill',
      variationId: 'simeq.solve-given',
      questionLines: [
        `Solve, algebraically, the system of equations`,
        `$${equation(p.a1, v1, p.b1, v2, p.c1)}$`,
        `$${equation(p.a2, v1, p.b2, v2, p.c2)}$`,
      ],
      boardQuestionLines: [
        `Solve $${equation(p.a1, v1, p.b1, v2, p.c1)}$ and $${equation(p.a2, v1, p.b2, v2, p.c2)}$`,
      ],
      solutionSteps: eliminationSteps(p, v1, v2, x0, y0),
      // •¹ correct scaling, •² a value for one variable, •³ a value for the
      // other — the same three marks in all four papers
      stepMarks: [1, 1, 1],
      finalAnswer: `$${v1} = ${num(x0)}$, $${v2} = ${num(y0)}$`,
    };
  }
  throw new Error('simeq.solve-given: no valid question found');
}

// ── where two lines meet — 2017 P1 Q13 ───────────────────────────────────
//
// The same algebra reached through a different question. The paper's answer is
// (2.5, 5.5), so halves are deliberately common here.
//
// **The paper draws the two lines and this did not.** Found by
// `audit-lost-figures.mts`. The figure is not there to be measured - the
// question says "find, *algebraically*, the coordinates" - it is there so the
// pupil can see which line is which, and the equations written beside them are
// the only information it carries. So P is marked with a bare letter and never
// with its coordinates, exactly as the paper marks it.

function intersection(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const half = getRandomInt(0, 1) === 0;
    const x0 = half ? nonZeroInt(-9, 13) / 2 : nonZeroInt(-8, 9);
    const y0 = half ? nonZeroInt(-9, 13) / 2 : nonZeroInt(-8, 9);
    const p = buildPair(x0, y0);
    if (!p) continue;
    const point = pick(['P', 'A', 'T']);

    // Both lines have to be expressible as y = mx + c to be plotted. `buildPair`
    // draws its y-coefficients from nonZeroInt so this cannot fire today; it is
    // here because a vertical line would be drawn as a horizontal one rather
    // than rejected, which is the kind of silence this project keeps finding.
    if (p.b1 === 0 || p.b2 === 0) continue;
    const line1 = { kind: 'line' as const, m: -p.a1 / p.b1, c: p.c1 / p.b1 };
    const line2 = { kind: 'line' as const, m: -p.a2 / p.b2, c: p.c2 / p.b2 };

    const xs = [0, x0], ys = [0, y0];
    const padX = Math.max(3, (Math.max(...xs) - Math.min(...xs)) * 0.5);
    const padY = Math.max(3, (Math.max(...ys) - Math.min(...ys)) * 0.5);
    const eq1 = equation(p.a1, 'x', p.b1, 'y', p.c1);
    const eq2 = equation(p.a2, 'x', p.b2, 'y', p.c2);
    const fig = sketchAxes({
      view: {
        xMin: Math.min(...xs) - padX, xMax: Math.max(...xs) + padX,
        yMin: Math.min(...ys) - padY, yMax: Math.max(...ys) + padY,
      },
      plot: line1,
      curveLabel: eq1,
      also: { plot: line2, label: eq2 },
      points: [{ x: x0, y: y0, text: point, side: 'right' }],
    });
    const prose = [
      `Two straight lines have equations $${eq1}$ and $${eq2}$.`,
      `The diagram shows the two lines meeting at the point $${point}$.`,
      `Find, algebraically, the coordinates of $${point}$.`,
    ];
    if (verifyFigure(fig, prose.join(' ')).length) continue;

    return {
      subTopic: 'Intersection of Two Lines',
      difficulty: 'exam',
      variationId: 'simeq.intersection',
      questionLines: [prose[0], prose[1], renderScene(fig.scene), prose[2]],
      figure: fig,
      boardQuestionLines: [
        `Where do $${equation(p.a1, 'x', p.b1, 'y', p.c1)}$ and $${equation(p.a2, 'x', p.b2, 'y', p.c2)}$ meet?`,
      ],
      // 2017 P1 Q13 is three marks, not four: •¹ scaling, •² a valid strategy
      // through to values for x and y, •³ state the coordinates of P. Writing
      // the coordinates is not a mark of its own, so it closes the third step
      // rather than adding a fourth — and the third step is the one withheld.
      solutionSteps: eliminationSteps(p, 'x', 'y', x0, y0).map((s, i) =>
        i === 2 ? `${s}, so the lines meet at $${point}(${num(x0)}, ${num(y0)})$` : s),
      stepMarks: [1, 1, 1],
      finalAnswer: `$${point}(${num(x0)}, ${num(y0)})$`,
    };
  }
  throw new Error('simeq.intersection: no valid question found');
}

// ── construct then solve — 2014 P2 Q3, 2016 P1 Q4, 2019 P1 Q8, ───────────
//    2022 P2 Q4, 2025 P2 Q10
//
// Exactly half the topic. Always three parts: write an equation, write another,
// then solve — with the last mark for stating both answers with their units.


function amount(v: number, kind: TwoItemContext['kind']): string {
  if (kind === 'money') return `£${(v / 100).toFixed(2)}`;
  // "1 square metres" and "1 kilograms" both read as mistakes
  if (kind === 'kg') return v === 1 ? '1 kilogram' : `${v} kilograms`;
  return v === 10 ? '1 square metre' : `${v / 10} square metres`;
}

/**
 * `combine` is 2026 P2 Q4, whose part (c) does not want the two unit values.
 *
 * "Calculate the total number of minutes it will take Alex to make 10 cups and
 * 8 plates" — the pair is solved and then *used*, so the last mark is spent on
 * a quantity neither equation mentions. A variation that stopped at the two
 * values would be answering a question nobody asked.
 *
 * 2026 has no published scheme. The question data gives 1 + 1 + 4, and those
 * six marks map onto the other five papers' scheme exactly except for what the
 * last one buys.
 */
function constructSolve(combine = false): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(TWO_ITEM_CONTEXTS);
    const [v1, v2] = ctx.vars;
    if (v1 === v2) continue;

    // Unit values in pence / kilograms / tenths of a square metre, inside the
    // band that context makes plausible — an apple should not cost more than a
    // mango, and fruit should not be priced like theatre tickets.
    const [lo, hi] = ctx.band;
    const step = ctx.kind === 'money' ? 5 : 1;
    const round = (x: number) => Math.round(x / step) * step;
    const u1 = round(getRandomInt(lo, hi));
    const u2 = round(getRandomInt(Math.max(step, Math.round(lo * 0.5)), Math.round(u1 * 0.8)));
    if (u1 <= u2 || u2 <= 0) continue;

    const q1 = getRandomInt(2, 7), q2 = getRandomInt(2, 7);
    const q3 = getRandomInt(2, 7), q4 = getRandomInt(2, 7);
    if (q1 * q4 - q3 * q2 === 0) continue;                 // no unique solution
    if (q1 === q3 && q2 === q4) continue;
    // as in solveGiven, the pair must genuinely need scaling
    if (q1 === q3 || q2 === q4) continue;

    const t1 = q1 * u1 + q2 * u2, t2 = q3 * u1 + q4 * u2;

    // The arithmetic stays in whole pence / kilograms / tenths so nothing drifts,
    // but the equations must be written in the units the answer is given in —
    // 2022 P2 Q4's is 4m + 3a = 4.25, not 425.
    const scale = ctx.kind === 'money' ? 100 : ctx.kind === 'm2' ? 10 : 1;
    const [d1, d2, dt1, dt2] = [u1 / scale, u2 / scale, t1 / scale, t2 / scale];
    const p = { a1: q1, b1: q2, c1: dt1, a2: q3, b2: q4, c2: dt2 };

    const unit = ctx.kind === 'money' ? 'cost' : ctx.kind === 'kg' ? 'weight' : 'amount of material';
    const verb = ctx.kind === 'money' ? 'costs' : ctx.kind === 'kg' ? 'weighs' : 'uses';
    const inUnits = ctx.kind === 'money' ? 'pounds' : ctx.kind === 'kg' ? 'kilograms' : 'square metres';

    // the combination part (c) asks about, and what it comes to
    const [n1, n2] = [getRandomInt(2, 12), getRandomInt(2, 12)];
    const together = n1 * u1 + n2 * u2;

    return {
      subTopic: combine ? 'Simultaneous Equations Used Again' : 'Constructing Simultaneous Equations',
      difficulty: 'exam',
      variationId: combine ? 'simeq.construct-combine' : 'simeq.construct-solve',
      questionLines: [
        `${ctx.people[0]} ${ctx.verb} ${q1} ${ctx.plural[0]} and ${q2} ${ctx.plural[1]}. ${ctx.total} ${amount(t1, ctx.kind)}.`,
        `(a) Write down an equation in $${v1}$ and $${v2}$ to illustrate this information.`,
        `${ctx.people[1]} ${ctx.verb} ${q3} ${ctx.plural[0]} and ${q4} ${ctx.plural[1]}. ${ctx.total} ${amount(t2, ctx.kind)}.`,
        `(b) Write down an equation in $${v1}$ and $${v2}$ to illustrate this information.`,
        combine
          ? `(c) Calculate, algebraically, the total for ${n1} ${ctx.plural[0]} and ${n2} ${ctx.plural[1]}.`
          : `(c) Calculate, algebraically, ${ctx.asks}.`,
      ],
      boardQuestionLines: [
        `${q1} ${ctx.plural[0]} + ${q2} ${ctx.plural[1]} = ${amount(t1, ctx.kind)}, and ${q3} ${ctx.plural[0]} + ${q4} ${ctx.plural[1]} = ${amount(t2, ctx.kind)}. Find each.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> Let $${v1}$ be the ${unit} of one ${ctx.single[0]} and $${v2}$ the ${unit} of one ${ctx.single[1]}, both in ${inUnits}:<br><br>$${equation(q1, v1, q2, v2, dt1)}$`,
        `<strong>(b)</strong> The same for the second amount:<br><br>$${equation(q3, v1, q4, v2, dt2)}$`,
        ...eliminationSteps(p, v1, v2, d1, d2).map(s =>
          s.replace(/^<strong>(\d)\.<\/strong>/, '<strong>(c) $1.</strong>')),
        combine
          ? `<strong>(c)</strong> The question asks about ${n1} ${ctx.plural[0]} and ${n2} ${ctx.plural[1]}, so put the two values to work:` +
            `<br><br>$${n1} \\times ${d1} + ${n2} \\times ${d2}$, giving <strong>${amount(together, ctx.kind)}</strong>.`
          : `<strong>(c)</strong> Answer in words, naming both — this is a mark of its own:<br><br>One ${ctx.single[0]} ${verb} <strong>${amount(u1, ctx.kind)}</strong> and one ${ctx.single[1]} ${verb} <strong>${amount(u2, ctx.kind)}</strong>.`,
      ],
      // 1 + 1 + 4 in all six papers: •¹ and •² construct an equation each, then
      // •³ correct scaling, •⁴ a value, •⁵ the other value, •⁶ the answer — in
      // its units for construct-solve, applied to the new quantity for combine
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: combine
        ? amount(together, ctx.kind)
        : `One ${ctx.single[0]} ${verb} ${amount(u1, ctx.kind)} and one ${ctx.single[1]} ${verb} ${amount(u2, ctx.kind)}`,
    };
  }
  throw new Error(`simeq.construct-${combine ? 'combine' : 'solve'}: no valid question found`);
}

export const SIMEQ_GENERATORS: Record<string, () => Q> = {
  'Solving Simultaneous Equations': solveGiven,
  'Intersection of Two Lines': intersection,
  'Constructing Simultaneous Equations': () => constructSolve(false),
  'Simultaneous Equations Used Again': () => constructSolve(true),
};
