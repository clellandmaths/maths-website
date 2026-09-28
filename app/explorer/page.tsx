import CoursePicker from '@/components/CoursePicker';

/**
 * The Topic Explorer's front door: choose a course. The Explorer itself is at
 * `/course/<id>/explorer`. A `?c=` link (every shared worksheet carries one)
 * and a returning visitor are forwarded there before this is drawn.
 */
export default function ExplorerChooser() {
  return (
    <CoursePicker
      section="explorer"
      title="Worksheet Builder"
      intro="Browse Qualifications Scotland past paper questions by topic and year, then build a custom maths worksheet with answers, QR-coded video solutions and PDF export — free for students and teachers. Choose your course to start."
      features={['Topic-by-Topic Filtering', 'Instant Worksheet Builder', 'PDF Export']}
      action="Launch Explorer"
    />
  );
}
