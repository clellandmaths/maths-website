import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
import { getRandomInt } from './utils';
import { rightTriangle } from '../diagrams/shapes/right-triangle';
import { circleChord } from '../diagrams/shapes/circle-chord';
import { triangleFromSides } from '../diagrams/shapes/triangle-sides';
import { cuboid } from '../diagrams/shapes/cuboid';
import { solidOnAxes } from '../diagrams/shapes/solid-on-axes';
import { twoCircles } from '../diagrams/shapes/two-circles';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';
import { twoTrianglesApart } from '../diagrams/shapes/two-triangles-apart';
import type { Figure } from '../diagrams/scene';
import {
  PYTHAGORAS_CONTEXTS, CHORD_CONTEXTS, CONVERSE_CONTEXTS, BOX_CONTEXTS, abbrev,
  withUnit, type ConverseContext,
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

/**
 * **One variation per figure family, because the family is the paper's.**
 *
 * The five papers draw three different pictures of the one question:
 *
 *   segment  2016 P2 Q15, 2022 P2 Q8   an open arc on its chord, radius solid
 *   whole    2015 P2 Q12, 2018 P2 Q12  the whole circle, radius in the prose
 *   cut      2023 P1 Q10               the whole circle, removed arc dashed
 *
 * The routine learned to draw all three earlier today, but the context — and so
 * the family — was still drawn at random, which the owner's family ruling does
 * not allow: press Variation on the tunnel and you could get the milk tank's
 * picture. Within each family the papers are the same question with different
 * numbers, so each family gets one variation and no more.
 *
 * **And `cut` is Paper 1, so its numbers have to come out whole.** 2023 P1 Q10
 * is non-calculator: radius 50, chord 60, half-chord 30, and 30-40-50 is a
 * scaled 3-4-5, so the distance from the centre is exactly 40 and the width
 * exactly 90. Drawn freely the answer is irrational and the clone asked a
 * pupil with no calculator to round it to a decimal place — twelve draws out of
 * twelve, caught by `__checks__/paper-one.ts`. So this branch takes a triple
 * first and builds the circle from it, exactly as `chord-reverse` has done for
 * 2014 P1 Q12 since it was written.
 */
export function pythagorasChord(family: 'segment' | 'whole' | 'cut', askedId?: string): Q {
  const exact = family === 'cut';
  /**
   * **The id this draw will be STAMPED with, which is not always the one
   * asked for.**
   *
   * `pythagoras.chord-whole` serves 2018 P2 Q12; 2015 P2 Q12 sits on the alias
   * `pythagoras.chord-whole-2015`, which resolves to the same target — so
   * `wanted` cannot tell them apart and `asked` can.
   *
   * But **a worksheet built by topic asks for no id at all** and still stamps
   * one, and the id it stamps is 2018's. Keying on `asked === '...-whole'`
   * would then give the by-topic draw 2015's arrangement under 2018's id —
   * two different questions behind one name. That is precisely how 2018 P1
   * Q18's `instructions` red came back after passing when measured by id.
   *
   * So the question is not "was 2018 asked for" but "is 2015 asked for": the
   * alias is the only thing that means 2015, and everything else is 2018.
   */
  const stampedId = family !== 'whole' ? undefined
    : askedId === 'pythagoras.chord-whole-2015' ? askedId
    : 'pythagoras.chord-whole';
  const forPaper2018 = stampedId === 'pythagoras.chord-whole';
  /**
   * **2015 P2 Q12 is a liquid in a container, with its dot and its depth
   * arrow — 2026-09-25.** Measured on the 2015 P2 sheet over 400 draws of its
   * id: a speed bump (2018's unshaded shape above a road) in 140, and no dot
   * at O or depth arrow in any. The paper draws the milk shaded below ML, a
   * dot at O and "Depth of milk" bracketed down the side, and gives ML's
   * length in the words only. The owner: *"Yes key it"*. Keyed on 2015's alias
   * alone; 2018 keeps its own branch.
   */
  const forPaper2015 = stampedId === 'pythagoras.chord-whole-2015';
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(CHORD_CONTEXTS.filter(c => c.family === family
      && (c.only === undefined || c.only === stampedId)
      && (!forPaper2015 || c.only === stampedId)));
    const [lo, hi] = ctx.band;
    let r: number, chord: number, d: number;
    if (exact) {
      // The triple comes first and the figure is built from it, so the distance
      // from the centre — and therefore the answer — is a whole number.
      // The same proportion the free branch keeps and every paper draws: the
      // chord between 0.55 and 0.85 of the diameter, which against the radius
      // is the same ratio for the half-chord. Without it the pool offers
      // (24, 7, 25) — a chord a quarter of the width — and (7, 24, 25), a chord
      // all but the diameter. Neither is a shape a paper sets.
      const fits = CHORD_TRIPLES.flatMap(([legD, legH, hyp]) =>
        CHORD_SCALES.map(k => ({ d: legD * k, half: legH * k, r: hyp * k })))
        .filter(t => t.r >= lo && t.r <= hi
          && t.half >= t.r * 0.55 && t.half <= t.r * 0.85);
      // **Every printed number whole, because this is Paper 1.** The branch
      // above says so in its own words - "cut is Paper 1, so its numbers have
      // to come out whole" - and CHORD_SCALES carries a 0.5 for the Paper 2
      // families, which put a radius of 7.5 and 37.5 on the page. Squaring 7.5
      // by hand is 56.25, which is not a sum this paper sets: 2023 P1 Q10 is
      // 50, 60 and 90 throughout. Found by scripts/audit-number-scale.mts.
      const whole = fits.filter(t => Number.isInteger(t.r) && Number.isInteger(t.half)
        && Number.isInteger(t.d));
      if (!whole.length) continue;
      if (!fits.length) continue;
      const t = pick(whole);
      [r, chord, d] = [t.r, t.half * 2, t.d];
    } else if (forPaper2018) {
      /**
       * **Whole numbers in the question — the owner, on the 2018 P2 sheet:**
       *
       * > *"I'd also like to see less funky numbers, perhaps whole numbers
       * > given in the question."*
       *
       * Right, and it is the same fault as 2018 P2 Q11's standard form: the
       * radius and chord were drawn to whatever fell out, so the page printed
       * a radius of 42.1 cm across a chord of 66.5 cm. **Both papers do it the
       * other way round** — 13 and 20 in 2018, 1.2 and 1.8 in 2015 — and let
       * the ANSWER be the untidy one, 21.3 and 1.99. Tidy givens and an
       * untidy answer is what an exam sets.
       *
       * The chord is drawn EVEN as well as whole, because step 2 halves it:
       * 2018's own reads "20 ÷ 2 = 10", and an odd chord would print 8.5.
       */
      r = getRandomInt(lo, hi);
      const half = getRandomInt(Math.ceil(r * 0.55), Math.floor(r * 0.85));
      chord = half * 2;
      if (half < 1 || half > r * 0.85 || chord >= 2 * r * 0.95) continue;
      d = Math.sqrt(r * r - half * half);
      // The whole point is an untidy answer, so a draw that happens to land on
      // a Pythagorean triple is the one shape to refuse here: it would print a
      // width that needs no rounding at all, which is 2023 P1 Q10's question,
      // not this one.
      if (Number.isInteger(d)) continue;
    } else {
      r = Number((getRandomInt(lo * 10, hi * 10) / 10).toFixed(1));
      // Every paper puts the chord between 0.6 and 0.8 of the diameter — 4
      // across a 5.8 m tunnel, 20 across a 26 cm circle, 60 across a 100 cm
      // slab. Wider than that and the segment is a sliver; narrower and the
      // "shape" is nearly the whole circle, which gave a fuel tank 5.8 m tall
      // on a 2 m base.
      chord = Number((2 * r * (getRandomInt(55, 85) / 100)).toFixed(1));
      if (chord >= 2 * r * 0.95) continue;
      d = Math.sqrt(r * r - (chord / 2) ** 2);
    }
    // Always the larger piece — all eight papers are. See `ChordContext`.
    const height = r + d;
    /**
     * **The answer may not be a number already printed in the question.**
     *
     * The triple pool is all 3-4-5 proportions. In the ones where the
     * half-chord is the 4, the width is `r + d = 5k + 3k = 8k` and the chord is
     * `2 x 4k = 8k` — the same number — so radius 30 with a chord of 48 answers
     * 48, which a pupil can "get" by copying a given.
     *
     * That was every draw, and the cause was in the figure rather than here:
     * 2023 P1 Q10's own shape — radius 50, chord 60, answering 90 — could not
     * be drawn, because the radius label landed on the chord and `verifyFigure`
     * rejected it. The giveaway shapes were simply the ones that rendered. Both
     * halves are fixed now (see the radius label note in circle-chord.ts), so
     * this guard has a pool to work with.
     */
    if (height === chord || height === r) continue;
    if (height < 0.4) continue;

    /**
     * **The word on the arrow is the question's own word.**
     *
     * It was `sideways ? 'width' : 'height'`, which is right for the four new
     * upright contexts and wrong for the two liquids: the arrow read "height"
     * beside a question asking for *the depth of the water*, and 2015 P2 Q12's
     * own paper labels that arrow "Depth of milk". That arrow is mine, added
     * yesterday at the owner's request, so this is repairing it rather than
     * widening anything.
     *
     * `asks` is always "the <word> of the <thing>", so the second word is the
     * noun — and taking it from there means the arrow cannot disagree with the
     * question no matter what context is added later.
     *
     * **Keyed to 2018, like the arrow itself.** The `cut` contexts include
     * "the depth of the doorstep", and 2023 P1 Q10 is signed off: changing its
     * step 4 to say "depth" would move a locked question for no reason anybody
     * asked. And 2015 P2 Q12 keeps the old word until its own review — the
     * owner, 2026-09-23: *"Key them to 2018 only for now"*. It had reached
     * 2015 unkeyed, declared on the sheet but never approved for that paper.
     */
    const spanWord = forPaper2018 || forPaper2015
      ? (ctx.asks.split(' ')[1] ?? 'height')
      : (ctx.sideways ? 'width' : 'height');

    const [O, A, B] = pick([['O', 'A', 'B'], ['C', 'P', 'Q'], ['O', 'M', 'N']]);
    // Three figure families for one question — see `ChordContext.family`.
    // The radius is on the figure only where the paper puts it there; the
    // prose states it in every case, as every paper does.
    const drawn = {
      segment: { rest: 'none', radiusLine: 'solid', shade: false },
      whole: { rest: 'solid', radiusLine: 'none', shade: !!ctx.flip },
      cut: { rest: 'dashed', radiusLine: 'dashed', shade: false },
    } as const;
    const fig = circleChord({
      radius: r, chord, major: true, flip: ctx.flip, sideways: ctx.sideways,
      ...drawn[ctx.family],
      /**
       * **2018 P2 Q12 draws the SHAPE, not the circle it came from.**
       *
       * Counted off the scan
       * (`Current Deployment/src/public/img/N5_Past_Papers/2018/2018_P2_Q12.png`):
       * the outline is one arc from A round the left to B and the straight
       * chord back up. **There is no arc to the right of AB.** 2015 P2 Q12,
       * on the same id through its alias, draws the whole circle with the milk
       * shaded — so the two papers on this routine print different figures,
       * and by the owner's own ruling a figure that differs is a different
       * question.
       *
       * The family was set from a different attribute — "the radius is given
       * in the prose and not drawn", which both papers do — and the outline
       * was read to match. It was wrong for 2018 from the start.
       *
       * It matters for the answer, not only the look: with the whole circle
       * drawn, the width arrow runs from the far arc to the chord while the
       * circle carries on past it, so the span asked for and the span drawn
       * are two different lengths on the page (`r + d` against `2r`). The
       * paper has nothing past the chord and cannot be misread.
       *
       * **Keyed, so 2015 keeps its own picture**, which is right for 2015.
       */
      ...(forPaper2018 ? { rest: 'none' as const } : {}),
      /**
       * **2018 P2 Q12 marks the centre and arrows the span it asks for.**
       *
       * The owner, on the 2018 P2 sheet: *"Put a dot in the centre and show
       * arrow line outside circle showing which length to calculate"*. The
       * paper does both — a dot at O, and an arrow along the bottom labelled
       * "width" — and the clone did neither, so "calculate the width of the
       * shape" could only be settled from the prose.
       *
       * **Keyed to 2018 P2 Q12 alone.** It was scoped to the `whole` family,
       * which reached 2015 P2 Q12 through its alias as well — declared, never
       * approved for 2015. The owner, 2026-09-23: *"Key them to 2018 only for
       * now"*. 2015's review decides whether it wants them; its paper does
       * bracket "Depth of milk" down the side. The other two families are
       * other papers, several signed off, and never had them.
       *
       * The word is `spanWord`, as step 4's is, so the arrow and the working
       * cannot disagree.
       */
      /**
       * **And 2016 P2 Q15 the same way — 2026-09-24.** Its paper draws a
       * "height of label" arrow down the side; the owner, on the 2016 P2
       * sheet: *"Add height arrow, out dot in centre of circle"*. Keyed on
       * 2016's asked id, so LOCKED 2022 P2 Q8 on the same family is untouched.
       */
      centreDot: forPaper2018 || forPaper2015 || askedId === 'pythagoras.chord-pre2022',
      // 2018's paper dots A and B too — the owner: "Put the dots in for A and B".
      endDots: forPaper2018,
      askedSpan: forPaper2018 ? spanWord
        : forPaper2015 ? ctx.asks.replace(/^the /, '')
        : askedId === 'pythagoras.chord-pre2022' ? ctx.asks.replace(/^the /, '') : undefined,
      names: { a: A, b: B, centre: O },
      labels: {
        radius: `${num(r)} ${abbrev(ctx.unit)}`,
        // 2015's paper gives ML's length in the words only.
        chord: forPaper2015 ? '' : `${num(chord)} ${abbrev(ctx.unit)}`,
        height: '',
      },
    });

    const prose = [
      ctx.scene(O, A, B),
      `&bull;&nbsp; The radius $${O}${B}$ is ${withUnit(Number(num(r)), ctx.unit)}`,
      `&bull;&nbsp; The chord $${A}${B}$ is ${num(chord)} ${ctx.unit}`,
      // No rounding instruction on the Paper 1 branch: the triple makes the
      // answer exact, and not one of the 160 Paper 1 questions in the corpus
      // asks for a rounded answer.
      `Calculate ${ctx.asks}.${exact ? '' : ' Give your answer correct to one decimal place.'}`,
    ];
    const steps = [
      `<strong>1.</strong> The perpendicular from the centre to a chord bisects it, so drop it from $${O}$ to the midpoint $M$ of $${A}${B}$. That makes a right-angled triangle $${O}M${B}$, with $${O}${B}$ as its hypotenuse.`,
      `<strong>2.</strong> Half the chord is $${num(chord)} \\div 2 = ${num(chord / 2)}$ ${ctx.unit}. Now use Pythagoras to find $${O}M$:<br><br>$${O}M^{2} = ${num(r)}^{2} - ${num(chord / 2)}^{2} = ${num(Number((r * r - (chord / 2) ** 2).toFixed(4)))}$`,
      `<strong>3.</strong> So $${O}M = ${exact ? num(d) : d.toFixed(3)}$ ${ctx.unit}.`,
      // "height" reads wrong on a chord stood on end, where the answer runs
      // across the page — and equally wrong on a depth. `spanWord` is the
      // question's own noun for 2018 P2 Q12 and the old expression everywhere
      // else, so the working and the arrow say the same thing and 2015 P2 Q12
      // and the signed-off papers on the other two families do not move.
      `<strong>4.</strong> The shape is the larger piece, so its ${spanWord} is the radius <strong>plus</strong> $${O}M$:<br><br>$${num(r)} + ${exact ? num(d) : d.toFixed(3)} = ${exact ? num(height) : height.toFixed(1)}$ ${ctx.unit}`,
    ];

    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Pythagoras in a Circle',
      difficulty: 'exam',
      variationId: family === 'segment' ? 'pythagoras.chord'
        : family === 'whole' ? 'pythagoras.chord-whole' : 'pythagoras.chord-cut',
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
      finalAnswer: `$${exact ? num(height) : height.toFixed(1)}$ ${ctx.unit}`,
      figure: fig,
    };
  }
  throw new Error(`pythagoras.chord (${family}): no valid question found`);
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

/**
 * **2014 P2 Q6 is a compass question about three towns.** — 2026-09-25
 *
 * *"Lowtown is due west of Midtown … Is Hightown directly north of Lowtown?
 * Justify your answer."* Measured on the 2014 P2 sheet, 400 draws of its id:
 * "due west" and "directly north" in 0, towns in 53. The owner: *"Yes"* to
 * three towns, one due west of another, asked whether the third is directly
 * north of it, with the figure the paper's way up. Yes or No stays free.
 *
 * `-pre2023` cites 2014 P2 Q6 alone and is an ALIAS of `pythagoras.converse`
 * (LOCKED 2023 P2 Q8), so this is keyed on the asked id and only that id
 * leaves the shared draw.
 */
const CONVERSE_2014 = 'pythagoras.converse-pre2023';
/** [west, east, north] — invented towns, as the paper's are. */
const TOWNS_2014: [string, string, string][] = [
  ['Lowtown', 'Midtown', 'Hightown'],
  ['Kirkton', 'Easton', 'Northfield'],
  ['Brigend', 'Carnock', 'Hillhead'],
  ['Ashby', 'Dunlie', 'Tarland'],
  ['Balmore', 'Ferness', 'Strathy'],
  ['Rossie', 'Glenview', 'Moniack'],
];
const TOWNS_CONTEXT_2014: ConverseContext = {
  scene: () => 'The diagram below shows the position of three towns.',
  asks: () => '', unit: 'kilometres', band: [30, 160],
};

export function pythagorasConverse(wanted?: string, asked?: string): Q {
  const is2014 = asked === CONVERSE_2014;
  for (let tries = 0; tries < 400; tries++) {
    const ctx = is2014 ? TOWNS_CONTEXT_2014 : pick(CONVERSE_CONTEXTS);
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
     * 2026 P2 Q7 has no context and no diagram at all.
     *
     *   "A triangle has sides of length 88 metres, 105 metres and 137 metres.
     *    Determine whether the triangle is right-angled. Justify your answer."
     *
     * Every other converse paper sets the test inside something — three towns,
     * a beam against a wall — and draws it. That difference is what the marks
     * are about: the contextual papers pay four, with the comparison and the
     * conclusion bought separately, and 2026 pays three, merging them.
     *
     *   •¹ start a valid strategy                       88² + 105² and 137²
     *   •² carry that strategy through and evaluate      both 18769
     *   •³ compare explicitly, then state the conclusion
     *
     * Until now this generator only ever produced the contextual shape, so
     * 2026 P2 Q7 had no clone that matched it: pressing Variation on a bare
     * three-sides question returned a towns-and-distances diagram worth four
     * marks. The registry carried the gap as `marksDiffer`.
     */
    // All three shapes chosen in one draw, so adding the third did not quietly
    // halve the second. Nesting two independent one-in-three tests left
    // `converse-from-total` on two draws in nine, which `mix.ts` reads as
    // suppressed about half the time — a flaky check being the symptom, not
    // the fault.
    // Taught: each shape stamps its own id, so the asked id names the shape.
    const shape = wanted === 'pythagoras.converse-sides' ? 'bare' as const
      : wanted === 'pythagoras.converse-from-total' ? 'from-total' as const
      : wanted === 'pythagoras.converse' ? 'context' as const
      : pick(['bare', 'from-total', 'context'] as const);

    if (shape === 'bare') {
      const sumSq = p * p + q * q;
      const longSq = r * r;
      const verdict = right
        ? 'Yes — the triangle is right-angled'
        : 'No — the triangle is not right-angled';
      // The paper lists its three sides shortest first — "88 metres, 105
      // metres and 137 metres" — and `r` is the longest by construction, so
      // only the two shorter ones need putting in order.
      const [shorter, longer] = p <= q ? [p, q] : [q, p];
      const prose = [
        `A triangle has sides of length ${shorter} ${ctx.unit}, ${longer} ${ctx.unit} and ${r} ${ctx.unit}.`,
        `Determine whether the triangle is right-angled.`,
        `Justify your answer.`,
      ];
      // The scheme buys writing the strategy down and evaluating it as two
      // separate marks, which is a finer split than the contextual papers use —
      // so the steps follow the scheme rather than mirroring the other branch.
      const steps = [
        `<strong>1.</strong> The longest side is ${r} ${ctx.unit}, so test the other two against it:<br><br>$${p}^{2} + ${q}^{2}$ and $${r}^{2}$`,
        `<strong>2.</strong> Work both out:<br><br>$${p}^{2} + ${q}^{2} = ${p * p} + ${q * q} = ${sumSq}$ and $${r}^{2} = ${longSq}$`,
        right
          ? `<strong>3.</strong> Compare them, and conclude:<br><br>$${sumSq} = ${longSq}$, so $${p}^{2} + ${q}^{2} = ${r}^{2}$. Pythagoras holds, so <strong>${verdict.toLowerCase()}</strong>.`
          : `<strong>3.</strong> Compare them, and conclude:<br><br>$${sumSq} \\neq ${longSq}$, so $${p}^{2} + ${q}^{2} \\neq ${r}^{2}$. Pythagoras does not hold, so <strong>${verdict.toLowerCase()}</strong>.`,
      ];
      // **The paper draws the triangle.** No vertex letters, the three lengths
      // on the three sides, tilted rather than sitting on a flat base.
      //
      // This variation shipped with no figure at all, because its prose — "a
      // triangle has sides of length…" — was read instead of its picture.
      // `diagram-questions.md` §2 warns against exactly that in its second
      // paragraph. The lengths are the only givens, so the figure carries them
      // and nothing else.
      const bareFig = triangleFromSides({
        sides: { ab: r, bc: q, ca: p },
        vertices: ['', '', ''],
        labels: {
          ab: `${r} ${abbrev(ctx.unit)}`,
          bc: `${q} ${abbrev(ctx.unit)}`,
          ca: `${p} ${abbrev(ctx.unit)}`,
        },
        turn: pick([0, 1, 2, 3] as const),
      });
      if (!bareFig) continue;
      if (verifyFigure(bareFig, [...prose, ...steps].join(' ')).length) continue;

      return {
        subTopic: 'The Converse of Pythagoras',
        difficulty: 'exam',
        variationId: 'pythagoras.converse-sides',
        questionLines: [prose[0], renderScene(bareFig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Sides ${p}, ${q}, ${r}. Right-angled?`],
        solutionSteps: steps,
        stepMarks: [1, 1, 1],
        finalAnswer: `${verdict}, since $${p}^{2} + ${q}^{2} = ${sumSq}$ and $${r}^{2} = ${longSq}$`,
        figure: bareFig,
      };
    }

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
    if (is2014) {
      // West at the origin and east along the axis, so the north town sits
      // above the west one, as the paper draws it. The corner tested is the
      // west town, opposite the longest distance.
      const [W, E, N] = pick(TOWNS_2014);
      const [we, nw] = pick([[p, q], [q, p]] as const);
      const fig14 = triangleFromSides({
        sides: { ab: we, bc: r, ca: nw },
        vertices: [W, E, N],
        labels: { ab: `${we} km`, bc: `${r} km`, ca: `${nw} km` },
        turn: 0,
      });
      if (!fig14) continue;
      const sumSq = we * we + nw * nw, longSq = r * r;
      const verdict = right
        ? `Yes — ${N} is directly north of ${W}`
        : `No — ${N} is not directly north of ${W}`;
      const prose = [
        ctx.scene('', '', ''),
        `${W} is due west of ${E}.`,
        `The distance from`,
        `&bull; ${W} to ${E} is ${we} kilometres.`,
        `&bull; ${E} to ${N} is ${r} kilometres.`,
        `&bull; ${N} to ${W} is ${nw} kilometres.`,
        `Is ${N} directly north of ${W}? Justify your answer.`,
      ];
      const steps = [
        `<strong>1.</strong> The longest distance is ${r} km, from ${E} to ${N}, so if there is a right angle it is at ${W}, opposite it. Test the two shorter distances against it.`,
        `<strong>2.</strong> Square the two shorter distances and add, then square the longest:<br><br>$${we}^{2} + ${nw}^{2} = ${we * we} + ${nw * nw} = ${sumSq}$ and $${r}^{2} = ${longSq}$`,
        right
          ? `<strong>3.</strong> Compare the two:<br><br>$${sumSq} = ${longSq}$, so they are <strong>equal</strong>`
          : `<strong>3.</strong> Compare the two:<br><br>$${sumSq} \\neq ${longSq}$, so they are <strong>not equal</strong>`,
        right
          ? `<strong>4.</strong> Pythagoras holds, so the angle at ${W} is a right angle. ${W} to ${E} runs due east, so ${W} to ${N} runs due north:<br><br>${verdict}`
          : `<strong>4.</strong> Pythagoras does not hold, so the angle at ${W} is not a right angle. ${W} to ${E} runs due east, so ${W} to ${N} cannot run due north:<br><br>${verdict}`,
      ];
      if (verifyFigure(fig14, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'The Converse of Pythagoras',
        difficulty: 'exam',
        variationId: 'pythagoras.converse',
        questionLines: [prose[0], prose[1], renderScene(fig14.scene), ...prose.slice(2)],
        boardQuestionLines: [`${W}–${E} ${we}, ${E}–${N} ${r}, ${N}–${W} ${nw}. Is ${N} due north of ${W}?`],
        solutionSteps: steps,
        stepMarks: [1, 1, 1, 1],
        finalAnswer: `${verdict}, since $${we}^{2} + ${nw}^{2} = ${sumSq}$ and $${r}^{2} = ${longSq}$`,
        figure: fig14,
      };
    }

    const fromTotal = shape === 'from-total';
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
    /**
     * **The join must be readable off the lengths.** — 2026-09-23
     *
     * The pupil carries the lengths across from the two parts to a joined
     * figure that has none, and does it by finding the one edge A and B have
     * in common. 2017 P2 Q7's parts share exactly one length, 7 cm. In 146 of
     * 400 draws here they shared two — A 12, 10, 14 against B 8, 14, 10 — or
     * one part carried the shared length twice, and which edge was joined
     * could not be told from the numbers. The owner: *"Yes drop the
     * composites don't widen"*.
     */
    const A = [z1, d, X], B = [z2, Y, d];
    const clearJoin = A.filter(v => v === d).length === 1 && B.filter(v => v === d).length === 1
      && A.every(v => v === d || !B.includes(v));
    if (!clearJoin) continue;
    const base = z1 + z2;
    const unit = pick(['centimetres', 'metres']);
    const u = abbrev(unit);
    const [nA, nB, nC, nF] = pick(JOINED_NAMES);

    const sumSq = X * X + Y * Y;
    const longSq = base * base;
    // The joined figure carries no vertex letters, so nothing here may name
    // one. 2017 P2 Q7's own scheme answers "8² + 19² ≠ 22²; No".
    const verdict = right
      ? 'Yes — the larger triangle is right-angled'
      : 'No — the larger triangle is not right-angled';

    const prose = [
      `Triangles $A$ and $B$ are shown below.`,
      `The triangles are placed together to form the larger triangle shown below.`,
      `Is this larger triangle right-angled? Justify your answer.`,
    ];

    // 2017 P2 Q7 is THREE marks where the other converse papers are four: •¹ a
    // valid strategy, •² evaluation, •³ the comparison and the conclusion
    // together. So the comparison does not get a step of its own here, and the
    // last step is still the one that states the answer.
    const steps = [
      `<strong>1.</strong> Placing the two together makes a triangle whose base is the two bases added, and whose other two sides are the outer sides of $A$ and $B$. The shared edge, ${d} ${unit}, ends up inside the new triangle and is not one of its sides:<br><br>base $= ${z1} + ${z2} = ${base}$ ${unit}, with sides ${X} ${unit} and ${Y} ${unit}<br><br>The base is the longest side, so if there is a right angle it is opposite it.`,
      `<strong>2.</strong> Square the two shorter sides and add, then square the longest:<br><br>$${X}^{2} + ${Y}^{2} = ${X * X} + ${Y * Y} = ${sumSq}$ and $${base}^{2} = ${longSq}$`,
      right
        ? `<strong>3.</strong> $${sumSq} = ${longSq}$, so Pythagoras holds:<br><br>${verdict}`
        : `<strong>3.</strong> $${sumSq} \\neq ${longSq}$, so Pythagoras does not hold:<br><br>${verdict}`,
    ];

    const text = [...prose, ...steps].join(' ');

    // ── three figures, as the paper prints three ─────────────────────────────
    //
    // 2017 P2 Q7 shows triangle A with its own three sides, triangle B with
    // its own three, and only then the pair joined, **bare**. Carrying the
    // lengths across is the first mark: the new base is z1 + z2 and the outer
    // sides are X and Y, and none of that is written on the joined figure.
    //
    // This drew only the joined figure with every length already on it — the
    // same maths, a different question, because the clone had done the step it
    // was asking for. Recorded in `docs/clone-verdicts.md`.
    //
    // Each part is its own figure rather than two triangles in one scene: one
    // scene means one viewBox scaled to a fixed width, so each triangle comes
    // out half-size and the shared edge's two labels — the same number, facing
    // each other — collided in eleven of fourteen sampled layouts.
    //
    // **The turn is searched, not guessed.** These parts are often slivers, and
    // a sliver has one or two poses in which its three side labels clear each
    // other. Taking a random turn and rejecting the whole draw left only 40 of
    // 352 tuple-and-turn combinations usable, and `converse-joined` threw once
    // in ten whole draws — which failed the topic, not just this variation.
    // **Base down first, and only turned if it has to be.** The three figures
    // are read together — these two make that one — and that reading is lost
    // when each is posed independently: one draw had both parts sitting on
    // their bases and the join standing on end. The paper draws all three the
    // same way up. Turning is kept as the fallback for a sliver whose labels
    // will not clear in the natural pose.
    // **One figure holding both parts, so they share a scale.** Drawn as two
    // figures they each fill their own box, and a 6-7-8 triangle comes out the
    // same size as a 16-19-7 one. The paper draws A visibly smaller than B, and
    // that relative size is the cue that the two fit together — a pupil reads
    // "these make that" off the picture before reading a number.
    //
    // The cost is that each is half as wide, so its labels are relatively
    // bigger and the shared edge's length is written twice facing across the
    // gap. Both turns are searched, sixteen pairs, and 30 of the 88 tuples have
    // a pair that clears. A wider gap does not help: it shrinks the triangles
    // in the same breath, and at 1.8x the usable tuples fall to 14.
    /**
     * **One turn for all three figures.** — 2026-09-23
     *
     * The parts were each searched over four turns, independently of each
     * other and of the join, so A could come out on its side and B upright
     * beside a joined figure standing base-down. The paper draws A, B and the
     * join all the same way up, and that is how a pupil sees which edge meets
     * which. The owner: *"make the varied diagrams clearer. The actual
     * question shows the triangles in same orientation before and after
     * joining"*. All three share one frame — base from the origin, apex above
     * — so the same turn keeps every edge where it is in the join.
     *
     * **Base down only.** Turning all three together still keeps each part's
     * edges where they are, but the parts stand side by side while the turned
     * join stacks them one above the other, which is a second thing to undo
     * before the pupil can read it. The paper draws all three base down.
     * Measured: 24 of the 38 clear part pairs place base down; allowing the
     * quarter turns as well would place 36.
     */
    let parts: Figure | null = null;
    let fig: Figure | null = null;
    for (const turn of [0] as const) {
      const p = twoTrianglesApart({
        left: { sides: [z1, d, X], labels: [`${z1} ${u}`, `${d} ${u}`, `${X} ${u}`], name: 'A', turn },
        right: { sides: [z2, Y, d], labels: [`${z2} ${u}`, `${Y} ${u}`, `${d} ${u}`], name: 'B', turn },
      });
      if (!p || verifyFigure(p, text).length) continue;
      // No vertex letters and no letter on the foot: the paper's joined figure
      // carries none. Only the two parts are named, and the prose names them.
      const j = triangleFromSides({
        sides: { ab: base, bc: Y, ca: X },
        vertices: ['', '', ''],
        labels: { ab: '', bc: '', ca: '' },
        cevian: {
          at: z1, length: d, name: '',
          labels: { left: '', right: '', line: '' },
          partNames: ['A', 'B'],
        },
        turn,
      });
      if (!j || verifyFigure(j, text).length) continue;
      [parts, fig] = [p, j];
      break;
    }
    if (!parts || !fig) continue;

    return {
      subTopic: 'The Converse of Pythagoras',
      difficulty: 'exam',
      variationId: 'pythagoras.converse-joined',
      // Three figures, as the paper prints three: each part with its own
      // lengths, then the join with none.
      questionLines: [
        prose[0], renderScene(parts.scene),
        prose[1], renderScene(fig.scene),
        prose[2],
      ],
      boardQuestionLines: [`Base ${z1} + ${z2}, sides ${X} and ${Y}. Right-angled?`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `${verdict}, since $${X}^{2} + ${Y}^{2} = ${sumSq}$ and $${base}^{2} = ${longSq}$`,
      // The parts figure carries the claims: every length the question gives is
      // on it, and the joined figure is bare by design. Both are verified above.
      figure: parts,
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
    /**
     * **`sideways` contexts belong to 2023 P1 Q10 and nothing else.**
     *
     * `CHORD_CONTEXTS` is shared, and this routine reads it unfiltered. The
     * three contexts added for that question's orientation landed here too,
     * and `frozen` named 2026 P2 Q5 — SIGNED OFF — and 2014 P1 Q12 the moment
     * they did. This routine draws its figure upright and does not pass
     * `sideways` through, so those stories would have been told against the
     * wrong picture even if nothing had been frozen.
     *
     * *A shared list is shared.* Fifth time on this project.
     */
    const ctx = pick(CHORD_CONTEXTS.filter(c => !c.sideways));
    const [lo, hi] = ctx.band;
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
      /**
       * **2014 P1 Q12 as the paper sets it — 2026-09-25.** The owner, on the
       * 2014 P1 sheet: *"Yes all 3"*. Measured over 400 draws before:
       *
       * - **The answer was already in the question in 291.** The 3-4-5 trap
       *   the other chord questions fixed: with the half-chord the 4, the
       *   height is 8k and the chord is 8k, so the answer copies the height.
       *   The paper's 15, 12, 9 has the half-chord as the SHORT leg, and a
       *   given that equals the answer is refused outright.
       * - **Lengths such as 12.5 in 182**, on a non-calculator paper; the
       *   paper's 15, 27 and 18 are whole. Whole numbers only.
       * - **The figure was not the paper's.** The paper letters the chord PQ,
       *   its midpoint A, and B at the far end of the line through the centre
       *   C (dotted), with no number on the figure: "A is the mid-point of
       *   chord PQ. The length of AB is 27 centimetres."
       *
       * This branch is 2014's alone; `chord-radius` (2026 P2 Q5) is the other.
       */
      const fits = CHORD_TRIPLES.flatMap(([legD, legH, hyp]) =>
        CHORD_SCALES.map(k => ({ d: legD * k, half: legH * k, r: hyp * k })))
        // No context band: this branch prints the paper's plain "a circle,
        // centre C" and takes only the unit from the context, so a band made
        // for a doorstep or a flower bed only threw away small radii.
        .filter(t => Number.isInteger(t.r) && Number.isInteger(t.d) && Number.isInteger(t.half)
          // Radius at most 15, the paper's own: squaring by hand on a
          // non-calculator paper. The owner, on the 2014 P1 sheet: "Yes cap
          // to 15", against radii up to 75 (75^2 by hand).
          && t.r <= 15);
      if (!fits.length) continue;
      const t = pick(fits);
      // The paper's own five letters, and two sets like it.
      const [cN, pN, qN, aN, bN] = pick([['C', 'P', 'Q', 'A', 'B'], ['O', 'R', 'S', 'M', 'N'], ['O', 'E', 'F', 'G', 'H']]);

      const r = t.r;
      const chord = 2 * t.half;
      const height = r + t.d;
      const dShown = t.d;
      const halfChord = t.half;
      const answer = chord;
      if (answer < r * 0.4) continue;
      if (answer === height || answer === r) continue;   // never a given

      // 2014 P1 Q12 draws the whole circle and the line from the chord's
      // midpoint A through the centre to B on the far side — solid, and with
      // no number on it, because AB = 27 is given in the words.
      const fig = circleChord({
        radius: r, chord, major: true, rest: 'solid', radiusLine: 'none',
        names: { a: pN, b: qN, centre: cN, mid: aN, far: bN },
        centreDot: true, spanLine: true,
        labels: { radius: '', chord: '', height: '' },
      });
      const prose = [
        // 2014 P1 Q12: "The diagram below shows a circle, centre C."
        `The diagram below shows a circle, centre $${cN}$.`,
        `The radius of the circle is ${withUnit(r, ctx.unit)}.`,
        `$${aN}$ is the mid-point of chord $${pN}${qN}$.`,
        `The length of $${aN}${bN}$ is ${withUnit(height, ctx.unit)}.`,
        // No rounding instruction: the triple makes the answer exact, and
        // 2014 P1 Q12 asks for none either.
        `Calculate the length of $${pN}${qN}$.`,
      ];
      // 2014 P1 Q12 is four marks: •¹ marshal the facts and recognise the right
      // angle, •² know how to use Pythagoras, •³ the correct calculation, •⁴ the
      // length asked for.
      const steps = [
        `<strong>1.</strong> $${aN}${bN}$ runs from the midpoint $${aN}$ through the centre $${cN}$ to the circle, so the part from $${cN}$ to $${aN}$ is $${aN}${bN}$ minus the radius:<br><br>$${cN}${aN} = ${num(height)} - ${num(r)} = ${num(dShown)}$ ${ctx.unit}`,
        `<strong>2.</strong> The line from the centre to the midpoint of a chord is perpendicular to it, so $${cN}${aN}${qN}$ is right-angled with $${cN}${qN}$, a radius, as its hypotenuse:<br><br>$${aN}${qN}^{2} = ${num(r)}^{2} - ${num(dShown)}^{2}$`,
        `<strong>3.</strong> Work that out and take the square root:<br><br>$${aN}${qN}^{2} = ${num(r * r - dShown * dShown)}$, so $${aN}${qN} = ${num(halfChord)}$ ${ctx.unit}`,
        `<strong>4.</strong> The chord is twice $${aN}${qN}$:<br><br>$${pN}${qN} = 2 \\times ${num(halfChord)} = ${num(answer)}$ ${ctx.unit}`,
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
    //
    /**
     * **Both given lengths are whole numbers.** The owner, twice on the
     * 2026-2023 sign-off sheet: *"I'd keep the numbers given whole on these
     * like the question based on"*, and *"Keep lengths given whole"*.
     *
     * 2026 P2 Q5 gives a chord of **25** and a perpendicular of **9**, and
     * answers 15.4(02...). The irrational number is the one being asked for -
     * that is what the rounding instruction is for - and the two handed over
     * are whole. The generator had it the other way round: it drew the radius
     * free to one decimal place and derived the chord and the perpendicular
     * from it, so the question printed "AC is 3 metres, OM is 1.2 metres" and
     * a pupil squared 1.2 to get at a radius that was round all along.
     *
     * So the draw runs the way the paper reads. The chord and the
     * perpendicular are whole; the radius is whatever they make it, and is
     * rejected if it lands near a whole number, because "15.0" is not an
     * answer that wants rounding to one decimal place.
     *
     * The proportion is the one every paper draws and the free branch kept -
     * chord between 0.55 and 0.85 of the diameter - which in terms of the two
     * numbers actually drawn puts the perpendicular between 0.31 and 0.76 of
     * the chord. Enforced by construction now rather than by a reject.
     */
    const chord = getRandomInt(Math.ceil(lo * 1.1), Math.floor(hi * 1.7));
    const dLo = Math.ceil(chord * 0.31), dHi = Math.floor(chord * 0.76);
    if (dHi < dLo) continue;
    const dShown = getRandomInt(dLo, dHi);
    const answer = Math.hypot(chord / 2, dShown);
    if (answer < lo || answer > hi) continue;
    if (Math.abs(answer - Math.round(answer)) < 0.05) continue;
    // 2026 P2 Q5 draws the whole circle, letters the midpoint, and draws the
    // centre-to-midpoint segment solid with its length on it — that is the
    // given. No radius to a chord end; no right angle.
    const M = 'M';
    // **Drawn from the numbers the question prints, not the ones it was built
    // from.** The chord and OM are given to one decimal place, so the circle
    // those two describe has radius hypot(chord/2, OM) - not the r this loop
    // started with, whose own distance to the chord was 1.52 where the question
    // says 1.5. `circleChord` derives the claim from the radius it is handed,
    // so the figure claimed a number the question did not carry and
    // `verifyFigure` threw the attempt away: **11,078 of 11,277 attempts, 98%,
    // and 88% of those for this one reason.** The loop survived on the one try
    // in fifty where d landed on a tenth already, and `diagrams.ts` caught the
    // tail where four hundred tries all missed. Handing it the radius the
    // question describes makes the picture agree with the text and the retry
    // budget a formality.
    const fig = circleChord({
      // The paper draws dashed lines from the chord out to its
      // dimension arrow. Opt-in, so every other caller of this shape
      // is untouched — the owner's condition was "only affect this
      // question".
      chordExtensions: true,
      // 2026 P2 Q5 marks the centre with a dot. The owner, 2026 re-review: "Yes".
      centreDot: true,
      radius: answer, chord, major: true, rest: 'solid', radiusLine: 'none',
      names: { a: A, b: B, centre: O, mid: M },
      labels: { radius: '', chord: `${num(chord)} ${abbrev(ctx.unit)}`, height: '',
                centreToChord: `${num(dShown)} ${abbrev(ctx.unit)}` },
    });
    // Each fact ends with a stop, as the paper's: "AC is 25 centimetres. B is
    // the midpoint of AC. OB is 9 centimetres." The owner: "Yes".
    const prose = [
      `The diagram shows a circle with centre $${O}$ and chord $${A}${B}$.`,
      `&bull;&nbsp; $${A}${B}$ is ${withUnit(chord, ctx.unit)}.`,
      `&bull;&nbsp; $${M}$ is the midpoint of $${A}${B}$, and $${O}${M}$ is ${withUnit(dShown, ctx.unit)}.`,
      // **No rounding line.** 2026 P2 Q5 asks for no particular accuracy and
      // its scheme takes 15.4(02...) as it comes. Owner's word, 2026-09-20.
      `Calculate the radius of the circle.`,
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

export function pythagorasSpaceDiagonal(wanted?: string): Q {
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
    // Taught: `-fits` is 2018 P2 Q16's four-mark shape and the plain id is
    // 2022 P2 Q11's three-mark one, so the asked id decides it. A context
    // with nothing to fit into cannot make the asked id, so that draw is
    // retried rather than quietly substituted by its neighbour.
    const wantsFit = wanted === 'pythagoras.space-diagonal-fits';
    const asksFit = wanted !== undefined
      ? (wantsFit && ctx.fits !== null)
      : (ctx.fits !== null && getRandomInt(0, 1) === 0);
    if (wantsFit && !asksFit) continue;

    // ── the two papers draw two different boxes ──────────────────────────────
    //
    // 2022 P2 Q11 letters **all eight** corners, draws the space diagonal EC as
    // a real line, and asks for "EC" by name. 2018 P2 Q16 letters **only the
    // two** its umbrella runs between, P and M, and draws **no diagonal at
    // all** — seeing that the umbrella lies along the space diagonal is the
    // question.
    //
    // This drew one box for both: no letters anywhere, and both the space
    // diagonal *and the face diagonal* dashed in. The face diagonal is the
    // first markscheme line — "start valid strategy for face diagonal" — so it
    // was handing over the mark it pays for, in both papers.
    //
    // `asksFit` is the 2018 shape; the other is 2022's.
    // Corner order is front face first, anticlockwise from the bottom-left,
    // then the back face the same way: F0 F1 F2 F3 K0 K1 K2 K3. So F0 and K2
    // are opposite ends of a space diagonal, and so are F1 and K3.
    type Corners = [string, string, string, string, string, string, string, string];
    const [twoLetters, eightLetters] = [
      // 2018 P2 Q16: only the two corners the umbrella runs between — M at the
      // front-bottom-right, P at the back-top-left.
      ['', 'M', '', '', '', '', '', 'P'] as Corners,
      pick([
        ['E', 'H', 'D', 'A', 'F', 'G', 'C', 'B'],
        ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      ] as Corners[]),
    ];
    const corners = asksFit ? twoLetters : eightLetters;
    // The two ends of the diagonal the question is about.
    const [from, to] = asksFit ? [corners[1], corners[7]] : [corners[0], corners[6]];
    const fig = cuboid({
      length: L, breadth: B, height: H,
      names: corners,
      labels: {
        length: `${L} ${abbrev(ctx.unit)}`,
        breadth: `${B} ${abbrev(ctx.unit)}`,
        height: `${H} ${abbrev(ctx.unit)}`,
      },
      diagonal: asksFit ? 'none' : 'solid',
    });

    // an object that fits about half the time, and never within a whisker
    const objectLen = asksFit
      ? Math.round(space * (getRandomInt(0, 1) === 0 ? 0.88 : 1.09))
      : 0;
    if (asksFit && Math.abs(objectLen - space) < 1.5) continue;
    const fitsInside = objectLen < space;

    // 2022 P2 Q11 has **no context at all**: a lettered cuboid, its three edges
    // named by their letters, and "Calculate the length of EC, the space
    // diagonal of the cuboid." 2018 P2 Q16 is the contextual one — a locker,
    // an umbrella, and only P and M lettered. So the box contexts dress the
    // fits branch and the other is bare, as the papers are.
    const prose = asksFit && ctx.fits
      ? [ctx.scene(`${L} ${ctx.unit}`, `${B} ${ctx.unit}`, `${H} ${ctx.unit}`),
         // The paper routes its question through the two lettered corners —
         // "He thinks it will fit into the locker from corner P to corner M" —
         // so the letters do work rather than decorate. Naming them gives
         // nothing away: that the object lies along the space diagonal is what
         // the first mark is for either way.
         ctx.fits.asks(`${objectLen} ${ctx.unit}`).replace(
           ' Justify your answer.',
           ` It would have to lie from corner $${from}$ to corner $${to}$. Justify your answer.`)]
      : [`The diagram shows a cuboid, $${corners.join('')}$.`,
         `&bull;&nbsp; The length of the cuboid, $${corners[0]}${corners[1]}$, is ${L} ${ctx.unit}`,
         `&bull;&nbsp; The breadth of the cuboid, $${corners[1]}${corners[5]}$, is ${B} ${ctx.unit}`,
         `&bull;&nbsp; The height of the cuboid, $${corners[1]}${corners[2]}$, is ${H} ${ctx.unit}`,
         `Calculate the length of $${from}${to}$, the space diagonal of the cuboid.`,
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
      boardQuestionLines: [`Cuboid ${L} x ${B} x ${H}. Space diagonal ${from}${to}?`],
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

export function pythagorasCoordinates(wanted?: string): Q {
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
  // Taught: the id already says which solid this is, so read it rather than
  // toss for it. A topic sheet asks for nothing and keeps the even draw.
  const isCuboid = wanted !== undefined
    ? wanted === 'pythagoras.coordinates-cuboid'
    : getRandomInt(0, 1) === 0;
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
    // **The cuboid takes a quadruple too.** It used to draw its three edges
    // freely, on the grounds that 2025 P2 Q8 is a calculator paper — but that
    // paper's edges are 4, 3 and 12, which is one of the entries below, and its
    // space diagonal is exactly 13. Drawn freely the answer was irrational, so
    // the clone printed "give your answer correct to one decimal place", an
    // instruction 2025 P2 Q8 does not carry and does not need. A scale keeps
    // the pool up: any multiple of a quadruple is a quadruple.
    //
    // The pyramid doubles a and b because its apex sits over the centre of the
    // base; the cuboid uses the three numbers as its three edges.
    const quad = pick(PYRAMID_QUADRUPLES);
    const k = isCuboid ? pick([1, 1, 2, 3]) : 1;
    const X = isCuboid ? quad[0] * k : quad[0] * 2;
    const Y = isCuboid ? quad[1] * k : quad[1] * 2;
    const Z = quad[2] * k;
    if (Math.max(X, Y, Z) / Math.min(X, Y, Z) > 5) continue;
    if (isCuboid && Math.max(X, Y, Z) > 24) continue;

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
    /**
     * **The whole y-axis, clear of the pyramid — 2026-09-24.** The owner, on
     * the rebuilt 2016 P1 sheet: *"Still needs work the original question you
     * can see whole y axis"*, then *"Let's try option a"*: A further along x
     * so the axis can pass the pyramid by.
     *
     * Drawn at 40° (depth 0.76), the axis clears when A's x plus half the
     * base length exceeds the height times cot 40°, with a little to spare.
     * Measured over the 14 quadruples: shifts up to 4 left 0 layouts that
     * clear; up to 12 leaves 34, across 7 shapes. The second test keeps the
     * dashed height off a solid edge: at this projection an apex over
     * `b · cos40° · 0.76 = a` sits exactly above the front-right corner and
     * the construction line vanishes behind it.
     */
    const shift = getRandomInt(1, 12);
    const RECEDE = { angle: 40, depth: 0.76 };
    const along = Math.cos(RECEDE.angle * Math.PI / 180) * RECEDE.depth;
    // The spare grows with the height: a fixed 0.6 let a 12-high apex sit
    // against the axis, dot touching, in 2 of 12 rendered draws.
    if (shift + X / 2 <= Z / Math.tan(RECEDE.angle * Math.PI / 180) + 0.5 + 0.25 * Z) continue;
    if (Math.abs((Y / 2) * along - X / 2) < 0.12 * Math.max(X / 2, 1)) continue;
    const shifted = (p: { x: number; y: number; z: number }) =>
      ({ x: p.x + shift, y: p.y, z: p.z });
    const [sA, sB, sV] = [shifted(A), shifted(B), shifted(V)];
    const edge = Math.hypot(sV.x - sA.x, sV.y - sA.y, sV.z - sA.z);
    const exact = Number.isInteger(edge);

    const names: Record<string, { x: number; y: number; z: number }> = {
      A: sA, B: sB, V: sV,
    };
    const fig = solidOnAxes({
      // **Drawn where its letters say it is.** This built the pyramid at the
      // origin while every name was shifted along x, so all three dots sat
      // `shift` units to the right of the corners they marked: V's beside the
      // apex, B's out in space past the base. The letters were right and the
      // solid was in the wrong place.
      parts: [{
        kind: 'pyramid', at: { x: shift, y: 0, z: 0 },
        size: { x: X, y: Y, z: Z }, construction: true,
      }],
      names, showCoords: ['A', 'V'],
      // 2016 P1 Q7's own axes: y thrown back more steeply, and drawn whole,
      // clear of the pyramid (see `shift` above). Opt-in; no other figure on
      // axes moves.
      recede: RECEDE,
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

export function pythagorasTwoCircles(wanted?: string): Q {
  // Chosen once, outside the loop, and each arrangement carries its own
  // variation id. Both matter: picking inside meant a rejected snowman retried
  // as an overlap, and one id for all three meant no check could see that the
  // snowman had stopped appearing — which it had, for every attempt, because
  // its diameter label anchored on the very point it was pushed away from.
  // Taught: three arrangements, three ids, so the asked id names the kind.
  const kind = wanted === 'pythagoras.two-circles-overlap' ? 'overlap' as const
    : wanted === 'pythagoras.two-circles-half-turn' ? 'half-turn' as const
    : wanted === 'pythagoras.two-circles-snowman' ? 'snowman' as const
    : pick(['overlap', 'half-turn', 'snowman'] as const);
  for (let tries = 0; tries < 4000; tries++) {

    if (kind === 'snowman') {
      // the head's diameter is given; everything else follows
      const diameter = getRandomInt(6, 30);
      const r = diameter / 2;
      const bodyR = r * Math.SQRT2;
      const height = r + r + bodyR;
      const fig = twoCircles({
        kind, radius: r, chord: diameter,
        names: { a: 'A', b: 'B', centre: 'S', centre2: 'T', top: 'C', bottom: 'D' },
        labels: { radius: '', chord: '' },
      });
      if (!fig) continue;
      const prose = [
        `The diagram represents a cartoon snowman.`,
        `&bull;&nbsp; The head is a circle, centre $S$, with diameter ${num(diameter)} centimetres`,
        `&bull;&nbsp; The body is a larger circle, centre $T$`,
        `&bull;&nbsp; $T$ lies on the circumference of the head, and $AB$ is a chord of the body`,
        `&bull;&nbsp; $C$ is the top of the head and $D$ is the foot of the body`,
        // 2019 P2 Q18 asks for "CD, the height of the snowman" — by the letters
        // it puts on the figure, not for "the total height".
        `Calculate $CD$, the height of the snowman. Give your answer correct to one decimal place.`,
      ];
      // Four marks, as every Pythagoras-in-context question in these papers is:
      // •¹ marshal the facts and recognise the right-angled triangle, •² a
      // consistent Pythagoras statement, •³ the third side, •⁴ the length asked
      // for. Three steps meant the middle one carried two.
      const steps = [
        `<strong>1.</strong> $AB$ passes through $S$, so it is a <strong>diameter</strong> of the head, and $T$ lies on the head's circumference:<br><br>$AB = ${num(diameter)}$ cm, $SA = SB = ${num(r)}$ cm and $ST = ${num(r)}$ cm`,
        `<strong>2.</strong> $AB$ is horizontal and $ST$ vertical, so triangle $STB$ is right-angled at $S$, with the body's radius $TB$ as its hypotenuse:<br><br>$TB^{2} = ${num(r)}^{2} + ${num(r)}^{2}$`,
        `<strong>3.</strong> Work that out and take the square root:<br><br>$TB^{2} = ${num(2 * r * r)}$, so $TB = ${bodyR.toFixed(3)}$ cm`,
        `<strong>4.</strong> $CD$ runs from the top of the head down to the foot of the body — the head's radius, then $ST$, then the body's radius:<br><br>$CD = ${num(r)} + ${num(r)} + ${bodyR.toFixed(3)} = ${height.toFixed(1)}$ cm`,
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

    /**
     * **The radius and the chord are whole numbers.** The owner, on the
     * 2026-2023 sign-off sheet against the door-number sign: *"Keep lengths
     * given whole"*.
     *
     * 2024 P2 Q10 gives a chord of **15** and a radius of **10**, and answers
     * 33.2(...). Both numbers handed over are whole and the one asked for is
     * not - which is what the rounding instruction is for. Drawn to one decimal
     * place, the clone was printing "a chord of 17.3 centimetres, the radius AC
     * is 12.9 centimetres", so a pupil squared 12.9 and 8.65 before reaching
     * the part the marks are for.
     *
     * The proportion is unchanged - the chord between 0.55 and 0.88 of the
     * diameter of the circle it is a chord of - only now it is drawn in whole
     * units. For the half-turn badge the whole `AB` spans two of those edges,
     * so it is drawn as twice a whole number and both it and each half stay
     * whole.
     */
    const r = getRandomInt(5, 30);
    const eachDraw = getRandomInt(Math.ceil(r * 1.1), Math.floor(r * 1.76));
    // AB is the shared chord for the overlap, and both edges together for the
    // half-turn, so the constraint differs
    const chord = kind === 'overlap' ? eachDraw : 2 * eachDraw;
    const each = kind === 'overlap' ? chord : chord / 2;
    if (each >= 2 * r * 0.95) continue;
    const d = Math.sqrt(r * r - (each / 2) ** 2);
    const answer = 2 * (r + d);
    // "33.0" is not an answer that wants rounding to one decimal place
    if (Math.abs(answer - Math.round(answer)) < 0.05) continue;

    const fig = twoCircles({
      kind, radius: r, chord,
      names: kind === 'overlap'
        ? { a: 'A', b: 'B', centre: 'C' }
        // Unicode, not LaTeX: these are drawn into SVG <text>, which has no
        // renderer behind it. The prose keeps $C_{1}$ because MathJax does.
        : { a: 'A', b: 'B', centre: 'C₁', centre2: 'C₂' },
      // 2024 P2 Q10 draws the radius AC dashed and labels it; 2017 P2 Q13 draws
      // no radius and states the 14 cm in prose only. An empty label means the
      // line is not drawn either.
      // And 2017 P2 Q13 writes no length on AB either — "AB is 48 cm long" is
      // prose only. Printed on the figure it sat above one half of AB and read
      // as that half's length. The owner, 2026-09-24: *"Remove the 46 label
      // from AB as it is ambiguous and original question doesn't have it"*.
      // The overlap (LOCKED 2024 P2 Q10) keeps its chord label exactly as it was.
      labels: {
        radius: kind === 'overlap' ? `${num(r)} cm` : '',
        chord: kind === 'overlap' ? `${num(chord)} cm` : '',
      },
    });
    if (!fig) continue;

    // 2024 P2 Q10's own words and stops, and no rounding line - its scheme
    // takes 33.2... as it comes. The owner, on the 2024 re-review sheet: "Yes".
    // The overlap is that paper's alone; the badge keeps its words.
    const prose = kind === 'overlap'
      ? [`Karen buys a door-number sign for her house. The sign consists of parts of two identical circles.`,
         `$AB$ is a chord to both circles.`,
         `&bull;&nbsp; $AB$ has length ${num(chord)} centimetres.`,
         `&bull;&nbsp; The radius $AC$ has length ${num(r)} centimetres.`,
         `Calculate the width of the sign.`]
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
      // The paper draws its figure after "AB is a chord to both circles."
      questionLines: kind === 'overlap'
        ? [prose[0], prose[1], renderScene(fig.scene), ...prose.slice(2)]
        : [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`${kind === 'overlap' ? 'Two circles' : 'Two segments'}, radius ${num(r)}, $AB$ ${num(chord)}. Find the ${kind === 'overlap' ? 'width' : 'height'}.`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer.toFixed(1)}$ centimetres`,
      figure: fig,
    };
  }
  throw new Error('pythagoras.two-circles: no valid question found');
}

export const PYTHAGORAS_GENERATORS: Record<string, Gen> = {
  'Pythagoras with Two Circles': (wanted) => pythagorasTwoCircles(wanted),
  '3D Coordinates and Lengths': (wanted) => pythagorasCoordinates(wanted),
  'The Space Diagonal of a Cuboid': (wanted) => pythagorasSpaceDiagonal(wanted),
  'Finding a Chord or Radius in a Circle': () => pythagorasChordReverse(true),
  'Finding the Radius from a Chord': () => pythagorasChordReverse(false),
  // Three presentations of the converse, and the dispatch is where the third
  // joins: `pythagorasConverse` already splits itself between the plain shape
  // and the from-a-total one.
  'The Converse of Pythagoras': (wanted, asked) =>
    wanted === 'pythagoras.converse-joined' ? pythagorasConverseJoined()
    : wanted !== undefined ? pythagorasConverse(wanted, asked)
    : getRandomInt(1, 3) === 1 ? pythagorasConverseJoined() : pythagorasConverse(),
  'Pythagoras in a Right-Angled Triangle': pythagorasFindSide,
  // All three families reachable from the topic, each with its own id.
  // Taught: the three families are three ids, so the asked id names one.
  // `asked` as well as `wanted`, because 2015 P2 Q12 reaches the `whole`
  // family through an alias: `wanted` resolves to 2018's id and only `asked`
  // separates the two papers. See `forPaper2018` in `pythagorasChord`.
  'Pythagoras in a Circle': (w, asked) => pythagorasChord(
    w === 'pythagoras.chord' ? 'segment'
    : w === 'pythagoras.chord-whole' ? 'whole'
    : w === 'pythagoras.chord-cut' ? 'cut'
    : pick(['segment', 'whole', 'cut'] as const), asked),
};
