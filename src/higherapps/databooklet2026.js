export const higherAppsDataBooklet2026 = {
    title: "Applications of Mathematics Data Booklet 2026",
    sections: [
        {
            title: "1. Deductions from salaries",
            content: `
                <h3 class="font-bold mb-2">Scottish tax bands 2025/26</h3>
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
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Starter rate</td><td class="border border-gray-500 p-2">£12,570-£15,397</td><td class="border border-gray-500 p-2">19%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Basic rate</td><td class="border border-gray-500 p-2">£15,397-£27,491</td><td class="border border-gray-500 p-2">20%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Intermediate rate</td><td class="border border-gray-500 p-2">£27,491-£43,662</td><td class="border border-gray-500 p-2">21%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Higher rate</td><td class="border border-gray-500 p-2">£43,662-£75,000</td><td class="border border-gray-500 p-2">42%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Advanced rate</td><td class="border border-gray-500 p-2">£75,000-£125,140</td><td class="border border-gray-500 p-2">45%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Top rate</td><td class="border border-gray-500 p-2">Over £125,140</td><td class="border border-gray-500 p-2">48%</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="font-bold mb-2">National Insurance contributions</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li>You begin paying National Insurance once you earn more than £1048 a month (this is the amount for the 2025/26 tax year).</li>
                    <li>For payslips dated between 6 April 2025 and 5 April 2026, you pay 8% of your monthly earnings between £1048 and £4189; 2% of your monthly earnings above £4189.</li>
                    <li>National Insurance is calculated on a person's salary before deductions such as pension contributions.</li>
                </ul>
            `
        },
        {
            title: "2. Mortgage products and affordability",
            content: `
                <p class="mb-3">If you take out a mortgage, lenders consider the loan-to-value (LTV) ratio. This ratio is used in mortgage lending to calculate the amount of credit that can be offered to a borrower. LTV is an assessment of risk that financial institutions examine before approving a mortgage. Typically, loan assessments with high LTV ratios are considered higher-risk loans. Consequently, if the mortgage is approved, the loan will have a higher interest rate.</p>
                <p class="mb-3">Mortgages are more expensive for borrowers with a higher LTV due to these higher interest rates. A lower LTV is preferred by lenders, as it represents a lower-risk loan. However, borrowers must pay a larger deposit when taking out the mortgage. Most lenders offer the lowest possible interest rate when the LTV ratio is at or below 60%.</p>
                <p class="mb-3">If you choose a fixed rate mortgage, once it expires, you can remortgage and hopefully get a lower rate if the LTV has improved which will reduce the monthly payments.</p>
                <p class="mb-3">Borrowers and lenders must also consider affordability when arranging a mortgage. It is generally recommended that the 28/36 rule is followed. This means that:</p>
                <ul class="list-disc pl-5 mb-3 space-y-2">
                    <li>no more than 28% of taxable monthly income should be spent on housing loan costs, primarily mortgage payments</li>
                    <li>the total monthly debt repayments of a household should not exceed 36% of taxable monthly income – this also includes credit card debt and other loan repayments alongside mortgage payments.</li>
                </ul>
                <p>If a borrower's debt repayments are likely to exceed the above percentages, a lender may reject the application due to affordability concerns.</p>
            `
        },
        {
            title: "3. Honeybees",
            content: `
                <p class="mb-3">A beehive is an enclosure for a honeybee colony. In traditional beehives, no internal structures were provided and honeybees created their own honeycomb. Modern beehives have internal structures which are designed to encourage honeybees to construct honeycomb on frames which can be easily removed to extract honey.</p>
                <p class="mb-3">Most commercial beekeepers won't allow a single colony to have more than 100 000 honeybees as it is easier to control smaller colonies.</p>
                <p>The average honeybee lives for 6 weeks and will collect nectar within a 3-kilometre radius but may travel up to 10 kilometres when hungry.</p>
            `
        },
        {
            title: "4. Some helpful R commands",
            content: `
                <h3 class="font-bold text-lg mb-2 text-blue-300">Entering data to R Studio</h3>
                <p class="mb-3">To read in data from an Excel csv file called excel_data.csv to R Studio and name it mydata, first use the drop down menus in R Studio Session > Set Working Directory > Choose Directory to indicate the location of excel_data.csv on your computer. The following code will then read the data into R Studio:</p>
                <ul class="list-none pl-0 mb-6 space-y-2 font-mono text-sm bg-gray-800 p-4 rounded">
                    <li><span class="text-green-400">mydata&lt;-read.csv("excel data.csv")</span></li>
                    <li><span class="text-green-400">attach (mydata)</span> <span class="text-gray-400">- this adds the variable names</span></li>
                    <li><span class="text-gray-400">At the end of the analysis remember to use</span> <span class="text-green-400">detach (mydata)</span> <span class="text-gray-400">to disassociate the variable names.</span></li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(a) Graphics</h3>
                <p class="font-semibold mb-2">If you have the numeric variables X and Y:</p>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">hist (X, main= "Title", xlab="x-axis label", ylab="Frequency")</code> - this produces a histogram of the variable named X, it adds a title and axis labels</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">boxplot (Y, main="Title", ylab="y-axis label")</code> - produces a boxplot of the numerical variable Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">boxplot (X, Y, main="Title", xlab="x-axis label", ylab="y-axis label", names=c("X", "Y"))</code> - produces a comparative boxplot of the numerical variables X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">plot(X, Y, main="Scatterplot of Y on X", xlab="x-axis label", ylab="y-axis label")</code> - produces a scatterplot of Y on X</li>
                </ul>
                <p class="font-semibold mb-2 mt-4">If you have the categorical variable X:</p>
                <ul class="list-disc pl-5 mb-6 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">table (X)</code> - computes the number of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">pie (table (X), main="Title")</code> - this gives a simple pie chart of the categories in variable X with the specified title</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">barplot (table (X), main="Title", xlab="x-axis label", ylab="Frequency")</code> - this gives a bar chart of the categorical variable X with the required title and axis labels</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(b) Descriptive Statistics</h3>
                <ul class="list-disc pl-5 mb-6 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">mean (X)</code> - computes the mean of the numerical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">sd (X)</code> - computes the standard deviation of the numerical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary(X)</code> - computes the mean, median, minimum, maximum and upper and lower quartiles of the numerical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">IQR (X)</code> - computes the interquartile range of the numerical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))</code> - returns the proportion of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))*100</code> - returns the percentage of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">table (X, Y)</code> - produces a cross-tabulation between the two categorical variables X and Y</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(c) Correlation and Regression</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">cor.test(X, Y)</code> - computes the correlation between X and Y and performs a test of the null hypothesis of zero correlation</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">lm (Y~X)</code> - fits a linear regression line to the data (lm command stands for linear model)</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">abline (lm (Y~X))</code> - adds the least squares linear regression line to an existing scatterplot of Y on X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary(lm(Y~X))</code> - displays the coefficient of determination (R-squared)</li>
                </ul>
                <p class="font-semibold mb-2 mt-4">To predict with your Linear Model:</p>
                <ul class="list-disc pl-5 mb-6 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">predict(lm(Y~X), newdata=data.frame(X=C), interval = "pred")</code> - computes the predicted value of Y when X=C along with a 95% prediction interval</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(d) Hypothesis Testing</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test(X, Y)</code> - performs a two-sample t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test(X, Y, paired=TRUE)</code> - performs a paired t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.test(x=c(a,b), n=c(n1,n2))</code> - performs a two-sample test for equality of proportions</li>
                </ul>
            `
        }
    ]
};