import type { PrintableDef } from '@lolas/core-sdk';

class PrintRegistry {
  private map = new Map<string, PrintableDef>();

  register(def: PrintableDef) {
    if (!def?.id || !def?.title || typeof def.makePdf !== 'function') {
      throw new Error('Invalid printable definition');
    }
    this.map.set(def.id, def);
  }

  unregister(id: string) {
    this.map.delete(id);
  }

  get(id: string) {
    return this.map.get(id);
  }

  getAll() {
    return Array.from(this.map.values());
  }

  async generate(id: string): Promise<Blob> {
    const def = this.map.get(id);
    if (!def) throw new Error(`Printable not found: ${id}`);
    const result = await def.makePdf();
    if (result instanceof Blob) return result;
    // Fallback: build a placeholder PDF-like Blob so downloads work in dev
    const content = `Printable: ${def.title}`;
    return new Blob([content], { type: 'application/pdf' });
  }
}

export const printRegistry = new PrintRegistry();

export function registerDefaultPrintables() {
  // Minimal placeholder printable; games can register richer ones at runtime
  printRegistry.register({
    id: 'detective-stars-sheet',
    title: 'Detective Stars Sheet',
    makePdf: () => new Blob([`Detective Stars Sheet`], { type: 'application/pdf' }),
  });
}
