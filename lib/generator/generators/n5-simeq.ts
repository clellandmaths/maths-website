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
function buildPair(x0: number, y0: number, bothScaled = false) {
  for (let tries = 0; tries < 400; tries++) {
    // **The first variable's coefficient is positive in both equations, and it
    // is never 1.** All four papers are that shape:
    //
    //   2015 P1 Q11   3x + 2y = 17    2x + 5y = 4
    //   2018 P1 Q3    4x + 5y = -3    6x - 2y = 5
    //   2023 P1 Q3    2x + 3y = 8     5x + 2y = -2
    //   2024 P1 Q7    2p - 7r = 11    3p + 2r = 4
    //
    // Drawing a1 and a2 across the negatives too led an equation with a minus
    // in 118 of 300, which no paper does, and a leading 1 turns the first mark
    // - "evidence of scaling (match x or y coefficients)" - into a
    // substitution the scheme does not describe. The *second* coefficient is
    // free either way: 2018 and 2024 both carry a negative there.
    const a1 = getRandomInt(2, 7), b1 = nonZeroInt(-7, 7);
    const a2 = getRandomInt(2, 7), b2 = nonZeroInt(-7, 7);
    if (a1 * b2 - a2 * b1 === 0) continue;                 // no unique solution
    if (Math.abs(a1) === Math.abs(a2) || Math.abs(b1) === Math.abs(b2)) continue;
    /**
     * **Both equations must need scaling.** The owner, on the 2024 P1 sheet:
     * *"Agreed, needs to have both needing scaled."*
     *
     * Where one coefficient already divides the other, a pupil scales one
     * equation and adds — and the first mark, which this paper's scheme pays
     * for producing BOTH `4p - 14r = 22` and `21p + 14r = 28`, costs a single
     * multiplication. It happened in 173 draws of 300.
     *
     * Every paper this routine serves sets a pair needing both scaled, but
     * only 2024 P1 Q7 is released to change — so this is keyed on the asked
     * id and off by default. 2015 P1 Q11, 2018 P1 Q3 and 2023 P1 Q3 draw
     * exactly as they did.
     */
    if (bothScaled) {
      const divides = (m: number, n: number) =>
        Math.abs(m) % Math.abs(n) === 0 || Math.abs(n) % Math.abs(m) === 0;
      if (divides(a1, a2) || divides(b1, b2)) continue;
    }
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
    if (!Number.isInteger(c1) || !Number.isInteger(c2)) continue;
    if (Math.abs(c1) > 60 || Math.abs(c2) > 60) continue;
    // **Neither equation may be divisible through.** `6x - 6y = -30` is
    // `x - y = -5` written the long way: a pupil who notices solves a much
    // easier pair than the one set, and the scaling the first mark pays for is
    // not the scaling they did. Every equation in all four papers has no
    // common factor across its three numbers.
    const whole = (a: number, b: number, c: number) =>
      gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) === 1;
    if (!whole(a1, b1, c1) || !whole(a2, b2, c2)) continue;
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

/**
 * **Which papers require both equations scaled.**
 *
 * The owner, after the 2024 P1 sheet: *"if it affects papers still to be
 * reviewed then we can widen now as long as the markscheme for those papers
 * requires both to be scaled."* Each was read before being added:
 *
 *   2024 P1 Q7   `simeq.solve-given`          2p - 7r = 11, 3p + 2r = 4
 *                scheme: 4p - 14r = 22 AND 21p + 14r = 28
 *   2015 P1 Q11  `simeq.solve-given-2015`     3x + 2y = 17, 2x + 5y = 4
 *                scheme: 6x + 4y = 34 AND 6x + 15y = 12
 *   2018 P1 Q3   `simeq.solve-given-pre2023`  4x + 5y = -3, 6x - 2y = 5
 *                scheme: "8x + 10y = -6 OR 30x - 10y = 25" - the `or` offers
 *                two evidence lines, not two routes: matching y is x2 and x5,
 *                matching x is x3 and x2, and both scale both equations.
 *
 *   2023 P1 Q3   `simeq.solve-given-2023`     2x + 3y = 8, 5x + 2y = -2
 *                scheme: 10x + 15y = 40 AND 10x + 4y = -4
 *
 * **2023 P1 Q3 was added on 2026-09-21**, when its own paper came up for
 * review. It had been held back only because it was signed off while the
 * others were not — *"I will extend to 2023 when I get there as we are re
 * reviewing anyway"*, then *"Agree apply"* on the 2023 P1 sheet. It had been
 * drawing a one-scaling system in 135 draws of 240.
 *
 * All four papers this routine serves are now on the rule.
 */
const BOTH_SCALED = new Set([
  'simeq.solve-given',           // 2024 P1 Q7
  'simeq.solve-given-2015',      // 2015 P1 Q11
  'simeq.solve-given-pre2023',   // 2018 P1 Q3
  'simeq.solve-given-2023',      // 2023 P1 Q3
]);

const OWN_LETTERS: Record<string, { letters: [string, string]; whole: boolean }> = {
  'simeq.solve-given-2015':    { letters: ['x', 'y'], whole: true },   // 2015 P1 Q11  x = 7, y = -2
  'simeq.solve-given-pre2023': { letters: ['x', 'y'], whole: false },  // 2018 P1 Q3   x = 0.5, y = -1
  'simeq.solve-given-2023':    { letters: ['x', 'y'], whole: true },   // 2023 P1 Q3   x = -2, y = 4
  'simeq.solve-given':         { letters: ['p', 'r'], whole: true },   // 2024 P1 Q7   p = 2, r = -1
};

function solveGiven(_wanted?: string, asked?: string): Q {
  const bothScaled = asked !== undefined && BOTH_SCALED.has(asked);
  for (let tries = 0; tries < 200; tries++) {
    // The four bare "solve the system" papers are x/y three times and p/r once
    // - 2024 P1 Q7 is the p/r one. `a`/`b` and `m`/`n` are ours and appear in
    // none of them. The worded questions in this file are a different matter
    // entirely: see the note on the contexts' own letters.
    //
    // **2015 P1 Q11 is x and y with whole answers, x = 7 and y = -2.** The
    // clone lent it 2024's p and r in 98 of 400 draws and 2018's half in 30.
    // The owner, on the 2015 P1 sheet: *"Yes key"*. Both coins are still
    // drawn; 2015's id reads them as x, y and whole, so the three LOCKED
    // papers on this routine see the same stream as before.
    //
    // **The three LOCKED papers the same way, each to its own paper**, put
    // to the owner at the foot of the 2015 P1 sheet, *"Yes"* on each: 2018
    // P1 Q3 x and y (its halves left as they were - its own answer is
    // x = 0.5), 2023 P1 Q3 x and y and whole, 2024 P1 Q7 p and r and whole.
    const own = OWN_LETTERS[asked ?? ''];
    const drawnLetters = pick([['x', 'y'], ['x', 'y'], ['x', 'y'], ['p', 'r']]);
    const [v1, v2] = own ? own.letters : drawnLetters;
    const half = getRandomInt(1, 6) === 1 && !own?.whole;  // the 2018 P1 Q3 shape
    const x0 = half ? nonZeroInt(-9, 13) / 2 : nonZeroInt(-8, 9);
    const y0 = nonZeroInt(-8, 9);
    const p = buildPair(x0, y0, bothScaled);
    if (!p) continue;

    return {
      subTopic: 'Solving Simultaneous Equations',
      difficulty: 'skill',
      variationId: 'simeq.solve-given',
      questionLines: [
        // 2015 P1 Q11 has no commas: "Solve algebraically the system of
        // equations". The owner, on the 2018-2014 light pass: "Yes". Its own
        // alias; 2018 P1 Q3's paper has them and keeps them.
        asked === 'simeq.solve-given-2015' ? `Solve algebraically the system of equations`
          : `Solve, algebraically, the system of equations`,
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
      // Each equation from its own line's end, as the paper prints them - the
      // owner, 2017 P1: "Yes fix the equation drift". Alone on its clone.
      labelAtLineEnd: true,
      points: [{ x: x0, y: y0, text: point, side: 'right' }],
    });
    const prose = [
      `Two straight lines have equations $${eq1}$ and $${eq2}$.`,
      `The diagram shows the two lines meeting at the point $${point}$.`,
      `Find, algebraically, the coordinates of $${point}$.`,
    ];
    if (verifyFigure(fig, prose.join(' ')).length) continue;
    /**
     * **No pair so nearly parallel that the two lines cannot be told apart.**
     * Measured as drawn - the frame scales x and y differently, so the angle on
     * the page is not the angle in the algebra. 74 draws in 400 crossed at
     * under 15 degrees there, 36 under 5, drawn almost on top of each other
     * with no way for a label to say which was which; the paper's cross near
     * 90. The owner, on the 2017 P1 sheet: "Yes reject ones that are too
     * extreme to make out".
     */
    const drawn = (fig.scene.elements as { kind: string; points?: { x: number; y: number }[] }[])
      .filter(e => e.kind === 'path' && e.points && e.points.length > 1)
      .map(e => { const a = e.points![0], b = e.points![e.points!.length - 1]; return Math.atan2(b.y - a.y, b.x - a.x); });
    if (drawn.length >= 2) {
      let cross = Math.abs(drawn[0] - drawn[1]) * 180 / Math.PI % 180;
      if (cross > 90) cross = 180 - cross;
      if (cross < 15) continue;
    }

    return {
      subTopic: 'Intersection of Two Lines',
      difficulty: 'exam',
      variationId: 'simeq.intersection',
      // 2017 P1 Q13's own two sentences: "The graph shows two straight lines
      // with equations 3x - y = 2 and x + 3y = 19. The lines intersect at the
      // point P." The owner, on the 2018-2014 light pass: "Yes". Its only
      // paper; after verifyFigure.
      questionLines: [
        `The graph shows two straight lines with equations $${eq1}$ and $${eq2}.$`,
        `The lines intersect at the point $${point}$.`,
        renderScene(fig.scene), prose[2]],
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
/**
 * **`paper1` keeps the money contexts out, and the reason is not "no
 * decimals".**
 *
 * 2019 P1 Q8 is a non-calculator paper and its numbers are whole throughout -
 * 215 kg and 200 kg, answering 20 and 25. The clone put a decimal in the
 * question in 145 draws of 200, because most contexts here are money:
 * *"5 bags of compost and 6 trays of seedlings, total 27.55"*, answering 3.35.
 * Solving that pair by hand is a different exercise from the one the paper
 * sets.
 *
 * **But the rule is not that Paper 1 has no decimals.** 2016 P1 Q4 is also
 * non-calculator and reads 9.6 and 13.3 square metres, answering 1.5 and 2.2.
 * The board sets tenths by hand quite happily. What it does not set is
 * *hundredths*: money carries pence, and `u2` is drawn in steps of 5p, so the
 * clone's pairs need two-decimal arithmetic all the way through.
 *
 * So the line is drawn at the unit, not at the decimal point. `kg` is whole
 * and `m2` is tenths - both attested by a real Paper 1 question - and `money`
 * is out. That leaves 10 of the 22 contexts, which is enough to keep the pool
 * healthy.
 *
 * Opt-in from a subTopic of its own, so `simeq.construct-solve` (2022 P2 Q4,
 * **signed off**, and a calculator paper where 4.25 is exactly right) does not
 * move.
 */
/**
 * **2014 P2 Q3 is money, in the paper's own words.** — 2026-09-25
 *
 * Tickets for adults and children, "(a) Write down an equation to illustrate
 * this information." and "(c) Calculate the cost of a ticket for an adult and
 * the cost of a ticket for a child." Measured on the 2014 P2 sheet, 400 draws
 * of its id: money in 214, and "an equation in a and c" and "algebraically" in
 * all 400 - neither is in the paper. The owner: *"Yes"*.
 *
 * `-2014` is an ALIAS of `simeq.construct-solve` (LOCKED 2022 P2 Q4, and
 * 2016 P1 Q4 through `-pre2022`), so it is keyed on the asked id and only
 * this id takes either branch.
 */
const CONSTRUCT_2014 = 'simeq.construct-solve-2014';

/**
 * **Each item priced for what it is.** — 2026-09-25
 *
 * The shared draw prices the second item at up to 80% of the first, whatever
 * it is, so 2014's sheet paired theatre tickets with a £24.70 programme. The
 * owner, on that card: *"Ok any way to fix odd price pairings?"* - answered
 * on the thread as a fix for 2014 P2 Q3 alone, since the draw is shared with
 * LOCKED 2016 P1 Q4 and 2022 P2 Q4.
 *
 * [first lo, first hi, second lo, second hi] in pence, keyed on the first
 * item. The paper's are £22.50 an adult and £15.25 a child.
 */
const PRICES_2014: Record<string, [number, number, number, number]> = {
  'mangoes': [60, 150, 25, 60],
  'adult tickets': [1200, 2800, 600, 1600],
  'notebooks': [150, 450, 40, 150],
  'bags of compost': [400, 900, 200, 500],
  'cinema tickets': [800, 1400, 300, 650],
  'bus passes': [1000, 2500, 800, 2000],
  'boxes of tiles': [1500, 3500, 500, 1200],
  'coffees': [220, 400, 150, 300],
  'rolls of turf': [300, 700, 250, 600],
  'theatre tickets': [1800, 4500, 300, 800],
  'punnets of raspberries': [200, 400, 150, 350],
  'train tickets': [1500, 4500, 300, 1000],
};

/**
 * **What each paper fixes about constructing and solving**, one row per paper
 * id. `paper1` (2019 P1 Q8) and `combine` (2025 P2 Q10, 2026 P2 Q4) are not
 * rows: each is a subTopic with its own draw loop, so they are parameters.
 * Nothing asked (a topic sheet) fixes nothing, and no row draws differently
 * from another except 2014's own prices, drawn only on its id.
 *
 * - `noLetters`, `noAlgebraically`: the papers' own words (2026-09-25). Every
 *   draw said "an equation in x and y", and all but 2022's said "Calculate,
 *   algebraically", on papers that print neither: 2016 P1 Q4 and 2019 P1 Q8
 *   have no letters and no "algebraically"; 2022 P2 Q4 has "algebraically" but
 *   no letters. Shown LOCKED on the 2014 P2 sheet at the owner's request, 400
 *   of 400 each; the owner: *"Agreed"* on each card. The combine papers print
 *   their letters, so they keep them.
 * - `money`, `prices`: 2014 P2 Q3 prices its two items as a pair that makes
 *   sense (the paper's are £22.50 an adult and £15.25 a child). The shared
 *   draw priced the second item at up to 80% of the first, so theatre tickets
 *   came with a £24.70 programme. The owner: *"Ok any way to fix odd price
 *   pairings?"*, answered on the thread as a fix for 2014 alone.
 * - `tenths`: 2016 P1 Q4 is non-calculator and its paper keeps a tenth (9.6
 *   and 13.3 square metres, answers 1.5 and 2.2). On the shared calculator
 *   scale it drew pennies in 241 of 400 and totals past 1000 kilograms in 16.
 *   So totals of 100 or under, and every number to at most one decimal place.
 *   The owner, on the 2016 P1 sheet: *"Yes do it"*. A rejection, on its id.
 * - `plainC`: 2025 P2 Q10 asks "(c) Calculate the total weight of the stacks
 *   on Beth's lorry." with no "algebraically", which 2026 P2 Q4 does print.
 *   The owner, on the 2025 re-review sheet: "Yes".
 */
interface ConstructPaper {
  noLetters?: true; noAlgebraically?: true;
  money?: true; prices?: Record<string, [number, number, number, number]>;
  tenths?: true; plainC?: true;
}
const CONSTRUCT_PAPERS: Record<string, ConstructPaper> = {
  [CONSTRUCT_2014]: { noLetters: true, noAlgebraically: true, money: true, prices: PRICES_2014 },  // 2014 P2 Q3
  'simeq.construct-solve-pre2022': { noLetters: true, noAlgebraically: true, tenths: true },        // 2016 P1 Q4
  'simeq.construct-solve': { noLetters: true },                                                    // 2022 P2 Q4
  'simeq.construct-combine-2025': { plainC: true },                                                // 2025 P2 Q10
};

function constructSolve(combine = false, paper1 = false, asked?: string): Q {
  const paper: ConstructPaper | undefined = CONSTRUCT_PAPERS[asked ?? ''];
  const noLetters = !combine && (paper1 || !!paper?.noLetters);
  const noAlgebraically = !combine && (paper1 || !!paper?.noAlgebraically);
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(paper1
      ? TWO_ITEM_CONTEXTS.filter(c => c.kind !== 'money')
      : paper?.money ? TWO_ITEM_CONTEXTS.filter(c => c.kind === 'money')
      : TWO_ITEM_CONTEXTS);
    const [v1, v2] = ctx.vars;
    if (v1 === v2) continue;

    // Unit values in pence / kilograms / tenths of a square metre, inside the
    // band that context makes plausible — an apple should not cost more than a
    // mango, and fruit should not be priced like theatre tickets.
    const [lo, hi] = ctx.band;
    /**
     * **On Paper 1 the unit values step by the context's own scale**, so the
     * numbers a pupil sees are whole by construction rather than by rejection.
     *
     * The square-metre contexts hold their values in tenths, so a free draw
     * gives 20.3 square metres. Rejecting those outright — which is what this
     * did first — killed two contexts entirely and dropped the subTopic to 8,
     * under `contexts`'s floor of 10. Stepping by the scale keeps all ten and
     * still guarantees whole numbers: a multiple of ten tenths is a whole
     * square metre, and any sum of multiples is too.
     */
    const step = ctx.kind === 'money' ? 5
      : paper1 ? (ctx.kind === 'm2' ? 10 : 1)
      : 1;
    const round = (x: number) => Math.round(x / step) * step;
    const pair = paper?.prices ? paper.prices[ctx.plural[0]] : undefined;
    const u1 = round(pair ? getRandomInt(pair[0], pair[1]) : getRandomInt(lo, hi));
    const u2 = round(pair ? getRandomInt(pair[2], pair[3])
      : getRandomInt(Math.max(step, Math.round(lo * 0.5)), Math.round(u1 * 0.8)));
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
    /**
     * **Paper 1 has no calculator, so nothing may carry a decimal — and
     * excluding money was only half of it.**
     *
     * The first pass saw decimals, diagnosed the MONEY contexts and filtered
     * them out above. Measured on the second pass, **129 of 300** draws still
     * had one: the square-metre contexts hold their values in *tenths*
     * (`scale = 10`), so a draw reads *"4 tents and 5 awnings, total 20.3
     * square metres"* and answers 3.2 and 1.5. Solving that by hand is a
     * different exercise from the one 2019 P1 Q8 sets — 7 bags of cement and
     * 3 of gravel weigh 215 kilograms, answers 20 and 25, whole throughout.
     *
     * The owner: *"I agree lets ensure no decimals and that the numbers are do
     * able by hand."* So the test is on the numbers a pupil actually sees
     * rather than on the kind of context they came from — **fix the property,
     * not the context**, which is exactly what the first pass got wrong.
     *
     * A rejection rather than a remap, and that is safe here: `paper1` is
     * fixed for the whole call, so this `continue` can never run on
     * `simeq.construct-solve` (2022 P2 Q4, SIGNED OFF) or on
     * `simeq.construct-combine`. Their draws are untouched, and 2022 P2 Q4
     * keeps the money it should have as a calculator paper.
     */
    if (paper1 && [d1, d2, dt1, dt2].some(v => !Number.isInteger(v))) continue;
    // 2016 P1 Q4 keeps a tenth: see `tenths` on CONSTRUCT_PAPERS.
    if (paper?.tenths
      && ([dt1, dt2].some(v => v > 100)
        || [d1, d2, dt1, dt2].some(v => Math.abs(v * 10 - Math.round(v * 10)) > 1e-9))) continue;
    const p = { a1: q1, b1: q2, c1: dt1, a2: q3, b2: q4, c2: dt2 };

    const unit = ctx.kind === 'money' ? 'cost' : ctx.kind === 'kg' ? 'weight' : 'amount of material';
    const verb = ctx.kind === 'money' ? 'costs' : ctx.kind === 'kg' ? 'weighs' : 'uses';
    const inUnits = ctx.kind === 'money' ? 'pounds' : ctx.kind === 'kg' ? 'kilograms' : 'square metres';

    // the combination part (c) asks about, and what it comes to
    const [n1, n2] = [getRandomInt(2, 12), getRandomInt(2, 12)];
    const together = n1 * u1 + n2 * u2;

    return {
      subTopic: paper1 ? 'Constructing Simultaneous Equations without a Calculator'
        : combine ? 'Simultaneous Equations Used Again' : 'Constructing Simultaneous Equations',
      difficulty: 'exam',
      variationId: paper1 ? 'simeq.construct-solve-p1'
        : combine ? 'simeq.construct-combine' : 'simeq.construct-solve',
      questionLines: [
        `${ctx.people[0]} ${ctx.verb} ${q1} ${ctx.plural[0]} and ${q2} ${ctx.plural[1]}. ${ctx.total} ${amount(t1, ctx.kind)}.`,
        noLetters ? '(a) Write down an equation to illustrate this information.'
          : `(a) Write down an equation in $${v1}$ and $${v2}$ to illustrate this information.`,
        `${ctx.people[1]} ${ctx.verb} ${q3} ${ctx.plural[0]} and ${q4} ${ctx.plural[1]}. ${ctx.total} ${amount(t2, ctx.kind)}.`,
        noLetters ? '(b) Write down an equation to illustrate this information.'
          : `(b) Write down an equation in $${v1}$ and $${v2}$ to illustrate this information.`,
        combine && paper?.plainC
          ? `(c) Calculate the total ${unit} ${unit === 'amount of material' ? 'for' : 'of'} ${n1} ${ctx.plural[0]} and ${n2} ${ctx.plural[1]}.`
          : combine
          ? `(c) Calculate, algebraically, the total for ${n1} ${ctx.plural[0]} and ${n2} ${ctx.plural[1]}.`
          : noAlgebraically ? `(c) Calculate ${ctx.asks}.` : `(c) Calculate, algebraically, ${ctx.asks}.`,
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
      // Every part's answer, as a marking scheme sets them out: it gave (c)'s
      // alone, so "Show answers" had nothing for the two equations (the owner,
      // 2026-09-28). The letters are the working's own, from its step (a).
      finalAnswer: `(a) $${equation(q1, v1, q2, v2, dt1)}$<br>(b) $${equation(q3, v1, q4, v2, dt2)}$<br>(c) ` + (combine
        ? amount(together, ctx.kind)
        : `One ${ctx.single[0]} ${verb} ${amount(u1, ctx.kind)} and one ${ctx.single[1]} ${verb} ${amount(u2, ctx.kind)}`),
    };
  }
  throw new Error(`simeq.construct-${combine ? 'combine' : 'solve'}: no valid question found`);
}

export const SIMEQ_GENERATORS: Record<string, (wanted?: string, asked?: string) => Q> = {
  'Solving Simultaneous Equations': solveGiven,
  'Intersection of Two Lines': intersection,
  'Constructing Simultaneous Equations': (_w, asked) => constructSolve(false, false, asked),
  // 2019 P1 Q8: the same question without a calculator, so no money contexts.
  'Constructing Simultaneous Equations without a Calculator': () => constructSolve(false, true),
  // `asked` reaches only the (c) wording on the combine path: every other use
  // of it inside is behind `!combine`.
  'Simultaneous Equations Used Again': (_w, asked) => constructSolve(true, false, asked),
};
