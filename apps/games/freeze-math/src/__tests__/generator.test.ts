import { describe, it, expect } from 'vitest';
import { makeLines, makeFacts } from '../generator';

describe('makeLines', () => {
  it('creates exactly one error per row', () => {
    const lines = makeLines([1, 30], { lines: 5, seed: 42 });
    for (const ln of lines) {
      expect(ln.items).toHaveLength(6);
      const wrong = ln.items[ln.errorIndex];
      expect(ln.items.filter((n) => n === wrong).length).toBe(1);
    }
  });
});

describe('makeFacts', () => {
  it('generates requested count with alternating + and -', () => {
    const facts = makeFacts(10, { seed: 2, max: 10 });
    expect(facts).toHaveLength(10);
    const plus = facts.filter((f) => f.op === '+').length;
    const minus = facts.filter((f) => f.op === '-').length;
    expect(Math.abs(plus - minus)).toBeLessThanOrEqual(1);
  });
  it('respects max constraint and non-negative subtraction', () => {
    const facts = makeFacts(25, { seed: 7, max: 12 });
    for (const f of facts) {
      if (f.op === '+') {
        expect(f.a + f.b).toBe(f.answer);
        expect(f.answer).toBeLessThanOrEqual(12);
      } else {
        expect(f.a - f.b).toBe(f.answer);
        expect(f.answer).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
