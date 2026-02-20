import { chromium } from 'playwright';
import fs from 'fs/promises';

const baseUrl = 'http://localhost:5174';
const outputDir = 'screenshots/onboarding-qa';

async function qaOnboarding() {
  console.log('🚀 Starting Onboarding Visual QA...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    
    // Clear all storage to simulate new user
    await page.goto(baseUrl);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    console.log('✅ Storage cleared (new user simulation)');
    
    // Reload to trigger onboarding
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Check if onboarding is visible (step 1 shows "Hé, hoe heet je?")
    const onboardingVisible = await page.isVisible('text=/hoe heet je/i').catch(() => false);
    
    if (!onboardingVisible) {
      console.log('❌ Onboarding wizard not detected!');
      await page.screenshot({ path: `${outputDir}/error-no-onboarding.png`, fullPage: true });
      await browser.close();
      return;
    }
    
    console.log('✅ Onboarding wizard detected\n');
    
    // ========== STEP 1: WELCOME ==========
    console.log('📸 STEP 1: Welcome');
    await page.screenshot({ path: `${outputDir}/01-step-welcome.png`, fullPage: true });
    
    // Check for progress indicator
    const progressDots = await page.locator('[class*="progress"], [class*="dots"], [class*="step-indicator"]').count();
    console.log(`   Progress indicator elements found: ${progressDots}`);
    
    // Check styling
    const hasEmoji = await page.isVisible('text=/[\u{1F300}-\u{1F9FF}]/u').catch(() => false);
    console.log(`   Emoji present: ${hasEmoji ? '✅' : '❌'}`);
    
    // Fill and proceed
    await page.fill('input[placeholder*="noemen"]', 'Test Gebruiker');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(800);
    
    // ========== STEP 2: GOAL ==========
    console.log('\n📸 STEP 2: Weight Goal');
    await page.screenshot({ path: `${outputDir}/02-step-goal.png`, fullPage: true });
    
    // Check for slider
    const hasSlider = await page.isVisible('input[type="range"]').catch(() => false);
    console.log(`   Slider present: ${hasSlider ? '✅' : '❌'}`);
    
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(800);
    
    // ========== STEP 3: PREFERENCES ==========
    console.log('\n📸 STEP 3: Preferences');
    await page.screenshot({ path: `${outputDir}/03-step-preferences.png`, fullPage: true });
    
    // Check for checkboxes
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    console.log(`   Checkboxes found: ${checkboxes}`);
    
    // Select some options
    await page.evaluate(() => document.querySelector('#airfryer')?.scrollIntoView());
    await page.click('#airfryer', { force: true });
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(800);
    
    // ========== STEP 4: CHEAT DAY ==========
    console.log('\n📸 STEP 4: Cheat Day');
    await page.screenshot({ path: `${outputDir}/04-step-cheatday.png`, fullPage: true });
    
    // Check for day buttons
    const dayButtons = await page.locator('button[class*="day"], [id*="day"], [id*="sunday"]').count();
    console.log(`   Day selection elements: ${dayButtons}`);
    
    await page.click('#sunday');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(800);
    
    // ========== STEP 5: READY TO START ==========
    console.log('\n📸 STEP 5: Ready to Start');
    await page.screenshot({ path: `${outputDir}/05-step-start.png`, fullPage: true });
    
    // Check for motivational content (not just a dry list)
    const contentText = await page.locator('body').innerText();
    const hasMotivationalWords = /klaar|start|journey|avontuur|succes|opgewonden/i.test(contentText);
    const hasListItems = contentText.includes('•') || contentText.includes('-') || contentText.includes('✓');
    console.log(`   Motivational tone: ${hasMotivationalWords ? '✅' : '❌'}`);
    console.log(`   Has visual list/bullets: ${hasListItems ? '✅' : '❌'}`);
    
    // Get final button text
    const ctaButton = await page.locator('button').last().innerText();
    console.log(`   CTA Button: "${ctaButton}"`);
    
    // Complete onboarding
    await page.click('button:has-text("Start")');
    await page.waitForTimeout(1500);
    
    // ========== DASHBOARD ==========
    console.log('\n📸 Dashboard (after onboarding)');
    await page.screenshot({ path: `${outputDir}/06-dashboard.png`, fullPage: true });
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All screenshots captured!');
    console.log(`📁 Location: ${outputDir}/`);
    console.log('='.repeat(50));
    
    // Print summary
    console.log('\n📋 VISUAL QA CHECKLIST:');
    console.log('─────────────────────────────────────────');
    console.log('1. Sage groene kleuren & warme tonen?    👉 Check screenshots');
    console.log('2. Premium feel & consistent styling?    👉 Check screenshots');
    console.log('3. Alle stappen: emoji + grote titel?    👉 Check screenshots');
    console.log('4. Goede spacing & layout?               👉 Check screenshots');
    console.log('5. Stap 5 motiverend (niet droog)?       👉 Check 05-step-start.png');
    console.log('6. Progress indicator (5 bolletjes)?     👉 Check screenshots');
    console.log('─────────────────────────────────────────');
    
  } catch (error) {
    console.error('❌ QA failed:', error);
    await page.screenshot({ path: `${outputDir}/error.png`, fullPage: true });
  } finally {
    await browser.close();
  }
}

qaOnboarding().catch(console.error);
