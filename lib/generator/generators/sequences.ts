import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";
import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";

export function generateSequencesQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  let type = -1;
  if (selectedTopic === "Limit of a sequence") type = 0;
  else if (selectedTopic === "Finding the recurrence relation") type = 1;
  else if (selectedTopic === "Finding a specific term of a sequence") type = 2;
  else if (selectedTopic === "Forming a recurrence relation") type = 3;

  if (type === -1) {
    type = Math.floor(Math.random() * 4);
  }

  const actualTopic =
    type === 0
      ? "Limit of a sequence"
      : type === 1
        ? "Finding the recurrence relation"
        : type === 2
          ? "Finding a specific term of a sequence"
          : "Forming a recurrence relation";

  if (type === 0) {
    const isNoLimit = Math.random() > 0.8;
    const isFraction = Math.random() > 0.5;

    let p = 0, q = 1, b = 0, aStr = "", bStr = "", limitStr = "", L = 0;

    if (isNoLimit) {
      if (isFraction && Math.random() > 0.5) {
        // improper fraction
        const badFracs = [{ p: 3, q: 2 }, { p: 4, q: 3 }, { p: 5, q: 2 }, { p: -3, q: 2 }];
        const chosen = badFracs[Math.floor(Math.random() * badFracs.length)];
        p = chosen.p; q = chosen.q;
        aStr = p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
      } else {
        // decimal > 1 or < -1
        const badDec = [1.5, 2.4, 3, -1.2, -2, -3.5];
        aStr = badDec[Math.floor(Math.random() * badDec.length)].toString();
      }
      b = getRandomInt(-10, 10);
      bStr = b < 0 ? `- ${-b}` : `+ ${b}`;
    } else {
      if (isFraction) {
        const fractions = [
          { p: 1, q: 2 }, { p: 1, q: 3 }, { p: 2, q: 3 },
          { p: 1, q: 4 }, { p: 3, q: 4 }, { p: 1, q: 5 },
          { p: 2, q: 5 }, { p: -1, q: 2 }, { p: -1, q: 3 }
        ];
        const chosen = fractions[Math.floor(Math.random() * fractions.length)];
        p = chosen.p; q = chosen.q;

        const kChoices = [1, 2, 3, 4, 5, 10, -1, -2, -3, -4, -5];
        let k = kChoices[Math.floor(Math.random() * kChoices.length)];
        while (k * (q - p) === 0) k = kChoices[Math.floor(Math.random() * kChoices.length)];
        b = k * (q - p);
        L = (b * q) / (q - p);

        aStr = p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
      } else {
        const decs = [
          { val: 0.2, den: 0.8 }, { val: 0.4, den: 0.6 },
          { val: 0.5, den: 0.5 }, { val: 0.6, den: 0.4 },
          { val: 0.8, den: 0.2 }, { val: 0.9, den: 0.1 },
          { val: -0.2, den: 1.2 }, { val: -0.5, den: 1.5 }
        ];
        const dec = decs[Math.floor(Math.random() * decs.length)];
        aStr = dec.val.toString();
        // pick limit L such that b is nice if possible. b = L * (1-a)
        const possibleL = [2, 5, -5, 10, 20, 30, -10, 40, 50, 100];
        L = possibleL[Math.floor(Math.random() * possibleL.length)];
        b = Number((L * dec.den).toFixed(1));
      }
      bStr = b < 0 ? `- ${-b}` : `+ ${b}`;
    }

    if (isNoLimit) {
      return {
        subTopic: actualTopic,
        questionLines: [
          `A sequence is defined by the recurrence relation $u_{n+1} = ${aStr}u_n ${bStr}$.`,
          `Calculate the limit of this sequence as $n \\rightarrow \\infty$, or state that no limit exists.`
        ],
        boardQuestionLines: [
          `$u_{n+1} = ${aStr}u_n ${bStr}$`,
          `Find the limit, or state if it doesn't exist.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Check the multiplier $a = ${aStr}$.`,
          `<strong>2.</strong> A limit only exists if $-1 < a < 1$.`,
          `<strong>3.</strong> Since $a = ${aStr}$ is outside this range, the sequence diverges. No limit exists.`
        ],
        finalAnswer: `No limit exists`
      };
    }

    return {
      subTopic: actualTopic,
      questionLines: [
        `A sequence is defined by the recurrence relation $u_{n+1} = ${aStr}u_n ${bStr}$.`,
        `Explain why this sequence approaches a limit as $n \\rightarrow \\infty$ and calculate this limit.`
      ],
      boardQuestionLines: [
        `$u_{n+1} = ${aStr}u_n ${bStr}$`,
        `Explain why it approaches a limit and calculate it.`
      ],
      solutionSteps: [
        `<strong>1.</strong> A limit exists because this is a linear recurrence relation and $-1 < a < 1$ ($-1 < ${aStr} < 1$).`,
        `<strong>2.</strong> State the formula for the limit: $L = \\frac{b}{1 - a}$`,
        `<strong>3.</strong> Substitute $a = ${aStr}$ and $b = ${b}$:<br><br>$L = \\frac{${b}}{1 - ${aStr}}$`,
        isFraction ? `<strong>4.</strong> Simplify the denominator: $1 - ${aStr} = \\frac{${q - p}}{${q}}$<br><br>$L = \\frac{${b}}{\\frac{${q - p}}{${q}}} = ${b} \\times \\frac{${q}}{${q - p}} = ${L}$` : `<strong>4.</strong> Simplify and calculate: $L = \\frac{${b}}{${Number((1 - Number(aStr)).toFixed(2))}} = ${L}$`
      ],
      finalAnswer: `Limit exists since $-1 < a < 1$<br>$L = ${L}$`,
    };
  } else if (type === 1) {
    const fractions = [
      { p: 1, q: 2 },
      { p: 1, q: 3 },
      { p: 2, q: 3 },
      { p: 1, q: 4 },
      { p: 3, q: 4 },
      { p: 3, q: 2 },
      { p: 4, q: 3 },
      { p: 5, q: 4 },
      { p: 2, q: 1 },
      { p: 3, q: 1 },
      { p: -2, q: 1 },
    ];
    const { p, q } = fractions[Math.floor(Math.random() * fractions.length)];

    const k1 = getRandomInt(-10, 10);
    const k2 = getRandomInt(-10, 10);

    const u1 = q * k1;
    const c = q * k2 - p * k1;
    const u2 = q * k2;
    const u3 = p * k2 + c;

    const mStr =
      q === 1 ? `${p}` : p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
    const cStr = c < 0 ? `- ${-c}` : `+ ${c}`;
    const u4Num = p * u3 + q * c;
    const u4Str = formatFraction(u4Num, q);

    return {
      subTopic: actualTopic,
    questionLines: [
      `A sequence is defined by the recurrence relation $u_{n+1} = mu_n + c$, where $m$ and $c$ are constants.`,
      `The first three terms of the sequence are $u_1 = ${u1}$, $u_2 = ${u2}$ and $u_3 = ${u3}$.`,
      `Find the values of $m$ and $c$, and hence find the value of the fourth term, $u_4$.`
    ],
    boardQuestionLines: [
      `Given $u_{n+1} = mu_n + c$,`,
      `with $u_1 = ${u1}$, $u_2 = ${u2}$ and $u_3 = ${u3}$.`,
      `Find $m$, $c$ and $u_4$.`
    ],
      solutionSteps: [
        `<strong>1.</strong> Set up a system of equations using the given terms:<br><br>$\\begin{cases} ${u2} = m(${u1}) + c \\\\[6pt] ${u3} = m(${u2}) + c \\end{cases}$`,
        `<strong>2.</strong> Subtract the first equation from the second to eliminate $c$:<br><br>$${u3} - ${u2} = m(${u2}) - m(${u1})$<br>$${u3 - u2} = ${u2 - u1}m$`,
        `<strong>3.</strong> Solve for $m$:<br><br>$m = \\frac{${u3 - u2}}{${u2 - u1}}$<br>$m = ${mStr}$`,
        `<strong>4.</strong> Substitute $m$ back into the first equation to find $c$:<br><br>$${u2} = ${mStr}(${u1}) + c$<br>$${u2} = ${p * k1} + c$<br>$c = ${c}$`,
        `<strong>5.</strong> Write the full recurrence relation: $u_{n+1} = ${mStr}u_n ${cStr}$`,
        `<strong>6.</strong> Find $u_4$:<br><br>$u_4 = ${mStr}(${u3}) ${cStr}$<br>$u_4 = ${u4Str}$`,
      ],
      finalAnswer: `$m = ${mStr}$, $c = ${c}$, $u_4 = ${u4Str}$`,
    };
  } else if (type === 2) {
    const kChoices = [-4, -3, -2, 2, 3, 4, 5];
    let k = kChoices[Math.floor(Math.random() * kChoices.length)];
    const c = getRandomInt(-20, 20);
    const u1 = getRandomInt(-5, 10);
    const u2 = k * u1 + c;
    const u3 = k * u2 + c;
    const u4 = k * u3 + c;

    if (Math.random() < 0.5) {
      return {
        subTopic: actualTopic,
    questionLines: [
      `A sequence is generated by the recurrence relation $u_{n+1} = ${k}u_n ${c < 0 ? `- ${-c}` : `+ ${c}`}$.`,
      `Given $u_1 = ${u1}$, find the value of $u_4$.`
    ],
    boardQuestionLines: [
      `Given $u_{n+1} = ${k}u_n ${c < 0 ? `- ${-c}` : `+ ${c}`}$,`,
      `and $u_1 = ${u1}$.`,
      `Calculate $u_4$.`
    ],
        solutionSteps: [
          `<strong>1.</strong> Use the recurrence relation to iteratively find the next terms.`,
          `<strong>2.</strong> Find $u_2$:<br><br>$u_2 = ${k}(${u1}) ${c < 0 ? `- ${-c}` : `+ ${c}`} = ${u2}$`,
          `<strong>3.</strong> Find $u_3$:<br><br>$u_3 = ${k}(${u2}) ${c < 0 ? `- ${-c}` : `+ ${c}`} = ${u3}$`,
          `<strong>4.</strong> Find $u_4$:<br><br>$u_4 = ${k}(${u3}) ${c < 0 ? `- ${-c}` : `+ ${c}`} = ${u4}$`,
        ],
        finalAnswer: `$u_4 = ${u4}$`,
      };
    } else {
      return {
        subTopic: actualTopic,
    questionLines: [
      `A sequence is generated by the recurrence relation $u_{n+1} = ${k}u_n ${c < 0 ? `- ${-c}` : `+ ${c}`}$.`,
      `Given $u_3 = ${u3}$, determine the value of $u_1$.`
    ],
    boardQuestionLines: [
      `Given $u_{n+1} = ${k}u_n ${c < 0 ? `- ${-c}` : `+ ${c}`}$,`,
      `and $u_3 = ${u3}$.`,
      `Calculate $u_1$.`
    ],
        solutionSteps: [
          `<strong>1.</strong> Set up an equation for $u_3$ to solve for $u_2$:<br><br>$u_3 = ${k}u_2 ${c < 0 ? `- ${-c}` : `+ ${c}`}$`,
          `<strong>2.</strong> Substitute $u_3 = ${u3}$:<br><br>$${u3} = ${k}u_2 ${c < 0 ? `- ${-c}` : `+ ${c}`}$`,
          `<strong>3.</strong> Solve for $u_2$:<br><br>$${u3 - c} = ${k}u_2$<br>$u_2 = ${u2}$`,
          `<strong>4.</strong> Set up an equation for $u_2$ to solve for $u_1$:<br><br>$u_2 = ${k}u_1 ${c < 0 ? `- ${-c}` : `+ ${c}`}$`,
          `<strong>5.</strong> Substitute $u_2 = ${u2}$:<br><br>$${u2} = ${k}u_1 ${c < 0 ? `- ${-c}` : `+ ${c}`}$`,
          `<strong>6.</strong> Solve for $u_1$:<br><br>$${u2 - c} = ${k}u_1$<br>$u_1 = ${u1}$`,
        ],
        finalAnswer: `$u_1 = ${u1}$`,
      };
    }
  } else {
    // Type 3: Forming a recurrence relation (Contextual problem)
    const isMedication = Math.random() > 0.5;

    if (isMedication) {
      const initialDose = getRandomInt(10, 30) * 10; // e.g. 100, 150, ..., 300
      const declinePerc = getRandomInt(15, 45); // e.g. 20, 25, 40
      const aVal = 1 - declinePerc / 100;
      const hourlyDose = getRandomInt(5, 15) * 10; // e.g. 50, 100
      
      const thresholdAbove = getRandomInt(initialDose-30, initialDose+30);
      
      const L = Math.round(hourlyDose / (1 - aVal));
      
      const targetVal = Math.round(L * (Math.random() < 0.5 ? 1.1 : 0.9));
      
      let doses = 1;
      let currentLevel = initialDose;
      while (currentLevel <= thresholdAbove && doses < 10) {
        currentLevel = aVal * currentLevel + hourlyDose;
        doses++;
      }

      return {
        subTopic: actualTopic,
        questionLines: [
          `A patient is given an initial ${initialDose}mg dose of medication.`,
          `The levels in the bloodstream will decrease by ${declinePerc}% each hour. To compensate, a new dose of ${hourlyDose}mg is given hourly.`,
          `<b>(a)</b> How many new doses will it take for the level to consistently stay above ${thresholdAbove}mg?`,
          `<b>(b)</b> A recurrence relation in the form $u_{n+1} = a u_n + b$ can be used to model this course of treatment. Write down values for $a$ and $b$.`,
          `<b>(c)</b> It is known that more than ${targetVal}mg in the bloodstream results in serious side effects. Is it safe to continue this course of treatment indefinitely?`
        ],
        boardQuestionLines: [
          `Initially ${initialDose}mg. Drops ${declinePerc}%/hr.`,
          `Hourly dose of ${hourlyDose}mg is added.`,
          `(a) Doses to stay > ${thresholdAbove}mg?`,
          `(b) Find $a$ and $b$ for $u_{n+1} = a u_n + b$.`,
          `(c) Side effects if > ${targetVal}mg. Is it safe long term?`
        ],
        solutionSteps: [
          `<strong>1. (a)</strong> Calculate terms: $u_1 = ${initialDose}$`,
          `$u_2 = (${aVal} \\times ${initialDose}) + ${hourlyDose} = ${(aVal * initialDose + hourlyDose).toFixed(2)}$`,
          doses > 2 ? `$u_3 = (${aVal} \\times ${(aVal * initialDose + hourlyDose).toFixed(2)}) + ${hourlyDose} = ${(aVal * (aVal * initialDose + hourlyDose) + hourlyDose).toFixed(2)}$` : `...`,
          `It takes ${doses-1} new doses (term $u_{${doses}}$).`,
          `<strong>1. (b)</strong> A decline of ${declinePerc}% leaves ${100 - declinePerc}%, so $a = ${aVal}$. Added hourly is $b = ${hourlyDose}$.`,
          `<strong>1. (c)</strong> Calculate the limit: $L = \\frac{b}{1 - a} = \\frac{${hourlyDose}}{1 - ${aVal}} = \\frac{${hourlyDose}}{${(declinePerc/100).toFixed(2)}} = ${L}$.`,
          `Since the limit is ${L}mg, it is ${L > targetVal ? `not safe (exceeds ${targetVal}mg).` : `safe (stays below ${targetVal}mg).`}`
        ],
        finalAnswer: `(a) ${doses-1} doses<br>(b) $a = ${aVal}, b = ${hourlyDose}$<br>(c) Limit is ${L}mg. ${L > targetVal ? 'Not safe.' : 'Safe.'}`
      };
    } else {
      const animalNames = [
        "Common Blue butterflies",
        "Red squirrels",
        "Golden eagles",
        "Pine martens",
        "Scottish wildcats",
      ];
      const animal = animalNames[Math.floor(Math.random() * animalNames.length)];
      const declinePerc = getRandomInt(2, 15) / 10 + getRandomInt(1, 5) * 1; // e.g. 2.5, 3.5, 4.0
      const addAmt = getRandomInt(1, 9) * 100;
      const initialPop = getRandomInt(5, 20) * 1000;

      // declinePerc can be 3.5. Multiplier is 100 - 3.5 = 96.5% = 0.965
      // a = 1 - declinePerc/100
      const aVal = 1 - declinePerc / 100;
      const L = Math.round(addAmt / (1 - aVal));
      const isExceedPrompt = Math.random() < 0.5;
      const targetVal = isExceedPrompt
        ? Math.ceil(L / 1000) * 1000 + 1000
        : Math.floor(L / 1000) * 1000 - 1000;

      return {
        subTopic: actualTopic,
      questionLines: [
        `The population of ${animal} in a region is observed to be declining by ${declinePerc}% per year. To increase the population, scientists plan to release ${addAmt} of this species within the region at the end of each year.`,
        `Let $u_n$ represent the population of ${animal} at the beginning of the year, $n$ years after the first annual reintroduction.`,
        `It is known that $u_n$ and $u_{n+1}$ satisfy the recurrence relation $u_{n+1} = a u_n + b$, where $a$ and $b$ are constants.`,
        `<b>(a)</b> State the values of $a$ and $b$.`,
        `<b>(b)</b> Explain whether or not the population will stabilise in the long term.`,
        `<b>(c)</b> Contextual Limit: The population at the beginning of the reintroduction was estimated at ${initialPop}. Explain whether or not the population will ever reach/exceed ${targetVal}.`
      ],
      boardQuestionLines: [
        `A population of ${animal} declines by ${declinePerc}% per year.`,
        `${addAmt} are added at the end of each year.`,
        `State the recurrence relation $u_{n+1} = au_n + b$.`,
        `Will the population eventually reach ${targetVal}?`
      ],
        solutionSteps: [
          `<strong>1. (a)</strong> A decline of ${declinePerc}% means the population is multiplied by $100\\% - ${declinePerc}\\% = ${100 - declinePerc}\\% = ${aVal}$.<br><br>So $a = ${aVal}$.<br><br>$b$ is the amount added each year, so $b = ${addAmt}$.`,
          `<strong>1. (b)</strong> A limit exists because this is a linear recurrence relation and $-1 < a < 1$ ($-1 < ${aVal} < 1$). So the population will stabilise.`,
          `<strong>1. (c)</strong> Calculate the limit to see if it reaches ${targetVal} in the long run:<br>Limit $L = \\frac{b}{1 - a} = \\frac{${addAmt}}{1 - ${aVal}} = \\frac{${addAmt}}{${declinePerc / 100}} \\approx ${L}$`,
          `Since the limit is approximately ${L}, and the sequence limits to this value, the population will ${L >= targetVal ? "reach and exceed" : "never reach"} ${targetVal}.`,
        ],
        finalAnswer: `(a) $a = ${aVal}$, $b = ${addAmt}$<br>(b) Yes, limit exists since $-1 < ${aVal} < 1$<br>(c) Limit $L = ${L}$. Since $L ${L >= targetVal ? "\\ge" : "<"} ${targetVal}$, population ${L >= targetVal ? "will" : "will not"} exceed ${targetVal}.`,
      };
    }
  }
}
