// Reusable composable to load a remote GamePlugin via federation with graceful fallbacks
/* eslint-disable  @typescript-eslint/no-explicit-any */
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
        const mod: unknown = await import(/* @vite-ignore */ spec);
        const maybe = mod as { plugin?: GamePlugin; default?: GamePlugin } | GamePlugin | undefined;
        const plugin: GamePlugin | undefined =
          (maybe && typeof maybe === 'object' && 'plugin' in (maybe as any)
            ? (maybe as { plugin?: GamePlugin }).plugin
            : undefined) ||
          (maybe && typeof maybe === 'object' && 'default' in (maybe as any)
            ? (maybe as { default?: GamePlugin }).default
            : undefined) ||
          ((maybe as GamePlugin | undefined) ?? undefined);
        if (plugin && typeof plugin === 'object') {
          status.value = RemoteStatus.Loaded;
          return plugin;
        }
      } catch (e) {
        lastErr = e;
      }
    }
    status.value = RemoteStatus.Error;
    const errObj = lastErr as { stack?: string; message?: string } | undefined;
    errorMsg.value = errObj?.stack || errObj?.message || String(lastErr ?? 'Unknown error');
    return undefined;
  }

  return { status, errorMsg, load };
}
