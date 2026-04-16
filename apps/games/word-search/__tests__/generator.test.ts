import { describe, it, expect } from 'vitest';
import { generateGrid, findWordInGrid } from '../lib/generator';

function seededRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

describe('generateGrid basic placements', () => {
  it('places short words right and down by default', () => {
    const words = ['CAT', 'DOG'];
    const res = generateGrid(words, 5, 5, { random: seededRng(1), allowBackwards: false, allowDiagonal: false });
    expect(res.success).toBe(true);
    expect(res.placements.length).toBe(2);
    // grid contains letters (flatten rows)
    let letters = '';
    for (let r = 0; r < res.rows; r++) {
      for (let c = 0; c < res.cols; c++) letters += res.grid[r][c];
    }
    expect(letters.length).toBe(25);
  });

  it('respects allowBackwards and allowDiagonal options', () => {
    const words = ['ANT', 'EEL', 'BOAT'];
    const res = generateGrid(words, 6, 6, { random: seededRng(2), allowBackwards: true, allowDiagonal: true });
    expect(res.success).toBe(true);
    expect(res.placements.length).toBe(3);
  });

  it('returns failed list when word cannot be placed', () => {
    const long = ['THISWORDISTOOLONGTOFIT'];
    const res = generateGrid(long, 3, 3, { random: seededRng(3) });
    expect(res.success).toBe(false);
    expect(res.failed && res.failed.length > 0).toBe(true);
  });
});

describe('findWordInGrid solver', () => {
  it('finds horizontal words', () => {
    const grid = [
      ['C','A','T'],
      ['X','X','X'],
      ['D','O','G']
    ];
    const res1 = findWordInGrid(grid, 'cat');
    const res2 = findWordInGrid(grid, 'dog');
    expect(res1.length).toBeGreaterThan(0);
    expect(res2.length).toBeGreaterThan(0);
  });

  it('finds diagonal and backwards when present', () => {
    const grid = [
      ['A','B','C'],
      ['D','E','F'],
      ['G','H','I']
    ];
    // "AEI" diagonal down-right
    const diag = findWordInGrid(grid, 'AEI');
    expect(diag.length).toBeGreaterThan(0);
    const back = findWordInGrid(grid, 'CBA');
    expect(back.length).toBeGreaterThan(0);
  });
});
