// filepath: /Users/oscarrieken/Projects/Rieken/lolas-learning/tests/e2e/freeze-math-freeze-flow.spec.ts
import { test, expect } from '@playwright/test';

function parseSeconds(txt: string): number {
  return parseFloat(txt.replace(/s$/, ''));
}

test('FreezeMath: freeze overlay pauses timer and resume continues', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('link-freeze-math').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  const timer = page.getByTestId('timer-elapsed');
  await expect(timer).toBeVisible();
  // let timer run a little
  await page.waitForTimeout(600);
  const beforeFreeze = parseSeconds(await timer.textContent());

  await page.getByTestId('btn-freeze').click();
  const overlay = page.getByTestId('freeze-overlay');
  await expect(overlay).toBeVisible();

  // capture time shortly after freeze
  const frozenAt = parseSeconds(await timer.textContent());
  // wait while frozen (> breath sequence total 3s)
  await page.waitForTimeout(3100);
  const stillFrozen = parseSeconds(await timer.textContent());
  // time should not have advanced more than one displayed tick (0.2) while frozen
  expect(stillFrozen - frozenAt).toBeLessThan(0.21);

  // resume button should now be enabled
  const resumeBtn = page.getByTestId('btn-resume');
  await expect(resumeBtn).toBeEnabled();
  await resumeBtn.click();
  await expect(overlay).toBeHidden({ timeout: 1000 });

  // timer should advance again
  await page.waitForTimeout(600);
  const afterResume = parseSeconds(await timer.textContent());
  expect(afterResume).toBeGreaterThan(stillFrozen + 0.19);
});
