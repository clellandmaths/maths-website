import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNotesForCourse } from '@/lib/notes-loader';
import NotesReader, { NOTES_COURSE_NAMES } from './NotesReader';

/**
 * A course's notes open on its first topic, with the whole course in the
 * accordion beside it.
 *
 * This was an all-topics page, a grid of every topic under one "Start at the
 * beginning" button that opened the first of them. The owner, 2026-09-28:
 * "notes should just open on the whole notes page with accordion at side, the
 * page with start at beginning seems redundant". So the Notes tab and the
 * course hub's Notes card, which both come here, now land on the reading
 * itself, and the address stays as it was.
 *
 * **The first topic's own page is the canonical one.** This address now shows
 * the same content as `/course/<id>/notes/<section>/<topic>`, and two addresses
 * for one page split a search engine's ranking between them. Every topic is in
 * the sitemap and linked from the accordion, so nothing the grid made
 * crawlable stops being so. The source credit (`SourceCredit`) is in the
 * topic shell, so it is here too.
 */

const COURSE_IDS = ['n5', 'higher', 'ah', 'n5-apps', 'higher-apps'];

export function generateStaticParams() {
  return COURSE_IDS.map(courseId => ({ courseId }));
}

async function firstTopic(courseId: string) {
  const course = await getNotesForCourse(courseId);
  const section = course?.sections[0];
  const topic = section?.topics[0];
  return section && topic ? { sectionId: section.id, topicId: topic.id, title: topic.title } : null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ courseId: string }> }
): Promise<Metadata> {
  const { courseId } = await params;
  const name = NOTES_COURSE_NAMES[courseId];
  const first = await firstTopic(courseId);
  if (!name || !first) return {};
  return {
    title: `${name} Notes`,
    description: `Free ${name} course notes: every topic with theory, worked examples and video lessons, starting with ${first.title}.`,
    alternates: { canonical: `/course/${courseId}/notes/${first.sectionId}/${first.topicId}` },
  };
}

export default async function NotesPage(
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const first = await firstTopic(courseId);
  if (!first) notFound();
  return <NotesReader courseId={courseId} sectionId={first.sectionId} topicId={first.topicId} />;
}
