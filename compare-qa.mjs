import { chromium } from 'playwright';
import { spawn } from 'child_process';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureTabs(url, dir, label) {
  const browser = await chromium.launch({ headless: true });
  const screenshots = [];
  
  try {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    console.log(`\n📸 ${label}: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await delay(4000);
    
    const dashPath = `${dir}/${label.toLowerCase()}-dashboard.png`;
    await page.screenshot({ path: dashPath });
    screenshots.push({ name: 'Dashboard', path: dashPath });
    console.log(`   ✓ Dashboard saved`);
    
    const tabs = ['Recepten', 'Leren', 'Boodschappen'];
    for (const tab of tabs) {
      try {
        const btn = page.locator('button').filter({ hasText: tab }).first();
        if (await btn.isVisible({ timeout: 3000 })) {
          await btn.click();
          await delay(2000);
          const path = `${dir}/${label.toLowerCase()}-${tab.toLowerCase()}.png`;
          await page.screenshot({ path });
          screenshots.push({ name: tab, path });
          console.log(`   ✓ ${tab} saved`);
        }
      } catch (e) {
        console.log(`   ⚠ ${tab} not found`);
      }
    }
    
    return screenshots;
  } finally {
    await browser.close();
  }
}

const liveUrl = 'https://eatslowcarb.com/?app=1';
const localUrl = 'http://localhost:4173/?app=1';
const outputDir = '/tmp/slowcarb-qa';

console.log('🔍 SlowCarb UI Alignment QA');
console.log('============================');

console.log('\n🚀 Starting local preview...');
const preview = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { 
  cwd: '/Users/jesperhorst/projects/slowcarb-new',
  stdio: 'pipe'
});

await delay(6000);

try {
  await captureTabs(liveUrl, outputDir, 'LIVE');
  await captureTabs(localUrl, outputDir, 'LOCAL');
  console.log('\n\n✅ Screenshots saved to /tmp/slowcarb-qa/');
} catch (e) {
  console.error('\n✗ Error:', e.message);
} finally {
  preview.kill();
}
