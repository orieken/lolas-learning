#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { findWordInGrid } = require('./solver');

function extractBetween(text, startTag, endTag) {
  const s = text.indexOf(startTag);
  if (s === -1) return [];
  const section = text.slice(s);
  const parts = section.split(endTag)[0];
  return [parts, section.slice(parts.length + endTag.length)];
}

function parseHTMLFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  // naive parse: split into puzzle-section blocks
  const sections = [];
  const openTag = '<div class="puzzle-section"';
  let idx = 0;
  while (true) {
    const start = html.indexOf(openTag, idx);
    if (start === -1) break;
    const after = html.slice(start);
    const splitMarker = '\n        </div>\n\n        <!--';
    let endIdx = after.indexOf(splitMarker);
    if (endIdx === -1) {
      endIdx = after.indexOf('</div>\n    </div>');
      if (endIdx === -1) endIdx = Math.min(after.length, 4000);
    }
    const sectionHtml = after.slice(0, endIdx);
    sections.push(sectionHtml);
    idx = start + endIdx;
  }
  if (sections.length === 0) {
    const parts = html.split('<div class="puzzle-section"');
    for (let i = 1; i < parts.length; i++) sections.push(parts[i]);
  }
  return sections;
}

function extractWords(sectionHtml) {
  const words = [];
  const re = /<div[^>]*class=\"word-item\"[^>]*>([^<]+)<\/div>/gi;
  let m;
  while ((m = re.exec(sectionHtml)) !== null) {
    words.push(m[1].trim().toUpperCase());
  }
  return words;
}

function extractGrid(sectionHtml) {
  const cells = [];
  const re = /<div[^>]*class=\"cell\"[^>]*>([^<]*)<\/div>/gi;
  let m;
  while ((m = re.exec(sectionHtml)) !== null) {
    cells.push((m[1] || '').trim().toUpperCase());
  }
  return cells;
}

function validate(filePath) {
  const sections = parseHTMLFile(filePath);
  const report = [];
  sections.forEach((sec, si) => {
    const words = extractWords(sec);
    const cells = extractGrid(sec);
    if (cells.length === 0) return;
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

    const missing = [];
    words.forEach(w => {
      if (!w) return;
      const placements = findWordInGrid(matrix, w);
      if (placements.length === 0) missing.push(w);
    });
    if (missing.length) report.push({ sectionIndex: si, missing });
  });

  if (report.length === 0) {
    console.log('All words found in puzzles ✅');
    process.exit(0);
  }
  console.error('Missing words in puzzles:');
  report.forEach(r => console.error(`Section ${r.sectionIndex}: missing ${r.missing.join(', ')}`));
  process.exit(2);
}

if (require.main === module) {
  const arg = process.argv[2] || path.resolve(__dirname, '../apps/games/word-search/word_search_puzzles.html');
  validate(arg);
}
