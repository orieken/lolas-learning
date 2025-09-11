// filepath: /Users/oscarrieken/Projects/Rieken/lolas-learning/apps/games/freeze-math/src/__tests__/timer.test.ts
import { describe, it, expect, vi } from 'vitest';
import { PausableTimer } from '../timer';

describe('PausableTimer', () => {
  it('tracks elapsed, pauses and resumes without counting paused time', () => {
    vi.useFakeTimers();
    const samples: number[] = [];
    const t = new PausableTimer((ms) => samples.push(ms), 100);
    t.start();
    vi.advanceTimersByTime(350); // ~3-4 ticks
    t.pause();
    const pausedAt = t.getElapsed();
    vi.advanceTimersByTime(1000); // should not advance while paused
    expect(t.getElapsed()).toBeCloseTo(pausedAt, 5);
    t.resume();
    vi.advanceTimersByTime(500);
    const afterResume = t.getElapsed();
    expect(afterResume).toBeGreaterThan(pausedAt + 300); // at least a few ticks more
    t.stop();
    vi.useRealTimers();
  });
});
