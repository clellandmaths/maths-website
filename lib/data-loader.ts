// Past Papers Data Loader
// Aggregates all past paper data for the Explorer
// Uses dynamic imports so data only loads when a course is selected

import { questionNumber } from '@/lib/question-number';

export interface QuestionAttachment {
  name: string;
  url: string;
  type: string;
}

export interface Question {
  question: string;
  answer: string;
  videoId: string;
  timestamp: string;
  topics: string[];
  // AH / Apps courses tag main topics in `topics` and fine-grained
  // subtopics here; N5/Higher put subtopic strings straight in `topics`
  subtopics?: string[];
  marks?: number[];
  // Higher Apps: downloadable data files (CSV/XLSX/DOCX) per question
  attachments?: QuestionAttachment[];
  dataBookletSection?: number;
  dataBookletLabel?: string;
  /**
   * Set on guided practice questions owned by maths.scot. Linking to his
   * written solution is a condition of using them, so it travels with the
   * question rather than depending on one particular surface remembering.
   * See docs/guided-practice-attribution.md
   */
  solutionUrl?: string;
}

export interface Paper {
  paperNumber: number;
  questions: Question[];
}

export interface PastPaper {
  year: number | string; // Higher Apps has a "Specimen" paper
  papers: Paper[];
}

// Flatten all questions with metadata for filtering
export interface QuestionWithMetadata extends Question {
  year: number | string;
  paperNumber: number;
  questionIndex: number;
  /**
   * The number the exam prints — "6(b)-(c)", not the entry's position. Equal to
   * questionIndex + 1 on papers that are not split by part.
   */
  questionNumber: string;
  /**
   * Overrides the "{year} Paper {n} Q{m}" caption. Guided practice questions
   * have no paper number, so without this they read "Surds Paper 0 Q1".
   */
  label?: string;
}

/** The caption shown above a question in the full-screen and focus views. */
export function questionLabel(q: QuestionWithMetadata): string {
  // questionNumber, not questionIndex + 1: on a split paper the two differ, and
  // the index is the one that does not appear in the pupil's booklet.
  return q.label ?? `${q.year} Paper ${q.paperNumber} Q${q.questionNumber ?? q.questionIndex + 1}`;
}

function flattenPastPapers(pastPapers: PastPaper[]): QuestionWithMetadata[] {
  const questions: QuestionWithMetadata[] = [];

  for (const pastPaper of pastPapers) {
    for (const paper of pastPaper.papers) {
      paper.questions.forEach((q, index) => {
        questions.push({
          ...q,
          year: pastPaper.year,
          paperNumber: paper.paperNumber,
          questionIndex: index,
          // The number the exam prints, which is not the entry's position once a
          // paper is split by part: entry 12 of N5 Apps 2026 P2 is "6(b)-(c)".
          questionNumber: questionNumber(q.question) ?? String(index + 1),
        });
      });
    }
  }

  return questions;
}

// N5 — dynamic imports, only loaded when N5 is selected
export async function getAllN5Questions(): Promise<QuestionWithMetadata[]> {
  const [
    { pastpaper2026 },
    { pastpaper2025 },
    { pastpaper2024 },
    { pastpaper2023 },
    { pastpaper2022 },
    { pastpaper2019 },
    { pastpaper2018 },
    { pastpaper2017 },
    { pastpaper2016 },
    { pastpaper2015 },
    { pastpaper2014 },
  ] = await Promise.all([
    import('@/src/n5/pastpapers/pastpaper-2026'),
    import('@/src/n5/pastpapers/pastpaper-2025'),
    import('@/src/n5/pastpapers/pastpaper-2024'),
    import('@/src/n5/pastpapers/pastpaper-2023'),
    import('@/src/n5/pastpapers/pastpaper-2022'),
    import('@/src/n5/pastpapers/pastpaper-2019'),
    import('@/src/n5/pastpapers/pastpaper-2018'),
    import('@/src/n5/pastpapers/pastpaper-2017'),
    import('@/src/n5/pastpapers/pastpaper-2016'),
    import('@/src/n5/pastpapers/pastpaper-2015'),
    import('@/src/n5/pastpapers/pastpaper-2014'),
  ]);

  const n5PastPapers: PastPaper[] = [
    pastpaper2026 as PastPaper,
    pastpaper2025 as PastPaper,
    pastpaper2024 as PastPaper,
    pastpaper2023 as PastPaper,
    pastpaper2022 as PastPaper,
    pastpaper2019 as PastPaper,
    pastpaper2018 as PastPaper,
    pastpaper2017 as PastPaper,
    pastpaper2016 as PastPaper,
    pastpaper2015 as PastPaper,
    pastpaper2014 as PastPaper,
  ];

  return flattenPastPapers(n5PastPapers);
}

// Higher — dynamic imports, only loaded when Higher is selected
export async function getAllHigherQuestions(): Promise<QuestionWithMetadata[]> {
  const [
    { higherPastPaper2026 },
    { higherPastPaper2025 },
    { higherPastPaper2024 },
    { higherPastPaper2023 },
    { higherPastPaper2022 },
    { higherPastPaper2019 },
    { higherPastPaper2018 },
    { higherPastPaper2017 },
    { higherPastPaper2016 },
    { higherPastPaper2015 },
  ] = await Promise.all([
    import('@/src/higher/pastpapers/higherpastpaper2026'),
    import('@/src/higher/pastpapers/higherpastpaper2025'),
    import('@/src/higher/pastpapers/higherpastpaper2024'),
    import('@/src/higher/pastpapers/higherpastpaper2023'),
    import('@/src/higher/pastpapers/higherpastpaper2022'),
    import('@/src/higher/pastpapers/higherpastpaper2019'),
    import('@/src/higher/pastpapers/higherpastpaper2018'),
    import('@/src/higher/pastpapers/higherpastpaper2017'),
    import('@/src/higher/pastpapers/higherpastpaper2016'),
    import('@/src/higher/pastpapers/higherpastpaper2015'),
  ]);

  const higherPastPapers: PastPaper[] = [
    higherPastPaper2026 as PastPaper,
    higherPastPaper2025 as PastPaper,
    higherPastPaper2024 as PastPaper,
    higherPastPaper2023 as PastPaper,
    higherPastPaper2022 as PastPaper,
    higherPastPaper2019 as PastPaper,
    higherPastPaper2018 as PastPaper,
    higherPastPaper2017 as PastPaper,
    higherPastPaper2016 as PastPaper,
    higherPastPaper2015 as PastPaper,
  ];

  return flattenPastPapers(higherPastPapers);
}

// Advanced Higher — single-file years 2016–2019, split P1/P2 from 2021
export async function getAllAHQuestions(): Promise<QuestionWithMetadata[]> {
  const modules = await Promise.all([
    import('@/src/ah/pastpapers/AHMaths2025_P1'),
    import('@/src/ah/pastpapers/AHMaths2025_P2'),
    import('@/src/ah/pastpapers/AHMaths2024_P1'),
    import('@/src/ah/pastpapers/AHMaths2024_P2'),
    import('@/src/ah/pastpapers/AHMaths2023_P1'),
    import('@/src/ah/pastpapers/AHMaths2023_P2'),
    import('@/src/ah/pastpapers/AHMaths2022_P1'),
    import('@/src/ah/pastpapers/AHMaths2022_P2'),
    import('@/src/ah/pastpapers/AHMaths2021_P1'),
    import('@/src/ah/pastpapers/AHMaths2021_P2'),
    import('@/src/ah/pastpapers/AHMaths2019'),
    import('@/src/ah/pastpapers/AHMaths2018'),
    import('@/src/ah/pastpapers/AHMaths2017'),
    import('@/src/ah/pastpapers/AHMaths2016'),
  ]);
  const papers: PastPaper[] = [
    modules[0].advHigherMaths2025P1, modules[1].advHigherMaths2025P2,
    modules[2].advHigherMaths2024P1, modules[3].advHigherMaths2024P2,
    modules[4].advHigherMaths2023P1, modules[5].advHigherMaths2023P2,
    modules[6].advHigherMaths2022P1, modules[7].advHigherMaths2022P2,
    modules[8].advHigherMaths2021P1, modules[9].advHigherMaths2021P2,
    modules[10].advHigherMaths2019, modules[11].advHigherMaths2018,
    modules[12].advHigherMaths2017, modules[13].advHigherMaths2016,
  ] as PastPaper[];
  return flattenPastPapers(papers);
}

// Higher Applications — one paper per year, plus the Specimen
export async function getAllHigherAppsQuestions(): Promise<QuestionWithMetadata[]> {
  const modules = await Promise.all([
    import('@/src/higherapps/HApps2025'),
    import('@/src/higherapps/HApps2024'),
    import('@/src/higherapps/HApps2023'),
    import('@/src/higherapps/HApps2022'),
    import('@/src/higherapps/HAppsSpec1'),
  ]);
  const papers: PastPaper[] = [
    modules[0].higherAppsMaths2025, modules[1].higherAppsMaths2024,
    modules[2].higherAppsMaths2023, modules[3].higherAppsMaths2022,
    modules[4].higherAppsMathsSpecimen,
  ] as PastPaper[];
  return flattenPastPapers(papers);
}

// N5 Applications — separate P1/P2 files per year
export async function getAllN5AppsQuestions(): Promise<QuestionWithMetadata[]> {
  const modules = await Promise.all([
    import('@/src/n5apps/n5apps2026P1'), import('@/src/n5apps/n5apps2026P2'),
    import('@/src/n5apps/n5apps2025P1'), import('@/src/n5apps/n5apps2025P2'),
    import('@/src/n5apps/n5apps2024P1'), import('@/src/n5apps/n5apps2024P2'),
    import('@/src/n5apps/n5apps2023P1'), import('@/src/n5apps/n5apps2023P2'),
    import('@/src/n5apps/n5apps2022P1'), import('@/src/n5apps/n5apps2022P2'),
    import('@/src/n5apps/n5apps2021P1'), import('@/src/n5apps/n5apps2021P2'),
    import('@/src/n5apps/n5apps2019P1'), import('@/src/n5apps/n5apps2019P2'),
    import('@/src/n5apps/n5apps2018P1'), import('@/src/n5apps/n5apps2018P2'),
  ]);
  // Read each paper off whichever module exports it, not by position. Adding a
  // year at the top of the import list shifts every index below it, and adding
  // 2026 did exactly that: modules[2] stopped being the 2024 P1 module, so
  // every year from 2024 down resolved to undefined. Nothing failed to compile
  // — the papers simply disappeared. Names cannot drift that way.
  const byName: Record<string, PastPaper> = Object.assign({}, ...modules);
  const papers: PastPaper[] = [
    'n5AppsMaths2026P1', 'n5AppsMaths2026P2',
    'n5AppsMaths2025P1', 'n5AppsMaths2025P2',
    'n5AppsMaths2024P1', 'n5AppsMaths2024P2',
    'n5AppsMaths2023P1', 'n5AppsMaths2023P2',
    'n5AppsMaths2022P1', 'n5AppsMaths2022P2',
    'n5AppsMaths2021P1', 'n5AppsMaths2021P2',
    'n5AppsMaths2019P1', 'n5AppsMaths2019P2',
    'n5AppsMaths2018P1', 'n5AppsMaths2018P2',
  ].map(name => {
    const paper = byName[name];
    if (!paper) throw new Error(`data-loader: N5 Apps paper ${name} not exported by any imported module`);
    return paper;
  });
  return flattenPastPapers(papers);
}

// Filter questions by selected subtopics, years, and paper type
export function filterQuestions(
  questions: QuestionWithMetadata[],
  selectedSubtopics: string[],
  selectedYears: (number | string)[],
  selectedPapers: number[] = []
): QuestionWithMetadata[] {
  return questions.filter((q) => {
    // Filter by years (if any selected)
    if (selectedYears.length > 0 && !selectedYears.includes(q.year)) {
      return false;
    }

    // Filter by paper number (if any selected)
    if (selectedPapers.length > 0 && !selectedPapers.includes(q.paperNumber)) {
      return false;
    }

    // Filter by topics (if any topics selected) — N5/Higher tag subtopic
    // strings in `topics`; AH/Apps courses use `subtopics` for fine-grained
    // tags and `topics` for mains (Excel/RStudio filter on mains directly)
    if (selectedSubtopics.length > 0) {
      const tags = [...(q.topics ?? []), ...(q.subtopics ?? [])];
      if (!tags.some((t) => selectedSubtopics.includes(t))) {
        return false;
      }
    }

    return true;
  });
}

// Available years per course (static — no data import needed)
export function getAvailableN5Years(): number[] {
  return [2026, 2025, 2024, 2023, 2022, 2019, 2018, 2017, 2016, 2015, 2014];
}

export function getAvailableHigherYears(): number[] {
  return [2026, 2025, 2024, 2023, 2022, 2019, 2018, 2017, 2016, 2015];
}

export function getAvailableAHYears(): number[] {
  return [2025, 2024, 2023, 2022, 2021, 2019, 2018, 2017, 2016];
}

export function getAvailableHigherAppsYears(): (number | string)[] {
  return [2025, 2024, 2023, 2022, 'Specimen'];
}

export function getAvailableN5AppsYears(): number[] {
  return [2026, 2025, 2024, 2023, 2022, 2021, 2019, 2018];
}
