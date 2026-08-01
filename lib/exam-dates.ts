// Exam diet dates — single source of truth for countdowns.
//
// These are the official Qualifications Scotland 2027 slots, not estimates, so
// `estimated: false` turns off the hedging the UI shows while dates are
// guesses.
//
// Times are the start of each paper in BST (+01:00). May is always British
// Summer Time, and a bare Z here would put every countdown an hour out.
//
// Two courses sit on 13 May and two on 21 May at different times, which is why
// each carries a full timestamp rather than a date.

export const examDiet = {
  year: 2027,
  // The first maths paper of the diet: National 5, Thursday 13 May, 9am.
  start: new Date('2027-05-13T09:00:00+01:00'),
  estimated: false,
};

export const courseExamDates: Record<string, { date: Date; estimated: boolean }> = {
  // Thursday 13 May 2027
  n5: { date: new Date('2027-05-13T09:00:00+01:00'), estimated: false },
  ah: { date: new Date('2027-05-13T12:30:00+01:00'), estimated: false },
  // Friday 14 May 2027
  higher: { date: new Date('2027-05-14T09:00:00+01:00'), estimated: false },
  // Friday 21 May 2027
  'n5-apps': { date: new Date('2027-05-21T09:00:00+01:00'), estimated: false },
  'higher-apps': { date: new Date('2027-05-21T13:00:00+01:00'), estimated: false },
};

export function daysUntilDiet(now: Date = new Date()): number {
  const ms = examDiet.start.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
