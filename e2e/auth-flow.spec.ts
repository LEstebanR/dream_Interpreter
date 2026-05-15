import { test, expect } from '@playwright/test';

// Unique per test run to avoid conflicts across CI runs
const timestamp = Date.now();
const TEST_EMAIL = `e2e-flow-${timestamp}@example.com`;
const TEST_PASSWORD = 'FlowTest123!';
const TEST_NAME = 'Flow Tester';

test.describe('Auth flow', () => {
  // Seed the test user via API before any UI tests run.
  // The sign-up form's auto-login (signIn without redirect:false) is unreliable
  // in NextAuth v5 beta under Playwright headless — we test the register endpoint
  // directly and focus UI tests on sign-in and sign-out, which use redirect:false.
  test.beforeAll(async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    // 201 = created, 409 = already exists from a previous retry — both acceptable
    expect([201, 409]).toContain(res.status());
  });

  test('user can register with email and password', async ({ request }) => {
    const uniqueEmail = `e2e-register-${timestamp}@example.com`;
    const res = await request.post('/api/auth/register', {
      data: { name: TEST_NAME, email: uniqueEmail, password: TEST_PASSWORD },
    });
    expect(res.status()).toBe(201);
  });

  test('user can sign in with email and password', async ({ page }) => {
    await page.goto('/es/sign-in');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/es$/, { timeout: 15_000 });
  });

  test('signed-in user can sign out', async ({ page }) => {
    await page.goto('/es/sign-in');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/es$/, { timeout: 15_000 });

    await page.locator('button[aria-label="Mi perfil"]').click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();

    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator('button[aria-label="Mi perfil"]')).not.toBeVisible();
  });
});
