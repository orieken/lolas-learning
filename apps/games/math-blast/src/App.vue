<template>
  <div class="math-blast-app min-h-[100dvh] w-full bg-slate-900 text-white font-sans overflow-hidden relative selection:bg-fuchsia-500 selection:text-white pb-safe">
    <!-- Starfield Background Layer -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-black">
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
    </div>
    
    <!-- Main content wrapper -->
    <div class="relative z-10 w-full h-full max-w-md mx-auto min-h-[100dvh] flex flex-col pt-safe">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// Font injected via shell or directly in index. We rely on Tailwind for font families if needed
</script>
