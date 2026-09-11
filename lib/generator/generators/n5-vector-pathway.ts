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
  /**
   * Which diagonal, and which way along it.
   *
   * This asked for one of two, so the whole variation was two questions. A
   * diagonal has two ends and the parallelogram has two diagonals, and all four
   * are one mark and the same skill - u+v, -u-v, v-u and u-v. Reversing a
   * diagonal is not padding: a pupil who can write AC often stalls on CA.
   *
   * Four is this shape's ceiling and it is a real one. With u and v given,
   * those four are every pathway there is; a fifth would need a multiple or a
   * midpoint, and 2016 P2 Q3 has neither.
   */
  const [from, to] = pick([[P1, P3], [P3, P1], [P2, P4], [P4, P2]]);
  // Every route goes via the corner the two share: A and C meet at B, B and D
  // meet at A.
  const via = (from === P1 || from === P3) ? P2 : P1;
  const want = cSub(pos[to], pos[from]);

  const U = pt(70, 0), V = pt(26, 46);
  const points = Object.fromEntries(Object.entries(pos).map(([k, v]) => [k, place(v, U, V)]));
  const answer = combo(want.a, want.b, nu, nv);

  const prose = [
    `The diagram below shows parallelogram $${P1}${P2}${P3}${P4}$.`,
    `$${ray(P1, P2)}$ represents vector $${vec(nu)}$ and $${ray(P2, P3)}$ represents vector $${vec(nv)}$.`,
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
    arrows: [{ from: P1, to: P2, label: nu }, { from: P2, to: P3, label: nv },
             { from, to }],
  }, 'A Pathway in a Parallelogram', 'vectors.pathway-parallelogram', prose,
    `Parallelogram $${P1}${P2}${P3}${P4}$, $${ray(P1, P2)} = ${vec(nu)}$, $${ray(P2, P3)} = ${vec(nv)}$. Find $${ray(from, to)}$.`,
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
  const bisectsAD = getRandomInt(0, 1) === 0;
  // A at the origin. AB = d. DB = c, so D = B - c. T runs back from A along
  // BA, k lengths of AB. V is the midpoint of AD or of BD.
  const pos: Record<string, Combo> = {
    [A]: C(0, 1, 0, 1),
    [B]: C(0, 1, 1, 1),                       // b-letter is d
    [D]: cSub(C(0, 1, 1, 1), C(1, 1, 0, 1)),  // d - c
    [T]: C(0, 1, -k, 1),
  };
  const [m1, m2] = bisectsAD ? [A, D] : [B, D];
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
    `In the diagram below, $${ray(D, B)}$ and $${ray(A, B)}$ represent the vectors $${vec(nc)}$ and $${vec(nd)}$ respectively.`,
    `<strong>(a)</strong> Express $${ray(A, D)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$.`,
    `The line $${B}${A}$ is extended to $${T}$, with $${T}${A} = ${k === 1 ? '' : k}${A}${B}$, and $${V}$ is the midpoint of $${m1}${m2}$.`,
    `<strong>(b)</strong> Express $${ray(T, V)}$ in terms of $${vec(nc)}$ and $${vec(nd)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> Go from $${A}$ to $${B}$ and then back along the other vector:` +
    `<br><br>$${ray(A, D)} = ${ray(A, B)} + ${ray(B, D)} = ${ans1}$`,
    `<strong>2.</strong> $${T}${A}$ is ${k === 1 ? 'the same as' : `${k} times`} $${A}${B}$, and $${V}$ is halfway along $${m1}${m2}$, so build the pathway from $${T}$ to $${V}$:` +
    `<br><br>$${ray(T, V)} = ${ray(T, A)} + ${ray(A, m1)} + \\frac{1}{2}${ray(m1, m2)}$`,
    `<strong>3.</strong> Multiply out and collect:<br><br>$${ray(T, V)} = ${ans2}$`,
  ];
  return assemble({
    points,
    edges: [[A, B], [B, D], [D, A], [T, A]],
    // No equal-length marks. **Not one of the five papers draws them** -
    // 2017 P2 Q8 states "TP = PQ" in its prose and leaves the line bare -
    // and ours put a tick at the midpoint of the very edge that carries an
    // arrow, whose barbs splay back into it. Removed rather than moved: the
    // collision goes away by not drawing what the exam does not draw.
    arrows: [{ from: D, to: B, label: nc }, { from: A, to: B, label: nd }],
  }, 'A Pathway with an Extended Side', 'vectors.pathway-extended', prose,
    `$${ray(D, B)} = ${vec(nc)}$, $${ray(A, B)} = ${vec(nd)}$, $${T}${A} = ${k === 1 ? '' : k}${A}${B}$, $${V}$ midpoint of $${m1}${m2}$. Find $${ray(A, D)}$ and $${ray(T, V)}$.`,
    steps, [1, 1, 1], `(a) $${ans1}$ &nbsp;&nbsp; (b) $${ans2}$`);
}

// ── five points, two edges given as multiples — 2018 P2 Q10 ──────────────

function multiples(): Q | null {
  const [A, B, Cp, D, E] = pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T'],
    ['J', 'K', 'L', 'M', 'N'], ['V', 'W', 'X', 'Y', 'Z']]);
  const [nu, nw] = pick(LETTER_SETS);
  // 2 x 3 = six combinations, of which three used to reach the page: the rest
  // were rejected on label clearance and dropped by the retry loop without a
  // word. With the placer and the verifier finally measuring the same thing
  // they all draw, so the band can widen too.
  const m = getRandomInt(2, 4);         // ED = m x AB
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

  // The chain runs m lengths of u across, so the figure grows the same way
  // downwards. Held at a fixed height it went long and thin as m rose and the
  // labels crowded, which is why only three of its combinations ever drew.
  const U = pt(60, 0), W = pt(-20, -45 * (m + 1) / 3);
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
  pos[M] = cHalf(cAdd(pos[X], pos[Y]));
  /**
   * Which way along each of the two rays.
   *
   * The construction is otherwise fixed, so this was **one question** however
   * often it was drawn - the rhombus's angle jitters and nothing else moves.
   *
   * Reversing a ray is not padding. A pupil who writes WX confidently will
   * often stall on XW, and the topic's papers ask it both ways round. Moving
   * the midpoint is not available: step 3 turns on XY being exactly -a, and a
   * midpoint on YZ needs a three-leg pathway - a different mark total rather
   * than a different question.
   */
  const flipA = getRandomInt(0, 1) === 0;
  const flipB = getRandomInt(0, 1) === 0;
  const [fromA, toA] = flipA ? [X, W] : [W, X];
  const [fromB, toB] = flipB ? [M, W] : [W, M];
  const neg = (c: Combo): Combo => cSub(C(0, 1, 0, 1), c);
  const firstWX = cSub(pos[X], pos[W]);
  const secondWM = cSub(pos[M], pos[W]);
  const first = flipA ? neg(firstWX) : firstWX;
  const second = flipB ? neg(secondWM) : secondWM;

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
    `$${M}$ is the midpoint of $${X}${Y}$.`,
    `<strong>(b)</strong> Express $${ray(fromB, toB)}$ in terms of $${vec(na)}$ and $${vec(nb)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> Go from $${fromA}$ to $${toA}$ by way of $${Z}$:` +
    `<br><br>$${ray(fromA, toA)} = ${ray(fromA, Z)} + ${ray(Z, toA)} = ${ans1}$`,
    `<strong>2.</strong> $${M}$ is halfway along $${X}${Y}$, so the pathway is` +
    `<br><br>$${ray(W, M)} = ${ray(W, X)} + \\frac{1}{2}${ray(X, Y)}$`,
    `<strong>3.</strong> $${ray(X, Y)} = -${vec(na)}$, so collect${flipB ? ', then turn it round' : ''}:<br><br>$${ray(fromB, toB)} = ${ans2}$`,
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
  const want = cSub(pos[F], pos[G]);

  const R = pt(30, 52), S = pt(60, -32);
  const points = Object.fromEntries(Object.entries(pos).map(([kk, v]) => [kk, place(v, R, S)]));
  const answer = combo(want.a, want.b, nr, ns);

  const prose = [
    `In the diagram, $${ray(D, G)}$ and $${ray(G, E)}$ are represented by vectors $${vec(nr)}$ and $${vec(ns)}$ respectively.`,
    `$${ray(D, E)} = ${k}${ray(E, F)}$.`,
    `Express $${ray(G, F)}$ in terms of $${vec(nr)}$ and $${vec(ns)}$. Give your answer in its simplest form.`,
  ];
  const steps = [
    `<strong>1.</strong> First find $${ray(D, E)}$, then take the fraction of it that $${ray(E, F)}$ is:` +
    `<br><br>$${ray(D, E)} = ${vec(nr)} + ${vec(ns)}$, so $${ray(E, F)} = \\frac{1}{${k}}(${vec(nr)} + ${vec(ns)})$`,
    `<strong>2.</strong> The pathway from $${G}$ is $${ray(G, E)} + ${ray(E, F)}$:` +
    `<br><br>$${ray(G, F)} = ${vec(ns)} + \\frac{1}{${k}}(${vec(nr)} + ${vec(ns)}) = ${answer}$`,
  ];
  return assemble({
    points,
    edges: [[D, G], [G, E], [D, E], [E, F]],
    arrows: [{ from: D, to: G, label: nr }, { from: G, to: E, label: ns }],
  }, 'A Pathway Running On', 'vectors.pathway-running-on', prose,
    `$${ray(D, G)} = ${vec(nr)}$, $${ray(G, E)} = ${vec(ns)}$, $${ray(D, E)} = ${k}${ray(E, F)}$. Find $${ray(G, F)}$.`,
    steps, [1, 1], `$${answer}$`);
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
  'A Pathway in a Parallelogram': tried('vectors.pathway-parallelogram', parallelogram),
  'A Pathway with an Extended Side': tried('vectors.pathway-extended', extendedSide),
  'A Pathway with Multiples': tried('vectors.pathway-multiples', multiples),
  'A Pathway in a Rhombus': tried('vectors.pathway-rhombus', rhombus),
  'A Pathway Running On': tried('vectors.pathway-running-on', runningOn),
};
