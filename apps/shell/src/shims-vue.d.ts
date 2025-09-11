declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // Use empty props/slots state and unknown for data to avoid banned {} and any
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}
