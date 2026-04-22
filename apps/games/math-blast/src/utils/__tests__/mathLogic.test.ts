import { describe, it, expect } from 'vitest';
import {
  generateQuestion,
  getNumberRangeForLevel,
  calculateScore,
  calculateNextTimer,
} from '../mathLogic';

describe('mathLogic Utilities', () => {
  it('getNumberRangeForLevel scales correctly', () => {
    expect(getNumberRangeForLevel(1)).toEqual([1, 10]);
    expect(getNumberRangeForLevel(5)).toEqual([1, 15]);
    expect(getNumberRangeForLevel(10)).toEqual([1, 20]);
  });

  it('generateQuestion produces correct output format and ±3 constraints', () => {
    const q = generateQuestion(5);
    expect(q.expression).toMatch(/^[0-9]+ [+-] [0-9]+ = \?$/);
    expect(q.options.length).toBe(4);
    expect(q.options.includes(q.correctAnswer)).toBe(true);

    const wrongOptions = q.options.filter((o) => o !== q.correctAnswer);
    wrongOptions.forEach((opt) => {
      const diff = Math.abs(opt - q.correctAnswer);
      expect(diff).toBeLessThanOrEqual(3);
      expect(diff).toBeGreaterThan(0);
      expect(opt).toBeGreaterThanOrEqual(0); // Ensure no negative options since questions only have pos answers
    });
  });

  it('calculateScore applies correct multipliers based on streak', () => {
    expect(calculateScore(0)).toBe(10);
    expect(calculateScore(2)).toBe(10);
    expect(calculateScore(3)).toBe(15);
    expect(calculateScore(5)).toBe(15);
    expect(calculateScore(6)).toBe(20);
    expect(calculateScore(10)).toBe(20);
  });

  it('calculateNextTimer clamps timer and scales with performance', () => {
    // Correct consecutive
    expect(calculateNextTimer(8, true, 3, 0)).toBe(7.5);
    expect(calculateNextTimer(8, true, 2, 0)).toBe(8);
    // Min clamp
    expect(calculateNextTimer(4, true, 3, 0)).toBe(4);

    // Wrong consecutive
    expect(calculateNextTimer(8, false, 0, 2)).toBe(8.5);
    expect(calculateNextTimer(8, false, 0, 1)).toBe(8);
    // Max clamp
    expect(calculateNextTimer(12, false, 0, 2)).toBe(12);
  });
});
