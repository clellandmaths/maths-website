export const higherAppsDataBookletSpec1 = {
    title: "Higher Applications of Mathematics Specimen — Data Booklet",
    sections: [
        {
            title: "1. Mountain gorillas",
            content: `
                <p class="mb-4">Deforestation is happening on a massive scale throughout the world and many animals are experiencing habitat loss. Conservation teams have been campaigning against deforestation in a bid to increase wildlife populations.</p>
                <p class="mb-4">One success story is the mountain gorilla. More than half of the world's mountain gorillas live in the Virunga Mountains, a range of extinct volcanoes that border the Democratic Republic of Congo, Rwanda and Uganda.</p>
                <p class="mb-4">A study in 2008 showed there were only 680 mountain gorillas in the Virunga Mountains. A further study in 2020 showed that due to conservation efforts, including clamping down on illegal logging, the population of mountain gorillas had increased.</p>
                <p class="mb-4">Mountain gorillas are considered adults when they are 10 years old and will live for an average of 35 years. Mountain gorillas survive on a mainly vegetarian diet consisting of bamboo shoots, fruit, and berries. Given the opportunity, mountain gorillas will also eat ants and termites, but their diet will remain mostly vegetarian.</p>
            `
        },
        {
            title: "2. Some helpful R commands",
            content: `
                <h3 class="font-bold text-lg mb-2 text-blue-300">Entering data to R Studio</h3>
                <p class="mb-3">To read in data from an Excel csv file called excel_data.csv to R Studio and name it mydata, first use the drop down menus in R Studio Session > Set Working Directory > Choose Directory to indicate the location of excel_data.csv on your computer. The following code will then read the data in to R Studio:</p>
                <ul class="list-none pl-0 mb-6 space-y-2 font-mono text-sm bg-gray-800 p-4 rounded">
                    <li><span class="text-green-400">mydata&lt;-read.csv("excel data.csv")</span></li>
                    <li><span class="text-green-400">attach (mydata)</span> <span class="text-gray-400">- this adds the variable names</span></li>
                    <li><span class="text-gray-400">At the end of the analysis remember to use</span> <span class="text-green-400">detach (mydata)</span> <span class="text-gray-400">to disassociate the variable names.</span></li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(a) Graphics</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">hist (X,col="yellow", main="Histogram of X (units)")</code> - this produces a histogram of the variable named 'X'</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">plot (X, Y, xlab="x-axis label", ylab="y-axis label", main="Scatterplot of Y on X",pch=21,bg="black")</code> - produces a scatterplot of X vs Y with black dots of the size specified by 'pch'</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">pie (table (X), main="Title")</code> - this gives a simple pie chart of the categories in variable X with the specified title</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">barplot (table (X), main="title", xlab="x-axis label", col="orange")</code> - this gives a bar chart of the categories in the variable X with the required title, axis labels and colour</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">boxplot (Y)</code> - produces a boxplot of the numerical variable Y</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(b) Descriptive Statistics</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">mean (X)</code> - computes the mean of X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">sd (X)</code> - computes the standard deviation of X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary(X)</code> - computes the mean, median, minimum, maximum and upper and lower quartiles</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">table (X)</code> - computes the number of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))</code> - returns the proportion of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.table (table (X))*100</code> - returns the percentage of observations in each level of the categorical variable X</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">table (X, Y)</code> - produces a cross-tabulation between the two categorical variables X and Y</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(c) Correlation and Regression</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">cor.test(age, length)</code> - computes the correlation between X and Y and performs a test of the null hypothesis of zero correlation</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">lm (Y~X)</code> - fits a linear regression line to the data (lm command stands for linear model)</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">abline (lm (Y~X))</code> - produces a scatterplot with the least squares linear regression line superimposed on the data</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">summary(lm(Y~X))</code> - displays the coefficient of determination (r-squared)</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">predict (lm(Y~X), newdata=data.frame (X=C), interval = "pred")</code> - computes the predicted value of Y when X=C along with a 95% prediction interval</li>
                </ul>

                <h3 class="font-bold text-lg mb-2 text-blue-300">(d) Hypothesis Testing</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test(X, Y)</code> - performs a two sample t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">t.test (X, Y, paired=TRUE)</code> - performs a paired t-test between X and Y</li>
                    <li><code class="text-green-400 bg-gray-800 px-1 rounded">prop.test(x=c(a,b), n=c(n1,n2))</code> - performs a 2-sample test for equality of proportions with continuity correction</li>
                </ul>
            `
        }
    ]
};