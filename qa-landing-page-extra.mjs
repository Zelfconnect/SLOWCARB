import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://eatslowcarb.com';
const OUTPUT_DIR = './qa-screenshots';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 }
});
const page = await context.newPage();

console.log('Loading landing page...');
await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);

// Scroll to capture more sections
const extraSections = [
  { name: 'extra-01-cta-section', y: 5200 },
  { name: 'extra-02-footer', y: 5800 }
];

for (const section of extraSections) {
  try {
    await page.evaluate((y) => window.scrollTo(0, y), section.y);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUTPUT_DIR}/${section.name}.png` });
    console.log(`Captured: ${section.name}`);
  } catch (e) {
    console.log(`Could not capture ${section.name}: ${e.message}`);
  }
}

// Check for any expanded FAQ content
console.log('\nChecking FAQ expand/collapse...');
const faqQuestions = await page.locator('text=What can I eat on a cheat day?').all();
if (faqQuestions.length > 0) {
  await faqQuestions[0].click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUTPUT_DIR}/extra-faq-expanded.png` });
  console.log('Captured: FAQ expanded');
}

await browser.close();
console.log('Done');
