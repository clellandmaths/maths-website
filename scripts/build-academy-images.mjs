import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Turn the photos and screenshots supplied for the Academy page into the three
 * images it actually uses.
 *
 * Kept as a script rather than done by hand so the crops are recorded and
 * repeatable: if a screenshot is retaken, rerun this rather than trying to
 * remember where the last one was cut.
 *
 * The originals are phone photos and full-window screenshots — 12 MB between
 * them, most of it browser chrome and ceiling. They are moved out of public/
 * afterwards so the site does not ship them.
 */

const SRC = 'public/img/academy';
const ORIGINALS = '../reference/academy-originals';

// Originals live outside public/ so they are never deployed; the script reads
// from there and writes the built images back into public/img/academy.
const IN = ORIGINALS;

const JOBS = [
  {
    // Pointing at the "Whole of Differentiation" board.
    //
    // The crop is doing one specific job: the board also reads "HIGHER MATHS
    // 2023 EXAMS", and a 2023 date on a page selling 2026/27 tuition makes the
    // whole thing look stale. Cutting at x=2604 drops that block.
    //
    // It costs the fingertip. His raised arm and hand overlap the text block
    // horizontally, so no rectangular crop keeps the full gesture and loses the
    // year — the arm reading as pointing off-frame is the better trade.
    from: 'IMG_0244.JPG',
    to: 'hero.webp',
    crop: { left: 790, top: 0, width: 1814, height: 2268 },
    width: 1000,
    quality: 82,
  },
  {
    // The BBC blocks from the article screenshot, cropped tight. Sits on a
    // white chip on the page — the logo is white letters in black boxes, which
    // would vanish against a dark background.
    from: 'IMG_6066.jpg',
    to: 'bbc-logo.webp',
    crop: { left: 405, top: 38, width: 360, height: 118 },
    width: 300,
    quality: 90,
  },
  {
    // The BBC piece: his own portrait, the caption naming the channel, and the
    // livestream quote the page cites. Cut above "Obviously things were
    // different", which is where the relevant passage ends.
    from: 'IMG_6067.jpg',
    to: 'bbc.webp',
    crop: { left: 0, top: 20, width: 1170, height: 1830 },
    width: 900,
    quality: 85,
  },
  {
    // The logged-out channel view, so it shows Subscribe rather than
    // "Customise channel". Cropped to the banner and the channel line,
    // dropping the sidebar, the search bar and the scrollbar.
    from: 'youtube logged out.png',
    to: 'youtube.webp',
    crop: { left: 425, top: 66, width: 1345, height: 486 },
    width: 1400,
    quality: 85,
  },
];

let failed = false;

for (const job of JOBS) {
  const from = path.join(IN, job.from);
  if (!fs.existsSync(from)) {
    console.error(`MISSING  ${job.from}`);
    failed = true;
    continue;
  }
  const meta = await sharp(from).metadata();
  const { left, top, width, height } = job.crop;
  // A crop running past the edge throws deep inside sharp with a message that
  // does not say which image — check here where the numbers are to hand.
  if (left + width > meta.width || top + height > meta.height) {
    console.error(
      `CROP OUT OF BOUNDS  ${job.from} is ${meta.width}x${meta.height}, ` +
      `crop needs ${left + width}x${top + height}`
    );
    failed = true;
    continue;
  }

  const out = path.join(SRC, job.to);
  await sharp(from)
    .rotate()            // honour EXIF orientation before cropping
    .extract(job.crop)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality })
    .toFile(out);

  const o = await sharp(out).metadata();
  const before = (fs.statSync(from).size / 1024).toFixed(0);
  const after = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`${job.to.padEnd(14)} ${o.width}x${o.height}  ${before}KB -> ${after}KB`);
}

if (failed) process.exit(1);

// Keep the originals, but not where they would be deployed.
fs.mkdirSync(ORIGINALS, { recursive: true });
let moved = 0;
for (const f of fs.readdirSync(SRC)) {
  if (f.endsWith('.webp')) continue;
  fs.renameSync(path.join(SRC, f), path.join(ORIGINALS, f));
  moved++;
}
console.log(`\nmoved ${moved} originals to reference/academy-originals/ (gitignored, not deployed)`);
