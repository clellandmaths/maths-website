import type { TopicCategory } from './n5-topics';

// Higher Applications of Maths hierarchy — ported from the live app's
// HIGHER_APPS_TOPIC_CATEGORIES / HIGHER_APPS_SUBTOPICS.
// Excel and RStudio are software tags carried in `topics` (no subtopics),
// so their single filterable entry is the main name itself.

export const higherAppsTopics: Record<string, string[]> = {
  'Finance': [
    'Pay, Tax & National Insurance', 'Accumulated Value', 'Present Value',
    'Repayment Schedules & Credit', 'Inflation & Purchasing Power', 'Financial Decision Making',
  ],
  'Statistics & Probability': [
    'Tree & Venn Diagrams', 'Statistical Literacy', 'Experiment Design & Bias',
    'Statistical Diagrams', 'Descriptive Statistics', 'Distribution of data',
    'Statistical Tests', 'Correlation & Regression',
  ],
  'Mathematical Modelling': [
    'Fermi Estimation', 'Units of Measure', 'Recurrence Relations',
    'Linear Models', 'Exponential Models', 'Identifying Graphs & Formulae',
    'Evaluating Models', 'Error & Tolerances',
  ],
  'Planning & Decision Making': [
    'PERT Charts & Critical Paths', 'Gantt Charts', 'Expected Costs & Risk',
  ],
  'Excel': ['Excel'],
  'RStudio': ['RStudio'],
};

export const higherAppsTopicCategories: TopicCategory[] = [
  {
    category: 'Course Areas',
    topics: {
      'Finance': higherAppsTopics['Finance'],
      'Statistics & Probability': higherAppsTopics['Statistics & Probability'],
      'Mathematical Modelling': higherAppsTopics['Mathematical Modelling'],
      'Planning & Decision Making': higherAppsTopics['Planning & Decision Making'],
    },
  },
  {
    category: 'Software',
    topics: {
      'Excel': higherAppsTopics['Excel'],
      'RStudio': higherAppsTopics['RStudio'],
    },
  },
];
