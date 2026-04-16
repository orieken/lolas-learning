import { describe, it, expect } from 'vitest';
import { makeFlipLines, getHintForPair, LETTER_PAIRS, type LetterPair } from '../generator';

describe('makeFlipLines', () => {
  it('creates the requested number of lines with correct structure', () => {
    const lines = makeFlipLines({ lines: 10, lineLength: 6, seed: 42 });
    
    expect(lines).toHaveLength(10);
    
    for (const line of lines) {
      expect(line.items).toHaveLength(6);
      expect(line.errorIndex).toBeGreaterThanOrEqual(0);
      expect(line.errorIndex).toBeLessThan(6);
      expect(['bd', 'pq', 'mw', 'nu']).toContain(line.pair);
      expect(line.dominant).toBeDefined();
      expect(line.sneaky).toBeDefined();
    }
  });

  it('places exactly one sneaky letter per line', () => {
    const lines = makeFlipLines({ lines: 8, seed: 123 });
    
    for (const line of lines) {
      const sneakyCount = line.items.filter(l => l === line.sneaky).length;
      const dominantCount = line.items.filter(l => l === line.dominant).length;
      
      expect(sneakyCount).toBe(1);
      expect(dominantCount).toBe(line.items.length - 1);
    }
  });

  it('places the sneaky letter at the reported errorIndex', () => {
    const lines = makeFlipLines({ lines: 12, seed: 999 });
    
    for (const line of lines) {
      expect(line.items[line.errorIndex]).toBe(line.sneaky);
    }
  });

  it('cycles through letter pairs', () => {
    const lines = makeFlipLines({ lines: 8, pairs: ['bd', 'pq'], seed: 50 });
    
    // With 2 pairs and 8 lines, each pair should appear 4 times
    const pairCounts = lines.reduce((acc, l) => {
      acc[l.pair] = (acc[l.pair] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    expect(pairCounts['bd']).toBe(4);
    expect(pairCounts['pq']).toBe(4);
  });

  it('is deterministic with the same seed', () => {
    const a = makeFlipLines({ lines: 6, seed: 777 });
    const b = makeFlipLines({ lines: 6, seed: 777 });
    
    expect(b).toEqual(a);
  });

  it('produces different results with different seeds', () => {
    const a = makeFlipLines({ lines: 5, seed: 100 });
    const b = makeFlipLines({ lines: 5, seed: 200 });
    
    // At least one line should be different
    const allSame = a.every((line, i) => 
      line.errorIndex === b[i].errorIndex && line.dominant === b[i].dominant
    );
    expect(allSame).toBe(false);
  });

  it('respects custom lineLength', () => {
    const lines = makeFlipLines({ lines: 3, lineLength: 8, seed: 42 });
    
    for (const line of lines) {
      expect(line.items).toHaveLength(8);
    }
  });

  it('allows filtering to specific pairs', () => {
    const lines = makeFlipLines({ lines: 5, pairs: ['bd'], seed: 42 });
    
    for (const line of lines) {
      expect(line.pair).toBe('bd');
      expect(['b', 'd']).toContain(line.dominant);
      expect(['b', 'd']).toContain(line.sneaky);
    }
  });

  it('throws on invalid inputs', () => {
    expect(() => makeFlipLines({ lines: 0 })).toThrow(/positive integer/);
    expect(() => makeFlipLines({ lines: -5 })).toThrow(/positive integer/);
    expect(() => makeFlipLines({ lineLength: 2 })).toThrow(/>= 3/);
    expect(() => makeFlipLines({ pairs: [] })).toThrow(/at least one/);
  });
});

describe('getHintForPair', () => {
  it('returns hints for all defined pairs', () => {
    const pairs: LetterPair[] = ['bd', 'pq', 'mw', 'nu'];
    
    for (const pair of pairs) {
      const hint = getHintForPair(pair);
      expect(hint).toBeTruthy();
      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(10);
    }
  });

  it('returns empty string for unknown pairs', () => {
    const hint = getHintForPair('xy' as LetterPair);
    expect(hint).toBe('');
  });
});

describe('LETTER_PAIRS', () => {
  it('has all expected pairs defined', () => {
    expect(LETTER_PAIRS.bd).toBeDefined();
    expect(LETTER_PAIRS.pq).toBeDefined();
    expect(LETTER_PAIRS.mw).toBeDefined();
    expect(LETTER_PAIRS.nu).toBeDefined();
  });

  it('each pair has two distinct letters', () => {
    for (const [key, value] of Object.entries(LETTER_PAIRS)) {
      expect(value.letters).toHaveLength(2);
      expect(value.letters[0]).not.toBe(value.letters[1]);
    }
  });

  it('each pair has a non-empty hint', () => {
    for (const value of Object.values(LETTER_PAIRS)) {
      expect(value.hint).toBeTruthy();
      expect(value.hint.length).toBeGreaterThan(0);
    }
  });
});
