'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import type { Topic } from '@/src/notes/types';

interface Props {
  topic: Topic;
}

export default function TopicView({ topic }: Props) {
  const [openExamples, setOpenExamples] = useState<Set<number>>(new Set());

  const hasVideo = topic.videoUrl && !topic.videoUrl.includes('placeholder');

  function toggleExample(idx: number) {
    setOpenExamples(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <div className="space-y-8">
      {/* Video */}
      {hasVideo ? (
        <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video">
          <iframe
            src={topic.videoUrl}
            title={topic.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
          <div className="text-center">
            <Play className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">Video coming soon</p>
          </div>
        </div>
      )}

      {/* Theory */}
      {topic.theory && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Theory</h3>
          <div className="prose-notes text-slate-300 leading-relaxed space-y-3">
            {topic.theory}
          </div>
        </div>
      )}

      {/* Worked Examples */}
      {topic.examples.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Worked Examples</h3>
          {topic.examples.map((example, idx) => {
            const isOpen = openExamples.has(idx);
            return (
              <div key={example.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleExample(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 flex items-center justify-center bg-emerald-600/20 text-emerald-400 text-xs font-bold rounded">
                      {idx + 1}
                    </span>
                    <div className="text-slate-200 text-sm">{example.question}</div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-3" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-3" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-800 px-5 py-4 text-slate-300 text-sm leading-relaxed space-y-2">
                    {example.solution}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
