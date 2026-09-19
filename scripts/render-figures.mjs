/**
 * Rasterise the dumped SVGs to PNG so they can be LOOKED AT.
 *
 * The figures use `currentColor` on a transparent ground, so an explicit
 * colour and a white flatten are both required or the result is black on
 * black. Run from website-v1, which is where `sharp` lives.
 *
 *   node render-figs.mjs <figures.json> <outdir> [widthPx]
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const [, , IN, OUT, W = '820'] = process.argv;
mkdirSync(OUT, { recursive: true });

const figs = JSON.parse(readFileSync(IN, 'utf8'));
const index = [];

for (const f of figs) {
  // `currentColor` resolves against an inherited colour; SVG has none unless
  // the root carries it. Set it on the root and flatten onto white.
  const svg = f.svg.replace(/<svg\b/, '<svg color="#111"');
  const name = `${f.label.replace(/[^\w]+/g, '_')}_d${f.draw}.png`;
  await sharp(Buffer.from(svg), { density: 200 })
    .resize({ width: Number(W), fit: 'inside', withoutEnlargement: false })
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(join(OUT, name));
  index.push({ name, label: f.label, id: f.id, prose: f.prose });
}

writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 1));
console.log(`  ${index.length} PNG(s) -> ${OUT}`);
