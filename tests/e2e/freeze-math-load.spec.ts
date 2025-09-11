import { test, expect, type Page } from '@playwright/test';

async function playPerfectRun(page: Page) {
  for (let i = 0; i < 10; i++) {
    const oddBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(oddBtn).toBeVisible();
    await oddBtn.click();
  }
}

test('FreezeMath: load and complete a full run', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('link-freeze-math').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  await playPerfectRun(page);
  await expect(page.getByText(/Finished! Score 10\/10/)).toBeVisible({ timeout: 10000 });
});
