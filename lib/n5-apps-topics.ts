import type { TopicCategory } from './n5-topics';

// N5 Applications of Maths hierarchy — ported from the live app's
// N5_APPS_TOPIC_CATEGORIES / N5_APPS_SUBTOPICS.

export const n5AppsTopics: Record<string, string[]> = {
  'Numeracy': [
    'Adding and Subtracting Fractions',
    'Comparing Fractions and Percentages',
    'Expressing a Quantity as a Percentage',
    'Fraction, Decimal and Percentage Equivalences',
    'Ratio',
    'Direct Proportion',
    'Inverse Proportion',
    'Miscellaneous Calculations',
  ],
  'Finance': [
    'Wages, Tax and National Insurance',
    'Analysing Financial Position',
    'Interest, Savings and Loans',
    'Appreciation and Depreciation',
    'Best Deal and Comparing Products',
    'Currency Exchange',
    'Costs Based on a Calculated Value',
  ],
  'Measurement': [
    'Speed, Distance and Time',
    'Time Intervals and Time Zones',
    'Reading Measurement Scales',
    'Converting Units of Measurement',
    'Tolerance',
    'Scale Drawing',
    'Task Planning and Precedence Tables',
    'Container Packing',
  ],
  'Geometry': [
    'Area: Shapes Including Circles',
    'Area: Rectangles and Triangles',
    'Perimeter Including Circles',
    'Pythagoras',
    'Volume: Simple Shapes',
    'Volume: Prisms',
    'Volume: Composite Shapes',
    'Gradient',
  ],
  'Statistics': [
    'Median, Quartiles and Interquartile Range',
    'Boxplots',
    'Standard Deviation',
    'Comparing Statistics',
  ],
  'Probability and Graphical Data': [
    'Probability',
    'Expected Frequency',
    'Pie Charts',
    'Scatter Graphs',
    'Reading Tables and Graphs',
  ],
};

export const n5AppsTopicCategories: TopicCategory[] = [
  {
    category: 'All Topics',
    topics: n5AppsTopics,
  },
];
