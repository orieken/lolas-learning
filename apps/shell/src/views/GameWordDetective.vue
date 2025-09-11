<template>
  <section>
    <h2>Word Detective Remote</h2>
    <p v-if="status==='loading'">Loading remote game...</p>
    <p v-else-if="status==='error'" style="color:red" data-test="remote-error">Failed: {{ errorMsg }}</p>
    <div ref="mountEl" data-test="remote-mount" />
    <router-link to="/" data-test="link-home">Home</router-link>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { GamePlugin, CoreAPI, Session, PrintableDef } from '@lolas/core-sdk';
import { createCoreApi } from '@lolas/core-sdk';
import { useSessionsStore } from '../stores/sessions';
import { useRewardsStore } from '../stores/rewards';
import { printRegistry } from '../print/service';
import { useRemotePlugin } from '../composables/useRemotePlugin';

const mountEl = ref<HTMLElement | null>(null);
const { status, errorMsg, load } = useRemotePlugin();

onMounted(async () => {
  try {
    const plugin = await load({ specs: ['word_detective/Game', 'http://localhost:5176/src/Game.ts'] });
    if (!plugin) throw new Error('Remote plugin not found after attempts');

    const sessions = useSessionsStore();
    const rewards = useRewardsStore();
    const adapter: Partial<CoreAPI & { onAwardPoints?: (p:number)=>void; onSaveSession?: (s:Session)=>void; onRegisterPrintable?: (p: PrintableDef)=>void; }> = {
      onAwardPoints: (_p: number) => {},
      onSaveSession: (s: Session) => { sessions.addSession(s); rewards.processPerfectSession(s); },
      onRegisterPrintable: (p: PrintableDef) => { printRegistry.register(p); },
    } as any;

    const core: CoreAPI = createCoreApi(adapter as any);
    if (mountEl.value) await (plugin as GamePlugin).mount?.(mountEl.value, core);
  } catch (e: any) {
    (window as any).__REMOTE_LOAD_ERROR__ = e?.stack || e?.message || String(e);
  }
});
</script>

