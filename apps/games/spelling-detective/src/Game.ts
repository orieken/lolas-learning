import type { GamePlugin, CoreAPI, Session } from '@lolas/core-sdk';
import { makeWordRound } from './generator';
import type { DifficultyLevel, WordEntry } from './words';

type GameState = 'LEVEL_SELECT' | 'PLAYING' | 'ROUND_FEEDBACK' | 'DONE';

export const plugin: GamePlugin = {
  id: 'spelling-detective',
  title: 'Spelling Detective',
  async mount(el: HTMLElement, core: CoreAPI) {
    let state: GameState = 'LEVEL_SELECT';
    let level: DifficultyLevel = 'easy';
    let startedAt = Date.now();
    let currentRound = 0;
    let correctCount = 0;
    let rounds: WordEntry[] = [];
    let hintsUsed = 0;

    let timerId: number | null = null;
    let timerStart = 0;
    let timerDuration = 0; // ms

    // Clear element
    el.innerHTML = '';

    const root = document.createElement('div');
    root.setAttribute('data-test', 'game-root');
    root.style.fontFamily = '"OpenDyslexic", "Lexie Readable", "Comic Sans MS", cursive';
    root.style.backgroundColor = '#fffdf4';
    root.style.minHeight = '100vh';
    root.style.padding = '24px';
    root.style.color = '#334155';
    el.appendChild(root);

    const statusAnnouncer = document.createElement('div');
    statusAnnouncer.setAttribute('role', 'status');
    statusAnnouncer.setAttribute('aria-live', 'polite');
    statusAnnouncer.style.position = 'absolute';
    statusAnnouncer.style.left = '-9999px';
    root.appendChild(statusAnnouncer);

    const content = document.createElement('div');
    content.style.maxWidth = '600px';
    content.style.margin = '0 auto';
    root.appendChild(content);

    function announce(msg: string) {
      statusAnnouncer.textContent = '';
      setTimeout(() => { statusAnnouncer.textContent = msg; }, 50);
    }

    function render() {
      content.innerHTML = '';

      if (state === 'LEVEL_SELECT') {
        const title = document.createElement('h1');
        title.textContent = 'Spelling Detective 🔍';
        title.className = 'text-3xl font-bold mb-8 text-center';
        content.appendChild(title);

        const levels: { id: DifficultyLevel; name: string; stars: string; desc: string; color: string }[] = [
          { id: 'easy', name: 'Easy', stars: '⭐', desc: 'Short words, swap two letters', color: 'lolaGreen' },
          { id: 'medium', name: 'Medium', stars: '⭐⭐', desc: 'Longer words, timed', color: 'lolaYellow' },
          { id: 'hard', name: 'Hard', stars: '⭐⭐⭐', desc: 'Trickier mistakes, fast timer', color: 'lolaPink' },
          { id: 'dyslexia', name: 'Patterns', stars: '🎯', desc: 'Practice common confusions, untimed', color: 'lolaPurple' },
        ];

        levels.forEach(l => {
          const btn = document.createElement('button');
          btn.setAttribute('data-test', `level-btn-${l.id}`);
          btn.setAttribute('aria-label', `${l.name} level: ${l.desc}`);
          btn.className = `w-full text-left bg-white p-6 rounded-2xl mb-4 shadow-lg border-4 border-${l.color}-500 hover:bg-${l.color}-50 transition-colors focus:ring-4 focus:ring-${l.color}-300 outline-none`;
          
          btn.innerHTML = `
            <div class="flex items-center justify-between mb-2">
              <span class="text-2xl font-bold">${l.name}</span>
              <span class="text-xl">${l.stars}</span>
            </div>
            <div class="text-lg opacity-80">${l.desc}</div>
          `;

          btn.addEventListener('click', () => {
            level = l.id;
            startedAt = Date.now();
            currentRound = 0;
            correctCount = 0;
            hintsUsed = 0;
            rounds = makeWordRound(level, { count: 10, seed: Date.now() });
            state = 'PLAYING';
            render();
          });
          content.appendChild(btn);
        });
        announce('Level Select. Choose Easy, Medium, or Hard.');
        return;
      }

      if (state === 'DONE') {
        content.setAttribute('data-test', 'done-screen');
        content.className = 'text-center bg-white p-8 rounded-2xl shadow-xl border-4 border-lolaBlue-400';
        
        let emoji = '🏅';
        if (correctCount >= 10) emoji = '🏆';
        else if (correctCount >= 9) emoji = '🥇';
        else if (correctCount >= 7) emoji = '🥈';
        else if (correctCount >= 5) emoji = '🥉';

        const title = document.createElement('h2');
        title.className = 'text-4xl font-bold mb-4';
        title.textContent = `${emoji} You got ${correctCount} out of 10!`;
        content.appendChild(title);

        const starsDiv = document.createElement('div');
        starsDiv.className = 'text-3xl mb-6 space-x-2';
        starsDiv.innerHTML = Array(correctCount).fill('⭐').join('');
        content.appendChild(starsDiv);

        if (hintsUsed > 3) {
          const hintMsg = document.createElement('p');
          hintMsg.className = 'text-lg italic text-slate-500 mb-6';
          hintMsg.textContent = "You're getting better! Try without hints next time 💪";
          content.appendChild(hintMsg);
        }

        const btnPrompt = document.createElement('button');
        btnPrompt.className = 'w-full py-4 text-xl font-bold text-white rounded-xl shadow border-b-4 mb-4 ';
        if (level === 'easy' && correctCount > 7) {
          btnPrompt.textContent = 'Ready to try Medium? 🚀';
          btnPrompt.classList.add('bg-lolaYellow-500', 'border-lolaYellow-600', 'hover:bg-lolaYellow-400');
          btnPrompt.addEventListener('click', () => {
            level = 'medium';
            playAgain();
          });
        } else if (level === 'medium' && correctCount > 7) {
          btnPrompt.textContent = 'Challenge yourself on Hard! 🔥';
          btnPrompt.classList.add('bg-lolaPink-500', 'border-lolaPink-600', 'hover:bg-lolaPink-400');
          btnPrompt.addEventListener('click', () => {
            level = 'hard';
            playAgain();
          });
        } else if (level === 'hard' && correctCount === 10) {
          btnPrompt.textContent = 'Perfect score on Hard! You\'re a Spelling Detective! 🔍🏆';
          btnPrompt.classList.add('bg-lolaPurple-500', 'border-lolaPurple-600', 'hover:bg-lolaPurple-400');
          btnPrompt.addEventListener('click', playAgain);
        } else {
          btnPrompt.textContent = 'Play again 🔄';
          btnPrompt.classList.add('bg-lolaBlue-500', 'border-lolaBlue-600', 'hover:bg-lolaBlue-400');
          btnPrompt.addEventListener('click', playAgain);
        }
        content.appendChild(btnPrompt);

        const homeBtn = document.createElement('button');
        homeBtn.textContent = 'Back to Levels';
        homeBtn.className = 'w-full py-3 text-lg font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 focus:ring-4 focus:ring-slate-300 outline-none';
        homeBtn.addEventListener('click', () => {
          state = 'LEVEL_SELECT';
          render();
        });
        content.appendChild(homeBtn);

        announce(`Game over. You scored ${correctCount} out of 10.`);
        return;
      }

      if (state === 'PLAYING' || state === 'ROUND_FEEDBACK') {
        const round = rounds[currentRound];
        
        // Header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4';
        header.innerHTML = `
          <div class="text-xl font-bold opacity-80">Question ${currentRound + 1} of 10</div>
          <div class="px-3 py-1 rounded-full text-sm font-bold bg-white shadow uppercase border-2 border-slate-200">
            ${level}
          </div>
        `;
        content.appendChild(header);

        // Timer bar (Medium/Hard)
        const timerBarOuter = document.createElement('div');
        timerBarOuter.className = 'w-full h-4 bg-slate-200 rounded-full mb-8 overflow-hidden';
        const timerBarInner = document.createElement('div');
        timerBarInner.setAttribute('data-test', 'timer-bar');
        timerBarInner.className = 'h-full bg-lolaBlue-400 transition-all ease-linear';
        timerBarInner.style.width = '100%';
        timerBarOuter.appendChild(timerBarInner);
        
        if (level === 'medium' || level === 'hard') {
          content.appendChild(timerBarOuter);
          if (state === 'PLAYING' && !timerId) {
            startTimer(timerBarInner);
          }
        }

        // Instruction
        const instruction = document.createElement('h2');
        instruction.textContent = 'Circle the word that is spelled correctly! ✏️';
        instruction.className = 'text-2xl font-bold mb-8 text-center';
        content.appendChild(instruction);

        // Cards
        const cardsWrap = document.createElement('div');
        cardsWrap.className = 'flex flex-col sm:flex-row gap-6 mb-8';
        content.appendChild(cardsWrap);

        const isReversed = (currentRound % 2) === 1; // deterministically pseudo-randomize position
        const leftWord = isReversed ? round.misspelling : round.correct;
        const rightWord = isReversed ? round.correct : round.misspelling;

        const leftBtn = createCard(leftWord, leftWord === round.correct);
        leftBtn.setAttribute('data-test', 'word-btn-left');
        const rightBtn = createCard(rightWord, rightWord === round.correct);
        rightBtn.setAttribute('data-test', 'word-btn-right');

        cardsWrap.appendChild(leftBtn);
        cardsWrap.appendChild(rightBtn);

        // Hint button (Easy and Dyslexia only)
        if ((level === 'easy' || level === 'dyslexia') && state === 'PLAYING') {
          const hintBtn = document.createElement('button');
          hintBtn.textContent = 'Need a hint? 💡';
          hintBtn.setAttribute('data-test', 'hint-btn');
          hintBtn.className = 'mx-auto block py-3 px-6 bg-yellow-100 text-yellow-800 font-bold rounded-full hover:bg-yellow-200 focus:ring-4 focus:ring-yellow-400 outline-none transition-colors border-2 border-yellow-300';
          hintBtn.addEventListener('click', () => {
            hintsUsed++;
            hintBtn.disabled = true;
            hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
            applyHintHighlight(leftWord === round.misspelling ? leftBtn : rightBtn, round.correct, round.misspelling);
          });
          content.appendChild(hintBtn);
        }

        // Feedback Message area
        const feedbackArea = document.createElement('div');
        feedbackArea.setAttribute('data-test', 'feedback-message');
        feedbackArea.className = 'text-2xl font-bold text-center h-12 flex items-center justify-center transition-opacity opacity-0';
        content.appendChild(feedbackArea);

        if (state === 'PLAYING') {
          announce(`Question ${currentRound + 1}. Find the correct spelling. Option 1: ${leftWord}. Option 2: ${rightWord}.`);
        }
      }
    }

    function createCard(text: string, isCorrect: boolean) {
      const btn = document.createElement('button');
      btn.className = 'flex-1 bg-white rounded-3xl p-8 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.1)] border-4 border-slate-200 hover:border-slate-300 transition-all focus:ring-8 focus:ring-lolaBlue-200 outline-none relative';
      btn.style.minHeight = '120px';
      // data-error="true" marks the correct answer (per spec constraints)
      btn.setAttribute('data-error', isCorrect ? 'true' : 'false');
      btn.setAttribute('aria-label', `Word option: ${text}`);
      
      let fontSize = 'text-4xl';
      if (level === 'medium') fontSize = 'text-3xl';
      if (level === 'hard') fontSize = 'text-2xl';

      const textSpan = document.createElement('span');
      textSpan.className = `font-bold block text-slate-800 ${fontSize}`;
      textSpan.textContent = text;
      textSpan.setAttribute('data-word-text', 'true');
      btn.appendChild(textSpan);

      const iconSpan = document.createElement('span');
      iconSpan.className = 'absolute top-2 right-4 text-3xl opacity-0 transition-opacity';
      btn.appendChild(iconSpan);

      btn.addEventListener('click', () => {
        if (state !== 'PLAYING') return;
        handleAnswer(isCorrect, btn, iconSpan, textSpan);
      });

      return btn;
    }

    function diffWords(correct: string, error: string): boolean[] {
      // Returns boolean array indicating if letter in 'error' word is different
      const diffs = Array(error.length).fill(false);
      let i = 0, j = 0;
      // Simple aligner assumption for highlight:
      if (correct.length === error.length) {
        for (let k = 0; k < correct.length; k++) {
          if (correct[k] !== error[k]) diffs[k] = true;
        }
      } else {
        // Just highlight everything if lengths differ for simplicity in MVP, 
        // or a basic diff. Let's just highlight all if lengths differ.
        return diffs.map(() => true);
      }
      return diffs;
    }

    function applyHintHighlight(btn: HTMLButtonElement, correctWord: string, errorWord: string) {
      const span = btn.querySelector('[data-word-text]');
      if (!span) return;
      const diffs = diffWords(correctWord, errorWord);
      
      span.innerHTML = '';
      for (let i = 0; i < errorWord.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = errorWord[i];
        if (diffs[i]) {
          charSpan.className = 'bg-yellow-200 text-yellow-900 rounded px-1';
        }
        span.appendChild(charSpan);
      }
    }

    function stopTimer() {
      if (timerId !== null) {
        cancelAnimationFrame(timerId);
        timerId = null;
      }
    }

    function startTimer(bar: HTMLElement) {
      timerDuration = level === 'medium' ? 60000 : 45000;
      timerStart = performance.now();

      function tick(now: number) {
        if (state !== 'PLAYING') return;

        const elapsed = now - timerStart;
        const remaining = Math.max(0, timerDuration - elapsed);
        const pct = (remaining / timerDuration) * 100;
        
        bar.style.width = `${pct}%`;
        bar.setAttribute('data-elapsed', Math.floor(elapsed / 1000).toString());

        if (remaining <= 0) {
          // Timeout
          handleTimeout();
        } else {
          timerId = requestAnimationFrame(tick);
        }
      }
      timerId = requestAnimationFrame(tick);
    }

    function handleTimeout() {
      if (state !== 'PLAYING') return;
      stopTimer();
      state = 'ROUND_FEEDBACK';
      
      const correctBtn = content.querySelector('[data-error="true"]') as HTMLButtonElement | null;
      if (correctBtn) {
        correctBtn.classList.remove('border-slate-200');
        correctBtn.classList.add('border-[#4cde80]', 'bg-green-50');
      }

      const feedback = content.querySelector('[data-test="feedback-message"]') as HTMLElement;
      if (feedback) {
        feedback.textContent = "Out of time!";
        feedback.classList.remove('opacity-0');
        feedback.classList.add('text-orange-500');
      }
      announce('Out of time!');

      setTimeout(nextRound, 2000);
    }

    function handleAnswer(isCorrect: boolean, btn: HTMLButtonElement, iconSpan: HTMLElement, textSpan: HTMLElement) {
      state = 'ROUND_FEEDBACK';
      stopTimer();

      const feedback = content.querySelector('[data-test="feedback-message"]') as HTMLElement;
      feedback.classList.remove('opacity-0');

      if (isCorrect) {
        correctCount++;
        btn.classList.add('border-[#4cde80]', 'bg-green-50');
        btn.classList.remove('border-slate-200');
        btn.style.boxShadow = '0 0 15px rgba(76, 222, 128, 0.5)';
        iconSpan.textContent = '✅';
        iconSpan.classList.remove('opacity-0');
        
        const msgs = ['Nice!', 'You got it!', 'Great job!', 'Spot on!'];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        feedback.textContent = msg;
        feedback.className = 'text-2xl font-bold text-center h-12 flex items-center justify-center transition-opacity text-[#4cde80]';
        announce(`Correct! ${msg}`);

        setTimeout(nextRound, 1200);
      } else {
        btn.classList.add('border-[#ff6b8a]', 'bg-red-50');
        btn.classList.remove('border-slate-200');
        btn.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        iconSpan.textContent = '❌';
        iconSpan.classList.remove('opacity-0');

        feedback.textContent = "Let's look at the difference!";
        feedback.className = 'text-2xl font-bold text-center h-12 flex items-center justify-center transition-opacity text-[#ff6b8a]';
        announce(`Incorrect. Let's look at the difference!`);

        // Highlight diff
        const round = rounds[currentRound];
        applyHintHighlight(btn, round.correct, round.misspelling);

        // Inject shake keyframes if not present
        if (!document.getElementById('shake-style')) {
          const style = document.createElement('style');
          style.id = 'shake-style';
          style.textContent = `
            @keyframes shake {
              10%, 90% { transform: translate3d(-1px, 0, 0); }
              20%, 80% { transform: translate3d(2px, 0, 0); }
              30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
              40%, 60% { transform: translate3d(4px, 0, 0); }
            }
            @media (prefers-reduced-motion: reduce) {
              * {
                animation: none !important;
                transition: none !important;
              }
            }
          `;
          document.head.appendChild(style);
        }

        setTimeout(nextRound, 2000);
      }
    }

    function nextRound() {
      currentRound++;
      if (currentRound >= rounds.length) {
        state = 'DONE';
        const completedAt = Date.now();
        core.awardPoints(correctCount);
        core.saveSession({
          id: `spelling-${completedAt}`,
          gameId: 'spelling-detective',
          score: correctCount,
          startedAt,
          completedAt
        });
      } else {
        state = 'PLAYING';
      }
      render();
    }

    function playAgain() {
      startedAt = Date.now();
      currentRound = 0;
      correctCount = 0;
      hintsUsed = 0;
      rounds = makeWordRound(level, { count: 10, seed: Date.now() });
      state = 'PLAYING';
      render();
    }

    render();
  },
};
