<template>
  <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-12">
    <!-- Title -->
    <div class="space-y-4">
      <h1 class="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
        Math<br>Blast
      </h1>
      <p class="text-indigo-200 font-bold text-xl uppercase tracking-widest">A Space Adventure!</p>
    </div>

    <!-- Main Navigation -->
    <div class="w-full max-w-sm space-y-4">
      <router-link 
        to="/play" 
        class="block w-full py-5 rounded-2xl font-black text-2xl sm:text-3xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_6px_0_#065f46] active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all"
        data-test="play-btn"
      >
        PLAY
      </router-link>
      
      <div class="grid grid-cols-2 gap-4">
        <router-link 
          to="/modes" 
          class="bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold text-xl shadow-[0_4px_0_#3730a3] active:translate-y-1 active:shadow-none transition-all"
        >
          Modes
        </router-link>
        
        <router-link 
          to="/badges" 
          class="bg-fuchsia-600 hover:bg-fuchsia-500 py-4 rounded-xl font-bold text-xl shadow-[0_4px_0_#86198f] active:translate-y-1 active:shadow-none transition-all relative"
        >
          Badges
          <span v-if="store.badges.length > 0" class="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900">
            {{ store.badges.length }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import { onMounted } from 'vue';

const store = useGameStore();

onMounted(() => {
  store.loadProgress();
});
</script>
