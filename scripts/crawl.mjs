// Loads each page under the site's base path and reports failed requests and overflow. Usage: node scripts/crawl.mjs <origin+base>
import puppeteer from 'puppeteer-core';
const base = process.argv[2];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
for (const path of ['/', '/media/', '/tech/']) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const bad = [];
  p.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('youtube')) bad.push(r.status() + ' ' + r.url()); });
  p.on('pageerror', (e) => bad.push('error ' + e.message));
  await p.goto(base + path, { waitUntil: 'networkidle2' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
  const links = await p.evaluate(() => [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')));
  console.log(path, 'bad:', bad.length ? bad.join(' | ') : 'none', '| root-relative links:', links.length ? [...new Set(links)].join(',') : 'none');
  await p.close();
}
await b.close();
