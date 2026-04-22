import { defineStore } from 'pinia';
import { calculateNextTimer } from '../utils/mathLogic';

export interface GameState {
  score: number;
  streak: number;
  maxStreak: number;
  level: number;
  timerMax: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;

  // Persisted state
  totalSessions: number;
  badges: string[];
  totalCorrectAllTime: number;

  // Audio state
  isMuted: boolean;
}

const LOCAL_STORAGE_KEY = 'mathblast_save';

export const useGameStore = defineStore('mathblast-game', {
  state: (): GameState => ({
    score: 0,
    streak: 0,
    maxStreak: 0,
    level: 1,
    timerMax: 8,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,

    totalSessions: 0,
    badges: [],
    totalCorrectAllTime: 0,

    isMuted: false,
  }),

  actions: {
    loadProgress() {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.totalSessions = parsed.totalSessions || 0;
          this.badges = parsed.badges || [];
          this.totalCorrectAllTime = parsed.totalCorrectAllTime || 0;
          this.isMuted = !!parsed.isMuted;
        } catch (e) {
          console.error('Failed to parse MathBlast save frame', e);
        }
      }
    },

    saveProgress() {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          totalSessions: this.totalSessions,
          badges: this.badges,
          totalCorrectAllTime: this.totalCorrectAllTime,
          isMuted: this.isMuted,
        }),
      );
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      this.saveProgress();
    },

    resetSession() {
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.level = 1;
      this.timerMax = 8;
      this.consecutiveCorrect = 0;
      this.consecutiveWrong = 0;
    },

    endSession() {
      this.totalSessions += 1;
      this.checkBadges();
      this.saveProgress();
    },

    answerCorrect(points: number) {
      this.score += points;
      this.streak += 1;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      this.consecutiveCorrect += 1;
      this.consecutiveWrong = 0;
      this.totalCorrectAllTime += 1;

      this.timerMax = calculateNextTimer(
        this.timerMax,
        true,
        this.consecutiveCorrect,
        this.consecutiveWrong,
      );

      // Scale level based on total correct in session
      if (this.level < 10 && this.score > this.level * 100) {
        this.level += 1;
      }

      this.checkBadges();
    },

    answerWrong() {
      this.streak = 0;
      this.consecutiveCorrect = 0;
      this.consecutiveWrong += 1;

      this.timerMax = calculateNextTimer(
        this.timerMax,
        false,
        this.consecutiveCorrect,
        this.consecutiveWrong,
      );
    },

    answerSpeedBonus() {
      this.awardBadge('Speed Demon');
    },

    awardBadge(badgeId: string) {
      if (!this.badges.includes(badgeId)) {
        this.badges.push(badgeId);
        this.saveProgress();
        // Dispatch an event so components can show modal
        window.dispatchEvent(new CustomEvent('mb-badge-unlocked', { detail: badgeId }));
      }
    },

    checkBadges() {
      if (this.totalCorrectAllTime >= 1) this.awardBadge('First Launch');
      if (this.maxStreak >= 5) this.awardBadge('Streak Rocket');
      if (this.score >= 500) this.awardBadge('Supernova');
      if (this.totalSessions >= 5) this.awardBadge('Explorer');
      if (this.level >= 10) this.awardBadge('Galaxy Brain');
    },
  },
});
