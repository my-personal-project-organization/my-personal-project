import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('My experiences');
  expect(await page.getByTestId('landing-skills').count()).toBe(10);
});
