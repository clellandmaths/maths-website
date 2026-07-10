export const higherAppsDataBooklet2024 = {
    title: "Applications of Mathematics Data Booklet 2024",
    sections: [
        {
            title: "1. Deductions from salaries",
            content: `
                <h3 class="font-bold text-lg mb-2">Scottish income tax bands 2023/24</h3>
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
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Higher rate</td><td class="border border-gray-500 p-2">£43,662-£125,140</td><td class="border border-gray-500 p-2">42%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Top rate</td><td class="border border-gray-500 p-2">Over £125,140</td><td class="border border-gray-500 p-2">47%</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="font-bold text-lg mb-2">National Insurance Contributions</h3>
                <p class="mb-2">In the 2023/24 tax year, National Insurance payments varied during the year. You begin paying National Insurance once you earn more than £1048 a month (this is the amount for the 2023/24 tax year).</p>
                <ul class="list-disc pl-5 mb-4">
                    <li class="mb-1">For payslips dated between 6 April 2023 and 5 January 2024, you pay 12% of your monthly earnings between £1048 and £4189; 2% of your monthly earnings above £4189.</li>
                    <li class="mb-1">For payslips dated between 6 January 2024 and 5 April 2024, you pay 10% of your monthly earnings between £1048 and £4189; 2% of your monthly earnings above £4189.</li>
                </ul>
                <p class="mb-2">National Insurance is calculated on a person's salary before deductions such as pension contributions.</p>
            `
        },
        {
            title: "2. Dracaena plants and atmospheric carbon dioxide levels",
            content: `
                <p class="mb-2">Dracaena plants are a type of plant often grown indoors. They make excellent house plants because they tolerate low light and require little water. Dracaena plants have been shown to be effective air filters. They remove formaldehyde, benzene, trichloroethylene, and carbon dioxide from a room's atmosphere.</p>
                <p class="mb-2">Carbon dioxide \\( (CO_2) \\) is a natural component of air, but in too large a concentration \\( CO_2 \\) can be harmful to humans. To improve indoor air quality many workplaces and schools take measures to reduce \\( CO_2 \\) concentration levels. Carbon dioxide concentration is measured in parts per million (ppm).</p>
                <p class="mb-2">Acceptable \\( CO_2 \\) concentration levels vary from country to country. For example, in the UK, the Health and Safety Executive has a set of standards for acceptable \\( CO_2 \\) concentration levels in indoor spaces:</p>
                <ul class="list-disc pl-5 mb-4">
                    <li class="mb-1">800 ppm or below indicates that an indoor space is likely to have very good indoor air quality.</li>
                    <li class="mb-1">Consistent levels of 1500 ppm or above indicate that an indoor space is likely to have poor indoor air quality.</li>
                </ul>
                <p class="mb-2">Where poor indoor air quality is identified, measures should be taken to improve ventilation this will reduce the \\( CO_2 \\) concentration levels.</p>
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
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.test( x=c(a,b), n=c(n1,n2) )</code> - performs a 2-sample test for equality of proportions with continuity correction</li>
                </ul>
            `
        }
    ]
};