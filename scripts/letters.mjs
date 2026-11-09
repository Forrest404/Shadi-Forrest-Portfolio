// Turns the hero words into outlines, so video can be clipped to real letterforms
// at any screen size. Writes src/data/letters.json.
import opentype from 'opentype.js';
import { readFileSync, writeFileSync } from 'node:fs';
const buf = readFileSync('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff');
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const W = 1000, GAP = 18;
let y = 0;
const lines = ['STUDIO', 'FORREST'].map((word) => {
  const probe = font.getPath(word, 0, 0, 100).getBoundingBox();
  const size = (100 * W) / (probe.x2 - probe.x1);
  const box = font.getPath(word, 0, 0, size).getBoundingBox();
  const p = font.getPath(word, -box.x1, y - box.y1, size);
  y += box.y2 - box.y1 + GAP;
  return p.toPathData(1);
});
const H = Math.round(y - GAP);
writeFileSync('src/data/letters.json', JSON.stringify({ w: W, h: H, d: lines.join(' ') }));
console.log('letters', W, H);
