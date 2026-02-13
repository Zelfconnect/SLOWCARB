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
      viewport: { width: 390, height: 844 } // iPhone 14 dimensions
    });
    
    page.setDefaultTimeout(30000);
    
    console.log('Navigating to production app...');
    await page.goto('https://slowcarb-new.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    // Screenshot 1: Home / Dashboard (may show daily meal tracker)
    console.log('Capturing Home/Dashboard...');
    await page.screenshot({ path: `${outputDir}/01-home.png`, fullPage: true });
    console.log('✓ Home captured');
    
    // Navigate to Boodschappen tab (Ammo Check & Shopping)
    console.log('Navigating to Boodschappen...');
    try {
      const boodschappenBtn = await page.locator('button:has-text("Boodschappen"), nav button:has-text("Boodschappen"), [role="tab"]:has-text("Boodschappen")').first();
      await boodschappenBtn.click();
      await delay(2500);
      
      // Screenshot 2: Boodschappen main (Ammo Check with zone cards)
      console.log('Capturing Boodschappen (Ammo Check with zones)...');
      await page.screenshot({ path: `${outputDir}/02-boodschappen-zones.png`, fullPage: true });
      console.log('✓ Boodschappen zones captured');
      
      // Look for "Voorraad" or shopping list section
      try {
        const voorraadBtn = await page.locator('button:has-text("Voorraad"), button:has-text("Lijst"), [role="tab"]:has-text("Voorraad"), h2:has-text("Voorraad"), h3:has-text("Voorraad")').first();
        if (await voorraadBtn.isVisible({ timeout: 2000 })) {
          await voorraadBtn.click();
          await delay(2000);
          console.log('Navigated to Voorraad...');
        }
      } catch (e) {
        console.log('No separate Voorraad tab, checking current view...');
      }
      
      // Screenshot 3: Shopping/Voorraad (food categories)
      console.log('Capturing Voorraad/Shopping List (food categories)...');
      await page.screenshot({ path: `${outputDir}/03-voorraad-categories.png`, fullPage: true });
      console.log('✓ Voorraad categories captured');
      
      // Try to access add item or package selector if available
      try {
        const addBtn = await page.locator('button:has-text("Toevoegen"), button:has-text("+"), [aria-label*="toevoegen" i]').first();
        if (await addBtn.isVisible({ timeout: 2000 })) {
          await addBtn.click();
          await delay(2000);
          console.log('Opened add item modal...');
          
          // Screenshot 4: Add item modal (package selector)
          console.log('Capturing Add Item modal...');
          await page.screenshot({ path: `${outputDir}/04-add-item-modal.png`, fullPage: true });
          console.log('✓ Add item modal captured');
        }
      } catch (e) {
        console.log('No add item button found or modal did not open');
      }
      
    } catch (e) {
      console.error('✗ Failed to navigate Boodschappen:', e.message);
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
