import type { GamePlugin, CoreAPI } from '@lolas/core-sdk';
import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css'; // Tailwind & custom animations

export const plugin: GamePlugin = {
  id: 'math-blast',
  title: 'MathBlast',
  async mount(el: HTMLElement, core: CoreAPI) {
    el.innerHTML = '';
    const vueApp = createApp(App);
    const pinia = createPinia();
    
    vueApp.use(pinia);
    vueApp.use(router);
    
    // Provide core to all components
    vueApp.provide('coreApi', core);

    // Initial route
    router.push('/');
    
    vueApp.mount(el);

    // Store vue instance on el so we can unmount if necessary, though shell might just discard the DOM
    (el as any).__vue_app__ = vueApp;
  },
};
