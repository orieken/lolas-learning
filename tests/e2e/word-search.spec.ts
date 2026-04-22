import { test, expect } from '@playwright/test';
import { findWordInGrid } from '../../apps/games/word-search/lib/generator';
import path from 'path';

// E2E: load the static HTML puzzle page and verify each word in the visible word-lists
// exists in the rendered grid using the shared solver.

test.describe('Word Search puzzles page', () => {
  const pagePath = path.resolve(__dirname, '../../apps/games/word-search/word_search_puzzles.html');
  const fileUrl = `file://${pagePath}`;

  test('every listed word is present in its grid', async ({ page }) => {
    await page.goto(fileUrl);
    // Wait for grids to render
    await page.waitForSelector('.puzzle-section');

    const sections = await page.$$('.puzzle-section');
    expect(sections.length).toBeGreaterThan(0);

    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const wordItems = await section.$$('.word-item');
      const words: string[] = [];
      for (const wi of wordItems) {
        const txt = (await wi.innerText()).trim();
        if (txt) words.push(txt.toUpperCase());
      }

      // build grid array from cells inside this section
      const cellEls = await section.$$('.grid .cell');
      const totalCells = cellEls.length;
      expect(totalCells).toBeGreaterThan(0);

      // Use fixed columns matching the template
      const cols = 12;
      const rows = Math.ceil(totalCells / cols);

      // build matrix
      const grid: string[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: string[] = [];
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (idx < totalCells) {
            const text = (await cellEls[idx].innerText()).trim();
            row.push(text.toUpperCase());
          } else {
            row.push('');
          }
        }
        grid.push(row);
      }

      // for each word, ensure solver finds at least one placement
      for (const word of words) {
        const placements = findWordInGrid(grid, word);
        expect(
          placements.length,
          `Word ${word} should be found in puzzle section ${si}`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
