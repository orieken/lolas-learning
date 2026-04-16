<template>
  <div class="h-full flex flex-col items-center justify-center p-6 text-center">
    
    <div class="bg-slate-800/80 backdrop-blur-md p-8 rounded-[2rem] w-full max-w-sm border-2 border-indigo-500/50 shadow-2xl relative">
      <h2 class="text-4xl font-black text-white mb-2">Session Over</h2>
      
      <!-- Stars! -->
      <div class="flex justify-center gap-4 my-6 text-slate-700">
        <svg v-for="i in 3" :key="i" class="w-16 h-16 transition-all duration-700" :class="{ 'animate-[star-fill_0.5s_ease-out_forwards]': i <= starsEarned }" :style="{ animationDelay: `${i * 0.2}s` }" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <div class="space-y-4 mb-8">
        <div class="bg-slate-900 rounded-xl p-4 flex justify-between items-center border border-indigo-500/30">
          <span class="text-indigo-300 font-bold uppercase text-sm">Score</span>
          <span class="text-2xl font-black text-white">{{ store.score }}</span>
        </div>
        <div class="bg-slate-900 rounded-xl p-4 flex justify-between items-center border border-indigo-500/30">
          <span class="text-indigo-300 font-bold uppercase text-sm">Best Streak</span>
          <span class="text-2xl font-black text-white">{{ store.maxStreak }}</span>
        </div>
        <div class="bg-slate-900 rounded-xl p-4 flex justify-between items-center border border-indigo-500/30">
          <span class="text-indigo-300 font-bold uppercase text-sm">Level Reached</span>
          <span class="text-2xl font-black text-white">{{ store.level }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-3 mt-4">
         <router-link 
          to="/play" 
          class="block w-full py-4 rounded-xl font-bold text-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all"
        >
          Play Again
        </router-link>
        <router-link 
          to="/" 
          class="block w-full py-4 rounded-xl font-bold text-xl bg-slate-700 hover:bg-slate-600 text-white shadow-[0_4px_0_#334155] active:translate-y-1 active:shadow-none transition-all"
        >
          Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const store = useGameStore();

const starsEarned = computed(() => {
  if (store.score >= 1000) return 3;
  if (store.score >= 500) return 2;
  if (store.score >= 100) return 1;
  return 0;
});

onMounted(() => {
  store.endSession();
});
</script>
