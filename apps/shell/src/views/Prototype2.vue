<template>
  <div class="min-h-screen bg-sky-100 font-sans relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-10 left-10 text-white/40 text-9xl animate-float">☁️</div>
      <div class="absolute top-20 right-20 text-white/40 text-8xl animate-float" style="animation-duration: 4s">☁️</div>
      <div class="absolute bottom-10 left-20 text-white/40 text-8xl animate-float" style="animation-duration: 5s">☁️</div>
      <!-- Hills -->
      <div class="absolute bottom-0 left-0 right-0 h-48 bg-green-200 rounded-t-[50%] scale-150 translate-y-20"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 text-center py-8">
      <h1 class="text-4xl md:text-5xl font-black text-blue-600 drop-shadow-md bg-white/80 inline-block px-8 py-4 rounded-full border-4 border-blue-400">
        My Adventure Map 🗺️
      </h1>
    </header>

    <!-- Dynamic Map Container -->
    <div class="relative z-10 max-w-4xl mx-auto p-4" :style="{ minHeight: containerHeight + 'px' }">
      <!-- Path (SVG) -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none" :viewBox="`0 0 800 ${containerHeight}`" preserveAspectRatio="none">
        <!-- Main Path -->
        <path :d="pathData" 
              fill="none" stroke="#FDE68A" stroke-width="60" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Dotted Line -->
        <path :d="pathData" 
              fill="none" stroke="#F59E0B" stroke-width="4" stroke-dasharray="15 15" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- Game Stations -->
      <div v-for="(game, index) in games" :key="game.id"
           class="absolute flex flex-col items-center group transition-transform duration-300 hover:z-30"
           :style="{ left: getPosition(index).x + '%', top: getPosition(index).y + 'px', transform: 'translate(-50%, -50%)' }">
        
        <router-link :to="game.path" 
          class="w-28 h-28 md:w-32 md:h-32 rounded-full border-8 border-white shadow-card flex items-center justify-center transform transition-transform group-hover:scale-110 cursor-pointer z-20 bg-gradient-to-br"
          :class="game.bgGradient">
          <span class="text-5xl group-hover:animate-bounce">{{ game.icon }}</span>
        </router-link>
        
        <div class="mt-2 bg-white px-4 py-2 rounded-xl shadow-md font-bold text-gray-700 text-lg border-2 border-gray-100 z-20 group-hover:scale-105 transition-transform whitespace-nowrap">
          {{ game.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { games } from '../data/games';

// Configuration for spacing
const startY = 100;
const stepY = 200; // Vertical distance between stations
const amplitude = 30; // Horizontal swing (percentage)
const centerX = 50; // Center percentage

const containerHeight = computed(() => startY + (games.length * stepY) + 100);

// Generate path data string
const pathData = computed(() => {
  if (games.length === 0) return '';
  
  let d = `M ${centerX * 8} ${startY - 50}`; // Start slightly above first point (scaled to viewBox 800 width)
  
  // Create a winding path through all points
  for (let i = 0; i < games.length; i++) {
    const pos = getPosition(i);
    // Convert percentage x to viewBox x (800 width)
    const x = pos.x * 8;
    const y = pos.y;
    
    // Use quadratic curves for smooth winding
    // Control point logic: alternating left/right pulls
    // Logic: Connect to (x, y)
    // First point just line to
    if (i === 0) {
      d += ` L ${x} ${y}`;
    } else {
      const prevPos = getPosition(i - 1);
      const prevX = prevPos.x * 8;
      const prevY = prevPos.y;
      
      const cpY = (prevY + y) / 2;
      // Heuristic control point X: push it out further than the curve for more 'sway'
      // If going left to right vs right to left
      const direction = x > prevX ? 1 : -1;
      const cpX = (prevX + x) / 2 + (direction * 100); 

      d += ` Q ${cpX} ${cpY} ${x} ${y}`;
    }
  }
  
  // Extend path a bit after last node
  const lastPos = getPosition(games.length - 1);
  d += ` L ${lastPos.x * 8} ${lastPos.y + 100}`;
  
  return d;
});

function getPosition(index: number) {
  // Zig-zag pattern: Center -> Right -> Left -> Right...
  // 0: Center, 1: Right, 2: Left, 3: Right...
  let x = centerX;
  if (index % 2 !== 0) x += (index % 4 === 1 ? amplitude : -amplitude);
  else x = index === 0 ? centerX : (index % 4 === 0 ? centerX - 10 : centerX + 10); // Add some variation to center points

  // Actually, sine wave is smoother.
  // Let's map index to angle.
  // 0 -> 0, 1 -> PI/2, 2 -> PI, 3 -> 3PI/2...
  // x = 50 + 30 * sin(index * 1.5)
  const angle = index * 2; // Tweak frequency
  const sineX = 50 + 35 * Math.sin(angle);

  return {
    x: sineX, 
    y: startY + (index * stepY)
  };
}
</script>
