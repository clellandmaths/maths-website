'use client';

import { useState, useMemo, useEffect } from 'react';
import { Filter, X, BookOpen, ClipboardList, Search, Printer, Maximize2, Play, Trash2, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, ArrowLeft, GraduationCap, Check } from 'lucide-react';
import FilterSidebar from '@/components/Explorer/FilterSidebar';
import QuestionCard from '@/components/Explorer/QuestionCard';
import WorksheetFAB from '@/components/Explorer/WorksheetFAB';
import WorksheetDrawer from '@/components/Explorer/WorksheetDrawer';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import FocusMode from '@/components/Explorer/FocusMode';
import MathRenderer from '@/components/MathRenderer';
import VideoModal from '@/components/VideoModal';
import QRCodeImage from '@/components/QRCodeImage';
import { WorksheetProvider, useWorksheet } from '@/lib/worksheet-context';
import { getAllN5Questions, getAllHigherQuestions, filterQuestions, QuestionWithMetadata } from '@/lib/data-loader';
import { n5TopicCategories, n5Topics } from '@/lib/n5-topics';
import { higherTopicCategories, higherTopics } from '@/lib/higher-topics';
import { getAvailableN5Years, getAvailableHigherYears } from '@/lib/data-loader';

type Course = 'n5' | 'higher';

const courseConfig = {
  n5: {
    label: 'National 5',
    topicCategories: n5TopicCategories,
    topics: n5Topics,
    availableYears: getAvailableN5Years(),
    loadQuestions: getAllN5Questions,
  },
  higher: {
    label: 'Higher',
    topicCategories: higherTopicCategories,
    topics: higherTopics,
    availableYears: getAvailableHigherYears(),
    loadQuestions: getAllHigherQuestions,
  },
} as const;

function getTimestampSeconds(ts: string): number {
  if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
  if (ts.includes(':')) {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  }
  return parseInt(ts, 10);
}

function ExplorerContent({ course, onChangeCourse }: { course: Course; onChangeCourse: () => void }) {
  const config = courseConfig[course];

  const [allQuestions, setAllQuestions] = useState<QuestionWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<number[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [viewMode, setViewMode] = useState<'browse' | 'worksheet'>('browse');
  const [showAnswersInView, setShowAnswersInView] = useState(false);
  const [showQRCodes, setShowQRCodes] = useState(false);
  const [presentStartIndex, setPresentStartIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<{videoId: string; timestamp: number; title: string} | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastMovedIndex, setLastMovedIndex] = useState<number | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);

  const { items: worksheetItems, addItem, removeItem, clearAll, reorderItems, isInWorksheet } = useWorksheet();

  // Load questions async on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    config.loadQuestions().then((questions) => {
      if (!cancelled) {
        setAllQuestions(questions);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [config]);

  // Reorder with visual feedback
  const handleReorder = (from: number, to: number) => {
    reorderItems(from, to);
    setLastMovedIndex(to);
  };

  // Clear flash after animation
  useEffect(() => {
    if (lastMovedIndex !== null) {
      const timer = setTimeout(() => setLastMovedIndex(null), 800);
      return () => clearTimeout(timer);
    }
  }, [lastMovedIndex]);

  // Filter questions based on selections
  const filteredQuestions = useMemo(
    () => filterQuestions(allQuestions, selectedSubtopics, selectedYears, selectedPapers),
    [allQuestions, selectedSubtopics, selectedYears, selectedPapers]
  );

  // Are filters active?
  const hasFilters = selectedSubtopics.length > 0 || selectedYears.length > 0 || selectedPapers.length > 0;

  // Filter helpers
  const clearAllFilters = () => {
    setSelectedSubtopics([]);
    setSelectedYears([]);
    setSelectedPapers([]);
  };

  const removeYear = (year: number) => {
    setSelectedYears((prev) => prev.filter((y) => y !== year));
  };

  const removePaper = (paper: number) => {
    setSelectedPapers((prev) => prev.filter((p) => p !== paper));
  };

  const removeSubtopic = (subtopic: string) => {
    setSelectedSubtopics((prev) => prev.filter((s) => s !== subtopic));
  };


  // Clear all worksheet with confirmation
  const handleClearAll = () => {
    if (showClearConfirm) {
      clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  // Shared FilterSidebar props
  const filterSidebarProps = {
    selectedSubtopics,
    onSubtopicsChange: setSelectedSubtopics,
    selectedYears,
    onYearsChange: setSelectedYears,
    selectedPapers,
    onPapersChange: setSelectedPapers,
    questionCount: hasFilters ? filteredQuestions.length : 0,
    topicCategories: config.topicCategories,
    topics: config.topics,
    availableYears: config.availableYears,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading {config.label} questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block no-print">
          <FilterSidebar {...filterSidebarProps} />
        </div>

        {/* Mobile Filter Overlay — full screen */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-950">
            <div className="flex-1 overflow-y-auto [&>aside]:w-full [&>aside]:border-r-0 [&>aside]:min-h-0 [&>aside]:h-auto [&>aside]:sticky-none [&>aside]:relative">
              <FilterSidebar {...filterSidebarProps} />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
              >
                Show {hasFilters ? filteredQuestions.length : allQuestions.length} questions
              </button>
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-300 rounded-lg hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 no-print">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={onChangeCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Change Course
              </button>
              <span className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wide">
                {config.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Topic Explorer</h1>
            <p className="text-slate-400">
              Use filters to find questions, then add them to build a custom worksheet.
            </p>
          </div>

          {/* Tabs */}
          <div className="no-print flex items-center gap-1 mb-6 border-b border-slate-800 sticky top-16 z-20 bg-slate-950/90 backdrop-blur-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <button
              onClick={() => setViewMode('browse')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'browse'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Search className="h-4 w-4" />
              Browse Questions
            </button>
            <button
              onClick={() => setViewMode('worksheet')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'worksheet'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              My Worksheet
              {worksheetItems.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                  {worksheetItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Browse Mode */}
          {viewMode === 'browse' && (
            <>
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 mb-6 px-4 py-2 bg-slate-800 rounded-lg text-slate-300"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <span className="ml-1 px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                    {selectedSubtopics.length + selectedYears.length + selectedPapers.length}
                  </span>
                )}
              </button>

              {/* Active Filters Bar */}
              {hasFilters && (
                <div className="mb-4 p-3 bg-slate-900/95 border border-slate-800 rounded-lg sticky top-[7.5rem] z-[9] backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                      <span className="text-emerald-400 font-medium">{filteredQuestions.length}</span> of {allQuestions.length} questions
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Clear all filters
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {/* Year chips - cyan */}
                    {selectedYears.map((year) => (
                      <button
                        key={`af-year-${year}`}
                        onClick={() => removeYear(year)}
                        className="shrink-0 px-2.5 py-1 bg-cyan-600/20 text-cyan-400 text-xs rounded-full flex items-center gap-1.5 hover:bg-cyan-600/30 transition-colors"
                      >
                        {year}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {/* Paper chips - amber */}
                    {selectedPapers.map((paper) => (
                      <button
                        key={`af-paper-${paper}`}
                        onClick={() => removePaper(paper)}
                        className="shrink-0 px-2.5 py-1 bg-amber-600/20 text-amber-400 text-xs rounded-full flex items-center gap-1.5 hover:bg-amber-600/30 transition-colors"
                      >
                        Paper {paper}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {/* Topic chips - emerald */}
                    {selectedSubtopics.map((subtopic) => (
                      <button
                        key={`af-topic-${subtopic}`}
                        onClick={() => removeSubtopic(subtopic)}
                        className="shrink-0 px-2.5 py-1 bg-emerald-600/20 text-emerald-400 text-xs rounded-full flex items-center gap-1.5 hover:bg-emerald-600/30 transition-colors"
                      >
                        {subtopic.length > 25 ? subtopic.slice(0, 25) + '...' : subtopic}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State - No Filters Selected */}
              {!hasFilters && (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto text-slate-700 mb-4" />
                  <h3 className="text-xl font-medium text-slate-400 mb-2">
                    Build Your Worksheet
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-6">
                    Use the filters to find questions by topic and year.
                    Click &quot;+ Add&quot; on any question to add it to your worksheet.
                  </p>
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    Open Filters
                  </button>
                </div>
              )}

              {/* Add All / Remove All */}
              {hasFilters && filteredQuestions.length > 0 && (
                <div className="mb-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const allIn = filteredQuestions.every(q => isInWorksheet(q));
                      if (allIn) {
                        filteredQuestions.forEach(q => removeItem(q));
                      } else {
                        filteredQuestions.forEach(q => addItem(q));
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filteredQuestions.every(q => isInWorksheet(q))
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                    }`}
                  >
                    {filteredQuestions.every(q => isInWorksheet(q))
                      ? `Remove all ${filteredQuestions.length} from worksheet`
                      : `Add all ${filteredQuestions.length} to worksheet`
                    }
                  </button>
                </div>
              )}

              {/* Questions Grid - Only Show When Filters Active */}
              {hasFilters && filteredQuestions.length > 0 && (
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {filteredQuestions.map((q) => (
                    <QuestionCard
                      key={`${q.year}-${q.paperNumber}-${q.questionIndex}`}
                      question={q}
                      year={q.year}
                      paperNumber={q.paperNumber}
                      questionIndex={q.questionIndex}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {hasFilters && filteredQuestions.length === 0 && (
                <div className="text-center py-16">
                  <Filter className="h-12 w-12 mx-auto text-slate-600 opacity-50 mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">
                    No questions found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your filters to find questions.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Worksheet View Mode */}
          {viewMode === 'worksheet' && (
            <>
              {worksheetItems.length === 0 ? (
                <div className="text-center py-16">
                  <ClipboardList className="h-16 w-16 mx-auto text-slate-700 mb-4" />
                  <h3 className="text-xl font-medium text-slate-400 mb-2">
                    Your Worksheet is Empty
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-6">
                    Switch to &quot;Browse Questions&quot; and use the filters to find questions.
                    Click &quot;+ Add&quot; to build your worksheet.
                  </p>
                  <button
                    onClick={() => setViewMode('browse')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Browse Questions
                  </button>
                </div>
              ) : (
                <>
                  {/* Worksheet Toolbar — sticky on desktop */}
                  <div className="mb-6 space-y-3 no-print hidden lg:block lg:sticky lg:top-28 z-10 bg-slate-950/90 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <p className="text-slate-400 text-sm">
                          {worksheetItems.length} {worksheetItems.length === 1 ? 'question' : 'questions'}
                        </p>
                        <button
                          onClick={handleClearAll}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            showClearConfirm
                              ? 'bg-red-600 hover:bg-red-500 text-white'
                              : 'bg-red-600/10 text-red-400 hover:bg-red-600/20'
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          {showClearConfirm ? 'Are you sure?' : 'Clear All'}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showAnswersInView}
                            onChange={(e) => setShowAnswersInView(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-400">Show answers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showQRCodes}
                            onChange={(e) => setShowQRCodes(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-400">QR codes</span>
                        </label>
                        <button
                          onClick={() => setPresentStartIndex(0)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Maximize2 className="h-4 w-4" />
                          Present
                        </button>
                        <button
                          onClick={() => setShowFocusMode(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          Focus
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Printer className="h-4 w-4" />
                          Print / Save PDF
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Tip: Use the arrows to reorder questions. Toggle answers and QR codes to control what appears in your print/PDF.
                    </p>
                  </div>

                  {/* Print-only header (hidden on screen) */}
                  <div className="print-only print-header">
                    <div className="flex justify-between items-end mb-4">
                      <h1 className="text-2xl font-bold">Clelland Maths <span className="font-normal text-gray-500">{config.label} Worksheet</span></h1>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        <div className="text-sm font-medium">{worksheetItems.length} question{worksheetItems.length === 1 ? '' : 's'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Worksheet Questions - Linear List View */}
                  <div className="space-y-6 max-w-4xl worksheet-container pb-20 lg:pb-0">
                    {worksheetItems.map((q, index) => (
                      <div
                        key={`ws-${q.year}-${q.paperNumber}-${q.questionIndex}`}
                        className={`worksheet-question bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6${index === lastMovedIndex ? ' card-just-moved' : ''}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-3 flex-1 flex-wrap">
                            <span className="q-badge flex items-center justify-center w-8 h-8 bg-emerald-600/20 text-emerald-400 text-sm font-bold rounded-full">
                              {index + 1}
                            </span>
                            <span className="text-sm text-slate-500">
                              {q.year} Paper {q.paperNumber} Q{q.questionIndex + 1}
                            </span>
                            {q.topics?.slice(0, 2).map((topic) => (
                              <span
                                key={topic}
                                className="topic-tag px-2 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                          {/* Reorder buttons — compact horizontal */}
                          <div className="no-print flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => handleReorder(index, 0)}
                              disabled={index === 0}
                              className="hidden lg:block p-1 text-slate-600 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move to top"
                            >
                              <ChevronsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(index, index - 1)}
                              disabled={index === 0}
                              className="p-3 lg:p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <ChevronUp className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(index, index + 1)}
                              disabled={index === worksheetItems.length - 1}
                              className="p-3 lg:p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <ChevronDown className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(index, worksheetItems.length - 1)}
                              disabled={index === worksheetItems.length - 1}
                              className="hidden lg:block p-1 text-slate-600 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move to bottom"
                            >
                              <ChevronsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(q)}
                            className="no-print shrink-0 p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Remove from worksheet"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {showQRCodes && (
                            <QRCodeImage
                              url={`https://www.youtube.com/watch?v=${q.videoId}&t=${getTimestampSeconds(q.timestamp)}`}
                              size={64}
                              className="shrink-0 rounded"
                            />
                          )}
                        </div>

                        <MathRenderer
                          html={q.question}
                          className="text-slate-300 question-content text-lg leading-relaxed"
                        />

                        {showAnswersInView && (
                          <div className="answer-section mt-4 pt-4 border-t border-slate-800">
                            <p className="answer-label text-sm font-medium text-emerald-400 mb-2">Answer:</p>
                            <MathRenderer
                              html={q.answer}
                              className="text-slate-300 answer-content"
                            />
                          </div>
                        )}

                        {/* Watch Solution + Present from here (hidden on print) */}
                        <div className="no-print flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                          <button
                            onClick={() => setPresentStartIndex(index)}
                            className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                          >
                            <Maximize2 className="h-3.5 w-3.5 inline mr-1" />
                            Full screen from here
                          </button>
                          <button
                            onClick={() => setActiveVideo({
                              videoId: q.videoId,
                              timestamp: getTimestampSeconds(q.timestamp),
                              title: `${q.year} Paper ${q.paperNumber} Q${q.questionIndex + 1}`
                            })}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Play className="h-4 w-4" />
                            Watch Solution
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Print-only footer */}
                  <div className="print-only print-footer">
                    Clelland Maths &mdash; www.clellandmaths.com
                  </div>

                  {/* Mobile bottom action bar — always visible on scroll */}
                  <div className="fixed bottom-0 left-0 right-0 lg:hidden no-print z-10 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showAnswersInView}
                            onChange={(e) => setShowAnswersInView(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-400">Answers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showQRCodes}
                            onChange={(e) => setShowQRCodes(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-400">QR</span>
                        </label>
                      </div>
                      <button
                        onClick={handleClearAll}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          showClearConfirm
                            ? 'bg-red-600 text-white'
                            : 'text-red-400/70 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="h-3 w-3" />
                        {showClearConfirm ? 'Confirm?' : 'Clear all'}
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setPresentStartIndex(0)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Present
                      </button>
                      <button
                        onClick={() => setShowFocusMode(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        Focus
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                        Print / Save PDF
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Worksheet FAB - only show in browse mode, desktop only (tabs handle mobile) */}
      {viewMode === 'browse' && (
        <div className="hidden lg:block">
          <WorksheetFAB onClick={() => setViewMode('worksheet')} />
        </div>
      )}

      {/* Worksheet Drawer */}
      <WorksheetDrawer
        isOpen={showWorksheet}
        onClose={() => setShowWorksheet(false)}
        onViewOnWeb={() => {
          setShowWorksheet(false);
          setViewMode('worksheet');
        }}
      />

      {/* Full-screen Presentation Mode */}
      {presentStartIndex !== null && worksheetItems.length > 0 && (
        <QuestionPresenter
          questions={worksheetItems}
          startIndex={presentStartIndex}
          onClose={() => setPresentStartIndex(null)}
        />
      )}

      {/* Full-screen Focus Mode */}
      {showFocusMode && worksheetItems.length > 0 && (
        <FocusMode
          questions={worksheetItems}
          onClose={() => setShowFocusMode(false)}
        />
      )}

      {/* Video Modal for worksheet view */}
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

// Course Selection Screen
const explorerFeatures = [
  'Topic-by-Topic Filtering',
  'Instant Worksheet Builder',
  'PDF Export',
];

const courseCards: { id: Course; name: string; subtitle: string }[] = [
  { id: 'n5', name: 'National 5', subtitle: '10 Past Papers · 200+ Questions' },
  { id: 'higher', name: 'Higher', subtitle: '9 Past Papers · 170+ Questions' },
];

function CourseSelector({ onSelect }: { onSelect: (course: Course) => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-3xl w-full">
        <GraduationCap className="h-16 w-16 mx-auto text-emerald-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Topic Explorer</h1>
        <p className="text-slate-400 mb-10 text-lg">
          Choose your course to start browsing past paper questions.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {courseCards.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:scale-[1.02] transition-all"
            >
              <h2 className="text-2xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">
                {course.name}
              </h2>
              <p className="text-sm text-slate-500 mb-6">{course.subtitle}</p>
              <ul className="space-y-3 text-left mb-8">
                {explorerFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelect(course.id)}
                className="mt-auto w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
              >
                Launch Explorer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('preferredCourse');
    return saved === 'n5' || saved === 'higher' ? saved : null;
  });

  const handleSelectCourse = (course: Course) => {
    localStorage.setItem('preferredCourse', course);
    setSelectedCourse(course);
  };

  const handleChangeCourse = () => {
    setSelectedCourse(null);
  };

  if (!selectedCourse) {
    return <CourseSelector onSelect={handleSelectCourse} />;
  }

  // Key by course so WorksheetProvider resets when switching courses
  return (
    <WorksheetProvider key={selectedCourse} course={selectedCourse}>
      <ExplorerContent
        course={selectedCourse}
        onChangeCourse={handleChangeCourse}
      />
    </WorksheetProvider>
  );
}
