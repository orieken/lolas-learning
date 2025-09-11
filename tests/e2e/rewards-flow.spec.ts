import { test, expect } from '@playwright/test';

async function playPerfectRun(page: any) {
  await page.getByTestId('link-number-detective').click();
  // play through 10 error taps
  for (let i = 0; i < 10; i++) {
    const errorBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(errorBtn).toBeVisible();
    await errorBtn.click();
  }
  await expect(page.getByText(/Finished! Score 10\/10/)).toBeVisible({ timeout: 10000 });
  await page.getByTestId('link-home').click();
}

test('rewards: 5 perfect sessions award detective-star badge', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: /Lola's Learning Shell/i })).toBeVisible({
    timeout: 15000,
  });

  for (let i = 0; i < 5; i++) {
    await playPerfectRun(page);
  }

  await page.getByTestId('link-rewards').click();
  await expect(page.getByTestId('stars')).toContainText('Stars: 5');
  await expect(page.getByTestId('badges')).toContainText('detective-star');
});
