// One-off asset generation: logo crop, print grain, contour lines, unidex photos.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
const home = process.env.HOME;

// The logo file holds the camera mark and a wordmark on a big white-on-transparent
// canvas. Keep only the camera mark, used as a CSS mask so it can take any colour.
await sharp(`${home}/Documents/Images/Studio Forrest Logo.png`)
  .extract({ left: 358, top: 806, width: 1134, height: 887 })
  .resize({ width: 480 })
  .webp({ quality: 90 })
  .toFile('public/img/sf-logo.webp');

// Print grain: small tile of alpha noise.
const N = 220, px = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const v = Math.random() < 0.5 ? 0 : 255;
  px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
  px[i * 4 + 3] = Math.floor(Math.random() * 70);
}
await sharp(px, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 40, alphaQuality: 40 }).toFile('public/img/grain.webp');

// Contour lines: nested wobbling rings around two summits, like a piste map.
const rings = [];
for (const [cx, cy, count, seed] of [[280, 300, 13, 1.3], [1010, 620, 15, 4.1]]) {
  for (let r = 1; r <= count; r++) {
    const pts = [];
    for (let a = 0; a < 72; a++) {
      const t = (a / 72) * Math.PI * 2;
      const rad = r * 34 * (1 + 0.2 * Math.sin(3 * t + seed) + 0.1 * Math.sin(7 * t + seed * 2 + r * 0.25) + 0.05 * Math.sin(13 * t + r * 0.4));
      pts.push(`${(cx + rad * Math.cos(t)).toFixed(0)} ${(cy + rad * 0.78 * Math.sin(t)).toFixed(0)}`);
    }
    rings.push(`<path d="M${pts.join('L')}Z"/>`);
  }
}
writeFileSync('public/img/contours.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round">${rings.join('')}</svg>`);

// unidex photos for the Tech page.
for (const name of ['real-pink', 'real-white', 'real-four']) {
  await sharp(`${home}/Documents/unidex-site/public/images/${name}.jpg`).resize({ width: 1200, withoutEnlargement: true }).avif({ quality: 55 }).toFile(`public/img/unidex-${name.slice(5)}.avif`);
}
