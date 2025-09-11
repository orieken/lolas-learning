import { describe, it, expect } from 'vitest';
import { makeNumberLines, type NumberLine } from '../generator';

function analyzeDiffs(items: number[]) {
  const diffs = items.slice(1).map((v, i) => v - items[i]);
  const stats = diffs.reduce(
    (acc, d) => {
      acc.counts[d] = (acc.counts[d] ?? 0) + 1;
      return acc;
    },
    { counts: {} as Record<number, number> },
  );
  return { diffs, stats };
}

describe('makeNumberLines()', () => {
  it('returns requested number of lines with default length and exactly one error per line (by type)', () => {
    const lines = makeNumberLines([1, 50], { lines: 9, seed: 123 });
    expect(lines).toHaveLength(9);
    for (const ln of lines) {
      expect(ln.items).toHaveLength(6);
      const { diffs, stats } = analyzeDiffs(ln.items);
      // base should be length-1 diffs
      expect(diffs.length).toBe(ln.items.length - 1);
      if (ln.type === 'missing') {
        // exactly one jump of +2, no 0 or negative
        expect(stats.counts[2]).toBe(1);
        expect(stats.counts[0] ?? 0).toBe(0);
        // all others should be +1
        const ones = stats.counts[1] ?? 0;
        expect(ones).toBe(diffs.length - 1);
      } else if (ln.type === 'double') {
        // pattern 0 then 2 around errorIndex
        expect(stats.counts[0]).toBe(1);
        expect(stats.counts[2]).toBe(1);
        // others are +1
        const ones = stats.counts[1] ?? 0;
        expect(ones).toBe(diffs.length - 2);
      } else if (ln.type === 'order') {
        // pattern -1 then 2 around errorIndex
        expect(stats.counts[-1]).toBe(1);
        expect(stats.counts[2]).toBe(1);
        const ones = stats.counts[1] ?? 0;
        expect(ones).toBe(diffs.length - 2);
      }
      // errorIndex must be in range [0, items.length-2]
      expect(ln.errorIndex).toBeGreaterThanOrEqual(0);
      expect(ln.errorIndex).toBeLessThan(ln.items.length - 1);
    }
  });

  it('is deterministic given a seed', () => {
    const a = makeNumberLines([5, 100], { lines: 6, seed: 777 });
    const b = makeNumberLines([5, 100], { lines: 6, seed: 777 });
    expect(b).toEqual(a);
  });

  it('respects custom lineLength and lines', () => {
    const lines = makeNumberLines([10, 200], { lines: 3, lineLength: 8, seed: 9 });
    expect(lines).toHaveLength(3);
    lines.forEach((ln) => expect(ln.items).toHaveLength(8));
  });

  it('throws on invalid inputs', () => {
    expect(() => makeNumberLines([10, 9] as any)).toThrow(/min < max/);
    expect(() => makeNumberLines([NaN as any, 10] as any)).toThrow(/finite/);
    expect(() => makeNumberLines([1, 10], { lines: 0 })).toThrow(/positive integer/);
    expect(() => makeNumberLines([1, 10], { lineLength: 2 })).toThrow(/>= 3/);
    // range too small for given lineLength
    expect(() => makeNumberLines([1, 7], { lineLength: 6 })).toThrow(/range too small/);
  });

  it('positions the error at reported errorIndex', () => {
    const lines = makeNumberLines([1, 90], { lines: 6, seed: 42 });
    for (const ln of lines) {
      const { diffs } = analyzeDiffs(ln.items);
      if (ln.type === 'missing') {
        expect(diffs[ln.errorIndex]).toBe(2);
      } else if (ln.type === 'double') {
        expect(diffs[ln.errorIndex]).toBe(0);
      } else {
        expect(diffs[ln.errorIndex]).toBe(-1);
      }
    }
  });
});
