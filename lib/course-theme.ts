// Per-course visual identity — mirrors the gradients on the homepage
// exam-cover cards (which mirror the live app's course buttons).
// Literal Tailwind class strings: Tailwind only generates classes it can
// see in source, so these must never be built dynamically.

export interface CourseTheme {
  gradient: string;   // qualification band / primary buttons
  text: string;       // accent text (labels, numbering, active nav)
  bg: string;         // solid accent surfaces
  bgHover: string;
  tint: string;       // translucent accent wash (active nav row)
  border: string;     // accent borders (active bar, hairlines)
  progress: string;   // progress bar fill
}

export const COURSE_THEMES: Record<string, CourseTheme> = {
  n5: {
    gradient: 'from-cyan-600 to-blue-600',
    text: 'text-cyan-400',
    bg: 'bg-cyan-600',
    bgHover: 'hover:bg-cyan-500',
    tint: 'bg-cyan-600/15',
    border: 'border-cyan-500',
    progress: 'bg-cyan-500',
  },
  higher: {
    gradient: 'from-orange-600 to-red-600',
    text: 'text-orange-400',
    bg: 'bg-orange-600',
    bgHover: 'hover:bg-orange-500',
    tint: 'bg-orange-600/15',
    border: 'border-orange-500',
    progress: 'bg-orange-500',
  },
  ah: {
    gradient: 'from-emerald-600 to-teal-600',
    text: 'text-emerald-400',
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-500',
    tint: 'bg-emerald-600/15',
    border: 'border-emerald-500',
    progress: 'bg-emerald-500',
  },
  'n5-apps': {
    gradient: 'from-amber-500 to-orange-500',
    text: 'text-amber-400',
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-500',
    tint: 'bg-amber-500/15',
    border: 'border-amber-500',
    progress: 'bg-amber-500',
  },
  'higher-apps': {
    gradient: 'from-violet-600 to-purple-600',
    text: 'text-violet-400',
    bg: 'bg-violet-600',
    bgHover: 'hover:bg-violet-500',
    tint: 'bg-violet-600/15',
    border: 'border-violet-500',
    progress: 'bg-violet-500',
  },
};

export function getCourseTheme(courseId: string): CourseTheme {
  return COURSE_THEMES[courseId] ?? COURSE_THEMES.higher;
}
