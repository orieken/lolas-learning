import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '../settings';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import localForage from 'localforage';

vi.mock('localforage');

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    (localForage.getItem as any).mockResolvedValue({ sound: true, darkMode: false });
    (localForage.setItem as any).mockResolvedValue(undefined);
  });

  it('loads settings from localForage', async () => {
    (localForage.getItem as any).mockResolvedValue({ sound: false, darkMode: true });
    const store = useSettingsStore();
    await store.load();
    expect(store.sound).toBe(false);
    expect(store.darkMode).toBe(true);
  });

  it('sets sound and saves', async () => {
    const store = useSettingsStore();
    await store.load();
    store.setSound(false);
    expect(store.sound).toBe(false);
    expect(localForage.setItem).toHaveBeenCalledWith(
      'settings',
      expect.objectContaining({ sound: false }),
    );
  });

  it('sets dark mode and saves', async () => {
    const store = useSettingsStore();
    await store.load();
    store.setDarkMode(true);
    expect(store.darkMode).toBe(true);
    expect(localForage.setItem).toHaveBeenCalledWith(
      'settings',
      expect.objectContaining({ darkMode: true }),
    );
  });

  it('clears settings', async () => {
    const store = useSettingsStore();
    await store.load();
    store.setSound(false);
    store.setDarkMode(true);
    store.clear();
    expect(store.sound).toBe(true);
    expect(store.darkMode).toBe(false);
    expect(localForage.setItem).toHaveBeenCalledWith(
      'settings',
      expect.objectContaining({ sound: true, darkMode: false }),
    );
  });
});
