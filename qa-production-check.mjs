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

console.log('========================================');
console.log('  PRODUCTION QA CHECK - eatslowcarb.com');
console.log('========================================\n');

console.log('Loading landing page...');
await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);

// Get page HTML for language check
const htmlLang = await page.evaluate(() => document.documentElement.lang);
console.log(`\n📋 HTML lang attribute: "${htmlLang}"`);

// Extract all visible text
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

// Analyze text for language detection
console.log('\n========================================');
console.log('  1. LANGUAGE CHECK (should be English)');
console.log('========================================');

const commonEnglishWords = ['the', 'and', 'you', 'your', 'with', 'for', 'are', 'is', 'to', 'of', 'in', 'a', 'that', 'have', 'it', 'not', 'on', 'as', 'at', 'by', 'from', 'this', 'or', 'an', 'be', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'];
const commonDutchWords = ['de', 'het', 'een', 'en', 'van', 'ik', 'te', 'dat', 'die', 'in', 'is', 'voor', 'op', 'met', 'als', 'zijn', 'er', 'maar', 'om', 'die', 'naar', 'ze', 'over', 'zich', 'bij', 'door', 'onze', 'ons', 'uw', 'jouw', 'jullie'];

const allText = textContent.join(' ').toLowerCase();
const englishMatches = commonEnglishWords.filter(w => allText.includes(w)).length;
const dutchMatches = commonDutchWords.filter(w => allText.includes(w)).length;

console.log(`English indicator words found: ${englishMatches}`);
console.log(`Dutch indicator words found: ${dutchMatches}`);

if (dutchMatches > englishMatches) {
  console.log('⚠️ WARNING: Page appears to be in DUTCH (not English!)');
} else if (englishMatches > 0) {
  console.log('✅ Page appears to be in English');
} else {
  console.log('⚠️ Could not determine language confidently');
}

// Sample of text found
console.log('\n--- Sample text found on page ---');
textContent.slice(0, 15).forEach(t => console.log(`  "${t}"`));

// Check for dashes
console.log('\n========================================');
console.log('  2. DASH CHECK (em-dash —, en-dash –)');
console.log('========================================');

const emDash = '—';
const enDash = '–';
const textsWithEmDash = textContent.filter(t => t.includes(emDash));
const textsWithEnDash = textContent.filter(t => t.includes(enDash));

console.log(`Texts with em-dash (—): ${textsWithEmDash.length}`);
console.log(`Texts with en-dash (–): ${textsWithEnDash.length}`);

if (textsWithEmDash.length > 0) {
  console.log('\n--- Texts with em-dash (—) ---');
  textsWithEmDash.forEach(t => console.log(`  "${t}"`));
}

if (textsWithEnDash.length > 0) {
  console.log('\n--- Texts with en-dash (–) ---');
  textsWithEnDash.forEach(t => console.log(`  "${t}"`));
}

if (textsWithEmDash.length === 0 && textsWithEnDash.length === 0) {
  console.log('✅ No em-dash or en-dash characters found');
}

// Take section screenshots
console.log('\n========================================');
console.log('  3. SECTION SCREENSHOTS');
console.log('========================================');

// Full page screenshot first
console.log('\nTaking full page screenshot...');
await page.screenshot({ path: `${OUTPUT_DIR}/00-full-page.png`, fullPage: true });
console.log('✅ Full page screenshot saved');

// Scroll back to top
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// Define sections with multiple selector strategies
const sections = [
  { name: '01-hero', selectors: ['header', '.hero', '[class*="hero"]', 'section:first-of-type'] },
  { name: '02-rules', selectors: ['[class*="rule"]', 'section:has([class*="rule"])', '#rules'] },
  { name: '03-features', selectors: ['[class*="feature"]', 'section:has([class*="feature"])', '#features'] },
  { name: '04-testimonials', selectors: ['[class*="testimonial"]', 'section:has([class*="testimonial"])'] },
  { name: '05-pricing', selectors: ['[class*="pricing"]', 'section:has([class*="pricing"])', '#pricing'] },
  { name: '06-faq', selectors: ['[class*="faq"]', 'section:has([class*="faq"])', '#faq'] },
  { name: '07-footer', selectors: ['footer'] }
];

for (const section of sections) {
  let captured = false;
  for (const selector of section.selectors) {
    try {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        await elements[0].scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await page.screenshot({ path: `${OUTPUT_DIR}/${section.name}.png` });
        console.log(`✅ ${section.name}: Screenshot captured`);
        captured = true;
        break;
      }
    } catch (e) {
      // Try next selector
    }
  }
  if (!captured) {
    console.log(`⚠️ ${section.name}: Could not find element with selectors: ${section.selectors.join(', ')}`);
  }
}

// Layout check - look for common issues
console.log('\n========================================');
console.log('  4. LAYOUT CHECK');
console.log('========================================');

const layoutIssues = await page.evaluate(() => {
  const issues = [];
  
  // Check for elements with 0 width or height
  const allElements = document.querySelectorAll('*');
  let zeroSizeCount = 0;
  allElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0 && el.children.length === 0) {
      zeroSizeCount++;
    }
  });
  
  if (zeroSizeCount > 50) {
    issues.push(`${zeroSizeCount} elements with zero dimensions (may indicate hidden elements or layout issues)`);
  }
  
  // Check for horizontal overflow
  const bodyWidth = document.body.scrollWidth;
  const viewportWidth = window.innerWidth;
  if (bodyWidth > viewportWidth + 10) {
    issues.push(`Horizontal overflow detected: body width ${bodyWidth}px > viewport ${viewportWidth}px`);
  }
  
  // Check for broken images
  const images = document.querySelectorAll('img');
  const brokenImages = [];
  images.forEach((img, i) => {
    if (!img.complete || img.naturalWidth === 0) {
      brokenImages.push(img.src || `Image #${i}`);
    }
  });
  
  if (brokenImages.length > 0) {
    issues.push(`${brokenImages.length} potentially broken images found`);
  }
  
  // Check for elements with very large negative margins (often indicates broken layout)
  const negativeMarginElements = [];
  allElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const marginLeft = parseInt(style.marginLeft);
    const marginTop = parseInt(style.marginTop);
    if (marginLeft < -1000 || marginTop < -1000) {
      negativeMarginElements.push(el.tagName);
    }
  });
  
  if (negativeMarginElements.length > 0) {
    issues.push(`Elements with extreme negative margins found: ${negativeMarginElements.join(', ')}`);
  }
  
  return {
    issues,
    totalElements: allElements.length,
    imageCount: images.length,
    brokenImageCount: brokenImages.length,
    viewportWidth,
    bodyWidth
  };
});

console.log(`Total elements on page: ${layoutIssues.totalElements}`);
console.log(`Images on page: ${layoutIssues.imageCount}`);
console.log(`Viewport width: ${layoutIssues.viewportWidth}px`);
console.log(`Body width: ${layoutIssues.bodyWidth}px`);

if (layoutIssues.issues.length > 0) {
  console.log('\n⚠️ Potential layout issues:');
  layoutIssues.issues.forEach(issue => console.log(`  - ${issue}`));
} else {
  console.log('✅ No obvious layout issues detected');
}

// Summary
console.log('\n========================================');
console.log('  SUMMARY');
console.log('========================================');
console.log(`Screenshots saved to: ${OUTPUT_DIR}/`);
console.log(`Files created:`);
console.log(`  - 00-full-page.png`);
sections.forEach(s => console.log(`  - ${s.name}.png`));
console.log(`  - all-text.json`);

await browser.close();
console.log('\n✅ QA check complete!');
