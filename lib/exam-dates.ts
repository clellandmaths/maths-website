// Exam diet dates — single source of truth for countdowns.
// UPDATE when Qualifications Scotland publishes the official 2027 timetable;
// until then `estimated: true` keeps the UI honest about it.

export const examDiet = {
  year: 2027,
  // Placeholder: recent diets have started maths papers in late April / early May
  start: new Date('2027-04-30T09:00:00+01:00'),
  estimated: true,
};

// Per-course exam dates — estimates until the official 2027 timetable is
// published. Keep `estimated: true` so the UI labels them honestly.
export const courseExamDates: Record<string, { date: Date; estimated: boolean }> = {
  n5: { date: new Date('2027-04-30T09:00:00+01:00'), estimated: true },
  higher: { date: new Date('2027-05-06T09:00:00+01:00'), estimated: true },
};

export function daysUntilDiet(now: Date = new Date()): number {
  const ms = examDiet.start.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
