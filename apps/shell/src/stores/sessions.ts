// filepath: /Users/oscarrieken/Projects/Rieken/lolas-learning/apps/shell/src/stores/sessions.ts
import { defineStore } from 'pinia';
import localForage from 'localforage';
import { Session } from '@lolas/core-sdk';

export type SessionsState = {
  sessions: Session[];
  loading: boolean;
};

export const useSessionsStore = defineStore('sessions', {
  state: (): SessionsState => ({
    sessions: [],
    loading: false,
  }),
  getters: {
    sessionCount: (state) => state.sessions.length,
    getByGame: (state) => (gameId: string) => state.sessions.filter((s) => s.gameId === gameId),
    latest: (state) =>
      [...state.sessions].sort(
        (a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt),
      )[0],
  },
  actions: {
    async load() {
      this.loading = true;
      const data = await localForage.getItem<Session[]>('sessions');
      this.sessions = data || [];
      this.loading = false;
    },
    async save() {
      await localForage.setItem('sessions', this.sessions);
    },
    addSession(session: Session) {
      this.sessions.push(session);
      this.save();
    },
    clear() {
      this.sessions = [];
      this.save();
    },
  },
});
