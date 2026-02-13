import { chromium } from 'playwright';

const outputDir = '/tmp/slowcarb-icon-verification';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureScreenshots() {
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 60000
  });
  
  try {
    const page = await browser.newPage({ 
      viewport: { width: 390, height: 844 }
    });
    
    page.setDefaultTimeout(30000);
    
    console.log('Navigating to production app...');
    await page.goto('https://slowcarb-new.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    // Navigate to Recepten tab to see recipes with food icons
    console.log('Navigating to Recepten...');
    const receptenBtn = await page.locator('button:has-text("Recepten")').first();
    await receptenBtn.click();
    await delay(3000);
    
    // Screenshot: Recipes list
    console.log('Capturing recipes list...');
    await page.screenshot({ path: `${outputDir}/07-recipes.png`, fullPage: true });
    console.log('✓ Recipes captured');
    
    // Try to click on a recipe to see details
    try {
      const recipeCard = await page.locator('[role="button"], .cursor-pointer, article, .card').first();
      if (await recipeCard.isVisible({ timeout: 2000 })) {
        await recipeCard.click();
        await delay(2500);
        console.log('Opened recipe details...');
        
        await page.screenshot({ path: `${outputDir}/08-recipe-detail.png`, fullPage: true });
        console.log('✓ Recipe detail captured');
      }
    } catch (e) {
      console.log('Could not open recipe details');
    }
    
    // Navigate to Dashboard and look for meal tracker
    console.log('Checking Dashboard for meal tracker...');
    const dashboardBtn = await page.locator('button:has-text("Dashboard")').first();
    await dashboardBtn.click();
    await delay(2500);
    
    await page.screenshot({ path: `${outputDir}/09-dashboard.png`, fullPage: true });
    console.log('✓ Dashboard captured');
    
    // Start journey if button exists
    try {
      const startButton = await page.locator('button:has-text("Start Nu")').first();
      if (await startButton.isVisible({ timeout: 2000 })) {
        await startButton.click();
        await delay(3000);
        console.log('Started journey...');
        
        await page.screenshot({ path: `${outputDir}/10-journey-started.png`, fullPage: true });
        console.log('✓ Journey started captured');
      }
    } catch (e) {
      console.log('No Start Nu button or already in journey');
    }
    
    console.log(`\n✅ All screenshots saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
