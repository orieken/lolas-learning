import { defineStore } from 'pinia';
import localForage from 'localforage';
import type { Session } from '@lolas/core-sdk';

export type Badge = {
  id: string;
  earnedAt: number;
};

export type RewardsState = {
  stars: number;
  badges: Badge[];
  loading: boolean;
};

export const useRewardsStore = defineStore('rewards', {
  state: (): RewardsState => ({
    stars: 0,
    badges: [],
    loading: false,
  }),
  getters: {
    badgeCount: (state) => state.badges.length,
    hasBadge: (state) => (id: string) =>
      state.badges.some((b) => b.id === id),
  },
  actions: {
    async load() {
      this.loading = true;
      const data = await localForage.getItem<RewardsState>('rewards');
      if (data) {
        this.stars = data.stars;
        this.badges = data.badges;
      }
      this.loading = false;
    },
    async save() {
      await localForage.setItem('rewards', {
        stars: this.stars,
        badges: this.badges,
        loading: false,
      });
    },
    addStar() {
      this.stars++;
      this.save();
    },
    addBadge(id: string) {
      if (!this.hasBadge(id)) {
        this.badges.push({ id, earnedAt: Date.now() });
        this.save();
      }
    },
    clear() {
      this.stars = 0;
      this.badges = [];
      this.save();
    },
    // Rule engine: perfect session earns 1 star; every 5 stars earns 'detective-star' badge
    processPerfectSession(session: Session) {
      if (typeof session.score === 'number' && session.score === 10) {
        const prev = this.stars;
        this.addStar();
        const next = prev + 1;
        if (next % 5 === 0) {
          this.addBadge('detective-star');
        }
      }
    },
  },
});
