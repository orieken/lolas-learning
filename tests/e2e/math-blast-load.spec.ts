import { test, expect } from '@playwright/test';

test.describe('MathBlast', () => {
  test('Play a game and unlock First Launch badge', async ({ page }) => {
    // We navigate to shell root
    await page.goto('/#/');
    
    // Find MathBlast link and click it
    await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 10000 });
    const link = page.getByTestId('link-math-blast');
    await expect(link).toBeVisible();
    await link.click();

    // In MathBlast home view
    const playBtn = page.getByTestId('play-btn');
    await expect(playBtn).toBeVisible({ timeout: 10000 });
    await playBtn.click();
    
    // In game view
    // Since math options are random, we evaluate the expression and find the correct button.
    const exprText = await page.locator('h2').first().innerText();
    const match = exprText.match(/(\d+)\s*([+-])\s*(\d+)/);
    
    if (match) {
      const a = parseInt(match[1]);
      const op = match[2];
      const b = parseInt(match[3]);
      
      const correctAns = op === '+' ? a + b : a - b;
      
      // Click the correct answer
      const correctBtn = page.getByLabel(`Answer: ${correctAns} for ${exprText.trim()}`);
      await expect(correctBtn).toBeVisible();
      await correctBtn.click();
      
      // Since it's correct and it's our first answer, we get "First Launch" badge
      const modal = page.locator('.modal-container');
      await expect(modal).toBeVisible();
      await expect(modal).toContainText('First Launch');
      
      // Close modal
      await page.getByRole('button', { name: 'Awesome!' }).click();
      await expect(modal).toBeHidden();
    }
  });
});
