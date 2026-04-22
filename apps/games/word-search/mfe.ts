// Microfrontend entry for word search
import { generateGrid } from './lib/generator';

export type MountOpts = { container?: HTMLElement | null };

let rootEl: HTMLElement | null = null;
let cleanup: (() => void) | null = null;

export function bootstrap(): void {
  // nothing yet
}

function buildTemplate(): HTMLElement {
  const tpl = document.createElement('div');
  tpl.className = 'mfe-word-search';
  tpl.innerHTML = `
  <div style="max-width:900px;margin:20px auto;">
    <button class="mfe-print-button" style="position:fixed;top:20px;right:20px;z-index:1000;">🖨️ Print Puzzles</button>
    <div class="puzzle-container">
      <h1>🔍 Word Search Puzzles (MFE)</h1>
      <div class="instructions">
        <strong>📝 How to Play:</strong>
        <ul>
          <li>Click letters to select them; selections turn yellow</li>
          <li>If selection forms a horizontal or vertical word from the list it turns green</li>
        </ul>
      </div>
      <div class="todo" aria-label="development todo">
        <div style="min-width:120px; font-weight:bold; color:#764ba2;">TODO</div>
        <ul id="dev-todo">
          <li data-id="1">Make letters clickable to select (yellow)</li>
          <li data-id="2">Detect horizontal and vertical contiguous selections</li>
          <li data-id="3">Match selection to words and mark found (green)</li>
          <li data-id="4">Add Days-of-the-Week puzzle</li>
        </ul>
      </div>
      <div class="puzzle-section" data-puzzle="days">
        <h2>Puzzle: Days of the Week</h2>
        <div class="word-list">
          <div class="word-item">MONDAY</div>
          <div class="word-item">TUESDAY</div>
          <div class="word-item">WEDNESDAY</div>
          <div class="word-item">THURSDAY</div>
          <div class="word-item">FRIDAY</div>
          <div class="word-item">SATURDAY</div>
          <div class="word-item">SUNDAY</div>
        </div>
        <div class="grid" aria-label="days grid" data-cols="12" style="display:grid;grid-template-columns:repeat(12,1fr);gap:4px;max-width:600px;">
        </div>
        <div class="puzzle-controls" style="margin-top:8px;">
          <button class="control-btn" data-action="clear" style="padding:8px 12px;border-radius:8px;background:#667eea;color:white;border:none;">Clear Selection</button>
        </div>
      </div>
    </div>
  </div>
  `;
  return tpl;
}

export function mount(opts: MountOpts = {}): void {
  if (rootEl) return;
  const container = opts.container ?? document.body;
  rootEl = buildTemplate();
  container.appendChild(rootEl);

  // wire print
  const printBtn = rootEl.querySelector('.mfe-print-button') as HTMLElement | null;
  const onPrint = () => window.print();
  printBtn?.addEventListener('click', onPrint);

  // todo toggles
  const todoNodeList = rootEl.querySelectorAll('#dev-todo li');
  const todoLis: HTMLElement[] = [];
  for (let i = 0; i < todoNodeList.length; i++) todoLis.push(todoNodeList[i] as HTMLElement);
  const todoHandlers: ((ev: Event) => void)[] = [];
  todoLis.forEach((li) => {
    const h = () => li.classList.toggle('completed');
    todoHandlers.push(h);
    li.addEventListener('click', h);
  });

  // generate puzzle using generator
  const words = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const gridEl = rootEl.querySelector('.grid') as HTMLElement;
  const result = generateGrid(words, 5, 12, {
    allowBackwards: false,
    allowDiagonal: false,
    random: () => 0.5,
  });

  // render cells
  for (let r = 0; r < result.rows; r++) {
    for (let c = 0; c < result.cols; c++) {
      const d = document.createElement('div');
      d.className = 'cell';
      d.textContent = result.grid[r][c];
      d.dataset.row = String(r);
      d.dataset.col = String(c);
      d.style.aspectRatio = '1';
      d.style.display = 'flex';
      d.style.alignItems = 'center';
      d.style.justifyContent = 'center';
      d.style.border = '2px solid #667eea';
      d.style.fontWeight = 'bold';
      d.style.background = 'white';
      gridEl.appendChild(d);
    }
  }

  // add click handlers for selection/matching
  const cellNodeList = rootEl.querySelectorAll('.cell');
  const cells: HTMLElement[] = [];
  for (let i = 0; i < cellNodeList.length; i++) cells.push(cellNodeList[i] as HTMLElement);
  const handlers: ((ev: Event) => void)[] = [];
  cells.forEach((cell) => {
    const h = (_ev: Event) => {
      if (cell.classList.contains('found')) return;
      const idx = state.selected.indexOf(cell);
      if (idx !== -1) {
        // unselect
        state.selected.splice(idx, 1);
        cell.classList.remove('selected');
        cell.style.background = 'white';
        return;
      }
      // select
      cell.classList.add('selected');
      cell.style.background = '#fffacd';
      state.selected.push(cell);
      // validate contiguous
      if (state.selected.length > 1) {
        const rows = state.selected.map((s) => Number(s.dataset.row));
        const colsArr = state.selected.map((s) => Number(s.dataset.col));
        const allSameRow = rows.every((r) => r === rows[0]);
        const allSameCol = colsArr.every((c) => c === colsArr[0]);
        if (!allSameRow && !allSameCol) {
          const last = state.selected.pop()!;
          last.classList.remove('selected');
          last.style.background = 'white';
          return;
        }
        if (allSameRow) {
          const sc = uniqueSorted(colsArr);
          if (sc[sc.length - 1] - sc[0] + 1 !== sc.length) {
            const last = state.selected.pop()!;
            last.classList.remove('selected');
            last.style.background = 'white';
            return;
          }
        }
        if (allSameCol) {
          const sr = uniqueSorted(rows);
          if (sr[sr.length - 1] - sr[0] + 1 !== sr.length) {
            const last = state.selected.pop()!;
            last.classList.remove('selected');
            last.style.background = 'white';
            return;
          }
        }
      }

      tryMatch();
    };
    cell.addEventListener('click', h);
    handlers.push(h);
  });

  const clearBtn = rootEl.querySelector('[data-action="clear"]') as HTMLElement | null;
  const onClear = () => clearSelection();
  clearBtn?.addEventListener('click', onClear);

  cleanup = () => {
    printBtn?.removeEventListener('click', onPrint);
    for (let i = 0; i < todoLis.length; i++)
      todoLis[i].removeEventListener('click', todoHandlers[i]);
    for (let i = 0; i < cells.length; i++) cells[i].removeEventListener('click', handlers[i]);
    clearBtn?.removeEventListener('click', onClear);
    if (rootEl && rootEl.parentElement) rootEl.parentElement.removeChild(rootEl);
    rootEl = null;
    cleanup = null;
  };
}

export function unmount(): void {
  if (cleanup) cleanup();
}

// small helper: return unique sorted numeric array
function uniqueSorted(arr: number[]): number[] {
  const seen: Record<number, boolean> = {};
  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!seen[v]) {
      seen[v] = true;
      out.push(v);
    }
  }
  out.sort((a, b) => a - b);
  return out;
}
