import { describe, it, expect, beforeEach } from 'vitest';
import { printRegistry } from '../service';

function makeBlob(text: string) {
  return new Blob([text], { type: 'application/pdf' });
}

describe('printRegistry', () => {
  beforeEach(() => {
    // reset internal state by unregistering known ids
    for (const p of printRegistry.getAll()) {
      printRegistry.unregister(p.id);
    }
  });

  it('registers and lists printables', () => {
    printRegistry.register({ id: 'a', title: 'A', makePdf: () => {} });
    printRegistry.register({ id: 'b', title: 'B', makePdf: () => {} });
    const all = printRegistry.getAll();
    expect(all.map((p) => p.id).sort()).toEqual(['a', 'b']);
  });

  it('generates a Blob using definition makePdf when provided', async () => {
    printRegistry.register({ id: 'c', title: 'C', makePdf: () => makeBlob('C') });
    const blob = await printRegistry.generate('c');
    expect(blob).toBeInstanceOf(Blob);
  });

  it('falls back to placeholder Blob when makePdf returns void', async () => {
    printRegistry.register({ id: 'd', title: 'D', makePdf: () => {} });
    const blob = await printRegistry.generate('d');
    expect(blob).toBeInstanceOf(Blob);
  });

  it('throws on unknown id', async () => {
    await expect(printRegistry.generate('nope')).rejects.toThrow(/not found/i);
  });
});
