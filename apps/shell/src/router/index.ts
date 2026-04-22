import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GameSpellingDetective from '../views/GameSpellingDetective.vue';
import GameFreezeMath from '../views/GameFreezeMath.vue';
import GameNumberDetective from '../views/GameNumberDetective.vue';
import RewardsView from '../views/RewardsView.vue';
import PrintCenter from '../views/PrintCenter.vue';
import GameLetterDetective from '../views/GameLetterDetective.vue';
import GameWordDetective from '../views/GameWordDetective.vue';
import GameWordSearch from '../views/GameWordSearch.vue';
import GameLetterFlipDetective from '../views/GameLetterFlipDetective.vue';
import GameMathBlast from '../views/GameMathBlast.vue';

const routes: RouteRecordRaw[] = [
  { path: '/game/math-blast', name: 'math-blast', component: GameMathBlast },
  {
    path: '/game/spelling-detective',
    name: 'spelling-detective',
    component: GameSpellingDetective,
  },
  { path: '/game/freeze-math', name: 'freeze-math', component: GameFreezeMath },
  { path: '/', name: 'home', component: HomeView },
  { path: '/game/number-detective', name: 'number-detective', component: GameNumberDetective },
  { path: '/game/letter-detective', name: 'letter-detective', component: GameLetterDetective },
  { path: '/game/word-detective', name: 'word-detective', component: GameWordDetective },
  { path: '/game/word-search', name: 'word-search', component: GameWordSearch },
  {
    path: '/game/letter-flip-detective',
    name: 'letter-flip-detective',
    component: GameLetterFlipDetective,
  },
  { path: '/rewards', name: 'rewards', component: RewardsView },
  { path: '/print', name: 'print', component: PrintCenter },
  { path: '/proto1', component: () => import('../views/Prototype1.vue') },
  { path: '/proto2', component: () => import('../views/Prototype2.vue') },
  { path: '/proto3', component: () => import('../views/Prototype3.vue') },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
