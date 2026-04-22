const fs = require('fs');
const path = require('path');
const { findWordInGrid } = require('./solver');
const html = fs.readFileSync(
  path.resolve(__dirname, '../apps/games/word-search/word_search_puzzles.html'),
  'utf8',
);

function extractGridHtml() {
  const openTag = '<div class="puzzle-section"';
  let idx = html.indexOf(openTag);
  const sections = [];
  while (idx !== -1) {
    const after = html.slice(idx);
    const splitMarker = '\n        </div>\n\n        <!--';
    let endIdx = after.indexOf(splitMarker);
    if (endIdx === -1) {
      endIdx = after.indexOf('</div>\n    </div>');
      if (endIdx === -1) endIdx = Math.min(after.length, 4000);
    }
    sections.push(after.slice(0, endIdx));
    idx = html.indexOf(openTag, idx + 1);
  }
  return sections;
}

function extractWords(sectionHtml) {
  const re = /<div[^>]*class="word-item"[^>]*>([^<]+)<\/div>/gi;
  const words = [];
  let m;
  while ((m = re.exec(sectionHtml)) !== null) words.push(m[1].trim().toUpperCase());
  return words;
}
function extractCells(sectionHtml) {
  const re = /<div[^>]*class="cell"[^>]*>([^<]*)<\/div>/gi;
  const cells = [];
  let m;
  while ((m = re.exec(sectionHtml)) !== null) cells.push((m[1] || '').trim().toUpperCase());
  return cells;
}

const sections = extractGridHtml();
for (let i = 0; i < sections.length; i++) {
  const sec = sections[i];
  const words = extractWords(sec);
  const cells = extractCells(sec);
  const cols = 12;
  const rows = Math.ceil(cells.length / cols);
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      row.push(idx < cells.length ? cells[idx] : '');
    }
    matrix.push(row);
  }
  console.log('Section', i, 'words', words.join(','));
  console.log('matrix rows', rows, 'cols', cols);
  // dump matrix
  for (let r = 0; r < matrix.length; r++) console.log(matrix[r].join(' '));
  const target = 'SUIT';
  const placements = findWordInGrid(matrix, target);
  console.log('Placements for', target, placements);
}
