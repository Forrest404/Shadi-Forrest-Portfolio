// Turns captured project screenshots into the square AVIFs the Tech page uses.
import sharp from 'sharp';
const [dir] = process.argv.slice(2);
const home = process.env.HOME;
const out = (n) => `public/img/${n}.avif`;
const enc = (s) => s.resize(1200, 1200).avif({ quality: 55 });
// Forrest Phone render: crop the banner square around the device.
await enc(sharp(`${home}/Desktop/Forrest Phone/forrest phone banner.png`).extract({ left: 1122, top: 0, width: 2887, height: 2887 })).toFile(out('forrestos'));
for (const n of ['whisper', 'infonest', 'notes']) {
  try { await enc(sharp(`${dir}/${n}.png`)).toFile(out(n)); } catch (e) { console.log('skip', n, e.message); }
}
