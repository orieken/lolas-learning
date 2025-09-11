import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GameFreezeMath from '../views/GameFreezeMath.vue';
import GameNumberDetective from '../views/GameNumberDetective.vue';
import RewardsView from '../views/RewardsView.vue';
import PrintCenter from '../views/PrintCenter.vue';
import GameLetterDetective from '../views/GameLetterDetective.vue';
import GameWordDetective from '../views/GameWordDetective.vue';

const routes: RouteRecordRaw[] = [
  { path: '/game/freeze-math', name: 'freeze-math', component: GameFreezeMath },
  { path: '/', name: 'home', component: HomeView },
  { path: '/game/number-detective', name: 'number-detective', component: GameNumberDetective },
  { path: '/game/letter-detective', name: 'letter-detective', component: GameLetterDetective },
  { path: '/game/word-detective', name: 'word-detective', component: GameWordDetective },
  { path: '/rewards', name: 'rewards', component: RewardsView },
  { path: '/print', name: 'print', component: PrintCenter },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
