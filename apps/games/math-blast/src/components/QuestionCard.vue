<template>
  <div class="w-full bg-slate-800 border-4 border-indigo-600/50 rounded-[2rem] p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] flex items-center justify-center min-h-[160px] relative overflow-hidden">
    <!-- Cosmetic Planet details -->
    <div class="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-600/20 rounded-full blur-xl"></div>
    <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-xl"></div>
    
    <h2 class="text-5xl sm:text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wide z-10 text-center">
      {{ expression }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  expression: string;
}>();
</script>
