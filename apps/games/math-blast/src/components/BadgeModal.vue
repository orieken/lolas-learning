<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div class="modal-container w-full max-w-sm bg-gradient-to-b from-indigo-900 to-slate-900 p-8 rounded-[2rem] border-4 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.3)] relative text-center">
        
        <!-- Confetti wrapper -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.8rem]">
           <div class="w-full h-full animate-[confetti_1.5s_ease-out_forwards] font-serif text-2xl absolute -top-10 text-amber-300 flex justify-center space-x-10">
             <span>✨</span><span>✨</span><span>✨</span>
           </div>
        </div>

        <h3 class="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Badge Unlocked!</h3>
        
        <div class="w-32 h-32 mx-auto bg-slate-800 rounded-full border-4 border-indigo-400 flex items-center justify-center text-6xl shadow-inner mb-6 drop-shadow-xl relative">
          <!-- Icon placeholder for badges -->
          <span>🏆</span>
        </div>
        
        <h2 class="text-3xl font-black text-white mb-2">{{ badgeName }}</h2>
        <p class="text-indigo-200 mb-8">{{ badgeDescription }}</p>
        
        <button 
          @click="close"
          class="w-full py-4 rounded-xl font-bold text-xl bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const isOpen = ref(false);
const badgeName = ref('');
const badgeDescription = ref('');

const BADGES: Record<string, string> = {
  'First Launch': 'Complete your first question ever.',
  'Streak Rocket': 'Get a 5-answer streak.',
  'Speed Demon': 'Answer in under 2 seconds!',
  'Supernova': 'Score 500+ points in one session.',
  'Explorer': 'Play 5 total sessions.',
  'Galaxy Brain': 'Reach difficulty level 10.',
};

const store = useGameStore();

function handleUnlock(e: Event) {
  const customEvent = e as CustomEvent<string>;
  const id = customEvent.detail;
  badgeName.value = id;
  badgeDescription.value = BADGES[id] || 'You earned a new badge!';
  
  if (!store.isMuted) {
    // Play fanfare chime logic if audio available
  }
  
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

onMounted(() => {
  window.addEventListener('mb-badge-unlocked', handleUnlock);
});

onUnmounted(() => {
  window.removeEventListener('mb-badge-unlocked', handleUnlock);
});
</script>
