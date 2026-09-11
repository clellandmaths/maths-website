'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, RefreshCw, Check } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { WorksheetProvider, useWorksheet } from '@/lib/worksheet-context';
import { getCourseTheme } from '@/lib/course-theme';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { SheetOrder } from '@/lib/generator/sheet-plan';

/**
 * The worksheet builder.
 *
 * A teacher picks topics and how many of each, and gets that many freshly
 * generated questions to add to their sheet alongside past paper ones.
 *
 * **The engine is imported dynamically, inside `generate()`.** It is 33,000
 * lines; a static import here would put it in this page's bundle and, through
 * the shared chunks, on pages that never generate anything. The topic list
 * itself comes from the server component as a plain object, so the picker
 * renders immediately and nothing is downloaded until the button is pressed.
 */

interface Props {
  courseId: string;
  courseName: string;
  /** Group name to its offerable topics, in course order. Built server-side. */
  groups: Record<string, string[]>;
}

export default function GenerateClient(props: Props) {
  // Keyed by course so the basket is the same one the Explorer reads — it is
  // sessionStorage under `worksheet_<course>`, so questions added here are
  // waiting there when the teacher follows the link.
  return (
    <WorksheetProvider key={props.courseId} course={props.courseId}>
      <Builder {...props} />
    </WorksheetProvider>
  );
}

function Builder({ courseId, courseName, groups }: Props) {
  const theme = getCourseTheme(courseId);
  const { addItem, items } = useWorksheet();

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<SheetOrder>('shuffled');
  const [questions, setQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [short, setShort] = useState(0);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // The order `planTopics` uses for a grouped sheet, so the sheet reads down
  // the picker rather than in the order boxes were ticked.
  const courseOrder = useMemo(() => Object.values(groups).flat(), [groups]);

  const total = useMemo(
    () => Object.values(counts).reduce((n, c) => n + c, 0),
    [counts]
  );

  const marks = useMemo(
    () => (questions ?? []).reduce((n, q) => n + (q.marks?.reduce((a, b) => a + b, 0) ?? 0), 0),
    [questions]
  );

  const step = (topic: string, by: number) => {
    setCounts(prev => {
      const next = Math.max(0, Math.min(20, (prev[topic] ?? 0) + by));
      const out = { ...prev };
      if (next === 0) delete out[topic];
      else out[topic] = next;
      return out;
    });
  };

  const clear = () => {
    setCounts({});
    setQuestions(null);
    setShort(0);
    setAdded(false);
  };

  const generate = async () => {
    setBusy(true);
    setAdded(false);
    setQuestions(null);
    try {
      // Loading four modules at once is fine — that is the network, not the
      // generator. What must never overlap is the *drawing* below.
      const [gq, plan, vars, codes] = await Promise.all([
        import('@/lib/generated-question'),
        import('@/lib/generator/sheet-plan'),
        import('@/lib/generator/generators/n5-variations'),
        import('@/lib/generator/generators/variation-codes'),
      ]);

      const wanted = plan.planTopics(counts, order, courseOrder);
      const made: QuestionWithMetadata[] = [];
      let missed = 0;

      // Sequential, and not as a matter of taste. The generator's random stream
      // is module-level: two overlapping draws take each other's numbers.
      // Measured — resolving ten questions concurrently changed all ten, and
      // two concurrent runs did not even match each other. A sheet built that
      // way could not be shared, which is the whole point of building it.
      for (const topic of wanted) {
        const ids = vars.variationsInTier(topic, 'exam');
        const id = ids[Math.floor(Math.random() * ids.length)];
        const q = id
          ? await gq.questionFromCode(codes.VARIATION_CODES[id], gq.newSeed(), made.length)
          : null;
        if (q) made.push(q);
        else missed++;
      }

      setQuestions(made);
      setShort(missed);
    } finally {
      setBusy(false);
    }
  };

  const addAll = () => {
    for (const q of questions ?? []) addItem(q);
    setAdded(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: courseName, href: `/course/${courseId}` },
          { label: 'Worksheet generator' },
        ]}
      />

      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">{courseName} worksheet generator</h1>
        <p className="text-muted-foreground max-w-2xl">
          Pick your topics and how many questions you want of each. Every question is
          modelled on a past paper question and checked against its marking
          instructions — so they are new questions, not reprints.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* ── the picker ─────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="text-sm font-semibold">
                {total} question{total === 1 ? '' : 's'}
              </span>
              {total > 0 && (
                <button
                  onClick={clear}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-[26rem] overflow-y-auto">
              {Object.entries(groups).map(([group, topics]) => {
                const picked = topics.reduce((n, t) => n + (counts[t] ?? 0), 0);
                const open = openGroup === group;
                return (
                  <div key={group} className="border-b border-slate-800 last:border-0">
                    <button
                      onClick={() => setOpenGroup(open ? null : group)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-white/5"
                    >
                      <span className={picked ? theme.text : ''}>
                        {group.replace(/^N5 /, '')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {picked > 0 ? `${picked} picked` : `${topics.length}`}
                      </span>
                    </button>

                    {open && (
                      <ul className="pb-2">
                        {topics.map(topic => {
                          const n = counts[topic] ?? 0;
                          return (
                            <li
                              key={topic}
                              className="flex items-center gap-2 py-1 pl-4 pr-2 text-sm"
                            >
                              <span className={`flex-1 ${n ? '' : 'text-muted-foreground'}`}>
                                {topic}
                              </span>
                              <button
                                onClick={() => step(topic, -1)}
                                disabled={n === 0}
                                aria-label={`One fewer ${topic}`}
                                className="rounded border border-slate-700 p-1 disabled:opacity-30 hover:bg-white/10"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-4 text-center font-mono text-xs tabular-nums">
                                {n}
                              </span>
                              <button
                                onClick={() => step(topic, 1)}
                                aria-label={`One more ${topic}`}
                                className="rounded border border-slate-700 p-1 hover:bg-white/10"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Order</span>
            {(['shuffled', 'grouped'] as SheetOrder[]).map(o => (
              <button
                key={o}
                onClick={() => setOrder(o)}
                className={`rounded px-2.5 py-1 text-xs capitalize ${
                  order === o ? `${theme.bg} text-white` : 'border border-slate-700 hover:bg-white/10'
                }`}
              >
                {o}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={total === 0 || busy}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${theme.gradient} px-4 py-2.5 font-semibold text-white disabled:opacity-40`}
          >
            {busy && <RefreshCw className="h-4 w-4 animate-spin" />}
            {busy ? 'Generating…' : questions ? 'Generate again' : 'Generate'}
          </button>
        </div>

        {/* ── the sheet ──────────────────────────────────────────────── */}
        <div>
          {questions === null && !busy && (
            <p className="rounded-lg border border-dashed border-slate-800 px-4 py-16 text-center text-muted-foreground">
              Pick some topics and press Generate.
            </p>
          )}

          {questions !== null && (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {questions.length} question{questions.length === 1 ? '' : 's'} · {marks} mark
                  {marks === 1 ? '' : 's'}
                </span>
                <button
                  onClick={addAll}
                  disabled={!questions.length}
                  className={`flex items-center gap-1.5 rounded ${theme.bg} ${theme.bgHover} px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40`}
                >
                  {added ? <Check className="h-4 w-4" /> : null}
                  {added ? 'Added' : 'Add to my sheet'}
                </button>
                {added && (
                  <Link
                    href={`/explorer?c=${courseId}`}
                    className={`text-sm underline ${theme.text}`}
                  >
                    Go to your sheet ({items.length})
                  </Link>
                )}
              </div>

              {/* A generated question that could not be built. It should not
                  happen — codes.ts fails on a topic with no exam variation
                  behind it — so if it does, say so rather than quietly hand
                  back a shorter sheet than was asked for. */}
              {short > 0 && (
                <p className="mb-4 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  {short} question{short === 1 ? '' : 's'} could not be generated and
                  {short === 1 ? ' is' : ' are'} missing from this sheet.
                </p>
              )}

              <ol className="space-y-6">
                {questions.map((q, i) => (
                  <li
                    key={q.uid ?? i}
                    className="rounded-lg border border-slate-800 bg-slate-900/40 p-5"
                  >
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <span className={`font-semibold ${theme.text}`}>{i + 1}.</span>
                      <span className="text-xs text-muted-foreground">
                        {q.label}
                        {q.marks?.length ? ` · ${q.marks[0]} marks` : ''}
                      </span>
                    </div>
                    {/* The same renderer and the same class the worksheet page
                        uses, so what is previewed here is what prints there. */}
                    <MathRenderer html={q.question} className="question-content" />
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
