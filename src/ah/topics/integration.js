// Import existing AH past paper data for questions that appear in past papers
import { advHigherMaths2016 } from '../pastpapers/AHMaths2016.js';
import { advHigherMaths2017 } from '../pastpapers/AHMaths2017.js';
import { advHigherMaths2018 } from '../pastpapers/AHMaths2018.js';
import { advHigherMaths2019 } from '../pastpapers/AHMaths2019.js';
import { advHigherMaths2023P1 } from '../pastpapers/AHMaths2023_P1.js';

export const integrationData = {
    mainTopic: "Integration",
    lessonVideoId: "S3lOe8FCO3k",
    subTopics: [
        {
            topicName: "Practice Questions",
            questions: [
                {
                    question: `Find \\(\\Large\\int\\normalsize \\large\\frac{3x^2\\,-\\,1}{2x^3\\,-\\,2x\\,+\\,1}\\normalsize\\,dx \\)`,
                    answer: `\\( \\frac{1}{2}\\,ln\\vert 2x^3\\!-\\!2x+1\\vert +c \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "18s"
                },
                {
                    question: `Find \\(\\Large\\int\\normalsize \\large\\frac{6\\,dx}{\\sqrt{4\\,-\\,9x^2}} \\)`,
                    answer: `\\( 2\\,sin^{-1}\\left(\\frac{3x}{2}\\right)+c \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "2m50s"
                },
                // SQA Advanced Higher Maths 2018 Q2
                { ...advHigherMaths2018.papers[0].questions[3], videoId: "S3lOe8FCO3k", timestamp: "4m20s" },
                {
                    question: `<small><strong><span style="white-space: nowrap;">Specimen Q11</span></strong></small><br>Find the exact value of \\(\\Large\\int^{\\small 2\\normalsize}_{\\small 1\\normalsize} \\normalsize \\large\\frac{x\\,+\\,4}{(x\\,+\\,1)^2(2x\\,-\\,1)}\\normalsize\\,dx\\)`,
                    answer: `\\( ln\\,2-\\frac{1}{6} \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "7m7s"
                },
                {
                    question: `Use the substitution \\(u=tan\\,x\\) to find \\(\\Large\\int\\normalsize\\!\\large\\frac{dx}{sin\\,x\\,cos\\,x}\\)`,
                    answer: `\\( ln\\vert tan\\,x\\vert+c \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "13m1s"
                },
                // SQA Advanced Higher Maths 2018 Q8
                { ...advHigherMaths2018.papers[0].questions[9], videoId: "S3lOe8FCO3k", timestamp: "14m53s" },
                // SQA Advanced Higher Maths 2023 P1 Q4
                { ...advHigherMaths2023P1.papers[0].questions[3], videoId: "S3lOe8FCO3k", timestamp: "17m48s" },
                {
                    question: `<small><strong><span style="white-space: nowrap;">2016 Specimen Q5</span></strong></small><br>Find \\(\\Large\\int\\normalsize\\!x^2\\,e^{3x}\\,dx\\)`,
                    answer: `\\( \\frac{1}{3} x^2\\,e^{3x}-\\frac{2}{9}\\,x\\,e^{3x}+\\frac{2}{27} e^{3x}+c \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "20m3s"
                },
                {
                    question: `Use integration by parts to obtain \\(\\Large\\int\\normalsize\\!e^x\\,cos\\,x\\,dx\\)`,
                    answer: `\\( \\frac{1}{2}\\left(e^x\\,cos\\,x+e^x\\,sin\\,x\\right)+c \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "22m24s"
                },
                // SQA Advanced Higher Maths 2016 Q9
                { ...advHigherMaths2016.papers[0].questions[10], videoId: "S3lOe8FCO3k", timestamp: "24m52s" },
                {
                    question: `Use integration to prove that the volume of a sphere of radius \\(r\\) is \\(\\frac{4}{3}\\pi r^{3}\\)`,
                    answer: `\\( \\frac{4}{3} \\pi r^3 \\)`,
                    videoId: "S3lOe8FCO3k",
                    timestamp: "28m21s"
                },
                // SQA Advanced Higher Maths 2017 Q16
                { ...advHigherMaths2017.papers[0].questions[15], videoId: "S3lOe8FCO3k", timestamp: "31m28s" },
                // SQA Advanced Higher Maths 2019 Q16
                { ...advHigherMaths2019.papers[0].questions[17], videoId: "S3lOe8FCO3k", timestamp: "34m0s" }
            ]
        },
        {
            topicName: "Resources",
            type: "resources",
            items: [
                { name: "Cheat Sheet", link: "resources/advanced-higher/integration_cheatsheet.html" },
                { name: "Checklist", link: "resources/advanced-higher/integration_checklist.html" }
            ]
        }
    ]
};
