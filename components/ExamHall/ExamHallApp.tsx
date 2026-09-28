'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Flame, CheckSquare, Clock, ArrowLeft, Check, ChevronDown, ChevronRight, Timer } from 'lucide-react';
import { n5ChecklistCategories, higherChecklistCategories } from '@/lib/checklist-topics';
import { ahTopicCategories } from '@/lib/ah-topics';
import { higherAppsTopicCategories } from '@/lib/higher-apps-topics';
import { n5AppsTopicCategories } from '@/lib/n5-apps-topics';
import type { TopicCategory } from '@/lib/n5-topics';
import WarmUp from '@/components/ExamHall/WarmUp';
import Marathon from '@/components/ExamHall/Marathon';
import { hasSpecial } from '@/lib/specials-loader';
import { getCourseTheme } from '@/lib/course-theme';
import { courseExamDates } from '@/lib/exam-dates';

export type Course = 'n5' | 'higher' | 'ah' | 'n5-apps' | 'higher-apps';

const courseInfo: Record<Course, { label: string; examDate: Date; estimated: boolean; categories: TopicCategory[] }> = {
  n5: {
    label: 'National 5',
    examDate: courseExamDates.n5.date,
    estimated: courseExamDates.n5.estimated,
    categories: n5ChecklistCategories,
  },
  higher: {
    label: 'Higher',
    examDate: courseExamDates.higher.date,
    estimated: courseExamDates.higher.estimated,
    categories: higherChecklistCategories,
  },
  ah: {
    label: 'Advanced Higher',
    examDate: courseExamDates.ah.date,
    estimated: courseExamDates.ah.estimated,
    categories: ahTopicCategories,
  },
  'n5-apps': {
    label: 'N5 Applications',
    examDate: courseExamDates['n5-apps'].date,
    estimated: courseExamDates['n5-apps'].estimated,
    categories: n5AppsTopicCategories,
  },
  'higher-apps': {
    label: 'Higher Applications',
    examDate: courseExamDates['higher-apps'].date,
    estimated: courseExamDates['higher-apps'].estimated,
    categories: higherAppsTopicCategories,
  },
};

// --- Countdown helpers ---

function getCountdown(examDate: Date): { days: number; hours: number; passed: boolean } {
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, passed: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, passed: false };
}

// --- Checklist localStorage helpers ---

function loadChecklist(course: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(`checklist_${course}`);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveChecklist(course: string, checked: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`checklist_${course}`, JSON.stringify([...checked]));
  } catch {
    // localStorage full or unavailable
  }
}

function countSubtopics(categories: TopicCategory[]): number {
  let count = 0;
  for (const cat of categories) {
    for (const subs of Object.values(cat.topics)) {
      count += subs.length;
    }
  }
  return count;
}

function countCategorySubtopics(category: TopicCategory): number {
  let count = 0;
  for (const subs of Object.values(category.topics)) {
    count += subs.length;
  }
  return count;
}

function countCategoryChecked(category: TopicCategory, checked: Set<string>): number {
  let count = 0;
  for (const subs of Object.values(category.topics)) {
    for (const sub of subs) {
      if (checked.has(sub)) count++;
    }
  }
  return count;
}

// --- Topic Checklist ---

function TopicChecklist({ course, onBack }: { course: Course; onBack: () => void }) {
  const info = courseInfo[course];
  const theme = getCourseTheme(course);
  const [checked, setChecked] = useState<Set<string>>(() => loadChecklist(course));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const totalSubtopics = useMemo(() => countSubtopics(info.categories), [info.categories]);
  const totalChecked = checked.size;
  const progressPercent = totalSubtopics > 0 ? Math.round((totalChecked / totalSubtopics) * 100) : 0;

  const toggleSubtopic = (subtopic: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(subtopic)) {
        next.delete(subtopic);
      } else {
        next.add(subtopic);
      }
      saveChecklist(course, next);
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      {/* Title + overall progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">{info.label} Topic Checklist</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {totalChecked}/{totalSubtopics} complete · {progressPercent}%
        </p>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.progress} rounded-full transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {info.categories.map((cat) => {
          const isCollapsed = collapsed.has(cat.category);
          const catTotal = countCategorySubtopics(cat);
          const catChecked = countCategoryChecked(cat, checked);

          return (
            <div key={cat.category} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-muted-dim" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-dim" />
                  )}
                  <span className="text-lg font-semibold">{cat.category}</span>
                </div>
                <span className={`text-sm font-medium ${catChecked === catTotal ? theme.text : 'text-muted-dim'}`}>
                  {catChecked}/{catTotal}
                </span>
              </button>

              {/* Topics + subtopics */}
              {!isCollapsed && (
                <div className="px-4 pb-4">
                  {Object.entries(cat.topics).map(([mainTopic, subtopics]) => (
                    <div key={mainTopic} className="mb-4 last:mb-0">
                      <p className="text-sm font-medium text-foreground-2 mb-2 ml-8">{mainTopic}</p>
                      <div className="space-y-1">
                        {subtopics.map((sub) => {
                          const isChecked = checked.has(sub);
                          return (
                            <button
                              key={sub}
                              onClick={() => toggleSubtopic(sub)}
                              className="w-full flex items-center gap-3 py-2 px-3 ml-5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                              <div
                                className={`flex items-center justify-center h-5 w-5 rounded-full border-2 shrink-0 transition-colors ${
                                  isChecked
                                    ? `${theme.bg} ${theme.border}`
                                    : 'border-muted'
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className={`text-sm transition-colors ${isChecked ? 'text-muted-dim line-through' : 'text-foreground-2'}`}>
                                {sub}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main content ---

function ExamHallContent({ course }: { course: Course }) {
  const info = courseInfo[course];
  const theme = getCourseTheme(course);
  // Null until mounted. The page is built once per course, so a count taken
  // while rendering would be the day of the build, and the browser's first
  // render would disagree with the built HTML.
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showWarmUp, setShowWarmUp] = useState(false);
  const [showMarathon, setShowMarathon] = useState(false);

  // These views swap in place rather than navigating, so nothing resets the
  // scroll — you would arrive in the middle of the Warm Up because that was
  // how far down the dashboard you had scrolled to click it.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [showWarmUp, showChecklist, showMarathon]);

  // Live checklist stats for the dashboard card
  const [checkedCount, setCheckedCount] = useState(0);
  const totalSubtopics = useMemo(() => countSubtopics(info.categories), [info.categories]);

  useEffect(() => {
    // Read checklist count for the dashboard card
    const checked = loadChecklist(course);
    setCheckedCount(checked.size);
  }, [course, showChecklist]); // Re-read when returning from checklist view

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(info.examDate));
    tick();
    const timer = setInterval(tick, 1000 * 60);
    return () => clearInterval(timer);
  }, [info.examDate]);

  const progressPercent = totalSubtopics > 0 ? Math.round((checkedCount / totalSubtopics) * 100) : 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {info.label} <span className={theme.text}>Exam Hall</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Focused revision mode. Countdown to your exam, warm up with quick questions, and track your progress.
          </p>
        </div>

        {/* Exam Countdown */}
        <div className={`relative overflow-hidden bg-card border border-border rounded-xl p-6 mb-8`}>
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <Clock className={`h-6 w-6 ${theme.text}`} />
              <p className="text-foreground-2 font-medium">
                {info.examDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })}{', '}
                {info.examDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/London' })}
                {info.estimated && (
                  <span className="ml-2 font-mono text-xs text-muted-dim">est. — official timetable TBC</span>
                )}
              </p>
            </div>
            {!countdown ? (
              // Holds the line's height until the count arrives, so nothing below moves.
              <p aria-hidden="true" className="text-2xl font-bold invisible">0 days · 0 hours to go</p>
            ) : countdown.passed ? (
              <p className="text-xl font-bold text-muted-foreground">Exam has passed</p>
            ) : (
              <p className={`text-2xl font-bold ${theme.text}`}>
                {countdown.days} days · {countdown.hours} hours to go
              </p>
            )}
            {/* One quiet line, at the moment the date is on a pupil's mind
                (the owner, 2026-09-28, on bringing pupils and parents to the
                Academy). Nothing like it goes on a page a teacher prints,
                projects or shares. */}
            {!countdown?.passed && (
              <Link
                href="/academy"
                className="mt-1 block text-center text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                Want a teacher with you until exam day? <span className="font-semibold text-accent">Weekly live tutoring →</span>
              </Link>
            )}
          </div>
        </div>

        {/* Conditional: Dashboard cards, Warm Up, or Checklist view */}
        {showMarathon ? (
          <Marathon courseId={course} courseLabel={info.label} onBack={() => setShowMarathon(false)} />
        ) : showWarmUp ? (
          <WarmUp course={course} onBack={() => setShowWarmUp(false)} />
        ) : showChecklist ? (
          <TopicChecklist course={course} onBack={() => setShowChecklist(false)} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revision marathon — the whole course in one session. Full width:
                it is the biggest thing in the Exam Hall and reads as a headline
                rather than a third equal option. */}
            {hasSpecial(course) && (
              <div
                onClick={() => setShowMarathon(true)}
                className={`md:col-span-2 bg-gradient-to-r ${theme.gradient} rounded-xl p-6 hover:opacity-95 transition-opacity cursor-pointer group`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-black/25 rounded-lg">
                    <Timer className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{info.label} in one session</h2>
                    <p className="text-white">Every topic, start to finish</p>
                  </div>
                </div>
                <p className="text-white mb-4">
                  The full revision marathon — every topic in {info.label}, worked through with
                  video solutions and a printable booklet.
                </p>
                <span className="text-white font-medium group-hover:opacity-80 transition-opacity">
                  Open the marathon &rarr;
                </span>
              </div>
            )}

            {/* Warm Up Card */}
            <div
              onClick={() => setShowWarmUp(true)}
              className="bg-card border border-border rounded-xl p-6 hover:border-foreground/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-600/20 rounded-lg">
                  <Flame className="h-8 w-8 text-orange-800 dark:text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Warm Up</h2>
                  <p className="text-muted-foreground">Daily revision session</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                5 daily questions from across all {info.label} topics. Same questions for everyone — resets at midnight.
              </p>
              <span className={`${theme.text} group-hover:opacity-80 font-medium transition-opacity`}>
                Start Today&apos;s Warm Up →
              </span>
            </div>

            {/* Checklists Card */}
            <div
              onClick={() => setShowChecklist(true)}
              className="bg-card border border-border rounded-xl p-6 hover:border-foreground/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-600/20 rounded-lg">
                  <CheckSquare className="h-8 w-8 text-cyan-800 dark:text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Checklists</h2>
                  <p className="text-muted-foreground">Track your progress</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                {checkedCount}/{totalSubtopics} topics complete
              </p>
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${theme.progress} rounded-full transition-all duration-300`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={`${theme.text} group-hover:opacity-80 font-medium transition-opacity`}>
                View {info.label} Checklists →
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Page export ---

/**
 * The Exam Hall for one course, at `/course/<id>/exam-hall`. The course comes
 * from the address, so the page is built with it: it used to draw the lobby
 * first and swap the course in once the browser had read `?c=`, and the page
 * jumped. `/exam-hall` is now only the lobby (`app/exam-hall/page.tsx`).
 */
export default function ExamHallApp({ course }: { course: Course }) {
  return <ExamHallContent course={course} />;
}
