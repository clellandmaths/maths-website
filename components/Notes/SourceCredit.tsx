import type { CourseTheme } from '@/lib/course-theme';

/**
 * Credit for notes derived from someone else's work.
 *
 * The Higher notes are adapted from the Higher Mathematics notes published by
 * Higher Still Notes at hsn.uk.net. Their PDFs carry this requirement on the
 * front page, word for word:
 *
 *   "This document was produced specially for the HSN.uk.net website, and we
 *    require that any copies or derivative works attribute the work to Higher
 *    Still Notes."
 *
 * That licence is CC BY-NC-SA 2.5 Scotland, which asks for three things, and
 * this notice has to carry all three or it does not discharge the obligation:
 *
 *   BY  — name the original author and link the licence
 *   SA  — release the derivative under the same licence, stated explicitly
 *         (a credit alone is not enough; the ShareAlike line is the licence
 *         grant, not decoration)
 *   NC  — non-commercial. The notes are free to read. If the site's footing
 *         ever changes, HSN ask to be contacted for permission.
 *
 * It also has to say the work was changed — these notes are rewritten and
 * restructured rather than reproduced, and CC requires that be indicated.
 *
 * Placement follows the rule already set for the Maths.scot credit in
 * Footer.tsx: the notice goes where the material actually is, not in the
 * global footer. Only Higher draws on HSN, so only Higher shows it.
 */

const CREDITED_COURSES = new Set(['higher']);

export const HSN_LICENCE_URL = 'https://creativecommons.org/licenses/by-nc-sa/2.5/scotland/';
export const HSN_SOURCE_URL = 'https://www.hsn.uk.net/higher-maths/notes';

export default function SourceCredit({ courseId, theme }: { courseId: string; theme?: CourseTheme }) {
  if (!CREDITED_COURSES.has(courseId)) return null;

  return (
    <aside className="mt-10 pt-5 border-t border-border">
      <p className="text-xs text-muted-dim leading-relaxed">
        These notes are adapted from the{' '}
        <a
          href={HSN_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 hover:text-foreground transition-colors ${theme?.text ?? ''}`}
        >
          Higher Mathematics notes
        </a>{' '}
        by <strong className="font-medium">Higher Still Notes</strong> (hsn.uk.net), used under the{' '}
        <a
          href={HSN_LICENCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 hover:text-foreground transition-colors ${theme?.text ?? ''}`}
        >
          Creative Commons Attribution-NonCommercial-ShareAlike 2.5 Scotland
        </a>{' '}
        licence. The material has been rewritten, restructured and extended for this site, and this
        adapted version is offered under the same licence.
      </p>
    </aside>
  );
}
