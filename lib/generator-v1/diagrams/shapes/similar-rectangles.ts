import {
  type Claim, type Element, type Figure, type Pt,
  add, dist, mid, pt, scale, sub, unit,
} from '../scene';

/**
 * Two similar rectangles, each with its width measured underneath.
 *
 * Built for 2016 P2 Q11, which is the one similarity question in the papers
 * whose numbers are **not in the prose**. It says only that two pictures are
 * mathematically similar, that the cost is proportional to area, and what the
 * large one costs; the 100 cm and the 60 cm are printed on the diagram and
 * nowhere else. Without a figure there is no question — which is why the other
 * four similarity clones need nothing drawn and this one does.
 *
 * The paper stacks them, larger above smaller, each over a double-headed
 * dimension arrow. The stacking is worth keeping: set side by side, two
 * rectangles of the same shape at different sizes read as one object and its
 * thumbnail, and the pupil has to see them as two comparable things.
 *
 * **Both widths are claimed**, unlike `algebra-shapes.ts` where every side is
 * an expression and nothing is claimed at all. These are numbers the question
 * prints, so the drawing has to agree with them, and it is drawn to scale
 * because the whole question is that one is a scaled copy of the other.
 */

export interface SimilarRectanglesSpec {
  /** The two widths, as the question prints them. The figure is drawn to them. */
  largeWidth: number;
  smallWidth: number;
  /** Height as a fraction of width — the same for both, since they are similar. */
  aspect: number;
  /** What to write under each, e.g. "100 cm" and "60 cm". */
  labels: { large: string; small: string };
}

/** How far the dimension arrow hangs below the shape it measures. */
const DROP = 0.14;
/** The gap between the two rectangles, as a fraction of the larger's height. */
const GAP = 0.55;

/** A double-headed arrow from a to b, with its measurement written below it. */
function dimension(a: Pt, b: Pt, text: string): Element[] {
  const u = unit(sub(b, a));
  const size = Math.min(dist(a, b) * 0.12, 6);
  // Barbs are decoration strokes, so the minimum-length rule does not apply to
  // them. An arrowhead grown until it could carry a measurement would only be
  // a wrong arrowhead.
  const barbs = (at: Pt, along: Pt): Element[] =>
    [0.42, -0.42].map(turn => {
      const [c, s] = [Math.cos(turn), Math.sin(turn)];
      const dir = pt(along.x * c - along.y * s, along.x * s + along.y * c);
      return { kind: 'segment', from: at, to: add(at, scale(dir, -size)), decoration: true };
    });

  return [
    { kind: 'segment', from: a, to: b },
    ...barbs(b, u),
    ...barbs(a, scale(u, -1)),
    // Written below the line rather than on it. The label is pushed away from a
    // point directly *above* its anchor, so the push is square to the arrow —
    // the same fault that kept the chord figure off the page for a whole batch.
    { kind: 'label', text, anchor: mid(a, b), away: add(mid(a, b), pt(0, dist(a, b) * 0.4)) },
  ];
}

export function similarRectangles(spec: SimilarRectanglesSpec): Figure {
  const w = spec.largeWidth, sw = spec.smallWidth;
  const h = w * spec.aspect, sh = sw * spec.aspect;
  const drop = h * DROP;

  // The smaller sits below the larger, both centred on the same vertical, in
  // the paper's order. Its own arrow hangs the same distance below it.
  const smallTop = -(h * GAP);
  const large = [pt(0, 0), pt(w, 0), pt(w, h), pt(0, h)];
  const small = [
    pt((w - sw) / 2, smallTop - sh), pt((w + sw) / 2, smallTop - sh),
    pt((w + sw) / 2, smallTop), pt((w - sw) / 2, smallTop),
  ];
  const largeArrow: [Pt, Pt] = [pt(0, -drop), pt(w, -drop)];
  const smallArrow: [Pt, Pt] = [
    pt((w - sw) / 2, smallTop - sh - drop), pt((w + sw) / 2, smallTop - sh - drop),
  ];

  const elements: Element[] = [
    { kind: 'polygon', points: large },
    { kind: 'polygon', points: small },
    ...dimension(largeArrow[0], largeArrow[1], spec.labels.large),
    ...dimension(smallArrow[0], smallArrow[1], spec.labels.small),
  ];

  const claims: Claim[] = [
    { kind: 'length', from: largeArrow[0], to: largeArrow[1], value: w, shown: true },
    { kind: 'length', from: smallArrow[0], to: smallArrow[1], value: sw, shown: true },
    // Right angles, so these are rectangles rather than merely quadrilaterals
    // of the right width.
    { kind: 'angle', at: large[0], arms: [large[1], large[3]], value: 90, shown: false },
    { kind: 'angle', at: small[0], arms: [small[1], small[3]], value: 90, shown: false },
  ];

  return { scene: { elements }, claims };
}
