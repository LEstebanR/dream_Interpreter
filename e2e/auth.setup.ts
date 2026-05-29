import { test as setup, expect } from '@playwright/test';
import path from 'path';

export const AUTH_FILE = path.join(__dirname, '.auth/user.json');

const TEST_USER = {
  name: 'E2E Test User',
  email: 'e2e@example.com',
  password: 'TestPass123!',
};

setup('create authenticated session', async ({ page }) => {
  // Try to register — silently ignore if user already exists
  await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  }).catch(() => {});

  await page.goto('/es/sign-in');
  await page.locator('input[type="email"]').fill(TEST_USER.email);
  await page.locator('input[type="password"]').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/es$/, { timeout: 15_000 });

  await page.context().storageState({ path: AUTH_FILE });
});
