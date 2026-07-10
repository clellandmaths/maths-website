export const higherAppsDataBooklet2023 = {
    title: "National Qualifications 2023 MODIFIED: Applications of Mathematics Data booklet",
    sections: [
        {
            title: "1. Deductions from salaries",
            content: `
                <h3 class="text-lg font-bold mb-2">Scottish tax bands 2022/23</h3>
                <div class="overflow-x-auto mb-6">
                    <table class="w-full text-sm border-collapse">
                        <thead>
                            <tr class="bg-gray-700 text-white">
                                <th class="border border-gray-500 p-2 text-left">Band</th>
                                <th class="border border-gray-500 p-2 text-left">Taxable income</th>
                                <th class="border border-gray-500 p-2 text-left">Scottish tax rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Personal Allowance</td><td class="border border-gray-500 p-2">Up to £12,570</td><td class="border border-gray-500 p-2">0%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Starter rate</td><td class="border border-gray-500 p-2">£12,570-£14,732</td><td class="border border-gray-500 p-2">19%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Basic rate</td><td class="border border-gray-500 p-2">£14,732-£25,688</td><td class="border border-gray-500 p-2">20%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Intermediate rate</td><td class="border border-gray-500 p-2">£25,688-£43,662</td><td class="border border-gray-500 p-2">21%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Higher rate</td><td class="border border-gray-500 p-2">£43,662-£150,000</td><td class="border border-gray-500 p-2">41%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Top rate</td><td class="border border-gray-500 p-2">Over £150,000</td><td class="border border-gray-500 p-2">46%</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="text-lg font-bold mb-2">National Insurance Contributions</h3>
                <p class="mb-3">In the 2022-23 tax year, National Insurance payments varied during the year.</p>
                <ul class="list-disc pl-6 mb-4 space-y-2 text-sm">
                    <li><strong>For payslips dated between 6 April 2022 and 5 July 2022:</strong> you began paying National Insurance once you earned more than £823 a month. The National Insurance rate you paid depended on how much you earned: 13.25% of your monthly earnings between £823 and £4189; 3.25% of your monthly earnings above £4189.</li>
                    <li><strong>For payslips dated between 6 July 2022 and 5 November 2022:</strong> you began paying National Insurance once you earned more than £1048 a month. The National Insurance rate you paid depended on how much you earned: 13.25% of your monthly earnings between £1048 and £4189; 3.25% of your monthly earnings above £4189.</li>
                    <li><strong>For payslips dated between 6 November 2022 and 5 April 2023:</strong> you began paying National Insurance once you earned more than £1048 a month. The National Insurance rate you paid depended on how much you earned: 12% of your monthly earnings between £1048 and £4189; 2% of your monthly earnings above £4189.</li>
                </ul>
                <p class="text-sm font-semibold">National Insurance is calculated on a person's salary before deductions such as pension contributions.</p>
            `
        },
        {
            title: "2. E10 Petrol",
            content: `
                <p class="text-xs text-gray-500 mb-4 italic">The following information is taken from the government's website https://www.gov.uk/guidance/e10-petrol-explained</p>
                <p class="mb-4 text-sm">Petrol in the UK currently contains 5% renewable ethanol (known as E5) or 10% renewable ethanol (known as E10).</p>
                
                <h3 class="text-lg font-bold mb-2">Reducing emissions</h3>
                <p class="mb-2 text-sm">CO<sub>2</sub> is one of the greenhouse gases that contribute to climate change and the main benefit of E10 petrol is that it reduces overall levels of CO<sub>2</sub>-based vehicle emissions. By blending petrol with up to 10% renewable ethanol, less fossil fuel is needed, helping us reduce carbon emissions and meet climate change targets.</p>
                <p class="mb-2 text-sm">The introduction of E10 petrol in the UK is predicted to cut transport CO<sub>2</sub> emissions by 750 000 tonnes a year - the equivalent of taking 350 000 cars off the road. Renewable fuel blends, such as E10 petrol, are generally introduced to reduce overall CO<sub>2</sub> emissions. They have little impact on emissions associated with air quality and public health. The production of renewable ethanol for blending with fossil petrol also results in valuable by-products, including animal feed and stored CO<sub>2</sub>.</p>
                
                <h3 class="text-lg font-bold mt-4 mb-2">Fuel economy</h3>
                <p class="mb-2 text-sm">Using E10 petrol can slightly reduce fuel economy (the number of miles you are able to drive on a gallon of fuel). You may see a reduction of around 1%, but it is unlikely to be noticeable in everyday driving. Other factors, such as your driving style or driving with under-inflated tyres or a roof rack, have a much more significant impact on fuel economy than using E10 petrol.</p>
            `
        },
        {
            title: "3. Some helpful R commands",
            content: `
                <h3 class="font-bold text-lg mb-2 text-blue-300">Entering data to R Studio</h3>
                <p class="mb-3">To read in data from an Excel csv file called excel_data.csv to R Studio and name it mydata, first use the drop down menus in R Studio Session > Set Working Directory > Choose Directory to indicate the location of excel_data.csv on your computer. The following code will then read the data in to R Studio:</p>
                <ul class="list-none pl-0 mb-6 space-y-2 font-mono text-sm bg-gray-800 p-4 rounded">
                    <li><span class="text-green-400">mydata&lt;-read.csv("excel_data.csv")</span></li>
                    <li><span class="text-green-400">attach (mydata)</span> <span class="text-gray-400"># this adds the variable names</span></li>
                    <li><span class="text-gray-400">At the end of the analysis remember to use</span> <span class="text-green-400">detach (mydata)</span> <span class="text-gray-400">to disassociate the variable names.</span></li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(a) Graphics</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">hist (X,col="yellow", main="Histogram of X (units)")</code> - this produces a histogram of the variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">plot (X, Y, xlab="x-axis label", ylab="y-axis label", main="Scatterplot of Y on X",pch=21,bg="black")</code> - produces a scatter plot of Y on X with the required title, axis labels, and black dots</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">pie (table(X), main="Title")</code> - this gives a simple pie chart of the categories in variable X with the specified title</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">barplot (table (X), main="title", xlab="x-axis label",col="orange")</code> - this gives a bar chart of the categories in the variable X with the required title, axis labels and colour</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">boxplot (X)</code> - produces a boxplot of the numerical variable X</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(b) Descriptive Statistics</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">mean (X)</code> - computes the mean of X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">sd (X)</code> - computes the standard deviation of X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary (X)</code> - computes the mean, median, minimum, maximum, and upper and lower quartiles</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">table (X)</code> - computes the number of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))</code> - returns the proportion of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))*100</code> - returns the percentage of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">table (X, Y)</code> - produces a cross-tabulation between the two categorical variables X and Y</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(c) Correlation and Regression</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">cor.test(X, Y)</code> - computes the correlation between X and Y and performs a test of the null hypothesis of zero correlation</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">lm (Y~X)</code> - fits a linear regression line to the data (lm command stands for linear model)</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">abline (lm (Y~X))</code> - produces a scatterplot with the least squares linear regression line superimposed on the data</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary(lm(Y~X))</code> - displays the coefficient of determination (r-squared)</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">predict (lm(Y~X), newdata=data.frame(X=C), interval = "pred")</code> - computes the predicted value of Y when X=C along with a 95% prediction interval</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(d) Hypothesis Testing</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test(X, Y)</code> - performs a two sample t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test(X, Y, paired=TRUE)</code> - performs a paired t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.test( x=c(a,b), n=c(n1,n2))</code> - performs a 2-sample test for equality of proportions with continuity correction</li>
                </ul>
            `
        }
    ]
};