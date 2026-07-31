/**
 * The one place a video timestamp is turned into seconds.
 *
 * This was copied into seven files — CoursePageClient, the Explorer page,
 * WarmUp, FocusMode, QuestionPresenter, WatchSolutionButton — plus a bare
 * parseInt in practice-loader, and every copy had the same bug:
 *
 *     if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
 *
 * "3m35s" ends with 's', so replace('s','') strips the trailing s to give
 * "3m35", and parseInt stops at the 'm' — 3 seconds instead of 215. 105 of the
 * site's 988 past-paper timestamps are written that way, so every Advanced
 * Higher paper from 2022 on, and Higher 2015, sent pupils to the start of the
 * video instead of to their question.
 *
 * The data was never wrong. Both forms are legitimate; the parser only
 * understood one of them.
 *
 * Accepted:
 *   "48s"       48        "3m35s"   215      "5m"      300
 *   "1h2m3s"    3723      "3:35"    215      "1:02:03" 3723
 *   "215"       215       12        12
 */
export function timestampToSeconds(ts: string | number | null | undefined): number {
  if (ts === null || ts === undefined) return 0;
  if (typeof ts === 'number') return Number.isFinite(ts) && ts > 0 ? Math.floor(ts) : 0;

  const s = ts.trim().toLowerCase();
  if (!s) return 0;

  // 1:02:03 or 3:35
  if (s.includes(':')) {
    const parts = s.split(':').map(p => Number(p.trim()));
    if (parts.some(n => !Number.isFinite(n))) return 0;
    return parts.reduce((acc, n) => acc * 60 + n, 0);
  }

  // 1h2m3s, 3m35s, 5m, 48s — any subset, in order
  const hms = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (hms && (hms[1] || hms[2] || hms[3])) {
    return Number(hms[1] ?? 0) * 3600 + Number(hms[2] ?? 0) * 60 + Number(hms[3] ?? 0);
  }

  // bare seconds
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
