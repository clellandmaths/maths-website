import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { rightTriangle } from '../diagrams/shapes/right-triangle';
import { circleChord } from '../diagrams/shapes/circle-chord';
import { triangleFromSides } from '../diagrams/shapes/triangle-sides';
import { cuboid } from '../diagrams/shapes/cuboid';
import { solidOnAxes } from '../diagrams/shapes/solid-on-axes';
import { twoCircles } from '../diagrams/shapes/two-circles';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';
import {
  PYTHAGORAS_CONTEXTS, CHORD_CONTEXTS, CONVERSE_CONTEXTS, BOX_CONTEXTS, abbrev,
  withUnit,
} from './n5-contexts';

/**
 * National 5 Pythagoras — finding a missing side.
 *
 * ⚠️ This is the **Zeta skill drill**, not an exam shape, and it carries no
 * paper citations. All eight questions the gap table listed against
 * `pythagoras.find-side` — 2014 P1 Q12, 2016 P2 Q15, 2017 P2 Q13, 2018 P2 Q12,
 * 2019 P2 Q18, 2022 P2 Q8, 2023 P1 Q10, 2024 P2 Q10 — turn out to be four-mark
 * **chord-in-a-circle** problems: a tunnel cross-section, a paving slab, a door
 * sign. In every one the right-angled triangle is *not drawn*; the pupil has to
 * construct it by dropping a perpendicular from the centre to the chord, which
 * is why the first markscheme line is "marshal facts and recognise
 * right-angled triangle". Those need the circle-with-chord routine and are not
 * built yet.
 *
 * A bare labelled triangle is still worth having — it is what Zeta drills and
 * what a starter wants — so it stays, tiered honestly as a skill.
 *
 * The important structural point: **the question text and the diagram are built
 * from the same numbers**. The generator picks the triangle, then the text and
 * the figure are both derived from it. They are never two constructions that
 * happen to agree, which is what makes "the diagram contradicts the question"
 * impossible rather than merely unlikely — and `verifyFigure` re-measures the
 * drawing against those numbers on every run.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** A number as it should read: 7.2 not 7.20, 8 not 8.0. */
const num = (v: number): string => `${Math.round(v * 100) / 100}`;

/**
 * Triples for the chord question that clones 2014 P1 Q12, as
 * `[centre-to-chord, half-chord, radius]`.
 *
 * That paper is non-calculator and answers exactly 18 — radius 15, height 27,
 * so the centre sits 12 above the chord and half of it is
 * sqrt(15² − 12²) = 9. The clone used to pick a radius first and let the
 * arithmetic land where it fell, which made every single draw a square root of
 * a non-square with no calculator.
 *
 * Both orders of each pair are listed: which leg is the distance to the chord
 * and which is half the chord are different questions, and (12, 9, 15) is the
 * paper's own arrangement.
 */
const CHORD_TRIPLES: [number, number, number][] = [
  [3, 4, 5], [4, 3, 5],
  [6, 8, 10], [8, 6, 10],
  [5, 12, 13], [12, 5, 13],
  [9, 12, 15], [12, 9, 15],
  [8, 15, 17], [15, 8, 17],
  [12, 16, 20], [16, 12, 20],
  [7, 24, 25], [24, 7, 25], [15, 20, 25], [20, 15, 25],
  [10, 24, 26], [24, 10, 26],
];

/**
 * Scales that keep a triple exact to one decimal place.
 *
 * A half is the smallest step that survives: 2.5² − 1.5² = 4, and the pupil
 * takes a square root of 4 rather than of 6.25. Anything finer reintroduces the
 * arithmetic the triples exist to avoid, and the contexts need the range —
 * their radii run from 1 metre to 30 centimetres.
 */
const CHORD_SCALES = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

/**
 * Pythagorean quadruples `(a, b, c)` with `a² + b² + c²` a perfect square, for
 * the pyramid that clones 2016 P1 Q7.
 *
 * The base is 2a by 2b and the height is c, so the apex sits on whole
 * coordinates and the edge AV — whose differences are exactly a, b and c —
 * comes out whole. 2016 P1 Q7 is (3, 2, 6), giving 7.
 *
 * Both orders of a and b are listed, since the base is rectangular and which
 * way round it sits is a different picture. Nothing taller than 12 or wider
 * than 18: the proportion guard below rejects a spike, and a pyramid drawn as
 * one is not the figure the paper shows.
 */
const PYRAMID_QUADRUPLES: [number, number, number][] = [
  [1, 2, 2], [2, 1, 2],
  [2, 3, 6], [3, 2, 6],
  [1, 4, 8], [4, 1, 8],
  [4, 4, 7],
  [2, 6, 9], [6, 2, 9],
  [6, 6, 7],
  [3, 4, 12], [4, 3, 12],
  [8, 9, 12], [9, 8, 12],
];

/**
 * Triples with a whole hypotenuse, and near-misses that give a rounded answer.
 *
 * The papers use both: 2023 P1 Q10 has a whole answer, 2016 P2 Q15 asks for one
 * decimal place. Building from a known triple guarantees the first kind;
 * arbitrary legs give the second.
 */
const TRIPLES: [number, number, number][] = [
  [3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17],
  [7, 24, 25], [20, 21, 29], [12, 16, 20], [10, 24, 26], [15, 20, 25],
  [9, 40, 41], [12, 35, 37], [16, 30, 34], [18, 24, 30], [14, 48, 50],
];

export function pythagorasFindSide(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(PYTHAGORAS_CONTEXTS);
    const exact = getRandomInt(0, 1) === 0;
    const findHyp = getRandomInt(1, 3) !== 1;      // the papers ask this most often

    let legA: number, legB: number, hyp: number;
    if (exact) {
      const [a, b, c] = pick(TRIPLES);
      const swap = getRandomInt(0, 1) === 0;
      [legA, legB, hyp] = swap ? [b, a, c] : [a, b, c];
    } else {
      legA = Number((getRandomInt(25, 190) / 10).toFixed(1));
      legB = Number((getRandomInt(25, 190) / 10).toFixed(1));
      hyp = Math.sqrt(legA * legA + legB * legB);
      if (Number.isInteger(Number(hyp.toFixed(4)))) continue;   // that is the exact case
    }
    if (!findHyp && !exact) continue;              // a rounded leg needs a rounded hypotenuse given
    if (Math.max(legA, legB) / Math.min(legA, legB) > 6) continue;

    // the unknown, and the two the pupil is given
    const answer = findHyp ? hyp : legB;
    const rounded = exact && findHyp ? num(hyp) : answer.toFixed(1);
    const known = findHyp ? [legA, legB] : [legA, hyp];

    const labels = findHyp
      ? { legA: `${num(legA)} ${ctx.unit}`, legB: `${num(legB)} ${ctx.unit}`, hyp: `${ctx.unknown} ${ctx.unit}` }
      : { legA: `${num(legA)} ${ctx.unit}`, legB: `${ctx.unknown} ${ctx.unit}`, hyp: `${num(hyp)} ${ctx.unit}` };

    // The prose often fixes which way up the triangle goes — a wall is
    // vertical, a ramp rises, a yacht sails north — and a rotated picture then
    // contradicts it while remaining geometrically perfect. Contexts that
    // merely describe a shape are free to turn any way.
    const fig = rightTriangle({
      legA, legB, hyp, labels,
      vertices: ctx.vertices,
      turn: ctx.layout === 'free' ? pick([0, 1, 2, 3] as const) : 0,
      mirror: ctx.layout === 'mirrored' || (ctx.layout === 'free' && getRandomInt(0, 1) === 0),
      lockOrientation: ctx.layout !== 'free',
    });
    const needsRounding = !(exact && findHyp);
    const sum = findHyp
      ? `${num(legA)}^{2} + ${num(legB)}^{2}`
      : `${num(hyp)}^{2} - ${num(legA)}^{2}`;
    const total = findHyp ? legA * legA + legB * legB : hyp * hyp - legA * legA;

    const prose = [
      ctx.scene(ctx.vertices),
      `Calculate the length of ${ctx.asks(findHyp, ctx.vertices)}.`,
      ...(needsRounding ? ['Give your answer correct to one decimal place.'] : []),
    ];
    const steps = [
      `<strong>1.</strong> The triangle has a right angle, so Pythagoras applies. ${findHyp ? 'The unknown side is the hypotenuse, so the two known sides are added' : 'The unknown side is a shorter side, so it is found by subtracting'}:<br><br>$${ctx.unknown}^{2} = ${sum}$`,
      `<strong>2.</strong> Work out the right hand side:<br><br>$${ctx.unknown}^{2} = ${num(Number(total.toFixed(4)))}$`,
      `<strong>3.</strong> Take the square root${needsRounding ? ' and round' : ''}:<br><br>$${ctx.unknown} = ${rounded}$ ${ctx.unit}`,
    ];

    // The figure is checked against the prose *and* the worked solution.
    //
    // Against the prose alone it could never pass: in an SQA question of this
    // shape the numbers appear only on the diagram, so there is nothing in the
    // text to agree with. The solution is the honest counterpart — it restates
    // the givens, and it is built here from the same variables the figure was
    // built from but through completely separate strings. If those two ever
    // diverged, this is what would notice.
    //
    // Failing figures are rejected rather than shipped: a thin triangle can put
    // the long leg's label on top of the hypotenuse's, and a rotation that
    // reads well at one aspect ratio does not at another. Re-picking is free.
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Pythagoras in a Right-Angled Triangle',
      difficulty: 'skill',
      variationId: 'pythagoras.find-side',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [
        `Right-angled triangle, sides ${num(known[0])} and ${num(known[1])} ${ctx.unit}. Find ${ctx.unknown}.`,
      ],
      solutionSteps: steps,
      finalAnswer: `$${rounded}$ ${ctx.unit}`,
      /** kept so the checks can re-measure the drawing against these numbers */
      figure: fig,
    };
  }
  throw new Error('pythagoras.find-side: no valid question found');
}


// ── the shape the papers actually ask — 2016 P2 Q15, 2018 P2 Q12, ────────
//    2022 P2 Q8, 2023 P1 Q10, and four more
//
// A circular segment: a chord, an arc, and a height to find. What makes these
// four marks rather than two is that the right-angled triangle is not part of
// the object — the pupil has to produce it by dropping a perpendicular from the
// centre to the chord, which bisects it. The markscheme's first line is
// "marshal facts and recognise right-angled triangle".
//
// Answer-first on the geometry: the radius and chord are chosen, the distance
// from the centre follows, and the height is r + d or r - d depending on which
// piece of the circle the object is.

export function pythagorasChord(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(CHORD_CONTEXTS);
    const [lo, hi] = ctx.band;
    const r = Number((getRandomInt(lo * 10, hi * 10) / 10).toFixed(1));
    // Every paper puts the chord between 0.6 and 0.8 of the diameter — 4 across
    // a 5.8 m tunnel, 20 across a 26 cm circle, 60 across a 100 cm slab. Wider
    // than that and the segment is a sliver; narrower and the "shape" is nearly
    // the whole circle, which gave a fuel tank 5.8 m tall on a 2 m base.
    const chord = Number((2 * r * (getRandomInt(55, 85) / 100)).toFixed(1));
    if (chord >= 2 * r * 0.95) continue;
    const d = Math.sqrt(r * r - (chord / 2) ** 2);
    const height = ctx.major ? r + d : r - d;
    if (height < 0.4) continue;

    const [O, A, B] = pick([['O', 'A', 'B'], ['C', 'P', 'Q'], ['O', 'M', 'N']]);
    const fig = circleChord({
      radius: r, chord, major: ctx.major, flip: ctx.flip,
      names: { a: A, b: B, centre: O },
      labels: {
        radius: `${num(r)} ${abbrev(ctx.unit)}`,
        chord: `${num(chord)} ${abbrev(ctx.unit)}`,
        height: '',
      },
    });

    const prose = [
      ctx.scene(O, A, B),
      `&bull;&nbsp; The radius $${O}${B}$ is ${withUnit(Number(num(r)), ctx.unit)}`,
      `&bull;&nbsp; The chord $${A}${B}$ is ${num(chord)} ${ctx.unit}`,
      `Calculate ${ctx.asks}. Give your answer correct to one decimal place.`,
    ];
    const steps = [
      `<strong>1.</strong> The perpendicular from the centre to a chord bisects it, so drop it from $${O}$ to the midpoint $M$ of $${A}${B}$. That makes a right-angled triangle $${O}M${B}$, with $${O}${B}$ as its hypotenuse.`,
      `<strong>2.</strong> Half the chord is $${num(chord)} \\div 2 = ${num(chord / 2)}$ ${ctx.unit}. Now use Pythagoras to find $${O}M$:<br><br>$${O}M^{2} = ${num(r)}^{2} - ${num(chord / 2)}^{2} = ${num(Number((r * r - (chord / 2) ** 2).toFixed(4)))}$`,
      `<strong>3.</strong> So $${O}M = ${d.toFixed(3)}$ ${ctx.unit}.`,
      ctx.major
        ? `<strong>4.</strong> The shape is the larger piece, so its height is the radius <strong>plus</strong> $${O}M$:<br><br>$${num(r)} + ${d.toFixed(3)} = ${height.toFixed(1)}$ ${ctx.unit}`
        : `<strong>4.</strong> The shape is the smaller piece, so its height is the radius <strong>minus</strong> $${O}M$:<br><br>$${num(r)} - ${d.toFixed(3)} = ${height.toFixed(1)}$ ${ctx.unit}`,
    ];

    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Pythagoras in a Circle',
      difficulty: 'exam',
      variationId: 'pythagoras.chord',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [
        `Circle radius ${num(r)}, chord ${num(chord)}. Find ${ctx.asks}.`,
      ],
      solutionSteps: steps,
      // Four marks in all eight papers, always the same four: •¹ marshal the
      // facts and recognise the right-angled triangle, •² a consistent
      // Pythagoras statement, •³ calculate the third side, •⁴ calculate the
      // length asked for.
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${height.toFixed(1)}$ ${ctx.unit}`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.chord: no valid question found');
}


// ── the converse — 2014 P2 Q6, 2017 P2 Q7, 2019 P2 Q11, 2023 P2 Q8, ─────
//    2026 P2 Q7
//
// Three sides given; is the triangle right-angled? The marks are for comparing
// the two sides squared against the longest squared and stating a conclusion
// with a reason, so the working shows both numbers and the answer names them.
//
// The diagram carries no right-angle mark, because whether there is one is the
// answer. It is drawn exactly to scale, which is honest: the numbers sit close
// to a triple either way, so it still cannot be settled by eye.

export function pythagorasConverse(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(CONVERSE_CONTEXTS);
    const [lo, hi] = ctx.band;
    const right = getRandomInt(0, 1) === 0;

    // start from a genuine triple, then nudge the longest side when the answer
    // is meant to be no — that is what makes it undecidable by eye
    const [m, n] = [getRandomInt(2, 7), getRandomInt(1, 6)];
    if (m <= n) continue;
    const base = [m * m - n * n, 2 * m * n, m * m + n * n];
    const scale = Math.max(1, Math.round(getRandomInt(lo, hi) / base[2]));
    let [p, q, r] = base.map(v => v * scale);
    if (p < 2 || r > hi * 1.3) continue;
    if (!right) {
      /**
       * **The nudge is sized from the triangle, not from a fixed list.**
       *
       * It used to be `±(1..3) × max(1, 1% of r)`, and the `max(1, …)` is what
       * went wrong: on a small triangle a whole unit is a large relative
       * change. Measured over 600 draws, the corner being tested came out a
       * median 3·3° from square — invisible, as intended — but **27% were 5°
       * or more off and the worst was 16·8°**, which anyone can see without
       * calculating anything. That is the recorded fault, and it was never
       * that the figure is drawn to scale; it is that some of them were nudged
       * too hard to stay undecidable.
       *
       * For a nudge δ on the longest side, the corner opens by about
       * `(180/π)·rδ/pq` degrees. Inverting that for a 4° ceiling gives the
       * largest δ this triangle can take, and the nudge is drawn from inside
       * it. Where even δ = 1 would show, the triangle is rejected rather than
       * drawn misleadingly.
       *
       * **This is why the schematic-figure flag turned out not to be needed.**
       * Drawing every converse triangle square and letting its labels disagree
       * would have meant teaching `verifyFigure` to accept a figure that
       * contradicts itself — and that check has caught real faults repeatedly,
       * twice in the session this was written. Sizing the nudge gets the same
       * outcome for nothing.
       */
      const maxNudge = Math.floor((4 * Math.PI / 180) * p * q / r);
      if (maxNudge < 1) continue;
      const step = getRandomInt(1, Math.min(maxNudge, Math.max(1, Math.round(r * 0.03))));
      r += pick([-1, 1]) * step;
      if (r <= Math.max(p, q) || r >= p + q) continue;
    }

    const names = pick([['A', 'B', 'C'], ['L', 'M', 'H'], ['P', 'Q', 'R'], ['X', 'Y', 'Z']]);
    // The corner being tested is the one *opposite the longest side*, and with
    // sides AB = p, BC = q, CA = r that is B, not C. Naming C put the question
    // on the wrong corner while every number stayed right, which is exactly the
    // kind of error a diagram check cannot see — so the answer check below now
    // works out which vertex it should be and compares.
    const corner = names[1];

    /**
     * 2019 P2 Q11 gives the **total** and two of the three, so the third has to
     * be found before the converse can be used at all.
     *
     * `presentations.ts` is what found this: it flagged the variation as citing
     * five papers and producing the presentation of one, and reading the five
     * showed it was right. It is a genuinely harder question — an extra step in
     * front of the same test — so it is its own variation rather than a coin
     * toss inside this one, the same split `sector.arc-angle-pi314` makes.
     *
     * The **longest** side is always one of the two given. Leaving it to be
     * found would put the first step ("the longest side is …") before the
     * arithmetic that identifies it, which is a different question again and
     * not one any paper asks.
     */
    const fromTotal = getRandomInt(0, 2) === 0;
    const total = p + q + r;
    // whichever of the two shorter sides is left out
    const missing = pick([0, 1] as const);
    const [shownShort, hiddenShort] = missing === 0 ? [q, p] : [p, q];

    const fig = triangleFromSides({
      sides: { ab: p, bc: q, ca: r },
      vertices: [names[0], names[1], names[2]],
      // The distance the pupil has to work out from the total is **not on the
      // drawing**. It was, on the first build of this presentation, and
      // `gives-away.ts` caught it the same afternoon that check was written:
      // the question withheld a number and the figure handed it straight back.
      labels: {
        ab: fromTotal && missing === 0 ? '' : `${p} ${abbrev(ctx.unit)}`,
        bc: fromTotal && missing === 1 ? '' : `${q} ${abbrev(ctx.unit)}`,
        ca: `${r} ${abbrev(ctx.unit)}`,
      },
      turn: pick([0, 1, 2, 3] as const),
    });
    if (!fig) continue;

    const sumSq = p * p + q * q;
    const longSq = r * r;
    const verdict = right
      ? `Yes — the angle at ${corner} is a right angle`
      : `No — the angle at ${corner} is not a right angle`;

    const prose = fromTotal
      ? [
          ctx.scene(names[0], names[1], names[2]),
          `The total of the three distances is ${total} ${ctx.unit}.`,
          `Two of them are ${shownShort} ${ctx.unit} and ${r} ${ctx.unit}.`,
          ctx.asks(corner, names[0], names[1], names[2]),
        ]
      : [
          ctx.scene(names[0], names[1], names[2]),
          `The three distances are ${p} ${ctx.unit}, ${q} ${ctx.unit} and ${r} ${ctx.unit}.`,
          ctx.asks(corner, names[0], names[1], names[2]),
        ];
    // •¹ valid strategy, •² evaluation, •³ explicit comparison, •⁴ conclusion
    // with a valid reason. The comparison and the conclusion are separate marks
    // in three of the four papers, and both were inside one step here — so the
    // withheld hint was carrying two marks, and the pupil who took every hint
    // was still told the answer.
    const steps = [
      fromTotal
        ? `<strong>1.</strong> The third distance is the total less the two given:<br><br>$${total} - ${shownShort} - ${r} = ${hiddenShort}$ ${ctx.unit}<br><br>The longest side is ${r} ${ctx.unit}, so if there is a right angle it is opposite that side.`
        : `<strong>1.</strong> The longest side is ${r} ${ctx.unit}, so if there is a right angle it is opposite that side. Test the two shorter sides against it.`,
      `<strong>2.</strong> Square the two shorter sides and add, then square the longest:<br><br>$${p}^{2} + ${q}^{2} = ${p * p} + ${q * q} = ${sumSq}$ and $${r}^{2} = ${longSq}$`,
      right
        ? `<strong>3.</strong> Compare the two:<br><br>$${sumSq} = ${longSq}$, so they are <strong>equal</strong>`
        : `<strong>3.</strong> Compare the two:<br><br>$${sumSq} \\neq ${longSq}$, so they are <strong>not equal</strong>`,
      right
        ? `<strong>4.</strong> Pythagoras holds, so:<br><br>${verdict}`
        : `<strong>4.</strong> Pythagoras does not hold, so:<br><br>${verdict}`,
    ];

    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'The Converse of Pythagoras',
      difficulty: 'exam',
      variationId: fromTotal ? 'pythagoras.converse-from-total' : 'pythagoras.converse',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`Sides ${p}, ${q}, ${r}. Right-angled?`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `${verdict}, since $${p}^{2} + ${q}^{2} = ${sumSq}$ and $${r}^{2} = ${longSq}$`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.converse: no valid question found');
}

// ── the converse, from two triangles placed together — 2017 P2 Q7 ────────
//
// The presentation `presentations.ts` could not see until its figure features
// were fixed, and the only one of the converse citations that nothing produced.
//
// The paper gives **two triangles separately**, with their own side lengths and
// a shared edge, then places them together and asks about the composite. **No
// length appears in the prose at all**, and the composite's base is the sum of
// the two bases handed over - forming it is the first thing the question asks.
// Triangle A is 8, 7, 6 and triangle B is 7, 19, 16, joined along the 7, giving
// 8, 19 and 6 + 16 = 22. It is not right-angled: 425 against 484.
//
// **Three marks, not four** - the scheme merges the comparison and the
// conclusion - which is why this is its own variation rather than a branch of
// the four-mark one.

/**
 * `[X, Y, z1, z2, d]`: a triangle whose base splits into `z1 + z2`, with a line
 * of length `d` from the apex to the split point. `X` is the side above `z1`
 * and `Y` the side above `z2`.
 *
 * These are integer solutions of **Stewart's theorem**,
 * `X²·z2 + Y²·z1 - d²·(z1+z2) = (z1+z2)·z1·z2`, searched offline. Nothing
 * about the picture is approximate: every one of the five lengths is a whole
 * number and the two sub-triangles close exactly, which is what lets the figure
 * be drawn to scale and still be honest.
 *
 * The base is always the longest side, so the corner under test is always the
 * apex, and the question never has to say which corner it means.
 */
const CEVIAN_RIGHT: readonly (readonly [number, number, number, number, number])[] = [
  [6, 8, 5, 5, 5], [8, 6, 5, 5, 5], [20, 15, 7, 18, 15], [15, 20, 9, 16, 12],
  [12, 16, 10, 10, 10], [16, 12, 10, 10, 10], [20, 15, 11, 14, 13], [10, 24, 13, 13, 13],
  [24, 10, 13, 13, 13], [15, 20, 14, 11, 13], [18, 24, 15, 15, 15], [24, 18, 15, 15, 15],
  [20, 15, 16, 9, 12], [15, 20, 18, 7, 15],
];

/**
 * The same, for the answer "no" - and **within 4 degrees of square**.
 *
 * The paper's own composite is 101 degrees, which anyone can see is not a right
 * angle, and it gets away with that because its second figure carries no
 * dimensions at all. A generated figure is drawn to scale WITH its lengths on
 * it, so a composite that far from square could be settled by eye and the three
 * marks are for calculating. Same reasoning as the nudge in `pythagorasConverse`
 * above, reached the same way.
 */
const CEVIAN_NEAR: readonly (readonly [number, number, number, number, number])[] = [
  [6, 10, 3, 9, 5], [8, 13, 3, 12, 7], [13, 13, 3, 16, 11], [7, 7, 4, 6, 5],
  [8, 8, 4, 7, 6], [5, 11, 4, 8, 5], [8, 14, 4, 12, 7], [8, 13, 5, 10, 7],
  [11, 10, 5, 10, 8], [10, 18, 5, 15, 9], [14, 14, 5, 15, 11], [7, 7, 6, 4, 5],
  [13, 6, 6, 8, 8], [12, 20, 6, 18, 10], [8, 8, 7, 4, 6], [7, 13, 7, 8, 7],
  [13, 8, 7, 8, 8], [8, 18, 7, 13, 8], [13, 16, 7, 14, 10], [16, 16, 7, 16, 12],
  [11, 5, 8, 4, 5], [6, 13, 8, 6, 8], [8, 13, 8, 7, 8], [13, 7, 8, 7, 7],
  [15, 9, 8, 10, 9], [13, 13, 8, 11, 9], [14, 14, 8, 12, 10], [15, 15, 8, 13, 11],
  [16, 16, 8, 14, 12], [7, 23, 8, 16, 9], [10, 22, 8, 16, 10], [10, 6, 9, 3, 5],
  [11, 18, 9, 12, 10], [20, 12, 9, 15, 13], [20, 19, 9, 18, 15], [23, 14, 9, 18, 16],
  [10, 11, 10, 5, 8], [13, 8, 10, 5, 7], [9, 15, 10, 8, 9], [14, 21, 10, 15, 12],
  [19, 16, 10, 15, 13], [13, 13, 11, 8, 9], [19, 19, 11, 15, 14], [12, 24, 11, 16, 12],
  [13, 8, 12, 3, 7], [14, 8, 12, 4, 7], [14, 14, 12, 8, 10], [18, 11, 12, 9, 10],
  [18, 21, 12, 15, 14], [20, 20, 12, 17, 14], [21, 21, 12, 18, 15], [18, 8, 13, 7, 8],
  [15, 15, 13, 8, 11], [16, 13, 14, 7, 10], [16, 16, 14, 8, 12], [20, 24, 14, 18, 15],
  [14, 14, 15, 5, 11], [18, 10, 15, 5, 9], [12, 20, 15, 9, 13], [16, 19, 15, 10, 13],
  [21, 14, 15, 10, 12], [19, 19, 15, 11, 14], [21, 18, 15, 12, 14], [13, 13, 16, 3, 11],
  [16, 16, 16, 7, 12], [22, 10, 16, 8, 10], [23, 7, 16, 8, 9], [24, 12, 16, 11, 12],
  [20, 20, 17, 12, 14], [20, 12, 18, 6, 10], [14, 23, 18, 9, 16], [19, 20, 18, 9, 15],
  [21, 21, 18, 12, 15], [24, 20, 18, 14, 15],
];

const JOINED_NAMES = [
  ['P', 'Q', 'R', 'S'], ['A', 'B', 'C', 'D'], ['W', 'X', 'Y', 'Z'], ['J', 'K', 'L', 'M'],
];

export function pythagorasConverseJoined(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const right = getRandomInt(0, 1) === 0;
    const [X, Y, z1, z2, d] = pick([...(right ? CEVIAN_RIGHT : CEVIAN_NEAR)]);
    const base = z1 + z2;
    const unit = pick(['centimetres', 'metres']);
    const u = abbrev(unit);
    const [nA, nB, nC, nF] = pick(JOINED_NAMES);

    const fig = triangleFromSides({
      sides: { ab: base, bc: Y, ca: X },
      vertices: [nA, nB, nC],
      // The base is labelled in its two parts, never as a whole: adding them is
      // the first mark.
      labels: { ab: '', bc: `${Y} ${u}`, ca: `${X} ${u}` },
      cevian: {
        at: z1, length: d, name: nF,
        labels: { left: `${z1} ${u}`, right: `${z2} ${u}`, line: `${d} ${u}` },
      },
      turn: pick([0, 1, 2, 3] as const),
    });
    if (!fig) continue;

    const sumSq = X * X + Y * Y;
    const longSq = base * base;
    const verdict = right
      ? `Yes — triangle $${nA}${nB}${nC}$ is right-angled, at $${nC}$`
      : `No — triangle $${nA}${nB}${nC}$ is not right-angled`;

    const prose = [
      `Two triangles are placed together along their common edge $${nC}${nF}$ to `
      + `form triangle $${nA}${nB}${nC}$, as shown.`,
      `Determine whether triangle $${nA}${nB}${nC}$ is right-angled. Justify your answer.`,
    ];

    // 2017 P2 Q7 is THREE marks where the other converse papers are four: •¹ a
    // valid strategy, •² evaluation, •³ the comparison and the conclusion
    // together. So the comparison does not get a step of its own here, and the
    // last step is still the one that states the answer.
    const steps = [
      `<strong>1.</strong> The two parts make the whole base:<br><br>$${nA}${nB} = ${z1} + ${z2} = ${base}$ ${unit}<br><br>That is the longest side, so if there is a right angle it is at $${nC}$.`,
      `<strong>2.</strong> Square the two shorter sides and add, then square the longest:<br><br>$${X}^{2} + ${Y}^{2} = ${X * X} + ${Y * Y} = ${sumSq}$ and $${base}^{2} = ${longSq}$`,
      right
        ? `<strong>3.</strong> $${sumSq} = ${longSq}$, so Pythagoras holds:<br><br>${verdict}`
        : `<strong>3.</strong> $${sumSq} \\neq ${longSq}$, so Pythagoras does not hold:<br><br>${verdict}`,
    ];

    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'The Converse of Pythagoras',
      difficulty: 'exam',
      variationId: 'pythagoras.converse-joined',
      questionLines: [prose[0], renderScene(fig.scene), prose[1]],
      boardQuestionLines: [`Base ${z1} + ${z2}, sides ${X} and ${Y}. Right-angled?`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `${verdict}, since $${X}^{2} + ${Y}^{2} = ${sumSq}$ and $${base}^{2} = ${longSq}$`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.converse-joined: no valid question found');
}


// ── the same figure, run backwards — 2014 P1 Q12, 2026 P2 Q5 ────────────
//
// 2014 gives the radius and the full height from the chord through the centre,
// and wants the chord. 2026 gives the chord and the perpendicular from the
// centre, and wants the radius. Both are the figure above with a different
// piece missing, which is why they share its routine - but they are two
// variations, because the exam pays four marks for one and three for the other
// and the reason is in the working: 2014 spends its first mark getting the
// perpendicular out of the height, which 2026 simply gives you.

export function pythagorasChordReverse(findChord: boolean): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(CHORD_CONTEXTS.filter(c => c.major));
    const [lo, hi] = ctx.band;
    const r = Number((getRandomInt(lo * 10, hi * 10) / 10).toFixed(1));
    const chord = Number((2 * r * (getRandomInt(55, 85) / 100)).toFixed(1));
    if (chord >= 2 * r * 0.95) continue;
    const d = Math.sqrt(r * r - (chord / 2) ** 2);
    const [O, A, B] = pick([['O', 'A', 'B'], ['C', 'P', 'Q'], ['O', 'A', 'C']]);

    if (findChord) {
      // radius and the height through the centre given; the chord is unknown
      //
      // 2014 P1 Q12 is non-calculator and answers exactly 18: radius 15,
      // height 27, so the centre sits 12 above the chord and half of it is
      // sqrt(15^2 - 12^2) = 9. Drawn freely the radius was a decimal and the
      // half-chord irrational, so 100% of clones asked for the square root of
      // a non-square with no calculator — not hard, impossible.
      //
      // So the triple comes first and the figure is built from it, rather than
      // the radius coming first and the arithmetic landing where it lands.
      // Scaling by a half keeps every printed value exact to one decimal
      // place, which is what lets the rounding instruction be dropped: the
      // paper does not ask for one, because it does not need one.
      //
      // The other branch of this function is `chord-radius`, which clones
      // 2026 P2 Q5 — a calculator paper — and keeps its free choice.
      const fits = CHORD_TRIPLES.flatMap(([legD, legH, hyp]) =>
        CHORD_SCALES.map(k => ({ d: legD * k, half: legH * k, r: hyp * k })))
        .filter(t => t.r >= lo && t.r <= hi);
      if (!fits.length) continue;
      const t = pick(fits);

      const r = t.r;
      const chord = 2 * t.half;
      const height = r + t.d;
      const dShown = t.d;
      const halfChord = t.half;
      const answer = chord;
      if (answer < r * 0.4) continue;

      const fig = circleChord({
        radius: r, chord, major: true,
        names: { a: A, b: B, centre: O },
        labels: { radius: `${num(r)} ${abbrev(ctx.unit)}`, chord: '',
                  height: `${num(height)} ${abbrev(ctx.unit)}` },
      });
      // Prose nobody had ever read, because this branch has never once reached
      // the page. "A shape is part of a circle" says nothing, and a radius of
      // one printed as "1 metres".
      const prose = [
        `The diagram shows part of a circle with centre $${O}$, cut off by the chord $${A}${B}$.`,
        `&bull;&nbsp; The radius of the circle is ${withUnit(r, ctx.unit)}`,
        `&bull;&nbsp; The height from the middle of $${A}${B}$ to the top of the arc is ${withUnit(height, ctx.unit)}`,
        // No rounding instruction: the triple makes the answer exact, and
        // 2014 P1 Q12 asks for none either — it just says "Calculate the
        // length of PQ", because with the numbers it chose there is nothing
        // to round.
        `Calculate the length of the chord $${A}${B}$.`,
      ];
      // 2014 P1 Q12 is four marks: •¹ marshal the facts and recognise the right
      // angle, •² know how to use Pythagoras, •³ the correct calculation, •⁴ the
      // length asked for. Three steps meant one of them carried two marks.
      const steps = [
        `<strong>1.</strong> Let $M$ be the midpoint of $${A}${B}$. The height runs from $M$ through the centre $${O}$ to the arc, so the part from $${O}$ down to $M$ is the height minus the radius:<br><br>$${O}M = ${num(height)} - ${num(r)} = ${num(dShown)}$ ${ctx.unit}`,
        `<strong>2.</strong> The perpendicular from the centre bisects the chord, so $${O}M${B}$ is right-angled with $${O}${B}$ as its hypotenuse:<br><br>$M${B}^{2} = ${num(r)}^{2} - ${num(dShown)}^{2}$`,
        `<strong>3.</strong> Work that out and take the square root:<br><br>$M${B}^{2} = ${num(r * r - dShown * dShown)}$, so $M${B} = ${num(halfChord)}$ ${ctx.unit}`,
        `<strong>4.</strong> The chord is twice $M${B}$:<br><br>$${A}${B} = 2 \\times ${num(halfChord)} = ${num(answer)}$ ${ctx.unit}`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Finding a Chord or Radius in a Circle',
        difficulty: 'exam',
        variationId: 'pythagoras.chord-reverse',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Radius ${num(r)}, height ${num(height)}. Find the chord.`],
        solutionSteps: steps,
        stepMarks: [1, 1, 1, 1],
        finalAnswer: `$${num(answer)}$ ${ctx.unit}`,
        figure: fig,
      };
    }

    // chord and the perpendicular given; the radius is unknown
    const dShown = Number(d.toFixed(1));
    const answer = Math.hypot(chord / 2, dShown);
    const fig = circleChord({
      radius: r, chord, major: true,
      names: { a: A, b: B, centre: O },
      labels: { radius: '', chord: `${num(chord)} ${abbrev(ctx.unit)}`, height: '',
                centreToChord: `${num(dShown)} ${abbrev(ctx.unit)}` },
    });
    const M = 'M';
    const prose = [
      `The diagram shows a circle with centre $${O}$ and chord $${A}${B}$.`,
      `&bull;&nbsp; $${A}${B}$ is ${withUnit(chord, ctx.unit)}`,
      `&bull;&nbsp; $${M}$ is the midpoint of $${A}${B}$, and $${O}${M}$ is ${withUnit(dShown, ctx.unit)}`,
      `Calculate the radius of the circle. Give your answer correct to one decimal place.`,
    ];
    // 2026 P2 Q5 is three marks, one fewer than 2014 P1 Q12, because the
    // perpendicular is handed over rather than worked out of the height. No
    // published scheme, so the split is inferred: halve the chord, state
    // Pythagoras, evaluate and take the root.
    const steps = [
      `<strong>1.</strong> The perpendicular from the centre bisects the chord, so $${M}${B}$ is half of $${A}${B}$:<br><br>$${M}${B} = ${num(chord)} \\div 2 = ${num(chord / 2)}$ ${ctx.unit}`,
      `<strong>2.</strong> Triangle $${O}${M}${B}$ is right-angled at $${M}$, and the radius $${O}${B}$ is its hypotenuse:<br><br>$${O}${B}^{2} = ${num(chord / 2)}^{2} + ${num(dShown)}^{2}$`,
      `<strong>3.</strong> Work that out, then take the square root:<br><br>$${O}${B}^{2} = ${num(Number(((chord / 2) ** 2 + dShown * dShown).toFixed(4)))}$, so $${O}${B} = ${answer.toFixed(1)}$ ${ctx.unit}`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    return {
      subTopic: 'Finding the Radius from a Chord',
      difficulty: 'exam',
      variationId: 'pythagoras.chord-radius',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`Chord ${num(chord)}, perpendicular ${num(dShown)}. Find the radius.`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer.toFixed(1)}$ ${ctx.unit}`,
      figure: fig,
    };
  }
  throw new Error(`pythagoras.chord-${findChord ? 'reverse' : 'radius'}: no valid question found`);
}


// ── the space diagonal of a cuboid — 2018 P2 Q16, 2022 P2 Q11 ───────────
//
// Two applications of Pythagoras: across the base first, then up to the far
// top corner. The markscheme pays for each separately — "start valid strategy
// for face diagonal", then "continue for space diagonal" — so the working
// shows them as two steps rather than jumping to the square root of the sum.
//
// Half the questions ask whether a given object fits, which needs a comparison
// and a conclusion, and half ask for the diagonal outright.

export function pythagorasSpaceDiagonal(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(BOX_CONTEXTS);
    const [lo, hi] = ctx.band;
    const L = getRandomInt(lo, hi);
    const B = getRandomInt(lo, hi);
    const H = getRandomInt(lo, hi);
    if (Math.max(L, B, H) / Math.min(L, B, H) > 4) continue;   // stays drawable

    const faceSq = L * L + B * B;
    const spaceSq = faceSq + H * H;
    const space = Math.sqrt(spaceSq);
    const exact = Number.isInteger(space);
    const asksFit = ctx.fits !== null && getRandomInt(0, 1) === 0;

    const fig = cuboid({
      length: L, breadth: B, height: H,
      labels: {
        length: `${L} ${abbrev(ctx.unit)}`,
        breadth: `${B} ${abbrev(ctx.unit)}`,
        height: `${H} ${abbrev(ctx.unit)}`,
      },
      showDiagonals: true,
    });

    // an object that fits about half the time, and never within a whisker
    const objectLen = asksFit
      ? Math.round(space * (getRandomInt(0, 1) === 0 ? 0.88 : 1.09))
      : 0;
    if (asksFit && Math.abs(objectLen - space) < 1.5) continue;
    const fitsInside = objectLen < space;

    const prose = asksFit && ctx.fits
      ? [ctx.scene(`${L} ${ctx.unit}`, `${B} ${ctx.unit}`, `${H} ${ctx.unit}`),
         ctx.fits.asks(`${objectLen} ${ctx.unit}`)]
      : [ctx.scene(`${L} ${ctx.unit}`, `${B} ${ctx.unit}`, `${H} ${ctx.unit}`),
         `Calculate ${ctx.asks}.`,
         exact ? '' : 'Give your answer correct to one decimal place.'].filter(Boolean);

    const steps = [
      `<strong>1.</strong> First work across the base. The base is a rectangle ${L} by ${B}, so its diagonal $d$ satisfies:<br><br>$d^{2} = ${L}^{2} + ${B}^{2} = ${faceSq}$`,
      // \\text, not \text: in a template literal `\t` is a tab, so the single
      // backslash sent a tab and the bare word "ext{space}" to MathJax, which
      // set it as three italic variables multiplied together. It shipped that
      // way in every question this variation produced. See latex-escapes.ts,
      // which now fails on any LaTeX command whose first letter is also a
      // JavaScript escape.
      `<strong>2.</strong> That base diagonal and the height ${H} form a second right-angled triangle, with the space diagonal as its hypotenuse. There is no need to square-root yet — $d^{2}$ is already what is wanted:<br><br>$\\text{space}^{2} = ${faceSq} + ${H}^{2} = ${spaceSq}$`,
      `<strong>3.</strong> Take the square root:<br><br>$\\text{space} = ${exact ? space : space.toFixed(1)}$ ${ctx.unit}`,
      ...(asksFit && ctx.fits
        ? [`<strong>4.</strong> Compare with the ${ctx.fits.object}:<br><br>${objectLen} ${fitsInside ? '&lt;' : '&gt;'} ${exact ? space : space.toFixed(1)}, so it <strong>${fitsInside ? 'will' : 'will not'}</strong> fit.`]
        : []),
    ];

    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'The Space Diagonal of a Cuboid',
      difficulty: 'exam',
      // The two branches are the two papers exactly. 2018 P2 Q16 asks whether
      // something fits and is four marks — •¹ start the strategy, •² continue
      // it, •³ the space diagonal, •⁴ a valid conclusion with comparison — while
      // 2022 P2 Q11 stops at the diagonal and is three. One id could only carry
      // one total.
      variationId: asksFit && ctx.fits ? 'pythagoras.space-diagonal-fits' : 'pythagoras.space-diagonal',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`Cuboid ${L} x ${B} x ${H}. Space diagonal?`],
      solutionSteps: steps,
      stepMarks: steps.map(() => 1),
      finalAnswer: asksFit && ctx.fits
        ? `${fitsInside ? 'Yes' : 'No'} — the diagonal is ${exact ? space : space.toFixed(1)} ${ctx.unit}, and the ${ctx.fits.object} is ${objectLen} ${ctx.unit}`
        : `$${exact ? space : space.toFixed(1)}$ ${ctx.unit}`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.space-diagonal: no valid question found');
}


// ── coordinates and a length in three dimensions ────────────────────────
//    2016 P1 Q7 (a rectangular-based pyramid), 2025 P2 Q8 (a cuboid)
//
// The same question twice: write down the coordinates of one vertex, then use
// Pythagoras in three dimensions to find a length. Both parts come from the
// same solid, so both are generated from one set of dimensions.
//
// The pyramid's apex sits above the centre of its base, which is what makes
// part (a) work in 2016: A is one base corner, and the opposite corner is
// twice the centre minus A.

export function pythagorasCoordinates(): Q {
  // Far more tries than the other variations get, because this figure lays out
  // successfully only about one attempt in forty: a projected solid carries
  // eight corner labels among edges running in three directions, and most
  // proportions put one label on an edge it does not belong to. At 300 tries
  // that threw roughly once in every 1700 questions, which on a worksheet is a
  // blank where a question should be.
  // The branch is chosen once, before the retry loop, not inside it.
  //
  // Choosing inside means a rejected layout re-enters the lottery rather than
  // retrying the branch that was asked for, so what reaches the page ends up
  // proportional to (chosen x survived) instead of to chosen. A figure that is
  // harder to lay out is then quietly buried by an easier one: the cuboid on
  // axes was picked half the time and reached the page 9% of the time.
  //
  // Fixing it here also makes a branch that can *never* lay out fail loudly
  // instead of silently substituting its neighbour, which is how a figure once
  // went missing entirely without a single check noticing.
  const isCuboid = getRandomInt(0, 1) === 0;
  for (let tries = 0; tries < 4000; tries++) {
    // The pyramid clones 2016 P1 Q7, which is non-calculator and answers
    // exactly 7 — A(2,0,0) to V(5,2,6) is sqrt(3² + 2² + 6²) = sqrt(49).
    // Chosen freely, 95.8% of its edges were irrational and the question
    // rounded to one decimal place, which is not the question the paper asks.
    //
    // AV's three differences are half the base length, half the base breadth
    // and the height, so a Pythagorean *quadruple* gives an exact edge:
    // PYRAMID_QUADRUPLES holds (a, b, c) with a² + b² + c² square, and the base
    // is 2a by 2b so the apex still lands on integer coordinates.
    //
    // The cuboid branch clones 2025 P2 Q8, a calculator paper, and keeps its
    // free choice — its `exact` flag already handles the occasional whole
    // answer.
    const quad = isCuboid ? null : pick(PYRAMID_QUADRUPLES);
    const X = quad ? quad[0] * 2 : getRandomInt(3, 12);
    const Y = quad ? quad[1] * 2 : getRandomInt(2, 10);
    const Z = quad ? quad[2] : getRandomInt(4, 16);
    if (Math.max(X, Y, Z) / Math.min(X, Y, Z) > 5) continue;

    if (isCuboid) {
      // named as 2025 P2 Q8 names them: top face K L M N, bottom O P Q R
      const names: Record<string, { x: number; y: number; z: number }> = {
        O: { x: 0, y: 0, z: 0 }, R: { x: X, y: 0, z: 0 },
        Q: { x: X, y: Y, z: 0 }, P: { x: 0, y: Y, z: 0 },
        K: { x: 0, y: 0, z: Z }, N: { x: X, y: 0, z: Z },
        M: { x: X, y: Y, z: Z }, L: { x: 0, y: Y, z: Z },
      };
      const diag = Math.sqrt(X * X + Y * Y + Z * Z);
      const exact = Number.isInteger(diag);
      const fig = solidOnAxes({
        parts: [{ kind: 'cuboid', at: { x: 0, y: 0, z: 0 }, size: { x: X, y: Y, z: Z } }],
        names, showCoords: ['L', 'R'],
      });

      const prose = [
        `The diagram shows a cuboid $KLMNOPQR$, relative to the coordinate axes.`,
        `$L$ has coordinates $(0, ${Y}, ${Z})$ and $R$ has coordinates $(${X}, 0, 0)$.`,
        `(a) Write down the coordinates of $M$.`,
        `(b) Calculate the length of $OM$.` + (exact ? '' : ' Give your answer correct to one decimal place.'),
      ];
      // 2025 P2 Q8 is 1 + 3: •¹ state the coordinates, then •² start a valid
      // strategy, •³ continue it, •⁴ calculate the space diagonal. Part (b) had
      // three marks in two steps, so a hint jumped one of them.
      const steps = [
        `<strong>(a)</strong> $M$ is the corner diagonally opposite $O$ on the top face, so it takes its $x$ from $R$, its $y$ from $L$ and its $z$ from $L$:<br><br>$M(${X}, ${Y}, ${Z})$`,
        `<strong>(b)</strong> $OM$ runs from the origin to $M$, so Pythagoras in three dimensions applies. Square each coordinate:<br><br>$OM^{2} = ${X}^{2} + ${Y}^{2} + ${Z}^{2}$`,
        `<strong>(b)</strong> Add them:<br><br>$OM^{2} = ${X * X + Y * Y + Z * Z}$`,
        `<strong>(b)</strong> Take the square root:<br><br>$OM = ${exact ? diag : diag.toFixed(1)}$ units`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: '3D Coordinates and Lengths',
        difficulty: 'exam',
        variationId: 'pythagoras.coordinates-cuboid',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Cuboid ${X} by ${Y} by ${Z} on the axes. Coordinates of $M$, and $OM$?`],
        solutionSteps: steps,
        stepMarks: [1, 1, 1, 1],
        finalAnswer: `(a) $M(${X}, ${Y}, ${Z})$, (b) $${exact ? diag : diag.toFixed(1)}$ units`,
        figure: fig,
      };
    }

    // a rectangular-based pyramid, named as 2016 P1 Q7 names it
    const A = { x: 0, y: 0, z: 0 };
    const B = { x: X, y: Y, z: 0 };
    const V = { x: X / 2, y: Y / 2, z: Z };
    if (!Number.isInteger(V.x) || !Number.isInteger(V.y)) continue;
    // the paper shifts the whole solid along x, so A is not at the origin
    const shift = getRandomInt(1, 4);
    const shifted = (p: { x: number; y: number; z: number }) =>
      ({ x: p.x + shift, y: p.y, z: p.z });
    const [sA, sB, sV] = [shifted(A), shifted(B), shifted(V)];
    const edge = Math.hypot(sV.x - sA.x, sV.y - sA.y, sV.z - sA.z);
    const exact = Number.isInteger(edge);

    const names: Record<string, { x: number; y: number; z: number }> = {
      A: sA, B: sB, V: sV,
    };
    const fig = solidOnAxes({
      parts: [{ kind: 'pyramid', at: { x: 0, y: 0, z: 0 }, size: { x: X, y: Y, z: Z }, construction: true }],
      names, showCoords: ['A', 'V'],
    });

    const prose = [
      `The diagram shows a rectangular-based pyramid, relative to the coordinate axes.`,
      `$A$ is the point $(${sA.x}, ${sA.y}, ${sA.z})$ and the apex $V$ is the point $(${sV.x}, ${sV.y}, ${sV.z})$.`,
      `(a) Write down the coordinates of $B$, the base corner opposite $A$.`,
      `(b) Calculate the length of the edge $AV$.` + (exact ? '' : ' Give your answer correct to one decimal place.'),
    ];
    // 2016 P1 Q7 is 1 + 3: •¹ the coordinates of B, then •² know how to find
    // AM², •³ know how to find AV, •⁴ find the length of AV.
    const steps = [
      `<strong>(a)</strong> $V$ sits directly above the centre of the base, so the centre is $(${sV.x}, ${sV.y}, 0)$. $B$ is as far past the centre as $A$ is short of it:<br><br>$B(${sB.x}, ${sB.y}, ${sB.z})$`,
      `<strong>(b)</strong> Take the differences in each coordinate between $A$ and $V$:<br><br>$${sV.x - sA.x}$, $${sV.y - sA.y}$ and $${sV.z - sA.z}$`,
      `<strong>(b)</strong> Square them and add:<br><br>$AV^{2} = ${(sV.x - sA.x) ** 2} + ${(sV.y - sA.y) ** 2} + ${(sV.z - sA.z) ** 2} = ${(sV.x - sA.x) ** 2 + (sV.y - sA.y) ** 2 + (sV.z - sA.z) ** 2}$`,
      `<strong>(b)</strong> Take the square root:<br><br>$AV = ${exact ? edge : edge.toFixed(1)}$ units`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    return {
      subTopic: '3D Coordinates and Lengths',
      difficulty: 'exam',
      variationId: 'pythagoras.coordinates-pyramid',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`Pyramid, $A(${sA.x},${sA.y},${sA.z})$, $V(${sV.x},${sV.y},${sV.z})$. Find $B$ and $AV$`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $B(${sB.x}, ${sB.y}, ${sB.z})$, (b) $${exact ? edge : edge.toFixed(1)}$ units`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.coordinates: no valid question found');
}


// ── two circles — 2024 P2 Q10, 2017 P2 Q13, 2019 P2 Q18 ─────────────────
//
// Three questions, three arrangements, each read off its paper diagram. The
// wording alone was not enough for any of them: 2017 states AB as 48 cm with a
// radius of 14, which cannot be a chord, and only the picture shows that AB is
// the two straight edges end to end.
//
//   overlap    two whole circles sharing the chord AB, width 2(r + d)
//   half-turn  two segments, each on half of AB, height 2(r + d)
//   snowman    AB is a diameter of the head and a chord of the body, which
//              fixes the body's radius at r*sqrt(2)

export function pythagorasTwoCircles(): Q {
  // Chosen once, outside the loop, and each arrangement carries its own
  // variation id. Both matter: picking inside meant a rejected snowman retried
  // as an overlap, and one id for all three meant no check could see that the
  // snowman had stopped appearing — which it had, for every attempt, because
  // its diameter label anchored on the very point it was pushed away from.
  const kind = pick(['overlap', 'half-turn', 'snowman'] as const);
  for (let tries = 0; tries < 4000; tries++) {

    if (kind === 'snowman') {
      // the head's diameter is given; everything else follows
      const diameter = getRandomInt(6, 30);
      const r = diameter / 2;
      const bodyR = r * Math.SQRT2;
      const height = r + r + bodyR;
      const fig = twoCircles({
        kind, radius: r, chord: diameter,
        names: { a: 'A', b: 'B', centre: 'S', centre2: 'T' },
        labels: { radius: '', chord: '' },
      });
      if (!fig) continue;
      const prose = [
        `The diagram represents a cartoon snowman.`,
        `&bull;&nbsp; The head is a circle, centre $S$, with diameter ${num(diameter)} centimetres`,
        `&bull;&nbsp; The body is a larger circle, centre $T$`,
        `&bull;&nbsp; $T$ lies on the circumference of the head, and $AB$ is a chord of the body`,
        `Calculate the total height of the snowman. Give your answer correct to one decimal place.`,
      ];
      // Four marks, as every Pythagoras-in-context question in these papers is:
      // •¹ marshal the facts and recognise the right-angled triangle, •² a
      // consistent Pythagoras statement, •³ the third side, •⁴ the length asked
      // for. Three steps meant the middle one carried two.
      const steps = [
        `<strong>1.</strong> $AB$ passes through $S$, so it is a <strong>diameter</strong> of the head, and $T$ lies on the head's circumference:<br><br>$AB = ${num(diameter)}$ cm, $SA = SB = ${num(r)}$ cm and $ST = ${num(r)}$ cm`,
        `<strong>2.</strong> $AB$ is horizontal and $ST$ vertical, so triangle $STB$ is right-angled at $S$, with the body's radius $TB$ as its hypotenuse:<br><br>$TB^{2} = ${num(r)}^{2} + ${num(r)}^{2}$`,
        `<strong>3.</strong> Work that out and take the square root:<br><br>$TB^{2} = ${num(2 * r * r)}$, so $TB = ${bodyR.toFixed(3)}$ cm`,
        `<strong>4.</strong> The height runs from the top of the head down to the bottom of the body — the head's radius, then $ST$, then the body's radius:<br><br>$${num(r)} + ${num(r)} + ${bodyR.toFixed(3)} = ${height.toFixed(1)}$ cm`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Pythagoras with Two Circles',
        difficulty: 'exam',
        variationId: 'pythagoras.two-circles-snowman',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Snowman, head diameter ${num(diameter)}. Total height?`],
        solutionSteps: steps,
        stepMarks: [1, 1, 1, 1],
        finalAnswer: `$${height.toFixed(1)}$ centimetres`,
        figure: fig,
      };
    }

    const r = Number((getRandomInt(50, 300) / 10).toFixed(1));
    // AB is the shared chord for the overlap, and both edges together for the
    // half-turn, so the constraint differs
    const chord = kind === 'overlap'
      ? Number((2 * r * (getRandomInt(55, 88) / 100)).toFixed(1))
      : Number((2 * 2 * r * (getRandomInt(55, 88) / 100)).toFixed(1));
    const each = kind === 'overlap' ? chord : chord / 2;
    if (each >= 2 * r * 0.95) continue;
    const d = Math.sqrt(r * r - (each / 2) ** 2);
    const answer = 2 * (r + d);

    const fig = twoCircles({
      kind, radius: r, chord,
      names: kind === 'overlap'
        ? { a: 'A', b: 'B', centre: 'C' }
        // Unicode, not LaTeX: these are drawn into SVG <text>, which has no
        // renderer behind it. The prose keeps $C_{1}$ because MathJax does.
        : { a: 'A', b: 'B', centre: 'C₁', centre2: 'C₂' },
      labels: { radius: `${num(r)} cm`, chord: `${num(chord)} cm` },
    });
    if (!fig) continue;

    const prose = kind === 'overlap'
      ? [`A door-number sign is made from parts of two identical circles.`,
         `&bull;&nbsp; $AB$ is a chord of both circles, of length ${num(chord)} centimetres`,
         `&bull;&nbsp; The radius $AC$ is ${num(r)} centimetres`,
         `Calculate the width of the sign. Give your answer correct to one decimal place.`]
      : [`A badge is made from two identical shapes, each part of a circle.`,
         `&bull;&nbsp; The circles have centres $C_{1}$ and $C_{2}$, each of radius ${num(r)} centimetres`,
         `&bull;&nbsp; The badge has half-turn symmetry about the midpoint of $AB$`,
         `&bull;&nbsp; $AB$ is ${num(chord)} centimetres long`,
         `Calculate the height of the badge. Give your answer correct to one decimal place.`];

    // Four marks: •¹ marshal the facts and recognise the right-angled triangle,
    // •² a consistent Pythagoras statement, •³ the third side, •⁴ the length
    // asked for. Steps 2 and 3 were one step, so a hint skipped a mark.
    const steps = [
      kind === 'overlap'
        ? `<strong>1.</strong> The perpendicular from a centre to a chord bisects it, so half of $AB$ is $${num(chord)} \\div 2 = ${num(chord / 2)}$ cm.`
        : `<strong>1.</strong> The two shapes meet at the midpoint of $AB$, so each one sits on a chord of half the length: $${num(chord)} \\div 2 = ${num(each)}$ cm. Half of that chord is $${num(each / 2)}$ cm.`,
      `<strong>2.</strong> That half-chord and the distance from the centre form a right-angled triangle with the radius as hypotenuse:<br><br>$d^{2} = ${num(r)}^{2} - ${num(each / 2)}^{2}$`,
      `<strong>3.</strong> Work that out and take the square root:<br><br>$d^{2} = ${num(Number((r * r - (each / 2) ** 2).toFixed(4)))}$, so $d = ${d.toFixed(3)}$ cm`,
      kind === 'overlap'
        ? `<strong>4.</strong> Each circle reaches $d$ past the chord and then a further radius, and there are two of them:<br><br>$2 \\times (${num(r)} + ${d.toFixed(3)}) = ${answer.toFixed(1)}$ cm`
        : `<strong>4.</strong> Each shape stands $r + d$ from $AB$, one above and one below, so the height is twice that:<br><br>$2 \\times (${num(r)} + ${d.toFixed(3)}) = ${answer.toFixed(1)}$ cm`,
    ];

    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Pythagoras with Two Circles',
      difficulty: 'exam',
      variationId: kind === 'overlap'
        ? 'pythagoras.two-circles-overlap' : 'pythagoras.two-circles-half-turn',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`${kind === 'overlap' ? 'Two circles' : 'Two segments'}, radius ${num(r)}, $AB$ ${num(chord)}. Find the ${kind === 'overlap' ? 'width' : 'height'}.`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer.toFixed(1)}$ centimetres`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.two-circles: no valid question found');
}

export const PYTHAGORAS_GENERATORS: Record<string, () => Q> = {
  'Pythagoras with Two Circles': pythagorasTwoCircles,
  '3D Coordinates and Lengths': pythagorasCoordinates,
  'The Space Diagonal of a Cuboid': pythagorasSpaceDiagonal,
  'Finding a Chord or Radius in a Circle': () => pythagorasChordReverse(true),
  'Finding the Radius from a Chord': () => pythagorasChordReverse(false),
  // Three presentations of the converse, and the dispatch is where the third
  // joins: `pythagorasConverse` already splits itself between the plain shape
  // and the from-a-total one.
  'The Converse of Pythagoras': () =>
    getRandomInt(1, 3) === 1 ? pythagorasConverseJoined() : pythagorasConverse(),
  'Pythagoras in a Right-Angled Triangle': pythagorasFindSide,
  'Pythagoras in a Circle': pythagorasChord,
};
