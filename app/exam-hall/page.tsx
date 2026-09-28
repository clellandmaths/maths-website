import CoursePicker from '@/components/CoursePicker';

/**
 * The Exam Hall's lobby: choose a course. The Exam Hall itself is at
 * `/course/<id>/exam-hall`. A `?c=` link and a returning visitor are
 * forwarded there before this is drawn.
 */
export default function ExamHallLobby() {
  return (
    <CoursePicker
      section="exam-hall"
      title="Welcome to the Exam Hall"
      intro="Your distraction-free zone. Sync your exam countdown, track your topic checklist, and run timed warm-ups."
      features={['Live Exam Countdown', 'Topic Checklists', 'Quick Warm Up Sessions']}
      action="Enter Exam Hall"
    />
  );
}
