/**
 * Advanced Higher, Differential Equations: what each card is.
 * The routines are in `../routines/differential-equations.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const DIFFERENTIAL_EQUATIONS: readonly CardMeta[] = [
  {
    card: '2021 P2 Q6',
    skill: 'Solve a first-order linear equation whose integrating factor cancels the right-hand side\'s exponential, given $y$ at $x = 0.$',
    marks: [4],
    route: 'The integrating factor e^{kx^2}; the equation as e^{kx^2}y = ∫ 2hx dx; integrated with the constant, hx^2 + c; then c from y(0) and y in terms of x.',
    ranges: 'The paper: dy/dx + 2xy = 14xe^{-x^2}, y(0) = 3, y = (7x^2 + 3)/e^{x^2}. The coefficient of xy 2k with k from 1 (the paper, in half the draws) to 3, and the right-hand side 2hx e^{-kx^2} with h from 1 to 10 (the paper\'s 7), so the integrating factor always cancels its exponential, as the paper\'s does; y(0) from -9 to 9, never 0 (the paper\'s 3). The answer given both ways, as the paper\'s.',
  },
  {
    card: '2021 P1 Q8',
    skill: 'Solve a second-order equation whose right-hand side exponential is already in the complementary function, given $y$ and $\\frac{dy}{dx}$ at $x = 0.$',
    marks: [9],
    route: 'The auxiliary equation solved; the complementary function Ae^{rx} + Be^{sx}; the particular integral Cxe^{rx}, since e^{rx} is in the complementary function (Ce^{rx} alone fails); its two derivatives; C from the substitution; the general solution; its derivative; the conditions at x = 0 and one constant; the other and the particular solution.',
    ranges: 'The paper: y\'\' + y\' - 6y = 35e^{2x}, y(0) = 5, y\'(0) = 12, y = 4e^{2x} + e^{-3x} + 7xe^{2x}. Built from the answer: two different whole roots r and s from ±1 to ±4 (the paper\'s 2 and -3), r the one on the right-hand side, never summing to 0, so the equation keeps its dy/dx term, as the paper\'s; C from ±1 to ±9 (the paper\'s 7), the right-hand side C(r - s) and rC within the paper\'s biggest product, 5 × 7 = 35 (the owner on 2023 P1: "biggest should be no larger than paper"); A and B from ±1 to ±5 (the paper\'s 4 and 1); y(0) never 0 and y\'(0) never 0 and within 30. All exact: Paper 1.',
  },
  {
    card: '2022 P2 Q10',
    skill: 'Solve a second-order equation with a repeated root and a sine and cosine on the right, given $y$ and $\\frac{dy}{dx}$ at $x = 0.$',
    marks: [9],
    route: 'The auxiliary equation; the repeated root\'s complementary function, Ae^{rx} + Bxe^{rx}; the particular integral C sin x + D cos x with both derivatives; substituted into the left side; the sin and cos coefficients compared for two equations; C and D; the general solution differentiated; A from y(0); B from y\'(0) and the particular solution. "= 0" on the auxiliary equation or the first mark goes.',
    ranges: 'The paper: y\'\' - 4y\' + 4y = 9 sin x + 13 cos x, y = 5 and y\' = 0 at x = 0, answer 2e^{2x} - 3xe^{2x} - sin x + 3 cos x. Built from the answer: the repeated root r one of ±2 and ±3 (the paper\'s 2; ±1 would make the two equations for C and D one unknown each, not the paper\'s simultaneous pair), A and B from ±1 to ±5 (the paper\'s 2 and -3), C and D from ±1 to ±3 (the paper\'s -1 and 3). Always sin x and cos x, as the paper\'s. Kept: both trig terms on the right, each within 30, and the conditions within 15 (y\'(0) may be 0, as the paper\'s).',
  },
  {
    card: '2026 P1 Q4',
    skill: 'Solve a second-order homogeneous equation with real roots, then fit its two conditions.',
    marks: [5],
    route: 'Construct the auxiliary equation (with its "= 0"); find the general solution; differentiate it; form the two simultaneous equations from the conditions at x = 0; state the particular solution, starting "y =".',
    ranges: 'The paper: 2y\'\' - 3y\' + y = 0, y = 2 and y\' = -1 at x = 0, answer 6e^{x/2} - 4e^x. Built from the answer: the auxiliary equation is (αm - β)(m - γ) = 0 with α 2 or 3, β from ±1 to ±3 and not a multiple of α (so one root is a fraction, as the paper\'s ½ is), γ from ±1 to ±3 and not equal to β/α. A is a non-zero multiple of α up to ±3α, so that y\'(0) is whole, and B is from -6 to 6 and not 0. Kept: no zero coefficient in the equation, and y(0) and y\'(0) both non-zero, as the paper\'s are. All exact: Paper 1.',
  },
  {
    card: '2025 P1 Q7',
    skill: 'Solve a first-order separable equation with a log on each side, then fit its condition.',
    marks: [5],
    route: 'Write it as an integral equation, the variables separated; integrate the left, ln y; integrate the right, (1/2) ln(2x + β) + c; evaluate the constant from the condition; rearrange by the log laws to y in terms of x. Leaving out the constant loses the last two marks.',
    ranges: 'The paper: dy/dx = y/(2x - 1), y = 12 when x = 5, y = 4(2x - 1)^{1/2}. Built from the answer: y = K(2x + β)^{1/2} with β -1 (the paper), 1 or 3, so 2x + β is positive for every x > 1 and the paper\'s domain line stands as it is; K from 2 to 6 (the paper\'s 4); the condition at the x where 2x + β is 9 or 25, the square of 3 (the paper) or 5, so c is the log of a whole number, as ln 4, and every value exact. The 2 in front of x stays: it is what makes the answer a square root. 30 questions.',
  },
  {
    card: '2025 P2 Q12',
    skill: 'Solve a second-order equation with a quadratic on the right, then fit its two conditions.',
    marks: [9],
    route: 'The auxiliary equation with its "= 0"; the complementary function; the particular integral Cx^2 + Dx + E differentiated twice; substituted into the left side; the constants by comparing coefficients; the general solution; differentiated; the simultaneous equations from the conditions at x = 0; the particular solution.',
    ranges: 'The paper: y\'\' - 8y\' + 15y = 15x^2 - 31x + 40, y = 4 and y\' = 13 at x = 0, answer -2e^{3x} + 4e^{5x} + x^2 - x + 2. Built from the answer: two different whole roots from -3 to 6, never 0 and never summing to 0 (so the equation keeps its y\' term, as -8y\'); C from ±1 to ±2, D from ±1 to ±3, E from ±1 to ±5 (the paper\'s 1, -1, 2); A and B from ±1 to ±5 (the paper\'s -2 and 4). Kept: the quadratic on the right has all three terms, as the paper\'s, each within 60; y(0) and y\'(0) non-zero, y\'(0) within 40.',
  },
  {
    card: '2025 P2 Q14',
    skill: 'Solve a first-order linear equation with an integrating factor, the answer as $y = f(x).$',
    marks: [5],
    route: 'The integrating factor as e to the integral of -n/x; simplified to 1/x^n; the equation as an integral equation; integrated with its constant, (1/k) tan kx + c; rearranged to y = x^n((1/k) tan kx + c). The minus in the coefficient of y must stay in the integrating factor.',
    ranges: 'The paper: dy/dx - (2/x)y = x^2 sec^2 3x, y = x^2((1/3) tan 3x + c). The power n from 2 to 4 on both sides (x^n on the right is what the integrating factor cancels, as the paper\'s x^2; n = 1 would leave a bare x there, not the paper\'s shape), and k from 2 to 9 (the paper\'s 3). Always sec^2 on the right: its integral is the paper\'s tan. 24 questions.',
  },
  {
    card: '2024 P2 Q4',
    skill: 'Solve a second-order homogeneous equation with two whole roots, then fit its two conditions.',
    marks: [5],
    route: 'The auxiliary equation with its "= 0"; the general solution Ae^{m1 x} + Be^{m2 x}; differentiated; one constant from the conditions at x = 0; the other, and the particular solution stated, starting "y =".',
    ranges: 'The paper: y\'\' - 2y\' - 8y = 0, y = -2 and y\' = 22 at x = 0, answer -5e^{-2x} + 3e^{4x}. Built from the answer: two different whole roots from -5 to 6, never 0 and never summing to 0 (so the y\' term stays, as -2y\'), the smaller written first; A and B from ±1 to ±6 (the paper\'s -5 and 3), with neither condition 0. y\'\' keeps coefficient 1, as the paper\'s, so the roots are whole: a leading number is 2026 P1 Q4\'s question.',
  },
  {
    card: '2024 P2 Q15',
    skill: 'A separable model for salt in a tank: $W$ in terms of $t$, the rate at a given time, and the limit.',
    marks: [5, 2, 1],
    route: '5 + 2 + 1 - (a) the variables separated with both integral signs; -ln(M - W); t/k + c; c = -ln(M - W0) from the start; W = M - (M - W0)e^{-t/k}; (b) dW/dt in terms of t, from the equation or (a); evaluated at t = T, exact with its decimal, in kilograms per minute; (c) L = M, because the exponential tends to 0.',
    ranges: 'The paper: dW/dt = (36 - W)/120, W < 36, 8 kg at the start, 67 minutes, giving W = 36 - 28e^{-t/120} and 7/30 e^{-67/120} (0.13). The limit M from 20 to 60, k one of 100, 120 (the paper), 150, 180, 200 or 240 minutes, the starting amount from 2 to M - 5 kg and the time from 20 to 99 minutes, kept where the rate in (b) is at least 0.1 kg per minute, so two decimal places show it, as the paper\'s 0.13. The tank, the salt and the wording stay the paper\'s.',
  },
  {
    card: '2023 P1 Q5',
    skill: 'Find the particular solution of a second-order equation with a quadratic on the right, from its two conditions.',
    marks: [9],
    route: 'The auxiliary equation with its "= 0"; the complementary function; the particular integral Cx^2 + Dx + E differentiated twice; substituted into the left side; the constants by comparing coefficients; the general solution; differentiated; the simultaneous equations from the conditions at x = 0; the particular solution.',
    ranges: 'The paper: y\'\' - 4y\' - 5y = 10x^2 + 11x - 23, y = 2 and y\' = 14 at x = 0, answer 2e^{5x} - 3e^{-x} - 2x^2 + x + 3. Built from the answer: two different whole roots from -3 to 6, never 0 and never summing to 0 (so the equation keeps its y\' term, as -4y\'), the larger written first, as the scheme\'s Ae^{5x} + Be^{-x}; C and D from ±1 to ±3, E from ±1 to ±5 (the paper\'s -2, 1, 3); A and B from ±1 to ±5 (the paper\'s 2 and -3). Kept: the quadratic on the right has all three terms, as the paper\'s, each within 60; y(0) and y\'(0) non-zero, y\'(0) within 40. All exact: Paper 1. The same question as 2025 P2 Q12, with this paper\'s wording.',
  },
  {
    card: '2023 P2 Q7',
    skill: 'Solve a first-order linear equation with an exponential on the right by an integrating factor, fit its condition, then find $k$ in a third-order equation it also solves.',
    marks: [4, 2],
    route: '4 + 2 - (a) the integrating factor e^{-px}; the integral equation, e^{-px}y = A times the integral of e^{qx}e^{-px}; integrated, A times e^{(q-p)x}/(q - p) + c; the particular solution from y(0); (b) the third derivative; k by substituting into y\'\'\' - q y\'\' and comparing. Separating the variables earns nothing in (a).',
    ranges: 'The paper: dy/dx - 2y = 6e^{5x}, y(0) = -1, answer y = 2e^{5x} - 3e^{2x}; then y\'\'\' - 5y\'\' = ke^{2x}, k = 36. Built from the answer: p one of -3 to 4, never 0 (the paper\'s 2, a sign on dy/dx - py only, not a step), q from 1 to 6, never p (the paper\'s 5); B and C, the two coefficients of the answer, from ±1 to ±5 (the paper\'s 2 and -3), with A = B(q - p) at most 20 (the paper\'s 6) and y(0) = B + C never 0. (b)\'s operator is always y\'\'\' - q y\'\', as the paper\'s, so B e^{qx} drops out and k = C p^2(p - q).',
  },
  {
    card: '2023 P2 Q13',
    skill: 'A separable model in context, the decathlon\'s points: separate, integrate, fit the constant from one performance, and write $P$ in terms of $m.$',
    marks: [6],
    route: 'Both sides as integrals, 1/P dP and C/(m - B) dm; ln P; C ln(m - B) + c; the performance and its points substituted; the constant, to 2 decimal places (the paper\'s -1.94); P in terms of m, e^c (m - B)^C (the paper\'s 0.14(m - 220)^{1.4}), or its e form. Leaving out the constant loses the last three marks.',
    ranges: 'The paper: the long jump, dP/dm = 1.4P/(m - 220), a jump of 807 cm scoring 1079 points, P = 0.14(m - 220)^{1.4}. The paper\'s numbers are the real decathlon scoring table\'s: 0.14354(807 - 220)^{1.4} = 1079.1, cut to 1079. So the card draws one of the six field events (long jump, high jump, pole vault, shot put, discus, javelin) with its real table\'s numbers, and a performance a decathlete makes (long jump 600 to 850 cm, high jump 170 to 230 cm, pole vault 380 to 560 cm, shot 11 to 17 m, discus 35 to 52 m, javelin 45 to 72 m, throws to the centimetre), and gives the points the table awards for it, so every draw is true, as the paper\'s is. The answer\'s number to 2 significant figures, as 0.14: 0.14, 0.85, 0.28, 51, 13 and 10. A different story, the same steps and marks.',
  },
  {
    card: '2019 Q8',
    skill: 'Solve a second-order homogeneous equation with two negative whole roots, given $y = 0$ and $\\frac{dy}{dx}$ at $x = 0.$',
    marks: [5],
    route: 'The auxiliary equation solved, m = m1, m2; the general solution Ae^{m1 x} + Be^{m2 x}; its derivative; x = 0 put into both, and one constant; the other and the particular solution, starting "y =", or the last mark goes.',
    ranges: 'The paper: y\'\' + 11y\' + 28y = 0, y = 0 and dy/dx = 9 at x = 0, y = 3e^{-4x} - 3e^{-7x}. Two different roots from -1 to -9, both negative as the paper\'s -4 and -7, the one nearer 0 first; y = 0 at x = 0 always, as the paper, so B = -A, A from 1 to 6 either sign (the paper\'s 3), dy/dx at 0 then A(m1 - m2). A near relation of 2024 P2 Q4 (locked), two whole roots of either sign and both conditions drawn: its own routine. 432 questions.',
  },
  {
    card: '2019 Q13',
    skill: 'A separable model in context, the voltage in a timer circuit: separate, integrate, fit the constant, and write $V$ in terms of $k$ and $t.$',
    marks: [5],
    route: 'The variables separated, the integral of 1/(M - V) dV against the integral of k dt; -ln(M - V); kt + c; the constant from V at t = 0, -ln(M - V0); V = M - (M - V0)e^{-kt}. Leaving out the constant loses the last two marks.',
    ranges: 'The paper: dV/dt = k(12 - V), V = 2 at t = 0, V = 12 - 10e^{-kt}. V at t = 0 from 1 to 6 (the paper\'s 2) and M from 3 more than that to 24 (the paper\'s 12), so M - V0 is at least 3 and its log never ln 1 or ln 2 alone, as the paper\'s ln 10; k stays a letter, as the paper. The same circuit and words, the paper\'s 0 <= V < M with the drawn M.',
  },
  {
    card: '2017 Q9',
    skill: 'Solve the separable equation $\\frac{dy}{dx} = e^{kx}(1 + y^{2})$ from $y$ at $x = 0$, $y$ in terms of $x.$',
    marks: [5],
    route: 'The variables separated, ∫ dy/(1 + y^2) = ∫ e^{kx} dx; tan^{-1} y; (1/k)e^{kx} + c; the constant from y at x = 0, in radians, c = tan^{-1} y₀ - 1/k; y = tan((1/k)e^{kx} + c). The y side is an inverse tangent, not a logarithm.',
    ranges: 'The paper: dy/dx = e^{2x}(1 + y^2), y = 1 at x = 0, y = tan((1/2)e^{2x} + π/4 - 1/2). k from 2 (the paper) to 6; y at x = 0 one of 1 (the paper), √3, 1/√3 and their negatives, so tan^{-1} y₀ is ±π/4, ±π/3 or ±π/6, exact. Always e^{kx}(1 + y^2), as the paper. 30 questions.',
  },
  {
    card: '2017 Q14',
    skill: 'Solve a second-order equation with a repeated root and a sine and cosine on the right, given $y$ and $\\frac{dy}{dx}$ at $x = 0.$',
    marks: [10],
    route: 'The auxiliary equation; the repeated root\'s complementary function, Ae^{rx} + Bxe^{rx}; the particular integral C sin x + D cos x; both its derivatives; substituted; the sin and cos coefficients compared for two equations; C and D; the general solution differentiated; one of A and B from the conditions; the other, and the particular solution. "= 0" on the auxiliary equation or the first mark goes.',
    ranges: 'The paper: y\'\' - 6y\' + 9y = 8 sin x + 19 cos x, y = 7 and y\' = 1/2 at x = 0, answer 5e^{3x} - 14xe^{3x} - (1/2) sin x + 2 cos x. Built from the answer: the repeated root r one of ±2 and ±3 (the paper\'s 3); A from ±1 to ±6 and B from ±1 to ±15 (the paper\'s 5 and -14); C and D halves from ±1/2 to ±3, at least one not whole, as the paper\'s -1/2 and 2. Kept: both trig terms on the right whole, nonzero and within 30, y(0) within 12 and y\'(0) within 15, either maybe a half, as the paper\'s 1/2. Its own routine; a near relation of 2022 P2 Q10 (locked), the same question with whole C and D for nine marks.',
  },
  {
    card: '2016 Q15',
    skill: 'Solve a second-order equation with two negative roots and a quadratic on the right, given $y$ and $\\frac{dy}{dx}$ at $x = 0.$',
    marks: [10],
    route: 'The auxiliary equation with its roots; the complementary function; the particular integral Cx^2 + Dx + E; its derivatives; substituted, one coefficient compared, C; D and E, and the general solution; the general solution differentiated; the two equations from the conditions; one of A and B; the other, and the particular solution. The conditions go on the general solution, not the complementary function.',
    ranges: 'The paper: y\'\' + 5y\' + 6y = 12x^2 + 2x - 5, y = -6 and y\' = 3 at x = 0, answer 8e^{-3x} - 15e^{-2x} + 2x^2 - 3x + 1. Built from the answer: two different negative whole roots from -5 to -1 (the paper\'s -3 and -2), the more negative first, as the scheme\'s Ae^{-3x} + Be^{-2x}; C from ±1 to ±3, D from ±1 to ±4, E from ±1 to ±5 (the paper\'s 2, -3, 1); A and B from ±1 to ±15 (the paper\'s 8 and -15). Kept: the quadratic on the right has all three terms, as the paper\'s, each within 60; y(0) and y\'(0) nonzero and within 20. Its own routine; the same question as 2023 P1 Q5 and 2025 P2 Q12 (locked), whose roots are of either sign.',
  },
  {
    card: '2016 Q16',
    skill: 'Newton\'s law of cooling in context: separate and integrate, the constant from the reading at noon, $k$ from a second reading, then the time the liquid was put in the fridge.',
    marks: [9],
    route: 'The variables separated as integrals; integrated, ln(T - T_F) = -kt + c; c from the reading at noon, t = 0; the second reading substituted; k, unrounded; the starting temperature substituted; t made the subject; t, negative; the clock time to the nearest minute.',
    ranges: 'The paper: the fridge at 4 °C, the liquid 25 °C at the start, 9.8 °C at noon and 6.5 °C at 12:15, k = 0.0561…, t = -22.93…, 11:37 am. The fridge from 2 to 6 °C, the start from 18 to 30 °C; at noon 4 to 9 degrees above the fridge, to one place, as 5.8; the second reading 10, 15 (the paper) or 20 minutes later, its excess a third to 0.7 of the first\'s and at least 1.5 degrees (the paper\'s 2.5 of 5.8). Kept: the liquid placed 10 to 55 minutes before noon, so the answer is between 11:05 and 11:50 am, and t at least 0.1 of a minute from a half, so the nearest minute is never a toss-up. Thousands of questions.',
  },
];
