<template>
  <section>
    <h2>Print Center</h2>
    <ul data-test="print-list">
      <li v-for="p in list" :key="p.id">
        <span class="title">{{ p.title }}</span>
        <button type="button" @click="download(p.id)" :data-test="`print-${p.id}`">Download</button>
      </li>
    </ul>
    <router-link to="/" data-test="link-home">Home</router-link>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { printRegistry, registerDefaultPrintables } from '../print/service';

const list = ref(printRegistry.getAll());

onMounted(() => {
  // ensure defaults are present
  registerDefaultPrintables();
  list.value = printRegistry.getAll();
});

async function download(id: string) {
  const blob = await printRegistry.generate(id);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
</script>
<style scoped>
ul { list-style: none; padding: 0; }
li { display: flex; gap: 12px; align-items: center; margin: 8px 0; }
.title { font-weight: 600; }
</style>

