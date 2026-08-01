import Link from 'next/link';
import { Compass } from 'lucide-react';
import LogoAnimation from '@/components/LogoAnimation';
import ExamCover, { type CourseCover } from '@/components/Home/ExamCover';
import TryQuestion from '@/components/Home/TryQuestion';
import CountdownTile from '@/components/Home/CountdownTile';
import {
  n5PaperVideos, higherPaperVideos, ahPaperVideos, n5AppsPaperVideos, higherAppsPaperVideos,
  paperYearRange, siteTotals, type PaperVideo,
} from '@/lib/past-paper-videos';
import { hasSpecial } from '@/lib/specials-loader';

const totals = siteTotals();

/**
 * What each course actually offers, in the same order on every card.
 *
 * These lines were written by hand and had drifted apart: National 5 and Higher
 * advertised "Video solutions / Worksheet builder" while the other three said
 * "Course notes / Video lessons", so the same product read as two different
 * things depending on the course, and three of them appeared to have no past
 * papers at all. Every course has notes, practice, a paper archive, the
 * worksheet builder and a revision marathon; only the last two rows differ, and
 * only where the difference is real.
 */
function courseFeatures(id: string, registry: PaperVideo[]): string[] {
  const rows = [
    `Past papers ${paperYearRange(registry)}`,
    // Advanced Higher's 2016-2021 papers predate the video walkthroughs and
    // carry the full marking instructions instead — 98 of its 215 questions.
    id === 'ah' ? 'Video solutions & markschemes' : 'Video solutions',
    'Course notes & worked examples',
    'Guided practice by topic',
    'Worksheet builder',
  ];
  if (hasSpecial(id)) rows.push('Whole-course revision marathon');
  // Higher Applications sits its exam with the data booklet and a set of
  // spreadsheet/RStudio files rather than a formulae sheet.
  if (id === 'higher-apps') rows.push('Data booklets & data files');
  return rows;
}

const courses: CourseCover[] = [
  {
    id: 'n5',
    band: 'S4/S5 · National 5',
    name: 'National 5',
    subject: 'Mathematics',
    gradient: 'from-cyan-600 to-blue-600',
    contents: courseFeatures('n5', n5PaperVideos),
  },
  {
    id: 'higher',
    band: 'S5/S6 · Higher',
    name: 'Higher',
    subject: 'Mathematics',
    gradient: 'from-orange-600 to-red-600',
    contents: courseFeatures('higher', higherPaperVideos),
  },
  {
    id: 'ah',
    band: 'S6 · Advanced Higher',
    name: 'Advanced Higher',
    subject: 'Mathematics',
    gradient: 'from-emerald-600 to-teal-600',
    contents: courseFeatures('ah', ahPaperVideos),
  },
  {
    id: 'n5-apps',
    band: 'S4/S5 · National 5',
    name: 'N5 Applications',
    subject: 'Applications of Maths',
    gradient: 'from-amber-500 to-orange-500',
    contents: courseFeatures('n5-apps', n5AppsPaperVideos),
  },
  {
    id: 'higher-apps',
    band: 'S5/S6 · Higher',
    name: 'Higher Applications',
    subject: 'Applications of Maths',
    gradient: 'from-violet-600 to-purple-600',
    contents: courseFeatures('higher-apps', higherAppsPaperVideos),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero — editorial, left-aligned, animated logo on the right */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-20 lg:pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_420px] gap-12 items-center">
          <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-mint/80 mb-4">
            Scottish curriculum · N5 to Advanced Higher
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-3xl mb-6">
            Pass your{' '}
            <span className="relative inline-block">
              maths
              <span className="absolute left-0 -bottom-1 w-full h-1.5 bg-signal-magenta rounded-full" />
            </span>{' '}
            exam.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
            Past papers, video solutions, course notes and worksheets for every
            Scottish maths course — built by a teacher, free for every student.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-lg transition-colors"
            >
              Choose your course
            </a>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-white/25 text-foreground font-semibold rounded-lg transition-colors"
            >
              <Compass className="h-4 w-4" />
              Topic Explorer
            </Link>
          </div>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground">
              {totals.courses} courses · {totals.years} years of past papers · {totals.questions} solved questions · 100% free
            </p>
          </div>

          <LogoAnimation className="hidden lg:block w-full" />
        </div>
      </section>

      {/* Course chooser — exam-paper covers */}
      <section id="courses" className="px-4 sm:px-6 lg:px-8 py-14 bg-card/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">
            Choose your course
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {courses.map((course) => (
              <ExamCover key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* What's inside — live question + countdown */}
      <section className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TryQuestion />
            </div>
            <CountdownTile />
          </div>
        </div>
      </section>
    </div>
  );
}
