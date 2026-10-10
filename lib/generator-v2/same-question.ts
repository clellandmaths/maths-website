/**
 * The owner's "same question" test (2026-10-07), moved here from the prototype in
 * tools/never-the-paper/scripts/same-question.ts on 2026-10-08, word for word, to serve the guard
 * ("never the paper's own question", `paper-guard.ts`) and the worksheet's no-twins rule. Proven there
 * by its test pairs, by deliberate mutations, and by the owner's blind "Same or Different?" test.
 *
 * Two draws are the same question when they differ only by:
 *   - the order of things that can be swapped: terms of a sum, factors of a product, the given facts
 *     in a list, the parts of an answer ("x = 2 and x = 1" / "x = 1 and x = 2");
 *   - letters (renamed in order of appearance, AFTER the reordering, so "PR = 6, QR = 8" and
 *     "TU = 6, SU = 8" come out alike);
 *   - the story, its words and its units (only the numbers in the words count, as a set).
 * A real change still makes a different question: + for −, sin for cos, a number in another place in
 * something that cannot be swapped (2t/s ÷ t/3s² against 3t/s ÷ t/2s²).
 *
 * No imports, deliberately: it is pure string work, shared by the engine and the checks.
 */

const FORMAT_CMDS = /\\(?:left|right|displaystyle|,|;|!|:|quad|qquad)\b|\\[,;!:]/g;

/** Light clean-up of one maths segment, so spacing and spelling do not count. */
function prep(s: string): string {
  return s
    // a column vector's environment name is not letters of the question (it read as p, m, a, t, r, i, x)
    .replace(/\\begin\{[a-z]*matrix\}/g, '⟨').replace(/\\end\{[a-z]*matrix\}/g, '⟩').replace(/\\\\/g, ';')
    // "the graph of f(x) = …" is "the graph of y = …"
    .replace(/^\s*f\(x\)\s*=/, 'y =')
    // a point's name: "A(5, 9)" is the point (5, 9)
    .replace(/(?<![A-Za-z\\])[A-Z]\s*\(/g, '(')
    .replace(FORMAT_CMDS, '')
    .replace(/\\[dt]frac/g, '\\frac')
    .replace(/(\d)\s*\\cdot\s*(\d)/g, '$1.$2')
    .replace(/\\cdot/g, '\\times')
    .replace(/[−–]/g, '-')
    .replace(/\\lt\b/g, '<').replace(/\\gt\b/g, '>').replace(/\\leq?\b/g, '≤').replace(/\\geq?\b/g, '≥')
    .replace(/\^\{([^{}])\}/g, '^$1').replace(/_\{([^{}])\}/g, '_$1')
    // a power of a power with its two powers swapped is the same (the owner, 2026-10-08): (n^3)^2 is (n^2)^3
    .replace(/\(([a-zA-Z])\^(\d+)\)\^(\d+)/g, (_, v, a, b) => `(${v}^${Math.min(+a, +b)})^${Math.max(+a, +b)}`)
    // the owner, 2026-10-08 (blind test): a trig equation with its two numbers swapped is the same question,
    // 12 tan x − 1 = 3 and 12 tan x − 3 = 1 (both 12 tan x = 4). Only with a minus: there the swap keeps the
    // working; with a plus it changes the answer (5 sin x + 2 = 4 against + 4 = 2), and a sign change stays a
    // real change (7 sin x + 2 = 3 against 7 sin x − 3 = −2, the owner's ruling of 2026-10-07).
    .replace(/^(\d*\s*\\(?:sin|cos|tan)\s*x\s*\^\s*\{?\\circ\}?)\s*-\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)$/,
      (_, lhs, a, b) => `${lhs} - ${Math.min(+a, +b)} = ${Math.max(+a, +b)}`)
    // (x + 2)^2 is (x + 2)(x + 2)
    .replace(/\(([^()]*)\)\^2(?![0-9])/g, '($1)($1)')
    .replace(/\s+/g, ' ')
    .replace(/[.,]\s*$/, '')
    .trim();
}

const OPEN = '({[', CLOSE = ')}]';

/** Split at depth 0 where `test(i)` says a separator starts; returns [piece, separator-before-it]. */
function splitTop(s: string, sep: RegExp): { sep: string; part: string }[] {
  const out: { sep: string; part: string }[] = [];
  let depth = 0, start = 0, lead = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (OPEN.includes(c)) depth++;
    else if (CLOSE.includes(c)) depth--;
    else if (depth === 0) {
      sep.lastIndex = i;
      const m = sep.exec(s);
      if (m && m.index === i && m[0].length) {
        out.push({ sep: lead, part: s.slice(start, i).trim() });
        lead = m[0].trim();
        start = i + m[0].length;
        i = start - 1;
      }
    }
  }
  out.push({ sep: lead, part: s.slice(start).trim() });
  return out;
}

/** A sort key that ignores which letter is which, so reordering happens before renaming. */
const abstract = (s: string) => s.replace(/\\[a-zA-Z]+|[a-zA-Z]/g, m => (m.startsWith('\\') ? m : 'L'));

/** Canonical form of the inside of a group: braces and brackets canonicalised recursively. */
function groups(s: string): string {
  let out = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '(' || c === '{' || c === '[') {
      const close = c === '(' ? ')' : c === '{' ? '}' : ']';
      let depth = 0, j = i;
      for (; j < s.length; j++) {
        if (s[j] === c) depth++;
        else if (s[j] === close && --depth === 0) break;
      }
      out += c + expr(s.slice(i + 1, j)) + (s[j] ?? '');
      i = j + 1;
    } else { out += c; i++; }
  }
  return out;
}

/**
 * A product: factors split on \times, \div and ")(" juxtaposition, each canonicalised, then sorted.
 *
 * The owner's ruling (c), 2026-10-08: coefficients moved between the algebraic factors of a product are
 * the same question (2s/t × 4t²/s and 4s/t × 2t²/s; 2t/s ÷ t/3s² and 3t/s ÷ t/2s²; c² × 5c³ and
 * n³ × 5n²). So each factor WITH LETTERS gives up its whole-number coefficient (numerator over
 * denominator, inverted after a ÷) to one coefficient for the product. Pure numbers are never pooled:
 * 1/6 × 3/4 and 3/8 × 1/3 both make 1/8 and are still two questions.
 */
function product(t: string): string {
  // juxtaposed brackets: (x - 3)(x + 5) -> two factors
  const marked = t.replace(/\)\s*\(/g, ') \\times (');
  const parts = splitTop(marked, /\\times|\\div/y)
    .map(f => ({ div: f.sep === '\\div', f: groups(f.part) })).filter(p => p.f);
  if (parts.length < 2) return parts.length ? `${parts[0].div ? '\\div ' : ''}${parts[0].f}` : '';
  let num = 1, den = 1, pooled = false;
  const rest: string[] = [];
  for (const p of parts) {
    const c = coefficient(p.f);
    if (!c) { rest.push(`${p.div ? '\\div ' : ''}${p.f}`); continue; }
    pooled = true;
    if (p.div) { num *= c.d; den *= c.n; } else { num *= c.n; den *= c.d; }
    rest.push(`${p.div ? '\\div ' : ''}${c.rest}`);
  }
  const sorted = rest.sort((a, b) => abstract(a).localeCompare(abstract(b))).join(' \\times ');
  if (!pooled) return sorted;
  const g = gcd(num, den);
  const coef = den / g === 1 ? `${num / g}` : `${num / g}/${den / g}`;
  return coef === '1' ? sorted : `${coef} \\times ${sorted}`;
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) || 1 : gcd(b, a % b));
const hasLetters = (s: string) => /[a-zA-Z]/.test(s.replace(/\\[a-zA-Z]+/g, ''));

/** The whole-number coefficient of an algebraic factor, and what is left: "5c^3" -> 5, "c^3";
 *  "\frac{2s}{t}" -> 2, "\frac{s}{t}"; "\frac{t}{3s^2}" -> 1/3, "\frac{t}{s^2}". Null for a pure number. */
function coefficient(f: string): { n: number; d: number; rest: string } | null {
  if (!hasLetters(f)) return null;
  const lead = (s: string) => {
    const m = /^(\d+)\s*(?=[a-zA-Z\\(])/.exec(s);
    return m ? { k: Number(m[1]), r: s.slice(m[0].length) } : { k: 1, r: s };
  };
  const fr = /^\\frac\{/.test(f) ? fracParts(f) : null;
  if (fr) {
    const a = /^\d+$/.test(fr.num.trim()) ? { k: Number(fr.num.trim()), r: '1' } : lead(fr.num);
    const b = lead(fr.den);
    return { n: a.k, d: b.k, rest: `\\frac{${a.r}}{${b.r}}` };
  }
  const a = lead(f);
  return { n: a.k, d: 1, rest: a.r };
}

/** "\frac{A}{B}" as a whole factor -> A and B (balanced braces); null if the factor is more than that. */
function fracParts(f: string): { num: string; den: string } | null {
  const take = (i: number): [string, number] | null => {
    if (f[i] !== '{') return null;
    let depth = 0;
    for (let j = i; j < f.length; j++) {
      if (f[j] === '{') depth++;
      else if (f[j] === '}' && --depth === 0) return [f.slice(i + 1, j), j + 1];
    }
    return null;
  };
  const n = take(5); if (!n) return null;
  const d = take(n[1]); if (!d || d[1] !== f.length) return null;
  return { num: n[0], den: d[0] };
}

/** A sum: terms with their signs, each a product, sorted. A leading "+" is dropped. */
function sum(s: string): string {
  const parts = splitTop(s, /[+-](?![^{]*\})/y).filter(p => p.part !== '' || p.sep);
  // a leading "-x" splits as ["", "-" x]; keep its sign on the first real term
  const terms: string[] = [];
  for (const p of parts) {
    if (!p.part) continue;
    terms.push(`${p.sep === '-' ? '-' : '+'}${product(p.part)}`);
  }
  if (terms.length < 2) return (terms[0] ?? '').replace(/^\+/, '');
  return terms.sort((a, b) => abstract(a).localeCompare(abstract(b))).join(' ').replace(/^\+/, '');
}

/** An expression: relations kept in place (a = b is not b = a), each side a sum. */
function expr(s: string): string {
  return splitTop(s, /=|<|>|≤|≥|\\neq/y).map(p => `${p.sep}${sum(p.part)}`).join(' ');
}

/** Rename letters (outside commands and \text) in order of first appearance. */
/**
 * A shape's name, ⟦ABCD⟧, read as a cycle: its letters as the question's renaming names them, then the
 * smallest reading round the cycle either way. So it says only which letters are neighbours: parallelogram
 * ABCD with AB, BC given is the same as with BC, CD given (a turn of the shape), and not the same as with
 * AB, AC given (a side and a diagonal).
 */
const isShape = (m: string) => m.startsWith('⟦');
function shapeKey(token: string, nameLetter: (l: string) => string): string {
  const named = [...token.slice(1, -1)].map(nameLetter);
  const cands: string[] = [];
  for (const seq of [named, [...named].reverse()]) for (let i = 0; i < seq.length; i++) cands.push([...seq.slice(i), ...seq.slice(0, i)].join(','));
  return `⟦${cands.sort()[0]}⟧`;
}

function renameLetters(s: string, order: string[]): string {
  const words: string[] = [];
  return s
    .replace(/\\(?:text|mathrm|mbox)\{[^}]*\}/g, m => `@@${words.push(m) - 1}@@`)
    .replace(/\\[a-zA-Z]+|[a-zA-Z]/g, m => {
      if (m.startsWith('\\')) return m;
      let i = order.indexOf(m);
      if (i === -1) { order.push(m); i = order.length - 1; }
      return `V${i}`;
    })
    .replace(/@@(\d+)@@/g, (_, i) => words[Number(i)]);
}

function numbersIn(s: string): string[] {
  return (s
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<(?![a-zA-Z/!])/g, ' lt ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&bull;|&pound;/g, ' ')
    .replace(/(\d),(\d{3})(?!\d)/g, '$1$2').replace(/(\d)\s*[·⋅]\s*(\d)/g, '$1.$2').replace(/[−–]/g, '-')
    .match(/-?\d+(?:\.\d+)?/g) ?? []).map(n => String(Number(n)));
}

/** A unit's power standing alone after its word ("cm$^{3}$") is part of the unit, not maths. */
const unitPowers = (s: string) => s.replace(/\$\^\{?[23]\}?\$/g, ' ');

/**
 * The maths of a piece of text, LINE BY LINE: within a line the maths keeps its order ("Angle MQP is 69°
 * and angle PRS is 60°" is not the same as the two values swapped, a real change by the owner's
 * ruling); the lines themselves (bullet facts, the equations of a system) can be reordered. The numbers
 * in the words are a set over the whole text, so a story told in another order is the same story.
 */
function parts(lines: string[]): { maths: string[]; words: string[] } {
  const facts: string[] = [], seq: string[] = [];
  for (const l of lines) {
    const inLine: string[] = [];
    let list: string[] = [], lastEnd = -1;
    const flush = () => { if (list.length) inLine.push(list.length > 1 ? `{${list.sort().join(' ; ')}}` : list[0]); list = []; };
    const text = unitPowers(l);
    for (const m of text.matchAll(/\$([^$]*)\$/g)) {
      const raw = prep(m[1]);
      // a shape's name ("parallelogram $ABCD$", "triangle $PQR$") is kept, as a fact: it is what says which
      // letters are neighbours, so AB = u, AD = v (two sides) is not AB = u, AC = v (a side and a diagonal).
      // Found 2026-10-08 widening 2016 P2 Q3: without it the two were one question once letters were renamed.
      // Four letters or more: in a triangle every corner is next to every other, so its name says nothing
      // (and one draw prints "triangle $FGH$" where another does not).
      if (/^[A-Z]{4,10}$/.test(raw.replace(/\s+/g, ''))) { facts.push(`⟦${raw.replace(/\s+/g, '')}⟧`); continue; }
      // a bare label ("centre $C$", "the line $AB$") names a point, not maths: a story's lettering
      if (/^[A-Z]{1,4}$/.test(raw.replace(/\s+/g, ''))) continue;
      const e = expr(raw);
      if (!e) continue;
      // a stated fact ("PR = 6", "2x + 3y = 8") stands on its own wherever it is written
      if (/=|<|>|≤|≥|\\neq/.test(raw)) { facts.push(e); continue; }
      // items of a list ("$\sin 360°$, $\sin 340°$, $\sin 60°$"): only a comma or "and" between them
      const gap = lastEnd >= 0 ? text.slice(lastEnd, m.index) : null;
      if (gap === null || !/^\s*(,|and|,\s*and)\s*$/.test(gap)) flush();
      list.push(e);
      lastEnd = (m.index ?? 0) + m[0].length;
    }
    flush();
    if (inLine.length) seq.push(inLine.join(' ~ '));
  }
  // An instruction to round ("correct to one decimal place") is not data: the answer already shows it.
  const words = numbersIn(lines.map(l => unitPowers(l).replace(/\$[^$]*\$/g, ' ')
    .replace(/\b(\d+|one|two|three|four|five)\s+(decimal places?|significant figures?)/gi, ' ')).join(' '));
  return { maths: [...facts, ...seq], words };
}

/** An answer's parts ("$x = 2$ and $x = 1$", "(a) … (b) …") can come in either order: each maths
 *  segment is a part. */
function answerParts(answer: string): { maths: string[]; words: string[] } {
  const a = unitPowers(answer.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' '));
  return {
    maths: [...a.matchAll(/\$([^$]*)\$/g)].map(m => expr(prep(m[1]))).filter(Boolean),
    words: numbersIn(a.replace(/\$[^$]*\$/g, ' ')),
  };
}

/** The identity of a question, for "is it the same question": see the header. */
export function sameQuestionKey(lines: string[], answer: string): string {
  const q = parts(lines.filter(l => !l.startsWith('<svg')));
  // The figure's numbers, less any the text already gives (a diagram that labels A(5, 9) beside the words
  // "A(5, 9)" adds nothing); what is left is data shown only on the figure.
  const inText = [...q.words, ...q.maths.flatMap(m => numbersIn(m.replace(/[⟨⟩;]/g, ' ')))];
  const fig = [...lines.filter(l => l.startsWith('<svg')).join('').matchAll(/<text[^>]*>([^<]*)<\/text>/g)]
    .flatMap(m => numbersIn(m[1])).filter(n => { const i = inText.indexOf(n); if (i < 0) return true; inText.splice(i, 1); return false; }).sort();
  const a = answerParts(answer);
  const tail = (qs: string[], as: string[]) =>
    `${qs.join('|')}#${[...q.words].sort().join(',')}#${fig.join(',')}#${as.join('|')}#${[...a.words].sort().join(',')}`;
  /**
   * Few letters (a triangle's three): try every way of naming them and keep the smallest result, so
   * "PR = 6, QR = 8" and "SU = 8, TU = 6" (the same triangle) come out alike. Five letters is 120 tries.
   */
  const letters = [...new Set([...q.maths, ...a.maths].join(' ')
    .replace(/\\(?:text|mathrm|mbox)\{[^}]*\}/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').match(/[a-zA-Z]/g) ?? [])];
  if (letters.length <= 5) {
    let best: string | null = null;
    for (const perm of permutations(letters.length)) {
      // placeholders that are not letters, so the second pass cannot rename a renamed letter
      const one = (m: string) => `§${perm[letters.indexOf(m)]}§`;
      const name = (s: string) => unorderedRuns(s, one)
        .replace(/\\(?:text|mathrm|mbox)\{[^}]*\}|\\[a-zA-Z]+|[a-zA-Z]/g, m => (m.startsWith('\\') ? m : one(m)))
        .replace(/§(\d+)§/g, 'V$1');
      const k = tail(q.maths.map(m => isShape(m) ? shapeKey(m, l => `V${perm[letters.indexOf(l)]}`) : name(m)).sort(), a.maths.map(name).sort());
      if (best === null || k < best) best = k;
    }
    return best ?? tail([], []);
  }
  // otherwise: the given facts and the answer's parts are each a set: sort them letter-blind, THEN
  // rename letters in order of first appearance
  // (a shape's name last, so its letters take the names the facts give them)
  const qm = q.maths.filter(m => !isShape(m)).sort((x, y) => abstract(x).localeCompare(abstract(y)));
  const am = [...a.maths].sort((x, y) => abstract(x).localeCompare(abstract(y)));
  const order: string[] = [];
  const named = qm.map(m => renameLetters(m, order)), namedA = am.map(m => renameLetters(m, order));
  const shapes = q.maths.filter(isShape).map(m => shapeKey(m, l => renameLetters(l, order))).sort();
  return tail([...named, ...shapes], namedA);
}

/**
 * THE SECOND TEST: the working. "If a pupil would write the same working, from the same numbers, to the same
 * answer, it is the same question" (2026-10-07). It catches what the wording cannot: a story telling its
 * two numbers the other way round (3⅓ km then 2½ km, against 2½ t then 3⅓ t: the working is 3⅓ + 2½ either
 * way), a story number the working never uses ("class 4A"), a point given in words against on the diagram.
 * It keeps apart what the owner rules different: the tangent question with its two angles swapped (90 − 65
 * against 90 − 54), and "one real change" (7 sin x + 2 = 3 against 7 sin x − 3 = −2: other numbers).
 *
 * The key: every maths line of the worked solution, canonicalised as the question's are (sums and products
 * sorted, letters renamed), as a set; the question's numbers that the working actually uses; the answer.
 * Returns null when the working is too thin to judge by (under two maths lines with numbers), so the first
 * test alone decides.
 */
export function sameWorkingKey(lines: string[], answer: string, steps: string[]): string | null {
  const work: string[] = [];
  for (const s of steps) {
    const text = unitPowers(s.replace(/<strong>[\s\S]*?<\/strong>/g, ' '));
    for (const m of text.matchAll(/\$([^$]*)\$/g)) {
      const raw = prep(m[1]);
      if (/^[A-Z]{1,4}$/.test(raw.replace(/\s+/g, ''))) continue;   // a bare label, as in the question
      if (!/\d/.test(raw)) continue;                                  // words in maths dress: "$MK$", "$x$"
      const e = expr(raw);
      if (e) work.push(e);
    }
  }
  if (work.length < 2) return null;
  const workNums = work.flatMap(w => numbersIn(w.replace(/[⟨⟩;]/g, ' ')));
  // The question's data. EVERY number in its maths counts (the working may skip a step: "14 sin x = 10"
  // is written for both 14 sin x − 3 = 7 and 14 sin x + 2 = 12, which are different questions). A number
  // in the story words or only on the diagram counts when the working uses it ("class 4A" drops out; a
  // point read off the diagram counts the same as the point given in words).
  const text = lines.filter(l => !l.startsWith('<svg'));
  const mathsNums = text.flatMap(l => [...unitPowers(l).matchAll(/\$([^$]*)\$/g)]
    .map(m => prep(m[1])).filter(r => !/^[A-Z]{1,4}$/.test(r.replace(/\s+/g, '')))
    .flatMap(r => numbersIn(r.replace(/[⟨⟩;]/g, ' '))));
  // Numbers in the story's words are left out: where the working needs one it shows it, and where it does
  // not ("class 4A", "chair 12") it is a name. A number only on the diagram counts when the working uses it,
  // unless the words already give it (a diagram labelling the (3, 72) the words state adds nothing).
  const given = [...mathsNums];
  const figNums = [...lines.filter(l => l.startsWith('<svg')).join('').matchAll(/<text[^>]*>([^<]*)<\/text>/g)]
    .flatMap(m => numbersIn(m[1]))
    .filter(n => { const i = given.indexOf(n); if (i < 0) return true; given.splice(i, 1); return false; });
  const pool = [...workNums];
  const usedFig = figNums.filter(n => { const i = pool.indexOf(n); if (i < 0) return false; pool.splice(i, 1); return true; });
  const used = [...mathsNums, ...usedFig].sort();
  /**
   * FIXED 2026-10-08, found picking the owner's blind test. The working alone joined different questions:
   * - 11 cos x − 8 = 1 with 11 cos x − 1 = 8 (the owner's "constants moved" is a real change): the
   *   question's maths numbers were a bag, so moving a constant kept the bag. Now the question's maths
   *   itself, canonicalised as the first test does it, must match too.
   * - two data cards with DIFFERENT lists (rainfall 10, 21, 22, … against 23, 22, 16, 0, …) and different
   *   part (b) values, because a list and a sentence's values are words, which were left out. Now the
   *   words' numbers count, except a name glued to letters ("class 4A") and years, which count only as
   *   the gaps between them (the owner's ruling (d): growth from 2021 to 2025 is growth from 2018 to 2022).
   */
  const proseText = text.map(l => unitPowers(l).replace(/\$[^$]*\$/g, ' ')
    .replace(/\b(\d+|one|two|three|four|five)\s+(decimal places?|significant figures?)/gi, ' ')
    // a name with a number in it: "class 4A", "Q3", "the under-16 competition"
    .replace(/\b\d+[A-Za-z]+\b|\b[A-Za-z]+\d+\b|\b[A-Za-z]+-\d+\b|\b\d+-[A-Za-z]+\b/g, ' ')).join(' ');
  const yearRe = /\b(19\d\d|20\d\d)\b/g;
  const years = [...proseText.matchAll(yearRe)].map(m => +m[1]);
  // a number in the words that the maths already gives adds nothing ("chair 12" beside h = 12 − 8 cos x)
  const inMaths = [...mathsNums];
  const proseNums = numbersIn(proseText.replace(yearRe, ' '))
    .filter(n => { const i = inMaths.indexOf(n); if (i < 0) return true; inMaths.splice(i, 1); return false; });
  const yearGaps = years.length ? years.map(y => `y${y - Math.min(...years)}`) : [];
  const a = answerParts(answer);
  const order: string[] = [];
  const ws = [...work].sort((x, y) => abstract(x).localeCompare(abstract(y))).map(w => renameLetters(w, order));
  // The question's maths with letters in it (an equation, a formula, an expression), each segment canonical
  // and the segments as a set. A bare number, fraction or point is data, which the numbers above already
  // hold in any order and wherever it is printed (words, maths or diagram). A question with ONE vector has
  // its components as a set (the owner's ruling (b)); with two or more, the order inside each matters.
  const segs = text.flatMap(l => [...unitPowers(l).matchAll(/\$([^$]*)\$/g)].map(m => prep(m[1])))
    .filter(r => /^[A-Z]{4,10}$/.test(r.replace(/\s+/g, ''))   // a shape's name stays (see parts())
      || (!/^[A-Z]{1,4}$/.test(r.replace(/\s+/g, '')) && /[a-zA-Z]/.test(r.replace(/\\[a-zA-Z]+/g, ' ').replace(/⟨[^⟩]*⟩/g, ' '))));
  const vectors = segs.join(' ').match(/⟨[^⟩]*⟩/g) ?? [];
  const qMaths = segs.map(r => /^[A-Z]{4,10}$/.test(r.replace(/\s+/g, '')) ? `⟦${r.replace(/\s+/g, '')}⟧` : expr(vectors.length === 1
    ? r.replace(/⟨([^⟩]*)⟩/, (_, inner: string) => `⟨${inner.split(';').map(s => s.trim()).sort().join(';')}⟩`) : r))
    .filter(Boolean);
  const qs = [...qMaths.filter(m => !isShape(m))].sort((x, y) => abstract(x).localeCompare(abstract(y))).map(m => renameLetters(m, order));
  const as = [...a.maths].sort((x, y) => abstract(x).localeCompare(abstract(y))).map(m => renameLetters(m, order));
  qs.push(...qMaths.filter(isShape).map(m => shapeKey(m, l => renameLetters(l, order))).sort());
  // a "Yes" answer and a "No" answer are two questions (a part (b) verdict is words, not maths)
  const verdicts = [...answer.replace(/<[^>]+>/g, ' ').replace(/\$[^$]*\$/g, ' ').matchAll(/\b(yes|no)\b/gi)].map(m => m[1].toLowerCase());
  return `W:${[...ws].sort().join('|')}#${[...qs].sort().join('|')}#${[...proseNums, ...yearGaps].sort().join(',')}#${used.join(',')}#${as.join('|')}#${[...a.words].sort().join(',')}#${verdicts.join(',')}`;
}

/** Two draws are the same question when EITHER test says so. */
export function sameQuestion(
  x: { lines: string[]; answer: string; steps: string[] },
  y: { lines: string[]; answer: string; steps: string[] },
): boolean {
  if (sameQuestionKey(x.lines, x.answer) === sameQuestionKey(y.lines, y.answer)) return true;
  const wx = sameWorkingKey(x.lines, x.answer, x.steps), wy = sameWorkingKey(y.lines, y.answer, y.steps);
  return wx !== null && wx === wy;
}

/**
 * A side or a shape named by its capitals (PQ, triangle PQR) is the same whichever way round its letters
 * are written, so such a run is renamed and its letters sorted. Not under a vector arrow: AB is not BA.
 */
function unorderedRuns(s: string, one: (m: string) => string): string {
  return s.replace(/(\\overrightarrow\{|\\vec\{)?(?<![A-Za-z\\])([A-Z]{2,4})(?![A-Za-z])/g, (m, arrow, run) =>
    arrow ? m : [...run].map(one).sort().join(''));
}

function permutations(n: number): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (const p of permutations(n - 1)) for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n - 1, ...p.slice(i)]);
  return out;
}

// ═══ added 2026-10-08 for the guard (not in the prototype) ═══════════════════

/**
 * A cheap fingerprint of a draw's ANSWER, letters and order ignored: the answer's maths parts, each
 * canonical with every letter written L, as a set, then the numbers in its words. Two draws with the same
 * `sameQuestionKey` or the same `sameWorkingKey` always have the same fingerprint (both keys contain the
 * answer's parts and words, letters renamed), so a draw whose fingerprint matches no paper question's
 * cannot be a paper question, and the guard skips the costly keys for it.
 */
export function answerFingerprint(answer: string): string {
  const a = answerParts(answer);
  return `${a.maths.map(abstract).sort().join('|')}#${[...a.words].sort().join(',')}`;
}

/** A short, stable hash (cyrb53), so the guard's table is small to download. */
export function shortHash(s: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
