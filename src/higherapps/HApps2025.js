export const higherAppsMaths2025 = {
  year: 2025,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2025 Q1</span></strong></small><p>Estimate the total number of portions of fruit and vegetables that a typical person eats during their childhood.<br>State any assumptions you make.</p>`,
          answer: `<p>Assumptions (must state at least two):<br>Minimum 7 years, maximum 18 years.<br>Minimum 2 portions per day, maximum 10 portions per day.<br>Calculation example: \\(5 \\times 365 \\times 12 = 21,900\\) portions.</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "5s",
          marks: [3],
          topics: ["Mathematical Modelling"],
          subtopics: ["Fermi Estimation"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2025 Q2</span></strong></small><p>A group of gym members were asked what machines they regularly use from a choice of treadmill, rowing machine and cross trainer. The results were as follows:</p><ul><li>4 members use all three machines</li><li>38 members use both the treadmill and the rowing machine</li><li>32 members use both the cross trainer and the treadmill</li><li>15 members use both the rowing machine and the cross trainer</li><li>90 members use the treadmill</li><li>85 members use the rowing machine</li><li>53 members use the cross trainer</li><li>13 members use none of these machines.</li></ul><p>(a) Complete the Venn diagram to show this information.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q2.png" alt="Venn diagram for treadmill, rowing machine, and cross trainer"><p>(b) A gym member is selected at random. Determine the probability that they regularly use the rowing machine and the cross trainer, but not the treadmill.</p>`,
          answer: `<p>(a) Intersections: 4 (all three), 34 (treadmill & rowing only), 28 (treadmill & cross trainer only), 11 (rowing & cross trainer only). Outer circles: 24 (treadmill only), 36 (rowing only), 10 (cross trainer only). Outside circles: 13.</p><p>(b) \\(\\frac{11}{160}\\)</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "154s",
          marks: [3, 2],
          topics: ["Statistics & Probability"],
          subtopics: ["Tree & Venn Diagrams"]
        },
        {
          dataBookletSection: 1,
          dataBookletLabel: "Tax Bands",
          question: `<small><strong><span style="white-space: nowrap;">2025 Q3</span></strong></small><p><strong>You must refer to the information on 'Deductions from salaries' given in the pre-release material when answering this question.</strong></p><p>Alaina earns a gross annual salary of £24,960. She pays 8.2% of her gross annual salary into her pension and pays £82.56 National Insurance per month.<br>Calculate her net monthly salary after all deductions.</p>`,
          answer: `<p>£1656.41</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "358s",
          marks: [4],
          topics: ["Finance"],
          subtopics: ["Pay, Tax & National Insurance"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2025 Q4</span></strong></small><p>A company makes hand-made teddy bears. The tasks required to make each teddy bear are listed below.</p><table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm"><thead><tr><th class="border border-slate-300 p-2 text-left">Task</th><th class="border border-slate-300 p-2 text-left">Description</th></tr></thead><tbody><tr><td class="border border-slate-300 p-2">A</td><td class="border border-slate-300 p-2">Cut fur</td></tr><tr><td class="border border-slate-300 p-2">B</td><td class="border border-slate-300 p-2">Stuff and sew fur</td></tr><tr><td class="border border-slate-300 p-2">C</td><td class="border border-slate-300 p-2">Cut material</td></tr><tr><td class="border border-slate-300 p-2">D</td><td class="border border-slate-300 p-2">Sew clothes</td></tr><tr><td class="border border-slate-300 p-2">E</td><td class="border border-slate-300 p-2">Embroider t-shirt</td></tr><tr><td class="border border-slate-300 p-2">F</td><td class="border border-slate-300 p-2">Cut accessories</td></tr><tr><td class="border border-slate-300 p-2">G</td><td class="border border-slate-300 p-2">Sew accessories</td></tr><tr><td class="border border-slate-300 p-2">H</td><td class="border border-slate-300 p-2">Dress and accessorise</td></tr><tr><td class="border border-slate-300 p-2">I</td><td class="border border-slate-300 p-2">Package and ship bear</td></tr></tbody></table><p>The Gantt chart shows the tasks, with float times, when three employees are available to make each teddy bear. Each task is completed by a single employee.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q4_1.png" alt="Gantt chart for teddy bear manufacturing"><p>(a) State the critical path.</p><p>(b) Complete the PERT chart showing the earliest start time and the latest completion time for each task.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q4_2.png" alt="PERT chart structure"><p>(c) Determine the minimum time taken to make each teddy bear when only two employees are available.</p>`,
          answer: `<p>(a) ABHI</p><p>(b) Correctly completed forward and backward scans based on the Gantt chart task durations.</p><p>(c) 11 hours</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "637s",
          marks: [1, 4, 1],
          topics: ["Planning & Decision Making"],
          subtopics: ["PERT Charts & Critical Paths"]
        },
        {
          dataBookletSection: 4,
          dataBookletLabel: "R Commands",
          attachments: [
            { name: "Q5 Radio.csv", url: "/resources/higher-apps/data/2025/Q5 Radio.csv", type: "csv" },
            { name: "Q5 Radio Answers.docx", url: "/resources/higher-apps/data/2025/Q5 Radio Answers.docx", type: "docx" }
          ],
          question: `<small><strong><span style="white-space: nowrap;">2025 Q5</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q5 Radio.csv' for the data, and the word processing file 'Q5 Radio Answers.docx' when answering this question.<br>You must complete parts (a) (i) and (a) (iii) using appropriate statistical software.<br>You must include all output from statistical software, and your answers in the word processing file 'Q5 Radio Answers.docx'.</strong></p><p>A radio station asks their listeners to report how many hours they are listening for one week in July.<br>(a)(i) Construct a histogram to summarise the data.<br>(a)(ii) Describe the distribution of the data shown in the histogram.<br>(a)(iii) Hence, generate and state the appropriate measure of location to summarise the data.</p><p>The data is then used to determine listening hours last summer.</p><p>(b) State one reason why the data might misrepresent the listening hours last summer.</p>`,
          answer: `<p>(a)(i) Output from statistical software showing the generated histogram.<br>(a)(ii) Skewed (to the right)<br>(a)(iii) Median: 18.7 (hours)<br>(b) e.g., Extrapolation, self-recorded data, or not a random sample.</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "1041s",
          marks: [1, 1, 2, 1],
          topics: ["Statistics & Probability", "RStudio"],
          subtopics: ["Statistical Diagrams", "Descriptive Statistics", "Distribution of data", "Experiment Design & Bias"]
        },
        {
          dataBookletSection: 2,
          dataBookletLabel: "Lifetime ISA",
          question: `<small><strong><span style="white-space: nowrap;">2025 Q6</span></strong></small><p><strong>You must refer to the information on 'Lifetime ISA' given in the pre-release material when answering this question.</strong></p><p>Morgan opens a Lifetime ISA with an online bank. The account has an annual effective rate of interest of 3.25%.<br>Morgan makes a deposit of £2500 into the account on 1 January 2024. The government bonus is paid into her account on the first day of the following month.<br>She makes no further deposits in 2024.<br>Calculate the accumulated value of Morgan's Lifetime ISA on 31 December 2024.</p>`,
          answer: `<p>£3224.84</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "1415s",
          marks: [4],
          topics: ["Finance"],
          subtopics: ["Accumulated Value"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2025 Q7</span></strong></small><p>An events management company has been awarded a contract to construct the stages for a music festival. If the construction of the stages is delayed the contract says that a penalty of £25,000 will be charged.</p><p>For the purposes of the cost-benefit analysis, the company has assumed only two events will cause a delay: a stage structure failing, or staff failing to attend the site. The probability of no delay is 0.76.</p><p>(a) Calculate the expected cost of a delay.</p><p>The company is considering using the following control measures:<br>- Control Measure 1: Pay another company to have staff on standby to attend the site in the case of their staff being unable to attend, at a cost of £1000.<br>- Control Measure 2: Have a spare stage on standby in case of a failure, at a cost of £1500.<br>The probability of staff failing to attend the site is 0.2.<br>The probability of a stage structure failing is 0.05.</p><p>(b) Calculate the expected cost if control measure 2 is taken.</p><p>The expected cost if control measure 1 is taken is £2250. The company will only use one control measure.</p><p>(c) Explain which control measure the company should use to minimise expected costs.</p>`,
          answer: `<p>(a) £6000<br>(b) £6500<br>(c) Control measure 1 because it has the lowest expected cost.</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "1582s",
          marks: [2, 1, 1],
          topics: ["Planning & Decision Making"],
          subtopics: ["Expected Costs & Risk"]
        },
        {
          attachments: [{ name: "Q8 Finance.xlsx", url: "/resources/higher-apps/data/2025/Q8 Finance.xlsx", type: "xlsx" }],
          question: `<small><strong><span style="white-space: nowrap;">2025 Q8</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q8 Finance.xlsx' when answering this question.<br>You must complete parts (a) and (c) using the spreadsheet file.<br>Part (b) must be completed in the answer space provided.</strong></p><p>Martin is buying a car for £7500. The garage offered Martin the finance package below: 20% deposit, 35 level monthly repayments of £216.77, final monthly repayment £216.13.</p><p>(a) Complete the loan schedule to determine the annual effective rate of interest that is being charged for the finance package.</p><p>Car insurance is a legal requirement for cars driven on UK roads.</p><p>(b) Explain the purpose of car insurance.</p><p>(c) Martin has been saving for the deposit and car insurance. He opened a savings account with an initial deposit of £500 on 1 August 2023. He made regular monthly payments of £250 into the account on the first day of each month from 1 September 2023. Effective rates: 0.24% per month (1 Aug 2023 to 30 Nov 2023), 3.1% per year (From 1 Dec 2023).<br>Calculate the balance in Martin's savings account immediately before he makes his payment on 1 August 2024.</p>`,
          answer: `<p>(a) 19.5...% (or 1.496...% monthly)<br>(b) e.g., Financial protection in the event of an accident.<br>(c) £3307.36</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "1778s",
          marks: [5, 1, 4],
          topics: ["Finance", "Excel"],
          subtopics: ["Repayment Schedules & Credit", "Accumulated Value", "Financial Decision Making"]
        },
        {
          dataBooklets: [{ section: 3, label: "Feeding Chicks" }, { section: 4, label: "R Commands" }],
          question: `<small><strong><span style="white-space: nowrap;">2025 Q9</span></strong></small><p><strong>You must refer to the information on 'Feeding chicks' given in the pre-release material when answering this question.</strong></p><p>To monitor the effect of the type of feed on their mass, a group of chicks were randomly allocated into two groups at birth. One group was given feed type A and the second group was given feed type B from birth. The comparative boxplot summarises the mass of chicks, in grams, when weighed at three weeks old.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q9.png" alt="Boxplot of mass of chicks for Type A and Type B"><p>(a) Explain which type of feed results in chicks with the least variability in mass.</p><p>A hypothesis test was performed to compare the two groups.<br>(b)(i) State the hypothesis test performed.<br>(b)(ii) Hence state the null and alternative hypotheses.<br>(b)(iii) The p-value was 0.003147. Interpret the p-value, and the result of the hypothesis test, in context.</p><p>The type of feed used for one group of chicks is sold in 4.5 kilogram bags. The nutritional content is shown.</p><table class="table-auto border-collapse border border-slate-400 mx-auto my-4 text-sm"><thead><tr><th colspan="2" class="border border-slate-300 p-2 text-center">Nutritional content of feed</th></tr></thead><tbody><tr><td class="border border-slate-300 p-2">Protein</td><td class="border border-slate-300 p-2">720 g</td></tr><tr><td class="border border-slate-300 p-2">Fat</td><td class="border border-slate-300 p-2">150 g</td></tr><tr><td class="border border-slate-300 p-2">Fibre</td><td class="border border-slate-300 p-2">320 g</td></tr><tr><td class="border border-slate-300 p-2">Other</td><td class="border border-slate-300 p-2">3310 g</td></tr></tbody></table><p>(c) Explain whether this nutritional information is more likely to be for feed type A or type B.</p>`,
          answer: `<p>(a) Type A; it has a smaller IQR.<br>(b)(i) (Two sample) t-test.<br>(b)(ii) Null Hypothesis: there is no difference in the mean mass of chicks fed with type A and type B. Alternative Hypothesis: there is a difference in the mean mass.<br>(b)(iii) Since p-value < 0.05, reject the null hypothesis. There is evidence that suggests there is a significant difference in mean mass of chicks.<br>(c) Type A, as it contains < 20% protein (720g out of 4500g is 16%).</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "2428s",
          marks: [1, 1, 1, 2, 1],
          topics: ["Statistics & Probability"],
          subtopics: ["Statistical Diagrams", "Statistical Tests"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2025 Q10</span></strong></small><p>A cylindrical container is being filled with water.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q10_1.png" alt="Cylindrical container filling with water"><p>Initially, the depth of water is 4 centimetres. The depth of the water in the container increases at a constant rate of 3 centimetres per minute. It takes 8 minutes to finish filling the container.</p><p>(a) Draw a graph to model how the depth of water in the container changes over time until it is filled.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q10_2.png" alt="Graph grid for filling a cylindrical container"><p>(b)(i) State the type of relationship modelled in your graph.<br>(b)(ii) State the dependent variable in your graph.</p><p>(c) Another container is shown below. This container is also filled with water at a constant rate of 5 cubic centimetres per second.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q10_3.png" alt="Conical container"><p>Three graphs are shown below showing how the depth of water in the container changes over time.</p><img src="/img/Higherapps_Past_Papers/2025/2025_Q10_4.png" alt="Three graphs: A (curving up), B (linear), C (curving down)"><p>Explain which graph could model the depth of water in the container.</p>`,
          answer: `<p>(a) A straight line with a positive gradient starting at (0, 4) and finishing at (8, 28).<br>(b)(i) (Positive) linear.<br>(b)(ii) Depth (of water).<br>(c) Graph C. e.g., Depth of water increases faster at the start and then slows down (as the container gets wider).</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "3020s",
          marks: [3, 1, 1, 2],
          topics: ["Mathematical Modelling"],
          subtopics: ["Linear Models", "Identifying Graphs & Formulae"]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2025 Q11</span></strong></small><p>Freddie has a credit card with an annual effective rate of interest of 29.9%. Interest is applied at the end of each month. Payments must be made on the first day of each month. The minimum payment must be either 5% of the balance outstanding at that time or £5, whichever is higher.</p><p>After Freddie makes his payment on 1 March, the balance of his credit card was £823.19. Freddie does not use his credit card during March.</p><p>(a) Calculate the balance of his credit card on 1 April after Freddie has made the minimum payment.</p><p>(b) Give one reason why Freddie should consider paying the full balance of his credit card each month.</p>`,
          answer: `<p>(a) £799.26<br>(b) e.g., To avoid additional interest charges.</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "3212s",
          marks: [3, 1],
          topics: ["Finance"],
          subtopics: ["Repayment Schedules & Credit", "Financial Decision Making"]
        },
        {
          attachments: [{ name: "Q12 Eye Colour.xlsx", url: "/resources/higher-apps/data/2025/Q12 Eye Colour.xlsx", type: "xlsx" }],
          question: `<small><strong><span style="white-space: nowrap;">2025 Q12</span></strong></small><p><strong>You must refer to the spreadsheet file 'Q12 Eye Colour.xlsx' when answering this question.<br>You must complete parts (a), (b) and (c) using the spreadsheet file.</strong></p><p>A random sample of 50 children were invited to take part in a general health study. They were asked to answer the following questions: State your sex, State your eye colour, Are you colour blind?</p><p>The responses from the survey were partially entered into a 'Participant Responses' table. Participants 3, 7, 13, and 18 responded 'yes' to being colour blind. All other participants were not colour blind. Participant 42 has withdrawn their consent for their responses to be included in the data.</p><p>(a) Complete the 'Participant Responses' table using the information above.<br>(b) Complete the 'Eye Colour Summary' table.<br>(c) Create an appropriate chart to display the frequencies in the 'Eye Colour Summary' data.</p>`,
          answer: `<p>(a) Participant 42 removed from dataset. Participants 3, 7, 13, and 18 marked as "yes" for Colour Blind; all others marked as "no".<br>(b) blue: 11, brown: 34, green: 4.<br>(c) A bar chart or pie chart generated via software with appropriate titles and labels (e.g., Eye Colour Summary, Frequencies).</p>`,
          videoId: "CPtCgqgoab0",
          timestamp: "3457s",
          marks: [2, 2, 3],
          topics: ["Statistics & Probability", "Excel"],
          subtopics: ["Statistical Diagrams"]
        }
      ]
    }
  ]
};