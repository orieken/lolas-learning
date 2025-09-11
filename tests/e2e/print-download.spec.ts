import { test, expect } from '@playwright/test';

test('printable download triggers a PDF file', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });

  // Go to Print Center
  await page.getByTestId('link-print').click();
  await expect(page.getByRole('heading', { name: /Print Center/i })).toBeVisible({
    timeout: 10000,
  });

  // Wait for browser download event while clicking the printable
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('print-detective-stars-sheet').click(),
  ]);

  const suggested = download.suggestedFilename();
  expect(suggested).toMatch(/detective-stars-sheet.*\.pdf$/);
});
