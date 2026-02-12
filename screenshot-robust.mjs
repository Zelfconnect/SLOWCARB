import { chromium } from 'playwright';

const outputDir = '/tmp/slowcarb-review';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureScreenshots() {
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 60000 // 60s launch timeout
  });
  
  try {
    const page = await browser.newPage({ 
      viewport: { width: 375, height: 812 }
    });
    
    page.setDefaultTimeout(30000); // 30s default timeout
    
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    // Screenshot 1: Initial state (onboarding or dashboard)
    console.log('Capturing initial state...');
    await page.screenshot({ path: `${outputDir}/01-initial.png` });
    console.log('✓ Initial state');
    
    // Try to start journey if button exists
    try {
      const startButton = await page.locator('button:has-text("Start Nu")').first();
      if (await startButton.isVisible({ timeout: 2000 })) {
        await startButton.click();
        await delay(2000);
        console.log('✓ Started journey');
      }
    } catch (e) {
      console.log('No Start Nu button, continuing...');
    }
    
    // Screenshot 2: Dashboard
    console.log('Capturing dashboard...');
    await page.screenshot({ path: `${outputDir}/02-dashboard.png` });
    console.log('✓ Dashboard');
    await delay(1000);
    
    // Navigate to tabs
    const tabs = [
      { name: 'Recepten', file: '03-recepten.png' },
      { name: 'Leren', file: '04-leren.png' },
      { name: 'Boodschappen', file: '05-boodschappen.png' }
    ];
    
    for (const tab of tabs) {
      try {
        console.log(`Navigating to ${tab.name}...`);
        const button = await page.locator(`button:has-text("${tab.name}")`).first();
        await button.click();
        await delay(2000);
        await page.screenshot({ path: `${outputDir}/${tab.file}` });
        console.log(`✓ ${tab.name}`);
        await delay(1000);
      } catch (e) {
        console.error(`✗ Failed to capture ${tab.name}:`, e.message);
      }
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
