<template>
  <section class="h-full">
    <p v-if="status==='loading'">Loading MathBlast game...</p>
    <p v-else-if="status==='error'" style="color:red" data-test="remote-error">Failed: {{ errorMsg }}</p>
    <div ref="mountEl" data-test="remote-mount" class="h-full" />
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import type { CoreAPI, Session, PrintableDef } from '@lolas/core-sdk';
import { createCoreApi } from '@lolas/core-sdk';
import { useSessionsStore } from '../stores/sessions';
import { useRewardsStore } from '../stores/rewards';
import { printRegistry } from '../print/service';
import { useRemotePlugin } from '../composables/useRemotePlugin';

const mountEl = ref<HTMLElement | null>(null);
const { status, errorMsg, load } = useRemotePlugin();

onMounted(async () => {
  try {
    const loaders = [() => import('math_blast/Game')];
    const plugin = await load({ loaders });
    if (!plugin) throw new Error('Remote plugin not found after attempts');

    const sessions = useSessionsStore();
    const rewards = useRewardsStore();
    const adapter: Partial<CoreAPI & { onAwardPoints?: (p:number)=>void; onSaveSession?: (s:Session)=>void; onRegisterPrintable?: (p: PrintableDef)=>void; }> = {
      onAwardPoints: (_p: number) => {},
      onSaveSession: (s: Session) => { sessions.addSession(s); rewards.processPerfectSession(s); },
      onRegisterPrintable: (p: PrintableDef) => { printRegistry.register(p); },
    } as any;
    const core: CoreAPI = createCoreApi(adapter);
    if (mountEl.value) await plugin.mount?.(mountEl.value, core);
  } catch (e: any) {
    (window as any).__REMOTE_LOAD_ERROR__ = e?.stack || e?.message || String(e);
  }
});

onUnmounted(() => {
  if (mountEl.value && (mountEl.value as any).__vue_app__) {
    // try to unmount internal vue app
    try {
      (mountEl.value as any).__vue_app__.unmount();
    } catch(e) {}
  }
});
</script>
