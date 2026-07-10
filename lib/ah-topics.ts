import type { TopicCategory } from './n5-topics';

// Advanced Higher topic hierarchy — ported from the live app's
// AH_TOPIC_CATEGORIES / AH_SUBTOPICS (verified against maths.scot).
// Questions tag main topics in `topics` and subtopics in `subtopics`.
// Mains with no subtopics (Maclaurin Series, Systems of Equations) use the
// main name as their single filterable entry — it matches `topics` instead.

export const ahTopics: Record<string, string[]> = {
  'Binomial Theorem': ['Binomial expansion', 'General and specific terms'],
  'Complex Numbers': ['Basic operations', 'Equations with complex roots', 'Argand diagram', 'Locus in the complex plane', "de Moivre's theorem"],
  'Differentiation': ['Product, quotient, chain rules', 'Implicit differentiation', 'Logarithmic differentiation', 'Parametric differentiation', 'Related rates of change', 'Rectilinear motion'],
  'Differential Equations': ['First order separable, without context', 'First order separable, in context', 'First order linear', 'Second order homogeneous', 'Second order non-homogeneous'],
  'Functions & Graphs': ['Asymptotes', 'Sketching related functions', 'Odd and even functions', 'Points of inflection'],
  'Integration': ['Simple integration', 'Integration by substitution', 'Integrating rational functions', 'Integration by parts', 'Volume of revolution', 'Rectilinear motion'],
  'Maclaurin Series': ['Maclaurin Series'],
  'Matrices': ['Matrix operations', 'Determinant and inverse', 'Transformation matrices'],
  'Methods of Proof': ['Direct proof', 'Disproof by counterexample', 'Proof by contrapositive', 'Proof by induction'],
  'Number Theory': ['Euclidean algorithm', 'Number bases'],
  'Partial Fractions': ['Proper rational functions', 'Improper rational functions'],
  'Sequences & Series': ['Arithmetic sequences and series', 'Geometric sequences and series', 'Arithmetic and geometric combined', 'Summation formulae'],
  'Systems of Equations': ['Systems of Equations'],
  'Vectors': ['Equations of lines or planes', 'Intersection of lines', 'Intersection of line and plane', 'Intersection of planes'],
};

export const ahTopicCategories: TopicCategory[] = [
  {
    category: 'Algebra & Matrices',
    topics: {
      'Binomial Theorem': ahTopics['Binomial Theorem'],
      'Partial Fractions': ahTopics['Partial Fractions'],
      'Matrices': ahTopics['Matrices'],
      'Systems of Equations': ahTopics['Systems of Equations'],
      'Sequences & Series': ahTopics['Sequences & Series'],
    },
  },
  {
    category: 'Calculus',
    topics: {
      'Differentiation': ahTopics['Differentiation'],
      'Integration': ahTopics['Integration'],
      'Differential Equations': ahTopics['Differential Equations'],
      'Maclaurin Series': ahTopics['Maclaurin Series'],
    },
  },
  {
    category: 'Complex Numbers, Proof & Number Theory',
    topics: {
      'Complex Numbers': ahTopics['Complex Numbers'],
      'Methods of Proof': ahTopics['Methods of Proof'],
      'Number Theory': ahTopics['Number Theory'],
    },
  },
  {
    category: 'Functions & Vectors',
    topics: {
      'Functions & Graphs': ahTopics['Functions & Graphs'],
      'Vectors': ahTopics['Vectors'],
    },
  },
];
