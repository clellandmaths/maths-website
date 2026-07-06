// Past Papers Data Loader
// Aggregates all past paper data for the Explorer
// Uses dynamic imports so data only loads when a course is selected

export interface Question {
  question: string;
  answer: string;
  videoId: string;
  timestamp: string;
  topics: string[];
}

export interface Paper {
  paperNumber: number;
  questions: Question[];
}

export interface PastPaper {
  year: number;
  papers: Paper[];
}

// Flatten all questions with metadata for filtering
export interface QuestionWithMetadata extends Question {
  year: number;
  paperNumber: number;
  questionIndex: number;
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
        });
      });
    }
  }

  return questions;
}

// N5 — dynamic imports, only loaded when N5 is selected
export async function getAllN5Questions(): Promise<QuestionWithMetadata[]> {
  const [
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

// Filter questions by selected subtopics, years, and paper type
export function filterQuestions(
  questions: QuestionWithMetadata[],
  selectedSubtopics: string[],
  selectedYears: number[],
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

    // Filter by topics (if any topics selected)
    if (selectedSubtopics.length > 0) {
      const hasMatchingTopic = q.topics?.some((t) =>
        selectedSubtopics.includes(t)
      );
      if (!hasMatchingTopic) {
        return false;
      }
    }

    return true;
  });
}

// Available years per course (static — no data import needed)
export function getAvailableN5Years(): number[] {
  return [2025, 2024, 2023, 2022, 2019, 2018, 2017, 2016, 2015, 2014];
}

export function getAvailableHigherYears(): number[] {
  return [2025, 2024, 2023, 2022, 2019, 2018, 2017, 2016, 2015];
}
