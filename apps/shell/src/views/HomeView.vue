<template>
  <component :is="activeLayout" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutStore } from '../stores/layout';
import OriginalHome from '../components/OriginalHome.vue';
import Prototype1 from './Prototype1.vue';
import Prototype2 from './Prototype2.vue';
import Prototype3 from './Prototype3.vue';

const store = useLayoutStore();

const activeLayout = computed(() => {
  switch (store.currentLayout) {
    case 'cards': return Prototype1;
    case 'map': return Prototype2;
    case 'buttons': return Prototype3;
    default: return OriginalHome;
  }
});
</script>
