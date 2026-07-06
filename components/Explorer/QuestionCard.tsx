'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { getMainTopic } from '@/lib/n5-topics';
import { useWorksheet } from '@/lib/worksheet-context';
import { QuestionWithMetadata } from '@/lib/data-loader';
import MathRenderer from '@/components/MathRenderer';


export interface Question {
  question: string;
  answer: string;
  videoId: string;
  timestamp: string;
  topics: string[];
}

interface QuestionCardProps {
  question: Question;
  year: number;
  paperNumber: number;
  questionIndex: number;
}


export default function QuestionCard({
  question,
  year,
  paperNumber,
  questionIndex,
}: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const { addItem, removeItem, isInWorksheet } = useWorksheet();

  const fullQuestion: QuestionWithMetadata = {
    ...question,
    year,
    paperNumber,
    questionIndex,
  };

  const inWorksheet = isInWorksheet(fullQuestion);
  const mainTopics = [...new Set(question.topics.map((t) => getMainTopic(t)).filter(Boolean))];

  const handleToggleWorksheet = () => {
    if (inWorksheet) {
      removeItem(fullQuestion);
    } else {
      addItem(fullQuestion);
    }
  };

  return (
    <>
      <div className={`bg-slate-900 border rounded-xl p-5 transition-colors ${
        inWorksheet
          ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
          : 'border-slate-800 hover:border-emerald-500/30'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-slate-200 font-semibold text-sm">
              {year} Paper {paperNumber} Q{questionIndex + 1}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mainTopics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleToggleWorksheet}
            className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              inWorksheet
                ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            {inWorksheet ? (
              <>
                <Check className="h-3 w-3" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" />
                Add
              </>
            )}
          </button>
        </div>

        {/* Question */}
        <MathRenderer
          html={question.question}
          className="text-slate-300 mb-4 question-content question-card text-sm leading-relaxed"
        />

        {/* Answer Section */}
        <div className="pt-3 mt-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-300 text-sm font-medium mb-2"
          >
            {showAnswer ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Answer
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Answer
              </>
            )}
          </button>

          {showAnswer && (
            <MathRenderer
              html={question.answer}
              className="bg-slate-800/50 rounded-lg p-3 text-slate-300 answer-content"
            />
          )}
        </div>

      </div>
    </>
  );
}
