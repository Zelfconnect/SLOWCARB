import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://eatslowcarb.com';
const OUTPUT_DIR = './qa-screenshots';

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

// Take full page screenshot
console.log('Taking full page screenshot...');
await page.screenshot({ path: `${OUTPUT_DIR}/01-full-page.png`, fullPage: true });

// Take section screenshots by scrolling
const sections = [
  { name: '02-hero', selector: 'header, .hero, [class*="hero"]' },
  { name: '03-rules', selector: '[class*="rule"], section:has([class*="rule"])' },
  { name: '04-features', selector: '[class*="feature"], section:has([class*="feature"])' },
  { name: '05-testimonials', selector: '[class*="testimonial"], section:has([class*="testimonial"])' },
  { name: '06-pricing', selector: '[class*="pricing"], section:has([class*="pricing"])' },
  { name: '07-faq', selector: '[class*="faq"], section:has([class*="faq"])' },
  { name: '08-footer', selector: 'footer' }
];

for (const section of sections) {
  try {
    const elements = await page.locator(section.selector).all();
    if (elements.length > 0) {
      await elements[0].scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUTPUT_DIR}/${section.name}.png` });
      console.log(`Screenshot: ${section.name}`);
    }
  } catch (e) {
    console.log(`Could not screenshot ${section.name}: ${e.message}`);
  }
}

// Also try to capture by viewport scrolling
console.log('\nCapturing viewport sections...');
await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Hero (top)
await page.screenshot({ path: `${OUTPUT_DIR}/vp-01-hero.png` });
console.log('Viewport: Hero');

// Scroll and capture sections
const scrollPositions = [
  { name: 'vp-02-rules', y: 800 },
  { name: 'vp-03-features', y: 1600 },
  { name: 'vp-04-testimonials', y: 2400 },
  { name: 'vp-05-pricing', y: 3200 },
  { name: 'vp-06-faq', y: 4000 },
  { name: 'vp-07-footer', y: 4800 }
];

for (const pos of scrollPositions) {
  try {
    await page.evaluate((y) => window.scrollTo(0, y), pos.y);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUTPUT_DIR}/${pos.name}.png` });
    console.log(`Viewport: ${pos.name}`);
  } catch (e) {
    console.log(`Could not capture ${pos.name}`);
  }
}

// Extract all text content for analysis
console.log('\nExtracting text content...');
const textContent = await page.evaluate(() => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const texts = [];
  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent.trim();
    if (text.length > 0 && text.length < 500) {
      const parent = node.parentElement;
      const isVisible = parent && 
        parent.offsetParent !== null && 
        window.getComputedStyle(parent).display !== 'none' &&
        window.getComputedStyle(parent).visibility !== 'hidden';
      
      if (isVisible) {
        texts.push(text);
      }
    }
  }
  return texts;
});

// Save text content
fs.writeFileSync(`${OUTPUT_DIR}/all-text.json`, JSON.stringify(textContent, null, 2));

// Check for dashes
const emDash = '—';
const enDash = '–';
const textsWithDashes = textContent.filter(t => t.includes(emDash) || t.includes(enDash));

console.log(`\n=== DASH CHECK ===`);
console.log(`Total text snippets: ${textContent.length}`);
console.log(`Texts with em-dash (—): ${textContent.filter(t => t.includes(emDash)).length}`);
console.log(`Texts with en-dash (–): ${textContent.filter(t => t.includes(enDash)).length}`);

if (textsWithDashes.length > 0) {
  console.log('\n--- Texts containing dashes ---');
  textsWithDashes.forEach(t => console.log(`  "${t}"`));
}

await browser.close();
console.log('\nQA screenshots saved to:', OUTPUT_DIR);
