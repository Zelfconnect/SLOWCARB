import { chromium } from 'playwright';
import fs from 'fs/promises';
import {
  createStepResult,
  summarizeOnboardingRun,
  getVisualQaRunMessage,
} from './qa-onboarding-status.mjs';

const baseUrl = 'http://localhost:5173?app=1';

async function qaOnboardingSteps() {
  console.log('🔍 Starting Visual QA for all onboarding steps...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  const stepResults = [];
  const recordStep = (step, name, checks) => {
    const result = createStepResult(step, name, checks);
    stepResults.push(result);
    const icon = result.status === 'Clean' ? '✅' : '⚠️';
    console.log(`${icon} Step ${step} (${name}): ${result.status}`);
    if (result.failedChecks.length > 0) {
      console.log(`   Failed checks: ${result.failedChecks.join(', ')}`);
    }
  };
  
  try {
    // Create screenshots directory
    await fs.mkdir('screenshots', { recursive: true });
    
    // Clear localStorage to force onboarding
    await page.goto(baseUrl);
    await page.evaluate(() => localStorage.clear());
    console.log('🧹 localStorage cleared');
    
    // Reload to trigger onboarding
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Step 1: Welcome
    console.log('📸 Step 1: Welcome');
    await page.screenshot({ path: 'screenshots/qa-step1-welcome.png', fullPage: true });
    recordStep(1, 'Welcome', [
      {
        name: 'Hero title',
        critical: true,
        passed: await page.getByRole('heading', { name: /8-10 kg lichter/i }).isVisible().catch(() => false),
      },
      {
        name: 'CTA Vertel me meer',
        critical: true,
        passed: await page.getByRole('button', { name: 'Vertel me meer' }).isVisible().catch(() => false),
      },
    ]);
    await page.click('button:has-text("Vertel me meer")');
    await page.waitForTimeout(500);
    
    // Step 2: Name input
    console.log('📸 Step 2: Name input');
    await page.screenshot({ path: 'screenshots/qa-step2-name.png', fullPage: true });
    recordStep(2, 'Name', [
      {
        name: 'Name label',
        critical: true,
        passed: await page.getByLabel('Je naam').isVisible().catch(() => false),
      },
      {
        name: 'Step title',
        passed: await page.getByRole('heading', { name: /hoe heet je/i }).isVisible().catch(() => false),
      },
    ]);
    await page.fill('input[placeholder*="noemen"]', 'Alex');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);
    
    // Step 3: Promise
    console.log('📸 Step 3: Promise');
    await page.screenshot({ path: 'screenshots/qa-step3-promise.png', fullPage: true });
    recordStep(3, 'Promise', [
      {
        name: 'Promise heading',
        critical: true,
        passed: await page.getByRole('heading', { name: /dit gaat werken/i }).isVisible().catch(() => false),
      },
      {
        name: 'Rules card stat',
        passed: await page.getByText('5').first().isVisible().catch(() => false),
      },
    ]);
    await page.click('button:has-text("Laat me de regels zien")');
    await page.waitForTimeout(500);
    
    // Step 4: Rules
    console.log('📸 Step 4: Rules overview');
    await page.screenshot({ path: 'screenshots/qa-step4-rules.png', fullPage: true });
    recordStep(4, 'Rules', [
      {
        name: 'Rules heading',
        critical: true,
        passed: await page.getByRole('heading', { name: 'De 5 regels' }).isVisible().catch(() => false),
      },
      {
        name: 'Rules cards',
        passed: (await page.locator('.rounded-2xl.border.border-stone-200').count()) >= 5,
      },
    ]);
    await page.click('button:has-text("Wat doet mijn lichaam?")');
    await page.waitForTimeout(500);
    
    // Step 5: Body timeline
    console.log('📸 Step 5: Body timeline');
    await page.screenshot({ path: 'screenshots/qa-step5-timeline.png', fullPage: true });
    recordStep(5, 'Body timeline', [
      {
        name: 'Timeline heading',
        critical: true,
        passed: await page.getByRole('heading', { name: /Wat je lichaam doet/i }).isVisible().catch(() => false),
      },
      {
        name: 'Dag 1-2 marker',
        passed: await page.getByText('Dag 1-2').isVisible().catch(() => false),
      },
    ]);
    await page.click('button:has-text("Waarom werkt dit?")');
    await page.waitForTimeout(500);
    
    // Step 6: Why it works
    console.log('📸 Step 6: Why it works');
    await page.screenshot({ path: 'screenshots/qa-step6-science.png', fullPage: true });
    recordStep(6, 'Why it works', [
      {
        name: 'Science heading',
        critical: true,
        passed: await page.getByRole('heading', { name: /Waarom het werkt/i }).isVisible().catch(() => false),
      },
      {
        name: 'Science card',
        passed: await page.getByText(/Insuline laag houden/i).isVisible().catch(() => false),
      },
    ]);
    await page.click('button:has-text("Wat mag wel en niet?")');
    await page.waitForTimeout(500);

    // Step 7: Yes/no reference
    console.log('📸 Step 7: Yes/no reference');
    await page.screenshot({ path: 'screenshots/qa-step7-reference.png', fullPage: true });
    recordStep(7, 'Reference', [
      {
        name: 'Reference heading',
        critical: true,
        passed: await page.getByRole('heading', { name: /Wat mag wel/i }).isVisible().catch(() => false),
      },
      {
        name: 'Mag wel label',
        passed: await page.getByText('Mag wel').isVisible().catch(() => false),
      },
      {
        name: 'Mag niet label',
        passed: await page.getByText('Mag niet').isVisible().catch(() => false),
      },
    ]);
    await page.click('button:has-text("Nu mijn gegevens")');
    await page.waitForTimeout(500);

    // Step 8: Weight and preferences
    console.log('📸 Step 8: Weight and preferences');
    await page.screenshot({ path: 'screenshots/qa-step8-weight-preferences.png', fullPage: true });
    recordStep(8, 'Weight and preferences', [
      {
        name: 'Current weight input',
        critical: true,
        passed: await page.getByLabel('Huidig (kg)').isVisible().catch(() => false),
      },
      {
        name: 'Target weight input',
        critical: true,
        passed: await page.getByLabel('Streefgewicht (kg)').isVisible().catch(() => false),
      },
      {
        name: 'Preferences labels',
        passed: (await page.locator('input[type="checkbox"]').count()) >= 3,
      },
    ]);
    await page.fill('#onb-cw', '110');
    await page.fill('#onb-tw', '100');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);

    // Step 9: Cheat day
    console.log('📸 Step 9: Cheat day');
    await page.screenshot({ path: 'screenshots/qa-step9-cheatday.png', fullPage: true });
    recordStep(9, 'Cheat day', [
      {
        name: 'Cheat day heading',
        critical: true,
        passed: await page.getByRole('heading', { name: /Kies je cheat day/i }).isVisible().catch(() => false),
      },
      {
        name: 'Cheat day options',
        passed: (await page.locator('[role="radio"]').count()) >= 7,
      },
    ]);
    await page.click('label[for="onb-zaterdag"]');
    await page.click('button:has-text("Volgende")');
    await page.waitForTimeout(500);

    // Step 10: Summary
    console.log('📸 Step 10: Summary');
    await page.screenshot({ path: 'screenshots/qa-step10-summary.png', fullPage: true });
    recordStep(10, 'Summary', [
      {
        name: 'Summary heading',
        critical: true,
        passed: await page.getByRole('heading', { name: /Klaar/i }).isVisible().catch(() => false),
      },
      {
        name: 'Start CTA',
        critical: true,
        passed: await page.getByRole('button', { name: /Start mijn journey/i }).isVisible().catch(() => false),
      },
    ]);

    const summary = summarizeOnboardingRun(stepResults);
    console.log('\n📋 Visual QA Summary');
    console.log('─────────────────────────────────────────');
    console.log(`Clean steps: ${summary.cleanCount}`);
    console.log(`Issue steps: ${summary.issueCount}`);
    console.log(getVisualQaRunMessage(summary));
    console.log('─────────────────────────────────────────');

    if (summary.status !== 'Clean') {
      process.exitCode = 1;
    }
    
  } catch (error) {
    console.error('❌ QA failed:', error);
    await page.screenshot({ path: 'screenshots/qa-error.png', fullPage: true });
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

qaOnboardingSteps().catch(console.error);
