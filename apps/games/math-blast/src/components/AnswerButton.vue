<template>
  <button 
    class="relative w-full h-[72px] sm:h-[80px] rounded-2xl font-bold text-2xl sm:text-3xl text-white shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.2)]"
    :class="[
      state === 'idle' ? 'bg-indigo-500 hover:bg-indigo-400' : '',
      state === 'correct' ? 'bg-emerald-500 animate-[burst_0.5s_ease-out_forwards] z-10' : '',
      state === 'wrong' ? 'bg-rose-500 animate-[shake_0.5s_ease-out_both]' : '',
      state === 'hidden' ? 'opacity-50 grayscale pointer-events-none' : ''
    ]"
    @click="handleClick"
    :disabled="state !== 'idle'"
    :aria-label="ariaLabel"
  >
    <!-- Icon for visual aid -->
    <span v-if="state === 'correct'" class="absolute left-4 top-1/2 -translate-y-1/2">🌟</span>
    <span v-if="state === 'wrong'" class="absolute left-4 top-1/2 -translate-y-1/2">❌</span>
    
    <span class="drop-shadow-md">{{ value }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  correctValue: number;
  expression: string;
  isRevealed: boolean;
  clickedValue: number | null;
}>();

const emit = defineEmits<{
  (e: 'answer', value: number): void
}>();

const ariaLabel = computed(() => `Answer: ${props.value} for ${props.expression}`);

const state = computed(() => {
  if (!props.isRevealed) return 'idle';
  
  if (props.value === props.correctValue) {
    return 'correct';
  }
  if (props.clickedValue === props.value) {
    return 'wrong';
  }
  return 'hidden';
});

function handleClick() {
  if (props.isRevealed) return;
  emit('answer', props.value);
}
</script>
