'use client';

import { useEffect, useState } from 'react';

/**
 * The two parts of the course hub that must run in the browser.
 *
 * `DaysToGo`: the hub is built once, so a count worked out at build time
 * would show the day of the build to everyone after it. It renders the exam
 * date first, and the count once mounted.
 *
 * `RememberCourse`: the Topic Explorer and the Exam Hall open on the course
 * last used (`preferredCourse`), as the paper archive has always set it.
 */
export function DaysToGo({ iso, dateLabel }: { iso: string; dateLabel: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
  }, [iso]);
  // Until the count is known, its room is held by an invisible stand-in the
  // width of a three-figure count. Without it the chip grew when the count
  // arrived, wrapped onto a second line on a phone and pushed the course's
  // cards down 36px: a layout shift of 0.108, measured 2026-09-28.
  if (days === null) return <><span aria-hidden="true" className="invisible">000 days to go · </span>{dateLabel}</>;
  if (days < 0) return <>{dateLabel}</>;
  return <>{days} day{days === 1 ? '' : 's'} to go · {dateLabel}</>;
}

export function RememberCourse({ courseId }: { courseId: string }) {
  useEffect(() => {
    try { localStorage.setItem('preferredCourse', courseId); } catch { /* private window */ }
  }, [courseId]);
  return null;
}
