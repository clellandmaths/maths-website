// National 5 Applications of Maths guided practice.
//
// Unlike the other three courses, these questions are ours — there is no
// maths.scot equivalent for Applications — so they carry no `solutionUrl` and
// need no attribution. Entries with `ref` are past paper questions the site
// already holds: referenced, not restated, so each exam question exists once
// and carries its own marks, diagram and video.
//
// Authored questions carry no marks. We do not invent Qualifications Scotland
// mark allocations; referenced questions keep the real ones.
//
// Each topic climbs: single-step warm-ups, then multi-step questions in exam
// contexts, then the real past paper questions at full exam standard, oldest
// first. Warm-ups are built backwards from a clean answer so the pupil is not
// fighting arithmetic while learning the method; exam-level questions are built
// forwards, because real figures are untidy and handling the rounding
// instruction is itself the skill.
//
// Loaded with import() from the practice route only — never import this from a
// notes or paper page, or it lands in the shared bundle.
import type { PracticeCourse } from '../types';

export const national5AppsPractice: PracticeCourse = {
  courseId: 'n5-apps',
  sections: [
    {
      id: "numeracy",
      title: "Numeracy",
      topics: [
        {
          name: "Basic Operations",
          questions: [
            { question: `Evaluate \\(7.4 + 12.85 - 3.6\\)`, answer: `\\(16.65\\)` },
            { question: `(a) Multiply \\(3.7\\) by \\(100\\)<br>(b) Divide \\(58\\) by \\(1000\\)`, answer: `(a) \\(370\\)<br>(b) \\(0.058\\)` },
            { question: `Evaluate \\(20 - 4 \\times 3\\)`, answer: `\\(8\\)` },
            { question: `A water tank holds \\(250\\) litres.<br>\\(68.5\\) litres are drawn off in the morning and \\(91.75\\) litres in the afternoon.<br>Calculate the volume of water remaining in the tank.`, answer: `\\(89.75\\) litres` },
            { question: `A car is hired for a fixed charge of \\(\\pounds 24.50\\) plus \\(\\pounds 0.18\\) for every mile driven.<br>The car is driven \\(120\\) miles.<br>Calculate the total cost of the hire.`, answer: `\\(\\pounds 46.10\\)` },
            { question: `A shop sells \\(39\\) tickets at \\(\\pounds 4.85\\) each.<br>By rounding each number to 1 significant figure, estimate the total takings.`, answer: `\\(40 \\times \\pounds 5 = \\pounds 200\\)` },
            { ref: "2018 P1 Q6" },
            { ref: "2021 P1 Q1" },
          ],
        },
        {
          name: "Fractions",
          questions: [
            { question: `Evaluate \\(\\frac{2}{5} + \\frac{1}{4}\\)`, answer: `\\(\\frac{13}{20}\\)` },
            { question: `Evaluate \\(\\frac{7}{8} - \\frac{1}{3}\\)`, answer: `\\(\\frac{13}{24}\\)` },
            { question: `Write \\(\\frac{23}{5}\\) as a mixed number.`, answer: `\\(4\\frac{3}{5}\\)` },
            { question: `Simplify \\(\\frac{84}{126}\\) fully.`, answer: `\\(\\frac{2}{3}\\)` },
            { question: `A recipe uses \\(1\\frac{1}{2}\\) cups of flour and \\(2\\frac{3}{4}\\) cups of oats.<br>Calculate the total number of cups used.`, answer: `\\(4\\frac{1}{4}\\) cups` },
            { question: `A tin contains \\(3\\frac{1}{3}\\) kg of paint.<br>\\(1\\frac{3}{4}\\) kg is used.<br>Calculate the mass of paint left in the tin.`, answer: `\\(1\\frac{7}{12}\\) kg` },
            { ref: "2018 P1 Q5" },
            { ref: "2019 P1 Q10" },
            { ref: "2022 P1 Q8" },
            { ref: "2024 P1 Q6" },
            { ref: "2025 P1 Q1" },
          ],
        },
        {
          name: "Percentages",
          questions: [
            { question: `Write \\(0.35\\) as:<br>(a) a fraction in its simplest form<br>(b) a percentage`, answer: `(a) \\(\\frac{7}{20}\\)<br>(b) \\(35\\%\\)` },
            { question: `Calculate \\(15\\%\\) of \\(\\pounds 240\\) without a calculator.`, answer: `\\(\\pounds 36\\)` },
            { question: `Calculate \\(12.5\\%\\) of \\(96\\) without a calculator.`, answer: `\\(12\\)` },
            { question: `A jacket costs \\(\\pounds 68\\).<br>In a sale it is reduced by \\(25\\%\\).<br>Calculate the sale price of the jacket.`, answer: `\\(\\pounds 51\\)` },
            { question: `A test is marked out of \\(80\\).<br>A pupil scores \\(68\\).<br>Calculate the pupil's score as a percentage.`, answer: `\\(85\\%\\)` },
            { question: `A painting is bought for \\(\\pounds 250\\).<br>It is later valued at \\(\\pounds 310\\).<br>Calculate the gain as a percentage of the original price.`, answer: `\\(24\\%\\)` },
            { ref: "2019 P1 Q6" },
            { ref: "2019 P1 Q1" },
            { ref: "2019 P2 Q4" },
            { ref: "2024 P1 Q2" },
          ],
        },
        {
          name: "Compound Percentages",
          questions: [
            { question: `Write down the decimal multiplier you would use for:<br>(a) an increase of \\(6\\%\\)<br>(b) a decrease of \\(12\\%\\)`, answer: `(a) \\(1.06\\)<br>(b) \\(0.88\\)` },
            { question: `A caravan is worth \\(\\pounds 8400\\).<br>It depreciates by \\(9\\%\\) in one year.<br>Calculate its value after 1 year.`, answer: `\\(\\pounds 7644.00\\)` },
            { question: `\\(\\pounds 2500\\) is invested in a savings bond paying \\(3\\%\\) compound interest per year.<br>Calculate the value of the bond after 2 years.`, answer: `\\(\\pounds 2652.25\\)` },
            { question: `The population of a village is \\(8600\\).<br>It is expected to increase by \\(2.5\\%\\) each year for the next 5 years.<br>Calculate the expected population after 5 years.<br>Give your answer rounded to 3 significant figures.`, answer: `\\(9730\\) people` },
            { question: `A company buys machinery costing \\(\\pounds 24000\\).<br>The machinery depreciates by \\(18\\%\\) each year.<br>Calculate its value after 3 years.<br>Give your answer to the nearest pound.`, answer: `\\(\\pounds 13233\\)` },
            { question: `A forest covers an area of \\(320\\) hectares.<br>The area is decreasing by \\(6.5\\%\\) each year.<br>Calculate the area of the forest after 4 years.<br>Give your answer rounded to 3 significant figures.`, answer: `\\(245\\) hectares` },
            { question: `\\(\\pounds 5000\\) is invested in a fund.<br>The value increases by \\(4.5\\%\\) in the first year, then decreases by \\(2.1\\%\\) in each of the next 2 years.<br>Calculate the value of the fund after 3 years.<br>Give your answer rounded to 3 significant figures.`, answer: `\\(\\pounds 5010\\)` },
            { ref: "2018 P2 Q1" },
            { ref: "2019 P2 Q1" },
            { ref: "2022 P2 Q1" },
            { ref: "2023 P2 Q1" },
            { ref: "2024 P2 Q1" },
            { ref: "2025 P2 Q2" },
          ],
        },
        {
          name: "Ratio and Proportion",
          questions: [
            { question: `Simplify the ratio \\(18:24\\)`, answer: `\\(3:4\\)` },
            { question: `Share \\(\\pounds 450\\) in the ratio \\(4:5\\)`, answer: `\\(\\pounds 200\\) and \\(\\pounds 250\\)` },
            { question: `\\(6\\) pens cost \\(\\pounds 4.20\\).<br>Calculate the cost of \\(10\\) pens.`, answer: `\\(\\pounds 7.00\\)` },
            { question: `A recipe for \\(4\\) people uses \\(300\\) g of rice.<br>Calculate the mass of rice needed for \\(7\\) people.`, answer: `\\(525\\) g` },
            { question: `Concrete is mixed with cement, sand and gravel in the ratio \\(1:3:5\\).<br>A batch uses \\(45\\) kg of gravel.<br>Calculate the total mass of the batch.`, answer: `\\(81\\) kg` },
            { question: `It takes \\(3\\) pumps \\(8\\) hours to empty a tank.<br>Calculate how long it would take \\(4\\) pumps working at the same rate.`, answer: `\\(6\\) hours` },
            { ref: "2018 P2 Q6" },
            { ref: "2019 P1 Q11" },
            { ref: "2023 P1 Q4" },
            { ref: "2025 P1 Q9" },
          ],
        },
        {
          name: "Rounding",
          questions: [
            { question: `Round \\(3.7482\\) to:<br>(a) 2 decimal places<br>(b) 1 decimal place`, answer: `(a) \\(3.75\\)<br>(b) \\(3.7\\)` },
            { question: `Round \\(0.004879\\) to 2 significant figures.`, answer: `\\(0.0049\\)` },
            { question: `Round \\(47328\\) to 2 significant figures.`, answer: `\\(47000\\)` },
            { question: `Convert \\(\\frac{7}{12}\\) to a decimal.<br>Give your answer to 3 decimal places.`, answer: `\\(0.583\\)` },
            { question: `\\(260\\) pupils are going on a trip.<br>Each minibus carries \\(17\\) passengers.<br>Calculate the number of minibuses needed.`, answer: `\\(16\\) minibuses` },
            { question: `\\(\\pounds 100\\) is shared equally between \\(7\\) people.<br>Calculate how much each person receives.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 14.29\\)` },
            { ref: "2024 P2 Q2" },
            { ref: "2025 P2 Q1" },
          ],
        },
      ],
    },
    {
      id: "finance",
      title: "Finance",
      topics: [
        {
          name: "Income",
          questions: [
            { question: `A worker is paid \\(\\pounds 9.60\\) per hour and works \\(35\\) hours in a week.<br>Calculate their basic weekly pay.`, answer: `\\(\\pounds 336.00\\)` },
            { question: `An employee's basic rate of pay is \\(\\pounds 14\\) per hour.<br>Overtime is paid at time-and-a-half.<br>Calculate the overtime hourly rate.`, answer: `\\(\\pounds 21\\) per hour` },
            { question: `An annual salary of \\(\\pounds 31200\\) is paid in \\(12\\) equal monthly payments.<br>Calculate the monthly gross pay.`, answer: `\\(\\pounds 2600.00\\)` },
            { question: `Hannah's basic rate of pay is \\(\\pounds 10.80\\) per hour for a \\(38\\) hour week.<br>Last week she also worked \\(6\\) hours of overtime, paid at time-and-a-half.<br>Calculate her gross pay for last week.`, answer: `\\(\\pounds 507.60\\)` },
            { question: `Priya is paid a basic monthly salary of \\(\\pounds 1450\\).<br>She also earns \\(5\\%\\) commission on her monthly sales over \\(\\pounds 20000\\).<br>In May her sales were \\(\\pounds 47500\\).<br>Calculate her gross pay for May.`, answer: `\\(\\pounds 2825.00\\)` },
            { question: `Tom's basic rate of pay is \\(\\pounds 13.50\\) per hour.<br>He works \\(40\\) basic hours, then \\(4\\) hours paid at double time.<br>Calculate his gross pay for the week.`, answer: `\\(\\pounds 648.00\\)` },
            { question: `An employee has an annual salary of \\(\\pounds 27600\\).<br>She is awarded a bonus of \\(3.5\\%\\) of her salary.<br>Calculate her total pay for the year.`, answer: `\\(\\pounds 28566.00\\)` },
            { ref: "2019 P1 Q2(a)" },
            { ref: "2021 P1 Q5(a)" },
            { ref: "2022 P2 Q6(a)" },
            { ref: "2025 P1 Q6" },
            { ref: "2025 P2 Q9(d)" },
          ],
        },
        {
          name: "Deductions",
          questions: [
            { question: `An employee earns \\(\\pounds 28000\\) per year.<br>She pays \\(5\\%\\) of her salary into a pension.<br>Calculate her annual pension contribution.`, answer: `\\(\\pounds 1400.00\\)` },
            { question: `A worker's gross monthly pay is \\(\\pounds 2450\\).<br>His total monthly deductions are \\(\\pounds 613.50\\).<br>Calculate his monthly net pay.`, answer: `\\(\\pounds 1836.50\\)` },
            { question: `Ruth has an annual salary of \\(\\pounds 30000\\).<br>National Insurance is calculated on a person's salary before deductions such as pension contributions.<br>Annual National Insurance rates:<br>Up to \\(\\pounds 12570\\): \\(0\\%\\)<br>From \\(\\pounds 12570\\) to \\(\\pounds 50270\\): \\(12\\%\\)<br>Calculate Ruth's annual National Insurance payment.`, answer: `\\(\\pounds 2091.60\\)` },
            { question: `Callum has an annual salary of \\(\\pounds 58000\\).<br>Annual National Insurance rates:<br>Up to \\(\\pounds 12570\\): \\(0\\%\\)<br>From \\(\\pounds 12570\\) to \\(\\pounds 50270\\): \\(12\\%\\)<br>Over \\(\\pounds 50270\\): \\(2\\%\\)<br>Calculate Callum's annual National Insurance payment.`, answer: `\\(\\pounds 4678.60\\)` },
            { question: `Nadia has an annual salary of \\(\\pounds 33600\\).<br>Her annual income tax is \\(\\pounds 4206\\) and her annual National Insurance is \\(\\pounds 2523.60\\).<br>She also pays \\(6\\%\\) of her salary into a pension.<br>Calculate her monthly net pay.`, answer: `\\(\\pounds 2071.20\\)` },
            { question: `A worker's gross weekly pay is \\(\\pounds 620\\).<br>Each week he pays \\(\\pounds 62.40\\) income tax and \\(\\pounds 48.90\\) National Insurance.<br>He also pays \\(4\\%\\) of his gross pay into a pension.<br>Calculate his weekly net pay.`, answer: `\\(\\pounds 483.90\\)` },
            { ref: "2019 P2 Q10(c)" },
            { ref: "2021 P2 Q5" },
            { ref: "2022 P2 Q3" },
            { ref: "2024 P2 Q5" },
            { ref: "2025 P2 Q4" },
          ],
        },
        {
          name: "Budgeting and Best Deals",
          questions: [
            { question: `A household has a weekly income of \\(\\pounds 340\\) and weekly outgoings of \\(\\pounds 215\\).<br>Calculate how much is left each week.`, answer: `\\(\\pounds 125\\)` },
            { question: `A trader buys \\(12\\) items at \\(\\pounds 3.75\\) each and sells them all at \\(\\pounds 5.20\\) each.<br>Calculate the profit made.`, answer: `\\(\\pounds 17.40\\)` },
            { question: `Erin saves \\(\\pounds 68\\) each week towards a course costing \\(\\pounds 884\\).<br>Calculate the number of weeks it will take her to save enough.`, answer: `\\(13\\) weeks` },
            { question: `The same pens are sold in two shops.<br>Shop A: \\(6\\) pens for \\(\\pounds 7.20\\)<br>Shop B: \\(10\\) pens for \\(\\pounds 11.50\\)<br>Determine which shop gives the better value. Use your working to justify your answer.`, answer: `Shop A: \\(\\pounds 1.20\\) per pen<br>Shop B: \\(\\pounds 1.15\\) per pen<br>Shop B gives the better value.` },
            { question: `A cereal is sold in two sizes.<br>A \\(500\\) g pack costs \\(\\pounds 2.10\\)<br>A \\(1200\\) g pack costs \\(\\pounds 4.68\\)<br>Determine which pack is better value per \\(100\\) g. Use your working to justify your answer.`, answer: `\\(500\\) g pack: \\(\\pounds 0.42\\) per \\(100\\) g<br>\\(1200\\) g pack: \\(\\pounds 0.39\\) per \\(100\\) g<br>The \\(1200\\) g pack is better value.` },
            { question: `A stallholder buys \\(40\\) crates of fruit at \\(\\pounds 18\\) each.<br>She sells \\(32\\) crates at \\(\\pounds 26\\) each.<br>The remaining crates spoil and are thrown away.<br>Calculate her overall profit or loss.`, answer: `A profit of \\(\\pounds 112\\)` },
            { ref: "2018 P1 Q8" },
            { ref: "2023 P1 Q6" },
            { ref: "2023 P1 Q12" },
            { ref: "2024 P2 Q7(b)" },
            { ref: "2025 P1 Q2" },
          ],
        },
        {
          name: "Foreign Exchange",
          questions: [
            { question: `The exchange rate is \\(\\pounds 1 = 1.16\\) euros.<br>Convert \\(\\pounds 250\\) into euros.`, answer: `\\(290\\) euros` },
            { question: `The exchange rate is \\(\\pounds 1 = 1.16\\) euros.<br>Convert \\(464\\) euros into pounds.`, answer: `\\(\\pounds 400\\)` },
            { question: `The exchange rate is \\(\\pounds 1 = 9.85\\) Danish krone.<br>Convert \\(\\pounds 180\\) into Danish krone.`, answer: `\\(1773\\) krone` },
            { question: `The exchange rates are:<br>\\(\\pounds 1 = 1.27\\) US dollars<br>\\(\\pounds 1 = 1.15\\) euros<br>Convert \\(508\\) US dollars into euros.`, answer: `\\(460\\) euros` },
            { question: `Innes takes \\(\\pounds 600\\) to Sweden and changes it all into krona.<br>The exchange rate is \\(\\pounds 1 = 13.4\\) krona.<br>He spends \\(5360\\) krona.<br>He changes the rest back into pounds at the same rate.<br>Calculate how many pounds he receives.`, answer: `\\(\\pounds 200\\)` },
            { question: `The exchange rate is \\(\\pounds 1 = 1.18\\) euros.<br>A camera costs \\(767\\) euros.<br>Calculate the cost of the camera in pounds.`, answer: `\\(\\pounds 650\\)` },
            { ref: "2018 P1 Q7" },
            { ref: "2021 P2 Q3" },
            { ref: "2023 P2 Q6(a)" },
            { ref: "2024 P2 Q9(a)" },
            { ref: "2025 P2 Q7(b)" },
          ],
        },
        {
          name: "Saving and Borrowing",
          questions: [
            { question: `\\(\\pounds 1200\\) is invested for \\(1\\) year at \\(4\\%\\) simple interest.<br>Calculate the interest earned.`, answer: `\\(\\pounds 48\\)` },
            { question: `\\(\\pounds 2500\\) is invested for \\(2\\) years at \\(3\\%\\) simple interest per year.<br>Calculate the total interest earned.`, answer: `\\(\\pounds 150\\)` },
            { question: `Cara takes out a loan of \\(\\pounds 3600\\).<br>The interest plus the administration fee is \\(9\\%\\) of the loan amount.<br>The total is repaid in \\(12\\) equal monthly payments.<br>Calculate her monthly payment.`, answer: `\\(\\pounds 327\\)` },
            { question: `A sofa has a cash price of \\(\\pounds 1050\\).<br>It can also be bought with a deposit of \\(\\pounds 150\\) followed by \\(24\\) monthly payments of \\(\\pounds 38.50\\).<br>Calculate how much more the payment plan costs than the cash price.`, answer: `\\(\\pounds 24\\) more` },
            { question: `\\(\\pounds 5000\\) is invested in an account paying \\(2.8\\%\\) compound interest per year.<br>Calculate the value of the investment after \\(3\\) years.<br>Give your answer to the nearest pound.`, answer: `\\(\\pounds 5432\\)` },
            { question: `Marek buys \\(300\\) shares at \\(\\pounds 2.40\\) each.<br>He later sells \\(200\\) of them at \\(\\pounds 3.10\\) each and the remaining \\(100\\) at \\(\\pounds 1.95\\) each.<br>Calculate his overall profit or loss.`, answer: `A profit of \\(\\pounds 95\\)` },
            { ref: "2019 P1 Q2(b)" },
            { ref: "2019 P1 Q5" },
            { ref: "2021 P2 Q1" },
            { ref: "2023 P2 Q8(b)" },
            { ref: "2024 P2 Q8(d)" },
          ],
        },
      ],
    },
  ],
};
