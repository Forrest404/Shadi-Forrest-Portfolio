// Screenshots the showreel play button at a few moments of its spin. Usage: node scripts/play-shot.mjs <outprefix> [width]
import puppeteer from 'puppeteer-core';
const [out, w = '1440'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: +w, height: 900, deviceScaleFactor: 2 });
await p.goto('http://localhost:4321/media', { waitUntil: 'load' });
for (let i = 0; i < 3; i++) {
  await new Promise((r) => setTimeout(r, 2500));
  const el = await p.$('.play');
  await el.screenshot({ path: `${out}-${i}.png` });
}
await b.close();
