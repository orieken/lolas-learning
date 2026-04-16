import './style.css';
import type { GamePlugin, CoreAPI, Session } from '@lolas/core-sdk';
import { makeFlipLines, getHintForPair, type FlipLine } from './generator';
import { createAudioManager, playSuccessChime, playTryAgainTone } from './audio';

// OpenDyslexic font CSS (embedded for simplicity - can be moved to external file)
const DYSLEXIC_FONT_CSS = `
@font-face {
  font-family: 'OpenDyslexic';
  src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

function injectStyles() {
  if (document.getElementById('letter-flip-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'letter-flip-styles';
  style.textContent = `
    ${DYSLEXIC_FONT_CSS}
    
    .letter-flip-root {
      font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif;
    }
    
    .letter-btn {
      font-family: inherit;
      font-size: 32px;
      min-width: 56px;
      min-height: 56px;
      padding: 12px 16px;
      border: 3px solid #6B7280;
      border-radius: 12px;
      background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
      cursor: pointer;
      transition: all 0.15s ease;
      text-transform: lowercase;
      user-select: none;
    }
    
    .letter-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .letter-btn:active {
      transform: scale(0.98);
    }
    
    .letter-btn.correct {
      background: linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%);
      border-color: #16A34A;
      animation: celebrate 0.5s ease;
    }
    
    .letter-btn.incorrect {
      animation: shake 0.4s ease;
    }
    
    .letter-btn.revealed {
      background: linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%);
      border-color: #F59E0B;
    }
    
    @keyframes celebrate {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.15) rotate(-5deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      75% { transform: scale(1.05) rotate(-3deg); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    
    @keyframes flip {
      0% { transform: rotateY(0deg); }
      50% { transform: rotateY(90deg); }
      100% { transform: rotateY(0deg); }
    }
    
    .flip-animation {
      animation: flip 0.6s ease;
    }
    
    .hint-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border: 2px solid #F59E0B;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      color: #92400E;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .instruction-box {
      background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
      border: 2px solid #3B82F6;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 16px;
      color: #1E40AF;
      text-align: center;
    }
    
    .score-display {
      font-size: 18px;
      color: #6B7280;
      text-align: center;
    }
    
    .message-box {
      min-height: 32px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
    
    .message-box.success {
      color: #16A34A;
    }
    
    .message-box.retry {
      color: #DC2626;
    }
    
    .audio-btn {
      background: #E0E7FF;
      border: 2px solid #6366F1;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .audio-btn:hover {
      background: #C7D2FE;
    }
    
    .mute-btn {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
    }
    
    .finished-box {
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
      border-radius: 16px;
      border: 3px solid #10B981;
    }
    
    .finished-box h2 {
      font-size: 28px;
      color: #065F46;
      margin: 0 0 12px 0;
    }
    
    .finished-box p {
      font-size: 20px;
      color: #047857;
      margin: 0;
    }
  `;
  document.head.appendChild(style);
}

export const plugin: GamePlugin = {
  id: 'letter-flip-detective',
  title: 'Letter Flip Detective',
  
  async mount(el: HTMLElement, core: CoreAPI) {
    injectStyles();
    
    const startedAt = Date.now();
    const audio = createAudioManager();
    
    // Clear and set up root
    el.innerHTML = '';
    const root = document.createElement('div');
    root.setAttribute('data-test', 'game-root');
    root.className = 'letter-flip-root';
    root.style.display = 'flex';
    root.style.flexDirection = 'column';
    root.style.gap = '16px';
    root.style.maxWidth = '520px';
    root.style.margin = '24px auto';
    root.style.padding = '16px';
    el.appendChild(root);

    // Game state
    let current = 0;
    let correct = 0;
    const total = 10;
    const lines = makeFlipLines({ lines: total, seed: Date.now() % 10000 });

    // --- UI Elements ---
    
    // Header with mute button
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    const title = document.createElement('h2');
    title.textContent = '🔍 Letter Flip Detective';
    title.style.margin = '0';
    title.style.fontSize = '22px';
    title.style.color = '#4B5563';
    header.appendChild(title);
    
    const muteBtn = document.createElement('button');
    muteBtn.className = 'mute-btn';
    muteBtn.textContent = '🔊';
    muteBtn.setAttribute('aria-label', 'Toggle sound');
    muteBtn.addEventListener('click', () => {
      const newMuted = !audio.isMuted();
      audio.setMuted(newMuted);
      muteBtn.textContent = newMuted ? '🔇' : '🔊';
    });
    header.appendChild(muteBtn);
    root.appendChild(header);

    // Instructions
    const instruction = document.createElement('div');
    instruction.className = 'instruction-box';
    instruction.setAttribute('data-test', 'game-instructions');
    instruction.textContent = 'Find the sneaky letter that doesn\'t belong!';
    root.appendChild(instruction);

    // Status (Line X of Y)
    const status = document.createElement('div');
    status.className = 'score-display';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.appendChild(status);

    // Letter grid
    const letterGrid = document.createElement('div');
    letterGrid.style.display = 'grid';
    letterGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
    letterGrid.style.gap = '12px';
    letterGrid.style.justifyItems = 'center';
    letterGrid.style.padding = '16px 0';
    root.appendChild(letterGrid);

    // Message area
    const message = document.createElement('div');
    message.className = 'message-box';
    message.setAttribute('data-test', 'message');
    root.appendChild(message);

    // Hint box
    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box';
    hintBox.style.display = 'none';
    root.appendChild(hintBox);

    // Audio button
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audio-btn';
    audioBtn.innerHTML = '🔊 Hear the instruction';
    audioBtn.addEventListener('click', () => {
      audio.playInstruction();
    });
    root.appendChild(audioBtn);

    // --- Game Logic ---
    
    function showHint(line: FlipLine) {
      const hint = getHintForPair(line.pair);
      hintBox.innerHTML = `💡 <strong>Hint:</strong> ${hint}`;
      hintBox.style.display = 'flex';
    }

    function hideHint() {
      hintBox.style.display = 'none';
    }

    function renderLine() {
      const line = lines[current];
      letterGrid.innerHTML = '';
      letterGrid.setAttribute('data-error-index', String(line.errorIndex));
      hideHint();
      
      let attempts = 0;

      line.items.forEach((letter, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.setAttribute('aria-label', `Letter ${idx + 1}: ${letter}`);
        
        if (idx === line.errorIndex) {
          btn.setAttribute('data-error', 'true');
        }

        // Click to hear the letter
        btn.addEventListener('mouseenter', () => {
          audio.speakLetter(letter);
        });

        btn.addEventListener('click', () => {
          if (idx === line.errorIndex) {
            // Correct!
            correct++;
            btn.classList.add('correct', 'flip-animation');
            playSuccessChime();
            
            message.textContent = '✨ Great job! You found it!';
            message.className = 'message-box success';
            
            // Brief pause then advance
            setTimeout(() => {
              current++;
              if (current >= total) {
                finishGame();
              } else {
                renderLine();
              }
            }, 1200);
          } else {
            // Incorrect
            attempts++;
            btn.classList.add('incorrect');
            playTryAgainTone();
            audio.playIncorrect();
            
            message.textContent = 'Not quite - try again!';
            message.className = 'message-box retry';
            
            // Show hint after 2 wrong attempts
            if (attempts >= 2) {
              showHint(line);
            }
            
            // Remove shake class after animation
            setTimeout(() => {
              btn.classList.remove('incorrect');
            }, 400);
          }
        });

        letterGrid.appendChild(btn);
      });

      status.textContent = `Line ${current + 1} of ${total} • Score: ${correct}`;
      message.textContent = '';
      message.className = 'message-box';
      
      // Play instruction on first line
      if (current === 0) {
        setTimeout(() => audio.playInstruction(), 500);
      }
    }

    function finishGame() {
      const completedAt = Date.now();
      
      // Award points
      if (correct > 0) {
        core.awardPoints(correct);
      }
      
      // Save session
      const session: Session = {
        id: `sess-${completedAt}`,
        gameId: 'letter-flip-detective',
        startedAt,
        completedAt,
        score: correct,
      };
      core.saveSession(session);

      // Show finished UI
      letterGrid.innerHTML = '';
      hintBox.style.display = 'none';
      audioBtn.style.display = 'none';
      message.textContent = '';
      
      const finishedBox = document.createElement('div');
      finishedBox.className = 'finished-box';
      
      const emoji = correct === total ? '🏆' : correct >= 7 ? '⭐' : '👍';
      const msg = correct === total 
        ? 'Perfect! You\'re a Letter Detective Master!' 
        : correct >= 7 
          ? 'Great work! Keep practicing!' 
          : 'Good effort! Try again to improve!';
      
      finishedBox.innerHTML = `
        <h2>${emoji} Finished!</h2>
        <p>Score: ${correct}/${total}</p>
        <p style="font-size: 16px; margin-top: 12px;">${msg}</p>
      `;
      
      letterGrid.parentElement?.insertBefore(finishedBox, letterGrid);
      status.textContent = `Finished! Score ${correct}/${total}`;
      
      // Celebratory audio
      audio.speak(correct === total ? 'Perfect score! Amazing!' : `Great job! You got ${correct} out of ${total}!`);
    }

    // Start the game
    renderLine();
  },

  async unmount() {
    // Cleanup if needed
    const styles = document.getElementById('letter-flip-styles');
    if (styles) {
      styles.remove();
    }
  },
};
