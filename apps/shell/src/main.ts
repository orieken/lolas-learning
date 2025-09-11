import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerDefaultPrintables } from './print/service';
import './assets/tailwind.css';

registerDefaultPrintables();

createApp(App).use(createPinia()).use(router).mount('#app');
