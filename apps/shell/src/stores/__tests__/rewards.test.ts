// filepath: /Users/oscarrieken/Projects/Rieken/lolas-learning/apps/shell/src/stores/__tests__/rewards.test.ts
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { setActivePinia, createPinia } from 'pinia';
import { useRewardsStore } from '../rewards';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import localForage from 'localforage';

vi.mock('localforage');

describe('rewards store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    (localForage.getItem as any).mockResolvedValue({ stars: 0, badges: [] });
    (localForage.setItem as any).mockResolvedValue(undefined);
  });

  it('loads rewards from localForage', async () => {
    (localForage.getItem as any).mockResolvedValue({
      stars: 2,
      badges: [{ id: 'badge1', earnedAt: 123 }],
    });
    const store = useRewardsStore();
    await store.load();
    expect(store.stars).toBe(2);
    expect(store.badges).toEqual([{ id: 'badge1', earnedAt: 123 }]);
    expect(store.hasBadge('badge1')).toBe(true);
  });

  it('adds a star and saves', async () => {
    const store = useRewardsStore();
    await store.load();
    store.addStar();
    expect(store.stars).toBe(1);
    expect(localForage.setItem).toHaveBeenCalledWith(
      'rewards',
      expect.objectContaining({ stars: 1 }),
    );
  });

  it('adds a badge and saves only once', async () => {
    const store = useRewardsStore();
    await store.load();
    store.addBadge('badge2');
    store.addBadge('badge2');
    expect(store.badges.filter((b) => b.id === 'badge2').length).toBe(1);
    expect(store.hasBadge('badge2')).toBe(true);
  });

  it('clears rewards', async () => {
    const store = useRewardsStore();
    await store.load();
    store.addStar();
    store.addBadge('badge3');
    store.clear();
    expect(store.stars).toBe(0);
    expect(store.badges).toEqual([]);
    expect(localForage.setItem).toHaveBeenCalledWith(
      'rewards',
      expect.objectContaining({ stars: 0, badges: [] }),
    );
  });
});
