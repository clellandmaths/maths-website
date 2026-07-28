import { Section } from '@/src/notes/types';

import { InlineMath, BlockMath } from '@/src/notes/math-components';
import { 
  CircleMidpoint, CollinearityDiagrams, GradientTriangle, GradientTypes, 
  Ex1Gradient, Ex3Gradient, Ex4Gradient, ParallelLines, PerpendicularLines, HorizontalVerticalLines,
  PerpendicularBisectorCross, PerpendicularBisectorTriangle, Circumcentre, Altitudes, Orthocentre, 
  Medians, Centroid, IntersectionExample, InverseGraphReflection, InverseGraphExample,
  TransformationGraph1, TransformationGraph2, ExactValueTriangle45, ExactValueTriangle3060,
  TrigRatiosRightAngle, TangentDiagram, IncreasingFunctionGraph, DecreasingFunctionGraph,
  IncDecCombinedGraph, MaxTurningPoint, MinTurningPoint, RisingInflection, FallingInflection,
  CurveSketchExample, Example1Diagram, Example2Diagram, DerivedEx1, DerivedEx2, DerivedEx3,
  DiscriminantDiagram, IntersectionDiagram, InequalitiesDiagram,
  PolyCubicGraph1, PolyCubicGraph2, PolyIntersectionDiagrams,
  SyntheticDivision,
  SineWaveGraph, CosineWaveGraph, SineAddCosineWaveGraph,
  MinMaxSineGraph, MinMaxCosineGraph
,
  AreaUnderCurveIntroGraph,
  AreaUnderCurveEx1Graph,
  AreaUnderCurveEx2Graph,
  AreaBetweenCurvesIntroGraph,
  AreaBetweenCurvesEx1Graph,
  AreaBetweenCurvesEx2Graph,
  AreaBetweenCurvesEx3Graph,
  AreaUnderXAxisIntroGraph,
  AreaUnderXAxisEx1Graph,
  AreaUnderXAxisEx2Graph
} from '@/src/notes/illustrations';


export const higherMathsData: Section[] = [
  {
    id: "straight-line",
    title: "The Straight Line",
    topics: [
      {
        id: "distance-between-points",
        title: "Distance Between Points",
        videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=28",
        theory: (
          <div className="space-y-4">
            <p>To calculate the distance between two points, we can construct a right-angled triangle and use Pythagoras' Theorem.</p>
            <p>The distance <InlineMath math="d" /> between two points <InlineMath math="(x_1, y_1)" /> and <InlineMath math="(x_2, y_2)" /> is given by:</p>
            <BlockMath math="d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" />
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Leave the answer as a surd:</strong> the distance formula usually gives a root. Simplify it rather than rounding, especially when the result feeds into later working.</li>
              <li><strong>Squaring kills the sign:</strong> so the order of the points does not matter — but brackets around a negative difference do.</li>
              <li><strong>It is Pythagoras:</strong> if you forget the formula, sketch the right-angled triangle and use <InlineMath math="a^2+b^2=c^2" />.</li>
              <li><strong>In three dimensions add the third term:</strong> the pattern extends to <InlineMath math="\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}" />.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "dist-ex1",
            question: <p>Plot the coordinates <InlineMath math="(1,3)" /> and <InlineMath math="(6,9)" />. Using Pythagoras' Theorem, calculate the distance between these two points.</p>,
            solution: (
              <div className="space-y-4">
                <p>Label the points: <InlineMath math="(x_1 = 1, y_1 = 3)" /> and <InlineMath math="(x_2 = 6, y_2 = 9)" />.</p>
                <BlockMath math="d^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2" />
                <BlockMath math="d^2 = (6 - 1)^2 + (9 - 3)^2" />
                <BlockMath math="d^2 = 5^2 + 6^2" />
                <BlockMath math="d^2 = 25 + 36 = 61" />
                <BlockMath math="d = \sqrt{61}" />
                <p>The distance is <InlineMath math="\sqrt{61}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "midpoints",
        title: "Midpoints",
        videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=477",
        theory: (
          <div className="space-y-4">
            <p>The midpoint is the exact centre point of a straight line connecting two points.</p>
            <p>The midpoint of <InlineMath math="(x_1, y_1)" /> and <InlineMath math="(x_2, y_2)" /> is found by averaging the <InlineMath math="x" /> and <InlineMath math="y" /> coordinates:</p>
            <BlockMath math="\text{Midpoint} = \left(\frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}\right)" />
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Add then divide, do not subtract:</strong> the midpoint averages the coordinates. Using the difference gives the length, not the middle.</li>
              <li><strong>Working backwards is common:</strong> given one endpoint and the midpoint, use <InlineMath math="x_2 = 2x_m - x_1" />. Guessing rarely works with negatives.</li>
              <li><strong>Careful with negatives:</strong> the average of <InlineMath math="-3" /> and <InlineMath math="7" /> is <InlineMath math="2" />. Write the addition down rather than doing it mentally.</li>
              <li><strong>Answer as coordinates:</strong> a midpoint is a point, so give it as a pair.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "mid-ex1",
            question: <p>Calculate the midpoint of <InlineMath math="(1, -4)" /> and <InlineMath math="(7, 8)" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="M = \left(\frac{1+7}{2}, \frac{-4+8}{2}\right)" />
                <BlockMath math="M = \left(\frac{8}{2}, \frac{4}{2}\right)" />
                <BlockMath math="M = (4, 2)" />
              </div>
            )
          },
          {
            id: "mid-ex2",
            question: (
              <div className="space-y-2">
                <p>In the diagram, <InlineMath math="A(9, -2)" /> lies on the circumference of the circle with centre <InlineMath math="C(17, 12)" />, and the line <InlineMath math="AB" /> is the diameter of the circle. Find the co-ordinates of <InlineMath math="B" />.</p>
                <CircleMidpoint />
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Since <InlineMath math="C" /> is the centre and <InlineMath math="AB" /> is the diameter, <InlineMath math="C" /> is the midpoint of <InlineMath math="AB" />.</p>
                <p>Let <InlineMath math="B = (x, y)" />.</p>
                <BlockMath math="\frac{9+x}{2} = 17 \implies 9+x = 34 \implies x = 25" />
                <BlockMath math="\frac{-2+y}{2} = 12 \implies -2+y = 24 \implies y = 26" />
                <p>The co-ordinates of <InlineMath math="B" /> are <InlineMath math="(25, 26)" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "collinearity",
        title: "Collinearity",
        videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=772",
        theory: (
          <div className="space-y-4">
            <p>Points which lie on the same straight line are said to be <strong>collinear</strong>.</p>
            <CollinearityDiagrams />
            <p>To prove points A, B, and C are collinear, you must show that:</p>
            <ul className="list-disc list-inside ml-4">
              <li>The gradient of AB equals the gradient of BC (<InlineMath math="m_{AB} = m_{BC}" />)</li>
              <li>They share a common point (B)</li>
            </ul>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Write the conclusion out.</strong> Conclusions here are very often left unstated, and that is where the marks go. Equal gradients on their own do not finish it — state that the gradients are equal, that <InlineMath math="B" /> is common to both, and therefore the points are collinear.</li>
                <li><strong>The common point is half the proof:</strong> two separate lines can have equal gradients and never meet. Naming the shared point is what rules that out.</li>
                <li><strong>Do not stop at &ldquo;parallel&rdquo;:</strong> equal gradients alone prove the lines are parallel, which is a different statement.</li>
                <li><strong>Keep gradients exact:</strong> leave them as fractions. Rounding to decimals can make two genuinely equal gradients look different.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "col-ex1",
            question: <p>Show that the points <InlineMath math="P(-6, -1)" />, <InlineMath math="Q(0, 2)" /> and <InlineMath math="R(8,6)" /> are collinear.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} m_{PQ} &= \frac{2 - (-1)}{0 - (-6)} \\ &= \frac{3}{6} \\ &= \frac{1}{2} \end{aligned}" />
                <BlockMath math="\begin{aligned} m_{QR} &= \frac{6 - 2}{8 - 0} \\ &= \frac{4}{8} \\ &= \frac{1}{2} \end{aligned}" />
                <p>Since <InlineMath math="m_{PQ} = m_{QR}" /> and <InlineMath math="Q" /> is a common point, the points <InlineMath math="P, Q, \text{and } R" /> are collinear.</p>
              </div>
            )
          },
          {
             id: "col-ex2",
             question: <p>The points <InlineMath math="A(1, -1)" />, <InlineMath math="B(-1, k)" /> and <InlineMath math="C(5, 7)" /> are collinear. Find the value of <InlineMath math="k" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Since they are collinear, <InlineMath math="m_{AB} = m_{BC}" />.</p>
                 <BlockMath math="\begin{aligned} m_{BC} &= \frac{7 - k}{5 - (-1)} \\ &= \frac{7 - k}{6} \end{aligned}" />
                 <BlockMath math="\begin{aligned} m_{AC} &= \frac{7 - (-1)}{5 - 1} \\ &= \frac{8}{4} \\ &= 2 \end{aligned}" />
                 <p>Since the line is the same, <InlineMath math="m_{BC}" /> must be 2.</p>
                 <BlockMath math="\frac{7 - k}{6} = 2" />
                 <BlockMath math="7 - k = 12 \implies k = -5" />
               </div>
             )
          }
        ]
      },
      {
         id: "gradient",
         title: "Gradient",
         videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=1047",
         theory: (
           <div className="space-y-4">
             <p>The gradient of a line measures its steepness. It is the ratio of vertical change to horizontal change.</p>
             <GradientTriangle />
             <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />
             <p>The gradient is also related to the angle <InlineMath math="\theta" /> the line makes with the positive x-axis:</p>
             <BlockMath math="m = \tan\theta" />
             <GradientTypes />
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>Keep the order consistent:</strong> whichever point you call the first, use it first in both the numerator and the denominator. Swapping halfway through flips the sign.</li>
               <li><strong>Rearrange before reading off <InlineMath math="m" />:</strong> from <InlineMath math="3x+2y=12" /> you must make <InlineMath math="y" /> the subject. The coefficient of <InlineMath math="x" /> in the original is not the gradient.</li>
               <li><strong>Leave gradients as fractions:</strong> decimals make later comparisons unreliable, particularly when testing whether two gradients are equal.</li>
               <li><strong>Angle questions use <InlineMath math="m = \tan\theta" />:</strong> and if the angle is measured from the <InlineMath math="y" />-axis, subtract from <InlineMath math="90^\circ" /> first.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
              id: "grad-ex1",
              question: (
                <div className="space-y-2">
                  <p>Calculate the gradient of the straight line shown in the diagram:</p>
                  <Ex1Gradient />
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <BlockMath math="\begin{aligned} m &= \tan\theta \\ &= \tan 32^\circ \\ &\approx 0.62 \end{aligned}" />
                </div>
              )
           },
           {
             id: "grad-ex2",
             question: <p>Find the angle that the line joining <InlineMath math="P(-2, -2)" /> and <InlineMath math="Q(1,7)" /> makes with the positive direction of the x-axis.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} m_{PQ} &= \frac{7 - (-2)}{1 - (-2)} \\ &= \frac{9}{3} \\ &= 3 \end{aligned}" />
                 <BlockMath math="\tan\theta = 3" />
                 <BlockMath math="\theta = \tan^{-1}(3) \approx 71.6^\circ" />
               </div>
             )
           },
           {
              id: "grad-ex3",
              question: (
                <div className="space-y-2">
                  <p>The line AB makes an angle of <InlineMath math="60^\circ" /> with the y-axis. Find the exact value of the gradient of AB.</p>
                  <Ex3Gradient />
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>The angle with the x-axis would be <InlineMath math="90^\circ - 60^\circ = 30^\circ" />.</p>
                  <BlockMath math="\begin{aligned} m &= \tan 30^\circ \\ &= \frac{1}{\sqrt{3}} \end{aligned}" />
                </div>
              )
           },
           {
              id: "grad-ex4",
              question: (
                <div className="space-y-2">
                  <p>Find the size of the angle <InlineMath math="\theta" /> shown in the diagram:</p>
                  <Ex4Gradient />
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>The gradient <InlineMath math="m = 5" /> tells us the angle with the x-axis.</p>
                  <BlockMath math="\tan\alpha = 5" />
                  <BlockMath math="\alpha = \tan^{-1}(5) \approx 78.7^\circ" />
                  <p>The angle <InlineMath math="\theta" /> with the y-axis is <InlineMath math="90^\circ - 78.7^\circ = 11.3^\circ" />.</p>
                </div>
              )
           }
         ]
      },
      {
         id: "parallel-perpendicular",
         title: "Parallel & Perpendicular Gradients",
         videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=1537",
         theory: (
           <div className="space-y-8">
             <h3 className="font-bold text-2xl text-white border-b border-white/10 pb-2 mb-6">Parallel Lines</h3>
             <p className="mb-6">Parallel lines have <strong className="text-white">equal</strong> gradients.</p>
             <div className="flex justify-center w-full mb-12">
               <ParallelLines />
             </div>
             
             <h3 className="font-bold text-2xl text-white border-b border-white/10 pb-2 mb-6">Perpendicular Lines</h3>
             <p className="mb-4">If <InlineMath math="m_{AB} \times m_{CD} = -1" /> then AB & CD are <strong className="text-white">perpendicular</strong>.</p>
             <p className="mb-8">If AB & CD are <strong className="text-white">perpendicular</strong>, then <InlineMath math="m_{AB} \times m_{CD} = -1" />.</p>
             <div className="flex justify-center w-full mb-12">
               <PerpendicularLines />
             </div>

             <h3 className="font-bold text-2xl text-white border-b border-white/10 pb-2 mb-6">Horizontal & Vertical Lines</h3>
             <div className="flex justify-center w-full mb-8">
               <HorizontalVerticalLines />
             </div>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>Negative <em>and</em> reciprocal:</strong> incorrect perpendicular gradients are one of the most common slips in this whole section. Doing only half the operation — flipping the fraction but keeping the sign, or vice versa — is the usual cause. From <InlineMath math="m = \frac{2}{3}" /> the perpendicular gradient is <InlineMath math="-\frac{3}{2}" />.</li>
                 <li><strong>Whole numbers are fractions too:</strong> perpendicular to <InlineMath math="m = 4" /> is <InlineMath math="-\frac{1}{4}" />, not <InlineMath math="-4" />.</li>
                 <li><strong>Get the gradient from the equation first:</strong> if you are given a line as <InlineMath math="3x + 2y = 12" />, rearrange to find <InlineMath math="m" /> before doing anything else.</li>
                 <li><strong>Horizontal and vertical are the exception:</strong> the rule <InlineMath math="m_1 m_2 = -1" /> does not apply. A horizontal line has <InlineMath math="m = 0" /> and its perpendicular is vertical, whose gradient is undefined.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
              id: "perp-ex1",
              question: <p>Given that T is the point <InlineMath math="(1, -2)" /> and S is <InlineMath math="(-4, 5)" />, find the gradient of a line perpendicular to ST.</p>,
              solution: (
                <div className="space-y-4">
                  <BlockMath math="\begin{aligned} m_{ST} &= \frac{5 - (-2)}{-4 - 1} \\ &= \frac{7}{-5} \\ &= -\frac{7}{5} \end{aligned}" />
                  <p>For perpendicular lines, <InlineMath math="m_1 \times m_2 = -1" />.</p>
                  <BlockMath math="m_{\perp} = \frac{5}{7}" />
                </div>
              )
           },
           {
              id: "perp-ex2",
              question: <p>Triangle MOP has vertices <InlineMath math="M(-3, 9)" />, <InlineMath math="O(0, 0)" /> and <InlineMath math="P(12, 4)" />. Show that the triangle is right-angled.</p>,
              solution: (
                <div className="space-y-4">
                  <BlockMath math="\begin{aligned} m_{MO} &= \frac{0 - 9}{0 - (-3)} \\ &= \frac{-9}{3} \\ &= -3 \end{aligned}" />
                  <BlockMath math="\begin{aligned} m_{OP} &= \frac{4 - 0}{12 - 0} \\ &= \frac{4}{12} \\ &= \frac{1}{3} \end{aligned}" />
                  <BlockMath math="\begin{aligned} m_{MO} \times m_{OP} &= -3 \times \frac{1}{3} \\ &= -1 \end{aligned}" />
                  <p>Since the product of the gradients is -1, MO is perpendicular to OP, so the triangle is right-angled at O.</p>
                </div>
              )
           }
         ]
      },
      {
         id: "perpendicular-bisectors",
         title: "Perpendicular Bisectors",
         videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=1922",
         theory: (
           <div className="space-y-8 text-lg">
             <h4 className="font-bold text-white text-xl mb-4">Perpendicular</h4>
             <p className="mb-8">At right angles</p>
             
             <h4 className="font-bold text-white text-xl mb-4">Bisector</h4>
             <p className="mb-2">A line which divides another line into two <strong className="text-white">equal</strong> parts.</p>
             <p className="text-base text-slate-300 mb-8">i.e. a line which cuts through the midpoint of another line.</p>
             
             <h4 className="font-bold text-white text-xl mb-4">Perpendicular Bisector</h4>
             <p className="mb-2">A line which divides another line into two equal parts at right angles.</p>
             <p className="text-base text-slate-300 mb-8">i.e. a line which cuts through the midpoint of another line at right angles.</p>
             
             <div className="flex flex-col gap-8 items-center w-full mb-8">
               <PerpendicularBisectorCross />
               <PerpendicularBisectorTriangle />
             </div>

             <div className="border-t border-white/10 pt-8">
               <h4 className="font-bold text-xl text-white mb-6">To find the equation:</h4>
               <ol className="list-decimal list-inside ml-4 space-y-4">
                  <li>Find the <strong className="text-white">midpoint</strong> of the line.</li>
                  <li>Find the <strong className="text-white">gradient</strong> of the line.</li>
                  <li>Find the <strong className="text-white">perpendicular gradient</strong> (<InlineMath math="m_1 m_2 = -1" />).</li>
                  <li>Use <InlineMath math="y - b = m(x - a)" /> with the midpoint and perpendicular gradient.</li>
               </ol>
             </div>
             
             <div className="pt-8">
               <p className="mb-4">The three perpendicular bisectors of a triangle meet at the <strong className="text-white">circumcentre</strong>.</p>
               <p className="mb-8">The <strong className="text-white">circumcentre</strong> is the centre of the triangle's circumcircle which passes through all vertices of the triangle.</p>
               <div className="flex justify-center w-full">
                 <Circumcentre />
               </div>
             </div>
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>Two steps, both needed:</strong> the midpoint of the line <em>and</em> the perpendicular gradient. Missing either one is the usual way marks are lost.</li>
               <li><strong>Perpendicular means negative reciprocal:</strong> flip the fraction <em>and</em> change the sign — doing only one of the two is the classic error.</li>
               <li><strong>Use the midpoint in the equation:</strong> <InlineMath math="y - b = m(x - a)" /> takes the midpoint, not either original endpoint.</li>
               <li><strong>Set the working out in order:</strong> midpoint, then original gradient, then perpendicular gradient, then equation. Each line should follow from the one above.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
            {
               id: "pbisect-ex1",
               question: <p>A is the point <InlineMath math="(-2, 1)" /> and B is the point <InlineMath math="(4, 7)" />. Find the equation of the perpendicular bisector of AB.</p>,
               solution: (
                 <div className="space-y-4">
                   <p><strong className="text-white">1. Midpoint of AB:</strong></p>
                   <BlockMath math="\begin{aligned} M &= \left(\frac{-2+4}{2}, \frac{1+7}{2}\right) \\ &= (1, 4) \end{aligned}" />
                   <p><strong className="text-white">2. Gradient of AB:</strong></p>
                   <BlockMath math="\begin{aligned} m_{AB} &= \frac{7 - 1}{4 - (-2)} \\ &= \frac{6}{6} \\ &= 1 \end{aligned}" />
                   <p><strong className="text-white">3. Perpendicular Gradient:</strong></p>
                   <BlockMath math="m_{\perp} = -1" />
                   <p><strong className="text-white">4. Equation:</strong></p>
                   <BlockMath math="y - 4 = -1(x - 1)" />
                   <BlockMath math="y - 4 = -x + 1" />
                   <BlockMath math="y = -x + 5 \text{ or } x + y - 5 = 0" />
                 </div>
               )
            }
         ]
      },
      {
          id: "altitudes",
          title: "Altitudes",
          videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=2342",
          theory: (
            <div className="space-y-8 text-lg">
              <p className="mb-8">The <strong className="text-white">altitude</strong> of a triangle is a line drawn from one vertex which meets the opposite side at right angles.</p>
              
              <div className="flex justify-center w-full mb-8">
                <Altitudes />
              </div>

              <div className="border-t border-white/10 pt-8">
                <ol className="list-decimal list-inside ml-4 space-y-4">
                   <li>Find the gradient of the opposite side.</li>
                   <li>Find the perpendicular gradient (<InlineMath math="m_1 m_2 = -1" />).</li>
                   <li>Use <InlineMath math="y - b = m(x - a)" /> using the vertex the altitude drops from.</li>
                </ol>
              </div>

              <div className="pt-8">
                <p className="mb-6">The three altitudes of a triangle meet at the <strong className="text-white">orthocentre</strong>.</p>
                <div className="flex justify-center w-full">
                  <Orthocentre />
                </div>
              </div>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>An altitude is perpendicular to the opposite side:</strong> so you need the gradient of the <em>side</em>, then its negative reciprocal.</li>
                <li><strong>It passes through the opposite vertex:</strong> use the vertex the altitude comes <em>from</em>, not a point on the side it meets.</li>
                <li><strong>Identify the right side:</strong> the altitude from <InlineMath math="A" /> is perpendicular to <InlineMath math="BC" />. Mixing up which vertex pairs with which side wastes the whole question.</li>
                <li><strong>A sketch prevents most errors:</strong> even a rough one makes it obvious which side is opposite which vertex.</li>
              </ul>
            </div>
            </div>
          ),
          examples: [
            {
                id: "alt-ex1",
                question: <p>Triangle ABC has vertices <InlineMath math="A(3, -5)" />, <InlineMath math="B(4, 3)" /> and <InlineMath math="C(-7, 2)" />. Find the equation of the altitude from A.</p>,
                solution: (
                  <div className="space-y-4">
                    <p>The altitude from A meets BC at right angles.</p>
                    <p><strong className="text-white">1. Gradient of BC:</strong></p>
                    <BlockMath math="\begin{aligned} m_{BC} &= \frac{2 - 3}{-7 - 4} \\ &= \frac{-1}{-11} \\ &= \frac{1}{11} \end{aligned}" />
                    <p><strong className="text-white">2. Perpendicular Gradient:</strong></p>
                    <BlockMath math="m_{\perp} = -11" />
                    <p><strong className="text-white">3. Equation (using point A):</strong></p>
                    <BlockMath math="y - (-5) = -11(x - 3)" />
                    <BlockMath math="y + 5 = -11x + 33" />
                    <BlockMath math="y = -11x + 28 \text{ or } 11x + y - 28 = 0" />
                  </div>
                )
            }
          ]
      },
      {
          id: "medians",
          title: "Medians",
          videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=2903",
          theory: (
            <div className="space-y-8 text-lg">
              <div>
                <h4 className="font-bold text-white text-xl mb-4">Median</h4>
                <p className="mb-8">A line which joins a vertex to the midpoint of the opposite side.</p>
              </div>
              
              <div className="flex justify-center w-full mb-8">
                <Medians />
              </div>

              <div className="border-t border-white/10 pt-8">
                <h4 className="font-bold text-xl text-white mb-6">To find the equation:</h4>
                <ol className="list-decimal list-inside ml-4 space-y-4">
                   <li>Find the <strong className="text-white">midpoint</strong> of the opposite side.</li>
                   <li>Find the <strong className="text-white">gradient</strong> between the vertex and the midpoint.</li>
                   <li>Use <InlineMath math="y - b = m(x - a)" /> with either the vertex or the midpoint.</li>
                </ol>
              </div>
              
              <div className="pt-8">
                <p className="mb-6">The three medians of a triangle meet at the <strong className="text-white">centroid</strong>.</p>
                <div className="flex justify-center w-full">
                  <Centroid />
                </div>
              </div>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>A median goes to a midpoint:</strong> so find the midpoint of the opposite side first. No perpendicular gradient is involved — that is an altitude.</li>
                <li><strong>Use the vertex and the midpoint:</strong> the gradient is between those two points, then apply <InlineMath math="y - b = m(x - a)" />.</li>
                <li><strong>Match vertex to opposite side:</strong> the median from <InlineMath math="A" /> goes to the midpoint of <InlineMath math="BC" />.</li>
                <li><strong>Do not confuse the three cevians:</strong> median goes to a midpoint, altitude is perpendicular to the opposite side, perpendicular bisector does both but starts from the midpoint.</li>
              </ul>
            </div>
            </div>
          ),
          examples: [
             {
                 id: "med-ex1",
                 question: <p>Triangle ABC has vertices <InlineMath math="A(4, -9)" />, <InlineMath math="B(10, 2)" /> and <InlineMath math="C(4, -4)" />. Find the equation of the median from A.</p>,
                 solution: (
                   <div className="space-y-4">
                     <p>The median from A meets the midpoint of BC.</p>
                     <p><strong className="text-white">1. Midpoint of BC:</strong></p>
                     <BlockMath math="\begin{aligned} M &= \left(\frac{10+4}{2}, \frac{2-4}{2}\right) \\ &= (7, -1) \end{aligned}" />
                     <p><strong className="text-white">2. Gradient from A to M:</strong></p>
                     <BlockMath math="\begin{aligned} m_{AM} &= \frac{-1 - (-9)}{7 - 4} \\ &= \frac{8}{3} \end{aligned}" />
                     <p><strong className="text-white">3. Equation (using point A):</strong></p>
                     <BlockMath math="y - (-9) = \frac{8}{3}(x - 4)" />
                     <BlockMath math="3(y + 9) = 8(x - 4)" />
                     <BlockMath math="3y + 27 = 8x - 32" />
                     <BlockMath math="3y = 8x - 59 \text{ or } 8x - 3y - 59 = 0" />
                   </div>
                 )
             }
          ]
      },
      {
          id: "intersections",
          title: "Points of Intersection",
          videoUrl: "https://www.youtube.com/embed/gHtYHW9h4ek?start=3276",
          theory: (
            <div className="space-y-4">
              <p>Many problems involve lines which intersect (cross each other). Once we have equations for the lines, there are three ways of calculating the point of intersection using simultaneous equations:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300">
                <li>Elimination</li>
                <li>Equating</li>
                <li>Substitution</li>
              </ul>
              <p>Use whichever method is most efficient for the problem you are tackling.</p>
              
              <div className="mt-6 border border-white/10 rounded-xl overflow-hidden bg-black/20">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Line Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Point Used</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Gradient Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                    <tr>
                      <td className="px-4 py-3">Perpendicular Bisector of AB</td>
                      <td className="px-4 py-3">Midpoint of AB</td>
                      <td className="px-4 py-3"><InlineMath math="m_{\perp}" /> from <InlineMath math="m_{AB}" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Altitude from C</td>
                      <td className="px-4 py-3">Vertex C</td>
                      <td className="px-4 py-3"><InlineMath math="m_{\perp}" /> from <InlineMath math="m_{AB}" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Median from C</td>
                      <td className="px-4 py-3">Vertex C and Midpoint of AB</td>
                      <td className="px-4 py-3"><InlineMath math="m" /> between C and Midpoint of AB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg mt-4">
                <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Substitution is usually the faster route:</strong> candidates reach for <em>elimination</em> out of habit where substitution is far quicker, and the extra steps invite errors. If one equation is already in the form <InlineMath math="y = \ldots" />, substitute it.</li>
                  <li><strong>Do not score out terms mid-line:</strong> scoring out terms in simultaneous equations produces lines of working that no longer follow from each other, and that costs marks even when the answer is right. Write each new equation out in full.</li>
                  <li><strong>Answer as coordinates:</strong> finding <InlineMath math="x" /> is half the job. Substitute back for <InlineMath math="y" /> and give the point.</li>
                  <li><strong>Check in the other equation:</strong> substituting your point into the equation you did <em>not</em> use catches most arithmetic slips in seconds.</li>
                </ul>
              </div>
            </div>
          ),
          examples: [
              {
                  id: "int-ex1",
                  question: (
                    <div className="space-y-4">
                      <p>Triangle PQR has vertices <InlineMath math="P(8, 3)" />, <InlineMath math="Q(-1, 6)" /> and <InlineMath math="R(2, -3)" />.</p>
                      <IntersectionExample />
                      <ol className="list-[lower-alpha] list-inside ml-4 space-y-1">
                        <li>Find the equation of altitude QS.</li>
                        <li>Find the equation of median RT.</li>
                        <li>Hence find the coordinates of M (the point of intersection of QS and RT).</li>
                      </ol>
                    </div>
                  ),
                  solution: (
                    <div className="space-y-4">
                      <p><strong className="text-white">a) Altitude QS</strong></p>
                      <BlockMath math="\begin{aligned} m_{PR} &= \frac{-3 - 3}{2 - 8} \\ &= \frac{-6}{-6} \\ &= 1 \end{aligned}" />
                      <BlockMath math="m_{\perp} = -1" />
                      <BlockMath math="y - 6 = -1(x - (-1))" />
                      <BlockMath math="y - 6 = -x - 1 \implies x + y = 5 \text{ (1)}" />
                      
                      <div className="my-6 border-t border-white/10" />
                      
                      <p><strong className="text-white">b) Median RT</strong></p>
                      <p>Midpoint of PQ (T):</p>
                      <BlockMath math="\begin{aligned} T &= \left(\frac{8 + (-1)}{2}, \frac{3 + 6}{2}\right) \\ &= \left(\frac{7}{2}, \frac{9}{2}\right) \end{aligned}" />
                      <BlockMath math="\begin{aligned} m_{RT} &= \frac{\frac{9}{2} - (-3)}{\frac{7}{2} - 2} \\ &= \frac{\frac{15}{2}}{\frac{3}{2}} \\ &= 5 \end{aligned}" />
                      <BlockMath math="y - (-3) = 5(x - 2)" />
                      <BlockMath math="y + 3 = 5x - 10" />
                      <BlockMath math="y = 5x - 13 \text{ (2)}" />

                      <div className="my-6 border-t border-white/10" />
                      
                      <p><strong className="text-white">c) Point of Intersection M</strong></p>
                      <p>Substitute (2) into (1):</p>
                      <BlockMath math="x + (5x - 13) = 5" />
                      <BlockMath math="\begin{aligned} 6x - 13 &= 5 \\ 6x &= 18 \\ x &= 3 \end{aligned}" />
                      <p>Substitute <InlineMath math="x=3" /> back into (2):</p>
                      <BlockMath math="y = 5(3) - 13 = 15 - 13 = 2" />
                      <p>The coordinates of M are <InlineMath math="(3, 2)" />.</p>
                    </div>
                  )
              }
          ]
      }
    ]
  },
  {
    id: "recurrence-relations",
    title: "Recurrence Relations",
    topics: [
      {
        id: "intro",
        title: "Introduction",
        videoUrl: "https://www.youtube.com/embed/Y3eGTMlMgNs?start=0",
        theory: (
          <div className="space-y-4">
            <p>A <strong>recurrence relation</strong> is a type of recursive sequence which relies on knowing the previous term in order to obtain the next consecutive term.</p>
            <p className="text-slate-300 italic">i.e. if we wanted to know the <InlineMath math="100^{th}" /> term in a sequence, we would need to know the first 99 terms.</p>
            
            <p className="mt-4">e.g. For the sequence 1, 5, 9, 13, ...</p>
            <p><InlineMath math="U_0 = 1" /> where <InlineMath math="U_0" /> is the initial term in the sequence.</p>
            <p><strong>Rule:</strong> add 4 to previous term</p>
            <p>i.e. <InlineMath math="U_{n+1} = U_n + 4" /></p>
            
            <div className="bg-white/5 p-4 rounded-xl mt-6 border border-white/10 text-lg">
                <p>An example of a recurrence relation is gaining compound interest on money in a bank account.</p>
                <p className="mt-2">You invest £100 in a bank account with an interest rate of 2%.</p>
                <ul className="list-none space-y-2 mt-4 font-mono text-slate-300">
                  <li><InlineMath math="U_0 = 100" /></li>
                  <li><InlineMath math="U_1 = 102\% \text{ of } 100 = 1.02 \times 100 = 102" /></li>
                  <li><InlineMath math="U_2 = 102\% \text{ of } 102 = 1.02 \times 102 = 104.04" /></li>
                  <li><InlineMath math="U_3 = 102\% \text{ of } 104.04 = 1.02 \times 104.04 = 106.12" /></li>
                </ul>
                <p className="mt-4">i.e. <InlineMath math="U_{n+1} = 1.02U_n, \ U_0 = 100" /> where <InlineMath math="U_n" /> is the amount in the bank account after <InlineMath math="n" /> years.</p>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong><InlineMath math="u_0" /> or <InlineMath math="u_1" />?</strong> read which term the sequence starts from. Being one term out runs through the entire rest of the question.</li>
              <li><strong>Each term depends on the one before:</strong> you cannot jump to the tenth term without generating the ones in between, unless a formula is given.</li>
              <li><strong>Keep full accuracy:</strong> rounding each term compounds the error quickly. Carry the decimals through.</li>
              <li><strong>Read the context carefully:</strong> "10% is removed" means multiplying by 0.9, not subtracting 10.</li>
            </ul>
          </div>
          </div>
        ),
        examples: []
      },
      {
        id: "linear-recurrence-relations",
        title: "Linear Recurrence Relations",
        videoUrl: "https://www.youtube.com/embed/Y3eGTMlMgNs?start=82",
        theory: (
          <div className="space-y-6">
            <p className="text-xl">Linear recurrence relations are of the form:</p>
            <div className="bg-indigo-500/10 p-6 rounded-xl border border-indigo-500/20 text-center">
              <BlockMath math="U_{n+1} = aU_n + b" />
              <p className="text-slate-300 mt-2">where <InlineMath math="U_0" /> is the initial value</p>
              <p className="font-bold my-4">or</p>
              <BlockMath math="U_n = aU_{n-1} + b" />
              <p className="text-slate-300 mt-2">where <InlineMath math="U_1" /> is the initial value</p>
              <p className="mt-4 text-indigo-300"><InlineMath math="a \neq 0 \text{ and } b \in \mathbb{R}" /></p>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Identify <InlineMath math="a" /> and <InlineMath math="b" /> from the words:</strong> <InlineMath math="a" /> is the multiplier and <InlineMath math="b" /> the amount added each time. Percentage changes belong in <InlineMath math="a" />, fixed quantities in <InlineMath math="b" />.</li>
              <li><strong>A decrease of 20% means <InlineMath math="a = 0.8" />:</strong> not <InlineMath math="-0.2" />. The multiplier is what remains.</li>
              <li><strong>Apply the operations in the stated order:</strong> whether the fixed amount is added before or after the percentage change changes the answer.</li>
              <li><strong>Define your terms:</strong> say what <InlineMath math="u_n" /> represents and in what units — a bare recurrence relation does not answer a context question.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "lrr-ex1",
            question: (
                <div className="space-y-2">
                  <p>A sequence is defined by the recurrence relation <InlineMath math="U_{n+1} = 0.6U_n + 4" /> with <InlineMath math="U_0 = 7" />.</p>
                  <p>a) Calculate the value of <InlineMath math="U_3" />.</p>
                  <p>b) Find the smallest value of <InlineMath math="n" /> for which <InlineMath math="U_n > 9.7" />.</p>
                </div>
            ),
            solution: (
              <div className="space-y-4">
                 <p><strong>a)</strong></p>
                 <BlockMath math="U_1 = 0.6(7) + 4 = 8.2" />
                 <BlockMath math="U_2 = 0.6(8.2) + 4 = 8.92" />
                 <BlockMath math="U_3 = 0.6(8.92) + 4 = 9.352" />
                 <div className="h-px w-full bg-white/10 my-4"></div>
                 <p><strong>b)</strong> Continue calculating terms:</p>
                 <BlockMath math="U_4 = 0.6(9.352) + 4 = 9.6112" />
                 <BlockMath math="U_5 = 0.6(9.6112) + 4 = 9.76672" />
                 <p className="mt-2 text-indigo-300">We see that <InlineMath math="U_5 > 9.7" />. The smallest value of <InlineMath math="n" /> is <InlineMath math="5" />.</p>
              </div>
            )
          },
          {
            id: "lrr-ex2",
            question: (
                <div className="space-y-2">
                  <p>A patient is injected with 156 ml of a drug. Every 8 hours, 22% of the drug passes out of his bloodstream.</p>
                  <p>To compensate, a further 25 ml dose is given every 8 hours.</p>
                  <p>a) Find a recurrence relation for the amount of drug in his bloodstream.</p>
                  <p>b) Calculate the amount of drug remaining after 24 hours.</p>
                </div>
            ),
            solution: (
              <div className="space-y-4">
                 <p><strong>a)</strong> 22% is lost, meaning 78% remains (<InlineMath math="0.78" />).</p>
                 <p>An extra 25 ml is added.</p>
                 <BlockMath math="U_{n+1} = 0.78U_n + 25, \quad U_0 = 156" />
                 <div className="h-px w-full bg-white/10 my-4"></div>
                 <p><strong>b)</strong> 24 hours implies 3 periods of 8 hours (so we need <InlineMath math="U_3" />).</p>
                 <BlockMath math="U_1 = 0.78(156) + 25 = 146.68" />
                 <BlockMath math="U_2 = 0.78(146.68) + 25 = 139.4104" />
                 <BlockMath math="U_3 = 0.78(139.4104) + 25 = 133.740112" />
                 <p className="mt-2 text-indigo-300">Amount of drug remaining after 24 hours is approximately <strong className="text-white">133.74 ml</strong>.</p>
              </div>
            )
          }
        ]
      },
      {
         id: "solving-recurrence-relations",
         title: "Solving Recurrence Relations",
         videoUrl: "https://www.youtube.com/embed/Y3eGTMlMgNs?start=466",
         theory: (
           <div className="space-y-4">
             <p className="text-lg">If a sequence is defined by a linear recurrence relation <InlineMath math="U_{n+1} = aU_n + b" /> with unknowns <InlineMath math="a" /> and <InlineMath math="b" />, but we know several terms of the sequence, then we can find the values of <InlineMath math="a" /> and <InlineMath math="b" />.</p>
             <p className="font-bold text-white text-xl mt-4">We can then solve for <InlineMath math="a" /> and <InlineMath math="b" /> using simultaneous equations.</p>
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>Two unknowns need two equations:</strong> use two consecutive pairs of terms to form simultaneous equations in <InlineMath math="a" /> and <InlineMath math="b" />.</li>
               <li><strong>Subtract to eliminate <InlineMath math="b" />:</strong> since <InlineMath math="b" /> appears with the same coefficient in both, subtracting one equation from the other leaves <InlineMath math="a" /> alone.</li>
               <li><strong>Substitute back for <InlineMath math="b" />:</strong> and check both original equations, which catches arithmetic errors immediately.</li>
               <li><strong>Keep lines consistent:</strong> write each equation out in full rather than scoring terms out, so every line follows from the one above.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
             id: "srr-ex1",
             question: (
                 <div className="space-y-2">
                   <p>A sequence is defined by <InlineMath math="U_{n+1} = aU_n + b" /> with</p>
                   <p><InlineMath math="U_1 = 4,\ U_2 = 3.6 \text{ and } U_3 = 2.04" />.</p>
                   <p>Find the values of <InlineMath math="a" /> and <InlineMath math="b" />.</p>
                 </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p>Set up two equations using the known terms:</p>
                 <BlockMath math="\text{(1)}\quad 3.6 = 4a + b" />
                 <BlockMath math="\text{(2)}\quad 2.04 = 3.6a + b" />
                 <div className="h-px w-full bg-white/10 my-4"></div>
                 <p>Subtract (2) from (1):</p>
                 <BlockMath math="1.56 = 0.4a \implies a = 3.9" />
                 <div className="h-px w-full bg-white/10 my-4"></div>
                 <p>Substitute <InlineMath math="a=3.9" /> into (1):</p>
                 <BlockMath math="3.6 = 4(3.9) + b" />
                 <BlockMath math="3.6 = 15.6 + b \implies b = -12" />
                 <p className="mt-4 text-indigo-300">So <InlineMath math="a = 3.9" /> and <InlineMath math="b = -12" />.</p>
               </div>
             )
           }
         ]
       },
       {
         id: "limit-of-a-sequence",
         title: "Limit of a Sequence",
         videoUrl: "https://www.youtube.com/embed/Y3eGTMlMgNs?start=650",
         theory: (
           <div className="space-y-8">
             <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
               <h4 className="font-bold text-red-400 text-2xl mb-4">Divergence</h4>
               <p>If we have a recurrence relation of the form <InlineMath math="U_{n+1} = aU_n + b" /></p>
               <p className="mt-2">where <InlineMath math="a < -1 \text{ or } a > 1" /> then the sequence will <strong className="text-red-400">diverge</strong>.</p>
               <p className="text-red-300/80 italic mt-2">i.e. it will keep increasing, decreasing or oscillating.</p>
             </div>
             
             <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
               <h4 className="font-bold text-emerald-400 text-2xl mb-4">Convergence</h4>
               <p>If we have a recurrence relation of the form <InlineMath math="U_{n+1} = aU_n + b" /></p>
               <p className="mt-2">where <InlineMath math="-1 < a < 1" /> then the sequence will <strong className="text-emerald-400">converge</strong> to a limit.</p>
               <p className="text-emerald-300/80 italic mt-2">i.e. it will settle at approximately the same value.</p>
             </div>
             
             <div className="bg-white/5 p-6 rounded-xl border border-white/10">
               <h4 className="font-bold text-white text-2xl mb-4">Limit of a Sequence</h4>
               <p>For convergent sequences defined by <InlineMath math="U_{n+1} = aU_n + b" /> with <InlineMath math="-1 < a < 1" />, <InlineMath math="U_n" /> tends to a limit <InlineMath math="L" /> as <InlineMath math="n \to \infty" />.</p>
               <div className="mt-6 flex flex-col items-center">
                 <BlockMath math="L = aL + b" />
                 <BlockMath math="L - aL = b" />
                 <BlockMath math="L(1 - a) = b" />
                 <div className="border-t border-white/20 pt-4 mt-2 w-full max-w-xs text-center">
                   <BlockMath math="L = \frac{b}{1 - a}" />
                 </div>
               </div>
             </div>
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>A limit exists only when <InlineMath math="-1 \lt a \lt 1" />:</strong> state this condition. Quoting a limit without justifying that it exists loses marks.</li>
               <li><strong><InlineMath math="L = \frac{b}{1-a}" />:</strong> note it is <InlineMath math="1-a" /> on the bottom, not <InlineMath math="a-1" />. Getting this the wrong way round flips the sign.</li>
               <li><strong>The limit does not depend on the starting value:</strong> <InlineMath math="u_0" /> affects how fast you get there, not where you end up.</li>
               <li><strong>Interpret it in context:</strong> say what the limit means in the situation described — a long-term level, not just a number.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
             id: "lim-ex1",
             question: (
                 <div className="space-y-2">
                   <p>A sequence is defined by <InlineMath math="U_n = 0.6U_{n-1} + 5" /> with <InlineMath math="U_1 = 10" />.</p>
                   <p>a) Does the sequence have a limit as <InlineMath math="n \to \infty" />?</p>
                   <p>b) Calculate this limit if it exists.</p>
                 </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>a)</strong> Yes, a limit exists because <InlineMath math="-1 < 0.6 < 1" />.</p>
                 <div className="h-px w-full bg-white/10 my-4"></div>
                 <p><strong>b)</strong> Using the formula <InlineMath math="L = \frac{b}{1 - a}" />:</p>
                 <BlockMath math="\begin{aligned} L &= \frac{5}{1 - 0.6} \\ &= \frac{5}{0.4} \\ &= 12.5 \end{aligned}" />
                 <p className="text-indigo-300 mt-2">The limit is <strong className="text-white">12.5</strong>.</p>
               </div>
             )
           },
           {
             id: "lim-ex2",
             question: (
                 <div className="space-y-4 text-emerald-100">
                   <p>The deer population in a forest is estimated to drop by 7.3% each year.</p>
                   <p>Each year, 20 deer are introduced to the forest. The initial deer population is 200.</p>
                   <p className="text-white">a) How many deer will there be in the forest after 3 years?</p>
                   <p className="text-white">b) What is the long-term effect on the population?</p>
                 </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>a)</strong> Dropping by 7.3% means multiplying by <InlineMath math="1 - 0.073 = 0.927" />. Adding 20 each year.</p>
                 <BlockMath math="U_{n+1} = 0.927U_n + 20, \quad U_0 = 200" />
                 <BlockMath math="U_1 = 0.927(200) + 20 = 205.4" />
                 <BlockMath math="U_2 = 0.927(205.4) + 20 = 210.4058" />
                 <BlockMath math="U_3 = 0.927(210.4058) + 20 \approx 215.046" />
                 <p className="text-emerald-300 mt-2">There will be approximately <strong className="text-white">215</strong> deer after 3 years.</p>
                 
                 <div className="h-px w-full bg-white/10 my-4"></div>
                 
                 <p><strong>b)</strong> To find the long-term effect, calculate the limit:</p>
                 <p>Limit exists since <InlineMath math="-1 < 0.927 < 1" />.</p>
                 <BlockMath math="\begin{aligned} L &= \frac{b}{1 - a} \\ &= \frac{20}{1 - 0.927} \\ &= \frac{20}{0.073} \\ &\approx 273.97 \end{aligned}" />
                 <p className="text-emerald-300 mt-2">The population will settle at around <strong className="text-white">274</strong> deer.</p>
               </div>
             )
           }
         ]
       },
       {
         id: "problems-in-context",
         title: "Problems in Context",
         videoUrl: "https://www.youtube.com/embed/Y3eGTMlMgNs?start=1175",
         theory: (
           <div className="space-y-4 text-slate-300">
             <p>Recurrence relations are most often examined through a real situation — a population, a drug dose, a bank balance, a pollutant in a loch. The mathematics is exactly the same as before; the difficulty is turning the words into <InlineMath math="u_{n+1} = au_n + b" />.</p>
             <p>Read the description for two separate things:</p>
             <ul className="list-disc list-inside space-y-1 ml-4">
               <li>a <strong>proportional</strong> change — a percentage rise or fall, which becomes the multiplier <InlineMath math="a" />;</li>
               <li>a <strong>fixed</strong> change — a quantity added or removed each period, which becomes <InlineMath math="b" />.</li>
             </ul>
             <p>A fall of 15% leaves 85%, so <InlineMath math="a = 0.85" />; a rise of 15% gives <InlineMath math="a = 1.15" />. A quantity removed each time makes <InlineMath math="b" /> negative.</p>
             <p>The long-term behaviour question — &ldquo;will the level ever exceed…&rdquo;, &ldquo;what happens in the long run&rdquo; — is asking for the <strong>limit</strong>, which requires <InlineMath math="-1 \lt a \lt 1" />.</p>
             <p><strong>The Golden Rule:</strong> always say what <InlineMath math="u_n" /> stands for, including its units and the period it covers. A recurrence relation with undefined terms does not answer a context question.</p>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>Translate the words carefully:</strong> &ldquo;increases by 5% then 200 are removed&rdquo; gives <InlineMath math="u_{n+1} = 1.05u_n - 200" />. Order and sign both matter.</li>
                 <li><strong>Answer the question that was asked:</strong> often the useful answer is whether a level is safe or sustainable, not the value of <InlineMath math="u_{10}" />. Read to the end.</li>
                 <li><strong>Compare with the limit to justify:</strong> a long-term claim needs the limit and the condition <InlineMath math="-1 \lt a \lt 1" />, not a list of terms.</li>
                 <li><strong>Watch which term the question wants:</strong> &ldquo;after 4 years&rdquo; may be <InlineMath math="u_4" /> or <InlineMath math="u_3" /> depending on where the sequence starts.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
             id: "pic-ex1",
             question: (
                 <div className="space-y-4 bg-indigo-500/5 p-4 rounded-lg">
                   <p>A bank has a sales drive in order to attract new customers. Every 6 month period, the bank estimates that it loses 1.7% of its customers to competitors but attracts 8000 new customers. It has 0.5 million customers at the start of its sales drive.</p>
                   <ul className="space-y-2 mt-4 ml-4">
                     <li>a) How many customers will the bank have in 4 years?</li>
                     <li>b) What will happen to the number of customers in the long term if the current sales drive continued?</li>
                     <li>c) How many new customers would the bank have to attract in each 6 month period to maintain 0.5 million customers?</li>
                   </ul>
                 </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>a)</strong> Recurrence relation: <InlineMath math="U_{n+1} = 0.983U_n + 8000" /> where <InlineMath math="U_0 = 500{,}000" />.</p>
                 <p className="text-slate-300 italic">4 years means 8 periods of 6 months (<InlineMath math="n = 8" />).</p>
                 <BlockMath math="U_1 = 0.983(500{,}000) + 8000 = 499{,}500" />
                 <BlockMath math="\vdots" />
                 <BlockMath math="U_8 \approx 496{,}252.17" />
                 <p className="text-indigo-300 mt-2">The bank will have approximately <strong className="text-white">496,252</strong> customers.</p>

                 <div className="h-px w-full bg-white/10 my-6"></div>

                 <p><strong>b)</strong> Long term limit:</p>
                 <BlockMath math="\begin{aligned} L &= \frac{8000}{1 - 0.983} \\ &= \frac{8000}{0.017} \\ &\approx 470{,}588 \end{aligned}" />
                 <p className="text-indigo-300 mt-2">The number of customers will fall and settle at approximately <strong className="text-white">470,588</strong>.</p>

                 <div className="h-px w-full bg-white/10 my-6"></div>

                 <p><strong>c)</strong> To maintain 0.5 million customers, the limit must be 500,000.</p>
                 <BlockMath math="\begin{aligned} 500{,}000 &= \frac{b}{1 - 0.983} \\ 500{,}000 &= \frac{b}{0.017} \\ b &= 500{,}000 \times 0.017 \\ &= 8500 \end{aligned}" />
                 <p className="text-indigo-300 mt-2">The bank would need to attract <strong className="text-white">8500</strong> new customers each 6 month period.</p>
               </div>
             )
           }
         ]
       }
    ]
  },
  {
    id: "functions-and-graphs",
    title: "Functions & Graphs",
    topics: [
      {
        id: "intro-domain-range",
        title: "Introduction, Domain & Range",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=282",
        theory: (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Introduction To Functions & Sets</h3>
            <p>A <strong>function</strong> is a rule which connects one set of numbers to another.</p>
            <p>A function can be expressed in the following forms:</p>
            <ul className="list-disc list-inside ml-4 marker:text-slate-400">
              <li>Table</li>
              <li>Graph</li>
              <li>Arrow diagram</li>
              <li>Formula</li>
            </ul>
            <div className="bg-slate-500/10 p-4 rounded-xl border border-slate-500/20 mt-4">
              <h4 className="font-bold text-slate-200 mb-2">Notation</h4>
              <p><InlineMath math="f(x) = \dots" /> i.e. f of x</p>
              <p><InlineMath math="g(u) = \dots" /> i.e. g of u</p>
            </div>
            <p className="mt-4">
              A function is a relation between two sets where each member of the first set is related to <strong>only one</strong> member of the second set.
            </p>

            <div className="h-px w-full bg-white/10 my-4"></div>

            <h3 className="text-xl font-bold text-white mt-6">Domain of a Function</h3>
            <p>The domain of a function is the set of all possible input values (x-values) for which the function is defined.</p>
            
            <div className="flex flex-col gap-6 mt-4">
              <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 text-lg mb-2">Division by Zero</h4>
                <p className="text-base text-slate-300">Since we cannot divide any number by zero, the domains of functions involving fractions must exclude numbers which would result in a denominator of zero.</p>
                <div className="mt-4 space-y-2">
                  <p><InlineMath math="f(x) = \frac{3}{x} \implies x \neq 0" /></p>
                  <p><InlineMath math="f(x) = \frac{2}{10-x} \implies x \neq 10" /></p>
                  <p><InlineMath math="f(x) = \frac{2x+1}{x^2-4x} \implies x \neq 0, x \neq 4" /></p>
                </div>
              </div>
              <div className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/20">
                <h4 className="font-bold text-emerald-400 text-lg mb-2">Even Roots</h4>
                <p className="text-base text-slate-300">We cannot evaluate an even root of a negative number. The domain must exclude numbers which would result in negative numbers under the root.</p>
                <div className="mt-4 space-y-2">
                  <p><InlineMath math="f(x) = \sqrt{x} \implies x \geq 0" /></p>
                  <p><InlineMath math="f(x) = \sqrt{x-4} \implies x \geq 4" /></p>
                  <p><InlineMath math="f(x) = \frac{2x+1}{\sqrt{x-4}} \implies x > 4" /></p>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-4"></div>

            <h3 className="text-xl font-bold text-white mt-6">Range of a Function</h3>
            <p>The range of a function is the spread of possible y-values (outputs).</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 font-bold text-white">Function</th>
                      <th className="pb-2 font-bold text-white">Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr><td className="py-2"><InlineMath math="f(x) = \cos x" /></td><td className="py-2"><InlineMath math="-1 \leq f(x) \leq 1" /></td></tr>
                    <tr><td className="py-2"><InlineMath math="f(x) = x^2 + 4" /></td><td className="py-2"><InlineMath math="f(x) \geq 4" /></td></tr>
                    <tr><td className="py-2"><InlineMath math="f(x) = \sqrt{x}" /></td><td className="py-2"><InlineMath math="f(x) \geq 0" /></td></tr>
                    <tr><td className="py-2"><InlineMath math="f(x) = \sqrt{x} - 2" /></td><td className="py-2"><InlineMath math="f(x) \geq -2" /></td></tr>
                    <tr><td className="py-2"><InlineMath math="f(x) = x^3" /></td><td className="py-2"><InlineMath math="f(x) \in \mathbb{R}" /></td></tr>
                  </tbody>
                </table>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>State the condition, not just the domain.</strong> Marks are routinely lost by giving the domain without saying <em>why</em> it is restricted. Name the value that breaks it: a denominator of zero, or a negative under a square root.</li>
                <li><strong>Denominators:</strong> for <InlineMath math="f(x) = \frac{1}{x-3}" /> the function is undefined at <InlineMath math="x = 3" />, so the domain is all real <InlineMath math="x" /> except 3. Set the denominator equal to zero to find it.</li>
                <li><strong>Square roots:</strong> for <InlineMath math="\sqrt{g(x)}" /> you need <InlineMath math="g(x) \geq 0" /> — solve that inequality rather than guessing.</li>
                <li><strong>Domain is inputs, range is outputs:</strong> writing one when the question asks for the other loses the mark even when the numbers are right.</li>
              </ul>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "composite-functions",
        title: "Composite Functions",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=1518",
        theory: (
          <div className="space-y-4">
            <p>A <strong>composite function</strong> is when one function is 'inside' another function.</p>
            <p className="mt-2 text-slate-300">It is formed by applying one function to the result of another.</p>
            <p>e.g., <InlineMath math="g(f(x))" /> means you compute <InlineMath math="f(x)" /> first, and plug the result into <InlineMath math="g" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Order matters:</strong> <InlineMath math="f(g(x))" /> means do <InlineMath math="g" /> first, then <InlineMath math="f" />. Reading it left to right and applying <InlineMath math="f" /> first is the standard error, and gives a completely different function.</li>
              <li><strong>Substitute the whole function:</strong> every <InlineMath math="x" /> in the outer function is replaced by the entire inner expression, in brackets.</li>
              <li><strong>Use brackets, then expand:</strong> <InlineMath math="f(x) = x^2" /> with <InlineMath math="g(x) = x+3" /> gives <InlineMath math="(x+3)^2" />, which is <em>not</em> <InlineMath math="x^2+9" />.</li>
              <li><strong><InlineMath math="f(g(x))" /> rarely equals <InlineMath math="g(f(x))" />:</strong> if a question asks you to show they are equal, that is a special result worth checking carefully.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "comp-ex1",
            question: (
              <div className="space-y-2">
                <p>Functions <InlineMath math="f" /> and <InlineMath math="g" /> are defined by <InlineMath math="f(x) = 2x" /> and <InlineMath math="g(x) = x - 3" />.</p>
                <p>Both are defined on suitable domains.</p>
                <p>a) Find <InlineMath math="f(g(x))" />.</p>
                <p>b) Find <InlineMath math="g(f(x))" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong> To find <InlineMath math="f(g(x))" />, substitute <InlineMath math="g(x)" /> into <InlineMath math="f" />:</p>
                <BlockMath math="f(g(x)) = f(x - 3)" />
                <BlockMath math="f(g(x)) = 2(x - 3) = 2x - 6" />
                <div className="h-px w-full bg-white/10 my-4"></div>
                <p><strong>b)</strong> To find <InlineMath math="g(f(x))" />, substitute <InlineMath math="f(x)" /> into <InlineMath math="g" />:</p>
                <BlockMath math="g(f(x)) = g(2x)" />
                <BlockMath math="g(f(x)) = (2x) - 3 = 2x - 3" />
              </div>
            )
          },
          {
            id: "comp-ex2",
            question: (
              <div className="space-y-2">
                <p>Functions <InlineMath math="f(x) = x^3 + 3" /> and <InlineMath math="g(x) = \frac{1}{x}" /> are defined on suitable domains.</p>
                <p>Find formulae for <InlineMath math="h(x) = f(g(x))" /> and <InlineMath math="k(x) = (g \circ f)(x)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>For <InlineMath math="h(x) = f(g(x))" />:</p>
                <BlockMath math="f(g(x)) = f\left(\frac{1}{x}\right)" />
                <BlockMath math="h(x) = \left(\frac{1}{x}\right)^3 + 3 = \frac{1}{x^3} + 3" />
                
                <div className="h-px w-full bg-white/10 my-4"></div>
                
                <p>For <InlineMath math="k(x) = g(f(x))" />:</p>
                <BlockMath math="g(f(x)) = g(x^3 + 3)" />
                <BlockMath math="k(x) = \frac{1}{x^3 + 3}" />
              </div>
            )
          },
          {
            id: "comp-ex3",
            question: (
              <div className="space-y-4">
                <p><strong>Example 3 – Composite Functions with Fractions</strong></p>
                <p>Functions <InlineMath math="f" />, <InlineMath math="g" /> and <InlineMath math="h" /> are defined by <InlineMath math="f(x) = \frac{x}{1-x}" />, <InlineMath math="g(x) = \frac{1}{x}" /> and <InlineMath math="h(x) = \frac{1}{1-x}" />. All are defined on suitable domains.</p>
                <p>a) Find <InlineMath math="f(g(x))" />.</p>
                <p>b) Find <InlineMath math="f(h(x))" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong> Substitute <InlineMath math="g(x)" /> into <InlineMath math="f" />:</p>
                <BlockMath math="\begin{aligned} f(g(x)) &= f\left(\frac{1}{x}\right) \\ &= \frac{\frac{1}{x}}{1 - \frac{1}{x}} \end{aligned}" />
                <p>Multiply numerator and denominator by <InlineMath math="x" />:</p>
                <BlockMath math="f(g(x)) = \frac{1}{x - 1}" />
                
                <div className="h-px w-full bg-white/10 my-4"></div>
                
                <p><strong>b)</strong> Substitute <InlineMath math="h(x)" /> into <InlineMath math="f" />:</p>
                <BlockMath math="\begin{aligned} f(h(x)) &= f\left(\frac{1}{1-x}\right) \\ &= \frac{\frac{1}{1-x}}{1 - \frac{1}{1-x}} \end{aligned}" />
                <p>Multiply numerator and denominator by <InlineMath math="(1-x)" />:</p>
                <BlockMath math="\begin{aligned} f(h(x)) &= \frac{1}{(1-x) - 1} \\ &= \frac{1}{-x} \\ &= -\frac{1}{x} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "inverse-functions",
        title: "Inverse Functions",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=3542",
        theory: (
          <div className="space-y-4">
            <p><strong>Inverse Functions</strong> 'reverse' each other.</p>
            <p>If a function is defined on a suitable domain, then it will have an inverse function.</p>
            <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 mt-4 text-center">
              <p>The domain of an inverse function is the range of the original function and vice versa.</p>
              <p className="mt-2 text-indigo-300"><InlineMath math="f^{-1}(f(x)) = x" /></p>
            </div>
            <div className="mt-6 flex flex-col gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
               {/* Box Diagrams manually recreated to look like the uploaded image */}
               <div className="flex flex-col md:flex-row items-center gap-4 min-w-[600px] justify-center text-sm md:text-base">
                 <div className="font-mono">x = 5</div>
                 <div className="flex-1 max-w-[40px] h-0 border-t-2 border-white/40 border-dashed relative"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div>
                 <div className="px-6 py-4 border-2 border-white text-center bg-transparent shrink-0"><InlineMath math="f(x) = 3x - 1" /></div>
                 <div className="font-mono flex items-center relative gap-2"><div className="flex-1 min-w-[30px] h-0 border-t-2 border-white/40 border-dashed relative"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div><span className="-ml-6 mt-6 whitespace-nowrap text-xs"><InlineMath math="f(5) =" /></span></div>
                 <div className="px-6 py-4 border-2 border-white text-center bg-transparent shrink-0"><InlineMath math="g(x) = \frac{x+1}{3}" /></div>
                 <div className="flex flex-col text-xs font-mono items-start">
                    <div className="flex items-center"><div className="w-10 h-0 border-t-2 border-white/40 relative mr-2"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div><InlineMath math="g(14) =" /></div>
                    <div className="flex items-center"><div className="w-10 h-0 border-t-2 border-white/40 relative mr-2"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div><InlineMath math="g(f(5)) =" /></div>
                 </div>
               </div>
               
               <div className="flex flex-col md:flex-row items-center gap-4 min-w-[600px] justify-center text-sm md:text-base">
                 <div className="font-mono">x</div>
                 <div className="flex-1 max-w-[40px] h-0 border-t-2 border-white/40 border-dashed relative"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div>
                 <div className="px-6 py-4 border-2 border-white text-center bg-transparent shrink-0"><InlineMath math="f(x) = 3x - 1" /></div>
                 <div className="font-mono flex items-center relative gap-2"><div className="flex-1 min-w-[30px] h-0 border-t-2 border-white/40 border-dashed relative"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div><span className="-ml-6 mt-6 whitespace-nowrap text-xs"><InlineMath math="f(x) =" /></span></div>
                 <div className="px-6 py-4 border-2 border-white text-center bg-transparent shrink-0"><InlineMath math="g(x) = \frac{x+1}{3}" /></div>
                 <div className="flex flex-col text-xs font-mono items-start">
                    <div className="flex items-center"><div className="w-10 h-0 border-t-2 border-white/40 relative mr-2"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div><InlineMath math="g(3x-1) =" /></div>
                    <div className="flex items-center"><div className="w-10 h-0 border-t-2 border-white/40 relative mr-2"><div className="absolute right-0 -top-[5px] border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-white/40"></div></div><InlineMath math="g(f(x)) =" /></div>
                 </div>
               </div>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Swap, then rearrange:</strong> write <InlineMath math="y = f(x)" />, swap <InlineMath math="x" /> and <InlineMath math="y" />, then make <InlineMath math="y" /> the subject. Rearranging without swapping is the most common failure.</li>
              <li><strong>Write the answer as <InlineMath math="f^{-1}(x)" />:</strong> leaving it as <InlineMath math="y = \ldots" /> does not finish the question.</li>
              <li><strong><InlineMath math="f^{-1}" /> is not a reciprocal:</strong> it does not mean <InlineMath math="\frac{1}{f(x)}" />. The notation is unfortunate but the meaning is fixed.</li>
              <li><strong>An inverse needs a one-to-one function:</strong> some functions only have one if the domain is restricted first. Say so if the question calls for it.</li>
              <li><strong>Check by composing:</strong> <InlineMath math="f(f^{-1}(x))" /> should give <InlineMath math="x" />. It is a fast, complete verification.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "inv-ex1",
            question: (
              <div className="space-y-4">
                <p><strong>Example 1</strong></p>
                <p><InlineMath math="f(x) = \frac{2}{1-x}" /> and <InlineMath math="g(x) = 1 - \frac{2}{x}" /> where <InlineMath math="x \neq 0, 1" />.</p>
                <p>a) Find <InlineMath math="f(g(x))" />.</p>
                <p>b) State the connection between <InlineMath math="f" /> and <InlineMath math="g" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong></p>
                <BlockMath math="\begin{aligned} f(g(x)) &= f\left(1 - \frac{2}{x}\right) \\ &= \frac{2}{1 - \left(1 - \frac{2}{x}\right)} \\ &= \frac{2}{\frac{2}{x}} \\ &= 2 \times \frac{x}{2} \\ &= x \end{aligned}" />
                <div className="h-px w-full bg-white/10 my-4"></div>
                <p><strong>b)</strong> Since <InlineMath math="f(g(x)) = x" />, <InlineMath math="f" /> and <InlineMath math="g" /> are inverse functions.</p>
              </div>
            )
          },
          {
            id: "inv-ex2",
            question: (
              <div className="space-y-4">
                <p><strong>Example 2</strong></p>
                <p>A function <InlineMath math="f" /> is defined, for all real numbers, by <InlineMath math="f(x) = x^3 + 1" />.</p>
                <p>Find a formula for its inverse <InlineMath math="f^{-1}(x)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Set <InlineMath math="y = f(x)" />:</p>
                <BlockMath math="y = x^3 + 1" />
                <p className="mt-2 mb-2 text-slate-300">Change the subject to <InlineMath math="x" />:</p>
                <BlockMath math="y - 1 = x^3" />
                <BlockMath math="x = \sqrt[3]{y - 1}" />
                <p className="mt-2 mb-2 text-slate-300">Rewrite in terms of <InlineMath math="x" />:</p>
                <BlockMath math="f^{-1}(x) = \sqrt[3]{x - 1}" />
              </div>
            )
          }
        ]
      },
      {
        id: "graphs-of-inverse-functions",
        title: "Graphs of Inverse Functions",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=4523",
        theory: (
          <div className="space-y-4">
            <p className="text-lg">If we have a graph of a function, we can find the graph of the inverse function by <strong>reflecting it in the line <InlineMath math="y = x" /></strong>.</p>
            <p className="text-slate-300 mt-2">Every coordinate <InlineMath math="(a,b)" /> on the original graph becomes <InlineMath math="(b,a)" /> on the inverse graph.</p>
            <div className="bg-white/5 p-4 rounded-xl mt-4 border border-white/10 text-center font-mono">
              <p><InlineMath math="f(a) = b \implies f^{-1}(b) = a" /></p>
            </div>
            <InverseGraphReflection />
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Reflect in <InlineMath math="y = x" />:</strong> not in either axis. Every point <InlineMath math="(a,b)" /> becomes <InlineMath math="(b,a)" />.</li>
              <li><strong>Draw the line <InlineMath math="y = x" /> on your sketch:</strong> it makes the reflection much easier to get right, and shows the marker what you did.</li>
              <li><strong>Domain and range swap over:</strong> the domain of the inverse is the range of the original, and vice versa.</li>
              <li><strong>Intercepts swap too:</strong> an <InlineMath math="x" />-intercept of the original becomes a <InlineMath math="y" />-intercept of the inverse.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "graphs-inv-ex1",
            question: (
              <div className="space-y-4">
                <p>Shown is the graph of <InlineMath math="f(x)" />.</p>
                <InverseGraphExample />
                <p>On the same diagram, sketch its inverse <InlineMath math="f^{-1}(x)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>To sketch the inverse, we reflect the curve in the line <InlineMath math="y = x" />.</p>
                <p>The coordinates of the indicated points will be reversed:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><InlineMath math="(-1, 0) \to (0, -1)" /></li>
                  <li><InlineMath math="(0, 1) \to (1, 0)" /></li>
                  <li><InlineMath math="(1, 2) \to (2, 1)" /></li>
                </ul>
                <p className="text-slate-300">Plot these new points and draw a smooth curve through them, ensuring it is a perfect reflection across the line <InlineMath math="y=x" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "graph-transformations",
        title: "Graph Transformations",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=4813",
        theory: (
          <div className="space-y-6">
            <p>Given any graph <InlineMath math="f(x)" />, we can reflect, move, or scale it. Each transformation influences the points on the graph.</p>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white">
                      <th className="pb-2 font-bold px-2">Notation</th>
                      <th className="pb-2 font-bold px-2">Description</th>
                      <th className="pb-2 font-bold px-2">Change to Points <InlineMath math="(x,y)" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="f(x) + a" /></td>
                      <td className="py-3 px-2">Graph moves up by <InlineMath math="a" /> units</td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (x, y + a)" /></span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="f(x) - a" /></td>
                      <td className="py-3 px-2">Graph moves down by <InlineMath math="a" /> units</td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (x, y - a)" /></span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="af(x)" /></td>
                      <td className="py-3 px-2">Vertical stretch by <InlineMath math="a" /></td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (x, ay)" /></span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="-f(x)" /></td>
                      <td className="py-3 px-2">Reflect over x-axis</td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (x, -y)" /></span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="f(x + a)" /></td>
                      <td className="py-3 px-2">Graph moves left by <InlineMath math="a" /> units</td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (x - a, y)" /></span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="f(x - a)" /></td>
                      <td className="py-3 px-2">Graph moves right by <InlineMath math="a" /> units</td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (x + a, y)" /></span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2"><InlineMath math="f(-x)" /></td>
                      <td className="py-3 px-2">Reflect over y-axis</td>
                      <td className="py-3 px-2"><span className="text-indigo-300 font-mono text-xs whitespace-nowrap"><InlineMath math="\to (-x, y)" /></span></td>
                    </tr>
                  </tbody>
                </table>
            </div>
            
            <div className="bg-amber-500/10 p-5 rounded-xl border border-amber-500/20 mt-4">
              <h4 className="font-bold text-amber-400 mb-2">Remember:</h4>
              <p className="text-sm">Changes <strong>inside</strong> the bracket affect the <strong>x-coordinates</strong> (horizontally) and do the <em>opposite</em> of what you might expect.</p>
              <p className="text-sm mt-2">Changes <strong>outside</strong> the bracket affect the <strong>y-coordinates</strong> (vertically) and do exactly what they say.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Label the point you were asked for:</strong> a very common loss is failing to identify clearly which coordinates are the <em>maximum</em> of the transformed graph, or naming the wrong ones. Mark and name it explicitly.</li>
                <li><strong>Inside the bracket does the opposite:</strong> <InlineMath math="f(x+3)" /> moves the graph <strong>left</strong> 3, not right. This is the most common transformation error there is.</li>
                <li><strong>Apply transformations in order:</strong> for something like <InlineMath math="3f(2x)+1" />, deal with each change separately and track what happens to a known point at each stage.</li>
                <li><strong>Transform the key points, not the whole curve:</strong> take the turning points and intercepts, move each one, then draw a curve of the same shape through them.</li>
                <li><strong>Practise on the axes given:</strong> both reports ask for practice at sketching on provided axes — use the scale printed on them.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "transform-ex1",
            question: (
              <div className="space-y-4">
                <p><strong>Example 1</strong></p>
                <p>Sketch the graph of <InlineMath math="y = -f(x - 2)" />.</p>
                <TransformationGraph1 />
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>The transformation involves two steps:</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li><InlineMath math="-2" /> inside the bracket: Move <strong>right 2 units</strong>. (<InlineMath math="x \to x + 2" />).</li>
                  <li>Negative sign outside: <strong>Reflect over the x-axis</strong>. (<InlineMath math="y \to -y" />).</li>
                </ol>
                <div className="mt-4 border border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-sm">
                        <th className="p-2 border-r border-white/10">Original Point <InlineMath math="(x,y)" /></th>
                        <th className="p-2 border-r border-white/10">Move right 2 <InlineMath math="(x+2,y)" /></th>
                        <th className="p-2">Reflect x-axis <InlineMath math="(x,-y)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 font-mono text-sm">
                      <tr>
                        <td className="p-2 border-r border-white/10 text-emerald-400">(-3, 0)</td>
                        <td className="p-2 border-r border-white/10">(-1, 0)</td>
                        <td className="p-2 text-indigo-400">(-1, 0)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-white/10 text-red-400">(-2, 10)</td>
                        <td className="p-2 border-r border-white/10">(0, 10)</td>
                        <td className="p-2 text-indigo-400">(0, -10)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-white/10 text-blue-400">(1, -17)</td>
                        <td className="p-2 border-r border-white/10">(3, -17)</td>
                        <td className="p-2 text-indigo-400">(3, 17)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-300">Plot the final points and connect them with a curve similar to the original shape.</p>
              </div>
            )
          },
          {
            id: "transform-ex2",
            question: (
              <div className="space-y-4">
                <p><strong>Example 2</strong></p>
                <p>Sketch the graph of <InlineMath math="y = 3f(2x) + 1" />.</p>
                <TransformationGraph2 />
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>The transformation involves three operations:</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li><InlineMath math="2x" /> inside: Compress horizontally by a factor of 2. (<InlineMath math="x \to \frac{x}{2}" />).</li>
                  <li><InlineMath math="3" /> outside: Vertical stretch by 3. (<InlineMath math="y \to 3y" />).</li>
                  <li><InlineMath math="+ 1" /> outside: Move up 1 unit. (<InlineMath math="y \to y + 1" />).</li>
                </ol>
                <div className="mt-4 border border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-xs text-center">
                        <th className="p-2 border-r border-white/10">Original <InlineMath math="(x,y)" /></th>
                        <th className="p-2 border-r border-white/10">Horiz compress <InlineMath math="\left(\frac{x}{2},y\right)" /></th>
                        <th className="p-2 border-r border-white/10">Vertical stretch <InlineMath math="(x, 3y)" /></th>
                        <th className="p-2">Move up 1 <InlineMath math="(x, y+1)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 font-mono text-sm text-center">
                      <tr>
                        <td className="p-2 border-r border-white/10 text-purple-400">(-1, 0)</td>
                        <td className="p-2 border-r border-white/10">(-0.5, 0)</td>
                        <td className="p-2 border-r border-white/10">(-0.5, 0)</td>
                        <td className="p-2 text-indigo-400">(-0.5, 1)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-white/10 text-emerald-400">(0, 2)</td>
                        <td className="p-2 border-r border-white/10">(0, 2)</td>
                        <td className="p-2 border-r border-white/10">(0, 6)</td>
                        <td className="p-2 text-indigo-400">(0, 7)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-white/10 text-blue-400">(1, 0)</td>
                        <td className="p-2 border-r border-white/10">(0.5, 0)</td>
                        <td className="p-2 border-r border-white/10">(0.5, 0)</td>
                        <td className="p-2 text-indigo-400">(0.5, 1)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-white/10 text-red-400">(3, 0)</td>
                        <td className="p-2 border-r border-white/10">(1.5, 0)</td>
                        <td className="p-2 border-r border-white/10">(1.5, 0)</td>
                        <td className="p-2 text-indigo-400">(1.5, 1)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "completing-the-square",
        title: "Completing the Square",
        videoUrl: "",
        theory: (
          <div className="space-y-6">
            <p><strong>Completing the square</strong> is a method used to write a quadratic expression <InlineMath math="ax^2 + bx + c" /> in the form <InlineMath math="a(x + p)^2 + q" />.</p>
            <p>This form is very useful for finding the turning point (vertex) of a parabola and solving quadratic equations.</p>
            
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 mt-4">
              <h4 className="font-bold text-white mb-2">The Process (when a = 1):</h4>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>Start with <InlineMath math="x^2 + bx + c" /></li>
                <li>Halve the coefficient of <InlineMath math="x" /> (which is <InlineMath math="b/2" />)</li>
                <li>Put it inside a squared bracket with <InlineMath math="x" />: <InlineMath math="(x + b/2)^2" /></li>
                <li>Subtract the square of this number outside the bracket.</li>
                <li>Add the original constant <InlineMath math="c" />.</li>
                <li>Simplify the constants.</li>
              </ol>
            </div>

            <div className="bg-indigo-500/10 p-5 rounded-xl border border-indigo-500/20 mt-4">
              <h4 className="font-bold text-indigo-300 mb-2">The Turning Point:</h4>
              <p>For a quadratic in the form <InlineMath math="y = a(x + p)^2 + q" />:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>The turning point is at <InlineMath math="(-p, q)" />.</li>
                <li>If <InlineMath math="a > 0" />, it is a <strong>minimum</strong> turning point.</li>
                <li>If <InlineMath math="a < 0" />, it is a <strong>maximum</strong> turning point.</li>
                <li>The axis of symmetry is the line <InlineMath math="x = -p" />.</li>
              </ul>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Halve the coefficient of <InlineMath math="x" />, then square it:</strong> both steps, in that order. Halving without squaring, or squaring without halving, is the usual slip.</li>
              <li><strong>Subtract what you added:</strong> <InlineMath math="x^2+6x" /> becomes <InlineMath math="(x+3)^2 - 9" />. The <InlineMath math="-9" /> keeps the expression equal to what you started with.</li>
              <li><strong>Factor out a coefficient first:</strong> if the <InlineMath math="x^2" /> term has a coefficient, take it outside the bracket before completing the square, and remember it multiplies the correction term.</li>
              <li><strong>Read the turning point correctly:</strong> <InlineMath math="(x+3)^2 - 9" /> has its minimum at <InlineMath math="(-3,-9)" /> — the <InlineMath math="x" /> value flips sign, the <InlineMath math="y" /> value does not.</li>
              <li><strong>Watch signs with a negative coefficient:</strong> the parabola opens downwards, so the turning point is a maximum.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "cts-ex1",
            question: (
              <div className="space-y-2">
                <p>Express <InlineMath math="x^2 + 6x - 2" /> in the form <InlineMath math="(x + p)^2 + q" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Halve the coefficient of <InlineMath math="x" />: <InlineMath math="6 \div 2 = 3" />.</p>
                <BlockMath math="\begin{aligned} &= (x + 3)^2 - (3)^2 - 2 \\ &= (x + 3)^2 - 9 - 2 \\ &= (x + 3)^2 - 11 \end{aligned}" />
                <p className="text-slate-300">Here <InlineMath math="p = 3" /> and <InlineMath math="q = -11" />.</p>
              </div>
            )
          },
          {
            id: "cts-ex2",
            question: (
              <div className="space-y-2">
                <p>Express <InlineMath math="2x^2 - 12x + 7" /> in the form <InlineMath math="a(x + p)^2 + q" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Take out the common factor of <InlineMath math="2" /> from the <InlineMath math="x" /> terms first.</p>
                <BlockMath math="= 2(x^2 - 6x) + 7" />
                <p>Now complete the square on the bracket <InlineMath math="(x^2 - 6x)" />. Half of <InlineMath math="-6" /> is <InlineMath math="-3" />.</p>
                <BlockMath math="\begin{aligned} &= 2\left[(x - 3)^2 - (-3)^2\right] + 7 \\ &= 2\left[(x - 3)^2 - 9\right] + 7 \end{aligned}" />
                <p>Expand the square bracket by multiplying the <InlineMath math="-9" /> by the <InlineMath math="2" /> outside:</p>
                <BlockMath math="\begin{aligned} &= 2(x - 3)^2 - 18 + 7 \\ &= 2(x - 3)^2 - 11 \end{aligned}" />
              </div>
            )
          },
          {
            id: "cts-ex3",
            question: (
              <div className="space-y-2">
                <p>Express <InlineMath math="5 - 4x - x^2" /> in the form <InlineMath math="q - (x + p)^2" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Rewrite the expression in standard order:</p>
                <BlockMath math="= -x^2 - 4x + 5" />
                <p>Factor out <InlineMath math="-1" /> from the <InlineMath math="x" /> terms:</p>
                <BlockMath math="= -(x^2 + 4x) + 5" />
                <p>Complete the square inside the bracket:</p>
                <BlockMath math="\begin{aligned} &= -\left[(x + 2)^2 - (2)^2\right] + 5 \\ &= -\left[(x + 2)^2 - 4\right] + 5 \end{aligned}" />
                <p>Expand by distributing the negative sign:</p>
                <BlockMath math="\begin{aligned} &= -(x + 2)^2 + 4 + 5 \\ &= 9 - (x + 2)^2 \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "exponential-functions",
        title: "Exponential Functions",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=5231",
        theory: (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Introduction</h3>
            <p>An <strong>exponential function</strong> is a function of the form <InlineMath math="f(x) = a^x" /> where <InlineMath math="a \in \mathbb{R}" /> and <InlineMath math="a > 0" />.</p>
            <p className="mt-2 text-slate-300">Therefore, <InlineMath math="f(x)" /> is an exponential function to the <strong>base</strong> <InlineMath math="a" />.</p>
            <ul className="list-disc list-inside ml-4 mt-2 mb-4">
              <li>When <InlineMath math="x = 0, f(0) = a^0 = 1" />. Graph passes through <InlineMath math="(0, 1)" />.</li>
              <li>When <InlineMath math="x = 1, f(1) = a^1 = a" />. Graph passes through <InlineMath math="(1, a)" />.</li>
            </ul>
            <p>Every exponential graph of the form <InlineMath math="f(x) = a^x" /> passes through the points <InlineMath math="(0, 1)" /> and <InlineMath math="(1, a)" />.</p>

            <div className="h-px bg-white/10 my-4"></div>

            <h3 className="text-xl font-bold">The Exponential Constant</h3>
            <p><InlineMath math="e" /> can be considered one of the most important numbers in mathematics and is often called Euler's number. It is known to over 1 trillion digits of accuracy.</p>
            <BlockMath math="e = 2.718281828459045..." />
            
            <h3 className="text-lg font-bold mt-4">The Natural Exponential Function</h3>
            <p>The function <InlineMath math="f(x) = e^x" /> is called the <strong>natural exponential function</strong>.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Every exponential passes through <InlineMath math="(0,1)" />:</strong> because <InlineMath math="a^0 = 1" /> for any base. It is the single most useful checkpoint on a sketch.</li>
              <li><strong>Growth or decay depends on the base:</strong> <InlineMath math="a \gt 1" /> grows, <InlineMath math="0 \lt a \lt 1" /> decays. Sketching the wrong direction throws away the whole question.</li>
              <li><strong>The <InlineMath math="x" />-axis is an asymptote:</strong> the curve approaches it but never reaches it, so there is no <InlineMath math="x" />-intercept. Draw it approaching, not touching.</li>
              <li><strong>Transformations move the asymptote:</strong> adding a constant shifts the horizontal asymptote up or down with the curve.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "exp-ex1",
            question: (
              <div className="space-y-4">
                <p><strong>Transformations of Exponential Graphs</strong></p>
                <p>Given any graph <InlineMath math="f(x)" />, we can reflect, move or scale it. The same rules apply for transforming exponential graphs as we have previously studied.</p>
                <p>a) Sketch the graph of <InlineMath math="y = 1 + 2^x" />.</p>
                <p>b) Sketch the graph of <InlineMath math="y = 3^{2x}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong> Start with base graph <InlineMath math="y = 2^x" /> passing through <InlineMath math="(0,1)" /> and <InlineMath math="(1,2)" />.</p>
                <p>The <InlineMath math="+1" /> outside shifts the graph UP by 1 unit.</p>
                <p>New key points: <InlineMath math="(0,2)" /> and <InlineMath math="(1,3)" />. Asymptote moves to <InlineMath math="y=1" />.</p>
                <div className="h-px bg-white/10 my-4"></div>
                <p><strong>b)</strong> Start with base graph <InlineMath math="y = 3^x" /> passing through <InlineMath math="(0,1)" /> and <InlineMath math="(1,3)" />.</p>
                <p>The <InlineMath math="2x" /> inside squashes the graph horizontally by factor of 1/2.</p>
                <p>Key points map: <InlineMath math="(1,3) \to (0.5, 3)" />.</p>
              </div>
            )
          },
          {
            id: "exp-ex2",
            question: (
              <div className="space-y-4">
                <p><strong>Missing Constants</strong></p>
                <p>Part of the graph of <InlineMath math="y = a^x + b" /> is shown.</p>
                <p>It passes through <InlineMath math="(0, 2)" /> and <InlineMath math="(3, 9)" />.</p>
                <p>Find <InlineMath math="a" /> and <InlineMath math="b" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Substitute the point <InlineMath math="(0, 2)" /> into the equation:</p>
                <BlockMath math="2 = a^0 + b" />
                <BlockMath math="2 = 1 + b \implies b = 1" />
                <p>Now equation is <InlineMath math="y = a^x + 1" />. Substitute point <InlineMath math="(3, 9)" />:</p>
                <BlockMath math="9 = a^3 + 1" />
                <BlockMath math="a^3 = 8 \implies a = 2" />
                <p>So <InlineMath math="a = 2" />, <InlineMath math="b = 1" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "logarithmic-functions",
        title: "Logarithmic Functions",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=551",
        theory: (
          <div className="space-y-6">
            <p>A <strong>logarithmic function</strong> is a function of the form <InlineMath math="f(x) = \log_a x" /> where <InlineMath math="a > 0" /> and <InlineMath math="x > 0" />.</p>
            <p>The relationship between exponential functions and logarithmic functions can be expressed as:</p>
            <div className="bg-indigo-500/10 p-5 rounded-xl border border-indigo-500/20 text-center font-mono text-xl text-indigo-300">
               <BlockMath math="y = a^x \iff \log_a y = x" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>A logarithm is an index in disguise:</strong> <InlineMath math="\log_a x = y" /> means exactly <InlineMath math="a^y = x" />. Being able to switch between these two forms instantly is what most log questions actually test.</li>
              <li><strong>You cannot take the log of zero or a negative:</strong> so check that any solution keeps every argument positive, and discard those that do not.</li>
              <li><strong><InlineMath math="\log_a 1 = 0" /> and <InlineMath math="\log_a a = 1" />:</strong> these two special values shortcut a great many calculations.</li>
              <li><strong>Log and exponential are inverses:</strong> which is why their graphs are reflections in <InlineMath math="y = x" />.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "log-ex1",
            question: (
              <div className="space-y-4">
                <p><strong>Evaluating Logarithmic Expressions</strong></p>
                <p>a) Write <InlineMath math="5^3 = 125" /> in logarithmic form.</p>
                <p>b) Evaluate <InlineMath math="\log_4 16" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong> Using <InlineMath math="a^x = y \implies \log_a y = x" />:</p>
                <BlockMath math="\log_5 125 = 3" />
                <div className="h-px bg-white/10 my-4"></div>
                <p><strong>b)</strong> Let <InlineMath math="\log_4 16 = x" />.</p>
                <p>Rearrange into exponential form: <InlineMath math="4^x = 16" />.</p>
                <p>Since <InlineMath math="4^2 = 16" />, <InlineMath math="x = 2" />.</p>
                <BlockMath math="\log_4 16 = 2" />
              </div>
            )
          },
          {
            id: "log-ex2",
            question: (
              <div className="space-y-4">
                <p><strong>Basic Logarithmic Equations</strong></p>
                <p>a) Solve <InlineMath math="\log_5 x = 3" />.</p>
                <p>b) Solve <InlineMath math="\log_x 81 = 2" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong> Convert to exponential form:</p>
                <BlockMath math="x = 5^3 \implies x = 125" />
                <div className="h-px bg-white/10 my-4"></div>
                <p><strong>b)</strong> Convert to exponential form:</p>
                <BlockMath math="x^2 = 81" />
                <BlockMath math="x = 9" />
                <p className="text-sm text-slate-400">(Note: base <InlineMath math="x" /> must be &gt; 0, so ignore -9)</p>
              </div>
            )
          }
        ]
      },
      {
        id: "logarithmic-graphs",
        title: "Logarithmic Graphs",
        videoUrl: "https://www.youtube.com/embed/NoGdMUAVEe4?start=5653",
        theory: (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">The Logarithmic Graph</h3>
            <p>Since the logarithmic function is the inverse of the exponential function, we can reflect the exponential graph in the line <InlineMath math="y = x" /> to find the logarithmic graph.</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>When <InlineMath math="x = 1, f(1) = \log_a 1 = 0 \implies (1, 0)" /></li>
              <li>When <InlineMath math="x = a, f(a) = \log_a a = 1 \implies (a, 1)" /></li>
            </ul>
            <p>Every logarithmic graph of the form <InlineMath math="f(x) = \log_a x" /> passes through the points <InlineMath math="(1, 0)" /> and <InlineMath math="(a, 1)" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Every log graph passes through <InlineMath math="(1,0)" />:</strong> because <InlineMath math="\log_a 1 = 0" />. This is the counterpart of <InlineMath math="(0,1)" /> on the exponential.</li>
              <li><strong>The <InlineMath math="y" />-axis is the asymptote:</strong> vertical, not horizontal — the opposite of the exponential graph. There is no <InlineMath math="y" />-intercept.</li>
              <li><strong>Only defined for <InlineMath math="x \gt 0" />:</strong> nothing at all is drawn to the left of the <InlineMath math="y" />-axis.</li>
              <li><strong>Transformations shift the asymptote:</strong> <InlineMath math="\log_a(x-2)" /> moves the vertical asymptote to <InlineMath math="x = 2" />, and the graph with it.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "loggraph-ex1",
            question: (
              <div className="space-y-4">
                <p><strong>Transformations</strong></p>
                <p>Sketch the graph of <InlineMath math="y = \log_5(x - 3)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Base graph is <InlineMath math="y = \log_5 x" /> passing through <InlineMath math="(1,0)" /> and <InlineMath math="(5,1)" /> with asymptote <InlineMath math="x=0" />.</p>
                <p>The <InlineMath math="-3" /> inside shifts the graph <strong>RIGHT by 3 units</strong>.</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li><InlineMath math="(1,0) \to (4,0)" /></li>
                  <li><InlineMath math="(5,1) \to (8,1)" /></li>
                  <li>Asymptote moves to <InlineMath math="x = 3" /></li>
                </ul>
              </div>
            )
          },
          {
            id: "loggraph-ex2",
            question: (
              <div className="space-y-4">
                <p><strong>Missing Constants</strong></p>
                <p>Part of the graph of <InlineMath math="y = \log_m(x + k)" /> is shown.</p>
                <p>It passes through <InlineMath math="(-4, 0)" /> and <InlineMath math="(5, 1)" />.</p>
                <p>Find <InlineMath math="k" /> and <InlineMath math="m" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Substitute point <InlineMath math="(-4, 0)" />:</p>
                <BlockMath math="0 = \log_m(-4 + k)" />
                <p>Convert to exponential form:</p>
                <BlockMath math="m^0 = -4 + k \implies 1 = -4 + k \implies k = 5" />
                <div className="h-px bg-white/10 my-4"></div>
                <p>Now equation is <InlineMath math="y = \log_m(x + 5)" />. Substitute point <InlineMath math="(5, 1)" />:</p>
                <BlockMath math="1 = \log_m(5 + 5) \implies 1 = \log_m(10)" />
                <BlockMath math="m^1 = 10 \implies m = 10" />
                <p>So <InlineMath math="k = 5" /> and <InlineMath math="m = 10" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "polynomials",
    title: "Polynomials & Quadratics",
    topics: [
      {
        id: "poly-intro",
        title: "Introduction to Polynomials",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=1017",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Polynomials are expressions with one or more terms of the form:</p>
            <BlockMath math="a_n x^n+a_{n-1} x^{n-1}+a_{n-2} x^{n-2} + ... + a_2 x^2+a_1 x^1+a_0 x^0" />
            <p>where <InlineMath math="a_0, \dots, a_n" /> are constants with <InlineMath math="a_n \neq 0" />.</p>
            <p>Each term has a coefficient followed by a variable raised to a whole number exponent.</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-6">
              <p>For example,</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><InlineMath math="3x^5+x^3+2x^2-6" /> is a polynomial of degree 5 as the highest power of <InlineMath math="x" /> is 5.</li>
                <li>Quadratics are polynomials of degree 2.</li>
                <li>Constants are polynomials of degree 0 since <InlineMath math="1 = x^0" />.</li>
              </ul>
            </div>
            
            <p className="mt-8 font-bold text-white">Task: Complete the table</p>
            <div className="border border-white/10 rounded-xl bg-black/20 p-2 sm:p-4 mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-3 font-bold text-white">Polynomial</th>
                    <th className="p-3 font-bold text-white">Degree</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr><td className="p-3"><InlineMath math="4x^2+2x+5" /></td><td className="p-3">2</td></tr>
                  <tr><td className="p-3"><InlineMath math="4x^4-x^3+x^2-x+1" /></td><td className="p-3">4</td></tr>
                  <tr><td className="p-3"><InlineMath math="3x^2" /></td><td className="p-3">2</td></tr>
                  <tr><td className="p-3"><InlineMath math="2x+1" /></td><td className="p-3">1</td></tr>
                  <tr><td className="p-3"><InlineMath math="(x-1)^4" /></td><td className="p-3">4</td></tr>
                  <tr><td className="p-3"><InlineMath math="3x^2+2x^5" /></td><td className="p-3">5</td></tr>
                  <tr><td className="p-3"><InlineMath math="5" /></td><td className="p-3">0</td></tr>
                </tbody>
              </table>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The degree is the highest power:</strong> not the number of terms, and not the first coefficient you see.</li>
              <li><strong>Write terms in descending order:</strong> before doing anything else, and include a zero for any missing power — a missing term will wreck synthetic division.</li>
              <li><strong>A root is where the graph crosses:</strong> a root <InlineMath math="x = a" /> corresponds to a factor <InlineMath math="(x-a)" />, with the sign reversed.</li>
              <li><strong>Degree tells you how many roots to expect:</strong> a cubic has at most three, counting repeats.</li>
            </ul>
          </div>
          </div>
        ),
        examples: []
      },
      {
        id: "poly-evaluation",
        title: "Evaluation",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=1111",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Polynomials can be evaluated using substitution.</p>
            <p>For example, if we take <InlineMath math="f(x)=2x^3-9x^2+2x+1" /> and we evaluate <InlineMath math="f(5)" />, we obtain:</p>
            <BlockMath math="f(5) = 2(5)^3 - 9(5)^2 + 2(5) + 1 = 36" />
            <p>This means that if we divide <InlineMath math="f(x)" /> by <InlineMath math="(x-5)" />, we have a remainder of 36.</p>
            
            <p className="mt-6 mb-2">If there is no remainder when you evaluate <InlineMath math="f(a)" />, i.e. <InlineMath math="f(a)=0" />, this means that <InlineMath math="x=a" /> is a root of <InlineMath math="f(x)" /> and therefore <InlineMath math="(x-a)" /> is a factor of <InlineMath math="f(x)" />.</p>
            
            <p>For <InlineMath math="g(x)=x^3+x^2-22x-40" />, evaluating gives <InlineMath math="g(-2)=0" />.</p>
            <p>This means that <InlineMath math="x=-2" /> is a root of <InlineMath math="g(x)" /> and <InlineMath math="(x+2)" /> is a factor of <InlineMath math="g(x)" />.</p>
            <p>We can use this to help with factorisation:</p>
            <BlockMath math="g(x) = (x+2)q(x)" />
            <p>where <InlineMath math="q(x)" /> is a quadratic in this case.</p>
            
            <p className="mt-8 font-bold text-white">Task: Complete the table</p>
            <div className="border border-white/10 rounded-xl bg-black/20 p-2 sm:p-4 mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-3 font-bold text-white">Root</th>
                    <th className="p-3 font-bold text-white">Associated Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr><td className="p-3"><InlineMath math="x = -2" /></td><td className="p-3"><InlineMath math="x+2" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = 5" /></td><td className="p-3"><InlineMath math="x-5" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = -7" /></td><td className="p-3"><InlineMath math="x+7" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = 7" /></td><td className="p-3"><InlineMath math="x-7" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = 3" /></td><td className="p-3"><InlineMath math="x-3" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = -3" /></td><td className="p-3"><InlineMath math="x+3" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = \frac{1}{2}" /></td><td className="p-3"><InlineMath math="2x-1" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = \frac{1}{3}" /></td><td className="p-3"><InlineMath math="3x-1" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = \frac{2}{3}" /></td><td className="p-3"><InlineMath math="3x-2" /></td></tr>
                  <tr><td className="p-3"><InlineMath math="x = -\frac{5}{4}" /></td><td className="p-3"><InlineMath math="4x+5" /></td></tr>
                </tbody>
              </table>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Include zeros for missing powers:</strong> for <InlineMath math="x^3 - 7x + 6" /> the row is 1, 0, −7, 6. Omitting the zero is the most common synthetic division error there is.</li>
              <li><strong>Divide by <InlineMath math="a" />, not <InlineMath math="-a" />:</strong> to test the factor <InlineMath math="(x-3)" /> you use 3 in the box. The sign reverses.</li>
              <li><strong>Set it out in the standard layout:</strong> non-standard arrangements are hard to credit, even when the arithmetic is right.</li>
              <li><strong>The last number is the remainder:</strong> if it is zero, say explicitly that this proves the divisor is a factor.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "eval-ex1",
            question: (
              <>
                <p>Given <InlineMath math="g(x)=x^3+x^2-22x-40" />, evaluate the following and state the remainder:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>a) <InlineMath math="g(3)" /></div>
                  <div>b) <InlineMath math="g(-5)" /></div>
                  <div>c) <InlineMath math="g(-2)" /></div>
                </div>
              </>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-bold">a) <InlineMath math="g(3)" /></p>
                  <BlockMath math="g(3) = (3)^3 + (3)^2 - 22(3) - 40" />
                  <BlockMath math="g(3) = 27 + 9 - 66 - 40 = -70" />
                  <p>The remainder is <InlineMath math="-70" />.</p>
                </div>
                <div className="mt-4">
                  <p className="font-bold">b) <InlineMath math="g(-5)" /></p>
                  <BlockMath math="g(-5) = (-5)^3 + (-5)^2 - 22(-5) - 40" />
                  <BlockMath math="g(-5) = -125 + 25 + 110 - 40 = -30" />
                  <p>The remainder is <InlineMath math="-30" />.</p>
                </div>
                <div className="mt-4">
                  <p className="font-bold">c) <InlineMath math="g(-2)" /></p>
                  <BlockMath math="g(-2) = (-2)^3 + (-2)^2 - 22(-2) - 40" />
                  <BlockMath math="g(-2) = -8 + 4 + 44 - 40 = 0" />
                  <p>The remainder is <InlineMath math="0" />.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "poly-unknowns",
        title: "Finding Unknown Coefficients",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=1345",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Consider a polynomial with some unknown coefficients, such as <InlineMath math="x^3+2px^2-px+4" />, where <InlineMath math="p" /> is a constant.</p>
            <p>If we divide the polynomial by <InlineMath math="x-h" />, then we will obtain an expression for the remainder in terms of the unknown constants.</p>
            <p>If we already know the value of the remainder then we can solve for the unknown constants.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>A factor means remainder zero:</strong> that is the equation you solve for the unknown. Set the last entry of the synthetic division to 0.</li>
              <li><strong>Two unknowns need two conditions:</strong> the question will give you both — usually two factors, or a factor and a remainder. Form both equations and solve simultaneously.</li>
              <li><strong>Do not stop at the unknown:</strong> most questions then ask you to factorise fully or find the roots. Read to the end.</li>
              <li><strong>Substitute your value back:</strong> a quick check that the remainder really is zero catches arithmetic slips.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "unk-ex1",
            question: <p>Given that <InlineMath math="x-3" /> is a factor of <InlineMath math="f(x)=x^3-x^2+px+24" />, find the value of <InlineMath math="p" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Since <InlineMath math="x-3" /> is a factor, by the factor theorem, <InlineMath math="f(3) = 0" />.</p>
                <BlockMath math="f(3) = (3)^3 - (3)^2 + p(3) + 24 = 0" />
                <BlockMath math="27 - 9 + 3p + 24 = 0" />
                <BlockMath math="42 + 3p = 0" />
                <BlockMath math="3p = -42" />
                <BlockMath math="p = -14" />
              </div>
            )
          },
          {
            id: "unk-ex2",
            question: (
              <div className="space-y-2">
                <p>When <InlineMath math="f(x)=px^3+qx^2-17x+4q" /> is divisible by <InlineMath math="x-2" />, the remainder is 6.</p>
                <p><InlineMath math="(x-1)" /> is a factor of <InlineMath math="f(x)" />.</p>
                <p>Find the values of <InlineMath math="p" /> and <InlineMath math="q" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>From the first statement, <InlineMath math="f(2) = 6" />:</p>
                <BlockMath math="p(2)^3 + q(2)^2 - 17(2) + 4q = 6" />
                <BlockMath math="8p + 4q - 34 + 4q = 6" />
                <BlockMath math="8p + 8q = 40" />
                <p className="text-center font-bold">Dividing by 8: <span className="ml-4 font-normal"><InlineMath math="p + q = 5 \quad \textbf{(1)}" /></span></p>

                <p className="mt-6">From the second statement, <InlineMath math="f(1) = 0" />:</p>
                <BlockMath math="p(1)^3 + q(1)^2 - 17(1) + 4q = 0" />
                <BlockMath math="p + q - 17 + 4q = 0" />
                <BlockMath math="p + 5q = 17 \quad \textbf{(2)}" />

                <p className="mt-6">Subtracting equation <strong>(1)</strong> from equation <strong>(2)</strong>:</p>
                <BlockMath math="(p + 5q) - (p + q) = 17 - 5" />
                <BlockMath math="4q = 12 \implies q = 3" />

                <p className="mt-6">Substitute <InlineMath math="q = 3" /> into equation <strong>(1)</strong>:</p>
                <BlockMath math="p + 3 = 5 \implies p = 2" />
                <p className="font-bold text-center mt-2">So <InlineMath math="p = 2" /> and <InlineMath math="q = 3" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "poly-factorising",
        title: "Factorising",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=1606",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We can use synthetic division (or polynomial long division) alongside the factor theorem to fully factorise polynomials of degree 3 or higher.</p>
            <p>Once a linear factor <InlineMath math="(x-h)" /> is found, we divide the polynomial by <InlineMath math="(x-h)" /> to obtain a quotient. We then factorise the quotient if possible.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Take out a common factor first:</strong> skipping this is extremely common, and it makes the factorisation far harder than it needs to be. Check for one before you start dividing.</li>
                <li><strong>Sign of the root:</strong> a factor <InlineMath math="(x-h)" /> corresponds to the root <InlineMath math="x = h" />, so you divide by <InlineMath math="h" />, not <InlineMath math="-h" />. Sign errors are the single biggest cause of lost marks on polynomial questions.</li>
                <li><strong>Use the standard layout:</strong> synthetic division presented in a non-standard way is hard to credit. Set it out the usual way so the marker can follow it.</li>
                <li><strong>Factorise completely:</strong> stopping at <InlineMath math="(x-h)(\text{quadratic})" /> is unfinished if the quadratic factorises further.</li>
                <li><strong>Say what you have shown:</strong> a correct calculation with no stated conclusion does not score full marks. If the remainder is zero, write that <InlineMath math="(x-h)" /> is a factor.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "factor-ex1",
            question: (
              <div className="space-y-2">
                <p>a) Show that <InlineMath math="(x+5)" /> is a factor of <InlineMath math="x^3+9x^2+23x+15" />.</p>
                <p>b) Factorise <InlineMath math="x^3+9x^2+23x+15" /> fully.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-bold">a)</p>
                  <p>Let <InlineMath math="f(x) = x^3+9x^2+23x+15" />.</p>
                  <p>If <InlineMath math="(x+5)" /> is a factor, <InlineMath math="f(-5)" /> must be 0:</p>
                  <BlockMath math="f(-5) = (-5)^3 + 9(-5)^2 + 23(-5) + 15" />
                  <BlockMath math="f(-5) = -125 + 9(25) - 115 + 15" />
                  <BlockMath math="f(-5) = -125 + 225 - 115 + 15 = 0" />
                  <p>Since the remainder is 0, <InlineMath math="(x+5)" /> is a factor.</p>
                </div>
                <div className="mt-6">
                  <p className="font-bold">b)</p>
                  <p>We use synthetic division to divide <InlineMath math="x^3+9x^2+23x+15" /> by <InlineMath math="(x+5)" /> to find the quadratic quotient.</p>
                  <SyntheticDivision root="-5" coeffs={["1", "9", "23", "15"]} midRow={["-5", "-20", "-15"]} bottomRow={["1", "4", "3", "0"]} />
                  <p>The quotient is <InlineMath math="x^2+4x+3" />.</p>
                  <BlockMath math="x^3+9x^2+23x+15 = (x+5)(x^2+4x+3)" />
                  <p>Now factorise the quadratic:</p>
                  <BlockMath math="x^2+4x+3 = (x+3)(x+1)" />
                  <p>Fully factorised:</p>
                  <BlockMath math="x^3+9x^2+23x+15 = (x+5)(x+3)(x+1)" />
                </div>
              </div>
            )
          },
          {
            id: "factor-ex2",
            question: <p>Fully factorise <InlineMath math="2x^3+5x^2-28x-15" /></p>,
            solution: (
              <div className="space-y-4">
                <p>Let <InlineMath math="f(x) = 2x^3+5x^2-28x-15" />.</p>
                <p>We test factors of -15 (e.g. <InlineMath math="\pm 1, \pm 3, \pm 5" />) to find a root.</p>
                <p>Testing <InlineMath math="x = 3" />:</p>
                <BlockMath math="f(3) = 2(3)^3 + 5(3)^2 - 28(3) - 15" />
                <BlockMath math="f(3) = 54 + 45 - 84 - 15 = 0" />
                <p>Since <InlineMath math="f(3) = 0" />, <InlineMath math="(x-3)" /> is a factor.</p>
                <p>Now use synthetic division to find the quadratic factor:</p>
                <SyntheticDivision root="3" coeffs={["2", "5", "-28", "-15"]} midRow={["6", "33", "15"]} bottomRow={["2", "11", "5", "0"]} />
                <BlockMath math="2x^3+5x^2-28x-15 = (x-3)(2x^2+11x+5)" />
                <p>Factorise the quadratic <InlineMath math="2x^2+11x+5" />:</p>
                <BlockMath math="2x^2+11x+5 = (2x+1)(x+5)" />
                <p>Fully factorised:</p>
                <BlockMath math="2x^3+5x^2-28x-15 = (x-3)(2x+1)(x+5)" />
              </div>
            )
          }
        ]
      },
      {
        id: "poly-roots",
        title: "Finding Roots",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=1920",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Finding the roots of a polynomial equation <InlineMath math="f(x)=0" /> follows the same principles as finding roots of a quadratic. We must first fully factorise the polynomial and then set each factor equal to zero.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Factorise fully before solving:</strong> a partly factorised polynomial hides roots. Keep going until every factor is linear or an irreducible quadratic.</li>
              <li><strong>Reverse the sign for the root:</strong> the factor <InlineMath math="(x+4)" /> gives the root <InlineMath math="x = -4" />.</li>
              <li><strong>Check the quadratic factor as well:</strong> it may factorise further, need the quadratic formula, or have no real roots — use the discriminant to decide.</li>
              <li><strong>Say what you have found:</strong> state the roots clearly at the end rather than leaving them inside brackets.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "root-ex1",
            question: (
              <div className="space-y-2">
                <p>Given that <InlineMath math="f(x)=x^3-37x+84" />,</p>
                <p>a) Show that <InlineMath math="x=-7" /> is a root of <InlineMath math="f(x)=0" /></p>
                <p>b) Solve <InlineMath math="f(x)=0" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-bold">a)</p>
                  <p>Substitute <InlineMath math="x = -7" /> into the polynomial (note there is no <InlineMath math="x^2" /> term, so its coefficient is 0):</p>
                  <BlockMath math="f(-7) = (-7)^3 - 37(-7) + 84" />
                  <BlockMath math="f(-7) = -343 + 259 + 84 = 0" />
                  <p>Since <InlineMath math="f(-7) = 0" />, <InlineMath math="x = -7" /> is a root.</p>
                </div>
                <div className="mt-6">
                  <p className="font-bold">b)</p>
                  <p>Since <InlineMath math="x=-7" /> is a root, <InlineMath math="(x+7)" /> is a factor.</p>
                  <p>We use synthetic division to divide <InlineMath math="x^3-37x+84" /> by <InlineMath math="(x+7)" /> to find the quotient.</p>
                  <SyntheticDivision root="-7" coeffs={["1", "0", "-37", "84"]} midRow={["-7", "49", "-84"]} bottomRow={["1", "-7", "12", "0"]} />
                  <p>The quotient is <InlineMath math="x^2-7x+12" />.</p>
                  <BlockMath math="x^3-37x+84 = (x+7)(x^2-7x+12)" />
                  <p>Factorise the quadratic <InlineMath math="x^2-7x+12" />:</p>
                  <BlockMath math="x^2-7x+12 = (x-3)(x-4)" />
                  <p>Set the fully factorised polynomial to 0:</p>
                  <BlockMath math="(x+7)(x-3)(x-4) = 0" />
                  <p>Therefore, the roots are <InlineMath math="x = -7, x = 3, x = 4" />.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "poly-eq",
        title: "Determining the Equation of a Graph",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=2050",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Given the roots and at least one other point on the graph, we can establish the graph's equation.</p>
            <p>If the roots are <InlineMath math="x = a, x = b" /> and <InlineMath math="x = c" />, the equation is of the form <InlineMath math="y = k(x-a)(x-b)(x-c)" />. We can find <InlineMath math="k" /> using the other given point.</p>
            
            <h4 className="text-xl font-bold text-white mt-8 mb-4">Repeated Roots</h4>
            <p>If a repeated root exists, then a stationary point lies on the x-axis.</p>
            <p>Recall that a repeated root exists when two roots, and hence two factors, are equal.</p>
            <p>If a graph has a root <InlineMath math="x=a" /> and a repeated root at <InlineMath math="x=b" /> (where it touches the x-axis), the equation is of the form <InlineMath math="y = k(x-a)(x-b)^2" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>You must find <InlineMath math="k" />.</strong> Many candidates find the factors and then stop, with <em>no strategy at all for finding k</em>. Substitute another point from the graph — usually the <InlineMath math="y" />-intercept — and solve.</li>
                <li><strong>Signs of the roots:</strong> sign errors here are extremely common. A root at <InlineMath math="x = -3" /> gives the factor <InlineMath math="(x+3)" />.</li>
                <li><strong>A touch means a repeated factor:</strong> where the curve touches the axis and turns back, that factor is squared. Treating it as a single root gives a curve of the wrong degree.</li>
                <li><strong>Count the degree:</strong> a cubic needs three factors in total, counting the repeat twice.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "eq-ex1",
            question: (
              <div className="space-y-4">
                <p>Find the equation of the cubic shown in the diagram:</p>
                <div className="bg-black/20 p-6 rounded-xl flex items-center justify-center">
                  <PolyCubicGraph1 />
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>The roots are <InlineMath math="x = -6, x = -3" /> and <InlineMath math="x = 1" />.</p>
                <p>So the equation is of the form:</p>
                <BlockMath math="y = k(x+6)(x+3)(x-1)" />
                <p>We are given the y-intercept <InlineMath math="(0, -36)" />. Substitute <InlineMath math="x=0" /> and <InlineMath math="y=-36" />:</p>
                <BlockMath math="-36 = k(0+6)(0+3)(0-1)" />
                <BlockMath math="-36 = k(6)(3)(-1)" />
                <BlockMath math="-36 = -18k" />
                <BlockMath math="k = 2" />
                <p>Therefore, the valid equation is:</p>
                <BlockMath math="y = 2(x+6)(x+3)(x-1)" />
              </div>
            )
          },
          {
            id: "eq-ex2",
            question: (
              <div className="space-y-4">
                <p>Repeated Roots. Find the equation of the cubic shown in the diagram:</p>
                <div className="bg-black/20 p-6 rounded-xl flex items-center justify-center">
                  <PolyCubicGraph2 />
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>There is a root at <InlineMath math="x = -2" /> and a repeated root (touches the x-axis) at <InlineMath math="x = 3" />.</p>
                <p>The equation is of the form:</p>
                <BlockMath math="y = k(x+2)(x-3)^2" />
                <p>We use the point <InlineMath math="(0, 9)" /> to find <InlineMath math="k" />. Substitute <InlineMath math="x=0, y=9" />:</p>
                <BlockMath math="9 = k(0+2)(0-3)^2" />
                <BlockMath math="9 = k(2)(-3)^2" />
                <BlockMath math="9 = k(2)(9)" />
                <BlockMath math="9 = 18k" />
                <BlockMath math="k = \frac{1}{2}" />
                <p>Therefore, the Valid equation is:</p>
                <BlockMath math="y = \frac{1}{2}(x+2)(x-3)^2" />
              </div>
            )
          }
        ]
      },
      {
        id: "poly-intersection",
        title: "Intersection of Two Graphs",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=2298",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>Given two equations of graphs, we can find their points of intersection. We already have experience of this with straight lines (National 5) and quadratics/lines.</p>
            <p>To find the intersection, equate the two expressions <InlineMath math="f(x) = g(x)" /> and solve for <InlineMath math="x" />.</p>
            <p>Two graphs could have several points of intersection, one point of intersection, or none:</p>
            <div className="my-8 p-6 bg-black/20 rounded-xl border border-white/10">
              <PolyIntersectionDiagrams />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Set the equations equal:</strong> intersections happen where the <InlineMath math="y" /> values match. Bring everything to one side to get a polynomial equal to zero.</li>
              <li><strong>Solve fully, then find the <InlineMath math="y" /> values:</strong> the <InlineMath math="x" /> values are only half the answer. Substitute each back to give coordinates.</li>
              <li><strong>Substitute into the simpler equation:</strong> usually the straight line — it is faster and less error-prone.</li>
              <li><strong>Watch the signs when subtracting:</strong> subtracting a whole polynomial changes every one of its terms.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "intersection-ex1",
            question: <p>Find the coordinates of the points where the curve with equation <InlineMath math="y=x^3-x^2" /> intersects the line with equation <InlineMath math="y=5x+3" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Equate the expressions for <InlineMath math="y" />:</p>
                <BlockMath math="x^3 - x^2 = 5x + 3" />
                <p>Rearrange into standard polynomial form <InlineMath math="f(x)=0" />:</p>
                <BlockMath math="x^3 - x^2 - 5x - 3 = 0" />
                <p>We need to solve this cubic. Let <InlineMath math="f(x) = x^3 - x^2 - 5x - 3" />.</p>
                <p>Test factors of -3: <InlineMath math="\pm 1, \pm 3" />.</p>
                <p>Try <InlineMath math="x = -1" />:</p>
                <BlockMath math="f(-1) = (-1)^3 - (-1)^2 - 5(-1) - 3 = -1 - 1 + 5 - 3 = 0" />
                <p>So <InlineMath math="(x+1)" /> is a factor. Use synthetic division to find the quotient:</p>
                <SyntheticDivision root="-1" coeffs={["1", "-1", "-5", "-3"]} midRow={["-1", "2", "3"]} bottomRow={["1", "-2", "-3", "0"]} />
                <BlockMath math="x^3 - x^2 - 5x - 3 = (x+1)(x^2 - 2x - 3) = 0" />
                <p>Factorise the quadratic <InlineMath math="x^2 - 2x - 3" />:</p>
                <BlockMath math="(x+1)(x-3)(x+1) = 0" />
                <BlockMath math="(x+1)^2(x-3) = 0" />
                <p>So the x-coordinates are <InlineMath math="x = -1" /> and <InlineMath math="x = 3" />.</p>
                <p>Substitute these <InlineMath math="x" /> values back into the linear equation <InlineMath math="y=5x+3" /> to find the <InlineMath math="y" /> values:</p>
                <p>For <InlineMath math="x = -1" />:</p>
                <BlockMath math="y = 5(-1) + 3 = -2" />
                <p>For <InlineMath math="x = 3" />:</p>
                <BlockMath math="y = 5(3) + 3 = 18" />
                <p>The points of intersection are <InlineMath math="(-1, -2)" /> and <InlineMath math="(3, 18)" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "discriminant",
        title: "Discriminant",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=9",
        theory: (
          <div className="space-y-6 text-lg text-slate-300">
            <p>Given a quadratic equation of the form, <InlineMath math="ax^2+bx+c=0" />, the <strong>discriminant</strong> is defined by <InlineMath math="b^2-4ac" />.</p>
            <p>It is worth seeing where it comes from. Any quadratic equation can be solved with the <strong>quadratic formula</strong>:</p>
            <BlockMath math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
            <p>The discriminant is exactly the expression <em>under the square root</em>. That is why it controls the roots: you cannot take the square root of a negative number, and a square root of zero adds nothing, so the sign of <InlineMath math="b^2-4ac" /> decides how many roots there are before you calculate anything.</p>
            <div className="my-8 p-6 bg-black/20 rounded-xl border border-white/10">
              <DiscriminantDiagram />
            </div>
            <p>This gives three cases, which you should be able to state and recognise:</p>
            <BlockMath math="\begin{aligned} b^2 - 4ac &\gt 0 &&\Rightarrow \text{two real and distinct roots} \\ b^2 - 4ac &= 0 &&\Rightarrow \text{two real and equal roots (a repeated root)} \\ b^2 - 4ac &\lt 0 &&\Rightarrow \text{no real roots} \end{aligned}" />
            <p>When <InlineMath math="b^2-4ac = 0" /> the parabola touches the <InlineMath math="x" />-axis at exactly one point — its turning point sits on the axis. This is the case examiners use most, because &ldquo;equal roots&rdquo; and &ldquo;tangent to&rdquo; mean the same thing.</p>
            <p>If <InlineMath math="b^2-4ac \gt 0" /> and is a <strong>perfect square</strong>, the roots are <em>rational</em> and the quadratic factorises; if it is positive but not a perfect square, the roots are <em>irrational</em>.</p>
            <p>The discriminant has many uses including finding unknown terms in a quadratic equation.</p>
            <p><strong>The Golden Rule:</strong> before substituting, write the equation in the form <InlineMath math="ax^2+bx+c=0" /> with everything on one side — reading <InlineMath math="a" />, <InlineMath math="b" /> and <InlineMath math="c" /> off an equation that has not been rearranged is the most common way to lose these marks.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>State the condition you are using.</strong> The most frequently repeated fault on discriminant questions is using an incorrect condition, or never stating the inequality being solved at all. Write down <InlineMath math="b^2-4ac \lt 0" /> (or whichever applies) before you solve it.</li>
                <li><strong>Brackets when substituting:</strong> marks are routinely lost for not using brackets when substituting into <InlineMath math="b^2-4ac" />. With <InlineMath math="b" /> negative or a coefficient in terms of <InlineMath math="k" />, brackets are essential.</li>
                <li><strong>Two regions need two inequalities:</strong> a single inequality is often wrongly used to describe two separate regions. If the answer is &ldquo;<InlineMath math="k \lt 0" /> or <InlineMath math="k \gt 4" />&rdquo;, write both — it cannot be compressed into one chain.</li>
                <li><strong>Match the condition to the wording:</strong> &ldquo;two distinct real roots&rdquo; is <InlineMath math="\gt 0" />; &ldquo;equal roots&rdquo; and &ldquo;is a tangent to&rdquo; are both <InlineMath math="= 0" />; &ldquo;no real roots&rdquo; and &ldquo;does not intersect&rdquo; are both <InlineMath math="\lt 0" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "disc-ex1",
            question: <p>Find the nature of the roots of <InlineMath math="9x^2+21x+16=0" /></p>,
            solution: (
              <div className="space-y-4">
                <p>We use the discriminant <InlineMath math="b^2-4ac" /> with <InlineMath math="a=9, b=21, c=16" />.</p>
                <BlockMath math="b^2-4ac = 21^2 - 4(9)(16)" />
                <BlockMath math="\phantom{b^2-4ac} = 441 - 576" />
                <BlockMath math="\phantom{b^2-4ac} = -135" />
                <p>Since <InlineMath math="b^2-4ac < 0" />, there are no real roots.</p>
              </div>
            )
          },
          {
            id: "disc-ex2",
            question: <p>Find the value of <InlineMath math="q" /> such that <InlineMath math="6x^2+12x+q=0" /> has real roots.</p>,
            solution: (
              <div className="space-y-4">
                <p>For real roots (either repeated or distinct), we need <InlineMath math="b^2-4ac \ge 0" />.</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><InlineMath math="a = 6" /></li>
                  <li><InlineMath math="b = 12" /></li>
                  <li><InlineMath math="c = q" /></li>
                </ul>
                <BlockMath math="12^2 - 4(6)(q) \ge 0" />
                <BlockMath math="144 - 24q \ge 0" />
                <BlockMath math="144 \ge 24q" />
                <BlockMath math="q \le 6" />
              </div>
            )
          },
          {
            id: "disc-ex3",
            question: <p>Show that <InlineMath math="(2k+4)x^2+(3k+2)x+(k-2)=0" /> always has real roots.</p>,
            solution: (
              <div className="space-y-4">
                <p>Here <InlineMath math="a=(2k+4), b=(3k+2), c=(k-2)" />.</p>
                <BlockMath math="b^2-4ac = (3k+2)^2 - 4(2k+4)(k-2)" />
                <BlockMath math="\phantom{b^2-4ac} = (9k^2+12k+4) - 4(2k^2-4k+4k-8)" />
                <BlockMath math="\phantom{b^2-4ac} = 9k^2+12k+4 - 8k^2 + 32" />
                <BlockMath math="\phantom{b^2-4ac} = k^2+12k+36" />
                <BlockMath math="\phantom{b^2-4ac} = (k+6)^2" />
                <p>Since any real number squared is greater than or equal to zero, <InlineMath math="(k+6)^2 \ge 0" />.</p>
                <p>Therefore, the roots are always real.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "intersection-lines-parabolas",
        title: "Intersection of Lines and Parabolas",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=309",
        theory: (
          <div className="space-y-6 text-lg text-slate-300">
            <p>A line may:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>intersect a parabola twice</li>
              <li>touch a parabola at one point i.e. tangent</li>
              <li>not intersect a parabola at all</li>
            </ul>
            <p>If we have a line with equation of the form <InlineMath math="y=mx+k" /> and parabola with equation of the form <InlineMath math="y=px^2+qx+r" />, equating gives us:</p>
            <BlockMath math="mx+k=px^2+qx+r" />
            <BlockMath math="px^2+qx-mx+r-k=0" />
            <BlockMath math="px^2+(q-m)x+(r-k)=0" />
            <p>This gives us a quadratic equation; hence, we can conclude:</p>
            <div className="my-8 p-6 bg-black/20 rounded-xl border border-white/10">
              <IntersectionDiagram />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>State the condition you are testing:</strong> two intersections need <InlineMath math="b^2-4ac \gt 0" />, a tangent needs <InlineMath math="= 0" />, and no intersection needs <InlineMath math="\lt 0" />. Write it down before you solve — leaving it unstated is one of the most repeated faults on these questions.</li>
              <li><strong>Rearrange to zero first:</strong> substitute the line into the curve, then collect everything on one side before reading off <InlineMath math="a" />, <InlineMath math="b" /> and <InlineMath math="c" />.</li>
              <li><strong>Use brackets when substituting:</strong> especially with a negative <InlineMath math="b" /> or a coefficient in terms of <InlineMath math="k" />.</li>
              <li><strong>"Tangent" and "equal roots" are the same statement:</strong> and both mean the discriminant is zero.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "intersection-ex1",
            question: <p>Find the coordinates of the points where the line with equation <InlineMath math="y=2x+1" /> intersects the curve with equation <InlineMath math="y=x^2-2" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Equate the expressions for <InlineMath math="y" />:</p>
                <BlockMath math="x^2 - 2 = 2x + 1" />
                <p>Rearrange into standard quadratic form (<InlineMath math="ax^2+bx+c=0" />):</p>
                <BlockMath math="x^2 - 2x - 3 = 0" />
                <p>Factorise to solve for <InlineMath math="x" />:</p>
                <BlockMath math="(x - 3)(x + 1) = 0" />
                <p>So <InlineMath math="x = 3" /> or <InlineMath math="x = -1" />.</p>
                <p>Substitute these <InlineMath math="x" /> values back into the linear equation (it's usually simpler) to find the corresponding <InlineMath math="y" /> values:</p>
                <p>If <InlineMath math="x = 3" />, <InlineMath math="y = 2(3) + 1 = 7" />. (Point: <InlineMath math="(3, 7)" />)</p>
                <p>If <InlineMath math="x = -1" />, <InlineMath math="y = 2(-1) + 1 = -1" />. (Point: <InlineMath math="(-1, -1)" />)</p>
                <p>The points of intersection are <InlineMath math="(3, 7)" /> and <InlineMath math="(-1, -1)" />.</p>
              </div>
            )
          },
          {
            id: "intersection-ex2",
            question: <p>Show that the line with equation <InlineMath math="y=5x-2" /> is a tangent to the parabola <InlineMath math="y=2x^2+x" /> and find the point of contact.</p>,
            solution: (
              <div className="space-y-4">
                <p>Equate the expressions for <InlineMath math="y" />:</p>
                <BlockMath math="2x^2 + x = 5x - 2" />
                <BlockMath math="2x^2 - 4x + 2 = 0" />
                <p>Check the discriminant <InlineMath math="b^2 - 4ac" /> of this resulting quadratic, where <InlineMath math="a=2, b=-4, c=2" />:</p>
                <BlockMath math="b^2 - 4ac = (-4)^2 - 4(2)(2) = 16 - 16 = 0" />
                <p>Since <InlineMath math="b^2 - 4ac = 0" />, there is 1 real and equal root. The line meets the parabola exactly once, so it is a tangent.</p>
                <p>To find the point of contact, solve the equation:</p>
                <BlockMath math="2(x^2 - 2x + 1) = 0" />
                <BlockMath math="x^2 - 2x + 1 = 0" />
                <BlockMath math="(x - 1)(x - 1) = 0" />
                <p>So <InlineMath math="x = 1" />.</p>
                <p>Substitute <InlineMath math="x = 1" /> into the linear equation to find <InlineMath math="y" />:</p>
                <BlockMath math="y = 5(1) - 2 = 3" />
                <p>The point of contact is <InlineMath math="(1, 3)" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "solving-quadratic-inequalities",
        title: "Solving Quadratic Inequalities",
        videoUrl: "https://www.youtube.com/embed/eaJ5zODvn2M?start=545",
        theory: (
          <div className="space-y-6 text-lg text-slate-300">
            <p>Quadratic inequalities can come in one of the following forms:</p>
            <BlockMath math="ax^2 + bx + c \gt 0 \qquad ax^2 + bx + c \geq 0" />
            <BlockMath math="ax^2 + bx + c \lt 0 \qquad ax^2 + bx + c \leq 0" />
            <p>To solve a quadratic inequality we must determine which part of the graph lies above or below the x-axis. We can determine this via a sketch of the parabola.</p>
            <div className="my-8 p-6 bg-black/20 rounded-xl border border-white/10">
              <InequalitiesDiagram />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Sketch the parabola:</strong> find the roots, decide whether it opens up or down, then read off where it is above or below the axis. Guessing the direction of the inequality is the main way marks go here.</li>
              <li><strong>Two regions need two inequalities:</strong> an answer such as "<InlineMath math="x \lt 1" /> or <InlineMath math="x \gt 4" />" cannot be compressed into a single chain.</li>
              <li><strong>A negative <InlineMath math="x^2" /> coefficient flips the shape:</strong> the parabola opens downwards, so the regions swap over.</li>
              <li><strong>Rearrange to zero first:</strong> you cannot read off the regions until one side is zero.</li>
              <li><strong>Watch strict versus inclusive:</strong> <InlineMath math="\geq" /> includes the roots themselves, <InlineMath math="\gt" /> does not.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "inequalities-ex1",
            question: <p>Solve <InlineMath math="(x-3)(x+5) \ge 0" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, identify the roots of the corresponding equation <InlineMath math="(x-3)(x+5) = 0" />:</p>
                <p><InlineMath math="x = 3" /> or <InlineMath math="x = -5" />.</p>
                <p>The parabola <InlineMath math="y = (x-3)(x+5) = x^2 + 2x - 15" /> has a positive <InlineMath math="x^2" /> coefficient (it's a "U" shape).</p>
                <p>We want where this graph is <InlineMath math="\ge 0" /> (above or on the x-axis).</p>
                <p>From a sketch, the graph is above the x-axis for <InlineMath math="x \le -5" /> or <InlineMath math="x \ge 3" />.</p>
              </div>
            )
          },
          {
            id: "inequalities-ex2",
            question: <p>Solve <InlineMath math="x^2-4x-21 < 0" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, factorise to find the roots:</p>
                <BlockMath math="x^2-4x-21 = (x-7)(x+3) = 0" />
                <p>Roots are <InlineMath math="x = 7" /> and <InlineMath math="x = -3" />.</p>
                <p>The parabola is "U" shaped (<InlineMath math="a > 0" />).</p>
                <p>We want <InlineMath math="< 0" /> (below the x-axis).</p>
                <p>From a sketch, the graph is below the x-axis between the roots.</p>
                <p>The solution is <InlineMath math="-3 < x < 7" />.</p>
              </div>
            )
          },
          {
            id: "inequalities-ex3",
            question: <p>Solve <InlineMath math="4-9x^2 < 0" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, find the roots of <InlineMath math="4 - 9x^2 = 0" />:</p>
                <BlockMath math="(2 - 3x)(2 + 3x) = 0" />
                <p>Roots are <InlineMath math="x = \frac{2}{3}" /> and <InlineMath math="x = -\frac{2}{3}" />.</p>
                <p>The parabola <InlineMath math="y = 4 - 9x^2" /> has a negative <InlineMath math="x^2" /> coefficient (it's an "n" shape or inverted "U").</p>
                <p>We want <InlineMath math="< 0" /> (below the x-axis).</p>
                <p>From a sketch, the graph is below the x-axis passing outside the roots.</p>
                <p>The solution is <InlineMath math="x < -\frac{2}{3}" /> or <InlineMath math="x > \frac{2}{3}" />.</p>
                <p className="text-sm italic text-slate-400 mt-4">Alternatively, multiplying by -1 gives <InlineMath math="9x^2 - 4 > 0" />. This produces the same result using a positive "U" shaped parabola.</p>
              </div>
            )
          },
          {
            id: "inequalities-ex4",
            question: <p>Find the values of <InlineMath math="q" /> for which <InlineMath math="x^2+(q-4)x+\frac{1}{2}q=0" /> has non-real roots.</p>,
            solution: (
              <div className="space-y-4">
                <p>For non-real roots, we require <InlineMath math="b^2 - 4ac < 0" />.</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><InlineMath math="a = 1" /></li>
                  <li><InlineMath math="b = q - 4" /></li>
                  <li><InlineMath math="c = \frac{1}{2}q" /></li>
                </ul>
                <BlockMath math="(q - 4)^2 - 4(1)(\frac{1}{2}q) < 0" />
                <BlockMath math="q^2 - 8q + 16 - 2q < 0" />
                <BlockMath math="q^2 - 10q + 16 < 0" />
                <p>Now we have a quadratic inequality to solve. Find the roots of <InlineMath math="q^2 - 10q + 16 = 0" />:</p>
                <BlockMath math="(q - 8)(q - 2) = 0" />
                <p>Roots are <InlineMath math="q = 8" /> and <InlineMath math="q = 2" />.</p>
                <p>The parabola <InlineMath math="y = q^2 - 10q + 16" /> is "U" shaped. We want where it is <InlineMath math="< 0" /> (below the horizontal axis).</p>
                <p>This occurs between the roots, so the solution is <InlineMath math="2 < q < 8" />.</p>
              </div>
            )
          },
          {
            id: "inequalities-ex5",
            question: <p>Where is <InlineMath math="y=\frac{1}{3}x^3+2x^2-5x+3" /> increasing?</p>,
            solution: (
              <div className="space-y-4">
                <p>A function is increasing when its derivative is greater than zero (<InlineMath math="\frac{dy}{dx} > 0" />).</p>
                <p>First, find the derivative:</p>
                <BlockMath math="\frac{dy}{dx} = x^2 + 4x - 5" />
                <p>Set up the inequality:</p>
                <BlockMath math="x^2 + 4x - 5 > 0" />
                <p>Find the roots of <InlineMath math="x^2 + 4x - 5 = 0" />:</p>
                <BlockMath math="(x + 5)(x - 1) = 0" />
                <p>Roots are <InlineMath math="x = -5" /> and <InlineMath math="x = 1" />.</p>
                <p>The parabola is "U" shaped. We want <InlineMath math="> 0" /> (above the x-axis).</p>
                <p>This occurs outside the roots. So the function is increasing when <InlineMath math="x < -5" /> or <InlineMath math="x > 1" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "circles",
    title: "Circles",
    topics: [
      {
        id: "circles-intro",
        title: "Introduction",
        videoUrl: "https://www.youtube.com/embed/lRdDjVcj8B0?start=0",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The equation of a circle with centre <InlineMath math="(0,0)" /> is <InlineMath math="x^2+y^2=r^2" /></p>
            <div className="bg-black/20 p-6 rounded-xl border border-white/10 flex justify-center">
              <svg viewBox="-60 -60 120 120" className="w-[15rem] h-auto vector-graphic text-slate-100 max-w-full">
                <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <polygon points="50,0 47,-2 47,2" fill="currentColor" />
                <polygon points="0,50 -2,47 2,47" fill="currentColor" />
                <text x="52" y="2" fill="currentColor" fontSize="4" fontStyle="italic">x</text>
                <text x="2" y="52" fill="currentColor" fontSize="4" fontStyle="italic">y</text>
                
                <circle cx="0" cy="0" r="35" fill="none" stroke="#EF4444" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="#EF4444" />
                <text x="-3" y="-3" fill="#EF4444" fontSize="4" textAnchor="end">(0,0)</text>
                
                <circle cx="21" cy="28" r="1.5" fill="#EF4444" />
                <text x="24" y="29" fill="#EF4444" fontSize="4">(x,y)</text>
                
                <line x1="0" y1="0" x2="21" y2="28" stroke="#EF4444" strokeWidth="0.5" />
                <text x="8" y="15" fill="#EF4444" fontSize="4" fontStyle="italic">r</text>
                
                <line x1="21" y1="0" x2="21" y2="28" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="1,1" />
                <text x="23" y="14" fill="#EF4444" fontSize="4" fontStyle="italic">y</text>
                
                <line x1="0" y1="0" x2="21" y2="0" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="1,1" />
                <text x="10" y="-3" fill="#EF4444" fontSize="4" fontStyle="italic">x</text>
                
                <polyline points="18,0 18,3 21,3" fill="none" stroke="#EF4444" strokeWidth="0.5" />
              </svg>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Radius or diameter?</strong> the equation uses <InlineMath math="r^2" />, so a question that gives the diameter needs halving first. This is the most common single error in circle work.</li>
              <li><strong>The angle in a semicircle is a right angle:</strong> it is worth knowing, because it converts many circle problems into perpendicular-gradient problems.</li>
              <li><strong>A tangent is perpendicular to the radius at the point of contact:</strong> this is the fact almost every tangent question depends on.</li>
              <li><strong>Keep the radius exact:</strong> leave it as a surd rather than rounding — a rounded radius will not satisfy the equation later.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "circle-intro-ex1",
            question: <p>State the equation of the circle with centre <InlineMath math="(0,0)" /> and radius 5 units.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="x^2 + y^2 = r^2" />
                <BlockMath math="x^2 + y^2 = 5^2" />
                <BlockMath math="x^2 + y^2 = 25" />
              </div>
            )
          },
          {
            id: "circle-intro-ex2",
            question: <p>State the centre and radius of the circle with equation <InlineMath math="x^2+y^2=121" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Centre is <InlineMath math="(0,0)" />.</p>
                <BlockMath math="r^2 = 121" />
                <BlockMath math="r = \sqrt{121} = 11" />
                <p>Radius is 11 units.</p>
              </div>
            )
          },
          {
            id: "circle-intro-ex3",
            question: <p>State the equation of the circle with centre <InlineMath math="(0,0)" /> which passes through the point <InlineMath math="(-5,12)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Substitute <InlineMath math="x = -5" /> and <InlineMath math="y = 12" /> into <InlineMath math="x^2 + y^2 = r^2" /> to find <InlineMath math="r^2" />:</p>
                <BlockMath math="(-5)^2 + 12^2 = r^2" />
                <BlockMath math="25 + 144 = r^2" />
                <BlockMath math="169 = r^2" />
                <p>The equation is:</p>
                <BlockMath math="x^2 + y^2 = 169" />
              </div>
            )
          }
        ]
      },
      {
        id: "circles-eq",
        title: "Equation of a Circle",
        videoUrl: "https://www.youtube.com/embed/lRdDjVcj8B0?start=19",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The equation of a circle with centre <InlineMath math="(a,b)" /> and radius <InlineMath math="r" /> units is:</p>
            <BlockMath math="(x-a)^2+(y-b)^2=r^2" />
            <div className="bg-black/20 p-6 rounded-xl border border-white/10 flex justify-center mt-6">
              <svg viewBox="-40 -40 100 100" className="w-[15rem] h-auto vector-graphic text-slate-100 max-w-full">
                <line x1="-30" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="-30" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <polygon points="50,0 47,-2 47,2" fill="currentColor" />
                <polygon points="0,50 -2,47 2,47" fill="currentColor" />
                <text x="52" y="2" fill="currentColor" fontSize="4" fontStyle="italic">x</text>
                <text x="2" y="52" fill="currentColor" fontSize="4" fontStyle="italic">y</text>
                
                <circle cx="15" cy="15" r="25" fill="none" stroke="#EF4444" strokeWidth="1" />
                <circle cx="15" cy="15" r="1.5" fill="#EF4444" />
                <text x="13" y="16" fill="#EF4444" fontSize="4" textAnchor="end">(a, b)</text>
                
                <circle cx="35" cy="30" r="1.5" fill="#EF4444" />
                <text x="37" y="31" fill="#EF4444" fontSize="4">(x, y)</text>
                
                <line x1="15" y1="15" x2="35" y2="30" stroke="#EF4444" strokeWidth="0.5" />
                <text x="23" y="24" fill="#EF4444" fontSize="4" fontStyle="italic">r</text>
                
                <line x1="35" y1="15" x2="35" y2="30" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="1,1" />
                <text x="37" y="22" fill="#EF4444" fontSize="4" fontStyle="italic">y - b</text>
                
                <line x1="15" y1="15" x2="35" y2="15" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="1,1" />
                <text x="25" y="13" fill="#EF4444" fontSize="4" fontStyle="italic">x - a</text>
                
                <polyline points="32,15 32,18 35,18" fill="none" stroke="#EF4444" strokeWidth="0.5" />
              </svg>
            </div>
            
            <p className="mt-8 font-bold text-white">Task: Complete the tables</p>
            <div className="border border-white/10 rounded-xl bg-black/20 p-2 sm:p-4 mt-6">
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-3 font-bold text-white">Equation of Circle</th>
                      <th className="p-3 font-bold text-white">Centre</th>
                      <th className="p-3 font-bold text-white">Radius</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr><td className="p-3"><InlineMath math="(x-5)^2+(y-1)^2=8^2" /></td><td className="p-3"><InlineMath math="(5, 1)" /></td><td className="p-3">8</td></tr>
                    <tr><td className="p-3"><InlineMath math="(x+5)^2+(y+1)^2=100" /></td><td className="p-3"><InlineMath math="(-5, -1)" /></td><td className="p-3">10</td></tr>
                    <tr><td className="p-3"><InlineMath math="(x-2)^2+(y+1)^2=65" /></td><td className="p-3"><InlineMath math="(2, -1)" /></td><td className="p-3"><InlineMath math="\sqrt{65}" /></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-3 font-bold text-white">Centre</th>
                      <th className="p-3 font-bold text-white">Radius</th>
                      <th className="p-3 font-bold text-white">Equation of Circle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr><td className="p-3"><InlineMath math="(4, 9)" /></td><td className="p-3">7 units</td><td className="p-3"><InlineMath math="(x-4)^2+(y-9)^2=49" /></td></tr>
                    <tr><td className="p-3"><InlineMath math="(-2, 9)" /></td><td className="p-3"><InlineMath math="\sqrt{3}" /> units</td><td className="p-3"><InlineMath math="(x+2)^2+(y-9)^2=3" /></td></tr>
                    <tr><td className="p-3"><InlineMath math="(-2, -6)" /></td><td className="p-3"><InlineMath math="2\sqrt{5}" /> units</td><td className="p-3"><InlineMath math="(x+2)^2+(y+6)^2=20" /></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The signs inside the brackets flip:</strong> a centre of <InlineMath math="(3,-2)" /> gives <InlineMath math="(x-3)^2 + (y+2)^2 = r^2" />. Reading the centre straight out of the brackets without changing sign is the classic slip.</li>
              <li><strong>It is <InlineMath math="r^2" /> on the right:</strong> so a radius of 5 gives 25. Going the other way, remember to square root before quoting the radius.</li>
              <li><strong>Find the radius from two points if needed:</strong> the distance from the centre to a point on the circle is the radius — use the distance formula and keep it exact.</li>
              <li><strong>Do not expand unless asked:</strong> the centre-radius form is usually the most useful one to leave the answer in.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "eq-circle-ex",
            question: <p>The circle with centre <InlineMath math="(1,4)" /> also passes through the point <InlineMath math="(5,6)" />. Find the equation of this circle.</p>,
            solution: (
              <div className="space-y-4">
                <p>The equation is of the form <InlineMath math="(x-a)^2+(y-b)^2=r^2" />.</p>
                <p>Centre <InlineMath math="(a,b) = (1,4)" />, so:</p>
                <BlockMath math="(x-1)^2+(y-4)^2=r^2" />
                <p>Substitute the point <InlineMath math="(5,6)" /> to find <InlineMath math="r^2" />:</p>
                <BlockMath math="(5-1)^2+(6-4)^2=r^2" />
                <BlockMath math="(4)^2+(2)^2=r^2" />
                <BlockMath math="16+4=r^2" />
                <BlockMath math="r^2=20" />
                <p>So the equation is:</p>
                <BlockMath math="(x-1)^2+(y-4)^2=20" />
              </div>
            )
          }
        ]
      },
      {
        id: "circles-testing",
        title: "Testing a Point",
        videoUrl: "https://www.youtube.com/embed/OCrqCAz9llk",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Given a circle with centre <InlineMath math="(a,b)" /> and radius <InlineMath math="r" /> units, we can determine whether a point <InlineMath math="(p,q)" /> lies within the circle, on the circumference of the circle or out with the circle.</p>
            <div className="flex flex-wrap gap-6 items-center justify-center p-6 bg-black/20 border border-white/10 rounded-xl">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="4" fill="#EF4444" />
                </svg>
                <div className="text-center mt-2 text-sm">
                  <BlockMath math="(p-a)^2+(q-b)^2 < r^2" />
                  <p>Point lies within the circle</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="85" cy="30" r="4" fill="#EF4444" stroke="black" strokeWidth="1" />
                </svg>
                <div className="text-center mt-2 text-sm">
                  <BlockMath math="(p-a)^2+(q-b)^2 = r^2" />
                  <p>Point lies on the circumference of the circle</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="105" cy="50" r="4" fill="#EF4444" stroke="black" strokeWidth="1" />
                </svg>
                <div className="text-center mt-2 text-sm">
                  <BlockMath math="(p-a)^2+(q-b)^2 > r^2" />
                  <p>Point lies out with the circle</p>
                </div>
              </div>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Compare distance with radius:</strong> work out the distance from the centre to the point, then compare. Less than the radius is inside, equal is on, greater is outside.</li>
              <li><strong>State the conclusion:</strong> a calculation with no sentence does not answer a question that asks whether the point lies on the circle.</li>
              <li><strong>Substituting works too:</strong> put the coordinates into the left-hand side and compare with <InlineMath math="r^2" /> — often quicker than a square root.</li>
              <li><strong>Compare like with like:</strong> if you substitute, you are comparing with <InlineMath math="r^2" />, not with <InlineMath math="r" />.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "testing-pt-ex",
            question: <p>A circle has equation <InlineMath math="(x-2)^2+(y+5)^2=29" />. Determine where the points <InlineMath math="(2,1)" />, <InlineMath math="(7,-3)" /> and <InlineMath math="(2,-4)" /> lie in relation to the circle.</p>,
            solution: (
              <div className="space-y-4">
                <p>Evaluate <InlineMath math="(x-2)^2+(y+5)^2" /> for each point and compare with 29.</p>
                <div>
                  <p className="font-bold">For (2, 1):</p>
                  <BlockMath math="(2-2)^2 + (1+5)^2 = 0^2 + 6^2 = 36" />
                  <p>Since <InlineMath math="36 > 29" />, the point (2, 1) lies <strong>outside</strong> the circle.</p>
                </div>
                <div className="mt-4">
                  <p className="font-bold">For (7, -3):</p>
                  <BlockMath math="(7-2)^2 + (-3+5)^2 = 5^2 + 2^2 = 25 + 4 = 29" />
                  <p>Since <InlineMath math="29 = 29" />, the point (7, -3) lies <strong>on</strong> the circumference of the circle.</p>
                </div>
                <div className="mt-4">
                  <p className="font-bold">For (2, -4):</p>
                  <BlockMath math="(2-2)^2 + (-4+5)^2 = 0^2 + 1^2 = 1" />
                  <p>Since <InlineMath math="1 < 29" />, the point (2, -4) lies <strong>inside</strong> the circle.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "circles-general",
        title: "General Equation of a Circle",
        videoUrl: "https://www.youtube.com/embed/lRdDjVcj8B0?start=711",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The equation of a circle can be written in expanded form.</p>
            <p>The circle with centre (-2, 3) and radius 5 units has equation:</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <BlockMath math="(x+2)^2+(y-3)^2=25" />
              <BlockMath math="x^2+4x+4+y^2-6y+9=25" />
              <BlockMath math="x^2+4x+y^2-6y=12" />
              <BlockMath math="x^2+y^2+4x-6y-12=0" />
            </div>
            <p>This form of the equation is called the <strong>general equation of a circle</strong>.</p>
            
            <p className="mt-6">Working in reverse from the general equation you can find the centre and radius using completing the square.</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <BlockMath math="x^2+4x+y^2-6y=12" />
              <BlockMath math="(x+2)^2-4+(y-3)^2-9=12" />
              <BlockMath math="(x+2)^2+(y-3)^2=25" />
              <p>Centre (-2, 3), Radius = 5 units</p>
            </div>
            
            <p className="mt-6">Given what we have learned about the general equation of a circle so far, we can use this as a quicker way to find the centre and radius.</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <BlockMath math="x^2+y^2+2gx+2fy+c=0" />
              <BlockMath math="x^2+y^2+2gx+2fy=-c" />
              <BlockMath math="(x+g)^2-g^2+(y+f)^2-f^2=-c" />
              <BlockMath math="(x+g)^2+(y+f)^2=g^2+f^2-c" />
            </div>
            <p>This is now in the form <InlineMath math="(x-a)^2+(y-b)^2=r^2" />, giving:</p>
            <ul className="list-disc list-inside bg-black/20 p-4 rounded-xl space-y-2 mt-4 inline-block mx-auto text-white">
              <li>Centre: <strong><InlineMath math="(-g, -f)" /></strong></li>
              <li>Radius: <strong><InlineMath math="r = \sqrt{g^2+f^2-c}" /></strong></li>
              <li>Valid if: <strong><InlineMath math="g^2+f^2-c > 0" /></strong></li>
            </ul>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Sign of the centre:</strong> the centre is <InlineMath math="(-g,-f)" />, so the coefficients <InlineMath math="2g" /> and <InlineMath math="2f" /> flip sign twice. For <InlineMath math="x^2+y^2+4x-8y+7=0" />, <InlineMath math="2g=4" /> gives <InlineMath math="g=2" /> and the centre has <InlineMath math="x = -2" />.</li>
                <li><strong>Halve before you negate:</strong> reading the centre straight off as <InlineMath math="(-4, 8)" /> instead of <InlineMath math="(-2, 4)" /> is the classic slip.</li>
                <li><strong>Show your working:</strong> stating the centre and radius with <em>no supporting working</em> will not gain full marks. State <InlineMath math="g" />, <InlineMath math="f" /> and <InlineMath math="c" />, then the centre and radius.</li>
                <li><strong>Check it is a circle:</strong> if <InlineMath math="g^2+f^2-c \leq 0" /> there is no circle. When asked to <em>explain why</em> an equation is not a circle, work the value out and say it is negative.</li>
                <li><strong>Use earlier parts:</strong> a very common failure is not carrying an earlier answer forward — most candidates who lose marks here never use their part (a) result to find the centre. If you have just found a midpoint or an equation, it is almost certainly needed next.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "general-circ-ex1",
            question: <p>Find the radius and centre of the circle with equation <InlineMath math="x^2+y^2+4x-8y+7=0" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Compare with <InlineMath math="x^2+y^2+2gx+2fy+c=0" />:</p>
                <ul className="list-none space-y-1">
                  <li><InlineMath math="2g = 4 \implies g = 2" /></li>
                  <li><InlineMath math="2f = -8 \implies f = -4" /></li>
                  <li><InlineMath math="c = 7" /></li>
                </ul>
                <p>Centre: <InlineMath math="(-g, -f) = (-2, 4)" /></p>
                <p>Radius: <InlineMath math="r = \sqrt{g^2+f^2-c} = \sqrt{2^2 + (-4)^2 - 7} = \sqrt{4 + 16 - 7} = \sqrt{13}" /> units</p>
              </div>
            )
          },
          {
            id: "general-circ-ex2",
            question: <p>Explain why <InlineMath math="x^2+y^2+4x-8y+29=0" /> is not the equation of a circle.</p>,
            solution: (
              <div className="space-y-4">
                <p>Compare with <InlineMath math="x^2+y^2+2gx+2fy+c=0" />:</p>
                <ul className="list-none space-y-1">
                  <li><InlineMath math="2g = 4 \implies g = 2" /></li>
                  <li><InlineMath math="2f = -8 \implies f = -4" /></li>
                  <li><InlineMath math="c = 29" /></li>
                </ul>
                <p>Check the radius condition <InlineMath math="g^2+f^2-c > 0" />:</p>
                <BlockMath math="g^2+f^2-c = 2^2 + (-4)^2 - 29 = 4 + 16 - 29 = 20 - 29 = -9" />
                <p>Since <InlineMath math="g^2+f^2-c < 0" />, we would be taking the square root of a negative number for the radius. Therefore, it does not represent a valid circle.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "circles-intersection",
        title: "Intersection of Circles",
        videoUrl: "https://www.youtube.com/embed/lRdDjVcj8B0?start=1121",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Consider two circles with radii <InlineMath math="r_1" /> and <InlineMath math="r_2" /> with <InlineMath math="r_1 > r_2" />.</p>
            <p>Let <InlineMath math="d" /> be the distance between the centres of the two circles.</p>
            <div className="bg-black/20 p-6 rounded-xl border border-white/10 flex justify-center mt-6 mb-6">
              <svg viewBox="0 -40 180 80" className="w-[20rem] h-auto vector-graphic">
                <circle cx="40" cy="0" r="35" fill="none" stroke="#A855F7" strokeWidth="2" />
                <circle cx="40" cy="0" r="2" fill="#A855F7" />
                <line x1="40" y1="0" x2="60" y2="-28.6" stroke="#A855F7" strokeWidth="1" />
                <text x="48" y="-18" fill="#A855F7" fontSize="8" fontStyle="italic">r₁</text>

                <circle cx="140" cy="0" r="20" fill="none" stroke="#22C55E" strokeWidth="2" />
                <circle cx="140" cy="0" r="2" fill="#22C55E" />
                <line x1="140" y1="0" x2="154" y2="-14.1" stroke="#22C55E" strokeWidth="1" />
                <text x="144" y="-10" fill="#22C55E" fontSize="8" fontStyle="italic">r₂</text>

                <line x1="40" y1="0" x2="140" y2="0" stroke="currentColor" strokeWidth="1" />
                <text x="90" y="-5" fill="currentColor" fontSize="8" fontStyle="italic">d</text>
              </svg>
            </div>
            
            <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/10 p-2">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-2 border-r border-white/20"></th>
                    <th className="p-2 border-r border-white/20">The circles do not touch</th>
                    <th className="p-2 border-r border-white/20">The circles meet at one point only</th>
                    <th className="p-2">The circles meet at two distinct points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20 text-center">
                  <tr>
                    <td className="p-4 border-r border-white/20 text-left font-bold">External</td>
                    <td className="p-4 border-r border-white/20">
                      <svg viewBox="-40 -40 160 80" className="w-[10rem] h-auto vector-graphic mx-auto">
                        <circle cx="0" cy="0" r="25" fill="none" stroke="#A855F7" strokeWidth="2" />
                        <circle cx="70" cy="0" r="15" fill="none" stroke="#22C55E" strokeWidth="2" />
                        <line x1="0" y1="0" x2="70" y2="0" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="#A855F7" />
                        <circle cx="70" cy="0" r="2" fill="#22C55E" />
                        <text x="35" y="-5" fill="currentColor" fontSize="8" fontStyle="italic">d</text>
                      </svg>
                      <div className="mt-2"><InlineMath math="d > r_1 + r_2" /></div>
                    </td>
                    <td className="p-4 border-r border-white/20">
                      <svg viewBox="-40 -40 120 80" className="w-[8rem] h-auto vector-graphic mx-auto">
                        <circle cx="0" cy="0" r="25" fill="none" stroke="#A855F7" strokeWidth="2" />
                        <circle cx="40" cy="0" r="15" fill="none" stroke="#22C55E" strokeWidth="2" />
                        <line x1="0" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="#A855F7" />
                        <circle cx="40" cy="0" r="2" fill="#22C55E" />
                        <text x="20" y="-5" fill="currentColor" fontSize="8" fontStyle="italic">d</text>
                      </svg>
                      <div className="mt-2"><InlineMath math="d = r_1 + r_2" /></div>
                    </td>
                    <td className="p-4">
                      <svg viewBox="-40 -40 100 80" className="w-[7rem] h-auto vector-graphic mx-auto">
                        <circle cx="0" cy="0" r="25" fill="none" stroke="#A855F7" strokeWidth="2" />
                        <circle cx="30" cy="0" r="15" fill="none" stroke="#22C55E" strokeWidth="2" />
                        <line x1="0" y1="0" x2="30" y2="0" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="#A855F7" />
                        <circle cx="30" cy="0" r="2" fill="#22C55E" />
                        <text x="15" y="-5" fill="currentColor" fontSize="8" fontStyle="italic">d</text>
                      </svg>
                      <div className="mt-2 text-xs"><InlineMath math="r_1 - r_2 < d < r_1 + r_2" /></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-r border-white/20 text-left font-bold">Internal</td>
                    <td className="p-4 border-r border-white/20">
                      <svg viewBox="-30 -30 60 60" className="w-[6rem] h-auto vector-graphic mx-auto">
                        <circle cx="0" cy="0" r="25" fill="none" stroke="#A855F7" strokeWidth="2" />
                        <circle cx="-5" cy="0" r="10" fill="none" stroke="#22C55E" strokeWidth="2" />
                        <line x1="0" y1="0" x2="-5" y2="0" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="#A855F7" />
                        <circle cx="-5" cy="0" r="2" fill="#22C55E" />
                        <text x="-2.5" y="-5" fill="currentColor" fontSize="8" fontStyle="italic">d</text>
                      </svg>
                      <div className="mt-2"><InlineMath math="d < r_1 - r_2" /></div>
                    </td>
                    <td className="p-4 border-r border-white/20">
                      <svg viewBox="-30 -30 60 60" className="w-[6rem] h-auto vector-graphic mx-auto">
                        <circle cx="0" cy="0" r="25" fill="none" stroke="#A855F7" strokeWidth="2" />
                        <circle cx="10" cy="0" r="15" fill="none" stroke="#22C55E" strokeWidth="2" />
                        <line x1="0" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="#A855F7" />
                        <circle cx="10" cy="0" r="2" fill="#22C55E" />
                        <text x="5" y="-5" fill="currentColor" fontSize="8" fontStyle="italic">d</text>
                      </svg>
                      <div className="mt-2"><InlineMath math="d = r_1 - r_2" /></div>
                    </td>
                    <td className="p-4 bg-white/5"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Compare the distance between centres with the radii:</strong> touching externally means <InlineMath math="d = r_1 + r_2" />; touching internally means <InlineMath math="d = r_1 - r_2" />. Work out all three numbers before concluding.</li>
              <li><strong>Do not stop at the distance:</strong> the marks are for the comparison and the conclusion, so state which case applies and why.</li>
              <li><strong>Keep distances exact:</strong> rounding can make a genuine tangency look like a near miss.</li>
              <li><strong>Find the centres and radii correctly first:</strong> if either circle is in general form, extract <InlineMath math="(-g,-f)" /> and <InlineMath math="\sqrt{g^2+f^2-c}" /> before comparing anything.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "intersect-circ-ex1",
            question: (
              <div className="space-y-2">
                <p>Circle P has centre (-4,-1) and radius 2 units, circle Q has equation <InlineMath math="x^2+y^2-2x+6y+1=0" />.</p>
                <p>Show that the circles P and Q do not touch.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>Circle P:</strong> Centre = <InlineMath math="(-4, -1)" />, <InlineMath math="r_P = 2" /></p>
                <p><strong>Circle Q:</strong> <InlineMath math="x^2+y^2-2x+6y+1=0" /></p>
                <p>Centre: <InlineMath math="2g = -2 \implies g = -1" />, <InlineMath math="2f = 6 \implies f = 3" />. Centre = <InlineMath math="(1, -3)" />.</p>
                <p>Radius: <InlineMath math="r_Q = \sqrt{(-1)^2 + 3^2 - 1} = \sqrt{1 + 9 - 1} = \sqrt{9} = 3" /></p>
                <div className="my-4">
                  <p>Calculate distance <InlineMath math="d" /> between centres P and Q:</p>
                  <BlockMath math="d = \sqrt{(1 - (-4))^2 + (-3 - (-1))^2} = \sqrt{5^2 + (-2)^2} = \sqrt{25+4} = \sqrt{29} \approx 5.39" />
                </div>
                <p>Calculate <InlineMath math="r_P + r_Q" />:</p>
                <BlockMath math="r_P + r_Q = 2 + 3 = 5" />
                <p>Since <InlineMath math="d > r_P + r_Q" /> (<InlineMath math="\sqrt{29} > 5" />), the circles do not touch.</p>
              </div>
            )
          },
          {
            id: "intersect-circ-ex2",
            question: (
              <div className="space-y-2">
                <p>Circle R has equation <InlineMath math="x^2+y^2-2x-4y-4=0" />, and circle S has equation <InlineMath math="(x-4)^2+(y-6)^2=4" />.</p>
                <p>Show that the circles R and S touch externally.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>Circle R:</strong> Centre = <InlineMath math="(1, 2)" /></p>
                <p>Radius: <InlineMath math="r_R = \sqrt{(-1)^2 + (-2)^2 - (-4)} = \sqrt{1 + 4 + 4} = 3" /></p>
                <p><strong>Circle S:</strong> Centre = <InlineMath math="(4, 6)" />, <InlineMath math="r_S = \sqrt{4} = 2" /></p>
                <div className="my-4">
                  <p>Calculate distance <InlineMath math="d" /> between centres R and S:</p>
                  <BlockMath math="d = \sqrt{(4-1)^2 + (6-2)^2} = \sqrt{3^2 + 4^2} = \sqrt{9+16} = 5" />
                </div>
                <p>Calculate <InlineMath math="r_R + r_S" />:</p>
                <BlockMath math="r_R + r_S = 3 + 2 = 5" />
                <p>Since <InlineMath math="d = r_R + r_S" /> (<InlineMath math="5 = 5" />), the circles touch externally.</p>
              </div>
            )
          },
          {
            id: "intersect-circ-ex3",
            question: (
              <div className="space-y-2">
                <p>Circle A has equation <InlineMath math="(x-3)^2+(y+3)^2=64" />, and circle B has equation <InlineMath math="(x+1)^2+y^2=9" />.</p>
                <p>Show that the circles A and B touch internally.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>Circle A:</strong> Centre = <InlineMath math="(3, -3)" />, <InlineMath math="r_A = \sqrt{64} = 8" /></p>
                <p><strong>Circle B:</strong> Centre = <InlineMath math="(-1, 0)" />, <InlineMath math="r_B = \sqrt{9} = 3" /></p>
                <div className="my-4">
                  <p>Calculate distance <InlineMath math="d" /> between centres A and B:</p>
                  <BlockMath math="d = \sqrt{(-1-3)^2 + (0 - (-3))^2} = \sqrt{(-4)^2 + 3^2} = \sqrt{16+9} = 5" />
                </div>
                <p>Calculate <InlineMath math="r_A - r_B" />:</p>
                <BlockMath math="r_A - r_B = 8 - 3 = 5" />
                <p>Since <InlineMath math="d = r_A - r_B" /> (<InlineMath math="5 = 5" />), the circles touch internally.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "circles-tangents",
        title: "Equations of Tangents to Circles",
        videoUrl: "https://www.youtube.com/embed/lRdDjVcj8B0?start=1597",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We know from National 5 that if we have a circle and a tangent to that circle, the tangent meets the radius at right angles.</p>
            <div className="bg-black/20 p-6 rounded-xl border border-white/10 flex justify-center mt-6">
              <svg viewBox="-40 -10 80 80" className="w-[12rem] h-auto vector-graphic">
                <circle cx="0" cy="30" r="30" fill="none" stroke="#22C55E" strokeWidth="2" />
                <circle cx="0" cy="30" r="2" fill="#22C55E" />
                <circle cx="0" cy="60" r="2" fill="#22C55E" />
                <line x1="0" y1="30" x2="0" y2="60" stroke="#22C55E" strokeWidth="2" />
                <line x1="-30" y1="60" x2="30" y2="60" stroke="currentColor" strokeWidth="2" />
                <polyline points="0,55 5,55 5,60" fill="none" stroke="currentColor" strokeWidth="1" />
                
                <text x="-8" y="47" fill="#22C55E" fontSize="6" transform="rotate(-90 -8 47)">radius</text>
                <text x="0" y="68" fill="currentColor" fontSize="6" textAnchor="middle" fontStyle="italic">tangent</text>
              </svg>
            </div>
            <p>If the point of contact between the circle and the tangent is known, then we can calculate the gradient of the radius.</p>
            <p>The gradient of the tangent can then be found using <InlineMath math="m_{radius} \times m_{tangent} = -1" />.</p>
            <p>We then know the gradient of the tangent and we have the point of contact, therefore can find the equation of the tangent using <InlineMath math="y - b = m(x - a)" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Radius and tangent are perpendicular:</strong> so the tangent's gradient is the negative reciprocal of the radius gradient. Using the radius gradient itself is the standard error.</li>
              <li><strong>Find the radius gradient first:</strong> from the centre to the point of contact — in that order, though the gradient is the same either way.</li>
              <li><strong>Use the point of contact in the equation:</strong> <InlineMath math="y - b = m(x - a)" /> needs the point on the circle, not the centre.</li>
              <li><strong>"Show that the line is a tangent" is different:</strong> substitute and show the discriminant is zero, rather than finding an equation.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "tangents-ex1",
            question: <p>A(1, 3) lies on the circle with equation <InlineMath math="x^2+y^2+6x+2y-22=0" />. Find the equation of the tangent at A.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. Find the centre of the circle:</p>
                <BlockMath math="2g = 6 \implies g=3, \quad 2f = 2 \implies f=1" />
                <p>Centre C = <InlineMath math="(-3, -1)" /></p>
                
                <p className="mt-4">2. Calculate the gradient of the radius (from C to A):</p>
                <BlockMath math="m_{radius} = \frac{3 - (-1)}{1 - (-3)} = \frac{4}{4} = 1" />
                
                <p className="mt-4">3. Calculate the gradient of the tangent:</p>
                <p>Since the tangent is perpendicular to the radius, <InlineMath math="m_{tangent} = -1 / m_{radius} = -1" />.</p>
                
                <p className="mt-4">4. Find the equation of the tangent passing through A(1, 3):</p>
                <BlockMath math="y - 3 = -1(x - 1)" />
                <BlockMath math="y - 3 = -x + 1" />
                <BlockMath math="y = -x + 4" />
                <p>Or alternatively expressed as <InlineMath math="x+y-4=0" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "circles-line-intersection",
        title: "Intersections of Lines and Circles",
        videoUrl: "https://www.youtube.com/embed/lRdDjVcj8B0?start=1747",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We have previously studied the intersection of lines and curves. Similarly, lines and circles can intersect at two points, one point (tangent), or no points.</p>
            <div className="flex flex-wrap gap-6 items-center justify-center p-6 bg-black/20 border border-white/10 rounded-xl">
              <div className="flex flex-col items-center">
                <svg viewBox="-50 -50 100 100" className="w-24 h-24">
                  <circle cx="0" cy="0" r="35" fill="none" stroke="#22C55E" strokeWidth="3" />
                  <line x1="-30" y1="-50" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
                  <circle cx="-17" cy="-28" r="3" fill="#22C55E" />
                  <circle cx="17" cy="28" r="3" fill="#22C55E" />
                </svg>
                <div className="text-center mt-2 text-sm">
                  <p>Two intersections</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <svg viewBox="-50 -50 100 100" className="w-24 h-24">
                  <circle cx="0" cy="0" r="35" fill="none" stroke="#22C55E" strokeWidth="3" />
                  <line x1="20" y1="-50" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
                  <circle cx="34" cy="-5" r="3" fill="#22C55E" />
                </svg>
                <div className="text-center mt-2 text-sm">
                  <p>One intersection<br/>i.e. tangent</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <svg viewBox="-50 -50 100 100" className="w-24 h-24">
                  <circle cx="0" cy="0" r="35" fill="none" stroke="#22C55E" strokeWidth="3" />
                  <line x1="45" y1="-50" x2="70" y2="50" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className="text-center mt-2 text-sm">
                  <p>No intersections</p>
                </div>
              </div>
            </div>
            <p>We can use substitution to find out how many times a line and a circle touch.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Answer the question that was asked:</strong> a common waste of time is finding the centre and radius when the question <em>does not require them</em>. Substituting the line into the circle is the method — the centre and radius are not the answer.</li>
                <li><strong>Substitute, then use the discriminant:</strong> two intersections need <InlineMath math="b^2-4ac \gt 0" />, a tangent needs <InlineMath math="= 0" />, and no intersection needs <InlineMath math="\lt 0" />. State which you are testing.</li>
                <li><strong>Rearrange to <InlineMath math="ax^2+bx+c=0" /> first:</strong> after substituting you must collect everything on one side before reading off <InlineMath math="a" />, <InlineMath math="b" /> and <InlineMath math="c" />.</li>
                <li><strong>Give the points if asked:</strong> solving gives <InlineMath math="x" /> only. Substitute back into the <em>line</em> — much easier than the circle — to get each <InlineMath math="y" />, and write the coordinates.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "line-circ-ex1",
            question: <p>Find the points where the line with equation <InlineMath math="y=3x" /> intersects the circle with equation <InlineMath math="x^2+y^2=20" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Substitute <InlineMath math="y=3x" /> into the circle equation:</p>
                <BlockMath math="x^2 + (3x)^2 = 20" />
                <BlockMath math="x^2 + 9x^2 = 20" />
                <BlockMath math="10x^2 = 20" />
                <BlockMath math="x^2 = 2" />
                <BlockMath math="x = \pm \sqrt{2}" />
                <p>Now find the corresponding <InlineMath math="y" /> values using <InlineMath math="y=3x" />:</p>
                <p>For <InlineMath math="x = \sqrt{2}" />, <InlineMath math="y = 3\sqrt{2}" />.</p>
                <p>For <InlineMath math="x = -\sqrt{2}" />, <InlineMath math="y = -3\sqrt{2}" />.</p>
                <p>The points of intersection are <InlineMath math="(\sqrt{2}, 3\sqrt{2})" /> and <InlineMath math="(-\sqrt{2}, -3\sqrt{2})" />.</p>
              </div>
            )
          },
          {
            id: "line-circ-ex2",
            question: <p>Find the points where the line with equation <InlineMath math="y=2x+6" /> and circle with equation <InlineMath math="x^2+y^2+2x+2y-8=0" /> intersect.</p>,
            solution: (
              <div className="space-y-4">
                <p>Substitute <InlineMath math="y = 2x+6" /> into the circle equation:</p>
                <BlockMath math="x^2 + (2x+6)^2 + 2x + 2(2x+6) - 8 = 0" />
                <p>Expand the brackets:</p>
                <BlockMath math="x^2 + (4x^2 + 24x + 36) + 2x + (4x + 12) - 8 = 0" />
                <p>Simplify:</p>
                <BlockMath math="5x^2 + 30x + 40 = 0" />
                <p>Divide by 5:</p>
                <BlockMath math="x^2 + 6x + 8 = 0" />
                <p>Factorise:</p>
                <BlockMath math="(x+2)(x+4) = 0" />
                <p>Roots: <InlineMath math="x = -2" /> and <InlineMath math="x = -4" />.</p>
                <p>Find corresponding <InlineMath math="y" /> values:</p>
                <p>For <InlineMath math="x = -2" />, <InlineMath math="y = 2(-2)+6 = 2" />.</p>
                <p>For <InlineMath math="x = -4" />, <InlineMath math="y = 2(-4)+6 = -2" />.</p>
                <p>The points of intersection are <InlineMath math="(-2, 2)" /> and <InlineMath math="(-4, -2)" />.</p>
              </div>
            )
          },
          {
            id: "line-circ-ex3",
            question: <p>Show that the line <InlineMath math="x-3y=5" /> is a tangent to the circle with equation <InlineMath math="x^2+y^2-6x+8y+15=0" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Rearrange the line equation to substitute: <InlineMath math="x = 3y+5" />.</p>
                <p>Substitute into the circle equation:</p>
                <BlockMath math="(3y+5)^2 + y^2 - 6(3y+5) + 8y + 15 = 0" />
                <p>Expand:</p>
                <BlockMath math="(9y^2+30y+25) + y^2 - (18y+30) + 8y + 15 = 0" />
                <p>Simplify:</p>
                <BlockMath math="10y^2 + 20y + 10 = 0" />
                <p>Divide by 10:</p>
                <BlockMath math="y^2 + 2y + 1 = 0" />
                <p>Calculate the discriminant for this quadratic (<InlineMath math="a=1, b=2, c=1" />):</p>
                <BlockMath math="b^2 - 4ac = (2)^2 - 4(1)(1) = 4 - 4 = 0" />
                <p>Since the discriminant is 0, the equation has one repeated real root. Therefore, the line touches the circle at exactly one point, meaning it is a tangent.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "differentiation",
    title: "Differentiation",
    topics: [
     
      {
        id: "introduction-to-calculus",
        title: "Introduction & First Principles",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=26",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Calculus provides a tool for solving problems involving motion, such as orbits of planets or paths of rockets. It can be used to study any situation where a rate of increase or decrease is involved.</p>
            <p className="mb-6">The instantaneous speed at a certain moment in time is known as the <strong>rate of change</strong>. This is the same as finding the <strong>gradient of the tangent</strong> to a curve at a certain point.</p>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
              <h4 className="font-bold text-white text-xl mb-4">Differentiation from First Principles</h4>
              <p className="mb-4">The derivative of a function <InlineMath math="f(x)" /> is defined as the limit:</p>
              <BlockMath math="f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}" />
              <p className="mt-4 text-sm text-slate-300"><InlineMath math="f'(x)" /> is the <strong>derived function</strong> or <strong>derivative</strong> of <InlineMath math="f(x)" />.</p>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Keep the limit notation until the end:</strong> every line needs <InlineMath math="\lim_{h \to 0}" /> in front of it until you actually take the limit. Dropping it early is a communication error even if the algebra is right.</li>
              <li><strong>Expand <InlineMath math="f(x+h)" /> carefully:</strong> <InlineMath math="(x+h)^2 = x^2 + 2xh + h^2" />, not <InlineMath math="x^2 + h^2" />. This single expansion is where most first-principles marks are lost.</li>
              <li><strong>Cancel the <InlineMath math="h" />, do not set it to zero:</strong> divide the numerator and denominator by <InlineMath math="h" /> first. Substituting <InlineMath math="h = 0" /> before cancelling gives <InlineMath math="\tfrac{0}{0}" />.</li>
              <li><strong>Answer the question asked:</strong> "differentiate from first principles" means marks are for the process. Quoting the power rule scores nothing.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "first-principles-ex1",
            question: <p>Prove that if <InlineMath math="f(x) = x^2" /> then <InlineMath math="f'(x) = 2x" /> using differentiation from first principles.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} f'(x) &= \lim_{h \to 0} \frac{f(x + h) - f(x)}{h} \\ &= \lim_{h \to 0} \frac{(x + h)^2 - x^2}{h} \\ &= \lim_{h \to 0} \frac{x^2 + 2xh + h^2 - x^2}{h} \\ &= \lim_{h \to 0} \frac{2xh + h^2}{h} \\ &= \lim_{h \to 0} (2x + h) \\ &= 2x \text{ as required.} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "differentiating-polynomials",
        title: "Differentiating Terms (Positive, Negative & Fractional Indices)",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=432",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Rather than using first principles every time, we can use a general rule for polynomials.</p>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
              <h4 className="font-bold text-white text-xl mb-4">General Rule</h4>
              <p className="mb-4 text-center">If <InlineMath math="f(x) = x^n" /> then <InlineMath math="f'(x) = nx^{n-1} \quad (n \in \mathbb{R})" /></p>
              <p className="text-sm text-slate-300 text-center">Multiply by the power, reduce the power by 1.</p>
            </div>
            <p className="mb-6">This rule applies to positive, negative, and fractional indices.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Negative indices:</strong> negative indices are the most reliable source of dropped marks in differentiation. Reducing the power by 1 makes it <em>more</em> negative — <InlineMath math="x^{-2}" /> differentiates to <InlineMath math="-2x^{-3}" />, not <InlineMath math="-2x^{-1}" />.</li>
                <li><strong>Rewrite before you differentiate:</strong> the power rule only works on terms in the form <InlineMath math="ax^n" />. Roots and fractions must be written as indices first.</li>
                <li><strong>Consistent lines of working:</strong> differentiation is a place where each line must follow logically from the one above. Do not collapse several steps into one line.</li>
                <li><strong>Simplify the final answer:</strong> an unsimplified derivative can cost the final mark even when the differentiation is perfect.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "diff-poly-ex1",
            question: <p>A function <InlineMath math="f" /> is defined for <InlineMath math="x \in \mathbb{R}" /> by <InlineMath math="f(x) = x^4" />. Find <InlineMath math="f'(x)" />.</p>,
            solution: (
              <div className="space-y-4">
                 <BlockMath math="\begin{aligned} f(x) &= x^4 \\ f'(x) &= 4x^3 \end{aligned}" />
              </div>
            )
          },
          {
            id: "diff-poly-ex2",
            question: <p>A function <InlineMath math="f" /> is defined for <InlineMath math="x \in \mathbb{R}" /> by <InlineMath math="f(x) = 2x^3" />. Find <InlineMath math="f'(x)" />.</p>,
            solution: (
              <div className="space-y-4">
                 <BlockMath math="\begin{aligned} f(x) &= 2x^3 \\ f'(x) &= 6x^2 \end{aligned}" />
              </div>
            )
          },
          {
            id: "diff-poly-ex3",
            question: <p>Find <InlineMath math="f'(x)" /> if <InlineMath math="f(x) = x^{-3}" />.</p>,
            solution: (
              <div className="space-y-4">
                 <BlockMath math="\begin{aligned} f(x) &= x^{-3} \\ f'(x) &= -3x^{-4} \end{aligned}" />
              </div>
            )
          },
          {
            id: "diff-poly-ex4",
            question: <p>Find <InlineMath math="f'(x)" /> if <InlineMath math="f(x) = 4x^{-2}" />.</p>,
            solution: (
              <div className="space-y-4">
                 <BlockMath math="\begin{aligned} f(x) &= 4x^{-2} \\ f'(x) &= -8x^{-3} \end{aligned}" />
              </div>
            )
          },
          {
            id: "diff-poly-ex5",
            question: <p>Find <InlineMath math="f'(x)" /> if <InlineMath math="f(x) = x^{-\frac{1}{3}}" />.</p>,
            solution: (
              <div className="space-y-4">
                 <BlockMath math="\begin{aligned} f(x) &= x^{-\frac{1}{3}} \\ f'(x) &= -\frac{1}{3}x^{-\frac{4}{3}} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "preparing-to-differentiate-1",
        title: "Preparing to Differentiate 1 – Brackets",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=432",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Before differentiating, you must rewrite expressions in the form <InlineMath math="x^n" /> or <InlineMath math="ax^n" />.</p>
            <p className="mb-6">If the expression contains brackets, you should multiply them out first.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Multiply out completely before differentiating:</strong> there is no product rule at Higher, so a product must be expanded first. Differentiating each bracket separately is simply wrong.</li>
              <li><strong>Watch signs when expanding:</strong> a negative outside a bracket changes every term inside it.</li>
              <li><strong>Collect like terms first:</strong> tidying up before you differentiate makes the derivative far less error-prone.</li>
              <li><strong>Show the expanded form:</strong> jumping straight to the derivative loses the working mark, and each line must follow from the one above.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "prep-diff-1-ex1",
            question: <p>A function <InlineMath math="f" /> is defined for <InlineMath math="x \in \mathbb{R}" /> by <InlineMath math="f(x) = 3x^3 - 2x^2 + 5x" />. Find <InlineMath math="f'(x)" />.</p>,
            solution: (
              <div className="space-y-4">
                 <p>Differentiate each term one by one:</p>
                 <BlockMath math="\begin{aligned} f(x) &= 3x^3 - 2x^2 + 5x \\ f'(x) &= 9x^2 - 4x + 5 \end{aligned}" />
              </div>
            )
          },
          {
            id: "prep-diff-1-ex2",
            question: <p>Find <InlineMath math="\frac{dy}{dx}" /> when <InlineMath math="y = (x - 3)(x + 2)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First multiply out brackets:</p>
                <BlockMath math="\begin{aligned} y &= x^2 + 2x - 3x - 6 \\ y &= x^2 - x - 6 \end{aligned}" />
                <p>Now differentiate:</p>
                <BlockMath math="\frac{dy}{dx} = 2x - 1" />
              </div>
            )
          }
        ]
      },
      {
        id: "preparing-to-differentiate-2",
        title: "Preparing to Differentiate 2 – Indices",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=432",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Before differentiating, rewrite roots as fractional indices (<InlineMath math="\sqrt[n]{x^m} = x^{\frac{m}{n}}" />).</p>
            <p className="mb-6">Move variables out of the denominator to the numerator using negative indices (<InlineMath math="\frac{1}{x^n} = x^{-n}" />).</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Rewrite roots as fractional indices:</strong> <InlineMath math="\sqrt{x} = x^{1/2}" /> and <InlineMath math="\sqrt[3]{x^2} = x^{2/3}" />. You cannot apply the power rule until every term is in the form <InlineMath math="ax^n" />.</li>
              <li><strong>Subtracting 1 from a fraction:</strong> <InlineMath math="\tfrac{1}{2} - 1 = -\tfrac{1}{2}" />, so <InlineMath math="x^{1/2}" /> differentiates to <InlineMath math="\tfrac{1}{2}x^{-1/2}" />. This is a very common slip.</li>
              <li><strong>Negative indices go more negative:</strong> <InlineMath math="x^{-3}" /> differentiates to <InlineMath math="-3x^{-4}" />. Negative indices are the most reliable source of dropped marks in this topic.</li>
              <li><strong>Match the form of the question:</strong> if it was asked with roots, it is usually best to give the answer with roots too.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "prep-diff-2-ex1",
            question: <p>Differentiate <InlineMath math="\sqrt{x}" /> with respect to <InlineMath math="x" />.</p>,
            solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} y &= x^{\frac{1}{2}} \\ \frac{dy}{dx} &= \frac{1}{2}x^{-\frac{1}{2}} \\ &= \frac{1}{2x^{\frac{1}{2}}} \\ &= \frac{1}{2\sqrt{x}} \end{aligned}" />
               </div>
            )
          },
          {
            id: "prep-diff-2-ex2",
            question: <p>Find the derivative of <InlineMath math="y = \frac{1}{x^2}" /> with respect to <InlineMath math="x" />.</p>,
            solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} y &= x^{-2} \\ \frac{dy}{dx} &= -2x^{-3} \\ &= -\frac{2}{x^3} \end{aligned}" />
               </div>
            )
          },
          {
             id: "prep-diff-2-ex3",
             question: <p>Differentiate <InlineMath math="y = \frac{2}{x}" /> with respect to <InlineMath math="x" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} y &= 2x^{-1} \\ \frac{dy}{dx} &= -2x^{-2} \\ &= -\frac{2}{x^2} \end{aligned}" />
               </div>
             )
          },
          {
             id: "prep-diff-2-ex4",
             question: <p>Find the derivative of <InlineMath math="y = \frac{1}{2x}" /> with respect to <InlineMath math="x" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} y &= \frac{1}{2}x^{-1} \\ \frac{dy}{dx} &= -\frac{1}{2}x^{-2} \\ &= -\frac{1}{2x^2} \end{aligned}" />
               </div>
             )
          },
          {
             id: "prep-diff-2-ex5",
             question: <p>Differentiate <InlineMath math="\frac{3}{2\sqrt{x}}" /> with respect to <InlineMath math="x" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} y &= \frac{3}{2x^{\frac{1}{2}}} \\ &= \frac{3}{2}x^{-\frac{1}{2}} \\ \frac{dy}{dx} &= -\frac{1}{2} \cdot \frac{3}{2}x^{-\frac{3}{2}} \\ &= -\frac{3}{4}x^{-\frac{3}{2}} \\ &= -\frac{3}{4\sqrt{x^3}} \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "preparing-to-differentiate-3",
        title: "Preparing to Differentiate 3 – Indices and Fractions",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=432",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">If you have a fraction with a single term in the denominator, you should separate it into multiple fractions and simplify the indices before differentiating.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Split the fraction term by term:</strong> <InlineMath math="\frac{a+b}{c} = \frac{a}{c} + \frac{b}{c}" />. You can only do this when the <em>denominator</em> is a single term.</li>
              <li><strong>You cannot split the other way:</strong> <InlineMath math="\frac{1}{a+b}" /> is <em>not</em> <InlineMath math="\frac{1}{a} + \frac{1}{b}" />. A sum in the denominator cannot be separated.</li>
              <li><strong>Subtract the indices:</strong> <InlineMath math="\frac{x^3}{x} = x^2" />. Dividing by <InlineMath math="x" /> reduces the power by one; it does not divide the coefficient.</li>
              <li><strong>Simplify fully before differentiating:</strong> every term must be <InlineMath math="ax^n" /> first. Half-simplified terms lead to wrong powers.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "prep-diff-3-ex6",
             question: <p>A function <InlineMath math="f" /> is defined for <InlineMath math="x \in \mathbb{R}, x \neq 0" /> by <InlineMath math="f(x) = \frac{x}{5} + \frac{1}{x^2}" />. Find <InlineMath math="f'(x)" />.</p>,
             solution: (
                <div className="space-y-4">
                  <p>Prepare the terms:</p>
                  <BlockMath math="\begin{aligned} f(x) &= \frac{1}{5}x + x^{-2} \end{aligned}" />
                  <p>Differentiate:</p>
                  <BlockMath math="\begin{aligned} f'(x) &= \frac{1}{5} - 2x^{-3} \\ &= \frac{1}{5} - \frac{2}{x^3} \end{aligned}" />
                </div>
             )
          },
          {
             id: "prep-diff-3-ex7",
             question: <p>Differentiate <InlineMath math="\frac{x^4 - 3x^2}{5x}" /> with respect to <InlineMath math="x" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Split into separate fractions and prepare:</p>
                 <BlockMath math="\begin{aligned} f(x) &= \frac{x^4}{5x} - \frac{3x^2}{5x} \\ &= \frac{1}{5}x^3 - \frac{3}{5}x \end{aligned}" />
                 <p>Now differentiate:</p>
                 <BlockMath math="f'(x) = \frac{3}{5}x^2 - \frac{3}{5}" />
               </div>
             )
          },
          {
             id: "prep-diff-3-ex8",
             question: <p>Find the derivative of <InlineMath math="y = \sqrt{x}(x^2 + \sqrt[3]{x})" /> with respect to <InlineMath math="x" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Write as fractional indices, then expand the brackets:</p>
                 <BlockMath math="\begin{aligned} y &= x^{\frac{1}{2}} (x^2 + x^{\frac{1}{3}}) \\ y &= x^{\frac{1}{2}}x^2 + x^{\frac{1}{2}}x^{\frac{1}{3}} \\ y &= x^{\frac{5}{2}} + x^{\frac{5}{6}} \end{aligned}" />
                 <p className="text-sm text-slate-400">Remember to add powers when multiplying: <InlineMath math="\frac{1}{2} + 2 = \frac{5}{2}" /> and <InlineMath math="\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}" />.</p>
                 <p>Now differentiate:</p>
                 <BlockMath math="\begin{aligned} \frac{dy}{dx} &= \frac{5}{2}x^{\frac{3}{2}} + \frac{5}{6}x^{-\frac{1}{6}} \\ &= \frac{5}{2}\sqrt{x^3} + \frac{5}{6\sqrt[6]{x}} \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "differentiating-trig",
        title: "Differentiating sin x and cos x",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=1742",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">The derivatives of the core trigonometric functions are:</p>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 space-y-4">
              <BlockMath math="\text{If } f(x) = \sin x \text{ then } f'(x) = \cos x" />
              <BlockMath math="\text{If } f(x) = \cos x \text{ then } f'(x) = -\sin x" />
            </div>
            <p className="mt-4 text-sm text-slate-300">Wait, if the angle is in degrees, we must convert to radians to differentiate. Always assume <InlineMath math="x" /> is in radians for calculus.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The minus sign belongs to cosine:</strong> <InlineMath math="\sin x" /> differentiates to <InlineMath math="\cos x" />, but <InlineMath math="\cos x" /> differentiates to <InlineMath math="-\sin x" />. Losing that minus is the single most common error here.</li>
              <li><strong>These rules need radians:</strong> they are only valid when <InlineMath math="x" /> is in radians, so work in radians throughout a calculus question.</li>
              <li><strong>Keep coefficients:</strong> <InlineMath math="4\sin x" /> differentiates to <InlineMath math="4\cos x" /> — the multiplier stays.</li>
              <li><strong>Do not confuse with integration:</strong> the minus sign moves to the other function when integrating. Check which operation you are doing.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "diff-trig-ex1",
            question: <p>Differentiate <InlineMath math="y = 3\sin x" /> with respect to <InlineMath math="x" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\frac{dy}{dx} = 3\cos x" />
              </div>
            )
          },
          {
            id: "diff-trig-ex2",
            question: <p>A function <InlineMath math="f" /> is defined by <InlineMath math="f(x) = \sin x - 2\cos x" /> for <InlineMath math="x \in \mathbb{R}" />. Find <InlineMath math="f'(x)" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} f(x) &= \sin x - 2\cos x \\ f'(x) &= \cos x - 2(-\sin x) \\ &= \cos x + 2\sin x \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "rates-of-change",
        title: "Rates of Change",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=1906",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">The derivative of a function describes its <strong>rate of change</strong>. This can be evaluated for specific values by substituting these into the derivative.</p>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
              <h4 className="font-bold text-white text-xl mb-4">Displacement, Velocity & Acceleration</h4>
              <p className="mb-4">The velocity (<InlineMath math="v" />) of an object is defined as the rate of change of displacement (<InlineMath math="s" />) with respect to time (<InlineMath math="t" />)</p>
              <div className="flex justify-center mb-4">
                <BlockMath math="v(t) = s'(t)" />
              </div>
              <p className="mb-4 mt-4">The acceleration (<InlineMath math="a" />) of an object is defined as the rate of change of velocity (<InlineMath math="v" />) with respect to time (<InlineMath math="t" />)</p>
              <div className="flex justify-center">
                <BlockMath math="a(t) = v'(t)" />
              </div>
            </div>

            <p className="mb-6">As we already know, the gradient of a straight line is constant. We can determine the <strong>gradient</strong> of a curve, at a particular point, by differentiating i.e. finding the <strong>rate of change</strong>.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Differentiate with respect to the right variable:</strong> in a context question the letters change. If the formula is in terms of <InlineMath math="t" />, you want <InlineMath math="\frac{dV}{dt}" />, not <InlineMath math="\frac{dy}{dx}" />.</li>
                <li><strong>Rate of change means the derivative, evaluated:</strong> substitute the given value in. An unsubstituted derivative does not answer the question.</li>
                <li><strong>Substituting negative numbers:</strong> brackets are essential when substituting negative values into a formula. Write <InlineMath math="3(-2)^2" />, not <InlineMath math="3-2^2" />.</li>
                <li><strong>Say what it means:</strong> if the rate is negative, the quantity is <em>decreasing</em>. Context questions usually want that interpretation, with units.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "rate-change-ex1",
            question: <p>Given <InlineMath math="f(x) = 2x^5" /> for <InlineMath math="x \in \mathbb{R}" />, find the rate of change of <InlineMath math="f" /> when <InlineMath math="x = 3" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First find the derivative:</p>
                <BlockMath math="f'(x) = 10x^4" />
                <p>Then substitute <InlineMath math="x = 3" />:</p>
                <BlockMath math="f'(3) = 10(3)^4 = 10 \times 81 = 810" />
              </div>
            )
          },
          {
            id: "rate-change-ex2",
            question: <p>A ball thrown so that its displacement <InlineMath math="s" /> after <InlineMath math="t" /> seconds is given by <InlineMath math="s(t) = 12t - 5t^2" />. Find its velocity after 2 seconds.</p>,
            solution: (
              <div className="space-y-4">
                <p>Velocity is the derivative of displacement:</p>
                <BlockMath math="v(t) = s'(t) = 12 - 10t" />
                <p>Substitute <InlineMath math="t = 2" />:</p>
                <BlockMath math="v(2) = 12 - 10(2) = 12 - 20 = -8" />
                <p>Velocity is -8.</p>
              </div>
            )
          },
          {
            id: "rate-change-ex3",
            question: <p>Find the gradient of the curve with equation <InlineMath math="y = 3x^2" /> at the point <InlineMath math="(5, 2)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>To find the gradient, we need to find the rate of change (or derivative) and evaluate it at the x-coordinate of the point (which is <InlineMath math="x = 5" />).</p>
                <BlockMath math="\frac{dy}{dx} = 6x" />
                <p>When <InlineMath math="x = 5" />:</p>
                <BlockMath math="m = 6(5) = 30" />
              </div>
            )
          }
        ]
      },
      {
         id: "equations-of-tangents",
         title: "Equations of Tangents",
         videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=2229",
         theory: (
           <div className="space-y-8 text-lg">
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 max-w-sm mx-auto">
                <TangentDiagram />
             </div>
             <p className="mb-6">Once we have determined the gradient of a curve at a particular point (<InlineMath math="m = \frac{dy}{dx}" />), we can use this information directly with <InlineMath math="y - b = m(x - a)" /> to find the equation of the tangent line touching the curve at this point.</p>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>Negative indices:</strong> candidates who can otherwise do this question routinely lose marks by differentiating negative indices incorrectly. Check that step before going on.</li>
                 <li><strong>Gradient, then point:</strong> <InlineMath math="\frac{dy}{dx}" /> gives a <em>formula</em> for the gradient. You must substitute the <InlineMath math="x" />-coordinate into it to get the number. Using the derivative itself as <InlineMath math="m" /> is a guaranteed loss.</li>
                 <li><strong>Find the missing coordinate:</strong> if you are given only <InlineMath math="x" />, substitute into the <em>original</em> equation — not the derivative — to get <InlineMath math="y" />.</li>
                 <li><strong>Tangent vs normal:</strong> a tangent uses <InlineMath math="m" />; a normal uses <InlineMath math="-\frac{1}{m}" />. Read which one is asked for.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
             id: "eq-tangents-ex1",
             question: <p>Find the equation of the tangent to the curve with equation <InlineMath math="y = x^2 - 3" /> at the point (2, 1).</p>,
             solution: (
               <div className="space-y-4">
                  <p>Step 1: Find the gradient (<InlineMath math="\frac{dy}{dx}" />)</p>
                  <BlockMath math="\frac{dy}{dx} = 2x" />
                  <p>Step 2: Evaluate the gradient at <InlineMath math="x = 2" /></p>
                  <BlockMath math="m = 2(2) = 4" />
                  <p>Step 3: Find the equation of the straight line using <InlineMath math="m = 4" /> and point <InlineMath math="(a,b) = (2,1)" />:</p>
                  <BlockMath math="\begin{aligned} y - b &= m(x - a) \\ y - 1 &= 4(x - 2) \\ y - 1 &= 4x - 8 \\ y &= 4x - 7 \end{aligned}" />
               </div>
             )
           },
           {
             id: "eq-tangents-ex2",
             question: <p>A function <InlineMath math="f" /> is defined on a suitable domain by <InlineMath math="f(x) = x^3 - 2x" />. Find the equation of the tangent to the curve <InlineMath math="y = f(x)" /> when <InlineMath math="x = -2" />.</p>,
             solution: (
               <div className="space-y-4">
                  <p>Step 1: We need the full coordinate. Find <InlineMath math="y" /> when <InlineMath math="x = -2" />.</p>
                  <BlockMath math="\begin{aligned} y &= (-2)^3 - 2(-2) \\ &= -8 + 4 = -4 \end{aligned}" />
                  <p>Point is (-2, -4).</p>
                  <p>Step 2: Find gradient (<InlineMath math="f'(x)" />) at <InlineMath math="x = -2" />.</p>
                  <BlockMath math="\begin{aligned} f'(x) &= 3x^2 - 2 \\ m &= f'(-2) = 3(-2)^2 - 2 \\ &= 3(4) - 2 = 10 \end{aligned}" />
                  <p>Step 3: Equation using <InlineMath math="m = 10" /> and (-2, -4):</p>
                  <BlockMath math="\begin{aligned} y - (-4) &= 10(x - (-2)) \\ y + 4 &= 10(x + 2) \\ y + 4 &= 10x + 20 \\ y &= 10x + 16 \end{aligned}" />
               </div>
             )
           },
           {
             id: "eq-tangents-ex3",
             question: <p>Find the equation of the tangent to the curve with equation <InlineMath math="y = \sqrt[3]{x^2}" /> where <InlineMath math="x = -8" />.</p>,
             solution: (
               <div className="space-y-4">
                  <p>Step 1: Find the full coordinate. Find <InlineMath math="y" /> when <InlineMath math="x = -8" />.</p>
                  <BlockMath math="\begin{aligned} y &= (\sqrt[3]{x})^2 \\ &= (\sqrt[3]{-8})^2 \\ &= (-2)^2 = 4 \end{aligned}" />
                  <p>Point is (-8, 4).</p>
                  <p>Step 2: Find gradient (<InlineMath math="\frac{dy}{dx}" />) at <InlineMath math="x = -8" />.</p>
                  <BlockMath math="\begin{aligned} y &= x^{\frac{2}{3}} \\ \frac{dy}{dx} &= \frac{2}{3}x^{-\frac{1}{3}} \\ m &= \frac{2}{3\sqrt[3]{x}} \\ \dots \text{ when } x &= -8 \\ m &= \frac{2}{3(\sqrt[3]{-8})} \\ &= \frac{2}{3(-2)} \\ &= -\frac{2}{6} \\ m &= -\frac{1}{3} \end{aligned}" />
                  <p>Step 3: Equation using <InlineMath math="m = -\frac{1}{3}" /> and (-8, 4):</p>
                  <BlockMath math="\begin{aligned} y - 4 &= -\frac{1}{3}(x - (-8)) \\ y - 4 &= -\frac{1}{3}(x + 8) \\ 3(y - 4) &= -1(x + 8) \\ 3y - 12 &= -x - 8 \\ 3y + x - 4 &= 0 \end{aligned}" />
               </div>
             )
           }
         ]
      },
      {
         id: "increasing-decreasing-functions",
         title: "Increasing and Decreasing Curves",
         videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=2951",
         theory: (
           <div className="space-y-8 text-lg">
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
                <h4 className="font-bold text-white text-xl mb-4 text-emerald-400">Increasing Functions</h4>
                <div className="mb-4 bg-white/5 rounded-lg py-4">
                   <IncreasingFunctionGraph />
                </div>
                <p>If <InlineMath math="y" /> increases as <InlineMath math="x" /> increases, the curve is strictly increasing.</p>
                <p className="mt-2">Tangents slope upwards, so their gradients are positive: <InlineMath math="\frac{dy}{dx} > 0" />.</p>
             </div>
             
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
                <h4 className="font-bold text-white text-xl mb-4 text-rose-400">Decreasing Functions</h4>
                <div className="mb-4 bg-white/5 rounded-lg py-4">
                   <DecreasingFunctionGraph />
                </div>
                <p>If <InlineMath math="y" /> decreases as <InlineMath math="x" /> increases, the curve is strictly decreasing.</p>
                <p className="mt-2">Tangents slope downwards, so their gradients are negative: <InlineMath math="\frac{dy}{dx} < 0" />.</p>
             </div>
             
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8 overflow-hidden flex justify-center py-8">
               <IncDecCombinedGraph />
             </div>
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>Answer with an inequality, not a number:</strong> the question asks for the values of <InlineMath math="x" /> for which the function is increasing, so the answer is a range such as <InlineMath math="x \gt 2" />.</li>
               <li><strong>Justify with the sign of the derivative:</strong> state <InlineMath math="\frac{dy}{dx} \gt 0" /> for increasing and <InlineMath math="\frac{dy}{dx} \lt 0" /> for decreasing. An unsupported answer does not gain full marks.</li>
               <li><strong>"Show that it is always increasing" needs an argument:</strong> usually complete the square on the derivative to show it can never be negative. Testing a few values proves nothing.</li>
               <li><strong>Strict inequalities at stationary points:</strong> where <InlineMath math="\frac{dy}{dx} = 0" /> the function is neither increasing nor decreasing.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
             id: "inc-dec-ex1",
             question: <p>Show that the function <InlineMath math="f(x) = x^3 - 3x^2 + 3x - 10" /> is never decreasing.</p>,
             solution: (
               <div className="space-y-4">
                 <p>To show it is never decreasing, we must show <InlineMath math="f'(x) \geq 0" /> for all <InlineMath math="x" />.</p>
                 <BlockMath math="\begin{aligned} f'(x) &= 3x^2 - 6x + 3 \\ &= 3(x^2 - 2x + 1) \\ &= 3(x - 1)^2 \end{aligned}" />
                 <p>Since <InlineMath math="(x - 1)^2 \geq 0" /> for all real <InlineMath math="x" />, then <InlineMath math="3(x-1)^2 \geq 0" />.</p>
                 <p className="text-emerald-300">Therefore, <InlineMath math="f'(x) \geq 0" />, meaning the curve is never decreasing.</p>
               </div>
             )
           },
           {
             id: "inc-dec-ex2",
             question: <p>Show that the curve with equation <InlineMath math="y = 5 - 4x - x^3" /> is always decreasing.</p>,
             solution: (
               <div className="space-y-4">
                 <p>To show it is always decreasing, we must show <InlineMath math="\frac{dy}{dx} < 0" /> for all <InlineMath math="x" />.</p>
                 <BlockMath math="\begin{aligned} \frac{dy}{dx} &= -4 - 3x^2 \\ &= - (4 + 3x^2) \end{aligned}" />
                 <p>Since <InlineMath math="3x^2 \geq 0" /> for all real <InlineMath math="x" />, then <InlineMath math="4 + 3x^2 > 0" />.</p>
                 <p>So <InlineMath math="-(4 + 3x^2) < 0" />.</p>
                 <p className="text-rose-300">Therefore, <InlineMath math="\frac{dy}{dx} < 0" />, meaning the curve is always decreasing.</p>
               </div>
             )
           }
         ]
      },
      {
         id: "stationary-points",
         title: "Stationary Points & Curve Sketching",
         videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=3337",
         theory: (
           <div className="space-y-8 text-lg">
             <p className="mb-6">Points where the curve is neither increasing nor decreasing are called <strong>stationary points</strong>. At these points, the tangent is horizontal.</p>
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
               <p className="font-bold text-white mb-2">We can find stationary points by solving:</p>
               <BlockMath math="\frac{dy}{dx} = 0 \quad \text{or} \quad f'(x) = 0" />
             </div>
             
             <p className="mb-4">There are four possible types of stationary point:</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
                 <h5 className="font-bold text-white mb-4">Minimum Turning Point</h5>
                 <MinTurningPoint />
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
                 <h5 className="font-bold text-white mb-4">Maximum Turning Point</h5>
                 <MaxTurningPoint />
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
                 <h5 className="font-bold text-white mb-4">Rising Point of Inflection</h5>
                 <RisingInflection />
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
                 <h5 className="font-bold text-white mb-4">Falling Point of Inflection</h5>
                 <FallingInflection />
               </div>
             </div>
             
             <p>A stationary point's nature is determined by its behaviour to the left and right, using a <strong>nature table</strong>.</p>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>The nature table has minimum requirements:</strong> a table that does not meet them scores nothing. It must show the <InlineMath math="x" /> values either side of the stationary point, the sign of <InlineMath math="\frac{dy}{dx}" /> in each region, and the shape of the slope — not just an answer.</li>
                 <li><strong>Label it correctly:</strong> incorrect labelling within the table is a common and needless error. Say which <InlineMath math="x" /> values you are testing.</li>
                 <li><strong>Evaluate carefully either side:</strong> numerical errors when evaluating the derivative near the point are common. Choose easy test values, and keep clear of the neighbouring stationary point.</li>
                 <li><strong>Give the coordinates:</strong> solving <InlineMath math="\frac{dy}{dx}=0" /> gives only <InlineMath math="x" />. Substitute back into the original function for <InlineMath math="y" /> and state the point.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
             id: "stat-points-ex1",
             question: <p>Find the stationary points of <InlineMath math="y = 4x^3 - 2x^4" /> and determine their nature.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Step 1: Differentiate and set to 0 for stationary points.</p>
                 <BlockMath math="\begin{aligned} \frac{dy}{dx} &= 12x^2 - 8x^3 \\ 12x^2 - 8x^3 &= 0 \\ 4x^2(3 - 2x) &= 0 \end{aligned}" />
                 <p>So <InlineMath math="x = 0" /> or <InlineMath math="x = 1.5" />.</p>
                 
                 <p>Step 2: Find corresponding <InlineMath math="y" /> coordinates.</p>
                 <ul className="list-disc list-inside">
                    <li>At <InlineMath math="x = 0" />, <InlineMath math="y = 4(0)^3 - 2(0)^4 = 0" />. Point: (0, 0)</li>
                    <li>At <InlineMath math="x = 1.5" />, <InlineMath math="y = 4(1.5)^3 - 2(1.5)^4 = 13.5 - 10.125 = 3.375" />. Point: (1.5, 3.375)</li>
                 </ul>
                 
                 <p>Step 3: Nature table.</p>
                 <div className="bg-black/20 p-4 rounded-lg">
                    <table className="w-full text-center border-collapse text-sm">
                      <thead>
                        <tr>
                          <td className="border border-white/20 p-2"><InlineMath math="x" /></td>
                          <td className="border border-white/20 p-2"><InlineMath math="\to 0" /></td>
                          <td className="border border-white/20 p-2">0</td>
                          <td className="border border-white/20 p-2"><InlineMath math="0 \to 1.5" /></td>
                          <td className="border border-white/20 p-2">1.5</td>
                          <td className="border border-white/20 p-2"><InlineMath math="1.5 \to" /></td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-white/20 p-2"><InlineMath math="dy/dx" /></td>
                          <td className="border border-white/20 p-2 text-emerald-400">+</td>
                          <td className="border border-white/20 p-2">0</td>
                          <td className="border border-white/20 p-2 text-emerald-400">+</td>
                          <td className="border border-white/20 p-2">0</td>
                          <td className="border border-white/20 p-2 text-rose-400">-</td>
                        </tr>
                        <tr>
                          <td className="border border-white/20 p-2">Shape</td>
                          <td className="border border-white/20 p-2">/</td>
                          <td className="border border-white/20 p-2">—</td>
                          <td className="border border-white/20 p-2">/</td>
                          <td className="border border-white/20 p-2">—</td>
                          <td className="border border-white/20 p-2">\</td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
                 
                 <p className="mt-4"><strong className="text-white">(0,0) is a Rising Point of Inflection.</strong></p>
                 <p><strong className="text-white">(1.5, 3.375) is a Maximum Turning Point.</strong></p>
               </div>
             )
           },
           {
             id: "stat-points-ex2",
             question: <p>Find the stationary points of the curve with equation <InlineMath math="y = x^3 - 3x^2 - 9x + 5" /> and determine their nature.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Step 1: Differentiate and set to 0 to find stationary points.</p>
                 <BlockMath math="\begin{aligned} \frac{dy}{dx} &= 3x^2 - 6x - 9 \\ 3x^2 - 6x - 9 &= 0 \\ 3(x^2 - 2x - 3) &= 0 \\ 3(x - 3)(x + 1) &= 0 \end{aligned}" />
                 <p>So the stationary points occur at <InlineMath math="x = 3" /> and <InlineMath math="x = -1" />.</p>
                 
                 <p>Step 2: Find corresponding <InlineMath math="y" /> coordinates.</p>
                 <ul className="list-disc list-inside">
                    <li>At <InlineMath math="x = 3" />, <InlineMath math="y = (3)^3 - 3(3)^2 - 9(3) + 5 = 27 - 27 - 27 + 5 = -22" />. Point: (3, -22)</li>
                    <li>At <InlineMath math="x = -1" />, <InlineMath math="y = (-1)^3 - 3(-1)^2 - 9(-1) + 5 = -1 - 3 + 9 + 5 = 10" />. Point: (-1, 10)</li>
                 </ul>
                 
                 <p>Step 3: Nature table.</p>
                 <div className="bg-black/20 p-4 rounded-lg">
                    <table className="w-full text-center border-collapse text-sm">
                      <thead>
                        <tr>
                          <td className="border border-white/20 p-2"><InlineMath math="x" /></td>
                          <td className="border border-white/20 p-2"><InlineMath math="\to -1" /></td>
                          <td className="border border-white/20 p-2">-1</td>
                          <td className="border border-white/20 p-2"><InlineMath math="-1 \to 3" /></td>
                          <td className="border border-white/20 p-2">3</td>
                          <td className="border border-white/20 p-2"><InlineMath math="3 \to" /></td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-white/20 p-2"><InlineMath math="dy/dx" /></td>
                          <td className="border border-white/20 p-2 text-emerald-400">+</td>
                          <td className="border border-white/20 p-2">0</td>
                          <td className="border border-white/20 p-2 text-rose-400">-</td>
                          <td className="border border-white/20 p-2">0</td>
                          <td className="border border-white/20 p-2 text-emerald-400">+</td>
                        </tr>
                        <tr>
                          <td className="border border-white/20 p-2">Shape</td>
                          <td className="border border-white/20 p-2">/</td>
                          <td className="border border-white/20 p-2">—</td>
                          <td className="border border-white/20 p-2">\</td>
                          <td className="border border-white/20 p-2">—</td>
                          <td className="border border-white/20 p-2">/</td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
                 
                 <p className="mt-4"><strong className="text-white">(-1, 10) is a Maximum Turning Point.</strong></p>
                 <p><strong className="text-white">(3, -22) is a Minimum Turning Point.</strong></p>
               </div>
             )
           },
           {
             id: "stat-points-ex3",
             question: <p>Sketch the curve with equation <InlineMath math="y = x^3 - 3x^2" />. Show clearly the coordinates of the turning points and the points of intersection with the axes.</p>,
             solution: (
               <div className="space-y-4">
                 <p><strong>1. Intersections with axes:</strong></p>
                 <p>y-axis: Let <InlineMath math="x = 0" />.</p>
                 <BlockMath math="y = 0^3 - 3(0)^2 = 0" />
                 <p>So the point is (0, 0).</p>
                 
                 <p className="mt-4">x-axis: Let <InlineMath math="y = 0" />.</p>
                 <BlockMath math="\begin{aligned} x^3 - 3x^2 &= 0 \\ x^2(x - 3) &= 0 \end{aligned}" />
                 <p>So <InlineMath math="x = 0" /> or <InlineMath math="x = 3" />. Points are (0, 0) and (3, 0).</p>
                 
                 <p className="mt-4"><strong>2. Stationary points:</strong></p>
                 <BlockMath math="\frac{dy}{dx} = 3x^2 - 6x" />
                 <p>Set to 0 for stationary points:</p>
                 <BlockMath math="\begin{aligned} 3x^2 - 6x &= 0 \\ 3x(x - 2) &= 0 \end{aligned}" />
                 <p>So <InlineMath math="x = 0" /> or <InlineMath math="x = 2" />.</p>
                 
                 <p className="mt-4"><strong>3. Coordinates and nature:</strong></p>
                 <ul className="list-disc list-inside mb-4">
                   <li>At <InlineMath math="x = 0" />, <InlineMath math="y = 0^3 - 3(0)^2 = 0" />. Point: (0, 0).</li>
                   <li>At <InlineMath math="x = 2" />, <InlineMath math="y = 2^3 - 3(2)^2 = 8 - 12 = -4" />. Point: (2, -4).</li>
                 </ul>
                 
                 <div className="bg-black/20 p-4 rounded-lg my-4">
                   <table className="w-full text-center border-collapse text-sm">
                     <thead>
                       <tr>
                         <td className="border border-white/20 p-2"><InlineMath math="x" /></td>
                         <td className="border border-white/20 p-2"><InlineMath math="\to 0" /></td>
                         <td className="border border-white/20 p-2">0</td>
                         <td className="border border-white/20 p-2"><InlineMath math="0 \to 2" /></td>
                         <td className="border border-white/20 p-2">2</td>
                         <td className="border border-white/20 p-2"><InlineMath math="2 \to" /></td>
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <td className="border border-white/20 p-2"><InlineMath math="dy/dx" /></td>
                         <td className="border border-white/20 p-2 text-emerald-400">+</td>
                         <td className="border border-white/20 p-2">0</td>
                         <td className="border border-white/20 p-2 text-rose-400">-</td>
                         <td className="border border-white/20 p-2">0</td>
                         <td className="border border-white/20 p-2 text-emerald-400">+</td>
                       </tr>
                       <tr>
                         <td className="border border-white/20 p-2">Shape</td>
                         <td className="border border-white/20 p-2">/</td>
                         <td className="border border-white/20 p-2">—</td>
                         <td className="border border-white/20 p-2">\</td>
                         <td className="border border-white/20 p-2">—</td>
                         <td className="border border-white/20 p-2">/</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
                 
                 <p><strong className="text-white">(0, 0) is a Maximum Turning Point.</strong></p>
                 <p><strong className="text-white">(2, -4) is a Minimum Turning Point.</strong></p>
                 
                 <p className="mt-4"><strong>4. Completed Diagram:</strong></p>
                 <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6 flex justify-center py-8">
                   <CurveSketchExample />
                 </div>
               </div>
             )
           }
         ]
      },
      {
         id: "max-min-values",
         title: "Maximum and Minimum Values",
         videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=4964",
         theory: (
           <div className="space-y-8 text-lg">
             <p className="mb-6">In a closed interval, the maximum and minimum values of a function are either at a <strong>stationary point</strong> or at an <strong>end point</strong> of the interval.</p>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>Check both ends:</strong> this is the classic way to lose marks here — <em>most</em> candidates who drop marks never consider both ends of the closed interval. You must evaluate the function at <strong>both</strong> endpoints as well as at every stationary point inside the interval.</li>
                 <li><strong>Compare values, not natures:</strong> the greatest value is simply the largest of the numbers you have worked out. A maximum turning point inside the interval is not automatically the greatest value — an endpoint can beat it.</li>
                 <li><strong>Discard stationary points outside the interval:</strong> if solving <InlineMath math="\frac{dy}{dx}=0" /> gives an <InlineMath math="x" /> outside the stated range, it plays no part.</li>
                 <li><strong>Answer with the value:</strong> the question asks for the greatest and least <em>values</em> of the function, so give the <InlineMath math="y" /> values.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
             id: "max-min-ex1",
             question: <p>Find the maximum and minimum values of <InlineMath math="y = 4x^3 - x^2 - 4x + 1" /> in the closed interval <InlineMath math="-2 \leq x \leq 2" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Step 1: Check stationary points.</p>
                 <BlockMath math="\begin{aligned} \frac{dy}{dx} &= 12x^2 - 2x - 4 \\ 12x^2 - 2x - 4 &= 0 \\ 6x^2 - x - 2 &= 0 \\ (3x - 2)(2x + 1) &= 0 \end{aligned}" />
                 <p>Roots: <InlineMath math="x = \frac{2}{3}" /> and <InlineMath math="x = -\frac{1}{2}" />.</p>
                 <p>Check their <InlineMath math="y" />-values:</p>
                 <ul className="list-disc list-inside text-sm">
                   <li><InlineMath math="y\left(\frac{2}{3}\right) = 4\left(\frac{8}{27}\right) - \frac{4}{9} - 4\left(\frac{2}{3}\right) + 1 = -\frac{23}{27}" /></li>
                   <li><InlineMath math="y\left(-\frac{1}{2}\right) = 4\left(-\frac{1}{8}\right) - \frac{1}{4} - 4\left(-\frac{1}{2}\right) + 1 = \frac{9}{4}" /></li>
                 </ul>
                 
                 <p className="mt-4">Step 2: Check end points (<InlineMath math="-2" /> and <InlineMath math="2" />).</p>
                 <ul className="list-disc list-inside text-sm">
                   <li><InlineMath math="y(-2) = 4(-8) - 4 - 4(-2) + 1 = -32 - 4 + 8 + 1 = -27" /></li>
                   <li><InlineMath math="y(2) = 4(8) - 4 - 4(2) + 1 = 32 - 4 - 8 + 1 = 21" /></li>
                 </ul>
                 
                 <p className="mt-4 text-emerald-300">Compare all values: <InlineMath math="-\frac{23}{27}" />, <InlineMath math="2.25" />, <InlineMath math="-27" />, <InlineMath math="21" />.</p>
                 <p><strong className="text-white">Maximum value is 21</strong> (at <InlineMath math="x=2" />).</p>
                 <p><strong className="text-white">Minimum value is -27</strong> (at <InlineMath math="x=-2" />).</p>
               </div>
             )
           }
         ]
      },
      {
         id: "optimisation",
         title: "Optimisation",
         videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=5400",
         theory: (
           <div className="space-y-8 text-lg">
             <p className="mb-4"><strong>Optimisation</strong> involves finding the greatest (maximum) or least (minimum) value of a quantity under certain constraints, such as finding the maximum volume of a box or the minimum material needed to make a can.</p>
             
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6 text-base">
               <h4 className="font-bold text-white text-xl mb-4">Steps for Optimisation Problems</h4>
               <ul className="list-decimal list-inside space-y-3 mt-4 text-slate-300">
                 <li>Identify the quantity to be maximised or minimised.</li>
                 <li>Form an equation for this quantity in terms of two variables (e.g. area <InlineMath math="A" /> in terms of <InlineMath math="x" /> and <InlineMath math="y" />).</li>
                 <li>Use the given constraint (e.g. total perimeter) to write one variable in terms of the other.</li>
                 <li>Substitute this into the main equation to get a function of one variable only (e.g. <InlineMath math="A(x)" />).</li>
                 <li>Differentiate the function and set the derivative to zero (<InlineMath math="A'(x) = 0" />) to find stationary points.</li>
                 <li>Use a nature table (or the second derivative) to confirm whether the point is a maximum or a minimum.</li>
                 <li>Calculate the maximum/minimum value of the quantity required.</li>
               </ul>
             </div>
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>Get to one variable first:</strong> use the constraint given in the question to eliminate a variable before differentiating. You cannot differentiate a formula in two unknowns.</li>
               <li><strong>Justify the nature:</strong> finding the stationary point is not enough — a nature table is needed to show it really is the maximum or minimum.</li>
               <li><strong>Check the endpoints too:</strong> in a context with a restricted range, the optimum can sit at an end of the interval rather than at a stationary point.</li>
               <li><strong>Answer in context, with units:</strong> if the question asks for the minimum cost, give the cost, not the value of <InlineMath math="x" /> that produces it. Read which one is wanted.</li>
               <li><strong>Reject impossible solutions:</strong> negative lengths, times or prices are not valid answers — say why you are discarding them.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
             id: "opt-ex1",
             question: (
               <div className="space-y-4">
                 <p className="font-bold border-b border-white/20 pb-2 mb-4">Example 1</p>
                 <p>A square piece of card of length 30cm has a square of side <InlineMath math="x\text{ cm}" /> cut from each corner. An open box is formed by turning up the sides.</p>
                 <p className="pl-4">a) Show that the volume, <InlineMath math="V" />, of the box can be expressed by <InlineMath math="900x - 120x^2 + 4x^3" />.</p>
                 <p className="pl-4">b) Find the maximum volume of the box.</p>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-center py-6 mt-4">
                   <Example1Diagram />
                 </div>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>Part a) Forming the expression</strong></p>
                 <p>The base of the box is a square with side length <InlineMath math="(30 - 2x)" />.</p>
                 <p>The height of the box is <InlineMath math="x" />.</p>
                 <BlockMath math="\begin{aligned} V &= \text{Area of base} \times \text{height} \\ V &= (30 - 2x)^2 \times x \\ V &= (900 - 120x + 4x^2)x \\ V &= 900x - 120x^2 + 4x^3 \end{aligned}" />

                 <p className="mt-6 border-t border-white/20 pt-4"><strong>Part b) Maximising Volume</strong></p>
                 <p>Differentiate and set to 0 for a maximum:</p>
                 <BlockMath math="\begin{aligned} V'(x) &= 900 - 240x + 12x^2 \\ 12x^2 - 240x + 900 &= 0 \end{aligned}" />
                 <p>Divide by 12:</p>
                 <BlockMath math="\begin{aligned} x^2 - 20x + 75 &= 0 \\ (x - 5)(x - 15) &= 0 \end{aligned}" />
                 <p>So <InlineMath math="x = 5" /> or <InlineMath math="x = 15" />.</p>
                 
                 <p className="mt-4 text-emerald-300">If <InlineMath math="x = 15" />, the length of the base would be <InlineMath math="30 - 2(15) = 0" />, which is impossible. So <strong className="text-white">x = 5</strong>.</p>
                 
                 <p className="mt-4">Verify it's a maximum using the second derivative factor:</p>
                 <BlockMath math="V''(x) = -240 + 24x" />
                 <p>At <InlineMath math="x = 5" />, <InlineMath math="V''(5) = -240 + 24(5) = -120" />. Since <InlineMath math="V'' < 0" />, this is a maximum.</p>
                 
                 <p className="mt-4">Calculate the maximum volume:</p>
                 <BlockMath math="\begin{aligned} V(5) &= 900(5) - 120(5)^2 + 4(5)^3 \\ &= 4500 - 120(25) + 4(125) \\ &= 4500 - 3000 + 500 \\ &= 2000 \end{aligned}" />
                 
                 <p>The maximum volume of the box is <strong className="text-white">2000 cm³</strong>.</p>
               </div>
             )
           },
           {
             id: "opt-ex2",
             question: (
               <div className="space-y-4">
                 <p className="font-bold border-b border-white/20 pb-2 mb-4">Example 2</p>
                 <p>An open box with a square base has volume <InlineMath math="256\text{ cm}^3" />.</p>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-center py-6 mt-4">
                   <Example2Diagram />
                 </div>
                 <p className="pl-4">a) Taking <InlineMath math="x" /> as the length of the base, show that the surface area of the inside of the box can be expressed as <InlineMath math="x^2 + \frac{1024}{x}" />.</p>
                 <p className="pl-4">b) Find the dimensions of the box which will minimize the surface area and calculate its area.</p>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>Part a) Forming the expression</strong></p>
                 <p>Let the dimensions of the base be <InlineMath math="x" /> by <InlineMath math="x" /> and the height be <InlineMath math="h" />.</p>
                 <p>The volume is <InlineMath math="V = x^2 h = 256" />.</p>
                 <p>Therefore, <InlineMath math="h = \frac{256}{x^2}" />.</p>
                 
                 <p className="mt-4">The surface area (open box, no top) is:</p>
                 <BlockMath math="\begin{aligned} A &= \text{Area of base} + 4 \times \text{Area of sides} \\ A &= x^2 + 4xh \end{aligned}" />
                 
                 <p>Substitute <InlineMath math="h" />:</p>
                 <BlockMath math="\begin{aligned} A &= x^2 + 4x\left(\frac{256}{x^2}\right) \\ &= x^2 + \frac{1024}{x} \end{aligned}" />
                 
                 <p className="mt-6 border-t border-white/20 pt-4"><strong>Part b) Minimising Surface Area</strong></p>
                 <BlockMath math="A(x) = x^2 + 1024x^{-1}" />
                 
                 <p>Differentiate and set to 0 for a minimum:</p>
                 <BlockMath math="A'(x) = 2x - 1024x^{-2} = 2x - \frac{1024}{x^2}" />
                 <BlockMath math="\begin{aligned} 2x - \frac{1024}{x^2} &= 0 \\ 2x &= \frac{1024}{x^2} \\ 2x^3 &= 1024 \\ x^3 &= 512 \\ x &= \sqrt[3]{512} = 8 \end{aligned}" />
                 
                 <p className="mt-4">Verify it's a minimum using the second derivative:</p>
                 <BlockMath math="A''(x) = 2 + 2048x^{-3}" />
                 <p>At <InlineMath math="x = 8" />, <InlineMath math="A''(8) = 2 + \frac{2048}{512} = 2 + 4 = 6" />. Since <InlineMath math="A'' > 0" />, this is a minimum.</p>
                 
                 <p className="mt-4"><strong>Dimensions and Minimum Area:</strong></p>
                 <p>Length and width are <InlineMath math="x = 8\text{ cm}" />.</p>
                 <p>Height <InlineMath math="h = \frac{256}{8^2} = \frac{256}{64} = 4\text{ cm}" />.</p>
                 <p>Dimensions are <strong className="text-white">8 cm × 8 cm × 4 cm</strong>.</p>
                 
                 <p className="mt-2">Minimum surface area:</p>
                 <BlockMath math="\begin{aligned} A(8) &= 8^2 + \frac{1024}{8} \\ &= 64 + 128 \\ &= 192 \end{aligned}" />
                 <p>The minimum surface area is <strong className="text-white">192 cm²</strong>.</p>
               </div>
             )
           }
         ]
      },
      {
         id: "graphs-of-derived",
         title: "Graphs of Derived Functions",
         videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=6238",
         theory: (
           <div className="space-y-8 text-lg">
             <p className="mb-6">We can sketch <InlineMath math="f'(x)" /> by examining the features of <InlineMath math="f(x)" /> and its gradients.</p>
             <div className="mb-6">
                <table className="w-full text-center border-collapse">
                  <thead>
                     <tr>
                        <th className="border-b border-white/20 pb-2 text-rose-300">Original Graph: <InlineMath math="f(x)" /></th>
                        <th className="border-b border-white/20 pb-2 text-emerald-300">Derived Graph: <InlineMath math="f'(x)" /></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td className="py-3 border-b border-white/10">Increasing</td>
                        <td className="py-3 border-b border-white/10">Positive (above x-axis)</td>
                     </tr>
                     <tr>
                        <td className="py-3 border-b border-white/10">Decreasing</td>
                        <td className="py-3 border-b border-white/10">Negative (below x-axis)</td>
                     </tr>
                     <tr>
                        <td className="py-3 border-b border-white/10 text-white font-bold">Turning Point</td>
                        <td className="py-3 border-b border-white/10 text-white font-bold">Root (cuts x-axis)</td>
                     </tr>
                     <tr>
                        <td className="py-3 border-b border-white/10 text-white font-bold">Point of Inflection</td>
                        <td className="py-3 border-b border-white/10 text-white font-bold">Root and Turning Point (touches x-axis)</td>
                     </tr>
                  </tbody>
                </table>
             </div>
             <p className="text-slate-300 text-sm italic">For example, if <InlineMath math="f(x)" /> is a cubic with two turning points, <InlineMath math="f'(x)" /> will be a parabola with two roots.</p>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>This is one of the worst-answered questions in the course.</strong> Most candidates gain no marks on it at all. It is very winnable if you follow the rules below.</li>
                 <li><strong>Get the degree right:</strong> many candidates draw a curve of the wrong type — a quartic differentiates to a cubic, a cubic to a parabola. Decide the shape before you draw anything.</li>
                 <li><strong>Turning points become roots:</strong> every stationary point of <InlineMath math="f(x)" /> is a point where <InlineMath math="f'(x)" /> <em>crosses the x-axis</em>. Mark those first — they fix the sketch.</li>
                 <li><strong>Read the sign of the slope:</strong> where <InlineMath math="f(x)" /> rises, <InlineMath math="f'(x)" /> is above the axis; where it falls, below. Check each region.</li>
                 <li><strong>Use the conditions given:</strong> the stated conditions are often ignored, and some candidates mistakenly treat the question as a differential equation. Read what you are told about the original graph.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
             id: "derived-ex1",
             question: <p>Shown is the graph of <InlineMath math="f(x)" />. Sketch <InlineMath math="f'(x)" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>The original graph is a parabola with a minimum turning point at <InlineMath math="(-1, -11)" />.</p>
                 <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                   <li>When <InlineMath math="x < -1" />, the function is decreasing, so the gradient is negative (<InlineMath math="f'(x) < 0" />).</li>
                   <li>At <InlineMath math="x = -1" />, there is a turning point, so the gradient is zero (<InlineMath math="f'(-1) = 0" />).</li>
                   <li>When <InlineMath math="x > -1" />, the function is increasing, so the gradient is positive (<InlineMath math="f'(x) > 0" />).</li>
                 </ul>
                 <p>The derivative of a quadratic is a linear function (straight line), crossing the x-axis at <InlineMath math="-1" />.</p>
                 <div className="my-6 p-4 bg-black/20 rounded-xl border border-white/10">
                   <DerivedEx1 />
                 </div>
               </div>
             )
           },
           {
             id: "derived-ex2",
             question: <p>Shown is the graph of <InlineMath math="f(x)" />. Sketch <InlineMath math="f'(x)" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>The original graph is a cubic with a maximum turning point at <InlineMath math="(0, -6)" /> and a minimum turning point at <InlineMath math="(3, -18)" />.</p>
                 <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                   <li>At <InlineMath math="x = 0" /> and <InlineMath math="x = 3" />, there are turning points, so <InlineMath math="f'(0) = 0" /> and <InlineMath math="f'(3) = 0" /> (roots of the derived graph).</li>
                   <li>Between <InlineMath math="0" /> and <InlineMath math="3" />, the function is decreasing, so <InlineMath math="f'(x)" /> is negative (below the x-axis).</li>
                   <li>Outside of this interval (<InlineMath math="x < 0" /> and <InlineMath math="x > 3" />), the function is increasing, so <InlineMath math="f'(x)" /> is positive (above the x-axis).</li>
                 </ul>
                 <p>The derivative of a cubic is an upward-opening parabola crossing at <InlineMath math="0" /> and <InlineMath math="3" />.</p>
                 <div className="my-6 p-4 bg-black/20 rounded-xl border border-white/10">
                   <DerivedEx2 />
                 </div>
               </div>
             )
           },
           {
             id: "derived-ex3",
             question: <p>Shown is the graph of <InlineMath math="f(x)" />. Sketch <InlineMath math="f'(x)" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>The original graph has a rising point of inflection at <InlineMath math="(0, 5)" /> and a maximum turning point at <InlineMath math="(1.5, 8.375)" />.</p>
                 <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                   <li>At <InlineMath math="x = 0" /> and <InlineMath math="x = 1.5" />, the gradient is zero, so <InlineMath math="f'(0) = 0" /> and <InlineMath math="f'(1.5) = 0" />.</li>
                   <li>Since <InlineMath math="(0, 5)" /> is a rising point of inflection, the graph is increasing both before and immediately after <InlineMath math="x = 0" />. So <InlineMath math="f'(x)" /> is positive, touches <InlineMath math="0" />, and stays positive.</li>
                   <li>After the maximum at <InlineMath math="x = 1.5" />, the graph decreases, so the gradient becomes negative.</li>
                 </ul>
                 <p>The derived graph touches the x-axis at <InlineMath math="0" /> and crosses it at <InlineMath math="1.5" />.</p>
                 <div className="my-6 p-4 bg-black/20 rounded-xl border border-white/10">
                   <DerivedEx3 />
                 </div>
               </div>
             )
           }
         ]
      }
    , {
        id: "further-differentiation-brackets",
        title: "Further Differentiation of Brackets",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=6707",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>When differentiating composite functions involving linear expressions raised to a power, we can use the chain rule.</p>
            <p>If the functions <InlineMath math="f" /> and <InlineMath math="g" /> are defined on suitable domains, then:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)" />
            </div>
            <p>For brackets raised to a power:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col space-y-4">
              <BlockMath math="\frac{d}{dx}[(ax+b)^n] = n(ax+b)^{n-1} \times a = an(ax+b)^{n-1}" />
            </div>
            <p>Alternatively, using Leibniz notation, if <InlineMath math="y = f(u)" /> and <InlineMath math="u = g(x)" />:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Multiply by the derivative of the inside:</strong> the chain rule is easy to state and easy to forget. <InlineMath math="(3x+1)^5" /> differentiates to <InlineMath math="5(3x+1)^4 \times 3" />, and that <InlineMath math="\times 3" /> is where the marks go.</li>
              <li><strong>Do not expand the bracket:</strong> for a high power the chain rule is the only realistic route.</li>
              <li><strong>Keep the inside unchanged:</strong> only the power drops. The contents of the bracket stay exactly as they were.</li>
              <li><strong>Negative and fractional powers still follow the rule:</strong> <InlineMath math="\frac{1}{(2x-5)^3}" /> should be written <InlineMath math="(2x-5)^{-3}" /> before differentiating.</li>
              <li><strong>Simplify at the end:</strong> collect the constants into a single coefficient.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "chain-rule-ex1",
            question: <p>Differentiate <InlineMath math="y = (5x + 2)^4" /> with respect to <InlineMath math="x" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Using the chain rule:</p>
                <p>Let <InlineMath math="u = 5x + 2" />, then <InlineMath math="\frac{du}{dx} = 5" />.</p>
                <p>And <InlineMath math="y = u^4" />, then <InlineMath math="\frac{dy}{du} = 4u^3" />.</p>
                <BlockMath math="\begin{aligned} \frac{dy}{dx} &= \frac{dy}{du} \times \frac{du}{dx} \\ &= 4u^3 \times 5 \\ &= 20(5x + 2)^3 \end{aligned}" />
              </div>
            )
          },
          {
            id: "chain-rule-ex2",
            question: <p>Differentiate <InlineMath math="y = \frac{1}{(5x + 2)^3}" /> with respect to <InlineMath math="x" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, rewrite the expression with a negative exponent:</p>
                <BlockMath math="y = (5x + 2)^{-3}" />
                <p>Now apply the chain rule:</p>
                <p>Let <InlineMath math="u = 5x + 2" />, so <InlineMath math="\frac{du}{dx} = 5" />.</p>
                <BlockMath math="\begin{aligned} \frac{dy}{dx} &= -3(5x + 2)^{-4} \times 5 \\ &= -15(5x + 2)^{-4} \\ &= -\frac{15}{(5x + 2)^4} \end{aligned}" />
              </div>
            )
          },
          {
            id: "chain-rule-ex3",
            question: <p>A function <InlineMath math="f" /> is defined by <InlineMath math="f(x) = \frac{5}{(5x + 2)^6}" /> for <InlineMath math="x \in \mathbb{R}" />. Find <InlineMath math="f'(x)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Rewrite to prepare for differentiation:</p>
                <BlockMath math="f(x) = 5(5x + 2)^{-6}" />
                <BlockMath math="\begin{aligned} f'(x) &= 5 \times -6(5x + 2)^{-7} \times 5 \\ &= -150(5x + 2)^{-7} \\ &= -\frac{150}{(5x + 2)^7} \end{aligned}" />
              </div>
            )
          },
          {
            id: "chain-rule-ex4",
            question: <p>A function <InlineMath math="f" /> is defined on a suitable domain by <InlineMath math="f(x) = \sqrt{5x^2 + 2x}" />. Find <InlineMath math="f'(x)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, rewrite as a fractional exponent:</p>
                <BlockMath math="f(x) = (5x^2 + 2x)^{1/2}" />
                <p>Now apply the chain rule:</p>
                <BlockMath math="\begin{aligned} f'(x) &= \frac{1}{2}(5x^2 + 2x)^{-1/2} \times (10x + 2) \\ &= \frac{10x + 2}{2\sqrt{5x^2 + 2x}} \\ &= \frac{5x + 1}{\sqrt{5x^2 + 2x}} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "further-differentiation-trig",
        title: "Further Differentiation of Trigonometric Functions",
        videoUrl: "https://www.youtube.com/embed/kjRzrHzwU0s?start=6707",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The chain rule is also required when differentiating composite trigonometric functions.</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col space-y-4">
              <BlockMath math="\frac{d}{dx}[\sin(f(x))] = \cos(f(x)) \times f'(x)" />
              <BlockMath math="\frac{d}{dx}[\cos(f(x))] = -\sin(f(x)) \times f'(x)" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Two things must happen:</strong> differentiate the trig function <em>and</em> multiply by the derivative of the angle. <InlineMath math="\sin(4x)" /> differentiates to <InlineMath math="4\cos(4x)" />.</li>
              <li><strong>The minus still belongs to cosine:</strong> <InlineMath math="\cos(3x)" /> differentiates to <InlineMath math="-3\sin(3x)" /> — both the chain factor and the minus sign are needed.</li>
              <li><strong>Powers of trig functions are chains too:</strong> <InlineMath math="\sin^3 x" /> means <InlineMath math="(\sin x)^3" />, so it differentiates to <InlineMath math="3\sin^2 x \cos x" />.</li>
              <li><strong>Work in radians:</strong> the derivatives of <InlineMath math="\sin" /> and <InlineMath math="\cos" /> are only valid in radians.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "chain-rule-ex5",
            question: <p>If <InlineMath math="y = \sin 4x" />, find <InlineMath math="\frac{dy}{dx}" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Apply the chain rule. The derivative of <InlineMath math="\sin u" /> is <InlineMath math="\cos u" />.</p>
                <BlockMath math="\begin{aligned} \frac{dy}{dx} &= \cos 4x \times \frac{d}{dx}(4x) \\ &= \cos 4x \times 4 \\ &= 4\cos 4x \end{aligned}" />
              </div>
            )
          },
          {
            id: "chain-rule-ex6",
            question: <p>If <InlineMath math="y = \sin(4x + 3)" />, find <InlineMath math="\frac{dy}{dx}" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \frac{dy}{dx} &= \cos(4x + 3) \times \frac{d}{dx}(4x + 3) \\ &= \cos(4x + 3) \times 4 \\ &= 4\cos(4x + 3) \end{aligned}" />
              </div>
            )
          },
          {
            id: "chain-rule-ex7",
            question: <p>If <InlineMath math="y = \cos(x^2)" />, find <InlineMath math="\frac{dy}{dx}" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \frac{dy}{dx} &= -\sin(x^2) \times \frac{d}{dx}(x^2) \\ &= -\sin(x^2) \times 2x \\ &= -2x\sin(x^2) \end{aligned}" />
              </div>
            )
          },
          {
            id: "chain-rule-ex8",
            question: <p>If <InlineMath math="y = \sin^3 x" />, find <InlineMath math="\frac{dy}{dx}" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, rewrite the function to clearly see the composite structure:</p>
                <BlockMath math="y = (\sin x)^3" />
                <p>Apply the chain rule, treating <InlineMath math="\sin x" /> as the inner bracket:</p>
                <BlockMath math="\begin{aligned} \frac{dy}{dx} &= 3(\sin x)^2 \times \frac{d}{dx}(\sin x) \\ &= 3(\sin x)^2 \times \cos x \\ &= 3\sin^2 x \cos x \end{aligned}" />
              </div>
            )
          }
        ]
      },
      ]
  },
  {
    id: "integration",
    title: "Integration",
    topics: [
      {
        id: "integration-intro",
        title: "Introduction",
        videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=0",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We have previously learned how to differentiate terms.</p>
            <p>If <InlineMath math="f(x)=x^n" /> then <InlineMath math="f'(x)=nx^{n-1}" /> (<InlineMath math="n \in \mathbb{R}" />).</p>
            <p>Say we are given the derivatives of some functions. Can we find the original functions?</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li><InlineMath math="f'(x)=9x^2 \implies f(x) = 3x^3" /></li>
              <li><InlineMath math="f'(x)=-8x^{-3} \implies f(x) = 4x^{-2}" /></li>
              <li><InlineMath math="f'(x)=5 \implies f(x) = 5x" /></li>
              <li><InlineMath math="f'(x)=0 \implies f(x) = c" /> (where <InlineMath math="c" /> is a constant)</li>
            </ul>
            <p>Integration is a branch of calculus. It is the inverse of differentiation.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Integration undoes differentiation:</strong> every check you make should be "does differentiating my answer give me back the original?" It catches most errors in seconds.</li>
              <li><strong>The constant is part of the answer:</strong> an indefinite integral without <InlineMath math="+\,C" /> is incomplete, and the working that follows it can be treated as invalid.</li>
              <li><strong>Notation is assessed:</strong> write the integral sign and the <InlineMath math="dx" /> together. An integral with no <InlineMath math="dx" /> is not a complete statement.</li>
              <li><strong>Rewrite before integrating:</strong> as with differentiation, every term needs to be in the form <InlineMath math="ax^n" /> first.</li>
            </ul>
          </div>
          </div>
        ),
        examples: []
      },
      {
        id: "indefinite-integrals",
        title: "Indefinite Integrals",
        videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=17",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>When integrating a term of the form <InlineMath math="ax^n" />, we increase the power by 1 and divide by the new power:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\int ax^n \,dx = \frac{ax^{n+1}}{n+1} + C \quad (n \neq -1)" />
            </div>
            <p>Where <InlineMath math="C" /> is the constant of integration.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The <InlineMath math="+\,C" /> is not optional:</strong> omitting the constant of integration <em>invalidates the working that follows</em> — it costs more than one mark because everything after it is wrong too.</li>
                <li><strong>Write <InlineMath math="dx" />:</strong> integral notation must be accurate. An integral sign with no <InlineMath math="dx" /> is incomplete.</li>
                <li><strong>Deal with the coefficient:</strong> the coefficient of <InlineMath math="x" /> is easily mishandled. Integrating <InlineMath math="(ax+b)^n" /> needs the extra <InlineMath math="\frac{1}{a}" />.</li>
                <li><strong>Rewrite first:</strong> roots and fractions must be written as indices before you can integrate. You cannot integrate a product or quotient term by term as it stands.</li>
                <li><strong>Never integrate <InlineMath math="x^{-1}" /> with the power rule:</strong> the rule fails when <InlineMath math="n = -1" /> because it would divide by zero.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "indefinites-ex1",
            question: <p>Find <InlineMath math="\int x^2 \,dx" /></p>,
            solution: <BlockMath math="\int x^2 \,dx = \frac{x^3}{3} + C" />
          },
          {
            id: "indefinites-ex2",
            question: <p>Find <InlineMath math="\int x^{-3} \,dx" /></p>,
            solution: <BlockMath math="\int x^{-3} \,dx = \frac{x^{-2}}{-2} + C = -\frac{1}{2x^2} + C" />
          },
          {
            id: "indefinites-ex3",
            question: <p>Find <InlineMath math="\int x^{5/4} \,dx" /></p>,
            solution: <BlockMath math="\int x^{5/4} \,dx = \frac{x^{9/4}}{9/4} + C = \frac{4}{9}x^{9/4} + C" />
          },
          {
            id: "indefinites-ex4",
            question: <p>Find <InlineMath math="\int \frac{dr}{r^4}" /></p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\int r^{-4} \,dr = \frac{r^{-3}}{-3} + C = -\frac{1}{3r^3} + C" />
              </div>
            )
          },
          {
            id: "indefinites-ex5",
            question: <p>Find <InlineMath math="\int \sqrt[4]{x^5} \,dx" /></p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\int x^{5/4} \,dx = \frac{x^{9/4}}{9/4} + C = \frac{4}{9}x^{9/4} + C" />
              </div>
            )
          },
          {
            id: "indefinites-ex7",
            question: <p>Find <InlineMath math="\int 4x^{-3/2} \,dx" /></p>,
            solution: <BlockMath math="\int 4x^{-3/2} \,dx = \frac{4x^{-1/2}}{-1/2} + C = -8x^{-1/2} + C = -\frac{8}{\sqrt{x}} + C" />
          },
          {
            id: "indefinites-ex9",
            question: <p>Find <InlineMath math="\int (4x^{-5/8} + 3x + 7) \,dx" /></p>,
            solution: <BlockMath math="\frac{4x^{3/8}}{3/8} + \frac{3x^2}{2} + 7x + C = \frac{32}{3}x^{3/8} + \frac{3x^2}{2} + 7x + C" />
          },
          {
             id: "indefinites-ex10",
             question: <p>Find <InlineMath math="\int t(t+3) \,dt" /></p>,
             solution: (
               <div className="space-y-4">
                 <p>First expand the brackets:</p>
                 <BlockMath math="\int (t^2 + 3t) \,dt = \frac{t^3}{3} + \frac{3t^2}{2} + C" />
               </div>
             )
          },
          {
             id: "indefinites-ex11",
             question: <p>Find <InlineMath math="\int \frac{4m^2 - m + 7}{\sqrt{m}} \,dm" /></p>,
             solution: (
               <div className="space-y-4">
                 <p>Split into separate fractions and simplify powers:</p>
                 <BlockMath math="\int \left( 4m^{3/2} - m^{1/2} + 7m^{-1/2} \right) \,dm" />
                 <BlockMath math="= \frac{4m^{5/2}}{5/2} - \frac{m^{3/2}}{3/2} + \frac{7m^{1/2}}{1/2} + C" />
                 <BlockMath math="= \frac{8}{5}m^{5/2} - \frac{2}{3}m^{3/2} + 14m^{1/2} + C" />
               </div>
             )
          }
        ]
      },
      {
        id: "differential-equations",
        title: "Differential Equations",
        videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=916",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>As previously stated, integration is the reverse of differentiation.</p>
            <p>As a result, if we integrate the derivative of a function then we obtain the original function:</p>
            <BlockMath math="\int \frac{dy}{dx} \,dx = y" />
            <BlockMath math="\int f'(x) \,dx = f(x)" />
            <p>The above obtains a general solution for the original function.</p>
            <p>However, if we have additional information about the function, we can find the value of the constant of integration (<InlineMath math="C" />) to obtain a particular solution.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>You cannot skip the constant here:</strong> the whole point is to find it. Integrate, write <InlineMath math="+\,C" />, then use the given condition to pin it down.</li>
              <li><strong>Substitute the condition immediately:</strong> put the given point into your integrated expression before doing anything else, and solve for <InlineMath math="C" />.</li>
              <li><strong>Write the final function out:</strong> the answer is the equation with <InlineMath math="C" /> replaced by its value — not the value of <InlineMath math="C" /> on its own.</li>
              <li><strong>Read what the derivative represents:</strong> in a context question, <InlineMath math="\frac{dV}{dt}" /> is a rate. Integrating gives the quantity, not the rate.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "diff-eq-ex1",
            question: <p>The graph of <InlineMath math="y=f(x)" /> passes through the point <InlineMath math="(3, -4)" />.<br/>If <InlineMath math="\frac{dy}{dx} = x^2 - 5" />, express <InlineMath math="y" /> in terms of <InlineMath math="x" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} y &= \int (x^2 - 5) \,dx \\ &= \frac{x^3}{3} - 5x + C \end{aligned}" />
                <p>Substitute <InlineMath math="x=3, y=-4" />:</p>
                <BlockMath math="\begin{aligned} -4 &= \frac{3^3}{3} - 5(3) + C \\ -4 &= 9 - 15 + C \\ -4 &= -6 + C \\ 2 &= C \end{aligned}" />
                <p className="text-emerald-300">Solution: <strong className="text-white"><InlineMath math="y = \frac{x^3}{3} - 5x + 2" /></strong></p>
              </div>
            )
          },
          {
             id: "diff-eq-ex2",
             question: <p>The function is defined on a suitable domain such that <InlineMath math="f'(x) = x^2 + \frac{1}{x^2} + \frac{2}{3}" />.<br/>Given that <InlineMath math="f(1) = 4" />, find <InlineMath math="f(x)" /> in terms of <InlineMath math="x" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} f(x) &= \int (x^2 + x^{-2} + \frac{2}{3}) \,dx \\ &= \frac{x^3}{3} - x^{-1} + \frac{2}{3}x + C \\ &= \frac{x^3}{3} - \frac{1}{x} + \frac{2}{3}x + C \end{aligned}" />
                 <p>Substitute <InlineMath math="x=1, f(1)=4" />:</p>
                 <BlockMath math="\begin{aligned} 4 &= \frac{1^3}{3} - \frac{1}{1} + \frac{2}{3}(1) + C \\ 4 &= \frac{1}{3} - 1 + \frac{2}{3} + C \\ 4 &= C \end{aligned}" />
                 <p className="text-emerald-300">Solution: <strong className="text-white"><InlineMath math="f(x) = \frac{x^3}{3} - \frac{1}{x} + \frac{2}{3}x + 4" /></strong></p>
               </div>
             )
          }
        ]
      },
      {
        id: "definite-integrals",
        title: "Definite Integrals",
        videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=1208",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Let <InlineMath math="F(x)" /> be the integral of <InlineMath math="f(x)" />.</p>
            <p>We define <InlineMath math="\int_a^b f(x) \,dx = F(b) - F(a)" /> where <InlineMath math="a" /> and <InlineMath math="b" /> are the limits of the integral and <InlineMath math="b > a" />.</p>
            <p>Example:</p>
            <BlockMath math="\begin{aligned} \int_a^b x \,dx &= \left[\frac{x^2}{2} + C\right]_a^b \\ &= \left(\frac{b^2}{2} + C\right) - \left(\frac{a^2}{2} + C\right) \\ &= \frac{b^2}{2} - \frac{a^2}{2} \end{aligned}" />
            <p className="text-emerald-300">Note: The constant of integration simplifies to 0 so is not required for definite integrals.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Brackets when substituting:</strong> definite integrals are where brackets matter most, especially when a limit is negative. Write <InlineMath math="\left[\ldots\right]" /> and substitute the negative limit in brackets.</li>
                <li><strong>Upper limit first:</strong> it is <InlineMath math="F(b) - F(a)" />. Switching the limits and then mishandling the resulting negative is a common and costly error.</li>
                <li><strong>A negative answer is not automatically an error:</strong> if you have swapped limits, fix the limits — do not just make the answer positive. For an area below the axis, deal with it deliberately.</li>
                <li><strong>Use your calculator properly in paper 2:</strong> inefficient calculator use, and pages of unnecessary working, waste time and invite mistakes. Evaluate in one go and keep the working structured.</li>
                <li><strong>Include <InlineMath math="dx" /> in the statement:</strong> 2025 flags this explicitly on a definite integral question.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
             id: "defint-ex1",
             question: <p>Find <InlineMath math="\int_1^3 5x^2 \,dx" /></p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} &= \left[ \frac{5x^3}{3} \right]_1^3 \\ &= \left( \frac{5(3)^3}{3} \right) - \left( \frac{5(1)^3}{3} \right) \\ &= \frac{135}{3} - \frac{5}{3} \\ &= \frac{130}{3} \end{aligned}" />
               </div>
             )
          },
          {
             id: "defint-ex2",
             question: <p>Find <InlineMath math="\int_0^2 (x^3 + 3x^2) \,dx" /></p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} &= \left[ \frac{x^4}{4} + x^3 \right]_0^2 \\ &= \left( \frac{2^4}{4} + 2^3 \right) - (0 + 0) \\ &= \left( \frac{16}{4} + 8 \right) \\ &= 4 + 8 = 12 \end{aligned}" />
               </div>
             )
          },
          {
             id: "defint-ex3",
             question: <p>Find <InlineMath math="\int_{-1}^4 \frac{4}{x^3} \,dx" /></p>,
             solution: (
               <div className="space-y-4">
                 <p className="text-red-400">Wait, this function is undefined at <InlineMath math="x=0" />, which is within the limits <InlineMath math="[-1, 4]" />. This improper integral diverges. However, if we treat it purely mechanically (ignoring the discontinuity):</p>
                 <BlockMath math="\begin{aligned} \int_{-1}^4 4x^{-3} \,dx &= \left[ \frac{4x^{-2}}{-2} \right]_{-1}^4 \\ &= \left[ -\frac{2}{x^2} \right]_{-1}^4 \\ &= \left(-\frac{2}{4^2}\right) - \left(-\frac{2}{(-1)^2}\right) \\ &= -\frac{2}{16} - (-2) \\ &= -\frac{1}{8} + 2 = \frac{15}{8} \end{aligned}" />
               </div>
             )
          },
          {
             id: "defint-ex4",
             question: <p>Find the value of <InlineMath math="z" /> for which <InlineMath math="\int_1^z (1 + 2x) \,dx = 4" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} \left[ x + x^2 \right]_1^z &= 4 \\ (z + z^2) - (1 + 1^2) &= 4 \\ z^2 + z - 2 &= 4 \\ z^2 + z - 6 &= 0 \\ (z + 3)(z - 2) &= 0 \end{aligned}" />
                 <p>So <InlineMath math="z = -3" /> or <InlineMath math="z = 2" />.</p>
               </div>
             )
          }
        ]
      },
      {
         id: "area-under-curve",
         title: "Area Under a Curve",
         videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=1619",
         theory: (
           <div className="space-y-4 text-slate-300">
             <div className="flex justify-center my-6">
                <AreaUnderCurveIntroGraph />
             </div>
             <p>In general, we can find the area enclosed by a curve and the <InlineMath math="x" />-axis between <InlineMath math="x=a" /> and <InlineMath math="x=b" /> by using:</p>
             <BlockMath math="\int_a^b f(x) \,dx" />
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>Find the limits if you are not given them:</strong> "the area between the curve and the <InlineMath math="x" />-axis" means you must solve <InlineMath math="y = 0" /> to get the roots first.</li>
               <li><strong>An area is never negative:</strong> if the integral comes out negative the region is below the axis. Take the positive value and say why.</li>
               <li><strong>Split where the curve crosses the axis:</strong> integrating straight through a root lets positive and negative parts cancel, which understates the area.</li>
               <li><strong>Use brackets when substituting:</strong> particularly with a negative limit, where a missing bracket changes every sign.</li>
               <li><strong>State the units:</strong> areas are in square units.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
              id: "area-unc-ex1",
              question: (
                <div className="space-y-4">
                  <p>The graph of <InlineMath math="y=x^2-4x" /> is shown below.<br/>Calculate the shaded area.</p>
                  <div className="flex justify-center bg-slate-800/50 p-4 rounded-xl">
                    <AreaUnderCurveEx1Graph />
                  </div>
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>The area is between <InlineMath math="x=4" /> and <InlineMath math="x=5" />.</p>
                  <BlockMath math="\begin{aligned} A &= \int_4^5 (x^2 - 4x) \,dx \\ &= \left[ \frac{x^3}{3} - 2x^2 \right]_4^5 \\ &= \left( \frac{125}{3} - 2(25) \right) - \left( \frac{64}{3} - 2(16) \right) \\ &= \left( \frac{125}{3} - 50 \right) - \left( \frac{64}{3} - 32 \right) \\ &= \left( -\frac{25}{3} \right) - \left( -\frac{32}{3} \right) \\ &= \frac{7}{3} \text{ square units} \end{aligned}" />
                </div>
              )
           },
           {
              id: "area-unc-ex2",
              question: (
                <div className="space-y-4">
                  <p>Find the area enclosed by the graph of <InlineMath math="y = -x^2 + 5x - 6" /> and the <InlineMath math="x" />-axis.</p>
                  <div className="flex justify-center bg-slate-800/50 p-4 rounded-xl">
                    <AreaUnderCurveEx2Graph />
                  </div>
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>First find the roots (where <InlineMath math="y=0" />):</p>
                  <BlockMath math="\begin{aligned} -x^2 + 5x - 6 &= 0 \\ x^2 - 5x + 6 &= 0 \\ (x-2)(x-3) &= 0 \end{aligned}" />
                  <p>The limits are <InlineMath math="x=2" /> to <InlineMath math="x=3" />.</p>
                  <BlockMath math="\begin{aligned} A &= \int_2^3 (-x^2 + 5x - 6) \,dx \\ &= \left[ -\frac{x^3}{3} + \frac{5x^2}{2} - 6x \right]_2^3 \\ &= \left( -9 + \frac{45}{2} - 18 \right) - \left( -\frac{8}{3} + 10 - 12 \right) \\ &= \left( -\frac{9}{2} \right) - \left( -\frac{14}{3} \right) \\ &= -\frac{27}{6} + \frac{28}{6} = \frac{1}{6} \text{ square units} \end{aligned}" />
                </div>
              )
           }
         ]
      },
      {
         id: "area-between-curves",
         title: "Area Between Curves",
         videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=1973",
         theory: (
           <div className="space-y-4 text-slate-300">
             <div className="flex justify-center my-6">
                <AreaBetweenCurvesIntroGraph />
             </div>
             <p>In general, we can find the area enclosed between two curves from <InlineMath math="x=a" /> to <InlineMath math="x=b" /> by using:</p>
             <BlockMath math="\int_a^b \big( f(x) - g(x) \big) \,dx" />
             <p>where <InlineMath math="f(x)" /> is the <strong>upper</strong> curve and <InlineMath math="g(x)" /> is the <strong>lower</strong> curve.</p>
             <div className="bg-slate-800 p-4 rounded-lg mt-4">
               <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
               <ul className="list-disc list-inside space-y-2 ml-2">
                 <li><strong>Brackets round the second curve:</strong> bracket errors are the most common way to lose marks on this question. Write <InlineMath math="\big(f(x) - g(x)\big)" /> — subtracting <InlineMath math="g(x)" /> means subtracting <em>every</em> term of it, signs included.</li>
                 <li><strong>Upper minus lower, not left minus right:</strong> decide which curve is on top over the interval. Getting it the wrong way round gives the right size with the wrong sign.</li>
                 <li><strong>Find the limits if you are not given them:</strong> set the two curves equal and solve. Do not assume the limits are the axis intercepts.</li>
                 <li><strong>Split at every crossing:</strong> if the curves swap over inside the interval, the integral must be split there and each piece taken as upper minus lower separately.</li>
                 <li><strong>Calculator discipline:</strong> evaluate carefully and keep your lines of working consistent.</li>
               </ul>
             </div>
           </div>
         ),
         examples: [
           {
              id: "area-bc-ex1",
              question: (
                <div className="space-y-4">
                  <p>Calculate the shaded area enclosed by <InlineMath math="y = 4x + 16" /> and <InlineMath math="y = 2x^2 + 10" />.</p>
                  <div className="flex justify-center bg-slate-800/50 p-4 rounded-xl">
                    <AreaBetweenCurvesEx1Graph />
                  </div>
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>Integrate Upper curve - Lower curve between the intersection points <InlineMath math="x=-1" /> and <InlineMath math="x=3" />:</p>
                  <BlockMath math="\begin{aligned} A &= \int_{-1}^3 \big( (4x+16) - (2x^2+10) \big) \,dx \\ &= \int_{-1}^3 ( -2x^2 + 4x + 6 ) \,dx \\ &= \left[ -\frac{2x^3}{3} + 2x^2 + 6x \right]_{-1}^3 \\ &= \left( -18 + 18 + 18 \right) - \left( \frac{2}{3} + 2 - 6 \right) \\ &= 18 - \left( -\frac{10}{3} \right) \\ &= \frac{54}{3} + \frac{10}{3} = \frac{64}{3} \text{ square units} \end{aligned}" />
                </div>
              )
           },
           {
              id: "area-bc-ex2",
              question: (
                <div className="space-y-4">
                  <p>Calculate the shaded area enclosed by the curves with equations <InlineMath math="y = 6 - 3x^2" /> and <InlineMath math="y = -3 - 2x^2" />.</p>
                  <div className="flex justify-center bg-slate-800/50 p-4 rounded-xl">
                    <AreaBetweenCurvesEx2Graph />
                  </div>
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>First, find the points of intersection:</p>
                  <BlockMath math="\begin{aligned} 6 - 3x^2 &= -3 - 2x^2 \\ x^2 &= 9 \\ x &= 3, x &= -3 \end{aligned}" />
                  <p>The limits are <InlineMath math="-3" /> and <InlineMath math="3" />.</p>
                  <BlockMath math="\begin{aligned} A &= \int_{-3}^3 \big( (6-3x^2) - (-3-2x^2) \big) \,dx \\ &= \int_{-3}^3 ( 9 - x^2 ) \,dx \\ &= \left[ 9x - \frac{x^3}{3} \right]_{-3}^3 \\ &= \left( 27 - 9 \right) - \left( -27 + 9 \right) \\ &= 18 - (-18) = 36 \text{ square units} \end{aligned}" />
                </div>
              )
           },
           {
              id: "area-bc-ex3",
              question: (
                <div className="space-y-4">
                  <p>Two functions are defined by <InlineMath math="x \in \mathbb{R}" /> by <InlineMath math="f(x) = x^3 - 7x^2 + 8x + 16" /> and <InlineMath math="g(x) = 4x + 4" />.</p>
                  <p>Calculate the shaded area.</p>
                  <div className="flex justify-center bg-slate-800/50 p-4 rounded-xl">
                    <AreaBetweenCurvesEx3Graph />
                  </div>
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>The curves intersect at multiple points. <InlineMath math="A_1" /> is from <InlineMath math="x = -1" /> to <InlineMath math="x = 2" /> where <InlineMath math="f(x)" /> is upper. <InlineMath math="A_2" /> is from <InlineMath math="x = 2" /> to <InlineMath math="x = 6" /> where <InlineMath math="g(x)" /> is upper.</p>
                  <p>Find <InlineMath math="A_1" />:</p>
                  <BlockMath math="\begin{aligned} A_1 &= \int_{-1}^2 \big( f(x) - g(x) \big) \,dx \\ &= \int_{-1}^2 (x^3 - 7x^2 + 4x + 12) \,dx \\ &= \left[ \frac{x^4}{4} - \frac{7x^3}{3} + 2x^2 + 12x \right]_{-1}^2 \\ &= \left( 4 - \frac{56}{3} + 8 + 24 \right) - \left( \frac{1}{4} + \frac{7}{3} + 2 - 12 \right) \\ &= \left( \frac{52}{3} \right) - \left( -\frac{89}{12} \right) = \frac{208 + 89}{12} = \frac{297}{12} = \frac{99}{4} \end{aligned}" />
                  
                  <p>Find <InlineMath math="A_2" />:</p>
                  <BlockMath math="\begin{aligned} A_2 &= \int_2^6 \big( g(x) - f(x) \big) \,dx \\ &= \int_2^6 (-x^3 + 7x^2 - 4x - 12) \,dx \\ &= \left[ -\frac{x^4}{4} + \frac{7x^3}{3} - 2x^2 - 12x \right]_2^6 \\ &= \left( -324 + 504 - 72 - 72 \right) - \left( -4 + \frac{56}{3} - 8 - 24 \right) \\ &= ( 36 ) - \left( -\frac{52}{3} \right) = \frac{160}{3} \end{aligned}" />

                  <p>Total Area = <InlineMath math="\frac{99}{4} + \frac{160}{3} = \frac{297 + 640}{12} = \frac{937}{12} \approx 78.08" /></p>
                </div>
              )
           }
         ]
      },
      {
         id: "area-under-x-axis",
         title: "Area Under the x-axis",
         videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=3142",
         theory: (
           <div className="space-y-4 text-slate-300">
             <div className="flex justify-center my-6">
                <AreaUnderXAxisIntroGraph />
             </div>
             <p>If the area is below the x-axis, the definite integral will yield a negative value.  Since area must be positive, we can calculate it as the area between two curves, where the upper curve is <InlineMath math="y=0" /> (the x-axis) and the lower curve is the function.</p>
             <BlockMath math="\int_a^b (0 - f(x)) \,dx = - \int_a^b f(x) \,dx" />
           <div className="bg-slate-800 p-4 rounded-lg mt-4">
             <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
             <ul className="list-disc list-inside space-y-2 ml-2">
               <li><strong>The negative is information, not a mistake:</strong> a negative integral tells you the region lies below the axis. Interpret it rather than quietly dropping the sign.</li>
               <li><strong>Never add a negative area to a positive one:</strong> work out each piece separately and add the <em>magnitudes</em>.</li>
               <li><strong>Find every root in the interval:</strong> each crossing is a place the integral must be split.</li>
               <li><strong>Total area versus net value:</strong> read carefully — "the area enclosed" wants the sum of the magnitudes; a plain definite integral may legitimately be negative.</li>
             </ul>
           </div>
           </div>
         ),
         examples: [
           {
              id: "area-xu-ex1",
              question: (
                <div className="space-y-4">
                  <p>Calculate the shaded area shown.</p>
                  <div className="flex justify-center bg-slate-800/50 p-4 rounded-xl">
                    <AreaUnderXAxisEx1Graph />
                  </div>
                </div>
              ),
              solution: (
                <div className="space-y-4">
                  <p>The limits are <InlineMath math="x=1" /> to <InlineMath math="x=4" />. The curve <InlineMath math="y=x^2-4x" /> is entirely below the x-axis.</p>
                  <BlockMath math="\begin{aligned} \text{Area} &= - \int_1^4 (x^2 - 4x) \,dx \\ &= - \left[ \frac{x^3}{3} - 2x^2 \right]_1^4 \\ &= - \left( \left( \frac{64}{3} - 32 \right) - \left( \frac{1}{3} - 2 \right) \right) \\ &= - \left( - \frac{32}{3} - \left(- \frac{5}{3} \right) \right) \\ &= - \left( - \frac{27}{3} \right) \\ &= 9 \end{aligned}" />
                  <p>The area is 9 square units.</p>
                </div>
              )
           }
         ]
      },
      {
id: "integration-of-brackets",
        title: "Further Integration of Brackets",
        videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=3573",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We have previously learned how to differentiate functions of the form <InlineMath math="f(ax+b)" />:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col space-y-4">
              <BlockMath math="\frac{d}{dx}[(ax+b)^{n+1}] = (n+1)(ax+b)^n \times a = a(n+1)(ax+b)^n" />
            </div>
            <p>For integrating linear brackets raised to a power, we use:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col space-y-4">
              <BlockMath math="\int (ax+b)^n \,dx = \frac{(ax+b)^{n+1}}{a(n+1)} + C \quad (n \neq -1)" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Divide by the derivative of the bracket:</strong> integrating <InlineMath math="(3x+2)^4" /> needs <InlineMath math="\times \frac{1}{3}" /> as well as raising the power. Forgetting that factor is the standard error.</li>
              <li><strong>This only works for a linear bracket:</strong> the shortcut is valid when the inside is <InlineMath math="ax+b" />. It does not work when the bracket contains <InlineMath math="x^2" />.</li>
              <li><strong>Add one to the power, then divide by the new power:</strong> and by the coefficient — two divisions, not one.</li>
              <li><strong>Rewrite fractions as negative powers first:</strong> <InlineMath math="\frac{1}{(2x-1)^2}" /> becomes <InlineMath math="(2x-1)^{-2}" />.</li>
              <li><strong>Still write <InlineMath math="+\,C" />:</strong> the bracket form makes it especially easy to forget.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "further-int-brackets-ex1",
            question: <p>Find <InlineMath math="\int (5x+2)^2 \, dx" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \int (5x+2)^2 \, dx &= \frac{(5x+2)^3}{5 \times 3} + C \\ &= \frac{(5x+2)^3}{15} + C \end{aligned}" />
              </div>
            )
          },
          {
            id: "further-int-brackets-ex2",
            question: <p>Find <InlineMath math="\int \frac{1}{\sqrt[3]{5x+2}} \, dx" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, rewrite the expression with a fractional exponent:</p>
                <BlockMath math="\int (5x+2)^{-1/3} \, dx" />
                <p>Now integrate using the rule:</p>
                <BlockMath math="\begin{aligned} &= \frac{(5x+2)^{2/3}}{5 \times \frac{2}{3}} + C \\ &= \frac{3(5x+2)^{2/3}}{10} + C \\ &= \frac{3\sqrt[3]{(5x+2)^2}}{10} + C \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "integration-of-trig",
        title: "Further Integration of Trigonometric Functions",
        videoUrl: "https://www.youtube.com/embed/n68SZ605FQQ?start=3869",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We have previously learned how to differentiate trigonometric functions of the form <InlineMath math="\sin(ax+b)" /> and <InlineMath math="\cos(ax+b)" />.</p>
            <p>When integrating these, we must divide by the derivative of the angle (which is <InlineMath math="a" />):</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col space-y-4">
              <BlockMath math="\int \cos(ax+b) \, dx = \frac{1}{a} \sin(ax+b) + C" />
              <BlockMath math="\int \sin(ax+b) \, dx = -\frac{1}{a} \cos(ax+b) + C" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The minus sign swaps sides:</strong> <InlineMath math="\int \sin x\,dx = -\cos x + C" />, while <InlineMath math="\int \cos x\,dx = \sin x + C" />. This is the reverse of differentiation, and mixing the two up is the most common error in the topic.</li>
              <li><strong>Divide by the coefficient of <InlineMath math="x" />:</strong> <InlineMath math="\int \cos(4x)\,dx = \frac{1}{4}\sin(4x) + C" />. The chain factor divides when integrating and multiplies when differentiating.</li>
              <li><strong>Work in radians:</strong> these results are only valid in radians, and definite integrals must have radian limits.</li>
              <li><strong>Check by differentiating:</strong> it takes seconds and catches both the sign and the coefficient.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "further-int-trig-ex1",
            question: <p>Find <InlineMath math="\int \cos 4x \, dx" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\int \cos 4x \, dx = \frac{1}{4} \sin 4x + C" />
              </div>
            )
          },
          {
            id: "further-int-trig-ex2",
            question: <p>Find <InlineMath math="\int \sin\left(4x + \frac{3\pi}{4}\right) \, dx" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\int \sin\left(4x + \frac{3\pi}{4}\right) \, dx = -\frac{1}{4} \cos\left(4x + \frac{3\pi}{4}\right) + C" />
              </div>
            )
          },
          {
            id: "further-int-trig-ex3",
            question: (
              <div className="space-y-4">
                <p>Find the area enclosed between the graph of <InlineMath math="y = \sin\left(3x + \frac{\pi}{6}\right)" />, the x-axis, and the lines <InlineMath math="x=0" /> and <InlineMath math="x = \frac{\pi}{6}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We set up a definite integral:</p>
                <BlockMath math="\text{Area} = \int_{0}^{\pi/6} \sin\left(3x + \frac{\pi}{6}\right) \, dx" />
                <BlockMath math="\begin{aligned} &= \left[ -\frac{1}{3} \cos\left(3x + \frac{\pi}{6}\right) \right]_{0}^{\pi/6} \\ &= \left( -\frac{1}{3} \cos\left(3\left(\frac{\pi}{6}\right) + \frac{\pi}{6}\right) \right) - \left( -\frac{1}{3} \cos\left(3(0) + \frac{\pi}{6}\right) \right) \\ &= \left( -\frac{1}{3} \cos\left(\frac{\pi}{2} + \frac{\pi}{6}\right) \right) - \left( -\frac{1}{3} \cos\left(\frac{\pi}{6}\right) \right) \end{aligned}" />
                <p>Since <InlineMath math="\frac{\pi}{2} + \frac{\pi}{6} = \frac{2\pi}{3}" />:</p>
                <BlockMath math="\begin{aligned} &= \left( -\frac{1}{3} \left(-\frac{1}{2}\right) \right) - \left( -\frac{1}{3} \left(\frac{\sqrt{3}}{2}\right) \right) \\ &= \frac{1}{6} + \frac{\sqrt{3}}{6} \\ &= \frac{1 + \sqrt{3}}{6} \end{aligned}" />
                <p>The area is <InlineMath math="\frac{1 + \sqrt{3}}{6}" /> square units.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "trigonometry",
    title: "Trigonometry",
    topics: [
      {
        id: "radian-measure",
        title: "Radian Measure",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=0",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Previously when measuring angles, we have always used degrees.</p>
            <p className="mb-6">Radians are another unit of measure for angles.</p>
            <p className="mb-6">One radian is the angle made at the centre of a circle by an arc which has length equal to the radius of the circle. Since a radian is defined by the arc of a circle, we can think of radian as 'distance' travelled on a unit circle.</p>
            
            <BlockMath math="\text{Radian} = \frac{\text{distance travelled}}{\text{radius}}" />
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8 text-base">
              <h4 className="font-bold text-white text-xl mb-4">Conversion Rules</h4>
              <ul className="list-disc list-inside ml-4 space-y-4 mb-6">
                <li>To convert <strong>Degrees to Radians</strong>: Multiply by <InlineMath math="\frac{\pi}{180}" /></li>
                <li>To convert <strong>Radians to Degrees</strong>: Multiply by <InlineMath math="\frac{180}{\pi}" /></li>
              </ul>
              
              <div className="border border-white/10 rounded-xl bg-black/20 p-2 sm:p-4 mt-6">
                <table className="w-full text-left border-collapse mt-6">
                  <thead>
                    <tr>
                      <th className="border-b border-white/20 pb-2">Degrees</th>
                      <th className="border-b border-white/20 pb-2">Radians</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="180^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\pi" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="360^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="2\pi" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="30^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{\pi}{6}" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="45^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{\pi}{4}" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="60^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{\pi}{3}" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="90^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{\pi}{2}" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="270^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{3\pi}{2}" /></td></tr>
                    <tr><td className="py-2 border-b border-white/10"><InlineMath math="225^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{5\pi}{4}" /></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Never mix the two in one line:</strong> mixing degrees and radians <em>within a single line of working</em> is a frequent and expensive error. Decide which the question is in and stay there.</li>
                <li><strong>Answer in the units asked for:</strong> working in degrees throughout when radians were wanted is a common mistake. If the domain is given as <InlineMath math="0 \leq x \leq 2\pi" />, the answer must be in radians.</li>
                <li><strong>Set your calculator to the right mode:</strong> a correct method in the wrong mode gives a wrong answer with no way back. Check it before paper 2 and every time the units change.</li>
                <li><strong>Practise this deliberately:</strong> radian measure and exact values are a known weak spot across the course — not a minor detail.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "rad-ex1",
            question: <p>Convert <InlineMath math="61^\circ" /> to radians.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \text{Radians} &= 61 \times \frac{\pi}{180} \\ &= \frac{61\pi}{180} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rad-ex2",
            question: <p>Convert <InlineMath math="65^\circ" /> to radians.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \text{Radians} &= 65 \times \frac{\pi}{180} \\ &= \frac{65\pi}{180} \\ &= \frac{13\pi}{36} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rad-ex3",
            question: <p>Convert <InlineMath math="\frac{7\pi}{4}" /> to degrees.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \text{Degrees} &= \frac{7\pi}{4} \times \frac{180}{\pi} \\ &= 7 \times 45 \\ &= 315^\circ \end{aligned}" />
              </div>
            )
          },
          {
            id: "rad-ex4",
            question: <p>Convert <InlineMath math="\frac{5\pi}{6}" /> to degrees.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \text{Degrees} &= \frac{5\pi}{6} \times \frac{180}{\pi} \\ &= 5 \times 30 \\ &= 150^\circ \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "exact-values",
        title: "Exact Values",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=296",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">It is important to know the exact values for the trigonometric functions at key angles.</p>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 text-base">
              <h4 className="font-bold text-white text-xl mb-4">Values at <InlineMath math="0^\circ, 90^\circ, 180^\circ, 270^\circ, 360^\circ" /></h4>
              <div className="border border-white/10 rounded-xl bg-black/20 p-2 sm:p-4 mt-6">
                <table className="w-full text-left border-collapse mb-6">
                  <thead>
                    <tr>
                      <th className="border-b border-white/20 pb-2">Degrees</th>
                      <th className="border-b border-white/20 pb-2">Radians</th>
                      <th className="border-b border-white/20 pb-2"><InlineMath math="\sin\theta" /></th>
                      <th className="border-b border-white/20 pb-2"><InlineMath math="\cos\theta" /></th>
                      <th className="border-b border-white/20 pb-2"><InlineMath math="\tan\theta" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 border-b border-white/10"><InlineMath math="0^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="0" /></td>
                      <td className="py-2 border-b border-white/10"><InlineMath math="0" /></td><td className="py-2 border-b border-white/10"><InlineMath math="1" /></td><td className="py-2 border-b border-white/10"><InlineMath math="0" /></td>
                    </tr>
                    <tr>
                      <td className="py-2 border-b border-white/10"><InlineMath math="90^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{\pi}{2}" /></td>
                      <td className="py-2 border-b border-white/10"><InlineMath math="1" /></td><td className="py-2 border-b border-white/10"><InlineMath math="0" /></td><td className="py-2 border-b border-white/10">undefined</td>
                    </tr>
                    <tr>
                      <td className="py-2 border-b border-white/10"><InlineMath math="180^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\pi" /></td>
                      <td className="py-2 border-b border-white/10"><InlineMath math="0" /></td><td className="py-2 border-b border-white/10"><InlineMath math="-1" /></td><td className="py-2 border-b border-white/10"><InlineMath math="0" /></td>
                    </tr>
                    <tr>
                      <td className="py-2 border-b border-white/10"><InlineMath math="270^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="\frac{3\pi}{2}" /></td>
                      <td className="py-2 border-b border-white/10"><InlineMath math="-1" /></td><td className="py-2 border-b border-white/10"><InlineMath math="0" /></td><td className="py-2 border-b border-white/10">undefined</td>
                    </tr>
                    <tr>
                      <td className="py-2 border-b border-white/10"><InlineMath math="360^\circ" /></td><td className="py-2 border-b border-white/10"><InlineMath math="2\pi" /></td>
                      <td className="py-2 border-b border-white/10"><InlineMath math="0" /></td><td className="py-2 border-b border-white/10"><InlineMath math="1" /></td><td className="py-2 border-b border-white/10"><InlineMath math="0" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-base">
              <h4 className="font-bold text-white text-xl mb-4">Values at <InlineMath math="30^\circ, 45^\circ, 60^\circ" /></h4>
              <p className="mb-6 text-slate-300">You can easily remember these values using two special right-angled triangles.</p>
              
              <div className="flex flex-col md:flex-row gap-8 justify-center mb-8">
                <div className="flex flex-col items-center">
                  <ExactValueTriangle45 />
                  <p className="text-slate-400 mt-4 text-sm text-center">For <InlineMath math="45^\circ" /> (or <InlineMath math="\frac{\pi}{4}" />)</p>
                </div>
                <div className="flex flex-col items-center">
                  <ExactValueTriangle3060 />
                  <p className="text-slate-400 mt-4 text-sm text-center">For <InlineMath math="30^\circ" /> and <InlineMath math="60^\circ" /> (or <InlineMath math="\frac{\pi}{6}" /> and <InlineMath math="\frac{\pi}{3}" />)</p>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl bg-black/20 p-2 sm:p-4 mt-6">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-white/20 pb-2 text-left">Function</th>
                      <th className="border-b border-white/20 pb-2"><InlineMath math="30^\circ \quad \left(\frac{\pi}{6}\right)" /></th>
                      <th className="border-b border-white/20 pb-2"><InlineMath math="45^\circ \quad \left(\frac{\pi}{4}\right)" /></th>
                      <th className="border-b border-white/20 pb-2"><InlineMath math="60^\circ \quad \left(\frac{\pi}{3}\right)" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 border-b border-white/10 text-left font-bold text-white"><InlineMath math="\sin\theta" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{1}{2}" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{1}{\sqrt{2}}" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{\sqrt{3}}{2}" /></td>
                    </tr>
                    <tr>
                      <td className="py-4 border-b border-white/10 text-left font-bold text-white"><InlineMath math="\cos\theta" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{\sqrt{3}}{2}" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{1}{\sqrt{2}}" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{1}{2}" /></td>
                    </tr>
                    <tr>
                      <td className="py-4 border-b border-white/10 text-left font-bold text-white"><InlineMath math="\tan\theta" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\frac{1}{\sqrt{3}}" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="1" /></td>
                      <td className="py-4 border-b border-white/10"><InlineMath math="\sqrt{3}" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>These must be memorised:</strong> exact values are a known weak spot across the course, and in the non-calculator paper there is no way round them. Learn the two triangles rather than the table — you can rebuild every value from them.</li>
              <li><strong>Exact means exact:</strong> a decimal such as 0.866 gains nothing when <InlineMath math="\frac{\sqrt{3}}{2}" /> was asked for.</li>
              <li><strong>Rationalise the denominator:</strong> <InlineMath math="\frac{1}{\sqrt{2}}" /> is usually written <InlineMath math="\frac{\sqrt{2}}{2}" />. Check the form expected.</li>
              <li><strong>Know them in radians as well as degrees:</strong> the same values appear as <InlineMath math="\frac{\pi}{6}" />, <InlineMath math="\frac{\pi}{4}" /> and <InlineMath math="\frac{\pi}{3}" />, and questions mix the two freely.</li>
            </ul>
          </div>
          </div>
        ),
        examples: []
      },
      {
        id: "exact-values-related-angles",
        title: "Exact Values of Related Angles",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=296",
        theory: (
          <div className="space-y-8 text-lg">
            <h3 className="font-bold text-2xl text-white mb-6">The CAST Diagram</h3>
            <p className="mb-6">The CAST diagram helps us determine the sign (positive or negative) of trigonometric functions in each of the four quadrants.</p>
            
            <div className="flex justify-center w-full mb-8">
              <div className="relative w-64 h-64 mx-auto border-2 border-white/20 rounded-full flex items-center justify-center">
                <div className="absolute w-full h-0.5 bg-white/20"></div>
                <div className="absolute h-full w-0.5 bg-white/20"></div>
                
                <div className="absolute top-8 right-8 text-center bg-black/50 p-2 rounded-xl backdrop-blur-sm">
                  <div className="font-bold text-emerald-400 text-3xl">A</div>
                  <div className="text-sm text-slate-300">All +ve</div>
                </div>
                
                <div className="absolute top-8 left-8 text-center bg-black/50 p-2 rounded-xl backdrop-blur-sm">
                  <div className="font-bold text-blue-400 text-3xl">S</div>
                  <div className="text-sm text-slate-300">Sine +ve</div>
                </div>
                
                <div className="absolute bottom-8 left-8 text-center bg-black/50 p-2 rounded-xl backdrop-blur-sm">
                  <div className="font-bold text-indigo-400 text-3xl">T</div>
                  <div className="text-sm text-slate-300">Tan +ve</div>
                </div>
                
                <div className="absolute bottom-8 right-8 text-center bg-black/50 p-2 rounded-xl backdrop-blur-sm">
                  <div className="font-bold text-rose-400 text-3xl">C</div>
                  <div className="text-sm text-slate-300">Cos +ve</div>
                </div>
                
                <div className="absolute -right-16 text-sm">0 / 360°</div>
                <div className="absolute -top-8 text-sm">90°</div>
                <div className="absolute -left-12 text-sm">180°</div>
                <div className="absolute -bottom-8 text-sm">270°</div>
              </div>
            </div>
            
            <p className="mb-6">We can use this diagram along with our exact values in the first quadrant to evaluate trigonometric functions for any angle.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Find the acute related angle first:</strong> for <InlineMath math="150^\circ" /> that is <InlineMath math="30^\circ" />. Work out the exact value for the acute angle, then attach the sign.</li>
              <li><strong>The quadrant decides the sign:</strong> use CAST. The size of the value never changes — only whether it is positive or negative.</li>
              <li><strong>Subtract from the right axis:</strong> related angles come from <InlineMath math="180^\circ" /> and <InlineMath math="360^\circ" /> for sine and cosine. Subtracting from <InlineMath math="90^\circ" /> changes the ratio instead of the sign.</li>
              <li><strong>Tangent has a period of <InlineMath math="180^\circ" />:</strong> it repeats twice as often as sine and cosine, so treat it separately.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "rel-ang-ex1",
            question: <p>Find the exact value of <InlineMath math="\sin 150^\circ" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. <InlineMath math="150^\circ" /> is in the 2nd quadrant, where Sine is positive.</p>
                <p>2. The related acute angle is <InlineMath math="180^\circ - 150^\circ = 30^\circ" />.</p>
                <BlockMath math="\begin{aligned} \sin 150^\circ &= \sin 30^\circ \\ &= \frac{1}{2} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rel-ang-ex2",
            question: <p>Find the exact value of <InlineMath math="\tan 120^\circ" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. <InlineMath math="120^\circ" /> is in the 2nd quadrant, where Tangent is negative.</p>
                <p>2. The related acute angle is <InlineMath math="180^\circ - 120^\circ = 60^\circ" />.</p>
                <BlockMath math="\begin{aligned} \tan 120^\circ &= -\tan 60^\circ \\ &= -\sqrt{3} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rel-ang-ex3",
            question: <p>Find the exact value of <InlineMath math="\cos 405^\circ" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. <InlineMath math="405^\circ" /> is more than one full circle (<InlineMath math="360^\circ" />).</p>
                <p>2. The equivalent angle is <InlineMath math="405^\circ - 360^\circ = 45^\circ" />, which is in the 1st quadrant.</p>
                <BlockMath math="\begin{aligned} \cos 405^\circ &= \cos 45^\circ \\ &= \frac{1}{\sqrt{2}} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rel-ang-ex4",
            question: <p>Find the exact value of <InlineMath math="\cos\left(\frac{7\pi}{4}\right)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. <InlineMath math="\frac{7\pi}{4}" /> is in the 4th quadrant, where Cosine is positive.</p>
                <p>2. The related acute angle is <InlineMath math="2\pi - \frac{7\pi}{4} = \frac{\pi}{4}" />.</p>
                <BlockMath math="\begin{aligned} \cos\left(\frac{7\pi}{4}\right) &= \cos\left(\frac{\pi}{4}\right) \\ &= \frac{1}{\sqrt{2}} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rel-ang-ex5",
            question: <p>Find the exact value of <InlineMath math="\tan\left(\frac{2\pi}{3}\right)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. <InlineMath math="\frac{2\pi}{3}" /> is in the 2nd quadrant, where Tangent is negative.</p>
                <p>2. The related acute angle is <InlineMath math="\pi - \frac{2\pi}{3} = \frac{\pi}{3}" />.</p>
                <BlockMath math="\begin{aligned} \tan\left(\frac{2\pi}{3}\right) &= -\tan\left(\frac{\pi}{3}\right) \\ &= -\sqrt{3} \end{aligned}" />
              </div>
            )
          },
          {
            id: "rel-ang-ex6",
            question: <p>Find the exact value of <InlineMath math="\cos\left(-\frac{2\pi}{3}\right)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. A negative angle means we go backwards (clockwise).</p>
                <p>2. <InlineMath math="-\frac{2\pi}{3}" /> places us in the 3rd quadrant, where Cosine is negative.</p>
                <p>3. The related acute angle is <InlineMath math="\frac{\pi}{3}" />.</p>
                <BlockMath math="\begin{aligned} \cos\left(-\frac{2\pi}{3}\right) &= -\cos\left(\frac{\pi}{3}\right) \\ &= -\frac{1}{2} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "solving-basic-eqs",
        title: "Solving Basic Trigonometric Equations",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=680",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">To solve basic trigonometric equations:</p>
            <ol className="list-decimal list-inside ml-4 space-y-4 mb-8">
              <li>Rearrange the equation into the form <InlineMath math="\sin x = k" />, <InlineMath math="\cos x = k" /> or <InlineMath math="\tan x = k" />.</li>
              <li>Find the <strong>base angle</strong> (the related acute angle in the first quadrant) by taking the inverse trig function of the <strong>positive</strong> value of <InlineMath math="k" />.</li>
              <li>Use the CAST diagram to determine which two quadrants the solutions lie in based on the sign of <InlineMath math="k" />.</li>
              <li>Calculate your final answers using the base angle and the quadrants, checking that they fall inside the required domain.</li>
            </ol>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Give every solution in the domain:</strong> a calculator returns one angle. Each equation normally has two solutions per revolution — use CAST to find the others.</li>
              <li><strong>Check the domain and its units:</strong> <InlineMath math="0 \leq x \leq 360" /> wants degrees; <InlineMath math="0 \leq x \leq 2\pi" /> wants radians. Answering in the wrong one loses the marks.</li>
              <li><strong>Isolate the trig function first:</strong> rearrange to <InlineMath math="\sin x = k" /> before going near a calculator.</li>
              <li><strong>A negative value does not mean a negative angle:</strong> it tells you which quadrants to use. Your answers should still sit inside the given domain.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "basic-eq-ex1",
            question: <p>Solve <InlineMath math="\sin x^\circ = \frac{1}{2}" /> for <InlineMath math="0 < x^\circ < 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Base angle: <InlineMath math="\sin^{-1}\left(\frac{1}{2}\right) = 30^\circ" /></p>
                <p>Since Sine is positive, solutions are in quadrants 1 and 2.</p>
                <BlockMath math="\begin{aligned} x &= 30 \quad \text{(Q1)} \\ x &= 180 - 30 \\ &= 150 \quad \text{(Q2)} \end{aligned}" />
                <p className="text-emerald-300">Solutions: <strong className="text-white">30°, 150°</strong></p>
              </div>
            )
          },
          {
            id: "basic-eq-ex2",
            question: <p>Solve <InlineMath math="\cos x = -\frac{1}{\sqrt{5}}" /> for <InlineMath math="0 < x < 2\pi" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Base angle: <InlineMath math="\cos^{-1}\left(\frac{1}{\sqrt{5}}\right) \approx  1.107 \text{ rad}" /></p>
                <p>Since Cosine is negative, solutions are in quadrants 2 and 3.</p>
                <BlockMath math="\begin{aligned} x &= \pi - 1.107 \\ &\approx 2.034 \quad \text{(Q2)} \\ x &= \pi + 1.107 \\ &\approx 4.249 \quad \text{(Q3)} \end{aligned}" />
                <p className="text-emerald-300">Solutions: <strong className="text-white">2.034, 4.249</strong></p>
              </div>
            )
          },
          {
            id: "basic-eq-ex3",
            question: <p>Solve <InlineMath math="\sin x = 3" /> for <InlineMath math="0 < x < 2\pi" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>The maximum value of the sine function is 1 and the minimum is -1.</p>
                <p>Therefore, there are <strong className="text-rose-400">no solutions</strong> because <InlineMath math="-1 \leq \sin x \leq 1" />.</p>
              </div>
            )
          },
          {
            id: "basic-eq-ex4",
            question: <p>Solve <InlineMath math="\tan x^\circ = -5" /> for <InlineMath math="0 < x^\circ < 720" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Base angle: <InlineMath math="\tan^{-1}(5) \approx 78.7^\circ" /></p>
                <p>Since Tangent is negative, solutions are in quadrants 2 and 4.</p>
                <p>Because the domain is up to <InlineMath math="720^\circ" />, we need to find two cycles of solutions by adding <InlineMath math="360^\circ" /> to the original solutions.</p>
                <BlockMath math="\begin{aligned} x &= 180 - 78.7 \\ &= 101.3 \quad \text{(First cycle, Q2)} \\ x &= 360 - 78.7 \\ &= 281.3 \quad \text{(First cycle, Q4)} \\ x &= 101.3 + 360 \\ &= 461.3 \quad \text{(Second cycle, Q2)} \\ x &= 281.3 + 360 \\ &= 641.3 \quad \text{(Second cycle, Q4)} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "multiple-angles",
        title: "Trigonometric Equations with Multiple Angles",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=1034",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Multiple angles occur when the period of the given function is not <InlineMath math="360^\circ" /> or <InlineMath math="2\pi" />.</p>
            <p className="mb-6">The period is the length of one cycle of the given trigonometric function.</p>
            <ul className="list-disc list-inside ml-4 space-y-4 mb-8">
              <li><InlineMath math="y = \sin 2x" /> has a period of <InlineMath math="\pi" /> radians.</li>
              <li><InlineMath math="y = \cos 4x^\circ" /> has a period of <InlineMath math="90^\circ" />.</li>
            </ul>
            <p className="mb-6">When solving multiple angle equations, adjust your domain to match the argument. E.g. if the domain is <InlineMath math="0 \leq x \leq 360" />, solve <InlineMath math="0 \leq 2x \leq 720" /> first, then divide your answers by 2.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Widen the domain before you solve:</strong> for <InlineMath math="\sin 2x" /> with <InlineMath math="0 \leq x \leq 360" />, solve for <InlineMath math="2x" /> over <InlineMath math="0 \leq 2x \leq 720" />. Forgetting this is the classic way to lose half the solutions.</li>
              <li><strong>Divide at the very end:</strong> find all the values of <InlineMath math="2x" /> first, then halve each one.</li>
              <li><strong>Count what you expect:</strong> <InlineMath math="\sin 2x = k" /> normally has four solutions in a full revolution, <InlineMath math="\sin 3x = k" /> six. If you have fewer, you have missed some.</li>
              <li><strong>Keep going round:</strong> add <InlineMath math="360^\circ" /> repeatedly to each base solution until you pass the widened domain.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "multi-ang-ex1",
            question: <p>Solve <InlineMath math="2\sin 2x^\circ - 1 = 0" /> for <InlineMath math="0 < x^\circ < 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, isolate the trigonometric function:</p>
                <BlockMath math="\begin{aligned} 2\sin 2x^\circ &= 1 \\ \sin 2x^\circ &= \frac{1}{2} \end{aligned}" />
                <p>Since the domain is <InlineMath math="0 < x < 360" />, the domain for <InlineMath math="2x" /> is <InlineMath math="0 < 2x < 720" />. We're looking for solutions up to <InlineMath math="720^\circ" />.</p>
                <p>Base angle for <InlineMath math="2x" /> is <InlineMath math="\sin^{-1}\left(\frac{1}{2}\right) = 30^\circ" />. Sine is positive in Q1, Q2.</p>
                <BlockMath math="\begin{aligned} 2x &= 30, 150 \quad \text{(First cycle)} \\ 2x &= 30 + 360 \\ &= 390 \quad \text{(Second cycle)} \\ 2x &= 150 + 360 \\ &= 510 \quad \text{(Second cycle)} \end{aligned}" />
                <p>Now, divide all answers by 2 to find <InlineMath math="x" />:</p>
                <BlockMath math="x = 15^\circ, 75^\circ, 195^\circ, 255^\circ" />
              </div>
            )
          },
          {
            id: "multi-ang-ex2",
            question: <p>Solve <InlineMath math="\sqrt{2}\cos 2x = 1" /> for <InlineMath math="0 < x < \pi" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\cos 2x = \frac{1}{\sqrt{2}}" />
                <p>Domain for <InlineMath math="2x" /> is <InlineMath math="0 < 2x < 2\pi" />.</p>
                <p>Base angle for <InlineMath math="2x" /> is <InlineMath math="\cos^{-1}\left(\frac{1}{\sqrt{2}}\right) = \frac{\pi}{4}" />. Cosine is positive in Q1, Q4.</p>
                <BlockMath math="\begin{aligned} 2x &= \frac{\pi}{4}, \frac{7\pi}{4} \\ x &= \frac{\pi}{8}, \frac{7\pi}{8} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "square-terms-constants",
        title: "Trigonometric Equations with Square Terms",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=1351",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">When solving an equation involving a squared term (like <InlineMath math="\sin^2 x" /> or <InlineMath math="\cos^2 x" />), taking the square root requires remembering the <strong className="text-white">plus or minus (<InlineMath math="\pm" />)</strong> sign.</p>
            <p className="mb-6">This means you will usually be looking for solutions in all four quadrants.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Do not lose the negative root:</strong> <InlineMath math="\sin^2 x = \tfrac{1}{4}" /> gives <InlineMath math="\sin x = \pm\tfrac{1}{2}" />. Taking only the positive root halves your solutions.</li>
              <li><strong>That means four solutions, not two:</strong> each of the two values produces its own pair of angles.</li>
              <li><strong>Isolate the squared term first:</strong> rearrange fully before square rooting.</li>
              <li><strong>Use CAST for each value separately:</strong> the positive and negative cases sit in different quadrants.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "sq-terms-ex1",
            question: <p>Solve <InlineMath math="\tan^2 x^\circ = 3" /> for <InlineMath math="0 < x^\circ < 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Take the square root of both sides:</p>
                <BlockMath math="\tan x^\circ = \pm\sqrt{3}" />
                <p>Base angle: <InlineMath math="\tan^{-1}(\sqrt{3}) = 60^\circ" /></p>
                <p>Since we have both positive and negative values, there will be solutions in all four quadrants.</p>
                <BlockMath math="\begin{aligned} x &= 60 \quad \text{(Q1)} \\ x &= 180 - 60 \\ &= 120 \quad \text{(Q2)} \\ x &= 180 + 60 \\ &= 240 \quad \text{(Q3)} \\ x &= 360 - 60 \\ &= 300 \quad \text{(Q4)} \end{aligned}" />
              </div>
            )
          },
          {
            id: "sq-terms-ex2",
            question: <p>Solve <InlineMath math="4\cos^2 x = 3" /> for <InlineMath math="0 < x < 2\pi" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \cos^2 x &= \frac{3}{4} \\ \cos x &= \pm\frac{\sqrt{3}}{2} \end{aligned}" />
                <p>Base angle: <InlineMath math="\cos^{-1}\left(\frac{\sqrt{3}}{2}\right) = \frac{\pi}{6}" /></p>
                <p>Solutions sit in all four quadrants.</p>
                <BlockMath math="\begin{aligned} x &= \frac{\pi}{6} \quad \text{(Q1)} \\ x &= \pi - \frac{\pi}{6} \\ &= \frac{5\pi}{6} \quad \text{(Q2)} \\ x &= \pi + \frac{\pi}{6} \\ &= \frac{7\pi}{6} \quad \text{(Q3)} \\ x &= 2\pi - \frac{\pi}{6} \\ &= \frac{11\pi}{6} \quad \text{(Q4)} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "quadratics-identities",
        title: "Quadratic Trigonometric Equations",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=1567",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Some trigonometric equations take the structure of a quadratic equation. You will need to factorise them to solve.</p>
            <p className="mb-6">Sometimes, the equation contains both sine and cosine terms. You must use the identity <InlineMath math="\sin^2 x + \cos^2 x = 1" />. Rearrange it to replace one squared term, ensuring the whole equation is expressed using only one trigonometric function.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Factorise — never divide by a trig term:</strong> dividing by <InlineMath math="\sin x" /> throws away every solution where <InlineMath math="\sin x = 0" />. Take the common factor out and set each factor to zero.</li>
              <li><strong>Substitute to see the quadratic:</strong> letting <InlineMath math="u = \sin x" /> makes the structure obvious and stops sign errors.</li>
              <li><strong>Reject impossible values:</strong> <InlineMath math="\sin x = 2" /> has no solutions, since sine never leaves <InlineMath math="-1 \leq \sin x \leq 1" />. Say so explicitly rather than ignoring it.</li>
              <li><strong>Solve both factors:</strong> a quadratic gives two values, and each produces its own set of angles in the domain.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "quad-eq-ex1",
            question: <p>Solve <InlineMath math="3\sin^2 x^\circ - 4\sin x^\circ + 1 = 0" /> for <InlineMath math="0 < x^\circ < 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Let <InlineMath math="u = \sin x^\circ" /> to see the quadratic structure:</p>
                <BlockMath math="\begin{aligned} 3u^2 - 4u + 1 &= 0 \\ (3u - 1)(u - 1) &= 0 \end{aligned}" />
                <p>This means either <InlineMath math="3u - 1 = 0 \implies u = \frac{1}{3}" /> or <InlineMath math="u - 1 = 0 \implies u = 1" />.</p>
                
                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="font-bold text-white mb-4">For <InlineMath math="\sin x^\circ = \frac{1}{3}" /></p>
                  <p>Base angle <InlineMath math="\approx 19.5^\circ" />. Sine is positive in Q1, Q2.</p>
                  <BlockMath math="\begin{aligned} x &= 19.5 \\ x &= 180 - 19.5 \\ &= 160.5 \end{aligned}" />
                </div>
                
                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="font-bold text-white mb-4">For <InlineMath math="\sin x^\circ = 1" /></p>
                  <p>From the sine graph exact values:</p>
                  <BlockMath math="x = 90" />
                </div>
                
                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="text-emerald-300">Final Solutions: <strong className="text-white">19.5°, 90°, 160.5°</strong></p>
                </div>
              </div>
            )
          },
          {
            id: "quad-eq-ex2",
            question: <p>Solve <InlineMath math="5\cos^2 x^\circ - 2\cos x^\circ = 3\sin^2 x^\circ" /> for <InlineMath math="0 < x^\circ < 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Use <InlineMath math="\sin^2 x^\circ = 1 - \cos^2 x^\circ" /> to replace the sine term:</p>
                <BlockMath math="\begin{aligned} 5\cos^2 x^\circ - 2\cos x^\circ &= 3(1 - \cos^2 x^\circ) \\ 5\cos^2 x^\circ - 2\cos x^\circ &= 3 - 3\cos^2 x^\circ \end{aligned}" />
                <p>Bring everything to one side to form a quadratic=0:</p>
                <BlockMath math="8\cos^2 x^\circ - 2\cos x^\circ - 3 = 0" />
                <p>Factorise (let <InlineMath math="u = \cos x^\circ" />):</p>
                <BlockMath math="(4\cos x^\circ - 3)(2\cos x^\circ + 1) = 0" />
                
                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="font-bold text-white mb-4">For <InlineMath math="\cos x^\circ = \frac{3}{4}" /></p>
                  <p>Base angle <InlineMath math="\approx 41.4^\circ" />. Cosine is positive in Q1, Q4.</p>
                  <BlockMath math="\begin{aligned} x &= 41.4 \\ x &= 360 - 41.4 \\ &= 318.6 \end{aligned}" />
                </div>
                
                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="font-bold text-white mb-4">For <InlineMath math="\cos x^\circ = -\frac{1}{2}" /></p>
                  <p>Base angle for <InlineMath math="\frac{1}{2}" /> is <InlineMath math="60^\circ" />. Cosine is negative in Q2, Q3.</p>
                  <BlockMath math="\begin{aligned} x &= 180 - 60 \\ &= 120 \\ x &= 180 + 60 \\ &= 240 \end{aligned}" />
                </div>
                
                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="text-emerald-300">Final Solutions: <strong className="text-white">41.4°, 120°, 240°, 318.6°</strong></p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "compound-angles",
        title: "Compound Angles",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=2086",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Compound angles are formed by adding or subtracting angles, for example <InlineMath math="45^\circ + 30^\circ = 75^\circ" /> or <InlineMath math="45^\circ - 30^\circ = 15^\circ" />.</p>
            <p className="mb-6">Note that <InlineMath math="\sin(A + B) \neq \sin A + \sin B" />. You can verify this by checking that <InlineMath math="\sin(45^\circ + 30^\circ)" /> and <InlineMath math="\sin 45^\circ + \sin 30^\circ" /> give different answers.</p>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
              <h4 className="font-bold text-white text-xl mb-6 text-center">Addition Formulae</h4>
              <div className="space-y-4 max-w-xl mx-auto">
                <BlockMath math="\sin(A \pm B) = \sin A \cos B \pm \cos A \sin B" />
                <BlockMath math="\cos(A \pm B) = \cos A \cos B \mp \sin A \sin B" />
              </div>
              <p className="mt-6 text-sm text-slate-300 text-center">Notice how the signs work: sine keeps the same sign (<InlineMath math="\pm \to \pm" />) while cosine flips the sign (<InlineMath math="\pm \to \mp" />).</p>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The signs behave differently:</strong> <InlineMath math="\cos(A+B) = \cos A\cos B - \sin A\sin B" /> — the sign <em>flips</em> for cosine but matches for sine. Mixing these up is the most common compound-angle error.</li>
              <li><strong>Do not distribute:</strong> <InlineMath math="\sin(A+B)" /> is not <InlineMath math="\sin A + \sin B" />. The formula exists precisely because that shortcut is false.</li>
              <li><strong>Choose angles that give exact values:</strong> for <InlineMath math="75^\circ" /> use <InlineMath math="45^\circ + 30^\circ" /> — both have exact values you know.</li>
              <li><strong>Keep it exact:</strong> in a non-calculator question the answer should be a surd, not a decimal.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "comp-ang-ex1",
            question: <p>Expand and simplify <InlineMath math="\cos(x + 60^\circ)" />.</p>,
            solution: (
              <div className="space-y-4">
                <BlockMath math="\begin{aligned} \cos(x + 60^\circ) &= \cos x \cos 60^\circ - \sin x \sin 60^\circ \\ &= \cos x \cdot \left(\frac{1}{2}\right) - \sin x \cdot \left(\frac{\sqrt{3}}{2}\right) \\ &= \frac{1}{2}\cos x - \frac{\sqrt{3}}{2}\sin x \end{aligned}" />
              </div>
            )
          },
          {
            id: "comp-ang-ex2",
            question: <p>Show that <InlineMath math="\sin(a + b) = \sin a \cos b + \cos a \sin b" /> for <InlineMath math="a = \frac{\pi}{6}" /> and <InlineMath math="b = \frac{\pi}{3}" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>LHS (Left Hand Side):</p>
                <BlockMath math="\begin{aligned} \sin\left(\frac{\pi}{6} + \frac{\pi}{3}\right) &= \sin\left(\frac{\pi}{6} + \frac{2\pi}{6}\right) \\ &= \sin\left(\frac{3\pi}{6}\right) \\ &= \sin\left(\frac{\pi}{2}\right) \\ &= 1 \end{aligned}" />
                <p>RHS (Right Hand Side):</p>
                <BlockMath math="\begin{aligned} &\quad \sin\left(\frac{\pi}{6}\right) \cos\left(\frac{\pi}{3}\right) + \cos\left(\frac{\pi}{6}\right) \sin\left(\frac{\pi}{3}\right) \\ &= \left(\frac{1}{2}\right)\left(\frac{1}{2}\right) + \left(\frac{\sqrt{3}}{2}\right)\left(\frac{\sqrt{3}}{2}\right) \\ &= \frac{1}{4} + \frac{3}{4} \\ &= \frac{4}{4} \\ &= 1 \end{aligned}" />
                <p className="text-emerald-300">LHS = RHS. As required.</p>
              </div>
            )
          },
          {
            id: "comp-ang-ex3",
            question: <p>Find the exact value of <InlineMath math="\sin 75^\circ" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>We can write <InlineMath math="75^\circ" /> as <InlineMath math="45^\circ + 30^\circ" /> to use exact values we know.</p>
                <BlockMath math="\begin{aligned} \sin 75^\circ &= \sin(45^\circ + 30^\circ) \\ &= \sin 45^\circ \cos 30^\circ + \cos 45^\circ \sin 30^\circ \\ &= \left(\frac{1}{\sqrt{2}}\right)\left(\frac{\sqrt{3}}{2}\right) + \left(\frac{1}{\sqrt{2}}\right)\left(\frac{1}{2}\right) \\ &= \frac{\sqrt{3}}{2\sqrt{2}} + \frac{1}{2\sqrt{2}} \\ &= \frac{\sqrt{3} + 1}{2\sqrt{2}} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "using-trigonometric-ratios",
        title: "Using Trigonometric Ratios",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">From previous study of trigonometry, you should be familiar with the following ratios (SOH CAH TOA):</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-8">
               <div className="flex flex-col items-center gap-4">
                 <TrigRatiosRightAngle />
                 <BlockMath math="\sin x = \frac{O}{H} \quad \cos x = \frac{A}{H} \quad \tan x = \frac{O}{A}" />
               </div>
            </div>
            
            <p className="mb-6">Given one of these ratios as a fraction, we can draw a right-angled triangle and use Pythagoras' Theorem to find the third side. We can then state the other two trigonometric ratios.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Draw the right-angled triangle:</strong> from <InlineMath math="\sin A = \tfrac{3}{5}" /> you can build a triangle and read off <InlineMath math="\cos A" /> and <InlineMath math="\tan A" /> directly. This is faster and safer than identities.</li>
              <li><strong>Use Pythagoras for the third side:</strong> and check the quadrant before deciding its sign.</li>
              <li><strong>The quadrant sets the signs:</strong> an acute angle gives everything positive, but if the question restricts the angle elsewhere some ratios turn negative.</li>
              <li><strong>Leave answers as exact fractions:</strong> these questions are almost always non-calculator.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "using-ratios-ex1",
            question: <p>If <InlineMath math="\tan p = \frac{7}{24}" />, state the values of <InlineMath math="\sin p" /> and <InlineMath math="\cos p" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Since <InlineMath math="\tan = \frac{O}{A}" />, we can imagine a right-angled triangle with Opposite = 7 and Adjacent = 24.</p>
                <p>Use Pythagoras to find the Hypotenuse (<InlineMath math="H" />):</p>
                <BlockMath math="\begin{aligned} H^2 &= 7^2 + 24^2 \\ H^2 &= 49 + 576 \\ H^2 &= 625 \\ H &= 25 \end{aligned}" />
                <p>Now we can write the other ratios:</p>
                <BlockMath math="\sin p = \frac{7}{25} \quad \text{and} \quad \cos p = \frac{24}{25}" />
              </div>
            )
          },
          {
            id: "using-ratios-ex2",
            question: <p>Acute angles <InlineMath math="p" /> and <InlineMath math="q" /> are such that <InlineMath math="\sin p = \frac{4}{5}" /> and <InlineMath math="\cos q = \frac{12}{13}" />. Show that <InlineMath math="\sin(p + q) = \frac{63}{65}" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, find the missing sides for both angles using Pythagoras.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 mt-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="font-bold text-white mb-2">For angle p:</p>
                    <p><InlineMath math="\sin p = \frac{4}{5} \left(\frac{O}{H}\right)" /></p>
                    <BlockMath math="\begin{aligned} A^2 &= 5^2 - 4^2 \\ A^2 &= 25 - 16 = 9 \\ A &= 3 \end{aligned}" />
                    <p>So, <InlineMath math="\cos p = \frac{3}{5}" /></p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="font-bold text-white mb-2">For angle q:</p>
                    <p><InlineMath math="\cos q = \frac{12}{13} \left(\frac{A}{H}\right)" /></p>
                    <BlockMath math="\begin{aligned} O^2 &= 13^2 - 12^2 \\ O^2 &= 169 - 144 = 25 \\ O &= 5 \end{aligned}" />
                    <p>So, <InlineMath math="\sin q = \frac{5}{13}" /></p>
                  </div>
                </div>
                
                <p>Now expand <InlineMath math="\sin(p + q)" /> using the compound angle formula:</p>
                <BlockMath math="\begin{aligned} \sin(p + q) &= \sin p \cos q + \cos p \sin q \\ &= \left(\frac{4}{5}\right)\left(\frac{12}{13}\right) + \left(\frac{3}{5}\right)\left(\frac{5}{13}\right) \\ &= \frac{48}{65} + \frac{15}{65} \\ &= \frac{63}{65} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "double-angle-formulae",
        title: "Double Angle Formulae",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=2410",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">We can derive the Double Angle Formulae by replacing <InlineMath math="B" /> with <InlineMath math="A" /> in our addition formulae.</p>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
              <h4 className="font-bold text-white text-xl mb-6">Double Angle Formulae</h4>
              <div className="space-y-4 max-w-xl">
                <BlockMath math="\sin 2A = 2\sin A\cos A" />
                <BlockMath math="\begin{aligned} \cos 2A &= \cos^2 A - \sin^2 A \\ &= 2\cos^2 A - 1 \\ &= 1 - 2\sin^2 A \end{aligned}" />
              </div>
            </div>
            
            <p className="mb-6">The three versions of the <InlineMath math="\cos 2A" /> formula are derived using the National 5 identity <InlineMath math="\sin^2 A + \cos^2 A = 1" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong><InlineMath math="\sin 2x" /> is not <InlineMath math="2\sin x" />:</strong> it is <InlineMath math="2\sin x\cos x" />. The same applies to cosine — doubling the angle is not doubling the function.</li>
              <li><strong>Three versions of <InlineMath math="\cos 2x" />:</strong> pick the one that leaves the equation in a single trig function. Choosing badly turns an easy question into a hard one.</li>
              <li><strong>The formulae work both ways:</strong> you may need to <em>replace</em> <InlineMath math="2\sin x\cos x" /> with <InlineMath math="\sin 2x" /> to simplify an expression.</li>
              <li><strong>They apply to any doubled angle:</strong> <InlineMath math="\sin 4x = 2\sin 2x\cos 2x" />, not just <InlineMath math="2x" />.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "double-ang-ex1",
            question: <p>a) Write down the formula for <InlineMath math="\sin 2x" />.<br />b) Write down the formula for <InlineMath math="\sin 6x" />.</p>,
            solution: (
              <div className="space-y-4">
                <p><strong>a)</strong> <InlineMath math="\sin 2x = 2\sin x \cos x" /></p>
                <p><strong>b)</strong> We can treat <InlineMath math="6x" /> as double <InlineMath math="3x" />. Let <InlineMath math="A = 3x" />:</p>
                <BlockMath math="\sin 6x = 2\sin 3x \cos 3x" />
              </div>
            )
          },
          {
            id: "double-ang-ex2",
            question: <p>Simplify <InlineMath math="\cos^2\left(\frac{\pi}{6}\right) - \sin^2\left(\frac{\pi}{6}\right)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>This matches the structure of <InlineMath math="\cos^2 A - \sin^2 A = \cos 2A" />, where <InlineMath math="A = \frac{\pi}{6}" />.</p>
                <BlockMath math="\begin{aligned} \cos^2\left(\frac{\pi}{6}\right) - \sin^2\left(\frac{\pi}{6}\right) &= \cos\left(2\left(\frac{\pi}{6}\right)\right) \\ &= \cos\left(\frac{2\pi}{6}\right) \\ &= \cos\left(\frac{\pi}{3}\right) \\ &= \frac{1}{2} \end{aligned}" />
              </div>
            )
          },
          {
            id: "double-ang-ex3",
            question: <p>If <InlineMath math="\tan p = \frac{4}{3}" /> for acute angle <InlineMath math="p" />, find the exact values of <InlineMath math="\sin 2p" /> and <InlineMath math="\cos 2p" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>First, set up a right-angled triangle with Opposite = 4, Adjacent = 3.</p>
                <p>Hypotenuse = <InlineMath math="\sqrt{4^2 + 3^2} = \sqrt{16 + 9} = \sqrt{25} = 5" />.</p>
                <p>Therefore, <InlineMath math="\sin p = \frac{4}{5}" /> and <InlineMath math="\cos p = \frac{3}{5}" />.</p>
                
                <div className="border-t border-white/10 pt-4 mt-4">
                  <BlockMath math="\begin{aligned} \sin 2p &= 2\sin p \cos p \\ &= 2\left(\frac{4}{5}\right)\left(\frac{3}{5}\right) \\ &= \frac{24}{25} \end{aligned}" />
                </div>
                
                <div className="border-t border-white/10 pt-4 mt-4">
                  <p>You can use any of the three <InlineMath math="\cos 2A" /> formulae. Let's use <InlineMath math="\cos^2 A - \sin^2 A" />:</p>
                  <BlockMath math="\begin{aligned} \cos 2p &= \cos^2 p - \sin^2 p \\ &= \left(\frac{3}{5}\right)^2 - \left(\frac{4}{5}\right)^2 \\ &= \frac{9}{25} - \frac{16}{25} \\ &= -\frac{7}{25} \end{aligned}" />
                </div>
              </div>
            )
          },
          {
            id: "double-ang-ex4",
            question: <p>Given that <InlineMath math="\cos 2x = \frac{5}{13}" />, find the exact values of <InlineMath math="\sin x" /> and <InlineMath math="\cos x" /> (assume <InlineMath math="x" /> is acute).</p>,
            solution: (
               <div className="space-y-4">
                 <p>Use the double angle formulae that only contain one term:</p>
                 
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4 mb-6">
                   <p className="font-bold text-white mb-2">To find <InlineMath math="\cos x" />:</p>
                   <BlockMath math="\begin{aligned} 2\cos^2 x - 1 &= \frac{5}{13} \\ 2\cos^2 x &= \frac{18}{13} \\ \cos^2 x &= \frac{9}{13} \\ \cos x &= \frac{3}{\sqrt{13}} \end{aligned}" />
                 </div>
                 
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4 mb-6">
                   <p className="font-bold text-white mb-2">To find <InlineMath math="\sin x" />:</p>
                   <BlockMath math="\begin{aligned} 1 - 2\sin^2 x &= \frac{5}{13} \\ 2\sin^2 x &= \frac{8}{13} \\ \sin^2 x &= \frac{4}{13} \\ \sin x &= \frac{2}{\sqrt{13}} \end{aligned}" />
                 </div>
               </div>
            )
          }
        ]
      },
      {
        id: "trigonometric-identities",
        title: "Trigonometric Identities",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=2647",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">You will often be asked to prove trigonometric identities by showing that one side equals the other.</p>
            <p className="mb-6">Useful tools for doing this include:</p>
            <ul className="list-disc list-inside ml-4 space-y-4 mb-8">
               <li>Compound Angle Formulae</li>
               <li>Double Angle Formulae</li>
               <li><InlineMath math="\tan x = \frac{\sin x}{\cos x}" /></li>
               <li><InlineMath math="\sin^2 x + \cos^2 x = 1" /></li>
               <li>Factorising or using common denominators for fractions.</li>
            </ul>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Work on one side only:</strong> start with the more complicated side and transform it until it matches the other. Moving terms across the equals sign assumes what you are trying to prove.</li>
              <li><strong><InlineMath math="\sin^2 x + \cos^2 x = 1" /> is the workhorse:</strong> and its rearrangements <InlineMath math="\sin^2 x = 1 - \cos^2 x" /> and <InlineMath math="\cos^2 x = 1 - \sin^2 x" /> are what let you switch between functions.</li>
              <li><strong>Convert tangent early:</strong> replacing <InlineMath math="\tan x" /> with <InlineMath math="\frac{\sin x}{\cos x}" /> usually unlocks the problem.</li>
              <li><strong>Finish the argument:</strong> end by stating that the two sides are now equal. An unfinished chain of algebra does not read as a proof.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "trig-ident-ex1",
            question: <p>Show that <InlineMath math="\frac{\sin(s + t)}{\cos s \cos t} = \tan s + \tan t" /> for <InlineMath math="\cos s \neq 0" /> and <InlineMath math="\cos t \neq 0" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Start with the LHS and expand the numerator using the addition formula:</p>
                <BlockMath math="LHS = \frac{\sin s \cos t + \cos s \sin t}{\cos s \cos t}" />
                <p>Split the fraction into two parts over the common denominator:</p>
                <BlockMath math="LHS = \frac{\sin s \cos t}{\cos s \cos t} + \frac{\cos s \sin t}{\cos s \cos t}" />
                <p>Cancel common terms in each fraction:</p>
                <BlockMath math="LHS = \frac{\sin s}{\cos s} + \frac{\sin t}{\cos t}" />
                <p>Since <InlineMath math="\tan x = \frac{\sin x}{\cos x}" />:</p>
                <BlockMath math="LHS = \tan s + \tan t = RHS" />
                <p className="text-emerald-300">As completely shown.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "further-trigonometric-equations",
        title: "Further Trigonometric Equations",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=2746",
        theory: (
          <div className="space-y-8 text-lg">
            <p className="mb-6">Trigonometric equations which contain a mixture of double angles (like <InlineMath math="2x" />) and single angles (like <InlineMath math="x" />) require using Double Angle Formulae to find solutions.</p>
            <p className="mb-6">The goal is to substitute the double angle term so that the entire equation is in terms of the same single angle trig function, which often results in a quadratic equation you can factorise.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Never divide by a trig term — factorise it out.</strong> Dividing an equation by <InlineMath math="\cos x" /> <em>loses solutions</em>. Dividing throws away every solution where <InlineMath math="\cos x = 0" />. Take the common factor out and set each factor to zero instead.</li>
                <li><strong>Extract the common factor:</strong> many candidates do not spot one at all. After substituting the double angle formula, always look for a shared <InlineMath math="\sin x" /> or <InlineMath math="\cos x" />.</li>
                <li><strong>Pick the right form of <InlineMath math="\cos 2x" />:</strong> choose whichever of the three versions leaves the equation in one trig function only. Match it to the other term in the equation.</li>
                <li><strong>Give every solution in the domain:</strong> each factor produces its own set of answers. Use a quadrant diagram and check you have them all before you stop.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "further-eq-ex1",
            question: <p>Solve <InlineMath math="\sin 2x^\circ + \sin x^\circ = 0" /> for <InlineMath math="0 \leq x^\circ < 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Replace <InlineMath math="\sin 2x^\circ" /> using the exact formula <InlineMath math="2\sin x^\circ\cos x^\circ" />:</p>
                <BlockMath math="2\sin x^\circ\cos x^\circ + \sin x^\circ = 0" />
                <p>Factorise by taking out the common factor of <InlineMath math="\sin x^\circ" />:</p>
                <BlockMath math="\sin x^\circ(2\cos x^\circ + 1) = 0" />
                <p>This gives two equations to solve:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 mt-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <BlockMath math="\sin x^\circ = 0" />
                    <p className="mt-4">From the sine graph:</p>
                    <BlockMath math="x = 0, 180" />
                    <p className="text-sm text-slate-400">Note: 360 is not in the domain (<InlineMath math="<360" />).</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <BlockMath math="\begin{aligned} 2\cos x^\circ + 1 &= 0 \\ \cos x^\circ &= -\frac{1}{2} \end{aligned}" />
                    <p className="mt-4">Base angle: <InlineMath math="60^\circ" />. Q2, Q3.</p>
                    <BlockMath math="\begin{aligned} x &= 180 - 60 = 120 \\ x &= 180 + 60 = 240 \end{aligned}" />
                  </div>
                </div>
                
                <p className="text-emerald-300">Solutions: <strong className="text-white">0°, 120°, 180°, 240°</strong></p>
              </div>
            )
          },
          {
             id: "further-eq-ex2",
             question: <p>Solve <InlineMath math="\cos 2x = \cos x" /> for <InlineMath math="0 \leq x \leq 2\pi" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>For <InlineMath math="\cos 2x" />, we have three choices. Since the other term is <InlineMath math="\cos x" />, we should pick the formula that only contains cosine: <InlineMath math="2\cos^2 x - 1" />.</p>
                 <BlockMath math="\begin{aligned} 2\cos^2 x - 1 &= \cos x \\ 2\cos^2 x - \cos x - 1 &= 0 \end{aligned}" />
                 <p>Factorise (let <InlineMath math="u = \cos x" />):</p>
                 <BlockMath math="(2\cos x + 1)(\cos x - 1) = 0" />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 mt-6">
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <BlockMath math="\begin{aligned} 2\cos x + 1 &= 0 \\ \cos x &= -\frac{1}{2} \end{aligned}" />
                     <p className="mt-4">Base angle: <InlineMath math="\frac{\pi}{3}" />. Q2, Q3.</p>
                     <BlockMath math="\begin{aligned} x &= \pi - \frac{\pi}{3} = \frac{2\pi}{3} \\ x &= \pi + \frac{\pi}{3} = \frac{4\pi}{3} \end{aligned}" />
                   </div>
                   
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <BlockMath math="\cos x = 1" />
                     <p className="mt-4">From the cosine graph:</p>
                     <BlockMath math="x = 0, 2\pi" />
                   </div>
                 </div>
                 
                 <p className="text-emerald-300">Solutions: <strong className="text-white"><InlineMath math="0" />, <InlineMath math="\frac{2\pi}{3}" />, <InlineMath math="\frac{4\pi}{3}" />, <InlineMath math="2\pi" /></strong></p>
               </div>
             )
          },
          {
             id: "further-eq-ex3",
             question: <p>Find the points of intersection of the graphs <InlineMath math="y = 3\sin 2x + 1" /> and <InlineMath math="y = 2\sin x + 1" /> for <InlineMath math="0 \leq x \leq 2\pi" />.</p>,
             solution: (
                <div className="space-y-4">
                  <p>Set them equal to find the intersection points:</p>
                  <BlockMath math="\begin{aligned} 3\sin 2x + 1 &= 2\sin x + 1 \\ 3\sin 2x &= 2\sin x \end{aligned}" />
                  <p>Substitute <InlineMath math="\sin 2x = 2\sin x\cos x" />:</p>
                  <BlockMath math="\begin{aligned} 3(2\sin x\cos x) &= 2\sin x \\ 6\sin x\cos x - 2\sin x &= 0 \end{aligned}" />
                  <p>Factorise by taking out <InlineMath math="2\sin x" />:</p>
                  <BlockMath math="2\sin x(3\cos x - 1) = 0" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 mt-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <BlockMath math="\begin{aligned} 2\sin x &= 0 \\ \sin x &= 0 \end{aligned}" />
                      <p className="mt-4">From the sine graph:</p>
                      <BlockMath math="x = 0, \pi, 2\pi" />
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <BlockMath math="\begin{aligned} 3\cos x - 1 &= 0 \\ \cos x &= \frac{1}{3} \end{aligned}" />
                      <p className="mt-4">Base angle <InlineMath math="\approx 1.231" /> rad. Q1, Q4.</p>
                      <BlockMath math="\begin{aligned} x &= 1.231 \\ x &= 2\pi - 1.231 = 5.052 \end{aligned}" />
                    </div>
                  </div>
                  
                  <p>Usually, "points of intersection" requires coordinates. Substitute these x-values back into either original equation (e.g., <InlineMath math="y = 2\sin x + 1" />) to find y-coordinates.</p>
                  <ul className="list-disc list-inside ml-4 mt-2 mb-4 text-emerald-300">
                     <li>When <InlineMath math="x = 0" />, <InlineMath math="y = 2(0) + 1 = 1" />. Point: <strong className="text-white"><InlineMath math="(0, 1)" /></strong></li>
                     <li>When <InlineMath math="x = \pi" />, <InlineMath math="y = 2(0) + 1 = 1" />. Point: <strong className="text-white"><InlineMath math="(\pi, 1)" /></strong></li>
                     <li>When <InlineMath math="x = 2\pi" />, <InlineMath math="y = 2(0) + 1 = 1" />. Point: <strong className="text-white"><InlineMath math="(2\pi, 1)" /></strong></li>
                     <li>When <InlineMath math="x = 1.231" />, <InlineMath math="\sin(1.231) = \sqrt{1 - (1/3)^2} = \frac{\sqrt{8}}{3}" />. <InlineMath math="y = 2(\frac{\sqrt{8}}{3}) + 1 = \frac{2\sqrt{8}+3}{3} \approx 2.89" />. Point: <strong className="text-white"><InlineMath math="(1.231, 2.89)" /></strong></li>
                     <li>When <InlineMath math="x = 5.052" />, <InlineMath math="\sin(5.052) = -\frac{\sqrt{8}}{3}" />. <InlineMath math="y = 2(-\frac{\sqrt{8}}{3}) + 1 = \frac{3-2\sqrt{8}}{3} \approx -0.89" />. Point: <strong className="text-white"><InlineMath math="(5.052, -0.89)" /></strong></li>
                  </ul>
                </div>
             )
          }
        ]
      },
{
        id: "solving-simultaneous-equations",
        title: "Solving Simultaneous Equations",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=3163",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>You are already familiar with some wave functions, namely <InlineMath math="f(x)=\sin x" /> and <InlineMath math="f(x)=\cos x" />.</p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center my-6">
              <SineWaveGraph />
              <CosineWaveGraph />
            </div>
            <p>We can add these functions together, if they have the same period, to obtain <InlineMath math="f(x)=\sin x+\cos x" />.</p>
            <div className="flex justify-center my-6">
              <SineAddCosineWaveGraph />
            </div>
            <p>This is also a wave function. You can see the amplitude has changed here and there is a phase shift.</p>
            <p>We could also express this graph in the following forms:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li><InlineMath math="f(x)=k \sin(x-\alpha)" /></li>
              <li><InlineMath math="f(x)=k \sin(x+\alpha)" /></li>
              <li><InlineMath math="f(x)=k \cos(x-\alpha)" /></li>
              <li><InlineMath math="f(x)=k \cos(x+\alpha)" /></li>
            </ul>
            <p>We are required to solve simultaneous equations of the form:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\begin{aligned} k \sin\alpha &= a \\ k \cos\alpha &= b \end{aligned}" />
            </div>
            <p>Solving for <InlineMath math="k" />:</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <BlockMath math="\begin{aligned} (k \sin\alpha)^2 &= a^2 \\ k^2 \sin^2\alpha &= a^2 \end{aligned}" />
              <BlockMath math="k^2 \sin^2\alpha + k^2 \cos^2\alpha = a^2 + b^2" />
              <BlockMath math="k^2 (\sin^2\alpha + \cos^2\alpha) = a^2 + b^2" />
              <BlockMath math="k^2 \times 1 = a^2 + b^2" />
              <BlockMath math="k^2 = a^2 + b^2" />
              <BlockMath math="k = \sqrt{a^2 + b^2}" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Divide to eliminate <InlineMath math="k" />:</strong> dividing one equation by the other cancels <InlineMath math="k" /> and leaves a tangent, which is what gives you the angle.</li>
              <li><strong>Square and add for <InlineMath math="k" />:</strong> using <InlineMath math="\sin^2 + \cos^2 = 1" /> gives <InlineMath math="k^2" /> directly. Always take the positive root.</li>
              <li><strong>The signs fix the quadrant:</strong> the angle is decided by the signs of the two right-hand sides, not by the calculator value of the inverse tangent.</li>
              <li><strong>Keep the working consistent:</strong> set the two equations out clearly and label them, so each later line plainly follows from them.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "simult-eq-ex1",
            question: <p>Solve the following for <InlineMath math="k > 0" /> and <InlineMath math="0 < \alpha < 360^\circ" />:<br/><InlineMath math="k \sin\alpha = \sqrt{3}" /><br/><InlineMath math="k \cos\alpha = 1" /></p>,
            solution: (
              <div className="space-y-4">
                <p>1. Find <InlineMath math="k" />:</p>
                <BlockMath math="\begin{aligned} k &= \sqrt{(\sqrt{3})^2 + 1^2} \\ &= \sqrt{3 + 1} \\ &= \sqrt{4} \\ &= 2 \end{aligned}" />
                <p>2. Find <InlineMath math="\alpha" /> by dividing <InlineMath math="k \sin\alpha" /> by <InlineMath math="k \cos\alpha" />:</p>
                <BlockMath math="\begin{aligned} \frac{k\sin\alpha}{k\cos\alpha} &= \frac{\sqrt{3}}{1} \\ \tan\alpha &= \sqrt{3} \end{aligned}" />
                <p>Base angle <InlineMath math="\alpha = \tan^{-1}(\sqrt{3}) = 60^\circ" />.</p>
                <p>Check quadrants: <InlineMath math="\sin\alpha" /> is positive (+), <InlineMath math="\cos\alpha" /> is positive (+). They are both positive in Quadrant 1, so <InlineMath math="\alpha = 60^\circ" />.</p>
                <p className="text-emerald-300">Solution: <strong className="text-white"><InlineMath math="k = 2, \alpha = 60^\circ" /></strong></p>
              </div>
            )
          }
        ]
      },
      {
        id: "using-addition-formula",
        title: "Using the Addition Formula",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=2086",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Given a function of the form <InlineMath math="a\sin x + b\cos x" />, it is useful to express this as a single function rather than the sum of two separate functions.</p>
            <p>A single function would allow us to calculate maximum and minimum values of expressions of the form <InlineMath math="a\sin x + b\cos x" />, sketch graphs more easily and solve equations involving expressions of this form.</p>
            <p>We previously studied the addition formulae, and this will help to express sums of two separate functions as single functions.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Expand the target, not the question:</strong> write out the addition formula for the form you have been asked for, then compare it with the expression you were given.</li>
              <li><strong>Match the right terms:</strong> line the <InlineMath math="\cos x" /> terms up with the <InlineMath math="\cos x" /> terms. Comparing them the wrong way round swaps your <InlineMath math="a" /> and <InlineMath math="b" />.</li>
              <li><strong>Use the form the question specifies:</strong> <InlineMath math="k\cos(x-\alpha)" /> and <InlineMath math="k\sin(x+\alpha)" /> give different values of <InlineMath math="\alpha" />. Answering in a different form loses marks even if the maths is sound.</li>
              <li><strong>Show the comparison step:</strong> the marks are for equating the coefficients, so write that line down.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "add-form-ex1",
            question: <p>Create two equations for <InlineMath math="4\cos x + 3\sin x" /> using the expansion for <InlineMath math="k\cos(x - \alpha)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. Expand <InlineMath math="k\cos(x - \alpha)" />:</p>
                <BlockMath math="k\cos(x - \alpha) = k\cos x\cos\alpha + k\sin x\sin\alpha" />
                <p>2. Equate to the given expression:</p>
                <BlockMath math="k\cos\alpha\cos x + k\sin\alpha\sin x = 4\cos x + 3\sin x" />
                <p>3. Equate coefficients of <InlineMath math="\cos x" /> and <InlineMath math="\sin x" />:</p>
                <BlockMath math="\begin{aligned} k\cos\alpha &= 4 \\ k\sin\alpha &= 3 \end{aligned}" />
              </div>
            )
          },
          {
            id: "add-form-ex2",
            question: <p>Create two equations for <InlineMath math="2\sin x - 3\cos x" /> using the expansion for <InlineMath math="k\sin(x + \alpha)" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. Expand <InlineMath math="k\sin(x + \alpha)" />:</p>
                <BlockMath math="k\sin(x + \alpha) = k\sin x\cos\alpha + k\cos x\sin\alpha" />
                <p>2. Equate to the given expression:</p>
                <BlockMath math="k\cos\alpha\sin x + k\sin\alpha\cos x = 2\sin x - 3\cos x" />
                <p>3. Equate coefficients of <InlineMath math="\sin x" /> and <InlineMath math="\cos x" />:</p>
                <BlockMath math="\begin{aligned} k\cos\alpha &= 2 \\ k\sin\alpha &= -3 \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "wave-function",
        title: "Wave Function",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=3163",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We can combine everything learned so far to rewrite trigonometric sums as a single wave function.</p>
            <p>The point is this: an expression like <InlineMath math="a\sin x^\circ + b\cos x^\circ" /> is the sum of <em>two</em> waves, which is awkward to work with. It can always be rewritten as a <strong>single</strong> wave — and once it is, the maximum, the minimum and the solutions of equations can all be read off almost immediately.</p>
            <p>There are four possible target forms, and the question will always tell you which one to use:</p>
            <BlockMath math="k\sin(x + \alpha)^\circ \qquad k\sin(x - \alpha)^\circ \qquad k\cos(x + \alpha)^\circ \qquad k\cos(x - \alpha)^\circ" />
            <p>The method is the same every time: <strong>expand the target form</strong> using the appropriate addition formula, then <strong>equate coefficients</strong> with the expression you were given. Taking <InlineMath math="k\cos(x - \alpha)^\circ" /> as the example:</p>
            <BlockMath math="k\cos(x - \alpha)^\circ = k\cos x^\circ\cos\alpha^\circ + k\sin x^\circ\sin\alpha^\circ" />
            <p>Comparing that with <InlineMath math="a\cos x^\circ + b\sin x^\circ" /> gives two equations:</p>
            <BlockMath math="k\cos\alpha^\circ = a \qquad\text{and}\qquad k\sin\alpha^\circ = b" />
            <p><strong>Finding <InlineMath math="k" />:</strong> square both equations and add them. Because <InlineMath math="\cos^2\alpha^\circ + \sin^2\alpha^\circ = 1" />, this leaves</p>
            <BlockMath math="k^2 = a^2 + b^2 \quad\Longrightarrow\quad k = \sqrt{a^2 + b^2}" />
            <p>Always take the positive root — <InlineMath math="k" /> is an amplitude.</p>
            <p><strong>Finding <InlineMath math="\alpha" />:</strong> divide one equation by the other, so that <InlineMath math="k" /> cancels:</p>
            <BlockMath math="\frac{k\sin\alpha^\circ}{k\cos\alpha^\circ} = \tan\alpha^\circ = \frac{b}{a}" />
            <p>On its own <InlineMath math="\tan^{-1}" /> cannot tell you which angle you want — it only ever returns one of two possibilities. The quadrant is decided by the <strong>signs</strong> of <InlineMath math="k\sin\alpha^\circ" /> and <InlineMath math="k\cos\alpha^\circ" />; since <InlineMath math="k" /> is positive, those are simply the signs of <InlineMath math="b" /> and <InlineMath math="a" />. Both positive puts <InlineMath math="\alpha" /> in the first quadrant, and so on round the CAST diagram.</p>
            <p><strong>The Golden Rule:</strong> find <InlineMath math="k" /> by squaring and adding, find <InlineMath math="\alpha" /> by dividing — then let the <em>signs</em> of the two equations, not your calculator, decide the quadrant.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The quadrant is the marks:</strong> <InlineMath math="\tan^{-1}" /> returns only one of two possible angles. Read the <em>signs</em> of <InlineMath math="k\cos\alpha" /> and <InlineMath math="k\sin\alpha" /> and use CAST — taking the calculator value on trust is the most common error in the topic.</li>
                <li><strong>Match the form you were asked for:</strong> <InlineMath math="k\cos(x-\alpha)" /> and <InlineMath math="k\sin(x+\alpha)" /> give different values of <InlineMath math="\alpha" />. Expand the form the question specifies, not the one you find easiest.</li>
                <li><strong>Equate coefficients, and show it:</strong> the marks are for lining up the <InlineMath math="\cos x" /> and <InlineMath math="\sin x" /> terms. Write that comparison down as its own line.</li>
                <li><strong>Take the positive root for <InlineMath math="k" />:</strong> it is an amplitude, so it is never negative.</li>
                <li><strong>Watch the units:</strong> if the question is set in radians, <InlineMath math="\alpha" /> must be in radians too — mixing them within a line of working is a frequent and expensive error.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "wave-func-ex1",
            question: <p>Write <InlineMath math="5\cos x^\circ + 12\sin x^\circ" /> in the form <InlineMath math="k\cos(x - \alpha)^\circ" /> where <InlineMath math="k > 0" /> and <InlineMath math="0 \leq \alpha^\circ \leq 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Expand <InlineMath math="k\cos(x - \alpha)" /> and equate coefficients:</p>
                <BlockMath math="k\cos(x - \alpha) = k\cos x^\circ\cos\alpha^\circ + k\sin x^\circ\sin\alpha^\circ" />
                <BlockMath math="\begin{aligned} k\cos\alpha &= 5 \\ k\sin\alpha &= 12 \end{aligned}" />
                <p>Find <InlineMath math="k" />:</p>
                <BlockMath math="k = \sqrt{5^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13" />
                <p>Find <InlineMath math="\alpha" />:</p>
                <BlockMath math="\tan\alpha = \frac{k\sin\alpha}{k\cos\alpha} = \frac{12}{5}" />
                <p>Base angle: <InlineMath math="\tan^{-1}\left(\frac{12}{5}\right) \approx 67.4^\circ" />.</p>
                <p>Since <InlineMath math="\sin\alpha > 0" /> and <InlineMath math="\cos\alpha > 0" />, it's in the first quadrant, so <InlineMath math="\alpha = 67.4^\circ" />.</p>
                <p>Final wave function:</p>
                <BlockMath math="13\cos(x - 67.4)^\circ" />
              </div>
            )
          },
          {
            id: "wave-func-ex2",
            question: <p>Write <InlineMath math="5\cos x - 3\sin x" /> in the form <InlineMath math="k\cos(x - \alpha)" /> where <InlineMath math="k > 0" /> and <InlineMath math="0 \leq \alpha \leq 2\pi" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Expand <InlineMath math="k\cos(x - \alpha)" /> and equate coefficients:</p>
                <BlockMath math="k\cos(x - \alpha) = k\cos x\cos\alpha + k\sin x\sin\alpha" />
                <BlockMath math="\begin{aligned} k\cos\alpha &= 5 \\ k\sin\alpha &= -3 \end{aligned}" />
                <p>Find <InlineMath math="k" />:</p>
                <BlockMath math="k = \sqrt{5^2 + (-3)^2} = \sqrt{25 + 9} = \sqrt{34}" />
                <p>Find <InlineMath math="\alpha" />:</p>
                <BlockMath math="\tan\alpha = \frac{-3}{5}" />
                <p>Base angle: <InlineMath math="\tan^{-1}\left(\frac{3}{5}\right) \approx 0.540" /> rad.</p>
                <p><InlineMath math="\cos\alpha > 0" /> (Q1, Q4), <InlineMath math="\sin\alpha < 0" /> (Q3, Q4). Both are true in Q4.</p>
                <BlockMath math="\alpha = 2\pi - 0.540 = 5.743 \text{ rad}" />
                <p>Final wave function:</p>
                <BlockMath math="\sqrt{34}\cos(x - 5.743)" />
              </div>
            )
          },
          {
            id: "wave-func-ex3",
            question: <p>Write <InlineMath math="4\cos x^\circ + 3\sin x^\circ" /> in the form <InlineMath math="k\sin(x + \alpha)^\circ" /> where <InlineMath math="k > 0" /> and <InlineMath math="0 \leq \alpha^\circ \leq 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Expand <InlineMath math="k\sin(x + \alpha)" /> and equate coefficients:</p>
                <BlockMath math="k\sin(x + \alpha)^\circ = k\sin x^\circ\cos\alpha^\circ + k\cos x^\circ\sin\alpha^\circ" />
                <p>Rearrange the given expression to match <InlineMath math="\sin" /> first: <InlineMath math="3\sin x^\circ + 4\cos x^\circ" /></p>
                <BlockMath math="\begin{aligned} k\cos\alpha &= 3 \\ k\sin\alpha &= 4 \end{aligned}" />
                <p>Find <InlineMath math="k" />:</p>
                <BlockMath math="k = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5" />
                <p>Find <InlineMath math="\alpha" />:</p>
                <BlockMath math="\tan\alpha = \frac{4}{3}" />
                <p>Base angle: <InlineMath math="\tan^{-1}\left(\frac{4}{3}\right) \approx 53.1^\circ" />. Q1.</p>
                <p>Final wave function:</p>
                <BlockMath math="5\sin(x + 53.1)^\circ" />
              </div>
            )
          }
        ]
      },
      {
        id: "wave-function-multiple-angles",
        title: "Multiple Angles",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=3658",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The wave function method works exactly the same if there are multiple angles inside the trigonometric functions, as long as both terms have the same multiple angle.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The method is unchanged:</strong> treat <InlineMath math="2x" /> exactly as you would treat <InlineMath math="x" /> — compare coefficients and find <InlineMath math="k" /> and <InlineMath math="\alpha" /> in the usual way.</li>
              <li><strong><InlineMath math="\alpha" /> belongs to the whole bracket:</strong> the answer is <InlineMath math="k\cos(2x - \alpha)" />, not <InlineMath math="k\cos 2(x - \alpha)" />, unless you deliberately factorise.</li>
              <li><strong>Widen the domain when solving:</strong> if you go on to solve an equation, the multiple angle needs the extended range just as it does elsewhere.</li>
              <li><strong>The period changes, the amplitude does not:</strong> <InlineMath math="k" /> is still <InlineMath math="\sqrt{a^2+b^2}" />.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "wave-multi-ang-ex1",
            question: <p>Write <InlineMath math="5\cos 2x^\circ + 12\sin 2x^\circ" /> in the form <InlineMath math="k\sin(2x + \alpha)^\circ" /> where <InlineMath math="k > 0" /> and <InlineMath math="0 \leq \alpha^\circ \leq 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>Expand <InlineMath math="k\sin(2x + \alpha)" /> and equate coefficients:</p>
                <BlockMath math="k\sin(2x + \alpha)^\circ = k\sin 2x^\circ\cos\alpha^\circ + k\cos 2x^\circ\sin\alpha^\circ" />
                <p>Rearrange given: <InlineMath math="12\sin 2x^\circ + 5\cos 2x^\circ" /></p>
                <BlockMath math="\begin{aligned} k\cos\alpha &= 12 \\ k\sin\alpha &= 5 \end{aligned}" />
                <p>Find <InlineMath math="k" />:</p>
                <BlockMath math="k = \sqrt{12^2 + 5^2} = \sqrt{144 + 25} = 13" />
                <p>Find <InlineMath math="\alpha" />:</p>
                <BlockMath math="\tan\alpha = \frac{5}{12}" />
                <p>Base angle: <InlineMath math="\tan^{-1}\left(\frac{5}{12}\right) \approx 22.6^\circ" />. Q1.</p>
                <p>Final expression:</p>
                <BlockMath math="13\sin(2x + 22.6)^\circ" />
              </div>
            )
          }
        ]
      },
      {
        id: "wave-function-min-max",
        title: "Minimum and Maximum Values",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=3674",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>By expressing <InlineMath math="f(x) = p\cos x + q\sin x" /> as a single trigonometric function, we can find the minimum and maximum values of the function and the corresponding angles at which these values occur.</p>
            <p>It is useful to remember the minimum and maximum values of <InlineMath math="f(x) = \sin x" /> and <InlineMath math="f(x) = \cos x" />.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 justify-items-center">
              <MinMaxSineGraph radians={false} />
              <MinMaxCosineGraph radians={false} />
              <MinMaxSineGraph radians={true} />
              <MinMaxCosineGraph radians={true} />
            </div>

            <ul className="list-disc list-inside ml-4">
              <li><InlineMath math="\sin x" /> reaches its maximum of 1 at <InlineMath math="90^\circ (\pi/2)" /> and its minimum of -1 at <InlineMath math="270^\circ (3\pi/2)" />.</li>
              <li><InlineMath math="\cos x" /> reaches its maximum of 1 at <InlineMath math="0^\circ" /> or <InlineMath math="360^\circ (2\pi)" /> and its minimum of -1 at <InlineMath math="180^\circ (\pi)" />.</li>
            </ul>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Read them straight off:</strong> once in the form <InlineMath math="k\cos(x-\alpha)" />, the maximum is <InlineMath math="k" /> and the minimum is <InlineMath math="-k" />. No calculus is needed, and using calculus here wastes time.</li>
              <li><strong>Give the value <em>and</em> where it happens if asked:</strong> the maximum occurs when the bracket is zero, so <InlineMath math="x = \alpha" />. Read whether the question wants the value, the angle, or both.</li>
              <li><strong>A vertical shift moves both:</strong> for <InlineMath math="k\cos(x-\alpha) + d" /> the maximum is <InlineMath math="k + d" /> and the minimum is <InlineMath math="-k + d" />.</li>
              <li><strong>Check the answer sits in the domain:</strong> if the stated range does not include <InlineMath math="x = \alpha" />, the maximum will be at an end of the interval instead.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "wave-min-max-ex1",
            question: <p>Write <InlineMath math="\cos x + 4\sin x" /> in the form <InlineMath math="k\cos(x - \alpha)" /> where <InlineMath math="k > 0" /> and <InlineMath math="0 \leq \alpha \leq 2\pi" />, and state the minimum and maximum values and the values of <InlineMath math="x" /> at which they occur.</p>,
            solution: (
               <div className="space-y-4">
                 <p>1. Rewrite</p>
                 <BlockMath math="k\cos(x - \alpha) = k\cos x\cos\alpha + k\sin x\sin\alpha" />
                 <BlockMath math="\begin{aligned} k\cos\alpha &= 1 \\ k\sin\alpha &= 4 \end{aligned}" />
                 <BlockMath math="k = \sqrt{1^2 + 4^2} = \sqrt{17}" />
                 <BlockMath math="\tan\alpha = \frac{4}{1} = 4" />
                 <p>Base angle <InlineMath math="\alpha \approx 1.326" /> rad (Q1). Then the function is <InlineMath math="\sqrt{17}\cos(x - 1.326)" />.</p>
                 <p>2. Maximum and minimum:</p>
                 <p>Max value is <InlineMath math="\sqrt{17}" />, Min value is <InlineMath math="-\sqrt{17}" />.</p>
                 <p>Max occurs when <InlineMath math="\cos(x - 1.326) = 1" />. From graph, <InlineMath math="\cos 0 = 1" />.</p>
                 <BlockMath math="\begin{aligned} x - 1.326 &= 0 \\ x &= 1.326 \end{aligned}" />
                 <p>Min occurs when <InlineMath math="\cos(x - 1.326) = -1" />. From graph, <InlineMath math="\cos\pi = -1" />.</p>
                 <BlockMath math="\begin{aligned} x - 1.326 &= \pi \\ x &= \pi + 1.326 \\ x &\approx 4.468 \end{aligned}" />
               </div>
            )
          }
        ]
      },
      {
        id: "wave-function-sketching",
        title: "Sketching Graphs",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=4067",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Once you have converted <InlineMath math="a\sin x + b\cos x" /> into a single wave form, such as <InlineMath math="k\cos(x - \alpha)" />, sketch it by applying the phase shift <InlineMath math="\alpha" /> to the <InlineMath math="\cos" /> or <InlineMath math="\sin" /> curve multiplied by amplitude <InlineMath math="k" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>This is one of the lowest-scoring questions in the course.</strong> <em>Most</em> candidates gain no marks at all on the sketching part. The three points below are exactly what goes wrong.</li>
                <li><strong>Translate the right way:</strong> shifting the graph in the wrong direction is the most common error. In <InlineMath math="k\cos(x - \alpha)" /> the graph moves <strong>right</strong> by <InlineMath math="\alpha" />; a <InlineMath math="+\alpha" /> moves it left.</li>
                <li><strong>Check both ends of the domain:</strong> very few candidates consider the height of the graph at each end. Substitute the first and last <InlineMath math="x" /> values of the stated domain and plot those points — the curve rarely starts or finishes at a maximum.</li>
                <li><strong>Mark the key features:</strong> maximum <InlineMath math="k" />, minimum <InlineMath math="-k" />, and the roots. Use the axes provided, and the scale printed on them.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "wave-sketch-ex1",
            question: <p>Sketch the graph of <InlineMath math="y = \sin x^\circ + \sqrt{3}\cos x^\circ" /> for <InlineMath math="0 \leq x^\circ \leq 360" />.</p>,
            solution: (
              <div className="space-y-4">
                <p>1. Convert to a single valid form, e.g., <InlineMath math="k\cos(x - \alpha)" />.</p>
                <BlockMath math="k\cos(x - \alpha) = k\cos x^\circ\cos\alpha^\circ + k\sin x^\circ\sin\alpha^\circ" />
                <BlockMath math="\begin{aligned} k\cos\alpha &= \sqrt{3} \\ k\sin\alpha &= 1 \end{aligned}" />
                <BlockMath math="k = \sqrt{(\sqrt{3})^2 + 1^2} = \sqrt{3 + 1} = \sqrt{4} = 2" />
                <BlockMath math="\tan\alpha = \frac{1}{\sqrt{3}} \implies \alpha = 30^\circ \text{ (Q1)}" />
                <p>Equation is <InlineMath math="y = 2\cos(x - 30^\circ)" />.</p>
                <p>2. Properties of the curve:</p>
                <ul className="list-disc list-inside">
                   <li>Max value: 2 (occurs when <InlineMath math="x - 30 = 0 \implies x = 30^\circ" />)</li>
                   <li>Min value: -2 (occurs when <InlineMath math="x - 30 = 180 \implies x = 210^\circ" />)</li>
                   <li>Roots: <InlineMath math="\cos(x - 30) = 0 \implies x - 30 = 90 \implies x = 120^\circ" /> and <InlineMath math="x - 30 = 270 \implies x = 300^\circ" /></li>
                   <li>y-intercept: let <InlineMath math="x = 0" />, <InlineMath math="y = 2\cos(-30^\circ) = \sqrt{3} \approx 1.73" /></li>
                </ul>
              </div>
             )
          }
        ]
      },
      {
        id: "wave-function-solving-equations",
        title: "Solving Equations",
        videoUrl: "https://www.youtube.com/embed/AvgXvkloPps?start=4311",
        theory: (
          <div className="space-y-4 text-slate-300">
             <p>A composite trigonometric equation can be solved using the wave function format. Once compiled as <InlineMath math="k\cos(x - \alpha) = c" />, it acts like solving standard basic trigonometric equations.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Convert first, then solve:</strong> you cannot solve <InlineMath math="a\sin x + b\cos x = c" /> directly. Rewrite it as a single wave, then treat it as a basic equation.</li>
              <li><strong>Adjust the domain for the bracket:</strong> if you are solving for <InlineMath math="x - \alpha" />, shift the domain by <InlineMath math="\alpha" /> before finding solutions, then shift back.</li>
              <li><strong>Give every solution:</strong> there are normally two in a revolution. Use CAST on the bracket, not on <InlineMath math="x" />.</li>
              <li><strong>Check for no solutions:</strong> if <InlineMath math="c" /> is larger than <InlineMath math="k" />, there are none — say so rather than forcing an answer.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "wave-solve-ex1",
            question: <p>Solve <InlineMath math="5\cos x^\circ + \sin x^\circ = 2" /> for <InlineMath math="0 \leq x^\circ \leq 360" />.</p>,
            solution: (
              <div className="space-y-4">
                 <p>Write <InlineMath math="5\cos x^\circ + \sin x^\circ" /> using <InlineMath math="k\cos(x - \alpha)^\circ" />.</p>
                 <BlockMath math="\begin{aligned} k\cos\alpha &= 5 \\ k\sin\alpha &= 1 \end{aligned}" />
                 <BlockMath math="k = \sqrt{5^2 + 1^2} = \sqrt{26}" />
                 <BlockMath math="\tan\alpha = \frac{1}{5} \implies \alpha \approx 11.3^\circ" />
                 <p>So the equation becomes:</p>
                 <BlockMath math="\begin{aligned} \sqrt{26}\cos(x - 11.3)^\circ &= 2 \\ \cos(x - 11.3)^\circ &= \frac{2}{\sqrt{26}} \end{aligned}" />
                 <p>Base angle: <InlineMath math="\cos^{-1}\left(\frac{2}{\sqrt{26}}\right) \approx 66.9^\circ" />. Q1, Q4 (Cosine is positive).</p>
                 <BlockMath math="\begin{aligned} x - 11.3 &= 66.9 \\ x &= 78.2^\circ \\ \\ x - 11.3 &= 360 - 66.9 = 293.1 \\ x &= 304.4^\circ \end{aligned}" />
              </div>
            )
          },
          {
             id: "wave-solve-ex2",
             question: <p>Solve <InlineMath math="2\cos 2x + \sin 2x = 1" /> for <InlineMath math="0 \leq x \leq 2\pi" />.</p>,
             solution: (
               <div className="space-y-4">
                  <p>Write <InlineMath math="2\cos 2x + \sin 2x" /> as <InlineMath math="k\cos(2x - \alpha)" />.</p>
                  <BlockMath math="\begin{aligned} k\cos\alpha &= 2 \\ k\sin\alpha &= 1 \end{aligned}" />
                  <BlockMath math="k = \sqrt{2^2 + 1^2} = \sqrt{5}" />
                  <BlockMath math="\tan\alpha = \frac{1}{2} \implies \alpha \approx 0.464 \text{ rad}" />
                  <p>So the equation becomes:</p>
                  <BlockMath math="\begin{aligned} \sqrt{5}\cos(2x - 0.464) &= 1 \\ \cos(2x - 0.464) &= \frac{1}{\sqrt{5}} \end{aligned}" />
                  <p>Since Domain <InlineMath math="0 \leq x \leq 2\pi" />, then <InlineMath math="2x" /> goes up to <InlineMath math="4\pi" /> (two cycles).</p>
                  <p>Base angle: <InlineMath math="\cos^{-1}\left(\frac{1}{\sqrt{5}}\right) \approx 1.107" /> rad. Q1, Q4.</p>
                  <BlockMath math="\begin{aligned} 2x - 0.464 &= 1.107, 2\pi - 1.107 \\ &= 1.107, 5.176 \\ 2x - 0.464 &= 1.107 + 2\pi, \quad 5.176 + 2\pi \\ &= 7.390, 11.459 \\ \\ 2x &= 1.571 , 5.64 , 7.854 , 11.923 \\ x &= 0.785 (\text{or } \frac{\pi}{4}), 2.82, 3.927 (\text{or } \frac{5\pi}{4}), 5.96 \end{aligned}" />
               </div>
             )
          }
        ]
      }
    ]
  },
  {
    id: "exponentials-and-logarithms",
    title: "Exponentials & Logarithms",
    topics: [
      {
        id: "properties-of-logarithmic-functions",
        title: "Properties of Logarithmic Functions",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=551",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>A logarithmic function is a function of the form <InlineMath math="f(x) = \log_a x" /> where <InlineMath math="a>0" /> and <InlineMath math="x>0" />.</p>
            <p>The relationship between exponential functions and logarithmic functions can be expressed as:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="y = \log_a x \iff a^y = x" />
            </div>
            <p>If we sum logarithmic functions with the same base numbers then the terms can be combined by multiplying the arguments:</p>
            <BlockMath math="\log_a x + \log_a y = \log_a(xy)" />
            <p>If we subtract logarithmic functions with the same base numbers, then the terms can be combined by dividing the arguments:</p>
            <BlockMath math="\log_a x - \log_a y = \log_a \left(\frac{x}{y}\right)" />
            <p>If the argument of a logarithmic function is raised to a power, then this equates to the product of the exponent and the logarithmic function:</p>
            <BlockMath math="\log_a (x^n) = n \log_a x" />
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The bases must match:</strong> the log laws only apply to logarithms of the same base. Terms with different bases cannot be combined at all.</li>
              <li><strong><InlineMath math="\log(a+b)" /> is not <InlineMath math="\log a + \log b" />:</strong> the addition law works the other way — a <em>sum of logs</em> becomes a log of a <em>product</em>.</li>
              <li><strong>Switching forms is the core skill:</strong> being unable to move between <InlineMath math="a^y = x" /> and <InlineMath math="\log_a x = y" /> is the most repeated failure in this whole topic.</li>
              <li><strong>Keep the argument positive:</strong> check any answer back in the original expression and reject values that make a log undefined.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "log-props-ex1",
             question: <p>Simplify <InlineMath math="\log_a 3 + \log_a 6" /></p>,
             solution: <BlockMath math="\log_a 3 + \log_a 6 = \log_a(3 \times 6) = \log_a 18" />
          },
          {
             id: "log-props-ex2",
             question: <p>Simplify <InlineMath math="\log_a 15 - \log_a 3" /></p>,
             solution: <BlockMath math="\log_a 15 - \log_a 3 = \log_a\left(\frac{15}{3}\right) = \log_a 5" />
          },
          {
             id: "log-props-ex3",
             question: <p>Express <InlineMath math="2\log_a 3" /> in the form <InlineMath math="\log_a x" />.</p>,
             solution: <BlockMath math="2\log_a 3 = \log_a(3^2) = \log_a 9" />
          }
        ]
      },
      {
        id: "working-with-logarithmic-functions",
        title: "Working with Logarithmic Functions",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=1222",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>If we have the sum of several terms involving logarithmic functions then we can combine the terms in one step.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Clear coefficients first:</strong> <InlineMath math="2\log_a 3" /> must become <InlineMath math="\log_a 9" /> before it can be combined with anything. Trying to add while a coefficient sits out in front is the usual error.</li>
              <li><strong>Then add and subtract the arguments:</strong> sums become products, differences become quotients.</li>
              <li><strong>Same base throughout:</strong> check before you start — mixed bases cannot be combined.</li>
              <li><strong>Simplify the final argument:</strong> leave <InlineMath math="\log_a 12" /> rather than <InlineMath math="\log_a (4 \times 3)" />.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "working-log-ex1",
            question: <p>Evaluate <InlineMath math="\log_a 10 + \log_a 6 - \log_a 5" /></p>,
            solution: <BlockMath math="\log_a 10 + \log_a 6 - \log_a 5 = \log_a\left(\frac{10 \times 6}{5}\right) = \log_a\left(\frac{60}{5}\right) = \log_a 12" />
          },
          {
            id: "working-log-ex2",
            question: <p>Evaluate <InlineMath math="\log_a 4 + 2\log_a 3" /></p>,
            solution: <BlockMath math="\log_a 4 + 2\log_a 3 = \log_a 4 + \log_a(3^2) = \log_a 4 + \log_a 9 = \log_a(4 \times 9) = \log_a 36" />
          }
        ]
      },
      {
        id: "further-logarithmic-equations",
        title: "Further Logarithmic Equations",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=1728",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Many mathematical models of real-life situations use exponential and logarithmic functions.</p>
            <p>We have previously studied basic logarithmic equations and can now solve equations using the properties of logarithmic functions we have now become familiar with.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Condense to a single log, then switch form:</strong> combine everything into one logarithm, then rewrite it as an exponential equation to solve.</li>
              <li><strong>Check every solution in the original:</strong> the algebra can produce values that make a logarithm undefined. Those must be rejected explicitly, not silently dropped.</li>
              <li><strong>Keep the lines consistent:</strong> conversions between log and exponential form are where working most often stops following logically.</li>
              <li><strong>A number can be written as a log:</strong> <InlineMath math="2 = \log_a a^2" />, which lets you combine a constant with the log terms.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "further-log-ex1",
             question: <p>Solve <InlineMath math="\log_3 13 + \log_3 x = \log_3 273" /> for <InlineMath math="x>0" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\log_3(13x) = \log_3 273" />
                 <BlockMath math="\begin{aligned} 13x &= 273 \\ x &= \frac{273}{13} \\ x &= 21 \end{aligned}" />
               </div>
             )
          },
          {
             id: "further-log-ex2",
             question: <p>Solve <InlineMath math="\log_3(4x+3) - \log_3(2x-3) = 1" /> for <InlineMath math="x > \frac{3}{2}" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\log_3\left(\frac{4x+3}{2x-3}\right) = 1" />
                 <p>Convert to exponential form (base 3 to power 1):</p>
                 <BlockMath math="\begin{aligned} \frac{4x+3}{2x-3} &= 3^1 \\ 4x+3 &= 3(2x-3) \\ 4x+3 &= 6x - 9 \\ -2x &= -12 \\ x &= 6 \end{aligned}" />
               </div>
             )
          },
          {
             id: "further-log-ex3",
             question: <p>Solve <InlineMath math="\log_a(2p+1) + \log_a(3p-10) = \log_a(11p)" /> for <InlineMath math="p>4" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\log_a((2p+1)(3p-10)) = \log_a(11p)" />
                 <BlockMath math="\begin{aligned} (2p+1)(3p-10) &= 11p \\ 6p^2 - 20p + 3p - 10 &= 11p \\ 6p^2 - 17p - 10 &= 11p \\ 6p^2 - 28p - 10 &= 0 \\ \end{aligned}" />
                 <p>Divide by 2:</p>
                 <BlockMath math="\begin{aligned} 3p^2 - 14p - 5 &= 0 \\ (3p+1)(p-5) &= 0 \end{aligned}" />
                 <p>So <InlineMath math="p = -\frac{1}{3}" /> or <InlineMath math="p = 5" />. Since we are given <InlineMath math="p > 4" />, then <strong className="text-white">p = 5</strong>.</p>
               </div>
             )
          },
          {
             id: "further-log-ex4",
             question: <p>Solve <InlineMath math="\log_2 7 = \log_2 x + 3" /> for <InlineMath math="x>0" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Rewrite 3 as a logarithm base 2:</p>
                 <BlockMath math="3 = 3\log_2 2 = \log_2(2^3) = \log_2 8" />
                 <BlockMath math="\begin{aligned} \log_2 7 &= \log_2 x + \log_2 8 \\ \log_2 7 &= \log_2(8x) \\ 7 &= 8x \\ x &= \frac{7}{8} \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "exp-log-base-e",
        title: "Exponentials & Logarithms to the Base e",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=2104",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><InlineMath math="\log_e x" /> is a logarithm to the base <InlineMath math="e" />. This is also known as the natural logarithm of <InlineMath math="x" />, and is often written as <InlineMath math="\ln x" />.</p>
            <BlockMath math="\ln x = \log_e x" />
            <p>Usual properties of logarithms can be applied to the natural logarithm function.</p>
            <ul className="list-disc list-inside ml-4">
              <li><InlineMath math="e^0 = 1" /></li>
              <li><InlineMath math="\ln e = 1" /></li>
            </ul>
            <p className="mt-4 font-bold text-white">Without using a calculator, value of:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><InlineMath math="\ln(e^2) = 2" /></li>
              <li><InlineMath math="\ln(e^5) = 5" /></li>
              <li><InlineMath math="\ln(\sqrt{e}) = \frac{1}{2}" /></li>
              <li><InlineMath math="\ln e = 1" /></li>
              <li><InlineMath math="\ln(3e) = \ln 3 + \ln e = \ln 3 + 1" /></li>
              <li><InlineMath math="\ln(13e) = \ln 13 + \ln e = \ln 13 + 1" /></li>
              <li><InlineMath math="\ln 0" /> cannot be found because <InlineMath math="e^x = 0" /> has no real solution (the graph of <InlineMath math="e^x" /> never crosses the x-axis).</li>
            </ul>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong><InlineMath math="\ln" /> means <InlineMath math="\log_e" />:</strong> it is not a different kind of operation, so every log law applies to it unchanged.</li>
              <li><strong><InlineMath math="\ln e = 1" /> and <InlineMath math="\ln 1 = 0" />:</strong> these shortcut most base-<InlineMath math="e" /> calculations.</li>
              <li><strong><InlineMath math="e^x" /> and <InlineMath math="\ln x" /> undo each other:</strong> so <InlineMath math="e^{\ln x} = x" />. This is how you clear an exponential from an equation.</li>
              <li><strong>Use the right calculator button:</strong> <InlineMath math="\ln" /> and <InlineMath math="\log" /> are different keys. Using <InlineMath math="\log" /> for a natural logarithm gives a wrong answer with correct-looking working.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "base-e-ex1",
             question: <p>Use your calculator to find <InlineMath math="\ln 8" />.</p>,
             solution: <BlockMath math="\ln 8 \approx 2.079" />
          },
          {
             id: "base-e-ex3",
             question: <p>Simplify <InlineMath math="4 \ln(2e) - 3 \ln(3e)" /> expressing your answer in the form <InlineMath math="a + \ln b - \ln c" /> where <InlineMath math="a, b, c" /> are whole numbers.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} &= 4(\ln 2 + \ln e) - 3(\ln 3 + \ln e) \\ &= 4\ln 2 + 4(1) - 3\ln 3 - 3(1) \\ &= 4\ln 2 + 4 - 3\ln 3 - 3 \\ &= 1 + \ln(2^4) - \ln(3^3) \\ &= 1 + \ln 16 - \ln 27 \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "solving-equations-unknown-exponents",
        title: "Solving Equations with Unknown Exponents",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=2388",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>If an unknown value is the exponent of a term (e.g. <InlineMath math="10^x" /> or <InlineMath math="e^x" />), we can solve for <InlineMath math="x" /> by taking the logarithm of both sides of the equation.</p>
            <p>The same solution will be obtained using any base, but generally calculators only work in base 10 or base <InlineMath math="e" /> (natural logarithm).</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Converting between the two forms:</strong> this is the single most repeated failure in logarithms — candidates cannot move between <em>exponential form and logarithmic form</em>, in one direction or the other. Practise both directions: <InlineMath math="a^y = x \iff \log_a x = y" />.</li>
                <li><strong>Consistent lines of working:</strong> logarithms and exponentials are a place where each line must follow from the one before, and conversions are where working most often becomes inconsistent.</li>
                <li><strong>Bring the power down first:</strong> <InlineMath math="\log(a^x) = x\log a" /> is what makes the unknown solvable. Taking logs without applying the power law achieves nothing.</li>
                <li><strong>Take logs of <em>both</em> sides:</strong> and of the whole side, not term by term — <InlineMath math="\log(a+b)" /> is not <InlineMath math="\log a + \log b" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
             id: "unknown-exp-ex1",
             question: <p>Solve <InlineMath math="e^x=7" />.</p>,
             solution: <BlockMath math="x = \ln 7 \approx 1.946" />
          },
          {
             id: "unknown-exp-ex-a",
             question: <p>Solve the following:</p>,
             solution: (
               <div className="space-y-4">
                 <p>a) <InlineMath math="e^x = 10 \implies x = \ln 10" /></p>
                 <p>b) <InlineMath math="e^x = 1000 \implies x = \ln 1000 = 3\ln 10" /></p>
                 <p>c) <InlineMath math="2e^x = 0.3 \implies e^x = 0.15 \implies x = \ln 0.15" /></p>
                 <p>d) <InlineMath math="e^{x/2} = 5 \implies x = 2\ln 5 = \ln 25" /></p>
                 <p>e) <InlineMath math="e^{2x} = 18 \implies x = \frac{1}{2}\ln 18 = \ln \sqrt{18} = \ln (3\sqrt{2})" /></p>
                 <p>f) <InlineMath math="e^{-x^2} = 1 \implies -x^2 = \ln 1 \implies -x^2 = 0 \implies x = 0" /></p>
               </div>
             )
          },
          {
             id: "unknown-exp-ex2",
             question: <p>Solve <InlineMath math="7^y=9" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Take the natural logarithm of both sides:</p>
                 <BlockMath math="\begin{aligned} \ln(7^y) &= \ln 9 \\ y \ln 7 &= \ln 9 \\ y &= \frac{\ln 9}{\ln 7} \approx 1.129 \end{aligned}" />
               </div>
             )
          },
          {
             id: "unknown-exp-ex3",
             question: <p>Solve <InlineMath math="5^{3x+1} = 40" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Take the natural logarithm of both sides:</p>
                 <BlockMath math="\begin{aligned} \ln(5^{3x+1}) &= \ln 40 \\ (3x+1)\ln 5 &= \ln 40 \\ 3x+1 &= \frac{\ln 40}{\ln 5} \\ 3x &= \frac{\ln 40}{\ln 5} - 1 \\ x &= \frac{1}{3}\left( \frac{\ln 40}{\ln 5} - 1 \right) \approx 0.430 \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "exponential-growth-decay",
        title: "Exponential Growth & Decay",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=2841",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We previously learned that exponential functions are sometimes known as growth or decay functions. These often occur in models of real-life situations.</p>
            <p>For example, radioactive decay can be modelled using an exponential function. An important measurement is the half-life of radioactive substance, which is the time taken for the mass of the radioactive substance to halve.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Decay needs a negative exponent:</strong> or a base below 1. Getting the sign wrong turns decay into growth and the answer becomes nonsense.</li>
              <li><strong>Take logs to find the time:</strong> when the unknown is in the exponent, logarithms are the only route.</li>
              <li><strong>Half-life means half the original:</strong> set the expression equal to <InlineMath math="0.5A_0" /> — you do not need to know <InlineMath math="A_0" /> itself, since it cancels.</li>
              <li><strong>Round sensibly and in context:</strong> a time usually needs rounding <em>up</em> to be sure the condition is met. Say what your answer means.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "growth-decay-ex1",
             question: (
               <div className="space-y-2">
                 <p>The mass <InlineMath math="G" /> grams of a radioactive sample after time <InlineMath math="t" /> years is given by the formula <InlineMath math="G = 100e^{-3t}" />.</p>
                 <ul className="list-decimal list-inside ml-4">
                   <li>What is the initial mass of radioactive substance in the sample?</li>
                   <li>Find the half-life of the radioactive substance.</li>
                 </ul>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>Initial Mass (<InlineMath math="t=0" />):</strong></p>
                 <BlockMath math="\begin{aligned} G &= 100e^{-3(0)} \\ &= 100e^0 \\ &= 100 \times 1 = 100 \text{ grams} \end{aligned}" />
                 <p><strong>Half-life:</strong> We want to find <InlineMath math="t" /> when <InlineMath math="G = 50" />.</p>
                 <BlockMath math="\begin{aligned} 50 &= 100e^{-3t} \\ \frac{50}{100} &= e^{-3t} \\ 0.5 &= e^{-3t} \\ \ln(0.5) &= -3t \\ t &= \frac{\ln(0.5)}{-3} \approx 0.231 \text{ years} \end{aligned}" />
               </div>
             )
          },
          {
             id: "growth-decay-ex2",
             question: (
               <div className="space-y-2">
                 <p>The world population, in billions, <InlineMath math="t" /> years after 1950 is given by <InlineMath math="P = 2.54e^{0.0178t}" />.</p>
                 <ul className="list-decimal list-inside ml-4">
                   <li>What was the world population in 1950?</li>
                   <li>Find, to the nearest year, the time taken for the world population to double.</li>
                 </ul>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p><strong>1950 (<InlineMath math="t=0" />):</strong></p>
                 <BlockMath math="P = 2.54e^0 = 2.54 \text{ billion}" />
                 <p><strong>Time to double:</strong> We want to find <InlineMath math="t" /> when <InlineMath math="P = 2.54 \times 2 = 5.08" />.</p>
                 <BlockMath math="\begin{aligned} 5.08 &= 2.54e^{0.0178t} \\ 2 &= e^{0.0178t} \\ \ln 2 &= 0.0178t \\ t &= \frac{\ln 2}{0.0178} \approx 38.94 \end{aligned}" />
                 <p>To the nearest year, this is <strong className="text-white">39 years</strong>.</p>
               </div>
             )
          }
        ]
      },
      {
        id: "experimental-data-linear-models",
        title: "Experimental Data & Linear Models",
        videoUrl: "https://www.youtube.com/embed/oNAzh9QKThQ?start=3163",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The results of an experiment may show that there is an exponential relationship between the variables. However, the rapid rise/decrease can often make it difficult to interpret the results.</p>
            <p>We can use logarithms to convert these exponential graphs to linear graphs which makes it easier to find the relationship between the variables.</p>
            
            <p className="font-bold text-white mt-6">Polynomials equations of the form <InlineMath math="y = ax^b" />:</p>
            <BlockMath math="\begin{aligned} y &= ax^b \\ \log_{10} y &= \log_{10}(ax^b) \\ \log_{10} y &= \log_{10} a + \log_{10}(x^b) \\ \log_{10} y &= \log_{10} a + b\log_{10} x \\ \log_{10} y &= b\log_{10} x + \log_{10} a \end{aligned}" />
            <p>The equation is now in the linear form <InlineMath math="Y = mX + c" /> where <InlineMath math="Y = \log_{10} y" />, <InlineMath math="m = b" />, <InlineMath math="X = \log_{10} x" /> and <InlineMath math="c = \log_{10} a" />.</p>

            <p className="font-bold text-white mt-6">Exponential equations of the form <InlineMath math="y = ab^x" />:</p>
            <BlockMath math="\begin{aligned} y &= ab^x \\ \log_{10} y &= \log_{10}(ab^x) \\ \log_{10} y &= \log_{10} a + \log_{10}(b^x) \\ \log_{10} y &= \log_{10} a + x\log_{10} b \\ \log_{10} y &= (\log_{10} b)x + \log_{10} a \end{aligned}" />
            <p>The equation is now in the linear form <InlineMath math="Y = mX + c" /> where <InlineMath math="Y = \log_{10} y" />, <InlineMath math="m = \log_{10} b" />, <InlineMath math="X = x" /> and <InlineMath math="c = \log_{10} a" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Pick the right model.</strong> Using a relationship of the wrong form is the usual reason this question is not attempted successfully. Read the <em>axes</em>: if both are logarithmic it is <InlineMath math="y = ax^b" />; if only the vertical axis is, it is <InlineMath math="y = ab^x" />.</li>
                <li><strong>The gradient is not the constant you want:</strong> for <InlineMath math="y = ax^b" /> the gradient is <InlineMath math="b" /> and the intercept is <InlineMath math="\log a" />, so you must undo the log to recover <InlineMath math="a" />.</li>
                <li><strong>Reproduce every step:</strong> a valid method still loses marks if the steps are <em>not all reproduced accurately</em>. Take logs, apply the laws, then compare with <InlineMath math="Y = mX + c" /> in full.</li>
                <li><strong>Undo the log at the end:</strong> an answer left as <InlineMath math="\log a = 0.6" /> is unfinished — give <InlineMath math="a" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
             id: "exp-data-ex1",
             question: (
               <div className="space-y-4">
                 <p>The results from an experiment were noted as follows:</p>
                 <div className="overflow-x-auto">
                   <table className="min-w-full border border-slate-700 text-center">
                     <thead>
                       <tr className="border-b border-slate-700 bg-slate-800">
                         <th className="p-2 border-r border-slate-700"><InlineMath math="\log_{10} x" /></th>
                         <td className="p-2 border-r border-slate-700">1.70</td>
                         <td className="p-2 border-r border-slate-700">2.29</td>
                         <td className="p-2 border-r border-slate-700">2.70</td>
                         <td className="p-2">2.85</td>
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <th className="p-2 border-r border-slate-700"><InlineMath math="\log_{10} y" /></th>
                         <td className="p-2 border-r border-slate-700">1.33</td>
                         <td className="p-2 border-r border-slate-700">1.67</td>
                         <td className="p-2 border-r border-slate-700">1.92</td>
                         <td className="p-2">2.01</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
                 <p>The relationship between these data can be written in the form <InlineMath math="y = ax^b" />. Find the values of <InlineMath math="a" /> and <InlineMath math="b" />, and state the formula for <InlineMath math="y" /> in terms of <InlineMath math="x" />.</p>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p>Calculate the gradient <InlineMath math="m" /> using the first and last points:</p>
                 <BlockMath math="m = \frac{Y_2 - Y_1}{X_2 - X_1} = \frac{2.01 - 1.33}{2.85 - 1.70} = \frac{0.68}{1.15} \approx 0.591" />
                 <p>For a polynomial model <InlineMath math="y = ax^b" />, <InlineMath math="b = m" />, so <InlineMath math="b = 0.591" />.</p>
                 <p>Now find the intercept <InlineMath math="c = \log_{10} a" /> using <InlineMath math="Y - mX = c" />. Using the first point (1.70, 1.33):</p>
                 <BlockMath math="\begin{aligned} c &= 1.33 - (0.591)(1.70) \\ c &\approx 1.33 - 1.0047 = 0.325 \end{aligned}" />
                 <p>Since <InlineMath math="c = \log_{10} a" />:</p>
                 <BlockMath math="a = 10^{0.325} \approx 2.11" />
                 <p className="text-emerald-300">Formula: <strong className="text-white"><InlineMath math="y = 2.11 x^{0.591}" /></strong></p>
               </div>
             )
          },
          {
             id: "exp-data-ex2",
             question: (
               <div className="space-y-4">
                 <p>The results from an experiment were noted as follows:</p>
                 <div className="overflow-x-auto">
                   <table className="min-w-full border border-slate-700 text-center">
                     <thead>
                       <tr className="border-b border-slate-700 bg-slate-800">
                         <th className="p-2 border-r border-slate-700">x</th>
                         <td className="p-2 border-r border-slate-700">1.30</td>
                         <td className="p-2 border-r border-slate-700">2.00</td>
                         <td className="p-2 border-r border-slate-700">2.30</td>
                         <td className="p-2">2.80</td>
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <th className="p-2 border-r border-slate-700"><InlineMath math="\log_{10} y" /></th>
                         <td className="p-2 border-r border-slate-700">0.886</td>
                         <td className="p-2 border-r border-slate-700">1.112</td>
                         <td className="p-2 border-r border-slate-700">1.207</td>
                         <td className="p-2">1.363</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
                 <p>The relationship between these data can be written in the form <InlineMath math="y = ab^x" />. State the formula for <InlineMath math="y" /> in terms of <InlineMath math="x" />.</p>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p>Calculate the gradient <InlineMath math="m" />:</p>
                 <BlockMath math="m = \frac{1.112 - 0.886}{2.00 - 1.30} = \frac{0.226}{0.70} \approx 0.323" />
                 <p>For an exponential model <InlineMath math="y = ab^x" />, <InlineMath math="m = \log_{10} b" />:</p>
                 <BlockMath math="\begin{aligned} \log_{10} b &= 0.323 \\ b &= 10^{0.323} \approx 2.10 \end{aligned}" />
                 <p>Find the intercept <InlineMath math="c = \log_{10} a" /> using the first point:</p>
                 <BlockMath math="\begin{aligned} c &= Y - mX \\ c &= 0.886 - (0.323)(1.30) \\ c &\approx 0.886 - 0.420 = 0.466 \end{aligned}" />
                 <p>Since <InlineMath math="c = \log_{10} a" />:</p>
                 <BlockMath math="a = 10^{0.466} \approx 2.92" />
                 <p className="text-emerald-300">Formula: <strong className="text-white"><InlineMath math="y = 2.92 (2.10)^x" /></strong></p>
               </div>
             )
          }
        ]
      }
]
  },
  {
    id: "vectors",
    title: "Vectors",
    topics: [
      {
        id: "revision-of-n5-vectors",
        title: "Revision of N5 Vectors",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=13",
        theory: (
          <div className="space-y-4 text-slate-300">
            <h3 className="text-xl font-bold text-white">Magnitude</h3>
            <p>A vector is a quantity with both magnitude and direction. As a result, we can describe vectors as having 'directional growth'.</p>
            <p>A vector can be named in one of the following ways:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Using the letters at the ends of a directed line segment: <InlineMath math="\vec{AB}" /></li>
              <li>Using a lowercase letter underlined (sometimes in bold if typed): <InlineMath math="\vec{u}" /> or <strong className="text-white">u</strong></li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-6">Components</h3>
            <p>A vector can be written in component form:</p>
            <BlockMath math="\begin{pmatrix} x \\ y \\ z \end{pmatrix}" />
            <p>e.g. <InlineMath math="\begin{pmatrix} 2 \\ 7 \end{pmatrix}" /> means move 2 units in the x-direction and 7 units in the y-direction.</p>
            <p>e.g. <InlineMath math="\begin{pmatrix} 2 \\ 7 \\ 3 \end{pmatrix}" /> means move 2 units in the x-direction, 7 units in the y-direction and 3 units in the z-direction.</p>

            <h3 className="text-xl font-bold text-white mt-6">Magnitude</h3>
            <p>The magnitude or length of a 2-dimensional vector is found in a similar way we would find the distance between two points.</p>
            <p>Let <InlineMath math="\vec{u} = \begin{pmatrix} a \\ b \end{pmatrix}" />, then <InlineMath math="|\vec{u}| = \sqrt{a^2+b^2}" /></p>
            <p>In 3-dimensions:</p>
            <p>Let <InlineMath math="\vec{u} = \begin{pmatrix} a \\ b \\ c \end{pmatrix}" />, then <InlineMath math="|\vec{u}| = \sqrt{a^2+b^2+c^2}" /></p>

            <h3 className="text-xl font-bold text-white mt-6">Equal Vectors</h3>
            <p>Vectors are equal if they have the same magnitude and direction (directional growth) i.e. all of their components are equal.</p>
            <p>Conversely, if all components of vectors are equal then the vectors have the same magnitude and direction.</p>
            <p>If <InlineMath math="\begin{pmatrix} a \\ b \\ c \end{pmatrix} = \begin{pmatrix} p \\ q \\ r \end{pmatrix}" /> then <InlineMath math="a=p" />, <InlineMath math="b=q" /> and <InlineMath math="c=r" />.</p>

            <h3 className="text-xl font-bold text-white mt-6">Additive Properties of Vectors</h3>
            <p>Since vectors have directional growth, adding vectors means we are accumulating the growth contained in several vectors.</p>
            <p>If <InlineMath math="\vec{u} = \begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix}" /> and <InlineMath math="\vec{v} = \begin{pmatrix} 4 \\ 6 \\ -3 \end{pmatrix}" />, then <InlineMath math="\vec{u} + \vec{v} = \begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix} + \begin{pmatrix} 4 \\ 6 \\ -3 \end{pmatrix} = \begin{pmatrix} 12 \\ 4 \\ -3 \end{pmatrix}" />.</p>
            <p>If <InlineMath math="\vec{u} = \begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix}" /> and <InlineMath math="\vec{v} = \begin{pmatrix} 4 \\ 6 \\ -3 \end{pmatrix}" />, then <InlineMath math="\vec{u} - \vec{v} = \begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix} - \begin{pmatrix} 4 \\ 6 \\ -3 \end{pmatrix} = \begin{pmatrix} 4 \\ -8 \\ 3 \end{pmatrix}" />.</p>

            <h3 className="text-xl font-bold text-white mt-6">Multiplying by a Scalar</h3>
            <p>Since vectors have directional growth, multiplying an existing vector by a scalar means we are making this existing vector stronger (in the same direction). If you multiply by a negative, then the direction of the vector will change.</p>
            <p>If <InlineMath math="\vec{u} = \begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix}" />, then <InlineMath math="3\vec{u} = 3\begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix} = \begin{pmatrix} 24 \\ -6 \\ 0 \end{pmatrix}" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Pathways are where marks are lost.</strong> Vector pathway questions are among the lowest scoring in the course — <em>many candidates gain no marks at all</em>. Travel with the arrows: <InlineMath math="\vec{AB} = \vec{AO} + \vec{OB} = -\vec{OA} + \vec{OB}" />.</li>
                <li><strong>Reversing a vector flips every component:</strong> <InlineMath math="\vec{BA} = -\vec{AB}" />, so all three signs change, not just the first.</li>
                <li><strong>Work in one notation:</strong> a common failure is being unable to add vectors given in <InlineMath math="i" />, <InlineMath math="j" />, <InlineMath math="k" /> form. If a question mixes column vectors and <InlineMath math="i,j,k" />, convert everything to one form first.</li>
                <li><strong>Order matters:</strong> <InlineMath math="\vec{AB}" /> means &ldquo;from <InlineMath math="A" /> to <InlineMath math="B" />&rdquo;, so it is <InlineMath math="b - a" /> — end point minus start point.</li>
              </ul>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "revision-of-position-vectors",
        title: "Revision of Position Vectors",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=13",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The vector from origin <InlineMath math="O" /> to point <InlineMath math="A" /> is called the position vector of point A: <InlineMath math="\vec{OA}" /> or <InlineMath math="\vec{a}" />.</p>
            <p>The vector <InlineMath math="\vec{AB}" /> is the vector which originates at A and ends at B. <InlineMath math="\vec{AB}" /> is the position vector of B relative to A.</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\vec{AB} = \vec{b} - \vec{a}" />
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong><InlineMath math="\vec{AB} = \mathbf{b} - \mathbf{a}" />:</strong> end point minus start point. Doing it the other way round reverses the vector and every sign with it.</li>
              <li><strong>A position vector starts at the origin:</strong> the point <InlineMath math="P(3,-1,2)" /> has position vector with those components — no subtraction needed.</li>
              <li><strong>Keep columns aligned:</strong> subtract component by component, and write them stacked. Most slips here are arithmetic, not method.</li>
              <li><strong>Distinguish points from vectors:</strong> answer with coordinates when asked for a point, and with a column or <InlineMath math="i, j, k" /> form when asked for a vector.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
            id: "pos-vec-ex1",
            question: (
              <div className="space-y-4">
                <p>P is the point <InlineMath math="(5, -6, 9)" /> and Q is the point <InlineMath math="(3, 2, 5)" />.</p>
                <ul className="list-decimal list-inside ml-4 space-y-2">
                  <li>Find <InlineMath math="\vec{PQ}" />.</li>
                  <li>Find the distance between P and Q.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>1. Find <InlineMath math="\vec{PQ}" />:</p>
                <BlockMath math="\begin{aligned} \vec{PQ} &= \vec{q} - \vec{p} \\ &= \begin{pmatrix} 3 \\ 2 \\ 5 \end{pmatrix} - \begin{pmatrix} 5 \\ -6 \\ 9 \end{pmatrix} = \begin{pmatrix} -2 \\ 8 \\ -4 \end{pmatrix} \end{aligned}" />
                <p>2. Find the distance between P and Q (magnitude of <InlineMath math="\vec{PQ}" />):</p>
                <BlockMath math="\begin{aligned} |\vec{PQ}| &= \sqrt{(-2)^2 + 8^2 + (-4)^2} \\ &= \sqrt{4 + 64 + 16} \\ &= \sqrt{84} \\ &= \sqrt{4 \times 21} = 2\sqrt{21} \end{aligned}" />
              </div>
            )
          }
        ]
      },
      {
        id: "collinearity",
        title: "Collinearity",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=717",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Points A, B and C are collinear if <InlineMath math="\vec{AB}" /> and <InlineMath math="\vec{BC}" /> are parallel, with B a common point.</p>
            <p><strong>NB:</strong> vectors are parallel if they are scalar multiples of the same vector:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>e.g. <InlineMath math="\vec{u} = \begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix}" />, <InlineMath math="\vec{v} = \begin{pmatrix} 16 \\ -4 \\ 0 \end{pmatrix} = 2\begin{pmatrix} 8 \\ -2 \\ 0 \end{pmatrix} = 2\vec{u} \implies \vec{u}" /> and <InlineMath math="\vec{v}" /> are parallel.</li>
              <li>e.g. <InlineMath math="\vec{a} = \begin{pmatrix} 12 \\ -3 \\ 9 \end{pmatrix} = 3\begin{pmatrix} 4 \\ -1 \\ 3 \end{pmatrix}" />, <InlineMath math="\vec{b} = \begin{pmatrix} 20 \\ -5 \\ 15 \end{pmatrix} = 5\begin{pmatrix} 4 \\ -1 \\ 3 \end{pmatrix} \implies \vec{a}" /> and <InlineMath math="\vec{b}" /> are parallel.</li>
            </ul>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Parallel is not enough:</strong> you must also state that the two vectors share a common point. Without that, they could be parallel lines that never meet.</li>
              <li><strong>Show one is a multiple of the other:</strong> <InlineMath math="\vec{AB} = k\vec{BC}" />. State the value of <InlineMath math="k" /> explicitly.</li>
              <li><strong>Write the conclusion:</strong> say that the vectors are parallel, that the point is common, and therefore that the points are collinear. Conclusions here are very often left unstated.</li>
              <li><strong>Check every component gives the same <InlineMath math="k" />:</strong> if one component disagrees, the vectors are not parallel at all.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "collinear-ex1",
             question: (
               <div className="space-y-4">
                 <p>A is the point <InlineMath math="(1, -2, 5)" />, B is <InlineMath math="(8, -5, 9)" /> and C is the point <InlineMath math="(22, -11, 17)" />.</p>
                 <ul className="list-decimal list-inside ml-4 space-y-2">
                   <li>Show that A, B and C are collinear.</li>
                   <li>Find the ratio in which B divides AC.</li>
                 </ul>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p>1. Find <InlineMath math="\vec{AB}" /> and <InlineMath math="\vec{BC}" />:</p>
                 <BlockMath math="\vec{AB} = \vec{b} - \vec{a} = \begin{pmatrix} 8 \\ -5 \\ 9 \end{pmatrix} - \begin{pmatrix} 1 \\ -2 \\ 5 \end{pmatrix} = \begin{pmatrix} 7 \\ -3 \\ 4 \end{pmatrix}" />
                 <BlockMath math="\vec{BC} = \vec{c} - \vec{b} = \begin{pmatrix} 22 \\ -11 \\ 17 \end{pmatrix} - \begin{pmatrix} 8 \\ -5 \\ 9 \end{pmatrix} = \begin{pmatrix} 14 \\ -6 \\ 8 \end{pmatrix}" />
                 <p>Notice that <InlineMath math="\vec{BC} = 2\vec{AB}" />. Since <InlineMath math="\vec{BC}" /> and <InlineMath math="\vec{AB}" /> are scalar multiples, they are parallel. Since B is a common point, A, B and C are collinear.</p>
                 <p>2. The ratio <InlineMath math="AB:BC" /> is <InlineMath math="1:2" />, because <InlineMath math="\vec{BC}" /> is twice as long as <InlineMath math="\vec{AB}" />.</p>
               </div>
             )
          },
          {
             id: "collinear-ex2",
             question: (
               <div className="space-y-4">
                 <p>D, E and F have coordinates <InlineMath math="(10, -8, -15)" />, <InlineMath math="(1, -2, -3)" /> and <InlineMath math="(-14, 8, 17)" /> respectively.</p>
                 <ul className="list-decimal list-inside ml-4 space-y-2">
                   <li>Show that D, E and F are collinear.</li>
                   <li>Find the ratio in which E divides DF.</li>
                 </ul>
               </div>
             ),
             solution: (
               <div className="space-y-4">
                 <p>1. Find <InlineMath math="\vec{DE}" /> and <InlineMath math="\vec{EF}" />:</p>
                 <BlockMath math="\vec{DE} = \vec{e} - \vec{d} = \begin{pmatrix} 1 \\ -2 \\ -3 \end{pmatrix} - \begin{pmatrix} 10 \\ -8 \\ -15 \end{pmatrix} = \begin{pmatrix} -9 \\ 6 \\ 12 \end{pmatrix} = 3\begin{pmatrix} -3 \\ 2 \\ 4 \end{pmatrix}" />
                 <BlockMath math="\vec{EF} = \vec{f} - \vec{e} = \begin{pmatrix} -14 \\ 8 \\ 17 \end{pmatrix} - \begin{pmatrix} 1 \\ -2 \\ -3 \end{pmatrix} = \begin{pmatrix} -15 \\ 10 \\ 20 \end{pmatrix} = 5\begin{pmatrix} -3 \\ 2 \\ 4 \end{pmatrix}" />
                 <p>Since both <InlineMath math="\vec{DE}" /> and <InlineMath math="\vec{EF}" /> are scalar multiples of <InlineMath math="\begin{pmatrix} -3 \\ 2 \\ 4 \end{pmatrix}" />, they are parallel. Since E is a common point, D, E and F are collinear.</p>
                 <p>2. The ratio in which E divides DF (<InlineMath math="DE:EF" />) is <InlineMath math="3:5" />.</p>
               </div>
             )
          }
        ]
      },
      {
        id: "dividing-lines",
        title: "Dividing Lines in a Given Ratio",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=1570",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>If a point T divides a line segment PR in the ratio <InlineMath math="m:n" />, we can use position vectors to find the coordinates of T.</p>
            <p>From the ratio, <InlineMath math="\vec{PT} = \frac{m}{m+n} \vec{PR}" /> or we can use the ratio of parts: <InlineMath math="n\vec{PT} = m\vec{TR}" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Expect this in three dimensions:</strong> finding an internal division point in 3D is a known weak spot, and it is where this topic is usually examined.</li>
                <li><strong>Ratio parts, not the ratio itself:</strong> for <InlineMath math="m:n" /> the fraction along the line is <InlineMath math="\frac{m}{m+n}" />. Using <InlineMath math="\frac{m}{n}" /> is the standard error.</li>
                <li><strong>Which end are you starting from?</strong> <InlineMath math="T" /> dividing <InlineMath math="PR" /> in <InlineMath math="2:1" /> is not the same point as <InlineMath math="1:2" />. Check the order of the letters in the question.</li>
                <li><strong>Add the position vector back on:</strong> <InlineMath math="\vec{PT}" /> is a step, not a position. The coordinates of <InlineMath math="T" /> come from <InlineMath math="\vec{OT} = \vec{OP} + \vec{PT}" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
             id: "dividing-ex1",
             question: <p>P is the point <InlineMath math="(-2, 4, -1)" /> and R is the point <InlineMath math="(8, -1, 19)" />. The point T divides PR in the ratio <InlineMath math="2:3" />. Find the coordinates of T.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Since T divides PR in ratio <InlineMath math="2:3" />, we have <InlineMath math="\frac{PT}{TR} = \frac{2}{3} \implies 3\vec{PT} = 2\vec{TR}" />.</p>
                 <BlockMath math="\begin{aligned} 3(\vec{t} - \vec{p}) &= 2(\vec{r} - \vec{t}) \\ 3\vec{t} - 3\vec{p} &= 2\vec{r} - 2\vec{t} \\ 5\vec{t} &= 2\vec{r} + 3\vec{p} \end{aligned}" />
                 <BlockMath math="\begin{aligned} 5\vec{t} &= 2\begin{pmatrix} 8 \\ -1 \\ 19 \end{pmatrix} + 3\begin{pmatrix} -2 \\ 4 \\ -1 \end{pmatrix} \\ &= \begin{pmatrix} 16 \\ -2 \\ 38 \end{pmatrix} + \begin{pmatrix} -6 \\ 12 \\ -3 \end{pmatrix} \\ &= \begin{pmatrix} 10 \\ 10 \\ 35 \end{pmatrix} \end{aligned}" />
                 <BlockMath math="\vec{t} = \begin{pmatrix} 2 \\ 2 \\ 7 \end{pmatrix}" />
                 <p>The coordinates of T are <strong className="text-white">(2, 2, 7)</strong>.</p>
               </div>
             )
          }
        ]
      },
      {
        id: "unit-vectors",
        title: "Unit Vectors",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=1716",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Any vector with a magnitude of 1 is called a unit vector.</p>
            <p>e.g. Let <InlineMath math="\vec{u} = \begin{pmatrix} \sqrt{3}/2 \\ 0 \\ 1/2 \end{pmatrix}" />, then</p>
            <BlockMath math="|\vec{u}| = \sqrt{\left(\frac{\sqrt{3}}{2}\right)^2 + 0^2 + \left(\frac{1}{2}\right)^2} = \sqrt{\frac{3}{4} + 0 + \frac{1}{4}} = \sqrt{1} = 1" />
            <p>Therefore <InlineMath math="\vec{u}" /> is a unit vector.</p>
            <p>To find a unit vector parallel to vector <InlineMath math="\vec{v}" />, we divide <InlineMath math="\vec{v}" /> by its magnitude: <InlineMath math="\frac{1}{|\vec{v}|}\vec{v}" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Divide by the magnitude:</strong> a unit vector is <InlineMath math="\frac{1}{|\vec{u}|}\vec{u}" />. Dividing by a single component instead is a common error.</li>
              <li><strong>Its magnitude must be 1:</strong> that is the definition, and squaring your components and adding is a quick check.</li>
              <li><strong>Keep the surd:</strong> the magnitude is usually irrational — leave it exact rather than rounding, or the result will not have magnitude 1.</li>
              <li><strong>Direction is unchanged:</strong> a unit vector points the same way as the original; only its length changes.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "unit-vec-ex1",
             question: <p>Find the components of the unit vector <InlineMath math="\vec{u}" /> parallel to vector <InlineMath math="\vec{v}" /> if <InlineMath math="\vec{v} = \begin{pmatrix} 3 \\ 4 \end{pmatrix}" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>First find the magnitude of <InlineMath math="\vec{v}" />:</p>
                 <BlockMath math="|\vec{v}| = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5" />
                 <p>The unit vector <InlineMath math="\vec{u}" /> is:</p>
                 <BlockMath math="\vec{u} = \frac{1}{5}\vec{v} = \frac{1}{5}\begin{pmatrix} 3 \\ 4 \end{pmatrix} = \begin{pmatrix} 3/5 \\ 4/5 \end{pmatrix}" />
               </div>
             )
          }
        ]
      },
      {
        id: "unit-vector-form",
        title: "Unit Vector Form",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=1839",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>We can express a vector in terms of the standard basis vectors <InlineMath math="\mathbf{i}" />, <InlineMath math="\mathbf{j}" />, and <InlineMath math="\mathbf{k}" /> (which have length 1 and point along the x, y, and z axes respectively).</p>
            <BlockMath math="\begin{pmatrix} x \\ y \\ z \end{pmatrix} = x\mathbf{i} + y\mathbf{j} + z\mathbf{k}" />
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong><InlineMath math="i" />, <InlineMath math="j" /> and <InlineMath math="k" /> are just the axes:</strong> the coefficients are exactly the components of the column vector. Converting between the two forms is purely notation.</li>
              <li><strong>Include zero components carefully:</strong> a missing <InlineMath math="j" /> term means that component is zero — do not shuffle the others up.</li>
              <li><strong>Convert before adding:</strong> if a question mixes column and <InlineMath math="i, j, k" /> notation, put everything into one form first. Being unable to do this is a common source of lost marks.</li>
              <li><strong>Answer in the form asked for:</strong> if the question uses <InlineMath math="i, j, k" />, give the answer that way.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "unit-vec-form-ex1",
             question: <p>Express in unit vector form:</p>,
             solution: (
               <div className="space-y-2">
                 <p>a) <InlineMath math="\begin{pmatrix} 3 \\ 7 \\ 9 \end{pmatrix} = 3\mathbf{i} + 7\mathbf{j} + 9\mathbf{k}" /></p>
                 <p>b) <InlineMath math="\begin{pmatrix} 7 \\ -4 \\ -5 \end{pmatrix} = 7\mathbf{i} - 4\mathbf{j} - 5\mathbf{k}" /></p>
                 <p>c) <InlineMath math="\begin{pmatrix} -2 \\ 0 \\ 10 \end{pmatrix} = -2\mathbf{i} + 10\mathbf{k}" /></p>
               </div>
             )
          },
          {
             id: "unit-vec-form-ex2",
             question: <p>Express in component form:</p>,
             solution: (
               <div className="space-y-2 text-center flex flex-col justify-center items-center">
                 <p>d) <InlineMath math="-9\mathbf{i} + 6\mathbf{j} + 4\mathbf{k} = \begin{pmatrix} -9 \\ 6 \\ 4 \end{pmatrix}" /></p>
                 <p>e) <InlineMath math="12\mathbf{i} + \mathbf{j} - \mathbf{k} = \begin{pmatrix} 12 \\ 1 \\ -1 \end{pmatrix}" /></p>
                 <p>f) <InlineMath math="6\mathbf{j} - 2\mathbf{k} = \begin{pmatrix} 0 \\ 6 \\ -2 \end{pmatrix}" /></p>
               </div>
             )
          }
        ]
      },
      {
        id: "dot-product-1",
        title: "Scalar/Dot Product (1)",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=2188",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The dot product can be thought of as directional multiplication. Multiplying two vectors means we are applying the directional growth of one vector to another. The result is how much stronger we have made the original vector.</p>
            <p>The final result of the dot product process can be:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Zero</strong> – no growth in the original direction</li>
              <li><strong>Positive</strong> – some growth in the original direction</li>
              <li><strong>Negative</strong> – negative/reverse growth in the original direction</li>
            </ul>
            <p>The dot product (scalar product), denoted <InlineMath math="\vec{a} \cdot \vec{b}" />, can be calculated as follows (Rectangular perspective):</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\vec{a} \cdot \vec{b} = a_1b_1 + a_2b_2 + a_3b_3" />
            </div>
            <p className="text-center">where <InlineMath math="\vec{a} = \begin{pmatrix} a_1 \\ a_2 \\ a_3 \end{pmatrix}" /> and <InlineMath math="\vec{b} = \begin{pmatrix} b_1 \\ b_2 \\ b_3 \end{pmatrix}" /></p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>The result is a number, not a vector:</strong> the scalar product produces a scalar. An answer written as a column vector shows the method was misunderstood.</li>
              <li><strong>Multiply matching components, then add:</strong> <InlineMath math="a_1b_1 + a_2b_2 + a_3b_3" /> — it is not component-by-component multiplication kept as a vector.</li>
              <li><strong>Mind the negatives:</strong> a single sign error changes the answer completely, and there is no obvious check.</li>
              <li><strong>Zero means perpendicular:</strong> if the scalar product is zero, the vectors are at right angles — a fact many questions depend on.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "dot-prod-1-ex1",
             question: <p>Find <InlineMath math="\vec{p} \cdot \vec{q}" />, given that <InlineMath math="\vec{p} = \begin{pmatrix} 1 \\ 2 \\ -3 \end{pmatrix}" /> and <InlineMath math="\vec{q} = \begin{pmatrix} 2 \\ 2 \\ 3 \end{pmatrix}" />.</p>,
             solution: <BlockMath math="\vec{p} \cdot \vec{q} = (1)(2) + (2)(2) + (-3)(3) = 2 + 4 - 9 = -3" />
          },
          {
             id: "dot-prod-1-ex2",
             question: <p>If A is the point <InlineMath math="(2, 3, 9)" />, B<InlineMath math="(1, 4, -2)" /> and C<InlineMath math="(-1, 3, -6)" />, calculate <InlineMath math="\vec{AB} \cdot \vec{AC}" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>First find <InlineMath math="\vec{AB}" /> and <InlineMath math="\vec{AC}" />:</p>
                 <BlockMath math="\vec{AB} = \vec{b} - \vec{a} = \begin{pmatrix} 1 \\ 4 \\ -2 \end{pmatrix} - \begin{pmatrix} 2 \\ 3 \\ 9 \end{pmatrix} = \begin{pmatrix} -1 \\ 1 \\ -11 \end{pmatrix}" />
                 <BlockMath math="\vec{AC} = \vec{c} - \vec{a} = \begin{pmatrix} -1 \\ 3 \\ -6 \end{pmatrix} - \begin{pmatrix} 2 \\ 3 \\ 9 \end{pmatrix} = \begin{pmatrix} -3 \\ 0 \\ -15 \end{pmatrix}" />
                 <p>Calculate the dot product:</p>
                 <BlockMath math="\vec{AB} \cdot \vec{AC} = (-1)(-3) + (1)(0) + (-11)(-15) = 3 + 0 + 165 = 168" />
               </div>
             )
          }
        ]
      },
      {
        id: "dot-product-2",
        title: "Scalar/Dot Product (2)",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=2318",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The dot product (scalar product), denoted <InlineMath math="\vec{a} \cdot \vec{b}" />, can be calculated as follows (Polar perspective):</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\vec{a} \cdot \vec{b} = |\vec{a}| |\vec{b}| \cos \theta" />
            </div>
            <p className="text-center">where <InlineMath math="\theta" /> is the angle between the vectors <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" />. The vectors must both be pointing away from the vertex.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Use the magnitudes, not the components:</strong> the geometric form is <InlineMath math="|\vec{a}||\vec{b}|\cos\theta" />. Mixing the two forms in one line is a frequent error.</li>
              <li><strong>The angle is between the vectors:</strong> both must point <em>away</em> from the common vertex. If one points towards it, reverse it first or the angle will be wrong.</li>
              <li><strong>Keep magnitudes exact:</strong> rounding surds early makes the final angle inaccurate.</li>
              <li><strong>Choose the form that suits the question:</strong> components when you know them, magnitudes and angle when you are given those.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "dot-prod-2-ex1",
             question: <p>Vectors <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> have magnitudes 7 and 3 units respectively and are at an angle of <InlineMath math="60^\circ" /> to each other. What is the value of <InlineMath math="\vec{a} \cdot \vec{b}" />?</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\vec{a} \cdot \vec{b} = |\vec{a}| |\vec{b}| \cos \theta = (7)(3) \cos 60^\circ = 21 \left(\frac{1}{2}\right) = 10.5" />
               </div>
             )
          }
        ]
      },
      {
        id: "perpendicular-vectors",
        title: "Perpendicular Vectors",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=2551",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>If <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> are perpendicular then the angle between them is <InlineMath math="90^\circ" />.</p>
            <p>Since <InlineMath math="\cos 90^\circ = 0" />, <InlineMath math="\vec{a} \cdot \vec{b} = |\vec{a}| |\vec{b}| \cos 90^\circ = 0" />.</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col text-emerald-300">
              <p>If <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> are perpendicular then <InlineMath math="\vec{a} \cdot \vec{b} = 0" />.</p>
              <p>Conversely, if <InlineMath math="\vec{a} \cdot \vec{b} = 0" /> then <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> are perpendicular.</p>
            </div>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Perpendicular means the scalar product is zero:</strong> this is both the test and the equation you solve for an unknown.</li>
              <li><strong>Set it equal to zero, then solve:</strong> for a question with an unknown component, form <InlineMath math="\vec{a} \cdot \vec{b} = 0" /> and solve for it.</li>
              <li><strong>State the conclusion:</strong> after showing the product is zero, say that the vectors are therefore perpendicular.</li>
              <li><strong>Zero product does not mean zero vector:</strong> two non-zero vectors can have a scalar product of zero — that is exactly what perpendicular means.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "perp-vec-ex1",
             question: <p>Two vectors are defined as <InlineMath math="\vec{a} = 4\mathbf{i} + 2\mathbf{j} - 5\mathbf{k}" /> and <InlineMath math="\vec{b} = 2\mathbf{i} + \mathbf{j} + 2\mathbf{k}" />. Show that <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> are perpendicular.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\vec{a} \cdot \vec{b} = (4)(2) + (2)(1) + (-5)(2) = 8 + 2 - 10 = 0" />
                 <p>Since <InlineMath math="\vec{a} \cdot \vec{b} = 0" />, the vectors <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> are perpendicular.</p>
               </div>
             )
          },
          {
             id: "perp-vec-ex2",
             question: <p><InlineMath math="\vec{PQ} = \begin{pmatrix} 4 \\ a \\ 7 \end{pmatrix}" /> and <InlineMath math="\vec{RS} = \begin{pmatrix} 2 \\ -3 \\ a \end{pmatrix}" /> where <InlineMath math="a" /> is a constant. Given that <InlineMath math="\vec{PQ}" /> and <InlineMath math="\vec{RS}" /> are perpendicular, find the value of <InlineMath math="a" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Since they are perpendicular, <InlineMath math="\vec{PQ} \cdot \vec{RS} = 0" />.</p>
                 <BlockMath math="\begin{aligned} (4)(2) + (a)(-3) + (7)(a) &= 0 \\ 8 - 3a + 7a &= 0 \\ 8 + 4a &= 0 \\ 4a &= -8 \\ a &= -2 \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "angle-between-vectors",
        title: "Angle Between Vectors",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=2741",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>From the dot product formula <InlineMath math="\vec{a} \cdot \vec{b} = |\vec{a}| |\vec{b}| \cos \theta" />, we can rearrange this to find the angle between two vectors:</p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 items-center justify-center flex flex-col">
              <BlockMath math="\cos \theta = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| |\vec{b}|}" />
            </div>
            <p className="text-center">Remember to calculate <InlineMath math="\vec{a} \cdot \vec{b}" /> using <InlineMath math="a_1b_1 + a_2b_2 + a_3b_3" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Rearranged, not memorised separately:</strong> <InlineMath math="\cos\theta = \frac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}" /> is just the geometric form rearranged.</li>
              <li><strong>Both vectors point away from the vertex:</strong> to find the angle at <InlineMath math="B" /> in a triangle, use <InlineMath math="\vec{BA}" /> and <InlineMath math="\vec{BC}" /> — not <InlineMath math="\vec{AB}" />.</li>
              <li><strong>A negative cosine gives an obtuse angle:</strong> that is a valid answer, not an error. Do not discard the sign.</li>
              <li><strong>Do not round too early:</strong> keep the scalar product and magnitudes exact until the final inverse cosine.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "angle-vec-ex1",
             question: <p>Calculate angle <InlineMath math="\theta" /> between vectors <InlineMath math="\vec{p} = 3\mathbf{i} + 4\mathbf{j} - 2\mathbf{k}" /> and <InlineMath math="\vec{q} = 4\mathbf{i} + \mathbf{j} + 3\mathbf{k}" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>Calculate dot product <InlineMath math="\vec{p} \cdot \vec{q}" />:</p>
                 <BlockMath math="\vec{p} \cdot \vec{q} = (3)(4) + (4)(1) + (-2)(3) = 12 + 4 - 6 = 10" />
                 <p>Calculate magnitude <InlineMath math="|\vec{p}|" />:</p>
                 <BlockMath math="|\vec{p}| = \sqrt{3^2 + 4^2 + (-2)^2} = \sqrt{9 + 16 + 4} = \sqrt{29}" />
                 <p>Calculate magnitude <InlineMath math="|\vec{q}|" />:</p>
                 <BlockMath math="|\vec{q}| = \sqrt{4^2 + 1^2 + 3^2} = \sqrt{16 + 1 + 9} = \sqrt{26}" />
                 <p>Substitute into formula:</p>
                 <BlockMath math="\begin{aligned} \cos \theta &= \frac{10}{\sqrt{29}\sqrt{26}} \\ \cos \theta &= \frac{10}{\sqrt{754}} \\ \theta &= \cos^{-1}\left(\frac{10}{\sqrt{754}}\right) \approx 68.6^\circ \end{aligned}" />
               </div>
             )
          },
          {
             id: "angle-vec-ex2",
             question: <p>K is the point <InlineMath math="(1, -7, 2)" />, L <InlineMath math="(-3, 3, 4)" /> and M <InlineMath math="(2, 5, 1)" />. Find <InlineMath math="\angle KLM" />.</p>,
             solution: (
               <div className="space-y-4">
                 <p>For angle at L, the vectors must point away from L: <InlineMath math="\vec{LK}" /> and <InlineMath math="\vec{LM}" />.</p>
                 <BlockMath math="\vec{LK} = \vec{k} - \vec{l} = \begin{pmatrix} 1 \\ -7 \\ 2 \end{pmatrix} - \begin{pmatrix} -3 \\ 3 \\ 4 \end{pmatrix} = \begin{pmatrix} 4 \\ -10 \\ -2 \end{pmatrix}" />
                 <BlockMath math="\vec{LM} = \vec{m} - \vec{l} = \begin{pmatrix} 2 \\ 5 \\ 1 \end{pmatrix} - \begin{pmatrix} -3 \\ 3 \\ 4 \end{pmatrix} = \begin{pmatrix} 5 \\ 2 \\ -3 \end{pmatrix}" />
                 <BlockMath math="\vec{LK} \cdot \vec{LM} = (4)(5) + (-10)(2) + (-2)(-3) = 20 - 20 + 6 = 6" />
                 <BlockMath math="|\vec{LK}| = \sqrt{4^2 + (-10)^2 + (-2)^2} = \sqrt{16 + 100 + 4} = \sqrt{120}" />
                 <BlockMath math="|\vec{LM}| = \sqrt{5^2 + 2^2 + (-3)^2} = \sqrt{25 + 4 + 9} = \sqrt{38}" />
                 <BlockMath math="\begin{aligned} \cos(\angle KLM) &= \frac{6}{\sqrt{120}\sqrt{38}} \\ \theta &= \cos^{-1}\left(\frac{6}{\sqrt{4560}}\right) \approx 84.9^\circ \end{aligned}" />
               </div>
             )
          }
        ]
      },
      {
        id: "properties-scalar-product",
        title: "Properties of the Scalar Product",
        videoUrl: "https://www.youtube.com/embed/yNetkoIj1aY?start=3224",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>1. The scalar product is commutative i.e. <InlineMath math="\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}" /></p>
            <p>2. The scalar product is distributive i.e. <InlineMath math="\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}" /></p>
            <p>3. The scalar product of a vector and itself is a positive real number if <InlineMath math="\vec{a} \neq 0" /> i.e. <InlineMath math="\vec{a} \cdot \vec{a} = |\vec{a}|^2" />.</p>
            <p className="ml-4">Proof: <InlineMath math="\vec{a} \cdot \vec{a} = |\vec{a}| |\vec{a}| \cos \theta" />. Since the angle is 0, <InlineMath math="\cos 0^\circ = 1" />. <InlineMath math="\vec{a} \cdot \vec{a} = |\vec{a}| |\vec{a}| \times 1 = |\vec{a}|^2" />.</p>
          <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong><InlineMath math="\vec{a}\cdot\vec{a} = |\vec{a}|^2" />:</strong> the scalar product of a vector with itself is the square of its magnitude, which is often the quickest route into a proof.</li>
              <li><strong>It distributes over addition:</strong> <InlineMath math="\vec{a}\cdot(\vec{b}+\vec{c}) = \vec{a}\cdot\vec{b} + \vec{a}\cdot\vec{c}" />, which lets you expand exactly like ordinary algebra.</li>
              <li><strong>Order does not matter:</strong> <InlineMath math="\vec{a}\cdot\vec{b} = \vec{b}\cdot\vec{a}" />.</li>
              <li><strong>You cannot divide by a vector:</strong> there is no such operation, so rearranging a scalar product equation must be done by expanding, not dividing.</li>
            </ul>
          </div>
          </div>
        ),
        examples: [
          {
             id: "prop-scalar-ex1",
             question: <p>Calculate <InlineMath math="\vec{p} \cdot (\vec{q} + \vec{r})" /> when <InlineMath math="|\vec{p}| = 3" />, <InlineMath math="|\vec{q}| = 4" /> and <InlineMath math="|\vec{r}| = 2" />, with the angle between <InlineMath math="\vec{p}" /> and <InlineMath math="\vec{q}" /> being <InlineMath math="60^\circ" /> and the angle between <InlineMath math="\vec{p}" /> and <InlineMath math="\vec{r}" /> being <InlineMath math="120^\circ" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} \vec{p} \cdot (\vec{q} + \vec{r}) &= \vec{p} \cdot \vec{q} + \vec{p} \cdot \vec{r} \\ &= |\vec{p}||\vec{q}|\cos 60^\circ + |\vec{p}||\vec{r}|\cos 120^\circ \\ &= (3)(4)(0.5) + (3)(2)(-0.5) \\ &= 6 - 3 \\ &= 3 \end{aligned}" />
               </div>
             )
          },
          {
             id: "prop-scalar-ex2",
             question: <p>If <InlineMath math="|\vec{a}| = |\vec{c}| = 2" /> and <InlineMath math="|\vec{b}| = 2\sqrt{3}" />, angle between <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{b}" /> is <InlineMath math="30^\circ" />, angle between <InlineMath math="\vec{a}" /> and <InlineMath math="\vec{c}" /> is <InlineMath math="150^\circ" />. Calculate <InlineMath math="\vec{a} \cdot (\vec{a} + \vec{b} + \vec{c})" />.</p>,
             solution: (
               <div className="space-y-4">
                 <BlockMath math="\begin{aligned} \vec{a} \cdot (\vec{a} + \vec{b} + \vec{c}) &= \vec{a} \cdot \vec{a} + \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c} \\ &= |\vec{a}|^2 + |\vec{a}||\vec{b}|\cos 30^\circ + |\vec{a}||\vec{c}|\cos 150^\circ \\ &= 2^2 + (2)(2\sqrt{3})\left(\frac{\sqrt{3}}{2}\right) + (2)(2)\left(-\frac{\sqrt{3}}{2}\right) \\ &= 4 + 6 - 2\sqrt{3} \\ &= 10 - 2\sqrt{3} \end{aligned}" />
               </div>
             )
          }
        ]
      }
]
  }
];

