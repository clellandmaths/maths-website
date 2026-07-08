'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu, X, Check } from 'lucide-react';
import { getCourseTheme } from '@/lib/course-theme';
import TopicView from './TopicView';
import type { Topic } from '@/src/notes/types';

// Serializable curriculum model — ids and titles only, no JSX
export interface NotesNav {
  courseTitle: string;
  sections: { id: string; title: string; topics: { id: string; title: string }[] }[];
}

interface Props {
  courseId: string;
  nav: NotesNav;
  sectionId: string;
  topicId: string;
  topic: Topic;
  sectionTitle: string;
  topicNumber: number;
  topicCount: number;
  prevHref?: string;
  prevTitle?: string;
  nextHref?: string;
  nextTitle?: string;
}

const STORAGE_KEY = 'clellandMaths_notesProgress';

function loadCompleted(courseId: string): Set<string> {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return new Set<string>(all[courseId] ?? []);
  } catch {
    return new Set();
  }
}

function saveCompleted(courseId: string, completed: Set<string>) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    all[courseId] = [...completed];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable (private mode etc.) — progress just won't persist
  }
}

export default function NotesTopicShell({
  courseId,
  nav,
  sectionId,
  topicId,
  topic,
  sectionTitle,
  topicNumber,
  topicCount,
  prevHref,
  prevTitle,
  nextHref,
  nextTitle,
}: Props) {
  const theme = getCourseTheme(courseId);
  const currentSectionIdx = nav.sections.findIndex(s => s.id === sectionId);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([currentSectionIdx])
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // localStorage is read after mount to avoid hydration mismatch on static pages
  useEffect(() => {
    setCompleted(loadCompleted(courseId));
  }, [courseId]);

  const currentKey = `${sectionId}/${topicId}`;
  const flatTopics = nav.sections.flatMap(s => s.topics.map(t => `${s.id}/${t.id}`));
  const completedCount = flatTopics.filter(k => completed.has(k)).length;
  const pct = flatTopics.length > 0 ? Math.round((completedCount / flatTopics.length) * 100) : 0;

  const toggleComplete = useCallback(() => {
    setCompleted(prevSet => {
      const nextSet = new Set(prevSet);
      if (nextSet.has(currentKey)) nextSet.delete(currentKey);
      else nextSet.add(currentKey);
      saveCompleted(courseId, nextSet);
      return nextSet;
    });
  }, [courseId, currentKey]);

  function toggleSection(idx: number) {
    setExpandedSections(prevSet => {
      const nextSet = new Set(prevSet);
      if (nextSet.has(idx)) nextSet.delete(idx);
      else nextSet.add(idx);
      return nextSet;
    });
  }

  const Sidebar = (
    <div>
      {/* Progress header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          Course notes
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.progress} rounded-full transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">{pct}%</span>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground mt-1.5">
          {completedCount} of {flatTopics.length} topics complete
        </p>
      </div>

      {/* Curriculum */}
      <nav className="p-2 space-y-0.5">
        {nav.sections.map((section, sIdx) => {
          const isExpanded = expandedSections.has(sIdx);
          const sectionDone = section.topics.filter(
            t => completed.has(`${section.id}/${t.id}`)
          ).length;
          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(sIdx)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-white/5 transition-colors group"
              >
                <span className={`font-mono text-[11px] font-semibold ${theme.text}`}>
                  {String(sIdx + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground/80 group-hover:text-foreground leading-snug">
                  {section.title}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {sectionDone}/{section.topics.length}
                </span>
                {isExpanded
                  ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                }
              </button>
              {isExpanded && (
                <div className="mb-1">
                  {section.topics.map(t => {
                    const key = `${section.id}/${t.id}`;
                    const isActive = section.id === sectionId && t.id === topicId;
                    const isDone = completed.has(key);
                    return (
                      <Link
                        key={t.id}
                        href={`/course/${courseId}/notes/${section.id}/${t.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 pl-4 pr-2.5 py-1.5 text-left text-sm border-l-2 transition-colors ${
                          isActive
                            ? `${theme.border} ${theme.tint} ${theme.text} font-medium`
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <span
                          className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${
                            isDone
                              ? `${theme.bg} border-transparent`
                              : 'border-muted-foreground/40'
                          }`}
                        >
                          {isDone && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className="leading-snug">{t.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex gap-8 relative">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 bg-card border border-border rounded-xl overflow-hidden max-h-[calc(100vh-6rem)] flex flex-col">
          <div className={`h-1 shrink-0 bg-gradient-to-r ${theme.gradient}`} />
          <div className="overflow-y-auto">
            {Sidebar}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-r border-border overflow-y-auto z-50">
            <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="font-display font-semibold text-foreground">{nav.courseTitle}</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close topics">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-card border border-border hover:border-white/20 rounded-lg text-sm text-foreground/80 transition-colors shrink-0"
          >
            <Menu className="h-4 w-4" />
            Topics
          </button>
          <span className="text-sm text-muted-foreground truncate">{topic.title}</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums shrink-0">{pct}%</span>
        </div>

        <TopicView
          topic={topic}
          sectionTitle={sectionTitle}
          topicNumber={topicNumber}
          topicCount={topicCount}
          theme={theme}
          isCompleted={completed.has(currentKey)}
          onToggleComplete={toggleComplete}
          prevHref={prevHref}
          prevTitle={prevTitle}
          nextHref={nextHref}
          nextTitle={nextTitle}
        />
      </div>
    </div>
  );
}
