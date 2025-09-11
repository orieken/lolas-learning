import type { GamePlugin, CoreAPI } from '@lolas/core-sdk';
import { mountOddOneOut } from '@lolas/core-sdk';
import { makeWordSets, type WordLine } from './generator';

export const plugin: GamePlugin = {
  id: 'word-detective',
  title: 'Word Detective',
  async mount(el: HTMLElement, core: CoreAPI) {
    const total = 10;
    const wordLines = makeWordSets({ lines: total, seed: 13 });
    const lines = wordLines.map((ln: WordLine) => ({ items: ln.items, errorIndex: ln.oddIndex }));
    mountOddOneOut<string>({
      el,
      core,
      gameId: 'word-detective',
      total,
      lines,
      formatItem: (w: string) => String(w),
      instructions:
        'In each row one word does not rhyme with the others. Tap the odd word out to continue.',
    });
  },
};
