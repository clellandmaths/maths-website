// Reports course-notes completeness per topic, against the pre-publish
// checklist in src/notes/TODO-master-house-style.md.
// For each topic: video? examples count, diagram?, examiner-traps box?
// Pass a course filename (without path) to see per-topic detail:
//   node scripts/notes-coverage.mjs                 → summary table
//   node scripts/notes-coverage.mjs advancedHigher  → per-topic detail
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'notes', 'data');
const filter = process.argv[2]?.toLowerCase();

// Split a data file into topic blocks. Each topic starts with `id:` and runs
// to the next `id:` at a shallower-or-equal position; we approximate by
// slicing on the `title:` field which is unique per topic. Good enough for a
// coverage heuristic — this is a reporting tool, not a parser.
function parseTopics(source) {
  // A topic object always has videoUrl; use it as the anchor, then look
  // backwards for the nearest title and forwards to the next videoUrl.
  const topics = [];
  const videoAnchors = [...source.matchAll(/videoUrl:\s*(["'])(.*?)\1/g)];
  for (let i = 0; i < videoAnchors.length; i++) {
    const start = videoAnchors[i].index;
    const end = i + 1 < videoAnchors.length ? videoAnchors[i + 1].index : source.length;
    const block = source.slice(start, end);
    const before = source.slice(Math.max(0, start - 400), start);
    const titleMatch = [...before.matchAll(/title:\s*(["'])(.*?)\1/g)].pop();
    const title = titleMatch ? titleMatch[2] : '(untitled)';
    const hasVideo = videoAnchors[i][2].trim().length > 0 && !videoAnchors[i][2].includes('placeholder');
    const exampleCount = (block.match(/\bid:\s*["'][^"']*ex[^"']*["']/gi) || []).length
      || (block.match(/question:/g) || []).length;
    const hasDiagram = /<svg/i.test(block) || /<[A-Z][A-Za-z0-9]*(Diagram|Graph|Triangle|Example|Network|Chart|Curve|Cross|Line|Point|Grid)\b/.test(block);
    const hasTraps = /Examiner Traps/i.test(block);
    topics.push({ title, hasVideo, exampleCount, hasDiagram, hasTraps });
  }
  return topics;
}

const files = readdirSync(dataDir).filter(f => f.endsWith('.tsx'));
const summary = [];

for (const file of files) {
  const course = file.replace('Data.tsx', '');
  const topics = parseTopics(readFileSync(path.join(dataDir, file), 'utf8'));
  const n = topics.length;
  const withVideo = topics.filter(t => t.hasVideo).length;
  const withExamples = topics.filter(t => t.exampleCount >= 2).length;
  const withDiagram = topics.filter(t => t.hasDiagram).length;
  const withTraps = topics.filter(t => t.hasTraps).length;
  summary.push({ course, n, withVideo, withExamples, withDiagram, withTraps });

  if (filter && course.toLowerCase().includes(filter)) {
    console.log(`\n=== ${course} (${n} topics) ===`);
    for (const t of topics) {
      const flags = [
        t.hasVideo ? 'vid' : '   ',
        `ex:${String(t.exampleCount).padStart(2)}`,
        t.hasDiagram ? 'dia' : '   ',
        t.hasTraps ? 'traps' : '     ',
      ].join('  ');
      console.log(`  ${flags}  ${t.title}`);
    }
  }
}

if (!filter) {
  console.log('\nCourse notes coverage (topics meeting each bar):\n');
  console.log('course'.padEnd(22), 'topics', ' video', ' ex>=2', ' diagram', ' traps');
  for (const s of summary) {
    console.log(
      s.course.padEnd(22),
      String(s.n).padStart(6),
      String(s.withVideo).padStart(6),
      String(s.withExamples).padStart(6),
      String(s.withDiagram).padStart(8),
      String(s.withTraps).padStart(6),
    );
  }
  console.log('\nRun with a course name (e.g. `node scripts/notes-coverage.mjs advancedHigher`) for per-topic detail.');
}
