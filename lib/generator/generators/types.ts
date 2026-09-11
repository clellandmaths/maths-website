import type { Figure } from '../diagrams/scene';
export type Topic =
  | "Median"
  | "Altitude"
  | "Perpendicular Bisector"
  | "Parallel Line"
  | "Perpendicular Line"
  | "Collinearity"
  | "Angle with x-axis"
  | "Calculate Angle"
  | "Point of Intersection"
  | "Unknown Coordinate"
  | "Finding the recurrence relation"
  | "Limit of a sequence"
  | "Forming a recurrence relation"
  | "Finding a specific term of a sequence"
  | "Domain and range"
  | "Composite functions"
  | "Inverse functions"
  | "Graphs of related functions"
  | "Factorising a polynomial"
  | "Factors and remainders"
  | "Solving polynomial equations"
  | "Identifying a polynomial from its roots"
  | "Using the discriminant"
  | "Quadratic inequalities"
  | "Completing the square"
  | "Intersection of a polynomial and a line"
  | "Simple differentiation"
  | "Rate of change"
  | "Equation of tangent"
  | "Trigonometric differentiation"
  | "Chain rule"
  | "Stationary points"
  | "Derived graphs"
  | "Optimisation"
  | "Simple indefinite integration"
  | "Simple definite integration"
  | "Integration using the chain rule"
  | "Integrating a trigonometric function"
  | "Differential equations"
  | "Area under a curve"
  | "Area between two curves"
  | "Addition formulae"
  | "Double angle formulae"
  | "Trig equations"
  | "Double angle equations"
  | "The wave function"
  | "Wave equations"
  | "Trig identities"
  | "Related angles"
  | "Equation of circle"
  | "Intersection of circles"
  | "Tangent to a circle"
  | "Intersection of line and circle"
  | "Basic definition of logarithm"
  | "Using the laws of logarithms"
  | "Solving logarithmic equations"
  | "Solving exponential equations"
  | "Finding relationship from straight line"
  | "Resultant of 3D vector pathways"
  | "Resultant of 2D vector pathways"
  | "Collinearity (Vectors)"
  | "Ratio of division"
  | "Dividing a line segment in a ratio"
  | "Unit vectors"
  | "Scalar product"
  | "Compound Interest"
  | "Simple Interest"
  | "Income & Taxation"
  | "Interest Rates & Accumulation"
  | "Loans, Mortgages & Credit Cards"
  | "Inflation & Purchasing Power"
  | "Basic Probability"
  | "Statistical Literacy & Data Gathering"
  | "Descriptive Statistics & Distributions"
  | "Correlation and Linear Regression"
  | "Correlation and Linear Regression (Software)"
  | "Hypothesis Testing & Statistical Software"
  | "Fermi Estimates & Assumptions"
  | "Functions, Graphs & Rates of Change"
  | "Tolerances & Compound Measures"
  | "Recurrence Relations"
  | "Recurrence Relations (Software)"
  | "Spreadsheet Skills (Data & Formulas)"
  | "Insurance"
  | "Expected Value"
  | "Gantt Charts"
  | "Project Planning (Activity Networks / PERT)"
  | "Interest Rates & Accumulation (Software)"
  | "Loans & Mortgages (Software)"
  | "Risk & Expected Value"
  // National 5.
  //
  // One topic per question *shape* the exam actually uses, not per skill. The
  // markscheme's skill line for 2016 P1 Q2 is "start the calculation correctly",
  // which hides that the question is 3/4(1/3 + 2/7) — a bracket, two operations.
  // Grouping by skill produced a generator that only ever wrote mixed-op-mixed,
  // the least common shape in the whole set.
  // Skills, from the Zeta Maths checklist — plain fractions and mixed numbers
  // are separate skills, and a starter for a weaker class wants the first.
  | "Adding Fractions"
  | "Subtracting Fractions"
  | "Adding Mixed Numbers"
  | "Subtracting Mixed Numbers"
  | "Multiplying Fractions"
  | "Multiplying Mixed Numbers"
  | "Dividing Fractions"
  | "Dividing Mixed Numbers"
  // Shapes, from the past papers
  | "Fractions with Brackets"
  | "Three-Term Fractions"
  | "Fractions in Context"
  // Surds. The specification names only simplification and rationalising,
  // but the exam never asks add/subtract or multiply/divide alone, so both
  // would be missing from a paper-only or spec-only reading.
  | "Simplifying Surds"
  | "Adding Surds"
  | "Subtracting Surds"
  | "Multiplying Surds"
  | "Dividing Surds"
  | "Rationalising the Denominator"
  | "Expanding Surd Brackets"
  | "Surds in a Function"
  | "A Sum of Three Surds"
  | "Rationalising and Simplifying"
  | "Rationalising a Quotient of Surds"
  | "Laws of Indices"
  | "Negative Indices"
  | "Fractional Indices"
  | "Indices with Coefficients"
  | "Indices in a Quotient"
  | "Expanding with Indices"
  | "Cancelling Coefficients with Indices"
  | "A Root in the Denominator"
  | "Writing a Root as a Power"
  | "Compound Appreciation & Depreciation"
  | "Reverse Percentages"
  | "Percentage Change"
  | "Two-Stage Depreciation"
  | "Appreciation Between Two Years"
  | "Finding a Total from a Percentage"
  | "Finding the Extra Charged"
  | "Expanding a Single Bracket"
  | "Expanding Two Single Brackets"
  | "Expanding with a Term Outside"
  | "Expanding Two Brackets"
  | "Expanding a Trinomial"
  | "Expanding and Collecting"
  | "Factorising a Common Factor"
  | "Difference of Two Squares"
  | "Factorising a Trinomial"
  | "Factorising a Harder Trinomial"
  | "Factorising Fully"
  | "Solving by Factorising"
  | "Completing the Square"
  | "Turning Point of a Parabola"
  | "Completing the Square with Surd Roots"
  | "A Parabola Through a Point"
  | "A Parabola from its Turning Point"
  | "A Parabola and its Axis of Symmetry"
  | "A Parabola and its y-intercept"
  | "A Parabola from its Axis of Symmetry"
  | "A Parabola with a Maximum Turning Point"
  | "A Turning Point and a Related Point"
  | "Reaching a Height in a Quadratic Model"
  | "Falling Below the Starting Height"
  | "Sketching a Parabola from Completed Square Form"
  | "Sketching a Parabola from Factorised Form"
  | "Amplitude and Period of a Trigonometric Graph"
  | "A Shifted Trigonometric Graph"
  | "A Raised Trigonometric Graph"
  | "A Turning Point on a Trigonometric Graph"
  | "The Equation of a Line of Best Fit"
  | "A Line of Best Fit on a Grid"
  | "The Equation of a Line Through Two Marked Points"
  | "The Discriminant"
  | "The Quadratic Formula"
  | "Simplifying Algebraic Fractions"
  | "Adding Algebraic Fractions"
  | "Subtracting Algebraic Fractions"
  | "Multiplying Algebraic Fractions"
  | "Dividing Algebraic Fractions"
  | "Dividing with a Difference of Squares"
  | "Gradient as an Algebraic Fraction"
  | "Changing the Subject"
  | "Changing the Subject with Roots"
  | "Changing the Subject with a Fractional Coefficient"
  | "Solving Inequalities"
  | "Inequalities with Fractions"
  | "Solving Simultaneous Equations"
  | "Intersection of Two Lines"
  | "Constructing Simultaneous Equations"
  | "Simultaneous Equations Used Again"
  | "Evaluating a Function"
  | "Finding an Unknown in a Function"
  | "Evaluating a Trigonometric Function"
  | "Quartiles and Interquartile Range"
  | "Comparing Median and Interquartile Range"
  | "Mean and Standard Deviation"
  | "Comparing Mean and Standard Deviation"
  | "Judging Consistency from the Standard Deviation"
  | "Standard Deviation in Surd Form"
  | "Finding the Variance from a Surd"
  | "Solving Trigonometric Equations"
  | "Trigonometric Equations in a Formula"
  | "Simplifying Trigonometric Expressions"
  | "Expanding Trigonometric Brackets"
  | "Trigonometric Fractions"
  | "Writing in a Given Trigonometric Form"
  | "The Value at a Related Angle"
  | "Ordering Trigonometric Values"
  | "Vector Components"
  | "Finding a Missing Vector"
  | "Magnitude as a Surd"
  | "A Pathway in Components"
  | "A Pathway in a Parallelogram"
  | "A Pathway with an Extended Side"
  | "A Pathway with Multiples"
  | "A Pathway in a Rhombus"
  | "A Pathway Running On"
  | "Coordinates of a Cube on a Cuboid"
  | "Coordinates of a Pyramid on a Cube"
  | "Coordinates of a Triangular Prism"
  | "Coordinates on a Cone"
  | "A Lettered Cuboid and a Midpoint"
  | "Gradient from an Equation"
  | "Intercept from an Equation"
  | "Gradient and the x-axis Crossing"
  | "Gradient from Two Points"
  | "Equation of a Line from Two Points"
  | "Adding Two Vectors Drawn on a Grid"
  | "Drawing the Resultant of Two Vectors"
  | "Writing in Scientific Notation"
  | "Calculating in Scientific Notation"
  | "Pythagoras in a Right-Angled Triangle"
  | "Cosine Rule: Finding a Side"
  | "Cosine Rule: Finding an Angle"
  | "Sine Rule: Finding a Side"
  | "Cosine Rule with a Given Angle"
  | "Sine Rule with Given Angles"
  | "Area of a Triangle"
  | "Counting Significant Figures"
  | "Rounding to Significant Figures"
  | "Rounding to Decimal Places"
  | "Arc Length"
  | "Sector Area"
  | "Finding a Missing Value in a Sector"
  | "Volume of a Solid"
  | "Finding a Missing Dimension from a Volume"
  | "Volume of a Sphere"
  | "A Volume in Scientific Notation"
  | "Volume of a Cone"
  | "The Height of a Pyramid"
  | "A Cone Matching a Sphere"
  | "A Cone with a Hemisphere Removed"
  | "A Cone with its Tip Removed"
  | "The Coating on a Sphere"
  | "A Cylinder with a Dome on Top"
  | "A Box with a Sphere on Top"
  | "A Pyramid with its Tip Removed"
  | "A Hemisphere Set into a Box"
  | "Solving Linear Equations"
  | "Equations with Brackets"
  | "Equations with Fractions"
  | "Clearing Denominators in an Equation"
  | "A Border Round a Rectangle"
  | "A Wall on Three Sides"
  | "A Triangle Against a Rectangle"
  | "A Rectangle Against a Square"
  | "A Cuboid of Given Volume"
  | "A Rectangle Against a Triangle"
  | "Magnitude of a Vector"
  | "Pythagoras in a Circle"
  | "The Converse of Pythagoras"
  | "Finding a Chord or Radius in a Circle"
  | "Finding the Radius from a Chord"
  | "The Space Diagonal of a Cuboid"
  | "3D Coordinates and Lengths"
  | "Pythagoras with Two Circles"
  | "Cosine Rule from a Diagram"
  | "Sine Rule from a Diagram"
  | "Area of a Triangle from a Diagram"
  | "Bearings with the Sine Rule"
  | "Bearings with the Cosine Rule"
  | "Finding a Bearing"
  | "Two Angles of Elevation"
  | "A Perpendicular Inside a Triangle"
  | "Two Triangles Sharing an Angle"
  | "A Point Off a Straight Line"
  | "Area of a Regular Hexagon"
  | "Area of a Sector"
  | "A Sector Cut Out of a Triangle"
  | "Two Similar Sectors"
  | "Length of an Arc"
  | "Finding the Angle of a Sector"
  | "Finding the Radius from an Arc"
  | "Area of a Segment of a Circle"
  | "A Polygon Inside a Circle"
  | "A Side of a Polygon Produced"
  | "A Tangent and a Diameter"
  | "A Tangent and a Semicircle"
  | "A Tangent Meeting a Diameter"
  | "Two Tangents and a Parallel Chord"
  | "Two Tangents and Two Diameters"
  | "A Reflex Angle at the Centre"
  | "A Polygon and a Diameter"
  | "An H Shape and a Polygon"
  | "A Side of a Similar Triangle"
  | "The Rest of a Similar Triangle"
  | "The Area Left by a Similar Triangle"
  | "Volumes of Similar Solids"
  | "Areas of Similar Figures"
  | "Cost of a Similar Figure"
  | "Showing Two Solids Are Not Similar";

export const TOPIC_GROUPS_HIGHER: Record<string, Topic[]> = {
  "Vectors": [
    "Resultant of 3D vector pathways",
    "Resultant of 2D vector pathways",
    "Collinearity (Vectors)",
    "Ratio of division",
    "Dividing a line segment in a ratio",
    "Unit vectors",
    "Scalar product"
  ],
  "Exponentials & Logarithms": [
    "Basic definition of logarithm",
    "Using the laws of logarithms",
    "Solving logarithmic equations",
    "Solving exponential equations",
    "Finding relationship from straight line"
  ],
  "Circle": [
    "Equation of circle",
    "Intersection of circles",
    "Tangent to a circle",
    "Intersection of line and circle"
  ],
  "Trigonometry": [
    "Related angles",
    "Addition formulae",
    "Double angle formulae",
    "Trig identities",
    "Trig equations",
    "Double angle equations",
    "The wave function",
    "Wave equations"
  ],
  "Integration": [
    "Simple indefinite integration",
    "Simple definite integration",
    "Integration using the chain rule",
    "Integrating a trigonometric function",
    "Differential equations",
    "Area under a curve",
    "Area between two curves"
  ],
  "Differentiation": [
    "Simple differentiation",
    "Rate of change",
    "Equation of tangent",
    "Trigonometric differentiation",
    "Chain rule",
    "Stationary points",
    "Derived graphs",
    "Optimisation"
  ],
  "Straight Line": [
    "Median",
    "Altitude",
    "Perpendicular Bisector",
    "Parallel Line",
    "Perpendicular Line",
    "Collinearity",
    "Angle with x-axis",
    "Calculate Angle",
    "Point of Intersection",
    "Unknown Coordinate",
  ],
  Sequences: [
    "Finding the recurrence relation",
    "Limit of a sequence",
    "Forming a recurrence relation",
    "Finding a specific term of a sequence",
  ],
  "Functions and Graphs": [
    "Domain and range",
    "Composite functions",
    "Inverse functions",
    "Graphs of related functions"
  ],
  "Quadratics & Polynomials": [
    "Factorising a polynomial",
    "Factors and remainders",
    "Solving polynomial equations",
    "Identifying a polynomial from its roots",
    "Using the discriminant",
    "Quadratic inequalities",
    "Completing the square",
    "Intersection of a polynomial and a line"
  ]
};

export const TOPIC_GROUPS_APPS: Record<string, Topic[]> = {
  "Finance": [
    "Income & Taxation",
    "Interest Rates & Accumulation",
    "Interest Rates & Accumulation (Software)",
    "Loans, Mortgages & Credit Cards",
    "Loans & Mortgages (Software)",
    "Inflation & Purchasing Power",
    "Insurance"
  ],
  "Statistics": [
    "Basic Probability",
    "Statistical Literacy & Data Gathering",
    "Descriptive Statistics & Distributions",
    "Correlation and Linear Regression",
    "Correlation and Linear Regression (Software)",
    "Hypothesis Testing & Statistical Software"
  ],
  "Modelling": [
    "Fermi Estimates & Assumptions",
    "Functions, Graphs & Rates of Change",
    "Tolerances & Compound Measures",
    "Recurrence Relations",
    "Recurrence Relations (Software)",
    "Spreadsheet Skills (Data & Formulas)"
  ],
  "Planning And Decision Making": [
    "Project Planning (Activity Networks / PERT)",
    "Gantt Charts",
    "Risk & Expected Value"
  ]
};

export const TOPIC_GROUPS_N5: Record<string, Topic[]> = {
  "N5 Fractions": [
    "Adding Fractions",
    "Subtracting Fractions",
    "Adding Mixed Numbers",
    "Subtracting Mixed Numbers",
    "Multiplying Fractions",
    "Multiplying Mixed Numbers",
    "Dividing Fractions",
    "Dividing Mixed Numbers",
    "Fractions with Brackets",
    "Three-Term Fractions",
    "Fractions in Context",
  ],
  "N5 Surds": [
    "Simplifying Surds",
    "Adding Surds",
    "Subtracting Surds",
    "Multiplying Surds",
    "Dividing Surds",
    "Rationalising the Denominator",
    "Expanding Surd Brackets",
    "Surds in a Function",
    "A Sum of Three Surds",
    "Rationalising and Simplifying",
    "Rationalising a Quotient of Surds",
  ],
  "N5 Indices": [
    "Laws of Indices",
    "Negative Indices",
    "Fractional Indices",
    "Indices with Coefficients",
    "Indices in a Quotient",
    "Expanding with Indices",
    "Cancelling Coefficients with Indices",
    "A Root in the Denominator",
    "Writing a Root as a Power",
  ],
  "N5 Percentages": [
    "Compound Appreciation & Depreciation",
    "Reverse Percentages",
    "Percentage Change",
    "Two-Stage Depreciation",
    "Appreciation Between Two Years",
    "Finding a Total from a Percentage",
    "Finding the Extra Charged",
  ],
  // Forming an equation out of a shape — the five that carry a figure. Their
  // own group because the picture is the question: the sides are expressions,
  // and reading them off the drawing is the first mark.
  "N5 Forming an Equation": [
    "A Border Round a Rectangle",
    "A Wall on Three Sides",
    "A Triangle Against a Rectangle",
    "A Rectangle Against a Square",
    "A Cuboid of Given Volume",
    "A Rectangle Against a Triangle",
  ],
  "N5 Expanding Brackets": [
    "Expanding a Single Bracket",
    "Expanding Two Single Brackets",
    "Expanding with a Term Outside",
    "Expanding Two Brackets",
    "Expanding a Trinomial",
    "Expanding and Collecting",
  ],
  "N5 Factorising": [
    "Factorising a Common Factor",
    "Difference of Two Squares",
    "Factorising a Trinomial",
    "Factorising a Harder Trinomial",
    "Factorising Fully",
    "Solving by Factorising",
  ],
  // Their own group, not Quadratics. Appending them beside the parabolas put
  // them under it, which is wrong on the website's own filter — the papers file
  // these under Trig Graphs — and sent 888 questions a run into the quadratics
  // answer check, where nothing could read them.
  "N5 Trig Graphs": [
    "Amplitude and Period of a Trigonometric Graph",
    "A Shifted Trigonometric Graph",
    "A Raised Trigonometric Graph",
    "A Turning Point on a Trigonometric Graph",
  ],
  "N5 Quadratics": [
    "Completing the Square",
    "Turning Point of a Parabola",
    "Completing the Square with Surd Roots",
    "A Parabola Through a Point",
    "A Parabola from its Turning Point",
    "A Parabola and its Axis of Symmetry",
    "A Parabola and its y-intercept",
    "A Parabola from its Axis of Symmetry",
    "Sketching a Parabola from Completed Square Form",
    "A Parabola with a Maximum Turning Point",
    "A Turning Point and a Related Point",
    "Sketching a Parabola from Factorised Form",
    "Reaching a Height in a Quadratic Model",
    "Falling Below the Starting Height",
    "The Discriminant",
    "The Quadratic Formula",
  ],
  "N5 Algebraic Fractions": [
    "Simplifying Algebraic Fractions",
    "Adding Algebraic Fractions",
    "Subtracting Algebraic Fractions",
    "Multiplying Algebraic Fractions",
    "Dividing Algebraic Fractions",
    "Dividing with a Difference of Squares",
    "Gradient as an Algebraic Fraction",
  ],
  "N5 Formulae & Inequalities": [
    "Changing the Subject",
    "Changing the Subject with Roots",
    "Changing the Subject with a Fractional Coefficient",
    "Solving Inequalities",
    "Inequalities with Fractions",
  ],
  "N5 Simultaneous Equations": [
    "Solving Simultaneous Equations",
    "Intersection of Two Lines",
    "Constructing Simultaneous Equations",
    "Simultaneous Equations Used Again",
  ],
  "N5 Functions": [
    "Evaluating a Function",
    "Finding an Unknown in a Function",
    "Evaluating a Trigonometric Function",
  ],
  "N5 Comparing Data Sets": [
    "Quartiles and Interquartile Range",
    "Comparing Median and Interquartile Range",
    "Mean and Standard Deviation",
    "Comparing Mean and Standard Deviation",
    "Judging Consistency from the Standard Deviation",
    "Standard Deviation in Surd Form",
    "Finding the Variance from a Surd",
  ],
  "N5 Trigonometry": [
    "Solving Trigonometric Equations",
    "Trigonometric Equations in a Formula",
    "Simplifying Trigonometric Expressions",
    "Expanding Trigonometric Brackets",
    "Trigonometric Fractions",
    "Writing in a Given Trigonometric Form",
    "The Value at a Related Angle",
    "Ordering Trigonometric Values",
  ],
  "N5 Vectors": [
    "Vector Components",
    "Magnitude of a Vector",
    "Finding a Missing Vector",
    "Magnitude as a Surd",
    "A Pathway in Components",
  ],
  // The pathway questions: a figure, two edges named as vectors, and a third
  // the question asks for and the drawing deliberately does not show.
  "N5 Vector Pathways": [
    "A Pathway in a Parallelogram",
    "A Pathway with an Extended Side",
    "A Pathway with Multiples",
    "A Pathway in a Rhombus",
    "A Pathway Running On",
  ],
  // Write down a coordinate off a solid standing on the axes. Two marks and no
  // working in any of them, which makes the figure the whole question.
  "N5 3D Coordinates": [
    "Coordinates of a Cube on a Cuboid",
    "Coordinates of a Pyramid on a Cube",
    "Coordinates of a Triangular Prism",
    "Coordinates on a Cone",
    "A Lettered Cuboid and a Midpoint",
  ],
  "N5 Straight Line": [
    "Gradient from an Equation",
    "Intercept from an Equation",
    "Gradient and the x-axis Crossing",
    "Gradient from Two Points",
    "Equation of a Line from Two Points",
    "Adding Two Vectors Drawn on a Grid",
    "Drawing the Resultant of Two Vectors",
    "The Equation of a Line of Best Fit",
    "A Line of Best Fit on a Grid",
    "The Equation of a Line Through Two Marked Points",
  ],
  "N5 Scientific Notation": [
    "Writing in Scientific Notation",
    "Calculating in Scientific Notation",
  ],
  "N5 Pythagoras": [
    "Pythagoras in a Right-Angled Triangle",
    "Pythagoras in a Circle",
    "The Converse of Pythagoras",
    "Finding a Chord or Radius in a Circle",
    "Finding the Radius from a Chord",
    "The Space Diagonal of a Cuboid",
    "3D Coordinates and Lengths",
    "Pythagoras with Two Circles",
  ],
  "N5 Triangle Trigonometry": [
    "Cosine Rule: Finding a Side",
    "Cosine Rule: Finding an Angle",
    "Sine Rule: Finding a Side",
    "Cosine Rule with a Given Angle",
    "Sine Rule with Given Angles",
    "Area of a Triangle",
  ],
  // Paper 2 draws its triangles and puts the numbers on the drawing, so these
  // are a separate group: every question here carries a figure.
  "N5 Triangle Trigonometry (Diagrams)": [
    "Cosine Rule from a Diagram",
    "Sine Rule from a Diagram",
    "Area of a Triangle from a Diagram",
  ],
  // Triangle trigonometry wrapped in bearings: the angle has to be read off the
  // compass arcs before the rule starts, and turned back into one afterwards.
  "N5 Bearings": [
    "Bearings with the Sine Rule",
    "Bearings with the Cosine Rule",
    "Finding a Bearing",
  ],
  // Two triangles, one answer: an angle found in the wide one and carried into
  // the narrow one. The figure is what says they share an edge.
  "N5 Composite Triangles": [
    "Two Angles of Elevation",
    "A Perpendicular Inside a Triangle",
    "Two Triangles Sharing an Angle",
    "A Point Off a Straight Line",
    "Area of a Regular Hexagon",
  ],
  "N5 Rounding": [
    "Counting Significant Figures",
    "Rounding to Significant Figures",
    "Rounding to Decimal Places",
  ],
  "N5 Arcs, Sectors and Volume": [
    "Arc Length",
    "Sector Area",
    "Finding a Missing Value in a Sector",
    "Volume of a Solid",
    "Finding a Missing Dimension from a Volume",
  ],
  // The drawn versions of volume. The worded group above substitutes into one
  // formula; every paper question puts the solid in a picture and most build it
  // from two pieces, so the mark that separates them is knowing to add or
  // subtract rather than knowing the formula.
  "N5 Volume (Diagrams)": [
    "Volume of a Sphere",
    "A Volume in Scientific Notation",
    "Volume of a Cone",
    "The Height of a Pyramid",
    "A Cone Matching a Sphere",
    "A Cone with a Hemisphere Removed",
    "A Cone with its Tip Removed",
    "The Coating on a Sphere",
    "A Cylinder with a Dome on Top",
    "A Box with a Sphere on Top",
    "A Pyramid with its Tip Removed",
    "A Hemisphere Set into a Box",
  ],
  // The drawn versions. The worded group above states the radius and angle in
  // the prose; these put them on the figure, as Paper 2 does.
  "N5 Arcs and Sectors (Diagrams)": [
    "Area of a Sector",
    "A Sector Cut Out of a Triangle",
    "Two Similar Sectors",
    "Length of an Arc",
    "Finding the Angle of a Sector",
    "Finding the Radius from an Arc",
    "Area of a Segment of a Circle",
    "A Polygon Inside a Circle",
  ],
  "N5 Angles in Shapes": [
    "A Side of a Polygon Produced",
    "A Tangent and a Diameter",
    "A Tangent and a Semicircle",
    "A Tangent Meeting a Diameter",
    "Two Tangents and a Parallel Chord",
    "Two Tangents and Two Diameters",
    "A Reflex Angle at the Centre",
    "A Polygon and a Diameter",
    "An H Shape and a Polygon",
  ],
  "N5 Similarity": [
    "A Side of a Similar Triangle",
    "The Rest of a Similar Triangle",
    "The Area Left by a Similar Triangle",
    "Volumes of Similar Solids",
    "Areas of Similar Figures",
    "Cost of a Similar Figure",
    "Showing Two Solids Are Not Similar",
  ],
  "N5 Linear Equations": [
    "Solving Linear Equations",
    "Equations with Brackets",
    "Equations with Fractions",
    "Clearing Denominators in an Equation",
  ],
};

export const COURSES: Record<string, Record<string, Topic[]>> = {
  "National 5 Maths": TOPIC_GROUPS_N5,
  "Higher Maths": TOPIC_GROUPS_HIGHER,
  "Higher Applications Of Maths": TOPIC_GROUPS_APPS
};

export const TOPIC_GROUPS = { ...TOPIC_GROUPS_N5, ...TOPIC_GROUPS_HIGHER, ...TOPIC_GROUPS_APPS };

export const ALL_TOPICS: Topic[] = Object.values(TOPIC_GROUPS).flat();

// Group and topic names are the identifiers the whole app routes on: TOPIC_GROUPS
// merges every course into one object, and generateQuestion looks a topic up by
// its name. A duplicate would silently shadow another course's questions, so N5
// topics carry an "N5 " prefix where the name would otherwise collide with
// Higher ("Trig Equations", "Vectors", "Functions" all exist there already).
// This check turns that from a silent bug into a startup failure.
const seenTopics = new Set<string>();
for (const t of ALL_TOPICS) {
  if (seenTopics.has(t)) {
    throw new Error(`Duplicate topic name "${t}" — topic names must be unique across courses`);
  }
  seenTopics.add(t);
}

/**
 * Which tier a question belongs to.
 *
 * The generator serves two jobs that pull in different directions: short
 * starters to put on the board, and homework that builds to exam level. A full
 * SQA question is far too long for a starter, and bare skills do not make a
 * homework, so every variation says which it is.
 */
export type Difficulty = 'skill' | 'applied' | 'exam';

export interface GeneratedQuestion {
  topic?: string; // The main group (e.g. Straight Line)
  subTopic: string; // The specific type (e.g. Median)
  questionLines: string[];
  boardQuestionLines?: string[];
  solutionSteps: string[];
  /**
   * What each step is worth, in the same order as solutionSteps.
   *
   * The papers award marks per step and print them; a worked solution that does
   * not is missing the part a pupil uses to see where they lost one. Optional
   * while the backfill runs — markschemes.ts reports how many exam variations
   * carry it, so "optional" cannot quietly become "never".
   *
   * These must sum to the variation's `marks`, which is the markscheme's total,
   * and markschemes.ts checks that they do.
   */
  stepMarks?: number[];
  finalAnswer: string;
  attachments?: { filename: string; content: string; rawData?: any[][] }[];
  /**
   * Which tier this is. Absent on the older Higher and Apps variations.
   *
   * Every N5 generator writes this by hand — 194 of them — and the registry
   * writes it too. Two copies of one fact drift, and this pair had: the tier
   * means "a past paper stands behind it", which only `basedOn` knows. So
   * `generateQuestion` overwrites this from the registry on the way out, and
   * what a generator function puts here is a default for anything the registry
   * does not know about.
   */
  difficulty?: Difficulty;
  /**
   * The website's own subtopics for this question, spelled as it spells them.
   *
   * Not the generator's topic name: those are two granularities on purpose —
   * 210 skills here, 57 filing places there. Set from the registry alongside
   * `difficulty`, so a question knows where it would file on the site without
   * anything having to map it later.
   */
  webTopics?: string[];
  /** Key into the course's variation registry — see n5-variations.ts. */
  variationId?: string;
  /**
   * The variation's permanent public code — see `variation-codes.ts`.
   *
   * Set from the registry on the way out, alongside `difficulty` and
   * `webTopics`, for the same reason: it is a property of the variation, not
   * of the draw. A shared worksheet link carries this and a seed, and nothing
   * else, so it is the half of that pair which must never move.
   *
   * Absent on Higher and Apps questions, which have no registry and are not
   * shareable yet.
   */
  code?: string;
  /**
   * The diagram's model, when the question carries one.
   *
   * The rendered SVG goes into `questionLines`; this is the scene it came from,
   * kept so the checks can re-measure the drawing against the numbers the
   * question prints. Without it a check could only inspect the SVG string,
   * which is exactly the position the hand-written diagrams leave you in.
   */
  figure?: Figure;
}
