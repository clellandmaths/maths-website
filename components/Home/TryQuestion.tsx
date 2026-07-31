'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import type { PastPaper, QuestionWithMetadata } from '@/lib/data-loader';
import { questionNumber } from '@/lib/question-number';

// One file imported per question shown — keeps the homepage payload small.
// That is why this list is written out rather than read from data-loader:
// pulling every paper in would defeat the point.
//
// ADD THE NEW YEAR HERE when a past paper is added. Nothing else on the site
// needs it — course pages, Explorer, Exam Hall, the sitemap and the practice
// references all read data-loader and pick a new year up on their own. This
// list is the one place that goes stale silently, and it did: it sat on
// 2023/2024 for the whole 2025 diet, so the homepage never offered a 2025
// question and nothing complained. scripts/check-homepage-years.mjs now fails
// the build when a course's newest paper is missing here.
const sources = [
  { course: 'National 5', load: () => import('@/src/n5/pastpapers/pastpaper-2026').then(m => m.pastpaper2026) },
  { course: 'National 5', load: () => import('@/src/n5/pastpapers/pastpaper-2025').then(m => m.pastpaper2025) },
  { course: 'National 5', load: () => import('@/src/n5/pastpapers/pastpaper-2024').then(m => m.pastpaper2024) },
  { course: 'Higher', load: () => import('@/src/higher/pastpapers/higherpastpaper2026').then(m => m.higherPastPaper2026) },
  { course: 'Higher', load: () => import('@/src/higher/pastpapers/higherpastpaper2025').then(m => m.higherPastPaper2025) },
  { course: 'Higher', load: () => import('@/src/higher/pastpapers/higherpastpaper2024').then(m => m.higherPastPaper2024) },
];

interface Picked extends QuestionWithMetadata {
  course: string;
}

function pickQuestion(course: string, paper: PastPaper): Picked | null {
  const pool: Picked[] = [];
  for (const p of paper.papers) {
    p.questions.forEach((q, i) => {
      // Homepage tile wants short, self-contained, text-only questions
      if (!q.question.includes('<img') && q.question.length < 380 && q.answer) {
        pool.push({
          ...q, course, year: paper.year, paperNumber: p.paperNumber, questionIndex: i,
          questionNumber: questionNumber(q.question) ?? String(i + 1),
        });
      }
    });
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function TryQuestion() {
  const [question, setQuestion] = useState<Picked | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRandom = useCallback(async () => {
    setLoading(true);
    setShowAnswer(false);
    const source = sources[Math.floor(Math.random() * sources.length)];
    const paper = (await source.load()) as PastPaper;
    setQuestion(pickQuestion(source.course, paper));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRandom();
  }, [loadRandom]);

  return (
    <div className="h-full bg-card border border-border rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Try a real past-paper question
        </span>
        {question && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-signal-mint/80">
              {question.course} · {question.year} · P{question.paperNumber} · Q{question.questionNumber}
            </span>
            <Marks marks={question.marks} />
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[120px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : question ? (
          <>
            <div className="question-content text-foreground/90">
              <MathRenderer html={question.question} />
            </div>
            {showAnswer && (
              <div className="answer-content mt-4 pt-4 border-t border-border text-foreground/80">
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">Answer</span>
                <MathRenderer html={question.answer} />
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Couldn&apos;t load a question — try the Explorer instead.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border">
        <button
          onClick={() => setShowAnswer(s => !s)}
          disabled={loading || !question}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-40 text-background text-sm font-bold rounded-lg transition-colors"
        >
          {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showAnswer ? 'Hide answer' : 'Show answer'}
        </button>
        <button
          onClick={loadRandom}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted/40 hover:bg-muted/60 disabled:opacity-40 text-foreground text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Another one
        </button>
        <Link href="/explorer" className="ml-auto text-sm text-foreground/70 hover:text-foreground transition-colors">
          Build a worksheet in the Explorer →
        </Link>
      </div>
    </div>
  );
}
