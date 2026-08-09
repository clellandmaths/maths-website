import type { Metadata } from 'next';

// The exam hall page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: 'Exam Hall — Countdown, Checklists & Daily Warm Ups',
  description:
    'Count down to your Qualifications Scotland (SQA) maths exam, track revision with checklists, and warm up with daily National 5 and Higher past paper questions.',
};

export default function ExamHallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
