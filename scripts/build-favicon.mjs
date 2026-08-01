import sharp from 'sharp';
import fs from 'node:fs';

/**
 * Build the site icons from the brand mark.
 *
 * The wordmark logo is 836x536 and unusable as an icon — at 32px it is an
 * illegible smear. What survives at that size is the pi-and-graph motif, so
 * that band is lifted out of the app icon and padded onto the site's own
 * background colour, giving a square mark that reads in a browser tab and
 * beside a Google result.
 *
 * Rerun this if the logo ever changes:  node scripts/build-favicon.mjs
 */

const SRC = '../Current Deployment/dist/img/Logo/app-icon.png';
const BAND = { left: 515, top: 288, width: 400, height: 180 };  // pi + graph, above the wordmark
const PAD = 40;
const BG = { r: 10, g: 14, b: 23, alpha: 1 };                   // --background

if (!fs.existsSync(SRC)) {
  console.error(`missing source: ${SRC}`);
  process.exit(1);
}

const band = await sharp(SRC).extract(BAND).png().toBuffer();
const square = await sharp({
  create: {
    width: BAND.width + PAD * 2,
    height: BAND.width + PAD * 2,   // width both ways, so it is square
    channels: 4,
    background: BG,
  },
}).composite([{ input: band, gravity: 'center' }]).png().toBuffer();

/**
 * Pack PNGs into an .ico.
 *
 * Windows has accepted PNG-encoded frames since Vista, so this needs no
 * encoder — just the 6-byte directory header and a 16-byte entry per size.
 * A byte of 0 in the width/height field means 256.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);              // reserved
  header.writeUInt16LE(1, 2);              // type: icon
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);                    // palette
    e.writeUInt8(0, 3);                    // reserved
    e.writeUInt16LE(1, 4);                 // colour planes
    e.writeUInt16LE(32, 6);                // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map(i => i.data)]);
}

const icoSizes = [16, 32, 48];
const frames = [];
for (const size of icoSizes) {
  frames.push({ size, data: await sharp(square).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer() });
}
fs.writeFileSync('app/favicon.ico', ico(frames));
console.log(`app/favicon.ico        ${icoSizes.join(', ')}px  ${(fs.statSync('app/favicon.ico').size / 1024).toFixed(1)} KB`);

// Next serves these from app/ and writes the <link> tags itself.
await sharp(square).resize(512, 512).png().toFile('app/icon.png');
await sharp(square).resize(180, 180).png().toFile('app/apple-icon.png');
console.log('app/icon.png           512x512');
console.log('app/apple-icon.png     180x180');

// And the PWA manifest icons, which were pointing at the wide wordmark.
for (const size of [192, 512]) {
  await sharp(square).resize(size, size).png().toFile(`public/img/logo/icon-${size}.png`);
  console.log(`public/img/logo/icon-${size}.png`);
}
