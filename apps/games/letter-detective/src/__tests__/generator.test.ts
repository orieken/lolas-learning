import { describe, it, expect } from 'vitest';
import { makeLetterLines } from '../generator';

function diffs(items: string[]) {
  const codes = items.map((c) => c.charCodeAt(0));
  return codes.slice(1).map((v, i) => v - codes[i]);
}

describe('makeLetterLines', () => {
  it('produces lines with exactly one error pattern', () => {
    const lines = makeLetterLines({ lines: 6, lineLength: 6, seed: 42 });
    for (const ln of lines) {
      const d = diffs(ln.items);
      if (ln.type === 'missing') {
        expect(d.filter((x) => x === 2).length).toBe(1);
        expect(d.filter((x) => x === 1).length).toBe(d.length - 1);
      } else if (ln.type === 'double') {
        expect(d.filter((x) => x === 0).length).toBe(1);
        expect(d.filter((x) => x === 2).length).toBe(1);
      } else {
        expect(d.filter((x) => x === -1).length).toBe(1);
        expect(d.filter((x) => x === 2).length).toBe(1);
      }
      expect(ln.errorIndex).toBeGreaterThanOrEqual(0);
      expect(ln.errorIndex).toBeLessThan(ln.items.length - 1);
    }
  });

  it('is deterministic with seed', () => {
    const a = makeLetterLines({ lines: 4, seed: 1 });
    const b = makeLetterLines({ lines: 4, seed: 1 });
    expect(b).toEqual(a);
  });
});

