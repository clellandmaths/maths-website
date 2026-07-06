'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { getNotesForCourse } from '@/lib/notes-loader';
import TopicView from './TopicView';
import type { Course, Topic } from '@/src/notes/types';

interface Props {
  courseId: string;
}

export default function CourseNotes({ courseId }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCourse(null);
    setSelectedSection(0);
    setSelectedTopic(0);
    setExpandedSections(new Set([0]));
    getNotesForCourse(courseId).then(data => {
      setCourse(data);
      setLoading(false);
    });
  }, [courseId]);

  function selectTopic(sectionIdx: number, topicIdx: number) {
    setSelectedSection(sectionIdx);
    setSelectedTopic(topicIdx);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleSection(idx: number) {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />
        <p className="text-slate-400">Loading course notes...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Course notes not available yet.</p>
      </div>
    );
  }

  const currentTopic: Topic | undefined = course.sections[selectedSection]?.topics[selectedTopic];

  const Sidebar = (
    <nav className="space-y-1">
      {course.sections.map((section, sIdx) => {
        const isExpanded = expandedSections.has(sIdx);
        return (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(sIdx)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-800 transition-colors group"
            >
              <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100">
                {section.title}
              </span>
              {isExpanded
                ? <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                : <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
              }
            </button>
            {isExpanded && (
              <div className="ml-2 space-y-0.5 mt-0.5">
                {section.topics.map((topic, tIdx) => {
                  const isActive = sIdx === selectedSection && tIdx === selectedTopic;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(sIdx, tIdx)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-emerald-600/20 text-emerald-400 font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {topic.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="flex gap-6 relative">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-xl p-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {Sidebar}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-slate-200">Course Notes</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
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
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
          >
            <Menu className="h-4 w-4" />
            Topics
          </button>
          {currentTopic && (
            <span className="text-sm text-slate-400 truncate">{currentTopic.title}</span>
          )}
        </div>

        {/* Topic title */}
        {currentTopic && (
          <>
            <h2 className="text-2xl font-bold mb-1">{currentTopic.title}</h2>
            <p className="text-sm text-slate-400 mb-6">
              {course.sections[selectedSection]?.title}
            </p>
            <TopicView topic={currentTopic} />
          </>
        )}
      </div>
    </div>
  );
}
