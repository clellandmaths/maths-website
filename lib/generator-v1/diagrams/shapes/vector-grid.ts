import {
  type Claim, type Element, type Figure, type Pt, add, pt, scale, sub, unit,
} from '../scene';

/**
 * Arrowed vectors drawn on a plain square lattice — 2015 P2 Q5, 2025 P1 Q13.
 *
 * **No axes, no numbers, no origin.** That is what these two print: ten squares
 * by ten, and nothing else. It is not the gridded scattergraph with its ruling
 * stripped — there is nothing to read a *value* off, only a displacement to
 * count in squares, which is the whole skill. So this is its own figure rather
 * than a mode of `sketch-axes`.
 *
 * The two questions use it opposite ways round:
 *
 *   2015 P2 Q5   two vectors drawn, components counted off them and added
 *   2025 P1 Q13  the components given, and **the answer is a drawing**
 *
 * so the same routine has to serve a question and an answer. The second is only
 * the second question in the course whose answer is a picture, after the
 * parabola sketches, and its scheme is explicit that the drawn arrow is what
 * earns the mark: "consistent vector p+q drawn (must include arrow)".
 *
 * Vectors are placed apart rather than tail to tail, as the paper does — 2015
 * puts p across the top left and q down the right, sharing no point. Two arrows
 * from one origin would be a different picture, and would half-answer the
 * question by suggesting the parallelogram.
 */

export interface VectorGridSpec {
  /** The lattice, in squares. Both papers print ten by ten. */
  cols: number;
  rows: number;
  /**
   * Each vector by its tail and head in lattice squares, origin bottom left.
   *
   * The label is plain text and is the vector's name — "p", "q", "p + q".
   * Nothing runs MathJax over an SVG label, so bold and italics are not
   * available here and the papers' bold **p** is a plain p.
   */
  vectors: { from: [number, number]; to: [number, number]; label?: string }[];
}

/** Drawing units per square. Ten of these is a figure the size of the others. */
const CELL = 9;

/** Two barbs at a point, pointing along a direction. Decoration, never measured. */
function head(at: Pt, along: Pt, size: number): Element[] {
  const u = unit(along);
  return [0.42, -0.42].map(turn => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -size)), decoration: true };
  });
}

export function vectorGrid(spec: VectorGridSpec): Figure | null {
  const { cols, rows } = spec;
  if (cols < 4 || rows < 4) return null;
  const W = cols * CELL, H = rows * CELL;
  const P = (c: number, r: number): Pt => pt(c * CELL, r * CELL);

  const elements: Element[] = [];
  // The ruling first, so the arrows are drawn on top of it.
  for (let c = 0; c <= cols; c++) {
    elements.push({ kind: 'gridline', from: pt(c * CELL, 0), to: pt(c * CELL, H) });
  }
  for (let r = 0; r <= rows; r++) {
    elements.push({ kind: 'gridline', from: pt(0, r * CELL), to: pt(W, r * CELL) });
  }

  for (const v of spec.vectors) {
    const [a, b] = [P(...v.from), P(...v.to)];
    const along = sub(b, a);
    const span = Math.hypot(along.x, along.y);
    // A vector with no length is not a vector, and its arrowhead has no
    // direction to point in.
    if (span < CELL * 0.9) return null;
    // Every square of it has to be on the paper.
    for (const [c, r] of [v.from, v.to]) {
      if (c < 0 || c > cols || r < 0 || r > rows) return null;
    }
    elements.push({ kind: 'segment', from: a, to: b });
    // The head sits partway along rather than at the tip, which is where both
    // papers put it — the tip of a vector drawn to a lattice point is a corner
    // a pupil is counting squares to, and an arrowhead on it hides the count.
    const at = add(a, scale(along, 0.62));
    elements.push(...head(at, along, Math.min(span * 0.16, 5)));
    if (v.label) {
      // Beside the arrowhead, pushed square off the line so it never lies along
      // it. `away` is a point on the *other* side, which is how every label in
      // this library is aimed.
      const n = unit(pt(-along.y, along.x));
      const seat = add(add(a, scale(along, 0.45)), scale(n, CELL * 0.55));
      elements.push({
        kind: 'label', text: v.label, anchor: seat,
        away: add(seat, scale(n, -CELL * 2)),
      });
    }
  }

  // Nothing is claimed. A claim is a number the question prints that the
  // drawing has to agree with, and this figure prints none: the components are
  // *counted* off the lattice, never written on it. What has to be true — that
  // the displacement in squares is the answer's components — is checked in
  // `n5-vector-answers.ts`, measured off the drawn arrows against the ruling.
  return { scene: { elements }, claims: [] as Claim[] };
}
