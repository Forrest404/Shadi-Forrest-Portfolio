// Tabs to a poster's film frame and screenshots it. Usage: node scripts/focus-shot.mjs <id> <out.png>
import puppeteer from 'puppeteer-core';
const [id, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:4321/Shadi-Forrest-Portfolio/media/', { waitUntil: 'load' });
await p.evaluate((id) => document.querySelector(`#${id} .frame`).focus({ focusVisible: true }), id);
await new Promise((r) => setTimeout(r, 900));
await p.screenshot({ path: out });
await b.close();
