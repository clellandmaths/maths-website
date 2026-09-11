import { GeneratedQuestion } from './types';
import { getRandomInt, nonZeroInt } from './utils';
import { sketchAxes, type SketchAxesSpec, type View } from '../diagrams/shapes/sketch-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Reading a parabola's equation off its graph — six paper questions.
 *
 * These are the questions the shape library was missing, and they are cheaper
 * than the plan assumed: **not one of them is plotted on a grid.** Each prints
 * two arrowed axes, a smooth curve and one or two dots carrying their
 * coordinates, which is what `shapes/sketch-axes.ts` draws.
 *
 * Six questions, five shapes, because the exam prices them differently and each
 * asks for something the others do not:
 *
 *   2014 P1 Q7, 2026 P1 Q9   y = ax^2 through a marked point            2
 *   2025 P1 Q9               y = (x+a)^2 + b, read the turning point    2
 *   2015 P1 Q7               ... and the axis of symmetry               3
 *   2023 P1 Q4               ... and the y-intercept                    3
 *   2017 P1 Q14              the axis given, a point substituted for b  3
 *
 * **The sign of a is where every one of these is lost**, and the markschemes
 * say so out loud: 2025's note gives 0 for a = −5 with b = 3, and 2023 lists
 * "a = 3, b = 2" under commonly observed. The form is y = (x + a)^2 + b and the
 * turning point is at x = −a, so a turning point at −3 means a = 3 and one at
 * +3 means a = −3. The working says that in as many words rather than just
 * printing the answer.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** "(3, -5)" as the papers print it, for the prose. */
const coord = (x: number, y: number) => `(${x}, ${y})`;

/**
 * The same, for a label drawn on the figure.
 *
 * **Plain text, not LaTeX.** Nothing runs MathJax over an SVG label, so a
 * coordinate wrapped in dollars is printed with the dollars — which is what
 * the first contact sheet of these showed, three cards reading `$(1, -8)$`.
 * Every other shape in this library passes plain strings for the same reason.
 */
const plainCoord = (x: number, y: number) => `(${x}, ${y})`;

/**
 * A window holding the turning point, the axes and any marked points.
 *
 * Sized from the content rather than hand-picked, because the labels need room:
 * a turning point two units above the x-axis has its coordinates written into
 * the axis, which was the one figure the peek script could not place.
 */
function windowFor(h: number, k: number, extra: { x: number; y: number }[]): View {
  // How far out to go from the turning point.
  //
  // Driven by the depth, not by a fixed number. The x-axis has to be on the
  // page, so a turning point eight below it forces a window eight tall; sized
  // to a flat 2.2 either side the curve then climbs a third of the frame and
  // the drawing is a shallow dish. Going out past the roots — h +/- sqrt(|k|) —
  // makes the curve rise clear of the axis, which is what every paper prints.
  const depth = Math.sqrt(Math.abs(k)) + 1.4;
  const xs = [h, ...extra.map(p => p.x)];
  const half = Math.max(2.2, depth, ...xs.map(x => Math.abs(x - h) + 1.2));
  const xMin = h - half, xMax = h + half;
  const reach = half * half;
  const ys = [0, k, k + reach, ...extra.map(p => p.y)];
  const yLo = Math.min(...ys), yHi = Math.max(...ys);
  const yPad = Math.max(1.5, (yHi - yLo) * 0.12);
  return { xMin, xMax, yMin: yLo - yPad, yMax: yHi + yPad };
}

/** Build it, or reject the layout and let the caller draw again. */
function assemble(
  spec: SketchAxesSpec, subTopic: string, variationId: string,
  prose: string[], board: string, steps: string[], stepMarks: number[],
  finalAnswer: string,
): Q | null {
  const fig = sketchAxes(spec);
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;
  return {
    subTopic, difficulty: 'exam', variationId,
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [board],
    solutionSteps: steps, stepMarks, finalAnswer, figure: fig,
  };
}

// ── y = ax^2 through a marked point — 2014 P1 Q7, 2026 P1 Q9 ─────────────
//
// The only one of the six whose parabola has its turning point at the origin,
// and the only one asking for a stretch rather than a shift.

function parabolaScale(): Q | null {
  // `a` in six of the seven *Parabola Equation from Graph* papers, `k` in none.
  const letter = 'a';
  const a = getRandomInt(2, 9);
  const x = nonZeroInt(-4, 4);
  if (Math.abs(x) < 2) return null;               // x = ±1 makes a readable off the dot
  const y = a * x * x;

  const prose = [
    `The diagram shows part of the graph of $y = ${letter}x^{2}$.`,
    `The point $${coord(x, y)}$ lies on the graph.`,
    `Find the value of $${letter}$.`,
  ];
  const steps = [
    `<strong>1.</strong> The point is on the curve, so its coordinates fit the equation. Put $x = ${x}$ and $y = ${y}$ into $y = ${letter}x^{2}$:<br><br>$${y} = ${letter} \\times (${x})^{2} = ${x * x}${letter}$`,
    `<strong>2.</strong> Divide to find $${letter}$:<br><br>$${letter} = \\frac{${y}}{${x * x}} = ${a}$`,
  ];
  return assemble({
    view: windowFor(0, 0, [{ x, y }]),
    plot: { kind: 'parabola', a, h: 0, k: 0 },
    points: [{ x, y, text: plainCoord(x, y), side: x > 0 ? 'right' : 'left' }],
    curveLabel: `y = ${letter}x²`,
  }, 'A Parabola Through a Point', 'quadratics.parabola-scale', prose,
    `$y = ${letter}x^{2}$ passes through $${coord(x, y)}$. Find $${letter}$.`,
    steps, [1, 1], `$${letter} = ${a}$`);
}

// ── y = (x+a)^2 + b, read off the turning point ─────────────────────────
//
// Three questions on one figure, differing in what they go on to ask. The
// turning point is on the drawing and nowhere else, which is what makes the
// figure the question rather than an illustration of it.

type FromTurningPoint = 'plain' | 'axis' | 'intercept';

function parabolaFromTurningPoint(sort: FromTurningPoint): Q | null {
  const h = nonZeroInt(-5, 5);                    // turning point x, so a = -h
  const k = nonZeroInt(-8, 8);                    // turning point y, so b = k
  const a = -h;
  const c = h * h + k;                            // where it crosses the y-axis
  if (sort === 'intercept' && (c === k || Math.abs(c) > 40)) return null;

  const sign = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);
  const bracket = `(x ${sign(a)})^{2}`;
  const points: SketchAxesSpec['points'] = [
    { x: h, y: k, text: plainCoord(h, k), side: 'right' },
  ];
  if (sort === 'intercept') points.push({ x: 0, y: c, text: 'P', side: 'left' });

  const lead = sort === 'intercept'
    ? 'The graph below shows part of a parabola of the form $y = (x + a)^{2} + b$.'
    : `The ${pick(['graph', 'diagram'])} shows a parabola with equation of the form $y = (x + a)^{2} + b$.`;

  // •¹ and •² are the same two marks in all three papers, and the sign of a is
  // where they are lost: the scheme's own note gives nothing for a = k, b = h.
  const aStep =
    `<strong>1.</strong> The turning point of $y = (x + a)^{2} + b$ is where the bracket is zero, at $x = -a$. Here the turning point is at $x = ${h}$:<br><br>$-a = ${h}$, so $a = ${a}$`;
  const bStep =
    `<strong>2.</strong> At the turning point the bracket is zero, so $y = b$ there. The turning point is at $y = ${k}$:<br><br>$b = ${k}$`;

  const prose: string[] = [lead];
  const steps = [aStep, bStep];
  const marks = [1, 1];
  let answer: string;
  let subTopic: string, id: string;

  if (sort === 'plain') {
    prose.push('', '<b>(a)</b>&nbsp;&nbsp;State the value of $a$.',
      '<b>(b)</b>&nbsp;&nbsp;State the value of $b$.');
    answer = `(a) $a = ${a}$<br>(b) $b = ${k}$`;
    subTopic = 'A Parabola from its Turning Point';
    id = 'quadratics.parabola-from-turning-point';
  } else if (sort === 'axis') {
    prose.push(`The minimum turning point $${coord(h, k)}$ is shown.`, '',
      '<b>(a)</b>&nbsp;&nbsp;State the values of (i) $a$ and (ii) $b$.',
      '<b>(b)</b>&nbsp;&nbsp;Write down the equation of the axis of symmetry of the graph.');
    steps.push(`<strong>3.</strong> The axis of symmetry is the vertical line through the turning point:<br><br>$x = ${h}$`);
    marks.push(1);
    answer = `(a)(i) $a = ${a}$, (ii) $b = ${k}$<br>(b) $x = ${h}$`;
    subTopic = 'A Parabola and its Axis of Symmetry';
    id = 'quadratics.parabola-with-axis';
  } else {
    prose.push('', '<b>(a)</b>&nbsp;&nbsp;(i) State the value of $a$.',
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ii) State the value of $b$.',
      `<b>(b)</b>&nbsp;&nbsp;P is the point $(0, c)$. Find the value of $c$.`);
    steps.push(`<strong>3.</strong> P is on the y-axis, so put $x = 0$ into the equation:<br><br>$c = (0 ${sign(a)})^{2} ${k < 0 ? '-' : '+'} ${Math.abs(k)} = ${h * h} ${k < 0 ? '-' : '+'} ${Math.abs(k)} = ${c}$`);
    marks.push(1);
    answer = `(a)(i) $a = ${a}$, (ii) $b = ${k}$<br>(b) $c = ${c}$`;
    subTopic = 'A Parabola and its y-intercept';
    id = 'quadratics.parabola-y-intercept';
  }

  return assemble({
    view: windowFor(h, k, sort === 'intercept' ? [{ x: 0, y: c }] : []),
    plot: { kind: 'parabola', a: 1, h, k },
    points,
  }, subTopic, id, prose,
    `Parabola $y = ${bracket} ${k < 0 ? '-' : '+'} ${Math.abs(k)}$ shown with its turning point. Find $a$ and $b$.`,
    steps, marks, answer);
}

// ── the axis given, a point substituted for b — 2017 P1 Q14 ─────────────
//
// The one that runs the other way: the axis of symmetry is stated in the prose,
// which hands over a without the drawing, and then a marked point is
// substituted to reach b. Its note allows part (b) to be followed through from
// a wrong a, which is why the working substitutes rather than reading b off.

function parabolaFromAxis(): Q | null {
  const h = nonZeroInt(-6, 6);                    // the axis of symmetry, x = h
  const a = -h;
  const k = nonZeroInt(-6, 9);                    // b
  const d = pick([-2, -1, 1, 2]);                 // how far the marked point sits along
  const px = h + d;
  const py = d * d + k;
  if (px === 0) return null;                      // a point on the y-axis reads as the intercept

  const sign = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);
  const prose = [
    'The graph shows a parabola with equation of the form $y = (x + a)^{2} + b$.',
    `The equation of the axis of symmetry of the parabola is $x = ${h}$.`,
    '',
    '<b>(a)</b>&nbsp;&nbsp;State the value of $a$.',
    `<b>(b)</b>&nbsp;&nbsp;The point $${coord(px, py)}$ lies on the parabola. Calculate the value of $b$.`,
  ];
  const steps = [
    `<strong>1. (a)</strong> The axis of symmetry runs through the turning point, at $x = -a$:<br><br>$-a = ${h}$, so $a = ${a}$`,
    `<strong>2. (b)</strong> The point is on the curve, so substitute it into $y = (x ${sign(a)})^{2} + b$:<br><br>$${py} = (${px} ${sign(a)})^{2} + b = (${d})^{2} + b = ${d * d} + b$`,
    `<strong>3. (b)</strong> Solve for $b$:<br><br>$b = ${py} - ${d * d} = ${k}$`,
  ];
  return assemble({
    view: windowFor(h, k, [{ x: px, y: py }]),
    plot: { kind: 'parabola', a: 1, h, k },
    points: [{ x: px, y: py, text: plainCoord(px, py), side: d > 0 ? 'right' : 'left' }],
  }, 'A Parabola from its Axis of Symmetry', 'quadratics.parabola-from-axis', prose,
    `Parabola $y = (x + a)^{2} + b$, axis $x = ${h}$, through $${coord(px, py)}$. Find $a$ and $b$.`,
    // 2017 P1 Q14 is 1 + 2: •¹ state a, •² substitute the point, •³ state b
    steps, [1, 1, 1], `(a) $a = ${a}$<br>(b) $b = ${k}$`);
}

// ── a maximum turning point, axis first — 2019 P1 Q9 ────────────────────
//
// The only one of the seven whose parabola opens *downwards*, and the only one
// asking for the axis of symmetry before the equation rather than after. Its
// form has the square subtracted — y = b - (x - a)^2 — so b is the height of
// the maximum, and the sign trap runs the other way from the other six.
//
// **The form is y = b - (x + a)^2, so a = -h**, the same sign rule as the other
// six. It briefly looked as though the paper data and the marking instructions
// disagreed — the extracted text of the scheme reads "a = 4" — but that PDF's
// text extraction **drops minus signs**: the same page renders Q13's answer
// (135, -3) as ", 3". The scheme says a = -4, and its own Note 1 confirms it,
// since y = 20 - (x - 4)^2 is that curve written out. Never take a sign from
// extracted markscheme text.

function parabolaMaximum(): Q | null {
  const h = getRandomInt(2, 7);                   // the axis of symmetry, x = h
  const k = pick([8, 10, 12, 16, 18, 20, 24, 25, 30, 36]);   // the maximum height
  const a = -h;

  // The window has to hold the y-axis, since the curve crosses it and the
  // paper's figure shows that crossing. Out to the roots either side of the
  // turning point, which is where a downward parabola meets the x-axis.
  const reach = Math.sqrt(k) + 1.1;
  const xMin = Math.min(-0.7, h - reach), xMax = h + reach;
  const drop = Math.max((xMax - h) ** 2, (h - xMin) ** 2);
  const yLo = k - drop, yHi = k;
  const pad = Math.max(1.5, (yHi - yLo) * 0.14);
  const view: View = { xMin, xMax, yMin: yLo - pad, yMax: yHi + pad };

  const form = 'y = b - (x + a)^{2}';
  const prose = [
    'The graph shows a parabola.',
    '',
    `The maximum turning point has coordinates $${coord(h, k)}$ as shown in the diagram.`,
    '',
    '<b>(a)</b>&nbsp;&nbsp;Write down the equation of the axis of symmetry of the graph.',
    '',
    `The equation of the parabola is of the form $${form}$.`,
    '',
    '<b>(b)</b>&nbsp;&nbsp;State the values of (i) $a$ and (ii) $b$.',
  ];
  const steps = [
    `<strong>1. (a)</strong> The axis of symmetry is the vertical line through the turning point, so it takes the turning point's $x$-coordinate:<br><br>$x = ${h}$`,
    `<strong>2. (b)(i)</strong> The square is subtracted, so $y$ is largest when the bracket is zero — and that is where the turning point is, at $x = ${h}$:` +
    `<br><br>$${h} + a = 0$, so $a = ${a}$`,
    // The scheme's own Note 1: writing the equation out earns both marks, so a
    // pupil should be told that rather than left thinking only two bare numbers
    // will do.
    `<strong>3. (b)(ii)</strong> With the bracket zero, $y = b$ there, and the turning point is at a height of ${k}:<br><br>$b = ${k}$` +
    `<br><br>Writing the equation out as $y = ${k} - (x - ${h})^{2}$ is also accepted for both marks.`,
  ];
  return assemble({
    view,
    plot: { kind: 'parabola', a: -1, h, k },
    points: [{ x: h, y: k, text: plainCoord(h, k), side: 'above' }],
  }, 'A Parabola with a Maximum Turning Point', 'quadratics.parabola-maximum', prose,
    `Parabola $${form}$ with maximum at $${coord(h, k)}$. Find the axis of symmetry, $a$ and $b$.`,
    // 2019 P1 Q9 is 1 + 1 + 1: •¹ the axis, •² a, •³ b
    steps, [1, 1, 1],
    `(a) $x = ${h}$<br>(b)(i) $a = ${a}$, (ii) $b = ${k}$`);
}

// ── complete the square, the turning point, then a related point — 2024 P1 Q12
//
// **The whole of 2024 P1 Q12, all three parts.** `quadratics.turning-point`
// produces parts (a) and (b) and cited this question for them, declaring the
// difference through `marksDiffer` — which is the mechanism for *the same shape
// priced differently across papers*, not for a question only partly cloned. A
// pupil asking for 2024 P1 Q12 got three of its five marks.
//
// Part (c) is the piece nothing else here teaches: PQ is horizontal with P on
// the y-axis and both ends on the curve, so **Q is P reflected in the axis of
// symmetry**. The scheme buys the x and the y separately. It is the only place
// in the course where the axis of symmetry is used to find a point rather than
// to be stated.

function turningPointAndPoint(): Q | null {
  // y = (x - h)^2 + k, expanded to x^2 - 2hx + (h^2 + k). P is (0, h^2 + k) and
  // Q its mirror at x = 2h, so h must be positive for Q to sit to the right of
  // P as the paper draws it.
  const h = getRandomInt(2, 6);
  const k = nonZeroInt(-9, -1);            // negative, so the curve cuts the axis
  const c = h * h + k;                     // the y-intercept, which is P
  if (c <= 0) return null;                 // P has to be above the origin
  const qx = 2 * h;

  const expr = `x^{2} - ${2 * h}x + ${c}`;
  const prose = [
    `<b>(a)</b>&nbsp;&nbsp;Express $${expr}$ in the form $(x - a)^{2} + b$.`,
    `<b>(b)</b>&nbsp;&nbsp;Hence, or otherwise, state the coordinates of the turning point of the graph of $y = ${expr}$.`,
    `The diagram shows the graph of $y = ${expr}$. A line PQ has been drawn parallel to the x-axis, where:`,
    '&bull;&nbsp;&nbsp;P lies on the y-axis',
    `&bull;&nbsp;&nbsp;P and Q lie on the graph of $y = ${expr}$.`,
    '<b>(c)</b>&nbsp;&nbsp;Find the coordinates of Q.',
  ];
  const steps = [
    `<strong>1. (a)</strong> Halve the coefficient of $x$ for the bracket, then take off what squaring it adds:` +
    `<br><br>$(x - ${h})^{2}$ gives $x^{2} - ${2 * h}x + ${h * h}$, which is ${h * h - c === 0 ? 'already right' : `${Math.abs(h * h - c)} too ${h * h > c ? 'much' : 'little'}`}`,
    `<strong>2. (a)</strong> So the completed square is:<br><br>$(x - ${h})^{2} ${k < 0 ? '-' : '+'} ${Math.abs(k)}$`,
    `<strong>3. (b)</strong> The bracket is smallest when it is zero, at $x = ${h}$, and there $y = ${k}$:` +
    `<br><br>$(${h}, ${k})$`,
    `<strong>4. (c)</strong> P is on the y-axis, so put $x = 0$: $y = ${c}$, giving P$(0, ${c})$. PQ is horizontal, so Q is at the same height — and a parabola is symmetrical about $x = ${h}$, so Q is as far to the right of it as P is to the left:` +
    `<br><br>$x = 2 \\times ${h} = ${qx}$`,
    `<strong>5. (c)</strong> Q is on the same horizontal line as P, so it has P's $y$:<br><br>$Q(${qx}, ${c})$`,
  ];

  const view = windowFor(h, k, [{ x: 0, y: c }, { x: qx, y: c }]);
  const fig = sketchAxes({
    view,
    plot: { kind: 'parabola', a: 1, h, k },
    points: [
      { x: 0, y: c, text: 'P', side: 'left' },
      { x: qx, y: c, text: 'Q', side: 'right' },
    ],
    chord: { from: { x: 0, y: c }, to: { x: qx, y: c } },
  });
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'A Turning Point and a Related Point',
    difficulty: 'exam',
    variationId: 'quadratics.turning-point-related',
    questionLines: [...prose.slice(0, 2), renderScene(fig.scene), ...prose.slice(2)],
    boardQuestionLines: [
      `$y = ${expr}$. Complete the square, state the turning point, then find Q where PQ is horizontal and P is on the y-axis.`,
    ],
    solutionSteps: steps,
    // 2024 P1 Q12: (a) 2 - the bracket, then the process completed;
    // (b) 1 - the coordinates; (c) 2 - the x, then the y.
    stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `(a) $(x - ${h})^{2} ${k < 0 ? '-' : '+'} ${Math.abs(k)}$<br>(b) $(${h}, ${k})$<br>(c) $(${qx}, ${c})$`,
    figure: fig,
  };
}

// ── dispatch ─────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 4000; i++) {
    const q = make();
    if (q) return q;
  }
  throw new Error(`${name}: no valid question found`);
};

export const PARABOLA_GRAPH_GENERATORS: Record<string, () => Q> = {
  'A Parabola Through a Point': tried('quadratics.parabola-scale', parabolaScale),
  'A Parabola from its Turning Point':
    tried('quadratics.parabola-from-turning-point', () => parabolaFromTurningPoint('plain')),
  'A Parabola and its Axis of Symmetry':
    tried('quadratics.parabola-with-axis', () => parabolaFromTurningPoint('axis')),
  'A Parabola and its y-intercept':
    tried('quadratics.parabola-y-intercept', () => parabolaFromTurningPoint('intercept')),
  'A Parabola from its Axis of Symmetry':
    tried('quadratics.parabola-from-axis', parabolaFromAxis),
  'A Parabola with a Maximum Turning Point':
    tried('quadratics.parabola-maximum', parabolaMaximum),
  'A Turning Point and a Related Point':
    tried('quadratics.turning-point-related', turningPointAndPoint),
};
