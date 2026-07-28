// Guided practice question sets.
//
// Question and answer text is HTML with MathJax-style \( \) delimiters, exactly
// as authored in the Clelland Maths app. It renders unchanged through
// renderMathHtml, which already handles those delimiters via KaTeX — so no
// conversion was needed when porting.

export interface PracticeQuestion {
  /** HTML + \( \) maths. Render with renderMathHtml. */
  question: string;
  /** Final answer only. Full written working stays on maths.scot. */
  answer: string;
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
