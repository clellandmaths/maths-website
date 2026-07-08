import type { Metadata } from 'next';

// The exam hall page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: 'Exam Hall — Countdown, Checklists & Daily Warm Ups',
  description:
    'Count down to your SQA maths exam, track your revision with topic checklists, and warm up with five daily past paper questions for National 5 and Higher Maths.',
};

export default function ExamHallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
