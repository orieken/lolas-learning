<template>
  <div class="hud-container w-full bg-slate-900/80 backdrop-blur-sm p-4 rounded-b-3xl border-b border-indigo-500/30 flex flex-col gap-3">
    
    <div class="flex justify-between items-center text-white">
      <!-- Player Stats -->
      <div class="flex flex-col">
        <span class="text-sm text-indigo-300 font-bold uppercase tracking-wider">Level {{ store.level }}</span>
        <span class="text-2xl font-black drop-shadow-md">{{ store.score }} <span class="text-amber-400 text-lg">pts</span></span>
      </div>

      <!-- Streak indicator -->
      <div class="flex items-center bg-indigo-950/80 rounded-full px-3 py-1 border border-indigo-500/50">
        <span class="text-xl mr-2" :class="store.streak >= 3 ? 'animate-bounce' : ''">🔥</span>
        <span class="font-bold text-lg" :class="store.streak >= 6 ? 'text-amber-400' : 'text-white'">{{ store.streak }}</span>
        <span class="ml-1 text-xs text-indigo-300 uppercase font-bold" v-if="multiplier > 1">x{{ multiplier }}</span>
      </div>

      <!-- Mute Button -->
      <button 
        @click="store.toggleMute()" 
        class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition"
        aria-label="Toggle sound"
      >
        <span class="text-2xl">{{ store.isMuted ? '🔇' : '🔊' }}</span>
      </button>
    </div>

    <!-- Timer Bar -->
    <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
      <div 
        class="h-full rounded-full transition-all duration-[100ms] ease-linear origin-left"
        :class="progressBarClass"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const props = defineProps<{
  timeLeft: number;
}>();

const store = useGameStore();

const progress = computed(() => {
  return Math.max(0, Math.min(100, (props.timeLeft / store.timerMax) * 100));
});

const multiplier = computed(() => {
  if (store.streak >= 6) return 2;
  if (store.streak >= 3) return 1.5;
  return 1;
});

const progressBarClass = computed(() => {
  if (progress.value > 50) return 'bg-emerald-400';
  if (progress.value > 25) return 'bg-amber-400';
  return 'bg-rose-500 animate-pulse';
});
</script>
