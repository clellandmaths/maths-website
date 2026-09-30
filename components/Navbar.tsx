'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TUTORING_PREFETCH } from '@/lib/academy';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, GraduationCap, ChevronDown, Sparkles, Mail } from 'lucide-react';


const navLinks = [
  // One name everywhere, and the name says what it is for (the owner,
  // 2026-09-28): it was "Topic Explorer", which said nothing about building a
  // worksheet or generating questions. The address stays /explorer, so no link
  // moves. It was once three names for one tool, which is why
  // docs/navigation.md lists it as a thing nobody builds a model of.
  { href: '/explorer', label: 'Worksheet Builder', icon: Compass },
  { href: '/exam-hall', label: 'Exam Hall', icon: GraduationCap },
  // Carries the accent colour: it is the one paid thing on the site, and four
  // identically-styled items would bury it among the free ones. "Tutoring",
  // not "Academy": it is the word parents search for and the Academy is
  // tutoring and more (the owner, 2026-09-28). The address stays /academy.
  { href: '/academy', label: 'Tutoring', icon: Sparkles, highlight: true },
  { href: '/connect', label: 'Connect', icon: Mail },
];

// Course-colour dots match each course's gradient identity
const courses = [
  { id: 'n5', name: 'National 5', dot: 'bg-cyan-500' },
  { id: 'higher', name: 'Higher', dot: 'bg-orange-500' },
  { id: 'ah', name: 'Advanced Higher', dot: 'bg-emerald-500' },
  { id: 'n5-apps', name: 'N5 Applications', dot: 'bg-amber-500' },
  { id: 'higher-apps', name: 'Higher Applications', dot: 'bg-violet-500' },
];

/**
 * Which section a path belongs to, so the nav can mark where you are. It never
 * did (docs/navigation.md). No Home link: the logo is Home, and the space went
 * to saying where you are (2026-09-28).
 */
const isIn = (path: string, href: string) =>
  path === href || path.startsWith(href + '/') || toolOf(path) === href;

/**
 * The Explorer and the Exam Hall live inside a course (`/course/n5/explorer`)
 * but have their own item here, which is the one marked there, not Courses.
 */
const toolOf = (path: string) => path.match(/^\/course\/[^/]+(\/(?:explorer|exam-hall))\/?$/)?.[1];

export default function Navbar() {
  const pathname = usePathname() ?? '/';
  const inCourse = pathname.startsWith('/course/') && !toolOf(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    /* `on-dark` keeps the bar dark in both themes — see the palette block in
       globals.css. The bar is built entirely from tokens, so re-declaring them
       on this element is all it takes; nothing inside here needed changing. */
    <nav className="glass on-dark fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* Intrinsic size given so the browser reserves the box before the
                file arrives. Without it the whole page jumped as the logo
                loaded — on every one of 519 pages. Not lazy: it is the first
                thing painted. */}
            <img
              src="/img/logo/clelland-maths-logo.png"
              alt="Clelland Maths"
              width={836}
              height={536}
              className="h-11 w-auto group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Courses dropdown */}
            <div className="relative">
              <button
                onClick={() => setCoursesOpen(o => !o)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:text-accent hover:bg-muted/50 transition-all duration-200 ${
                  inCourse ? 'text-foreground bg-muted/50' : 'text-foreground-2'
                }`}
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
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-2 hover:text-foreground hover:bg-foreground/5 transition-colors"
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
              const here = isIn(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.href === '/academy' ? TUTORING_PREFETCH : undefined}
                  aria-current={here ? 'page' : undefined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted/50 transition-all duration-200 ${
                    link.highlight
                      ? 'text-accent font-semibold hover:brightness-110'
                      : here ? 'text-foreground' : 'text-foreground-2 hover:text-accent'
                  } ${here ? 'bg-muted/50' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Tutoring in the phone's own bar, not only behind the menu: it
              was the one paid thing on the site and a phone never saw it
              without opening the menu (the owner, 2026-09-28). */}
          <Link
            href="/academy" prefetch={TUTORING_PREFETCH}
            aria-current={isIn(pathname, '/academy') ? 'page' : undefined}
            className="md:hidden ml-auto mr-1 inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg text-sm font-semibold text-accent hover:bg-muted/50 transition-colors"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Tutoring
          </Link>

          {/* **Light or dark, with no React state at all.**

              Which icon shows is a fact about the theme, and the theme already
              lives on `<html data-theme>` — so CSS reads it directly and both
              icons ship in the markup with one hidden. State here would only
              mirror something the document already knows, and mirroring it is
              what made the old component need an effect to avoid a hydration
              mismatch.

              Storage before the attribute: the pre-paint script in
              `app/layout.tsx` watches `data-theme` and restores whatever
              storage says, so the other order makes the guard undo the press.

              Beside the menu button rather than inside it — a reader who needs
              the other theme needs it on arrival, not three taps in. */}
          <button
            type="button"
            onClick={() => {
              /* An unstamped reader is on whatever their system says, so read
                 that rather than the absent attribute — otherwise the first
                 press on a dark-OS machine "sets" dark and looks broken. */
              const el = document.documentElement;
              const now = el.getAttribute('data-theme')
                ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              const next = now === 'dark' ? 'light' : 'dark';
              try { localStorage.setItem('theme', next); } catch { /* private window */ }
              el.setAttribute('data-theme', next);
            }}
            aria-label="Switch between light and dark mode"
            className="p-2 rounded-lg text-foreground-2 hover:text-accent hover:bg-muted/50 transition-colors"
          >
            <span className="theme-icon" aria-hidden="true" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-foreground-2 hover:text-accent hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border/50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {/* Tutoring first, saying what it is in one line, so the word is
                not all a parent has to go on. */}
            <Link
              href="/academy" prefetch={TUTORING_PREFETCH}
              onClick={() => setIsOpen(false)}
              aria-current={isIn(pathname, '/academy') ? 'page' : undefined}
              className="flex items-start gap-3 px-4 py-3 rounded-lg border border-accent/30 hover:bg-muted/50 transition-colors"
            >
              <Sparkles className="h-5 w-5 mt-0.5 text-accent shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-accent">Tutoring</span>
                <span className="block text-sm text-foreground-2">Weekly live tutoring with a Scottish maths teacher</span>
              </span>
            </Link>
            {/* Courses next: choosing one is the first thing most visitors
                do, and they used to sit below every tool. */}
            <p className="px-4 pt-1 pb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Courses
            </p>
            {courses.map(course => {
              const here = isIn(pathname, `/course/${course.id}`);
              return (
                <Link
                  key={course.id}
                  href={`/course/${course.id}`}
                  onClick={() => setIsOpen(false)}
                  aria-current={here ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:text-foreground hover:bg-muted/50 transition-all duration-200 ${
                    here ? 'text-foreground bg-muted/50' : 'text-foreground-2'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${course.dot} shrink-0`} />
                  <span className="font-medium">{course.name}</span>
                </Link>
              );
            })}

            <div className="my-2 border-t border-border/50" />
            {navLinks.filter(link => link.href !== '/academy').map((link) => {
              const Icon = link.icon;
              const here = isIn(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={here ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all duration-200 ${
                    link.highlight ? 'text-accent' : here ? 'text-foreground' : 'text-foreground-2 hover:text-accent'
                  } ${here ? 'bg-muted/50' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
