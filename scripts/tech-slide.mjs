// Scrolls a Tech project to the middle and screenshots the preview pane. Usage: node scripts/tech-slide.mjs <id> <out.png>
import puppeteer from 'puppeteer-core';
const [id, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:4321/tech', { waitUntil: 'load' });
await p.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); window.scrollTo({ top: scrollY + r.top - 300, behavior: 'instant' }); }, id);
await new Promise((r) => setTimeout(r, 900));
await p.screenshot({ path: out });
await b.close();
