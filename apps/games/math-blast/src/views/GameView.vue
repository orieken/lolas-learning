<template>
  <div class="h-full flex flex-col relative">
    <HUD :timeLeft="timeLeft" />
    
    <div class="flex-grow flex flex-col p-4 sm:p-6 gap-6 sm:gap-8 overflow-y-auto">
      <QuestionCard :expression="currentQuestion.expression" />
      
      <div class="grid grid-cols-2 gap-4 sm:gap-6 mt-auto">
        <AnswerButton 
          v-for="opt in currentQuestion.options" 
          :key="opt + currentQuestion.expression"
          :value="opt"
          :correctValue="currentQuestion.correctAnswer"
          :expression="currentQuestion.expression"
          :isRevealed="isRevealed"
          :clickedValue="clickedValue"
          @answer="handleAnswer"
        />
      </div>
    </div>
    <BadgeModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import { generateQuestion, calculateScore } from '../utils/mathLogic';

import HUD from '../components/HUD.vue';
import QuestionCard from '../components/QuestionCard.vue';
import AnswerButton from '../components/AnswerButton.vue';
import BadgeModal from '../components/BadgeModal.vue';

const router = useRouter();
const store = useGameStore();

const currentQuestion = ref(generateQuestion(store.level));
const isRevealed = ref(false);
const clickedValue = ref<number | null>(null);

const timeLeft = ref(store.timerMax);
const timerStart = ref(0);
let rafId: number;

function startQuestion() {
  isRevealed.value = false;
  clickedValue.value = null;
  currentQuestion.value = generateQuestion(store.level);
  timeLeft.value = store.timerMax;
  timerStart.value = performance.now();
  rafId = requestAnimationFrame(updateTimer);
}

function updateTimer(timestamp: number) {
  if (isRevealed.value) return;
  
  const elapsed = (timestamp - timerStart.value) / 1000;
  timeLeft.value = Math.max(0, store.timerMax - elapsed);
  
  if (timeLeft.value <= 0) {
    handleAnswer(-1); // Timeout acts as wrong answer
  } else {
    rafId = requestAnimationFrame(updateTimer);
  }
}

function handleAnswer(ans: number) {
  if (isRevealed.value) return;
  cancelAnimationFrame(rafId);
  
  isRevealed.value = true;
  clickedValue.value = ans;
  
  const isCorrect = (ans === currentQuestion.value.correctAnswer);
  const reactionTime = store.timerMax - timeLeft.value;

  if (isCorrect) {
    const pts = calculateScore(store.streak);
    store.answerCorrect(pts);
    if (reactionTime < 2.0) {
      store.answerSpeedBonus();
    }
  } else {
    store.answerWrong();
  }
  
  setTimeout(() => {
    startQuestion();
  }, 1200);
}

onMounted(() => {
  store.resetSession();
  startQuestion();
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>
