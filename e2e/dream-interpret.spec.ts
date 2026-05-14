import { test, expect } from '@playwright/test';

test.describe('Dream interpretation — anonymous', () => {
  test('anonymous user can type a dream and receive an interpretation', async ({ page }) => {
    test.skip(!process.env.OPENROUTER_API_KEY, 'requires OPENROUTER_API_KEY — skipped in CI without the secret');
    await page.goto('/es');

    const textarea = page.locator('textarea[aria-label="Describe tu sueño aquí..."]');
    await expect(textarea).toBeVisible();

    await textarea.fill('Soñé que volaba sobre un océano infinito al atardecer.');

    const sendButton = page.locator('button[aria-label="Interpretar sueño"]');
    await sendButton.click();

    // The interpretation card should appear (allow up to 60s for the AI API call)
    await expect(
      page.locator('.rounded-2xl.border.border-primary\\/20')
    ).toBeVisible({ timeout: 60_000 });
  });
});
