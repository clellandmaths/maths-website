export const higherAppsMaths2024 = {
  year: 2024,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q1</span></strong></small>
<p>Bailey takes out a loan for £4000 with an annual effective rate of interest of 29.9%.</p>
<p>(a) Calculate the monthly effective rate of interest.</p>
<p>Bailey makes level monthly repayments of £250 at the end of each month.</p>
<p>(b) Complete the following loan schedule for Bailey's loan to show the loan outstanding at the end of month 2.</p>
<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Time<br>(months)</th>
      <th class="border border-slate-300 p-2 text-left">Repayment<br>(£)</th>
      <th class="border border-slate-300 p-2 text-left">Interest content of repayment (£)</th>
      <th class="border border-slate-300 p-2 text-left">Capital content of repayment (£)</th>
      <th class="border border-slate-300 p-2 text-left">Loan outstanding<br>(£)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">0</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2">4000.00</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">1</td>
      <td class="border border-slate-300 p-2">250.00</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">2</td>
      <td class="border border-slate-300 p-2">250.00</td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
      <td class="border border-slate-300 p-2"></td>
    </tr>
  </tbody>
</table>`,
          answer: `<p>(a) 2.20...%</p>
<p>(b) Month 1: Interest £88.16, Capital £161.84, Loan outstanding £3838.16.<br>Month 2: Interest £84.59, Capital £165.41, Loan outstanding £3672.75.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "12s",
          marks: [1, 2],
          topics: ["Finance"],
          subtopics: ["Repayment Schedules & Credit", "Accumulated Value"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q2</span></strong></small>
<p>A college offers language courses in French, Spanish and Arabic.</p>
<p>A group of students are asked which, if any, of these language courses they study at this college:</p>
<ul>
  <li>31 students study French, Spanish and Arabic</li>
  <li>34 students study French only</li>
  <li>7 students study Spanish only</li>
  <li>13 students study Arabic only</li>
  <li>51 students study French and Spanish</li>
  <li>60 students study Spanish and Arabic</li>
  <li>63 students study French and Arabic</li>
  <li>14 students study no languages.</li>
</ul>
<p>(a) Complete the Venn diagram to show this information.</p>
<img src="/img/Higherapps_Past_Papers/2024/2024_Q2.png" alt="Venn diagram for Arabic, French, and Spanish">
<p>(b) A student is selected at random. Determine the probability that the student studies Spanish and Arabic, but not French.</p>`,
          answer: `<p>(a) The completed Venn diagram has:<br>
Center overlap (all three): 31<br>
Outer circles: 34 (French only), 7 (Spanish only), 13 (Arabic only)<br>
Remaining overlaps: 32 (French and Arabic only), 29 (Spanish and Arabic only), 20 (French and Spanish only)<br>
Outside circles: 14</p>
<p>(b) Total number of students = 180. Probability = \\(\\frac{29}{180}\\)</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "179s",
          marks: [3, 2],
          topics: ["Statistics & Probability"],
          subtopics: ["Tree & Venn Diagrams"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q3</span></strong></small>
<p>A ship is being repaired. The propeller must be removed for the repair to be carried out. The table shows the list of tasks required to complete this job, the time required for each task, and the order in which the tasks must be completed.</p>
<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Task</th>
      <th class="border border-slate-300 p-2 text-left">Description</th>
      <th class="border border-slate-300 p-2 text-left">Preceding task</th>
      <th class="border border-slate-300 p-2 text-left">Duration (hours)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2">A</td><td class="border border-slate-300 p-2">Disconnect electrics</td><td class="border border-slate-300 p-2">none</td><td class="border border-slate-300 p-2">2</td></tr>
    <tr><td class="border border-slate-300 p-2">B</td><td class="border border-slate-300 p-2">Remove oils from system</td><td class="border border-slate-300 p-2">A</td><td class="border border-slate-300 p-2">12</td></tr>
    <tr><td class="border border-slate-300 p-2">C</td><td class="border border-slate-300 p-2">Remove rudder</td><td class="border border-slate-300 p-2">A</td><td class="border border-slate-300 p-2">24</td></tr>
    <tr><td class="border border-slate-300 p-2">D</td><td class="border border-slate-300 p-2">Disconnect oil pipes and hoses</td><td class="border border-slate-300 p-2">A</td><td class="border border-slate-300 p-2">8</td></tr>
    <tr><td class="border border-slate-300 p-2">E</td><td class="border border-slate-300 p-2">Prepare oil pipes and hoses to be reconnected</td><td class="border border-slate-300 p-2">D</td><td class="border border-slate-300 p-2">4</td></tr>
    <tr><td class="border border-slate-300 p-2">F</td><td class="border border-slate-300 p-2">Remove propeller blades</td><td class="border border-slate-300 p-2">B, C, E</td><td class="border border-slate-300 p-2">14</td></tr>
    <tr><td class="border border-slate-300 p-2">G</td><td class="border border-slate-300 p-2">Disconnect propeller stern seals</td><td class="border border-slate-300 p-2">B, C, E</td><td class="border border-slate-300 p-2">12</td></tr>
    <tr><td class="border border-slate-300 p-2">H</td><td class="border border-slate-300 p-2">Disconnect propeller shaft coupling</td><td class="border border-slate-300 p-2">B, C, E</td><td class="border border-slate-300 p-2">8</td></tr>
    <tr><td class="border border-slate-300 p-2">I</td><td class="border border-slate-300 p-2">Remove propeller shaft coupling and internal pipes</td><td class="border border-slate-300 p-2">F, G, H</td><td class="border border-slate-300 p-2">6</td></tr>
    <tr><td class="border border-slate-300 p-2">J</td><td class="border border-slate-300 p-2">Take out propeller shaft</td><td class="border border-slate-300 p-2">I</td><td class="border border-slate-300 p-2">8</td></tr>
  </tbody>
</table>
<p>(a) Complete the PERT chart showing the earliest start time and the latest completion time for each task.</p>
<img src="/img/Higherapps_Past_Papers/2024/2024_Q3_1.png" alt="PERT chart structure">
<p>(b) Construct a Gantt chart without float times for this job.</p>
<img src="/img/Higherapps_Past_Papers/2024/2024_Q3_2.png" alt="Gantt chart grid">
<p>(c) Determine the critical path and the minimum time required to complete the job.</p>
<p>During the job there are difficulties disconnecting the propeller shaft coupling (task H).</p>
<p>(d) Determine the maximum time that can be taken to disconnect the propeller shaft coupling without delaying the total completion time of the job.</p>`,
          answer: `<p>(a) Correctly completed forward and backward scans. EST, Duration, LCT:<br>
A: 0, 2, 2<br>
B: 2, 12, 26<br>
C: 2, 24, 26<br>
D: 2, 8, 22<br>
E: 10, 4, 26<br>
F: 26, 14, 40<br>
G: 26, 12, 40<br>
H: 26, 8, 40<br>
I: 40, 6, 46<br>
J: 46, 8, 54</p>
<p>(b) Gantt chart constructed consistently with the task times and dependencies.</p>
<p>(c) Critical path: ACFIJ. Minimum time: 54 hours.</p>
<p>(d) 14 hours.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "319s",
          marks: [5, 3, 2, 1],
          topics: ["Planning & Decision Making"],
          subtopics: ["PERT Charts & Critical Paths", "Gantt Charts"]
        },
        {
          dataBookletSection: 2,
          dataBookletLabel: "Dracaena Plants",
          question: `<small><strong><span style="white-space: nowrap;">2024 Q4</span></strong></small>
<p><strong>You must refer to the information on 'Dracaena plants and atmospheric carbon dioxide levels' given in the pre-release material when answering this question.</strong></p>
<p><strong>You must also refer to the spreadsheet file 'Q4 Dracaena Plant.xlsx' when answering this question. You must complete parts (a) and (b) using the spreadsheet file.</strong></p>
<p>A research scientist is studying the effect of Dracaena plants to improve indoor air quality in a kitchen showroom.</p>
<p>They estimate that:</p>
<ul>
  <li>large Dracaena plants reduce the concentration of carbon dioxide \\((CO_2)\\) in the showroom by 13% each day</li>
  <li>each evening a heating system is left running. This adds enough \\(CO_2\\) to increase the concentration in the showroom by 180 ppm.</li>
</ul>
<p>At the start of the study the concentration of \\(CO_2\\) in the showroom was 2000 ppm.</p>
<p>(a) Complete the 'Dracaena plant study' worksheet to estimate the concentration of \\(CO_2\\) at the end of 30 days.</p>
<p>The research scientist investigates the long-term concentration of \\(CO_2\\) in the showroom.</p>
<p>(b) Extend the table in your worksheet to the end of 60 days. Construct a graph to show what will happen to the concentration of \\(CO_2\\) in the showroom. Your graph must include an appropriate title and axes labels.</p>
<p>(c) Explain whether the large Dracaena plants are effective at obtaining very good indoor air quality in the showroom.</p>`,
          requiresPreRelease: true,
          attachments: [{ name: "Q4 Dracaena Plant.xlsx", url: "/resources/higher-apps/data/2024/Q4 Dracaena Plant.xlsx", type: "xlsx" }],
          answer: `<p>(a) An appropriate formula is used, leading to 1394.05... ppm at the end of day 30.</p>
<p>(b) Table extended to 60 days gives a value of 1384.76... ppm. The graph is appropriately constructed with title and labels (e.g., \\(CO_2\\) levels vs Days).</p>
<p>(c) e.g., The large Dracaena plants are not effective at obtaining very good air quality in the showroom because the concentration of \\(CO_2\\) remains above 800 ppm.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "867s",
          marks: [3, 3, 1],
          topics: ["Mathematical Modelling", "Statistics & Probability", "Excel"],
          subtopics: ["Recurrence Relations", "Statistical Diagrams"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q5</span></strong></small>
<p>Ewa deposited £4500 in a variable rate savings account on 1 January 2021. The effective rates of interest for the savings account are as follows:</p>
<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Dates</th>
      <th class="border border-slate-300 p-2 text-left">Interest rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">1 January 2021 to 31 March 2021</td>
      <td class="border border-slate-300 p-2">0.415% per month</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">1 April 2021 to 31 December 2021</td>
      <td class="border border-slate-300 p-2">4.7% per year</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">From 1 January 2022</td>
      <td class="border border-slate-300 p-2">2.6% per year</td>
    </tr>
  </tbody>
</table>
<p>(a) Calculate Ewa's balance on 1 January 2024.</p>
<p>On 1 January 2022 Blair opened an account with the same effective rates of interest. Blair has a savings goal of £6000 by 1 January 2024.</p>
<p>(b) Calculate the minimum deposit Blair should have made on 1 January 2022 to achieve this savings goal.</p>`,
          answer: `<p>(a) £4964.36 (using \\(4500 \\times 1.00415^3 \\times 1.047^{\\frac{9}{12}} \\times 1.026^2\\))</p>
<p>(b) £5699.76</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "1286s",
          marks: [3, 1],
          topics: ["Finance"],
          subtopics: ["Present Value", "Accumulated Value"]
        },
        {
          dataBookletSection: 3,
          dataBookletLabel: "R Commands",
          question: `<small><strong><span style="white-space: nowrap;">2024 Q6</span></strong></small>
<p><strong>You must refer to the spreadsheet file 'Q6 golf.csv' for the data, and the word processing file 'Q6 Golf Answers.docx' when answering this question.</strong></p>
<p><strong>You must complete parts (a) (i) and (c) (ii) using appropriate statistical software. You must include all output from statistical software, and your answers in the word processing file 'Q6 Golf Answers.docx'.</strong></p>
<p>A golf ball manufacturing company has designed a new golf ball which is more hard-wearing. The company wants to determine whether there is a difference in the distances travelled by the current and new golf balls.</p>
<p>To measure the distances travelled by the current and new golf balls, a random sample of 40 of the current golf balls and a random sample of 40 of the new golf balls were subjected to distance tests using a mechanical hitting machine. Data was collected for the distances travelled (in metres) of both the current and new golf balls.</p>
<p>The data was found to be approximately normally distributed.</p>
<p>(a) (i) Generate and state appropriate measures of location and spread for the current and new golf balls.<br>
(ii) Make two valid comparisons about the driving distances of both the current and new golf balls.</p>
<p>(b) State appropriate null and alternative hypotheses to determine if there is a statistically significant difference between the distances travelled by the current and new golf balls.</p>
<p>(c) (i) State which type of hypothesis test is appropriate to determine if there is a statistically significant difference between the distances travelled by the current and new golf balls.<br>
(ii) Perform the hypothesis test and state the p-value.<br>
(iii) Hence interpret the p-value, and the result of the hypothesis test, in context.</p>`,
          attachments: [
            { name: "Q6 golf.csv", url: "/resources/higher-apps/data/2024/Q6 golf.csv", type: "csv" },
            { name: "Q6 Golf Answers.docx", url: "/resources/higher-apps/data/2024/Q6 Golf Answers.docx", type: "docx" }
          ],
          answer: `<p>(a)(i) Current golf ball: Mean = 270.275, Standard Deviation = 8.752985. New golf ball: Mean = 267.5, Standard Deviation = 9.896904.</p>
<p>(a)(ii) On average, the distances travelled by the new golf ball are less. The distances travelled by the new golf ball are more varied than those travelled by the current golf ball.</p>
<p>(b) Null: There is no difference in the mean distances travelled by the current and the new golf balls. Alternative: There is a difference in the mean distances travelled by the current and the new golf balls.</p>
<p>(c)(i) (Two-sample) t-test.</p>
<p>(c)(ii) p-value = 0.188.</p>
<p>(c)(iii) The p-value is greater than 0.05 (fail to reject the null hypothesis). There is insufficient evidence to suggest there is a significant difference in the mean distances travelled by the current golf ball and the new golf ball.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "1528s",
          marks: [2, 2, 1, 1, 2, 2],
          topics: ["Statistics & Probability", "RStudio"],
          subtopics: ["Descriptive Statistics", "Statistical Tests"]
        },
        {
          dataBookletSection: 1,
          dataBookletLabel: "Deductions from Salaries",
          question: `<small><strong><span style="white-space: nowrap;">2024 Q7</span></strong></small>
<p><strong>You must refer to the information on 'Deductions from salaries' given in the pre-release material when answering this question.</strong></p>
<p>In the 2023/24 tax year, Tom was paid a gross salary of £4500 per month for 12 months, from the 6 April 2023. His annual income tax deduction is £10,718.48. Tom has opted out of paying any pension contributions.</p>
<p>(a) Calculate Tom's net annual salary for the 2023/24 tax year, after all deductions including National Insurance.</p>
<p>The Consumer Price Index (CPI) in April 2022 was 119.0 and in April 2023 was 128.3.</p>
<p>In April 2022, Tom's gross monthly salary was £4200. In April 2023, his gross monthly salary was increased to £4500.</p>
<p>(b) Determine whether Tom's gross monthly salary increased in line with the CPI.</p>`,
          requiresPreRelease: true,
          answer: `<p>(a) Total NI contribution is £4409.22. Net annual salary is £38,872.30.</p>
<p>(b) The CPI change is 1.078... (an increase of 7.8%). Tom's salary increase is 1.071... (an increase of 7.1%). No, since 7.1% is less than the change in CPI.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "2014s",
          marks: [4, 2],
          topics: ["Finance"],
          subtopics: ["Pay, Tax & National Insurance", "Inflation & Purchasing Power"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q8</span></strong></small>
<p>An electric vehicle charging company has been awarded a contract to install 500 charging points in a city. As part of the contract a number of tasks must be completed including ordering and receiving charger parts and installing electric cables.</p>
<p>If the installation is delayed the company faces a fixed penalty of £75,000.</p>
<p>The company has identified the following two reasons for a possible delay:</p>
<ul>
  <li>a shortage in parts for the chargers</li>
  <li>the electric cables will not be in place in time.</li>
</ul>
<p>There is a 0.325 probability one or both of these delays will happen.</p>
<p>(a) Calculate the expected cost of a delay.</p>
<p>The company is considering using the following control measures:</p>
<ul>
  <li>Control Measure 1 - Import extra parts at a cost of £15,000.</li>
  <li>Control Measure 2 - Pay another firm to help lay the cables, at an additional cost of £16,000.</li>
</ul>
<p>There is a 0.1 probability of a shortage in parts for the chargers.<br>
There is a 0.25 probability that the electric cables will not be in place in time.</p>
<p>(b) Calculate the expected cost of a delay using:<br>
(i) only control measure 1<br>
(ii) only control measure 2.</p>
<p>The company will only use one control measure.</p>
<p>(c) Based on your calculations, explain which control measure the company should use in order to minimise expected costs.</p>`,
          answer: `<p>(a) \\(0.325 \\times 75000\\) = £24,375</p>
<p>(b)(i) Expected cost = \\(15000 + (0.25 \\times 75000)\\) = £33,750<br>
(b)(ii) Expected cost = \\(16000 + (0.1 \\times 75000)\\) = £23,500</p>
<p>(c) The company should use control measure 2 because it has the lowest expected cost.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "2539s",
          marks: [1, 1, 1, 1],
          topics: ["Planning & Decision Making"],
          subtopics: ["Expected Costs & Risk"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q9</span></strong></small>
<p><strong>You must refer to the spreadsheet file 'Q9 Esme's Mortgage.xlsx' when answering this question.</strong></p>
<p>Esme is building an extension to her house. She has been offered a £25,000 mortgage with an effective annual rate of interest of 3.5% over 5 years. Open the 'Mortgage' worksheet.</p>
<p>(a) Complete the 'Mortgage schedule' to determine the level monthly repayment amount, and the final repayment amount.</p>
<p>Esme needs new building insurance once the extension is completed. She is choosing between the following two options.</p>
<table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
  <thead>
    <tr>
      <th class="border border-slate-300 p-2 text-left">Cost per year(£)</th>
      <th class="border border-slate-300 p-2 text-left">Total excess(£)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">216.94</td>
      <td class="border border-slate-300 p-2">350</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">281.95</td>
      <td class="border border-slate-300 p-2">100</td>
    </tr>
  </tbody>
</table>
<p>(b) (i) State one advantage of having a high excess amount on your insurance policy.<br>
One of the windows in Esme's house is broken and she has to decide whether to make a claim.<br>
(ii) Explain why Esme may choose not to make a claim using her insurance policy.</p>
<p>The maximum monthly repayment allowed by the lender is £550. Esme chooses to reduce the term of her mortgage by increasing her monthly repayments to the maximum amount. Open the 'Increased payments' worksheet.</p>
<p>(c) (i) Complete the 'Increased payments schedule' for the reduced term and calculate the final repayment amount.<br>
(ii) Determine how much money this would save Esme over the term of her mortgage.</p>`,
          attachments: [{ name: "Q9 Esme's Mortgage.xlsx", url: "/resources/higher-apps/data/2024/Q9 Esme's Mortgage.xlsx", type: "xlsx" }],
          answer: `<p>(a) Monthly interest rate is 0.287...%. Level monthly repayment is £454.18 and the final repayment is £454.12.</p>
<p>(b)(i) e.g., It reduces the cost of your premium.</p>
<p>(b)(ii) e.g., When the damage claimed is less than the excess amount on the policy, or making a claim could increase the cost of future premiums.</p>
<p>(c)(i) Final repayment amount is £427.19.</p>
<p>(c)(ii) She would save £423.55 (or £423.57).</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "2806s",
          marks: [4, 1, 1, 2, 1],
          topics: ["Finance", "Excel"],
          subtopics: ["Repayment Schedules & Credit", "Financial Decision Making"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 Q10</span></strong></small>
<p>A factory fills cans with a carbonated fruit drink. The cans produced have a volume of 330 millilitres.</p>
<p>The graph below shows the relationship between time, in seconds, and volume of carbonated fruit drink, in millilitres, as a can is filled.</p>
<img src="/img/Higherapps_Past_Papers/2024/2024_Q10.png" alt="Scatterplot of volume of carbonated fruit drink against time">
<p>(a) State the type of relationship modelled in the graph.</p>
<p>(b) Determine the rate at which each can is filled with carbonated fruit drink. Your answer must include appropriate units.</p>
<p>The factory can only fill the cans when there are staff present. The machines in the factory can fill 5 cans at the same time.</p>
<p>(c) Estimate how many cans the factory can fill in one week. State any assumptions you have made.</p>`,
          answer: `<p>(a) (Positive) linear.</p>
<p>(b) 110 millilitres per second.</p>
<p>(c) Assumption example: between 7 and 24 hours a day for 5-7 days. Calculation example (assuming 24 hours for 7 days): 100 cans per minute × 60 × 24 × 7 = 1,008,000 cans.</p>`,
          videoId: "tpAnZSEkKgU",
          timestamp: "3300s",
          marks: [1, 2, 3],
          topics: ["Mathematical Modelling"],
          subtopics: ["Fermi Estimation", "Units of Measure", "Linear Models"]
        }
      ]
    }
  ]
};