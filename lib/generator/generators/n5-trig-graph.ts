import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { sketchAxes, type SketchAxesSpec } from '../diagrams/shapes/sketch-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Reading a trigonometric graph — eight paper questions.
 *
 * The last of the "needs the grid" group, and the second time reading the
 * questions brought that estimate down: **none of these is gridded either.**
 * 2015 P1 Q6 carries a 4, a 0, a -4 and a 360 and nothing else; 2019 P1 Q13
 * carries no numbers at all, because its equation is in the prose and the
 * pupil computes the turning point rather than reading it. So they are drawn on
 * `sketch-axes.ts`, which grew a trigonometric plot and a few numbered ticks
 * rather than a grid.
 *
 * Four shapes, and the difference is what the pupil has to read:
 *
 *   2015 P1 Q6, 2018 P1 Q6,    y = a sin bx, y = a cos bx
 *   2022 P1 Q8, 2024 P1 Q8     the amplitude off the y-axis, and b by counting
 *                              cycles across 360
 *   2014 P1 Q10                y = a sin(x + b), where b is a shift left and
 *                              has to be read off where the curve crosses
 *   2023 P1 Q13                y = cos(x + a) + b, a shift left *and* up
 *   2019 P1 Q13, 2025 P1 Q8    the equation is given; state the turning point
 *
 * **b is the number of cycles, not the period**, and that is the whole of the
 * first shape: a graph completing four waves between 0 and 360 has b = 4. The
 * working says it that way round rather than dividing 360 by a period, because
 * counting the waves is what the picture is for.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** The window every one of these uses: a full turn, with room past it. */
/**
 * The window. `span` is how far along the x-axis the question runs, and the
 * margins scale with it - they are the 0..360 window's own proportions.
 */
const view = (amp: number, lo = -amp, hi = amp, span = 360) => ({
  xMin: -0.0944 * span, xMax: 1.0889 * span,
  yMin: lo - amp * 0.42, yMax: hi + amp * 0.42,
});

const DEGREES: [number, number] = [0, 360];

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

// ── y = a sin bx, y = a cos bx — 2015 P1 Q6, 2018 P1 Q6, 2022, 2024 ──────

function amplitudeAndCycles(): Q | null {
  const a = getRandomInt(2, 8);
  const b = pick([2, 3, 4, 5, 6, 8]);
  const period = 360 / b;

  /**
   * **Six and eight waves cannot be counted, so they are never asked to be.**
   *
   * They had never actually been drawn. Measured over 1200 draws, the
   * count-the-waves presentation produced *b* = 2, 3, 4 and 5 and **never once
   * 6 or 8**: `verifyFigure` rejected every dense curve and the retry loop
   * quietly redrew, so the declared set and the drawn set had disagreed all
   * along and nothing said so. Eight crests across a full turn leave the "360"
   * nowhere to stand, and a period tick among them sits in the wave train
   * whichever side of the axis it is put.
   *
   * **The answer was the part-domain drawing all along.** An earlier fix widened
   * the frame and measured the period with a bracket underneath; that has been
   * removed. A dense wave is now drawn over one period only - 45 degrees for
   * *b* = 8 - which is exactly what 2022 P1 Q8 does, and one wave drawn wide has
   * all the room in the world for a plain tick. This comment used to end by
   * naming that option and the one thing it needed, "the answer check taught to
   * count waves against the span drawn rather than against a full turn"; that
   * is done, in `n5-trig-graph-answers.ts`.
   *
   * So `dense` no longer changes how the figure is drawn. It survives as the
   * gate below: six or eight waves must take the period route, because counting
   * them is what does not work.
   */
  const dense = b >= 6;

  /**
   * **Which of the two presentations.** The four papers do not ask this the
   * same way, and the clone used to know only one of them:
   *
   *   2015 P1 Q6, 2024 P1 Q8   nothing on the x-axis but 360 — count the waves
   *   2018 P1 Q6               90 and 180 labelled — read the period, divide
   *   2022 P1 Q8               45 labelled — same
   *
   * `b` is the same number either way, but *how it is got* is the whole second
   * mark, and counting six waves is a different task from dividing 360 by 45.
   */
  const scaled = dense || (period >= 90 && getRandomInt(0, 1) === 0);

  /**
   * On a scaled axis the choice of sine or cosine is **not free**, and this is
   * the reason the presentation was missing rather than merely unwritten.
   *
   * A number under the period tick has to clear the curve. Measured across
   * every amplitude, and the answer does not depend on `a` at all: a cosine
   * clears it for *b* = 2, 3, 4 and a sine only from *b* = 4 up. A long period
   * keeps a cosine's crest wide enough to sit under, which is what the scaled
   * presentation needs — so the pair is picked from `b` rather than the draw
   * being retried until it happens to fit. **Retrying is what hid this**: it
   * looks identical to a mix that simply never chose those values.
   */
  const fn = !scaled ? pick(['sin', 'cos'] as const)
    : b <= 3 ? 'cos'
    : b === 4 ? pick(['sin', 'cos'] as const)
    : 'sin';

  /** Whether the scale shows the half-period too, as 2018 P1 Q6's does. */
  const twoTicks = getRandomInt(0, 1) === 0;

  // 2022 P1 Q8 and 2024 P1 Q8 ask in two parts, the other two in one; both are
  // two marks and the same two, so the wording is what varies.
  const split = getRandomInt(0, 1) === 0;
  const eq = `y = ${a}\\${fn} ${b}x^{\\circ}`;
  const shown = `y = a\\${fn} bx^{\\circ}`;

  const prose = split
    ? [`Part of the graph of $${shown}$ is shown in the diagram.`, '',
       '<b>(a)</b>&nbsp;&nbsp;State the value of $a$.',
       '<b>(b)</b>&nbsp;&nbsp;State the value of $b$.']
    : [`Part of the graph of $${shown}$ is shown in the diagram.`, '',
       'State the values of $a$ and $b$.'];
  const steps = [
    `<strong>1.</strong> $a$ is the amplitude — how far the curve reaches above and below the $x$-axis. Reading it off the $y$-axis:<br><br>$a = ${a}$`,
    scaled
      ? `<strong>2.</strong> One complete wave takes $${period}^{\\circ}$, so that is the period. $b$ is how many of them fit into a full turn:<br><br>$b = \\frac{360}{${period}} = ${b}$`
      : `<strong>2.</strong> $b$ is the number of complete waves between $0^{\\circ}$ and $360^{\\circ}$. Counting them:<br><br>$b = ${b}$`,
  ];
  /**
   * **How far the question is drawn, and it is not always a full turn.**
   *
   * The papers that number the period draw only as far as they number: 2022 P1
   * Q8 runs 0 to 45 and shows exactly one wave, 2018 P1 Q6 runs 0 to 180 and
   * shows two. That is deliberate difficulty rather than a saving of ink - a
   * pupil cannot fall back on counting waves in a full turn and has to take the
   * period off the scale and divide. The counting presentation keeps its whole
   * 360, so both routes to `b` survive, which is what the four papers between
   * them ask for.
   *
   * It also retires `dense`. Five to eight waves squeezed across a full turn is
   * what left no room to number the axis at all; one wave drawn wide has room
   * for a plain tick, so the wider frame and the period bracket under the curve
   * go with it.
   */
  const span = scaled ? (twoTicks && period * 2 <= 360 ? period * 2 : period) : 360;
  return assemble({
    view: view(a, -a, a, span), domain: [0, span],
    plot: { kind: 'trig', fn, a, b, h: 0, k: 0 },
    // 2018 P1 Q6 prints the half-period as well as the period, which is what
    // makes its 90 and 180 read as a scale rather than as one stray number;
    // 2022 P1 Q8 prints the period alone. Both are drawn, and the pair only
    // where there is room for it: at *b* = 5 the two numbers are 36° apart,
    // which `verifyFigure` passes on a hair and the eye reads as the single
    // blob "36 72". Found by looking at it, which was the only way it was ever
    // going to be found.
    ticks: {
      x: !scaled ? [360] : span === period * 2 ? [period, period * 2] : [period],
      y: [a, 0, -a],
    },
  }, 'Amplitude and Period of a Trigonometric Graph', 'trig-graphs.amplitude-cycles',
    prose, `$${shown}$ shown. Find $a$ and $b$.`,
    // •¹ a, •² b — one mark each in all four papers
    steps, [1, 1], split ? `(a) $a = ${a}$<br>(b) $b = ${b}$` : `$a = ${a}$, $b = ${b}$`);
}

// ── y = a sin(x + b) — 2014 P1 Q10 ──────────────────────────────────────
//
// The shift is read off where the curve crosses zero on the way up, which for
// a sine is at x = -b. So the degree scale has to be on the page, and this is
// the one question in the eight that needs it.

function amplitudeAndShift(): Q | null {
  const fn = pick(['sin', 'cos'] as const);
  const a = getRandomInt(2, 6);
  /**
   * The shift the quarter-turn scale can actually show.
   *
   * This clone used to print **"(60, 5)" beside the marked point**, which
   * handed over $b$ and made the second mark nearly free. 2014 P1 Q10 marks
   * the point and prints a scale, and the mark is for reading one off the
   * other — so the point is now marked and not named, and the axis carries
   * 90, 180, 270, 360.
   *
   * Three things pin the shift to 45 and 135, and each ruled out candidates:
   *
   * - **It has to be readable.** On an axis ticked every 90°, a pupil can read
   *   a tick or the exact midpoint between two and nothing else. The old set
   *   was 20, 30, 40, 45, 50, 60 — no sensible scale shows most of those.
   * - **No labelled tick may sit on a crossing.** Where the curve cuts the
   *   axis it is nearly vertical, so it passes through the label's place on
   *   *both* sides and no offset clears it. Measured: with any tick on a
   *   crossing, **0 of 60 layouts verified**. A shift that is a multiple of 90
   *   puts a crossing on a tick, which is why 90 is not here. At 45 and 135
   *   the curve is 0·707a from the axis at every labelled tick — as far from
   *   it as it ever gets.
   * - **The answer has to be the one that is drawn.** $\\sin(x - 315)$ and
   *   $\\sin(x + 45)$ are the same curve, so a shift past 180 has a second,
   *   smaller answer a pupil would reasonably give and be marked wrong for.
   */
  const shift = pick([45, 135]);
  const b = -shift;                              // y = a sin(x + b), shifted right
  const eq = `y = a\\${fn}(x + b)^{\\circ}`;

  const prose = [
    `The graph of $${eq}$, $0 \\le x \\le 360$, is shown below.`,
    '',
    'Write down the values of $a$ and $b$.',
  ];
  const steps = [
    `<strong>1.</strong> $a$ is the amplitude — how far the curve reaches above and below the $x$-axis:<br><br>$a = ${a}$`,
    `<strong>2.</strong> $b$ shifts the graph sideways. An unshifted $\\${fn}$ graph ${fn === 'sin' ? 'crosses zero going upwards at $x = 0$' : 'has its maximum at $x = 0$'}. Read the marked ${fn === 'sin' ? 'crossing' : 'peak'} off the scale: it is at $x = ${shift}^{\\circ}$, so the graph has moved ${shift} to the right:<br><br>$b = ${b}$`,
  ];
  return assemble({
    view: view(a), domain: DEGREES,
    plot: { kind: 'trig', fn, a, b: 1, h: shift, k: 0 },
    // Marked, not named: naming it is the answer.
    points: [{ x: shift, y: fn === 'sin' ? 0 : a, text: '' }],
    ticks: { x: [45, 90, 135, 180, 225, 270, 315, 360], y: [a, 0, -a] },
    xTickRotate: true,
  }, 'A Shifted Trigonometric Graph', 'trig-graphs.shift',
    prose, `$${eq}$ shown. Find $a$ and $b$.`,
    steps, [1, 1], `$a = ${a}$, $b = ${b}$`);
}

// ── y = cos(x + a) + b — 2023 P1 Q13 ────────────────────────────────────
//
// A shift sideways *and* upwards, so neither value can be read off the
// amplitude: b is how far the whole wave has risen, which the paper's own
// figure shows by putting the minimum on the x-axis rather than below it.

function shiftAndRaise(): Q | null {
  const fn = pick(['sin', 'cos'] as const);
  // Only shifts a pupil can actually read off this axis.
  //
  // The figure ticks the x-axis at 0, 90, 180, 270, 360 and marks no point on
  // the curve, so the only positions that can be *read* are a tick itself or
  // the exact midpoint between two. 30 and 60 were in this list and are
  // neither — they sit a third and two thirds through the first interval, and
  // nobody can tell those apart by eye. Half the questions this made could not
  // be answered from the information given.
  //
  // The paper is the check on this: 2023 P1 Q13's answer is -45, exactly the
  // midpoint, which is the only offset under 90 that this axis can show.
  const shift = pick([45, 90, 135, 180]);
  const a = -shift;
  const b = getRandomInt(1, 4);                  // lifted so the minimum sits at b - 1

  const prose = [
    `Part of the graph of $y = \\${fn}(x + a)^{\\circ} + b$ is shown.`,
    '',
    '<b>(a)</b>&nbsp;&nbsp;State the value of $a$.',
    '<b>(b)</b>&nbsp;&nbsp;State the value of $b$.',
  ];
  const steps = [
    `<strong>1.</strong> $a$ shifts the graph sideways. An unshifted $\\${fn}$ graph has its ${fn === 'cos' ? 'maximum' : 'first upward crossing'} at $x = 0$; here it is at $x = ${shift}^{\\circ}$, so the graph has moved ${shift} to the right:<br><br>$a = ${a}$`,
    `<strong>2.</strong> $b$ lifts the whole wave. A $\\${fn}$ graph runs between $-1$ and $1$; this one runs between $${b - 1}$ and $${b + 1}$, so it has been raised by:<br><br>$b = ${b}$`,
  ];
  return assemble({
    view: view(1, b - 1, b + 1), domain: DEGREES,
    plot: { kind: 'trig', fn, a: 1, b: 1, h: shift, k: b },
    ticks: { x: [0, 90, 180, 270, 360], y: [b - 1, b, b + 1].filter(v => v !== 0) },
    xTickSuffix: '°',
  }, 'A Raised Trigonometric Graph', 'trig-graphs.shift-and-raise',
    prose, `$y = \\${fn}(x + a)^{\\circ} + b$ shown. Find $a$ and $b$.`,
    // 2023 P1 Q13 is 1 + 1
    steps, [1, 1], `(a) $a = ${a}$<br>(b) $b = ${b}$`);
}

// ── the equation given, state a turning point — 2019 P1 Q13, 2025 P1 Q8 ──
//
// The only two that print no numbers on the figure at all, because there is
// nothing to read: the equation is in the prose and the turning point is
// computed from it. The graph is there to say *which* turning point.

function turningPoint(): Q | null {
  const fn = pick(['sin', 'cos'] as const);
  const a = getRandomInt(2, 6);
  const shift = pick([30, 45, 60, 90]);
  const wantMax = getRandomInt(0, 1) === 0;
  const sign = shift < 0 ? `- ${-shift}` : `+ ${shift}`;
  void sign;
  // y = a fn(x - shift). A sine peaks a quarter turn after its crossing; a
  // cosine peaks at its own shift.
  const peak = fn === 'cos' ? shift : shift + 90;
  const trough = peak + 180;
  const at = wantMax ? peak : trough;
  if (at > 360 || at < 0) return null;
  const y = wantMax ? a : -a;

  // printed as (x - shift) since a positive shift moves the graph right
  const eq = `y = ${a}\\${fn}(x - ${shift})^{\\circ}`;
  const prose = [
    `Part of the graph of $${eq}$ is shown in the diagram.`,
    '',
    `The graph has a ${wantMax ? 'maximum' : 'minimum'} turning point at $A$.`,
    'State the coordinates of $A$.',
  ];
  const steps = [
    `<strong>1.</strong> The graph is $y = ${a}\\${fn} x^{\\circ}$ moved ${shift} to the right. An unshifted $\\${fn}$ graph has its ${wantMax ? 'maximum' : 'minimum'} at $x = ${fn === 'cos' ? (wantMax ? 0 : 180) : (wantMax ? 90 : 270)}^{\\circ}$, so this one has it ${shift} further on:<br><br>$x = ${fn === 'cos' ? (wantMax ? 0 : 180) : (wantMax ? 90 : 270)} + ${shift} = ${at}$`,
    `<strong>2.</strong> The amplitude is ${a}, so the ${wantMax ? 'maximum' : 'minimum'} value is $${y}$:<br><br>$A(${at}, ${y})$`,
  ];
  return assemble({
    view: view(a), domain: DEGREES,
    plot: { kind: 'trig', fn, a, b: 1, h: shift, k: 0 },
    points: [{ x: at, y, text: 'A', side: wantMax ? 'above' : 'below' }],
  }, 'A Turning Point on a Trigonometric Graph', 'trig-graphs.turning-point',
    prose, `$${eq}$. State the coordinates of its ${wantMax ? 'maximum' : 'minimum'}.`,
    steps, [1, 1], `$A(${at}, ${y})$`);
}

// ── dispatch ─────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 4000; i++) {
    const made = make();
    if (made) return made;
  }
  throw new Error(`${name}: no valid question found`);
};

export const TRIG_GRAPH_GENERATORS: Record<string, () => Q> = {
  'Amplitude and Period of a Trigonometric Graph':
    tried('trig-graphs.amplitude-cycles', amplitudeAndCycles),
  'A Shifted Trigonometric Graph': tried('trig-graphs.shift', amplitudeAndShift),
  'A Raised Trigonometric Graph': tried('trig-graphs.shift-and-raise', shiftAndRaise),
  'A Turning Point on a Trigonometric Graph':
    tried('trig-graphs.turning-point', turningPoint),
};
