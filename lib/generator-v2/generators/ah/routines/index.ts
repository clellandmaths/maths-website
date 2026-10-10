/**
 * Where each topic's routines are loaded from, one entry per topic file.
 *
 * Each topic is its own chunk, loaded when a card in it is asked for, so a
 * pupil pressing "Another like this one" on a complex-numbers card never
 * downloads the differential equations. The paths are spelled out rather than
 * built from the name because a bundler can only split what it can see.
 *
 * Each file exports `ROUTINES`: card label to its routine. `ah-registry` fails
 * if a card has no routine, a routine has no card, or this list and
 * `registry/index.ts` name different files.
 */
import type { CardLabel, CardRoutine } from '../types';

export type TopicRoutines = Readonly<Record<CardLabel, CardRoutine<any>>>;

/**
 * A topic whose routines are split across files (by year, when one file would
 * pass 700 lines) loads them together as one. A card in two of them throws:
 * one card, one routine.
 */
async function merged(...parts: Promise<{ ROUTINES: TopicRoutines }>[]): Promise<{ ROUTINES: TopicRoutines }> {
  const out: Record<CardLabel, CardRoutine<any>> = {};
  for (const { ROUTINES } of await Promise.all(parts)) {
    for (const [card, routine] of Object.entries(ROUTINES)) {
      if (out[card]) throw new Error(`AH routines: ${card} is in two files of one topic`);
      out[card] = routine;
    }
  }
  return { ROUTINES: out };
}

/** Topic file name to a loader for its routines. Alphabetical. */
export const ROUTINE_LOADERS: Readonly<Record<string, () => Promise<{ ROUTINES: TopicRoutines }>>> = {
  // One topic in several files, by year, so none passes 700 lines.
  'binomial-theorem': () => merged(import('./binomial-theorem'), import('./binomial-theorem-2016')),
  'complex-numbers': () => merged(import('./complex-numbers'), import('./complex-numbers-2022'), import('./complex-numbers-2021'), import('./complex-numbers-2019'), import('./complex-numbers-2018'), import('./complex-numbers-2017'), import('./complex-numbers-2016')),
  'differential-equations': () => merged(import('./differential-equations'), import('./differential-equations-2023'), import('./differential-equations-2022'), import('./differential-equations-2021'), import('./differential-equations-2019'), import('./differential-equations-2017'), import('./differential-equations-2016')),
  differentiation: () => merged(import('./differentiation'), import('./differentiation-2025'), import('./differentiation-2024'), import('./differentiation-2023'), import('./differentiation-2022'), import('./differentiation-2021'), import('./differentiation-2019'), import('./differentiation-2018'), import('./differentiation-2017'), import('./differentiation-2016')),
  'functions-and-graphs': () => merged(import('./functions-and-graphs'), import('./functions-and-graphs-2017'), import('./functions-and-graphs-2016')),
  integration: () => merged(import('./integration'), import('./integration-2022'), import('./integration-2021'), import('./integration-2019'), import('./integration-2018'), import('./integration-2017'), import('./integration-2016')),
  'maclaurin-series': () => merged(import('./maclaurin-series'), import('./maclaurin-series-2016')),
  matrices: () => merged(import('./matrices'), import('./matrices-2021'), import('./matrices-2019'), import('./matrices-2018'), import('./matrices-2017'), import('./matrices-2016')),
  'methods-of-proof': () => merged(import('./methods-of-proof'), import('./methods-of-proof-2021'), import('./methods-of-proof-2019'), import('./methods-of-proof-2018'), import('./methods-of-proof-2017'), import('./methods-of-proof-2016')),
  'number-theory': () => import('./number-theory'),
  'partial-fractions': () => merged(import('./partial-fractions'), import('./partial-fractions-2016')),
  'sequences-and-series': () => merged(import('./sequences-and-series'), import('./sequences-and-series-2021'), import('./sequences-and-series-2019'), import('./sequences-and-series-2018'), import('./sequences-and-series-2017'), import('./sequences-and-series-2016')),
  'systems-of-equations': () => merged(import('./systems-of-equations'), import('./systems-of-equations-2016')),
  vectors: () => merged(import('./vectors'), import('./vectors-2019'), import('./vectors-2018'), import('./vectors-2017'), import('./vectors-2016')),
};
