export const higherAppsMaths2026 = {
  year: 2026,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q1</span></strong></small><p>David took out a personal loan for £3000 on 1 July 2025.<br>He will start making repayments on 1 July 2026.<br>The effective rates of interest for the personal loan are as follows:</p>
          <table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
            <thead>
              <tr>
                <th class="border border-slate-300 p-2 text-left">Dates</th>
                <th class="border border-slate-300 p-2 text-left">Interest rate</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border border-slate-300 p-2">1 July 2025 to 30 September 2025</td><td class="border border-slate-300 p-2">7.3% per year</td></tr>
              <tr><td class="border border-slate-300 p-2">1 October 2025 to 28 February 2026</td><td class="border border-slate-300 p-2">7.9% per year</td></tr>
              <tr><td class="border border-slate-300 p-2">1 March 2026 to 30 June 2026</td><td class="border border-slate-300 p-2">0.67% per month</td></tr>
            </tbody>
          </table>
          <p>Calculate the accumulated balance of David's loan on 30 June 2026.</p>`,
          answer: `<p>Three months at 7.3% per year: \\(1.073^{\\frac{1}{4}}=1.017771\\)<br>Five months at 7.9% per year: \\(1.079^{\\frac{5}{12}}=1.032188\\)<br>Four months at 0.67% per month: \\(1.0067^{4}=1.027071\\)</p><p>\\(3000\\times1.017771\\times1.032188\\times1.027071=3236.908...\\)</p><p><strong>£3236.91</strong></p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "57s",
          topics: ["Finance"],
          subtopics: ["Accumulated Value"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q2</span></strong></small><p>A company is repairing a house after a flood.<br>The table shows the list of tasks required to complete the house repairs, the time required for each task, and the order in which the tasks are to be completed.</p>
          <table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
            <thead>
              <tr>
                <th class="border border-slate-300 p-2 text-center">Task</th>
                <th class="border border-slate-300 p-2 text-left">Description</th>
                <th class="border border-slate-300 p-2 text-center">Preceding task(s)</th>
                <th class="border border-slate-300 p-2 text-center">Duration (days)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border border-slate-300 p-2 text-center">A</td><td class="border border-slate-300 p-2">Electrical safety tests</td><td class="border border-slate-300 p-2 text-center">None</td><td class="border border-slate-300 p-2 text-center">1</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">B</td><td class="border border-slate-300 p-2">Remove damaged kitchen</td><td class="border border-slate-300 p-2 text-center">A</td><td class="border border-slate-300 p-2 text-center">3</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">C</td><td class="border border-slate-300 p-2">Dry out house</td><td class="border border-slate-300 p-2 text-center">A</td><td class="border border-slate-300 p-2 text-center">21</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">D</td><td class="border border-slate-300 p-2">Order and deliver new kitchen and bathroom</td><td class="border border-slate-300 p-2 text-center">A</td><td class="border border-slate-300 p-2 text-center">16</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">E</td><td class="border border-slate-300 p-2">Remove damaged bathroom</td><td class="border border-slate-300 p-2 text-center">A</td><td class="border border-slate-300 p-2 text-center">1</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">F</td><td class="border border-slate-300 p-2">Remove damaged floors</td><td class="border border-slate-300 p-2 text-center">B, E</td><td class="border border-slate-300 p-2 text-center">2</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">G</td><td class="border border-slate-300 p-2">Replace the floors</td><td class="border border-slate-300 p-2 text-center">C, F</td><td class="border border-slate-300 p-2 text-center">3</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">H</td><td class="border border-slate-300 p-2">Plaster the walls</td><td class="border border-slate-300 p-2 text-center">G</td><td class="border border-slate-300 p-2 text-center">4</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">I</td><td class="border border-slate-300 p-2">Paint and decorate walls</td><td class="border border-slate-300 p-2 text-center">H</td><td class="border border-slate-300 p-2 text-center">3</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">J</td><td class="border border-slate-300 p-2">Reinstate bathroom</td><td class="border border-slate-300 p-2 text-center">D, H</td><td class="border border-slate-300 p-2 text-center">2</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">K</td><td class="border border-slate-300 p-2">Reinstate kitchen</td><td class="border border-slate-300 p-2 text-center">D, H</td><td class="border border-slate-300 p-2 text-center">3</td></tr>
            </tbody>
          </table>
          <p>(a) Complete the PERT chart showing the duration, the earliest start time and the latest completion time for each task.</p><img src="/img/Higherapps_Past_Papers/2026/2026_Q2_1.webp" alt="Blank PERT chart with eleven boxes, each divided into three cells for earliest start time, duration and latest completion time"><p>(b) Construct a Gantt chart, without float times, for the house repairs.</p><img src="/img/Higherapps_Past_Papers/2026/2026_Q2_2.webp" alt="Blank grid for a Gantt chart, with task up the side and time taken in days from 1 to 36 across"><p>(c) State the float time to reinstate the bathroom (Task J).</p>`,
          answer: `<p>(a) Earliest start time, duration and latest completion time for each task:<br>A (0, 1, 1), B (1, 3, 20), C (1, 21, 22), D (1, 16, 29), E (1, 1, 20), F (4, 2, 22), G (22, 3, 25), H (25, 4, 29), I (29, 3, 32), J (29, 2, 32), K (29, 3, 32).<br>The critical path is A–C–G–H–I (or A–C–G–H–K), giving a minimum completion time of 32 days.</p><p>(b) Bars drawn from the earliest start times above: A day 1, B days 2–4, C days 2–22, D days 2–17, E day 2, F days 5–6, G days 23–25, H days 26–29, I days 30–32, J days 30–31, K days 30–32.</p><p>(c) J can start on day 30 and must finish by day 32 but takes only 2 days, so the float time is <strong>1 day</strong>.</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "265s",
          topics: ["Planning & Decision Making"],
          subtopics: ["PERT Charts & Critical Paths", "Gantt Charts"],
          marks: [5, 3, 1]
        },
        {
          attachments: [
            { name: "Q3 Tyres.csv", url: "/resources/higher-apps/data/2026/Q3 Tyres.csv", type: "csv" },
            { name: "Q3 Tyres Answers.docx", url: "/resources/higher-apps/data/2026/Q3 Tyres Answers.docx", type: "docx" }
          ],
          dataBookletSection: 4,
          dataBookletLabel: "Some helpful R commands",
          question: `<small><strong><span style="white-space: nowrap;">2026 Q3</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q3 Tyres.csv' for the data, and the word processing file 'Q3 Tyres Answers.docx' when answering this question.<br>You must complete parts (a), (b) (i), (c) and (d) using appropriate statistical software.<br>You must include all output from statistical software, and your answers in the word processing file 'Q3 Tyres Answers.docx'.</strong></p><p>A tyre manufacturer has collected data to investigate the relationship between the stopping distance (metres) and the tread depth (millimetres) of a new type of tyre.</p><p>(a) Construct a scatter plot of stopping distance on tread depth.</p><p>(b) (i) Find the correlation coefficient between stopping distance and tread depth.<br>(ii) Interpret the correlation coefficient.</p><p>(c) Find the equation of the regression line of stopping distance on tread depth.</p><p>(d) Estimate the stopping distance for a tyre with a tread depth of 6.2 millimetres.</p>`,
          answer: `<p>(a) Scatter plot of stopping distance against tread depth, for example <code class="text-green-400 bg-gray-800 px-1 rounded">plot(Depth, Distance, xlab="tread depth (mm)", ylab="stopping distance (m)")</code></p><p>(b) (i) <code class="text-green-400 bg-gray-800 px-1 rounded">cor(Depth, Distance)</code> gives \\(r=-0.986\\)<br>(ii) There is a very strong negative linear correlation: as tread depth decreases, stopping distance increases.</p><p>(c) <code class="text-green-400 bg-gray-800 px-1 rounded">lm(Distance ~ Depth)</code> gives distance \\(=43.94-2.38\\times\\) depth</p><p>(d) \\(43.94-2.38\\times6.2=29.18\\), so about <strong>29.2 metres</strong></p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "848s",
          topics: ["Statistics & Probability", "RStudio"],
          subtopics: ["Correlation & Regression", "Statistical Diagrams"],
          marks: [1, 1, 1, 2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q4</span></strong></small><p>As part of a recruitment process to become a firefighter, candidates must complete a verbal reasoning test and a numerical reasoning test.<br>One day, a group of 140 candidates sat both tests.<br>The results were as follows:</p>
          <ul class="list-disc pl-6">
            <li>87 passed the verbal reasoning test</li>
            <li>75 passed the numerical reasoning test</li>
            <li>42 passed both tests.</li>
          </ul>
          <p>(a) Complete the Venn diagram to show this information.</p><img src="/img/Higherapps_Past_Papers/2026/2026_Q4.webp" alt="Blank Venn diagram with two overlapping circles labelled verbal and numerical inside a rectangle"><p>One candidate is chosen at random from this group.</p><p>(b) Calculate the probability that this candidate passed only one of the tests.</p>`,
          answer: `<p>(a) Both tests 42, verbal only \\(87-42=45\\), numerical only \\(75-42=33\\), neither \\(140-120=20\\) outside the circles.</p><p>(b) Passed only one \\(=45+33=78\\), so \\(P=\\frac{78}{140}=\\frac{39}{70}\\) (about 0.557)</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "1367s",
          topics: ["Statistics & Probability"],
          subtopics: ["Tree & Venn Diagrams"],
          marks: [2, 1]
        },
        {
          attachments: [
            { name: "Q5 Profit Function.xlsx", url: "/resources/higher-apps/data/2026/Q5 Profit Function.xlsx", type: "xlsx" }
          ],
          question: `<small><strong><span style="white-space: nowrap;">2026 Q5</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q5 Profit Function.xlsx' when answering this question.<br>You must complete parts (a) (i) and (a) (ii) using the spreadsheet file.<br>Parts (b) (i), (b) (ii) and (b) (iii) must be completed in the answer space provided.</strong></p><p>Claire owns a small business producing and selling wax candles. She wants to introduce a new scent for summer.<br>Claire's total profit is affected by more than just the selling price per candle and cost to produce each candle. As production increases, the cost of storage, distribution and promotions reduces the total profit.<br>She uses the following Profit Function model to calculate her profit:</p><p>\\(\\text{Profit}=(s-c)x-0.015x^{2}\\)</p>
          <ul class="list-disc pl-6">
            <li>\\(s\\) is the selling price per candle (£).</li>
            <li>\\(c\\) is the cost to produce each candle (£).</li>
            <li>\\(x\\) is the number of candles produced and sold.</li>
          </ul>
          <p>Claire would like to produce up to 500 candles with a selling price per candle (\\(s\\)) of £9.<br>The cost to produce each candle (\\(c\\)) is £3.<br>Open the 'Candle Profit' worksheet.</p>
          <p>(a) (i) Complete the 'Candle Profit' worksheet to model how Claire's profit will change as the number of candles (\\(x\\)) increases from 0 to 500.<br>(ii) Construct an appropriate graph to model Claire's profit.</p>
          <p>(b) (i) State the type of model Claire is using.<br>(ii) Explain what the graph shows when Claire produces and sells more than 400 candles.<br>(iii) State how many candles Claire should produce and sell to maximise her profit.</p>
          <p>To produce each candle, Claire pours wax into a mould in the shape of a cuboid. Each mould has a length of exactly 3 centimetres and a breadth of exactly 4 centimetres.<br>Claire pours the wax to a height of 7 centimetres with a relative error of 2%.</p><p>(c) Calculate the absolute error of the volume of the candle.</p>`,
          answer: `<p>(a) (i) With \\(s\\) in C7 and \\(c\\) in C8, fill down <code class="text-green-400 bg-gray-800 px-1 rounded">=($C$7-$C$8)*B11-0.015*B11^2</code>, giving profit £0 at 0 candles, £600 at 200 and £0 at 400.<br>(ii) A scatter or line graph of profit against number of candles.</p><p>(b) (i) A quadratic model.<br>(ii) Beyond 400 candles the profit is negative, so Claire makes a loss — the extra storage, distribution and promotion costs outweigh the income.<br>(iii) \\(200\\) candles, where the profit peaks at £600.</p><p>(c) Volume \\(=3\\times4\\times7=84\\) cm³. Only the height carries the error: \\(2\\%\\) of 7 cm is 0.14 cm.<br>Absolute error \\(=3\\times4\\times0.14=\\) <strong>1.68 cm³</strong></p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "1492s",
          topics: ["Mathematical Modelling", "Excel"],
          subtopics: ["Identifying Graphs & Formulae", "Evaluating Models", "Error & Tolerances"],
          marks: [3, 2, 1, 1, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q6</span></strong></small><p>Natasha opens a savings account.<br>The annual effective rate of interest for this savings account is 1.5%.<br>Interest is paid at the end of each month.</p><p>(a) Calculate the monthly effective rate of interest.</p><p>Natasha will make an initial deposit of £1000 into this savings account on the first day of July.<br>One month later, and every month after that, she will deposit £150 on the first day of each month.</p><p>(b) Complete the savings schedule to calculate Natasha's savings account balance immediately after making her second deposit.</p>
          <table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
            <thead>
              <tr>
                <th class="border border-slate-300 p-2 text-center">Time (months)</th>
                <th class="border border-slate-300 p-2 text-center">Interest earned (£)</th>
                <th class="border border-slate-300 p-2 text-center">Deposit (£)</th>
                <th class="border border-slate-300 p-2 text-center">Balance (£)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border border-slate-300 p-2 text-center">0</td><td class="border border-slate-300 p-2 text-center"></td><td class="border border-slate-300 p-2 text-center"></td><td class="border border-slate-300 p-2 text-center">1000</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">1</td><td class="border border-slate-300 p-2 text-center"></td><td class="border border-slate-300 p-2 text-center"></td><td class="border border-slate-300 p-2 text-center"></td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">2</td><td class="border border-slate-300 p-2 text-center"></td><td class="border border-slate-300 p-2 text-center"></td><td class="border border-slate-300 p-2 text-center"></td></tr>
            </tbody>
          </table>`,
          answer: `<p>(a) \\((1+m)^{12}=1.015\\), so \\(m=1.015^{\\frac{1}{12}}-1=0.0012415\\), about <strong>0.124%</strong></p><p>(b) Month 1: interest \\(1000\\times0.0012415=1.24\\), deposit 150, balance \\(1000+1.24+150=1151.24\\)<br>Month 2: interest \\(1151.24\\times0.0012415=1.43\\), deposit 150, balance \\(1151.24+1.43+150=\\) <strong>£1302.67</strong></p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "2213s",
          topics: ["Finance"],
          subtopics: ["Accumulated Value"],
          marks: [1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q7</span></strong></small><p>A university student wants to answer the following research question:</p><p>'Is there a significant difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12?'</p><p>The university student selects a random sample of pupils aged 10 and 12.<br>They then record how long each pupil takes to run 100 metres.</p><p>(a) (i) State an appropriate hypothesis test to investigate the research question.<br>(ii) State the null and alternative hypotheses.</p><p>The hypothesis test was performed and generated a \\(p\\)-value of 0.072.</p><p>(b) Interpret the \\(p\\)-value, and the result of the hypothesis test, in context.</p>`,
          answer: `<p>(a) (i) A two-sample \\(t\\)-test for independent samples.<br>(ii) \\(H_{0}\\): there is no difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12.<br>\\(H_{1}\\): there is a difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12.</p><p>(b) \\(0.072>0.05\\), so there is insufficient evidence to reject \\(H_{0}\\). There is no significant difference in the mean time taken to run 100 metres between pupils aged 10 and pupils aged 12.</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "2439s",
          topics: ["Statistics & Probability"],
          subtopics: ["Statistical Tests"],
          marks: [1, 1, 2]
        },
        {
          attachments: [
            { name: "Q8 Janet's Mortgage.xlsx", url: "/resources/higher-apps/data/2026/Q8 Janet's Mortgage.xlsx", type: "xlsx" }
          ],
          dataBookletSection: 1,
          dataBookletLabel: "Deductions from salaries",
          question: `<small><strong><span style="white-space: nowrap;">2026 Q8</span></strong></small><p><strong>You must refer to the information on 'Deductions from salaries' and 'Mortgage products and affordability' given in the pre-release material when answering this question.<br>You must refer to the spreadsheet file 'Q8 Janet's Mortgage.xlsx' when answering this question.<br>You must complete part (b) using the spreadsheet file.<br>Parts (a) and (c) must be completed in the answer space provided.</strong></p><p>Janet's gross annual salary is £32,100.<br>She contributes 3% of her salary before tax into her pension fund.<br>Janet pays £130.16 in National Insurance each month.</p><p>(a) Calculate Janet's net monthly income.</p><p>Janet is applying for a mortgage of £98,000.<br>Level repayments would be made at the end of every month.<br>The fixed annual effective rate of interest would be 5.4% for the first two years.<br>Janet would like her mortgage balance to be no more than £93,000 at the end of the fixed rate period so that she can reduce her loan-to-value ratio.<br>Open the 'Mortgage' worksheet.</p><p>(b) Complete the 'Mortgage repayment schedule' to determine the minimum level monthly repayment amount required.</p><p>(c) Determine whether Janet's mortgage lender would consider this amount affordable.<br>Give a reason for your answer.</p>`,
          answer: `<p>(a) Pension \\(=3\\%\\) of £32,100 \\(=£963\\), so taxable income \\(=32100-963=£31\\,137.\\)<br>Tax: \\(0.19\\times2827+0.20\\times12\\,094+0.21\\times3646=537.13+2418.80+765.66=£3721.59\\)<br>National Insurance \\(=130.16\\times12=£1561.92\\)<br>Net annual \\(=32100-963-3721.59-1561.92=£25\\,853.49\\), so net monthly \\(=\\) <strong>£2154.46</strong></p><p>(b) Monthly effective rate \\(=1.054^{\\frac{1}{12}}-1=0.0043929.\\) The smallest level repayment leaving a balance of at most £93,000 after 24 months is <strong>£628.54</strong></p><p>(c) Taxable monthly income \\(=31137\\div12=£2594.75\\), and \\(28\\%\\) of this is £726.53.<br>The repayment of £628.54 is below £726.53, so <strong>yes</strong> — the lender would consider it affordable.</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "2733s",
          topics: ["Finance", "Excel"],
          subtopics: ["Pay, Tax & National Insurance", "Repayment Schedules & Credit", "Financial Decision Making"],
          marks: [4, 4, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q9</span></strong></small><p>A company has won a contract to manufacture and deliver flooring to a new housing development.<br>If they fail to supply the flooring on time, they will have to pay a penalty of £120,000.<br>Two reasons for a possible delay have been identified:</p>
          <ul class="list-disc pl-6">
            <li>Manufacturing delay — there is a 0.25 probability that there is a delay in the manufacture of the flooring.</li>
            <li>Delivery delay — there is a 0.15 probability that there is a delay while the company deliver the flooring.</li>
          </ul>
          <p>(a) (i) Calculate the missing probabilities and complete the tree diagram.</p><img src="/img/Higherapps_Past_Papers/2026/2026_Q9.webp" alt="Incomplete probability tree diagram with branches for manufacturing delay and delivery delay, 0.25 and 0.15 filled in and the remaining probabilities blank"><p>(ii) Determine the probability that one or both of these delays will happen.<br>(iii) Hence, calculate the expected cost of a delay.</p>
          <p>The company is considering using the following control measures:</p>
          <ul class="list-disc pl-6">
            <li>Control measure 1 — hire additional staff to help manufacture the flooring at an additional cost of £20,000.</li>
            <li>Control measure 2 — hire an external delivery company to help deliver the flooring at a cost of £12,500.</li>
          </ul>
          <p>(b) Calculate the expected cost of delay using:<br>(i) only control measure 1<br>(ii) only control measure 2.</p><p>The company decides to use both control measures.</p><p>(c) Based on your calculations, explain why the company decided to use both control measures.</p>`,
          answer: `<p>(a) (i) Missing probabilities are 0.75 (no manufacturing delay) and 0.85 (no delivery delay), giving branch probabilities 0.0375, 0.2125, 0.1125 and 0.6375.<br>(ii) \\(1-0.6375=\\) <strong>0.3625</strong><br>(iii) \\(0.3625\\times120\\,000=\\) <strong>£43,500</strong></p><p>(b) (i) Only a delivery delay remains: \\(0.15\\times120\\,000+20\\,000=18\\,000+20\\,000=\\) <strong>£38,000</strong><br>(ii) Only a manufacturing delay remains: \\(0.25\\times120\\,000+12\\,500=30\\,000+12\\,500=\\) <strong>£42,500</strong></p><p>(c) Using both removes the risk of a penalty, at a cost of \\(20\\,000+12\\,500=£32\\,500.\\) That is less than doing nothing (£43,500), measure 1 alone (£38,000) or measure 2 alone (£42,500), so it is the cheapest option.</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "3405s",
          topics: ["Planning & Decision Making", "Statistics & Probability"],
          subtopics: ["Expected Costs & Risk", "Tree & Venn Diagrams"],
          marks: [2, 1, 1, 1, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 Q10</span></strong></small><p>Deirdre bought a van using a finance deal. As part of the deal, she must make a final lump sum payment.<br>The lump sum payment of £8175 is due in three years' time.<br>To budget for this payment, Deirdre will make a single deposit into a savings account with an annual effective rate of interest of 7.1%.</p><p>(a) Calculate the minimum amount Deirdre must deposit to ensure she has accumulated at least £8175 when the lump sum payment is due.</p><p>In June 2021, when Deirdre bought the van, the Consumer Price Index (CPI) was 111.4.<br>After three years, the CPI was 133.0.</p><p>(b) Determine whether Deirdre's savings have increased at least in line with inflation. Give a reason for your answer.</p><p>Deirdre's insurance policy has a £195 excess for accidental damage.<br>Her van door is damaged in an accident.<br>A company has quoted £210 to repair the damage.</p><p>(c) Give one reason why Deirdre might not choose to make a claim on her insurance.</p>`,
          answer: `<p>(a) \\(1.071^{3}=1.2284809\\), so the deposit is \\(\\frac{8175}{1.2284809}=6654.56...\\)<br><strong>£6654.56</strong></p><p>(b) Savings growth factor \\(=1.071^{3}=1.228\\), inflation factor \\(=\\frac{133.0}{111.4}=1.194.\\)<br><strong>Yes</strong> — 1.228 is greater than 1.194, so her savings have grown faster than inflation.</p><p>(c) The repair costs £210 and the excess is £195, so Deirdre would only recover £15. Claiming would cost her a no-claims discount and raise her future premiums by far more than £15.</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "3833s",
          topics: ["Finance"],
          subtopics: ["Present Value", "Inflation & Purchasing Power", "Financial Decision Making"],
          marks: [2, 2, 1]
        },
        {
          dataBookletSection: 3,
          dataBookletLabel: "Honeybees",
          question: `<small><strong><span style="white-space: nowrap;">2026 Q11</span></strong></small><p><strong>You must refer to the information on 'Honeybees' given in the pre-release material when answering this question.</strong></p><p>Each year the National Hive Count takes place. During the count, all UK beekeepers are asked to submit the number of honeybee hives they own.<br>The following data was collected:</p>
          <table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm">
            <thead>
              <tr>
                <th class="border border-slate-300 p-2 text-center">Year</th>
                <th class="border border-slate-300 p-2 text-center">Number of honeybee hives</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border border-slate-300 p-2 text-center">2019</td><td class="border border-slate-300 p-2 text-center">264 000</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">2020</td><td class="border border-slate-300 p-2 text-center">260 000</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">2021</td><td class="border border-slate-300 p-2 text-center">272 631</td></tr>
              <tr><td class="border border-slate-300 p-2 text-center">2022</td><td class="border border-slate-300 p-2 text-center">288 311</td></tr>
            </tbody>
          </table>
          <p>(a) State one reason why the data might misrepresent the number of honeybee hives in the UK.</p>
          <p>From 2022 to 2023 there was a decline of approximately 36 000 beehives.<br>A newspaper published this graph with the headline:</p><p>'NO honeybees in UK by 2031!'</p><img src="/img/Higherapps_Past_Papers/2026/2026_Q11.webp" alt="Line graph of the number of honeybee hives from 2019 to 2023, with a dashed line extrapolating the 2022 to 2023 decline down to zero by 2031"><p>(b) Explain why the headline may be unrealistic.</p>
          <p>It takes approximately 17 000 honeybees one month to produce one jar of honey.</p><p>(c) Estimate the weight of honey produced in the UK in 2022.<br>State any assumptions you have made.</p>`,
          answer: `<p>(a) The count relies on beekeepers submitting their own figures, so hives belonging to unregistered or amateur beekeepers, and wild colonies, are left out.</p><p>(b) The headline assumes the fall from one year alone continues in a straight line to zero. A population is unlikely to keep declining at a constant rate, and the earlier years show the number rising as well as falling.</p><p>(c) Assumptions: about 68 000 bees per hive, honey produced for 6 months of the year, and a jar weighing 500 g.<br>Jars per hive per month \\(=68\\,000\\div17\\,000=4\\), so 24 jars per hive per year.<br>\\(288\\,311\\times24=6\\,919\\,464\\) jars, and \\(6\\,919\\,464\\times0.5=\\) about <strong>3 460 000 kg</strong>.<br>Other reasonable assumptions give different answers, provided they are stated.</p>`,
          videoId: "VkJiGeFTw9s",
          timestamp: "4163s",
          topics: ["Statistics & Probability", "Mathematical Modelling"],
          subtopics: ["Experiment Design & Bias", "Statistical Literacy", "Fermi Estimation"],
          marks: [1, 1, 3]
        }
      ]
    }
  ]
};
