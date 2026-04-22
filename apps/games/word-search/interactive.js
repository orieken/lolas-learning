(function () {
  // Simple interactive behavior: click to toggle selected, contiguous horizontal/vertical only
  function initGrid(gridEl) {
    const cells = Array.from(gridEl.querySelectorAll('.cell'));
    const cols = 12;
    cells.forEach((cell, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      cell.dataset.row = row;
      cell.dataset.col = col;
    });

    const state = { selected: [] };

    function clearSelection() {
      state.selected.forEach((c) => {
        c.classList.remove('selected');
        c.style.background = 'white';
      });
      state.selected = [];
    }

    function markFound(cells) {
      cells.forEach((c) => {
        c.classList.remove('selected');
        c.classList.add('found');
        c.style.background = '#bff3b8';
        c.style.borderColor = '#2e7d32';
      });
      state.selected = [];
    }

    function tryMatch() {
      if (!state.selected.length) return;
      const rows = state.selected.map((c) => Number(c.dataset.row));
      const colsArr = state.selected.map((c) => Number(c.dataset.col));
      const allSameRow = rows.every((r) => r === rows[0]);
      const allSameCol = colsArr.every((c) => c === colsArr[0]);
      if (!allSameRow && !allSameCol) return;
      const sorted = state.selected
        .slice()
        .sort((a, b) =>
          allSameRow
            ? Number(a.dataset.col) - Number(b.dataset.col)
            : Number(a.dataset.row) - Number(b.dataset.row),
        );
      const word = sorted
        .map((c) => c.textContent.trim())
        .join('')
        .toUpperCase();
      // check against word-list
      const wordItems = Array.from(gridEl.parentElement.querySelectorAll('.word-item'));
      const set = new Set(wordItems.map((w) => w.textContent.trim().toUpperCase()));
      const rev = word.split('').reverse().join('');
      if (set.has(word)) {
        markFound(sorted);
        const el = wordItems.find((w) => w.textContent.trim().toUpperCase() === word);
        if (el) el.classList.add('found');
      } else if (set.has(rev)) {
        markFound(sorted.reverse());
        const el = wordItems.find((w) => w.textContent.trim().toUpperCase() === rev);
        if (el) el.classList.add('found');
      }
    }

    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        if (cell.classList.contains('found')) return;
        const idx = state.selected.indexOf(cell);
        if (idx !== -1) {
          state.selected.splice(idx, 1);
          cell.classList.remove('selected');
          cell.style.background = 'white';
          return;
        }
        state.selected.push(cell);
        cell.classList.add('selected');
        cell.style.background = '#fffacd';
        if (state.selected.length > 1) {
          const rows = state.selected.map((c) => Number(c.dataset.row));
          const colsArr = state.selected.map((c) => Number(c.dataset.col));
          const allSameRow = rows.every((r) => r === rows[0]);
          const allSameCol = colsArr.every((c) => c === colsArr[0]);
          if (!allSameRow && !allSameCol) {
            const last = state.selected.pop();
            last.classList.remove('selected');
            last.style.background = 'white';
            return;
          }
          if (allSameRow) {
            const uniq = [...new Set(colsArr)].sort((a, b) => a - b);
            if (uniq[uniq.length - 1] - uniq[0] + 1 !== uniq.length) {
              const last = state.selected.pop();
              last.classList.remove('selected');
              last.style.background = 'white';
              return;
            }
          }
          if (allSameCol) {
            const uniq = [...new Set(rows)].sort((a, b) => a - b);
            if (uniq[uniq.length - 1] - uniq[0] + 1 !== uniq.length) {
              const last = state.selected.pop();
              last.classList.remove('selected');
              last.style.background = 'white';
              return;
            }
          }
        }
        tryMatch();
      });
    });

    // add clear area
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear selection';
    clearBtn.style.display = 'block';
    clearBtn.style.margin = '8px auto';
    clearBtn.addEventListener('click', clearSelection);
    gridEl.parentElement.appendChild(clearBtn);
  }

  document.querySelectorAll('.grid').forEach((g) => initGrid(g));
})();
