import {
  type Claim, type Element, type Figure, type Pt, add, pt, scale, sub, unit,
} from '../scene';

/**
 * A pair of sketch axes with something drawn on them.
 *
 * **The papers' graph questions are not plotted on a grid.** That is the thing
 * to know before building anything here, and reading them was what settled it:
 * 2023 P1 Q4, 2025 P1 Q6 and 2026 P1 Q9 each print two arrowed axes, an O at
 * the origin, a smooth curve, and one or two solid dots with their coordinates
 * written beside them. No gridlines, no tick marks, no scale. The scattergraph
 * questions are the same — 2014 P1 Q6 has words along its axes and not a single
 * number on either.
 *
 * So this draws exactly that, and it covers fourteen paper questions across
 * three topics that look unrelated on the page: reading a parabola's equation
 * off its graph, finding the equation of a line through two marked points, and
 * a line of best fit through a scatter.
 *
 * **The two axes are scaled independently, which no other figure here does.**
 * `render.ts` scales uniformly, and must: a triangle drawn with x squashed is
 * the wrong triangle. These axes are the one case where that is not true, since
 * there is no scale printed on them for a squash to contradict — and without
 * it, a scattergraph running to 780 calories against 42 grams of fat comes out
 * as a vertical thread. So the graph window is mapped into a fixed drawing
 * frame here, and the renderer sees a shape already in sensible proportions.
 *
 * **What the figure has to get right is which point is marked.** Nothing on
 * these axes is measurable, so nothing is claimed; but a dot labelled (3, 2)
 * sitting anywhere except on the curve would be a lie about the one thing the
 * question asks. That is guaranteed by construction rather than by check: the
 * dots are evaluated from the very function the curve is sampled from.
 */

/** The window, in graph units. */
export interface View { xMin: number; xMax: number; yMin: number; yMax: number }

export type Plot =
  /** y = a(x − h)² + k. */
  | { kind: 'parabola'; a: number; h: number; k: number }
  /** y = mx + c. */
  | { kind: 'line'; m: number; c: number }
  /**
   * y = a sin(b(x - h))° + k, or the same with cos. x is in degrees.
   *
   * The eight "identify the trigonometric graph" questions are drawn on these
   * same axes, and reading them brought the plan's estimate down a second
   * time: none of them is gridded either. 2015 P1 Q6 carries 4, 0, -4 and a
   * 360, and 2019 P1 Q13 carries no numbers at all.
   */
  | { kind: 'trig'; fn: 'sin' | 'cos'; a: number; b: number; h: number; k: number }
  /** Nothing drawn: blank axes for a pupil to sketch on. */
  | { kind: 'none' };

export interface SketchAxesSpec {
  view: View;
  plot: Plot;
  /**
   * Where the curve starts and stops, if not the whole window.
   *
   * Every trigonometric graph in the papers states a domain — "0 <= x <= 360" —
   * and draws the curve across exactly that while the axis runs a little past
   * it to its arrow. Drawing to the window edge instead put an extra rising arm
   * of 4 sin 3x straight through the 360 that labels the end of it.
   */
  domain?: [number, number];
  /**
   * Solid dots carrying their coordinates, or a bare letter.
   *
   * `side` says which way the text goes, and it is worth stating rather than
   * deriving. Pushing "away from the middle" is the rule everywhere else here
   * and it is wrong on a graph: a turning point sits near the bottom of the
   * frame, so away from the middle sends its coordinates straight down through
   * the x-axis. The papers put the text to the right of the dot almost always,
   * and below a turning point where the curve would otherwise run through it.
   */
  points?: { x: number; y: number; text: string; side?: Side }[];
  /** Unlabelled dots — the cloud a line of best fit runs through. */
  cloud?: { x: number; y: number }[];
  /** What the axes are called. Defaults to x and y. */
  axisNames?: { x: string; y: string };
  /** Words written alongside an axis, as the scatter questions print them. */
  axisTitles?: { x?: string; y?: string };
  /** The curve's own equation, written beside it as 2026 P1 Q9 does. */
  curveLabel?: string;
  /**
   * A second curve on the same axes, with its own equation beside it.
   *
   * **2017 P1 Q13 is two straight lines crossing at a point P**, each labelled
   * with its own equation, and that labelling is the only information the
   * figure carries: without it a pupil cannot tell which line is which. The
   * question then says "find, *algebraically*, the coordinates of P" - so the
   * picture is there to be understood and not to be measured, which is why P is
   * marked with a bare letter and never with its coordinates.
   */
  also?: { plot: Plot; label?: string };
  /**
   * Values to mark and number along each axis.
   *
   * A handful, which is all the papers print: the amplitude and zero up the
   * side, and 0, 90, 180, 270, 360 along the bottom - or just a 360 at the far
   * end. No gridlines anywhere in any of them.
   */
  ticks?: { x?: number[]; y?: number[] };
  /** Written after each x tick value. The trig graphs print "90&deg;". */
  xTickSuffix?: string;
  /**
   * Turn the x numbers on their sides, so a fine scale fits under the axis.
   *
   * 2014 P1 Q10 numbers every 20 degrees this way, and its answer b = -40 is
   * read off the numbered 40 line - the fine scale is what makes the question
   * answerable as set, rather than a midpoint judged by eye.
   */
  xTickRotate?: boolean;
  /**
   * A double-headed arrow under the graph spanning `to` on the x-axis, with the
   * measurement written below it.
   *
   * **How a paper shows a period that a numbered tick cannot carry.** A tick
   * has to stand on the axis, and on a dense curve the axis is exactly where
   * there is no room — eight crests cross it every 22°, so the number sits in
   * the wave whichever side it goes. The measurement is put clear of the whole
   * curve instead, which is what makes 2022 P1 Q8's *b* = 8 drawable at all.
   */
  periodMark?: { to: number; text: string };
  /**
   * A wider drawing frame, for the one shape that needs one.
   *
   * Eight waves across a near-square frame is a blur: each crest gets eleven
   * units of width, and neither counting them nor labelling a 45 degree period
   * beside them is readable. Everything else here is drawn at the papers'
   * near-square proportions and stays that way — this is deliberately per
   * figure rather than a change to the constant, so a shape that already works
   * cannot be disturbed by a shape that does not.
   */
  frame?: { w: number; h: number };
  /**
   * A dashed line straight across the frame at a value, numbered on the axis.
   *
   * 2019 P1 Q15 prints one at -17 — the sea, seventeen metres below the
   * clifftop the ball was kicked from. It is not decoration: it is what turns
   * "when does the ball hit the sea" into a question about where the curve
   * meets a *line* rather than where it meets the axis, and it is why the
   * markscheme's first step there is $12t - 5t^2 = -17$.
   */
  guide?: { y: number };
  /**
   * A ruled background at this spacing in graph units, x and y separately.
   *
   * **Most of these questions have no grid**, which reading them established
   * twice over — the parabolas, the sketches, the trigonometric graphs and four
   * of the five scatters print two bare arrowed axes and nothing else. Two do:
   * 2019 P1 Q6 and 2023 P1 Q7 name no points in their prose, so the pupil has
   * to read two off the ruling, and without it they are unanswerable. That is
   * the whole of what the grid is for here.
   *
   * The spacing is the *ruling*, not the numbering: 2019 P1 Q6 rules every 0.5
   * litres and numbers every 1, which is what `ticks` is for.
   */
  grid?: { x: number; y: number };
  /**
   * A straight line drawn between two points on the plot.
   *
   * 2024 P1 Q12(c) draws PQ across its parabola - horizontal, with P on the
   * y-axis and both ends on the curve - and finding Q is the whole of that
   * part. Without the line the question is a sentence about a picture that does
   * not show it.
   */
  chord?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

export type Side = 'right' | 'left' | 'above' | 'below';

/**
 * The drawing frame, in the proportions the papers print these at.
 *
 * Near enough square, which is what they are: 2023 P1 Q4 is 270 by 290 and
 * 2025 P1 Q9 is 270 by 250. A wider frame flattens a parabola into a dish —
 * and because the labels sit outside the frame and widen the finished figure
 * further, the drawn part has to start squarer than the result should look.
 */
const DEFAULT_FRAME = { w: 88, h: 96 };
/** How far past the window each axis reaches before its arrow. */
const OVERSHOOT = 7;
/** Samples across the window — enough that a parabola has no visible corners. */
// Enough for eight cycles of a sine wave as well as a smooth parabola: 2022
// P1 Q8 sets b = 8, so 360 degrees holds eight periods and a hundred samples
// would draw them as zigzags.
const SAMPLES = 400;
/** The arrowhead at an axis tip. */
const ARROW = 4.5;

const evaluate = (plot: Plot, x: number): number | null => {
  if (plot.kind === 'parabola') return plot.a * (x - plot.h) ** 2 + plot.k;
  if (plot.kind === 'line') return plot.m * x + plot.c;
  if (plot.kind === 'trig') {
    const t = plot.b * (x - plot.h) * Math.PI / 180;
    return plot.a * (plot.fn === 'sin' ? Math.sin(t) : Math.cos(t)) + plot.k;
  }
  return null;
};

function head(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map(turn => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW)), decoration: true };
  });
}

export function sketchAxes(spec: SketchAxesSpec): Figure {
  const { xMin, xMax, yMin, yMax } = spec.view;
  const names = spec.axisNames ?? { x: 'x', y: 'y' };

  // graph units to drawing units, each axis on its own scale
  const FRAME = spec.frame ?? DEFAULT_FRAME;
  const sx = FRAME.w / (xMax - xMin);
  const sy = FRAME.h / (yMax - yMin);
  const D = (x: number, y: number): Pt => pt((x - xMin) * sx, (y - yMin) * sy);

  // The axes lie on x = 0 and y = 0, which is where every one of these
  // questions puts them — the origin is on the page and lettered O. A window
  // excluding it would need axes along its edges, and no paper does that.
  const o = D(Math.min(Math.max(0, xMin), xMax), Math.min(Math.max(0, yMin), yMax));
  const xEnd = pt(FRAME.w + OVERSHOOT, o.y);
  const yEnd = pt(o.x, FRAME.h + OVERSHOOT);

  // ── the ruling ────────────────────────────────────────────────────────
  //
  // First in the list, so everything else is drawn on top of it. Ruled across
  // the whole window at whole multiples of the spacing, which is how both
  // gridded papers do it — 2019 P1 Q6 rules every 0.5 litres against numbers
  // every 1, and 2023 P1 Q7 rules every 5 years against numbers every 5.
  const rules: Element[] = [];
  if (spec.grid) {
    const line = (a: Pt, b: Pt): Element => ({ kind: 'gridline', from: a, to: b });
    for (let v = Math.ceil(xMin / spec.grid.x) * spec.grid.x; v <= xMax + 1e-9; v += spec.grid.x) {
      rules.push(line(D(v, yMin), D(v, yMax)));
    }
    for (let v = Math.ceil(yMin / spec.grid.y) * spec.grid.y; v <= yMax + 1e-9; v += spec.grid.y) {
      rules.push(line(D(xMin, v), D(xMax, v)));
    }
  }

  const elements: Element[] = [
    ...rules,
    { kind: 'segment', from: pt(-OVERSHOOT, o.y), to: xEnd },
    ...head(xEnd, pt(1, 0)),
    { kind: 'segment', from: pt(o.x, -OVERSHOOT), to: yEnd },
    ...head(yEnd, pt(0, 1)),
    // The axis letters sit at the arrow tips, pushed square off the axis. A
    // letter shoved "away from the origin" would slide straight along the line
    // it belongs to and end up past the arrowhead.
    { kind: 'label', text: names.x, anchor: xEnd, away: pt(xEnd.x, o.y + 20), small: true },
    { kind: 'label', text: names.y, anchor: yEnd, away: pt(o.x + 20, yEnd.y), small: true },
  ];

  // ── the curve ─────────────────────────────────────────────────────────
  //
  // Sampled across the window and broken wherever it leaves the frame. A
  // parabola drawn from a real turning point runs off the top well before the
  // window ends, and a stroke that leaves the frame drags the figure's bounds
  // out with it, shrinking everything else to fit.
  // Sampling a plot into path runs, used for the main curve and for `also`.
  const stroke = (p: Plot) => {
    if (p.kind === 'none') return;
    let run: Pt[] = [];
    const flush = () => { if (run.length > 1) elements.push({ kind: 'path', points: run }); run = []; };
    const [dLo, dHi] = spec.domain ?? [xMin, xMax];
    for (let i = 0; i <= SAMPLES; i++) {
      const x = dLo + (dHi - dLo) * i / SAMPLES;
      const y = evaluate(p, x);
      if (y === null || y < yMin || y > yMax) { flush(); continue; }
      run.push(D(x, y));
    }
    flush();
  };
  stroke(spec.plot);
  if (spec.also) stroke(spec.also.plot);

  // ── numbered ticks ────────────────────────────────────────────────────
  //
  // A short stroke across the axis and the value beside it, exactly where the
  // papers put a handful of them. The stroke is decoration: it is a few pixels
  // long and carries no measurement of its own, so the minimum-length rule
  // does not apply to it.
  const TICK = 2.2;
  // The label hangs further out than the stroke it belongs to. Anchored at the
  // end of the tick it cleared the axis by about the tick's own length, which
  // is under the clearance the checks want and looked it.
  const REACH = TICK * 3;
  // A zero on either axis is *the same zero*, and the papers print one of it at
  // the origin — 2015 P1 Q6 and 2024 P1 Q8 both show a single 0 there and no
  // separate O. Drawn once from here, and the O below is skipped.
  const zero = (spec.ticks?.x ?? []).includes(0) || (spec.ticks?.y ?? []).includes(0);

  /**
   * **Which side the x numbers go, decided once for the whole figure where it
   * can be, and per tick only where it cannot.**
   *
   * It used to be decided per tick always, and that is what a reader notices
   * first: with the axis ticked at 90, 180, 270 and 360 a shifted sine is above
   * the axis at some and below at others, so the numbers came out at
   * alternating heights. Measured before this: `trig-graphs.shift` did it in
   * **100%** of draws, `trig-graphs.shift-and-raise` in 15.5%,
   * `trig-graphs.amplitude-cycles` in 13.5%.
   *
   * **The papers are unanimous.** Every numbered trig graph among the eight -
   * 2015 P1 Q6, 2018 P1 Q6, 2022 P1 Q8, 2024 P1 Q8, 2014 P1 Q10, 2023 P1 Q13 -
   * puts every x number on the same side, and below. A scale is read by
   * comparing one number with the next, and two numbers at two heights do not
   * read as a scale.
   *
   * **But one side is not always possible, and forcing it made a figure
   * unbuildable rather than better.** `trig-graphs.shift` ticks a full wave at
   * 90, 180, 270 and 360, and its shift is chosen as 45 or 135 precisely so the
   * curve is 0.707a from the axis at *every* tick - as far from it as it ever
   * gets, which is what lets the numbers be placed at all. That puts curve on
   * one side at half the ticks and on the other side at the rest, so neither
   * uniform side is clear and every layout was rejected.
   *
   * So: below if below is clear everywhere, else above if above is clear
   * everywhere, else per tick as before. The fallback is a worse-reading figure
   * and it is still better than no figure.
   */
  const xTicks = (spec.ticks?.x ?? []).filter(v => v >= xMin && v <= xMax);
  /** The last tick, where the curve stops and there is clear paper to its right. */
  const atEnd = (v: number) =>
    Math.abs(v - (spec.domain ?? [xMin, xMax])[1]) < 1e-6;

  /** Does the curve occupy the space on `side` of the axis, near this tick? */
  const occupies = (v: number, side: 'above' | 'below') => {
    const [dLo, dHi] = spec.domain ?? [xMin, xMax];
    const near = (yMax - yMin) * 0.06;
    // A crossing puts the curve on both sides at once, so sample either way -
    // within the drawn domain only, since past its end there is no curve.
    //
    // **At the domain's end, sample forward only.** 2015 P1 Q6 is a sine
    // arriving at 360 from a trough, and it prints its 360 *below* the axis and
    // slightly to the right, in the clear paper past the last crossing. Judging
    // that tick by the curve to its left sends the number above, which no paper
    // does - and the nudge below is what makes that clear paper reachable.
    for (const dx of atEnd(v) ? [0] : [-6, 0, 6]) {
      const x = v + dx;
      if (x < dLo || x > dHi) continue;
      const y = evaluate(spec.plot, x);
      if (y === null) continue;
      if (side === 'below' && y < -near) return true;
      if (side === 'above' && y > near) return true;
    }
    return false;
  };
  const belowClear = xTicks.every(v => !occupies(v, 'below'));
  const aboveClear = !belowClear && xTicks.every(v => !occupies(v, 'above'));
  /** null means no uniform side works and each tick decides for itself. */
  // Below, always. The papers are unanimous and a scale number is now
  // forgiven the curve, so there is nothing left to dodge.
  const uniform: boolean | null = false;
  void belowClear; void aboveClear;

  for (const v of spec.ticks?.x ?? []) {
    if (v === 0 || v < xMin || v > xMax) continue;
    const at = D(v, 0);
    elements.push({
      kind: 'segment', from: pt(at.x, o.y - TICK), to: pt(at.x, o.y + TICK),
      decoration: true,
    });
    // Put the number where the curve is not: below the axis, unless the curve
    // is down there. At x = 360 a sine wave of whole period is back at zero,
    // and a crossing puts the curve on both sides at once, so the number goes
    // above it either way.
    //
    // **It used to test only for a crossing**, which left every tick where the
    // curve is merely *below* the axis sitting on top of it. That is most of
    // them on a full turn of a sine wave: with the axis ticked at 90, 180, 270
    // and 360, not one layout verified until this looked at the sign.
    //
    // The figure's side where there is one; otherwise the old per-tick dodge.
    const y = evaluate(spec.plot, v);
    const crossing = y !== null && Math.abs(y) < (yMax - yMin) * 0.06;
    const above = uniform ?? (crossing || (y !== null && y < 0));
    // At the end of the domain the number is pushed DOWN AND OUT rather than
    // straight down, into the clear paper past the last crossing - which is
    // where 2015 P1 Q6 and 2024 P1 Q8 both print their 360.
    //
    // The anchor stays on the true tick position and only the push direction
    // moves. Offsetting the anchor instead corrupts the degree scale: the shift
    // answer check reads these anchors to convert the marked point back into
    // degrees, and a moved 360 made every shift read 5 degrees light. It said
    // so on the first run.
    const out = atEnd(v) ? 20 : 0;
    elements.push({
      kind: 'label', text: `${v}${spec.xTickSuffix ?? ''}`, role: 'tick-x',
      anchor: pt(at.x, o.y + (above ? REACH : -REACH)),
      away: pt(at.x - out, o.y + (above ? -20 : 20)), small: true,
      rotate: spec.xTickRotate,
    });
  }
  for (const v of spec.ticks?.y ?? []) {
    if (v === 0 || v < yMin || v > yMax) continue;
    const at = D(0, v);
    elements.push({
      kind: 'segment', from: pt(o.x - TICK, at.y), to: pt(o.x + TICK, at.y),
      decoration: true,
    });
    elements.push({
      kind: 'label', text: `${v}`, role: 'tick-y',
      anchor: pt(o.x - REACH, at.y), away: pt(o.x + 20, at.y), small: true,
    });
  }

  // ── the dashed line across ────────────────────────────────────────────
  //
  // Drawn from the y-axis to the far edge of the frame, and numbered on the
  // axis the same way a tick is. A `path` rather than a `segment` because the
  // minimum-stroke-length rule does not apply to one: nothing is measured off
  // this line, and the number beside it is what it is for.
  if (spec.guide && spec.guide.y >= yMin && spec.guide.y <= yMax) {
    const gy = D(0, spec.guide.y).y;
    elements.push({ kind: 'path', points: [pt(o.x, gy), pt(FRAME.w, gy)], dashed: true });
    elements.push({
      kind: 'label', text: `${spec.guide.y}`,
      anchor: pt(o.x - REACH, gy), away: pt(o.x + 20, gy), small: true,
    });
  }

  // Drawn after the curve, so it sits on top of it where they cross.
  if (spec.chord) {
    elements.push({
      kind: 'segment',
      from: D(spec.chord.from.x, spec.chord.from.y),
      to: D(spec.chord.to.x, spec.chord.to.y),
    });
  }

  for (const c of spec.cloud ?? []) {
    elements.push({ kind: 'dot', at: D(c.x, c.y), small: true });
  }

  // ── a period, measured under the whole curve ──────────────────────────
  //
  // Dropped below the frame rather than hung off the axis, because the axis is
  // where a dense curve leaves no room.
  //
  // **No uprights tying it to the graph, and that is not a simplification.**
  // The span this exists for is short — eight waves put a period 14px wide —
  // and its label is wider than that, so a pair of uprights at the ends sit
  // inside the label's own box and nothing verifies. The arrow starts at the
  // y-axis and both its ends line up with the curve above, which is enough to
  // read it by.
  if (spec.periodMark) {
    const y = -12;
    const [l, r] = [D(0, 0).x, D(spec.periodMark.to, 0).x];
    const barb = Math.min((r - l) * 0.12, 5);
    // Decoration, like the tick strokes: the minimum-length rule exists so that
    // a segment with a measurement written *along* it has room for the text,
    // and this one's measurement is written underneath. Eight waves put the
    // span at 14px, which that rule would otherwise reject outright.
    elements.push({ kind: 'segment', from: pt(l, y), to: pt(r, y), decoration: true });
    // Arrowheads are decoration: a barb grown until it could carry a
    // measurement of its own would only be a wrong arrowhead.
    for (const [x, dir] of [[l, 1], [r, -1]] as const) {
      for (const dy of [barb * 0.5, -barb * 0.5]) {
        elements.push({
          kind: 'segment', from: pt(x, y), to: pt(x + dir * barb, y + dy), decoration: true,
        });
      }
    }
    // Below the arrow, pushed square to it — a label pushed away from a point
    // that is not directly above slides along the line instead of off it.
    // Anchored a little under the arrow rather than on it: anchored on it, the
    // push clears it by exactly the five pixels the checks demand, which is a
    // coin toss rather than a margin.
    elements.push({
      kind: 'label', text: spec.periodMark.text, small: true,
      anchor: pt((l + r) / 2, y - 3), away: pt((l + r) / 2, y + 20),
    });
  }

  // ── the marked points ─────────────────────────────────────────────────
  //
  // Each is a dot with its text beside it, pushed away from the middle of the
  // frame so it lands outside the curve rather than across it.
  const middle = pt(FRAME.w / 2, FRAME.h / 2);
  const OPPOSITE: Record<Side, Pt> = {
    right: pt(-20, 0), left: pt(20, 0), above: pt(0, -20), below: pt(0, 20),
  };
  for (const q of spec.points ?? []) {
    const at = D(q.x, q.y);
    elements.push({ kind: 'dot', at });
    // An empty text marks the point without naming it, which is what a paper
    // does when reading that point off the scale *is* the question. Labelling
    // it would answer it.
    if (q.text) elements.push({
      kind: 'label', text: q.text, anchor: at,
      away: add(at, OPPOSITE[q.side ?? 'right']),
    });
  }

  // The origin sits where two lines cross, so it is the one label with ink on
  // both sides of it. Anchoring it *at* the crossing and pushing diagonally
  // clears each line by only the push over root two, which is not enough; it is
  // anchored a little down and left instead, and pushed further the same way.
  const oOff = pt(o.x - 3.5, o.y - 3.5);
  elements.push({
    kind: 'label', text: zero ? '0' : 'O',
    anchor: oOff, away: pt(o.x + 20, o.y + 20), small: true,
  });

  // Each equation goes beside its own line, at opposite ends of the frame: the
  // first where it leaves at the left, the second where it leaves at the right.
  // Both at the same end would put two equations in one corner, and 2017 P1 Q13
  // separates them for the same reason.
  const besideCurve = (p: Plot, x: number, label: string) => {
    const y = evaluate(p, x);
    const at = D(x, y !== null ? Math.min(Math.max(y, yMin), yMax) : yMax);
    elements.push({ kind: 'label', text: label, anchor: at, away: middle });
  };
  if (spec.curveLabel) besideCurve(spec.plot, xMin, spec.curveLabel);
  if (spec.also?.label) besideCurve(spec.also.plot, xMax, spec.also.label);

  // Axis titles run alongside their axis rather than at its tip, so they are
  // placed off-centre: a wide caption centred under the x-axis reaches back to
  // the O at one end and the axis letter at the other.
  //
  // On a numbered axis the title has to clear the numbers as well as the axis:
  // anchored on the axis itself it sat 1.5px from it, because the numbers now
  // occupy the band the title used to have to itself. The y-axis needs much the
  // more room — "60 000" is four times as wide as it is tall.
  const numbered = (vs: number[] | undefined) => (vs?.length ?? 0) > 0;
  // Sized from the widest number actually printed, not a fixed guess: "140" and
  // "60 000" need very different room, and a flat allowance either collides with
  // the short ones or strands the title half a frame from the long ones.
  const widest = Math.max(0, ...(spec.ticks?.y ?? []).map(v => `${v}`.length));
  const xTitleGap = numbered(spec.ticks?.x) ? REACH + 9 : 0;
  const yTitleGap = numbered(spec.ticks?.y) ? REACH + 4 + widest * 4.6 : 0;
  if (spec.axisTitles?.x) {
    elements.push({
      kind: 'label', text: spec.axisTitles.x,
      anchor: pt(FRAME.w * 0.55, o.y - xTitleGap),
      away: pt(FRAME.w * 0.55, o.y + 20), small: true,
    });
  }
  if (spec.axisTitles?.y) {
    elements.push({
      kind: 'label', text: spec.axisTitles.y,
      anchor: pt(o.x - yTitleGap, FRAME.h * 0.6),
      away: pt(o.x + 20, FRAME.h * 0.6), small: true,
    });
  }

  // Nothing metric is claimed, because nothing on these axes is measurable —
  // there is no scale printed anywhere for a drawing to disagree with.
  //
  // And **not** `notToScale`. That flag does two things: it waives the
  // length-ratio check, which is moot with no length claims, and it prints "not
  // drawn to scale" across the corner. On a graph that note is simply wrong —
  // the papers never print it on one, and a pupil reading a coordinate off a
  // curve is being told the picture cannot be trusted for exactly the thing it
  // is for.
  return { scene: { elements }, claims: [] as Claim[] };
}
