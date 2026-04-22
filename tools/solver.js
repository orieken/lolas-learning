// Simple JS port of findWordInGrid used by the validator to avoid requiring TS build artifacts
function findWordInGrid(grid, word) {
  const rows = grid.length;
  const cols = (grid[0] || []).length;
  const W = (word || '').trim().toUpperCase();
  if (!W) return [];
  const dirs = [
    { name: 'right', dr: 0, dc: 1 },
    { name: 'left', dr: 0, dc: -1 },
    { name: 'down', dr: 1, dc: 0 },
    { name: 'up', dr: -1, dc: 0 },
    { name: 'down-right', dr: 1, dc: 1 },
    { name: 'down-left', dr: 1, dc: -1 },
    { name: 'up-right', dr: -1, dc: 1 },
    { name: 'up-left', dr: -1, dc: -1 },
  ];
  const results = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (let di = 0; di < dirs.length; di++) {
        const d = dirs[di];
        const coords = [];
        let ok = true;
        for (let i = 0; i < W.length; i++) {
          const rr = r + d.dr * i;
          const cc = c + d.dc * i;
          if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) {
            ok = false;
            break;
          }
          if ((grid[rr][cc] || '') !== W[i]) {
            ok = false;
            break;
          }
          coords.push({ row: rr, col: cc });
        }
        if (ok) results.push({ word: W, coords, direction: d.name });
      }
    }
  }
  return results;
}

module.exports = { findWordInGrid };
