(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://127.0.0.1:5173/index.html');
    await page.waitForSelector('.grid .cell');
    const cells = await page.$$('.grid .cell');
    if (!cells || cells.length === 0) throw new Error('No cells found');
    await cells[0].click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'wordsearch-click.png', fullPage: true });
    console.log('Clicked first cell and saved screenshot wordsearch-click.png');
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
  await browser.close();
})();
