// Advanced Higher marking instructions — 2016–2019 and 2021 papers have no
// video solutions; their full markschemes are shown instead (mirrors the
// live app's "Show Markscheme" behaviour).

export interface MarkschemeEntry {
  questionNumber: string; // "1(a)", "3", ...
  answer: string;
}

interface MarkschemeFile {
  year: number;
  papers: { paperNumber: number; questions: MarkschemeEntry[] }[];
}

const markschemeFiles: Record<string, () => Promise<MarkschemeFile>> = {
  '2016-1': () => import('@/src/ah/markschemes/AH2016MI').then(m => m.advHigherMaths2016Markscheme as MarkschemeFile),
  '2017-1': () => import('@/src/ah/markschemes/AH2017MI').then(m => m.advHigherMaths2017Markscheme as MarkschemeFile),
  '2018-1': () => import('@/src/ah/markschemes/AH2018MI').then(m => m.advHigherMaths2018Markscheme as MarkschemeFile),
  '2019-1': () => import('@/src/ah/markschemes/AH2019MI').then(m => m.advHigherMaths2019Markscheme as MarkschemeFile),
  '2021-1': () => import('@/src/ah/markschemes/AH2021_P1_MI').then(m => m.advHigherMaths2021P1Markscheme as MarkschemeFile),
  '2021-2': () => import('@/src/ah/markschemes/AH2021_P2_MI').then(m => m.advHigherMaths2021P2Markscheme as MarkschemeFile),
};

export function hasMarkscheme(year: number | string, paperNumber: number): boolean {
  return `${year}-${paperNumber}` in markschemeFiles;
}

// Question labels look like "2018 Q1(a)" or "2021 P1 Q3" inside a
// white-space:nowrap span at the start of the question HTML.
export function extractQuestionNumber(questionHtml: string): string | null {
  const match = /<span style="white-space:\s*nowrap;?">\s*\d{4}(?:\s+P\d)?\s+Q([^<]+?)\s*<\/span>/.exec(questionHtml);
  return match ? match[1].trim() : null;
}

// Matches the exact entry plus sub-parts: Q3 also collects 3(a), 3(b)...
export async function getMarkschemeEntries(
  year: number | string,
  paperNumber: number,
  questionHtml: string
): Promise<MarkschemeEntry[]> {
  const load = markschemeFiles[`${year}-${paperNumber}`];
  if (!load) return [];
  const qNum = extractQuestionNumber(questionHtml);
  if (!qNum) return [];

  const data = await load();
  const paper = data.papers.find(p => p.paperNumber === paperNumber) ?? data.papers[0];
  if (!paper) return [];

  return paper.questions.filter(
    entry => entry.questionNumber === qNum || entry.questionNumber.startsWith(`${qNum}(`)
  );
}
