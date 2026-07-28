// Guided practice question sets.
//
// Question and answer text is HTML with MathJax-style \( \) delimiters, exactly
// as authored in the Clelland Maths app. It renders unchanged through
// renderMathHtml, which already handles those delimiters via KaTeX — so no
// conversion was needed when porting.

export interface PracticeQuestion {
  /**
   * A past paper question the site already holds, e.g. "2023 P2 Q14".
   *
   * When set, `question` and `answer` are absent and the real question — text,
   * diagram, answer, video and marks — is resolved from the past paper data at
   * build time. That keeps one copy of each exam question rather than two, and
   * means practice picks up any correction automatically.
   *
   * Questions from years the archive does not stock (2021, specimen papers)
   * are written inline instead, with `paper` set for the label.
   */
  ref?: string;
  /** HTML + \( \) maths. Render with renderMathHtml. Absent when `ref` is set. */
  question?: string;
  /** Final answer only. Full written working stays on maths.scot. */
  answer?: string;
  /** YouTube id of the worked solution, where one exists. */
  videoId?: string;
  /** Seconds into the video where this question is solved. */
  timestamp?: number;
  /** Set on past paper questions, e.g. "2014 P1 Q1". Mutually exclusive with solutionUrl. */
  paper?: string;
  /**
   * maths.scot written solution. Present on his questions only — a condition of
   * using them. See docs/guided-practice-attribution.md.
   */
  solutionUrl?: string;
}

export interface PracticeTopic {
  name: string;
  questions: PracticeQuestion[];
}

export interface PracticeSection {
  id: string;
  title: string;
  topics: PracticeTopic[];
}

export interface PracticeCourse {
  courseId: string;
  sections: PracticeSection[];
}
