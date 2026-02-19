import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const outputDir = '/tmp/slowcarb-qa';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runQAChecks() {
  const url = 'https://slowcarb-new.vercel.app';
  
  // Create output directory
  try {
    mkdirSync(outputDir, { recursive: true });
  } catch (e) {}

  const browser = await chromium.launch({ 
    headless: true,
    timeout: 60000
  });
  
  try {
    // iPhone 14 Pro viewport
    const page = await browser.newPage({ 
      viewport: { width: 390, height: 844 }
    });
    
    page.setDefaultTimeout(30000);
    
    console.log('=== QA MODAL CHECKS ===');
    console.log('Device: iPhone 14 Pro (390x844)');
    console.log('URL:', url);
    console.log('');
    
    // Navigate to app
    console.log('Navigating to app...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    // Handle onboarding if present
    try {
      const startButton = await page.locator('button:has-text("Start Nu")').first();
      if (await startButton.isVisible({ timeout: 2000 })) {
        await startButton.click();
        await delay(2000);
        console.log('✓ Completed onboarding');
      }
    } catch (e) {
      console.log('No onboarding, continuing...');
    }
    
    // ============================================
    // CHECK 1: Recipe Detail Modal Centered
    // ============================================
    console.log('\n--- CHECK 1: Recipe Detail Modal ---');
    try {
      // Navigate to Recepten tab
      const receptenTab = await page.locator('button:has-text("Recepten")').first();
      await receptenTab.click();
      await delay(2000);
      
      // Find and click on Krokante Kip Drumsticks (or first recipe card)
      const recipeCard = await page.locator('div').filter({ hasText: /Krokante Kip|Drumsticks|Kip/ }).first();
      await recipeCard.click();
      await delay(2000);
      
      // Take screenshot of recipe modal
      await page.screenshot({ path: `${outputDir}/check1-recipe-modal.png` });
      console.log('✓ Screenshot saved: check1-recipe-modal.png');
      
      // Check if modal is centered by evaluating layout
      const modalCheck = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]') || 
                     document.querySelector('.modal') || 
                     document.querySelector('[class*="modal"]') ||
                     document.querySelector('[class*="dialog"]');
        if (!modal) return { found: false };
        
        const rect = modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const leftMargin = rect.left;
        const rightMargin = viewportWidth - rect.right;
        
        return {
          found: true,
          left: rect.left,
          right: viewportWidth - rect.right,
          width: rect.width,
          viewportWidth: viewportWidth,
          isCentered: Math.abs(leftMargin - rightMargin) < 10,
          isCutOff: rect.right > viewportWidth + 5
        };
      });
      
      console.log('Modal check:', modalCheck);
      
      if (modalCheck.found) {
        if (modalCheck.isCutOff) {
          console.log('❌ CHECK 1 FAIL: Modal is cut off on the right');
        } else if (!modalCheck.isCentered) {
          console.log(`⚠️ CHECK 1 WARNING: Modal not centered (left: ${modalCheck.left.toFixed(0)}px, right: ${modalCheck.right.toFixed(0)}px)`);
        } else {
          console.log('✅ CHECK 1 PASS: Modal is centered with equal margins');
        }
      } else {
        console.log('⚠️ Could not detect modal for measurement');
      }
      
      // Close modal
      try {
        const closeBtn = await page.locator('button[class*="close"], button[aria-label*="close"], button:has-text("✕"), button:has-text("×")').first();
        await closeBtn.click();
        await delay(1000);
      } catch (e) {
        // Try clicking outside
        await page.click('body', { position: { x: 10, y: 10 } });
        await delay(1000);
      }
    } catch (e) {
      console.log('❌ CHECK 1 ERROR:', e.message);
    }
    
    // ============================================
    // CHECK 2 & 3: Package Selector Modal
    // ============================================
    console.log('\n--- CHECK 2 & 3: Package Selector Modal ---');
    try {
      // Re-open recipe
      const recipeCard = await page.locator('div').filter({ hasText: /Krokante Kip|Drumsticks|Kip/ }).first();
      await recipeCard.click();
      await delay(2000);
      
      // Click '+ Toevoegen' button
      const toevoegenBtn = await page.locator('button:has-text("Toevoegen"), button:has-text("+"), button[class*="add"]').first();
      await toevoegenBtn.click();
      await delay(2000);
      
      // Take screenshot of package selector
      await page.screenshot({ path: `${outputDir}/check2-package-selector.png` });
      console.log('✓ Screenshot saved: check2-package-selector.png');
      
      // Check modal centering
      const modalCheck = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]') || 
                     document.querySelector('.modal') || 
                     document.querySelector('[class*="modal"]') ||
                     document.querySelector('[class*="dialog"]');
        if (!modal) return { found: false };
        
        const rect = modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const leftMargin = rect.left;
        const rightMargin = viewportWidth - rect.right;
        
        return {
          found: true,
          left: rect.left,
          right: viewportWidth - rect.right,
          width: rect.width,
          viewportWidth: viewportWidth,
          isCentered: Math.abs(leftMargin - rightMargin) < 10,
          isCutOff: rect.right > viewportWidth + 5
        };
      });
      
      console.log('Package selector check:', modalCheck);
      
      if (modalCheck.found) {
        if (modalCheck.isCutOff) {
          console.log('❌ CHECK 2 FAIL: Package selector is cut off on the right');
        } else if (!modalCheck.isCentered) {
          console.log(`⚠️ CHECK 2 WARNING: Not centered (left: ${modalCheck.left.toFixed(0)}px, right: ${modalCheck.right.toFixed(0)}px)`);
        } else {
          console.log('✅ CHECK 2 PASS: Package selector is centered');
        }
      }
      
      // Check 3: Scrollability
      console.log('\n--- CHECK 3: Scrollable Content ---');
      const scrollCheck = await page.evaluate(() => {
        const scrollable = document.querySelector('[class*="scroll"]') || 
                          document.querySelector('[class*="overflow"]') ||
                          document.querySelector('[role="dialog"]');
        if (!scrollable) return { found: false };
        
        return {
          found: true,
          scrollHeight: scrollable.scrollHeight,
          clientHeight: scrollable.clientHeight,
          isScrollable: scrollable.scrollHeight > scrollable.clientHeight
        };
      });
      
      console.log('Scroll check:', scrollCheck);
      
      if (scrollCheck.isScrollable) {
        console.log('✅ CHECK 3 PASS: Content is scrollable');
      } else {
        console.log('⚠️ CHECK 3: Content may not need scrolling or scroll area not detected');
      }
      
      // Try scrolling
      try {
        await page.evaluate(() => window.scrollBy(0, 300));
        await delay(500);
        await page.screenshot({ path: `${outputDir}/check3-scrolled.png` });
        console.log('✓ Scrolled screenshot saved: check3-scrolled.png');
      } catch (e) {}
      
      // Close modal
      try {
        const closeBtn = await page.locator('button[class*="close"], button:has-text("✕"), button:has-text("×")').first();
        await closeBtn.click();
        await delay(1000);
      } catch (e) {}
    } catch (e) {
      console.log('❌ CHECK 2/3 ERROR:', e.message);
    }
    
    // ============================================
    // CHECK 4: Education Card (REFERENCE)
    // ============================================
    console.log('\n--- CHECK 4: Education Card (REFERENCE) ---');
    try {
      // Navigate to Leren tab
      const lerenTab = await page.locator('button:has-text("Leren")').first();
      await lerenTab.click();
      await delay(2000);
      
      // Click on first education card
      const eduCard = await page.locator('div[class*="card"], article, [class*="education"]').first();
      await eduCard.click();
      await delay(2000);
      
      // Take screenshot
      await page.screenshot({ path: `${outputDir}/check4-education-reference.png` });
      console.log('✓ Screenshot saved: check4-education-reference.png');
      
      // Check layout
      const modalCheck = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]') || 
                     document.querySelector('.modal') || 
                     document.querySelector('[class*="modal"]') ||
                     document.querySelector('[class*="dialog"]');
        if (!modal) return { found: false };
        
        const rect = modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        return {
          found: true,
          left: rect.left,
          right: viewportWidth - rect.right,
          width: rect.width,
          viewportWidth: viewportWidth,
          isCentered: Math.abs(rect.left - (viewportWidth - rect.right)) < 10,
          isCutOff: rect.right > viewportWidth + 5
        };
      });
      
      console.log('Education modal check:', modalCheck);
      
      if (modalCheck.found && !modalCheck.isCutOff) {
        console.log('✅ CHECK 4 PASS: Education card modal looks correct (REFERENCE)');
      } else if (modalCheck.isCutOff) {
        console.log('❌ CHECK 4 FAIL: Education modal is also cut off (REFERENCE ISSUE)');
      } else {
        console.log('⚠️ CHECK 4: Could not verify education modal layout');
      }
      
    } catch (e) {
      console.log('❌ CHECK 4 ERROR:', e.message);
    }
    
    console.log('\n=== QA CHECKS COMPLETE ===');
    console.log(`Screenshots saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Fatal Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

runQAChecks().catch(console.error);
