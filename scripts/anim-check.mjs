// Lists running CSS animations and the page's overflow on /media. Usage: node scripts/anim-check.mjs [width]
import puppeteer from 'puppeteer-core';
const w = +(process.argv[2] ?? 1440);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: w, height: 900, isMobile: w < 760 });
await p.goto('http://localhost:4321/Shadi-Forrest-Portfolio/media/', { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 1200));
const r = await p.evaluate(() => ({
  anims: [...new Set(document.getAnimations().filter((a) => a.animationName).map((a) => a.animationName + ' on ' + (a.effect.target.className?.baseVal ?? a.effect.target.className)))],
  grain: !!document.querySelector('.grain'), tape: !!document.querySelector('.tape'), sticker: !!document.querySelector('.logo-sticker'), stamp: !!document.querySelector('.stamp'),
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
console.log(JSON.stringify(r));
await p.screenshot({ path: process.argv[3] ?? '/dev/null' });
await b.close();
