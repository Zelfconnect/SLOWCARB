import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots/onboarding-polish');
const BASE_URL = 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // First, set the access token so we bypass the landing page gate
  await page.goto(BASE_URL);
  await page.evaluate(() => {
    // Clear profile so onboarding is triggered, but set access token
    localStorage.removeItem('slowcarb_profile');
    localStorage.setItem('slowcarb_access', 'slowcarb2026');
  });

  // Now navigate with ?app=1&onboarding=1
  await page.goto(`${BASE_URL}/?app=1&onboarding=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Screen 1: Hero (WelcomeHero)
  console.log('--- Screen 1: Hero ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-hero.png'), fullPage: false });
  console.log('Screenshot saved: 01-hero.png');

  // Click "Vertel me meer"
  await page.getByRole('button', { name: /Vertel me meer/i }).click();
  await page.waitForTimeout(600);

  // Screen 2: Name input (NameInput)
  console.log('--- Screen 2: Name ---');
  await page.locator('input').first().fill('Jesper');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-name.png'), fullPage: false });
  console.log('Screenshot saved: 02-name.png');

  // Click "Volgende"
  await page.getByRole('button', { name: /Volgende/i }).click();
  await page.waitForTimeout(600);

  // Screen 3: The Promise (ThePromise) - should have Lucide icons instead of emojis
  console.log('--- Screen 3: Promise ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-promise.png'), fullPage: false });
  console.log('Screenshot saved: 03-promise.png');

  // Click "Laat me de regels zien"
  await page.getByRole('button', { name: /Laat me de regels zien/i }).click();
  await page.waitForTimeout(600);

  // Screen 4: Rules (RulesOverview)
  console.log('--- Screen 4: Rules ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-rules.png'), fullPage: false });
  console.log('Screenshot saved: 04-rules.png');

  // Click "Wat doet mijn lichaam?"
  await page.getByRole('button', { name: /Wat doet mijn lichaam/i }).click();
  await page.waitForTimeout(600);

  // Screen 5: Timeline (BodyTimeline) - should use sage/stone colors instead of red/yellow
  console.log('--- Screen 5: Timeline ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-timeline.png'), fullPage: false });
  console.log('Screenshot saved: 05-timeline.png');

  // Click "Waarom werkt dit?"
  await page.getByRole('button', { name: /Waarom werkt dit/i }).click();
  await page.waitForTimeout(600);

  // Screen 6: Why it works (WhyItWorks)
  console.log('--- Screen 6: Why it works ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-why-it-works.png'), fullPage: false });
  console.log('Screenshot saved: 06-why-it-works.png');

  // Click "Wat mag wel en niet?"
  await page.getByRole('button', { name: /Wat mag wel en niet/i }).click();
  await page.waitForTimeout(600);

  // Screen 7: Yes/No (YesNoReference) - should use muted green/gray instead of bright green/red
  console.log('--- Screen 7: Yes/No ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-yes-no.png'), fullPage: false });
  console.log('Screenshot saved: 07-yes-no.png');

  // Click "Nu mijn gegevens"
  await page.getByRole('button', { name: /Nu mijn gegevens/i }).click();
  await page.waitForTimeout(600);

  // Screen 8: Weight input (WeightAndPreferences)
  console.log('--- Screen 8: Weight ---');
  // Fill the weight inputs
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log(`Found ${inputCount} inputs`);

  // The weight inputs use inputMode="decimal" - find them
  for (let i = 0; i < inputCount; i++) {
    const inputMode = await inputs.nth(i).getAttribute('inputmode');
    const placeholder = await inputs.nth(i).getAttribute('placeholder');
    const type = await inputs.nth(i).getAttribute('type');
    console.log(`  Input ${i}: type="${type}" inputMode="${inputMode}" placeholder="${placeholder}"`);
  }

  // Fill current weight and target weight
  const weightInputs = page.locator('input[inputmode="decimal"], input[type="number"]');
  const wCount = await weightInputs.count();
  if (wCount >= 2) {
    await weightInputs.nth(0).fill('95');
    await page.waitForTimeout(200);
    await weightInputs.nth(1).fill('85');
    await page.waitForTimeout(200);
  } else {
    // Try all inputs
    for (let i = 0; i < inputCount; i++) {
      if (i === 0) await inputs.nth(i).fill('95');
      if (i === 1) await inputs.nth(i).fill('85');
    }
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-weight.png'), fullPage: false });
  console.log('Screenshot saved: 08-weight.png');

  // Click "Volgende"
  await page.getByRole('button', { name: /Volgende/i }).click();
  await page.waitForTimeout(600);

  // Screen 9: Cheat day (CheatDayPicker) - should have no emoji
  console.log('--- Screen 9: Cheat day ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-cheat-day.png'), fullPage: false });
  console.log('Screenshot saved: 09-cheat-day.png');

  // Click "Volgende"
  await page.getByRole('button', { name: /Volgende/i }).click();
  await page.waitForTimeout(600);

  // Screen 10: Summary (SummaryLaunch) - should have check icon instead of rocket emoji
  console.log('--- Screen 10: Summary ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-summary.png'), fullPage: false });
  console.log('Screenshot saved: 10-summary.png');

  await browser.close();
  console.log('\nDone! All 10 screenshots saved to:', SCREENSHOT_DIR);
}

run().catch(err => {
  console.error('Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
