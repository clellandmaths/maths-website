'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Filter, X, BookOpen, ClipboardList, Search, Printer, Maximize2, Play, Trash2, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, ArrowLeft, GraduationCap, Check, Paperclip, Share2, Dices, Loader2, SlidersHorizontal } from 'lucide-react';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import MarkschemeModal from '@/components/Explorer/MarkschemeModal';
import { hasMarkscheme } from '@/lib/ah-markschemes';
import { ClipboardCheck } from 'lucide-react';
import FilterSidebar from '@/components/Explorer/FilterSidebar';
import QuestionCard from '@/components/Explorer/QuestionCard';
import WorksheetFAB from '@/components/Explorer/WorksheetFAB';
import WorksheetDrawer from '@/components/Explorer/WorksheetDrawer';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import FocusMode from '@/components/Explorer/FocusMode';
import FormulaeSheet from '@/components/FormulaeSheet';
import FormulaeButton from '@/components/FormulaeButton';
import Marks from '@/components/Marks';
import MathRenderer from '@/components/MathRenderer';
import Hints from '@/components/Hints';
import VideoModal from '@/components/VideoModal';
import QRCodeImage from '@/components/QRCodeImage';
import { WorksheetProvider, useWorksheet } from '@/lib/worksheet-context';
import { getAllN5Questions, getAllHigherQuestions, getAllAHQuestions, getAllHigherAppsQuestions, getAllN5AppsQuestions, filterQuestions, QuestionWithMetadata } from '@/lib/data-loader';
import { n5TopicCategories, n5Topics, getMainTopic } from '@/lib/n5-topics';
import { higherTopicCategories, higherTopics } from '@/lib/higher-topics';
import { ahTopicCategories, ahTopics } from '@/lib/ah-topics';
import { higherAppsTopicCategories, higherAppsTopics } from '@/lib/higher-apps-topics';
import { n5AppsTopicCategories, n5AppsTopics } from '@/lib/n5-apps-topics';
import { getAvailableN5Years, getAvailableHigherYears, getAvailableAHYears, getAvailableHigherAppsYears, getAvailableN5AppsYears } from '@/lib/data-loader';
import { getCourseTheme } from '@/lib/course-theme';
import { QS_COPYRIGHT_NOTICE, QS_NOTICE_SCOPE } from '@/lib/exam-board';
import { n5PaperVideos, higherPaperVideos, ahPaperVideos, n5AppsPaperVideos, higherAppsPaperVideos, paperSummary } from '@/lib/past-paper-videos';
import { timestampToSeconds } from '@/lib/timestamp.mjs';
import ShareWorksheet from '@/components/Explorer/ShareWorksheet';
import DataBookletSheet from '@/components/DataBookletSheet';
import MarkschemeSheet from '@/components/Explorer/MarkschemeSheet';
import type { PaperScheme } from '@/lib/generator/generators/paper-markscheme';
import DownloadFilesButton from '@/components/DownloadFilesButton';
import { decodeWorksheet, resolveWorksheet, isGenerated, questionRef } from '@/lib/worksheet-share';
import { byPaperLabel, withParentVideo, courseHasHints, variationLabel } from '@/lib/similar-questions';
import { parseGeneratedRef } from '@/lib/worksheet-refs.mjs';
import { printWorksheet, warmWorksheetImages, watchSystemPrint } from '@/lib/print-worksheet';

type Course = 'n5' | 'higher' | 'ah' | 'higher-apps' | 'n5-apps';

const COURSE_IDS: Course[] = ['n5', 'higher', 'ah', 'higher-apps', 'n5-apps'];

const courseConfig = {
  n5: {
    label: 'National 5',
    topicCategories: n5TopicCategories,
    topics: n5Topics,
    availableYears: getAvailableN5Years() as (number | string)[],
    loadQuestions: getAllN5Questions,
    singlePaper: false,
    hasDataBooklet: false,
  },
  higher: {
    label: 'Higher',
    topicCategories: higherTopicCategories,
    topics: higherTopics,
    availableYears: getAvailableHigherYears() as (number | string)[],
    loadQuestions: getAllHigherQuestions,
    singlePaper: false,
    hasDataBooklet: false,
  },
  ah: {
    label: 'Advanced Higher',
    topicCategories: ahTopicCategories,
    topics: ahTopics,
    availableYears: getAvailableAHYears() as (number | string)[],
    loadQuestions: getAllAHQuestions,
    singlePaper: false,
    hasDataBooklet: false,
  },
  'higher-apps': {
    label: 'Higher Applications',
    topicCategories: higherAppsTopicCategories,
    topics: higherAppsTopics,
    availableYears: getAvailableHigherAppsYears(),
    loadQuestions: getAllHigherAppsQuestions,
    singlePaper: true, // one paper per year — hide the paper filter
    hasDataBooklet: true,
  },
  'n5-apps': {
    label: 'N5 Applications',
    topicCategories: n5AppsTopicCategories,
    topics: n5AppsTopics,
    availableYears: getAvailableN5AppsYears() as (number | string)[],
    loadQuestions: getAllN5AppsQuestions,
    singlePaper: false,
    hasDataBooklet: false,
  },
} as const;

function ExplorerContent({ course, onChangeCourse }: { course: Course; onChangeCourse: () => void }) {
  const config = courseConfig[course];
  const theme = getCourseTheme(course);

  const [allQuestions, setAllQuestions] = useState<QuestionWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  // Generating against the current filter. National 5 only — see canGenerate.
  const [genCount, setGenCount] = useState(5);
  /** Per-topic counts, and the panel that sets them. Only used past one topic. */
  const [perTopic, setPerTopic] = useState<Record<string, number>>({});
  const [showGenPlan, setShowGenPlan] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genNote, setGenNote] = useState<string | null>(null);
  const [rerolling, setRerolling] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<(number | string)[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<number[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [viewMode, setViewMode] = useState<'browse' | 'worksheet'>('browse');
  const [showAnswersInView, setShowAnswersInView] = useState(false);
  const [showQRCodes, setShowQRCodes] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [presentStartIndex, setPresentStartIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<{videoId: string; timestamp: number; title: string} | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastMovedIndex, setLastMovedIndex] = useState<number | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [bookletYear, setBookletYear] = useState<number | string | null>(null);
  const [markschemeQ, setMarkschemeQ] = useState<QuestionWithMetadata | null>(null);
  const [showShare, setShowShare] = useState(false);
  // The markscheme table is fetched on demand; holding it here keeps the
  // portal mounted for the print and lets a second press reuse it.
  const [markschemeBusy, setMarkschemeBusy] = useState(false);
  const [schemes, setSchemes] = useState<Record<string, PaperScheme> | null>(null);

  const { items: worksheetItems, addItem, removeItem, replaceItem, clearAll, reorderItems, isInWorksheet } = useWorksheet();

  // Shown in the printed header — a pupil wants to know what the paper is worth
  const totalMarks = useMemo(
    () => worksheetItems.reduce((sum, q) => sum + (q.marks?.reduce((a, b) => a + b, 0) ?? 0), 0),
    [worksheetItems]
  );

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

  // Browse and worksheet are one page swapping content, so switching kept the
  // old scroll position. Always start at the top: on a long question list the
  // alternative is landing in the middle of the worksheet.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [viewMode]);

  /**
   * Changing the filters changes the question, so the answer starts at the top.
   *
   * The same fault as the one above, with a different trigger. Unticking a
   * topic left you wherever the browser could still scroll to, which is the end
   * of the shorter list: measured on four years of National 5, scrolled to the
   * bottom, unticking one year clamped `scrollY` from 25,136 to 19,561 — the
   * last row of a list nobody asked to be at the end of, with the questions
   * they had been reading gone from under them. Ticking one is the same problem
   * the other way round: the new questions arrive above you and are never seen.
   *
   * **`auto`, not `smooth`.** This is a twenty-thousand-pixel jump. Animating
   * it is a long ride past questions the teacher has just filtered out.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedSubtopics, selectedYears, selectedPapers]);

  // A shared link arrives as ?c=<course>&q=<refs>. Wait for the course data,
  // then add exactly those questions, in the order they were shared. Done once:
  // the query is cleared afterwards so a refresh does not re-add them on top of
  // whatever the recipient has since changed.
  useEffect(() => {
    if (!allQuestions.length) return;
    const shared = decodeWorksheet(window.location.search);
    if (!shared || shared.courseId !== course) return;

    // Clear the query first, then resolve. This effect re-runs on every render
    // — `addItem` and `clearAll` are new functions each time — and what stops
    // it doing the work twice is finding no link in the URL. That worked while
    // resolving was synchronous. It is not: a generated question has to be
    // regenerated from its seed, so a second run could start before the first
    // had finished and the sheet would be built twice.
    window.history.replaceState(null, '', window.location.pathname);

    let cancelled = false;
    resolveWorksheet(shared.refs, allQuestions).then(({ questions: incoming }) => {
      if (cancelled || !incoming.length) return;
      clearAll();
      incoming.forEach(addItem);
      setViewMode('worksheet');
    });
    return () => { cancelled = true; };
  }, [allQuestions, course, addItem, clearAll]);

  /**
   * Generate questions on the subtopics the teacher has already filtered to.
   *
   * The filter is the topic list — the Explorer and the variation registry
   * spell the website's subtopics identically, so there is nothing to map.
   *
   * National 5 only: no other course has audited variations. The engine is
   * imported here and nowhere else in this file; it is 33,000 lines and a
   * static import would put it on the browse page for every course.
   */
  const canGenerate = course === 'n5' && selectedSubtopics.length > 0;

  /**
   * How many to draw on each topic, when more than one is picked.
   *
   * A single number spread across several topics is a guess at something the
   * teacher already knows: five questions over four topics is neither one each
   * nor five each, and nothing on screen said which it would be.
   */
  /**
   * The picked subtopics, under the topic a teacher clicked to get them.
   *
   * Ticking "Surds" in the filter selects two subtopics, so a panel listing
   * bare subtopics does not obviously correspond to what was clicked. Grouping
   * makes that relationship visible rather than something to work out.
   */
  const genGroups = useMemo(() => {
    const out = new Map<string, string[]>();
    for (const s of selectedSubtopics) {
      const main = getMainTopic(s) ?? s;
      out.set(main, [...(out.get(main) ?? []), s]);
    }
    return [...out.entries()];
  }, [selectedSubtopics]);

  const groupTotal = (subs: readonly string[]) =>
    subs.reduce((n, s) => n + (perTopic[s] ?? 0), 0);

  /**
   * "Three Surds" — without having to say which kind of surds.
   *
   * Spreads across the topic's subtopics, always adding to the thinnest and
   * taking from the fattest, so three over two subtopics is 2 and 1 rather
   * than 3 and 0. The per-subtopic steppers stay for a teacher who does care
   * which kind, and the split stays visible underneath either way.
   */
  const stepGroup = (subs: readonly string[], by: number) => {
    setPerTopic(prev => {
      const out = { ...prev };
      if (by > 0) {
        const target = [...subs].sort((a, b) => (out[a] ?? 0) - (out[b] ?? 0))[0];
        if (target && (out[target] ?? 0) < 20) out[target] = (out[target] ?? 0) + 1;
      } else {
        const target = [...subs].sort((a, b) => (out[b] ?? 0) - (out[a] ?? 0))[0];
        if (target && (out[target] ?? 0) > 0) {
          const next = out[target] - 1;
          if (next === 0) delete out[target];
          else out[target] = next;
        }
      }
      return out;
    });
  };

  const stepTopic = (topic: string, by: number) => {
    setPerTopic(prev => {
      const next = Math.max(0, Math.min(20, (prev[topic] ?? 0) + by));
      const out = { ...prev };
      if (next === 0) delete out[topic];
      else out[topic] = next;
      return out;
    });
  };
  const plannedTotal = Object.values(perTopic).reduce((n, c) => n + c, 0);

  /** Draw the plan, topic by topic. */
  const handleGeneratePlan = async () => {
    if (generating || plannedTotal === 0) return;
    setGenerating(true);
    setGenNote(null);
    try {
      const { generateForSubtopics, worksheetKeys } = await import('@/lib/generated-question');
      const made: QuestionWithMetadata[] = [];
      const short: string[] = [];
      // One topic at a time — never Promise.all, and the exclude set carries
      // across topics so a variation tagged under two of them cannot be drawn
      // twice as the same question.
      for (const topic of selectedSubtopics) {
        const want = perTopic[topic] ?? 0;
        if (!want) continue;
        const got = await generateForSubtopics(
          [topic], want, worksheetKeys([...worksheetItems, ...made]));
        made.push(...got.map(q => withParentVideo(q, paperIndex)));
        if (got.length < want) short.push(`${topic} (${got.length} of ${want})`);
      }
      made.forEach(addItem);
      // Naming the topics that came up short, not just counting them: a sheet
      // quietly missing three questions with nothing saying which topic is the
      // failure worth avoiding.
      setGenNote(
        !made.length ? 'No new questions could be made for those topics.'
          : short.length ? `Added ${made.length}. Short on ${short.join(', ')}.`
            : `Added ${made.length} to your worksheet.`);
      setShowGenPlan(false);
    } catch {
      setGenNote('Something went wrong generating those.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate || generating) return;
    setGenerating(true);
    setGenNote(null);
    try {
      const { generateForSubtopics, worksheetKeys } = await import('@/lib/generated-question');
      // Excluding what the sheet already holds. The engine dedupes within one
      // call and remembers nothing between them, so without this a second
      // click repeats the first — measured even on a wide filter, where three
      // clicks of five on surds returned one question twice.
      const made = await generateForSubtopics(
        selectedSubtopics, genCount, worksheetKeys(worksheetItems));
      made.map(q => withParentVideo(q, paperIndex)).forEach(addItem);
      if (!made.length) {
        // With the sheet excluded, nothing back usually means the teacher
        // already has them all rather than that the filter is barren.
        setGenNote(worksheetItems.length
          ? 'Your worksheet already has every question these topics can make.'
          : 'No new questions could be made for this filter.');
      } else if (made.length < genCount) {
        // Short is legitimate — a thin variation cannot make more DIFFERENT
        // questions — but it must be said, or the sheet is quietly short and
        // nothing names the topic that did it.
        setGenNote(
          `Added ${made.length}. These topics cannot make ${genCount} different questions.`);
      } else {
        setGenNote(`Added ${made.length} to your worksheet.`);
      }
    } catch {
      setGenNote('Something went wrong generating those.');
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Print the marking instructions for this sheet, as their own document.
   *
   * The table is 189 KB and is fetched here rather than imported, so it
   * arrives when a teacher asks for it and never on the way to anything else.
   * Nothing a pupil can reach imports it at all — that is the whole of how
   * "never on a shared sheet" is enforced, and `paper-markscheme.ts` in the
   * generator's checks fails if a pupil-facing file ever learns to.
   *
   * `data-print` on the body is what makes this a second document rather than
   * more pages on the first: one CSS rule hides everything that is not the
   * markscheme, and the sheet is portaled to the body so that rule cannot be
   * broken by rearranging the worksheet.
   *
   * The attribute is cleared in `finally`. Leaving it set would mean the next
   * Print / Save PDF silently produced the markscheme instead of the paper,
   * which is the one failure here that hands a class the answers.
   */
  const handlePrintMarkscheme = async () => {
    if (markschemeBusy || !worksheetItems.length) return;
    setMarkschemeBusy(true);
    try {
      const { PAPER_MARKSCHEME } = await import('@/lib/generator/generators/paper-markscheme');
      setSchemes(PAPER_MARKSCHEME);
      document.body.dataset.print = 'markscheme';
      // One frame for the portal to mount before the print dialog reads the
      // page. Raced, never awaited alone: a backgrounded tab fires no frame,
      // and the same unguarded wait once turned a Print button into a button
      // that did nothing at all.
      await Promise.race([
        new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
        new Promise<void>(r => setTimeout(r, 300)),
      ]);
      await printWorksheet();
    } finally {
      delete document.body.dataset.print;
      setMarkschemeBusy(false);
    }
  };

  /** Re-roll one generated question: same variation, new numbers. */
  const handleReroll = async (q: QuestionWithMetadata) => {
    const gen = parseGeneratedRef(questionRef(q));
    if (!gen || rerolling) return;
    setRerolling(q.uid ?? null);
    try {
      const { questionFromCode, newSeed } = await import('@/lib/generated-question');
      /**
       * **`gen.parentIndex`, and then the video.** Both were missing, and each
       * broke something a teacher could see.
       *
       * Without the parent index the new question falls back to `basedOn[0]`,
       * so re-rolling could quietly move the worked example to a different
       * year's paper from the one it pointed at a moment earlier.
       *
       * Without `withParentVideo` it carries no `videoId` at all: the QR code
       * vanished off the printed sheet, and the presenter and focus mode both
       * fell back to "Video solution coming soon" on a question whose tutorial
       * exists. `resolveWorksheet` does both, which is exactly why a shared
       * sheet was right and the sheet it was shared from was not.
       */
      const raw = await questionFromCode(gen.code, newSeed(), q.questionIndex, gen.parentIndex);
      const fresh = raw ? withParentVideo(raw, paperIndex) : null;
      // In place: a teacher re-rolling question 3 expects a new question 3, not
      // the sheet reordered.
      if (fresh) replaceItem(q, fresh);
    } finally {
      setRerolling(null);
    }
  };

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

  // Diagrams are lazy, and a lazy image that never scrolled into view prints
  // blank — WebKit does not force them in the way Chromium does. Warm the
  // sheet's own images whenever it changes; the browse grid is left alone, so
  // filtering a course full of diagrams is unaffected.
  useEffect(() => {
    if (worksheetItems.length) warmWorksheetImages();
  }, [worksheetItems]);

  // Cmd-P and the browser's own menu bypass the Print button entirely.
  useEffect(() => watchSystemPrint(), []);

  // Filter questions based on selections
  const filteredQuestions = useMemo(
    () => filterQuestions(allQuestions, selectedSubtopics, selectedYears, selectedPapers),
    [allQuestions, selectedSubtopics, selectedYears, selectedPapers]
  );

  /**
   * How many of the filtered questions can be cloned.
   *
   * Only a National 5 question with a printed paper badge has variations
   * modelled on it. The count goes in the button so it promises what it can
   * deliver rather than "a variation of each" and then quietly fewer.
   */
  const variableCount = useMemo(
    () => courseHasHints(course)
      ? filteredQuestions.filter(q => variationLabel(q.question)).length
      : 0,
    [course, filteredQuestions],
  );
  const canVaryEach = variableCount > 0;

  /** One new question for each filtered question, in the order they are shown. */
  const handleVaryEach = async () => {
    if (!canVaryEach || generating) return;
    setGenerating(true);
    setGenNote(null);
    try {
      const { similarTo, worksheetKeys } = await import('@/lib/generated-question');
      const made: QuestionWithMetadata[] = [];
      // Sequentially, and the exclude set grows as it goes: two questions
      // backed by the same variation must not come back as the same question.
      for (const q of filteredQuestions) {
        const label = variationLabel(q.question);
        if (!label) continue;
        const [raw] = await similarTo(label, 1, worksheetKeys([...worksheetItems, ...made]));
        if (raw) made.push(withParentVideo(raw, paperIndex));
      }
      made.forEach(addItem);
      setGenNote(made.length === variableCount
        ? `Added ${made.length} new questions, one like each.`
        : made.length
          ? `Added ${made.length} of ${variableCount}. The rest had nothing new left to give.`
          : 'Your worksheet already has a variation of each of these.');
    } catch {
      setGenNote('Something went wrong generating those.');
    } finally {
      setGenerating(false);
    }
  };

  // Are filters active?
  const hasFilters = selectedSubtopics.length > 0 || selectedYears.length > 0 || selectedPapers.length > 0;

  // Past paper questions by their printed label, so a generated question can
  // borrow the video of the one it was modelled on. Built from every question
  // in the course, not the filtered set: the paper behind a variation is often
  // not one the current filter shows.
  const paperIndex = useMemo(() => byPaperLabel(allQuestions), [allQuestions]);

  // Filter helpers
  const clearAllFilters = () => {
    setSelectedSubtopics([]);
    setSelectedYears([]);
    setSelectedPapers([]);
  };

  const removeYear = (year: number | string) => {
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
    theme,
    showPaperFilter: !config.singlePaper,
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
          <div className={`w-8 h-8 border-2 ${theme.border} border-t-transparent rounded-full animate-spin mx-auto mb-4`} />
          <p className="text-muted-foreground">Loading {config.label} questions...</p>
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
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-background">
            <div className="flex-1 overflow-y-auto [&>aside]:w-full [&>aside]:border-r-0 [&>aside]:min-h-0 [&>aside]:h-auto [&>aside]:sticky-none [&>aside]:relative">
              <FilterSidebar {...filterSidebarProps} />
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setShowMobileFilters(false)}
                className={`w-full py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
              >
                Show {hasFilters ? filteredQuestions.length : allQuestions.length} questions
              </button>
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground-2 rounded-lg hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Main Content */}
        {/* **`min-w-0`, or a flex item cannot shrink below its content.**
            The default is `min-width: auto`, so one unwrappable child pushes
            `main` — and the document — past the viewport, and a phone browser
            answers that by scaling the entire page down. That is a whole class
            of fault rather than one control's mistake, so it is fixed here as
            well as in the control that triggered it. */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 no-print">
            {/* **The way back to the course.** This page had none: no
                breadcrumb, no CourseTabs, and the only course affordance was a
                chip and "Change Course" — which changes the course rather than
                leaving it. `docs/navigation.md` records the same thing as
                "/explorer has no breadcrumb and no course identity".

                `flex-wrap`, because this row now holds three things and a phone
                is 320px. A row here that cannot wrap pushes `main` past the
                viewport, which is the fault the comment above this block is
                about.

                The arrow belongs to the back link. "Change Course" had it and
                does not go back anywhere, so two controls were sharing one
                meaning. */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Link
                href={`/course/${course}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground-2 hover:text-accent bg-muted/50 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                Back to {config.label}
              </Link>
              <button
                onClick={onChangeCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
              >
                Change Course
              </button>
              <span className={`px-2.5 py-1 ${theme.tint} ${theme.text} text-xs font-semibold rounded-full uppercase tracking-wide`}>
                {config.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Topic Explorer</h1>
            <p className="text-muted-foreground">
              Use filters to find questions, then add them to build a custom worksheet.
            </p>
          </div>

          {/* Tabs */}
          <div className="no-print flex items-center gap-1 mb-6 border-b border-border sticky top-16 z-20 bg-background/90 backdrop-blur-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <button
              onClick={() => setViewMode('browse')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'browse'
                  ? `${theme.border} ${theme.text}`
                  : 'border-transparent text-muted-foreground hover:text-foreground-2'
              }`}
            >
              <Search className="h-4 w-4" />
              Browse Questions
            </button>
            <button
              onClick={() => setViewMode('worksheet')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'worksheet'
                  ? `${theme.border} ${theme.text}`
                  : 'border-transparent text-muted-foreground hover:text-foreground-2'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              My Worksheet
              {worksheetItems.length > 0 && (
                <span className={`px-2 py-0.5 ${theme.tint} ${theme.text} text-xs rounded-full`}>
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
                className="lg:hidden flex items-center gap-2 mb-6 px-4 py-2 bg-muted rounded-lg text-foreground-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <span className={`ml-1 px-2 py-0.5 ${theme.tint} ${theme.text} text-xs rounded-full`}>
                    {selectedSubtopics.length + selectedYears.length + selectedPapers.length}
                  </span>
                )}
              </button>

              {/* Active Filters Bar */}
              {hasFilters && (
                <div className="mb-4 p-3 bg-card/95 border border-border rounded-lg sticky top-[7.5rem] z-[9] backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      <span className={`${theme.text} font-medium`}>{filteredQuestions.length}</span> of {allQuestions.length} questions
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-red-700 dark:text-red-400 hover:bg-red-400/10 rounded transition-colors"
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
                        className="shrink-0 px-2.5 py-1 bg-cyan-600/20 text-cyan-800 dark:text-cyan-400 text-xs rounded-full flex items-center gap-1.5 hover:bg-cyan-600/30 transition-colors"
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
                        className="shrink-0 px-2.5 py-1 bg-amber-600/20 text-amber-800 dark:text-amber-400 text-xs rounded-full flex items-center gap-1.5 hover:bg-amber-600/30 transition-colors"
                      >
                        Paper {paper}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {/* Topic chips - course colour */}
                    {selectedSubtopics.map((subtopic) => (
                      <button
                        key={`af-topic-${subtopic}`}
                        onClick={() => removeSubtopic(subtopic)}
                        className={`shrink-0 px-2.5 py-1 ${theme.tint} ${theme.text} text-xs rounded-full flex items-center gap-1.5 hover:bg-foreground/10 transition-colors`}
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
                  <BookOpen className="h-16 w-16 mx-auto text-muted-faint mb-4" />
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">
                    Build Your Worksheet
                  </h3>
                  <p className="text-muted-dim max-w-md mx-auto mb-6">
                    Use the filters to find questions by topic and year.
                    Click &quot;+ Add&quot; on any question to add it to your worksheet.
                  </p>
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className={`lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                  >
                    <Filter className="h-4 w-4" />
                    Open Filters
                  </button>
                </div>
              )}

              {/* Add All / Remove All, and the generate controls.

                  **flex-wrap, because this row grew.** Four controls and a
                  count do not fit on a 390px phone, and without wrapping the
                  row demands its full width — which `main` could not refuse,
                  so the document went 473px wide on a 390px screen and the
                  browser shrank the whole page to fit. Measured: adding two
                  controls here took the Explorer from 390 to 473. */}
              {hasFilters && filteredQuestions.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-3">
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
                        ? 'bg-muted text-muted-foreground hover:bg-muted-hover'
                        : `${theme.tint} ${theme.text} hover:bg-foreground/10`
                    }`}
                  >
                    {filteredQuestions.every(q => isInWorksheet(q))
                      ? `Remove all ${filteredQuestions.length} from worksheet`
                      : `Add all ${filteredQuestions.length} to worksheet`
                    }
                  </button>

                  {/* One new question modelled on each question in the filter.
                      Distinct from "Add all": that gives a teacher the real
                      paper questions, this gives a parallel set nobody has seen.
                      Only the ones with a paper label can be cloned, so the
                      count says how many that is rather than promising all. */}
                  {canVaryEach && (
                    <button
                      onClick={handleVaryEach}
                      disabled={generating}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
                    >
                      {generating
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Dices className="h-4 w-4" />}
                      {generating ? 'Generating…' : `Add a variation of each (${variableCount})`}
                    </button>
                  )}

                  {/* Generate on the filter already set. National 5 only —
                      absent elsewhere rather than disabled. */}
                  {canGenerate && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-faint">|</span>
                      <button
                        onClick={() => selectedSubtopics.length > 1
                          ? setShowGenPlan(v => !v)
                          : handleGenerate()}
                        disabled={generating}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
                      >
                        {generating
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Dices className="h-4 w-4" />}
                        {generating
                          ? 'Generating…'
                          : selectedSubtopics.length > 1
                            /* **With several topics picked, ask before drawing.**
                               A flat count spread across them is a guess at
                               something the teacher already knows — five
                               questions over four topics is not one each and
                               not five each, and nothing says which. */
                            ? `Generate new on ${genGroups.length} ${genGroups.length === 1 ? 'topic' : 'topics'}…`
                            : `Generate ${genCount} new on this topic`}
                      </button>
                      {selectedSubtopics.length <= 1 && (
                        <>
                          <label className="sr-only" htmlFor="gen-count">How many to generate</label>
                          <select
                            id="gen-count"
                            value={genCount}
                            onChange={e => setGenCount(Number(e.target.value))}
                            className="bg-muted text-foreground-2 text-sm rounded px-2 py-1.5 border border-muted"
                          >
                            {[3, 5, 10, 15, 20].map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  )}

                  {/* **Not inside `canGenerate`.** This went where the topic
                      controls are and inherited their gate, so filtering by
                      year alone hid the one link on the site to the by-skill
                      builder — a page that does not care what the filter is.
                      It is also no longer a `text-xs` underline: it was the
                      quietest thing in a toolbar of buttons, and it is the door
                      to the more capable of the two ways to build a sheet. */}
                  {courseHasHints(course) && (
                    <a
                      href={`/course/${course}/generate`}
                      title="Choose exact skills — Adding Mixed Numbers rather than Fractions — and how many of each"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground-2 hover:bg-muted-hover transition-colors"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Build by skill
                    </a>
                  )}
                </div>
              )}

              {/* How many of each, when more than one topic is picked. */}
              {showGenPlan && canGenerate && selectedSubtopics.length > 1 && (
                <div className="mt-3 rounded-xl border border-border bg-card/60 p-4">
                  <p className="text-sm text-foreground-2">
                    How many new questions on each?
                  </p>
                  {/* Say what the numbers count. A teacher who ticked "Surds"
                      got two rows out of it, and the panel should explain that
                      rather than leave it to be inferred. */}
                  <p className="text-xs text-muted-foreground mb-3">
                    Set a whole topic, or the kinds under it.
                  </p>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {genGroups.map(([main, subs]) => (
                      <div key={main}>
                        {/* The topic a teacher actually clicked. Its stepper
                            spreads across the kinds beneath it. */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
                            {main}
                            {subs.length > 1 && (
                              <span className="text-muted-dim font-normal"> · {subs.length} kinds</span>
                            )}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => stepGroup(subs, -1)}
                              aria-label={`One fewer ${main}`}
                              className="w-7 h-7 rounded bg-muted text-foreground-2 hover:bg-muted-hover transition-colors"
                            >
                              −
                            </button>
                            <span className={`w-7 text-center text-sm tabular-nums font-medium ${
                              groupTotal(subs) > 0 ? theme.text : 'text-muted-dim'
                            }`}>
                              {groupTotal(subs)}
                            </span>
                            <button
                              onClick={() => stepGroup(subs, 1)}
                              aria-label={`One more ${main}`}
                              className="w-7 h-7 rounded bg-muted text-foreground-2 hover:bg-muted-hover transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* The kinds, only where there is more than one — a
                            topic with a single subtopic would show the same
                            number twice for no reason. */}
                        {subs.length > 1 && (
                          <div className="mt-1 space-y-1 pl-4 border-l border-border">
                            {subs.map(topic => (
                              <div key={topic} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
                                  {topic}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => stepTopic(topic, -1)}
                                    aria-label={`One fewer ${topic}`}
                                    className="w-6 h-6 rounded bg-muted text-muted-foreground hover:bg-muted-hover transition-colors text-xs"
                                  >
                                    −
                                  </button>
                                  <span className="w-6 text-center text-xs tabular-nums text-foreground-2">
                                    {perTopic[topic] ?? 0}
                                  </span>
                                  <button
                                    onClick={() => stepTopic(topic, 1)}
                                    aria-label={`One more ${topic}`}
                                    className="w-6 h-6 rounded bg-muted text-muted-foreground hover:bg-muted-hover transition-colors text-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handleGeneratePlan}
                      disabled={generating || plannedTotal === 0}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
                    >
                      {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Dices className="h-4 w-4" />}
                      {plannedTotal > 0 ? `Generate ${plannedTotal}` : 'Pick some'}
                    </button>
                    <button
                      onClick={() => setShowGenPlan(false)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted-hover transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {genNote && (
                <p className="mb-4 text-sm text-muted-foreground">{genNote}</p>
              )}

              {/* Questions Grid - Only Show When Filters Active.
                  Column count follows a minimum card width rather than a set of
                  breakpoints — `.browse-grid` in globals.css says why, and what
                  it deliberately leaves alone below 1280px. */}
              {hasFilters && filteredQuestions.length > 0 && (
                <div className="browse-grid">
                  {filteredQuestions.map((q) => (
                    <QuestionCard
                      key={`${q.year}-${q.paperNumber}-${q.questionIndex}`}
                      theme={theme}
                      courseId={course}
                      paperIndex={paperIndex}
                      hasDataBooklet={config.hasDataBooklet}
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
                  <Filter className="h-12 w-12 mx-auto text-muted-faint opacity-50 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No questions found
                  </h3>
                  <p className="text-muted-dim">
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
                  <ClipboardList className="h-16 w-16 mx-auto text-muted-faint mb-4" />
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">
                    Your Worksheet is Empty
                  </h3>
                  <p className="text-muted-dim max-w-md mx-auto mb-6">
                    Switch to &quot;Browse Questions&quot; and use the filters to find questions.
                    Click &quot;+ Add&quot; to build your worksheet.
                  </p>
                  <button
                    onClick={() => setViewMode('browse')}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                  >
                    <Search className="h-4 w-4" />
                    Browse Questions
                  </button>
                </div>
              ) : (
                <>
                  {/* Worksheet Toolbar — sticky on desktop */}
                  <div className="mb-6 space-y-3 no-print hidden lg:block lg:sticky lg:top-28 z-10 bg-background/90 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <p className="text-muted-foreground text-sm">
                          {worksheetItems.length} {worksheetItems.length === 1 ? 'question' : 'questions'}
                        </p>
                        <button
                          onClick={handleClearAll}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            showClearConfirm
                              ? 'bg-red-600 hover:bg-red-500 text-white'
                              : 'bg-red-600/10 text-red-700 dark:text-red-400 hover:bg-red-600/20'
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
                            className={`w-4 h-4 rounded border-muted bg-muted ${theme.text} focus:ring-foreground/30`}
                          />
                          <span className="text-sm text-muted-foreground">Show answers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showQRCodes}
                            onChange={(e) => setShowQRCodes(e.target.checked)}
                            className={`w-4 h-4 rounded border-muted bg-muted ${theme.text} focus:ring-foreground/30`}
                          />
                          <span className="text-sm text-muted-foreground">QR codes</span>
                        </label>
                        {courseHasHints(course) && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showHints}
                            onChange={(e) => setShowHints(e.target.checked)}
                            className={`w-4 h-4 rounded border-muted bg-muted ${theme.text} focus:ring-foreground/30`}
                          />
                          <span className="text-sm text-muted-foreground">Hints</span>
                        </label>
                        )}
                        <button
                          onClick={() => setPresentStartIndex(0)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted-hover text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Maximize2 className="h-4 w-4" />
                          Present
                        </button>
                        <button
                          onClick={() => setShowFocusMode(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted-hover text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          Focus
                        </button>
                        <button
                          onClick={() => setShowShare(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted-hover text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                        <DownloadFilesButton
                          questions={worksheetItems}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted-hover disabled:opacity-60 text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                        />
                        {/* A teacher's own checkout, so the markscheme lives
                            here and only here. It is a separate button and a
                            separate document on purpose: one click, one
                            dialog, one file, so the paper can be handed to a
                            class without the answers stapled behind it. */}
                        <button
                          onClick={handlePrintMarkscheme}
                          disabled={markschemeBusy}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted-hover disabled:opacity-60 text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                          title="Print the marking instructions for this worksheet"
                        >
                          <ClipboardCheck className="h-4 w-4" />
                          {markschemeBusy ? 'Preparing…' : 'Markscheme'}
                        </button>
                        <button
                          onClick={() => printWorksheet()}
                          className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg text-sm font-medium transition-all`}
                        >
                          <Printer className="h-4 w-4" />
                          Print / Save PDF
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-dim">
                      Tip: Use the arrows to reorder questions. Toggle answers and QR codes to control what appears in your print/PDF.
                    </p>
                  </div>

                  {/* Print-only header (hidden on screen) */}
                  <div className="print-only print-header">
                    <div className="flex justify-between items-end mb-2">
                      <h1 className="text-2xl font-bold">Clelland Maths <span className="font-normal text-gray-500">{config.label} Worksheet</span></h1>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        <div className="text-sm font-medium">
                          {worksheetItems.length} question{worksheetItems.length === 1 ? '' : 's'}
                          {totalMarks > 0 && <> &middot; {totalMarks} marks</>}
                        </div>
                      </div>
                    </div>
                    {/* A printed worksheet gets passed around a classroom, so
                        say plainly what this is and where it came from. */}
                    <p className="print-strapline">
                      Free Qualifications Scotland maths revision — past papers, video solutions and course notes at{' '}
                      <strong>clellandmaths.com</strong>
                    </p>
                  </div>

                  {/* Formulae list — printed at the front, as on a real paper.
                      Hidden on screen; the Formulae button covers that. */}
                  <div className="print-only">
                    <FormulaeSheet courseId={course} />

                    {/* The markscheme, once a teacher has asked for it. It
                        portals itself to the body and shows only while the
                        markscheme is printing, so it is never on screen and
                        never in the paper's print job. */}
                    {schemes && (
                      <MarkschemeSheet
                        courseId={course}
                        courseLabel={config.label}
                        questions={worksheetItems}
                        schemes={schemes}
                        totalMarks={totalMarks}
                      />
                    )}
                    {course === 'higher-apps' && (
                      <DataBookletSheet years={worksheetItems.map(q => q.year)} />
                    )}
                  </div>

                  {/* Worksheet Questions - Linear List View */}
                  <div className="space-y-6 max-w-4xl worksheet-container pb-20 lg:pb-0">
                    {worksheetItems.map((q, index) => (
                      <div
                        key={`ws-${q.year}-${q.paperNumber}-${q.questionIndex}`}
                        className={`worksheet-question bg-card border border-border rounded-xl p-4 sm:p-6${index === lastMovedIndex ? ' card-just-moved' : ''}`}
                      >
                        {/* **One wrapping row, and the controls pinned to the top.**

                            This is the layout that is live, and it is right:
                            number, reference, topics and marks read left to
                            right on one line, and the question starts under
                            them. It wraps only when the words genuinely do not
                            fit.

                            It had drifted twice. First into two rows, to stop
                            the reorder buttons sitting at the vertical middle
                            of however tall the chips were — but `items-start`
                            pins them to the top without costing a line, which
                            is what it does here. Then the chip row was given
                            `basis-full` to fix a phone, which forced the second
                            line at **every** width and on paper: a printed
                            sheet pushed every question down by a row it did not
                            need.

                            `flex-wrap` is the whole responsive story. At 320px
                            the chips fall to a second line because they do not
                            fit, which is honest; at any width that holds them
                            they stay on the first, which is what print gets.
                            No breakpoint, no indent, nothing to keep in step
                            with a device. */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                            <span className={`q-badge flex items-center justify-center w-8 h-8 shrink-0 ${theme.tint} ${theme.text} text-sm font-bold rounded-full`}>
                              {index + 1}
                            </span>
                            {/* A generated question has no paper, so building
                                the caption from year and paper number reads
                                " Paper 0 Q1". `label` is what it carries
                                instead — the skill it practises. */}
                            <span className="text-sm text-muted-dim">
                              {isGenerated(q)
                                ? q.label
                                : `${q.year} Paper ${q.paperNumber} Q${q.questionNumber}`}
                            </span>
                            {isGenerated(q) && (
                              <span className={`q-source px-2 py-1 ${theme.tint} ${theme.text} text-xs font-medium rounded`}>
                                New question
                              </span>
                            )}
                            {q.topics?.slice(0, 2).map((topic) => (
                              <span
                                key={topic}
                                className="topic-tag px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded"
                              >
                                {topic}
                              </span>
                            ))}
                            {/* `@media print` sets `margin-left: auto` on
                                `.q-marks`, so a printed sheet keeps the exam
                                paper's own convention of marks hard right. */}
                            <Marks marks={q.marks} theme={theme} className="q-marks" />
                          </div>
                          {/* Reorder buttons — compact horizontal */}
                          <div className="no-print flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => handleReorder(index, 0)}
                              disabled={index === 0}
                              className="hidden lg:block p-1 text-muted-dim hover:text-foreground-2 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move to top"
                            >
                              <ChevronsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(index, index - 1)}
                              disabled={index === 0}
                              className="p-3 lg:p-1 text-muted-dim hover:text-foreground-2 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <ChevronUp className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(index, index + 1)}
                              disabled={index === worksheetItems.length - 1}
                              className="p-3 lg:p-1 text-muted-dim hover:text-foreground-2 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <ChevronDown className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(index, worksheetItems.length - 1)}
                              disabled={index === worksheetItems.length - 1}
                              className="hidden lg:block p-1 text-muted-dim hover:text-foreground-2 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Move to bottom"
                            >
                              <ChevronsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {/* Same question, new numbers. Generated items only:
                               a past paper question is a fixed historical
                               document and there is nothing to re-roll. */}
                          {isGenerated(q) && (
                            <button
                              onClick={() => handleReroll(q)}
                              disabled={rerolling !== null}
                              className="no-print shrink-0 p-1.5 text-muted-dim hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
                              title="New numbers for this question"
                              aria-label="New numbers for this question"
                            >
                              {rerolling === q.uid
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Dices className="h-4 w-4" />}
                            </button>
                          )}
                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(q)}
                            className="no-print shrink-0 p-1.5 text-muted-dim hover:text-red-700 dark:text-red-400 rounded-lg hover:bg-muted transition-colors"
                            title="Remove from worksheet"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {showQRCodes && q.videoId && (
                            <div className="shrink-0 flex items-center gap-1.5">
                              {/* Beside the code rather than beneath it — see
                                  the note in app/worksheet/page.tsx. */}
                              {q.videoOf && (
                                <span className="q-qr-note text-[9px] leading-tight text-muted-dim text-right max-w-[52px]">
                                  worked example<br />{q.videoOf}
                                </span>
                              )}
                              <QRCodeImage
                                url={`https://www.youtube.com/watch?v=${q.videoId}&t=${timestampToSeconds(q.timestamp)}`}
                                size={64}
                                className="rounded"
                              />
                            </div>
                          )}
                        </div>

                        <MathRenderer
                          html={q.question}
                          className="text-foreground-2 question-content text-lg leading-relaxed"
                        />

                        {/* Higher Apps data files — needed to attempt the question */}
                        {q.attachments && q.attachments.length > 0 && (
                          <div className="no-print flex flex-wrap gap-2 mt-4">
                            {q.attachments.map((file) => (
                              <a
                                key={file.url}
                                href={file.url}
                                download
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-xs font-medium transition-colors`}
                              >
                                <Paperclip className="h-3 w-3" />
                                {file.name}
                              </a>
                            ))}
                          </div>
                        )}

                        {showHints && (
                          <Hints question={q} theme={theme} courseId={course} className="mt-4" />
                        )}

                        {showAnswersInView && (
                          <div className="answer-section mt-4 pt-4 border-t border-border">
                            <p className={`answer-label text-sm font-medium ${theme.text} mb-2`}>Answer:</p>
                            <MathRenderer
                              html={q.answer}
                              className="text-foreground-2 answer-content"
                            />
                          </div>
                        )}

                        {/* Watch Solution + Present from here (hidden on print) */}
                        <div className="no-print flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <button
                            onClick={() => setPresentStartIndex(index)}
                            className="text-xs text-muted-dim hover:text-foreground-2 transition-colors"
                          >
                            <Maximize2 className="h-3.5 w-3.5 inline mr-1" />
                            {/* Short at the floor, full where there is room.
                                Four words competing with Formulae and Watch
                                Solution on one row broke one word per line at
                                320px — four lines for a secondary link beside a
                                two-line question. Adding words as the screen
                                allows is the right way round; see the trap in
                                docs/responsive.md about hiding them instead. */}
                            <span className="sm:hidden">Full screen</span>
                            <span className="hidden sm:inline">Full screen from here</span>
                          </button>
                          <div className="flex items-center gap-2">
                            {config.hasDataBooklet && (
                              <button
                                onClick={() => setBookletYear(q.year)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 ${theme.text} hover:opacity-80 rounded-lg text-sm font-medium transition-opacity`}
                              >
                                <BookOpen className="h-4 w-4" />
                                Data Booklet
                              </button>
                            )}
                            {/* Renders nothing for Higher Apps — that course
                                sits the exam with the booklet, not a formulae list */}
                            <FormulaeButton
                              courseId={course}
                              theme={theme}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 ${theme.text} hover:opacity-80 rounded-lg text-sm font-medium transition-opacity`}
                            />
                            {q.videoId ? (
                              <button
                                onClick={() => setActiveVideo({
                                  videoId: q.videoId,
                                  timestamp: timestampToSeconds(q.timestamp),
                                  title: `${q.year} Paper ${q.paperNumber} Q${q.questionNumber}`
                                })}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors`}
                              >
                                <Play className="h-4 w-4" />
                                <span className="sm:hidden">
                                  {q.videoOf ? 'Worked example' : 'Solution'}
                                </span>
                                <span className="hidden sm:inline">
                                  {q.videoOf ? 'Watch a worked example' : 'Watch Solution'}
                                </span>
                              </button>
                            ) : hasMarkscheme(q.year, q.paperNumber) && (
                              <button
                                onClick={() => setMarkschemeQ(q)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors`}
                              >
                                <ClipboardCheck className="h-4 w-4" />
                                Markscheme
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Print-only footer */}
                  <div className="print-only print-footer">
                    <p>
                      Created with <strong>Clelland Maths</strong> &mdash; free Qualifications Scotland maths revision,
                      past papers and video solutions at <strong>clellandmaths.com</strong>
                    </p>
                    {/* Only when a past paper question is actually on the
                        sheet — see the note in app/worksheet/page.tsx. */}
                    {worksheetItems.some(q => !isGenerated(q)) && (
                      <p className="print-notice">{QS_NOTICE_SCOPE} {QS_COPYRIGHT_NOTICE}</p>
                    )}
                  </div>

                  {/* Mobile bottom action bar — always visible on scroll */}
                  <div className="fixed bottom-0 left-0 right-0 lg:hidden no-print z-10 bg-background/90 backdrop-blur-sm border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showAnswersInView}
                            onChange={(e) => setShowAnswersInView(e.target.checked)}
                            className={`w-4 h-4 rounded border-muted bg-muted ${theme.text} focus:ring-foreground/30`}
                          />
                          <span className="text-sm text-muted-foreground">Answers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showQRCodes}
                            onChange={(e) => setShowQRCodes(e.target.checked)}
                            className={`w-4 h-4 rounded border-muted bg-muted ${theme.text} focus:ring-foreground/30`}
                          />
                          <span className="text-sm text-muted-foreground">QR</span>
                        </label>
                        {/* **Hints belong here too.** The toolbar that carries
                            this toggle is `hidden lg:block`, so below 1024px —
                            every phone, and most tablets — there was no way to
                            turn hints on in the worksheet at all. Full screen
                            and focus mode both offer them at any width, and a
                            sheet someone is sitting and working through is
                            exactly where they would want them. */}
                        {courseHasHints(course) && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showHints}
                              onChange={(e) => setShowHints(e.target.checked)}
                              className={`w-4 h-4 rounded border-muted bg-muted ${theme.text} focus:ring-foreground/30`}
                            />
                            <span className="text-sm text-muted-foreground">Hints</span>
                          </label>
                        )}
                      </div>
                      <button
                        onClick={handleClearAll}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          showClearConfirm
                            ? 'bg-red-600 text-white'
                            : 'text-red-700 dark:text-red-400/70 hover:text-red-700 dark:text-red-400'
                        }`}
                      >
                        <Trash2 className="h-3 w-3" />
                        {showClearConfirm ? 'Confirm?' : 'Clear all'}
                      </button>
                    </div>
                    {/* Share and the data files were only ever in the desktop
                        toolbar, which is `hidden lg:block` — so on a phone a
                        finished worksheet could not be shared at all, and
                        Higher Apps pupils could not get the spreadsheets. Both
                        belong here: sharing a sheet to a class group chat is a
                        phone job more than a desktop one. */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => setPresentStartIndex(0)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-muted hover:bg-muted-hover text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Present
                      </button>
                      <button
                        onClick={() => setShowFocusMode(true)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-muted hover:bg-muted-hover text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        Focus
                      </button>
                      <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-muted hover:bg-muted-hover text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                      <DownloadFilesButton
                        questions={worksheetItems}
                        className="flex items-center gap-2 px-3 py-2.5 bg-muted hover:bg-muted-hover disabled:opacity-60 text-foreground-2 rounded-lg text-sm font-medium transition-colors"
                      />
                      <button
                        onClick={() => printWorksheet()}
                        className={`flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg text-sm font-medium transition-all`}
                      >
                        <Printer className="h-4 w-4" />
                        Print
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
          <WorksheetFAB theme={theme} onClick={() => setViewMode('worksheet')} />
        </div>
      )}

      {/* Worksheet Drawer */}
      <WorksheetDrawer
        theme={theme}
        isOpen={showWorksheet}
        onClose={() => setShowWorksheet(false)}
        onViewOnWeb={() => {
          setShowWorksheet(false);
          setViewMode('worksheet');
        }}
      />

      {/* Full-screen Presentation Mode */}
      {showShare && worksheetItems.length > 0 && (
        <ShareWorksheet
          theme={theme}
          courseId={course}
          questions={worksheetItems}
          onClose={() => setShowShare(false)}
        />
      )}

      {presentStartIndex !== null && worksheetItems.length > 0 && (
        <QuestionPresenter
          theme={theme}
          courseId={course}
          hasDataBooklet={config.hasDataBooklet}
          questions={worksheetItems}
          startIndex={presentStartIndex}
          /* Not here. This page already offers "another like this one" three
             ways — Variation on every card, Add a variation of each, and
             Generate new on N topics — and all three put the question ON the
             sheet. A twin drawn inside a full-screen mode would be the only one
             that vanishes when the mode closes, which on the one surface built
             for assembling a worksheet reads as a bug rather than a feature.
             Every other caller takes the default. */
          allowAnother={false}
          onClose={() => setPresentStartIndex(null)}
        />
      )}

      {/* Full-screen Focus Mode */}
      {showFocusMode && worksheetItems.length > 0 && (
        <FocusMode
          theme={theme}
          courseId={course}
          hasDataBooklet={config.hasDataBooklet}
          questions={worksheetItems}
          /* See the presenter above: this page's own controls do it better. */
          allowAnother={false}
          onClose={() => setShowFocusMode(false)}
        />
      )}

      {/* AH marking instructions for no-video questions */}
      {markschemeQ && (
        <MarkschemeModal
          theme={theme}
          year={markschemeQ.year}
          paperNumber={markschemeQ.paperNumber}
          questionHtml={markschemeQ.question}
          title={`${markschemeQ.year} Paper ${markschemeQ.paperNumber} Q${markschemeQ.questionNumber}`}
          onClose={() => setMarkschemeQ(null)}
        />
      )}

      {/* Data booklet for worksheet view (Higher Apps) */}
      {bookletYear !== null && (
        <DataBookletModal
          year={bookletYear}
          theme={theme}
          onClose={() => setBookletYear(null)}
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
  // Counted from the paper registry, not typed. Every one of these was stale
  // after the 2026 diet went in — N5 said 10 papers when it has 22, and AH
  // advertised more questions than it actually has.
  { id: 'n5', name: 'National 5', subtitle: paperSummary(n5PaperVideos) },
  { id: 'higher', name: 'Higher', subtitle: paperSummary(higherPaperVideos) },
  { id: 'ah', name: 'Advanced Higher', subtitle: paperSummary(ahPaperVideos) },
  { id: 'n5-apps', name: 'N5 Applications', subtitle: paperSummary(n5AppsPaperVideos) },
  { id: 'higher-apps', name: 'Higher Applications', subtitle: paperSummary(higherAppsPaperVideos, 'Data Booklets & Files') },
];

function CourseSelector({ onSelect }: { onSelect: (course: Course) => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-5xl w-full">
        <GraduationCap className="h-16 w-16 mx-auto text-accent mb-6" />
        <h1 className="font-display text-3xl font-bold mb-3">Topic Explorer</h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Browse Qualifications Scotland past paper questions by topic and year, then build a custom
          maths worksheet with answers, QR-coded video solutions and PDF export —
          free for students and teachers. Choose your course to start.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {courseCards.map((course) => {
            const cardTheme = getCourseTheme(course.id);
            return (
              <div
                key={course.id}
                className="group relative flex flex-col p-8 bg-card border border-border rounded-2xl overflow-hidden hover:border-foreground/20 hover:scale-[1.02] transition-all"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cardTheme.gradient}`} />
                <h2 className={`text-2xl font-bold mb-1 ${cardTheme.text}`}>
                  {course.name}
                </h2>
                <p className="text-sm text-muted-dim mb-6">{course.subtitle}</p>
                <ul className="space-y-3 text-left mb-8">
                  {explorerFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-foreground-2">
                      <Check className={`h-5 w-5 ${cardTheme.text} shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSelect(course.id)}
                  className={`mt-auto w-full py-3 bg-gradient-to-r ${cardTheme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`}
                >
                  Launch Explorer
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  /**
   * Which course the Explorer is showing — decided **after** mount.
   *
   * **This was a lazy `useState` initialiser reading `location` and
   * `localStorage`, and it was the hydration mismatch `PracticeModes`
   * documents by name.** This is a static export: `/explorer` is built once,
   * with no query string in existence, so the initialiser returned null at
   * build time and the shipped HTML is the course chooser. In a browser the
   * same initialiser found `?c=n5` and returned National 5, so React's first
   * client render disagreed with the HTML it was hydrating — and React does
   * not patch a mismatch, it discards the server-rendered tree and rebuilds
   * the whole page. On the heaviest page on the site, for every shared link
   * and every returning visitor.
   *
   * It had already cost more than that. The teardown also wiped the
   * `data-theme` attribute off `<html>`, which is why `app/layout.tsx` carries
   * a `MutationObserver` to put it back; that file names this mismatch.
   *
   * **The visible sequence does not change.** The chooser was already being
   * shown and then replaced — that was the teardown. Now it is an ordinary
   * state update, and the built HTML is kept and enhanced rather than thrown
   * away.
   *
   * The lint rule against `setState` in an effect is right about state that
   * can be derived while rendering. This is the exception it names: reading
   * from an external system — the URL and storage — neither of which exists
   * when this page is built.
   */
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    // A shared worksheet names its own course, and it wins: a recipient whose
    // last course was Higher must still land in National 5 to see a National 5
    // sheet, rather than meeting the chooser or an empty worksheet.
    const shared = new URLSearchParams(window.location.search).get('c');
    if (COURSE_IDS.includes(shared as Course)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCourse(shared as Course);
      return;
    }
    const saved = localStorage.getItem('preferredCourse');
    if (COURSE_IDS.includes(saved as Course)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCourse(saved as Course);
    }
  }, []);

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
