import { GeneratedQuestion } from "./types";
import { getRandomInt } from "./utils";

const NAMES = ["Aisha", "Ben", "Chloe", "David", "Emma", "Finn", "Grace", "Harry", "Isla", "Jack"];
function getRandomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

function getRandStep(min: number, max: number, step: number) {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

export function generateHigherAppsQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  let q: string[] = [];
  let bq: string[] | null = null;
  let a: string[] = [];
  let finalAns = "";
  let attachments: { filename: string; content: string; rawData?: any[][] }[] | undefined;
  const name = getRandomName();

  if (selectedTopic === "Income & Taxation") {
    const variation = getRandomInt(1, 6);
    if (variation === 1) {
      const grossSalary = getRandStep(35000, 85000, 500);
      const pensionPercent = getRandStep(40, 90, 1) / 10;
      
      q = [
        `${name} earns a gross annual salary of £${grossSalary.toLocaleString()}.`,
        `They pay ${pensionPercent.toFixed(1)}% of their gross annual salary into their workplace pension scheme.`,
        `Calculate ${name}'s taxable annual income.`
      ];
      bq = [
        `Gross Salary: £${grossSalary.toLocaleString()}`,
        `Workplace pension: ${pensionPercent.toFixed(1)}%`,
        `Calculate ${name}'s taxable annual income.`
      ];
      
      const pensionAmount = grossSalary * (pensionPercent / 100);
      const taxableIncome = grossSalary - pensionAmount;
      
      a = [
        `<strong>1.</strong> Pension contribution: ${grossSalary} \\times (${pensionPercent}/100) = £${pensionAmount.toFixed(2)}`,
        `<strong>2.</strong> Taxable income: ${grossSalary} - ${pensionAmount.toFixed(2)} = £${taxableIncome.toFixed(2)}`
      ];
      finalAns = `£${taxableIncome.toFixed(2)}`;
    } else if (variation === 2) {
      const grossAnn = getRandomInt(28000, 45000);
      const penPct = getRandomInt(3, 8);
      const niMonth = getRandomInt(100, 200) + getRandomInt(0, 99) / 100;
      const taxPre = getRandomInt(2000, 4000) + getRandomInt(0, 99) / 100;
      
      q = [
        `${name}'s gross annual salary is £${grossAnn.toLocaleString()}.`,
        `They contribute ${penPct}% of their salary before tax into their pension fund.`,
        `${name} pays £${niMonth.toFixed(2)} in National Insurance each month.`,
        `Their annual income tax deduction is £${taxPre.toFixed(2)}.`,
        `Calculate ${name}'s net monthly income.`
      ];
      bq = [
        `Gross Annual: £${grossAnn.toLocaleString()}.`,
        `Pension: ${penPct}% (pre-tax).`,
        `NI (monthly): £${niMonth.toFixed(2)}.`,
        `Tax (annual): £${taxPre.toFixed(2)}.`,
        `Calculate ${name}'s net monthly income.`
      ];
      
      const grossMonth = grossAnn / 12;
      const penMonth = grossMonth * (penPct / 100);
      const taxMonth = taxPre / 12;
      const deductions = penMonth + niMonth + taxMonth;
      const netMonth = grossMonth - deductions;
      
      a = [
        `<strong>1.</strong> Gross monthly: ${grossAnn} / 12 = £${grossMonth.toFixed(2)}`,
        `<strong>2.</strong> Monthly Pension: ${grossMonth.toFixed(2)} \\times (${penPct}/100) = £${penMonth.toFixed(2)}`,
        `<strong>3.</strong> Monthly Tax: ${taxPre.toFixed(2)} / 12 = £${taxMonth.toFixed(2)}`,
        `<strong>4.</strong> Total Monthly Deductions: ${penMonth.toFixed(2)} (Pen) + ${niMonth.toFixed(2)} (NI) + ${taxMonth.toFixed(2)} (Tax) = £${deductions.toFixed(2)}`,
        `<strong>5.</strong> Net Monthly Income: ${grossMonth.toFixed(2)} - ${deductions.toFixed(2)} = £${netMonth.toFixed(2)}`
      ];
      finalAns = `£${netMonth.toFixed(2)}`;
    } else if (variation === 3) {
      // 50% chance: only starter + basic bands (lower income); 50% chance: all three bands
      const crossIntermediate = Math.random() < 0.5;
      const taxableIncome = crossIntermediate
        ? getRandStep(28000, 42000, 100)
        : getRandStep(14000, 27000, 100);

      const band1Tax = (15397 - 12570) * 0.19;
      const band2Tax = taxableIncome > 15397
        ? (Math.min(taxableIncome, 27491) - 15397) * 0.20
        : 0;
      const band3Tax = crossIntermediate ? (taxableIncome - 27491) * 0.21 : 0;
      const totalTax = band1Tax + band2Tax + band3Tax;

      const bandsDesc = crossIntermediate
        ? `Starter: 19% on £12,570–£15,397; Basic: 20% on £15,397–£27,491; Intermediate: 21% on £27,491–£43,662`
        : `Starter: 19% on £12,570–£15,397; Basic: 20% on £15,397–£27,491`;

      q = [
        `${name} has a taxable annual income of £${taxableIncome.toLocaleString()}.`,
        `Using the Scottish income tax bands for 2025/26 (${bandsDesc}), calculate ${name}'s annual income tax deduction.`
      ];
      bq = [
        `Taxable income: £${taxableIncome.toLocaleString()}`,
        `Scottish tax bands 2025/26: Starter 19% (£12,570–£15,397); Basic 20% (£15,397–£27,491)${crossIntermediate ? `; Int. 21% (£27,491–£43,662)` : ``}.`,
        `Calculate ${name}'s annual income tax deduction.`
      ];

      a = [
        `<strong>1.</strong> Starter Band (19%): (£15,397 − £12,570) × 0.19 = £${band1Tax.toFixed(2)}`,
        ...(taxableIncome > 15397
          ? [`<strong>2.</strong> Basic Band (20%): (£${Math.min(taxableIncome, 27491).toLocaleString()} − £15,397) × 0.20 = £${band2Tax.toFixed(2)}`]
          : []),
        ...(crossIntermediate
          ? [`<strong>3.</strong> Intermediate Band (21%): (£${taxableIncome.toLocaleString()} − £27,491) × 0.21 = £${band3Tax.toFixed(2)}`]
          : []),
        `<strong>${crossIntermediate ? 4 : taxableIncome > 15397 ? 3 : 2}.</strong> Total Annual Tax = £${totalTax.toFixed(2)}`
      ];
      finalAns = `£${totalTax.toFixed(2)}`;
    } else if (variation === 4) {
      const grossMonthly = getRandStep(4500, 7500, 100);

      q = [
        `For the 2025/26 tax year, National Insurance is calculated at 8% on monthly earnings between £1,048 and £4,189, and 2% on earnings above £4,189.`,
        `${name} has a gross monthly salary of £${grossMonthly.toLocaleString()}.`,
        `Calculate their monthly National Insurance contribution.`
      ];
      bq = [
        `Gross monthly salary: £${grossMonthly.toLocaleString()}`,
        `NI (2025/26): 8% on monthly earnings £1,048-£4,189. 2% on earnings above £4,189.`,
        `Calculate their monthly National Insurance contribution.`
      ];

      const band1 = (4189 - 1048) * 0.08;
      const band2 = (grossMonthly - 4189) * 0.02;
      const totalNi = band1 + band2;

      a = [
        `<strong>1.</strong> Band 1 (8%) contribution: (4189 - 1048) \\times 0.08 = £251.28`,
        `<strong>2.</strong> Band 2 (2%) contribution: (${grossMonthly} - 4189) \\times 0.02 = £${band2.toFixed(2)}`,
        `<strong>3.</strong> Total Monthly NI = 251.28 + ${band2.toFixed(2)} = £${totalNi.toFixed(2)}`
      ];
      finalAns = `£${totalNi.toFixed(2)}`;
    } else if (variation === 5) {
      // Pension accumulation — 2022 Q8(b) pattern
      // MI: •⁴ calculate monthly contribution  •⁵ value after 2nd contribution  •⁶ value after 3rd
      const empPct  = getRandStep(20, 60, 5) / 10;   // 2.0–6.0% employee
      const emplPct = getRandStep(40, 90, 5) / 10;   // 4.0–9.0% employer
      const aerPct  = getRandStep(70, 120, 5) / 10;  // 7.0–12.0% pension fund AER
      const aerStr  = (1 + aerPct / 100).toFixed(4); // e.g. "1.1000"

      // Two context types: salary + commission (like SQA 2022), or flat monthly salary
      const commContexts = [
        { role: "sales assistant", unit: "item" },
        { role: "insurance broker", unit: "policy" },
        { role: "estate agent",    unit: "viewing" },
        { role: "car salesperson", unit: "vehicle" },
      ];
      const useComm = Math.random() < 0.5;
      let monthlyEarnings: number;
      let earningsLines: string[];

      if (useComm) {
        const salary     = getRandStep(1000, 3000, 500);
        const commRate   = getRandStep(10, 50, 5);           // £ per unit
        const units      = getRandomInt(5, 20) * 10;         // 50–200 units/month
        monthlyEarnings  = salary + commRate * units;
        const ctx        = commContexts[getRandomInt(0, commContexts.length - 1)];
        earningsLines = [
          `${name} works as a ${ctx.role} and earns a monthly salary of £${salary.toLocaleString()} plus £${commRate} commission for each ${ctx.unit} sold.`,
          `${name} expects to sell ${units} ${ctx.unit}s per month.`,
        ];
      } else {
        monthlyEarnings = getRandStep(2000, 5000, 500);
        earningsLines   = [`${name} earns a fixed monthly salary of £${monthlyEarnings.toLocaleString()}.`];
      }

      const C = Math.round(monthlyEarnings * (empPct + emplPct) / 100);
      const m = Math.pow(1 + aerPct / 100, 1 / 12) - 1;
      const after2 = C * (1 + m) + C;
      const after3 = after2 * (1 + m) + C;

      q = [
        ...earningsLines,
        `${name} is enrolled in a workplace pension scheme. ${name} contributes ${empPct.toFixed(1)}% of their monthly earnings and the employer contributes a further ${emplPct.toFixed(1)}% of the same monthly earnings.`,
        `The pension fund earns an annual effective rate of interest of ${aerPct.toFixed(1)}%.`,
        `Calculate the value of ${name}'s pension fund immediately after the third monthly contribution is made.`
      ];
      bq = [
        `Monthly earnings: £${monthlyEarnings.toLocaleString()}. Employee pension: ${empPct.toFixed(1)}%. Employer: ${emplPct.toFixed(1)}%. AER: ${aerPct.toFixed(1)}%.`,
        `Calculate pension fund value immediately after 3rd monthly contribution.`
      ];
      a = [
        `<strong>•¹</strong> Monthly contribution: (${empPct.toFixed(1)}% + ${emplPct.toFixed(1)}%) × £${monthlyEarnings.toLocaleString()} = £${C}`,
        `<strong>•²</strong> Value after 2nd contribution: £${C} × ${aerStr}^{1/12} + £${C} = £${after2.toFixed(2)}`,
        `<strong>•³</strong> Value after 3rd contribution: £${after2.toFixed(2)} × ${aerStr}^{1/12} + £${C} = £${after3.toFixed(2)}`
      ];
      finalAns = `£${after3.toFixed(2)}`;
    } else if (variation === 6) {
      // Written: reason not to leave company pension — 2022 Q8(c) pattern
      const empPct6  = getRandStep(30, 70, 5) / 10;
      const emplPct6 = getRandStep(40, 90, 5) / 10;
      const monthSal6 = getRandStep(2000, 4000, 500);

      q = [
        `${name} has recently started a new job and earns £${monthSal6.toLocaleString()} per month.`,
        `${name}'s employer offers a workplace pension scheme. ${name} contributes ${empPct6.toFixed(1)}% of their monthly earnings and their employer contributes a further ${emplPct6.toFixed(1)}% of the same monthly earnings into the pension fund.`,
        `State one reason why ${name} should not leave the company pension scheme.`
      ];
      bq = [
        `${name} earns £${monthSal6.toLocaleString()}/month. Employee pension: ${empPct6.toFixed(1)}%, employer: ${emplPct6.toFixed(1)}%.`,
        `State one reason why ${name} should NOT leave the pension scheme.`
      ];
      a = [
        `<strong>•¹</strong> Valid reason, e.g. "The employer contributes ${emplPct6.toFixed(1)}% of ${name}'s monthly earnings — this extra contribution would be lost if ${name} left the scheme" OR "Pension savings provide income in retirement when ${name} is no longer working."`
      ];
      finalAns = `Employer contribution would be lost / pension provides retirement income`;
    }
  } else if (selectedTopic === "Interest Rates & Accumulation" || selectedTopic === "Interest Rates & Accumulation (Software)") {
    const isSoftware = selectedTopic === "Interest Rates & Accumulation (Software)";
    let variation = 5;
    if (!isSoftware) {
      const nonSoftware = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12];
      variation = nonSoftware[getRandomInt(0, nonSoftware.length - 1)];
    }
    if (variation === 1) {
      const aerPercent = getRandStep(120, 359, 1) / 10;
      
      q = [
        `${name} takes out a personal loan. The annual effective rate of interest on the loan is ${aerPercent.toFixed(1)}%.`,
        `Calculate the equivalent monthly effective rate of interest, giving your answer as a percentage to 2 decimal places.`
      ];
      bq = [
        `Annual Effective Rate (AER): ${aerPercent.toFixed(1)}%.`,
        `Calculate the equivalent monthly effective rate of interest (2 d.p.).`
      ];
      
      const decimalMultiplier = Math.pow(1 + aerPercent / 100, 1/12);
      const monthlyDecimal = decimalMultiplier - 1;
      const finalPercent = monthlyDecimal * 100;
      
      a = [
        `<strong>1.</strong> Multiplier formula: (1 + (${aerPercent}/100))^{1/12} - 1`,
        `<strong>2.</strong> Calculation: ${decimalMultiplier.toFixed(6)} - 1 = ${monthlyDecimal.toFixed(6)}`,
        `<strong>3.</strong> Convert to percentage: ${monthlyDecimal.toFixed(6)} \\times 100 = ${finalPercent.toFixed(2)}\\%`
      ];
      finalAns = `${finalPercent.toFixed(2)}\\%`;
    } else if (variation === 2) {
      const dep1 = getRandStep(1500, 6000, 100);
      const dep2 = getRandStep(1500, 6000, 100);
      const rate1 = getRandStep(25, 65, 1) / 10;
      const rate2 = getRandStep(15, 45, 1) / 100;
      
      q = [
        `${name} deposits £${dep1.toLocaleString()} into a savings account on 1 January 2023. The effective interest rate is ${rate1.toFixed(1)}% per year.`,
        `On 1 January 2024, they deposit a further £${dep2.toLocaleString()}, and the effective interest rate changes to ${rate2.toFixed(2)}% per month.`,
        `Calculate the balance in the account on 1 January 2025.`
      ];
      bq = [
        `Deposit 1 (1 Jan 2023): £${dep1.toLocaleString()}`,
        `> Interest: ${rate1.toFixed(1)}% per year.`,
        `Deposit 2 (1 Jan 2024): £${dep2.toLocaleString()}`,
        `> Interest changes to ${rate2.toFixed(2)}% per month.`,
        `Calculate the balance on 1 January 2025.`
      ];
      
      const endYear1Bal = dep1 * (1 + rate1 / 100);
      const startYear2Bal = endYear1Bal + dep2;
      const finalBalance = startYear2Bal * Math.pow(1 + rate2 / 100, 12);
      
      a = [
        `<strong>1.</strong> Accumulate Year 1: ${dep1} \\times (1 + ${rate1}/100) = £${endYear1Bal.toFixed(2)}`,
        `<strong>2.</strong> Add second deposit: ${endYear1Bal.toFixed(2)} + ${dep2} = £${startYear2Bal.toFixed(2)}`,
        `<strong>3.</strong> Accumulate Year 2 (Monthly compound): ${startYear2Bal.toFixed(2)} \\times (1 + ${rate2}/100)^{12} = £${finalBalance.toFixed(2)}`
      ];
      finalAns = `£${finalBalance.toFixed(2)}`;
    } else if (variation === 3) {
      const target = getRandStep(4000, 12000, 500);
      const monthsOpts = [12, 24, 36];
      const months = monthsOpts[getRandomInt(0, 2)];
      const monthlyRate = getRandStep(20, 60, 1) / 100;
      
      q = [
        `${name} has a savings goal of £${target.toLocaleString()} to buy a car in exactly ${months} months.`,
        `They open an account that pays an effective interest rate of ${monthlyRate.toFixed(2)}% per month.`,
        `Calculate the minimum single deposit ${name} must make today to achieve this savings goal.`
      ];
      bq = [
        `Savings goal: £${target.toLocaleString()} in ${months} months.`,
        `Interest rate: ${monthlyRate.toFixed(2)}% per month.`,
        `Calculate the minimum single deposit required today.`
      ];
      
      const multiplier = 1 + monthlyRate / 100;
      const minDeposit = target / Math.pow(multiplier, months);
      
      a = [
        `<strong>1.</strong> Present Value Formula: \\text{Target} / (\\text{Multiplier})^{\\text{Months}}`,
        `<strong>2.</strong> Calculation: ${target} / (1 + ${monthlyRate}/100)^{${months}}`,
        `<strong>3.</strong> £${minDeposit.toFixed(2)}`
      ];
      finalAns = `£${minDeposit.toFixed(2)}`;
    } else if (variation === 4) {
      const year1Rate = getRandStep(20, 50, 1) / 10;
      const year2Rate = getRandStep(15, 30, 1) / 10;
      const year3Rate = getRandStep(8, 20, 1) / 10;

      const mult1 = 1 + (year1Rate / 100);
      const mult2 = 1 + (year2Rate / 100);
      const mult3 = 1 + (year3Rate / 100);
      const combinedMult = mult1 * mult2 * mult3;
      const overallIncrease = (combinedMult - 1) * 100;
      const endPrice = getRandStep(1200, 2200, 10) / 10;
      const startPrice = endPrice / combinedMult;

      q = [
        `The average price of a product increased at the following annual effective rates:`,
        `• Year 1: ${year1Rate.toFixed(1)}%`,
        `• Year 2: ${year2Rate.toFixed(1)}%`,
        `• Year 3: ${year3Rate.toFixed(1)}%`,
        `(a) Calculate the overall percentage increase in the average price over the three years.`,
        `The average price of the product at the end of Year 3 was £${endPrice.toFixed(2)}.`,
        `(b) Hence calculate the average cost of the product at the start of Year 1.`
      ];

      bq = [
        `Annual effective rate increases: Y1: ${year1Rate.toFixed(1)}%, Y2: ${year2Rate.toFixed(1)}%, Y3: ${year3Rate.toFixed(1)}%`,
        `(a) Calculate overall percentage increase over the three years.`,
        `End of Y3 price: £${endPrice.toFixed(2)}`,
        `(b) Calculate cost at start of Y1.`
      ];

      a = [
        `<strong>(a) 1.</strong> Combined multiplier = (1 + ${year1Rate}/100) \\times (1 + ${year2Rate}/100) \\times (1 + ${year3Rate}/100)`,
        `<strong>(a) 2.</strong> = ${mult1} \\times ${mult2} \\times ${mult3} = ${combinedMult.toFixed(6)}`,
        `<strong>(a) 3.</strong> Overall % increase = (${combinedMult.toFixed(6)} - 1) \\times 100 = ${overallIncrease.toFixed(2)}%`,
        `<strong>(b) 1.</strong> Original Price = End Price / Combined Multiplier`,
        `<strong>(b) 2.</strong> = ${endPrice.toFixed(2)} / ${combinedMult.toFixed(6)} = £${startPrice.toFixed(2)}`
      ];
      finalAns = `(a) ${overallIncrease.toFixed(2)}% (b) £${startPrice.toFixed(2)}`;
    } else if (variation === 5) {
      const initAmount = getRandStep(1000, 3000, 100);
      const interestRate = getRandStep(12, 18, 1) / 10;
      const deposit = getRandStep(100, 250, 10);
      
      const perc = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });
      
      // SQA-exact layout: col A blank margin, data starts in col B
      const rawData: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", "Savings Schedule"],
        [],
        ["", "Initial deposit", curr(initAmount)],
        ["", "Annual effective interest rate", perc(interestRate / 100, 1)],
        ["", "Monthly effective interest rate", perc("", 6)],
        ["", "Monthly Deposit", curr(deposit)],
        [],
        ["", "Month", "Opening Balance", "Monthly Deposit", "Interest Earned", "Closing Balance"],
        ["", 0, curr(initAmount), curr(0), curr(0), curr(initAmount)],
        ["", 1, curr(""), curr(deposit), curr(""), curr("")],
        ["", 2, curr(""), curr(deposit), curr(""), curr("")],
        ["", 3, curr(""), curr(deposit), curr(""), curr("")],
        ["", 4, curr(""), curr(deposit), curr(""), curr("")],
        ["", 5, curr(""), curr(deposit), curr(""), curr("")],
        ["", 6, curr(""), curr(deposit), curr(""), curr("")],
        ["", 7, curr(""), curr(deposit), curr(""), curr("")],
        ["", 8, curr(""), curr(deposit), curr(""), curr("")],
        ["", 9, curr(""), curr(deposit), curr(""), curr("")],
        ["", 10, curr(""), curr(deposit), curr(""), curr("")],
        ["", 11, curr(""), curr(deposit), curr(""), curr("")],
        ["", 12, curr(""), curr(deposit), curr(""), curr("")],
      ];
      
      const monDecimal = Math.pow(1 + interestRate/100, 1/12) - 1;
      const monRateStr = (monDecimal * 100).toFixed(4);

      // Calculate full 12-month schedule for the answer
      let bal = initAmount;
      const schedule: { open: number; interest: number; close: number }[] = [];
      for (let m = 1; m <= 12; m++) {
        const open = bal + deposit;
        const interest = open * monDecimal;
        const close = open + interest;
        schedule.push({ open, interest, close });
        bal = close;
      }
      const finalBal = schedule[11].close;

      q = [
        `${name} opens a savings account with an initial deposit of £${initAmount.toLocaleString()}.`,
        `The annual effective rate of interest is ${interestRate.toFixed(1)}%, paid at the end of each month.`,
        `Every month, ${name} deposits £${deposit} at the start of the month.`,
        `A spreadsheet template has been provided in the attachments.`,
        `(a) Complete the formula for the monthly effective interest rate.`,
        `(b) Complete the savings schedule for all 12 months and state the balance at the end of Month 12.`
      ];

      bq = [
        `Initial deposit: £${initAmount.toLocaleString()}`,
        `AER: ${interestRate.toFixed(1)}%, paid monthly.`,
        `Monthly deposit: £${deposit}`,
        `(a) Complete formula for monthly effective rate.`,
        `(b) Complete full 12-month schedule; state balance at end of Month 12.`
      ];

      a = [
        `<strong>(a)</strong> Monthly rate = (1 + ${interestRate}/100)<sup>1/12</sup> - 1 = ${monRateStr}%`,
        `<strong>(b)</strong> Month 1 example: Opening = £${initAmount.toFixed(2)} + £${deposit} = £${schedule[0].open.toFixed(2)}; Interest = £${schedule[0].interest.toFixed(2)}; Closing = £${schedule[0].close.toFixed(2)}`,
        `Months 2–12 follow the same pattern (previous closing balance + monthly deposit, then × monthly rate for interest).`,
        `<strong>Balance at end of Month 12: £${finalBal.toFixed(2)}</strong>`
      ];
      finalAns = `(a) ${monRateStr}% (b) £${finalBal.toFixed(2)}`;
      attachments = [{ filename: "Savings_Schedule.xlsx", content: "", rawData }];
    } else if (variation === 6) {
      const goal = getRandStep(4000, 8000, 500);
      const r1 = getRandStep(300, 500, 1) / 1000;
      const r2 = getRandStep(15, 35, 1) / 10;
      const r3 = getRandStep(20, 50, 1) / 10;
      
      q = [
        `An account has variable effective interest rates over a 3-year period:`,
        `Year 1: ${r1.toFixed(3)}% per month`,
        `Year 2: ${r2.toFixed(1)}% per year`,
        `Year 3: ${r3.toFixed(1)}% per year`,
        `Calculate the minimum single deposit that must be made at the start of Year 1 to achieve a savings goal of £${goal.toLocaleString()} by the end of Year 3.`
      ];
      
      bq = [
        `Target savings by end of Year 3: £${goal.toLocaleString()}.`,
        `Variable interest rates:`,
        `- Y1: ${r1.toFixed(3)}% per month`,
        `- Y2: ${r2.toFixed(1)}% per year`,
        `- Y3: ${r3.toFixed(1)}% per year`,
        `Calculate minimum initial deposit.`
      ];
      
      const m1 = Math.pow(1 + r1/100, 12);
      const m2 = 1 + r2/100;
      const m3 = 1 + r3/100;
      const combinedMult = m1 * m2 * m3;
      const minDeposit = goal / combinedMult;
      
      a = [
        `<strong>1.</strong> Multiplier Year 1 (monthly): (1 + ${r1}/100)^{12} = ${m1.toFixed(6)}`,
        `<strong>2.</strong> Multiplier Year 2 & 3: (1 + ${r2}/100) \\times (1 + ${r3}/100) = ${(m2*m3).toFixed(6)}`,
        `<strong>3.</strong> Combined 3-year multiplier: ${combinedMult.toFixed(6)}`,
        `<strong>4.</strong> Minimum Deposit = ${goal} / ${combinedMult.toFixed(6)} = £${minDeposit.toFixed(2)}`
      ];
      finalAns = `£${minDeposit.toFixed(2)}`;
    } else if (variation === 7) {
      // Calendar-date multi-deposit savings — 2023 Q7 / 2024 Q5 / 2025 Q8(c) pattern
      const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const startOptions = [0, 1, 2, 7, 8, 9]; // Jan-Mar, Aug-Oct
      const startMonthIdx = startOptions[getRandomInt(0, startOptions.length - 1)];
      const startYear = getRandomInt(2021, 2024);
      const phase1Months = getRandomInt(3, 5);
      const phase2Months = getRandomInt(4, 8);

      const dep1 = getRandStep(500, 3000, 50);
      const dep2 = getRandStep(300, 1500, 50);

      const rate1IsAnnual = Math.random() < 0.5;
      const rate1Val = rate1IsAnnual ? getRandStep(15, 45, 5) / 10 : getRandStep(10, 30, 1) / 100;
      const rate1Monthly = rate1IsAnnual ? Math.pow(1 + rate1Val / 100, 1 / 12) - 1 : rate1Val / 100;
      const rate2IsAnnual = !rate1IsAnnual;
      const rate2Val = rate2IsAnnual ? getRandStep(20, 55, 5) / 10 : getRandStep(12, 35, 1) / 100;
      const rate2Monthly = rate2IsAnnual ? Math.pow(1 + rate2Val / 100, 1 / 12) - 1 : rate2Val / 100;

      const midTotal = startMonthIdx + phase1Months;
      const midMonthIdx = midTotal % 12;
      const midYear = startYear + Math.floor(midTotal / 12);
      const endTotal = midTotal + phase2Months;
      const endMonthIdx = endTotal % 12;
      const endYear = startYear + Math.floor(endTotal / 12);

      const balAfterPhase1 = dep1 * Math.pow(1 + rate1Monthly, phase1Months);
      const combined = balAfterPhase1 + dep2;
      const finalBalance = combined * Math.pow(1 + rate2Monthly, phase2Months);

      const rate1Label = rate1IsAnnual ? `${rate1Val.toFixed(1)}% per year` : `${rate1Val.toFixed(2)}% per month`;
      const rate2Label = rate2IsAnnual ? `${rate2Val.toFixed(1)}% per year` : `${rate2Val.toFixed(2)}% per month`;
      const r1mPct = (rate1Monthly * 100).toFixed(4);
      const r2mPct = (rate2Monthly * 100).toFixed(4);

      q = [
        `${name} opens a savings account on 1 ${MONTHS[startMonthIdx]} ${startYear} with an initial deposit of £${dep1.toLocaleString()}.`,
        `The interest rate is ${rate1Label}.`,
        `On 1 ${MONTHS[midMonthIdx]} ${midYear}, ${name} deposits a further £${dep2.toLocaleString()} and the interest rate changes to ${rate2Label}.`,
        `Calculate the balance in the account on 1 ${MONTHS[endMonthIdx]} ${endYear}.`
      ];
      bq = [
        `Deposit 1: £${dep1.toLocaleString()} on 1 ${MONTHS[startMonthIdx]} ${startYear}. Rate: ${rate1Label}.`,
        `1 ${MONTHS[midMonthIdx]} ${midYear}: +£${dep2.toLocaleString()}, rate → ${rate2Label}.`,
        `Find balance on 1 ${MONTHS[endMonthIdx]} ${endYear}.`
      ];

      const aSteps: string[] = [];
      if (rate1IsAnnual) aSteps.push(`<strong>Phase 1 monthly rate:</strong> (1 + ${rate1Val}/100)^{1/12} − 1 = ${r1mPct}% per month`);
      aSteps.push(`<strong>Phase 1 (${phase1Months} months):</strong> £${dep1.toLocaleString()} × (1 + ${r1mPct}/100)^{${phase1Months}} = £${balAfterPhase1.toFixed(2)}`);
      aSteps.push(`<strong>Add second deposit:</strong> £${balAfterPhase1.toFixed(2)} + £${dep2.toLocaleString()} = £${combined.toFixed(2)}`);
      if (rate2IsAnnual) aSteps.push(`<strong>Phase 2 monthly rate:</strong> (1 + ${rate2Val}/100)^{1/12} − 1 = ${r2mPct}% per month`);
      aSteps.push(`<strong>Phase 2 (${phase2Months} months):</strong> £${combined.toFixed(2)} × (1 + ${r2mPct}/100)^{${phase2Months}} = £${finalBalance.toFixed(2)}`);
      a = aSteps;
      finalAns = `£${finalBalance.toFixed(2)}`;
    } else if (variation === 8) {
      // Lifetime ISA with government bonus — 2025 Q6 pattern
      // MI: •¹ accumulate 1 month  •² bonus = 25% of original deposit  •³ multiplier for 11 months  •⁴ final balance
      const deposit = getRandStep(1500, 4000, 500);
      const aerPercent = getRandStep(200, 500, 5) / 100; // 2.00–5.00%
      const aerStr = (1 + aerPercent / 100).toFixed(4); // e.g. "1.0325"
      const monthlyMult = Math.pow(1 + aerPercent / 100, 1 / 12);
      const govBonus = deposit * 0.25;
      const afterMonth1 = deposit * monthlyMult;
      const afterBonus = afterMonth1 + govBonus;
      const finalBalance = afterBonus * Math.pow(monthlyMult, 11);

      q = [
        `${name} opens a Lifetime ISA with an online bank. The account has an annual effective rate of interest of ${aerPercent.toFixed(2)}%.`,
        `${name} makes a deposit of £${deposit.toLocaleString()} into the account on 1 January. The government adds a 25% bonus on the deposit amount, paid into the account on the first day of the following month.`,
        `${name} makes no further deposits that year.`,
        `Calculate the accumulated value of the Lifetime ISA on 31 December.`
      ];
      bq = [
        `Lifetime ISA: £${deposit.toLocaleString()} deposited on 1 Jan. AER: ${aerPercent.toFixed(2)}%.`,
        `Government bonus: 25% of original deposit, paid on 1 Feb.`,
        `No further deposits.`,
        `Calculate value on 31 December.`
      ];
      a = [
        `<strong>•¹</strong> Accumulate deposit for 1 month (Jan): £${deposit.toLocaleString()} × ${aerStr}^{1/12} = £${afterMonth1.toFixed(2)}`,
        `<strong>•²</strong> Government bonus (25% of £${deposit.toLocaleString()}): £${govBonus.toFixed(2)}`,
        `<strong>Balance on 1 Feb:</strong> £${afterMonth1.toFixed(2)} + £${govBonus.toFixed(2)} = £${afterBonus.toFixed(2)}`,
        `<strong>•³</strong> Accumulate for remaining 11 months: £${afterBonus.toFixed(2)} × ${aerStr}^{11/12}`,
        `<strong>•⁴ Final balance: £${finalBalance.toFixed(2)}</strong>`
      ];
      finalAns = `£${finalBalance.toFixed(2)}`;
    } else if (variation === 9) {
      // Written 2-month savings schedule — 2026 Q6 pattern
      // MI: •¹ monthly rate  •² month1 interest  •³ balance after month1 deposit  •⁴ month2 interest  •⁵ balance after month2 deposit
      const savingsContexts = [
        { purpose: "holiday fund",    institution: "Caledonian Bank",   accountType: "savings account" },
        { purpose: "emergency fund",  institution: "Scotia Savings",    accountType: "instant access savings account" },
        { purpose: "house deposit",   institution: "Highland Bank",     accountType: "regular savings account" },
        { purpose: "new car fund",    institution: "Tay Savings",       accountType: "savings account" },
      ];
      const sc9 = savingsContexts[getRandomInt(0, savingsContexts.length - 1)];

      const aer9      = getRandStep(100, 350, 10) / 100;           // 1.00–3.50% AER
      const initDep   = getRandStep(500, 2500, 250);               // £500–£2500 initial deposit
      const monDep    = getRandStep(50, Math.min(initDep - 50, 250), 50); // £50–£250, always < initDep

      const m9        = Math.pow(1 + aer9 / 100, 1 / 12) - 1;
      const mPct9     = (m9 * 100).toFixed(3);                     // e.g. "0.124"
      const aerStr9   = (1 + aer9 / 100).toFixed(5);               // e.g. "1.01500"

      const int1      = initDep * m9;
      const bal1      = initDep + int1 + monDep;
      const int2      = bal1 * m9;
      const bal2      = bal1 + int2 + monDep;

      const MONTHS9   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const mIdx      = getRandomInt(0, 10);                       // Jan–Nov (month 2 must fit)
      const mon1      = MONTHS9[mIdx];
      const mon2      = MONTHS9[mIdx + 1];

      const tableHtml9 = `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Month</th>
      <th class="border border-slate-300 p-2 text-left">Opening Balance (£)</th>
      <th class="border border-slate-300 p-2 text-left">Interest Earned (£)</th>
      <th class="border border-slate-300 p-2 text-left">Deposit (£)</th>
      <th class="border border-slate-300 p-2 text-left">Closing Balance (£)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">1 (${mon1})</td>
      <td class="border border-slate-300 p-2">${initDep.toFixed(2)}</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2">${monDep.toFixed(2)}</td>
      <td class="border border-slate-300 p-2"></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">2 (${mon2})</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2">${monDep.toFixed(2)}</td>
      <td class="border border-slate-300 p-2"></td>
    </tr>
  </tbody>
</table>`;

      q = [
        `${name} opens a ${sc9.accountType} with ${sc9.institution} to save for a ${sc9.purpose}.`,
        `The account has an annual effective rate of interest of ${aer9.toFixed(2)}%. Interest is paid at the end of each month.`,
        `(a) Calculate the monthly effective rate of interest.`,
        `${name} deposits £${initDep.toLocaleString()} into the account on the first day of ${mon1}. At the end of each month, ${name} makes a further deposit of £${monDep} into the account.`,
        `(b) Complete the savings schedule to calculate the account balance immediately after ${name} makes the deposit at the end of ${mon2}.`,
        tableHtml9
      ];
      bq = [
        `${sc9.institution} ${sc9.accountType}. AER: ${aer9.toFixed(2)}%. Initial deposit: £${initDep.toLocaleString()} on 1 ${mon1}. Monthly end-of-month deposit: £${monDep}.`,
        `(a) Calculate monthly effective rate.`,
        `(b) Calculate closing balance after end-of-${mon2} deposit.`
      ];
      a = [
        `<strong>•¹ (a)</strong> Monthly rate: ${aerStr9}^{1/12} − 1 = ${mPct9}%`,
        `<strong>•² (b)</strong> Interest for ${mon1}: £${initDep.toLocaleString()} × ${mPct9}% = £${int1.toFixed(2)}`,
        `<strong>•³</strong> Balance after ${mon1} deposit: £${initDep.toFixed(2)} + £${int1.toFixed(2)} + £${monDep} = £${bal1.toFixed(2)}`,
        `<strong>•⁴</strong> Interest for ${mon2}: £${bal1.toFixed(2)} × ${mPct9}% = £${int2.toFixed(2)}`,
        `<strong>•⁵</strong> Balance after ${mon2} deposit: £${bal1.toFixed(2)} + £${int2.toFixed(2)} + £${monDep} = £${bal2.toFixed(2)}`
      ];
      finalAns = `£${bal2.toFixed(2)}`;

    } else if (variation === 10) {
      // V10: Solve for required AER given accumulated balance + target — G1 (Spec Q3b, 2022 Q4b)
      // SQA method: B0 = accBal + finalDeposit; AER = (target/B0) − 1
      // MI: •¹ compute B0 (balance after deposit)  •² AER = target/B0 − 1
      const savCtxs10 = [
        { purpose: "first home deposit", institution: "Caledonian Bank" },
        { purpose: "retirement fund",    institution: "Scotia Savings" },
        { purpose: "home renovation",    institution: "Highland Bank" },
        { purpose: "holiday fund",       institution: "Tay Savings" },
      ];
      const sc10 = savCtxs10[getRandomInt(0, savCtxs10.length - 1)];
      const MONTHS10 = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const mon10 = MONTHS10[getRandomInt(0, 11)];

      // accBal10: balance accumulated before the final deposit (result of prior saving)
      const accBal10   = getRandStep(900, 2200, 50);
      // finalDep10: deposit made at start of the target year
      const finalDep10 = getRandStep(300, 700, 100);
      const B0_10      = accBal10 + finalDep10;

      // Pick a round target above B0 (implies an AER of roughly 1.5–5%)
      const targetMultOpts = [105, 110, 115, 120, 125, 130];
      const targetMult10 = targetMultOpts[getRandomInt(0, targetMultOpts.length - 1)];
      const target10 = Math.ceil(B0_10 * targetMult10 / 100 / 50) * 50; // round up to nearest £50

      const aer10 = +((target10 / B0_10 - 1) * 100).toFixed(3);

      q = [
        `${name} has been saving for a ${sc10.purpose} with ${sc10.institution}.`,
        `After making regular deposits and earning interest, ${name} has accumulated £${accBal10.toLocaleString()} in their account.`,
        `On 1 ${mon10}, ${name} makes a further deposit of £${finalDep10.toLocaleString()} into the account and makes no further deposits that year.`,
        `Calculate the annual effective rate of interest needed for the account balance to be £${target10.toLocaleString()} by the end of the year.`
      ];
      bq = [
        `Accumulated balance: £${accBal10.toLocaleString()}. Further deposit on 1 ${mon10}: £${finalDep10.toLocaleString()}.`,
        `Target balance by end of year: £${target10.toLocaleString()}.`,
        `Calculate the annual effective rate of interest required.`
      ];
      a = [
        `<strong>•¹</strong> Balance after deposit = £${accBal10.toLocaleString()} + £${finalDep10.toLocaleString()} = £${B0_10.toLocaleString()}`,
        `<strong>•²</strong> AER = \\(\\frac{${target10.toLocaleString()}}{${B0_10.toLocaleString()}} - 1\\) = ${aer10}% ≈ <strong>${aer10}%</strong>`
      ];
      finalAns = `${aer10}%`;

    } else if (variation === 11) {
      // V11: Three deposits × three rate phases, two-part — G5+G6 (2023 Q7)
      // Part (a): accumulate D1/D2/D3 through Phases 1+2; part (b): find unknown D4 given Phase 3 target
      const MONTHS11 = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const addMo11 = (m: number, y: number, n: number): [number, number] => [(m + n) % 12, y + Math.floor((m + n) / 12)];

      const startMon11 = getRandomInt(0, 11);
      const startYr11 = getRandomInt(2021, 2024);

      // Phase 1: N1 months at AER r1 (%)
      const N1_11 = [8, 9, 10, 11][getRandomInt(0, 3)];
      const r1_11 = getRandStep(10, 25, 5) / 10; // 1.0–2.5% AER in 0.5% steps
      const r1mDec11 = Math.pow(1 + r1_11 / 100, 1 / 12) - 1; // Phase 1 monthly rate as decimal

      // D2: j1 months into Phase 1
      const j1_11 = [3, 4, 5][getRandomInt(0, 2)];

      // Phase 2: N2 months at r2 (% per month, given directly)
      const N2_11 = [4, 5, 6][getRandomInt(0, 2)];
      const r2_11 = getRandStep(8, 20, 1) / 100; // 0.08–0.20% per month as %
      const r2Dec11 = r2_11 / 100; // as decimal

      // D3: j2 months into Phase 2
      const j2_11 = [2, 3][getRandomInt(0, 1)];

      const D1_11 = getRandStep(300, 600, 50);
      const D2_11 = getRandStep(150, 350, 50);
      const D3_11 = getRandStep(100, 250, 50);

      // Each deposit's value at end of Phase 2
      const D1v11 = D1_11 * Math.pow(1 + r1mDec11, N1_11) * Math.pow(1 + r2Dec11, N2_11);
      const D2v11 = D2_11 * Math.pow(1 + r1mDec11, N1_11 - j1_11) * Math.pow(1 + r2Dec11, N2_11);
      const D3v11 = D3_11 * Math.pow(1 + r2Dec11, N2_11 - j2_11);
      const Ba_11 = D1v11 + D2v11 + D3v11;

      // Phase 3: M3 months at r3% AER
      const M3_11 = [3, 4, 5, 6][getRandomInt(0, 3)];
      const r3_11 = getRandStep(15, 35, 5) / 10; // 1.5–3.5% AER
      const ph3Factor = Math.pow(1 + r3_11 / 100, M3_11 / 12);

      // Choose target so D4 ∈ [£50, £500]
      const tMin11 = Math.ceil((Ba_11 + 50) * ph3Factor / 50) * 50;
      const tMax11 = Math.floor((Ba_11 + 500) * ph3Factor / 50) * 50;
      const tCount11 = Math.max(1, Math.floor((tMax11 - tMin11) / 50) + 1);
      const target11 = tMin11 + getRandomInt(0, Math.min(tCount11 - 1, 10)) * 50;
      const D4_11 = +(target11 / ph3Factor - Ba_11).toFixed(2);

      // Calendar dates
      const [dep2Mon11, dep2Yr11]   = addMo11(startMon11, startYr11, j1_11);
      const [ph2StartMon11, ph2StartYr11] = addMo11(startMon11, startYr11, N1_11);
      const [dep3Mon11, dep3Yr11]   = addMo11(ph2StartMon11, ph2StartYr11, j2_11);
      const [ph2EndMon11, ph2EndYr11]   = addMo11(ph2StartMon11, ph2StartYr11, N2_11);
      const [ph3EndMon11, ph3EndYr11]   = addMo11(ph2EndMon11, ph2EndYr11, M3_11);

      const r1mPct11 = (r1mDec11 * 100).toFixed(5);

      q = [
        `${name} opens a savings account on 1 ${MONTHS11[startMon11]} ${startYr11} with an initial deposit of £${D1_11.toLocaleString()}.`,
        `The account pays ${r1_11.toFixed(1)}% per year.`,
        `On 1 ${MONTHS11[dep2Mon11]} ${dep2Yr11}, ${name} deposits a further £${D2_11.toLocaleString()} into the account.`,
        `From 1 ${MONTHS11[ph2StartMon11]} ${ph2StartYr11}, the interest rate changes to ${r2_11.toFixed(2)}% per month.`,
        `On 1 ${MONTHS11[dep3Mon11]} ${dep3Yr11}, ${name} makes a further deposit of £${D3_11.toLocaleString()}.`,
        `(a) Calculate the balance in the account on 1 ${MONTHS11[ph2EndMon11]} ${ph2EndYr11}.`,
        `On 1 ${MONTHS11[ph2EndMon11]} ${ph2EndYr11}, ${name} makes a further deposit and the interest rate changes to ${r3_11.toFixed(1)}% per year.`,
        `The balance on 1 ${MONTHS11[ph3EndMon11]} ${ph3EndYr11} is £${target11.toLocaleString()}.`,
        `(b) Calculate the amount of this deposit.`
      ];
      bq = [
        `£${D1_11} on 1 ${MONTHS11[startMon11]} ${startYr11} at ${r1_11.toFixed(1)}% AER.`,
        `+£${D2_11} on 1 ${MONTHS11[dep2Mon11]} ${dep2Yr11}. Rate → ${r2_11.toFixed(2)}%/month from 1 ${MONTHS11[ph2StartMon11]} ${ph2StartYr11}.`,
        `+£${D3_11} on 1 ${MONTHS11[dep3Mon11]} ${dep3Yr11}.`,
        `(a) Balance on 1 ${MONTHS11[ph2EndMon11]} ${ph2EndYr11}? (b) Deposit on that date if balance = £${target11} on 1 ${MONTHS11[ph3EndMon11]} ${ph3EndYr11} at ${r3_11.toFixed(1)}% AER.`
      ];
      a = [
        `<strong>Part (a)</strong>`,
        `<strong>•¹</strong> Phase 1 monthly rate: (1 + ${r1_11}/100)^{1/12} − 1 = ${r1mPct11}% per month`,
        `<strong>•²</strong> Initial £${D1_11} earns ${N1_11} months Phase 1 then ${N2_11} months Phase 2:`,
        `£${D1_11} × (1 + ${r1mPct11}/100)^{${N1_11}} × (1 + ${r2_11.toFixed(2)}/100)^{${N2_11}} = £${D1v11.toFixed(2)}`,
        `<strong>•³</strong> Second deposit £${D2_11} earns ${N1_11 - j1_11} months Phase 1 then ${N2_11} months Phase 2:`,
        `£${D2_11} × (1 + ${r1mPct11}/100)^{${N1_11 - j1_11}} × (1 + ${r2_11.toFixed(2)}/100)^{${N2_11}} = £${D2v11.toFixed(2)}`,
        `<strong>•⁴</strong> Third deposit £${D3_11} earns ${N2_11 - j2_11} months Phase 2:`,
        `£${D3_11} × (1 + ${r2_11.toFixed(2)}/100)^{${N2_11 - j2_11}} = £${D3v11.toFixed(2)}`,
        `<strong>•⁵</strong> Total = £${D1v11.toFixed(2)} + £${D2v11.toFixed(2)} + £${D3v11.toFixed(2)} = <strong>£${Ba_11.toFixed(2)}</strong>`,
        `<strong>Part (b)</strong>`,
        `<strong>•⁶</strong> (£${Ba_11.toFixed(2)} + D4) × (1 + ${r3_11}/100)^{${M3_11}/12} = £${target11.toLocaleString()}`,
        `£${Ba_11.toFixed(2)} + D4 = £${target11.toLocaleString()} ÷ (1 + ${r3_11}/100)^{${M3_11}/12} = £${(target11 / ph3Factor).toFixed(2)}`,
        `<strong>•⁷</strong> D4 = £${(target11 / ph3Factor).toFixed(2)} − £${Ba_11.toFixed(2)} = <strong>£${D4_11.toFixed(2)}</strong>`
      ];
      finalAns = `(a) £${Ba_11.toFixed(2)} | (b) £${D4_11.toFixed(2)}`;

    } else if (variation === 12) {
      // V12: Regular monthly deposits across two rate phases — balance BEFORE next deposit (T6 — 2025 Q8c)
      // Timing nuance: "immediately before" means interest has accrued but the next deposit has NOT been added
      const MONTHS12 = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const addMo12 = (m: number, y: number, n: number): [number, number] => [(m + n) % 12, y + Math.floor((m + n) / 12)];

      const startMon12 = getRandomInt(0, 11);
      const startYr12 = getRandomInt(2021, 2024);
      const D0_12 = getRandStep(300, 800, 50);  // initial deposit
      const Dreg12 = getRandStep(100, 300, 50); // regular monthly deposit

      // Phase 1: N1 months at r1m% per month (monthly rate given directly)
      const N1_12 = [3, 4, 5][getRandomInt(0, 2)];
      const r1m_12 = getRandStep(18, 35, 1) / 100; // 0.18–0.35% per month as %

      // Phase 2: N2 months at r2AER% per year
      const N2_12 = [5, 6, 7, 8][getRandomInt(0, 3)];
      const r2AER12 = getRandStep(20, 45, 5) / 10; // 2.0–4.5% AER
      const r2mDec12 = Math.pow(1 + r2AER12 / 100, 1 / 12) - 1;

      // Build balance month by month
      // Convention: deposit at START of month, interest at END of month
      let bal12 = D0_12 * (1 + r1m_12 / 100); // month 0 (Phase 1)
      for (let m = 1; m < N1_12; m++) {
        bal12 = (bal12 + Dreg12) * (1 + r1m_12 / 100);
      }
      const balAfterPh1 = bal12;
      for (let m = 0; m < N2_12; m++) {
        bal12 = (bal12 + Dreg12) * (1 + r2mDec12);
      }
      const finalBal12 = bal12; // balance BEFORE the (N1+N2)th deposit

      const [firstRegMon12, firstRegYr12] = addMo12(startMon12, startYr12, 1);
      const [ph2StartMon12, ph2StartYr12] = addMo12(startMon12, startYr12, N1_12);
      const [nextDepMon12, nextDepYr12]   = addMo12(startMon12, startYr12, N1_12 + N2_12);

      const r2mPct12 = (r2mDec12 * 100).toFixed(5);

      q = [
        `${name} opens a savings account on 1 ${MONTHS12[startMon12]} ${startYr12} with an initial deposit of £${D0_12.toLocaleString()}.`,
        `The interest rate is ${r1m_12.toFixed(2)}% per month.`,
        `${name} makes regular monthly payments of £${Dreg12.toLocaleString()} into the account on the first of each month from 1 ${MONTHS12[firstRegMon12]} ${firstRegYr12}.`,
        `From 1 ${MONTHS12[ph2StartMon12]} ${ph2StartYr12}, the interest rate changes to ${r2AER12.toFixed(1)}% per year.`,
        `Calculate the balance in the account immediately before ${name} makes a payment on 1 ${MONTHS12[nextDepMon12]} ${nextDepYr12}.`
      ];
      bq = [
        `£${D0_12} on 1 ${MONTHS12[startMon12]} ${startYr12}. Monthly: £${Dreg12} from 1 ${MONTHS12[firstRegMon12]} ${firstRegYr12}.`,
        `Phase 1: ${r1m_12.toFixed(2)}%/month (${N1_12} months). Phase 2: ${r2AER12.toFixed(1)}% AER from 1 ${MONTHS12[ph2StartMon12]} ${ph2StartYr12} (${N2_12} months).`,
        `Balance immediately before deposit on 1 ${MONTHS12[nextDepMon12]} ${nextDepYr12}.`
      ];
      a = [
        `<strong>•¹</strong> Phase 2 monthly rate: (1 + ${r2AER12.toFixed(1)}/100)^{1/12} − 1 = ${r2mPct12}% per month`,
        `<strong>•²</strong> Balance at end of Phase 1 (${N1_12} months, rate ${r1m_12.toFixed(2)}%/month):`,
        `<em>Month by month: (prev balance + £${Dreg12}) × (1 + ${r1m_12.toFixed(2)}/100)</em>`,
        `Phase 1 balance = <strong>£${balAfterPh1.toFixed(2)}</strong>`,
        `<strong>•³</strong> Continue for ${N2_12} months at ${r2mPct12}%/month (each month: add £${Dreg12}, multiply by 1 + ${r2mPct12}/100):`,
        `<strong>•⁴</strong> Balance immediately before 1 ${MONTHS12[nextDepMon12]} ${nextDepYr12} deposit = <strong>£${finalBal12.toFixed(2)}</strong>`,
        `<em>Note: do NOT add the £${Dreg12} deposit on 1 ${MONTHS12[nextDepMon12]} ${nextDepYr12} — the question asks for the balance immediately <strong>before</strong> that payment.</em>`
      ];
      finalAns = `£${finalBal12.toFixed(2)}`;
    }
  } else if (selectedTopic === "Loans, Mortgages & Credit Cards" || selectedTopic === "Loans & Mortgages (Software)") {
    const isSoftware = selectedTopic === "Loans & Mortgages (Software)";
    const variation = isSoftware ? [1, 4, 15, 16, 17, 18][getRandomInt(0, 5)] : [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14][getRandomInt(0, 11)];
    
    if (variation === 1) {
      const loanAmount = getRandStep(3000, 15000, 250);
      const aer = getRandStep(60, 180, 5) / 10;
      const loanPeriod = getRandStep(24, 60, 12);
      const monthlyRateDec = Math.pow(1 + aer/100, 1/12) - 1;
      const repayment = Math.ceil(loanAmount * monthlyRateDec / (1 - Math.pow(1 + monthlyRateDec, -loanPeriod)) / 5) * 5;

      const monRateStr = (monthlyRateDec * 100).toFixed(6);

      const perc = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });

      // SQA-exact layout: col A blank margin, data starts in col B
      const rawData: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", "Loan Repayment Schedule"],
        [],
        ["", "Initial loan amount", curr(loanAmount)],
        ["", "Annual effective interest rate", perc(aer / 100, 1)],
        ["", "Monthly effective interest rate", perc("", 6)],
        ["", "Loan Period (months)", loanPeriod],
        ["", "Monthly Repayment", curr(repayment)],
        ["", "Final Repayment", curr("")],
        [],
        ["", "Time (months)", "Repayment (£)", "Interest content of repayment (£)", "Capital content of repayment (£)", "Loan outstanding (£)"],
        ["", 0, curr(""), curr(""), curr(""), curr(loanAmount)],
      ];
      for (let m = 1; m <= loanPeriod; m++) {
        rawData.push(["", m, curr(""), curr(""), curr(""), curr("")]);
      }
      
      // Final repayment: outstanding at month (n-1) × (1 + monthlyRate)
      const outstandingBeforeFinal = loanAmount * Math.pow(1 + monthlyRateDec, loanPeriod - 1)
        - repayment * (Math.pow(1 + monthlyRateDec, loanPeriod - 1) - 1) / monthlyRateDec;
      const finalRepayment = outstandingBeforeFinal * (1 + monthlyRateDec);

      q = [
        `${name} takes out a loan of £${loanAmount.toLocaleString()} to be paid back with level monthly repayments over ${loanPeriod} months.`,
        `The annual effective rate of interest is ${aer.toFixed(1)}%. The level monthly repayment is £${repayment.toFixed(2)}.`,
        `<strong>You must refer to the spreadsheet file provided when answering this question.</strong>`,
        `(a) Complete the monthly effective interest rate formula in the spreadsheet.`,
        `(b) Complete the loan repayment schedule and state the final repayment amount.`
      ];
      bq = [
        `Loan: £${loanAmount.toLocaleString()}  AER: ${aer.toFixed(1)}%  Monthly repayment: £${repayment.toFixed(2)}  Term: ${loanPeriod} months`,
        `(a) Enter the monthly effective rate formula.`,
        `(b) Complete the schedule. State the final repayment.`
      ];

      a = [
        `<strong>(a)</strong> Monthly Effective Rate \\(= (1 + ${aer.toFixed(1)}/100)^{1/12} - 1 = ${monRateStr}\\%\\)`,
        `<strong>(b) Formulae (example using row 16 = month 1):</strong>`,
        `Interest content: \\(= F15 \\times C9\\) (previous outstanding \\(\\times\\) monthly rate)`,
        `Capital content: \\(= C11 - D16\\) (repayment \\(-\\) interest)`,
        `Loan outstanding: \\(= F15 - E16\\) (previous outstanding \\(-\\) capital)`,
        `<strong>Final repayment: £${finalRepayment.toFixed(2)}</strong>`
      ];
      finalAns = `Final repayment: £${finalRepayment.toFixed(2)}`;
      attachments = [{ filename: "Finance_Repayment_Schedule.xlsx", content: "", rawData }];
    } else if (variation === 2) {
      const houseValue = getRandStep(180000, 320000, 10000);
      const deposit = getRandStep(25000, 60000, 5000);
      const income = getRandStep(3500, 6500, 100);
      const mortgagePay = getRandStep(800, 1400, 50);
      const otherDebt = getRandStep(150, 500, 10);
      
      q = [
        `A couple applies for a mortgage on a house valued at £${houseValue.toLocaleString()}. They have a deposit of £${deposit.toLocaleString()}.`,
        `(a) Calculate their Loan-to-Value (LTV) ratio.`,
        `(b) Their combined taxable monthly income is £${income}. The proposed monthly mortgage payment is £${mortgagePay}, and their other debt payments total £${otherDebt}. By calculating their total debt limit, determine if they satisfy the 36% rule for affordability.`
      ];
      bq = [
        `House Value: £${houseValue.toLocaleString()}   Deposit: £${deposit.toLocaleString()}`,
        `(a) Calculate their Loan-to-Value (LTV) ratio.`,
        `Monthly income: £${income}. Mortgage: £${mortgagePay}. Other debt: £${otherDebt}.`,
        `(b) Determine if they satisfy the 36% rule for affordability.`
      ];
      
      const loan = houseValue - deposit;
      const ltvPercent = (loan / houseValue) * 100;
      
      const totalDebt = mortgagePay + otherDebt;
      const debtLimit = income * 0.36;
      const satisfies = totalDebt <= debtLimit;
      
      a = [
        `<strong>Part (a):</strong>`,
        `<strong>1.</strong> Loan Amount = ${houseValue} - ${deposit} = £${loan}`,
        `<strong>2.</strong> LTV Ratio = (${loan} / ${houseValue}) \\times 100 = ${ltvPercent.toFixed(1)}\\%`,
        `<strong>Part (b):</strong>`,
        `<strong>3.</strong> Total Monthly Debt = ${mortgagePay} + ${otherDebt} = £${totalDebt}`,
        `<strong>4.</strong> 36\\% Affordability Limit = ${income} \\times 0.36 = £${debtLimit.toFixed(2)}`,
        `<strong>5.</strong> Conclusion: Since £${totalDebt} is ${satisfies ? 'less than or equal to' : 'greater than'} £${debtLimit.toFixed(2)}, they ${satisfies ? 'satisfy' : 'do not satisfy'} the 36\\% rule.`
      ];
      finalAns = `(a) ${ltvPercent.toFixed(1)}\\% (b) ${satisfies ? 'Satisfies' : 'Does not satisfy'}`;
    } else if (variation === 3) {
      const purchaseAmount = getRandStep(600, 2500, 100);
      q = [
        `${name} needs to purchase £${purchaseAmount.toLocaleString()} of new equipment.`,
        `They decide to pay for this using a credit card rather than taking out a personal bank loan.`,
        `State one financial risk to ${name} of using a credit card to fund this purchase.`
      ];
      a = [
        `Acceptable reasons include:`,
        `"Credit cards typically have a much higher effective interest rate (APR) than a personal bank loan."`,
        `OR "If ${name} only makes the minimum monthly repayment, the debt will take years to clear and cost significantly more in interest."`
      ];
      finalAns = `Acceptable theory reason`;
    } else if (variation === 4) {
      // Goal Seek xlsx variation — matches SQA 2023 Q11 / 2024 Q9 pattern
      const loanAmount = getRandStep(3000, 15000, 500);
      const aerPercent = getRandStep(40, 120, 5) / 10;
      const years = getRandStep(2, 5, 1);
      const loanPeriod = years * 12;
      const monthlyRateDec = Math.pow(1 + aerPercent / 100, 1 / 12) - 1;
      const repayment = Math.round(loanAmount * monthlyRateDec / (1 - Math.pow(1 + monthlyRateDec, -loanPeriod)) * 100) / 100;
      // Row 15 = month 0; last data row = 15 + loanPeriod
      const lastDataRow = 15 + loanPeriod;

      const perc = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });

      const rawData: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", "Loan Repayment Schedule"],
        [],
        ["", "Initial loan amount", curr(loanAmount)],
        ["", "Annual effective interest rate", perc(aerPercent / 100, 1)],
        ["", "Monthly effective interest rate", perc("", 6)],
        ["", "Loan Period (years)", years],
        ["", "Monthly Repayment", curr("")],
        ["", "Final Repayment", curr("")],
        [],
        ["", "Time (months)", "Repayment (£)", "Interest content of repayment (£)", "Capital content of repayment (£)", "Loan outstanding (£)"],
        ["", 0, curr(""), curr(""), curr(""), curr(loanAmount)],
      ];
      for (let m = 1; m <= loanPeriod; m++) {
        rawData.push(["", m, curr(""), curr(""), curr(""), curr("")]);
      }

      q = [
        `${name} takes out a loan of £${loanAmount.toLocaleString()} with a term of ${years} years.`,
        `Level monthly repayments are made at the end of each month. The annual effective rate of interest is ${aerPercent.toFixed(1)}%.`,
        `<strong>You must refer to the spreadsheet file provided when answering this question.</strong>`,
        `(a) Complete the monthly effective interest rate formula and the loan repayment schedule formulae in the spreadsheet.`,
        `(b) Use the Goal Seek tool to determine the level monthly repayment amount.`,
        `State the Set Cell, To Value, and By Changing Cell inputs you would enter.`
      ];
      bq = [
        `Loan: £${loanAmount.toLocaleString()}  AER: ${aerPercent.toFixed(1)}%  Term: ${years} years`,
        `(a) Complete formulae in the spreadsheet.`,
        `(b) Use Goal Seek to find the monthly repayment. State: Set Cell, To Value, By Changing Cell.`
      ];

      a = [
        `<strong>(b) Goal Seek:</strong>`,
        `<strong>Set Cell:</strong> F${lastDataRow} (Loan outstanding at month ${loanPeriod})`,
        `<strong>To Value:</strong> 0`,
        `<strong>By Changing Cell:</strong> C11 (Monthly Repayment)`,
        `<strong>Monthly repayment (answer):</strong> £${repayment.toFixed(2)}`
      ];
      finalAns = `£${repayment.toFixed(2)}`;
      attachments = [{ filename: "Loan_Repayment_Schedule.xlsx", content: "", rawData }];
    } else if (variation === 5) {
      const aer = getRandStep(199, 399, 10) / 10;
      const initialBal = getRandStep(600, 1500, 10) + getRandStep(0, 99, 1) / 100;
      const pctPayment = getRandomInt(3, 5);
      
      q = [
        `${name} has a credit card with an annual effective rate of interest of ${aer.toFixed(1)}%. Interest is applied at the end of each month.`,
        `Payments must be made on the first day of each month. The minimum payment must be either ${pctPayment}% of the balance outstanding at that time or £5, whichever is higher.`,
        `After ${name} makes their payment on 1 March, the balance of their credit card is £${initialBal.toFixed(2)}.`,
        `${name} does not use their credit card during March.`,
        `(a) Calculate the balance of their credit card on 1 April after ${name} has made the minimum payment.`
      ];
      
      bq = [
        `Credit card AER: ${aer.toFixed(1)}%.`,
        `Min payment (first day): ${pctPayment}% of balance or £5.`,
        `1 March balance (post-payment): £${initialBal.toFixed(2)}. No usage in March.`,
        `(a) Calculate balance on 1 April after minimum payment.`
      ];
      
      const monDecimal = Math.pow(1 + aer / 100, 1/12) - 1;
      const interestMarch = initialBal * monDecimal;
      const preAprilBal = initialBal + interestMarch;
      const minPayPercent = preAprilBal * (pctPayment / 100);
      const minPay = minPayPercent > 5 ? minPayPercent : 5;
      const postAprilBal = preAprilBal - minPay;
      
      a = [
        `<strong>1.</strong> Monthly rate (decimal): (1 + ${aer}/100)^{1/12} - 1 = ${monDecimal.toFixed(6)}`,
        `<strong>2.</strong> Interest added in March: ${initialBal.toFixed(2)} \\times ${monDecimal.toFixed(6)} = £${interestMarch.toFixed(2)}`,
        `<strong>3.</strong> Balance before 1 April payment: ${initialBal.toFixed(2)} + ${interestMarch.toFixed(2)} = £${preAprilBal.toFixed(2)}`,
        `<strong>4.</strong> Minimum payment check: ${pctPayment}% of ${preAprilBal.toFixed(2)} = £${minPayPercent.toFixed(2)}. So they pay £${minPay.toFixed(2)}.`,
        `<strong>5.</strong> Balance on 1 April (after payment): ${preAprilBal.toFixed(2)} - ${minPay.toFixed(2)} = £${postAprilBal.toFixed(2)}`
      ];
      finalAns = `£${postAprilBal.toFixed(2)}`;
    } else if (variation === 6) {
      // Paper-based loan schedule — by hand, HTML table, months 0–2 (SQA 2024 Q1 / 2022 Q1 pattern)
      const loanAmount = getRandStep(2000, 12000, 250);
      const aerPercent = getRandStep(50, 350, 5) / 10;  // 5.0–35.0%
      const loanPeriod = getRandStep(24, 60, 12);
      const monthlyRateDec = Math.pow(1 + aerPercent / 100, 1 / 12) - 1;
      const repayment = Math.round(loanAmount * monthlyRateDec / (1 - Math.pow(1 + monthlyRateDec, -loanPeriod)) * 100) / 100;
      const monRateStr = (monthlyRateDec * 100).toFixed(3);

      const m1Int = loanAmount * monthlyRateDec;
      const m1Cap = repayment - m1Int;
      const m1Out = loanAmount - m1Cap;
      const m2Int = m1Out * monthlyRateDec;
      const m2Cap = repayment - m2Int;
      const m2Out = m1Out - m2Cap;

      const tableHtml = `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Time<br>(months)</th>
      <th class="border border-slate-300 p-2 text-left">Repayment<br>(£)</th>
      <th class="border border-slate-300 p-2 text-left">Interest content of repayment (£)</th>
      <th class="border border-slate-300 p-2 text-left">Capital content of repayment (£)</th>
      <th class="border border-slate-300 p-2 text-left">Loan outstanding (£)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">0</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2">${loanAmount.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">1</td>
      <td class="border border-slate-300 p-2">${repayment.toFixed(2)}</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">2</td>
      <td class="border border-slate-300 p-2">${repayment.toFixed(2)}</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
    </tr>
  </tbody>
</table>`;

      q = [
        `${name} takes out a loan of £${loanAmount.toLocaleString()} with an annual effective rate of interest of ${aerPercent.toFixed(1)}%.`,
        `(a) Calculate the monthly effective rate of interest.`,
        `${name} makes level monthly repayments of £${repayment.toFixed(2)} at the end of each month.`,
        `(b) Complete the following loan schedule to show the loan outstanding at the end of month 2.`,
        tableHtml
      ];
      bq = [
        `Loan: £${loanAmount.toLocaleString()}  AER: ${aerPercent.toFixed(1)}%  Monthly repayment: £${repayment.toFixed(2)}`,
        `(a) Calculate monthly effective rate.`,
        `(b) Complete loan schedule to end of month 2.`
      ];

      a = [
        `<strong>(a)</strong> Monthly rate \\(= (1 + ${aerPercent}/100)^{1/12} - 1 = ${monRateStr}\\%\\)`,
        `<strong>(b)</strong>`,
        `Month 1: Interest = £${m1Int.toFixed(2)}, Capital = £${m1Cap.toFixed(2)}, Loan outstanding = £${m1Out.toFixed(2)}`,
        `Month 2: Interest = £${m2Int.toFixed(2)}, Capital = £${m2Cap.toFixed(2)}, Loan outstanding = £${m2Out.toFixed(2)}`
      ];
      finalAns = `M1 outstanding: £${m1Out.toFixed(2)}, M2 outstanding: £${m2Out.toFixed(2)}`;
    } else if (variation === 7) {
      // Total interest paid on a loan
      const loanAmt = getRandStep(3000, 15000, 500);
      const aer7 = getRandStep(60, 200, 5) / 10;
      const years7 = getRandStep(2, 5, 1);
      const months7 = years7 * 12;
      const r7 = Math.pow(1 + aer7 / 100, 1 / 12) - 1;
      const repayment7 = Math.round(loanAmt * r7 / (1 - Math.pow(1 + r7, -months7)) * 100) / 100;
      const totalPaid = repayment7 * months7;
      const totalInterest = totalPaid - loanAmt;
      const monRateStr7 = (r7 * 100).toFixed(4);

      q = [
        `${name} takes out a loan of £${loanAmt.toLocaleString()} at an annual effective rate of interest of ${aer7.toFixed(1)}%.`,
        `The loan is to be repaid with level monthly repayments over ${years7} years (${months7} months).`,
        `(a) Calculate the monthly effective rate of interest.`,
        `(b) Calculate the level monthly repayment.`,
        `(c) Calculate the total interest paid over the lifetime of the loan.`
      ];
      bq = [
        `Loan: £${loanAmt.toLocaleString()}  AER: ${aer7.toFixed(1)}%  Term: ${years7} years (${months7} months).`,
        `(a) Monthly effective rate.`,
        `(b) Level monthly repayment.`,
        `(c) Total interest paid.`
      ];
      a = [
        `<strong>(a)</strong> Monthly rate = (1 + ${aer7}/100)^{1/12} − 1 = ${monRateStr7}%`,
        `<strong>(b)</strong> Repayment = (${loanAmt} × ${monRateStr7}/100) / (1 − (1 + ${monRateStr7}/100)^{−${months7}}) = £${repayment7.toFixed(2)}`,
        `<strong>(c)</strong> Total paid = £${repayment7.toFixed(2)} × ${months7} = £${totalPaid.toFixed(2)}`,
        `Total interest = £${totalPaid.toFixed(2)} − £${loanAmt.toLocaleString()} = £${totalInterest.toFixed(2)}`
      ];
      finalAns = `£${totalInterest.toFixed(2)}`;
    } else if (variation === 8) {
      // Compare two loan options — 2023 Q11 pattern
      const principal = getRandStep(3000, 12000, 500);
      const aer8a = getRandStep(60, 150, 5) / 10;
      const years8a = getRandStep(2, 3, 1);
      const aer8b = getRandStep(160, 280, 5) / 10;
      const years8b = getRandStep(4, 5, 1);
      const months8a = years8a * 12;
      const months8b = years8b * 12;
      const r8a = Math.pow(1 + aer8a / 100, 1 / 12) - 1;
      const r8b = Math.pow(1 + aer8b / 100, 1 / 12) - 1;
      const rep8a = Math.round(principal * r8a / (1 - Math.pow(1 + r8a, -months8a)) * 100) / 100;
      const rep8b = Math.round(principal * r8b / (1 - Math.pow(1 + r8b, -months8b)) * 100) / 100;
      const total8a = rep8a * months8a;
      const total8b = rep8b * months8b;
      const cheaperOption = total8a <= total8b ? "Option A" : "Option B";
      const cheaperTotal = Math.min(total8a, total8b);
      const dearer = cheaperOption === "Option A" ? "Option B" : "Option A";
      const dearerTotal = Math.max(total8a, total8b);

      const lenders = [["Caledonian Bank", "Tay Finance"], ["Scotia Credit", "Forth Loans"], ["Highland Bank", "Lomond Finance"]];
      const lenderPair = lenders[getRandomInt(0, lenders.length - 1)];

      q = [
        `${name} needs to borrow £${principal.toLocaleString()}. Two options are available:`,
        `<strong>${lenderPair[0]}:</strong> Annual effective rate of ${aer8a.toFixed(1)}%, repaid over ${years8a} years.`,
        `<strong>${lenderPair[1]}:</strong> Annual effective rate of ${aer8b.toFixed(1)}%, repaid over ${years8b} years.`,
        `By calculating the total amount repaid under each option, determine which option costs less overall.`
      ];
      bq = [
        `Borrow: £${principal.toLocaleString()}.`,
        `${lenderPair[0]}: AER ${aer8a.toFixed(1)}%, ${years8a} years.`,
        `${lenderPair[1]}: AER ${aer8b.toFixed(1)}%, ${years8b} years.`,
        `Calculate total repaid under each option. State which costs less.`
      ];
      a = [
        `<strong>${lenderPair[0]} monthly rate:</strong> (1 + ${aer8a}/100)^{1/12} − 1 = ${(r8a*100).toFixed(4)}%`,
        `<strong>${lenderPair[0]} monthly repayment:</strong> £${rep8a.toFixed(2)}. Total = £${rep8a.toFixed(2)} × ${months8a} = £${total8a.toFixed(2)}`,
        `<strong>${lenderPair[1]} monthly rate:</strong> (1 + ${aer8b}/100)^{1/12} − 1 = ${(r8b*100).toFixed(4)}%`,
        `<strong>${lenderPair[1]} monthly repayment:</strong> £${rep8b.toFixed(2)}. Total = £${rep8b.toFixed(2)} × ${months8b} = £${total8b.toFixed(2)}`,
        `<strong>${cheaperOption} (£${cheaperTotal.toFixed(2)}) is cheaper overall</strong> by £${(dearerTotal - cheaperTotal).toFixed(2)} compared to ${dearer} (£${dearerTotal.toFixed(2)}).`
      ];
      finalAns = `${cheaperOption} — £${cheaperTotal.toFixed(2)} total`;
    } else if (variation === 9) {
      // Loan accumulating without repayments across 3 rate phases — 2026 Q1 pattern
      // MI: •¹ phase-1 multiplier  •² phase-2 multiplier  •³ phase-3 multiplier  •⁴ final balance
      const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const loanAmount = getRandStep(2000, 6000, 500);
      const startMonthIdx = getRandomInt(0, 7); // Jan–Aug, ensures end date stays in same or next year cleanly
      const startYear = getRandomInt(2022, 2025);
      const ph1 = getRandomInt(2, 4);
      const ph2 = getRandomInt(3, 5);
      const ph3 = 12 - ph1 - ph2; // 3–7 months
      const rate1Ann = getRandStep(50, 90, 5) / 10;  // 5.0–9.0% p.a.
      const rate2Ann = getRandStep(65, 120, 5) / 10; // 6.5–12.0% p.a.
      const rate3Mon = getRandStep(40, 85, 5) / 100; // 0.40–0.85% p.m.

      const mult1 = Math.pow(1 + rate1Ann / 100, ph1 / 12);
      const mult2 = Math.pow(1 + rate2Ann / 100, ph2 / 12);
      const mult3 = Math.pow(1 + rate3Mon / 100, ph3);
      const bal1 = loanAmount * mult1;
      const bal2 = bal1 * mult2;
      const finalBalance = bal2 * mult3;

      const ph1EndTotal = startMonthIdx + ph1;
      const ph1EndMon = ph1EndTotal % 12;
      const ph1EndYear = startYear + Math.floor(ph1EndTotal / 12);
      const ph2EndTotal = startMonthIdx + ph1 + ph2;
      const ph2EndMon = ph2EndTotal % 12;
      const ph2EndYear = startYear + Math.floor(ph2EndTotal / 12);
      const endTotal = startMonthIdx + 12;
      const endMon = endTotal % 12;
      const endYear = startYear + Math.floor(endTotal / 12);

      q = [
        `${name} borrowed £${loanAmount.toLocaleString()} on 1 ${MONTHS[startMonthIdx]} ${startYear}. Repayments do not begin until 1 ${MONTHS[endMon]} ${endYear}.`,
        `The annual effective interest rate is ${rate1Ann.toFixed(1)}% from 1 ${MONTHS[startMonthIdx]} ${startYear} to 1 ${MONTHS[ph1EndMon]} ${ph1EndYear}.`,
        `From 1 ${MONTHS[ph1EndMon]} ${ph1EndYear}, the annual effective rate changes to ${rate2Ann.toFixed(1)}%.`,
        `From 1 ${MONTHS[ph2EndMon]} ${ph2EndYear}, the monthly effective interest rate is ${rate3Mon.toFixed(2)}%.`,
        `Calculate the accumulated balance on 1 ${MONTHS[endMon]} ${endYear}, immediately before repayments begin.`
      ];
      bq = [
        `Loan: £${loanAmount.toLocaleString()} on 1 ${MONTHS[startMonthIdx]} ${startYear}. No repayments until 1 ${MONTHS[endMon]} ${endYear}.`,
        `Rate 1: ${rate1Ann.toFixed(1)}% p.a. for ${ph1} months`,
        `Rate 2: ${rate2Ann.toFixed(1)}% p.a. for ${ph2} months`,
        `Rate 3: ${rate3Mon.toFixed(2)}% p.m. for ${ph3} months`,
        `Calculate accumulated balance on 1 ${MONTHS[endMon]} ${endYear}.`
      ];
      a = [
        `<strong>•¹ Phase 1</strong> (${ph1} months at ${rate1Ann.toFixed(1)}% p.a.): £${loanAmount.toLocaleString()} × (1 + ${rate1Ann.toFixed(1)}/100)^{${ph1}/12} = £${bal1.toFixed(2)}`,
        `<strong>•² Phase 2</strong> (${ph2} months at ${rate2Ann.toFixed(1)}% p.a.): £${bal1.toFixed(2)} × (1 + ${rate2Ann.toFixed(1)}/100)^{${ph2}/12} = £${bal2.toFixed(2)}`,
        `<strong>•³ Phase 3</strong> (${ph3} months at ${rate3Mon.toFixed(2)}% p.m.): £${bal2.toFixed(2)} × (1 + ${rate3Mon.toFixed(2)}/100)^{${ph3}} = £${finalBalance.toFixed(2)}`,
        `<strong>•⁴ Accumulated balance: £${finalBalance.toFixed(2)}</strong>`
      ];
      finalAns = `£${finalBalance.toFixed(2)}`;
    } else if (variation === 10) {
      // Written: reason bank might reject loan application — 2023 Q11(b) pattern
      const loanPurpose10 = ["buy a car", "fund home improvements", "consolidate existing debts", "purchase equipment for a business"][getRandomInt(0, 3)];
      const amount10 = getRandStep(5000, 20000, 1000);

      q = [
        `${name} applies to their bank for a loan of £${amount10.toLocaleString()} to ${loanPurpose10}.`,
        `The bank rejects the application.`,
        `State one reason why the bank might have rejected ${name}'s loan application.`
      ];
      bq = [
        `${name} applies for a £${amount10.toLocaleString()} loan to ${loanPurpose10}. The bank rejects it.`,
        `State one reason why the bank might have rejected the application.`
      ];
      a = [
        `<strong>•¹</strong> Valid reason, e.g. "${name} has a poor credit rating" OR "${name}'s income is insufficient to meet the repayments" OR "The loan amount is too high relative to ${name}'s income."`
      ];
      finalAns = `Poor credit rating / insufficient income / affordability`;
    } else if (variation === 11) {
      // Written: two reasons to prefer bank loan over dealership finance — 2022 Q9(c) pattern
      const vehicle11 = ["car", "van", "motorbike"][getRandomInt(0, 2)];
      const price11 = getRandStep(8000, 25000, 500);
      const bankAer11 = getRandStep(55, 95, 5) / 10;
      const dealerAer11 = getRandStep(105, 165, 5) / 10;
      const balloon11 = getRandStep(2000, 5000, 500);
      const term11 = [36, 48, 60][getRandomInt(0, 2)];

      q = [
        `${name} wants to buy a ${vehicle11} costing £${price11.toLocaleString()}.`,
        `They are comparing two financing options:`,
        `Option A (Bank Loan): Annual effective rate ${bankAer11.toFixed(1)}%. Repaid in full over ${term11} equal monthly repayments. ${name} owns the ${vehicle11} outright at the end.`,
        `Option B (Dealership Finance): Annual effective rate ${dealerAer11.toFixed(1)}%. Monthly repayments are lower, but a balloon payment of £${balloon11.toLocaleString()} is required at the end of the ${term11}-month term if ${name} wishes to keep the ${vehicle11}.`,
        `State two reasons why ${name} might prefer Option A (the bank loan).`
      ];
      bq = [
        `${vehicle11} costs £${price11.toLocaleString()}.`,
        `Option A (Bank): ${bankAer11.toFixed(1)}% AER, ${term11} equal payments, own outright.`,
        `Option B (Finance): ${dealerAer11.toFixed(1)}% AER, lower payments but £${balloon11.toLocaleString()} balloon.`,
        `State TWO reasons to prefer Option A.`
      ];
      a = [
        `<strong>•¹</strong> The annual effective interest rate on Option A (${bankAer11.toFixed(1)}%) is lower than Option B (${dealerAer11.toFixed(1)}%), so less interest is paid overall.`,
        `<strong>•²</strong> Option A means ${name} owns the ${vehicle11} outright after ${term11} months without needing to find a lump sum of £${balloon11.toLocaleString()}.`
      ];
      finalAns = `Lower AER; no balloon payment required`;
    } else if (variation === 12) {
      // Written: reason to pay credit card balance in full — 2025 Q11(b) pattern
      const balance12 = getRandStep(200, 800, 50);
      const minPay12 = getRandStep(25, 50, 5);
      const aerCC12 = getRandStep(200, 340, 10) / 10;

      q = [
        `${name} has a credit card with an annual effective interest rate of ${aerCC12.toFixed(1)}%.`,
        `${name}'s credit card balance at the end of this month is £${balance12.toLocaleString()}.`,
        `The minimum monthly payment required is £${minPay12}.`,
        `Give one reason why ${name} should consider paying the full credit card balance each month rather than just the minimum payment.`
      ];
      bq = [
        `${name}'s credit card: balance £${balance12.toLocaleString()}, AER ${aerCC12.toFixed(1)}%, minimum payment £${minPay12}.`,
        `Give one reason to pay the FULL balance rather than just the minimum.`
      ];
      a = [
        `<strong>•¹</strong> Valid reason, e.g. "Paying only the minimum means interest continues to accrue on the remaining balance, increasing the total debt" OR "Paying in full avoids all interest charges" OR "Only paying the minimum takes much longer to repay the full debt."`
      ];
      finalAns = `Avoids interest charges / debt grows more slowly if paid in full`;
    } else if (variation === 13) {
      // Written: lump sum — pay off loan vs deposit in savings — Spec Q10(d) pattern
      const lumpSum13 = getRandStep(1000, 5000, 500);
      const loanAer13 = getRandStep(65, 120, 5) / 10;
      const savingsAer13 = getRandStep(30, 60, 5) / 10;

      q = [
        `${name} has an outstanding loan with an annual effective interest rate of ${loanAer13.toFixed(1)}% and a savings account with an annual effective interest rate of ${savingsAer13.toFixed(1)}%.`,
        `${name} receives an unexpected gift of £${lumpSum13.toLocaleString()} and is deciding whether to reduce their outstanding loan balance or deposit it into their savings account.`,
        `State one reason why ${name} might choose to deposit the money into their savings account rather than use it to reduce the loan balance.`
      ];
      bq = [
        `Loan AER: ${loanAer13.toFixed(1)}%. Savings AER: ${savingsAer13.toFixed(1)}%.`,
        `${name} has £${lumpSum13.toLocaleString()} — save it or pay off loan?`,
        `State one reason to deposit in savings rather than pay off the loan.`
      ];
      a = [
        `<strong>•¹</strong> Valid reason, e.g. "The savings account can be kept as an emergency fund for unexpected expenses" OR "There may be an early repayment penalty on the loan" OR "The savings account allows easy access to the money if needed."`
      ];
      finalAns = `Emergency fund / early repayment penalty / liquidity`;

    } else if (variation === 14) {
      // V14: 28% affordability rule — G7 (2026 Q8c)
      // KEY: SQA uses TAXABLE income (gross − pension contribution, BEFORE income tax)
      // MI: •¹ monthly taxable income  •² 28% of monthly taxable income  •³ compare to repayment
      const jobs14 = [
        { job: "teacher", gross: getRandStep(32000, 46000, 1000) },
        { job: "nurse", gross: getRandStep(28000, 42000, 1000) },
        { job: "software developer", gross: getRandStep(38000, 58000, 1000) },
        { job: "electrician", gross: getRandStep(30000, 48000, 1000) },
        { job: "shop manager", gross: getRandStep(26000, 38000, 1000) },
      ];
      const jc14 = jobs14[getRandomInt(0, jobs14.length - 1)];
      const grossAnnual14 = jc14.gross;
      const pensionPct14  = getRandomInt(3, 8);  // 3–8% pension contribution
      const pensionAmt14  = Math.round(grossAnnual14 * pensionPct14 / 100);
      const taxableAnnual14 = grossAnnual14 - pensionAmt14;
      const taxableMonthly14 = +(taxableAnnual14 / 12).toFixed(2);
      const threshold14 = +(taxableMonthly14 * 0.28).toFixed(2);

      // Pick repayment to be sometimes above, sometimes below threshold (50/50)
      const isAffordable14 = getRandomInt(0, 1) === 1;
      const repayment14 = isAffordable14
        ? Math.floor(threshold14 * getRandStep(70, 92, 2) / 100 / 5) * 5
        : Math.ceil(threshold14 * getRandStep(108, 130, 2) / 100 / 5) * 5;

      q = [
        `${name} works as a ${jc14.job} and earns a gross annual salary of £${grossAnnual14.toLocaleString()}.`,
        `${name} contributes ${pensionPct14}% of their gross salary to a pension scheme.`,
        `${name} is considering a mortgage with monthly repayments of £${repayment14.toLocaleString()}.`,
        `Using the 28% guideline — that monthly mortgage repayments should not exceed 28% of monthly taxable income — state whether this mortgage is affordable for ${name}.`,
        `Justify your answer.`
      ];
      bq = [
        `${name}: gross salary £${grossAnnual14.toLocaleString()}/year. Pension: ${pensionPct14}% of gross.`,
        `Mortgage repayment: £${repayment14.toLocaleString()}/month.`,
        `Is the mortgage affordable using the 28% taxable income guideline?`
      ];
      a = [
        `<strong>•¹</strong> Annual taxable income = £${grossAnnual14.toLocaleString()} − ${pensionPct14}% = £${grossAnnual14.toLocaleString()} − £${pensionAmt14.toLocaleString()} = £${taxableAnnual14.toLocaleString()}`,
        `Monthly taxable income = £${taxableAnnual14.toLocaleString()} ÷ 12 = £${taxableMonthly14.toFixed(2)}`,
        `<strong>•²</strong> 28% of monthly taxable income = 0.28 × £${taxableMonthly14.toFixed(2)} = £${threshold14.toFixed(2)}`,
        `<strong>•³</strong> Monthly repayment (£${repayment14}) is ${isAffordable14 ? "≤" : ">"} £${threshold14.toFixed(2)} → mortgage is <strong>${isAffordable14 ? "affordable" : "not affordable"}</strong>`
      ];
      finalAns = `${isAffordable14 ? "Affordable" : "Not affordable"} — repayment £${repayment14} ${isAffordable14 ? "≤" : ">"} 28% threshold £${threshold14.toFixed(2)}`;

    } else if (variation === 15) {
      // V15: Goal Seek to find AER — G2 (2022 Q9b, 2023 Q11c(i), 2025 Q8a)
      // Excel: Set outstanding balance after final repayment = 0, By changing AER cell
      // Sub-types: A = level repayments only; B = level + balloon in final month (like 2022 Q9b)

      // Numerical solver: bisection on monthly rate m such that outstanding(N) = balloon (= 0 for standard)
      const solveAER15 = (L: number, P: number, N: number, B: number): number => {
        const f = (m: number): number => {
          if (m < 1e-10) return L - P * N - B;
          const fac = Math.pow(1 + m, N);
          return L * fac - P * (fac - 1) / m - B;
        };
        let lo = 1e-7, hi = 0.5;
        for (let i = 0; i < 100; i++) {
          const mid = (lo + hi) / 2;
          if (f(mid) < 0) lo = mid; else hi = mid;
        }
        return +((Math.pow(1 + (lo + hi) / 2, 12) - 1) * 100).toFixed(2);
      };

      const hasBalloon15 = Math.random() < 0.4;
      const loanCtxs15 = [
        { verb: "to buy a car",              thing: "car" },
        { verb: "to fund home improvements", thing: "home improvement project" },
        { verb: "to buy a motorbike",        thing: "motorbike" },
        { verb: "to pay for a holiday",      thing: "holiday" },
      ];
      const ctx15 = loanCtxs15[getRandomInt(0, 3)];

      const loanAmt15 = getRandStep(3000, 15000, 500);
      const N15 = [24, 36, 48, 60][getRandomInt(0, 3)];

      // Compute repayment bounds so AER ∈ [5%, 35%]
      const mLow15  = Math.pow(1.05, 1 / 12) - 1;
      const mHigh15 = Math.pow(1.35, 1 / 12) - 1;
      const facLow15  = Math.pow(1 + mLow15, N15);
      const facHigh15 = Math.pow(1 + mHigh15, N15);

      let balloon15 = 0;
      let P15: number;

      if (hasBalloon15) {
        balloon15 = getRandStep(500, Math.min(4000, Math.floor(loanAmt15 * 0.35 / 500) * 500), 500);
        const pLow15  = Math.ceil((loanAmt15 * facLow15  - balloon15) * mLow15  / (facLow15  - 1) / 10) * 10;
        const pHigh15 = Math.floor((loanAmt15 * facHigh15 - balloon15) * mHigh15 / (facHigh15 - 1) / 10) * 10;
        const pSteps15 = Math.max(0, Math.floor((pHigh15 - pLow15) / 10));
        P15 = pLow15 + getRandomInt(0, pSteps15) * 10;
      } else {
        const pLow15  = Math.ceil(loanAmt15 * mLow15  / (1 - 1 / facLow15)  / 10) * 10;
        const pHigh15 = Math.floor(loanAmt15 * mHigh15 / (1 - 1 / facHigh15) / 10) * 10;
        const pSteps15 = Math.max(0, Math.floor((pHigh15 - pLow15) / 10));
        P15 = pLow15 + getRandomInt(0, pSteps15) * 10;
      }

      const AER15 = solveAER15(loanAmt15, P15, N15, balloon15);

      q = [
        `${name} borrows £${loanAmt15.toLocaleString()} ${ctx15.verb}.`,
        hasBalloon15
          ? `The deal involves level monthly repayments of £${P15.toLocaleString()} for ${N15} months, plus an additional payment of £${balloon15.toLocaleString()} at the end of the final month.`
          : `${name} makes level monthly repayments of £${P15.toLocaleString()} for ${N15} months.`,
        `<strong>You must refer to the spreadsheet file provided when answering this question.</strong>`,
        `The loan repayment schedule is set up in the spreadsheet, with the annual effective interest rate (AER) in a separate named cell.`,
        `Use the spreadsheet to find the annual effective rate of interest for this deal.`
      ];
      bq = [
        `Loan: £${loanAmt15.toLocaleString()} for ${N15} months at unknown AER.`,
        `Repayment: £${P15.toLocaleString()}/month${hasBalloon15 ? ` + £${balloon15.toLocaleString()} balloon in month ${N15}` : ""}.`,
        `Use Goal Seek to find the AER.`
      ];
      a = [
        `<strong>•¹</strong> Open loan schedule spreadsheet — the AER is in a separate cell (e.g. cell B2)`,
        hasBalloon15
          ? `Month ${N15} formula: previous outstanding × (1 + monthly rate) − £${P15.toLocaleString()} − £${balloon15.toLocaleString()}`
          : `Month ${N15} formula: previous outstanding × (1 + monthly rate) − £${P15.toLocaleString()}`,
        `<strong>•²</strong> Goal Seek: <em>Set Cell</em> = outstanding balance in month ${N15} | <em>To value</em> = 0 | <em>By changing cell</em> = AER cell`,
        `<strong>•³</strong> AER = <strong>${AER15.toFixed(2)}%</strong>`
      ];
      finalAns = `${AER15.toFixed(2)}% AER`;

      // Spreadsheet: AER cell blank (Goal Seek changes it), repayment is given
      const perc15 = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr15 = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });
      const rawData15: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", "Loan Repayment Schedule"],
        [],
        ["", "Initial loan amount", curr15(loanAmt15)],
        ["", "Annual effective interest rate", perc15("", 2)],   // ← BLANK: Goal Seek changes this
        ["", "Monthly effective interest rate", perc15("", 6)],
        ["", "Loan Period (months)", N15],
        ["", "Monthly Repayment", curr15(P15)],                  // ← GIVEN
        ...(hasBalloon15 ? [["", "Balloon payment (final month)", curr15(balloon15)]] : []),
        ["", "Final Repayment", curr15("")],
        [],
        ["", "Time (months)", "Repayment (£)", "Interest content of repayment (£)", "Capital content of repayment (£)", "Loan outstanding (£)"],
        ["", 0, curr15(""), curr15(""), curr15(""), curr15(loanAmt15)],
      ];
      for (let m15 = 1; m15 <= N15; m15++) {
        rawData15.push(["", m15, curr15(""), curr15(""), curr15(""), curr15("")]);
      }
      attachments = [{ filename: "Loan_Repayment_Schedule.xlsx", content: "", rawData: rawData15 }];

    } else if (variation === 16) {
      // V16: Increase repayments to reduce term — G3 (2024 Q9c)
      // Student increases monthly repayment to max allowed; find new term + total interest saved

      const loanCtxs16 = [
        { noun: "mortgage", thing: "home extension" },
        { noun: "loan",     thing: "car purchase" },
        { noun: "mortgage", thing: "home renovation" },
        { noun: "loan",     thing: "equipment purchase" },
      ];
      const ctx16 = loanCtxs16[getRandomInt(0, 3)];

      const loanAmt16 = getRandStep(8000, 30000, 1000);
      const N_orig16 = [48, 60, 72, 84][getRandomInt(0, 3)]; // 4–7 year term
      const AER16 = getRandStep(20, 50, 5) / 10; // 2.0–5.0% AER (mortgage range)
      const m16 = Math.pow(1 + AER16 / 100, 1 / 12) - 1;

      // Level repayment: round UP to nearest penny so loan doesn't undershoot
      const fac16 = Math.pow(1 + m16, N_orig16);
      const P_orig16 = Math.ceil(loanAmt16 * m16 / (1 - 1 / fac16) * 100) / 100;

      // Original final repayment
      let balOrig16 = loanAmt16;
      for (let k = 0; k < N_orig16 - 1; k++) {
        balOrig16 = balOrig16 * (1 + m16) - P_orig16;
      }
      const finalOrig16 = +(balOrig16 * (1 + m16)).toFixed(2);
      const totalOrig16 = +((N_orig16 - 1) * P_orig16 + finalOrig16).toFixed(2);

      // New (higher) repayment: increase P_orig by 15–30%, round to nearest £10
      const newMult16 = [115, 120, 125, 130][getRandomInt(0, 3)];
      const P_new16 = Math.ceil(P_orig16 * newMult16 / 100 / 10) * 10;

      // Iterate to find new term and final repayment
      let balNew16 = loanAmt16;
      let N_new16 = 0;
      let finalNew16 = 0;
      while (balNew16 > 0) {
        const grown = balNew16 * (1 + m16);
        N_new16++;
        if (grown <= P_new16) {
          finalNew16 = +grown.toFixed(2);
          balNew16 = 0;
        } else {
          balNew16 = grown - P_new16;
        }
      }
      const totalNew16 = +((N_new16 - 1) * P_new16 + finalNew16).toFixed(2);
      const savings16 = +(totalOrig16 - totalNew16).toFixed(2);
      const termSaved16 = N_orig16 - N_new16;
      const m16Pct = (m16 * 100).toFixed(5);

      q = [
        `${name} takes out a ${ctx16.noun} of £${loanAmt16.toLocaleString()} for a ${ctx16.thing}.`,
        `The ${ctx16.noun} has an annual effective rate of ${AER16.toFixed(1)}% and is to be repaid with level monthly repayments over ${N_orig16 / 12} years (${N_orig16} months).`,
        `<strong>You must refer to the spreadsheet file provided when answering this question.</strong>`,
        `(a) Complete the repayment schedule to determine the level monthly repayment amount and the final repayment amount.`,
        `The lender allows a maximum monthly repayment of £${P_new16.toLocaleString()}. ${name} decides to increase monthly repayments to this maximum.`,
        `Open the 'Increased Payments' worksheet.`,
        `(b)(i) Complete the increased repayment schedule and state the final repayment amount.`,
        `(b)(ii) Determine how much ${name} would save over the term of the ${ctx16.noun} by making the increased repayments.`
      ];
      bq = [
        `${ctx16.noun.charAt(0).toUpperCase() + ctx16.noun.slice(1)}: £${loanAmt16.toLocaleString()}, ${AER16.toFixed(1)}% AER, ${N_orig16} months.`,
        `(a) Level monthly repayment?`,
        `Max repayment allowed: £${P_new16.toLocaleString()}/month. (b)(i) Final repayment? (b)(ii) Total interest saved?`
      ];
      a = [
        `<strong>(a)</strong> Monthly rate: (1 + ${AER16.toFixed(1)}/100)^{1/12} − 1 = ${m16Pct}%`,
        `Level repayment = £${P_orig16.toFixed(2)}. Final repayment = £${finalOrig16.toFixed(2)}.`,
        `Original total paid = ${N_orig16 - 1} × £${P_orig16.toFixed(2)} + £${finalOrig16.toFixed(2)} = £${totalOrig16.toFixed(2)}`,
        `<strong>(b)(i)</strong> At £${P_new16.toLocaleString()}/month, ${ctx16.noun} repaid in ${N_new16} months (${termSaved16} fewer).`,
        `Final repayment = <strong>£${finalNew16.toFixed(2)}</strong>`,
        `New total paid = ${N_new16 - 1} × £${P_new16.toLocaleString()} + £${finalNew16.toFixed(2)} = £${totalNew16.toFixed(2)}`,
        `<strong>(b)(ii)</strong> Savings = £${totalOrig16.toFixed(2)} − £${totalNew16.toFixed(2)} = <strong>£${savings16.toFixed(2)}</strong>`
      ];
      finalAns = `(a) £${P_orig16.toFixed(2)}/month | (b)(i) final £${finalNew16.toFixed(2)} | (b)(ii) save £${savings16.toFixed(2)}`;

      // Spreadsheet: AER given, repayment blank (student uses Goal Seek for part a, then copies sheet for part b)
      const perc16 = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr16 = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });
      const rawData16: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", `${ctx16.noun.charAt(0).toUpperCase() + ctx16.noun.slice(1)} Repayment Schedule — Original Loan`],
        [],
        ["", `Initial ${ctx16.noun} amount`, curr16(loanAmt16)],
        ["", "Annual effective interest rate", perc16(AER16 / 100, 1)],
        ["", "Monthly effective interest rate", perc16("", 6)],
        ["", "Loan Period (months)", N_orig16],
        ["", "Monthly Repayment", curr16("")],    // ← blank: student finds via Goal Seek
        ["", "Final Repayment", curr16("")],
        [],
        ["", "Time (months)", "Repayment (£)", "Interest content of repayment (£)", "Capital content of repayment (£)", `${ctx16.noun.charAt(0).toUpperCase() + ctx16.noun.slice(1)} outstanding (£)`],
        ["", 0, curr16(""), curr16(""), curr16(""), curr16(loanAmt16)],
      ];
      for (let m16 = 1; m16 <= N_orig16; m16++) {
        rawData16.push(["", m16, curr16(""), curr16(""), curr16(""), curr16("")]);
      }
      attachments = [{ filename: "Loan_Repayment_Schedule.xlsx", content: "", rawData: rawData16 }];

    } else if (variation === 17) {
      // V17: Copy worksheet + apply lump sum to reduce balance — G4 (Spec Q10c)
      // After k payments, lump sum applied → same remaining term, lower level repayment. Compute interest saved.

      const giftCtxs17 = ["an inheritance", "a work bonus", "a gift", "savings"];
      const gift17 = giftCtxs17[getRandomInt(0, 3)];
      const loanCtx17 = ["loan", "loan", "mortgage", "loan"][getRandomInt(0, 3)];

      const loanAmt17 = getRandStep(5000, 25000, 1000);
      const N_tot17 = [36, 48, 60, 72][getRandomInt(0, 3)];
      const AER17 = getRandStep(25, 80, 5) / 10; // 2.5–8.0% AER
      const m17 = Math.pow(1 + AER17 / 100, 1 / 12) - 1;
      const facTot17 = Math.pow(1 + m17, N_tot17);
      const P_orig17 = Math.ceil(loanAmt17 * m17 / (1 - 1 / facTot17) * 100) / 100;

      // Payment number when lump sum is applied (25–50% through term)
      const k17 = [Math.floor(N_tot17 * 0.25), Math.floor(N_tot17 * 0.33), Math.floor(N_tot17 * 0.40), Math.floor(N_tot17 * 0.50)][getRandomInt(0, 3)];
      const N_rem17 = N_tot17 - k17;

      // Outstanding after k17 payments (iterative for precision)
      let Bk17 = loanAmt17;
      for (let i = 0; i < k17; i++) { Bk17 = Bk17 * (1 + m17) - P_orig17; }
      Bk17 = +Bk17.toFixed(2);

      // Lump sum: 15–45% of outstanding, rounded to nearest £100
      const minLump17 = Math.ceil(Bk17 * 0.15 / 100) * 100;
      const maxLump17 = Math.floor(Bk17 * 0.45 / 100) * 100;
      const lumpSteps17 = Math.max(0, Math.floor((maxLump17 - minLump17) / 100));
      const lump17 = minLump17 + getRandomInt(0, lumpSteps17) * 100;
      const Bnew17 = +(Bk17 - lump17).toFixed(2);

      // New level repayment
      const facRem17 = Math.pow(1 + m17, N_rem17);
      const P_new17 = Math.ceil(Bnew17 * m17 / (1 - 1 / facRem17) * 100) / 100;

      // Total paid without lump sum (N_rem17 months at P_orig17 from Bk17)
      let balA17 = Bk17;
      let totalA17 = 0;
      for (let i = 0; i < N_rem17 - 1; i++) { totalA17 += P_orig17; balA17 = balA17 * (1 + m17) - P_orig17; }
      const finalA17 = +(balA17 * (1 + m17)).toFixed(2);
      totalA17 = +(totalA17 + finalA17).toFixed(2);

      // Total paid with lump sum (N_rem17 months at P_new17 from Bnew17)
      let balB17 = Bnew17;
      let totalB17 = 0;
      for (let i = 0; i < N_rem17 - 1; i++) { totalB17 += P_new17; balB17 = balB17 * (1 + m17) - P_new17; }
      const finalB17 = +(balB17 * (1 + m17)).toFixed(2);
      totalB17 = +(totalB17 + finalB17).toFixed(2);

      // Interest saved = what you'd have paid without lump sum − (lump sum + what you pay with it)
      const intSaved17 = +(totalA17 - lump17 - totalB17).toFixed(2);
      const m17Pct = (m17 * 100).toFixed(5);

      q = [
        `${name} took out a ${loanCtx17} of £${loanAmt17.toLocaleString()} to be repaid with level monthly repayments over ${N_tot17} months. The annual effective rate of interest is ${AER17.toFixed(1)}%.`,
        `<strong>You must refer to the spreadsheet file provided when answering this question.</strong>`,
        `(a) Open the 'Original Loan' worksheet. Complete the loan schedule to determine the level monthly repayment amount and the final repayment amount.`,
        `${name} has just made the ${k17}th monthly repayment. ${name} has received ${gift17} of £${lump17.toLocaleString()} and is considering using it to reduce the outstanding balance on the ${loanCtx17}.`,
        `The lender agrees to recalculate a new level monthly repayment for the remaining ${N_rem17} months.`,
        `(b)(i) Copy the 'Original Loan' worksheet and rename the copy 'Lump Sum'. Adjust the 'Lump Sum' worksheet to apply the £${lump17.toLocaleString()} payment and calculate ${name}'s new level monthly repayment.`,
        `(b)(ii) Calculate how much ${name} would save in interest by making this lump sum payment.`
      ];
      bq = [
        `${loanCtx17.charAt(0).toUpperCase() + loanCtx17.slice(1)}: £${loanAmt17.toLocaleString()}, ${AER17.toFixed(1)}% AER, ${N_tot17} months.`,
        `(a) Level monthly repayment?`,
        `After ${k17}th payment, apply £${lump17.toLocaleString()} lump sum. (b)(i) New repayment? (b)(ii) Interest saved?`
      ];
      a = [
        `<strong>(a)</strong> Monthly rate: (1 + ${AER17.toFixed(1)}/100)^{1/12} − 1 = ${m17Pct}%`,
        `Level repayment = £${P_orig17.toFixed(2)}. Final repayment = £${finalA17.toFixed(2)}.`,
        `<strong>(b)(i)</strong> Outstanding after ${k17} payments = £${Bk17.toFixed(2)}`,
        `After lump sum: £${Bk17.toFixed(2)} − £${lump17.toLocaleString()} = £${Bnew17.toFixed(2)}`,
        `New level repayment = <strong>£${P_new17.toFixed(2)}</strong>. New final repayment = £${finalB17.toFixed(2)}.`,
        `<strong>(b)(ii)</strong> Total paid without lump sum (${N_rem17} months): £${totalA17.toFixed(2)}`,
        `Total paid with lump sum (£${lump17.toLocaleString()} + ${N_rem17} months at new rate): £${lump17.toLocaleString()} + £${totalB17.toFixed(2)} = £${(lump17 + totalB17).toFixed(2)}`,
        `Interest saved = £${totalA17.toFixed(2)} − £${(lump17 + totalB17).toFixed(2)} = <strong>£${intSaved17.toFixed(2)}</strong>`
      ];
      finalAns = `(a) £${P_orig17.toFixed(2)}/month | (b)(i) new £${P_new17.toFixed(2)}/month | (b)(ii) save £${intSaved17.toFixed(2)}`;

      // Spreadsheet: AER given, repayment blank — student completes then copies sheet for lump sum
      const perc17 = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr17 = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });
      const rawData17: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", `${loanCtx17.charAt(0).toUpperCase() + loanCtx17.slice(1)} Repayment Schedule — Original Loan`],
        [],
        ["", `Initial ${loanCtx17} amount`, curr17(loanAmt17)],
        ["", "Annual effective interest rate", perc17(AER17 / 100, 1)],
        ["", "Monthly effective interest rate", perc17("", 6)],
        ["", "Loan Period (months)", N_tot17],
        ["", "Monthly Repayment", curr17("")],    // ← blank: student finds via Goal Seek
        ["", "Final Repayment", curr17("")],
        [],
        ["", "Time (months)", "Repayment (£)", "Interest content of repayment (£)", "Capital content of repayment (£)", `${loanCtx17.charAt(0).toUpperCase() + loanCtx17.slice(1)} outstanding (£)`],
        ["", 0, curr17(""), curr17(""), curr17(""), curr17(loanAmt17)],
      ];
      for (let m17 = 1; m17 <= N_tot17; m17++) {
        rawData17.push(["", m17, curr17(""), curr17(""), curr17(""), curr17("")]);
      }
      attachments = [{ filename: "Loan_Repayment_Schedule.xlsx", content: "", rawData: rawData17 }];

    } else if (variation === 18) {
      // V18: Goal Seek to non-zero balance target — T5 (2026 Q8b)
      // KEY distinction from V15: here AER is KNOWN, repayment is UNKNOWN (opposite of V15)
      // Goal Seek: Set outstanding balance after deal period = B_target, By changing repayment cell

      const loanAmt18 = getRandStep(80000, 250000, 10000);
      const N_deal18 = [24, 36, 48][getRandomInt(0, 2)]; // deal period in months
      const AER18 = getRandStep(15, 45, 5) / 10; // 1.5–4.5% AER (typical mortgage)
      const m18 = Math.pow(1 + AER18 / 100, 1 / 12) - 1;
      const fac18 = Math.pow(1 + m18, N_deal18);

      // Target: 70–90% of original loan, rounded to nearest £1000
      const targetFrac18 = [0.70, 0.75, 0.80, 0.85, 0.90][getRandomInt(0, 4)];
      const B_target18 = Math.round(loanAmt18 * targetFrac18 / 1000) * 1000;

      // Minimum repayment to hit target: P = [L×fac − B] × m / (fac − 1)
      const P18 = Math.ceil((loanAmt18 * fac18 - B_target18) * m18 / (fac18 - 1) * 100) / 100;
      const m18Pct = (m18 * 100).toFixed(5);
      const dealYrs18 = N_deal18 / 12;

      q = [
        `${name} is taking out a mortgage of £${loanAmt18.toLocaleString()}.`,
        `They choose a ${dealYrs18}-year fixed rate deal with an annual effective interest rate of ${AER18.toFixed(1)}%.`,
        `At the end of the deal, the lender requires the outstanding balance to be no more than £${B_target18.toLocaleString()}.`,
        `<strong>You must refer to the spreadsheet file provided when answering this question.</strong>`,
        `The mortgage repayment schedule is set up in the spreadsheet with the monthly repayment amount in a separate named cell.`,
        `Use the spreadsheet to determine the minimum monthly repayment that satisfies the lender's requirement.`
      ];
      bq = [
        `Mortgage: £${loanAmt18.toLocaleString()}, ${AER18.toFixed(1)}% AER, ${dealYrs18}-year (${N_deal18}-month) deal.`,
        `Outstanding after ${N_deal18} months must be ≤ £${B_target18.toLocaleString()}.`,
        `Goal Seek to find minimum monthly repayment.`
      ];
      a = [
        `<strong>•¹</strong> Monthly rate: (1 + ${AER18.toFixed(1)}/100)^{1/12} − 1 = ${m18Pct}%`,
        `<strong>•²</strong> Goal Seek: <em>Set Cell</em> = outstanding balance in month ${N_deal18} | <em>To value</em> = £${B_target18.toLocaleString()} | <em>By changing cell</em> = monthly repayment cell`,
        `<em>(Note: unlike finding AER, here AER is known and the repayment is the unknown.)</em>`,
        `<strong>•³</strong> Minimum monthly repayment = <strong>£${P18.toFixed(2)}</strong>`
      ];
      finalAns = `£${P18.toFixed(2)}/month (outstanding £${B_target18.toLocaleString()} after ${N_deal18} months)`;

      // Spreadsheet: AER given, repayment blank — Goal Seek sets outstanding = B_target after N_deal18 months
      const perc18 = (val: number | "", dec: number) => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: dec > 0 ? ("0." + "0".repeat(dec) + "%") : "0%" });
      const curr18 = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: '"£"#,##0.00' });
      const rawData18: any[][] = [
        ["", "Name:", "", "", "", ""],
        ["", "SCN:", "", ""],
        ["", "Centre name:", "", "", "", ""],
        [],
        ["", "Mortgage Repayment Schedule"],
        [],
        ["", "Initial mortgage amount", curr18(loanAmt18)],
        ["", "Annual effective interest rate", perc18(AER18 / 100, 1)],
        ["", "Monthly effective interest rate", perc18("", 6)],
        ["", "Deal period (months)", N_deal18],
        ["", "Monthly Repayment", curr18("")],           // ← BLANK: Goal Seek changes this
        ["", "Target outstanding balance", curr18(B_target18)],
        ["", "Outstanding after deal period", curr18("")],
        [],
        ["", "Time (months)", "Repayment (£)", "Interest content of repayment (£)", "Capital content of repayment (£)", "Loan outstanding (£)"],
        ["", 0, curr18(""), curr18(""), curr18(""), curr18(loanAmt18)],
      ];
      for (let m18 = 1; m18 <= N_deal18; m18++) {
        rawData18.push(["", m18, curr18(""), curr18(""), curr18(""), curr18("")]);
      }
      attachments = [{ filename: "Mortgage_Repayment_Schedule.xlsx", content: "", rawData: rawData18 }];
    }
  } else if (selectedTopic === "Inflation & Purchasing Power") {
    const variation = getRandomInt(1, 4);
    if (variation === 1) {
      const year1 = 2015;
      const year2 = getRandStep(2023, 2026, 1);
      const cpiVal = getRandStep(1154, 1358, 1) / 10;
      const currentPrice = getRandStep(450, 950, 10);
      
      q = [
        `The Consumer Price Index (CPI) in April ${year2} was ${cpiVal.toFixed(1)}, relative to a baseline of 100 in April ${year1}.`,
        `The price of a standard laptop rose in line with CPI.`,
        `If the laptop cost £${currentPrice} in April ${year2}, calculate its price in April ${year1}.`
      ];
      bq = [
        `April ${year1} CPI: 100`,
        `April ${year2} CPI: ${cpiVal.toFixed(1)}`,
        `A laptop costs £${currentPrice} in April ${year2}. It rose in line with CPI.`,
        `Calculate its price in April ${year1}.`
      ];
      
      const decimalStep = currentPrice / cpiVal;
      const historicalPrice = decimalStep * 100;
      
      a = [
        `<strong>1.</strong> Reverse inflation formula: (${currentPrice} / ${cpiVal.toFixed(1)}) \\times 100`,
        `<strong>2.</strong> Calculation: ${currentPrice} / ${cpiVal.toFixed(1)} = ${decimalStep.toFixed(5)}`,
        `<strong>3.</strong> £${historicalPrice.toFixed(2)}`
      ];
      finalAns = `£${historicalPrice.toFixed(2)}`;
    } else if (variation === 2) {
      const cpiVal = getRandStep(1125, 1285, 5) / 10;
      const oldWage = getRandStep(1050, 1400, 50) / 100;
      const newWage = getRandStep(1150, 1650, 50) / 100;
      
      q = [
        `Between 2020 and 2024, the CPI rose from a baseline of 100 to ${cpiVal.toFixed(1)}.`,
        `Over the exact same period, ${name}'s hourly wage increased from £${oldWage.toFixed(2)} to £${newWage.toFixed(2)}.`,
        `By calculating the percentage increase in ${name}'s wage, determine whether their wage increase was in line with inflation.`
      ];
      bq = [
        `CPI 2020: 100   →   CPI 2024: ${cpiVal.toFixed(1)}`,
        `Wage 2020: £${oldWage.toFixed(2)}/hr   →   Wage 2024: £${newWage.toFixed(2)}/hr`,
        `Determine if the wage increase was in line with inflation.`
      ];
      
      const inflationPercent = cpiVal - 100;
      const wageDiff = newWage - oldWage;
      const wageIncPercent = (wageDiff / oldWage) * 100;
      const inLine = wageIncPercent >= inflationPercent;
      
      a = [
        `<strong>1.</strong> Relative rate of inflation = ${cpiVal.toFixed(1)} - 100 = ${inflationPercent.toFixed(1)}\\%`,
        `<strong>2.</strong> Wage increase = ${newWage.toFixed(2)} - ${oldWage.toFixed(2)} = £${wageDiff.toFixed(2)}`,
        `<strong>3.</strong> Percentage wage increase = (${wageDiff.toFixed(2)} / ${oldWage.toFixed(2)}) \\times 100 = ${wageIncPercent.toFixed(2)}\\%`,
        `<strong>4.</strong> Conclusion: Since ${wageIncPercent.toFixed(2)}\\% is ${inLine ? 'greater than or equal to' : 'less than'} ${inflationPercent.toFixed(1)}\\%, the wage increase ${inLine ? 'was' : 'was not'} in line with inflation.`
      ];
      finalAns = `${wageIncPercent.toFixed(2)}\\%. ${inLine ? 'In line' : 'Not in line'}.`;
    } else if (variation === 3) {
      const cpiVal = getRandStep(1212, 1465, 1) / 10;
      q = [
        `The Consumer Price Index (CPI) in the UK is projected to be ${cpiVal.toFixed(1)} this year, relative to a baseline of 100 in 2015.`,
        `Explain what this figure means in terms of relative purchasing power.`
      ];
      a = [
        `"It means that £${cpiVal.toFixed(1)} today would buy the exact same amount of goods and services as £100 did in 2015, demonstrating that relative purchasing power has decreased."`,
        `(Must explicitly reference 'same amount of goods' or 'buy less' to mirror SQA marking instructions)`
      ];
      finalAns = `Explanation of CPI`;
    } else {
      const months = ["April", "June", "September"];
      const month = months[getRandomInt(0, 2)];
      const year1 = getRandStep(2018, 2021, 1);
      const years = getRandStep(3, 5, 1);
      const deposit = getRandStep(4000, 10000, 100);
      const finalAmount = getRandStep(Math.floor(deposit * 1.15), Math.floor(deposit * 1.25), 50);
      const cpi1 = getRandStep(1050, 1150, 1) / 10;
      const cpi2 = getRandStep(Math.floor(cpi1 * 11), Math.floor(cpi1 * 13), 1) / 10;
      
      q = [
        `In ${month} ${year1}, ${name} deposited £${deposit.toLocaleString()} into a savings account.`,
        `After ${years} years, the savings had accumulated to £${finalAmount.toLocaleString()}.`,
        `In ${month} ${year1}, the Consumer Price Index (CPI) was ${cpi1.toFixed(1)}. After ${years} years, the CPI was ${cpi2.toFixed(1)}.`,
        `Determine whether ${name}'s savings have increased at least in line with inflation. Give a reason for your answer.`
      ];
      bq = [
        `Deposit: £${deposit.toLocaleString()}   →   Final Amount: £${finalAmount.toLocaleString()} (${years} years)`,
        `Start CPI: ${cpi1.toFixed(1)}   →   End CPI: ${cpi2.toFixed(1)}`,
        `Determine whether savings increased at least in line with inflation.`
      ];
      
      const savingsInc = ((finalAmount - deposit) / deposit) * 100;
      const cpiInc = ((cpi2 - cpi1) / cpi1) * 100;
      const atLeast = savingsInc >= cpiInc;
      
      a = [
        `<strong>1.</strong> Calculate percentage increase in savings: ((${finalAmount} - ${deposit}) / ${deposit}) \\times 100 = ${savingsInc.toFixed(2)}\\%`,
        `<strong>2.</strong> Calculate percentage increase in CPI (inflation): ((${cpi2.toFixed(1)} - ${cpi1.toFixed(1)}) / ${cpi1.toFixed(1)}) \\times 100 = ${cpiInc.toFixed(2)}\\%`,
        `<strong>3.</strong> Conclusion: Since the savings percentage increase (${savingsInc.toFixed(2)}\\%) is ${atLeast ? 'greater than/equal to' : 'less than'} the inflation percentage increase (${cpiInc.toFixed(2)}\\%), the savings ${atLeast ? 'have' : 'have not'} increased at least in line with inflation.`
      ];
      finalAns = `${atLeast ? 'Have' : 'Have not'} increased in line`;
    }
  } else if (selectedTopic === "Insurance") {
    const variation = getRandomInt(1, 4);
    if (variation === 1) {
      const premA = getRandStep(220, 290, 10);
      const excessA = getRandStep(400, 600, 50);
      const premB = getRandStep(350, 450, 10);
      const excessB = getRandStep(100, 150, 10);
      
      q = [
        `${name} is taking out buildings insurance. They are choosing between two options:`,
        `Policy A has an annual premium of £${premA} and an excess of £${excessA}.`,
        `Policy B has an annual premium of £${premB} and an excess of £${excessB}.`,
        `State one advantage to ${name} of choosing Policy A with the higher excess amount.`
      ];
      a = [`"The annual premium that ${name} has to pay for the policy is lower/cheaper."`];
      finalAns = `Lower premium`;
    } else if (variation === 2) {
      const excess = getRandStep(350, 500, 50);
      const repairCost = getRandStep(150, 300, 10);
      q = [
        `${name} has an insurance policy with an excess of £${excess}.`,
        `A storm damages their property, and the estimated repair cost is £${repairCost}.`,
        `Explain why ${name} cannot make a claim on their insurance for this damage.`
      ];
      a = [
        `"The cost of the repair (£${repairCost}) is strictly less than the excess amount (£${excess}).`,
        `Therefore, the insurance company would not pay out any money towards the claim."`
      ];
      finalAns = `Repair cost is less than excess`;
    } else if (variation === 3) {
      const excess = getRandStep(100, 200, 50);
      let repairCost = getRandStep(250, 400, 10);
      q = [
        `${name} has an insurance policy with an excess of £${excess}.`,
        `Their property is damaged, costing £${repairCost} to repair.`,
        `Explain why ${name} might choose to pay for the repair themselves rather than making a claim using their insurance policy.`
      ];
      a = [
        `"Making a claim for a small payout could cause their future premiums to increase (or cause them to lose their no-claims bonus),`,
        `which might cost them more in the long term than the £${repairCost - excess} they would receive."`
      ];
      finalAns = `Avoid increasing future premiums`;
    } else if (variation === 4) {
      // Written: purpose of insurance — 2025 Q8(b) pattern
      const insTypes4 = [
        { type: "car",      context: `${name} has recently passed their driving test and is buying their first car.` },
        { type: "home",     context: `${name} has just bought their first home and is deciding whether to take out home insurance.` },
        { type: "travel",   context: `${name} is planning a holiday abroad and is considering travel insurance.` },
        { type: "contents", context: `${name} has just moved into a new flat and is deciding whether to take out contents insurance.` },
      ];
      const ins4 = insTypes4[getRandomInt(0, insTypes4.length - 1)];

      q = [
        ins4.context,
        `Explain the purpose of ${ins4.type} insurance.`
      ];
      bq = [
        ins4.context,
        `Explain the purpose of ${ins4.type} insurance.`
      ];
      a = [
        `<strong>•¹</strong> ${ins4.type.charAt(0).toUpperCase() + ins4.type.slice(1)} insurance provides financial protection against unexpected costs — for example, covering the cost of repairs, replacements, or compensation that would otherwise have to be paid out of pocket.`
      ];
      finalAns = `Financial protection against unexpected losses`;
    }
  } else if (selectedTopic === "Basic Probability") {
    const variation = getRandomInt(1, 6);
    if (variation === 1) {
      const allThree = getRandomInt(5, 15);
      const r_f = getRandomInt(allThree + 10, allThree + 30);
      const r_h = getRandomInt(allThree + 5, allThree + 25);
      const f_h = getRandomInt(allThree + 8, allThree + 28);
      const only_r = getRandomInt(10, 40);
      const only_f = getRandomInt(10, 40);
      const only_h = getRandomInt(10, 40);
      const none = getRandomInt(5, 25);
      
      const r_f_only = r_f - allThree;
      const r_h_only = r_h - allThree;
      const f_h_only = f_h - allThree;
      
      const total = allThree + r_f_only + r_h_only + f_h_only + only_r + only_f + only_h + none;
      
      q = [
        `A group of ${total} pupils are asked which sports they play from Rugby, Football, and Hockey.`,
        `${allThree} play all three sports.`,
        `${r_f} play Rugby and Football.`,
        `${r_h} play Rugby and Hockey.`,
        `${f_h} play Football and Hockey.`,
        `${only_r} play Rugby only.`,
        `${only_f} play Football only.`,
        `${only_h} play Hockey only.`,
        `${none} play no sports.`,
        `<svg width="240" height="180" viewBox="0 0 240 180" class="mx-auto block my-4" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="220" height="160" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="90" cy="70" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="150" cy="70" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="120" cy="115" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="45" y="32" font-size="12" fill="currentColor">Rugby</text><text x="155" y="32" font-size="12" fill="currentColor">Football</text><text x="155" y="150" font-size="12" fill="currentColor">Hockey</text></svg>`,
        `A pupil is selected at random. Determine the probability that the pupil plays Rugby and Football, but not Hockey.`
      ];
      bq = [
        `[Venn Diagram Data: ${total} pupils]`,
        `All three (${allThree}) | R&F (${r_f}) | R&H (${r_h}) | F&H (${f_h})`,
        `R only (${only_r}) | F only (${only_f}) | H only (${only_h}) | None (${none})`,
        q[9], // SVG
        `Determine the probability that a pupil plays Rugby and Football, but not Hockey.`
      ];
      
      a = [
        `<strong>1.</strong> Calculate the number of pupils who play Rugby and Football but NOT Hockey: ${r_f} - ${allThree} = ${r_f_only}.`,
        `<strong>2.</strong> Identify the total number of pupils: ${total}.`,
        `<strong>3.</strong> State the probability: \\frac{${r_f_only}}{${total}}`
      ];
      finalAns = `${r_f_only} / ${total}`;
    } else if (variation === 2) {
      const allThree = getRandomInt(10, 30);
      const t_r = getRandomInt(15, 45);
      const t_c = getRandomInt(15, 45);
      const r_c = getRandomInt(15, 45);
      const only_t = getRandomInt(20, 60);
      const only_r = getRandomInt(20, 60);
      const only_c = getRandomInt(20, 60);
      const none = getRandomInt(10, 50);
      
      const totalInCircles = allThree + t_r + t_c + r_c + only_t + only_r + only_c;
      const total = totalInCircles + none;
      
      q = [
        `A gym surveys its members about which machines they use: Treadmill (T), Rowing Machine (R), and Cross Trainer (C).`,
        `${allThree} members use all three.`,
        `${t_r} use T and R only.`,
        `${t_c} use T and C only.`,
        `${r_c} use R and C only.`,
        `${only_t} use T only.`,
        `${only_r} use R only.`,
        `${only_c} use C only.`,
        `<svg width="240" height="180" viewBox="0 0 240 180" class="mx-auto block my-4" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="220" height="160" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="90" cy="70" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="150" cy="70" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="120" cy="115" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="50" y="32" font-size="12" fill="currentColor">T</text><text x="180" y="32" font-size="12" fill="currentColor">R</text><text x="155" y="150" font-size="12" fill="currentColor">C</text></svg>`,
        `The survey included ${total} members in total. Calculate the number of members who do not use any of these three machines.`
      ];
      bq = [
        `[Venn Diagram Data: ${total} members]`,
        `All 3: ${allThree} | T&R only: ${t_r} | T&C only: ${t_c} | R&C only: ${r_c}`,
        `T only: ${only_t} | R only: ${only_r} | C only: ${only_c}`,
        q[8], // SVG
        `Calculate the number of members who do not use any machine.`
      ];
      
      a = [
        `<strong>1.</strong> Sum the members inside the circles: ${allThree} + ${t_r} + ${t_c} + ${r_c} + ${only_t} + ${only_r} + ${only_c} = ${totalInCircles}`,
        `<strong>2.</strong> Subtract from the total surveyed: ${total} - ${totalInCircles} = ${none}`
      ];
      finalAns = `${none} members`;
    } else if (variation === 3) {
      const probA = getRandomInt(11, 15) * 5; // 55 to 75
      const probB = 100 - probA;
      const defectA = getRandStep(15, 45, 1) / 10;
      const defectB = getRandStep(20, 60, 1) / 10;
      
      q = [
        `A honey packing facility uses two machines. Machine A packs ${probA}% of the jars, and Machine B packs the remaining ${probB}%.`,
        `It is known that ${defectA.toFixed(1)}% of the jars packed by Machine A are under-filled, and ${defectB.toFixed(1)}% of the jars from Machine B are under-filled.`,
        `<svg width="250" height="140" viewBox="0 0 250 140" class="mx-auto block my-4" xmlns="http://www.w3.org/2000/svg"><path d="M 30 70 L 90 35 M 30 70 L 90 105" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 120 35 L 180 15 M 120 35 L 180 55" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 120 105 L 180 85 M 120 105 L 180 125" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="100" y="38" font-size="12" fill="currentColor">A</text><text x="100" y="108" font-size="12" fill="currentColor">B</text><text x="190" y="18" font-size="11" fill="currentColor">Under-filled</text><text x="190" y="58" font-size="11" fill="currentColor">Not under</text><text x="190" y="88" font-size="11" fill="currentColor">Under-filled</text><text x="190" y="128" font-size="11" fill="currentColor">Not under</text></svg>`,
        `Determine the probability that a randomly selected jar is under-filled.`
      ];
      bq = [
        `Packs: Machine A (${probA}%), Machine B (${probB}%).`,
        `Under-filled: Machine A (${defectA.toFixed(1)}%), Machine B (${defectB.toFixed(1)}%).`,
        q[2], // SVG
        `Determine the probability that a randomly selected jar is under-filled.`
      ];
      
      const pADefect = (probA / 100) * (defectA / 100);
      const pBDefect = (probB / 100) * (defectB / 100);
      const finalProb = pADefect + pBDefect;
      
      a = [
        `<strong>1.</strong> Probability of Machine A AND under-filled: (${probA}/100) \\times (${defectA.toFixed(1)}/100) = ${pADefect.toFixed(4)}`,
        `<strong>2.</strong> Probability of Machine B AND under-filled: (${probB}/100) \\times (${defectB.toFixed(1)}/100) = ${pBDefect.toFixed(4)}`,
        `<strong>3.</strong> Total Probability (OR rule): ${pADefect.toFixed(4)} + ${pBDefect.toFixed(4)} = ${finalProb.toFixed(4)}`
      ];
      finalAns = `${finalProb.toFixed(4)}`;
    } else if (variation === 4) {
      const testsA = ["verbal reasoning", "numerical reasoning", "practical", "theory"];
      const tA = testsA[getRandomInt(0, 3)];
      let tB = testsA[getRandomInt(0, 3)];
      while (tB === tA) tB = testsA[getRandomInt(0, 3)];
      
      const pBoth = getRandomInt(25, 55);
      const pA = getRandomInt(pBoth + 20, pBoth + 50);
      const pB = getRandomInt(pBoth + 15, pBoth + 45);
      const fBoth = getRandomInt(5, 20);
      
      const onlyA = pA - pBoth;
      const onlyB = pB - pBoth;
      const totalGroup = onlyA + onlyB + pBoth + fBoth;
      const onlyOne = onlyA + onlyB;
      
      q = [
        `A group of ${totalGroup} candidates sat two tests as part of an assessment. The results were as follows:`,
        `${pA} passed the ${tA} test`,
        `${pB} passed the ${tB} test`,
        `${pBoth} passed both tests.`,
        `<svg width="220" height="140" viewBox="0 0 220 140" class="mx-auto block my-4" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="200" height="120" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="85" cy="75" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="135" cy="75" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="25" y="25" font-size="10" fill="currentColor">${tA}</text><text x="145" y="25" font-size="10" fill="currentColor">${tB}</text></svg>`,
        `(a) Complete the Venn diagram to show this information.`,
        `(b) One candidate is chosen at random. Calculate the probability that this candidate passed only one of the tests.`
      ];
      bq = [
        `[Total: ${totalGroup} candidates] ${pA} passed ${tA}, ${pB} passed ${tB}, ${pBoth} passed both.`,
        q[4], // SVG
        `(a) Complete the Venn diagram. (b) Calculate the probability that a candidate passed exactly one test.`
      ];
      
      a = [
        `<strong>1.</strong> Calculate ${tA} ONLY: ${pA} - ${pBoth} = ${onlyA}`,
        `<strong>2.</strong> Calculate ${tB} ONLY: ${pB} - ${pBoth} = ${onlyB}`,
        `<strong>3.</strong> Calculate total who passed exactly one test: ${onlyA} + ${onlyB} = ${onlyOne}`,
        `<strong>4.</strong> Final Probability: \\frac{${onlyOne}}{${totalGroup}}`
      ];
      finalAns = `${onlyOne}/${totalGroup}`;
    } else if (variation === 5) {
      const delays = ["Manufacturing delay", "Delivery delay", "Staff shortage", "Weather delay"];
      const d1 = delays[getRandomInt(0, 3)];
      let d2 = delays[getRandomInt(0, 3)];
      while (d2 === d1) d2 = delays[getRandomInt(0, 3)];
      
      const p1 = getRandStep(15, 35, 1) / 100;
      const p2 = getRandStep(10, 25, 1) / 100;
      
      q = [
        `A company faces a penalty if a project is delayed. Two independent reasons for a delay have been identified:`,
        `${d1} — there is a ${p1.toFixed(2)} probability that this happens.`,
        `${d2} — there is a ${p2.toFixed(2)} probability that this happens.`,
        `<svg width="260" height="140" viewBox="0 0 260 140" class="mx-auto block my-4" xmlns="http://www.w3.org/2000/svg"><path d="M 20 70 L 90 35 M 20 70 L 90 105" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 120 35 L 180 15 M 120 35 L 180 55" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 120 105 L 180 85 M 120 105 L 180 125" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="60" y="20" font-size="10" fill="currentColor">${d1}</text><text x="60" y="125" font-size="10" fill="currentColor">No delay</text><text x="190" y="18" font-size="10" fill="currentColor">${d2}</text><text x="190" y="58" font-size="10" fill="currentColor">No delay</text><text x="190" y="88" font-size="10" fill="currentColor">${d2}</text><text x="190" y="128" font-size="10" fill="currentColor">No delay</text></svg>`,
        `(a) Calculate the missing probabilities and complete the tree diagram.`,
        `(b) Determine the probability that one or both of these delays will happen.`
      ];
      bq = [
        `Delay Probabilities:`,
        `- ${d1}: ${p1.toFixed(2)}`,
        `- ${d2}: ${p2.toFixed(2)}`,
        q[3], // SVG
        `(a) Complete the tree diagram. (b) Determine the probability of one or both delays.`
      ];
      
      const np1 = 1 - p1;
      const np2 = 1 - p2;
      const pNeither = np1 * np2;
      const finalProb = 1 - pNeither;
      
      a = [
        `<strong>1.</strong> Calculate missing "No Delay" probabilities: 1 - ${p1.toFixed(2)} = ${np1.toFixed(2)} and 1 - ${p2.toFixed(2)} = ${np2.toFixed(2)}`,
        `<strong>2.</strong> Probability of NO delays: ${np1.toFixed(2)} \\times ${np2.toFixed(2)} = ${pNeither.toFixed(4)}`,
        `<strong>3.</strong> Probability of one or both: 1 - ${pNeither.toFixed(4)} = ${finalProb.toFixed(4)}`
      ];
      finalAns = `${finalProb.toFixed(4)}`;

    } else if (variation === 6) {
      // V6: Three-circle Venn, pairwise overlaps given as totals — two-part (G28/T2 — 2024 Q2, 2026 Q4)
      // Key distinction from V1: two-part structure (a) complete the diagram, (b) probability
      // Student must subtract allThree from each pairwise total to fill in exclusive regions
      type VennCtx = { group: string; groupThe: string; s1: string; s2: string; s3: string; intro: string; prompt: string; noneText: string };
      const ctxs6: VennCtx[] = [
        {
          group: "students", groupThe: "student",
          s1: "French", s2: "Spanish", s3: "Arabic",
          intro: `A college offers language courses in French, Spanish and Arabic.`,
          prompt: `A group of students are asked which, if any, of these language courses they study at this college:`,
          noneText: "study no languages"
        },
        {
          group: "members", groupThe: "member",
          s1: "TikTok", s2: "Instagram", s3: "YouTube",
          intro: `A survey asks social media users which platforms they use regularly.`,
          prompt: `A group of people are asked which, if any, of these platforms they use regularly:`,
          noneText: "use none of these platforms"
        },
        {
          group: "pupils", groupThe: "pupil",
          s1: "Maths Club", s2: "Science Club", s3: "Art Club",
          intro: `A school surveys pupils about which after-school clubs they attend.`,
          prompt: `A group of pupils are asked which, if any, of these clubs they attend:`,
          noneText: "attend no clubs"
        },
        {
          group: "customers", groupThe: "customer",
          s1: "Tea", s2: "Coffee", s3: "Hot Chocolate",
          intro: `A café surveys its customers about their hot drink preferences.`,
          prompt: `A group of customers are asked which, if any, of these drinks they order regularly:`,
          noneText: "order none of these drinks"
        },
      ];
      const ctx6 = ctxs6[getRandomInt(0, ctxs6.length - 1)];
      const { s1, s2, s3, group, groupThe } = ctx6;

      const allThree6  = getRandomInt(8, 22);
      const p12_6      = allThree6 + getRandomInt(15, 35);  // S1 ∩ S2 total (includes allThree)
      const p13_6      = allThree6 + getRandomInt(12, 30);  // S1 ∩ S3 total
      const p23_6      = allThree6 + getRandomInt(10, 28);  // S2 ∩ S3 total
      const only1_6    = getRandomInt(10, 45);
      const only2_6    = getRandomInt(5, 25);
      const only3_6    = getRandomInt(8, 30);
      const none6      = getRandomInt(5, 20);

      const excl12_6   = p12_6 - allThree6;   // S1 and S2 only
      const excl13_6   = p13_6 - allThree6;   // S1 and S3 only
      const excl23_6   = p23_6 - allThree6;   // S2 and S3 only

      const total6 = allThree6 + excl12_6 + excl13_6 + excl23_6 + only1_6 + only2_6 + only3_6 + none6;

      const blankVenn6 = `<svg width="240" height="185" viewBox="0 0 240 185" class="mx-auto block my-4" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="230" height="175" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="90" cy="75" r="48" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="150" cy="75" r="48" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="120" cy="120" r="48" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="42" y="30" font-size="11" fill="currentColor">${s1}</text><text x="152" y="30" font-size="11" fill="currentColor">${s2}</text><text x="160" y="168" font-size="11" fill="currentColor">${s3}</text></svg>`;

      q = [
        ctx6.intro,
        ctx6.prompt,
        `<ul>
  <li>${allThree6} ${group} study all three</li>
  <li>${only1_6} study ${s1} only</li>
  <li>${only2_6} study ${s2} only</li>
  <li>${only3_6} study ${s3} only</li>
  <li>${p12_6} study ${s1} and ${s2}</li>
  <li>${p13_6} study ${s1} and ${s3}</li>
  <li>${p23_6} study ${s2} and ${s3}</li>
  <li>${none6} ${ctx6.noneText}.</li>
</ul>`,
        `(a) Complete the Venn diagram to show this information.`,
        blankVenn6,
        `(b) A ${groupThe} is selected at random. Determine the probability that the ${groupThe} studies ${s2} and ${s3}, but not ${s1}.`
      ];
      bq = [
        `Venn data: ${allThree6} all three | ${only1_6} ${s1} only | ${only2_6} ${s2} only | ${only3_6} ${s3} only`,
        `Pairwise totals: ${s1}&${s2}=${p12_6}, ${s1}&${s3}=${p13_6}, ${s2}&${s3}=${p23_6}. None=${none6}.`,
        blankVenn6,
        `(a) Complete the Venn diagram. (b) P(${s2} and ${s3}, not ${s1}).`
      ];
      a = [
        `<strong>•¹ (a)</strong> Find exclusive pair regions by subtracting the all-three value from each pairwise total:`,
        `${s1} and ${s2} only = ${p12_6} − ${allThree6} = <strong>${excl12_6}</strong>`,
        `${s1} and ${s3} only = ${p13_6} − ${allThree6} = <strong>${excl13_6}</strong>`,
        `${s2} and ${s3} only = ${p23_6} − ${allThree6} = <strong>${excl23_6}</strong>`,
        `Completed diagram: centre = ${allThree6} | ${s1} only = ${only1_6} | ${s2} only = ${only2_6} | ${s3} only = ${only3_6} | outside = ${none6}`,
        `<strong>•² (b)</strong> Total ${group} = ${total6}. Number studying ${s2} and ${s3} but not ${s1} = <strong>${excl23_6}</strong>`,
        `<strong>•³</strong> Probability = \\(\\frac{${excl23_6}}{${total6}}\\)`
      ];
      finalAns = `(a) excl pairs: ${excl12_6}, ${excl13_6}, ${excl23_6} | (b) ${excl23_6}/${total6}`;
    }
  } else if (selectedTopic === "Statistical Literacy & Data Gathering") {
    const variation = getRandomInt(1, 5);
    if (variation === 1) {
      const subjects = ["dogs", "honeybees", "patients", "pupils"];
      const numVars = ["number of fleas", "number of hives owned", "age in years", "number of siblings"];
      const catVars = ["breed of dog", "preferred hive type", "blood type", "preferred political party"];
      const idx = getRandomInt(0, 3);
      
      const subject = subjects[idx];
      const numVar = numVars[idx];
      const catVar = catVars[idx];
      
      q = [
        `A researcher gathers data on a sample of ${subject}.`,
        `They record the ${numVar} and the ${catVar}.`,
        `State the type of data that best describes: (i) ${numVar} and (ii) ${catVar}.`
      ];
      bq = [
        `Sample: ${subject}.`,
        `Recorded: ${numVar} AND ${catVar}.`,
        `State the type of data for (i) ${numVar} and (ii) ${catVar}.`
      ];
      
      a = [
        `<strong>(i)</strong> Discrete numerical (or discrete quantitative).`,
        `<strong>(ii)</strong> Categorical (or nominal/qualitative).`
      ];
      finalAns = `(i) Discrete numerical (ii) Categorical`;
    } else if (variation === 2) {
      const hobbies = ["beekeepers", "gardeners", "cyclists"];
      const variables = ["honey yield", "money spent on plants", "distance cycled per week"];
      const idx = getRandomInt(0, 2);
      
      q = [
        `An online survey is posted on a social media group for amateur ${hobbies[idx]} to estimate the average ${variables[idx]} for the entire UK.`,
        `Give two reasons why these results do not provide a representative sample of the national population.`
      ];
      bq = [
        `An online social media survey targets amateur ${hobbies[idx]} to estimate the UK average ${variables[idx]}.`,
        `Give two reasons why this sample is not representative.`
      ];
      
      a = [
        `<strong>Reason 1:</strong> The survey only targets amateur ${hobbies[idx]}, who may have very different ${variables[idx]} compared to professionals/commercial users.`,
        `<strong>Reason 2:</strong> It is an online social media survey, which excludes people who do not use the internet or that specific platform (self-selection bias).`
      ];
      finalAns = `Target audience and self-selection bias`;
    } else if (variation === 3) {
      const issues = ["flea infestations", "hay fever symptoms", "heating usage"];
      const groupsA = ["urban clinics", "city schools", "northern regions"];
      const groupsB = ["rural clinics", "country schools", "southern regions"];
      const idx = getRandomInt(0, 2);
      
      q = [
        `A study compares ${issues[idx]} in ${groupsA[idx]} and ${groupsB[idx]}.`,
        `The data from ${groupsA[idx]} was collected from June to August.`,
        `The data from ${groupsB[idx]} was collected from November to January.`,
        `Explain how this may affect the conclusions of the study.`
      ];
      bq = [
        `Study on ${issues[idx]} comparing ${groupsA[idx]} (collected June-Aug) with ${groupsB[idx]} (collected Nov-Jan).`,
        `Explain how this may affect the study's conclusions.`
      ];
      
      a = [
        `"The data is not comparable because it was collected during completely different time periods/seasons.`,
        `Seasonal variability (weather/temperature) is a confounding variable that will distort the difference between ${groupsA[idx]} and ${groupsB[idx]}."`
      ];
      finalAns = `Seasonal variability is a confounding variable`;
    } else if (variation === 4) {
      // Data misrepresentation + unrealistic extrapolation — 2026 Q11 / 2025 Q5(b) pattern
      // (a) State one reason the data might misrepresent the true situation (1 mark)
      // (b) Explain why a headline based on the data is unrealistic (1 mark)
      const contexts = [
        {
          subject: "registered honeybee hives",
          unit: "hives",
          collector: "all beekeepers in the UK are asked to voluntarily submit the number of hives they own each year",
          reason: "The data is self-reported and voluntary, so beekeepers who do not submit (e.g. unregistered hobbyists) are not counted, meaning the true number of hives may be underestimated.",
          headline: (yr: number, val: number) => `No honeybees in the UK by ${yr + 8}!`,
          headlineReason: "The headline assumes the decline will continue at exactly the same rate, but bee populations are affected by many factors (weather, disease, conservation efforts) and are unlikely to reach zero.",
        },
        {
          subject: "registered red squirrel sightings",
          unit: "sightings",
          collector: "members of the public are invited to submit red squirrel sightings to a national database each year",
          reason: "Only people who actively look for and report red squirrels will submit data. Casual observers who see squirrels but do not report them are excluded, so the true number of sightings is likely higher.",
          headline: (yr: number, val: number) => `Red squirrels set to disappear from UK by ${yr + 6}!`,
          headlineReason: "Extrapolating a short-term decline to predict extinction assumes the trend is linear, which ignores conservation interventions, breeding programmes, and natural population fluctuations.",
        },
        {
          subject: "reported cycling trips",
          unit: "trips",
          collector: "local councils ask commuters to voluntarily log their cycling trips using a smartphone app",
          reason: "Only commuters who have downloaded and use the app will log trips. People who cycle but do not use the app are excluded, so the data is likely to undercount the true number of cycling trips.",
          headline: (yr: number, val: number) => `Cycling in UK to drop to zero within a decade!`,
          headlineReason: "A short-term decrease in app-reported trips cannot be reliably extrapolated to predict the total elimination of cycling, since the data only captures app users and does not reflect all cycling behaviour.",
        },
        {
          subject: "library visits",
          unit: "visits",
          collector: "libraries record only in-person visits using entry turnstiles",
          reason: "The data only counts physical visits to the library. People who access library services digitally (e-books, online catalogue, remote learning) are not counted, so the data underrepresents total library engagement.",
          headline: (yr: number, val: number) => `UK libraries to have no visitors by ${yr + 7}!`,
          headlineReason: "The decline in in-person visits does not mean libraries are becoming unused — digital usage has grown substantially. Extrapolating a linear trend to zero ignores the shift to online services.",
        },
      ];
      const ctx = contexts[getRandomInt(0, contexts.length - 1)];
      const startYear = getRandomInt(2019, 2021);
      const startVal = getRandStep(200000, 600000, 10000);
      const annualDecline = getRandStep(3, 10, 1) / 100; // 3–10% per year decline
      const rows = 4;
      const vals = Array.from({ length: rows }, (_, i) =>
        Math.round(startVal * Math.pow(1 - annualDecline, i) / 1000) * 1000
      );
      const tableRows = vals.map((v, i) =>
        `<tr><td class="border border-slate-300 px-2 py-1">${startYear + i}</td><td class="border border-slate-300 px-2 py-1">${v.toLocaleString()}</td></tr>`
      ).join('');
      const tableHtml = `<table class="table-auto border-collapse border border-slate-400 my-3 text-sm"><thead><tr><th class="border border-slate-300 px-2 py-1">Year</th><th class="border border-slate-300 px-2 py-1">Number of ${ctx.unit}</th></tr></thead><tbody>${tableRows}</tbody></table>`;
      const lastYear = startYear + rows - 1;

      q = [
        `Each year, ${ctx.collector}.`,
        `The table below shows the number of ${ctx.subject} recorded over a four-year period.`,
        tableHtml,
        `(a) State one reason why this data might misrepresent the true number of ${ctx.subject}.`,
        `A newspaper publishes the headline: <em>"${ctx.headline(lastYear, vals[rows - 1])}"</em>`,
        `(b) Explain why this headline may be unrealistic.`
      ];
      bq = [
        `${ctx.subject.charAt(0).toUpperCase() + ctx.subject.slice(1)}: ${ctx.collector}.`,
        `${startYear}–${lastYear}: declining trend.`,
        `(a) State one reason data might misrepresent true count.`,
        `(b) Explain why newspaper headline based on this data is unrealistic.`
      ];
      a = [
        `<strong>•¹ (a)</strong> ${ctx.reason}`,
        `<strong>•² (b)</strong> ${ctx.headlineReason}`
      ];
      finalAns = `(a) Data collection method bias. (b) Linear extrapolation is unrealistic.`;
    } else if (variation === 5) {
      // Suggest appropriate statistical test for two proportions — 2022 Q3(c) pattern (S6)
      // •³ state appropriate test: z-test for two proportions (chi-squared also acceptable)
      const proportionContexts = [
        {
          scenario: "A researcher wants to determine if there is a difference in the proportion of dogs with a flea infestation between urban and rural areas.",
          groupA: "urban clinic", groupB: "rural clinic",
          condition: "flea infestation",
        },
        {
          scenario: "A public health officer wants to determine if there is a difference in the proportion of adults who received a flu vaccination between two council areas.",
          groupA: "Strathmore Council", groupB: "Grampian Council",
          condition: "flu vaccination",
        },
        {
          scenario: "A researcher wants to determine if there is a difference in the proportion of pupils achieving an A grade between two schools.",
          groupA: "Glencoe Academy", groupB: "Cairn View Academy",
          condition: "A grade",
        },
        {
          scenario: "A quality control manager wants to determine if there is a difference in the defect rate between two production lines.",
          groupA: "Production Line A", groupB: "Production Line B",
          condition: "defect",
        },
        {
          scenario: "A researcher wants to determine if there is a difference in the proportion of patients who recovered within two weeks between a treatment group and a control group.",
          groupA: "treatment group", groupB: "control group",
          condition: "recovery within two weeks",
        },
      ];
      const ctx5 = proportionContexts[getRandomInt(0, proportionContexts.length - 1)];
      const nA = getRandStep(100, 350, 10);
      const nB = getRandStep(80, 300, 10);
      const pA = getRandStep(10, 40, 5);    // percent with condition, group A
      const pB = getRandStep(15, 45, 5);    // percent with condition, group B (different range → different proportions)
      const xA = Math.round(nA * pA / 100);
      const xB = Math.round(nB * pB / 100);

      const tableHtml5 = `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead><tr>
    <th class="border border-slate-300 p-2 text-left">Group</th>
    <th class="border border-slate-300 p-2 text-left">Number inspected</th>
    <th class="border border-slate-300 p-2 text-left">Number with ${ctx5.condition}</th>
  </tr></thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2">${ctx5.groupA.charAt(0).toUpperCase() + ctx5.groupA.slice(1)}</td><td class="border border-slate-300 p-2">${nA}</td><td class="border border-slate-300 p-2">${xA}</td></tr>
    <tr><td class="border border-slate-300 p-2">${ctx5.groupB.charAt(0).toUpperCase() + ctx5.groupB.slice(1)}</td><td class="border border-slate-300 p-2">${nB}</td><td class="border border-slate-300 p-2">${xB}</td></tr>
  </tbody>
</table>`;

      q = [
        ctx5.scenario,
        `The following data was collected:`,
        tableHtml5,
        `State a statistical test that would be appropriate to determine whether this data provides evidence of a difference in the proportion with ${ctx5.condition} between the ${ctx5.groupA} and the ${ctx5.groupB}.`
      ];
      bq = [
        `Compare proportion of '${ctx5.condition}' between ${ctx5.groupA} (${xA}/${nA}) and ${ctx5.groupB} (${xB}/${nB}).`,
        `State the appropriate statistical test.`
      ];
      a = [
        `<strong>•¹</strong> z-test for two proportions.`,
        `(A chi-squared test would also be acceptable.)`
      ];
      finalAns = `z-test for two proportions`;
    }
  } else if (selectedTopic === "Descriptive Statistics & Distributions") {
    const variation = getRandomInt(1, 8);
    if (variation === 1) {
      const variables = ["honey yield", "reaction time", "salary"];
      const subjects = ["modern beehives", "clinical trial participants", "company employees"];
      const idx = getRandomInt(0, 2);
      
      q = [
        `A scientist collects data on the ${variables[idx]} of ${subjects[idx]}.`,
        `A histogram of the data shows that the distribution has a long tail extending to the right.`,
        `(a) Describe the shape of this distribution.`,
        `(b) State whether the mean or the median is the most appropriate measure of location for this data. Give a reason for your answer.`
      ];
      bq = [
        `Data on ${variables[idx]} of ${subjects[idx]}.`,
        `Histogram shows a long tail extending to the right.`,
        `(a) Describe the shape. (b) State whether the mean or median is more appropriate, with a reason.`
      ];
      
      a = [
        `<strong>(a)</strong> Positively skewed (or skewed to the right).`,
        `<strong>(b)</strong> The median. Reason: Because the data is skewed, the extreme outliers in the long right tail will pull and distort the mean. The median is resistant to these outliers.`
      ];
      finalAns = `(a) Positively skewed (b) Median`;
    } else if (variation === 2) {
      const items = ["driving distances of golf balls", "lifespans of honeybees in days"];
      const item = items[getRandomInt(0, 1)];
      const medA = getRandomInt(150, 200);
      const iqrA = getRandomInt(15, 30);
      const medB = medA + getRandomInt(10, 30);
      const iqrB = iqrA - getRandomInt(5, 10);
      
      q = [
        `Two samples of ${item} are tested.`,
        `Group A has a median of ${medA} and an interquartile range of ${iqrA}.`,
        `Group B has a median of ${medB} and an interquartile range of ${iqrB}.`,
        `Make two valid comparisons about the ${item} in Group A and Group B.`
      ];
      bq = [
        `Sample data for ${item}:`,
        `Group A: Median = ${medA}, IQR = ${iqrA}.`,
        `Group B: Median = ${medB}, IQR = ${iqrB}.`,
        `Make two valid comparisons.`
      ];
      
      a = [
        `<strong>Comparison 1:</strong> On average, the ${item} in Group B is higher because its median (${medB}) is greater than Group A's median (${medA}).`,
        `<strong>Comparison 2:</strong> The ${item} in Group B is more consistent (less varied) because its interquartile range (${iqrB}) is smaller than Group A's interquartile range (${iqrA}).`
      ];
      finalAns = `Group B is higher on average and more consistent`;
    } else if (variation === 3) {
      const variables = ["regional honey yield", "school exam pass rates", "hospital admissions"];
      const item = variables[getRandomInt(0, 2)];
      const startPlot = getRandomInt(5, 15) * 10000;
      
      q = [
        `A newspaper publishes a bar chart showing a drop in ${item} from 2024 to 2025.`,
        `The y-axis of the chart begins at ${startPlot.toLocaleString()} instead of 0.`,
        `State one reason why this statistical diagram is misleading.`
      ];
      
      a = [
        `"The y-axis does not start at zero (it is a truncated axis).`,
        `This artificially exaggerates the visual difference between the bars, making a small decrease look like a massive/catastrophic drop."`
      ];
      finalAns = `Truncated axis exaggerates differences`;
    } else if (variation === 4) {
      // Comparative boxplot: which group has smaller IQR — 2025 Q9(a) pattern (S12)
      // SVG horizontal comparative boxplots; answer: group with smaller IQR has least variability
      const bpContexts = [
        { measurement: "mass (g)", subjects: "chicks", groupType: "feed type", groupA: "Feed type A", groupB: "Feed type B", centerRange: [150, 260] },
        { measurement: "height (cm)", subjects: "bean plants", groupType: "fertiliser", groupA: "Fertiliser A", groupB: "Fertiliser B", centerRange: [18, 45] },
        { measurement: "battery life (hours)", subjects: "batteries", groupType: "brand", groupA: "Brand A", groupB: "Brand B", centerRange: [8, 18] },
        { measurement: "reaction time (ms)", subjects: "participants", groupType: "treatment", groupA: "Treatment A", groupB: "Treatment B", centerRange: [200, 400] },
      ];
      const bpCtx = bpContexts[getRandomInt(0, bpContexts.length - 1)];
      const [cMin, cMax] = bpCtx.centerRange;

      // Answer-first: pick IQR for each group, guaranteeing one is smaller
      const iqrSmall = getRandStep(8, 20, 2);
      const iqrLarge = iqrSmall + getRandStep(12, 30, 2);
      // Randomly assign which group gets the smaller IQR
      const aSmaller = Math.random() < 0.5;
      const iqrA = aSmaller ? iqrSmall : iqrLarge;
      const iqrB = aSmaller ? iqrLarge : iqrSmall;

      const cenA = getRandStep(cMin, cMax, 2);
      const cenB = getRandStep(cMin, cMax, 2);
      const q1A = cenA - Math.round(iqrA / 2);
      const q3A = q1A + iqrA;
      const q1B = cenB - Math.round(iqrB / 2);
      const q3B = q1B + iqrB;
      const wA1 = getRandStep(4, 12, 2);
      const wA2 = getRandStep(4, 12, 2);
      const wB1 = getRandStep(6, 18, 2);
      const wB2 = getRandStep(6, 18, 2);
      const minA = q1A - wA1;
      const maxA = q3A + wA2;
      const minB = q1B - wB1;
      const maxB = q3B + wB2;

      // SVG parameters
      const svgW = 380, svgH = 175;
      const mL = 90, mR = 18, mT = 22, mB = 38;
      const plotW = svgW - mL - mR;
      const xDataMin = Math.min(minA, minB) - 2;
      const xDataMax = Math.max(maxA, maxB) + 2;
      const xScale = (v: number) => mL + ((v - xDataMin) / (xDataMax - xDataMin)) * plotW;

      // Group y-centres (two rows)
      const yA = mT + 28;
      const yB = mT + 78;
      const boxH = 22;
      const capH = 10;

      const drawBox = (min: number, q1: number, med: number, q3: number, max: number, yc: number, col: string) => {
        const x1 = xScale(min).toFixed(1), xq1 = xScale(q1).toFixed(1);
        const xm = xScale(med).toFixed(1), xq3 = xScale(q3).toFixed(1);
        const x4 = xScale(max).toFixed(1);
        const yTop = (yc - boxH / 2).toFixed(1), yBot = (yc + boxH / 2).toFixed(1);
        const yCap1 = (yc - capH / 2).toFixed(1), yCap2 = (yc + capH / 2).toFixed(1);
        return [
          `<rect x="${xq1}" y="${yTop}" width="${(xScale(q3) - xScale(q1)).toFixed(1)}" height="${boxH}" fill="${col}" fill-opacity="0.25" stroke="${col}" stroke-width="1.5"/>`,
          `<line x1="${xm}" y1="${yTop}" x2="${xm}" y2="${yBot}" stroke="${col}" stroke-width="2"/>`,
          `<line x1="${x1}" y1="${yc.toFixed(1)}" x2="${xq1}" y2="${yc.toFixed(1)}" stroke="${col}" stroke-width="1.5" stroke-dasharray="3,2"/>`,
          `<line x1="${xq3}" y1="${yc.toFixed(1)}" x2="${x4}" y2="${yc.toFixed(1)}" stroke="${col}" stroke-width="1.5" stroke-dasharray="3,2"/>`,
          `<line x1="${x1}" y1="${yCap1}" x2="${x1}" y2="${yCap2}" stroke="${col}" stroke-width="1.5"/>`,
          `<line x1="${x4}" y1="${yCap1}" x2="${x4}" y2="${yCap2}" stroke="${col}" stroke-width="1.5"/>`,
        ].join("");
      };

      // Axis ticks — pick 5–6 evenly spaced
      const tickInterval = Math.ceil((xDataMax - xDataMin) / 5 / 5) * 5;
      const firstTick = Math.ceil(xDataMin / tickInterval) * tickInterval;
      const ticks: number[] = [];
      for (let t = firstTick; t <= xDataMax; t += tickInterval) ticks.push(t);

      const axisY = (mT + svgH - mB + 5).toFixed(1);
      const ticksHtml = ticks.map(t =>
        `<line x1="${xScale(t).toFixed(1)}" y1="${axisY}" x2="${xScale(t).toFixed(1)}" y2="${(Number(axisY) + 4).toFixed(1)}" stroke="#666" stroke-width="1"/>` +
        `<text x="${xScale(t).toFixed(1)}" y="${(Number(axisY) + 14).toFixed(1)}" text-anchor="middle" font-size="10" fill="#333">${t}</text>`
      ).join("");

      const bpSvg = `<div class="overflow-x-auto my-4 flex justify-center">
<svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="${(mL - 6).toFixed(1)}" y="${(yA + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#333">${bpCtx.groupA}</text>
  <text x="${(mL - 6).toFixed(1)}" y="${(yB + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#333">${bpCtx.groupB}</text>
  ${drawBox(minA, q1A, cenA, q3A, maxA, yA, "#10b981")}
  ${drawBox(minB, q1B, cenB, q3B, maxB, yB, "#6366f1")}
  <line x1="${mL}" y1="${axisY}" x2="${(mL + plotW).toFixed(1)}" y2="${axisY}" stroke="#666" stroke-width="1.2"/>
  ${ticksHtml}
  <text x="${(mL + plotW / 2).toFixed(1)}" y="${(svgH - 4).toFixed(1)}" text-anchor="middle" font-size="11" fill="#555">${bpCtx.measurement}</text>
</svg>
</div>`;

      const winnerLabel = aSmaller ? bpCtx.groupA : bpCtx.groupB;
      const winnerIQR   = aSmaller ? iqrA : iqrB;
      const loserIQR    = aSmaller ? iqrB : iqrA;

      q = [
        `A study was conducted to compare the effect of two ${bpCtx.groupType}s on the ${bpCtx.measurement} of ${bpCtx.subjects}.`,
        `The comparative boxplot below summarises the data collected.`,
        bpSvg,
        `(a) Explain which ${bpCtx.groupType} results in ${bpCtx.subjects} with the least variability in ${bpCtx.measurement}.`,
        `(b) State the hypothesis test that would be appropriate to determine whether there is a significant difference in the mean ${bpCtx.measurement} of the two groups.`
      ];
      bq = [
        `Comparative boxplot: ${bpCtx.groupA} vs ${bpCtx.groupB}.`,
        `(a) Which group has the least variability? Give a reason.`,
        `(b) State the appropriate hypothesis test to compare means.`
      ];
      a = [
        `<strong>•¹ (a)</strong> ${winnerLabel} — it has a smaller IQR (${winnerIQR} compared to ${loserIQR} for the other group), so the ${bpCtx.measurement} values are more tightly clustered around the median.`,
        `<strong>(b)</strong> (Two-sample) t-test.`
      ];
      finalAns = `(a) ${winnerLabel} (smaller IQR = ${winnerIQR}) (b) Two-sample t-test`;

    } else if (variation === 5) {
      // V5: SVG histogram + shape + appropriate measure — 2025 Q5(a) pattern (S11)
      const histCtxs = [
        { variable: "hours studied per week",  unit: "hours",   subjects: "students",       bw: 5,  start: 0, numBins: 5 },
        { variable: "commute time",            unit: "minutes", subjects: "workers",        bw: 10, start: 0, numBins: 6 },
        { variable: "exercise session length", unit: "minutes", subjects: "gym members",    bw: 10, start: 0, numBins: 5 },
        { variable: "sleep duration",          unit: "hours",   subjects: "adults surveyed",bw: 1,  start: 4, numBins: 6 },
      ];
      const hCtx = histCtxs[getRandomInt(0, histCtxs.length - 1)];
      const isRight = Math.random() < 0.6;   // 60% right-skewed (more common in SQA)
      const peak = 8 + getRandomInt(0, 4);   // tallest bar: 8–12

      // Frequencies: visibly skewed — peak at one end, long tail to the other
      const freqs = Array.from({length: hCtx.numBins}, (_, i) => {
        const k = isRight ? i : (hCtx.numBins - 1 - i);
        return Math.max(1, Math.round(peak * Math.pow(0.52, k)));
      });
      const totalN5 = freqs.reduce((s, f) => s + f, 0);

      // Median via linear interpolation within the containing bin
      const halfN5 = totalN5 / 2;
      let cumF5 = 0, medBin5 = 0, medFrac5 = 0;
      for (let i = 0; i < hCtx.numBins; i++) {
        if (cumF5 + freqs[i] >= halfN5) {
          medBin5 = i; medFrac5 = (halfN5 - cumF5) / freqs[i]; break;
        }
        cumF5 += freqs[i];
      }
      const medVal5 = +(hCtx.start + (medBin5 + medFrac5) * hCtx.bw).toFixed(1);

      // SVG histogram
      const oX5 = 52, oY5 = 22, iW5 = 370, iH5 = 160;
      const bW5 = Math.floor(iW5 / hCtx.numBins);
      const mF5 = Math.max(...freqs);
      const barsSvg = freqs.map((f, i) => {
        const bh = Math.round(f * iH5 / mF5);
        const x = oX5 + i * bW5, y = oY5 + iH5 - bh;
        const lbl = String(hCtx.start + i * hCtx.bw);
        return `<rect x="${x}" y="${y}" width="${bW5 - 1}" height="${bh}" fill="#4b5563"/>` +
               `<text x="${x + bW5 / 2}" y="${oY5 + iH5 + 14}" text-anchor="middle" font-size="11" fill="black">${lbl}</text>`;
      }).join("");
      const yTicks = [0, Math.round(mF5 / 2), mF5].map(v => {
        const y = oY5 + iH5 - Math.round(v * iH5 / mF5);
        return `<text x="${oX5 - 5}" y="${y + 4}" text-anchor="end" font-size="11" fill="black">${v}</text>` +
               `<line x1="${oX5 - 3}" y1="${y}" x2="${oX5}" y2="${y}" stroke="black"/>`;
      }).join("");
      const histSvg5 = `<div class="overflow-x-auto my-4 w-full bg-slate-50 border border-slate-200 p-4 rounded text-black flex justify-center">` +
        `<svg width="${oX5 + iW5 + 25}" height="${oY5 + iH5 + 55}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">` +
        barsSvg + yTicks +
        `<text x="${oX5 + iW5 + 8}" y="${oY5 + iH5 + 14}" font-size="11" fill="black">${hCtx.start + hCtx.numBins * hCtx.bw}</text>` +
        `<line x1="${oX5}" y1="${oY5}" x2="${oX5}" y2="${oY5 + iH5}" stroke="black" stroke-width="1.5"/>` +
        `<line x1="${oX5}" y1="${oY5 + iH5}" x2="${oX5 + iW5 + 10}" y2="${oY5 + iH5}" stroke="black" stroke-width="1.5"/>` +
        `<text x="${oX5 + iW5 / 2}" y="${oY5 + iH5 + 36}" text-anchor="middle" font-size="12" fill="black">${hCtx.variable} (${hCtx.unit})</text>` +
        `<text x="12" y="${oY5 + iH5 / 2}" text-anchor="middle" font-size="12" fill="black" transform="rotate(-90,12,${oY5 + iH5 / 2})">Frequency</text>` +
        `<text x="${oX5 + iW5 / 2}" y="${oY5 - 6}" text-anchor="middle" font-size="12" font-weight="bold" fill="black">Histogram of ${hCtx.variable}</text>` +
        `<text x="${oX5 + iW5 - 2}" y="${oY5 + 14}" text-anchor="end" font-size="11" fill="#555">n = ${totalN5}</text>` +
        `</svg></div>`;

      const shapeLabel5 = isRight ? "positively skewed (skewed to the right)" : "negatively skewed (skewed to the left)";

      q = [
        `A researcher recorded the ${hCtx.variable} of a sample of ${totalN5} ${hCtx.subjects}.`,
        `The histogram below shows the distribution of the data.`,
        histSvg5,
        `(a) Describe the shape of the distribution.`,
        `(b) State the most appropriate measure of location for this data. Give a reason for your choice.`
      ];
      bq = [
        `Histogram of ${hCtx.variable} for ${totalN5} ${hCtx.subjects} provided.`,
        `(a) Describe the distribution shape. (b) Appropriate measure of location + reason.`
      ];
      a = [
        `<strong>•¹</strong> The distribution is <strong>${shapeLabel5}</strong> — long tail to the ${isRight ? "right" : "left"}.`,
        `<strong>•²</strong> The <strong>median</strong> is the most appropriate measure of location.`,
        `Reason: The distribution is skewed, so the mean is pulled towards the long tail and is not representative. The median is resistant to extreme values. Estimated median ≈ ${medVal5} ${hCtx.unit}.`
      ];
      finalAns = `(a) ${shapeLabel5.charAt(0).toUpperCase() + shapeLabel5.slice(1)} (b) Median ≈ ${medVal5} ${hCtx.unit}`;

    } else if (variation === 6) {
      // V6: Compare two groups using mean and SD — T4 (2024 Q6a ii)
      // SQA gives R Studio output with mean + SD for two groups; student makes two valid comparisons
      const v6ctxs = [
        { measurement: "test score", unit: "marks", groupA: "Group A", groupB: "Group B", higher: "better performance", lower: "less variable" },
        { measurement: "plant height", unit: "cm", groupA: "Fertiliser A", groupB: "Fertiliser B", higher: "taller plants on average", lower: "more consistent growth" },
        { measurement: "reaction time", unit: "ms", groupA: "Morning session", groupB: "Afternoon session", higher: "slower reaction times on average", lower: "more consistent times" },
        { measurement: "daily step count", unit: "steps", groupA: "Group A", groupB: "Group B", higher: "more active on average", lower: "more consistent activity" },
        { measurement: "battery life", unit: "hours", groupA: "Brand A", groupB: "Brand B", higher: "longer battery life on average", lower: "more consistent battery life" },
      ];
      const vc6 = v6ctxs[getRandomInt(0, v6ctxs.length - 1)];

      // Generate means ensuring a clear difference
      const meanA6 = getRandStep(40, 90, 2);
      const diff6  = getRandStep(6, 20, 2);
      const aHigher6 = getRandomInt(0, 1) === 1;
      const meanB6 = aHigher6 ? meanA6 - diff6 : meanA6 + diff6;

      // Generate SDs ensuring a clear difference
      const sdSmall6 = getRandStep(4, 12, 1);
      const sdLarge6 = sdSmall6 + getRandStep(4, 10, 1);
      const aMoreConsistent6 = getRandomInt(0, 1) === 1;
      const sdA6 = aMoreConsistent6 ? sdSmall6 : sdLarge6;
      const sdB6 = aMoreConsistent6 ? sdLarge6 : sdSmall6;

      const higherGroup6    = aHigher6 ? vc6.groupA : vc6.groupB;
      const lowerSdGroup6   = aMoreConsistent6 ? vc6.groupA : vc6.groupB;
      const higherMean6     = aHigher6 ? meanA6 : meanB6;
      const lowerMean6      = aHigher6 ? meanB6 : meanA6;
      const lowerSd6        = aMoreConsistent6 ? sdA6 : sdB6;
      const higherSd6       = aMoreConsistent6 ? sdB6 : sdA6;

      q = [
        `The table below shows the mean and standard deviation of ${vc6.measurement} (in ${vc6.unit}) for two groups.`,
        `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm"><thead><tr><th class="border border-slate-300 p-2"></th><th class="border border-slate-300 p-2">${vc6.groupA}</th><th class="border border-slate-300 p-2">${vc6.groupB}</th></tr></thead><tbody><tr><td class="border border-slate-300 p-2">Mean (${vc6.unit})</td><td class="border border-slate-300 p-2 text-center">${meanA6}</td><td class="border border-slate-300 p-2 text-center">${meanB6}</td></tr><tr><td class="border border-slate-300 p-2">Standard Deviation (${vc6.unit})</td><td class="border border-slate-300 p-2 text-center">${sdA6}</td><td class="border border-slate-300 p-2 text-center">${sdB6}</td></tr></tbody></table>`,
        `Make two valid comparisons between the two groups.`
      ];
      bq = [
        `${vc6.groupA}: mean = ${meanA6} ${vc6.unit}, SD = ${sdA6} ${vc6.unit}.`,
        `${vc6.groupB}: mean = ${meanB6} ${vc6.unit}, SD = ${sdB6} ${vc6.unit}.`,
        `Make two valid comparisons between the groups.`
      ];
      a = [
        `<strong>•¹</strong> On average, ${higherGroup6} has a higher ${vc6.measurement} (mean ${higherMean6} ${vc6.unit} compared to ${lowerMean6} ${vc6.unit}), suggesting ${vc6.higher}.`,
        `<strong>•²</strong> ${lowerSdGroup6} is more consistent in ${vc6.measurement} (SD = ${lowerSd6} ${vc6.unit} compared to ${higherSd6} ${vc6.unit}), suggesting ${vc6.lower}.`
      ];
      finalAns = `${higherGroup6} higher mean; ${lowerSdGroup6} smaller SD (more consistent)`;

    } else if (variation === 7) {
      // V7: R Studio — generate mean + SD by group and compare (G23 — 2024 Q6a)
      // Skill: write tapply() commands; read R output; make two comparisons

      const v7ctxs = [
        { ds: "plant_data",   varN: "height",   unit: "cm",      grpV: "treatment", gA: "Control",   gB: "Treatment", ctx: "heights of plants in two treatment groups" },
        { ds: "battery_data", varN: "lifetime", unit: "hours",   grpV: "brand",     gA: "Brand A",   gB: "Brand B",   ctx: "battery lifetimes for two brands" },
        { ds: "exam_data",    varN: "score",    unit: "marks",   grpV: "class",     gA: "Class A",   gB: "Class B",   ctx: "exam scores for two classes" },
        { ds: "run_data",     varN: "time",     unit: "seconds", grpV: "group",     gA: "Group 1",   gB: "Group 2",   ctx: "running times for two training groups" },
      ];
      const vc7 = v7ctxs[getRandomInt(0, 3)];

      const meanA7  = getRandStep(40, 90, 2);
      const diff7   = getRandStep(5, 18, 1);
      const aHi7    = getRandomInt(0, 1) === 1;
      const meanB7  = aHi7 ? meanA7 - diff7 : meanA7 + diff7;
      const sdSm7   = getRandStep(4, 10, 1);
      const sdLg7   = sdSm7 + getRandStep(3, 8, 1);
      const aCon7   = getRandomInt(0, 1) === 1;
      const sdA7    = aCon7 ? sdSm7 : sdLg7;
      const sdB7    = aCon7 ? sdLg7 : sdSm7;

      const hiGrp7  = aHi7 ? vc7.gA : vc7.gB;
      const loGrp7  = aHi7 ? vc7.gB : vc7.gA;
      const hiMean7 = aHi7 ? meanA7 : meanB7;
      const loMean7 = aHi7 ? meanB7 : meanA7;
      const conGrp7 = aCon7 ? vc7.gA : vc7.gB;
      const conSd7  = aCon7 ? sdA7 : sdB7;
      const lcGrp7  = aCon7 ? vc7.gB : vc7.gA;
      const lcSd7   = aCon7 ? sdB7 : sdA7;

      const rOut7 = `<pre class="bg-slate-800 text-green-300 p-3 rounded text-sm text-left my-3 overflow-x-auto">> tapply(${vc7.ds}$${vc7.varN}, ${vc7.ds}$${vc7.grpV}, mean)\n  ${vc7.gA.padEnd(10)} ${vc7.gB}\n  ${meanA7.toFixed(3).padEnd(10)} ${meanB7.toFixed(3)}\n\n> tapply(${vc7.ds}$${vc7.varN}, ${vc7.ds}$${vc7.grpV}, sd)\n  ${vc7.gA.padEnd(10)} ${vc7.gB}\n  ${sdA7.toFixed(6).padEnd(10)} ${sdB7.toFixed(6)}</pre>`;

      q = [
        `A study compares the ${vc7.ctx}.`,
        `The data is stored in a CSV file with columns: <code>${vc7.varN}</code> (${vc7.unit}) and <code>${vc7.grpV}</code>.`,
        `<strong>You must complete parts (a) and (b) using RStudio.</strong>`,
        `(a) Write an appropriate R command to generate the mean ${vc7.varN} for each ${vc7.grpV}.`,
        `(b) Write an appropriate R command to generate the standard deviation for each ${vc7.grpV}.`,
        `The RStudio output is shown below:`,
        rOut7,
        `(c) Make two valid comparisons about the ${vc7.varN} for the two groups.`
      ];
      bq = [
        `${vc7.ctx} — dataset <code>${vc7.ds}</code>, variable <code>${vc7.varN}</code>, group <code>${vc7.grpV}</code>.`,
        `(a) R command for mean by group. (b) R command for SD by group.`,
        `Output: ${vc7.gA} mean=${meanA7} SD=${sdA7} | ${vc7.gB} mean=${meanB7} SD=${sdB7}. (c) Two comparisons.`
      ];
      a = [
        `<strong>(a)</strong> <code>tapply(${vc7.ds}$${vc7.varN}, ${vc7.ds}$${vc7.grpV}, mean)</code>`,
        `<strong>(b)</strong> <code>tapply(${vc7.ds}$${vc7.varN}, ${vc7.ds}$${vc7.grpV}, sd)</code>`,
        `<strong>(c) •¹</strong> On average, ${hiGrp7} has a higher ${vc7.varN} (mean ${hiMean7} ${vc7.unit} vs ${loMean7} ${vc7.unit} for ${loGrp7}).`,
        `<strong>•²</strong> ${conGrp7} has more consistent ${vc7.varN} values (SD = ${conSd7} ${vc7.unit} vs ${lcSd7} ${vc7.unit} for ${lcGrp7}).`
      ];
      finalAns = `(a) tapply(…mean) (b) tapply(…sd) (c) ${hiGrp7} higher mean; ${conGrp7} smaller SD`;

    } else if (variation === 8) {
      // V8: R Studio — construct histogram + describe shape + choose location measure (G24 — 2025 Q5a)
      // Skill: hist() command; skew description; median vs mean based on distribution shape

      type V8Ctx = { ds: string; varN: string; unit: string; ctx: string; skewDir: string; shapeLabel: string };
      const v8ctxs: V8Ctx[] = [
        { ds: "survey_data", varN: "hours", unit: "hours", ctx: "hours per week spent on social media by a sample of teenagers", skewDir: "right", shapeLabel: "positively skewed (skewed to the right)" },
        { ds: "salary_data", varN: "salary", unit: "£", ctx: "annual salaries in a company", skewDir: "right", shapeLabel: "positively skewed (skewed to the right)" },
        { ds: "commute_data", varN: "time", unit: "minutes", ctx: "commute times for employees at a city office", skewDir: "right", shapeLabel: "positively skewed (skewed to the right)" },
        { ds: "score_data", varN: "score", unit: "marks", ctx: "test scores where most students performed well but a few struggled", skewDir: "left", shapeLabel: "negatively skewed (skewed to the left)" },
      ];
      const vc8 = v8ctxs[getRandomInt(0, 3)];

      q = [
        `A researcher collects data on the ${vc8.ctx}.`,
        `The data is stored in a CSV file with column <code>${vc8.varN}</code>.`,
        `<strong>You must complete parts (i) and (iii) using RStudio.</strong>`,
        `(i) Write an appropriate R command to construct a histogram to summarise the data.`,
        `(ii) The histogram shows the data is ${vc8.shapeLabel}. Describe the shape of the distribution.`,
        `(iii) Hence write an appropriate R command to generate and state the appropriate measure of location to summarise the data.`
      ];
      bq = [
        `${vc8.ctx} — variable <code>${vc8.varN}</code>.`,
        `(i) R command for histogram? (ii) Describe shape. (iii) R command for appropriate measure of location?`
      ];
      a = [
        `<strong>(i)</strong> <code>hist(${vc8.ds}$${vc8.varN})</code>`,
        `<em>(Accept: <code>ggplot(${vc8.ds}, aes(x = ${vc8.varN})) + geom_histogram()</code>)</em>`,
        `<strong>(ii)</strong> The distribution is ${vc8.shapeLabel}. There is a longer tail to the ${vc8.skewDir} — most values are clustered towards the lower end.`,
        `<strong>(iii)</strong> Since the distribution is skewed, use the <strong>median</strong> (not the mean) as the measure of location.`,
        `R command: <code>median(${vc8.ds}$${vc8.varN})</code>`
      ];
      finalAns = `(i) hist() (ii) ${vc8.shapeLabel} (iii) median — <code>median(${vc8.ds}$${vc8.varN})</code>`;
    }
  } else if (selectedTopic === "Correlation and Linear Regression" || selectedTopic === "Correlation and Linear Regression (Software)") {
    const isSoftware = selectedTopic === "Correlation and Linear Regression (Software)";
    const variation = isSoftware ? (Math.random() < 0.5 ? 5 : 6) : getRandomInt(1, 4);
    
    if (variation === 1) {
      const r_val = getRandStep(85, 98, 1) / 100;
      const xVars = ["back squat weight", "honeybee colony size", "hours spent revising"];
      const yVars = ["vertical jump height", "honey yield", "test score"];
      const idx = getRandomInt(0, 2);
      
      q = [
        `A statistical analysis shows a strong positive correlation (r=${r_val.toFixed(2)}) between ${xVars[idx]} and ${yVars[idx]}.`,
        `Based on this, a student claims that manually increasing ${xVars[idx]} will directly cause an increase in ${yVars[idx]}.`,
        `Explain why the statistical analysis does not support this claim.`
      ];
      
      a = [
        `"Correlation does not imply causation.`,
        `A strong relationship indicates they increase together, but does not prove that changing ${xVars[idx]} directly causes the change in ${yVars[idx]} (there may be other confounding variables involved)."`
      ];
      finalAns = `Correlation does not imply causation`;
    } else if (variation === 2) {
      const intercept = getRandStep(500, 900, 1) / 10;
      const slope = getRandStep(35, 65, 1) / 10;
      
      q = [
        `The equation of a regression line is:`,
        `<div class="my-3 text-center">$\\text{calories (kCal)} = ${intercept.toFixed(1)} + ${slope.toFixed(1)} \\times \\text{carbohydrate content (g)}$</div>`,
        `Interpret the slope and intercept parameters in the context of the data.`
      ];
      
      a = [
        `<strong>Slope:</strong> "For every additional 1 gram of carbohydrate content, the number of calories increases by ${slope.toFixed(1)} kCal."`,
        `<strong>Intercept:</strong> "A drink with 0g of carbohydrate content would be estimated to have ${intercept.toFixed(1)} calories."`
      ];
      finalAns = `Interpretations of slope and intercept`;
    } else if (variation === 3) {
      const isExtrapolation = Math.random() < 0.5;
      const contexts = [
        { xLabel: `back squat weight (kg)`, yLabel: `vertical jump height (cm)`, minX: 80, maxX: 160 },
        { xLabel: `hours of sunlight per day`, yLabel: `crop yield (kg)`, minX: 4, maxX: 10 },
        { xLabel: `daily temperature (°C)`, yLabel: `ice cream sales (units)`, minX: 15, maxX: 30 },
        { xLabel: `tyre tread depth (mm)`, yLabel: `stopping distance (m)`, minX: 2, maxX: 8 },
      ];
      const ctx3 = contexts[getRandomInt(0, contexts.length - 1)];
      const testX = isExtrapolation
        ? (Math.random() < 0.5
            ? getRandStep(ctx3.minX - 30, ctx3.minX - 5, 1)   // below range
            : getRandStep(ctx3.maxX + 5, ctx3.maxX + 30, 1))  // above range
        : getRandStep(ctx3.minX + 5, ctx3.maxX - 5, 1);       // inside range
      const predY = getRandStep(300, 800, 5) / 10;

      q = [
        `A regression model was created using data for ${ctx3.xLabel} ranging from ${ctx3.minX} to ${ctx3.maxX}.`,
        `Software predicts that when ${ctx3.xLabel} is ${testX}, ${ctx3.yLabel} will be ${predY.toFixed(1)}.`,
        `Comment on the reliability of this predicted value.`
      ];
      bq = [
        `Model data range: ${ctx3.xLabel} ${ctx3.minX} to ${ctx3.maxX}.`,
        `Prediction: ${ctx3.xLabel} = ${testX} → ${ctx3.yLabel} = ${predY.toFixed(1)}.`,
        `Comment on the reliability of this prediction.`
      ];

      if (isExtrapolation) {
        a = [
          `"The prediction is <strong>unreliable</strong> because ${testX} is outside the range of data used to create the model (${ctx3.minX} to ${ctx3.maxX}).`,
          `This is an extrapolation, so there is no evidence the linear relationship holds beyond the observed data range."`
        ];
        finalAns = `Unreliable — extrapolation outside data range`;
      } else {
        a = [
          `"The prediction is <strong>reliable</strong> because ${testX} is within the range of data used to create the model (${ctx3.minX} to ${ctx3.maxX}).`,
          `This is an interpolation based on the existing linear relationship."`
        ];
        finalAns = `Reliable — interpolation within data range`;
      }
    } else if (variation === 4) {
      const a_val = getRandStep(2, 6, 1) + getRandStep(1, 9, 1) / 10;
      const b_val = getRandStep(-8, -2, 1) / 10;
      const t_val = getRandStep(55, 85, 1) / 10;
      
      q = [
        `A manufacturer has collected data to investigate the relationship between stopping distance (metres) and tread depth (millimetres) of a tyre.`,
        `The equation of the regression line was found to be:`,
        `<div class="my-3 text-center">$\\text{Stopping Distance} = ${a_val.toFixed(2)} ${b_val < 0 ? '-' : '+'} ${Math.abs(b_val).toFixed(2)} \\times \\text{Tread Depth}$</div>`,
        `Estimate the stopping distance for a tyre with a tread depth of ${t_val.toFixed(1)} mm.`
      ];
      bq = [
        `Stopping space and tread depth relationship.`,
        `$\\text{Distance} = ${a_val.toFixed(2)} ${b_val < 0 ? '-' : '+'} ${Math.abs(b_val).toFixed(2)} \\times \\text{Depth}$`,
        `Estimate distance for depth ${t_val.toFixed(1)} mm.`
      ];
      
      const prediction = a_val + b_val * t_val;
      
      a = [
        `<strong>1.</strong> Substitute Tread Depth = ${t_val.toFixed(1)} into the equation.`,
        `<strong>2.</strong> Calculation: ${a_val.toFixed(2)} ${b_val < 0 ? '-' : '+'} (${Math.abs(b_val).toFixed(2)} \\times ${t_val.toFixed(1)})`,
        `<strong>3.</strong> Distance = ${prediction.toFixed(2)} metres`
      ];
      finalAns = `${prediction.toFixed(2)} metres`;
    } else if (variation === 5) {
      // Randomise context so the CSV isn't always squat/jump
      const corrContexts = [
        { xCol: "Back", yCol: "Jump", xLabel: "back squat weight (kg)", yLabel: "vertical jump height (cm)", subject: "trainees", xMin: 80, xMax: 180, xStep: 5, yIntercept: 25, ySlope: 0.38, scenario: "A strength and conditioning coach wants to increase vertical jump height performance in their trainees." },
        { xCol: "Revision", yCol: "Score", xLabel: "hours spent revising", yLabel: "test score (%)", subject: "students", xMin: 1, xMax: 20, xStep: 1, yIntercept: 30, ySlope: 2.8, scenario: "A teacher wants to investigate whether time spent revising is associated with test performance." },
        { xCol: "Temperature", yCol: "Sales", xLabel: "daily temperature (°C)", yLabel: "ice cream sales (units)", subject: "days", xMin: 15, xMax: 32, xStep: 1, yIntercept: -80, ySlope: 12, scenario: "A café owner wants to predict ice cream sales based on the daily temperature." },
        { xCol: "Tread", yCol: "Distance", xLabel: "tyre tread depth (mm)", yLabel: "stopping distance (m)", subject: "tyres tested", xMin: 2, xMax: 9, xStep: 0.5, yIntercept: 65, ySlope: -4.5, scenario: "A road safety researcher is studying the relationship between tyre tread depth and stopping distance." },
      ];
      const cc = corrContexts[getRandomInt(0, corrContexts.length - 1)];
      const n = getRandomInt(18, 28);
      const xVals: number[] = [];
      const yVals: number[] = [];

      for (let i = 0; i < n; i++) {
        const steps = Math.round((cc.xMax - cc.xMin) / cc.xStep);
        const x = Math.round((cc.xMin + getRandomInt(0, steps) * cc.xStep) * 10) / 10;
        const noise = (getRandomInt(-15, 15) / 10) * Math.abs(cc.ySlope) * 1.5;
        const y = Math.round((cc.yIntercept + cc.ySlope * x + noise) * 10) / 10;
        xVals.push(x);
        yVals.push(y);
      }

      // Calculate regression and correlation from actual data
      const sumX = xVals.reduce((acc, v) => acc + v, 0);
      const sumY = yVals.reduce((acc, v) => acc + v, 0);
      const sumXY = xVals.reduce((acc, v, i) => acc + v * yVals[i], 0);
      const sumX2 = xVals.reduce((acc, v) => acc + v * v, 0);
      const sumY2 = yVals.reduce((acc, v) => acc + v * v, 0);
      const b_reg = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const a_reg = (sumY - b_reg * sumX) / n;
      const r_num = n * sumXY - sumX * sumY;
      const r_den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      const r = r_num / r_den;

      // Pick a test x inside the data range for reliable interpolation
      const testX = Math.round((xVals.reduce((a, b) => a + b, 0) / n) * 10) / 10;
      const testY = a_reg + b_reg * testX;

      // Build clean CSV — header row + data rows only
      const csvLines = [`${cc.xCol},${cc.yCol}`, ...xVals.map((x, i) => `${x},${yVals[i]}`)];
      const csvContent = csvLines.join("\n");

      q = [
        cc.scenario,
        `Data for ${n} ${cc.subject} has been provided in the attached CSV file.`,
        `(a) Use statistical software to find the correlation coefficient between ${cc.xLabel} and ${cc.yLabel}.`,
        `(b) Find the equation of the linear regression line for this data.`,
        `(c) Estimate the ${cc.yLabel} when the ${cc.xLabel} is ${testX}. Show that this is consistent with your regression equation.`
      ];
      bq = [
        cc.scenario,
        `CSV attached. ${n} ${cc.subject}.`,
        `(a) Find correlation coefficient.`,
        `(b) Find regression equation.`,
        `(c) Estimate ${cc.yLabel} at ${cc.xLabel} = ${testX}.`
      ];

      a = [
        `<strong>(a)</strong> Using R: <code>cor.test(data$${cc.xCol}, data$${cc.yCol})</code> → $r \\approx ${r.toFixed(3)}$`,
        `<strong>(b)</strong> Using R: <code>lm(${cc.yCol} ~ ${cc.xCol}, data = data)</code> → $y = ${a_reg.toFixed(2)} + ${b_reg.toFixed(2)}x$`,
        `<strong>(c)</strong> Predicted ${cc.yLabel} $= ${a_reg.toFixed(2)} + ${b_reg.toFixed(2)} \\times ${testX} = ${testY.toFixed(1)}$`
      ];
      finalAns = `(a) r=${r.toFixed(3)} (b) y=${a_reg.toFixed(2)}+${b_reg.toFixed(2)}x (c) ${testY.toFixed(1)}`;
      attachments = [{ filename: `${cc.xCol}_Data.csv`, content: csvContent }];

    } else if (variation === 6) {
      // V6: R Studio prediction interval — write predict() command + interpret lwr/upr (G13/T3 — Spec Q8c, 2022 Q7c)
      // Skill: know interval="prediction" syntax; state estimate and interpret bounds

      const v6ctxs = [
        { ds: "data", modelName: "jump_model", xCol: "Back", yCol: "Jump", xLabel: "back squat weight (kg)", yLabel: "vertical jump height (cm)", subject: "trainees", xMin: 80, xMax: 180, a: 7.2, b: 0.36, scenario: "A strength and conditioning coach investigates the relationship between back squat weight (kg) and vertical jump height (cm)." },
        { ds: "data", modelName: "heat_model", xCol: "Moisture", yCol: "Heat", xLabel: "moisture content (%)", yLabel: "heat output (kW)", subject: "woodchip samples", xMin: 15, xMax: 55, a: 7.96, b: -0.06, scenario: "A researcher investigates the relationship between moisture content (%) and heat output (kW) of woodchip." },
        { ds: "data", modelName: "crop_model", xCol: "Rainfall", yCol: "Yield", xLabel: "rainfall (mm)", yLabel: "crop yield (tonnes)", subject: "farms", xMin: 400, xMax: 900, a: 0.8, b: 0.012, scenario: "An agricultural analyst investigates the relationship between annual rainfall (mm) and crop yield (tonnes)." },
        { ds: "data", modelName: "rev_model", xCol: "Hours", yCol: "Score", xLabel: "hours spent revising", yLabel: "exam score (%)", subject: "students", xMin: 2, xMax: 18, a: 32, b: 2.8, scenario: "A teacher investigates the relationship between hours spent revising and exam score (%)." },
      ];
      const vc6 = v6ctxs[getRandomInt(0, 3)];

      // Pick a test x inside the data range
      const testX6 = Math.round((vc6.xMin + (vc6.xMax - vc6.xMin) * (0.4 + Math.random() * 0.2)) * 10) / 10;
      const fit6 = +(vc6.a + vc6.b * testX6).toFixed(2);
      // Plausible half-width: ~12–18% of fit (representative of typical R prediction intervals)
      const hwFrac6 = 0.10 + Math.random() * 0.08;
      const hw6 = Math.max(+(Math.abs(fit6) * hwFrac6).toFixed(2), 0.5);
      const lwr6 = +(fit6 - hw6).toFixed(2);
      const upr6 = +(fit6 + hw6).toFixed(2);

      const rOut6 = `<pre class="bg-slate-800 text-green-300 p-3 rounded text-sm text-left my-3 overflow-x-auto">> predict(${vc6.modelName}, newdata = data.frame(${vc6.xCol} = ${testX6}), interval = "prediction")\n       fit      lwr      upr\n1  ${fit6.toFixed(4)}  ${lwr6.toFixed(4)}  ${upr6.toFixed(4)}</pre>`;

      q = [
        vc6.scenario,
        `The data is stored in a CSV file loaded into R as a data frame called <strong>${vc6.ds}</strong>. The regression model is stored as <strong>${vc6.modelName}</strong>.`,
        `(a) Write the R command to estimate the ${vc6.yLabel} when ${vc6.xLabel} is ${testX6}, and generate a prediction interval for this estimate.`,
        `The R output is shown below:`,
        rOut6,
        `(b) Interpret this output in context.`
      ];
      bq = [
        `${vc6.scenario}`,
        `Model: <code>${vc6.modelName}</code>. Predict at ${vc6.xLabel} = ${testX6}.`,
        `(a) R command for prediction interval? (b) Interpret R output.`
      ];
      a = [
        `<strong>(a)</strong> <code>predict(${vc6.modelName}, newdata = data.frame(${vc6.xCol} = ${testX6}), interval = "prediction")</code>`,
        `<strong>(b)</strong> The estimated ${vc6.yLabel} for ${vc6.xLabel} of ${testX6} is <strong>${fit6}</strong>.`,
        `However, the true value is likely to be between <strong>${lwr6}</strong> and <strong>${upr6}</strong>.`
      ];
      finalAns = `(a) predict(…interval="prediction") (b) estimate=${fit6}; true value likely between ${lwr6} and ${upr6}`;
    }
  } else if (selectedTopic === "Hypothesis Testing & Statistical Software") {
    const variation = getRandomInt(1, 6);
    if (variation === 1) {
      const propContexts = [
        { groupA: "Traditional", groupB: "Modern", outcome: "Exceeds", condition: "exceed the 100,000 bee limit", filename: "hive_data.csv", scenario: `A researcher believes there is a difference in the proportion of traditional and modern beehives that exceed the 100,000 bee limit.` },
        { groupA: "Urban", groupB: "Rural", outcome: "MetTarget", condition: "met the recycling target", filename: "recycling_data.csv", scenario: `A council wants to know if the proportion of households meeting a recycling target differs between urban and rural areas.` },
        { groupA: "GroupA", groupB: "GroupB", outcome: "Improved", condition: "showed improvement", filename: "trial_data.csv", scenario: `A medical researcher wants to know if a new treatment results in a different proportion of patients showing improvement compared to a control group.` }
      ];
      const pc = propContexts[getRandomInt(0, propContexts.length - 1)];
      const nA = getRandStep(80, 150, 5);
      const nB = getRandStep(80, 150, 5);
      const xA = getRandStep(10, 30, 1);
      const xB = getRandStep(5, 25, 1);

      // Generate clean 2-column CSV — Group and outcome (Yes/No)
      const csvRowsA = [
        ...Array(xA).fill(`${pc.groupA},Yes`),
        ...Array(nA - xA).fill(`${pc.groupA},No`)
      ];
      const csvRowsB = [
        ...Array(xB).fill(`${pc.groupB},Yes`),
        ...Array(nB - xB).fill(`${pc.groupB},No`)
      ];
      // Shuffle so it looks like real collected data
      const allRows = [...csvRowsA, ...csvRowsB].sort(() => Math.random() - 0.5);
      const csvContent = `Group,${pc.outcome}\n${allRows.join("\n")}`;

      q = [
        pc.scenario,
        `The data has been provided in the attached file <strong>${pc.filename}</strong>, loaded into R as a data frame called <strong>data</strong>.`,
        `From the data, ${xA} of the ${nA} ${pc.groupA} observations and ${xB} of the ${nB} ${pc.groupB} observations ${pc.condition}.`,
        `(a) State the name of the statistical test that should be used.`,
        `(b) Write down the exact R command required to perform this test.`
      ];
      bq = [
        `${pc.groupA}: ${xA} / ${nA} ${pc.condition}. ${pc.groupB}: ${xB} / ${nB} ${pc.condition}.`,
        `Data in ${pc.filename} (loaded as 'data').`,
        `(a) Name the appropriate statistical test.`,
        `(b) Write the exact R command.`
      ];
      a = [
        `<strong>(a)</strong> A 2-sample test for equality of proportions (or two-proportion z-test).`,
        `<strong>(b)</strong> <code>prop.test(x = c(${xA}, ${xB}), n = c(${nA}, ${nB}))</code>`
      ];
      finalAns = `(b) prop.test(x = c(${xA}, ${xB}), n = c(${nA}, ${nB}))`;
      attachments = [{ filename: pc.filename, content: csvContent }];
    } else if (variation === 2) {
      // p-value < 0.05 → reject H₀ — 2025 Q9(b)(iii) / 2024 Q6(c)(iii) pattern
      const rejectContexts = [
        { scenario: `A two-sample t-test is performed to determine if there is a significant difference in the mean mass of chicks fed on type A feed compared to those fed on type B feed.`, groupDesc: `mean mass of chicks fed on type A and type B feed` },
        { scenario: `A two-sample t-test is performed to determine if there is a significant difference in the mean honey yield between modern and traditional beehives.`, groupDesc: `mean honey yield between modern and traditional beehives` },
        { scenario: `A two-sample t-test is performed to determine if there is a significant difference in the mean daily step count between urban and rural residents.`, groupDesc: `mean daily step count between urban and rural residents` },
        { scenario: `A two-sample t-test is performed to determine if there is a significant difference in the mean driving distance between golfers using a new grip technique and those using a standard technique.`, groupDesc: `mean driving distance between golfers using the new and standard grip technique` }
      ];
      const rc = rejectContexts[getRandomInt(0, rejectContexts.length - 1)];
      const pval = getRandStep(1, 49, 1) / 1000;
      q = [
        rc.scenario,
        `The statistical software generates a p-value of ${pval.toFixed(3)}.`,
        `Interpret the p-value and the result of the hypothesis test in context.`
      ];
      bq = [
        rc.scenario,
        `p-value = ${pval.toFixed(3)}.`,
        `Interpret the p-value and the result in context.`
      ];
      a = [
        `<strong>•¹</strong> Since the p-value (${pval.toFixed(3)}) is less than 0·05, reject the null hypothesis.`,
        `<strong>•²</strong> There is sufficient evidence to suggest there is a significant difference in the ${rc.groupDesc}.`
      ];
      finalAns = `Reject null hypothesis; significant difference in ${rc.groupDesc}`;
    } else if (variation === 3) {
      // Design condition for statistical test — 2022 Q3(d) pattern
      const designContexts = [
        {
          scenario: `A researcher claims the proportion of urban households meeting a recycling target is different from the proportion of rural households meeting the target. A z-test for two proportions is proposed.`,
          condition: `The samples need to be randomly selected (from both groups).`
        },
        {
          scenario: `A researcher claims there is a difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12. A two-sample t-test is proposed.`,
          condition: `The samples need to be randomly selected (from each age group).`
        },
        {
          scenario: `A dietitian claims there is a difference in the mean cholesterol level of patients before and after following a new diet plan. A paired t-test is proposed.`,
          condition: `The differences in cholesterol levels should be approximately normally distributed.`
        },
        {
          scenario: `A manufacturer claims the proportion of faulty items from Machine A is different from that of Machine B. A z-test for two proportions is proposed.`,
          condition: `The samples need to be randomly selected and independent.`
        }
      ];
      const dc = designContexts[getRandomInt(0, designContexts.length - 1)];
      q = [
        dc.scenario,
        `State one condition that must be satisfied for this test to be valid.`
      ];
      bq = [
        dc.scenario,
        `State one condition for the test to be valid.`
      ];
      a = [
        `<strong>•¹</strong> ${dc.condition}`
      ];
      finalAns = dc.condition;
    } else if (variation === 4) {
      const variables = ["time taken to run 100 metres", "reaction time", "battery life"];
      const groupsA = ["pupils aged 10", "amateur athletes", "Brand A laptops"];
      const groupsB = ["pupils aged 12", "professional athletes", "Brand B laptops"];
      const idx = getRandomInt(0, 2);
      const pval = getRandStep(52, 150, 1) / 1000;
      
      q = [
        `A researcher wants to answer the following research question: 'Is there a significant difference in the mean ${variables[idx]} between ${groupsA[idx]} and ${groupsB[idx]}?'`,
        `An appropriate hypothesis test was performed using statistical software and generated a p-value of ${pval.toFixed(3)}.`,
        `Interpret the p-value, and the result of the hypothesis test, in context.`
      ];
      bq = [
        `Testing significant difference in mean ${variables[idx]} between ${groupsA[idx]} and ${groupsB[idx]}.`,
        `A hypothesis test generated a p-value of ${pval.toFixed(3)}.`,
        `Interpret the p-value and the result in context.`
      ];
      
      a = [
        `<strong>•¹</strong> Since the p-value (${pval.toFixed(3)}) is greater than 0·05, fail to reject the null hypothesis.`,
        `<strong>•²</strong> There is insufficient evidence to suggest there is a significant difference in the mean ${variables[idx]} between ${groupsA[idx]} and ${groupsB[idx]}.`
      ];
      finalAns = `Fail to reject null hypothesis; insufficient evidence for difference`;
    } else if (variation === 5) {
      // State null and alternative hypotheses — 2024 Q6(b), 2025 Q9(b)(ii), 2026 Q7(a)(ii)
      // SQA ALWAYS uses two-tailed H₁: "there is a difference" — never one-tailed
      const scenarios = [
        {
          context: `A researcher investigates whether there is a significant difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12.`,
          h0: `There is no difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12.`,
          h1: `There is a difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12.`
        },
        {
          context: `A researcher investigates whether there is a significant difference in the mean mass of chicks fed on type A feed compared to those fed on type B feed.`,
          h0: `There is no difference in the mean mass of chicks fed on type A feed and those fed on type B feed.`,
          h1: `There is a difference in the mean mass of chicks fed on type A feed and those fed on type B feed.`
        },
        {
          context: `A manufacturer claims that the proportion of faulty items produced by Machine A is different from that of Machine B.`,
          h0: `There is no difference in the proportion of faulty items produced by Machine A and Machine B.`,
          h1: `There is a difference in the proportion of faulty items produced by Machine A and Machine B.`
        },
        {
          context: `A school investigates whether there is a significant difference in the mean test score between students who use a revision app and those who do not.`,
          h0: `There is no difference in the mean test score between students who use the revision app and those who do not.`,
          h1: `There is a difference in the mean test score between students who use the revision app and those who do not.`
        },
        {
          context: `A researcher investigates whether there is a significant difference in the mean honey yield between modern and traditional beehives.`,
          h0: `There is no difference in the mean honey yield between modern and traditional beehives.`,
          h1: `There is a difference in the mean honey yield between modern and traditional beehives.`
        },
        {
          context: `A dietitian investigates whether there is a significant difference in the mean cholesterol level of patients before and after following a new diet plan.`,
          h0: `There is no difference in the mean cholesterol level of patients before and after following the diet plan.`,
          h1: `There is a difference in the mean cholesterol level of patients before and after following the diet plan.`
        }
      ];
      const sc = scenarios[getRandomInt(0, scenarios.length - 1)];

      q = [
        sc.context,
        `(a) State the null hypothesis for this test.`,
        `(b) State the alternative hypothesis for this test.`
      ];

      bq = [
        sc.context,
        `(a) State the null hypothesis.`,
        `(b) State the alternative hypothesis.`
      ];

      a = [
        `<strong>(a) Null hypothesis:</strong> ${sc.h0}`,
        `<strong>(b) Alternative hypothesis:</strong> ${sc.h1}`
      ];
      finalAns = `H₀: no difference; H₁: there is a difference`;
    } else if (variation === 6) {
      // t-test R command — paired or independent samples
      const isPaired = Math.random() < 0.5;

      type TTestCtx = { scenario: string; colA: string; colB: string; filename: string; meanA: number; sdA: number; meanB: number; sdB: number; n: number };
      const pairedContexts: TTestCtx[] = [
        { scenario: `A golf instructor wants to know if a new grip technique significantly changes the mean driving distance of their pupils.`, colA: `before`, colB: `after`, filename: `golf_distances.csv`, meanA: 215, sdA: 18, meanB: 221, sdB: 17, n: 20 },
        { scenario: `A physiotherapist tests whether a new treatment reduces mean pain scores in patients.`, colA: `before`, colB: `after`, filename: `pain_scores.csv`, meanA: 6.8, sdA: 1.4, meanB: 4.9, sdB: 1.5, n: 16 },
        { scenario: `A teacher investigates whether a revision session improves mean test scores for the same group of students.`, colA: `pre_test`, colB: `post_test`, filename: `test_scores.csv`, meanA: 54, sdA: 10, meanB: 62, sdB: 9, n: 24 }
      ];
      const indepContexts: TTestCtx[] = [
        { scenario: `A researcher wants to know whether the mean daily step count differs between urban and rural residents.`, colA: `urban`, colB: `rural`, filename: `step_counts.csv`, meanA: 8200, sdA: 1800, meanB: 6500, sdB: 2100, n: 30 },
        { scenario: `A nutritionist investigates whether the mean daily calorie intake differs between two age groups.`, colA: `group_A`, colB: `group_B`, filename: `calorie_intake.csv`, meanA: 2050, sdA: 320, meanB: 1880, sdB: 290, n: 35 },
        { scenario: `A teacher compares mean exam scores between students in two different classes.`, colA: `class_1`, colB: `class_2`, filename: `exam_scores.csv`, meanA: 67, sdA: 12, meanB: 61, sdB: 14, n: 28 }
      ];
      const ctx2 = isPaired
        ? pairedContexts[getRandomInt(0, pairedContexts.length - 1)]
        : indepContexts[getRandomInt(0, indepContexts.length - 1)];

      // Generate synthetic CSV data — clean 2-column format for R
      const genNormal = (mean: number, sd: number) =>
        Math.round((mean + sd * (getRandomInt(-30, 30) / 20)) * 10) / 10;
      const csvRows = Array.from({ length: ctx2.n }, () =>
        `${genNormal(ctx2.meanA, ctx2.sdA)},${genNormal(ctx2.meanB, ctx2.sdB)}`
      );
      const csvContent = `${ctx2.colA},${ctx2.colB}\n${csvRows.join("\n")}`;

      const cmd = isPaired
        ? `t.test(data$${ctx2.colA}, data$${ctx2.colB}, paired = TRUE)`
        : `t.test(data$${ctx2.colA}, data$${ctx2.colB})`;
      const testName = isPaired ? `paired samples t-test` : `independent samples t-test (Welch's t-test)`;

      q = [
        ctx2.scenario,
        `A dataset with ${ctx2.n} observations has been provided in the attached file <strong>${ctx2.filename}</strong>, which has been loaded into R as a data frame called <strong>data</strong>.`,
        `(a) State the name of the appropriate statistical test.`,
        `(b) Write down the exact R command required to perform this test.`
      ];

      bq = [
        ctx2.scenario,
        `Dataset: ${ctx2.filename} (loaded as 'data'). Columns: '${ctx2.colA}' and '${ctx2.colB}'.`,
        `(a) Name the appropriate statistical test.`,
        `(b) Write the exact R command.`
      ];

      a = [
        `<strong>(a)</strong> ${testName.charAt(0).toUpperCase() + testName.slice(1)}.`,
        `<strong>(b)</strong> <code>${cmd}</code>`
      ];
      finalAns = `(b) ${cmd}`;
      attachments = [{ filename: ctx2.filename, content: csvContent }];
    }
  } else if (selectedTopic === "Fermi Estimates & Assumptions") {
    const variation = getRandomInt(1, 5);
    if (variation === 1) {
      const assumedYears = getRandomInt(11, 14);
      const assumedHoursPerDay = getRandomInt(5, 7);
      
      q = [
        `A typical school year in Scotland lasts 190 days.`,
        `Estimate the total number of hours that a typical pupil will spend in school during their entire lifetime. State any assumptions you have made.`
      ];
      
      bq = [
        `School year in Scotland = 190 days.`,
        `Estimate total lifetime school hours for a typical pupil.`,
        `State any assumptions made.`
      ];
      
      const totalHours = 190 * assumedYears * assumedHoursPerDay;
      
      a = [
        `<strong>1.</strong> Assumption 1: Assume a pupil spends ${assumedYears} years in school (1 mark).`,
        `<strong>2.</strong> Assumption 2: Assume a pupil spends ${assumedHoursPerDay} hours per day in school (1 mark).`,
        `<strong>3.</strong> Calculation: 190 \\times ${assumedYears} \\times ${assumedHoursPerDay} = ${totalHours} hours (1 mark).`
      ];
      finalAns = `Estimate: ${totalHours.toLocaleString()} hours (based on assumptions)`;
    } else if (variation === 2) {
      const dailyFood = getRandomInt(25, 35);
      const assumedYears = getRandomInt(20, 40);
      const assumedPercent = getRandomInt(1, 49);
      
      q = [
        `A typical adult mountain gorilla eats ${dailyFood} kg of food per day.`,
        `Estimate the maximum amount of termites and ants (in kg) that a typical mountain gorilla will eat during their adult lifetime. State any assumptions you have made.`
      ];
      
      bq = [
        `Adult mountain gorilla eats ${dailyFood} kg food/day.`,
        `Estimate max amount of termites/ants (kg) eaten over adult lifetime.`,
        `State any assumptions made.`
      ];
      
      const lifetimeTotal = dailyFood * 365 * assumedYears;
      const finalEstimate = lifetimeTotal * (assumedPercent / 100);
      
      a = [
        `<strong>1.</strong> Assumption 1: Assume adult lifespan is ${assumedYears} years.`,
        `<strong>2.</strong> Calculate total food: ${dailyFood} \\times 365 \\times ${assumedYears} = ${lifetimeTotal.toLocaleString()} kg (1 mark).`,
        `<strong>3.</strong> Assumption 2: Assume termites and ants make up a maximum of ${assumedPercent}% of diet (1 mark).`,
        `<strong>4.</strong> Calculation: ${lifetimeTotal.toLocaleString()} \\times (${assumedPercent} / 100) = ${finalEstimate.toLocaleString()} kg (1 mark).`
      ];
      finalAns = `Estimate: ${finalEstimate.toLocaleString()} kg (based on assumptions)`;
    } else if (variation === 3) {
      const items = ["cans of fruit drink", "bottles of honey", "car tyres"];
      const item = items[getRandomInt(0, 2)];
      const rate = getRandStep(40, 120, 5);
      const assumedHours = getRandomInt(8, 24);
      const assumedDays = getRandomInt(250, 365);
      
      q = [
        `A factory produces ${item} at a constant rate of ${rate} items per minute.`,
        `The factory can only produce items when there are staff present.`,
        `Estimate how many ${item} the factory can produce in one year. State any assumptions you have made.`
      ];
      
      bq = [
        `Factory produces ${item} at ${rate} items/minute.`,
        `Production only happens when staff are present.`,
        `Estimate yearly production and state your assumptions.`
      ];
      
      const hourlyRate = rate * 60;
      const totalYearlyItems = hourlyRate * assumedHours * assumedDays;
      
      a = [
        `<strong>1.</strong> Items per hour: ${rate} \\times 60 = ${hourlyRate.toLocaleString()}.`,
        `<strong>2.</strong> Assumptions: Assume staff work ${assumedHours} hours a day, for ${assumedDays} days a year (1 mark).`,
        `<strong>3.</strong> Calculation: ${hourlyRate.toLocaleString()} \\times ${assumedHours} \\times ${assumedDays} = ${totalYearlyItems.toLocaleString()} (1 mark).`
      ];
      finalAns = `Estimate: ${totalYearlyItems.toLocaleString()} (based on assumptions)`;
    } else if (variation === 4) {
      const portionsPerDay = getRandomInt(2, 6);
      const yearsAsChild = getRandomInt(16, 18);
      
      q = [
        `Estimate the total number of portions of fruit and vegetables that a typical person eats during their childhood.`,
        `State any assumptions you make.`
      ];
      
      bq = [
        `Estimate total portions of fruit/veg eaten during childhood.`,
        `State your assumptions.`
      ];
      
      const totalPortions = portionsPerDay * 365 * yearsAsChild;
      
      a = [
        `<strong>1.</strong> Assumption 1: Assume a person eats ${portionsPerDay} portions of fruit and vegetables per day.`,
        `<strong>2.</strong> Assumption 2: Assume childhood lasts for ${yearsAsChild} years.`,
        `<strong>3.</strong> Assumption 3: Assume there are 365 days in a year (excluding leap years for simplicity).`,
        `<strong>4.</strong> Calculation: ${portionsPerDay} \\times 365 \\times ${yearsAsChild} = ${totalPortions.toLocaleString()} portions.`
      ];
      finalAns = `${totalPortions.toLocaleString()} portions (based on assumptions)`;

    } else if (variation === 5) {
      // V5: Scale per-unit CO₂ rate to a fleet (G16 — 2023 Q10a)
      const fleetContexts5 = [
        { vehicle: "delivery van", company: "A delivery company", fleet: [12, 16, 20, 24][getRandomInt(0, 3)], rate: [0.18, 0.20, 0.22, 0.25][getRandomInt(0, 3)], km: [1200, 1500, 1800, 2000][getRandomInt(0, 3)], period: "month" },
        { vehicle: "bus", company: "A bus operator", fleet: [8, 10, 12, 15][getRandomInt(0, 3)], rate: [0.55, 0.60, 0.65, 0.70][getRandomInt(0, 3)], km: [3000, 3500, 4000, 4500][getRandomInt(0, 3)], period: "month" },
        { vehicle: "lorry", company: "A logistics firm", fleet: [6, 8, 10, 12][getRandomInt(0, 3)], rate: [0.80, 0.90, 1.00, 1.10][getRandomInt(0, 3)], km: [2000, 2500, 3000, 3500][getRandomInt(0, 3)], period: "month" },
      ];
      const fc5 = fleetContexts5[getRandomInt(0, fleetContexts5.length - 1)];
      const totalCO2_5 = +(fc5.rate * fc5.km * fc5.fleet).toFixed(1);
      q = [
        `A survey found that a ${fc5.vehicle} emits, on average, ${fc5.rate} kg of CO₂ per km.`,
        `${fc5.company} has a fleet of ${fc5.fleet} ${fc5.vehicle}s. Each ${fc5.vehicle} travels ${fc5.km.toLocaleString()} km per ${fc5.period}.`,
        `Calculate the total CO₂ emissions of the fleet per ${fc5.period}.`
      ];
      bq = [
        `${fc5.vehicle}: ${fc5.rate} kg CO₂/km. Fleet: ${fc5.fleet} vehicles × ${fc5.km.toLocaleString()} km/${fc5.period}.`,
        `Find total fleet CO₂ per ${fc5.period}.`
      ];
      a = [
        `<strong>•¹</strong> CO₂ per vehicle per ${fc5.period} = ${fc5.rate} × ${fc5.km.toLocaleString()} = ${(fc5.rate * fc5.km).toLocaleString()} kg`,
        `<strong>•²</strong> Total fleet CO₂ = ${(fc5.rate * fc5.km).toLocaleString()} × ${fc5.fleet} = <strong>${totalCO2_5.toLocaleString()} kg</strong>`
      ];
      finalAns = `${totalCO2_5.toLocaleString()} kg CO₂ per ${fc5.period}`;
    }
  } else if (selectedTopic === "Functions, Graphs & Rates of Change") {
    const variation = getRandomInt(1, 10);
    if (variation === 1) {
      const shapes = ["spherical", "cylindrical (vertical)", "cylindrical (horizontal) with hemispherical ends"];
      const shape = shapes[getRandomInt(0, 2)];

      // Container shape SVG
      let containerPath: string;
      if (shape.includes("vertical")) {
        containerPath = `<rect x="60" y="28" width="100" height="138" fill="none" stroke="black" stroke-width="2"/><ellipse cx="110" cy="28" rx="50" ry="13" fill="none" stroke="black" stroke-width="2"/><ellipse cx="110" cy="166" rx="50" ry="13" fill="none" stroke="black" stroke-width="2"/>`;
      } else if (shape === "spherical") {
        containerPath = `<circle cx="110" cy="103" r="76" fill="none" stroke="black" stroke-width="2.5"/>`;
      } else {
        // Horizontal cylinder with hemispherical ends
        containerPath = `<line x1="70" y1="60" x2="150" y2="60" stroke="black" stroke-width="2"/><line x1="70" y1="150" x2="150" y2="150" stroke="black" stroke-width="2"/><path d="M 70,60 A 45,45 0 0 0 70,150" fill="none" stroke="black" stroke-width="2"/><path d="M 150,60 A 45,45 0 0 1 150,150" fill="none" stroke="black" stroke-width="2"/>`;
      }
      const containerLabel = shape.includes("vertical") ? "Vertical cylinder" : shape === "spherical" ? "Sphere" : "Horiz. cylinder";
      const containerSvg = `<div class="overflow-x-auto my-4 w-full flex justify-center">
<svg width="520" height="210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="110" y="14" text-anchor="middle" font-size="11" fill="#374151">Tank shape:</text>
  ${containerPath}
  <text x="110" y="196" text-anchor="middle" font-size="10" fill="#6b7280">(${containerLabel})</text>
  <line x1="222" y1="5" x2="222" y2="205" stroke="#e5e7eb" stroke-width="1"/>
  <text x="370" y="13" text-anchor="middle" font-size="10" fill="#6b7280">Depth (↑) vs Volume (→):</text>
  <line x1="265" y1="70" x2="515" y2="70" stroke="black" stroke-width="1.2"/><line x1="265" y1="25" x2="265" y2="70" stroke="black" stroke-width="1.2"/>
  <text x="249" y="51" text-anchor="middle" font-size="13" font-weight="bold" fill="#111827">A</text>
  <line x1="267" y1="69" x2="513" y2="27" stroke="#10b981" stroke-width="2.5"/>
  <line x1="265" y1="138" x2="515" y2="138" stroke="black" stroke-width="1.2"/><line x1="265" y1="93" x2="265" y2="138" stroke="black" stroke-width="1.2"/>
  <text x="249" y="119" text-anchor="middle" font-size="13" font-weight="bold" fill="#111827">B</text>
  <path d="M 267,137 C 268,98 305,94 513,94" fill="none" stroke="#10b981" stroke-width="2.5"/>
  <line x1="265" y1="205" x2="515" y2="205" stroke="black" stroke-width="1.2"/><line x1="265" y1="160" x2="265" y2="205" stroke="black" stroke-width="1.2"/>
  <text x="249" y="186" text-anchor="middle" font-size="13" font-weight="bold" fill="#111827">C</text>
  <path d="M 267,204 C 268,184 290,183 390,183 C 490,183 512,163 513,161" fill="none" stroke="#10b981" stroke-width="2.5"/>
</svg>
</div>`;

      q = [
        `A liquid is pumped into a completely ${shape} tank at a constant rate.`,
        `The diagram below shows the tank shape and three possible graphs (A, B, C) of how the depth of the liquid varies with the volume pumped in.`,
        containerSvg,
        `Explain which graph could model the depth of liquid in the tank, giving a reason for your answer.`
      ];

      bq = [
        `Liquid pumped into a ${shape} tank at a constant rate.`,
        `Graph A: straight line. Graph B: steep then flattens. Graph C: S-shaped (steep–flat–steep).`,
        `Explain which graph models depth vs volume (with reason).`
      ];

      let explanation = "";
      if (shape.includes("vertical")) {
        explanation = `"Graph A. Because the cross-sectional area is constant throughout, so the depth increases at a constant linear rate for every unit of volume added."`;
        finalAns = `Graph A (Constant cross-section)`;
      } else {
        explanation = `"Graph C. Because the container is narrow at the bottom (depth increases quickly per unit volume), wide in the middle (depth increases slowly), and narrow again at the top (depth increases quickly again)."`;
        finalAns = `Graph C (Narrow–wide–narrow gives S-shape)`;
      }

      a = [`<strong>1.</strong> ${explanation}`];
    } else if (variation === 2) {
      const t1 = getRandStep(5, 15, 5) / 10;
      const v1 = getRandStep(40, 80, 10);
      const t2 = getRandStep(25, 35, 5) / 10;
      const v2 = v1 + getRandomInt(150, 250);
      const diffV = v2 - v1;
      const diffT = Number((t2 - t1).toFixed(1));
      const rate = diffV / diffT;

      // Scatter plot SVG
      const spW = 300, spH = 200, spML = 52, spMR = 15, spMT = 20, spMB = 38;
      const spPW = spW - spML - spMR, spPH = spH - spMT - spMB;
      const spXMax = Math.ceil(t2 * 1.35 * 4) / 4;
      const spYMax = Math.ceil(v2 * 1.2 / 50) * 50;
      const sx = (t: number) => spML + (t / spXMax) * spPW;
      const sy = (v: number) => spH - spMB - (v / spYMax) * spPH;
      const spPts = Array.from({ length: 5 }, (_, i) => {
        const t = t1 + (i / 4) * (t2 - t1);
        return { t, v: rate * t + (v1 - rate * t1) };
      });
      const spMidX = ((spML + spW - spMR) / 2).toFixed(1);
      const spMidY = ((spMT + spH - spMB) / 2).toFixed(1);
      const scatterSvg = `<div class="overflow-x-auto my-4 w-full flex justify-center">
<svg width="${spW}" height="${spH}" xmlns="http://www.w3.org/2000/svg">
  <line x1="${sx(0).toFixed(1)}" y1="${sy(0).toFixed(1)}" x2="${sx(spXMax).toFixed(1)}" y2="${sy(0).toFixed(1)}" stroke="black" stroke-width="1.5"/>
  <line x1="${sx(0).toFixed(1)}" y1="${sy(0).toFixed(1)}" x2="${sx(0).toFixed(1)}" y2="${sy(spYMax).toFixed(1)}" stroke="black" stroke-width="1.5"/>
  <text x="${spMidX}" y="${spH - 6}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="black">Time (s)</text>
  <text x="12" y="${spMidY}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="black" transform="rotate(-90,12,${spMidY})">Volume (ml)</text>
  ${[0, t1, t2].map(t => `<line x1="${sx(t).toFixed(1)}" y1="${sy(0).toFixed(1)}" x2="${sx(t).toFixed(1)}" y2="${(sy(0)+4).toFixed(1)}" stroke="black"/><text x="${sx(t).toFixed(1)}" y="${(sy(0)+14).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="black">${t.toFixed(1)}</text>`).join("")}
  ${[0, v1, v2].map(v => `<line x1="${(sx(0)-4).toFixed(1)}" y1="${sy(v).toFixed(1)}" x2="${sx(0).toFixed(1)}" y2="${sy(v).toFixed(1)}" stroke="black"/><text x="${(sx(0)-6).toFixed(1)}" y="${(sy(v)+4).toFixed(1)}" text-anchor="end" font-family="sans-serif" font-size="10" fill="black">${v}</text>`).join("")}
  <line x1="${sx(spPts[0].t).toFixed(1)}" y1="${sy(spPts[0].v).toFixed(1)}" x2="${sx(spPts[4].t).toFixed(1)}" y2="${sy(spPts[4].v).toFixed(1)}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="4,3"/>
  ${spPts.map(p => `<circle cx="${sx(p.t).toFixed(1)}" cy="${sy(p.v).toFixed(1)}" r="4" fill="#10b981"/>`).join("")}
</svg>
</div>`;

      q = [
        `The scatterplot below shows a perfect linear relationship between time (in seconds) and the volume of a container filling with liquid (in ml).`,
        scatterSvg,
        `At ${t1.toFixed(1)} seconds, the volume is ${v1} ml. At ${t2.toFixed(1)} seconds, the volume is ${v2} ml.`,
        `Determine the rate at which the container is filled. Your answer must include appropriate units.`
      ];

      bq = [
        `Scatterplot: Time (s) vs Volume (ml) shows perfect linear relationship.`,
        `At ${t1.toFixed(1)} s, Volume = ${v1} ml. At ${t2.toFixed(1)} s, Volume = ${v2} ml.`,
        `Determine the rate of filling with appropriate units.`
      ];

      a = [
        `<strong>1.</strong> Gradient formula: \\frac{(${v2} - ${v1})}{(${t2.toFixed(1)} - ${t1.toFixed(1)})}`,
        `<strong>2.</strong> Calculation: ${diffV} / ${diffT.toFixed(1)} = ${rate.toFixed(1)}`,
        `<strong>3.</strong> Units: ${rate.toFixed(1)} ml per second (or ml/s).`
      ];
      finalAns = `${rate.toFixed(1)} ml/s`;
    } else if (variation === 3) {
      q = [
        `A scientist uses a linear regression model to predict the population of a newly introduced species on an island over the next 100 years.`,
        `State one reason why this mathematical model may not be realistic over such a long period.`
      ];
      
      bq = [
        `Linear regression model predicts population growth on an island over the next 100 years.`,
        `State one reason why this model may not be realistic long term.`
      ];
      
      a = [
        `"A linear model assumes the population will continue to increase at a constant rate forever without limits.`,
        `In reality, environmental factors (like a lack of food or space) will eventually restrict growth, meaning the population should level out."`
      ];
      finalAns = `Population growth cannot continue linearly forever (limited resources)`;
    } else if (variation === 4) {
      // Quadratic Optimisation
      const names = ["Aila", "Brody", "Callum", "Eilidh", "Fraser", "Kirsty"];
      const name = names[getRandomInt(0, names.length - 1)];
      const items = ["wax candles", "handmade soaps", "ceramic pots"];
      const item = items[getRandomInt(0, 2)];
      const S = getRandomInt(8, 15);
      const C = getRandomInt(2, 5);
      // Ensure turning point is integer: (S-C) / 2K
      const diffSC = S - C;
      let K: number = 0.05;
      let turningPoint: number = diffSC / (2 * K);
      for (let kTest = 10; kTest <= 50; kTest += 5) {
        const decK = kTest / 1000;
        const testTp = diffSC / (2 * decK);
        if (Number.isInteger(testTp) && testTp > 0) {
          K = decK;
          turningPoint = testTp;
          break;
        }
      }
      
      const maxX = Math.round(turningPoint + 100);

      // Parabola SVG
      const pW = 320, pH = 200, pML = 50, pMR = 20, pMT = 20, pMB = 38;
      const pPlW = pW - pML - pMR, pPlH = pH - pMT - pMB;
      const profit = (x: number) => (S - C) * x - K * x * x;
      const maxProfit = profit(turningPoint);
      const pYMax = Math.ceil(maxProfit * 1.2 / 50) * 50;
      const px = (x: number) => pML + (x / maxX) * pPlW;
      const py = (p: number) => pH - pMB - Math.max(0, p / pYMax) * pPlH;
      // Sample the curve at 60 points
      const parabolaPts = Array.from({ length: 61 }, (_, i) => {
        const x = (i / 60) * maxX;
        return { x, p: profit(x) };
      });
      const curveD = parabolaPts.map((pt, i) =>
        `${i === 0 ? "M" : "L"} ${px(pt.x).toFixed(1)},${py(pt.p).toFixed(1)}`
      ).join(" ");
      // x-axis ticks
      const pXTicks = [0, turningPoint, maxX];
      const pYTicks = [0, Math.round(maxProfit / 2 / 10) * 10, Math.round(maxProfit / 10) * 10].filter((v, i, a) => a.indexOf(v) === i);
      const pMidX = ((pML + pW - pMR) / 2).toFixed(1);
      const pMidY = ((pMT + pH - pMB) / 2).toFixed(1);
      const parabolaSvg = `<div class="overflow-x-auto my-4 w-full flex justify-center">
<svg width="${pW}" height="${pH}" xmlns="http://www.w3.org/2000/svg">
  <line x1="${px(0).toFixed(1)}" y1="${py(0).toFixed(1)}" x2="${px(maxX).toFixed(1)}" y2="${py(0).toFixed(1)}" stroke="black" stroke-width="1.5"/>
  <line x1="${px(0).toFixed(1)}" y1="${py(0).toFixed(1)}" x2="${px(0).toFixed(1)}" y2="${(pMT).toFixed(1)}" stroke="black" stroke-width="1.5"/>
  <path d="${curveD}" fill="none" stroke="#10b981" stroke-width="2"/>
  <line x1="${px(turningPoint).toFixed(1)}" y1="${py(0).toFixed(1)}" x2="${px(turningPoint).toFixed(1)}" y2="${py(maxProfit).toFixed(1)}" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="${px(turningPoint).toFixed(1)}" cy="${py(maxProfit).toFixed(1)}" r="4" fill="#f59e0b"/>
  <text x="${pMidX}" y="${pH - 6}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="black">Number of ${item} (x)</text>
  <text x="12" y="${pMidY}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="black" transform="rotate(-90,12,${pMidY})">Profit (£)</text>
  ${pXTicks.map(x => `<line x1="${px(x).toFixed(1)}" y1="${py(0).toFixed(1)}" x2="${px(x).toFixed(1)}" y2="${(py(0)+4).toFixed(1)}" stroke="black"/><text x="${px(x).toFixed(1)}" y="${(py(0)+14).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="black">${x}</text>`).join("")}
  ${pYTicks.map(v => `<line x1="${(px(0)-4).toFixed(1)}" y1="${py(v).toFixed(1)}" x2="${px(0).toFixed(1)}" y2="${py(v).toFixed(1)}" stroke="black"/><text x="${(px(0)-6).toFixed(1)}" y="${(py(v)+4).toFixed(1)}" text-anchor="end" font-family="sans-serif" font-size="10" fill="black">${v}</text>`).join("")}
</svg>
</div>`;

      q = [
        `${name} owns a small business producing ${item}.`,
        `The total profit is affected by production, storage, and distribution costs. The profit is modelled by the formula:`,
        `<div class="my-3 text-center">$\\text{Profit} = (${S} - ${C})x - ${K.toFixed(3)}x^2$</div>`,
        `where $x$ is the number of ${item} produced and sold.`,
        `The graph below shows this model from $x = 0$ to $x = ${maxX}$.`,
        parabolaSvg,
        `(a) State the type of mathematical model being used.`,
        `(b) Using the model properties, explain what the graph shows when ${name} produces and sells more than ${turningPoint} ${item}.`,
        `(c) State how many ${item} should be produced and sold to maximise profit.`
      ];
      
      bq = [
        `${name} produces ${item}.`,
        `Profit model: <strong>Profit = (${S} - ${C})x - ${K.toFixed(3)}x²</strong>`,
        `($x$ = number produced & sold).`,
        `(a) State model type. (b) Explain graph behavior for $x > ${turningPoint}$. (c) Value of $x$ to maximise profit.`
      ];
      
      a = [
        `<strong>(a)</strong> A quadratic model.`,
        `<strong>(b)</strong> The profit decreases (because it has passed the maximum turning point of the parabola).`,
        `<strong>(c)</strong> ${turningPoint} ${item} (the x-value of the vertex/maximum turning point).`
      ];
      finalAns = `(a) Quadratic (b) Profit decreases (c) ${turningPoint}`;
    } else if (variation === 5) {
      // Exponential growth verification — Spec Q11 / 2022 Q10(a) pattern (M2)
      // SQA method: two equal-interval data points → ratio = multiplying factor → predict one more period
      // MI: •¹ find multiplying factor (pop2/pop1)  •² calculate predicted population and state conclusion
      const contexts5 = [
        { subject: "red squirrels", unit: "red squirrels", claimant: "A conservationist", verb: "increase" },
        { subject: "Atlantic puffin pairs", unit: "nesting pairs", claimant: "A marine biologist", verb: "grow" },
        { subject: "osprey nesting pairs", unit: "pairs", claimant: "A wildlife researcher", verb: "increase" },
        { subject: "beavers", unit: "beavers", claimant: "An ecologist", verb: "rise" },
        { subject: "pine marten sightings", unit: "recorded sightings", claimant: "A researcher", verb: "increase" },
        { subject: "grey seals", unit: "grey seals", claimant: "A marine biologist", verb: "grow" },
      ];
      const ctx5 = contexts5[getRandomInt(0, contexts5.length - 1)];

      // Equal-interval pattern: study1 at yearA, study2 at yearB = yearA + interval, prediction at yearC = yearB + interval
      const interval5  = getRandomInt(3, 6) * 2;       // 6, 8, 10, or 12 years between studies
      const yearA5     = getRandStep(1996, 2012, 2);   // study 1 year
      const yearB5     = yearA5 + interval5;           // study 2 year
      const yearC5     = yearB5 + interval5;           // prediction year (same interval forward)
      const popA5      = getRandStep(300, 1200, 50);   // population at study 1
      // Pick a growth multiplier that gives realistic numbers
      const multOptions = [1.25, 1.30, 1.35, 1.40, 1.45, 1.50, 1.55, 1.60];
      const trueMult5  = multOptions[getRandomInt(0, multOptions.length - 1)];
      const popB5      = Math.round(popA5 * trueMult5 / 10) * 10;  // round to nearest 10
      const predicted5 = Math.round(popB5 * (popB5 / popA5));      // apply same multiplier once more
      // Make expert wrong ~70% of the time (more instructive)
      const expertWrong = Math.random() < 0.70;
      const claimedPop5 = expertWrong
        ? Math.round(predicted5 * (Math.random() < 0.5 ? 1.15 : 0.85) / 10) * 10  // 15% off
        : predicted5 + (Math.random() < 0.5 ? 10 : -10);                           // within rounding
      const isCorrect5  = predicted5 >= claimedPop5;

      q = [
        `A study on the number of ${ctx5.subject} in a region was conducted in ${yearA5} and again in ${yearB5}.`,
        `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm text-center">
  <thead><tr>
    <th class="border border-slate-400 px-4 py-2 bg-slate-100">Year</th>
    <th class="border border-slate-400 px-4 py-2 bg-slate-100">${yearA5}</th>
    <th class="border border-slate-400 px-4 py-2 bg-slate-100">${yearB5}</th>
  </tr></thead>
  <tbody><tr>
    <td class="border border-slate-400 px-4 py-2">Number of ${ctx5.unit}</td>
    <td class="border border-slate-400 px-4 py-2">${popA5.toLocaleString()}</td>
    <td class="border border-slate-400 px-4 py-2">${popB5.toLocaleString()}</td>
  </tr></tbody>
</table>`,
        `${ctx5.claimant} states that if the population of ${ctx5.subject} continues to ${ctx5.verb} exponentially, the number of ${ctx5.unit} will ${ctx5.verb} to ${claimedPop5.toLocaleString()} by ${yearC5}.`,
        `Determine if the ${ctx5.claimant.toLowerCase()}'s statement is correct. Give a reason for your answer.`
      ];
      bq = [
        `${yearA5}: ${popA5.toLocaleString()} ${ctx5.unit}. ${yearB5}: ${popB5.toLocaleString()} ${ctx5.unit}.`,
        `Claim: exponential growth → ${claimedPop5.toLocaleString()} by ${yearC5}.`,
        `Determine if correct using the multiplying factor.`
      ];
      a = [
        `<strong>•¹</strong> Multiplying factor: \\(\\frac{${popB5}}{${popA5}}\\)`,
        `<strong>•²</strong> Predicted population in ${yearC5}: \\(${popB5} \\times \\frac{${popB5}}{${popA5}} \\approx ${predicted5.toLocaleString()}\\)`,
        `The ${ctx5.claimant.toLowerCase()} is <strong>${isCorrect5 ? "correct" : "incorrect"}</strong> since ${predicted5.toLocaleString()} ${isCorrect5 ? "≥" : "<"} ${claimedPop5.toLocaleString()}.`
      ];
      finalAns = `${predicted5.toLocaleString()} (statement ${isCorrect5 ? "correct" : "incorrect"})`;
    } else if (variation === 6) {
      // Quadratic profit spreadsheet model — 2026 Q5 pattern (M9)
      // Spreadsheet: s in C7, c in C8, x-values pre-filled in B11:B(11+n), profit column blank
      // Formula: =ROUND(($C$7-$C$8)*B11-k*B11^2, 2)
      // MI: •¹ setup formula in C11  •² fill down  (b)(i) quadratic  (b)(ii) profit goes negative  (b)(iii) x*

      // Predefined combos — chosen so xStar and breakeven (2*xStar) are multiples of step=25
      // s-c = 2*k*xStar; k tested to give integer xStar
      type Combo6 = { k: number; xStar: number; sc: number; c6: number };
      const combos6: Combo6[] = [
        { k: 0.015, xStar: 200, sc: 6, c6: 3 },   // s=9  (SQA original)
        { k: 0.010, xStar: 200, sc: 4, c6: 2 },   // s=6
        { k: 0.010, xStar: 200, sc: 4, c6: 3 },   // s=7
        { k: 0.020, xStar: 150, sc: 6, c6: 3 },   // s=9
        { k: 0.020, xStar: 150, sc: 6, c6: 2 },   // s=8
        { k: 0.010, xStar: 150, sc: 3, c6: 2 },   // s=5
        { k: 0.012, xStar: 250, sc: 6, c6: 3 },   // s=9
        { k: 0.010, xStar: 250, sc: 5, c6: 3 },   // s=8
        { k: 0.010, xStar: 250, sc: 5, c6: 2 },   // s=7
        { k: 0.020, xStar: 200, sc: 8, c6: 3 },   // s=11
      ];
      const combo6  = combos6[getRandomInt(0, combos6.length - 1)];
      const k6      = combo6.k;
      const xStar6  = combo6.xStar;
      const c6      = combo6.c6;
      const s6      = c6 + combo6.sc;
      const step6   = 25;
      const maxX6   = xStar6 * 2 + step6;          // one step past break-even point
      const kStr6   = k6.toFixed(3);

      const productContexts6 = [
        { product: "Candle", unit: "candle", units: "candles", variant: "scent", season: "summer" },
        { product: "Soap",   unit: "soap bar", units: "soap bars", variant: "fragrance", season: "spring" },
        { product: "Jam",    unit: "jar", units: "jars of jam", variant: "flavour", season: "autumn" },
        { product: "Card",   unit: "card", units: "greeting cards", variant: "design", season: "Christmas" },
        { product: "Mug",    unit: "mug", units: "ceramic mugs", variant: "pattern", season: "winter" },
      ];
      const pCtx6   = productContexts6[getRandomInt(0, productContexts6.length - 1)];
      const names6  = ["Ailsa", "Brooke", "Catriona", "Eilidh", "Fiona", "Kirsty", "Mairi"];
      const name6   = names6[getRandomInt(0, names6.length - 1)];

      // Build x-values array and XLSX rawData
      const xValues6: number[] = [];
      for (let x = 0; x <= maxX6; x += step6) xValues6.push(x);
      const n6Val = (v: number) => ({ t: "n" as const, v });

      // Layout: col A = blank, col B = label/x, col C = value/profit
      // Row 7 (rawData[6]): s → C7 = $C$7 in formula
      // Row 8 (rawData[7]): c → C8 = $C$8 in formula
      // Row 11 (rawData[10]): first x → B11 in formula
      const rawData6: any[][] = [
        ["", "Name:", ""],
        ["", "SCN:", ""],
        ["", "Centre name:", ""],
        [],
        ["", `${name6}'s ${pCtx6.product} Profit Model`],
        [],
        ["", `Selling price per ${pCtx6.unit} (s) (£)`, n6Val(s6)],
        ["", `Cost to produce each ${pCtx6.unit} (c) (£)`, n6Val(c6)],
        [],
        ["", `Number of ${pCtx6.units} (x)`, `Profit (£)`],
        ...xValues6.map(x => ["", n6Val(x), ""])
      ];

      q = [
        `${name6} owns a small business producing and selling ${pCtx6.units}.`,
        `She wants to introduce a new ${pCtx6.variant} for ${pCtx6.season}.`,
        `As production increases, the costs of storage, distribution and promotion reduce the total profit. She uses the following Profit Function model:`,
        `<div class="my-3 text-center">\\( \\text{Profit} = (s - c)x - ${kStr6}x^2 \\)</div>`,
        `<ul class="list-disc list-inside my-2"><li>\\( s \\) is the selling price per ${pCtx6.unit} (£).</li><li>\\( c \\) is the cost to produce each ${pCtx6.unit} (£).</li><li>\\( x \\) is the number of ${pCtx6.units} produced and sold.</li></ul>`,
        `${name6} would like to produce up to ${maxX6} ${pCtx6.units} with a selling price per ${pCtx6.unit} (\\( s \\)) of £${s6}. The cost to produce each ${pCtx6.unit} (\\( c \\)) is £${c6}.`,
        `A spreadsheet template has been provided in the attachments.`,
        `(a)(i) Complete the '${name6}'s ${pCtx6.product} Profit' worksheet to model how profit changes as \\( x \\) increases from 0 to ${maxX6}.`,
        `(a)(ii) Construct an appropriate graph to model ${name6}'s profit.`,
        `(b)(i) State the type of model ${name6} is using.`,
        `(b)(ii) Explain what the graph shows when ${name6} produces and sells more than ${xStar6} ${pCtx6.units}.`,
        `(b)(iii) State how many ${pCtx6.units} ${name6} should produce and sell to maximise her profit.`
      ];
      bq = [
        `${name6}'s ${pCtx6.product} Profit model: \\(\\text{Profit} = (s - c)x - ${kStr6}x^2\\)`,
        `s = £${s6}, c = £${c6}, x up to ${maxX6} ${pCtx6.units}.`,
        `(a)(i) Complete spreadsheet formula. (a)(ii) Generate graph.`,
        `(b)(i) State model type. (b)(ii) Explain graph for x > ${xStar6}. (b)(iii) x to maximise profit.`
      ];
      a = [
        `<strong>•¹ (a)(i)</strong> Formula in first profit cell: <code>=ROUND(($C$7-$C$8)*B11-${kStr6}*B11^2, 2)</code>`,
        `<strong>•²</strong> Fill down formula through entire profit column (x = 0 to ${maxX6}).`,
        `<strong>•³ (a)(ii)</strong> Scatter graph with smooth curve: x-axis = number of ${pCtx6.units}, y-axis = Profit (£).`,
        `<strong>(b)(i)</strong> Quadratic model.`,
        `<strong>(b)(ii)</strong> The graph shows a negative profit (a loss) — the additional costs exceed the revenue from sales.`,
        `<strong>(b)(iii)</strong> ${xStar6} ${pCtx6.units} (the turning point / maximum of the parabola).`
      ];
      finalAns = `(a)(i) =ROUND(($C$7-$C$8)*B11-${kStr6}*B11^2,2) (b)(i) Quadratic (b)(iii) ${xStar6}`;
      attachments = [{ filename: `${name6.replace(/'/g, "")}_Profit.xlsx`, content: "", rawData: rawData6 }];

    } else if (variation === 7) {
      // V7: Identify the independent variable in a formula (G14 — 2023 Q10b)
      const fctxs7 = [
        {
          context: `A model for a lorry's fuel efficiency $F$ (miles per gallon) when carrying a load of $m$ kg is given by $F = 73.6 \\times 0.98^{m/45}$.`,
          indVar: "m", indDesc: "additional mass of cargo (in kg)",
          depVar: "F", depDesc: "fuel efficiency (mpg)"
        },
        {
          context: `The temperature $T$ (in °C) of ocean water at a depth of $d$ metres is modelled by $T = 22 \\times 0.94^{d/10}$.`,
          indVar: "d", indDesc: "depth below surface (in metres)",
          depVar: "T", depDesc: "water temperature (°C)"
        },
        {
          context: `A model for the value $V$ (in £) of a car that is $t$ years old is given by $V = 18{,}000 \\times 0.82^{t}$.`,
          indVar: "t", indDesc: "age of the car (in years)",
          depVar: "V", depDesc: "value of the car (£)"
        },
        {
          context: `A model for the number of bacteria $B$ in a sample after $h$ hours is given by $B = 400 \\times 1.12^{h}$.`,
          indVar: "h", indDesc: "time elapsed (in hours)",
          depVar: "B", depDesc: "number of bacteria"
        },
      ];
      const fc7 = fctxs7[getRandomInt(0, fctxs7.length - 1)];
      q = [
        fc7.context,
        `State the independent variable in this model.`
      ];
      bq = [
        fc7.context,
        `State the independent variable.`
      ];
      a = [
        `<strong>•¹</strong> The independent variable is <strong>$${fc7.indVar}$</strong> — this is ${fc7.indDesc}, the quantity that is changed or chosen.`
      ];
      finalAns = `Independent variable: ${fc7.indVar} (${fc7.indDesc})`;

    } else if (variation === 8) {
      // V8: Substitute into an exponential formula (G15 — 2023 Q10b ii)
      const v8type = getRandomInt(0, 2);
      let v8Context: string, v8Formula: string, v8Var: string, v8Val: number, v8Result: number, v8Unit: string;
      if (v8type === 0) {
        v8Context = `A model for a lorry's fuel efficiency (miles per gallon) when carrying a load of $m$ kg is:`;
        v8Formula = `$F = 73.6 \\times 0.98^{m/45}$`;
        v8Var = "m";
        v8Val = [90, 135, 150, 180, 225][getRandomInt(0, 4)];
        v8Result = +(73.6 * Math.pow(0.98, v8Val / 45)).toFixed(1);
        v8Unit = "mpg";
      } else if (v8type === 1) {
        v8Context = `The temperature $T$ (°C) of a cooling liquid after $t$ minutes is modelled by:`;
        v8Formula = `$T = 80 \\times 0.92^{t}$`;
        v8Var = "t";
        v8Val = [4, 5, 6, 8, 10][getRandomInt(0, 4)];
        v8Result = +(80 * Math.pow(0.92, v8Val)).toFixed(1);
        v8Unit = "°C";
      } else {
        v8Context = `The number of bacteria $B$ in a sample after $h$ hours is modelled by:`;
        v8Formula = `$B = 500 \\times 1.15^{h}$`;
        v8Var = "h";
        v8Val = [3, 4, 5, 6, 8][getRandomInt(0, 4)];
        v8Result = Math.round(500 * Math.pow(1.15, v8Val));
        v8Unit = "bacteria";
      }
      q = [
        v8Context,
        v8Formula,
        `Find the value when $${v8Var} = ${v8Val}$.`
      ];
      bq = [
        `Model given. Substitute $${v8Var} = ${v8Val}$ into the formula.`
      ];
      a = [
        `<strong>•¹</strong> Substitute $${v8Var} = ${v8Val}$: $${v8Formula.replace(/^\$/, "").replace(/\$$/, "")}$ with $${v8Var} = ${v8Val}$`,
        `<strong>•²</strong> Result ≈ <strong>${v8Result} ${v8Unit}</strong>`
      ];
      finalAns = `${v8Result} ${v8Unit}`;

    } else if (variation === 9) {
      // V9: Sketch/draw a linear graph from description (G26 — 2025 Q10a)
      const v9Starts = [2, 3, 4, 5, 6];
      const v9Times  = [6, 8, 10, 12];
      const v9start = v9Starts[getRandomInt(0, v9Starts.length - 1)];
      const v9time  = v9Times[getRandomInt(0, v9Times.length - 1)];
      const v9incr  = [16, 20, 24, 28, 32][getRandomInt(0, 4)];
      const v9end   = v9start + v9incr;
      const contexts9 = [
        { noun: "water", verb: "fills", container: "tank", measure: "depth", unit: "cm" },
        { noun: "sand", verb: "pours into", container: "hourglass", measure: "depth", unit: "mm" },
        { noun: "fuel", verb: "drains from", container: "generator", measure: "level", unit: "litres" },
      ];
      const ctx9 = contexts9[getRandomInt(0, contexts9.length - 1)];
      const isDecreasing9 = ctx9.verb === "drains from";
      const yStart9 = isDecreasing9 ? v9end : v9start;
      const yEnd9   = isDecreasing9 ? v9start : v9end;
      const svgW9 = 260, svgH9 = 200, padL9 = 45, padB9 = 35, padT9 = 15, padR9 = 15;
      const gW9 = svgW9 - padL9 - padR9, gH9 = svgH9 - padB9 - padT9;
      const x09 = padL9, y09 = padT9 + gH9;
      const x19 = padL9 + gW9;
      const yA9 = isDecreasing9 ? padT9 : y09;
      const yB9 = isDecreasing9 ? y09 : padT9;
      const graphSvg9 = `<div class="overflow-x-auto my-4 flex justify-center"><svg width="${svgW9}" height="${svgH9}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
  <line x1="${x09}" y1="${padT9}" x2="${x09}" y2="${y09}" stroke="currentColor" stroke-width="1.5"/>
  <line x1="${x09}" y1="${y09}" x2="${x19}" y2="${y09}" stroke="currentColor" stroke-width="1.5"/>
  <text x="${x09 - 5}" y="${padT9 + gH9 / 2}" text-anchor="middle" transform="rotate(-90,${x09 - 5},${padT9 + gH9 / 2})" fill="currentColor">${ctx9.measure} (${ctx9.unit})</text>
  <text x="${x09 + gW9 / 2}" y="${svgH9 - 5}" text-anchor="middle" fill="currentColor">Time (minutes)</text>
  <text x="${x09 - 4}" y="${yA9 + 4}" text-anchor="end" font-size="10" fill="currentColor">${yStart9}</text>
  <text x="${x09 - 4}" y="${yB9 + 4}" text-anchor="end" font-size="10" fill="currentColor">${yEnd9}</text>
  <text x="${x09}" y="${y09 + 14}" text-anchor="middle" font-size="10" fill="currentColor">0</text>
  <text x="${x19}" y="${y09 + 14}" text-anchor="middle" font-size="10" fill="currentColor">${v9time}</text>
  <line x1="${x09}" y1="${yA9}" x2="${x19}" y2="${yB9}" stroke="#10b981" stroke-width="2.5"/>
  <circle cx="${x09}" cy="${yA9}" r="3" fill="#10b981"/>
  <circle cx="${x19}" cy="${yB9}" r="3" fill="#10b981"/>
</svg></div>`;
      q = [
        `A ${ctx9.container} ${ctx9.verb} ${ctx9.noun}.`,
        `The ${ctx9.measure} ${isDecreasing9 ? "starts at" : "starts at"} ${yStart9} ${ctx9.unit} and ${isDecreasing9 ? "decreases" : "increases"} at a constant rate, reaching ${yEnd9} ${ctx9.unit} after ${v9time} minutes.`,
        `Draw a graph to show this information.`
      ];
      bq = [
        `${ctx9.measure} ${isDecreasing9 ? "decreases" : "increases"} from ${yStart9} ${ctx9.unit} to ${yEnd9} ${ctx9.unit} over ${v9time} minutes.`,
        `Draw a graph to show this.`
      ];
      a = [
        `<strong>•¹</strong> Plot start point: (0, ${yStart9}) and end point: (${v9time}, ${yEnd9}).`,
        `<strong>•²</strong> Join with a straight line — model answer:`,
        graphSvg9
      ];
      finalAns = `Straight line from (0, ${yStart9}) to (${v9time}, ${yEnd9})`;

    } else if (variation === 10) {
      // V10: Identify the dependent variable (G27 — 2025 Q10b)
      const fctxs10 = [
        {
          context: `A graph shows the depth of water (in cm) in a tank plotted against time (in minutes) as it fills.`,
          depVar: "depth of water", indVar: "time"
        },
        {
          context: `A graph shows the value (in £) of a car plotted against the age of the car (in years).`,
          depVar: "value of the car", indVar: "age"
        },
        {
          context: `A graph shows the fuel efficiency (in mpg) of a lorry plotted against the mass of cargo (in kg).`,
          depVar: "fuel efficiency", indVar: "mass of cargo"
        },
        {
          context: `A graph shows the temperature (in °C) of a liquid plotted against time (in minutes) as it cools.`,
          depVar: "temperature", indVar: "time"
        },
      ];
      const fc10 = fctxs10[getRandomInt(0, fctxs10.length - 1)];
      q = [
        fc10.context,
        `State the dependent variable.`
      ];
      bq = [
        fc10.context,
        `State the dependent variable.`
      ];
      a = [
        `<strong>•¹</strong> The dependent variable is the <strong>${fc10.depVar}</strong> — it depends on the value of the independent variable (${fc10.indVar}).`
      ];
      finalAns = `Dependent variable: ${fc10.depVar}`;
    }
  } else if (selectedTopic === "Tolerances & Compound Measures") {
    const variation = getRandomInt(1, 5);
    if (variation === 1) {
      const vehicles = ["honeybee", "delivery van", "drone"];
      const vehicle = vehicles[getRandomInt(0, 2)];
      const dist = getRandStep(80, 450, 5) / 10;
      const distTol = getRandStep(1, 5, 1) / 10;
      const speed = getRandStep(180, 650, 10) / 10;
      const speedTol = getRandStep(10, 25, 5) / 10;
      
      q = [
        `A ${vehicle} travels from a base to a site.`,
        `The distance is measured as ${dist.toFixed(1)} km \\pm ${distTol.toFixed(1)} km.`,
        `The speed of the ${vehicle} is measured at ${speed.toFixed(1)} km/h \\pm ${speedTol.toFixed(1)} km/h.`,
        `Calculate the maximum time, in minutes, it will take the ${vehicle} to complete the journey.`
      ];
      
      bq = [
        `${vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} journey:`,
        `Distance = ${dist.toFixed(1)} km \\pm ${distTol.toFixed(1)} km.`,
        `Speed = ${speed.toFixed(1)} km/h \\pm ${speedTol.toFixed(1)} km/h.`,
        `Calculate the maximum time to complete the journey in minutes.`
      ];
      
      const maxD = dist + distTol;
      const minS = speed - speedTol;
      const timeHours = maxD / minS;
      const timeMins = timeHours * 60;
      
      a = [
        `<strong>1.</strong> Max Distance = ${dist.toFixed(1)} + ${distTol.toFixed(1)} = ${maxD.toFixed(1)} km`,
        `<strong>2.</strong> Min Speed = ${speed.toFixed(1)} - ${speedTol.toFixed(1)} = ${minS.toFixed(1)} km/h (Must divide by min speed for max time)`,
        `<strong>3.</strong> Max Time (hours) = ${maxD.toFixed(1)} / ${minS.toFixed(1)} = ${timeHours.toFixed(4)} hours`,
        `<strong>4.</strong> Max Time (minutes) = ${timeHours.toFixed(4)} \\times 60 = ${timeMins.toFixed(1)} minutes.`
      ];
      finalAns = `${timeMins.toFixed(1)} minutes`;
    } else if (variation === 2) {
      const mass = getRandStep(20, 150, 1) / 10;
      const tolPercent = getRandomInt(2, 5);
      const numContainers = getRandStep(10, 50, 2);
      
      q = [
        `A standard container holds ${mass.toFixed(1)} kg \\pm ${tolPercent}% of material.`,
        `A worker processes ${numContainers} fully loaded containers.`,
        `Calculate the guaranteed minimum total mass of material the worker will extract.`
      ];
      
      bq = [
        `Container: ${mass.toFixed(1)} kg \\pm ${tolPercent}%`,
        `Worker processes ${numContainers} fully loaded containers.`,
        `Calculate guaranteed minimum total mass extracted.`
      ];
      
      const minMult = 1 - (tolPercent / 100);
      const minMass = mass * minMult;
      const totalMinMass = minMass * numContainers;
      
      a = [
        `<strong>1.</strong> Minimum percentage multiplier = 1 - (${tolPercent} / 100) = ${minMult.toFixed(2)}.`,
        `<strong>2.</strong> Minimum mass per container = ${mass.toFixed(1)} \\times ${minMult.toFixed(2)} = ${minMass.toFixed(3)} kg.`,
        `<strong>3.</strong> Guaranteed total minimum = ${minMass.toFixed(3)} \\times ${numContainers} = ${totalMinMass.toFixed(2)} kg.`
      ];
      finalAns = `${totalMinMass.toFixed(2)} kg`;
    } else if (variation === 3) {
      const length = getRandStep(250, 850, 10) / 100;
      const relError = getRandStep(15, 65, 5) / 10;
      
      q = [
        `A student measures the length of a boundary as ${length.toFixed(2)} metres.`,
        `They calculate that this measurement has a relative error of ${relError.toFixed(1)}%.`,
        `Calculate the absolute error of this measurement, giving your answer in centimetres.`
      ];
      
      bq = [
        `Boundary length = ${length.toFixed(2)} m.`,
        `Relative error = ${relError.toFixed(1)}%.`,
        `Calculate the absolute error in cm.`
      ];
      
      const absM = length * (relError / 100);
      const absCm = absM * 100;
      
      a = [
        `<strong>1.</strong> Absolute error in metres = ${length.toFixed(2)} \\times (${relError.toFixed(1)} / 100) = ${absM.toFixed(4)} m.`,
        `<strong>2.</strong> Convert to cm = ${absM.toFixed(4)} \\times 100 = ${absCm.toFixed(2)} cm.`
      ];
      finalAns = `${absCm.toFixed(2)} cm`;
    } else {
      const names = ["Cameron", "Lucy", "Omar", "Sophie", "Ryan"];
      const name = names[getRandomInt(0, names.length - 1)];
      const items = ["candle", "soap block", "resin brick"];
      const item = items[getRandomInt(0, 2)];
      const L = getRandomInt(3, 8);
      const B = getRandomInt(3, 8);
      const H = getRandomInt(6, 15);
      const relErr = getRandStep(15, 50, 5) / 10;
      
      q = [
        `To produce each ${item}, ${name} pours liquid into a mould in the shape of a cuboid.`,
        `Each mould has a length of exactly ${L} centimetres and a breadth of exactly ${B} centimetres.`,
        `The liquid is poured to a height of ${H} centimetres with a relative error of ${relErr.toFixed(1)}%.`,
        `Calculate the absolute error of the volume of the ${item}.`
      ];
      
      bq = [
        `Cuboid mould for ${item}:`,
        `Length (exact) = ${L} cm. Breadth (exact) = ${B} cm.`,
        `Height = ${H} cm (relative error = ${relErr.toFixed(1)}%).`,
        `Calculate absolute error of the ${item}'s volume.`
      ];
      
      const vol = L * B * H;
      const absErr = vol * (relErr / 100);
      
      a = [
        `<strong>1.</strong> Calculate intended target volume: ${L} \\times ${B} \\times ${H} = ${vol} \\text{cm}^3`,
        `<strong>2.</strong> Contextual logic: Because length and breadth are "exact", the relative error of the total volume is equal to the relative error of the height (${relErr.toFixed(1)}%).`,
        `<strong>3.</strong> Calculate absolute error: ${vol} \\times (${relErr.toFixed(1)} / 100) = ${absErr.toFixed(2)}`
      ];
      finalAns = `${absErr.toFixed(2)} cm³`;
    }
  } else if (selectedTopic === "Recurrence Relations" || selectedTopic === "Recurrence Relations (Software)") {
    const isSoftware = selectedTopic === "Recurrence Relations (Software)";
    const variation = isSoftware ? [1, 5, 7, 8][getRandomInt(0, 3)] : [2, 3, 4, 8, 9][getRandomInt(0, 4)];
    if (variation === 1) {
      // School roll recurrence model — matches SQA Specimen Q5 / 2022 Q5 / 2024 Q4 xlsx layout
      const schoolNames = ["Glencoe Academy", "Strathmore High School", "Cairn View Academy", "Lomond Secondary School", "Tay Valley High School"];
      const schoolName = schoolNames[getRandomInt(0, schoolNames.length - 1)];
      const startYear = getRandomInt(2020, 2025);
      const initialPupils = getRandStep(600, 1200, 50);
      const leaverPct = getRandStep(12, 22, 1);
      const leaverDec = leaverPct / 100;
      const intake = getRandStep(80, 160, 5);
      const projectionYears = 10;

      // Calculate year-by-year for the answer
      let roll = initialPupils;
      const yearlyRolls: number[] = [roll];
      for (let y = 1; y <= projectionYears; y++) {
        roll = Math.round(roll * (1 - leaverDec) + intake);
        yearlyRolls.push(roll);
      }

      // SQA-exact layout: B=label, C=blank spacer, D=value; data table B=Date, C=Pupils
      const int = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val });
      const pct = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: "0.00%" });

      const rawData: any[][] = [
        ["", "Name:", "", ""],
        ["", "SCN:", "", ""],
        ["", "Centre name:", "", ""],
        [],
        ["", `School Roll Model — ${schoolName}`],
        [],
        ["", `Number of pupils in August ${startYear}`, "", int(initialPupils)],
        ["", "Leavers (%)", "", pct(leaverDec)],
        ["", "School roll at end of year (%)", "", int("")],
        ["", "S1 intake (August)", "", int(intake)],
        ["", `School roll in August ${startYear + projectionYears}`, "", int("")],
        [],
        ["", "Date", "Number of Pupils"],
        ...Array.from({ length: projectionYears + 1 }, (_, i) => [
          "",
          `August ${startYear + i}`,
          i === 0 ? int(initialPupils) : int("")
        ])
      ];

      q = [
        `${schoolName} is modelling its school roll over the next ${projectionYears} years.`,
        `In August ${startYear}, there are ${initialPupils.toLocaleString()} pupils on the roll.`,
        `Each year, ${leaverPct}% of pupils leave and ${intake} new S1 pupils join in August.`,
        `A spreadsheet template has been provided in the attachments.`,
        `(a) Complete the formula for the school roll at the end of each year.`,
        `(b) Complete the school roll schedule and state the school roll in August ${startYear + projectionYears}.`
      ];

      bq = [
        `${schoolName}: ${initialPupils.toLocaleString()} pupils in August ${startYear}.`,
        `Each year: ${leaverPct}% leave, ${intake} S1 pupils join.`,
        `(a) State the recurrence formula.`,
        `(b) Complete schedule; state roll in August ${startYear + projectionYears}.`
      ];

      const retainPct = 100 - leaverPct;
      a = [
        `<strong>(a)</strong> Roll<sub>next year</sub> = Roll<sub>this year</sub> × ${retainPct / 100} + ${intake}`,
        `e.g. in a spreadsheet: if roll is in cell C14, next year = INT(C14 × (1 - D8) + D10) where D8 = leavers%, D10 = intake.`,
        `<strong>(b)</strong> Year-by-year:`,
        ...yearlyRolls.slice(0, 4).map((r, i) => `Aug ${startYear + i}: ${r.toLocaleString()} pupils`),
        `... (continues similarly)`,
        `<strong>School roll in August ${startYear + projectionYears}: ${yearlyRolls[projectionYears].toLocaleString()} pupils</strong>`
      ];
      finalAns = `${yearlyRolls[projectionYears].toLocaleString()} pupils in August ${startYear + projectionYears}`;
      attachments = [{ filename: "School_Roll.xlsx", content: "", rawData }];
    } else if (variation === 5) {
      // Dracaena plant CO2 model — matches SQA 2024 Q4 xlsx layout
      const plantNames = ["Dracaena", "Peace Lily", "Spider Plant", "Snake Plant", "Pothos"];
      const plantName = plantNames[getRandomInt(0, plantNames.length - 1)];
      const roomName = ["classroom", "office", "library", "staffroom"][getRandomInt(0, 3)];
      const startDay = getRandomInt(1, 3);
      const projectionDays = 10;
      const initialCO2 = getRandStep(800, 1400, 50);
      const reductionPct = getRandStep(8, 18, 1);
      const reductionDec = reductionPct / 100;
      const addedCO2 = getRandStep(60, 140, 10);

      // Calculate day-by-day for the answer
      let co2 = initialCO2;
      const dailyCO2: number[] = [co2];
      for (let d = 1; d <= projectionDays; d++) {
        co2 = Math.round(co2 * (1 - reductionDec) + addedCO2);
        dailyCO2.push(co2);
      }

      const int2 = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val } as any);
      const pct2 = (val: number | "") => ({ t: val === "" ? "z" : "n", v: val === "" ? undefined : val, z: "0.00%" } as any);

      const rawData2: any[][] = [
        ["", "Name:", "", ""],
        ["", "SCN:", "", ""],
        ["", "Centre name:", "", ""],
        [],
        [``, `${plantName} Plant CO₂ Model — ${roomName}`],
        [],
        ["", `CO₂ level at the start of Day ${startDay} (ppm)`, "", int2(initialCO2)],
        ["", "CO₂ reduction by plant (%)", "", pct2(reductionDec)],
        ["", "CO₂ level at end of day (ppm)", "", int2("")],
        ["", "CO₂ added by people/heating (ppm)", "", int2(addedCO2)],
        ["", `CO₂ level at start of Day ${startDay + projectionDays} (ppm)`, "", int2("")],
        [],
        ["", "Day", "CO₂ (ppm)"],
        ...Array.from({ length: projectionDays + 1 }, (_, i) => [
          "",
          `Day ${startDay + i}`,
          i === 0 ? int2(initialCO2) : int2("")
        ])
      ];

      q = [
        `A ${plantName} plant is placed in a ${roomName} to help reduce CO₂ levels.`,
        `At the start of Day ${startDay}, the CO₂ level is ${initialCO2.toLocaleString()} ppm.`,
        `Each day, the plant reduces the CO₂ level by ${reductionPct}%, but ${addedCO2} ppm of CO₂ is added back by people and heating.`,
        `A spreadsheet template has been provided in the attachments.`,
        `(a) Complete the formula for the CO₂ level at the end of each day.`,
        `(b) Complete the CO₂ schedule and state the CO₂ level at the start of Day ${startDay + projectionDays}.`
      ];

      bq = [
        `${plantName} plant in ${roomName}. Day ${startDay} CO₂: ${initialCO2.toLocaleString()} ppm.`,
        `Each day: plant reduces by ${reductionPct}%, +${addedCO2} ppm added.`,
        `(a) State the recurrence formula.`,
        `(b) Complete schedule; state CO₂ at start of Day ${startDay + projectionDays}.`
      ];

      const retainPct2 = 100 - reductionPct;
      a = [
        `<strong>(a)</strong> CO₂<sub>next day</sub> = CO₂<sub>this day</sub> × ${retainPct2 / 100} + ${addedCO2}`,
        `e.g. if CO₂ is in cell C14: =ROUND(C14 × (1 − D8) + D10, 0) where D8 = reduction %, D10 = added CO₂.`,
        `<strong>(b)</strong> Day-by-day:`,
        ...dailyCO2.slice(0, 4).map((v, i) => `Day ${startDay + i}: ${v.toLocaleString()} ppm`),
        `... (continues similarly)`,
        `<strong>CO₂ at start of Day ${startDay + projectionDays}: ${dailyCO2[projectionDays].toLocaleString()} ppm</strong>`
      ];
      finalAns = `${dailyCO2[projectionDays].toLocaleString()} ppm at start of Day ${startDay + projectionDays}`;
      attachments = [{ filename: "CO2_Model.xlsx", content: "", rawData: rawData2 }];
    } else if (variation === 7) {
      // Warehouse stock recurrence — 2023 Q8 pattern (M5)
      // 3-col layout: A=blank, B=labels, C=values/data
      // C7=startStock, C8=retainRate(%), C9=newStock, C13=seed(week0), C14+=formula
      // Formula: =INT(C13*$C$8+$C$9)  Limit: C9/(1-C8)
      const warehouseNames = [
        "Caledonian Logistics", "Highland Storage", "Tay Freight Services",
        "Grampian Warehousing", "Forth Valley Depot", "Scotia Distribution",
      ];
      const wName7 = warehouseNames[getRandomInt(0, warehouseNames.length - 1)];
      const delivPct7  = getRandomInt(15, 30);           // % delivered each week
      const retainDec7 = (100 - delivPct7) / 100;        // C8 value (retain fraction)
      const startStock7 = getRandStep(1200, 3000, 50);   // initial stock
      const newStock7   = getRandStep(200, 500, 50);     // units received per week
      const limit7      = Math.round(newStock7 / (1 - retainDec7));  // long-run equilibrium

      // Building capacity: ~60% chance it's below limit (tighter — more instructive)
      const belowLimit7  = Math.random() < 0.60;
      const capacity7    = belowLimit7
        ? Math.round(limit7 * getRandStep(70, 95, 5) / 100 / 50) * 50
        : Math.round(limit7 * getRandStep(110, 140, 5) / 100 / 50) * 50;
      const hasSpace7    = capacity7 >= limit7;

      // Weeks shown in template: 0 to 26 (seed + 26 formula rows)
      // C13 = week 0 seed (rawData[12]); formula starts at C14
      const lastWeek7 = 26;

      const int7 = (v: number | "") => ({ t: v === "" ? "z" as const : "n" as const, v: v === "" ? undefined : v as number });
      const pct7 = (v: number)      => ({ t: "n" as const, v, z: "0%" });

      // rawData indices: [0]=row1 … [12]=row13(seed) … [12+lastWeek7]=row(13+lastWeek7)
      const rawData7: any[][] = [
        ["", "Name:", ""],
        ["", "SCN:", ""],
        ["", "Centre name:", ""],
        [],
        ["", `Warehouse Stock Model — ${wName7}`],
        [],
        ["", "Starting units of stock",          int7(startStock7)],   // row 7, C7
        ["", "Retention rate (%)",                pct7(retainDec7)],    // row 8, C8
        ["", "Weekly new stock received",         int7(newStock7)],     // row 9, C9
        ["", `Predicted stock at end of week ${lastWeek7}`, int7("")],  // row 10, C10 (blank)
        [],
        ["", "Week", "Units of Stock"],                                 // row 12, header
        ["", int7(0), int7(startStock7)],                               // row 13, seed C13
        ...Array.from({ length: lastWeek7 }, (_, i) => ["", int7(i + 1), int7("")]),  // rows 14–39
      ];

      q = [
        `${wName7} currently has ${startStock7.toLocaleString()} units of stock in their warehouse.`,
        `Each week, they deliver ${delivPct7}% of their current stock to stores and receive ${newStock7.toLocaleString()} units of new stock.`,
        `A spreadsheet template has been provided in the attachments.`,
        `(a) Complete the 'Warehouse Stock' worksheet to identify the predicted number of units of stock at the end of week ${lastWeek7}.`,
        `(b)(i) Extend the table in your worksheet to construct a graph showing the units of stock for 52 weeks.`,
        `(b)(ii) Using the graph, state which type of mathematical model best describes the units of stock over time.`,
        `${wName7} is considering moving to a smaller building with space for ${capacity7.toLocaleString()} units of stock.`,
        `(c) Comment on whether the smaller building will have enough space. Justify your answer.`
      ];
      bq = [
        `${wName7}: ${startStock7.toLocaleString()} units. Each week: deliver ${delivPct7}%, receive ${newStock7.toLocaleString()} units.`,
        `(a) Complete spreadsheet; state stock at end of week ${lastWeek7}.`,
        `(b)(i) Extend to 52 weeks; construct graph. (b)(ii) State model type.`,
        `(c) Capacity = ${capacity7.toLocaleString()}. Will the building have enough space?`
      ];
      a = [
        `<strong>•¹ (a)</strong> Retention rate in C8: ${(retainDec7 * 100).toFixed(0)}% (keep ${(retainDec7 * 100).toFixed(0)}%, since ${delivPct7}% is delivered).`,
        `<strong>•²</strong> Formula in C14 (fill down): <code>=INT(C13*$C$8+$C$9)</code>`,
        `<strong>•³</strong> Stock at end of week ${lastWeek7}: extend spreadsheet → approximately <strong>${
          (() => { let s = startStock7; for (let w = 1; w <= lastWeek7; w++) s = Math.floor(s * retainDec7 + newStock7); return s.toLocaleString(); })()
        } units</strong>`,
        `<strong>•⁴ (b)(i)</strong> Extend table to week 52 and construct appropriate graph.`,
        `<strong>(b)(ii)</strong> Exponential decay model (or recurrence relation).`,
        `<strong>(c)</strong> Long-run stock level (limit): ${newStock7} ÷ (1 − ${(retainDec7 * 100).toFixed(0)}%) = ${limit7.toLocaleString()} units.`,
        `${hasSpace7
          ? `Yes — the building will have enough space as the stock is expected to level out at ${limit7.toLocaleString()} units, which is less than the capacity of ${capacity7.toLocaleString()} units.`
          : `No — the building will <strong>not</strong> have enough space as the stock is expected to level out at ${limit7.toLocaleString()} units, which exceeds the capacity of ${capacity7.toLocaleString()} units.`
        }`
      ];
      finalAns = `Week ${lastWeek7}: ~${
        (() => { let s = startStock7; for (let w = 1; w <= lastWeek7; w++) s = Math.floor(s * retainDec7 + newStock7); return s.toLocaleString(); })()
      } units; limit = ${limit7.toLocaleString()}; building ${hasSpace7 ? "adequate" : "too small"}`;
      attachments = [{ filename: "Warehouse_Stock.xlsx", content: "", rawData: rawData7 }];
    } else if (variation === 2) {
      const startStock = getRandStep(1000, 3000, 100);
      const dPercent = getRandomInt(15, 30);
      const newStock = getRandStep(200, 600, 50);
      
      const mult = Number((1 - (dPercent / 100)).toFixed(2));
      const w1 = (startStock * mult) + newStock;
      
      q = [
        `A warehouse currently has ${startStock.toLocaleString()} units of stock.`,
        `Each week, they deliver ${dPercent}% of their current stock to stores, and receive ${newStock} units of new stock.`,
        `The warehouse manager models this on a spreadsheet over 52 weeks and plots a graph. The graph shows the stock levels flattening out to a constant value.`,
        `(a) Calculate the expected units of stock at the end of Week 1.`,
        `(b) State the mathematical term used to describe a value that a sequence approaches over a long period of time.`
      ];
      
      bq = [
        `Warehouse stock = ${startStock.toLocaleString()}.`,
        `Each week: ${dPercent}% delivered to stores. ${newStock} new units received.`,
        `Spreadsheet graph shows stock level flattening out.`,
        `(a) Calculate expected stock at end of Week 1.`,
        `(b) State the term used to describe this stabilised long-term value.`
      ];
      
      a = [
        `<strong>(a) 1.</strong> Retained multiplier = 1 - (${dPercent} / 100) = ${mult.toFixed(2)}`,
        `<strong>(a) 2.</strong> Week 1 = (${startStock.toLocaleString()} \\times ${mult.toFixed(2)}) + ${newStock} = ${w1.toFixed(0)} units`,
        `<strong>(b) 1.</strong> A limit (or steady state).`
      ];
      finalAns = `(a) ${w1.toFixed(0)} units (b) A limit`;
    } else if (variation === 3) {
      const species = ["honeybees", "gorillas", "termites"];
      const animal = species[getRandomInt(0, 2)];
      
      q = [
        `A student models a living population of ${animal} using a spreadsheet.`,
        `The initial population is in cell C8. The survival multiplier is stored in cell C3, and the number of new births is stored in cell C4.`,
        `State the exact formula that should be entered into cell C9 to calculate the population for the next period, ensuring the model does not predict fractional animals.`
      ];
      
      bq = [
        `Spreadsheet for ${animal} population.`,
        `Initial = C8. Survival multiplier = C3. New births = C4.`,
        `State exact formula for cell C9 avoiding fractional animals.`
      ];
      
      a = [
        `<strong>1.</strong> Living populations must be modeled with integers.`,
        `<strong>2.</strong> Formula: =INT(C8*$C$3 + $C$4) OR =ROUND(C8*$C$3 + $C$4, 0)`
      ];
      finalAns = `=INT(C8*$C$3 + $C$4)`;
    } else if (variation === 4) {
      const co2 = getRandStep(1800, 2500, 100);
      const dec = getRandStep(10, 20, 1);
      const inc = getRandStep(120, 220, 10);
      
      q = [
        `A scientist is studying the effect of large plants on indoor air quality.`,
        `They estimate that the plants reduce the concentration of carbon dioxide (CO2) in a room by ${dec}% each day.`,
        `Each evening, a heating system is left running, which adds enough CO2 to increase the concentration by ${inc} ppm.`,
        `At the start of the study, the concentration of CO2 in the room was ${co2} ppm.`,
        `The scientist builds a spreadsheet model for 60 days to determine the long-term effectiveness of the plants.`,
        `(a) Calculate the estimated concentration of CO2 at the end of Day 1 and Day 2.`,
        `(b) State a reason why the spreadsheet model might not be realistic over a period of many years.`
      ];
      bq = [
        `Start: ${co2} ppm.`,
        `Day time: -${dec}% CO2. Evening: +${inc} ppm.`,
        `(a) Calculate CO2 after Day 1 and Day 2.`,
        `(b) State why a multi-year model may not be realistic.`
      ];
      
      const mult = 1 - (dec / 100);
      const day1 = (co2 * mult) + inc;
      const day2 = (day1 * mult) + inc;
      
      a = [
        `<strong>(a) 1.</strong> Retained Multiplier = 1 - 0.${dec} = ${mult}`,
        `<strong>(a) 2.</strong> Day 1 = (${co2} \\times ${mult}) + ${inc} = ${day1.toFixed(1)} ppm`,
        `<strong>(a) 3.</strong> Day 2 = (${day1.toFixed(1)} \\times ${mult}) + ${inc} = ${day2.toFixed(1)} ppm`,
        `<strong>(b) 1.</strong> Valid reasons include: the plants might grow larger (reducing more CO2), plants might die, or the heating system might not run every evening (e.g. during summer).`
      ];
      finalAns = `(a) Day 1: ${day1.toFixed(1)} ppm, Day 2: ${day2.toFixed(1)} ppm (b) Plant growth/change`;
    } else if (variation === 8) {
      // Model limitation/assumption comment — M6 (2022 Q5a(ii), 2023 Q8(d))
      const ctx8 = getRandomInt(0, 2);

      if (ctx8 === 0) {
        // School roll context
        const schoolNames8 = ["Glencoe Academy", "Strathmore High School", "Cairn View Academy", "Lomond Secondary School"];
        const sName8 = schoolNames8[getRandomInt(0, schoolNames8.length - 1)];
        const startYear8 = getRandomInt(2020, 2025);
        const initialPupils8 = getRandStep(600, 1200, 50);
        const leaverPct8 = getRandStep(12, 22, 1);
        const intake8 = getRandStep(80, 160, 5);
        let roll8 = initialPupils8;
        for (let y = 0; y < 10; y++) roll8 = Math.round(roll8 * (1 - leaverPct8 / 100) + intake8);
        const predRoll8 = roll8;

        q = [
          `${sName8} uses a spreadsheet to predict its school roll.`,
          `In August ${startYear8}, there are ${initialPupils8.toLocaleString()} pupils on the roll. Each year, ${leaverPct8}% of pupils leave and ${intake8} new S1 pupils join in August.`,
          `The model predicts there will be ${predRoll8.toLocaleString()} pupils in August ${startYear8 + 10}.`,
          `State one reason why this prediction may not be accurate.`
        ];
        bq = [
          `${sName8}: ${initialPupils8.toLocaleString()} pupils in August ${startYear8}.`,
          `Each year: ${leaverPct8}% leave, ${intake8} S1 join.`,
          `Predicted roll in August ${startYear8 + 10}: ${predRoll8.toLocaleString()}.`,
          `State one reason why this prediction may not be accurate.`
        ];
        a = [
          `<strong>•¹</strong> Valid reason, e.g. "the number of pupils leaving each year is approximate" OR "the ${leaverPct8}% leaver rate may not remain constant" OR "the number of S1 pupils joining may not remain fixed at ${intake8} each year."`
        ];
        finalAns = `The leaver rate or intake may vary year to year (model assumes these are constant)`;

      } else if (ctx8 === 1) {
        // Warehouse stock context
        const warehouseNames8 = ["Caledonian Logistics", "Highland Storage", "Tay Freight Services", "Grampian Warehousing"];
        const wName8 = warehouseNames8[getRandomInt(0, warehouseNames8.length - 1)];
        const delivPct8 = getRandomInt(15, 30);
        const newStock8 = getRandStep(200, 500, 50);
        const limit8 = Math.round(newStock8 / (delivPct8 / 100));

        q = [
          `${wName8} uses a spreadsheet model to predict stock levels in their warehouse.`,
          `Each week, they deliver ${delivPct8}% of their current stock to stores and receive ${newStock8.toLocaleString()} units of new stock.`,
          `The model predicts the stock will stabilise at ${limit8.toLocaleString()} units in the long term.`,
          `State one assumption made by this model.`
        ];
        bq = [
          `${wName8}: each week deliver ${delivPct8}%, receive ${newStock8.toLocaleString()} new units.`,
          `Model predicts long-term stock = ${limit8.toLocaleString()} units.`,
          `State one assumption made by this model.`
        ];
        a = [
          `<strong>•¹</strong> Valid assumption, e.g. "the model assumes a fixed rate of stock is delivered each week" OR "the model assumes a fixed quantity of ${newStock8.toLocaleString()} units of new stock is received each week."`
        ];
        finalAns = `Model assumes fixed delivery rate each week / fixed new stock received each week`;

      } else {
        // CO2/plant context
        const plantNames8 = ["Dracaena", "Peace Lily", "Spider Plant", "Snake Plant"];
        const plantName8 = plantNames8[getRandomInt(0, plantNames8.length - 1)];
        const dec8 = getRandStep(10, 20, 1);
        const inc8 = getRandStep(120, 220, 10);
        const limit8co2 = Math.round(inc8 / (dec8 / 100));

        q = [
          `A school uses a ${plantName8} plant to reduce CO₂ levels in a classroom.`,
          `The plant reduces CO₂ by ${dec8}% each day. Each evening, the heating system adds ${inc8} ppm of CO₂.`,
          `A spreadsheet model predicts the CO₂ level will stabilise at approximately ${limit8co2.toLocaleString()} ppm in the long term.`,
          `State one reason why the actual CO₂ level may differ from this prediction.`
        ];
        bq = [
          `${plantName8}: reduces CO₂ by ${dec8}% daily; heating adds ${inc8} ppm each evening.`,
          `Model predicts CO₂ stabilises at ${limit8co2.toLocaleString()} ppm.`,
          `State one reason why the actual level may differ.`
        ];
        a = [
          `<strong>•¹</strong> Valid reason, e.g. "the model assumes the plant reduces CO₂ at a constant rate each day, but this may vary depending on temperature or light levels" OR "the heating system may not always add the same amount of CO₂ each evening."`
        ];
        finalAns = `Model assumes constant CO₂ reduction rate / constant nightly addition`;
      }

    } else if (variation === 9) {
      // V9: Compare recurrence model long-run limit to an effectiveness threshold (G25 — 2024 Q4c)
      // SQA source: CO₂ model — pre-release material states "very good" air quality ≤ 800 ppm
      // Student computes limit = b/(1−a) and compares to given threshold
      const v9ctxs = [
        {
          subject: "CO₂", unit: "ppm",
          intro: (dec: number, inc: number) =>
            `A room uses plants to reduce CO₂ levels. The plants reduce CO₂ by ${dec}% each day. A heating system adds ${inc} ppm each evening.`,
          standard: 800,
          standardDesc: `"very good" air quality standard`,
          effectiveIf: "below",
          effectiveWord: "effective",
        },
        {
          subject: "pollutant", unit: "mg/m³",
          intro: (dec: number, inc: number) =>
            `A factory uses filters to reduce pollutant levels. The filters remove ${dec}% of the pollutant each hour. Industrial activity adds ${inc} mg/m³ each hour.`,
          standard: 150,
          standardDesc: `safe exposure limit`,
          effectiveIf: "below",
          effectiveWord: "effective",
        },
        {
          subject: "bacteria", unit: "colony forming units (CFU)",
          intro: (dec: number, inc: number) =>
            `A hospital uses UV treatment to reduce bacteria levels. The treatment reduces bacteria by ${dec}% each day. Normal activity introduces ${inc} CFU each day.`,
          standard: 500,
          standardDesc: `maximum safe level`,
          effectiveIf: "below",
          effectiveWord: "effective",
        },
      ];
      const vc9 = v9ctxs[getRandomInt(0, v9ctxs.length - 1)];
      const dec9   = getRandStep(10, 25, 1);
      const mult9  = +((100 - dec9) / 100).toFixed(2);
      // Pick inc9 so limit9 is either clearly below or clearly above threshold
      const threshold9 = vc9.standard;
      const isEffective9 = getRandomInt(0, 1) === 1;
      // limit = inc / (1 - mult)
      // For effective: limit < threshold → inc < threshold * (1 - mult)
      // For ineffective: limit > threshold → inc > threshold * (1 - mult)
      const boundaryInc9 = threshold9 * (1 - mult9);
      const inc9 = isEffective9
        ? Math.round(boundaryInc9 * getRandStep(55, 80, 5) / 100 / 5) * 5
        : Math.round(boundaryInc9 * getRandStep(120, 160, 5) / 100 / 5) * 5;
      const limit9 = Math.round(inc9 / (1 - mult9));

      q = [
        vc9.intro(dec9, inc9),
        `The ${vc9.standardDesc} for ${vc9.subject} is ${threshold9.toLocaleString()} ${vc9.unit}.`,
        `State whether the model shows the treatment to be ${vc9.effectiveWord}. Justify your answer using the long-run limit.`
      ];
      bq = [
        `Model: −${dec9}% per period, +${inc9} ${vc9.unit} per period. Threshold = ${threshold9} ${vc9.unit}.`,
        `Is the treatment ${vc9.effectiveWord}? Justify using the long-run limit.`
      ];
      a = [
        `<strong>•¹</strong> Long-run limit = ${inc9} ÷ (1 − ${mult9}) = ${inc9} ÷ ${(1 - mult9).toFixed(2)} = <strong>${limit9.toLocaleString()} ${vc9.unit}</strong>`,
        `<strong>•²</strong> ${limit9} ${isEffective9 ? "<" : ">"} ${threshold9} → The treatment is <strong>${isEffective9 ? vc9.effectiveWord : "not " + vc9.effectiveWord}</strong> — the long-run ${vc9.subject} level is ${isEffective9 ? "below" : "above"} the ${vc9.standardDesc}.`
      ];
      finalAns = `Limit = ${limit9} ${vc9.unit} — ${isEffective9 ? vc9.effectiveWord : "not " + vc9.effectiveWord} (${isEffective9 ? "<" : ">"} ${threshold9})`;
    }
  } else if (selectedTopic === "Spreadsheet Skills (Data & Formulas)") {
    const variation = getRandomInt(1, 5);
    if (variation === 1) {
      const pNum = getRandomInt(12, 85);
      
      q = [
        `A researcher is using a spreadsheet to analyse survey data.`,
        `Participant ${pNum} entered an invalid, impossible response in the 'Age' column.`,
        `The researcher decides to use the 'Hide Row' command to remove this participant before running the AVERAGE function.`,
        `Explain why this approach is incorrect, and state what the researcher should do instead.`
      ];
      
      bq = [
        `Participant ${pNum} entered invalid age.`,
        `Researcher 'Hides Row' before running AVERAGE.`,
        `Explain why this is wrong, and what to do instead.`
      ];
      
      a = [
        `"Hiding the row only removes the data visually. The invalid response is still in the spreadsheet and will heavily distort the AVERAGE calculation.`,
        `The researcher must completely delete the invalid data or the entire row."`
      ];
      finalAns = `Hiding row is visual only; must delete data`;
    } else if (variation === 2) {
      // IF formula question — write a conditional formula for a realistic spreadsheet scenario
      type IfCtx = { scenario: string; colDesc: string; colLetter: string; rowNum: number; threshold: number; unit: string; trueLabel: string; falseLabel: string; extra?: string };
      const ifContexts: IfCtx[] = [
        { scenario: "A business spreadsheet tracks monthly sales figures.", colDesc: "monthly sales (£)", colLetter: "C", rowNum: getRandomInt(3, 8), threshold: getRandStep(5000, 15000, 500), unit: "£", trueLabel: "\"Target Met\"", falseLabel: "\"Below Target\"" },
        { scenario: "A teacher is recording exam scores for a class.", colDesc: "exam score (out of 100)", colLetter: "B", rowNum: getRandomInt(3, 8), threshold: getRandomInt(50, 70), unit: "", trueLabel: "\"Pass\"", falseLabel: "\"Fail\"", extra: `A score of ${getRandomInt(50, 70)} or more is a pass.` },
        { scenario: "A health tracker records daily step counts.", colDesc: "daily step count", colLetter: "D", rowNum: getRandomInt(3, 8), threshold: getRandStep(8000, 12000, 500), unit: "", trueLabel: "\"Goal Achieved\"", falseLabel: "\"Keep Going\"" },
        { scenario: "A spreadsheet records employees' weekly hours.", colDesc: "hours worked", colLetter: "C", rowNum: getRandomInt(3, 8), threshold: getRandomInt(35, 40), unit: "", trueLabel: "\"Full Time\"", falseLabel: "\"Part Time\"" }
      ];
      const ic = ifContexts[getRandomInt(0, ifContexts.length - 1)];
      const resultCell = `${["D","E","F"].find(l => l !== ic.colLetter) ?? "E"}${ic.rowNum}`;

      q = [
        ic.scenario,
        ic.extra ? ic.extra : "",
        `Column ${ic.colLetter} contains the ${ic.colDesc} for each row.`,
        `Cell ${resultCell} should display ${ic.trueLabel} if the value in ${ic.colLetter}${ic.rowNum} is ${ic.unit ? ic.unit : ""}${ic.threshold} or more, and ${ic.falseLabel} otherwise.`,
        `Write the formula that should be entered in cell ${resultCell}.`
      ].filter(s => s !== "");

      bq = [
        ic.scenario,
        `${ic.colLetter}${ic.rowNum} = ${ic.colDesc}.`,
        `${resultCell}: show ${ic.trueLabel} if ≥ ${ic.threshold}, else ${ic.falseLabel}.`,
        `Write the IF formula for cell ${resultCell}.`
      ];

      a = [
        `<strong>Formula in ${resultCell}:</strong>`,
        `=IF(${ic.colLetter}${ic.rowNum}>=${ic.threshold}, ${ic.trueLabel}, ${ic.falseLabel})`,
        `The IF function checks the condition (${ic.colLetter}${ic.rowNum}>=${ic.threshold}). If TRUE it returns ${ic.trueLabel}; if FALSE it returns ${ic.falseLabel}.`
      ];
      finalAns = `=IF(${ic.colLetter}${ic.rowNum}>=${ic.threshold}, ${ic.trueLabel}, ${ic.falseLabel})`;
    } else if (variation === 3) {
      q = [
        `A spreadsheet formula =ROUND(F15*$C$9, 2) is entered into cell D16 to calculate the interest content of a loan.`,
        `Explain what will happen to the cell references in this formula if it is dragged down (copied) into cell D17.`
      ];
      
      bq = [
        `Cell D16 has =ROUND(F15*$C$9, 2)`,
        `Explain what happens to cell refs if copied down to D17.`
      ];
      
      a = [
        `"The relative reference F15 will automatically update to F16.`,
        `However, because of the dollar signs (absolute referencing), the reference to $C$9 will remain locked as $C$9."`
      ];
      finalAns = `F15 becomes F16, $C$9 remains locked as $C$9`;
    } else if (variation === 4) {
      const sampleSize = getRandomInt(40, 60);
      const withdrawn = getRandomInt(10, 30);
      
      q = [
        `A random sample of ${sampleSize} participants took part in a general study.`,
        `The responses were entered into a 'Participant Responses' spreadsheet.`,
        `Participants 2, 8, and 14 responded 'yes' to having a particular allergy. All other participants did not.`,
        `Participant ${withdrawn} has withdrawn their consent for their responses to be included.`,
        `(a) Explain the necessary changes to the spreadsheet row for Participant ${withdrawn} to ensure ethical compliance.`,
        `(b) State the formula or software function (e.g. COUNTIF) you would use to determine how many remaining participants answered 'yes' to having the allergy.`
      ];
      bq = [
        `Sample of ${sampleSize}. Spread-sheeted.`,
        `Participants 2, 8, 14 have an allergy. Rest do not.`,
        `Participant ${withdrawn} withdraws consent.`,
        `(a) What changes are made to row ${withdrawn} for ethical compliance?`,
        `(b) State formula/function to count remaining 'yes' responses.`
      ];
      
      a = [
        `<strong>(a)</strong> The row of data for Participant ${withdrawn} must be completely deleted/removed from the spreadsheet to ensure their withdrawn data is not analysed.`,
        `<strong>(b)</strong> =COUNTIF(Range, "yes") [or equivalent software command].`
      ];
      finalAns = `Delete row; use COUNTIF`;

    } else if (variation === 5) {
      // V5: Data clean + COUNTIF summary table + chart (G22 — 2025 Q12)
      // Three parts: (a) fill missing binary column + delete withdrawn row,
      //              (b) COUNTIF-based summary table,
      //              (c) create bar chart / pie chart with appropriate formatting

      const v5ctxs = [
        {
          survey: "general health study",
          n: 49,
          withdrawn: 42,
          catVar: "eye colour",
          catCol: "Eye Colour",
          cats: ["blue", "brown", "green"],
          counts: [11, 34, 4],
          binVar: "colour blind",
          binCol: "Colour Blind?",
          binYes: [3, 7, 13, 18],
          binYesLabel: "yes",
          binNoLabel: "no",
          chartNote: "bar chart or pie chart",
        },
        {
          survey: "dietary habits survey",
          n: 48,
          withdrawn: 31,
          catVar: "diet type",
          catCol: "Diet Type",
          cats: ["omnivore", "vegetarian", "vegan"],
          counts: [29, 14, 5],
          binVar: "has food allergy",
          binCol: "Food Allergy?",
          binYes: [5, 11, 22, 36],
          binYesLabel: "yes",
          binNoLabel: "no",
          chartNote: "bar chart or pie chart",
        },
        {
          survey: "exercise habits study",
          n: 50,
          withdrawn: 17,
          catVar: "exercise frequency",
          catCol: "Exercise Frequency",
          cats: ["never", "sometimes", "regularly"],
          counts: [12, 21, 17],
          binVar: "owns a gym membership",
          binCol: "Gym Membership?",
          binYes: [4, 9, 25, 44],
          binYesLabel: "yes",
          binNoLabel: "no",
          chartNote: "bar chart or pie chart",
        },
      ];
      const vc5 = v5ctxs[getRandomInt(0, 2)];

      // Build summary table HTML
      const summaryRows = vc5.cats.map((cat, i) =>
        `<tr><td class="border border-slate-300 p-2">${cat.charAt(0).toUpperCase() + cat.slice(1)}</td><td class="border border-slate-300 p-2 text-center">${vc5.counts[i]}</td></tr>`
      ).join("");
      const summaryTbl = `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm"><thead><tr><th class="border border-slate-300 p-2 text-left">${vc5.catCol}</th><th class="border border-slate-300 p-2">Frequency</th></tr></thead><tbody>${summaryRows}</tbody></table>`;

      const binYesList = vc5.binYes.join(", ");
      const totalRemaining = vc5.n;

      q = [
        `A random sample of participants took part in a ${vc5.survey}. Their responses were entered into a 'Participant Responses' spreadsheet.`,
        `The spreadsheet includes columns for: Participant number, ${vc5.catCol}, and ${vc5.binCol}.`,
        `<ul><li>Participants ${binYesList} responded '${vc5.binYesLabel}' to ${vc5.binVar}. All other participants responded '${vc5.binNoLabel}'.</li><li>Participant ${vc5.withdrawn} has withdrawn their consent for their data to be used.</li></ul>`,
        `<strong>You must complete parts (a), (b) and (c) using the spreadsheet file.</strong>`,
        `(a) Complete the 'Participant Responses' table using the information above.`,
        `(b) Complete the '${vc5.catCol} Summary' table by entering appropriate spreadsheet formulas.`,
        `(c) Create an appropriate chart to display the frequencies in the '${vc5.catCol} Summary' data.`
      ];
      bq = [
        `${vc5.survey}: participants with ${vc5.binCol} = '${vc5.binYesLabel}': ${binYesList}. Participant ${vc5.withdrawn} withdrawn.`,
        `(a) Complete Participant Responses table. (b) Complete ${vc5.catCol} Summary with COUNTIF formulas. (c) Create chart.`
      ];
      a = [
        `<strong>(a)</strong>`,
        `• Participant ${vc5.withdrawn}: delete this row entirely (consent withdrawn — data must not be included).`,
        `• Participants ${binYesList}: enter '${vc5.binYesLabel}' in the ${vc5.binCol} column.`,
        `• All remaining participants: enter '${vc5.binNoLabel}' in the ${vc5.binCol} column.`,
        `<strong>(b)</strong> The completed ${vc5.catCol} Summary table:`,
        summaryTbl,
        `Use <code>=COUNTIF(range, "${vc5.cats[0]}")</code>, <code>=COUNTIF(range, "${vc5.cats[1]}")</code>, <code>=COUNTIF(range, "${vc5.cats[2]}")</code> to count each category from the ${vc5.catCol} column. Total remaining = ${totalRemaining}.`,
        `<strong>(c)</strong> Insert a ${vc5.chartNote}. Required elements:`,
        `<ul><li>Chart title (e.g. "${vc5.catCol} Summary")</li><li>Axis labels / slice labels showing the ${vc5.catVar} categories</li><li>Frequencies (${vc5.counts.join(", ")}) displayed clearly</li></ul>`,
        `<em>Accept any bar chart or pie chart that includes a title and appropriate labels.</em>`
      ];
      finalAns = `(a) Delete row ${vc5.withdrawn}; fill ${vc5.binCol} column (b) COUNTIF: ${vc5.cats.map((c,i) => `${c}=${vc5.counts[i]}`).join(", ")} (c) bar/pie chart with title + labels`;
    }




  } else if (selectedTopic === "Project Planning (Activity Networks / PERT)") {
    const variation = getRandomInt(1, 9);

    // ---- 5 distinct PERT topologies (tasks in topological order) ----
    const pertTopos = [
      // T1: A→{B,C}; B→D; C→E; {D,E}→F; F→G
      { svgW: 760, svgH: 240, tasks: [
        { id:"A", preds:[] as string[],        x:30,  y:90  },
        { id:"B", preds:["A"],                 x:180, y:30  },
        { id:"C", preds:["A"],                 x:180, y:150 },
        { id:"D", preds:["B"],                 x:330, y:30  },
        { id:"E", preds:["C"],                 x:330, y:150 },
        { id:"F", preds:["D","E"],             x:480, y:90  },
        { id:"G", preds:["F"],                 x:630, y:90  },
      ]},
      // T2: A→{B,C}; {B,C}→D; D→{E,F}; {E,F}→G  (double diamond)
      { svgW: 760, svgH: 240, tasks: [
        { id:"A", preds:[] as string[],        x:30,  y:90  },
        { id:"B", preds:["A"],                 x:180, y:30  },
        { id:"C", preds:["A"],                 x:180, y:150 },
        { id:"D", preds:["B","C"],             x:330, y:90  },
        { id:"E", preds:["D"],                 x:480, y:30  },
        { id:"F", preds:["D"],                 x:480, y:150 },
        { id:"G", preds:["E","F"],             x:630, y:90  },
      ]},
      // T3: A→B; B→{C,D}; C→E; D→F; {E,F}→G; G→H
      { svgW: 910, svgH: 240, tasks: [
        { id:"A", preds:[] as string[],        x:30,  y:90  },
        { id:"B", preds:["A"],                 x:180, y:90  },
        { id:"C", preds:["B"],                 x:330, y:30  },
        { id:"D", preds:["B"],                 x:330, y:150 },
        { id:"E", preds:["C"],                 x:480, y:30  },
        { id:"F", preds:["D"],                 x:480, y:150 },
        { id:"G", preds:["E","F"],             x:630, y:90  },
        { id:"H", preds:["G"],                 x:780, y:90  },
      ]},
      // T4: A→B; B→{C,D}; {C,D}→E; E→{F,G}; {F,G}→H  (two diamonds in series)
      { svgW: 910, svgH: 240, tasks: [
        { id:"A", preds:[] as string[],        x:30,  y:90  },
        { id:"B", preds:["A"],                 x:180, y:90  },
        { id:"C", preds:["B"],                 x:330, y:30  },
        { id:"D", preds:["B"],                 x:330, y:150 },
        { id:"E", preds:["C","D"],             x:480, y:90  },
        { id:"F", preds:["E"],                 x:630, y:30  },
        { id:"G", preds:["E"],                 x:630, y:150 },
        { id:"H", preds:["F","G"],             x:780, y:90  },
      ]},
      // T5: A→{B,C,D}; {B,C}→E; D→F; {E,F}→G  (3-way split then merge)
      { svgW: 615, svgH: 260, tasks: [
        { id:"A", preds:[] as string[],        x:30,  y:100 },
        { id:"B", preds:["A"],                 x:180, y:20  },
        { id:"C", preds:["A"],                 x:180, y:100 },
        { id:"D", preds:["A"],                 x:180, y:170 },
        { id:"E", preds:["B","C"],             x:330, y:60  },
        { id:"F", preds:["D"],                 x:330, y:170 },
        { id:"G", preds:["E","F"],             x:480, y:100 },
      ]},
    ];

    const topo = pertTopos[getRandomInt(0, pertTopos.length - 1)];
    const companies = ["ship repair company", "construction firm", "roofing company", "events management company", "logistics company"];
    const company = companies[getRandomInt(0, companies.length - 1)];
    const units = ["hours", "days", "weeks"];
    const timeUnit = units[getRandomInt(0, 2)];

    // Build task lookup and assign random durations
    const tMap: { [id: string]: typeof topo.tasks[0] } = {};
    const dMap: { [id: string]: number } = {};
    topo.tasks.forEach(t => { tMap[t.id] = t; dMap[t.id] = getRandomInt(2, 10); });

    // Forward + backward scan computation
    const pertRecompute = () => {
      const est: { [id: string]: number } = {};
      for (const t of topo.tasks) {
        est[t.id] = t.preds.length === 0 ? 0 : Math.max(...t.preds.map(p => est[p] + dMap[p]));
      }
      const isPred = new Set(topo.tasks.flatMap(t => t.preds));
      const terms = topo.tasks.filter(t => !isPred.has(t.id));
      const pd = Math.max(...terms.map(t => est[t.id] + dMap[t.id]));
      const lft: { [id: string]: number } = {};
      terms.forEach(t => { lft[t.id] = pd; });
      for (let i = topo.tasks.length - 1; i >= 0; i--) {
        const t = topo.tasks[i];
        if (lft[t.id] !== undefined) continue;
        const succs = topo.tasks.filter(s => s.preds.includes(t.id));
        lft[t.id] = Math.min(...succs.map(s => lft[s.id] - dMap[s.id]));
      }
      const fl: { [id: string]: number } = {};
      topo.tasks.forEach(t => { fl[t.id] = lft[t.id] - dMap[t.id] - est[t.id]; });
      const cp = topo.tasks.filter(t => fl[t.id] === 0).map(t => t.id).join(" → ");
      return { est, lft, fl, pd, cp };
    };

    let { est: estPert, lft: lftPert, fl: floatPert, pd: projDur, cp: critPath } = pertRecompute();

    // Ensure at least one non-critical task (for V2/V3/V4)
    if (topo.tasks.every(t => floatPert[t.id] === 0)) {
      const adjustable = topo.tasks.find(t => t.preds.length > 0 && dMap[t.id] > 2);
      if (adjustable) dMap[adjustable.id]--;
      ({ est: estPert, lft: lftPert, fl: floatPert, pd: projDur, cp: critPath } = pertRecompute());
    }

    // SVG node helper: bottom-left=EST, bottom-mid=dur, bottom-right=LFT
    const pNode = (t: typeof topo.tasks[0], est: number|string, dur: number|string, lft: number|string) =>
      `<g transform="translate(${t.x},${t.y})">` +
      `<rect x="0" y="0" width="90" height="60" fill="white" stroke="black" stroke-width="2"/>` +
      `<line x1="0" y1="30" x2="90" y2="30" stroke="black" stroke-width="2"/>` +
      `<line x1="30" y1="30" x2="30" y2="60" stroke="black" stroke-width="2"/>` +
      `<line x1="60" y1="30" x2="60" y2="60" stroke="black" stroke-width="2"/>` +
      `<text x="45" y="20" text-anchor="middle" font-weight="bold" font-family="sans-serif" font-size="14" fill="black">${t.id}</text>` +
      `<text x="15" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" fill="black">${est}</text>` +
      `<text x="45" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" fill="black">${dur}</text>` +
      `<text x="75" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" fill="black">${lft}</text>` +
      `</g>`;

    const svgDefs = `<defs><marker id="pa" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="black"/></marker></defs>`;
    const allArrows = topo.tasks.flatMap(t => t.preds.map(p =>
      `<line x1="${tMap[p].x+90}" y1="${tMap[p].y+30}" x2="${t.x}" y2="${t.y+30}" stroke="black" stroke-width="2" marker-end="url(#pa)"/>`
    )).join("");

    const svgWrap = (nodes: string) =>
      `<div class="overflow-x-auto my-4 w-full bg-slate-50 border border-slate-200 p-4 rounded text-black text-center flex justify-center">` +
      `<svg width="${topo.svgW}" height="${topo.svgH}" xmlns="http://www.w3.org/2000/svg">${svgDefs}${allArrows}${nodes}</svg></div>`;

    const completedPert = svgWrap(topo.tasks.map(t => pNode(t, estPert[t.id], dMap[t.id], lftPert[t.id])).join(""));
    const blankPert     = svgWrap(topo.tasks.map(t => pNode(t, "", dMap[t.id], "")).join(""));

    const precTable = `<div class="overflow-x-auto my-4 w-full"><table class="table-auto border-collapse border border-slate-400 my-4 text-center mx-auto text-sm bg-white text-slate-800"><thead><tr><th class="border border-slate-400 px-4 py-2 bg-slate-100">Task</th><th class="border border-slate-400 px-4 py-2 bg-slate-100">Preceding Task(s)</th><th class="border border-slate-400 px-4 py-2 bg-slate-100">Duration (${timeUnit})</th></tr></thead><tbody>${topo.tasks.map(t => `<tr><td class="border border-slate-400 px-4 py-2">${t.id}</td><td class="border border-slate-400 px-4 py-2">${t.preds.length === 0 ? "-" : t.preds.join(", ")}</td><td class="border border-slate-400 px-4 py-2">${dMap[t.id]}</td></tr>`).join("")}</tbody></table></div>`;

    const firstId = topo.tasks[0].id;
    const lastId  = topo.tasks[topo.tasks.length - 1].id;
    const nonCrit = topo.tasks.filter(t => floatPert[t.id] > 0);

    if (variation === 1) {
      // Complete the PERT chart
      q = [
        `A ${company} is planning a project.`,
        `The precedence table lists tasks ${firstId} to ${lastId}, their preceding tasks, and their durations in ${timeUnit}.`,
        precTable,
        `A blank activity network (PERT chart) is shown below.`,
        blankPert,
        `Complete the PERT chart showing the earliest start time (EST) and the latest finish time (LFT) for each task.`
      ];
      bq = [
        `${company.charAt(0).toUpperCase() + company.slice(1)} project — tasks ${firstId}–${lastId}.`,
        `Complete the PERT chart (EST and LFT for each task).`
      ];
      a = [
        `<strong>Forward scan</strong> (EST): EST of each task = max(EST + duration) across all preceding tasks. Start task EST = 0.`,
        `<strong>Backward scan</strong> (LFT): project duration = <strong>${projDur} ${timeUnit}</strong>. LFT of each task = min(LFT − duration) across all following tasks.`,
        ...topo.tasks.map(t =>
          `<strong>${t.id}:</strong> EST = ${estPert[t.id]}, dur = ${dMap[t.id]}, LFT = ${lftPert[t.id]}, float = ${floatPert[t.id]}`
        ),
        `<strong>Critical path:</strong> ${critPath}`
      ];
      finalAns = `Critical path: ${critPath} (${projDur} ${timeUnit})`;

    } else if (variation === 2) {
      // Float time for a random non-critical task
      const taskObj = nonCrit.length > 0 ? nonCrit[getRandomInt(0, nonCrit.length - 1)] : topo.tasks[1];
      const tid = taskObj.id;
      const lft2 = lftPert[tid], dur2 = dMap[tid], est2 = estPert[tid];
      const floatTime = floatPert[tid];
      q = [
        `A completed PERT chart for a project is shown below.`,
        completedPert,
        `Calculate the float time for Task ${tid}.`
      ];
      bq = [`Completed PERT chart provided.`, `Calculate the float time for Task ${tid}.`];
      a = [
        `<strong>•¹</strong> Float Time = LFT − Duration − EST`,
        `<strong>•²</strong> Float Time = ${lft2} − ${dur2} − ${est2} = <strong>${floatTime} ${timeUnit}</strong>`
      ];
      finalAns = `${floatTime} ${timeUnit}`;

    } else if (variation === 3) {
      // Max time for a task without delaying the project
      const taskObj = nonCrit.length > 0 ? nonCrit[getRandomInt(0, nonCrit.length - 1)] : topo.tasks[1];
      const tid = taskObj.id;
      const lft3 = lftPert[tid], dur3 = dMap[tid], est3 = estPert[tid];
      const floatVal = floatPert[tid];
      const maxTime = dur3 + floatVal;
      q = [
        `A completed PERT chart for a project is shown below.`,
        completedPert,
        `During the project, there are difficulties completing Task ${tid}.`,
        `Determine the maximum time that can be taken to complete Task ${tid} without delaying the overall completion time of the project.`
      ];
      bq = [
        `Completed PERT chart provided.`,
        `Task ${tid} runs into difficulties.`,
        `Determine maximum time for Task ${tid} without delaying the project.`
      ];
      a = [
        `<strong>•¹</strong> Float Time = LFT − Duration − EST = ${lft3} − ${dur3} − ${est3} = ${floatVal} ${timeUnit}`,
        `<strong>•²</strong> Maximum time = Duration + Float = ${dur3} + ${floatVal} = <strong>${maxTime} ${timeUnit}</strong>`
      ];
      finalAns = `${maxTime} ${timeUnit}`;

    } else if (variation === 4) {
      // V4: Identify the critical path and project duration
      q = [
        `A completed PERT chart for a project is shown below.`,
        completedPert,
        `(a) State the critical path for this project.`,
        `(b) State the minimum time needed to complete the project.`
      ];
      bq = [
        `Completed PERT chart provided.`,
        `(a) State the critical path. (b) State the minimum project duration.`
      ];
      const ncList = nonCrit.map(t => `${t.id} (float = ${floatPert[t.id]} ${timeUnit})`).join(", ");
      a = [
        `<strong>•¹</strong> Tasks with zero float are on the critical path: <strong>${critPath}</strong>`,
        ...(nonCrit.length > 0 ? [`Non-critical tasks: ${ncList}`] : []),
        `<strong>•²</strong> Minimum project duration: <strong>${projDur} ${timeUnit}</strong>`
      ];
      finalAns = `${critPath} — ${projDur} ${timeUnit}`;

    } else if (variation === 5) {
      // V5: Convert total project hours to working days (G18 — 2022 Q2b)
      const hpdOpts5 = [7, 8, 9, 10];
      const hoursPerDay5 = hpdOpts5[getRandomInt(0, 3)];
      const fullDays5 = getRandomInt(5, 11);
      const remainder5 = getRandomInt(1, hoursPerDay5 - 1);
      const totalHours5 = fullDays5 * hoursPerDay5 + remainder5;
      const minDays5 = fullDays5 + 1;
      const projectCtxs5 = [
        "A roofing company",
        "A construction crew",
        "An installation team",
        "A renovation firm",
      ];
      const ctx5 = projectCtxs5[getRandomInt(0, 3)];
      q = [
        `A project network analysis shows the minimum time to complete a project is ${totalHours5} hours.`,
        `${ctx5} works ${hoursPerDay5} hours per day.`,
        `State the minimum number of days needed to complete the project.`
      ];
      bq = [
        `Project minimum time: ${totalHours5} hours. Working day: ${hoursPerDay5} hours.`,
        `Find the minimum number of working days to complete the project.`
      ];
      a = [
        `<strong>•¹</strong> Days = ${totalHours5} ÷ ${hoursPerDay5} = ${(totalHours5 / hoursPerDay5).toFixed(2)}…`,
        `Round up (cannot stop mid-day): <strong>${minDays5} days</strong>`
      ];
      finalAns = `${minDays5} days`;

    } else if (variation === 6) {
      // V6: Can delay be absorbed by float? (G19 — 2023 Q2b)
      const floatOpts6 = [4, 5, 6, 8, 10, 12, 15];
      const float6 = floatOpts6[getRandomInt(0, floatOpts6.length - 1)];
      const absorbed6 = getRandomInt(0, 1) === 1;
      const delay6 = absorbed6
        ? getRandomInt(1, float6 - 1)
        : float6 + getRandomInt(1, 5);
      const taskNames6 = ["Task A", "Task B", "Task C", "Task D"];
      const task6 = taskNames6[getRandomInt(0, 3)];
      const unit6s = ["minutes", "hours", "days"];
      const unit6 = unit6s[getRandomInt(0, 2)];
      const projCtxs6 = [
        `A project network is used to plan a catering event.`,
        `A project network is used to plan a building renovation.`,
        `A project network is used to plan a product launch.`,
        `A project network is used to plan a software installation.`,
      ];
      const ctx6 = projCtxs6[getRandomInt(0, 3)];
      q = [
        ctx6,
        `${task6} has a float of ${float6} ${unit6}.`,
        `Due to an unexpected problem, ${task6} is delayed by ${delay6} ${unit6}.`,
        `Can the project still be completed on time? Give a reason for your answer.`
      ];
      bq = [
        `${task6}: float = ${float6} ${unit6}. Unexpected delay = ${delay6} ${unit6}.`,
        `Can the project still finish on time? Justify.`
      ];
      if (absorbed6) {
        a = [
          `<strong>•¹</strong> Delay (${delay6} ${unit6}) ≤ Float (${float6} ${unit6})`,
          `<strong>•²</strong> <strong>Yes</strong> — the delay is absorbed by the float. Remaining float = ${float6} − ${delay6} = ${float6 - delay6} ${unit6}.`
        ];
        finalAns = `Yes — delay (${delay6}) ≤ float (${float6})`;
      } else {
        a = [
          `<strong>•¹</strong> Delay (${delay6} ${unit6}) > Float (${float6} ${unit6})`,
          `<strong>•²</strong> <strong>No</strong> — the delay exceeds the float by ${delay6 - float6} ${unit6}, so the project will be delayed overall.`
        ];
        finalAns = `No — delay (${delay6}) > float (${float6})`;
      }

    } else if (variation === 7) {
      // V7: Essential vs critical activity definitions (G20 — Spec Q5a)
      const defVariant7 = getRandomInt(0, 1);
      if (defVariant7 === 0) {
        q = [
          `In the context of project planning using activity networks:`,
          `(a) State what is meant by an <strong>essential activity</strong>.`,
          `(b) State what is meant by a <strong>critical activity</strong>.`
        ];
        bq = [`Define: (a) essential activity (b) critical activity.`];
        a = [
          `<strong>•¹ (a)</strong> An <strong>essential activity</strong> is one that must be completed for the project to be finished (it cannot be omitted).`,
          `<strong>•² (b)</strong> A <strong>critical activity</strong> is one where any delay will delay the whole project (it has zero float time).`
        ];
      } else {
        q = [
          `In a project network, some activities are described as essential and others as critical.`,
          `Explain the difference between an essential activity and a critical activity.`
        ];
        bq = [`Explain the difference between an essential and a critical activity.`];
        a = [
          `<strong>•¹</strong> An <strong>essential activity</strong> must be completed for the project to be finished — it cannot be omitted.`,
          `<strong>•²</strong> A <strong>critical activity</strong> has zero float — any delay to it will delay the entire project's completion date.`
        ];
      }
      finalAns = `Essential = must be completed; Critical = zero float, any delay delays project`;

    } else if (variation === 8) {
      // V8: Describe PERT node values — EST, duration, LCT (G21 — Spec Q5b)
      const est8 = getRandomInt(0, 8) * 2;
      const dur8 = getRandomInt(2, 8);
      const extraFloat8 = getRandomInt(0, 4);
      const lct8 = est8 + dur8 + extraFloat8;
      const taskId8 = ["A", "B", "C", "D", "E"][getRandomInt(0, 4)];
      const nodeHtml8 = `<div style="display:inline-block;border:2px solid currentColor;text-align:center;font-family:monospace;min-width:90px;margin:8px 0"><div style="display:flex;border-bottom:1px solid currentColor"><span style="flex:1;padding:4px 8px;border-right:1px solid currentColor">${est8}</span><span style="flex:1;padding:4px 8px">${dur8}</span></div><div style="padding:4px 8px;font-weight:bold">${taskId8}</div><div style="padding:4px 8px;border-top:1px solid currentColor">${lct8}</div></div>`;
      q = [
        `The PERT node for Activity ${taskId8} is shown below.`,
        nodeHtml8,
        `Describe the meaning of each of the three numbers shown in the node.`
      ];
      bq = [
        `PERT node for Activity ${taskId8}: top-left ${est8}, top-right ${dur8}, bottom ${lct8}.`,
        `Describe the meaning of each of the three values in the node.`
      ];
      a = [
        `<strong>•¹</strong> Top-left (<strong>${est8}</strong>) = Earliest Start Time (EST) — the earliest time Activity ${taskId8} can begin.`,
        `<strong>•²</strong> Top-right (<strong>${dur8}</strong>) = Duration — the time required to complete Activity ${taskId8}.`,
        `<strong>•³</strong> Bottom (<strong>${lct8}</strong>) = Latest Completion Time (LCT) — the latest time Activity ${taskId8} must finish to avoid delaying the whole project.`
      ];
      finalAns = `EST = ${est8} | Duration = ${dur8} | LCT = ${lct8}`;

    } else if (variation === 9) {
      // V9: Resource scheduling — minimum time with N workers (G17 — 2025 Q4c)
      // Topology: A (no pred) → B, C, D (all after A) → E (after B, C, D)
      // With unlimited workers: critical path = A + max(B,C,D) + E
      // With 2 workers: A + 2·d_mid + E (must serialise one of the three parallel tasks)

      const v9ctxs = [
        { proj: "market stall setup", A: "Set up tables", B: "Arrange produce", C: "Arrange flowers", D: "Arrange preserves", E: "Set up payment system", unit: "hours" },
        { proj: "packaging line", A: "Prepare workstation", B: "Pack item A", C: "Pack item B", D: "Pack item C", E: "Seal and label all boxes", unit: "minutes" },
        { proj: "event decoration", A: "Clear the hall", B: "Hang banners", C: "Arrange chairs", D: "Set up centrepieces", E: "Final check and lighting", unit: "hours" },
        { proj: "photography session", A: "Set up backdrop", B: "Arrange lighting rig 1", C: "Arrange lighting rig 2", D: "Arrange props", E: "Final test shoot", unit: "minutes" },
      ];
      const vc9 = v9ctxs[getRandomInt(0, 3)];

      const dA9  = getRandomInt(1, 2);
      const dMid = getRandomInt(2, 4);       // B = C = D = dMid (equal for clean arithmetic)
      const dE9  = getRandomInt(2, 4);

      // Compute times
      const timeUnlim9 = dA9 + dMid + dE9;  // A + one parallel batch + E
      const time2W9    = dA9 + 2 * dMid + dE9;  // with 2 workers: 3rd parallel task serialised

      // Build task table HTML
      const taskRows9 = [
        { id: "A", desc: vc9.A, dur: dA9,  pred: "—" },
        { id: "B", desc: vc9.B, dur: dMid, pred: "A" },
        { id: "C", desc: vc9.C, dur: dMid, pred: "A" },
        { id: "D", desc: vc9.D, dur: dMid, pred: "A" },
        { id: "E", desc: vc9.E, dur: dE9,  pred: "B, C, D" },
      ];
      const tbl9 = `<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm"><thead><tr><th class="border border-slate-300 p-2">Task</th><th class="border border-slate-300 p-2 text-left">Description</th><th class="border border-slate-300 p-2">Duration (${vc9.unit})</th><th class="border border-slate-300 p-2">Predecessor</th></tr></thead><tbody>${taskRows9.map(r => `<tr><td class="border border-slate-300 p-2 text-center font-bold">${r.id}</td><td class="border border-slate-300 p-2">${r.desc}</td><td class="border border-slate-300 p-2 text-center">${r.dur}</td><td class="border border-slate-300 p-2 text-center">${r.pred}</td></tr>`).join("")}</tbody></table>`;

      // Show worker schedule for 2-worker answer
      const ph1end = dA9 + dMid;       // B and C finish together
      const ph2end = dA9 + 2 * dMid;   // D finishes (done after B/C pair)
      const ph3end = ph2end + dE9;      // E finishes

      q = [
        `A team is working on a ${vc9.proj}. The tasks required are shown below.`,
        tbl9,
        `The critical path is A → B → E (or A → C → E or A → D → E), giving a minimum project time of ${timeUnlim9} ${vc9.unit} with sufficient workers.`,
        `Determine the minimum time to complete the project when only <strong>2 workers</strong> are available.`
      ];
      bq = [
        `${vc9.proj}: 5 tasks A–E. A first, then B/C/D in parallel (${dMid} ${vc9.unit} each), then E.`,
        `Critical path time (unlimited workers): ${timeUnlim9} ${vc9.unit}. With only 2 workers, find minimum time.`
      ];
      a = [
        `With only 2 workers, tasks B, C, and D cannot all run simultaneously after A completes — one must wait.`,
        `<strong>Optimal schedule:</strong>`,
        `• ${vc9.unit} 0–${dA9}: A (1 worker; other worker waits — no available task)`,
        `• ${vc9.unit} ${dA9}–${ph1end}: B and C simultaneously (both workers busy)`,
        `• ${vc9.unit} ${ph1end}–${ph2end}: D (one worker; E cannot start until D is done)`,
        `• ${vc9.unit} ${ph2end}–${ph3end}: E`,
        `<strong>Minimum time = ${time2W9} ${vc9.unit}</strong>`
      ];
      finalAns = `${time2W9} ${vc9.unit}`;
    }
  } else if (selectedTopic === "Gantt Charts") {
    const variation = getRandomInt(1, 4);
    const timeUnits = ["hours", "days", "weeks"];
    const tUnit = timeUnits[getRandomInt(0, 2)];

    // Shared topology: A→B→{C,D}→E→F (C and D parallel, E waits for both)
    const durA = getRandomInt(2, 4);
    const durB = getRandomInt(2, 4);
    const durC = getRandomInt(2, 5);
    let durD = getRandomInt(2, 5);
    if (durD === durC) durD += getRandomInt(1, 2); // ensure C ≠ D for clear bottleneck
    const durE = getRandomInt(2, 4);
    const durF = getRandomInt(1, 3);

    const sA = 0,  eA = durA;
    const sB = eA, eB = sB + durB;
    const sC = eB, eC = sC + durC;
    const sD = eB, eD = sD + durD;
    const sE = Math.max(eC, eD), eE = sE + durE;
    const sF = eE, eF = sF + durF;
    const totalDur = eF;

    const unit = 24;   // px per time unit
    const oX   = 40;   // left margin
    const oY   = 40;   // top of grid
    const rH   = 30;   // row height
    const cols  = totalDur + 1;
    const svgW  = oX + cols * unit + 20;
    const svgH  = oY + 6 * rH + 20;

    const taskData = [
      { id:"A", s:sA, d:durA },
      { id:"B", s:sB, d:durB },
      { id:"C", s:sC, d:durC },
      { id:"D", s:sD, d:durD },
      { id:"E", s:sE, d:durE },
      { id:"F", s:sF, d:durF },
    ];

    const buildGanttSvg = (showBars: boolean) => {
      const labels = taskData.map((t, i) =>
        `<text x="20" y="${oY + i*rH + 20}" font-family="sans-serif" font-size="13" fill="black">${t.id}</text>`
      ).join("");
      const hLines = Array.from({length: 7}, (_, i) =>
        `<line x1="${oX}" y1="${oY + i*rH}" x2="${oX + cols*unit}" y2="${oY + i*rH}" stroke="#ccc"/>`
      ).join("");
      const vLines = Array.from({length: cols + 1}, (_, i) =>
        `<line x1="${oX + i*unit}" y1="${oY}" x2="${oX + i*unit}" y2="${oY + 6*rH}" stroke="#ccc"/>`
      ).join("");
      const timeLabels = Array.from({length: cols + 1}, (_, i) =>
        `<text x="${oX + i*unit}" y="${oY - 8}" font-family="sans-serif" font-size="11" text-anchor="middle" fill="black">${i}</text>`
      ).join("");
      const bars = showBars ? taskData.map((t, i) =>
        `<rect x="${oX + t.s * unit}" y="${oY + i*rH + 5}" width="${t.d * unit - 1}" height="${rH - 10}" fill="#4b5563"/>`
      ).join("") : "";
      return `<div class="overflow-x-auto my-4 w-full bg-slate-50 border border-slate-200 p-4 rounded text-black text-center flex justify-center"><svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg">${labels}${hLines}${vLines}${timeLabels}${bars}</svg></div>`;
    };

    const blankGantt     = buildGanttSvg(false);
    const completedGantt = buildGanttSvg(true);
    const constraintTask = eC > eD ? "C" : "D";
    const constraintEnd  = Math.max(eC, eD);
    const otherTask      = constraintTask === "C" ? "D" : "C";
    const otherEnd       = Math.min(eC, eD);

    const precedenceTable = `<div class="overflow-x-auto my-4 w-full flex justify-center"><table class="table-auto border-collapse border border-slate-400 text-center text-sm bg-white text-slate-800"><thead><tr><th class="border border-slate-400 px-4 py-2 bg-slate-100">Task</th><th class="border border-slate-400 px-4 py-2 bg-slate-100">Preceding Task(s)</th><th class="border border-slate-400 px-4 py-2 bg-slate-100">Duration (${tUnit})</th></tr></thead><tbody><tr><td class="border border-slate-400 px-4 py-2">A</td><td class="border border-slate-400 px-4 py-2">−</td><td class="border border-slate-400 px-4 py-2">${durA}</td></tr><tr><td class="border border-slate-400 px-4 py-2">B</td><td class="border border-slate-400 px-4 py-2">A</td><td class="border border-slate-400 px-4 py-2">${durB}</td></tr><tr><td class="border border-slate-400 px-4 py-2">C</td><td class="border border-slate-400 px-4 py-2">B</td><td class="border border-slate-400 px-4 py-2">${durC}</td></tr><tr><td class="border border-slate-400 px-4 py-2">D</td><td class="border border-slate-400 px-4 py-2">B</td><td class="border border-slate-400 px-4 py-2">${durD}</td></tr><tr><td class="border border-slate-400 px-4 py-2">E</td><td class="border border-slate-400 px-4 py-2">C, D</td><td class="border border-slate-400 px-4 py-2">${durE}</td></tr><tr><td class="border border-slate-400 px-4 py-2">F</td><td class="border border-slate-400 px-4 py-2">E</td><td class="border border-slate-400 px-4 py-2">${durF}</td></tr></tbody></table></div>`;

    if (variation === 1) {
      q = [
        `A project consists of 6 tasks (A to F). The precedence table is shown below.`,
        precedenceTable,
        `Construct a Gantt chart without float times for this project on the grid provided.`,
        blankGantt
      ];
      bq = [
        `6 tasks (A–F) with precedence table.`,
        `Construct a Gantt chart (without float times).`
      ];
      a = [
        `<strong>•¹</strong> A: ${sA}–${eA} | B: ${sB}–${eB} | C: ${sC}–${eC} | D: ${sD}–${eD}`,
        `<strong>•²</strong> C and D run in parallel from ${tUnit} ${sC}. Task ${constraintTask} finishes last (${tUnit} ${constraintEnd}), so E starts at ${tUnit} ${sE}.`,
        `<strong>•³</strong> E: ${sE}–${eE} | F: ${sF}–${eF} — total project duration: ${totalDur} ${tUnit}`,
        completedGantt,
        `<em>Note: SQA penalises drawing float times when asked for a chart "without float times."</em>`
      ];
      finalAns = `Completed Gantt chart — ${totalDur} ${tUnit}`;

    } else if (variation === 2) {
      q = [
        `A completed Gantt chart for a project is shown below.`,
        completedGantt,
        `Task E is dependent on the completion of two earlier tasks. State the task that determines when Task E can start, justifying your answer.`
      ];
      bq = [
        `Completed Gantt chart provided.`,
        `Which task determines when E can start? Justify.`
      ];
      a = [
        `<strong>•¹</strong> Tasks C and D both run from ${tUnit} ${sC}.`,
        `<strong>•²</strong> Task ${constraintTask} finishes at ${tUnit} ${constraintEnd}; Task ${otherTask} finishes earlier at ${tUnit} ${otherEnd}.`,
        `<strong>•³</strong> Task <strong>${constraintTask}</strong> determines when E can start, as it takes longer to complete.`
      ];
      finalAns = `Task ${constraintTask}`;

    } else if (variation === 3) {
      q = [
        `A project manager decides to use a Gantt chart rather than a precedence table or PERT chart to present the schedule to their team.`,
        `State one advantage of using a Gantt chart for this purpose.`
      ];
      bq = [
        `Project manager uses Gantt chart instead of PERT/precedence table to present to their team.`,
        `State ONE advantage of a Gantt chart.`
      ];
      a = [
        `"It is clear and simple to read." OR`,
        `"It visually represents the relative length of time for each activity." OR`,
        `"It makes it easy to see where activities overlap."`,
        `<em>Do NOT accept "shows order of precedence" — PERT charts are better for that.</em>`
      ];
      finalAns = `Visually represents time / Simple to read`;

    } else {
      const floatDays = getRandomInt(2, 5);
      const critDur   = getRandomInt(22, 35);
      const offCritTask = ["Plastering", "Painting", "Landscaping", "Tiling"][getRandomInt(0, 3)];
      const critTask1   = ["Electrical", "Plumbing", "Roofing", "Carpentry"][getRandomInt(0, 3)];
      const critTask2   = ["Insulation", "Brickwork", "Flooring"][getRandomInt(0, 2)];
      q = [
        `A Gantt chart shows that three tasks (${critTask1}, ${critTask2}, and ${offCritTask}) are scheduled to run simultaneously.`,
        `The critical path length of the project is ${critDur} days.`,
        `Each task requires one independent tradesperson. However, the company only has 2 tradespeople available.`,
        `Task '${offCritTask}' has ${floatDays} days of float time; ${critTask1} and ${critTask2} are on the critical path.`,
        `Explain the effect, if any, on the minimum time to complete the project.`
      ];
      bq = [
        `3 tasks running simultaneously: ${critTask1}, ${critTask2}, ${offCritTask}.`,
        `Critical path = ${critDur} days. Only 2 tradespeople. '${offCritTask}' has ${floatDays} days float.`,
        `Explain the effect on minimum project completion time.`
      ];
      a = [
        `<strong>•¹</strong> With only 2 tradespeople for 3 simultaneous tasks, one task must be delayed.`,
        `<strong>•²</strong> ${offCritTask} has ${floatDays} days float — it can start up to ${floatDays} days late without delaying the project.`,
        `<strong>•³</strong> If ${offCritTask} can be rescheduled within its float, the minimum project duration <strong>remains ${critDur} days</strong>.`
      ];
      finalAns = `No change — ${offCritTask} absorbed within ${floatDays}-day float`;
    }

  } else if (selectedTopic === "Risk & Expected Value") {
    const variation = getRandomInt(1, 6);
    if (variation === 1) {
      const companies = ["logistics firm", "electric vehicle charging company", "construction company"];
      const company = companies[getRandomInt(0, 2)];
      const projects = ["install 500 charging points", "build a new school", "ship a freight container"];
      const project = projects[getRandomInt(0, 2)];
      const penalty = getRandStep(45000, 150000, 5000);
      const probDelay = getRandStep(125, 475, 25) / 1000;
      
      q = [
        `A ${company} has been awarded a contract to ${project}.`,
        `If the project is delayed, the company faces a fixed penalty of £${penalty.toLocaleString()}.`,
        `The company has identified two potential delays: a shortage of parts and bad weather.`,
        `There is a ${probDelay.toFixed(3)} probability that one or both of these delays will happen.`,
        `Calculate the expected cost of a delay.`
      ];
      
      bq = [
        `Contract to ${project}.`,
        `Delay penalty: £${penalty.toLocaleString()}.`,
        `Probability of delay: ${probDelay.toFixed(3)}.`,
        `Calculate expected cost of delay.`
      ];
      
      const expectedCost = probDelay * penalty;
      
      a = [
        `<strong>1.</strong> Expected Cost Formula: Probability \\times Penalty Amount`,
        `<strong>2.</strong> Calculation: ${probDelay.toFixed(3)} \\times ${penalty} = £${expectedCost.toLocaleString()}`
      ];
      finalAns = `£${expectedCost.toLocaleString()}`;
    } else if (variation === 2) {
      const penalty = getRandStep(50000, 120000, 10000);
      const probOrig = getRandStep(20, 45, 5) / 100;
      const upfrontCost = getRandStep(8000, 18000, 500);
      const probNew = getRandStep(2, 9, 1) / 100;
      
      q = [
        `A company faces a fixed penalty of £${penalty.toLocaleString()} if a shipment is damaged.`,
        `The current probability of damage is ${probOrig.toFixed(2)}.`,
        `The company is considering using a control measure: upgrading to protective packaging.`,
        `This costs £${upfrontCost.toLocaleString()} to implement, but reduces the probability of damage to ${probNew.toFixed(2)}.`,
        `Calculate the overall expected cost of using this control measure.`
      ];
      
      bq = [
        `Penalty for damage: £${penalty.toLocaleString()}.`,
        `Original probability: ${probOrig.toFixed(2)}`,
        `Control measure cost: £${upfrontCost.toLocaleString()}, New probability: ${probNew.toFixed(2)}`,
        `Calculate overall expected cost.`
      ];
      
      const newExpPenalty = probNew * penalty;
      const overallCost = newExpPenalty + upfrontCost;
      
      a = [
        `<strong>1.</strong> Calculate new expected penalty: ${probNew.toFixed(2)} \\times ${penalty} = £${newExpPenalty.toLocaleString()}`,
        `<strong>2.</strong> Add the upfront cost of the control measure: ${newExpPenalty.toLocaleString()} + ${upfrontCost.toLocaleString()}`,
        `<strong>3.</strong> Overall Expected Cost = £${overallCost.toLocaleString()}`
      ];
      finalAns = `£${overallCost.toLocaleString()}`;
    } else if (variation === 3) {
      const penalty = getRandStep(75000, 200000, 25000);
      const cost1 = getRandStep(10000, 20000, 1000);
      const prob1 = getRandStep(10, 15, 1) / 100;
      const cost2 = getRandStep(15000, 35000, 1000);
      const prob2 = getRandStep(2, 8, 1) / 100;
      
      q = [
        `A company faces a penalty of £${penalty.toLocaleString()} for missed deadlines. They can only choose one of two control measures.`,
        `Control Measure 1: Import extra parts. Cost: £${cost1.toLocaleString()}. New delay probability: ${prob1.toFixed(2)}.`,
        `Control Measure 2: Hire extra staff. Cost: £${cost2.toLocaleString()}. New delay probability: ${prob2.toFixed(2)}.`,
        `Based on your calculations of overall expected costs, explain which control measure the company should use to minimise costs.`
      ];
      
      bq = [
        `Penalty: £${penalty.toLocaleString()}.`,
        `Measure 1: Cost £${cost1.toLocaleString()}, prob ${prob1.toFixed(2)}.`,
        `Measure 2: Cost £${cost2.toLocaleString()}, prob ${prob2.toFixed(2)}.`,
        `Calculate costs to identify which measure to use.`
      ];
      
      const expCost1 = (prob1 * penalty) + cost1;
      const expCost2 = (prob2 * penalty) + cost2;
      
      let cheaperOption, cheaperTotal, expOption, expTotal;
      if (expCost1 < expCost2) {
        cheaperOption = "1";
        cheaperTotal = expCost1;
        expOption = "2";
        expTotal = expCost2;
      } else {
        cheaperOption = "2";
        cheaperTotal = expCost2;
        expOption = "1";
        expTotal = expCost1;
      }
      
      a = [
        `<strong>1.</strong> Overall Expected Cost 1: (${prob1.toFixed(2)} \\times ${penalty}) + ${cost1} = £${expCost1.toLocaleString()}.`,
        `<strong>2.</strong> Overall Expected Cost 2: (${prob2.toFixed(2)} \\times ${penalty}) + ${cost2} = £${expCost2.toLocaleString()}.`,
        `<strong>3.</strong> Conclusion: The company should use Control Measure ${cheaperOption} because its overall expected cost of £${cheaperTotal.toLocaleString()} is less than Control Measure ${expOption}'s cost of £${expTotal.toLocaleString()}.`
      ];
      finalAns = `Measure ${cheaperOption} (£${cheaperTotal.toLocaleString()})`;
    } else if (variation === 4) {
      const companies = ["construction firm", "flooring manufacturer", "logistics company"];
      const company = companies[getRandomInt(0, 2)];
      const r1List = ["manufacturing delays", "part shortages", "bad weather"];
      const r1 = r1List[getRandomInt(0, 2)];
      const r2List = ["delivery delays", "staff illnesses", "vehicle breakdowns"];
      const r2 = r2List[getRandomInt(0, 2)];
      const penalty = getRandStep(80000, 150000, 5000);
      const cost1 = getRandStep(15000, 25000, 1000);
      const cost2 = getRandStep(10000, 18000, 500);
      const baseCombined = cost1 + cost2;
      const expOrig = baseCombined + getRandStep(5000, 15000, 1000);
      const expCost1 = baseCombined + getRandStep(2000, 8000, 1000);
      const expCost2 = baseCombined + getRandStep(1000, 6000, 1000);
      
      q = [
        `A ${company} faces a penalty of £${penalty.toLocaleString()} if a project is delayed.`,
        `There are two independent reasons for delay: ${r1} and ${r2}.`,
        `The expected cost of a delay without any control measures is £${expOrig.toLocaleString()}.`,
        `The company is considering two control measures:`,
        `Control Measure 1: Eliminates the risk of ${r1} at a cost of £${cost1.toLocaleString()}. The expected cost of a delay using only Measure 1 is £${expCost1.toLocaleString()}.`,
        `Control Measure 2: Eliminates the risk of ${r2} at a cost of £${cost2.toLocaleString()}. The expected cost of a delay using only Measure 2 is £${expCost2.toLocaleString()}.`,
        `The company decides to use both control measures.`,
        `Based on calculations, explain why the company decided to use both control measures.`
      ];
      
      bq = [
        `${company.charAt(0).toUpperCase() + company.slice(1)} faces penalty £${penalty.toLocaleString()}.`,
        `Original expected cost = £${expOrig.toLocaleString()}.`,
        `Measure 1: Eliminates ${r1}. Cost £${cost1.toLocaleString()}. Expected cost alone = £${expCost1.toLocaleString()}.`,
        `Measure 2: Eliminates ${r2}. Cost £${cost2.toLocaleString()}. Expected cost alone = £${expCost2.toLocaleString()}.`,
        `Calculate expected cost if BOTH are used to explain why they did.`
      ];
      
      a = [
        `<strong>1.</strong> Calculate the cost of implementing BOTH measures: ${cost1.toLocaleString()} + ${cost2.toLocaleString()} = ${baseCombined.toLocaleString()}.`,
        `<strong>2.</strong> Contextual logic: Because both independent reasons for delay are eliminated, the new probability of a delay is 0. Therefore, the expected penalty is £0.`,
        `<strong>3.</strong> Overall expected cost of using both measures = £${baseCombined.toLocaleString()}.`,
        `<strong>4.</strong> Conclusion: The company used both measures because the combined overall expected cost of £${baseCombined.toLocaleString()} is cheaper than doing nothing (£${expOrig.toLocaleString()}), using only Measure 1 (£${expCost1.toLocaleString()}), or using only Measure 2 (£${expCost2.toLocaleString()}).`
      ];
      finalAns = `Combined expected cost of £${baseCombined.toLocaleString()} is lowest`;

    } else if (variation === 5) {
      // V5: Two independent risks → P(at least one) using complement rule — 2026 Q9 pattern
      const risk1Names = ["manufacturing delay", "parts shortage", "equipment failure", "staff illness"];
      const risk2Names = ["delivery delay", "bad weather", "supplier delay", "transport disruption"];
      const r5A = risk1Names[getRandomInt(0, risk1Names.length - 1)];
      let r5B = risk2Names[getRandomInt(0, risk2Names.length - 1)];
      const penaltyV5  = getRandStep(60000, 200000, 10000);
      // Pick clean probabilities (multiples of 0.05 to keep arithmetic tidy)
      const p5A = getRandStep(15, 35, 5) / 100;   // P(risk A) e.g. 0.15–0.35
      const p5B = getRandStep(10, 30, 5) / 100;   // P(risk B) e.g. 0.10–0.30
      const q5A = +(1 - p5A).toFixed(2);
      const q5B = +(1 - p5B).toFixed(2);
      const pNone  = +(q5A * q5B).toFixed(4);
      const pDelay = +(1 - pNone).toFixed(4);
      const expCostV5 = Math.round(pDelay * penaltyV5);

      const contexts5 = [
        { co: "construction company", proj: "complete a new office block" },
        { co: "logistics firm",       proj: "deliver a large freight order on time" },
        { co: "renewable energy firm",proj: "install a wind turbine array" },
        { co: "event management company", proj: "organise a major outdoor festival" },
      ];
      const ctx5 = contexts5[getRandomInt(0, contexts5.length - 1)];

      q = [
        `A ${ctx5.co} has been contracted to ${ctx5.proj}.`,
        `If the project is delayed, the company faces a penalty of £${penaltyV5.toLocaleString()}.`,
        `Two independent risks have been identified:`,
        `• ${r5A.charAt(0).toUpperCase() + r5A.slice(1)}: probability ${p5A.toFixed(2)}`,
        `• ${r5B.charAt(0).toUpperCase() + r5B.slice(1)}: probability ${p5B.toFixed(2)}`,
        `(a) Calculate the probability that at least one of these delays occurs.`,
        `(b) Calculate the expected cost of a delay.`
      ];
      bq = [
        `Penalty: £${penaltyV5.toLocaleString()}.`,
        `Two independent risks: P(${r5A}) = ${p5A.toFixed(2)}, P(${r5B}) = ${p5B.toFixed(2)}.`,
        `(a) P(at least one delay)? (b) Expected cost?`
      ];
      a = [
        `<strong>•¹</strong> P(no delay at all) = P(no ${r5A}) × P(no ${r5B}) = ${q5A} × ${q5B} = ${pNone}`,
        `<strong>•²</strong> P(at least one delay) = 1 − ${pNone} = <strong>${pDelay}</strong>`,
        `<strong>•³</strong> Expected cost = ${pDelay} × £${penaltyV5.toLocaleString()} = <strong>£${expCostV5.toLocaleString()}</strong>`
      ];
      finalAns = `P(delay) = ${pDelay}; Expected cost = £${expCostV5.toLocaleString()}`;
    } else if (variation === 6) {
      // Given P(no delay), derive P(delay) = 1 − P(no delay) → expected cost — 2025 Q7(a) pattern
      const contexts6 = [
        { co: "logistics company",          proj: "deliver a large shipment on time",         noEvent: "no delivery delay" },
        { co: "construction firm",           proj: "complete a renovation on schedule",        noEvent: "no construction delay" },
        { co: "event management company",    proj: "run a major outdoor event on time",        noEvent: "no adverse weather" },
        { co: "manufacturing company",       proj: "complete a production run on schedule",    noEvent: "no equipment failure" },
        { co: "renewable energy company",    proj: "install solar panels within the deadline", noEvent: "no parts shortage" },
      ];
      const ctx6 = contexts6[getRandomInt(0, contexts6.length - 1)];
      const penalty6 = getRandStep(15000, 80000, 5000);
      const pNoDelay6 = getRandStep(60, 85, 5) / 100;
      const pDelay6 = +(1 - pNoDelay6).toFixed(2);
      const expCost6 = Math.round(pDelay6 * penalty6);

      q = [
        `A ${ctx6.co} has been contracted to ${ctx6.proj}.`,
        `If the project is delayed, the company faces a penalty of £${penalty6.toLocaleString()}.`,
        `The probability of ${ctx6.noEvent} is ${pNoDelay6.toFixed(2)}.`,
        `(a) Calculate the probability of a delay.`,
        `(b) Calculate the expected cost of a delay.`
      ];
      bq = [
        `${ctx6.co.charAt(0).toUpperCase() + ctx6.co.slice(1)}: penalty £${penalty6.toLocaleString()}.`,
        `P(${ctx6.noEvent}) = ${pNoDelay6.toFixed(2)}.`,
        `(a) P(delay)? (b) Expected cost?`
      ];
      a = [
        `<strong>•¹ (a)</strong> P(delay) = 1 − P(${ctx6.noEvent}) = 1 − ${pNoDelay6.toFixed(2)} = <strong>${pDelay6.toFixed(2)}</strong>`,
        `<strong>•² (b)</strong> Expected cost = ${pDelay6.toFixed(2)} × £${penalty6.toLocaleString()} = <strong>£${expCost6.toLocaleString()}</strong>`
      ];
      finalAns = `P(delay) = ${pDelay6.toFixed(2)}; Expected cost = £${expCost6.toLocaleString()}`;
    }


  } else {
    q = [ `Question generation not available for ${selectedTopic}.` ];
    a = [ `<strong>1.</strong> Not available.` ];
    finalAns = `N/A`;
  }

  return {
    subTopic: selectedTopic,
    questionLines: q,
    boardQuestionLines: bq || q,
    solutionSteps: a,
    finalAnswer: finalAns,
    ...(attachments && { attachments })
  };
}
