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
            { question: `A machine part should measure \\(60.00\\) mm.<br>Machine A produces parts measuring \\(60.4\\), \\(60.5\\) and \\(60.4\\) mm.<br>Machine B produces parts measuring \\(59.7\\), \\(60.3\\) and \\(60.0\\) mm.<br>State which machine is more precise and which is more accurate. Justify your answer.`, answer: `The parts from Machine A are more precise: their measurements are tightly grouped, with a range of only \\(0.1\\) mm.<br>The parts from Machine B are more accurate: their measurements average \\(60.0\\) mm, which is the target, while the measurements from Machine A average \\(60.43\\) mm, which is always too large.` },
          ],
        },
        {
          name: "Recurrence Relations",
          questions: [
            { question: `A population of \\(7400\\) decreases by \\(12\\%\\) each year.<br>At the end of each year \\(260\\) individuals join the population.<br>A spreadsheet models the population year by year, with the starting value in cell <strong>B2</strong>.<br>Write down the formula that should be entered in cell <strong>B3</strong> so that it can be filled down the column.`, answer: `<code>=B2*0.88+260</code><br>\\(12\\%\\) leave, so \\(88\\%\\) remain: multiply the cell above by \\(0.88\\), then add the \\(260\\) who join.` },
            { question: `A savings account contains \\(\\pounds 2000\\).<br>Each year \\(4\\%\\) interest is added and then \\(\\pounds 150\\) is withdrawn.<br>A spreadsheet models the balance year by year, with the starting value in cell <strong>B2</strong>.<br>Write down the formula that should be entered in cell <strong>B3</strong> so that it can be filled down the column.`, answer: `<code>=B2*1.04-150</code><br>Adding \\(4\\%\\) interest multiplies the balance by \\(1.04\\); the \\(\\pounds 150\\) withdrawal is then subtracted.` },
            { question: `A car park contains \\(400\\) cars at \\(8\\) am.<br>During each hour, \\(30\\%\\) of the cars leave and \\(60\\) cars arrive.<br>Calculate the number of cars in the car park at \\(9\\) am and at \\(10\\) am.`, answer: `\\(30\\%\\) leave, so \\(70\\%\\) remain.<br>9 am: \\(0.7 \\times 400 + 60 = 340\\) cars<br>10 am: \\(0.7 \\times 340 + 60 = 298\\) cars` },
            { question: `A lake contains \\(12000\\) fish.<br>Each year \\(15\\%\\) of the fish are caught and \\(1500\\) young fish are added.<br>Calculate the number of fish after \\(3\\) years.<br>Give your answer to the nearest whole fish.`, answer: `\\(15\\%\\) are caught, so \\(85\\%\\) remain.<br>Year 1: \\(0.85 \\times 12000 + 1500 = 11700\\)<br>Year 2: \\(0.85 \\times 11700 + 1500 = 11445\\)<br>Year 3: \\(0.85 \\times 11445 + 1500 = 11228.25\\)<br>\\(11228\\) fish` },
            { question: `A tank holds \\(800\\) litres of liquid.<br>Each day \\(20\\%\\) of the liquid evaporates and \\(100\\) litres are added.<br>A spreadsheet models the volume day by day, with the starting value in cell <strong>B2</strong>.<br>(a) Write down the formula that should be entered in cell <strong>B3</strong> so that it can be filled down the column.<br>(b) Describe how to use the spreadsheet to find what happens to the volume in the long term, and state the outcome.`, answer: `(a) <code>=B2*0.8+100</code><br>\\(20\\%\\) evaporates, so \\(80\\%\\) remains, then \\(100\\) litres are added.<br>(b) Fill the formula down the column through many rows and read the values.<br>The volume levels out at approximately \\(500\\) litres.` },
            { question: `A spreadsheet models the mass of a chemical in a tank.<br>Each hour, \\(40\\%\\) of the chemical is removed and \\(200\\) grams are added.<br>The tank starts with \\(1000\\) grams.<br>Calculate the mass of the chemical after each of the next three hours.`, answer: `\\(40\\%\\) is removed, so \\(60\\%\\) remains.<br>Hour 1: \\(0.6 \\times 1000 + 200 = 800\\)<br>Hour 2: \\(0.6 \\times 800 + 200 = 680\\)<br>Hour 3: \\(0.6 \\times 680 + 200 = 608\\) grams` },
            { question: `A forest contains \\(40000\\) trees.<br>Each year \\(8\\%\\) of the trees are felled and \\(2000\\) saplings are planted.<br>(a) Calculate the number of trees after \\(2\\) years.<br>(b) Describe how a spreadsheet could be used to find the number of trees in the forest in the long term.`, answer: `(a) \\(8\\%\\) are felled, so \\(92\\%\\) remain.<br>Year 1: \\(0.92 \\times 40000 + 2000 = 38800\\)<br>Year 2: \\(0.92 \\times 38800 + 2000 = 37696\\) trees<br>(b) Enter \\(40000\\) in a cell, then in the cell below enter a formula multiplying the cell above by \\(0.92\\) and adding \\(2000\\). Fill the formula down the column.<br>The extended list shows the number of trees levelling out at approximately \\(25000\\).` },
            { question: `An orchard is sprayed weekly with a pesticide that destroys \\(60\\%\\) of the pests.<br>Between sprayings \\(500\\) new pests arrive.<br>There are \\(3000\\) pests before the first spraying.<br>Calculate the number of pests after \\(2\\) weeks.`, answer: `\\(60\\%\\) are destroyed, so \\(40\\%\\) survive.<br>Week 1: \\(0.4 \\times 3000 + 500 = 1700\\)<br>Week 2: \\(0.4 \\times 1700 + 500 = 1180\\) pests` },
            { question: `A spreadsheet models a population that falls by \\(14\\%\\) each year, with \\(120\\) new members added each year.<br>Cell B2 holds the starting value.<br>Cell D1 holds the multiplier \\(0.86\\) and cell D2 holds \\(120\\).<br>Write down the formula that should be entered in cell <strong>B3</strong> so that it can be filled down the column.`, answer: `<code>=B2*$D$1+$D$2</code><br>The dollar signs fix cells D1 and D2 so they do not change as the formula is filled down.` },
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
    {
      id: "planning-decision-making",
      title: "Planning & Decision Making",
      topics: [
        {
          name: "Precedence Tables",
          questions: [
            { question: `A project has the following tasks.<br>A: no preceding task, \\(6\\) hours<br>B: no preceding task, \\(4\\) hours<br>C: preceded by A, \\(5\\) hours<br>D: preceded by B, \\(6\\) hours<br>E: preceded by C and D, \\(3\\) hours<br>State which tasks can be started immediately.`, answer: `A and B.<br>Neither has a preceding task, so both can begin at the start of the project.` },
            { question: `A project has the following tasks.<br>A: no preceding task, \\(6\\) hours<br>B: no preceding task, \\(4\\) hours<br>C: preceded by A, \\(5\\) hours<br>D: preceded by B, \\(6\\) hours<br>E: preceded by C and D, \\(3\\) hours<br>State which tasks must be finished before task E can start.`, answer: `C and D must both be finished.<br>Task E cannot begin until every one of its preceding tasks is complete.` },
            { question: `In a precedence table, a task has no entry in the 'preceding task' column.<br>Explain what this tells you about the task.`, answer: `The task does not depend on any other task.<br>It can be started straight away, at the beginning of the project.` },
            { question: `A project has the following tasks.<br>A: no preceding task, \\(6\\) hours<br>B: no preceding task, \\(4\\) hours<br>C: preceded by A, \\(5\\) hours<br>D: preceded by B, \\(6\\) hours<br>E: preceded by C and D, \\(3\\) hours<br>Calculate the minimum time needed to complete the project.`, answer: `Route A, C, E: \\(6 + 5 + 3 = 14\\) hours<br>Route B, D, E: \\(4 + 6 + 3 = 13\\) hours<br>The project cannot finish until the longer route is complete, so the minimum time is \\(14\\) hours.` },
            { question: `A project has the following tasks.<br>A: no preceding task, \\(3\\) hours<br>B: no preceding task, \\(5\\) hours<br>C: preceded by A, \\(4\\) hours<br>D: preceded by A, \\(2\\) hours<br>E: preceded by B, \\(6\\) hours<br>F: preceded by C and D, \\(3\\) hours<br>G: preceded by E and F, \\(2\\) hours<br>Calculate the minimum time needed to complete the project.`, answer: `A, C, F, G: \\(3 + 4 + 3 + 2 = 12\\) hours<br>A, D, F, G: \\(3 + 2 + 3 + 2 = 10\\) hours<br>B, E, G: \\(5 + 6 + 2 = 13\\) hours<br>The minimum time is \\(13\\) hours.` },
            { question: `A project has the following tasks.<br>A: no preceding task, \\(3\\) hours<br>B: no preceding task, \\(5\\) hours<br>C: preceded by A, \\(4\\) hours<br>D: preceded by A, \\(2\\) hours<br>E: preceded by B, \\(6\\) hours<br>F: preceded by C and D, \\(3\\) hours<br>G: preceded by E and F, \\(2\\) hours<br>State the tasks that lie on the longest route through the project.`, answer: `B, E, G.<br>This route takes \\(13\\) hours, longer than either route through A.` },
            { question: `The tasks in a project have durations totalling \\(40\\) hours, but the project can be completed in \\(23\\) hours.<br>Explain how this is possible.`, answer: `Tasks that do not depend on one another can be carried out at the same time.<br>The project time is set by the longest chain of dependent tasks, not by the total of every duration.` },
            { question: `Task F is preceded by tasks C and D.<br>Task C finishes after \\(11\\) hours and task D finishes after \\(14\\) hours.<br>State the earliest time task F can start, and explain your answer.`, answer: `\\(14\\) hours.<br>Task F needs both C and D to be finished, so it waits for the later of the two.` },
          ],
        },
        {
          name: "Constructing PERT Charts",
          questions: [
            { question: `In a PERT chart, task A has an earliest start time of \\(0\\) and a duration of \\(4\\) days.<br>Task B follows task A and has a duration of \\(6\\) days.<br>Calculate the earliest start time of task B.`, answer: `\\(0 + 4 = 4\\)<br>The earliest start time of task B is \\(4\\) days.` },
            { question: `Task E cannot begin until both task C and task D are complete.<br>Task C has an earliest start time of \\(12\\) days and a duration of \\(5\\) days.<br>Task D has an earliest start time of \\(9\\) days and a duration of \\(6\\) days.<br>Calculate the earliest start time of task E.`, answer: `Task C finishes at \\(12 + 5 = 17\\) days.<br>Task D finishes at \\(9 + 6 = 15\\) days.<br>The forward scan takes the maximum, so the earliest start time of task E is \\(17\\) days.` },
            { question: `Task B must be finished before both task C and task D can begin.<br>Task C has a duration of \\(4\\) days and a latest end time of \\(20\\) days.<br>Task D has a duration of \\(5\\) days and a latest end time of \\(22\\) days.<br>Calculate the latest end time of task B.`, answer: `From task C: \\(20 - 4 = 16\\) days.<br>From task D: \\(22 - 5 = 17\\) days.<br>The backward scan takes the minimum, so the latest end time of task B is \\(16\\) days.` },
            { question: `State the three values recorded in each node of a PERT chart.`, answer: `The earliest start time, the duration of the task, and the latest end time.` },
            { question: `Explain why the forward scan takes the maximum value when a task has more than one preceding task.`, answer: `The task cannot begin until every one of its preceding tasks is finished.<br>Waiting for the latest of them means taking the maximum.` },
            { question: `Explain why the backward scan takes the minimum value when a task is followed by more than one task.`, answer: `The task must finish early enough not to delay any of the tasks that follow it.<br>The tightest of those deadlines is the minimum.` },
            { question: `A project has the following tasks.<br>A: no preceding task, \\(5\\) days<br>B: preceded by A, \\(7\\) days<br>C: preceded by A, \\(3\\) days<br>D: preceded by B and C, \\(4\\) days<br>Carry out a forward scan to find the earliest start time of each task, and state the earliest completion time of the project.`, answer: `A: earliest start \\(0\\), finishes at \\(5\\)<br>B: earliest start \\(5\\), finishes at \\(12\\)<br>C: earliest start \\(5\\), finishes at \\(8\\)<br>D: earliest start is the maximum of \\(12\\) and \\(8\\), so \\(12\\); finishes at \\(12 + 4 = 16\\)<br>The earliest completion time is \\(16\\) days.` },
            { ref: "2022 Q2" },
            { ref: "2023 Q2" },
            { ref: "2024 Q3" },
          ],
        },
        {
          name: "Interpreting PERT Charts",
          questions: [
            { question: `Task C has an earliest start time of \\(14\\) days, a latest end time of \\(26\\) days and a duration of \\(5\\) days.<br>Calculate the float time of task C.`, answer: `\\(26 - 14 - 5 = 7\\)<br>The float time is \\(7\\) days.` },
            { question: `Task D has an earliest start time of \\(9\\) days, a latest end time of \\(15\\) days and a duration of \\(6\\) days.<br>(a) Calculate the float time of task D.<br>(b) State whether task D is critical, and justify your answer.`, answer: `(a) \\(15 - 9 - 6 = 0\\) days<br>(b) Task D is critical. It has no float, so any delay to it would delay the whole project.` },
            { question: `Explain the difference between an activity that is essential to a project and an activity that is critical.`, answer: `Every activity in the project is essential — the project cannot be finished without it.<br>A critical activity is one with no float time, so delaying it delays the completion of the whole project. An essential activity that is not critical has some float and can slip a little without affecting the finish date.` },
            { question: `A project has the following tasks.<br>A: duration \\(3\\), earliest start \\(0\\), latest end \\(3\\)<br>B: duration \\(5\\), earliest start \\(3\\), latest end \\(8\\)<br>C: duration \\(2\\), earliest start \\(3\\), latest end \\(10\\)<br>D: duration \\(4\\), earliest start \\(8\\), latest end \\(12\\)<br>E: duration \\(2\\), earliest start \\(5\\), latest end \\(12\\)<br>Calculate the float time of each task and hence state the critical path.`, answer: `A: \\(3 - 0 - 3 = 0\\)<br>B: \\(8 - 3 - 5 = 0\\)<br>C: \\(10 - 3 - 2 = 5\\)<br>D: \\(12 - 8 - 4 = 0\\)<br>E: \\(12 - 5 - 2 = 5\\)<br>The tasks with no float are A, B and D, so the critical path is A, B, D.` },
            { question: `A task has a float time of \\(4\\) days.<br>The task is delayed by \\(2\\) days.<br>State the effect on the completion date of the project, and justify your answer.`, answer: `There is no effect on the completion date.<br>The delay of \\(2\\) days is less than the \\(4\\) days of float available, so the task still finishes within its latest end time.` },
            { question: `A project has a critical path lasting \\(45\\) weeks.<br>A task on the critical path is delayed by \\(3\\) weeks.<br>State the new length of the project, and justify your answer.`, answer: `\\(45 + 3 = 48\\) weeks.<br>A critical task has no float, so any delay to it adds directly to the length of the project.` },
            { question: `A project manager wants to shorten a project that is running to a critical path of \\(30\\) days.<br>Explain why adding extra workers to a task with a float time of \\(6\\) days will not help.`, answer: `That task is not on the critical path, so finishing it sooner does not change the completion date.<br>Only shortening tasks on the critical path will shorten the project.` },
            { ref: "2025 Q4" },
            { ref: "Specimen Q5" },
          ],
        },
        {
          name: "Gantt Charts",
          questions: [
            { question: `On a Gantt chart, the solid block for task C starts at day \\(4\\) and ends at day \\(9\\).<br>A thin line continues from day \\(9\\) to day \\(12\\).<br>State the duration and the float time of task C.`, answer: `Duration: \\(9 - 4 = 5\\) days<br>Float time: \\(12 - 9 = 3\\) days` },
            { question: `State what a thin line to the right of a solid block represents on a Gantt chart.`, answer: `The float time of that task — the amount by which it could be delayed without holding up the project.` },
            { question: `The following tasks have these earliest start times and durations, in hours.<br>A: start \\(0\\), duration \\(2\\)<br>B: start \\(2\\), duration \\(3\\)<br>C: start \\(2\\), duration \\(1\\)<br>D: start \\(5\\), duration \\(2\\)<br>State which tasks are in progress \\(3\\) hours after the project begins.`, answer: `Task B only.<br>B runs from \\(2\\) to \\(5\\) hours. Task A finished at \\(2\\), task C finished at \\(3\\), and task D has not started.` },
            { question: `On a Gantt chart, the solid blocks for tasks B, D and E all overlap on day \\(4\\).<br>Each task requires one worker.<br>State the smallest number of workers needed on day \\(4\\), and justify your answer.`, answer: `\\(3\\) workers.<br>All three tasks are in progress at the same time on day \\(4\\), and each needs its own worker.` },
            { question: `State one advantage of using a Gantt chart rather than a PERT chart.`, answer: `e.g.<br>It shows clearly when each task starts and finishes against a timescale.<br>Float times are easy to read off as the thin lines.<br>It shows at a glance which tasks overlap, so staffing can be planned.` },
            { question: `A task has a solid block from day \\(6\\) to day \\(11\\) and no thin line after it.<br>State what this tells you about the task.`, answer: `The task has no float time, so it is a critical task.<br>Any delay to it would delay the whole project.` },
            { question: `On a Gantt chart, task F has a solid block from day \\(3\\) to day \\(8\\) and a thin line to day \\(10\\).<br>Task F is delayed and now finishes on day \\(9\\).<br>State the effect on the project, and justify your answer.`, answer: `There is no effect on the completion date.<br>Task F has \\(2\\) days of float, and it has used only \\(1\\) of them.` },
            { ref: "2023 Q6" },
          ],
        },
        {
          name: "Calculating Basic Probabilities",
          questions: [
            { question: `A bag contains \\(6\\) red counters, \\(4\\) blue counters and \\(5\\) green counters.<br>One counter is chosen at random.<br>Calculate the probability that it is blue.`, answer: `Total counters \\(= 6 + 4 + 5 = 15\\)<br>\\(P(\\text{blue}) = \\frac{4}{15}\\)` },
            { question: `A bag contains \\(6\\) red counters, \\(4\\) blue counters and \\(5\\) green counters.<br>One counter is chosen at random.<br>Calculate the probability that it is not blue.`, answer: `\\(P(\\text{not blue}) = 1 - \\frac{4}{15} = \\frac{11}{15}\\)` },
            { question: `In a class of \\(25\\) pupils, \\(14\\) cycle to school.<br>One pupil is chosen at random.<br>Calculate the probability that the pupil does not cycle to school.`, answer: `\\(P(\\text{cycles}) = \\frac{14}{25}\\)<br>\\(P(\\text{does not cycle}) = 1 - \\frac{14}{25} = \\frac{11}{25}\\)` },
            { question: `A fair six-sided die is rolled once.<br>State whether 'rolling a \\(3\\)' and 'rolling an even number' are mutually exclusive. Justify your answer.`, answer: `They are mutually exclusive.<br>\\(3\\) is not an even number, so the two events cannot both happen on the same roll.` },
            { question: `Two counters are taken from a bag, one after the other, and the first is not replaced.<br>State whether the two events are independent or dependent. Justify your answer.`, answer: `They are dependent.<br>Removing the first counter changes how many counters are left, so it changes the probability for the second.` },
            { question: `A fair coin is flipped and a fair die is rolled.<br>State whether 'the coin lands on heads' and 'the die shows a \\(6\\)' are independent. Justify your answer.`, answer: `They are independent.<br>The result of the coin flip has no effect on the result of the die roll.` },
            { question: `A student flips a fair coin and it lands on heads \\(5\\) times in a row.<br>The student says the next flip is more likely to be tails because tails is overdue.<br>Name the fallacy the student is using and explain why the student is wrong.`, answer: `The gambler's fallacy (also called the Monte Carlo fallacy).<br>The coin has no memory of previous flips. Each flip is independent, so the probability of tails on the next flip is still \\(\\frac{1}{2}\\).` },
            { question: `A spinner has \\(8\\) equal sections numbered \\(1\\) to \\(8\\).<br>Calculate the probability of spinning a number less than \\(3\\) or a number greater than \\(6\\).`, answer: `Less than \\(3\\): \\(1, 2\\) — that is \\(2\\) sections.<br>Greater than \\(6\\): \\(7, 8\\) — that is \\(2\\) sections.<br>These cannot both happen, so \\(P = \\frac{2}{8} + \\frac{2}{8} = \\frac{4}{8} = \\frac{1}{2}\\)` },
          ],
        },
        {
          name: "Expected Probabilities",
          questions: [
            { question: `The probability that an item coming off a production line is defective is \\(0.02\\).<br>The factory produces \\(5000\\) items.<br>Calculate the expected number of defective items.`, answer: `\\(0.02 \\times 5000 = 100\\) items` },
            { question: `The probability of rain on any given day is \\(0.15\\).<br>Calculate the expected number of rainy days in a period of \\(40\\) days.`, answer: `\\(0.15 \\times 40 = 6\\) days` },
            { question: `The probability that a candidate passes a driving test is \\(0.9\\).<br>\\(250\\) candidates sit the test.<br>Calculate the expected number of passes.`, answer: `\\(0.9 \\times 250 = 225\\) candidates` },
            { question: `An outdoor attraction is open every day for \\(75\\) days.<br>The probability that bad weather forces it to close on any given day is \\(0.12\\).<br>Calculate the expected number of days it is open.`, answer: `\\(P(\\text{open}) = 1 - 0.12 = 0.88\\)<br>\\(0.88 \\times 75 = 66\\) days` },
            { question: `A factory produces \\(9600\\) units in a week.<br>\\(1.5\\%\\) of units are expected to be faulty.<br>Calculate the expected number of faulty units.`, answer: `\\(0.015 \\times 9600 = 144\\) units` },
            { question: `A dealership sells \\(380\\) cars in a year.<br>The probability that a customer adds an extended warranty is \\(0.35\\).<br>The dealership makes a profit of \\(\\pounds 120\\) on each warranty.<br>Calculate the total expected profit from warranties.`, answer: `Expected number of warranties \\(= 0.35 \\times 380 = 133\\)<br>Expected profit \\(= 133 \\times 120 = 15960\\)<br>\\(\\pounds 15960\\)` },
            { question: `A charity sells \\(1200\\) raffle tickets.<br>The probability that any one ticket wins a prize is \\(0.005\\).<br>Calculate the expected number of winning tickets.`, answer: `\\(0.005 \\times 1200 = 6\\) tickets` },
          ],
        },
        {
          name: "Tree Diagrams",
          questions: [
            { question: `The probability that a bus is late on any morning is \\(0.2\\), independently of other mornings.<br>Calculate the probability that the bus is late on both Monday and Tuesday.`, answer: `\\(0.2 \\times 0.2 = 0.04\\)` },
            { question: `The probability that a bus is late on any morning is \\(0.2\\), independently of other mornings.<br>Calculate the probability that the bus is on time on both Monday and Tuesday.`, answer: `\\(P(\\text{on time}) = 1 - 0.2 = 0.8\\)<br>\\(0.8 \\times 0.8 = 0.64\\)` },
            { question: `The probability that a bus is late on any morning is \\(0.2\\), independently of other mornings.<br>Calculate the probability that the bus is late on exactly one of Monday and Tuesday.`, answer: `Late then on time: \\(0.2 \\times 0.8 = 0.16\\)<br>On time then late: \\(0.8 \\times 0.2 = 0.16\\)<br>\\(0.16 + 0.16 = 0.32\\)` },
            { question: `A drawer contains \\(5\\) red socks and \\(3\\) blue socks.<br>Two socks are taken out at random, without replacement.<br>Calculate the probability that both are red.`, answer: `\\(\\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}\\)` },
            { question: `A drawer contains \\(5\\) red socks and \\(3\\) blue socks.<br>Two socks are taken out at random, without replacement.<br>Calculate the probability that one is red and one is blue.`, answer: `Red then blue: \\(\\frac{5}{8} \\times \\frac{3}{7} = \\frac{15}{56}\\)<br>Blue then red: \\(\\frac{3}{8} \\times \\frac{5}{7} = \\frac{15}{56}\\)<br>\\(\\frac{15}{56} + \\frac{15}{56} = \\frac{30}{56} = \\frac{15}{28}\\)` },
            { question: `An inspector tests \\(3\\) items chosen at random.<br>The probability that any one item passes is \\(0.85\\), independently of the others.<br>Calculate the probability that at least one of the three items fails.`, answer: `\\(P(\\text{all three pass}) = 0.85^3 = 0.614125\\)<br>\\(P(\\text{at least one fails}) = 1 - 0.614125 = 0.385875\\)` },
            { question: `The probability that a train is delayed on any day is \\(0.1\\), independently of other days.<br>Calculate the probability that the train is delayed on at least one of three days.`, answer: `\\(P(\\text{no delay on a day}) = 0.9\\)<br>\\(P(\\text{no delay on any of the three}) = 0.9^3 = 0.729\\)<br>\\(P(\\text{at least one delay}) = 1 - 0.729 = 0.271\\)` },
            { question: `Explain why the 'at least one' shortcut is used instead of adding the separate outcomes.`, answer: `'At least one' covers many separate outcomes, which would each have to be worked out and added.<br>Its opposite is the single outcome 'none at all', so it is far quicker to find that one probability and subtract it from \\(1\\).` },
          ],
        },
        {
          name: "Venn Diagrams",
          questions: [
            { question: `A gym surveys \\(80\\) members about two classes.<br>\\(25\\) attend spin only, \\(20\\) attend yoga only, \\(15\\) attend both, and \\(20\\) attend neither.<br>Calculate the probability that a member chosen at random attends spin.`, answer: `Attend spin \\(= 25 + 15 = 40\\)<br>\\(P(\\text{spin}) = \\frac{40}{80} = \\frac{1}{2}\\)` },
            { question: `A gym surveys \\(80\\) members about two classes.<br>\\(25\\) attend spin only, \\(20\\) attend yoga only, \\(15\\) attend both, and \\(20\\) attend neither.<br>Calculate the probability that a member chosen at random attends neither class.`, answer: `\\(P(\\text{neither}) = \\frac{20}{80} = \\frac{1}{4}\\)` },
            { question: `A vet reviews the records of \\(120\\) dogs.<br>\\(70\\) are vaccinated, \\(55\\) are microchipped and \\(20\\) are neither.<br>Calculate the number of dogs that are both vaccinated and microchipped.`, answer: `Dogs in at least one group \\(= 120 - 20 = 100\\)<br>\\(70 + 55 = 125\\), which counts the overlap twice.<br>Both \\(= 125 - 100 = 25\\) dogs` },
            { question: `A vet reviews the records of \\(120\\) dogs.<br>\\(70\\) are vaccinated, \\(55\\) are microchipped and \\(20\\) are neither. \\(25\\) are both vaccinated and microchipped.<br>Calculate the probability that a dog chosen at random is vaccinated but not microchipped.`, answer: `Vaccinated only \\(= 70 - 25 = 45\\)<br>\\(P = \\frac{45}{120} = \\frac{3}{8}\\)` },
            { question: `Explain why the number in the overlap of a Venn diagram must be filled in before the rest.`, answer: `The totals given for each circle already include everyone in the overlap.<br>Filling the overlap first lets you subtract it, so nobody is counted twice.` },
            { question: `\\(150\\) people are surveyed about three drinks: tea, coffee and juice.<br>\\(12\\) drink all three.<br>\\(30\\) drink tea and coffee, \\(25\\) drink coffee and juice, \\(20\\) drink tea and juice.<br>\\(70\\) drink tea, \\(80\\) drink coffee, \\(50\\) drink juice.<br>Calculate the number who drink none of the three.`, answer: `Tea and coffee only \\(= 30 - 12 = 18\\)<br>Coffee and juice only \\(= 25 - 12 = 13\\)<br>Tea and juice only \\(= 20 - 12 = 8\\)<br>Tea only \\(= 70 - 18 - 8 - 12 = 32\\)<br>Coffee only \\(= 80 - 18 - 13 - 12 = 37\\)<br>Juice only \\(= 50 - 13 - 8 - 12 = 17\\)<br>In at least one circle \\(= 32 + 37 + 17 + 18 + 13 + 8 + 12 = 137\\)<br>None of the three \\(= 150 - 137 = 13\\) people` },
            { question: `\\(150\\) people are surveyed about three drinks. \\(12\\) drink all three, \\(30\\) drink tea and coffee, \\(20\\) drink tea and juice, and \\(70\\) drink tea in total.<br>Calculate the number who drink tea only.`, answer: `Tea and coffee only \\(= 30 - 12 = 18\\)<br>Tea and juice only \\(= 20 - 12 = 8\\)<br>Tea only \\(= 70 - 18 - 8 - 12 = 32\\) people` },
            { ref: "2024 Q2" },
            { ref: "2025 Q2" },
            { ref: "Specimen Q2" },
          ],
        },
        {
          name: "Risk and Control Measures",
          questions: [
            { question: `A company faces a penalty of \\(\\pounds 8000\\) if a job is delayed.<br>The probability of a delay is \\(0.2\\).<br>Calculate the expected cost of the delay.`, answer: `\\(0.2 \\times 8000 = 1600\\)<br>\\(\\pounds 1600\\)` },
            { question: `A photographer must refund a client's \\(\\pounds 1500\\) fee if the photographs are late.<br>State one direct cost and one indirect cost the photographer would face.`, answer: `Direct cost: the \\(\\pounds 1500\\) refund itself.<br>Indirect cost: e.g. damage to their reputation, poor reviews, or the loss of future bookings.` },
            { question: `Explain what is meant by a control measure.`, answer: `A control measure is an action taken in advance to remove a risk, or to reduce the chance of it happening.<br>It has a cost of its own, so it is only worth taking if it costs less than the expected cost of the risk.` },
            { question: `A designer buys a tablet for \\(\\pounds 2400\\).<br>The probability of breaking it within two years is \\(0.06\\).<br>(a) Calculate the expected cost of breaking the tablet.<br>(b) A two-year protection plan costs \\(\\pounds 130\\). Determine whether the designer should buy it. Use your working to justify your answer.`, answer: `(a) \\(0.06 \\times 2400 = 144\\), so \\(\\pounds 144\\).<br>(b) The plan costs \\(\\pounds 130\\), which is less than the expected cost of \\(\\pounds 144\\).<br>The designer should buy the plan.` },
            { question: `A firm will be fined \\(\\pounds 4500\\) if a job is late.<br>The probability of it being late is \\(0.22\\).<br>(a) Calculate the expected cost of being late.<br>(b) Hiring extra staff would remove the risk completely at a cost of \\(\\pounds 700\\). Determine whether the firm should hire them. Use your working to justify your answer.`, answer: `(a) \\(0.22 \\times 4500 = 990\\), so \\(\\pounds 990\\).<br>(b) Hiring the staff costs \\(\\pounds 700\\), which is less than the expected cost of \\(\\pounds 990\\).<br>The firm should hire the extra staff.` },
            { question: `A company faces a penalty of \\(\\pounds 20000\\) if a project is delayed.<br>The probability of a delay is \\(0.3\\).<br>A control measure costing \\(\\pounds 2000\\) would reduce the probability of a delay to \\(0.1\\).<br>Determine whether the company should use the control measure. Use your working to justify your answer.`, answer: `Without the measure: \\(0.3 \\times 20000 = 6000\\), so \\(\\pounds 6000\\).<br>With the measure: \\(2000 + 0.1 \\times 20000 = 2000 + 2000 = 4000\\), so \\(\\pounds 4000\\).<br>The company should use the control measure, as the expected cost is lower.` },
            { question: `A control measure removes a risk completely, but costs more than the expected cost of the risk.<br>Explain whether a company might still choose to take it.`, answer: `It might.<br>The expected cost is only an average over many repeats. A company may prefer to pay a known, fixed amount rather than face a small chance of a very large loss, especially if that loss would be damaging to survive or would harm its reputation.` },
          ],
        },
        {
          name: "Multiple Control Measures",
          questions: [
            { question: `Two independent events could delay a project.<br>The probability of the first is \\(0.2\\) and the probability of the second is \\(0.1\\).<br>Calculate the probability that neither happens.`, answer: `\\((1 - 0.2) \\times (1 - 0.1) = 0.8 \\times 0.9 = 0.72\\)` },
            { question: `Two independent events could delay a project.<br>The probability of the first is \\(0.2\\) and the probability of the second is \\(0.1\\).<br>Calculate the probability that at least one of them happens.`, answer: `\\(P(\\text{neither}) = 0.8 \\times 0.9 = 0.72\\)<br>\\(P(\\text{at least one}) = 1 - 0.72 = 0.28\\)` },
            { question: `A project faces a penalty of \\(\\pounds 18000\\) if it is delayed.<br>Two independent events could cause a delay, with probabilities \\(0.2\\) and \\(0.1\\).<br>Calculate the expected cost of a delay.`, answer: `\\(P(\\text{at least one}) = 1 - 0.8 \\times 0.9 = 1 - 0.72 = 0.28\\)<br>\\(0.28 \\times 18000 = 5040\\)<br>\\(\\pounds 5040\\)` },
            { question: `A project faces a penalty of \\(\\pounds 18000\\) if it is delayed.<br>Two independent events could cause a delay, with probabilities \\(0.2\\) and \\(0.1\\).<br>A control measure costing \\(\\pounds 1200\\) would remove the first risk completely.<br>Calculate the expected cost if this control measure is taken.`, answer: `Only the second risk remains.<br>\\(1200 + 0.1 \\times 18000 = 1200 + 1800 = 3000\\)<br>\\(\\pounds 3000\\)` },
            { question: `A project faces a penalty of \\(\\pounds 18000\\) if it is delayed.<br>Two independent events could cause a delay, with probabilities \\(0.2\\) and \\(0.1\\).<br>A control measure costing \\(\\pounds 900\\) would remove the second risk completely.<br>Calculate the expected cost if this control measure is taken.`, answer: `Only the first risk remains.<br>\\(900 + 0.2 \\times 18000 = 900 + 3600 = 4500\\)<br>\\(\\pounds 4500\\)` },
            { question: `A project faces a penalty of \\(\\pounds 18000\\) if it is delayed.<br>The expected cost with no control measure is \\(\\pounds 5040\\).<br>Control measure 1 gives an expected cost of \\(\\pounds 3000\\) and control measure 2 gives an expected cost of \\(\\pounds 4500\\).<br>Only one control measure may be used.<br>State which should be chosen, and justify your answer.`, answer: `Control measure 1.<br>Its expected cost of \\(\\pounds 3000\\) is lower than \\(\\pounds 4500\\) for measure 2 and lower than \\(\\pounds 5040\\) with no measure at all.` },
            { question: `A company faces a penalty of \\(\\pounds 30000\\) if a contract is delayed.<br>Two independent events could cause a delay, with probabilities \\(0.25\\) and \\(0.4\\).<br>(a) Calculate the expected cost of a delay.<br>(b) A control measure costing \\(\\pounds 5000\\) would remove the second risk completely. Calculate the expected cost if it is taken, and determine whether the company should use it.`, answer: `(a) \\(P(\\text{neither}) = 0.75 \\times 0.6 = 0.45\\)<br>\\(P(\\text{at least one}) = 1 - 0.45 = 0.55\\)<br>\\(0.55 \\times 30000 = 16500\\), so \\(\\pounds 16500\\).<br>(b) \\(5000 + 0.25 \\times 30000 = 5000 + 7500 = 12500\\), so \\(\\pounds 12500\\).<br>The company should use it, as \\(\\pounds 12500\\) is less than \\(\\pounds 16500\\).` },
            { ref: "2024 Q8" },
            { ref: "2025 Q7" },
            { ref: "Specimen Q9" },
          ],
        },
      ],
    },
    {
      id: "statistics",
      title: "Statistics",
      topics: [
        {
          name: "Classifying Data",
          questions: [
            { question: `A survey records the make of car a person drives.<br>State the type of data this is.`, answer: `(Nominal) categorical.<br>The makes are names with no natural order.` },
            { question: `A survey records the number of pets a household owns.<br>State the type of data this is.`, answer: `Discrete numerical.<br>It is a count, so only whole numbers are possible.` },
            { question: `A survey records the mass of each parcel, in kilograms.<br>State the type of data this is.`, answer: `Continuous numerical.<br>Mass can take any value in a range and is measured, not counted.` },
            { question: `A hotel asks guests to rate their stay as poor, fair, good or excellent.<br>State the type of data this is.`, answer: `Ordinal categorical.<br>The responses are categories, but they have a natural order.` },
            { question: `A cafe records the following for each order.<br>(a) The type of milk used (oat, soya, dairy).<br>(b) The temperature of the drink, in degrees Celsius.<br>(c) The number of items in the order.<br>(d) The size of the drink (small, regular, large).<br>Classify each type of data.`, answer: `(a) (Nominal) categorical<br>(b) Continuous numerical<br>(c) Discrete numerical<br>(d) Ordinal categorical` },
            { question: `Explain the difference between discrete and continuous numerical data.`, answer: `Discrete data can only take separate, usually whole-number, values because it is counted, for example the number of goals scored.<br>Continuous data can take any value within a range because it is measured, for example height or time.` },
            { question: `A vet records the breed of each dog, its weight in kilograms, and its aggression level as low, medium or high.<br>State which of these is ordinal categorical, and justify your answer.`, answer: `The aggression level.<br>Low, medium and high are categories rather than numbers, but they have a clear order from least to most.` },
            { ref: "2023 Q3" },
          ],
        },
        {
          name: "Samples, Populations and Outliers",
          questions: [
            { question: `A company wants to know the opinion of all its \\(4000\\) employees.<br>It asks \\(200\\) of them.<br>State the population and the sample.`, answer: `Population: all \\(4000\\) employees.<br>Sample: the \\(200\\) employees who were asked.` },
            { question: `Explain what is meant by a representative sample.`, answer: `A sample that reflects the make-up of the whole population, so that conclusions drawn from it can reasonably be applied to the population.` },
            { question: `A council wants to know whether residents support building a new cycle path.<br>It leaves questionnaires in a bicycle shop for customers to complete.<br>Explain why this method is likely to give biased results.`, answer: `Only people who visit a bicycle shop will be asked, and they are far more likely to cycle than the average resident.<br>The sample is not representative of all residents, so it will overstate support for the cycle path.` },
            { question: `A streaming service wants the favourite programme type of all adults in Scotland.<br>It surveys \\(500\\) students at one university.<br>Give one reason why this sample may not be representative.`, answer: `e.g.<br>Students are not typical of all adults — they are mostly young.<br>Only one city is covered, so the rest of Scotland is not represented.` },
            { question: `A researcher records the resting heart rate, in beats per minute, of seven patients.<br>\\(68, 72, 65, 71, 15, 74, 69\\)<br>(a) Identify the outlier.<br>(b) Explain what the researcher should do before using this data.`, answer: `(a) \\(15\\) beats per minute.<br>(b) The value is far below the others and is not a plausible resting heart rate, so it should be checked. If it is a recording error it should be corrected or removed; it should not simply be deleted because it is inconvenient.` },
            { question: `Explain why an outlier affects the mean much more than it affects the median.`, answer: `The mean uses the size of every value, so a single very large or very small value pulls it towards itself.<br>The median depends only on the position of the middle value, so one extreme value barely moves it.` },
            { question: `A survey is sent by email to everyone on the electoral register in one council area, asking which political party they intend to vote for nationally.<br>Give two reasons why the results may not represent the national picture.`, answer: `e.g.<br>It covers only one council area, not the whole country.<br>Only people with email access can reply, so some voters are excluded.<br>Only those who choose to respond are counted, and they may hold stronger opinions than average.` },
            { ref: "2022 Q3" },
          ],
        },
        {
          name: "Statistical Diagrams",
          questions: [
            { question: `A school records the meal choice of \\(300\\) pupils from four options.<br>The headteacher wants to show the proportion of pupils choosing each meal.<br>State the most appropriate diagram, and justify your answer.`, answer: `A pie chart.<br>It shows each category as a share of the whole, which is what a proportion is.` },
            { question: `A botanist investigates how daily hours of sunlight affect the height of a plant.<br>(a) State the independent variable.<br>(b) State the most appropriate diagram for this data.`, answer: `(a) The number of hours of sunlight, plotted on the horizontal axis.<br>(b) A scatterplot, because two numerical variables are being compared for each plant.` },
            { question: `A biologist has the masses of \\(500\\) penguins and wants to see whether the data is symmetrical or skewed.<br>State whether a boxplot or a histogram is more appropriate, and justify your answer.`, answer: `A histogram.<br>It shows the shape of the whole distribution, so skew is visible. A boxplot summarises the data into five numbers and hides the shape.` },
            { question: `Two offices are compared on the time taken to answer the phone.<br>Office A has a median of \\(45\\) seconds and an interquartile range of \\(12\\) seconds.<br>Office B has a median of \\(52\\) seconds and an interquartile range of \\(5\\) seconds.<br>Compare the two offices.`, answer: `On average the answer times at Office A are shorter, because its median of \\(45\\) seconds is lower than Office B's \\(52\\) seconds.<br>The answer times at Office B are more consistent, because its interquartile range of \\(5\\) seconds is smaller than Office A's \\(12\\) seconds.` },
            { question: `State what the length of the box in a boxplot represents.`, answer: `The interquartile range — the spread of the middle \\(50\\%\\) of the data, from the lower quartile to the upper quartile.` },
            { question: `A shop records the eye colour of \\(50\\) customers.<br>State an appropriate diagram for displaying this data, and explain why a histogram would not be suitable.`, answer: `A bar chart (or a pie chart).<br>Eye colour is categorical, and a histogram is for numerical data grouped into intervals, so it cannot be used here.` },
            { question: `Explain why the bars of a bar chart are drawn with gaps between them, while the bars of a histogram are not.`, answer: `A bar chart shows separate categories, so the gaps show that the categories are distinct.<br>A histogram shows continuous numerical data split into intervals that run into one another, so the bars touch.` },
            { ref: "2025 Q12" },
          ],
        },
        {
          name: "Distributions",
          questions: [
            { question: `A histogram of salaries shows most employees earning between \\(\\pounds 20000\\) and \\(\\pounds 40000\\), with a few earning over \\(\\pounds 500000\\).<br>Describe the shape of this distribution.`, answer: `It is positively skewed (skewed to the right).<br>The tail of high values stretches out to the right.` },
            { question: `A very easy test is sat by \\(50\\) students. Most score between \\(90\\) and \\(100\\), with a few scoring below \\(40\\).<br>Describe the shape of this distribution.`, answer: `It is negatively skewed (skewed to the left).<br>The tail of low values stretches out to the left.` },
            { question: `A histogram of the lengths of \\(800\\) sharks is a symmetrical bell shape.<br>State the most appropriate measure of location and measure of spread.`, answer: `Location: the mean.<br>Spread: the standard deviation.<br>These are appropriate because the distribution is symmetrical with no skew.` },
            { question: `A student rolls a fair six-sided die \\(600\\) times and plots the frequency of each face.<br>Describe the likely shape of this distribution.`, answer: `Approximately uniform.<br>Each face is equally likely, so all six bars should be roughly the same height, at about \\(100\\) each.` },
            { question: `A distribution is strongly positively skewed.<br>State the most appropriate measure of location and measure of spread, and justify your answer.`, answer: `Location: the median.<br>Spread: the interquartile range.<br>The long tail of high values would drag the mean upwards and inflate the standard deviation, so both would misrepresent a typical value.` },
            { question: `In a positively skewed distribution, state whether the mean or the median is larger, and explain why.`, answer: `The mean is larger.<br>The tail of high values pulls the mean up, while the median stays near the bulk of the data.` },
            { question: `The waiting times at a walk-in clinic are recorded. Most patients wait a short time, but a few wait several hours.<br>(a) Describe the shape of the distribution.<br>(b) State which average the clinic should quote to describe a typical wait, and why.`, answer: `(a) Positively skewed (skewed to the right).<br>(b) The median, because the few very long waits would pull the mean above what most patients actually experience.` },
            { ref: "2025 Q5" },
          ],
        },
        {
          name: "Descriptive Statistics",
          questions: [
            { question: `\\(84\\) out of \\(350\\) teenagers chose horror as their favourite film type.<br>Calculate the proportion, as a decimal.`, answer: `\\(\\frac{84}{350} = 0.24\\)` },
            { question: `\\(84\\) out of \\(350\\) teenagers and \\(96\\) out of \\(480\\) adults chose horror as their favourite film type.<br>By calculating both proportions, compare the preference of the two groups.`, answer: `Teenagers: \\(\\frac{84}{350} = 0.24\\)<br>Adults: \\(\\frac{96}{480} = 0.2\\)<br>A greater proportion of teenagers chose horror, \\(0.24\\) compared with \\(0.2\\).` },
            { question: `Explain why comparing the number of people who chose an option is not valid when the two samples are different sizes.`, answer: `A larger sample will tend to produce a larger count even if the preference is no stronger.<br>Only proportions (or percentages) put the two groups on the same scale, so only they can be compared fairly.` },
            { question: `Two drivers are compared on delivery time.<br>David has a mean of \\(42\\) minutes and a standard deviation of \\(8.5\\) minutes.<br>Sarah has a mean of \\(38\\) minutes and a standard deviation of \\(11.2\\) minutes.<br>Compare their performance.`, answer: `On average Sarah's delivery times are shorter, because her mean of \\(38\\) minutes is lower than David's \\(42\\) minutes.<br>David's delivery times are more consistent, because his standard deviation of \\(8.5\\) minutes is smaller than Sarah's \\(11.2\\) minutes.` },
            { question: `A dataset produces a symmetrical histogram.<br>State the most appropriate measure of location and measure of spread.`, answer: `The mean and the standard deviation.` },
            { question: `A company has \\(10\\) employees. Nine earn \\(\\pounds 25000\\) a year and the owner earns \\(\\pounds 400000\\).<br>(a) Calculate the mean salary.<br>(b) State the median salary.<br>(c) Explain which is the better description of a typical salary.`, answer: `(a) \\(\\frac{9 \\times 25000 + 400000}{10} = \\frac{625000}{10} = 62500\\), so \\(\\pounds 62500\\).<br>(b) \\(\\pounds 25000\\).<br>(c) The median. Nine of the ten employees earn \\(\\pounds 25000\\), so the mean of \\(\\pounds 62500\\) is higher than almost everyone actually earns.` },
            { question: `A sample has a mean of \\(50\\) and a standard deviation of \\(0\\).<br>State what this tells you about the data.`, answer: `Every value in the sample is \\(50\\).<br>A standard deviation of zero means there is no spread at all.` },
            { ref: "2024 Q6" },
          ],
        },
        {
          name: "Correlation",
          questions: [
            { question: `A correlation coefficient is calculated as \\(r = -0.89\\).<br>Interpret this value.`, answer: `There is a strong negative linear correlation.<br>As one variable increases, the other tends to decrease.` },
            { question: `A correlation coefficient is calculated as \\(r = 0.12\\).<br>Interpret this value.`, answer: `There is little or no linear correlation between the two variables.` },
            { question: `State the range of possible values of a correlation coefficient, and state what \\(r = 1\\) would mean.`, answer: `\\(r\\) lies between \\(-1\\) and \\(1\\) inclusive.<br>\\(r = 1\\) means a perfect positive linear relationship, with every point lying exactly on a straight line of positive gradient.` },
            { question: `A study finds a strong positive correlation \\((r = 0.94)\\) between daily ice cream sales and the number of sunburn cases.<br>A newspaper claims that eating ice cream causes sunburn.<br>Explain why this conclusion is not valid.`, answer: `Correlation does not imply causation.<br>Both are driven by a third factor — hot, sunny weather increases both ice cream sales and time spent in the sun. There is no evidence that one causes the other.` },
            { question: `Explain what is meant by a confounding variable.`, answer: `A variable that is not being studied but affects both of the variables that are, creating an apparent relationship between them that is not a direct one.` },
            { question: `A scatterplot shows points lying close to a straight line sloping downwards.<br>State what this suggests about the correlation coefficient.`, answer: `It will be negative and close to \\(-1\\), indicating a strong negative linear correlation.` },
            { question: `Statistical software reports a sample correlation of \\(r = 0.78\\) between hours of revision and exam mark.<br>Interpret this in the context of the study.`, answer: `There is a strong positive linear correlation between hours of revision and exam mark.<br>Students who revised for longer tended to score higher marks.` },
            { ref: "2023 Q5" },
          ],
        },
        {
          name: "Linear Regression",
          questions: [
            { question: `The regression line for ice cream sales against hours of sunshine is \\(\\text{Sales} = 12.4 + 3.6 \\times \\text{Sunshine}\\).<br>Interpret the value \\(3.6\\) in the context of the study.`, answer: `For each extra hour of sunshine, sales increase by \\(3.6\\) ice creams on average.` },
            { question: `The regression line for ice cream sales against hours of sunshine is \\(\\text{Sales} = 12.4 + 3.6 \\times \\text{Sunshine}\\).<br>Use the model to predict sales on a day with \\(7\\) hours of sunshine.`, answer: `\\(12.4 + 3.6 \\times 7 = 12.4 + 25.2 = 37.6\\)<br>About \\(38\\) ice creams.` },
            { question: `The regression line for ice cream sales against hours of sunshine is \\(\\text{Sales} = 12.4 + 3.6 \\times \\text{Sunshine}\\).<br>Interpret the value \\(12.4\\), and comment on whether it is meaningful.`, answer: `It is the predicted number of sales when there are \\(0\\) hours of sunshine.<br>It is only meaningful if days with no sunshine were included in the data used to build the model; otherwise it is an extrapolation beyond the data.` },
            { question: `A model relating calories burned to distance run is \\(\\text{Calories} = -35.2 + 68.5 \\times \\text{Distance}\\), where distance is in kilometres.<br>Use the model to predict the calories burned on a \\(6\\) km run.`, answer: `\\(-35.2 + 68.5 \\times 6 = -35.2 + 411 = 375.8\\)<br>About \\(376\\) calories.` },
            { question: `A model relating calories burned to distance run is \\(\\text{Calories} = -35.2 + 68.5 \\times \\text{Distance}\\).<br>Explain why the intercept of \\(-35.2\\) cannot be interpreted sensibly.`, answer: `It would mean that running \\(0\\) km burns \\(-35.2\\) calories, which is impossible.<br>The model was built from runs of a positive length, so a distance of \\(0\\) lies outside the data it applies to.` },
            { question: `A model relating fuel efficiency to car weight was built from cars weighing between \\(900\\) kg and \\(1800\\) kg.<br>Explain whether the model should be used to predict the efficiency of a \\(2500\\) kg car.`, answer: `It should not.<br>\\(2500\\) kg lies outside the range of the data used to build the model, so the prediction is an extrapolation and there is no evidence the relationship continues that far.` },
            { question: `Explain the difference between interpolation and extrapolation, and state which gives the more reliable prediction.`, answer: `Interpolation is predicting within the range of the data used to build the model; extrapolation is predicting outside it.<br>Interpolation is more reliable, because the model has been fitted to data covering that range.` },
            { ref: "2022 Q7" },
            { ref: "Specimen Q8" },
          ],
        },
        {
          name: "Hypothesis Testing and Errors",
          questions: [
            { question: `A scientist wants to know whether a new running shoe changes the mean sprint time of athletes.<br>State the null and alternative hypotheses.`, answer: `\\(H_0\\): the new shoe makes no difference to the mean sprint time.<br>\\(H_1\\): the new shoe changes the mean sprint time.` },
            { question: `A test produces a p-value of \\(0.014\\).<br>State the conclusion at the \\(5\\%\\) significance level.`, answer: `\\(0.014 < 0.05\\), so there is sufficient evidence to reject the null hypothesis at the \\(5\\%\\) level.` },
            { question: `A botanist tests whether a new soil increases the mean height of tomato plants. The test gives a p-value of \\(0.182\\).<br>A student writes: "Since \\(0.182 > 0.05\\), we accept the null hypothesis. The soil makes no difference."<br>Explain what is wrong with this conclusion.`, answer: `We never accept the null hypothesis — we only fail to reject it.<br>The correct conclusion is that there is insufficient evidence to reject the null hypothesis at the \\(5\\%\\) level. That is not the same as proving the soil makes no difference; the test may simply not have detected an effect.` },
            { question: `A company tests whether a new battery lasts the same time as the old one.<br>Explain, in this context, what is meant by a Type I error.`, answer: `Rejecting the null hypothesis when it is actually true.<br>Here, concluding that the new battery performs differently when in fact it lasts the same time as the old one.` },
            { question: `A company tests whether a new battery lasts the same time as the old one.<br>Explain, in this context, what is meant by a Type II error.`, answer: `Failing to reject the null hypothesis when it is actually false.<br>Here, concluding there is no difference when the new battery really does last a different length of time.` },
            { question: `State what the significance level of a test represents.`, answer: `The probability of rejecting the null hypothesis when it is in fact true — that is, the chance of making a Type I error.<br>At the \\(5\\%\\) level this is \\(0.05\\).` },
            { question: `A test produces a p-value of \\(0.049\\).<br>State the conclusion at the \\(5\\%\\) level and at the \\(1\\%\\) level.`, answer: `At the \\(5\\%\\) level: \\(0.049 < 0.05\\), so reject the null hypothesis.<br>At the \\(1\\%\\) level: \\(0.049 > 0.01\\), so there is insufficient evidence to reject the null hypothesis.` },
          ],
        },
        {
          name: "Confidence Intervals and P Values",
          questions: [
            { question: `Software gives a \\(95\\%\\) confidence interval for the mean weight of adult dolphins as \\([155.2, 168.4]\\) kg.<br>Explain what this means.`, answer: `If the sampling were repeated \\(100\\) times and a confidence interval calculated each time, about \\(95\\) of those intervals would contain the true mean weight of the population.` },
            { question: `A \\(95\\%\\) confidence interval for a difference in means is \\([-1.45, 2.15]\\).<br>State what the fact that the interval contains zero tells you.`, answer: `Zero is a plausible value for the difference, so there is no significant difference between the two means at the \\(5\\%\\) level.` },
            { question: `A test gives a p-value of \\(0.612\\) and a \\(95\\%\\) confidence interval for the difference in means of \\([-1.45, 2.15]\\).<br>State the conclusion, and explain how the two results agree.`, answer: `\\(0.612 > 0.05\\), so there is insufficient evidence to reject the null hypothesis of no difference.<br>The confidence interval contains zero, which says the same thing: no difference is a plausible value.` },
            { question: `A test gives a p-value of \\(0.013\\) and a \\(95\\%\\) confidence interval for the difference in proportions of \\([0.04, 0.31]\\).<br>State the conclusion, and explain how the two results agree.`, answer: `\\(0.013 < 0.05\\), so reject the null hypothesis: there is a significant difference.<br>The confidence interval does not contain zero, so zero difference is not plausible — the same conclusion.` },
            { question: `State what a p-value measures.`, answer: `The probability of obtaining results at least as extreme as those observed, assuming the null hypothesis is true.<br>A small p-value means the observed data would be unlikely if the null hypothesis were true.` },
            { question: `Explain why a \\(99\\%\\) confidence interval is wider than a \\(95\\%\\) confidence interval for the same data.`, answer: `To be more confident of capturing the true value, the interval has to cover a wider range of possibilities.` },
          ],
        },
        {
          name: "Correlation Tests",
          questions: [
            { question: `A researcher tests whether there is a relationship between hours of practice and success rate.<br>State the null and alternative hypotheses.`, answer: `\\(H_0\\): there is no correlation between hours of practice and success rate.<br>\\(H_1\\): there is a correlation between hours of practice and success rate.` },
            { question: `A correlation test gives a p-value of \\(0.415\\) and a \\(95\\%\\) confidence interval of \\([-0.215, 0.455]\\).<br>State the conclusion at the \\(5\\%\\) level.`, answer: `\\(0.415 > 0.05\\), so there is insufficient evidence to reject the null hypothesis.<br>There is no significant correlation between the two variables. The confidence interval containing zero agrees with this.` },
            { question: `A correlation test gives a p-value of \\(0.0004\\) and a sample correlation of \\(r = 0.83\\).<br>State the conclusion at the \\(5\\%\\) level, in context, for a study of practice hours against success rate.`, answer: `\\(0.0004 < 0.05\\), so reject the null hypothesis.<br>There is a significant positive correlation between hours of practice and success rate.` },
            { question: `State the R Studio command used to carry out a correlation test on two columns of data named <code>Practice</code> and <code>Success</code>.`, answer: `<code>cor.test(Practice, Success)</code>` },
            { question: `A correlation test on shoe size against typing speed gives a p-value of \\(0.415\\).<br>A student concludes that shoe size has no effect on typing speed.<br>Explain what is wrong with this wording.`, answer: `The test looks for a correlation, not for an effect, and it cannot show that one thing causes another.<br>The correct conclusion is that there is insufficient evidence of a correlation between shoe size and typing speed.` },
            { question: `A study of practice hours against success rate used practice times from \\(2\\) to \\(10\\) hours.<br>Explain why the model should not be used to predict the success rate of someone practising \\(25\\) hours a week.`, answer: `\\(25\\) hours is far outside the range of the data, so the prediction would be an extrapolation.<br>There is no evidence that the relationship continues at that level of practice.` },
          ],
        },
        {
          name: "T Tests",
          questions: [
            { question: `The resting pulse of \\(40\\) volunteers is recorded, and then recorded again after eight weeks of training.<br>State whether a paired or an independent t-test is appropriate, and justify your answer.`, answer: `A paired t-test.<br>The same \\(40\\) people are measured twice, so each 'before' reading is paired with an 'after' reading from the same person.` },
            { question: `The battery life of \\(25\\) phones from Brand A is compared with \\(31\\) phones from Brand B.<br>State whether a paired or an independent t-test is appropriate, and justify your answer.`, answer: `An independent t-test.<br>The two groups contain different phones, and the sample sizes are not even the same, so the readings cannot be paired.` },
            { question: `A gym records the training time of the same \\(60\\) members in January and again in June.<br>A paired t-test gives a p-value of \\(0.005\\).<br>State the conclusion at the \\(5\\%\\) level, in context.`, answer: `\\(0.005 < 0.05\\), so reject the null hypothesis.<br>There is a significant difference in the mean training time of members between January and June.` },
            { question: `A researcher compares the mean height of tomato plants from two greenhouses.<br>State the null and alternative hypotheses.`, answer: `\\(H_0\\): there is no difference in the mean height of plants from the two greenhouses.<br>\\(H_1\\): there is a difference in the mean height of plants from the two greenhouses.` },
            { question: `An independent t-test comparing plants from two greenhouses returns a p-value of \\(0.214\\).<br>State the conclusion at the \\(5\\%\\) level, in context.`, answer: `\\(0.214 > 0.05\\), so there is insufficient evidence to reject the null hypothesis.<br>There is no significant difference in the mean height of plants from the two greenhouses.` },
            { question: `State the R Studio command for an independent t-test comparing two columns of data named <code>GroupA</code> and <code>GroupB</code>.`, answer: `<code>t.test(GroupA, GroupB)</code>` },
            { question: `State the R Studio command for a paired t-test comparing two columns of data named <code>Before</code> and <code>After</code>.`, answer: `<code>t.test(Before, After, paired = TRUE)</code>` },
            { ref: "2025 Q9" },
          ],
        },
        {
          name: "Z Tests",
          questions: [
            { question: `A manager compares the defect rate of two machines.<br>Machine A produced \\(14\\) defective items out of \\(500\\); machine B produced \\(22\\) out of \\(450\\).<br>State the null and alternative hypotheses.`, answer: `\\(H_0\\): there is no difference in the proportion of defective items produced by the two machines.<br>\\(H_1\\): there is a difference in the proportion of defective items produced by the two machines.` },
            { question: `Explain why a z-test for proportions, rather than a t-test, is used to compare two defect rates.`, answer: `The data is categorical — each item is either defective or not — so the comparison is between two proportions.<br>A t-test compares means of numerical data, which is not what is being measured here.` },
            { question: `A z-test comparing the proportion of adults and teenagers who shop online gives a p-value of \\(0.214\\) and a \\(95\\%\\) confidence interval of \\([-0.08, 0.31]\\).<br>State the conclusion at the \\(5\\%\\) level, in context.`, answer: `\\(0.214 > 0.05\\), so there is insufficient evidence to reject the null hypothesis.<br>There is no significant difference in the proportion of adults and teenagers who prefer shopping online. The confidence interval containing zero agrees.` },
            { question: `A council compares smart meter uptake in two cities. In City X, \\(312\\) of \\(500\\) households have one; in City Y, \\(245\\) of \\(550\\).<br>Calculate the proportion for each city.`, answer: `City X: \\(\\frac{312}{500} = 0.624\\)<br>City Y: \\(\\frac{245}{550} = 0.445...\\), which is \\(0.445\\) to 3 decimal places.` },
            { question: `A z-test on smart meter uptake in two cities gives a p-value of \\(0.0000002\\).<br>State the conclusion at the \\(5\\%\\) level, in context.`, answer: `The p-value is far less than \\(0.05\\), so reject the null hypothesis.<br>There is a significant difference in the proportion of households with a smart meter in the two cities.` },
            { question: `State the R Studio command for a z-test comparing \\(82\\) successes out of \\(150\\) with \\(78\\) successes out of \\(120\\).`, answer: `<code>prop.test(c(82, 78), c(150, 120))</code>` },
          ],
        },
        {
          name: "Mixed Hypothesis Tests",
          questions: [
            { question: `A researcher compares the mean reaction time of professional athletes with that of amateur athletes.<br>State the most appropriate hypothesis test.`, answer: `An independent (two-sample) t-test.<br>Two separate groups are being compared on a numerical mean.` },
            { question: `A researcher records the memory test score of the same \\(50\\) students in silence and again with music playing.<br>State the most appropriate hypothesis test, and justify your answer.`, answer: `A paired t-test.<br>The same students are measured twice, so the two sets of scores are paired.` },
            { question: `A biologist compares the proportion of male and female turtles that successfully migrate.<br>State the most appropriate hypothesis test.`, answer: `A z-test for two proportions.<br>The data is categorical and two proportions are being compared.` },
            { question: `A researcher investigates whether there is a relationship between hours of sleep and concentration score.<br>State the most appropriate hypothesis test.`, answer: `A correlation test.<br>Two numerical variables are measured on the same individuals and the question is whether they are related.` },
            { question: `Explain how you decide between a paired and an independent t-test.`, answer: `Ask whether each value in one group is naturally matched with one value in the other.<br>If the same subjects are measured twice, or subjects are matched in pairs, use a paired t-test. If the two groups contain different, unrelated subjects, use an independent t-test.` },
            { question: `A test comparing two means returns a p-value of \\(0.032\\).<br>Write a full conclusion at the \\(5\\%\\) level for a study of whether a training programme changes mean sprint time.`, answer: `\\(0.032 < 0.05\\), so there is sufficient evidence to reject the null hypothesis at the \\(5\\%\\) level.<br>There is a significant difference in the mean sprint time before and after the training programme.` },
            { question: `Explain why the conclusion of a hypothesis test should always be written in the context of the study.`, answer: `A statement such as "reject \\(H_0\\)" says nothing about the situation being investigated.<br>The conclusion must say what the result means for the variables in the study, so that the reader knows what has actually been shown.` },
          ],
        },
      ],
    },
  ],
};
