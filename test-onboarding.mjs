import { chromium } from 'playwright';
import fs from 'fs/promises';

const baseUrl = 'http://localhost:5173';

async function testOnboarding() {
  console.log('🚀 Starting onboarding test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    // Create screenshots directory
    await fs.mkdir('screenshots', { recursive: true });
    
    // 1. Load the app
    console.log('📱 Opening app...');
    await page.goto(baseUrl);
    await page.waitForTimeout(2000);
    
    // Check if onboarding is visible
    const onboardingVisible = await page.isVisible('text="Welkom bij SlowCarb"');
    
    if (onboardingVisible) {
      console.log('✅ Onboarding wizard detected');
      
      // Step 1: Welcome
      await page.screenshot({ path: 'screenshots/01-welcome.png', fullPage: true });
      await page.fill('input[placeholder*="noemen"]', 'Test Gebruiker');
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(500);
      
      // Step 2: Goal
      console.log('📊 Setting weight goal...');
      await page.screenshot({ path: 'screenshots/02-goal.png', fullPage: true });
      // Slider is at 10kg by default
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(500);
      
      // Step 3: Preferences
      console.log('⚙️ Setting preferences...');
      await page.screenshot({ path: 'screenshots/03-preferences.png', fullPage: true });
      await page.evaluate(() => document.querySelector('#airfryer').scrollIntoView());
      await page.click('#airfryer', { force: true });
      await page.evaluate(() => document.querySelector('#sports').scrollIntoView());
      await page.click('#sports', { force: true });
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(500);
      
      // Step 4: Cheat Day
      console.log('📅 Choosing cheat day...');
      await page.screenshot({ path: 'screenshots/04-cheatday.png', fullPage: true });
      await page.click('#sunday');
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(500);
      
      // Step 5: Start
      console.log('🎯 Ready to start...');
      await page.screenshot({ path: 'screenshots/05-start.png', fullPage: true });
      await page.click('button:has-text("Start je Journey")');
      await page.waitForTimeout(2000);
    }
    
    // Dashboard should now be visible
    console.log('🏠 Checking dashboard...');
    await page.screenshot({ path: 'screenshots/06-dashboard.png', fullPage: true });
    
    // Test Settings tab
    console.log('⚙️ Testing Settings tab...');
    await page.click('text="Instellingen"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/07-settings.png', fullPage: true });
    
    // Test other tabs
    console.log('📱 Testing other tabs...');
    await page.click('text="Recepten"');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/08-recipes.png', fullPage: true });
    
    await page.click('text="Dashboard"');
    await page.waitForTimeout(500);
    
    // Check QuickActionFAB
    const fabVisible = await page.isVisible('button[aria-label="Snelle actie"]');
    if (fabVisible) {
      console.log('✅ QuickActionFAB found');
      await page.click('button[aria-label="Snelle actie"]');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/09-fab-menu.png', fullPage: true });
    }
    
    console.log('✅ All tests completed successfully!');
    console.log('📸 Screenshots saved in screenshots/');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testOnboarding().catch(console.error);
