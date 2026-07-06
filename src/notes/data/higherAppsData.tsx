import { Section } from '@/src/notes/types';

import { InlineMath, BlockMath } from '@/src/notes/math-components';
import { PrecedenceNetworkExample2, ConstructingPertExample3, TreeDiagramExample1, TreeDiagramExample2, VennDiagramExample1, VennDiagramExample2, VennDiagramExample3 } from '@/src/notes/illustrations';

export const higherAppsData: Section[] = [
  {
    id: "finance",
    title: "Finance",
    topics: [
      {
        id: "finance-revision-and-gross-income",
        title: "Finance Revision & Gross Income",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              A person's <strong>gross income</strong> is the total amount of money they earn from all sources <em>before</em> any deductions (like tax or pension contributions) are taken away.
            </p>
            <p>
              To calculate a total gross income, you must carefully identify and add together all the different elements of a person's pay. These elements typically include:
            </p>

            <div className="space-y-4">
              <div>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Basic Pay:</strong> The agreed-upon fixed amount of money a person receives for their work. This is usually expressed as an hourly rate or an annual salary.</li>
                  <li><strong>Overtime:</strong> Compensation for working extra hours beyond the requirements of a standard contract. This is often paid at a higher, premium rate (e.g., "time and a half" or "double time").</li>
                  <li><strong>Commission:</strong> An extra payment based on job performance. This is very common in sales jobs, where an employee earns a percentage of the total sales they make.</li>
                  <li><strong>Bonuses:</strong> Lump sums usually paid at a specific point in the year, often related to the overall performance of the business or the individual.</li>
                </ul>
              </div>

              <div>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">A Crucial Trap to Avoid:</p>
                  <p className="text-amber-100/80">
                    Most commonly, people are paid weekly, monthly, or every four weeks. However, you must remember that there are <strong>NOT</strong> exactly 4 weeks in a month.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-amber-100/80">
                    <li>There are <strong>52 weeks</strong> in a year, and <strong>12 months</strong> in a year.</li>
                    <li>If you need to convert a weekly wage into a monthly wage, you must multiply by 52 (to find the annual total) and then divide by 12.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "gross-income-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Calculating Total Gross Pay</strong></p>
                <p>Hannah is paid an annual salary of &pound;25,200 for working 150 basic hours per month. She is paid "time and a half" for any overtime hours worked. She also earns commission at a rate of 2.5% on any total monthly sales she makes over the value of &pound;3,000.</p>
                <p className="mt-2">One month, Hannah worked 156 hours and made total sales of &pound;6,800. Calculate her gross income for that month.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1"><strong>Calculate Monthly Basic Pay:</strong></p>
                  <p className="ml-4">&pound;25,200 &divide; 12 = &pound;2,100.</p>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate Overtime Pay:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Find the basic hourly rate: &pound;2,100 &divide; 150 hours = &pound;14 per hour.</li>
                    <li>Find the overtime hourly rate (time and a half): &pound;14 &times; 1.5 = &pound;21 per hour.</li>
                    <li>Find the overtime hours worked: 156 - 150 = 6 hours.</li>
                    <li>Total overtime pay: 6 &times; &pound;21 = &pound;126.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate Commission:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Find the eligible sales amount: &pound;6,800 - &pound;3,000 = &pound;3,800.</li>
                    <li>Calculate 2.5% of this amount: 0.025 &times; &pound;3,800 = &pound;95.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate Total Gross Income:</strong></p>
                  <p className="ml-4">&pound;2,100 (Basic) + &pound;126 (Overtime) + &pound;95 (Commission) = &pound;2,321.</p>
                </div>
              </div>
            )
          },
          {
            id: "gross-income-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Working Backwards to find Basic Rate</strong></p>
                <p>David works in a warehouse. His overtime rate is 30% greater than his basic hourly rate. Last week, his gross income was &pound;638. He worked 35 basic hours and 8 overtime hours.</p>
                <p className="mt-2">Calculate David's basic hourly rate of pay.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We can set this up as an algebra problem. Let David's basic rate be <InlineMath math="x" />.</p>
                <ul className="list-none space-y-2 ml-4">
                  <li>Basic pay = <InlineMath math="35x" /></li>
                  <li>Overtime rate = <InlineMath math="1.3x" /> (because it is 30% greater)</li>
                  <li>Overtime pay = <InlineMath math="8 \times 1.3x = 10.4x" /></li>
                </ul>
                <p className="mt-2">Now, add them together to equal his total gross income:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><InlineMath math="35x + 10.4x = 638" /></li>
                  <li><InlineMath math="45.4x = 638" /></li>
                  <li><InlineMath math="x = 638 \div 45.4 = 14.0528..." /></li>
                </ul>
                <p className="mt-2">David's basic hourly rate is <strong>&pound;14.05</strong>.</p>
              </div>
            )
          },
          {
            id: "gross-income-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Time Period Conversions</strong></p>
                <p>A local factory offers two different contracts for a packaging role.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Contract A: Pays &pound;420 per week.</li>
                  <li>Contract B: Pays &pound;1,750 per month.</li>
                </ul>
                <p className="mt-4">Determine which contract offers a higher annual gross income.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>Contract A (Annual):</strong> &pound;420 &times; 52 weeks = &pound;21,840.</li>
                  <li><strong>Contract B (Annual):</strong> &pound;1,750 &times; 12 months = &pound;21,000.</li>
                </ul>
                <p className="mt-4 text-emerald-300">
                  Contract A offers a higher annual gross income, despite &pound;1,750 appearing larger than exactly 4 weeks of Contract A's pay, highlighting why we cannot simply assume 4 weeks in a month!
                </p>
              </div>
            )
          }
        ]
      },
      {
        id: "national-insurance",
        title: "National Insurance",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              National Insurance (NI) is a tax paid by employees and employers to fund state benefits, such as the State Pension. In the Higher Applications of Mathematics exam, you will be expected to calculate a worker's NI contributions using the specific figures provided in your data booklet for that year.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The "Before Deductions" Rule (The Ultimate SQA Trap)</h4>
                <p>
                  The most important rule to remember for National Insurance is that it is calculated on a person's salary <strong>before</strong> any other deductions (such as pension contributions) are taken away.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">Crucial Note:</p>
                  <p className="text-amber-100/80">
                    If an exam question tells you someone pays 5% into their pension, you must <strong>completely ignore that 5%</strong> when calculating their National Insurance.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The 2025/26 Tax Year Bands</h4>
                <p>
                  For the 2026 exam, you will be using the 2025/26 tax year rates. You do not pay a flat percentage on your whole salary; instead, your earnings are split into "chunks" or bands:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Up to &pound;1,048 a month:</strong> You pay 0% on this portion of your earnings.</li>
                  <li><strong>Between &pound;1,048 and &pound;4,189 a month:</strong> You pay 8% on this specific chunk of your earnings.</li>
                  <li><strong>Above &pound;4,189 a month:</strong> You pay 2% on anything you earn above this threshold.</li>
                </ul>
                <p className="mt-4 text-indigo-300 font-semibold">
                  Strategy: Always calculate the physical amount of money that sits inside each bracket before you calculate the percentage.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "national-insurance-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Basic NI Calculation (Single Band)</strong></p>
                <p>Fiona earns a gross monthly salary of &pound;3,400. Calculate her monthly National Insurance contribution for the 2025/26 tax year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Fiona earns more than &pound;1,048, but less than &pound;4,189, meaning her earnings only cross into the 8% band.</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Find the amount sitting in the 8% band: &pound;3,400 - &pound;1,048 = &pound;2,352.</li>
                  <li>Calculate 8% of this amount: 0.08 &times; &pound;2,352 = &pound;188.16.</li>
                </ul>
                <p className="mt-2 text-emerald-300 font-semibold">Fiona's monthly National Insurance contribution is &pound;188.16.</p>
              </div>
            )
          },
          {
            id: "national-insurance-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Higher Earner Calculation (Multiple Bands)</strong></p>
                <p>Gregor is a software engineer who earns a gross monthly salary of &pound;5,800. Calculate his monthly National Insurance contribution for the 2025/26 tax year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Gregor earns more than &pound;4,189, meaning his earnings stretch across both the 8% and 2% bands.</p>
                <div>
                  <p className="mb-1"><strong>Calculate the 8% band contribution:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Find the maximum amount that can fit in this band: &pound;4,189 - &pound;1,048 = &pound;3,141.</li>
                    <li>Calculate 8% of this maximum: 0.08 &times; &pound;3,141 = &pound;251.28.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate the 2% band contribution:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Find the amount he earns above the upper threshold: &pound;5,800 - &pound;4,189 = &pound;1,611.</li>
                    <li>Calculate 2% of this amount: 0.02 &times; &pound;1,611 = &pound;32.22.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate total NI:</strong></p>
                  <p className="ml-4">&pound;251.28 + &pound;32.22 = &pound;283.50.</p>
                </div>
              </div>
            )
          },
          {
            id: "national-insurance-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The Pension Trap (Annual to Monthly)</strong></p>
                <p>Chloe earns a gross annual salary of &pound;54,000. She pays 6% of her gross salary into a workplace pension scheme. Calculate her monthly National Insurance contribution for the 2025/26 tax year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>Trap Check:</strong> We must completely ignore the 6% pension contribution, as NI is calculated on the salary before pension deductions.</p>
                <div>
                  <p className="mb-1"><strong>Convert annual to monthly salary:</strong></p>
                  <p className="ml-4">&pound;54,000 &divide; 12 = &pound;4,500.</p>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate the 8% band contribution:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Maximum amount in band: &pound;4,189 - &pound;1,048 = &pound;3,141.</li>
                    <li>8% calculation: 0.08 &times; &pound;3,141 = &pound;251.28.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate the 2% band contribution:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Amount above threshold: &pound;4,500 - &pound;4,189 = &pound;311.</li>
                    <li>2% calculation: 0.02 &times; &pound;311 = &pound;6.22.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate total NI:</strong></p>
                  <p className="ml-4">&pound;251.28 + &pound;6.22 = &pound;257.50.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "income-tax",
        title: "Income Tax",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Income tax is paid to the government to help fund public services. For most employees, this is automatically deducted from their wages throughout the year through a system called PAYE (Pay As You Earn).
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Pension Trap (The Ultimate SQA Trick)</h4>
                <p>
                  Unlike National Insurance, which is calculated before pension deductions, Income Tax is strictly calculated on a person's <strong>Taxable Income</strong>.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <BlockMath math="\text{Taxable Income} = \text{Gross Pay} - \text{Pension Contributions}" />
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">Crucial Exam Rule:</p>
                  <p className="text-amber-100/80">
                    If a question states that an employee pays a percentage into a pension, you must <strong>subtract that pension amount from their gross salary</strong> before you even look at the tax bands. Failing to do this will result in losing several marks!
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The 2025/26 Scottish Tax Bands</h4>
                <p>
                  In the Higher Applications 2026 exam, you will be expected to use the 2025/26 tax year bands provided in your data booklet. Like National Insurance, income tax uses a progressive "chunking" system:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Personal Allowance (0%):</strong> Up to &pound;12,570. This is tax-free.</li>
                  <li><strong>Starter rate (19%):</strong> &pound;12,570 &ndash; &pound;15,397.</li>
                  <li><strong>Basic rate (20%):</strong> &pound;15,397 &ndash; &pound;27,491.</li>
                  <li><strong>Intermediate rate (21%):</strong> &pound;27,491 &ndash; &pound;43,662.</li>
                  <li><strong>Higher rate (42%):</strong> &pound;43,662 &ndash; &pound;75,000.</li>
                  <li><strong>Advanced rate (45%):</strong> &pound;75,000 &ndash; &pound;125,140.</li>
                  <li><strong>Top rate (48%):</strong> Over &pound;125,140.</li>
                </ul>
                <p className="mt-4 text-indigo-300 font-semibold">
                  Strategy: Calculate the maximum physical amount of money that can fit inside each individual band, and then multiply it by the percentage for that band.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "income-tax-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Basic Income Tax Calculation</strong></p>
                <p>Callum earns a gross annual salary of &pound;22,000. He has opted out of his workplace pension scheme. Calculate his annual income tax deduction for the 2025/26 tax year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Because Callum has no pension, his gross salary is his taxable income. His earnings cross through the 19% band and finish in the 20% band.</p>
                <div>
                  <p className="mb-1"><strong>Starter Rate (19%):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Maximum in band: &pound;15,397 - &pound;12,570 = &pound;2,827.</li>
                    <li>Tax: 0.19 &times; &pound;2,827 = &pound;537.13.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Basic Rate (20%):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Amount in band: &pound;22,000 - &pound;15,397 = &pound;6,603.</li>
                    <li>Tax: 0.20 &times; &pound;6,603 = &pound;1,320.60.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Total Annual Tax:</strong></p>
                  <p className="ml-4">&pound;537.13 + &pound;1,320.60 = &pound;1,857.73.</p>
                </div>
              </div>
            )
          },
          {
            id: "income-tax-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Pension Trap (Calculating Monthly Tax)</strong></p>
                <p>Sarah earns a gross annual salary of &pound;36,000. She contributes 6% of her gross annual salary into her workplace pension scheme. Calculate the amount of income tax Sarah expects to pay each month for the 2025/26 tax year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p><strong>Trap Check:</strong> We must calculate her taxable income by deducting her pension first!</p>
                <div>
                  <p className="mb-1"><strong>Calculate Taxable Income:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Pension: 0.06 &times; &pound;36,000 = &pound;2,160.</li>
                    <li>Taxable Income: &pound;36,000 - &pound;2,160 = &pound;33,840.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Starter Rate (19%):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Amount in band: &pound;15,397 - &pound;12,570 = &pound;2,827.</li>
                    <li>Tax: 0.19 &times; &pound;2,827 = &pound;537.13.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Basic Rate (20%):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Amount in band: &pound;27,491 - &pound;15,397 = &pound;12,094.</li>
                    <li>Tax: 0.20 &times; &pound;12,094 = &pound;2,418.80.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Intermediate Rate (21%):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Amount in band: &pound;33,840 - &pound;27,491 = &pound;6,349.</li>
                    <li>Tax: 0.21 &times; &pound;6,349 = &pound;1,333.29.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate Total Annual Tax:</strong></p>
                  <p className="ml-4">&pound;537.13 + &pound;2,418.80 + &pound;1,333.29 = &pound;4,289.22.</p>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate Monthly Tax:</strong></p>
                  <p className="ml-4">&pound;4,289.22 &divide; 12 = &pound;357.44.</p>
                </div>
              </div>
            )
          },
          {
            id: "income-tax-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Higher Earner (Advanced Rate)</strong></p>
                <p>Mark is a corporate director earning a gross annual salary of &pound;78,000. He makes no pension contributions. Calculate Mark's total annual income tax deduction for the 2025/26 tax year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Mark's earnings cross through five different tax bands, reaching the Advanced Rate.</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>Starter Rate (19%):</strong> (&pound;15,397 - &pound;12,570) = &pound;2,827. Tax = 0.19 &times; &pound;2,827 = &pound;537.13.</li>
                  <li><strong>Basic Rate (20%):</strong> (&pound;27,491 - &pound;15,397) = &pound;12,094. Tax = 0.20 &times; &pound;12,094 = &pound;2,418.80.</li>
                  <li><strong>Intermediate Rate (21%):</strong> (&pound;43,662 - &pound;27,491) = &pound;16,171. Tax = 0.21 &times; &pound;16,171 = &pound;3,395.91.</li>
                  <li><strong>Higher Rate (42%):</strong> (&pound;75,000 - &pound;43,662) = &pound;31,338. Tax = 0.42 &times; &pound;31,338 = &pound;13,161.96.</li>
                  <li><strong>Advanced Rate (45%):</strong> (&pound;78,000 - &pound;75,000) = &pound;3,000. Tax = 0.45 &times; &pound;3,000 = &pound;1,350.00.</li>
                </ul>
                <div>
                  <p className="mb-1"><strong>Total Annual Tax:</strong></p>
                  <p className="ml-4">&pound;537.13 + &pound;2,418.80 + &pound;3,395.91 + &pound;13,161.96 + &pound;1,350.00 = &pound;20,863.80.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "deductions",
        title: "Deductions",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              A person's <strong>net pay</strong> (often called "take-home pay") is the final amount of money they receive in their bank account after all deductions have been subtracted from their gross pay.
            </p>
            <p className="font-semibold text-emerald-300">
              When faced with a full net pay exam question, you must calculate multiple different deductions. The order in which you calculate them is critical.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Common Deductions</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>National Insurance (NI):</strong> Calculated on the gross salary <em>before</em> any other deductions are taken away.</li>
                  <li><strong>Pension Contributions:</strong> Usually calculated as a straight percentage of the gross salary. Often, an employer will also pay into the pension, but the <em>employer's</em> contribution does not come out of the employee's pay.</li>
                  <li><strong>Income Tax:</strong> Calculated on the <em>taxable income</em> (which is the Gross Pay minus the employee's pension contribution).</li>
                  <li><strong>Student Loans:</strong> Usually calculated as a set percentage (e.g., 9%) of any earnings that fall above a specific monthly or annual threshold.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The Order of Operations (The 'Net Pay' Checklist)</h4>
                <p>To avoid losing cascading marks in a large exam question, always follow this strict order:</p>
                <div className="bg-slate-800 p-4 rounded-lg my-4">
                  <ol className="list-decimal list-inside space-y-2 font-medium text-slate-200">
                    <li>State the Gross Pay.</li>
                    <li>Calculate National Insurance.</li>
                    <li>Calculate the Pension Contribution.</li>
                    <li>Calculate the Taxable Income (Gross Pay - Pension).</li>
                    <li>Calculate Income Tax using the tax bands.</li>
                    <li>Calculate any Student Loan or other fixed deductions.</li>
                    <li className="text-emerald-400 mt-4 pt-2 border-t border-slate-700">Net Pay = Gross Pay - (NI + Pension + Tax + Student Loan).</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "deductions-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Student Loan Deductions</strong></p>
                <p>Fraser has graduated from university and earns a gross annual salary of &pound;33,600. His student loan repayments are calculated at 9% of any amount he earns above the monthly threshold of &pound;2,038.</p>
                <p className="mt-2">Calculate Fraser's monthly student loan deduction.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Calculate monthly gross pay:</strong> &pound;33,600 &divide; 12 = &pound;2,800.</li>
                  <li><strong>Find the amount earned above the threshold:</strong> &pound;2,800 - &pound;2,038 = &pound;762.</li>
                  <li><strong>Calculate 9% of this amount:</strong> 0.09 &times; &pound;762 = &pound;68.58.</li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Fraser's monthly student loan deduction is &pound;68.58.</p>
              </div>
            )
          },
          {
            id: "deductions-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Pension Contributions (Employee vs. Employer)</strong></p>
                <p>Gemma earns &pound;48,000 per year. She contributes 5.5% of her gross monthly salary into a private pension. Her employer also contributes 4.5% of her gross monthly salary into the same pension.</p>
                <p className="mt-2">Calculate the total amount of money added to Gemma's pension fund over a 6-month period.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Calculate monthly gross pay:</strong> &pound;48,000 &divide; 12 = &pound;4,000.</li>
                  <li><strong>Calculate Gemma's contribution:</strong> 0.055 &times; &pound;4,000 = &pound;220.</li>
                  <li><strong>Calculate the employer's contribution:</strong> 0.045 &times; &pound;4,000 = &pound;180.</li>
                  <li><strong>Total monthly addition:</strong> &pound;220 + &pound;180 = &pound;400.</li>
                  <li><strong>Total over 6 months:</strong> &pound;400 &times; 6 = &pound;2,400.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-400 italic">Note: Only Gemma's &pound;220 would be deducted from her own net pay.</p>
              </div>
            )
          },
          {
            id: "deductions-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The Full Net Pay Calculation (Exam Style)</strong></p>
                <p>Nadir is an architect earning a gross annual salary of &pound;45,000. He pays 6% of his gross annual salary into a workplace pension. Using the 2025/26 tax year bands, calculate Nadir's net monthly pay.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Follow the strict checklist carefully:</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-white">1. Gross Monthly Pay:</p>
                    <p className="ml-4">&pound;45,000 &divide; 12 = &pound;3,750.</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-white">2. National Insurance (Monthly):</p>
                    <p className="ml-4 text-sm text-slate-400">Nadir earns &pound;3,750, which falls into the 8% band (&pound;1,048 to &pound;4,189).</p>
                    <ul className="list-disc list-inside ml-8 space-y-1">
                      <li>Amount in band: &pound;3,750 - &pound;1,048 = &pound;2,702.</li>
                      <li>NI Contribution: 0.08 &times; &pound;2,702 = &pound;216.16.</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-white">3. Pension Contribution (Monthly):</p>
                    <p className="ml-4">0.06 &times; &pound;3,750 = &pound;225.00.</p>
                  </div>

                  <div>
                    <p className="font-semibold text-white">4. Taxable Income (Annual):</p>
                    <ul className="list-disc list-inside ml-8 space-y-1">
                      <li>Annual Pension: 0.06 &times; &pound;45,000 = &pound;2,700.</li>
                      <li>Taxable Income: &pound;45,000 - &pound;2,700 = &pound;42,300.</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-white">5. Income Tax (Annual -&gt; Monthly):</p>
                    <p className="ml-4 text-sm text-slate-400">Use the 2025/26 Scottish Tax Bands on the &pound;42,300 taxable income.</p>
                    <ul className="list-none space-y-1 ml-8">
                      <li>Starter Rate (19%): &pound;15,397 - &pound;12,570 = &pound;2,827. Tax: 0.19 &times; &pound;2,827 = &pound;537.13.</li>
                      <li>Basic Rate (20%): &pound;27,491 - &pound;15,397 = &pound;12,094. Tax: 0.20 &times; &pound;12,094 = &pound;2,418.80.</li>
                      <li>Intermediate Rate (21%): &pound;42,300 - &pound;27,491 = &pound;14,809. Tax: 0.21 &times; &pound;14,809 = &pound;3,109.89.</li>
                    </ul>
                    <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                      <li>Total Annual Tax: &pound;537.13 + &pound;2,418.80 + &pound;3,109.89 = &pound;6,065.82.</li>
                      <li>Monthly Tax: &pound;6,065.82 &divide; 12 = &pound;505.49 (rounded to nearest penny).</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-white">6. Final Net Monthly Pay:</p>
                    <p className="ml-4"><InlineMath math="\text{Net Pay} = \text{Gross Monthly} - (\text{NI} + \text{Pension} + \text{Tax})" /></p>
                    <p className="ml-4"><InlineMath math="\text{Net Pay} = \text{\pounds}3,750 - (\text{\pounds}216.16 + \text{\pounds}225.00 + \text{\pounds}505.49)" /></p>
                    <p className="ml-4 font-semibold text-emerald-300"><InlineMath math="\text{Net Pay} = \text{\pounds}3,750 - \text{\pounds}946.65 = \text{\pounds}2,803.35" />.</p>
                  </div>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "other-taxes",
        title: "Other Taxes",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              While Income Tax and National Insurance are deducted automatically from a person's payslip, there are several other taxes that individuals must manage and pay themselves, either regularly or on an occasional basis.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Value Added Tax (VAT)</h4>
                <p>VAT is a tax applied to the purchase of most goods and services.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>The standard rate of VAT in the UK is 20%. Some essential or child-related items have a reduced rate (e.g., 5%), while others have no VAT at all.</li>
                </ul>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">The Classic SQA Trap:</p>
                  <p className="text-amber-100/80">
                    To find a price before 20% VAT was added, you <strong>cannot</strong> simply subtract 20% from the final price. The final price represents 120%. You must divide by 1.20 to work backwards.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Property Sales Taxes</h4>
                <p>When purchasing a property, the buyer must pay a tax to the government. It can amount to many thousands of pounds.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>In Scotland, this is called <strong>LBTT</strong> (Land and Buildings Transaction Tax).</li>
                  <li>In the rest of the UK, it is called <strong>SDLT</strong> (Stamp Duty Land Tax).</li>
                  <li>Like Income Tax, property taxes are calculated using a progressive band system depending on the purchase price of the house.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Council Tax</h4>
                <p>
                  This is a tax paid by residents to their local council to fund services like rubbish collection, street lighting, schools, and libraries.
                </p>
                <p className="mt-2">
                  The amount you pay depends on your property's "Band", which is bizarrely based on what the property was valued at on the 1st of April 1991.
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Discounts:</strong> If an adult lives entirely alone, they are legally entitled to a 25% discount on their council tax bill. Full-time students are often exempt from paying.</li>
                  <li><strong>Payment Schedules:</strong> Unlike most bills which are spread over 12 months, many councils divide the annual council tax bill into exactly 10 monthly payments (typically from March to December).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. Vehicle Tax</h4>
                <p>This is an annual tax paid to keep a vehicle on the road.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>When a car is first registered, the tax can be anywhere from &pound;10 to nearly &pound;6,000 depending entirely on the vehicle's CO<sub>2</sub> emissions.</li>
                  <li>In subsequent years, most standard cars revert to a flat annual rate (e.g., &pound;195).</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "other-taxes-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Reversing VAT (Working Backwards)</strong></p>
                <p>A couple purchases a new washing machine for &pound;432. This price includes the standard UK VAT rate of 20%.</p>
                <p className="mt-2">Calculate the price of the washing machine before the VAT was added.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Because VAT has already been added, the &pound;432 represents 120% of the original price.</p>
                <p>To find the original price (100%), we divide by the multiplier:</p>
                <p className="ml-4 font-semibold text-emerald-300">&pound;432 &divide; 1.20 = &pound;360.</p>
              </div>
            )
          },
          {
            id: "other-taxes-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Council Tax Discounts and Schedules</strong></p>
                <p>Liam moves into a Band C flat in Perth. The standard annual council tax charge for a Band C property in his area is &pound;1,340. Liam lives alone, meaning he is entitled to a 25% single-person discount. The council requires the bill to be paid over 10 equal monthly instalments.</p>
                <p className="mt-2">Calculate the amount Liam must pay for his council tax each month.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1"><strong>Calculate the discounted annual bill:</strong></p>
                  <p className="ml-4">If he gets a 25% discount, he pays 75% of the bill. &pound;1,340 &times; 0.75 = &pound;1,005.</p>
                  <p className="ml-4 text-sm text-slate-400 italic">(Alternatively: 1340 &times; 0.25 = 335. Then 1340 - 335 = 1005).</p>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate the 10-month instalment:</strong></p>
                  <p className="ml-4">&pound;1,005 &divide; 10 = &pound;100.50 per month.</p>
                </div>
              </div>
            )
          },
          {
            id: "other-taxes-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Property Tax Terminology</strong></p>
                <p>Morag is buying a new 3-bedroom house in Edinburgh for &pound;285,000. Her sister, Chloe, is buying an identical house for &pound;285,000 just over the border in Carlisle, England.</p>
                <p className="mt-2">State the exact name of the property tax that each sister will be legally required to pay.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Morag</strong> (buying in Scotland) will pay <strong>LBTT</strong> (Land and Buildings Transaction Tax).</li>
                  <li><strong>Chloe</strong> (buying in England) will pay <strong>SDLT</strong> (Stamp Duty Land Tax).</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "multipliers-and-interest",
        title: "Multipliers & Interest",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Before you can tackle complex financial questions, you must be completely comfortable converting percentages into decimals and using multipliers. A multiplier allows you to calculate a percentage increase or decrease in a single step on your calculator.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Constructing a Multiplier</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>For an increase:</strong> Add the percentage to 100%, then divide by 100 to make it a decimal. (Example: A 4.5% increase means you now have 104.5%. The multiplier is 1.045).</li>
                  <li><strong>For a decrease:</strong> Subtract the percentage from 100%, then divide by 100. (Example: A 12% decrease means you retain 88%. The multiplier is 0.88).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Core Financial Terminology</h4>
                <p>You must be familiar with the specific language used in Higher Applications exam questions:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Capital:</strong> The initial, original amount of money that is either invested into savings or borrowed as a loan.</li>
                  <li><strong>Interest:</strong> The money earned as a reward for saving, or the extra fee charged as the cost of borrowing money.</li>
                  <li><strong>Effective Rate of Interest (ERI):</strong> This is the equivalent interest rate for a specified period of time (e.g., per month, per year) regardless of how frequently the interest is actually applied or if the rate varies during that time.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Successive Percentage Changes</h4>
                <p>
                  If an amount of money experiences multiple different percentage changes over time, you do not need to calculate them one by one.
                </p>
                <p className="mt-2 text-indigo-300 font-semibold">
                  You can find the final balance by taking the starting capital and simply multiplying it by a continuous chain of multipliers in one single calculation.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "multipliers-and-interest-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Generating Multipliers</strong></p>
                <p>Write down the exact decimal multiplier required to calculate the following changes in a single step:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>(a) An increase of 7.2%</li>
                  <li>(b) An increase of 0.85%</li>
                  <li>(c) A decrease of 16%</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>(a)</strong> <InlineMath math="100\% + 7.2\% = 107.2\%" />. Multiplier = <strong>1.072</strong>.</li>
                  <li><strong>(b)</strong> <InlineMath math="100\% + 0.85\% = 100.85\%" />. Multiplier = <strong>1.0085</strong>.</li>
                  <li><strong>(c)</strong> <InlineMath math="100\% - 16\% = 84\%" />. Multiplier = <strong>0.84</strong>.</li>
                </ul>
              </div>
            )
          },
          {
            id: "multipliers-and-interest-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Applying the Effective Rate of Interest (ERI)</strong></p>
                <p>Cameron deposits &pound;3,400 into a new savings account. The account offers an effective rate of interest of 0.4% per month.</p>
                <p className="mt-2">(a) State the multiplier used to calculate the balance of Cameron's account.</p>
                <p>(b) Calculate the exact balance of the account after exactly one month.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1"><strong>(a)</strong> An interest rate always represents an increase to savings.</p>
                  <p className="ml-4"><InlineMath math="100\% + 0.4\% = 100.4\%" />. The multiplier is <strong>1.004</strong>.</p>
                </div>
                <div>
                  <p className="mb-1"><strong>(b)</strong> <InlineMath math="\text{Balance} = \text{\pounds}3400 \times 1.004 = \text{\pounds}3,413.60" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "multipliers-and-interest-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Successive Interest Rates (Chain Multiplication)</strong></p>
                <p>A local charity invests a capital sum of &pound;8,500 into a high-yield savings bond.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>In the first year, the effective rate of interest is 3.1%.</li>
                  <li>In the second year, the effective rate of interest rises to 4.2%.</li>
                  <li>In the third year, the effective rate of interest drops to 1.5%.</li>
                </ul>
                <p className="mt-4">Calculate the total balance of the charity's investment at the end of the 3 years.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We can use a chain of multipliers to calculate the final balance in a single step.</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>Year 1 multiplier = 1.031</li>
                  <li>Year 2 multiplier = 1.042</li>
                  <li>Year 3 multiplier = 1.015</li>
                </ul>
                <div className="mt-4">
                  <p className="ml-4"><InlineMath math="\text{Final Balance} = \text{\pounds}8500 \times 1.031 \times 1.042 \times 1.015" /></p>
                  <p className="ml-4 font-semibold text-emerald-300"><InlineMath math="\text{Final Balance} = \text{\pounds}8500 \times 1.089423... = \text{\pounds}9,260.10" /> (rounded to the nearest penny).</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "interest-varying-time-units",
        title: "Interest - Varying Time Units",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Now that we are comfortable using multipliers for a single percentage change, we can upgrade our approach to handle multiple time periods (compound interest) using a simple formula.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Compound Interest Formula</h4>
                <p>
                  To calculate the final balance of an investment or a loan over multiple time periods, we use the formula:
                </p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <BlockMath math="\text{New Balance} = \text{Original} \times (\text{multiplier})^n" />
                </div>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><InlineMath math="n" /> represents the number of time periods.</li>
                  <li>Because the multiplier is raised to a power, the numbers will grow (or decay) exponentially.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The Golden Rule of Time Units</h4>
                <p>In exam questions, the interest rate will be given for a specific time period (e.g., per month, per year, per quarter).</p>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">Crucial Rule:</p>
                  <p className="text-amber-100/80">
                    You must <strong>always change your time period (<InlineMath math="n" />) to perfectly match the time period of the interest rate</strong>. You <em>cannot</em> change the multiplier to match the time!
                  </p>
                  <p className="text-amber-100/80 mt-2">
                    If the interest rate is <em>per month</em>, but the question asks about 2 years, you must use <InlineMath math="n = 24" />.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Common Time Periods</h4>
                <p>You must be confident converting between the following periods:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Per annum (p.a.) / Per year:</strong> 1 time period per year.</li>
                  <li><strong>Per half-year:</strong> 2 time periods per year (every 6 months).</li>
                  <li><strong>Per quarter:</strong> 4 time periods per year (every 3 months).</li>
                  <li><strong>Per month:</strong> 12 time periods per year.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "interest-time-units-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Years to Months Conversion</strong></p>
                <p>Aidan deposits &pound;4,500 into a new savings account. The account offers an effective rate of interest of 0.35% per month.</p>
                <p className="mt-2">Calculate the exact balance of Aidan's account after exactly 2 years.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> <InlineMath math="100\% + 0.35\% = 100.35\%" />. The multiplier is <strong>1.0035</strong>.</li>
                  <li><strong>Match the time period:</strong> The interest is applied monthly, so we must convert 2 years into months. <InlineMath math="n = 2 \times 12 = 24" /> months.</li>
                  <li><strong>Apply the formula:</strong></li>
                </ul>
                <div className="ml-8 mt-2">
                  <p><InlineMath math="\text{New Balance} = \text{\pounds}4500 \times 1.0035^{24}" /></p>
                  <p className="font-semibold text-emerald-300"><InlineMath math="\text{New Balance} = \text{\pounds}4500 \times 1.08745... = \text{\pounds}4,893.53" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "interest-time-units-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Working with Quarters</strong></p>
                <p>A small business takes out a commercial loan of &pound;18,000 to purchase new equipment. The lender charges an effective rate of interest of 2.4% per quarter.</p>
                <p className="mt-2">If the business makes no repayments, calculate the total amount of interest added to the loan after 3 years.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> <InlineMath math="100\% + 2.4\% = 102.4\%" />. The multiplier is <strong>1.024</strong>.</li>
                  <li><strong>Match the time period:</strong> There are 4 quarters in a year. <InlineMath math="n = 3 \text{ years} \times 4 = 12" /> quarters.</li>
                  <li><strong>Apply the formula:</strong></li>
                </ul>
                <div className="ml-8 mt-2">
                  <p><InlineMath math="\text{New Balance} = \text{\pounds}18000 \times 1.024^{12}" /></p>
                  <p><InlineMath math="\text{New Balance} = \text{\pounds}18000 \times 1.32922... = \text{\pounds}23,926.11" />.</p>
                </div>
                <div>
                  <p className="mb-1"><strong>Calculate the interest only:</strong></p>
                  <p className="ml-4"><InlineMath math="\text{Interest} = \text{Final Balance} - \text{Original Amount}" /></p>
                  <p className="ml-4 font-semibold text-emerald-300"><InlineMath math="\text{Interest} = \text{\pounds}23,926.11 - \text{\pounds}18,000 = \text{\pounds}5,926.11" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "interest-time-units-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Half-Years and Odd Months</strong></p>
                <p>Clara invests &pound;6,250 in a long-term bond that offers an effective rate of interest of 1.85% per half-year.</p>
                <p className="mt-2">Calculate the balance of Clara's investment after exactly 4 years and 6 months.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> <InlineMath math="100\% + 1.85\% = 101.85\%" />. The multiplier is <strong>1.0185</strong>.</li>
                  <li><strong>Match the time period:</strong> A half-year is 6 months. 4 years and 6 months is exactly 4.5 years. Since there are 2 half-years in a single year: <InlineMath math="n = 4.5 \times 2 = 9" /> half-years.</li>
                  <li><strong>Apply the formula:</strong></li>
                </ul>
                <div className="ml-8 mt-2">
                  <p><InlineMath math="\text{New Balance} = \text{\pounds}6250 \times 1.0185^9" /></p>
                  <p className="font-semibold text-emerald-300"><InlineMath math="\text{New Balance} = \text{\pounds}6250 \times 1.17935... = \text{\pounds}7,370.97" />.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "combining-interest-rates",
        title: "Combining Interest Rates",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              In the real world, interest rates rarely stay exactly the same for years at a time. The Bank of England regularly changes the central interest rate, meaning the effective rates of interest on savings accounts and loans will fluctuate over long periods.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The "Chain" Calculation</h4>
                <p>
                  To calculate the final balance of an account when the interest rate changes, you do not need to calculate each time period separately.
                </p>
                <p className="mt-2">
                  Instead, you can find the accumulated value by multiplying the original principal by a continuous chain of multipliers, each raised to the power of its own specific time period.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center overflow-x-auto">
                  <BlockMath math="\text{Final Balance} = \text{Capital} \times (m_1)^{n_1} \times (m_2)^{n_2} \times \dots" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The "Counting Time" Trap</h4>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">The Classic SQA Trap:</p>
                  <p className="text-amber-100/80">
                    According to your course notes, miscounting the number of months between two dates is one of the most common errors made in these types of questions.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-amber-100/80 space-y-1">
                    <li>You must take your time to physically count the months or years to ensure your powers (<InlineMath math="n" />) are absolutely correct. For example, the time between 1 March and 1 September is exactly 6 months.</li>
                    <li>Just like in the previous section, the time period you use for your power (<InlineMath math="n" />) must <strong>always perfectly match the time units of the specific interest rate</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "combining-interest-rates-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Combining Years and Half-Years</strong></p>
                <p>Oliver deposits &pound;2,500 into a long-term savings bond. The effective rates of interest on the bond are as follows:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>3.4% per year for the first 2 years.</li>
                  <li>1.6% per half-year for the next 18 months.</li>
                </ul>
                <p className="mt-2">Calculate the accumulated value (balance) of Oliver's bond at the end of the 3.5 year period.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1"><strong>First Period (Years):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Multiplier: <InlineMath math="100\% + 3.4\% = 103.4\% \rightarrow 1.034" />.</li>
                    <li>Time (<InlineMath math="n" />): The rate is per year, and the duration is 2 years, so <InlineMath math="n = 2" />.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Second Period (Half-Years):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Multiplier: <InlineMath math="100\% + 1.6\% = 101.6\% \rightarrow 1.016" />.</li>
                    <li>Time (<InlineMath math="n" />): The rate is per half-year. 18 months is exactly 1.5 years, which contains 3 half-years, so <InlineMath math="n = 3" />.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Chain Calculation:</strong></p>
                  <p className="ml-4"><InlineMath math="\text{Final Balance} = \text{\pounds}2500 \times 1.034^2 \times 1.016^3" /></p>
                  <p className="ml-4 font-semibold text-emerald-300"><InlineMath math="\text{Final Balance} = \text{\pounds}2500 \times 1.069156 \times 1.04877... = \text{\pounds}2,802.73" /> (rounded to the nearest penny).</p>
                </div>
              </div>
            )
          },
          {
            id: "combining-interest-rates-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Counting Months and Quarters</strong></p>
                <p>Aisha takes out a business loan of &pound;4,200 on 1 May 2023. She makes no repayments. The lender applies the following effective rates of interest:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>0.8% per month between 1 May 2023 and 1 November 2023.</li>
                  <li>2.5% per quarter from 1 November 2023 to 1 August 2024.</li>
                </ul>
                <p className="mt-2">Calculate the amount Aisha owes on 1 August 2024.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1"><strong>First Period (Months):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Multiplier: <InlineMath math="100\% + 0.8\% = 100.8\% \rightarrow 1.008" />.</li>
                    <li>Time (<InlineMath math="n" />): Counting carefully from 1 May to 1 November is exactly 6 months. So, <InlineMath math="n = 6" />.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Second Period (Quarters):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Multiplier: <InlineMath math="100\% + 2.5\% = 102.5\% \rightarrow 1.025" />.</li>
                    <li>Time (<InlineMath math="n" />): Counting carefully from 1 Nov 2023 to 1 Aug 2024 is exactly 9 months. Since there are 3 months in a quarter, 9 months is exactly 3 quarters. So, <InlineMath math="n = 3" />.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>Chain Calculation:</strong></p>
                  <p className="ml-4"><InlineMath math="\text{Amount Owed} = \text{\pounds}4200 \times 1.008^6 \times 1.025^3" /></p>
                  <p className="ml-4 font-semibold text-emerald-300"><InlineMath math="\text{Amount Owed} = \text{\pounds}4200 \times 1.04897... \times 1.07689... = \text{\pounds}4,744.40" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "combining-interest-rates-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Calculating an Overall Effective Rate</strong></p>
                <p>The effective rate of interest on a financial product is:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>5.2% per year for the first year.</li>
                  <li>0.45% per month for the second year.</li>
                </ul>
                <p className="mt-2">Calculate the overall effective rate of interest for the entire two-year period, giving your answer as a percentage to two decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>To find the overall effective rate, we multiply the multipliers for the entire period together. (Tip: You can imagine you are investing exactly &pound;1 to make this easier to visualise).</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>Year 1 Multiplier:</strong> 1.052 (<InlineMath math="n = 1" />).</li>
                  <li><strong>Year 2 Multiplier:</strong> 1.0045 (<InlineMath math="n = 12" />, because it is a monthly rate for a full year).</li>
                </ul>
                <div>
                  <p className="mb-1"><strong>Combine Multipliers:</strong></p>
                  <p className="ml-4"><InlineMath math="\text{Overall Multiplier} = 1.052 \times 1.0045^{12}" /></p>
                  <p className="ml-4"><InlineMath math="\text{Overall Multiplier} = 1.052 \times 1.055356... = 1.11023..." /></p>
                </div>
                <div>
                  <p className="mb-1"><strong>Convert Back to Percentage:</strong></p>
                  <p className="ml-4"><InlineMath math="1.11023... - 1 = 0.11023..." /></p>
                  <p className="ml-4"><InlineMath math="0.11023... \times 100 = 11.02\%" />.</p>
                  <p className="mt-2 font-semibold text-emerald-300">The overall effective rate of interest for the two years is 11.02%.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "accumulation-calculations",
        title: "Accumulation Calculations (Regular Payments)",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              When a person makes regular payments into a savings account (e.g., depositing &pound;100 on the 1st of every month), you cannot simply add the payments together and calculate the interest at the end. Because the deposits are made at different times, each deposit sits in the account earning interest for a different length of time.
            </p>
            <p>
              To calculate the final accumulated balance, you can choose between two valid mathematical methods. The SQA awards full marks for both, so you should use the one that makes the most logical sense to you.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">Method 1: The Chronological Method (Payment Tracking)</h4>
                <p>This is often the safest method to avoid getting confused by dates. You track the balance of the account sequentially from one payment to the next.</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>Take the first deposit.</li>
                  <li>Calculate the interest it earns up until the exact moment the next deposit is made.</li>
                  <li>Add the new deposit to the running total.</li>
                  <li>Calculate the interest on this new combined balance up to the next deposit, and repeat.</li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">Method 2: The Individual Accumulation Method</h4>
                <p>This method treats every single deposit as its own separate "mini-investment".</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>Calculate exactly how much time Deposit 1 spends in the account, and calculate its final value.</li>
                  <li>Calculate exactly how much time Deposit 2 spends in the account, and calculate its final value.</li>
                  <li>Repeat for all deposits, and then add all the final values together at the very end.</li>
                </ol>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <p className="font-semibold text-amber-300 mb-1">Crucial Exam Trap:</p>
                <p className="text-amber-100/80">
                  Always read the final sentence of the question carefully! You must check whether you are calculating the balance <strong>immediately after</strong> the final payment is made (meaning the final payment earns zero interest), or <strong>some time after</strong> the final payment (meaning the final payment also earns interest).
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "accumulation-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Basic Regular Payments (Chronological Method)</strong></p>
                <p>Liam deposits &pound;400 into a savings account on 1 January 2024, 1 January 2025, and 1 January 2026. The account pays an effective rate of interest of 3.5% per year.</p>
                <p className="mt-2">Calculate the balance of Liam's account on 1 January 2026, immediately after he makes his final deposit.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We will use the Chronological Method to track the balance year by year.</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>1 Jan 2024:</strong> Balance = &pound;400.</li>
                  <li><strong>1 Jan 2025 (Before deposit):</strong> The &pound;400 earns one year of interest. <InlineMath math="\text{\pounds}400 \times 1.035 = \text{\pounds}414" />.</li>
                  <li><strong>1 Jan 2025 (After deposit):</strong> Liam deposits another &pound;400. <InlineMath math="\text{\pounds}414 + \text{\pounds}400 = \text{\pounds}814" />.</li>
                  <li><strong>1 Jan 2026 (Before deposit):</strong> The &pound;814 earns one year of interest. <InlineMath math="\text{\pounds}814 \times 1.035 = \text{\pounds}842.49" />.</li>
                  <li><strong>1 Jan 2026 (After deposit):</strong> Liam makes his final &pound;400 deposit. <InlineMath math="\text{\pounds}842.49 + \text{\pounds}400 = \text{\pounds}1,242.49" />.</li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Final Balance = &pound;1,242.49</p>
              </div>
            )
          },
          {
            id: "accumulation-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Varying Interest Rates (Individual Accumulation Method)</strong></p>
                <p>Nadia deposits &pound;150 into a new savings account on 1 March, 1 April, and 1 May. The account has the following effective rates of interest:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>0.5% per month for March and April.</li>
                  <li>0.8% per month from 1 May onwards.</li>
                </ul>
                <p className="mt-2">Calculate the balance of Nadia's account on 1 June.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We will use the Individual Accumulation Method, tracking how long each specific &pound;150 deposit sits in the account before 1 June.</p>
                <ul className="list-none space-y-3 ml-4">
                  <li>
                    <strong>The 1 March Deposit:</strong> Sits for 2 months at 0.5% (March, April) and 1 month at 0.8% (May).<br/>
                    Value = <InlineMath math="\text{\pounds}150 \times 1.005^2 \times 1.008 = \text{\pounds}152.715..." />
                  </li>
                  <li>
                    <strong>The 1 April Deposit:</strong> Sits for 1 month at 0.5% (April) and 1 month at 0.8% (May).<br/>
                    Value = <InlineMath math="\text{\pounds}150 \times 1.005 \times 1.008 = \text{\pounds}151.956" />
                  </li>
                  <li>
                    <strong>The 1 May Deposit:</strong> Sits for 1 month at 0.8% (May).<br/>
                    Value = <InlineMath math="\text{\pounds}150 \times 1.008 = \text{\pounds}151.20" />
                  </li>
                  <li>
                    <strong>Total Balance:</strong> Add the three individual values together.<br/>
                    <InlineMath math="\text{\pounds}152.715... + \text{\pounds}151.956 + \text{\pounds}151.20 = \text{\pounds}455.87" /> (rounded to nearest penny).
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "accumulation-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Mixed Time Units (Exam Style)</strong></p>
                <p>A charity sets up a fund, depositing &pound;1,000 on 1 January 2023, 1 January 2024, and 1 January 2025. The effective rate of interest on the fund is:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>4.2% per year during 2023.</li>
                  <li>1.1% per quarter during 2024 and 2025.</li>
                </ul>
                <p className="mt-2">Calculate the accumulated value of the fund on 1 January 2026.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We will use the Chronological Method. Keep the long decimals on your calculator screen and do not round prematurely!</p>
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>1 Jan 2023:</strong> Balance = &pound;1,000.</li>
                  <li>
                    <strong>1 Jan 2024 (After 1 year at 4.2%):</strong> (<InlineMath math="\text{\pounds}1000 \times 1.042" />) = &pound;1042.<br/>
                    Add the new deposit: <InlineMath math="\text{\pounds}1042 + \text{\pounds}1000 = \text{\pounds}2042" />.
                  </li>
                  <li>
                    <strong>1 Jan 2025 (After 4 quarters at 1.1%):</strong> (<InlineMath math="\text{\pounds}2042 \times 1.011^4" />) = &pound;2133.3503...<br/>
                    Add the new deposit: <InlineMath math="\text{\pounds}2133.3503... + \text{\pounds}1000 = \text{\pounds}3133.3503..." />
                  </li>
                  <li>
                    <strong>1 Jan 2026 (After 4 quarters at 1.1%):</strong> (<InlineMath math="\text{\pounds}3133.3503... \times 1.011^4" />) = &pound;3,273.50.
                  </li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Final Balance = &pound;3,273.50</p>
              </div>
            )
          }
        ]
      },
      {
        id: "accumulation-irregular",
        title: "Accumulation - Irregular Payments and Withdrawals",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Real-world finances are rarely as perfectly structured as a regular monthly deposit. People receive unexpected bonuses, make emergency withdrawals, and borrow additional funds.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Chronological Method (Payment Tracking)</h4>
                <p>
                  When dealing with irregular payments and withdrawals, the "Individual Accumulation Method" from the previous section becomes highly complicated and prone to error.
                </p>
                <p className="mt-2 font-semibold text-emerald-300">
                  Instead, you should always use the Chronological Method (Payment Tracking).
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Strategy:</strong> Treat the timeline like a stepping-stone path. You must calculate the interest to move the balance forward from one specific transaction date to the exact date of the next transaction, stop, adjust the balance, and then calculate the next "step".</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Handling Withdrawals and Repayments</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Savings:</strong> A deposit is <em>added</em> to the balance. A withdrawal is <em>subtracted</em> from the balance.</li>
                  <li><strong>Loans:</strong> Borrowing more money is <em>added</em> to the total debt. A repayment is <em>subtracted</em> from the total debt.</li>
                </ul>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">Crucial Rule:</p>
                  <p className="text-amber-100/80">
                    Never add or subtract a transaction amount until you have <strong>completely finished calculating the interest up to that specific date</strong>!
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. The Rate Change Trap</h4>
                <p>
                  Sometimes, an interest rate will change on a date when no transaction takes place.
                </p>
                <p className="mt-2">
                  You must still treat this rate change as a "stepping-stone" on your timeline. Calculate the interest up to the date of the change, note the new balance, and then continue forward using the new rate.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "accumulation-irregular-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Irregular Deposits and Withdrawals (Consistent Rate)</strong></p>
                <p>Amira has a savings account that offers an effective rate of interest of 0.4% per month. She makes the following transactions:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>1 February: Deposits &pound;800</li>
                  <li>1 June: Deposits &pound;300</li>
                  <li>1 September: Withdraws &pound;250</li>
                </ul>
                <p className="mt-2">Calculate the exact balance of Amira's account on 1 November of the same year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We will track the balance chronologically from transaction to transaction. The multiplier is <InlineMath math="100\% + 0.4\% = 1.004" />.</p>
                <ul className="list-none space-y-3 ml-4">
                  <li>
                    <strong>1 Feb to 1 June (4 months):</strong> <InlineMath math="\text{\pounds}800 \times 1.004^4 = \text{\pounds}812.87..." /><br/>
                    Add 1 June deposit: <InlineMath math="\text{\pounds}812.87... + \text{\pounds}300 = \text{\pounds}1,112.87..." />
                  </li>
                  <li>
                    <strong>1 June to 1 Sept (3 months):</strong> <InlineMath math="\text{\pounds}1112.87... \times 1.004^3 = \text{\pounds}1126.28..." /><br/>
                    Subtract 1 Sept withdrawal: <InlineMath math="\text{\pounds}1126.28... - \text{\pounds}250 = \text{\pounds}876.28..." />
                  </li>
                  <li>
                    <strong>1 Sept to 1 Nov (2 months):</strong> <InlineMath math="\text{\pounds}876.28... \times 1.004^2 = \text{\pounds}883.31" /> (rounded to nearest penny).
                  </li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Final Balance = &pound;883.31</p>
              </div>
            )
          },
          {
            id: "accumulation-irregular-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Loan Repayments and Additional Borrowing</strong></p>
                <p>A small business takes out a commercial loan. The lender charges an effective rate of interest of 1.2% per quarter. The business makes the following transactions:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>1 January 2024: Borrows &pound;5,000</li>
                  <li>1 July 2024: Repays &pound;1,500</li>
                  <li>1 April 2025: Borrows an additional &pound;2,000</li>
                </ul>
                <p className="mt-2">Calculate the total amount the business owes on 1 October 2025.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>The multiplier is <InlineMath math="100\% + 1.2\% = 1.012" />. We must count the quarters carefully.</p>
                <ul className="list-none space-y-3 ml-4">
                  <li>
                    <strong>1 Jan 2024 to 1 July 2024 (2 quarters):</strong> <InlineMath math="\text{\pounds}5000 \times 1.012^2 = \text{\pounds}5120.72" /><br/>
                    Subtract 1 July repayment: <InlineMath math="\text{\pounds}5120.72 - \text{\pounds}1500 = \text{\pounds}3,620.72" />
                  </li>
                  <li>
                    <strong>1 July 2024 to 1 April 2025 (3 quarters):</strong> (July-&gt;Oct, Oct-&gt;Jan, Jan-&gt;Apr)<br/>
                    <InlineMath math="\text{\pounds}3620.72 \times 1.012^3 = \text{\pounds}3752.54..." /><br/>
                    Add 1 April borrowing: <InlineMath math="\text{\pounds}3752.54... + \text{\pounds}2000 = \text{\pounds}5,752.54..." />
                  </li>
                  <li>
                    <strong>1 April 2025 to 1 October 2025 (2 quarters):</strong><br/>
                    <InlineMath math="\text{\pounds}5752.54... \times 1.012^2 = \text{\pounds}5,891.41" />.
                  </li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Amount Owed = &pound;5,891.41</p>
              </div>
            )
          },
          {
            id: "accumulation-irregular-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Interest Rate Changes (Exam Style)</strong></p>
                <p>Marcus pays &pound;2,000 into a new savings account on 1 May 2024. The bank offers an effective rate of interest of 0.3% per month. On 1 September 2024, the bank changes the interest rate to 1.5% per quarter. Marcus deposits a further &pound;500 into the account on 1 December 2024.</p>
                <p className="mt-2">Calculate the balance of Marcus's account on 1 March 2025.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Even though no money is deposited or withdrawn on 1 September, we must stop and calculate the balance on that date because the interest rate changes.</p>
                <ul className="list-none space-y-3 ml-4">
                  <li>
                    <strong>1 May to 1 Sept (4 months at 0.3%):</strong><br/>
                    Multiplier: 1.003. Time: <InlineMath math="n = 4" />.<br/>
                    Balance on 1 Sept: <InlineMath math="\text{\pounds}2000 \times 1.003^4 = \text{\pounds}2,024.108..." />
                  </li>
                  <li>
                    <strong>1 Sept to 1 Dec (1 quarter at 1.5%):</strong><br/>
                    Multiplier: 1.015. Time: <InlineMath math="n = 1" />.<br/>
                    <InlineMath math="\text{\pounds}2024.108... \times 1.015^1 = \text{\pounds}2054.469..." /><br/>
                    Add 1 Dec deposit: <InlineMath math="\text{\pounds}2054.469... + \text{\pounds}500 = \text{\pounds}2,554.469..." />
                  </li>
                  <li>
                    <strong>1 Dec to 1 March (1 quarter at 1.5%):</strong><br/>
                    Multiplier: 1.015. Time: <InlineMath math="n = 1" />.<br/>
                    Final Balance: <InlineMath math="\text{\pounds}2554.469... \times 1.015^1 = \text{\pounds}2,592.79" />.
                  </li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Final Balance = &pound;2,592.79</p>
              </div>
            )
          }
        ]
      },
      {
        id: "converting-time-frequencies",
        title: "Converting Between Time Frequencies",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Often in finance, you will be given an interest rate for one time period (e.g., an annual rate) but you will need to apply it to a completely different time period (e.g., monthly payments). You must convert the interest rate to match the payment frequency.
            </p>

            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">1. The Division Trap (A Major SQA Warning)</h4>
                <p className="text-amber-100/80">
                  You <strong>cannot simply divide</strong> an annual interest rate by 12 to find the monthly rate.
                </p>
                <p className="text-amber-100/80 mt-2">
                  Because of the effects of compound interest, dividing by 12 will give you an incorrect, slightly larger number. The SQA examiners reported this as a highly common mistake.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Scaling Up (Smaller to Larger Time Periods)</h4>
                <p>If you have a monthly rate and need an annual rate, you use the standard compounding formula: <InlineMath math="(\text{Multiplier})^n" />.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Example:</strong> To convert a monthly rate to an annual rate, you raise the monthly multiplier to the power of 12.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Scaling Down (Larger to Smaller Time Periods)</h4>
                <p>If you have an annual rate and need a monthly rate, you must do the mathematical reverse, using a fractional power: <InlineMath math="(\text{Multiplier})^{\frac{1}{n}}" />.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Example:</strong> To convert an annual rate to a monthly rate, you raise the annual multiplier to the power of <InlineMath math="\frac{1}{12}" />.</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">4. The Calculator Syntax Trap</h4>
                <p className="text-amber-100/80">
                  When scaling down using a fractional power on your calculator, you <strong>must put brackets around the fraction</strong> (e.g., <code>^(1/12)</code>).
                </p>
                <p className="text-amber-100/80 mt-2">
                  If you type <code>^1/12</code> without brackets, your calculator will raise the number to the power of 1, and then divide the whole answer by 12, resulting in zero marks.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "converting-time-frequencies-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Scaling Up (Monthly to Annual)</strong></p>
                <p>A credit card company charges an effective rate of interest of 1.4% per month. Calculate the equivalent effective annual rate of interest.</p>
                <p className="mt-2">Give your answer as a percentage to two decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the monthly multiplier:</strong> <InlineMath math="100\% + 1.4\% = 101.4\% \rightarrow 1.014" />.</li>
                  <li><strong>Scale up to a year:</strong> There are 12 months in a year, so we raise it to the power of 12.<br/>
                  <InlineMath math="1.014^{12} = 1.18155..." />
                  </li>
                  <li><strong>Convert back to a percentage:</strong><br/>
                  <InlineMath math="1.18155... - 1 = 0.18155..." /><br/>
                  <InlineMath math="0.18155... \times 100 = 18.16\%" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "converting-time-frequencies-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Scaling Down (Annual to Monthly)</strong></p>
                <p>A Help-to-Buy ISA offers an effective rate of interest of 5.2% per year. Calculate the equivalent effective monthly rate of interest.</p>
                <p className="mt-2">Give your answer as a percentage to two decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the annual multiplier:</strong> <InlineMath math="100\% + 5.2\% = 105.2\% \rightarrow 1.052" />.</li>
                  <li><strong>Scale down to a month:</strong> We want 1 month out of the 12 in a year, so we use the power of <InlineMath math="\frac{1}{12}" />.<br/>
                  <InlineMath math="1.052^{\left(\frac{1}{12}\right)} = 1.00423..." />
                  </li>
                  <li><strong>Convert back to a percentage:</strong><br/>
                  <InlineMath math="1.00423... - 1 = 0.00423..." /><br/>
                  <InlineMath math="0.00423... \times 100 = 0.42\%" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "converting-time-frequencies-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Extreme Scaling (Payday Loans)</strong></p>
                <p>Fiona is considering using a short-term payday loan company to borrow &pound;400. The company advertises a seemingly small interest rate of just 0.9% per day.</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>(a) Calculate the equivalent effective annual rate of interest Fiona faces.</li>
                  <li>(b) If Fiona makes no repayments, calculate the total amount she will owe after exactly one year (365 days).</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1"><strong>(a)</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Daily Multiplier: <InlineMath math="100\% + 0.9\% = 100.9\% \rightarrow 1.009" />.</li>
                    <li>Scale up to a year (365 days): <InlineMath math="1.009^{365} = 26.402..." /></li>
                    <li>Convert to percentage: <InlineMath math="(26.402... - 1) \times 100 = 2540.24\%" /> <br/><span className="text-sm text-slate-400 italic">(Payday loans scale up to thousands of percent!)</span></li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>(b)</strong></p>
                  <p className="ml-4"><InlineMath math="\text{Final Balance} = \text{Capital} \times \text{Annual Multiplier}" /></p>
                  <p className="ml-4 font-semibold text-emerald-300"><InlineMath math="\text{Final Balance} = \text{\pounds}400 \times 26.402... = \text{\pounds}10,560.91" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "converting-time-frequencies-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Intermediate Conversions (Half-Year to Month)</strong></p>
                <p>A premium savings bond offers an effective rate of interest of 2.75% per half-year.</p>
                <p className="mt-2">Calculate the equivalent effective monthly rate of interest.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the half-year multiplier:</strong> <InlineMath math="100\% + 2.75\% = 102.75\% \rightarrow 1.0275" />.</li>
                  <li><strong>Scale down to a month:</strong> There are 6 months in a half-year. To find the rate for just 1 month, we raise the multiplier to the power of <InlineMath math="\frac{1}{6}" />.<br/>
                  <InlineMath math="1.0275^{\left(\frac{1}{6}\right)} = 1.00453..." />
                  </li>
                  <li><strong>Convert back to a percentage:</strong><br/>
                  <InlineMath math="1.00453... - 1 = 0.00453..." /><br/>
                  <InlineMath math="0.00453... \times 100 = 0.45\%" />.
                  </li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "start-and-end-values",
        title: "Working with Start and End Values",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Sometimes in finance, you will know exactly how much money you started with (the Capital) and exactly how much you ended up with (the Final Balance), but you will <strong>not know the interest rate</strong> that was applied.
            </p>
            <p>
              To find the interest rate, you must use your algebra skills to work backwards and find the hidden multiplier.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Rearranging the Formula</h4>
                <p>We start with our standard compound interest formula: <InlineMath math="\text{Final Balance} = \text{Start Value} \times (\text{Multiplier})^n" /></p>
                <p className="mt-2">To find the multiplier, we reverse the process in two steps:</p>
                <ul className="list-none space-y-2 ml-4 mt-2">
                  <li><strong>Step 1 (Divide):</strong> <InlineMath math="\text{Multiplier}^n = \frac{\text{Final Balance}}{\text{Start Value}}" /></li>
                  <li><strong>Step 2 (Root/Fractional Power):</strong> <InlineMath math="\text{Multiplier} = \left(\frac{\text{Final Balance}}{\text{Start Value}}\right)^{\frac{1}{n}}" /></li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">2. The Calculator Syntax Trap (Again!)</h4>
                <p className="text-amber-100/80">
                  Just like in Section 11, when you calculate the fractional power on your calculator, you <strong>must put brackets around the fraction</strong> (e.g., <code>^(1/n)</code>).
                </p>
                <p className="text-amber-100/80 mt-2">
                  Once you have the decimal multiplier, do not forget the final step: <strong>subtract 1 and multiply by 100</strong> to convert it back into a percentage interest rate.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Matching the Time Period (<InlineMath math="n" />)</h4>
                <p>The power you use for <InlineMath math="n" /> dictates the specific time period of the interest rate you will find.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>If you want to find an <strong>annual</strong> interest rate, <InlineMath math="n" /> must be the number of years. If the duration is 18 months, you must use <InlineMath math="n = 1.5" /> years.</li>
                  <li>If you want to find a <strong>monthly</strong> interest rate, <InlineMath math="n" /> must be the number of months.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "start-end-values-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Basic Start and End Values (Whole Years)</strong></p>
                <p>An investment of &pound;3,500 grows to a final balance of &pound;3,950 over a period of exactly 4 years.</p>
                <p className="mt-2">Calculate the effective annual rate of interest. Give your answer as a percentage to two decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>Set up the formula:</strong> <InlineMath math="n = 4" /> years.<br/>
                  <InlineMath math="\text{Multiplier}^4 = \frac{3950}{3500}" />
                  </li>
                  <li><strong>Calculate the multiplier:</strong><br/>
                  <InlineMath math="\text{Multiplier} = \left(\frac{3950}{3500}\right)^{\frac{1}{4}}" /><br/>
                  <InlineMath math="\text{Multiplier} = 1.12857...^{\frac{1}{4}} = 1.0307..." />
                  </li>
                  <li><strong>Convert to a percentage:</strong><br/>
                  <InlineMath math="1.0307... - 1 = 0.0307..." /><br/>
                  <InlineMath math="0.0307... \times 100 = 3.07\%" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "start-end-values-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Fractional Years</strong></p>
                <p>A small business deposits &pound;8,200 into a savings bond. After exactly 30 months, the bond matures and returns a final balance of &pound;9,150.</p>
                <p className="mt-2">Calculate the effective annual rate of interest on the bond. Give your answer as a percentage to two decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>Match the time period:</strong> Because we want an annual rate, <InlineMath math="n" /> must be in years. 30 months &divide; 12 = 2.5 years.</li>
                  <li><strong>Set up and solve:</strong><br/>
                  <InlineMath math="\text{Multiplier}^{2.5} = \frac{9150}{8200}" /><br/>
                  <InlineMath math="\text{Multiplier} = \left(\frac{9150}{8200}\right)^{\frac{1}{2.5}}" /><br/>
                  <InlineMath math="\text{Multiplier} = 1.11585...^{\frac{1}{2.5}} = 1.0448..." />
                  </li>
                  <li><strong>Convert to a percentage:</strong><br/>
                  <InlineMath math="1.0448... - 1 = 0.0448..." /><br/>
                  <InlineMath math="0.0448... \times 100 = 4.48\%" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "start-end-values-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Short-Term Monthly Rates</strong></p>
                <p>A student borrows &pound;600 to buy a new laptop. They make no repayments. After 7 months, their total debt has increased to &pound;612.50.</p>
                <p className="mt-2">Calculate the effective monthly rate of interest charged on the debt. Give your answer as a percentage to two decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>Match the time period:</strong> Because we want a monthly rate, <InlineMath math="n" /> must be in months. <InlineMath math="n = 7" />.</li>
                  <li><strong>Set up and solve:</strong><br/>
                  <InlineMath math="\text{Multiplier}^7 = \frac{612.50}{600}" /><br/>
                  <InlineMath math="\text{Multiplier} = \left(\frac{612.50}{600}\right)^{\frac{1}{7}}" /><br/>
                  <InlineMath math="\text{Multiplier} = 1.02083...^{\frac{1}{7}} = 1.00294..." />
                  </li>
                  <li><strong>Convert to a percentage:</strong><br/>
                  <InlineMath math="1.00294... - 1 = 0.00294..." /><br/>
                  <InlineMath math="0.00294... \times 100 = 0.29\%" />.
                  </li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "present-value",
        title: "Present Value (Fixed Interest Rates)",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Often in financial planning, a person will have a specific future savings goal in mind (e.g., saving a deposit for a house or paying for university fees). When we need to find out exactly how much money must be invested <em>today</em> to reach that future target, we are calculating the <strong>Present Value</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Reversing the Formula</h4>
                <p>Because we are working backwards from the end of the timeline to the start, we must perform the exact opposite mathematical operation to our standard accumulation formula.</p>
                <p className="mt-2">Instead of multiplying the capital, we take the final future balance and divide it by the compound multiplier.</p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <BlockMath math="\text{Present Value} = \frac{\text{Future Balance}}{(\text{Multiplier})^n}" />
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">2. The Golden Rule Still Applies</h4>
                <p className="text-amber-100/80">
                  Even though we are working backwards, the "Golden Rule of Time Units" still applies.
                </p>
                <ul className="list-disc list-inside mt-2 text-amber-100/80 space-y-1">
                  <li>The power you use for your time period (<InlineMath math="n" />) must <strong>always perfectly match the time units of the interest rate</strong> you are given.</li>
                  <li>If the rate is per month, <InlineMath math="n" /> must be the total number of months.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "present-value-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Basic Present Value (Years)</strong></p>
                <p>Alistair wants to buy a new car in exactly 3 years' time. He estimates that he will need &pound;8,000. He opens a savings account that offers a fixed effective rate of interest of 4.5% per year.</p>
                <p className="mt-2">Calculate the exact minimum amount Alistair must deposit into the account today to ensure he reaches his &pound;8,000 target.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> <InlineMath math="100\% + 4.5\% = 104.5\% \rightarrow 1.045" />.</li>
                  <li><strong>Match the time period:</strong> The rate is annual, and the time is 3 years. <InlineMath math="n = 3" />.</li>
                  <li><strong>Apply the Present Value formula:</strong><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}8000}{1.045^3}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}8000}{1.141166...} = \text{\pounds}7,010.37" />.
                  </li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Alistair needs to deposit &pound;7,010.37 today.</p>
              </div>
            )
          },
          {
            id: "present-value-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Present Value with Mismatched Time Units</strong></p>
                <p>Bianca wants to save &pound;15,000 to pay for a wedding in 2 years' time. She finds a high-yield savings bond that offers a fixed effective rate of interest of 1.2% per quarter.</p>
                <p className="mt-2">Calculate the amount of money she needs to invest in the bond today to reach her target.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> <InlineMath math="100\% + 1.2\% = 101.2\% \rightarrow 1.012" />.</li>
                  <li><strong>Match the time period:</strong> The rate is per quarter. There are 4 quarters in a year, so over 2 years, <InlineMath math="n = 2 \times 4 = 8" /> quarters.</li>
                  <li><strong>Apply the Present Value formula:</strong><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}15000}{1.012^8}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}15000}{1.100127...} = \text{\pounds}13,634.78" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "present-value-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Working Backwards from Maturity</strong></p>
                <p>A long-term investment bond matured after exactly 42 months, returning a final accumulated balance of &pound;5,420. The bond had a fixed effective rate of interest of 2.15% per half-year.</p>
                <p className="mt-2">Calculate the original amount of money that was invested in the bond.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> <InlineMath math="100\% + 2.15\% = 102.15\% \rightarrow 1.0215" />.</li>
                  <li><strong>Match the time period:</strong> The rate is per half-year (every 6 months). To find how many half-years are in 42 months, we divide by 6. <InlineMath math="n = 42 \div 6 = 7" /> half-years.</li>
                  <li><strong>Apply the Present Value formula:</strong><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}5420}{1.0215^7}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}5420}{1.160677...} = \text{\pounds}4,669.69" />.
                  </li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "present-value-variable",
        title: "Present Value (Variable Interest Rates)",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Calculating the Present Value of an investment becomes slightly more complex when the interest rate changes over the term of the investment. Just as we used a chain of multipliers to accumulate money forward, we can use a chain of division to work backwards.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Reverse Chain Calculation</h4>
                <p>To find the original deposit when there are multiple interest rates, you take the final balance and divide it by the product of all the multipliers.</p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center overflow-x-auto">
                  <BlockMath math="\text{Present Value} = \frac{\text{Future Balance}}{(m_1)^{n_1} \times (m_2)^{n_2} \times \dots}" />
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-emerald-300 mb-1">Exam Tip:</p>
                  <p className="text-emerald-100/80">
                    It is often safer to calculate the bottom line (the chain of multipliers) first, keep the long decimal on your calculator screen, and then perform the final division to avoid rounding errors.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Present Value with Intermediate Transactions</h4>
                <p>This is one of the most challenging question types in the Higher Applications course. If an account has a variable interest rate and the person makes deposits or withdrawals halfway through, you cannot use a single formula.</p>
                <p className="mt-2"><strong>The "Reverse Chronological" Method:</strong> You must work backwards step-by-step from the end date to the start date.</p>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">The Ultimate Trap:</p>
                  <p className="text-amber-100/80">
                    Because you are travelling backwards in time, the effect of transactions is reversed.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-amber-100/80 space-y-1">
                    <li>If someone withdrew money in the past, you must <strong>add it back</strong> onto your running total.</li>
                    <li>If someone deposited money, you must <strong>subtract it</strong> to find the balance before the deposit occurred!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "present-value-variable-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Single Deposit with a Variable Rate</strong></p>
                <p>A single deposit was placed into a 5-year savings bond. After exactly 5 years, the bond matured and returned a final balance of &pound;12,000. The effective rates of interest for the bond were:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>4.0% per year for the first 3 years.</li>
                  <li>1.5% per half-year for the final 2 years.</li>
                </ul>
                <p className="mt-2">Calculate the value of the original deposit.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>First Period (Years):</strong> Multiplier = 1.04. Time = 3 years.</li>
                  <li><strong>Second Period (Half-years):</strong> Multiplier = 1.015. Time = 4 half-years (since 2 years = 4 half-years).</li>
                  <li><strong>Apply the Reverse Chain Formula:</strong><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}12000}{1.04^3 \times 1.015^4}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}12000}{1.124864 \times 1.06136...}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}12000}{1.19389...} = \text{\pounds}10,051.14" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "present-value-variable-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Mismatched Time Units</strong></p>
                <p>After exactly two years, a business has accumulated &pound;4,500 in a corporate savings account from a single initial deposit. The account had an effective rate of interest of:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>0.6% per month during the first year.</li>
                  <li>2.1% per quarter during the second year.</li>
                </ul>
                <p className="mt-2">Calculate the exact amount of money the business originally deposited.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>First Period (Months):</strong> Multiplier = 1.006. Time = 12 months (for the first full year).</li>
                  <li><strong>Second Period (Quarters):</strong> Multiplier = 1.021. Time = 4 quarters (for the second full year).</li>
                  <li><strong>Apply the Reverse Chain Formula:</strong><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}4500}{1.006^{12} \times 1.021^4}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}4500}{1.07442... \times 1.08672...}" /><br/>
                  <InlineMath math="\text{Present Value} = \frac{\text{\pounds}4500}{1.16763...} = \text{\pounds}3,853.96" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "present-value-variable-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The "Reverse Chronological" Method (Transactions)</strong></p>
                <p>Darren holds a savings account. He makes the following transactions:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>1 January 2022: Opens the account with an initial deposit.</li>
                  <li>1 January 2023: Withdraws &pound;500 to pay for car repairs.</li>
                </ul>
                <p className="mt-2">On 1 January 2024, Darren checks his account and sees a final balance of &pound;8,000. The effective rate of interest was 4.0% per year in 2022, and 6.0% per year in 2023.</p>
                <p className="mt-2">Calculate the Present Value (the initial deposit) of Darren's account on 1 January 2022.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We must work backwards from 2024, undoing the interest and reversing the transactions as we travel back in time.</p>
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>Reverse the 2023 Interest (1 Jan 2024 back to 1 Jan 2023):</strong><br/>
                  Balance after withdrawal = <InlineMath math="\frac{\text{\pounds}8000}{1.06} = \text{\pounds}7547.169..." />
                  </li>
                  <li><strong>Reverse the Transaction on 1 Jan 2023:</strong><br/>
                  Because Darren withdrew &pound;500, we must <strong>add it back</strong> to find the balance before he took the money out.<br/>
                  Balance before withdrawal = <InlineMath math="\text{\pounds}7547.169... + \text{\pounds}500 = \text{\pounds}8047.169..." />
                  </li>
                  <li><strong>Reverse the 2022 Interest (1 Jan 2023 back to 1 Jan 2022):</strong><br/>
                  Initial Deposit (PV) = <InlineMath math="\frac{\text{\pounds}8047.169...}{1.04} = \text{\pounds}7,737.66" />.
                  </li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Initial Deposit = &pound;7,737.66</p>
              </div>
            )
          }
        ]
      },
      {
        id: "investment-schedules",
        title: "Accumulation: Investment Schedules",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              When saving for a long-term goal (like retirement or a deposit for a house), making regular monthly payments over many years requires hundreds of repetitive calculations. Instead of doing this manually using the Chronological Method, we use spreadsheet software (like Microsoft Excel) to automate the process by creating an Investment Schedule.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Setting up an Investment Schedule</h4>
                <p>A standard investment schedule tracks the balance of an account period by period. It typically features the following columns:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Time (Months/Years):</strong> The specific time period.</li>
                  <li><strong>Opening Balance:</strong> The amount of money in the account at the start of the period.</li>
                  <li><strong>Interest Earned:</strong> The interest added to the account during that specific period.</li>
                  <li><strong>Deposit:</strong> The regular payment added to the account.</li>
                  <li><strong>Closing Balance:</strong> The final amount at the end of the period (Opening Balance + Interest + Deposit).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The Interest Rate Conversion Formula</h4>
                <p>In spreadsheet tasks, you will frequently be given an annual effective rate of interest, but you will need to calculate a monthly schedule.</p>
                <p className="mt-2">You must instruct the spreadsheet to calculate the monthly rate using a fractional power.</p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center font-mono text-sm text-emerald-300">
                  =(1 + Annual_Rate_Cell)^(1/12) - 1
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Essential Spreadsheet Functions and Syntax</h4>
                <p>To gain full marks in the exam for spreadsheet formulas, you must use the correct syntax:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Absolute Cell References ($):</strong> When you drag a formula down a column, spreadsheet software automatically changes the cell references. To "lock" a reference to a specific cell (like a fixed monthly interest rate or a fixed regular deposit), you must use dollar signs (e.g., <code>$B$2</code>).</li>
                  <li><strong>The ROUND Function:</strong> In finance, money must always be rounded to two decimal places (the nearest penny). When calculating interest, you must use the <code>ROUND</code> function, or your schedule will accumulate hidden fractions of a penny and become inaccurate over time.<br/>
                  <span className="inline-block mt-1 font-mono text-sm text-emerald-300 bg-slate-800 px-2 py-1 rounded">=ROUND(Opening_Balance * $Interest_Rate$, 2)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "investment-schedules-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Time Frequency Conversion in Excel</strong></p>
                <p>Cal opens a savings account that offers an effective rate of interest of 4.2% per annum. He intends to create a monthly investment schedule in a spreadsheet.</p>
                <p className="mt-2">He types his annual interest rate (4.2%) into cell B1. Write down the exact formula Cal should type into cell B2 to calculate the equivalent monthly effective rate of interest.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Cal must add 1 to the annual rate, raise it to the power of 1/12, and then subtract 1.</p>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-emerald-300">
                  =(1+B1)^(1/12)-1
                </div>
              </div>
            )
          },
          {
            id: "investment-schedules-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Writing Spreadsheet Formulae</strong></p>
                <p>A spreadsheet is set up to model a savings account.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Cell B2 contains the monthly effective rate of interest.</li>
                  <li>Cell B3 contains the fixed regular monthly deposit of &pound;150.</li>
                  <li>The schedule begins on row 6.</li>
                  <li>For Month 2 (Row 7), the Opening Balance is in cell C7.</li>
                </ul>
                <div className="mt-4 space-y-2">
                  <p>(a) Write down the formula that should be entered into cell D7 to calculate the interest earned for Month 2.</p>
                  <p>(b) Write down the formula that should be entered into cell F7 to calculate the Closing Balance for Month 2.</p>
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white">Solution (a):</p>
                  <p>We must multiply the opening balance by the interest rate, use absolute references to lock the interest rate cell, and round to 2 decimal places.</p>
                  <div className="bg-slate-800 p-3 rounded-lg font-mono text-emerald-300 mt-2">
                    =ROUND(C7*$B$2, 2)
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-white">Solution (b):</p>
                  <p>The closing balance is the sum of the opening balance, the interest earned, and the fixed regular deposit (locked using absolute references).</p>
                  <div className="bg-slate-800 p-3 rounded-lg font-mono text-emerald-300 mt-2">
                    =C7+D7+$B$3
                  </div>
                  <p className="text-sm text-slate-400 mt-1 italic">(Alternatively, =SUM(C7:D7)+$B$3)</p>
                </div>
              </div>
            )
          },
          {
            id: "investment-schedules-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Manual Schedule Calculation (Exam Style)</strong></p>
                <p>Anika opens a new savings account to save for a deposit on a flat. The account offers an effective rate of interest of 0.35% per month. Anika deposits &pound;400 on the 1st of every month. Interest is calculated and added at the end of the month.</p>
                <p className="mt-2">Complete the investment schedule below to calculate the Closing Balance at the end of Month 2.</p>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-slate-800 border border-slate-700 text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Month</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Opening Balance (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Interest Earned (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Deposit (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Closing Balance (&pound;)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">1</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">0.00</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">0.00</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">400.00</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">400.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300">2</td>
                        <td className="px-4 py-2 text-slate-300">400.00</td>
                        <td className="px-4 py-2 text-slate-300"></td>
                        <td className="px-4 py-2 text-slate-300"></td>
                        <td className="px-4 py-2 text-slate-300"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>You must calculate this exactly as a spreadsheet would, row by row.</p>
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>Opening Balance (Month 2):</strong> This is simply the closing balance from Month 1.<br/>
                  <span className="font-mono text-emerald-300">Opening Balance = &pound;400.00</span>
                  </li>
                  <li><strong>Interest Earned (Month 2):</strong> Multiply the Opening Balance by the monthly rate (0.35% &rarr; 0.0035).<br/>
                  <InlineMath math="\text{\pounds}400.00 \times 0.0035 = \text{\pounds}1.40" /><br/>
                  <span className="font-mono text-emerald-300">Interest Earned = &pound;1.40</span>
                  </li>
                  <li><strong>Closing Balance (Month 2):</strong> Add the Opening Balance, Interest Earned, and the new Deposit together.<br/>
                  <InlineMath math="\text{\pounds}400.00 + \text{\pounds}1.40 + \text{\pounds}400.00 = \text{\pounds}801.40" /><br/>
                  <span className="font-mono text-emerald-300">Closing Balance = &pound;801.40</span>
                  </li>
                </ul>
                <p className="mt-2 text-slate-400 italic">(The completed row should read: Opening: &pound;400.00 | Interest: &pound;1.40 | Deposit: &pound;400.00 | Closing: &pound;801.40).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "loans-and-schedules",
        title: "Loans & Loan Schedules",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              When an individual or business borrows money, they must repay the original amount (the capital) plus an additional fee for borrowing the money (the interest). There are several ways to structure this repayment, such as repaying nothing until the end of the term, repaying only the interest during the term and the capital at the very end, or making regular level repayments of both capital and interest.
            </p>
            <p>
              In the Higher Applications exam, you will primarily focus on level repayments, which are tracked using a <strong>Loan Schedule</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Structure of a Loan Schedule</h4>
                <p>A loan schedule is a table that tracks the outstanding debt period by period. It contains the following core elements:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Repayment:</strong> The fixed, level amount of money the borrower pays each month.</li>
                  <li><strong>Interest Content:</strong> The portion of the repayment that pays off the interest generated that month. This is calculated by multiplying the previous month's outstanding balance by the monthly interest rate.</li>
                  <li><strong>Capital Content:</strong> The portion of the repayment that actually reduces the debt itself. This is calculated by subtracting the interest content from the total repayment.</li>
                  <li><strong>Loan Outstanding:</strong> The new, reduced balance of the loan, found by subtracting the capital content from the previous loan outstanding.</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">2. The Changing Balance (Exam Concept)</h4>
                <ul className="list-disc list-inside mt-2 text-amber-100/80 space-y-1">
                  <li>Because the outstanding loan balance gets smaller with every payment, the <strong>interest content</strong> of the monthly payment naturally <strong>decreases</strong> over time.</li>
                  <li>Because the total monthly repayment remains level, the <strong>capital content</strong> naturally <strong>increases</strong> over time.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Spreadsheets and the Goal Seek Function</h4>
                <p>To find the exact level repayment required to clear a loan in a spreadsheet, you must use a specific sequence of steps:</p>
                <ul className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>Enter a "guess" for the repayment amount and complete the schedule down to the final month.</li>
                  <li>Use the Goal Seek function to set the final Loan Outstanding cell to exactly &pound;0 by changing your guessed repayment cell.</li>
                </ul>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mt-4">
                  <p className="font-semibold text-emerald-300 mb-1">The Crucial Final Step:</p>
                  <p className="text-emerald-100/80">
                    Goal Seek will produce an unrounded decimal. You must manually round this repayment figure to 2 decimal places (to represent real pennies).
                  </p>
                  <p className="text-emerald-100/80 mt-2">
                    Because of this rounding, your final balance will no longer be exactly zero. You must manually adjust the final monthly repayment (by adding or subtracting the small remaining balance) to ensure the loan clears to exactly &pound;0.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "loans-schedules-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Manual Calculation of a Loan Schedule</strong></p>
                <p>Finn takes out a personal loan of &pound;8,000. He makes level monthly repayments of &pound;260 at the end of each month. The effective rate of interest on the loan is 0.6% per month.</p>
                <p className="mt-2">Complete the loan schedule for Month 1.</p>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-slate-800 border border-slate-700 text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Time (months)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Repayment (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Interest content (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Capital content (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Loan outstanding (&pound;)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">0</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300"></td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300"></td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300"></td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">8000.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300">1</td>
                        <td className="px-4 py-2 text-slate-300">260.00</td>
                        <td className="px-4 py-2 text-slate-300"></td>
                        <td className="px-4 py-2 text-slate-300"></td>
                        <td className="px-4 py-2 text-slate-300"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <ul className="list-none space-y-3 ml-4">
                  <li><strong>Calculate the Interest Content:</strong> Multiply the outstanding balance by the decimal interest rate.<br/>
                  <InlineMath math="\text{\pounds}8000 \times 0.006 = \text{\pounds}48.00" />
                  </li>
                  <li><strong>Calculate the Capital Content:</strong> Subtract the interest from the total repayment.<br/>
                  <InlineMath math="\text{\pounds}260.00 - \text{\pounds}48.00 = \text{\pounds}212.00" />
                  </li>
                  <li><strong>Calculate the Loan Outstanding:</strong> Subtract the capital content from the previous balance.<br/>
                  <InlineMath math="\text{\pounds}8000.00 - \text{\pounds}212.00 = \text{\pounds}7,788.00" />
                  </li>
                </ul>
                <p className="mt-2 text-slate-400 italic">(The completed row for Month 1 should read: 260.00 | 48.00 | 212.00 | 7788.00).</p>
              </div>
            )
          },
          {
            id: "loans-schedules-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Constructing Spreadsheet Formulae</strong></p>
                <p>A spreadsheet is set up to model a loan repayment schedule.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>The monthly effective rate of interest is locked in cell B3.</li>
                  <li>The fixed monthly repayment is locked in cell B11.</li>
                  <li>For Month 1 (Row 10), the initial Loan Outstanding is in cell E10.</li>
                </ul>
                <p className="mt-2">Write down the exact Excel formula required in cell C11 to calculate the Interest Content for Month 1.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>You must multiply the outstanding balance (E10) by the locked interest rate (B3), and remember to use the <code>ROUND</code> function to 2 decimal places.</p>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-emerald-300">
                  =ROUND(E10*$B$3, 2)
                </div>
              </div>
            )
          },
          {
            id: "loans-schedules-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Adjusting the Final Repayment (Goal Seek)</strong></p>
                <p>Maya takes out a 36-month loan. She uses the Goal Seek function on her spreadsheet to find her monthly repayment, which gives an unrounded value of &pound;145.2874...</p>
                <p className="mt-2">She manually rounds this to &pound;145.29 and updates her spreadsheet to use this rounded figure for all 36 months. Because she rounded the payment up, she slightly overpays each month.</p>
                <p className="mt-2">Her spreadsheet now shows a final outstanding balance at month 36 of -&pound;0.09 (negative 9 pence).</p>
                <p className="mt-2">Calculate the adjusted final repayment Maya must make in Month 36 to bring the balance to exactly &pound;0.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Because Maya has overpaid by 9 pence over the course of the loan, she can subtract this amount from her very last payment.</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><InlineMath math="\text{Adjusted Final Repayment} = \text{\pounds}145.29 - \text{\pounds}0.09 = \text{\pounds}145.20" />.</li>
                </ul>
                <p className="mt-2 font-semibold text-emerald-300">Adjusted Final Repayment = &pound;145.20</p>
              </div>
            )
          }
        ]
      },
      {
        id: "inflation",
        title: "Inflation",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Inflation is a general rise in prices over time, which is measured as a percentage. Here in the UK, the Bank of England is responsible for keeping inflation low and stable, with a government target of 2%.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Purchasing Power of Money</h4>
                <p>Inflation results in a decrease in the "purchasing power" of money over time.</p>
                <p className="mt-2">This means that as prices rise, fewer goods or services can be bought for the exact same amount of money than in previous years.</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Measuring Inflation (The CPI & RPI)</h4>
                <p>Inflation is measured based on the change in value of an inflation index, most commonly the Consumer Price Index (CPI) or the Retail Price Index (RPI).</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>To calculate this index, the government tracks the prices of a "basket" containing around 300 commonly purchased goods and services.</li>
                  <li>To ensure the index is accurate, items are added and removed from the basket each year to keep up with current consumer trends. For example, recent additions have included meat-free sausages and anti-bac wipes, while items like coal and reference books have been removed.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Base Years and Calculating Rates</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>To track the index over time, a specific year is chosen as the "base year" and its index value is set to exactly 100. For example, the current base year for the CPI is 2005.</li>
                  <li>The rate of inflation is simply the percentage change in the price index from one year to another.</li>
                </ul>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mt-4">
                  <p className="font-semibold text-emerald-300 mb-1">Exam Strategy:</p>
                  <p className="text-emerald-100/80">
                    You can treat annual inflation rates exactly like successive interest rates. If you have different inflation rates over several years, you can use a chain of multipliers to find the overall percentage change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "inflation-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Calculating the Rate of Inflation</strong></p>
                <p>The UK Consumer Price Index (CPI) was recorded at 108.6 in August 2019. By August 2023, the CPI had risen to 132.5.</p>
                <p className="mt-2">Calculate the rate of inflation between these two time periods, giving your answer as a percentage to one decimal place.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>To find the rate of inflation, we calculate the percentage change between the two index values.</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the difference:</strong> <InlineMath math="132.5 - 108.6 = 23.9" />.</li>
                  <li><strong>Divide by the original value and multiply by 100:</strong><br/>
                  <InlineMath math="(23.9 \div 108.6) \times 100 = 22.007...\%" />
                  </li>
                  <li><strong>Round to 1 decimal place:</strong> 22.0%.</li>
                </ul>
              </div>
            )
          },
          {
            id: "inflation-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Purchasing Power and Reversing Inflation</strong></p>
                <p>In April 2015, the CPI was set to a baseline of 100. By April 2022, the CPI had increased to 119.0. A family paid &pound;14,875 for a new kitchen installation in April 2022.</p>
                <p className="mt-2">Assuming the cost of the kitchen installation rose exactly in line with the CPI, calculate how much the exact same kitchen would have cost in April 2015.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>The 2022 index of 119.0 means prices were 119% of their 2015 value. We must work backwards to find the original 100% value.</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Find the multiplier:</strong> 119% &rarr; 1.19.</li>
                  <li><strong>Divide to reverse the inflation:</strong><br/>
                  <InlineMath math="2015 \text{ Price} = \text{\pounds}14,875 \div 1.19 = \text{\pounds}12,500" />.
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "inflation-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Successive Inflation Rates (Chain Multipliers)</strong></p>
                <p>The average price of domestic electricity changed at the following annual effective rates:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>2021 to 2022: 5.4% increase</li>
                  <li>2022 to 2023: 12.1% increase</li>
                  <li>2023 to 2024: 3.5% decrease</li>
                </ul>
                <div className="mt-4 space-y-2">
                  <p>(a) Calculate the overall percentage change in the price of electricity between 2021 and 2024.</p>
                  <p>(b) The average annual electricity bill for a household in 2024 was &pound;1,350. Calculate the average bill for a household in 2021.</p>
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white">Solution (a):</p>
                  <p className="mb-2">Overall Percentage Change:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Find the multipliers:</strong> 1.054, 1.121, and 0.965.</li>
                    <li><strong>Multiply them together:</strong><br/>
                    <InlineMath math="1.054 \times 1.121 \times 0.965 = 1.14018..." />
                    </li>
                    <li><strong>Convert back to a percentage:</strong><br/>
                    <InlineMath math="(1.14018... - 1) \times 100 = 14.02\%" /> (an overall increase).
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-white">Solution (b):</p>
                  <p className="mb-2"><strong>Working Backwards:</strong> Because we know the 2024 price and the overall multiplier connecting the two years, we can divide to find the 2021 price.</p>
                  <div className="ml-4">
                    <InlineMath math="2021 \text{ Bill} = \text{\pounds}1350 \div 1.14018... = \text{\pounds}1,184.02" />.
                  </div>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "pension-savings",
        title: "Pension Savings",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              A pension is a long-term savings plan designed to provide a person with a regular income during their retirement, when they are no longer working.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Types of Pensions</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>State Pension:</strong> A regular payment from the government. To receive this, an individual must have paid sufficient National Insurance contributions over their working life.</li>
                  <li><strong>Workplace / Private Pensions:</strong> These act very much like standard savings accounts. A person pays a percentage of their salary into the fund each month, and often, their employer will also pay an additional percentage into the same fund. The total fund earns compound interest over time until retirement.</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">2. The Lifetime ISA (LISA)</h4>
                <p className="text-amber-100/80">
                  The SQA frequently uses the government's Lifetime ISA scheme as an exam context for retirement or first-time buyer savings. You must be familiar with its specific rules:
                </p>
                <ul className="list-disc list-inside mt-2 text-amber-100/80 space-y-1">
                  <li>You can save up to &pound;4,000 a year, and the government will add a <strong>25% bonus</strong> to your new deposits every month.</li>
                  <li>Once added, this bonus becomes part of your overall savings and begins to earn interest.</li>
                  <li><strong>The Penalty Trap:</strong> If you withdraw money for an unauthorised reason (i.e., anything other than buying a first home, turning 60, or terminal illness), you face a <strong>25% withdrawal charge</strong> on the total amount withdrawn. <br/>
                  <span className="italic">(Note: A 25% charge on a balance that includes interest means you will actually lose money overall compared to what you put in!)</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Retirement Drawdown (Living Costs)</h4>
                <p>Financial planners use spreadsheets to estimate if a person's pension pot will be large enough to last their entire retirement.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>This involves a "drawdown" calculation: tracking a large starting balance that earns interest, whilst simultaneously subtracting regular withdrawals to cover monthly living costs.</li>
                  <li>Often, these living costs must be adjusted to increase over time to account for inflation.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "pension-savings-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Employer &amp; Employee Contributions</strong></p>
                <p>Greg earns a gross annual salary of &pound;36,000. He contributes 5% of his gross monthly pay into his workplace pension. His employer contributes an additional 7% of his gross monthly pay. The pension fund earns an effective rate of interest of 0.4% per month.</p>
                <p className="mt-2">Assuming Greg's pension fund starts at &pound;0, calculate the value of his pension fund immediately after his second monthly contribution is made.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white">Calculate the total monthly deposit:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-1">
                    <li>Gross monthly pay: &pound;36,000 &divide; 12 = &pound;3,000.</li>
                    <li>Greg's contribution: 0.05 &times; &pound;3,000 = &pound;150.</li>
                    <li>Employer's contribution: 0.07 &times; &pound;3,000 = &pound;210.</li>
                    <li>Total monthly deposit: &pound;150 + &pound;210 = &pound;360.</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-white">Track the balance chronologically (Method 1):</p>
                  <ul className="list-none space-y-2 ml-4 mt-1">
                    <li><strong>Month 1 Deposit:</strong> &pound;360.</li>
                    <li><strong>Month 1 Interest:</strong> <InlineMath math="\text{\pounds}360 \times 1.004 = \text{\pounds}361.44" />.</li>
                    <li><strong>Month 2 Deposit:</strong> <InlineMath math="\text{\pounds}361.44 + \text{\pounds}360 = \text{\pounds}721.44" />.</li>
                  </ul>
                  <p className="mt-2 font-semibold text-emerald-300">The value of the fund after the second contribution is &pound;721.44.</p>
                </div>
              </div>
            )
          },
          {
            id: "pension-savings-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Lifetime ISA (Bonus and Penalty)</strong></p>
                <p>Nina opens a Lifetime ISA to save for her retirement. On 1 March, she deposits &pound;300. The government immediately applies the 25% bonus to her deposit. At the end of March, the account earns an effective rate of interest of 0.5% per month.</p>
                <p className="mt-2">On 1 April, Nina decides to withdraw the entire balance of the account to pay for a holiday. Because this is an unauthorised withdrawal, the provider applies a 25% withdrawal charge.</p>
                <div className="mt-4 space-y-2">
                  <p>(a) Calculate the balance of Nina's account at the end of March, after the bonus and interest have been applied.</p>
                  <p>(b) Calculate the final amount of cash Nina receives after the withdrawal charge is deducted.</p>
                </div>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white">Solution (a):</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-1">
                    <li><strong>Add the bonus:</strong> <InlineMath math="\text{\pounds}300 + (0.25 \times \text{\pounds}300) = \text{\pounds}300 + \text{\pounds}75 = \text{\pounds}375" />.</li>
                    <li><strong>Add the interest:</strong> <InlineMath math="\text{\pounds}375 \times 1.005 = \text{\pounds}376.88" /> (rounded from &pound;376.875).</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-white">Solution (b):</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-1">
                    <li><strong>Calculate the 25% penalty on the total balance:</strong> <InlineMath math="0.25 \times \text{\pounds}376.88 = \text{\pounds}94.22" />.</li>
                    <li><strong>Subtract the penalty:</strong> <InlineMath math="\text{\pounds}376.88 - \text{\pounds}94.22 = \text{\pounds}282.66" />.</li>
                  </ul>
                  <p className="mt-2 text-slate-400 italic">(Notice that because the 25% penalty is taken from the larger, post-bonus balance, Nina gets back less than her original &pound;300 deposit!)</p>
                </div>
              </div>
            )
          },
          {
            id: "pension-savings-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Retirement Drawdown</strong></p>
                <p>David retires on his 65th birthday with a private pension pot of &pound;240,000. The account pays an effective rate of interest of 0.2% per month.</p>
                <p className="mt-2">At the very start of each month, David withdraws &pound;1,450 to cover his living costs. Interest is then calculated and added to the remaining balance at the end of the month.</p>
                <p className="mt-2">Calculate the exact balance of David's pension pot at the end of Month 2.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We must carefully step through the timeline, subtracting the living costs <em>before</em> calculating the interest. The multiplier is 1.002.</p>
                <div className="space-y-3 ml-4">
                  <div>
                    <p className="font-semibold text-white">Month 1:</p>
                    <ul className="list-none space-y-1 ml-4 mt-1">
                      <li>Start balance: &pound;240,000.</li>
                      <li>Subtract living costs: <InlineMath math="\text{\pounds}240,000 - \text{\pounds}1,450 = \text{\pounds}238,550" />.</li>
                      <li>Add interest: <InlineMath math="\text{\pounds}238,550 \times 1.002 = \text{\pounds}239,027.10" />.</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-white">Month 2:</p>
                    <ul className="list-none space-y-1 ml-4 mt-1">
                      <li>Subtract living costs: <InlineMath math="\text{\pounds}239,027.10 - \text{\pounds}1,450 = \text{\pounds}237,577.10" />.</li>
                      <li>Add interest: <InlineMath math="\text{\pounds}237,577.10 \times 1.002 = \text{\pounds}238,052.25" />.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "insurance",
        title: "Insurance",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Insurance products provide a form of financial protection against unexpected costs. By paying a fee called a premium, you transfer the financial risk of a specific event (like a car crash or a broken phone) to an insurance company, who will cover the loss if it occurs.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Core Terminology</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Premium:</strong> The money you pay to the insurer, either as a one-off purchase or in regular monthly instalments.</li>
                  <li><strong>Claim:</strong> A formal request to the insurance company asking them to pay for a loss.</li>
                  <li><strong>Exclusions:</strong> Specific events or circumstances that the policy will not cover (e.g., intentional damage to a laptop, or extreme sports on a travel policy).</li>
                </ul>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg my-4">
                <h4 className="text-lg font-semibold text-rose-300 mb-1">2. The Excess (A Major SQA Warning)</h4>
                <p className="text-rose-100/80 mb-2">
                  An excess is a mandatory minimum amount that the customer must pay towards the cost of a claim before the insurance company pays the remainder.
                </p>
                <p className="text-rose-100/80 font-semibold mb-2">The SQA Examiner Trap:</p>
                <p className="text-rose-100/80 mb-2">
                  In the 2024 exam, many students incorrectly stated that an excess is a "pot of money" that can be used to repair an item. You must <strong>never</strong> describe it this way; it is <em>your own money</em> that you must hand over when you make a claim!
                </p>
                <p className="text-rose-100/80">
                  <strong>Balancing Risk:</strong> Choosing a policy with a higher excess reduces the financial risk for the insurance company. Therefore, a higher excess will generally result in a lower premium for the customer.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. The Impact of Making a Claim</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>If you make a claim, the insurance company will view you as a higher risk individual. As a result, they will usually increase your future premiums for subsequent years.</li>
                  <li>You may also lose any accumulated no-claims bonuses (a reward discount given for every year you do not make a claim).</li>
                </ul>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mt-4">
                  <p className="font-semibold text-emerald-300 mb-1">Exam Wording:</p>
                  <p className="text-emerald-100/80">
                    When answering written questions about why someone might not make a claim, you must specifically state that it would increase their <strong>future premiums</strong>; do not just say it will increase their "monthly premium".
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "insurance-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The Mathematics of Claiming</strong></p>
                <p>Liam has mobile phone insurance with a compulsory excess of &pound;150. He drops his phone and shatters the screen. A local repair shop quotes him &pound;185 to fix the screen.</p>
                <p className="mt-2">Determine whether Liam should make a claim on his insurance or pay the repair shop directly. Justify your answer with a calculation.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>If Liam claims, he must pay the &pound;150 excess, and the insurance will pay the remaining &pound;35.</p>
                <p>If he doesn't claim, he pays the full &pound;185. However, claiming will likely increase his future premiums and cost him his no-claims bonus.</p>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="font-semibold text-emerald-300">Conclusion:</p>
                  <p className="mt-1">Because the financial benefit of the claim is so small (<InlineMath math="\text{\pounds}185 - \text{\pounds}150 = \text{\pounds}35" />), Liam should pay the repair shop directly. The &pound;35 saved by claiming is likely to be wiped out by the increase in his future insurance premiums.</p>
                </div>
              </div>
            )
          },
          {
            id: "insurance-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Comparing Policies (Exam Style)</strong></p>
                <p>Esme needs new building insurance. She is choosing between the following two options:</p>
                <div className="overflow-x-auto mt-4 mb-4">
                  <table className="min-w-full bg-slate-800 border border-slate-700 text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300"></th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Cost per year (&pound;)</th>
                        <th className="px-4 py-2 border-b border-slate-700 text-left text-slate-300">Total excess (&pound;)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300 font-semibold">Option A</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">216.94</td>
                        <td className="px-4 py-2 border-b border-slate-700 text-slate-300">350</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300 font-semibold">Option B</td>
                        <td className="px-4 py-2 text-slate-300">281.95</td>
                        <td className="px-4 py-2 text-slate-300">100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>State one advantage of having a high excess amount on your insurance policy, as seen in Option A.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>A high excess amount reduces the risk for the insurer, which results in a lower annual premium (cost per year) for the customer.</p>
              </div>
            )
          },
          {
            id: "insurance-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: To Claim or Not to Claim?</strong></p>
                <p>Deirdre has a van insurance policy with a &pound;195 excess for accidental damage. Her van door is scratched in a minor accident. A local garage has quoted her &pound;210 to repair the damage.</p>
                <p className="mt-2">Give one reason why Deirdre might choose not to make a claim on her insurance.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Deirdre might choose not to claim because making a claim would likely increase her future premiums or cause her to lose her no-claims bonus.</p>
                <p className="text-slate-400 italic">(Note: Stating "she only saves &pound;15 after paying the excess" would also be a valid mathematical reason!)</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "statistics",
    title: "Statistics",
    topics: [
      {
        id: "classifying-data",
        title: "Classifying Data",
        videoUrl: "https://www.youtube.com/embed/placeholder", // Replace when available
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Before analysing any data, it is crucial to understand exactly what type of data you are working with, as this determines which statistical tests and diagrams are appropriate to use.
            </p>
            <p>
              Data can be broadly split into two main groups: <strong>Numerical</strong> (number-based) and <strong>Categorical</strong> (word or group-based). These are then broken down further into four specific classifications:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Numerical Data (Quantitative)</h4>
                <p className="mb-2">Data that represents quantities or measurements.</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <span className="text-blue-300 font-medium">Numerical Discrete:</span> Data that can only take specific, exact values. This is usually data that is counted (e.g., number of siblings, number of cars).
                  </li>
                  <li>
                    <span className="text-blue-300 font-medium">Numerical Continuous:</span> Data that can take any value within a specific range. This is usually data that is measured (e.g., height, weight, time).
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Categorical Data (Qualitative)</h4>
                <p className="mb-2">Data that is grouped into descriptive categories.</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <span className="text-emerald-300 font-medium">Categorical Nominal:</span> Data divided into descriptive categories that have no natural order or ranking (e.g., eye colour, car brand, favourite fruit).
                  </li>
                  <li>
                    <span className="text-emerald-300 font-medium">Categorical Ordinal:</span> Data divided into categories that have a logical, natural order or ranking (e.g., clothing sizes [Small, Medium, Large], or satisfaction ratings [Poor, Good, Excellent]).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "classifying-data-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The Smartphone Survey</strong></p>
                <p>A tech company is surveying people about their smartphones. Decide which of the four data classifications best describes each piece of information collected:</p>
                <ul className="list-none space-y-1">
                  <li>(a) The brand of the smartphone (e.g., Apple, Samsung, Google).</li>
                  <li>(b) The number of apps installed on the device.</li>
                  <li>(c) The battery life of the phone in hours.</li>
                  <li>(d) The condition of the phone (Poor, Fair, Good, Excellent).</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <ul className="list-none space-y-2">
                  <li><strong>(a) Categorical Nominal</strong> (They are word-based categories with no natural ranking).</li>
                  <li><strong>(b) Numerical Discrete</strong> (You can count the exact number of apps; you cannot have 12.4 apps).</li>
                  <li><strong>(c) Numerical Continuous</strong> (Time is a measurement that can take any value, e.g., 14.258 hours).</li>
                  <li><strong>(d) Categorical Ordinal</strong> (Word-based categories that have a natural, logical ranking).</li>
                </ul>
              </div>
            )
          },
          {
            id: "classifying-data-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Coffee Shop</strong></p>
                <p>A local coffee shop tracks data on its daily sales. Classify each of the following variables:</p>
                <ul className="list-none space-y-1">
                  <li>(a) The temperature of the milk used in each coffee.</li>
                  <li>(b) The size of the drink ordered (Small, Regular, Large).</li>
                  <li>(c) The type of milk requested (Oat, Soya, Dairy, Almond).</li>
                  <li>(d) The number of customers served each hour.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <ul className="list-none space-y-2">
                  <li><strong>(a) Numerical Continuous</strong> (Temperature is a measurement).</li>
                  <li><strong>(b) Categorical Ordinal</strong> (Categories with a distinct size order).</li>
                  <li><strong>(c) Categorical Nominal</strong> (Categories with no natural order).</li>
                  <li><strong>(d) Numerical Discrete</strong> (Counted whole numbers).</li>
                </ul>
              </div>
            )
          },
          {
            id: "classifying-data-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Animal Rescue Centre</strong></p>
                <p>An animal rescue centre updates the profiles of the dogs in its care. Identify the data type for each of the following:</p>
                <ul className="list-none space-y-1">
                  <li>(a) The breed of the dog.</li>
                  <li>(b) The weight of the dog in kilograms.</li>
                  <li>(c) The aggression level of the dog (Low, Medium, High).</li>
                  <li>(d) The number of previous owners the dog has had.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <ul className="list-none space-y-2">
                  <li><strong>(a) Categorical Nominal</strong></li>
                  <li><strong>(b) Numerical Continuous</strong></li>
                  <li><strong>(c) Categorical Ordinal</strong></li>
                  <li><strong>(d) Numerical Discrete</strong></li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "samples-populations-outliers",
        title: "Samples, Populations & Outliers",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              When gathering and analysing data, it is important to understand where the data comes from and whether it paints an accurate picture of what you are trying to study.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Populations vs Samples</h4>
                <p className="mb-2">
                  <strong>Population:</strong> The entire, complete group of people or items that you want to draw conclusions about (e.g., Every eligible voter in the UK).
                </p>
                <p>
                  <strong>Sample:</strong> A smaller subset of the population. Gathering data from an entire population is usually too expensive or time-consuming, so researchers collect data from a sample to estimate the characteristics of the whole population.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Bias and Representative Samples</h4>
                <p className="mb-2">
                  A sample must be <strong>representative</strong>, meaning it accurately reflects the diverse characteristics of the whole population. If a data collection method unfairly favours a certain group, it introduces <strong>bias</strong>.
                </p>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-200 font-semibold mb-1">Common SQA Exam Trap:</p>
                  <p className="text-amber-100/80">
                    You must be able to identify why a survey might be biased. For example, an online survey on social media is biased because it excludes people without internet access and relies on "self-selection" (only people with strong opinions usually bother to reply).
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Outliers</h4>
                <p className="mb-2">
                  <strong>Outliers</strong> are extreme values that sit far outside the general pattern of the rest of the data.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    You must carefully consider whether to keep or remove outliers. They should only be removed if they are impossible or clearly data entry errors (e.g., a person's age recorded as -5 or 250 years old), because including them would heavily distort calculations like the mean.
                  </li>
                  <li>
                    If an outlier is unusual but physically possible, it should generally be kept.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "samples-pop-outliers-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The Streaming Service</strong></p>
                <p>A national streaming company wants to determine the favourite television genres of all adults living in Scotland. To gather data quickly, they survey 500 students at a university campus in Glasgow.</p>
                <ul className="list-none space-y-1">
                  <li>(a) Identify the intended population.</li>
                  <li>(b) Identify the sample.</li>
                  <li>(c) Give two reasons why this sample is not representative of the intended population.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <ul className="list-none space-y-2">
                  <li><strong>(a)</strong> The population is all adults living in Scotland.</li>
                  <li><strong>(b)</strong> The sample is the 500 university students surveyed in Glasgow.</li>
                  <li><strong>(c) Reason 1:</strong> University students are generally younger, so their tastes will not represent the views of older adults.</li>
                  <li><strong>Reason 2:</strong> The survey was only conducted in one city (Glasgow), so it does not represent adults living in rural areas or other Scottish cities.</li>
                </ul>
              </div>
            )
          },
          {
            id: "samples-pop-outliers-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Town Council Survey</strong></p>
                <p>A local town council wants to estimate the proportion of residents who support spending tax money to build a new cycle lane. They leave paper questionnaires on the counter of a local bicycle repair shop for customers to fill out. Explain why this data collection method will result in a biased sample.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>The questionnaires are only available in a bicycle repair shop, meaning the survey will almost exclusively be answered by active cyclists. Cyclists are significantly more likely to support building a cycle lane than the general public, which makes the sample highly biased and unrepresentative of the whole town.</p>
              </div>
            )
          },
          {
            id: "samples-pop-outliers-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Medical Trial Outliers</strong></p>
                <p>A medical researcher is recording the resting heart rate (in beats per minute) of seven adult patients in a clinical trial. The recorded values are: 68, 72, 65, 71, 15, 74, 69. Identify the outlier in this dataset and explain how the researcher should handle it before calculating the mean.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>The outlier is <strong>15 bpm</strong>.</p>
                <p>Since a resting heart rate of 15 bpm is medically impossible for a conscious adult, this is clearly a data entry or equipment error. The researcher should completely remove this value from the dataset before calculating the mean, as leaving it in would heavily distort the average and make it artificially low.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "statistical-diagrams",
        title: "Statistical Diagrams",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Once data has been classified and gathered, we use statistical diagrams to visualise it. The type of diagram you choose depends entirely on the type of data (categorical or numerical) you are analysing.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Diagrams for Categorical Data</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-blue-300">Tables (Frequency &amp; Contingency):</strong> Frequency tables show the totals for a single category. Contingency (two-way) tables show how two categorical variables interact. Tables can display raw counts or proportions/percentages.
                  </li>
                  <li>
                    <strong className="text-blue-300">Bar Charts:</strong> Generated from frequency tables. They use rectangular bars to make clear comparisons between the totals of different categories.
                  </li>
                  <li>
                    <strong className="text-blue-300">Pie Charts:</strong> A circular chart divided into slices. These are best used when you want to compare the proportions (or percentages) of different categories relative to the whole.
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Diagrams for Numerical Data</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-emerald-300">Histograms:</strong> Used to visualise the shape and distribution of a single continuous numerical variable (e.g., to see if data is normally distributed or skewed).
                  </li>
                  <li>
                    <strong className="text-emerald-300">Boxplots:</strong> Provide a visual representation of the five-figure summary.
                    <ul className="list-[circle] list-inside ml-8 mt-1 text-slate-400">
                      <li>The line in the middle of the box is the median.</li>
                      <li>The width of the box is the interquartile range (IQR).</li>
                      <li>Circles or asterisks outside the whiskers represent outliers.</li>
                      <li>Comparative boxplots are excellent for comparing two different numerical datasets side-by-side.</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-emerald-300">Scatterplots:</strong> Used to present bivariate data (data with two related numerical variables) to visualise relationships and correlations.
                    <ul className="list-[circle] list-inside ml-8 mt-1 text-slate-400">
                      <li>When plotting "Y on X", the independent variable goes on the x-axis, and the dependent variable goes on the y-axis.</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-300 font-semibold mb-1">Important Exam/Project Rule:</p>
                <p className="text-purple-100/80">
                  All statistical diagrams must include a <strong>clear, descriptive main title</strong> and <strong>appropriate axis labels</strong> to be awarded marks.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "statistical-diagrams-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Diagram Selection (Categorical)</strong></p>
                <p>A school cafeteria manager has recorded the meal choices (Pasta, Pizza, Salad, or Curry) of 300 pupils. They want to create a visual display specifically to show the proportion of the total pupils that chose each meal. State the most appropriate statistical diagram for this purpose.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>A <strong>pie chart</strong>.</p>
                <p className="text-slate-400">(Pie charts are the best diagram for displaying proportions of categorical data).</p>
              </div>
            )
          },
          {
            id: "statistical-diagrams-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Comparing Boxplots (Numerical)</strong></p>
                <p>A manager at a call centre compares the time taken (in seconds) for employees to answer the phone at two different offices, Office A and Office B.</p>
                <ul className="list-none space-y-1 ml-4 border-l-2 border-slate-700 pl-4 my-2">
                  <li>Office A has a median answer time of 45 seconds and an interquartile range (IQR) of 12 seconds.</li>
                  <li>Office B has a median answer time of 38 seconds and an interquartile range (IQR) of 20 seconds.</li>
                </ul>
                <p>Make two valid comparisons about the call answering times at the two offices.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>Comparison 1 (Location):</strong></p>
                  <p>On average, the call answering time at Office B is faster because its median (38 seconds) is lower than Office A's median (45 seconds).</p>
                </div>
                <div>
                  <p><strong>Comparison 2 (Spread):</strong></p>
                  <p>The call answering times at Office A are more consistent because its interquartile range (12 seconds) is smaller than Office B's interquartile range (20 seconds).</p>
                </div>
              </div>
            )
          },
          {
            id: "statistical-diagrams-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Scatterplots &amp; Bivariate Data</strong></p>
                <p>A botanist is investigating how the number of hours of daily sunlight affects the height of a specific type of sunflower.</p>
                <ul className="list-none space-y-1">
                  <li>(a) State which variable is the independent variable and should be plotted on the x-axis.</li>
                  <li>(b) State the name of the statistical diagram that should be used to visualise the relationship between these two variables.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>(a)</strong> The independent variable is the <strong>hours of daily sunlight</strong> (because the plant's height depends on the sunlight, not the other way around).</p>
                <p><strong>(b)</strong> A <strong>scatterplot</strong>.</p>
              </div>
            )
          },
          {
            id: "statistical-diagrams-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Distributions vs Summaries</strong></p>
                <p>A marine biologist has collected data on the weights of 500 adult penguins. They want to check if the data is symmetrically distributed or if it has a skewed shape. Explain whether a boxplot or a histogram would be the most appropriate diagram for this specific task.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>A <strong>histogram</strong> is the most appropriate diagram.</p>
                <p>While a boxplot shows the median and spread, a histogram is much better at clearly visualising the overall shape and distribution of a single numerical dataset.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "distributions",
        title: "Distributions",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              When working with continuous numerical data, plotting a histogram allows you to see the <strong>distribution</strong> (the overall shape and spread) of the data. Identifying the correct distribution is vital because it dictates which descriptive statistics you are allowed to use.
            </p>
            <p>
              There are four main types of distributions you need to recognise:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Normal Distribution (Symmetrical)</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>The histogram has a classic, symmetrical "bell shape".</li>
                  <li>Most of the data clusters in the middle, with fewer values at the extreme high and low ends.</li>
                  <li><strong className="text-blue-300">Appropriate Measures:</strong> Because the data is symmetrical, you must use the <strong>mean</strong> for the measure of location and the <strong>standard deviation</strong> for the measure of spread.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Positively Skewed (Skewed to the Right)</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>The bulk of the data is bunched up on the left side of the histogram, with a long "tail" stretching out to the right.</li>
                  <li>This happens when there are a few unusually high outliers pulling the data upwards.</li>
                  <li><strong className="text-blue-300">Appropriate Measures:</strong> Because the extreme high values would artificially inflate the mean, you must use the <strong>median</strong> (location) and the <strong>interquartile range / IQR</strong> (spread).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Negatively Skewed (Skewed to the Left)</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>The bulk of the data is bunched up on the right side of the histogram, with a long "tail" stretching out to the left.</li>
                  <li>This happens when there are a few unusually low outliers pulling the data downwards.</li>
                  <li><strong className="text-blue-300">Appropriate Measures:</strong> Just like positive skew, you must use the <strong>median</strong> and the <strong>interquartile range</strong>.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. Uniform Distribution</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>The data is spread evenly across the entire range.</li>
                  <li>A histogram of a uniform distribution looks relatively flat, with all the bars being roughly the exact same height.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "distributions-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Analysing Salaries (Positive Skew)</strong></p>
                <p>A researcher plots a histogram showing the annual salaries of 10,000 employees at a massive global tech company. They notice that the vast majority of employees earn between £20,000 and £40,000, but a small handful of senior executives earn over £500,000.</p>
                <ul className="list-none space-y-1">
                  <li>(a) Describe the expected shape of this distribution.</li>
                  <li>(b) State the most appropriate measure of location and measure of spread to summarise this data.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>(a) Positively skewed</strong> (or skewed to the right) because the few massive salaries create a long tail to the right.</p>
                <p><strong>(b)</strong> The <strong>median</strong> and the <strong>interquartile range (IQR)</strong>.</p>
              </div>
            )
          },
          {
            id: "distributions-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Exam Results (Negative Skew)</strong></p>
                <p>A driving instructor records the scores of 50 students on a basic road safety theory test out of 100. The test is considered very easy. 45 students score between 90 and 100, while 5 students score below 40.</p>
                <ul className="list-none space-y-1">
                  <li>(a) Describe the shape of the distribution of these test scores.</li>
                  <li>(b) An assistant calculates the mean score to summarise the data. Explain why this is not the most appropriate measure to use.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>(a) Negatively skewed</strong> (or skewed to the left).</p>
                <p><strong>(b)</strong> The mean is not appropriate because the data is skewed. The very low scores of the 5 students will pull the mean down, making it an inaccurate representation of the typical student's high score. The median should be used instead.</p>
              </div>
            )
          },
          {
            id: "distributions-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Biological Data (Normal Distribution)</strong></p>
                <p>A marine biologist collects data on the lengths of 800 adult great white sharks. A histogram of the data shows a perfectly symmetrical bell shape.</p>
                <p>State the most appropriate measure of location and measure of spread the biologist should use to summarise the shark lengths.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Because the data is symmetrically (normally) distributed, the biologist should use the <strong>mean</strong> and the <strong>standard deviation</strong>.</p>
              </div>
            )
          },
          {
            id: "distributions-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Dice Rolls (Uniform Distribution)</strong></p>
                <p>A student rolls a standard six-sided die 600 times and records the number of times each face lands face up. They plot a histogram of the results. Describe the likely shape of this distribution.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>A <strong>uniform distribution</strong>.</p>
                <p className="text-slate-400">(Since every number from 1 to 6 has an equal chance of landing, the bars for each number will be roughly the same height).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "descriptive-statistics",
        title: "Descriptive Statistics",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Descriptive statistics are used to summarise and describe the main features of a dataset. The statistics you use depend on whether your data is categorical or numerical.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Categorical Data (Sample Size &amp; Proportions)</h4>
                <p className="mb-2">
                  When analysing categorical data, we look at the <strong>sample size</strong> (the total number of observations) and <strong>proportions</strong> (the number of specific responses divided by the sample size).
                </p>
                <p>
                  Proportions can be written as decimals, fractions, or percentages. They are incredibly useful for fairly comparing groups of different sizes.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Numerical Data (Location &amp; Spread)</h4>
                <p className="mb-2">
                  To summarise numerical data, you must calculate one measure of location (an average) and one measure of dispersion (how spread out or consistent the data is). These measures must <strong>always</strong> be paired correctly based on the distribution of the data:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-emerald-300">Normally Distributed Data:</strong> Use the <strong>mean</strong> (location) and the <strong>standard deviation</strong> (spread).
                  </li>
                  <li>
                    <strong className="text-emerald-300">Skewed Data (Positive or Negative):</strong> Use the <strong>median</strong> (location) and the <strong>interquartile range / IQR</strong> (spread). This is because extreme outliers in the 'tail' of skewed data will drastically distort the mean, but the median remains unaffected.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Making Valid Comparisons</h4>
                <p className="mb-2">
                  A massive part of the Higher Applications course is comparing two datasets. To gain full marks from the SQA, you must always write two separate sentences in the context of the question:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-purple-300">Sentence 1 (Location):</strong> Compare the averages using the word "average", state which is higher/lower, and explicitly state the numbers. <br/>
                    <em className="text-slate-400 text-sm ml-4">(e.g., "On average, Group A was faster because its median (12s) is lower than Group B's (15s).")</em>
                  </li>
                  <li>
                    <strong className="text-purple-300">Sentence 2 (Spread):</strong> Compare the spread using the word "consistent" or "varied", and explicitly state the numbers. <br/>
                    <em className="text-slate-400 text-sm ml-4">(e.g., "Group A's times were more consistent because its IQR (2s) is smaller than Group B's (5s).")</em>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. R Studio Commands</h4>
                <ul className="space-y-2 mt-2 font-mono text-sm ml-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <li><span className="text-blue-400">mean(X)</span> / <span className="text-blue-400">sd(X)</span> <span className="text-slate-400">- calculates the mean and standard deviation.</span></li>
                  <li><span className="text-blue-400">median(X)</span> / <span className="text-blue-400">IQR(X)</span> <span className="text-slate-400">- calculates the median and interquartile range.</span></li>
                  <li><span className="text-blue-400">summary(X)</span> <span className="text-slate-400">- provides the 5-figure summary (min, Q1, median, mean, Q3, max).</span></li>
                  <li><span className="text-blue-400">prop.table(table(X))</span> <span className="text-slate-400">- calculates the proportions of a categorical variable.</span></li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "descriptive-stats-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Categorical Proportions</strong></p>
                <p>A cinema surveys its customers to find out their favourite movie genre.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300">
                  <li>Out of 400 teenagers surveyed, 120 chose 'Horror'.</li>
                  <li>Out of 650 adults surveyed, 143 chose 'Horror'.</li>
                </ul>
                <p>By calculating the relevant proportions, compare the preference for Horror movies between teenagers and adults.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>Proportions:</strong></p>
                  <ul className="list-none space-y-1 mt-2">
                    <li><span className="text-slate-400">Proportion of teenagers:</span> 120 ÷ 400 = <strong>0.30</strong> (or 30%)</li>
                    <li><span className="text-slate-400">Proportion of adults:</span> 143 ÷ 650 = <strong>0.22</strong> (or 22%)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Comparison:</strong></p>
                  <p className="mt-2">A higher proportion of teenagers chose Horror as their favourite movie genre compared to adults.</p>
                </div>
              </div>
            )
          },
          {
            id: "descriptive-stats-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Selecting the Correct Measures</strong></p>
                <p>A researcher is analysing two datasets using statistical software.</p>
                <ul className="list-none space-y-1 ml-4 border-l-2 border-slate-700 pl-4 my-2 text-slate-300">
                  <li>Dataset A (Reaction Times) produces a perfectly symmetrical histogram.</li>
                  <li>Dataset B (Annual Incomes) produces a histogram that is heavily skewed to the right.</li>
                </ul>
                <p>State the most appropriate measures of location and spread that the researcher should use to summarise Dataset A and Dataset B.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Dataset A (Symmetrical):</strong> Mean and Standard Deviation.</p>
                <p><strong>Dataset B (Skewed):</strong> Median and Interquartile Range (IQR).</p>
              </div>
            )
          },
          {
            id: "descriptive-stats-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Making Valid Comparisons (Contextual)</strong></p>
                <p>A logistics company wants to compare the delivery times (in minutes) of two of its drivers, David and Sarah.</p>
                <ul className="list-none space-y-1 ml-4 border-l-2 border-slate-700 pl-4 my-2 text-slate-300">
                  <li>David has a mean delivery time of 42 minutes and a standard deviation of 8.5 minutes.</li>
                  <li>Sarah has a mean delivery time of 38 minutes and a standard deviation of 3.2 minutes.</li>
                </ul>
                <p>Make two valid comparisons about the delivery times of the two drivers.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>Comparison 1 (Location):</strong></p>
                  <p className="mt-2">On average, Sarah's delivery times are faster because her mean (38 mins) is lower than David's mean (42 mins).</p>
                </div>
                <div>
                  <p><strong>Comparison 2 (Spread):</strong></p>
                  <p className="mt-2">Sarah's delivery times are much more consistent because her standard deviation (3.2 mins) is smaller than David's standard deviation (8.5 mins).</p>
                </div>
              </div>
            )
          },
          {
            id: "descriptive-stats-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: The Impact of Outliers</strong></p>
                <p>A small startup company has 10 employees. Nine of the employees earn exactly £25,000 a year. The CEO earns £400,000 a year. Explain why the median is a much better measure of location for this dataset than the mean.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>The CEO's massive salary is an extreme outlier that creates a positive skew.</p>
                <p>If the mean is used, this outlier will pull the average drastically upwards, giving a false impression that the typical employee earns a very high salary. The median is resistant to extreme outliers and will accurately reflect the typical £25,000 salary.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "correlation",
        title: "Correlation",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              <strong>Correlation</strong> is used when we want to explore the relationship between two numerical variables (bivariate data). At this stage, no variables are being manipulated; we are simply observing how they interact.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Visualising the Relationship (Scatterplots)</h4>
                <p className="mb-2">
                  A scatterplot is the most useful graphical display for determining if a relationship exists between two numerical variables.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    When plotting a scatterplot, the independent variable (the one that causes the change) goes on the x-axis, and the dependent variable goes on the y-axis.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Pearson's Correlation Coefficient (r)</h4>
                <p className="mb-2">
                  We use the statistical software code <code className="text-blue-300 font-mono">cor.test(X,Y)</code> to calculate the correlation coefficient, often denoted as <strong>r</strong>. This calculation gives us a number exactly between -1 and 1, which tells us the strength and direction of the linear relationship.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>r = 1:</strong> A perfect positive linear relationship (as X increases, Y increases perfectly).</li>
                  <li><strong>r = -1:</strong> A perfect negative linear relationship (as X increases, Y decreases perfectly).</li>
                  <li><strong>r = 0:</strong> No linear relationship.</li>
                </ul>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-200 font-semibold mb-1">SQA Rule:</p>
                  <p className="text-amber-100/80">
                    When interpreting an r value, you must state both the <strong>strength</strong> (weak, moderate, or strong) and the <strong>direction</strong> (positive or negative) in the context of the question.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Correlation vs. Causation (The SQA Trap)</h4>
                <p className="mb-2">
                  This is one of the most frequently tested concepts in the Higher Applications course.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <strong className="text-rose-300">Correlation does not imply causation.</strong> Just because two variables have a strong mathematical correlation does not prove that a change in one directly causes a change in the other.
                  </li>
                  <li>
                    There may be an outside influence, known as a <strong>confounding variable</strong>, that is actually causing both variables to change simultaneously.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "correlation-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Interpreting the Correlation Coefficient (r)</strong></p>
                <p>A coach tracks the number of hours their athletes spend training each week and the time it takes them to run a 100-metre sprint. The correlation coefficient is calculated as <strong>r = -0.89</strong>.</p>
                <p>Interpret this correlation coefficient in the context of the data.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>There is a <strong>strong negative correlation</strong> between the number of hours spent training and the time taken to run a 100-metre sprint.</p>
                <p className="text-slate-400">(As training hours increase, sprint times decrease).</p>
              </div>
            )
          },
          {
            id: "correlation-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Correlation vs. Causation Trap</strong></p>
                <p>A tourist board gathers data over a 12-month period. They run a statistical analysis and find a strong positive correlation (<strong>r = 0.94</strong>) between the daily number of ice cream sales and the daily number of sunburn cases at a local hospital.</p>
                <p>Based on this, a local newspaper publishes an article claiming that eating ice cream causes sunburn. Explain why this claim is invalid.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Correlation does not imply causation.</strong> The strong mathematical relationship does not prove that eating ice cream causes sunburn.</p>
                <p>It is highly likely that a <strong>confounding variable</strong>, such as hot, sunny weather, is causing both ice cream sales and sunburn cases to increase at the exact same time.</p>
              </div>
            )
          },
          {
            id: "correlation-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Extracting r from Statistical Software</strong></p>
                <p>A researcher is investigating the relationship between the number of hours a student spends playing video games per week and their score on a concentration test. They use statistical software and generate the following output:</p>
                <div className="bg-slate-900/80 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-700/50 my-3">
                  <p>Pearson's product-moment correlation</p>
                  <p className="mt-2">data: Gaming.Hours and Test.Score</p>
                  <p>t = -4.102, df = 48, p-value = 0.000155</p>
                  <p>alternative hypothesis: true correlation is not equal to 0</p>
                  <p>95 percent confidence interval:</p>
                  <p>-0.7245 -0.2819</p>
                  <p>sample estimates:</p>
                  <p>      cor</p>
                  <p>-0.5082</p>
                </div>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State the correlation coefficient for this data.</li>
                  <li>(b) Make an appropriate comment on the relationship between Gaming Hours and Test Score.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> <strong className="text-white">-0.5082</strong></p>
                  <p className="text-slate-400 text-sm mt-1">(This must be stated explicitly as a number, pulled from the 'cor' value at the bottom of the software output).</p>
                </div>
                <div>
                  <p><strong>(b)</strong> There is a <strong>moderate negative correlation</strong> between the number of hours spent gaming and the concentration test score.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "linear-regression",
        title: "Linear Regression",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Linear regression is a statistical method used to model the relationship between two numerical variables. We use it to draw a "line of best fit" through a scatterplot, which allows us to make predictions.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Equation of the Regression Line</h4>
                <p className="mb-2">
                  The equation of a straight line is typically written as <code className="text-blue-300 font-mono">y = mx + c</code> or <code className="text-blue-300 font-mono">y = c + mx</code>, where <code className="text-blue-300 font-mono">m</code> is the slope (gradient) and <code className="text-blue-300 font-mono">c</code> is the y-intercept.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    In R Studio, we generate this equation using the command <code className="text-blue-300 font-mono">lm(Y~X)</code> (which stands for linear model).
                  </li>
                  <li>
                    The R Studio output will provide two "Coefficients". The <code className="text-blue-300 font-mono">(Intercept)</code> is the y-intercept, and the value next to the independent variable is the slope.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Interpreting the Slope and Intercept (The SQA Rules)</h4>
                <p className="mb-2">
                  When asked to interpret these parameters, you must relate them directly to the context of the data:
                </p>
                <div className="space-y-3 mt-2">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <p><strong className="text-purple-300">Slope:</strong></p>
                    <p className="font-mono text-sm mt-1 text-slate-300">"For every additional 1 [unit] of [Independent Variable], the [Dependent Variable] increases/decreases by [Slope value]"</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <p><strong className="text-purple-300">Intercept:</strong></p>
                    <p className="font-mono text-sm mt-1 text-slate-300">"If the [Independent Variable] is 0, the estimated [Dependent Variable] would be [Intercept value]"</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-200 font-semibold mb-1">Note:</p>
                  <p className="text-amber-100/80">
                    Sometimes the intercept is mathematically correct but physically impossible in real life (e.g., negative time, or a negative weight). You may be asked to point this out.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Making Predictions &amp; Assessing Reliability</h4>
                <p className="mb-2">
                  You can make predictions either by substituting an x-value into your equation, or by using the R Studio predict command: <code className="text-blue-300 font-mono">predict(lm(Y~X), newdata=data.frame(X=C), interval="pred")</code>.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>When reading the output of a predict command, the predicted value is always the number listed under <strong>fit</strong>.</li>
                  <li>
                    <strong className="text-emerald-300">Reliability:</strong> A prediction is only reliable if it is an <strong>interpolation</strong> — meaning the value you are testing is strictly within the range of the data used to make the model, and the model has a strong correlation.
                  </li>
                  <li>
                    If you make a prediction using a value outside the original data range, this is called <strong>extrapolation</strong> and is generally unreliable.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "linear-regression-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Extracting the Equation and Interpreting</strong></p>
                <p>A researcher is investigating the relationship between the number of hours of sunshine in a day and the number of ice creams sold at a local kiosk. They use statistical software and generate the following output:</p>
                <div className="bg-slate-900/80 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-700/50 my-3">
                  <p>Call:</p>
                  <p>lm(formula = Sales ~ Sunshine)</p>
                  <p className="mt-2">Coefficients:</p>
                  <p>(Intercept)      Sunshine</p>
                  <p>      15.4          22.8</p>
                </div>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State the equation of the regression line.</li>
                  <li>(b) Interpret the slope and intercept parameters in the context of the data.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Sales = 15.4 + 22.8 &times; Sunshine</p>
                </div>
                <div>
                  <p><strong>(b)</strong></p>
                  <ul className="list-none space-y-2 mt-2">
                    <li><strong>Slope:</strong> For every additional 1 hour of sunshine, the number of ice creams sold increases by 22.8.</li>
                    <li><strong>Intercept:</strong> On a day with 0 hours of sunshine, the estimated number of ice creams sold would be 15.4.</li>
                  </ul>
                </div>
              </div>
            )
          },
          {
            id: "linear-regression-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: R Studio Predictions and Interpolation</strong></p>
                <p>A car manufacturer models the relationship between the weight of a car (in kg) and its fuel efficiency (in miles per gallon, mpg). The data used to build the model ranges from car weights of 900 kg to 1800 kg. There is a strong negative correlation between the variables.</p>
                <p>The manufacturer uses R Studio to predict the fuel efficiency of a car that weighs 1400 kg:</p>
                <div className="bg-slate-900/80 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-700/50 my-3">
                  <p>{`> predict(lm(Efficiency~Weight),newdata=data.frame(Weight=1400),interval="pred")`}</p>
                  <p>       fit      lwr      upr</p>
                  <p>1 45.32104 38.11542 52.52666</p>
                </div>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State the estimated fuel efficiency for a car weighing 1400 kg.</li>
                  <li>(b) Comment on the reliability of this predicted value.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> <strong>45.3 mpg</strong></p>
                  <p className="text-slate-400 text-sm mt-1">(The value is taken directly from the 'fit' column).</p>
                </div>
                <div>
                  <p><strong>(b)</strong> The prediction is <strong>reliable</strong> because 1400 kg is within the range of the data used to make the model (900 kg to 1800 kg). It is an <strong>interpolation</strong> based on a strong linear model.</p>
                </div>
              </div>
            )
          },
          {
            id: "linear-regression-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Extrapolation and Impossible Intercepts</strong></p>
                <p>A fitness instructor tracks the distance their clients run on a treadmill (in km) against the number of calories burned. The running distances recorded range from 2 km to 10 km. The equation of the regression line is found to be:</p>
                <div className="bg-slate-900/80 p-4 rounded-md font-mono text-sm border border-slate-700/50 my-3 text-center">
                  <p>Calories = -35.2 + 65.5 &times; Distance</p>
                </div>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) Estimate the number of calories burned by a client who runs 25 km, and comment on the accuracy of this prediction.</li>
                  <li>(b) Use the intercept parameter to explain why this mathematical model is not entirely realistic.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Calories = -35.2 + (65.5 &times; 25) = <strong>1602.3 calories</strong>.</p>
                  <p className="mt-2">This prediction is unlikely to be accurate because 25 km is far outside the range of the observed data (2 km to 10 km). This is an <strong>extrapolation</strong>.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> The intercept is <strong>-35.2</strong>.</p>
                  <p className="mt-2">This means that if a client runs 0 km, they would burn -35.2 calories, which is physically <strong>impossible</strong>.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "hypothesis-testing",
        title: "Hypothesis Testing & Errors",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Hypothesis testing is a statistical method used to draw conclusions about a whole population based on a smaller sample of data. It removes subjective guesswork and allows us to make decisions free from bias.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Formulating Hypotheses</h4>
                <p className="mb-2">Every statistical test starts with two opposing statements:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-blue-300">Null Hypothesis (H<sub>0</sub>):</strong> A statement that nothing unusual is happening. It usually states that there is no difference, no relationship, or no effect.
                  </li>
                  <li>
                    <strong className="text-blue-300">Alternative Hypothesis (H<sub>1</sub> or H<sub>a</sub>):</strong> A statement that something is happening. It states that there is a difference, relationship, or effect.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The p-value and Making a Decision</h4>
                <p className="mb-2">
                  When you run a test in statistical software, it generates a <strong>p-value</strong>. This is the probability of getting your observed results purely by random chance if the null hypothesis is true. We test this against a standard 95% significance level (a 0.05 threshold):
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-emerald-300">If p &lt; 0.05:</strong> The result is statistically significant. You must <strong>reject</strong> the null hypothesis.
                  </li>
                  <li>
                    <strong className="text-emerald-300">If p &ge; 0.05:</strong> The result is not statistically significant. You must <strong>fail to reject</strong> the null hypothesis.
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <p className="text-rose-200 font-semibold mb-1">Massive SQA Trap:</p>
                  <p className="text-rose-100/80">
                    Never write "we accept the null hypothesis". You can never be 100% certain it is true, so you must always use the phrase <strong>"fail to reject"</strong>.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Statistical Errors</h4>
                <p className="mb-2">
                  Because hypothesis testing is based on probabilities (with a 95% confidence level), we will naturally make the wrong decision 1 in 20 times.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-purple-300">Type I Error (False Positive):</strong> Rejecting the null hypothesis when it is actually true. <span className="text-slate-400">(e.g., Concluding a drug works when it actually does nothing).</span>
                  </li>
                  <li>
                    <strong className="text-purple-300">Type II Error (False Negative):</strong> Failing to reject the null hypothesis when it is actually false. <span className="text-slate-400">(e.g., Concluding a drug does nothing, when in reality it does work).</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. Confounding Variables</h4>
                <p className="mb-2">
                  Sometimes a test shows a significant result, but the two variables are not actually causing the change in each other. A <strong>confounding variable</strong> is an outside, hidden influence that is changing both variables simultaneously, potentially leading to incorrect conclusions.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "hypothesis-testing-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Writing Hypotheses in Context</strong></p>
                <p>A sports scientist wants to investigate whether a new brand of running shoe changes the mean sprint times of professional athletes. State the appropriate null (H<sub>0</sub>) and alternative (H<sub>1</sub>) hypotheses for this study.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>H<sub>0</sub>:</strong> There is no difference in the mean sprint times of athletes wearing the new shoes compared to their normal shoes.</p>
                <p><strong>H<sub>1</sub>:</strong> There is a difference in the mean sprint times of athletes wearing the new shoes compared to their normal shoes.</p>
                <p className="text-slate-400 text-sm mt-1">(Note: Always include the context and specify the measure, such as 'mean', to get the mark).</p>
              </div>
            )
          },
          {
            id: "hypothesis-testing-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Interpreting a p-value &lt; 0.05</strong></p>
                <p>A researcher runs a statistical test to determine if there is a relationship between the number of hours students spend studying and their final exam score. The software generates a p-value of 0.014. Interpret the p-value and the result of the hypothesis test in context.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Since the p-value (0.014) is less than 0.05, we <strong>reject the null hypothesis</strong>.</p>
                <p>Therefore, there is statistically significant evidence to suggest that there is a relationship between the number of hours students spend studying and their final exam scores.</p>
              </div>
            )
          },
          {
            id: "hypothesis-testing-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The SQA "Fail to Reject" Trap</strong></p>
                <p>A botanist is testing whether a new type of soil increases the mean height of tomato plants. An independent t-test generates a p-value of 0.182. A student concludes: <em>"Since 0.182 is greater than 0.05, we accept the null hypothesis. The soil makes no difference."</em></p>
                <p>Explain why the student's conclusion is statistically incorrect, and state what they should have written.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>It is incorrect because you can never definitively "accept" a null hypothesis.</p>
                <p>The student should have written: <em>"Since 0.182 &gt; 0.05, we <strong>fail to reject</strong> the null hypothesis. There is not enough evidence to suggest the soil increases the mean height."</em></p>
              </div>
            )
          },
          {
            id: "hypothesis-testing-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Type I and Type II Errors</strong></p>
                <p>A tech company is testing a new battery for their latest smartphone. Their null hypothesis is that the new battery lasts exactly the same amount of time as the old battery.</p>
                <p>Explain, in the context of this scenario, the meaning of:</p>
                <ul className="list-none space-y-1">
                  <li>(a) A Type I error.</li>
                  <li>(b) A Type II error.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a) A Type I error (false positive)</strong> would be concluding that the new battery lasts longer (or shorter) than the old one, when in reality there is no difference in battery life.</p>
                </div>
                <div>
                  <p><strong>(b) A Type II error (false negative)</strong> would be concluding that the new battery makes no difference to battery life, when in reality it actually does last longer (or shorter).</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "confidence-intervals",
        title: "Confidence Intervals & P Values",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              When we take a sample, the mean or proportion we calculate is only an estimate of the true population. Statistical software provides specific values to help us understand how reliable this estimate is, and whether we can make firm conclusions.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Understanding the p-value</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    A <strong>p-value</strong> is the probability that your observed data could have occurred purely by random chance, assuming that the null hypothesis is actually true.
                  </li>
                  <li>
                    A small p-value (typically less than 0.05) indicates that the result is statistically significant, providing evidence to <strong>reject</strong> the null hypothesis.
                  </li>
                  <li>
                    If the p-value is 0.05 or greater, there is not enough evidence to support a difference or relationship, meaning you must <strong>fail to reject</strong> the null hypothesis.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Confidence Intervals (CIs)</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    Because it is usually impossible to test an entire population, we cannot know the exact population mean or proportion. Instead, software generates a confidence interval—a range of values where there is a high probability (typically 95%) that the true population parameter lies.
                  </li>
                  <li>
                    Wider confidence intervals indicate more uncertainty in the data, whereas narrower confidence intervals indicate less uncertainty.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. The "100 Times" Rule (Crucial SQA Definition)</h4>
                <p className="mb-2">
                  If an exam question asks you to interpret what a 95% confidence interval <em>literally</em> means, you must memorise and use this exact phrasing:
                </p>
                <div className="mt-2 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-purple-200 font-medium italic">
                    "If you were to repeat the study 100 times, 95 of these times the true population mean (or proportion) would lie within the interval"
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. Confidence Intervals Containing Zero</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    When testing the difference between two groups (like in a t-test or z-test), the null hypothesis usually assumes the difference between them is exactly zero.
                  </li>
                  <li>
                    If your calculated 95% confidence interval ranges from a negative number to a positive number, it <strong>contains zero</strong>.
                  </li>
                  <li>
                    An interval containing zero provides further mathematical evidence that there might be no actual difference between the groups, supporting a decision to <strong>fail to reject</strong> the null hypothesis.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "ci-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The Literal Interpretation</strong></p>
                <p>A marine biologist takes a sample of adult dolphins and calculates their mean weight. The statistical software generates a 95% confidence interval for the mean weight of [155.2 kg, 168.4 kg]. Explain what is meant by a 95% confidence interval in this context.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>If the biologist were to repeat the study 100 times, they would expect the true population mean weight of the dolphins to lie within the calculated interval 95 times.</p>
              </div>
            )
          },
          {
            id: "ci-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Intervals Containing Zero</strong></p>
                <p>A nutritionist runs an independent t-test to see if there is a difference in the mean sugar content between Brand A and Brand B cereal. The software generates a p-value of 0.612 and a 95% confidence interval for the difference in means of [-1.45g, 2.15g].</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State whether the nutritionist should reject or fail to reject the null hypothesis.</li>
                  <li>(b) Explain how the confidence interval supports this decision.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Since the p-value (0.612) is greater than 0.05, the nutritionist must <strong>fail to reject</strong> the null hypothesis.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> We can be 95% confident that the true mean difference in sugar content lies between -1.45g and 2.15g. Because this interval <strong>contains zero</strong>, it provides further evidence that there may be absolutely no difference in the mean sugar content between the two brands.</p>
                </div>
              </div>
            )
          },
          {
            id: "ci-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Combining p-values and Confidence Intervals</strong></p>
                <p>A driving instructor believes that pupils who take lessons in the morning have a higher pass rate proportion than those who take lessons in the evening. They run a 2-sample test for equality of proportions. The software outputs a p-value of 0.014 and a 95% confidence interval for the difference of [0.035, 0.125].</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) Interpret the p-value and the result of the test in the context of the instructor's belief.</li>
                  <li>(b) Explain how the confidence interval supports this conclusion.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Since the p-value (0.014) is less than 0.05, we <strong>reject the null hypothesis</strong>. Therefore, there is statistically significant evidence to suggest that there is a difference in the proportion of pupils passing in the morning compared to the evening, supporting the instructor's belief.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> We can be 95% confident that the true difference in the proportions lies between 0.035 and 0.125. Because this interval <strong>does not contain zero</strong> (both numbers are positive), it provides further evidence that a true statistical difference exists between the two proportions.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "correlation-tests",
        title: "Correlation Tests",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              A correlation test is used to explore whether a statistically significant linear relationship exists between two numerical variables. Remember, even if a strong relationship is found, no variables are being directly manipulated, so we cannot establish cause and effect (correlation does not imply causation).
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Formulating Hypotheses for Correlation</h4>
                <p className="mb-2">For a correlation test, the hypotheses are always written in terms of a "relationship":</p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-blue-300">Null Hypothesis (H<sub>0</sub>):</strong> There is no relationship between [Variable 1] and [Variable 2].
                  </li>
                  <li>
                    <strong className="text-blue-300">Alternative Hypothesis (H<sub>1</sub>):</strong> There is a relationship between [Variable 1] and [Variable 2].
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Performing the Test in R Studio</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>The code used to run this test is <code>cor.test(X, Y)</code>.</li>
                  <li>This command outputs three vital pieces of information that you must be able to extract and interpret: the <strong>p-value</strong>, the <strong>correlation coefficient (cor)</strong>, and the <strong>95 percent confidence interval</strong>.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Interpreting the Output (The SQA Rules)</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-emerald-300">The p-value:</strong> Look at the p-value. If p &lt; 0.05, you <strong>reject</strong> the null hypothesis and conclude there is evidence of a relationship. If p &ge; 0.05, you <strong>fail to reject</strong> the null hypothesis.
                  </li>
                  <li>
                    <strong className="text-emerald-300">The Correlation Coefficient (cor):</strong> This is found at the very bottom of the R Studio output under <code>sample estimates: cor</code>. You must use this number to comment on the <strong>strength</strong> (weak, moderate, strong) and <strong>direction</strong> (positive, negative) of the linear relationship.
                  </li>
                  <li>
                    <strong className="text-emerald-300">The Confidence Interval:</strong> We can be 95% confident that the true population correlation lies between the two numbers given in the interval.
                    <ul className="list-circle list-inside ml-8 space-y-1 mt-1 text-slate-400">
                      <li>If the interval <strong>contains zero</strong> (i.e., it goes from a negative number to a positive number), the true correlation could be 0. This strongly supports a decision to <strong>fail to reject</strong> the null hypothesis.</li>
                      <li>If the interval <strong>does not contain zero</strong>, it provides further statistical evidence that a relationship truly exists.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "correlation-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Significant Relationship & Output Interpretation</strong></p>
                <p>A researcher is investigating whether there is a relationship between the number of hours athletes spend practising a specific drill per week and their success rate (%) in matches. They run a correlation test in R Studio and get the following output:</p>
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-md font-mono text-xs text-slate-300 my-4">
                  <p>Pearson's product-moment correlation</p>
                  <p>data:  Practice.Hours and Success.Rate</p>
                  <p>t = 5.342, df = 45, p-value = 0.00000281</p>
                  <p>alternative hypothesis: true correlation is not equal to 0</p>
                  <p>95 percent confidence interval:</p>
                  <p> 0.485122 0.812344</p>
                  <p>sample estimates:</p>
                  <p>      cor</p>
                  <p> 0.684511</p>
                </div>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State the appropriate null and alternative hypotheses for this test.</li>
                  <li>(b) Interpret the p-value and the result of the hypothesis test in context.</li>
                  <li>(c) Make a comment about the correlation coefficient.</li>
                  <li>(d) Interpret the confidence interval and explain how it supports your conclusion.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong></p>
                  <p><strong>H<sub>0</sub>:</strong> There is no relationship between practice hours and success rate.</p>
                  <p><strong>H<sub>1</sub>:</strong> There is a relationship between practice hours and success rate.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> Since the p-value (0.00000281) is less than 0.05, we <strong>reject the null hypothesis</strong>. There is evidence to suggest a statistically significant relationship between practice hours and success rate.</p>
                </div>
                <div>
                  <p><strong>(c)</strong> The correlation coefficient is 0.6845, which indicates a <strong>moderate positive correlation</strong> between practice hours and success rate.</p>
                </div>
                <div>
                  <p><strong>(d)</strong> We can be 95% confident that the true population correlation lies between 0.4851 and 0.8123. Because this interval <strong>does not contain zero</strong>, it provides further evidence that a true positive correlation exists.</p>
                </div>
              </div>
            )
          },
          {
            id: "correlation-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Failing to Reject the Null Hypothesis</strong></p>
                <p>A student tests whether there is a relationship between a person's shoe size and their typing speed in words per minute (WPM). The R Studio output generates a p-value of 0.415 and a 95% confidence interval of [-0.215, 0.455]. The sample correlation estimate (cor) is 0.112.</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State whether the student should reject or fail to reject the null hypothesis, and state their conclusion in context.</li>
                  <li>(b) Use the correlation coefficient and the confidence interval to justify why this was the correct decision.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Since the p-value (0.415) is greater than 0.05, the student must <strong>fail to reject</strong> the null hypothesis. There is no evidence to suggest a relationship between shoe size and typing speed.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> The correlation coefficient of 0.112 is very close to zero, indicating almost no linear relationship. Furthermore, the 95% confidence interval [-0.215, 0.455] <strong>contains zero</strong>, meaning it is entirely possible that the true population correlation is exactly 0.</p>
                </div>
              </div>
            )
          },
          {
            id: "correlation-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Predictions and Extrapolation</strong></p>
                <p>Following on from the practice hours and success rate study in Example 1, the researcher notes that the practice hours recorded in their sample ranged from 2 hours to 10 hours. They use software to predict the success rate of an athlete who practises for 25 hours a week. Comment on the likely accuracy of this prediction.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>This prediction is unlikely to be accurate. Although there is a positive correlation, 25 hours is far above the maximum value of 10 hours observed in the sample data. Predicting outside the range of the data is called <strong>extrapolation</strong> and is generally unreliable.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "z-tests",
        title: "Z Tests",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              While t-tests are used to compare the means of numerical data, a z-test (specifically a 2-sample test for equality of proportions) is used to analyse categorical data to compare the proportions of two different groups.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Performing the Test in R Studio</h4>
                <p className="mb-2">In R Studio, the command used to perform this test is <code className="text-blue-300 font-mono">prop.test(x = c(a, b), n = c(n1, n2))</code>.</p>
                <p>
                  In this formula, <code className="text-slate-400 font-mono">x</code> represents the number of "successes" (the specific event of interest) for group A and group B, and <code className="text-slate-400 font-mono">n</code> represents the total number of observations (the sample size) for group A and group B.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Formulating Hypotheses for Z-Tests (The "Proportion" Trap)</h4>
                <div className="mt-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg mb-4">
                  <p className="text-rose-200 font-semibold mb-1">Massive SQA Trap:</p>
                  <p className="text-rose-100/80">
                    Just as t-tests require the word "mean", z-test hypotheses must explicitly use the word <strong>proportion</strong> (or percentage).
                  </p>
                </div>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-blue-300">Null Hypothesis (H<sub>0</sub>):</strong> There is no difference in the proportion of [Variable] between [Group A] and [Group B].
                  </li>
                  <li>
                    <strong className="text-blue-300">Alternative Hypothesis (H<sub>1</sub>):</strong> There is a difference in the proportion of [Variable] between [Group A] and [Group B].
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Interpreting the Output</h4>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-emerald-300">The p-value:</strong> If p &lt; 0.05, you <strong>reject</strong> the null hypothesis (there is a statistically significant difference in the proportions). If p &ge; 0.05, you <strong>fail to reject</strong> the null hypothesis (there is not enough evidence to suggest a difference).
                  </li>
                  <li>
                    <strong className="text-emerald-300">The Confidence Interval:</strong> This gives the 95% confidence interval for the true difference between the two proportions.
                    <ul className="list-circle list-inside ml-8 space-y-1 mt-1 text-slate-400">
                      <li>If the interval <strong>contains zero</strong> (goes from a negative number to a positive number), it provides further evidence that there is no statistically significant difference between the proportions.</li>
                      <li>If the interval <strong>does not contain zero</strong>, it provides further evidence that a statistical difference between the proportions truly exists.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "z-test-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Generating the R Studio Code</strong></p>
                <p>A driving instructor wants to compare the first-time pass rates of pupils learning in a manual car versus an automatic car.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300">
                  <li>Out of 150 pupils who learned in a manual car, 82 passed first time.</li>
                  <li>Out of 120 pupils who learned in an automatic car, 78 passed first time.</li>
                </ul>
                <p>State the exact R Studio command required to perform a 2-sample test for equality of proportions for this data.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><code className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-blue-300 font-mono">prop.test(x = c(82, 78), n = c(150, 120))</code></p>
              </div>
            )
          },
          {
            id: "z-test-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Writing Hypotheses in Context</strong></p>
                <p>A quality control manager is investigating whether there is a difference in the defect rate between two manufacturing machines. Machine A produced 14 defective items out of 500. Machine B produced 22 defective items out of 450. State the appropriate null and alternative hypotheses for this investigation.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>H<sub>0</sub>:</strong> There is no difference in the proportion of defective items produced by Machine A and Machine B.</p>
                <p><strong>H<sub>1</sub>:</strong> There is a difference in the proportion of defective items produced by Machine A and Machine B.</p>
              </div>
            )
          },
          {
            id: "z-test-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Interpreting a Z-Test (Failing to Reject H<sub>0</sub>)</strong></p>
                <p>A market researcher surveys a sample of adults and a sample of teenagers to see if they prefer shopping online or in-store. They run a z-test to compare the proportion who prefer shopping online. The software generates a p-value of 0.214 and a 95% confidence interval for the difference in proportions of [-0.125, 0.042].</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) Interpret the p-value and the result of the hypothesis test in context.</li>
                  <li>(b) Explain how the confidence interval supports this conclusion.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Since the p-value (0.214) is greater than 0.05, we <strong>fail to reject</strong> the null hypothesis. There is not enough evidence to suggest a statistically significant difference between the proportion of adults and teenagers who prefer shopping online.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> We can be 95% confident that the true difference in the proportions lies between -0.125 and 0.042. Because this interval <strong>contains zero</strong>, it provides further evidence that there is no statistically significant difference between the two proportions.</p>
                </div>
              </div>
            )
          },
          {
            id: "z-test-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Interpreting a Z-Test (Rejecting H<sub>0</sub>)</strong></p>
                <p>A local council wants to know if there is a difference in the adoption of smart energy meters between City X and City Y.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300">
                  <li>In City X, 312 out of 500 surveyed households have a smart meter.</li>
                  <li>In City Y, 245 out of 550 surveyed households have a smart meter.</li>
                </ul>
                <p>The council runs a 2-sample test for equality of proportions. The p-value is 0.00012 and the 95% confidence interval is [0.115, 0.242].</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State whether the council should reject or fail to reject the null hypothesis, and state their conclusion in context.</li>
                  <li>(b) Use the confidence interval to justify why this was the correct decision.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> Since the p-value (0.00012) is less than 0.05, the council should <strong>reject</strong> the null hypothesis. There is statistically significant evidence to suggest that there is a difference in the proportion of households with a smart energy meter in City X compared to City Y.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> We can be 95% confident that the true difference in the proportions lies between 0.115 and 0.242. Because this interval <strong>does not contain zero</strong>, it provides further statistical evidence that a true difference in the proportions exists.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "mixed-hypothesis-tests",
        title: "Mixed Hypothesis Tests",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              In the real world, and specifically in your final SQA exam and project, you will not always be told which statistical test to run. You must be able to analyse the research question and the type of data provided to choose the correct test yourself.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Decision Tree for Choosing a Test</h4>
                <p className="mb-2">To select the correct test, ask yourself what type of data you are analysing and what you are trying to find out:</p>
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="font-medium text-white">Are you comparing two proportions or percentages?</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm text-slate-300">
                      <li><strong>Data Type:</strong> Categorical (e.g., Pass/Fail, Yes/No).</li>
                      <li><strong>Test to use:</strong> Z-test <span className="text-slate-400">(2-sample test for equality of proportions)</span>.</li>
                      <li><strong>Hypothesis Keyword:</strong> "Proportion".</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="font-medium text-white">Are you looking for a relationship between two numerical variables?</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm text-slate-300">
                      <li><strong>Data Type:</strong> Two numerical variables measured on the same subjects (e.g., Height and Weight).</li>
                      <li><strong>Test to use:</strong> Correlation Test.</li>
                      <li><strong>Hypothesis Keyword:</strong> "Relationship".</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="font-medium text-white">Are you comparing the averages of two completely separate groups?</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm text-slate-300">
                      <li><strong>Data Type:</strong> Numerical data, normally distributed, from two independent groups (e.g., Group A vs Group B).</li>
                      <li><strong>Test to use:</strong> Independent t-test.</li>
                      <li><strong>Hypothesis Keyword:</strong> "Mean".</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="font-medium text-white">Are you comparing the averages of the exact same group measured twice?</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm text-slate-300">
                      <li><strong>Data Type:</strong> Numerical data, normally distributed, from the same subjects (e.g., Before and After).</li>
                      <li><strong>Test to use:</strong> Paired t-test.</li>
                      <li><strong>Hypothesis Keyword:</strong> "Mean".</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Forming Conclusions (A Quick Recap)</h4>
                <p className="mb-2">Regardless of which test you choose, the rules for interpreting the R Studio output remain exactly the same:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>
                    <strong className="text-emerald-300">p &lt; 0.05:</strong> The result is statistically significant. You must <strong>reject</strong> the null hypothesis.
                  </li>
                  <li>
                    <strong className="text-emerald-300">p &ge; 0.05:</strong> The result is not statistically significant. You must <strong>fail to reject</strong> the null hypothesis.
                  </li>
                  <li>
                    <strong className="text-blue-300">Confidence Intervals:</strong> If the 95% confidence interval <strong>contains zero</strong>, it supports failing to reject the null hypothesis. If it <strong>does not contain zero</strong>, it provides further evidence to reject the null hypothesis.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "mixed-tests-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Identifying the Correct Test</strong></p>
                <p>A researcher is designing four different studies. State the most appropriate statistical hypothesis test for each study:</p>
                <ul className="list-none space-y-2 mt-2">
                  <li>(a) Investigating if there is a difference in the mean reaction times between professional athletes and amateur athletes.</li>
                  <li>(b) Investigating if there is a relationship between the number of hours a person spends sleeping and their concentration score.</li>
                  <li>(c) Investigating if there is a difference in the proportion of electric cars driven in Edinburgh compared to Glasgow.</li>
                  <li>(d) Investigating if there is a difference in the mean blood pressure of a group of patients before they take a new medication and one hour after they take it.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a) Independent t-test</strong> <span className="text-slate-400">(Comparing the means of two completely separate groups)</span>.</p>
                </div>
                <div>
                  <p><strong>(b) Correlation test</strong> <span className="text-slate-400">(Looking for a relationship between two numerical variables)</span>.</p>
                </div>
                <div>
                  <p><strong>(c) Z-test / 2-sample test for equality of proportions</strong> <span className="text-slate-400">(Comparing proportions from categorical data)</span>.</p>
                </div>
                <div>
                  <p><strong>(d) Paired t-test</strong> <span className="text-slate-400">(Comparing the means of the exact same group measured twice)</span>.</p>
                </div>
              </div>
            )
          },
          {
            id: "mixed-tests-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Formulating Hypotheses from a Scenario</strong></p>
                <p>A marine biologist has gathered categorical data on the number of male and female sea turtles that successfully migrate to a specific island. They want to know if gender affects migration success.</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State the statistical test the biologist should run.</li>
                  <li>(b) State the appropriate null (H<sub>0</sub>) and alternative (H<sub>1</sub>) hypotheses.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> A <strong>z-test</strong> (or a 2-sample test for equality of proportions).</p>
                </div>
                <div>
                  <p><strong>(b)</strong></p>
                  <p><strong>H<sub>0</sub>:</strong> There is no difference in the proportion of male and female sea turtles that successfully migrate.</p>
                  <p><strong>H<sub>1</sub>:</strong> There is a difference in the proportion of male and female sea turtles that successfully migrate.</p>
                </div>
              </div>
            )
          },
          {
            id: "mixed-tests-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Interpreting a Mixed Test Output</strong></p>
                <p>A psychologist wants to find out if listening to classical music changes students' test scores. They give 50 students a memory test in silence. The next day, they give the exact same 50 students a similar memory test while classical music plays. The data is found to be normally distributed.</p>
                <p>The psychologist runs the appropriate test in R Studio and receives a p-value of 0.003 and a 95% confidence interval of [-12.4, -4.2].</p>
                <ul className="list-none space-y-1 mt-2">
                  <li>(a) State the name of the statistical test the psychologist ran.</li>
                  <li>(b) Interpret the p-value and the result of the hypothesis test in context.</li>
                  <li>(c) Explain how the confidence interval supports this conclusion.</li>
                </ul>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p><strong>(a)</strong> A <strong>paired t-test</strong> <span className="text-slate-400">(Because the numerical data is normally distributed and comes from the same group tested twice)</span>.</p>
                </div>
                <div>
                  <p><strong>(b)</strong> Since the p-value (0.003) is less than 0.05, we <strong>reject the null hypothesis</strong>. There is statistically significant evidence to suggest that there is a difference in the mean memory test scores of students when listening to classical music compared to silence.</p>
                </div>
                <div>
                  <p><strong>(c)</strong> We can be 95% confident that the true difference in the mean scores lies between -12.4 and -4.2. Because this interval <strong>does not contain zero</strong>, it provides further statistical evidence that a true difference in the means exists.</p>
                </div>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "modelling",
    title: "Modelling",
    topics: [
      {
        id: "modelling-intro",
        title: "Introduction to Modelling",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>In the real world, we are often faced with problems involving variables that are difficult or entirely impossible to measure with absolute precision. To tackle this, we use mathematical modelling.</p>

            <h4 className="text-white font-semibold">1. What is a Mathematical Model?</h4>
            <p>A mathematical model is a way to produce a reasonable, "ballpark" approximation to a complex problem.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The primary goal is not to find one single "correct" or exact answer, but rather to calculate a highly educated and reasonable estimate.</li>
            </ul>

            <h4 className="text-white font-semibold">2. The Role of Assumptions</h4>
            <p>To build a model, we must make certain assumptions about the variables involved.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>These assumptions are based on information that we already know, or can sensibly guess, about the world around us.</li>
              <li>When creating a simple mathematical model, it is standard practice to intentionally ignore minor details and special cases to keep the calculations manageable.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <p className="text-sm italic">Note: As this introductory section focuses on the concept of modelling itself, the examples focus on identifying the sensible assumptions required before a calculation can take place.</p>
            </div>
          </div>
        ),
        examples: [
          {
            id: "modelling-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The School Commute</strong></p>
                <p>A student wants to model the total time they spend travelling to and from school in a typical year. State three sensible assumptions they would need to make to build this mathematical model.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>To build this model, the student must assume:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>The average time taken for a single, one-way journey to school (e.g., 20 minutes).</li>
                  <li>The number of days they actually attend school in a typical year (e.g., 190 days).</li>
                  <li>That they make exactly two journeys (one there, one back) on every single one of those days, ignoring any half-days, absences, or after-school clubs.</li>
                </ul>
              </div>
            )
          },
          {
            id: "modelling-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Cinema Trip</strong></p>
                <p>A cinema manager wants to model the total volume of popcorn sold on a typical Saturday. State three assumptions they would need to make to estimate this figure.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>To build this model, the manager must assume:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>The total number of customers who will visit the cinema on a typical Saturday.</li>
                  <li>The proportion (or percentage) of those customers who will actually purchase popcorn.</li>
                  <li>The average volume of a single portion of popcorn sold.</li>
                </ul>
              </div>
            )
          },
          {
            id: "modelling-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The Smartphone Battery</strong></p>
                <p>A tech reviewer is building a model to estimate how many times a smartphone is charged over its usable lifespan. State three assumptions required to construct this model.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>To build this model, the reviewer must assume:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>The total usable lifespan of the smartphone in years (e.g., 3 years).</li>
                  <li>The average number of times the phone is charged per week or per day.</li>
                  <li>That the user's charging behaviour remains completely constant over the entire lifespan of the device, ignoring battery degradation over time.</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "fermi-estimations",
        title: "Fermi Estimations",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>A <strong>Fermi Estimation</strong> is a specific type of mathematical model used to produce a fast, "ballpark" approximation for a quantity that is incredibly difficult—or completely impossible—to measure directly.</p>

            <h4 className="text-white font-semibold">1. Where does the name come from?</h4>
            <p>They are named after the Italian physicist Enrico Fermi, who was famous for his ability to make surprisingly accurate estimates using very little actual data. (He used these skills while working on the Manhattan Project during World War II).</p>

            <h4 className="text-white font-semibold">2. The Core Concept</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The primary goal of a Fermi estimation is not to find the exact, correct answer. The goal is to reach a logically sound and reasonable estimate.</li>
              <li>To do this, we must make sensible, educated assumptions based on our general knowledge of the world (e.g., assuming a typical human lifespan is 80 years, or a school year has 190 days).</li>
              <li>When calculating a Fermi estimation, it is standard practice to ignore minor details and special cases that would overcomplicate the maths.</li>
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 SQA Exam Rule 🚨</h4>
              <p>In an exam, you will rarely be penalised for the specific numbers you choose for your assumptions (as long as they are physically realistic). However, you must explicitly state your assumptions in writing before you do the calculation to be awarded the marks.</p>
            </div>
          </div>
        ),
        examples: [
          {
            id: "fermi-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The Lifetime Blinks</strong></p>
                <p>Estimate the total number of times a typical person will blink during their lifetime. State any assumptions you make.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Assumptions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>A typical person blinks roughly 15 times per minute.</li>
                  <li>A person is awake for 16 hours a day.</li>
                  <li>The average lifespan is 80 years.</li>
                </ul>
                <p><strong>Calculation:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Blinks per hour: <InlineMath math="15 \times 60 = 900 \text{ blinks}" /></li>
                  <li>Blinks per day: <InlineMath math="900 \times 16 \text{ hours} = 14{,}400 \text{ blinks}" /></li>
                  <li>Blinks per year: <InlineMath math="14{,}400 \times 365 \text{ days} = 5{,}256{,}000 \text{ blinks}" /></li>
                  <li>Lifetime blinks: <InlineMath math="5{,}256{,}000 \times 80 \text{ years} = 420{,}480{,}000 \text{ blinks}" />. (A reasonable Fermi estimate would be approximately 420 million blinks).</li>
                </ul>
              </div>
            )
          },
          {
            id: "fermi-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Coffee Commute</strong></p>
                <p>David buys a takeaway coffee every morning on his way to the office. At the end of the year, he reviews his bank statements and estimates he has spent a total of £840 on these morning coffees. Estimate the cost of a single cup of coffee. State any assumptions you make.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Assumptions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>David works 5 days a week.</li>
                  <li>He takes 4 weeks of annual leave a year (meaning he works 48 weeks a year).</li>
                  <li>He only buys exactly one coffee on his working days, and ignores bank holidays.</li>
                </ul>
                <p><strong>Calculation:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Total coffees bought: <InlineMath math="48 \text{ weeks} \times 5 \text{ days} = 240 \text{ coffees}" />.</li>
                  <li>Cost per coffee: <InlineMath math="£840 \div 240 = £3.50" />. (The estimated cost of a single coffee is £3.50).</li>
                </ul>
              </div>
            )
          },
          {
            id: "fermi-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The Teacher's Voice</strong></p>
                <p>Estimate the total number of words spoken by a secondary school teacher during their lessons in a typical academic year. State any assumptions you make.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Assumptions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>A teacher teaches for 5 hours a day, for the 190 days in a Scottish school year.</li>
                  <li>The teacher spends roughly 50% of the lesson time speaking.</li>
                  <li>The average speaking rate is 130 words per minute.</li>
                </ul>
                <p><strong>Calculation:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Total teaching hours per year: <InlineMath math="5 \text{ hours} \times 190 \text{ days} = 950 \text{ hours}" />.</li>
                  <li>Total speaking hours: <InlineMath math="50\% \text{ of } 950 = 475 \text{ hours}" />.</li>
                  <li>Total speaking minutes: <InlineMath math="475 \times 60 = 28{,}500 \text{ minutes}" />.</li>
                  <li>Total words: <InlineMath math="28{,}500 \times 130 = 3{,}705{,}000 \text{ words}" />. (A reasonable Fermi estimate would be approximately 3.7 million words).</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "modelling-graphs",
        title: "Modelling Situations With Graphs",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Graphs are an incredibly useful way to model mathematical situations because they allow us to instantly visualise how changing an input affects the final output.</p>
            <p>When analysing or sketching a graphical model, you must pay close attention to three main features:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>The Gradient (Slope):</strong> This represents the rate of change of the output. A steeper slope means a faster rate of change. A horizontal line means the rate of change is zero (the value is constant).</li>
              <li><strong>The Intercepts:</strong> The y-intercept represents the starting value or initial condition before any changes occur.</li>
              <li><strong>Changes in Behaviour:</strong> Look for points where the graph suddenly changes direction, curves, or flattens out, as these represent significant events in the real-life situation.</li>
            </ul>

            <h4 className="text-white font-semibold">Independent and Dependent Variables</h4>
            <p>In any 2D mathematical model, you must identify which variable is which based on the context:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Independent Variable (x-axis):</strong> The variable that is changed or controlled (the cause). It does not depend on the other variable. Time is almost always an independent variable.</li>
              <li><strong>Dependent Variable (y-axis):</strong> The variable being tested or measured (the effect). Its value depends entirely on the independent variable.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "graphs-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Identifying Variables</strong></p>
                <p>A local plumber charges a fixed call-out fee of £40, plus an additional £25 for every hour they spend working on the repair. A graph is to be drawn to model the total cost of hiring the plumber.</p>
                <p>(a) Identify the independent variable and state which axis it should be plotted on.</p>
                <p>(b) Identify the dependent variable and state which axis it should be plotted on.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> The independent variable is the time spent working in hours, and it should be plotted on the x-axis.</li>
                  <li><strong>(b)</strong> The dependent variable is the total cost, and it should be plotted on the y-axis (because the total cost depends entirely on how many hours the plumber works).</li>
                </ul>
              </div>
            )
          },
          {
            id: "graphs-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Interpreting Rates of Change</strong></p>
                <p>A conical glass vase (narrow at the bottom, widening out to a large circular opening at the top) is placed under a tap. Water pours into the vase at a completely constant rate. Describe the shape of the graph that would model the depth of the water in the vase over time.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> The graph would start with a steep positive gradient, but the curve would gradually flatten out (become less steep) over time.</p>
                <p><strong>Reasoning:</strong> Because the bottom of the vase is narrow, it takes very little water to increase the depth, so the depth increases rapidly at first. As the water reaches the wider sections of the vase, it takes much more water to raise the level, so the rate of change of the depth slows down.</p>
              </div>
            )
          },
          {
            id: "graphs-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Matching a Graph to a Story</strong></p>
                <p>A delivery driver's journey is tracked using GPS. The driver:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Drives at a steady speed along a motorway.</li>
                  <li>Gets stuck in a completely stationary traffic jam.</li>
                  <li>Once clear, drives at a very fast, steady speed to make up for lost time.</li>
                  <li>Slows down to navigate a residential housing estate at a steady, slow speed.</li>
                </ol>
                <p>Describe the four distinct sections of a distance-time graph that models this journey.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Section 1:</strong> A straight line with a moderate positive slope.</li>
                  <li><strong>Section 2:</strong> A completely flat, horizontal line (time increases, but distance does not).</li>
                  <li><strong>Section 3:</strong> A straight line with a very steep positive slope (steeper than section 1).</li>
                  <li><strong>Section 4:</strong> A straight line with a shallow positive slope (less steep than sections 1 and 3).</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "units-of-measure",
        title: "Units Of Measure",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>In mathematical modelling, paying close attention to units of measure is essential. You must ensure that your units make logical sense and remain consistent throughout your calculations.</p>

            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">🚨 Important SQA Note 🚨</h4>
              <p>Because this is Applications of Mathematics (not Physics or Chemistry), you are never expected to have prior scientific knowledge of complex units. You simply need to be able to substitute given units into a formula and simplify them.</p>
            </div>

            <h4 className="text-white font-semibold">1. Deriving Suitable Units of Measure</h4>
            <p>The units of an output variable are determined completely by the units of the input variables.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To find the final unit, simply replace the variables in the formula with their units and simplify (e.g., if measuring Speed = Distance / Time, and distance is in miles and time is in hours, the unit is miles/hours or mph).</li>
            </ul>

            <h4 className="text-white font-semibold">2. Consistency in Comparisons</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>When making a direct comparison between two quantities, the units must be consistent for the comparison to be valid.</li>
              <li>Even if two quantities seem related, there are often hidden variables or factors that must be assumed to be constant to make it a completely fair comparison. If these hidden variables change, the comparison becomes invalid.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Consistency in Formulae</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>When using a formula, the units of the variables must be consistent in how they are defined and how they relate to each other.</li>
              <li>For example, scaling up a measurement linearly (like doubling a length) does not mean the time taken or the volume will also double exactly. You must look out for these logical traps in exam questions.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "units-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Deriving Units via Substitution</strong></p>
                <p>A scientist is using the mathematical model <InlineMath math="R = \frac{Q}{P}" />. Given that <InlineMath math="P" /> is measured in grams (g) and <InlineMath math="Q" /> is measured in cubic centimetres (cm<InlineMath math="^3" />), deduce the units of measure for <InlineMath math="R" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> Substitute the units directly into the formula:</p>
                <BlockMath math="R = \frac{\text{cm}^3}{\text{g}}" />
                <p>The units of <InlineMath math="R" /> are grams per cubic centimetre (or g/cm<InlineMath math="^3" />).</p>
              </div>
            )
          },
          {
            id: "units-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Deriving Units (With Cancelling)</strong></p>
                <p>A factory machine's efficiency is modelled using the formula <InlineMath math="E = W \times T" />. Given that <InlineMath math="W" /> is measured in boxes per minute (boxes/min) and <InlineMath math="T" /> is measured in minutes (min), deduce the units of measure for <InlineMath math="E" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> Substitute the units into the formula:</p>
                <BlockMath math="E = \frac{\text{boxes}}{\text{min}} \times \text{min}" />
                <p>The 'minutes' cancel each other out. Therefore, the unit of <InlineMath math="E" /> is simply <strong>boxes</strong>.</p>
              </div>
            )
          },
          {
            id: "units-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Inconsistent Comparisons (Hidden Variables)</strong></p>
                <p>A courier company tracks two of its delivery vans. Van A uses 12 litres of diesel during its morning shift. Van B uses 18 litres of diesel during its morning shift. The manager concludes that Van A has a much more fuel-efficient engine. Explain why this conclusion may be invalid.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> The conclusion is invalid because we do not know the distance each van travelled. It is entirely possible that Van B drove a significantly longer distance than Van A during the morning shift, meaning it could actually be the more fuel-efficient van overall.</p>
              </div>
            )
          },
          {
            id: "units-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Inconsistent Logic in Formulae</strong></p>
                <p>A decorator takes 3 hours to paint the floor of a square room that has a length of 4 metres. They are hired to paint the floor of another square room that has a length of 8 metres. Because the length is doubled, the decorator estimates it will take exactly 6 hours to paint the new floor. Explain why this estimation is mathematically flawed.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> The estimation is flawed because the time taken to paint a floor depends on the area of the room, not just the length. (A 4m <InlineMath math="\times" /> 4m room has an area of 16m<InlineMath math="^2" />. An 8m <InlineMath math="\times" /> 8m room has an area of 64m<InlineMath math="^2" />. The area has actually quadrupled, not doubled, so the time estimate will be completely incorrect).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "errors-and-tolerance",
        title: "Errors And Tolerance",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>In mathematical modelling, measurements are rarely perfect. We must account for the fact that data often has a built-in level of uncertainty, which we call an error or tolerance.</p>

            <h4 className="text-white font-semibold">1. Absolute and Relative Errors</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Intended Value:</strong> The exact target value you are aiming for.</li>
              <li><strong>Absolute Error:</strong> The physical amount by which a measurement is allowed to vary above or below the intended value. For example, if a bottle contains 500ml <InlineMath math="\pm" /> 10ml, the absolute error is 10ml.</li>
              <li><strong>Limits / Tolerance:</strong> Using the absolute error gives us the acceptable range. The Upper Limit is the Intended Value + Absolute Error, and the Lower Limit is the Intended Value - Absolute Error.</li>
              <li><strong>Relative Error:</strong> Because a 10ml error is huge for a small medicine bottle but tiny for a swimming pool, we use relative error to make fair comparisons. It is usually expressed as a percentage: Relative Error = (Absolute Error <InlineMath math="\div" /> Intended Value) <InlineMath math="\times" /> 100.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Errors in Compound Measures (Min/Max Values)</h4>
            <p>When calculating a compound measure (like Speed = Distance <InlineMath math="\div" /> Time), the errors of the input variables dictate the limits of the output variable.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To find the <strong>Maximum</strong> possible value, you must use the largest possible numerator and the smallest possible denominator. (e.g., Max Speed = Max Distance <InlineMath math="\div" /> Min Time).</li>
              <li>To find the <strong>Minimum</strong> possible value, you use the smallest possible numerator and the largest possible denominator.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Estimating Errors by Adding</h4>
            <p>When a mathematical model involves multiplying or dividing two or more independent variables, you can estimate the total relative error of the final answer by simply adding the relative errors of the individual variables together.</p>

            <h4 className="text-white font-semibold">4. Accuracy vs. Precision</h4>
            <p>You must be able to clearly distinguish between these two terms:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Accuracy:</strong> How close a measured or estimated value is to the true, real-life value.</li>
              <li><strong>Precision:</strong> How exact or detailed a value is (usually indicated by the number of decimal places or significant figures). A highly precise number can still be completely inaccurate.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "errors-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Absolute and Relative Errors</strong></p>
                <p>A local bakery sells artisan loaves of bread. The intended weight of a loaf is 800g, but the baker allows a tolerance of <InlineMath math="\pm 24\text{g}" /> to account for moisture loss during baking.</p>
                <p>(a) State the absolute error of the bread's weight.</p>
                <p>(b) Calculate the relative error as a percentage.</p>
                <p>(c) State the lower and upper limits of the weight.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> The absolute error is 24g.</li>
                  <li><strong>(b)</strong> Relative Error = <InlineMath math="(24 \div 800) \times 100 = 3\%" />.</li>
                  <li><strong>(c)</strong> Lower Limit = <InlineMath math="800 - 24 = 776\text{g}" />. Upper Limit = <InlineMath math="800 + 24 = 824\text{g}" />.</li>
                </ul>
              </div>
            )
          },
          {
            id: "errors-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Compound Measures (Max / Min)</strong></p>
                <p>A rescue drone is programmed to fly a distance of 12km <InlineMath math="\pm" /> 0.5km. The flight time is measured as 40 minutes <InlineMath math="\pm" /> 2 minutes. Calculate the maximum possible average speed of the drone in km/minute.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Find the Maximum Distance: <InlineMath math="12 + 0.5 = 12.5\text{km}" />.</li>
                  <li>Find the Minimum Time: <InlineMath math="40 - 2 = 38\text{ minutes}" />.</li>
                  <li>Calculate Max Speed: Max Distance <InlineMath math="\div" /> Min Time = <InlineMath math="12.5 \div 38 = 0.3289\dots \text{ km/minute}" />.</li>
                </ul>
              </div>
            )
          },
          {
            id: "errors-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Estimating Errors in a Formula</strong></p>
                <p>A landscaper is ordering topsoil for a rectangular garden. The length of the garden is measured with a relative error of 4% and the width is measured with a relative error of 3%. The area is calculated by multiplying the length and the width. Estimate the relative error of the calculated area.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> Because the two variables are being multiplied together to find the area, we estimate the total relative error by adding their individual relative errors: <InlineMath math="4\% + 3\% = 7\%" />.</p>
              </div>
            )
          },
          {
            id: "errors-ex4",
            question: (
              <div className="space-y-2">
                <p><strong>Example 4: Accuracy vs. Precision</strong></p>
                <p>The exact population of a Scottish town is 18,452.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>A local newspaper reports the population as "approximately 18,000".</li>
                  <li>A rival newspaper reports the population as "exactly 21,452.5".</li>
                </ul>
                <p>Determine which report is more accurate, and which is more precise.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>The first report (18,000) is more <strong>accurate</strong> because the number is much closer to the true, actual population of 18,452.</li>
                  <li>The second report (21,452.5) is more <strong>precise</strong> because it is stated to a much more exact level of detail (one decimal place), even though the number itself is completely inaccurate.</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "recurrence-relations",
        title: "Recurrence Relations",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Recurrence relations describe how each term in a sequence relates to the ones that come before it. They are incredibly valuable for modelling and analysing processes that evolve over time, such as population growth or financial forecasting.</p>

            <h4 className="text-white font-semibold">1. The Structure of the Model</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>A recurrence relation is a formula which generates a sequence of numbers in which each term is a function of previous terms.</li>
              <li>It is often written using <InlineMath math="u_n" /> to represent the current value and <InlineMath math="u_{n+1}" /> to represent the next value.</li>
              <li>You must always state your initial value (the starting amount), which is denoted as <InlineMath math="u_0" />.</li>
            </ul>

            <h4 className="text-white font-semibold">2. Recurrence Relations in Spreadsheets (Excel)</h4>
            <p>At this level, we use spreadsheet software to do the hard work of calculating recurrence relations:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Setup:</strong> First, set up two columns. Call one column <InlineMath math="n" /> (for the time periods) and the other column <InlineMath math="u_n" /> (for the values).</li>
              <li><strong>Entering the Formula:</strong> In the first cell of the <InlineMath math="u_n" /> column, enter your initial value (<InlineMath math="u_0" />). In the second cell, type your equation starting with an <code className="bg-slate-700 px-1 rounded">=</code> sign, making sure to click and reference the cell directly above it.</li>
              <li><strong>Generate the Sequence:</strong> Click and drag the formula down to automatically fill the column and generate your sequence of numbers.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Long-Term Effects and Graphs</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>If you drag the spreadsheet formula down through many rows, you can see the long-term effect of the model. Sometimes, the numbers will eventually reach a limit and stabilise at a certain amount.</li>
              <li>You can easily visualise this long-term trend by highlighting your data in Excel, clicking 'Insert', and selecting an appropriate chart (like a scatter or line graph).</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "recurrence-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Setting up a Spreadsheet Model</strong></p>
                <p>A local town has a population of 8,500 people. Each year, the population grows by 3%. At the same time, 150 people leave the town each year to move to a nearby city.</p>
                <p>(a) Write down a recurrence relation to model the town's population.</p>
                <p>(b) Explain the steps required to calculate the population of the town over the next 5 years using a spreadsheet.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> <InlineMath math="u_{n+1} = 1.03u_n - 150" /> (where <InlineMath math="u_0 = 8500" />).</li>
                  <li><strong>(b)</strong> First, set up two columns called <InlineMath math="n" /> and <InlineMath math="u_n" />. In the <InlineMath math="n" /> column, fill in the numbers 0 to 5. In the <InlineMath math="u_n" /> column, enter the initial value of 8500 next to week 0. In the cell below it, type a formula to multiply the cell above by 1.03 and subtract 150. Finally, drag the formula down to fill the rows up to year 5.</li>
                </ul>
              </div>
            )
          },
          {
            id: "recurrence-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Extracting the Multiplier</strong></p>
                <p>A farmer adds 25 kg of compost to a field every month. Over the course of a month, 18% of the compost is absorbed by the soil or washed away. The farmer starts with an empty field (0 kg of compost). Write down a recurrence relation to describe the amount of compost in the field at the end of each month.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> If 18% is lost, then 82% remains. Therefore, the multiplier is 0.82.</p>
                <BlockMath math="u_{n+1} = 0.82u_n + 25" />
                <p>(where <InlineMath math="u_0 = 0" />).</p>
              </div>
            )
          },
          {
            id: "recurrence-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Finding the Long-Term Limit</strong></p>
                <p>Some trees in a local orchard are infested with pests. The trees are sprayed weekly with a pesticide that manufacturers claim will destroy 55% of all pests. However, between weekly sprayings, it is estimated that 400 new pests invade the trees. Initially, there are 1,500 pests.</p>
                <p>(a) Write down a recurrence relation for the number of pests in the trees.</p>
                <p>(b) Describe how to use a spreadsheet to determine what happens to the number of pests in the long term, and state the expected outcome.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> If 55% are destroyed, 45% survive. <InlineMath math="u_{n+1} = 0.45u_n + 400" /> (where <InlineMath math="u_0 = 1500" />).</li>
                  <li><strong>(b)</strong> Enter the starting value of 1500 in the spreadsheet and create a formula in the cell below to multiply the previous cell by 0.45 and add 400. Drag the formula down to generate a sequence of numbers. By looking at the extended list of numbers, we can see the long-term effect: the population stabilises and levels out at approximately 727 pests.</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "linear-relationships",
        title: "Linear Relationships",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Linear models are used to describe situations that involve a constant rate of change. This means that every time the input variable increases by one unit, the output variable changes by the exact same, fixed amount.</p>

            <h4 className="text-white font-semibold">1. The Structure of a Linear Model</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The formula for a linear model usually takes the form: <InlineMath math="y = a + bx" /> (or <InlineMath math="y = mx + c" />).</li>
              <li><InlineMath math="x" /> is the independent variable (the input, often time).</li>
              <li><InlineMath math="y" /> is the dependent variable (the output).</li>
            </ul>

            <h4 className="text-white font-semibold">2. The Intercept and the Gradient</h4>
            <p>To fully understand and interpret a linear model, you must be able to explain the two key parameters in the context of the real-life situation:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>The y-intercept (<InlineMath math="a" /> or <InlineMath math="c" />):</strong> This is the starting value. It represents the exact value of the dependent variable (<InlineMath math="y" />) when the independent variable (<InlineMath math="x" />) is exactly 0.</li>
              <li><strong>The Gradient or Slope (<InlineMath math="b" /> or <InlineMath math="m" />):</strong> This represents the rate of change. It tells us exactly how much the dependent variable changes for every single 1-unit increase in the independent variable.
                <ul className="list-disc list-inside space-y-1 ml-8">
                  <li>A positive gradient means the value is constantly increasing (growth).</li>
                  <li>A negative gradient means the value is constantly decreasing (decay).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-white font-semibold">3. Using the Model</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Evaluating:</strong> This simply means "plugging in the numbers" to predict a future value. You substitute a given value for <InlineMath math="x" /> into your formula to calculate <InlineMath math="y" />.</li>
              <li><strong>Comparing:</strong> You will often be asked to create two linear models and compare them to see which is more cost-effective or efficient for a specific value.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "linear-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Generating a Model (Positive Gradient)</strong></p>
                <p>At the start of the year, a new online streaming service launches with 250 founding subscribers. The platform steadily gains 65 new subscribers at the end of every week.</p>
                <p>(a) Write down a formula that models the relationship between the number of weeks since launch, <InlineMath math="w" />, and the total number of subscribers, <InlineMath math="S" />.</p>
                <p>(b) State the gradient of your linear model and explain what information it gives us in this context.</p>
                <p>(c) Use your formula to predict how many subscribers the platform will have after 12 weeks.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> <InlineMath math="S = 250 + 65w" /></li>
                  <li><strong>(b)</strong> The gradient is 65. This tells us that the total number of subscribers increases by exactly 65 for every 1 week that passes.</li>
                  <li><strong>(c)</strong> <InlineMath math="S = 250 + 65(12) = 250 + 780 = 1030" /> subscribers.</li>
                </ul>
              </div>
            )
          },
          {
            id: "linear-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Interpreting a Model (Negative Gradient)</strong></p>
                <p>A large 800-litre water tank develops a leak and begins to drain at a steady rate. The relationship between the time the tank has been leaking in minutes, <InlineMath math="t" />, and the volume of water remaining in litres, <InlineMath math="V" />, is modelled by the formula: <InlineMath math="V = 800 - 24t" /></p>
                <p>(a) State the y-intercept of this formula and explain what it tells us in context.</p>
                <p>(b) State the gradient and explain what it tells us.</p>
                <p>(c) Calculate exactly how many minutes it will take for the tank to become completely empty.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> The y-intercept is 800. This tells us that before the leak started (<InlineMath math="t = 0" />), the initial volume of water in the tank was 800 litres.</li>
                  <li><strong>(b)</strong> The gradient is -24. This tells us that the volume of water in the tank decreases by 24 litres for every 1 minute that passes.</li>
                  <li><strong>(c)</strong> The tank is completely empty when <InlineMath math="V = 0" />.
                    <BlockMath math="0 = 800 - 24t" />
                    <BlockMath math="24t = 800" />
                    <BlockMath math="t = 800 \div 24 = 33.33 \text{ minutes}" />
                  </li>
                </ul>
              </div>
            )
          },
          {
            id: "linear-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Comparing Two Linear Models</strong></p>
                <p>Two local garage mechanics charge different rates for labour.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Mechanic A charges a fixed inspection fee of £45, plus £30 per hour of labour.</li>
                  <li>Mechanic B charges a fixed inspection fee of £80, but only £15 per hour of labour.</li>
                </ul>
                <p>(a) Form an equation for both mechanics to model the total cost, <InlineMath math="C" />, of a repair taking <InlineMath math="h" /> hours.</p>
                <p>(b) Determine which mechanic would be cheaper to hire for a repair job that takes exactly 3 hours.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a) Mechanic A:</strong> <InlineMath math="C = 45 + 30h" />. <strong>Mechanic B:</strong> <InlineMath math="C = 80 + 15h" />.</li>
                  <li><strong>(b) Cost for Mechanic A:</strong> <InlineMath math="C = 45 + 30(3) = 45 + 90 = £135" />. <strong>Cost for Mechanic B:</strong> <InlineMath math="C = 80 + 15(3) = 80 + 45 = £125" />.</li>
                  <li><strong>Conclusion:</strong> Mechanic B is the cheaper option for a 3-hour repair job.</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "quadratic-relationships",
        title: "Quadratic Relationships",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Unlike linear models, which have a constant rate of change, quadratic models are used when the dependent variable increases and then decreases, or decreases and then increases.</p>

            <h4 className="text-white font-semibold">1. The Structure of a Quadratic Model</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The formula for a quadratic relationship is written in the form <InlineMath math="y = ax^2 + bx + c" />, where the most defining feature is the presence of a squared term (<InlineMath math="x^2" />).</li>
              <li>The graph of a quadratic model is a symmetrical curve called a <strong>parabola</strong>.</li>
              <li>A quadratic graph features a single turning point (either a maximum or minimum), a y-intercept, and sometimes x-intercepts (where the curve crosses the horizontal axis).</li>
            </ul>

            <h4 className="text-white font-semibold">2. The Shape of the Parabola</h4>
            <p>The overall shape of the graph is dictated entirely by the coefficient of the <InlineMath math="x^2" /> term:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Positive <InlineMath math="x^2" />:</strong> If the squared term is positive (e.g., <InlineMath math="2x^2" />), the graph forms a 'u' shape with a minimum turning point at the bottom.</li>
              <li><strong>Negative <InlineMath math="x^2" />:</strong> If the squared term is negative (e.g., <InlineMath math="-2x^2" />), the graph forms an 'n' shape with a maximum turning point at the top.</li>
            </ul>

            <h4 className="text-white font-semibold">3. Evaluating and Real-World Validity</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Evaluating</strong> simply means substituting a given input value into your formula to calculate the output.</li>
              <li>When evaluating real-world models, you must always consider the <strong>validity</strong> of your answers. Mathematical formulas will happily generate negative numbers indefinitely, but in the real world, things like physical height, time, or the number of objects cannot drop below zero.</li>
            </ul>

            <h4 className="text-white font-semibold">4. Quadratic Models in Spreadsheets</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To explore a quadratic model in Excel, you should generate a sequence of <InlineMath math="x" /> values that includes both negative and positive numbers to reveal the true shape of the curve.</li>
              <li>When typing your formula into the spreadsheet, you must use the <code className="bg-slate-700 px-1 rounded">^</code> symbol to indicate a power (e.g., <code className="bg-slate-700 px-1 rounded">^2</code> for squared) and the <code className="bg-slate-700 px-1 rounded">*</code> symbol for multiplication.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "quadratic-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Identifying the Shape in Context</strong></p>
                <p>A tech company is deciding what price to set for their new smartphone. If the price is too low, they will sell a lot of phones but make very little money. If the price is too high, they make a large profit per phone, but almost nobody will buy it. Explain why the relationship between the price of the phone and the company's total revenue could be modelled by a quadratic relationship, and state the expected shape of the graph.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> As the price increases from zero, the total revenue will initially increase. However, it will eventually hit a peak before decreasing again as the phones become too expensive for customers to afford.</p>
                <p>Because the revenue goes up and then comes back down, the graph will be an 'n' shape with a maximum turning point.</p>
              </div>
            )
          },
          {
            id: "quadratic-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Evaluating and Model Validity</strong></p>
                <p>A marine rescue team fires a distress flare vertically into the air. The height of the flare, <InlineMath math="h" /> (in metres), after <InlineMath math="t" /> seconds is modelled by the formula: <InlineMath math="h = 50t - 5t^2" /></p>
                <p>(a) Calculate the height of the flare after 4 seconds.</p>
                <p>(b) Calculate the height of the flare after 12 seconds, and explain why this shows the mathematical model is no longer valid at this time.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> <InlineMath math="h = 50(4) - 5(4^2) = 200 - 5(16) = 200 - 80 = 120" /> metres.</li>
                  <li><strong>(b)</strong> <InlineMath math="h = 50(12) - 5(12^2) = 600 - 5(144) = 600 - 720 = -120" /> metres.</li>
                  <li>This prediction is no longer valid because a height of -120 metres is physically impossible in this context. The flare would have hit the surface of the water (height = 0) and stopped, so the model should not be used beyond that point.</li>
                </ul>
              </div>
            )
          },
          {
            id: "quadratic-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Setting up a Spreadsheet Model</strong></p>
                <p>A student wants to use a spreadsheet to sketch a graph of the quadratic formula <InlineMath math="y = 15 + 4x - 2x^2" /> for <InlineMath math="x" /> values ranging from -5 to 5. Explain the steps required to set up this model and calculate the <InlineMath math="y" /> values in the spreadsheet.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Set up two columns, one titled <InlineMath math="x" /> and one titled <InlineMath math="y" />.</li>
                  <li>In the <InlineMath math="x" /> column, type the numbers -5, -4, and drag down to fill the column up to the number 5.</li>
                  <li>In the first cell of the <InlineMath math="y" /> column, type the formula <code className="bg-slate-700 px-1 rounded">= 15 + 4*A2 - 2*(A2^2)</code> (assuming the first <InlineMath math="x" /> value is located in cell A2).</li>
                  <li>Click and drag this formula down to automatically calculate the rest of the sequence before inserting a chart.</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "exponential-relationships",
        title: "Exponential Relationships",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>While linear models have a constant rate of change, exponential models describe situations where a quantity changes at a rate proportional to its current size.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Exponential Growth:</strong> As the input increases steadily, the output increases by progressively larger amounts (e.g., the spread of a virus, or population growth).</li>
              <li><strong>Exponential Decay:</strong> As the input increases steadily, the output decreases by progressively smaller amounts (e.g., the value of a car depreciating, or a hot drink cooling down).</li>
            </ul>

            <h4 className="text-white font-semibold">1. The Structure of an Exponential Model</h4>
            <p>The defining feature of an exponential model is that the independent variable (usually time, <InlineMath math="t" />, or <InlineMath math="x" />) is the power (the exponent). Models typically take one of two forms:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Without 'e':</strong> Written as <InlineMath math="y = a(b)^x" />.
                <ul className="list-disc list-inside space-y-1 ml-8">
                  <li><InlineMath math="a" /> is the starting (initial) value.</li>
                  <li><InlineMath math="b" /> is the multiplier (e.g., a 12% increase means <InlineMath math="b = 1.12" />; a 15% decrease means <InlineMath math="b = 0.85" />).</li>
                </ul>
              </li>
              <li><strong>With 'e':</strong> Written as <InlineMath math="y = Ae^{kx}" />.
                <ul className="list-disc list-inside space-y-1 ml-8">
                  <li>'<InlineMath math="e" />' is a mathematical constant (approximately 2.718) built into scientific calculators.</li>
                  <li><InlineMath math="A" /> is the starting (initial) value.</li>
                  <li>If the power <InlineMath math="kx" /> is positive, the model shows growth. If the power is negative (e.g., <InlineMath math="-kx" />), the model shows decay.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-white font-semibold">2. Evaluating an Exponential Formula</h4>
            <p>"Evaluating" simply means substituting a given value for the independent variable into the formula to predict an outcome. Because the power involves an unknown, the numbers in exponential growth models get very large, very quickly.</p>

            <h4 className="text-white font-semibold">3. Exponential Models in Spreadsheets (Excel)</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>When entering a formula into Excel that contains '<InlineMath math="e" />', you must use the <code className="bg-slate-700 px-1 rounded">EXP</code> command, and the power must be placed inside brackets. For example, the formula <InlineMath math="y = 400e^{0.5x}" /> would be typed into Excel as <code className="bg-slate-700 px-1 rounded">= 400 * EXP(0.5*A2)</code>.</li>
              <li><strong>Crucial Excel Rule:</strong> Excel cannot produce an exponential trendline on a graph if your dataset includes the exact coordinate (0,0). The exponential trendline option will be completely greyed out. You must delete the (0,0) value from your columns to get the option back.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "exponential-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Interpreting an Exponential Model (Without 'e')</strong></p>
                <p>A conservation charity is monitoring the population of a rare breed of bird on an island. They model the population, <InlineMath math="P" />, after <InlineMath math="t" /> years using the formula: <InlineMath math="P = 450(1.08)^t" /></p>
                <p>(a) State the initial population of the birds when the monitoring began.</p>
                <p>(b) State whether this model represents exponential growth or decay, and state the annual percentage change.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> The initial population is 450 birds (the number outside the bracket).</li>
                  <li><strong>(b)</strong> This model represents exponential growth because the multiplier (1.08) is greater than 1. The population is increasing by 8% each year.</li>
                </ul>
              </div>
            )
          },
          {
            id: "exponential-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Evaluating a Model (With 'e')</strong></p>
                <p>A scientist is testing a new water purification chemical. The concentration of bacteria, <InlineMath math="C" /> (in units per ml), remaining in the water <InlineMath math="m" /> minutes after the chemical is added is modelled by the formula: <InlineMath math="C = 8500e^{-0.04m}" /></p>
                <p>(a) State the initial concentration of the bacteria.</p>
                <p>(b) Calculate the expected concentration of bacteria remaining after 45 minutes.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>(a)</strong> The initial concentration is 8500 units per ml.</li>
                  <li><strong>(b)</strong> Substitute <InlineMath math="m = 45" /> into the formula:
                    <BlockMath math="C = 8500 \times e^{-0.04 \times 45}" />
                    <BlockMath math="C = 8500 \times e^{-1.8}" />
                    <BlockMath math="C = 1405.02 \text{ units per ml}" />
                  </li>
                </ul>
                <p>(Make sure you know how to find the <InlineMath math="e" /> button on your specific calculator!)</p>
              </div>
            )
          },
          {
            id: "exponential-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Spreadsheet Troubleshooting</strong></p>
                <p>A student is using Excel to model the spread of a computer virus on a school network. They have set up two columns: 'Time in Hours' and 'Computers Infected'. Their very first entry in the table is time = 0, computers infected = 0. When the student highlights their data and inserts a scatter graph, they find that the option to add an 'Exponential Trendline' is greyed out and cannot be clicked. Explain why this has happened and how the student can fix the issue.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Solution:</strong> Excel cannot calculate an exponential trendline if the dataset includes the exact coordinate (0,0). To fix this and make the trendline option available again, the student simply needs to delete the (0,0) data point from their spreadsheet.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "planning-decision-making",
    title: "Planning & Decision Making",
    topics: [
      {
        id: "pdm-intro",
        title: "Introduction to Planning & Decision Making",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>This section explores techniques such as project planning, critical path analysis, and other decision-making models to optimize outcomes.</p>
            <p>Key concepts include:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Activity networks and precedence tables</li>
              <li>Critical path analysis and float time</li>
              <li>Gantt charts</li>
            </ul>
          </div>
        ),
        examples: []
      },
      {
        id: "precedence-tables",
        title: "Precedence Tables",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Any project, whether it is baking a cake, building a house, or developing software, can be broken down into a set of separate, manageable activities. However, you cannot always do everything at once.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Dependencies and Constraints</h4>
                <p>
                  Some activities cannot be started until others have been completely finished. For example, when building a house, you cannot put the roof on before you have built the walls.
                </p>
                <p className="mt-2">
                  When an activity relies on another being finished, this is called a <strong>dependency</strong>. A dependency only refers to the activity that must happen immediately before the task in question.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. What is a Precedence Table?</h4>
                <p>
                  A precedence table helps you organise all the activities within a project. It clearly lists each task, its duration, and its constraints (which specific tasks must be completed before it can begin).
                </p>
                <p className="mt-2">
                  Tasks with "None" in the preceding task column are your starting points. These can begin immediately.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Drawing Basic Activity Networks</h4>
                <p>
                  You can turn a precedence table into a visual diagram (an activity network).
                </p>
                <p className="mt-2">
                  <strong>Strategy:</strong> Always find your starting point(s) first. Draw a node (a box) for each task containing its letter and its time duration, and use arrows to link them together in the correct order based on their dependencies.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "precedence-tables-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Interpreting a Precedence Table</strong></p>
                <p>A local cafe is preparing a large batch of homemade soup. The tasks involved are listed below.</p>
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Description</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Preceding Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Time (mins)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                      <tr><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">Chop vegetables</td><td className="px-3 py-2 text-sm">None</td><td className="px-3 py-2 text-sm">10</td></tr>
                      <tr><td className="px-3 py-2 text-sm">B</td><td className="px-3 py-2 text-sm">Prepare meat</td><td className="px-3 py-2 text-sm">None</td><td className="px-3 py-2 text-sm">8</td></tr>
                      <tr><td className="px-3 py-2 text-sm">C</td><td className="px-3 py-2 text-sm">Boil stock</td><td className="px-3 py-2 text-sm">None</td><td className="px-3 py-2 text-sm">5</td></tr>
                      <tr><td className="px-3 py-2 text-sm">D</td><td className="px-3 py-2 text-sm">Fry meat and vegetables</td><td className="px-3 py-2 text-sm">A, B</td><td className="px-3 py-2 text-sm">6</td></tr>
                      <tr><td className="px-3 py-2 text-sm">E</td><td className="px-3 py-2 text-sm">Combine ingredients into pot</td><td className="px-3 py-2 text-sm">C, D</td><td className="px-3 py-2 text-sm">2</td></tr>
                      <tr><td className="px-3 py-2 text-sm">F</td><td className="px-3 py-2 text-sm">Simmer soup</td><td className="px-3 py-2 text-sm">E</td><td className="px-3 py-2 text-sm">45</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>(a) State the tasks that can be started immediately.</p>
                <p>(b) Identify all the tasks that must be completely finished before the ingredients can be combined into the pot (Task E).</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>(a) Tasks A, B, and C can be started immediately because they have no preceding tasks.</p>
                <p>(b) Task E immediately depends on C and D. However, because D depends on A and B, all four tasks (A, B, C, and D) must physically be finished before Task E can begin.</p>
              </div>
            )
          },
          {
            id: "precedence-tables-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Drawing a Network Diagram</strong></p>
                <p>A student is setting up a new desktop computer. The table below lists the tasks and their dependencies.</p>
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Description</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Preceding Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Time (mins)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                      <tr><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">Unbox computer and monitor</td><td className="px-3 py-2 text-sm">None</td><td className="px-3 py-2 text-sm">5</td></tr>
                      <tr><td className="px-3 py-2 text-sm">B</td><td className="px-3 py-2 text-sm">Connect monitor to power</td><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">2</td></tr>
                      <tr><td className="px-3 py-2 text-sm">C</td><td className="px-3 py-2 text-sm">Connect computer to power</td><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">2</td></tr>
                      <tr><td className="px-3 py-2 text-sm">D</td><td className="px-3 py-2 text-sm">Connect monitor to computer</td><td className="px-3 py-2 text-sm">B, C</td><td className="px-3 py-2 text-sm">3</td></tr>
                      <tr><td className="px-3 py-2 text-sm">E</td><td className="px-3 py-2 text-sm">Connect keyboard and mouse</td><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">4</td></tr>
                      <tr><td className="px-3 py-2 text-sm">F</td><td className="px-3 py-2 text-sm">Turn on and run setup</td><td className="px-3 py-2 text-sm">D, E</td><td className="px-3 py-2 text-sm">15</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>Create a diagram showing the list of tasks, their durations, and their dependencies in the correct order.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Start with a single box for A. Since B, C, and E all depend on A, draw three arrows coming out of A leading to three separate boxes. D needs both B and C, so arrows from B and C will merge into D. Finally, F needs D and E, so arrows from D and E will merge into F.</p>
                <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center">
                  <PrecedenceNetworkExample2 />
                </div>
              </div>
            )
          },
          {
            id: "precedence-tables-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Calculating Total Time from a Diagram</strong></p>
                <p>Using the computer setup scenario from Example 2, calculate the minimum time it will take for the student to completely set up the computer.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>To find the total time, we must find the longest path through our activity network, because all parallel tasks must be finished before moving on.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Path 1 (via Monitor):</strong> A &rarr; B &rarr; D &rarr; F = 5 + 2 + 3 + 15 = 25 minutes.</li>
                  <li><strong>Path 2 (via Computer):</strong> A &rarr; C &rarr; D &rarr; F = 5 + 2 + 3 + 15 = 25 minutes.</li>
                  <li><strong>Path 3 (via Peripherals):</strong> A &rarr; E &rarr; F = 5 + 4 + 15 = 24 minutes.</li>
                </ul>
                <p className="mt-2">Because F cannot start until all preceding tasks are done, we must wait for the longest path to finish. Therefore, the total time taken is <strong>25 minutes</strong>.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "constructing-pert-charts",
        title: "Constructing PERT Charts",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              A PERT Chart (Programme Evaluation and Review Technique) is a visual activity network that is highly useful in project planning. Instead of just showing the order of tasks, it calculates the exact timeline of the project.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Node Structure</h4>
                <p>
                  In a PERT chart, every activity is represented by a box (a node) that usually contains three vital pieces of numerical information:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Duration:</strong> How long the task takes to complete.</li>
                  <li><strong>Earliest Start Time (EST):</strong> The absolute earliest time a task can begin.</li>
                  <li><strong>Latest End Time (LET):</strong> The latest time a task must be completely finished by to avoid delaying the entire project.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. The Forward Scan (Finding the EST)</h4>
                <p>
                  To find the Earliest Start Times, we perform a forward scan, working from left to right across the diagram:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>For the very first activities with no predecessors, the EST is always <strong>0</strong>.</li>
                  <li>For an activity with a single predecessor, the EST is simply the sum of the predecessor's EST and its duration.</li>
                  <li><strong>The 'Maximum' Rule:</strong> If an activity has multiple predecessors (arrows merging into it), you must calculate the sum (EST + duration) for every preceding task and take the <strong>maximum</strong> value. You must wait for the longest task to finish before moving on.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. The Backward Scan (Finding the LET)</h4>
                <p>
                  To find the Latest End Times, we perform a backward scan, working backwards from right to left:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>For the final activities with no successors, the LET is the total length of the project (the highest number found at the end of your forward scan).</li>
                  <li>For an activity with a single successor, the LET is the difference between its successor's LET and its duration.</li>
                  <li><strong>The 'Minimum' Rule:</strong> If an activity has multiple successors (arrows splitting out from it), you must calculate the difference (LET &minus; duration) for every succeeding task and take the <strong>minimum</strong> value.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. Start and End Boxes</h4>
                <p>
                  It is highly recommended to add a "START" box at the beginning of your diagram and an "END" box at the finish. These are not real activities, so they have a duration of 0. Using an END box guarantees you use the correct final LET for your backward scan and avoids costly exam mistakes.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "constructing-pert-charts-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: The Forward Scan (The 'Maximum' Rule)</strong></p>
                <p>A school is organising a theatrical play. Task E (Hold Dress Rehearsal) cannot begin until both Task C (Build Set) and Task D (Finalise Costumes) are completed.</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>Task C has an Earliest Start Time of 12 days and a duration of 5 days.</li>
                  <li>Task D has an Earliest Start Time of 14 days and a duration of 2 days.</li>
                </ul>
                <p className="mt-2">Calculate the Earliest Start Time (EST) for Task E.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>We must apply the 'Maximum' rule because Task E has multiple predecessors.</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>Path C finishes at: 12 + 5 = 17 days.</li>
                  <li>Path D finishes at: 14 + 2 = 16 days.</li>
                </ul>
                <p className="mt-2">We take the highest number. Therefore, the EST for Task E is <strong>17 days</strong>.</p>
              </div>
            )
          },
          {
            id: "constructing-pert-charts-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: The Backward Scan (The 'Minimum' Rule)</strong></p>
                <p>A film director is planning a shoot. Task B (Draft Script) must be completely finished before Task C (Film Scene 1) and Task D (Film Scene 2) can begin.</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>Task C takes 4 days and has a Latest End Time of 20 days.</li>
                  <li>Task D takes 6 days and has a Latest End Time of 25 days.</li>
                </ul>
                <p className="mt-2">Calculate the Latest End Time (LET) for Task B.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>We must apply the 'Minimum' rule because Task B has multiple successors.</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>Path C calculation: 20 &minus; 4 = 16 days.</li>
                  <li>Path D calculation: 25 &minus; 6 = 19 days.</li>
                </ul>
                <p className="mt-2">We take the lowest number. Therefore, the LET for Task B is <strong>16 days</strong>.</p>
              </div>
            )
          },
          {
            id: "constructing-pert-charts-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Constructing a Full PERT Chart</strong></p>
                <p>A small business is launching a new product. The table below lists the tasks, their dependencies, and durations in weeks.</p>
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Description</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Preceding Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Duration (weeks)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                      <tr><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">Market Research</td><td className="px-3 py-2 text-sm">None</td><td className="px-3 py-2 text-sm">3</td></tr>
                      <tr><td className="px-3 py-2 text-sm">B</td><td className="px-3 py-2 text-sm">Design Product</td><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">4</td></tr>
                      <tr><td className="px-3 py-2 text-sm">C</td><td className="px-3 py-2 text-sm">Order Materials</td><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">2</td></tr>
                      <tr><td className="px-3 py-2 text-sm">D</td><td className="px-3 py-2 text-sm">Manufacture</td><td className="px-3 py-2 text-sm">B, C</td><td className="px-3 py-2 text-sm">5</td></tr>
                      <tr><td className="px-3 py-2 text-sm">E</td><td className="px-3 py-2 text-sm">Launch Marketing</td><td className="px-3 py-2 text-sm">B</td><td className="px-3 py-2 text-sm">3</td></tr>
                      <tr><td className="px-3 py-2 text-sm">F</td><td className="px-3 py-2 text-sm">Deliver to Stores</td><td className="px-3 py-2 text-sm">D, E</td><td className="px-3 py-2 text-sm">1</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>Using the data, perform a forward and backward scan to determine the Earliest Start Time and Latest End Time for all tasks.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>To construct this, draw a START node leading to A. From A, arrows split to B and C. Both B and C merge into D. However, an arrow also goes from B to E. Finally, both D and E merge into F, which leads to an END node.</p>
                <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center">
                  <ConstructingPertExample3 />
                </div>
                
                <h5 className="font-semibold text-emerald-300 mt-4">Forward Scan (Left to Right - finding EST):</h5>
                <ul className="list-none space-y-1 text-sm ml-4">
                  <li><strong>START:</strong> EST = 0, Dur = 0.</li>
                  <li><strong>A:</strong> Preceded by START. EST = 0.</li>
                  <li><strong>B:</strong> Preceded by A (0 + 3 = 3). EST = 3.</li>
                  <li><strong>C:</strong> Preceded by A (0 + 3 = 3). EST = 3.</li>
                  <li><strong>D:</strong> Preceded by B (3 + 4 = 7) and C (3 + 2 = 5). Max is 7. EST = 7.</li>
                  <li><strong>E:</strong> Preceded by B (3 + 4 = 7). EST = 7.</li>
                  <li><strong>F:</strong> Preceded by D (7 + 5 = 12) and E (7 + 3 = 10). Max is 12. EST = 12.</li>
                  <li><strong>END:</strong> Preceded by F (12 + 1 = 13). Total project time is 13 weeks.</li>
                </ul>

                <h5 className="font-semibold text-rose-300 mt-4">Backward Scan (Right to Left - finding LET):</h5>
                <ul className="list-none space-y-1 text-sm ml-4">
                  <li><strong>END:</strong> LET = 13, Dur = 0.</li>
                  <li><strong>F:</strong> Succeeded by END (13 &minus; 0 = 13). LET = 13.</li>
                  <li><strong>E:</strong> Succeeded by F (13 &minus; 1 = 12). LET = 12.</li>
                  <li><strong>D:</strong> Succeeded by F (13 &minus; 1 = 12). LET = 12.</li>
                  <li><strong>C:</strong> Succeeded by D (12 &minus; 5 = 7). LET = 7.</li>
                  <li><strong>B:</strong> Succeeded by D (12 &minus; 5 = 7) and E (12 &minus; 3 = 9). Min is 7. LET = 7.</li>
                  <li><strong>A:</strong> Succeeded by B (7 &minus; 4 = 3) and C (7 &minus; 2 = 5). Min is 3. LET = 3.</li>
                </ul>
              </div>
            )
          }
        ]
      },
      {
        id: "interpreting-pert-charts",
        title: "Interpreting PERT Charts",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Once a PERT chart has been constructed and the forward and backward scans are complete, we can analyse the data to find out where a project has flexibility and where it does not.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Float Time (Slack Time)</h4>
                <p>
                  Some activities have more time available to be completed than they actually require, while others only have exactly enough time. This extra, flexible time is called the <strong>Float Time</strong> (or Slack Time).
                </p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <InlineMath math="\text{Float} = \text{Latest End Time} - \text{Earliest Start Time} - \text{Duration}" />
                </div>
                <p>
                  The float time must always be greater than or equal to zero.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Essential vs. Critical Activities</h4>
                <p>You must be able to clearly explain the difference between these two types of activities to a non-mathematician:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>
                    <strong>Essential Activity:</strong> An activity that is needed for the project to be finished, but it has some flexibility in its time constraints (<InlineMath math="\text{Float} > 0" />). A delay to an essential activity will not necessarily delay the overall project, provided the delay is shorter than the float time.
                  </li>
                  <li>
                    <strong>Critical Activity:</strong> An activity that has absolutely no flexibility (<InlineMath math="\text{Float} = 0" />). It must be completed exactly on schedule. Any delay to a critical activity will automatically delay the completion date of the entire project.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. The Critical Path</h4>
                <p>
                  The <strong>Critical Path</strong> is the sequence of connected critical activities that runs from the start of the project right through to the end.
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Every activity network will have at least one critical path, but it is possible for a project to have multiple.</li>
                  <li>The length of the critical path determines the absolute minimum time required to complete the whole project.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "interpreting-pert-charts-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Calculating Float and Identifying Activities</strong></p>
                <p>A local council is planning a summer festival. After completing a PERT chart, the project manager looks closely at two specific tasks:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>Task C (Book catering vans): Earliest Start Time = 14 days, Latest End Time = 26 days, Duration = 5 days.</li>
                  <li>Task F (Erect main stage): Earliest Start Time = 22 days, Latest End Time = 28 days, Duration = 6 days.</li>
                </ul>
                <p className="mt-2">(a) Calculate the float time for Task C and Task F.</p>
                <p>(b) State, with a valid reason, which of these tasks is a critical activity and which is an essential activity.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <ul className="list-none space-y-1 ml-4">
                    <li>Task C Float = <InlineMath math="26 - 14 - 5 = 7" /> days.</li>
                    <li>Task F Float = <InlineMath math="28 - 22 - 6 = 0" /> days.</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1">(b)</p>
                  <p className="ml-4">Task F is a <strong>critical activity</strong> because its float time is exactly zero.</p>
                  <p className="ml-4">Task C is an <strong>essential activity</strong> because its float time is greater than zero.</p>
                </div>
              </div>
            )
          },
          {
            id: "interpreting-pert-charts-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Interpreting the Critical Path</strong></p>
                <p>A software development team generates a PERT chart for a new app update. The table below shows the final node values calculated for each task.</p>
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Task</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Duration (weeks)</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Earliest Start Time</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-white">Latest End Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                      <tr><td className="px-3 py-2 text-sm">A</td><td className="px-3 py-2 text-sm">2</td><td className="px-3 py-2 text-sm">0</td><td className="px-3 py-2 text-sm">2</td></tr>
                      <tr><td className="px-3 py-2 text-sm">B</td><td className="px-3 py-2 text-sm">4</td><td className="px-3 py-2 text-sm">2</td><td className="px-3 py-2 text-sm">6</td></tr>
                      <tr><td className="px-3 py-2 text-sm">C</td><td className="px-3 py-2 text-sm">3</td><td className="px-3 py-2 text-sm">2</td><td className="px-3 py-2 text-sm">7</td></tr>
                      <tr><td className="px-3 py-2 text-sm">D</td><td className="px-3 py-2 text-sm">5</td><td className="px-3 py-2 text-sm">6</td><td className="px-3 py-2 text-sm">11</td></tr>
                      <tr><td className="px-3 py-2 text-sm">E</td><td className="px-3 py-2 text-sm">4</td><td className="px-3 py-2 text-sm">7</td><td className="px-3 py-2 text-sm">11</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>(a) Identify the critical path for this project.</p>
                <p>(b) State the minimum completion time for the entire project.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a) First, find the tasks with a float of zero (<InlineMath math="\text{LET} - \text{EST} - \text{Dur} = 0" />).</p>
                  <ul className="list-none space-y-1 ml-4 mt-2">
                    <li>A: <InlineMath math="2 - 0 - 2 = 0" /> (Critical)</li>
                    <li>B: <InlineMath math="6 - 2 - 4 = 0" /> (Critical)</li>
                    <li>C: <InlineMath math="7 - 2 - 3 = 2" /> (Essential)</li>
                    <li>D: <InlineMath math="11 - 6 - 5 = 0" /> (Critical)</li>
                    <li>E: <InlineMath math="11 - 7 - 4 = 0" /> (Critical)</li>
                  </ul>
                  <p className="mt-2 ml-4">
                    Because B precedes D (end of week 6), and C precedes E (end of week 7), the continuous path is <strong>A &rarr; B &rarr; D</strong>. 
                  </p>
                  <p className="text-sm text-slate-400 italic ml-4 mt-1">
                    (Note: Even though E has 0 float within its own branch boundaries based on these specific numbers, a true critical path must connect end-to-end governing the maximum duration).
                  </p>
                </div>
                <div>
                  <p>(b) The minimum completion time is <strong>11 weeks</strong> (the final LET of the project).</p>
                </div>
              </div>
            )
          },
          {
            id: "interpreting-pert-charts-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The Impact of Delays</strong></p>
                <p>A construction firm is building a new office block. The critical path for the project is exactly 45 weeks long.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Task G (Install Windows) is an essential activity with a float time of 4 weeks.</li>
                  <li>Task H (Plaster Walls) is a critical activity on the critical path.</li>
                </ul>
                <p className="mt-2">(a) Due to a supply chain issue, Task G is delayed by 3 weeks. State the impact this will have on the minimum completion time of the project, justifying your answer.</p>
                <p>(b) Due to staff illness, Task H is delayed by 2 weeks. Determine the new minimum completion time for the overall project.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <p className="ml-4">This will have <strong>no impact</strong> on the final completion time. Because Task G has a float of 4 weeks, a delay of 3 weeks can be entirely absorbed without affecting the overall schedule.</p>
                </div>
                <div>
                  <p className="mb-1">(b)</p>
                  <p className="ml-4">Because Task H is a critical activity, it has a float of 0. Therefore, a 2-week delay will instantly delay the whole project by 2 weeks.</p>
                  <p className="ml-4 mt-1">The new minimum completion time is <strong>45 + 2 = 47 weeks</strong>.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "gantt-charts",
        title: "Gantt Charts",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              While a PERT chart is excellent for calculating the maths behind a project, a <strong>Gantt Chart</strong> is a much better visual communication tool. It looks like a bar chart and makes it very easy to track day-to-day progress and schedule staff or resources.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Layout of a Gantt Chart</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Y-axis:</strong> The tasks are listed vertically down the side (usually from A to Z).</li>
                  <li><strong>X-axis:</strong> The time scale (hours, days, weeks) runs along the bottom.</li>
                  <li><strong>Task Blocks:</strong> A solid rectangular block is drawn to represent the exact duration of an activity. The block begins at the activity's Earliest Start Time (EST).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Representing Float Time</h4>
                <p>
                  If an activity is essential (not critical), it will have float time. This means there is a gap between when the activity finishes and its Latest End Time (LET).
                </p>
                <p className="mt-2">
                  On a Gantt chart, float time is usually represented by a lightly shaded box or a thin line extending out from the end of the solid duration block, stretching all the way to the LET.
                </p>
                <div className="mt-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                  <p className="font-semibold text-amber-300 mb-1">Massive SQA Trap:</p>
                  <p className="text-amber-100/80">
                    The SQA strict marking instructions state that colours <strong>cannot</strong> be used in exams. If you are asked to draw float time, you must use a different pattern (like cross-hatching) or a thin line, rather than switching from a blue pen to a red pen! Sometimes, an exam question will explicitly ask you to draw a Gantt chart <em>without</em> float times, so always read the question carefully.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Gantt vs PERT</h4>
                <p>You must be able to state the advantages and disadvantages of both charts:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Gantt Advantages:</strong> Highly visual, task durations can be easily compared at a glance, and it is very easy to see how many tasks are happening at the exact same time (great for scheduling workers).</li>
                  <li><strong>Gantt Disadvantages:</strong> Dependencies (which tasks rely on others) are much harder to visualise compared to the arrows on a PERT chart.</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "gantt-charts-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Interpreting a Gantt Chart</strong></p>
                <p>A project manager creates a Gantt chart for a garden landscaping project. The time is measured in days.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>The solid block for Task C starts at day 4 and ends at day 9.</li>
                  <li>A thin line (representing float) extends from the end of Task C at day 9, finishing at day 12.</li>
                </ul>
                <p className="mt-4">(a) State the Earliest Start Time and the Duration of Task C.</p>
                <p>(b) State the float time of Task C.</p>
                <p>(c) State the Latest End Time of Task C.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>(a) The Earliest Start Time is <strong>4 days</strong>. The duration is <strong>5 days</strong> (from day 4 to day 9).</p>
                <p>(b) The float time is <strong>3 days</strong> (from day 9 to day 12).</p>
                <p>(c) The Latest End Time is <strong>12 days</strong>.</p>
              </div>
            )
          },
          {
            id: "gantt-charts-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Constructing a Gantt Chart from ESTs</strong></p>
                <p>A student is planning to build a custom PC. They have calculated the following Earliest Start Times (EST) and durations (in hours):</p>
                <ul className="list-none ml-4 mt-2 space-y-1">
                  <li>Task A: EST = 0, Duration = 2</li>
                  <li>Task B: EST = 2, Duration = 3</li>
                  <li>Task C: EST = 2, Duration = 1</li>
                  <li>Task D: EST = 5, Duration = 2</li>
                </ul>
                <p className="mt-4">Describe exactly how to draw the solid blocks for Tasks A, B, C, and D on a Gantt chart.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Task A:</strong> Draw a solid block starting at 0 and finishing at 2.</li>
                  <li><strong>Task B:</strong> Draw a solid block starting at 2 and finishing at 5.</li>
                  <li><strong>Task C:</strong> Draw a solid block starting at 2 and finishing at 3.</li>
                  <li><strong>Task D:</strong> Draw a solid block starting at 5 and finishing at 7.</li>
                </ul>
              </div>
            )
          },
          {
            id: "gantt-charts-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Scheduling Resources (Exam Style)</strong></p>
                <p>A bakery is preparing a massive catering order. A Gantt chart is created to schedule the tasks. Looking at the chart, the manager notices that on Day 4, the solid blocks for Task B, Task D, and Task E overlap simultaneously. Every task in the bakery requires exactly one person to complete it, and a person can only work on one task at a time.</p>
                <p className="mt-4">(a) State the minimum number of staff required to work on Day 4 to keep the project on schedule.</p>
                <p>(b) Task E is an essential activity with a float time of 2 days. The manager only has 2 staff members available on Day 4. Explain how the manager could alter the schedule so the project is not delayed.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <p className="ml-4">Because three tasks overlap on Day 4, the bakery needs a minimum of <strong>3 staff members</strong>.</p>
                </div>
                <div>
                  <p className="mb-1">(b)</p>
                  <p className="ml-4">Because Task E has a float time of 2 days, the manager can simply delay the start of Task E until Day 5 or Day 6. This reduces the number of simultaneous tasks on Day 4 down to two, meaning the 2 available staff members can handle it without delaying the overall project.</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "calculating-basic-probabilities",
        title: "Calculating Basic Probabilities",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Probability measures the likelihood or chance of a specific outcome happening. We can describe probability using words like 'certain', 'likely', or 'impossible', but in mathematics, we measure it precisely as a fraction, decimal, or percentage.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Definitions and Terminology</h4>
                <p>To discuss probability accurately, you must understand the correct terminology:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Trial:</strong> The probability experiment you are looking at (e.g., rolling a dice, or selecting a person at random).</li>
                  <li><strong>Outcomes:</strong> All the possible results of the probability experiment. This is also referred to as the sample space.</li>
                  <li><strong>Event:</strong> The particular outcome you are interested in. This is also known as a "success".</li>
                  <li><strong>Notation:</strong> We use the letter P followed by brackets to denote probability. For example, P(Heads) means "the probability of the event of flipping a coin and it landing on heads".</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Calculating Single Events</h4>
                <p>To calculate the basic probability of an event occurring, we use the following formula:</p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <BlockMath math="P(\text{event}) = \frac{\text{number of times the event occurs}}{\text{total number of outcomes}}" />
                </div>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>
                    <strong>The Probability Scale:</strong> Probabilities must always be between 0 and 1. If <InlineMath math="P=1" />, the event is absolutely certain to happen. If <InlineMath math="P=0" />, the event is impossible. A probability can never be a negative number or greater than 1.
                  </li>
                  <li>
                    <strong>The "NOT" Rule:</strong> When we need to calculate the probability that something does <em>not</em> happen, we subtract the probability that it does happen from 1. Formula: <InlineMath math="P(\text{Not A}) = 1 - P(A)" />.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Types of Events</h4>
                <p>You must be able to classify how different events relate to each other:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Independent Events:</strong> Two events are independent if they do not affect each other. For example, rolling a dice twice; getting a 6 on the first roll does not lessen the chance of getting a 6 on the next roll.</li>
                  <li><strong>Dependent Events:</strong> This means the outcome is affected by the previous event. For example, drawing a card from a deck and not putting it back lowers the total number of cards for the next draw, changing the probabilities.</li>
                  <li><strong>Mutually Exclusive Events:</strong> Two outcomes are mutually exclusive if they cannot occur at the same time. For example, a single coin flip cannot result in both heads and tails simultaneously.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. The Gambler's Fallacy (Monte Carlo Fallacy)</h4>
                <p>
                  This is the incorrect belief that if a particular independent event occurs more frequently than normal in the past, it is "due" to happen less frequently in the future (or vice versa).
                </p>
                <p className="mt-2">
                  <strong>Example:</strong> If a roulette wheel lands on black 26 times in a row, a gambler might incorrectly assume the next spin is highly likely to be red. In reality, the events are completely independent, and the chance of red remains unchanged.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "calculating-basic-probabilities-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Calculating Basic Probabilities and the 'NOT' Rule</strong></p>
                <p>A bowl of fruit contains 5 apples, 4 bananas, and 3 oranges. A student selects one piece of fruit at random.</p>
                <p className="mt-2">(a) Calculate the probability that the student selects a banana.</p>
                <p>(b) Calculate the probability that the student does not select an apple.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <p className="ml-4">Total number of fruit = <InlineMath math="5 + 4 + 3 = 12" />. Number of bananas = 4.</p>
                  <p className="ml-4 mt-1"><InlineMath math="P(\text{banana}) = \frac{4}{12} = \frac{1}{3}" /> (or 0.333... or 33.3%).</p>
                </div>
                <div>
                  <p className="mb-1">(b)</p>
                  <p className="ml-4">First, find the probability of picking an apple: <InlineMath math="P(\text{apple}) = \frac{5}{12}" />.</p>
                  <p className="ml-4 mt-1">Then use the NOT rule: <InlineMath math="P(\text{Not Apple}) = 1 - \frac{5}{12} = \frac{7}{12}" />.</p>
                  <p className="text-sm text-slate-400 italic ml-4 mt-2">
                    (Alternatively, simply add the bananas and oranges together: <InlineMath math="\frac{4+3}{12} = \frac{7}{12}" />).
                  </p>
                </div>
              </div>
            )
          },
          {
            id: "calculating-basic-probabilities-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Identifying Types of Events</strong></p>
                <p>State whether the following pairs of events are mutually exclusive, independent, or dependent. Justify your answers.</p>
                <p className="mt-2">(a) Rolling an even number on a standard die, and rolling an odd number on the same die.</p>
                <p>(b) Flipping a 'Heads' on a coin, and rolling a '6' on a die.</p>
                <p>(c) Drawing a card from a deck and keeping it, then drawing a second card from the same deck.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <p className="ml-4"><strong>Mutually exclusive.</strong> You cannot roll a number that is both even and odd at the exact same time.</p>
                </div>
                <div>
                  <p className="mb-1">(b)</p>
                  <p className="ml-4"><strong>Independent.</strong> The outcome of the coin flip has absolutely no physical effect on the outcome of the die roll.</p>
                </div>
                <div>
                  <p className="mb-1">(c)</p>
                  <p className="ml-4"><strong>Dependent.</strong> Because the first card is kept and not replaced, the total number of cards in the deck changes, which directly affects the probability of the second draw.</p>
                </div>
              </div>
            )
          },
          {
            id: "calculating-basic-probabilities-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The Gambler's Fallacy</strong></p>
                <p>A student is playing a game where they flip a fair coin. The coin lands on 'Heads' 5 times in a row. The student tells their friend, "I am definitely going to bet on Tails for the next flip, because it is well overdue."</p>
                <p className="mt-2">State the name of the statistical fallacy the student is demonstrating, and explain why their logic is incorrect.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>The student is demonstrating the <strong>Gambler's Fallacy</strong> (or the Monte Carlo Fallacy).</p>
                <p className="mt-2">Their logic is completely incorrect because every single coin flip is an <strong>independent event</strong>. The previous 5 flips have absolutely no physical effect on the 6th flip, so the probability of getting 'Tails' remains exactly 0.5 (or 50%), regardless of what happened before.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "expected-probabilities",
        title: "Expected Probabilities",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Probability doesn't just tell us the chance of a single event happening; it allows us to predict the future on a larger scale. Expected probabilities (also known as expected values or expected success) are used to predict how many times we expect a specific outcome to happen over a large number of trials.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Expected Success Formula</h4>
                <p>To calculate an expected value, you simply multiply the probability of the outcome by the total number of trials (the sample size).</p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <InlineMath math="\text{Expected Success} = \text{Probability} \times \text{Sample Size}" />
                </div>
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <p className="font-semibold text-blue-300 mb-1">Crucial Note:</p>
                  <p className="text-blue-100/80">
                    Expected probability does <em>not</em> guarantee an exact, real-world result. Instead, it provides businesses and project managers with a strong mathematical indication of what is most likely to happen, allowing them to adjust their finances and schedules accordingly.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Expected Probabilities and the 'NOT' Rule</h4>
                <p>
                  When calculating expected costs, profits, or successful days, you will often be given the probability of a failure (e.g., a bus being late, or a machine breaking).
                </p>
                <p className="mt-2">
                  Before you can calculate the expected number of successes, you must first calculate the probability that the failure does not happen using the rule: <InlineMath math="P(\text{Not A}) = 1 - P(A)" />.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "expected-probabilities-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Basic Expected Success</strong></p>
                <p>A smartphone manufacturer tests a new batch of screens. The probability of a screen having a defective pixel is 0.015. If the factory produces 8,400 screens in a single day, how many screens are expected to be defective?</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><InlineMath math="\text{Expected Success} = \text{Probability} \times \text{Sample Size}" /></p>
                <p><InlineMath math="\text{Expected Defective Screens} = 0.015 \times 8400 = 126" /> screens.</p>
              </div>
            )
          },
          {
            id: "expected-probabilities-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Using the 'NOT' Rule with Time</strong></p>
                <p>An outdoor cinema operates every single day throughout July and August (62 days in total). Based on meteorological data, the probability of heavy rain forcing the cinema to close on any given day is 0.15.</p>
                <p className="mt-2">Calculate the expected number of days the outdoor cinema will be able to remain open.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>First, find the probability that it does <em>not</em> rain (meaning the cinema is open):</p>
                <p className="ml-4"><InlineMath math="P(\text{Open}) = 1 - 0.15 = 0.85" /></p>
                <p>Next, calculate the expected number of open days:</p>
                <p className="ml-4"><InlineMath math="\text{Expected Days Open} = 0.85 \times 62 = 52.7" /> days.</p>
                <p className="text-sm text-slate-400 italic">(The cinema can expect to be open for approximately 53 days).</p>
              </div>
            )
          },
          {
            id: "expected-probabilities-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Financial Forecasting</strong></p>
                <p>A car dealership sells 420 cars in a year. The probability that a customer chooses to add the optional "premium winter tyre package" to their purchase is 0.25. The profit made on each winter tyre package is £150.</p>
                <p className="mt-2">Calculate the total expected profit the dealership will make from the winter tyre packages this year.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>First, calculate how many customers are expected to buy the package:</p>
                <p className="ml-4"><InlineMath math="\text{Expected Customers} = 0.25 \times 420 = 105" /> customers.</p>
                <p>Next, calculate the expected profit:</p>
                <p className="ml-4"><InlineMath math="\text{Expected Profit} = 105 \times \text{\pounds}150 = \text{\pounds}15,750" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "tree-diagrams",
        title: "Tree Diagrams",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Probability trees are visual diagrams used to calculate the probabilities of different outcomes in sequential events (events that happen one after the other). They help visualise and compute probabilities in a clear, organised manner.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Structure of a Tree Diagram</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>Each branch on the tree represents a possible outcome, with its associated probability written directly on the line.</li>
                  <li>The branches originating from a single, shared point represent <strong>mutually exclusive events</strong>, meaning only one of them can possibly occur at that time.</li>
                  <li>Because these branches cover all possible outcomes for that specific event, the probabilities on branches coming from the same point must always <strong>add up to exactly 1</strong>.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Calculating Probabilities (The Two Rules)</h4>
                <p>Once your tree diagram is drawn, you use two simple rules to find your answers:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>The "AND" Rule (Multiply):</strong> To calculate the final 'end' probability of a specific sequence of events happening (e.g., getting a Head and <em>then</em> a Tail), you must <strong>multiply</strong> the probabilities along that specific path of branches.</li>
                  <li><strong>The "OR" Rule (Add):</strong> If a question has more than one successful path (e.g., finding the probability of getting exactly one Head, which could be Head-Tail <em>or</em> Tail-Head), you calculate the final probability of each valid path and then <strong>add</strong> them together.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. The "At Least One" Shortcut</h4>
                <p>
                  In exams, you will frequently be asked to find the probability that an event happens "at least once" over multiple trials.
                </p>
                <p className="mt-2">
                  Calculating every single successful combination can be highly time-consuming. Instead, use the shortcut: find the probability that the event <strong>never happens at all</strong> (e.g., missing the train every single time), and <strong>subtract that answer from 1</strong>.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "tree-diagrams-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Independent Events</strong></p>
                <p>A commuter takes the bus to work. The probability that the bus is late on any given morning is 0.15. The commuter takes the bus on Monday and Tuesday.</p>
                <p className="mt-2">(a) Draw a tree diagram to represent this information.</p>
                <p>(b) Calculate the probability that the bus is late on both days.</p>
                <p>(c) Calculate the probability that the bus is on time for exactly one of the days.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-2">(a) To draw this, start with two branches: 'Late' (0.15) and 'On Time' (0.85). From the end of each of those branches, draw another set of identical 'Late' (0.15) and 'On Time' (0.85) branches for Tuesday.</p>
                  <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center">
                    <TreeDiagramExample1 />
                  </div>
                </div>
                <div>
                  <p className="mb-1">(b) To find Late and Late, we multiply along the branches:</p>
                  <p className="ml-4"><InlineMath math="P(\text{Late, Late}) = 0.15 \times 0.15 = 0.0225" />.</p>
                </div>
                <div>
                  <p className="mb-1">(c) There are two valid paths for exactly one day on time: (Late, On Time) or (On Time, Late).</p>
                  <ul className="list-none space-y-1 ml-4 mt-2">
                    <li><InlineMath math="P(\text{Late, On Time}) = 0.15 \times 0.85 = 0.1275" /></li>
                    <li><InlineMath math="P(\text{On Time, Late}) = 0.85 \times 0.15 = 0.1275" /></li>
                  </ul>
                  <p className="mt-2">Add the valid paths together: <InlineMath math="0.1275 + 0.1275 = 0.255" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "tree-diagrams-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Dependent Events (Without Replacement)</strong></p>
                <p>A drawer contains 7 black socks and 5 white socks. A man reaches into the drawer in the dark and pulls out one sock. He keeps it, and then reaches in to pull out a second sock.</p>
                <p className="mt-2">(a) Draw a tree diagram to show all possible outcomes.</p>
                <p>(b) Calculate the probability that the man selects a matching pair of socks.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>First Draw:</strong> The probability of Black is <InlineMath math="\frac{7}{12}" />. The probability of White is <InlineMath math="\frac{5}{12}" />.</li>
                    <li><strong>Second Draw (Dependent):</strong> Because a sock has been removed, there are only 11 socks left.</li>
                    <ul className="list-circle list-inside ml-8 space-y-1 text-slate-400">
                      <li>If Black was drawn first, the second branches are Black (<InlineMath math="\frac{6}{11}" />) and White (<InlineMath math="\frac{5}{11}" />).</li>
                      <li>If White was drawn first, the second branches are Black (<InlineMath math="\frac{7}{11}" />) and White (<InlineMath math="\frac{4}{11}" />).</li>
                    </ul>
                  </ul>
                  <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center mt-4">
                    <TreeDiagramExample2 />
                  </div>
                </div>
                <div>
                  <p className="mb-1">(b) A matching pair means (Black and Black) or (White and White).</p>
                  <ul className="list-none space-y-1 ml-4 mt-2">
                    <li><InlineMath math="P(\text{Black, Black}) = \frac{7}{12} \times \frac{6}{11} = \frac{42}{132}" /></li>
                    <li><InlineMath math="P(\text{White, White}) = \frac{5}{12} \times \frac{4}{11} = \frac{20}{132}" /></li>
                  </ul>
                  <p className="mt-2">Add them together: <InlineMath math="\frac{42}{132} + \frac{20}{132} = \frac{62}{132} = \frac{31}{66}" /> (or approx 0.47).</p>
                </div>
              </div>
            )
          },
          {
            id: "tree-diagrams-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: The "At Least One" Shortcut</strong></p>
                <p>A quality assurance inspector at a factory tests 3 identical items chosen at random from a production line. The probability that any single item passes the inspection is 0.8.</p>
                <p className="mt-2">Calculate the probability that at least one of the three items fails the inspection.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>Instead of calculating all the combinations of 1, 2, or 3 failures, we can use the shortcut.</p>
                <p>Find the probability that none of them fail (meaning they all pass).</p>
                <p className="ml-4"><InlineMath math="P(\text{Pass, Pass, Pass}) = 0.8 \times 0.8 \times 0.8 = 0.512" /></p>
                <p>Subtract this answer from 1.</p>
                <p className="ml-4"><InlineMath math="P(\text{At least one fail}) = 1 - 0.512 = 0.488" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "venn-diagrams",
        title: "Venn Diagrams",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              A Venn diagram is a powerful visual tool used to organise data and show how different items fit into specific categories (or sets). They make calculating complex probabilities much easier.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. The Structure of a Venn Diagram</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>The Sample Space:</strong> The large outer rectangle represents the entire sample space (every single person or item surveyed).</li>
                  <li><strong>The Sets:</strong> The circles inside represent the specific categories.</li>
                  <li><strong>The Complement:</strong> Any number written outside the circles but inside the rectangle represents items that do not belong to any of the categories (the "neither" group).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Key Terminology and Notation</h4>
                <p>You must be familiar with the formal set notation used to describe different parts of the diagram:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Intersection (<InlineMath math="A \cap B" />):</strong> The overlapping section in the middle. This represents items that are in Both A AND B.</li>
                  <li><strong>Union (<InlineMath math="A \cup B" />):</strong> The entire area covered by the circles combined. This represents items that are in A OR B (or both).</li>
                  <li><strong>Complement (<InlineMath math="A'" />):</strong> This means NOT A. It includes everything in the diagram that is outside of circle A.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Constructing Venn Diagrams (The Subtraction Trap)</h4>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">Massive SQA Trap:</p>
                  <p className="text-amber-100/80">
                    When you are given the total number of people in a category, that total <em>includes</em> the people in the overlapping sections. You must <strong>always subtract the intersection</strong> from the group totals to find the number of people who belong to "only" one category.
                  </p>
                </div>
                <p>
                  <strong>Strategy:</strong> Whenever you construct a Venn diagram, always start from the very centre (the intersection of all circles) and work your way outwards, subtracting as you go.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "venn-diagrams-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Interpreting a Venn Diagram &amp; Notation</strong></p>
                <p>A gym surveyed 80 of its members to see if they regularly attend the Spin class (S) or the Yoga class (Y). The results are shown in the Venn diagram below:</p>
                
                <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center my-4">
                  <VennDiagramExample1 />
                </div>
                
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Spin circle only: 25</li>
                  <li>Yoga circle only: 20</li>
                  <li>Intersection (middle): 15</li>
                  <li>Outside the circles: 20</li>
                </ul>
                <p className="mt-4">Calculate the following probabilities:</p>
                <p>(a) <InlineMath math="P(S \cap Y)" /></p>
                <p>(b) <InlineMath math="P(Y')" /></p>
                <p>(c) The probability that a randomly selected member attends exactly one type of class.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a) <InlineMath math="P(S \cap Y)" /> means the probability of Spin AND Yoga (the intersection).</p>
                  <p className="ml-4"><InlineMath math="P(S \cap Y) = \frac{15}{80} = \frac{3}{16}" /> (or 0.1875).</p>
                </div>
                <div>
                  <p className="mb-1">(b) <InlineMath math="P(Y')" /> means the probability of NOT Yoga. We must add everything outside the Yoga circle (Spin only + Neither).</p>
                  <p className="ml-4"><InlineMath math="P(Y') = \frac{25 + 20}{80} = \frac{45}{80} = \frac{9}{16}" /> (or 0.5625).</p>
                </div>
                <div>
                  <p className="mb-1">(c) "Exactly one" means Spin only OR Yoga only.</p>
                  <p className="ml-4">Probability = <InlineMath math="\frac{25 + 20}{80} = \frac{45}{80} = \frac{9}{16}" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "venn-diagrams-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Constructing a 2-Circle Venn Diagram</strong></p>
                <p>A veterinary clinic reviews the records of 120 dogs.</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>70 dogs are vaccinated against rabies.</li>
                  <li>55 dogs are microchipped.</li>
                  <li>20 dogs are neither vaccinated nor microchipped.</li>
                </ul>
                <p className="mt-4">(a) Construct a Venn diagram to represent this information.</p>
                <p>(b) Calculate the probability that a randomly selected dog is microchipped, but NOT vaccinated.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a)</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Find the intersection first:</strong> If 20 are neither, then <InlineMath math="120 - 20 = 100" /> dogs have at least one treatment. However, our totals add up to <InlineMath math="70 + 55 = 125" />. The overlap is <InlineMath math="125 - 100 = 25" /> dogs. (This goes in the middle).</li>
                    <li><strong>Find the "only" sections:</strong> Vaccinated ONLY = <InlineMath math="70 - 25 = 45" />. Microchipped ONLY = <InlineMath math="55 - 25 = 30" />.</li>
                    <li><strong>Draw the diagram:</strong> Draw a rectangle containing two overlapping circles (V and M). Put 25 in the middle, 45 in the V-only section, 30 in the M-only section, and 20 outside the circles.</li>
                  </ul>
                  <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center mt-4">
                    <VennDiagramExample2 />
                  </div>
                </div>
                <div>
                  <p className="mb-1">(b) Microchipped but NOT vaccinated is the "Microchipped ONLY" section.</p>
                  <p className="ml-4">Probability = <InlineMath math="\frac{30}{120}" /> (or <InlineMath math="\frac{1}{4}" /> or 0.25).</p>
                </div>
              </div>
            )
          },
          {
            id: "venn-diagrams-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Constructing a 3-Circle Venn Diagram</strong></p>
                <p>A group of 100 university students were asked which streaming services they subscribe to: Netflix (N), Amazon Prime (A), and Disney+ (D).</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>10 subscribe to all three.</li>
                  <li>25 subscribe to Netflix and Amazon.</li>
                  <li>20 subscribe to Amazon and Disney+.</li>
                  <li>15 subscribe to Netflix and Disney+.</li>
                  <li>50 subscribe to Netflix in total.</li>
                  <li>45 subscribe to Amazon in total.</li>
                  <li>40 subscribe to Disney+ in total.</li>
                </ul>
                <p className="mt-4">(a) Construct a Venn diagram to show this information.</p>
                <p>(b) Calculate the probability that a student chosen at random subscribes to none of these services.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-2">(a) Strategy: Start at the centre and work outwards!</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>All three:</strong> 10 goes in the very centre.</li>
                    <li><strong>Intersections of two:</strong> N &amp; A only: <InlineMath math="25 - 10 = 15" />. A &amp; D only: <InlineMath math="20 - 10 = 10" />. N &amp; D only: <InlineMath math="15 - 10 = 5" />.</li>
                    <li><strong>Individual circles (subtracting everything already in that circle):</strong> N only: <InlineMath math="50 - (15 + 10 + 5) = 20" />. A only: <InlineMath math="45 - (15 + 10 + 10) = 10" />. D only: <InlineMath math="40 - (10 + 10 + 5) = 15" />.</li>
                  </ul>
                  <p className="mt-2 text-sm text-slate-400 italic">(Your diagram should have three overlapping circles with these bold numbers placed in the respective sections).</p>
                  <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center mt-4">
                    <VennDiagramExample3 />
                  </div>
                </div>
                <div>
                  <p className="mb-2">(b) First, find how many students are inside the circles by adding all the sections together:</p>
                  <p className="ml-4"><InlineMath math="10 + 15 + 10 + 5 + 20 + 10 + 15 = 85" /> students.</p>
                  <p className="mt-2">This means <InlineMath math="100 - 85 = 15" /> students subscribe to none of the services (this number goes outside the circles).</p>
                  <p className="mt-2">Therefore, the probability is <InlineMath math="\frac{15}{100}" /> (or <InlineMath math="\frac{3}{20}" /> or 0.15).</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "risk-control-measures",
        title: "Risk & Control Measures",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              Every action we take in our daily lives involves an inherent element of risk. Whether it is in business or daily life, we constantly assess potential risks and take actions to minimise or prevent them.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Control Measures</h4>
                <p>These preventative actions are called <strong>control measures</strong>.</p>
                <p className="mt-2">
                  Control measures are actions taken in an attempt to reduce the risk of a financial loss, and can include buying insurance policies or paying for additional resources such as extra staff or equipment.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Cost-Benefit Analysis</h4>
                <p>
                  To evaluate whether a risk is worth taking, or a control measure is worth paying for, companies use a process called a <strong>cost-benefit analysis</strong>.
                </p>
                <p className="mt-2">
                  This involves comparing the financial cost of implementing a control measure against the expected penalty of doing nothing.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">3. Direct vs. Indirect Costs</h4>
                <p>When a project fails or is delayed, a business must consider two types of costs:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Direct Costs:</strong> Immediate, measurable financial losses, such as having to repay a fee, refund a customer, or pay a contractual fine.</li>
                  <li><strong>Indirect Costs:</strong> Longer-term impacts, such as a damaged reputation, increased stress, or the loss of potential future business.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">4. Calculating Expected Costs</h4>
                <p>To compare options fairly, we calculate the "expected cost" of each choice:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li><strong>Expected Penalty (Doing Nothing)</strong> = Probability of the event &times; Financial Penalty.</li>
                  <li><strong>Expected Cost of a Control Measure</strong> = The upfront cost of the measure + the <em>new</em> expected penalty (because a control measure rarely reduces the probability of failure to absolutely zero!).</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "risk-control-measures-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Direct and Indirect Costs</strong></p>
                <p>A wedding photographer has been booked for a large event. If they fail to provide the photographs by the agreed deadline, their contract states they must refund the couple the full &pound;1,500 fee.</p>
                <p className="mt-2">State one direct cost and one indirect cost the photographer would face if they missed the deadline.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Direct Cost:</strong> The &pound;1,500 refund they are legally required to pay.</p>
                <p><strong>Indirect Cost:</strong> A bad review online, a damaged reputation, or a loss of future bookings.</p>
              </div>
            )
          },
          {
            id: "risk-control-measures-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Insurance as a Control Measure</strong></p>
                <p>A graphic designer is purchasing a new high-end tablet for &pound;2,400. They estimate the probability of accidentally breaking the tablet within the first two years is 0.06. The electronics store offers a 2-year damage protection plan (insurance) for &pound;130.</p>
                <p className="mt-2">(a) Calculate the expected cost of the risk if the designer does not buy the protection plan.</p>
                <p>(b) Use your answer to determine whether the designer should purchase the protection plan.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a) <InlineMath math="\text{Expected Cost} = \text{Probability} \times \text{Cost of Replacement}" /></p>
                  <p className="ml-6"><InlineMath math="\text{Expected Cost} = 0.06 \times \text{\pounds}2400 = \text{\pounds}144" />.</p>
                </div>
                <div>
                  <p className="mb-1">(b) The expected cost of doing nothing is &pound;144. The cost of the insurance is &pound;130.</p>
                  <p className="mt-2">Because &pound;130 is less than &pound;144, the designer should purchase the protection plan as it is the more cost-effective choice mathematically.</p>
                </div>
              </div>
            )
          },
          {
            id: "risk-control-measures-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Staffing as a Control Measure</strong></p>
                <p>A landscaping firm is building a large patio for a client. If the patio is not completed by the agreed date, the firm will be fined &pound;4,500. The firm estimates there is a 0.22 probability that the project will be delayed due to bad weather slowing down their current team.</p>
                <p className="mt-2">As a control measure, the firm could hire an extra temporary labourer for &pound;600. If they do this, the extra help reduces the probability of a delay down to 0.05.</p>
                <p className="mt-4">(a) Calculate the expected penalty if no control measure is taken.</p>
                <p>(b) Calculate the expected cost if the firm hires the temporary labourer.</p>
                <p>(c) Based on your calculations, should the firm hire the temporary labourer?</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a) Expected penalty (no control measure):</p>
                  <p className="ml-6"><InlineMath math="0.22 \times \text{\pounds}4500 = \text{\pounds}990" />.</p>
                </div>
                <div>
                  <p className="mb-1">(b) Expected cost (with control measure): You must add the upfront cost of the worker to the <em>new</em> expected penalty.</p>
                  <p className="ml-6"><InlineMath math="\text{Cost} = \text{\pounds}600 + (0.05 \times \text{\pounds}4500)" /></p>
                  <p className="ml-6"><InlineMath math="\text{Cost} = \text{\pounds}600 + \text{\pounds}225 = \text{\pounds}825" />.</p>
                </div>
                <div>
                  <p className="mb-1">(c) <strong>Conclusion:</strong> The firm should hire the temporary labourer, because the expected cost of doing so (&pound;825) is lower than the expected penalty of doing nothing (&pound;990).</p>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "multiple-control-measures",
        title: "Multiple Control Measures",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>
              In reality, very few projects are delayed by just one single issue. There are usually multiple different risk factors impacting a project, and consequently, a business will have multiple different control measures available to choose from.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">1. Dealing with Multiple Probabilities</h4>
                <p>
                  When a project can be delayed by Event A or Event B or both, you must find the combined probability of a delay occurring before you can calculate the expected penalty.
                </p>
                <p className="mt-2">
                  Because we are dealing with multiple sequential or simultaneous probabilities, tree diagrams are the best mathematical tool to use to find the overall chance of a delay.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg my-4">
                  <p className="font-semibold text-amber-300 mb-1">Exam Shortcut:</p>
                  <p className="text-amber-100/80">
                    Remember the "At Least One" rule from Section 7! Instead of calculating all the combinations of things going wrong, simply calculate the probability of everything going perfectly (e.g., No Delay &times; No Delay) and subtract your answer from 1.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mt-6">2. Evaluating Multiple Control Measures</h4>
                <p>
                  When a company is choosing between several different control measures (e.g., Option 1, Option 2, or doing both), you must conduct a separate cost-benefit analysis for every single option.
                </p>
                <p className="mt-2 text-indigo-300 font-semibold">
                  The Golden Rule: When you pay for a specific control measure, it usually only eliminates that specific risk. The other risks will still exist, and you must factor their remaining expected penalty into your calculation.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg my-4 text-center">
                  <BlockMath math="\text{Expected Cost of Option 1} = \text{Upfront Cost of Option 1} + (\text{Remaining Probability of Delay} \times \text{Financial Penalty})" />
                </div>
                <p>
                  To make your final decision, you must compare all your answers and recommend the option that results in the lowest overall expected cost.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: [
          {
            id: "multiple-control-measures-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Example 1: Calculating the Combined Probability of a Delay</strong></p>
                <p>A catering company is supplying food for a large corporate event. If they are late, they will face a contractual penalty of &pound;4,000. The company has identified two independent reasons for a possible delay:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Their industrial oven breaks down (Probability = 0.1).</li>
                  <li>Their delivery van breaks down (Probability = 0.2).</li>
                </ul>
                <p className="mt-4">(a) Calculate the probability that the catering company is delayed.</p>
                <p>(b) Calculate the expected cost of taking no control measures.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a) A delay happens if the oven breaks, the van breaks, or both. We use the shortcut: find the probability of a completely perfect day and subtract it from 1.</p>
                  <ul className="list-none space-y-1 ml-6 mt-2">
                    <li><InlineMath math="P(\text{No oven break}) = 1 - 0.1 = 0.9" /></li>
                    <li><InlineMath math="P(\text{No van break}) = 1 - 0.2 = 0.8" /></li>
                    <li><InlineMath math="P(\text{Perfect day}) = 0.9 \times 0.8 = 0.72" /></li>
                    <li><InlineMath math="P(\text{Delay}) = 1 - 0.72 = 0.28" /></li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1">(b) Expected cost (doing nothing):</p>
                  <p className="ml-6"><InlineMath math="\text{Expected Cost} = 0.28 \times \text{\pounds}4000 = \text{\pounds}1,120" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "multiple-control-measures-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Example 2: Evaluating Single Control Measures</strong></p>
                <p>Following on from the scenario in Example 1, the catering company is considering two separate control measures:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Measure A: Rent a backup oven for the day at a cost of &pound;300.</li>
                  <li>Measure B: Rent a backup delivery van for the day at a cost of &pound;400.</li>
                </ul>
                <p className="mt-4">(a) Calculate the expected cost of taking only Control Measure A.</p>
                <p>(b) Calculate the expected cost of taking only Control Measure B.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <div>
                  <p className="mb-1">(a) Measure A (Backup Oven): This eliminates the oven risk, but the van could still break down (P = 0.2).</p>
                  <p className="ml-6"><InlineMath math="\text{Expected Cost} = \text{Cost of Measure} + (\text{Remaining Risk} \times \text{Penalty})" /></p>
                  <p className="ml-6"><InlineMath math="\text{Expected Cost} = \text{\pounds}300 + (0.2 \times \text{\pounds}4000) = \text{\pounds}300 + \text{\pounds}800 = \text{\pounds}1,100" />.</p>
                </div>
                <div>
                  <p className="mb-1">(b) Measure B (Backup Van): This eliminates the van risk, but the oven could still break down (P = 0.1).</p>
                  <p className="ml-6"><InlineMath math="\text{Expected Cost} = \text{Cost of Measure} + (\text{Remaining Risk} \times \text{Penalty})" /></p>
                  <p className="ml-6"><InlineMath math="\text{Expected Cost} = \text{\pounds}400 + (0.1 \times \text{\pounds}4000) = \text{\pounds}400 + \text{\pounds}400 = \text{\pounds}800" />.</p>
                </div>
              </div>
            )
          },
          {
            id: "multiple-control-measures-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Example 3: Making a Final Recommendation (Exam Style)</strong></p>
                <p>A software development firm faces a penalty of &pound;12,000 if their new app is not launched on time. The project manager identifies two independent risks:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>The lead developer falls ill (Probability = 0.15).</li>
                  <li>The server crashes during the upload (Probability = 0.08).</li>
                </ul>
                <p className="text-sm text-slate-400 italic mt-1">(The probability of one or both of these delays happening is calculated to be 0.218).</p>
                <p className="mt-4">The manager has three options:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Option 1: Hire a temporary assistant developer for &pound;1,000 to eliminate the illness risk.</li>
                  <li>Option 2: Pay &pound;800 to upgrade the server and eliminate the crash risk.</li>
                  <li>Option 3: Do both.</li>
                </ul>
                <p className="mt-4">Determine which option, if any, the manager should choose to minimise their financial risk. Give a reason to support your recommendation.</p>
              </div>
            ),
            solution: (
              <div className="space-y-4">
                <p>We must calculate the expected cost for all possible scenarios to find the lowest value.</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>Do Nothing:</strong> <InlineMath math="0.218 \times \text{\pounds}12,000 = \text{\pounds}2,616" />.</li>
                  <li><strong>Option 1 (Assistant only):</strong> Server crash risk (0.08) remains.<br />Cost = <InlineMath math="\text{\pounds}1000 + (0.08 \times \text{\pounds}12,000) = \text{\pounds}1000 + \text{\pounds}960 = \text{\pounds}1,960" />.</li>
                  <li><strong>Option 2 (Server only):</strong> Illness risk (0.15) remains.<br />Cost = <InlineMath math="\text{\pounds}800 + (0.15 \times \text{\pounds}12,000) = \text{\pounds}800 + \text{\pounds}1800 = \text{\pounds}2,600" />.</li>
                  <li><strong>Option 3 (Both):</strong> No risk remains.<br />Cost = <InlineMath math="\text{\pounds}1000 + \text{\pounds}800 = \text{\pounds}1,800" />.</li>
                </ul>
                <p className="mt-4"><strong>Conclusion:</strong> The manager should choose <strong>Option 3 (Do both)</strong>, as this provides the lowest overall expected cost (&pound;1,800) compared to doing nothing or using just one measure.</p>
              </div>
            )
          }
        ]
      }
    ]
  }
];
