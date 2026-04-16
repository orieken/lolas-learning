<template>
  <div class="min-h-screen bg-gradient-to-b from-lolaPink via-lolaYellow to-lolaBlue text-gray-800">
    <header class="px-6 py-4 shadow-md bg-white/70 backdrop-blur-sm">
      <h1 class="text-2xl font-extrabold text-lolaPurple">Lola's Learning</h1>
    </header>
    <main class="container mx-auto p-6 space-y-6">
      <h1 data-test="shell-heading" class="text-3xl md:text-4xl font-black text-lolaPurple drop-shadow">Lola's Learning Shell</h1>
      <p class="text-lg">Welcome. Pick a colorful adventure:</p>
      <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <li v-for="game in games" :key="game.id">
          <router-link
            class="block rounded-xl p-4 text-center font-bold text-white bg-gradient-to-br hover:scale-[1.02] transition"
            :class="game.bgGradient"
            :to="game.path" :data-test="`link-${game.id}`">{{ game.name }}</router-link>
        </li>
      </ul>
      <div class="flex gap-4 pt-2">
        <router-link class="inline-block px-4 py-2 rounded-lg bg-white/80 shadow hover:shadow-md" to="/rewards" data-test="link-rewards">View Rewards</router-link>
        <router-link class="inline-block px-4 py-2 rounded-lg bg-white/80 shadow hover:shadow-md" to="/print" data-test="link-print">Print Center</router-link>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { games } from '../data/games';
</script>
