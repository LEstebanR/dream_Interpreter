import { test, expect } from '@playwright/test';

test.describe('Dream interpretation — anonymous', () => {
  test('anonymous user can type a dream and receive an interpretation', async ({ page }) => {
    // Prevent the onboarding modal from blocking UI — it checks localStorage on mount
    // with an 800ms delay, so we must set the key before the page executes any JS.
    await page.addInitScript(() => {
      localStorage.setItem('oniric-onboarding-seen', '1');
    });

    await page.goto('/es');

    const textarea = page.locator('textarea[aria-label="Describe tu sueño aquí..."]');
    await expect(textarea).toBeVisible();

    await textarea.fill('Soñé que volaba sobre un océano infinito al atardecer.');

    const sendButton = page.locator('button[aria-label="Interpretar sueño"]');
    await sendButton.click();

    // Allow up to 60s for the AI API call to complete and the interpretation to appear.
    await expect(
      page.locator('.rounded-2xl.border.border-primary\\/20')
    ).toBeVisible({ timeout: 60_000 });
  });
});
