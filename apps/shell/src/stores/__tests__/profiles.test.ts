import { setActivePinia, createPinia } from 'pinia';
import { useProfilesStore } from '../profiles';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import localForage from 'localforage';

vi.mock('localforage');

const mockProfile = { id: 'p1', name: 'Lola', avatar: 'cat.png' };

describe('profiles store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    (localForage.getItem as any).mockResolvedValue({ profiles: [], selectedId: undefined });
    (localForage.setItem as any).mockResolvedValue(undefined);
  });

  it('loads profiles from localForage', async () => {
    (localForage.getItem as any).mockResolvedValue({ profiles: [mockProfile], selectedId: 'p1' });
    const store = useProfilesStore();
    await store.load();
    expect(store.profiles[0]).toMatchObject(mockProfile);
    expect(store.selectedId).toBe('p1');
  });

  it('adds a profile and saves', async () => {
    const store = useProfilesStore();
    await store.load();
    store.addProfile(mockProfile);
    expect(store.profiles.map(p => p.id)).toContain('p1');
    expect(localForage.setItem).toHaveBeenCalledWith('profiles', expect.objectContaining({ profiles: [mockProfile] }));
  });

  it('selects a profile and saves', async () => {
    const store = useProfilesStore();
    await store.load();
    store.addProfile(mockProfile);
    store.selectProfile('p1');
    expect(store.selectedId).toBe('p1');
    expect(localForage.setItem).toHaveBeenCalledWith('profiles', expect.objectContaining({ selectedId: 'p1' }));
  });

  it('clears profiles', async () => {
    const store = useProfilesStore();
    await store.load();
    store.addProfile(mockProfile);
    store.clear();
    expect(store.profiles).toEqual([]);
    expect(store.selectedId).toBeUndefined();
    expect(localForage.setItem).toHaveBeenCalledWith('profiles', expect.objectContaining({ profiles: [], selectedId: undefined }));
  });
});
