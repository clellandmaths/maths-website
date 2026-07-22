import React from 'react';
import { Section } from '@/src/notes/types';
import { BlockMath, InlineMath } from '@/src/notes/math-components';

export const national5AppsData: Section[] = [
  {
    id: "numeracy",
    title: "Numeracy",
    topics: [
            {
        id: "basic-operations",
        title: "Basic Operations & Estimation",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The SQA explicitly states that candidates frequently lose valuable marks in Paper 1 (Non-calculator) because they do not demonstrate necessary basic number skills. It is essential to maintain and practise these non-calculator arithmetic skills to guarantee your marks.</p>

            <h4 className="text-white font-semibold">1. Decimals: Addition & Subtraction</h4>
            <p>You are expected to add and subtract numbers with up to two or three decimal places.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>The Rule:</strong> You must line up the decimal points directly below one another in your working.</li>
              <li><strong>Trailing Zeroes:</strong> It is highly recommended to add "trailing zeroes" to the end of your numbers so that they all have the exact same number of decimal places before you begin the calculation (e.g., change 34.7 to 34.70).</li>
            </ul>

            <h4 className="text-white font-semibold">2. Multiplying and Dividing by Multiples of 10, 100, and 1000</h4>
            <p>To multiply or divide a decimal by a multiple of 10, 100, or 1000, you must split the calculation into two easier steps:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step A:</strong> Multiply or divide by the single digit.</li>
              <li><strong>Step B:</strong> Move the digits left or right by multiplying or dividing by 10, 100, or 1000.</li>
            </ul>
            <p><em>Example:</em> To calculate <InlineMath math="3.5 \times 400" />, you calculate <InlineMath math="(3.5 \times 4) \times 100" />.</p>

            <h4 className="text-white font-semibold">3. Order of Operations (BODMAS/BIDMAS)</h4>
            <p>Calculations must be performed in a specific mathematical order:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>B</strong>rackets</li>
              <li><strong>O</strong>rder / <strong>I</strong>ndices (Powers)</li>
              <li><strong>D</strong>ivide & <strong>M</strong>ultiply (Left to right)</li>
              <li><strong>A</strong>dd & <strong>S</strong>ubtract (Left to right)</li>
            </ul>
            <p>Operations within brackets must always be dealt with first, followed by multiplication and division, before you attempt any addition or subtraction.</p>

            <h4 className="text-white font-semibold">4. Estimation & Checking Answers</h4>
            <p>The SQA requires you to use your knowledge of rounding and estimation to check if your final answer makes logical sense in the context of the question. Always stop and ask yourself: "Does this answer seem sensible?"</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The Left-to-Right BODMAS Trap:</strong> The SQA frequently sets calculations that look tempting to read simply from left to right (e.g., <InlineMath math="27.2 - 4.6 \times 3 + 4.7" />). Candidates lose marks by ignoring the rule that multiplication must happen before addition and subtraction.</li>
                <li><strong>The Decimal Alignment Trap:</strong> When subtracting a decimal from a whole number (e.g., <InlineMath math="30 - 14.26" />), candidates often forget to write the whole number as 30.00 to allow them to borrow correctly.</li>
                <li><strong>The Unrealistic Answer Trap:</strong> Candidates often calculate an answer but fail to check if it is logically possible (e.g., calculating that a person worked 150 hours in a single day). Always estimate your answer first to ensure your final calculation is realistic.</li>
                <li><strong>The Money Formatting Trap:</strong> You will lose marks if you fail to write amounts of money to exactly two decimal places (e.g., writing £4.5 instead of £4.50).</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "basic-ops-ex1",
            question: (
              <div className="space-y-2">
                <p>A plumber is fitting a new pipe. He starts with a copper pipe that is exactly 5 metres long. He cuts off two pieces: one piece measuring 1.35 metres and another measuring 2.8 metres. Calculate the length of the copper pipe he has left. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Add the two cut lengths together. Add a trailing zero to the 2.8 so both numbers have two decimal places.</p>
                <BlockMath math="1.35 + 2.80 = 4.15\text{ metres}" />
                <p><strong>Step 2:</strong> Subtract the total cut pieces from the original 5 metres. Crucially, add a decimal point and two trailing zeroes to the 5 to allow for correct borrowing.</p>
                <BlockMath math="5.00 - 4.15 = 0.85\text{ metres}" />
                <p>Answer: <InlineMath math="0.85\text{ m}" />.</p>
              </div>
            )
          },
          {
            id: "basic-ops-ex2",
            question: (
              <div className="space-y-2">
                <p>A local cafe sells 300 premium hot chocolates over the course of a weekend. If each hot chocolate requires 14.2 grams of cocoa powder, calculate the total weight of cocoa powder used. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Calculation: <InlineMath math="14.2 \times 300" /></p>
                <p><strong>Step A (Multiply by the single digit):</strong></p>
                <BlockMath math="14.2 \times 3 = 42.6" />
                <p><strong>Step B (Multiply by 100):</strong></p>
                <BlockMath math="42.6 \times 100 = 4260\text{ grams}" />
                <p><strong>Estimation Check:</strong> <InlineMath math="15\text{ grams} \times 300 = 4500\text{ grams}" />, so 4260 grams is a highly sensible answer.</p>
              </div>
            )
          },
          {
            id: "basic-ops-ex3",
            question: (
              <div className="space-y-2">
                <p>A student is checking an invoice for school supplies. The invoice lists the following calculation to find the total cost in pounds: <InlineMath math="12.50 + 4.20 \times 6" /></p>
                <p>The student claims the total cost is £100.20. Determine if the student is correct. Use your working to justify your answer. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> According to BODMAS, the multiplication must be calculated before the addition.</p>
                <BlockMath math="4.20 \times 6 = 25.20" />
                <p><strong>Step 2:</strong> Substitute this back into the original sum and perform the addition.</p>
                <BlockMath math="12.50 + 25.20 = 37.70" />
                <p><strong>Final Answer (Communication):</strong> The student is incorrect. They calculated the sum from left to right instead of using BODMAS. The correct total is £37.70. (Note the money format to two decimal places).</p>
              </div>
            )
          }
        ]
      },
            {
        id: "fractions",
        title: "Fractions",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> Fractions in National 5 Applications often involve adding and subtracting parts of a whole to find a missing amount, or calculating leftover amounts from multiple wholes (such as multiple cakes or pizzas). Always ensure you have a common denominator before doing any addition or subtraction!</p>

            <h4 className="text-white font-semibold">1. Adding & Subtracting Fractions</h4>
            <p>You cannot add or subtract fractions unless the bottom numbers (denominators) are the same.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Find a common denominator (the lowest common multiple of the bottom numbers).</li>
              <li><strong>Step 2:</strong> Multiply the top numbers (numerators) by the same amount you multiplied the bottom numbers by.</li>
              <li><strong>Step 3:</strong> Add or subtract the numerators. The denominator stays the same.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Finding "The Rest" (Fractions of a Whole)</h4>
            <p>If a question gives you several fractions of a group and asks for "the rest" or "the remaining", you must:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add the given fractions together.</li>
              <li>Subtract your total from 1 (a whole).</li>
            </ul>
            <p><em>Tip:</em> The number 1 can be written as any fraction where the top and bottom numbers are identical (e.g., <InlineMath math="1 = \frac{15}{15}" /> or <InlineMath math="1 = \frac{24}{24}" />).</p>

            <h4 className="text-white font-semibold">3. Top-Heavy (Improper) Fractions & Mixed Numbers</h4>
            <p>You are expected to be able to work with and convert between mixed numbers (e.g., <InlineMath math="3 \frac{1}{2}" />) and top-heavy fractions (e.g., <InlineMath math="\frac{7}{2}" />).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Converting to Top-Heavy:</strong> Multiply the whole number by the denominator, then add the numerator (e.g., for <InlineMath math="2 \frac{3}{4}" />, calculate <InlineMath math="2 \times 4 + 3 = 11" />, so the fraction is <InlineMath math="\frac{11}{4}" />).</li>
              <li>Always convert mixed numbers into top-heavy fractions before trying to add or subtract them.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Simplifying</h4>
            <p>Always check your final answer to see if the top and bottom numbers can be divided by a common factor.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Adding Denominators" Trap:</strong> A classic error under exam pressure is adding both the numerators AND the denominators together (e.g., deciding that <InlineMath math="\frac{1}{3} + \frac{1}{4} = \frac{2}{7}" />). You must find a common denominator first!</li>
                <li><strong>The "Multiple Wholes" Trap:</strong> When a question states that someone bought 2 identical cakes or pizzas and gives you the fractions eaten from each, candidates frequently just add the fractions together and subtract from 1, completely forgetting that there were 2 wholes to begin with.</li>
                <li><strong>The Unsimplified Final Answer:</strong> Failing to express your final fraction in its simplest form can occasionally cost you the final communication mark. Always check if both numbers halve, or divide by 3 or 5.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "fractions-ex1",
            question: (
              <div className="space-y-2">
                <p>A school is organising a summer trip for the S0 year group.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><InlineMath math="\frac{2}{5}" /> of the pupils voted to go to a theme park.</li>
                  <li><InlineMath math="\frac{1}{3}" /> of the pupils voted to go to the zoo.</li>
                  <li>The remaining pupils voted to go to the cinema.</li>
                </ul>
                <p>Calculate the fraction of pupils who voted to go to the cinema. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Add the two known fractions together by finding a common denominator (15).</p>
                <BlockMath math="\frac{2}{5} + \frac{1}{3} = \frac{6}{15} + \frac{5}{15} = \frac{11}{15}" />
                <p><strong>Step 2:</strong> Subtract this total from 1 (the whole year group) to find the remainder.</p>
                <BlockMath math="1 - \frac{11}{15} \Rightarrow \frac{15}{15} - \frac{11}{15} = \frac{4}{15}" />
                <p><strong>Final Answer:</strong> <InlineMath math="\frac{4}{15}" /> of the pupils voted for the cinema.</p>
              </div>
            )
          },
          {
            id: "fractions-ex2",
            question: (
              <div className="space-y-2">
                <p>A carpenter has a wooden board measuring <InlineMath math="5 \frac{1}{4}" /> metres in length. He cuts off a piece measuring <InlineMath math="2 \frac{2}{3}" /> metres to build a shelf. Calculate the length of the remaining wooden board. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Convert both mixed numbers into top-heavy fractions.</p>
                <BlockMath math="5 \frac{1}{4} = \frac{(5 \times 4) + 1}{4} = \frac{21}{4}" />
                <BlockMath math="2 \frac{2}{3} = \frac{(2 \times 3) + 2}{3} = \frac{8}{3}" />
                <p><strong>Step 2:</strong> Find a common denominator (12) and subtract the cut piece from the total.</p>
                <BlockMath math="\frac{21}{4} - \frac{8}{3} = \frac{63}{12} - \frac{32}{12} = \frac{31}{12}" />
                <p><strong>Step 3:</strong> Convert the top-heavy fraction back into a mixed number (how many 12s go into 31?).</p>
                <p>Answer: <InlineMath math="2 \frac{7}{12}" /> metres.</p>
              </div>
            )
          },
          {
            id: "fractions-ex3",
            question: (
              <div className="space-y-2">
                <p>David bought 2 identical large pizzas for a family movie night.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>His children ate <InlineMath math="\frac{5}{6}" /> of the first pizza.</li>
                  <li>The adults ate <InlineMath math="\frac{3}{8}" /> of the second pizza.</li>
                </ul>
                <p>Calculate the total amount of pizza left over. Give your answer as a fraction of a single pizza. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate how much is left over from the first pizza.</p>
                <BlockMath math="1 - \frac{5}{6} = \frac{1}{6} \text{ left over}" />
                <p><strong>Step 2:</strong> Calculate how much is left over from the second pizza.</p>
                <BlockMath math="1 - \frac{3}{8} = \frac{5}{8} \text{ left over}" />
                <p><strong>Step 3:</strong> Add the two leftover amounts together by finding a common denominator (24).</p>
                <BlockMath math="\frac{1}{6} + \frac{5}{8} = \frac{4}{24} + \frac{15}{24} = \frac{19}{24}" />
                <p><strong>Final Answer:</strong> There is <InlineMath math="\frac{19}{24}" /> of a pizza left over.</p>
              </div>
            )
          }
        ]
      },
            {
        id: "percentages",
        title: "Percentages",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The SQA explicitly highlights that understanding the interrelationships between fractions, decimals, and percentages allows you to choose the most efficient route to a solution, saving you vital time in the non-calculator paper.</p>
            
            <h4 className="text-white font-semibold">1. Equivalences (Fractions, Decimals, and Percentages)</h4>
            <p>You must be able to convert equivalences between fractions, decimals, and percentages seamlessly. For example, the SQA expects you to know that calculating 75% of an amount is exactly the same as finding <InlineMath math="\frac{3}{4}" /> of it. You must commit the following standard equivalences to memory:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><InlineMath math="50\% = \frac{1}{2}" /></li>
              <li><InlineMath math="25\% = \frac{1}{4}" /></li>
              <li><InlineMath math="75\% = \frac{3}{4}" /></li>
              <li><InlineMath math="20\% = \frac{1}{5}" /></li>
              <li><InlineMath math="10\% = \frac{1}{10}" /></li>
              <li><InlineMath math="33 \frac{1}{3}\% = \frac{1}{3}" /></li>
              <li><InlineMath math="66 \frac{2}{3}\% = \frac{2}{3}" /></li>
            </ul>

            <h4 className="text-white font-semibold">2. Calculating Percentages of a Quantity (Non-Calculator)</h4>
            <p>More complex percentages can be worked out without a calculator by finding 10% or 1% first as "building blocks".</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To find 10%, divide the amount by 10.</li>
              <li>To find 1%, divide the amount by 100.</li>
              <li>To find 5%, simply halve your 10% value.</li>
            </ul>
            <p>By combining these blocks, you can find any amount. For example, to find 7.5%, you can calculate 5% (half of 10%) and 2.5% (half of 5%), and then add them together.</p>

            <h4 className="text-white font-semibold">3. Expressing a Quantity as a Percentage</h4>
            <p>You will frequently need to express one quantity as a percentage of another. To find the percentage, there are three steps: write the quantities as a fraction, change it to a decimal by dividing, and then change it to a percentage by multiplying by 100.</p>
            <p><strong>Formula:</strong> <InlineMath math="\frac{\text{Amount}}{\text{Total}} \times 100" /></p>
            <p><strong>Without a calculator:</strong> Try to simplify the fraction or use equivalent fractions to multiply/divide the top and bottom until you obtain the number 100 on the bottom. The number left on the top is your percentage.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Original Value" Trap:</strong> In questions asking for percentage increase, decrease, profit, or loss, you always have to work out the percentage based on the original amount. Candidates frequently drop marks by successfully finding the difference in price, but then mistakenly dividing it by the new/selling price.</li>
                <li><strong>The "Inefficient Route" Trap:</strong> In Paper 1, if you are asked to calculate <InlineMath math="33 \frac{1}{3}\%" /> or <InlineMath math="66 \frac{2}{3}\%" /> of an amount, do NOT attempt to find 1% and multiply. You are expected to spot the equivalence and simply divide the amount by 3 (and multiply by 2 for the latter).</li>
                <li><strong>The "Subtract from 100" Trap:</strong> A question may state how many items passed a quality check, but then ask you to calculate the percentage that were rejected. Always read the bold words carefully to ensure you are calculating the percentage of the correct group.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "percentages-ex1",
            question: (
              <div className="space-y-2">
                <p>A local theatre has a maximum capacity of 840 seats. For a Wednesday matinee performance, the theatre was only 17.5% full. Calculate exactly how many seats were occupied. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Break 17.5% down into easily calculable blocks (10% + 5% + 2.5%).</p>
                <p><strong>Step 2:</strong> Calculate each block of 840.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><InlineMath math="10\% = 840 \div 10 = 84" /></li>
                  <li><InlineMath math="5\% = \text{Half of } 10\% = 42" /></li>
                  <li><InlineMath math="2.5\% = \text{Half of } 5\% = 21" /></li>
                </ul>
                <p><strong>Step 3:</strong> Add the building blocks together.</p>
                <BlockMath math="84 + 42 + 21 = 147\text{ seats occupied}" />
              </div>
            )
          },
          {
            id: "percentages-ex2",
            question: (
              <div className="space-y-2">
                <p>A vet clinic treated 320 animals in one week. 144 of these animals were dogs. Calculate the percentage of the treated animals that were dogs. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the quantities as a fraction.</p>
                <BlockMath math="\frac{144}{320}" />
                <p><strong>Step 2:</strong> Convert to a decimal by dividing, and multiply by 100 to find the percentage.</p>
                <BlockMath math="(144 \div 320) \times 100 = 45\%" />
              </div>
            )
          },
          {
            id: "percentages-ex3",
            question: (
              <div className="space-y-2">
                <p>A gamer buys a vintage games console online for £450. One year later, he decides to sell it to a second-hand shop for £387. Calculate his loss as a percentage of the original price. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the actual financial loss.</p>
                <BlockMath math="\pounds450 - \pounds387 = \pounds63" />
                <p><strong>Step 2:</strong> Express the loss as a fraction of the original purchase price, NOT the selling price.</p>
                <BlockMath math="\frac{63}{450}" />
                <p><strong>Step 3:</strong> Convert to a percentage.</p>
                <BlockMath math="(63 \div 450) \times 100 = 14\%\text{ loss}" />
              </div>
            )
          }
        ]
      },
            {
        id: "compound-percentages",
        title: "Compound Percentages (Appreciation & Depreciation)",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The SQA explicitly encourages candidates to use the most efficient strategy available when answering compound percentage questions. You must calculate compound percentages using a decimal multiplier and a power rather than using a slow, step-by-step, year-by-year approach.</p>
            <h4 className="text-white font-semibold">1. Finding the Decimal Multiplier</h4>
            <p>Before doing any calculations, you must convert the percentage change into a decimal multiplier.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Appreciation (Increase):</strong> Add the percentage to 100%, then divide by 100. <br/><em>Example:</em> A 4% increase <InlineMath math="\rightarrow 100\%. + 4\%. = 104\%. \rightarrow 1.04" /> multiplier.</li>
              <li><strong>Depreciation (Decrease):</strong> Subtract the percentage from 100%, then divide by 100. <br/><em>Example:</em> A 15% decrease <InlineMath math="\rightarrow 100\%. - 15\%. = 85\%. \rightarrow 0.85" /> multiplier.</li>
            </ul>

            <h4 className="text-white font-semibold">2. The Compound Formula</h4>
            <p>Once you have your multiplier, use the following formula to find the final amount in a single calculation on your calculator:</p>
            <BlockMath math="\text{Original Amount} \times \text{Multiplier}^{\text{Time}}" />
            <p>Time is usually the number of years (or months/days), which you input using the power button (e.g., <InlineMath math="x^y" /> or <InlineMath math="y^x" />) on your calculator.</p>

            <h4 className="text-white font-semibold">3. Mixed Fluctuations</h4>
            <p>If an amount increases one year and decreases the next, you do not need to do separate calculations. You can simply chain the multipliers together.</p>
            <BlockMath math="\text{Original} \times \text{Multiplier}_1 \times {\text{Multiplier}_2}^{\text{Time}}" />

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The Year-by-Year Trap:</strong> Do not calculate the percentage for year 1, add it on, then calculate year 2, add it on, etc. SQA examiners actively advise against this because it consumes far too much exam time and frequently leads to arithmetic and premature rounding errors. Use a multiplier and a power!</li>
                <li><strong>The Significant Figures Trap:</strong> Compound percentage questions almost always feature an instruction to round your final answer to a specific number of significant figures. You will lose the final mark if you ignore this. Always write down your unrounded answer from the calculator display first, then write your rounded answer underneath.</li>
                <li><strong>The Money Formatting Trap:</strong> If the question involves calculating a financial value and does not specify rounding to significant figures, you must remember that candidates lose marks for failing to write amounts of money to exactly two decimal places.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "compound-perc-ex1",
            question: (
              <div className="space-y-2">
                <p>A city has a population of 125,400. The population is expected to increase by 3.2% each year for the next 4 years. Calculate the expected population of the city after 4 years. Give your answer rounded to 3 significant figures. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the decimal multiplier for a 3.2% increase.</p>
                <BlockMath math="100\%. + 3.2\%. = 103.2\%. = 1.032" />
                <p><strong>Step 2:</strong> Set up the calculation using the original amount, the multiplier, and the power of 4 (for 4 years).</p>
                <BlockMath math="125,400 \times 1.032^4" />
                <p><strong>Step 3:</strong> Write down the unrounded answer from your calculator.</p>
                <BlockMath math="= 142,238.163..." />
                <p><strong>Step 4:</strong> Round to exactly 3 significant figures (the first three important digits, filling the rest with placeholder zeroes).</p>
                <p>Answer: <InlineMath math="142,000\text{ people}" />.</p>
              </div>
            )
          },
          {
            id: "compound-perc-ex2",
            question: (
              <div className="space-y-2">
                <p>An electronics company currently sells 350,000 gaming consoles per year. Due to supply issues, it is predicted that sales will:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Decrease by 6.5% in the next year.</li>
                  <li>Increase by 4.8% in each of the following 2 years.</li>
                </ul>
                <p>Calculate the predicted number of console sales after 3 years. Give your answer to 3 significant figures. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the multiplier for the 6.5% decrease (Year 1).</p>
                <BlockMath math="100\%. - 6.5\%. = 93.5\%. = 0.935" />
                <p><strong>Step 2:</strong> Find the multiplier for the 4.8% increase (Years 2 & 3).</p>
                <BlockMath math="100\%. + 4.8\%. = 104.8\%. = 1.048" />
                <p><strong>Step 3:</strong> Chain the calculation together. Note that the second multiplier needs a power of 2 because it lasts for two years.</p>
                <BlockMath math="350,000 \times 0.935 \times 1.048^2" />
                <p><strong>Step 4:</strong> Evaluate to find the unrounded answer.</p>
                <BlockMath math="= 359,514.808" />
                <p><strong>Step 5:</strong> Round to 3 significant figures.</p>
                <p>Answer: <InlineMath math="360,000\text{ consoles}" />.</p>
              </div>
            )
          },
          {
            id: "compound-perc-ex3",
            question: (
              <div className="space-y-2">
                <p>Jack buys a brand new car for £18,500. The car depreciates in value by 14% each year. Calculate the value of Jack's car after 3 years. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the multiplier for a 14% decrease.</p>
                <BlockMath math="100\%. - 14\%. = 86\%. = 0.86" />
                <p><strong>Step 2:</strong> Set up the calculation with a power of 3.</p>
                <BlockMath math="\pounds18,500 \times 0.86^3" />
                <p><strong>Step 3:</strong> Evaluate and ensure the final answer is formatted correctly as money (to two decimal places if required, though here it resolves to exact pence).</p>
                <BlockMath math="= \pounds11,767.09" />
                <p><em>(The calculator displays 11767.088, which must be rounded to two decimal places for money).</em></p>
              </div>
            )
          }
        ]
      },
            {
        id: "ratio-proportion",
        title: "Ratio & Proportion",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The most critical step in any proportion question is stopping to ask yourself: "Is this Direct or Inverse proportion?" If you apply the wrong rule, you will lose almost all the marks for that question.</p>

            <h4 className="text-white font-semibold">1. Simplifying Ratios</h4>
            <p>Ratios must often be written in their simplest form. Just like fractions, you must find the highest common factor and divide both (or all) sides of the ratio by the same number.</p>

            <h4 className="text-white font-semibold">2. Sharing in a Ratio (When given the TOTAL amount)</h4>
            <p>To split a total quantity into a given ratio:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Add the numbers in the ratio together to find the total number of parts.</li>
              <li><strong>Step 2:</strong> Divide the total amount by this number to find the value of one part.</li>
              <li><strong>Step 3:</strong> Multiply the value of one part by each specific number in the ratio.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Sharing in a Ratio (When given ONE PERSON'S share)</h4>
            <p>Sometimes, the SQA will give you the amount one person received, raa�her than the total.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Divide their monetary amount by their specific number of ratio parts to find the value of 1 part.</li>
              <li><strong>Step 2:</strong> Multiply this value by the total number of parts to find the overall total.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Direct Proportion</h4>
            <p>In direct proportion, as one quantity increases, the other increases at the exact same rate. (For example, buying 5 apples costs more than buying 1 apple).</p>
            <p><strong>The Method:</strong> Divide to find the value of ONE unit, then multiply by the number of units you need. Ensure your units are consistent before calculating.</p>

            <h4 className="text-white font-semibold">5. Inverse (Indirect) Proportion</h4>
            <p>In inverse proportion, as one quantity increases, the other decreases. (For example, if you hire more painters, the time it takes to paint a room decreases).</p>
            <p><strong>The Method:</strong> Multiply the two given numbers together to find the "total effort" (e.g., worker-hours). Then, divide this total by the new number of workers/machines to find the new time.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Direct vs. Inverse" Trap:</strong> Candidates frequently read an inverse proportion question (like workers building a wall) and treat it as direct proportion. If your calculation results in 6 workers taking longer to build a wall than 3 workers, you have fallen into the trap.</li>
                <li><strong>The "Extra Workers" Trap:</strong> The SQA loves to state that a company sent "2 extra workers" to help with a job. Candidates frequently divide the total worker-hours by 2, completely forgetting that they must add the 2 extra workers to the original team first.</li>
                <li><strong>The "Given Share" Trap:</strong> When given a ratio (e.g., 2:3:4) and told that the last person received £120, candidates often mistakenly divide £120 by the total parts (9). You must only divide it by their specific parts (4).</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "ratio-prop-ex1",
            question: (
              <div className="space-y-2">
                <p>Alice, Ben, and Charlie are business partners. They share the annual profits of their business in the ratio 4:3:5. This year, Charlie received a share of £1,850. Calculate the total profit the business made this year. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the value of exactly 1 part. Since Charlie gets 5 parts and his share is £1,850, we divide his amount by his parts.</p>
                <BlockMath math="\pounds1,850 \div 5 = \pounds370 \text{ (This is 1 part)}" />
                <p><strong>Step 2:</strong> Calculate the total number of parts in the ratio.</p>
                <BlockMath math="4 + 3 + 5 = 12 \text{ parts total}" />
                <p><strong>Step 3:</strong> Multiply the value of 1 part by the total number of parts.</p>
                <BlockMath math="\pounds370 \times 12 = \pounds4,440" />
                <p><strong>Final Answer:</strong> The total profit was £4,440.</p>
              </div>
            )
          },
          {
            id: "ratio-prop-ex2",
            question: (
              <div className="space-y-2">
                <p>A gardener uses liquid plant food to feed a large greenhouse. The instructions state that 8 ml of plant food must be used for every 5,000 ml of water. Calculate the volume of plant food required for 12 litres of water. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Ensure units match. Convert 12 litres into millilitres.</p>
                <BlockMath math="12 \text{ litres} = 12,000 \text{ ml}" />
                <p><strong>Step 2:</strong> Find out how much water 1 ml of plant food treats (Divide).</p>
                <BlockMath math="5,000 \div 8 = 625 \text{ ml of water per 1 ml of food}" />
                <p><strong>Step 3:</strong> Divide the total required water by this unit rate.</p>
                <BlockMath math="12,000 \div 625 = 19.2 \text{ ml}" />
                <p><em>(Alternative method: <InlineMath math="12,000 \div 5,000 = 2.4" />, then <InlineMath math="2.4 \times 8 = 19.2" />).</em></p>
                <p><strong>Final Answer:</strong> 19.2 ml of plant food is required.</p>
              </div>
            )
          },
          {
            id: "ratio-prop-ex3",
            question: (
              <div className="space-y-2">
                <p>A school hires a contractor to refurbish the science labs. It normally takes a team of 4 workers exactly 15 hours to complete this task. To finish the job faster, the contractor sends 2 additional workers. All workers work at the exact same rate. Calculate how long it will take the new team to complete the refurbishment. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Recognise this is inverse proportion (more workers = less time) and calculate the "total worker-hours" required for the job.</p>
                <BlockMath math="4 \text{ workers} \times 15 \text{ hours} = 60 \text{ worker-hours}" />
                <p><strong>Step 2:</strong> Calculate the new total number of workers. Avoid the trap—you must add the extra workers to the original team!</p>
                <BlockMath math="4 + 2 = 6 \text{ workers}" />
                <p><strong>Step 3:</strong> Divide the total worker-hours by the new number of workers.</p>
                <BlockMath math="60 \div 6 - 10 \text{ hours}" />
                <p><strong>Final Answer:</strong> It will take the new team 10 hours to complete the task.</p>
              </div>
            )
          }
        ]
      },
            {
        id: "rounding",
        title: "Rounding",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> If a question requires you to round your answer, you must write down your unrounded answer from your calculator display first before you write your rounded answer. If you do not write down your unrounded answer first, you will risk losing multiple marks, even if your final rounded answer is completely correct.</p>

            <h4 className="text-white font-semibold">1. Decimal Places (d.p.)</h4>
            <p>When rounding to a specified number of decimal places (the SQA expects you to be able to round up to three decimal places), you only consider the number immediately to the right of your cut-off point.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>If the digit is 5 or more, round up.</li>
              <li>If the digit is 4 or less, keep it the same.</li>
              <li><em>Example:</em> 8.4996 rounded to 3 d.p. is 8.500.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Significant Figures (s.f.)</h4>
            <p>Significant figures begin at the first non-zero digit in a number, reading from left to right.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Once you find your first significant figure, count along to find the required number of figures, then round.</li>
              <li>You must fill any remaining spaces before the decimal point with placeholder zeroes.</li>
              <li>For numbers less than 1 (e.g., 0.00567), the zeroes at the start are not significant. The first significant figure is the 5.</li>
              <li><em>Example:</em> 59,208 rounded to 2 s.f. is 59,000.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Money Formatting</h4>
            <p>Decimal answers for financial calculations must always be given to exactly two decimal places, even if the question does not explicitly tell you to round. Writing an answer as £2.5 rather than £2.50 will cost you a mark.</p>

            <h4 className="text-white font-semibold">4. Contextual Rounding (Real-Life Situations)</h4>
            <p>In some real-life situations, a decimal answer makes no logical sense, and you must decide whether to round up or down to the nearest whole number based on the context.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Rounding Up:</strong> If you are calculating how many buses are needed for a trip, or how many packets of seeds are required to cover a lawn, you must round up (e.g., 19.6 buses means you must order 20 buses, because 19 isn't enough).</li>
              <li><strong>Rounding Down:</strong> When calculating how many objects fit into a container, you must truncate (round down) to a whole number, because you cannot pack a fraction of an object.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Hidden Unrounded" Trap:</strong> This is one of the most common ways candidates drop marks across the entire paper. In multi-mark questions (like compound percentages), one mark is awarded for the unrounded answer, and the final mark is for the rounding. Skipping straight to the rounded answer loses both marks.</li>
                <li><strong>The "Trailing Zero" Trap:</strong> When rounding to significant figures, candidates often incorrectly add .0 or .00 to the end of a whole number. For example, rounding 446.586 to 1 s.f. is 400, not 400.0.</li>
                <li><strong>The "Ignoring Context" Trap:</strong> Candidates frequently calculate an exact decimal and move on without reading the context. If a question asks "How many complete cakes can be made?", leaving an answer of 42.8 instead of 42 will lose you the final communication mark.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "rounding-ex1",
            question: (
              <div className="space-y-2">
                <p>A local charity receives a donation of £45,000. They invest the money in an account that pays a compound interest rate of 3.4% per annum. Calculate the value of the investment after 4 years. Give your answer to 3 significant figures. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the decimal multiplier for a 3.4% increase.</p>
                <BlockMath math="100\% + 3.4\% = 103.4\% \rightarrow 1.034" />
                <p><strong>Step 2:</strong> Apply the multiplier and the power for 4 years.</p>
                <BlockMath math="\pounds45,000 \times 1.034^4" />
                <p><strong>Step 3:</strong> Write down the unrounded answer from the calculator. (Do not skip this!)</p>
                <BlockMath math="= \pounds51,438.318..." />
                <p><strong>Step 4:</strong> Round to the first 3 significant figures (the 5, the 1, and the 4). Use zeroes as placeholders for the rest of the whole number.</p>
                <BlockMath math="= \pounds51,400" />
              </div>
            )
          },
          {
            id: "rounding-ex2",
            question: (
              <div className="space-y-2">
                <p>A school is organising a trip to a museum for 334 pupils and 18 teachers. They are hiring coaches for the journey. Each coach holds a maximum of 48 passengers. Calculate how many coaches the school must hire. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the total number of passengers.</p>
                <BlockMath math="334 + 18 = 352 \text{ passengers}" />
                <p><strong>Step 2:</strong> Divide the total passengers by the capacity of one coach.</p>
                <BlockMath math="352 \div 48 = 7.333..." />
                <p><strong>Step 3:</strong> Make a contextual decision. You cannot hire 0.33 of a coach. 7 coaches would only hold 336 people, leaving people behind. Therefore, you must round up.</p>
                <BlockMath math="= 8 \text{ coaches}" />
              </div>
            )
          },
          {
            id: "rounding-ex3",
            question: (
              <div className="space-y-2">
                <p>Convert <InlineMath math="\frac{5}{14}" /> to a decimal fraction. Round your answer to 3 decimal places. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Divide the top number by the bottom number to convert to a decimal, writing down the unrounded display.</p>
                <BlockMath math="5 \div 14 = 0.357142..." />
                <p><strong>Step 2:</strong> Look at the 4th decimal digit (the 1) to decide how to round the 3rd digit (the 7). Because it is 4 or less, it stays the same.</p>
                <BlockMath math="= 0.357" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "finance",
    title: "Finance",
    topics: [
            {
        id: "income",
        title: "Income (Gross/Net, Overtime, Bonus, Commission & Allowances)",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The SQA constantly tests your ability to read the fine print in income questions. Before calculating commission, you must always check if the percentage is applied to total sales or only on sales over a certain amount.</p>

            <h4 className="text-white font-semibold">1. Gross Pay vs. Net Pay</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Gross Pay:</strong> The total amount of money a person earns before any taxes or deductions are taken away. This includes their basic salary, plus any overtime, commission, bonuses, or allowances.</li>
              <li><strong>Net Pay:</strong> The amount of money a person actually "takes home" after all deductions (like Income Tax, National Insurance, and pensions) have been subtracted from their Gross Pay.</li>
            </ul>
            <p>Formula: <InlineMath math="\text{Net Pay} = \text{Gross Pay} - \text{Total Deductions}" /></p>

            <h4 className="text-white font-semibold">2. Overtime</h4>
            <p>When employees work more than their contracted hours, they are often paid at a higher "overtime" rate for those extra hours.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Time-and-a-half:</strong> Multiply their basic hourly rate by 1.5.</li>
              <li><strong>Double time:</strong> Multiply their basic hourly rate by 2.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Commission</h4>
            <p>Commission is a bonus paid to sales staff based on the value of the goods they sell.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To calculate it, you must find a percentage of their sales.</li>
              <li>If they are paid commission on sales "over a certain amount", you must subtract that threshold from their total sales before calculating the percentage.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Bonuses & Allowances</h4>
            <p>A bonus is an extra payment given for meeting targets. An allowance is a fixed amount of extra money given for a specific purpose (e.g., a uniform allowance or travel allowance). These simply get added to the Gross Pay.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Commission Threshold" Trap:</strong> The SQA frequently states an employee is paid a basic salary plus a percentage commission on sales over a specific amount (e.g., over £50,000). Candidates lose marks by calculating the percentage on the entire sales total instead of finding the difference first.</li>
                <li><strong>The "Time Calculation" Trap:</strong> When working out overtime, the SQA will often give you a start time and a finish time, but hide a lunch break in the text. Candidates frequently forget to subtract the unpaid lunch break when calculating the total hours worked.</li>
                <li><strong>The "Gross vs Net" Mix-Up:</strong> Candidates often perform complex tax deductions perfectly but forget that the question only asked for Gross Pay, wasting time and losing the final mark. Always double-check which one you are being asked to find.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "income-ex1",
            question: (
              <div className="space-y-2">
                <p>Claire is a car salesperson. She is paid a basic monthly salary of £1,850. In addition, she is paid 4% commission on her monthly sales over £35,000. In August, her total sales amounted to £82,000. Calculate Claire's gross pay in August. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the sales amount eligible for commission by subtracting the threshold from her total sales.</p>
                <BlockMath math="\pounds82,000 - \pounds35,000 = \pounds47,000" />
                <p><strong>Step 2:</strong> Calculate her 4% commission on this amount.</p>
                <BlockMath math="4\% \text{ of } \pounds47,000 \rightarrow 47,000 \div 100 \times 4 = \pounds1,880" />
                <p><strong>Step 3:</strong> Add her commission to her basic salary to find her total Gross Pay.</p>
                <BlockMath math="\pounds1,850 + \pounds1,880 = \pounds3,730" />
              </div>
            )
          },
          {
            id: "income-ex2",
            question: (
              <div className="space-y-2">
                <p>Marcus is contracted to work 35 hours each week at a basic hourly rate of £11.40. He is paid time-and-a-half for the first 5 hours of overtime he works. Any overtime worked beyond those 5 hours is paid at double time. Last week, Marcus worked a total of 43 hours. Calculate his gross pay for last week. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate his basic pay for his contracted 35 hours.</p>
                <BlockMath math="35 \times \pounds11.40 = \pounds399.00" />
                <p><strong>Step 2:</strong> Calculate his total overtime hours.</p>
                <BlockMath math="43 - 35 = 8 \text{ hours total overtime}" />
                <p><strong>Step 3:</strong> Calculate his time-and-a-half pay for the first 5 hours of overtime.</p>
                <p>Overtime Rate 1: <InlineMath math="\pounds11.40 \times 1.5 = \pounds17.10 \text{ per hour}" /></p>
                <p>Overtime Pay 1: <InlineMath math="5 \text{ hours} \times \pounds17.10 = \pounds85.50" /></p>
                <p><strong>Step 4:</strong> Calculate his double time pay for the remaining 3 hours of overtime (8 - 5 = 3).</p>
                <p>Overtime Rate 2: <InlineMath math="\pounds11.40 \times 2 = \pounds22.80 \text{ per hour}" /></p>
                <p>Overtime Pay 2: <InlineMath math="3 \text{ hours} \times \pounds22.80 = \pounds68.40" /></p>
                <p><strong>Step 5:</strong> Add the basic pay and all overtime pay together.</p>
                <BlockMath math="\pounds399.00 + \pounds85.50 + \pounds68.40 = \pounds552.90" />
              </div>
            )
          },
          {
            id: "income-ex3",
            question: (
              <div className="space-y-2">
                <p>Sophia's basic rate of pay is £12.50 an hour. She is contracted to work 30 hours per week. She is paid time-and-a-half for any overtime she works. Last week, Sophia worked 5 days. On each of those days, she worked from 08:30 until 12:30, took a 45-minute unpaid lunch break, and then worked from 13:15 until 16:45. Calculate how much Sophia earned last week. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate her total working hours for a single day.</p>
                <p>Morning: 08:30 to 12:30 = 4 hours.</p>
                <p>Afternoon: 13:15 to 16:45 = 3.5 hours.</p>
                <p>Total per day = <InlineMath math="4 + 3.5 = 7.5 \text{ hours}" /></p>
                <p><strong>Step 2:</strong> Calculate the total hours worked over the 5 days.</p>
                <BlockMath math="7.5 \times 5 = 37.5 \text{ total hours}" />
                <p><strong>Step 3:</strong> Split the total hours into basic hours and overtime hours.</p>
                <p>Basic: 30 hours. Overtime: <InlineMath math="37.5 - 30 = 7.5 \text{ hours}" /></p>
                <p><strong>Step 4:</strong> Calculate her basic pay.</p>
                <BlockMath math="30 \times \pounds12.50 = \pounds375.00" />
                <p><strong>Step 5:</strong> Calculate her overtime rate and overtime pay.</p>
                <p>Rate: <InlineMath math="\pounds12.50 \times 1.5 = \pounds18.75" /></p>
                <p>Pay: <InlineMath math="7.5 \times \pounds18.75 = \pounds140.625" /></p>
                <p><strong>Step 6:</strong> Add them together and format to exactly two decimal places for money.</p>
                <BlockMath math="\pounds375.00 + \pounds140.625 = \pounds515.63" />
              </div>
            )
          }
        ]
      },
            {
        id: "deductions",
        title: "Deductions & Tax (Income Tax, National Insurance, Pensions)",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The SQA frequently tests your ability to follow the exact sequence of deductions. You must remember that National Insurance is always calculated on a person’s salary before deductions such as pension contributions.</p>

            <h4 className="text-white font-semibold">1. National Insurance & Tax Bands</h4>
            <p>Income Tax and National Insurance are rarely calculated as a simple, single percentage. Instead, the SQA provides tables with thresholds or "bands".</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Up to the first threshold:</strong> You pay 0%.</li>
              <li><strong>The middle band (e.g., 12%):</strong> You only pay this percentage on the portion of your salary that falls between the two stated values. To find this, subtract the lower number from your salary (or from the upper limit, if your salary exceeds it).</li>
              <li><strong>The upper band (e.g., 2%):</strong> You only pay this percentage on the amount of your salary that is strictly over the final threshold.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Pensions</h4>
            <p>A workplace pension is a retirement fund. In the exam, you will usually be asked to calculate a pension contribution as a flat percentage of the gross annual salary.</p>

            <h4 className="text-white font-semibold">3. Calculating Net Pay (Weekly/Monthly Conversions)</h4>
            <p>To find a person's Net Pay, you must subtract all three major deductions (Income Tax, National Insurance, and Pension) from their Gross Pay.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Exam questions often give you annual figures but ask for the weekly net pay.</li>
              <li>You must calculate the total annual net pay first, and then divide by 52 to find the weekly amount.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Pre-Deduction" Trap:</strong> The SQA will often list the pension deduction first in the text, baiting you into subtracting it from the gross pay before calculating National Insurance. National insurance is always calculated on the gross pay before pension deductions are taken.</li>
                <li><strong>The "Whole Salary" Trap:</strong> When calculating tax or National Insurance using bands, candidates often lose marks by applying the 12% rate to their entire salary, rather than just the slice of money that falls within that specific band.</li>
                <li><strong>The "4 Weeks in a Month" Trap:</strong> If a question asks you to convert between weekly and monthly pay, do not multiply or divide by 4. You must always use the annual figure as a bridge (multiply by 52 weeks, then divide by 12 months, or vice versa).</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "deductions-ex1",
            question: (
              <div className="space-y-2">
                <p>Mark has an annual salary of £46,500. National Insurance is calculated on a person's salary before deductions.</p>
                <p className="font-semibold underline">Annual National Insurance Rates</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Up to £12,570: 0%</li>
                  <li>From £12,570 to £50,270: 12%</li>
                  <li>Over £50,270: 2%</li>
                </ul>
                <p>Calculate Mark's annual National Insurance payment. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Look at the first band. Mark pays 0% on the first £12,570.</p>
                <BlockMath math="=\pounds0" />
                <p><strong>Step 2:</strong> Look at the second band. Mark earns £46,500, which falls inside this band. Subtract the bottom threshold to find the taxable slice.</p>
                <BlockMath math="\pounds46,500 - \pounds12,570 = \pounds33,930" />
                <p><strong>Step 3:</strong> Calculate 12% of this slice.</p>
                <BlockMath math="\pounds33,930 \div 100 \times 12 = \pounds4,071.60" />
                <p><strong>Step 4:</strong> Look at the third band. Mark does not earn over £50,270, so he pays £0 here.</p>
                <p><strong>Final Answer:</strong> Mark's annual National Insurance payment is £4,071.60.</p>
              </div>
            )
          },
          {
            id: "deductions-ex2",
            question: (
              <div className="space-y-2">
                <p>Chloe has an annual salary of £34,800. She pays 6.5% of her annual salary into her workplace pension. Her annual income tax is £4,120.50. Her annual National Insurance payment is £2,667.60. She is paid in 52 weekly payments.</p>
                <p>Calculate Chloe's weekly net pay. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate her annual pension contribution based on her gross salary.</p>
                <BlockMath math="6.5\text{\% of } \pounds34,800 = \pounds34,800 \div 100 \times 6.5 = \pounds2,262.00" />
                <p><strong>Step 2:</strong> Calculate her total annual deductions by adding the pension, tax, and National Insurance together.</p>
                <BlockMath math="\pounds2,262.00 + \pounds4,120.50 + \pounds2,667.60 = \pounds9,050.10" />
                <p><strong>Step 3:</strong> Subtract the total deductions from her gross salary to find her annual net pay.</p>
                <BlockMath math="\pounds34,800 - \pounds9,050.10 = \pounds25,749.90" />
                <p><strong>Step 4:</strong> Divide her annual net pay by 52 to find her weekly net pay.</p>
                <BlockMath math="\pounds25,749.90 \div 52 = \pounds495.19038..." />
                <p><strong>Final Answer:</strong> Formatted correctly as money, her weekly net pay is £495.19.</p>
              </div>
            )
          }
        ]
      },
            {
        id: "budgeting-best-deals",
        title: "Budgeting & Best Deals",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When an exam question asks you to determine the "best deal" or the "lowest price" across three different shops, you MUST show the full calculation and final price for all three options. If you only calculate two options and guess the third, you will lose the final justification marks.</p>

            <h4 className="text-white font-semibold">1. Balancing Outgoings & Saving Up</h4>
            <p>You will often be asked to balance a person's income against their outgoings (rent, bills, food) to find out how much they can save.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Calculating Minimum Weeks:</strong> If you are asked how many weeks it takes to save for an item, divide the total target amount by their weekly savings.</li>
              <li><strong>The Rounding Rule:</strong> You must always round UP to the next whole week. If your calculation gives 14.1 weeks, it means 14 weeks is not quite enough, so it will take 15 weeks to reach the target.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Profit & Loss</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Profit:</strong> Made when total Income is greater than total Expenditure.</li>
              <li><strong>Loss:</strong> Made when total Expenditure is greater than total Income.</li>
              <li><strong>Percentage Profit/Loss:</strong> Remember your Numeracy skills here! Always divide the actual profit or loss by the original purchase amount (Expenditure), then multiply by 100.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Best Deals & Comparing Offers</h4>
            <p>You must confidently navigate complex promotional offers to find the cheapest overall price for a set quantity of items.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>"Buy X, Get Y Free":</strong> Group the items. If an offer is "Buy 3, get 1 free", they are sold in groups of 4, but you only pay for 3. Divide your total required amount by the group size (4) to find out how many groups you need.</li>
              <li><strong>"Percentage Discount on Totals":</strong> Calculate the full price first, then apply the percentage discount multiplyer (e.g., for a 30% discount, multiply the total by 0.70).</li>
              <li><strong>Comparing Sizes:</strong> If comparing different sizes of the same product, always scale them to match (e.g., find the price per 100g, or price per kilogram).</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Incomplete Comparison" Trap:</strong> SQA Course Reports frequently highlight that candidates lose justification marks by only calculating the price for Shop A and Shop B, completely ignoring Shop C because it "looks" more expensive. You must write down a final total for all three.</li>
                <li><strong>The "Rounding Down" Savings Trap:</strong> When finding the number of weeks required to save up, candidates often round using normal mathematical rules (e.g., rounding 12.3 down to 12). If you need 12.3 weeks of savings to afford a holiday, 12 weeks of saving will leave you short of money. You must round up!</li>
                <li><strong>The "Missing Conclusion" Trap:</strong> Candidates often do all the complex calculations perfectly, but fail to write a final sentence stating clearly which shop/deal is the cheapest. The final mark is always for communication.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "budgeting-ex1",
            question: (
              <div className="space-y-2">
                <p>Josh earns £12.50 per hour and works 28 hours a week. His weekly outgoings for rent and bills total £245. Josh saves all his remaining money. He wants to book a holiday costing £680, and he wants to take £450 in spending money. Calculate the minimum number of weeks it will take him to save the total amount. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate Josh's total weekly income.</p>
                <BlockMath math="28 \times \pounds12.50 = \pounds350" />
                <p><strong>Step 2:</strong> Subtract his outgoings to find his weekly savings.</p>
                <BlockMath math="\pounds350 - \pounds245 = \pounds105 \text{ saved per week}" />
                <p><strong>Step 3:</strong> Calculate the total amount he needs to save.</p>
                <BlockMath math="\pounds680 + \pounds450 = \pounds1,130" />
                <p><strong>Step 4:</strong> Divide the total target by his weekly savings.</p>
                <BlockMath math="\pounds1,130 \div \pounds105 = 10.7619... \text{ weeks}" />
                <p><strong>Step 5:</strong> Contextual rounding. 10 weeks is not enough, so he must save for another week.</p>
                <p><strong>Final Answer:</strong> 11 weeks.</p>
              </div>
            )
          },
          {
            id: "budgeting-ex2",
            question: (
              <div className="space-y-2">
                <p>Rab needs to buy 24 boxes of wooden flooring. He looks at three different shops.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Shop A:</strong> £22 per box. Special offer: Buy 3 boxes and get a 4th box free.</li>
                  <li><strong>Shop B:</strong> £28 per box. Special offer: 35% discount on the total price when 20 or more boxes are purchased.</li>
                  <li><strong>Shop C:</strong> £16.50 per box. No special offers.</li>
                </ul>
                <p>Determine the lowest price for buying 24 boxes of flooring. Use your working to justify your answer. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1 (Shop A):</strong> The offer is in groups of 4 boxes, but you only pay for 3. How many groups of 4 are in 24 boxes?</p>
                <BlockMath math="24 \div 4 = 6 \text{ groups}" />
                <p>He needs to pay for 3 boxes in each of those 6 groups:</p>
                <BlockMath math="6 \times 3 = 18 \text{ boxes to pay for}" />
                <p>Total for Shop A: <InlineMath math="18 \times \pounds22 = \pounds396" /></p>
                
                <p><strong>Step 2 (Shop B):</strong> Calculate full price, then apply the 35% discount (Multiplier = 0.65).</p>
                <BlockMath math="\text{Full price} = 24 \times \pounds28 = \pounds672" />
                <BlockMath math="\text{Discounted price} = \pounds672 \times 0.65 = \pounds436.80" />
                
                <p><strong>Step 3 (Shop C):</strong> Calculate the straightforward price.</p>
                <BlockMath math="\text{Total for Shop C} = 24 \times \pounds16.50 = \pounds396.00" />
                
                <p><strong>Step 4 (Conclusion):</strong> Shop A and Shop C tie for the lowest price at £396.00. <em>(Note: You must explicitly state the cheapest shop(s) to get the final mark!)</em></p>
              </div>
            )
          },
          {
            id: "budgeting-ex3",
            question: (
              <div className="space-y-2">
                <p>A school tuck shop spent a total of £145.50 buying a bulk box of 60 premium chocolate bars (including delivery). They sold 32 of the bars at £2.50 each. They sold 18 of the bars at a reduced price of £1.50 each. The remaining bars passed their expiry date and had to be thrown away. Calculate the percentage loss the tuck shop made on this box. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the total income from sales. <InlineMath math="(32 \times \pounds2.50) + (18 \times \pounds1.50)" /></p>
                <BlockMath math="\pounds80.00 + \pounds27.00 = \pounds107.00 \text{ total income}" />
                <p><strong>Step 2:</strong> Calculate the actual financial loss.</p>
                <BlockMath math="\pounds145.50 - \pounds107.00 = \pounds38.50 \text{ loss}" />
                <p><strong>Step 3:</strong> Express the loss as a fraction of the original purchase price, and multiply by 100.</p>
                <BlockMath math="(38.50 \div 145.50) \times 100 = 26.4604...\%" />
                <p><strong>Final Answer:</strong> They made a 26.5% loss (rounded to 1 d.p.).</p>
              </div>
            )
          }
        ]
      },
            {
        id: "foreign-exchange",
        title: "Foreign Exchange",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When converting between two different foreign currencies, you must almost always use British Pounds (£) as a "middle bridge" unless a direct exchange rate is explicitly given. Because you are dealing with money, ensure your final answers are always rounded to exactly two decimal places where appropriate.</p>

            <h4 className="text-white font-semibold">1. The Basic Conversions</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Pounds to Foreign Currency:</strong> You multiply the amount in pounds by the exchange rate. (Example: If £1 = $1.30, then £100 = 100 × 1.30).</li>
              <li><strong>Foreign Currency to Pounds:</strong> You divide the foreign amount by the exchange rate. (Example: $130 ÷ 1.30 = £100).</li>
            </ul>

            <h4 className="text-white font-semibold">2. Foreign to Foreign (The Bridge Method)</h4>
            <p>If a question asks you to convert Dollars into Euros, you generally cannot do this in one step.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Divide the Dollars by the Dollar exchange rate to convert the money back into Pounds.</li>
              <li><strong>Step 2:</strong> Multiply that Pound value by the Euro exchange rate to find the final amount.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Multi-stage Trip Calculations</h4>
            <p>A classic SQA 4-mark question involves a person travelling to Country A, spending some of their money over several days, and then converting the leftover money for a trip to Country B.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Convert the original budget into Currency A.</li>
              <li>Calculate their total spending and subtract it from their Currency A total.</li>
              <li>Convert the remaining Currency A back into Pounds (Divide).</li>
              <li>Convert those Pounds into Currency B (Multiply).</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Wrong Operation" Trap:</strong> The most common error in exam conditions is dividing when you should multiply, or vice versa. Always do a quick logic check: if £1 gets you more than 1 unit of foreign currency (e.g. 150 Yen), your foreign amount should always be a much bigger number than your pounds.</li>
                <li><strong>The "Forgetting to Subtract" Trap:</strong> In multi-stage holiday questions, candidates frequently convert the entire original amount into the second currency, completely forgetting to subtract the money the person actually spent on their first holiday.</li>
                <li><strong>The "Rounding Too Early" Trap:</strong> When using the "Bridge Method" (Currency A → Pounds → Currency B), do not round the middle Pounds step to two decimal places if it is a long recurring decimal. Keep the full number in your calculator display until the very final step to avoid a rounding error costing you a mark.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "foreign-ex1",
            question: (
              <div className="space-y-2">
                <p>David travels to Japan and then to Australia. The exchange rates are:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>£1 = 185 Japanese Yen (JPY)</li>
                  <li>£1 = 1.90 Australian Dollars (AUD)</li>
                </ul>
                <p>David converts £850 into Japanese Yen. He stays in Japan for 5 days, spending exactly 22,000 JPY each day. He then converts his remaining JPY into Australian Dollars. Calculate how many Australian Dollars he receives. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Convert his starting money into JPY (Multiply).</p>
                <BlockMath math="\pounds850 \times 185 = 157,250 \text{ JPY}" />
                <p><strong>Step 2:</strong> Calculate his total spending and subtract it to find his remaining JPY.</p>
                <BlockMath math="5 \text{ days} \times 22,000 = 110,000 \text{ JPY spent}" />
                <BlockMath math="157,250 - 110,000 = 47,250 \text{ JPY remaining}" />
                <p><strong>Step 3:</strong> Convert the remaining JPY back into Pounds (Divide).</p>
                <BlockMath math="47,250 \div 185 = \pounds255.405405... \text{ (Keep unrounded!)}" />
                <p><strong>Step 4:</strong> Convert the Pounds into AUD (Multiply).</p>
                <BlockMath math="255.405405... \times 1.90 = 485.27027..." />
                <p><strong>Final Answer:</strong> He receives $485.27 AUD (rounded to 2 d.p. for money).</p>
              </div>
            )
          },
          {
            id: "foreign-ex2",
            question: (
              <div className="space-y-2">
                <p>Sarah's uncle in the USA sends her a gift of $150 for her birthday. Sarah is going on a school trip to France, so she exchanges the money for euros. The exchange rates are:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>£1 = $1.25</li>
                  <li>£1 = 1.15 euros</li>
                </ul>
                <p>Calculate how many euros Sarah received. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Convert the US Dollars back into Pounds (Divide).</p>
                <BlockMath math="\$150 \div 1.25 = \pounds120" />
                <p><strong>Step 2:</strong> Convert the Pounds into euros (Multiply).</p>
                <BlockMath math="\pounds120 \times 1.15 = 138" />
                <p><strong>Final Answer:</strong> Sarah received 138 euros.</p>
              </div>
            )
          },
          {
            id: "foreign-ex3",
            question: (
              <div className="space-y-2">
                <p>Craig works on an oil rig in Norway for 3 months. He is paid in Norwegian Krone (NOK).</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Month 1: 42,500 NOK</li>
                  <li>Month 2: 39,800 NOK</li>
                  <li>Month 3: 45,200 NOK</li>
                </ul>
                <p>The exchange rate is £1 = 13.50 NOK. Calculate his mean monthly earnings in pounds. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate his total earnings in NOK over the 3 months.</p>
                <BlockMath math="42,500 + 39,800 + 45,200 = 127,500 \text{ NOK}" />
                <p><strong>Step 2:</strong> Calculate his mean earnings in NOK.</p>
                <BlockMath math="127,500 \div 3 = 42,500 \text{ NOK}" />
                <p><strong>Step 3:</strong> Convert his mean NOK earnings into Pounds (Divide).</p>
                <BlockMath math="42,500 \div 13.50 = \pounds3148.14814..." />
                <p><strong>Final Answer:</strong> His mean monthly earnings are £3,148.15.</p>
              </div>
            )
          }
        ]
      },
            {
        id: "saving-borrowing",
        title: "Saving & Borrowing",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When an exam question asks you to determine which of two investment or savings options is best, you must clearly calculate the final total value for both options to make a valid comparison.</p>

            <h4 className="text-white font-semibold">1. Simple Interest</h4>
            <p>Simple interest is calculated purely on the original amount invested or borrowed. To calculate it, you find one year's interest using basic percentages, and then multiply that amount by the total number of years.</p>

            <h4 className="text-white font-semibold">2. Compound Interest (Appreciation)</h4>
            <p>Compound interest is a form of appreciation where the amount in the account is always going up, so the interest you earn grows each year.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You should always use the "quicker method" involving a decimal multiplier and a power.</li>
              <li>For example, an investment of £2500 at a rate of 2.4% over 3 years is calculated in one step: <InlineMath math="\pounds2500 \times 1.024^3" />.</li>
              <li>Using the "longer method" of calculating year-by-year becomes totally impractical over long time periods.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Loans & Repayments</h4>
            <p>When taking out a loan, you must pay back the original amount borrowed plus an additional interest charge or administration fee.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Calculate the total interest and fees.</li>
              <li><strong>Step 2:</strong> Add this to the original loan amount to find the total amount repayable.</li>
              <li><strong>Step 3:</strong> Divide this new total by the number of months to find the equal monthly repayments.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Annual Percentage Rate (APR) & Credit</h4>
            <p>APR is a standardised calculation used to compare different loans and credit cards. Because it includes both the interest rate and any mandatory fees, looking for the lowest APRs is the most accurate way to find the true, overall cost of borrowing.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🖡 Common SQA Examiner Traps 🖡</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Interest vs Balance" Trap:</strong> When comparing a compound interest savings account with a fixed-interest bond, candidates frequently calculate the total balance for one option but only the interest gained for the other. Ensure you add the interest to the original investment for OptionB so you are comparing total value against total value.</li>
                <li><strong>The "Year-by-Year" Trap:</strong> For compound interest over multiple years (e.g., 15 years), doing 15 lines of calculations is a massive trap that wastes time and causes rounding errors. Always use a multiplier and a power.</li>
                <li><strong>The "Missing Addition" Loan Trap:</strong> When asked to calculate a monthly loan repayment, candidates often calculate the administration fee and immediately divide only the fee by the number of months, forgetting to add the original loan amount back on first.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "savings-ex1",
            question: (
              <div className="space-y-2">
                <p>David has £4000 which he will invest for 3 years. He is considering two options:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Savings account: Interest rate of 3.2% per annum.</li>
                  <li>Stocks and shares ISA: 3-year investment guaranteed £95 interest for every £1000 invested.</li>
                </ul>
                <p>Determine which option will have the greater value after 3 years. Use your working to justify your answer. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1 (Savings Account):</strong> Use the compound interest multiplier for a 3.2% increase (1.032) over 3 years.</p>
                <BlockMath math="\pounds4000 \times 1.032^3 = \pounds4396.155..." />
                <p>Total value for Savings Account = £4396.16.</p>
                <p><strong>Step 2 (ISA):</strong> Calculate how many "lots" of £1000 David has.</p>
                <BlockMath math="\pounds4000 \div \pounds1000 = 4 \text{ lots}" />
                <p>Total interest = <InlineMath math="4 \times \pounds95 = \pounds380" /></p>
                <p>Total value for ISA = <InlineMath math="\pounds4000 + \pounds380 = \pounds4380.00" /></p>
                <p><strong>Step 3 (Conclusion):</strong> Compare the total values. The Savings Account will have the greater value (£4396.16 &gt; £4380.00).</p>
              </div>
            )
          },
          {
            id: "savings-ex2",
            question: (
              <div className="space-y-2">
                <p>Sarah takes out a loan of £6500. The interest plus the administration fee is 8.5% of the loan amount. The total amount will be paid back in 12 equal monthly payments. Calculate her monthly payment. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the total interest and administration fee.</p>
                <BlockMath math="8.5\% \text{ of } \pounds6500 \rightarrow 6500 \div 100 \times 8.5 = \pounds552.50" />
                <p><strong>Step 2:</strong> Add the fee to the original loan find the total amount repayable.</p>
                <BlockMath math="\pounds6500 + \pounds552.50 = \pounds7052.50" />
                <p><strong>Step 3:</strong> Divide the total amount by 12 to find the monthly repayment.</p>
                <BlockMath math="\pounds7052.50 \div 12 = \pounds587.70833..." />
                <p><strong>Final Answer:</strong> Rounded to exactly two decimal places for money, the monthly payment is £587.71</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "measurement-geometry",
    title: "Measurement & Geometry",
    topics: [
      {
        id: "reading-scales-tolerance",
        title: "Reading Scales & Tolerance",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When reading a scale, you must always count the gaps between the numbers, not the physical lines. When dealing with tolerance, always calculate and write down your explicit maximum and minimum limits before attempting to make any decisions.</p>

            <h4 className="text-white font-semibold">1. Reading Minor Unnumbered Divisions</h4>
            <p>You will frequently be asked to read from dials, thermometers, or measuring jugs that have unnumbered markings.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Find the difference between two printed numbers on the scale.</li>
              <li><strong>Step 2:</strong> Count the number of gaps (minor divisions) between those two numbers.</li>
              <li><strong>Step 3:</strong> Divide the difference by the number of gaps to find what exactly one minor division is worth.</li>
            </ul>
            <p>Note: If a dial has two different scales (e.g., mph on the outside and km/h on the inside), ensure you are reading the correct one.</p>

            <h4 className="text-white font-semibold">2. Calculating Tolerance Limits</h4>
            <p>Tolerance is the amount by which a measurement is allowed to vary while still being acceptable. It is written using the plus-minus symbol (±).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Maximum Limit:</strong> Add the tolerance to the target value.</li>
              <li><strong>Minimum Limit:</strong> Subtract the tolerance from the target value.</li>
            </ul>
            <p><strong>Percentage Tolerance:</strong> If the tolerance is given as a percentage (e.g., 400g ± 3%), you must calculate that percentage of the target weight first, and then add/subtract it to find your limits.</p>

            <h4 className="text-white font-semibold">3. Decision Making & Compatibility</h4>
            <p>Once you have your upper and lower limits, you will often need to evaluate a list of items to see if they are accepted or rejected.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>An item is only accepted if its measurement falls strictly between or exactly on your calculated limits.</li>
              <li><strong>Implications for compatibility:</strong> You may be asked to consider if a manufactured part will fit safely into another component based on their respective tolerance limits.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Counting the Lines" Trap:</strong> When finding what a scale goes up in, candidates frequently count the physical dashes on the page instead of the "jumps" (gaps) between them, resulting in the wrong scale.</li>
                <li><strong>The "Percentage of the Sample" Trap:</strong> In percentage tolerance questions, candidates occasionally calculate the percentage based on the measured sample weight rather than the target weight. Always calculate the percentage of the main target number.</li>
                <li><strong>The "Fraction Rejected vs Accepted" Trap:</strong> A question may give you a list of 10 items and ask you for the fraction of items that were rejected. Candidates often work out the limits perfectly but accidentally write down the fraction of items that were accepted. Always read the final sentence twice.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "scales-tolerance-ex1",
            question: (
              <div className="space-y-2">
                <p>A mechanic is inflating the tyres on a van. The manufacturer states the tyres must be inflated to a pressure of 45 psi ± 8%. The mechanic checks the pressure using a dial gauge. The dial has major markings every 10 psi, with 5 gaps between each major marking. The needle is pointing exactly 2 marks below the 50 psi line. Determine if the tyre pressure is within the safe tolerance limits. Use your working to justify your answer. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Work out the scale on the dial.</p>
                <BlockMath math="\text{Difference } = 10, \quad \text{Gaps } = 5" />
                <BlockMath math="10 \div 5 = 2 \text{ psi per gap}" />
                <p><strong>Step 2:</strong> Read the gauge. The needle is 2 marks (4 psi) below 50.</p>
                <BlockMath math="50 - 4 = 46 \text{ psi (This is the current tyre pressure).}" />
                <p><strong>Step 3:</strong> Calculate the exact tolerance amount.</p>
                <BlockMath math="8\% \text{ of } 45 \rightarrow 45 \div 100 \times 8 = 3.6 \text{ psi}" />
                <p><strong>Step 4:</strong> Calculate the maximum and minimum safe limits.</p>
                <BlockMath math="\text{Maximum: } 45 + 3.6 = 48.6 \text{ psi}" />
                <BlockMath math="\text{Minimum: } 45 - 3.6 = 41.4 \text{ psi}" />
                <p><strong>Step 5:</strong> Make a decision comparing the reading to the limits.</p>
                <p>Yes, the pressure is safe because 46 psi is between 41.4 psi and 48.6 psi.</p>
              </div>
            )
          },
          {
            id: "scales-tolerance-ex2",
            question: (
              <div className="space-y-2">
                <p>A bakery produces premium loaves of bread. The loaves are accepted for sale if they weigh 800g ± 2.5%. The weights, in grams, of a sample of 12 loaves are shown below:</p>
                <p className="text-center font-mono">778, 815, 821, 785, 790, 805, 770, 819, 801, 782, 825, 795</p>
                <p>Calculate the fraction of loaves that will be rejected. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the tolerance amount.</p>
                <BlockMath math="2.5\% \text{ of } 800 \rightarrow 800 \div 100 \times 2.5 = 20\text{g}" />
                <p><strong>Step 2:</strong> Calculate the upper and lower acceptable limits.</p>
                <BlockMath math="\text{Maximum: } 800 + 20 = 820\text{g}" />
                <BlockMath math="\text{Minimum: } 800 - 20 = 780\text{g}" />
                <p><strong>Step 3:</strong> Identify which loaves fall outside these limits (less than 780g or more than 820g).</p>
                <p>Rejected loaves: 778, 821, 770, 825 (4 loaves).</p>
                <p><strong>Step 4:</strong> Write as a fraction of the total sample.</p>
                <BlockMath math="\frac{4}{12} = \frac{1}{3}" />
              </div>
            )
          },
          {
            id: "scales-tolerance-ex3",
            question: (
              <div className="space-y-2">
                <p>An engineering company manufactures a steel pin and a matching circular slot.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The steel pin is manufactured to a diameter of 12.5mm ± 0.15mm.</li>
                  <li>The circular slot is manufactured to a diameter of 12.6mm ± 0.1mm.</li>
                </ul>
                <p>For the components to be compatible, the maximum diameter of the pin must be strictly less than the minimum diameter of the circular slot. Determine if these components are compatible. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the maximum diameter of the pin.</p>
                <BlockMath math="12.5 + 0.15 = 12.65\text{mm}" />
                <p><strong>Step 2:</strong> Calculate the minimum diameter of the circular slot.</p>
                <BlockMath math="12.6 - 0.1 = 12.50\text{mm}" />
                <p><strong>Step 3:</strong> Compare the two values against the compatibility rule.</p>
                <p>No, they are not compatible because the maximum pin diameter (12.65mm) is greater than the minimum slot diameter (12.50mm), meaning the pin might not fit.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "using-formulae",
        title: "Using Formulae",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The most critical step when using any formula is checking the units before you substitute your numbers. The SQA will frequently give you a measurement in centimetres when the formula explicitly requires metres. If you plug the raw numbers in without converting first, you will lose the majority of the marks.</p>

            <h4 className="text-white font-semibold">1. Given Formulae</h4>
            <p>In the exam, you will often be asked to calculate a quantity based on two related pieces of information. For these questions, the SQA will provide the specific formula in the text of the question (e.g., calculating Density or Body Mass Index). You do not need to memorise these specific scientific formulae; you simply need to substitute the correct numbers into them.</p>

            <h4 className="text-white font-semibold">2. Formula Triangles & Rearranging</h4>
            <p>Many of the formulae you will be given involve three variables (e.g., <InlineMath math="\text{Density} = \frac{\text{Volume}}{\text{Mass}}" />).</p>
            <p>You can use a "formula triangle" to help you rearrange the equation.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Put the isolated variable (e.g., Mass) at the top of the triangle, and the other two (Density and Volume) at the bottom.</li>
              <li>Cover up the value you are trying to find: if the remaining two are next to each other, you multiply. If one is above the other, you divide.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Unit Consistency</h4>
            <p>You must ensure the units of the numbers you are substituting match the units required by the formula. For example, if a formula calculates density in grams per cubic centimetre (g/cm³), your mass must be in grams and your volume must be in cubic centimetres before you calculate.</p>

            <h4 className="text-white font-semibold">4. BODMAS in Formulae</h4>
            <p>When using formulae like <InlineMath math="\text{BMI} = \frac{\text{Mass}}{\text{Height}^2}" />, you must remember your order of operations. The height must be squared before you divide the mass by it.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Unit Mismatch" Trap:</strong> This is the SQA's favourite trick in formula questions. For example, giving a patient's height in centimetres (e.g., 182 cm) but asking you to use a BMI formula that requires the height to be in metres. You must convert 182 cm to 1.82 m before substituting it in.</li>
                <li><strong>The "Wrong Subject" Trap:</strong> A question gives you the Density and the Mass, but asks you to calculate the Volume. Candidates often just divide the first number by the second number blindly. Use your formula triangle to ensure you are doing the correct operation!</li>
                <li><strong>The "Forgotten Square" Trap:</strong> In formulae with indices (like <InlineMath math="\text{Height}^2" />), candidates frequently forget to actually square the number on their calculator, dividing only by the base height.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "formulae-ex1",
            question: (
              <div className="space-y-2">
                <p>A medical clinic uses the following formula to calculate Body Mass Index (BMI):</p>
                <BlockMath math="\text{BMI} = \frac{\text{Mass}}{\text{Height}^2}" />
                <p>(where Mass is in kilograms and Height is in metres).</p>
                <p>A patient’s mass is 84 kilograms and their height is 165 centimetres. Calculate the BMI of the patient. Give your answer to 1 decimal place. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Check the units. The mass is in kg (correct), but the height is in cm. Convert the height to metres.</p>
                <BlockMath math="165 \text{ cm} \div 100 = 1.65 \text{ m}" />
                <p><strong>Step 2:</strong> Substitute the values into the formula and apply BODMAS (square the height first).</p>
                <BlockMath math="\text{Height}^2 = 1.65^2 = 2.7225" />
                <p><strong>Step 3:</strong> Divide the mass by the squared height.</p>
                <BlockMath math="84 \div 2.7225 = 30.85399..." />
                <p><strong>Step 4:</strong> Round to 1 decimal place.</p>
                <BlockMath math="\text{BMI} = 30.9" />
              </div>
            )
          },
          {
            id: "formulae-ex2",
            question: (
              <div className="space-y-2">
                <p>The density of an object can be calculated using the formula below.</p>
                <BlockMath math="\text{Density} = \frac{\text{Mass}}{\text{Volume}}" />
                <p>A solid metal rectangular block has dimensions 5 cm by 4 cm by 12 cm. The mass of the block is 1.68 kilograms. Calculate the density of the metal block. Give your answer in grams per cubic centimetre. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the volume of the block.</p>
                <BlockMath math="V = 5 \times 4 \times 12 = 240 \text{ cm}^3" />
                <p><strong>Step 2:</strong> Check the required units for the final answer. It requires grams, but the mass given is in kilograms. Convert the mass.</p>
                <BlockMath math="1.68 \text{ kg} \times 1000 = 1680 \text{ grams}" />
                <p><strong>Step 3:</strong> Substitute the compatible values into the formula.</p>
                <BlockMath math="\text{Density} = \frac{1680}{240}" />
                <p><strong>Final Answer:</strong></p>
                <BlockMath math="\text{Density} = 7 \text{ g/cm}^3" />
              </div>
            )
          },
          {
            id: "formulae-ex3",
            question: (
              <div className="space-y-2">
                <p>The pressure exerted by an object on the ground can be calculated using the formula:</p>
                <BlockMath math="\text{Pressure} = \frac{\text{Force}}{\text{Area}}" />
                <p>A heavy crate exerts a pressure of 45 N/m² over a ground area of 3.2 m². Calculate the total force applied by the crate. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Rearrange the formula to make Force the subject. Using a formula triangle, because Pressure and Area are on the bottom, we multiply them to find the Force on top.</p>
                <BlockMath math="\text{Force} = \text{Pressure} \times \text{Area}" />
                <p><strong>Step 2:</strong> Substitute the values (the units already match).</p>
                <BlockMath math="\text{Force} = 45 \times 3.2" />
                <p><strong>Final Answer:</strong></p>
                <BlockMath math="\text{Force} = 144 \text{ N}" />
              </div>
            )
          }
        ]
      },
      {
        id: "speed-distance-time",
        title: "Speed, Distance & Time",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The most common mistake candidates make in this entire course is misinterpreting decimal time. You must remember that there are 60 minutes in an hour, not 100. Therefore, a time of 4.3 hours is not 4 hours and 3 minutes.</p>

            <h4 className="text-white font-semibold">1. The Formula Triangle</h4>
            <p>You must know how to calculate Speed, Distance, and Time using the formula triangle:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Distance = Speed × Time</li>
              <li>Speed = Distance ÷ Time</li>
              <li>Time = Distance ÷ Speed</li>
            </ul>

            <h4 className="text-white font-semibold">2. Decimal Time Conversions</h4>
            <p>You cannot multiply or divide using a time like "2 hours 15 minutes" on a calculator. You must convert it into a decimal first.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Minutes to Decimal:</strong> Divide the minutes by 60. (Example: 15 mins ÷ 60 = 0.25, so 2 hours 15 mins is 2.25 hours).</li>
              <li><strong>Decimal to Minutes:</strong> Multiply the decimal part by 60. (Example: for 4.3 hours, calculate 0.3 × 60 = 18 mins, so the time is 4 hours 18 mins).</li>
            </ul>

            <h4 className="text-white font-semibold">3. Multi-stage Journeys & Timetables</h4>
            <p>Exam questions frequently involve journeys with stops or breaks. You must add the driving time to the break time to find the total journey time before working backwards or forwards to find departure or arrival times.</p>

            <h4 className="text-white font-semibold">4. Unit Consistency</h4>
            <p>Make sure your units match perfectly. If a question asks for a speed in kilometres per hour (km/h) but gives you the distance in miles, you must use a conversion factor (e.g., 1 mile = 1.609 km) to convert the distance before calculating the speed.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Decimal Time" Trap:</strong> Candidates frequently lose marks by writing 3 ½ hours as 3.30 hours in their calculator. It must be written as 3.5 hours.</li>
                <li><strong>The "Hidden Stop" Trap:</strong> A question will describe a journey and provide the speed and distance, but embed a phrase like "she stopped for 50 minutes for breakfast" in the text. Candidates eagerly calculate the drive time but forget to include the break when calculating the final arrival/departure time.</li>
                <li><strong>The "Wrong Units" Trap:</strong> The SQA will often give the time in minutes (e.g., 45 minutes) but ask for the speed in miles per hour. Candidates divide the distance by 45 rather than converting the time to 0.75 hours first.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "sdt-ex1",
            question: (
              <div className="space-y-2">
                <p>David travels to a conference 148 miles away at an average speed of 40 mph. He arrives at 11:10 am. During his journey, he stopped for 45 minutes for breakfast. Determine the time David left home. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the driving time using <InlineMath math="T = D \div S" />.</p>
                <BlockMath math="148 \div 40 = 3.7 \text{ hours}" />
                <p><strong>Step 2:</strong> Convert the decimal time into hours and minutes.</p>
                <BlockMath math="0.7 \times 60 = 42 \text{ minutes}" />
                <p>The drive time is 3 hours 42 minutes.</p>
                <p><strong>Step 3:</strong> Add the break to find the total journey time.</p>
                <p>3 hours 42 minutes + 45 minutes = 4 hours 27 minutes.</p>
                <p><strong>Step 4:</strong> Subtract the total journey time from the arrival time (11:10 am).</p>
                <p>11:10 am - 4 hours = 07:10 am.</p>
                <p>07:10 am - 27 minutes = 06:43 am.</p>
                <p><strong>Final Answer:</strong> David left home at 06:43 am.</p>
              </div>
            )
          },
          {
            id: "sdt-ex2",
            question: (
              <div className="space-y-2">
                <p>Sarah cycles 8.5 miles in exactly 48 minutes. Calculate Sarah's average speed. Give your answer in kilometres per hour. (1 mile = 1.609 km) (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Convert the distance from miles into kilometres.</p>
                <BlockMath math="8.5 \times 1.609 = 13.6765 \text{ km}" />
                <p><strong>Step 2:</strong> Convert the time from minutes into hours (divide by 60).</p>
                <BlockMath math="48 \div 60 = 0.8 \text{ hours}" />
                <p><strong>Step 3:</strong> Calculate the speed using <InlineMath math="S = D \div T" />.</p>
                <BlockMath math="13.6765 \div 0.8 = 17.095625" />
                <p><strong>Final Answer:</strong> Sarah's average speed is 17.10 km/h (rounded to 2 d.p.).</p>
              </div>
            )
          },
          {
            id: "sdt-ex3",
            question: (
              <div className="space-y-2">
                <p>A train travels at an average speed of 84 mph for 2 hours and 24 minutes. Calculate the distance travelled by the train. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Convert the time into a decimal.</p>
                <BlockMath math="24 \div 60 = 0.4" />
                <p>The total time is 2.4 hours.</p>
                <p><strong>Step 2:</strong> Calculate the distance using <InlineMath math="D = S \times T" />.</p>
                <BlockMath math="84 \times 2.4 = 201.6" />
                <p><strong>Final Answer:</strong> The train travelled 201.6 miles.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "perimeter-circumference-area",
        title: "Perimeter, Circumference & Area",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When calculating the perimeter of a shape that includes a fraction of a circle (like a semi-circle), candidates constantly calculate the curved arc length and stop. To find the true perimeter, you must always add the straight, flat edges back onto your curved answer.</p>

            <h4 className="text-white font-semibold">1. Basic Area Formulae</h4>
            <p>You must confidently calculate the area of basic 2D shapes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Rectangle:</strong> Area = Length × Breadth</li>
              <li><strong>Triangle:</strong> Area = <InlineMath math="\frac{1}{2} \times \text{Base} \times \text{Height}" />. Ensure you use the strict perpendicular (vertical) height, not the slanted sides.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Circles (Circumference & Area)</h4>
            <p>You must know the difference between the radius (middle to edge) and diameter (edge to edge, through the middle).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Circumference (Curved Length):</strong> <InlineMath math="C = \pi d" />.</li>
              <li><strong>Area:</strong> <InlineMath math="A = \pi r^2" />.</li>
            </ul>
            <p><strong>Non-Calculator Rule:</strong> In Paper 1, you must manually use <InlineMath math="\pi = 3.14" />.</p>

            <h4 className="text-white font-semibold">3. Fractions of a Circle</h4>
            <p>At National 5 level, you are frequently asked to find the area or curved length of a fraction of a circle (e.g., a semi-circle or a quarter-circle).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Simply write out the full circle formula, and divide it by the fraction required (e.g., for a semi-circle, calculate <InlineMath math="\pi d" /> and divide by 2).</li>
            </ul>

            <h4 className="text-white font-semibold">4. Composite Shapes (Adding and Subtracting)</h4>
            <p>Composite shapes are made by joining standard shapes together.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Adding Area:</strong> If a shape is made of a triangle sitting on top of a rectangle, calculate both areas separately and add them together.</li>
              <li><strong>Subtracting Area:</strong> If a patio surrounds a circular flower bed, you calculate the area of the whole patio space, and subtract the area of the circular flower bed from it.</li>
              <li><strong>Perimeter:</strong> Trace your finger around the outside of the shape. Add the curved arc lengths and any straight outer edges together.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Forgotten Straight Edges" Trap:</strong> When finding the perimeter of a semi-circle, candidates often calculate the curve (<InlineMath math="\frac{1}{2}\pi d" />) and declare that the final answer, completely forgetting to add the straight diameter line closing the shape at the bottom.</li>
                <li><strong>The "Internal Line" Trap:</strong> When finding the perimeter of two joined shapes (like a rectangle and a semi-circle), candidates often add up every single number on the diagram. You must ignore the internal lines where the shapes join; perimeter is strictly the outside border.</li>
                <li><strong>The "Radius vs Diameter" Mix-Up:</strong> Candidates frequently substitute the diameter into the Area formula (<InlineMath math="A = \pi r^2" />), or the radius into the Circumference formula (<InlineMath math="C = \pi d" />). Always halve the diameter to find the radius before calculating Area.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "pca-ex1",
            question: (
              <div className="space-y-2">
                <p>Zainab designs a new badge. The design is based on a rectangle and a semi-circle as shown in the diagram.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The rectangle is 10 cm wide and 20 cm long.</li>
                  <li>The semi-circle is attached to one of the 10 cm sides.</li>
                </ul>
                <p>She decides to put gold edging around the entire outside border of the badge. Calculate the length of gold edging she needs. (Take <InlineMath math="\pi = 3.14" />) (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the curved edge of the semi-circle. The diameter is 10 cm.</p>
                <BlockMath math="C = \pi d \div 2" />
                <BlockMath math="3.14 \times 10 \div 2 = 31.4 \div 2 = 15.7 \text{ cm}" />
                <p><strong>Step 2:</strong> Identify the straight outside edges. The semi-circle covers one of the 10 cm sides (meaning it is an internal line and must be ignored). The remaining outside straight edges are 20 cm, 10 cm, and 20 cm.</p>
                <BlockMath math="20 + 10 + 20 = 50 \text{ cm}" />
                <p><strong>Step 3:</strong> Add the curved and straight edges together to find the full perimeter.</p>
                <BlockMath math="50 + 15.7 = 65.7 \text{ cm}" />
                <p><strong>Final Answer:</strong> She needs 65.7 cm of gold edging.</p>
              </div>
            )
          },
          {
            id: "pca-ex2",
            question: (
              <div className="space-y-2">
                <p>A flag is in the shape of an isosceles triangle with a rectangle on the top.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The rectangle is 10 cm wide and 4 cm high.</li>
                  <li>The total height of the flag (from the bottom tip of the triangle to the top of the rectangle) is 13 cm.</li>
                </ul>
                <p>Calculate the area of the flag. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the area of the top rectangle.</p>
                <BlockMath math="A = L \times B \rightarrow 10 \times 4 = 40 \text{ cm}^2" />
                <p><strong>Step 2:</strong> Find the dimensions of the triangle. The base is 10 cm (matching the rectangle). The perpendicular height of the triangle is the total height minus the rectangle's height (<InlineMath math="13 - 4 = 9 \text{ cm}" />).</p>
                <p><strong>Step 3:</strong> Calculate the area of the triangle.</p>
                <BlockMath math="A = \frac{1}{2} \times b \times h \rightarrow 0.5 \times 10 \times 9 = 45 \text{ cm}^2" />
                <p><strong>Step 4:</strong> Add the two areas together.</p>
                <BlockMath math="40 + 45 = 85 \text{ cm}^2" />
              </div>
            )
          },
          {
            id: "pca-ex3",
            question: (
              <div className="space-y-2">
                <p>The reception area in a hotel features a large mirror. The mirror is in the shape of a square with identical semi-circles on each side.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The square has sides of length 1.2 metres.</li>
                  <li>The semi-circles have a diameter of 0.7 metres.</li>
                </ul>
                <p>Calculate the area of the mirror. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the area of the square.</p>
                <BlockMath math="A = L \times B \rightarrow 1.2 \times 1.2 = 1.44 \text{ m}^2" />
                <p><strong>Step 2:</strong> Recognise that 4 identical semi-circles make exactly 2 full circles. Find the radius of these circles (half the diameter).</p>
                <BlockMath math="0.7 \div 2 = 0.35 \text{ m}" />
                <p><strong>Step 3:</strong> Calculate the area of the 2 full circles.</p>
                <BlockMath math="A = 2 \times \pi \times r^2 \rightarrow 2 \times \pi \times 0.35^2" />
                <BlockMath math="A = 0.76969... \text{ m}^2" />
                <p><strong>Step 4:</strong> Add the areas together for the total.</p>
                <BlockMath math="1.44 + 0.76969... = 2.20969..." />
                <p><strong>Final Answer:</strong> The area of the mirror is 2.21 m² (rounded to 2 d.p.).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "volume-of-solids",
        title: "Volume of Solids",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> If a volume question asks you to round your final answer to a specific number of significant figures, you must write down your unrounded answer from your calculator display first. Failing to show the unrounded calculation will cost you vital process marks, even if the rounded answer is correct.</p>

            <h4 className="text-white font-semibold">1. Using Given Formulae</h4>
            <p>You do not need to memorise complex volume formulae, as the SQA provides them on the exam paper. You simply need to substitute the correct values into the given equations:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Prism:</strong> <InlineMath math="V = Ah" /> (Area of the base shape × height).</li>
              <li><strong>Cylinder:</strong> <InlineMath math="V = \pi r^2 h" />.</li>
              <li><strong>Sphere:</strong> <InlineMath math="V = \frac{4}{3} \pi r^3" />.</li>
              <li><strong>Cone:</strong> <InlineMath math="V = \frac{1}{3} \pi r^2 h" />.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Hemispheres</h4>
            <p>To calculate the volume of a hemisphere (half a sphere), simply use the sphere formula provided on the formula sheet and divide your final answer by 2.</p>

            <h4 className="text-white font-semibold">3. Composite Solids</h4>
            <p>Composite solids are made from two or more standard shapes joined together.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Identify the basic 3D shapes that make up the solid.</li>
              <li>Calculate the volume of each part separately.</li>
              <li>Add the volumes together for the total.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Converting to Litres</h4>
            <p>Volume is often calculated in cubic centimetres (<InlineMath math="\text{cm}^3" />), but questions frequently ask for the final answer in litres.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>1 litre = 1000 <InlineMath math="\text{cm}^3" />.</li>
              <li>To convert <InlineMath math="\text{cm}^3" /> into litres, divide your answer by 1000.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Radius vs Diameter" Mix-Up:</strong> Candidates frequently substitute the full width (diameter) of a circular base directly into the formula. You must always halve the diameter to find the radius (r) before calculating the volume of a cylinder, cone, or sphere.</li>
                <li><strong>The "Hidden Height" Trap:</strong> In composite solids (like a cone sitting on top of a hemisphere), the SQA will often give you the total height of the object rather than the specific height of the cone. You must subtract the radius of the hemisphere from the total height to find the true height of the cone before using the formula.</li>
                <li><strong>The "Premature Rounding" Trap:</strong> When working out the volume of two separate shapes to add together, candidates sometimes round the volume of the first shape before calculating the second. Keep the exact values in your calculator until the very final step to avoid rounding errors.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "vol-ex1",
            question: (
              <div className="space-y-2">
                <p>A child’s toy is in the shape of a hemisphere with a cone on top, as shown in the diagram.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The toy is 10 centimetres wide (diameter).</li>
                  <li>The total height of the toy is 16 centimetres.</li>
                </ul>
                <p>Calculate the volume of the toy. Give your answer correct to 2 significant figures. (5 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the radius of the toy by halving the diameter.</p>
                <BlockMath math="10 \div 2 = 5 \text{ cm radius}" />
                <p><strong>Step 2:</strong> Find the true height of the cone. The 16 cm total is made of the cone's height plus the hemisphere's radius (5 cm).</p>
                <BlockMath math="16 - 5 = 11 \text{ cm cone height}" />
                <p><strong>Step 3:</strong> Calculate the volume of the cone using <InlineMath math="V = \frac{1}{3}\pi r^2 h" />.</p>
                <BlockMath math="V = \frac{1}{3} \times \pi \times 5^2 \times 11 = 287.979... \text{ cm}^3" />
                <p><strong>Step 4:</strong> Calculate the volume of the hemisphere using <InlineMath math="V = \frac{4}{3}\pi r^3 \div 2" />.</p>
                <BlockMath math="V = \frac{4}{3} \times \pi \times 5^3 \div 2 = 261.799... \text{ cm}^3" />
                <p><strong>Step 5:</strong> Add the volumes together and write down the unrounded answer first.</p>
                <BlockMath math="287.979... + 261.799... = 549.778... \text{ cm}^3" />
                <p><strong>Step 6:</strong> Round to exactly 2 significant figures.</p>
                <BlockMath math="V = 550 \text{ cm}^3" />
              </div>
            )
          },
          {
            id: "vol-ex2",
            question: (
              <div className="space-y-2">
                <p>A bottle consists of a cuboid and a cylinder.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The cuboid base has dimensions 8 cm by 4.5 cm by 10 cm height.</li>
                  <li>The cylindrical neck has a diameter of 3 cm and a height of 4 cm.</li>
                </ul>
                <p>Calculate the total volume of the bottle. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the volume of the cuboid (<InlineMath math="V = L \times B \times H" />).</p>
                <BlockMath math="8 \times 4.5 \times 10 = 360 \text{ cm}^3" />
                <p><strong>Step 2:</strong> Find the radius of the cylinder (halve the diameter).</p>
                <BlockMath math="3 \div 2 = 1.5 \text{ cm}" />
                <p><strong>Step 3:</strong> Calculate the volume of the cylinder using <InlineMath math="V = \pi r^2 h" />.</p>
                <BlockMath math="V = \pi \times 1.5^2 \times 4 = 28.274... \text{ cm}^3" />
                <p><strong>Step 4:</strong> Add the two volumes together.</p>
                <BlockMath math="360 + 28.274... = 388.274..." />
                <p><strong>Final Answer:</strong> The volume of the bottle is 388.27 cm³ (rounded to 2 d.p.).</p>
              </div>
            )
          },
          {
            id: "vol-ex3",
            question: (
              <div className="space-y-2">
                <p>Dougie is organising a party and will serve juice in cylindrical cups.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The cups have a radius of 3.5 cm and a total height of 11 cm.</li>
                  <li>Each cup will be filled with juice to exactly 2 cm from the top.</li>
                </ul>
                <p>Calculate the volume of juice in one cup. Give your answer in litres. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Determine the actual height of the liquid in the cup.</p>
                <BlockMath math="11 \text{ cm} - 2 \text{ cm} = 9 \text{ cm}" />
                <p><strong>Step 2:</strong> Calculate the volume of the juice using the cylinder formula.</p>
                <BlockMath math="V = \pi \times 3.5^2 \times 9 = 346.360... \text{ cm}^3" />
                <p><strong>Step 3:</strong> Convert the cubic centimetres into litres by dividing by 1000.</p>
                <BlockMath math="346.360 \div 1000 = 0.34636... \text{ litres}" />
                <p><strong>Final Answer:</strong> There are 0.346 litres of juice in each cup.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "pythagoras-theorem",
        title: "Pythagoras' Theorem",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> In National 5 Applications of Mathematics, Pythagoras questions are strictly designed to be two-stage calculations. If you calculate a single missing side using <InlineMath math="a^2 = b^2 + c^2" /> and stop, you have only completed half the problem. You must always use your new measurement to complete a second step, such as finding a second missing side, calculating a total perimeter, or finding the depth of a liquid.</p>

            <h4 className="text-white font-semibold">1. The Standard Formulae</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Finding the hypotenuse (the longest side):</strong> Square the two shorter sides and add them together, then find the square root (<InlineMath math="c^2 = a^2 + b^2" />).</li>
              <li><strong>Finding a shorter side:</strong> Square the hypotenuse and the other shorter side and subtract the smaller from the larger, then find the square root (<InlineMath math="a^2 = c^2 - b^2" />).</li>
            </ul>

            <h4 className="text-white font-semibold">2. Two-Stage Triangles</h4>
            <p>You will frequently be presented with two right-angled triangles joined together. You must use Pythagoras in the first triangle to find the length of the shared "hidden" side. You then use that newly calculated length as a dimension in the second triangle to find the final missing side.</p>

            <h4 className="text-white font-semibold">3. Pythagoras in a Circle (Chords & Depths)</h4>
            <p>This is a classic SQA context. You will be given a circular cross-section (like an oil tank or a pipe) and asked to find the depth of a liquid or the width of a table.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Draw a straight vertical line down from the centre of the circle to the chord (the liquid surface), creating a right-angled triangle.</li>
              <li><strong>Step 2:</strong> Halve the length of the chord to find the base of your triangle.</li>
              <li><strong>Step 3:</strong> Use the circle's radius as the hypotenuse of your triangle.</li>
              <li><strong>Step 4:</strong> Calculate the missing vertical height. Finally, add or subtract this height from the full radius to find the final depth.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Significant Figures & Unrounded Answers</h4>
            <p>Pythagoras questions almost always feature an instruction to round your final answer to a specific number of significant figures. You must write down the full, unrounded decimal from your calculator display before you write your rounded answer.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Wrong Dimensions" Trap:</strong> The 2024 SQA Course Report explicitly noted that while most candidates knew to use Pythagoras, many lost marks because they did not identify the correct dimensions from the diagram. When a boat sails from A to B, you must add the distances together to find the full length of the new triangle's base before calculating the hypotenuse.</li>
                <li><strong>The "Premature Rounding" Trap:</strong> When finding a shared side between two triangles, do not round the length of the shared side to 1 or 2 decimal places. Keep the exact square root in your calculator for the second stage to prevent compounding rounding errors.</li>
                <li><strong>The "Forgotten Final Step" Trap:</strong> In circle questions, candidates frequently calculate the height of the right-angled triangle and underline it as their final answer, forgetting that the question asked for the total depth of the water, which requires adding or subtracting that height from the radius.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "pythagoras-ex1",
            question: (
              <div className="space-y-2">
                <p>A boat sails due East from a harbour. A lighthouse is 400 metres due North of the harbour. When the boat is at position A, it is exactly 500 metres away from the lighthouse. The boat then sails a further 450 metres East to position B.</p>
                <p>Calculate the direct distance from position B to the lighthouse. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Focus on the first right-angled triangle (Harbour, Lighthouse, Position A). The hypotenuse is 500m and the vertical side is 400m. Calculate the horizontal distance from the harbour to A (subtracting because we are finding a shorter side).</p>
                <BlockMath math="x^2 = 500^2 - 400^2 = 250,000 - 160,000 = 90,000" />
                <BlockMath math="x = \sqrt{90,000} = 300 \text{ metres}" />
                <p><strong>Step 2:</strong> Calculate the total horizontal base for the second triangle (Harbour to Position B). Avoid the trap: you must add the new distance to the distance you just found!</p>
                <BlockMath math="300\text{m} + 450\text{m} = 750 \text{ metres}" />
                <p><strong>Step 3:</strong> Focus on the large right-angled triangle (Harbour, Lighthouse, Position B). The vertical side is 400m and the horizontal base is 750m. Calculate the new hypotenuse (adding).</p>
                <BlockMath math="y^2 = 400^2 + 750^2 = 160,000 + 562,500 = 722,500" />
                <BlockMath math="y = \sqrt{722,500} = 850 \text{ metres}" />
                <p><strong>Final Answer:</strong> The direct distance from position B to the lighthouse is 850 metres.</p>
              </div>
            )
          },
          {
            id: "pythagoras-ex2",
            question: (
              <div className="space-y-2">
                <p>The diagram shows the circular cross-section of a drainage pipe.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The centre of the circle is O.</li>
                  <li>The surface of the water forms a chord AB measuring 1.6 metres.</li>
                  <li>The radius of the pipe is 1.0 metre.</li>
                </ul>
                <p>Calculate the maximum depth, d, of the water. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Create a right-angled triangle by drawing a line from O to the chord. Halve the chord to find the base of the triangle.</p>
                <BlockMath math="1.6 \div 2 = 0.8 \text{ metres}" />
                <p><strong>Step 2:</strong> The hypotenuse of this triangle is the radius of the pipe (1.0m). Calculate the missing vertical height, x, of the triangle.</p>
                <BlockMath math="x^2 = 1.0^2 - 0.8^2 = 1.0 - 0.64 = 0.36" />
                <BlockMath math="x = \sqrt{0.36} = 0.6 \text{ metres}" />
                <p><strong>Step 3:</strong> Calculate the final depth. The full radius from the centre to the bottom of the pipe is 1.0m. The water level is 0.6m below the centre.</p>
                <BlockMath math="d = 1.0 - 0.6 = 0.4 \text{ metres}" />
                <p><strong>Final Answer:</strong> The depth of the water is 0.4 metres.</p>
              </div>
            )
          },
          {
            id: "pythagoras-ex3",
            question: (
              <div className="space-y-2">
                <p>A park features a concrete patio and a grass lawn.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The patio is in the shape of a right-angled triangle with a base of 6m and a height of 8m.</li>
                  <li>The longest side of the patio forms the base of the grass lawn.</li>
                  <li>The grass lawn is also a right-angled triangle, with a vertical height of 24m.</li>
                </ul>
                <p>Calculate the length of the longest side of the grass lawn. Give your answer to 3 significant figures. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the hypotenuse of the patio triangle (which is the shared side).</p>
                <BlockMath math="h^2 = 6^2 + 8^2 = 36 + 64 = 100" />
                <BlockMath math="h = \sqrt{100} = 10 \text{ metres}" />
                <p><strong>Step 2:</strong> Use this 10m shared side as the base for the grass lawn triangle. Calculate the new hypotenuse.</p>
                <BlockMath math="L^2 = 10^2 + 24^2 = 100 + 576 = 676" />
                <BlockMath math="L = \sqrt{676} = 26 \text{ metres}" />
                <p><strong>Step 3:</strong> Write the unrounded answer, then round to 3 significant figures.</p>
                <BlockMath math="\text{Unrounded: } 26.000..." />
                <BlockMath math="\text{Rounded: } 26.0 \text{ metres}" />
                <p>(Adding the .0 explicitly demonstrates 3 significant figures).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "gradient",
        title: "Gradient",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The SQA's 2024 Course Report explicitly stated that the two most common ways candidates lose marks in gradient questions are by failing to ensure their dimensions are in consistent units, and failing to express their final gradient as a fraction in its simplest form. Always check your units before doing any calculation!</p>

            <h4 className="text-white font-semibold">1. The Gradient Formula</h4>
            <p>The gradient of a slope is a measure of its steepness. You must use the formula:</p>
            <BlockMath math="\text{Gradient} = \frac{\text{Vertical Height}}{\text{Horizontal Distance}}" />
            <p>This formula is provided on your formula sheet, so you do not need to memorise it, but you must know how to apply it correctly.</p>

            <h4 className="text-white font-semibold">2. Calculating the True Vertical Height</h4>
            <p>In real-life contexts (like hills or roads), the SQA will rarely give you the vertical height directly. Instead, they will give you the starting height above sea level and the ending height above sea level. You must subtract the starting height from the ending height to find the actual vertical height of the triangle before using the formula.</p>

            <h4 className="text-white font-semibold">3. Format of the Final Answer</h4>
            <p>You must read the bold text in the question carefully to see how the examiner wants the final answer presented:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Fractions:</strong> If asked for a fraction in its simplest form, you must use your Numeracy skills to divide the top and bottom by the highest common factor. A decimal answer will score zero marks for that step.</li>
              <li><strong>Percentages:</strong> To convert a decimal gradient into a percentage (e.g., a 20% slope), simply multiply your decimal answer by 100.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Comparing Gradients</h4>
            <p>When asked to determine which slope is steeper, calculate the gradient for both. The slope with the larger numerical value is the steeper slope.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Unit Mismatch" Trap:</strong> This is the most prevalent trap in the entire course. A question will give the vertical height in millimetres (e.g., 850 mm) and the horizontal base in centimetres (e.g., 165 cm). If you divide 850 by 165 without converting the units to match first, you will lose the majority of the marks.</li>
                <li><strong>The "Sloping Edge" Trap:</strong> The SQA will occasionally label the diagonal, slanted length of the slope on the diagram instead of the horizontal base. You must use Pythagoras' Theorem first to calculate the horizontal distance across the bottom before you can calculate the gradient.</li>
                <li><strong>The "Unsimplified Fraction" Trap:</strong> If the question states "Give your answer as a fraction in its simplest form", you will lose the final communication mark if you leave your answer as <InlineMath math="\frac{85}{165}" /> rather than simplifying it down to <InlineMath math="\frac{17}{33}" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "gradient-ex1",
            question: (
              <div className="space-y-2">
                <p>Stephen has built a new ramp. The horizontal distance of the ramp is 165 cm and the vertical height is 850 mm.</p>
                <p>Calculate the gradient of the ramp. Give your answer as a fraction in its simplest form. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Ensure units match. Convert the height from millimetres into centimetres (divide by 10).</p>
                <BlockMath math="850 \text{ mm} \div 10 = 85 \text{ cm}" />
                <p><strong>Step 2:</strong> Substitute into the gradient formula.</p>
                <BlockMath math="\text{Gradient} = \frac{\text{Vertical Height}}{\text{Horizontal Distance}} = \frac{85}{165}" />
                <p><strong>Step 3:</strong> Simplify the fraction. Both numbers end in 5, so divide the top and bottom by 5.</p>
                <BlockMath math="85 \div 5 = 17" />
                <BlockMath math="165 \div 5 = 33" />
                <p><strong>Final Answer:</strong> The gradient is <InlineMath math="\frac{17}{33}" />.</p>
              </div>
            )
          },
          {
            id: "gradient-ex2",
            question: (
              <div className="space-y-2">
                <p>Tracy decides to walk to the top of Dumyat Hill from Blairlogie car park.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The horizontal distance between these two places is 3 kilometres.</li>
                  <li>Blairlogie car park is 21 metres above sea level.</li>
                  <li>The top of Dumyat Hill is 420 metres above sea level.</li>
                </ul>
                <p>Calculate the average gradient between the car park and the top of the hill. Give your answer as a fraction in its simplest form. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the true vertical height by subtracting the elevations.</p>
                <BlockMath math="420 - 21 = 399 \text{ metres}" />
                <p><strong>Step 2:</strong> Ensure units match. Convert the horizontal distance from kilometres into metres (multiply by 1000).</p>
                <BlockMath math="3 \times 1000 = 3000 \text{ metres}" />
                <p><strong>Step 3:</strong> Substitute into the formula.</p>
                <BlockMath math="\text{Gradient} = \frac{399}{3000}" />
                <p><strong>Step 4:</strong> Simplify the fraction (divide top and bottom by 3).</p>
                <p><strong>Final Answer:</strong> The gradient is <InlineMath math="\frac{133}{1000}" />.</p>
              </div>
            )
          },
          {
            id: "gradient-ex3",
            question: (
              <div className="space-y-2">
                <p>A design for a skatepark ramp has a vertical height of 70 cm and a horizontal base of 2.1 m.</p>
                <p>To be suitable, the ramp must have a gradient of <InlineMath math="0.35 \pm 0.01" />.</p>
                <p>Determine whether the ramp is suitable. Use your working to justify your answer. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Ensure units match. Convert the base from metres to centimetres.</p>
                <BlockMath math="2.1 \text{ m} \times 100 = 210 \text{ cm}" />
                <p><strong>Step 2:</strong> Calculate the gradient as a decimal.</p>
                <BlockMath math="\text{Gradient} = \frac{70}{210} = 0.333..." />
                <p><strong>Step 3:</strong> Calculate the tolerance limits.</p>
                <BlockMath math="\text{Maximum: } 0.35 + 0.01 = 0.36" />
                <BlockMath math="\text{Minimum: } 0.35 - 0.01 = 0.34" />
                <p><strong>Step 4:</strong> Make a concluding statement comparing the calculated gradient to the limits.</p>
                <p><strong>Final Answer:</strong> The ramp is not suitable, because the gradient (0.33) is less than the minimum allowed limit (0.34).</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "task-planning-logistics",
    title: "Task Planning & Logistics",
    topics: [
      {
        id: "time-management-zones",
        title: "Time Management & Time Zones",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When calculating flight arrival times across different time zones, always complete the entire journey using the departure country's time zone first, and only add or subtract the time difference at the very final step.</p>

            <h4 className="text-white font-semibold">1. Decimal Time Conversions</h4>
            <p>You must be completely comfortable converting decimal time to minutes and vice versa.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To convert a decimal to minutes, multiply the decimal part by 60.</li>
              <li>(For example, if a flight takes 2.7 hours, <InlineMath math="0.7 \times 60 = 42" />, so the time is 2 hours 42 minutes).</li>
            </ul>

            <h4 className="text-white font-semibold">2. Time Zones (GMT and UTC)</h4>
            <p>Countries operate in different time zones depending on their location. A country's time may be given in relation to the UK (e.g., 5 hours behind Edinburgh) or as GMT/UTC (e.g., UTC+2 means 2 hours ahead of the UK).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Ahead:</strong> Add the hours on.</li>
              <li><strong>Behind:</strong> Subtract the hours.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Planning Meetings and Overlaps</h4>
            <p>If you need to find a suitable time for a phone call between two different time zones, draw a timeline for both countries to find the overlapping hours where both people are awake and available.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Double Conversion" Trap:</strong> Candidates frequently try to change the time zone of the departure time, then add the flight time, then get confused about which time zone they are currently in. Always stick to the starting location's time for the whole journey, and apply the time zone shift right at the end.</li>
                <li><strong>The "AM/PM" Trap:</strong> The SQA will penalise you for omitting "am" or "pm" from 12-hour times. If you use a 24-hour clock (e.g., 14:15), you do not need am/pm, but 12-hour times must include it.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "time-zones-ex1",
            question: (
              <div className="space-y-2">
                <p>Emma chose to fly from Edinburgh to Alicante. Her plane took off at 11:30 local time.</p>
                <p>The time in Alicante is 1 hour ahead of the time in Edinburgh.</p>
                <p>The plane flew 1552.5 miles at an average speed of 575 miles per hour.</p>
                <p>Calculate the local time that the plane landed in Alicante. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the flight time using <InlineMath math="T = D \div S" />.</p>
                <BlockMath math="1552.5 \div 575 = 2.7 \text{ hours}" />
                <p><strong>Step 2:</strong> Convert 2.7 hours into hours and minutes.</p>
                <BlockMath math="0.7 \times 60 = 42 \text{ minutes}" />
                <p>The flight is 2 hours 42 minutes.</p>
                <p><strong>Step 3:</strong> Add the flight time to the departure time (staying in UK time!).</p>
                <BlockMath math="11:30 + \text{2 hours 42 minutes} = 14:12 \text{ (UK Time)}" />
                <p><strong>Step 4:</strong> Apply the time zone difference. Alicante is 1 hour ahead.</p>
                <BlockMath math="14:12 + \text{1 hour} = 15:12 \text{ (or 3:12 pm)}" />
              </div>
            )
          }
        ]
      },
      {
        id: "scale-drawing-navigation",
        title: "Scale Drawing & Navigation",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> Bearings must always be measured clockwise from North, and they must always be written using exactly three digits (e.g., 045°, not 45°). When plotting a multi-stage journey, you must draw a completely new, perfectly vertical North line at every single checkpoint before measuring your next angle.</p>

            <h4 className="text-white font-semibold">1. Using a Scale</h4>
            <p>A scale drawing is a proportional reduction of a real-life space.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Real-life to the Page:</strong> To find out how long a line should be on your page, convert the real-life distance to match the scale's units, then divide by the scale factor. (Example: For a scale of 1 cm:10 km, a 60 km flight is drawn as <InlineMath math="60 \div 10 = 6 \text{ cm}" />).</li>
              <li><strong>Page to Real-life:</strong> To find a real-life distance, measure the line on the page in centimetres and multiply by the scale factor.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Constructing the Diagram</h4>
            <p>You must use a ruler to draw lines accurately to the nearest millimetre (±2 mm tolerance) and a protractor to draw angles accurately to the nearest degree (<InlineMath math="\pm 2^\circ" /> tolerance).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Start at the given point.</li>
              <li>Align the centre of your protractor with the start point, ensuring the <InlineMath math="0^\circ" /> line points straight up along the North line.</li>
              <li>Measure the angle clockwise and mark it.</li>
              <li>Draw the scaled length through that mark using your ruler.</li>
            </ul>

            <h4 className="text-white font-semibold">3. The Return Journey</h4>
            <p>You will frequently be asked to find the bearing of the return journey (e.g., heading back to the start from the final location).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You must draw a new North line at your final location.</li>
              <li>Place your protractor on this new North line and measure clockwise all the way around until you hit the line that leads back to the start.</li>
              <li>(Tip: If the return line points towards the bottom-left, the bearing will be greater than <InlineMath math="180^\circ" />, so you may need to measure the angle past <InlineMath math="180^\circ" /> and add it on).</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Return Journey Bearing" Trap:</strong> The SQA's 2024 Course Report explicitly highlighted that for the return journey, "Most candidates did not measure the bearing of the return journey. Of those who did, few stated the angle as a three-figure bearing." You must ensure your final answer has three digits!</li>
                <li><strong>The "Incomplete Diagram" Trap:</strong> Both the 2024 and 2025 SQA Course Reports state that while many candidates successfully calculate the scaled lengths in centimetres, "Few candidates accurately constructed a diagram of the entire course." You must follow through and actually draw every single leg of the journey with a ruler and protractor to secure the marks.</li>
                <li><strong>The "Missing North Line" Trap:</strong> Candidates frequently try to measure the second bearing using the angle of the previous line they just drew. You must draw a completely new, straight-up North line at the end of leg 1 before measuring the angle for leg 2.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "navigation-ex1",
            question: (
              <div className="space-y-2">
                <p>The start of an orienteering course is being planned.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Competitors leave the start point and run on a bearing of <InlineMath math="335^\circ" /> for 400 metres to checkpoint A.</li>
                  <li>From checkpoint A they then run on a bearing of <InlineMath math="030^\circ" /> for 320 metres to checkpoint B.</li>
                </ul>
                <p>(a) Construct a scale drawing to illustrate this part of the course. Use a scale of 1 cm:100 m. (3 marks)</p>
                <p>(b) Use your scale drawing to determine the distance and bearing of the start point from checkpoint B. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the lengths to be drawn on the page by dividing the real-life distances by the scale factor (100).</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Leg 1: <InlineMath math="400 \text{ m} \div 100 = 4 \text{ cm}" />.</li>
                  <li>Leg 2: <InlineMath math="320 \text{ m} \div 100 = 3.2 \text{ cm}" />.</li>
                </ul>
                <p><strong>Step 2 (Drawing Leg 1):</strong> Place the protractor on the start point's North line. Because <InlineMath math="335^\circ" /> is reflex, measure <InlineMath math="25^\circ" /> anti-clockwise (since <InlineMath math="360 - 335 = 25" />). Draw a line exactly 4 cm long. Label the end "Checkpoint A".</p>
                <p><strong>Step 3 (Drawing Leg 2):</strong> Draw a new vertical North line at Checkpoint A. Measure <InlineMath math="30^\circ" /> clockwise from this new line. Draw a line exactly 3.2 cm long. Label the end "Checkpoint B".</p>
                <p><strong>Step 4 (Return Distance):</strong> Draw a straight dotted line from Checkpoint B back to the Start. Measure it with a ruler. (Let's assume it measures 5.4 cm). Multiply by the scale factor to find the real-life distance.</p>
                <BlockMath math="5.4 \text{ cm} \times 100 = 540 \text{ metres}" />
                <p><strong>Step 5 (Return Bearing):</strong> Draw a final North line at Checkpoint B. Measure the angle clockwise from North all the way around to the dotted return line. (Let's assume it points downwards/left, measuring <InlineMath math="201^\circ" />).</p>
                <p><strong>Final Answer (b):</strong> The distance is 540 m on a bearing of <InlineMath math="201^\circ" />.</p>
              </div>
            )
          },
          {
            id: "navigation-ex2",
            question: (
              <div className="space-y-2">
                <p>A surveyor produces a sketch of a radio mast in a field.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The horizontal distance from the surveyor to the base of the mast is 490 metres.</li>
                  <li>The angle of elevation from the ground to the top of the mast is <InlineMath math="20^\circ" />.</li>
                  <li>The mast and the ground form a right-angled triangle.</li>
                </ul>
                <p>Using a scale of 1 cm:20 m, make a scale drawing of the triangle and use it to find the real-life height of the radio mast. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the horizontal length for the drawing by dividing by the scale factor.</p>
                <BlockMath math="490 \text{ m} \div 20 = 24.5 \text{ cm}" />
                <p><strong>Step 2 (Drawing):</strong> Draw a horizontal line exactly 24.5 cm long with a ruler. At the right-hand end, use a protractor to draw a <InlineMath math="20^\circ" /> angle pointing upwards and leftwards.</p>
                <p><strong>Step 3 (Drawing):</strong> At the left-hand end, draw a perfect <InlineMath math="90^\circ" /> vertical line going straight up to represent the mast. Extend the <InlineMath math="20^\circ" /> slanted line until it crosses the vertical line to complete the triangle.</p>
                <p><strong>Step 4 (Calculate Height):</strong> Measure the vertical line you drew. (It should measure exactly 8.9 cm). Multiply this page length by the scale factor to find the real-life height.</p>
                <BlockMath math="8.9 \text{ cm} \times 20 = 178 \text{ metres}" />
                <p><strong>Final Answer:</strong> The real-life height of the radio mast is 178 metres.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "3d-container-packing",
        title: "3D Container Packing",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> Never calculate the total volume of the large container and divide it by the total volume of the small box. This assumes the items can be melted down like liquid! You must divide the Length by Length, Breadth by Breadth, and Height by Height.</p>

            <h4 className="text-white font-semibold">1. The Packing Strategy</h4>
            <p>To find how many small boxes fit into a large container, you must assign items systematically to minimise unused space.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Find how many boxes fit along the length, breadth, and height independently.</li>
              <li>Multiply these three numbers together to find the total for that orientation.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Orientations and Restrictions</h4>
            <p>If the question allows the boxes to be rotated, you must test at least two different arrangements (orientations) of the length and breadth to see which one fits more boxes inside. However, if a box has a "THIS WAY UP" symbol or must be placed with a "label facing upwards", the height of the small box is permanently locked and cannot be rotated.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "One Orientation Only" Trap:</strong> If there are no restrictions on how a box is packed, you must calculate multiple orientations. The SQA notes that many candidates lose marks by only attempting to find the number of boxes for a single orientation.</li>
                <li><strong>The "Unit Mismatch" Trap:</strong> The internal dimensions of a shipping crate are often given in metres (e.g., 4.10 m), while the small boxes are given in centimetres (e.g., 60 cm). You must convert the metres into centimetres before dividing.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "packing-ex1",
            question: (
              <div className="space-y-2">
                <p>Tabitha is a van driver. Orders are packed into boxes.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The van has internal dimensions: 410 cm (L) <InlineMath math="\times" /> 190 cm (B) <InlineMath math="\times" /> 220 cm (H).</li>
                  <li>The boxes have dimensions: 60 cm <InlineMath math="\times" /> 40 cm <InlineMath math="\times" /> 20 cm.</li>
                  <li>The boxes are marked "THIS WAY UP" on the 20 cm vertical side.</li>
                  <li>All boxes must be aligned in the same direction.</li>
                </ul>
                <p>Calculate the maximum number of boxes that will fit in the van. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Lock the height. Because of the "THIS WAY UP" rule, the 20 cm side must point upwards.</p>
                <BlockMath math="220 \text{ cm (Van H)} \div 20 \text{ cm (Box H)} = 11 \text{ layers high}" />
                <p><strong>Step 2 (Orientation 1):</strong> Fit the 60x40 base into the 410x190 van base.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Length: <InlineMath math="410 \div 60 = 6.83 \rightarrow 6 \text{ boxes}" /></li>
                  <li>Breadth: <InlineMath math="190 \div 40 = 4.75 \rightarrow 4 \text{ boxes}" /></li>
                  <li>Boxes per layer = <InlineMath math="6 \times 4 = 24 \text{ boxes}" /></li>
                </ul>
                <p><strong>Step 3 (Orientation 2):</strong> Rotate the base to fit 40x60 into 410x190.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Length: <InlineMath math="410 \div 40 = 10.25 \rightarrow 10 \text{ boxes}" /></li>
                  <li>Breadth: <InlineMath math="190 \div 60 = 3.16 \rightarrow 3 \text{ boxes}" /></li>
                  <li>Boxes per layer = <InlineMath math="10 \times 3 = 30 \text{ boxes}" /></li>
                </ul>
                <p><strong>Step 4:</strong> Choose the best orientation and multiply by the number of layers. Orientation 2 is better (30 per layer).</p>
                <BlockMath math="30 \times 11 = 330 \text{ boxes maximum}" />
              </div>
            )
          }
        ]
      },
      {
        id: "precedence-tables",
        title: "Precedence Tables & Critical Path",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> The "minimum time" to complete a massive project is always the longest path through the activity network. This is called the Critical Path. If any job on this path is delayed, the entire project is delayed.</p>

            <h4 className="text-white font-semibold">1. Constructing the Network Diagram</h4>
            <p>A precedence table shows which tasks must be completed before another task can begin. When drawing the diagram, ensure that every preceding task connects with an arrow to its following task.</p>

            <h4 className="text-white font-semibold">2. Calculating the Critical Path (Minimum Time)</h4>
            <p>To find the minimum time for the whole project to be completed:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Trace every single possible path from start to finish through your diagram.</li>
              <li>Add up the times for each path.</li>
              <li>The path that takes the most time is your minimum project completion time.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Adding Everything" Trap:</strong> The SQA frequently reports that candidates simply take the column of times in the table and add them all together to calculate a total time. Because many tasks are done simultaneously (at the same time by different people), adding all numbers together is completely wrong. You must only sum the paths!</li>
                <li><strong>The "Missing Node" Trap:</strong> When building the diagram, candidates often miss tasks that have multiple prerequisites (e.g., Task G relies on both C and F). Make sure your box for G has arrows coming from both C and F.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "precedence-ex1",
            question: (
              <div className="space-y-2">
                <p>Rab modernised a house. The work done is shown in the table.</p>
                <div className="overflow-x-auto my-2">
                  <table className="w-full text-left border-collapse border border-slate-700">
                    <thead>
                      <tr>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">Activity</th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">Description</th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">Preceding task</th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">Time in days</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-slate-700 px-4 py-2">A</td><td className="border border-slate-700 px-4 py-2">clear rubbish</td><td className="border border-slate-700 px-4 py-2">none</td><td className="border border-slate-700 px-4 py-2">7</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">B</td><td className="border border-slate-700 px-4 py-2">landscape garden</td><td className="border border-slate-700 px-4 py-2">A</td><td className="border border-slate-700 px-4 py-2">10</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">C</td><td className="border border-slate-700 px-4 py-2">plaster walls</td><td className="border border-slate-700 px-4 py-2">E, G</td><td className="border border-slate-700 px-4 py-2">9</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">D</td><td className="border border-slate-700 px-4 py-2">decorate house</td><td className="border border-slate-700 px-4 py-2">C</td><td className="border border-slate-700 px-4 py-2">8</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">E</td><td className="border border-slate-700 px-4 py-2">rewire house</td><td className="border border-slate-700 px-4 py-2">F</td><td className="border border-slate-700 px-4 py-2">15</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">F</td><td className="border border-slate-700 px-4 py-2">fix roof</td><td className="border border-slate-700 px-4 py-2">A</td><td className="border border-slate-700 px-4 py-2">18</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">G</td><td className="border border-slate-700 px-4 py-2">re-plumb house</td><td className="border border-slate-700 px-4 py-2">F</td><td className="border border-slate-700 px-4 py-2">11</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">H</td><td className="border border-slate-700 px-4 py-2">lay flooring</td><td className="border border-slate-700 px-4 py-2">C</td><td className="border border-slate-700 px-4 py-2">6</td></tr>
                      <tr><td className="border border-slate-700 px-4 py-2">I</td><td className="border border-slate-700 px-4 py-2">advertise for sale</td><td className="border border-slate-700 px-4 py-2">B, D, H</td><td className="border border-slate-700 px-4 py-2">1</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>Calculate the minimum time required for the renovations to be completed. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Trace the possible routes from Start (A) to Finish (I) through the network.</p>
                <p><strong>Step 2:</strong> Calculate the time for each individual path.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Path 1: A &rarr; B &rarr; I = <InlineMath math="7 + 10 + 1 = 18 \text{ days}" /></li>
                  <li>Path 2: A &rarr; F &rarr; E &rarr; C &rarr; D &rarr; I = <InlineMath math="7 + 18 + 15 + 9 + 8 + 1 = 58 \text{ days}" /></li>
                  <li>Path 3: A &rarr; F &rarr; E &rarr; C &rarr; H &rarr; I = <InlineMath math="7 + 18 + 15 + 9 + 6 + 1 = 56 \text{ days}" /></li>
                  <li>Path 4: A &rarr; F &rarr; G &rarr; C &rarr; D &rarr; I = <InlineMath math="7 + 18 + 11 + 9 + 8 + 1 = 54 \text{ days}" /></li>
                  <li>Path 5: A &rarr; F &rarr; G &rarr; C &rarr; H &rarr; I = <InlineMath math="7 + 18 + 11 + 9 + 6 + 1 = 52 \text{ days}" /></li>
                </ul>
                <p><strong>Step 3:</strong> Identify the longest path.</p>
                <p><strong>Final Answer:</strong> The minimum time required to complete the renovations is 58 days.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "statistics-probability",
    title: "Statistics & Probability",
    topics: [
      {
        id: "averages-spread",
        title: "Averages & Spread",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> Before finding the median or quartiles, you must always rewrite your list of numbers in ascending order. When comparing the interquartile range or standard deviation, you must never use the phrase "on average," as these are measures of spread, not averages.</p>

            <h4 className="text-white font-semibold">1. The Five-Figure Summary</h4>
            <p>A five-figure summary is used to describe the spread of a dataset and consists of five specific values: the Lowest value (L), the Lower Quartile (Q1), the Median (Q2), the Upper Quartile (Q3), and the Highest value (H).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Rewrite the raw list of numbers in order from lowest to highest.</li>
              <li><strong>Step 2:</strong> Draw an arrow to show the exact middle of the list; this is your median. If the middle falls between two numbers, add them together and divide by two.</li>
              <li><strong>Step 3:</strong> Find the middle of the lower half of the data to find the lower quartile, and the middle of the upper half to find the upper quartile.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Interquartile Range (IQR) & Semi-Interquartile Range (SIQR)</h4>
            <p>The Interquartile Range is calculated by subtracting the lower quartile from the upper quartile (<InlineMath math="\text{IQR} = \text{Upper Quartile} - \text{Lower Quartile}" />). The Semi-Interquartile Range is simply the IQR divided by 2.</p>

            <h4 className="text-white font-semibold">3. Box Plots</h4>
            <p>A box plot is a visual drawing of the five-figure summary.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The lowest and highest values form the ends of the "whiskers".</li>
              <li>A box is drawn starting at the lower quartile and ending at the upper quartile.</li>
              <li>A vertical line is drawn inside the box to represent the median.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Standard Deviation</h4>
            <p>The standard deviation of a list of numbers is a measure of how spread out numbers are from the mean.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>A lower standard deviation indicates that the numbers are more consistent.</li>
              <li>A higher standard deviation indicates that the numbers are more varied (or more spread out).</li>
              <li>You do not need to memorise the formula, as it is provided in the exam booklet.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "On Average Spread" Trap:</strong> The 2025 SQA Course Report highlights that when asked to compare interquartile ranges, many candidates incorrectly write responses that include "on average". You must completely avoid the phrase "on average" when making your second comment about standard deviation or the IQR.</li>
                <li><strong>The "Unordered Data" Trap:</strong> Candidates frequently rush to find the middle number of the list exactly as it is printed on the exam paper. If you do not rearrange the raw data into ascending order first, your median and quartiles will be completely wrong.</li>
                <li><strong>The "Forgotten Square Root" Trap:</strong> When calculating the standard deviation, the final step of the formula requires you to take the square root of your total. Candidates often do the complex division and then stop, losing the final process mark.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "averages-spread-ex1",
            question: (
              <div className="space-y-2">
                <p>The number of films Megan downloaded each month for a year is shown below:</p>
                <p className="text-center">34, 19, 22, 10, 13, 38, 9, 12, 26, 7, 19, 21</p>
                <p>For this data, calculate the median, the lower quartile, the upper quartile, and the interquartile range. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Rewrite the 12 numbers in ascending order.</p>
                <p className="text-center">7, 9, 10, 12, 13, 19, | 19, 21, 22, 26, 34, 38</p>
                <p><strong>Step 2:</strong> Find the median (the middle). The middle falls exactly between the two 19s. <InlineMath math="\text{Median} = 19" /></p>
                <p><strong>Step 3:</strong> Find the lower quartile (the middle of the bottom 6 numbers: 7, 9, 10, 12, 13, 19). The middle is between 10 and 12.</p>
                <BlockMath math="(10 + 12) \div 2 = 11 \text{ (Lower Quartile)}" />
                <p><strong>Step 4:</strong> Find the upper quartile (the middle of the top 6 numbers: 19, 21, 22, 26, 34, 38). The middle is between 22 and 26.</p>
                <BlockMath math="(22 + 26) \div 2 = 24 \text{ (Upper Quartile)}" />
                <p><strong>Step 5:</strong> Calculate the Interquartile Range (Q3 - Q1).</p>
                <BlockMath math="24 - 11 = 13 \text{ (IQR)}" />
              </div>
            )
          },
          {
            id: "averages-spread-ex2",
            question: (
              <div className="space-y-2">
                <p>The prices of lambs sold in September were recorded. A sample of the prices, in pounds, is shown:</p>
                <p className="text-center">72, 75, 73, 68, 65, 70</p>
                <p>For these prices, calculate the mean and the standard deviation. (4 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the mean (<InlineMath math="\bar{x}" />). Add all the numbers and divide by <InlineMath math="n" /> (which is 6).</p>
                <BlockMath math="72 + 75 + 73 + 68 + 65 + 70 = 423" />
                <BlockMath math="423 \div 6 = £70.50 \text{ (Mean)}" />
                <p><strong>Step 2:</strong> Set up a table to find <InlineMath math="(x - \bar{x})^2" /> for the formula.</p>
                <ul className="list-disc list-inside ml-4">
                  <li><InlineMath math="65 - 70.5 = -5.5 \rightarrow (-5.5)^2 = 30.25" /></li>
                  <li><InlineMath math="68 - 70.5 = -2.5 \rightarrow (-2.5)^2 = 6.25" /></li>
                  <li><InlineMath math="70 - 70.5 = -0.5 \rightarrow (-0.5)^2 = 0.25" /></li>
                  <li><InlineMath math="72 - 70.5 = 1.5 \rightarrow (1.5)^2 = 2.25" /></li>
                  <li><InlineMath math="73 - 70.5 = 2.5 \rightarrow (2.5)^2 = 6.25" /></li>
                  <li><InlineMath math="75 - 70.5 = 4.5 \rightarrow (4.5)^2 = 20.25" /></li>
                </ul>
                <p><strong>Step 3:</strong> Sum the squared column (<InlineMath math="\sum(x - \bar{x})^2" />).</p>
                <BlockMath math="30.25 + 6.25 + 0.25 + 2.25 + 6.25 + 20.25 = 65.5" />
                <p><strong>Step 4:</strong> Divide by <InlineMath math="n - 1" /> (which is <InlineMath math="6 - 1 = 5" />) and then take the square root.</p>
                <BlockMath math="65.5 \div 5 = 13.1" />
                <BlockMath math="s = \sqrt{13.1} = 3.61939..." />
                <p><strong>Final Answer:</strong> The standard deviation is £3.62.</p>
              </div>
            )
          },
          {
            id: "averages-spread-ex3",
            question: (
              <div className="space-y-2">
                <p>Tommy also recorded the number of films he downloaded each month. The interquartile range for the number of films Tommy downloaded is 10.</p>
                <p>Make one valid comment comparing the number of films Megan and Tommy downloaded. (1 mark)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Identify that IQR is a measure of spread. Tommy's IQR (10) is lower than Megan's IQR (13, calculated in Example 1).</p>
                <p><strong>Step 2:</strong> Link a lower spread to the word "consistent" and completely avoid using the word "average".</p>
                <p><strong>Final Answer:</strong> "The number of films Tommy downloaded was more consistent than Megan because his interquartile range is lower."</p>
              </div>
            )
          }
        ]
      },
      {
        id: "statistical-diagrams",
        title: "Statistical Diagrams",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When constructing a pie chart, you must remember to multiply your fraction by 360 to find the angle. The SQA Course Reports repeatedly highlight that candidates lose marks by mistakenly calculating percentages (multiplying by 100) instead of angle sizes.</p>

            <h4 className="text-white font-semibold">1. Pie Charts</h4>
            <p>A pie chart represents data as slices of a full <InlineMath math="360^\circ" /> circle.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Constructing:</strong> Add up all the values to find the total. For each category, write the value as a fraction of the total, then multiply by <InlineMath math="360^\circ" /> to find the exact angle for the slice.</li>
              <li><strong>Formula:</strong> <InlineMath math="\frac{\text{Amount}}{\text{Total}} \times 360^\circ" />.</li>
              <li><strong>Interpreting:</strong> If you know the angle of a slice, its fraction of the whole is simply <InlineMath math="\frac{\text{Angle}}{360^\circ}" />.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Scatter Graphs & Lines of Best Fit</h4>
            <p>A scatter graph plots two different variables to see if there is a relationship (correlation) between them.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Positive correlation:</strong> As one value goes up, the other goes up (e.g., temperature and ice cream sales).</li>
              <li><strong>Negative correlation:</strong> As one value goes up, the other goes down (e.g., temperature and umbrella sales).</li>
              <li><strong>Line of Best Fit:</strong> This is a single, straight line drawn with a ruler through the middle of the plotted points. It must follow the general trend/direction of the data, with roughly an equal number of points above and below the line.</li>
              <li><strong>Estimating:</strong> Draw a line from the given value on one axis to your line of best fit, and then across to the other axis. Your estimate must match your specific line, even if your line is slightly different from someone else's.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Stem-and-Leaf Diagrams</h4>
            <p>A stem-and-leaf diagram displays quantitative data split into a "stem" (the first digits) and "leaves" (the last digit).</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The data must be ordered sequentially.</li>
              <li>A back-to-back stem-and-leaf diagram allows you to compare two different sets of data at once (e.g., ages of men vs women).</li>
              <li>You must always include or check the Key (e.g., <InlineMath math="3 | 0 = 30" />) to understand what the numbers represent.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Compound Bar Graphs</h4>
            <p>Compound (or comparative) bar graphs allow you to compare like-for-like data side-by-side using two or more sets of bars on the same axes.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Percentages instead of Angles" Trap:</strong> When asked to construct a pie chart, candidates frequently divide the amount by the total and multiply by 100. This calculates a percentage, not an angle! You cannot draw a 25% slice with a protractor; you must multiply by 360 to find the <InlineMath math="90^\circ" /> angle.</li>
                <li><strong>The "Dot-to-Dot" Trap:</strong> When asked to draw a line of best fit, candidates sometimes join all the individual points together in a zig-zag pattern using their ruler. A line of best fit must be a single, continuous, straight line that slices through the middle of the data.</li>
                <li><strong>The "Ignoring Your Own Line" Trap:</strong> When asked to estimate a value using your line of best fit, you must read the answer strictly from the line you drew. If you try to guess the answer mathematically without looking at your drawn line, you will lose the mark. The examiner checks if your answer perfectly matches your graph.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "diagrams-ex1",
            question: (
              <div className="space-y-2">
                <p>A researcher carried out a survey to determine people's preferred type of chocolate. The results are shown below:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>White: 20</li>
                  <li>Milk: 34</li>
                  <li>Dark: 26</li>
                </ul>
                <p>Calculate the angles required to construct a pie chart to illustrate this information. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the total number of people surveyed.</p>
                <BlockMath math="20 + 34 + 26 = 80 \text{ people}" />
                <p><strong>Step 2:</strong> Calculate the angle for White Chocolate.</p>
                <BlockMath math="\frac{20}{80} \times 360^\circ = 90^\circ" />
                <p><strong>Step 3:</strong> Calculate the angle for Milk Chocolate.</p>
                <BlockMath math="\frac{34}{80} \times 360^\circ = 153^\circ" />
                <p><strong>Step 4:</strong> Calculate the angle for Dark Chocolate.</p>
                <BlockMath math="\frac{26}{80} \times 360^\circ = 117^\circ" />
                <p>(Self-Check: <InlineMath math="90 + 153 + 117 = 360^\circ" />. The candidate would then use a protractor to accurately draw these slices).</p>
              </div>
            )
          },
          {
            id: "diagrams-ex2",
            question: (
              <div className="space-y-2">
                <p>Harris recorded the departure time (am) and his journey time (minutes) to work.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Departure time: 7:32, 7:36, 8:10, 7:40, 8:02, 7:50, 8:04, 7:45</li>
                  <li>Journey time: 22, 21, 37, 25, 32, 28, 36, 24</li>
                </ul>
                <p>Harris plots the data on a scatter graph and draws a single straight line of best fit. Tomorrow, Harris plans to depart at 7:55 am. Explain how he would use his line of best fit to estimate his journey time. (1 mark)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Locate 7:55 am on the horizontal x-axis (Departure Time).</p>
                <p><strong>Step 2:</strong> Draw a straight vertical line upwards from 7:55 am until it exactly hits the drawn line of best fit.</p>
                <p><strong>Step 3:</strong> From that specific point on the line of best fit, draw a straight horizontal line across to the vertical y-axis to read the estimated journey time.</p>
              </div>
            )
          },
          {
            id: "diagrams-ex3",
            question: (
              <div className="space-y-2">
                <p>A back-to-back stem-and-leaf diagram shows the number of people who went to the cinema to see an Action Film and a Comedy Film over 10 nights.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>For the Comedy film, the "leaves" next to the "7" stem are: 7, 6, 5, 3.</li>
                  <li>For the Action film, the "leaves" next to the "7" stem are: 5.</li>
                </ul>
                <p>The key states <InlineMath math="8 | 4 = 48" /> people for the comedy side, and <InlineMath math="4 | 1 = 41" /> people for the action side.</p>
                <p>(a) What was the largest number of people who went to see the action film? (1 mark)</p>
                <p>(b) What was the smallest number of people who went to see the comedy film? (1 mark)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Interpret the stems. The "7" stem represents numbers in the 70s.</p>
                <p><strong>Step 2 (Action):</strong> Looking at the Action side, the highest stem with a leaf is 7, and the leaf is 5.</p>
                <p><strong>Answer (a):</strong> The largest number of people for the action film was 75.</p>
                <p><strong>Step 3 (Comedy):</strong> Looking at the Comedy side, the lowest stem with leaves is 4, and the leaves are 8.</p>
                <p><strong>Answer (b):</strong> The smallest number of people for the comedy film was 48.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "interpreting-data",
        title: "Interpreting Graphical Data",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When making statistical comparisons, you must explicitly state what you are comparing in context (e.g., "The number of visitors..."). Furthermore, you must never use the phrase "on average" when comparing the standard deviation or interquartile range.</p>

            <h4 className="text-white font-semibold">1. Comparing Statistics (Means and Spread)</h4>
            <p>In the exam, you will frequently be given the mean and the standard deviation (or interquartile range) for two different groups and asked to make two valid comparisons.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Comment 1 (The Average):</strong> Compare the Mean or Median. You must state which group is higher/lower and link it directly to the context. (Example: "On average, the temperature in the restaurant fridge was higher than the café fridge.")</li>
              <li><strong>Comment 2 (The Spread):</strong> Compare the Standard Deviation (SD) or Interquartile Range (IQR). These measure how spread out the data is.</li>
              <ul className="list-disc list-inside space-y-1 ml-8">
                <li>A higher SD/IQR means the data is more varied (or more spread out).</li>
                <li>A lower SD/IQR means the data is less varied (or more consistent).</li>
              </ul>
              <li>(Example: "The temperatures in the restaurant fridge were more consistent because the standard deviation was lower.")</li>
            </ul>

            <h4 className="text-white font-semibold">2. Scatter Graphs & Lines of Best Fit</h4>
            <p>A scatter graph plots two different variables to see if there is a relationship (correlation) between them.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Line of Best Fit:</strong> This is a single, straight line drawn with a ruler through the middle of the plotted points. It should follow the general trend of the data, with roughly an equal number of points above and below the line.</li>
              <li><strong>Estimating:</strong> You will often be asked to use your line of best fit to estimate a value. Draw a line up from the x-axis to your line of best fit, and then across to the y-axis to read the corresponding value.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Pie Charts</h4>
            <p>A pie chart represents data as slices of a full <InlineMath math="360^\circ" /> circle.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Calculating Angles:</strong> Add up all the values to find the total. For each category, divide its value by the total, then multiply by 360.</li>
              <li><strong>Formula:</strong> <InlineMath math="\frac{\text{Amount}}{\text{Total}} \times 360^\circ" />.</li>
              <li><strong>Interpreting Slices:</strong> If you are given the angle and the total number of people, you can work backwards. Divide the angle by 360 and multiply by the total number of people.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "On Average" Spread Trap:</strong> SQA Course Reports repeatedly highlight that candidates lose marks by writing "on average, the scores were more varied". Standard deviation and IQR are measures of spread, not averages. You must completely avoid the word "average" in your second comment.</li>
                <li><strong>The "Lack of Context" Trap:</strong> Writing a comment like "Group A is higher than Group B" or "The mean is higher" scores zero marks. You must explicitly mention the real-life subject you are comparing (e.g., "The average price of lambs was higher in September").</li>
                <li><strong>The "Dot-to-Dot" Trap:</strong> When asked to draw a line of best fit on a scatter graph, candidates sometimes connect the dots together in a zigzag pattern. A line of best fit must be a single, continuous straight line.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "interpreting-ex1",
            question: (
              <div className="space-y-2">
                <p>The prices of lambs sold in September were recorded. The mean price was £70.50 and the standard deviation was £2.60.</p>
                <p>The price of lambs sold in August was also recorded. The mean price was £70.20 and the standard deviation was £3.85.</p>
                <p>Make two valid comparisons about the prices of lambs in August and September. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1 (Compare the means):</strong> September's mean (£70.50) is higher than August's mean (£70.20).</p>
                <p><strong>Valid Comment 1:</strong> "On average, the price of lambs sold in September was higher than in August."</p>
                <p><strong>Step 2 (Compare the standard deviations):</strong> September's SD (£2.60) is lower than August's SD (£3.85). Lower SD means more consistent.</p>
                <p><strong>Valid Comment 2:</strong> "The prices of lambs sold in September were more consistent than in August because the standard deviation is lower."</p>
              </div>
            )
          },
          {
            id: "interpreting-ex2",
            question: (
              <div className="space-y-2">
                <p>A survey was conducted into favourite pie fillings. The results were:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>80 people for apple</li>
                  <li>40 people for cherry</li>
                  <li>60 people for lemon</li>
                </ul>
                <p>Calculate the angles required to construct a pie chart to illustrate this information. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the total number of people surveyed.</p>
                <BlockMath math="80 + 40 + 60 = 180 \text{ people}" />
                <p><strong>Step 2:</strong> Calculate the angle for Apple.</p>
                <BlockMath math="\frac{80}{180} \times 360^\circ = 160^\circ" />
                <p><strong>Step 3:</strong> Calculate the angle for Cherry.</p>
                <BlockMath math="\frac{40}{180} \times 360^\circ = 80^\circ" />
                <p><strong>Step 4:</strong> Calculate the angle for Lemon.</p>
                <BlockMath math="\frac{60}{180} \times 360^\circ = 120^\circ" />
                <p>(Self-Check: <InlineMath math="160^\circ + 80^\circ + 120^\circ = 360^\circ" />. The student would then use a protractor to accurately draw these slices).</p>
              </div>
            )
          },
          {
            id: "interpreting-ex3",
            question: (
              <div className="space-y-2">
                <p>Harris recorded the time his commute took depending on his departure time. He plots the data on a scatter graph and draws a straight line of best fit.</p>
                <p>Tomorrow, Harris plans to depart at 7:55 am.</p>
                <p>Explain how he would use his line of best fit to estimate his journey time. (1 mark)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Locate 7:55 am on the horizontal x-axis (Departure Time).</p>
                <p><strong>Step 2:</strong> Draw a straight vertical line upwards from 7:55 am until it hits the drawn line of best fit.</p>
                <p><strong>Step 3:</strong> From that exact point on the line of best fit, draw a straight horizontal line across to the vertical y-axis to read the estimated journey time in minutes.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "probability-risk",
        title: "Probability & Risk",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p><strong>The Golden Rule:</strong> When a question involves two events (like rolling two dice or spinning two spinners), do not try to calculate the combinations in your head. You must draw a two-way grid/table to accurately count the total number of possible outcomes and the number of successful outcomes.</p>

            <h4 className="text-white font-semibold">1. Simple Probability</h4>
            <p>Probability is a measure of how likely an event is to happen. It is calculated using the formula:</p>
            <BlockMath math="\text{Probability} = \frac{\text{Number of successful outcomes}}{\text{Total number of possible outcomes}}" />
            <p>You can leave your answer as a fraction (simplified if possible), a decimal, or a percentage.</p>

            <h4 className="text-white font-semibold">2. Dependent Events (Without Replacement)</h4>
            <p>If a question states that an object is drawn and "not replaced", the total number of items available for the next draw permanently decreases. You must also check if the specific "successful" items you are looking for were among those removed.</p>

            <h4 className="text-white font-semibold">3. Expected Outcomes</h4>
            <p>You will frequently be asked to calculate how many times an event is expected to happen, and then compare it to the actual result.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Step 1:</strong> Multiply the given probability by the total number of trials (e.g., if the probability is 0.05 and there are 400 trials, calculate <InlineMath math="0.05 \times 400" />).</li>
              <li><strong>Step 2:</strong> Compare your calculated "expected" value to the "actual" value given in the text, and clearly state whether the actual value is more or less than expected.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Comparing Probabilities</h4>
            <p>If asked to determine which of two different games offers a higher chance of winning, you must calculate the probability for both. Because fractions with different denominators (e.g., <InlineMath math="\frac{18}{150}" /> and <InlineMath math="\frac{5}{36}" />) are hard to compare directly, you should convert both fractions into decimals or percentages to make a valid, justified conclusion.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Common SQA Examiner Traps 🚨</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The "Lottery Bonus Ball" Trap:</strong> In a lottery draw where balls are not replaced, candidates frequently forget to subtract the drawn balls from the total. If 6 balls have been drawn from a machine of 49, the denominator for the 7th ball is 43, not 49. Furthermore, you must actively check if any of the balls already drawn fit the criteria for your next draw, as this reduces your numerator!</li>
                <li><strong>The "Expected vs Actual" Mix-Up:</strong> When asked if an event happened "more or less than expected", candidates sometimes perform the calculation but fail to write the final conclusion sentence. If your expected value is 16.1, and the actual value was 15, you must write "Less than expected because 15 &lt; 16.1" to secure the final mark.</li>
                <li><strong>The "Invisible Table" Trap:</strong> For questions with two spinners, the SQA awards marks for identifying the correct total number of outcomes. If you do not draw a grid and accidentally miss a combination (thinking there are 15 outcomes instead of 16), you will lose the process marks.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "probability-ex1",
            question: (
              <div className="space-y-2">
                <p>A lottery consists of a draw with 50 balls numbered from 1 to 50. In the draw, five numbered balls are drawn and not replaced. These five numbers were:</p>
                <p className="text-center">5, 12, 20, 31, 42</p>
                <p>A further bonus ball is then drawn. Calculate the probability of the bonus ball being a multiple of 10. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Identify the remaining total number of balls (the denominator). <InlineMath math="50 - 5 = 45" /> balls remaining.</p>
                <p><strong>Step 2:</strong> Identify how many "multiples of 10" existed originally. 10, 20, 30, 40, 50 (5 balls).</p>
                <p><strong>Step 3:</strong> Check the drawn list to see if any multiples of 10 have already been removed. The number 20 was drawn. Therefore, only 10, 30, 40, 50 remain (4 balls).</p>
                <p><strong>Final Answer:</strong> The probability is <InlineMath math="\frac{4}{45}" />.</p>
              </div>
            )
          },
          {
            id: "probability-ex2",
            question: (
              <div className="space-y-2">
                <p>Eddie runs a game stall at a school fayre. His game requires two spinners to be spun and allowed to come to rest.</p>
                <ul className="list-disc list-inside ml-4">
                  <li><strong>Spinner A:</strong> has numbers 2, 4, 6.</li>
                  <li><strong>Spinner B:</strong> has numbers 1, 3, 5, 7.</li>
                </ul>
                <p>The numbers on which the spinners come to rest are multiplied together. To win a prize, the answer to this multiplication must be greater than 15. Calculate the probability of winning a prize. (3 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Draw a two-way grid to find all possible outcomes.</p>
                <div className="overflow-x-auto my-2">
                  <table className="w-full text-left border-collapse border border-slate-700">
                    <thead>
                      <tr>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800"><InlineMath math="\times" /></th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">1</th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">3</th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">5</th>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">7</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">2</th>
                        <td className="border border-slate-700 px-4 py-2">2</td>
                        <td className="border border-slate-700 px-4 py-2">6</td>
                        <td className="border border-slate-700 px-4 py-2">10</td>
                        <td className="border border-slate-700 px-4 py-2">14</td>
                      </tr>
                      <tr>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">4</th>
                        <td className="border border-slate-700 px-4 py-2">4</td>
                        <td className="border border-slate-700 px-4 py-2">12</td>
                        <td className="border border-slate-700 px-4 py-2">20</td>
                        <td className="border border-slate-700 px-4 py-2">28</td>
                      </tr>
                      <tr>
                        <th className="border border-slate-700 px-4 py-2 bg-slate-800">6</th>
                        <td className="border border-slate-700 px-4 py-2">6</td>
                        <td className="border border-slate-700 px-4 py-2">18</td>
                        <td className="border border-slate-700 px-4 py-2">30</td>
                        <td className="border border-slate-700 px-4 py-2">42</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p><strong>Step 2:</strong> Count the total number of outcomes. There are 12 total outcomes.</p>
                <p><strong>Step 3:</strong> Count the successful outcomes (answers strictly greater than 15). The successful outcomes are 20, 28, 18, 30, and 42 (5 outcomes).</p>
                <p><strong>Final Answer:</strong> The probability of winning a prize is <InlineMath math="\frac{5}{12}" />.</p>
              </div>
            )
          },
          {
            id: "probability-ex3",
            question: (
              <div className="space-y-2">
                <p>A railway company runs a commuter service. The probability of a train arriving late is 0.045.</p>
                <p>In one month, the company ran 600 trains, of which 24 arrived late.</p>
                <p>Determine if the number of late trains is more or less than expected. (2 marks)</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Calculate the expected number of late trains by multiplying the probability by the total number of trains.</p>
                <BlockMath math="0.045 \times 600 = 27 \text{ expected late trains}" />
                <p><strong>Step 2:</strong> Compare the expected value (27) to the actual value (24) and state a conclusion.</p>
                <p><strong>Final Answer:</strong> Less than expected, because 24 is less than 27.</p>
              </div>
            )
          }
        ]
      }
    ]
  }
];
