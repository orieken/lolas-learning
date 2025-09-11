<template>
  <main class="space-y-6">
    <h1 data-test="shell-heading" class="text-3xl md:text-4xl font-black text-lolaPurple drop-shadow">Lola's Learning Shell</h1>
    <p class="text-lg">Welcome. Pick a colorful adventure:</p>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <li>
        <router-link
          class="block rounded-xl p-4 text-center font-bold text-white bg-gradient-to-br from-lolaBlue to-lolaPurple hover:scale-[1.02] transition"
          to="/game/freeze-math" data-test="link-freeze-math">Freeze Math</router-link>
      </li>
      <li>
        <router-link
          class="block rounded-xl p-4 text-center font-bold text-white bg-gradient-to-br from-lolaGreen to-lolaBlue hover:scale-[1.02] transition"
          to="/game/number-detective" data-test="link-number-detective">Number Detective</router-link>
      </li>
      <li>
        <router-link
          class="block rounded-xl p-4 text-center font-bold text-white bg-gradient-to-br from-lolaPink to-lolaYellow hover:scale-[1.02] transition"
          to="/game/letter-detective" data-test="link-letter-detective">Letter Detective</router-link>
      </li>
      <li>
        <router-link
          class="block rounded-xl p-4 text-center font-bold text-white bg-gradient-to-br from-lolaYellow to-orange-400 hover:scale-[1.02] transition"
          to="/game/word-detective" data-test="link-word-detective">Word Detective</router-link>
      </li>
    </ul>
    <div class="flex gap-4 pt-2">
      <router-link class="inline-block px-4 py-2 rounded-lg bg-white/80 shadow hover:shadow-md" to="/rewards" data-test="link-rewards">View Rewards</router-link>
      <router-link class="inline-block px-4 py-2 rounded-lg bg-white/80 shadow hover:shadow-md" to="/print" data-test="link-print">Print Center</router-link>
    </div>
  </main>
</template>
<script setup lang="ts"></script>
