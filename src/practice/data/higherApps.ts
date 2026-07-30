// Higher Applications of Maths guided practice.
//
// These questions are ours — there is no maths.scot equivalent for
// Applications — so they carry no `solutionUrl` and need no attribution.
// Entries with `ref` are past paper questions the site already holds:
// referenced, not restated, so each exam question exists once and carries its
// own marks, diagram, data files and video.
//
// Authored questions carry no marks. We do not invent Qualifications Scotland
// mark allocations; referenced questions keep the real ones.
//
// Statutory figures — the 2025/26 Scottish income tax bands and the National
// Insurance thresholds — are quoted in full in the questions that need them,
// exactly as the exam does, and are taken from the course notes rather than
// from memory.
//
// The two software topics, RStudio Workbook and Excel Skills, are deliberately
// absent: doing the work in the software is the point of them, and a text
// question with a numeric answer cannot ask for it. They belong to the RStudio
// workbook and the planned Excel workbook.
//
// Loaded with import() from the practice route only — never import this from a
// notes or paper page, or it lands in the shared bundle.
import type { PracticeCourse } from '../types';

export const higherAppsPractice: PracticeCourse = {
  courseId: 'higher-apps',
  sections: [
    {
      id: "finance",
      title: "Finance",
      topics: [
        {
          name: "Gross Income",
          questions: [
            { question: `An employee is paid an annual salary of \\(\\pounds 42600\\).<br>Calculate the gross monthly pay.`, answer: `\\(\\pounds 3550.00\\)` },
            { question: `A technician works \\(37.5\\) basic hours at \\(\\pounds 16.40\\) per hour.<br>She also works \\(6\\) hours of overtime, paid at time-and-a-half.<br>Calculate her gross pay for the week.`, answer: `\\(\\pounds 762.60\\)` },
            { question: `A sales adviser is paid a basic monthly salary of \\(\\pounds 1900\\).<br>She also earns \\(4\\%\\) commission on monthly sales above \\(\\pounds 25000\\).<br>Her sales for the month were \\(\\pounds 61000\\).<br>Calculate her gross pay for the month.`, answer: `\\(\\pounds 3340.00\\)` },
            { question: `Contract A pays \\(\\pounds 420\\) per week.<br>Contract B pays \\(\\pounds 1850\\) per month.<br>Assuming \\(52\\) weeks in a year, determine which contract pays more per year. Use your working to justify your answer.`, answer: `Contract A: \\(\\pounds 21840\\) per year<br>Contract B: \\(\\pounds 22200\\) per year<br>Contract B pays more.` },
          ],
        },
        {
          name: "National Insurance",
          questions: [
            { question: `National Insurance is calculated on gross pay, before any other deductions.<br>Monthly National Insurance rates:<br>Up to \\(\\pounds 1048\\): \\(0\\%\\)<br>Between \\(\\pounds 1048\\) and \\(\\pounds 4189\\): \\(8\\%\\)<br>Above \\(\\pounds 4189\\): \\(2\\%\\)<br>An employee has a gross monthly salary of \\(\\pounds 900\\).<br>Calculate her monthly National Insurance contribution.`, answer: `\\(\\pounds 0\\), as her pay is below the \\(\\pounds 1048\\) threshold.` },
            { question: `Monthly National Insurance rates:<br>Up to \\(\\pounds 1048\\): \\(0\\%\\)<br>Between \\(\\pounds 1048\\) and \\(\\pounds 4189\\): \\(8\\%\\)<br>Above \\(\\pounds 4189\\): \\(2\\%\\)<br>An employee has a gross monthly salary of \\(\\pounds 3600\\).<br>Calculate his monthly National Insurance contribution.`, answer: `\\(\\pounds 204.16\\)` },
            { question: `Monthly National Insurance rates:<br>Up to \\(\\pounds 1048\\): \\(0\\%\\)<br>Between \\(\\pounds 1048\\) and \\(\\pounds 4189\\): \\(8\\%\\)<br>Above \\(\\pounds 4189\\): \\(2\\%\\)<br>An employee has a gross monthly salary of \\(\\pounds 6200\\).<br>Calculate her monthly National Insurance contribution.`, answer: `\\(\\pounds 291.50\\)` },
            { question: `Monthly National Insurance rates:<br>Up to \\(\\pounds 1048\\): \\(0\\%\\)<br>Between \\(\\pounds 1048\\) and \\(\\pounds 4189\\): \\(8\\%\\)<br>Above \\(\\pounds 4189\\): \\(2\\%\\)<br>An employee has a gross annual salary of \\(\\pounds 51600\\) and pays \\(7\\%\\) of it into a pension.<br>Calculate her monthly National Insurance contribution.`, answer: `\\(\\pounds 253.50\\)<br>National Insurance is calculated before the pension is deducted.` },
          ],
        },
        {
          name: "Income Tax",
          questions: [
            { question: `Scottish income tax bands \\(2025/26\\):<br>Up to \\(\\pounds 12570\\): \\(0\\%\\)<br>\\(\\pounds 12570\\) to \\(\\pounds 15397\\): \\(19\\%\\)<br>\\(\\pounds 15397\\) to \\(\\pounds 27491\\): \\(20\\%\\)<br>An employee has a gross annual salary of \\(\\pounds 24000\\) and makes no pension contributions.<br>Calculate her annual income tax.`, answer: `\\(\\pounds 2257.73\\)` },
            { question: `Scottish income tax bands \\(2025/26\\):<br>Up to \\(\\pounds 12570\\): \\(0\\%\\)<br>\\(\\pounds 12570\\) to \\(\\pounds 15397\\): \\(19\\%\\)<br>\\(\\pounds 15397\\) to \\(\\pounds 27491\\): \\(20\\%\\)<br>\\(\\pounds 27491\\) to \\(\\pounds 43662\\): \\(21\\%\\)<br>An employee has a gross annual salary of \\(\\pounds 40000\\) and makes no pension contributions.<br>Calculate his annual income tax.`, answer: `\\(\\pounds 5582.82\\)` },
            { question: `Scottish income tax bands \\(2025/26\\):<br>Up to \\(\\pounds 12570\\): \\(0\\%\\)<br>\\(\\pounds 12570\\) to \\(\\pounds 15397\\): \\(19\\%\\)<br>\\(\\pounds 15397\\) to \\(\\pounds 27491\\): \\(20\\%\\)<br>\\(\\pounds 27491\\) to \\(\\pounds 43662\\): \\(21\\%\\)<br>An employee has a gross annual salary of \\(\\pounds 45000\\) and pays \\(5\\%\\) of it into a pension.<br>Income tax is calculated after the pension contribution is deducted.<br>Calculate her annual income tax.`, answer: `\\(\\pounds 6160.32\\)` },
            { question: `Scottish income tax bands \\(2025/26\\):<br>Up to \\(\\pounds 12570\\): \\(0\\%\\)<br>\\(\\pounds 12570\\) to \\(\\pounds 15397\\): \\(19\\%\\)<br>\\(\\pounds 15397\\) to \\(\\pounds 27491\\): \\(20\\%\\)<br>\\(\\pounds 27491\\) to \\(\\pounds 43662\\): \\(21\\%\\)<br>\\(\\pounds 43662\\) to \\(\\pounds 75000\\): \\(42\\%\\)<br>An employee has a gross annual salary of \\(\\pounds 60000\\) and makes no pension contributions.<br>Calculate his annual income tax.`, answer: `\\(\\pounds 13213.80\\)` },
            { ref: "2023 Q4" },
          ],
        },
        {
          name: "Deductions",
          questions: [
            { question: `An employee has a gross annual salary of \\(\\pounds 33600\\).<br>Student loan repayments are \\(9\\%\\) of any income above \\(\\pounds 27660\\) a year.<br>Calculate her annual student loan repayment.`, answer: `\\(\\pounds 534.60\\)` },
            { question: `An employee earns \\(\\pounds 48000\\) a year and contributes \\(5.5\\%\\) of her gross monthly salary into a pension.<br>Calculate her monthly pension contribution.`, answer: `\\(\\pounds 220.00\\)` },
            { question: `An employee has a gross monthly salary of \\(\\pounds 3200\\).<br>Her monthly deductions are income tax \\(\\pounds 412.50\\), National Insurance \\(\\pounds 172.16\\) and pension \\(\\pounds 192\\).<br>Calculate her monthly net pay.`, answer: `\\(\\pounds 2423.34\\)` },
            { question: `An employee has a gross annual salary of \\(\\pounds 45000\\).<br>Over the year she pays \\(\\pounds 6160.32\\) income tax, \\(\\pounds 3072\\) National Insurance and \\(\\pounds 2250\\) in pension contributions.<br>Calculate her annual net pay.`, answer: `\\(\\pounds 33517.68\\)` },
            { ref: "2022 Q8" },
            { ref: "2025 Q3" },
          ],
        },
        {
          name: "Other Taxes",
          questions: [
            { question: `A washing machine is sold for \\(\\pounds 432\\), including VAT at \\(20\\%\\).<br>Calculate the price before VAT was added.`, answer: `\\(\\pounds 360.00\\)` },
            { question: `A tradesperson charges \\(\\pounds 640\\) for a job, before VAT.<br>VAT is charged at \\(20\\%\\).<br>Calculate the total the customer pays.`, answer: `\\(\\pounds 768.00\\)` },
            { question: `The annual council tax for a Band C property is \\(\\pounds 1428\\).<br>A single occupant receives a \\(25\\%\\) discount.<br>Calculate the annual amount payable.`, answer: `\\(\\pounds 1071.00\\)` },
            { question: `The annual council tax for a property is \\(\\pounds 1560\\), paid in \\(10\\) equal monthly instalments.<br>Calculate each monthly instalment.`, answer: `\\(\\pounds 156.00\\)` },
          ],
        },
        {
          name: "Multipliers and Interest",
          questions: [
            { question: `Write down the decimal multiplier for:<br>(a) an increase of \\(3.4\\%\\)<br>(b) a decrease of \\(2.75\\%\\)`, answer: `(a) \\(1.034\\)<br>(b) \\(0.9725\\)` },
            { question: `\\(\\pounds 3800\\) is deposited in an account with an effective rate of interest of \\(2.6\\%\\) per year.<br>Calculate the value of the account after \\(1\\) year.`, answer: `\\(\\pounds 3898.80\\)` },
            { question: `\\(\\pounds 9200\\) is invested in an account with an effective rate of interest of \\(3.15\\%\\) per year.<br>Calculate the value of the investment after \\(4\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 10415.13\\)` },
            { question: `An investment of \\(\\pounds 7500\\) grows by \\(4.2\\%\\) in the first year and then by \\(1.9\\%\\) in the second year.<br>Calculate its value after \\(2\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 7963.49\\)` },
          ],
        },
        {
          name: "Interest with Varying Time Units",
          questions: [
            { question: `\\(\\pounds 4800\\) is deposited in an account with an effective rate of interest of \\(0.4\\%\\) per month.<br>Calculate the value of the account after \\(9\\) months.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4975.59\\)` },
            { question: `A loan of \\(\\pounds 15000\\) is charged an effective rate of interest of \\(1.6\\%\\) per quarter.<br>No repayments are made.<br>Calculate the amount owed after \\(2\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 17031.03\\)` },
            { question: `\\(\\pounds 6250\\) is invested in a bond with an effective rate of interest of \\(1.85\\%\\) per half-year.<br>Calculate the value of the bond after \\(3\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 6976.64\\)` },
            { question: `\\(\\pounds 2400\\) is deposited in an account with an effective rate of interest of \\(0.25\\%\\) per month.<br>Calculate the value of the account after \\(18\\) months.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 2510.33\\)` },
            { ref: "2022 Q1" },
            { ref: "2022 Q9" },
            { ref: "2024 Q1" },
            { ref: "2025 Q11" },
          ],
        },
        {
          name: "Combining Interest Rates",
          questions: [
            { question: `\\(\\pounds 5000\\) is invested. The effective rate of interest is \\(3.6\\%\\) per year for the first \\(2\\) years, then \\(2.1\\%\\) per year for the next \\(3\\) years.<br>Calculate the value of the investment after \\(5\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 5711.72\\)` },
            { question: `A loan of \\(\\pounds 4200\\) is charged an effective rate of interest of \\(0.9\\%\\) per month for \\(6\\) months, then \\(2.4\\%\\) per quarter for a further \\(2\\) quarters.<br>No repayments are made.<br>Calculate the amount owed at the end.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4647.25\\)` },
            { question: `\\(\\pounds 8000\\) is invested at an effective rate of interest of \\(1.4\\%\\) per half-year for \\(2\\) years, then \\(3.2\\%\\) per year for \\(1\\) year.<br>Calculate the value of the investment after \\(3\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 8728.14\\)` },
            { question: `\\(\\pounds 1500\\) is invested at an effective rate of interest of \\(2.5\\%\\) per year for \\(3\\) years, then \\(0.3\\%\\) per month for \\(4\\) months.<br>Calculate the value of the investment after the full period.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 1634.81\\)` },
            { ref: "2022 Q6" },
            { ref: "2023 Q7" },
          ],
        },
        {
          name: "Accumulation with Regular Payments",
          questions: [
            { question: `\\(\\pounds 400\\) is deposited at the start of each year for \\(3\\) years into an account with an effective rate of interest of \\(2\\%\\) per year.<br>Calculate the value of the account at the end of the \\(3\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 1248.64\\)` },
            { question: `\\(\\pounds 250\\) is deposited at the start of each year for \\(2\\) years into an account with an effective rate of interest of \\(1.5\\%\\) per year.<br>Calculate the value of the account at the end of the \\(2\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 511.31\\)` },
            { question: `\\(\\pounds 1000\\) is deposited at the start of each year for \\(4\\) years into an account with an effective rate of interest of \\(3\\%\\) per year.<br>Calculate the value of the account at the end of the \\(4\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4309.14\\)` },
            { question: `\\(\\pounds 600\\) is deposited at the start of each year for \\(3\\) years into an account with an effective rate of interest of \\(4\\%\\) per year.<br>Calculate the value of the account at the end of the \\(3\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 1947.88\\)` },
            { ref: "2022 Q4" },
            { ref: "Specimen Q10" },
          ],
        },
        {
          name: "Accumulation with Irregular Payments",
          questions: [
            { question: `An account has an effective rate of interest of \\(2\\%\\) per year.<br>\\(\\pounds 3000\\) is deposited at the start of year \\(1\\).<br>At the start of year \\(2\\) a further \\(\\pounds 1000\\) is deposited.<br>Calculate the value of the account at the end of year \\(2\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4141.20\\)` },
            { question: `An account has an effective rate of interest of \\(3\\%\\) per year.<br>\\(\\pounds 5000\\) is deposited at the start of year \\(1\\).<br>At the start of year \\(2\\), \\(\\pounds 800\\) is withdrawn.<br>Calculate the value of the account at the end of year \\(2\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4480.50\\)` },
            { question: `A loan of \\(\\pounds 10000\\) is charged an effective rate of interest of \\(4\\%\\) per year.<br>At the end of year \\(1\\) a repayment of \\(\\pounds 3000\\) is made.<br>Calculate the amount owed at the end of year \\(2\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 7696.00\\)` },
            { question: `An account has an effective rate of interest of \\(2.5\\%\\) per year.<br>\\(\\pounds 2000\\) is deposited at the start of year \\(1\\) and \\(\\pounds 2000\\) at the start of year \\(2\\).<br>At the start of year \\(3\\), \\(\\pounds 1500\\) is withdrawn.<br>Calculate the value of the account at the end of year \\(3\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 2717.53\\)` },
            { ref: "2023 Q11" },
            { ref: "2025 Q6" },
            { ref: "2025 Q8" },
          ],
        },
      ],
    },
  ],
};
