/**
 * Practice topics, in the website's subtopic vocabulary.
 *
 * There are more topic vocabularies on this site than anyone would choose:
 *
 *   57  website subtopics        `lib/n5-topics.ts` — what questions are tagged
 *                                with, and what the generator files against
 *   34  practice topics          `src/practice/data/national5Maths.ts` — named
 *                                for teaching order, not for filing
 *   174 generator skills         the thing you actually ask for
 *
 * The generator can be asked for questions by **subtopic**, so a practice page
 * that wants to offer more questions needs to say which subtopics its topic
 * covers. About half the names match by luck (`Surds`, `Volume`, `Bearings`)
 * and half do not (`Change of Subject`, `Gradient`, `Line of Best Fit`,
 * `Data Sets`), and the mismatches are not guessable — so they are written
 * down, once, here.
 *
 * **This file declares a mapping and nothing else.** Whether a topic can
 * actually produce questions is a fact about the registry, not a judgement, so
 * it is computed rather than listed: `scripts/check-topic-maps.mjs` reads the
 * variations and reports which mapped subtopics have no exam-tier variation
 * behind them. An earlier draft of the plan carried a hand-written "nothing
 * generatable here" list naming Rounding *and Line of Best Fit* — and Line of
 * Best Fit has two exam variations with seven paper citations between them. A
 * hand-written exclusion is exactly how that kind of error survives.
 *
 * An empty array is a deliberate statement that nothing fits, which the check
 * reports; a **missing** key is a build failure, so a new practice topic cannot
 * quietly ship with a dead control.
 */

/**
 * National 5 only. The other four courses have no audited variations, so their
 * practice pages offer nothing and must show nothing.
 */
export const PRACTICE_TO_SUBTOPICS: Record<string, string[]> = {
  // ── Numeracy ────────────────────────────────────────────────────────────
  'fractions': ['Fractions and mixed numbers'],
  'percentages': ['Appreciation and Depreciation', 'Reversing a percentage change'],
  'scientific-notation': ['Scientific notation'],
  'surds': ['Simplifying surds', 'Rationalising the denominator'],
  'indices': [
    'Laws of indices',
    'Rewriting fraction or negative index in the form ax^n',
    'Evaluating a fractional or negative index numerically',
  ],
  // The exam does not set rounding on its own — it expects it inside other
  // questions — so the three rounding variations are warm-up tier and carry no
  // subtopic at all. Nothing to offer here, and saying so is the point.
  'rounding': [],

  // ── Algebra ─────────────────────────────────────────────────────────────
  'expanding-brackets': ['Expanding brackets'],
  'factorising': ['Factorising'],
  'algebraic-fractions': [
    'Simplifying algebraic fraction',
    'Add or subtract Algebraic Fractions',
    'Multiply or divide Algebraic Fractions',
  ],
  'functions': ['Function notation'],
  'straight-line': ['Straight Line Equation', 'Coordinate Geometry with straight line equation'],
  // The website files equations and inequations together; practice teaches them
  // as two topics. Both point at the one subtopic rather than inventing a split
  // the tagged questions do not have.
  'linear-equations': ['Linear equations and inequations'],
  'linear-inequalities': ['Linear equations and inequations'],
  'simultaneous-equations': ['Simultaneous equations'],
  'change-of-subject': ['Changing the subject of a formula'],
  'completing-the-square': ['Completing the square'],
  'quadratics': [
    'Quadratic equation by factorising',
    'Quadratic formula',
    'Discriminant',
    'Turning Points and Axis of Symmetry',
    'Parabola Equation from Graph',
    'Sketch a parabola from equation',
  ],
  // Gradient is taught on its own and filed under the straight line, where the
  // gradient variations actually live.
  'gradient': ['Straight Line Equation', 'Coordinate Geometry with straight line equation'],

  // ── Geometry ────────────────────────────────────────────────────────────
  'arcs-and-sectors': ['Sector area', 'Arc length'],
  'volume': ['Volume - simple shape', 'Volume - composite shape'],
  'pythagoras': ['Pythagoras in 3d', 'Pythagoras in circle diagrams', 'Pythagoras converse'],
  'angles-in-shapes': ['Angles in regular polygons', 'Angles in diagrams involving circles'],
  'similarity': ['Similar lengths', 'Similar areas/volumes'],
  'vectors': ['Adding and Subtracting vector components', 'Vector pathways', 'Magnitude'],
  '3d-coordinates': ['3d Coordinates'],

  // ── Trigonometry ────────────────────────────────────────────────────────
  'triangle-area': ['Area of a Triangle'],
  'sine-rule': ['Sine rule: calculate angle', 'Sine rule: calculate length'],
  'cosine-rule': ['Cosine rule: calculate angle', 'Cosine rule: calculate length'],
  'bearings': ['Bearings in Trigonometry questions'],
  'trig-graphs': ['Identify equation of trigonometric graph', 'sin/cos/tan of related angles'],
  'trig-equations': ['Trigonometric equation'],
  'trig-identities': ['Trigonometric identities'],

  // ── Statistics ──────────────────────────────────────────────────────────
  'data-sets': [
    'Median/Quartiles/Interquartile Range',
    'Standard Deviation',
    'Comparing Calculated Statistics',
  ],
  // Both, because the two variations behind it file differently: one under
  // Scatter Graph, one under the straight line it asks you to find.
  'line-of-best-fit': ['Scatter Graph', 'Straight Line Equation'],
};

/**
 * Which subtopics a practice topic can generate from, or an empty array.
 *
 * Returns nothing for every course but National 5 — not because the topics are
 * unmapped, but because nothing else has audited variations to draw from.
 */
export function subtopicsForPractice(courseId: string, slug: string): string[] {
  if (courseId !== 'n5') return [];
  return PRACTICE_TO_SUBTOPICS[slug] ?? [];
}
