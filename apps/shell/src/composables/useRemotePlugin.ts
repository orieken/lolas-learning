// Reusable composable to load a remote GamePlugin via federation with graceful fallbacks
import { ref } from 'vue';
import type { GamePlugin } from '@lolas/core-sdk';

export const RemoteStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Loaded: 'loaded',
  Error: 'error',
} as const;
export type RemoteStatus = (typeof RemoteStatus)[keyof typeof RemoteStatus];

export type LoadRemoteOptions = {
  specs: string[]; // module specifiers or URLs to try in order
};

export function useRemotePlugin() {
  const status = ref<RemoteStatus>(RemoteStatus.Idle);
  const errorMsg = ref('');

  async function load(options: LoadRemoteOptions): Promise<GamePlugin | undefined> {
    status.value = RemoteStatus.Loading;
    let lastErr: unknown = undefined;
    for (const spec of options.specs) {
      try {
        // @ts-ignore dynamic federation or direct URL import at runtime
        const mod: any = await import(/* @vite-ignore */ spec);
        const plugin: GamePlugin | undefined = mod?.plugin || mod?.default || mod;
        if (plugin && typeof plugin === 'object') {
          status.value = RemoteStatus.Loaded;
          return plugin;
        }
      } catch (e) {
        lastErr = e;
      }
    }
    status.value = RemoteStatus.Error;
    errorMsg.value =
      (lastErr as any)?.stack || (lastErr as any)?.message || String(lastErr ?? 'Unknown error');
    return undefined;
  }

  return { status, errorMsg, load };
}
