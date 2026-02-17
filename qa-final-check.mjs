#!/usr/bin/env node
/**
 * QA Final Check - Screenshots en verificatie
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, 'screenshots', 'qa-final');

const BASE_URL = 'http://localhost:5179';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runQAChecks() {
  console.log('🚀 Start QA Final Check...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 dimensions
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  const results = [];
  
  try {
    // ===== TEST 1: Dashboard met bottom nav =====
    console.log('📸 Test 1: Dashboard met bottom nav...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    // Wacht op bottom nav
    await page.waitForSelector('nav, [class*="bottom-nav"], [class*="BottomNav"]', { timeout: 5000 });
    
    await page.screenshot({ 
      path: join(SCREENSHOTS_DIR, '01-dashboard-bottom-nav.png'),
      fullPage: false
    });
    
    // Check spacing tussen nav items
    const navSpacing = await page.evaluate(() => {
      const nav = document.querySelector('nav, [class*="bottom-nav"], [class*="BottomNav"]');
      if (!nav) return null;
      const items = nav.querySelectorAll('a, button');
      const spacing = [];
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        spacing.push({ index: i, x: rect.x, width: rect.width });
      });
      return { itemCount: items.length, items: spacing };
    });
    
    console.log('   Nav items gevonden:', navSpacing?.itemCount || 0);
    console.log('   Spacing data:', JSON.stringify(navSpacing?.items, null, 2));
    
    results.push({
      test: 'Dashboard - Bottom nav spacing',
      status: navSpacing?.itemCount >= 4 ? 'OK' : 'ISSUE',
      details: navSpacing?.itemCount >= 4 
        ? `${navSpacing.itemCount} nav items gevonden` 
        : 'Niet genoeg nav items gevonden'
    });
    
    // ===== TEST 2: Leren tab - check content achter nav =====
    console.log('\n📸 Test 2: Leren tab content...');
    
    // Zoek de Leren tab
    const learnTab = await page.locator('nav a, nav button, [class*="bottom-nav"] a, [class*="bottom-nav"] button').filter({ hasText: /Leren|Learn/i }).first();
    if (await learnTab.isVisible().catch(() => false)) {
      await learnTab.click();
      await delay(1500);
    } else {
      // Probeer via tekst
      await page.getByText(/Leren|Learn/i).first().click({ timeout: 5000 }).catch(() => {});
      await delay(1500);
    }
    
    await page.screenshot({ 
      path: join(SCREENSHOTS_DIR, '02-leren-tab.png'),
      fullPage: true
    });
    
    // Check of content achter de bottom nav verdwijnt
    const contentCheck = await page.evaluate(() => {
      const nav = document.querySelector('nav, [class*="bottom-nav"], [class*="BottomNav"]');
      const navHeight = nav ? nav.offsetHeight : 0;
      const navRect = nav ? nav.getBoundingClientRect() : { bottom: window.innerHeight };
      
      // Check of er padding/margin is aan de bottom van de main content
      const main = document.querySelector('main, [class*="main"], [class*="content"]');
      const mainStyles = main ? window.getComputedStyle(main) : null;
      const paddingBottom = mainStyles ? parseInt(mainStyles.paddingBottom) : 0;
      const marginBottom = mainStyles ? parseInt(mainStyles.marginBottom) : 0;
      
      // Check scroll height vs viewport
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      return {
        navHeight,
        navBottom: navRect.bottom,
        viewportHeight: window.innerHeight,
        paddingBottom,
        marginBottom,
        scrollHeight,
        clientHeight,
        hasScroll: scrollHeight > clientHeight,
        contentBottomSpacing: paddingBottom || marginBottom
      };
    });
    
    console.log('   Nav hoogte:', contentCheck.navHeight);
    console.log('   Content padding/margin bottom:', contentCheck.contentBottomSpacing);
    
    const contentOk = contentCheck.contentBottomSpacing >= 60 || contentCheck.paddingBottom >= 60;
    results.push({
      test: 'Leren tab - Content niet achter nav',
      status: contentOk ? 'OK' : 'ISSUE',
      details: contentOk 
        ? `Padding/margin bottom is ${contentCheck.contentBottomSpacing}px` 
        : `Content heeft mogelijk geen genoeg bottom spacing (${contentCheck.contentBottomSpacing}px). Check of content achter nav verdwijnt.`
    });
    
    // ===== TEST 3: Instellingen - toggle positioning =====
    console.log('\n📸 Test 3: Instellingen toggles...');
    
    // Zoek Instellingen tab
    const settingsTab = await page.locator('nav a, nav button, [class*="bottom-nav"] a, [class*="bottom-nav"] button').filter({ hasText: /Instellingen|Settings/i }).first();
    if (await settingsTab.isVisible().catch(() => false)) {
      await settingsTab.click();
      await delay(1500);
    }
    
    await page.screenshot({ 
      path: join(SCREENSHOTS_DIR, '03-instellingen.png'),
      fullPage: true
    });
    
    // Check toggle positioning
    const toggleCheck = await page.evaluate(() => {
      // Zoek toggles/checkboxen
      const toggles = document.querySelectorAll('input[type="checkbox"], [role="switch"], [class*="toggle"], [class*="switch"]');
      const results = [];
      
      toggles.forEach((toggle, i) => {
        const rect = toggle.getBoundingClientRect();
        const parent = toggle.closest('label, div, li');
        const parentRect = parent ? parent.getBoundingClientRect() : null;
        
        // Check of toggle aan de rechterkant staat
        const viewportWidth = window.innerWidth;
        const isAtRightEdge = rect.right > viewportWidth - 20;
        
        // Check of er een label naast staat
        const sibling = toggle.previousElementSibling || toggle.nextElementSibling;
        const hasLabelNearby = sibling && sibling.tagName === 'LABEL' || sibling?.textContent?.trim().length > 0;
        
        results.push({
          index: i,
          x: rect.x,
          right: rect.right,
          viewportWidth,
          isAtRightEdge,
          hasLabelNearby,
          parentWidth: parentRect?.width
        });
      });
      
      return { toggleCount: toggles.length, toggles: results };
    });
    
    console.log('   Toggles gevonden:', toggleCheck.toggleCount);
    console.log('   Toggle data:', JSON.stringify(toggleCheck.toggles, null, 2));
    
    const togglesOk = toggleCheck.toggleCount === 0 || toggleCheck.toggles.every(t => !t.isAtRightEdge);
    results.push({
      test: 'Instellingen - Toggles naast labels',
      status: togglesOk ? 'OK' : 'ISSUE',
      details: toggleCheck.toggleCount === 0 
        ? 'Geen toggles gevonden (pagina mogelijk niet geladen)' 
        : togglesOk 
          ? `Toggles staan correct naast labels` 
          : `Sommige toggles staan te dicht bij de rechterrand (check: ${toggleCheck.toggles.filter(t => t.isAtRightEdge).length} toggle(s))`
    });
    
    // ===== TEST 4: FAB menu z-index =====
    console.log('\n📸 Test 4: FAB menu (+ knop)...');
    
    // Ga terug naar dashboard
    const homeTab = await page.locator('nav a, nav button, [class*="bottom-nav"] a, [class*="bottom-nav"] button').first();
    if (await homeTab.isVisible().catch(() => false)) {
      await homeTab.click();
      await delay(1000);
    }
    
    // Zoek FAB (+ knop)
    const fabButton = await page.locator('button, a').filter({ hasText: '+' }).first();
    const fabByClass = await page.locator('[class*="fab"], [class*="FAB"]').first();
    
    let fabClicked = false;
    if (await fabButton.isVisible().catch(() => false)) {
      await fabButton.click();
      fabClicked = true;
    } else if (await fabByClass.isVisible().catch(() => false)) {
      await fabByClass.click();
      fabClicked = true;
    }
    
    if (fabClicked) {
      await delay(1000);
      
      await page.screenshot({ 
        path: join(SCREENSHOTS_DIR, '04-fab-menu.png'),
        fullPage: false
      });
      
      // Check z-index
      const fabCheck = await page.evaluate(() => {
        // Zoek het geopende menu
        const menus = document.querySelectorAll('[class*="menu"], [class*="dropdown"], dialog, [role="dialog"]');
        let topMenu = null;
        let maxZIndex = -1;
        
        menus.forEach(menu => {
          const rect = menu.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const style = window.getComputedStyle(menu);
            const zIndex = parseInt(style.zIndex) || 0;
            if (zIndex > maxZIndex) {
              maxZIndex = zIndex;
              topMenu = { 
                className: menu.className, 
                zIndex,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
              };
            }
          }
        });
        
        // Check nav z-index voor vergelijking
        const nav = document.querySelector('nav, [class*="bottom-nav"]');
        const navZIndex = nav ? (parseInt(window.getComputedStyle(nav).zIndex) || 0) : 0;
        
        return {
          menuFound: !!topMenu,
          menuZIndex: maxZIndex,
          navZIndex,
          menuAboveNav: maxZIndex > navZIndex,
          menuDetails: topMenu
        };
      });
      
      console.log('   Menu gevonden:', fabCheck.menuFound);
      console.log('   Menu z-index:', fabCheck.menuZIndex);
      console.log('   Nav z-index:', fabCheck.navZIndex);
      console.log('   Menu boven nav:', fabCheck.menuAboveNav);
      
      results.push({
        test: 'FAB menu - Boven alle content',
        status: fabCheck.menuAboveNav ? 'OK' : 'ISSUE',
        details: fabCheck.menuAboveNav 
          ? `Menu z-index (${fabCheck.menuZIndex}) is hoger dan nav z-index (${fabCheck.navZIndex})` 
          : `Menu z-index (${fabCheck.menuZIndex}) is NIET hoger dan nav z-index (${fabCheck.navZIndex})`
      });
    } else {
      console.log('   ⚠️ FAB knop niet gevonden');
      results.push({
        test: 'FAB menu - Boven alle content',
        status: 'ISSUE',
        details: 'FAB knop (+) niet gevonden op de pagina'
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    results.push({
      test: 'Algemeen',
      status: 'ERROR',
      details: error.message
    });
  }
  
  await browser.close();
  
  // Print rapport
  console.log('\n' + '='.repeat(60));
  console.log('📋 QA FINAL RAPPORT');
  console.log('='.repeat(60));
  
  results.forEach(r => {
    const icon = r.status === 'OK' ? '✅' : r.status === 'ERROR' ? '❌' : '⚠️';
    console.log(`\n${icon} ${r.test}`);
    console.log(`   Status: ${r.status}`);
    console.log(`   Details: ${r.details}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📁 Screenshots opgeslagen in: ${SCREENSHOTS_DIR}`);
  console.log('='.repeat(60));
  
  // Summary
  const okCount = results.filter(r => r.status === 'OK').length;
  const issueCount = results.filter(r => r.status === 'ISSUE').length;
  console.log(`\nSamenvatting: ${okCount} OK, ${issueCount} ISSUES`);
  
  process.exit(issueCount > 0 ? 1 : 0);
}

runQAChecks().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
