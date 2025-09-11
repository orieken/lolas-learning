import { describe, it, expect } from 'vitest';
import { makeWordSets } from '../generator';

describe('makeWordSets', () => {
  it('creates lines with exactly one odd element per row', () => {
    const lines = makeWordSets({ lines: 6, seed: 99 });
    for (const ln of lines) {
      expect(ln.items).toHaveLength(6);
      // Exactly one index matches oddIndex, and that word should be unique within the row most of the time
      expect(ln.items[ln.oddIndex]).toBeDefined();
      // sanity: the odd word should appear only once
      const odd = ln.items[ln.oddIndex];
      expect(ln.items.filter((w) => w === odd).length).toBe(1);
    }
  });

  it('is deterministic with the same seed', () => {
    const a = makeWordSets({ lines: 4, seed: 7 });
    const b = makeWordSets({ lines: 4, seed: 7 });
    expect(b).toEqual(a);
  });
});
