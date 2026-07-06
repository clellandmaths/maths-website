// Import existing Higher past paper data for questions that appear in past papers
import { higherPastPaper2017 } from '../pastpapers/higherpastpaper2017.js';
import { higherPastPaper2025 } from '../pastpapers/higherpastpaper2025.js';

export const straight_lineData = {
    mainTopic: "Straight Line",
    lessonVideoId: "gHtYHW9h4ek",
    subTopics: [
        {
            topicName: "Practice Questions",
            questions: [
                {
                    question: `Find the equation of the straight line through \\((4,-1)\\) that is parallel to the line with equation \\(2x+y=5\\).`,
                    answer: `\\(y=-2x+7\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "25s"
                },
                {
                    question: `A and B are the points \\((-8,7)\\) and \\((2,t)\\).<br>The line AB is parallel to the line with equation \\(5y-x=9\\).<br>Determine the value of \\(t\\).`,
                    answer: `\\(t=9\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "1m35s"
                },
                {
                    question: `Line \\(l_1\\) has equation \\(3x-4y=1\\).<br>Line \\(l_2\\) is perpendicular to \\(l_1\\).<br>The two lines intersect at \\((3,2)\\).<br>Determine the equation of \\(l_2\\).`,
                    answer: `\\(4x+3y=18\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "3m6s"
                },
                {
                    question: `Three points A, B and C are defined as \\((1,-5)\\), \\((10,7)\\) and \\((4,-1)\\) respectively.<br>Are A, B and C collinear?<br>Justify your answer.`,
                    answer: `Yes, A, B and C are collinear.`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "5m39s"
                },
                {
                    question: `Three points P, Q and R are defined as \\((-1,2)\\), \\((2,8)\\) and \\((-4,-7)\\) respectively.<br>Are P, Q and R collinear?<br>Justify your answer.`,
                    answer: `No, P, Q and R are not collinear.`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "7m21s"
                },
                {
                    question: `The line \\(l_1\\) makes an angle of \\(30^\\circ\\) with the positive direction of the \\(x\\)-axis.<br>Find the equation of the line \\(l_2\\) which is perpendicular to \\(l_1\\) and passes through the point \\((-3,2\\sqrt{3})\\).`,
                    answer: `\\(y=-\\sqrt{3}x-\\sqrt{3}\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "9m2s"
                },
                {
                    question: `The line \\(l_1\\) has a negative gradient and makes an angle of \\(30^\\circ\\) with the negative direction of the \\(x\\)-axis.<br>Find the equation of the line \\(l_2\\) which is perpendicular to \\(l_1\\) and passes through the point \\((-3,2\\sqrt{3})\\).`,
                    answer: `\\(y=\\sqrt{3}x+5\\sqrt{3}\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "10m57s"
                },
                {
                    question: `Determine the acute angle that the line with equation \\(2x-3y=1\\) makes with the \\(y\\)-axis.`,
                    answer: `\\(56.3^\\circ\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "13m21s"
                },
                {
                    question: `P, Q and R are the points \\((2,-1)\\), \\((6,7)\\) and \\((3,-2)\\) respectively.<br>In triangle PQR, determine the equation of the median through R.`,
                    answer: `\\(y=5x-17\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "15m12s"
                },
                {
                    question: `A is \\((-3,4)\\) and B is \\((7,-6)\\).<br>Determine the equation of the perpendicular bisector of AB.`,
                    answer: `\\(y=x-3\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "17m24s"
                },
                {
                    question: `In triangle KLM, the vertices K, L and M are the points \\((-4,1)\\), \\((1,7)\\) and \\((3,3)\\) respectively.<br><b>(a)</b>&nbsp;&nbsp;Find the equation of the altitude from K.<br><b>(b)</b>&nbsp;&nbsp;Determine the coordinates of the point where the altitude from K intersects the straight line through L and M.`,
                    answer: `(a) \\(x-2y=-6\\)<br>(b) \\((\\frac{12}{5},\\frac{21}{5})\\)`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "19m12s"
                },
                // SQA Higher Maths 2017 Paper 1 Question 7
                { ...higherPastPaper2017.papers[0].questions[6], videoId: "jXqWgCEP45c", timestamp: "24m22s" },
                {
                    question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q4</span></strong></small><br>Determine whether the line passing through \\((-4,2)\\) and \\((2,-7)\\) is perpendicular to the line with equation \\(3y=2x+9\\).`,
                    answer: `Yes, the lines are perpendicular.`,
                    videoId: "jXqWgCEP45c",
                    timestamp: "25m53s"
                },
                // SQA Higher Maths 2025 Paper 1 Question 2
                { ...higherPastPaper2025.papers[0].questions[1], videoId: "jXqWgCEP45c", timestamp: "27m11s" }
            ]
        },
        {
            topicName: "Resources",
            type: "resources",
            items: [
                { name: "Cheat Sheet", link: "resources/higher/straight_line_cheatsheet.html" },
                { name: "Checklist", link: "resources/higher/straight_line_checklist.html" }
            ]
        }
    ]
};
