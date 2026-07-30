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
            { ref: "2024 Q7" },
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
            { ref: "2024 Q1" },
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
            { ref: "2024 Q5" },
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
          ],
        },
        {
          name: "Accumulation with Irregular Payments",
          questions: [
            { question: `An account has an effective rate of interest of \\(2\\%\\) per year.<br>\\(\\pounds 3000\\) is deposited at the start of year \\(1\\).<br>At the start of year \\(2\\) a further \\(\\pounds 1000\\) is deposited.<br>Calculate the value of the account at the end of year \\(2\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4141.20\\)` },
            { question: `An account has an effective rate of interest of \\(3\\%\\) per year.<br>\\(\\pounds 5000\\) is deposited at the start of year \\(1\\).<br>At the start of year \\(2\\), \\(\\pounds 800\\) is withdrawn.<br>Calculate the value of the account at the end of year \\(2\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4480.50\\)` },
            { question: `A loan of \\(\\pounds 10000\\) is charged an effective rate of interest of \\(4\\%\\) per year.<br>At the end of year \\(1\\) a repayment of \\(\\pounds 3000\\) is made.<br>Calculate the amount owed at the end of year \\(2\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 7696.00\\)` },
            { question: `An account has an effective rate of interest of \\(2.5\\%\\) per year.<br>\\(\\pounds 2000\\) is deposited at the start of year \\(1\\) and \\(\\pounds 2000\\) at the start of year \\(2\\).<br>At the start of year \\(3\\), \\(\\pounds 1500\\) is withdrawn.<br>Calculate the value of the account at the end of year \\(3\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 2717.53\\)` },
            { ref: "2025 Q8" },
          ],
        },
        {
          name: "Converting Time Frequencies",
          questions: [
            { question: `A credit card charges an effective rate of interest of \\(1.4\\%\\) per month.<br>Calculate the annual effective rate of interest.<br>Give your answer as a percentage to 1 decimal place.`, answer: `\\(18.2\\%\\)` },
            { question: `A savings account offers an effective rate of interest of \\(5.2\\%\\) per year.<br>Calculate the monthly effective rate of interest.<br>Give your answer as a percentage to 3 decimal places.`, answer: `\\(0.423\\%\\)` },
            { question: `An account offers an effective rate of interest of \\(2.4\\%\\) per quarter.<br>Calculate the annual effective rate of interest.<br>Give your answer as a percentage to 2 decimal places.`, answer: `\\(9.95\\%\\)` },
            { question: `A bond offers an effective rate of interest of \\(3.6\\%\\) per half-year.<br>Calculate the monthly effective rate of interest.<br>Give your answer as a percentage to 3 decimal places.`, answer: `\\(0.591\\%\\)` },
          ],
        },
        {
          name: "Start and End Values",
          questions: [
            { question: `An investment of \\(\\pounds 3500\\) grows to \\(\\pounds 3950\\) over \\(4\\) years.<br>Calculate the annual effective rate of interest.<br>Give your answer as a percentage to 2 decimal places.`, answer: `\\(3.07\\%\\)` },
            { question: `A deposit of \\(\\pounds 8200\\) grows to \\(\\pounds 9100\\) over \\(30\\) months.<br>Calculate the monthly effective rate of interest.<br>Give your answer as a percentage to 3 decimal places.`, answer: `\\(0.348\\%\\)` },
            { question: `\\(\\pounds 600\\) is borrowed and no repayments are made.<br>After \\(7\\) months the amount owed is \\(\\pounds 693\\).<br>Calculate the monthly effective rate of interest.<br>Give your answer as a percentage to 2 decimal places.`, answer: `\\(2.08\\%\\)` },
            { question: `An account pays an effective rate of interest of \\(3\\%\\) per year.<br>After \\(5\\) years the balance is \\(\\pounds 9280\\).<br>Calculate the amount originally deposited.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 8005.01\\)` },
          ],
        },
        {
          name: "Present Value",
          questions: [
            { question: `An account pays an effective rate of interest of \\(3\\%\\) per year.<br>Calculate the amount that must be deposited now to have \\(\\pounds 12000\\) in \\(3\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 10981.70\\)` },
            { question: `An account pays an effective rate of interest of \\(0.4\\%\\) per month.<br>Calculate the amount that must be deposited now to have \\(\\pounds 15000\\) in \\(24\\) months.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 13629.57\\)` },
            { question: `A bond pays an effective rate of interest of \\(1.9\\%\\) per half-year.<br>Calculate the amount that must be invested now to have \\(\\pounds 7000\\) in \\(8\\) half-years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 6021.50\\)` },
            { question: `An investment matured after \\(42\\) months at \\(\\pounds 9600\\).<br>The account paid an effective rate of interest of \\(0.35\\%\\) per month.<br>Calculate the amount originally invested.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 8289.75\\)` },
          ],
        },
        {
          name: "Present Value with Variable Rates",
          questions: [
            { question: `A savings bond paid an effective rate of interest of \\(2\\%\\) in the first year, \\(3\\%\\) in the second year and \\(2.5\\%\\) in the third year.<br>After \\(3\\) years the balance was \\(\\pounds 8000\\).<br>Calculate the amount originally deposited.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 7428.97\\)` },
            { question: `An account paid an effective rate of interest of \\(1.5\\%\\) per year for \\(2\\) years and then \\(2.2\\%\\) per year for \\(2\\) years.<br>After \\(4\\) years the balance was \\(\\pounds 5400\\).<br>Calculate the amount originally deposited.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 5018.34\\)` },
            { question: `An account paid an effective rate of interest of \\(0.5\\%\\) per month for \\(6\\) months and then \\(0.3\\%\\) per month for \\(6\\) months.<br>After \\(12\\) months the balance was \\(\\pounds 3200\\).<br>Calculate the amount originally deposited.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 3050.34\\)` },
            { question: `A corporate account paid an effective rate of interest of \\(4\\%\\) in the first year and \\(1.8\\%\\) in the second year.<br>After \\(2\\) years the balance was \\(\\pounds 4500\\).<br>Calculate the amount originally deposited.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 4250.42\\)` },
          ],
        },
        {
          name: "Investment Schedules",
          questions: [
            { question: `An account pays an effective rate of interest of \\(4.8\\%\\) per year.<br>Calculate the monthly effective rate of interest.<br>Give your answer as a percentage to 4 decimal places.`, answer: `\\(0.3914\\%\\)` },
            { question: `An investment schedule starts with \\(\\pounds 2000\\).<br>The monthly effective rate of interest is \\(0.4\\%\\) and \\(\\pounds 100\\) is added at the end of each month.<br>Calculate the balance at the end of month \\(1\\).<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 2108.00\\)` },
            { question: `An investment schedule starts with \\(\\pounds 3000\\).<br>The monthly effective rate of interest is \\(0.4\\%\\) and \\(\\pounds 100\\) is added at the end of each month.<br>Calculate the balance at the end of the second month.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 3224.45\\)` },
            { question: `An account pays an effective rate of interest of \\(0.25\\%\\) per month.<br>A balance of \\(\\pounds 5000\\) has \\(\\pounds 250\\) added at the end of each month.<br>Calculate the balance at the end of the second month.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 5525.66\\)` },
            { ref: "Specimen Q10" },
          ],
        },
        {
          name: "Loans and Loan Schedules",
          questions: [
            { question: `A loan of \\(\\pounds 8000\\) has a monthly effective rate of interest of \\(0.6\\%\\).<br>A repayment of \\(\\pounds 250\\) is made at the end of each month.<br>Calculate the balance owed after \\(1\\) month.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 7798.00\\)` },
            { question: `A loan of \\(\\pounds 9000\\) has a monthly effective rate of interest of \\(0.6\\%\\).<br>A repayment of \\(\\pounds 250\\) is made at the end of each month.<br>Calculate the balance owed after the second month.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 8606.82\\)` },
            { question: `A loan has an annual effective rate of interest of \\(9\\%\\).<br>Calculate the monthly effective rate of interest.<br>Give your answer as a percentage to 3 decimal places.`, answer: `\\(0.721\\%\\)` },
            { question: `A loan of \\(\\pounds 3000\\) has a monthly effective rate of interest of \\(1.2\\%\\).<br>A repayment of \\(\\pounds 420\\) is made at the end of each month.<br>Calculate the balance owed after the third month.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 1834.12\\)` },
            { ref: "2022 Q1" },
            { ref: "2022 Q9" },
            { ref: "2023 Q11" },
            { ref: "2024 Q1" },
            { ref: "2025 Q11" },
            { ref: "2024 Q9" },
          ],
        },
        {
          name: "Inflation",
          questions: [
            { question: `The Consumer Price Index was \\(108.6\\) in August \\(2019\\) and \\(130.2\\) in August \\(2023\\).<br>Calculate the total percentage increase in prices over that period.<br>Give your answer to 1 decimal place.`, answer: `\\(19.9\\%\\)` },
            { question: `The Consumer Price Index rose from a baseline of \\(100\\) to \\(121.8\\).<br>Calculate what \\(\\pounds 500\\) at the baseline is worth in real terms at the later date.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 410.51\\)` },
            { question: `Prices rose by \\(3.1\\%\\), then \\(2.4\\%\\), then \\(1.8\\%\\) in three successive years.<br>Calculate the overall percentage increase over the three years.<br>Give your answer to 2 decimal places.`, answer: `\\(7.47\\%\\)` },
            { question: `An item cost \\(\\pounds 240\\) and inflation over the next \\(4\\) years averaged \\(2.6\\%\\) per year.<br>Calculate the expected cost of the item after \\(4\\) years.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 265.95\\)` },
            { ref: "2023 Q9" },
          ],
        },
        {
          name: "Pension Savings",
          questions: [
            { question: `An employee earns \\(\\pounds 36000\\) a year and contributes \\(5\\%\\) of it to a pension.<br>The employer contributes a further \\(3\\%\\) of the salary.<br>Calculate the total annual amount paid into the pension.`, answer: `\\(\\pounds 2880.00\\)` },
            { question: `A Lifetime ISA pays a government bonus of \\(25\\%\\) on each deposit.<br>A saver deposits \\(\\pounds 4000\\) in a year.<br>Calculate the total added to the account that year.`, answer: `\\(\\pounds 5000.00\\)` },
            { question: `A pension pot of \\(\\pounds 240000\\) pays an effective rate of interest of \\(3\\%\\) per year.<br>\\(\\pounds 15000\\) is withdrawn at the end of each year.<br>Calculate the value of the pot after \\(1\\) year.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 232200.00\\)` },
            { question: `A pension pot of \\(\\pounds 180000\\) pays an effective rate of interest of \\(3\\%\\) per year.<br>\\(\\pounds 12000\\) is withdrawn at the end of each year.<br>Calculate the value of the pot after the second year.<br>Give your answer to the nearest penny.`, answer: `\\(\\pounds 166602.00\\)` },
            { ref: "2025 Q6" },
          ],
        },
        {
          name: "Insurance",
          questions: [
            { question: `A phone insurance policy has a compulsory excess of \\(\\pounds 150\\).<br>A repair is quoted at \\(\\pounds 420\\).<br>Calculate the amount the insurer pays.`, answer: `\\(\\pounds 270.00\\)` },
            { question: `A policy has an excess of \\(\\pounds 195\\).<br>A repair is quoted at \\(\\pounds 180\\).<br>Determine whether it is worth making a claim. Use your working to justify your answer.`, answer: `The repair costs \\(\\pounds 180\\), which is less than the \\(\\pounds 195\\) excess.<br>It is not worth claiming, as the policyholder would pay the full cost anyway.` },
            { question: `Policy A costs \\(\\pounds 320\\) a year with an excess of \\(\\pounds 100\\).<br>Policy B costs \\(\\pounds 260\\) a year with an excess of \\(\\pounds 250\\).<br>One claim is made during the year.<br>Determine which policy costs the customer less in total. Use your working to justify your answer.`, answer: `Policy A: \\(\\pounds 420\\)<br>Policy B: \\(\\pounds 510\\)<br>Policy A costs less.` },
            { question: `An annual insurance premium is \\(\\pounds 480\\).<br>Paying monthly adds \\(7.5\\%\\) to the total.<br>Calculate the total cost if paid monthly.`, answer: `\\(\\pounds 516.00\\)` },
          ],
        },
      ],
    },
    {
      id: "modelling",
      title: "Mathematical Modelling",
      topics: [
        {
          name: "Introduction to Modelling",
          questions: [
            { question: `A council wants to model the total number of wheelie bins it will empty in a town during one year.<br>State three sensible assumptions it would need to make.`, answer: `e.g.<br>Every household has exactly one bin.<br>Every bin is emptied once a fortnight.<br>No collections are missed for holidays or bad weather.<br>The number of households does not change during the year.` },
            { question: `A café owner wants to model the total number of cups of coffee sold in a typical week.<br>State three sensible assumptions they would need to make.`, answer: `e.g.<br>The café opens the same number of hours every day.<br>The same average number of customers arrives each day.<br>Every customer buys exactly one cup.<br>Trade does not change with the weather or the time of year.` },
            { question: `A cyclist wants to model the total distance they will cycle commuting to work in one year.<br>State three sensible assumptions they would need to make.`, answer: `e.g.<br>They cycle to work and back on every working day.<br>They take the same route each time.<br>They work a fixed number of days per year.<br>They never travel by another means of transport.` },
            { question: `A school wants to model the electricity used by its classroom lights over one year.<br>State three sensible assumptions it would need to make.`, answer: `e.g.<br>Every classroom has the same number of lights.<br>The lights are on for the same number of hours each school day.<br>All lights use the same power.<br>The lights are switched off during holidays.` },
            { question: `Explain what is meant by a mathematical model.<br>State one reason why a model may not give an exact answer.`, answer: `A mathematical model is a description of a real situation using mathematics, used to make predictions.<br>It cannot be exact because it relies on assumptions that simplify the real situation, and real data varies.` },
          ],
        },
        {
          name: "Fermi Estimations",
          questions: [
            { question: `Estimate the total number of breaths a typical person takes in one day.<br>State any assumptions you make.`, answer: `e.g. Assume \\(14\\) breaths per minute.<br>\\(14 \\times 60 \\times 24 = 20160\\) breaths.` },
            { question: `Estimate the total distance, in kilometres, a pupil walks to and from school during one school year.<br>State any assumptions you make.`, answer: `e.g. Assume \\(1.2\\) km each way and \\(190\\) school days.<br>\\(2 \\times 1.2 \\times 190 = 456\\) km.` },
            { question: `Estimate the total number of slices of bread eaten by a family in one year.<br>State any assumptions you make.`, answer: `e.g. Assume \\(4\\) people eating \\(3\\) slices per day.<br>\\(4 \\times 3 \\times 365 = 4380\\) slices.` },
            { question: `Estimate the total number of litres of water used by the showers in one household during a year.<br>State any assumptions you make.`, answer: `e.g. Assume \\(4\\) people, one \\(8\\) minute shower each per day, at \\(10\\) litres per minute.<br>\\(4 \\times 8 \\times 10 \\times 365 = 116800\\) litres.` },
            { question: `A school uses approximately \\(45000\\) sheets of paper in one year.<br>Estimate the number of sheets used per pupil per week.<br>State any assumptions you make.`, answer: `e.g. Assume \\(800\\) pupils and \\(38\\) school weeks.<br>\\(800 \\times 38 = 30400\\)<br>\\(45000 \\div 30400 = 1.48...\\), about \\(1.5\\) sheets per pupil per week.` },
            { question: `Estimate the total number of words in a full-length novel.<br>State any assumptions you make.`, answer: `e.g. Assume \\(350\\) pages with \\(300\\) words per page.<br>\\(350 \\times 300 = 105000\\) words.` },
            { ref: "2023 Q1" },
            { ref: "2025 Q1" },
            { ref: "Specimen Q1" },
          ],
        },
        {
          name: "Modelling Situations With Graphs",
          questions: [
            { question: `A taxi charges a fixed booking fee of \\(\\pounds 3.50\\), plus \\(\\pounds 1.80\\) for every mile travelled.<br>A graph is drawn to model the total cost of a journey.<br>Identify the independent and the dependent variable, and state which axis each is plotted on.`, answer: `Independent variable: distance travelled, in miles — plotted on the horizontal axis.<br>Dependent variable: total cost, in pounds — plotted on the vertical axis.` },
            { question: `A cylindrical barrel is filled with water from a tap running at a constant rate.<br>Describe the shape of the graph of the depth of water against time.`, answer: `A straight line with a positive gradient.<br>The barrel has the same width all the way up, so the depth increases at a constant rate.` },
            { question: `A vase is narrow at the bottom and widens steadily towards the top.<br>Water is poured in at a constant rate.<br>Describe the shape of the graph of the depth of water against time.`, answer: `A curve that rises steeply at first and then becomes less steep.<br>While the vase is narrow the depth increases quickly; as it widens the same volume of water raises the depth by less.` },
            { question: `A mobile phone is fully charged and then used until the battery is flat.<br>Identify the independent and the dependent variable in a graph modelling this.`, answer: `Independent variable: time.<br>Dependent variable: the charge remaining in the battery.` },
            { question: `The graph of the total cost of a taxi journey against distance travelled is a straight line that does not pass through the origin.<br>Explain what the intercept on the vertical axis represents.`, answer: `It is the fixed booking fee — the cost of the journey before any distance has been travelled.` },
            { question: `A car starts from rest, accelerates to a steady speed on a motorway, slows to a stop at a junction, then travels at a lower steady speed through a town.<br>Describe the shape of the graph of speed against time.`, answer: `It rises from zero, then is horizontal at the motorway speed, then falls to zero at the junction, then rises to a lower value and is horizontal at the town speed.` },
            { ref: "Specimen Q6" },
            { ref: "2023 Q10" },
          ],
        },
        {
          name: "Units of Measure",
          questions: [
            { question: `A model uses the formula \\(D = \\frac{M}{V}\\).<br>\\(M\\) is measured in kilograms (kg) and \\(V\\) is measured in cubic metres (m\\(^3\\)).<br>Deduce the units of measure for \\(D\\).`, answer: `kg/m\\(^3\\) (kilograms per cubic metre).` },
            { question: `A model uses the formula \\(W = F \\times d\\).<br>\\(F\\) is measured in newtons (N) and \\(d\\) is measured in metres (m).<br>Deduce the units of measure for \\(W\\).`, answer: `N m (newton metres).` },
            { question: `A model uses the formula \\(E = P \\times t\\).<br>\\(P\\) is measured in litres per hour and \\(t\\) is measured in hours.<br>Deduce the units of measure for \\(E\\).`, answer: `Litres.<br>The hours cancel: litres per hour \\(\\times\\) hours \\(=\\) litres.` },
            { question: `A tap fills a container at a constant rate.<br>\\(45\\) litres flow into the container in \\(90\\) seconds.<br>Calculate the rate at which the container fills.<br>Your answer must include appropriate units.`, answer: `\\(45 \\div 90 = 0.5\\)<br>\\(0.5\\) litres per second.` },
            { question: `Van A uses \\(14\\) litres of fuel on its delivery route.<br>Van B uses \\(21\\) litres of fuel on its delivery route.<br>A manager concludes that Van A has the more efficient engine.<br>Explain why this conclusion is not valid.`, answer: `The distances the two vans travelled are not given.<br>Fuel efficiency must be compared as fuel used per unit of distance, for example litres per 100 km, not by total fuel used.` },
            { question: `A square patio of side \\(3\\) metres takes \\(2\\) hours to lay.<br>A builder estimates that a square patio of side \\(6\\) metres will take \\(4\\) hours, because the length has doubled.<br>Explain why this estimate is wrong, and calculate a better estimate.`, answer: `The time depends on the area, not the length.<br>Area of the first patio \\(= 9\\) m\\(^2\\); area of the second \\(= 36\\) m\\(^2\\), which is \\(4\\) times as large.<br>A better estimate is \\(2 \\times 4 = 8\\) hours.` },
            { ref: "2024 Q10" },
          ],
        },
        {
          name: "Errors and Tolerance",
          questions: [
            { question: `A component is manufactured to a length of \\(250\\) mm with a tolerance of \\(\\pm 5\\) mm.<br>(a) State the absolute error.<br>(b) Calculate the relative error, as a percentage.`, answer: `(a) \\(5\\) mm<br>(b) \\(\\frac{5}{250} = 0.02 = 2\\%\\)` },
            { question: `A bag of sugar is labelled \\(1000\\) g with a tolerance of \\(\\pm 15\\) g.<br>Calculate the relative error, as a percentage.`, answer: `\\(\\frac{15}{1000} = 0.015 = 1.5\\%\\)` },
            { question: `A parcel is advertised as weighing \\(4.5\\) kg with a tolerance of \\(\\pm 0.2\\) kg.<br>State the maximum and the minimum acceptable weight.`, answer: `Maximum \\(4.7\\) kg<br>Minimum \\(4.3\\) kg` },
            { question: `A rectangular plot is measured as \\(18\\) m \\(\\pm 0.3\\) m by \\(12\\) m \\(\\pm 0.2\\) m.<br>Calculate the maximum possible area of the plot.`, answer: `\\(18.3 \\times 12.2 = 223.26\\) m\\(^2\\)` },
            { question: `A rectangular plot is measured as \\(18\\) m \\(\\pm 0.3\\) m by \\(12\\) m \\(\\pm 0.2\\) m.<br>Calculate the minimum possible area of the plot.`, answer: `\\(17.7 \\times 11.8 = 208.86\\) m\\(^2\\)` },
            { question: `A drone flies a distance of \\(9\\) km \\(\\pm 0.4\\) km in a time of \\(30\\) minutes \\(\\pm 1\\) minute.<br>Calculate the maximum possible average speed of the drone, in km/minute.<br>Give your answer to 3 decimal places.`, answer: `Maximum speed uses the maximum distance and the minimum time.<br>\\(\\frac{9.4}{29} = 0.324\\) km/minute` },
            { question: `The length, width and height of a tank are measured with relative errors of \\(2\\%\\), \\(3\\%\\) and \\(1.5\\%\\).<br>The volume is found by multiplying the three measurements.<br>Estimate the relative error in the volume.`, answer: `\\(2 + 3 + 1.5 = 6.5\\%\\)` },
            { question: `The true mass of a sample is \\(47.6\\) g.<br>A balance reports the mass as \\(47.9\\) g.<br>(a) State the absolute error.<br>(b) Calculate the relative error, as a percentage to 1 decimal place.`, answer: `(a) \\(47.9 - 47.6 = 0.3\\) g<br>(b) \\(\\frac{0.3}{47.6} = 0.0063... = 0.6\\%\\)` },
            { question: `A square tile has a side measured as \\(30\\) cm \\(\\pm 0.5\\) cm.<br>Calculate the maximum possible area of the tile.`, answer: `\\(30.5^2 = 930.25\\) cm\\(^2\\)` },
            { question: `A machine part should measure \\(60.00\\) mm.<br>Machine A produces parts measuring \\(60.4\\), \\(60.5\\) and \\(60.4\\) mm.<br>Machine B produces parts measuring \\(59.7\\), \\(60.3\\) and \\(60.0\\) mm.<br>State which machine is more precise and which is more accurate. Justify your answer.`, answer: `Machine A is more precise: its measurements are tightly grouped, with a range of only \\(0.1\\) mm.<br>Machine B is more accurate: its measurements average \\(60.0\\) mm, which is the target, while Machine A's average \\(60.43\\) mm is always too large.` },
          ],
        },
        {
          name: "Recurrence Relations",
          questions: [
            { question: `A population of \\(7400\\) decreases by \\(12\\%\\) each year.<br>At the end of each year \\(260\\) individuals join the population.<br>Write down a recurrence relation to model the population.`, answer: `\\(u_{n+1} = 0.88u_n + 260\\), with \\(u_0 = 7400\\)` },
            { question: `A savings account contains \\(\\pounds 2000\\).<br>Each year \\(4\\%\\) interest is added and then \\(\\pounds 150\\) is withdrawn.<br>Write down a recurrence relation to model the balance.`, answer: `\\(u_{n+1} = 1.04u_n - 150\\), with \\(u_0 = 2000\\)` },
            { question: `A recurrence relation is \\(u_{n+1} = 0.7u_n + 60\\), with \\(u_0 = 400\\).<br>Calculate \\(u_1\\) and \\(u_2\\).`, answer: `\\(u_1 = 0.7 \\times 400 + 60 = 340\\)<br>\\(u_2 = 0.7 \\times 340 + 60 = 298\\)` },
            { question: `A lake contains \\(12000\\) fish.<br>Each year \\(15\\%\\) of the fish are caught and \\(1500\\) young fish are added.<br>Calculate the number of fish after \\(3\\) years.<br>Give your answer to the nearest whole fish.`, answer: `\\(u_1 = 0.85 \\times 12000 + 1500 = 11700\\)<br>\\(u_2 = 0.85 \\times 11700 + 1500 = 11445\\)<br>\\(u_3 = 0.85 \\times 11445 + 1500 = 11228.25\\)<br>\\(11228\\) fish` },
            { question: `A tank holds \\(800\\) litres of liquid.<br>Each day \\(20\\%\\) of the liquid evaporates and \\(100\\) litres are added.<br>(a) Write down a recurrence relation to model the volume in the tank.<br>(b) Describe how to use a spreadsheet to find what happens to the volume in the long term, and state the outcome.`, answer: `(a) \\(80\\%\\) remains, so \\(u_{n+1} = 0.8u_n + 100\\), with \\(u_0 = 800\\).<br>(b) Enter \\(800\\) in a cell. In the cell below, enter a formula that multiplies the cell above by \\(0.8\\) and adds \\(100\\), then drag it down the column.<br>Reading down the extended list, the volume levels out at approximately \\(500\\) litres.` },
            { question: `A spreadsheet models the mass of a chemical in a tank using \\(u_{n+1} = 0.6u_n + 200\\), starting with \\(u_0 = 1000\\) grams.<br>Calculate the next three values the spreadsheet will display.`, answer: `\\(u_1 = 0.6 \\times 1000 + 200 = 800\\)<br>\\(u_2 = 0.6 \\times 800 + 200 = 680\\)<br>\\(u_3 = 0.6 \\times 680 + 200 = 608\\) grams` },
            { question: `A forest contains \\(40000\\) trees.<br>Each year \\(8\\%\\) of the trees are felled and \\(2000\\) saplings are planted.<br>(a) Calculate the number of trees after \\(2\\) years.<br>(b) Describe how a spreadsheet could be used to find the number of trees in the forest in the long term.`, answer: `(a) \\(u_1 = 0.92 \\times 40000 + 2000 = 38800\\)<br>\\(u_2 = 0.92 \\times 38800 + 2000 = 37696\\) trees<br>(b) Enter \\(40000\\) in a cell, then in the cell below enter a formula multiplying the cell above by \\(0.92\\) and adding \\(2000\\). Drag the formula down the column.<br>The extended list shows the number of trees levelling out at approximately \\(25000\\).` },
            { question: `An orchard is sprayed weekly with a pesticide that destroys \\(60\\%\\) of the pests.<br>Between sprayings \\(500\\) new pests arrive.<br>There are \\(3000\\) pests before the first spraying.<br>Calculate the number of pests after \\(2\\) weeks.`, answer: `\\(u_1 = 0.4 \\times 3000 + 500 = 1700\\)<br>\\(u_2 = 0.4 \\times 1700 + 500 = 1180\\) pests` },
            { question: `A spreadsheet models the recurrence relation \\(u_{n+1} = 0.86u_n + 120\\).<br>Cell B2 holds the starting value.<br>Cell D1 holds the multiplier \\(0.86\\) and cell D2 holds \\(120\\).<br>Write down the formula that should be entered in cell B3 so that it can be filled down the column.`, answer: `<code>=B2*$D$1+$D$2</code><br>The dollar signs fix cells D1 and D2 so they do not change as the formula is filled down.` },
            { ref: "2022 Q5" },
            { ref: "2023 Q8" },
            { ref: "2024 Q4" },
          ],
        },
        {
          name: "Linear Relationships",
          questions: [
            { question: `A gym charges a joining fee of \\(\\pounds 30\\), plus \\(\\pounds 22\\) for each month of membership.<br>Write down a formula for the total cost \\(C\\), in pounds, after \\(m\\) months.`, answer: `\\(C = 30 + 22m\\)` },
            { question: `The total cost of gym membership is modelled by \\(C = 30 + 22m\\), where \\(m\\) is the number of months.<br>Calculate the total cost after \\(9\\) months.`, answer: `\\(C = 30 + 22 \\times 9 = 228\\)<br>\\(\\pounds 228\\)` },
            { question: `A tank contains \\(950\\) litres of water and drains at a constant rate of \\(35\\) litres per minute.<br>Write down a formula for the volume \\(V\\), in litres, remaining after \\(t\\) minutes.`, answer: `\\(V = 950 - 35t\\)` },
            { question: `The volume of water in a tank is modelled by \\(V = 950 - 35t\\), where \\(t\\) is the time in minutes.<br>Calculate the volume remaining after \\(12\\) minutes.`, answer: `\\(V = 950 - 35 \\times 12 = 530\\)<br>\\(530\\) litres` },
            { question: `The volume of water in a tank is modelled by \\(V = 950 - 35t\\), where \\(t\\) is the time in minutes.<br>State the gradient of this model and explain what it tells you in this context.`, answer: `The gradient is \\(-35\\).<br>The volume of water in the tank decreases by \\(35\\) litres for every minute that passes.` },
            { question: `One firm charges a call-out fee of \\(\\pounds 48\\) plus \\(\\pounds 26\\) per hour.<br>A rival charges a call-out fee of \\(\\pounds 75\\) plus \\(\\pounds 17\\) per hour.<br>Determine which firm is cheaper for a job lasting \\(4\\) hours. Use your working to justify your answer.`, answer: `First firm: \\(C = 48 + 26 \\times 4 = 152\\)<br>Rival: \\(C = 75 + 17 \\times 4 = 143\\)<br>The rival is cheaper, at \\(\\pounds 143\\).` },
            { question: `A streaming service has \\(1800\\) subscribers and gains \\(145\\) new subscribers each week.<br>(a) Write down a formula for the number of subscribers \\(S\\) after \\(w\\) weeks.<br>(b) Calculate the number of subscribers after \\(15\\) weeks.`, answer: `(a) \\(S = 1800 + 145w\\)<br>(b) \\(S = 1800 + 145 \\times 15 = 3975\\) subscribers` },
            { question: `The number of items left in a warehouse is modelled by \\(N = 240 - 24d\\), where \\(d\\) is the number of days.<br>(a) State the number of items at the start.<br>(b) Calculate the number of items left after \\(6\\) days.`, answer: `(a) \\(240\\) items — this is the value of \\(N\\) when \\(d = 0\\).<br>(b) \\(N = 240 - 24 \\times 6 = 96\\) items` },
            { ref: "2025 Q10" },
          ],
        },
        {
          name: "Quadratic Relationships",
          questions: [
            { question: `The height \\(h\\), in metres, of an object after \\(t\\) seconds is modelled by \\(h = 40t - 5t^2\\).<br>Calculate the height after \\(3\\) seconds.`, answer: `\\(h = 40 \\times 3 - 5 \\times 3^2 = 120 - 45 = 75\\)<br>\\(75\\) metres` },
            { question: `The height \\(h\\), in metres, of an object after \\(t\\) seconds is modelled by \\(h = 40t - 5t^2\\).<br>Calculate the height after \\(8\\) seconds and interpret your answer.`, answer: `\\(h = 40 \\times 8 - 5 \\times 8^2 = 320 - 320 = 0\\)<br>The height is \\(0\\) metres, so the object has returned to the ground.` },
            { question: `A quadratic model is \\(y = 12 + 5x - x^2\\).<br>Calculate \\(y\\) when \\(x = 4\\).`, answer: `\\(y = 12 + 20 - 16 = 16\\)` },
            { question: `A spreadsheet is used to model \\(y = 15 + 4x - 2x^2\\).<br>Column A holds the \\(x\\) values, with the first value in cell A2.<br>Write down the formula to enter in cell B2 to calculate \\(y\\).`, answer: `<code>=15+4*A2-2*A2^2</code><br>In a spreadsheet <code>*</code> is used for multiply and <code>^</code> for a power.` },
            { question: `A distress flare is fired vertically.<br>Its height \\(h\\), in metres, after \\(t\\) seconds is modelled by \\(h = 60t - 5t^2\\).<br>Calculate the height of the flare after \\(10\\) seconds.`, answer: `\\(h = 60 \\times 10 - 5 \\times 10^2 = 600 - 500 = 100\\)<br>\\(100\\) metres` },
            { question: `A spreadsheet calculates the height \\(h = 60t - 5t^2\\) of a flare at each whole second.<br>Part of the table is shown.<br>\\(t = 4, h = 160\\); \\(t = 5, h = 175\\); \\(t = 6, h = 180\\); \\(t = 7, h = 175\\); \\(t = 8, h = 160\\)<br>State the greatest height shown in the table, and the time at which it occurs.`, answer: `The greatest height in the table is \\(180\\) metres, which occurs at \\(t = 6\\) seconds.<br>The values fall away either side of \\(t = 6\\), which matches the 'n' shape of a model with a negative \\(t^2\\) term.` },
            { question: `A company models its weekly profit \\(P\\), in pounds, against the selling price \\(p\\), in pounds, by \\(P = -2p^2 + 60p - 250\\).<br>Calculate the profit when the selling price is \\(\\pounds 10\\).`, answer: `\\(P = -2 \\times 100 + 600 - 250 = 150\\)<br>\\(\\pounds 150\\)` },
            { question: `A company models its weekly profit by \\(P = -2p^2 + 60p - 250\\), where \\(p\\) is the selling price in pounds.<br>Determine whether a price of \\(\\pounds 12\\) or a price of \\(\\pounds 16\\) gives the greater profit. Use your working to justify your answer.`, answer: `\\(p = 12\\): \\(P = -2 \\times 144 + 60 \\times 12 - 250 = -288 + 720 - 250 = 182\\)<br>\\(p = 16\\): \\(P = -2 \\times 256 + 60 \\times 16 - 250 = -512 + 960 - 250 = 198\\)<br>A price of \\(\\pounds 16\\) gives the greater profit, \\(\\pounds 198\\).` },
            { question: `A company sets the price of a new product.<br>If the price is very low it sells many units but makes very little on each one.<br>If the price is very high it makes a lot on each unit but sells almost none.<br>Explain why a quadratic model is a sensible shape for the profit.`, answer: `Profit is low at both a very low and a very high price, and higher somewhere in between.<br>That gives a curve which rises to a single maximum and falls away on both sides, which is the shape of a parabola with a negative \\(x^2\\) coefficient.` },
            { question: `The height of a ball is modelled by \\(h = 25 + 10t - 5t^2\\), where \\(h\\) is in metres and \\(t\\) is in seconds.<br>Explain why this model is not valid when \\(t = 7\\).`, answer: `\\(h = 25 + 70 - 245 = -150\\)<br>The model gives a negative height, which is impossible. The ball has already landed, so the model only applies until it reaches the ground.` },
          ],
        },
        {
          name: "Exponential Relationships",
          questions: [
            { question: `A population is modelled by \\(P = 620(1.06)^t\\), where \\(t\\) is the number of years.<br>(a) State the initial population.<br>(b) State the annual percentage increase.`, answer: `(a) \\(620\\)<br>(b) \\(6\\%\\) per year` },
            { question: `A population is modelled by \\(P = 620(1.06)^t\\), where \\(t\\) is the number of years.<br>Calculate the population after \\(5\\) years.<br>Give your answer to the nearest whole number.`, answer: `\\(P = 620 \\times 1.06^5 = 829.69...\\)<br>\\(830\\)` },
            { question: `The value of a car is modelled by \\(V = 15000(0.82)^t\\), where \\(t\\) is the number of years.<br>State the annual percentage depreciation.`, answer: `\\(18\\%\\) per year` },
            { question: `The value of a car is modelled by \\(V = 15000(0.82)^t\\), where \\(t\\) is the number of years.<br>Calculate the value of the car after \\(4\\) years.<br>Give your answer to the nearest pound.`, answer: `\\(V = 15000 \\times 0.82^4 = 6781.82...\\)<br>\\(\\pounds 6782\\)` },
            { question: `The concentration of bacteria, \\(C\\), remaining \\(m\\) minutes after a treatment is modelled by \\(C = 900e^{-0.05m}\\).<br>Calculate the concentration after \\(12\\) minutes.<br>Give your answer to 1 decimal place.`, answer: `\\(C = 900 \\times e^{-0.6} = 493.93...\\)<br>\\(493.9\\)` },
            { question: `A colony of bacteria is modelled by \\(N = 240e^{0.08t}\\), where \\(t\\) is the time in hours.<br>Calculate \\(N\\) when \\(t = 10\\).<br>Give your answer to the nearest whole number.`, answer: `\\(N = 240 \\times e^{0.8} = 534.12...\\)<br>\\(534\\)` },
            { question: `A colony of \\(850\\) insects grows at an effective rate of \\(4.2\\%\\) per year.<br>Calculate the size of the colony after \\(9\\) years.<br>Give your answer to the nearest whole number.`, answer: `\\(850 \\times 1.042^9 = 1230.91...\\)<br>\\(1231\\) insects` },
            { question: `The mass of a radioactive sample is modelled by \\(M = 500(0.93)^d\\), where \\(d\\) is the number of days.<br>Calculate the mass after \\(10\\) days.<br>Give your answer to 1 decimal place.`, answer: `\\(M = 500 \\times 0.93^{10} = 241.99...\\)<br>\\(242.0\\)` },
            { question: `An animal population is modelled by \\(P = a(b)^t\\) with \\(b > 1\\).<br>Explain why this model must eventually become unrealistic.`, answer: `An exponential model with \\(b > 1\\) grows without limit.<br>In reality food, space and other resources are finite, so the population cannot keep growing at the same rate for ever.` },
            { ref: "2022 Q10" },
          ],
        },
      ],
    },
  ],
};
