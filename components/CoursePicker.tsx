import Link from 'next/link';
import { Check, GraduationCap } from 'lucide-react';
import { getCourseTheme } from '@/lib/course-theme';
import { COURSE_IDS, COURSE_NAMES, courseHref, type CourseSection } from '@/lib/course-nav';
import { n5PaperVideos, higherPaperVideos, ahPaperVideos, n5AppsPaperVideos, higherAppsPaperVideos, paperSummary } from '@/lib/past-paper-videos';

/**
 * "Choose your course" for a tool that belongs to every course: the Topic
 * Explorer at `/explorer` and the Exam Hall at `/exam-hall`. Each card is a
 * link to that tool inside the course, so it is in the HTML and crawlable.
 *
 * It is also where a `?c=` link, or a returning visitor's last course, is
 * forwarded from, by the script in `forwardScript`, which runs as the page is
 * parsed so the chooser is never drawn for someone who will not see it.
 */

// Counted from the paper registry, not typed. Every one of these was stale
// after the 2026 diet went in — N5 said 10 papers when it has 22, and AH
// advertised more questions than it actually has.
const SUBTITLES: Record<string, string> = {
  n5: paperSummary(n5PaperVideos),
  higher: paperSummary(higherPaperVideos),
  ah: paperSummary(ahPaperVideos),
  'n5-apps': paperSummary(n5AppsPaperVideos),
  'higher-apps': paperSummary(higherAppsPaperVideos, 'Data Booklets & Files'),
};

/**
 * Forwards `/<tool>?c=<id>…` to `/course/<id>/<tool>…`, keeping the rest of
 * the query (a shared worksheet's `q=`), and a visit with no course to the one
 * last used. Inline and synchronous, before the chooser is painted.
 */
export function forwardScript(section: CourseSection): string {
  return `(function(){try{
var ids=${JSON.stringify(COURSE_IDS)};
var q=new URLSearchParams(location.search);var c=q.get('c');
if(ids.indexOf(c)<0){try{c=localStorage.getItem('preferredCourse')}catch(e){c=null}}
if(ids.indexOf(c)>=0){location.replace('/course/'+c+'/${section}'+location.search+location.hash)}
}catch(e){}})();`;
}

export default function CoursePicker({
  section, title, intro, features, action,
}: {
  section: CourseSection;
  title: string;
  intro: string;
  features: string[];
  action: string;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <script dangerouslySetInnerHTML={{ __html: forwardScript(section) }} />
      <div className="text-center max-w-5xl w-full">
        <GraduationCap className="h-16 w-16 mx-auto text-accent mb-6" />
        <h1 className="font-display text-3xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-10 text-lg">{intro}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {COURSE_IDS.map(id => {
            const cardTheme = getCourseTheme(id);
            return (
              <div
                key={id}
                className="group relative flex flex-col p-8 bg-card border border-border rounded-2xl overflow-hidden hover:border-foreground/20 hover:scale-[1.02] transition-all"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cardTheme.gradient}`} />
                <h2 className={`text-2xl font-bold mb-1 ${cardTheme.text}`}>{COURSE_NAMES[id]}</h2>
                <p className="text-sm text-muted-dim mb-6">{SUBTITLES[id]}</p>
                <ul className="space-y-3 text-left mb-8">
                  {features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-foreground-2">
                      <Check className={`h-5 w-5 ${cardTheme.text} shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={courseHref(id, section)}
                  className={`mt-auto block w-full py-3 bg-gradient-to-r ${cardTheme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`}
                >
                  {action}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
