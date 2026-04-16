import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLayoutStore = defineStore('layout', () => {
  const currentLayout = ref<'home' | 'cards' | 'map' | 'buttons'>('home');

  function setLayout(layout: 'home' | 'cards' | 'map' | 'buttons') {
    currentLayout.value = layout;
  }

  return {
    currentLayout,
    setLayout,
  };
});
