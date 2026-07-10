export const higherAppsMathsSpecimen = {
  year: "Specimen",
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q1</span></strong></small><p>Estimate the number of hours sleep a typical person in Scotland has during their lifetime.<br>State any assumptions you make.</p>`,
          answer: `<p>Assumptions:<br>Number of hours sleep per night for an average person (e.g., 6-10 hours).<br>Life expectancy for an average adult (e.g., 65-90 years).<br>Calculation example using 8 hours, 75 years, and 365 days:<br>\\(8 \\times 365 \\times 75 = 219,000\\) hours.</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "0s",
          marks: [4],
          topics: ["Mathematical Modelling"],
          subtopics: ["Fermi Estimation"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q2</span></strong></small><p>A group of students were asked which types of TV programmes they watch regularly from a choice of comedy, reality and drama. The results were as follows:</p><ul><li>60 watch comedy</li><li>55 watch reality</li><li>21 watch drama</li><li>45 watch both comedy and reality</li><li>12 watch both reality and drama</li><li>14 watch both drama and comedy</li><li>8 watch all three of these programmes regularly</li><li>2 watched none of these programmes regularly.</li></ul><p>(a) Complete the Venn diagram to show this information:</p><img src="/img/Higherapps_Past_Papers/Spec1/spec1_Q2.png" alt="Venn diagram with three intersecting circles for comedy, reality, and drama"><p>(b) If a student is selected randomly, find the probability that they watch reality and drama TV programmes but not comedy TV programmes.</p>`,
          answer: `<p>(a) Intersections: 8 placed where all three circles overlap. 2 placed outside the circles. The remaining values completed correctly (e.g., comedy and reality only = 37, reality and drama only = 4, drama and comedy only = 6).<br>(b) Total number of students = 75. Probability = \\(\\frac{4}{75}.\\)</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "123s",
          marks: [3, 2],
          topics: ["Statistics & Probability"],
          subtopics: ["Tree & Venn Diagrams"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q3</span></strong></small><p>Zac deposits £500 into a bank account on 1 January 2018, 1 January 2019, and 1 January 2020. The bank pays interest into his account at the end of every year, using the following annual effective rates:</p><ul><li>2018: 3.3%</li><li>2019: 2.4%</li><li>2020: 1.0%</li></ul><p>He makes no withdrawals from his account.</p><p>(a) Calculate the balance in Zac's account at the end of 2020.</p><p>On 1 January 2021 Zac deposits another £500 into his account. He makes no further deposits into his account in 2021.</p><p>(b) Calculate the annual effective rate of interest needed in 2021 for the account balance to be £2100 by the end of the year.</p>`,
          answer: `<p>(a) Calculation step by step:<br>Balance 1 Jan 2019: \\(500 \\times 1.033 + 500 = 1016.50\\)<br>Balance 1 Jan 2020: \\(1016.50 \\times 1.024 + 500 = 1540.90\\)<br>Balance end of 2020: \\(1540.90 \\times 1.01 = 1556.30\\)<br>Total Balance = £1556.30</p><p>(b) Balance 1 Jan 2021: \\(1556.30 + 500 = 2056.30\\)<br>Interest rate required: \\(\\left(\\frac{2100}{2056.30} - 1\\right) \\times 100 = 2.125...\\%\\)</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "264s",
          marks: [3, 2],
          topics: [],
          subtopics: [] // Duplicate of 2022 Q4 — excluded from topic filtering
        },
        {
          attachments: [{ name: "Q4 School Roll.xlsx", url: "/resources/higher-apps/data/Specimen1/Q4 School Roll.xlsx", type: "xlsx" }],
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q4</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q4 School Roll.xlsx' when answering this question.<br>You must complete part (a) (i) and (c) (i) using the spreadsheet file.<br>Parts (a) (ii), (b), and (c) (ii) must be completed in the answer spaces provided.</strong></p><p>A school is planning a new building as it is approaching its maximum capacity. The school roll in August 2021 was 650 pupils. Approximately 18% of pupils leave by the end of each school year. 140 new S1 pupils join the roll in August each year.</p><p>(a) (i) Complete the 'School Roll' worksheet to predict the school roll in August 2031.<br>(ii) Comment on the precision of this prediction.</p><p>(b) Comment on the relationship between time and the predicted school roll up to August 2031.</p><p>The school moves forward with plans for a new building. This will increase the capacity of the school to 800 pupils.</p><p>(c) (i) Extend the table in your worksheet to construct a graph to show what is predicted to happen to the school roll in the long term. You must consider what happens to the school roll beyond August 2031.<br>(ii) Use your graph to determine whether the new capacity is suitable.</p>`,
          answer: `<p>(a) (i) 761 pupils.<br>(ii) The prediction is an estimate because the number of pupils leaving each year is approximate.<br>(b) The school roll gradually increases each year (positive linear relationship acceptable depending on working).<br>(c) (i) Spreadsheet extended to at least August 2042 showing a roll value levelling out (e.g. 776). Graph constructed.<br>(ii) Yes, the new capacity is suitable as the population is not expected to exceed 800 pupils.</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "443s",
          marks: [3, 1, 1, 2, 1],
          topics: [],
          subtopics: [] // Duplicate of 2022 Q5 — excluded from topic filtering
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q5</span></strong></small><p>The activity network for a garden renovation project is shown below.</p><img src="/img/Higherapps_Past_Papers/Spec1/spec1_Q5_1.png" alt="Activity network with nodes A to G"><p>(a) Explain, using examples from this project, the difference between an activity that is essential for the project and an activity which is critical for the project.</p><p>(b) Describe the meaning of each of the three values in Activity C's node.</p><p>(c) Produce a Gantt Chart for the above project. You do not need to include float times in your diagram.</p><img src="/img/Higherapps_Past_Papers/Spec1/spec1_Q5_2.png" alt="Blank Gantt chart grid">`,
          answer: `<p>(a) Essential: An activity like A, E, or G which is needed for the project to be finished but tends to have more flexibility in time constraints.<br>Critical: An activity like B, C, D, or F in the 'critical path'; any delays to these activities would cause a delay in the overall project end date.</p><p>(b) 3: The activity cannot start before the end of day 3. 4: The duration of the activity is 4 days. 7: The latest possible finish time of the activity is the end of day 7.</p><p>(c) A Gantt chart with 'Activity' on the vertical axis (A-G) and 'Day' on the horizontal axis (1-14). Tasks plotted correctly matching their duration and earliest start times. Connected appropriately: A&B to C, C to D&E, D to F, and E to G.</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "781s",
          marks: [2, 1, 4],
          topics: ["Planning & Decision Making"],
          subtopics: ["PERT Charts & Critical Paths", "Gantt Charts"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q6</span></strong></small><p>The three diagrams, below, show how parachutists' heights vary above the ground over a period of time.</p><img src="/img/Higherapps_Past_Papers/Spec1/spec1_Q6.png" alt="Three graphs showing height vs time for parachutists A, B, and C"><p>State which graph could not model their jump. Explain your answer clearly.</p>`,
          answer: `<p>Graph B could not model the jump. This is because a parachutist cannot go upwards (increase their height above ground) at any point during the jump, which is depicted by the curve rising in graph B.</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "1163s",
          marks: [2],
          topics: ["Mathematical Modelling"],
          subtopics: ["Identifying Graphs & Formulae", "Evaluating Models"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q7</span></strong></small><p>The average price of petrol increased at the following annual effective rates:</p><ul><li>March 2018 to 2019: 2.1%</li><li>March 2019 to 2020: 0.5%</li><li>March 2020 to 2021: 2.0%</li></ul><p>(a) Calculate the overall percentage increase in the average price of petrol over the three years from March 2018 to March 2021.</p><p>The average price of petrol in March 2021 was 136.4 pence per litre.</p><p>(b) Hence calculate the average cost of filling a 45-litre tank with petrol in March 2018.</p>`,
          answer: `<p>(a) Overall percentage increase = \\( (((1.021 \\times 1.005 \\times 1.02) - 1) \\times 100) = 4.66\\% \\)<br>(b) Price in 2018 = \\(136.4 \\div 1.0466... = 130.3\\) pence. Cost of 45 litres = \\(45 \\times 1.303 = £58.64\\) (or £58.63 depending on rounding).</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "1209s",
          marks: [1, 2],
          topics: [],
          subtopics: [] // Duplicate of 2022 Q6 — excluded from topic filtering
        },
        {
          dataBookletSection: 2,
          dataBookletLabel: "R Commands",
          attachments: [
            { name: "Q8 Biomass Data.csv", url: "/resources/higher-apps/data/Specimen1/Q8 Biomass Data.csv", type: "csv" },
            { name: "Q8 Biomass Answers.docx", url: "/resources/higher-apps/data/Specimen1/Q8 Biomass Answers.docx", type: "docx" }
          ],
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q8</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q8 Biomass Data' when answering this question.<br>You must complete parts (a) (i), (b) and (c) using statistical software.<br>You must copy and paste your answers to parts (a) (i), (b) and (c) into the word processing file 'Q8 Biomass Answers'.</strong></p><p>The UK has a varied mix of renewable technologies and fuels including biomass which is a key fuel source for the decarbonisation of electricity generation and heat provision. Woodchips are an example of a source of biomass. The heat output of woodchips used to generate energy varies depending on moisture content. The data in the spreadsheet file shows moisture content (%) and the associated heat outputs (kilowatts) of various random samples of woodchip.</p><p>(a) (i) Construct a scatter diagram for the data.<br>(ii) Make two comments about the scatter diagram.</p><p>(b) Find the equation of the regression line of heat output on percentage moisture content.</p><p>(c) Estimate the heat output of woodchips with a moisture content of 35% and interpret this estimate by referring to a prediction interval.</p><p>(d) Explain the implication of your analysis for anyone intending to use woodchips as a source of heat.</p>`,
          answer: `<p>(a)(i) Scatterplot constructed with heat output (kW) on the y-axis and moisture content (%) on the x-axis.<br>(a)(ii) e.g., There is a linear relationship. There is a strong negative association.<br>(b) heat output = \\(-0.06 \\times \\text{moisture content} + 7.96\\)<br>(c) The estimated heat output of woodchip with a moisture content of 35% is 5.9 kW, however the true value is likely to be between 5.3 and 6.6 kW.<br>(d) The lower the percentage moisture content of the woodchip, the greater the heat output.</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "1387s",
          marks: [2, 2, 2, 2, 1],
          topics: ["Statistics & Probability", "RStudio"],
          subtopics: ["Correlation & Regression"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q9</span></strong></small><p>A TV production company is responsible for the delivery of a new quiz show to a national television channel. If the production is delayed, the company will be charged an additional £10,000.</p><p>For the purposes of the cost benefit analysis, it is assumed that there are only two events that will cause a delay:</p><ul><li>0.3 probability that a key member of staff will fall ill</li><li>0.1 probability that there will be equipment failure.</li></ul><p>(a) Calculate the expected value of costs that should be considered for the cost benefit analysis.</p><p>It is possible to use the following control measures:</p><ul><li><strong>Control Measure 1:</strong> Employ back up staff who can replace anyone unwell, at a cost of £1000.</li><li><strong>Control Measure 2:</strong> Spend £3000 on an equipment inspection to ensure all equipment is functioning correctly.</li></ul><p>(b) Calculate the expected value of costs if control measure 1 is taken.</p><p>The expected value of costs if control measure 2 is taken is £6000.</p><p>(c) State which control measure(s) should be taken. Give a reason to support your recommendation.</p>`,
          answer: `<p>(a) Probability of no issues: \\((1 - 0.3) \\times (1 - 0.1) = 0.63.\\)<br>Probability of at least one issue: \\(1 - 0.63 = 0.37.\\)<br>Expected penalty: \\(0.37 \\times 10000 = £3700.\\)</p><p>(b) Cost of measure 1 + Expected penalty from equipment failure: \\(£1000 + (0.1 \\times £10000) = £2000.\\)</p><p>(c) Control measure 1 should be taken as it has the lowest expected cost (£2000 vs £3700 with no measures and £6000 for measure 2).</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "2028s",
          marks: [3, 1, 1],
          topics: ["Planning & Decision Making"],
          subtopics: ["Expected Costs & Risk"]
        },
        {
          attachments: [{ name: "Q10 Carol's Gift.xlsx", url: "/resources/higher-apps/data/Specimen1/Q10 Carol's Gift.xlsx", type: "xlsx" }],
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q10</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q10 Carol's Gift' when answering this question.<br>You must complete parts (b), (c) (i) and (c) (ii), using the spreadsheet file.</strong></p><p>Carol has received a gift of £2500, and is considering what to do with it. She has a savings account that pays interest at an annual effective rate of 1.25%.</p><p>(a) Calculate how much interest Carol would earn if she invested this gift in her savings account for 34 months.</p><p>Carol also has a personal loan. She originally borrowed £8000 to be repaid by level monthly repayments for 48 months, with the first repayment made one month after she took out the loan. Interest is charged at an annual effective rate of 4.9%.</p><p>(b) Open the 'Original Loan' worksheet. Complete formulae in the loan schedule and calculate the level monthly repayment amount, and the final repayment amount.</p><p>Carol has just made the 14th monthly repayment on the loan. She decides to find out the impact of using the £2500 gift as a lump sum payment to reduce the outstanding balance on her loan. The loan provider agrees to recalculate a new level monthly repayment amount, to be paid in each of the remaining 34 months.</p><p>(c) (i) Copy the 'Original Loan' worksheet. Rename the copy to 'Pay Lump Sum'. Adjust the 'Pay Lump Sum' worksheet as required, and hence calculate Carol's new level monthly repayment.<br>(ii) On the 'Pay Lump Sum' worksheet, calculate how much Carol would save in interest payments by making this lump sum payment.</p><p>(d) State one reason why Carol might choose to pay the gift into her savings account, rather than use it to reduce the balance on her loan.</p>`,
          answer: `<p>(a) Monthly interest rate = 0.103...%. Interest accrued over 34 months = £89.56.<br>(b) Monthly interest rate = 0.399...%. Level monthly repayment = £183.49 and adjusted final repayment = £183.28.<br>(c)(i) Outstanding balance becomes £3322.54. New monthly payments = £104.71 and £104.44.<br>(c)(ii) Total interest paid without lump sum = £628.73. Interest saved = £178.58.<br>(d) e.g., The money remains accessible if an emergency arises.</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "2347s",
          marks: [2, 4, 3, 2, 1],
          topics: ["Finance", "Excel"],
          subtopics: ["Repayment Schedules & Credit", "Financial Decision Making"]
        },
        {
          requiresPreRelease: true,
          dataBookletSection: 1,
          dataBookletLabel: "Mountain Gorillas",
          question: `<small><strong><span style="white-space: nowrap;">Specimen Q11</span></strong></small><p><strong>You must refer to the information on 'Mountain gorillas' given in the pre-release material when answering this question.</strong></p><p>The 2020 study found that the population of mountain gorillas had increased to 1004. An expert has stated that if the mountain gorilla population in the Virunga Mountains continues to grow exponentially there will be 1600 gorillas by the year 2032.</p><p>(a) Determine if the expert's statement is correct. Give a reason for your answer.</p><p>A typical adult mountain gorilla eats 30 kg of food per day.</p><p>(b) Estimate the maximum amount of termites and ants (in kg) that a typical mountain gorilla will eat during their adult lifetime. State any assumptions you have made.</p>`,
          answer: `<p>(a) Multiplying factor = \\(\\frac{1004}{680}.\\) The population in 2032 would be \\(1004 \\times \\frac{1004}{680} \\approx 1482.\\) The expert is incorrect since \\(1482 < 1600.\\)<br>(b) Total amount of food eaten in adulthood: e.g., \\(30 \\text{ kg} \\times 365 \\text{ days} \\times 25 \\text{ years} = 273,750 \\text{ kg}.\\)<br>Assumption about maximum amount of termites and ants in diet: assume 49% as a maximum percentage of diet (since mainly vegetarian).<br>Estimate amount of termites and ants eaten: \\(49\\% \\times 273,750 \\approx 134,000 \\text{ kg}.\\)</p>`,
          videoId: "kKov4ahinrE",
          timestamp: "2891s",
          marks: [2, 3],
          topics: [],
          subtopics: [] // Duplicate of 2022 Q10 — excluded from topic filtering
        }
      ]
    }
  ]
};