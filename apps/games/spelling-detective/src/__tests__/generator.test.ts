import { describe, it, expect } from 'vitest';
import { makeWordRound } from '../generator';

describe('makeWordRound', () => {
  it('returns requested count for each level', () => {
    const easy = makeWordRound('easy', { count: 5 });
    expect(easy.length).toBe(5);

    const medium = makeWordRound('medium', { count: 8 });
    expect(medium.length).toBe(8);

    const hard = makeWordRound('hard', { count: 10 });
    expect(hard.length).toBe(10);
  });

  it('is deterministic with same seed', () => {
    const round1 = makeWordRound('medium', { seed: 12345 });
    const round2 = makeWordRound('medium', { seed: 12345 });
    expect(round1).toEqual(round2);
  });

  it('misspelling always differs from correct word', () => {
    const rounds = makeWordRound('hard', { count: 20 });
    rounds.forEach((r) => {
      expect(r.misspelling).not.toEqual(r.correct);
      expect(r.misspelling.length).toBeGreaterThan(0);
    });
  });

  it('easy level uses only transposition, omission, or insertion', () => {
    const rounds = makeWordRound('easy', { count: 30 });
    const allowed = new Set(['transposition', 'omission', 'insertion']);
    rounds.forEach((r) => {
      expect(allowed.has(r.errorType)).toBe(true);
    });
  });

  it('medium level uses transposition and omission only', () => {
    const rounds = makeWordRound('medium', { count: 30 });
    const allowed = new Set(['transposition', 'omission']);
    rounds.forEach((r) => {
      expect(allowed.has(r.errorType)).toBe(true);
    });
  });

  it('dyslexia level uses substitution and transposition only', () => {
    const rounds = makeWordRound('dyslexia', { count: 30 });
    const allowed = new Set(['substitution', 'transposition']);
    rounds.forEach((r) => {
      expect(allowed.has(r.errorType)).toBe(true);
    });
  });

  it('hard level may use all error types', () => {
    const rounds = makeWordRound('hard', { count: 40 });
    const types = new Set(rounds.map((r) => r.errorType));
    // It's probabilistic, but over 40 it should hit multiple
    expect(types.size).toBeGreaterThan(2);
  });

  it('generated misspelling has same length ± 1 as correct word', () => {
    const rounds = makeWordRound('hard', { count: 20 });
    rounds.forEach((r) => {
      const diff = Math.abs(r.correct.length - r.misspelling.length);
      expect(diff).toBeLessThanOrEqual(1);
    });
  });

  it('throws if count exceeds available word bank size', () => {
    expect(() => {
      makeWordRound('easy', { count: 999 });
    }).toThrow(/count exceeds available/);
  });
});
