import { BookOpen, Play, FileText, Clock, Calculator } from 'lucide-react';
import Link from 'next/link';

const courses = [
  {
    id: 'n5',
    name: 'National 5',
    level: 'S4/S5 Level',
    description: 'Complete coverage of the N5 Maths curriculum with video lessons and practice questions.',
    color: 'cyan',
    bgClass: 'bg-cyan-600/20',
    textClass: 'text-cyan-500',
  },
  {
    id: 'higher',
    name: 'Higher',
    level: 'S5/S6 Level',
    description: 'Advanced topics for Higher Maths with detailed video explanations and past papers.',
    color: 'orange',
    bgClass: 'bg-orange-600/20',
    textClass: 'text-orange-500',
  },
  {
    id: 'ah',
    name: 'Advanced Higher',
    level: 'S6 Level',
    description: 'University-level preparation with challenging problems and comprehensive solutions.',
    color: 'purple',
    bgClass: 'bg-purple-600/20',
    textClass: 'text-purple-500',
  },
  {
    id: 'n5-apps',
    name: 'N5 Applications',
    level: 'S4/S5 Level',
    description: 'Real-world maths applications for National 5 with practical problem-solving.',
    color: 'teal',
    bgClass: 'bg-teal-600/20',
    textClass: 'text-teal-500',
    icon: Calculator,
  },
  {
    id: 'higher-apps',
    name: 'Higher Applications',
    level: 'S5/S6 Level',
    description: 'Advanced applications of mathematics with real-world contexts and scenarios.',
    color: 'amber',
    bgClass: 'bg-amber-600/20',
    textClass: 'text-amber-500',
    icon: Calculator,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Master <span className="text-emerald-500">Maths</span> with Confidence
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Free SQA maths revision for Scottish students. Practice questions, video lessons,
            cheat sheets and checklists for National 5, Higher, Advanced Higher and Applications.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/course/n5"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              National 5
            </Link>
            <Link
              href="/course/higher"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Higher
            </Link>
            <Link
              href="/course/ah"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Advanced Higher
            </Link>
            <Link
              href="/course/n5-apps"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Calculator className="h-4 w-4" />
              N5 Apps
            </Link>
            <Link
              href="/course/higher-apps"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Higher Apps
            </Link>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Choose Your <span className="text-emerald-500">Course</span>
          </h2>

          {/* Main Maths Courses */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {courses.slice(0, 3).map((course) => {
              const Icon = course.icon || BookOpen;
              return (
                <Link key={course.id} href={`/course/${course.id}`} className="group">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${course.bgClass} rounded-lg`}>
                        <Icon className={`h-8 w-8 ${course.textClass}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-50">{course.name}</h3>
                        <p className="text-slate-400">{course.level}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-4">
                      {course.description}
                    </p>
                    <span className="text-emerald-500 group-hover:text-emerald-400 font-medium">
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
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${course.bgClass} rounded-lg`}>
                        <Icon className={`h-8 w-8 ${course.textClass}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-50">{course.name}</h3>
                        <p className="text-slate-400">{course.level}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-4">
                      {course.description}
                    </p>
                    <span className="text-emerald-500 group-hover:text-emerald-400 font-medium">
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
              <div className="inline-flex p-3 bg-emerald-600/20 rounded-lg mb-4">
                <Play className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Video Lessons</h3>
              <p className="text-slate-400">Step-by-step video solutions for every question</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-emerald-600/20 rounded-lg mb-4">
                <FileText className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Past Papers</h3>
              <p className="text-slate-400">Full archive of SQA past papers with solutions</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-emerald-600/20 rounded-lg mb-4">
                <Clock className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exam Countdown</h3>
              <p className="text-slate-400">Track your progress as exam day approaches</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
