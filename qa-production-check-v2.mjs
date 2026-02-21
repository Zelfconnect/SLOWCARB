import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://eatslowcarb.com';
const OUTPUT_DIR = './qa-screenshots-production';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 }
});
const page = await context.newPage();

console.log('Loading landing page...');
await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);

// Get page height
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
console.log(`Page height: ${pageHeight}px`);

// Get all section elements
const sections = await page.evaluate(() => {
  const allSections = document.querySelectorAll('section');
  return Array.from(allSections).map((s, i) => ({
    index: i,
    className: s.className,
    id: s.id,
    offsetTop: s.offsetTop,
    height: s.offsetHeight
  }));
});

console.log(`\nFound ${sections.length} sections:`);
sections.forEach(s => {
  console.log(`  ${s.index}: ${s.className || '(no class)'} - offset: ${s.offsetTop}px, height: ${s.height}px`);
});

// Take viewport screenshots at different scroll positions
const viewportHeight = 800;
const numScreenshots = Math.ceil(pageHeight / viewportHeight);

console.log(`\nTaking ${numScreenshots} viewport screenshots...`);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

for (let i = 0; i < numScreenshots; i++) {
  const scrollY = i * viewportHeight;
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(1000); // Wait for any lazy loading
  
  await page.screenshot({ path: `${OUTPUT_DIR}/scroll-${String(i).padStart(2, '0')}.png` });
  console.log(`Screenshot ${i + 1}/${numScreenshots} at scroll position ${scrollY}px`);
}

// Extract text from each section
console.log('\n--- Extracting text from each section ---');
for (let i = 0; i < sections.length; i++) {
  const sectionText = await page.evaluate((idx) => {
    const section = document.querySelectorAll('section')[idx];
    if (!section) return '';
    return section.innerText.substring(0, 500);
  }, i);
  
  console.log(`\nSection ${i} text (first 500 chars):`);
  console.log(sectionText.substring(0, 300) + (sectionText.length > 300 ? '...' : ''));
}

await browser.close();
console.log('\nDone!');
