import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', '.screenshots');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'hair-loss-solution-for-corporate-men-1280.png');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto('http://127.0.0.1:3000/lp/hair-loss-solution-for-corporate-men', { waitUntil: 'networkidle0', timeout: 60000 });
await page.screenshot({ path: outPath, fullPage: true });
console.log('SAVED:' + outPath);
await browser.close();
