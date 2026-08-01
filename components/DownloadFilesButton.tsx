'use client';

import { useState } from 'react';
import { FileArchive, Loader2 } from 'lucide-react';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import { filesFor, zipFiles, saveBlob, zipName } from '@/lib/worksheet-files';

/**
 * "Download data files" — the Higher Applications spreadsheets a worksheet
 * needs, as one zip.
 *
 * Renders nothing when the chosen questions have no attachments, so it can sit
 * on any worksheet surface without a per-course check at the call site. In
 * practice that means it appears for Higher Apps and nowhere else.
 */
export default function DownloadFilesButton({
  questions,
  title,
  className,
}: {
  questions: QuestionWithMetadata[];
  title?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = filesFor(questions);
  if (!files.length) return null;

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const { blob, included, failed } = await zipFiles(files);
      if (!included) {
        setError('None of the data files could be downloaded.');
        return;
      }
      saveBlob(blob, zipName(title));
      // Say so rather than hand over a zip that is quietly short of files.
      if (failed.length) {
        setError(`${failed.length} file${failed.length === 1 ? '' : 's'} could not be included: ${failed.join(', ')}`);
      }
    } catch {
      setError('The download failed. The files are still on each question individually.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="no-print">
      <button
        onClick={run}
        disabled={busy}
        className={className ?? 'inline-flex items-center gap-2 px-4 py-2 bg-muted/40 hover:bg-muted/60 disabled:opacity-60 text-foreground text-sm font-medium rounded-lg transition-colors'}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileArchive className="h-4 w-4" />}
        {busy ? 'Preparing…' : `Data files (${files.length})`}
      </button>
      {error && <p className="mt-2 text-xs text-amber-400">{error}</p>}
    </div>
  );
}
