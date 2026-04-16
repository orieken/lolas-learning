<template>
  <div class="min-h-screen bg-lola-bg p-6 font-sans relative">
    <!-- Geometric Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute top-10 left-10 w-32 h-32 rounded-full bg-lolaPink"></div>
      <div class="absolute bottom-20 right-10 w-48 h-48 bg-lolaYellow rotate-45"></div>
      <div class="absolute top-40 right-40 w-24 h-24 bg-lolaBlue rounded-lg rotate-12"></div>
      <div class="absolute bottom-40 left-20 w-36 h-36 bg-lolaGreen rounded-full"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 mb-10 pt-4 flex justify-between items-center max-w-6xl mx-auto">
      <div class="bg-white px-6 py-3 rounded-2xl shadow-button border-2 border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-lolaPink flex items-center justify-center text-white font-bold">L</div>
        <span class="text-xl font-bold text-slate-700">Lola's Dashboard</span>
      </div>
      <div class="flex gap-4">
        <div class="bg-white p-3 rounded-full shadow-button cursor-pointer hover:scale-105 transition-transform">⭐ 120</div>
        <div class="bg-white p-3 rounded-full shadow-button cursor-pointer hover:scale-105 transition-transform">⚙️</div>
      </div>
    </header>

    <!-- Buttons Grid -->
    <div class="relative z-10 max-w-5xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">
        
        <router-link
          v-for="(game, index) in games"
          :key="game.id"
          :to="game.path"
          class="rounded-[2rem] shadow-button active:shadow-button-active active:translate-y-1 transition-all group relative overflow-hidden flex flex-col items-center justify-center p-6 border-b-8"
          :class="getButtonStyles(index)">
           
           <div class="absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-75"
             :class="getGradientStyles(index)"></div>
          
          <div class="relative z-10 text-center">
            <span class="block mb-4 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
              :class="index === 0 ? 'text-8xl' : 'text-6xl'">{{ game.icon }}</span>
            <h2 class="font-black text-white uppercase tracking-wider"
              :class="index === 0 ? 'text-4xl lg:text-5xl' : 'text-2xl'">{{ game.name }}</h2>
            <div v-if="index === 0" class="mt-4 bg-white/20 text-white px-4 py-1 rounded-full text-lg font-bold inline-block">Recommended</div>
          </div>
        </router-link>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { games } from '../data/games';

function getButtonStyles(index: number) {
  if (index === 0) return 'col-span-1 md:col-span-2 row-span-2 bg-indigo-500 border-indigo-700';
  const i = index % 3;
  if (i === 0) return 'bg-orange-400 border-orange-600';
  if (i === 1) return 'bg-lolaPink border-pink-600';
  return 'bg-purple-500 border-purple-700';
}

function getGradientStyles(index: number) {
  if (index === 0) return 'from-indigo-400 to-indigo-600';
  const i = index % 3;
  if (i === 0) return 'from-orange-300 to-orange-500';
  if (i === 1) return 'from-pink-400 to-pink-500';
  return 'from-purple-400 to-purple-600';
}
</script>
