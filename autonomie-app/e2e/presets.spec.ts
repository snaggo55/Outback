import { test, expect } from '@playwright/test';

test.describe('Presets Feature', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
    await page.goto('/');
    await page.evaluateHandle(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should display empty presets initially', async ({ page }) => {
    await expect(page.locator('text=Keine Presets')).toBeVisible();
  });

  test('should save a new preset', async ({ page }) => {
    // Click "Neues Preset speichern" button
    const saveButton = page.locator('button:has-text("Neues Preset speichern")');
    await saveButton.click();

    // Fill in preset name
    const input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Test Preset');

    // Click Save
    const confirmButton = page.locator('button:has-text("Save")');
    await confirmButton.click();

    // Verify preset appears in list
    await expect(page.locator('text=Test Preset')).toBeVisible();
  });

  test('should load a preset', async ({ page }) => {
    // First, save a preset
    await page.locator('button:has-text("Neues Preset speichern")').click();
    const input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Load Test');
    await page.locator('button:has-text("Save")').click();

    // Change battery capacity
    const batteryInput = page.locator('input[type="number"]').first();
    await batteryInput.fill('300');

    // Load the preset
    const loadButton = page.locator('button:has-text("Load")');
    await loadButton.click();

    // Battery should be restored to original value (200)
    await expect(batteryInput).toHaveValue('200');
  });

  test('should delete a preset', async ({ page }) => {
    // Save a preset
    await page.locator('button:has-text("Neues Preset speichern")').click();
    const input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Delete Test');
    await page.locator('button:has-text("Save")').click();

    // Verify preset appears
    await expect(page.locator('text=Delete Test')).toBeVisible();

    // Delete the preset
    const deleteButton = page.locator('button:has-text("Delete")');
    await deleteButton.click();

    // Verify preset is removed
    await expect(page.locator('text=Delete Test')).not.toBeVisible();
    await expect(page.locator('text=Keine Presets')).toBeVisible();
  });

  test('should persist presets after page reload', async ({ page, context }) => {
    // Save a preset
    await page.locator('button:has-text("Neues Preset speichern")').click();
    const input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Persist Test');
    await page.locator('button:has-text("Save")').click();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify preset still exists
    await expect(page.locator('text=Persist Test')).toBeVisible();
  });

  test('should handle multiple presets', async ({ page }) => {
    // Save first preset
    await page.locator('button:has-text("Neues Preset speichern")').click();
    let input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Preset 1');
    await page.locator('button:has-text("Save")').click();

    // Save second preset
    await page.locator('button:has-text("Neues Preset speichern")').click();
    input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Preset 2');
    await page.locator('button:has-text("Save")').click();

    // Save third preset
    await page.locator('button:has-text("Neues Preset speichern")').click();
    input = page.locator('input[placeholder="Preset Name..."]');
    await input.fill('Preset 3');
    await page.locator('button:has-text("Save")').click();

    // Verify all presets are displayed
    await expect(page.locator('text=Preset 1')).toBeVisible();
    await expect(page.locator('text=Preset 2')).toBeVisible();
    await expect(page.locator('text=Preset 3')).toBeVisible();
  });
});
