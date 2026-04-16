import { test, expect } from '@playwright/test';

async function playPerfectRun(page: any) {
  for (let i = 0; i < 10; i++) {
    const errorBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(errorBtn).toBeVisible();
    await errorBtn.click();
    // Wait for the celebration animation and transition
    await page.waitForTimeout(1300);
  }
}

test('Letter Flip Detective: load and complete a full run', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('link-letter-flip-detective').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  // Check instructions are visible
  const instructions = page.getByTestId('game-instructions');
  await expect(instructions).toBeVisible();
  await expect(instructions).toContainText('sneaky letter');

  await playPerfectRun(page);
  await expect(page.getByText(/Finished! Score 10\/10/)).toBeVisible({ timeout: 10000 });
});

test('Letter Flip Detective: shows hint after two wrong attempts', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('link-letter-flip-detective').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  // Find a wrong button (not the error)
  const wrongBtn = page.locator('[data-test="game-root"] button.letter-btn:not([data-error="true"])').first();
  
  // Click wrong twice
  await wrongBtn.click();
  await page.waitForTimeout(500);
  await wrongBtn.click();
  await page.waitForTimeout(500);

  // Hint should now be visible
  const hintBox = page.locator('.hint-box');
  await expect(hintBox).toBeVisible();
  await expect(hintBox).toContainText('Hint');
});

test('Letter Flip Detective: mute button toggles audio state', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('link-letter-flip-detective').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  const muteBtn = page.locator('.mute-btn');
  await expect(muteBtn).toBeVisible();
  
  // Initially should show speaker icon
  await expect(muteBtn).toHaveText('🔊');
  
  // Click to mute
  await muteBtn.click();
  await expect(muteBtn).toHaveText('🔇');
  
  // Click to unmute
  await muteBtn.click();
  await expect(muteBtn).toHaveText('🔊');
});
