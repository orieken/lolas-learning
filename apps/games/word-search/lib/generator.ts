// generateGrid: simple word search generator
// Places words on a rows x cols grid, defaulting to right and down directions.
// Options allowBackwards and allowDiagonal enable extra directions.

export type Direction =
  | 'right'
  | 'left'
  | 'down'
  | 'up'
  | 'down-right'
  | 'down-left'
  | 'up-right'
  | 'up-left';

export interface GeneratorOptions {
  allowBackwards?: boolean; // adds left and up
  allowDiagonal?: boolean; // adds diagonal directions
  maxAttempts?: number; // attempts per word
  random?: () => number; // optional RNG for deterministic tests
}

export interface Coord { row: number; col: number }
export interface Placement { word: string; coords: Coord[]; direction: Direction }
export interface GridResult {
  rows: number;
  cols: number;
  grid: string[][];
  placements: Placement[];
  success: boolean;
  failed?: string[];
}

const DEFAULT_OPTIONS: Required<GeneratorOptions> = {
  allowBackwards: false,
  allowDiagonal: false,
  maxAttempts: 2000,
  random: Math.random,
};

function buildAllowedDirs(opts: Required<GeneratorOptions>): Direction[] {
  const dirs: Direction[] = ['right', 'down'];
  if (opts.allowBackwards) {
    dirs.push('left', 'up');
  }
  if (opts.allowDiagonal) {
    dirs.push('down-right', 'down-left', 'up-right', 'up-left');
  }
  return dirs;
}

function dirDelta(d: Direction): { dr: number; dc: number } {
  switch (d) {
    case 'right': return { dr: 0, dc: 1 };
    case 'left': return { dr: 0, dc: -1 };
    case 'down': return { dr: 1, dc: 0 };
    case 'up': return { dr: -1, dc: 0 };
    case 'down-right': return { dr: 1, dc: 1 };
    case 'down-left': return { dr: 1, dc: -1 };
    case 'up-right': return { dr: -1, dc: 1 };
    case 'up-left': return { dr: -1, dc: -1 };
  }
}

function randInt(rng: () => number, min: number, maxExclusive: number) {
  return Math.floor(rng() * (maxExclusive - min)) + min;
}

export function generateGrid(words: string[], rows: number, cols: number, options?: GeneratorOptions): GridResult {
  const opts: Required<GeneratorOptions> = { ...DEFAULT_OPTIONS, ...(options || {}) } as Required<GeneratorOptions>;
  const rng = opts.random;
  const allowed = buildAllowedDirs(opts);

  // create empty grid with nulls (avoid Array.fill to be compatible with older TS lib settings)
  const grid: (string | null)[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowArr: (string | null)[] = [];
    for (let c = 0; c < cols; c++) rowArr.push(null);
    grid.push(rowArr);
  }

  const placements: Placement[] = [];
  const failed: string[] = [];

  for (const rawWord of words) {
    const word = rawWord.trim().toUpperCase();
    if (!word) continue;
    let placed = false;
    for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
      const dir = allowed[randInt(rng, 0, allowed.length)];
      const { dr, dc } = dirDelta(dir);
      const len = word.length;

      // compute valid start ranges for rows and cols based on direction
      const rowRange = computeStartRange(rows, dr, len);
      const colRange = computeStartRange(cols, dc, len);
      if (rowRange.max <= rowRange.min || colRange.max <= colRange.min) {
        continue; // can't fit in this direction
      }
      const startRow = randInt(rng, rowRange.min, rowRange.max);
      const startCol = randInt(rng, colRange.min, colRange.max);

      // check can place
      const coords: Coord[] = [];
      let ok = true;
      for (let i = 0; i < len; i++) {
        const r = startRow + dr * i;
        const c = startCol + dc * i;
        const cell = grid[r][c];
        if (cell !== null && cell !== word[i]) {
          ok = false; break;
        }
        coords.push({ row: r, col: c });
      }
      if (!ok) continue;

      // place letters
      for (let i = 0; i < len; i++) {
        const { row, col } = coords[i];
        grid[row][col] = word[i];
      }
      placements.push({ word, coords, direction: dir });
      placed = true;
      break;
    }
    if (!placed) failed.push(word);
  }

  // fill remaining cells with random letters
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === null) {
        // pick a random uppercase letter A-Z
        grid[r][c] = String.fromCharCode(65 + Math.floor(rng() * 26));
      }
    }
  }

  return {
    rows,
    cols,
    grid: grid as string[][],
    placements,
    success: failed.length === 0,
    failed: failed.length ? failed : undefined,
  };
}

function computeStartRange(size: number, delta: number, len: number) {
  if (delta === 0) {
    return { min: 0, max: size }; // can start anywhere 0..size-1
  }
  if (delta > 0) {
    // r + delta*(len-1) <= size-1  => r <= size - len
    return { min: 0, max: size - len + 1 };
  }
  // delta < 0: r + delta*(len-1) >= 0  => r >= len-1
  return { min: len - 1, max: size };
}

// Simple solver to find a word in a grid searching 8 directions
export function findWordInGrid(grid: string[][], word: string): Placement[] {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const W = word.trim().toUpperCase();
  if (!W) return [];

  const dirs: { name: Direction; dr: number; dc: number }[] = [
    { name: 'right', dr: 0, dc: 1 },
    { name: 'left', dr: 0, dc: -1 },
    { name: 'down', dr: 1, dc: 0 },
    { name: 'up', dr: -1, dc: 0 },
    { name: 'down-right', dr: 1, dc: 1 },
    { name: 'down-left', dr: 1, dc: -1 },
    { name: 'up-right', dr: -1, dc: 1 },
    { name: 'up-left', dr: -1, dc: -1 },
  ];

  const results: Placement[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const d of dirs) {
        const coords: Coord[] = [];
        let ok = true;
        for (let i = 0; i < W.length; i++) {
          const rr = r + d.dr * i;
          const cc = c + d.dc * i;
          if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) { ok = false; break; }
          if (grid[rr][cc] !== W[i]) { ok = false; break; }
          coords.push({ row: rr, col: cc });
        }
        if (ok) results.push({ word: W, coords, direction: d.name });
      }
    }
  }

  return results;
}

