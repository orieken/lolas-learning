<template>
  <div class="min-h-screen bg-lola-bg p-6 font-sans">
    <!-- Header -->
    <header class="mb-8 text-center">
      <h1 class="text-4xl md:text-5xl font-black text-lolaPurple mb-2 drop-shadow-sm animate-float">
        Lola's Learning World
      </h1>
      <p class="text-xl text-gray-600 font-medium">Pick a game to start playing!</p>
    </header>

    <!-- Grid Layout -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <router-link 
        v-for="game in games" 
        :key="game.id"
        :to="game.path"
        class="group relative overflow-hidden rounded-3xl p-8 shadow-card transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br"
        :class="game.bgGradient">
        
        <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-xl"></div>
        <div class="absolute -left-4 -bottom-4 h-32 w-32 rounded-full bg-white/20 blur-xl"></div>
        
        <div class="relative z-10 flex flex-col items-center text-center">
          <div class="mb-4 text-6xl drop-shadow-md group-hover:animate-bounce">{{ game.icon }}</div>
          <h2 class="text-3xl font-black text-white tracking-wide mb-2">{{ game.name }}</h2>
          <p class="text-white/90 font-medium text-lg">{{ game.description }}</p>
          <div class="mt-4 px-6 py-2 bg-white/20 rounded-full text-white font-bold backdrop-blur-sm group-hover:bg-white group-hover:text-blue-500 transition-colors">
            Play Now
          </div>
        </div>
      </router-link>

    </div>
    
    <!-- Floating Bubbles Decoration -->
    <div class="fixed top-20 left-10 w-16 h-16 rounded-full bg-blue-300/20 animate-float pointer-events-none blur-sm"></div>
    <div class="fixed bottom-20 right-10 w-24 h-24 rounded-full bg-pink-300/20 animate-float pointer-events-none blur-sm" style="animation-delay: 1s"></div>
    <div class="fixed top-1/2 left-1/4 w-12 h-12 rounded-full bg-yellow-300/20 animate-float pointer-events-none blur-sm" style="animation-delay: 2s"></div>

  </div>
</template>
<script setup lang="ts">
import { games } from '../data/games';
</script>
