export const higherAppsMaths2023 = {
  year: 2023,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 Q1</span></strong></small>
<p>A school year in Scotland usually lasts 190 days.</p>
<p>Estimate the total number of hours that a typical pupil in Scotland will spend in school during their lifetime.<br>State any further assumptions you make.</p>`,
          answer: `<p>Assumptions: 11-15 years of schooling, 5-8 hours per day.<br>Calculation example: \\(5 \\times 190 \\times 11 = 10450\\) hours or \\(8 \\times 190 \\times 15 = 22800\\) hours.</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "35s",
          marks: [3],
          topics: ["Mathematical Modelling"],
          subtopics: ["Fermi Estimation"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 Q2</span></strong></small>
<p>In a cooking competition, a contestant has 80 minutes to make a crème brûlée.</p>
<p>There are several tasks that need to be completed to make the crème brûlée. The contestant's timings for each task are shown.</p>
<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Task</th>
      <th class="border border-slate-300 p-2 text-left">Description</th>
      <th class="border border-slate-300 p-2 text-left">Preceding task</th>
      <th class="border border-slate-300 p-2 text-left">Time (minutes)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2">A</td><td class="border border-slate-300 p-2">heat oven</td><td class="border border-slate-300 p-2">none</td><td class="border border-slate-300 p-2">8</td></tr>
    <tr><td class="border border-slate-300 p-2">B</td><td class="border border-slate-300 p-2">gather ingredients and prepare bowls</td><td class="border border-slate-300 p-2">none</td><td class="border border-slate-300 p-2">10</td></tr>
    <tr><td class="border border-slate-300 p-2">C</td><td class="border border-slate-300 p-2">whisk egg yolks and sugar</td><td class="border border-slate-300 p-2">B</td><td class="border border-slate-300 p-2">5</td></tr>
    <tr><td class="border border-slate-300 p-2">D</td><td class="border border-slate-300 p-2">heat double cream in pan</td><td class="border border-slate-300 p-2">B</td><td class="border border-slate-300 p-2">4</td></tr>
    <tr><td class="border border-slate-300 p-2">E</td><td class="border border-slate-300 p-2">add cream to egg yolk mixture</td><td class="border border-slate-300 p-2">C, D</td><td class="border border-slate-300 p-2">2</td></tr>
    <tr><td class="border border-slate-300 p-2">F</td><td class="border border-slate-300 p-2">sieve mixture and put into bowls</td><td class="border border-slate-300 p-2">E</td><td class="border border-slate-300 p-2">4</td></tr>
    <tr><td class="border border-slate-300 p-2">G</td><td class="border border-slate-300 p-2">put bowls into oven and cook</td><td class="border border-slate-300 p-2">A, F</td><td class="border border-slate-300 p-2">35</td></tr>
    <tr><td class="border border-slate-300 p-2">H</td><td class="border border-slate-300 p-2">tidy workspace</td><td class="border border-slate-300 p-2">F</td><td class="border border-slate-300 p-2">12</td></tr>
    <tr><td class="border border-slate-300 p-2">I</td><td class="border border-slate-300 p-2">sprinkle caster sugar over each bowl and caramelise</td><td class="border border-slate-300 p-2">G</td><td class="border border-slate-300 p-2">3</td></tr>
    <tr><td class="border border-slate-300 p-2">J</td><td class="border border-slate-300 p-2">plate up and serve</td><td class="border border-slate-300 p-2">I</td><td class="border border-slate-300 p-2">5</td></tr>
  </tbody>
</table>
<p>(a) Complete the PERT chart below to allow the contestant to determine the earliest start time and latest completion time for each task.</p>
<img src="/img/Higherapps_Past_Papers/2023/2023_Q2_1.png" alt="Blank PERT chart">
<p>When the contestant puts the bowls into the oven, they realise the oven has not been heated.</p>
<p>(b) Determine whether they can still finish on time. Give a reason for your answer.</p>`,
          answer: `<p>(a) Completed PERT chart:</p>
<img src="/img/Higherapps_Past_Papers/2023/2023_Q2_2.png" alt="Completed PERT chart showing forward and backward scans">
<p>(b) Yes, because task A takes 8 minutes and there are 16 minutes to spare (or 72 minutes earliest completion time compared to 80 minutes allowed).</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "165s",
          marks: [6, 2],
          topics: ["Planning & Decision Making"],
          subtopics: ["PERT Charts & Critical Paths"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 Q3</span></strong></small>
<p>An online survey is sent out by email to people on the electoral register who live in Renfrewshire.</p>
<p>The aim of the survey is to determine which political party people intend to vote for in an upcoming election.</p>
<p>The survey asks participants to answer the following questions:<br>
- State your age in years.<br>
- State your gender. Please select from: male, female, non-binary, other, prefer not to say.<br>
- Which political party do you intend to vote for in the upcoming election?<br>
- Did you vote in the last election? Please select from: yes, no, don't know, prefer not to say.<br>
- If yes, state which political party you did vote for in the last election.</p>
<p>(a) State the type of data that best describes:<br>
(i) age<br>
(ii) gender.</p>
<p>The results of the online survey are to be used to predict the outcome of an upcoming national election.</p>
<p>(b) Give two reasons why these results do not provide a representative sample of the national population to allow the prediction to be accurate.</p>`,
          answer: `<p>(a)(i) Discrete numerical or discrete quantitative.<br>
(a)(ii) (Nominal) categorical or qualitative.<br>
(b) E.g., it is a local survey and not a national survey; not all voters will be able to access the survey online; people could vote multiple times online; invite goes into junk mail.</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "540s",
          marks: [1, 1, 2],
          topics: ["Statistics & Probability"],
          subtopics: ["Statistical Literacy", "Experiment Design & Bias"]
        },
        {
          requiresPreRelease: true,
          dataBookletSection: 1,
          dataBookletLabel: "Tax Bands",
          question: `<small><strong><span style="white-space: nowrap;">2023 Q4</span></strong></small>
<p><strong>You must refer to the information on 'Scottish Tax Bands 2022/23' given in the pre-release material when answering this question.</strong></p>
<p>James works for a large building company. He is a permanent employee and earns a gross annual salary of £36,700.</p>
<p>James pays 4.7% of his gross annual salary into his pension and pays £3071.45 National Insurance per annum.</p>
<p>Calculate his net annual salary after all deductions.</p>`,
          answer: `<p>Taxable income after pension deductions: £34,975.10.<br>
Total tax payable: £4552.27.<br>
Annual net salary: £27,351.38.</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "746s",
          marks: [4],
          topics: ["Finance"],
          subtopics: ["Pay, Tax & National Insurance"]
        },
        {
          dataBookletSection: 3,
          dataBookletLabel: "R Commands",
          attachments: [
            { name: "Q5 Coffee.csv", url: "/resources/higher-apps/data/2023/Q5 Coffee.csv", type: "csv" },
            { name: "Q5 Coffee Answers.docx", url: "/resources/higher-apps/data/2023/Q5 Coffee Answers.docx", type: "docx" }
          ],
          question: `<small><strong><span style="white-space: nowrap;">2023 Q5</span></strong></small>
<p><strong>You must refer to the spreadsheet file 'Q5 Coffee.csv' for the data, and the word file 'Q5 Coffee Answers.docx' when answering this question.<br>
You must complete parts (a), (b) (i), and (c) (i) using appropriate statistical software.<br>
You must include all output from statistical software, and your answers in the word processing file 'Q5 Coffee answers.docx'.</strong></p>
<p>A specialist coffee shop sells 22 different drinks. For each drink the following data are provided: carbohydrate content (grams), number of calories (kCals). The number of calories is dependent on the carbohydrate content of the drink.</p>
<p>(a) Construct a scatter plot of number of calories on carbohydrate content.</p>
<p>(b)(i) Find the correlation coefficient between number of calories and carbohydrate content.</p>
<p>(b)(ii) Interpret the correlation coefficient.</p>
<p>(c)(i) Find the equation of the regression line of number of calories on carbohydrate content.</p>
<p>(c)(ii) Interpret the slope and intercept parameters.</p>
<p>(d) Estimate the number of calories in a drink which has 59 g of carbohydrate.</p>`,
          answer: `<p>(a) Scatter plot generated via software with appropriate title and axes labels.<br>
(b)(i) \\(r = 0.962\\) (from software output).<br>
(b)(ii) This suggests there is a strong positive linear association between carbohydrate and calories.<br>
(c)(i) calories = \\(73.65 + 4.65 \\times\\) carbohydrate (from software output).<br>
(c)(ii) Slope: The number of calories increases by 4.65 (kCal) for every additional 1 gram of carbohydrate. Intercept: The number of calories in a drink with 0g carbohydrate content would be 73.65 (kCal).<br>
(d) 348 (kCal).</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "1125s",
          marks: [2, 2, 1, 2, 2, 1],
          topics: ["Statistics & Probability", "RStudio"],
          subtopics: ["Correlation & Regression"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 Q6</span></strong></small>
<p>The Gantt chart below shows the activities required to complete a project.</p>
<img src="/img/Higherapps_Past_Papers/2023/2023_Q6.png" alt="Gantt chart for project activities A to H">
<p>Activity G is dependent on activities F and H.<br>
Activity F is dependent on activities B, C and E.<br>
Activity E is dependent on activity D.<br>
Activities C and B are dependent on activity A.</p>
<p>(a) State the critical path for this project.</p>
<p>(b) State the duration of the float time for activity B.</p>
<p>(c) State one advantage of using a Gantt chart.</p>`,
          answer: `<p>(a) A, C, F, G<br>
(b) 3 days<br>
(c) E.g., clear and simple to read, or easy to see float times.</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "1739s",
          marks: [1, 1, 1],
          topics: ["Planning & Decision Making"],
          subtopics: ["Gantt Charts"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 Q7</span></strong></small>
<p>Taylor opens a savings account on 1 April 2021 with an initial deposit of £400.</p>
<p>The effective rates of interest for the savings account are as follows.</p>
<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Dates</th>
      <th class="border border-slate-300 p-2 text-left">Interest rate</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2">1 April 2021 to 31 January 2022</td><td class="border border-slate-300 p-2">1.2% per year</td></tr>
    <tr><td class="border border-slate-300 p-2">1 February 2022 to 31 July 2022</td><td class="border border-slate-300 p-2">0.11% per month</td></tr>
    <tr><td class="border border-slate-300 p-2">From 1 August 2022</td><td class="border border-slate-300 p-2">1.7% per year</td></tr>
  </tbody>
</table>
<p>Taylor makes further deposits of £200 on 1 August 2021 and £250 on 1 April 2022.</p>
<p>(a) Calculate the balance in Taylor's savings account on 31 July 2022.</p>
<p>Taylor made a final deposit into this account on 1 August 2022. On 1 December 2022, their savings account balance was £1000.</p>
<p>(b) Calculate how much they deposited on 1 August 2022.</p>`,
          answer: `<p>(a) £860.30<br>
(b) £134.10</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "1885s",
          marks: [4, 2],
          topics: ["Finance"],
          subtopics: ["Present Value", "Accumulated Value"]
        },
        {
          attachments: [
            { name: "Q8 Warehouse.xlsx", url: "/resources/higher-apps/data/2023/Q8 Warehouse.xlsx", type: "xlsx" }
          ],
          question: `<small><strong><span style="white-space: nowrap;">2023 Q8</span></strong></small>
<p><strong>You must refer to the spreadsheet file 'Q8 Warehouse.xlsx' when answering this question.<br>
You must complete parts (a) and (b) (i) using the spreadsheet file.<br>
Parts (b) (ii), (c) and (d) must be completed in the answer space provided.</strong></p>
<p>A warehouse company currently has 1750 units of stock. They deliver 20% of their current stock each week, and receive 300 units of new stock per week.</p>
<p>(a) Complete the 'Warehouse Stock' worksheet to identify (in cell C10) the predicted number of units of stock in the warehouse at the end of week 26.</p>
<p>(b)(i) Extend the table in your worksheet to construct a graph to show the units of stock for 52 weeks.</p>
<p>(b)(ii) Using the graph constructed in (b) (i), state which type of mathematical model best describes the units of stock in the warehouse.</p>
<p>After 52 weeks, the warehouse company plans to move to a smaller building with space for 1400 units of stock.</p>
<p>(c) Comment on whether the smaller building will have enough space for the stock. Justify your answer.</p>
<p>(d) State one reason why this mathematical model may not be realistic.</p>`,
          answer: `<p>(a) 1500 (using appropriate formula, e.g., \`=INT(C13*$C$8+$C$9)\`).<br>
(b)(i) Graph plotted tending downwards to 1500 units.<br>
(b)(ii) Exponential (decay) or recurrence relation.<br>
(c) No, the building will not have enough space as units of stock are expected to level out at 1500 units of stock.<br>
(d) E.g., the model assumes a fixed rate of stock each week OR the model assumes a fixed rate of deliveries each week.</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "2198s",
          marks: [3, 2, 1, 1, 1],
          topics: ["Mathematical Modelling", "Excel"],
          subtopics: ["Recurrence Relations", "Evaluating Models"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 Q9</span></strong></small>
<p>The Consumer Price Index (CPI) in the UK in April 2021 was 110.4, relative to a baseline of 100 in April 2015.</p>
<p>(a) Explain what this figure means in terms of relative purchasing power.</p>
<p>The price of a new 3-door car rose in line with CPI between April 2015 and April 2021. In 2021, the price of a new 3-door car was £14,108.</p>
<p>(b) Calculate the price of a new 3-door car in April 2015.</p>
<p>The National Living Wage is the minimum hourly rate to be paid to any employee aged 23 or older. In April 2021, the National Living Wage was £8.91. This was raised to £9.50 in April 2022.</p>
<p>(c) Given that the CPI in April 2022 was 119.0, determine whether this rise in the National Living Wage was in line with inflation.</p>`,
          answer: `<p>(a) E.g., £110.40 in April 2021 would buy the same amount of goods and services as £100 in 2015 OR purchasing power has decreased (can buy fewer goods with money in 2021 than in 2015).<br>
(b) £12,778.99<br>
(c) Relative rate of inflation is 7.78% (or 107.8%). The percentage increase in NLW is 6.6% (or 106.6%). Therefore, the NLW rate increase was below inflation (not in line with it).</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "2580s",
          marks: [1, 1, 2],
          topics: ["Finance"],
          subtopics: ["Inflation & Purchasing Power"]
        },
        {
          requiresPreRelease: true,
          dataBookletSection: 2,
          dataBookletLabel: "E10 Petrol",
          question: `<small><strong><span style="white-space: nowrap;">2023 Q10</span></strong></small>
<p><strong>You must refer to the information on 'E10 Petrol' given in the pre-release material when answering this question.</strong></p>
<p>At the end of June 2021, the UK government replaced the standard E5 fuel with E10 in a bid to reduce national \\(CO_2\\) emissions.</p>
<p>A newspaper article stated that:<br>
'Since the nationwide introduction of E10 fuel, \\(CO_2\\) emissions have reduced to the effect of taking 550 000 cars off the road by the end of 2022.'</p>
<p>(a)(i) Calculate the \\(CO_2\\) emissions of 550 000 cars.</p>
<p>(a)(ii) Suggest a reason why the information from the newspaper article might not be appropriate as part of any further research on reducing \\(CO_2\\) emissions.</p>
<p>The fuel economy of a car, \\(F\\) miles per gallon (mpg), is reduced when it carries an additional load of \\(m\\) kilograms. The fuel economy of a small car is modelled using the following equation:</p>
<p>\\(F = 73.6 \\times 0.98^{\\frac{m}{45}}\\)</p>
<p>(b)(i) State the independent variable.</p>
<p>(b)(ii) Estimate the fuel economy of the small car when it is carrying an additional load of 150 kg.</p>
<p>A customer is filling up their tank with petrol. The shape of the petrol tank inside the car is a horizontal cylinder with two hemispheres on either side as shown in the diagram.</p>
<img src="/img/Higherapps_Past_Papers/2023/2023_Q10_1.png" alt="Car petrol tank diagram showing depth of petrol">
<p>The three diagrams below show how the depth of petrol varies with the volume of petrol in the tank.</p>
<img src="/img/Higherapps_Past_Papers/2023/2023_Q10_2.png" alt="Graph A, Graph B, and Graph C showing volume versus depth">
<p>(c) Explain which graph could model the depth of petrol in the tank.</p>`,
          answer: `<p>(a)(i) 1,155,000 (tonnes a year).<br>
(a)(ii) E.g., unconfirmed source, possible newspaper bias, or information in the article may not be accurate.<br>
(b)(i) (additional) load or \\(m.\\)<br>
(b)(ii) 68.8 (mpg).<br>
(c) Graph A. E.g., depth increases faster at the beginning, slows down in the middle (where it is widest), and increases faster at the end.</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "2810s",
          marks: [1, 1, 1, 1, 2],
          topics: ["Mathematical Modelling"],
          subtopics: ["Evaluating Models", "Experiment Design & Bias", "Exponential Models", "Identifying Graphs & Formulae"]
        },
        {
          attachments: [
            { name: "Q11 Ramsay's Loan.xlsx", url: "/resources/higher-apps/data/2023/Q11 Ramsay's Loan.xlsx", type: "xlsx" }
          ],
          question: `<small><strong><span style="white-space: nowrap;">2023 Q11</span></strong></small>
<p><strong>You must refer to the spreadsheet file 'Q11 Ramsay's Loan.xlsx' when answering this question.<br>
You must complete parts (a) (i), (a) (ii), (c) (i), and (c) (ii) using the spreadsheet file.<br>
Part (b) must be completed in the space provided.</strong></p>
<p>Ramsay applies to take out a loan of £6000 with a term of 3 years from a bank. Level monthly repayments are made at the end of each month. The effective annual interest rate is 6.3%.</p>
<p>Open the 'Bank Loan' worksheet.</p>
<p>(a)(i) Complete the 'Bank loan repayment schedule' to determine the level monthly repayment amount, and the final repayment amount.</p>
<p>(a)(ii) Determine the total interest paid over the term of the loan.</p>
<p>Ramsay's application for this loan was rejected.</p>
<p>(b) State one reason why a bank might reject a loan application.</p>
<p>Ramsay decides to borrow the money from a loan company. The loan company offers Ramsay £6000 for 3 years with fixed level monthly repayments of £250 made at the end of each month.</p>
<p>Open the 'Loan Company' worksheet.</p>
<p>(c)(i) Complete the 'Loan company repayment schedule' to find the annual effective rate of interest.</p>
<p>(c)(ii) Determine the difference in total interest paid (in £) between the two loans.</p>`,
          answer: `<p>(a)(i) Monthly interest rate calculated as 0.51%. Monthly repayment: £182.87, Final repayment: £182.94 (or £182.88 / £182.58).<br>
(a)(ii) £583.39<br>
(b) E.g., poor credit rating, affordability issues.<br>
(c)(i) 32.61%<br>
(c)(ii) £2416.61 (or £2416.62)</p>`,
          videoId: "sjQYsyPN6Ds",
          timestamp: "3212s",
          marks: [4, 1, 1, 2, 1],
          topics: ["Finance", "Excel"],
          subtopics: ["Repayment Schedules & Credit", "Financial Decision Making"]
        }
      ]
    }
  ]
};