export const higherAppsDataBooklet2025 = {
    title: "Applications of Mathematics Data Booklet 2025",
    sections: [
        {
            title: "1. Deductions from salaries",
            content: `
                <h3 class="font-bold mb-2">Scottish tax bands 2024/25</h3>
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
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Starter rate</td><td class="border border-gray-500 p-2">£12,570-£14,876</td><td class="border border-gray-500 p-2">19%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Basic rate</td><td class="border border-gray-500 p-2">£14,876-£26,561</td><td class="border border-gray-500 p-2">20%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Intermediate rate</td><td class="border border-gray-500 p-2">£26,561-£43,662</td><td class="border border-gray-500 p-2">21%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Higher rate</td><td class="border border-gray-500 p-2">£43,662-£75,000</td><td class="border border-gray-500 p-2">42%</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2">Advanced rate</td><td class="border border-gray-500 p-2">£75,000-£125,140</td><td class="border border-gray-500 p-2">45%</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2">Top rate</td><td class="border border-gray-500 p-2">Over £125,140</td><td class="border border-gray-500 p-2">48%</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="font-bold mb-2">National Insurance contributions</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li>You begin paying National Insurance once you earn more than £1048 a month (this is the amount for the 2024/25 tax year).</li>
                    <li>For payslips dated between 6 April 2024 and 5 April 2025, you pay 8% of your monthly earnings between £1048 and £4189; 2% of your monthly earnings above £4189.</li>
                    <li>National Insurance is calculated on a person's salary before deductions such as pension contributions.</li>
                </ul>
            `
        },
        {
            title: "2. Lifetime ISA",
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li>You can use a Lifetime ISA (Individual Savings Account) to buy your first home or save for later life.</li>
                    <li>You must be 18 or over but under 40 to open a Lifetime ISA.</li>
                    <li>You must make your first deposit into your ISA before your 40th birthday and can make further deposits until the day before your 50th birthday.</li>
                    <li>You can save up to £4000 a year as a lump sum or by putting in cash when you can.</li>
                    <li>The government will add a 25% bonus to your savings, up to a maximum of £1000 per year. The bonus is paid every month, on new deposits that have been made. Once in your account the bonus becomes part of your savings and interest can be applied.</li>
                    <li>When you turn 50, you will not be able to make any further deposits into your Lifetime ISA or earn any further bonuses. Your account will stay open, and your savings will still earn interest.</li>
                    <li>You can withdraw money from your ISA if you are: buying your first home, aged 60 or over, or terminally ill, with less than 12 months to live.</li>
                    <li>You will pay a withdrawal charge of 25% if you withdraw cash or assets for any other reason (also known as making an 'unauthorised withdrawal'). This charge is deducted from the amount withdrawn. This recovers the government bonus you received on your original deposits.</li>
                </ul>
            `
        },
        {
            title: "3. Feeding chicks",
            content: `
                <p class="mb-3">One of the most important considerations for poultry owners is picking the right type of feed. When feeding freshly hatched chicks, it might be tempting to save money by feeding them the same feed given to adult birds. However, a specially formulated diet that will help them grow at this early stage of life is required.</p>
                <p class="mb-3">Specialised chick feed is recommended from birth up until six weeks old. This type of feed has between 20% and 24% protein to boost their metabolism and enable them to increase their mass appropriately and feather out rapidly.</p>
                <p class="mb-3">At three weeks old, chicks typically weigh 200 grams. If a chick has not been fed specialised chick feed, they are likely to experience stunted growth indicated by a mass of under 200 grams.</p>
                <p>After six weeks, the chicks can slowly transition to another type of feed.</p>
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
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary (X)</code> - computes the mean, median, minimum, maximum and upper and lower quartiles of the numerical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">IQR (X)</code> - computes the interquartile range of the numerical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))</code> - returns the proportion of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table(X))*100</code> - returns the percentage of observations in each level of the categorical variable X</li>
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
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test (X, Y, paired=TRUE)</code> - performs a paired t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.test (x=c(a,b), n=c(n1,n2))</code> - performs a two-sample test for equality of proportions</li>
                </ul>
            `
        }
    ]
};