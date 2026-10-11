import {
  type Claim, type Element, type Figure, type Pt,
  add, pt, scale, sideLabel,
} from '../scene';

/**
 * Two mathematically similar sectors, side by side, each with its radius on it.
 *
 * Built for 2019 P2 Q12, which — like 2016 P2 Q11 and `similar-rectangles.ts`
 * — prints **none of its lengths in the prose**. It says only that ABC and DEF
 * are sectors, that they are similar, and that the larger has area 2750 cm².
 * The 50 cm and the 30 cm are on the diagram and nowhere else, so without a
 * figure the question cannot be started at all.
 *
 * Both sectors open **upwards from an apex at the bottom**, which is how the
 * paper draws them and is not merely a style: the radius label sits on the
 * lower-right radius, and with the wedge opening downwards that label lands
 * inside the sector. The apex is the lettered vertex (C and F) and the two
 * ends of the arc take the other two letters.
 *
 * **Drawn to scale, and side by side rather than stacked.** Scale, because the
 * whole question is that one is a scaled copy of the other and a pupil is meant
 * to see it. Side by side, because these are wider than they are tall — stacked
 * they would run off a portrait page — which is the opposite of the rectangles,
 * where stacking was what stopped them reading as one object and its thumbnail.
 */

export interface SimilarSectorsSpec {
  /** The two radii, as the figure prints them. Drawn to these. */
  largeRadius: number;
  smallRadius: number;
  /** The angle at each apex, in degrees — the same for both, since similar. */
  angle: number;
  /** Apex first, then the two arc ends: ["C", "A", "B"] and ["F", "D", "E"]. */
  largeNames: [string, string, string];
  smallNames: [string, string, string];
  /** What to write against each radius, e.g. "50 cm" and "30 cm". */
  labels: { large: string; small: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

/**
 * The gap between them, as a fraction of the larger radius.
 *
 * Sized for the *labels*, not the arcs. At 0.55 the two wedges cleared each
 * other comfortably and the drawing still read as cramped, because B sits at
 * the large sector's right arc end pushed rightwards and D at the small one's
 * left arc end pushed leftwards — the two letters travel into the gap from
 * either side and close it.
 */
const GAP = 1.05;

/** One sector with its apex at `at`, opening upwards. */
function wedge(
  at: Pt, r: number, angle: number,
  names: [string, string, string], radiusLabel: string,
): { elements: Element[]; claims: Claim[] } {
  // Centred on straight up, so the wedge is symmetric about the vertical and
  // the two arc ends sit level with each other, as the paper draws them.
  const start = 90 - angle / 2;
  const A = add(at, scale(dir(start + angle), r));   // upper left
  const B = add(at, scale(dir(start), r));           // upper right
  const [nApex, nA, nB] = names;

  // Away from the middle of the wedge, so a letter never lands inside it.
  const inside = add(at, scale(dir(90), r * 0.5));

  const elements: Element[] = [
    { kind: 'segment', from: at, to: A },
    { kind: 'segment', from: at, to: B },
    { kind: 'arc', centre: at, r, from: start, to: start + angle },
    { kind: 'label', text: nApex, anchor: at, away: inside },
    { kind: 'label', text: nA, anchor: A, away: inside },
    { kind: 'label', text: nB, anchor: B, away: inside },
  ];
  // On the right-hand radius, pushed away from the wedge's interior — which is
  // where the paper puts "50 cm" and "30 cm".
  if (radiusLabel) elements.push(sideLabel(at, B, radiusLabel, inside));

  return {
    elements,
    claims: [
      { kind: 'length', from: at, to: B, value: r, shown: /\d/.test(radiusLabel) },
      { kind: 'length', from: at, to: A, value: r, shown: false },
      { kind: 'angle', at, arms: [A, B], value: angle, shown: false },
    ],
  };
}

export function similarSectors(spec: SimilarSectorsSpec): Figure | null {
  const { largeRadius: R, smallRadius: r, angle } = spec;
  // A sector that closes on itself is a circle, and a splinter cannot be read.
  // The angle is claimed, and `verifyFigure` measures angles back in 0..180,
  // so a reflex one would be reported as its explement and rejected.
  if (angle < 20 || angle > 170) return null;
  if (R <= 0 || r <= 0 || r >= R) return null;

  const half = angle / 2 * Math.PI / 180;
  // Apexes sit on one line, far enough apart that the two arcs never meet.
  const spread = (R + r) * Math.sin(half) + R * GAP;
  const large = wedge(pt(0, 0), R, angle, spec.largeNames, spec.labels.large);
  const small = wedge(pt(spread, 0), r, angle, spec.smallNames, spec.labels.small);

  return {
    scene: { elements: [...large.elements, ...small.elements] },
    claims: [...large.claims, ...small.claims],
  };
}
