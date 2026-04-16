<template>
  <div class="h-full flex flex-col p-6">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-black text-white">Select Mode</h2>
      <router-link to="/" class="bg-slate-800 p-3 rounded-xl border border-indigo-500/30 text-white font-bold active:bg-slate-700 transition">Back</router-link>
    </div>

    <div class="flex flex-col gap-4">
      <router-link to="/play" class="bg-emerald-500 rounded-2xl p-6 text-slate-900 shadow-[0_4px_0_#065f46]">
        <h3 class="text-2xl font-black mb-1">Endless Mode</h3>
        <p class="font-bold opacity-80">Play until you want to stop! Difficulty increases automatically.</p>
      </router-link>

      <div class="bg-slate-800 rounded-2xl p-6 text-white border border-slate-700 opacity-70 relative overflow-hidden">
        <div class="absolute top-4 right-4 bg-amber-500 text-slate-900 text-xs font-black px-2 py-1 rounded uppercase">Coming Soon</div>
        <h3 class="text-2xl font-black mb-1 text-slate-400">Timed Round</h3>
        <p class="text-slate-500">Answer as many as you can before time runs out! (TODO)</p>
      </div>

      <div class="bg-slate-800 rounded-2xl p-6 text-white border border-slate-700 opacity-70 relative overflow-hidden">
        <div class="absolute top-4 right-4 bg-amber-500 text-slate-900 text-xs font-black px-2 py-1 rounded uppercase">Coming Soon</div>
        <h3 class="text-2xl font-black mb-1 text-slate-400">Campaign</h3>
        <p class="text-slate-500">Beat levels to explore the galaxy and unlock ships. (TODO)</p>
      </div>
    </div>
  </div>
</template>
