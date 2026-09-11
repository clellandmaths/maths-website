import { GeneratedQuestion } from './types';
import { getRandomInt, nonZeroInt, formatNum } from './utils';
import { sketchAxes, type SketchAxesSpec, type View, type Side } from '../diagrams/shapes/sketch-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Sketching a parabola — four paper questions, and the answer is a drawing.
 *
 * These are the only questions in National 5 whose answer is a picture, so the
 * working ends by showing one. `solutionSteps` render through the same
 * component as `questionLines`, so a step can carry a figure, and here that is
 * the point: a pupil who has been told the turning point and the intercepts
 * still has to know what to do with them, and the last thing they should see
 * is a correct sketch rather than three numbers.
 *
 * Two shapes, because the schemes buy different things:
 *
 *   2016 P1 Q10, 2026 P1 Q12   y = (x - h)^2 + k
 *     •¹ the turning point, •² a sketch with a *minimum* turning point
 *     consistent with it, •³ the y-intercept. No roots: k is positive in both
 *     papers, so the curve never crosses the x-axis, and asking for roots that
 *     do not exist is why this cannot share with the other two.
 *
 *   2018 P1 Q16, 2022 P1 Q14   y = (x - a)(x - b)
 *     •¹ the roots, •² the turning point *or* the y-intercept, •³ both of them
 *     and a consistently annotated sketch. Its note is strict: •³ is only
 *     available where the roots, the turning point and the y-intercept are all
 *     clearly marked.
 *
 * **Two figures per question, not one.** The completed-square scheme puts the
 * sketch at •², before the y-intercept is found, so the sketch shown at that
 * step marks the turning point only — showing the intercept there would hand
 * over the mark the pupil is meant to be left to earn.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const coord = (x: number, y: number) => `(${x}, ${y})`;

/** A window holding the curve, its features and the axes, with room to label. */
function windowFor(h: number, k: number, marks: { x: number; y: number }[]): View {
  const xs = [0, h, ...marks.map(p => p.x)];
  const half = Math.max(2.4, ...xs.map(x => Math.abs(x - h) + 1.6));
  const ys = [0, k, k + half * half, ...marks.map(p => p.y)];
  const yLo = Math.min(...ys), yHi = Math.max(...ys);
  const pad = Math.max(1.5, (yHi - yLo) * 0.14);
  return { xMin: h - half, xMax: h + half, yMin: yLo - pad, yMax: yHi + pad };
}

/** The finished drawing, as a step can carry it. */
function figureFor(spec: SketchAxesSpec): string | null {
  const fig = sketchAxes(spec);
  return verifyFigure(fig).length ? null : renderScene(fig.scene);
}

// ── y = (x - h)^2 + k, no roots — 2016 P1 Q10, 2026 P1 Q12 ───────────────

function sketchCompletedSquare(): Q | null {
  const h = nonZeroInt(-5, 5);
  const k = getRandomInt(1, 8);                 // positive, so there are no roots
  const c = h * h + k;                          // where it cuts the y-axis
  if (c > 40) return null;
  const sign = h < 0 ? `+ ${-h}` : `- ${h}`;
  const equation = `y = (x ${sign})^{2} + ${k}`;
  const onAxes = getRandomInt(0, 1) === 0;      // 2026 provides axes, 2016 does not

  const view = windowFor(h, k, [{ x: 0, y: c }]);
  const plot = { kind: 'parabola' as const, a: 1, h, k };
  // The sketch at •², carrying the turning point and nothing else: the
  // y-intercept is the mark after this one.
  const partial = figureFor({
    view, plot,
    points: [{ x: h, y: k, text: coord(h, k), side: 'right' }],
  });
  const complete = figureFor({
    view, plot,
    points: [
      { x: h, y: k, text: coord(h, k), side: 'right' },
      { x: 0, y: c, text: coord(0, c), side: h > 0 ? 'left' : 'right' },
    ],
  });
  const blank = onAxes ? figureFor({ view, plot: { kind: 'none' } }) : '';
  if (!partial || !complete || blank === null) return null;

  const prose = [
    `${onAxes ? 'On the axes below, sketch' : 'Sketch'} the graph of $${equation}$.`,
    ...(onAxes ? [blank] : []),
    'On your sketch, show clearly the coordinates of the turning point and the point of intersection with the y-axis.',
  ];
  const steps = [
    `<strong>1.</strong> The bracket is squared, so it is never negative and is smallest when it is zero — at $x = ${h}$. There $y = ${k}$, so the turning point is:<br><br>$${coord(h, k)}$`,
    `<strong>2.</strong> The coefficient of $x^{2}$ is positive, so it is a <strong>minimum</strong> and the curve opens upwards from that point:<br><br>${partial}`,
    `<strong>3.</strong> Put $x = 0$ to find where it cuts the y-axis:<br><br>$y = (0 ${sign})^{2} + ${k} = ${h * h} + ${k} = ${c}$, so it passes through $${coord(0, c)}$${complete}`,
  ];

  return {
    subTopic: 'Sketching a Parabola from Completed Square Form',
    difficulty: 'exam',
    variationId: 'quadratics.sketch-completed-square',
    questionLines: prose,
    boardQuestionLines: [`Sketch $${equation}$, showing the turning point and the y-intercept.`],
    solutionSteps: steps,
    // 2016 P1 Q10: •¹ the turning point, •² a sketch with a minimum turning
    // point consistent with it, •³ the y-intercept.
    stepMarks: [1, 1, 1],
    finalAnswer: `Turning point $${coord(h, k)}$, y-intercept $${coord(0, c)}$`,
  };
}

// ── y = (x - a)(x - b), roots first — 2018 P1 Q16, 2022 P1 Q14 ───────────

/**
 * Where this question's four labels may go, tried in order.
 *
 * **Scoped to this question on purpose.** `sketchAxes` gives every label one
 * fixed side, and a label whose side is taken — by the y-axis, the curve, or
 * another label — has nowhere else to go, so the whole figure is rejected and
 * the retry loop quietly draws a different question instead. Measured here, it
 * was expensive: of the **28 root pairs the constraints allow, only 6 could be
 * drawn**, and 800 generated questions produced those same 6 equations. Every
 * pair with two negative roots was among the 22 lost, so the topic never once
 * set a parabola sitting left of the y-axis.
 *
 * Letting this one question try ten arrangements takes it to **24 of 28**, and
 * rescues all four both-negative pairs.
 *
 * The general fix — candidate offsets inside `sketchAxes`, for every figure —
 * is still the right long-term answer and is still not taken, because a change
 * there lands on every sketched figure at once. `n5-coordinates-3d.ts` records
 * what that costs: sizing axes from the projected bounding box fixed one
 * figure and regressed `coords.pyramid-on-cube` to zero layouts. This buys
 * most of the variety for none of that risk.
 *
 * Order matters. The first plan is what shipped before, so a question that
 * placed cleanly already keeps the arrangement it had.
 */
const LABEL_PLANS: {
  roots: [Side, Side];
  turningPoint: Side;
  yIntercept: Side;
}[] = [
  { roots: ['below', 'below'], turningPoint: 'right', yIntercept: 'left'  },
  { roots: ['below', 'below'], turningPoint: 'left',  yIntercept: 'right' },
  { roots: ['above', 'below'], turningPoint: 'right', yIntercept: 'left'  },
  { roots: ['below', 'above'], turningPoint: 'right', yIntercept: 'left'  },
  { roots: ['above', 'below'], turningPoint: 'left',  yIntercept: 'right' },
  { roots: ['below', 'above'], turningPoint: 'left',  yIntercept: 'right' },
  { roots: ['below', 'below'], turningPoint: 'below', yIntercept: 'left'  },
  { roots: ['below', 'below'], turningPoint: 'below', yIntercept: 'right' },
  { roots: ['above', 'above'], turningPoint: 'below', yIntercept: 'left'  },
  { roots: ['above', 'above'], turningPoint: 'below', yIntercept: 'right' },
];

function sketchFactorised(): Q | null {
  const r1 = nonZeroInt(-6, 4);
  const r2 = r1 + 2 * getRandomInt(1, 5);       // an even gap, so the turning point is whole
  if (r2 > 7 || r1 === 0 || r2 === 0) return null;
  const h = (r1 + r2) / 2;
  // Roots symmetric about zero put the turning point *on* the y-axis, so the
  // turning point and the y-intercept become the same point and the question
  // has two features rather than three. 2016 P1 Q10's own note refuses the
  // mark in that case for the other shape; here it makes the question
  // pointless.
  if (h === 0) return null;
  const k = (h - r1) * (h - r2);                // negative: the curve dips below
  const c = r1 * r2;                            // the y-intercept
  if (Math.abs(k) > 30 || Math.abs(c) > 30) return null;

  const factor = (r: number) => (r < 0 ? `(x + ${-r})` : `(x - ${r})`);
  const equation = `y = ${factor(r1)}${factor(r2)}`;
  const onAxes = getRandomInt(0, 1) === 0;

  const view = windowFor(h, k, [{ x: r1, y: 0 }, { x: r2, y: 0 }, { x: 0, y: c }]);
  const plot = { kind: 'parabola' as const, a: 1, h, k };

  // •² is the turning point *or* the y-intercept, so the sketch at that step
  // carries the roots and the turning point; the intercept arrives at •³.
  //
  // Both figures are tried against LABEL_PLANS in order and the first
  // arrangement that places cleanly wins — see the note on LABEL_PLANS for why
  // one fixed arrangement was costing this question three quarters of itself.
  let partial = '', complete = '';
  for (const plan of LABEL_PLANS) {
    const marks = [
      { x: r1, y: 0, text: `${r1}`, side: plan.roots[0] },
      { x: r2, y: 0, text: `${r2}`, side: plan.roots[1] },
      { x: h, y: k, text: coord(h, k), side: plan.turningPoint },
    ];
    const withoutIntercept = figureFor({ view, plot, points: marks });
    if (!withoutIntercept) continue;
    const withIntercept = figureFor({
      view, plot,
      points: [...marks, { x: 0, y: c, text: `${c}`, side: plan.yIntercept }],
    });
    if (!withIntercept) continue;
    // Both steps must use the SAME arrangement, or the sketch appears to move
    // its own labels between •² and •³.
    partial = withoutIntercept;
    complete = withIntercept;
    break;
  }

  const blank = onAxes ? figureFor({ view, plot: { kind: 'none' } }) : '';
  if (!partial || !complete || blank === null) return null;

  const prose = [
    `${onAxes ? 'On the axes below, sketch' : 'Sketch'} the graph of $${equation}$.`,
    ...(onAxes ? [blank] : []),
    'On your sketch, show clearly the points of intersection with the x-axis and the y-axis, and the coordinates of the turning point.',
  ];
  const steps = [
    `<strong>1.</strong> The curve meets the x-axis where $y = 0$, which is where either bracket is zero:<br><br>$x = ${r1}$ and $x = ${r2}$`,
    `<strong>2.</strong> A parabola is symmetrical, so the turning point sits halfway between the roots:<br><br>$x = \\frac{${r1} + ${formatNum(r2)}}{2} = ${h}$, and there $y = ${k}$, giving $${coord(h, k)}$${partial}`,
    `<strong>3.</strong> Put $x = 0$ for the y-intercept, then mark all three on the sketch:<br><br>$y = ${factor(r1).replace('x', '0')}${factor(r2).replace('x', '0')} = ${c}$${complete}`,
  ];

  return {
    subTopic: 'Sketching a Parabola from Factorised Form',
    difficulty: 'exam',
    variationId: 'quadratics.sketch-factorised',
    questionLines: prose,
    boardQuestionLines: [`Sketch $${equation}$, showing the roots, the turning point and the y-intercept.`],
    solutionSteps: steps,
    // 2018 P1 Q16 and 2022 P1 Q14: •¹ the roots, •² the turning point or the
    // y-intercept, •³ both and a consistently annotated sketch. Its note is
    // strict — •³ needs all three clearly marked.
    stepMarks: [1, 1, 1],
    finalAnswer: `Roots $${r1}$ and $${r2}$, turning point $${coord(h, k)}$, y-intercept $${c}$`,
  };
}

// ── dispatch ─────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 4000; i++) {
    const made = make();
    if (made) return made;
  }
  throw new Error(`${name}: no valid question found`);
};

export const SKETCH_PARABOLA_GENERATORS: Record<string, () => Q> = {
  'Sketching a Parabola from Completed Square Form':
    tried('quadratics.sketch-completed-square', sketchCompletedSquare),
  'Sketching a Parabola from Factorised Form':
    tried('quadratics.sketch-factorised', sketchFactorised),
};

void pick;
