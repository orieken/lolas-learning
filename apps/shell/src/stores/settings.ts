import { defineStore } from 'pinia';
import localForage from 'localforage';

export type SettingsState = {
  sound: boolean;
  darkMode: boolean;
  loading: boolean;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    sound: true,
    darkMode: false,
    loading: false,
  }),
  getters: {
    isDark: (state) => state.darkMode,
    isSoundOn: (state) => state.sound,
  },
  actions: {
    async load() {
      this.loading = true;
      const data = await localForage.getItem<Pick<SettingsState, 'sound' | 'darkMode'>>('settings');
      if (data) {
        this.sound = data.sound;
        this.darkMode = data.darkMode;
      }
      this.loading = false;
    },
    async save() {
      await localForage.setItem('settings', {
        sound: this.sound,
        darkMode: this.darkMode,
      });
    },
    setSound(on: boolean) {
      this.sound = on;
      this.save();
    },
    setDarkMode(on: boolean) {
      this.darkMode = on;
      this.save();
    },
    clear() {
      this.sound = true;
      this.darkMode = false;
      this.save();
    },
  },
});
