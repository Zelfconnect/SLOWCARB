import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureRecipeListQA() {
  const outputDir = '/Users/jesperhorst/projects/slowcarb-new/qa-screenshots';
  await mkdir(outputDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }
    });
    
    // Inject localStorage to skip onboarding
    await context.addInitScript(() => {
      localStorage.setItem('slowcarb-user', JSON.stringify({
        name: 'Test',
        onboardingComplete: true,
        startDate: new Date().toISOString().split('T')[0]
      }));
    });
    
    const page = await context.newPage();
    
    // Ga naar de app met ?app=1 parameter
    console.log('📸 Navigating to app...');
    await page.goto('http://localhost:5173/?app=1', { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000);
    
    // Zoek en klik op Recepten tab
    console.log('📸 Looking for Recepten tab...');
    const recipesTab = await page.locator('button, a, [role="tab"]').filter({ hasText: /Recepten/i }).first();
    
    if (await recipesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✓ Found Recepten tab, clicking...');
      await recipesTab.click();
      await delay(2000);
    } else {
      console.log('⚠️ Recepten tab not found, checking page content...');
      // List all buttons/text on page
      const buttons = await page.locator('button, a, [role="tab"]').all();
      console.log(`Found ${buttons.length} interactive elements:`);
      for (const btn of buttons.slice(0, 10)) {
        const text = await btn.textContent().catch(() => '');
        console.log(`  - "${text.trim()}"`);
      }
    }
    
    // Screenshot 1: Full recipe list overview
    console.log('📸 Taking screenshot: Recipe list overview...');
    await page.screenshot({ path: `${outputDir}/recipe-list-overview.png`, fullPage: false });
    
    // Scroll down to see more cards
    await page.evaluate(() => window.scrollBy(0, 400));
    await delay(1000);
    console.log('📸 Taking screenshot: Scrolled view...');
    await page.screenshot({ path: `${outputDir}/recipe-list-scrolled.png`, fullPage: false });
    
    // Scroll more
    await page.evaluate(() => window.scrollBy(0, 400));
    await delay(1000);
    console.log('📸 Taking screenshot: Further scrolled...');
    await page.screenshot({ path: `${outputDir}/recipe-list-scrolled2.png`, fullPage: false });
    
    // Get first recipe card closeup
    console.log('📸 Taking screenshot: Close-up of first recipe card...');
    const card = await page.locator('[class*="recipe"], article, .card').first();
    if (await card.isVisible().catch(() => false)) {
      await card.scrollIntoViewIfNeeded();
      await delay(500);
      await card.screenshot({ path: `${outputDir}/recipe-card-closeup.png` });
    }
    
    console.log(`\n✅ Screenshots saved to: ${outputDir}`);
    
    // Analyze and report
    console.log('\n--- QA ANALYSIS ---');
    
    // Check images
    const images = await page.locator('img').all();
    console.log(`\n🖼️  Found ${images.length} images on the page`);
    
    for (let i = 0; i < Math.min(images.length, 8); i++) {
      const img = images[i];
      const src = await img.getAttribute('src').catch(() => 'no src');
      const alt = await img.getAttribute('alt').catch(() => 'no alt');
      const visible = await img.isVisible().catch(() => false);
      const bounding = await img.boundingBox().catch(() => null);
      console.log(`   Image ${i+1}: src=${src.substring(0, 40)}..., alt="${alt}", visible=${visible}, size=${bounding ? `${Math.round(bounding.width)}x${Math.round(bounding.height)}` : 'N/A'}`);
    }
    
    // Check for time badges (numbers followed by "min")
    const timeBadges = await page.locator('text=/\\d+\\s*min/i').all();
    console.log(`\n⏱️  Found ${timeBadges.length} time badges`);
    
    // Check for heart/favorite icons
    const heartSvgs = await page.locator('svg').filter({ has: page.locator('path') }).all();
    let heartCount = 0;
    for (const svg of heartSvgs) {
      const html = await svg.evaluate(el => el.outerHTML);
      if (html.includes('heart') || html.match(/M.*C.*C.*Z/i)) {
        heartCount++;
      }
    }
    console.log(`\n❤️  Found ${heartCount} heart icons`);
    
    // Check card containers
    const cards = await page.locator('[class*="recipe"], article, .card').all();
    console.log(`\n📋 Found ${cards.length} potential recipe cards`);
    
    // Check for gradients
    const gradientElements = await page.locator('[class*="gradient"], [style*="gradient"]').all();
    console.log(`\n🎨 Found ${gradientElements.length} gradient elements`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureRecipeListQA().catch(console.error);
