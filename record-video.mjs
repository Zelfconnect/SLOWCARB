import { chromium } from 'playwright';

const outputDir = '/tmp/slowcarb-review';

async function recordVideo() {
  const browser = await chromium.launch({ headless: true });
  
  // Create context WITH video recording
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    recordVideo: {
      dir: outputDir,
      size: { width: 375, height: 812 }
    }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  
  try {
    console.log('Starting video recording...');
    
    // Go to app
    await page.goto('http://localhost:5173');
    await delay(3000);
    console.log('✓ App loaded');
    
    // Click Start Nu
    await page.click('button:has-text("Start Nu")');
    await delay(2000);
    console.log('✓ Started journey');
    
    // Try to close modal by pressing Escape or clicking outside
    await page.keyboard.press('Escape');
    await delay(1000);
    
    // If still blocked, try clicking the backdrop
    try {
      await page.click('[data-slot="dialog-overlay"]', { force: true });
      await delay(1000);
    } catch (e) {}
    
    // Try clicking close button if exists
    try {
      await page.click('button:has-text("×"), button:has-text("Sluiten"), [aria-label="Close"]', { timeout: 2000 });
      await delay(1000);
    } catch (e) {}
    
    console.log('✓ Attempted to close modal');
    
    // Now try to navigate tabs
    const tabs = ['Dashboard', 'Recepten', 'Leren', 'Boodschappen'];
    
    for (const tab of tabs) {
      try {
        await page.click(`button:has-text("${tab}")`, { timeout: 5000 });
        await delay(3000); // Stay on each screen for video
        console.log(`✓ ${tab}`);
      } catch (e) {
        console.log(`✗ ${tab} - ${e.message.split('\\n')[0]}`);
      }
    }
    
    // Extra time at end
    await delay(2000);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Close to save video
  await context.close();
  await browser.close();
  
  console.log(`\n✅ Video saved to: ${outputDir}`);
}

recordVideo();
