import puppeteer from 'puppeteer-core';
const [file, out, w=1100, h=1100] = process.argv.slice(2);
const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'});
const p = await b.newPage();
await p.setViewport({width:+w,height:+h,deviceScaleFactor:1.1});
await p.goto('file://'+file,{waitUntil:'load'});
await p.screenshot({path:out});
await b.close();
