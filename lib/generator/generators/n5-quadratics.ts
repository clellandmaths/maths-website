import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
import { getRandomInt, gcd, nonZeroInt } from './utils';
import { fmt, type Poly } from './n5-expanding';

/**
 * National 5 Quadratics — the parts that need no diagram.
 *
 * The specification lists these separately:
 *   "Completing the square in a quadratic expression with unitary x^2
 *    coefficient — writing x^2+bx+c in the form (x+p)^2+q where b,c in Z and
 *    p,q in Q"
 *   "Identifying features of a quadratic function — the nature and coordinates
 *    of the turning point, the equation of the axis of symmetry"
 *   "Solving a quadratic equation"
 *
 * Note p,q are rational, not integer, so an odd middle coefficient is in scope
 * and gives a fractional turning point. The papers use both.
 *
 * Zeta adds the discriminant and the quadratic formula as separate skills.
 *
 * Reading a quadratic from its graph and sketching one both need a diagram and
 * wait for the shape library.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
/**
 * Weighted, not narrowed - `quadratics.formula` was never off-book.
 *
 * The eight *Quadratic formula* papers run x:8, p:1, y:1: every one of them
 * uses `x`, and `p` and `y` turn up once each. So all three letters are the
 * exam's, and only the balance was ours - an even third each, where the papers
 * are eight to one.
 *
 * Worth recording because `variables.ts` did **not** flag this: it compares the
 * set a variation prints against the set the papers use, and both sets match.
 * A convention is a weighting as much as a membership, and the check can only
 * see one of those. See `__checks__/variables.ts`.
 */
const VARS = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'y', 'p'];
type Q = Omit<GeneratedQuestion, 'topic'>;

/**
 * The papers name the completed-square parameters inconsistently — (a,b) in 2014,
 * 2016, 2022, 2024 and 2025, (p,q) in 2019 — so vary it. The variable then has to
 * avoid whichever pair was chosen, or a question reads "(p + p)^2 + q".
 */
function squareForm(): { p: string; q: string; v: string } {
  const [p, q] = pick([['a', 'b'], ['p', 'q']]);
  const v = pick(['x', 'y', 'p'].filter(c => c !== p && c !== q));
  return { p, q, v };
}

/** A rational as LaTeX, in lowest terms, integer where it divides. */
function rat(n: number, d: number): string {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  let [a, b] = [n / g, d / g];
  if (b < 0) { a = -a; b = -b; }
  if (b === 1) return `${a}`;
  return a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
}

/** Round to n significant figures. */
function sigFigs(v: number, n: number): number {
  if (v === 0) return 0;
  const mag = Math.ceil(Math.log10(Math.abs(v)));
  const f = Math.pow(10, n - mag);
  return Math.round(v * f) / f;
}

// ── skill: completing the square — 2014 P1 Q3, 2016 P2 Q9, 2019 P2 Q10 ───
//
// x^2 + bx + c = (x + b/2)^2 + (c - b^2/4).
//
// **The middle coefficient is even.** All four cited papers use one - x^2 - 14x
// + 44, x^2 + 8x - 7, x^2 + 10x - 15, x^2 + 10x + 19 - so a and b come out
// whole. The course specification allows them to be rational and this drew an
// odd coefficient one time in four, giving `(y - 5/2)^2 - 57/4`: correct, in
// scope, and not a question any of these four papers sets. What the
// specification permits is not what the paper asked.

function completeSquare(_wanted?: string, asked?: string): Q {
  const form = squareForm();
  /**
   * **Each paper in x, and the two locked ones in their own letters.**
   *
   * 2016 P2 Q9 — the owner, on the 2016 P2 sheet: *"Yes want x only"*,
   * against the variable being y or p in 174 of 400 draws.
   *
   * 2019 P2 Q10 and 2025 P2 Q5, both LOCKED, had the same spread (not x in
   * 237 and 235 of 400) and each printed the other paper's letters about
   * half the time. Put to the owner on the same sheet as "x, and its paper's
   * own letters": *"Yes key them all"* on 2019's, *"Yes for x and a and b"*
   * on 2025's. 2019 is (x + p)^2 + q and 2025 is (x + a)^2 + b.
   *
   * The letters are still drawn for every id, so the stream is unchanged;
   * only what these ids read is replaced. A topic sheet asks for none of them
   * and keeps the mix.
   *
   * `middle`: the middle term is drawn as ever and each keyed paper reads it
   * with its own sign. 2014 is x^2 - 14x + 44; 2019 P2 Q10 (+10x) and 2025 P2
   * Q5 (+10x) are plus. The owner, on the 2014 P1 sheet: "Yes just ensure we
   * never get a q to be 0" and "Ok again check we never get b = 0". 2016 P2 Q9
   * was not answered on its sign, so it keeps both.
   *
   * `stop`: the paper ends "in the form (x + a)^2 + b." with the stop inside
   * the maths. The owner, 2026-09-25: "if the only fixes is putting full stops
   * just do that without asking me". Words only, no random.
   */
  const KEYED: Record<string, { p?: string; q?: string; middle?: 'plus' | 'minus'; stop?: true }> = {
    'quadratics.complete-square-2016': { stop: true },                                     // 2016 P2 Q9
    'quadratics.complete-square-pre2023': { p: 'p', q: 'q', middle: 'plus', stop: true },  // 2019 P2 Q10
    'quadratics.complete-square': { p: 'a', q: 'b', middle: 'plus', stop: true },          // 2025 P2 Q5
    // 2014 P1 Q3, x^2 - 14x + 44 in the form (x - a)^2 + b. The owner, on the
    // 2014 P1 sheet: "Yes" to x, a minus middle term, and a and b. Measured
    // before: x in 176, a minus middle term in 205, a and b in 215 of 400.
    'quadratics.complete-square-2014': { p: 'a', q: 'b', middle: 'minus' },
  };
  const key = KEYED[asked ?? ''];
  const pName = key?.p ?? form.p, qName = key?.q ?? form.q;
  const v = key ? 'x' : form.v;
  const drawnHalf = nonZeroInt(-8, 8);
  const half = key?.middle === 'minus' ? -Math.abs(drawnHalf)
    : key?.middle === 'plus' ? Math.abs(drawnHalf) : drawnHalf;
  const b = 2 * half;
  let c = nonZeroInt(-40, 40);
  /**
   * **Never "+ 0".** When c is b^2/4 the quadratic is a perfect square and
   * the answer ends "(x + 4)^2 + 0". The owner, on the 2014 P1 sheet: "Can't
   * have +0", on 2016 P2 Q9's draws, and the two answers above. On the four
   * papers' ids the constant moves up one instead, so no draw is spent and
   * no other draw changes.
   */
  if (key && 4 * c === b * b) c += 1;
  const expr: Poly = [c, b, 1];

  // p = b/2, q = c - b^2/4, both over a denominator of 4 at worst
  const pN = b, pD = 2;
  const qN = 4 * c - b * b, qD = 4;
  const pTex = rat(pN, pD), qTex = rat(qN, qD);
  const sign = pN < 0 ? '-' : '+';
  const pAbs = rat(Math.abs(pN), pD);

  return {
    subTopic: 'Completing the Square',
    difficulty: 'skill',
    variationId: 'quadratics.complete-square',
    questionLines: [
      `Express $${fmt(expr, v)}$ in the form $(${v} ${sign} ${pName})^{2} + ${qName}${key?.stop ? '.' : ''}$`,
    ],
    boardQuestionLines: [`$${fmt(expr, v)}$ in the form $(${v} ${sign} ${pName})^{2} + ${qName}$`],
    // Two marks in all four papers — •¹ correct bracket with square, •² complete
    // the process — so writing out the finished expression is part of the second
    // mark, not a third step.
    solutionSteps: [
      `<strong>1.</strong> Halve the coefficient of $${v}$ to get the number in the bracket:<br><br>$${b} \\div 2 = ${pTex}$, so the bracket is $(${v} ${sign} ${pAbs})^{2}$`,
      `<strong>2.</strong> Expanding that bracket gives an extra $${rat(b * b, 4)}$, so subtract it and add the constant:<br><br>$${qName} = ${c} - ${rat(b * b, 4)} = ${qTex}$, giving $(${v} ${sign} ${pAbs})^{2} ${qN < 0 ? '-' : '+'} ${rat(Math.abs(qN), qD)}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$(${v} ${sign} ${pAbs})^{2} ${qN < 0 ? '-' : '+'} ${rat(Math.abs(qN), qD)}$`,
  };
}

// ── shape: turning point — 2022 P1 Q5, 2024 P1 Q12 ──────────────────────
//
// The specification's "identify the nature and coordinates of the turning point,
// and the equation of the axis of symmetry". Both follow from the completed
// square, so the question gives the quadratic and asks for the point.

function turningPoint(): Q {
  const [pName, qName] = pick([['a', 'b'], ['p', 'q']]);
  const curve = pick(['y', 'f(x)']);
  const v = 'x';                              // the curve is named y or f(x)
  const half = nonZeroInt(-7, 7);
  const b = 2 * half;                       // keep the turning point whole here
  const c = nonZeroInt(-40, 40);
  const expr: Poly = [c, b, 1];
  const q = c - half * half;
  const sign = half < 0 ? '-' : '+';

  return {
    subTopic: 'Turning Point of a Parabola',
    difficulty: 'exam',
    variationId: 'quadratics.turning-point',
    // 2022 P1 Q5 and 2024 P1 Q12 are both worded exactly this way, one naming the
    // curve f(x) and the other y.
    questionLines: [
      `(a) Express $${fmt(expr, v)}$ in the form $(${v} ${sign} ${pName})^{2} + ${qName}$.`,
      `(b) Hence, or otherwise, state the coordinates of the turning point of the graph of $${curve} = ${fmt(expr, v)}$.`,
    ],
    boardQuestionLines: [`$${curve} = ${fmt(expr, v)}$. Complete the square, then state the turning point.`],
    // 2022 P1 Q5 is 2 + 1: •¹ correct bracket with square, •² complete the
    // process consistently, •³ state the coordinates. Part (a) was one step
    // carrying two marks, so a pupil taking a hint jumped both; and the closing
    // line about the minimum, useful as it is, is not a mark and was the step
    // the app withheld. It belongs with the coordinates.
    solutionSteps: [
      `<strong>(a)</strong> Halve the coefficient of $${v}$:<br><br>$${b} \\div 2 = ${half}$, so the bracket is $(${v} ${sign} ${Math.abs(half)})^{2}$`,
      `<strong>(a)</strong> Expanding that bracket gives an extra $${half * half}$, so subtract it and add the constant:<br><br>$(${v} ${sign} ${Math.abs(half)})^{2} ${q < 0 ? '-' : '+'} ${Math.abs(q)}$`,
      `<strong>(b)</strong> The bracket is zero when $${v} = ${-half}$, and the whole expression is then $${q}$:<br><br>$(${-half},\\ ${q})$. It is a <strong>minimum</strong> turning point, because the coefficient of $${v}^{2}$ is positive.`,
    ],
    stepMarks: [1, 1, 1],
    finalAnswer: `(a) $(${v} ${sign} ${Math.abs(half)})^{2} ${q < 0 ? '-' : '+'} ${Math.abs(q)}$, (b) $(${-half},\\ ${q})$`,
  };
}

// ── skill and shape: the discriminant — 2016 P1 Q6, 2018 P1 Q8, 2023 P1 Q5, 2025 P1 Q11 ─
//
// 2023 P1 Q5 note 4 is strict about the wording: accept "2 real (and) distinct
// roots" or "2 real unequal roots"; do NOT accept "2 real roots", "2 distinct
// roots" or "real and distinct roots". The other two cases have their own
// expected answers.

function discriminant(wanted?: string, asked?: string): Q {
  /**
   * **The cap belongs to 2025 P1 Q11 alone.**
   *
   * The owner asked for it on that question - *"Ensure arithmetic doesn't get
   * too big"* - and applying it to the shared generator moved **2023 P1 Q5**,
   * which he had already signed off and had not asked to change. His rule:
   * *"Once a question has been flagged as done nothing else should change it
   * except me saying so."*
   *
   * So it splits. 2025 P1 Q11 gets the capped id; 2023 P1 Q5 goes back to
   * exactly what was approved, and 2016 P1 Q6 and 2018 P1 Q8 stay with it until
   * the review reaches them and the owner says what those should be.
   *
   * Chosen once, above the loop, so a rejected draw cannot skew which of the
   * two ids comes out - `docs/diagram-questions.md` section 2.
   */
  // Taught: the cap belongs to 2025 P1 Q11 alone and carries its own id, so
  // the asked id decides it — which is exactly the separation the note
  // above was written to protect.
  const capped = wanted !== undefined
    ? wanted === 'quadratics.discriminant-capped'
    : getRandomInt(0, 1) === 0;
  for (let tries = 0; tries < 400; tries++) {
  // **Always the function form.** All four cited papers word it identically -
  // "Determine the nature of the roots of the function f(x) = ..." - and this
  // drew the equation form one time in four, under a comment saying the papers
  // always use the other one. There is no separate drill variation to carry the
  // plainer wording: this id is what `2025 P1 Q11` and its three siblings get
  // when a pupil presses Variation, so it says what they say.
    // All four discriminant questions in the papers are f:4, x:4 - the same
    // function letter and the same variable, every time. `g`, `h`, `p` and `y`
    // reached 68% of draws between them and appear in none of them.
    const fname = 'f';
    const v = 'x';
    const kind = pick(['two', 'equal', 'none'] as const);
    /**
     * **2016 P1 Q6 reaches 7x², and is capped as 2025 is.** The owner, on the
     * 2016 P1 sheet: *"Yes"*, to both. The paper's own `7x^2 + 5x - 1` could
     * not be drawn with the coefficient stopping at 4, and the discriminant
     * ran past 60 in 268 of 800 draws, up to 225. Keyed on the ASKED id - the
     * 2016 alias arrives with its target's `wanted` - so 2018 P1 Q8 and 2023
     * P1 Q5, both signed off and uncapped, draw exactly as before: one draw
     * either way, from a wider range only for 2016.
     */
    const is2016 = asked === 'quadratics.discriminant-2016';
    const a = is2016 ? nonZeroInt(1, 7) : nonZeroInt(1, 4);
    const b = nonZeroInt(-9, 9);
    let c: number;
    if (kind === 'equal') {
      if ((b * b) % (4 * a) !== 0) continue;         // needs an exact c
      c = (b * b) / (4 * a);
    } else {
      c = nonZeroInt(-9, 9);
      const d = b * b - 4 * a * c;
      if (kind === 'two' && d <= 0) continue;
      if (kind === 'none' && d >= 0) continue;
    }
    const d = b * b - 4 * a * c;
    /**
     * **Held to the size the papers work at.** The owner, on the 2026-2023
     * sign-off sheet: *"Ensure arithmetic doesn't get too big"*.
     *
     *   2025 P1 Q11   3x^2 + 2x + 1     4 - 12    = -8
     *   2018 P1 Q8    2x^2 + 4x + 5    16 - 40    = -24
     *   2023 P1 Q5    4x^2 + 6x - 1    36 + 16    = 52
     *   2016 P1 Q6    7x^2 + 5x - 1    25 + 28    = 53
     *
     * Nothing above 53, and three of the four keep `c` at 1 so that `4ac` stays
     * small. Drawn freely from a, b, c the clone reached 193 and sat above
     * every paper four draws in five - the same two marks, and a pupil doing
     * 81 - 288 in their head for the first of them.
     *
     * Sixty, which clears 53 without reaching for a number no paper sets.
     */
    if ((capped || is2016) && Math.abs(d) > 60) continue;
    const nature = d > 0 ? 'two real and distinct roots'
      : d === 0 ? 'one repeated real root (two equal real roots)'
      : 'no real roots';
    const there = d === 0 ? 'is' : 'are';

    return {
      subTopic: 'The Discriminant',
      difficulty: 'skill',
      variationId: capped ? 'quadratics.discriminant-capped' : 'quadratics.discriminant',
      // All four cited papers word it identically — "Determine the nature of the
      // roots of the function f(x)=…", with no prompt to use the discriminant and
      // nothing set equal to zero.
      questionLines: [
        `Determine the nature of the roots of the function $${fname}(${v}) = ${fmt([c, b, a], v)}$.`,
      ],
      boardQuestionLines: [`Nature of the roots of $${fmt([c, b, a], v)}$?`],
      // Two marks in all four papers: •¹ calculate the discriminant, •² state
      // the nature of the roots. Naming the coefficients is not a mark, so it
      // opens the first step rather than being one of its own.
      solutionSteps: [
        `<strong>1.</strong> With $a = ${a}$, $b = ${b}$ and $c = ${c}$, calculate $b^{2} - 4ac$:<br><br>$(${b})^{2} - 4 \\times ${a} \\times (${c}) = ${d}$`,
        `<strong>2.</strong> ${d > 0 ? 'The discriminant is positive' : d === 0 ? 'The discriminant is zero' : 'The discriminant is negative'}, so there ${there} <strong>${nature}</strong>.`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$b^{2}-4ac = ${d}$, so there ${there} ${nature}`,
    };
  }
  throw new Error('quadratics.discriminant: no valid question found');
}

// ── skill and shape: the quadratic formula — 2017 P2 Q4, 2019 P2 Q6, 2022 P2 Q7, 2024 P2 Q8 ─
//
// Every paper example asks for a rounded answer, and the rounding varies by
// diet: one decimal place, two decimal places, two significant figures.

function quadraticFormula(wanted?: string, asked?: string): Q {
  const ROUNDINGS = [
    { dp: 1, phrase: 'Give your answers correct to one decimal place.' },
    // 2024 P2 Q8, this rounding's only paper, writes the numeral: "correct to
    // 2 decimal places". The owner, on the 2024 re-review sheet: "Yes".
    { dp: 2, phrase: 'Give your answers correct to 2 decimal places.' },
    // 2022 P2 Q7, likewise: "correct to 2 significant figures". The owner, on
    // the 2022 re-review sheet: "Yes".
    { sf: 2, phrase: 'Give your answers correct to 2 significant figures.' },
  ] as const;
  // Taught: the rounding instruction IS the id. 2022 P2 Q7 asks for two
  // significant figures and 2024 P2 Q8 for two decimal places — a pupil meets
  // two different questions, so the draw must not decide which one they get.
  const rounding = wanted === 'quadratics.formula-sigfigs' ? ROUNDINGS[2]
    : wanted === 'quadratics.formula-2dp' ? ROUNDINGS[1]
    : wanted === 'quadratics.formula' ? ROUNDINGS[0]
    : pick([...ROUNDINGS]);

  for (let tries = 0; tries < 400; tries++) {
    /**
     * **2017 P2 Q4 always solves in x.** The owner, on the 2017 P2 sheet:
     * *"For this question variable should always be x"*. The letter is still
     * drawn, so the stream is the same for every id, and only this one - an
     * ALIAS sharing `wanted` with LOCKED 2019 P2 Q6 - reads x instead.
     */
    const drawnV = pick(VARS);
    const v = asked === 'quadratics.formula-2017' ? 'x' : drawnV;
    const a = nonZeroInt(1, 3);
    const b = nonZeroInt(-9, 9);
    const c = nonZeroInt(-9, 9);
    const d = b * b - 4 * a * c;
    if (d <= 0) continue;
    const r = Math.sqrt(d);
    if (Number.isInteger(r)) continue;              // a perfect square would factorise

    /**
     * **No common factor in a, b and c on 2019's and 2017's — 2026-09-26.**
     * 3x^2 - 3x - 9 = 0 in 38 of 400 of 2019 P2 Q6's draws and 36 of 2017 P2
     * Q4's; their papers, 3x^2 + 9x - 2 and 2x^2 + 5x - 4, have none. The
     * owner, on the 2019 re-review sheet: "Yes and fix 2017". A rejection on
     * those two ids only, so 2022 P2 Q7 and 2024 P2 Q8 draw exactly as before.
     */
    if ((asked === 'quadratics.formula' || asked === 'quadratics.formula-2017')
      && gcd(gcd(a, Math.abs(b)), Math.abs(c)) > 1) continue;
    const x1 = (-b + r) / (2 * a), x2 = (-b - r) / (2 * a);
    // a root just below zero rounds to the string "-0.0", which looks like a mistake
    if (Math.abs(x1) < 0.15 || Math.abs(x2) < 0.15) continue;
    const show = (x: number) => 'dp' in rounding
      ? x.toFixed(rounding.dp)
      : `${sigFigs(x, rounding.sf)}`;

    // ── two papers, two mark structures ─────────────────────────────────────
    //
    // 2022 P2 Q7 asks for two significant figures and is four marks; the other
    // three ask for one or two decimal places and are three. The scheme splits
    // the last mark in two for the significant-figure question — •³ the roots
    // before rounding, •⁴ the roots rounded — because rounding to significant
    // figures is a skill of its own in a way that rounding to a decimal place
    // is not.
    //
    // Scheme note 2: *"•⁴ is only available when both roots require rounding."*
    // Both always do here: the discriminant is never a perfect square (a
    // perfect square would factorise and is rejected above), so `r` is
    // irrational and so is every root. Nothing to guard — but it is the
    // condition the fourth mark rests on, so it is written down.
    const bySigFigs = !('dp' in rounding);

    return {
      subTopic: 'The Quadratic Formula',
      difficulty: 'skill',
      variationId: bySigFigs ? 'quadratics.formula-sigfigs'
        : rounding.dp === 2 ? 'quadratics.formula-2dp' : 'quadratics.formula',
      questionLines: [
        /**
         * **The paper does not name the method.** All three say only "Solve
         * the equation ... = 0", and leave the pupil to notice that it does
         * not factorise:
         *
         *   2017 P2 Q4   2x^2 + 5x - 4 = 0,  to one decimal place
         *   2019 P2 Q6   3x^2 + 9x - 2 = 0,  to 1 decimal place
         *   2024 P2 Q8   3x^2 + 8x + 1 = 0,  to 2 decimal places
         *
         * and the first mark is "correct substitution into quadratic formula",
         * so saying which formula to use hands over the decision that mark is
         * for. The discriminant is never a perfect square here, so the choice
         * is forced either way - the pupil just has to make it.
         */
        `Solve the equation $${fmt([c, b, a], v)} = 0$.`,
        // 2019 P2 Q6 writes the numeral, "correct to 1 decimal place"; 2017
        // P2 Q4, on its own alias, says "one". The owner, on the 2019
        // re-review sheet: "Yes". Words only, on 2019's id.
        asked === 'quadratics.formula' ? 'Give your answers correct to 1 decimal place.' : rounding.phrase,
      ],
      boardQuestionLines: [`Solve $${fmt([c, b, a], v)} = 0$ by formula. ${rounding.phrase}`],
      // •¹ correct substitution into the formula, •² evaluate the discriminant,
      // •³ both roots at the stated accuracy — and for the significant-figure
      // question, •³ the roots before rounding and •⁴ the roots rounded.
      // Naming the coefficients is not a mark of its own; it opens the
      // substitution.
      solutionSteps: [
        `<strong>1.</strong> With $a = ${a}$, $b = ${b}$ and $c = ${c}$, substitute into $${v} = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}$:<br><br>$${v} = \\frac{${-b} \\pm \\sqrt{(${b})^{2} - 4 \\times ${a} \\times (${c})}}{2 \\times ${a}}$`,
        `<strong>2.</strong> Evaluate the discriminant:<br><br>$b^{2}-4ac = ${d}$`,
        ...(bySigFigs
          ? [`<strong>3.</strong> Work out both roots, before any rounding:<br><br>$${v} = ${x1.toFixed(4)}\\ldots$ or $${v} = ${x2.toFixed(4)}\\ldots$`,
             `<strong>4.</strong> Round each to two significant figures:<br><br>$${v} = ${show(x1)}$ or $${v} = ${show(x2)}$`]
          : [`<strong>3.</strong> Work out both roots and round:<br><br>$${v} = ${show(x1)}$ or $${v} = ${show(x2)}$`]),
      ],
      stepMarks: bySigFigs ? [1, 1, 1, 1] : [1, 1, 1],
      finalAnswer: `$${v} = ${show(x1)}$ and $${v} = ${show(x2)}$`,
    };
  }
  throw new Error('quadratics.formula: no valid question found');
}

// ── complete the square, the axis, then surd roots — 2018 P1 Q19 ────────
//
// Seven marks in three parts, and the last of them turns on something the
// question does not spell out: the roots come out as d ± d√e, with **the same
// d twice**. That only happens when the completed-square constant is p² times a
// square-free number, since x = p ± √(p²e) = p ± p√e.
//
// So this is built backwards from p and e rather than from the quadratic:
// choose the shift and the square-free part, and the quadratic landing on them
// is x² − 2px + p²(1 − e). The paper's own p = 3, e = 10 gives x² − 6x − 81,
// and its note is explicit that the last mark is only available where the
// simplification actually reaches that form.

function completeSquareSurdRoots(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const p = getRandomInt(2, 7);
    const e = pick([2, 3, 5, 6, 7, 10, 11, 13, 15]);
    const under = p * p * e;                    // what ends up under the root
    const c = p * p - under;                    // the quadratic's constant term
    if (Math.abs(c) > 200) continue;
    const expr: Poly = [c, -2 * p, 1];

    return {
      subTopic: 'Completing the Square with Surd Roots',
      difficulty: 'exam',
      variationId: 'quadratics.complete-square-surd-roots',
      questionLines: [
        `<b>(a)</b>&nbsp;&nbsp;(i) Express $${fmt(expr, 'x')}$ in the form $(x - p)^{2} + q$.`,
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ii) Hence state the equation of the axis of symmetry of the graph of $y = ${fmt(expr, 'x')}$.`,
        `<b>(b)</b>&nbsp;&nbsp;The roots of the equation $${fmt(expr, 'x')} = 0$ can be expressed in the form $x = d \\pm d\\sqrt{e}$. Find, algebraically, the values of $d$ and $e$.`,
      ],
      boardQuestionLines: [
        `$${fmt(expr, 'x')}$: complete the square, state the axis of symmetry, then give the roots as $d \\pm d\\sqrt{e}$.`,
      ],
      solutionSteps: [
        `<strong>1. (a)(i)</strong> Halve the coefficient of $x$ to get the bracket:<br><br>$${-2 * p} \\div 2 = ${-p}$, so the bracket is $(x - ${p})^{2}$`,
        `<strong>2. (a)(i)</strong> That bracket carries an extra $${p * p}$, so take it off again and add the constant:<br><br>$(x - ${p})^{2} - ${under}$`,
        `<strong>3. (a)(ii)</strong> The axis of symmetry runs through the turning point, where the bracket is zero:<br><br>$x = ${p}$`,
        `<strong>4. (b)</strong> Set the completed square to zero:<br><br>$(x - ${p})^{2} - ${under} = 0$, so $(x - ${p})^{2} = ${under}$`,
        `<strong>5. (b)</strong> Take the square root of both sides, keeping both signs:<br><br>$x - ${p} = \\pm\\sqrt{${under}}$, so $x = ${p} \\pm \\sqrt{${under}}$`,
        `<strong>6. (b)</strong> Simplify the surd by taking out the largest square factor:<br><br>$\\sqrt{${under}} = ${p}\\sqrt{${e}}$`,
        `<strong>7. (b)</strong> So the roots are $x = ${p} \\pm ${p}\\sqrt{${e}}$, which is the form the question asks for:<br><br>$d = ${p}$, $e = ${e}$`,
      ],
      // 2018 P1 Q19 is 2 + 1 + 4: •¹ the bracket, •² complete the process,
      // •³ the axis of symmetry, then •⁴ equate to zero, •⁵ start to solve,
      // •⁶ solve, •⁷ complete. Note 2 withholds •⁷ unless the simplification
      // actually reaches the d ± d√e form.
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) $(x - ${p})^{2} - ${under}$, (ii) $x = ${p}$<br>(b) $d = ${p}$, $e = ${e}$`,
    };
  }
  throw new Error('quadratics.complete-square-surd-roots: no valid question found');
}

export const QUADRATIC_GENERATORS: Record<string, Gen> = {
  'Completing the Square': completeSquare,
  'Turning Point of a Parabola': turningPoint,
  'The Discriminant': (w, asked) => discriminant(w, asked),
  'The Quadratic Formula': (w, asked) => quadraticFormula(w, asked),
  'Completing the Square with Surd Roots': completeSquareSurdRoots,
};
