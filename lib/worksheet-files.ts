import { zip } from 'fflate';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * The data files a Higher Applications worksheet needs, as one download.
 *
 * Higher Apps questions come with spreadsheets and CSVs — a question saying
 * "refer to Q5 Coffee.csv" cannot be attempted without it. Individually they
 * are a link per card, which is fine for one question and hopeless for a
 * twenty-question sheet a teacher wants to put on a shared drive before a
 * lesson. This collects them into a single zip.
 *
 * Zipped in the browser rather than served as a prebuilt archive because the
 * set depends on which questions were chosen, and there is no server to build
 * it on — the site is a static export.
 */

export interface WorksheetFile {
  name: string;
  url: string;
}

/**
 * Every distinct file the given questions need.
 *
 * Deduplicated by URL: two parts of the same question routinely reference the
 * same spreadsheet, and a zip containing it twice would not open cleanly.
 * Names are made unique separately, since two different years both have a
 * "Q5 Coffee.csv".
 */
export function filesFor(questions: QuestionWithMetadata[]): WorksheetFile[] {
  const byUrl = new Map<string, WorksheetFile>();
  for (const q of questions) {
    for (const a of q.attachments ?? []) {
      if (!byUrl.has(a.url)) byUrl.set(a.url, { name: a.name, url: a.url });
    }
  }
  return [...byUrl.values()];
}

/**
 * Folder each file goes in inside the zip.
 *
 * Taken from the URL — /resources/higher-apps/data/2023/Q5 Coffee.csv gives
 * "2023". Two years can both contain a "Q5 Coffee.csv", and a flat zip would
 * silently keep only one of them.
 */
function folderFor(url: string): string {
  const m = url.match(/\/data\/([^/]+)\//);
  return m ? m[1] : '';
}

export interface ZipResult {
  blob: Blob;
  included: number;
  failed: string[];
}

/**
 * Fetch every file and zip them.
 *
 * A file that will not download is reported rather than silently dropped: a
 * teacher who hands out a zip missing the one spreadsheet the homework needs
 * finds out in front of a class.
 */
export async function zipFiles(files: WorksheetFile[]): Promise<ZipResult> {
  const entries: Record<string, Uint8Array> = {};
  const failed: string[] = [];

  await Promise.all(
    files.map(async file => {
      try {
        const res = await fetch(file.url);
        if (!res.ok) throw new Error(String(res.status));
        const buf = new Uint8Array(await res.arrayBuffer());
        const folder = folderFor(file.url);
        let path = folder ? `${folder}/${file.name}` : file.name;
        // Same name in the same year — keep both rather than overwrite.
        let n = 2;
        while (entries[path]) {
          const dot = file.name.lastIndexOf('.');
          const stem = dot === -1 ? file.name : file.name.slice(0, dot);
          const ext = dot === -1 ? '' : file.name.slice(dot);
          path = `${folder ? folder + '/' : ''}${stem} (${n})${ext}`;
          n++;
        }
        entries[path] = buf;
      } catch {
        failed.push(file.name);
      }
    })
  );

  const zipped = await new Promise<Uint8Array>((resolve, reject) => {
    zip(entries, { level: 6 }, (err, data) => (err ? reject(err) : resolve(data)));
  });

  return {
    blob: new Blob([zipped as unknown as BlobPart], { type: 'application/zip' }),
    included: Object.keys(entries).length,
    failed,
  };
}

/** Save a blob under a given filename. */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** "Mr Cloud's Homework" -> "Mr Clouds Homework data files.zip" */
export function zipName(title?: string): string {
  const base = (title ?? '').replace(/[^\w\s-]/g, '').trim() || 'Higher Applications worksheet';
  return `${base} data files.zip`;
}
