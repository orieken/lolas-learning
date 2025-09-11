import type { GamePlugin, CoreAPI, Session } from '@lolas/core-sdk';
import { makeLines } from './generator';
import { PausableTimer } from './timer';

export const plugin: GamePlugin = {
  id: 'freeze-math',
  title: 'Freeze Math',
  async mount(el: HTMLElement, core: CoreAPI) {
    const startedAt = Date.now();
    el.innerHTML = '';
    const root = document.createElement('div');
    root.setAttribute('data-test', 'game-root');
    root.style.display = 'grid';
    root.style.gap = '16px';
    root.style.maxWidth = '520px';
    root.style.margin = '24px auto';
    el.appendChild(root);

    // Instructions panel
    const instr = document.createElement('div');
    instr.setAttribute('data-test', 'game-instructions');
    instr.style.fontSize = '14px';
    instr.style.lineHeight = '1.4';
    instr.style.background = '#f5f5f5';
    instr.style.padding = '8px 12px';
    instr.style.borderRadius = '8px';
    instr.textContent = 'Spot the number in each row that breaks the even counting pattern. Tap it. Use Freeze to pause, breathe, then continue.';
    root.appendChild(instr);

    let current = 0;
    let correct = 0;
    const total = 10;

    const lines = makeLines([1, 40], { lines: total, seed: 5 });

    // Timer UI
    const timerBar = document.createElement('div');
    const timeSpan = document.createElement('span');
    timeSpan.setAttribute('data-test', 'timer-elapsed');
    timeSpan.textContent = '0.0s';
    timerBar.appendChild(document.createTextNode('Time: '));
    timerBar.appendChild(timeSpan);

    const freezeBtn = document.createElement('button');
    freezeBtn.type = 'button';
    freezeBtn.textContent = 'Freeze';
    freezeBtn.setAttribute('data-test', 'btn-freeze');
    freezeBtn.style.marginLeft = '12px';
    timerBar.appendChild(freezeBtn);
    root.appendChild(timerBar);

    const timer = new PausableTimer((ms) => {
      timeSpan.textContent = (ms / 1000).toFixed(1) + 's';
    }, 200);
    timer.start();

    // Freeze overlay
    const overlay = document.createElement('div');
    overlay.setAttribute('data-test', 'freeze-overlay');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.75)';
    overlay.style.color = '#fff';
    overlay.style.zIndex = '999';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.fontSize = '20px';
    overlay.style.padding = '24px';
    overlay.style.textAlign = 'center';
    overlay.style.gap = '24px';
    overlay.style.fontFamily = 'system-ui, sans-serif';
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'none';

    const breathMsg = document.createElement('div');
    breathMsg.textContent = 'Freeze! Take 3 deep breaths…';
    overlay.appendChild(breathMsg);

    const dots = document.createElement('div');
    dots.setAttribute('data-test', 'breath-dots');
    overlay.appendChild(dots);

    const resumeBtn = document.createElement('button');
    resumeBtn.type = 'button';
    resumeBtn.textContent = 'Continue';
    resumeBtn.setAttribute('data-test', 'btn-resume');
    resumeBtn.disabled = true;
    overlay.appendChild(resumeBtn);

    let breathStep = 0;
    let breathInterval: any;

    function openOverlay() {
      timer.pause();
      breathStep = 0;
      dots.textContent = '';
      resumeBtn.disabled = true;
      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      });
      breathInterval = setInterval(() => {
        breathStep++;
        dots.textContent = '• '.repeat(breathStep).trim();
        if (breathStep >= 3) {
          clearInterval(breathInterval);
          resumeBtn.disabled = false;
        }
      }, 1000);
    }

    function closeOverlay() {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      if (breathInterval) clearInterval(breathInterval);
      setTimeout(() => {
        if (overlay.style.pointerEvents === 'none') overlay.style.display = 'none';
      }, 300);
      timer.resume();
    }

    freezeBtn.addEventListener('click', () => {
      if (overlay.style.pointerEvents === 'auto') return; // already open
      openOverlay();
    });
    resumeBtn.addEventListener('click', () => closeOverlay());

    document.body.appendChild(overlay);

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

    function finish() {
      const completedAt = Date.now();
      timer.pause();
      if (correct > 0) core.awardPoints(correct);
      const session: Session = {
        id: 'sess-' + String(completedAt),
        gameId: 'freeze-math',
        startedAt,
        completedAt,
        score: correct,
      };
      core.saveSession(session);
      status.textContent = 'Finished! Score ' + String(correct) + '/' + String(total);
      lineWrap.innerHTML = '';
      freezeBtn.disabled = true;
    }

    function renderLine() {
      const ln = lines[current];
      lineWrap.innerHTML = '';
      lineWrap.setAttribute('data-error-index', String(ln.errorIndex));
      ln.items.forEach((num, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = String(num);
        btn.style.padding = '12px';
        btn.style.fontSize = '18px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '8px';
        btn.style.border = '2px solid #333';
        btn.setAttribute('aria-label', 'Item ' + String(idx + 1) + ' value ' + String(num));
        if (idx === ln.errorIndex) btn.setAttribute('data-error', 'true');
        btn.addEventListener('click', () => {
          if (overlay.style.pointerEvents === 'auto') return; // ignore clicks while frozen
          if (idx === ln.errorIndex) {
            correct++;
            msg.textContent = 'Correct!';
            current++;
            if (current >= total) {
              finish();
              return;
            }
            renderLine();
          } else {
            msg.textContent = 'Try again…';
          }
        });
        lineWrap.appendChild(btn);
      });
      status.textContent = 'Line ' + String(current + 1) + ' of ' + String(total);
      msg.textContent = '';
    }

    renderLine();
  },
  async unmount() {
    // no-op for now
  },
};
