// Import existing AH past paper data for questions that appear in past papers
import { advHigherMaths2016 } from '../pastpapers/AHMaths2016.js';
import { advHigherMaths2019 } from '../pastpapers/AHMaths2019.js';
import { advHigherMaths2022P1 } from '../pastpapers/AHMaths2022_P1.js';
import { advHigherMaths2023P1 } from '../pastpapers/AHMaths2023_P1.js';
import { advHigherMaths2023P2 } from '../pastpapers/AHMaths2023_P2.js';
import { advHigherMaths2024P2 } from '../pastpapers/AHMaths2024_P2.js';

export const methods_of_proofData = {
    mainTopic: "Methods of Proof",
    lessonVideoId: "f3CiNu2Jmak",
    subTopics: [
        {
            topicName: "Practice Questions",
            questions: [
                {
                    question: `Find a counterexample to show that this statement is false: \\(\\forall n \\in \\mathbb R, \\sqrt{n^{2}} = n.\\)`,
                    answer: `\\(n = -1\\) is a counterexample. \\(\\sqrt{(-1)^{2}} = 1\\), not \\(-1.\\)`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "55s"
                },
                {
                    question: `Find a counterexample to show that the following conjecture is false:<br><i>Let \\(P_n\\) represent the product of the first \\(n\\) prime numbers. Then \\(P_{n}+1\\) is prime \\(\\forall n \\in \\mathbb N.\\)</i>`,
                    answer: `\\(n = 6\\) is a counterexample. \\(P_{6}+1 = 2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30031 = 59 \\times 509\\) (which is composite).`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "1m40s"
                },
                {
                    question: `Prove that if \\(a\\) is a multiple of \\(2\\) and \\(b\\) is a multiple of \\(3\\) then \\(ab\\) is a multiple of \\(6.\\)`,
                    answer: `Let \\(a = 2m\\) and \\(b = 3n.\\) Then \\(ab = (2m)(3n) = 6mn.\\) Since \\(mn \\in \\mathbb Z\\), \\(6\\) is a factor of \\(ab.\\)`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "4m47s"
                },
                {
                    question: `Prove that the sum of the squares of two odd numbers is even.`,
                    answer: `Let the numbers be \\(2k-1\\) and \\(2l-1.\\) Sum of squares: \\((2k-1)^2 + (2l-1)^2 = 4k^2-4k+1 + 4l^2-4l+1 = 2(2k^2-2k+2l^2-2l+1).\\) This is a multiple of \\(2\\), therefore it is even.`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "6m33s"
                },
                {
                    question: `Prove that any multiple of \\(3\\) can be expressed as the sum of three consecutive integers.`,
                    answer: `Let the multiple of \\(3\\) be \\(n = 3k.\\) This can be rewritten as \\(k+k+k\\), which is equivalent to \\((k-1) + k + (k+1)\\) (the sum of three consecutive integers).`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "8m54s"
                },
                {
                    question: `Use proof by contradiction to demonstrate that \\(\\sqrt{2}\\) is irrational.`,
                    answer: `Assume \\(\\sqrt{2} = \\frac{p}{q}\\) (a fully simplified fraction). Squaring gives \\(p^2 = 2q^2\\), meaning \\(p^2\\) (and thus \\(p\\)) is even. Substitute \\(p=2m\\) to get \\(4m^2 = 2q^2\\), which simplifies to \\(q^2 = 2m^2.\\) This means \\(q^2\\) (and thus \\(q\\)) is also even. This contradicts the assumption that \\(\\frac{p}{q}\\) is fully simplified, so \\(\\sqrt{2}\\) must be irrational.`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "10m7s"
                },
                {
                    question: `Use proof by contradiction to show that there is an infinite number of prime numbers.`,
                    answer: `Assume there are finite primes \\(p_1, p_2, \\dots, p_n.\\) Let \\(P = (p_1 p_2 \\dots p_n) + 1.\\) \\(P\\) must be either a new prime greater than all others, or a composite number not divisible by any of the \\(n\\) primes (it always leaves a remainder of \\(1\\)). Both cases contradict the assumption of finite primes.`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "14m13s"
                },
                {
                    question: `Use the contrapositive to prove that if \\(n^2\\) is a multiple of \\(3\\) then \\(n\\) is a multiple of \\(3.\\)`,
                    answer: `The contrapositive is "If \\(n\\) is not a multiple of \\(3\\), then \\(n^2\\) is not a multiple of \\(3.\\)" Testing the two cases (\\(n=3k+1\\) and \\(n=3k+2\\)): \\((3k+1)^2 = 3(3k^2+2k)+1\\) and \\((3k+2)^2 = 3(3k^2+4k+1)+1.\\) In both cases, \\(n^2\\) leaves a remainder of \\(1\\) when divided by \\(3\\), proving the contrapositive and therefore the original statement.`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "18m46s"
                },
                {
                    question: `Prove by contrapositive that if \\(pq\\) is irrational then at least one of \\(p\\) or \\(q\\) is irrational.`,
                    answer: `The contrapositive is "If \\(p\\) and \\(q\\) are both rational, then \\(pq\\) is rational." Let \\(p = \\frac{a}{b}\\) and \\(q = \\frac{c}{d}.\\) Their product \\(pq = \\frac{ac}{bd}\\), which is a rational fraction, proving the contrapositive and the original statement.`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "23m13s"
                },
                {
                    question: `Prove by induction that \\(\\forall n \\in \\mathbb N, 6^{n}+4\\) is divisible by \\(10.\\)`,
                    answer: `Base case (\\(n=1\\)): \\(6^1+4 = 10\\) (divisible by \\(10\\)). Assume true for \\(n=k\\): \\(6^k+4 = 10a \\implies 6^k = 10a-4.\\) For \\(n=k+1\\): \\(6^{k+1}+4 = 6(6^k)+4 = 6(10a-4)+4 = 60a-20 = 10(6a-2).\\) Since this is a multiple of \\(10\\), it is true \\(\\forall n \\in \\mathbb N.\\)`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "25m19s"
                },
                {
                    question: `The Fibonacci sequence is defined by the recurrence relation: \\(F_1=F_2=1\\) and \\(F_{n+2}=F_{n+1}+F_{n}\\ (n \\ge 1).\\)<br>Prove by induction that, \\(\\forall n \\in \\mathbb N, F_1+F_2+\\dots +F_n=F_{n+2}-1.\\)`,
                    answer: `Base case (\\(n=1\\)): \\(F_1 = F_3-1 \\implies 1 = 2-1\\) (True). Assume true for \\(k\\): \\(F_1+\\dots+F_k = F_{k+2}-1.\\) For \\(k+1\\): \\((F_1+\\dots+F_k) + F_{k+1} = (F_{k+2}-1) + F_{k+1} = (F_{k+2}+F_{k+1})-1 = F_{k+3}-1\\), completing the proof.`,
                    videoId: "f3CiNu2Jmak",
                    timestamp: "29m36s"
                },
                // SQA Advanced Higher Maths 2016 Q5
                { ...advHigherMaths2016.papers[0].questions[6], videoId: "f3CiNu2Jmak", timestamp: "33m9s" },
                // SQA Advanced Higher Maths 2019 Q14
                { ...advHigherMaths2019.papers[0].questions[15], videoId: "f3CiNu2Jmak", timestamp: "37m36s" },
                // SQA Advanced Higher Maths 2023 P1 Q8
                { ...advHigherMaths2023P1.papers[0].questions[7], videoId: "f3CiNu2Jmak", timestamp: "41m37s" },
                // SQA Advanced Higher Maths 2022 P1 Q6
                { ...advHigherMaths2022P1.papers[0].questions[6], videoId: "f3CiNu2Jmak", timestamp: "44m24s" },
                // SQA Advanced Higher Maths 2023 P2 Q12
                { ...advHigherMaths2023P2.papers[0].questions[11], videoId: "f3CiNu2Jmak", timestamp: "47m58s" },
                // SQA Advanced Higher Maths 2024 P2 Q11
                { ...advHigherMaths2024P2.papers[0].questions[10], videoId: "f3CiNu2Jmak", timestamp: "53m16s" }
            ]
        },
        {
            topicName: "Resources",
            type: "resources",
            items: [
                { name: "Cheat Sheet", link: "resources/advanced-higher/methods_of_proof_cheatsheet.html" },
                { name: "Checklist", link: "resources/advanced-higher/methods_of_proof_checklist.html" }
            ]
        }
    ]
};
