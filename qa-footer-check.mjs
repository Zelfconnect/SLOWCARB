import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://eatslowcarb.com';
const OUTPUT_DIR = './qa-screenshots';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 600 }
});
const page = await context.newPage();

console.log('Loading landing page...');
await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);

// Scroll to very bottom for footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUTPUT_DIR}/footer-bottom.png` });
console.log('Captured: footer bottom');

// Get the full page height and scroll to footer
const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
console.log(`Page height: ${bodyHeight}`);

await browser.close();
console.log('Done');
