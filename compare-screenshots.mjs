import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureScreenshots() {
  const outputDir = '/Users/jesperhorst/projects/slowcarb-new/ui-comparison';
  await mkdir(outputDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    const page = await browser.newPage({ 
      viewport: { width: 390, height: 844 } // iPhone 14 dimensions
    });
    
    // 1. Landing page
    console.log('📸 Taking screenshot of landing page...');
    await page.goto('https://eatslowcarb.com', { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000);
    await page.screenshot({ path: `${outputDir}/01-landing-page.png`, fullPage: true });
    console.log('✓ Landing page captured');
    
    // 2. App home
    console.log('📸 Taking screenshot of app home...');
    await page.goto('https://eatslowcarb.com/?app=1', { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000);
    await page.screenshot({ path: `${outputDir}/02-app-home.png`, fullPage: true });
    console.log('✓ App home captured');
    
    console.log(`\n✅ Screenshots saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
