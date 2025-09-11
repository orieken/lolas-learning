import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Number Detective: load, a11y check, and complete a full run', async ({ page }) => {
  page.on('console', (msg) => {
    // Surface console logs during CI debugging
    // eslint-disable-next-line no-console
    console.log(`[browser:${msg.type()}]`, msg.text());
  });

  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: /Lola's Learning Shell/i })).toBeVisible({ timeout: 15000 });

  // Navigate to game
  await page.getByTestId('link-number-detective').click();

  // Wait for game UI or error
  const gameRoot = page.getByTestId('game-root');
  const errorEl = page.getByTestId('remote-error');
  await page.waitForTimeout(500); // allow route transition
  const appeared = await Promise.race([
    gameRoot.waitFor({ state: 'visible', timeout: 20000 }).then(() => 'game' as const),
    errorEl.waitFor({ state: 'visible', timeout: 20000 }).then(() => 'error' as const),
  ]).catch(() => 'timeout' as const);
  if (appeared === 'error' || appeared === 'timeout') {
    const errText = appeared === 'error' ? await errorEl.textContent() : 'timeout waiting for game-root';
    throw new Error(`Remote load failed: ${errText}`);
  }

  // Axe a11y check on the game region only (do not fail test on violations yet)
  const results = await new AxeBuilder({ page })
    // limit analysis to the game root region
    .include('[data-test="game-root"]')
    .analyze();
  // Log violations but do not fail the test for now
  if (results.violations?.length) {
    // eslint-disable-next-line no-console
    console.warn(`[a11y] ${results.violations.length} violation(s) found`);
    for (const v of results.violations) {
      console.warn(`- ${v.id}: ${v.help}`);
    }
  }

  // Play through 10 lines by clicking the error button each time
  for (let i = 0; i < 10; i++) {
    const errorBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(errorBtn).toBeVisible();
    await errorBtn.click();
  }

  // Finished state and score
  await expect(page.getByText(/Finished! Score 10\/10/)).toBeVisible({ timeout: 10000 });
});
