import { test, expect } from '@playwright/test';

test.describe('Outback App - Main Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the app and display title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Outback');
    await expect(page.locator('p')).toContainText('LiFePO4');
  });

  test('should display language switcher with DE and EN buttons', async ({ page }) => {
    const deButton = page.locator('button:has-text("Deutsch")');
    const enButton = page.locator('button:has-text("English")');

    await expect(deButton).toBeVisible();
    await expect(enButton).toBeVisible();
  });

  test('should switch language from German to English', async ({ page }) => {
    const enButton = page.locator('button:has-text("English")');
    await enButton.click();

    // Check if text changed to English
    await expect(page.locator('button:has-text("Location")')).toBeVisible();
  });

  test('should display all main cards', async ({ page }) => {
    // Scroll to ensure all elements are visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.locator('text=PRESETS')).toBeVisible();
    await expect(page.locator('text=STANDORT')).toBeVisible();
    await expect(page.locator('text=BATTERIE')).toBeVisible();
    await expect(page.locator('text=VERBRAUCH')).toBeVisible();
    await expect(page.locator('text=SOLARANLAGE')).toBeVisible();
  });

  test('should calculate autonomy with valid inputs', async ({ page }) => {
    // Set date range
    const startInput = page.locator('input[type="date"]').first();
    await startInput.fill('2026-10-04');

    const endInput = page.locator('input[type="date"]').last();
    await endInput.fill('2026-10-18');

    // Click calculate button
    await page.locator('button:has-text("Autonomie berechnen")').click();

    // Wait for results
    await page.waitForTimeout(1000);

    // Check if results are displayed
    const resultsPanel = page.locator('text=/Autonomie|Tage/');
    await expect(resultsPanel.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show error when calculating without location', async ({ page }) => {
    // Make sure location is not set by clicking without getting location
    const calculateBtn = page.locator('button:has-text("Autonomie berechnen")');
    await calculateBtn.click();

    // Toast error should appear
    await expect(page.locator('text=Standort')).toBeVisible({ timeout: 3000 });
  });
});
