import { Play, FileText, Clock, Calculator, BookOpen } from 'lucide-react';
import Link from 'next/link';
import GeometricMotif from '@/components/GeometricMotif';

const courses = [
  {
    id: 'n5',
    name: 'National 5',
    level: 'S4/S5 Level',
    description: 'Complete coverage of the N5 Maths curriculum with video lessons and practice questions.',
    gradient: 'from-cyan-600 to-blue-600',
    iconBg: 'bg-gradient-to-br from-cyan-600/30 to-blue-600/30',
    iconText: 'text-cyan-400',
  },
  {
    id: 'higher',
    name: 'Higher',
    level: 'S5/S6 Level',
    description: 'Advanced topics for Higher Maths with detailed video explanations and past papers.',
    gradient: 'from-orange-600 to-red-600',
    iconBg: 'bg-gradient-to-br from-orange-600/30 to-red-600/30',
    iconText: 'text-orange-400',
  },
  {
    id: 'ah',
    name: 'Advanced Higher',
    level: 'S6 Level',
    description: 'University-level preparation with challenging problems and comprehensive solutions.',
    gradient: 'from-emerald-600 to-teal-600',
    iconBg: 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30',
    iconText: 'text-emerald-400',
  },
  {
    id: 'n5-apps',
    name: 'N5 Applications',
    level: 'S4/S5 Level',
    description: 'Real-world maths applications for National 5 with practical problem-solving.',
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-gradient-to-br from-amber-500/30 to-orange-500/30',
    iconText: 'text-amber-400',
    icon: Calculator,
  },
  {
    id: 'higher-apps',
    name: 'Higher Applications',
    level: 'S5/S6 Level',
    description: 'Advanced applications of mathematics with real-world contexts and scenarios.',
    gradient: 'from-violet-600 to-purple-600',
    iconBg: 'bg-gradient-to-br from-violet-600/30 to-purple-600/30',
    iconText: 'text-violet-400',
    icon: Calculator,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <GeometricMotif className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 w-[420px] h-[420px] opacity-40 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Master Maths with
            <span className="relative inline-block ml-3">
              Confidence
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-signal-magenta rounded-full" />
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Free maths revision for Scottish students. Practice questions, video lessons,
            cheat sheets and checklists for National 5, Higher, Advanced Higher and Applications.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {courses.map((course) => {
              const Icon = course.icon || BookOpen;
              return (
                <Link
                  key={course.id}
                  href={`/course/${course.id}`}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r ${course.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`}
                >
                  <Icon className="h-4 w-4" />
                  {course.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12">
            Choose Your Course
          </h2>

          {/* Main Maths Courses */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {courses.slice(0, 3).map((course) => {
              const Icon = course.icon || BookOpen;
              return (
                <Link key={course.id} href={`/course/${course.id}`} className="group">
                  <div className="graph-paper relative bg-card border border-border rounded-xl p-6 hover:border-white/20 transition-all duration-300 h-full overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${course.gradient}`} />
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${course.iconBg} rounded-lg`}>
                        <Icon className={`h-8 w-8 ${course.iconText}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">{course.name}</h3>
                        <p className="text-muted-foreground text-sm">{course.level}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {course.description}
                    </p>
                    <span className="text-foreground/80 group-hover:text-foreground font-medium">
                      Start Learning →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Applications Courses */}
          <div className="grid md:grid-cols-2 gap-6">
            {courses.slice(3).map((course) => {
              const Icon = course.icon || BookOpen;
              return (
                <Link key={course.id} href={`/course/${course.id}`} className="group">
                  <div className="graph-paper relative bg-card border border-border rounded-xl p-6 hover:border-white/20 transition-all duration-300 h-full overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${course.gradient}`} />
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${course.iconBg} rounded-lg`}>
                        <Icon className={`h-8 w-8 ${course.iconText}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">{course.name}</h3>
                        <p className="text-muted-foreground text-sm">{course.level}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {course.description}
                    </p>
                    <span className="text-foreground/80 group-hover:text-foreground font-medium">
                      Start Learning →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-3 bg-accent/20 rounded-lg mb-4">
                <Play className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Video Lessons</h3>
              <p className="text-muted-foreground">Step-by-step video solutions for every question</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-accent/20 rounded-lg mb-4">
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Past Papers</h3>
              <p className="text-muted-foreground">Full archive of past papers with solutions</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-accent/20 rounded-lg mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Exam Countdown</h3>
              <p className="text-muted-foreground">Track your progress as exam day approaches</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
