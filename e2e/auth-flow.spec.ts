import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const TEST_EMAIL = `e2e-flow-${timestamp}@test.local`;
const TEST_PASSWORD = 'FlowTest123!';
const TEST_NAME = 'Flow Tester';

test.describe('Auth flow', () => {
  test('user can register with email and password', async ({ page }) => {
    await page.goto('/es/sign-up');
    await page.locator('input[type="text"]').fill(TEST_NAME);
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Successful registration signs the user in and redirects to home
    await expect(page).toHaveURL(/\/es$/, { timeout: 15_000 });
  });

  test('user can sign in with email and password', async ({ page }) => {
    await page.goto('/es/sign-in');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/es$/, { timeout: 15_000 });
  });

  test('signed-in user can sign out', async ({ page }) => {
    // Sign in first
    await page.goto('/es/sign-in');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/es$/, { timeout: 15_000 });

    // Open user menu and sign out
    await page.locator('button[aria-label="Mi perfil"]').click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();

    // After sign-out the user is redirected to home (unauthenticated)
    await expect(page).toHaveURL(/\/es$/);
    // User menu is gone — unauthenticated state
    await expect(page.locator('button[aria-label="Mi perfil"]')).not.toBeVisible();
  });
});
