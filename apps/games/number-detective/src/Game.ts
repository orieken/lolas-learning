import type { GamePlugin, CoreAPI } from '@lolas/core-sdk';
import { mountOddOneOut } from '@lolas/core-sdk';
import { makeNumberLines } from './generator';

export const plugin: GamePlugin = {
  id: 'number-detective',
  title: 'Number Detective',
  async mount(el: HTMLElement, core: CoreAPI) {
    const total = 10;
    const lines = makeNumberLines([1, 20], { lines: total, seed: 7 });
    mountOddOneOut<number>({
      el,
      core,
      gameId: 'number-detective',
      total,
      lines,
      formatItem: (n) => String(n),
      instructions: 'Find the number that breaks the pattern in each row. Tap it to move on. Solve all rows to finish.',
    });
  },
  async unmount() {
    // no-op for now
  },
};
