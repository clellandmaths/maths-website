// Higher Maths Topic Hierarchy
// 11 categories → main topics → subtopics

import { TopicCategory } from './n5-topics';

export const higherTopicCategories: TopicCategory[] = [
  {
    category: "Straight Line",
    topics: {
      "Straight Line": [
        "Perpendicular and parallel lines",
        "Angles and straight lines: m = tan\u03b8",
        "Altitudes, medians, perpendicular bisectors",
        "Intersection of straight lines",
      ],
    },
  },
  {
    category: "Functions & Graphs",
    topics: {
      "Functions": [
        "Composite functions",
        "Inverse functions",
        "Domain and range",
      ],
      "Graphs": [
        "Completing the square",
        "Identifying/sketching graphs of related functions (non-trigonometric)",
        "Identify polynomial equation when shown graph/roots",
        "The graph of the derived function",
      ],
    },
  },
  {
    category: "Polynomials & Quadratics",
    topics: {
      "Polynomials & Quadratics": [
        "Cubic/quartic expressions/equations: factorise or solve",
        "Discriminant and Quadratics",
        "Quadratic inequations",
        "Points of intersection of polynomial(s) and/or straight line",
      ],
    },
  },
  {
    category: "Differentiation",
    topics: {
      "Differentiating": [
        "Differentiate or evaluate derivative: polynomial",
        "Differentiate or evaluate derivative: composite function",
        "Differentiate or evaluate derivative: trigonometric expression",
        "Equation of a tangent to a curve",
      ],
      "Applications of Derivatives": [
        "Find stationary points and determine nature",
        "Find value of x for which a function has given gradient",
        "Increasing/decreasing: show that, or find values for which",
        "Optimisation",
        "Optimisation on a closed interval",
      ],
    },
  },
  {
    category: "Integration",
    topics: {
      "Integration": [
        "Integrate (definite or indefinite): polynomial",
        "Integrate (definite or indefinite): trigonometric expression",
        "Integrate (definite or indefinite): (px + q)^n",
        "Integrate or differentiate non-standard function using given facts",
        "Areas using integration",
        "Differential equation",
      ],
    },
  },
  {
    category: "Recurrence Relations",
    topics: {
      "Recurrence Relations": [
        "Find a specific term of a recurrence relation",
        "Limits of recurrence relations",
        "Go backwards to find recurrence relation when terms known",
        "Write a recurrence relation formula from a real-life situation",
      ],
    },
  },
  {
    category: "Trigonometry",
    topics: {
      "Trig Formulae & Equations": [
        "Apply compound angle formula to simplify or evaluate",
        "Apply double angle formula to simplify or evaluate",
        "Solving a trigonometric equation using formula for sin(2x)",
        "Solving a trigonometric equation using formula for cos(2x)",
        "Wave function (y = asin x \u00b1 bcosx)",
        "Trig equation involving compound angle",
      ],
      "Trig Graphs & Identities": [
        "Identifying/sketching graphs of related functions (trigonometric)",
        "Proving a trigonometric identity",
      ],
    },
  },
  {
    category: "Vectors",
    topics: {
      "Scalar Product": [
        "Scalar product",
        "Perpendicular vectors and the scalar product",
        "Calculating an angle using the scalar product",
        "Using the distributive law with the scalar product",
      ],
      "Vectors in Geometry": [
        "Vector pathways in geometric diagrams",
        "Basic vector paths (now in N5 maths)",
        "Collinearity (in 3d or 2d)",
        "Ratio in which one point divides two others",
      ],
    },
  },
  {
    category: "Circle",
    topics: {
      "Circle": [
        "Circle equation from radius/centre or vice versa",
        "Equation of a tangent to a circle at a point",
        "Intersections of lines and circles (including showing tangency)",
        "Intersections of two circles",
      ],
    },
  },
  {
    category: "Logs & Exponentials",
    topics: {
      "Logs & Exponentials": [
        "Simplify numerical expression involving logs/exponentials",
        "Solving equations containing a logarithm",
        "Solving equations where the unknown is in the exponent",
        "Graphs of logarithmic or exponential functions",
        "Deriving relationship y = ab^x or y = ax^b from straight line",
      ],
    },
  },
];

// Derived flat map: main topic → subtopics
export const higherTopics: Record<string, string[]> = {};
for (const cat of higherTopicCategories) {
  for (const [topic, subs] of Object.entries(cat.topics)) {
    higherTopics[topic] = subs;
  }
}

// Get all main topic names
export const higherMainTopics = Object.keys(higherTopics);

// Get all subtopics as a flat array
export const allHigherSubtopics = Object.values(higherTopics).flat();

// Helper to get main topic from a subtopic
export function getHigherMainTopic(subtopic: string): string | null {
  for (const [main, subs] of Object.entries(higherTopics)) {
    if (subs.includes(subtopic)) return main;
  }
  return null;
}
