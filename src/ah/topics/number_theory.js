// Import existing AH past paper data for questions that appear in past papers
import { advHigherMaths2017 } from '../pastpapers/AHMaths2017.js';
import { advHigherMaths2018 } from '../pastpapers/AHMaths2018.js';
import { advHigherMaths2019 } from '../pastpapers/AHMaths2019.js';
import { advHigherMaths2022P2 } from '../pastpapers/AHMaths2022_P2.js';
import { advHigherMaths2023P2 } from '../pastpapers/AHMaths2023_P2.js';
import { advHigherMaths2024P2 } from '../pastpapers/AHMaths2024_P2.js';
import { advHigherMaths2025P2 } from '../pastpapers/AHMaths2025_P2.js';

export const number_theoryData = {
    mainTopic: "Number Theory",
    lessonVideoId: "nVZV1HfcKPg",
    subTopics: [
        {
            topicName: "Practice Questions",
            questions: [
                {
                    question: `Use the Euclidean algorithm to find the greatest common divisor of \\(98\\) and \\(35.\\)`,
                    answer: `The greatest common divisor of \\(98\\) and \\(35\\) is \\(7.\\)`,
                    videoId: "nVZV1HfcKPg",
                    timestamp: "58s"
                },
                {
                    question: `Use Euclid's algorithm to find the highest common factor of \\(714\\) and \\(221.\\)`,
                    answer: `\\(\\text{hcf}(714, 221) = 17\\)`,
                    videoId: "nVZV1HfcKPg",
                    timestamp: "2m27s"
                },
                {
                    question: `Find integers \\(a\\) and \\(b\\) such that \\(319a+132b=11.\\)`,
                    answer: `\\(a=5\\) and \\(b=-12\\)`,
                    videoId: "nVZV1HfcKPg",
                    timestamp: "3m53s"
                },
                {
                    question: `Show that the greatest common divisor of \\(133\\) and \\(612\\) is \\(1.\\) Hence find \\(x, y \\in \\mathbb Z\\) such that \\(133x+612y=1.\\)`,
                    answer: `\\(x=-23\\) and \\(y=5\\)`,
                    videoId: "nVZV1HfcKPg",
                    timestamp: "7m33s"
                },
                {
                    question: `Convert the decimal number \\(3508\\) into base \\(7.\\)`,
                    answer: `\\(3508_{10} = 13141_7\\)`,
                    videoId: "nVZV1HfcKPg",
                    timestamp: "15m16s"
                },
                {
                    question: `Use the division algorithm to convert \\(7054_{9}\\) into base \\(8.\\)`,
                    answer: `\\(12040_8\\)`,
                    videoId: "nVZV1HfcKPg",
                    timestamp: "17m10s"
                },
                // SQA Advanced Higher Maths 2023 P2 Q6
                { ...advHigherMaths2023P2.papers[0].questions[5], videoId: "nVZV1HfcKPg", timestamp: "19m35s" },
                // SQA Advanced Higher Maths 2017 Q8
                { ...advHigherMaths2017.papers[0].questions[7], videoId: "nVZV1HfcKPg", timestamp: "24m39s" },
                // SQA Advanced Higher Maths 2018 Q5
                { ...advHigherMaths2018.papers[0].questions[6], videoId: "nVZV1HfcKPg", timestamp: "28m7s" },
                // SQA Advanced Higher Maths 2022 P2 Q3
                { ...advHigherMaths2022P2.papers[0].questions[2], videoId: "nVZV1HfcKPg", timestamp: "30m59s" },
                // SQA Advanced Higher Maths 2024 P2 Q2
                { ...advHigherMaths2024P2.papers[0].questions[1], videoId: "nVZV1HfcKPg", timestamp: "33m41s" },
                // SQA Advanced Higher Maths 2019 Q12
                { ...advHigherMaths2019.papers[0].questions[13], videoId: "nVZV1HfcKPg", timestamp: "36m23s" },
                // SQA Advanced Higher Maths 2023 P2 Q9
                { ...advHigherMaths2023P2.papers[0].questions[8], videoId: "nVZV1HfcKPg", timestamp: "38m26s" },
                // SQA Advanced Higher Maths 2025 P2 Q4
                { ...advHigherMaths2025P2.papers[0].questions[3], videoId: "nVZV1HfcKPg", timestamp: "" }
            ]
        },
        {
            topicName: "Resources",
            type: "resources",
            items: [
                { name: "Cheat Sheet", link: "resources/advanced-higher/number_theory_cheatsheet.html" },
                { name: "Checklist", link: "resources/advanced-higher/number_theory_checklist.html" }
            ]
        }
    ]
};
