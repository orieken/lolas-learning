import { test, expect } from '@playwright/test';

async function playPerfectRun(page: any) {
  for (let i = 0; i < 10; i++) {
    const oddBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(oddBtn).toBeVisible();
    await oddBtn.click();
  }
}

test('Word Detective: load and complete a full run', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('link-word-detective').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  await playPerfectRun(page);
  await expect(page.getByText(/Finished! Score 10\/10/)).toBeVisible({ timeout: 10000 });
});

class MyClass {
  a: number;
  b: number;
  c: number;

  constructor(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  sum(): number {
    return this.a + this.b + this.c;
  }

  getImmutableCopy(): MyClass {
    // return readonly version of my class
  }

  isMutable(): boolean {}
}

const x = new MyClass(1, 2, 3);

x.isMutable();
