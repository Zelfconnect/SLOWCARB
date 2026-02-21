import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureScreenshots() {
  const outputDir = '/Users/jesperhorst/projects/slowcarb-new/ui-comparison';
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
    
    // Dashboard
    console.log('📸 Taking screenshot of app dashboard...');
    await page.goto('https://eatslowcarb.com/?app=1', { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000);
    await page.screenshot({ path: `${outputDir}/03-app-dashboard.png` });
    console.log('✓ Dashboard captured');
    
    // Recepten tab
    console.log('📸 Taking screenshot of recipes tab...');
    const recipesButton = await page.locator('button:has-text("Recepten")').first();
    if (await recipesButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await recipesButton.click();
      await delay(2000);
      await page.screenshot({ path: `${outputDir}/04-app-recipes.png` });
      console.log('✓ Recipes captured');
    }
    
    // Leren tab
    console.log('📸 Taking screenshot of learn tab...');
    const learnButton = await page.locator('button:has-text("Leren")').first();
    if (await learnButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await learnButton.click();
      await delay(2000);
      await page.screenshot({ path: `${outputDir}/05-app-learn.png` });
      console.log('✓ Learn captured');
    }
    
    console.log(`\n✅ Screenshots saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Still save what we have
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
