import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = 'https://slowcarb-new.vercel.app';

async function auditVisuals() {
  console.log('🚀 Starting visual audit...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  
  const page = await context.newPage();
  
  try {
    // Create screenshots directory with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotDir = `screenshots/audit-${timestamp}`;
    await fs.mkdir(screenshotDir, { recursive: true });
    console.log(`📸 Screenshots will be saved to: ${screenshotDir}`);
    
    // Clear localStorage to ensure onboarding shows
    await page.goto(baseUrl);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Check if onboarding is visible
    const onboardingVisible = await page.isVisible('text="Welkom bij SlowCarb"').catch(() => false);
    
    if (onboardingVisible) {
      console.log('✅ Onboarding wizard detected');
      
      // Step 1: Welcome - Enter name 'Test'
      console.log('📝 Step 1: Entering name...');
      await page.screenshot({ path: `${screenshotDir}/01-welcome.png`, fullPage: true });
      await page.fill('input[placeholder*="noemen"]', 'Test');
      await page.waitForTimeout(300);
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(800);
      
      // Step 2: Goal - Set weight goal to 10kg (already default)
      console.log('📊 Step 2: Setting weight goal to 10kg...');
      await page.screenshot({ path: `${screenshotDir}/02-goal.png`, fullPage: true });
      // Verify it's set to 10kg
      const weightValue = await page.locator('p.text-center.text-lg').textContent();
      console.log(`   Weight goal: ${weightValue}`);
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(800);
      
      // Step 3: Preferences - Check some preferences
      console.log('⚙️ Step 3: Setting preferences...');
      await page.screenshot({ path: `${screenshotDir}/03-preferences.png`, fullPage: true });
      // Check airfryer and sports
      await page.click('#airfryer');
      await page.waitForTimeout(200);
      await page.click('#sports');
      await page.waitForTimeout(200);
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(800);
      
      // Step 4: Cheat Day - Pick Saturday
      console.log('📅 Step 4: Choosing Saturday as cheat day...');
      await page.screenshot({ path: `${screenshotDir}/04-cheatday.png`, fullPage: true });
      await page.click('#saturday');
      await page.waitForTimeout(200);
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(800);
      
      // Step 5: Start
      console.log('🎯 Step 5: Ready to start...');
      await page.screenshot({ path: `${screenshotDir}/05-start.png`, fullPage: true });
      await page.click('button:has-text("Start je Journey")');
      await page.waitForTimeout(2000);
    }
    
    // Tab 1: Dashboard
    console.log('🏠 Capturing Dashboard...');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/tab-dashboard.png`, fullPage: true });
    
    // Tab 2: Recepten
    console.log('📖 Capturing Recepten...');
    await page.click('text="Recepten"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/tab-recepten.png`, fullPage: true });
    
    // Scroll to see more recipes
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${screenshotDir}/tab-recepten-scrolled.png`, fullPage: true });
    
    // Tab 3: Leren
    console.log('📚 Capturing Leren...');
    await page.click('text="Leren"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/tab-leren.png`, fullPage: true });
    
    // Scroll to see more content
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${screenshotDir}/tab-leren-scrolled.png`, fullPage: true });
    
    // Tab 4: Boodschappen
    console.log('🛒 Capturing Boodschappen...');
    await page.click('text="Boodschappen"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/tab-boodschappen.png`, fullPage: true });
    
    // Tab 5: Instellingen
    console.log('⚙️ Capturing Instellingen...');
    await page.click('text="Instellingen"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/tab-instellingen.png`, fullPage: true });
    
    // Scroll settings to see all options
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${screenshotDir}/tab-instellingen-scrolled.png`, fullPage: true });
    
    // Check for QuickActionFAB on dashboard
    console.log('🔘 Checking QuickActionFAB...');
    await page.click('text="Dashboard"');
    await page.waitForTimeout(500);
    const fabVisible = await page.isVisible('button[aria-label="Snelle actie"]').catch(() => false);
    if (fabVisible) {
      console.log('✅ QuickActionFAB found, clicking...');
      await page.click('button[aria-label="Snelle actie"]');
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${screenshotDir}/fab-menu.png`, fullPage: true });
    }
    
    console.log('✅ Visual audit completed!');
    console.log(`📸 All screenshots saved in: ${screenshotDir}`);
    
    // List all screenshots
    const files = await fs.readdir(screenshotDir);
    console.log('\n📁 Screenshots captured:');
    files.forEach(f => console.log(`   - ${f}`));
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    await page.screenshot({ path: `${screenshotDir}/error.png`, fullPage: true });
  } finally {
    await browser.close();
  }
}

auditVisuals().catch(console.error);
