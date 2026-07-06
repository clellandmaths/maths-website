// Exam Hall Checklist Topics
// These are CURRICULUM checklists — "have I studied this concept?"
// They are NOT tied to the Explorer's question-tagging topics.
// Topics like "Rounding" appear within other questions but aren't standalone past paper topics.

import type { TopicCategory } from './n5-topics';

// --- National 5 Checklist ---

export const n5ChecklistCategories: TopicCategory[] = [
  {
    category: 'Numeracy',
    topics: {
      'Numeracy': [
        'Rounding',
        'Surds',
        'Indices',
        'Scientific Notation',
        'Percentages',
        'Fractions',
      ],
    },
  },
  {
    category: 'Algebra',
    topics: {
      'Algebra': [
        'Expanding Brackets',
        'Factorise - Difference of Two Squares',
        'Factorise - Trinomial (Simple)',
        'Factorise - Trinomial (Hard)',
        'Complete the Square',
        'Algebraic Fractions',
        'Solving Equations / Inequations',
        'Simultaneous Equations',
        'Form Equations',
        'Change the Subject',
      ],
    },
  },
  {
    category: 'Quadratic Functions',
    topics: {
      'Quadratic Functions': [
        'Equations of Quadratics y=kx²',
        'Sketching Quadratics',
        'Sketching Quadratics (Harder)',
        'Solving Quadratics - Algebraically',
        'Solving Quadratics - Graphically',
        'Solving Quadratics - Quadratic Formula',
        'Discriminant',
      ],
    },
  },
  {
    category: 'Geometry',
    topics: {
      'Geometry': [
        'Gradient',
        'Straight Line',
        'Circles (Properties)',
        'Pythagoras',
        'Similar Shapes',
        'Volumes',
        'Rearranging Formulae',
        'Vectors',
        'Vector Components',
      ],
    },
  },
  {
    category: 'Trigonometry',
    topics: {
      'Trigonometry': [
        'Triangle Trigonometry',
        'Trig Graphs - Sine Curve',
        'Trig Graphs - Cosine Curve',
        'Trig Graphs - Tan Curve',
        'Solving Trig Equations',
        'Trig Identities',
        'Bearings',
      ],
    },
  },
  {
    category: 'Statistics',
    topics: {
      'Statistics': [
        'Statistics',
        'Line of Best Fit',
      ],
    },
  },
];

// --- Higher Checklist ---

export const higherChecklistCategories: TopicCategory[] = [
  {
    category: 'Straight Line',
    topics: {
      'Straight Line': [
        'The equation of a line from two points',
        'The equation of a line from a point and a gradient',
        'Finding the point of intersection of lines',
        'The midpoint of a line segment',
        'The gradients of perpendicular lines',
        'The gradient of a line using m = tan θ',
        'Collinearity',
        'Perpendicular bisectors',
        'Medians',
        'Altitudes',
      ],
    },
  },
  {
    category: 'Functions & Graphs',
    topics: {
      'Functions': [
        'Domain and range of functions',
        'Composite functions',
        'Inverse functions',
      ],
      'Graphs of Related Functions': [
        'Graphs of f(x) ± k',
        'Graphs of f(x ± k)',
        'Graphs of kf(x)',
        'Graphs of f(kx)',
      ],
    },
  },
  {
    category: 'Polynomials & Quadratics',
    topics: {
      'Quadratics': [
        'Finding the equation of a quadratic function from a turning point',
        'Solving quadratics',
        'Sketching quadratics',
        'Determining the nature of the roots (the discriminant)',
        'Solving quadratics by rearranging',
        'Completing the square',
        'Solving quadratics by completing the square',
        'Solving quadratic inequations',
        'Using the discriminant',
        'Show a line is a tangent to a curve',
        'Nature of intersection of a line and a curve',
        'Points of intersection of a line and a curve',
        'Points of intersection of two curves',
      ],
      'Polynomials': [
        'Factorising Polynomials',
        'Solving polynomial equations',
        'Finding a remainder when dividing a polynomial',
        'Finding unknown coefficients of a polynomial',
        'Finding the points of intersection of curves',
        'Finding the equation of a polynomial from a graph',
      ],
    },
  },
  {
    category: 'Differentiation',
    topics: {
      'Differentiating': [
        'Using indices',
        'Differentiating functions',
        'Differentiation involving preparation of the function',
        'Differentiating composite functions - the chain rule',
        'Differentiating trigonometric functions',
        'Finding the rate of change of a function',
        'Finding the equation of a tangent',
      ],
      'Applications of Derivatives': [
        'Increasing or decreasing functions',
        'Finding the stationary points and their nature',
        'Sketching the graph of a function',
        'Sketching the derived function',
        'Optimisation',
        'Closed intervals',
      ],
    },
  },
  {
    category: 'Integration',
    topics: {
      'Integration': [
        'Basic Integration',
        'Integration involving preparation of the function',
        'Integrating composite functions',
        'Integrating trigonometric functions',
        'Definite integrals',
        'Area under curves',
        'Area between two curves',
        'Differential equations',
      ],
    },
  },
  {
    category: 'Recurrence Relations',
    topics: {
      'Recurrence Relations': [
        'Using recurrence relations',
        'Finding constant values in a recurrence relation',
        'The limit of a recurrence relation',
        'Finding the limit of a recurrence relation',
      ],
    },
  },
  {
    category: 'Trigonometry',
    topics: {
      'Trigonometric Functions': [
        'Finding the equation of a trigonometric function from a graph',
        'Solving trigonometric equations',
        'Exact values',
        'Solving trigonometric equations with exact values',
        'Solving trigonometric equations with radians',
        'Points of intersection between a trigonometric graph and a line',
      ],
      'Addition & Double Angle Formulae': [
        'Expanding the addition formulae',
        'Using the addition formulae',
        'Using the double angle formulae',
        'Using trigonometric identities',
        'Solving equations using the double angle formulae',
      ],
      'The Wave Function': [
        'Using the wave function',
        'Solving trigonometric equations with the wave function',
        'Sketching the graph of y = k sin(x ± α) or y = k cos(x ± α)',
        'Maximum and minimum values',
      ],
    },
  },
  {
    category: 'Vectors',
    topics: {
      'Vectors': [
        'Adding and subtracting vectors in component form',
        'Using position vectors',
        'Magnitude of vectors',
        'Finding unit vectors',
        'Working with unit vectors',
        'Collinearity',
        'Determining the coordinates of a division point on a line',
        'Determining the ratio of division of a line segment',
        'The scalar product',
        'Finding the angle between two vectors',
        'Properties of the scalar product',
        'Vector pathways',
      ],
    },
  },
  {
    category: 'Circle',
    topics: {
      'Circle': [
        'The distance between two points',
        'The equation of a circle - centre, (a, b) and radius, r',
        'Finding the centre and radius from a circle equation',
        'Coordinates and the circle 1 - within, on, or outside a circle',
        'The nature of the intersection of a line and a circle',
        'The points of intersection of a line and a circle',
        'The equation of a tangent to a circle',
        'The intersection of two circles',
        'Coordinates and the circle 2 - finding centres and radii',
      ],
    },
  },
  {
    category: 'Logs & Exponentials',
    topics: {
      'Logs & Exponentials': [
        'Using logarithms and exponentials',
        'Finding the equation of a function from its graph',
        'Sketching a graph from its equation',
        'Sketching the inverse function',
        'Sketching related graphs',
        'Evaluating expressions using the laws of logarithms',
        'Solving logarithmic and exponential equations',
        'Exponential growth and decay',
        'Log-linear & log-log graphs (experimental data)',
      ],
    },
  },
];
