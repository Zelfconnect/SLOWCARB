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
    
    // Navigate to Boodschappen tab
    console.log('Navigating to Boodschappen...');
    const boodschappenBtn = await page.locator('button:has-text("Boodschappen")').first();
    await boodschappenBtn.click();
    await delay(2500);
    
    // Expand zones to see content with icons
    console.log('Expanding zones to verify icons...');
    
    // Expand Vriezer
    const vriezerBtn = await page.locator('button:has-text("De Vriezer")').first();
    await vriezerBtn.click();
    await delay(1000);
    
    // Expand Voorraadkast
    const voorraadkastBtn = await page.locator('button:has-text("De Voorraadkast")').first();
    await voorraadkastBtn.click();
    await delay(1000);
    
    // Expand Koelkast
    const koelkastBtn = await page.locator('button:has-text("De Koelkast")').first();
    await koelkastBtn.click();
    await delay(1000);
    
    // Expand Airfryer
    const airfryerBtn = await page.locator('button:has-text("Airfryer")').first();
    await airfryerBtn.click();
    await delay(1000);
    
    // Screenshot: All zones expanded
    console.log('Capturing all zones expanded...');
    await page.screenshot({ path: `${outputDir}/05-all-zones-expanded.png`, fullPage: true });
    console.log('✓ All zones expanded captured');
    
    // Try to find and navigate to Weekboodschappen or Lijst tab
    try {
      const lijstBtn = await page.locator('button:has-text("Weekboodschappen"), button:has-text("Lijst"), [role="tab"]:has-text("Lijst"), button:has-text("Boodschappen")').first();
      if (await lijstBtn.isVisible({ timeout: 2000 })) {
        // Check if there's a secondary navigation
        const tabs = await page.locator('button[role="tab"]').all();
        console.log(`Found ${tabs.length} tabs`);
        
        for (const tab of tabs) {
          const text = await tab.textContent();
          console.log(`Tab: ${text}`);
          if (text && (text.includes('Lijst') || text.includes('Week'))) {
            await tab.click();
            await delay(2000);
            console.log('Clicked on Lijst/Week tab');
            break;
          }
        }
      }
    } catch (e) {
      console.log('No additional tabs found');
    }
    
    // Look for Shopping List section
    try {
      const shoppingHeader = await page.locator('h2:has-text("Weekboodschappen"), h2:has-text("Boodschappen")').first();
      if (await shoppingHeader.isVisible({ timeout: 2000 })) {
        console.log('Found shopping list section');
        await page.screenshot({ path: `${outputDir}/06-shopping-list.png`, fullPage: true });
        console.log('✓ Shopping list captured');
      }
    } catch (e) {
      console.log('Shopping list not visible in current view');
    }
    
    console.log(`\n✅ Screenshots saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
