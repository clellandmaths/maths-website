import Link from 'next/link';
import { Compass } from 'lucide-react';
import GeometricMotif from '@/components/GeometricMotif';
import ExamCover, { type CourseCover } from '@/components/Home/ExamCover';
import TryQuestion from '@/components/Home/TryQuestion';
import CountdownTile from '@/components/Home/CountdownTile';

const courses: CourseCover[] = [
  {
    id: 'n5',
    band: 'S4/S5 · National 5',
    name: 'National 5',
    subject: 'Mathematics',
    gradient: 'from-cyan-600 to-blue-600',
    contents: ['Past papers 2014–2025', 'Video solutions', 'Worksheet builder'],
  },
  {
    id: 'higher',
    band: 'S5/S6 · Higher',
    name: 'Higher',
    subject: 'Mathematics',
    gradient: 'from-orange-600 to-red-600',
    contents: ['Past papers 2015–2025', 'Video solutions', 'Worksheet builder'],
  },
  {
    id: 'ah',
    band: 'S6 · Advanced Higher',
    name: 'Advanced Higher',
    subject: 'Mathematics',
    gradient: 'from-emerald-600 to-teal-600',
    contents: ['Course notes', 'Video lessons'],
  },
  {
    id: 'n5-apps',
    band: 'S4/S5 · National 5',
    name: 'N5 Applications',
    subject: 'Applications of Maths',
    gradient: 'from-amber-500 to-orange-500',
    contents: ['Course notes', 'Video lessons'],
  },
  {
    id: 'higher-apps',
    band: 'S5/S6 · Higher',
    name: 'Higher Applications',
    subject: 'Applications of Maths',
    gradient: 'from-violet-600 to-purple-600',
    contents: ['Course notes', 'Video lessons'],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero — editorial, left-aligned */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
        <GeometricMotif className="hidden lg:block absolute top-1/2 right-8 -translate-y-1/2 w-[400px] h-[400px] opacity-30 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
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
            5 courses · 19 years of past papers · 370+ solved questions · 100% free
          </p>
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
