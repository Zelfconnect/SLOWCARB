import { chromium } from 'playwright';
import fs from 'fs/promises';

const baseUrl = 'http://localhost:5173';

async function qaOnboardingSteps() {
  console.log('🔍 Starting QA for onboarding steps 3 & 5...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    // Create screenshots directory
    await fs.mkdir('screenshots', { recursive: true });
    
    // Clear localStorage to force onboarding
    await page.goto(baseUrl);
    await page.evaluate(() => localStorage.clear());
    console.log('🧹 localStorage cleared');
    
    // Reload to trigger onboarding
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Step 1: Enter name and proceed
    console.log('📝 Step 1: Entering name...');
    await page.fill('input[placeholder*="noemen"]', 'Alex');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);
    
    // Step 2: Weight goal - just proceed
    console.log('🎯 Step 2: Weight goal...');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);
    
    // Step 3: PREFERENCES - Screenshot and check some boxes
    console.log('🍽️ Step 3: Preferences - taking screenshot...');
    await page.screenshot({ path: 'screenshots/qa-step3-preferences.png', fullPage: true });
    
    // Check the airfryer and sports boxes to show sage-green accent
    await page.click('#airfryer');
    await page.waitForTimeout(200);
    await page.click('#sports');
    await page.waitForTimeout(200);
    
    // Screenshot with checked boxes
    await page.screenshot({ path: 'screenshots/qa-step3-preferences-checked.png', fullPage: true });
    console.log('✅ Step 3 screenshots saved');
    
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);
    
    // Step 4: Cheat day
    console.log('📅 Step 4: Cheat day...');
    await page.click('#sunday');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);
    
    // Step 5: READY - Screenshot
    console.log('🚀 Step 5: Ready - taking screenshot...');
    await page.screenshot({ path: 'screenshots/qa-step5-ready.png', fullPage: true });
    console.log('✅ Step 5 screenshot saved');
    
    console.log('\n📸 QA Screenshots saved:');
    console.log('  - screenshots/qa-step3-preferences.png (unchecked)');
    console.log('  - screenshots/qa-step3-preferences-checked.png (checked, shows sage-green)');
    console.log('  - screenshots/qa-step5-ready.png (summary with icons)');
    
  } catch (error) {
    console.error('❌ QA failed:', error);
    await page.screenshot({ path: 'screenshots/qa-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

qaOnboardingSteps().catch(console.error);
