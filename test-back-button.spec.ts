import { test, expect } from '@playwright/test';

test('recipe modal back button has good contrast', async ({ page }) => {
  await page.goto('http://localhost:5174');
  
  // Close welcome modal if present
  const closeButton = page.getByRole('button', { name: /close/i });
  if (await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForTimeout(500);
  }
  
  // Find and click a recipe
  const recipeCard = page.locator('.cursor-pointer').first();
  await recipeCard.click();
  await page.waitForTimeout(1000);
  
  // Take screenshot of the modal with back button
  await page.screenshot({ path: 'modal-back-button-test.png', fullPage: false });
  
  // Verify back button exists and has correct classes
  const backButton = page.getByRole('button', { name: /terug/i });
  await expect(backButton).toBeVisible();
  
  const classes = await backButton.getAttribute('class');
  console.log('Back button classes:', classes);
  
  // Verify it has the new solid white background
  expect(classes).toContain('bg-white');
  expect(classes).toContain('text-sage-700');
  expect(classes).toContain('shadow-sm');
  
  console.log('✅ Back button has correct high-contrast styles');
});
