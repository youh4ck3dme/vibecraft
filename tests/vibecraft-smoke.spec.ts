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

test('code editor updates preview and flags risky html', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await page.getByText('Photographer Lightbox Showcase').click();
  await expect(page.getByText('Loaded a matching offline demo template.')).toBeVisible({
    timeout: 8000,
  });

  await page.getByRole('button', { name: /code view/i }).click();
  await page.getByLabel('Generated HTML code editor').fill(`<!DOCTYPE html>
<html lang="en">
<body>
  <h1>Manual Marker</h1>
  <button onclick="alert('test')">Unsafe button</button>
  <script src="https://example.com/evil.js"></script>
</body>
</html>`);

  await expect(page.getByText('Security Warning')).toBeVisible();
  await expect(page.getByText(/External script/)).toBeVisible();
  await expect(page.getByText(/Inline event handlers/)).toBeVisible();
  await expect(page.getByRole('button', { name: /save revision/i })).toBeVisible();

  await page.getByRole('button', { name: /save revision/i }).click();
  await expect(page.locator('span').filter({ hasText: /^MANUAL EDIT$/ })).toBeVisible();

  await page.getByRole('button', { name: /live preview/i }).click();
  await expect(page.frameLocator('iframe[title="VibeCraft Sandbox Preview"]').getByText('Manual Marker')).toBeVisible();
});

test('explain mode answers without replacing the current app', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await page.getByText('Photographer Lightbox Showcase').click();
  await expect(page.getByText('Loaded a matching offline demo template.')).toBeVisible({
    timeout: 8000,
  });
  await expect(page.locator('span').filter({ hasText: /^DEMO TEMPLATE$/ })).toBeVisible();

  await page.getByRole('button', { name: /^Explain$/ }).click();
  await page.getByRole('textbox').fill('What does this app do?');
  await page.getByRole('textbox').press('Enter');

  await expect(page.getByText(/Demo Offline Mode explanation/)).toBeVisible();
  await expect(page.locator('span').filter({ hasText: /^DEMO TEMPLATE$/ })).toBeVisible();
  await expect(page.locator('iframe[title="VibeCraft Sandbox Preview"]')).toBeVisible();
});
