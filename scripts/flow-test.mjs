// Checks the real user flow: seam, wipe, keyboard, reduced motion, what each page loads.
import puppeteer from 'puppeteer-core';
const out = process.argv[2], base = 'http://localhost:4321';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const page = async (w, h) => { const p = await b.newPage(); await p.setViewport({ width: w, height: h }); return p; };

// Keyboard: first Tab lands on Tech or Media, Enter navigates.
let p = await page(1440, 900);
await p.goto(base, { waitUntil: 'load' }); await wait(500);
await p.keyboard.press('Tab');
const first = await p.evaluate(() => document.activeElement.getAttribute('href'));
await p.keyboard.press('Tab');
const second = await p.evaluate(() => document.activeElement.getAttribute('href'));
await wait(900);
await p.screenshot({ path: `${out}/focus.jpg`, type: 'jpeg', quality: 70 });
console.log('tab order', first, second);
await p.keyboard.press('Enter');
await wait(280);
await p.screenshot({ path: `${out}/wipe-mid.jpg`, type: 'jpeg', quality: 70 });
await wait(900);
console.log('after enter', p.url());
await p.close();

// Each page: what it downloads before any video scrolls into view.
for (const path of ['/', '/media', '/tech']) {
  p = await page(1440, 900);
  const got = [];
  p.on('response', async (r) => { const u = r.url(); if (u.startsWith(base)) got.push(u.replace(base, '')); });
  await p.goto(base + path, { waitUntil: 'load' }); await wait(1200);
  const css = got.filter((u) => u.endsWith('.css'));
  const js = got.filter((u) => u.endsWith('.js'));
  const fonts = got.filter((u) => /woff2?$/.test(u)).map((u) => u.split('/').pop().split('-').slice(0, 2).join('-'));
  const video = got.filter((u) => u.includes('/video/'));
  console.log(path, { css, js: js.length, fonts: [...new Set(fonts)], video: [...new Set(video)] });
  const hscroll = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (hscroll) console.log('  HORIZONTAL SCROLL on', path);
  await p.close();
}

// Reduced motion: no loop plays, marquee stopped, poster up.
p = await page(1440, 900);
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.goto(base + '/media', { waitUntil: 'load' }); await wait(1000);
console.log('reduced motion', await p.evaluate(() => ({
  playing: [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
  marquee: getComputedStyle(document.querySelector('.tape-run')).animationName,
})));
await p.close();

// Tech: details open with the keyboard, pane follows scroll.
p = await page(1440, 900);
await p.goto(base + '/tech', { waitUntil: 'load' }); await wait(500);
await p.focus('summary'); await p.keyboard.press('Enter'); await wait(300);
console.log('details open', await p.evaluate(() => document.querySelector('details').open));
await p.evaluate(() => document.getElementById('notes').scrollIntoView({ block: 'center', behavior: 'instant' })); await wait(400);
console.log('pane shows', await p.evaluate(() => document.querySelector('.t-slide.on')?.dataset.slide));
await p.close();
await b.close();
