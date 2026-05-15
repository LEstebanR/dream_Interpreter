import { test, expect } from '@playwright/test';

test.describe('i18n', () => {
  test('locale switcher changes URL from /es to /en', async ({ page }) => {
    await page.goto('/es');
    await page.locator('button[aria-label="Switch to English"]').click();
    await expect(page).toHaveURL(/\/en/);
  });

  test('locale switcher changes URL from /en to /es', async ({ page }) => {
    await page.goto('/en');
    await page.locator('button[aria-label="Cambiar a Español"]').click();
    await expect(page).toHaveURL(/\/es/);
  });

});
