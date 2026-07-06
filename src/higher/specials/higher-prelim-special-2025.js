// Import existing Higher past paper data
import { higherPastPaper2015 } from '../pastpapers/higherpastpaper2015.js';
import { higherPastPaper2016 } from '../pastpapers/higherpastpaper2016.js';
import { higherPastPaper2017 } from '../pastpapers/higherpastpaper2017.js';
import { higherPastPaper2018 } from '../pastpapers/higherpastpaper2018.js';
import { higherPastPaper2019 } from '../pastpapers/higherpastpaper2019.js';
import { higherPastPaper2022 } from '../pastpapers/higherpastpaper2022.js';
import { higherPastPaper2023 } from '../pastpapers/higherpastpaper2023.js';
import { higherPastPaper2024 } from '../pastpapers/higherpastpaper2024.js';
import { higherPastPaper2025 } from '../pastpapers/higherpastpaper2025.js';

export const higherPrelimSpecial2025 = {
    name: "Prelim Special 2026",
    mainVideoId: "TnoXIUxm6V0",
    pdfLink: "https://drive.google.com/file/d/1LaLy3gB9pVZxZO32vjUsM_czqWbu0CRU/view?usp=drive_link",
    liveStreamDate: "Available Now",
    membershipLink: "https://www.youtube.com/channel/UC8XkJnNLavN1Jbicf0nLNdQ/join",
    questions: [
        // 1. SQA Higher Maths 2025 Paper 1 Question 2 - Straight Line
        { topic: "Straight Line", ...higherPastPaper2025.papers[0].questions[1] },
        // 2. SQA Higher Maths 2023 Paper 2 Question 1 - Functions
        { topic: "Functions", ...higherPastPaper2023.papers[1].questions[0] },
        // 3. SQA Higher Maths 2025 Paper 2 Question 1 - Polynomials
        { topic: "Polynomials", ...higherPastPaper2025.papers[1].questions[0] },
        // 4. SQA Higher Maths 2025 Paper 2 Question 9 - Integration
        { topic: "Integration", ...higherPastPaper2025.papers[1].questions[8] },
        // 5. SQA Higher Maths 2024 Paper 1 Question 2 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2024.papers[0].questions[1] },
        // 6. SQA Higher Maths 2019 Paper 2 Question 4 - Vectors
        { topic: "Vectors", ...higherPastPaper2019.papers[1].questions[3] },
        // 7. SQA Higher Maths 2019 Paper 2 Question 8 - Trig Graphs
        { topic: "Trig Graphs", ...higherPastPaper2019.papers[1].questions[7] },
        // 8. SQA Higher Maths 2025 Paper 2 Question 12 - Circle
        { topic: "Circle", ...higherPastPaper2025.papers[1].questions[11] },
        // 9. SQA Higher Maths 2025 Paper 2 Question 4 - Functions
        { topic: "Functions", ...higherPastPaper2025.papers[1].questions[3] },
        // 10. SQA Higher Maths 2019 Paper 1 Question 10 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2019.papers[0].questions[9] },
        // 11. SQA Higher Maths 2025 Paper 1 Question 5 - Graph Transformations
        { topic: "Graph Transformations", ...higherPastPaper2025.papers[0].questions[4] },
        // 12. SQA Higher Maths 2022 Paper 1 Question 7 - Polynomials
        { topic: "Polynomials", ...higherPastPaper2022.papers[0].questions[6] },
        // 13. SQA Higher Maths 2025 Paper 1 Question 6 - Trig Identities
        { topic: "Trig Identities", ...higherPastPaper2025.papers[0].questions[5] },
        // 14. SQA Higher Maths 2016 Paper 2 Question 11 - Circle
        { topic: "Circle", ...higherPastPaper2016.papers[1].questions[10] },
        // 15. SQA Higher Maths 2025 Paper 2 Question 6 - Quadratic Theory
        { topic: "Quadratic Theory", ...higherPastPaper2025.papers[1].questions[5] },
        // 16. SQA Higher Maths 2025 Paper 2 Question 11 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2025.papers[1].questions[10] },
        // 17. SQA Higher Maths 2024 Paper 2 Question 12 - Recurrence Relations
        { topic: "Recurrence Relations", ...higherPastPaper2024.papers[1].questions[11] },
        // 18. SQA Higher Maths 2015 Paper 1 Question 4 - Trig Graphs
        { topic: "Trig Graphs", ...higherPastPaper2015.papers[0].questions[3] },
        // 19. SQA Higher Maths 2022 Paper 1 Question 4 - Straight Line
        { topic: "Straight Line", ...higherPastPaper2022.papers[0].questions[3] },
        // 20. SQA Higher Maths 2018 Paper 1 Question 3 - Exponentials & Logs
        { topic: "Exponentials & Logs", ...higherPastPaper2018.papers[0].questions[2] },
        // 21. SQA Higher Maths 2024 Paper 1 Question 3 - Integration
        { topic: "Integration", ...higherPastPaper2024.papers[0].questions[2] },
        // 22. SQA Higher Maths 2018 Paper 2 Question 3 - Quadratics
        { topic: "Quadratics", ...higherPastPaper2018.papers[1].questions[2] },
        // 23. SQA Higher Maths 2025 Paper 1 Question 1 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2025.papers[0].questions[0] },
        // 24. SQA Higher Maths 2023 Paper 1 Question 8 - Integration
        { topic: "Integration", ...higherPastPaper2023.papers[0].questions[7] },
        // 25. SQA Higher Maths 2017 Paper 2 Question 7 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2017.papers[1].questions[6] },
        // 26. SQA Higher Maths 2019 Paper 2 Question 5 - Circle
        { topic: "Circle", ...higherPastPaper2019.papers[1].questions[4] },
        // 27. SQA Higher Maths 2025 Paper 2 Question 10 - Vectors
        { topic: "Vectors", ...higherPastPaper2025.papers[1].questions[9] },
        // 28. SQA Higher Maths 2025 Paper 1 Question 4 - Logarithms
        { topic: "Logarithms", ...higherPastPaper2025.papers[0].questions[3] },
        // 29. SQA Higher Maths 2023 Paper 1 Question 3 - Integration
        { topic: "Integration", ...higherPastPaper2023.papers[0].questions[2] },
        // 30. SQA Higher Maths 2025 Paper 2 Question 13 - Polynomials
        { topic: "Polynomials", ...higherPastPaper2025.papers[1].questions[12] },
        // 31. SQA Higher Maths 2023 Paper 1 Question 9 - Recurrence Relations
        { topic: "Recurrence Relations", ...higherPastPaper2023.papers[0].questions[8] },
        // 32. SQA Higher Maths 2024 Paper 2 Question 6 - Integration
        { topic: "Integration", ...higherPastPaper2024.papers[1].questions[5] },
        // 33. SQA Higher Maths 2025 Paper 1 Question 7 - Polynomials
        { topic: "Polynomials", ...higherPastPaper2025.papers[0].questions[6] },
        // 34. SQA Higher Maths 2016 Paper 1 Question 15 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2016.papers[0].questions[14] },
        // 35. SQA Higher Maths 2018 Paper 1 Question 7 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2018.papers[0].questions[6] },
        // 36. SQA Higher Maths 2025 Paper 2 Question 2 - Circle
        { topic: "Circle", ...higherPastPaper2025.papers[1].questions[1] },
        // 37. SQA Higher Maths 2025 Paper 1 Question 11 - Trig Equations
        { topic: "Trig Equations", ...higherPastPaper2025.papers[0].questions[10] },
        // 38. SQA Higher Maths 2018 Paper 2 Question 10 - Vectors
        { topic: "Vectors", ...higherPastPaper2018.papers[1].questions[9] },
        // 39. SQA Higher Maths 2019 Paper 1 Question 3 - Exponentials & Logs
        { topic: "Exponentials & Logs", ...higherPastPaper2019.papers[0].questions[2] },
        // 40. SQA Higher Maths 2024 Paper 1 Question 7 - Polynomials
        { topic: "Polynomials", ...higherPastPaper2024.papers[0].questions[6] },
        // 41. SQA Higher Maths 2025 Paper 1 Question 9 - Circle
        { topic: "Circle", ...higherPastPaper2025.papers[0].questions[8] },
        // 42. SQA Higher Maths 2025 Paper 2 Question 14 - Integration
        { topic: "Integration", ...higherPastPaper2025.papers[1].questions[13] },
        // 43. SQA Higher Maths 2019 Paper 1 Question 16 - Polynomials
        { topic: "Polynomials", ...higherPastPaper2019.papers[0].questions[15] },
        // 44. SQA Higher Maths 2025 Paper 1 Question 3 - Integration
        { topic: "Integration", ...higherPastPaper2025.papers[0].questions[2] },
        // 45. SQA Higher Maths 2016 Paper 1 Question 5 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2016.papers[0].questions[4] },
        // 46. SQA Higher Maths 2025 Paper 2 Question 7 - Trig Addition Formulae
        { topic: "Trig Addition Formulae", ...higherPastPaper2025.papers[1].questions[6] },
        // 47. SQA Higher Maths 2019 Paper 2 Question 13 - Trig Addition Formulae
        { topic: "Trig Addition Formulae", ...higherPastPaper2019.papers[1].questions[12] },
        // 48. SQA Higher Maths 2025 Paper 2 Question 3 - Straight Line
        { topic: "Straight Line", ...higherPastPaper2025.papers[1].questions[2] },
        // 49. SQA Higher Maths 2025 Paper 2 Question 8 - Recurrence Relations
        { topic: "Recurrence Relations", ...higherPastPaper2025.papers[1].questions[7] },
        // 50. SQA Higher Maths 2025 Paper 2 Question 5 - Differentiation
        { topic: "Differentiation", ...higherPastPaper2025.papers[1].questions[4] },
        // 51. SQA Higher Maths 2018 Paper 1 Question 5 - Exponentials & Logs
        { topic: "Exponentials & Logs", ...higherPastPaper2018.papers[0].questions[4] },
        // 52. SQA Higher Maths 2019 Paper 1 Question 9 - Circle
        { topic: "Circle", ...higherPastPaper2019.papers[0].questions[8] },
        // 53. SQA Higher Maths 2025 Paper 1 Question 10 - Logarithms
        { topic: "Logarithms", ...higherPastPaper2025.papers[0].questions[9] }
    ]
};
