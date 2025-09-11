import type { GamePlugin, CoreAPI, Session } from '@lolas/core-sdk';
import { makeLetterLines } from './generator';

export const plugin: GamePlugin = {
  id: 'letter-detective',
  title: 'Letter Detective',
  async mount(el: HTMLElement, core: CoreAPI) {
    const startedAt = Date.now();
    el.innerHTML = '';
    const root = document.createElement('div');
    root.setAttribute('data-test', 'game-root');
    root.style.display = 'grid';
    root.style.gap = '16px';
    root.style.maxWidth = '480px';
    root.style.margin = '24px auto';
    el.appendChild(root);

    const instr = document.createElement('div');
    instr.setAttribute('data-test', 'game-instructions');
    instr.style.fontSize = '14px';
    instr.style.lineHeight = '1.4';
    instr.style.background = '#f5f5f5';
    instr.style.padding = '8px 12px';
    instr.style.borderRadius = '8px';
    instr.textContent =
      'One letter in each row is out of order or does not belong. Tap the odd letter to advance.';
    root.appendChild(instr);

    let current = 0;
    let correct = 0;
    const total = 10;

    const lines = makeLetterLines({ lines: total, seed: 11 });

    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.appendChild(status);

    const lineWrap = document.createElement('div');
    lineWrap.style.display = 'grid';
    lineWrap.style.gridTemplateColumns = 'repeat(6, 1fr)';
    lineWrap.style.gap = '12px';
    root.appendChild(lineWrap);

    const msg = document.createElement('div');
    msg.setAttribute('data-test', 'message');
    root.appendChild(msg);

    function renderLine() {
      const ln = lines[current];
      lineWrap.innerHTML = '';
      lineWrap.setAttribute('data-error-index', String(ln.errorIndex));
      ln.items.forEach((ch, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = ch.toUpperCase();
        btn.style.padding = '16px';
        btn.style.fontSize = '20px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '8px';
        btn.style.border = '2px solid #333';
        btn.setAttribute('aria-label', `Item ${idx + 1} value ${ch}`);
        if (idx === ln.errorIndex) btn.setAttribute('data-error', 'true');
        btn.addEventListener('click', () => {
          if (idx === ln.errorIndex) {
            correct++;
            msg.textContent = 'Correct!';
            current++;
            if (current >= total) {
              const completedAt = Date.now();
              if (correct > 0) core.awardPoints(correct);
              const session: Session = {
                id: `sess-${completedAt}`,
                gameId: 'letter-detective',
                startedAt,
                completedAt,
                score: correct,
              };
              core.saveSession(session);
              status.textContent = `Finished! Score ${correct}/${total}`;
              lineWrap.innerHTML = '';
              return;
            }
            renderLine();
          } else {
            msg.textContent = 'Try again…';
          }
        });
        lineWrap.appendChild(btn);
      });
      status.textContent = `Line ${current + 1} of ${total}`;
      msg.textContent = '';
    }

    renderLine();
  },
};
