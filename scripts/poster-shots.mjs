// Screenshots each Media poster by id. Usage: node scripts/poster-shots.mjs <dir> [width] [ids...]  (needs `astro preview` on :4321)
import puppeteer from 'puppeteer-core';
const [out, w = '1440', ...ids] = process.argv.slice(2);
const list = ids.length ? ids : ['grey', 'kodak', 'california', 'westminster', 'china'];
const mobile = +w < 760;
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
const p = await b.newPage();
await p.setViewport({ width: +w, height: mobile ? 844 : 900, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('response', (r) => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
await p.goto('http://localhost:4321/Shadi-Forrest-Portfolio/media/', { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 1000));
for (const id of list) {
  const el = await p.$('#' + id);
  await el.scrollIntoView();
  await new Promise((r) => setTimeout(r, 1200));
  const box = await el.boundingBox();
  console.log(id, Math.round(box.width), 'x', Math.round(box.height));
  await el.screenshot({ path: `${out}/${id}-${w}.jpg`, type: 'jpeg', quality: 78 });
}
const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
console.log('scrollW/clientW', sw.join('/'), errs.length ? errs.join('\n') : 'no errors');
await b.close();
