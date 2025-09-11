import { defineStore } from 'pinia';
import localForage from 'localforage';

export type Profile = {
  id: string;
  name: string;
  avatar?: string;
};

export type ProfilesState = {
  profiles: Profile[];
  selectedId?: string;
  loading: boolean;
};

export const useProfilesStore = defineStore('profiles', {
  state: (): ProfilesState => ({
    profiles: [],
    selectedId: undefined,
    loading: false,
  }),
  getters: {
    selected: (state) => state.profiles.find((p) => p.id === state.selectedId),
    profileCount: (state) => state.profiles.length,
  },
  actions: {
    async load() {
      this.loading = true;
      const data = await localForage.getItem<ProfilesState>('profiles');
      if (data) {
        this.profiles = data.profiles;
        this.selectedId = data.selectedId;
      }
      this.loading = false;
    },
    async save() {
      await localForage.setItem('profiles', {
        profiles: this.profiles,
        selectedId: this.selectedId,
        loading: false,
      });
    },
    addProfile(profile: Profile) {
      this.profiles.push(profile);
      this.save();
    },
    selectProfile(id: string) {
      this.selectedId = id;
      this.save();
    },
    clear() {
      this.profiles = [];
      this.selectedId = undefined;
      this.save();
    },
  },
});
