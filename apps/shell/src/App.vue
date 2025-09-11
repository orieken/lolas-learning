<template>
  <div class="min-h-screen bg-gradient-to-b from-lolaPink via-lolaYellow to-lolaBlue text-gray-800">
    <header class="px-6 py-4 shadow-md bg-white/70 backdrop-blur-sm">
      <h1 class="text-2xl font-extrabold text-lolaPurple">Lola's Learning</h1>
    </header>
    <main class="container mx-auto p-6">
      <router-view />
    </main>
  </div>
</template>
<script setup lang="ts"></script>

