import { GeneratedQuestion } from './types';
import { getRandomInt, gcd } from './utils';
import { withUnit } from './n5-contexts';
import { sketchAxes, type SketchAxesSpec, type View } from '../diagrams/shapes/sketch-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * A quadratic in a real context, with a graph beside it — two paper questions.
 *
 *   2014 P1 Q13   a rocket, $h(t) = 16t - t^2$        4 + 3
 *   2019 P1 Q15   a ball off a clifftop, $h = 12t - 5t^2$   1 + 4
 *
 * **The graph is not read, and that is the point of drawing it anyway.** Both
 * questions state the equation in the prose and every mark is algebra, so the
 * picture decides nothing — which is exactly why the plan filed these under
 * "a graph that is decoration around a stated equation". But a question that
 * opens "the diagram below shows the path of a small rocket" and shows nothing
 * is not the question, and it is the same judgement that deferred the scatter
 * five until a real scatter could be drawn.
 *
 * The two differ in where the ground is, and it changes the algebra:
 *
 * - The rocket **comes back to where it started**, so its equation is set
 *   equal to a positive height and the quadratic has two positive roots. The
 *   first is the answer, which is why the paper says "first be at a height of".
 * - The ball is kicked from a clifftop and **lands below its start**, so its
 *   equation is set equal to a *negative* number — the sea, 17 m down — and the
 *   root to reject is negative rather than late. The dashed line across the
 *   graph at -17 is what says so, and `sketch-axes` grew a `guide` for it.
 *
 * Both are built answer-first, and have to be: the schemes buy a factorisation,
 * so the quadratic must factorise over the integers. The roots are chosen and
 * the trajectory solved back from them.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

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

// ── the rocket — 2014 P1 Q13 ─────────────────────────────────────────────

/**
 * Each carries its own two sentences.
 *
 * The thing thrown, what its height is measured from, and the verb all have to
 * agree — "the path of a small rocket which is fired into the air" does not
 * survive having "ball" substituted into it.
 */
const LAUNCHED: {
  opening: string; noun: string; verb: string;
  /**
   * How high this thing can plausibly go, in metres.
   *
   * Not decoration. Without a band the generator drew "a ball thrown straight
   * up from level ground" reaching **121 metres**, which no one has ever done;
   * the paper's own small rocket reaches 64. It is the same fault the line
   * graphs had when a pupil scored 106 out of 100, and it is only ever visible
   * by reading the finished sheet.
   */
  peak: [number, number];
}[] = [
  { noun: 'flare', verb: 'fired', peak: [30, 260],
    opening: 'The diagram below shows the path of a flare fired straight up from a hillside.' },
  { noun: 'firework', verb: 'launched', peak: [40, 260],
    opening: 'The diagram below shows the path of a firework which is launched from level ground.' },
  { noun: 'ball', verb: 'thrown', peak: [9, 30],
    opening: 'The diagram below shows the path of a ball which is thrown straight up from level ground.' },
  { noun: 'signal flare', verb: 'fired', peak: [30, 200],
    opening: 'The diagram below shows the path of a signal flare fired vertically from a boat.' },
  { noun: 'toy drone', verb: 'launched', peak: [25, 200],
    opening: 'The diagram below shows the path of a toy drone launched straight up from a field.' },
  { noun: 'water jet', verb: 'released', peak: [6, 45],
    opening: 'The diagram below shows the path of a jet of water released from a fountain.' },
];
/**
 * `h(t) = bt - t^2`, reaching a stated height on the way up.
 *
 * Answer-first. The two times the height is reached are chosen and the
 * trajectory follows: $t^2 - bt + H = (t - t_1)(t - t_2)$ gives $b = t_1 + t_2$
 * and $H = t_1 t_2$ at once. The paper's own numbers are $t_1 = 6$, $t_2 = 10$,
 * so $b = 16$ and $H = 60$.
 */
function reachesHeight(): Q | null {
  const c = pick(LAUNCHED);
  const t1 = getRandomInt(2, 9);
  const t2 = t1 + 2 * getRandomInt(1, 4);       // an even gap, so the peak is a whole second
  const b = t1 + t2;
  const H = t1 * t2;
  const peakAt = b / 2;
  const peak = peakAt * peakAt;                 // h(b/2) = b^2/4
  // Part (b) asks about a height it never reaches, and the gap has to be
  // visible: 61 against a maximum of 64 invites "close enough".
  const askAbout = peak + 5 * getRandomInt(1, 4);
  if (H >= peak) return null;                   // the stated height must be reachable
  if (peak < c.peak[0] || peak > c.peak[1]) return null;

  const view: View = {
    xMin: -b * 0.16, xMax: b * 1.16,
    yMin: -peak * 0.18, yMax: peak * 1.2,
  };
  const prose = [
    c.opening,
    '',
    `The height, $h$ metres, of the ${c.noun} after $t$ seconds is given by $h(t) = ${b}t - t^{2}$.`,
    '',
    `<b>(a)</b>&nbsp;&nbsp;After how many seconds will the ${c.noun} first be at a height of ${H} metres?`,
    '',
    `<b>(b)</b>&nbsp;&nbsp;Will the ${c.noun} reach a height of ${askAbout} metres? Justify your answer.`,
  ];
  const steps = [
    `<strong>1.</strong> Set the height equal to ${H}:<br><br>$${b}t - t^{2} = ${H}$`,
    `<strong>2.</strong> A quadratic has to be equal to zero before it can be solved, so gather everything on one side:<br><br>$t^{2} - ${b}t + ${H} = 0$`,
    `<strong>3.</strong> Factorise — two numbers multiplying to ${H} and adding to ${b}:<br><br>$(t - ${t1})(t - ${t2}) = 0$`,
    `<strong>4.</strong> So $t = ${t1}$ or $t = ${t2}$. The ${c.noun} passes this height on the way up and again on the way down; the question asks when it is <strong>first</strong> there:<br><br>$t = ${t1}$ seconds`,
    `<strong>5.</strong> For part (b), find the highest point. A parabola is symmetrical, so the maximum is halfway between the two times the ${c.noun} is at the same height:<br><br>$t = \\frac{${t1} + ${t2}}{2} = ${peakAt}$`,
    `<strong>6.</strong> Work out the height at that moment:<br><br>$h(${peakAt}) = ${b} \\times ${peakAt} - ${peakAt}^{2} = ${b * peakAt} - ${peakAt * peakAt} = ${peak}$ metres`,
    `<strong>7.</strong> Compare that with the ${askAbout} metres asked about:<br><br>No — the ${c.noun} only reaches ${peak} metres, which is less than ${askAbout} metres.`,
  ];
  return assemble({
    view,
    plot: { kind: 'parabola', a: -1, h: peakAt, k: peak },
    // Only the arch. The equation is a parabola for every t, but the flight is
    // over when it lands, and drawing past the roots puts the thing below the
    // ground it was fired from.
    domain: [0, b],
    axisNames: { x: 't', y: 'h' },
  }, 'Reaching a Height in a Quadratic Model', 'quadratics.reaches-height',
    prose,
    `$h(t) = ${b}t - t^{2}$. When is the height first ${H} m, and does it reach ${askAbout} m?`,
    // 2014 P1 Q13: (a) construct, rearrange to zero, factorise, select — 4.
    // (b) turning point, maximum height, conclusion — 3.
    steps, [1, 1, 1, 1, 1, 1, 1],
    `(a) ${t1} seconds<br>(b) No — its maximum height is ${peak} metres`);
}

// ── the ball off a clifftop — 2019 P1 Q15 ────────────────────────────────

const CLIFFS: { noun: string; verb: string; from: string; onto: string }[] = [
  { noun: 'ball', verb: 'kicked', from: 'harbour wall', onto: 'water' },
  { noun: 'stone', verb: 'thrown', from: 'sea wall', onto: 'sand' },
  { noun: 'ball', verb: 'thrown', from: 'balcony', onto: 'ground' },
  { noun: 'pebble', verb: 'thrown', from: 'bridge', onto: 'river' },
  { noun: 'tennis ball', verb: 'hit', from: 'rooftop', onto: 'street' },
];

/**
 * `h = ct - dt^2`, landing a stated distance *below* where it started.
 *
 * Answer-first, and the factorisation is the constraint. The scheme's is
 * $(5t - 17)(t + 1) = 0$, so this builds $(dt - m)(t + 1)$, which multiplies out
 * to $dt^2 + (d - m)t - m$: the drop is $m$ and the launch coefficient is
 * $m - d$. Requiring $d \nmid m$ keeps the answer a proper fraction, as the
 * paper's $\frac{17}{5}$ is — and requiring $d$ to be a power of two times five
 * keeps its decimal short, since the scheme accepts either.
 */
function landsBelow(): Q | null {
  const c = pick(CLIFFS);
  const d = pick([2, 4, 5, 8, 10]);
  const m = getRandomInt(d + 4, d + 30);        // the drop, in metres
  // Coprime, so the answer is a fraction and already in simplest form. Merely
  // rejecting whole answers left 24/10, which is neither.
  if (gcd(m, d) !== 1) return null;
  const up = m - d;                             // the coefficient of t
  const t = m / d;                              // when it lands
  const peak = (up * up) / (4 * d);             // the highest it gets
  // The paper's ball rises 7.2 m before falling 17. Left open to 40 this drew a
  // ball hit 39 metres straight up off a rooftop, which is not a thing that
  // happens; the drop is what should be the large number here, not the rise.
  if (peak < 1.5 || peak > 16) return null;
  if (up > 26) return null;
  // Part (a) evaluates the height at a whole second, and it has to still be
  // above the start — otherwise "the height above the clifftop" is negative and
  // the question reads as a trick.
  const T = pick([1, 2]);
  const at = up * T - d * T * T;
  if (at <= 0) return null;
  if (!Number.isInteger(at)) return null;

  const decimal = Number((t).toFixed(4));
  const view: View = {
    xMin: -t * 0.14, xMax: t * 1.16,
    yMin: -m * 1.16, yMax: peak * 1.5,
  };
  const prose = [
    `A ${c.noun} is ${c.verb} from a ${c.from}.`,
    '',
    `The height, $h$ metres, of the ${c.noun} relative to the ${c.from} after $t$ seconds is given by $h = ${up}t - ${d}t^{2}$.`,
    '',
    `<b>(a)</b>&nbsp;&nbsp;Calculate the height of the ${c.noun} above the ${c.from} after ${T} second${T === 1 ? '' : 's'}.`,
    '',
    `The ${c.onto} is ${m} metres below the ${c.from}.`,
    '',
    `<b>(b)</b>&nbsp;&nbsp;After how many seconds will the ${c.noun} hit the ${c.onto}?`,
  ];
  const steps = [
    `<strong>1.</strong> Put $t = ${T}$ into the formula:<br><br>$h = ${up}(${T}) - ${d}(${T})^{2} = ${up * T} - ${d * T * T} = ${at}$ metres`,
    `<strong>2.</strong> The ${c.onto} is <strong>below</strong> the ${c.from}, so its height relative to the ${c.from} is $-${m}$:<br><br>$${up}t - ${d}t^{2} = -${m}$`,
    `<strong>3.</strong> Gather everything on one side so the quadratic equals zero:<br><br>$${d}t^{2} - ${up}t - ${m} = 0$`,
    `<strong>4.</strong> Factorise:<br><br>$(${d}t - ${m})(t + 1) = 0$`,
    `<strong>5.</strong> So $t = \\frac{${m}}{${d}}$ or $t = -1$. Time cannot be negative, so:<br><br>$t = \\frac{${m}}{${d}} = ${decimal}$ seconds`,
  ];
  return assemble({
    view,
    plot: { kind: 'parabola', a: -d, h: up / (2 * d), k: peak },
    domain: [0, t],
    axisNames: { x: 't', y: 'h' },
    // The line the curve has to reach, and the reason part (b) is not simply
    // "where does it cross the axis".
    guide: { y: -m },
  }, 'Falling Below the Starting Height', 'quadratics.lands-below',
    prose,
    `$h = ${up}t - ${d}t^{2}$, ${c.onto} ${m} m below. Find the height after ${T} s, and when it lands.`,
    // 2019 P1 Q15: (a) calculate height — 1. (b) construct, rearrange to zero,
    // factorise, solve and select — 4.
    steps, [1, 1, 1, 1, 1],
    `(a) ${withUnit(at, 'metres')}<br>(b) $\\frac{${m}}{${d}} = ${decimal}$ seconds`);
}

// ── dispatch ─────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 4000; i++) {
    const made = make();
    if (made) return made;
  }
  throw new Error(`${name}: no valid question found`);
};

export const QUADRATIC_CONTEXT_GENERATORS: Record<string, () => Q> = {
  'Reaching a Height in a Quadratic Model': tried('quadratics.reaches-height', reachesHeight),
  'Falling Below the Starting Height': tried('quadratics.lands-below', landsBelow),
};
