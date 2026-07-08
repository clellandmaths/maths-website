'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, FileText, ChevronDown, ChevronUp, BookOpen, List, GraduationCap } from 'lucide-react';
import CourseNotes from '@/components/Notes/CourseNotes';
import VideoModal from '@/components/VideoModal';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import FocusMode from '@/components/Explorer/FocusMode';
import { n5PaperVideos, higherPaperVideos, type PaperVideo } from '@/lib/past-paper-videos';
import { getCourseTheme } from '@/lib/course-theme';
import { getAllN5Questions, getAllHigherQuestions, type QuestionWithMetadata } from '@/lib/data-loader';

interface CoursePageProps {
  courseId: string;
}

const courseConfig: Record<string, {
  name: string;
  paperVideos: PaperVideo[];
  loadQuestions: () => Promise<QuestionWithMetadata[]>;
}> = {
  n5: { name: 'National 5', paperVideos: n5PaperVideos, loadQuestions: getAllN5Questions },
  higher: { name: 'Higher', paperVideos: higherPaperVideos, loadQuestions: getAllHigherQuestions },
};

const courseNames: Record<string, string> = {
  n5: 'National 5',
  higher: 'Higher',
  ah: 'Advanced Higher',
  'n5-apps': 'N5 Applications',
  'higher-apps': 'Higher Applications',
};

function getTimestampSeconds(ts: string): number {
  if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
  if (ts.includes(':')) {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  }
  return parseInt(ts, 10);
}

export default function CoursePage({ courseId }: CoursePageProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'papers'>('notes');

  // Lazy question loading
  const [allQuestions, setAllQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // UI state
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const [presenterQuestions, setPresenterQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [presenterStartIndex, setPresenterStartIndex] = useState(0);
  const [focusQuestions, setFocusQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ videoId: string; timestamp: number; title: string } | null>(null);

  const courseName = courseNames[courseId] || 'Course';
  const config = courseConfig[courseId];
  const theme = getCourseTheme(courseId);

  // Group papers by year (newest first)
  const papersByYear = useMemo(() => {
    if (!config) return [];
    const yearMap = new Map<number, PaperVideo[]>();
    for (const paper of config.paperVideos) {
      const existing = yearMap.get(paper.year) || [];
      existing.push(paper);
      yearMap.set(paper.year, existing);
    }
    return Array.from(yearMap.entries())
      .sort(([a], [b]) => b - a)
      .map(([year, papers]) => ({
        year,
        papers: papers.sort((a, b) => a.paperNumber - b.paperNumber),
      }));
  }, [config]);

  // Load questions lazily (cached after first load)
  const ensureQuestionsLoaded = useCallback(async (): Promise<QuestionWithMetadata[]> => {
    if (allQuestions) return allQuestions;
    if (!config) return [];
    setLoadingQuestions(true);
    const questions = await config.loadQuestions();
    setAllQuestions(questions);
    setLoadingQuestions(false);
    return questions;
  }, [allQuestions, config]);

  // Get questions for a specific paper
  const getQuestionsForPaper = useCallback((questions: QuestionWithMetadata[], year: number, paperNumber: number) => {
    return questions.filter(q => q.year === year && q.paperNumber === paperNumber);
  }, []);

  // Action handlers
  const handleStartPaper = useCallback(async (year: number, paperNumber: number, startIndex = 0) => {
    const questions = await ensureQuestionsLoaded();
    const paperQuestions = getQuestionsForPaper(questions, year, paperNumber);
    if (paperQuestions.length > 0) {
      setPresenterQuestions(paperQuestions);
      setPresenterStartIndex(startIndex);
    }
  }, [ensureQuestionsLoaded, getQuestionsForPaper]);

  const handleFocusMode = useCallback(async (year: number, paperNumber: number) => {
    const questions = await ensureQuestionsLoaded();
    const paperQuestions = getQuestionsForPaper(questions, year, paperNumber);
    if (paperQuestions.length > 0) {
      setFocusQuestions(paperQuestions);
    }
  }, [ensureQuestionsLoaded, getQuestionsForPaper]);

  const handleExpandPaper = useCallback(async (year: number, paperNumber: number) => {
    const key = `${year}-${paperNumber}`;
    if (expandedPaper === key) {
      setExpandedPaper(null);
      return;
    }
    await ensureQuestionsLoaded();
    setExpandedPaper(key);
  }, [expandedPaper, ensureQuestionsLoaded]);

  // Full-screen modes take priority over page content
  if (presenterQuestions) {
    return (
      <QuestionPresenter
        questions={presenterQuestions}
        startIndex={presenterStartIndex}
        onClose={() => setPresenterQuestions(null)}
      />
    );
  }

  if (focusQuestions) {
    return (
      <FocusMode
        questions={focusQuestions}
        onClose={() => setFocusQuestions(null)}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-signal-magenta mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {courseName} <span className={theme.text}>Maths</span>
          </h1>
          <p className="text-slate-400">
            Video lessons, practice questions, and past paper archive
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'notes'
                ? `${theme.text} ${theme.border}`
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Course Notes
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'papers'
                ? `${theme.text} ${theme.border}`
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            Past Paper Archive
          </button>
        </div>

        {/* Content */}
        {activeTab === 'notes' ? (
          <CourseNotes courseId={courseId} />
        ) : config ? (
          <div className="space-y-6">
            {/* Loading overlay */}
            {loadingQuestions && (
              <div className="flex items-center justify-center py-8">
                <div className={`h-8 w-8 border-4 ${theme.border} border-t-transparent rounded-full animate-spin mr-3`} />
                <p className="text-slate-400">Loading questions...</p>
              </div>
            )}

            {papersByYear.map(({ year, papers }) => (
              <div key={year}>
                <h3 className="text-xl font-bold mb-4">{year}</h3>
                <div className="space-y-4">
                  {papers.map((paper) => {
                    const paperKey = `${paper.year}-${paper.paperNumber}`;
                    const isExpanded = expandedPaper === paperKey;
                    const paperQuestions = allQuestions
                      ? getQuestionsForPaper(allQuestions, paper.year, paper.paperNumber)
                      : [];

                    return (
                      <div
                        key={paperKey}
                        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                      >
                        {/* Paper card */}
                        <div className="flex flex-col sm:flex-row">
                          {/* Thumbnail */}
                          <div className="sm:w-64 shrink-0">
                            <div className="relative aspect-video sm:h-full bg-slate-800">
                              <img
                                src={`https://img.youtube.com/vi/${paper.videoId}/mqdefault.jpg`}
                                alt={`${courseName} ${paper.year} Paper ${paper.paperNumber}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          {/* Info + actions */}
                          <div className="flex-1 p-4 sm:p-5 flex flex-col">
                            <div className="mb-3">
                              <h4 className="text-lg font-semibold text-slate-200">
                                {year} Paper {paper.paperNumber}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {paper.questionCount} Questions
                              </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-auto">
                              <button
                                onClick={() => setActiveVideo({
                                  videoId: paper.videoId,
                                  timestamp: 0,
                                  title: `${courseName} ${paper.year} Paper ${paper.paperNumber}`,
                                })}
                                className={`flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white text-sm font-medium rounded-lg transition-all`}
                              >
                                <Play className="h-4 w-4" />
                                Watch Video
                              </button>
                              <button
                                onClick={() => handleStartPaper(paper.year, paper.paperNumber)}
                                className={`flex items-center gap-1.5 px-3 py-2 bg-card border ${theme.border} ${theme.text} hover:bg-white/5 text-sm font-medium rounded-lg transition-colors`}
                              >
                                <BookOpen className="h-4 w-4" />
                                Start Paper
                              </button>
                              <button
                                onClick={() => handleFocusMode(paper.year, paper.paperNumber)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                <List className="h-4 w-4" />
                                Focus Mode
                              </button>
                              <button
                                onClick={() => handleExpandPaper(paper.year, paper.paperNumber)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors ml-auto"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span className="hidden sm:inline">Hide Questions</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span className="hidden sm:inline">Browse Questions</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded question list */}
                        {isExpanded && paperQuestions.length > 0 && (
                          <div className="border-t border-slate-800">
                            {paperQuestions.map((q, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-b-0"
                              >
                                {/* Question number */}
                                <button
                                  onClick={() => handleStartPaper(paper.year, paper.paperNumber, idx)}
                                  className={`shrink-0 h-8 w-8 flex items-center justify-center ${theme.tint} ${theme.text} text-sm font-bold rounded-lg hover:bg-white/10 transition-colors`}
                                >
                                  {q.questionIndex + 1}
                                </button>

                                {/* Topic chips */}
                                <div className="flex-1 flex flex-wrap gap-1.5 min-w-0">
                                  {q.topics?.slice(0, 2).map((topic) => (
                                    <span
                                      key={topic}
                                      className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded truncate max-w-[200px]"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                  {(!q.topics || q.topics.length === 0) && (
                                    <span className="text-slate-600 text-xs">No topics tagged</span>
                                  )}
                                </div>

                                {/* Watch solution */}
                                <button
                                  onClick={() => setActiveVideo({
                                    videoId: q.videoId,
                                    timestamp: getTimestampSeconds(q.timestamp),
                                    title: `${courseName} ${q.year} P${q.paperNumber} Q${q.questionIndex + 1}`,
                                  })}
                                  className={`shrink-0 flex items-center gap-1 px-2 py-1 ${theme.text} hover:opacity-80 text-xs font-medium transition-opacity`}
                                >
                                  <Play className="h-3 w-3" />
                                  Solution
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Loading state for expanded */}
                        {isExpanded && paperQuestions.length === 0 && loadingQuestions && (
                          <div className="border-t border-slate-800 p-4 text-center">
                            <div className={`h-6 w-6 border-3 ${theme.border} border-t-transparent rounded-full animate-spin mx-auto`} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Past Paper Archive</h3>
              <p className="text-slate-400">
                Past paper walkthroughs coming soon.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          videoId={activeVideo.videoId}
          timestamp={activeVideo.timestamp}
          title={activeVideo.title}
        />
      )}
    </div>
  );
}
