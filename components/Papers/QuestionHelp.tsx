'use client';

import dynamic from 'next/dynamic';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * The hint ladder and "another like this one", on a static past paper page.
 *
 * **Why this wrapper exists at all.** The 110 paper pages are server-rendered
 * and the file that renders them says so: *"a control here would make every one
 * of them a client surface"*. That was right, and it is why the ladder lived
 * only in the two full-screen modes — which have no URL, so every address a
 * pupil could bookmark, be sent, or land on from a search had the version with
 * no help. In exam season those 22 National 5 pages are the ones people land
 * on, so the decision was reversed deliberately rather than forgotten.
 *
 * **It is reversed as cheaply as the reasoning allows.** A server component
 * cannot use `next/dynamic` with `ssr: false`, so the boundary has to be a
 * client component, and this is it — the whole point of the file. Measured on
 * the papers template, which had all 10 KB of its budget headroom:
 *
 *     Hints imported directly              826 -> 834 KB   (+8)
 *     both imported directly               826 -> 840 KB   (+14, over budget)
 *     both behind this wrapper             see check:budget
 *
 * Most people who open a past paper never press either control. Making all of
 * them download the machinery to serve the few who do is exactly the trade
 * `next/dynamic` exists for, and the same one already made for the QR library
 * and for the drawn-question card.
 *
 * The other half of the original concern — that the archive would end up one
 * refactor from importing the engine — is held by `check-engine-isolation.mjs`,
 * which fails the build if any page references an engine chunk. It stays at
 * 0 of 542.
 */
const Hints = dynamic(() => import('@/components/Hints'), { ssr: false });
const MoreLikeThis = dynamic(() => import('@/components/MoreLikeThis'), { ssr: false });

interface Props {
  question: QuestionWithMetadata;
  theme: CourseTheme;
  courseId: string;
}

export default function QuestionHelp({ question, theme, courseId }: Props) {
  return (
    <>
      <Hints question={question} theme={theme} courseId={courseId} />
      {/* `w-full` so it takes its own line: the row around it is a wrapping
          flex row of buttons, and the drawn question is not a button. */}
      <MoreLikeThis
        courseId={courseId}
        theme={theme}
        questionHtml={question.question}
        className="w-full mt-1"
      />
    </>
  );
}
