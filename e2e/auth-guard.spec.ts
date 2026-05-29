import { test, expect } from '@playwright/test';

test.describe('Auth route guard — unauthenticated redirects', () => {
  test('/es/journal redirects to /es/sign-in', async ({ page }) => {
    await page.goto('/es/journal');
    await expect(page).toHaveURL('/es/sign-in');
  });

  test('/es/profile redirects to /es/sign-in', async ({ page }) => {
    await page.goto('/es/profile');
    await expect(page).toHaveURL('/es/sign-in');
  });

  test('/es/billing redirects to /es/sign-in', async ({ page }) => {
    await page.goto('/es/billing');
    await expect(page).toHaveURL('/es/sign-in');
  });
});
