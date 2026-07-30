import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { COURSES_WITH_PRACTICE, getPracticeTopics, getPracticeTopic, resolveQuestions } from '@/lib/practice-loader';
import { renderMathHtml } from '@/components/MathHtml';
import { getCourseTheme } from '@/lib/course-theme';
import PracticeQuestion from '@/components/Practice/PracticeQuestion';
import PracticeModes from '@/components/Practice/PracticeModes';
import CourseTabs from '@/components/CourseTabs';
import Breadcrumbs from '@/components/Breadcrumbs';

// A page per topic rather than one page for the whole course: each targets a
// real search ("national 5 surds practice questions") with its own title and
// unique content. One combined page would compete for everything and rank for
// nothing.
//
// This is a server component, so the question data is resolved at build time
// into static HTML — crawlable, and it never reaches the browser as JavaScript.

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'National 5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

interface Params { courseId: string; topicId: string }

export async function generateStaticParams(): Promise<Params[]> {
  const out: Params[] = [];
  for (const courseId of COURSES_WITH_PRACTICE) {
    for (const t of await getPracticeTopics(courseId)) {
      out.push({ courseId, topicId: t.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { courseId, topicId } = await params;
  const found = await getPracticeTopic(courseId, topicId);
  if (!found) return {};

  const courseName = COURSE_NAMES[courseId] ?? courseId;
  const n = found.topic.questions.length;
  // A past paper question is either a reference to one we hold, or written in
  // because the archive lacks that year
  const papers = found.topic.questions.filter(q => q.ref || q.paper).length;
  // Referenced past paper questions bring the paper's own video, so resolve
  // before deciding whether to advertise video solutions
  const resolved = await resolveQuestions(courseId, found.topic.questions);
  const hasVideo = resolved.some(q => q.videoId);

  return {
    title: `${found.topic.name} — ${courseName} Practice Questions`,
    description:
      `${n} ${found.topic.name.toLowerCase()} practice questions for ${courseName}` +
      (papers ? `, including ${papers} past paper questions` : '') +
      `, with answers${hasVideo ? ' and video solutions' : ''}.`,
    alternates: { canonical: `/course/${courseId}/practice/${topicId}/` },
  };
}

export default async function PracticeTopicPage({ params }: { params: Promise<Params> }) {
  const { courseId, topicId } = await params;
  const found = await getPracticeTopic(courseId, topicId);
  if (!found) notFound();

  const theme = getCourseTheme(courseId);
  const courseName = COURSE_NAMES[courseId] ?? courseId;
  const { topic, sectionTitle } = found;

  // Resolve past paper references against the paper data, then render the
  // maths server-side so it is in the markup rather than built in the browser
  const resolved = await resolveQuestions(courseId, topic.questions);
  const questions = resolved.map(q => ({
    ...q,
    questionHtml: renderMathHtml(q.question),
    answerHtml: renderMathHtml(q.answer),
  }));

  const attributed = questions.some(q => q.solutionUrl);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: courseName, href: `/course/${courseId}` },
          { label: 'Practice', href: `/course/${courseId}/practice` },
          { label: topic.name },
        ]}
      />
      <CourseTabs courseId={courseId} active="practice" />

      <div className="mb-8">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
          {sectionTitle} · Guided Practice
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {topic.name}
        </h1>
        <p className="text-muted-foreground mb-5">
          {questions.length} question{questions.length === 1 ? '' : 's'} with answers
          {/* Only promise video where there is video: several Higher topics
              have no guided practice filmed yet */}
          {questions.some(q => q.videoId) && ' and video solutions'}. Try each one before
          revealing the answer.
        </p>
        {/* Raw (unrendered) question html — Focus Mode renders maths itself.
            Higher Apps sits the exam with the data booklet rather than a
            formulae list, so practice offers the booklet for that course. */}
        <PracticeModes
          courseId={courseId}
          hasDataBooklet={courseId === 'higher-apps'}
          questions={questions.map((q, i) => ({
            question: q.question,
            answer: q.answer,
            videoId: q.videoId ?? '',
            timestamp: q.timestamp ? `${q.timestamp}s` : '0s',
            topics: [topic.name],
            marks: q.marks,
            solutionUrl: q.solutionUrl,
            // Past paper questions keep their paper reference; the rest are
            // numbered within the topic. Guided practice has no paper number,
            // so the caption is set explicitly rather than assembled.
            label: q.paper ?? `${topic.name} · Question ${i + 1}`,
            year: q.paper ?? topic.name,
            paperNumber: 0,
            questionIndex: i,
          }))}
          theme={theme}
        />
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <PracticeQuestion
            key={i}
            index={i + 1}
            questionHtml={q.questionHtml}
            answerHtml={q.answerHtml}
            videoId={q.videoId}
            timestamp={q.timestamp}
            paper={q.paper}
            solutionUrl={q.solutionUrl}
            marks={q.marks}
            theme={theme}
          />
        ))}
      </div>

      {attributed && (
        <p className="mt-10 pt-6 border-t border-border text-sm text-muted-foreground">
          Practice questions courtesy of{' '}
          <a
            href="https://www.maths.scot"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            maths.scot
          </a>
          . Full written solutions are on his site — the links above go straight to them.
        </p>
      )}

      <div className="mt-8">
        <Link
          href={`/course/${courseId}/practice`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All practice topics
        </Link>
      </div>
    </div>
  );
}
