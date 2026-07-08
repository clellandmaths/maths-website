import type { Metadata } from 'next';

// The explorer page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: 'Topic Explorer — Build Custom Maths Worksheets',
  description:
    'Filter National 5 and Higher Maths past paper questions by topic, year and paper, then build a custom worksheet with answers, QR-coded video solutions and PDF export. Free for students and teachers.',
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
