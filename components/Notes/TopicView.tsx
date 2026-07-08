'use client';

import { useState } from 'react';
import { ChevronDown, Check, ArrowLeft, ArrowRight, Play, FileText } from 'lucide-react';
import type { Topic } from '@/src/notes/types';
import type { CourseTheme } from '@/lib/course-theme';

interface Props {
  topic: Topic;
  sectionTitle: string;
  topicNumber: number;
  topicCount: number;
  theme: CourseTheme;
  isCompleted: boolean;
  onToggleComplete: () => void;
  prevTitle?: string;
  nextTitle?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function TopicView({
  topic,
  sectionTitle,
  topicNumber,
  topicCount,
  theme,
  isCompleted,
  onToggleComplete,
  prevTitle,
  nextTitle,
  onPrev,
  onNext,
}: Props) {
  const [openExamples, setOpenExamples] = useState<Set<number>>(new Set());

  const hasVideo = Boolean(topic.videoUrl) && !topic.videoUrl.includes('placeholder');

  function toggleExample(idx: number) {
    setOpenExamples(prevSet => {
      const nextSet = new Set(prevSet);
      if (nextSet.has(idx)) nextSet.delete(idx);
      else nextSet.add(idx);
      return nextSet;
    });
  }

  return (
    <div>
      {/* Lesson header */}
      <div className="mb-8">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
          {sectionTitle} · Topic {topicNumber} of {topicCount}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {topic.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs">
            <Play className="h-3.5 w-3.5" />
            {hasVideo ? 'Video lesson' : 'Video coming soon'}
          </span>
          {topic.examples.length > 0 && (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs">
              <FileText className="h-3.5 w-3.5" />
              {topic.examples.length} worked example{topic.examples.length === 1 ? '' : 's'}
            </span>
          )}
          {/* Optional, lightweight — tracking is opt-in, never a course flow */}
          <button
            onClick={onToggleComplete}
            className={`sm:ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs transition-colors ${
              isCompleted
                ? `${theme.border} ${theme.tint} ${theme.text}`
                : 'border-border text-muted-foreground hover:text-foreground hover:border-white/25'
            }`}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {isCompleted ? 'Done' : 'Mark as done'}
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Video — only rendered when one exists */}
        {hasVideo && (
          <div className="rounded-xl overflow-hidden border border-border aspect-video bg-black">
            <iframe
              src={topic.videoUrl}
              title={topic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Theory — open typography, no box */}
        {topic.theory && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className={`font-mono text-xs font-semibold uppercase tracking-widest ${theme.text}`}>
                Theory
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="text-foreground/85 leading-relaxed space-y-3 text-[15px]">
              {topic.theory}
            </div>
          </section>
        )}

        {/* Worked examples */}
        {topic.examples.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className={`font-mono text-xs font-semibold uppercase tracking-widest ${theme.text}`}>
                Worked examples
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-4">
              {topic.examples.map((example, idx) => {
                const isOpen = openExamples.has(idx);
                return (
                  <div key={example.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="px-5 pt-4 pb-4">
                      <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${theme.text} mb-3`}>
                        Example {idx + 1}
                      </p>
                      <div className="text-foreground/90 text-[15px] leading-relaxed">
                        {example.question}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExample(idx)}
                      className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium border-t border-border transition-colors ${
                        isOpen
                          ? 'text-muted-foreground hover:text-foreground bg-white/[0.02]'
                          : `${theme.text} hover:bg-white/5`
                      }`}
                    >
                      {isOpen ? 'Hide solution' : 'Show solution'}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="px-5 py-5 border-t border-border text-foreground/85 text-[15px] leading-relaxed space-y-2">
                          {example.solution}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer — prev/next is the primary navigation */}
        <footer className="pt-2">
          <div className="grid sm:grid-cols-2 gap-3">
            {onPrev ? (
              <button
                onClick={onPrev}
                className="group flex items-center gap-3 px-4 py-3 bg-card border border-border hover:border-white/20 rounded-xl text-left transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Previous</span>
                  <span className="block text-sm text-foreground/80 group-hover:text-foreground truncate">{prevTitle}</span>
                </span>
              </button>
            ) : <span className="hidden sm:block" />}
            {onNext && (
              <button
                onClick={onNext}
                className="group flex items-center justify-end gap-3 px-4 py-3 bg-card border border-border hover:border-white/25 rounded-xl text-right transition-colors"
              >
                <span className="min-w-0">
                  <span className={`block font-mono text-[10px] uppercase tracking-widest ${theme.text}`}>Next</span>
                  <span className="block text-sm text-foreground/80 group-hover:text-foreground truncate">{nextTitle}</span>
                </span>
                <ArrowRight className={`h-4 w-4 ${theme.text} shrink-0`} />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
