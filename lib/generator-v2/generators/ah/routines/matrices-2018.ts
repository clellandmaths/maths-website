/**
 * Advanced Higher, Matrices: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/matrices.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { sum } from '../maths/format';
import { pmatrix } from '../maths/matrix';

// ── 2018 Q7 ────────────────────────────────────────────────────────────────
// 2C' - D, then det D = c(k + s) and D singular at k = -s. D's rows 1 and 3
// share their first two entries and D has a 0 in the middle, as the paper's,
// so expanding along row 2 leaves one minor: det D = -(k + s)·q(w - r).

interface Q7of2018 {
  C: number[][];
  /** D = [[p, q, r], [k + s, 0, u], [p, q, w]]. */
  p: number; q: number; r: number; u: number; w: number; s: number;
}

const q2018q7: CardRoutine<Q7of2018> = {
  draw: () => {
    const C = [0, 1, 2].map(() => [0, 1, 2].map(() => int(-3, 3)));
    const D = until(
      () => ({ p: int(1, 3), q: int(1, 3), r: nonZero(-3, 3), u: int(1, 4), w: nonZero(-3, 3) }),
      d => d.r !== d.w && Math.abs(d.q * (d.w - d.r)) <= 3,
    );
    return { C, ...D, s: nonZero(-5, 5) };
  },

  build: ({ C, p, q, r, u, w, s }): Built => {
    const kPlus = sum([{ coef: 1, body: 'k' }, { coef: s, body: '' }]);
    const D: (number | string)[][] = [[p, q, r], [kPlus, 0, u], [p, q, w]];
    const Ct = [0, 1, 2].map(i => [0, 1, 2].map(j => C[j][i]));
    const result: (number | string)[][] = Ct.map((row, i) => row.map((v, j) => {
      if (i === 1 && j === 0) return sum([{ coef: -1, body: 'k' }, { coef: 2 * v - s, body: '' }]);
      return 2 * v - (D[i][j] as number);
    }));
    const c = -q * (w - r);
    const det = sum([{ coef: c, body: 'k' }, { coef: c * s, body: '' }]);
    const vm = (a: number, b: number, cc: number, d: number) => `\\begin{vmatrix}${a} & ${b}\\\\${cc} & ${d}\\end{vmatrix}`;
    // The scheme writes the middle term, + 0|…|; the prose rules refuse a printed "+ 0", so it is left out and the step says why.
    const expansion = `-(${kPlus})${vm(q, r, q, w)} - ${u}${vm(p, q, p, q)}`;
    const transpose = `C' = ${pmatrix(Ct)}`;
    const difference = `2C' - D = ${pmatrix(result)}`;
    return {
      questionLines: [
        'Matrices $C$ and $D$ are given by:',
        `$C = ${pmatrix(C)}$ and $D = ${pmatrix(D)}$, where $k \\in \\mathbb{R}.$`,
        '<b>(a)</b> Obtain $2C\' - D$ where $C\'$ is the transpose of $C.$',
        '<b>(b)</b> (i) Find and simplify an expression for the determinant of $D.$',
        '(ii) State the value of $k$ such that $D^{-1}$ does not exist.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${transpose}$`,
        `<strong>(a)</strong> $${difference}$`,
        `<strong>(b)(i)</strong> Expanding along row 2, whose middle entry is 0: $\\det D = ${expansion}$`,
        `<strong>(b)(i)</strong> $\\det D = ${det}$`,
        `<strong>(b)(ii)</strong> $D^{-1}$ does not exist when $\\det D = 0$: $${det} = 0$, so $k = ${-s}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${difference}$`, `(b)(i) $${det}$`, `(b)(ii) $k = ${-s}$`].join('<br>'),
      ladder: {
        moves: [
          'What does a transpose do, and when does a matrix have no inverse?',
          '(a) Write $C\'$ by swapping the rows and columns of $C$.',
          '(a) Double $C\'$ and subtract $D$, entry by entry.',
          '(b)(i) Expand the determinant of $D$ along a row or a column. The zero makes one choice easier.',
          '(b)(i) Simplify.',
          '(b)(ii) Set the determinant equal to zero and solve for $k$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${pmatrix(Ct)}$`, `$${difference}$`, `$${expansion}$`, null, null],
      },
    };
  },
};

// ── 2018 Q11 ───────────────────────────────────────────────────────────────
// A rotation by θ anticlockwise, then a reflection: P = BA, which is never a
// rotation, its leading diagonal ±X and ∓X with X never 0 at these angles.

type Angle2018 = 'pi6' | 'pi4' | 'pi3' | 'twoPi3' | 'threePi4' | 'fivePi6';
type Mirror2018 = 'x' | 'y' | 'yx' | 'yminusx';

interface Q11of2018 { angle: Angle2018; mirror: Mirror2018 }

/** A component as a multiple of the angle's factor f: its sign and whether it carries √3. */
interface Part { sign: 1 | -1; root3: boolean }

/** θ, the factor f that both cos θ and sin θ share, and cos θ and sin θ as multiples of f. */
const ANGLES2018: Readonly<Record<Angle2018, { text: string; f: 'half' | 'root2'; cos: Part; sin: Part }>> = {
  pi6: { text: '\\frac{\\pi}{6}', f: 'half', cos: { sign: 1, root3: true }, sin: { sign: 1, root3: false } },
  pi4: { text: '\\frac{\\pi}{4}', f: 'root2', cos: { sign: 1, root3: false }, sin: { sign: 1, root3: false } },
  pi3: { text: '\\frac{\\pi}{3}', f: 'half', cos: { sign: 1, root3: false }, sin: { sign: 1, root3: true } },
  twoPi3: { text: '\\frac{2\\pi}{3}', f: 'half', cos: { sign: -1, root3: false }, sin: { sign: 1, root3: true } },
  threePi4: { text: '\\frac{3\\pi}{4}', f: 'root2', cos: { sign: -1, root3: false }, sin: { sign: 1, root3: false } },
  fivePi6: { text: '\\frac{5\\pi}{6}', f: 'half', cos: { sign: -1, root3: true }, sin: { sign: 1, root3: false } },
};

/** The reflection's matrix and how P = B[[c, -s], [s, c]] reads, entry by entry: a sign and c or s. */
const MIRRORS2018: Readonly<Record<Mirror2018, { text: string; B: number[][]; P: [1 | -1, 'c' | 's'][][] }>> = {
  x: { text: 'the x-axis', B: [[1, 0], [0, -1]], P: [[[1, 'c'], [-1, 's']], [[-1, 's'], [-1, 'c']]] },
  y: { text: 'the y-axis', B: [[-1, 0], [0, 1]], P: [[[-1, 'c'], [1, 's']], [[1, 's'], [1, 'c']]] },
  yx: { text: 'the line $y = x$', B: [[0, 1], [1, 0]], P: [[[1, 's'], [1, 'c']], [[1, 'c'], [-1, 's']]] },
  yminusx: { text: 'the line $y = -x$', B: [[0, -1], [-1, 0]], P: [[[-1, 's'], [-1, 'c']], [[-1, 'c'], [1, 's']]] },
};

/** A multiple of f inside the bracket: `1`, `-\sqrt{3}`. */
const inner = (sign: number, part: Part): string => `${sign * part.sign < 0 ? '-' : ''}${part.root3 ? '\\sqrt{3}' : '1'}`;

/** The same entry written out exactly: `\frac{1}{2}`, `-\frac{\sqrt{3}}{2}`, `-\frac{1}{\sqrt{2}}`. */
function exact(sign: number, part: Part, f: 'half' | 'root2'): string {
  const s = sign * part.sign < 0 ? '-' : '';
  if (f === 'root2') return `${s}\\frac{1}{\\sqrt{2}}`;
  return `${s}\\frac{${part.root3 ? '\\sqrt{3}' : '1'}}{2}`;
}

const q2018q11: CardRoutine<Q11of2018> = {
  draw: () => ({
    angle: pick(['pi6', 'pi4', 'pi3', 'twoPi3', 'threePi4', 'fivePi6'] as const),
    mirror: pick(['x', 'y', 'yx', 'yminusx'] as const),
  }),

  build: ({ angle, mirror }): Built => {
    const t = ANGLES2018[angle], m = MIRRORS2018[mirror];
    const factor = t.f === 'half' ? '\\frac{1}{2}' : '\\frac{1}{\\sqrt{2}}';
    const part = (which: 'c' | 's') => (which === 'c' ? t.cos : t.sin);
    const general = `\\begin{pmatrix}\\cos${t.text} & -\\sin${t.text}\\\\\\sin${t.text} & \\cos${t.text}\\end{pmatrix}`;
    const A = pmatrix([[exact(1, t.cos, t.f), exact(-1, t.sin, t.f)], [exact(1, t.sin, t.f), exact(1, t.cos, t.f)]]);
    const Afactored = `${factor}${pmatrix([[inner(1, t.cos), inner(-1, t.sin)], [inner(1, t.sin), inner(1, t.cos)]])}`;
    const B = pmatrix(m.B);
    const Pfactored = `${factor}${pmatrix(m.P.map(row => row.map(([sg, w]) => inner(sg, part(w)))))}`;
    const P = pmatrix(m.P.map(row => row.map(([sg, w]) => exact(sg, part(w), t.f))));
    const [d1, d2] = [m.P[0][0], m.P[1][1]].map(([sg, w]) => exact(sg, part(w), t.f));
    const why = `$P$ is not of the form $\\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\\\sin\\theta & \\cos\\theta\\end{pmatrix}$: the elements on its leading diagonal, $${d1}$ and $${d2}$, are not equal`;
    const turn = `an anticlockwise rotation of $${t.text}$ radians about the origin`;
    // A sentence ending on maths takes its full stop inside it: "the line $y = x.$"
    const ended = m.text.endsWith('$') ? `${m.text.slice(0, -1)}.$` : `${m.text}.`;
    return {
      questionLines: [
        `<b>(a)</b> Obtain the matrix, $A$, associated with ${turn}.`,
        `<b>(b)</b> Find the matrix, $B$, associated with a reflection in ${ended}`,
        `<b>(c)</b> Hence obtain the matrix, $P$, associated with ${turn} followed by reflection in ${m.text}, expressing your answer using exact values.`,
        '<b>(d)</b> Explain why matrix $P$ is not associated with rotation about the origin.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $A = ${general} = ${A}$`,
        `<strong>(b)</strong> $B = ${B}$`,
        `<strong>(c)</strong> The rotation is done first, so $P = BA = ${B}${Afactored}$`,
        `<strong>(c)</strong> $P = ${Pfactored} = ${P}$`,
        `<strong>(d)</strong> ${why}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${A}$`, `(b) $${B}$`, `(c) $${P}$`, `(d) ${why}.`].join('<br>'),
      ladder: {
        moves: [
          'Where does each transformation send $(1, 0)$ and $(0, 1)$?',
          '(a) Write the rotation matrix for the angle given.',
          `(b) Write the matrix for a reflection in ${ended}`,
          '(c) Write the product in the right order: the transformation done first goes on the right.',
          '(c) Multiply, using exact values.',
          '(d) Compare $P$ with the general form of a rotation matrix. Which entries fail to match?',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${general}$`, null, `$${B}${Afactored}$`, `$${Pfactored}$`, null],
        watch: { at: 4, text: 'Keep exact values: surds and fractions, not decimals.' },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q7': q2018q7,
  '2018 Q11': q2018q11,
};
