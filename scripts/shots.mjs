// Screenshots the built site in system Chrome and reports layout problems.
// Usage: node scripts/shots.mjs <output-dir>   (needs `astro preview` on :4321)
import puppeteer from 'puppeteer-core';

const out = process.argv[2];
const base = 'http://localhost:4321';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'],
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];

async function open(path, width, height, mobile = false) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(`${path} ${width}: ${e.message}`));
  page.on('requestfailed', (r) => { if (!r.url().includes('youtube')) errors.push(`${path} ${width}: failed ${r.url()}`); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${path} ${width}: ${r.status()} ${r.url()}`); });
  await page.goto(base + path, { waitUntil: 'load' });
  await wait(1200);
  return page;
}

// Scrolls through in viewport steps, screenshotting each, so real sticky and video behaviour shows.
async function walk(page, name, step) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const h = page.viewport().height;
  let i = 0;
  for (let y = 0; y < total - 10; y += Math.round(h * step)) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);
    await wait(700);
    await page.screenshot({ path: `${out}/${name}-${String(i++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 72 });
  }
  const over = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return { scrollW: document.documentElement.scrollWidth, vw };
  });
  console.log(name, 'height', total, 'scrollW', over.scrollW, 'vw', over.vw, 'shots', i);
}

const targets = process.argv[3] ? process.argv[3].split(',') : ['landing', 'media', 'tech'];

if (targets.includes('landing')) {
  let p = await open('/', 1440, 900);
  await p.screenshot({ path: `${out}/landing.jpg`, type: 'jpeg', quality: 80 });
  await p.mouse.move(300, 450);
  await wait(1000);
  await p.screenshot({ path: `${out}/landing-media.jpg`, type: 'jpeg', quality: 80 });
  await p.mouse.move(1200, 450);
  await wait(1000);
  await p.screenshot({ path: `${out}/landing-tech.jpg`, type: 'jpeg', quality: 80 });
  await p.close();
  p = await open('/', 390, 844, true);
  await p.screenshot({ path: `${out}/landing-phone.jpg`, type: 'jpeg', quality: 80 });
  await p.close();
}
if (targets.includes('media')) {
  let p = await open('/media', 1440, 900);
  await walk(p, 'media', 0.85);
  await p.close();
  p = await open('/media', 390, 844, true);
  await walk(p, 'media-phone', 0.85);
  await p.close();
}
if (targets.includes('tech')) {
  let p = await open('/tech', 1440, 900);
  await walk(p, 'tech', 0.85);
  await p.close();
  p = await open('/tech', 390, 844, true);
  await walk(p, 'tech-phone', 0.85);
  await p.close();
}

console.log(errors.length ? errors.join('\n') : 'no page errors');
await browser.close();
