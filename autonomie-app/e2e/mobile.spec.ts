import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should be fully responsive on mobile viewport', async ({ page }) => {
    // Check that main elements are visible
    await expect(page.locator('h1')).toContainText('Outback');

    // Language buttons should be visible and large enough to tap
    const deButton = page.locator('button:has-text("Deutsch")');
    const box = await deButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40); // Minimum touch target
  });

  test('should have no horizontal scrolling', async ({ page }) => {
    // Get viewport width
    const viewportSize = page.viewportSize();
    if (!viewportSize) throw new Error('No viewport size');

    // Check body width
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportSize.width);
  });

  test('should display cards in single column on mobile', async ({ page }) => {
    // Presets card
    const presetsCard = page.locator('text=PRESETS').locator('..').first();
    const presetsBox = await presetsCard.boundingBox();

    // Location card
    const locationCard = page.locator('text=STANDORT').locator('..').first();
    const locationBox = await locationCard.boundingBox();

    // Both should have similar width (single column)
    expect(Math.abs(presetsBox!.width - locationBox!.width)).toBeLessThan(50);
  });

  test('should have touch-friendly buttons (>44px height)', async ({ page }) => {
    // Check calculate button
    const calcButton = page.locator('button:has-text("Autonomie berechnen")');
    const box = await calcButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should support language switching on mobile', async ({ page }) => {
    const enButton = page.locator('button:has-text("English")');
    await enButton.click();

    // Check if app switched to English
    await expect(page.locator('button:has-text("Location")')).toBeVisible({ timeout: 2000 });
  });

  test('should allow preset management on mobile', async ({ page }) => {
    // Click save preset button
    const saveButton = page.locator('button:has-text("Neues Preset speichern")');
    await saveButton.click();

    // Fill input
    const input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Mobile Test');

    // Save
    const confirmButton = page.locator('button:has-text("Save")');
    await confirmButton.click();

    // Verify
    await expect(page.locator('text=Mobile Test')).toBeVisible();
  });

  test('should handle scroll smoothly', async ({ page }) => {
    // Scroll down to see more content
    await page.evaluate(() => window.scrollBy(0, 500));

    // Check that content is still visible
    const verbrauchText = page.locator('text=VERBRAUCH');
    await expect(verbrauchText).toBeVisible();
  });
});
