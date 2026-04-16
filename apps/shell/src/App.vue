<template>
  <!-- Game Layout -->
  <div v-if="isGameRoute" class="min-h-screen flex flex-col bg-gray-50">
    <GameHeader />
    <main class="flex-grow flex flex-col relative z-0">
      <router-view />
    </main>
    <GameFooter />
  </div>

  <!-- Standard/Home Layout -->
  <router-view v-else />

  <!-- Layout Switcher (Only visible on Home, or always accessible to switch preference) -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-2 bg-white/90 backdrop-blur rounded-xl shadow-2xl border border-gray-200">
    <div class="text-xs font-bold text-gray-500 px-2 uppercase tracking-wider">Shell Layout</div>
    <div class="flex gap-2">
      <button 
        @click="setLayout('home')"
        class="px-3 py-1 rounded text-sm font-medium transition-colors"
        :class="currentLayout === 'home' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'">
        Original
      </button>
      <button 
        @click="setLayout('cards')"
        class="px-3 py-1 rounded text-sm font-medium transition-colors"
        :class="currentLayout === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'">
        Cards
      </button>
      <button 
        @click="setLayout('map')"
        class="px-3 py-1 rounded text-sm font-medium transition-colors"
        :class="currentLayout === 'map' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'">
        Map
      </button>
       <button 
        @click="setLayout('buttons')"
        class="px-3 py-1 rounded text-sm font-medium transition-colors"
        :class="currentLayout === 'buttons' ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200'">
        Buttons
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLayoutStore } from './stores/layout';
import GameHeader from './components/GameHeader.vue';
import GameFooter from './components/GameFooter.vue';

const store = useLayoutStore();
const router = useRouter();
const route = useRoute();

const currentLayout = computed(() => store.currentLayout);
const isGameRoute = computed(() => route.path.startsWith('/game/'));

function setLayout(layout: 'home' | 'cards' | 'map' | 'buttons') {
  store.setLayout(layout);
  // If not on home, verify if we should redirect? 
  // For now, just setting preference. If on a game, it won't be visible until back to home.
  // Optionally redirect to home:
  if (route.path !== '/') {
    router.push('/');
  }
}
</script>
