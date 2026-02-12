import { chromium } from 'playwright';

const outputDir = '/tmp/slowcarb-shopping-review';

async function recordVideo() {
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    recordVideo: {
      dir: outputDir,
      size: { width: 375, height: 812 }
    }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  
  try {
    console.log('🎬 Starting shopping/voorraad video recording...');
    
    // Go to app
    await page.goto('http://localhost:5173');
    await delay(2000);
    console.log('✓ App loaded');
    
    // Screenshot for reference
    await page.screenshot({ path: `${outputDir}/01-dashboard.png` });
    
    // Try to start journey if not started
    try {
      const startButton = await page.$('button:has-text("Start Nu")');
      if (startButton) {
        await startButton.click();
        await delay(1500);
        // Close any modal
        await page.keyboard.press('Escape');
        await delay(1000);
      }
    } catch (e) {}
    
    // Navigate to Recepten first to add items to shopping list
    console.log('📱 Going to Recepten...');
    try {
      await page.click('text=Recepten');
      await delay(2000);
      await page.screenshot({ path: `${outputDir}/02-recipes.png` });
      console.log('✓ Recepten page');
      
      // Try to click on a recipe card to add to shopping
      const recipeCard = await page.$('.cursor-pointer, [role="button"]');
      if (recipeCard) {
        await recipeCard.click();
        await delay(2000);
        await page.screenshot({ path: `${outputDir}/03-recipe-detail.png` });
        console.log('✓ Recipe detail');
        
        // Try to find and click add to shopping button
        try {
          await page.click('button:has-text("Boodschappen"), button:has-text("toevoegen")', { timeout: 3000 });
          await delay(2000);
          await page.screenshot({ path: `${outputDir}/04-add-to-shopping.png` });
        } catch (e) {
          console.log('  No add button found');
        }
        
        // Close modal
        await page.keyboard.press('Escape');
        await delay(1000);
      }
    } catch (e) {
      console.log('  Recipe click failed:', e.message.split('\n')[0]);
    }
    
    // Navigate to Boodschappen (shopping)
    console.log('🛒 Going to Boodschappen...');
    try {
      await page.click('text=Boodschappen');
      await delay(2000);
      await page.screenshot({ path: `${outputDir}/05-shopping-list.png` });
      console.log('✓ Shopping list (Lijst tab)');
    } catch (e) {
      console.log('  Failed to go to Boodschappen');
    }
    
    // Check if there's a tab for Voorraad
    console.log('📦 Checking Voorraad tab...');
    try {
      await page.click('text=Voorraad');
      await delay(2000);
      await page.screenshot({ path: `${outputDir}/06-voorraad.png` });
      console.log('✓ Voorraad tab');
    } catch (e) {
      console.log('  No Voorraad tab found');
    }
    
    // Try clicking back to Lijst
    try {
      await page.click('text=Lijst');
      await delay(1500);
      await page.screenshot({ path: `${outputDir}/07-back-to-list.png` });
    } catch (e) {}
    
    // Explore any buttons/interactions on shopping page
    console.log('🔍 Exploring shopping interactions...');
    try {
      // Look for add button
      const addButton = await page.$('button:has-text("Toevoegen"), button:has-text("+")');
      if (addButton) {
        await addButton.click();
        await delay(2000);
        await page.screenshot({ path: `${outputDir}/08-add-item.png` });
        console.log('✓ Add item modal/form');
        await page.keyboard.press('Escape');
        await delay(1000);
      }
    } catch (e) {}
    
    // Final delay for video
    await delay(2000);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Close to save video
  await context.close();
  await browser.close();
  
  console.log(`\n✅ Video + screenshots saved to: ${outputDir}`);
}

recordVideo();
