import { expect, test } from '@playwright/test';

test('offline demo generates a starter app preview', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await expect(page.getByText('Portfolios & Resumes')).toBeVisible();
  await expect(page.getByText('Photographer Lightbox Showcase')).toBeVisible();

  await page.getByText('Photographer Lightbox Showcase').click();

  await expect(page.getByText('Loaded a matching offline demo template.')).toBeVisible({
    timeout: 8000,
  });
  await expect(page.locator('iframe[title="VibeCraft Sandbox Preview"]')).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
