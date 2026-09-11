import {
  type Claim, type Element, type Figure, type Pt,
  add, centroid, dist, mid, pt, scale, sub, unit,
} from '../scene';

/**
 * A plane figure with two of its edges named as vectors.
 *
 * The five pathway questions are all the same picture with different corners: a
 * shape, two edges carrying an arrow and a bold letter, and a third edge the
 * question asks about but does not draw. What varies is the shape and which
 * two edges are named.
 *
 *   2016 P2 Q3    a parallelogram, and a diagonal
 *   2017 P2 Q8    a triangle with one side extended, and a midpoint
 *   2018 P2 Q10   five points, two of the edges given as multiples of others
 *   2024 P2 Q14   a rhombus with a diagonal drawn, and a midpoint
 *   2025 P2 Q15   a triangle whose base runs on to a fourth point
 *
 * **A target is drawn when the shape's own lines already include it.** This
 * file used to claim the opposite - that the edge being asked for is never
 * drawn, because a line joining the two corners answers the question - and the
 * papers say otherwise. 2016 P2 Q3 asks for BD and draws BD with a bare
 * arrowhead; 2018 draws BC, 2025 draws GF, 2017 draws PR. Nothing is given
 * away: the pupil still has to find the route, and the arrow only fixes which
 * way round the answer runs.
 *
 * What stays undrawn is a target that cuts clean across the figure and is no
 * part of it - 2017's TV, 2024's WM.
 *
 * Nothing here is claimed. Every measurement on the page is a letter, and a
 * figure whose sides are letters asserts no lengths; the shape is drawn true so
 * a parallelogram looks like one, but nothing checks it against a number
 * because there is no number to check it against.
 */

export interface VectorFigureSpec {
  /** Every named corner, in drawing coordinates. */
  points: Record<string, Pt>;
  /** The edges of the figure, as pairs of names. */
  edges: [string, string][];
  /** Edges that are constructions rather than sides — an extension, a diagonal. */
  dashed?: [string, string][];
  /** The two given vectors: an arrowhead along the edge and a bold letter beside it. */
  /**
   * An arrow with no `label` is the **target**: 2016 P2 Q3 asks for BD and
   * draws BD as a bare arrowhead, saying which way round the answer runs
   * without naming it.
   */
  arrows: { from: string; to: string; label?: string }[];
  /** Equal-length marks, for "TP = PQ" and the like. */
  ticks?: { edge: [string, string]; count: number }[];
  /** Corners to leave unlabelled — a midpoint the prose names but the figure need not. */
  hide?: string[];
}

/** Two barbs at a point, pointing along a direction. Decoration, never measured. */
function head(at: Pt, along: Pt, size: number): Element[] {
  const u = unit(along);
  const barb = (turn: number): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -size)), decoration: true };
  };
  return [barb(0.42), barb(-0.42)];
}

/**
 * A point that sends a label **across** an edge rather than along it.
 *
 * Pushing a side label away from the centre of the figure is the rule
 * everywhere else here, and it is wrong for a slanted edge: the direction from
 * the centre to a midpoint can lie almost along the edge, so the label slides
 * down the line instead of clearing it. Every one of the ten vector labels did
 * exactly that. The direction that always clears an edge is the perpendicular;
 * the centre only decides which of the two sides to use.
 */
function acrossEdge(a: Pt, b: Pt, middle: Pt): Pt {
  const m = mid(a, b);
  const n = unit(pt(-(b.y - a.y), b.x - a.x));
  const inward = n.x * (middle.x - m.x) + n.y * (middle.y - m.y) > 0 ? n : scale(n, -1);
  return add(m, inward);
}

export function vectorFigure(spec: VectorFigureSpec): Figure {
  const P = (name: string): Pt => spec.points[name];
  const all = Object.values(spec.points);
  const middle = centroid(all);
  const span = Math.max(...all.map(p => Math.hypot(p.x - middle.x, p.y - middle.y)));

  const elements: Element[] = [];
  for (const [a, b] of spec.edges) elements.push({ kind: 'segment', from: P(a), to: P(b) });
  for (const [a, b] of spec.dashed ?? []) {
    elements.push({ kind: 'segment', from: P(a), to: P(b), dashed: true });
  }
  for (const t of spec.ticks ?? []) {
    elements.push({ kind: 'ticks', from: P(t.edge[0]), to: P(t.edge[1]), count: t.count });
  }

  /**
   * One direction is not enough for a crowded pathway.
   *
   * The rule above gives each point exactly one way to go, and for a corner of
   * an open shape that is right. It has nowhere to go for **a midpoint the
   * question names**: `V` on `BD` lies *on* the line, so across-the-line is the
   * only sensible push, and when the far side holds other ink the whole layout
   * is rejected.
   *
   * That rejection is silent - `assemble` returns null, the caller draws again,
   * and a different question comes out - so it read as "this variation has only
   * three questions" rather than "three of its six cannot be drawn".
   * `vectors.pathway-extended` was **one question in sixteen spellings**; given
   * two real parameters it should be six, and three reached the page.
   *
   * So a label offers its preferred direction and then a ring of fallbacks, and
   * `place()` takes the first that lands clear. **A preference order, not a
   * licence**: the first candidate is exactly what was used before, so a figure
   * that already placed is untouched. Scoped to this shape rather than added to
   * `place()` for every figure, which is the lesson `LABEL_PLANS` in
   * `n5-sketch-parabola.ts` records - a change to the shared layer fixed one
   * figure and regressed another to zero layouts.
   */
  const RING = 8;
  const ringAround = (p: Pt, first: Pt): Pt[] => {
    const r = Math.max(12, dist(p, first) || 12);
    const primary = unit(sub(p, first));
    // The opposite of the preferred direction leads, because for a point that
    // sits on a line it is the other side of that line - usually the one free.
    const out: Pt[] = [add(p, scale(primary, r))];
    for (let i = 1; i < RING; i++) {
      const t = (2 * Math.PI * i) / RING;
      const dir = pt(
        primary.x * Math.cos(t) - primary.y * Math.sin(t),
        primary.x * Math.sin(t) + primary.y * Math.cos(t),
      );
      out.push(sub(p, scale(dir, r)));
    }
    return out;
  };

  for (const arrow of spec.arrows) {
    const [a, b] = [P(arrow.from), P(arrow.to)];
    /**
     * **Mid-edge, because that is where every paper puts it.**
     *
     * Taken from the question images rather than worked out: 2017 P2 Q8, 2018
     * P2 Q10, 2024 P2 Q14 and 2025 P2 Q15 all set the arrowhead at the middle
     * of its edge. It used to sit two thirds along, which left the letter and
     * the head at opposite ends of the same line.
     */
    const along = (f: number) => add(a, scale(sub(b, a), f));
    const HEAD_AT = 0.5;
    const at = along(HEAD_AT);
    elements.push(...head(at, sub(b, a), span * 0.09));
    /**
     * The letter sits **beside its own arrowhead**, which is what names it.
     *
     * In all four papers the letter is level with the head or a little behind
     * it, pushed off the line - 2024's `b` sits directly under its head, 2018's
     * `u` just before it. Ours sat a third along, at the far end of the edge
     * from the head, so on a figure with two arrows a reader had to work out
     * which letter belonged to which.
     *
     * The ring of fallbacks stays, so a crowded corner can still move it, but
     * the first choice - and almost always the one taken - is beside the arrow.
     */
    // Anchored **exactly at the head**, which also makes the barbs its own ink.
    // `verify` exempts a label from ink meeting its anchor - the rule that lets a
    // vertex letter sit against the lines of its vertex - and an arrow's letter
    // has the same claim on its own arrow. Anchored a little behind the head it
    // came out 4.3px from a barb and the figure was rejected, for sitting beside
    // the very thing it names.
    const anchor = at;
    if (!arrow.label) continue;          // a bare head: the target, unnamed
    const arrowAway = add(anchor, sub(acrossEdge(a, b, middle), mid(a, b)));
    elements.push({
      kind: 'label', text: arrow.label, anchor,
      away: arrowAway, alternatives: ringAround(anchor, arrowAway),
    });
  }

  // A corner is labelled away from the middle, which is right for a corner. A
  // point sitting *on* an edge — a midpoint the question names — is not a
  // corner, and away from the middle can run straight along the line it sits
  // on; it gets pushed across that line instead.
  const drawn: [Pt, Pt][] = [...spec.edges, ...(spec.dashed ?? [])].map(([a, b]) => [P(a), P(b)]);
  const onEdge = (p: Pt): [Pt, Pt] | null => {
    for (const [a, b] of drawn) {
      if (dist(p, a) < 1e-6 || dist(p, b) < 1e-6) continue;
      if (Math.abs(dist(a, p) + dist(p, b) - dist(a, b)) < 1e-6) return [a, b];
    }
    return null;
  };

  const hidden = new Set(spec.hide ?? []);
  for (const [name, p] of Object.entries(spec.points)) {
    if (hidden.has(name)) continue;
    const edge = onEdge(p);
    /**
     * A point on an edge gets a dot; a corner does not need one.
     *
     * At a corner two lines meet and the junction *is* the point - the letter
     * beside it has something to name. A midpoint has no junction, so it was a
     * letter floating against a plain line with nothing to say where on that
     * line it fell. The papers mark such a point, and a pupil asked for the
     * pathway to it has to know where it is.
     */
    if (edge) elements.push({ kind: 'dot', at: p, small: true });
    const away = edge ? add(p, sub(acrossEdge(edge[0], edge[1], middle), mid(edge[0], edge[1]))) : middle;
    elements.push({ kind: 'label', text: name, anchor: p, away, alternatives: ringAround(p, away) });
  }

  const claims: Claim[] = [];
  return { scene: { elements }, claims };
}
