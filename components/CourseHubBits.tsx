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
  if (days === null || days < 0) return <>{dateLabel}</>;
  return <>{days} day{days === 1 ? '' : 's'} to go · {dateLabel}</>;
}

export function RememberCourse({ courseId }: { courseId: string }) {
  useEffect(() => {
    try { localStorage.setItem('preferredCourse', courseId); } catch { /* private window */ }
  }, [courseId]);
  return null;
}
