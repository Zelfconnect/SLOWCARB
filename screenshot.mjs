import { chromium } from 'playwright';

const outputDir = '/tmp/slowcarb-review';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

await page.goto('http://localhost:5173');
await page.waitForTimeout(2000);

// Screenshot 1: Onboarding
await page.screenshot({ path: `${outputDir}/01-onboarding.png` });
console.log('✓ Onboarding');

// Click Start Nu if visible
try {
  await page.click('button:has-text("Start Nu")');
  await page.waitForTimeout(1500);
} catch (e) { console.log('No Start Nu button'); }

// Screenshot 2: Dashboard
await page.screenshot({ path: `${outputDir}/02-dashboard.png` });
console.log('✓ Dashboard');

// Navigate to Recepten
await page.click('button:has-text("Recepten")');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outputDir}/03-recepten.png` });
console.log('✓ Recepten');

// Navigate to Leren
await page.click('button:has-text("Leren")');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outputDir}/04-leren.png` });
console.log('✓ Leren');

// Navigate to Boodschappen
await page.click('button:has-text("Boodschappen")');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outputDir}/05-boodschappen.png` });
console.log('✓ Boodschappen');

await browser.close();
console.log(`\n✅ All screenshots saved to: ${outputDir}`);
