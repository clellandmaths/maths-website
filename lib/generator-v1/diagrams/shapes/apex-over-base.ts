import {
  angleMark, centroid, dist, type Element, type Figure, type Pt, pt, sideLabel,
} from '../scene';

/**
 * Three points in a row along a base, and an apex standing over one of them.
 *
 * This is the shape behind the five-mark composite questions, where the answer
 * needs two triangles rather than one: an angle found in the wide triangle, fed
 * into the narrow one.
 *
 *   2024 P2 Q13  A–D–C with B over D, BD perpendicular, angles at A and C
 *   2022 P2 Q14  B–C–D with A over B, AB perpendicular, angles at C and D
 *
 * Both are the same picture; only which point the apex stands over differs. The
 * caller supplies the positions and *also* the angles it intends, rather than
 * letting this routine measure them — a measured angle would agree with the
 * drawing whatever the caller's trigonometry did, so it would check nothing.
 * Stated here and re-measured by verify.ts, a construction error is caught.
 */

export interface ApexOverBaseSpec {
  /** The three collinear points, named left to right. */
  base: [string, string, string];
  apex: string;
  /** Which base point the apex stands directly above. */
  over: 0 | 1;
  /**
   * Put the apex here instead, at its own place along the base.
   *
   * 2018 P2 Q9 has its fourth point off to the side rather than over anything,
   * and the angle it marks at the base is between the leg and the *extension*
   * of the line past that point — which is the whole question. With this set
   * there is no perpendicular, so no right angle and no vertical claim.
   */
  apexX?: number;
  /** Distances along the base from the leftmost point. Must increase. */
  at: [number, number, number];
  height: number;
  /** Labelled spans of the base, by index pair, with the distance they claim. */
  spans: { from: 0 | 1 | 2; to: 0 | 1 | 2; text: string; value: number }[];
  /** Labelled legs from the apex down to a base point. */
  legs: { to: 0 | 1 | 2; text: string; value: number }[];
  /**
   * Angles at a base point, between the leg up to the apex and the base
   * running toward another base point. `degrees` is what the question asserts.
   */
  angles: { at: 0 | 1 | 2; toward: 0 | 1 | 2; degrees: number; label: string }[];
  /** Which legs are drawn at all. Defaults to all three. */
  draw?: (0 | 1 | 2)[];
  /** A leg drawn dashed, as 2024 draws its perpendicular. */
  dashed?: 0 | 1 | 2;
  /** An angle at the apex itself, between the legs down to two base points. */
  apexAngles?: { toward: [0 | 1 | 2, 0 | 1 | 2]; degrees: number; label: string }[];
  /** The square mark where the apex meets the base. */
  rightAngle?: boolean;
}

export function apexOverBase(spec: ApexOverBaseSpec): Figure | null {
  const [x0, x1, x2] = spec.at;
  if (!(x0 < x1 && x1 < x2) || spec.height <= 0) return null;

  const B: [Pt, Pt, Pt] = [pt(x0, 0), pt(x1, 0), pt(x2, 0)];
  const T = pt(spec.apexX ?? spec.at[spec.over], spec.height);
  const draw = spec.draw ?? [0, 1, 2];
  // the middle of the figure, so every label is pushed outward from it
  const inside = centroid([B[0], B[2], T]);

  const elements: Element[] = [
    { kind: 'segment', from: B[0], to: B[2] },
    ...draw.map((i): Element =>
      ({ kind: 'segment', from: T, to: B[i], dashed: spec.dashed === i })),
    { kind: 'label', text: spec.apex, anchor: T, away: inside },
    // An empty name leaves the point undrawn. 2019 P2 Q19 asks for the height
    // above the base without ever marking the foot: it is where the apex
    // stands, which the geometry needs and the picture does not show.
    ...B.flatMap((p, i): Element[] => spec.base[i] ? [{
      kind: 'label',
      text: spec.base[i],
      // the middle point's name goes below the line, not toward a corner
      anchor: p,
      away: i === 1 ? pt(p.x, p.y + 1) : inside,
    }] : []),
  ];

  // Two rules for the base measurements.
  //
  // An empty text is a span that is claimed but not written on — most of the
  // elevation contexts name the vertical but not the stretch of ground. It
  // still gets its length claim below; what it must not get is an empty label,
  // which draws nothing and then takes part in every collision test.
  //
  // And a span running past the middle point passes right under its name, so
  // "D" and "16 cm" end up side by side reading as one string. That one drops a
  // line further, which is where 2024 puts its dimension too.
  const drop = Math.max(x2 - x0, spec.height) * 0.07;
  for (const s of spec.spans) {
    if (!s.text) continue;
    const covers = spec.base[1] && s.from < 1 && s.to > 1;
    const mx = (B[s.from].x + B[s.to].x) / 2;
    // base labels always sit below the line, whatever the centroid says
    elements.push(sideLabel(B[s.from], B[s.to], s.text,
      pt(mx, covers ? drop : 1)));
    if (covers) {
      // anchoring below the line as well as pushing away from above it
      const last = elements[elements.length - 1];
      if (last.kind === 'label') last.anchor = pt(mx, -drop);
    }
  }
  for (const l of spec.legs) {
    if (l.text) elements.push(sideLabel(T, B[l.to], l.text, inside));
  }
  for (const a of spec.angles) {
    elements.push(...angleMark(B[a.at], [T, B[a.toward]], a.label));
  }
  for (const a of spec.apexAngles ?? []) {
    elements.push(...angleMark(T, [B[a.toward[0]], B[a.toward[1]]], a.label));
  }
  if (spec.rightAngle) {
    const other = spec.over === 0 ? B[1] : B[0];
    elements.push({ kind: 'rightAngle', at: B[spec.over], arms: [T, other] });
  }

  return {
    scene: { elements },
    claims: [
      ...spec.spans.map(s => ({
        kind: 'length' as const, from: B[s.from], to: B[s.to], value: s.value,
        shown: /\d/.test(s.text),
      })),
      ...spec.legs.map(l => ({
        kind: 'length' as const, from: T, to: B[l.to], value: l.value,
        shown: /\d/.test(l.text),
      })),
      ...spec.angles.map(a => ({
        kind: 'angle' as const, at: B[a.at], arms: [T, B[a.toward]] as [Pt, Pt],
        value: a.degrees, shown: /\d/.test(a.label),
      })),
      ...(spec.apexAngles ?? []).map(a => ({
        kind: 'angle' as const, at: T,
        arms: [B[a.toward[0]], B[a.toward[1]]] as [Pt, Pt],
        value: a.degrees, shown: /\d/.test(a.label),
      })),
      // The apex stands over its base point, so that leg is vertical — the one
      // structural fact those figures rest on, and no length or angle claim
      // above would notice if it were drawn leaning. An apex placed beside the
      // base makes no such claim, because it is not making that promise.
      ...(spec.apexX === undefined
        ? [{ kind: 'bearing' as const, from: B[spec.over], to: T, degrees: 90 }]
        : []),
    ],
  };
}

export { dist };
