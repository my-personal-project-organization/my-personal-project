import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Wait for h1 to have text content (ensures translation is applied)
  await expect(page.locator('h1')).toContainText('My experiences');

  // Verify landing skills count
  expect(await page.getByTestId('landing-skills').count()).toBe(10);
});
