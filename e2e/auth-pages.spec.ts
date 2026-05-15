import { test, expect } from '@playwright/test';
import path from 'path';

// Load the pre-authenticated session created by auth.setup.ts
test.use({ storageState: path.join(__dirname, '.auth/user.json') });

test.describe('Auth pages — authenticated redirect', () => {
  test('authenticated user visiting /es/sign-in is redirected to /es', async ({ page }) => {
    await page.goto('/es/sign-in');
    await expect(page).toHaveURL(/\/es$/);
  });

  test('authenticated user visiting /es/sign-up is redirected to /es', async ({ page }) => {
    await page.goto('/es/sign-up');
    await expect(page).toHaveURL(/\/es$/);
  });
});
