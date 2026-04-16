<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Word Search</h2>
    <div id="mfe-slot" ref="slotRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
let mfe: any = null;
const slotRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  // import the mfe module from apps/games/word-search
  const mod = await import('../../../../apps/games/word-search/mfe');
  mfe = mod;
  if (mfe && slotRef.value) {
    await mfe.bootstrap();
    mfe.mount({ container: slotRef.value });
  }
});

onUnmounted(async () => {
  if (mfe && mfe.unmount) await mfe.unmount();
});
</script>

