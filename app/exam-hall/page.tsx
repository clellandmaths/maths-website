'use client';

import { useState, useEffect, useMemo } from 'react';
import { GraduationCap, Flame, CheckSquare, Clock, ArrowLeft, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { n5ChecklistCategories, higherChecklistCategories } from '@/lib/checklist-topics';
import type { TopicCategory } from '@/lib/n5-topics';
import WarmUp from '@/components/ExamHall/WarmUp';
import { getCourseTheme } from '@/lib/course-theme';

type Course = 'n5' | 'higher';

const courseInfo: Record<Course, { label: string; examDate: Date; papers: string; categories: TopicCategory[] }> = {
  n5: {
    label: 'National 5',
    examDate: new Date('2026-05-08T09:00:00'),
    papers: '10 Past Papers · 200+ Questions',
    categories: n5ChecklistCategories,
  },
  higher: {
    label: 'Higher',
    examDate: new Date('2026-05-07T09:00:00'),
    papers: '9 Past Papers · 170+ Questions',
    categories: higherChecklistCategories,
  },
};

const lobbyFeatures = [
  'Live Exam Countdown',
  'Topic Checklists',
  'Quick Warm Up Sessions',
];

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

// --- Lobby ---

function ExamHallLobby({ onSelect }: { onSelect: (course: Course) => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-3xl w-full">
        <GraduationCap className="h-16 w-16 mx-auto text-signal-magenta mb-6" />
        <h1 className="font-display text-3xl font-bold mb-3">Welcome to the Exam Hall</h1>
        <p className="text-slate-400 mb-10 text-lg">
          Your distraction-free zone. Sync your exam countdown, track your topic checklist, and run timed warm-ups.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {(Object.entries(courseInfo) as [Course, typeof courseInfo.n5][]).map(([id, info]) => {
            const cardTheme = getCourseTheme(id);
            return (
              <div
                key={id}
                className="group relative flex flex-col p-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cardTheme.gradient}`} />
                <h2 className={`text-2xl font-bold mb-1 ${cardTheme.text}`}>
                  {info.label}
                </h2>
                <p className="text-sm text-slate-500 mb-6">{info.papers}</p>
                <ul className="space-y-3 text-left mb-8">
                  {lobbyFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-300">
                      <Check className={`h-5 w-5 ${cardTheme.text} shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSelect(id)}
                  className={`mt-auto w-full py-3 bg-gradient-to-r ${cardTheme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`}
                >
                  Enter Exam Hall
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
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
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      {/* Title + overall progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">{info.label} Topic Checklist</h2>
        <p className="text-slate-400 text-sm mb-4">
          {totalChecked}/{totalSubtopics} complete · {progressPercent}%
        </p>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
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
            <div key={cat.category} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  )}
                  <span className="text-lg font-semibold">{cat.category}</span>
                </div>
                <span className={`text-sm font-medium ${catChecked === catTotal ? theme.text : 'text-slate-500'}`}>
                  {catChecked}/{catTotal}
                </span>
              </button>

              {/* Topics + subtopics */}
              {!isCollapsed && (
                <div className="px-4 pb-4">
                  {Object.entries(cat.topics).map(([mainTopic, subtopics]) => (
                    <div key={mainTopic} className="mb-4 last:mb-0">
                      <p className="text-sm font-medium text-slate-300 mb-2 ml-8">{mainTopic}</p>
                      <div className="space-y-1">
                        {subtopics.map((sub) => {
                          const isChecked = checked.has(sub);
                          return (
                            <button
                              key={sub}
                              onClick={() => toggleSubtopic(sub)}
                              className="w-full flex items-center gap-3 py-2 px-3 ml-5 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                            >
                              <div
                                className={`flex items-center justify-center h-5 w-5 rounded-full border-2 shrink-0 transition-colors ${
                                  isChecked
                                    ? `${theme.bg} ${theme.border}`
                                    : 'border-slate-600'
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className={`text-sm transition-colors ${isChecked ? 'text-slate-500 line-through' : 'text-slate-400'}`}>
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

function ExamHallContent({ course, onChangeCourse }: { course: Course; onChangeCourse: () => void }) {
  const info = courseInfo[course];
  const theme = getCourseTheme(course);
  const [countdown, setCountdown] = useState(() => getCountdown(info.examDate));
  const [showChecklist, setShowChecklist] = useState(false);
  const [showWarmUp, setShowWarmUp] = useState(false);

  // Live checklist stats for the dashboard card
  const [checkedCount, setCheckedCount] = useState(0);
  const totalSubtopics = useMemo(() => countSubtopics(info.categories), [info.categories]);

  useEffect(() => {
    // Read checklist count for the dashboard card
    const checked = loadChecklist(course);
    setCheckedCount(checked.size);
  }, [course, showChecklist]); // Re-read when returning from checklist view

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(info.examDate));
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, [info.examDate]);

  const progressPercent = totalSubtopics > 0 ? Math.round((checkedCount / totalSubtopics) * 100) : 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onChangeCourse}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className={`text-sm font-medium px-2 py-1 ${theme.tint} ${theme.text} rounded-md`}>
              {info.label}
            </span>
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {info.label} <span className={theme.text}>Exam Hall</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Focused revision mode. Countdown to your exam, warm up with quick questions, and track your progress.
          </p>
        </div>

        {/* Exam Countdown */}
        <div className={`relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8`}>
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <Clock className={`h-6 w-6 ${theme.text}`} />
              <p className="text-slate-300 font-medium">
                {info.examDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}{', '}
                {info.examDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
            {countdown.passed ? (
              <p className="text-xl font-bold text-slate-400">Exam has passed</p>
            ) : (
              <p className={`text-2xl font-bold ${theme.text}`}>
                {countdown.days} days · {countdown.hours} hours to go
              </p>
            )}
          </div>
        </div>

        {/* Conditional: Dashboard cards, Warm Up, or Checklist view */}
        {showWarmUp ? (
          <WarmUp course={course} onBack={() => setShowWarmUp(false)} />
        ) : showChecklist ? (
          <TopicChecklist course={course} onBack={() => setShowChecklist(false)} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Warm Up Card */}
            <div
              onClick={() => setShowWarmUp(true)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-white/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-600/20 rounded-lg">
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-50">Warm Up</h2>
                  <p className="text-slate-400">Daily revision session</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                5 daily questions from across all {info.label} topics. Same questions for everyone — resets at midnight.
              </p>
              <span className={`${theme.text} group-hover:opacity-80 font-medium transition-opacity`}>
                Start Today&apos;s Warm Up →
              </span>
            </div>

            {/* Checklists Card */}
            <div
              onClick={() => setShowChecklist(true)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-white/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-600/20 rounded-lg">
                  <CheckSquare className="h-8 w-8 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-50">Checklists</h2>
                  <p className="text-slate-400">Track your progress</p>
                </div>
              </div>
              <p className="text-slate-400 mb-3">
                {checkedCount}/{totalSubtopics} topics complete
              </p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
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

export default function ExamHallPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('preferredCourse');
    return saved === 'n5' || saved === 'higher' ? saved : null;
  });

  const handleSelectCourse = (course: Course) => {
    localStorage.setItem('preferredCourse', course);
    setSelectedCourse(course);
  };

  const handleChangeCourse = () => {
    setSelectedCourse(null);
  };

  if (!selectedCourse) {
    return <ExamHallLobby onSelect={handleSelectCourse} />;
  }

  return (
    <ExamHallContent
      course={selectedCourse}
      onChangeCourse={handleChangeCourse}
    />
  );
}
