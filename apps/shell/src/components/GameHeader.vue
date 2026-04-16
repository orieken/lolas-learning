<template>
  <header class="bg-indigo-600 text-white shadow-md p-4 flex items-center justify-between sticky top-0 z-50">
    <!-- Left: Home Button -->
    <router-link 
      to="/" 
      class="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors font-bold"
    >
      <span class="text-xl">🏠</span>
      <span class="hidden sm:inline">Home</span>
    </router-link>

    <!-- Center: Title (Optional, could be dynamic) -->
    <h1 class="text-xl font-bold tracking-wider hidden md:block">
      Lola's Learning
    </h1>

    <!-- Right: User Profile & Stats -->
    <div class="flex items-center gap-4">
      <!-- Stars -->
      <div v-if="rewardsStore.stars > 0" class="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/50">
        <span class="text-yellow-300 text-lg">⭐</span>
        <span class="font-bold text-yellow-100">{{ rewardsStore.stars }}</span>
      </div>

      <!-- User Card -->
      <div class="flex items-center gap-3 bg-indigo-700/50 px-3 py-1.5 rounded-xl border border-indigo-500/30">
        <div class="text-right hidden sm:block">
          <div class="text-sm font-bold leading-tight">{{ profileName }}</div>
          <div class="text-xs text-indigo-200">Level 1 Detective</div>
        </div>
        <div class="h-10 w-10 rounded-full bg-indigo-500 border-2 border-indigo-300 overflow-hidden flex items-center justify-center relative">
           <img 
            v-if="profileAvatar" 
            :src="profileAvatar" 
            alt="User Avatar" 
            class="h-full w-full object-cover"
          />
          <span v-else class="text-xl">👤</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProfilesStore } from '../stores/profiles';
import { useRewardsStore } from '../stores/rewards';

const profilesStore = useProfilesStore();
const rewardsStore = useRewardsStore();

const profileName = computed(() => profilesStore.selected?.name || 'Guest');
// Use a placeholder or the actual avatar if available. 
// Assuming avatar is a URL or base64 string. 
const profileAvatar = computed(() => profilesStore.selected?.avatar);

// Ensure stores are loaded (they should be from App.ts or Home, but good practice to check/load if needed, 
// though typically we expect them to be hydrated by the time we are in a game)
</script>
