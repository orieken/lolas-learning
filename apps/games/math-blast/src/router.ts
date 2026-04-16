import { createRouter, createWebHashHistory } from 'vue-router';

// Lazy loading views
const HomeView = () => import('./views/HomeView.vue');
const GameView = () => import('./views/GameView.vue');
const EndView = () => import('./views/EndView.vue');
const GalleryView = () => import('./views/GalleryView.vue');
const ModeSelectView = () => import('./views/ModeSelectView.vue');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/modes', name: 'modes', component: ModeSelectView },
    { path: '/play', name: 'play', component: GameView },
    { path: '/end', name: 'end', component: EndView },
    { path: '/badges', name: 'badges', component: GalleryView },
  ]
});

export default router;
