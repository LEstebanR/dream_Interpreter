import { test, expect } from '@playwright/test';

test.describe('Navigation & 404', () => {
  test('/es/nonexistent renders 404 within locale layout — header visible', async ({ page }) => {
    await page.goto('/es/nonexistent');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('/en/nonexistent renders 404 within locale layout — header visible', async ({ page }) => {
    await page.goto('/en/nonexistent');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('/nonexistent-root renders with styles (redirects through locale)', async ({ page }) => {
    await page.goto('/nonexistent-root');
    // next-intl redirects non-locale paths to the default locale prefix
    await expect(page.locator('body')).toBeVisible();
    const bodyHTML = await page.locator('body').innerHTML();
    expect(bodyHTML.length).toBeGreaterThan(200);
  });
});
