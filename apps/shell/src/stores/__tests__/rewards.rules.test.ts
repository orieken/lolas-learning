import { setActivePinia, createPinia } from 'pinia';
import { useRewardsStore } from '../rewards';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import localForage from 'localforage';

vi.mock('localforage');

describe('rewards rule engine', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    (localForage.getItem as any).mockResolvedValue({ stars: 0, badges: [] });
    (localForage.setItem as any).mockResolvedValue(undefined);
  });

  it('adds 1 star for a perfect session (score 10)', async () => {
    const rewards = useRewardsStore();
    await rewards.load();
    rewards.processPerfectSession({ id: 's1', gameId: 'g', startedAt: Date.now(), score: 10 });
    expect(rewards.stars).toBe(1);
  });

  it('does not add star for non-perfect session', async () => {
    const rewards = useRewardsStore();
    await rewards.load();
    rewards.processPerfectSession({ id: 's1', gameId: 'g', startedAt: Date.now(), score: 9 });
    expect(rewards.stars).toBe(0);
  });

  it('earns detective-star badge every 5 stars', async () => {
    const rewards = useRewardsStore();
    await rewards.load();
    for (let i = 0; i < 5; i++) {
      rewards.processPerfectSession({ id: `s${i}`, gameId: 'g', startedAt: Date.now(), score: 10 });
    }
    expect(rewards.stars).toBe(5);
    expect(rewards.hasBadge('detective-star')).toBe(true);
  });
});

