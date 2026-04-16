<template>
  <div class="h-full flex flex-col p-6">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-black text-white">Badges</h2>
      <router-link to="/" class="bg-slate-800 p-3 rounded-xl border border-indigo-500/30 text-white font-bold active:bg-slate-700 transition">Back</router-link>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 overflow-y-auto pb-8">
      <div 
        v-for="(desc, name) in BADGES" 
        :key="name"
        class="bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center border-2 transition-all"
        :class="store.badges.includes(name) ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-slate-700 opacity-60 grayscale'"
      >
        <div class="w-16 h-16 rounded-full border-4 border-indigo-400 mb-3 flex items-center justify-center text-3xl" :class="store.badges.includes(name) ? 'bg-amber-100' : 'bg-slate-900'">
           🏆
        </div>
        <h3 class="font-bold text-white mb-1 text-sm leading-tight">{{ name }}</h3>
        <p class="text-xs text-indigo-300" v-if="store.badges.includes(name)">{{ desc }}</p>
        <p class="text-xs text-slate-500 italic" v-else>Locked</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';

const store = useGameStore();

const BADGES: Record<string, string> = {
  'First Launch': 'Complete your first question ever.',
  'Streak Rocket': 'Get a 5-answer streak.',
  'Speed Demon': 'Answer in under 2 seconds!',
  'Supernova': 'Score 500+ points in one session.',
  'Explorer': 'Play 5 total sessions.',
  'Galaxy Brain': 'Reach difficulty level 10.',
};
</script>
