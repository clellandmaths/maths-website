'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Compass, GraduationCap, Home, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explorer', label: 'Explorer', icon: Compass },
  { href: '/exam-hall', label: 'Exam Hall', icon: GraduationCap },
];

// Course-colour dots match each course's gradient identity
const courses = [
  { id: 'n5', name: 'National 5', dot: 'bg-cyan-500' },
  { id: 'higher', name: 'Higher', dot: 'bg-orange-500' },
  { id: 'ah', name: 'Advanced Higher', dot: 'bg-emerald-500' },
  { id: 'n5-apps', name: 'N5 Applications', dot: 'bg-amber-500' },
  { id: 'higher-apps', name: 'Higher Applications', dot: 'bg-violet-500' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/img/logo/clelland-maths-logo.png"
              alt="Clelland Maths"
              className="h-11 w-auto group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Courses dropdown */}
            <div className="relative">
              <button
                onClick={() => setCoursesOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-signal-magenta hover:bg-slate-800/50 transition-all duration-200"
                aria-expanded={coursesOpen}
              >
                <span>Courses</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${coursesOpen ? 'rotate-180' : ''}`} />
              </button>
              {coursesOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCoursesOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl shadow-black/40 py-2 z-50">
                    {courses.map(course => (
                      <Link
                        key={course.id}
                        href={`/course/${course.id}`}
                        onClick={() => setCoursesOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        <span className={`h-2 w-2 rounded-full ${course.dot} shrink-0`} />
                        {course.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-signal-magenta hover:bg-slate-800/50 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-signal-magenta hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-800/50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-signal-magenta hover:bg-slate-800/50 transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            <p className="px-4 pt-3 pb-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Courses
            </p>
            {courses.map(course => (
              <Link
                key={course.id}
                href={`/course/${course.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-foreground hover:bg-slate-800/50 transition-all duration-200"
              >
                <span className={`h-2 w-2 rounded-full ${course.dot} shrink-0`} />
                <span className="font-medium">{course.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
