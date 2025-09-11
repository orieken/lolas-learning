import type { CoreAPI, Session } from './index';

export type OddOneOutLine<T = unknown> = {
  items: T[];
  errorIndex: number; // index of the odd item
};

export type OddOneOutOptions<T = unknown> = {
  el: HTMLElement;
  core: CoreAPI;
  gameId: string;
  total: number; // expected number of lines to play
  lines: OddOneOutLine<T>[]; // pre-generated lines length >= total
  // Optional hooks/customization
  canClick?: () => boolean; // if returns false, ignore clicks (e.g., freeze overlay)
  formatItem?: (item: T) => string; // default String(item)
  onFinish?: (ctx: { correct: number; total: number }) => void; // after UI updated & session saved
  instructions?: string; // NEW optional instructions shown at top
};

export type OddOneOutMountResult = {
  root: HTMLElement;
  status: HTMLElement;
  lineWrap: HTMLElement;
  message: HTMLElement;
};

/**
 * Mounts a standard 6-button odd-one-out grid game UI into the container and
 * runs the loop for the provided lines. Maintains the same DOM attributes and
 * texts used by existing games/tests.
 */
export function mountOddOneOut<T = unknown>(opts: OddOneOutOptions<T>): OddOneOutMountResult {
  const { el, core, gameId, total, lines } = opts;
  const canClick = opts.canClick || (() => true);
  const formatItem: (v: T) => string = opts.formatItem || ((v: T) => String(v));

  const startedAt = Date.now();
  el.innerHTML = '';
  const root = document.createElement('div');
  root.setAttribute('data-test', 'game-root');
  root.style.display = 'grid';
  root.style.gap = '16px';
  root.style.maxWidth = '520px';
  root.style.margin = '24px auto';
  el.appendChild(root);

  if (opts.instructions) {
    const instr = document.createElement('div');
    instr.setAttribute('data-test', 'game-instructions');
    instr.style.fontSize = '14px';
    instr.style.lineHeight = '1.4';
    instr.style.background = '#f5f5f5';
    instr.style.padding = '8px 12px';
    instr.style.borderRadius = '8px';
    instr.textContent = opts.instructions;
    root.appendChild(instr);
  }

  let current = 0;
  let correct = 0;

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
    if (correct > 0) core.awardPoints(correct);
    const session: Session = {
      id: 'sess-' + String(completedAt),
      gameId,
      startedAt,
      completedAt,
      score: correct,
    };
    core.saveSession(session);
    status.textContent = 'Finished! Score ' + String(correct) + '/' + String(total);
    lineWrap.innerHTML = '';
    opts.onFinish?.({ correct, total });
  }

  function renderLine() {
    const ln = lines[current];
    lineWrap.innerHTML = '';
    lineWrap.setAttribute('data-error-index', String(ln.errorIndex));

    ln.items.forEach((val, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = formatItem(val);
      btn.style.padding = '12px';
      btn.style.fontSize = '18px';
      btn.style.cursor = 'pointer';
      btn.style.borderRadius = '8px';
      btn.style.border = '2px solid #333';
      btn.setAttribute('aria-label', 'Item ' + String(idx + 1) + ' value ' + formatItem(val));
      if (idx === ln.errorIndex) btn.setAttribute('data-error', 'true');
      btn.addEventListener('click', () => {
        if (!canClick()) return;
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
  return { root, status, lineWrap, message: msg };
}
