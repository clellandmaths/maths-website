import { GeneratedQuestion } from './types';
import { getRandomInt, gcd } from './utils';
import { vectorFigure, type VectorFigureSpec } from '../diagrams/shapes/vector-figure';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';
import { pt, type Pt } from '../diagrams/scene';

/**
 * Vector pathways — the five paper questions that give a figure and two arrows.
 *
 *   2016 P2 Q3    a parallelogram, express a diagonal                   1
 *   2017 P2 Q8    a triangle with a side extended, and a midpoint       1 + 2
 *   2018 P2 Q10   five points, two edges given as multiples of others   2
 *   2024 P2 Q14   a rhombus with a diagonal drawn, and a midpoint       1 + 2
 *   2025 P2 Q15   a triangle whose base runs on to a fourth point       2
 *
 * **Every point is defined as a combination of the two named vectors**, and the
 * figure is drawn by evaluating those combinations at real coordinates. So the
 * picture and the algebra come from the same arithmetic and cannot disagree —
 * there is no separate derivation to get wrong, which is the failure this topic
 * invites. Four of the five reproduce the papers' own printed answers exactly,
 * which is the evidence that the constructions are read correctly.
 *
 * The fifth is the rhombus, and it is flagged where it is built: the answer
 * SQA prints implies a labelling that the diagram would settle and the text
 * does not, so what is generated is a rhombus of our own stating its own
 * configuration rather than a guess at theirs.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** A coefficient as an exact fraction. */
type R = [number, number];
const r = (n: number, d = 1): R => {
  const k = gcd(Math.abs(n), Math.abs(d)) || 1;
  return d < 0 ? [-n / k, -d / k] : [n / k, d / k];
};
const rAdd = (a: R, b: R): R => r(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const rSub = (a: R, b: R): R => rAdd(a, [-b[0], b[1]]);
const rMul = (a: R, k: R): R => r(a[0] * k[0], a[1] * k[1]);
const rNum = (a: R): number => a[0] / a[1];

/** "\frac{3}{2}", or "3", or "" when it is 1 — the multiplier on a letter. */
function coefTex(a: R): string {
  const [n, d] = [Math.abs(a[0]), a[1]];
  if (d === 1) return n === 1 ? '' : `${n}`;
  return `\\frac{${n}}{${d}}`;
}

/**
 * "\frac{3}{2}\mathbf{d} - \frac{1}{2}\mathbf{c}", with zero terms dropped.
 *
 * A positive term leads. Written in whatever order the coefficients come out,
 * the commonest answer in this topic prints as "-\mathbf{a} + \mathbf{b}" —
 * and every paper writes that one as "\mathbf{b} - \mathbf{a}".
 */
function combo(a: R, b: R, nameA: string, nameB: string): string {
  const term = (k: R, name: string) => `${coefTex(k)}\\mathbf{${name}}`;
  let items: [R, string][] = ([[a, nameA], [b, nameB]] as [R, string][])
    .filter(([k]) => k[0] !== 0);
  if (items.length === 2 && items[0][0][0] < 0 && items[1][0][0] > 0) items.reverse();
  if (!items.length) return '0';
  return items.map(([k, name], i) => i === 0
    ? `${k[0] < 0 ? '-' : ''}${term(k, name)}`
    : `${k[0] < 0 ? '- ' : '+ '}${term(k, name)}`).join(' ');
}

/**
 * A point of the figure: its position as a multiple of each named vector.
 *
 * Everything downstream is arithmetic on these pairs, so the pathway a worked
 * solution describes and the coordinates the figure is drawn at are the same
 * numbers read twice.
 */
type Combo = { a: R; b: R };
const C = (an: number, ad: number, bn: number, bd: number): Combo =>
  ({ a: r(an, ad), b: r(bn, bd) });
const cSub = (p: Combo, q: Combo): Combo => ({ a: rSub(p.a, q.a), b: rSub(p.b, q.b) });
const cAdd = (p: Combo, q: Combo): Combo => ({ a: rAdd(p.a, q.a), b: rAdd(p.b, q.b) });
const cHalf = (p: Combo): Combo => ({ a: rMul(p.a, r(1, 2)), b: rMul(p.b, r(1, 2)) });
const cScale = (p: Combo, k: R): Combo => ({ a: rMul(p.a, k), b: rMul(p.b, k) });

/** Where a combination lands, given real vectors for the two letters. */
const place = (p: Combo, A: Pt, B: Pt): Pt =>
  pt(rNum(p.a) * A.x + rNum(p.b) * B.x, rNum(p.a) * A.y + rNum(p.b) * B.y);

/**
 * The pairs the papers actually name their pathway vectors with.
 *
 * Six pathway questions across the eleven papers use u/v twice, and a/b, c/d
 * and r/s once each. `p`/`q` and `m`/`n` were ours - reasonable-looking names
 * that no N5 paper gives a pathway vector.
 *
 * Aligning cost nothing: four pairs is still ample variety, so this never
 * needed the "the names are arbitrary" exemption that `change-subject`
 * genuinely does. See `__checks__/variables.ts`.
 */
const LETTER_SETS: [string, string][] = [
  ['u', 'v'], ['u', 'v'], ['a', 'b'], ['c', 'd'], ['r', 's'],
];

/** Build the question, or reject the layout and let the caller draw again. */
function assemble(
  spec: VectorFigureSpec, subTopic: string, variationId: string,
  prose: string[], board: string, steps: string[], stepMarks: number[], finalAnswer: string,
): Q | null {
  const fig = vectorFigure(spec);
  if (verifyFigure(fig).length) return null;
  return {
    subTopic, difficulty: 'exam', variationId,
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [board],
    solutionSteps: steps, stepMarks, finalAnswer, figure: fig,
  };
}

const vec = (n: string) => `\\mathbf{${n}}`;
const ray = (a: string, b: string) => `\\overrightarrow{${a}${b}}`;

// ── a parallelogram, and one of its diagonals — 2016 P2 Q3 ───────────────

function parallelogram(): Q | null {
  const [P1, P2, P3, P4] = pick([['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'],
    ['K', 'L', 'M', 'N'], ['W', 'X', 'Y', 'Z']]);
  const [nu, nv] = pick(LETTER_SETS);
  // A at the origin, AB = u, BC = v, so C is u + v and D is v
  const pos: Record<string, Combo> = {
    [P1]: C(0, 1, 0, 1), [P2]: C(1, 1, 0, 1), [P3]: C(1, 1, 1, 1), [P4]: C(0, 1, 1, 1),
  };
  // Which diagonal, and which way along it: see the note on the given sides
  // below. Reversing a diagonal is not padding - a pupil who can write BD
  // often stalls on DB.
  /**
   * **Which two sides are given — 2026-09-24.** The owner, on the 2016 P2
   * sheet: *"Could we widen this by asking for any diagonal plus any of the
   * other 2 sides as long as it's not 2 parallel sides"* — confirmed as: the
   * two GIVEN vectors may be any pair of adjacent sides, going round the
   * shape as the paper's AB then BC do.
   *
   * **And the diagonal asked for runs through the corner those two share.**
   * The owner again, seeing the first build: *"I think asking for the
   * diagonal in the same triangle makes the question too easy"*. Given AB and
   * BC, AC is the third side of their own triangle - just u + v. The paper
   * asks for BD, from the shared corner, which needs a side to be reversed
   * (v - u). So the diagonal is always the one through that corner, either
   * way along it: 4 corners times 2 directions is 8.
   *
   * The figure stays drawn in its own basis (AB along U, BC along V); the
   * given pair meeting at corner k is AB,BC / BC,CD / CD,DA / DA,AB, which
   * is U,V / V,-U / -U,-V / -V,U, so U and V are re-expressed in the named
   * vectors before the answer is written. Only this routine reads it.
   */
  const names = [P1, P2, P3, P4];
  const k = pick([0, 1, 2, 3]);
  const [g1, g2] = [[names[k], names[(k + 1) % 4]], [names[(k + 1) % 4], names[(k + 2) % 4]]];
  const shared = names[(k + 1) % 4], across = names[(k + 3) % 4];
  const [from, to] = pick([[shared, across], [across, shared]]);
  // Every route goes via a corner the two share: A and C meet at B, B and D
  // meet at A.
  const via = (from === P1 || from === P3) ? P2 : P1;
  const wantG = cSub(pos[to], pos[from]);
  const neg = (x: R): R => rSub(r(0, 1), x);
  const want: Combo = k === 0 ? wantG
    : k === 1 ? { a: wantG.b, b: neg(wantG.a) }
    : k === 2 ? { a: neg(wantG.a), b: neg(wantG.b) }
    : { a: neg(wantG.b), b: wantG.a };

  const U = pt(70, 0), V = pt(26, 46);
  const points = Object.fromEntries(Object.entries(pos).map(([k, v]) => [k, place(v, U, V)]));
  const answer = combo(want.a, want.b, nu, nv);

  const prose = [
    `The diagram below shows parallelogram $${P1}${P2}${P3}${P4}$.`,
    `$${ray(g1[0], g1[1])}$ represents vector $${vec(nu)}$ and $${ray(g2[0], g2[1])}$ represents vector $${vec(nv)}$.`,
    `Express $${ray(from, to)}$ in terms of $${vec(nu)}$ and $${vec(nv)}$.`,
  ];
  const steps = [
    `<strong>1.</strong> There is no direct route, so go from $${from}$ to $${to}$ by way of $${via}$:` +
    `<br><br>$${ray(from, to)} = ${ray(from, via)} + ${ray(via, to)} = ${answer}$`,
  ];
  return assemble({
    points,
    // The diagonal asked for is drawn, with a bare arrowhead and no letter -
    // which is exactly what 2016 P2 Q3 does with its BD.
    edges: [[P1, P2], [P2, P3], [P3, P4], [P4, P1], [from, to]],
    arrows: [{ from: g1[0], to: g1[1], label: nu }, { from: g2[0], to: g2[1], label: nv },
             { from, to }],
  }, 'A Pathway in a Parallelogram', 'vectors.pathway-parallelogram', prose,
    `Parallelogram $${P1}${P2}${P3}${P4}$, $${ray(g1[0], g1[1])} = ${vec(nu)}$, $${ray(g2[0], g2[1])} = ${vec(nv)}$. Find $${ray(from, to)}$.`,
    steps, [1], `$${answer}$`);
}

// ── a triangle with a side extended, and a midpoint — 2017 P2 Q8 ─────────

function extendedSide(): Q | null {
  const [A, B, D, T, V] = pick([['P', 'Q', 'R', 'T', 'V'], ['A', 'B', 'C', 'S', 'M'],
    ['D', 'E', 'F', 'G', 'N'], ['K', 'L', 'M', 'T', 'V']]);
  const [nc, nd] = pick(LETTER_SETS);
  /**
   * How far the side runs on, and which segment the midpoint bisects.
   *
   * This variation had **no numeric parameter at all** - every value below was
   * a literal - so it produced one question in sixteen spellings. `k` and
   * `mid` are both things the papers vary: 2017 P2 Q8 extends by exactly one
   * length and 2018 P2 Q10 states its edges as multiples of others, and the
   * figure has two segments a midpoint can sit on.
   *
   * Neither touches the marks. Part (a) stays one for the direct pathway and
   * part (b) two for the composite, whatever these are.
   */
  // One or two lengths, not three. At three the figure is four lengths wide,
  // and since it is scaled to a fixed frame the labels grow relative to the
  // ink until the vector letter cannot clear the run-on line - which is
  // collinear with the edge it names. Stated here rather than left to the
  // retry loop, which would drop it in silence.
  const k = getRandomInt(1, 2);              // TA = k x AB
  /**
   * **V is always the midpoint of the part (a) side, and each given vector
   * may point either way.** — 2026-09-23
   *
   * 2017 P2 Q8's route for (b) is TP + ½PR: it builds on the PR that part (a)
   * found. Half the draws here put V on the side carrying a given vector
   * instead, so (b) no longer used (a), and V's dot sat on that side's
   * arrowhead. That left 4 questions, two of them not the paper's. The owner
   * agreed to pin V and to let each given vector run either way — RQ or QR,
   * PQ or QP — which changes the signs a pupil works with and nothing else.
   */
  const sc = getRandomInt(0, 1) === 0 ? 1 : -1;   // DB = c, or BD = c
  const sd = getRandomInt(0, 1) === 0 ? 1 : -1;   // AB = d, or BA = d
  // A at the origin. AB = sd·d, DB = sc·c, so D = B - sc·c. T runs back from
  // A along BA, k lengths of AB. V is the midpoint of AD.
  const pos: Record<string, Combo> = {
    [A]: C(0, 1, 0, 1),
    [B]: C(0, 1, sd, 1),
    [D]: cSub(C(0, 1, sd, 1), C(sc, 1, 0, 1)),
    [T]: C(0, 1, -k * sd, 1),
  };
  const [m1, m2] = [A, D];
  const cRay = sc === 1 ? ray(D, B) : ray(B, D);
  const dRay = sd === 1 ? ray(A, B) : ray(B, A);
  pos[V] = cHalf(cAdd(pos[m1], pos[m2]));
  const first = cSub(pos[D], pos[A]);
  const second = cSub(pos[V], pos[T]);

  // The figure runs (k+1) lengths of d across, so it grows the same way
  // upwards. Left at a fixed height the picture went long and thin as k rose
  // and the labels crowded: at k=3 the vector label overlapped a point name
  // outright. This does not rescue every layout - see the note on how many
  // of the six combinations actually verify - but it removes the overlaps.
  const Cv = pt(44, -54 * (k + 1) / 2), Dv = pt(70, 0);
  const points = Object.fromEntries(Object.entries(pos).map(([k, v]) => [k, place(v, Cv, Dv)]));
  const [ans1, ans2] = [combo(first.a, first.b, nc, nd), combo(second.a, second.b, nc, nd)];

  const prose = [
    `In the diagram below, $${cRay}$ and $${dRay}$ represent the vectors $${vec(nc)}$ and $${vec(nd)}$ respectively.`,
    `<strong>(a)</strong> Express $${ray(A, D)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$.`,
    `The line $${B}${A}$ is extended to $${T}$, with $${T}${A} = ${k === 1 ? '' : k}${A}${B}$, and $${V}$ is the midpoint of $${m1}${m2}$.`,
    `<strong>(b)</strong> Express $${ray(T, V)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> Go from $${A}$ to $${B}$ and then back along the other vector:` +
    `<br><br>$${ray(A, D)} = ${ray(A, B)} + ${ray(B, D)} = ${ans1}$`,
    `<strong>2.</strong> $${T}${A}$ is ${k === 1 ? 'the same as' : `${k} times`} $${A}${B}$, and $${V}$ is halfway along $${m1}${m2}$, so build the pathway from $${T}$ to $${V}$:` +
    // No middle leg when the midpoint's line starts at A: it printed the zero
    // vector, "SA + AA + ½AC" (the owner, 2026-10-02, "Yes"; the scheme's TP + ½PR).
    `<br><br>$${ray(T, V)} = ${ray(T, A)}${A === m1 ? '' : ` + ${ray(A, m1)}`} + \\frac{1}{2}${ray(m1, m2)}$`,
    `<strong>3.</strong> Multiply out and collect:<br><br>$${ray(T, V)} = ${ans2}$`,
  ];
  // No equal-length marks. **Not one of the five papers draws them** -
  // 2017 P2 Q8 states "TP = PQ" in its prose and leaves the line bare -
  // and ours put a tick at the midpoint of the very edge that carries an
  // arrow, whose barbs splay back into it. Removed rather than moved: the
  // collision goes away by not drawing what the exam does not draw.
  const arrows = [
    sc === 1 ? { from: D, to: B, label: nc } : { from: B, to: D, label: nc },
    sd === 1 ? { from: A, to: B, label: nd } : { from: B, to: A, label: nd },
  ];
  /**
   * **Two figures, as the paper prints two.** — 2026-09-24
   *
   * 2017 P2 Q8 draws the triangle alone for part (a), then draws it again
   * with QP run on to T, V marked on PR and **T joined to V** for part (b).
   * This drew one figure, already extended, above part (a), and never drew
   * TV — the note in `vector-figure.ts` said the paper leaves it undrawn,
   * and the paper's second figure shows otherwise. The owner: *"I'd make
   * this question match original by have 2 diagrams. Also second diagram T
   * and V should join with a line like original question"*.
   *
   * TV is a plain line, no arrowhead, as the paper draws it; drawing it
   * gives nothing away, since the route to it is still the question.
   */
  const triangle: Record<string, Pt> = { [A]: points[A], [B]: points[B], [D]: points[D] };
  const fig1 = vectorFigure({ points: triangle, edges: [[A, B], [B, D], [D, A]], arrows });
  const fig2 = vectorFigure({
    points, edges: [[A, B], [B, D], [D, A], [T, A], [T, V]], arrows,
  });
  if (verifyFigure(fig1).length || verifyFigure(fig2).length) return null;
  return {
    subTopic: 'A Pathway with an Extended Side', difficulty: 'exam',
    variationId: 'vectors.pathway-extended',
    // 2017 P2 Q8's own layout for part (b): "The line QP is extended to T."
    // then the second diagram, then "• TP = PQ • V is the midpoint of PR" and
    // "Give your answer in simplest form." The owner, on the 2018-2014 light
    // pass: "Yes". Its only paper; `prose` still carries the old wording for
    // the board line and the check.
    questionLines: [
      prose[0], renderScene(fig1.scene), prose[1],
      `The line $${B}${A}$ is extended to $${T}$.`, renderScene(fig2.scene),
      `&bull;&nbsp; $${T}${A} = ${k === 1 ? '' : k}${A}${B}$`,
      `&bull;&nbsp; $${V}$ is the midpoint of $${m1}${m2}$`,
      `<strong>(b)</strong> Express $${ray(T, V)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$. Give your answer in simplest form.`,
    ],
    boardQuestionLines: [`$${cRay} = ${vec(nc)}$, $${dRay} = ${vec(nd)}$, $${T}${A} = ${k === 1 ? '' : k}${A}${B}$, $${V}$ midpoint of $${m1}${m2}$. Find $${ray(A, D)}$ and $${ray(T, V)}$.`],
    solutionSteps: steps, stepMarks: [1, 1, 1],
    finalAnswer: `(a) $${ans1}$ &nbsp;&nbsp; (b) $${ans2}$`,
    // The second carries everything the first does, and T, V and TV besides.
    figure: fig2,
  };
}

// ── five points, two edges given as multiples — 2018 P2 Q10 ──────────────

function multiples(): Q | null {
  const [A, B, Cp, D, E] = pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T'],
    ['J', 'K', 'L', 'M', 'N'], ['V', 'W', 'X', 'Y', 'Z']]);
  const [nu, nw] = pick(LETTER_SETS);
  /**
   * **"They all draw" was not true — 2026-09-22.**
   *
   * The comment that stood here said the placer and the verifier had been made
   * to measure the same thing, so every combination reached the page.
   * Counted: **five of twelve did.** `n = 4` and `n = 5` never drew at all,
   * nor did `m = 4, n = 3`. The retry loop discarded the rest in silence,
   * which is the failure `docs/review-paper.md` names — a pool collapses while
   * every draw succeeds, because the generator retries until it lands on a
   * survivor.
   *
   * The cause is the last leg: `DC` is `w / n`, so the larger `n` is the
   * shorter that segment gets, until its label cannot clear `D`. The fix is in
   * the drawing, below — the `w` direction now scales with `n`.
   *
   * The owner asked for this question to be widened. It turned out not to need
   * new levers at all, only the ability to draw what the arithmetic already
   * allowed: **sixteen combinations, and all sixteen draw**, against five.
   *
   * Sixths draw too — `n` to 6 gives twenty and every one of those draws as
   * well — and are deliberately not used. No paper on this topic sets one, and
   * halves through fifths are the ordinary National 5 range.
   */
  const m = getRandomInt(2, 5);         // ED = m x AB
  const n = getRandomInt(2, 5);         // EA = n x DC
  // A at the origin, AB = u, EA = w so E = -w, ED = m u, DC = w / n
  const pos: Record<string, Combo> = {
    [A]: C(0, 1, 0, 1),
    [B]: C(1, 1, 0, 1),
    [E]: C(0, 1, -1, 1),
  };
  pos[D] = cAdd(pos[E], C(m, 1, 0, 1));
  pos[Cp] = cAdd(pos[D], C(0, 1, 1, n));
  const want = cSub(pos[Cp], pos[B]);
  if (want.a[0] === 0 || want.b[0] === 0) return null;

  /**
   * The chain runs m lengths of u across, so the figure grows the same way
   * downwards. Held at a fixed height it went long and thin as m rose and the
   * labels crowded.
   *
   * **And it has to grow with `n` as well, which is what was missing.** The
   * last leg `DC` is `w / n`; with `w` fixed, a larger `n` shrinks that
   * segment until its label collides with `D` and the whole draw is thrown
   * away. Scaling `w` by `n / 2` keeps the shortest leg readable at every
   * combination — see the note on the bands above.
   *
   * **`n / 2` rather than anything cleverer, because at `n = 2` it is exactly
   * one.** Every combination that drew before this change is bit-identical
   * after it; only the seven that never drew are new.
   */
  const U = pt(60, 0), W = pt(-20, -45 * (m + 1) / 3 * (n / 2));
  const points = Object.fromEntries(Object.entries(pos).map(([k, v]) => [k, place(v, U, W)]));
  const answer = combo(want.a, want.b, nu, nw);

  const prose = [
    `In the diagram below, $${ray(A, B)}$ and $${ray(E, A)}$ represent the vectors $${vec(nu)}$ and $${vec(nw)}$ respectively.`,
    `$\\bullet \\quad ${ray(E, D)} = ${m}${ray(A, B)}$`,
    `$\\bullet \\quad ${ray(E, A)} = ${n}${ray(D, Cp)}$`,
    `Express $${ray(B, Cp)}$ in terms of $${vec(nu)}$ and $${vec(nw)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> There is no direct route, so go the long way round:` +
    `<br><br>$${ray(B, Cp)} = ${ray(B, A)} + ${ray(A, E)} + ${ray(E, D)} + ${ray(D, Cp)}$`,
    `<strong>2.</strong> Write each piece in terms of $${vec(nu)}$ and $${vec(nw)}$ and collect:` +
    `<br><br>$= -${vec(nu)} - ${vec(nw)} + ${m}${vec(nu)} + \\frac{1}{${n}}${vec(nw)} = ${answer}$`,
  ];
  return assemble({
    points,
    edges: [[E, A], [A, B], [B, Cp], [Cp, D], [D, E]],
    arrows: [{ from: A, to: B, label: nu }, { from: E, to: A, label: nw }],
    /**
     * **The letter goes outside its own corner, not wherever there is room.**
     *
     * The owner found `B` sitting inside the pathway. Counted across the
     * sixteen (m, n) pairs: **six of them seated it inside the pentagon**, and
     * `verifyFigure` passed all six — a letter in the open middle of a figure
     * is clear of every line there is, which is why nothing reported it.
     *
     * One of the six, `m = 4, n = 2`, drew before yesterday's widening as
     * well, so this is not purely a regression from it; the widening added
     * the other five.
     *
     * `B` is the corner the default rule cannot serve: the line from the
     * centre of the figure out to it runs almost straight along the edge
     * `AB`, so its preferred seat is blocked by that edge and the fallback
     * ring turns until it reaches the empty interior. A corner's own outward
     * bisector always clears both edges meeting there. See `bisectCorners`.
     */
    bisectCorners: true,
  }, 'A Pathway with Multiples', 'vectors.pathway-multiples', prose,
    `$${ray(A, B)} = ${vec(nu)}$, $${ray(E, A)} = ${vec(nw)}$, $${ray(E, D)} = ${m}${ray(A, B)}$, $${ray(E, A)} = ${n}${ray(D, Cp)}$. Find $${ray(B, Cp)}$.`,
    steps, [1, 1], `$${answer}$`);
}

// ── a rhombus with a diagonal drawn, and a midpoint — 2024 P2 Q14 ────────
//
// ⚠️ The configuration here is stated in the prose rather than taken from the
// paper's diagram, which is not reproduced. SQA's printed answer to part (b)
// implies a labelling of the rhombus that the text alone does not settle: with
// WXYZ read as the cyclic order and ZX as a diagonal, the midpoint of XY gives
// b - 3a/2, not the b - a/2 they print. Every point below is defined as a
// combination of the two vectors and the figure is drawn from those same
// combinations, so what is generated is right about itself; it is the paper's
// own arrangement that is being modelled rather than copied.

function rhombus(): Q | null {
  const [W, X, Y, Z, M] = pick([['W', 'X', 'Y', 'Z', 'M'], ['A', 'B', 'C', 'D', 'M'],
    ['P', 'Q', 'R', 'S', 'N'], ['J', 'K', 'L', 'M', 'T']]);
  const [na, nb] = pick(LETTER_SETS);
  // Z at the origin, ZW = a, and the diagonal ZX = b. In cyclic order WXYZ the
  // diagonals bisect, so Y = X + Z - W.
  const pos: Record<string, Combo> = {
    [Z]: C(0, 1, 0, 1),
    [W]: C(1, 1, 0, 1),
    [X]: C(0, 1, 1, 1),
  };
  pos[Y] = cSub(pos[X], pos[W]);
  /**
   * **Which side carries the midpoint, and where the pathway starts.**
   *
   * This used to read: *"Moving the midpoint is not available: step 3 turns on
   * XY being exactly -a, and a midpoint on YZ needs a three-leg pathway - a
   * different mark total rather than a different question."*
   *
   * **That was true only while part (b) always started at W.** Fix the start
   * and a midpoint on YZ is indeed three legs. Let the start move with the
   * side and every one of the four is two legs, because the vertex *before*
   * the side reaches it as one edge plus a half:
   *
   *   M on WX   ->  ZM = ZW + 1/2 WX
   *   M on XY   ->  WM = WX + 1/2 XY      the paper's own arrangement
   *   M on YZ   ->  XM = XY + 1/2 YZ
   *   M on ZW   ->  YM = YZ + 1/2 ZW
   *
   * So the mark total is untouched - one for part (a), two for the pathway -
   * and the four sides multiply the two ray reversals to give sixteen
   * questions where there were four. The owner, on the 2024 P2 sheet, asked
   * for both levers: *"Yes do both"*.
   *
   * Reversing a ray is not padding either. A pupil who writes WX confidently
   * will often stall on XW, and the topic's papers ask it both ways round.
   */
  const cycle = [W, X, Y, Z];
  /**
   * **Three sides, not four: ZW carries the arrow for `a`.**
   *
   * The fourth side was tried and rendered, and the PNG settled it — the
   * midpoint's dot lands on top of that arrow's head, and its label prints
   * against the vector's own label, so the figure reads `c M` crammed at one
   * point. `verifyFigure` passed it; looking at it did not. The other three
   * sides carry no arrow and are clear.
   */
  const sideAt = getRandomInt(0, 2);
  const P = cycle[sideAt];                     // the side runs P -> Q
  const Q = cycle[(sideAt + 1) % 4];
  const V = cycle[(sideAt + 3) % 4];           // the vertex before P
  pos[M] = cHalf(cAdd(pos[P], pos[Q]));

  const flipA = getRandomInt(0, 1) === 0;
  const flipB = getRandomInt(0, 1) === 0;
  const [fromA, toA] = flipA ? [X, W] : [W, X];
  const [fromB, toB] = flipB ? [M, V] : [V, M];
  const neg = (c: Combo): Combo => cSub(C(0, 1, 0, 1), c);
  const firstWX = cSub(pos[X], pos[W]);
  const secondVM = cSub(pos[M], pos[V]);
  const first = flipA ? neg(firstWX) : firstWX;
  const second = flipB ? neg(secondVM) : secondVM;
  // the two legs of the pathway, for the worked answer
  const legVP = cSub(pos[P], pos[V]);
  const legPQ = cSub(pos[Q], pos[P]);

  // A rhombus needs |b - a| = |a|, so b is placed on that circle. The turn is
  // what the interior angle at W comes to, less ninety: at the first range
  // tried it ran from 38 to 68 degrees and the figure read as a sliver rather
  // than a rhombus. Fifty to eighty is the range the papers draw.
  const side = 52;
  const turn = getRandomInt(-40, -10) * Math.PI / 180;
  const A = pt(0, side);
  const B = pt(A.x + side * Math.cos(turn), A.y + side * Math.sin(turn));
  const points = Object.fromEntries(Object.entries(pos).map(([k, v]) => [k, place(v, A, B)]));
  const [ans1, ans2] = [combo(first.a, first.b, na, nb), combo(second.a, second.b, na, nb)];

  const prose = [
    `The diagram shows a rhombus $${W}${X}${Y}${Z}$ with the diagonal $${Z}${X}$ drawn.`,
    `$${ray(Z, W)}$ represents vector $${vec(na)}$ and $${ray(Z, X)}$ represents vector $${vec(nb)}$.`,
    `<strong>(a)</strong> Express $${ray(fromA, toA)}$ in terms of $${vec(na)}$ and $${vec(nb)}$.`,
    `$${M}$ is the midpoint of $${P}${Q}$.`,
    `<strong>(b)</strong> Express $${ray(fromB, toB)}$ in terms of $${vec(na)}$ and $${vec(nb)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> Go from $${fromA}$ to $${toA}$ by way of $${Z}$:` +
    `<br><br>$${ray(fromA, toA)} = ${ray(fromA, Z)} + ${ray(Z, toA)} = ${ans1}$`,
    `<strong>2.</strong> $${M}$ is halfway along $${P}${Q}$, so the pathway is` +
    `<br><br>$${ray(V, M)} = ${ray(V, P)} + \\frac{1}{2}${ray(P, Q)}$`,
    `<strong>3.</strong> $${ray(V, P)} = ${combo(legVP.a, legVP.b, na, nb)}$ and ` +
    `$${ray(P, Q)} = ${combo(legPQ.a, legPQ.b, na, nb)}$, so collect` +
    `${flipB ? ', then turn it round' : ''}:<br><br>$${ray(fromB, toB)} = ${ans2}$`,
  ];
  return assemble({
    points,
    edges: [[W, X], [X, Y], [Y, Z], [Z, W], [Z, X]],
    arrows: [{ from: Z, to: W, label: na }, { from: Z, to: X, label: nb }],
  }, 'A Pathway in a Rhombus', 'vectors.pathway-rhombus', prose,
    `Rhombus $${W}${X}${Y}${Z}$, $${ray(Z, W)} = ${vec(na)}$, $${ray(Z, X)} = ${vec(nb)}$. Find $${ray(fromA, toA)}$ and $${ray(fromB, toB)}$.`,
    steps, [1, 1, 1], `(a) $${ans1}$ &nbsp;&nbsp; (b) $${ans2}$`);
}

// ── a base running on to a fourth point — 2025 P2 Q15 ────────────────────

function runningOn(): Q | null {
  const [D, G, E, F] = pick([['D', 'G', 'E', 'F'], ['A', 'B', 'C', 'H'],
    ['P', 'T', 'Q', 'S'], ['K', 'M', 'L', 'N']]);
  const [nr, ns] = pick(LETTER_SETS);
  // Two to five. 2025 P2 Q15 uses three; the fraction 1/k is the whole of the
  // second step, and a fifth is no heavier to take than a third. Six was left
  // out because the run-on leg becomes too short to letter clearly.
  const k = getRandomInt(2, 5);        // DE = k x EF
  // D at the origin, DG = r, GE = s, so E = r + s and F = E + (r + s)/k
  const pos: Record<string, Combo> = {
    [D]: C(0, 1, 0, 1),
    [G]: C(1, 1, 0, 1),
    [E]: C(1, 1, 1, 1),
  };
  pos[F] = cAdd(pos[E], cScale(pos[E], r(1, k)));
  /**
   * **Which end the journey starts from — the second lever.**
   *
   * The ratio was the only thing that counted (the point names and the
   * vector names are both normalised when different questions are counted),
   * so this clone made FOUR different questions and a pupil doing five had
   * seen them all. Widening the ratio does not help: k > 5 is excluded
   * deliberately just above, because the run-on leg becomes too short to
   * letter clearly, so wider draws are simply rejected.
   *
   * The owner, on the 2025 P2 sheet: *"your idea of going DF which i think
   * is good"*. 2025 P2 Q15 asks for GF; DF is the same journey read from
   * the other end, one step longer and no harder, and it doubles the count.
   *
   * **Not a form split.** Both ask "express a journey in terms of r and s"
   * with the same two marks and the same working; only the starting point
   * moves. A different starting point is a different number, not a
   * different question.
   */
  const fromD = getRandomInt(0, 1) === 0;
  const start = fromD ? D : G;
  const want = cSub(pos[F], pos[start]);

  const R = pt(30, 52), S = pt(60, -32);
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, R, S)]));
  const answer = combo(want.a, want.b, nr, ns);

  const prose = [
    `In the diagram, $${ray(D, G)}$ and $${ray(G, E)}$ are represented by vectors $${vec(nr)}$ and $${vec(ns)}$ respectively.`,
    `$${ray(D, E)} = ${k}${ray(E, F)}$.`,
    `Express $${ray(start, F)}$ in terms of $${vec(nr)}$ and $${vec(ns)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> First find $${ray(D, E)}$, then take the fraction of it that $${ray(E, F)}$ is:` +
    `<br><br>$${ray(D, E)} = ${vec(nr)} + ${vec(ns)}$, so $${ray(E, F)} = \\frac{1}{${k}}(${vec(nr)} + ${vec(ns)})$`,
    fromD
      ? `<strong>2.</strong> The pathway from $${D}$ is $${ray(D, E)} + ${ray(E, F)}$:` +
        `<br><br>$${ray(D, F)} = (${vec(nr)} + ${vec(ns)}) + \\frac{1}{${k}}(${vec(nr)} + ${vec(ns)}) = ${answer}$`
      : `<strong>2.</strong> The pathway from $${G}$ is $${ray(G, E)} + ${ray(E, F)}$:` +
        `<br><br>$${ray(G, F)} = ${vec(ns)} + \\frac{1}{${k}}(${vec(nr)} + ${vec(ns)}) = ${answer}$`,
  ];
  return assemble({
    points,
    // **GF is on the diagram, because 2025 P2 Q15 draws it.** Its figure has
    // four lines: D to G, G to E, the run D through E to F, and G to F running
    // alongside GE. That last one is the vector the question asks for, and the
    // clone left it out - so a pupil was asked to express a journey the picture
    // did not show.
    // The asked journey is drawn, whichever end it starts from — 2025 P2 Q15
    // draws GF alongside GE, and a pupil should not be asked to express a
    // journey the picture does not show.
    edges: [[D, G], [G, E], [D, E], [E, F], [start, F]],
    arrows: [{ from: D, to: G, label: nr }, { from: G, to: E, label: ns }],
  }, 'A Pathway Running On', 'vectors.pathway-running-on', prose,
    `$${ray(D, G)} = ${vec(nr)}$, $${ray(G, E)} = ${vec(ns)}$, $${ray(D, E)} = ${k}${ray(E, F)}$. Find $${ray(start, F)}$.`,
    steps, [1, 1], `$${answer}$`);
}

// ═══ widened on the owner's word, 2026-10-08 ═══════════════════════════════
//
// The widening sheet (https://claude.ai/artifact/SKZLY6zDdsFDaEfQLuCMiA) and its
// follow-up (https://claude.ai/artifact/K2fwaDiZs5QMHTa7faxjyt). Each card below
// has a topic of its own serving its id alone, so the dispatch sends that topic
// here and no other question can move. The original routines above are kept
// exactly as they were; two of the wide ones still call them for the paper's
// own form.

/** t as α·e1 + β·e2 (all in the figure's own basis): the coefficients on the two named vectors. */
function express(t: Combo, e1: Combo, e2: Combo): Combo {
  const det = rSub(rMul(e1.a, e2.b), rMul(e1.b, e2.a));
  const inv = (x: R): R => r(x[1], x[0]);
  const al = rMul(rSub(rMul(t.a, e2.b), rMul(t.b, e2.a)), inv(det));
  const be = rMul(rSub(rMul(e1.a, t.b), rMul(e1.b, t.a)), inv(det));
  return { a: al, b: be };
}
const neg1 = (x: R): R => rSub(r(0, 1), x);
/** A combination with either named vector turned round (−1). */
const sgn = (c: Combo, sa: number, sb: number): Combo => ({ a: sa === 1 ? c.a : neg1(c.a), b: sb === 1 ? c.b : neg1(c.b) });

/**
 * **2016 P2 Q3 — every question needs a parallel side.** The owner, on the
 * widening sheet: *"When pupils don't need to go down a parallel side the
 * question is too easy. I'd suggest thinking about varying the picture perhaps
 * from a parallelogram to other shapes with parallel sides."* Then, on the
 * follow-up: *"Option C but only add trapezium questions that require 2 sides
 * to be used we need to keep question as simple as possible"*.
 *
 * The two given vectors are two adjacent sides, either going round (the
 * paper's AB, BC) or leaving one corner (AB, AD). They reach three corners; the
 * vector asked for must touch the fourth, must not be a multiple of one given
 * vector alone, and its route must run only along given sides and sides
 * parallel to them. Shapes: the parallelogram, and a trapezium whose long side
 * is twice its short one (answers with a fraction are refused). `twoSides`
 * keeps the trapezium to routes of two sides.
 */
type Shape = 'parallelogram' | 'trapezium';
const SHAPE_BASIS: Record<Shape, { U: Pt; V: Pt }> = {
  parallelogram: { U: pt(70, 0), V: pt(26, 46) },
  trapezium: { U: pt(40, 0), V: pt(22, 46) },
};
function parallelSides(shapes: Shape[], id: string, topic: string, twoSides = false): Q | null {
  const shape = pick(shapes);
  const names = pick([['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['K', 'L', 'M', 'N'], ['W', 'X', 'Y', 'Z']]);
  const [P1, P2, P3, P4] = names;
  const [nu, nv] = pick(LETTER_SETS);
  // corners in the shape's own basis; the trapezium's P1P2 is twice P4P3
  const pos: Record<string, Combo> = shape === 'trapezium'
    ? { [P1]: C(0, 1, 0, 1), [P2]: C(2, 1, 0, 1), [P3]: C(1, 1, 1, 1), [P4]: C(0, 1, 1, 1) }
    : { [P1]: C(0, 1, 0, 1), [P2]: C(1, 1, 0, 1), [P3]: C(1, 1, 1, 1), [P4]: C(0, 1, 1, 1) };
  const k = pick([0, 1, 2, 3]);
  const at = names[k], nxt = names[(k + 1) % 4], opp = names[(k + 2) % 4], prv = names[(k + 3) % 4];
  const form = pick(['round', 'corner'] as const);
  const [g1, g2]: [string, string][] = form === 'round' ? [[at, nxt], [nxt, opp]] : [[at, nxt], [at, prv]];
  const covered = new Set([...g1, ...g2]);
  const fourth = names.find(n => !covered.has(n))!;
  const others = names.filter(n => n !== fourth);
  const [from, to] = pick(others.flatMap(o => [[fourth, o], [o, fourth]]));
  const e1 = cSub(pos[g1[1]], pos[g1[0]]), e2 = cSub(pos[g2[1]], pos[g2[0]]);
  const want = express(cSub(pos[to], pos[from]), e1, e2);
  if (want.a[0] === 0 || want.b[0] === 0) return null;                 // a multiple of one given alone
  if (want.a[1] !== 1 || want.b[1] !== 1) return null;                 // no fractions
  // the parallel pairs: every side of the parallelogram; the trapezium's P1P2 and P4P3 only
  const side = (x: string, y: string) => cSub(pos[y], pos[x]);
  const parallelTo = (x: string, y: string, gx: string, gy: string) => {
    const s = side(x, y), g = side(gx, gy);
    return rNum(s.a) * rNum(g.b) - rNum(s.b) * rNum(g.a) === 0;
  };
  const okEdge = (x: string, y: string) => [g1, g2].some(([gx, gy]) => parallelTo(x, y, gx, gy));
  // a route round the shape, either way, along given sides and sides parallel to them
  const iF = names.indexOf(from), iT = names.indexOf(to);
  const routes = [1, 3].map(step => { const out = [from]; let i = iF; while (i !== iT) { i = (i + step) % 4; out.push(names[i]); } return out; })
    .filter(rt => rt.slice(1).every((n, i) => okEdge(rt[i], n)))
    .sort((a, b) => a.length - b.length);
  if (!routes.length) return null;
  const route = routes[0];
  if (twoSides && shape === 'trapezium' && route.length !== 3) return null;
  const isGiven = (x: string, y: string) => [g1, g2].find(([gx, gy]) => (gx === x && gy === y) || (gx === y && gy === x));
  const termOf = (x: string, y: string) => { const t = express(side(x, y), e1, e2); return combo(t.a, t.b, nu, nv); };
  const reasons = route.slice(1).flatMap((n, i) => {
    const x = route[i];
    if (isGiven(x, n)) return [];
    const [gx, gy] = [g1, g2].find(([a, b]) => parallelTo(x, n, a, b))!;
    const why = shape === 'trapezium'
      ? `$${x}${n}$ is parallel to $${gx}${gy}$ and ${Math.abs(rNum(express(side(x, n), e1, e2).a) || rNum(express(side(x, n), e1, e2).b)) === 2 ? 'twice' : 'half'} as long`
      : `opposite sides of a ${shape} are equal and parallel`;
    return [`$${ray(x, n)} = ${termOf(x, n)}$, because ${why}`];
  });
  const answer = combo(want.a, want.b, nu, nv);
  const { U, V } = SHAPE_BASIS[shape];
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, U, V)]));
  const intro = shape === 'trapezium'
    ? [`The diagram below shows trapezium $${P1}${P2}${P3}${P4}$.`, `$${P1}${P2}$ is parallel to $${P4}${P3}$ and twice as long.`]
    : [`The diagram below shows ${shape} $${P1}${P2}${P3}${P4}$.`];
  const prose = [
    ...intro,
    `$${ray(g1[0], g1[1])}$ represents vector $${vec(nu)}$ and $${ray(g2[0], g2[1])}$ represents vector $${vec(nv)}$.`,
    `Express $${ray(from, to)}$ in terms of $${vec(nu)}$ and $${vec(nv)}$.`,
  ];
  const sum = route.slice(1).map((n, i) => ray(route[i], n)).join(' + ');
  const steps = [`<strong>1.</strong> There is no direct route, so go round the shape from $${from}$ to $${to}$:` +
    `<br><br>$${ray(from, to)} = ${sum}$` +
    (reasons.length ? `<br><br>${reasons.join('<br><br>')}` : '') +
    `<br><br>so $${ray(from, to)} = ${route.slice(1).map((n, i) => `(${termOf(route[i], n)})`).join(' + ')} = ${answer}$`];
  const edges: [string, string][] = [[P1, P2], [P2, P3], [P3, P4], [P4, P1]];
  if (!edges.some(([x, y]) => (x === from && y === to) || (x === to && y === from))) edges.push([from, to]);
  const fig = vectorFigure({ points, edges, arrows: [{ from: g1[0], to: g1[1], label: nu }, { from: g2[0], to: g2[1], label: nv }, { from, to }] });
  if (verifyFigure(fig).length) return null;
  return {
    subTopic: topic, difficulty: 'exam', variationId: id,
    questionLines: [intro[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`${shape} ${P1}${P2}${P3}${P4}, ${g1.join('')} = ${nu}, ${g2.join('')} = ${nv}. Find ${from}${to}.`],
    solutionSteps: steps, stepMarks: [1], finalAnswer: `$${answer}$`, figure: fig,
  };
}

/**
 * **2017 P2 Q8 — the side may also be extended by half a length** (TA = ½AB),
 * beside the paper's own. The owner: "Yes". Two draws in three are the
 * original routine's.
 */
function extendedSideHalf(id: string, topic: string): Q | null {
  if (getRandomInt(0, 2) > 0) { const q = extendedSide(); return q && { ...q, variationId: id, subTopic: topic }; }
  const [A, B, D, T, V] = pick([['P', 'Q', 'R', 'T', 'V'], ['A', 'B', 'C', 'S', 'M'], ['D', 'E', 'F', 'G', 'N'], ['K', 'L', 'M', 'T', 'V']]);
  const [nc, nd] = pick(LETTER_SETS);
  const sc = getRandomInt(0, 1) === 0 ? 1 : -1, sd = getRandomInt(0, 1) === 0 ? 1 : -1;
  const pos: Record<string, Combo> = {
    [A]: C(0, 1, 0, 1), [B]: C(0, 1, sd, 1), [D]: cSub(C(0, 1, sd, 1), C(sc, 1, 0, 1)), [T]: C(0, 1, -sd, 2),
  };
  pos[V] = cHalf(cAdd(pos[A], pos[D]));
  const first = cSub(pos[D], pos[A]), second = cSub(pos[V], pos[T]);
  const Cv = pt(44, -54), Dv = pt(70, 0);   // the paper's own (k = 1) height: a half run-on is shorter still
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, Cv, Dv)]));
  const [ans1, ans2] = [combo(first.a, first.b, nc, nd), combo(second.a, second.b, nc, nd)];
  const cRay = sc === 1 ? ray(D, B) : ray(B, D), dRay = sd === 1 ? ray(A, B) : ray(B, A);
  const arrows = [sc === 1 ? { from: D, to: B, label: nc } : { from: B, to: D, label: nc }, sd === 1 ? { from: A, to: B, label: nd } : { from: B, to: A, label: nd }];
  const triangle: Record<string, Pt> = { [A]: points[A], [B]: points[B], [D]: points[D] };
  const fig1 = vectorFigure({ points: triangle, edges: [[A, B], [B, D], [D, A]], arrows });
  const fig2 = vectorFigure({ points, edges: [[A, B], [B, D], [D, A], [T, A], [T, V]], arrows });
  if (verifyFigure(fig1).length || verifyFigure(fig2).length) return null;
  const steps = [
    `<strong>1.</strong> Go from $${A}$ to $${B}$ and then back along the other vector:<br><br>$${ray(A, D)} = ${ray(A, B)} + ${ray(B, D)} = ${ans1}$`,
    `<strong>2.</strong> $${T}${A}$ is half of $${A}${B}$, and $${V}$ is halfway along $${A}${D}$, so build the pathway from $${T}$ to $${V}$:<br><br>$${ray(T, V)} = ${ray(T, A)} + \\frac{1}{2}${ray(A, D)}$`,
    `<strong>3.</strong> Multiply out and collect:<br><br>$${ray(T, V)} = ${ans2}$`,
  ];
  return {
    subTopic: topic, difficulty: 'exam', variationId: id,
    questionLines: [
      `In the diagram below, $${cRay}$ and $${dRay}$ represent the vectors $${vec(nc)}$ and $${vec(nd)}$ respectively.`,
      renderScene(fig1.scene), `<strong>(a)</strong> Express $${ray(A, D)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$.`,
      `The line $${B}${A}$ is extended to $${T}$.`, renderScene(fig2.scene),
      `&bull;&nbsp; $${T}${A} = \\frac{1}{2}${A}${B}$`, `&bull;&nbsp; $${V}$ is the midpoint of $${A}${D}$`,
      `<strong>(b)</strong> Express $${ray(T, V)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$. Give your answer in simplest form.`,
    ],
    boardQuestionLines: [`$${cRay} = ${vec(nc)}$, $${dRay} = ${vec(nd)}$, $${T}${A} = \\frac{1}{2}${A}${B}$, $${V}$ midpoint of $${A}${D}$. Find $${ray(A, D)}$ and $${ray(T, V)}$.`],
    solutionSteps: steps, stepMarks: [1, 1, 1], finalAnswer: `(a) $${ans1}$ &nbsp;&nbsp; (b) $${ans2}$`, figure: fig2,
  };
}

/**
 * **2025 P2 Q15 — both levers** (the owner: "Yes" to "Yes to both levers"):
 * the journey may be asked either way round (FG, FD), and either given vector
 * may be named the other way (GD = r for DG = r).
 */
function runningOnWide(lever: 'reverse' | 'given' | 'all', id: string, topic: string): Q | null {
  const [D, G, E, F] = pick([['D', 'G', 'E', 'F'], ['A', 'B', 'C', 'H'], ['P', 'T', 'Q', 'S'], ['K', 'M', 'L', 'N']]);
  const [nr, ns] = pick(LETTER_SETS);
  const k = getRandomInt(2, 5);
  const pos: Record<string, Combo> = { [D]: C(0, 1, 0, 1), [G]: C(1, 1, 0, 1), [E]: C(1, 1, 1, 1) };
  pos[F] = cAdd(pos[E], cScale(pos[E], r(1, k)));
  const fromD = getRandomInt(0, 1) === 0;
  const start = fromD ? D : G;
  const back = (lever === 'reverse' || lever === 'all') && getRandomInt(0, 1) === 0;
  const sR = (lever === 'given' || lever === 'all') && getRandomInt(0, 1) === 0 ? -1 : 1;
  const sS = (lever === 'given' || lever === 'all') && getRandomInt(0, 1) === 0 ? -1 : 1;
  const [p, q] = back ? [F, start] : [start, F];
  const want = sgn(cSub(pos[q], pos[p]), sR, sS);
  const R0 = pt(30, 52), S0 = pt(60, -32);
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, R0, S0)]));
  const answer = combo(want.a, want.b, nr, ns);
  const rRay = sR === 1 ? ray(D, G) : ray(G, D), sRay = sS === 1 ? ray(G, E) : ray(E, G);
  const DGt = `${sR === 1 ? '' : '-'}${vec(nr)}`;
  const DEt = `${DGt} ${sS === 1 ? '+' : '-'} ${vec(ns)}`;
  const steps = [
    `<strong>1.</strong> First find $${ray(D, E)}$, then take the fraction of it that $${ray(E, F)}$ is:<br><br>$${ray(D, E)} = ${DEt}$, so $${ray(E, F)} = \\frac{1}{${k}}(${DEt})$`,
    `<strong>2.</strong> The pathway from $${start}$ to $${F}$ is $${fromD ? `${ray(D, E)}` : `${ray(G, E)}`} + ${ray(E, F)}$${back ? ', and the journey asked for is that one turned round' : ''}:<br><br>$${ray(p, q)} = ${answer}$`,
  ];
  return assemble({
    points, edges: [[D, G], [G, E], [D, E], [E, F], [start, F]],
    arrows: [sR === 1 ? { from: D, to: G, label: nr } : { from: G, to: D, label: nr }, sS === 1 ? { from: G, to: E, label: ns } : { from: E, to: G, label: ns }],
  }, topic, id, [
    `In the diagram, $${rRay}$ and $${sRay}$ are represented by vectors $${vec(nr)}$ and $${vec(ns)}$ respectively.`,
    `$${ray(D, E)} = ${k}${ray(E, F)}$.`,
    `Express $${ray(p, q)}$ in terms of $${vec(nr)}$ and $${vec(ns)}$. Give your answer in its simplest form.`,
  ], `$${rRay} = ${vec(nr)}$, $${sRay} = ${vec(ns)}$, $${ray(D, E)} = ${k}${ray(E, F)}$. Find $${ray(p, q)}$.`, steps, [1, 1], `$${answer}$`);
}

/**
 * **2024 P2 Q14 — either given vector may be named the other way** (WZ = a
 * for ZW = a; XZ = b for ZX = b). The owner: "Yes".
 */
function rhombusGiven(id: string, topic: string): Q | null {
  const [W, X, Y, Z, M] = pick([['W', 'X', 'Y', 'Z', 'M'], ['A', 'B', 'C', 'D', 'M'], ['P', 'Q', 'R', 'S', 'N'], ['J', 'K', 'L', 'M', 'T']]);
  const [na, nb] = pick(LETTER_SETS);
  const pos: Record<string, Combo> = { [Z]: C(0, 1, 0, 1), [W]: C(1, 1, 0, 1), [X]: C(0, 1, 1, 1) };
  pos[Y] = cSub(pos[X], pos[W]);
  const cycle = [W, X, Y, Z];
  const sideAt = getRandomInt(0, 2);
  const P = cycle[sideAt], Qp = cycle[(sideAt + 1) % 4], V = cycle[(sideAt + 3) % 4];
  pos[M] = cHalf(cAdd(pos[P], pos[Qp]));
  const flipA = getRandomInt(0, 1) === 0, flipB = getRandomInt(0, 1) === 0;
  const sA = getRandomInt(0, 1) === 0 ? -1 : 1, sB = getRandomInt(0, 1) === 0 ? -1 : 1;
  const [fromA, toA] = flipA ? [X, W] : [W, X];
  const [fromB, toB] = flipB ? [M, V] : [V, M];
  const first = sgn(cSub(pos[toA], pos[fromA]), sA, sB), second = sgn(cSub(pos[toB], pos[fromB]), sA, sB);
  const legVP = sgn(cSub(pos[P], pos[V]), sA, sB), legPQ = sgn(cSub(pos[Qp], pos[P]), sA, sB);
  const side = 52, turn = getRandomInt(-40, -10) * Math.PI / 180;
  const Av = pt(0, side), Bv = pt(Av.x + side * Math.cos(turn), Av.y + side * Math.sin(turn));
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, Av, Bv)]));
  const [ans1, ans2] = [combo(first.a, first.b, na, nb), combo(second.a, second.b, na, nb)];
  const aRay = sA === 1 ? ray(Z, W) : ray(W, Z), bRay = sB === 1 ? ray(Z, X) : ray(X, Z);
  const steps = [
    `<strong>1.</strong> Go from $${fromA}$ to $${toA}$ by way of $${Z}$:<br><br>$${ray(fromA, toA)} = ${ray(fromA, Z)} + ${ray(Z, toA)} = ${ans1}$`,
    `<strong>2.</strong> $${M}$ is halfway along $${P}${Qp}$, so the pathway is<br><br>$${ray(V, M)} = ${ray(V, P)} + \\frac{1}{2}${ray(P, Qp)}$`,
    `<strong>3.</strong> $${ray(V, P)} = ${combo(legVP.a, legVP.b, na, nb)}$ and $${ray(P, Qp)} = ${combo(legPQ.a, legPQ.b, na, nb)}$, so collect${flipB ? ', then turn it round' : ''}:<br><br>$${ray(fromB, toB)} = ${ans2}$`,
  ];
  return assemble({
    points, edges: [[W, X], [X, Y], [Y, Z], [Z, W], [Z, X]],
    arrows: [sA === 1 ? { from: Z, to: W, label: na } : { from: W, to: Z, label: na }, sB === 1 ? { from: Z, to: X, label: nb } : { from: X, to: Z, label: nb }],
  }, topic, id, [
    `The diagram shows a rhombus $${W}${X}${Y}${Z}$ with the diagonal $${Z}${X}$ drawn.`,
    `$${aRay}$ represents vector $${vec(na)}$ and $${bRay}$ represents vector $${vec(nb)}$.`,
    `<strong>(a)</strong> Express $${ray(fromA, toA)}$ in terms of $${vec(na)}$ and $${vec(nb)}$.`,
    `$${M}$ is the midpoint of $${P}${Qp}$.`,
    `<strong>(b)</strong> Express $${ray(fromB, toB)}$ in terms of $${vec(na)}$ and $${vec(nb)}$. Give your answer in its simplest form.`,
  ], `Rhombus $${W}${X}${Y}${Z}$, $${aRay} = ${vec(na)}$, $${bRay} = ${vec(nb)}$. Find $${ray(fromA, toA)}$ and $${ray(fromB, toB)}$.`,
    steps, [1, 1, 1], `(a) $${ans1}$ &nbsp;&nbsp; (b) $${ans2}$`);
}

/**
 * **2018 P2 Q10 — both levers** (the owner: "Both"): CB asked as well as BC,
 * and either given vector named the other way (BA = u, AE = w).
 */
function multiplesWide(lever: 'reverse' | 'given' | 'all', id: string, topic: string): Q | null {
  const [A, B, Cp, D, E] = pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T'], ['J', 'K', 'L', 'M', 'N'], ['V', 'W', 'X', 'Y', 'Z']]);
  const [nu, nw] = pick(LETTER_SETS);
  const m = getRandomInt(2, 5), n = getRandomInt(2, 5);
  const pos: Record<string, Combo> = { [A]: C(0, 1, 0, 1), [B]: C(1, 1, 0, 1), [E]: C(0, 1, -1, 1) };
  pos[D] = cAdd(pos[E], C(m, 1, 0, 1));
  pos[Cp] = cAdd(pos[D], C(0, 1, 1, n));
  const back = (lever === 'reverse' || lever === 'all') && getRandomInt(0, 1) === 0;
  const sU = (lever === 'given' || lever === 'all') && getRandomInt(0, 1) === 0 ? -1 : 1;
  const sW = (lever === 'given' || lever === 'all') && getRandomInt(0, 1) === 0 ? -1 : 1;
  const [p, q] = back ? [Cp, B] : [B, Cp];
  const want = sgn(cSub(pos[q], pos[p]), sU, sW);
  if (want.a[0] === 0 || want.b[0] === 0) return null;
  const U = pt(60, 0), W = pt(-20, -45 * (m + 1) / 3 * (n / 2));
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, U, W)]));
  const answer = combo(want.a, want.b, nu, nw);
  const uRay = sU === 1 ? ray(A, B) : ray(B, A), wRay = sW === 1 ? ray(E, A) : ray(A, E);
  const AB = `${sU === 1 ? '' : '-'}${vec(nu)}`, EA = `${sW === 1 ? '' : '-'}${vec(nw)}`;
  const flip = (s: string) => s.startsWith('-') ? s.slice(1) : `-${s}`;
  const steps = [
    `<strong>1.</strong> There is no direct route, so go the long way round:<br><br>$${ray(B, Cp)} = ${ray(B, A)} + ${ray(A, E)} + ${ray(E, D)} + ${ray(D, Cp)}$`,
    `<strong>2.</strong> Write each piece in terms of $${vec(nu)}$ and $${vec(nw)}$ and collect${back ? ', then turn the journey round' : ''}:<br><br>$${ray(B, Cp)} = ${flip(AB)} ${flip(EA).startsWith('-') ? '' : '+ '}${flip(EA)} + ${m}(${AB}) + \\frac{1}{${n}}(${EA})$, so $${ray(p, q)} = ${answer}$`,
  ];
  return assemble({
    points, edges: [[E, A], [A, B], [B, Cp], [Cp, D], [D, E]],
    arrows: [sU === 1 ? { from: A, to: B, label: nu } : { from: B, to: A, label: nu }, sW === 1 ? { from: E, to: A, label: nw } : { from: A, to: E, label: nw }],
    bisectCorners: true,
  }, topic, id, [
    `In the diagram below, $${uRay}$ and $${wRay}$ represent the vectors $${vec(nu)}$ and $${vec(nw)}$ respectively.`,
    `$\\bullet \\quad ${ray(E, D)} = ${m}${ray(A, B)}$`,
    `$\\bullet \\quad ${ray(E, A)} = ${n}${ray(D, Cp)}$`,
    `Express $${ray(p, q)}$ in terms of $${vec(nu)}$ and $${vec(nw)}$. Give your answer in its simplest form.`,
  ], `$${uRay} = ${vec(nu)}$, $${wRay} = ${vec(nw)}$. Find $${ray(p, q)}$.`, steps, [1, 1], `$${answer}$`);
}

// ── dispatch ──────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 3000; i++) {
    const q = make();
    if (q) return q;
  }
  throw new Error(`${name}: no valid question found`);
};

export const VECTOR_PATHWAY_GENERATORS: Record<string, () => Q> = {
  // all five widened on the owner's word, 2026-10-08 (see above); the original
  // routines `parallelogram`, `extendedSide`, `multiples`, `rhombus` and
  // `runningOn` are kept, and two of the wide ones still call them
  'A Pathway in a Parallelogram': tried('vectors.pathway-parallelogram',
    () => parallelSides(['parallelogram', 'trapezium'], 'vectors.pathway-parallelogram', 'A Pathway in a Parallelogram', true)),
  'A Pathway with an Extended Side': tried('vectors.pathway-extended',
    () => extendedSideHalf('vectors.pathway-extended', 'A Pathway with an Extended Side')),
  'A Pathway with Multiples': tried('vectors.pathway-multiples',
    () => multiplesWide('all', 'vectors.pathway-multiples', 'A Pathway with Multiples')),
  'A Pathway in a Rhombus': tried('vectors.pathway-rhombus',
    () => rhombusGiven('vectors.pathway-rhombus', 'A Pathway in a Rhombus')),
  'A Pathway Running On': tried('vectors.pathway-running-on',
    () => runningOnWide('all', 'vectors.pathway-running-on', 'A Pathway Running On')),
};
