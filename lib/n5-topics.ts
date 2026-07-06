// N5 Maths Topic Hierarchy
// 5 categories → main topics → subtopics

export interface TopicCategory {
  category: string;
  topics: Record<string, string[]>;
}

export const n5TopicCategories: TopicCategory[] = [
  {
    category: "Numeracy",
    topics: {
      "Fractions": ["Fractions and mixed numbers"],
      "Percentages": ["Appreciation and Depreciation", "Reversing a percentage change"],
      "Surds": ["Simplifying surds", "Rationalising the denominator"],
      "Indices": [
        "Laws of indices",
        "Rewriting fraction or negative index in the form ax^n",
        "Evaluating a fractional or negative index numerically",
      ],
      "Scientific Notation": ["Scientific notation"],
    },
  },
  {
    category: "Algebra",
    topics: {
      "Expanding & Factorising": ["Expanding brackets", "Factorising"],
      "Equations & Inequalities": [
        "Linear equations and inequations",
        "Simultaneous equations",
        "Changing the subject of a formula",
        "Create equation in geometric context",
      ],
      "Functions": ["Function notation"],
      "Algebraic Fractions": [
        "Simplifying algebraic fraction",
        "Add or subtract Algebraic Fractions",
        "Multiply or divide Algebraic Fractions",
      ],
      "Straight Line": [
        "Straight Line Equation",
        "Coordinate Geometry with straight line equation",
      ],
      "Quadratics": [
        "Completing the square",
        "Discriminant",
        "Quadratic equation by factorising",
        "Quadratic formula",
        "Turning Points and Axis of Symmetry",
        "Parabola Equation from Graph",
        "Sketch a parabola from equation",
      ],
    },
  },
  {
    category: "Geometry",
    topics: {
      "Arcs & Sectors": ["Sector area", "Arc length"],
      "Volume": ["Volume - simple shape", "Volume - composite shape"],
      "Pythagoras": ["Pythagoras in 3d", "Pythagoras in circle diagrams", "Pythagoras converse"],
      "Angles": ["Angles in regular polygons", "Angles in diagrams involving circles"],
      "Similarity": ["Similar lengths", "Similar areas/volumes"],
      "Vectors": [
        "Adding and Subtracting vector components",
        "Vector pathways",
        "3d Coordinates",
        "Magnitude",
      ],
    },
  },
  {
    category: "Trigonometry",
    topics: {
      "Sine Rule": ["Sine rule: calculate angle", "Sine rule: calculate length"],
      "Cosine Rule": ["Cosine rule: calculate angle", "Cosine rule: calculate length"],
      "Area of a Triangle": ["Area of a Triangle"],
      "Bearings": ["Bearings in Trigonometry questions"],
      "Trig Graphs": ["Identify equation of trigonometric graph", "sin/cos/tan of related angles"],
      "Trig Equations": ["Trigonometric equation"],
      "Trig Identities": ["Trigonometric identities"],
    },
  },
  {
    category: "Statistics",
    topics: {
      "Comparing Data": [
        "Median/Quartiles/Interquartile Range",
        "Standard Deviation",
        "Comparing Calculated Statistics",
      ],
      "Scatter Graphs": ["Scatter Graph"],
    },
  },
];

// Derived flat map for backwards compatibility
export const n5Topics: Record<string, string[]> = {};
for (const cat of n5TopicCategories) {
  for (const [topic, subs] of Object.entries(cat.topics)) {
    n5Topics[topic] = subs;
  }
}

// Get all main topic names
export const mainTopics = Object.keys(n5Topics);

// Get all subtopics as a flat array
export const allSubtopics = Object.values(n5Topics).flat();

// Helper to get main topic from a subtopic
export function getMainTopic(subtopic: string): string | null {
  for (const [main, subs] of Object.entries(n5Topics)) {
    if (subs.includes(subtopic)) return main;
  }
  return null;
}

// Helper to check if a question matches selected topics
export function questionMatchesTopics(
  questionTopics: string[],
  selectedSubtopics: string[]
): boolean {
  if (selectedSubtopics.length === 0) return true;
  return questionTopics.some(t => selectedSubtopics.includes(t));
}
