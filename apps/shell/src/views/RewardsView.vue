<template>
  <section>
    <h2>Rewards</h2>
    <p data-test="stars">Stars: {{ stars }}</p>
    <ul data-test="badges">
      <li v-for="b in badges" :key="b.id + '-' + b.earnedAt">
        <span class="badge-id">{{ b.id }}</span>
        <span class="badge-time">{{ formatTime(b.earnedAt) }}</span>
      </li>
    </ul>
    <router-link to="/" data-test="link-home">Home</router-link>
  </section>
</template>
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRewardsStore } from '../stores/rewards';

const rewards = useRewardsStore();
const stars = computed(() => rewards.stars);
const badges = computed(() => rewards.badges);

onMounted(() => {
  void rewards.load();
});

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}
</script>
<style scoped>
.badge-id { font-weight: 600; margin-right: 8px; }
.badge-time { color: #666; font-size: 12px; }
</style>

