#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { findWordInGrid } from '../apps/games/word-search/lib/generator';

async function validate(filePath: string) {
  const html = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const sections = Array.from(doc.querySelectorAll('.puzzle-section'));
  const report: { sectionIndex: number; missing: string[] }[] = [];

  sections.forEach((section, si) => {
    const words = Array.from(section.querySelectorAll('.word-item')).map(
      (w) => w.textContent?.trim().toUpperCase() || '',
    );
    const cellEls = Array.from(section.querySelectorAll('.grid .cell'));
    const total = cellEls.length;
    if (!total) return;
    // infer cols from grid-template-columns style in style block or attribute
    let cols = 12;
    const grid = section.querySelector('.grid');
    if (grid) {
      const style = dom.window.getComputedStyle(grid as Element);
      const t = style.getPropertyValue('grid-template-columns');
      if (t) cols = t.split(' ').length || cols;
    }
    const rows = Math.ceil(total / cols);
    const matrix: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx < total) row.push(cellEls[idx].textContent?.trim().toUpperCase() || '');
        else row.push('');
      }
      matrix.push(row);
    }

    const missing: string[] = [];
    words.forEach((w) => {
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
  report.forEach((r) =>
    console.error(`Section ${r.sectionIndex}: missing ${r.missing.join(', ')}`),
  );
  process.exit(2);
}

if (require.main === module) {
  const arg =
    process.argv[2] ||
    path.resolve(__dirname, '../apps/games/word-search/word_search_puzzles.html');
  validate(arg).catch((err) => {
    console.error(err);
    process.exit(3);
  });
}
