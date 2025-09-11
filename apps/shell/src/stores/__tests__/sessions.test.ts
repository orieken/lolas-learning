import { setActivePinia, createPinia } from 'pinia';
import { useSessionsStore } from '../sessions';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import localForage from 'localforage';

vi.mock('localforage');

const mkSession = (id: string, gameId: string, startedAt: number, completedAt?: number) => ({
  id,
  gameId,
  startedAt,
  completedAt,
});

describe('sessions store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    (localForage.getItem as any).mockResolvedValue([]);
    (localForage.setItem as any).mockResolvedValue(undefined);
  });

  it('loads sessions from localForage', async () => {
    const s = mkSession('sess1', 'game1', Date.now());
    (localForage.getItem as any).mockResolvedValue([s]);
    const store = useSessionsStore();
    await store.load();
    expect(store.sessions[0]).toMatchObject(s);
  });

  it('adds and saves a session', async () => {
    const store = useSessionsStore();
    await store.load();
    const s = mkSession('sess2', 'game2', Date.now());
    store.addSession(s);
    expect(store.sessions.map(x => x.id)).toContain('sess2');
    expect(localForage.setItem).toHaveBeenCalledWith('sessions', expect.arrayContaining([expect.objectContaining({ id: 'sess2' })]));
  });

  it('filters sessions by game and computes latest', async () => {
    const store = useSessionsStore();
    await store.load();
    const s1 = mkSession('s1', 'g1', 1, 2);
    const s2 = mkSession('s2', 'g1', 3, 4);
    const s3 = mkSession('s3', 'g2', 5, 6);
    store.addSession(s1);
    store.addSession(s2);
    store.addSession(s3);
    const g1 = store.getByGame('g1');
    expect(g1.map(s => s.id)).toEqual(['s1','s2']);
    expect(store.latest?.id).toBe('s3');
  });

  it('clears sessions', async () => {
    const store = useSessionsStore();
    await store.load();
    store.addSession(mkSession('x','g',1));
    store.clear();
    expect(store.sessions).toEqual([]);
    expect(localForage.setItem).toHaveBeenCalledWith('sessions', []);
  });
});
