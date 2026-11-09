// Screenshots one element on /media. Usage: node scripts/el-shot.mjs <selector> <out> [width]
import puppeteer from 'puppeteer-core';
const [sel, out, w = '1440'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: +w, height: 900, isMobile: +w < 760 });
await p.goto('http://localhost:4321/media', { waitUntil: 'load' });
const el = await p.$(sel);
await el.scrollIntoView();
await new Promise((r) => setTimeout(r, 900));
await el.screenshot({ path: out });
await b.close();
