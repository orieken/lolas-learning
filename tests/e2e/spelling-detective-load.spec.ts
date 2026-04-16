import { test, expect } from '@playwright/test';

// Test 1: Easy level — load and complete a perfect run
test('Spelling Detective Easy: load, select level, complete full run', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });

  // Select easy level
  await page.getByTestId('level-btn-easy').click();

  // Play 10 rounds clicking the correct word each time
  for (let i = 0; i < 10; i++) {
    const correctBtn = page.locator('[data-test="game-root"] [data-error="true"]').first();
    await expect(correctBtn).toBeVisible({ timeout: 5000 });
    await correctBtn.click();
    await page.waitForTimeout(1300); // wait for auto-advance
  }

  await expect(page.getByTestId('done-screen')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/You got 10 out of 10/)).toBeVisible();
});

// Test 2: Medium level — timer bar is visible
test('Spelling Detective Medium: timer bar is visible', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('level-btn-medium').click();
  await expect(page.getByTestId('timer-bar')).toBeVisible();
});

// Test 3: Hard level — hint button absent
test('Spelling Detective Hard: no hint button', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('level-btn-hard').click();
  await expect(page.getByTestId('hint-btn')).not.toBeVisible();
});

// Test 4: Wrong answer shows difference highlight
test('Spelling Detective: wrong answer shows error highlight', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('level-btn-easy').click();
  // Click the wrong word
  const wrongBtn = page.locator('[data-test="game-root"] [data-error="false"]').first();
  await wrongBtn.click();
  await expect(page.getByTestId('feedback-message')).toContainText(/difference/i);
});
